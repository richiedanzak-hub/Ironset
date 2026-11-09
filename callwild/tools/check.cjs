/* How good is the scoring? Run after changing a target, a clip or the analyzer:
     node callwild/tools/check.cjs           (about two minutes; needs ffmpeg)

   1. Every real recording on its own lesson. The animal itself has to pass.
   2. Every real recording on every other lesson. A call should not pass for
      a different one.
   3. Decoys a skeptic tries first — whistling a tune, humming, talking,
      clapping, blowing into the phone — on every lesson.
   4. Each real recording altered the way a person's call differs from the
      animal's: a few half-steps off, a bit fast or slow, a room's echo, a
      bassy or tinny phone, background noise. A good call should still pass.

   It prints a summary and exits non-zero if the animal fails its own lesson
   or a realistic alteration sinks a real call. */
const path = require("path"), { execFileSync } = require("child_process");
const DIR = path.join(__dirname, "..");
const A = require(path.join(DIR, "analysis.js"));
const D = require(path.join(DIR, "calls.js"));
const R = 22050, ids = Object.keys(D.calls);
const group = {}; D.species.forEach((s) => { group[s.id] = s.group; });
const grp = (id) => group[D.calls[id].species];
const clip = (id) => path.join(DIR, "sounds", D.calls[id].listen[0].clip + ".mp3");
const ff = (f, af) => { const b = execFileSync("ffmpeg", ["-v", "quiet", "-i", f, "-af", af || "anull", "-ac", "1", "-ar", String(R), "-f", "f32le", "-"], { maxBuffer: 1 << 28 }); return new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4); };
const score = (x, id) => { const r = A.analyze(x, R, D.calls[id].spec); return r.ok ? r.score : 0; };
const pct = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
const share = (a, t) => Math.round(100 * a.filter((v) => v >= t).length / a.length) + "%";
let failed = false;

/* 1 and 2 */
const own = [], low = [], other = [], otherSame = [];
for (const a of ids) {
  const x = ff(clip(a));
  for (const b of ids) {
    const s = score(x, b);
    if (a === b) { own.push(s); if (s < 80) low.push(a + " " + s); }
    else { other.push(s); if (grp(a) === grp(b)) otherSame.push(s); }
  }
}
console.log("1. real recordings on their own lesson: average " + Math.round(own.reduce((p, q) => p + q, 0) / own.length) + (low.length ? " | UNDER 80: " + low.join(", ") : " | all 80+"));
console.log("2. real recordings on other lessons: median " + pct(other, 0.5) + ", 75+ on " + share(other, 75) + " (same group: median " + pct(otherSame, 0.5) + ", 75+ on " + share(otherSame, 75) + ")");
if (low.length) failed = true;

/* 3. decoys, synthesized */
let seed = 12345; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const buf = (sec) => new Float32Array(Math.round(sec * R));
const norm = (x) => { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); for (let i = 0; i < x.length; i++) x[i] = x[i] * 0.5 / (m || 1) + 0.001 * (rnd() * 2 - 1); return x; };
const ramp = (i, n, a, r) => Math.min(1, i / (a * R), (n - i) / (r * R));
function reson(x, f, bw) {
  const r = Math.exp(-Math.PI * bw / R), c = 2 * r * Math.cos(2 * Math.PI * f / R), y = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) y[i] = (1 - r) * x[i] + c * (i > 0 ? y[i - 1] : 0) - r * r * (i > 1 ? y[i - 2] : 0);
  return y;
}
function voice(sec, f0, formants) { // a pulse train through vowel-like resonances
  const n = Math.round(sec * R), src = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { ph += f0(i / n) / R; if (ph >= 1) { ph -= 1; src[i] = 1; } }
  const y = new Float32Array(n);
  for (const [f, bw, g] of formants) { const z = reson(src, f, bw); for (let i = 0; i < n; i++) y[i] += g * z[i] * ramp(i, n, 0.03, 0.05); }
  return y;
}
const decoys = {
  "whistling a tune": () => { const x = buf(3.6); let t = 0.3; for (const f of [1400, 1760, 1570, 2100, 1870, 1400, 1250]) { const s0 = Math.round(t * R), n = Math.round(0.34 * R); let ph = 0; for (let i = 0; i < n; i++) { ph += 2 * Math.PI * f * Math.pow(2, 0.02 * Math.sin(2 * Math.PI * 5.5 * i / R)) / R; x[s0 + i] = Math.sin(ph) * ramp(i, n, 0.02, 0.03); } t += 0.42; } return norm(x); },
  "humming": () => { const x = buf(3.2); for (let k = 0; k < 4; k++) x.set(voice(0.42, (u) => 170 - 20 * u, [[260, 60, 1], [2300, 200, 0.12]]), Math.round((0.3 + k * 0.6) * R)); return norm(x); },
  "talking": () => { const x = buf(4.5), V = [[[730, 90, 1], [1090, 110, 0.5], [2440, 170, 0.25]], [[530, 70, 1], [1840, 120, 0.45], [2480, 170, 0.25]], [[300, 60, 1], [2300, 150, 0.4], [3000, 200, 0.2]], [[570, 80, 1], [840, 100, 0.6], [2410, 170, 0.2]]]; let t = 0.3; for (let k = 0; k < 11; k++) { const s0 = Math.round(t * R), nb = Math.round(0.04 * R); for (let i = 0; i < nb; i++) x[s0 + i] += 0.25 * (rnd() * 2 - 1) * (1 - i / nb); const d = 0.16 + rnd() * 0.18, f = 125 + rnd() * 25, y = voice(d, (u) => f * (1 - 0.08 * u), V[k % 4]); for (let i = 0; i < y.length && s0 + nb + i < x.length; i++) x[s0 + nb + i] += y[i] * 0.05; t += d + 0.07 + rnd() * 0.12; } return norm(x); },
  "clapping": () => { const x = buf(4); let t = 0.3; for (let k = 0; k < 8; k++) { const s0 = Math.round(t * R); for (let i = 0; i < 0.03 * R; i++) x[s0 + i] += (rnd() * 2 - 1) * Math.exp(-i / (0.006 * R)); t += 0.36 + rnd() * 0.16; } return norm(reson(x, 1500, 2500)); },
  "blowing": () => { const x = buf(3.6); for (let k = 0; k < 3; k++) { const s0 = Math.round((0.3 + k * 1.1) * R), n = Math.round(0.7 * R); for (let i = 0; i < n; i++) x[s0 + i] += (rnd() * 2 - 1) * ramp(i, n, 0.08, 0.15); } return norm(reson(x, 1200, 3000)); },
};
const all = [];
console.log("3. decoys on every lesson:");
for (const [name, make] of Object.entries(decoys)) {
  const x = make(), s = ids.map((id) => [id, score(x, id)]).sort((p, q) => q[1] - p[1]);
  all.push(...s.map((p) => p[1]));
  console.log("   " + name.padEnd(17) + " median " + String(pct(s.map((p) => p[1]), 0.5)).padStart(3) + " | 60+: " + (s.filter((p) => p[1] >= 60).map((p) => p[0] + " " + p[1]).join(", ") || "none"));
}
console.log("   all decoys: median " + pct(all, 0.5) + ", 75+ on " + share(all, 75) + " of lessons");

/* 4. a real call, a little off */
const ALTER = {
  "3 half-steps up": "asetrate=44100*1.1892,aresample=44100,atempo=0.8409",
  "3 half-steps down": "asetrate=44100*0.8409,aresample=44100,atempo=1.1892",
  "10% faster": "atempo=1.1", "10% slower": "atempo=0.9",
  "room echo": "aecho=0.8:0.8:25|50|90:0.2|0.12|0.06",
  "bassy phone": "bass=g=6:f=400,treble=g=-6:f=2500", "tinny phone": "bass=g=-6:f=400,treble=g=6:f=2500",
  "noise": "anoisesrc=c=pink:a=0.02[n];[0:a][n]amix=inputs=2:duration=first:weights=1 1",
};
console.log("4. real recordings, altered, on their own lesson (under 70 listed):");
for (const [name, af] of Object.entries(ALTER)) {
  const s = [], bad = [];
  for (const id of ids) {
    let x;
    try { x = name === "noise" ? noisy(ff(clip(id))) : ff(clip(id), af); } catch (e) { continue; }
    const v = score(x, id); s.push(v); if (v < 70) bad.push(id + " " + v);
  }
  console.log("   " + name.padEnd(18) + " median " + String(pct(s, 0.5)).padStart(3) + " | " + (bad.join(", ") || "none"));
  if (bad.length > 2) failed = true;
}
function noisy(x) { // pink-ish noise 25 dB under the call's peak
  let pk = 0; for (const v of x) pk = Math.max(pk, Math.abs(v));
  const y = new Float32Array(x.length), amp = pk * Math.pow(10, -25 / 20); let b = 0;
  for (let i = 0; i < x.length; i++) { const w = rnd() * 2 - 1; b = 0.97 * b + 0.03 * w; y[i] = x[i] + amp * (b * 4 + w * 0.3); }
  return y;
}
console.log(failed ? "CHECK FAILED" : "CHECK OK");
process.exit(failed ? 1 : 0);
