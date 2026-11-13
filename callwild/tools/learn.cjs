/* Measure the real recordings and write scoring targets from them.

   Three things come out of the reference clips, all written into the block
   between the LEARNED markers in calls.js:

   1. Timing targets, for calls whose lesson copies a real animal closely (a
      teal's peeps, a bobwhite's whistle, a cow moose's moan): this reads the
      call's own clip with the analyzer, takes the scored run of notes, and turns
      what it measured (how many notes, how fast, how long, which way the pitch
      goes, the gaps) into target ranges with room either side, plus the note
      pattern drawn as the target picture.

   2. The sound of every call, learned or hand-set: where its pitch sits (or how
      bright it is, for a call too rough to hold a pitch) and how clean or raspy
      it is. Timing alone let a whistle with the right rhythm pass as a quack;
      these two rows are what tell a pintail from a mallard.

   3. Cousins: pairs of calls whose targets cannot tell each other's real
      recordings apart (a mallard hen's greeting and a black duck hen's call).
      The app never tells a caller "that sounded more like" a cousin.

   Run it after changing a clip, a call's spec or its `learn` settings:
     node callwild/tools/learn.cjs
   Needs ffmpeg on the PATH to decode the mp3s. */
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const DIR = path.join(__dirname, "..");
const A = require(path.join(DIR, "analysis.js"));
const FILE = path.join(DIR, "calls.js");
const RATE = 22050;

const cache = {};
function decode(clip) {
  if (cache[clip]) return cache[clip];
  const buf = execFileSync("ffmpeg", ["-v", "error", "-i", path.join(DIR, "sounds", clip + ".mp3"), "-ac", "1", "-ar", String(RATE), "-f", "f32le", "-"], { maxBuffer: 1 << 28 });
  return (cache[clip] = new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4));
}
const r2 = (v) => Math.round(v * 100) / 100, r1 = (v) => Math.round(v * 10) / 10, r0 = (v) => Math.round(v);
const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2 : 0; };

/* 1. Timing targets */
function learn(id, call) {
  const L = call.learn, base = Object.assign({}, call.spec, { score: [] });
  const res = A.analyze(decode(call.listen[0].clip), RATE, base);
  if (!res.ok) throw new Error(id + ": the analyzer heard nothing in " + call.listen[0].clip);
  const m = res.metrics, g = res.groups[res.best], notes = res.notes.filter((q) => q.t0 >= g.t0 - 1e-6 && q.t1 <= g.t1 + 1e-6);
  const rows = [], n = m.n, durs = notes.map((q) => q.dur), md = median(durs);
  const want = L.parts || [], skip = L.skip || [];
  if (L.kind === "series") {
    rows.push(["count", 0.8, { range: L.count || [Math.max(2, Math.round(n * 0.6)), Math.round(n * 1.5) + 1] }]);
    if (n >= 2 && !skip.includes("pace")) rows.push(["pace", 1, { range: [r2(m.rate * 0.8), r2(m.rate * 1.25)], c: r2(m.rate) }]);
    if (n >= 3 && m.cv < 0.3 && !skip.includes("rhythm")) rows.push(["rhythm", 1, { kind: "even", cv: r2(Math.max(0.2, m.cv * 1.6)), drift: 0.35 }]);
    if (n >= 3 && m.cv >= 0.3 && want.includes("erratic")) rows.push(["rhythm", 1, { kind: "erratic", cv: r2(Math.max(0.25, m.cv * 0.7)) }]);
    if (!skip.includes("length")) rows.push(["length", 0.8, { range: [r2(md * 0.7), r2(md * 1.45)], c: r2(md) }]);
    if (Math.abs(m.pitchChange) >= 1.5 && !skip.includes("pitch")) rows.push(["pitch", 0.8, { dir: m.pitchChange < 0 ? "down" : "up", range: [r1(Math.abs(m.pitchChange) * 0.4), r1(Math.abs(m.pitchChange) * 2.2 + 1)], c: r1(Math.abs(m.pitchChange)), soft: 1 }]);
  } else {
    rows.push(["count", 0.5, { range: L.count || [1, Math.max(4, n + 1)] }]);
    if (L.long) {
      const q = notes.reduce((a, b) => (b.dur > a.dur ? b : a), notes[0]);
      rows.push(["holdLen", 1, { range: [r2(q.dur * 0.7), r2(q.dur * 1.45)], c: r2(q.dur) }]);
    } else rows.push(["length", 1, { range: [r2(md * 0.7), r2(md * 1.45)], c: r2(md) }]);
    if (n >= 2 && !L.long && !skip.includes("pauses")) rows.push(["pauses", 0.6, { range: [r2(median(m.gaps) * 0.55), r2(median(m.gaps) * 1.8)], single: true }]);
  }
  // extra checks (a bugle's climb, a yelp's roll): set from the recording in anchor()
  (L.extra || []).forEach((row) => rows.push([row[0], row[1], Object.assign({}, row[2])]));
  return { score: rows, measured: { n, rate: r2(m.rate), cv: r2(m.cv), medDur: r2(md), pitch: r1(m.pitchChange), clip: call.listen[0].clip } };
}

/* The target picture, for every call: the main run of notes as the animal
   made them, each with its own pitch path for calls whose shape is scored (a
   bugle's climb, a yelp's roll). The rhythm guide plays it, so what a caller
   sees and hears is exactly what is scored. */
function ghostOf(call, rows) {
  const { res, notes } = mainRun(call);
  const shaped = rows.some((row) => ["breakUp", "breakDown", "riseFall", "waver"].includes(row[0]));
  const rolling = rows.some((row) => row[0] === "rolling");
  return res.view.slice(0, 40).map((v, i) => {
    const q = { t: r2(v.t), d: r2(v.d), s: v.lev === null ? 0 : r1(v.lev), v: 1 };
    const p = notes[i] && notes[i].path;
    if (shaped && p && p.length > 2) {
      const step = Math.max(1, Math.floor(p.length / 10));
      q.path = p.filter((x, k) => k % step === 0).map((x) => [r2(Math.min(1, x[0] / Math.max(0.01, v.d))), r1(x[1])]);
    }
    if (rolling) q.roll = true;
    return q;
  });
}

/* 1b. The real recording is the bullseye, for every call. Timing targets
   (learned, or hand-set from calling instruction) are re-centred on what the
   real animal in the lesson's recording actually did, with a fixed margin
   either side; a hand-set bar the animal itself falls short of comes down to
   what it did. So copying the sound board exactly scores near 100, and each
   way a call differs from it costs points. The margins are what
   tools/check.cjs calibrates: how far off a real call can be and still be
   called close. */
const W = Object.assign({ pace: 1.11, len: 1.2, hold: 1.2, gap: 1.4, run: 1.25, first: 1.2 }, process.env.LEARN_W ? JSON.parse(process.env.LEARN_W) : {});
const r3 = (v) => Math.round(v * 1000) / 1000;
function mainRun(call) {
  // the real recording's main run of notes: its biggest group (with no rows to
  // score, the analyzer picks the group with the most notes)
  const res = A.analyze(decode(call.listen[0].clip), RATE, Object.assign({}, call.spec, { score: [] }));
  if (!res.ok) throw new Error(call.id + ": the analyzer heard nothing in " + call.listen[0].clip);
  const g = res.groups[res.best];
  return { res, m: res.metrics, notes: res.notes.filter((q) => q.t0 >= g.t0 - 1e-6 && q.t1 <= g.t1 + 1e-6) };
}
function anchor(id, call, timing) {
  const { m, notes } = mainRun(call);
  const longest = notes.reduce((a, b) => (b.dur > a.dur ? b : a), notes[0]);
  const longNotes = notes.filter((q) => q.dur >= 0.6 * longest.dur);
  const gap = m.gaps.length ? median(m.gaps) : 0;
  const sd = (a) => { if (a.length < 2) return 0; const mu = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - mu) * (y - mu), 0) / (a.length - 1)); };
  // the score a fraction-style part gives the real one, asking for all of it
  const rawPart = (key, p) => {
    // scored on the main run alone, so the part sees what anchor() measured
    const g = mainRun(call).notes, mm = A._.measureGroup(g, call.spec);
    const rr = A._.scoreGroup(mm, g, Object.assign({}, call.spec, { score: [[key, 1, Object.assign({}, p, { need: 1, raw: true })]] }));
    return rr.parts.length ? rr.parts[0].score : 1;
  };
  // For a caller's-craft call (hand-set from calling instruction) the textbook
  // range stays acceptable — a textbook greeting call must not fail because
  // the hen in the recording ran hers fast — with the recording as the
  // bullseye inside it. A call that copies an animal is held to the animal.
  const craft = !call.learn;
  const around = (p, ref, w, dec) => {
    const rd = dec === 3 ? r3 : r2, lo = rd(ref / w), hi = rd(ref * w);
    // the recording's own range is the bullseye; the textbook's, kept as `outer`
    if (craft && p.range && (p.range[0] < lo || p.range[1] > hi)) p.outer = [Math.min(p.range[0], lo), Math.max(p.range[1], hi)];
    p.range = [lo, hi];
    p.c = rd(ref);
  };
  return timing.map(([key, w, p0]) => {
    const p = Object.assign({}, p0 || {});
    if (key === "count") p.range = [Math.min(p.range[0], m.n), Math.max(p.range[1], m.n)];
    else if (key === "pace" && m.n >= 2) { around(p, m.rate, W.pace); delete p.soft; }
    else if (key === "length") around(p, m.medDur, W.len, 3);
    else if (key === "holdLen") around(p, longest.dur, W.hold);
    else if (key === "pauses" && gap > 0) around(p, gap, W.gap, 3);
    else if (key === "runLen") around(p, m.span, W.run);
    else if (key === "firstLong") around(p, notes[0].dur, W.first, 3);
    else if (key === "rhythm") {
      if (p.kind === "even") {
        const lim = Math.max(p.cv || 0.2, m.cv * 1.6); p.cv = r2(lim); p.full = r2(Math.max(lim * 0.45, m.cv * 1.05));
        const dr = Math.max(p.drift || 0.25, Math.abs(m.ioiChange) * 1.6); p.drift = r2(dr); p.dfull = r2(Math.max(dr * 0.4, Math.abs(m.ioiChange) * 1.05));
      } else if (p.kind === "erratic") p.cv = r2(Math.min(p.cv || 0.28, m.cv * 0.85));
      else if (p.kind === "speedup") p.min = r2(Math.max(0.02, Math.min(p.min || 0.12, -m.ioiChange * 0.85)));
      else if (p.kind === "slowdown") p.min = r2(Math.max(0.02, Math.min(p.min || 0.12, m.ioiChange * 0.85)));
    } else if (key === "pitch" && (p.dir === "down" || p.dir === "up")) {
      // a coarse shape check (does it fall, does it climb): the real one's
      // amount must sit inside the range, in whichever measure it was read by
      const v = p.dir === "down" ? -m.pitchChange : m.pitchChange, k = m.pitchBy === "pitch" ? 1 : 2;
      const r = (p.range || [1, 8]).slice();
      if (v > 0) { if (v < r[0]) r[0] = r1(Math.max(0.3, v * 0.8)); if (v > r[1] * k) r[1] = r1(v * 1.2 / k); }
      p.range = r;
    } else if (key === "volume") {
      if (p.dir === "down") { const fade = -m.volChange; if (fade > 0) p.min = r1(Math.min(p.min || 3, fade / 2)); }
      else if (p.dir !== "firstloud") p.max = r1(Math.max(p.max || 6, Math.abs(m.volChange) * 1.5));
    } else if (key === "crisp") {
      const rel = notes.map((q) => q.release).sort((a, b) => a - b), q75 = rel[Math.floor((rel.length - 1) * 0.75)];
      p.max = r3(Math.max(p.max || 0.06, q75 * 1.1));
    } else if (key === "steady") {
      p.allow = r2(notes.filter((q) => q.voiced >= 0.45 && q.squeak).length / notes.length);
    } else if (key === "consistent") {
      const durs = notes.map((q) => q.dur), mu = durs.reduce((x, y) => x + y, 0) / durs.length, cvd = sd(durs) / mu;
      p.cvLim = r2(Math.max(0.25, cvd * 1.6)); p.cvFull = r2(Math.max(0.1, cvd * 1.05));
      const lim = m.pitchBy === "pitch" ? 1.5 : 3, spr = sd(m.levels);
      p.spLim = r2(Math.max(lim, spr * 1.6)); p.spFull = r2(Math.max(lim * 0.4, spr * 1.05));
    } else if (key === "riseFall") {
      const best = longNotes.reduce((b, q) => (q.peakS - q.start > b.peakS - b.start ? q : b), longNotes[0]);
      // a shape the real recording does not show cannot be asked of a caller
      if (best.peakS - best.start < 1.5) return null;
      p.climb = r1(Math.min(p.climb || 6, Math.max(1, (best.peakS - best.start) / 1.6)));
      // and a fall at the end only if the real one falls (a bugle can end on grunts)
      if (best.peakS - best.end < 0.8) p.fall = false;
      else p.drop = r1(Math.min(p.drop || 2, Math.max(0.5, (best.peakS - best.end) / 1.6)));
    } else if (key === "rolling") {
      p.min = r2(Math.min(p.min || 0.12, Math.max(0.04, longest.roll / 1.6)));
    } else if (key === "smooth") {
      const lim = Math.max(p.wobble || 0.5, longest.wobble * 1.6); p.wobble = r2(lim); p.full = r2(Math.max(lim * 0.4, longest.wobble * 1.05));
    } else if (key === "taper") {
      p.ratio = r2(Math.min(p.ratio || 1.4, m.durRatio / 1.2));
    } else if (["pairs", "phrase", "waver", "breakUp", "breakDown"].includes(key)) {
      p.need = r2(Math.min(p.need || 1, Math.max(0.2, rawPart(key, p))));
    }
    // note length is the measure a room's echo bends most: it counts for less
    return [key, key === "length" || key === "holdLen" ? r2(w * 0.7) : w, p];
  }).filter(Boolean);
}

/* 2. The sound of the real thing. Measured over every note in the clip (the
   clips are cut to the call), with the same code that measures a caller. */
function voiceOf(id, call, timing) {
  // the main run of notes, the same one the timing targets were set from
  const { notes: inG, res } = mainRun(call);
  const m = A._.measureGroup(inG.length ? inG : res.notes, call.spec);
  const rows = [];
  // Pitch level, where the recording holds a clear pitch through most of the
  // call; brightness otherwise. A wide band either side: a caller's instrument
  // will not match one animal's voice exactly, but a whistle two octaves above
  // a quack is not the same call.
  // Only a clearly tonal recording is held to a pitch: in a rougher one the
  // tracker can lock onto an overtone (a goose's cluck reads 2 kHz), and a
  // caller whose call reads at its true pitch would be told, wrongly, that
  // they are an octave and more too low. A call that is breath — a deer's
  // blow — is never held to a pitch.
  const pitched = !call.breathy && m.pitchedFrac >= 0.8 && m.voiced >= 0.75;
  // a call that glides in pitch (a bobwhite's rising "white", a wigeon's
  // whistle) reads less steadily than one that holds a note: more room
  const spanMed = median(inG.map((q) => q.span || 0)), lvSpread = m.levels.length >= 4 ? (() => { const s = m.levels.slice().sort((x, y) => x - y); return s[Math.floor(s.length * 0.75)] - s[Math.floor(s.length * 0.25)]; })() : 0;
  const tol = r1(Math.min(7, Math.max(4, 4 + 0.25 * spanMed + 0.5 * lvSpread)));
  const lv = { f0: pitched ? r0(m.f0w) : 0, cent: r0(m.cent), pk: r0(m.peakF) };
  if (pitched && tol > 4) lv.tol = tol;
  rows.push(["level", 1.2, lv]);
  // Tone: how clean or raspy, by purity (how much of the sound sits in its one
  // strongest peak), with room either side. A clean call sets a floor (too
  // raspy fails), a raspy one a ceiling (too clean fails), one between both.
  const P = m.pure;
  const lo = P >= 0.45 ? r2(P - 0.25) : 0, hi = P <= 0.6 ? r2(P + 0.25) : 1;
  const tone = { pure: r2(P), lo, hi };
  // how noise-like the real one is, so a clap or a puff of breath cannot pass
  // for a rasp — except on a call that is itself breath (a deer's blow)
  if (!call.breathy) tone.flat = Math.round(m.flat * 1000) / 1000;
  rows.push(["tone", 1.2, tone]);
  return { rows, at: { f0: r0(m.f0w), pitched: r2(m.pitchedFrac), voiced: r2(m.voiced), cent: r0(m.cent), pure: r2(P), flat: Math.round(m.flat * 1000) / 1000 } };
}

const D0 = require(FILE);
const learned = {};
for (const [id, c] of Object.entries(D0.calls)) {
  if (!c.learn) continue;
  learned[id] = learn(id, c);
  const s = learned[id].measured;
  console.log(id.padEnd(20), "n", String(s.n).padStart(2), "rate", String(s.rate).padStart(5), "cv", String(s.cv).padStart(4), "len", String(s.medDur).padStart(4), "pitch", String(s.pitch).padStart(5), " ", learned[id].score.map((r) => r[0]).join(","));
}
const timing = {}, voice = {}, ghosts = {};
for (const [id, c] of Object.entries(D0.calls)) {
  timing[id] = anchor(id, c, c.learn ? learned[id].score : (c.handScore || []));
  ghosts[id] = ghostOf(c, timing[id]);
  const v = voiceOf(id, c, timing[id]);
  voice[id] = v.rows;
  console.log(id.padEnd(20), "sound", JSON.stringify(v.at), v.rows.map((r) => r[0] + JSON.stringify(r[2])).join(" "));
}

function write(near) {
  const src = fs.readFileSync(FILE, "utf8");
  const block = "/* LEARNED:begin — written by tools/learn.cjs from the reference clips; do not edit by hand */\n  var LEARNED = " +
    JSON.stringify(Object.fromEntries(Object.entries(learned).map(([k, v]) => [k, { score: v.score, measured: v.measured }]))) +
    ";\n  var GHOST = " + JSON.stringify(ghosts) +
    ";\n  var TIMING = " + JSON.stringify(timing) +
    ";\n  var VOICE = " + JSON.stringify(voice) +
    ";\n  var NEAR = " + JSON.stringify(near) +
    ";\n  /* LEARNED:end */";
  const next = src.replace(/\/\* LEARNED:begin[\s\S]*?\/\* LEARNED:end \*\//, block);
  if (next === src && !src.includes("LEARNED:begin")) throw new Error("no LEARNED markers in calls.js");
  fs.writeFileSync(FILE, next);
}

/* 3. Cousins. Write the new targets first, then score every call's real
   recording against every other call's finished target. */
write({});
delete require.cache[require.resolve(FILE)];
const D = require(FILE), ids = Object.keys(D.calls), cross = {};
for (const a of ids) {
  cross[a] = {};
  const x = decode(D.calls[a].listen[0].clip);
  for (const b of ids) {
    const r = A.analyze(x, RATE, D.calls[b].spec);
    cross[a][b] = r.ok ? r.score : 0;
  }
}
const NEAR_AT = 60, near = {};
for (const a of ids) {
  const list = ids.filter((b) => b !== a && (cross[a][b] >= NEAR_AT || cross[b][a] >= NEAR_AT));
  if (list.length) near[a] = list;
}
write(near);

let own = 0, low = [];
for (const a of ids) { own += cross[a][a]; if (cross[a][a] < 80) low.push(a + " " + cross[a][a]); }
const off = [];
for (const a of ids) for (const b of ids) if (a !== b) off.push(cross[a][b]);
off.sort((p, q) => p - q);
console.log("\nown recording on own target: average", Math.round(own / ids.length), low.length ? "| under 80: " + low.join(", ") : "| all 80+");
console.log("a recording on another call's target: median", off[off.length >> 1], "| 90th pct", off[Math.floor(off.length * 0.9)], "| share at 75+", Math.round(100 * off.filter((v) => v >= 75).length / off.length) + "%");
console.log("wrote", Object.keys(learned).length, "learned calls,", ids.length, "sounds,", Object.keys(near).length, "calls with cousins into calls.js");
fs.writeFileSync(path.join(process.env.CROSS_OUT || "/dev/null"), JSON.stringify(cross));
