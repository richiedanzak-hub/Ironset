/* Measure the real recordings and write scoring targets from them.

   For calls whose lesson copies a real animal closely (a teal's peeps, a
   bobwhite's whistle, a cow moose's moan), the fairest target is the animal:
   this reads each call's own reference clip with the analyzer, takes the
   scored run of notes, and turns what it measured (how many notes, how fast,
   how long, which way the pitch goes, the gaps) into target ranges with room
   either side, plus the note pattern drawn as the target picture.

   It rewrites the block between the LEARNED markers in calls.js. Run it after
   changing a clip or a call's `learn` settings:  node callwild/tools/learn.cjs
   Needs ffmpeg on the PATH to decode the mp3s. */
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const DIR = path.join(__dirname, "..");
const A = require(path.join(DIR, "analysis.js"));
const FILE = path.join(DIR, "calls.js");

function decode(file) {
  const buf = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", "22050", "-f", "f32le", "-"], { maxBuffer: 1 << 28 });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
}
const r2 = (v) => Math.round(v * 100) / 100, r1 = (v) => Math.round(v * 10) / 10;
const median = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? (s[(s.length - 1) >> 1] + s[s.length >> 1]) / 2 : 0; };

function learn(id, call) {
  const L = call.learn, base = Object.assign({}, call.spec, { score: [] });
  const res = A.analyze(decode(path.join(DIR, "sounds", call.listen[0].clip + ".mp3")), 22050, base);
  if (!res.ok) throw new Error(id + ": the analyzer heard nothing in " + call.listen[0].clip);
  const m = res.metrics, g = res.groups[res.best], notes = res.notes.filter((q) => q.t0 >= g.t0 - 1e-6 && q.t1 <= g.t1 + 1e-6);
  const rows = [], n = m.n, durs = notes.map((q) => q.dur), md = median(durs);
  const want = L.parts || [], skip = L.skip || [];
  if (L.kind === "series") {
    rows.push(["count", 0.8, { range: L.count || [Math.max(2, n - Math.max(2, Math.round(n * 0.3))), n + Math.max(2, Math.round(n * 0.3))] }]);
    if (n >= 2 && !skip.includes("pace")) rows.push(["pace", 1, { range: [r1(m.rate * 0.72), r1(m.rate * 1.38)] }]);
    if (n >= 3 && m.cv < 0.3 && !skip.includes("rhythm")) rows.push(["rhythm", 1, { kind: "even", cv: r2(Math.max(0.2, m.cv * 1.6)), drift: 0.35 }]);
    if (n >= 3 && m.cv >= 0.3 && want.includes("erratic")) rows.push(["rhythm", 1, { kind: "erratic", cv: r2(Math.max(0.25, m.cv * 0.7)) }]);
    if (!skip.includes("length")) rows.push(["length", 0.8, { range: [r2(md * 0.6), r2(md * 1.6)] }]);
    if (Math.abs(m.pitchChange) >= 1.5 && !skip.includes("pitch")) rows.push(["pitch", 0.8, { dir: m.pitchChange < 0 ? "down" : "up", range: [r1(Math.abs(m.pitchChange) * 0.35), r1(Math.abs(m.pitchChange) * 2.5 + 1)], soft: 1 }]);
  } else {
    rows.push(["count", 0.5, { range: L.count || [1, Math.max(4, n + 1)] }]);
    if (L.long) {
      const q = notes.reduce((a, b) => (b.dur > a.dur ? b : a), notes[0]);
      rows.push(["holdLen", 1, { range: [r1(q.dur * 0.6), r1(q.dur * 1.6)] }]);
    } else rows.push(["length", 1, { range: [r2(md * 0.6), r2(md * 1.6)] }]);
    if (n >= 2 && !L.long && !skip.includes("pauses")) rows.push(["pauses", 0.6, { range: [r2(median(m.gaps) * 0.45), r2(median(m.gaps) * 2.2)], single: true }]);
  }
  (L.extra || []).forEach((row) => rows.push(row));
  // the target picture: the scored notes as the animal made them, each with its
  // own pitch path for calls whose shape is scored (a bugle's climb, a bawl's fall)
  const shaped = (L.extra || []).some((row) => ["breakUp", "breakDown", "riseFall", "waver"].includes(row[0]));
  const rolling = (L.extra || []).some((row) => row[0] === "rolling");
  const ghost = res.view.slice(0, 40).map((v, i) => {
    const q = { t: r2(v.t), d: r2(v.d), s: v.lev === null ? 0 : r1(v.lev), v: 1 };
    const path = notes[i] && notes[i].path;
    if (shaped && path && path.length > 2) {
      const step = Math.max(1, Math.floor(path.length / 10));
      q.path = path.filter((p, k) => k % step === 0).map((p) => [r2(Math.min(1, p[0] / Math.max(0.01, v.d))), r1(p[1])]);
    }
    if (rolling) q.roll = true;
    return q;
  });
  return { score: rows, ghost, measured: { n, rate: r2(m.rate), cv: r2(m.cv), medDur: r2(md), pitch: r1(m.pitchChange), clip: call.listen[0].clip } };
}

const D = require(FILE);
const out = {};
for (const [id, c] of Object.entries(D.calls)) {
  if (!c.learn) continue;
  out[id] = learn(id, c);
  const s = out[id].measured;
  console.log(id.padEnd(20), "n", String(s.n).padStart(2), "rate", String(s.rate).padStart(5), "cv", String(s.cv).padStart(4), "len", String(s.medDur).padStart(4), "pitch", String(s.pitch).padStart(5), " ", out[id].score.map((r) => r[0]).join(","));
}
const src = fs.readFileSync(FILE, "utf8");
const block = "/* LEARNED:begin — written by tools/learn.cjs from the reference clips; do not edit by hand */\n  var LEARNED = " +
  JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, { score: v.score, ghost: v.ghost, measured: v.measured }]))) +
  ";\n  /* LEARNED:end */";
const next = src.replace(/\/\* LEARNED:begin[\s\S]*?\/\* LEARNED:end \*\//, block);
if (next === src && !src.includes("LEARNED:begin")) throw new Error("no LEARNED markers in calls.js");
fs.writeFileSync(FILE, next);
console.log("wrote", Object.keys(out).length, "learned calls into calls.js");
