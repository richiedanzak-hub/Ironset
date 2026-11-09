/* Call of the Wild — the part that listens.

   Turns a recording into notes, then measures the things a caller actually
   controls: how many notes, how long each one is, how evenly they are spaced,
   which way the pitch and the volume move across the call, whether each note
   stops clean, and the shape of the pitch inside a note (a goose honk's break
   up, a turkey yelp's drop, a bugle's climb). Those measurements are scored
   against what the call is supposed to be (the targets live in calls.js) and
   the worst misses become plain-language tips.

   It does not decide whether an animal would answer — nobody has the data to
   score that. It says how close the pattern is to the one hunters are taught.

   No DOM, no network: this one file runs in the page and under Node for the
   tests, so what is tested is exactly what ships. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.CallAnalysis = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var RATE = 16000;   // everything is analysed at 16 kHz: plenty for any call's pitch, cheap on a phone
  var HOP = 0.005;    // envelope hop (s)
  var WIN = 0.02;     // envelope window (s)
  var PHOP = 0.01;    // pitch hop (s)

  /* ------------------------------------------------------------------ */
  /* Small DSP toolkit                                                    */
  /* ------------------------------------------------------------------ */

  function biquad(type, f, sr, q) {
    var w = 2 * Math.PI * Math.min(f, sr * 0.49) / sr, cs = Math.cos(w), sn = Math.sin(w), al = sn / (2 * q);
    var a0 = 1 + al, b0, b1, b2;
    if (type === "lp") { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = (1 - cs) / 2; }
    else { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = (1 + cs) / 2; }
    return [b0 / a0, b1 / a0, b2 / a0, (-2 * cs) / a0, (1 - al) / a0];
  }

  function runBiquad(x, c) {
    var y = new Float32Array(x.length), x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (var i = 0; i < x.length; i++) {
      var xi = x[i], v = c[0] * xi + c[1] * x1 + c[2] * x2 - c[3] * y1 - c[4] * y2;
      x2 = x1; x1 = xi; y2 = y1; y1 = v; y[i] = v;
    }
    return y;
  }

  function lowpass4(x, f, sr) {
    return runBiquad(runBiquad(x, biquad("lp", f, sr, 0.5412)), biquad("lp", f, sr, 1.3066));
  }

  function highpass2(x, f, sr) { return runBiquad(x, biquad("hp", f, sr, Math.SQRT1_2)); }

  /* Mono float samples at any rate -> RATE. Anti-alias first when going down. */
  function resample(x, from, to) {
    if (from === to) return Float32Array.from(x);
    var src = from > to ? lowpass4(x, to * 0.45, from) : x;
    var n = Math.floor(x.length * to / from), y = new Float32Array(n), r = from / to, last = src.length - 1;
    for (var i = 0; i < n; i++) {
      var p = i * r, j = Math.floor(p), fr = p - j;
      var a = src[j > last ? last : j], b = src[j + 1 > last ? last : j + 1];
      y[i] = a + (b - a) * fr;
    }
    return y;
  }

  /* In-place radix-2 FFT. */
  function fft(re, im) {
    var n = re.length, i, j, len, t;
    for (i = 1, j = 0; i < n; i++) {
      var bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (len = 2; len <= n; len <<= 1) {
      var ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang), half = len >> 1;
      for (i = 0; i < n; i += len) {
        var cr = 1, ci = 0;
        for (j = 0; j < half; j++) {
          var a = i + j, b = a + half;
          var vr = re[b] * cr - im[b] * ci, vi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - vr; im[b] = im[a] - vi;
          re[a] += vr; im[a] += vi;
          var nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
        }
      }
    }
  }

  var hannCache = {};
  function hann(n) {
    if (hannCache[n]) return hannCache[n];
    var w = new Float32Array(n);
    for (var i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (n - 1));
    return (hannCache[n] = w);
  }

  /* ------------------------------------------------------------------ */
  /* Statistics                                                           */
  /* ------------------------------------------------------------------ */

  function sorted(a) { return Array.prototype.slice.call(a).sort(function (p, q) { return p - q; }); }
  function pct(a, p) {
    if (!a.length) return NaN;
    var s = sorted(a), k = (s.length - 1) * p, lo = Math.floor(k), hi = Math.ceil(k);
    return s[lo] + (s[hi] - s[lo]) * (k - lo);
  }
  function median(a) { return pct(a, 0.5); }
  /* The median of `vals` (zeros skipped) with each one counted by its weight —
     so a long note counts for more than a click. */
  function wmedian(vals, ws) {
    var a = [], tot = 0, acc = 0, i;
    for (i = 0; i < vals.length; i++) if (vals[i] > 0) { a.push([vals[i], ws[i]]); tot += ws[i]; }
    if (!a.length) return 0;
    a.sort(function (p, q) { return p[0] - q[0]; });
    for (i = 0; i < a.length; i++) { acc += a[i][1]; if (acc >= tot / 2) return a[i][0]; }
    return a[a.length - 1][0];
  }
  function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return a.length ? s / a.length : NaN; }
  function sd(a) {
    if (a.length < 2) return 0;
    var m = mean(a), s = 0;
    for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m);
    return Math.sqrt(s / (a.length - 1));
  }
  /* Theil–Sen slope: the median of all pairwise slopes. One stray note (an
     octave slip, a cough) cannot drag it the way it drags least squares. */
  function tsSlope(xs, ys) {
    var s = [];
    for (var i = 0; i < xs.length; i++)
      for (var j = i + 1; j < xs.length; j++)
        if (xs[j] !== xs[i]) s.push((ys[j] - ys[i]) / (xs[j] - xs[i]));
    return s.length ? median(s) : 0;
  }
  function st(f, ref) { return 12 * Math.log(f / ref) / Math.LN2; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function round(v, d) { var k = Math.pow(10, d || 0); return Math.round(v * k) / k; }

  /* 1 inside [lo, hi]; outside it falls to 0.5 at `soft` away and is near
     nothing by twice that. (It used to fall off gently enough that a call
     well outside its range still collected most of the credit — too generous,
     by the account of the first hunters to try it.) */
  function band(x, lo, hi, soft) {
    if (!(x === x)) return 0;
    var d = x < lo ? lo - x : x > hi ? x - hi : 0;
    if (!d) return 1;
    var r = d / (soft || 1);
    return Math.exp(-0.6931 * r * r);
  }

  /* ------------------------------------------------------------------ */
  /* Envelope and notes                                                   */
  /* ------------------------------------------------------------------ */

  function envelope(x) {
    var hop = Math.round(HOP * RATE), win = Math.round(WIN * RATE);
    var n = x.length >= win ? Math.floor((x.length - win) / hop) + 1 : 0;
    var cs = new Float64Array(x.length + 1), i;
    for (i = 0; i < x.length; i++) cs[i + 1] = cs[i] + x[i] * x[i];
    var raw = new Float32Array(n);
    for (var k = 0; k < n; k++) {
      var a = k * hop;
      raw[k] = 10 * Math.log10((cs[a + win] - cs[a]) / win + 1e-10);
    }
    var db = new Float32Array(n);
    for (k = 0; k < n; k++) db[k] = (raw[k > 0 ? k - 1 : 0] + raw[k] + raw[k < n - 1 ? k + 1 : k]) / 3;
    return db;
  }
  function frameTime(k) { return k * HOP + WIN / 2; }

  /* A dip of `depth` dB that recovers by `depth` dB is a gap between two notes,
     even when the sound never falls all the way back to silence — which is what
     a fast feeding chuckle or a turkey cutt does. */
  function valleyCuts(e, s, t, depth) {
    var cuts = [], peak = e[s], valley = Infinity, vi = -1, falling = false;
    for (var i = s + 1; i <= t; i++) {
      var v = e[i];
      if (!falling) {
        if (v > peak) peak = v;
        else if (v < peak - depth) { falling = true; valley = v; vi = i; }
      } else if (v < valley) { valley = v; vi = i; }
      else if (v > valley + depth) { cuts.push(vi); falling = false; peak = v; }
    }
    return cuts;
  }

  function findNotes(e, floor, top, spec) {
    var range = top - floor;
    var on = floor + Math.max(9, 0.33 * range), off = floor + Math.max(6, 0.22 * range);
    var segs = [], inside = false, s = 0, k;
    for (k = 0; k < e.length; k++) {
      if (!inside && e[k] >= on) {
        s = k;
        while (s > 0 && e[s - 1] >= off && (segs.length === 0 || s - 1 > segs[segs.length - 1][1])) s--;
        inside = true;
      } else if (inside && e[k] < off) {
        segs.push([s, k - 1]); inside = false;
      }
    }
    if (inside) segs.push([s, e.length - 1]);

    // bridge flickers: two pieces a whisker apart are one note. Long calls that
    // dip in the middle (a bugle stepping up into its whistle, a howl taking a
    // breath of tone) bridge wider gaps, set per call.
    var bridge = spec.bridge || 0.012, merged = [];
    for (k = 0; k < segs.length; k++) {
      var last = merged[merged.length - 1];
      if (last && (segs[k][0] - last[1]) * HOP < bridge) last[1] = segs[k][1];
      else merged.push(segs[k].slice());
    }

    // split at valleys
    var split = spec.split === undefined ? 6 : spec.split, pieces = [];
    for (k = 0; k < merged.length; k++) {
      var a = merged[k][0], b = merged[k][1];
      var cuts = split ? valleyCuts(e, a, b, split) : [];
      var start = a;
      for (var c = 0; c < cuts.length; c++) { pieces.push([start, cuts[c] - 1]); start = cuts[c]; }
      pieces.push([start, b]);
    }

    var minDur = spec.minNote || 0.03, notes = [];
    for (k = 0; k < pieces.length; k++) {
      var p0 = pieces[k][0], p1 = pieces[k][1], pk = -Infinity, pi = p0;
      for (var j = p0; j <= p1; j++) if (e[j] > pk) { pk = e[j]; pi = j; }
      // the 20 ms window sees a note a little before it starts and after it
      // stops; trimming to just inside the window centres lands close to the truth
      var t0 = frameTime(p0) + 0.005, t1 = frameTime(p1) - 0.005, dur = t1 - t0;
      if (dur < minDur || pk < on + 1 || pk < top - 32) continue;
      notes.push({ k0: p0, k1: p1, kp: pi, t0: Math.max(0, t0), t1: t1, dur: dur, peak: pk });
    }
    return { notes: notes, on: on, off: off };
  }

  /* ------------------------------------------------------------------ */
  /* Pitch (YIN)                                                          */
  /* ------------------------------------------------------------------ */

  function yin(x, start, W, tauMin, tauMax, d, dn) {
    if (start < 0 || start + W + tauMax >= x.length) return null;
    var tau, j;
    for (tau = 1; tau <= tauMax; tau++) {
      var s = 0, o = start + tau;
      for (j = 0; j < W; j++) { var df = x[start + j] - x[o + j]; s += df * df; }
      d[tau] = s;
    }
    var run = 0; dn[0] = 1;
    for (tau = 1; tau <= tauMax; tau++) { run += d[tau]; dn[tau] = run > 0 ? d[tau] * tau / run : 1; }
    var best = -1;
    for (tau = tauMin; tau <= tauMax; tau++) {
      if (dn[tau] < 0.2) {
        while (tau < tauMax && dn[tau + 1] < dn[tau]) tau++;
        best = tau; break;
      }
    }
    if (best < 0) {
      var bv = Infinity;
      for (tau = tauMin; tau <= tauMax; tau++) if (dn[tau] < bv) { bv = dn[tau]; best = tau; }
    }
    // a best guess pinned to the edge of the search range is not a pitch, it is the range
    if (best <= tauMin || best >= tauMax) return { f0: RATE / best, ap: 1 };
    var t = best;
    if (best > tauMin && best < tauMax) {
      var a = dn[best - 1], b = dn[best], c = dn[best + 1], den = a - 2 * b + c;
      if (den > 0) t = best + 0.5 * (a - c) / den;
    }
    return { f0: RATE / t, ap: dn[best] };
  }

  /* ------------------------------------------------------------------ */
  /* One note                                                             */
  /* ------------------------------------------------------------------ */

  function describeNote(x, e, note, spec, floor) {
    var lo = spec.pitch[0], hi = spec.pitch[1];
    var W = Math.round(clamp(2.5 / lo, 0.022, 0.045) * RATE);
    var tauMin = Math.max(2, Math.floor(RATE / hi)), tauMax = Math.ceil(RATE / lo);
    var d = new Float32Array(tauMax + 2), dn = new Float32Array(tauMax + 2);
    var track = [], t, i;
    var tEnd = Math.max(note.t0 + 0.0001, note.t1 - W / RATE);
    for (t = note.t0; t <= tEnd; t += PHOP) {
      var r = yin(x, Math.round(t * RATE), W, tauMin, tauMax, d, dn);
      if (!r) continue;
      track.push({ t: t + W / RATE / 2, f0: r.ap < 0.35 ? r.f0 : 0, ap: r.ap });
    }
    var voiced = track.filter(function (p) { return p.f0 > 0; });
    // An octave slip is a measuring error, not the caller's, so fold it back —
    // but only a slip that stands alone. A run of frames an octave away is a
    // real jump (a goose honk's break, a bugle's climb) and must survive.
    var fixed = voiced.map(function (p, n) {
      var nb = [];
      for (var z = Math.max(0, n - 3); z <= Math.min(voiced.length - 1, n + 3); z++) if (z !== n) nb.push(voiced[z].f0);
      if (nb.length < 3) return p.f0;
      var loc = median(nb), dv = st(p.f0, loc);
      if (dv > 9 && Math.abs(st(p.f0 / 2, loc)) < 3) return p.f0 / 2;
      if (dv < -9 && Math.abs(st(p.f0 * 2, loc)) < 3) return p.f0 * 2;
      return p.f0;
    });
    voiced.forEach(function (p, n) { p.f0 = fixed[n]; });
    // and a single-frame spike is noise: 3-point median over the path
    var sm3 = voiced.map(function (p, n) {
      if (n === 0 || n === voiced.length - 1) return p.f0;
      return median([voiced[n - 1].f0, p.f0, voiced[n + 1].f0]);
    });
    voiced.forEach(function (p, n) { p.f0 = sm3[n]; });
    var f0 = voiced.length ? median(voiced.map(function (p) { return p.f0; })) : 0;

    // brightness, for notes too rough to hold a pitch
    // and purity: how much of the sound sits in its one strongest peak. A
    // clean whistle or hoot puts nearly all of it there; a raspy quack, a growl
    // or a caw spreads it over many. It reads the spectrum, not the pitch, so it
    // holds up on fast, high whistles that the pitch tracker cannot follow.
    var N = 512, re = new Float32Array(N), im = new Float32Array(N), w = hann(N), cents = [], flats = [], pures = [], pk = new Float32Array(N / 2);
    var bin = RATE / N, kLo = Math.max(1, Math.floor(150 / bin)), kHi = Math.min(N / 2 - 1, Math.floor(6000 / bin));
    for (t = note.t0; t + N / RATE <= note.t1 + 0.012; t += 0.02) {
      var s0 = Math.round(t * RATE);
      if (s0 + N > x.length) break;
      for (i = 0; i < N; i++) { re[i] = x[s0 + i] * w[i]; im[i] = 0; }
      fft(re, im);
      var num = 0, den = 0, lg = 0, cnt = 0, kMax = kLo;
      for (var k = kLo; k <= kHi; k++) {
        var pw = re[k] * re[k] + im[k] * im[k] + 1e-12;
        pk[k] = pw; if (pw > pk[kMax]) kMax = k;
        num += pw * k * bin; den += pw; lg += Math.log(pw); cnt++;
      }
      if (den > 0) {
        var near = 0;
        for (k = Math.max(kLo, kMax - 2); k <= Math.min(kHi, kMax + 2); k++) near += pk[k];
        cents.push(num / den); flats.push(Math.exp(lg / cnt) / (den / cnt)); pures.push(near / den);
      }
    }

    // the pitch path inside the note, in half-steps from its own median
    var path = voiced.map(function (p) { return { t: p.t - note.t0, s: st(p.f0, f0) }; });
    var third = Math.max(1, Math.floor(path.length / 3));
    var head = path.slice(0, third).map(function (p) { return p.s; });
    var tail = path.slice(-third).map(function (p) { return p.s; });
    var jumpUp = 0, jumpDown = 0;
    for (i = 0; i < path.length; i++) {
      for (var q = i + 1; q < path.length && path[q].t - path[i].t <= 0.045; q++) {
        var dv2 = path[q].s - path[i].s;
        if (dv2 > jumpUp) jumpUp = dv2;
        if (-dv2 > jumpDown) jumpDown = -dv2;
      }
    }
    var peakAt = -1, peakS = -Infinity;
    for (i = 0; i < path.length; i++) if (path[i].s > peakS) { peakS = path[i].s; peakAt = i; }
    // the very start and end of the note (first and last 15%), for shapes that climb and drop
    var edge = Math.max(1, Math.round(path.length * 0.15));
    var startS = path.length ? median(path.slice(0, edge).map(function (p) { return p.s; })) : 0;
    var endS = path.length ? median(path.slice(-edge).map(function (p) { return p.s; })) : 0;
    // a squeak is a second, higher plateau inside a note that should hold one
    // pitch: at least 40 ms above and 40 ms below a 5-half-step split. An exact
    // octave is more likely the pitch tracker slipping than the caller.
    var squeak = false;
    if (path.length >= 8) {
      var sv = path.map(function (p) { return p.s; }), p10 = pct(sv, 0.1), p90 = pct(sv, 0.9);
      if (p90 - p10 >= 5 && Math.abs(p90 - p10 - 12) > 1.5) {
        var mid = (p10 + p90) / 2, above = 0, below = 0;
        for (i = 0; i < path.length; i++) if (path[i].s > mid) above++; else below++;
        squeak = above * PHOP >= 0.04 && below * PHOP >= 0.04;
      }
    }
    var trendSlope = path.length > 3 ? tsSlope(path.map(function (p) { return p.t; }), path.map(function (p) { return p.s; })) : 0;
    var resid = path.map(function (p) { return p.s - trendSlope * p.t; });

    // wobble: how much the pitch shakes around its own slow line (a rabbit's
    // distress cry wavers; a hen's quack should not)
    var wob = 0;
    if (path.length > 6) {
      var sm = [], dev = [];
      for (i = 0; i < path.length; i++) {
        var lo2 = Math.max(0, i - 4), hi2 = Math.min(path.length - 1, i + 4), acc = 0;
        for (var z = lo2; z <= hi2; z++) acc += path[z].s;
        sm.push(acc / (hi2 - lo2 + 1));
      }
      for (i = 0; i < path.length; i++) dev.push(path[i].s - sm[i]);
      wob = sd(dev);
    }

    // stops: how fast the sound dies after its last strong moment
    var k1 = note.k1, kp = note.kp, lastStrong = kp;
    for (i = kp; i <= k1; i++) if (e[i] >= note.peak - 4) lastStrong = i;
    var release = (k1 - lastStrong) * HOP + WIN / 2;
    // a 14 dB drop: a clean stop falls that far at once, while a room's echo
    // can hold the last few dB of a fade for a tenth of a second or more
    var stopTo = Math.max(floor + 4, note.peak - 14);
    for (i = lastStrong; i < e.length && i <= k1 + Math.round(0.25 / HOP); i++) {
      if (e[i] <= stopTo) { release = (i - lastStrong) * HOP; break; }
    }
    var attack = (kp - note.k0) * HOP;

    // rolling: amplitude flutter 12-45 Hz (a turkey purr, a growl)
    var roll = 0, rollHz = 0;
    if (note.dur > 0.25) {
      var fh = Math.round(0.0025 * RATE), fw = Math.round(0.006 * RATE), amp = [];
      for (var s1 = Math.round(note.t0 * RATE); s1 + fw < Math.round(note.t1 * RATE) && s1 + fw < x.length; s1 += fh) {
        var ac = 0;
        for (i = 0; i < fw; i++) ac += x[s1 + i] * x[s1 + i];
        amp.push(Math.sqrt(ac / fw));
      }
      if (amp.length > 40) {
        var m0 = mean(amp), sm2 = [];
        // remove the slow swell so only the flutter is left
        for (i = 0; i < amp.length; i++) {
          var a2 = Math.max(0, i - 16), b2 = Math.min(amp.length - 1, i + 16), acc2 = 0;
          for (var y2 = a2; y2 <= b2; y2++) acc2 += amp[y2];
          sm2.push(amp[i] - acc2 / (b2 - a2 + 1));
        }
        var e0 = 0;
        for (i = 0; i < sm2.length; i++) e0 += sm2[i] * sm2[i];
        var best = 0, bestLag = 0;
        for (var lag = Math.round(1 / 45 / 0.0025); lag <= Math.round(1 / 12 / 0.0025); lag++) {
          var acr = 0;
          for (i = 0; i + lag < sm2.length; i++) acr += sm2[i] * sm2[i + lag];
          var nrm = e0 > 0 ? acr / e0 : 0;
          if (nrm > best) { best = nrm; bestLag = lag; }
        }
        var depthAmp = sd(sm2) / (m0 || 1);
        roll = best * clamp(depthAmp * 3, 0, 1);
        rollHz = bestLag ? 1 / (bestLag * 0.0025) : 0;
      }
    }

    return {
      t0: round(note.t0, 3), t1: round(note.t1, 3), dur: round(note.dur, 3),
      peak: note.peak, f0: f0 ? round(f0, 1) : 0,
      voiced: track.length ? voiced.length / track.length : 0,
      centroid: cents.length ? median(cents) : 0,
      flat: flats.length ? median(flats) : 0,
      pure: pures.length ? median(pures) : 0,
      head: head.length ? median(head) : 0, tail: tail.length ? median(tail) : 0,
      start: startS, end: endS, squeak: squeak,
      jumpUp: round(jumpUp, 2), jumpDown: round(jumpDown, 2),
      peakPos: path.length ? peakAt / Math.max(1, path.length - 1) : 0.5,
      peakS: path.length ? peakS : 0,
      span: path.length ? pct(path.map(function (p) { return p.s; }), 0.9) - pct(path.map(function (p) { return p.s; }), 0.1) : 0,
      slope: round(trendSlope, 2), wobble: round(wob, 2), steadySd: round(sd(resid), 2),
      release: round(release, 3), attack: round(attack, 3),
      roll: round(roll, 3), rollHz: round(rollHz, 1),
      path: path.filter(function (p, n) { return n % 2 === 0; }).map(function (p) { return [round(p.t, 3), round(p.s, 2)]; })
    };
  }

  /* ------------------------------------------------------------------ */
  /* The call as a whole                                                  */
  /* ------------------------------------------------------------------ */

  function groupNotes(notes, gap) {
    var groups = [], cur = [];
    for (var i = 0; i < notes.length; i++) {
      if (cur.length && notes[i].t0 - cur[cur.length - 1].t1 > gap) { groups.push(cur); cur = []; }
      cur.push(notes[i]);
    }
    if (cur.length) groups.push(cur);
    return groups;
  }

  function measureGroup(notes, spec) {
    var n = notes.length, i;
    var on = notes.map(function (q) { return q.t0; });
    var iois = [], gaps = [];
    for (i = 1; i < n; i++) { iois.push(on[i] - on[i - 1]); gaps.push(notes[i].t0 - notes[i - 1].t1); }
    var durs = notes.map(function (q) { return q.dur; });
    var span = n ? notes[n - 1].t1 - notes[0].t0 : 0;
    var rate = n > 1 ? (n - 1) / (on[n - 1] - on[0]) : 0;
    var half = Math.floor(iois.length / 2);
    var ioiFirst = half ? mean(iois.slice(0, half)) : NaN, ioiLast = half ? mean(iois.slice(iois.length - half)) : NaN;

    // Pitch across notes: a real pitch where the notes clearly hold one (a
    // whistle, a yelp, a hoot), brightness where they are too rough to. A hen's
    // raspy quacks hold no steady pitch — a tracker reads a different one off
    // each rasp — but her greeting call falls in brightness note by note, and
    // that is the fall a hunter hears.
    var pitched = notes.filter(function (q) { return q.f0 > 0 && q.voiced >= 0.3; });
    var clear = median(notes.map(function (q) { return q.voiced; })) >= 0.5;
    var usePitch = clear && pitched.length >= Math.max(2, Math.ceil(n * 0.6));
    var mid = pitched.length ? st(median(pitched.map(function (q) { return q.f0; })), 100) : 0;
    var idx = [], lev = [];
    for (i = 0; i < n; i++) {
      var q = notes[i];
      if (usePitch) {
        if (q.f0 > 0 && q.voiced >= 0.3) {
          // a whole note read an octave off from its neighbours is the tracker, not the caller
          var lv = st(q.f0, 100), dv = lv - mid;
          if (Math.abs(Math.abs(dv) - 12) <= 2.5) lv -= 12 * Math.sign(dv);
          idx.push(i); lev.push(lv);
        }
      }
      else if (q.centroid > 0) { idx.push(i); lev.push(st(q.centroid, 100)); }
    }
    var pSlope = idx.length >= 2 ? tsSlope(idx, lev) : 0;
    var vSlope = n >= 2 ? tsSlope(notes.map(function (q, k) { return k; }), notes.map(function (q) { return q.peak; })) : 0;
    var third = Math.max(1, Math.round(n / 3));
    var durFirst = mean(durs.slice(0, third)), durLast = mean(durs.slice(n - third));
    var loudest = 0;
    for (i = 1; i < n; i++) if (notes[i].peak > notes[loudest].peak) loudest = i;

    // What the call sounds like as a whole, apart from its timing: how much of
    // it holds a clear pitch (a whistle nearly all, a raspy quack hardly any),
    // where that pitch sits, and how bright it is. Each note counts by its
    // length, so one long note outweighs a click.
    var tot = 0, vSum = 0, pDur = 0;
    notes.forEach(function (q) { tot += q.dur; vSum += q.voiced * q.dur; if (q.f0 > 0 && q.voiced >= 0.3) pDur += q.dur; });

    return {
      voiced: tot ? vSum / tot : 0,
      pitchedFrac: tot ? pDur / tot : 0,
      f0w: wmedian(pitched.map(function (q) { return q.f0; }), pitched.map(function (q) { return q.dur; })),
      cent: wmedian(notes.map(function (q) { return q.centroid; }), durs),
      pure: wmedian(notes.map(function (q) { return q.pure; }), durs),
      flat: wmedian(notes.map(function (q) { return q.flat; }), durs),
      n: n, span: span, rate: rate,
      iois: iois, gaps: gaps, durs: durs,
      cv: iois.length >= 2 ? sd(iois) / mean(iois) : 0,
      ioiChange: half ? (ioiLast - ioiFirst) / mean(iois) : 0,
      pitchBy: usePitch ? "pitch" : "tone",
      levels: lev,
      pitchChange: pSlope * Math.max(1, n - 1),
      volChange: vSlope * Math.max(1, n - 1),
      durRatio: durLast > 0 ? durFirst / durLast : 1,
      meanDur: mean(durs), medDur: median(durs),
      meanGap: gaps.length ? mean(gaps) : 0, minGap: gaps.length ? Math.min.apply(null, gaps) : 0,
      maxGapAt: gaps.length ? gaps.indexOf(Math.max.apply(null, gaps)) : -1,
      maxGap: gaps.length ? Math.max.apply(null, gaps) : 0,
      loudest: loudest,
      f0: pitched.length ? median(pitched.map(function (q) { return q.f0; })) : 0
    };
  }

  /* ------------------------------------------------------------------ */
  /* Scoring                                                              */
  /* ------------------------------------------------------------------ */

  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }
  function range(r, unit) { return r[0] === r[1] ? r[0] + (unit || "") : r[0] + "–" + r[1] + (unit || ""); }
  function ms(s) { return Math.round(s * 1000) + " ms"; }
  function secs(s) { return (Math.round(s * 10) / 10).toFixed(1) + " s"; }
  function steps(v) { var a = Math.abs(v); return a < 0.75 ? "about level" : (Math.round(a * 2) / 2) + " half-step" + (Math.round(a * 2) / 2 === 1 ? "" : "s"); }
  function frac(k, n) { return n ? k / n : 0; }
  function hz(f) { return f >= 1000 ? (Math.round(f / 100) / 10).toFixed(1) + " kHz" : Math.round(f / 10) * 10 + " Hz"; }

  /* Every part returns {score 0-1, value, target, tip}. `p` are the targets
     for this call, `say` the syllable a caller is taught for it. */
  var PARTS = {
    count: function (m, p, say) {
      var r = p.range, n = m.n;
      return {
        label: "Notes", score: band(n, r[0], r[1], p.soft || 1),
        value: String(n), target: range(r),
        tip: n < r[0] ? "You blew " + plural(n, "note") + ". This call wants " + range(r) + " — keep going until you get there." :
          n > r[1] ? "You blew " + plural(n, "note") + ". This call is " + range(r) + " — stop sooner. Too many notes is how ducks learn something is off." : null
      };
    },
    pace: function (m, p, say) {
      var r = p.range, v = m.rate;
      if (m.n < 2) return { label: "Speed", score: 0, value: "—", target: range(r, "/s"), tip: "I only heard one note, so there is no speed to measure yet." };
      return {
        label: "Speed", score: band(v, r[0], r[1], p.soft || r[0] * 0.25),
        value: round(v, 1) + "/s", target: range(r, "/s"),
        tip: v < r[0] ? "Too slow: " + round(v, 1) + " notes a second. Aim for " + range(r) + " — pick it up so the notes run into each other a little less." :
          v > r[1] ? "Too fast: " + round(v, 1) + " notes a second. Aim for " + range(r) + ". Slow down and finish each '" + say + "' before the next." : null
      };
    },
    rhythm: function (m, p, say) {
      if (m.n < 3) return { label: "Rhythm", score: 0, value: "—", target: p.kind, tip: "Blow at least three notes so there is a rhythm to judge." };
      var cv = m.cv, ch = m.ioiChange, s, value, tip = null, target;
      if (p.kind === "even") {
        var lim = p.cv || 0.2;
        // uneven spacing, or a beat that steadily rushes or drags: either one is off
        s = Math.min(band(cv, 0, lim, lim * 0.7), band(Math.abs(ch), 0, p.drift || 0.25, 0.2));
        value = Math.round(cv * 100) + "% uneven"; target = "under " + Math.round(lim * 100) + "%";
        if (s < 0.75) tip = ch < -0.25 ? "Your notes rushed toward the end. Keep the beat steady, like a clock: " + say + "… " + say + "… " + say + "." :
          ch > 0.25 ? "Your notes dragged toward the end. Hold the same beat all the way through." :
          "The spacing between notes jumped around. Tap your foot and put one '" + say + "' on each tap.";
      } else if (p.kind === "speedup") {
        s = band(ch, -9, -(p.min || 0.12), 0.25);
        value = ch < -0.1 ? "speeds up" : ch > 0.1 ? "slows down" : "steady"; target = "speeds up";
        if (s < 0.75) tip = "Let it roll faster as it goes — the first notes slow and drawn out, the last ones quick.";
      } else if (p.kind === "slowdown") {
        s = band(ch, p.min || 0.12, 9, 0.25);
        value = ch < -0.1 ? "speeds up" : ch > 0.1 ? "slows down" : "steady"; target = "slows down";
        if (s < 0.75) tip = "Start fast and let the notes spread out toward the end.";
      } else if (p.kind === "erratic") {
        s = band(cv, p.cv || 0.28, 9, 0.12);
        value = Math.round(cv * 100) + "% uneven"; target = "over " + Math.round((p.cv || 0.28) * 100) + "%";
        if (s < 0.75) tip = "Too tidy. A real one is excited and broken up — bunch some notes together and leave gaps between others.";
      } else { s = 1; value = "—"; target = "—"; }
      return { label: "Rhythm", score: s, value: value, target: target, tip: tip };
    },
    length: function (m, p, say) {
      var r = p.range, durs = m.durs, ok = 0, short = 0, long = 0;
      durs.forEach(function (d) { if (d < r[0] * 0.85) short++; else if (d > r[1] * 1.15) long++; else ok++; });
      var s = mean(durs.map(function (d) { return band(d, r[0], r[1], (r[1] - r[0]) * 0.6 + 0.03); }));
      return {
        label: "Note length", score: s,
        value: ms(m.medDur), target: Math.round(r[0] * 1000) + "–" + ms(r[1]),
        tip: short > long && short > ok * 0.5 ? "Your notes are clipped short (" + ms(m.medDur) + "). Hold each one a touch longer — " + Math.round(r[0] * 1000) + "–" + ms(r[1]) + "." :
          long > short && long > ok * 0.5 ? "Your notes are dragging (" + ms(m.medDur) + " each). Cut them shorter — " + Math.round(r[0] * 1000) + "–" + ms(r[1]) + "." : null
      };
    },
    taper: function (m, p, say) {
      // the first notes long, the last ones short (hail call)
      var need = p.ratio || 1.4, v = m.durRatio;
      return {
        label: "Long start", score: m.n < 3 ? 0 : band(v, need, 99, 0.35),
        value: "×" + round(v, 1), target: "×" + need + "+",
        tip: m.n >= 3 && v < need ? "Draw the first two or three notes out long, then let the rest get shorter and quicker." : null
      };
    },
    pitch: function (m, p, say) {
      var v = m.pitchChange, r = p.range || [1, 8], soft = p.soft || 1.5, s, tip = null, value = v < -0.75 ? "falls " + steps(v) : v > 0.75 ? "rises " + steps(v) : "level";
      // judged by brightness, which moves about twice as far as the pitch does
      if (m.pitchBy !== "pitch") { r = [r[0], r[1] * 2]; soft = soft * 1.5; }
      var by = m.pitchBy === "pitch" ? "" : " (judged by brightness — a raspy call has no clean pitch to follow)";
      if (m.n < 2) return { label: "Pitch", score: 0, value: "—", target: "", tip: null };
      if (p.dir === "down") {
        s = band(-v, r[0], r[1], soft);
        if (s < 0.75) tip = -v < r[0] ? (v > 0.75 ? "Your pitch climbed across the call" : "Your pitch stayed flat") + by + ". Start high and let each note step a little lower." :
          "Your pitch fell off a cliff — it dropped " + steps(v) + ". Step down gradually instead of all at once.";
        return { label: "Pitch", score: s, value: value, target: "falls " + range(r), tip: tip };
      }
      if (p.dir === "up") {
        s = band(v, r[0], r[1], 1.5);
        if (s < 0.75) tip = "Your pitch should climb across the call" + by + ".";
        return { label: "Pitch", score: s, value: value, target: "rises " + range(r), tip: tip };
      }
      s = band(Math.abs(v), 0, r[1] || 2, 1.5);
      if (s < 0.75) tip = "Keep every note on the same pitch" + by + " — it " + (v > 0 ? "rose " : "fell ") + steps(v) + ".";
      return { label: "Pitch", score: s, value: value, target: "level", tip: tip };
    },
    volume: function (m, p, say) {
      var v = m.volChange, s, tip = null, value = v < -2 ? "fades " + Math.round(-v) + " dB" : v > 2 ? "grows " + Math.round(v) + " dB" : "level";
      if (m.n < 2) return { label: "Volume", score: 0, value: "—", target: "", tip: null };
      if (p.dir === "down") {
        s = band(-v, p.min || 3, 40, 3);
        if (s < 0.75) tip = "Start loud and let each note come down in volume — ease off the air as you go.";
        return { label: "Volume", score: s, value: value, target: "fades", tip: tip };
      }
      if (p.dir === "firstloud") {
        var first = m.loudest <= 1;
        s = first ? 1 : 0.35;
        if (!first) tip = "Hit the first note hardest — it is the one that grabs their attention.";
        return { label: "Volume", score: s, value: first ? "loud start" : "loudest at note " + (m.loudest + 1), target: "loud start", tip: tip };
      }
      s = band(Math.abs(v), 0, p.max || 6, 3);
      if (s < 0.75) tip = "Keep the volume even from first note to last.";
      return { label: "Volume", score: s, value: value, target: "even", tip: tip };
    },
    crisp: function (m, p, say, notes) {
      var lim = p.max || 0.06, ok = notes.filter(function (q) { return q.release <= lim; }).length;
      var s = frac(ok, notes.length);
      return {
        label: "Clean stops", score: clamp(s * 1.1, 0, 1),
        value: ok + " of " + notes.length, target: "all",
        tip: s < 0.7 ? "Your notes trail off instead of stopping. Finish each '" + say + "' by cutting the air off hard, like saying the word with a hard stop at the end." : null
      };
    },
    steady: function (m, p, say, notes) {
      // no squeaks or cracks: the pitch inside a note should not jump to a second, higher level
      // only in notes that hold a clear pitch: in a raspy one, the tracker's
      // own jumps look like squeaks
      var bad = notes.filter(function (q) { return q.voiced >= 0.45 && q.squeak; }).length;
      return {
        label: "No squeaks", score: 1 - frac(bad, notes.length),
        value: bad ? plural(bad, "squeak") : "clean", target: "clean",
        tip: bad ? "I heard " + plural(bad, "note") + " squeak or crack upward. That is usually too much air or too much pressure — push from your gut, not your cheeks, and ease off a little." : null
      };
    },
    breakUp: function (m, p, say, notes) {
      // goose honk: low "her" breaking up to a high "onk"
      // `need`: the share of notes that must break for full credit (real
      // geese's quick clucks show it on some, not every one)
      var need = p.jump || 4, ok = notes.filter(function (q) { return q.jumpUp >= need || (q.tail - q.head) >= need; }).length;
      return {
        label: "The break", score: clamp(frac(ok, notes.length) / (p.need || 1), 0, 1),
        value: ok + " of " + notes.length, target: p.need ? "some notes" : "every note",
        tip: frac(ok, notes.length) < (p.need || 1) ? "Each honk needs to break — start low ('her') and snap up high ('onk'). Back-pressure from your hand is what makes it crack over." : null
      };
    },
    breakDown: function (m, p, say, notes) {
      // turkey yelp: high "kee" falling to a low "yuk"; elk mew and doe bleat: a slide down
      var need = p.drop || 2, ok = notes.filter(function (q) { return (q.head - q.tail) >= need || q.jumpDown >= need + 1; }).length;
      var tip = p.label ? "Let the pitch slide down at the end of each call instead of holding one flat note." :
        "Each note should roll over from high to low — 'kee-yuk'. Let the pitch fall inside every note, not just across the run.";
      return {
        label: p.label || "High to low", score: frac(ok, notes.length),
        value: ok + " of " + notes.length, target: "every note",
        tip: ok < notes.length ? tip : null
      };
    },
    consistent: function (m, p, say, notes) {
      // every quack the same: length and pitch
      if (notes.length < 2) return { label: "Consistency", score: 0.5, value: "—", target: "all alike", tip: "Blow a few so I can check they match." };
      var cvDur = sd(m.durs) / mean(m.durs);
      // pitch from note to note where the notes hold one; brightness where they
      // are raspy, which wanders more from one honest quack to the next
      var spread = m.levels.length >= 2 ? sd(m.levels) : 0, lim = m.pitchBy === "pitch" ? 1.5 : 3;
      var alike = band(spread, 0, lim, lim);
      // a call near the line between holding a pitch and not can read either
      // way; alike by either measure is alike
      if (m.pitchBy === "pitch") {
        var tl = notes.filter(function (q) { return q.centroid > 0; }).map(function (q) { return st(q.centroid, 100); });
        if (tl.length >= 2) alike = Math.max(alike, band(sd(tl), 0, 3, 3));
      }
      var s = Math.min(band(cvDur, 0, 0.25, 0.2), alike);
      return {
        label: "Consistency", score: s, value: s >= 0.75 ? "alike" : "they vary", target: "all alike",
        tip: s < 0.75 ? (cvDur > 0.25 ? "Your " + say + "s came out different lengths. Make every one the same: same air, same word, same stop." :
          "Your pitch wandered from one to the next. Keep your hand and air the same for every one.") : null
      };
    },
    firstLong: function (m, p, say, notes) {
      var r = p.range, d = notes[0].dur;
      return {
        label: "Long first note", score: band(d, r[0], r[1], 0.12), value: ms(d), target: Math.round(r[0] * 1000) + "–" + ms(r[1]),
        tip: d < r[0] ? "Open with a long, drawn-out note — half a second — before the rest roll out." : d > r[1] ? "Your first note dragged on. Half a second is plenty." : null
      };
    },
    runLen: function (m, p, say, notes) {
      var r = p.range, v = m.span;
      return {
        label: "Run length", score: band(v, r[0], r[1], 0.6), value: secs(v), target: range(r, " s"),
        tip: v < r[0] ? "Keep it rolling longer — " + range(r, " seconds") + " without stopping." : v > r[1] ? "That ran long. A couple of seconds, then break it up with a quack." : null
      };
    },
    pairs: function (m, p, say, notes) {
      // double cluck: tight pairs with a beat between — the gaps alternate short, long
      var g = m.gaps;
      if (g.length < 3) return { label: "Pairs", score: 0, value: "—", target: "ga-whit pairs", tip: "Run at least a few pairs so I can hear the rhythm." };
      var s2 = sorted(g), half = Math.floor(s2.length / 2);
      var lo = mean(s2.slice(0, half)), hi = mean(s2.slice(half)), cut = Math.sqrt(Math.max(lo, 0.005) * Math.max(hi, 0.005));
      var best = 0;
      for (var ph = 0; ph < 2; ph++) {
        var hit = 0;
        for (var i = 0; i < g.length; i++) if ((g[i] < cut) === ((i + ph) % 2 === 0)) hit++;
        best = Math.max(best, hit / g.length);
      }
      var s = best * band(hi / Math.max(lo, 0.005), 1.8, 99, 0.6);
      return {
        label: "Pairs", score: s, value: s >= 0.75 ? "paired" : "not paired", target: "ga-whit pairs",
        tip: s < 0.75 ? "Make it two-and-a-beat: 'ga-whit' tight together, then a short pause, then the next pair." : null
      };
    },
    riseFall: function (m, p, say, notes) {
      // bugle and howl: climb to a peak, hold, come down — judged on the best
      // of the long notes, not only the very longest (a bit of echo or a
      // breath can decide which one that is)
      var longest = notes.reduce(function (a, b) { return Math.max(a, b.dur); }, 0), need = p.climb || 6;
      var q = null, s = -1, climb = 0;
      notes.forEach(function (c) {
        if (c.dur < 0.6 * longest) return;
        var cl = c.peakS - c.start, dr = c.peakS - c.end;
        var sc = band(cl, need, 60, p.soft || need * 0.5) * (p.fall === false ? 1 : band(dr, p.drop || 2, 60, 2));
        if (sc > s) { s = sc; q = c; climb = cl; }
      });
      return {
        label: "Rise and fall", score: s,
        value: "up " + steps(climb), target: "up " + need + "+",
        tip: s < 0.75 ? (climb < need ? "Climb higher — start low and push the pitch up " + need + "+ half-steps before you let it fall." :
          "Bring it back down at the end instead of stopping at the top.") : null
      };
    },
    holdLen: function (m, p, say, notes) {
      var r = p.range, q = notes.reduce(function (a, b) { return b.dur > a.dur ? b : a; }, notes[0]);
      var s = band(q.dur, r[0], r[1], (r[1] - r[0]) * 0.5 + 0.1);
      return {
        label: "Length", score: s, value: secs(q.dur), target: range(r, " s"),
        tip: s < 0.75 ? (q.dur < r[0] ? "Hold it longer — this call should last " + range(r, " seconds") + "." : "That ran long. Keep it to " + range(r, " seconds") + ".") : null
      };
    },
    smooth: function (m, p, say, notes) {
      var q = notes.reduce(function (a, b) { return b.dur > a.dur ? b : a; }, notes[0]);
      var lim = p.wobble || 0.5, s = band(q.wobble, 0, lim, lim);
      return {
        label: "Smooth tone", score: q.voiced < 0.3 ? 0.4 : s, value: q.wobble <= lim ? "smooth" : "shaky", target: "smooth",
        tip: s < 0.75 ? "The tone shook. Hold steady air through the whole note and let the pitch glide instead of wobble." : null
      };
    },
    waver: function (m, p, say, notes) {
      var lim = p.min || 0.5, ok = notes.filter(function (q) { return q.wobble >= lim || q.span >= 3; }).length;
      return {
        label: "Waver", score: frac(ok, notes.length), value: ok + " of " + notes.length, target: "every cry",
        tip: ok < notes.length ? "Put more panic in it — let the pitch waver and crack inside each cry (open and close your hand over the call)." : null
      };
    },
    rolling: function (m, p, say, notes) {
      var q = notes.reduce(function (a, b) { return b.dur > a.dur ? b : a; }, notes[0]);
      var s = band(q.roll, p.min || 0.12, 9, 0.08);
      return {
        label: "Roll", score: s, value: q.roll >= (p.min || 0.12) ? "rolling" : "flat", target: "rolling",
        tip: s < 0.75 ? "A purr rolls — flutter it (a soft 'prrrr' with your tongue or throat) instead of holding one smooth note." : null
      };
    },
    deep: function (m, p, say, notes) {
      var f = m.f0, lim = p.max || 260;
      if (!f) return { label: "Deep tone", score: 0.5, value: "rough", target: "under " + lim + " Hz", tip: null };
      var s = band(f, 0, lim, lim * 0.25);
      return {
        label: "Deep tone", score: s, value: Math.round(f) + " Hz", target: "under " + lim + " Hz",
        tip: s < 0.75 ? "Too high for a buck. Go deeper — grunt from your chest and keep the tube's end open." : null
      };
    },
    level: function (m, p, say, notes) {
      // Where the call sits, measured from the real animal's recording. By
      // pitch when both it and the caller hold one; by brightness when either
      // is too rough to (a hen's raspy quack has no clean pitch, but it is
      // still far brighter than a goose's honk and duller than a teal's peep).
      var byPitch = p.f0 > 0 && m.f0w > 0 && m.pitchedFrac >= 0.3;
      var v = byPitch ? m.f0w : m.cent, ref = byPitch ? p.f0 : p.cent;
      if (!v || !ref) return { label: "Pitch level", score: 0.5, value: "—", target: "", tip: null };
      var tol = byPitch ? (p.tol || 5) : (p.ctol || 7), soft = byPitch ? (p.soft || 4) : (p.csoft || 5);
      var d = st(v, ref), s = band(d, -tol, tol, soft);
      // a reading an octave off is as likely the tracker (a honk's low half, an
      // echo) as the caller: part credit, not none
      if (byPitch) s = Math.max(s, 0.6 * band(Math.abs(d) - 12, -3, 3, 3));
      if (byPitch) {
        return {
          label: "Pitch level", score: s, value: hz(v), target: "about " + hz(ref),
          tip: s >= 0.75 ? null : d > 0 ?
            "Too high — you were around " + hz(v) + " and the real one sits near " + hz(ref) + ". Bring it down: ease off the air pressure." :
            "Too low — you were around " + hz(v) + " and the real one sits near " + hz(ref) + ". Bring it up: a little more air pressure."
        };
      }
      // the real one holds a clear pitch and this did not: half right at best
      if (p.f0 > 0 && m.pitchedFrac < 0.15) {
        return {
          label: "Pitch level", score: Math.min(s, 0.6), value: "no clear pitch", target: "about " + hz(p.f0),
          tip: "The real one holds a clear note around " + hz(p.f0) + " — yours came out without one. Make the call ring instead of rasp or hiss."
        };
      }
      return {
        label: "Brightness", score: s, value: d > tol ? "too bright" : d < -tol ? "too dull" : "right", target: "like the real one",
        tip: s >= 0.75 ? null : d > 0 ?
          "Your call came out thinner and brighter than the real one. Listen again — it is fuller and deeper than that." :
          "Your call came out duller and deeper than the real one. Listen again — it is sharper and brighter than that."
      };
    },
    tone: function (m, p, say, notes) {
      // A clean whistle, a raspy quack, or something between: the call's purity
      // against the real animal's, with room either side (tools/learn.cjs).
      var v = m.pure, lo = p.lo || 0, hi = p.hi === undefined ? 1 : p.hi, s = band(v, lo, hi, p.soft || 0.15);
      var word = function (x) { return x >= 0.7 ? "clean" : x >= 0.45 ? "mixed" : "raspy"; };
      // and not just noise: a rasp is still a voice, with structure under the
      // grit; a clap, a puff of breath or wind across the phone is not. How
      // noise-like the real recording is (`flat`) sets the limit, up to a cap
      // no voice reaches; a call that is breath — a deer's blow — is left out.
      var noise = p.flat === undefined ? 1 : band(m.flat, 0, clamp(p.flat * 2, 0.1, 0.2), 0.05);
      if (noise < s) {
        return {
          label: "Tone", score: noise, value: noise < 0.75 ? "noise" : word(v), target: p.pure === undefined ? "" : word(p.pure),
          tip: noise >= 0.75 ? null : "That sounded more like air or a clap than a call. Blow through the call so it rings — and keep the phone out of the wind."
        };
      }
      return {
        label: "Tone", score: s, value: word(v), target: p.pure === undefined ? "" : word(p.pure),
        tip: s >= 0.75 ? null : v > hi ?
          "Too clean. The real one is rough and raspy, not a pure note — put some grit in it with more air from your gut." :
          "Too rough. The real one is a clear, clean tone — ease off and let it ring instead of rasp."
      };
    },
    high: function (m, p, say, notes) {
      var f = m.f0, lim = p.min || 600;
      if (!f) return { label: "Pitch", score: 0.5, value: "rough", target: "over " + lim + " Hz", tip: null };
      var s = band(f, lim, 99999, lim * 0.25);
      return { label: "High pitch", score: s, value: Math.round(f) + " Hz", target: "over " + lim + " Hz",
        tip: s < 0.75 ? "Higher — this one is a thin, high cry." : null };
    },
    pauses: function (m, p, say, notes) {
      var r = p.range;
      if (m.n < 2) return { label: "Pauses", score: p.single ? 1 : 0.4, value: "—", target: range(r, " s"), tip: p.single ? null : "Blow it a few times with a pause between, so I can hear your spacing." };
      var s = mean(m.gaps.map(function (g) { return band(g, r[0], r[1], (r[1] - r[0]) * 0.5 + 0.1); }));
      return {
        label: "Pauses", score: s, value: secs(median(m.gaps)), target: range(r, " s"),
        tip: s < 0.75 ? (median(m.gaps) < r[0] ? "Leave more room between calls — " + range(r, " seconds") + " of quiet." : "The pauses ran long. Keep " + range(r, " seconds") + " between calls.") : null
      };
    },
    phrase: function (m, p, say, notes) {
      // barred owl: two phrases with a breath between, the last note drawn out
      var ok = 0, parts = 0;
      if (m.n >= 4) {
        var g = m.gaps, mg = m.maxGap, med = median(g), mdur = median(m.durs);
        // the break between phrases: a breath, or the first phrase's last
        // "you" drawn out long (a real owl often runs the two together)
        var heldMid = notes.slice(1, -2).some(function (q) { return q.dur >= 1.6 * mdur; });
        parts++; if ((mg > med * 2 && m.maxGapAt >= 1 && m.maxGapAt <= m.n - 3) || heldMid) ok++;
        var last = notes[notes.length - 1];
        parts++; if (last.dur >= 1.4 * median(notes.slice(0, -1).map(function (q) { return q.dur; }))) ok++;
      }
      var s = parts ? ok / parts : 0;
      return {
        label: "Phrasing", score: s, value: ok + " of 2", target: "2 phrases, long last note",
        tip: s < 1 ? "Break it into two phrases — 'who cooks for you… who cooks for you-all' — and drag the very last 'all' out and down." : null
      };
    }
  };

  /* The parts that judge what a call sounds like, as against its timing. */
  var SOUND = { level: true, tone: true };

  function scoreGroup(m, notes, spec) {
    var parts = [], tw = 0, ts = 0, vw = 0, vs = 0;
    (spec.score || []).forEach(function (row) {
      var key = row[0], w = row[1], p = row[2] || {}, fn = PARTS[key];
      if (!fn) return;
      var r = fn(m, p, spec.say || "quack", notes);
      r.key = key; r.weight = w; r.score = clamp(r.score, 0, 1); r.sound = !!SOUND[key];
      if (spec.tips && spec.tips[key] && r.tip) r.tip = spec.tips[key];
      parts.push(r);
      var l = w * Math.log(Math.max(0.05, r.score));
      if (r.sound) { vw += w; vs += l; } else { tw += w; ts += l; }
    });
    // Each side is a weighted geometric mean, not an average. Averaged, a call
    // that is right in five ways and flatly wrong in a sixth (too fast,
    // climbing instead of falling) still came out "close"; multiplied, one
    // total miss on any part that matters costs a third or more of the score.
    // Timing and sound are then multiplied, not pooled: pooled, a whistle blown
    // in a quack's rhythm still collected most of the credit, because the
    // timing parts outvoted the two that said it was the wrong sound.
    var T = tw ? Math.exp(ts / tw) : 1, V = vw ? Math.exp(vs / vw) : 1;
    return { parts: parts, score: tw || vw ? Math.round(100 * T * V) : 0, timing: T, sound: V };
  }

  function verdict(score) {
    return score >= 90 ? "Sounds right" : score >= 75 ? "Close" : score >= 55 ? "Getting there" : "Keep at it";
  }

  /* ------------------------------------------------------------------ */
  /* Entry point                                                          */
  /* ------------------------------------------------------------------ */

  function analyze(samples, sampleRate, spec, opts) {
    opts = opts || {};
    var raw = samples, i, clip = 0, peakAbs = 0;
    for (i = 0; i < raw.length; i++) { var a = Math.abs(raw[i]); if (a > peakAbs) peakAbs = a; if (a >= 0.985) clip++; }
    var x = resample(raw, sampleRate, RATE);
    x = highpass2(x, spec.hp || 120, RATE);
    if (spec.lp) x = lowpass4(x, spec.lp, RATE);
    var e = envelope(x);
    var out = {
      ok: false, duration: x.length / RATE, problem: null, warnings: [], notes: [], groups: [],
      env: Array.prototype.map.call(e.filter(function (v, k) { return k % 4 === 0; }), function (v) { return round(v, 1); }),
      envHop: HOP * 4
    };
    if (!e.length) { out.problem = "short"; return out; }
    var floor = pct(e, 0.1), top = pct(e, 0.995);
    out.floor = round(floor, 1); out.top = round(top, 1);
    if (clip / raw.length > 0.002) out.warnings.push("clipped");
    if (top < -62 || top - floor < 12) { out.problem = top - floor < 12 && top > -45 ? "noisy" : "quiet"; return out; }
    if (top < -50) out.warnings.push("quiet");

    var found = findNotes(e, floor, top, spec);
    var notes = found.notes.map(function (q) { return describeNote(x, e, q, spec, floor); });
    // a single click or bump that never held a tone is not a note
    notes = notes.filter(function (q) { return q.dur >= (spec.minNote || 0.03); });
    out.notes = notes;
    out.on = round(found.on, 1);
    if (!notes.length) { out.problem = "nothing"; return out; }

    var groups = spec.kind === "single" ? [notes] : groupNotes(notes, spec.groupGap || 0.9);
    var best = null;
    groups.forEach(function (g, gi) {
      var m = measureGroup(g, spec), sc = scoreGroup(m, g, spec);
      var item = { index: gi, t0: g[0].t0, t1: g[g.length - 1].t1, n: g.length, metrics: m, parts: sc.parts, score: sc.score };
      out.groups.push(item);
      if (!best || item.score > best.score || (item.score === best.score && item.n > best.n)) best = item;
    });

    // The scored call, laid out for drawing: time from its first note, and each
    // note's level in half-steps from the first — by pitch where the notes hold
    // one, by tone where they are too rough to. Octave slips folded back, the
    // same as the scoring does, so the picture and the score agree.
    var g = groups[best.index], usePitch = best.metrics.pitchBy === "pitch";
    var lvOf = function (q) {
      if (usePitch) return q.f0 > 0 && q.voiced >= 0.3 ? st(q.f0, 100) : null;
      return q.centroid > 0 ? st(q.centroid, 100) : null;
    };
    var known = g.map(lvOf).filter(function (v) { return v !== null; });
    var ref = known.length ? median(known) : 0, baseLv = null;
    out.view = g.map(function (q) {
      var lv = lvOf(q);
      if (lv !== null) {
        var dv = lv - ref;
        if (Math.abs(Math.abs(dv) - 12) <= 2.5) lv -= 12 * Math.sign(dv);
        if (baseLv === null) baseLv = lv;
      }
      return { t: round(q.t0 - g[0].t0, 3), d: q.dur, lev: lv, path: usePitch ? q.path : null };
    });
    out.view.forEach(function (v) { if (v.lev !== null) v.lev = round(v.lev - baseLv, 2); });
    out.viewStart = g[0].t0;
    out.best = best.index;
    out.score = best.score;
    out.verdict = verdict(best.score);
    out.parts = best.parts;
    out.metrics = best.metrics;
    out.tips = best.parts
      .filter(function (p) { return p.tip && p.score < 0.8; })
      .sort(function (p, q) { return q.weight * (1 - q.score) - p.weight * (1 - p.score); })
      .slice(0, 3)
      .map(function (p) { return { key: p.key, text: p.tip }; });
    out.good = best.parts
      .filter(function (p) { return p.score >= 0.9; })
      .sort(function (p, q) { return q.weight - p.weight; })
      .map(function (p) { return p.label; });
    out.ok = true;
    return out;
  }

  /* A picture of the sound: rows are frequency bins up to fMax, columns 10 ms. */
  function spectrogram(samples, sampleRate, opts) {
    opts = opts || {};
    var x = sampleRate === RATE ? samples : resample(samples, sampleRate, RATE);
    var N = opts.n || 512, hop = Math.round((opts.hop || 0.01) * RATE), fMax = opts.fMax || 5000;
    var rows = Math.min(N / 2, Math.floor(fMax / (RATE / N)));
    var cols = Math.max(0, Math.floor((x.length - N) / hop) + 1);
    var data = new Uint8Array(rows * cols), w = hann(N), re = new Float32Array(N), im = new Float32Array(N);
    var db = new Float32Array(rows * cols), mx = -Infinity;
    for (var c = 0; c < cols; c++) {
      var s = c * hop;
      for (var i = 0; i < N; i++) { re[i] = x[s + i] * w[i]; im[i] = 0; }
      fft(re, im);
      for (var r = 0; r < rows; r++) {
        var v = 10 * Math.log10(re[r] * re[r] + im[r] * im[r] + 1e-12);
        db[c * rows + r] = v; if (v > mx) mx = v;
      }
    }
    var dyn = opts.dyn || 65;
    for (i = 0; i < db.length; i++) data[i] = Math.round(255 * clamp((db[i] - (mx - dyn)) / dyn, 0, 1));
    return { rows: rows, cols: cols, data: data, hop: hop / RATE, fMax: rows * RATE / N };
  }

  /* The pattern a call should have, drawn from its targets: used for the ghost
     notes behind the caller's own. Times in s, levels in half-steps. */
  function idealPattern(spec) {
    var pat = spec.pattern;
    if (pat) return pat.map(function (q) { return { t0: q[0], t1: q[0] + q[1], s: q[2] || 0 }; });
    return [];
  }

  return {
    RATE: RATE,
    analyze: analyze,
    spectrogram: spectrogram,
    idealPattern: idealPattern,
    verdict: verdict,
    _: { resample: resample, envelope: envelope, yin: yin, fft: fft, band: band, tsSlope: tsSlope, median: median, highpass2: highpass2, measureGroup: measureGroup }
  };
});
