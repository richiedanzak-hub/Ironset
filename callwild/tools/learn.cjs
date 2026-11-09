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
    const p = notes[i] && notes[i].path;
    if (shaped && p && p.length > 2) {
      const step = Math.max(1, Math.floor(p.length / 10));
      q.path = p.filter((x, k) => k % step === 0).map((x) => [r2(Math.min(1, x[0] / Math.max(0.01, v.d))), r1(x[1])]);
    }
    if (rolling) q.roll = true;
    return q;
  });
  return { score: rows, ghost, measured: { n, rate: r2(m.rate), cv: r2(m.cv), medDur: r2(md), pitch: r1(m.pitchChange), clip: call.listen[0].clip } };
}

/* 2. The sound of the real thing. Measured over every note in the clip (the
   clips are cut to the call), with the same code that measures a caller. */
function voiceOf(id, call) {
  const res = A.analyze(decode(call.listen[0].clip), RATE, Object.assign({}, call.spec, { score: [] }));
  if (!res.ok) throw new Error(id + ": the analyzer heard nothing in " + call.listen[0].clip);
  const m = A._.measureGroup(res.notes, call.spec);
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
  const pitched = !call.breathy && m.pitchedFrac >= 0.6 && m.voiced >= 0.6;
  rows.push(["level", 1.2, pitched ? { f0: r0(m.f0w), cent: r0(m.cent) } : { f0: 0, cent: r0(m.cent) }]);
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
const voice = {};
for (const [id, c] of Object.entries(D0.calls)) {
  const v = voiceOf(id, c);
  voice[id] = v.rows;
  console.log(id.padEnd(20), "sound", JSON.stringify(v.at), v.rows.map((r) => r[0] + JSON.stringify(r[2])).join(" "));
}

function write(near) {
  const src = fs.readFileSync(FILE, "utf8");
  const block = "/* LEARNED:begin — written by tools/learn.cjs from the reference clips; do not edit by hand */\n  var LEARNED = " +
    JSON.stringify(Object.fromEntries(Object.entries(learned).map(([k, v]) => [k, { score: v.score, ghost: v.ghost, measured: v.measured }]))) +
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
