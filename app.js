function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;
const mkIcon = paths => ({
  size = 16,
  style
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: style
}, paths);
const Gauge = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "M12 21a9 9 0 1 0-9-9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3 12a9 9 0 0 1 9-9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 12l4.5-3"
})));
const Plus = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "5",
  x2: "12",
  y2: "19"
}), /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
})));
const X = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /*#__PURE__*/React.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
})));
const Trash2 = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polyline", {
  points: "3 6 5 6 21 6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "10",
  y1: "11",
  x2: "10",
  y2: "17"
}), /*#__PURE__*/React.createElement("line", {
  x1: "14",
  y1: "11",
  x2: "14",
  y2: "17"
}), /*#__PURE__*/React.createElement("path", {
  d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
})));
const Settings = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "3"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
})));
const TrendingUp = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polyline", {
  points: "23 6 13.5 15.5 8.5 10.5 1 18"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "17 6 23 6 23 12"
})));
const Activity = mkIcon( /*#__PURE__*/React.createElement("polyline", {
  points: "22 12 18 12 15 21 9 3 6 12 2 12"
}));
const Check = mkIcon( /*#__PURE__*/React.createElement("polyline", {
  points: "20 6 9 17 4 12"
}));
const ChevronDown = mkIcon( /*#__PURE__*/React.createElement("polyline", {
  points: "6 9 12 15 18 9"
}));
const Info = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "16",
  x2: "12",
  y2: "12"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "8",
  x2: "12.01",
  y2: "8"
})));
const Pencil = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "M12 20h9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"
})));
const Zap = mkIcon( /*#__PURE__*/React.createElement("polygon", {
  points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
}));
const Calendar = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "4",
  width: "18",
  height: "18",
  rx: "2"
}), /*#__PURE__*/React.createElement("line", {
  x1: "16",
  y1: "2",
  x2: "16",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "8",
  y1: "2",
  x2: "8",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "3",
  y1: "10",
  x2: "21",
  y2: "10"
})));
const Play = mkIcon( /*#__PURE__*/React.createElement("polygon", {
  points: "5 3 19 12 5 21 5 3"
}));
const Film = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
  x: "2",
  y: "4",
  width: "20",
  height: "16",
  rx: "2"
}), /*#__PURE__*/React.createElement("line", {
  x1: "7",
  y1: "4",
  x2: "7",
  y2: "20"
}), /*#__PURE__*/React.createElement("line", {
  x1: "17",
  y1: "4",
  x2: "17",
  y2: "20"
}), /*#__PURE__*/React.createElement("line", {
  x1: "2",
  y1: "12",
  x2: "22",
  y2: "12"
})));
const Camera = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "13",
  r: "4"
})));
const Upload = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "17 8 12 3 7 8"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "3",
  x2: "12",
  y2: "15"
})));
const Share = mkIcon( /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
  d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "16 6 12 2 8 6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "2",
  x2: "12",
  y2: "15"
})));
function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const st = {
        ...DEFAULT,
        ...p,
        settings: {
          ...DEFAULT.settings,
          ...(p.settings || {})
        }
      };
      if (st.program) st.program = migrateProgram(st.program);
      return st;
    }
  } catch (e) {}
  return DEFAULT;
}

/* ----------------------------------------------------------------------------
   STRENGTH ENGINE
   Everything keys off one idea: an RPE-anchored set tells you how far from
   failure you were. RIR = 10 - RPE, so a set of `reps` at a given RPE is
   equivalent to doing `reps + RIR` reps to true failure. That single "reps to
   failure" number maps to a % of 1RM via the standard RPE/RTS chart. From there
   we can both estimate a 1RM from any set, and predict a weight for any target.
---------------------------------------------------------------------------- */

// % of 1RM for N reps taken to true failure (RPE 10). Standard RTS values.
const PCT = {
  1: 100.0,
  2: 95.5,
  3: 92.2,
  4: 89.2,
  5: 86.3,
  6: 83.7,
  7: 81.1,
  8: 78.6,
  9: 76.2,
  10: 73.9,
  11: 70.7,
  12: 68.0,
  13: 65.3,
  14: 62.6,
  15: 59.9,
  16: 57.3,
  17: 54.8,
  18: 52.4,
  19: 50.0,
  20: 47.6
};
function pctForN(n) {
  if (n <= 1) return 100;
  if (n >= 20) return PCT[20];
  const lo = Math.floor(n),
    hi = Math.ceil(n);
  if (lo === hi) return PCT[lo];
  return PCT[lo] + (PCT[hi] - PCT[lo]) * (n - lo); // linear interp for half-RPEs
}

const repsToFailure = (reps, rpe) => reps + Math.max(0, 10 - rpe);
// Observed estimated 1RM from a completed set.
function e1rmFromSet(weight, reps, rpe) {
  return weight / (pctForN(repsToFailure(reps, rpe)) / 100);
}
// Predict the weight for a prescribed (reps, rpe) given an estimated 1RM.
function weightForTarget(e1rm, reps, rpe) {
  return e1rm * (pctForN(repsToFailure(reps, rpe)) / 100);
}
// Confidence that a set's RPE rating is accurate. Near failure you can clearly feel
// "one, maybe two left"; on light sets the reps-in-reserve guess is fuzzy and can be off
// by a full point or more, so those sets should barely move the 1RM estimate. This is
// why a heavy RPE 9 set outweighs a light RPE 5 one even when the light set is newer.
function rpeConfidence(rpe) {
  return 0.2 + 0.8 * Math.max(0, Math.min(1, (rpe - 5) / 4)); // RPE5→.2, 7→.6, 8→.8, 9-10→1
}
// The rep→%1RM table is sharp at low reps and frays as reps climb (rep-endurance varies
// a lot between lifters), so long sets are noisier predictors regardless of effort.
function repsAccuracy(reps) {
  return reps <= 5 ? 1 : Math.max(0.5, 1 - (reps - 5) * 0.05); // 5→1, 10→.75, 15→.5
}
// How much a logged set should move the estimate: heaviest weight on hard, low-rep sets.
function reliability(reps, rpe) {
  return repsAccuracy(reps) * rpeConfidence(rpe);
}
// Fatigue model. A set spends capacity in proportion to volume (reps) and how close
// to failure it was — effort grows steeply toward RPE 10, so a grind costs far more
// than an easy set. The per-lifter sensitivity K is learned from their own history.
const DEFAULT_FATIGUE_K = 0.027;
function fatigueEffort(rpe) {
  const p = Math.max(0, (Math.min(10, rpe) - 4) / 6); // RPE6→.11, 8→.44, 9.5→.84, 10→1
  return p * p;
}
function fatigueDrop(reps, rpe, k) {
  // Volume cost: reps × how close to failure the set was.
  const volume = k * Math.max(1, reps) * fatigueEffort(rpe);
  // Neural cost: a hard top set taxes the CNS beyond its rep count — biggest for heavy
  // low-rep work, fading as reps climb (where volume already accounts for it). This is
  // what keeps the first back-off off a heavy single/triple from landing too high.
  const effort = Math.max(0, Math.min(1, (Math.min(10, rpe) - 4) / 6)); // RPE7→.5, 8→.67, 10→1
  const neural = 0.15 * effort / (1 + 0.35 * (Math.max(1, reps) - 1));
  return Math.max(0, Math.min(0.34, volume + neural));
}
/* Within a session fatigue accumulates, but it does not compound. The first hard set
   costs the most capacity and every set after it costs less, because the capacity
   that fades quickly has already gone. Subtracting a full fresh-set cost from an
   already-tired capacity each time is a geometric series, and geometric series run
   away: five sets across at one effort came out 37% below the first, which is not a
   thing anyone does. So the per-set figure above is a *stimulus*, it adds up across
   the session, and what it costs you saturates. */
const SESSION_FADE = 0.32;
const fadeFrom = stim => SESSION_FADE * (1 - Math.exp(-Math.max(0, stim) / SESSION_FADE));
// What one more set of this stimulus costs, given everything already done — the thing
// the next load is actually built on.
const marginalFade = (before, stim) => {
  const c0 = 1 - fadeFrom(before);
  if (!(c0 > 0.2)) return 0;
  return (fadeFrom(before + stim) - fadeFrom(before)) / c0;
};

// Learn how fast THIS lifter's capacity falls across a session, from descending
// (back-off) steps: each step's implied-1RM drop ÷ the prior set's fatigue stimulus.
// Median is robust to noise; the result is shrunk toward the default so sparse data
// stays sane and it only drifts to a personal value once there's real evidence.
function learnDropScale(sets, k, forTop) {
  // How much THIS lifter actually drops on a given transition type, learned per lift.
  // Top-set→first-back-off and back-off→back-off are learned SEPARATELY (forTop), since
  // many lifters barely drop off their top set but descend through their chain. Every
  // observation counts: holding or gaining strength into a back-off is the strongest
  // possible evidence of minimal drop, not noise to discard.
  const byDay = {};
  for (const s of sets) {
    const d = new Date(s.ts).toDateString();
    (byDay[d] = byDay[d] || []).push(s);
  }
  const scales = [];
  for (const d in byDay) {
    const day = byDay[d].slice().sort((a, b) => a.ts - b.ts);
    // Cumulative stimulus going into each set, so a deep set is measured against what
    // one more set actually costs rather than against a fresh-set figure it could
    // never match — otherwise every long session would teach a smaller scale than
    // the lifter really has.
    let before = 0;
    for (let i = 0; i < day.length - 1; i++) {
      const a = day[i],
        b = day[i + 1];
      const stimA = fatigueDrop(a.reps, a.rpe, k);
      const predHere = marginalFade(before, stimA);
      before += stimA;
      if (!b.backoff) continue; // only transitions INTO a back-off
      if (!a.backoff !== forTop) continue; // split: top→BO1 vs BO→BO
      const ea = e1rmFromSet(a.weight, a.reps, a.rpe),
        eb = e1rmFromSet(b.weight, b.reps, b.rpe);
      if (!(ea > 0) || !(eb > 0)) continue;
      const obs = 1 - eb / ea;
      if (obs > 0.35) continue;
      const pred = predHere;
      if (pred < 0.015) continue;
      const sc = obs <= 0.001 ? 0.2 : obs / pred; // held/gained → strongest low-drop evidence
      if (sc < 2.6) scales.push(Math.max(0.2, sc));
    }
  }
  // No history: stay a touch cautious off a top set, where one transition carries the
  // whole drop. Set to set is gentler — those defaults were read off top-set data back
  // when a chain was one or two back-offs, and they over-predict repeated moderate
  // sets. Both are only a starting point; a couple of sessions moves them.
  const cold = forTop ? 1.15 : 0.7;
  if (!scales.length) return cold;
  scales.sort((x, y) => x - y);
  const med = scales[Math.floor(scales.length / 2)],
    n = scales.length,
    W0 = 3;
  const blended = (n * med + W0 * cold) / (n + W0);
  return Math.max(0.2, Math.min(1.9, blended));
}
// Inverse of pctForN: max reps achievable at a given %1RM (lets % training show a
// predicted RPE/RIR, so the two styles speak the same language).
function repsAtPct(pct) {
  if (pct >= 100) return 1;
  let prev = 1,
    prevP = pctForN(1);
  for (let n = 2; n <= 24; n++) {
    const p = pctForN(n);
    if (p <= pct) return prev + (prevP - pct) / (prevP - p || 1);
    prev = n;
    prevP = p;
  }
  return 24;
}
// Fold the whole (time-ordered) history into a learned 1RM + a trajectory.
/* One day, one reading.

   A session is a descending series by design — the last set is meant to be lighter
   than the first — so feeding every set into the estimate in turn would let the tail
   of a session argue your max downward. The old answer was to throw away anything
   flagged as a back-off. That turned out worse: label a warm-up as the top set and
   the only evidence that counts is the easiest thing you did, while two sets at
   RPE 9 sitting right under it get discarded.

   So take each day at its best instead, whatever the sets were called. And ignore
   sets below RPE 6 outright: five or more reps in reserve is a guess, not a
   measurement, and extrapolating one fourteen reps out to a single is not evidence
   of anything. */
const CALIBRATION_FLOOR_RPE = 6;
function bestPerDay(entries) {
  const pick = list => {
    const byDay = new Map();
    for (const x of list) {
      const k = new Date(x.ts).toDateString();
      const prev = byDay.get(k);
      if (!prev || x.obs > prev.obs) byDay.set(k, x);
    }
    return [...byDay.values()].sort((a, b) => a.ts - b.ts);
  };
  const working = entries.filter(x => x.rpe == null || x.rpe >= CALIBRATION_FLOOR_RPE);
  // Somebody who has only ever logged easy sets still deserves an estimate.
  return pick(working.length ? working : entries);
}
function buildModel(sets, allSets) {
  const ctx = allSets || sets;
  const rsc = learnRecoveryScale(ctx);
  const scored = [...sets].sort((a, b) => a.ts - b.ts).map(s => {
    const raw = e1rmFromSet(s.weight, s.reps, s.rpe);
    return {
      s,
      raw,
      obs: freshCorrect(raw, s, ctx, rsc)
    };
  });
  const sorted = bestPerDay(scored.map(x => ({
    ...x,
    ts: x.s.ts,
    rpe: x.s.rpe
  })));
  let e = null;
  const points = [];
  for (const entry of sorted) {
    const s = entry.s,
      raw = entry.raw;
    let obs = entry.obs;
    // The one guarantee that keeps check-ins honest, and it is worth stating in a
    // single line: a check-in can HOLD your estimate up, but it can never PUSH it up.
    // The correction is allowed to undo the drop a handicapped day would have caused
    // and not one pound more, so a rough day protects your max while a real PR is
    // still credited at exactly the weight you actually moved. Declaring yourself
    // wrecked can therefore never be used to talk your numbers upward.
    if (s.cond != null && s.cond < 1 || s.carry != null && s.carry < 1) obs = Math.min(obs, Math.max(e != null ? e : raw, raw));
    e = e == null ? obs : e + 0.35 * reliability(s.reps, s.rpe) * (obs - e);
    points.push({
      ts: s.ts,
      value: e,
      obs
    });
  }
  const out = {
    e1rm: e,
    points,
    count: sorted.length
  };
  return out;
}

/* ----------------------------------------------------------------------------
   INSIGHT ENGINE — reads the data the app already has and turns it into plain
   reads. Pure local rules: strength trend, hidden gains from variations, RPE
   calibration, weak points. No AI/backend.
---------------------------------------------------------------------------- */
// A snapshot of everything logged today: which lifts, the top set on each, whether the
// session pushed any estimate to a new high, and total working/back-off set counts.
function sessionToday(state, models) {
  return sessionForDay(state, models, null);
}
// The same snapshot for any given day, because Train can be pointed at one that
// is not today and a recap has to describe the session you are actually looking at.
function sessionForDay(state, models, dateStr) {
  const start = dateStr ? dayStart(dateStr) : new Date();
  start.setHours(0, 0, 0, 0);
  const t0 = start.getTime(),
    t1 = t0 + 86400000;
  const lifts = [];
  let totalSets = 0,
    backoffs = 0;
  for (const [name, ex] of Object.entries(state.exercises)) {
    const today = ex.sets.filter(s => s.ts >= t0 && s.ts < t1);
    if (!today.length) continue;
    const work = today.filter(s => !s.backoff);
    const bo = today.filter(s => s.backoff);
    totalSets += today.length;
    backoffs += bo.length;
    const pool = work.length ? work : today;
    const top = pool.reduce((a, b) => b.weight > a.weight ? b : a, pool[0]);
    const m = models[name];
    let e1rm = null,
      up = false;
    if (m && m.e1rm != null) {
      e1rm = m.e1rm;
      let before = null;
      for (const p of m.points) {
        if (p.ts < t0) before = p.value;else break;
      }
      up = before != null && e1rm - before > 0.5;
    }
    // Tonnage per lift, so a recap can say what the day actually weighed.
    const vol = today.reduce((a, x) => a + (x.weight || 0) * Math.max(0, x.reps || 0), 0);
    lifts.push({
      name,
      top,
      e1rm,
      up,
      sets: today.length,
      bo: bo.length,
      vol
    });
  }
  if (!lifts.length) return null;
  lifts.sort((a, b) => b.top.weight - a.top.weight);
  return {
    lifts,
    totalSets,
    backoffs,
    anyUp: lifts.some(l => l.up)
  };
}
function analyze(state, models, unit) {
  const ex = state.exercises;
  const U = unit || "lb";
  const names = Object.keys(ex);
  const mains = names.filter(n => !ex[n].parent && !isAccessory(n, state));
  const now = Date.now(),
    DAY = 864e5;
  const r1 = x => fmt(Math.round(x));
  const valueAt = (pts, t) => {
    let v = null;
    for (const p of pts) {
      if (p.ts <= t) v = p.value;else break;
    }
    return v;
  };
  const out = [];
  const add = (sev, title, detail, scope) => out.push({
    id: (scope || "g") + "|" + title,
    sev,
    title,
    detail
  });

  // projected total + per-lift estimates
  const find = kw => mains.find(n => n.toLowerCase() === kw) || mains.find(n => n.toLowerCase().includes(kw));
  const S = find("squat"),
    B = find("bench"),
    D = find("deadlift");
  const parts = mains.filter(n => models[n] && models[n].e1rm != null).map(n => {
    const m = models[n];
    const ago = valueAt(m.points, now - 30 * DAY);
    return {
      name: n,
      e1rm: m.e1rm,
      delta: ago != null ? m.e1rm - ago : null
    };
  });
  let total = null,
    totalDelta = null;
  if (S && B && D && models[S].e1rm != null && models[B].e1rm != null && models[D].e1rm != null) {
    total = models[S].e1rm + models[B].e1rm + models[D].e1rm;
    totalDelta = [S, B, D].reduce((acc, n) => {
      const a = valueAt(models[n].points, now - 30 * DAY);
      return acc + (a != null ? models[n].e1rm - a : 0);
    }, 0);
  }
  for (const M of mains) {
    const m = models[M];
    if (!m || m.e1rm == null) continue;
    const pts = m.points,
      latest = m.e1rm,
      lastTs = pts.length ? pts[pts.length - 1].ts : null;
    const priorMax = pts.length > 1 ? Math.max(...pts.slice(0, -1).map(p => p.value)) : -Infinity;
    let prFired = false;
    if (pts.length >= 4 && latest > priorMax + 0.5 && lastTs && now - lastTs < 21 * DAY) {
      add("win", "New " + M + " high", "Your estimated " + M + " 1RM just hit a new high of " + r1(latest) + " " + U + ".", M);
      prFired = true;
    }
    const ago30 = valueAt(pts, now - 30 * DAY);
    if (ago30 != null && ago30 > 0) {
      const d = latest - ago30,
        pct = d / ago30 * 100,
        thr = Math.max(2, ago30 * 0.015);
      if (!prFired && d > thr) add("win", M + " trending up", "Up " + r1(d) + " " + U + " (" + pct.toFixed(1) + "%) over the last 30 days.", M);else if (d < -thr) add("watch", M + " slipping", "Down " + r1(-d) + " " + U + " over 30 days — could be fatigue or a rough stretch.", M);
    }
    const kids = names.filter(n => ex[n].parent === M);
    if (kids.length) {
      const ownM = m.own && m.own.e1rm;
      const recentKids = kids.filter(k => ex[k].sets.some(s => now - s.ts < 21 * DAY));
      const kidLabel = (recentKids.length ? recentKids : kids).join(" & ");
      if (ownM == null) add("win", M + " from variations", "You haven't done straight " + M + " lately — based on your " + kidLabel + ", your " + M + " 1RM is about " + r1(latest) + " " + U + ".", M);else if (latest > ownM * 1.02) add("win", "Hidden " + M + " strength", "Your " + kidLabel + " suggests your " + M + " 1RM is ~" + r1(latest - ownM) + " " + U + " higher than your recent straight " + M + " shows (" + r1(latest) + " vs " + r1(ownM) + ").", M);
    }
    if (lastTs && now - lastTs > 14 * DAY && pts.length >= 4) add("note", M + " has gone quiet", Math.round((now - lastTs) / DAY) + " days since your last " + M + " work.", M);
  }
  for (const V of names) {
    const x = ex[V];
    if (!x.parent || !ex[x.parent] || typeof x.ratioManual === "number") continue;
    const mv = models[V],
      own = mv && mv.own && mv.own.e1rm,
      ownP = models[x.parent] && models[x.parent].own && models[x.parent].own.e1rm;
    if (!own || !ownP) continue;
    const r = mv.ratio,
      base = typeof x.ratio === "number" ? x.ratio : defaultRatio(V),
      lc = V.toLowerCase();
    const zone = /block|board|pin|lockout|rack/.test(lc) ? "lockout strength" : /pause|deficit|bottom|dead\s*stop|tempo/.test(lc) ? "bottom-end strength" : "that range";
    if (r > base + 0.03) add("win", V + " catching up", "Your " + V + " is now " + Math.round(r * 100) + "% of " + x.parent + " (was ~" + Math.round(base * 100) + "%) — " + zone + " is improving.", V);else if (r < base - 0.04) add("watch", V + " lagging", "Your " + V + " has dropped to " + Math.round(r * 100) + "% of " + x.parent + " — " + zone + " may be a weak point.", V);
  }
  const recSets = [];
  for (const n of names) for (const s of ex[n].sets) if (s.fromRec && typeof s.tRpe === "number" && now - s.ts < 49 * DAY) recSets.push(s);
  if (recSets.length >= 4) {
    const errs = recSets.map(s => s.rpe - s.tRpe);
    const bias = errs.reduce((a, b) => a + b, 0) / errs.length;
    const mae = errs.reduce((a, b) => a + Math.abs(b), 0) / errs.length;
    if (mae <= 0.6 && recSets.length >= 6) add("note", "Your RPE is dialed in", "Across your last " + recSets.length + " prescribed sets you're within ±" + mae.toFixed(1) + " RPE of target — trust your top sets.", "rpe");else if (bias >= 0.5) add("note", "Sets landing harder than asked", "On average ~" + bias.toFixed(1) + " RPE above target — the model is nudging your loads down to match.", "rpe");else if (bias <= -0.5) add("note", "More in the tank than you think", "Sets land ~" + Math.abs(bias).toFixed(1) + " RPE easier than asked — the model is nudging loads up.", "rpe");else if (mae >= 1.2) add("note", "RPE calls are swingy", "Your effort ratings vary ±" + mae.toFixed(1) + " RPE — an occasional set to true failure will recalibrate your gauge.", "rpe");
  }
  if (S && B && D && models[S].e1rm && models[B].e1rm && models[D].e1rm) {
    const sq = models[S].e1rm,
      be = models[B].e1rm;
    if (be / sq < 0.58) add("watch", "Bench is your lagging lift", "Your bench is " + Math.round(be / sq * 100) + "% of your squat (typical is ~65–75%) — likely the biggest lever on your total.", "bal");
  }

  // Conditions: the read that answers "am I actually getting weaker, or was that
  // just a bad month?" — which is the only question a lifter asks after a rough
  // stretch, and the one the raw trend line answers badly.
  const condSets = [];
  for (const n of names) for (const s of ex[n].sets) if (s.cond != null && s.cond < 0.995 && now - s.ts < 28 * DAY) condSets.push(s);
  if (condSets.length >= 2) {
    const dayCount = new Set(condSets.map(s => new Date(s.ts).toDateString())).size;
    const avgTrim = Math.round((1 - condSets.reduce((a, b) => a + b.cond, 0) / condSets.length) * 1000) / 10;
    add("note", "Training through rough conditions", dayCount + " recent session" + (dayCount > 1 ? "s were" : " was") + " logged under a check-in, with loads trimmed about " + avgTrim + "% on average. Those sets are being read in the conditions you actually lifted them in, so a bad stretch isn't quietly scored as lost strength.", "cond");
  } else if (!state.checkins || !Object.keys(state.checkins).length) {
    // Nobody discovers a feature they've never needed. This appears only for the
    // lifter whose own data already shows the problem it solves.
    const recentRec = [];
    for (const n of names) for (const s of ex[n].sets) if (!s.backoff && s.fromRec && s.tRpe != null && s.rpe != null && now - s.ts < 24 * DAY) recentRec.push(s);
    const misses = recentRec.filter(s => s.rpe - s.tRpe >= 0.5).length;
    if (recentRec.length >= 3 && misses >= 2) {
      add("watch", "Sets landing harder than prescribed", misses + " of your last " + recentRec.length + " prescribed sets came in half an RPE or more above target. If life outside the gym is part of that — sleep, illness, a week away — the daily check-in on Train shades your loads to match, without marking a rough patch down as lost strength.", "cond-suggest");
    }
  }
  const rank = {
    alert: 0,
    win: 1,
    watch: 2,
    note: 3
  };
  out.sort((a, b) => rank[a.sev] - rank[b.sev]);
  const big = {
    squat: S ? {
      name: S,
      e1rm: models[S].e1rm
    } : null,
    bench: B ? {
      name: B,
      e1rm: models[B].e1rm
    } : null,
    deadlift: D ? {
      name: D,
      e1rm: models[D].e1rm
    } : null
  };
  return {
    total,
    totalDelta,
    parts,
    insights: out.slice(0, 8),
    big,
    session: sessionToday(state, models)
  };
}

/* ----------------------------------------------------------------------------
   SHARE CARDS — draw a clean, branded IRONSET image on a canvas (no deps,
   offline) and hand it to the iOS share sheet, with a save/preview fallback.
---------------------------------------------------------------------------- */
function _round(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function _barbell(ctx, cx, cy, width) {
  const half = width / 2;
  ctx.fillStyle = "#E23B2E";
  ctx.fillRect(cx - half, cy - 14, 11, 28);
  ctx.fillRect(cx + half - 11, cy - 14, 11, 28);
  ctx.fillStyle = "rgba(226,59,46,0.45)";
  ctx.fillRect(cx - half + 13, cy - 2, width - 26, 5);
}
function _wrap(ctx, text, x, y, maxW, lh) {
  const words = String(text).split(/\s+/);
  let line = "",
    yy = y;
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = t;
  }
  if (line) {
    ctx.fillText(line, x, yy);
    yy += lh;
  }
  return yy;
}
function buildCard(p) {
  const W = 1080,
    H = 1350;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d");
  const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const MON = "'Menlo','Monaco',monospace";
  ctx.fillStyle = "#06070B";
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W - 150, 220, 0, W - 150, 220, 560);
  g.addColorStop(0, "rgba(226,59,46,0.12)");
  g.addColorStop(1, "rgba(226,59,46,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#2C313B";
  ctx.lineWidth = 2;
  _round(ctx, 40, 40, W - 80, H - 80, 30);
  ctx.stroke();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.font = "800 48px " + SANS;
  ctx.fillStyle = "#ECEAE3";
  ctx.fillText("IRON", 90, 158);
  const iw = ctx.measureText("IRON").width;
  ctx.fillStyle = "#E23B2E";
  ctx.fillText("SET", 90 + iw, 158);
  if (p.type === "stat") {
    ctx.textAlign = "center";
    ctx.fillStyle = "#929AA6";
    ctx.font = "800 34px " + SANS;
    try {
      ctx.letterSpacing = "6px";
    } catch (e) {}
    ctx.fillText(String(p.label).toUpperCase(), W / 2, 575);
    try {
      ctx.letterSpacing = "0px";
    } catch (e) {}
    ctx.textAlign = "left";
    ctx.font = "700 230px " + MON;
    const vw = ctx.measureText(String(p.value)).width;
    ctx.font = "700 64px " + MON;
    const uw = p.unit ? ctx.measureText(p.unit).width : 0;
    const gap = p.unit ? 20 : 0,
      sx = (W - (vw + gap + uw)) / 2,
      by = 790;
    ctx.fillStyle = "#ECEAE3";
    ctx.font = "700 230px " + MON;
    ctx.fillText(String(p.value), sx, by);
    if (p.unit) {
      ctx.fillStyle = "#929AA6";
      ctx.font = "700 64px " + MON;
      ctx.fillText(p.unit, sx + vw + gap, by);
    }
    ctx.textAlign = "center";
    if (p.delta != null && Math.abs(p.delta) >= 1) {
      ctx.fillStyle = p.delta > 0 ? "#7FC68F" : "#E23B2E";
      ctx.font = "700 42px " + SANS;
      ctx.fillText((p.delta > 0 ? "+" : "") + p.delta + " " + (p.unit || "") + "   /   30 days", W / 2, 880);
    }
    _barbell(ctx, W / 2, 975, 380);
    if (p.sub) {
      ctx.fillStyle = "#5C6470";
      ctx.font = "700 36px " + MON;
      ctx.fillText(p.sub, W / 2, 1072);
    }
  } else if (p.type === "freshness") {
    ctx.textAlign = "center";
    ctx.fillStyle = "#929AA6";
    ctx.font = "800 30px " + SANS;
    try {
      ctx.letterSpacing = "6px";
    } catch (e) {}
    ctx.fillText("FRESHNESS FORECAST", W / 2, 300);
    try {
      ctx.letterSpacing = "0px";
    } catch (e) {}
    ctx.fillStyle = "#5C6470";
    ctx.font = "600 32px " + SANS;
    ctx.fillText("estimated capacity per lift", W / 2, 356);
    const rows = (p.rows || []).slice(0, 5);
    let y = 470;
    for (const R of rows) {
      ctx.textAlign = "left";
      ctx.fillStyle = "#ECEAE3";
      ctx.font = "800 44px " + SANS;
      ctx.fillText(R.name, 110, y);
      ctx.textAlign = "right";
      ctx.fillStyle = R.color;
      ctx.font = "700 44px " + MON;
      ctx.fillText(R.pct + "%", W - 110, y);
      ctx.fillStyle = "#5C6470";
      ctx.font = "700 26px " + SANS;
      ctx.fillText(R.note, W - 110, y + 40);
      const bx = 110,
        bw = W - 220,
        by = y + 62;
      ctx.fillStyle = "#0F1216";
      _round(ctx, bx, by, bw, 18, 9);
      ctx.fill();
      const fw = Math.max(24, bw * Math.max(0.06, Math.min(1, (R.pct - 70) / 30)));
      ctx.fillStyle = R.color;
      _round(ctx, bx, by, fw, 18, 9);
      ctx.fill();
      y += 168;
    }
    ctx.textAlign = "center";
    _barbell(ctx, W / 2, Math.min(y + 40, H - 210), 320);
  } else if (p.type === "session") {
    ctx.textAlign = "center";
    ctx.fillStyle = "#929AA6";
    ctx.font = "800 30px " + SANS;
    try {
      ctx.letterSpacing = "6px";
    } catch (e) {}
    ctx.fillText("SESSION", W / 2, 300);
    try {
      ctx.letterSpacing = "0px";
    } catch (e) {}
    ctx.fillStyle = "#ECEAE3";
    ctx.font = "800 62px " + SANS;
    ctx.fillText(p.headline || "", W / 2, 380);
    ctx.fillStyle = "#5C6470";
    ctx.font = "600 34px " + MON;
    ctx.fillText(p.sub || "", W / 2, 436);
    const rows = (p.lifts || []).slice(0, 5);
    let y = 540;
    for (const L of rows) {
      ctx.fillStyle = "#15181E";
      _round(ctx, 100, y, W - 200, 132, 18);
      ctx.fill();
      ctx.strokeStyle = "#282D35";
      ctx.lineWidth = 2;
      _round(ctx, 100, y, W - 200, 132, 18);
      ctx.stroke();
      if (L.up) {
        ctx.fillStyle = "#7FC68F";
        _round(ctx, 100, y + 22, 7, 88, 4);
        ctx.fill();
      }
      ctx.textAlign = "left";
      ctx.fillStyle = "#ECEAE3";
      ctx.font = "800 40px " + SANS;
      ctx.fillText(L.name, 148, y + 60);
      ctx.fillStyle = "#9098A4";
      ctx.font = "600 34px " + MON;
      ctx.fillText(L.detail, 148, y + 108);
      if (L.e1rm) {
        ctx.textAlign = "right";
        ctx.fillStyle = L.up ? "#7FC68F" : "#ECEAE3";
        ctx.font = "700 48px " + MON;
        ctx.fillText((L.up ? "\u25B2 " : "") + L.e1rm, W - 148, y + 74);
        ctx.fillStyle = "#5C6470";
        ctx.font = "700 22px " + SANS;
        ctx.fillText("EST 1RM", W - 148, y + 110);
      }
      ctx.textAlign = "center";
      y += 152;
    }
    _barbell(ctx, W / 2, Math.min(y + 60, H - 210), 320);
  } else {
    const accent = p.accent || "#E23B2E",
      mx = 100,
      top = 560,
      maxW = W - mx * 2 - 36;
    ctx.textAlign = "left";
    ctx.fillStyle = "#ECEAE3";
    ctx.font = "800 64px " + SANS;
    const y1 = _wrap(ctx, p.title, mx + 36, top, maxW, 78);
    ctx.fillStyle = "#9098A4";
    ctx.font = "400 42px " + SANS;
    const y2 = _wrap(ctx, p.detail, mx + 36, y1 + 36, maxW, 58);
    ctx.fillStyle = accent;
    _round(ctx, mx, top - 52, 9, y2 - 24 - (top - 52), 4);
    ctx.fill();
    _barbell(ctx, W / 2, H - 250, 300);
  }
  ctx.font = "600 30px " + SANS;
  ctx.fillStyle = "#5C6470";
  ctx.textAlign = "left";
  ctx.fillText(p.date || "", 90, H - 92);
  ctx.textAlign = "right";
  ctx.fillText("ironset", W - 90, H - 92);
  ctx.textAlign = "left";
  return cv;
}
async function shareCard(cv, filename, onPreview) {
  const blob = await new Promise(res => cv.toBlob(res, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const file = new File([blob], filename, {
    type: "image/png"
  });
  if (typeof navigator !== "undefined" && navigator.canShare && navigator.share && navigator.canShare({
    files: [file]
  })) {
    try {
      await navigator.share({
        files: [file]
      });
      URL.revokeObjectURL(url);
      return;
    } catch (e) {
      if (e && e.name === "AbortError") {
        URL.revokeObjectURL(url);
        return;
      }
    }
  }
  onPreview({
    url,
    file
  });
}
function doShare(onPreview, payload) {
  try {
    shareCard(buildCard(payload), "ironset-" + Date.now() + ".png", onPreview);
  } catch (e) {}
}

/* ----------------------------------------------------------------------------
   STRENGTH SCORE + MEET MATH — kg conversion, DOTS & Wilks coefficients, plate
   rounding, attempt defaults. Powerlifting runs in kilos on 2.5 kg jumps.
---------------------------------------------------------------------------- */
const LBKG = 2.2046226218;
const toKg = (v, unit) => unit === "kg" ? v : v / LBKG;
const fromKg = (kg, unit) => unit === "kg" ? kg : kg * LBKG;
const round2_5 = kg => Math.round(kg / 2.5) * 2.5;
function dotsCoeff(bwKg, sex) {
  const bw = Math.max(40, Math.min(sex === "female" ? 150 : 210, bwKg));
  const d = sex === "female" ? -0.0000010706 * bw ** 4 + 0.0005158568 * bw ** 3 - 0.1126655495 * bw ** 2 + 13.6175032 * bw - 57.96288 : -0.000001093 * bw ** 4 + 0.0007391293 * bw ** 3 - 0.1918759221 * bw ** 2 + 24.0900756 * bw - 307.75076;
  return 500 / d;
}
function wilksCoeff(bwKg, sex) {
  const x = Math.max(40, Math.min(sex === "female" ? 150 : 210, bwKg));
  const c = sex === "female" ? [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 0.00004731582, -0.00000009054] : [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 0.00000701863, -0.00000001291];
  const denom = c[0] + c[1] * x + c[2] * x ** 2 + c[3] * x ** 3 + c[4] * x ** 4 + c[5] * x ** 5;
  return 500 / denom;
}
// The ladder runs cool to hot, so the dial's colour means the same thing as its name.
function tierColor(d) {
  if (d == null) return C.slate;
  if (d < 200) return C.slate;
  if (d < 300) return C.blue;
  if (d < 375) return C.cyan;
  if (d < 450) return C.good;
  if (d < 500) return C.amber;
  return C.red;
}
function dotsTier(d) {
  if (d == null) return null;
  if (d < 200) return "Beginner";
  if (d < 300) return "Novice";
  if (d < 375) return "Intermediate";
  if (d < 450) return "Advanced";
  if (d < 500) return "Elite";
  return "World-class";
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const t = new Date(y, m - 1, d);
  t.setHours(0, 0, 0, 0);
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  return Math.round((t - n) / 864e5);
}
function fmtMeetDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

/* ---------------------------- small utilities ---------------------------- */
const roundTo = (x, step) => Math.round(x / step) * step;
const fmt = x => {
  if (x == null || isNaN(x)) return "—";
  const r = Math.round(x * 10) / 10;
  return Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : String(r);
};
const dshort = ts => new Date(ts).toLocaleDateString(undefined, {
  month: "short",
  day: "numeric"
});
const pad2 = n => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const dateStrFromTs = ts => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
// Today -> now (keeps order of multiple sets); a past date -> local noon of that day.
const tsFromDateStr = str => {
  if (!str || str === todayStr()) return Date.now();
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0).getTime();
};
/* ------------------------- installed-app helpers ------------------------- */
const pwa = () => typeof window !== "undefined" && window.IRONSET_PWA || {};
const isStandalone = () => {
  try {
    return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  } catch (e) {
    return false;
  }
};
const isApple = () => {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua) || /macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
};
const fmtBytes = b => {
  if (b == null || isNaN(b)) return "—";
  if (b < 1024) return `${Math.round(b)} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  if (b < 1024 * 1024 * 1024) return `${fmt(b / 1024 / 1024)} MB`;
  return `${fmt(b / 1024 / 1024 / 1024)} GB`;
};
async function storageReport() {
  const out = {
    supported: false,
    persisted: false,
    askable: false,
    usage: null,
    quota: null,
    offline: !!(navigator.serviceWorker && navigator.serviceWorker.controller),
    installed: isStandalone()
  };
  try {
    if (!navigator.storage) return out;
    out.supported = !!navigator.storage.persist;
    if (navigator.storage.persisted) out.persisted = await navigator.storage.persisted();
    out.askable = out.supported && !out.persisted;
    if (navigator.storage.estimate) {
      const e = await navigator.storage.estimate();
      out.usage = e.usage;
      out.quota = e.quota;
    }
  } catch (e) {}
  return out;
}
async function askPersist() {
  try {
    return !!(navigator.storage && navigator.storage.persist && (await navigator.storage.persist()));
  } catch (e) {
    return false;
  }
}

/* ------------------------------ set video -------------------------------
   A lifter's own footage is the only honest record of what a rep looked like.
   Video is far too big for localStorage, so the blobs live in IndexedDB and
   localStorage keeps nothing but a small index: which set has a clip, how long
   it is and what it costs. Thumbnails live in their own store so a timeline of
   twenty sets does not have to pull twenty videos into memory to draw itself.
------------------------------------------------------------------------- */
const MEDIA_DB = "ironset-media",
  S_BLOB = "blobs",
  S_THUMB = "thumbs";
let mediaDbP = null;
function mediaDb() {
  if (mediaDbP) return mediaDbP;
  mediaDbP = new Promise((res, rej) => {
    if (typeof indexedDB === "undefined") return rej(new Error("no storage for video on this browser"));
    const req = indexedDB.open(MEDIA_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(S_BLOB)) db.createObjectStore(S_BLOB);
      if (!db.objectStoreNames.contains(S_THUMB)) db.createObjectStore(S_THUMB);
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error || new Error("could not open video storage"));
  });
  return mediaDbP;
}
function mediaTx(stores, mode, fn) {
  return mediaDb().then(db => new Promise((res, rej) => {
    const tx = db.transaction(stores, mode);
    let req;
    try {
      req = fn(tx);
    } catch (e) {
      return rej(e);
    }
    tx.oncomplete = () => res(req && "result" in req ? req.result : undefined);
    tx.onerror = () => rej(tx.error);
    tx.onabort = () => rej(tx.error || new Error("video storage is full"));
  }));
}
const clipSave = (id, blob, thumb) => mediaTx([S_BLOB, S_THUMB], "readwrite", tx => {
  tx.objectStore(S_BLOB).put(blob, id);
  if (thumb) tx.objectStore(S_THUMB).put(thumb, id);
});
const clipBlob = id => mediaTx([S_BLOB], "readonly", tx => tx.objectStore(S_BLOB).get(id));
const clipThumb = id => mediaTx([S_THUMB], "readonly", tx => tx.objectStore(S_THUMB).get(id));
const clipDrop = id => mediaTx([S_BLOB, S_THUMB], "readwrite", tx => {
  tx.objectStore(S_BLOB).delete(id);
  tx.objectStore(S_THUMB).delete(id);
});
const clipKeys = () => mediaTx([S_BLOB], "readonly", tx => tx.objectStore(S_BLOB).getAllKeys());

/* What a phone will actually write. Safari gives mp4, everything else webm —
   either is fine, because the file never has to leave the browser that made it. */
const VIDEO_MIMES = ["video/mp4;codecs=avc1.42E01E", "video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
function pickMime() {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return "";
  for (const m of VIDEO_MIMES) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
}
const canRecord = () => !!(typeof MediaRecorder !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
const canCompress = () => !!(typeof MediaRecorder !== "undefined" && typeof HTMLCanvasElement !== "undefined" && HTMLCanvasElement.prototype.captureStream && pickMime());
const CLIP_MAX_SECS = 120;
const CLIP_BIG = 10 * 1024 * 1024; // above this, shrink it before keeping it
const CLIP_SIDE = 640; // long edge after shrinking — plenty to judge a rep
const CLIP_RATE = 1.1e6;
const fmtSecs = s => {
  const v = Math.max(0, Math.round(s || 0));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
};
function loadVideo(blob) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(blob);
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("muted", "");
    v.onloadedmetadata = () => res({
      v,
      url
    });
    v.onerror = () => {
      URL.revokeObjectURL(url);
      rej(new Error("that file isn't a video this browser can read"));
    };
    v.src = url;
  });
}

/* A browser's own recording carries no duration in its header until it has been
   played through, so the length reads as Infinity. Seeking past the end forces
   the real figure out. */
function videoDuration(v) {
  if (isFinite(v.duration) && v.duration > 0) return Promise.resolve(v.duration);
  return new Promise(res => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      res(isFinite(v.duration) && v.duration > 0 ? v.duration : 0);
    };
    const onTime = () => {
      if (v.currentTime > 0) {
        v.removeEventListener("timeupdate", onTime);
        finish();
      }
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("durationchange", () => {
      if (isFinite(v.duration) && v.duration > 0) finish();
    });
    setTimeout(finish, 2000);
    try {
      v.currentTime = 1e101;
    } catch (e) {
      finish();
    }
  });
}

/* One frame, a third of the way in — far enough past the un-rack to show the
   lift rather than someone walking into shot. */
async function grabThumb(blob) {
  let handle = null;
  try {
    handle = await loadVideo(blob);
    const {
      v,
      url
    } = handle;
    const dur = await videoDuration(v);
    await new Promise(res => {
      let settled = false;
      const go = () => {
        if (!settled) {
          settled = true;
          res();
        }
      };
      v.onseeked = go;
      setTimeout(go, 1800);
      try {
        v.currentTime = Math.min(Math.max(0.1, dur * 0.33), Math.max(0, dur - 0.05));
      } catch (e) {
        go();
      }
    });
    const w = v.videoWidth,
      h = v.videoHeight;
    let thumb = null;
    if (w && h) {
      const k = Math.min(1, 300 / Math.max(w, h));
      const c = document.createElement("canvas");
      c.width = Math.max(2, Math.round(w * k));
      c.height = Math.max(2, Math.round(h * k));
      try {
        c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
        thumb = c.toDataURL("image/jpeg", 0.7);
        if (thumb.length < 400) thumb = null;
      } catch (e) {
        thumb = null;
      }
    }
    URL.revokeObjectURL(url);
    return {
      dur,
      w,
      h,
      thumb
    };
  } catch (e) {
    if (handle) URL.revokeObjectURL(handle.url);
    return {
      dur: 0,
      w: 0,
      h: 0,
      thumb: null
    };
  }
}

/* Re-records the clip through a canvas at a sane size and bitrate. It runs in
   real time because that is the only way every phone browser can do it — hence
   the progress bar. A phone's own camera roll clip can be 60MB; this lands
   around 1.5MB for a working set, which is the difference between keeping
   fifteen videos and keeping a training year of them. */
async function shrinkVideo(blob, onProgress, shouldStop) {
  if (!canCompress()) return null;
  const mime = pickMime();
  let handle;
  try {
    handle = await loadVideo(blob);
  } catch (e) {
    return null;
  }
  const {
    v,
    url
  } = handle;
  const sw = v.videoWidth,
    sh = v.videoHeight;
  if (!sw || !sh) {
    URL.revokeObjectURL(url);
    return null;
  }
  const k = Math.min(1, CLIP_SIDE / Math.max(sw, sh));
  const c = document.createElement("canvas");
  c.width = Math.max(2, Math.round(sw * k / 2) * 2);
  c.height = Math.max(2, Math.round(sh * k / 2) * 2);
  const ctx = c.getContext("2d");
  let stream, rec;
  try {
    stream = c.captureStream(30);
    rec = new MediaRecorder(stream, {
      mimeType: mime,
      videoBitsPerSecond: CLIP_RATE
    });
  } catch (e) {
    URL.revokeObjectURL(url);
    return null;
  }
  const chunks = [];
  rec.ondataavailable = e => {
    if (e.data && e.data.size) chunks.push(e.data);
  };
  const stopped = new Promise(res => {
    rec.onstop = res;
  });
  rec.start(500);
  let raf = 0,
    cancelled = false;
  const tick = () => {
    try {
      ctx.drawImage(v, 0, 0, c.width, c.height);
    } catch (e) {}
    if (onProgress && v.duration) onProgress(Math.min(1, v.currentTime / v.duration));
    if (shouldStop && shouldStop()) {
      cancelled = true;
      try {
        v.pause();
      } catch (e) {}
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  try {
    await v.play();
  } catch (e) {
    URL.revokeObjectURL(url);
    return null;
  }
  tick();
  await new Promise(res => {
    v.onended = res;
    const guard = setInterval(() => {
      if (cancelled || v.ended) {
        clearInterval(guard);
        res();
      }
    }, 250);
  });
  if (raf) cancelAnimationFrame(raf);
  try {
    rec.stop();
  } catch (e) {}
  await stopped;
  try {
    stream.getTracks().forEach(t => t.stop());
  } catch (e) {}
  URL.revokeObjectURL(url);
  if (cancelled || !chunks.length) return null;
  return new Blob(chunks, {
    type: mime
  });
}

/* Oldest clips go first when the budget runs out, and the lifter is told which
   ones went. Half the quota, capped — the log itself must never be squeezed
   out by footage. */
async function clipBudget() {
  try {
    if (!navigator.storage || !navigator.storage.estimate) return 400 * 1024 * 1024;
    const e = await navigator.storage.estimate();
    if (!e.quota) return 400 * 1024 * 1024;
    return Math.max(60 * 1024 * 1024, Math.min(2 * 1024 * 1024 * 1024, Math.floor(e.quota * 0.5)));
  } catch (e) {
    return 400 * 1024 * 1024;
  }
}
const clipBytes = clips => Object.values(clips || {}).reduce((a, c) => a + (c.bytes || 0), 0);
async function pruneClips(clips, keepId) {
  const budget = await clipBudget();
  let total = clipBytes(clips);
  if (total <= budget) return [];
  const order = Object.entries(clips || {}).filter(([id]) => id !== keepId).sort((a, b) => (a[1].ts || 0) - (b[1].ts || 0));
  const gone = [];
  for (const [id, c] of order) {
    if (total <= budget) break;
    try {
      await clipDrop(id);
    } catch (e) {}
    total -= c.bytes || 0;
    gone.push(id);
  }
  return gone;
}
function platesPerSide(total, bar, denoms) {
  let side = (total - bar) / 2;
  if (side < -0.01) return {
    below: true,
    items: [],
    leftover: 0
  };
  const items = [];
  for (const p of denoms) {
    const c = Math.floor(side / p + 1e-6);
    if (c > 0) {
      items.push({
        p,
        c
      });
      side -= c * p;
    }
  }
  return {
    below: false,
    items,
    leftover: Math.round(side * 100) / 100
  };
}
// One-line plate summary for compact rows, e.g. "2×45 + 25 + 5 / side".
function platesShort(total, bar, denoms) {
  const r = platesPerSide(total, bar, denoms);
  if (r.below) return "under bar";
  if (!r.items.length) return "bar only";
  return r.items.map(it => it.c > 1 ? it.c + "×" + fmt(it.p) : fmt(it.p)).join(" + ") + " / side";
}

/* -------------------------------- theme ---------------------------------- */
// Direction: a strength-sport instrument. Cool powder-coated steel, chalk-white
// text, one iron-red accent (the 25kg-plate red). Tabular monospace numerals
// read like a meet scoreboard; heavy tracked caps read athletic.
const C = {
  bg: "#06070B",
  bg2: "#0C0E15",
  surface: "#12151E",
  surface2: "#1A1F2B",
  line: "#212637",
  line2: "#2E3547",
  text: "#F3F2ED",
  chalk: "#F3F2ED",
  muted: "#99A1B2",
  faint: "#5D6578",
  red: "#FF4A3D",
  redHi: "#FF7A6B",
  redSoft: "rgba(255,74,61,0.12)",
  redLine: "rgba(255,74,61,0.42)",
  blue: "#5B7CFF",
  amber: "#F7A93B",
  good: "#3ED88A",
  goodHi: "#3ED88A",
  gold: "#F7A93B",
  violet: "#8B6FFF",
  cyan: "#2ED3C6",
  slate: "#7C879B"
};
// Every lift owns a colour, and keeps it everywhere it appears — its trend line, its
// sparkline, its badge, the dot beside its name in a list. Three screens deep you
// should know which lift a chart belongs to before you read the label.
const LIFT_HUE = {
  "Squat": C.red,
  "Bench Press": C.violet,
  "Deadlift": C.amber,
  "Overhead Press": C.cyan
};
// Deliberately excludes the four main-lift hues: an accessory that comes out the same
// amber as your deadlift makes the colour mean nothing. It also leaves out the green
// the calendar uses for a day you trained, so a dot never means two things at once.
const HUE_CYCLE = [C.blue, "#E06AA8", "#9BD15B", C.slate, "#C98BE8", "#4FBFA8"];
// A variation inherits its parent's colour, because that is the question it answers:
// a Pause Squat line is only interesting next to the Squat line it feeds.
function hueFor(name, state) {
  if (!name) return C.slate;
  if (LIFT_HUE[name]) return LIFT_HUE[name];
  const ex = state && state.exercises && state.exercises[name];
  if (ex && ex.parent && LIFT_HUE[ex.parent]) return LIFT_HUE[ex.parent];
  // Anything else gets a stable colour from its name, so it never changes between
  // sessions and two movements in the same list rarely collide.
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) >>> 0;
  return HUE_CYCLE[h % HUE_CYCLE.length];
}
// Softened to sit under text or behind a chart without shouting.
const tint = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${a})`;
};
// gradient system — colour carries meaning, dark ground keeps it serious
const G = {
  red: "linear-gradient(135deg, #FF6B54 0%, #D62B1C 100%)",
  blue: "linear-gradient(135deg, #7C97FF 0%, #3A4FD8 100%)",
  amber: "linear-gradient(135deg, #FFC978 0%, #E08A0B 100%)",
  green: "linear-gradient(135deg, #6BEBAA 0%, #17A362 100%)",
  card: "linear-gradient(168deg, #161A25 0%, #0F121A 100%)"
};
const R = {
  ctrl: 12,
  input: 12,
  surface: 20,
  sheet: 26,
  pill: 999
};
const ELEV = "0 10px 26px -14px rgba(0,0,0,0.85)";
const ELEV_HI = "0 18px 42px -16px rgba(0,0,0,0.9)";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const DISPLAY = "'Oswald', 'Inter', system-ui, sans-serif";
const SKETCH = MONO;
const label2 = {
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 700,
  fontSize: 9,
  fontFamily: SANS
};
const label = {
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  fontWeight: 700,
  fontSize: 10.5,
  color: C.muted,
  fontFamily: SANS
};

/* ----------------------------- UI primitives ----------------------------- */
function Btn({
  children,
  onClick,
  kind = "ghost",
  style,
  disabled,
  as
}) {
  const [down, setDown] = useState(false);
  const base = {
    fontFamily: SANS,
    fontWeight: 700,
    fontSize: 15,
    borderRadius: R.pill,
    padding: "14px 20px",
    border: "1px solid transparent",
    cursor: disabled ? "default" : "pointer",
    minHeight: 50,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    WebkitTapHighlightColor: "transparent",
    transform: down ? "scale(0.985)" : "scale(1)",
    filter: down ? "brightness(0.92)" : "none",
    transition: "transform .09s ease, filter .09s ease"
  };
  const kinds = {
    primary: disabled ? {
      background: "rgba(255,255,255,0.04)",
      color: C.faint,
      borderColor: C.line
    } : {
      background: G.red,
      color: "#fff",
      boxShadow: "0 8px 22px -10px rgba(255,74,61,0.7)"
    },
    solid: {
      background: C.surface2,
      color: C.text,
      borderColor: C.line2,
      opacity: disabled ? 0.45 : 1
    },
    ghost: {
      background: "transparent",
      color: disabled ? C.faint : C.text,
      borderColor: C.line2
    },
    danger: {
      background: "transparent",
      color: C.red,
      borderColor: C.redLine,
      opacity: disabled ? 0.45 : 1
    }
  };
  const press = disabled ? {} : {
    onPointerDown: () => setDown(true),
    onPointerUp: () => setDown(false),
    onPointerLeave: () => setDown(false),
    onPointerCancel: () => setDown(false)
  };
  /* A <label> or <a> wrapping a real <button> swallows the click, so file
     pickers and downloads get the same control rendered as a span. */
  const Tag = as === "span" ? "span" : "button";
  /* Dropping the handler and greying it was the whole of "disabled" here, which
     left a real <button> that still focused, still announced itself as ready to
     press, and did nothing when it was. Say it where it counts. */
  const extra = as === "span" ? {
    role: "button",
    "aria-disabled": disabled || undefined
  } : {
    disabled: !!disabled
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    onClick: disabled ? undefined : onClick
  }, press, extra, {
    style: {
      ...base,
      ...kinds[kind],
      ...style
    }
  }), children);
}
function Chip({
  active,
  children,
  onClick,
  sm
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: sm ? 11.5 : 13.5,
      borderRadius: R.pill,
      padding: sm ? "6px 11px" : "9px 16px",
      minHeight: sm ? 28 : 38,
      cursor: "pointer",
      whiteSpace: "nowrap",
      WebkitTapHighlightColor: "transparent",
      transition: "background .15s ease, color .15s ease, border-color .15s ease",
      background: active ? G.red : "rgba(255,255,255,0.03)",
      color: active ? "#fff" : C.muted,
      border: `1px solid ${active ? "transparent" : C.line}`,
      boxShadow: "none"
    }
  }, children);
}
function Segmented({
  value,
  onChange,
  options
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${C.line}`,
      borderRadius: R.pill,
      padding: 3
    }
  }, options.map(o => {
    const a = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      onClick: () => onChange(o.value),
      style: {
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 13,
        padding: "8px 16px",
        borderRadius: R.pill,
        cursor: "pointer",
        border: "none",
        minHeight: 36,
        WebkitTapHighlightColor: "transparent",
        transition: "background .15s ease, color .15s ease",
        background: a ? C.surface2 : "transparent",
        color: a ? C.text : C.muted
      }
    }, o.label);
  }));
}
function Stepper({
  value,
  onChange,
  step = 1,
  min = -Infinity,
  max = Infinity,
  suffix,
  compact
}) {
  const set = v => onChange(Math.min(max, Math.max(min, Math.round(v / step) * step)));
  const btn = {
    width: compact ? 30 : 36,
    height: compact ? 32 : 40,
    borderRadius: R.pill,
    border: `1px solid ${C.line}`,
    background: "rgba(255,255,255,0.03)",
    color: C.muted,
    fontSize: compact ? 16 : 19,
    fontWeight: 500,
    cursor: "pointer",
    lineHeight: 1,
    WebkitTapHighlightColor: "transparent"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: compact ? 5 : 7
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: () => set(value - step)
  }, "\u2212"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: compact ? 18 : 27,
      fontWeight: 700,
      minWidth: compact ? 26 : 58,
      textAlign: "center",
      color: C.text,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-0.035em",
      textShadow: "0 0 26px rgba(255,255,255,0.14)"
    }
  }, fmt(value), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 12,
      color: C.faint,
      marginLeft: 1,
      fontWeight: 600
    }
  }, suffix) : null), /*#__PURE__*/React.createElement("button", {
    style: btn,
    onClick: () => set(value + step)
  }, "+"));
}
function NumField({
  value,
  onChange,
  suffix
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line}`,
      borderRadius: R.input,
      padding: "0 13px",
      height: 48,
      backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.035), transparent 60%)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    inputMode: "decimal",
    type: "number",
    style: {
      width: "100%",
      background: "transparent",
      border: "none",
      outline: "none",
      color: C.text,
      fontFamily: MONO,
      fontSize: 18,
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums"
    }
  }), suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint,
      fontSize: 12.5,
      fontWeight: 600,
      marginLeft: 6,
      fontFamily: SANS
    }
  }, suffix) : null);
}
function DateField({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: value,
    max: todayStr(),
    onChange: e => onChange(e.target.value || todayStr()),
    style: {
      width: "100%",
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line}`,
      borderRadius: R.input,
      padding: "0 13px",
      height: 48,
      color: C.text,
      fontFamily: MONO,
      fontSize: 15.5,
      fontWeight: 700,
      backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.035), transparent 60%)",
      outline: "none",
      colorScheme: "dark"
    }
  });
}
function Card({
  children,
  style,
  glow,
  accent,
  onClick
}) {
  const A = accent || null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      cursor: onClick ? "pointer" : undefined,
      background: G.card,
      border: `1px solid ${C.line}`,
      borderRadius: R.surface,
      padding: 17,
      boxShadow: ELEV,
      position: "relative",
      overflow: "hidden",
      ...style
    }
  }, A && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      pointerEvents: "none",
      background: `linear-gradient(90deg, transparent 4%, ${A}, transparent 96%)`,
      opacity: 0.8
    }
  }), (glow && glow !== "none" || A && !glow) && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: glow && glow !== "none" ? glow : `radial-gradient(135% 95% at 10% -14%, ${A}22, transparent 68%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, children));
}
// section marker — a tinted bar instead of another bare label
function SectionHead({
  children,
  accent,
  right,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 14,
      borderRadius: 2,
      background: accent || C.red,
      boxShadow: `0 0 10px ${accent || C.red}88`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: label
  }, children)), right), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.faint,
      marginTop: 6,
      lineHeight: 1.5
    }
  }, sub));
}
/* --------------------------- the quiet primitives -------------------------
   Three shapes carry most of the app now. A line the app wants to say gets a
   dot and a colour rather than another stretch of coloured text. A number you
   can change gets a chip with its name above it. And the day's movements get
   one strip instead of a card the size of a hand.
------------------------------------------------------------------------- */

// One sentence the app wants you to read, with a dot that says how to take it.
function Callout({
  tone = "muted",
  children,
  style
}) {
  const col = tone === "warn" ? C.gold : tone === "good" ? C.good : tone === "bad" ? C.red : tone === "info" ? C.blue : C.muted;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 9,
      padding: "8px 11px",
      borderRadius: R.ctrl,
      background: tint(col, 0.07),
      border: `1px solid ${tint(col, 0.22)}`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 4,
      background: col,
      flexShrink: 0,
      marginTop: 5,
      boxShadow: `0 0 8px ${col}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: C.text,
      lineHeight: 1.45,
      fontWeight: 600,
      minWidth: 0
    }
  }, children));
}

/* A number with its name above it. Flat, legible at arm's length, and — where
   it is something you set rather than something you are told — a minus and a
   plus sitting right under the thumb. */
function StatChip({
  label: lbl,
  value,
  suffix,
  onStep,
  step = 1,
  min = -Infinity,
  max = Infinity,
  tone,
  input,
  onInput,
  wide
}) {
  const col = tone || C.text;
  const bump = d => {
    if (!onStep) return;
    const base = typeof value === "number" ? value : parseFloat(value) || 0;
    onStep(Math.min(max, Math.max(min, Math.round((base + d * step) / step) * step)));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: wide ? "1.3 1 0" : "1 1 0",
      minWidth: 0,
      background: "rgba(255,255,255,0.035)",
      border: `1px solid ${C.line}`,
      borderRadius: R.ctrl,
      padding: "9px 8px 8px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      fontSize: 8.5,
      marginBottom: 5
    }
  }, lbl), input ? /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onInput(e.target.value),
    inputMode: "decimal",
    style: {
      width: "100%",
      background: "none",
      border: "none",
      outline: "none",
      textAlign: "center",
      fontFamily: MONO,
      fontSize: 21,
      fontWeight: 700,
      color: col,
      letterSpacing: "-0.03em",
      padding: 0,
      fontVariantNumeric: "tabular-nums"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 21,
      fontWeight: 700,
      color: col,
      lineHeight: 1,
      letterSpacing: "-0.03em",
      fontVariantNumeric: "tabular-nums"
    }
  }, value, suffix ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginLeft: 2
    }
  }, suffix) : null), onStep && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      marginTop: 7
    }
  }, [-1, 1].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => bump(d),
    style: {
      flex: 1,
      height: 28,
      borderRadius: 8,
      border: `1px solid ${C.line}`,
      background: "rgba(255,255,255,0.03)",
      color: C.muted,
      fontSize: 15,
      fontWeight: 500,
      cursor: "pointer",
      lineHeight: 1,
      WebkitTapHighlightColor: "transparent"
    }
  }, d < 0 ? "−" : "+"))));
}

/* Chip-sized names. "Conventional Deadlift" does not fit on a thumb, and the
   words that get dropped are the ones every lifter drops in speech anyway. */
const SHORT_LIFT = [[/^competition /i, ""], [/^conventional /i, ""], [/^low-?bar /i, ""], [/^high-?bar /i, ""], [/^barbell /i, ""], [/^dumbbell /i, "DB "], [/^romanian deadlift/i, "RDL"], [/^overhead press/i, "OHP"], [/^bench press/i, "Bench"], [/^close.?grip bench.*/i, "CG Bench"], [/^front squat/i, "Front Sq"], [/^pause squat/i, "Pause Sq"], [/ press$/i, " Press"]];
function shortLift(name) {
  let n = String(name || "");
  for (const [re, to] of SHORT_LIFT) if (re.test(n)) {
    n = n.replace(re, to);
    break;
  }
  n = n.trim();
  return n.length > 15 ? n.slice(0, 14).trimEnd() + "…" : n;
}

// The day, as one line you can thumb along. Dots say how far into each movement
// you are, so the session is legible without reading a word.
function MoveStrip({
  moves,
  current,
  onPick,
  onAdd,
  addLabel
}) {
  if (!moves.length && !onAdd) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      overflowX: "auto",
      padding: "2px 16px 10px",
      margin: "0 -16px",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none"
    }
  }, moves.map(m => {
    const on = m.ex === current;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: () => onPick(m),
      style: {
        flex: "0 0 auto",
        cursor: "pointer",
        background: on ? tint(m.hue, 0.16) : "rgba(255,255,255,0.03)",
        border: `1px solid ${on ? tint(m.hue, 0.5) : C.line}`,
        /* A superset is one block of work, so its chips square up against each
           other and round only on the outside — the pairing reads before the
           tags do. */
        borderRadius: m.tag ? m.tagFirst ? `${R.pill}px 6px 6px ${R.pill}px` : m.tagLast ? `6px ${R.pill}px ${R.pill}px 6px` : "6px" : R.pill,
        marginLeft: m.tag && !m.tagFirst ? -5 : 0,
        padding: "8px 13px 7px",
        color: on ? C.text : C.muted,
        textAlign: "left",
        WebkitTapHighlightColor: "transparent",
        opacity: m.done && !on ? 0.55 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 12.5,
        whiteSpace: "nowrap",
        letterSpacing: "-0.01em"
      }
    }, m.done ? /*#__PURE__*/React.createElement(Check, {
      size: 11,
      style: {
        color: C.good,
        marginRight: 4,
        verticalAlign: "-1px"
      }
    }) : null, m.tag ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 10.5,
        color: on ? m.hue : C.faint,
        marginRight: 5
      }
    }, m.tag) : null, m.short), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 3,
        marginTop: 5
      }
    }, Array.from({
      length: Math.min(8, m.total)
    }).map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: 5,
        height: 3,
        borderRadius: 2,
        background: i < m.n ? on ? m.hue : C.good : "rgba(255,255,255,0.14)"
      }
    }))));
  }), onAdd && /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    "aria-label": addLabel || "Another lift",
    style: {
      flex: "0 0 auto",
      cursor: "pointer",
      background: "none",
      border: `1px dashed ${C.line2}`,
      borderRadius: R.pill,
      padding: "8px 13px 7px",
      color: C.muted,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 12.5,
      whiteSpace: "nowrap",
      letterSpacing: "-0.01em"
    }
  }, addLabel || "Another lift")));
}
function Grid2({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 11,
      ...style
    }
  }, children);
}
// tiny trend line for stat tiles
function Spark({
  points,
  color,
  w = 96,
  h = 34
}) {
  const ys = (points || []).map(p => p && p.value != null ? p.value : p).slice(-24);
  if (ys.length < 2) return /*#__PURE__*/React.createElement("div", {
    style: {
      height: h
    }
  });
  const lo = Math.min.apply(null, ys),
    hi = Math.max.apply(null, ys),
    sp = hi - lo || 1;
  const X = i => i / (ys.length - 1) * w;
  const Y = v => h - 4 - (v - lo) / sp * (h - 9);
  const d = ys.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  const uid = "sp" + Math.abs(ys.length * 31 + Math.round(ys[0] || 0)).toString(36);
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: h,
    viewBox: `0 0 ${w} ${h}`,
    preserveAspectRatio: "none",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: uid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.42"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: `${d} L${w} ${h} L0 ${h} Z`,
    fill: `url(#${uid})`
  }), /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: color,
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
/* ------------------------- visualisation primitives ----------------------- */
// A number is a fact; a number with its recent shape beside it is information. These
// four carry almost every figure in the app, which is what keeps the screens looking
// like one instrument rather than a pile of cards.

// Progress as a ring. The gradient runs cool-to-hot around the arc so the value reads
// before the numeral does.
function Ring({
  value,
  max = 100,
  size = 112,
  stroke = 9,
  color = C.red,
  trail = "rgba(255,255,255,0.06)",
  children
}) {
  const uid = useMemo(() => "r" + Math.random().toString(36).slice(2, 8), []);
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, (value || 0) / (max || 1)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      display: "block",
      transform: "rotate(-90deg)"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: uid,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: tint(color, 0.55)
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: trail,
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: `url(#${uid})`,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: `${(c * pct).toFixed(2)} ${c.toFixed(2)}`,
    style: {
      transition: "stroke-dasharray .5s cubic-bezier(.4,0,.2,1)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1
    }
  }, children));
}

// Discrete bars for a short series — a week of sessions, a week of readiness. The last
// bar is the live one and carries full colour; the rest recede.
function MiniBars({
  values,
  color = C.red,
  h = 30,
  gap = 3,
  labels
}) {
  const vs = values || [];
  if (!vs.length) return /*#__PURE__*/React.createElement("div", {
    style: {
      height: h
    }
  });
  const hi = Math.max.apply(null, vs.map(v => v || 0)) || 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap,
      height: h
    }
  }, vs.map((v, i) => {
    const live = i === vs.length - 1;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        height: "100%",
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: `${Math.max(v ? 12 : 4, (v || 0) / hi * 100)}%`,
        borderRadius: 3,
        background: v ? live ? color : tint(color, 0.58) : "rgba(255,255,255,0.07)",
        transition: "height .4s ease"
      }
    }), labels && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 8,
        fontFamily: MONO,
        color: live ? C.muted : C.faint,
        textAlign: "center",
        lineHeight: 1
      }
    }, labels[i]));
  }));
}

// A half-dial built from discrete ticks rather than a solid arc, so it reads as a
// gauge on an instrument instead of a loading spinner.
function ArcGauge({
  value,
  max = 100,
  color = C.red,
  size = 168,
  ticks = 36,
  children
}) {
  const pct = Math.max(0, Math.min(1, (value || 0) / (max || 1)));
  const lit = Math.round(pct * ticks);
  const R0 = size / 2,
    inner = R0 - 20;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size * 0.62,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size * 0.62,
    viewBox: `0 0 ${size} ${size * 0.62}`,
    style: {
      display: "block"
    }
  }, Array.from({
    length: ticks
  }).map((_, i) => {
    const a = Math.PI * (i / (ticks - 1));
    const x1 = R0 - Math.cos(a) * inner,
      y1 = R0 - Math.sin(a) * inner;
    const x2 = R0 - Math.cos(a) * (inner + 13),
      y2 = R0 - Math.sin(a) * (inner + 13);
    const on = i < lit;
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      strokeLinecap: "round",
      strokeWidth: "3.4",
      stroke: on ? color : "rgba(255,255,255,0.07)",
      opacity: on ? 0.45 + 0.55 * (i / Math.max(1, ticks - 1)) : 1
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2
    }
  }, children));
}

// The workhorse: a figure, its unit, its name, and optionally the shape behind it.
function StatTile({
  value,
  unit,
  label,
  color = C.red,
  spark,
  bars,
  barLabels,
  segments,
  sub,
  action,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: "relative",
      overflow: "hidden",
      background: G.card,
      border: `1px solid ${C.line}`,
      borderRadius: R.surface,
      padding: "14px 15px 13px",
      cursor: onClick ? "pointer" : undefined,
      boxShadow: ELEV,
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 99,
      background: color,
      flexShrink: 0,
      boxShadow: `0 0 8px ${tint(color, 0.8)}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: C.muted,
      minWidth: 0,
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, label), action), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: "-0.03em",
      lineHeight: 1
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: C.muted,
      fontWeight: 600
    }
  }, unit)), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 5,
      lineHeight: 1.4
    }
  }, sub), bars && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(MiniBars, {
    values: bars,
    color: color,
    labels: barLabels,
    h: 28
  })), segments && segments.length > 0 && (() => {
    const tot = segments.reduce((a, x) => a + (x.value || 0), 0) || 1;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 11
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 2,
        height: 5,
        borderRadius: 3,
        overflow: "hidden"
      }
    }, segments.map((x, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: `${Math.max(0.02, (x.value || 0) / tot)}`,
        background: x.color,
        borderRadius: 2,
        transition: "flex .4s ease"
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginTop: 7,
        overflow: "hidden"
      }
    }, segments.map((x, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        flexShrink: 0,
        fontSize: 9,
        color: C.faint,
        fontFamily: MONO,
        fontWeight: 600,
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 5,
        height: 5,
        borderRadius: 99,
        background: x.color
      }
    }), x.short))));
  })(), spark && spark.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "10px -15px -13px",
      opacity: 0.95
    }
  }, /*#__PURE__*/React.createElement(Spark, {
    points: spark,
    color: color,
    h: 38
  })));
}

// legend / filter pill
function Tag({
  color,
  children,
  onClick,
  active
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: active ? C.surface2 : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? C.line2 : C.line}`,
      borderRadius: R.pill,
      padding: "6px 12px",
      fontSize: 12,
      fontWeight: 600,
      fontFamily: SANS,
      color: active ? C.text : C.muted,
      cursor: onClick ? "pointer" : "default",
      whiteSpace: "nowrap"
    }
  }, color && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 99,
      background: color
    }
  }), children);
}
// Pinning the page while a sheet is up. iOS will happily scroll whatever is behind
// an overlay once the overlay's own list hits its end, which is why reaching for a
// movement would drag the screen underneath instead. Fixing the body is the only
// thing Safari reliably respects; the scroll offset is parked in `top` and put back
// on close so the page does not jump.
function useScrollLock(open) {
  useEffect(() => {
    if (!open) return;
    const b = document.body,
      y = window.scrollY || window.pageYOffset || 0;
    const prev = {
      position: b.style.position,
      top: b.style.top,
      left: b.style.left,
      right: b.style.right,
      width: b.style.width,
      overflow: b.style.overflow
    };
    b.style.position = "fixed";
    b.style.top = `-${y}px`;
    b.style.left = "0";
    b.style.right = "0";
    b.style.width = "100%";
    b.style.overflow = "hidden";
    return () => {
      b.style.position = prev.position;
      b.style.top = prev.top;
      b.style.left = prev.left;
      b.style.right = prev.right;
      b.style.width = prev.width;
      b.style.overflow = prev.overflow;
      // The document is only viewport-high while the body is fixed, so scrolling
      // back before layout recovers clamps to the top. Read a layout property to
      // force the reflow, then restore the offset.
      void b.offsetHeight;
      window.scrollTo(0, y);
    };
  }, [open]);
}
function Sheet({
  open,
  onClose,
  title,
  children
}) {
  useScrollLock(open);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    onTouchMove: e => e.stopPropagation(),
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.62)",
      zIndex: 50,
      overscrollBehavior: "contain",
      touchAction: "none",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      backdropFilter: "blur(2px)",
      WebkitBackdropFilter: "blur(2px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 480,
      background: C.bg2,
      borderTop: `1px solid ${C.line2}`,
      overscrollBehavior: "contain",
      touchAction: "pan-y",
      borderRadius: `${R.sheet}px ${R.sheet}px 0 0`,
      padding: 18,
      maxHeight: "85vh",
      overflowY: "auto",
      boxShadow: "0 -20px 50px -20px rgba(0,0,0,0.8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 2,
      background: C.line2,
      margin: "-4px auto 14px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 13,
      fontFamily: DISPLAY,
      letterSpacing: "0.08em",
      fontWeight: 800
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: "none",
      border: "none",
      color: C.muted,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 22
  }))), children));
}

/* ------------------------------ how-to search ----------------------------- */
// A movement you don't know is one tap from someone demonstrating it. This searches
// rather than shipping footage, which is what makes it cover everything: all 360
// catalogue movements and anything you named yourself, including the variations a
// stock exercise database has never heard of — there is plenty of Spoto Press and
// Pendlay Row on lifting YouTube. It also adds nothing to the file and needs no API
// key, which matters because IRONSET is a static page: a key in it would be readable
// by anyone with the link.
//
// Most names are specific enough to search for as they are. These few mean something
// else on their own — a French Press is coffee and "21s" is nothing — so they look
// for something findable instead.
const SEARCH_AS = {
  "21s": "21s biceps curl",
  "Dip": "triceps dip",
  "Weighted Dip": "weighted triceps dip",
  "Machine Dip": "machine triceps dip",
  "Bench Dip": "bench triceps dip",
  "French Press": "french press triceps extension",
  "Rower": "rowing machine technique",
  "Jackknife": "jackknife abs exercise",
  "Hex Hold": "hex dumbbell hold grip",
  "Stir the Pot": "stir the pot ab exercise",
  "Dead Bug": "dead bug core exercise",
  "Bird Dog": "bird dog core exercise",
  "Y Raise": "y raise shoulder exercise",
  "Easy Walk": "zone 2 walking",
  "Press": "overhead press",
  "Clean": "power clean",
  "Snatch": "snatch weightlifting",
  "Bench": "bench press",
  "Squat": "barbell back squat",
  "Deadlift": "conventional deadlift"
};
const howToUrl = name => "https://www.youtube.com/results?search_query=" + encodeURIComponent(SEARCH_AS[name] || name + " form");
// An anchor rather than a button: in a home-screen app a real link opens the browser,
// where window.open can be swallowed. target="_blank" keeps IRONSET itself loaded, so
// coming back is one swipe and nothing in the session is lost.
function HowTo({
  name,
  size = 28,
  style
}) {
  if (!name) return null;
  return /*#__PURE__*/React.createElement("a", {
    href: howToUrl(name),
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": `Watch how to do ${name}`,
    onClick: e => e.stopPropagation(),
    style: {
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: 999,
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${C.line2}`,
      color: C.muted,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      textDecoration: "none",
      WebkitTapHighlightColor: "transparent",
      ...style
    }
  }, /*#__PURE__*/React.createElement(Play, {
    size: Math.round(size * 0.42)
  }));
}

/* ------------------------------ line chart ------------------------------- */
// Round a raw axis step to a human number (1, 2, 2.5, 5, 10 x a power of ten), so the
// y-axis reads 575/600/625 instead of 586/616/647.
function niceStep(range, target) {
  const raw = (range || 1) / Math.max(1, target);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}
// Catmull-Rom to cubic bezier, with control points clamped inside each segment so the
// curve stays smooth without ever overshooting a real logged value.
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
  const T = 0.2;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[i + 2] || p2;
    const lo = Math.min(p1[1], p2[1]),
      hi = Math.max(p1[1], p2[1]);
    const c1x = p1[0] + (p2[0] - p0[0]) * T,
      c2x = p2[0] - (p3[0] - p1[0]) * T;
    const c1y = Math.max(lo, Math.min(hi, p1[1] + (p2[1] - p0[1]) * T));
    const c2y = Math.max(lo, Math.min(hi, p2[1] - (p3[1] - p1[1]) * T));
    d += " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + ", " + c2x.toFixed(1) + " " + c2y.toFixed(1) + ", " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
  }
  return d;
}
function LineChart({
  data,
  color = C.red,
  height = 176,
  unit = ""
}) {
  const uid = useMemo(() => "c" + Math.random().toString(36).slice(2, 8), []);
  if (!data || data.length === 0) return /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.faint,
      fontSize: 13,
      padding: "36px 4px",
      textAlign: "center"
    }
  }, "No data yet \u2014 log a set to start your trend.");
  const W = 320,
    H = height,
    gutter = 38,
    padR = 14,
    padT = 28,
    padB = 26;
  const xs = data.map(d => d.ts),
    ys = data.map(d => d.value);
  const lo = Math.min(...ys),
    hi = Math.max(...ys),
    mid = (lo + hi) / 2;
  // Keep small changes from looking like a cliff, then snap the window to round numbers.
  const half = Math.max((hi - lo) / 2 * 1.3, mid * 0.045, 5);
  const step = niceStep(half * 2, 4);
  const minY = Math.floor((mid - half) / step) * step;
  const maxY = Math.ceil((mid + half) / step) * step;
  const ticks = [];
  for (let v = minY; v <= maxY + 0.001; v += step) ticks.push(v);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    spanX = maxX - minX || 1;
  const px = t => gutter + (t - minX) / spanX * (W - gutter - padR);
  const py = v => padT + (1 - (v - minY) / (maxY - minY)) * (H - padT - padB);
  const pts = data.map(d => [px(d.ts), py(d.value)]);
  const line = smoothPath(pts);
  const base = (H - padB).toFixed(1);
  const area = pts.length > 1 ? line + " L" + pts[pts.length - 1][0].toFixed(1) + " " + base + " L" + pts[0][0].toFixed(1) + " " + base + " Z" : "";
  const last = pts[pts.length - 1],
    lastVal = data[data.length - 1].value;
  const showBest = ys.indexOf(hi) !== data.length - 1 && data.length > 3 && hi - lastVal > (maxY - minY) * 0.04;
  const labW = 56,
    labX = Math.max(gutter, Math.min(last[0] - labW / 2, W - padR - labW));
  const labY = Math.max(15, last[1] - 24);
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 " + W + " " + H,
    style: {
      width: "100%",
      height: "auto",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: uid + "a",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.32"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "55%",
    stopColor: color,
    stopOpacity: "0.10"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: uid + "l",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#6D7885"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "60%",
    stopColor: tint(color, 0.62)
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color
  }))), ticks.map((v, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: gutter,
    x2: W - padR,
    y1: py(v),
    y2: py(v),
    stroke: C.line,
    strokeWidth: "1",
    strokeDasharray: "2 4",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("text", {
    x: gutter - 8,
    y: py(v) + 3,
    fill: C.faint,
    fontSize: "8.5",
    fontFamily: MONO,
    textAnchor: "end"
  }, fmt(v)))), showBest && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("line", {
    x1: gutter,
    x2: W - padR,
    y1: py(hi),
    y2: py(hi),
    stroke: C.good,
    strokeWidth: "1",
    strokeDasharray: "3 3",
    opacity: "0.4"
  }), /*#__PURE__*/React.createElement("text", {
    x: W - padR,
    y: py(hi) - 5,
    fill: C.good,
    fontSize: "8",
    fontFamily: SANS,
    fontWeight: "700",
    textAnchor: "end",
    opacity: "0.75"
  }, "PEAK ", fmt(Math.round(hi)))), pts.length > 1 && /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#" + uid + "a)"
  }), pts.length > 1 && /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    opacity: "0.12"
  }), pts.length > 1 && /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: "url(#" + uid + "l)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: last[0],
    x2: last[0],
    y1: last[1],
    y2: H - padB,
    stroke: color,
    strokeWidth: "1",
    strokeDasharray: "2 3",
    opacity: "0.35"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: last[0],
    cy: last[1],
    r: "7",
    fill: color,
    opacity: "0.2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: last[0],
    cy: last[1],
    r: "3.6",
    fill: color,
    stroke: "#0C0D10",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("rect", {
    x: labX,
    y: labY - 12,
    width: labW,
    height: "17",
    rx: "5",
    fill: "#20242C",
    stroke: C.line2,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: labX + labW / 2,
    y: labY,
    fill: C.text,
    fontSize: "10",
    fontWeight: "700",
    fontFamily: MONO,
    textAnchor: "middle"
  }, fmt(Math.round(lastVal)), unit), /*#__PURE__*/React.createElement("line", {
    x1: gutter,
    x2: W - padR,
    y1: H - padB,
    y2: H - padB,
    stroke: C.line2,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: gutter,
    y: H - 8,
    fill: C.faint,
    fontSize: "8.5",
    fontFamily: MONO
  }, dshort(minX)), /*#__PURE__*/React.createElement("text", {
    x: W - padR,
    y: H - 8,
    fill: C.faint,
    fontSize: "8.5",
    fontFamily: MONO,
    textAnchor: "end"
  }, dshort(maxX)));
}

/* -------------------------------- state ---------------------------------- */
const KEY = "lift-weight-suggester-v1";
const DEFAULT = {
  exercises: {},
  // name -> { name, sets: [{id, ts, weight, reps, rpe, fromRec, tReps, tRpe, rec, note}] }
  bodyweight: [],
  // [{id, ts, kg}]
  meet: {
    date: null,
    name: "",
    attempts: {}
  },
  // attempts: { liftName: { opener, second, third } in kg }
  checkins: {},
  // "YYYY-MM-DD" -> { score 1-10, gear: [..], ts }
  clips: {},
  // setId -> { ex, ts, bytes, dur, w, h, type } — the video itself lives in IndexedDB
  library: [],
  // saved blocks: [{ id, name, savedAt, offsets, sessions, weeks, lifts }]
  done: {},
  // "YYYY-MM-DD" -> ts the session was called finished
  settings: {
    unit: "lb",
    round: 5,
    bar: 45,
    inputMode: "rpe",
    sex: "male",
    trainingMode: "rpe",
    maxMode: "dynamic",
    topPct: 85,
    backoff: {
      sets: 1,
      reps: 5,
      rpe: 8,
      level: "normal",
      pct: 75,
      steps: []
    }
  }
};
// Default strength ratio of a variation to its main lift, guessed from its name.
const VAR_RATIOS = [[/front\s*squat/, 0.82], [/pause|paused|tempo|\bpin\b|dead\s*stop|bottom|deficit/, 0.9], [/spoto|larsen|close\s*grip|cgbp|2\s*ct|3\s*ct|count/, 0.93], [/block|board|rack|pin\s*press|touch\s*and\s*go|tng/, 1.04]];
function defaultRatio(name) {
  const n = (name || "").toLowerCase();
  for (const [re, r] of VAR_RATIOS) if (re.test(n)) return r;
  return 0.9;
}
const PRESETS = ["Squat", "Bench Press", "Deadlift", "Overhead Press"];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("dash");
  // Noticing you can't train today happens on Train, not Plan. This carries that
  // one intent across: open Plan on that date with the day's tools already up.
  const [focusDay, setFocusDay] = useState(null);
  // Which door onboarding went through, so Plan can open on the right thing
  // rather than leaving someone on an empty calendar they did not ask for.
  const [planDoor, setPlanDoor] = useState(null);
  const openDayTools = dateStr => {
    setFocusDay(dateStr);
    setTab("plan");
  };
  const [sel, setSel] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  // A new build has been cached underneath us. Never swap it in mid-set — offer it.
  const [newBuild, setNewBuild] = useState(() => !!pwa().update);
  useEffect(() => {
    const on = () => setNewBuild(true);
    window.addEventListener("ironset-update", on);
    return () => window.removeEventListener("ironset-update", on);
  }, []);
  const takeUpdate = () => {
    try {
      const reg = pwa().reg;
      if (reg && reg.waiting) reg.waiting.postMessage("skip-waiting");
    } catch (e) {}
    setTimeout(() => window.location.reload(), 120);
  };
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);
  useEffect(() => {
    if (!sel) {
      const k = Object.keys(state.exercises);
      if (k.length) setSel(k[0]);
    }
  }, [state.exercises, sel]);

  // one-time repairs: (1) older builds switched the unit label without converting
  // stored loads; (2) stamp existing users as onboarded so they skip first-launch.
  useEffect(() => {
    setState(s => {
      if (!s.settings) return s;
      let st = s;
      if (st.settings.unitSchema !== 2) {
        let exercises = st.exercises;
        if (st.settings.unit === "kg") {
          const f = 1 / LBKG,
            cv = w => typeof w === "number" ? Math.round(w * f * 10) / 10 : w;
          exercises = {};
          for (const [k, e] of Object.entries(st.exercises)) exercises[k] = {
            ...e,
            sets: e.sets.map(x => ({
              ...x,
              weight: cv(x.weight),
              rec: x.rec != null ? cv(x.rec) : x.rec
            })),
            tmax: e.tmax != null ? cv(e.tmax) : e.tmax
          };
        }
        st = {
          ...st,
          exercises,
          settings: {
            ...st.settings,
            unitSchema: 2
          }
        };
      }
      if (st.settings.onboarded === undefined && Object.keys(st.exercises).length > 0) st = {
        ...st,
        settings: {
          ...st.settings,
          onboarded: true
        }
      };
      return st;
    });
  }, []);
  const {
    unit,
    round,
    bar,
    inputMode
  } = state.settings;
  const denoms = unit === "kg" ? [25, 20, 15, 10, 5, 2.5, 1.25] : [45, 35, 25, 10, 5, 2.5];
  const models = useMemo(() => {
    const ex = state.exercises;
    const own = {};
    // Every set is evidence now; buildModel takes each day at its best, so a back-off
    // that outlifts the set labelled "top" is no longer thrown away.
    for (const [k, e] of Object.entries(ex)) own[k] = buildModel(e.sets.filter(s => s.secs == null), e.sets.filter(s => s.secs == null));
    // ratio of a variation's strength to its parent: learned from own numbers, else default
    const ratioOf = name => {
      const x = ex[name];
      if (!x || !x.parent || !ex[x.parent]) return 1;
      if (typeof x.ratioManual === "number") return x.ratioManual;
      const a = own[name] && own[name].e1rm,
        b = own[x.parent] && own[x.parent].e1rm;
      if (a && b) return Math.min(1.2, Math.max(0.5, a / b));
      return typeof x.ratio === "number" ? x.ratio : 0.9;
    };
    // pooled main-equivalent estimate across a main lift + all its variations
    const famCache = {};
    const family = root => {
      if (famCache[root]) return famCache[root];
      const members = [root, ...Object.keys(ex).filter(k => ex[k].parent === root)];
      const all = [];
      for (const m of members) {
        const r = m === root ? 1 : ratioOf(m);
        const rscM = learnRecoveryScale(ex[m].sets);
        for (const s of ex[m].sets) {
          if (s.secs != null) continue;
          const rawS = e1rmFromSet(s.weight, s.reps, s.rpe);
          const ob = freshCorrect(rawS, s, ex[m].sets, rscM);
          all.push({
            ts: s.ts,
            obs: ob / r,
            reps: s.reps,
            rpe: s.rpe,
            raw: rawS / r,
            held: s.carry != null && s.carry < 1
          });
        }
      }
      all.sort((a, b) => a.ts - b.ts);
      let e = null;
      const points = [];
      // One reading per training day, taken at that day's best, across the whole
      // family — the variation that went best still speaks for the main lift.
      for (const x of bestPerDay(all)) {
        // Undoing the day's handicap may hold the estimate where it was; it may never
        // lift it past what the bar actually weighed.
        const ob = x.held ? Math.min(x.obs, Math.max(e != null ? e : x.raw, x.raw)) : x.obs;
        e = e == null ? ob : e + 0.35 * reliability(x.reps, x.rpe) * (ob - e);
        points.push({
          ts: x.ts,
          value: e
        });
      }
      const out = {
        e1rm: e,
        points,
        count: points.length
      };
      famCache[root] = out;
      return out;
    };
    const view = {};
    for (const k of Object.keys(ex)) {
      const hasParent = ex[k].parent && ex[ex[k].parent];
      const root = hasParent ? ex[k].parent : k;
      const f = family(root);
      const r = root === k ? 1 : ratioOf(k);
      view[k] = {
        e1rm: f.e1rm != null ? f.e1rm * r : null,
        points: f.points.map(p => ({
          ts: p.ts,
          value: p.value * r
        })),
        count: f.count,
        own: own[k],
        ratio: r,
        parent: hasParent ? ex[k].parent : null
      };
    }
    return view;
  }, [state.exercises]);
  const analysis = useMemo(() => analyze(state, models, unit), [state, models, unit]);
  const meetDays = state.meet && state.meet.date ? daysUntil(state.meet.date) : null;
  const meetName = state.meet && state.meet.name || "";

  /* mutations */
  const addExercise = (name, parent, ratio) => {
    const n = name.trim();
    if (!n) return;
    const exists = Object.keys(state.exercises).find(k => k.toLowerCase() === n.toLowerCase());
    if (exists) {
      setSel(exists);
      return;
    }
    const exObj = {
      name: n,
      sets: []
    };
    if (parent) {
      exObj.parent = parent;
      exObj.ratio = typeof ratio === "number" ? ratio : defaultRatio(n);
    }
    setState(s => ({
      ...s,
      exercises: {
        ...s.exercises,
        [n]: exObj
      }
    }));
    setSel(n);
  };
  const updateExercise = (name, patch) => setState(s => {
    const e = s.exercises[name];
    if (!e) return s;
    const next = {
      ...e,
      ...patch
    };
    Object.keys(next).forEach(key => next[key] === undefined && delete next[key]);
    return {
      ...s,
      exercises: {
        ...s.exercises,
        [name]: next
      }
    };
  });
  const logSet = (name, set) => {
    setState(s => {
      const ex = s.exercises[name];
      if (!ex) return s;
      return {
        ...s,
        exercises: {
          ...s.exercises,
          [name]: {
            ...ex,
            sets: [...ex.sets, {
              id: uid(),
              ts: Date.now(),
              ...set
            }]
          }
        }
      };
    });
  };
  const deleteSet = (name, id) => {
    clipDrop(id).catch(() => {});
    setState(s => {
      const ex = s.exercises[name];
      if (!ex) return s;
      const clips = {
        ...(s.clips || {})
      };
      delete clips[id];
      return {
        ...s,
        clips,
        exercises: {
          ...s.exercises,
          [name]: {
            ...ex,
            sets: ex.sets.filter(x => x.id !== id)
          }
        }
      };
    });
  };
  // Video lives in IndexedDB; this map is only the index of what exists.
  const saveClip = (setId, meta) => setState(s => ({
    ...s,
    clips: {
      ...(s.clips || {}),
      [setId]: meta
    }
  }));
  const dropClip = setId => setState(s => {
    const clips = {
      ...(s.clips || {})
    };
    delete clips[setId];
    return {
      ...s,
      clips
    };
  });

  // Footage is the one thing here that can fill a phone, so it is capped: when
  // the budget is passed the oldest clips go, and the index goes with them.
  useEffect(() => {
    const clips = state.clips || {};
    if (!Object.keys(clips).length) return;
    let dead = false;
    pruneClips(clips).then(gone => {
      if (dead || !gone.length) return;
      setState(s => {
        const c = {
          ...(s.clips || {})
        };
        gone.forEach(id => delete c[id]);
        return {
          ...s,
          clips: c
        };
      });
    }).catch(() => {});
    return () => {
      dead = true;
    };
  }, [state.clips]);

  // One sweep a session: drop stored video whose set no longer exists, and
  // forget index entries whose video is gone. Either can happen after a restore
  // from backup, which carries the log but not the footage.
  useEffect(() => {
    let dead = false;
    clipKeys().then(keys => {
      if (dead) return;
      setState(s => {
        const live = new Set();
        for (const ex of Object.values(s.exercises || {})) for (const x of ex.sets) live.add(x.id);
        for (const t of s.trash || []) for (const x of t.ex && t.ex.sets || []) live.add(x.id);
        const have = new Set(keys || []);
        for (const k of have) if (!live.has(k)) clipDrop(k).catch(() => {});
        const clips = {};
        let changed = false;
        for (const [id, c] of Object.entries(s.clips || {})) {
          if (have.has(id) && live.has(id)) clips[id] = c;else changed = true;
        }
        return changed ? {
          ...s,
          clips
        } : s;
      });
    }).catch(() => {});
    return () => {
      dead = true;
    };
  }, []);
  const updateSet = (name, id, patch) => setState(s => {
    const ex = s.exercises[name];
    if (!ex) return s;
    return {
      ...s,
      exercises: {
        ...s.exercises,
        [name]: {
          ...ex,
          sets: ex.sets.map(x => x.id === id ? {
            ...x,
            ...patch
          } : x)
        }
      }
    };
  });
  // Deleting a lift never destroys it outright — it moves to a recoverable bin, and any
  // variations linked to it are unlinked so they survive on their own.
  const deleteExercise = name => {
    setState(s => {
      const e = {
          ...s.exercises
        },
        gone = e[name];
      if (!gone) return s;
      delete e[name];
      for (const k of Object.keys(e)) if (e[k].parent === name) e[k] = {
        ...e[k],
        parent: undefined,
        ratio: undefined
      };
      const trash = [{
        name,
        ex: gone,
        ts: Date.now()
      }].concat(s.trash || []).slice(0, 20);
      return {
        ...s,
        exercises: e,
        trash
      };
    });
    setSel(cur => cur === name ? Object.keys(state.exercises).filter(k => k !== name)[0] || null : cur);
  };
  const restoreExercise = name => setState(s => {
    const item = (s.trash || []).find(x => x.name === name);
    if (!item) return s;
    const key = s.exercises[name] ? `${name} (restored)` : name;
    return {
      ...s,
      exercises: {
        ...s.exercises,
        [key]: {
          ...item.ex,
          name: key
        }
      },
      trash: (s.trash || []).filter(x => x.name !== name)
    };
  });
  const purgeExercise = name => setState(s => {
    const item = (s.trash || []).find(x => x.name === name);
    const clips = {
      ...(s.clips || {})
    };
    for (const x of item && item.ex && item.ex.sets || []) {
      if (clips[x.id]) {
        delete clips[x.id];
        clipDrop(x.id).catch(() => {});
      }
    }
    return {
      ...s,
      clips,
      trash: (s.trash || []).filter(x => x.name !== name)
    };
  });
  const setSetting = (k, v) => setState(s => ({
    ...s,
    settings: {
      ...s.settings,
      [k]: v
    }
  }));
  const tabs = [{
    id: "dash",
    label: "Dashboard",
    icon: Gauge
  }, {
    id: "train",
    label: "Train",
    icon: Activity
  }, {
    id: "plan",
    label: "Plan",
    icon: Calendar
  }, {
    id: "history",
    label: "History",
    icon: TrendingUp
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: `radial-gradient(680px 440px at 4% -6%, rgba(91,124,255,0.20), transparent 62%), radial-gradient(560px 380px at 106% 3%, rgba(255,74,61,0.15), transparent 60%), ${C.bg}`,
      minHeight: "100vh",
      color: C.text,
      fontFamily: SANS
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480,
      margin: "0 auto",
      padding: "0 0 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "calc(16px + env(safe-area-inset-top, 0px)) 18px 4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: 21,
      letterSpacing: "0.07em",
      lineHeight: 1
    }
  }, "IRON", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.red
    }
  }, "SET")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSettings(true),
    style: {
      background: C.surface2,
      border: `1px solid ${C.line2}`,
      width: 38,
      height: 38,
      borderRadius: R.pill,
      color: C.muted,
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement(Settings, {
    size: 17
  }))), tab !== "train" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 25,
      letterSpacing: "-0.03em",
      lineHeight: 1.05,
      color: C.text
    }
  }, (tabs.find(x => x.id === tab) || {}).label), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginTop: 6
    }
  }, new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  })))), newBuild && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "10px 18px 0",
      padding: "11px 13px",
      borderRadius: R.ctrl,
      background: C.surface,
      border: `1px solid ${C.line2}`,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, "New version ready"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 2
    }
  }, "Reload when you're between sets \u2014 nothing logged is lost.")), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: takeUpdate,
    style: {
      minHeight: 36,
      padding: "7px 13px",
      fontSize: 12.5
    }
  }, "Reload"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setNewBuild(false),
    "aria-label": "Later",
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, tab === "dash" && /*#__PURE__*/React.createElement(DashboardTab, {
    state,
    models,
    analysis,
    unit,
    setTab,
    setState,
    setSel
  }), tab === "train" && /*#__PURE__*/React.createElement(TrainTab, {
    state,
    setState,
    sel,
    setSel,
    models,
    addExercise,
    updateExercise,
    logSet,
    updateSet,
    deleteSet,
    settings: state.settings,
    setSetting,
    denoms,
    meetDays,
    meetName,
    plan: state.plan || {},
    onEditPlan: () => setShowPlan(true),
    setTab,
    openDayTools,
    saveClip,
    dropClip
  }), tab === "plan" && /*#__PURE__*/React.createElement(ProgramTab, {
    state,
    setState,
    setTab,
    setSel,
    models,
    focusDay,
    onFocusDone: () => setFocusDay(null),
    openDoor: planDoor,
    onDoorDone: () => setPlanDoor(null)
  }), tab === "history" && /*#__PURE__*/React.createElement(HistoryTab, {
    state,
    sel,
    setSel,
    models,
    deleteSet,
    updateSet,
    deleteExercise,
    unit,
    inputMode,
    saveClip,
    dropClip
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 30,
      display: "flex",
      justifyContent: "center",
      padding: "0 12px calc(12px + env(safe-area-inset-bottom, 0px))",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 1,
      background: "rgba(14,17,25,0.92)",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      border: `1px solid ${C.line2}`,
      borderRadius: R.pill,
      padding: 6,
      pointerEvents: "auto",
      boxShadow: "0 18px 40px -14px rgba(0,0,0,0.9)"
    }
  }, tabs.map(t => {
    const a = t.id === tab;
    const I = t.icon;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "8px 10px",
        borderRadius: R.pill,
        border: "none",
        background: a ? C.surface2 : "transparent",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        transition: "background .16s ease"
      }
    }, /*#__PURE__*/React.createElement(I, {
      size: 18,
      style: {
        color: a ? C.red : C.faint
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.01em",
        color: a ? C.text : C.faint
      }
    }, t.label));
  }))), /*#__PURE__*/React.createElement(SettingsSheet, {
    open: showSettings,
    onClose: () => setShowSettings(false),
    settings: state.settings,
    setSetting,
    state,
    setState
  }), /*#__PURE__*/React.createElement(BlockSheet, {
    open: showPlan,
    onClose: () => setShowPlan(false),
    plan: state.plan || {},
    setPlan: p => setState(s => ({
      ...s,
      plan: p
    })),
    exNames: Object.keys(state.exercises),
    inputMode: state.settings.inputMode
  }), !state.settings.onboarded && /*#__PURE__*/React.createElement(Onboarding, {
    unit: state.settings.unit,
    onDone: (patch, seeds, door) => {
      if (door === "train") setTab("train");else {
        setTab("plan");
        setPlanDoor(door);
      }
      setState(s => {
        const exercises = {
          ...s.exercises
        };
        (seeds || []).forEach(sd => {
          const ex = exercises[sd.name] || {
            name: sd.name,
            sets: []
          };
          exercises[sd.name] = {
            ...ex,
            sets: [...ex.sets, {
              id: uid(),
              ts: sd.ts,
              weight: sd.weight,
              reps: sd.reps,
              rpe: sd.rpe,
              fromRec: false
            }]
          };
        });
        return {
          ...s,
          exercises,
          settings: {
            ...s.settings,
            ...patch
          }
        };
      });
    }
  }));
}

/* ---- Inter-session (week-over-week) fatigue ---- */
// Work above ~RPE 8 leaves a recovery debt into the NEXT session of that lift. The
// debt scales with how far past 8 the sets went, decays over the days between
// sessions, and its true size is learned per lift from this lifter's own history —
// so a deadlift can learn a heavier carryover than a bench.
function strainExcess(rpe) {
  // Strain is dominated by true 9+ work: 8.5s count at half weight, 9 and up in full.
  const base = Math.max(0, fatigueEffort(rpe) - fatigueEffort(8));
  return base * Math.max(0.3, Math.min(1, rpe - 8));
}
function residualFatigue(sets, refTs, includeToday) {
  // Raw decayed strain summed across all recent sessions (16-day window), so a light
  // session can't mask the debt from a brutal one behind it. Callers apply the
  // learned per-lift scale and cap. Reports the dominant contributor for display.
  const dayKey = ts => new Date(ts).toDateString();
  const refDay = dayKey(refTs);
  const prior = sets.filter(s => s.ts < refTs && (includeToday || dayKey(s.ts) !== refDay));
  if (!prior.length) return {
    raw: 0,
    days: 0,
    peak: 0
  };
  const byDay = {};
  for (const s of prior) {
    const d = dayKey(s.ts);
    (byDay[d] = byDay[d] || []).push(s);
  }
  let total = 0,
    top = {
      c: 0,
      days: 0,
      peak: 0
    };
  for (const d in byDay) {
    let S = 0,
      peak = 0,
      lastTs = 0;
    /* Hard reps, not raw reps. Counting reps straight made a set of fifteen leg
       extensions eight times the strain of a heavy deadlift triple, which is how a
       barbell row ended up taking ten percent off a deadlift two days later. More
       reps at the same effort is genuinely more to recover from, but the fifteenth
       rep of a long set adds far less than the third rep of a heavy one — so volume
       counts on a square root, the usual shape for this. */
    /* peak names the set this debt came from, so it has to be a set that actually
       left one. Reading the day's hardest TOP set instead meant a session whose
       strain came entirely from hard back-offs got reported under the light
       single in front of them — "trimmed, because of your RPE 4 overhead press",
       which is both wrong and the fastest way to lose trust in the number. Any
       day that survives the S <= 0 check has at least one set above 8, so this
       is always the honest answer to "from what". */
    for (const s of byDay[d]) {
      const ex = strainExcess(s.rpe);
      const reps = Math.max(1, s.reps || 1);
      /* How heavy the set was, as a share of what that lift could do for one —
         straight off the rep chart, so it needs no model and cannot go circular.
         Without it, reps and proximity to failure were the only inputs, and a
         set of twenty leg extensions taken to RPE 9.5 came out TEN TIMES the
         debt of a true max single. Going linear-to-sqrt on reps tamed the worst
         of that but left the ordering wrong, because rep count keeps piling up
         with no reference to the load. What blunts a heavy lift two days later
         tracks the weight far more than the rep count, so intensity enters
         squared and the long light sets fall back behind the heavy work. */
      const load = pctForN(repsToFailure(reps, s.rpe == null ? 8 : s.rpe)) / 100;
      S += Math.sqrt(reps) * ex * load * load * (s.backoff ? 0.4 : 1);
      if (ex > 0) peak = Math.max(peak, s.rpe);
      lastTs = Math.max(lastTs, s.ts);
    }
    const days = Math.max(0.17, (refTs - lastTs) / 86400000);
    if (days > 12 || S <= 0) continue;
    const c = 0.25 * S * Math.exp(-days / 4);
    total += c;
    if (c > top.c) top = {
      c,
      days: Math.round(days),
      peak
    };
  }
  return {
    raw: total,
    days: top.days,
    peak: top.peak
  };
}

// Within a session there is no question of whether work was recent enough to matter —
// it all does. So this counts volume at the effort it was performed, where the
// week-over-week measure deliberately ignores everything below RPE 8: three sets of
// five at 8 leaves nothing to carry into next Tuesday, but it absolutely leaves
// something for the deadlift you are about to do twenty minutes from now.
const SESSION_K = 0.055;
const SESSION_CAP = 0.085; // other lifts alone never explain more than 8.5%
function sessionStrain(sets) {
  let S = 0,
    peak = 0,
    n = 0;
  for (const s of sets) {
    if (s.reps == null && s.secs != null) continue; // timed work carries no load
    // Same flaw as the week-over-week measure, and worse here because reps enter
    // linearly: without weighting by how heavy the set was, sixty reps of leg
    // extensions earlier today buried a heavy squat triple many times over.
    const reps = Math.max(1, s.reps || 1);
    const rpe = s.rpe == null ? 8 : s.rpe;
    const load = pctForN(repsToFailure(reps, rpe)) / 100;
    // Reps on a square root here too. The week-over-week measure was moved off
    // linear reps for exactly this reason and this path was left behind, which
    // is the whole of why it read a set of twenty as twenty times a single.
    S += Math.sqrt(reps) * fatigueEffort(rpe) * load * load * (s.backoff ? 0.65 : 1);
    if (!s.backoff) peak = Math.max(peak, s.rpe || 0);
    n++;
  }
  return {
    S,
    peak,
    n
  };
}
// Everything else you have already trained today, weighted by how much of it this
// lift actually needs. The lift's own earlier sets are left out: back-offs already
// read the set in front of them, and counting both would charge you twice.
function sessionCarry(state, sel, dayStr, beforeTs) {
  const out = {
    raw: 0,
    from: null,
    sets: 0,
    peak: 0,
    share: 0
  };
  if (!sel || !state || !state.exercises) return out;
  let top = 0;
  for (const [name, ex] of Object.entries(state.exercises)) {
    if (name === sel || !ex.sets || !ex.sets.length) continue;
    const todays = ex.sets.filter(st => dateStrFromTs(st.ts) === dayStr && (beforeTs == null || st.ts < beforeTs));
    if (!todays.length) continue;
    const {
      S,
      peak,
      n
    } = sessionStrain(todays);
    if (S <= 0) continue;
    const share = carryover(name, sel, state);
    const c = SESSION_K * S * share;
    out.raw += c;
    if (c > top) {
      top = c;
      out.from = name;
      out.sets = n;
      out.peak = peak;
      out.share = share;
    }
  }
  out.raw = Math.min(SESSION_CAP, out.raw);
  return out;
}

/* --------------------------------- warming up ----------------------------- */
// The ramp everybody does on paper and nobody wants to do in their head. Percentages
// are of the working set rather than of the max, so a trimmed day brings the whole
// ladder down with it instead of burning the session before the set that counts.
// Heavier top sets get more rungs, because the jumps a 600 lb pull needs are not the
// jumps a 135 lb press needs.
const WARM_RAMPS = {
  3: [[0.50, 5], [0.70, 3], [0.87, 1]],
  4: [[0.40, 5], [0.60, 4], [0.75, 2], [0.88, 1]],
  5: [[0.35, 5], [0.50, 4], [0.65, 3], [0.80, 2], [0.90, 1]],
  6: [[0.30, 5], [0.45, 5], [0.58, 3], [0.70, 2], [0.82, 1], [0.91, 1]]
};
function warmupPlan(target, bar, round) {
  if (!(target > 0) || !(bar > 0) || target <= bar * 1.15) return [];
  const ratio = target / bar;
  const n = Math.max(3, Math.min(6, Math.round(ratio / 1.9) + 1));
  const out = [{
    weight: bar,
    reps: 5,
    bar: true
  }];
  let last = bar;
  for (const [pct, reps] of WARM_RAMPS[n]) {
    const w = roundTo(target * pct, round);
    // A rung that rounds onto the one below it is not a rung — drop it rather than
    // asking someone to load the same bar twice.
    if (w <= last || w >= target) continue;
    out.push({
      weight: w,
      reps,
      pct
    });
    last = w;
  }
  return out;
}

/* ------------------------- what an accessory is worth --------------------- */
// Nobody tests a one-rep leg extension, so a one-rep leg extension number is one
// nobody can use — it reads like precision about something you will never attempt.
// What you actually want to know is the load you currently handle for the reps you
// really train it at, and whether that load is moving. The model underneath is
// unchanged; this just reads it back out through the RPE chart at a rep count the
// movement is actually performed in.

// Taken from the lift's own recent history rather than a fixed number, because the
// honest answer to "how many reps?" is "however many you do them for".
function accessoryReps(name, state) {
  const ex = state && state.exercises && state.exercises[name];
  const sets = (ex && ex.sets || []).filter(s => !s.backoff && s.secs == null && s.reps > 0);
  if (!sets.length) {
    const L = libFind(name);
    return L && L.d === "pct" ? 5 : 10;
  }
  const reps = sets.slice(-14).map(s => s.reps).sort((a, b) => a - b);
  return Math.max(1, Math.min(30, reps[Math.floor(reps.length / 2)]));
}
// The working load: what this lift's estimate implies for that many reps at an
// ordinary hard effort. RPE 8 is the anchor because it is where most accessory work
// actually lives — a couple left in the tank.
const workingWeight = (e1rm, reps) => e1rm == null ? null : weightForTarget(e1rm, reps, 8);
// The best single set you have actually performed, judged by what it implies rather
// than by raw weight, so 120x15 can beat 140x6 if it genuinely was the better set.
function bestSet(sets) {
  let best = null,
    bestE = -1;
  for (const s of sets || []) {
    if (s.backoff || s.secs != null || !(s.weight > 0) || !(s.reps > 0)) continue;
    const e = e1rmFromSet(s.weight, s.reps, s.rpe);
    if (e > bestE) {
      bestE = e;
      best = s;
    }
  }
  return best;
}

/* --------------------------- what a lift demands -------------------------- */
// Fatigue does not travel evenly. Squats reach your deadlift hard, your bench a
// little, and your curls essentially not at all — and that is not about how "big"
// either lift is, it is about what they have in common. So each movement carries a
// profile of what it taxes, and carryover between two movements is how much of what
// the second one needs was already spent by the first.
//
// This replaced a string test that asked whether a name contained "press", which put
// Leg Press in the same bucket as Bench Press and a different one from Squat.
const SYSTEMS = ["legs", "post", "push", "pull", "core", "grip", "sys"];
const DEMAND = {
  squat: {
    legs: 0.95,
    post: 0.40,
    core: 0.45,
    sys: 0.85
  },
  deadlift: {
    legs: 0.55,
    post: 1.00,
    pull: 0.35,
    core: 0.50,
    grip: 0.60,
    sys: 0.95
  },
  bench: {
    push: 1.00,
    core: 0.15,
    sys: 0.55
  },
  press: {
    push: 0.85,
    core: 0.35,
    sys: 0.50
  },
  back: {
    pull: 0.90,
    post: 0.25,
    grip: 0.45,
    sys: 0.35
  },
  legs: {
    legs: 0.80,
    post: 0.25,
    sys: 0.25
  },
  armsPush: {
    push: 0.55,
    sys: 0.12
  },
  armsPull: {
    pull: 0.55,
    grip: 0.25,
    sys: 0.12
  },
  core: {
    core: 0.85,
    sys: 0.15
  },
  oly: {
    legs: 0.70,
    post: 0.70,
    push: 0.35,
    pull: 0.45,
    grip: 0.45,
    sys: 1.00
  },
  carry: {
    grip: 1.00,
    core: 0.70,
    post: 0.45,
    sys: 0.55
  },
  grip: {
    grip: 1.00,
    sys: 0.10
  },
  cond: {
    legs: 0.35,
    sys: 0.35
  },
  // Shoulder isolation sits in the press category but behaves nothing like a press:
  // no trunk, no systemic cost worth counting.
  delt: {
    push: 0.50,
    sys: 0.10
  }
};
// The arms category holds both ends of the arm, and they borrow from opposite lifts:
// your triceps are spent by pressing, your biceps by pulling.
const armSide = n => /curl|chin|hammer|preacher|spider|concentration|drag|zottman|bayesian|21s/i.test(n || "") ? "armsPull" : "armsPush";
function demandKey(name, state) {
  const L = libFind(name);
  if (L) {
    if (L.c === "arms") return armSide(name);
    // The press category also carries raises, flies and rear-delt work. A lateral
    // raise is not an overhead press with a smaller number on it.
    if (L.c === "press") {
      if (/face pull|pull-?apart|rear delt|powell|prone trap|upright row/i.test(name)) return "back";
      if (/raise|fly|flye|pec deck|rotation|wall slide|scap/i.test(name)) return "delt";
    }
    return DEMAND[L.c] ? L.c : "legs";
  }
  // A movement you named yourself, read off the name — and its parent if it has one,
  // since a variation taxes what its main lift taxes.
  const ex = state && state.exercises && state.exercises[name];
  if (ex && ex.parent && ex.parent !== name) return demandKey(ex.parent, state);
  const n = (name || "").toLowerCase();
  if (/squat|lunge|leg press|split|step-?up/.test(n)) return "squat";
  if (/dead|rdl|hinge|good ?morning|hip thrust|swing|clean|snatch/.test(n)) return "deadlift";
  if (/bench|fly|flye|chest/.test(n)) return "bench";
  if (/lateral raise|front raise|rear delt|reverse fly/.test(n)) return "delt";
  if (/ohp|overhead|shoulder|press/.test(n)) return "press";
  if (/row|pulldown|pull-?up|chin|lat /.test(n)) return "back";
  if (/curl|tricep|pushdown|skull|extension|dip|kickback/.test(n)) return armSide(n);
  if (/plank|crunch|ab |sit-?up|hollow|pallof/.test(n)) return "core";
  if (/carry|walk|farmer|yoke/.test(n)) return "carry";
  return "legs";
}
// An accessory is not a main lift wearing different clothes: a Leg Press loads the
// quads about as hard as a squat but costs far less systemically and asks almost
// nothing of the trunk. Anything the catalogue does not tie to a main lift gets that
// discount, which is what keeps machine work from spending your whole day.
function demandOf(name, state) {
  const base = DEMAND[demandKey(name, state)] || DEMAND.legs;
  const L = libFind(name);
  const ex = state && state.exercises && state.exercises[name];
  const tied = L && L.m || ex && ex.parent || LIFT_HUE[name] != null;
  if (tied) return base;
  const out = {};
  for (const k of SYSTEMS) out[k] = (base[k] || 0) * (k === "sys" ? 0.5 : k === "post" ? 0.6 : 1);
  return out;
}
// How much of what B needs was already spent by A. Weighted by B's own demands, so a
// lift is only reduced by fatigue in the systems it actually relies on.
function carryover(fromName, toName, state) {
  if (fromName === toName) return 1;
  const a = demandOf(fromName, state),
    b = demandOf(toName, state);
  let num = 0,
    den = 0;
  for (const k of SYSTEMS) {
    const bk = b[k] || 0;
    den += bk;
    num += bk * (a[k] || 0);
  }
  const overlap = den > 0 ? Math.max(0, Math.min(1, num / den)) : 0;
  /* Overlap says how much of the target's demands the source movement touches. It
     does not say how big the source movement is, and that was the hole: a barbell
     row shares 23% of a deadlift's demands, so a hard set of rows was landing as
     nearly a hard set of deadlifts. It isn't. A row asks a fraction of the body a
     deadlift asks for, and a set of rows costs you accordingly.
      So discount by how much systemic work the source is capable of generating next
     to the target. One-sided on purpose: a bigger lift reaching a smaller one is
     already handled by the overlap, and capping at 1 keeps a deadlift's effect on a
     curl from being inflated just because a deadlift is the larger movement. */
  const mag = n => {
    const d = demandOf(n, state);
    return Math.max(0.05, d.sys || 0.05);
  };
  return overlap * Math.min(1, mag(fromName) / mag(toName));
}

// Freshness correction for the ESTIMATOR: a set performed under predicted residual
// fatigue is converted toward fresh terms — but never beyond the impairment the
// lifter's own rating actually showed. Hit your target effort? You weren't impaired,
// so essentially no correction. This keeps a hard week from reading as strength loss
// without ever manufacturing strength that wasn't demonstrated.
function freshCorrect(obs, s, sets, rsc) {
  // A declared handicap is divided straight back out, with no deficit guard, because
  // the prescription was already reduced by exactly this factor: hit the trimmed
  // target on effort and the estimate lands back where it started, which is the
  // whole point. Predicted training debt below still keeps its guard — that one is
  // the app's guess and can simply be wrong.
  const cond = s.cond != null && s.cond >= COND_FLOOR && s.cond < 1 ? s.cond : 1;
  obs = obs / cond;
  // Carryover from earlier the same day is divided back out on the same terms. It is
  // not a guess about how recovered you are — it is arithmetic on work you logged an
  // hour ago, and the prescription was already cut by exactly this much. Deadlifting
  // after squats every week should not slowly convince the app your deadlift is
  // shrinking. The guard below still stops it being used to inflate anything.
  const car = s.carry != null && s.carry >= CARRY_FLOOR && s.carry < 1 ? s.carry : 1;
  obs = obs / car;
  const rd = trimFor(residualFatigue(sets, s.ts).raw, rsc);
  if (rd < 0.01) return obs;
  let corr = 0.85 * rd;
  if (s.fromRec && s.tRpe != null) {
    const obsDef = Math.max(0, 1 - e1rmFromSet(s.weight, s.reps, s.rpe) / e1rmFromSet(s.weight, s.reps, s.tRpe));
    corr = Math.min(corr, obsDef);
  } else corr = Math.min(corr, 0.06);
  return obs / (1 - Math.min(0.10, corr));
}
// Learn how strongly carryover hits THIS lift: every prescribed top set that came in
// harder than its target, on a day residual fatigue was predicted, sizes the effect.
// Two outputs from the same physiology, deliberately separated:
//   TRIM      — what we subtract from a prescription. Capped hard, because a wrong trim
//               wastes a session; being 3% light costs nothing, being 15% light ruins a day.
//   READINESS — what the athlete sees. Mapped onto an expressive scale so a genuinely
//               beaten-up lift reads in the 40s-50s instead of hovering in the high 80s.
const TRIM_CAP = 0.10;
const READY_SPAN = 0.22;
function trimFor(raw, scale) {
  return Math.max(0, Math.min(TRIM_CAP, (scale || 1) * raw));
}
function readinessFor(raw, scale) {
  const d = Math.max(0, Math.min(READY_SPAN, (scale || 1) * raw));
  return Math.round(100 - d / READY_SPAN * 62); // fresh 100 → fully cooked 38
}

function learnRecoveryScale(sets) {
  // Learn how strongly week-over-week fatigue actually bites THIS lifter, from every
  // prescribed top set that landed on a day carryover was predicted. Recent evidence
  // counts more (fatigue response shifts across blocks), the weighted median resists
  // one odd session, and it shrinks toward a slightly-cautious prior until proven.
  const now = Date.now(),
    HALF_LIFE = 56 * 86400000;
  const samples = [];
  for (const s of sets) {
    if (s.backoff || !s.fromRec || s.tRpe == null || s.rpe == null) continue;
    const pred = residualFatigue(sets, s.ts).raw;
    if (pred < 0.012) continue;
    const obs = 1 - e1rmFromSet(s.weight, s.reps, s.rpe) / e1rmFromSet(s.weight, s.reps, s.tRpe);
    if (obs < -0.12 || obs > 0.25) continue; // outside this, something else happened
    const sc = Math.max(0.05, Math.min(2.5, obs / pred));
    samples.push({
      sc,
      w: Math.pow(0.5, (now - s.ts) / HALF_LIFE)
    });
  }
  if (!samples.length) return 1;
  samples.sort((x, y) => x.sc - y.sc);
  const W = samples.reduce((tot, x) => tot + x.w, 0);
  let acc = 0,
    med = samples[samples.length - 1].sc;
  for (const x of samples) {
    acc += x.w;
    if (acc >= W / 2) {
      med = x.sc;
      break;
    }
  }
  const W0 = 2;
  return Math.max(0.15, Math.min(1.9, (W * med + W0 * 0.85) / (W + W0)));
}

/* ----------------------------------------------------------------------------
   DAILY CONDITIONS — the half of readiness your training data cannot see.

   Residual fatigue above explains what your TRAINING did to you. It has no way of
   knowing you slept five hours, that the house has had flu for a fortnight, or that
   you left your belt at home and are lifting on a bar you've never touched. Those
   get declared rather than inferred, and they work exactly like fatigue does: they
   shade what gets PRESCRIBED today, and they are never allowed to mean you got
   weaker. Your estimated max stays anchored to what you can do rested and properly
   equipped, which is the only definition of a max that stays comparable over time.
---------------------------------------------------------------------------- */

// 8 is an ordinary training day and the anchor of the whole scale: check in at 8,
// or never check in at all, and you get precisely the numbers you'd have got before
// this existed. Above 8 gives a little back, below it costs progressively more.
// The spread is deliberately narrow — measured effects of poor sleep and illness on
// maximal strength land in low single-digit percents, not the 20% a bad morning
// feels like. Under-trimming costs you a slightly easy session; over-trimming
// wastes the day.
const READY = {
  10: {
    m: 1.012,
    t: "Primed"
  },
  9: {
    m: 1.006,
    t: "Sharp"
  },
  8: {
    m: 1.000,
    t: "Normal"
  },
  7: {
    m: 0.990,
    t: "Slightly off"
  },
  6: {
    m: 0.978,
    t: "Run down"
  },
  5: {
    m: 0.964,
    t: "Rough"
  },
  4: {
    m: 0.948,
    t: "Depleted"
  },
  3: {
    m: 0.930,
    t: "Very rough"
  },
  2: {
    m: 0.910,
    t: "Barely there"
  },
  1: {
    m: 0.885,
    t: "Empty"
  }
};
const READY_DEFAULT = 8;
function readyInfo(v) {
  return READY[Math.max(1, Math.min(10, Math.round(v || READY_DEFAULT)))] || READY[8];
}

// Kit is mechanical rather than physiological, so unlike sleep it is lift-specific
// and far more predictable: a belt is worth real weight on a squat and almost
// nothing on a bench. These are conservative estimates, not measurements.
function liftClass(name) {
  const n = (name || "").toLowerCase();
  if (/squat/.test(n)) return "squat";
  if (/dead|rdl|hinge|pull|clean|snatch/.test(n)) return "deadlift";
  if (/bench|fly|dip/.test(n)) return "bench";
  if (/press|ohp|jerk/.test(n)) return "press";
  return "other";
}
const GEAR = {
  belt: {
    label: "No belt",
    squat: 0.975,
    deadlift: 0.978,
    bench: 0.997,
    press: 0.990,
    other: 0.993
  },
  sleeves: {
    label: "No sleeves",
    squat: 0.990,
    deadlift: 0.999,
    bench: 1.000,
    press: 1.000,
    other: 0.997
  },
  shoes: {
    label: "Wrong shoes",
    squat: 0.987,
    deadlift: 0.997,
    bench: 0.999,
    press: 0.994,
    other: 0.997
  },
  away: {
    label: "Away gym",
    squat: 0.990,
    deadlift: 0.990,
    bench: 0.990,
    press: 0.990,
    other: 0.990
  }
};
const GEAR_KEYS = ["belt", "sleeves", "shoes", "away"];
const GEAR_FLOOR = 0.96; // kit alone never explains more than 4%
const COND_FLOOR = 0.88; // and everything together never more than 12%
const CARRY_FLOOR = 0.90; // same-day carryover never explains more than 10%

function gearFactor(gear, cls) {
  let f = 1;
  for (const g of gear || []) {
    const G = GEAR[g];
    if (G) f *= G[cls] != null ? G[cls] : G.other;
  }
  return Math.max(GEAR_FLOOR, f);
}
// Today's capacity as a fraction of rested, fully-equipped strength.
function conditionFactor(ck, cls) {
  if (!ck) return 1;
  return Math.max(COND_FLOOR, readyInfo(ck.score).m * gearFactor(ck.gear, cls));
}
// Plain-language attribution, so a trimmed load is never mysterious.
function conditionWhy(ck, cls) {
  if (!ck) return "";
  const bits = [];
  const r = readyInfo(ck.score);
  if (Math.abs(r.m - 1) > 0.001) bits.push("readiness " + Math.round(ck.score) + " · " + r.t.toLowerCase());
  for (const g of ck.gear || []) if (GEAR[g] && (GEAR[g][cls] != null ? GEAR[g][cls] : GEAR[g].other) < 0.999) bits.push(GEAR[g].label.toLowerCase());
  return bits.join(" · ");
}
const checkinOn = (state, dateStr) => (state.checkins || {})[dateStr] || null;

/* ----------------------------------------------------------------------------
   EXERCISE LIBRARY + PROGRAMMING

   The engine above answers "how much today". This answers "what today". A program
   is weeks of days of slots; a slot names a movement, a set scheme and an intensity
   — and intensity is per slot, because a top single runs on RPE while the leg
   extensions after it run on reps in reserve and the speed work runs on a percent.
   Nothing here is required: with no program the app behaves exactly as it always
   has, and every load still comes from the same estimator.
---------------------------------------------------------------------------- */

// n name · c movement pattern · m the main lift it feeds (null = accessory)
// r starting ratio to that main lift, re-learned from your own sets · d default
// intensity language · e equipment, so you can filter to what your gym has.
const LIB = [
// ============================ SQUAT PATTERN ============================
["Low-Bar Squat", "squat", "Squat", 1, "rpe", "bb"], ["High-Bar Squat", "squat", "Squat", 0.95, "rpe", "bb"], ["Front Squat", "squat", "Squat", 0.82, "rpe", "bb"], ["Safety Bar Squat", "squat", "Squat", 0.88, "rpe", "sp"], ["Cambered Bar Squat", "squat", "Squat", 0.85, "rpe", "sp"], ["Buffalo Bar Squat", "squat", "Squat", 0.97, "rpe", "sp"], ["Pause Squat", "squat", "Squat", 0.9, "rpe", "bb"], ["2ct Pause Squat", "squat", "Squat", 0.88, "rpe", "bb"], ["3ct Pause Squat", "squat", "Squat", 0.86, "rpe", "bb"], ["Tempo Squat", "squat", "Squat", 0.88, "rpe", "bb"], ["Box Squat", "squat", "Squat", 0.95, "rpe", "bb"], ["High Box Squat", "squat", "Squat", 1.02, "rpe", "bb"], ["Pin Squat", "squat", "Squat", 0.9, "rpe", "bb"], ["Anderson Squat", "squat", "Squat", 0.9, "rpe", "bb"], ["1.5 Rep Squat", "squat", "Squat", 0.8, "rpe", "bb"], ["Zercher Squat", "squat", "Squat", 0.8, "rpe", "bb"], ["Close-Stance Squat", "squat", "Squat", 0.97, "rpe", "bb"], ["Wide-Stance Squat", "squat", "Squat", 1, "rpe", "bb"], ["Heels-Elevated Squat", "squat", "Squat", 0.93, "rpe", "bb"], ["Banded Squat", "squat", "Squat", 0.9, "pct", "bd"], ["Chain Squat", "squat", "Squat", 0.9, "pct", "bb"], ["Speed Squat", "squat", "Squat", 1, "pct", "bb"], ["Paused Front Squat", "squat", "Squat", 0.78, "rpe", "bb"], ["Overhead Squat", "squat", null, 1, "rpe", "bb"], ["Smith Machine Squat", "squat", null, 1, "rir", "sm"], ["Hack Squat", "squat", null, 1, "rir", "mc"], ["Pendulum Squat", "squat", null, 1, "rir", "mc"], ["V-Squat", "squat", null, 1, "rir", "mc"], ["Belt Squat", "squat", null, 1, "rir", "mc"], ["Leg Press", "squat", null, 1, "rir", "mc"], ["Single-Leg Press", "squat", null, 1, "rir", "mc"], ["Horizontal Leg Press", "squat", null, 1, "rir", "mc"], ["Bulgarian Split Squat", "squat", null, 1, "rir", "db"], ["Split Squat", "squat", null, 1, "rir", "db"], ["Walking Lunge", "squat", null, 1, "rir", "db"], ["Reverse Lunge", "squat", null, 1, "rir", "db"], ["Forward Lunge", "squat", null, 1, "rir", "db"], ["Curtsy Lunge", "squat", null, 1, "rir", "db"], ["Deficit Reverse Lunge", "squat", null, 1, "rir", "db"], ["Step-Up", "squat", null, 1, "rir", "db"], ["Lateral Step-Up", "squat", null, 1, "rir", "db"], ["Box Step-Down", "squat", null, 1, "rir", "bw"], ["Goblet Squat", "squat", null, 1, "rir", "db"], ["Kettlebell Front Squat", "squat", null, 1, "rir", "kb"], ["Cyclist Squat", "squat", null, 1, "rir", "bb"], ["Sissy Squat", "squat", null, 1, "rir", "bw"], ["Air Squat", "squat", null, 1, "rir", "bw"], ["Pistol Squat", "squat", null, 1, "rir", "bw"], ["Wall Sit", "squat", null, 1, "rir", "bw"], ["Jump Squat", "squat", null, 1, "rir", "bw"], ["Box Jump", "squat", null, 1, "rir", "bw"], ["Broad Jump", "squat", null, 1, "rir", "bw"], ["Depth Jump", "squat", null, 1, "rir", "bw"], ["Sled Push", "squat", null, 1, "rir", "sl"], ["Hatfield Squat", "squat", null, 1, "rir", "sp"], ["Landmine Squat", "squat", null, 1, "rir", "bb"],
// ============================ BENCH / CHEST ============================
["Competition Bench", "bench", "Bench Press", 1, "rpe", "bb"], ["Touch-and-Go Bench", "bench", "Bench Press", 1.04, "rpe", "bb"], ["Close-Grip Bench", "bench", "Bench Press", 0.93, "rpe", "bb"], ["Wide-Grip Bench", "bench", "Bench Press", 0.97, "rpe", "bb"], ["Pause Bench", "bench", "Bench Press", 0.95, "rpe", "bb"], ["2ct Pause Bench", "bench", "Bench Press", 0.93, "rpe", "bb"], ["3ct Pause Bench", "bench", "Bench Press", 0.91, "rpe", "bb"], ["Spoto Press", "bench", "Bench Press", 0.93, "rpe", "bb"], ["Larsen Press", "bench", "Bench Press", 0.93, "rpe", "bb"], ["Feet-Up Bench", "bench", "Bench Press", 0.95, "rpe", "bb"], ["1-Board Press", "bench", "Bench Press", 1.04, "rpe", "bb"], ["2-Board Press", "bench", "Bench Press", 1.08, "rpe", "bb"], ["3-Board Press", "bench", "Bench Press", 1.12, "rpe", "bb"], ["Pin Press", "bench", "Bench Press", 0.95, "rpe", "bb"], ["Floor Press", "bench", "Bench Press", 0.95, "rpe", "bb"], ["Dead Bench", "bench", "Bench Press", 0.88, "rpe", "bb"], ["Slingshot Bench", "bench", "Bench Press", 1.1, "rpe", "sp"], ["Tempo Bench", "bench", "Bench Press", 0.9, "rpe", "bb"], ["Reverse-Grip Bench", "bench", "Bench Press", 0.95, "rpe", "bb"], ["Swiss Bar Bench", "bench", "Bench Press", 0.92, "rpe", "sp"], ["Football Bar Bench", "bench", "Bench Press", 0.92, "rpe", "sp"], ["Guillotine Press", "bench", "Bench Press", 0.85, "rpe", "bb"], ["Banded Bench", "bench", "Bench Press", 0.95, "pct", "bd"], ["Chain Bench", "bench", "Bench Press", 0.95, "pct", "bb"], ["Speed Bench", "bench", "Bench Press", 1, "pct", "bb"], ["Incline Bench", "bench", null, 1, "rpe", "bb"], ["Low-Incline Bench", "bench", null, 1, "rpe", "bb"], ["Decline Bench", "bench", null, 1, "rir", "bb"], ["Dumbbell Bench", "bench", null, 1, "rir", "db"], ["Dumbbell Incline", "bench", null, 1, "rir", "db"], ["Dumbbell Decline", "bench", null, 1, "rir", "db"], ["Neutral-Grip DB Press", "bench", null, 1, "rir", "db"], ["Smith Bench", "bench", null, 1, "rir", "sm"], ["Smith Incline", "bench", null, 1, "rir", "sm"], ["Machine Chest Press", "bench", null, 1, "rir", "mc"], ["Incline Machine Press", "bench", null, 1, "rir", "mc"], ["Pec Deck", "bench", null, 1, "rir", "mc"], ["Cable Fly", "bench", null, 1, "rir", "cb"], ["Low-to-High Cable Fly", "bench", null, 1, "rir", "cb"], ["High-to-Low Cable Fly", "bench", null, 1, "rir", "cb"], ["Dumbbell Fly", "bench", null, 1, "rir", "db"], ["Incline Dumbbell Fly", "bench", null, 1, "rir", "db"], ["Cable Crossover", "bench", null, 1, "rir", "cb"], ["Push-Up", "bench", null, 1, "rir", "bw"], ["Deficit Push-Up", "bench", null, 1, "rir", "bw"], ["Weighted Push-Up", "bench", null, 1, "rir", "bw"], ["Ring Push-Up", "bench", null, 1, "rir", "bw"], ["Band Push-Up", "bench", null, 1, "rir", "bd"], ["Dumbbell Pullover", "bench", null, 1, "rir", "db"], ["Med Ball Chest Throw", "bench", null, 1, "rir", "bw"],
// ========================== DEADLIFT / HINGE ===========================
["Conventional Deadlift", "deadlift", "Deadlift", 1, "rpe", "bb"], ["Sumo Deadlift", "deadlift", "Deadlift", 1, "rpe", "bb"], ["Deficit Deadlift 1in", "deadlift", "Deadlift", 0.95, "rpe", "bb"], ["Deficit Deadlift 2in", "deadlift", "Deadlift", 0.92, "rpe", "bb"], ["Deficit Deadlift 3in", "deadlift", "Deadlift", 0.9, "rpe", "bb"], ["Block Pull 2in", "deadlift", "Deadlift", 1.08, "rpe", "bb"], ["Block Pull 4in", "deadlift", "Deadlift", 1.15, "rpe", "bb"], ["Rack Pull Below Knee", "deadlift", "Deadlift", 1.15, "rpe", "bb"], ["Rack Pull At Knee", "deadlift", "Deadlift", 1.25, "rpe", "bb"], ["Pause Deadlift", "deadlift", "Deadlift", 0.85, "rpe", "bb"], ["2ct Pause Deadlift", "deadlift", "Deadlift", 0.83, "rpe", "bb"], ["3ct Pause Deadlift", "deadlift", "Deadlift", 0.8, "rpe", "bb"], ["Pause Below Knee", "deadlift", "Deadlift", 0.88, "rpe", "bb"], ["Tempo Deadlift", "deadlift", "Deadlift", 0.88, "rpe", "bb"], ["Snatch-Grip Deadlift", "deadlift", "Deadlift", 0.85, "rpe", "bb"], ["Halting Deadlift", "deadlift", "Deadlift", 0.9, "rpe", "bb"], ["Banded Deadlift", "deadlift", "Deadlift", 0.9, "pct", "bd"], ["Chain Deadlift", "deadlift", "Deadlift", 0.9, "pct", "bb"], ["Speed Deadlift", "deadlift", "Deadlift", 1, "pct", "bb"], ["Trap Bar Deadlift", "deadlift", null, 1, "rpe", "sp"], ["Trap Bar High Handle", "deadlift", null, 1, "rpe", "sp"], ["Jefferson Deadlift", "deadlift", null, 1, "rir", "bb"], ["Suitcase Deadlift", "deadlift", null, 1, "rir", "bb"], ["Romanian Deadlift", "deadlift", null, 1, "rir", "bb"], ["Dumbbell RDL", "deadlift", null, 1, "rir", "db"], ["Single-Leg RDL", "deadlift", null, 1, "rir", "db"], ["B-Stance RDL", "deadlift", null, 1, "rir", "db"], ["Stiff-Leg Deadlift", "deadlift", null, 1, "rir", "bb"], ["Good Morning", "deadlift", null, 1, "rir", "bb"], ["Seated Good Morning", "deadlift", null, 1, "rir", "bb"], ["SSB Good Morning", "deadlift", null, 1, "rir", "sp"], ["Back Extension", "deadlift", null, 1, "rir", "bw"], ["45-Degree Back Extension", "deadlift", null, 1, "rir", "bw"], ["Reverse Hyper", "deadlift", null, 1, "rir", "mc"], ["Glute Ham Raise", "deadlift", null, 1, "rir", "bw"], ["Nordic Curl", "deadlift", null, 1, "rir", "bw"], ["Hip Thrust", "deadlift", null, 1, "rir", "bb"], ["Single-Leg Hip Thrust", "deadlift", null, 1, "rir", "bw"], ["Glute Bridge", "deadlift", null, 1, "rir", "bb"], ["Cable Pull-Through", "deadlift", null, 1, "rir", "cb"], ["Kettlebell Swing", "deadlift", null, 1, "rir", "kb"], ["Kettlebell Deadlift", "deadlift", null, 1, "rir", "kb"], ["Sled Drag", "deadlift", null, 1, "rir", "sl"], ["Belt Squat March", "deadlift", null, 1, "rir", "mc"], ["Hyperextension Hold", "deadlift", null, 1, "rir", "bw"], ["Band Pull-Through", "deadlift", null, 1, "rir", "bd"],
// ========================= OVERHEAD / SHOULDERS ========================
["Overhead Press", "press", "Overhead Press", 1, "rpe", "bb"], ["Pause Overhead Press", "press", "Overhead Press", 0.95, "rpe", "bb"], ["Seated Overhead Press", "press", "Overhead Press", 0.93, "rpe", "bb"], ["Z Press", "press", "Overhead Press", 0.8, "rpe", "bb"], ["Behind-Neck Press", "press", "Overhead Press", 0.95, "rpe", "bb"], ["Pin Press Overhead", "press", "Overhead Press", 0.95, "rpe", "bb"], ["Savickas Press", "press", "Overhead Press", 0.85, "rpe", "bb"], ["Push Press", "press", null, 1, "rpe", "bb"], ["Push Jerk", "press", null, 1, "rpe", "bb"], ["Split Jerk", "press", null, 1, "rpe", "bb"], ["Log Press", "press", null, 1, "rpe", "sp"], ["Axle Press", "press", null, 1, "rpe", "sp"], ["Dumbbell Shoulder Press", "press", null, 1, "rir", "db"], ["Seated DB Shoulder Press", "press", null, 1, "rir", "db"], ["Arnold Press", "press", null, 1, "rir", "db"], ["Single-Arm DB Press", "press", null, 1, "rir", "db"], ["Machine Shoulder Press", "press", null, 1, "rir", "mc"], ["Smith Shoulder Press", "press", null, 1, "rir", "sm"], ["Landmine Press", "press", null, 1, "rir", "bb"], ["Half-Kneeling Landmine Press", "press", null, 1, "rir", "bb"], ["Lateral Raise", "press", null, 1, "rir", "db"], ["Cable Lateral Raise", "press", null, 1, "rir", "cb"], ["Machine Lateral Raise", "press", null, 1, "rir", "mc"], ["Lean-Away Lateral Raise", "press", null, 1, "rir", "db"], ["Front Raise", "press", null, 1, "rir", "db"], ["Plate Front Raise", "press", null, 1, "rir", "bb"], ["Rear Delt Fly", "press", null, 1, "rir", "db"], ["Reverse Pec Deck", "press", null, 1, "rir", "mc"], ["Cable Rear Delt Fly", "press", null, 1, "rir", "cb"], ["Face Pull", "press", null, 1, "rir", "cb"], ["Band Pull-Apart", "press", null, 1, "rir", "bd"], ["Upright Row", "press", null, 1, "rir", "bb"], ["Cable Upright Row", "press", null, 1, "rir", "cb"], ["Cuban Press", "press", null, 1, "rir", "db"], ["Powell Raise", "press", null, 1, "rir", "db"], ["Y Raise", "press", null, 1, "rir", "db"], ["Scap Push-Up", "press", null, 1, "rir", "bw"], ["Wall Slide", "press", null, 1, "rir", "bw"], ["External Rotation", "press", null, 1, "rir", "cb"], ["Internal Rotation", "press", null, 1, "rir", "cb"], ["Handstand Push-Up", "press", null, 1, "rir", "bw"], ["Pike Push-Up", "press", null, 1, "rir", "bw"],
// ============================= BACK / PULL =============================
["Barbell Row", "back", null, 1, "rir", "bb"], ["Pendlay Row", "back", null, 1, "rpe", "bb"], ["Underhand Barbell Row", "back", null, 1, "rir", "bb"], ["Chest-Supported Row", "back", null, 1, "rir", "mc"], ["Seal Row", "back", null, 1, "rir", "bb"], ["T-Bar Row", "back", null, 1, "rir", "bb"], ["Dumbbell Row", "back", null, 1, "rir", "db"], ["Kroc Row", "back", null, 1, "rir", "db"], ["Meadows Row", "back", null, 1, "rir", "bb"], ["Landmine Row", "back", null, 1, "rir", "bb"], ["Seated Cable Row", "back", null, 1, "rir", "cb"], ["Single-Arm Cable Row", "back", null, 1, "rir", "cb"], ["Wide-Grip Cable Row", "back", null, 1, "rir", "cb"], ["Machine Row", "back", null, 1, "rir", "mc"], ["Inverted Row", "back", null, 1, "rir", "bw"], ["Ring Row", "back", null, 1, "rir", "bw"], ["Lat Pulldown", "back", null, 1, "rir", "cb"], ["Wide-Grip Pulldown", "back", null, 1, "rir", "cb"], ["Neutral-Grip Pulldown", "back", null, 1, "rir", "cb"], ["Single-Arm Pulldown", "back", null, 1, "rir", "cb"], ["Pull-Up", "back", null, 1, "rir", "bw"], ["Weighted Pull-Up", "back", null, 1, "rir", "bw"], ["Chin-Up", "back", null, 1, "rir", "bw"], ["Weighted Chin-Up", "back", null, 1, "rir", "bw"], ["Neutral-Grip Pull-Up", "back", null, 1, "rir", "bw"], ["Rack Chin", "back", null, 1, "rir", "bw"], ["Straight-Arm Pulldown", "back", null, 1, "rir", "cb"], ["Cable Pullover", "back", null, 1, "rir", "cb"], ["Barbell Shrug", "back", null, 1, "rir", "bb"], ["Dumbbell Shrug", "back", null, 1, "rir", "db"], ["Trap Bar Shrug", "back", null, 1, "rir", "sp"], ["Cable Shrug", "back", null, 1, "rir", "cb"], ["Rack Pull Shrug", "back", null, 1, "rir", "bb"], ["Prone Trap Raise", "back", null, 1, "rir", "db"], ["Dead Hang", "back", null, 1, "rir", "bw"], ["Scap Pull-Up", "back", null, 1, "rir", "bw"],
// ================================ ARMS =================================
["Triceps Pushdown", "arms", null, 1, "rir", "cb"], ["Rope Pushdown", "arms", null, 1, "rir", "cb"], ["Reverse-Grip Pushdown", "arms", null, 1, "rir", "cb"], ["Overhead Triceps Extension", "arms", null, 1, "rir", "cb"], ["Dumbbell Overhead Extension", "arms", null, 1, "rir", "db"], ["Skullcrusher", "arms", null, 1, "rir", "bb"], ["Dumbbell Skullcrusher", "arms", null, 1, "rir", "db"], ["JM Press", "arms", null, 1, "rir", "bb"], ["Tate Press", "arms", null, 1, "rir", "db"], ["French Press", "arms", null, 1, "rir", "bb"], ["Dip", "arms", null, 1, "rir", "bw"], ["Weighted Dip", "arms", null, 1, "rir", "bw"], ["Machine Dip", "arms", null, 1, "rir", "mc"], ["Bench Dip", "arms", null, 1, "rir", "bw"], ["Close-Grip Push-Up", "arms", null, 1, "rir", "bw"], ["Triceps Kickback", "arms", null, 1, "rir", "db"], ["Barbell Curl", "arms", null, 1, "rir", "bb"], ["EZ-Bar Curl", "arms", null, 1, "rir", "bb"], ["Dumbbell Curl", "arms", null, 1, "rir", "db"], ["Alternating DB Curl", "arms", null, 1, "rir", "db"], ["Hammer Curl", "arms", null, 1, "rir", "db"], ["Cross-Body Hammer Curl", "arms", null, 1, "rir", "db"], ["Preacher Curl", "arms", null, 1, "rir", "bb"], ["DB Preacher Curl", "arms", null, 1, "rir", "db"], ["Incline Dumbbell Curl", "arms", null, 1, "rir", "db"], ["Spider Curl", "arms", null, 1, "rir", "db"], ["Concentration Curl", "arms", null, 1, "rir", "db"], ["Cable Curl", "arms", null, 1, "rir", "cb"], ["Bayesian Curl", "arms", null, 1, "rir", "cb"], ["Rope Hammer Curl", "arms", null, 1, "rir", "cb"], ["Reverse Curl", "arms", null, 1, "rir", "bb"], ["Zottman Curl", "arms", null, 1, "rir", "db"], ["Machine Curl", "arms", null, 1, "rir", "mc"], ["21s", "arms", null, 1, "rir", "bb"], ["Drag Curl", "arms", null, 1, "rir", "bb"], ["Band Curl", "arms", null, 1, "rir", "bd"],
// ============================ LEGS (ISOLATION) =========================
["Leg Extension", "legs", null, 1, "rir", "mc"], ["Single-Leg Extension", "legs", null, 1, "rir", "mc"], ["Lying Leg Curl", "legs", null, 1, "rir", "mc"], ["Seated Leg Curl", "legs", null, 1, "rir", "mc"], ["Standing Leg Curl", "legs", null, 1, "rir", "mc"], ["Single-Leg Curl", "legs", null, 1, "rir", "mc"], ["Standing Calf Raise", "legs", null, 1, "rir", "mc"], ["Seated Calf Raise", "legs", null, 1, "rir", "mc"], ["Leg Press Calf Raise", "legs", null, 1, "rir", "mc"], ["Donkey Calf Raise", "legs", null, 1, "rir", "mc"], ["Single-Leg Calf Raise", "legs", null, 1, "rir", "bw"], ["Smith Calf Raise", "legs", null, 1, "rir", "sm"], ["Hip Adduction", "legs", null, 1, "rir", "mc"], ["Hip Abduction", "legs", null, 1, "rir", "mc"], ["Cable Kickback", "legs", null, 1, "rir", "cb"], ["Copenhagen Plank", "legs", null, 1, "rir", "bw"], ["Tibialis Raise", "legs", null, 1, "rir", "bw"], ["Banded Monster Walk", "legs", null, 1, "rir", "bd"], ["Banded Clamshell", "legs", null, 1, "rir", "bd"], ["Frog Pump", "legs", null, 1, "rir", "bw"],
// ================================ TRUNK ================================
["Plank", "core", null, 1, "rir", "bw"], ["Side Plank", "core", null, 1, "rir", "bw"], ["RKC Plank", "core", null, 1, "rir", "bw"], ["Hanging Leg Raise", "core", null, 1, "rir", "bw"], ["Hanging Knee Raise", "core", null, 1, "rir", "bw"], ["Toes-to-Bar", "core", null, 1, "rir", "bw"], ["Ab Wheel", "core", null, 1, "rir", "bw"], ["Cable Crunch", "core", null, 1, "rir", "cb"], ["Machine Crunch", "core", null, 1, "rir", "mc"], ["Weighted Sit-Up", "core", null, 1, "rir", "bw"], ["GHD Sit-Up", "core", null, 1, "rir", "bw"], ["Decline Sit-Up", "core", null, 1, "rir", "bw"], ["Pallof Press", "core", null, 1, "rir", "cb"], ["Landmine Twist", "core", null, 1, "rir", "bb"], ["Russian Twist", "core", null, 1, "rir", "bw"], ["Hollow Hold", "core", null, 1, "rir", "bw"], ["Dead Bug", "core", null, 1, "rir", "bw"], ["Bird Dog", "core", null, 1, "rir", "bw"], ["Dragon Flag", "core", null, 1, "rir", "bw"], ["L-Sit", "core", null, 1, "rir", "bw"], ["Stir the Pot", "core", null, 1, "rir", "bw"], ["Band Anti-Rotation", "core", null, 1, "rir", "bd"], ["Reverse Crunch", "core", null, 1, "rir", "bw"], ["Jackknife", "core", null, 1, "rir", "bw"],
// ============================== OLYMPIC ================================
["Power Clean", "oly", null, 1, "rpe", "bb"], ["Hang Power Clean", "oly", null, 1, "rpe", "bb"], ["Squat Clean", "oly", null, 1, "rpe", "bb"], ["Hang Squat Clean", "oly", null, 1, "rpe", "bb"], ["Clean Pull", "oly", null, 1, "rpe", "bb"], ["Clean High Pull", "oly", null, 1, "rpe", "bb"], ["Clean Deadlift", "oly", null, 1, "rpe", "bb"], ["Power Snatch", "oly", null, 1, "rpe", "bb"], ["Hang Power Snatch", "oly", null, 1, "rpe", "bb"], ["Squat Snatch", "oly", null, 1, "rpe", "bb"], ["Snatch Pull", "oly", null, 1, "rpe", "bb"], ["Snatch High Pull", "oly", null, 1, "rpe", "bb"], ["Muscle Snatch", "oly", null, 1, "rpe", "bb"], ["Clean & Jerk", "oly", null, 1, "rpe", "bb"], ["Jerk from Rack", "oly", null, 1, "rpe", "bb"], ["Snatch Balance", "oly", null, 1, "rpe", "bb"], ["Overhead Squat (Snatch)", "oly", null, 1, "rpe", "bb"], ["Dumbbell Snatch", "oly", null, 1, "rir", "db"],
// =========================== CARRY / STRONGMAN =========================
["Farmer's Walk", "carry", null, 1, "rir", "db"], ["Trap Bar Carry", "carry", null, 1, "rir", "sp"], ["Suitcase Carry", "carry", null, 1, "rir", "db"], ["Front Rack Carry", "carry", null, 1, "rir", "kb"], ["Overhead Carry", "carry", null, 1, "rir", "kb"], ["Yoke Walk", "carry", null, 1, "rpe", "sp"], ["Sandbag Carry", "carry", null, 1, "rir", "sp"], ["Sandbag Load", "carry", null, 1, "rir", "sp"], ["Atlas Stone", "carry", null, 1, "rpe", "sp"], ["Keg Carry", "carry", null, 1, "rir", "sp"], ["Zercher Carry", "carry", null, 1, "rir", "bb"], ["Sled Pull", "carry", null, 1, "rir", "sl"],
// ============================ GRIP / NECK ==============================
["Wrist Curl", "grip", null, 1, "rir", "bb"], ["Reverse Wrist Curl", "grip", null, 1, "rir", "bb"], ["Plate Pinch", "grip", null, 1, "rir", "bb"], ["Captains of Crush", "grip", null, 1, "rir", "bw"], ["Fat Grip Hold", "grip", null, 1, "rir", "bb"], ["Wrist Roller", "grip", null, 1, "rir", "bb"], ["Neck Curl", "grip", null, 1, "rir", "bw"], ["Neck Extension", "grip", null, 1, "rir", "bw"], ["Neck Harness", "grip", null, 1, "rir", "sp"], ["Hex Hold", "grip", null, 1, "rir", "db"],
// ============================= CONDITIONING ============================
["Assault Bike", "cond", null, 1, "rir", "mc"], ["Rower", "cond", null, 1, "rir", "mc"], ["SkiErg", "cond", null, 1, "rir", "mc"], ["Treadmill Incline Walk", "cond", null, 1, "rir", "mc"], ["Stair Climber", "cond", null, 1, "rir", "mc"], ["Jump Rope", "cond", null, 1, "rir", "bw"], ["Prowler Sprint", "cond", null, 1, "rir", "sl"], ["Battle Ropes", "cond", null, 1, "rir", "bw"], ["Burpee", "cond", null, 1, "rir", "bw"], ["Bike Intervals", "cond", null, 1, "rir", "mc"], ["Incline Treadmill Run", "cond", null, 1, "rir", "mc"], ["Easy Walk", "cond", null, 1, "rir", "bw"]].map(([n, c, m, r, d, e]) => ({
  n,
  c,
  m,
  r,
  d,
  e
}));
const LIB_CATS = [{
  k: "squat",
  t: "Squat"
}, {
  k: "bench",
  t: "Bench"
}, {
  k: "deadlift",
  t: "Hinge"
}, {
  k: "press",
  t: "Overhead"
}, {
  k: "back",
  t: "Back"
}, {
  k: "arms",
  t: "Arms"
}, {
  k: "legs",
  t: "Legs"
}, {
  k: "core",
  t: "Trunk"
}, {
  k: "oly",
  t: "Olympic"
}, {
  k: "carry",
  t: "Carry"
}, {
  k: "grip",
  t: "Grip"
}, {
  k: "cond",
  t: "Cardio"
}];
const LIB_EQUIP = [{
  k: "bb",
  t: "Barbell"
}, {
  k: "db",
  t: "Dumbbell"
}, {
  k: "cb",
  t: "Cable"
}, {
  k: "mc",
  t: "Machine"
}, {
  k: "bw",
  t: "Bodyweight"
}, {
  k: "kb",
  t: "Kettlebell"
}, {
  k: "bd",
  t: "Band"
}, {
  k: "sp",
  t: "Specialty"
}, {
  k: "sm",
  t: "Smith"
}, {
  k: "sl",
  t: "Sled"
}];
// Some work is measured on a clock, not in reps: holds, carries, sleds, cardio.
// Listed by name rather than matched by pattern, because "Walking Lunge" contains
// "walk" and "Rope Pushdown" contains "rope" — a regex here would be quietly wrong.
const TIME_MOVES = new Set(["Plank", "Side Plank", "RKC Plank", "Copenhagen Plank", "Hollow Hold", "L-Sit", "Dead Hang", "Wall Sit", "Stir the Pot", "Hyperextension Hold", "Farmer's Walk", "Trap Bar Carry", "Suitcase Carry", "Front Rack Carry", "Overhead Carry", "Yoke Walk", "Sandbag Carry", "Keg Carry", "Zercher Carry", "Sled Push", "Sled Drag", "Sled Pull", "Prowler Sprint", "Belt Squat March", "Assault Bike", "Rower", "SkiErg", "Treadmill Incline Walk", "Stair Climber", "Jump Rope", "Battle Ropes", "Bike Intervals", "Incline Treadmill Run", "Easy Walk", "Fat Grip Hold", "Hex Hold", "Plate Pinch", "Wrist Roller"]);
// An exercise's own setting wins, so a movement you added yourself can be switched
// to the clock and a library default can be overridden.
const isTimed = (name, state) => {
  const ex = state && state.exercises && state.exercises[name];
  if (ex && ex.metric) return ex.metric === "time";
  return TIME_MOVES.has(name);
};
const fmtDur = sec => {
  const v = Math.max(0, Math.round(sec || 0));
  return v >= 60 ? `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}` : `${v}s`;
};
// One logged set, written the way that movement is actually measured.
function setLine(st, state) {
  const u = state && state.settings && state.settings.unit || "lb";
  if (st.secs != null) return (st.weight ? fmt(st.weight) + u + " · " : "") + fmtDur(st.secs);
  return `${fmt(st.weight)}${u} × ${st.reps} @ ${fmt(st.rpe)}`;
}
const libFind = name => LIB.find(x => x.n === name) || null;
// A movement is "strength-tracked" when it rolls up to one of the big lifts; the
// rest are logged and charted but kept out of your competition total.
/* ----------------------------------------------------------------------------
   BODYWEIGHT MOVEMENTS

   A push-up is not a zero-pound lift, and the app used to treat it as one:
   the log button simply refused, because weight had to be positive. The
   library already tags these with equipment "bw" — Deficit Push-Up among them
   — so nothing new has to be guessed about which movements they are.

   What gets stored is the load you actually moved: bodyweight times the
   fraction of it the movement holds up, plus anything you hung off a belt.
   Storing the real number is what lets the other forty-odd readers of
   set.weight — the estimator, the charts, the plate maths, cross-lift
   fatigue — keep working without knowing bodyweight movements exist.

   The bodyweight used is frozen onto the set at log time. A press you did at
   220lb stays a press you did at 220lb after you cut to 205; it is the load
   that was on you that day, and letting later weigh-ins rewrite old sets
   would quietly redraw your whole history.

   The fraction matters more than it looks. Logging push-ups at a full 220
   would make them read as a heavy movement, and cross-lift fatigue would
   start trimming your bench off them.
---------------------------------------------------------------------------- */
const LIB_BY_NAME = (() => {
  const m = {};
  for (const x of LIB) if (x && x.n) m[x.n.toLowerCase()] = x;
  return m;
})();
const equipOf = name => (LIB_BY_NAME[String(name || "").toLowerCase()] || {}).e || null;

// Roughly what share of you the movement actually lifts. Rounded, honest-ish
// numbers from the usual load-cell studies — a push-up is about two thirds of
// standing bodyweight, a pull-up is all of it.
const BW_SHARE = [[/\bdips?\b|\bmuscle-?up/i, 1], [/pull-?up|chin-?up|pull-?down bodyweight/i, 1], [/push-?up/i, 0.65], [/inverted row|body ?row|australian/i, 0.5], [/pistol|shrimp squat|single-?leg squat/i, 0.85], [/nordic|glute-?ham|ghr/i, 0.85], [/sit-?up|crunch|leg raise|knee raise|hollow|v-?up|toes to bar/i, 0.45], [/lunge|step-?up|split squat|bulgarian/i, 0.75], [/glute bridge|hip thrust/i, 0.55], [/back extension|hyperextension|reverse hyper/i, 0.55], [/calf raise/i, 0.9], [/air squat|bodyweight squat|squat jump/i, 0.7], [/plank|hold|hang|l-?sit/i, 0.6], [/burpee|mountain climber/i, 0.6]];
const bwShareFor = name => {
  for (const [re, f] of BW_SHARE) if (re.test(String(name || ""))) return f;
  return 0.7;
};

// An explicit flag on the exercise always wins, so anything the library does not
// know — or gets wrong for how you do it — can be set by hand.
// How a logged set states its load. A bodyweight set says what it was — you,
// plus whatever you hung on — rather than the total, which reads like a lie
// when you never touched a 145lb anything.
const loadLabel = (s, unit) => s && s.bwBase != null ? s.added ? `BW+${fmt(s.added)}` : "BW" : `${fmt(s.weight)}${unit}`;

/* How far a movement actually gets run from what it was asked for. Every logged
   set already carries the target it was given (tRpe) beside what it cost you
   (rpe) — the app has had this the whole time and never said it out loud. It is
   worth saying, because a movement run two points over its written effort is
   usually the real reason the loads around it are being trimmed. */
function rpeDrift(state, name, days) {
  const ex = (state.exercises || {})[name];
  if (!ex || !ex.sets) return null;
  const since = Date.now() - (days || 28) * 86400000;
  const rows = ex.sets.filter(x => x.ts >= since && x.secs == null && typeof x.tRpe === "number" && typeof x.rpe === "number");
  if (rows.length < 4) return null;
  const errs = rows.map(x => x.rpe - x.tRpe);
  const bias = errs.reduce((a, b) => a + b, 0) / errs.length;
  return {
    n: rows.length,
    bias,
    over: bias >= 0.75,
    under: bias <= -0.75
  };
}
function isBodyweightMove(name, state) {
  const ex = ((state || {}).exercises || {})[name];
  if (ex && ex.bw != null) return !!ex.bw;
  return equipOf(name) === "bw";
}
// Most recent weigh-in, in the unit the screen is speaking. Null when there is
// none on file, which the caller has to handle rather than invent a number.
function bodyweightNow(state, unit) {
  const arr = state && state.bodyweight || [];
  if (!arr.length) return null;
  const kg = arr[arr.length - 1].kg;
  if (kg == null) return null;
  return unit === "kg" ? kg : kg * LBKG;
}
// The load a bodyweight set puts on you, before anything you add to it.
function bwBaseFor(name, state, unit) {
  const bw = bodyweightNow(state, unit);
  return bw == null ? null : bw * bwShareFor(name);
}
const isAccessory = (name, state) => {
  const ex = state && state.exercises && state.exercises[name];
  if (ex && typeof ex.accessory === "boolean") return ex.accessory;
  if (TIME_MOVES.has(name)) return true;
  const L = libFind(name);
  return L ? !L.m && L.d !== "rpe" : false;
};

/* ------------------------------- program --------------------------------- */
const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MODES = [{
  v: "rpe",
  t: "RPE"
}, {
  v: "rir",
  t: "RIR"
}, {
  v: "pct",
  t: "%"
}];
// Sessions are stored against real dates. The earlier version kept template weeks
// that the calendar resolved onto dates, which meant editing one Monday silently
// edited every Monday the template came round to. Clone is how work propagates
// forward now — explicitly, once, into dates you can see.
const newProgram = () => ({
  name: "My program",
  startDate: todayStr(),
  active: true,
  days: {}
});
// tsFromDateStr returns "now" for today, which is wrong for date arithmetic, so
// calendar maths goes through a parser that always lands on local noon.
const dayStart = str => {
  const [y, m, d] = String(str || todayStr()).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
};
const addDays = (str, n) => {
  const d = dayStart(str);
  d.setDate(d.getDate() + n);
  return dateStrFromTs(d.getTime());
};
const weekStartOf = str => {
  const d = dayStart(str);
  d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  return dateStrFromTs(d.getTime());
};
const weekDates = str => {
  const a = weekStartOf(str);
  return DAY_KEYS.map((_, i) => addDays(a, i));
};
const daysBetween = (a, b) => Math.round((dayStart(b) - dayStart(a)) / 86400000);

/* ------------------------------------------------------------------
   THE LIBRARY — somewhere to put a block down without losing it.

   A block lives on real dates, which is exactly what makes one
   useless to re-run as it stands: "Oct 5" means nothing next March.
   So an archived block is stored as offsets from its own first day,
   and restoring it lays those offsets back down from whatever start
   you pick. That is the whole trick — it is what separates an archive
   you can actually reuse from a screenshot of one you can't.

   Slot ids are regenerated on the way back out, so a restored block
   can sit beside the one it was copied from without the two sharing
   identity and confusing every edit after.

   Nothing here touches a logged set. Archiving copies the plan; your
   training history stays exactly where it is.
------------------------------------------------------------------ */
const archiveId = () => "lib" + uid();
function blockToArchive(program, name) {
  const days = program && program.days || {};
  const keys = Object.keys(days).filter(k => (days[k] || []).length).sort();
  if (!keys.length) return null;
  const first = keys[0];
  const offsets = {};
  for (const k of keys) {
    // the id belongs to the live block, not to the shape of it
    offsets[daysBetween(first, k)] = days[k].map(({
      id,
      ...rest
    }) => rest);
  }
  const span = daysBetween(first, keys[keys.length - 1]);
  const lifts = [];
  for (const k of keys) for (const sl of days[k]) if (lifts.indexOf(sl.ex) < 0) lifts.push(sl.ex);
  return {
    id: archiveId(),
    name: (name || "").trim() || program.name || "Saved block",
    savedAt: Date.now(),
    offsets,
    sessions: keys.length,
    weeks: Math.max(1, Math.ceil((span + 1) / 7)),
    lifts,
    startedOn: first
  };
}

// Lay a saved block back down from `start`. Returns only the days it covers, so
// the caller decides whether that merges into the calendar or replaces it.
function archiveToDays(entry, start) {
  const out = {};
  if (!entry || !entry.offsets) return out;
  for (const off of Object.keys(entry.offsets)) {
    const slots = entry.offsets[off] || [];
    if (!slots.length) continue;
    out[addDays(start, Number(off))] = slots.map(sl => ({
      ...sl,
      id: uid(),
      bo: sl.bo ? {
        ...sl.bo
      } : sl.bo
    }));
  }
  return out;
}

// What a saved block looks like in one line, so the list reads without opening.
function archiveLine(entry) {
  if (!entry) return "";
  const s = entry.sessions || 0,
    w = entry.weeks || 1;
  return `${s} session${s === 1 ? "" : "s"} · ${w} week${w === 1 ? "" : "s"}`;
}
function weekNoFor(program, dateStr) {
  const a = dayStart(weekStartOf(program && program.startDate || todayStr()));
  const b = dayStart(weekStartOf(dateStr));
  return Math.round((b - a) / (7 * 86400000)) + 1;
}
// One-time lift of an old template program onto the dates it would have produced,
// so an existing block survives the change instead of vanishing.
function migrateProgram(pr) {
  if (!pr || pr.days || !pr.weeks) return pr;
  const days = {};
  const start = weekStartOf(pr.startDate || todayStr());
  pr.weeks.forEach((w, i) => DAY_KEYS.forEach((dk, j) => {
    const slots = w.days && w.days[dk] || [];
    if (slots.length) days[addDays(start, i * 7 + j)] = slots.map(x => ({
      ...x
    }));
  }));
  const out = {
    ...pr,
    days
  };
  delete out.weeks;
  return out;
}
const newSlot = name => {
  const L = libFind(name);
  const mode = L ? L.d : "rpe";
  const timed = TIME_MOVES.has(name);
  return {
    id: uid(),
    ex: name,
    metric: timed ? "time" : "reps",
    role: L && L.m ? "main" : L && L.d === "rpe" ? "main" : "accessory",
    sets: timed ? 3 : 1,
    reps: timed ? 45 : mode === "rpe" ? 3 : 8,
    mode,
    val: mode === "rpe" ? 8 : mode === "rir" ? 2 : 75,
    bo: null,
    note: ""
  };
};
const slotTimed = sl => sl.metric === "time";
/* --------------------------- moving days around --------------------------- */
// A week going wrong is normal: you get sick, work runs late, the gym is shut. A
// day you can't train is a day to move, not a day to lose. Everything below works
// on the days map alone and returns a new one, which is what makes undo a single
// snapshot rather than an inverse of each operation.

// Copies need fresh slot ids. Ids only have to be unique inside a day, but two
// days holding the same id makes a copy look like an alias of its source the
// moment you edit one.
const freshIds = slots => (slots || []).map(sl => ({
  ...sl,
  id: uid()
}));
// Combining appends rather than interleaving — if you're doing two sessions in one
// day you do them in order — and the arriving day's first slot drops its link so a
// superset can never straddle the join.
function combineInto(dst, arriving) {
  const add = (arriving || []).slice();
  if (add.length) add[0] = {
    ...add[0],
    link: false
  };
  return [...(dst || []), ...add];
}
const putDay = (days, d, slots) => {
  const n = {
    ...days
  };
  if (slots && slots.length) n[d] = slots;else delete n[d];
  return n;
};
const dropDay = (days, d) => {
  const n = {
    ...days
  };
  delete n[d];
  return n;
};
// mode is "combine" or "replace", and only matters when the target already has work.
function moveDay(days, from, to, mode) {
  if (from === to) return days;
  const src = days[from] || [];
  const landed = mode === "combine" ? combineInto(days[to] || [], src) : src;
  return putDay(dropDay(days, from), to, landed);
}
function copyDay(days, from, to, mode) {
  if (from === to) return days;
  const src = freshIds(days[from] || []);
  return putDay(days, to, mode === "combine" ? combineInto(days[to] || [], src) : src);
}
function swapDays(days, a, b) {
  if (a === b) return days;
  return putDay(putDay(days, a, days[b] || []), b, days[a] || []);
}
/* One movement, not the whole day. The commoner problem by far: the session was
   fine, you ran out of time for the last thing on it, and moving the day would
   drag the work you already did along with it. The slot lands at the end of the
   target day with a fresh id and unpaired, since it is no longer beside whatever
   it was supersetted with. Back on the day it left, the chain closes up: the slot
   under it pairs with the one above instead, and if it was first, the new first
   slot drops its link — a day cannot open on the second half of a superset. */
function moveSlotToDay(days, from, to, id) {
  if (from === to) return days;
  const src = days[from] || [];
  const sl = src.find(x => x.id === id);
  if (!sl) return days;
  const rest = src.filter(x => x.id !== id).map((x, i) => i === 0 ? {
    ...x,
    link: false
  } : x);
  const landed = [...(days[to] || []), {
    ...sl,
    id: uid(),
    link: false
  }];
  return putDay(putDay(days, from, rest), to, landed);
}
// Sliding the rest of the block. Everything on or after `from` moves together, so
// the shifted days can never collide with each other — but a backward shift can
// land on a day before the cut, which stays put, so those two are combined rather
// than one of them quietly disappearing.
function shiftFrom(days, from, n) {
  if (!n) return days;
  const out = {};
  for (const k of Object.keys(days)) if (k < from) out[k] = days[k];
  for (const k of Object.keys(days).filter(x => x >= from).sort()) {
    const t = addDays(k, n);
    out[t] = out[t] ? combineInto(out[t], days[k]) : days[k];
  }
  return out;
}
// How many planned days a shift would merge — the UI says so before you commit.
function shiftCollisions(days, from, n) {
  if (!n) return 0;
  const kept = new Set(Object.keys(days).filter(k => k < from));
  return Object.keys(days).filter(k => k >= from && kept.has(addDays(k, n))).length;
}

// Which week of the block today falls in. Blocks repeat, so a 4-week plan keeps
// running rather than falling off the end mid-prep.

const dayKeyFor = dateStr => DAY_KEYS[(dayStart(dateStr).getDay() + 6) % 7];
function slotsFor(program, dateStr) {
  if (!program || !program.active || !program.days) return [];
  return program.days[dateStr] || [];
}
// Target effort in RPE terms, whatever language the slot was written in.
// A superset is expressed as "paired with the movement above", not as a group id.
// That is the only model that survives reordering: move a slot and the grouping
// follows the list instead of pointing at something stale. Contiguous runs of
// linked slots form one superset, so three in a row is a circuit.
function groupSlots(slots) {
  const out = [];
  (slots || []).forEach((sl, i) => {
    if (i === 0 || !sl.link || !out.length) out.push([sl]);else out[out.length - 1].push(sl);
  });
  return out;
}
// Standard programming notation: A, B, C for the order; A1/A2 only once something
// is actually paired, because a lone movement needs no label.
function decorateSlots(slots) {
  const out = [];
  let gi = 0;
  for (const grp of groupSlots(slots)) {
    const same = grp.every(x => x.sets === grp[0].sets);
    grp.forEach((sl, j) => out.push({
      sl,
      idx: out.length,
      grouped: grp.length > 1,
      tag: String.fromCharCode(65 + gi) + (grp.length > 1 ? String(j + 1) : ""),
      first: j === 0,
      last: j === grp.length - 1,
      rounds: same ? grp[0].sets : null,
      size: grp.length
    }));
    gi++;
  }
  return out;
}
const slotRpe = slot => slot.mode === "rir" ? Math.max(5, Math.min(10, 10 - slot.val)) : slot.mode === "rpe" ? slot.val : 8;
const slotLabel = slot => slot.mode === "pct" ? `${fmt(slot.val)}%` : slot.mode === "rir" ? `${fmt(slot.val)} RIR` : `RPE ${fmt(slot.val)}`;
/* ------------------------------- programmes ------------------------------- */
// A library of training structures rather than a library of training numbers.
//
// The distinction matters more than it sounds. A downloaded programme says "do 275
// for 5"; IRONSET already knows what you can do for 5, trimmed for the fatigue you
// are carrying and the rest you just took. So what a template contributes is the
// SHAPE of a block — which lifts, on which days, at what effort, progressing how —
// and the loads stay where they belong, with your own estimator.
//
// That is also why these are described by their pattern and credited to where the
// pattern came from, rather than borrowing a name. The structures below are the
// common property of the sport; the books that popularised them are not.
//
// Everything generates into ordinary dated days, so the moment a block lands you can
// move it, swap it, combine it or clear it with the same tools as anything you built
// by hand. A template is a starting point, never a mode you are locked into.

// A main-lift slot: top set, optionally with back-offs.
const mSet = (ex, sets, reps, mode, val, bo) => ({
  ex,
  sets,
  reps,
  mode,
  val,
  bo: bo || null
});
// Top set plus a back-off block, the shape most of these use.
const topSet = (ex, reps, rpe, boSets, boReps, boRpe, boLift) => mSet(ex, 1, reps, "rpe", rpe, boSets ? {
  sets: boSets,
  reps: boReps,
  mode: "rpe",
  val: boRpe,
  lift: boLift || null
} : null);
// Straight sets across, for when every set is the same.
const straight = (ex, sets, reps, rpe) => mSet(ex, sets, reps, "rpe", rpe);
// An accessory, prescribed in reps-in-reserve because that is how they are run.
const acc = (ex, sets, reps, rir) => ({
  ex,
  sets,
  reps,
  mode: "rir",
  val: rir == null ? 2 : rir,
  bo: null,
  acc: true
});
// Speed work is a percentage of the max, not an effort — the point is bar speed.
const speed = (ex, sets, reps, pct) => mSet(ex, sets, reps, "pct", pct);

// Which weekdays a given frequency lands on, counted from the day you start.
const DAY_SPREAD = {
  1: [0],
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5]
};
// Most blocks back off every fourth week; beginners progress too fast to need it and
// masters need it sooner.
const deloadWeek = (w, every) => every > 0 && (w + 1) % every === 0;
// Effort climbs across a block and resets on a deload.
const waveRpe = (base, w, every) => deloadWeek(w, every) ? Math.max(5.5, base - 2) : Math.min(9.5, base + 0.5 * (every > 0 ? w % every : w % 4));
const LEVELS = [{
  v: 1,
  t: "Beginner",
  d: "Under a year of serious lifting, still adding weight week to week."
}, {
  v: 2,
  t: "Intermediate",
  d: "Progress now comes in blocks rather than sessions."
}, {
  v: 3,
  t: "Advanced",
  d: "Years of training, peaking around competitions."
}];
const GOALS = [{
  v: "strength",
  t: "Strength"
}, {
  v: "peak",
  t: "Peak for a meet"
}, {
  v: "size",
  t: "Size"
}, {
  v: "maintain",
  t: "Maintain"
}];

// build(days, level, week, weeks) returns one array of slots per training day.
const PROGRAMS = [{
  id: "lin-fb",
  name: "Linear Full Body",
  origin: "the pattern Starting Strength and StrongLifts made standard",
  level: [1, 1],
  days: [2, 3],
  weeks: [6, 16],
  goal: "strength",
  deload: 0,
  blurb: "Every lift, every session, adding weight for as long as it keeps working.",
  how: "Effort is held steady and the load follows your estimate up — which is what linear progression actually is once the app is doing the arithmetic.",
  build: d => {
    const a = [straight("Low-Bar Squat", 3, 5, 7), straight("Competition Bench", 3, 5, 7), acc("Barbell Row", 3, 8)];
    const b = [straight("Low-Bar Squat", 3, 5, 7), straight("Overhead Press", 3, 5, 7), straight("Conventional Deadlift", 1, 5, 7.5)];
    const c = [straight("Low-Bar Squat", 3, 5, 7), straight("Competition Bench", 3, 5, 7), acc("Lat Pulldown", 3, 10)];
    return d === 2 ? [a, b] : [a, b, c];
  }
}, {
  id: "lin-ul",
  name: "Linear Upper / Lower",
  origin: "the standard four-day beginner split",
  level: [1, 2],
  days: [4],
  weeks: [6, 16],
  goal: "strength",
  deload: 0,
  blurb: "Four days, two upper and two lower, still adding weight session to session.",
  how: "More room for accessories than full body, and each lift gets a proper warm-up instead of being third in the queue.",
  build: () => [[straight("Low-Bar Squat", 3, 5, 7), acc("Romanian Deadlift", 3, 8), acc("Leg Press", 3, 10), acc("Plank", 3, 45)], [straight("Competition Bench", 3, 5, 7), acc("Barbell Row", 4, 8), acc("Overhead Press", 2, 8), acc("Lat Pulldown", 3, 10)], [straight("Conventional Deadlift", 1, 5, 7.5), acc("Front Squat", 3, 6), acc("Lying Leg Curl", 3, 10), acc("Standing Calf Raise", 3, 12)], [straight("Overhead Press", 3, 5, 7), acc("Pull-Up", 4, 6), acc("Incline Bench", 3, 8), acc("Barbell Curl", 3, 10)]]
}, {
  id: "minimal",
  name: "Minimalist",
  origin: "the two-day template for weeks when life wins",
  level: [1, 3],
  days: [2],
  weeks: [4, 16],
  goal: "maintain",
  deload: 0,
  blurb: "Two sessions a week that keep all three lifts moving.",
  how: "Built to be the thing you actually do when the alternative is nothing. Enough to hold strength, enough to add a little.",
  build: () => [[topSet("Low-Bar Squat", 5, 8, 2, 5, 7), straight("Competition Bench", 3, 5, 7.5), acc("Barbell Row", 3, 8)], [topSet("Conventional Deadlift", 3, 8, 1, 5, 7), straight("Overhead Press", 3, 5, 7.5), acc("Lat Pulldown", 3, 10)]]
}, {
  id: "hlv",
  name: "Heavy / Light / Volume",
  origin: "the Texas Method pattern",
  level: [2, 2],
  days: [3],
  weeks: [6, 12],
  goal: "strength",
  deload: 4,
  blurb: "A volume day, a recovery day and one genuinely heavy day each week.",
  how: "Volume Monday builds the week, Wednesday keeps you moving without digging a hole, Friday is where you find out.",
  build: (d, lvl, w) => {
    const dl = deloadWeek(w, 4);
    return [[straight("Low-Bar Squat", 5, 5, dl ? 6 : 8), straight("Competition Bench", 5, 5, dl ? 6 : 8), acc("Barbell Row", 4, 8)], [straight("Low-Bar Squat", 2, 5, 6), straight("Overhead Press", 3, 5, 7), acc("Lat Pulldown", 3, 10), acc("Back Extension", 3, 12)], [topSet("Low-Bar Squat", 5, dl ? 7 : 9), topSet("Competition Bench", 5, dl ? 7 : 9), topSet("Conventional Deadlift", 5, dl ? 7 : 8.5)]];
  }
}, {
  id: "topset-ul",
  name: "Top Set and Back-offs",
  origin: "how most modern powerlifting is written",
  level: [2, 3],
  days: [4],
  weeks: [4, 12],
  goal: "strength",
  deload: 4,
  blurb: "One hard set to a target effort, then volume underneath it.",
  how: "The top set tells the app where you are today; the back-offs read the fatigue it just created. This is the shape IRONSET was built around.",
  build: (d, lvl, w) => {
    const r = waveRpe(8, w, 4),
      bo = deloadWeek(w, 4) ? 2 : 3;
    return [[topSet("Low-Bar Squat", 3, r, bo, 5, r - 1), acc("Romanian Deadlift", 3, 8), acc("Leg Press", 3, 10), acc("Hanging Leg Raise", 3, 10)], [topSet("Competition Bench", 3, r, bo, 5, r - 1), acc("Barbell Row", 4, 8), acc("Incline Bench", 3, 10), acc("Face Pull", 3, 15)], [topSet("Conventional Deadlift", 3, r, Math.max(1, bo - 1), 5, r - 1), acc("Front Squat", 3, 6), acc("Lying Leg Curl", 3, 12), acc("Back Extension", 3, 12)], [topSet("Overhead Press", 5, r, bo, 8, r - 1), acc("Pull-Up", 4, 6), acc("Dumbbell Bench", 3, 10), acc("Triceps Pushdown", 3, 12)]];
  }
}, {
  id: "dup",
  name: "Daily Undulating",
  origin: "the DUP pattern from the strength literature",
  level: [2, 3],
  days: [4],
  weeks: [4, 12],
  goal: "strength",
  deload: 4,
  blurb: "Every lift twice a week, heavy one day and for reps the other.",
  how: "Changing the rep range session to session rather than block to block. More frequency per lift than a classic split, without stacking two heavy days on the same pattern.",
  build: (d, lvl, w) => {
    const r = waveRpe(8, w, 4);
    return [[topSet("Low-Bar Squat", 3, r, 2, 5, r - 1), acc("Competition Bench", 3, 8, 3), acc("Barbell Row", 3, 10)], [topSet("Competition Bench", 3, r, 3, 5, r - 1), acc("Romanian Deadlift", 3, 8, 3), acc("Lat Pulldown", 3, 12)], [straight("Low-Bar Squat", 4, 8, r - 1.5), topSet("Overhead Press", 5, r, 2, 8, r - 1), acc("Chest-Supported Row", 3, 10)], [topSet("Conventional Deadlift", 3, r, 1, 5, r - 1), straight("Competition Bench", 4, 8, r - 1.5), acc("Leg Extension", 3, 12)]];
  }
}, {
  id: "wave",
  name: "Ascending Wave",
  origin: "the 5/3/1 pattern popularised by Jim Wendler",
  level: [2, 3],
  days: [3, 4],
  weeks: [4, 12],
  goal: "strength",
  deload: 4,
  blurb: "Three weeks of rising effort and falling reps, then a week back.",
  how: "Fives, then triples, then a single — and a deload before it gets expensive. One main lift per day, accessories behind it.",
  build: (d, lvl, w) => {
    const p = w % 4;
    const reps = [5, 3, 1, 5][p],
      rpe = [8, 8.5, 9, 6][p],
      boR = [8, 5, 5, 8][p];
    const t = ex => topSet(ex, reps, rpe, p === 3 ? 1 : 3, boR, rpe - 1.5);
    const days4 = [[t("Low-Bar Squat"), acc("Leg Press", 3, 10), acc("Lying Leg Curl", 3, 12), acc("Ab Wheel", 3, 10)], [t("Competition Bench"), acc("Barbell Row", 4, 8), acc("Dumbbell Bench", 3, 10), acc("Triceps Pushdown", 3, 12)], [t("Conventional Deadlift"), acc("Front Squat", 3, 6), acc("Back Extension", 3, 12), acc("Farmer's Walk", 3, 40)], [t("Overhead Press"), acc("Pull-Up", 4, 6), acc("Lateral Raise", 3, 15), acc("Barbell Curl", 3, 12)]];
    return d === 4 ? days4 : [days4[0], days4[1], days4[2]];
  }
}, {
  id: "ramp5",
  name: "Ramping Fives",
  origin: "the Bill Starr and Madcow five-set pattern",
  level: [2, 2],
  days: [3],
  weeks: [6, 12],
  goal: "strength",
  deload: 5,
  blurb: "Five ascending sets to one hard top five, three days a week.",
  how: "The ramp is the warm-up and the work at once. A middle road between linear progression and a real block.",
  build: (d, lvl, w) => {
    const dl = deloadWeek(w, 5),
      r = dl ? 6.5 : 8.5;
    return [[topSet("Low-Bar Squat", 5, r, 1, 8, r - 2), topSet("Competition Bench", 5, r, 1, 8, r - 2), acc("Barbell Row", 4, 8)], [straight("Low-Bar Squat", 4, 5, r - 2), straight("Overhead Press", 4, 5, r - 1), acc("Chin-Up", 3, 8), acc("Back Extension", 3, 12)], [topSet("Low-Bar Squat", 3, r + 0.5, 0), topSet("Conventional Deadlift", 5, r, 1, 5, r - 2), acc("Dip", 3, 8)]];
  }
}, {
  id: "rot-fb",
  name: "Rotating Full Body",
  origin: "the full-body template with one lift prioritised per session",
  level: [2, 3],
  days: [3],
  weeks: [4, 12],
  goal: "strength",
  deload: 4,
  blurb: "All three lifts most days, but only one of them is the priority.",
  how: "High frequency without three hard days on the same lift. Whichever lift leads gets the top set; the others are kept warm.",
  build: (d, lvl, w) => {
    const r = waveRpe(8, w, 4);
    const lead = (ex, others) => [topSet(ex, 3, r, 3, 5, r - 1)].concat(others);
    return [lead("Low-Bar Squat", [straight("Competition Bench", 3, 6, r - 1.5), acc("Barbell Row", 3, 10)]), lead("Competition Bench", [straight("Conventional Deadlift", 2, 4, r - 2), acc("Lat Pulldown", 3, 12), acc("Triceps Pushdown", 3, 12)]), lead("Conventional Deadlift", [straight("Low-Bar Squat", 3, 5, r - 2), acc("Overhead Press", 3, 8, 3), acc("Hanging Leg Raise", 3, 10)])];
  }
}, {
  id: "vi-wave",
  name: "Volume and Intensity Weeks",
  origin: "the alternating-emphasis block",
  level: [2, 3],
  days: [4],
  weeks: [6, 12],
  goal: "strength",
  deload: 6,
  blurb: "One week of volume, one week of intensity, repeating.",
  how: "Separates the two jobs instead of asking every week to do both. Useful when hard weeks every week stopped working.",
  build: (d, lvl, w) => {
    const vol = w % 2 === 0,
      dl = deloadWeek(w, 6);
    const r = dl ? 6 : vol ? 7.5 : 9;
    const main = ex => vol ? straight(ex, 5, 5, r) : topSet(ex, 2, r, 2, 4, r - 1.5);
    return [[main("Low-Bar Squat"), acc("Romanian Deadlift", 3, 8), acc("Leg Press", 3, 12)], [main("Competition Bench"), acc("Barbell Row", 4, 8), acc("Incline Bench", 3, 10), acc("Face Pull", 3, 15)], [main("Conventional Deadlift"), acc("Front Squat", 3, 6), acc("Back Extension", 3, 12)], [main("Overhead Press"), acc("Pull-Up", 4, 6), acc("Dumbbell Curl", 3, 12), acc("Lateral Raise", 3, 15)]];
  }
}, {
  id: "block",
  name: "Block Periodisation",
  origin: "the accumulation, transmutation and realisation sequence",
  level: [3, 3],
  days: [4, 5],
  weeks: [9, 12],
  goal: "strength",
  deload: 0,
  blurb: "Three phases: build the work capacity, convert it, then express it.",
  how: "Volume first at moderate effort, then the same work heavier and shorter, then low reps near your limit. Each phase prepares the next rather than repeating it.",
  build: (d, lvl, w, weeks) => {
    const third = Math.max(3, Math.floor(weeks / 3));
    const phase = w < third ? 0 : w < third * 2 ? 1 : 2;
    const spec = [[6, 7.5, 3, 8], [4, 8.5, 3, 6], [2, 9, 2, 4]][phase];
    const main = ex => topSet(ex, spec[0], spec[1], spec[2], spec[3], spec[1] - 1.5);
    const base = [[main("Low-Bar Squat"), acc("Leg Press", 3, 10), acc("Lying Leg Curl", 3, 12)], [main("Competition Bench"), acc("Barbell Row", 4, 8), acc("Triceps Pushdown", 3, 12)], [main("Conventional Deadlift"), acc("Back Extension", 3, 12), acc("Hanging Leg Raise", 3, 10)], [main("Overhead Press"), acc("Pull-Up", 4, 6), acc("Lateral Raise", 3, 15)]];
    if (d === 4) return base;
    return base.concat([[straight("Pause Squat", 3, 3, spec[1] - 1), straight("Spoto Press", 3, 3, spec[1] - 1), acc("Chest-Supported Row", 3, 12)]]);
  }
}, {
  id: "conj",
  name: "Max Effort / Dynamic Effort",
  origin: "the conjugate pattern associated with Westside Barbell",
  level: [3, 3],
  days: [4],
  weeks: [6, 12],
  goal: "strength",
  deload: 4,
  blurb: "Two days finding a heavy single on a variation, two days moving light weight fast.",
  how: "Max effort days rotate the variation so you are rarely stale and never grinding the same groove. Speed days are a percentage because the point is bar speed, not effort.",
  build: (d, lvl, w) => {
    const dl = deloadWeek(w, 4);
    const meLower = ["Box Squat", "Safety Bar Squat", "Deficit Deadlift 2in", "Block Pull 2in"][w % 4];
    const meUpper = ["2-Board Press", "Close-Grip Bench", "Pin Press", "Spoto Press"][w % 4];
    return [[topSet(meLower, 1, dl ? 7.5 : 9.5, 2, 5, 7), acc("Good Morning", 3, 8), acc("Glute Ham Raise", 3, 10), acc("Ab Wheel", 3, 12)], [topSet(meUpper, 1, dl ? 7.5 : 9.5, 3, 6, 7), acc("Dumbbell Row", 4, 10), acc("Skullcrusher", 3, 10), acc("Rear Delt Fly", 3, 15)], [speed("Speed Squat", 8, 2, dl ? 50 : 55 + w % 3 * 5), speed("Speed Deadlift", 6, 1, dl ? 60 : 70), acc("Hip Thrust", 3, 10), acc("Barbell Shrug", 3, 12)], [speed("Speed Bench", 8, 3, dl ? 45 : 50 + w % 3 * 5), acc("Pull-Up", 5, 6), acc("Dip", 3, 10), acc("Hammer Curl", 3, 12)]];
  }
}, {
  id: "hifreq",
  name: "High Frequency Squat and Bench",
  origin: "the high-frequency approach seen in Bulgarian and Sheiko-influenced training",
  level: [3, 3],
  days: [5, 6],
  weeks: [4, 10],
  goal: "strength",
  deload: 3,
  blurb: "Squat and bench almost daily, mostly submaximal.",
  how: "Frequency buys technical practice, so almost every session stops short of hard. It only works if you are honest about effort — which is the one thing this app is built to keep you honest about.",
  build: (d, lvl, w) => {
    const dl = deloadWeek(w, 3),
      base = dl ? 6.5 : 8;
    const sq = (r, n) => straight("Low-Bar Squat", n, r, base);
    const bp = (r, n) => straight("Competition Bench", n, r, base);
    const core = [[sq(3, 4), bp(4, 4), acc("Barbell Row", 3, 10)], [bp(5, 4), acc("Pause Squat", 3, 3, 3), acc("Lat Pulldown", 3, 12)], [sq(2, 5), bp(3, 5), acc("Back Extension", 3, 12)], [topSet("Conventional Deadlift", 3, dl ? 7 : 8.5, 2, 5, 7), acc("Front Squat", 3, 5, 3)], [sq(4, 4), bp(6, 3), acc("Triceps Pushdown", 3, 15)]];
    return d === 5 ? core : core.concat([[acc("Overhead Press", 4, 8, 3), acc("Chin-Up", 4, 8), acc("Lateral Raise", 3, 15)]]);
  }
}, {
  id: "peak",
  name: "Meet Peak",
  origin: "the standard competition taper",
  level: [2, 3],
  days: [3, 4],
  weeks: [6, 10],
  goal: "peak",
  deload: 0,
  meet: true,
  blurb: "Counts backwards from your meet date to the platform.",
  how: "Volume early, intensity in the middle, openers and singles at the end, and almost nothing in the last week. The last heavy session lands far enough out to recover from.",
  build: (d, lvl, w, weeks) => {
    // Counted in weeks out from the platform rather than as fractions of the block,
    // because that is how a peak is actually written: the last heavy single lands
    // three weeks out whether you started eight weeks ago or six.
    const out = weeks - w; // weeks remaining, meet week is 1
    const spec = out > 5 ? [5, 7.5, 3, 8] // build the work
    : out > 3 ? [3, 8.5, 2, 5] // convert it
    : out > 2 ? [1, 9, 1, 3] // heaviest single of the block
    : out > 1 ? [2, 8, 1, 3] // taper
    : [1, 7, 0, 0]; // meet week: openers only
    const main = ex => topSet(ex, spec[0], spec[1], spec[2], spec[3], spec[1] - 2);
    const light = out <= 1;
    const base = [[main("Low-Bar Squat")].concat(light ? [] : [acc("Leg Press", 3, 10), acc("Hanging Leg Raise", 3, 10)]), [main("Competition Bench")].concat(light ? [] : [acc("Barbell Row", 4, 8), acc("Triceps Pushdown", 3, 12)]), [main("Conventional Deadlift")].concat(light ? [] : [acc("Back Extension", 3, 12)])];
    if (d === 3) return base;
    return base.concat([light ? [acc("Lat Pulldown", 2, 10)] : [straight("Pause Squat", 3, 3, spec[1] - 1.5), straight("Spoto Press", 3, 3, spec[1] - 1.5), acc("Face Pull", 3, 15)]]);
  }
}, {
  id: "special",
  name: "Lift Specialisation",
  origin: "the bring-up-a-weak-lift block",
  level: [2, 3],
  days: [4],
  weeks: [4, 10],
  goal: "strength",
  deload: 4,
  blurb: "One lift three times a week while the other two hold.",
  how: "Squat leads by default — swap the movement on any day if you want to specialise the bench or the pull instead. The other lifts get one session each, enough to keep them.",
  build: (d, lvl, w) => {
    const r = waveRpe(8, w, 4);
    return [[topSet("Low-Bar Squat", 3, r, 3, 5, r - 1), acc("Leg Press", 3, 10), acc("Lying Leg Curl", 3, 12)], [topSet("Competition Bench", 3, r, 2, 6, r - 1), acc("Barbell Row", 4, 8), acc("Triceps Pushdown", 3, 12)], [topSet("Pause Squat", 3, r - 0.5, 2, 5, r - 1.5), acc("Front Squat", 3, 5, 3), acc("Back Extension", 3, 12)], [topSet("Conventional Deadlift", 3, r - 0.5, 1, 5, r - 1.5), straight("Low-Bar Squat", 4, 4, r - 2), acc("Ab Wheel", 3, 12)]];
  }
}, {
  id: "masters",
  name: "Masters Strength",
  origin: "built for lifters who recover slower than they used to",
  level: [1, 3],
  days: [3],
  weeks: [6, 16],
  goal: "strength",
  deload: 3,
  blurb: "Three days, effort capped, and a back-off week every third.",
  how: "Nothing above RPE 8 and more of the work in the back-offs, where the strength is built and the cost is lower. The deload comes before you need it rather than after.",
  build: (d, lvl, w) => {
    const dl = deloadWeek(w, 3),
      r = dl ? 6 : 8;
    return [[topSet("Low-Bar Squat", 5, r, 3, 6, r - 1.5), acc("Leg Press", 3, 12), acc("Back Extension", 3, 12)], [topSet("Competition Bench", 5, r, 3, 8, r - 1.5), acc("Chest-Supported Row", 3, 10), acc("Face Pull", 3, 15)], [topSet("Trap Bar Deadlift", 5, r - 0.5, 2, 6, r - 1.5), acc("Dumbbell Row", 3, 10), acc("Plank", 3, 45)]];
  }
}, {
  id: "size",
  name: "Size Block",
  origin: "a hypertrophy phase written for people who compete in strength",
  level: [2, 3],
  days: [4, 5],
  weeks: [4, 10],
  goal: "size",
  deload: 4,
  blurb: "Higher reps and more accessory volume, without losing the competition lifts.",
  how: "Run between strength blocks. The main lifts stay in to keep the pattern, but the work that drives the block is everything after them.",
  build: (d, lvl, w) => {
    const dl = deloadWeek(w, 4),
      r = dl ? 6 : 7.5;
    const base = [[straight("Low-Bar Squat", 4, 8, r), acc("Leg Press", 4, 12), acc("Lying Leg Curl", 4, 12), acc("Standing Calf Raise", 4, 15)], [straight("Competition Bench", 4, 8, r), acc("Incline Bench", 4, 10), acc("Dumbbell Bench", 3, 12), acc("Triceps Pushdown", 4, 15)], [straight("Romanian Deadlift", 4, 8, r), acc("Front Squat", 3, 8), acc("Leg Extension", 4, 15), acc("Ab Wheel", 3, 12)], [acc("Pull-Up", 4, 8), acc("Barbell Row", 4, 10), acc("Lat Pulldown", 4, 12), acc("Barbell Curl", 4, 12)]];
    if (d === 4) return base;
    return base.concat([[straight("Overhead Press", 4, 8, r), acc("Lateral Raise", 4, 15), acc("Rear Delt Fly", 4, 15), acc("Hammer Curl", 3, 12)]]);
  }
}, {
  id: "ppl",
  name: "Push / Pull / Legs",
  origin: "the six-day bodybuilding split, run twice a week",
  level: [2, 3],
  days: [6],
  weeks: [6, 12],
  goal: "size",
  deload: 4,
  blurb: "Each pattern twice a week, with enough volume to actually grow.",
  how: "Six short sessions beat three long ones for volume you can recover from — nothing has to be third in the queue.",
  build: (d, lvl, w) => {
    const r = waveRpe(7, w, 4);
    const push = [topSet("Competition Bench", 6, r, 3, 8, r - 1), acc("Overhead Press", 3, 10), acc("Incline Bench", 3, 10), acc("Lateral Raise", 3, 15), acc("Overhead Triceps Extension", 3, 12)];
    const pull = [acc("Pull-Up", 4, 8), acc("Chest-Supported Row", 4, 10), acc("Straight-Arm Pulldown", 3, 12), acc("Face Pull", 3, 15), acc("Barbell Curl", 3, 12)];
    const legs = [topSet("Low-Bar Squat", 6, r, 3, 8, r - 1), acc("Romanian Deadlift", 3, 10), acc("Leg Press", 3, 12), acc("Lying Leg Curl", 3, 12), acc("Standing Calf Raise", 4, 12)];
    const pull2 = [topSet("Conventional Deadlift", 4, r, 2, 6, r - 1), acc("Seal Row", 4, 10), acc("Lat Pulldown", 3, 12), acc("Rear Delt Fly", 3, 15), acc("Hammer Curl", 3, 12)];
    return [push, pull, legs, push, pull2, legs];
  }
}, {
  id: "ppl3",
  name: "Push / Pull / Legs, Three Days",
  origin: "the same rotation at half the frequency",
  level: [1, 2],
  days: [3],
  weeks: [6, 16],
  goal: "size",
  deload: 5,
  blurb: "One push, one pull, one legs — the simplest way to cover everything.",
  how: "Three sessions is what most people actually manage. Each pattern gets a full day rather than a corner of one.",
  build: (d, lvl, w) => {
    const r = waveRpe(7, w, 5);
    return [[topSet("Competition Bench", 8, r, 3, 10, r - 1), acc("Overhead Press", 3, 10), acc("Dip", 3, 10), acc("Lateral Raise", 3, 15)], [acc("Pull-Up", 4, 8), acc("Barbell Row", 4, 10), acc("Face Pull", 3, 15), acc("Barbell Curl", 3, 12)], [topSet("Low-Bar Squat", 8, r, 3, 10, r - 1), acc("Romanian Deadlift", 3, 10), acc("Leg Press", 3, 12), acc("Lying Leg Curl", 3, 12)]];
  }
}, {
  id: "ul-hyp",
  name: "Upper / Lower Hypertrophy",
  origin: "the four-day split built for volume rather than singles",
  level: [2, 3],
  days: [4],
  weeks: [6, 12],
  goal: "size",
  deload: 4,
  blurb: "Four days of moderate reps, each pattern twice a week.",
  how: "Sets of six to twelve at a hard but repeatable effort — the range where most size is built, and where the estimator is at its steadiest.",
  build: (d, lvl, w) => {
    const r = waveRpe(7, w, 4);
    return [[topSet("Low-Bar Squat", 6, r, 3, 8, r - 1), acc("Romanian Deadlift", 4, 8), acc("Leg Press", 3, 12), acc("Lying Leg Curl", 3, 12)], [topSet("Competition Bench", 6, r, 3, 8, r - 1), acc("Chest-Supported Row", 4, 10), acc("Incline Bench", 3, 10), acc("Lateral Raise", 3, 15)], [topSet("Conventional Deadlift", 5, r, 2, 6, r - 1), acc("Front Squat", 3, 8), acc("Walking Lunge", 3, 10), acc("Standing Calf Raise", 4, 12)], [topSet("Overhead Press", 6, r, 3, 8, r - 1), acc("Pull-Up", 4, 8), acc("Dip", 3, 10), acc("Barbell Curl", 3, 12)]];
  }
}, {
  id: "antag",
  name: "Antagonist Pairs",
  origin: "pairing opposing movements to halve the time",
  level: [2, 3],
  days: [4],
  weeks: [6, 12],
  goal: "size",
  deload: 4,
  blurb: "Push supersetted with pull, all the way down.",
  how: "While one side works the other recovers, so the session takes about two thirds as long for the same work. IRONSET pairs them and alternates for you.",
  build: (d, lvl, w) => {
    const r = waveRpe(7, w, 4);
    const pair = (a, b) => [a, {
      ...b,
      link: true
    }];
    return [[topSet("Competition Bench", 6, r, 3, 8, r - 1), ...pair(acc("Incline Bench", 3, 10), acc("Barbell Row", 3, 10)), ...pair(acc("Dip", 3, 10), acc("Lat Pulldown", 3, 12))], [topSet("Low-Bar Squat", 6, r, 3, 8, r - 1), ...pair(acc("Leg Extension", 3, 12), acc("Lying Leg Curl", 3, 12)), acc("Standing Calf Raise", 4, 15)], [topSet("Overhead Press", 6, r, 3, 8, r - 1), ...pair(acc("Lateral Raise", 3, 15), acc("Face Pull", 3, 15)), ...pair(acc("Overhead Triceps Extension", 3, 12), acc("Barbell Curl", 3, 12))], [topSet("Conventional Deadlift", 5, r, 2, 6, r - 1), ...pair(acc("Hip Thrust", 3, 10), acc("Back Extension", 3, 12)), acc("Hanging Leg Raise", 3, 12)]];
  }
}, {
  id: "fb-hyp",
  name: "Full Body Hypertrophy",
  origin: "three full-body days, built around volume",
  level: [1, 2],
  days: [3],
  weeks: [6, 12],
  goal: "size",
  deload: 5,
  blurb: "Every pattern three times a week, moderate reps throughout.",
  how: "Frequency does the work a split does with volume. Each lift is hit often enough that none of it needs to be taken to the edge.",
  build: (d, lvl, w) => {
    const r = waveRpe(7, w, 5);
    return [[topSet("Low-Bar Squat", 8, r, 2, 10, r - 1), acc("Competition Bench", 3, 10), acc("Barbell Row", 3, 10), acc("Lateral Raise", 3, 15)], [topSet("Overhead Press", 8, r, 2, 10, r - 1), acc("Romanian Deadlift", 3, 10), acc("Pull-Up", 3, 8), acc("Leg Extension", 3, 12)], [topSet("Competition Bench", 8, r, 2, 10, r - 1), acc("Front Squat", 3, 8), acc("Lat Pulldown", 3, 12), acc("Barbell Curl", 3, 12)]];
  }
}, {
  id: "express",
  name: "Forty-Five Minutes",
  origin: "the session that fits in a lunch break",
  level: [1, 3],
  days: [3, 4],
  weeks: [4, 16],
  goal: "strength",
  deload: 5,
  blurb: "One main lift, two accessories, out the door.",
  how: "Cut to what moves the total. Everything that survived is either a competition lift or the thing that most directly feeds one.",
  build: (d, lvl, w) => {
    const r = waveRpe(7.5, w, 5);
    const a = [topSet("Low-Bar Squat", 5, r, 2, 6, r - 1), acc("Romanian Deadlift", 2, 8), acc("Hanging Leg Raise", 2, 12)];
    const b = [topSet("Competition Bench", 5, r, 3, 6, r - 1), acc("Barbell Row", 3, 8), acc("Overhead Triceps Extension", 2, 12)];
    const c = [topSet("Conventional Deadlift", 4, r, 2, 5, r - 1), acc("Pull-Up", 3, 6), acc("Back Extension", 2, 12)];
    const e = [topSet("Overhead Press", 6, r, 2, 8, r - 1), acc("Lat Pulldown", 3, 10), acc("Barbell Curl", 2, 12)];
    return d === 3 ? [a, b, c] : [a, b, c, e];
  }
}, {
  id: "travel",
  name: "Travel Week",
  origin: "a hotel gym and whatever it happens to have",
  level: [1, 3],
  days: [2, 3],
  weeks: [1, 3],
  goal: "maintain",
  deload: 0,
  blurb: "Dumbbells, a bench and your own bodyweight.",
  how: "A week away costs nothing if you keep the patterns moving. No barbell anywhere in it, so it works in a hotel basement.",
  build: () => {
    const a = [acc("Goblet Squat", 4, 12), acc("Push-Up", 4, 15, 1), acc("Dumbbell Row", 4, 12), acc("Walking Lunge", 3, 12)];
    const b = [acc("Bulgarian Split Squat", 4, 10), acc("Dip", 4, 10, 1), acc("Lat Pulldown", 4, 12), acc("Plank", 3, 45)];
    const c = [acc("Romanian Deadlift", 4, 12), acc("Incline Bench", 4, 12), acc("Chin-Up", 4, 8, 1), acc("Lateral Raise", 3, 15)];
    return [a, b, c];
  }
}, {
  id: "barbell-only",
  name: "Barbell Only",
  origin: "a rack, a bar and plates",
  level: [1, 3],
  days: [3, 4],
  weeks: [6, 16],
  goal: "strength",
  deload: 4,
  blurb: "No machines, no cables, nothing you might not have.",
  how: "Built for a garage. Every accessory is a barbell movement, so nothing in the block depends on equipment you have to drive to.",
  build: (d, lvl, w) => {
    const r = waveRpe(7.5, w, 4);
    const a = [topSet("Low-Bar Squat", 5, r, 3, 6, r - 1), acc("Romanian Deadlift", 3, 8), acc("Barbell Row", 3, 8)];
    const b = [topSet("Competition Bench", 5, r, 3, 6, r - 1), acc("Overhead Press", 3, 8), acc("Barbell Curl", 3, 10)];
    const c = [topSet("Conventional Deadlift", 4, r, 2, 5, r - 1), acc("Front Squat", 3, 6), acc("Back Extension", 3, 12)];
    const e = [topSet("Overhead Press", 6, r, 2, 8, r - 1), acc("Pendlay Row", 4, 8), acc("Close-Grip Bench", 3, 8)];
    return d === 3 ? [a, b, c] : [a, b, c, e];
  }
}, {
  id: "eod",
  name: "Every Other Day",
  origin: "a rotation that ignores the calendar week",
  level: [2, 3],
  days: [4],
  weeks: [6, 12],
  goal: "strength",
  deload: 4,
  blurb: "Train, rest, train — four movements rotating regardless of what day it is.",
  how: "A seven-day week is an accident of the calendar, not of recovery. This rotates on your schedule instead, which suits shift work and anyone whose week is not the same twice.",
  build: (d, lvl, w) => {
    const r = waveRpe(7.5, w, 4);
    return [[topSet("Low-Bar Squat", 4, r, 3, 5, r - 1), acc("Leg Press", 3, 10), acc("Hanging Leg Raise", 3, 12)], [topSet("Competition Bench", 4, r, 3, 5, r - 1), acc("Barbell Row", 4, 8), acc("Overhead Triceps Extension", 3, 12)], [topSet("Conventional Deadlift", 3, r, 2, 5, r - 1), acc("Front Squat", 3, 6), acc("Back Extension", 3, 12)], [topSet("Overhead Press", 5, r, 3, 6, r - 1), acc("Pull-Up", 4, 6), acc("Lateral Raise", 3, 15)]];
  }
}, {
  id: "six-day",
  name: "Six-Day Split",
  origin: "high frequency for people who recover well",
  level: [3, 3],
  days: [6],
  weeks: [4, 10],
  goal: "strength",
  deload: 3,
  blurb: "Short, frequent, and each lift touched three times a week.",
  how: "Frequency this high only works because each session is small. Nothing here goes past a hard single set plus a back-off, which is what makes six days survivable.",
  build: (d, lvl, w) => {
    const r = waveRpe(7, w, 3);
    return [[topSet("Low-Bar Squat", 3, r, 2, 5, r - 1), acc("Leg Extension", 2, 12)], [topSet("Competition Bench", 3, r, 2, 5, r - 1), acc("Barbell Row", 3, 8)], [topSet("Conventional Deadlift", 2, r, 1, 4, r - 1), acc("Back Extension", 2, 12)], [topSet("Pause Squat", 4, r - 0.5, 2, 5, r - 1.5), acc("Lying Leg Curl", 2, 12)], [topSet("2ct Pause Bench", 4, r - 0.5, 2, 5, r - 1.5), acc("Lat Pulldown", 3, 10)], [topSet("Overhead Press", 5, r, 2, 6, r - 1), acc("Face Pull", 3, 15)]];
  }
}, {
  id: "novice-reset",
  name: "Novice Linear, With Resets",
  origin: "linear progression and the part nobody writes down",
  level: [1, 1],
  days: [3],
  weeks: [8, 20],
  goal: "strength",
  deload: 0,
  blurb: "Add weight every session until you stall, then drop back and run it up again.",
  how: "The stall is the point, not the failure — it is how you find the edge. The app drops you to around ninety percent of where you stopped and climbs back, which is the reset every linear programme assumes you know to do.",
  build: (d, lvl, w) => {
    const dip = (w + 1) % 6 === 0;
    const r = dip ? 6 : 7.5;
    return [[straight("Low-Bar Squat", 3, 5, r), straight("Competition Bench", 3, 5, r), acc("Barbell Row", 3, 8)], [straight("Low-Bar Squat", 3, 5, r - 0.5), straight("Overhead Press", 3, 5, r), straight("Conventional Deadlift", 1, 5, r)], [straight("Low-Bar Squat", 3, 5, r), straight("Competition Bench", 3, 5, r), acc("Chin-Up", 3, 6)]];
  }
}, {
  id: "lin-amrap",
  name: "Linear With Rep-Outs",
  origin: "linear progression with the last set taken out",
  level: [1, 2],
  days: [3],
  weeks: [6, 16],
  goal: "strength",
  deload: 0,
  blurb: "Straight sets, and the last one goes until it stops.",
  how: "The rep-out does two jobs: it adds the volume straight sets miss, and it tells the estimator exactly where you are, because a set taken to the edge is the most honest data you can give it.",
  build: (d, lvl, w) => {
    const r = 7.5;
    const amr = (ex, sets, reps) => ({
      ...straight(ex, sets, reps, r),
      amrap: "last"
    });
    return [[amr("Low-Bar Squat", 3, 5), amr("Competition Bench", 3, 5), acc("Barbell Row", 3, 8)], [amr("Overhead Press", 3, 5), amr("Conventional Deadlift", 2, 5), acc("Chin-Up", 3, 6)], [amr("Low-Bar Squat", 3, 5), amr("Close-Grip Bench", 3, 6), acc("Lat Pulldown", 3, 10)]];
  }
}, {
  id: "taper2",
  name: "Two-Week Taper",
  origin: "the short taper, for a meet that came round fast",
  level: [2, 3],
  days: [3, 4],
  weeks: [2, 2],
  goal: "peak",
  deload: 0,
  blurb: "Two weeks: open heavy, then get out of the way.",
  how: "Volume falls off a cliff and intensity holds. Two weeks is the least you can taper on and still arrive fresh; anything shorter is just a deload with a meet at the end.",
  build: (d, lvl, w) => {
    const first = w === 0;
    const r = first ? 8.5 : 7;
    const a = [topSet("Low-Bar Squat", first ? 2 : 1, r, first ? 1 : 0, 3, r - 1.5), acc("Hanging Leg Raise", 2, 10, 4)];
    const b = [topSet("Competition Bench", first ? 2 : 1, r, first ? 1 : 0, 3, r - 1.5), acc("Lat Pulldown", 2, 10, 4)];
    const c = [topSet("Conventional Deadlift", first ? 2 : 1, r, 0, 3, r - 1.5), acc("Back Extension", 2, 10, 4)];
    return d === 3 ? [a, b, c] : [a, b, c, [acc("Pull-Up", 2, 6, 4), acc("Face Pull", 2, 15, 4)]];
  }
}, {
  id: "taper3",
  name: "Three-Week Taper",
  origin: "the standard run-in to a platform",
  level: [2, 3],
  days: [3, 4],
  weeks: [3, 3],
  goal: "peak",
  deload: 0,
  blurb: "Openers in week one, second attempts in week two, rest in week three.",
  how: "Each week takes volume out and leaves intensity alone, so the last heavy thing you touch is roughly your opener. Meet week is deliberately almost empty.",
  build: (d, lvl, w) => {
    const r = [8.5, 9, 6][w] || 6;
    const sets = [2, 1, 1][w] || 1;
    const bo = [2, 1, 0][w] || 0;
    const a = [topSet("Low-Bar Squat", w === 2 ? 3 : sets, r, bo, 3, r - 1.5), acc("Hanging Leg Raise", 2, 10, 4)];
    const b = [topSet("Competition Bench", w === 2 ? 3 : sets, r, bo, 3, r - 1.5), acc("Lat Pulldown", 2, 10, 4)];
    const c = [topSet("Conventional Deadlift", w === 2 ? 3 : sets, r, bo, 3, r - 1.5), acc("Back Extension", 2, 10, 4)];
    return d === 3 ? [a, b, c] : [a, b, c, [acc("Pull-Up", 2, 6, 4), acc("Face Pull", 2, 15, 4)]];
  }
}, {
  id: "meetweek",
  name: "Meet Week",
  origin: "the last seven days, and nothing more",
  level: [2, 3],
  days: [2, 3],
  weeks: [1, 1],
  goal: "peak",
  deload: 0,
  blurb: "Two light sessions early in the week, then nothing.",
  how: "Nothing you do this week will make you stronger and several things could make you weaker. The only job is to keep the groove and arrive rested.",
  build: () => [[topSet("Low-Bar Squat", 2, 6, 0), topSet("Competition Bench", 2, 6, 0)], [topSet("Conventional Deadlift", 1, 5.5, 0), acc("Lat Pulldown", 2, 10, 4)], [acc("Face Pull", 2, 15, 4), acc("Plank", 2, 30, 4)]]
}, {
  id: "single-peak",
  name: "Single-Lift Peak",
  origin: "eight weeks pointed at one number",
  level: [2, 3],
  days: [3, 4],
  weeks: [6, 10],
  goal: "peak",
  deload: 4,
  blurb: "One lift gets the frequency, the attention and the taper. The others tick over.",
  how: "For a gym lift you want on a date — a first four-plate bench, a five-plate squat. Everything else is held at maintenance so the recovery goes where the goal is.",
  build: (d, lvl, w) => {
    const r = waveRpe(8, w, 4);
    return [[topSet("Low-Bar Squat", Math.max(1, 5 - w), r, 3, 5, r - 1), acc("Leg Press", 3, 10), acc("Hanging Leg Raise", 3, 12)], [topSet("Competition Bench", 5, 7, 2, 6, 6.5), acc("Barbell Row", 3, 8)], [topSet("Pause Squat", 3, r - 1, 2, 4, r - 2), acc("Conventional Deadlift", 2, 5, 3), acc("Back Extension", 3, 12)], [topSet("Overhead Press", 6, 7, 2, 8, 6.5), acc("Pull-Up", 3, 6)]].slice(0, d);
  }
}, {
  id: "return-injury",
  name: "Return From Injury",
  origin: "the ramp back, built to be boringly slow",
  level: [1, 3],
  days: [3],
  weeks: [4, 8],
  goal: "maintain",
  deload: 0,
  blurb: "Light, frequent and nowhere near failure, climbing one step a week.",
  how: "Tissue tolerates load before it tolerates effort, so this adds frequency and reps long before it adds intensity. Nothing goes above RPE 7 until the last week, and every session is designed to be stopped early without ruining the block.",
  build: (d, lvl, w) => {
    const r = Math.min(7, 5 + w * 0.5);
    return [[straight("Low-Bar Squat", 3, 8, r), acc("Leg Press", 3, 12, 4), acc("Plank", 3, 30, 4)], [straight("Competition Bench", 3, 8, r), acc("Chest-Supported Row", 3, 12, 4), acc("Face Pull", 3, 15, 4)], [straight("Romanian Deadlift", 3, 8, r), acc("Back Extension", 3, 12, 4), acc("Lat Pulldown", 3, 12, 4)]];
  }
}, {
  id: "return-layoff",
  name: "Back After Time Off",
  origin: "the first month after a long break",
  level: [1, 3],
  days: [3],
  weeks: [3, 6],
  goal: "strength",
  deload: 0,
  blurb: "Rebuild the positions first; the strength comes back faster than you expect.",
  how: "Strength returns much quicker than it was built, so the limit in the first weeks is soreness and technique, not capacity. Moderate reps at a comfortable effort, climbing steadily.",
  build: (d, lvl, w) => {
    const r = Math.min(8, 6 + w * 0.5);
    return [[straight("Low-Bar Squat", 3, 6, r), straight("Competition Bench", 3, 8, r), acc("Barbell Row", 3, 10)], [straight("Overhead Press", 3, 8, r), straight("Romanian Deadlift", 3, 6, r), acc("Lat Pulldown", 3, 12)], [straight("Front Squat", 3, 6, r), straight("Close-Grip Bench", 3, 8, r), acc("Back Extension", 3, 12)]];
  }
}, {
  id: "postmeet",
  name: "Post-Meet Rebuild",
  origin: "the four weeks after a platform",
  level: [2, 3],
  days: [3, 4],
  weeks: [3, 6],
  goal: "size",
  deload: 0,
  blurb: "Variations, higher reps, and no competition lift taken heavy.",
  how: "After a meet the useful work is the work you have not been doing. Pauses, tempos and accessories at moderate effort, while the peak drains out of you.",
  build: (d, lvl, w) => {
    const r = Math.min(8, 6.5 + w * 0.5);
    const a = [straight("Pause Squat", 4, 6, r), acc("Leg Press", 3, 12), acc("Lying Leg Curl", 3, 12)];
    const b = [straight("Spoto Press", 4, 8, r), acc("Chest-Supported Row", 4, 10), acc("Lateral Raise", 3, 15)];
    const c = [straight("Romanian Deadlift", 4, 8, r), acc("Front Squat", 3, 8), acc("Back Extension", 3, 12)];
    const e = [straight("Overhead Press", 4, 8, r), acc("Pull-Up", 4, 8), acc("Barbell Curl", 3, 12)];
    return d === 3 ? [a, b, c] : [a, b, c, e];
  }
}, {
  id: "offseason-sport",
  name: "Off-Season Strength",
  origin: "the winter block for a field-sport athlete",
  level: [1, 2],
  days: [3, 4],
  weeks: [6, 12],
  goal: "strength",
  deload: 4,
  blurb: "Strength and power, with enough left over to still be an athlete.",
  how: "Built around trap bar and front squat rather than maximal competition lifts, and capped well short of failure so it does not compete with the field work.",
  build: (d, lvl, w) => {
    const r = waveRpe(7, w, 4);
    const a = [topSet("Trap Bar Deadlift", 5, r, 2, 6, r - 1), acc("Box Jump", 4, 3, 5), acc("Walking Lunge", 3, 10)];
    const b = [topSet("Competition Bench", 5, r, 2, 6, r - 1), acc("Pull-Up", 4, 8), acc("Face Pull", 3, 15)];
    const c = [topSet("Front Squat", 5, r, 2, 6, r - 1), acc("Romanian Deadlift", 3, 8), acc("Hanging Leg Raise", 3, 12)];
    const e = [topSet("Overhead Press", 6, r, 2, 8, r - 1), acc("Chest-Supported Row", 4, 10), acc("Standing Calf Raise", 3, 15)];
    return d === 3 ? [a, b, c] : [a, b, c, e];
  }
}, {
  id: "inseason",
  name: "In-Season Maintenance",
  origin: "two short days a week during a competitive season",
  level: [1, 3],
  days: [2],
  weeks: [8, 20],
  goal: "maintain",
  deload: 0,
  blurb: "Enough to hold what you built, never enough to cost you a game.",
  how: "Strength holds for a surprisingly long time on very little, provided the little is heavy. Low reps, low volume, a long way from failure.",
  build: () => [[topSet("Trap Bar Deadlift", 3, 7, 1, 4, 6), acc("Pull-Up", 2, 6, 3)], [topSet("Competition Bench", 3, 7, 1, 4, 6), acc("Front Squat", 2, 5, 3), acc("Plank", 2, 40, 4)]]
}, {
  id: "bridge",
  name: "Size Into Strength",
  origin: "the handover between a size block and a strength one",
  level: [2, 3],
  days: [4],
  weeks: [3, 5],
  goal: "strength",
  deload: 0,
  blurb: "Reps come down and effort goes up, week by week, until you are ready to be strong again.",
  how: "Going straight from tens to singles wastes a fortnight feeling terrible. This walks the reps down — eights, then fives, then triples — so the first heavy week of the next block is not a shock.",
  build: (d, lvl, w) => {
    const reps = [8, 6, 5, 3, 3][w] || 3;
    const r = Math.min(9, 7 + w * 0.5);
    return [[topSet("Low-Bar Squat", reps, r, 2, reps + 2, r - 1), acc("Leg Press", 3, 10), acc("Hanging Leg Raise", 3, 12)], [topSet("Competition Bench", reps, r, 3, reps + 2, r - 1), acc("Barbell Row", 4, 8), acc("Overhead Triceps Extension", 3, 12)], [topSet("Conventional Deadlift", Math.max(2, reps - 2), r, 2, reps, r - 1), acc("Front Squat", 3, 6), acc("Back Extension", 3, 12)], [topSet("Overhead Press", reps + 1, r, 2, reps + 3, r - 1), acc("Pull-Up", 4, 6), acc("Lateral Raise", 3, 15)]];
  }
}, {
  id: "rev-pyramid",
  name: "Reverse Pyramid",
  origin: "the heaviest set first, while you are freshest",
  level: [2, 3],
  days: [3, 4],
  weeks: [6, 12],
  goal: "strength",
  deload: 4,
  blurb: "Top set first, then drop the weight and add reps.",
  how: "The hardest set gets the freshest nervous system, which is the whole argument. Each drop is set by effort rather than a fixed percentage, so the fatigue from the set before is already priced in.",
  build: (d, lvl, w) => {
    const r = waveRpe(8, w, 4);
    const a = [topSet("Low-Bar Squat", 4, r, 2, 8, r - 1.5), acc("Leg Press", 3, 12), acc("Hanging Leg Raise", 3, 12)];
    const b = [topSet("Competition Bench", 4, r, 2, 8, r - 1.5), acc("Barbell Row", 4, 8), acc("Overhead Triceps Extension", 3, 12)];
    const c = [topSet("Conventional Deadlift", 3, r, 2, 6, r - 1.5), acc("Front Squat", 3, 8), acc("Back Extension", 3, 12)];
    const e = [topSet("Overhead Press", 5, r, 2, 10, r - 1.5), acc("Pull-Up", 4, 6), acc("Lateral Raise", 3, 15)];
    return d === 3 ? [a, b, c] : [a, b, c, e];
  }
}, {
  id: "rest-pause",
  name: "Rest-Pause Clusters",
  origin: "one hard set, broken into pieces",
  level: [2, 3],
  days: [3],
  weeks: [4, 8],
  goal: "size",
  deload: 4,
  blurb: "A heavy set, twenty seconds, then as much as is left — twice.",
  how: "Clusters buy you hard reps at a weight you could not hold for a straight set. Brutal per minute and best used in short blocks, which is why this one caps at eight weeks.",
  build: (d, lvl, w) => {
    const r = waveRpe(8, w, 4);
    const cl = (ex, reps) => ({
      ...topSet(ex, reps, r, 2, Math.max(2, Math.round(reps / 2)), r),
      amrap: "all"
    });
    return [[cl("Low-Bar Squat", 6), acc("Leg Press", 3, 12), acc("Lying Leg Curl", 3, 12)], [cl("Competition Bench", 6), acc("Chest-Supported Row", 4, 10), acc("Lateral Raise", 3, 15)], [cl("Conventional Deadlift", 4), acc("Pull-Up", 4, 8), acc("Back Extension", 3, 12)]];
  }
}, {
  id: "work-capacity",
  name: "Work Capacity",
  origin: "the block that makes the next block possible",
  level: [1, 2],
  days: [4],
  weeks: [4, 8],
  goal: "size",
  deload: 5,
  blurb: "More sets, moderate weight, short rests — building the engine, not the peak.",
  how: "If you gas out before your last back-off, the limit is not strength. Higher set counts at a comfortable effort, with carries and sled work, so the next strength block has something to spend.",
  build: (d, lvl, w) => {
    const r = waveRpe(6.5, w, 5);
    return [[straight("Low-Bar Squat", 5, 8, r), acc("Walking Lunge", 3, 12), acc("Sled Push", 4, 30, 3)], [straight("Competition Bench", 5, 8, r), acc("Chest-Supported Row", 4, 12), acc("Push-Up", 3, 15)], [straight("Romanian Deadlift", 4, 10, r), acc("Kettlebell Swing", 4, 15), acc("Back Extension", 3, 15)], [straight("Overhead Press", 4, 10, r), acc("Lat Pulldown", 4, 12), acc("Plank", 3, 60, 3)]];
  }
}, {
  id: "press-spec",
  name: "Overhead Specialisation",
  origin: "a block for the lift that always comes last",
  level: [2, 3],
  days: [4],
  weeks: [6, 10],
  goal: "strength",
  deload: 4,
  blurb: "Press three times a week while squat and deadlift hold station.",
  how: "The overhead press is usually trained last and tired. For one block it goes first, three times a week, and everything else runs at maintenance to pay for it.",
  build: (d, lvl, w) => {
    const r = waveRpe(7.5, w, 4);
    return [[topSet("Overhead Press", 5, r, 3, 6, r - 1), acc("Pull-Up", 4, 8), acc("Lateral Raise", 3, 15)], [topSet("Low-Bar Squat", 5, 7, 2, 6, 6.5), acc("Hanging Leg Raise", 3, 12)], [topSet("Pin Press", 4, r - 0.5, 2, 6, r - 1.5), acc("Chest-Supported Row", 4, 10), acc("Overhead Triceps Extension", 3, 12)], [topSet("Conventional Deadlift", 4, 7, 1, 5, 6.5), acc("Overhead Press", 3, 10, 2), acc("Face Pull", 3, 15)]];
  }
}, {
  id: "bw-start",
  name: "Bodyweight Start",
  origin: "no equipment, and the first eight weeks of anything",
  level: [1, 1],
  days: [3],
  weeks: [4, 12],
  goal: "strength",
  deload: 0,
  blurb: "Push-ups, squats, rows and planks — earning the right to load a bar.",
  how: "Nothing here needs a gym. The point is to build the positions and the habit; when push-ups get easy at fifteen reps you are ready for a barbell, and the app will tell you.",
  build: (d, lvl, w) => {
    const r = Math.min(8, 6 + w * 0.25);
    return [[straight("Push-Up", 4, 12, r), straight("Goblet Squat", 4, 12, r), acc("Plank", 3, 40, 3)], [straight("Dumbbell Row", 4, 12, r), straight("Walking Lunge", 3, 12, r), acc("Hanging Leg Raise", 3, 10)], [straight("Dip", 3, 8, r), straight("Chin-Up", 3, 6, r), acc("Back Extension", 3, 12)]];
  }
}, {
  id: "deload",
  name: "Deload Week",
  origin: "one week, dropped in wherever you need it",
  level: [1, 3],
  days: [3],
  weeks: [1, 2],
  goal: "maintain",
  deload: 0,
  blurb: "A single week at half the work, to let a hard block land.",
  how: "Same movements, a long way from failure. Enough to keep the groove and not enough to add to the hole you are climbing out of.",
  build: () => [[straight("Low-Bar Squat", 3, 4, 6), straight("Competition Bench", 3, 5, 6), acc("Lat Pulldown", 2, 12, 4)], [straight("Overhead Press", 3, 5, 6), acc("Barbell Row", 3, 10, 4), acc("Plank", 2, 40)], [straight("Conventional Deadlift", 2, 3, 6), straight("Low-Bar Squat", 2, 5, 5.5), acc("Back Extension", 2, 12, 4)]]
}];

// A deload week subtracts from an already low target, and a back-off subtracts again.
// Rather than ask every template to remember the floors, they are enforced once here —
// which also means a template added later cannot emit an impossible prescription.
const clampVal = (mode, v) => mode === "pct" ? Math.max(30, Math.min(105, v)) : mode === "rir" ? Math.max(0, Math.min(6, v)) : Math.max(5, Math.min(10, v));
// Lay a template onto real dates. Day one is the day you chose, so starting on a
// Wednesday gives you a Wednesday block rather than silently dropping half of week one.
function generateProgram(tpl, opts) {
  const days = opts.days,
    weeks = opts.weeks,
    level = opts.level || 2;
  const spread = DAY_SPREAD[days] || DAY_SPREAD[3];
  const out = {};
  for (let w = 0; w < weeks; w++) {
    const pattern = tpl.build(days, level, w, weeks) || [];
    pattern.slice(0, days).forEach((slots, i) => {
      if (!slots || !slots.length) return;
      const date = addDays(opts.startDate, w * 7 + spread[i]);
      out[date] = slots.map(sp => {
        const timed = TIME_MOVES.has(sp.ex);
        return {
          id: uid(),
          ex: sp.ex,
          metric: timed ? "time" : "reps",
          role: sp.acc || timed ? "accessory" : "main",
          sets: Math.max(1, Math.round(sp.sets)),
          reps: Math.max(1, Math.round(sp.reps)),
          mode: sp.mode,
          val: clampVal(sp.mode, sp.val),
          bo: sp.bo ? {
            ...sp.bo,
            sets: Math.max(1, Math.round(sp.bo.sets)),
            reps: Math.max(1, Math.round(sp.bo.reps)),
            val: clampVal(sp.bo.mode, sp.bo.val)
          } : null,
          note: ""
        };
      });
    });
  }
  return out;
}
// How many sessions and how far it runs, for the preview.
function programSpan(tpl, opts) {
  const days = Object.keys(generateProgram(tpl, opts)).sort();
  return {
    count: days.length,
    first: days[0],
    last: days[days.length - 1]
  };
}

// Total working sets a slot asks for. A top set carries its back-offs; everything
// else is simply sets across.
const slotSetCount = slot => slot.bo ? 1 + Math.max(0, slot.bo.sets) : Math.max(1, slot.sets || 1);
const slotSummary = slot => slotTimed(slot) ? `${slot.sets > 1 ? slot.sets + " × " : ""}${fmtDur(slot.reps)}`
// An AMRAP still needs a load, and the load comes from the written reps and
// effort — you just do not stop there. So the prescription keeps both: the
// number that picks the weight, and the fact that the set runs past it.
: `${slot.sets > 1 ? slot.sets + "×" : ""}${slot.amrap ? `${slot.reps}+` : slot.reps} @ ${slotLabel(slot)}${slot.amrap === "all" ? " · AMRAP every set" : slot.amrap ? " · AMRAP last" : ""}`;
function Onboarding({
  onDone,
  unit
}) {
  const [step, setStep] = useState("style");
  const [chosen, setChosen] = useState({});
  const LIFTS = ["Squat", "Bench", "Deadlift", "Overhead Press"];
  const blankRow = () => ({
    weight: "",
    reps: 3,
    int: null,
    date: todayStr()
  });
  const [seeds, setSeeds] = useState({});
  const toggleLift = name => setSeeds(s => {
    if (s[name]) {
      const n = {
        ...s
      };
      delete n[name];
      return n;
    }
    return {
      ...s,
      [name]: [blankRow()]
    };
  });
  const setRow = (name, i, patch) => setSeeds(s => ({
    ...s,
    [name]: s[name].map((r, j) => j === i ? {
      ...r,
      ...patch
    } : r)
  }));
  const addRow = name => setSeeds(s => ({
    ...s,
    [name]: [...s[name], blankRow()]
  }));
  const delRow = (name, i) => setSeeds(s => {
    const rows = s[name].filter((_, j) => j !== i);
    const n = {
      ...s
    };
    if (rows.length) n[name] = rows;else delete n[name];
    return n;
  });
  const opt = (title, desc, onClick, accent) => /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: "100%",
      textAlign: "left",
      background: G.card,
      border: `1px solid ${C.line2}`,
      borderRadius: R.surface,
      padding: "17px 18px",
      cursor: "pointer",
      color: C.text,
      marginBottom: 12,
      position: "relative",
      overflow: "hidden",
      boxShadow: ELEV,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(120% 100% at 0% 0%, ${accent || C.red}22, transparent 66%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: "-0.01em"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 5,
      lineHeight: 1.55
    }
  }, desc)));
  const goSeed = patch => {
    setChosen(patch);
    setStep("seed");
  };
  const finish = withSeeds => {
    const rir = chosen.inputMode === "rir",
      def = rir ? 2 : 8;
    const collected = [];
    if (withSeeds) for (const name of Object.keys(seeds)) for (const r of seeds[name]) {
      const w = parseFloat(r.weight);
      if (!isFinite(w) || w <= 0) continue;
      const iv = r.int == null ? def : r.int;
      collected.push({
        name,
        weight: w,
        reps: r.reps,
        rpe: rir ? 10 - iv : iv,
        ts: tsFromDateStr(r.date)
      });
    }
    setChosen(c => ({
      ...c,
      _seeded: collected
    }));
    setStep("door");
  };
  // Where someone lands matters more than anything else in this flow. Forty-five
  // structures exist and nobody could find them; a recommender exists and nobody
  // knew to ask. So the last screen is three doors rather than a feature tour,
  // which is the one piece of teaching in this app that was never attached to a
  // decision — and the only one nobody has ever mentioned.
  const leave = door => onDone({
    ...chosen,
    _door: undefined
  }, chosen._seeded || [], door);
  const anySeed = Object.keys(seeds).some(n => seeds[n].some(r => isFinite(parseFloat(r.weight)) && parseFloat(r.weight) > 0));
  const lbl = {
    fontSize: 10.5,
    color: C.muted,
    marginBottom: 5,
    fontWeight: 700
  };
  const rir = chosen.inputMode === "rir",
    effLabel = rir ? "RIR" : "RPE",
    effDef = rir ? 2 : 8,
    effMin = rir ? 0 : 5,
    effMax = rir ? 5 : 10;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: C.bg,
      display: "flex",
      flexDirection: "column",
      justifyContent: step === "seed" ? "flex-start" : "center",
      padding: "24px 20px calc(24px + env(safe-area-inset-bottom, 0px))",
      overflowY: "auto",
      backgroundImage: `radial-gradient(680px 420px at 6% -4%, rgba(91,124,255,0.22), transparent 62%), radial-gradient(560px 380px at 104% 2%, rgba(255,74,61,0.18), transparent 60%)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 460,
      margin: "0 auto",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: 40,
      letterSpacing: "0.1em",
      textAlign: "center",
      textShadow: `0 0 44px ${C.red}55`
    }
  }, "IRON", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.red
    }
  }, "SET")), step === "style" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      fontSize: 13.5,
      margin: "8px 0 22px",
      lineHeight: 1.5
    }
  }, "How do you train? You can switch anytime in settings."), opt("RPE-based", "Prescribe by reps and RPE — the app suggests your load and learns from how each set feels.", () => goSeed({
    trainingMode: "rpe",
    inputMode: "rpe",
    onboarded: true
  }), C.red), opt("Percentage-based", "Prescribe by reps and a % of your max — old-school 1RM-percentage style.", () => setStep("max"), C.blue)) : step === "max" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      fontSize: 13.5,
      margin: "8px 0 22px",
      lineHeight: 1.5
    }
  }, "Run your percentages off\u2026"), opt("Your estimated max", "Auto-updates as you log — your percentages always track your current strength.", () => goSeed({
    trainingMode: "percent",
    maxMode: "dynamic",
    inputMode: "rir",
    onboarded: true
  })), opt("A max you set", "Lock a training max for each lift and bump it yourself each cycle (5/3/1 style).", () => goSeed({
    trainingMode: "percent",
    maxMode: "locked",
    inputMode: "rir",
    onboarded: true
  }), C.amber), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep("style"),
    style: {
      display: "block",
      margin: "4px auto 0",
      background: "none",
      border: "none",
      color: C.faint,
      fontSize: 12.5,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "\u2190 Back")) : step === "door" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      fontSize: 13.5,
      margin: "8px 0 22px",
      lineHeight: 1.5
    }
  }, "Last thing. Where do you want to start?"), opt("Build me a block", `Six questions — days, equipment, what you are training for — and it picks from ${PROGRAMS.length} structures and explains why.`, () => leave("coach"), C.red), opt("Choose it myself", `Browse all ${PROGRAMS.length}, filtered by the days you can train.`, () => leave("picker"), C.blue), opt("Just log", "No plan. Open Train, pick a lift, log a set — the loads still come from your own numbers.", () => leave("train"), C.amber)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontWeight: 800,
      fontSize: 15,
      marginTop: 14
    }
  }, "Head start ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint,
      fontWeight: 600
    }
  }, "(entirely optional)")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: C.muted,
      fontSize: 12.5,
      margin: "6px 0 14px",
      lineHeight: 1.5
    }
  }, "Logging a recent hard set or two gets your estimates and load suggestions working from minute one. Tap a lift to log against it \u2014 as many or as few sets as you want. Variations and any other lifts can be added later."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 14
    }
  }, LIFTS.map(name => /*#__PURE__*/React.createElement(Chip, {
    key: name,
    active: !!seeds[name],
    onClick: () => toggleLift(name)
  }, name))), Object.keys(seeds).map(name => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      background: C.surface,
      border: `1px solid ${C.line2}`,
      borderRadius: 12,
      padding: "11px 12px",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 13.5,
      marginBottom: 8
    }
  }, name), seeds[name].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: 10,
      paddingBottom: i < seeds[name].length - 1 ? 10 : 0,
      borderBottom: i < seeds[name].length - 1 ? `1px solid ${C.line}` : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-end",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 84px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: lbl
  }, "Weight"), /*#__PURE__*/React.createElement(NumField, {
    value: r.weight,
    onChange: v => setRow(name, i, {
      weight: v
    }),
    suffix: unit
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: lbl
  }, "Reps"), /*#__PURE__*/React.createElement(Stepper, {
    value: r.reps,
    onChange: v => setRow(name, i, {
      reps: v
    }),
    min: 1,
    max: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: lbl
  }, effLabel), /*#__PURE__*/React.createElement(Stepper, {
    value: r.int == null ? effDef : r.int,
    onChange: v => setRow(name, i, {
      int: v
    }),
    step: 0.5,
    min: effMin,
    max: effMax
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => delRow(name, i),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: "6px 2px"
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: lbl
  }, "Date"), /*#__PURE__*/React.createElement(DateField, {
    value: r.date,
    onChange: v => setRow(name, i, {
      date: v
    })
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => addRow(name),
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 800,
      fontSize: 12,
      cursor: "pointer",
      padding: 0
    }
  }, "+ Add another set"))), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: () => finish(true),
    style: {
      width: "100%",
      marginTop: 4
    }
  }, anySeed ? "Calibrate & start" : "Continue"), /*#__PURE__*/React.createElement("button", {
    onClick: () => finish(false),
    style: {
      display: "block",
      margin: "12px auto 0",
      background: "none",
      border: "none",
      color: C.faint,
      fontSize: 12.5,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Skip \u2014 I'll log as I go"))));
}
function TotalSheet({
  open,
  onClose,
  parts,
  models,
  total,
  unit
}) {
  const now = Date.now(),
    CUT = now - 30 * 86400000;
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Projected total"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, "Your squat, bench and deadlift estimates added together \u2014 each one built from the sets you've logged, weighted toward your hardest and most recent work."), (parts || []).map(p => {
    const m = models[p.name],
      pts = m ? m.points : [];
    let then = null;
    for (const q of pts) {
      if (q.ts <= CUT) then = q.value;
    }
    const d = then != null ? p.e1rm - then : null;
    const share = total ? Math.round(p.e1rm / total * 100) : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        borderTop: `1px solid ${C.line}`,
        padding: "13px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 14.5
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 18,
        fontWeight: 700
      }
    }, fmt(Math.round(p.e1rm)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS,
        fontSize: 11,
        color: C.faint,
        marginLeft: 3
      }
    }, unit))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 5,
        fontSize: 11.5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.faint
      }
    }, share, "% of total"), d != null && Math.round(d) !== 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        color: d > 0 ? C.good : C.red,
        fontWeight: 700
      }
    }, d > 0 ? "▲" : "▼", " ", fmt(Math.abs(Math.round(d))), " in 30 days")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 4,
        borderRadius: 2,
        background: "rgba(255,255,255,0.05)",
        marginTop: 7,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${share}%`,
        height: "100%",
        background: G.blue,
        borderRadius: 2
      }
    })));
  }));
}
// Where the week's tonnage came from — day by day, and which lifts carried it.
function LoadSheet({
  open,
  onClose,
  state,
  unit
}) {
  const cut = Date.now() - 7 * 86400000;
  const byDay = {},
    byLift = {};
  for (const [name, ex] of Object.entries(state.exercises)) for (const s of ex.sets) if (s.ts >= cut) {
    const k = new Date(s.ts).toDateString(),
      v = s.weight * Math.max(1, s.reps);
    byDay[k] = byDay[k] || {
      ton: 0,
      sets: 0
    };
    byDay[k].ton += v;
    byDay[k].sets++;
    byLift[name] = (byLift[name] || 0) + v;
  }
  const days = Object.keys(byDay).sort((a, b) => new Date(b) - new Date(a));
  const peak = Math.max(1, ...days.map(d => byDay[d].ton));
  const lifts = Object.entries(byLift).sort((a, b) => b[1] - a[1]);
  const tot = lifts.reduce((s, l) => s + l[1], 0);
  const k = v => v >= 1000 ? (v / 1000).toFixed(1) + "k" : fmt(Math.round(v));
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "7-day load"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, "Total tonnage \u2014 every set's weight times its reps \u2014 across the last seven days. A rough read on how much work you've actually put in, separate from how hard it felt."), days.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.faint
    }
  }, "Nothing logged in the last week."), days.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      borderTop: `1px solid ${C.line}`,
      padding: "11px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700
    }
  }, dshort(new Date(d).getTime())), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 13.5,
      fontWeight: 700
    }
  }, k(byDay[d].ton), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 10.5,
      color: C.faint,
      marginLeft: 3
    }
  }, unit))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.05)",
      marginTop: 6,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${byDay[d].ton / peak * 100}%`,
      height: "100%",
      background: G.amber,
      borderRadius: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 4
    }
  }, byDay[d].sets, " sets"))), lifts.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9.5,
      marginBottom: 9
    }
  }, "By lift"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      flexWrap: "wrap"
    }
  }, lifts.map(([n, v]) => /*#__PURE__*/React.createElement(Tag, {
    key: n,
    color: C.amber
  }, n, " ", Math.round(v / tot * 100), "%")))));
}
// Tapping readiness opens the reasoning: which session cost what, and how it clears.
function ReadinessSheet({
  open,
  onClose,
  rows
}) {
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Why this score"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, "Readiness is built per lift from work you logged above roughly RPE 8. Each hard session leaves a debt that decays over the days after it, and IRONSET learns how fast you personally clear it. It trims prescribed loads by at most ", Math.round(TRIM_CAP * 100), "%."), rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      borderTop: `1px solid ${C.line}`,
      padding: "13px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14.5
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 17,
      fontWeight: 700,
      color: freshColor(r.pct)
    }
  }, r.pct)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.faint,
      marginTop: 5,
      lineHeight: 1.5
    }
  }, r.trim >= 0.01 ? `Loads trimmed ${fmt(Math.round(r.trim * 1000) / 10)}%${r.peak ? ` — hardest recent work was RPE ${fmt(r.peak)}${r.days ? `, ${r.days}d ago` : ""}` : ""}.` : "Nothing recent still weighing on this lift — prescriptions run at full strength."))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 14,
      lineHeight: 1.55
    }
  }, "100 means fully recovered. The scale is deliberately sensitive, so a genuinely hard week shows up rather than hiding in the high 90s."));
}
function DashboardTab({
  state,
  models,
  analysis,
  unit,
  setTab,
  setState,
  setSel
}) {
  const [share, setShare] = useState(null);
  const [why, setWhy] = useState(false);
  const [showTotal, setShowTotal] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [deep, setDeep] = useState(false);
  const now = Date.now();
  const mains = Object.entries(state.exercises).filter(([n, e]) => !e.parent && e.sets.length && !isAccessory(n, state));
  const fresh = mains.map(([name, ex]) => {
    const rr = residualFatigue(ex.sets, now, true),
      sc = learnRecoveryScale(ex.sets);
    return {
      name,
      pct: readinessFor(rr.raw, sc),
      trim: trimFor(rr.raw, sc),
      peak: rr.peak,
      days: rr.days
    };
  }).sort((a, b) => a.pct - b.pct);
  const trainScore = fresh.length ? Math.round(fresh.reduce((s, r) => s + r.pct, 0) / fresh.length) : 100;
  // A card titled "Readiness · Today" cannot only know what your training did to you.
  // Declared life readiness lands on the same scale as predicted training debt, so
  // one number answers the question the card is actually asking. Kit is deliberately
  // left out of it: forgetting a belt says nothing about how recovered you are.
  const ckToday = checkinOn(state, todayStr());
  const lifeM = ckToday ? readyInfo(ckToday.score).m : 1;
  const score = Math.max(15, Math.min(100, Math.round(trainScore - Math.max(0, 1 - lifeM) / READY_SPAN * 62)));
  const sc = freshColor(score);
  // Copy reads the individual lifts, not just the average — a 90 overall means nothing
  // if your squat is sitting at 72.
  const listOf = a => a.length === 1 ? a[0] : a.length === 2 ? `${a[0]} and ${a[1]}` : `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}`;
  const hot = fresh.filter(r => r.pct < 80).map(r => r.name);
  const mid = fresh.filter(r => r.pct >= 80 && r.pct < 92).map(r => r.name);
  const okL = fresh.filter(r => r.pct >= 92).map(r => r.name);
  const worst = fresh.length ? fresh[0].pct : 100;
  const status = !fresh.length ? "Ready to work" : worst >= 92 ? "Primed to train" : hot.length && okL.length ? "Split readiness" : worst >= 80 ? "Ready to work" : worst >= 62 ? "Carrying fatigue" : "Focus on recovery";
  const note = (() => {
    if (!fresh.length) return "Log a few sets and readiness starts tracking.";
    if (hot.length && okL.length) return `${listOf(hot)} still recovering — ${listOf(okL)} ready to push.`;
    if (hot.length && mid.length) return `${listOf(hot)} needs care today; ${listOf(mid)} is close.`;
    if (hot.length) return `${listOf(hot)} still carrying real fatigue. Keep today controlled.`;
    if (mid.length && okL.length) return `${listOf(mid)} slightly taxed — ${listOf(okL)} good to go.`;
    if (mid.length) return "Everything is a touch taxed. Good day for quality work.";
    return "Everything has cleared. Good day to chase a top set.";
  })();
  const week = (() => {
    const cut = now - 7 * 86400000;
    let tonnage = 0,
      sets = 0;
    const days = new Set();
    for (const ex of Object.values(state.exercises)) for (const s of ex.sets) if (s.ts >= cut) {
      tonnage += s.weight * Math.max(1, s.reps);
      sets++;
      days.add(new Date(s.ts).toDateString());
    }
    return {
      tonnage: Math.round(tonnage),
      sets,
      days: days.size
    };
  })();
  // Tonnage by day for the last seven, so the load figure carries its own shape.
  const weekBars = (() => {
    const out = [],
      lbl = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const a = d.getTime(),
        z = a + 86400000;
      let t = 0;
      for (const ex of Object.values(state.exercises)) for (const st of ex.sets) if (st.ts >= a && st.ts < z) t += (st.weight || 0) * Math.max(1, st.reps || 1);
      out.push(Math.round(t));
      lbl.push("MTWTFSS"[(d.getDay() + 6) % 7]);
    }
    return {
      values: out,
      labels: lbl
    };
  })();
  const liftCards = Object.entries(state.exercises).filter(([n, e]) => !e.parent && e.sets.length && models[n] && models[n].e1rm != null && !isAccessory(n, state)).map(([n]) => ({
    name: n,
    e1rm: models[n].e1rm,
    points: models[n].points
  })).sort((a2, b2) => b2.e1rm - a2.e1rm);
  const bwKg = state.bodyweight && state.bodyweight.length ? state.bodyweight[state.bodyweight.length - 1].kg : null;
  const dots = bwKg && analysis.total != null ? Math.round(toKg(analysis.total, unit) * dotsCoeff(bwKg, state.settings && state.settings.sex || "male")) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, {
    accent: sc,
    glow: `radial-gradient(130% 95% at 10% -12%, ${sc}24, transparent 66%)`,
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, "Readiness \xB7 Today"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Share readiness",
    onClick: () => doShare(setShare, {
      type: "stat",
      label: "Readiness",
      value: String(score),
      unit: "/100",
      sub: fresh.slice(0, 3).map(r => `${r.name} ${r.pct}`).join("    "),
      date: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      })
    }),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 4,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Share, {
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Why this score",
    onClick: () => setWhy(true),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 4,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Info, {
    size: 15
  })))), /*#__PURE__*/React.createElement("div", {
    onClick: () => setWhy(true),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginTop: 12,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Ring, {
    value: score,
    max: 100,
    color: sc,
    size: 96,
    stroke: 8
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 27,
      fontWeight: 700,
      letterSpacing: "-0.04em",
      lineHeight: 1
    }
  }, score), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 9,
      color: C.faint,
      fontWeight: 600
    }
  }, "/100")), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 16.5,
      color: sc,
      letterSpacing: "-0.015em"
    }
  }, status), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 5,
      lineHeight: 1.5
    }
  }, note))), ckToday ? /*#__PURE__*/React.createElement("div", {
    onClick: () => setTab("train"),
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      cursor: "pointer",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${C.line}`,
      borderRadius: 12,
      padding: "9px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: C.muted,
      fontWeight: 600
    }
  }, "Checked in ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.text
    }
  }, ckToday.score, " \xB7 ", readyInfo(ckToday.score).t)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: C.faint,
      fontWeight: 700
    }
  }, "edit")) : /*#__PURE__*/React.createElement("div", {
    onClick: () => setTab("train"),
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      cursor: "pointer",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${C.line}`,
      borderRadius: 12,
      padding: "9px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: C.muted,
      fontWeight: 600
    }
  }, "No check-in today \u2014 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.text
    }
  }, "how did you sleep?")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: C.red,
      fontWeight: 700
    }
  }, "add")), fresh.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, fresh.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: hueFor(r.name, state),
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: C.muted,
      textTransform: "uppercase",
      letterSpacing: "0.11em",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, r.name)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 11.5,
      color: freshColor(r.pct),
      fontWeight: 700
    }
  }, r.pct)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      borderRadius: 3,
      background: "rgba(255,255,255,0.05)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.max(5, Math.min(100, r.pct))}%`,
      height: "100%",
      borderRadius: 3,
      background: `linear-gradient(90deg, ${tint(freshColor(r.pct), 0.5)}, ${freshColor(r.pct)})`,
      transition: "width .4s ease"
    }
  })))))), /*#__PURE__*/React.createElement(CheckinCard, {
    state: state,
    setState: setState,
    sel: null,
    dateStr: todayStr()
  }), /*#__PURE__*/React.createElement(Grid2, null, /*#__PURE__*/React.createElement(StatTile, {
    label: "Projected total",
    color: C.blue,
    value: analysis.total != null ? fmt(Math.round(analysis.total)) : "—",
    unit: analysis.total != null ? unit : "",
    onClick: () => setShowTotal(true),
    sub: analysis.totalDelta != null && Math.round(analysis.totalDelta) !== 0 ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: analysis.totalDelta > 0 ? C.good : C.red,
        fontWeight: 700
      }
    }, analysis.totalDelta > 0 ? "▲" : "▼", " ", fmt(Math.abs(Math.round(analysis.totalDelta))), " in 30 days") : null,
    segments: (analysis.parts || []).map(pt => ({
      value: pt.e1rm,
      color: hueFor(pt.name, state),
      short: pt.name === "Deadlift" ? "Dead" : pt.name.split(" ")[0]
    })),
    action: analysis.total != null ? /*#__PURE__*/React.createElement("button", {
      "aria-label": "Share total",
      onClick: e => {
        e.stopPropagation();
        doShare(setShare, {
          type: "stat",
          label: "Projected total",
          value: fmt(Math.round(analysis.total)),
          unit,
          delta: analysis.totalDelta != null ? Math.round(analysis.totalDelta) : null,
          sub: (analysis.parts || []).slice(0, 3).map(pt => `${pt.name} ${fmt(Math.round(pt.e1rm))}`).join("    "),
          date: new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric"
          })
        });
      },
      style: {
        background: "none",
        border: "none",
        color: C.faint,
        cursor: "pointer",
        padding: 0,
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(Share, {
      size: 13
    })) : null
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "7-day load",
    color: C.amber,
    value: week.tonnage >= 1000 ? (week.tonnage / 1000).toFixed(1) + "k" : fmt(week.tonnage),
    unit: unit,
    onClick: () => setShowLoad(true),
    bars: weekBars.values,
    barLabels: weekBars.labels,
    sub: `${week.sets} set${week.sets === 1 ? "" : "s"} · ${week.days} day${week.days === 1 ? "" : "s"}`
  })), liftCards.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    accent: C.blue,
    right: /*#__PURE__*/React.createElement("button", {
      "aria-label": "Share maxes",
      onClick: () => doShare(setShare, {
        type: "session",
        headline: "Estimated maxes",
        sub: `${liftCards.length} lifts`,
        lifts: liftCards.slice(0, 5).map(L => ({
          name: L.name,
          detail: "estimated 1RM",
          e1rm: fmt(Math.round(L.e1rm))
        })),
        date: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric"
        })
      }),
      style: {
        background: "none",
        border: "none",
        color: C.faint,
        cursor: "pointer",
        padding: 4,
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(Share, {
      size: 14
    }))
  }, "Estimated maxes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      overflowX: "auto",
      paddingBottom: 4,
      margin: "0 -2px",
      padding: "0 2px 4px"
    }
  }, liftCards.map(L => /*#__PURE__*/React.createElement(Card, {
    key: L.name,
    accent: hueFor(L.name, state),
    onClick: () => {
      setSel(L.name);
      setTab("history");
    },
    style: {
      padding: 13,
      flex: "0 0 auto",
      minWidth: 132
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: hueFor(L.name, state),
      boxShadow: `0 0 8px ${tint(hueFor(L.name, state), 0.9)}`,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: C.muted,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: 104
    }
  }, L.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: "-0.04em",
      lineHeight: 1
    }
  }, fmt(Math.round(L.e1rm)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 11,
      color: C.muted,
      marginLeft: 3,
      fontWeight: 600
    }
  }, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 11,
      marginLeft: -13,
      marginRight: -13,
      marginBottom: -13
    }
  }, /*#__PURE__*/React.createElement(Spark, {
    points: L.points,
    color: hueFor(L.name, state),
    h: 36
  })))))), /*#__PURE__*/React.createElement(Analysis, {
    view: "today",
    analysis: analysis,
    unit: unit,
    state: state,
    setState: setState,
    models: models
  }), /*#__PURE__*/React.createElement(ScoreCard, {
    analysis: analysis,
    unit: unit,
    state: state,
    setState: setState
  }), /*#__PURE__*/React.createElement(MeetCard, {
    analysis: analysis,
    unit: unit,
    state: state,
    setState: setState
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDeep(true),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: G.card,
      border: `1px solid ${C.line2}`,
      borderRadius: R.surface,
      padding: "14px 15px",
      cursor: "pointer",
      color: C.text,
      textAlign: "left",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 26,
      borderRadius: 2,
      flexShrink: 0,
      background: C.violet,
      boxShadow: `0 0 10px ${tint(C.violet, 0.5)}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 800,
      fontSize: 14
    }
  }, "Deeper reads"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 11.5,
      color: C.faint,
      marginTop: 3
    }
  }, "Variations \xB7 accessories \xB7 strength profile \xB7 recent sessions")), /*#__PURE__*/React.createElement(ChevronDown, {
    size: 16,
    style: {
      color: C.faint,
      flexShrink: 0,
      transform: "rotate(-90deg)"
    }
  })), /*#__PURE__*/React.createElement(Sheet, {
    open: deep,
    onClose: () => setDeep(false),
    title: "Deeper reads"
  }, /*#__PURE__*/React.createElement(Analysis, {
    view: "deep",
    analysis: analysis,
    unit: unit,
    state: state,
    setState: setState,
    models: models
  })), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: () => setTab("train"),
    style: {
      width: "100%"
    }
  }, "Start training \u2192"), /*#__PURE__*/React.createElement(ReadinessSheet, {
    open: why,
    onClose: () => setWhy(false),
    rows: fresh
  }), /*#__PURE__*/React.createElement(TotalSheet, {
    open: showTotal,
    onClose: () => setShowTotal(false),
    parts: analysis.parts,
    models: models,
    total: analysis.total,
    unit: unit
  }), /*#__PURE__*/React.createElement(LoadSheet, {
    open: showLoad,
    onClose: () => setShowLoad(false),
    state: state,
    unit: unit
  }), share && /*#__PURE__*/React.createElement(ShareSheet, {
    data: share,
    onClose: () => setShare(null)
  }));
}

// The 1-10 strip. One tap sets it — no dragging, no confirming, no modal.
function ReadinessStrip({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      marginTop: 11
    }
  }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => {
    const on = value === v;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: () => onChange(v),
      style: {
        flex: 1,
        minWidth: 0,
        height: 42,
        borderRadius: 10,
        cursor: "pointer",
        border: `1px solid ${on ? "transparent" : C.line}`,
        background: on ? G.red : "rgba(255,255,255,0.03)",
        color: on ? "#fff" : C.faint,
        fontFamily: MONO,
        fontSize: 13,
        fontWeight: 700,
        WebkitTapHighlightColor: "transparent",
        padding: 0,
        transition: "background .14s ease, color .14s ease"
      }
    }, v);
  }));
}

// Today's check-in. The only place in the app where the lifter tells the engine
// something it had no way of working out for itself.
function CheckinCard({
  state,
  setState,
  sel,
  dateStr
}) {
  const day = dateStr || todayStr();
  const ck = checkinOn(state, day);
  const [open, setOpen] = useState(false);
  const cls = liftClass(sel);
  const write = patch => setState(st => {
    const cur = (st.checkins || {})[day] || {
      score: READY_DEFAULT
    };
    return {
      ...st,
      checkins: {
        ...(st.checkins || {}),
        [day]: {
          ...cur,
          ...patch,
          ts: Date.now()
        }
      }
    };
  });
  const factor = conditionFactor(ck, cls);
  const trim = Math.round((1 - factor) * 1000) / 10;
  const editing = open || !ck;
  const info = ck ? readyInfo(ck.score) : null;
  return /*#__PURE__*/React.createElement(Card, {
    accent: C.blue
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 14,
      borderRadius: 2,
      background: C.blue,
      boxShadow: `0 0 10px ${C.blue}88`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, day === todayStr() ? "Today's check-in" : "Check-in · " + dshort(tsFromDateStr(day)))), ck && /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(v => !v),
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, open ? "Done" : "Change")), !editing ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      alignItems: "baseline",
      gap: 11,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 27,
      fontWeight: 700,
      letterSpacing: "-0.04em",
      lineHeight: 1
    }
  }, ck.score), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      fontWeight: 800,
      color: C.text,
      letterSpacing: "-0.01em"
    }
  }, info.t), trim > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 11.5,
      color: C.gold,
      fontWeight: 700
    }
  }, "loads \u2212", trim, "%") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 11.5,
      color: C.faint,
      fontWeight: 700
    }
  }, "loads as normal")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.faint,
      marginTop: 5,
      lineHeight: 1.5
    }
  }, "One number for everything outside the gym \u2014 sleep, stress, illness, food, how the week has gone. 8 is an ordinary day."), /*#__PURE__*/React.createElement(ReadinessStrip, {
    value: ck ? ck.score : null,
    onChange: v => {
      write({
        score: v
      });
      setOpen(true);
    }
  }), ck && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: C.text,
      marginTop: 11
    }
  }, ck.score, " \xB7 ", info.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.muted,
      marginTop: 15,
      lineHeight: 1.55,
      borderTop: `1px solid ${C.line}`,
      paddingTop: 11
    }
  }, trim > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, "Today\u2019s suggested loads drop ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.gold
    }
  }, trim, "%"), ". Your estimated max is left exactly where it is \u2014 a rough day changes what you\u2019re asked to lift, never what you\u2019re capable of.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Loads run as normal. Drop the number on a day sleep, stress or illness has caught up with you and the suggestions follow, without touching your estimated max.")))));
}

/* ============================== PROGRAM TAB ============================== */
// Pick a movement out of the library (or name your own). Search first, because by
// the time you know you want a Spoto press you do not want to scroll for it.
function ExercisePicker({
  open,
  onClose,
  onPick,
  existing
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(null);
  const [eq, setEq] = useState(null);
  const query = q.trim().toLowerCase();
  // Search beats filters: if you typed "spoto" you want it whatever is selected.
  const hits = LIB.filter(x => (!query || x.n.toLowerCase().includes(query)) && (query || !cat || x.c === cat) && (query || !eq || x.e === eq));
  // Your own movements carry no catalogue metadata, so they have to be filtered on
  // what can actually be inferred: the lift pattern from the name, and nothing at
  // all about equipment. A movement we can't place stays out of a filtered list
  // rather than claiming to be an arm exercise. Search still finds everything.
  const ownCat = n => {
    const c = liftClass(n);
    return c === "other" ? null : c;
  };
  const own = (existing || []).filter(n => !libFind(n) && (!query || n.toLowerCase().includes(query)) && (query || (!cat || ownCat(n) === cat) && !eq));
  const canCustom = query.length > 1 && !LIB.some(x => x.n.toLowerCase() === query) && !(existing || []).some(n => n.toLowerCase() === query);
  const eqName = k => {
    const E = LIB_EQUIP.find(x => x.k === k);
    return E ? E.t : "";
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Add movement"
  }, /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: `Search ${LIB.length} movements…`,
    autoFocus: true,
    style: {
      width: "100%",
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line2}`,
      borderRadius: R.input,
      padding: "12px 13px",
      color: C.text,
      fontFamily: SANS,
      fontSize: 15,
      outline: "none",
      marginBottom: 11
    }
  }), !query && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      overflowX: "auto",
      paddingBottom: 6,
      margin: "0 -4px 2px",
      padding: "0 4px 6px"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: !cat,
    onClick: () => setCat(null)
  }, "All"), LIB_CATS.map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c.k,
    sm: true,
    active: cat === c.k,
    onClick: () => setCat(c.k)
  }, c.t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      overflowX: "auto",
      margin: "0 -4px 10px",
      padding: "0 4px 6px"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: !eq,
    onClick: () => setEq(null)
  }, "Any kit"), LIB_EQUIP.map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c.k,
    sm: true,
    active: eq === c.k,
    onClick: () => setEq(c.k)
  }, c.t)))), !query && /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      marginBottom: 6
    }
  }, own.length + hits.length, " movement", own.length + hits.length === 1 ? "" : "s"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: "52vh",
      overflowY: "auto",
      overscrollBehavior: "contain",
      WebkitOverflowScrolling: "touch",
      margin: "0 -4px",
      padding: "0 4px"
    }
  }, own.map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      borderBottom: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onPick(n);
      onClose();
    },
    style: {
      ...pickRow,
      borderBottom: "none",
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 13.5,
      textAlign: "left"
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: C.faint,
      fontFamily: MONO
    }
  }, "yours")), /*#__PURE__*/React.createElement(HowTo, {
    name: n
  }))), hits.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.n,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      borderBottom: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onPick(x.n);
      onClose();
    },
    style: {
      ...pickRow,
      borderBottom: "none",
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 700,
      fontSize: 13.5,
      textAlign: "left"
    }
  }, x.n), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 10.5,
      color: C.faint,
      fontFamily: MONO,
      marginTop: 2,
      textAlign: "left"
    }
  }, eqName(x.e), x.m ? ` · feeds ${x.m} at ${Math.round(x.r * 100)}%` : ` · ${x.d === "rpe" ? "RPE" : x.d === "pct" ? "%" : "RIR"}`))), /*#__PURE__*/React.createElement(HowTo, {
    name: x.n
  }))), canCustom && /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      width: "100%",
      margin: "10px 0 2px"
    },
    onClick: () => {
      onPick(q.trim());
      onClose();
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 15
  }), " Add \"", q.trim(), "\" as a custom movement"), !hits.length && !own.length && !canCustom && /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.faint,
      fontSize: 13,
      textAlign: "center",
      padding: "22px 0"
    }
  }, "Nothing matches that.")));
}
const pickRow = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  background: "none",
  border: "none",
  borderBottom: `1px solid ${C.line}`,
  color: C.text,
  padding: "12px 2px",
  cursor: "pointer",
  fontFamily: SANS,
  WebkitTapHighlightColor: "transparent"
};

// One movement in one day. Collapsed it is a single readable line; a day of eight
// movements should fit on a screen, not demand eight cards of steppers.
function SlotCard({
  slot,
  onChange,
  onDelete,
  onRename,
  tag,
  grouped,
  groupFirst,
  groupLast,
  rounds,
  canUp,
  canDown,
  onUp,
  onDown,
  canLink,
  onToggleLink,
  state,
  onPickBoLift,
  onMoveDay
}) {
  const [open, setOpen] = useState(false);
  // The slot wears the lift's colour, so a day of work is scannable by movement
  // rather than by reading every line. Accessories keep their own quieter hues.
  const hue = hueFor(slot.ex, state);
  const up = patch => onChange({
    ...slot,
    ...patch
  });
  const modeVal = {
    rpe: {
      step: 0.5,
      min: 5,
      max: 10
    },
    rir: {
      step: 0.5,
      min: 0,
      max: 6
    },
    pct: {
      step: 2.5,
      min: 30,
      max: 105
    }
  }[slot.mode] || {
    step: 1,
    min: 1,
    max: 10
  };
  const timed = slotTimed(slot);
  const mvBtn = enabled => ({
    width: 28,
    height: 28,
    borderRadius: 8,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    border: `1px solid ${C.line}`,
    background: "rgba(255,255,255,0.03)",
    color: enabled ? C.muted : "rgba(255,255,255,0.13)",
    cursor: enabled ? "pointer" : "default",
    padding: 0,
    WebkitTapHighlightColor: "transparent"
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, grouped && groupFirst && /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      color: C.blue,
      margin: "2px 0 6px 2px"
    }
  }, "Superset ", tag.charAt(0), rounds ? ` · ${rounds} round${rounds > 1 ? "s" : ""}` : ""), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      marginBottom: grouped && !groupLast ? 4 : 9,
      overflow: "hidden",
      borderLeft: grouped ? `3px solid ${hue}` : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "11px 12px 11px 13px"
    }
  }, !grouped && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 26,
      borderRadius: 2,
      flexShrink: 0,
      background: hue,
      boxShadow: `0 0 10px ${tint(hue, 0.5)}`
    }
  }), grouped && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      fontWeight: 700,
      color: hue,
      flexShrink: 0,
      width: 20
    }
  }, tag), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(v => !v),
    style: {
      minWidth: 0,
      flex: 1,
      background: "none",
      border: "none",
      padding: 0,
      textAlign: "left",
      color: C.text,
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 800,
      fontSize: 13.5,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, slot.ex), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO,
      fontSize: 11.5,
      color: C.muted,
      marginTop: 3
    }
  }, slotSummary(slot), slot.bo ? ` + ${slot.bo.sets}×${slot.bo.reps} @ ${slot.bo.mode === "pct" ? fmt(slot.bo.val) + "%" : slot.bo.mode === "rir" ? fmt(slot.bo.val) + " RIR" : "RPE " + fmt(slot.bo.val)}${slot.bo.lift && slot.bo.lift !== slot.ex ? " · " + slot.bo.lift : ""}` : "")), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Move up",
    disabled: !canUp,
    onClick: () => canUp && onUp(),
    style: mvBtn(canUp)
  }, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 14,
    style: {
      transform: "rotate(180deg)"
    }
  })), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Move down",
    disabled: !canDown,
    onClick: () => canDown && onDown(),
    style: mvBtn(canDown)
  }, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 14
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 14px",
      borderTop: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      margin: "13px 0"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: slot.role === "main",
    onClick: () => up({
      role: "main"
    })
  }, "Track in 1RM"), /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: slot.role === "accessory",
    onClick: () => up({
      role: "accessory"
    })
  }, "Don\u2019t track")), canLink && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: !!slot.link,
    onClick: onToggleLink
  }, slot.link ? "✓ Superset with the one above" : "Superset with the one above")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, grouped ? "Rounds" : "Sets"), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: slot.sets,
    min: 1,
    max: 12,
    onChange: v => up({
      sets: v
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, timed ? "Seconds" : "Reps"), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: slot.reps,
    step: timed ? 5 : 1,
    min: timed ? 5 : 1,
    max: timed ? 900 : 30,
    onChange: v => up({
      reps: v
    })
  })), !timed && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, slot.mode === "pct" ? "% of max" : slot.mode.toUpperCase()), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: slot.val,
    step: modeVal.step,
    min: modeVal.min,
    max: modeVal.max,
    onChange: v => up({
      val: v
    })
  }))), !timed && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, "Take sets to failure?"), /*#__PURE__*/React.createElement(Segmented, {
    value: slot.amrap === "all" ? "all" : slot.amrap ? "last" : "off",
    onChange: v => up({
      amrap: v === "off" ? undefined : v
    }),
    options: [{
      value: "off",
      label: "No"
    }, {
      value: "last",
      label: "Last set"
    }, {
      value: "all",
      label: "Every set"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 7,
      lineHeight: 1.45
    }
  }, slot.amrap ? /*#__PURE__*/React.createElement(React.Fragment, null, slot.amrap === "all" ? "Every set goes" : "The last set goes", " to 0 reps left. The bar still gets loaded from ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.muted
    }
  }, slot.reps, " @ ", slotLabel(slot)), " ", "\u2014 change those to pick how heavy you fail.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Sets stop at ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.muted
    }
  }, slot.reps, " @ ", slotLabel(slot)), ". Switch this on and that stays the load; you just keep going past the reps."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, "Measured in"), /*#__PURE__*/React.createElement(Segmented, {
    value: timed ? "time" : slot.mode,
    onChange: m => up(m === "time" ? {
      metric: "time",
      reps: 45
    } : {
      metric: "reps",
      mode: m,
      reps: slot.metric === "time" ? 8 : slot.reps,
      val: m === "pct" ? 75 : m === "rir" ? 2 : 8
    }),
    options: MODES.map(m => ({
      value: m.v,
      label: m.t
    })).concat([{
      value: "time",
      label: "Time"
    }])
  })), !timed && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: C.line,
      margin: "14px -14px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: timed ? "none" : "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, "Back-offs"), /*#__PURE__*/React.createElement("button", {
    onClick: () => up({
      bo: slot.bo ? null : {
        sets: 2,
        reps: 5,
        mode: slot.mode,
        val: slot.mode === "pct" ? 70 : slot.mode === "rir" ? 3 : 7
      }
    }),
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, slot.bo ? "Remove" : "+ Add")), slot.bo && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 10,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, "Sets"), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: slot.bo.sets,
    min: 1,
    max: 8,
    onChange: v => up({
      bo: {
        ...slot.bo,
        sets: v
      }
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, "Reps"), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: slot.bo.reps,
    min: 1,
    max: 30,
    onChange: v => up({
      bo: {
        ...slot.bo,
        reps: v
      }
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, slot.bo.mode === "pct" ? "%" : slot.bo.mode.toUpperCase()), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: slot.bo.val,
    step: slot.bo.mode === "pct" ? 2.5 : 0.5,
    min: slot.bo.mode === "pct" ? 30 : slot.bo.mode === "rir" ? 0 : 5,
    max: slot.bo.mode === "pct" ? 105 : slot.bo.mode === "rir" ? 6 : 10,
    onChange: v => up({
      bo: {
        ...slot.bo,
        val: v
      }
    })
  }))), slot.bo && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      fontWeight: 700
    }
  }, "Back-offs run on"), slot.bo.lift && slot.bo.lift !== slot.ex && /*#__PURE__*/React.createElement("button", {
    onClick: () => up({
      bo: {
        ...slot.bo,
        lift: null
      }
    }),
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 800,
      fontSize: 11,
      cursor: "pointer",
      padding: 0
    }
  }, "Same as above")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onPickBoLift && onPickBoLift(slot.id),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${C.line2}`,
      borderRadius: R.ctrl,
      padding: "10px 12px",
      cursor: "pointer",
      color: C.text,
      textAlign: "left",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 16,
      borderRadius: 2,
      flexShrink: 0,
      background: hueFor(slot.bo.lift || slot.ex, state)
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontWeight: 700,
      fontSize: 13,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, slot.bo.lift || slot.ex), /*#__PURE__*/React.createElement(ChevronDown, {
    size: 15,
    style: {
      color: C.faint,
      flexShrink: 0
    }
  })), slot.bo.lift && slot.bo.lift !== slot.ex && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.faint,
      marginTop: 6,
      lineHeight: 1.5
    }
  }, "Loads come off ", slot.bo.lift, "'s own share of ", slot.ex, ", and still chain down from how the top set actually went.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 15
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      flex: 1,
      minHeight: 40,
      fontSize: 12.5
    },
    onClick: onRename
  }, "Swap movement"), onMoveDay && /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      flex: 1,
      minHeight: 40,
      fontSize: 12.5
    },
    onClick: onMoveDay
  }, "Move to a day")), /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    style: {
      width: "100%",
      marginTop: 8,
      minHeight: 38,
      fontSize: 12.5
    },
    onClick: onDelete
  }, "Remove from this day"))));
}
// Most weeks of a block are the previous week with the top sets nudged. Cloning is
// therefore the primary way a week gets built, not a convenience bolted on after.
function CloneSheet({
  open,
  onClose,
  onClone,
  fromLabel
}) {
  const RULES = [{
    k: "same",
    t: "Repeat exactly",
    d: "Same movements, same targets."
  }, {
    k: "rpe",
    t: "+0.5 RPE on main work",
    d: "Same loads asked harder — the usual way a block tightens."
  }, {
    k: "pct",
    t: "+2.5% on anything by percent",
    d: "Moves percentage-based slots up a notch."
  }, {
    k: "rep",
    t: "−1 rep on main work",
    d: "Same effort, heavier bar — intensification."
  }];
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: `Clone ${fromLabel || "week"}`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginBottom: 14,
      lineHeight: 1.55
    }
  }, "Copies every day into a new week, then applies one progression rule to the slots you marked as counting toward strength. Accessories are copied untouched."), RULES.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.k,
    onClick: () => {
      onClone(r.k);
      onClose();
    },
    style: {
      width: "100%",
      textAlign: "left",
      background: G.card,
      border: `1px solid ${C.line2}`,
      borderRadius: R.surface,
      padding: "14px 15px",
      cursor: "pointer",
      color: C.text,
      marginBottom: 9,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14
    }
  }, r.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      marginTop: 4,
      lineHeight: 1.5
    }
  }, r.d))));
}

/* ------------------------------ calendar --------------------------------- */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["M", "T", "W", "T", "F", "S", "S"];
// Mon-first grid, padded to whole weeks so the rows line up.
function monthGrid(y, m) {
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7;
  const n = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= n; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}
// Which week of the block a real date sits in. Purely a label now — nothing is
// looked up by it, because every date owns its own session.
function blockPos(program, dateStr) {
  const n = weekNoFor(program, dateStr);
  return {
    weekNo: n,
    before: n < 1
  };
}
// Everything logged on one calendar day, newest lifts grouped, for looking back.
function loggedOn(state, dateStr) {
  const dk = new Date(tsFromDateStr(dateStr)).toDateString();
  const out = [];
  for (const [name, ex] of Object.entries(state.exercises || {})) for (const s of ex.sets) if (new Date(s.ts).toDateString() === dk) out.push({
    ...s,
    ex: name
  });
  return out.sort((a, b) => a.ts - b.ts);
}
function MonthCalendar({
  y,
  m,
  sel,
  onSel,
  onShift,
  program,
  loggedDays,
  state
}) {
  const cells = monthGrid(y, m);
  const todayS = todayStr();
  const navBtn = {
    width: 34,
    height: 34,
    borderRadius: R.pill,
    border: `1px solid ${C.line}`,
    background: "rgba(255,255,255,0.03)",
    color: C.muted,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    WebkitTapHighlightColor: "transparent",
    padding: 0
  };
  return /*#__PURE__*/React.createElement(Card, {
    accent: C.blue
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onShift(-1),
    style: navBtn,
    "aria-label": "Previous month"
  }, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 16,
    style: {
      transform: "rotate(90deg)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: "-0.01em"
    }
  }, MONTHS[m], " ", y), /*#__PURE__*/React.createElement("button", {
    onClick: () => onShift(1),
    style: navBtn,
    "aria-label": "Next month"
  }, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 16,
    style: {
      transform: "rotate(-90deg)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 3
    }
  }, DOW.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: "center",
      fontFamily: MONO,
      fontSize: 9.5,
      color: C.faint,
      fontWeight: 700,
      paddingBottom: 5
    }
  }, d)), cells.map((d, i) => {
    if (!d) return /*#__PURE__*/React.createElement("div", {
      key: i
    });
    const ds = dateStrFromTs(d.getTime());
    const isToday = ds === todayS;
    const isSel = ds === sel;
    const slots = (program.days || {})[ds] || [];
    const planned = slots.length;
    // One dot per movement, in that movement's colour, capped at three. A month
    // of this and you read your own split off the calendar without labels.
    const hues = slots.slice(0, 3).map(sl => hueFor(sl.ex, state));
    const did = loggedDays[ds] || 0;
    return (
      /*#__PURE__*/
      /* A calendar cell used to announce itself as the bare number "15", with no
         month, no weekday and no word about what is on it — unusable by voice
         or by screen reader, and unaddressable by anything but what it looks
         like. The date it stands for is now on the element. */
      React.createElement("button", {
        key: i,
        onClick: () => onSel(ds),
        "data-date": ds,
        "aria-current": isToday ? "date" : undefined,
        "aria-label": d.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric"
        }) + (planned ? `, ${planned} planned` : "") + (did ? `, ${did} set${did === 1 ? "" : "s"} logged` : ""),
        style: {
          aspectRatio: "1",
          borderRadius: 10,
          cursor: "pointer",
          padding: 0,
          position: "relative",
          border: isToday && !isSel ? `1px solid ${C.red}` : `1px solid ${isSel ? "transparent" : "rgba(255,255,255,0.05)"}`,
          background: isSel ? G.red : did ? "rgba(255,255,255,0.07)" : "transparent",
          color: isSel ? "#fff" : did || planned ? C.text : C.faint,
          fontFamily: MONO,
          fontSize: 12.5,
          fontWeight: isSel ? 700 : 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          WebkitTapHighlightColor: "transparent",
          transition: "background .12s ease"
        }
      }, /*#__PURE__*/React.createElement("span", null, d.getDate()), /*#__PURE__*/React.createElement("span", {
        style: {
          display: "flex",
          gap: 2,
          height: 4,
          alignItems: "center"
        }
      }, did ? /*#__PURE__*/React.createElement("span", {
        style: {
          width: 4,
          height: 4,
          borderRadius: 99,
          background: isSel ? "#fff" : C.good
        }
      }) : null, !did && hues.map((h, k) => /*#__PURE__*/React.createElement("span", {
        key: k,
        style: {
          width: 4,
          height: 4,
          borderRadius: 99,
          background: isSel ? "#fff" : h
        }
      }))))
    );
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 13,
      justifyContent: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      color: C.faint
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: C.good
    }
  }), " trained"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      color: C.faint
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: C.red
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: C.violet
    }
  })), " planned, by lift")));
}

// Destructive actions live together, behind one door, so none of them is a
// mis-tap away while you are editing a session.
// The library: save the block you built, then change it freely. One sheet does
// both halves, because "save this" and "what have I saved" are the same thought
// arriving a few weeks apart.
/* The end of a session is a moment, and the app used to just... stop. This is
   what you did, whether or not it matched the plan — because a session you cut
   short is still a session you turned up for, and a recap that scolds you for
   the two sets you skipped is a recap nobody opens twice. */
function RecapSheet({
  open,
  onClose,
  session,
  planned,
  unit,
  inputMode,
  dateStr,
  onShare
}) {
  if (!open || !session) return null;
  const {
    lifts,
    totalSets,
    backoffs,
    anyUp
  } = session;
  const eff = x => inputMode === "rir" ? `${fmt(10 - x.rpe)} RIR` : `RPE ${fmt(x.rpe)}`;
  const tonnage = lifts.reduce((a, l) => a + l.vol, 0);
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Session complete"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "4px 0 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 54,
      fontWeight: 700,
      letterSpacing: "-0.04em",
      lineHeight: 1,
      color: C.text
    }
  }, totalSets), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginTop: 7
    }
  }, "set", totalSets === 1 ? "" : "s", " \xB7 ", lifts.length, " movement", lifts.length === 1 ? "" : "s", backoffs ? ` · ${backoffs} back-off` : ""), tonnage > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 12.5,
      color: C.muted,
      marginTop: 8
    }
  }, fmt(Math.round(tonnage)), unit, " moved")), anyUp && /*#__PURE__*/React.createElement(Callout, {
    tone: "good",
    style: {
      marginBottom: 12
    }
  }, "New estimated high today \u2014 that is the number going up."), planned && planned.total > 0 && /*#__PURE__*/React.createElement(Callout, {
    tone: planned.done >= planned.total ? "good" : "muted",
    style: {
      marginBottom: 12
    }
  }, planned.done >= planned.total ? `All ${planned.total} planned movement${planned.total === 1 ? "" : "s"} done.` : `${planned.done} of ${planned.total} planned — the rest keeps till next time.`), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginBottom: 16
    }
  }, lifts.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.name,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "11px 13px",
      borderRadius: R.ctrl,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      alignSelf: "stretch",
      borderRadius: 2,
      background: l.up ? C.good : tint(hueFor(l.name), 0.6)
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 800,
      fontSize: 14,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, l.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO,
      fontSize: 11.5,
      color: C.muted,
      marginTop: 3
    }
  }, loadLabel(l.top, unit), " \xD7 ", l.top.reps, " @ ", eff(l.top), " \xB7 ", l.sets, " set", l.sets === 1 ? "" : "s")), l.e1rm != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 700,
      flexShrink: 0,
      color: l.up ? C.good : C.muted
    }
  }, l.up ? "▲ " : "", fmt(Math.round(l.e1rm)))))), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: onShare,
    style: {
      width: "100%",
      minHeight: 50
    }
  }, /*#__PURE__*/React.createElement(Share, {
    size: 16
  }), " Share this session"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      textAlign: "center",
      marginTop: 11,
      lineHeight: 1.5
    }
  }, dateStr, " \xB7 logged and in the books."));
}
function LibrarySheet({
  open,
  onClose,
  program,
  library,
  onSave,
  onLoad,
  onRename,
  onDelete
}) {
  const [name, setName] = useState("");
  const [openId, setOpenId] = useState(null);
  const [start, setStart] = useState(todayStr());
  const [renaming, setRenaming] = useState(null);
  const [armed, setArmed] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!open) {
      setOpenId(null);
      setRenaming(null);
      setArmed(null);
      setSaved(false);
      return;
    }
    setName(program.name === "My program" ? "" : program.name || "");
    // A block you re-run almost always starts on a Monday, and almost never today.
    setStart(weekStartOf(addDays(todayStr(), 7)));
  }, [open]);
  const live = blockToArchive(program, name);
  const list = (library || []).slice().sort((a, b) => b.savedAt - a.savedAt);
  const stamp = ts => new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Block library"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${C.line2}`,
      borderRadius: R.surface,
      padding: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginBottom: 9
    }
  }, "Save this block"), live ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => {
      setName(e.target.value);
      setSaved(false);
    },
    placeholder: program.name || "Name this block",
    style: {
      width: "100%",
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line}`,
      borderRadius: R.input,
      padding: "0 13px",
      height: 44,
      color: C.text,
      fontFamily: SANS,
      fontSize: 14.5,
      fontWeight: 700,
      outline: "none",
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      margin: "9px 0 11px",
      lineHeight: 1.5
    }
  }, archiveLine(live), " \xB7 ", live.lifts.length, " movement", live.lifts.length === 1 ? "" : "s", ". Saved by shape, not by date, so you can start it again whenever you want."), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    style: {
      width: "100%",
      minHeight: 46
    },
    onClick: () => {
      if (saved) return;
      onSave(name);
      setSaved(true);
    }
  }, saved ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 16
  }), " Saved to library") : "Save to library")) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      lineHeight: 1.5
    }
  }, "There is nothing planned on the calendar yet, so there is no block to save.")), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginBottom: 10
    }
  }, "Saved blocks", list.length ? ` · ${list.length}` : ""), !list.length && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      lineHeight: 1.55,
      paddingBottom: 6
    }
  }, "Nothing saved yet. Anything you save here keeps its shape \u2014 the sessions, the lifts, the sets and the RPEs \u2014 and stays out of your way until you load it."), list.map(e => {
    const on = openId === e.id;
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      style: {
        border: `1px solid ${on ? C.line2 : C.line}`,
        borderRadius: R.surface,
        marginBottom: 9,
        overflow: "hidden",
        background: on ? "rgba(255,255,255,0.03)" : "none"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setOpenId(on ? null : e.id);
        setRenaming(null);
        setArmed(null);
      },
      style: {
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none",
        padding: "13px 14px",
        cursor: "pointer",
        color: C.text,
        WebkitTapHighlightColor: "transparent"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        fontSize: 14.5,
        letterSpacing: "-0.02em",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, e.name), /*#__PURE__*/React.createElement(ChevronDown, {
      size: 13,
      style: {
        color: C.faint,
        marginLeft: "auto",
        flexShrink: 0,
        transform: on ? "rotate(180deg)" : "none",
        transition: ".2s"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: C.faint,
        marginTop: 4
      }
    }, archiveLine(e), " \xB7 saved ", stamp(e.savedAt)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: C.muted,
        marginTop: 5,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, (e.lifts || []).map(shortLift).join(" · "))), on && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 14px 14px"
      }
    }, renaming != null ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 11
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: renaming,
      onChange: ev => setRenaming(ev.target.value),
      autoFocus: true,
      style: {
        flex: 1,
        minWidth: 0,
        background: "rgba(0,0,0,0.35)",
        border: `1px solid ${C.line}`,
        borderRadius: R.input,
        padding: "0 12px",
        height: 42,
        color: C.text,
        fontFamily: SANS,
        fontSize: 14,
        fontWeight: 700,
        outline: "none"
      }
    }), /*#__PURE__*/React.createElement(Btn, {
      kind: "solid",
      style: {
        minHeight: 42,
        fontSize: 12.5
      },
      onClick: () => {
        onRename(e.id, renaming);
        setRenaming(null);
      }
    }, "Save")) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...label2,
        color: C.faint,
        marginBottom: 7
      }
    }, "Start it on"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 11
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "date",
      value: start,
      onChange: ev => setStart(ev.target.value || todayStr()),
      style: {
        flex: 1,
        minWidth: 0,
        background: "rgba(0,0,0,0.35)",
        border: `1px solid ${C.line}`,
        borderRadius: R.input,
        padding: "0 12px",
        height: 44,
        color: C.text,
        fontFamily: MONO,
        fontSize: 14,
        fontWeight: 700,
        outline: "none",
        colorScheme: "dark"
      }
    }), /*#__PURE__*/React.createElement(Btn, {
      kind: "primary",
      style: {
        minHeight: 44,
        fontSize: 13
      },
      onClick: () => {
        onLoad(e, start);
        onClose();
      }
    }, "Add to calendar")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.faint,
        lineHeight: 1.5,
        marginBottom: 11
      }
    }, "Its ", e.sessions, " session", e.sessions === 1 ? "" : "s", " land from that date onward, replacing only the days they fall on. One undo away, and your logged sets are never touched."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setRenaming(e.name),
      style: {
        background: "none",
        border: "none",
        color: C.muted,
        fontWeight: 800,
        fontSize: 11.5,
        cursor: "pointer",
        padding: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Pencil, {
      size: 12
    }), " Rename"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (armed === e.id) {
          onDelete(e.id);
          setOpenId(null);
          setArmed(null);
        } else setArmed(e.id);
      },
      style: {
        background: "none",
        border: "none",
        color: C.red,
        fontWeight: 800,
        fontSize: 11.5,
        cursor: "pointer",
        padding: 0,
        marginLeft: "auto",
        display: "inline-flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 12
    }), " ", armed === e.id ? "Tap again to delete" : "Delete"))));
  }));
}
function ResetSheet({
  open,
  onClose,
  weekLabel,
  onClearWeek,
  onTrimAfter,
  onStartOver,
  hasBlock,
  onSaveFirst
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!open) setArmed(false);
  }, [open]);
  const row = (title, desc, onClick, danger) => /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: "100%",
      textAlign: "left",
      background: G.card,
      border: `1px solid ${danger ? C.redLine : C.line2}`,
      borderRadius: R.surface,
      padding: "14px 15px",
      cursor: "pointer",
      color: C.text,
      marginBottom: 9,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: danger ? C.red : C.text
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      marginTop: 4,
      lineHeight: 1.5
    }
  }, desc));
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Reset"
  }, hasBlock && onSaveFirst && /*#__PURE__*/React.createElement("button", {
    onClick: onSaveFirst,
    style: {
      width: "100%",
      textAlign: "left",
      background: tint(C.good, 0.08),
      border: `1px solid ${tint(C.good, 0.3)}`,
      borderRadius: R.surface,
      padding: "14px 15px",
      cursor: "pointer",
      color: C.text,
      marginBottom: 13,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: C.good
    }
  }, "Save this block to the library first"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      marginTop: 4,
      lineHeight: 1.5
    }
  }, "Keeps the whole thing under a name you choose, ready to start again on any date. Then clear whatever you like below.")), row("Clear " + (weekLabel || "this week"), "Empties all seven days of the selected calendar week.", () => {
    onClearWeek();
    onClose();
  }), row("Delete everything after this week", "Keeps every planned day up to the end of " + (weekLabel || "this week") + ".", () => {
    onTrimAfter();
    onClose();
  }), row(armed ? "Tap again to delete the program" : "Start over", armed ? "This removes the whole block. Your training history is not touched." : "Deletes the whole program and starts from an empty one. Your logged sets are kept.", () => {
    if (armed) {
      onStartOver();
      onClose();
    } else setArmed(true);
  }, true));
}

// Everything you can do to a whole day. Moving, copying and swapping don't ask for
// a date here — you pick the target by tapping it on the calendar you're already
// looking at, which is both fewer taps and the only way to see what's free.
function DaySheet({
  open,
  onClose,
  dateStr,
  days,
  onArm,
  onShift,
  onClear
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!open) setArmed(false);
  }, [open]);
  const slots = (days || {})[dateStr] || [];
  const n = slots.length;
  const later = Object.keys(days || {}).filter(k => k >= dateStr).length;
  const nice = dayStart(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
  const row = (title, desc, onClick, danger) => /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: "100%",
      textAlign: "left",
      background: G.card,
      border: `1px solid ${danger ? C.redLine : C.line2}`,
      borderRadius: R.surface,
      padding: "13px 15px",
      cursor: "pointer",
      color: C.text,
      marginBottom: 8,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: danger ? C.red : C.text
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      marginTop: 3,
      lineHeight: 1.5
    }
  }, desc));
  const shiftBtn = (d, t) => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => {
      onShift(d);
      onClose();
    },
    disabled: !later,
    style: {
      flex: 1,
      padding: "11px 0",
      borderRadius: R.ctrl,
      border: `1px solid ${C.line2}`,
      background: "rgba(255,255,255,0.04)",
      color: later ? C.text : C.faint,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 12.5,
      cursor: later ? "pointer" : "default",
      opacity: later ? 1 : 0.45,
      WebkitTapHighlightColor: "transparent"
    }
  }, t);
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: nice
  }, n > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      marginBottom: 7
    }
  }, "Send this session elsewhere"), row("Move to another day", `Takes ${n} movement${n === 1 ? "" : "s"} with it and leaves this day empty.`, () => onArm("move")), row("Copy to another day", "Leaves this day exactly as it is.", () => onArm("copy")), row("Swap with another day", "The two days trade sessions.", () => onArm("swap"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6,
      padding: "2px 0 14px"
    }
  }, "Nothing planned on this day, so there's nothing to move. You can still push the days after it."), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      margin: "16px 0 6px"
    }
  }, "When the week slips"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      lineHeight: 1.55,
      marginBottom: 9
    }
  }, later ? `Moves this day and every planned day after it together — ${later} day${later === 1 ? "" : "s"} in all. Nothing lands on top of anything else.` : "Nothing planned from this day onward."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, shiftBtn(-7, "−1 wk"), shiftBtn(-1, "−1 day"), shiftBtn(1, "+1 day"), shiftBtn(7, "+1 wk")), n > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, row(armed ? "Tap again to clear it" : "Clear this day", armed ? `Removes all ${n} movement${n === 1 ? "" : "s"}. Sets you already logged are not touched.` : "Empties the day. You can undo it straight after.", () => {
    if (armed) {
      onClear();
      onClose();
    } else setArmed(true);
  }, true)));
}

// Landing on a day that already has work is the interesting case, so it asks
// rather than guessing — combining two sessions and overwriting one are very
// different answers to a tight week.
function ConflictSheet({
  open,
  onClose,
  conflict,
  days,
  onResolve
}) {
  if (!conflict) return null;
  const to = conflict.to;
  const there = ((days || {})[to] || []).length;
  const coming = ((days || {})[conflict.from] || []).length;
  const niceTo = dayStart(to).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });
  const verb = conflict.kind === "move" ? "Moving" : "Copying";
  const row = (title, desc, mode, danger) => /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onResolve(mode);
      onClose();
    },
    style: {
      width: "100%",
      textAlign: "left",
      background: G.card,
      border: `1px solid ${danger ? C.redLine : C.line2}`,
      borderRadius: R.surface,
      padding: "13px 15px",
      cursor: "pointer",
      color: C.text,
      marginBottom: 8,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: danger ? C.red : C.text
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      marginTop: 3,
      lineHeight: 1.5
    }
  }, desc));
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: niceTo + " is taken"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6,
      marginBottom: 14
    }
  }, verb, " ", coming, " movement", coming === 1 ? "" : "s", " onto a day that already has ", there, "."), row("Do both that day", `One session of ${there + coming} movements, in order.`, "combine"), row("Replace what's there", `Drops the ${there} movement${there === 1 ? "" : "s"} already on ${niceTo}.`, "replace", true));
}

// Browse the structures, set them to your week, see what lands before it lands.

/* ----------------------------------------------------------------------------
   THE RECOMMENDER

   Most apps ask ten questions and hand back a programme with no reasoning, so
   you cannot tell whether it understood you. The explanation IS the feature
   here: every recommendation says which answers drove it and which of your own
   numbers it read.

   It also asks less than it could, because the app already knows a great deal.
   It does not ask how strong you are — it reads the estimates. It does not ask
   which lift is behind — it works it out from your ratios and offers that as
   the pre-picked answer. Asking a question you can already answer is how you
   teach someone the app is not paying attention.
---------------------------------------------------------------------------- */
/* ====================== WEAK POINTS, AND WHAT FIXES THEM ===================
   "My bench is weak" is not a diagnosis. A bench that stalls on the chest and
   a bench that stalls two inches under lockout are two different lifts failing
   for two different reasons, and the work that fixes one does nothing at all
   for the other — which is how a lifter spends a year adding triceps work to a
   press that dies at the bottom.

   So the coach asks where the bar actually stops and prescribes against that
   answer. Every movement named below is in the library under this exact name,
   so what comes out is a block that opens in Train — not a list of suggestions
   to go and type in yourself.                                               */
const WEAK_POINTS = {
  "Low-Bar Squat": [{
    k: "hole",
    t: "Out of the hole",
    d: "The bottom is where it slows down or stops",
    why: "Strength at depth, with no stretch left to spend. That is quads, plus the position that lets them work — and it is trained by starting from a dead stop down there.",
    fix: [{
      ex: "3ct Pause Squat",
      sets: 3,
      reps: 3,
      mode: "rpe",
      val: 7.5,
      note: "Sit in it. Nothing bounces."
    }, {
      ex: "Front Squat",
      sets: 3,
      reps: 5,
      mode: "rpe",
      val: 7
    }, {
      ex: "Leg Press",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "mid",
    t: "A few inches above parallel",
    d: "I come out of the bottom fine, then stall",
    why: "The hand-off from quads to hips, where the stretch has run out and the leverage has not improved yet. You train it by starting the lift at the height it fails from.",
    fix: [{
      ex: "Pin Squat",
      sets: 4,
      reps: 3,
      mode: "rpe",
      val: 7.5,
      note: "Pins set where it stalls."
    }, {
      ex: "Box Squat",
      sets: 4,
      reps: 3,
      mode: "rpe",
      val: 7
    }, {
      ex: "Tempo Squat",
      sets: 3,
      reps: 4,
      mode: "rpe",
      val: 7
    }]
  }, {
    k: "fold",
    t: "Chest caves, hips shoot up",
    d: "It turns into a good morning on the way up",
    why: "A back that cannot hold the bar's line, not legs that cannot push. More squatting does not fix this one; holding the bar where it belongs under load does.",
    fix: [{
      ex: "SSB Good Morning",
      sets: 3,
      reps: 8,
      mode: "rir",
      val: 2
    }, {
      ex: "Safety Bar Squat",
      sets: 3,
      reps: 5,
      mode: "rpe",
      val: 7
    }, {
      ex: "Barbell Row",
      sets: 4,
      reps: 8,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "brace",
    t: "I lose the brace",
    d: "The air goes, or my low back rounds under",
    why: "Trunk, not legs. A squat is only ever as heavy as what you can keep rigid between the bar and the floor, and nothing in a squat programme trains that by accident.",
    fix: [{
      ex: "Front Squat",
      sets: 3,
      reps: 5,
      mode: "rpe",
      val: 7
    }, {
      ex: "Ab Wheel",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 2
    }, {
      ex: "Pallof Press",
      sets: 3,
      reps: 12,
      mode: "rir",
      val: 2
    }]
  }],
  "Competition Bench": [{
    k: "chest",
    t: "Off the chest",
    d: "It dies the moment it touches",
    why: "Starting strength in the press — pecs, and turning a dead bar around with none of the bounce a touch-and-go gives you.",
    fix: [{
      ex: "3ct Pause Bench",
      sets: 4,
      reps: 3,
      mode: "rpe",
      val: 7.5,
      note: "Three full counts, dead still."
    }, {
      ex: "Spoto Press",
      sets: 3,
      reps: 5,
      mode: "rpe",
      val: 7
    }, {
      ex: "Dumbbell Bench",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "mid",
    t: "A few inches up",
    d: "Off the chest fine, then it stops dead",
    why: "Where the pec hands over to the triceps, and by a distance the commonest place a bench dies. Pressing from pins at that exact height is the direct fix and there is no substitute for it.",
    fix: [{
      ex: "Pin Press",
      sets: 4,
      reps: 3,
      mode: "rpe",
      val: 7.5,
      note: "Pins at the sticking point."
    }, {
      ex: "2-Board Press",
      sets: 4,
      reps: 3,
      mode: "rpe",
      val: 7.5
    }, {
      ex: "Close-Grip Bench",
      sets: 3,
      reps: 6,
      mode: "rpe",
      val: 7
    }]
  }, {
    k: "lockout",
    t: "The lockout",
    d: "The last few inches are the grind",
    why: "Triceps, and triceps trained heavy rather than triceps trained sore. The range you fail in is the range to overload.",
    fix: [{
      ex: "Close-Grip Bench",
      sets: 4,
      reps: 5,
      mode: "rpe",
      val: 7.5
    }, {
      ex: "3-Board Press",
      sets: 3,
      reps: 4,
      mode: "rpe",
      val: 7.5
    }, {
      ex: "JM Press",
      sets: 3,
      reps: 8,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "path",
    t: "The bar wanders",
    d: "It drifts, or my shoulders give out first",
    why: "Upper back. You press off a platform you build with your back, and when that platform moves the bar follows it. This is the one bench weak point you fix by pulling.",
    fix: [{
      ex: "Chest-Supported Row",
      sets: 4,
      reps: 10,
      mode: "rir",
      val: 2
    }, {
      ex: "Face Pull",
      sets: 3,
      reps: 15,
      mode: "rir",
      val: 2
    }, {
      ex: "Dumbbell Bench",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 2
    }]
  }],
  "Conventional Deadlift": [{
    k: "floor",
    t: "Off the floor",
    d: "If it breaks the floor it is going to lock out",
    why: "The first inch is legs and position — quads driving, lats holding the bar into you. Pulling from below the floor makes the start the hardest part of the lift instead of the easiest.",
    fix: [{
      ex: "Deficit Deadlift 2in",
      sets: 3,
      reps: 3,
      mode: "rpe",
      val: 7.5
    }, {
      ex: "Front Squat",
      sets: 3,
      reps: 5,
      mode: "rpe",
      val: 7
    }, {
      ex: "Snatch-Grip Deadlift",
      sets: 3,
      reps: 4,
      mode: "rpe",
      val: 7
    }]
  }, {
    k: "knee",
    t: "Mid-shin to the knee",
    d: "It comes off the floor and stalls at the knee",
    why: "The stretch is gone and the lockout has not arrived. Pausing in that window is the fix nothing else replaces, because nothing else makes you hold position there under load.",
    fix: [{
      ex: "Pause Below Knee",
      sets: 3,
      reps: 3,
      mode: "rpe",
      val: 7.5,
      note: "Two counts, then finish it."
    }, {
      ex: "Romanian Deadlift",
      sets: 3,
      reps: 8,
      mode: "rir",
      val: 2
    }, {
      ex: "Chest-Supported Row",
      sets: 4,
      reps: 10,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "lockout",
    t: "The lockout",
    d: "It gets past my knees and I cannot finish it",
    why: "Hips and upper back at the top. Pulling from above the sticking point lets you load the range that fails with weight you could never get off the floor.",
    fix: [{
      ex: "Rack Pull At Knee",
      sets: 3,
      reps: 3,
      mode: "rpe",
      val: 7.5
    }, {
      ex: "Hip Thrust",
      sets: 3,
      reps: 8,
      mode: "rir",
      val: 2
    }, {
      ex: "Barbell Shrug",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "round",
    t: "My back rounds over",
    d: "The bar moves and my spine moves with it",
    why: "Not a strength problem in the legs. The extensors and the upper back have to hold a position the bar is actively taking away from you, and that is trained directly.",
    fix: [{
      ex: "Snatch-Grip Deadlift",
      sets: 3,
      reps: 4,
      mode: "rpe",
      val: 7
    }, {
      ex: "45-Degree Back Extension",
      sets: 3,
      reps: 12,
      mode: "rir",
      val: 2
    }, {
      ex: "Chest-Supported Row",
      sets: 4,
      reps: 10,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "grip",
    t: "My grip goes first",
    d: "The pull is there, the bar is not",
    why: "Everything above the bar is fine; it is leaving your hands. This is the fastest weak point in powerlifting to fix, and the one most lifters never bother to train.",
    fix: [{
      ex: "Fat Grip Hold",
      sets: 3,
      reps: 30
    }, {
      ex: "Farmer's Walk",
      sets: 3,
      reps: 40
    }, {
      ex: "Dead Hang",
      sets: 3,
      reps: 45
    }]
  }],
  "Overhead Press": [{
    k: "start",
    t: "Off the shoulders",
    d: "The first few inches are the hardest",
    why: "Front delts out of a dead-stop position, with no leg drive and no stretch to borrow from.",
    fix: [{
      ex: "Pause Overhead Press",
      sets: 4,
      reps: 3,
      mode: "rpe",
      val: 7.5
    }, {
      ex: "Z Press",
      sets: 3,
      reps: 6,
      mode: "rpe",
      val: 7
    }, {
      ex: "Seated Overhead Press",
      sets: 3,
      reps: 8,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "mid",
    t: "At eye level",
    d: "Past my face, then it stops",
    why: "The worst leverage in the lift, where the bar is furthest from your midline. Pressing from pins at that height overloads it; side delts hold it there.",
    fix: [{
      ex: "Pin Press Overhead",
      sets: 4,
      reps: 3,
      mode: "rpe",
      val: 7.5
    }, {
      ex: "Dumbbell Shoulder Press",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 2
    }, {
      ex: "Lateral Raise",
      sets: 3,
      reps: 15,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "lockout",
    t: "Overhead",
    d: "I get it up and cannot finish or hold it",
    why: "Triceps to finish, upper back to keep it there. An overhead press you cannot lock is usually both at once.",
    fix: [{
      ex: "Push Press",
      sets: 3,
      reps: 3,
      mode: "rpe",
      val: 7,
      note: "Leg drive past the sticking point, strict to lock it."
    }, {
      ex: "Overhead Triceps Extension",
      sets: 3,
      reps: 12,
      mode: "rir",
      val: 2
    }, {
      ex: "Triceps Pushdown",
      sets: 3,
      reps: 15,
      mode: "rir",
      val: 2
    }]
  }, {
    k: "shoulder",
    t: "It drifts, or the shoulder complains",
    d: "More a position problem than a strength one",
    why: "Rear delts and external rotators keep the joint where the press needs it. Cheap work, and it is what keeps a presser pressing.",
    fix: [{
      ex: "Face Pull",
      sets: 3,
      reps: 15,
      mode: "rir",
      val: 2
    }, {
      ex: "Rear Delt Fly",
      sets: 3,
      reps: 15,
      mode: "rir",
      val: 2
    }, {
      ex: "Half-Kneeling Landmine Press",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 2
    }]
  }]
};
// Someone training for size has no sticking point to aim at, so the same slot in
// the flow asks what they are actually chasing and fills it the same way.
const SIZE_FOCUS = {
  upper: {
    t: "Chest, back and shoulders",
    d: "The torso",
    why: "Compound pressing and pulling at rep ranges the main lifts never visit, which is where most of the tissue gets added.",
    fix: [{
      ex: "Dumbbell Incline",
      sets: 4,
      reps: 10,
      mode: "rir",
      val: 1
    }, {
      ex: "Chest-Supported Row",
      sets: 4,
      reps: 12,
      mode: "rir",
      val: 1
    }, {
      ex: "Lat Pulldown",
      sets: 3,
      reps: 12,
      mode: "rir",
      val: 1
    }]
  },
  lower: {
    t: "Legs and glutes",
    d: "Quads, hamstrings, glutes",
    why: "Squats and pulls grow the pattern; they do not reliably grow every muscle in it. These cover what the big lifts under-train.",
    fix: [{
      ex: "Leg Press",
      sets: 4,
      reps: 12,
      mode: "rir",
      val: 1
    }, {
      ex: "Lying Leg Curl",
      sets: 4,
      reps: 12,
      mode: "rir",
      val: 1
    }, {
      ex: "Walking Lunge",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 2
    }]
  },
  arms: {
    t: "Arms and delts",
    d: "The bits that never grow from the big three",
    why: "Biceps and side delts take almost nothing from squat, bench and deadlift. If you want them, you train them directly or not at all.",
    fix: [{
      ex: "Barbell Curl",
      sets: 4,
      reps: 10,
      mode: "rir",
      val: 1
    }, {
      ex: "Rope Pushdown",
      sets: 4,
      reps: 12,
      mode: "rir",
      val: 1
    }, {
      ex: "Lateral Raise",
      sets: 4,
      reps: 15,
      mode: "rir",
      val: 1
    }]
  },
  all: {
    t: "All of it",
    d: "Everywhere, evenly",
    why: "One push, one pull, one leg movement, every session you have room for — the shortest honest answer to wanting size everywhere.",
    fix: [{
      ex: "Dumbbell Incline",
      sets: 3,
      reps: 10,
      mode: "rir",
      val: 1
    }, {
      ex: "Seated Cable Row",
      sets: 3,
      reps: 12,
      mode: "rir",
      val: 1
    }, {
      ex: "Leg Press",
      sets: 3,
      reps: 12,
      mode: "rir",
      val: 1
    }]
  }
};
// Things that are already complaining, and what to keep off them. Matched on the
// movement's name, which is blunt but auditable: you can read the list and know
// exactly what it will and will not take out.
const LIMITS = [{
  k: "lowback",
  t: "Low back",
  d: "It is the thing that always goes"
}, {
  k: "knee",
  t: "Knees"
}, {
  k: "shoulder",
  t: "Shoulders"
}, {
  k: "elbow",
  t: "Elbows or wrists"
}, {
  k: "hip",
  t: "Hips or groin"
}];
const LIMIT_AVOID = {
  lowback: /good morning|deficit|snatch-grip|stiff-leg|zercher|jefferson|ghd sit-up/i,
  knee: /sissy|hack squat|pistol|jump|step-?up|lunge|split squat/i,
  shoulder: /behind-neck|guillotine|wide-grip bench|dip|upright row|handstand|overhead squat/i,
  elbow: /skullcrusher|jm press|french press|tate press|close-grip/i,
  hip: /wide-stance|sumo|adduction|copenhagen|cossack|lunge|split squat/i
};
// Where the lifter runs out, when they run out. Each answer changes the
// prescription in a different direction rather than just scaling it down.
const WALLS = [{
  v: "joints",
  t: "My joints",
  d: "Elbows, knees, shoulders — the bar is what hurts"
}, {
  v: "systemic",
  t: "Recovery",
  d: "Flat for days afterwards, nothing hurts in particular"
}, {
  v: "time",
  t: "Time",
  d: "I run out of session before I run out of energy"
}];

/* Turning answers into movements. Everything here narrows a list that is already
   correct rather than inventing one: the sticking point picks the three, the
   equipment and the sore joints take some back out, and what survives gets sized
   to how much work the lifter said they can actually take. */
function prescribe(ans) {
  if (!ans) return null;
  const src = ans.goal === "size" ? SIZE_FOCUS[ans.focus] || null : (WEAK_POINTS[ans.weak] || []).find(p => p.k === ans.wp) || null;
  if (!src) return null;
  const gear = COACH_GEAR[ans.gear || "full"];
  const limits = ans.limits || [];
  const fits = m => !gear.has || gear.has.indexOf(equipOf(m.ex) || "bb") >= 0;
  const sore = m => limits.some(k => LIMIT_AVOID[k] && LIMIT_AVOID[k].test(m.ex));
  let moves = src.fix.filter(fits);
  const safe = moves.filter(m => !sore(m));
  /* Taking out everything that brushes a sore joint can empty the prescription
     entirely — a bench lockout with bad elbows has almost nothing left. Two
     movements and an honest warning beats none and a shrug. */
  const forced = safe.length < 2 && moves.length > safe.length;
  if (!forced) moves = safe;
  // "My joints go first" does not mean do less. It means train the same muscle
  // with something that is not a barbell, so the machine work goes to the front.
  if (ans.wall === "joints") {
    const soft = {
      mc: 0,
      cb: 0,
      db: 1,
      kb: 1,
      bw: 2,
      sm: 2,
      bd: 3,
      sp: 3,
      sl: 3,
      bb: 4
    };
    const rank = m => {
      const e = equipOf(m.ex);
      return soft[e] == null ? 4 : soft[e];
    };
    moves = moves.slice().sort((a, b) => rank(a) - rank(b));
  }
  if (ans.wall === "time") moves = moves.slice(0, 2);
  const shrink = (ans.wall === "systemic" ? 1 : 0) + (ans.bw === "cut" ? 1 : 0);
  moves = moves.slice(0, 3).map(m => ({
    ...m,
    sets: Math.max(2, m.sets - shrink)
  }));
  if (!moves.length) return null;
  return {
    t: src.t,
    why: src.why,
    moves,
    forced,
    shrink,
    lift: ans.goal === "size" ? null : ans.weak
  };
}
const rxSlot = m => {
  const timed = TIME_MOVES.has(m.ex);
  const mode = m.mode || "rir";
  return {
    id: uid(),
    ex: m.ex,
    metric: timed ? "time" : "reps",
    role: "accessory",
    sets: Math.max(1, m.sets),
    reps: Math.max(1, m.reps),
    mode,
    val: clampVal(mode, m.val),
    // Marked as the coach's, so a plan can always say which movements it put
    // there and which ones you did.
    bo: null,
    note: m.note || "",
    rx: true
  };
};
/* Which days the prescription would land on. Once a week — enough to move a weak
   point, not enough to become the block — and only a day that already trains the
   pattern, so the work that supports the lift sits behind the lift itself.

   Never a day that has already been and gone: prescribing into last Tuesday is
   rewriting a session you trained, which matters the moment this is pointed at a
   block already underway rather than one being generated from scratch. */
function rxTargetDays(days, rx) {
  if (!rx || !rx.moves || !rx.moves.length) return [];
  const cat = rx.lift ? (libFind(rx.lift) || {}).c || null : null;
  const today = todayStr();
  const keys = Object.keys(days).filter(k => k >= today).sort();
  const out = [],
    seen = new Set();
  for (const k of keys) {
    const slots = days[k] || [];
    if (!slots.length) continue;
    if (cat && !slots.some(sl => (libFind(sl.ex) || {}).c === cat)) continue;
    const wk = Math.floor(Math.max(0, daysBetween(keys[0], k)) / 7);
    if (seen.has(wk)) continue;
    seen.add(wk);
    if (!rxNewFor(slots, rx).length) continue; // it already runs all of this
    out.push(k);
  }
  return out;
}
// What of the prescription this day does not already have. A block that already
// front-squats on squat day does not want a second Front Squat line under it.
function rxNewFor(slots, rx) {
  const have = new Set((slots || []).map(sl => sl.ex));
  return rx.moves.filter(m => !have.has(m.ex));
}
function applyPrescription(days, rx) {
  const hit = rxTargetDays(days, rx);
  if (!hit.length) return days;
  const out = {
    ...days
  };
  for (const k of hit) out[k] = [...(days[k] || []), ...rxNewFor(days[k], rx).map(rxSlot)];
  return out;
}
// How a prescribed movement reads on a card: 3×8 @ 2 RIR, or 3×0:40 for the
// things measured on a clock.
const rxLine = m => TIME_MOVES.has(m.ex) ? `${m.sets}×${fmtDur(m.reps)}` : `${m.sets}×${m.reps} @ ${m.mode === "pct" ? fmt(m.val) + "%" : m.mode === "rir" ? fmt(m.val) + " RIR" : "RPE " + fmt(m.val)}`;
const COACH_GEAR = {
  full: {
    t: "A full gym",
    d: "Racks, machines, cables, dumbbells",
    has: null
  },
  barbell: {
    t: "Barbell and rack",
    d: "A garage setup, maybe a bench",
    has: ["bb", "sp", "bw", "db", "kb", "bd"]
  },
  dumbbell: {
    t: "Dumbbells only",
    d: "No barbell",
    has: ["db", "kb", "bw", "bd"]
  },
  none: {
    t: "Nothing",
    d: "Bodyweight, wherever I am",
    has: ["bw"]
  }
};
// What a template actually needs, read off the movements it emits rather than a
// tag someone has to remember to set.
function templateGear(t) {
  const need = new Set();
  for (const d of t.days) {
    let days;
    try {
      days = t.build(d, 2, 0, t.weeks[1]);
    } catch (e) {
      continue;
    }
    for (const day of (days || []).slice(0, d)) for (const sl of day || []) need.add(equipOf(sl.ex) || "bb");
  }
  return need;
}
// Which lift is furthest behind, from the lifter's own numbers. Typical ratios to
// the squat, from the usual population tables — a lift well under its share is the
// one with room in it.
const RATIO_OF_SQUAT = {
  "Competition Bench": 0.72,
  "Conventional Deadlift": 1.2,
  "Overhead Press": 0.45
};
function weakestLift(models) {
  const sq = models["Low-Bar Squat"] || models["Squat"] || models["High-Bar Squat"];
  if (!sq || sq.e1rm == null) return null;
  let worst = null;
  for (const [name, share] of Object.entries(RATIO_OF_SQUAT)) {
    const m = models[name];
    if (!m || m.e1rm == null) continue;
    const got = m.e1rm / sq.e1rm,
      gap = got / share;
    if (!worst || gap < worst.gap) worst = {
      name,
      gap,
      got,
      share
    };
  }
  return worst && worst.gap < 0.95 ? worst : null;
}
function recommendBlocks(ans, state, models) {
  const gear = COACH_GEAR[ans.gear || "full"];
  const meetDate = state.meet && state.meet.date || null;
  const out = [],
    nearly = [];
  for (const t of PROGRAMS) {
    if (ans.days && t.days.indexOf(ans.days) < 0) continue;
    if (ans.level && (ans.level < t.level[0] || ans.level > t.level[1])) continue;
    let missing = [];
    if (gear.has) {
      const need = templateGear(t);
      missing = [...need].filter(k => gear.has.indexOf(k) < 0);
    }
    let score = 0;
    const why = [];
    if (ans.goal && t.goal === ans.goal) {
      score += 45;
      why.push(GOALS.find(g => g.v === ans.goal).t.toLowerCase() + " is what it is built for");
    } else if (ans.goal === "peak" && t.goal !== "peak") score -= 25;else if (ans.goal) score += 8;
    if (ans.days) {
      score += 20;
      why.push(`it runs on ${ans.days} days`);
    }
    if (ans.level) score += 12;
    // Volume tolerance moves the needle toward templates that ask for more or less.
    if (ans.vol) {
      let sets = 0,
        n = 0;
      try {
        for (const day of t.build(ans.days || t.days[0], ans.level || 2, 0, t.weeks[1]) || []) {
          for (const sl of day || []) {
            sets += (sl.sets || 1) + (sl.bo ? sl.bo.sets : 0);
            n++;
          }
        }
      } catch (e) {}
      const perDay = n ? sets / Math.max(1, t.days[0]) : 0;
      if (ans.vol === "low" && perDay <= 14) {
        score += 18;
        why.push("the set count stays low, which is what you asked for");
      }
      if (ans.vol === "high" && perDay >= 18) {
        score += 18;
        why.push("it carries real volume");
      }
      if (ans.vol === "low" && perDay >= 22) score -= 20;
      // A cut is not a volume preference, but it has the same consequence: there
      // is less recovery to spend, so a template that spends less of it wins.
      if (ans.bw === "cut" && perDay <= 14) {
        score += 10;
        why.push("it is not much work to recover from, which matters on a cut");
      }
      if (ans.bw === "cut" && perDay >= 22) score -= 12;
      if (ans.wall === "time" && perDay <= 14) score += 8;
    }
    if (ans.weak && ans.weak !== "none") {
      const spec = /spec|press-spec|single-peak|hifreq/.test(t.id);
      if (spec) {
        score += 14;
        why.push(`it gives one lift the frequency, and yours is ${shortLift(ans.weak)}`);
      }
    }
    if (ans.goal === "peak" && t.meet && meetDate) {
      score += 12;
      why.push("it counts back from your meet date");
    }
    if (gear.has && !missing.length) why.push(`nothing in it needs more than ${gear.t.toLowerCase()}`);
    if (missing.length) nearly.push({
      t,
      score: score - 40,
      why,
      missing
    });else out.push({
      t,
      score,
      why
    });
  }
  out.sort((a, b) => b.score - a.score);
  /* A hard equipment filter is right — a block you cannot perform is no use. But
     narrow answers can leave one survivor, and one option is not a choice. So the
     near-misses come back too, labelled with exactly what they would need, rather
     than being silently dropped. */
  if (out.length < 2) {
    nearly.sort((a, b) => b.score - a.score);
    return out.concat(nearly.slice(0, 3 - out.length)).slice(0, 4);
  }
  return out.slice(0, 4);
}

// One question a screen, every one skippable. A skipped question takes a sane
// default and the explanation says so, rather than silently guessing.
/* The same questionnaire answers two different needs. Asked in full it picks a
   programme and writes the lifter's weak point into it. Asked short — rxOnly —
   it leaves the block alone and only prescribes, which is what you want when
   there is nothing wrong with the plan except that it never addressed the one
   thing that is actually holding a lift back. */
function CoachSheet({
  open,
  onClose,
  state,
  models,
  onGenerate,
  unit,
  rxOnly,
  onPrescribe
}) {
  const [ans, setAns] = useState({});
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (open) {
      setAns(rxOnly ? {
        goal: "strength"
      } : {});
      setStep(0);
    }
  }, [open, rxOnly]);
  const weak = useMemo(() => open ? weakestLift(models) : null, [open, models]);
  // Which sticking points there are to choose between depends entirely on which
  // lift they named, so this list is rebuilt from the answers on every render.
  const wpList = ans.weak && WEAK_POINTS[ans.weak] || [];
  const QS = [{
    id: "goal",
    q: "What are you training for?",
    opts: [{
      v: "strength",
      t: "Get stronger",
      d: "The three lifts, no date in mind"
    }, {
      v: "peak",
      t: "Peak for a meet",
      d: "There is a platform on the calendar"
    }, {
      v: "size",
      t: "Add size",
      d: "More muscle, strength along for the ride"
    }, {
      v: "maintain",
      t: "Hold what I have",
      d: "In season, busy, or coming back"
    }]
  },
  /* A peaking block is the only one whose length is not a preference — it is
     however long there is. Asking turns "6 weeks by default" into the right
     number of weeks, and it is a question nobody else in the flow needs. */
  {
    id: "meetin",
    q: "How far out is it?",
    skip: a => a.goal !== "peak",
    opts: [{
      v: 4,
      t: "Four weeks",
      d: "A sharpening block and nothing more"
    }, {
      v: 8,
      t: "Eight weeks",
      d: "Long enough to build and still peak"
    }, {
      v: 12,
      t: "Twelve weeks",
      d: "A full prep"
    }, {
      v: 16,
      t: "Sixteen or more",
      d: "Build first, peak at the end of it"
    }]
  }, {
    id: "days",
    q: "How many days a week?",
    opts: [2, 3, 4, 5, 6].map(n => ({
      v: n,
      t: `${n} days`,
      d: n === 2 ? "Full body, both days" : n >= 5 ? "Short sessions, high frequency" : ""
    }))
  }, {
    id: "level",
    q: "How long have you trained seriously?",
    opts: LEVELS.map(l => ({
      v: l.v,
      t: l.t,
      d: l.d
    }))
  }, {
    id: "gear",
    q: "What do you have to train with?",
    opts: Object.entries(COACH_GEAR).map(([v, g]) => ({
      v,
      t: g.t,
      d: g.d
    }))
  }, {
    id: "weak",
    q: "Which lift is furthest behind?",
    skip: a => a.goal === "size" || a.goal === "maintain",
    opts: [{
      v: "Low-Bar Squat",
      t: "Squat"
    }, {
      v: "Competition Bench",
      t: "Bench"
    }, {
      v: "Conventional Deadlift",
      t: "Deadlift"
    }, {
      v: "Overhead Press",
      t: "Overhead press"
    }, {
      v: "none",
      t: "They are all even",
      d: "Or I would rather not say"
    }]
  },
  /* The branch the whole thing is for. A lift being behind says almost nothing
     about what to do; where the bar stops says nearly everything, and the two
     answers lead to completely different accessory work. A beginner is skipped
     past it — at that stage the sticking point is the lift itself. */
  {
    id: "wp",
    q: `Where does your ${shortLift(ans.weak || "lift")} actually break down?`,
    sub: "The place the bar stops is what decides which accessories are worth doing. Nothing else about a weak lift does.",
    skip: a => !wpList.length || a.level === 1,
    opts: wpList.map(p => ({
      v: p.k,
      t: p.t,
      d: p.d
    }))
  },
  // Same slot in the flow, different question, for someone who is not chasing a
  // number on the platform at all.
  {
    id: "focus",
    q: "What are you chasing size on?",
    skip: a => a.goal !== "size",
    opts: Object.keys(SIZE_FOCUS).map(v => ({
      v,
      t: SIZE_FOCUS[v].t,
      d: SIZE_FOCUS[v].d
    }))
  }, {
    id: "limits",
    q: "Anything you are working around?",
    multi: true,
    sub: "Tap everything that applies. I keep the accessory work off it; say nothing and I will assume nothing.",
    opts: LIMITS.map(l => ({
      v: l.k,
      t: l.t,
      d: l.d
    }))
  }, {
    id: "vol",
    q: "How do you handle volume?",
    skip: a => a.level === 1,
    opts: [{
      v: "high",
      t: "I thrive on it",
      d: "More sets, more often, no problem"
    }, {
      v: "mid",
      t: "Somewhere in the middle"
    }, {
      v: "low",
      t: "It beats me up",
      d: "I do better on less work, harder"
    }]
  },
  /* "It beats me up" is three different complaints wearing one coat, and they
     want three different answers: softer implements, fewer sets, or fewer
     movements. Worth the one extra tap to know which. */
  {
    id: "wall",
    q: "When the work piles up, what goes first?",
    skip: a => a.vol !== "low",
    opts: WALLS
  }, {
    id: "bw",
    q: "Which way is your bodyweight going?",
    sub: "Recovery on the way down is not recovery on the way up, and the accessory volume should know that.",
    opts: [{
      v: "gain",
      t: "Up",
      d: "Eating to grow"
    }, {
      v: "hold",
      t: "Holding steady"
    }, {
      v: "cut",
      t: "Down",
      d: "Cutting, or making weight"
    }]
  }];
  // Four of the questions are the ones the prescription actually reads. The rest
  // only exist to choose a template, so the short flow drops them.
  const RX_ONLY = ["gear", "weak", "wp", "limits"];
  const live = QS.filter(x => !(x.skip && x.skip(ans)) && (!rxOnly || RX_ONLY.indexOf(x.id) >= 0));
  const cur = live[step];
  const done = step >= live.length;
  // Scoring forty-five templates means building a week of each to count its sets.
  // The short flow never shows a template, so it never pays for one.
  const picks = useMemo(() => done && !rxOnly ? recommendBlocks(ans, state, models) : [], [done, rxOnly, ans, state, models]);
  const rx = useMemo(() => done ? prescribe(ans) : null, [done, ans]);
  const multi = !!(cur && cur.multi);
  const chosen = multi ? ans[cur.id] || [] : null;
  const toggle = v => setAns(a => {
    const had = a[cur.id] || [];
    return {
      ...a,
      [cur.id]: had.indexOf(v) >= 0 ? had.filter(x => x !== v) : had.concat([v])
    };
  });

  // The prescription, as a card. Both ways out of the questionnaire show it.
  const rxCard = rx ? /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${tint(C.violet, 0.42)}`,
      background: tint(C.violet, 0.07),
      borderRadius: R.surface,
      padding: 15,
      marginBottom: 10,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      color: C.violet,
      marginBottom: 7
    }
  }, rx.lift ? `Weak point · ${shortLift(rx.lift)}` : "Size focus"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15.5,
      letterSpacing: "-0.02em"
    }
  }, rx.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 6,
      lineHeight: 1.55
    }
  }, rx.why), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13
    }
  }, rx.moves.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.ex,
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      alignItems: "baseline",
      padding: "8px 0",
      borderTop: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 12.5,
      fontWeight: 700
    }
  }, m.ex), m.note && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 11,
      color: C.faint,
      marginTop: 2
    }
  }, m.note)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 11.5,
      color: C.muted,
      flexShrink: 0
    }
  }, rxLine(m))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 11,
      lineHeight: 1.5
    }
  }, "These go into one session a week", rx.lift ? `, on a day that already trains your ${shortLift(rx.lift)}` : "", ".", rx.shrink > 0 ? " Sets are pulled back a notch for what you told me about recovery." : "", " ", "Every one of them is an ordinary movement in your plan \u2014 change it, move it or bin it in Plan."), rx.forced && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.gold,
      marginTop: 9,
      fontWeight: 600,
      lineHeight: 1.45
    }
  }, "Fair warning: almost nothing that fixes this sticking point leaves that joint alone. Start light, and swap anything that bites.")) : null;
  if (!open) return null;
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: rxOnly ? done ? "What I would add" : "Fix a weak point" : done ? "What I would run" : "Build me a block"
  }, !done && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 16
    }
  }, live.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: 3,
      borderRadius: 2,
      background: i <= step ? C.red : C.line2
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 18,
      letterSpacing: "-0.02em",
      marginBottom: 4
    }
  }, cur.q), cur.sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginBottom: 2,
      marginTop: 5,
      lineHeight: 1.5
    }
  }, cur.sub), cur.id === "weak" && weak && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginBottom: 12,
      lineHeight: 1.45
    }
  }, "Your numbers say ", shortLift(weak.name), " \u2014 it is ", Math.round(weak.got * 100), "% of your squat where ", Math.round(weak.share * 100), "% is typical."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10
    }
  }), cur.opts.map(o => {
    const suggested = cur.id === "weak" && weak && o.v === weak.name;
    const on = multi ? chosen.indexOf(o.v) >= 0 : false;
    const lit = on || suggested;
    return /*#__PURE__*/React.createElement("button", {
      key: o.v,
      onClick: () => {
        if (multi) {
          toggle(o.v);
          return;
        }
        setAns(a => ({
          ...a,
          [cur.id]: o.v
        }));
        setStep(s => s + 1);
      },
      style: {
        width: "100%",
        textAlign: "left",
        background: lit ? tint(C.red, 0.1) : G.card,
        border: `1px solid ${lit ? tint(C.red, 0.45) : C.line2}`,
        borderRadius: R.surface,
        padding: "13px 15px",
        cursor: "pointer",
        color: C.text,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 11,
        WebkitTapHighlightColor: "transparent"
      }
    }, multi && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 19,
        height: 19,
        borderRadius: 6,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        border: `1px solid ${on ? "transparent" : C.line2}`,
        background: on ? C.red : "rgba(255,255,255,0.03)"
      }
    }, on && /*#__PURE__*/React.createElement(Check, {
      size: 13,
      style: {
        color: "#fff"
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontWeight: 800,
        fontSize: 14
      }
    }, o.t, suggested ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.red,
        fontSize: 11,
        marginLeft: 8
      }
    }, "your numbers") : null), o.d && /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontSize: 12,
        color: C.muted,
        marginTop: 3,
        lineHeight: 1.45
      }
    }, o.d)));
  }), multi && /*#__PURE__*/React.createElement(Btn, {
    kind: chosen.length ? "primary" : "solid",
    style: {
      width: "100%",
      marginTop: 4,
      minHeight: 44
    },
    onClick: () => setStep(st => st + 1)
  }, chosen.length ? `Continue with ${chosen.length}` : "Nothing to work around"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 6
    }
  }, step > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(s => s - 1),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, "Back"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(s => s + 1),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0,
      marginLeft: "auto"
    }
  }, "Skip this"))), done && rxOnly && /*#__PURE__*/React.createElement(React.Fragment, null, rxCard, !rx && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6
    }
  }, "Nothing to prescribe from that \u2014 either no lift was named, or the equipment you have cannot do any of the work that fixes it. Go back and loosen one."), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    disabled: !rx,
    style: {
      width: "100%",
      minHeight: 46,
      marginTop: 4
    },
    onClick: () => {
      onPrescribe && onPrescribe(rx);
      onClose();
    }
  }, "Add this to my block"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(0),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: "10px 0",
      width: "100%"
    }
  }, "Change my answers")), done && !rxOnly && /*#__PURE__*/React.createElement(React.Fragment, null, !picks.length && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6
    }
  }, "Nothing in the library matches all of that \u2014 most often it is the days and the equipment together. Go back and loosen one."), picks.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.t.id,
    style: {
      border: `1px solid ${i ? C.line : tint(C.red, 0.45)}`,
      background: i ? "none" : tint(C.red, 0.07),
      borderRadius: R.surface,
      padding: 15,
      marginBottom: 10
    }
  }, i === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      color: C.red,
      marginBottom: 7
    }
  }, "My pick"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: "-0.02em"
    }
  }, r.t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 5,
      lineHeight: 1.5
    }
  }, r.t.blurb), i === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.text,
      marginTop: 11,
      lineHeight: 1.55
    }
  }, /*#__PURE__*/React.createElement("b", null, "Because"), " ", r.why.slice(0, 3).join(", "), ".", rx && rx.lift ? ` Your ${shortLift(rx.lift)} gets the work for ${rx.t.toLowerCase()} written into it, below.` : ans.weak && ans.weak !== "none" && !/spec/.test(r.t.id) ? ` Your ${shortLift(ans.weak)} gets the accessory work inside it rather than its own block.` : ""), r.missing && r.missing.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.gold,
      marginTop: 9,
      fontWeight: 600,
      lineHeight: 1.45
    }
  }, "Needs ", r.missing.map(k => (LIB_EQUIP.find(e => e.k === k) || {
    t: k
  }).t.toLowerCase()).join(" and "), " ", "for some of it \u2014 swap those movements or pick another."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 9,
      lineHeight: 1.45
    }
  }, r.t.how), /*#__PURE__*/React.createElement(Btn, {
    kind: i ? "ghost" : "primary",
    style: {
      width: "100%",
      marginTop: 12,
      minHeight: 44,
      fontSize: 13.5
    },
    onClick: () => {
      const d = r.t.days.indexOf(ans.days || 0) >= 0 ? ans.days : r.t.days[0];
      const wks = Math.min(r.t.weeks[1], Math.max(r.t.weeks[0], ans.meetin || 6));
      onGenerate(r.t, {
        days: d,
        weeks: wks,
        level: ans.level || 2,
        startDate: todayStr()
      }, rx);
      onClose();
    }
  }, "Start ", r.t.name))), rxCard, /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(0),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: "6px 0",
      width: "100%"
    }
  }, "Change my answers")));
}
function ProgramPicker({
  open,
  onClose,
  state,
  days,
  onGenerate
}) {
  const [lvl, setLvl] = useState(null);
  const [dayF, setDayF] = useState(null);
  const [pick, setPick] = useState(null);
  const [opts, setOpts] = useState(null);
  useEffect(() => {
    if (!open) {
      setPick(null);
      setOpts(null);
    }
  }, [open]);
  const meetDate = state.meet && state.meet.date || null;
  const matches = PROGRAMS.filter(t => (lvl == null || lvl >= t.level[0] && lvl <= t.level[1]) && (dayF == null || t.days.indexOf(dayF) >= 0));
  const choose = t => {
    const d = dayF && t.days.indexOf(dayF) >= 0 ? dayF : t.days[0];
    const wks = Math.min(t.weeks[1], Math.max(t.weeks[0], t.meet ? 8 : 6));
    setPick(t);
    setOpts({
      days: d,
      weeks: wks,
      level: lvl || 2,
      startDate: startFor(t, wks)
    });
  };
  // A peaking block is the one case where the end date is the fixed point, so it
  // counts back from the platform rather than forward from today.
  function startFor(t, wks) {
    if (t.meet && meetDate) return addDays(meetDate, -(wks * 7 - 1));
    return todayStr();
  }
  const setOpt = patch => setOpts(o => {
    const next = {
      ...o,
      ...patch
    };
    if (pick && pick.meet && meetDate && patch.weeks != null) next.startDate = addDays(meetDate, -(patch.weeks * 7 - 1));
    return next;
  });
  const preview = pick && opts ? generateProgram(pick, opts) : null;
  const previewKeys = preview ? Object.keys(preview).sort() : [];
  const clash = previewKeys.filter(k => (days || {})[k] && days[k].length).length;
  const lvlName = t => t.level[0] === t.level[1] ? LEVELS[t.level[0] - 1].t : `${LEVELS[t.level[0] - 1].t}–${LEVELS[t.level[1] - 1].t}`;
  const chip = (on, label, onClick) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: onClick,
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 11.5,
      borderRadius: R.pill,
      padding: "6px 11px",
      minHeight: 28,
      cursor: "pointer",
      whiteSpace: "nowrap",
      WebkitTapHighlightColor: "transparent",
      background: on ? G.red : "rgba(255,255,255,0.03)",
      color: on ? "#fff" : C.muted,
      border: `1px solid ${on ? "transparent" : C.line}`
    }
  }, label);
  if (!open) return null;
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: pick ? pick.name : "Choose a programme"
  }, !pick ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.faint,
      lineHeight: 1.55,
      marginBottom: 13
    }
  }, "These are training structures, not weights. Every load still comes from your own estimate \u2014 and once a block lands you can move, swap or clear any day of it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      overflowX: "auto",
      margin: "0 -4px 7px",
      padding: "0 4px 5px"
    }
  }, chip(lvl == null, "Any level", () => setLvl(null)), LEVELS.map(L => chip(lvl === L.v, L.t, () => setLvl(L.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      overflowX: "auto",
      margin: "0 -4px 12px",
      padding: "0 4px 5px"
    }
  }, chip(dayF == null, "Any week", () => setDayF(null)), [2, 3, 4, 5, 6].map(n => chip(dayF === n, `${n} days`, () => setDayF(n)))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: "56vh",
      overflowY: "auto",
      overscrollBehavior: "contain",
      WebkitOverflowScrolling: "touch",
      margin: "0 -4px",
      padding: "0 4px"
    }
  }, matches.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => choose(t),
    style: {
      width: "100%",
      textAlign: "left",
      background: G.card,
      border: `1px solid ${C.line2}`,
      borderRadius: R.surface,
      padding: "13px 15px",
      marginBottom: 8,
      cursor: "pointer",
      color: C.text,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 14.5
    }
  }, t.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: C.faint
    }
  }, t.days.join("/"), " days \xB7 ", t.weeks[0], "\u2013", t.weeks[1], " wks")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 5,
      lineHeight: 1.5
    }
  }, t.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginTop: 7
    }
  }, lvlName(t)))), !matches.length && /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.faint,
      fontSize: 13,
      textAlign: "center",
      padding: "26px 0",
      lineHeight: 1.6
    }
  }, "Nothing at that level runs ", dayF, " days a week. Try a different frequency."))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      fontStyle: "italic",
      lineHeight: 1.5
    }
  }, "Based on ", pick.origin, "."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6,
      margin: "10px 0 0"
    }
  }, pick.how), pick.meet && !meetDate && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.gold,
      lineHeight: 1.55,
      marginTop: 12,
      fontWeight: 600
    }
  }, "Set a meet date in Settings and this will count back to it. For now it starts today."), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      margin: "18px 0 7px"
    }
  }, "Days a week"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, pick.days.map(n => chip(opts.days === n, `${n}`, () => setOpt({
    days: n
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9
    }
  }, "Weeks"), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: opts.weeks,
    min: pick.weeks[0],
    max: pick.weeks[1],
    onChange: v => setOpt({
      weeks: v
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      margin: "18px 0 7px"
    }
  }, pick.meet && meetDate ? "Starts (counting back to your meet)" : "Starts"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: opts.startDate,
    onChange: e => setOpt({
      startDate: e.target.value || todayStr()
    }),
    style: {
      width: "100%",
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line}`,
      borderRadius: R.input,
      padding: "0 13px",
      height: 44,
      color: C.text,
      fontFamily: MONO,
      fontSize: 14.5,
      fontWeight: 700,
      outline: "none",
      colorScheme: "dark"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      margin: "20px 0 8px"
    }
  }, "Week one"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${C.line}`,
      borderRadius: R.ctrl,
      overflow: "hidden"
    }
  }, previewKeys.slice(0, opts.days).map((k, i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: "10px 13px",
      borderTop: i ? `1px solid ${C.line}` : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginBottom: 6
    }
  }, dayStart(k).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  })), preview[k].map(sl => /*#__PURE__*/React.createElement("div", {
    key: sl.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "2px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 4,
      height: 4,
      borderRadius: 99,
      flexShrink: 0,
      background: hueFor(sl.ex, state)
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, sl.ex), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10.5,
      color: C.muted,
      whiteSpace: "nowrap"
    }
  }, slotSummary(sl), sl.bo ? ` +${sl.bo.sets}×${sl.bo.reps}` : "")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 11,
      lineHeight: 1.5
    }
  }, previewKeys.length, " sessions, ", dayStart(previewKeys[0]).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  }), " – ", dayStart(previewKeys[previewKeys.length - 1]).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  }), ".", clash > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.gold,
      fontWeight: 700
    }
  }, " ", clash, " of them land on days you have already planned.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      flex: "0 0 auto",
      minHeight: 46
    },
    onClick: () => setPick(null)
  }, "Back"), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    style: {
      flex: 1,
      minHeight: 46
    },
    onClick: () => {
      onGenerate(pick, opts, preview, clash > 0);
      onClose();
    }
  }, clash > 0 ? "Add, replacing those days" : "Add to my calendar"))));
}
function ProgramTab({
  state,
  setState,
  setTab,
  setSel,
  models,
  focusDay,
  onFocusDone,
  openDoor,
  onDoorDone
}) {
  const program = state.program || null;
  const [sel, setSelDate] = useState(todayStr());
  const [cur, setCur] = useState(() => {
    const d = new Date();
    return {
      y: d.getFullYear(),
      m: d.getMonth()
    };
  });
  const [picking, setPicking] = useState(null);
  const [cloning, setCloning] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [libOpen, setLibOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [rxOpen, setRxOpen] = useState(false);
  const [rxNote, setRxNote] = useState(null);
  const [picking2, setPicking2] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  // An armed move/copy/swap waiting for you to tap its destination on the calendar.
  const [pending, setPending] = useState(null);
  const [conflict, setConflict] = useState(null);
  // The days map as it was before the last operation. Undo is one assignment back,
  // which is the whole reason these operations return a new map instead of mutating.
  const [undo, setUndo] = useState(null);
  const setProgram = fn => setState(s => ({
    ...s,
    program: typeof fn === "function" ? fn(s.program) : fn
  }));
  /* The same carry-forward Train has. Editing a block in Plan is if anything MORE
     likely to be a block-level decision than editing it in the gym, so having the
     offer in only one of the two places was the wrong half. */
  const PLAN_WAVE = ["reps", "sets", "val", "mode"];
  const [spreadPlan, setSpreadPlan] = useState(null);
  const spreadAhead = (fromDate, fromEx, patch, withNumbers) => setProgram(pr => {
    if (!pr || !pr.days) return pr;
    const keep = {};
    for (const k of Object.keys(patch)) if (withNumbers || PLAN_WAVE.indexOf(k) < 0) keep[k] = patch[k];
    if (!Object.keys(keep).length) return pr;
    const days = {
      ...pr.days
    };
    for (const d of Object.keys(days)) {
      if (d <= fromDate) continue;
      if (!days[d].some(x => x.ex === fromEx)) continue;
      days[d] = days[d].map(x => x.ex === fromEx ? {
        ...x,
        ...keep
      } : x);
    }
    return {
      ...pr,
      days
    };
  });
  // The library is state like anything else, so it rides along with export,
  // import and the offline store without a line of extra plumbing.
  const library = state.library || [];
  const setLibrary = fn => setState(s => ({
    ...s,
    library: fn(s.library || [])
  }));
  // Every whole-day change goes through here, so every one of them is undoable and
  // says what it did. Nothing about moving a session should feel risky.
  const applyDays = (next, said) => {
    setUndo({
      days: program && program.days || {},
      said
    });
    setProgram(pr => ({
      ...pr,
      days: next
    }));
  };
  const doUndo = () => {
    if (undo) {
      setProgram(pr => ({
        ...pr,
        days: undo.days
      }));
      setUndo(null);
    }
  };
  // Arriving straight from onboarding, open the thing they chose.
  useEffect(() => {
    if (!openDoor) return;
    if (!state.program) setProgram(newProgram());
    if (openDoor === "coach") setCoachOpen(true);
    if (openDoor === "picker") setPicking2(true);
    onDoorDone && onDoorDone();
  }, [openDoor]);

  // Arriving from Train's "Can't train this?" lands on that date with the tools open.
  useEffect(() => {
    if (!focusDay) return;
    setSelDate(focusDay);
    const d = dayStart(focusDay);
    setCur({
      y: d.getFullYear(),
      m: d.getMonth()
    });
    setDayOpen(true);
    onFocusDone && onFocusDone();
  }, [focusDay]);
  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 7000);
    return () => clearTimeout(t);
  }, [undo]);
  useEffect(() => {
    if (!rxNote) return;
    const t = setTimeout(() => setRxNote(null), 9000);
    return () => clearTimeout(t);
  }, [rxNote]);
  const loggedDays = useMemo(() => {
    const m = {};
    for (const ex of Object.values(state.exercises || {})) for (const st of ex.sets) {
      const k = dateStrFromTs(st.ts);
      m[k] = (m[k] || 0) + 1;
    }
    return m;
  }, [state.exercises]);
  if (!program) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Card, {
      style: {
        textAlign: "center",
        padding: "30px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: "0.04em"
      }
    }, "BUILD A PROGRAM"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: C.muted,
        marginTop: 10,
        lineHeight: 1.6
      }
    }, "Lay your sessions out on the calendar \u2014 main work, variations, accessories \u2014 and Train opens each day already loaded. Every load still comes from your own estimator; the program only decides what you\u2019re doing, never how heavy."), /*#__PURE__*/React.createElement(Btn, {
      kind: "primary",
      style: {
        width: "100%",
        marginTop: 20
      },
      onClick: () => {
        setProgram(newProgram());
        setCoachOpen(true);
      }
    }, "Build me a block"), /*#__PURE__*/React.createElement(Btn, {
      kind: "ghost",
      style: {
        width: "100%",
        marginTop: 9
      },
      onClick: () => {
        setProgram(newProgram());
        setPicking2(true);
      }
    }, "Choose from ", PROGRAMS.length, " programmes"), /*#__PURE__*/React.createElement(Btn, {
      kind: "ghost",
      style: {
        width: "100%",
        marginTop: 9
      },
      onClick: () => setProgram(newProgram())
    }, "Build my own")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: C.faint,
        textAlign: "center",
        lineHeight: 1.6
      }
    }, "Nothing here is required. Skip it and the app works exactly as it does now."));
  }
  const days = program.days || {};
  const slots = days[sel] || [];
  const did = loggedOn(state, sel);
  const selDate = dayStart(sel);
  const weekNo = weekNoFor(program, sel);
  const thisWeek = weekDates(sel);
  const weekCount = thisWeek.reduce((a, d) => a + (days[d] || []).length, 0);
  const isPast = sel < todayStr();
  const writeDay = (dateStr, next) => setProgram(pr => {
    const nd = {
      ...(pr.days || {})
    };
    if (next && next.length) nd[dateStr] = next;else delete nd[dateStr];
    return {
      ...pr,
      days: nd
    };
  });
  const writeSlots = next => writeDay(sel, next);
  const addSlot = name => writeSlots([...slots, newSlot(name)]);
  const moveSlot = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= slots.length) return;
    const next = slots.slice();
    const [x] = next.splice(i, 1);
    next.splice(j, 0, x);
    if (next.length) next[0] = {
      ...next[0],
      link: false
    };
    writeSlots(next);
  };
  const toggleLink = i => {
    if (i > 0) writeSlots(slots.map((x, j) => j === i ? {
      ...x,
      link: !x.link
    } : x));
  };
  const swapSlot = (id, name) => writeSlots(slots.map(x => x.id === id ? {
    ...newSlot(name),
    id: x.id,
    sets: x.sets,
    reps: x.reps,
    mode: x.mode,
    val: x.val,
    bo: x.bo,
    link: x.link,
    metric: x.metric
  } : x));
  // Writing a slot's tracked/untracked choice through to the exercise itself, so
  // the decision holds wherever that movement shows up rather than only here.
  const setSlot = (id, next) => {
    writeSlots(slots.map(x => x.id === id ? next : x));
    const prev = slots.find(x => x.id === id);
    if (prev && next.role !== prev.role && state.exercises[next.ex]) setState(st => ({
      ...st,
      exercises: {
        ...st.exercises,
        [next.ex]: {
          ...st.exercises[next.ex],
          accessory: next.role === "accessory"
        }
      }
    }));
  };

  // Clone copies this calendar week forward into the next one, once, into dates
  // you can see — nothing repeats behind your back.
  const cloneWeek = rule => setProgram(pr => {
    const nd = {
      ...(pr.days || {})
    };
    const bump = sl => {
      const base = {
        ...sl,
        id: uid()
      };
      if (sl.role !== "main") return base;
      if (rule === "rpe" && sl.mode === "rpe") return {
        ...base,
        val: Math.min(10, sl.val + 0.5)
      };
      if (rule === "rpe" && sl.mode === "rir") return {
        ...base,
        val: Math.max(0, sl.val - 0.5)
      };
      if (rule === "pct" && sl.mode === "pct") return {
        ...base,
        val: Math.min(105, sl.val + 2.5)
      };
      if (rule === "rep") return {
        ...base,
        reps: Math.max(1, sl.reps - 1)
      };
      return base;
    };
    for (const d of weekDates(sel)) {
      const src = (pr.days || {})[d] || [];
      if (src.length) nd[addDays(d, 7)] = src.map(bump);
    }
    return {
      ...pr,
      days: nd
    };
  });
  const niceDay = d => dayStart(d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  // Arming an operation closes the sheet and hands the calendar over as the target
  // picker. Tapping the day you want beats a date field twice over: fewer taps, and
  // you can see what is already booked while you choose.
  const arm = kind => {
    setDayOpen(false);
    setPending({
      kind,
      from: sel
    });
  };
  // Arming from a slot card, which lives below the calendar — so the calendar it
  // wants you to tap is off the top of the screen unless we go and get it.
  const armSlot = sl => {
    setDayOpen(false);
    setPending({
      kind: "slot",
      from: sel,
      slotId: sl.id,
      ex: sl.ex
    });
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch (e) {}
  };
  const runOp = (kind, from, to, mode) => {
    const next = kind === "move" ? moveDay(days, from, to, mode) : kind === "copy" ? copyDay(days, from, to, mode) : swapDays(days, from, to);
    applyDays(next, (kind === "move" ? "Moved to " : kind === "copy" ? "Copied to " : "Swapped with ") + niceDay(to));
    setSelDate(to);
  };
  // A calendar tap is a destination while something is armed, and an ordinary day
  // selection the rest of the time.
  const pickDay = ds => {
    if (!pending) {
      setSelDate(ds);
      return;
    }
    const {
      kind,
      from
    } = pending;
    setPending(null);
    if (ds === from) return;
    if (kind === "slot") {
      applyDays(moveSlotToDay(days, from, ds, pending.slotId), `Moved ${shortLift(pending.ex)} to ${niceDay(ds)}`);
      setSelDate(ds);
      return;
    }
    // A swap is unambiguous whatever is on either day. Move and copy have to ask
    // before they land on work that is already there.
    if (kind !== "swap" && (days[ds] || []).length) {
      setConflict({
        kind,
        from,
        to: ds
      });
      return;
    }
    runOp(kind, from, ds, "replace");
  };
  const shiftBlock = n => {
    const merged = shiftCollisions(days, sel, n);
    applyDays(shiftFrom(days, sel, n), `Pushed ${n > 0 ? "forward" : "back"} ${Math.abs(n) === 7 ? "a week" : "a day"}` + (merged ? ` · ${merged} day${merged === 1 ? "" : "s"} combined` : ""));
    setSelDate(addDays(sel, n));
  };

  // "Done" counts planned days you actually logged something on, not every day you
  // trained — a session you did off-plan is training, but it is not this block.
  const blockStats = (() => {
    const keys = Object.keys(days).sort();
    const done = keys.filter(k => k <= todayStr() && loggedOn(state, k).length > 0).length;
    const fmtD = k => dayStart(k).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    });
    return {
      planned: keys.length,
      done,
      week: weekNoFor(program, todayStr()),
      span: keys.length ? `${fmtD(keys[0])} – ${fmtD(keys[keys.length - 1])}` : ""
    };
  })();
  const shift = d => setCur(c => {
    const n = new Date(c.y, c.m + d, 1);
    return {
      y: n.getFullYear(),
      m: n.getMonth()
    };
  });
  const jumpToday = () => {
    const d = new Date();
    setCur({
      y: d.getFullYear(),
      m: d.getMonth()
    });
    setSelDate(todayStr());
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    accent: C.red
  }, /*#__PURE__*/React.createElement("input", {
    value: program.name,
    onChange: e => setProgram(pr => ({
      ...pr,
      name: e.target.value
    })),
    style: {
      width: "100%",
      background: "none",
      border: "none",
      outline: "none",
      color: C.text,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 21,
      letterSpacing: "-0.02em",
      padding: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 14,
      flexWrap: "wrap",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 150px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, "Block starts"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: program.startDate,
    onChange: e => setProgram(pr => ({
      ...pr,
      startDate: e.target.value || todayStr()
    })),
    style: {
      width: "100%",
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line}`,
      borderRadius: R.input,
      padding: "0 13px",
      height: 44,
      color: C.text,
      fontFamily: MONO,
      fontSize: 14.5,
      fontWeight: 700,
      outline: "none",
      colorScheme: "dark"
    }
  })), /*#__PURE__*/React.createElement(Btn, {
    kind: program.active ? "solid" : "ghost",
    style: {
      minHeight: 44,
      fontSize: 12.5
    },
    onClick: () => setProgram(pr => ({
      ...pr,
      active: !pr.active
    }))
  }, program.active ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 15
  }), " Running") : "Paused")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginTop: 15
    }
  }, /*#__PURE__*/React.createElement(Ring, {
    value: blockStats.done,
    max: Math.max(1, blockStats.planned),
    size: 62,
    stroke: 6,
    color: C.red
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: "-0.02em"
    }
  }, blockStats.planned ? Math.round(blockStats.done / blockStats.planned * 100) : 0), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 7.5,
      color: C.faint,
      fontWeight: 600
    }
  }, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flex: 1,
      minWidth: 0
    }
  }, [["Week", blockStats.week > 0 ? String(blockStats.week) : "—"], ["Done", String(blockStats.done)], ["Planned", String(blockStats.planned)]].map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: 1,
      minWidth: 0,
      paddingLeft: i ? 11 : 0,
      borderLeft: i ? `1px solid ${C.line}` : "none",
      marginLeft: i ? 11 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: "-0.02em"
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginTop: 3
    }
  }, k))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 13
    }
  }, blockStats.span || "Nothing scheduled yet"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginTop: 9,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCoachOpen(true),
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, "Build me a block"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setRxOpen(true),
    style: {
      background: "none",
      border: "none",
      color: C.violet,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, "Weak point"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setLibOpen(true),
    style: {
      background: "none",
      border: "none",
      color: C.muted,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, "Library", library.length ? ` · ${library.length}` : ""), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPicking2(true),
    style: {
      background: "none",
      border: "none",
      color: C.muted,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, "Programmes"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setResetting(true),
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, "Reset")))), rxNote && /*#__PURE__*/React.createElement(Callout, {
    tone: "warn"
  }, rxNote), pending && /*#__PURE__*/React.createElement(Card, {
    accent: C.blue,
    style: {
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9,
      color: C.blue,
      display: "block",
      marginBottom: 3
    }
  }, pending.kind === "slot" ? `Moving ${shortLift(pending.ex)}` : pending.kind === "move" ? "Moving" : pending.kind === "copy" ? "Copying" : "Swapping", pending.kind === "slot" ? ` off ${niceDay(pending.from)}` : ` ${niceDay(pending.from)}`), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, pending.kind === "slot" ? "Tap the day it should go to — the rest of this session stays put." : "Tap the day you want below.")), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      fontSize: 12
    },
    onClick: () => setPending(null)
  }, "Cancel"))), /*#__PURE__*/React.createElement(MonthCalendar, {
    y: cur.y,
    m: cur.m,
    sel: sel,
    onSel: pickDay,
    onShift: shift,
    program: program,
    loggedDays: loggedDays,
    state: state
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    accent: C.amber,
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 13
      }
    }, sel !== todayStr() && /*#__PURE__*/React.createElement("button", {
      onClick: jumpToday,
      style: {
        background: "none",
        border: "none",
        color: C.red,
        fontWeight: 800,
        fontSize: 11.5,
        cursor: "pointer",
        padding: 0
      }
    }, "Today"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setDayOpen(true),
      style: {
        background: "none",
        border: "none",
        color: C.muted,
        fontWeight: 800,
        fontSize: 11.5,
        cursor: "pointer",
        padding: 0
      }
    }, "Edit day"))
  }, selDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  }), weekNo >= 1 ? ` · week ${weekNo}` : ""), did.length > 0 && /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9.5,
      marginBottom: 10
    }
  }, "What you did"), did.map(st => /*#__PURE__*/React.createElement("div", {
    key: st.id,
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      padding: "6px 0",
      fontSize: 12.5,
      borderBottom: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, st.ex, st.backoff ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint,
      fontWeight: 500
    }
  }, " \xB7 back-off") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      color: C.muted,
      whiteSpace: "nowrap"
    }
  }, setLine(st, state))))), decorateSlots(slots).map(d => /*#__PURE__*/React.createElement(React.Fragment, {
    key: d.sl.id
  }, spreadPlan && spreadPlan.fromEx === d.sl.ex && /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${tint(C.blue, 0.3)}`,
      background: tint(C.blue, 0.07),
      borderRadius: R.ctrl,
      padding: "11px 13px",
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.text,
      lineHeight: 1.5
    }
  }, "Changed ", /*#__PURE__*/React.createElement("b", null, Object.keys(spreadPlan.patch).map(k => k === "amrap" ? "AMRAP" : k === "ex" ? "the movement" : k).join(", ")), " ", "on ", shortLift(spreadPlan.fromEx), ". ", spreadPlan.n, " later session", spreadPlan.n === 1 ? "" : "s", " use it too."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 9,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    style: {
      minHeight: 36,
      fontSize: 12,
      padding: "8px 14px"
    },
    onClick: () => {
      spreadAhead(spreadPlan.date, spreadPlan.fromEx, spreadPlan.patch, false);
      setSpreadPlan(null);
    }
  }, "Rest of the block"), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      minHeight: 36,
      fontSize: 12,
      padding: "8px 14px"
    },
    onClick: () => setSpreadPlan(null)
  }, "This day only"), Object.keys(spreadPlan.patch).some(k => PLAN_WAVE.indexOf(k) >= 0) && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      spreadAhead(spreadPlan.date, spreadPlan.fromEx, spreadPlan.patch, true);
      setSpreadPlan(null);
    },
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontWeight: 700,
      fontSize: 11,
      cursor: "pointer",
      padding: "8px 0"
    }
  }, "\u2026numbers too"))), /*#__PURE__*/React.createElement(SlotCard, {
    slot: d.sl,
    state: state,
    tag: d.tag,
    grouped: d.grouped,
    groupFirst: d.first,
    onPickBoLift: id => setPicking({
      mode: "bo",
      id
    }),
    groupLast: d.last,
    rounds: d.rounds,
    canUp: d.idx > 0,
    canDown: d.idx < slots.length - 1,
    onUp: () => moveSlot(d.idx, -1),
    onDown: () => moveSlot(d.idx, 1),
    canLink: d.idx > 0,
    onToggleLink: () => toggleLink(d.idx),
    onChange: next => {
      const patch = {};
      for (const k of Object.keys(next)) if (next[k] !== d.sl[k]) patch[k] = next[k];
      setSlot(d.sl.id, next);
      const later = Object.keys(program.days || {}).filter(x => x > sel).filter(x => (program.days[x] || []).some(y => y.ex === d.sl.ex)).length;
      if (later > 0 && Object.keys(patch).length) setSpreadPlan({
        date: sel,
        fromEx: d.sl.ex,
        patch,
        n: later
      });
    },
    onDelete: () => writeSlots(slots.filter(x => x.id !== d.sl.id)),
    onMoveDay: () => armSlot(d.sl),
    onRename: () => setPicking({
      mode: "swap",
      id: d.sl.id
    })
  }))), !slots.length && /*#__PURE__*/React.createElement(Card, {
    style: {
      textAlign: "center",
      color: C.muted,
      fontSize: 13,
      padding: "22px 16px",
      lineHeight: 1.6
    }
  }, "Nothing planned", isPast ? " was" : "", " on this day. A rest day is a perfectly good answer."), /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    style: {
      width: "100%",
      marginTop: 10
    },
    onClick: () => setPicking({
      mode: "add"
    })
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 16
  }), " Add movement"), weekCount > 0 && /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      width: "100%",
      marginTop: 9,
      fontSize: 13
    },
    onClick: () => setCloning(true)
  }, "Copy this week into next week")), /*#__PURE__*/React.createElement(ExercisePicker, {
    open: !!picking,
    onClose: () => setPicking(null),
    existing: Object.keys(state.exercises),
    onPick: name => {
      if (!picking) return;
      if (picking.mode === "swap") swapSlot(picking.id, name);else if (picking.mode === "bo") writeSlots(slots.map(x => x.id === picking.id ? {
        ...x,
        bo: {
          ...x.bo,
          lift: name === x.ex ? null : name
        }
      } : x));else addSlot(name);
    }
  }), /*#__PURE__*/React.createElement(CloneSheet, {
    open: cloning,
    onClose: () => setCloning(false),
    fromLabel: "week " + weekNo,
    onClone: rule => {
      cloneWeek(rule);
      setSelDate(addDays(sel, 7));
    }
  }), /*#__PURE__*/React.createElement(CoachSheet, {
    open: coachOpen,
    onClose: () => setCoachOpen(false),
    state: state,
    models: models,
    unit: (state.settings || {}).unit,
    onGenerate: (tpl, opts, rx) => {
      // The template lays down the main work; the prescription writes the
      // lifter's own weak point underneath it before any of it is saved.
      const built = applyPrescription(generateProgram(tpl, opts), rx);
      applyDays({
        ...days,
        ...built
      }, `Built ${tpl.name}`);
      setProgram(pr => ({
        ...pr,
        name: tpl.name,
        startDate: opts.startDate,
        active: true
      }));
      setSelDate(opts.startDate);
      const d = dayStart(opts.startDate);
      setCur({
        y: d.getFullYear(),
        m: d.getMonth()
      });
    }
  }), /*#__PURE__*/React.createElement(CoachSheet, {
    open: rxOpen,
    onClose: () => setRxOpen(false),
    state: state,
    models: models,
    rxOnly: true,
    unit: (state.settings || {}).unit,
    onPrescribe: rx => {
      const hit = rxTargetDays(days, rx);
      if (!hit.length) {
        // Nothing ahead of today trains that pattern, so there is nowhere to
        // put the work. Saying so beats an undo bar for a change that is not there.
        setRxNote(`Nothing left in this block trains your ${shortLift(rx && rx.lift || "lift")} — ` + "plan a session for it and run this again, and the work will go in beside it.");
        return;
      }
      applyDays(applyPrescription(days, rx), `Added weak-point work to ${hit.length} session${hit.length === 1 ? "" : "s"}`);
    }
  }), /*#__PURE__*/React.createElement(ProgramPicker, {
    open: picking2,
    onClose: () => setPicking2(false),
    state: state,
    days: days,
    onGenerate: (tpl, opts, built) => {
      // Generated days are ordinary days: they merge into what is already there,
      // replacing only the dates the block actually lands on, and the whole thing
      // is one undo away like every other change to the calendar.
      applyDays({
        ...days,
        ...built
      }, `Added ${tpl.name}`);
      setProgram(pr => ({
        ...pr,
        name: pr.name === "My program" ? tpl.name : pr.name,
        startDate: opts.startDate,
        active: true
      }));
      setSelDate(opts.startDate);
      const d = dayStart(opts.startDate);
      setCur({
        y: d.getFullYear(),
        m: d.getMonth()
      });
    }
  }), /*#__PURE__*/React.createElement(DaySheet, {
    open: dayOpen,
    onClose: () => setDayOpen(false),
    dateStr: sel,
    days: days,
    onArm: arm,
    onShift: shiftBlock,
    onClear: () => applyDays(dropDay(days, sel), "Cleared " + niceDay(sel))
  }), /*#__PURE__*/React.createElement(ConflictSheet, {
    open: !!conflict,
    onClose: () => setConflict(null),
    conflict: conflict,
    days: days,
    onResolve: mode => runOp(conflict.kind, conflict.from, conflict.to, mode)
  }), undo && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: "calc(82px + env(safe-area-inset-bottom, 0px))",
      zIndex: 31,
      display: "flex",
      justifyContent: "center",
      padding: "0 12px",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      width: "100%",
      maxWidth: 456,
      background: "rgba(14,17,25,0.95)",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      border: `1px solid ${C.line2}`,
      borderRadius: R.ctrl,
      padding: "11px 14px",
      pointerEvents: "auto",
      boxShadow: "0 18px 40px -14px rgba(0,0,0,0.9)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      minWidth: 0,
      flex: 1,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, undo.said), /*#__PURE__*/React.createElement("button", {
    onClick: doUndo,
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 800,
      fontSize: 12.5,
      cursor: "pointer",
      padding: 0,
      flexShrink: 0
    }
  }, "Undo"))), /*#__PURE__*/React.createElement(LibrarySheet, {
    open: libOpen,
    onClose: () => setLibOpen(false),
    program: program,
    library: library,
    onSave: nm => {
      const entry = blockToArchive(program, nm);
      if (entry) setLibrary(l => [...l, entry]);
    },
    onLoad: (entry, start) => {
      // A restored block is ordinary calendar days, so it merges, it is one
      // undo away, and it brings its own name and start date with it.
      const built = archiveToDays(entry, start);
      applyDays({
        ...days,
        ...built
      }, `Loaded ${entry.name}`);
      setProgram(pr => ({
        ...pr,
        name: entry.name,
        startDate: start,
        active: true
      }));
      setSelDate(start);
      const d = dayStart(start);
      setCur({
        y: d.getFullYear(),
        m: d.getMonth()
      });
    },
    onRename: (id, nm) => setLibrary(l => l.map(x => x.id === id ? {
      ...x,
      name: (nm || "").trim() || x.name
    } : x)),
    onDelete: id => setLibrary(l => l.filter(x => x.id !== id))
  }), /*#__PURE__*/React.createElement(ResetSheet, {
    open: resetting,
    onClose: () => setResetting(false),
    weekLabel: "week " + weekNo,
    hasBlock: Object.keys(days).length > 0,
    onSaveFirst: () => {
      setResetting(false);
      setLibOpen(true);
    },
    onClearWeek: () => setProgram(pr => {
      const nd = {
        ...(pr.days || {})
      };
      for (const d of weekDates(sel)) delete nd[d];
      return {
        ...pr,
        days: nd
      };
    }),
    onTrimAfter: () => setProgram(pr => {
      const nd = {};
      const cut = addDays(weekStartOf(sel), 7);
      for (const k of Object.keys(pr.days || {})) if (k < cut) nd[k] = pr.days[k];
      return {
        ...pr,
        days: nd
      };
    }),
    onStartOver: () => setProgram(newProgram())
  }));
}

// One picker for "what am I training". A horizontal strip of chips stopped working
// the moment a real programme put twenty movements in the app, so this searches
// what you already train first and falls through to the full library — picking a
// library movement creates it, wired to its main lift, exactly as a slot does.
// The whole day laid out. The strip is right to stay compact — six movements of
// four sets is three phone screens — but "what is left" is a real question, and
// one tap is the right price for it.
function DaySheet2({
  open,
  onClose,
  slots,
  doneSlots,
  state,
  sel,
  onPick,
  unit,
  dateLabel,
  weekLabel
}) {
  if (!open) return null;
  const deco = decorateSlots(slots || []);
  const totals = (slots || []).reduce((a, sl) => {
    const pr = doneSlots[sl.id] || {
      n: 0,
      total: slotSetCount(sl)
    };
    return {
      done: a.done + Math.min(pr.n, pr.total),
      all: a.all + pr.total
    };
  }, {
    done: 0,
    all: 0
  });
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: weekLabel || "Today"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: "-0.03em"
    }
  }, totals.all - totals.done), /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: C.faint
    }
  }, "set", totals.all - totals.done === 1 ? "" : "s", " left of ", totals.all, " \xB7 ", dateLabel)), deco.map(d => {
    const pr = doneSlots[d.sl.id] || {
      n: 0,
      total: slotSetCount(d.sl),
      done: false
    };
    const on = d.sl.ex === sel;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: d.sl.id
    }, d.grouped && d.first && /*#__PURE__*/React.createElement("div", {
      style: {
        ...label,
        fontSize: 9,
        color: C.blue,
        margin: "6px 0 5px 2px"
      }
    }, "Superset ", d.tag.charAt(0), d.rounds ? ` · ${d.rounds} rounds` : ""), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        onPick(d.sl);
        onClose();
      },
      style: {
        width: "100%",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 11,
        marginBottom: 7,
        cursor: "pointer",
        marginLeft: d.grouped ? 10 : 0,
        borderLeft: d.grouped ? `2px solid ${tint(C.blue, 0.5)}` : undefined,
        background: on ? tint(hueFor(d.sl.ex, state), 0.12) : "rgba(255,255,255,0.025)",
        border: `1px solid ${on ? tint(hueFor(d.sl.ex, state), 0.45) : C.line}`,
        borderRadius: R.ctrl,
        padding: "11px 13px",
        color: C.text,
        opacity: pr.done && !on ? 0.6 : 1,
        WebkitTapHighlightColor: "transparent"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontWeight: 800,
        fontSize: 13.5,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, d.grouped ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 10.5,
        color: C.blue,
        marginRight: 6
      }
    }, d.tag) : null, d.sl.ex), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: MONO,
        fontSize: 11,
        color: C.muted,
        marginTop: 3
      }
    }, slotSummary(d.sl), d.sl.bo ? ` + ${d.sl.bo.sets}×${d.sl.bo.reps}` : "")), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        gap: 3,
        flexShrink: 0
      }
    }, Array.from({
      length: Math.min(8, pr.total)
    }).map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: 5,
        height: 5,
        borderRadius: 3,
        background: i < pr.n ? C.good : "rgba(255,255,255,0.16)"
      }
    }))), pr.done && /*#__PURE__*/React.createElement(Check, {
      size: 14,
      style: {
        color: C.good,
        flexShrink: 0
      }
    })));
  }));
}
function LiftSheet({
  open,
  onClose,
  state,
  models,
  sel,
  onPick,
  onCreate,
  unit,
  todaySlots
}) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  useEffect(() => {
    if (open) setQ("");
  }, [open]);
  const names = Object.keys(state.exercises || {});
  const match = n => !query || n.toLowerCase().includes(query);
  const todays = (todaySlots || []).map(x => x.ex).filter((n, i, a) => a.indexOf(n) === i).filter(match);
  const mine = names.filter(match).filter(n => todays.indexOf(n) < 0);
  const tracked = mine.filter(n => !isAccessory(n, state));
  const acc = mine.filter(n => isAccessory(n, state));
  const fromLib = LIB.filter(x => query && x.n.toLowerCase().includes(query) && names.indexOf(x.n) < 0).slice(0, 40);
  const custom = query.length > 1 && !names.some(n => n.toLowerCase() === query) && !LIB.some(x => x.n.toLowerCase() === query);
  const row = (n, right, onClick) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      borderBottom: `1px solid ${C.line}`,
      background: n === sel ? "rgba(255,255,255,0.05)" : "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...pickRow,
      borderBottom: "none",
      background: "none",
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 13.5,
      textAlign: "left",
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: C.faint,
      fontFamily: MONO,
      whiteSpace: "nowrap",
      marginLeft: 10
    }
  }, right)), /*#__PURE__*/React.createElement(HowTo, {
    name: n
  }));
  const hint = n => {
    if (isTimed(n, state)) return "time";
    if (isAccessory(n, state)) return "accessory";
    const m = models && models[n];
    return m && m.e1rm != null ? fmt(Math.round(m.e1rm)) + unit : "—";
  };
  const head = t => /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      margin: "14px 0 4px"
    }
  }, t);
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Choose a lift"
  }, /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search your lifts and the library\u2026",
    autoFocus: true,
    style: {
      width: "100%",
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line2}`,
      borderRadius: R.input,
      padding: "12px 13px",
      color: C.text,
      fontFamily: SANS,
      fontSize: 15,
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: "56vh",
      overflowY: "auto",
      overscrollBehavior: "contain",
      WebkitOverflowScrolling: "touch",
      margin: "0 -4px",
      padding: "0 4px"
    }
  }, query ? /*#__PURE__*/React.createElement(React.Fragment, null, todays.concat(tracked, acc).map(n => row(n, hint(n), () => {
    onPick(n);
    onClose();
  })), fromLib.map(x => row(x.n, x.m ? "→ " + x.m : (LIB_EQUIP.find(e => e.k === x.e) || {}).t || "", () => {
    onCreate(x.n);
    onClose();
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, todays.length > 0 && head("Today's session"), todays.map(n => row(n, hint(n), () => {
    onPick(n);
    onClose();
  })), tracked.length > 0 && head("Your lifts"), tracked.map(n => row(n, hint(n), () => {
    onPick(n);
    onClose();
  })), acc.length > 0 && head("Accessories"), acc.map(n => row(n, hint(n), () => {
    onPick(n);
    onClose();
  }))), custom && /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      width: "100%",
      margin: "10px 0 2px"
    },
    onClick: () => {
      onCreate(q.trim());
      onClose();
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 15
  }), " Add \"", q.trim(), "\" as a new movement"), !todays.length && !mine.length && !fromLib.length && !custom && /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.faint,
      fontSize: 13,
      textAlign: "center",
      padding: "22px 0"
    }
  }, "Nothing matches that.")));
}

// Clock-based logger: weight is optional (a weighted plank, a loaded carry), the
// target comes from the programmed slot when there is one, and nothing here feeds
// the one-rep-max estimator.
function TimedLogger({
  state,
  sel,
  logSet,
  logDate,
  setLogDate,
  unit,
  slot
}) {
  const [secs, setSecs] = useState(slot ? slot.reps : 45);
  const [wt, setWt] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setSecs(slot ? slot.reps : 45);
    setWt("");
  }, [sel, slot && slot.id]);
  const dk = new Date(tsFromDateStr(logDate)).toDateString();
  const today = ((state.exercises[sel] || {}).sets || []).filter(x => new Date(x.ts).toDateString() === dk);
  const target = slot ? slot.sets : null;
  const log = () => {
    if (!sel || !secs) return;
    const w = parseFloat(wt);
    logSet(sel, {
      weight: isFinite(w) && w > 0 ? w : 0,
      reps: 1,
      rpe: 7,
      secs: Math.round(secs),
      ts: tsFromDateStr(logDate),
      timed: true
    });
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  };
  return /*#__PURE__*/React.createElement(Card, {
    accent: C.blue
  }, /*#__PURE__*/React.createElement(SectionHead, {
    accent: C.blue,
    sub: target ? `Programmed: ${target} × ${fmtDur(slot.reps)}.` : "Logged on the clock — this one doesn't feed your 1RM."
  }, sel), today.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      marginBottom: 14
    }
  }, today.map((x, i) => /*#__PURE__*/React.createElement("div", {
    key: x.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: C.bg2,
      border: `1px solid ${C.line}`,
      borderRadius: 12,
      padding: "9px 13px"
    }
  }, /*#__PURE__*/React.createElement(Check, {
    size: 14,
    style: {
      color: C.good,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: C.muted,
      fontWeight: 700
    }
  }, "Set ", i + 1, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      color: C.text
    }
  }, fmtDur(x.secs)), x.weight ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      color: C.text
    }
  }, " \xB7 ", fmt(x.weight), unit) : null)))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "6px 0 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, "Duration"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 46,
      fontWeight: 700,
      letterSpacing: "-0.04em",
      marginTop: 8,
      color: C.text
    }
  }, fmtDur(secs))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      justifyContent: "center",
      flexWrap: "wrap",
      marginBottom: 14
    }
  }, [-30, -10, -5, 5, 10, 30].map(d => /*#__PURE__*/React.createElement(Chip, {
    key: d,
    sm: true,
    onClick: () => setSecs(v => Math.max(5, Math.min(3600, v + d)))
  }, d > 0 ? "+" : "", d, "s"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 110px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, "Added weight (optional)"), /*#__PURE__*/React.createElement(NumField, {
    value: wt,
    onChange: setWt,
    suffix: unit
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, "Date"), /*#__PURE__*/React.createElement(DateField, {
    value: logDate,
    onChange: setLogDate
  })), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: log,
    style: {
      width: "100%",
      marginTop: 14
    }
  }, done ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 17
  }), " Logged") : `Log ${fmtDur(secs)}`));
}

/* =============================== TRAIN TAB =============================== */
function TrainTab({
  state,
  setState,
  sel,
  setSel,
  models,
  addExercise,
  updateExercise,
  logSet,
  updateSet,
  deleteSet,
  settings,
  setSetting,
  denoms,
  meetDays,
  meetName,
  plan,
  onEditPlan,
  setTab,
  openDayTools,
  saveClip,
  dropClip
}) {
  const {
    unit,
    round,
    bar
  } = settings;
  // A programmed slot carries its own intensity language, so the tab's mode is an
  // override on top of the global setting rather than the setting itself: the top
  // single can be RPE while the leg extensions after it are reps in reserve.
  const [modeOverride, setModeOverride] = useState(null);
  const inputMode = modeOverride === "rir" ? "rir" : modeOverride === "rpe" ? "rpe" : settings.inputMode;
  const names = Object.keys(state.exercises);
  const mains = names.filter(n => !state.exercises[n].parent);
  const [adding, setAdding] = useState(false);
  const [pickingLift, setPickingLift] = useState(false);
  const [newName, setNewName] = useState("");
  const [linking, setLinking] = useState(false);

  // prescription
  const [tReps, setTReps] = useState(3);
  const [tInt, setTInt] = useState(inputMode === "rir" ? 1 : 8); // value in current mode
  const tRpe = inputMode === "rir" ? 10 - tInt : tInt;

  // log panel
  const [note, setNote] = useState("");
  const [showPlates, setShowPlates] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [justLogged, setJustLogged] = useState(false);
  const [filming, setFilming] = useState(null);
  const [logDate, setLogDate] = useState(todayStr());
  const model = sel && models[sel] ? models[sel] : {
    e1rm: null,
    points: [],
    count: 0
  };
  // The lift you are training owns this screen's accent, so Train looks different for
  // a squat day than a bench day and matches that lift everywhere else in the app.
  const selHue = hueFor(sel, state);
  const e1rm = model.e1rm;
  /* An estimate with nothing of its own behind it. A variation you have never
     trained takes its number from its parent lift times a library guess at the
     ratio, and the screen used to present that with exactly the same confidence
     as a lift with twenty sessions in it. Being 16% heavy on the first set of a
     paused deadlift is a bad way to find out the guess was optimistic. */
  const inferred = useMemo(() => {
    const ex = sel && state.exercises[sel];
    if (!ex || !ex.parent || !state.exercises[ex.parent]) return null;
    if ((ex.sets || []).some(x => x.secs == null)) return null; // it has its own history
    const r = models[sel] && models[sel].ratio || ex.ratioManual || ex.ratio || 0.9;
    return {
      parent: ex.parent,
      pct: Math.round(r * 100)
    };
  }, [sel, state.exercises, models]);
  // Accessories are shown in the unit they are actually trained in. The estimate
  // underneath is the same one every other lift uses — only the way it is read out
  // changes, because "your leg extension one-rep max" is not a thing anyone does.
  const accMode = !!sel && isAccessory(sel, state);
  const accReps = accMode ? accessoryReps(sel, state) : null;
  const accWork = accMode ? workingWeight(e1rm, accReps) : null;
  const accPoints = useMemo(() => accMode && model.points ? model.points.map(pt => ({
    ts: pt.ts,
    value: workingWeight(pt.value, accReps)
  })) : null, [accMode, model.points, accReps]);
  const [showWarm, setShowWarm] = useState(false);
  const [warmOpen, setWarmOpen] = useState(null);
  const selEx = sel ? state.exercises[sel] : null;
  const DAYK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayPlan = (plan || {})[DAYK[(new Date(tsFromDateStr(logDate)).getDay() + 6) % 7]] || [];
  // Today's session, straight off the block. The program decides WHAT; every load
  // on this screen still comes from the estimator, so a programmed day and a
  // freestyle day are the same machinery with a different starting point.
  const sessionSlots = slotsFor(state.program, logDate);
  const timedSel = !!sel && isTimed(sel, state);
  const timedSlot = sessionSlots.find(x => x.ex === sel && slotTimed(x)) || null;
  const progWeek = state.program ? "Week " + weekNoFor(state.program, logDate) : null;
  // How many sets a slot actually asks for: a top set plus its back-offs, or just the
  // straight sets across. Progress is counted against that total rather than against
  // "has anything been logged", so a 5×5 reads 2/5 after two sets instead of done.
  const doneSlots = useMemo(() => {
    const dk = new Date(tsFromDateStr(logDate)).toDateString();
    const out = {};
    for (const sl of sessionSlots) {
      const names = [sl.ex].concat(sl.bo && sl.bo.lift && sl.bo.lift !== sl.ex ? [sl.bo.lift] : []);
      let n = 0;
      for (const nm of names) {
        const ex = state.exercises[nm];
        if (ex) n += ex.sets.filter(x => new Date(x.ts).toDateString() === dk).length;
      }
      const total = slotSetCount(sl);
      out[sl.id] = {
        n: Math.min(n, total),
        total,
        done: n >= total,
        started: n > 0
      };
    }
    return out;
  }, [sessionSlots, state.exercises, logDate]);
  // Which slot the screen is currently working through, so the cards below know
  // whether they are a top set with back-offs or plain sets across.
  const [activeSlotId, setActiveSlotId] = useState(null);
  const activeSlot = sessionSlots.find(x => x.id === activeSlotId && x.ex === sel) || sessionSlots.find(x => x.ex === sel) || null;
  // A slot with no top set is several sets at one prescription. That is the same
  // machinery with the first set as the driver: hold the reps and the effort, and
  // each set's load reads the fatigue the one before it spent.
  const straightCount = activeSlot && !activeSlot.bo && !slotTimed(activeSlot) && activeSlot.sets > 1 ? activeSlot.sets : 0;

  /* Changing what today asks for changes TODAY'S PLAN, not just this screen.
     Cutting three sets to two because you ran out of time is a real decision
     about the session, and the calendar should carry it — otherwise Plan keeps
     insisting you owe a set you already decided not to do. Only this date's
     slot moves; the rest of the block is untouched. */
  /* A block is the same session repeated with the numbers moving. So a change
     you make standing in the gym is usually a change to the BLOCK, not to one
     Tuesday — "I'm making this an AMRAP" almost never means only this week.
      Which fields carry is the whole question. reps, sets and the effort are the
     wave: they are supposed to differ week to week, and copying them forward
     would flatten the block into five identical sessions. Everything else —
     which movement it is, whether the last set runs out, whether there are
     back-offs — is structure, and structure should hold. So "rest of the block"
     carries the structure and leaves the numbers alone, with a second option
     for when you really do mean the numbers too. */
  const WAVE_FIELDS = ["reps", "sets", "val", "mode"];
  const [spread, setSpread] = useState(null);
  const futureDays = (st, fromEx) => {
    const pr = st.program;
    if (!pr || !pr.days) return [];
    return Object.keys(pr.days).filter(d => d > logDate).filter(d => (pr.days[d] || []).some(x => x.ex === fromEx)).sort();
  };
  const applyAhead = (fromEx, patch, withNumbers) => setState(st => {
    const pr = st.program;
    if (!pr || !pr.days) return st;
    const keep = {};
    for (const k of Object.keys(patch)) if (withNumbers || WAVE_FIELDS.indexOf(k) < 0) keep[k] = patch[k];
    if (!Object.keys(keep).length) return st;
    const days = {
      ...pr.days
    };
    for (const d of Object.keys(days)) {
      if (d <= logDate) continue;
      if (!days[d].some(x => x.ex === fromEx)) continue;
      days[d] = days[d].map(x => x.ex === fromEx ? {
        ...x,
        ...keep
      } : x);
    }
    return {
      ...st,
      program: {
        ...pr,
        days
      }
    };
  });
  // Every slot edit offers to carry forward; the offer names what it would touch.
  const patchSlotSpread = (slotId, patch, fromEx) => {
    patchSlot(slotId, patch);
    const n = futureDays(state, fromEx).length;
    if (n > 0) setSpread({
      fromEx,
      patch,
      n,
      label: Object.keys(patch).join(", ")
    });
  };
  const patchSlot = (slotId, patch) => setState(st => {
    const pr = st.program;
    if (!pr || !pr.days) return st;
    const day = pr.days[logDate];
    if (!day) return st;
    let hit = false;
    const next = day.map(x => x.id === slotId ? (hit = true, {
      ...x,
      ...patch
    }) : x);
    if (!hit) return st;
    return {
      ...st,
      program: {
        ...pr,
        days: {
          ...pr.days,
          [logDate]: next
        }
      }
    };
  });
  const loadSlot = sl => {
    setActiveSlotId(sl.id);
    // A movement programmed but never trained yet gets created on first tap, wired
    // to its main lift so a paused squat still feeds the squat model.
    if (!state.exercises[sl.ex]) {
      const L = libFind(sl.ex);
      const parent = L && L.m && state.exercises[L.m] ? L.m : null;
      addExercise(sl.ex, parent, L ? L.r : undefined);
      const patch = {};
      if (sl.role === "accessory") patch.accessory = true;
      if (slotTimed(sl)) {
        patch.metric = "time";
        patch.accessory = true;
      }
      if (Object.keys(patch).length) updateExercise(sl.ex, patch);
    } else setSel(sl.ex);
    setModeOverride(sl.mode);
    setTReps(sl.reps);
    if (sl.mode === "pct") setTopPct(sl.val);else setTInt(sl.val);
    if (sl.bo && setSetting) {
      const b = sl.bo;
      // A back-off movement named in the plan has to exist before Train can point at
      // it, and has to be wired to the lift it came off, or its loads would be read
      // against nothing.
      if (b.lift && b.lift !== sl.ex && !state.exercises[b.lift]) {
        const BL = libFind(b.lift);
        addExercise(b.lift, sl.ex, BL ? BL.r : undefined);
        // addExercise selects what it creates, which is right when you add a movement
        // by hand and wrong here: you tapped the top set, not its back-off.
        setSel(sl.ex);
      }
      // Every back-off set carries the chosen movement, so the plan's intent survives
      // into the session rather than being re-picked by hand each time.
      const steps = b.lift && b.lift !== sl.ex ? Array.from({
        length: Math.max(1, b.sets)
      }).map(() => ({
        lift: b.lift
      })) : [];
      setSetting("backoff", {
        ...(settings.backoff || {}),
        sets: b.sets,
        reps: b.reps,
        rpe: b.mode === "rir" ? Math.max(5, 10 - b.val) : b.mode === "rpe" ? b.val : 7,
        pct: b.mode === "pct" ? b.val : (settings.backoff || {}).pct,
        steps
      });
    } else if (!slotTimed(sl) && sl.sets > 1 && setSetting) {
      // Sets across: the remaining sets carry the same prescription as the first.
      setSetting("backoff", {
        ...(settings.backoff || {}),
        sets: sl.sets - 1,
        reps: sl.reps,
        rpe: sl.mode === "rir" ? Math.max(5, 10 - sl.val) : sl.mode === "rpe" ? sl.val : 7,
        pct: sl.mode === "pct" ? sl.val : (settings.backoff || {}).pct,
        steps: []
      });
    }
  };
  // Train opens on the session, not on whatever lift happened to be open last: the
  // first movement with work left, its prescription already loaded.
  const autoKey = logDate + "|" + sessionSlots.map(x => x.id).join(",");
  const autoRef = useRef(null);
  useEffect(() => {
    if (autoRef.current === autoKey) return;
    autoRef.current = autoKey;
    if (!sessionSlots.length) return;
    const mine = sel ? sessionSlots.find(x => x.ex === sel && !(doneSlots[x.id] || {}).done) : null;
    const target = mine || sessionSlots.find(x => !(doneSlots[x.id] || {}).done) || sessionSlots[0];
    if (target) loadSlot(target);
  }, [autoKey]);
  const loadPlanned = it => {
    if (state.exercises[it.name]) setSel(it.name);
    setTReps(it.reps);
    setTInt(inputMode === "rir" ? 10 - it.rpe : it.rpe);
    if (it.bo && setSetting) setSetting("backoff", {
      ...(settings.backoff || {}),
      sets: it.bo.sets,
      reps: it.bo.reps,
      rpe: it.bo.rpe,
      steps: []
    });
  };
  const childNames = sel ? names.filter(n => state.exercises[n].parent === sel) : [];
  const parentName = selEx && selEx.parent && state.exercises[selEx.parent] ? selEx.parent : null;
  const ratioPct = Math.round((model.ratio || 1) * 100);
  // training mode + reference max that percentages run off
  const percentMode = modeOverride ? modeOverride === "pct" : settings.trainingMode === "percent";
  const locked = percentMode && settings.maxMode === "locked";
  const tmax = selEx ? selEx.tmax : null;
  const setTmax = val => {
    if (sel) updateExercise(sel, {
      tmax: val
    });
  };
  const [editTmax, setEditTmax] = useState(false);
  const [tmaxInput, setTmaxInput] = useState("");
  // Week-over-week carryover trims today's targets. Weights are movement-pattern
  // aware: this lift's own strain in full, its variation family at 60%, same-pattern
  // lifts (squat↔deadlift) at 35%, and unrelated patterns at a whisper (5%) — a
  // brutal deadlift day reaches your squat, but barely touches your bench.
  const recovery = useMemo(() => {
    const none = {
      drop: 0,
      days: 0,
      peak: 0,
      from: null,
      carry: null,
      carryDrop: 0,
      priorDrop: 0
    };
    if (!selEx || e1rm == null) return none;
    const refTs = tsFromDateStr(logDate) + 1;
    const scale = learnRecoveryScale(selEx.sets);
    const own = residualFatigue(selEx.sets, refTs);
    let prior = own.raw,
      top = {
        c: own.raw,
        days: own.days,
        peak: own.peak,
        name: null
      };
    for (const [name, other] of Object.entries(state.exercises)) {
      if (name === sel) continue;
      const w = carryover(name, sel, state);
      if (w < 0.03) continue;
      const r = residualFatigue(other.sets, refTs);
      const c = w * r.raw;
      prior += c;
      if (c > top.c) top = {
        c,
        days: r.days,
        peak: r.peak,
        name
      };
    }
    // Work already done today, which the window above deliberately excludes.
    const today = todayStr();
    const carry = sessionCarry(state, sel, logDate, logDate === today ? Date.now() : null);
    // One cap over both, then split back out for display — otherwise two separate
    // caps could stack into a trim bigger than either is allowed to be.
    const drop = trimFor(prior + carry.raw, scale);
    const sum = prior + carry.raw;
    return {
      drop,
      days: top.days,
      peak: top.peak,
      from: top.name,
      carry: carry.raw > 0 ? carry : null,
      carryDrop: sum > 0 ? drop * (carry.raw / sum) : 0,
      priorDrop: sum > 0 ? drop * (prior / sum) : 0
    };
  }, [selEx, sel, state.exercises, e1rm, logDate]);
  // Declared conditions ride on top of predicted training debt: independent causes
  // of the same shortfall, so they multiply. Everything downstream — the top set,
  // every back-off, the strong/tough-day bracket, the plate maths — reads this one
  // number, so the whole session shifts together.
  const dayCheckin = checkinOn(state, logDate);
  const condFactor = conditionFactor(dayCheckin, liftClass(sel));
  const condWhy = conditionWhy(dayCheckin, liftClass(sel));
  const effE1rm = e1rm != null ? e1rm * (1 - recovery.drop) * condFactor : null;
  const ref = percentMode ? locked ? tmax != null ? tmax : e1rm != null ? roundTo(e1rm, round) : null : effE1rm != null ? roundTo(effE1rm, round) : null : effE1rm;
  const topPct = settings.topPct || 85;
  const setTopPct = v => setSetting && setSetting("topPct", Math.max(30, Math.min(105, v)));
  const rec = percentMode ? ref != null ? ref * (topPct / 100) : null : effE1rm != null ? weightForTarget(effE1rm, tReps, tRpe) : null;
  const recR = rec != null ? roundTo(rec, round) : null;
  // Built off the recommendation rather than the max, so everything below it already
  // carries today's trim.
  const warmup = useMemo(() => warmupPlan(recR, bar, round), [recR, bar, round]);
  // predicted effort for a % prescription, measured against the app's true estimate
  const predRpe = percentMode && effE1rm != null && recR != null ? Math.max(1, Math.min(10, 10 - (repsAtPct(recR / effE1rm * 100) - tReps))) : null;
  const strongDay = !percentMode && effE1rm != null && tRpe < 10 ? roundTo(weightForTarget(effE1rm, tReps, Math.min(10, tRpe + 0.5)), round) : null;
  const toughDay = !percentMode && effE1rm != null ? roundTo(weightForTarget(effE1rm, tReps, tRpe - 0.5), round) : null;

  // back-off sets — fatigue-aware in RPE mode; a flat % in percentage mode
  const bo = settings.backoff || {
    sets: 1,
    reps: 5,
    rpe: 8,
    pct: 75
  };
  const setBo = patch => setSetting && setSetting("backoff", {
    ...bo,
    ...patch
  });
  const boPct = bo.pct || 75;
  // Each back-off targets bo.reps @ bo.rpe; the load is what hits that target given how
  // much capacity the *actual* prior set spent. The first comes off your top set, each
  // next off the back-off before it, so a grindy set pulls the next one down harder.
  const [boDraft, setBoDraft] = useState(null);
  // The plan usually has the target right, so it stays folded away until it doesn't.
  const [targetOpen, setTargetOpen] = useState(false);
  const [bwEntry, setBwEntry] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [lastOpen, setLastOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [dayOpen, setDayOpen] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);
  const [shareImg, setShareImg] = useState(null);
  // Everything logged on the day being viewed, which is what a recap is about.
  const recapSession = useMemo(() => sessionForDay(state, models, logDate), [state.exercises, models, logDate]);
  const recapReady = !!recapSession;
  const backdated = logDate !== todayStr();
  const dayDone = !!(state.done || {})[logDate];
  const markDone = () => setState(st => ({
    ...st,
    done: {
      ...(st.done || {}),
      [logDate]: Date.now()
    }
  }));
  // How much of what the day asked for actually happened. Reported, never scored.
  const plannedProgress = useMemo(() => {
    const total = sessionSlots.length;
    if (!total) return null;
    const done = sessionSlots.filter(sl => (doneSlots[sl.id] || {}).started).length;
    return {
      total,
      done
    };
  }, [sessionSlots, doneSlots]);
  const [noteOpen, setNoteOpen] = useState(false);
  const [showDone, setShowDone] = useState(true);
  const scaleTop = useMemo(() => learnDropScale(selEx ? selEx.sets : [], DEFAULT_FATIGUE_K, true), [selEx]);
  const scaleChain = useMemo(() => learnDropScale(selEx ? selEx.sets : [], DEFAULT_FATIGUE_K, false), [selEx]);
  const boDayStr = new Date(tsFromDateStr(logDate)).toDateString();
  // A back-off can be run as a linked variation. Fatigue still chains off the main lift's
  // spent capacity; the load is then scaled by how that variation measures up to the main.
  const boFamily = sel ? [sel].concat(Object.keys(state.exercises).filter(n => state.exercises[n].parent === sel)) : [];
  const ratioOf = n => n === sel ? 1 : models[n] && models[n].ratio || state.exercises[n] && state.exercises[n].ratio || 1;
  // With a plan, the session already said what this set asks for and the panel
  // is a correction you rarely need. Without one, it is the only way to say what
  // you are doing — so off-plan it starts open rather than hiding behind a tap.
  useEffect(() => {
    setBoDraft(null);
    setTargetOpen(sessionSlots.length === 0);
  }, [sel]);
  // Every back-off carries its OWN prescription — reps, intensity, and which lift in the
  // family it runs on — so a session can descend (5 @ 8, then 4 @ 6, then a single on a
  // paused variation) without rewriting one shared target between sets. A slot you have
  // never touched inherits the slot before it, and the first falls back to the card
  // defaults, which is also what the block planner writes.
  const boSteps = Array.isArray(bo.steps) ? bo.steps : [];
  const stepAt = i => {
    let s = {
      reps: bo.reps,
      rpe: bo.rpe,
      pct: boPct,
      lift: null
    };
    for (let k = 0; k <= i; k++) if (boSteps[k]) s = {
      ...s,
      ...boSteps[k]
    };
    return s;
  };
  const setStep = (i, patch) => {
    const next = boSteps.slice();
    while (next.length <= i) next.push(null);
    next[i] = {
      ...stepAt(i),
      ...patch
    };
    setBo({
      steps: next
    });
  };
  const todayBos = boFamily.reduce((acc, n) => acc.concat((state.exercises[n] ? state.exercises[n].sets : []).filter(x => x.backoff && new Date(x.ts).toDateString() === boDayStr).map(x => ({
    ...x,
    lift: n
  }))), []).sort((a, b) => a.ts - b.ts);
  const doneCount = todayBos.length;
  const lastBo = doneCount ? todayBos[doneCount - 1] : null;
  const boStep = stepAt(doneCount);
  const boReps = boStep.reps,
    boRpe = boStep.rpe,
    boStepPct = boStep.pct || boPct;
  // a remembered variation only applies while it is still part of this lift's family
  const boTarget = boStep.lift && state.exercises[boStep.lift] && boFamily.indexOf(boStep.lift) >= 0 ? boStep.lift : sel;
  // the driving set, always normalised into MAIN-lift terms so the chain stays comparable
  const topToday = (selEx ? selEx.sets : []).filter(x => !x.backoff && new Date(x.ts).toDateString() === boDayStr).pop();
  // Where this movement stands against what was asked for.
  const setsAsked = straightCount || 1 + Math.max(0, bo.sets || 0);
  const setsIn = (topToday ? 1 : 0) + doneCount;
  const prevForBo = (() => {
    if (lastBo) return {
      implied: e1rmFromSet(lastBo.weight, lastBo.reps, lastBo.rpe) / (ratioOf(lastBo.lift) || 1),
      reps: lastBo.reps,
      rpe: lastBo.rpe,
      ts: lastBo.ts
    };
    if (topToday) return {
      implied: e1rmFromSet(topToday.weight, topToday.reps, topToday.rpe),
      reps: topToday.reps,
      rpe: topToday.rpe,
      ts: topToday.ts
    };
    if (effE1rm != null) return {
      implied: effE1rm,
      reps: tReps,
      rpe: tRpe
    };
    return null;
  })();
  // Everything this lift has already cost today, so the next set is priced against
  // one more set's worth of fatigue rather than a fresh set's worth. The anchor is
  // still the set you actually lifted — the observation stays in charge of the level,
  // the model only says how much further it falls.
  const chainToday = boFamily.reduce((acc, n) => acc.concat((state.exercises[n] ? state.exercises[n].sets : []).filter(x => new Date(x.ts).toDateString() === boDayStr).map(x => ({
    ...x,
    lift: n,
    ex: n
  }))), []).sort((a, b) => a.ts - b.ts);
  // What you have already put in today, for this lift and its variations. Read off the
  // log rather than off what happened in this page's lifetime, so it is still here
  // after the screen locks and you come back to it between sets.
  const lastToday = chainToday.length ? chainToday[chainToday.length - 1] : null;
  // The whole session, not just the lift on screen. Train is where the day happens,
  // so what you did an hour ago under a different movement still belongs here — and
  // it is the one place a set is always one tap from its camera.
  const sessionToday = useMemo(() => Object.entries(state.exercises || {}).reduce((acc, [n, ex]) => acc.concat((ex.sets || []).filter(x => new Date(x.ts).toDateString() === boDayStr).map(x => ({
    ...x,
    lift: n,
    ex: n
  }))), []).sort((a, b) => a.ts - b.ts), [state.exercises, boDayStr]);
  const stimBefore = chainToday.slice(0, -1).reduce((a, x, i) => a + fatigueDrop(x.reps, x.rpe, DEFAULT_FATIGUE_K) * (i === 0 && !x.backoff ? scaleTop : scaleChain), 0);
  const boSug = (() => {
    const r = ratioOf(boTarget) || 1;
    if (percentMode) return ref != null ? roundTo(ref * (boStepPct / 100) * r, round) : null;
    if (!prevForBo) return null;
    const stim = fatigueDrop(prevForBo.reps, prevForBo.rpe, DEFAULT_FATIGUE_K) * (lastBo ? scaleChain : scaleTop);
    const effCap = prevForBo.implied * (1 - marginalFade(stimBefore, stim));
    return roundTo(weightForTarget(effCap * r, boReps, boRpe), round);
  })();
  // What the prescription says this set should feel like: the target RPE directly, or in
  // percentage mode the effort that load works out to against the current estimate.
  const boBaseRpe = (() => {
    if (!percentMode) return boRpe;
    if (effE1rm != null && boSug != null) return Math.max(1, Math.min(10, 10 - (repsAtPct(boSug / effE1rm * 100) - boReps)));
    return 9;
  })();
  /* The weight is a free-text draft; `feel` is a signed effort nudge for a set that
     landed harder or easier than asked. Keeping them apart means correcting how a set
     felt never quietly moves the load you actually lifted. Both live on one draft,
     because there is only ever one set being logged. */
  /* ------------------------------ the next set -----------------------------
     A top set into back-offs and five sets across are the same thing in different
     numbers: a list of sets, each with its own reps and effort. So there is one
     card, and it walks that list. "Top set" survives as what the first set asks
     for when the plan asks something different of it — not as a second screen. */
  // Does the plan ask something different of the first set? That is the whole of
  // what "top set" means now, and it is the only reason to label a set at all.
  const stepsDiffer = !!(activeSlot && activeSlot.bo) || !activeSlot && setsAsked > 1 && (tReps !== boReps || Math.abs(tRpe - boRpe) > 0.01);
  /* Opening a lift with no idea what you did last time is how people repeat a bad
     session. The best set of the last day you trained it — best meaning the one that
     implied the most, same rule the estimate uses — plus how many sets it took. */
  /* This lift, and only this lift. It used to read the whole family, so a deadlift
     day opened showing last week's pause deadlift as "last time" — a lighter bar on
     a different movement, offered as the thing to beat. A variation is its own lift
     with its own history; the family shares an estimate, it does not share a last
     session. */
  const lastTime = useMemo(() => {
    const fam = sel ? [sel] : [];
    const byDay = new Map();
    for (const n of fam) {
      for (const x of (state.exercises[n] || {}).sets || []) {
        if (x.secs != null) continue;
        const k = new Date(x.ts).toDateString();
        if (k === boDayStr) continue; // today is not last time
        if (x.ts >= tsFromDateStr(logDate)) continue; // nor anything after it
        const row = byDay.get(k) || {
          ts: 0,
          n: 0,
          best: null,
          bestE: -1,
          sets: []
        };
        row.n += 1;
        row.ts = Math.max(row.ts, x.ts);
        row.sets.push({
          ...x,
          lift: n
        });
        const e = e1rmFromSet(x.weight, x.reps, x.rpe);
        if (e > row.bestE) {
          row.bestE = e;
          row.best = {
            ...x,
            lift: n
          };
        }
        byDay.set(k, row);
      }
    }
    const days = [...byDay.values()].sort((a, b) => b.ts - a.ts);
    if (!days.length) return null;
    days[0].sets.sort((a, b) => a.ts - b.ts); // the order you actually did them
    return days[0];
  }, [state.exercises, boDayStr, logDate, sel]);

  // The day as a row of chips: every programmed movement, plus whatever you are
  // actually on if you have wandered off the plan.
  // Who is paired with whom. The plan has carried this all along — it is drawn in
  // Plan and in the session list — but the one screen you actually train from
  // said nothing, so a superset looked like two unrelated movements in a row.
  const slotTags = useMemo(() => {
    const m = {};
    for (const d of decorateSlots(sessionSlots)) m[d.sl.id] = d;
    return m;
  }, [sessionSlots]);
  const activeTag = activeSlot ? slotTags[activeSlot.id] : null;
  const supersetWith = useMemo(() => {
    if (!activeTag || !activeTag.grouped) return [];
    const grp = groupSlots(sessionSlots).find(g => g.some(x => x.id === activeSlot.id)) || [];
    return grp.filter(x => x.id !== activeSlot.id);
  }, [activeTag, sessionSlots, activeSlot]);
  const stripMoves = useMemo(() => {
    const out = sessionSlots.map(sl => {
      const pr = doneSlots[sl.id] || {
        n: 0,
        total: 1,
        done: false
      };
      const d = slotTags[sl.id];
      return {
        id: sl.id,
        ex: sl.ex,
        short: shortLift(sl.ex),
        hue: hueFor(sl.ex, state),
        tag: d && d.grouped ? d.tag : null,
        tagFirst: !!(d && d.grouped && d.first),
        tagLast: !!(d && d.grouped && d.last),
        n: pr.n,
        total: pr.total,
        done: pr.done,
        slot: sl
      };
    });
    if (sel && !out.some(m => m.ex === sel)) {
      const n = sessionToday.filter(x => x.lift === sel).length;
      out.unshift({
        id: "free-" + sel,
        ex: sel,
        short: shortLift(sel),
        hue: hueFor(sel, state),
        n,
        total: Math.max(n + 1, 1),
        done: false,
        slot: null
      });
    }
    return out;
  }, [sessionSlots, doneSlots, sel, sessionToday, state.exercises, slotTags]);

  // Two handicaps multiply into one figure on the bar, so that is the figure shown.
  const trimTotal = 1 - (1 - recovery.drop) * condFactor;
  /* Biggest cause first. Listing them in a fixed order meant the line could lead
     with a 0.6% contributor and bury the 6% one under "+1 more", which reads as
     the app blaming the wrong thing — and is how you end up doubting a number
     that was right. */
  const trimWhy = [{
    w: recovery.carryDrop,
    show: recovery.carry && recovery.carryDrop >= 0.005,
    t: recovery.carry ? `${recovery.carry.sets} ${recovery.carry.from} set${recovery.carry.sets === 1 ? "" : "s"} earlier today` : ""
  }, {
    w: recovery.priorDrop,
    show: recovery.priorDrop >= 0.005,
    t: `RPE ${fmt(recovery.peak)} ${recovery.from || sel} session ${recovery.days}d ago`
  }, {
    w: 1 - condFactor,
    show: condFactor < 0.999,
    t: condWhy
  }].filter(x => x.show && x.t).sort((a, b) => b.w - a.w).map(x => x.t);
  const [whyTrim, setWhyTrim] = useState(false);
  const onFirst = setsIn === 0;
  const stepTarget = onFirst ? sel : boTarget;
  // Bodyweight movements put the number in the box on TOP of what you carry.
  const bwMove = isBodyweightMove(stepTarget, state);
  const bwBaseNow = bwMove ? bwBaseFor(stepTarget, state, unit) : null;
  const bwReady = bwBaseNow != null;
  /* An AMRAP is the LAST set of the movement, not every set: the earlier ones
     set the load, the last one spends it. Reps stay whatever you type; the
     effort pins to 0 RIR because that is what "as many as possible" means. */
  /* THE SET LEDGER. The card answers "what do I do now" and never answered
     "where am I" — the strip tracks movements, not sets, so a session's shape
     lived nowhere. One row per planned set, target beside actual.
      Future rows show the prescription and NOT a weight, on purpose: the load
     for set 4 depends on the fatigue sets 1 to 3 have not generated yet.
     Printing a number there would be inventing one. */
  const ledger = useMemo(() => {
    const logged = [...(topToday ? [{
      ...topToday,
      lift: sel
    }] : []), ...todayBos];
    const rows = [];
    for (let i = 0; i < Math.max(setsAsked, logged.length); i++) {
      const got = logged[i] || null;
      let tR,
        tI,
        lift = sel;
      if (i === 0 || straightCount) {
        tR = tReps;
        tI = tRpe;
      } else {
        const st = stepAt(i - 1);
        tR = st.reps;
        tI = st.rpe;
        lift = st.lift || sel;
      }
      rows.push({
        i,
        got,
        tReps: tR,
        tRpe: tI,
        lift,
        amrap: !!(activeSlot && activeSlot.amrap && (activeSlot.amrap === "all" || i + 1 >= setsAsked)),
        extra: i >= setsAsked
      });
    }
    return rows;
  }, [topToday, todayBos, setsAsked, straightCount, tReps, tRpe, boSteps, bo, sel, activeSlot]);
  const drift = useMemo(() => sel ? rpeDrift(state, sel, 28) : null, [state.exercises, sel]);
  const dayProgress = useMemo(() => {
    let done = 0,
      total = 0;
    for (const sl of sessionSlots) {
      const pr = doneSlots[sl.id] || {
        n: 0,
        total: slotSetCount(sl)
      };
      total += pr.total;
      done += Math.min(pr.n, pr.total);
    }
    return {
      done,
      total,
      left: Math.max(0, total - done),
      pct: total ? done / total : 0
    };
  }, [sessionSlots, doneSlots]);
  const amrapSet = !!(activeSlot && activeSlot.amrap && (activeSlot.amrap === "all" || setsIn + 1 >= setsAsked));
  // Arriving on the AMRAP set, the effort box should already say what the set is.
  useEffect(() => {
    if (amrapSet) setActInt(inputMode === "rir" ? 0 : 10);
  }, [amrapSet, inputMode]);
  const curReps = onFirst ? tReps : boReps;
  // The effort this set asks for, in whatever language the screen is speaking.
  const curIntVal = percentMode ? onFirst ? topPct : boStepPct : onFirst ? tInt : inputMode === "rir" ? 10 - boRpe : boRpe;
  const setCurReps = v => {
    const n = Math.max(1, Math.min(30, v));
    if (onFirst) {
      setTReps(n);
    } else setStep(doneCount, {
      reps: n
    });
  };
  const setCurInt = v => {
    if (percentMode) {
      const n = Math.max(30, Math.min(105, v));
      if (onFirst) setTopPct(n);else setStep(doneCount, {
        pct: n
      });
      return;
    }
    const n = inputMode === "rir" ? Math.max(0, Math.min(5, v)) : Math.max(5, Math.min(10, v));
    if (onFirst) setTInt(n);else setStep(doneCount, {
      rpe: inputMode === "rir" ? 10 - n : n
    });
  };
  const suggested = onFirst ? recR : boSug;
  // Four figures on a phone is a different size from three.
  const heroStr = suggested != null ? fmt(suggested) : "";
  const heroSize = heroStr.length >= 6 ? 42 : heroStr.length === 5 ? 50 : heroStr.length === 4 ? 55 : 62;
  // What the prescription says this set should feel like. In percentage mode that is
  // whatever the load works out to against the current estimate.
  const curBaseRpe = onFirst ? percentMode ? predRpe != null ? predRpe : 8 : tRpe : boBaseRpe;
  /* What the set ASKED for and what you DID are two different things, and they were
     sharing one pair of steppers. Getting eight when the plan said five is not a
     change of plan — but it moved the suggested load, because the same numbers were
     driving both. So the target stays where the plan put it and keeps owning the
     suggestion, and the actuals below are free to say whatever happened. */
  const actReps = boDraft && boDraft.reps != null ? boDraft.reps : curReps;
  // Effort is always rated in RPE/RIR, even when the target was written as a
  // percentage — you cannot come back from a set having "done 85%".
  const prescribedInt = percentMode ? inputMode === "rir" ? Math.max(0, Math.round((10 - curBaseRpe) * 2) / 2) : Math.round(curBaseRpe * 2) / 2 : curIntVal;
  const actIntVal = boDraft && boDraft.int != null ? boDraft.int : prescribedInt;
  const curRpe = Math.max(5, Math.min(10, inputMode === "rir" ? 10 - actIntVal : actIntVal));
  const curWeight = boDraft && boDraft.weight != null ? boDraft.weight : suggested != null ? String(suggested) : "";
  const weightDirty = !!(boDraft && boDraft.weight != null);
  const actDirty = !!(boDraft && (boDraft.weight != null || boDraft.reps != null || boDraft.int != null));
  const offTarget = actReps !== curReps || Math.abs(actIntVal - prescribedInt) > 0.01 || weightDirty && suggested != null && Math.abs(parseFloat(curWeight) - suggested) > 0.01;
  const setCurWeight = v => setBoDraft({
    ...(boDraft || {}),
    weight: v
  });
  const setActReps = v => setBoDraft({
    ...(boDraft || {}),
    reps: Math.max(1, Math.min(50, v))
  });
  const setActInt = v => setBoDraft({
    ...(boDraft || {}),
    int: inputMode === "rir" ? Math.max(0, Math.min(5, v)) : Math.max(5, Math.min(10, v))
  });
  const backToTarget = () => setBoDraft(null);
  const logCurrent = () => {
    if (!stepTarget) return;
    // An empty box on a bodyweight movement means "just me" — which is a whole
    // set, not a missing number.
    const raw = String(curWeight == null ? "" : curWeight).trim();
    const typed = raw === "" ? bwMove ? 0 : NaN : parseFloat(raw);
    if (!isFinite(typed) || typed < 0) return;
    // On a bodyweight movement the number in the box is what you ADDED, so zero
    // is a complete, loggable set rather than a missing one.
    const bwBase = bwMove ? bwBaseFor(stepTarget, state, unit) : null;
    const w = bwBase != null ? bwBase + typed : typed;
    if (w <= 0) return;
    const cf = conditionFactor(dayCheckin, liftClass(stepTarget));
    logSet(stepTarget, {
      id: uid(),
      weight: roundTo(w, round),
      reps: actReps,
      rpe: curRpe,
      ts: tsFromDateStr(logDate),
      backoff: !onFirst,
      // Kept so the set can be shown as "BW + 25" rather than a bare total, and
      // so a later weigh-in never rewrites what this day actually was.
      bwBase: bwBase != null ? roundTo(bwBase, round) : undefined,
      added: bwBase != null ? typed : undefined,
      // The target is kept beside what happened, which is what the calibration reads.
      fromRec: !actDirty,
      tReps: curReps,
      tRpe: Math.round(curBaseRpe * 2) / 2,
      rec: suggested != null ? suggested : roundTo(w, round),
      note: note.trim() || undefined,
      cond: cf < 1 ? cf : undefined,
      // Work earlier in the day handicaps every set of this lift, not just the first.
      carry: recovery.carryDrop > 0.004 ? 1 - recovery.carryDrop : undefined
    });
    setBoDraft(null);
    setNote("");
    setNoteOpen(false);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 1400);
  };

  // A programmed session IS a list of lifts to start from, so someone who built a
  // block before ever logging a set should land on their session rather than on a
  // blank "add your first lift" — tapping a movement creates it anyway.
  if (names.length === 0 && sessionSlots.length > 0) return /*#__PURE__*/React.createElement(Card, {
    accent: C.amber
  }, /*#__PURE__*/React.createElement(SectionHead, {
    accent: C.amber,
    sub: "Tap a movement to start it \u2014 IRONSET creates the lift and calibrates from your first set."
  }, progWeek ? progWeek + " · " + dayKeyFor(logDate) : "Today's session"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, decorateSlots(sessionSlots).map(d => /*#__PURE__*/React.createElement(React.Fragment, {
    key: d.sl.id
  }, d.grouped && d.first && /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      color: C.blue,
      margin: "4px 0 -2px 2px"
    }
  }, "Superset ", d.tag.charAt(0), d.rounds ? ` · ${d.rounds} round${d.rounds > 1 ? "s" : ""}` : ""), /*#__PURE__*/React.createElement("button", {
    onClick: () => loadSlot(d.sl),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginLeft: d.grouped ? 10 : 0,
      borderLeft: d.grouped ? `2px solid ${C.blue}` : undefined,
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.line}`,
      borderRadius: 12,
      padding: "11px 13px",
      cursor: "pointer",
      textAlign: "left",
      color: C.text,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 800,
      fontSize: 13
    }
  }, d.grouped ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10.5,
      color: C.blue,
      marginRight: 6
    }
  }, d.tag) : null, d.sl.ex), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO,
      fontSize: 11,
      color: C.muted,
      marginTop: 2
    }
  }, slotSummary(d.sl))))))));
  if (names.length === 0) return /*#__PURE__*/React.createElement(Card, {
    style: {
      textAlign: "center",
      padding: "26px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      fontSize: 18,
      marginBottom: 6
    }
  }, "Add your first lift"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 13.5,
      marginBottom: 18,
      lineHeight: 1.5
    }
  }, "Pick one to start. Log any set \u2014 a known 1RM or a working set \u2014 and IRONSET calibrates your strength from it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: "center",
      marginBottom: 14
    }
  }, PRESETS.map(p => /*#__PURE__*/React.createElement(Chip, {
    key: p,
    onClick: () => addExercise(p)
  }, p))), /*#__PURE__*/React.createElement(AddRow, {
    newName,
    setNewName,
    addExercise,
    mains
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 12,
      paddingTop: 4,
      background: "rgba(6,7,11,0.86)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      margin: "0 -16px",
      padding: "6px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDateOpen(v => !v),
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5,
      color: backdated ? C.gold : C.muted
    }
  }, backdated ? dayStart(logDate).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  }) : sessionSlots.length ? progWeek ? progWeek + " · " + dayKeyFor(logDate) : "Today" : "Training"), /*#__PURE__*/React.createElement(ChevronDown, {
    size: 11,
    style: {
      color: backdated ? C.gold : C.faint,
      transform: dateOpen ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  })), sessionSlots.length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => openDayTools && openDayTools(logDate),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontWeight: 800,
      fontSize: 11,
      cursor: "pointer",
      padding: 0,
      marginLeft: "auto",
      WebkitTapHighlightColor: "transparent"
    }
  }, "Edit day")), sessionSlots.length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setDayOpen(true),
    "aria-label": "Show the whole session",
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "none",
      border: "none",
      padding: "0 0 9px",
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      height: 3,
      borderRadius: 2,
      background: "rgba(255,255,255,0.08)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height: "100%",
      borderRadius: 2,
      width: `${Math.max(dayProgress.done ? 4 : 0, Math.round(dayProgress.pct * 100))}%`,
      background: dayProgress.left === 0 ? C.good : G.red,
      transition: "width .35s ease"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      fontWeight: 800,
      flexShrink: 0,
      letterSpacing: "0.03em",
      color: dayProgress.left === 0 ? C.good : C.muted
    }
  }, dayProgress.left === 0 ? "SESSION DONE" : `${dayProgress.done}/${dayProgress.total} SETS`), /*#__PURE__*/React.createElement(ChevronDown, {
    size: 11,
    style: {
      color: C.faint,
      flexShrink: 0,
      transform: "rotate(-90deg)"
    }
  })), dateOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      alignItems: "center",
      flexWrap: "wrap",
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: !backdated,
    onClick: () => {
      setLogDate(todayStr());
      setDateOpen(false);
    }
  }, "Today"), /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: logDate === addDays(todayStr(), -1),
    onClick: () => {
      setLogDate(addDays(todayStr(), -1));
      setDateOpen(false);
    }
  }, "Yesterday"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: logDate,
    max: todayStr(),
    onChange: e => setLogDate(e.target.value || todayStr()),
    style: {
      flex: "1 1 140px",
      minWidth: 0,
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line}`,
      borderRadius: R.input,
      padding: "0 11px",
      height: 38,
      color: C.text,
      fontFamily: MONO,
      fontSize: 13,
      fontWeight: 700,
      outline: "none",
      colorScheme: "dark"
    }
  })), /*#__PURE__*/React.createElement(MoveStrip, {
    moves: stripMoves,
    current: sel,
    onAdd: () => setPickingLift(true),
    addLabel: sessionSlots.length ? "Another lift" : "Switch lift",
    onPick: m => m.slot ? loadSlot(m.slot) : setSel(m.ex)
  })), spread && /*#__PURE__*/React.createElement(Card, {
    accent: C.blue,
    style: {
      padding: "13px 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9,
      color: C.blue,
      marginBottom: 6
    }
  }, "Carry this forward?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.text,
      lineHeight: 1.5
    }
  }, spread.patch.ex ? /*#__PURE__*/React.createElement(React.Fragment, null, "Swapped to ", /*#__PURE__*/React.createElement("b", null, shortLift(spread.patch.ex)), ". ", spread.n, " later session", spread.n === 1 ? "" : "s", " in this block still ", spread.n === 1 ? "asks" : "ask", " for ", shortLift(spread.fromEx), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, "Changed ", /*#__PURE__*/React.createElement("b", null, Object.keys(spread.patch).map(k => k === "amrap" ? "AMRAP" : k).join(", ")), " on ", shortLift(spread.fromEx), ". ", spread.n, " later session", spread.n === 1 ? "" : "s", " in this block use it too.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 11,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    style: {
      flex: "1 1 auto",
      minHeight: 40,
      fontSize: 12.5
    },
    onClick: () => {
      applyAhead(spread.fromEx, spread.patch, false);
      setSpread(null);
    }
  }, "Rest of the block"), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    style: {
      minHeight: 40,
      fontSize: 12.5
    },
    onClick: () => setSpread(null)
  }, "Just today")), Object.keys(spread.patch).some(k => WAVE_FIELDS.indexOf(k) >= 0) && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      applyAhead(spread.fromEx, spread.patch, true);
      setSpread(null);
    },
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontWeight: 700,
      fontSize: 11.5,
      cursor: "pointer",
      padding: "9px 0 0"
    }
  }, "\u2026and copy the numbers, flattening the wave"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 8,
      lineHeight: 1.45
    }
  }, "Reps, sets and effort stay as each week has them \u2014 that is the block doing its job.")), backdated && /*#__PURE__*/React.createElement(Callout, {
    tone: "warn"
  }, "Logging to ", dayStart(logDate).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  }), ", not today.", /*#__PURE__*/React.createElement("button", {
    onClick: () => setLogDate(todayStr()),
    style: {
      background: "none",
      border: "none",
      color: C.gold,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: "0 0 0 8px"
    }
  }, "Back to today")), meetDays != null && meetDays >= 0 && meetDays <= 21 && /*#__PURE__*/React.createElement(Callout, {
    tone: "warn"
  }, meetDays === 0 ? "Meet day" : `${meetDays} day${meetDays === 1 ? "" : "s"} to ${meetName || "your meet"}`, meetDays > 0 ? " — openers and taper matter more than another hard session now." : ""), timedSel ? /*#__PURE__*/React.createElement(TimedLogger, {
    state,
    sel,
    logSet,
    logDate,
    setLogDate,
    unit,
    slot: timedSlot
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    accent: selHue,
    glow: "none",
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPickingLift(true),
    "aria-label": `${sel} — tap to change lift`,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      maxWidth: "100%",
      background: tint(selHue, 0.14),
      border: `1px solid ${tint(selHue, 0.42)}`,
      borderRadius: R.pill,
      padding: "7px 12px 7px 14px",
      cursor: "pointer",
      color: C.text,
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 18,
      letterSpacing: "-0.025em",
      lineHeight: 1.15,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, sel), /*#__PURE__*/React.createElement(ChevronDown, {
    size: 14,
    style: {
      color: C.muted,
      flexShrink: 0
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginTop: 7
    }
  }, activeTag && activeTag.grouped ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      color: selHue
    }
  }, activeTag.tag, " \xB7 ") : null, setsAsked > 1 ? `Set ${Math.min(setsIn + 1, setsAsked)} of ${setsAsked}` : "Your set", stepsDiffer ? ` · ${onFirst ? "Top set" : `Back-off ${doneCount + 1}`}` : "", stepTarget !== sel ? ` · ${shortLift(stepTarget)}` : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: inferred ? C.gold : C.faint,
      fontSize: 8.5
    }
  }, inferred ? `From ${shortLift(inferred.parent)}` : accMode ? "Working" : "Est. 1RM"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 700,
      color: C.muted,
      marginTop: 3,
      fontVariantNumeric: "tabular-nums"
    }
  }, accMode ? accWork != null ? fmt(roundTo(accWork, round)) : "—" : e1rm != null ? fmt(roundTo(e1rm, round)) : "—"))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      margin: "13px -16px 0",
      padding: "16px 16px 5px",
      borderTop: `1px solid ${C.line}`,
      background: `linear-gradient(180deg, ${tint(selHue, 0.13)}, transparent 78%)`
    }
  }, suggested != null ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: heroSize,
      fontWeight: 700,
      lineHeight: 1,
      color: C.text,
      letterSpacing: "-0.035em",
      paddingRight: Math.round(heroSize * 0.035),
      fontVariantNumeric: "tabular-nums",
      textShadow: `0 0 54px ${tint(selHue, 0.5)}`
    }
  }, heroStr), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 18,
      color: C.muted,
      fontWeight: 700,
      letterSpacing: "-0.01em"
    }
  }, unit)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTargetOpen(v => !v),
    style: {
      marginTop: 11,
      background: targetOpen ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${targetOpen ? C.line2 : C.line}`,
      borderRadius: R.pill,
      color: C.text,
      cursor: "pointer",
      padding: "8px 13px",
      fontFamily: SANS,
      fontSize: 13.5,
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      WebkitTapHighlightColor: "transparent"
    }
  }, amrapSet ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.red
    }
  }, "AMRAP") : null, amrapSet ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted,
      fontWeight: 600
    }
  }, "from") : null, curReps, " rep", curReps > 1 ? "s" : "", " @ ", percentMode ? `${fmt(curIntVal)}%` : inputMode === "rir" ? `${fmt(curIntVal)} RIR` : `RPE ${fmt(curIntVal)}`, setsAsked > 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted,
      fontWeight: 600
    }
  }, "\xB7 ", setsAsked, " sets") : null, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 13,
    style: {
      color: C.muted,
      transform: targetOpen ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.muted,
      fontSize: 13.5,
      padding: "10px 6px",
      lineHeight: 1.5
    }
  }, "Log a set to calibrate ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.text
    }
  }, sel), ". A known 1RM or any working set will do."), activeSlot && /*#__PURE__*/React.createElement("button", {
    onClick: () => setTargetOpen(v => !v),
    style: {
      marginTop: 2,
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${C.line}`,
      borderRadius: R.pill,
      color: C.muted,
      cursor: "pointer",
      padding: "7px 13px",
      fontFamily: SANS,
      fontSize: 12.5,
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      WebkitTapHighlightColor: "transparent"
    }
  }, curReps, " rep", curReps > 1 ? "s" : "", " @ ", percentMode ? `${fmt(curIntVal)}%` : inputMode === "rir" ? `${fmt(curIntVal)} RIR` : `RPE ${fmt(curIntVal)}`, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 12,
    style: {
      color: C.faint,
      transform: targetOpen ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  })))), targetOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${C.line2}`,
      borderRadius: R.ctrl,
      padding: 12,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginBottom: 9
    }
  }, "What this set asks for"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, "Reps"), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: curReps,
    onChange: setCurReps,
    min: 1,
    max: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, percentMode ? "% of max" : inputMode === "rir" ? "RIR" : "RPE"), percentMode ? /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: curIntVal,
    onChange: setCurInt,
    step: 2.5,
    min: 30,
    max: 105,
    suffix: "%"
  }) : /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: curIntVal,
    onChange: setCurInt,
    step: 0.5,
    min: inputMode === "rir" ? 0 : 5,
    max: inputMode === "rir" ? 5 : 10
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, "Sets"), /*#__PURE__*/React.createElement(Stepper, {
    compact: true,
    value: setsAsked,
    min: Math.max(1, setsIn),
    max: 12,
    onChange: v => {
      const n = Math.max(1, Math.min(12, v));
      if (straightCount) patchSlotSpread(activeSlot.id, {
        sets: n
      }, activeSlot.ex);else {
        setBo({
          sets: Math.max(0, n - 1)
        });
        if (activeSlot && activeSlot.bo) patchSlotSpread(activeSlot.id, {
          bo: {
            ...activeSlot.bo,
            sets: Math.max(0, n - 1)
          }
        }, activeSlot.ex);
      }
    }
  }))), activeSlot && !timedSel && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13,
      paddingTop: 12,
      borderTop: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 7,
      fontWeight: 700
    }
  }, "Take sets to failure?"), /*#__PURE__*/React.createElement(Segmented, {
    value: activeSlot.amrap || "off",
    onChange: v => patchSlotSpread(activeSlot.id, {
      amrap: v === "off" ? undefined : v
    }, activeSlot.ex),
    options: [{
      value: "off",
      label: "No"
    }, {
      value: "last",
      label: "Last set"
    }, {
      value: "all",
      label: "Every set"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      lineHeight: 1.5,
      marginTop: 8
    }
  }, activeSlot.amrap ? /*#__PURE__*/React.createElement(React.Fragment, null, activeSlot.amrap === "all" ? "Every set runs" : "The last set runs", " until the reps run out \u2014 nothing left in the tank. The", " ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.muted
    }
  }, curReps, " @ ", percentMode ? `${fmt(curIntVal)}%` : inputMode === "rir" ? `${fmt(curIntVal)} RIR` : `RPE ${fmt(curIntVal)}`), " ", "above is only how the bar gets loaded, and that choice is the whole session: failure on a 3-rep weight and failure on an 8-rep weight are two different workouts.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Sets stop at the ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.muted
    }
  }, curReps, " @ ", percentMode ? `${fmt(curIntVal)}%` : inputMode === "rir" ? `${fmt(curIntVal)} RIR` : `RPE ${fmt(curIntVal)}`), " ", "written above. Switch this on and that stays exactly how the bar gets loaded \u2014 you simply do not stop there."))), !onFirst && boFamily.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginTop: 11
    }
  }, boFamily.map(n => /*#__PURE__*/React.createElement(Chip, {
    key: n,
    sm: true,
    active: n === stepTarget,
    onClick: () => setStep(doneCount, {
      lift: n === sel ? null : n
    })
  }, n === sel ? shortLift(n) : `${shortLift(n)} · ${Math.round(ratioOf(n) * 100)}%`)))), amrapSet && /*#__PURE__*/React.createElement(Callout, {
    tone: "bad"
  }, "To failure \u2014 keep going until the reps stop.", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint,
      fontWeight: 600
    }
  }, " The bar was loaded for ", curReps, " @ ", percentMode ? `${fmt(curIntVal)}%` : inputMode === "rir" ? `${fmt(curIntVal)} RIR` : `RPE ${fmt(curIntVal)}`, "; how many you actually get is the point of the set. Log the real number.")), drift && (drift.over || drift.under) && /*#__PURE__*/React.createElement(Callout, {
    tone: drift.over ? "warn" : "info"
  }, drift.over ? /*#__PURE__*/React.createElement(React.Fragment, null, "You run this ", fmt(Math.round(drift.bias * 10) / 10), " RPE above what it asks for") : /*#__PURE__*/React.createElement(React.Fragment, null, "You run this ", fmt(Math.round(-drift.bias * 10) / 10), " RPE below what it asks for"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint,
      fontWeight: 600
    }
  }, " ", "\u2014 across ", drift.n, " sets this month.", drift.over ? " That effort is what gets trimmed off the lifts after it." : " There is room to add load.")), inferred && /*#__PURE__*/React.createElement(Callout, {
    tone: "warn"
  }, "First time on this \u2014 ", fmt(roundTo(e1rm || 0, round)), " is your ", inferred.parent, " at ", inferred.pct, "%, not anything you have lifted.", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint,
      fontWeight: 600
    }
  }, " Treat set 1 as a feeler; it corrects the moment you log one.")), supersetWith.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 11,
      flexWrap: "wrap",
      padding: "9px 11px",
      borderRadius: R.ctrl,
      background: tint(C.blue, 0.07),
      border: `1px solid ${tint(C.blue, 0.26)}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: C.blue,
      fontSize: 9
    }
  }, "Superset"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: C.muted,
      fontWeight: 600
    }
  }, "alternate with"), supersetWith.map(x => /*#__PURE__*/React.createElement("button", {
    key: x.id,
    onClick: () => loadSlot(x),
    style: {
      cursor: "pointer",
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${C.line2}`,
      borderRadius: R.pill,
      padding: "5px 11px",
      color: C.text,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 12,
      WebkitTapHighlightColor: "transparent"
    }
  }, slotTags[x.id] ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10,
      color: C.faint,
      marginRight: 5
    }
  }, slotTags[x.id].tag) : null, shortLift(x.ex))), activeTag && activeTag.rounds ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginLeft: "auto",
      fontFamily: MONO
    }
  }, activeTag.rounds, " rounds") : null), onFirst && lastTime && lastTime.best || !onFirst && prevForBo && !percentMode || trimTotal >= 0.005 || onFirst && !percentMode && (strongDay || toughDay) ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      marginTop: 11
    }
  }, onFirst && lastTime && lastTime.best && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setLastOpen(v => !v),
    style: {
      background: "none",
      border: "none",
      padding: 0,
      display: "block",
      width: "100%",
      textAlign: "left",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Callout, {
    tone: "info"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block"
    }
  }, "Last time ", loadLabel(lastTime.best, unit), " \xD7 ", lastTime.best.reps, " @ ", inputMode === "rir" ? `${fmt(10 - lastTime.best.rpe)} RIR` : `RPE ${fmt(lastTime.best.rpe)}`), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: C.faint,
      fontWeight: 600,
      fontSize: 11,
      marginTop: 2
    }
  }, dshort(lastTime.ts), lastTime.n > 1 && /*#__PURE__*/React.createElement(React.Fragment, null, ` · ${lastTime.n} sets that day`, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 12,
    style: {
      marginLeft: 4,
      verticalAlign: "-2px",
      transform: lastOpen ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  }))))), lastOpen && lastTime.n > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1px solid ${C.line}`,
      borderRadius: R.ctrl,
      overflow: "hidden"
    }
  }, lastTime.sets.map((x, i) => /*#__PURE__*/React.createElement("div", {
    key: x.id || i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      borderTop: i ? `1px solid ${C.line}` : "none",
      background: x.id === lastTime.best.id ? tint(C.blue, 0.06) : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: C.faint,
      fontSize: 8.5,
      width: 22,
      flexShrink: 0
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 13,
      fontWeight: 700,
      flex: 1,
      minWidth: 0
    }
  }, loadLabel(x, unit), " \xD7 ", x.reps, /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted,
      fontWeight: 600
    }
  }, " @ ", inputMode === "rir" ? `${fmt(10 - x.rpe)} RIR` : `RPE ${fmt(x.rpe)}`)), /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: C.faint,
      fontSize: 8.5,
      flexShrink: 0
    }
  }, x.lift !== sel ? shortLift(x.lift) : x.backoff ? "back-off" : "top"))))), !onFirst && prevForBo && !percentMode && /*#__PURE__*/React.createElement(Callout, null, "Off your ", inputMode === "rir" ? `${fmt(10 - prevForBo.rpe)} RIR` : `RPE ${fmt(prevForBo.rpe)}`, " set", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint,
      fontWeight: 600
    }
  }, " \u2014 holding the effort brings the weight down.")), trimTotal >= 0.005 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setWhyTrim(v => !v),
    style: {
      background: "none",
      border: "none",
      padding: 0,
      display: "block",
      width: "100%",
      textAlign: "left",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Callout, {
    tone: "warn"
  }, "Trimmed ", fmt(Math.round(trimTotal * 1000) / 10), "% \u2014 ", trimWhy[0], trimWhy.length > 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint,
      fontWeight: 600
    }
  }, ` +${trimWhy.length - 1} more`) : null, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 12,
    style: {
      color: C.faint,
      marginLeft: 5,
      verticalAlign: "-1px",
      transform: whyTrim ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  }))), whyTrim && trimWhy.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 13,
      display: "flex",
      flexDirection: "column",
      gap: 5
    }
  }, trimWhy.slice(1).map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 11.5,
      color: C.faint,
      lineHeight: 1.4
    }
  }, "\xB7 ", w))), onFirst && !percentMode && (strongDay || toughDay) && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      fontFamily: MONO,
      paddingLeft: 13
    }
  }, strongDay ? `strong day ${fmt(strongDay)}` : "", strongDay && toughDay ? "  ·  " : "", toughDay ? `tough day ${fmt(toughDay)}` : "")) : null, bwMove && !bwReady && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "12px 13px",
      borderRadius: R.ctrl,
      background: tint(C.blue, 0.07),
      border: `1px solid ${tint(C.blue, 0.26)}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.text,
      fontWeight: 600,
      lineHeight: 1.45
    }
  }, shortLift(stepTarget), " is a bodyweight movement. Your bodyweight is the load, so IRONSET needs it once."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: bwEntry,
    onChange: e => setBwEntry(e.target.value),
    inputMode: "decimal",
    placeholder: `Bodyweight (${unit})`,
    style: {
      flex: 1,
      minWidth: 0,
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line}`,
      borderRadius: R.input,
      padding: "0 12px",
      height: 44,
      color: C.text,
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 700,
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    style: {
      minHeight: 44,
      fontSize: 13
    },
    disabled: !(parseFloat(bwEntry) > 0),
    onClick: () => {
      const v = parseFloat(bwEntry);
      if (!(v > 0)) return;
      setState(st => ({
        ...st,
        bodyweight: [...(st.bodyweight || []), {
          id: uid(),
          ts: Date.now(),
          kg: toKg(v, unit)
        }]
      }));
      setBwEntry("");
    }
  }, "Save"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(StatChip, {
    wide: true,
    input: true,
    value: curWeight,
    onInput: setCurWeight,
    label: bwMove ? parseFloat(curWeight) > 0 ? "Added to BW" : "Bodyweight" : weightDirty ? "Weight" : "Weight · sugg",
    tone: bwMove && !parseFloat(curWeight) ? C.muted : weightDirty ? C.text : C.muted,
    onStep: v => setCurWeight(String(Math.max(0, v))),
    step: round,
    min: 0
  }), /*#__PURE__*/React.createElement(StatChip, {
    label: "Reps",
    value: actReps,
    onStep: setActReps,
    min: 1,
    max: 50
  }), /*#__PURE__*/React.createElement(StatChip, {
    label: inputMode === "rir" ? "RIR" : "RPE",
    value: actIntVal,
    onStep: setActInt,
    step: 0.5,
    min: inputMode === "rir" ? 0 : 5,
    max: inputMode === "rir" ? 5 : 10
  })), offTarget && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 9,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 11.5,
      color: C.gold,
      fontWeight: 700
    }
  }, "off target \u2014 asked ", curReps, " \xD7 ", percentMode ? `${fmt(curIntVal)}%` : inputMode === "rir" ? `${fmt(prescribedInt)} RIR` : `RPE ${fmt(prescribedInt)}`), /*#__PURE__*/React.createElement("button", {
    onClick: backToTarget,
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontSize: 11.5,
      fontWeight: 700,
      cursor: "pointer",
      padding: 0
    }
  }, "\u21BA back to it")), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: logCurrent,
    style: {
      width: "100%",
      marginTop: 12,
      minHeight: 54,
      fontSize: 16
    },
    disabled: bwMove ? !bwReady : !parseFloat(curWeight)
  }, justLogged ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 18
  }), " Logged") : stepTarget !== sel ? `Log ${shortLift(stepTarget)}` : amrapSet ? `Log AMRAP — ${actReps} rep${actReps === 1 ? "" : "s"}` : setsAsked > 1 ? `Log set ${Math.min(setsIn + 1, setsAsked)}` : "Log set"), ledger.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13,
      border: `1px solid ${C.line}`,
      borderRadius: R.ctrl,
      overflow: "hidden"
    }
  }, ledger.map(r => {
    const now = !r.got && r.i === setsIn;
    const eff = v => percentMode ? `${fmt(v)}%` : inputMode === "rir" ? `${fmt(10 - v)} RIR` : `RPE ${fmt(v)}`;
    const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        ...label2,
        fontSize: 8.5,
        width: 16,
        flexShrink: 0,
        color: now ? selHue : r.got ? C.good : C.faint
      }
    }, r.i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontFamily: MONO,
        fontSize: 12.5,
        fontWeight: 700,
        color: r.got ? C.text : now ? C.text : C.faint,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, r.got ? /*#__PURE__*/React.createElement(React.Fragment, null, loadLabel(r.got, unit), " \xD7 ", r.got.reps, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted,
        fontWeight: 600
      }
    }, "@ ", eff(r.got.rpe)))
    /* No "×" on a set not yet done: the glyph promises a weight,
       and the weight for set 4 depends on fatigue sets 1-3 have
       not generated yet. Reps and effort only. */ : /*#__PURE__*/React.createElement(React.Fragment, null, r.amrap ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: now ? C.red : C.faint
      }
    }, "AMRAP") : `${r.tReps} reps`, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted,
        fontWeight: 600
      }
    }, "@ ", eff(r.tRpe)))), r.lift !== sel && /*#__PURE__*/React.createElement("span", {
      style: {
        ...label2,
        color: C.faint,
        fontSize: 8,
        flexShrink: 0
      }
    }, shortLift(r.lift)), now && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 11.5,
        color: selHue,
        fontWeight: 700,
        flexShrink: 0
      }
    }, suggested != null ? fmt(suggested) : "now"), r.got && /*#__PURE__*/React.createElement(Check, {
      size: 12,
      style: {
        color: C.good,
        flexShrink: 0
      }
    }));
    const sty = {
      display: "flex",
      alignItems: "center",
      gap: 9,
      width: "100%",
      padding: "8px 12px",
      borderTop: r.i ? `1px solid ${C.line}` : "none",
      textAlign: "left",
      background: now ? tint(selHue, 0.1) : r.extra ? tint(C.gold, 0.05) : "none"
    };
    return r.got ? /*#__PURE__*/React.createElement("button", {
      key: r.i,
      onClick: () => setEditing(r.got),
      style: {
        ...sty,
        border: "none",
        cursor: "pointer",
        color: C.text,
        WebkitTapHighlightColor: "transparent"
      }
    }, inner) : /*#__PURE__*/React.createElement("div", {
      key: r.i,
      style: sty
    }, inner);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
      marginTop: 12,
      flexWrap: "wrap"
    }
  }, suggested != null && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowPlates(v => !v),
    style: {
      background: "none",
      border: "none",
      color: C.muted,
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, "Plates ", /*#__PURE__*/React.createElement(ChevronDown, {
    size: 13,
    style: {
      transform: showPlates ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  })), onFirst && warmup.length > 1 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowWarm(v => !v),
    style: {
      background: "none",
      border: "none",
      color: C.muted,
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, "Warm-up ", /*#__PURE__*/React.createElement(ChevronDown, {
    size: 13,
    style: {
      transform: showWarm ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setNoteOpen(v => !v),
    style: {
      background: "none",
      border: "none",
      color: note.trim() ? selHue : C.muted,
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, note.trim() ? "Note ✓" : "Note"), lastToday && /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilming(lastToday),
    "aria-label": (state.clips || {})[lastToday.id] ? "Watch this set" : "Film this set",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 700,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      color: (state.clips || {})[lastToday.id] ? selHue : C.muted
    }
  }, (state.clips || {})[lastToday.id] ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Play, {
    size: 12
  }), " Watch last") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Camera, {
    size: 13
  }), " Film last"))), noteOpen && /*#__PURE__*/React.createElement("input", {
    value: note,
    onChange: e => setNote(e.target.value),
    placeholder: "Note (optional)",
    autoFocus: true,
    style: {
      width: "100%",
      marginTop: 10,
      background: C.bg2,
      border: `1px solid ${C.line}`,
      borderRadius: 12,
      padding: "11px 12px",
      color: C.text,
      fontFamily: SANS,
      fontSize: 14,
      outline: "none"
    }
  }), showPlates && suggested != null && /*#__PURE__*/React.createElement(PlateView, {
    total: parseFloat(curWeight) || suggested,
    bar: bar,
    denoms: denoms,
    unit: unit
  }), onFirst && showWarm && warmup.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "left",
      marginTop: 12,
      border: `1px solid ${C.line}`,
      borderRadius: R.ctrl,
      overflow: "hidden"
    }
  }, warmup.map((w, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setWarmOpen(warmOpen === i ? null : i),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "10px 13px",
      background: warmOpen === i ? "rgba(255,255,255,0.04)" : "none",
      border: "none",
      borderTop: i ? `1px solid ${C.line}` : "none",
      color: C.text,
      cursor: "pointer",
      textAlign: "left",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: C.faint,
      width: 30,
      flexShrink: 0
    }
  }, w.bar ? "BAR" : `${Math.round(w.pct * 100)}%`), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: "-0.02em",
      fontVariantNumeric: "tabular-nums"
    }
  }, fmt(w.weight), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.muted,
      marginLeft: 3
    }
  }, unit)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 12.5,
      color: C.muted
    }
  }, "\xD7 ", w.reps), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(ChevronDown, {
    size: 13,
    style: {
      color: C.faint,
      flexShrink: 0,
      transform: warmOpen === i ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  }))), warmOpen != null && warmup[warmOpen] && !warmup[warmOpen].bar && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 13px 11px"
    }
  }, /*#__PURE__*/React.createElement(PlateView, {
    total: warmup[warmOpen].weight,
    bar: bar,
    denoms: denoms,
    unit: unit
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      marginTop: 12,
      textAlign: "center",
      fontWeight: 700,
      color: setsIn >= setsAsked && setsAsked > 1 ? C.good : setsIn > 0 ? C.gold : C.faint
    }
  }, setsIn >= setsAsked && setsAsked > 1 ? `All ${setsAsked} sets in — log another, or pick the next movement above.` : setsIn > 0 ? `${setsIn} of ${setsAsked} in.` : "The day's best set is the one your estimate counts."))), sessionToday.length > 0 && /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowDone(v => !v),
    style: {
      width: "100%",
      padding: "13px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "none",
      border: "none",
      color: C.text,
      cursor: "pointer",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 13,
      borderRadius: 2,
      background: C.good,
      boxShadow: `0 0 10px ${C.good}88`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, "Logged today")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 11.5,
      color: C.faint
    }
  }, sessionToday.length, " set", sessionToday.length === 1 ? "" : "s", /*#__PURE__*/React.createElement(ChevronDown, {
    size: 14,
    style: {
      transform: showDone ? "rotate(180deg)" : "none",
      transition: ".2s"
    }
  }))), showDone && sessionToday.map(x => {
    const clip = (state.clips || {})[x.id];
    return /*#__PURE__*/React.createElement("div", {
      key: x.id,
      style: {
        padding: "10px 16px",
        borderTop: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 14,
        fontWeight: 600
      }
    }, x.secs != null ? fmtDur(x.secs) : /*#__PURE__*/React.createElement(React.Fragment, null, loadLabel(x, unit), " \xD7 ", x.reps, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.muted
      }
    }, "@ ", inputMode === "rir" ? `${fmt(10 - x.rpe)} RIR` : `RPE ${fmt(x.rpe)}`))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: C.faint,
        marginTop: 2
      }
    }, x.lift !== sel ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.blue
      }
    }, shortLift(x.lift), " \xB7 ") : null, x.backoff ? "back-off" : "top set")), /*#__PURE__*/React.createElement("button", {
      onClick: () => setFilming(x),
      "aria-label": clip ? "Watch this set" : "Film this set",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        flexShrink: 0,
        cursor: "pointer",
        background: clip ? tint(selHue, 0.14) : "rgba(255,255,255,0.04)",
        border: `1px solid ${clip ? tint(selHue, 0.45) : C.line2}`,
        borderRadius: R.pill,
        color: clip ? selHue : C.muted,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 11.5,
        padding: "7px 12px",
        WebkitTapHighlightColor: "transparent"
      }
    }, clip ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Play, {
      size: 12
    }), " Watch") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Camera, {
      size: 13
    }), " Film")));
  })), recapReady && /*#__PURE__*/React.createElement(Btn, {
    kind: dayDone ? "ghost" : "primary",
    onClick: () => {
      if (!dayDone) markDone();
      setRecapOpen(true);
    },
    style: {
      width: "100%",
      minHeight: 52,
      fontSize: 15.5
    }
  }, dayDone ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 17
  }), " Session complete \u2014 see recap") : "Done training"), sel && !timedSel && /*#__PURE__*/React.createElement("button", {
    onClick: () => setLinking(true),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      fontSize: 11.5,
      fontWeight: 700,
      cursor: "pointer",
      alignSelf: "center",
      padding: 0
    }
  }, childNames.length ? `Includes ${childNames.map(shortLift).join(", ")}` : "Link as a variation"), /*#__PURE__*/React.createElement(RecapSheet, {
    open: recapOpen,
    onClose: () => setRecapOpen(false),
    session: recapSession,
    planned: plannedProgress,
    unit: unit,
    inputMode: inputMode,
    dateStr: dayStart(logDate).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric"
    }),
    onShare: () => {
      const S = recapSession;
      if (!S) return;
      doShare(setShareImg, {
        type: "session",
        date: dayStart(logDate).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric"
        }),
        headline: S.lifts.length === 1 ? S.lifts[0].name : `${S.lifts.length} lifts \u00b7 ${S.totalSets} sets`,
        sub: S.anyUp ? "new estimated high" : `${S.totalSets} sets${S.backoffs ? ` \u00b7 ${S.backoffs} back-off` : ""}`,
        lifts: S.lifts.map(l => ({
          name: l.name,
          up: l.up,
          detail: `${loadLabel(l.top, unit)} \u00d7 ${l.top.reps} @ ${inputMode === "rir" ? `${fmt(10 - l.top.rpe)} RIR` : `RPE ${fmt(l.top.rpe)}`}`,
          e1rm: l.e1rm != null ? fmt(Math.round(l.e1rm)) : null
        }))
      });
    }
  }), shareImg && /*#__PURE__*/React.createElement(ShareSheet, {
    data: shareImg,
    onClose: () => setShareImg(null)
  }), /*#__PURE__*/React.createElement(DaySheet2, {
    open: dayOpen,
    onClose: () => setDayOpen(false),
    slots: sessionSlots,
    doneSlots: doneSlots,
    state: state,
    sel: sel,
    unit: unit,
    weekLabel: progWeek ? progWeek + " · " + dayKeyFor(logDate) : "Today",
    dateLabel: dayStart(logDate).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric"
    }),
    onPick: sl => loadSlot(sl)
  }), editing && /*#__PURE__*/React.createElement(EditSetSheet, {
    set: editing,
    unit: unit,
    inputMode: inputMode,
    onClose: () => setEditing(null),
    onSave: patch => {
      updateSet(editing.lift || sel, editing.id, patch);
      setEditing(null);
    },
    onDelete: () => {
      deleteSet(editing.lift || sel, editing.id);
      setEditing(null);
    }
  }), /*#__PURE__*/React.createElement(ClipSheet, {
    open: !!filming,
    onClose: () => setFilming(null),
    setId: filming ? filming.id : null,
    ex: filming ? filming.ex : sel,
    set: filming,
    unit: unit,
    inputMode: inputMode,
    clip: filming ? (state.clips || {})[filming.id] : null,
    onSave: meta => saveClip(filming.id, meta),
    onDelete: () => {
      dropClip(filming.id);
      setFilming(null);
    }
  }), /*#__PURE__*/React.createElement(LiftSheet, {
    open: pickingLift,
    onClose: () => setPickingLift(false),
    state: state,
    models: models,
    sel: sel,
    unit: unit,
    todaySlots: sessionSlots,
    onPick: name => {
      // Standing in the gym and swapping a movement is a change to the plan,
      // not a detour from it — otherwise the calendar keeps asking for a lift
      // you have already decided against.
      if (activeSlot && name !== activeSlot.ex && !sessionSlots.some(x => x.ex === name)) patchSlotSpread(activeSlot.id, {
        ex: name
      }, activeSlot.ex);
      setSel(name);
    },
    onCreate: name => {
      const L = libFind(name);
      const parent = L && L.m && state.exercises[L.m] ? L.m : null;
      addExercise(name, parent, L ? L.r : undefined);
      const patch = {};
      if (L && !L.m && L.d !== "rpe") patch.accessory = true;
      if (TIME_MOVES.has(name)) {
        patch.metric = "time";
        patch.accessory = true;
      }
      if (Object.keys(patch).length) setTimeout(() => updateExercise(name, patch), 0);
    }
  }), linking && sel && /*#__PURE__*/React.createElement(LinkSheet, {
    name: sel,
    exercise: state.exercises[sel],
    mains: mains,
    childNames: childNames,
    effectiveRatio: model.ratio || 1,
    state: state,
    onClose: () => setLinking(false),
    onSave: patch => {
      updateExercise(sel, patch);
      setLinking(false);
    }
  }));
}
function AddRow({
  newName,
  setNewName,
  addExercise,
  mains
}) {
  const [parent, setParent] = useState("");
  const submit = () => {
    if (!newName.trim()) return;
    addExercise(newName, parent || undefined);
    setNewName("");
    setParent("");
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: newName,
    onChange: e => setNewName(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") submit();
    },
    placeholder: "e.g. Pause Squat",
    style: {
      flex: 1,
      background: C.bg2,
      border: `1px solid ${C.line2}`,
      borderRadius: 12,
      padding: "11px 12px",
      color: C.text,
      fontFamily: SANS,
      fontSize: 14,
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: submit
  }, "Add lift")), mains && mains.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.muted,
      marginBottom: 6,
      fontWeight: 700
    }
  }, "Variation of (optional)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    active: parent === "",
    onClick: () => setParent("")
  }, "None"), mains.map(m => /*#__PURE__*/React.createElement(Chip, {
    key: m,
    active: parent === m,
    onClick: () => setParent(m)
  }, m))), parent && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 7
    }
  }, "Feeds your ", parent, " estimate (\u2248", Math.round(defaultRatio(newName || "") * 100), "% to start, then auto-tunes from your numbers).")));
}
function PlateView({
  total,
  bar,
  denoms,
  unit
}) {
  const r = platesPerSide(total, bar, denoms);
  if (r.below) return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.faint,
      marginTop: 10
    }
  }, "Below bar weight (", fmt(bar), " ", unit, ").");
  if (r.items.length === 0) return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.faint,
      marginTop: 10
    }
  }, "Empty bar \u2014 ", fmt(bar), " ", unit, ".");
  const sizeFor = p => 30 + Math.min(26, p / denoms[0] * 26);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, r.items.flatMap(({
    p,
    c
  }) => Array.from({
    length: c
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: p + "-" + i,
    style: {
      width: 26,
      height: sizeFor(p),
      borderRadius: 12,
      background: C.surface2,
      border: `1px solid ${C.line2}`,
      display: "grid",
      placeItems: "center",
      fontFamily: MONO,
      fontSize: 10.5,
      fontWeight: 700,
      color: C.text
    }
  }, fmt(p))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 8,
      textAlign: "center",
      fontFamily: MONO
    }
  }, r.items.map(x => `${fmt(x.p)}×${x.c}`).join("  "), " per side", r.leftover > 0 ? `  ·  +${fmt(r.leftover)} ${unit} off` : ""));
}

/* ============================== HISTORY TAB ============================== */
/* The point of filming sets is seeing them next to each other: same lift, the
   heaviest first, so a bar path from March sits a thumb-swipe from one in July. */
function FilmStrip({
  ex,
  sets,
  clips,
  unit,
  hue,
  onPick
}) {
  const filmed = sets.filter(s => clips[s.id]).slice(0, 40);
  const [thumbs, setThumbs] = useState({});
  useEffect(() => {
    let dead = false;
    const want = filmed.map(s => s.id).filter(id => !(id in thumbs));
    if (!want.length) return;
    Promise.all(want.map(id => clipThumb(id).then(t => [id, t || null]).catch(() => [id, null]))).then(pairs => {
      if (!dead) setThumbs(t => {
        const n = {
          ...t
        };
        for (const [k, v] of pairs) n[k] = v;
        return n;
      });
    });
    return () => {
      dead = true;
    };
  }, [filmed.map(s => s.id).join(",")]);
  if (!filmed.length) return null;
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px 10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 13,
      borderRadius: 2,
      background: hue,
      boxShadow: `0 0 10px ${tint(hue, 0.55)}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: label
  }, "Film")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: C.faint
    }
  }, filmed.length, " clip", filmed.length === 1 ? "" : "s")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      overflowX: "auto",
      padding: "0 16px 16px",
      WebkitOverflowScrolling: "touch"
    }
  }, filmed.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => onPick(s),
    style: {
      flex: "0 0 auto",
      width: 98,
      padding: 0,
      background: C.bg,
      border: `1px solid ${C.line2}`,
      borderRadius: R.ctrl,
      overflow: "hidden",
      cursor: "pointer",
      color: C.text,
      textAlign: "left",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      position: "relative",
      height: 124,
      background: "#000"
    }
  }, thumbs[s.id] ? /*#__PURE__*/React.createElement("img", {
    src: thumbs[s.id],
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      placeItems: "center",
      height: "100%",
      color: C.faint
    }
  }, /*#__PURE__*/React.createElement(Film, {
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: "rgba(0,0,0,0.55)",
      display: "grid",
      placeItems: "center",
      color: "#fff",
      paddingLeft: 2
    }
  }, /*#__PURE__*/React.createElement(Play, {
    size: 12
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "12px 6px 5px",
      background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
      fontFamily: MONO,
      fontSize: 10.5,
      fontWeight: 700,
      textAlign: "center",
      display: "block"
    }
  }, s.secs != null ? fmtDur(s.secs) : `${fmt(s.weight)}×${s.reps}`)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 10,
      color: C.faint,
      padding: "6px 7px 7px",
      textAlign: "center"
    }
  }, dshort(s.ts))))));
}

/* One lift, and nothing but. This screen used to end with four cross-lift cards —
   variations against their parents, accessory progress, the strength profile, the
   last few sessions — which were good reads filed under whichever lift you happened
   to have selected, where they belonged to nothing. They live on the Dashboard now,
   one tap in. What is left here is the question the screen is actually for: where
   is this lift going, and what have I done on it. */
function HistoryTab({
  state,
  sel,
  setSel,
  models,
  deleteSet,
  updateSet,
  deleteExercise,
  unit,
  inputMode,
  saveClip,
  dropClip
}) {
  // Hooks first: this used to return early on an empty log and declare its state
  // after, so adding a first lift changed the hook count between two renders.
  const [armName, setArmName] = useState(null);
  const [pickingLift, setPickingLift] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [editing, setEditing] = useState(null);
  const [filming, setFilming] = useState(null);
  const names = Object.keys(state.exercises);
  if (names.length === 0) return /*#__PURE__*/React.createElement(Card, {
    style: {
      textAlign: "center",
      color: C.muted,
      fontSize: 14,
      padding: "28px 16px"
    }
  }, "No lifts yet. Add one in the Train tab to start tracking strength over time.");
  const cur = sel && state.exercises[sel] ? sel : names[0];
  const iconBtn = {
    background: "none",
    border: "none",
    color: C.faint,
    cursor: "pointer",
    padding: 4
  };
  const clips = state.clips || {};
  const ex = state.exercises[cur];
  const model = models[cur];
  const sets = [...ex.sets].sort((a, b) => b.ts - a.ts);
  const best = model.points.length ? Math.max(...model.points.map(p => p.value)) : null;
  const cutoff = Date.now() - 30 * 864e5;
  const before = model.points.filter(p => p.ts <= cutoff).slice(-1)[0]?.value;
  const delta = before != null && model.e1rm != null ? model.e1rm - before : null;
  // Accessories read out in the reps they are trained in, not as a one-rep max, and
  // their headline is the set they actually did rather than a figure derived from it.
  const accMode = isAccessory(cur, state);
  const accReps = accMode ? accessoryReps(cur, state) : null;
  const accWork = accMode ? workingWeight(model.e1rm, accReps) : null;
  const accDelta = accMode && delta != null && before != null ? workingWeight(model.e1rm, accReps) - workingWeight(before, accReps) : null;
  const top = accMode ? bestSet(ex.sets) : null;
  const chartPoints = accMode ? model.points.map(pt => ({
    ts: pt.ts,
    value: workingWeight(pt.value, accReps)
  })) : model.points;
  /* The set log was every set you have ever done on this lift in one unbroken
     reverse-chronological column, which is a ledger rather than a history: you
     could not see where one session ended and the next began, so you could not
     read progression off it at all. Same sets, cut into the days they happened
     on, in the order you did them. */
  const sessions = (() => {
    const m = new Map();
    for (const st of sets) {
      const k = dateStrFromTs(st.ts);
      if (!m.has(k)) m.set(k, {
        key: k,
        ts: st.ts,
        sets: [],
        best: null
      });
      const row = m.get(k);
      row.ts = Math.max(row.ts, st.ts);
      row.sets.push(st);
      if (st.secs == null) {
        const e = e1rmFromSet(st.weight, st.reps, st.rpe);
        if (row.best == null || e > row.best) row.best = e;
      }
    }
    const out = [...m.values()].sort((a, b) => b.ts - a.ts);
    for (const r of out) r.sets.sort((a, b) => a.ts - b.ts);
    return out;
  })();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPickingLift(true),
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: G.card,
      border: `1px solid ${C.line2}`,
      borderRadius: R.surface,
      padding: "13px 15px",
      cursor: "pointer",
      color: C.text,
      textAlign: "left",
      WebkitTapHighlightColor: "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9,
      display: "block",
      marginBottom: 3
    }
  }, "History for"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontWeight: 800,
      fontSize: 17,
      letterSpacing: "-0.02em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, cur)), /*#__PURE__*/React.createElement(ChevronDown, {
    size: 18,
    style: {
      color: C.faint,
      flexShrink: 0
    }
  })), /*#__PURE__*/React.createElement(LiftSheet, {
    open: pickingLift,
    onClose: () => setPickingLift(false),
    state: state,
    models: models,
    sel: cur,
    unit: unit,
    todaySlots: [],
    onPick: setSel,
    onCreate: setSel
  }), /*#__PURE__*/React.createElement(Card, {
    accent: hueFor(cur, state),
    glow: `radial-gradient(120% 90% at 50% -10%, ${tint(hueFor(cur, state), 0.13)}, transparent 70%)`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      marginBottom: 16
    }
  }, (accMode ? [[`Working × ${accReps}`, accWork != null ? roundTo(accWork, 1) : null, hueFor(cur, state), true], ["Best set", top ? `${fmt(roundTo(top.weight, 1))}×${top.reps}` : null, C.text, false], ["30-day", accDelta != null ? roundTo(accDelta, 1) : null, accDelta > 0 ? C.good : accDelta < 0 ? C.red : C.muted, false]] : [["Current 1RM", model.e1rm, hueFor(cur, state), true], ["Best", best, C.text, false], ["30-day", delta, delta > 0 ? C.good : delta < 0 ? C.red : C.muted, false]]).map(([l, v, col, lead], i) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      flex: 1,
      minWidth: 0,
      paddingLeft: i ? 12 : 0,
      marginLeft: i ? 12 : 0,
      borderLeft: i ? `1px solid ${C.line}` : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: lead ? 25 : 19,
      fontWeight: 700,
      marginTop: 6,
      color: col,
      letterSpacing: "-0.035em",
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1
    }
  }, l === "30-day" && v != null && v > 0 ? "+" : "", v == null ? "—" : typeof v === "string" ? v : fmt(v))))), model.count > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginBottom: 12,
      marginTop: -6
    }
  }, "from ", model.count, " session", model.count > 1 ? "s" : "", model.points.length ? ` · updated ${dshort(model.points[model.points.length - 1].ts)}` : ""), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 13,
      borderRadius: 2,
      background: hueFor(cur, state),
      boxShadow: `0 0 10px ${tint(hueFor(cur, state), 0.55)}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, accMode ? `Working weight for ${accReps} (${unit})` : `Strength trend (${unit})`)), /*#__PURE__*/React.createElement(LineChart, {
    data: chartPoints,
    height: 176,
    unit: unit,
    color: hueFor(cur, state)
  })), /*#__PURE__*/React.createElement(FilmStrip, {
    ex: cur,
    sets: sets,
    clips: clips,
    unit: unit,
    hue: hueFor(cur, state),
    onPick: s => setFilming(s)
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px 6px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 13,
      borderRadius: 2,
      background: C.amber,
      boxShadow: `0 0 10px ${C.amber}88`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: label
  }, "Every set")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: C.faint
    }
  }, sets.length, " set", sets.length === 1 ? "" : "s", " over ", sessions.length, " session", sessions.length === 1 ? "" : "s")), sets.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 16px 18px",
      color: C.faint,
      fontSize: 13
    }
  }, "No sets logged."), sessions.map(d => /*#__PURE__*/React.createElement(React.Fragment, {
    key: d.key
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 16px",
      borderTop: `1px solid ${C.line}`,
      background: "rgba(255,255,255,0.025)",
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: C.muted
    }
  }, dayStart(d.key).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 10.5,
      color: C.faint
    }
  }, d.sets.length, " set", d.sets.length === 1 ? "" : "s", d.best != null ? ` · best e1RM ${fmt(roundTo(d.best, 1))}${unit}` : "")), d.sets.map((s, si) => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      padding: "11px 16px",
      borderTop: si ? `1px solid ${C.line}` : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 600
    }
  }, s.secs != null ? /*#__PURE__*/React.createElement(React.Fragment, null, fmtDur(s.secs), s.weight ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted
    }
  }, " \xB7 ", fmt(s.weight), unit) : null) : /*#__PURE__*/React.createElement(React.Fragment, null, loadLabel(s, unit), " \xD7 ", s.reps, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.muted
    }
  }, "@ ", inputMode === "rir" ? `${fmt(10 - s.rpe)} RIR` : `RPE ${fmt(s.rpe)}`)), s.backoff && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontSize: 10,
      fontWeight: 800,
      color: C.muted,
      border: `1px solid ${C.line2}`,
      borderRadius: 6,
      padding: "1px 6px",
      marginLeft: 8,
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }
  }, "Back-off")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 2
    }
  }, "Set ", si + 1, s.secs != null ? "" : ` · e1RM ${fmt(e1rmFromSet(s.weight, s.reps, s.rpe))}${unit}`, s.cond != null && s.cond < 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.gold
    }
  }, " \xB7 \u2212", fmt(Math.round((1 - s.cond) * 1000) / 10), "% conditions") : null, s.carry != null && s.carry < 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.blue
    }
  }, " \xB7 \u2212", fmt(Math.round((1 - s.carry) * 1000) / 10), "% earlier work") : null, s.rpe != null && s.rpe < CALIBRATION_FLOOR_RPE ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint
    }
  }, " \xB7 warm-up, not counted") : null, s.fromRec && s.tRpe != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: Math.abs(s.rpe - s.tRpe) < 0.25 ? C.good : C.red
    }
  }, "  ·  target " + (inputMode === "rir" ? `${fmt(10 - s.tRpe)} RIR` : `RPE ${fmt(s.tRpe)}`) + (Math.abs(s.rpe - s.tRpe) < 0.25 ? " ✓" : ` → felt ${inputMode === "rir" ? `${fmt(10 - s.rpe)} RIR` : `RPE ${fmt(s.rpe)}`}`)), s.note ? `  ·  ${s.note}` : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      flexShrink: 0,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilming(s),
    "aria-label": clips[s.id] ? "Watch this set" : "Film this set",
    style: {
      ...iconBtn,
      color: clips[s.id] ? hueFor(cur, state) : C.faint
    }
  }, clips[s.id] ? /*#__PURE__*/React.createElement(Play, {
    size: 14
  }) : /*#__PURE__*/React.createElement(Camera, {
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditing(s),
    style: iconBtn
  }, /*#__PURE__*/React.createElement(Pencil, {
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteSet(cur, s.id),
    style: iconBtn
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 16
  })))))))), armName === cur ? /*#__PURE__*/React.createElement(Card, {
    accent: C.red
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14.5,
      marginBottom: 6
    }
  }, "Delete ", cur, "?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      lineHeight: 1.55,
      marginBottom: 12
    }
  }, "This removes ", cur, " and all ", state.exercises[cur] ? state.exercises[cur].sets.length : 0, " of its logged sets from your training. It moves to Recently deleted in Settings, where you can restore it. Type ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.text
    }
  }, cur), " below to confirm."), /*#__PURE__*/React.createElement("input", {
    value: confirmText,
    onChange: e => setConfirmText(e.target.value),
    placeholder: cur,
    style: {
      width: "100%",
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${C.line2}`,
      borderRadius: R.input,
      padding: "0 13px",
      height: 46,
      color: C.text,
      fontFamily: SANS,
      fontSize: 15,
      fontWeight: 600,
      outline: "none",
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    disabled: confirmText.trim() !== cur,
    onClick: () => {
      deleteExercise(cur);
      setArmName(null);
      setConfirmText("");
    },
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 15
  }), " Delete"), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: () => {
      setArmName(null);
      setConfirmText("");
    },
    style: {
      flex: 1
    }
  }, "Cancel"))) : /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: () => {
      setArmName(cur);
      setConfirmText("");
    },
    style: {
      alignSelf: "flex-start",
      color: C.muted
    }
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 15
  }), " Delete this lift"), /*#__PURE__*/React.createElement(ClipSheet, {
    open: !!filming,
    onClose: () => setFilming(null),
    setId: filming ? filming.id : null,
    ex: cur,
    set: filming,
    unit: unit,
    inputMode: inputMode,
    clip: filming ? clips[filming.id] : null,
    onSave: meta => {
      saveClip(filming.id, meta);
    },
    onDelete: () => {
      dropClip(filming.id);
      setFilming(null);
    }
  }), editing && /*#__PURE__*/React.createElement(EditSetSheet, {
    set: editing,
    unit: unit,
    inputMode: inputMode,
    onClose: () => setEditing(null),
    onSave: patch => {
      updateSet(cur, editing.id, patch);
      setEditing(null);
    },
    onDelete: () => {
      deleteSet(cur, editing.id);
      setEditing(null);
    }
  }));
}

/* ===================== STRENGTH SCORE + MEET PREP ====================== */
function ScoreCard({
  analysis,
  unit,
  state,
  setState
}) {
  const sex = state.settings && state.settings.sex || "male";
  const bwArr = state.bodyweight || [];
  const bwKg = bwArr.length ? bwArr[bwArr.length - 1].kg : null;
  const [share, setShare] = useState(null);
  const [editing, setEditing] = useState(bwKg == null);
  const [inp, setInp] = useState(bwKg != null ? fmt(fromKg(bwKg, unit)) : "");
  const totalUnit = analysis.total;
  const totalKg = totalUnit != null ? toKg(totalUnit, unit) : null;
  const dots = bwKg != null && totalKg != null ? dotsCoeff(bwKg, sex) * totalKg : null;
  const wilks = bwKg != null && totalKg != null ? wilksCoeff(bwKg, sex) * totalKg : null;
  const tier = dotsTier(dots);
  const setSex = v => setState(s => ({
    ...s,
    settings: {
      ...s.settings,
      sex: v
    }
  }));
  const saveBw = () => {
    const v = parseFloat(inp);
    if (!isFinite(v) || v <= 0) return;
    const kg = toKg(v, unit);
    setState(s => {
      const arr = [...(s.bodyweight || [])];
      const today = dateStrFromTs(Date.now());
      const i = arr.findIndex(e => dateStrFromTs(e.ts) === today);
      if (i >= 0) arr[i] = {
        ...arr[i],
        kg
      };else arr.push({
        id: Date.now() + Math.random(),
        ts: Date.now(),
        kg
      });
      return {
        ...s,
        bodyweight: arr
      };
    });
    setEditing(false);
  };
  const doShareScore = () => doShare(setShare, {
    type: "stat",
    label: "DOTS score",
    value: fmt(Math.round(dots)),
    unit: "",
    sub: "Total " + fmt(Math.round(totalKg)) + " kg  @  " + fmt(Math.round(fromKg(bwKg, unit))) + " " + unit,
    date: new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  });
  if (totalKg == null) return /*#__PURE__*/React.createElement(Card, {
    accent: C.amber
  }, /*#__PURE__*/React.createElement("div", {
    style: label
  }, "Strength score"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 8,
      lineHeight: 1.5
    }
  }, "Log squat, bench, and deadlift to see your DOTS and Wilks score."));
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      position: "relative"
    }
  }, dots != null && /*#__PURE__*/React.createElement("button", {
    onClick: doShareScore,
    "aria-label": "Share",
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 4,
      position: "absolute",
      top: 10,
      right: 10
    }
  }, /*#__PURE__*/React.createElement(Share, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: label
  }, "Strength score"), bwKg != null && !editing ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(ArcGauge, {
    value: Math.min(dots, 550),
    max: 550,
    color: tierColor(dots),
    size: 196,
    ticks: 38
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 34,
      fontWeight: 700,
      letterSpacing: "-0.04em",
      lineHeight: 1
    }
  }, fmt(Math.round(dots))), /*#__PURE__*/React.createElement("span", {
    style: {
      ...label2,
      color: tierColor(dots),
      marginTop: 3
    }
  }, tier || "DOTS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 1,
      marginTop: 4
    }
  }, [["Wilks", fmt(Math.round(wilks))], ["Total", fmt(Math.round(totalKg)) + " kg"], ["Bodyweight", fmt(fromKg(bwKg, unit)) + " " + unit]].map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: 1,
      textAlign: "center",
      padding: "10px 4px",
      borderLeft: i ? `1px solid ${C.line}` : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 14.5,
      fontWeight: 700,
      letterSpacing: "-0.02em"
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label2,
      color: C.faint,
      marginTop: 4
    }
  }, k)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 10,
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setInp(fmt(fromKg(bwKg, unit)));
      setEditing(true);
    },
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 700,
      fontSize: 12.5,
      cursor: "pointer",
      padding: 0
    }
  }, "Edit bodyweight"), /*#__PURE__*/React.createElement(Segmented, {
    value: sex,
    onChange: setSex,
    options: [{
      value: "male",
      label: "M"
    }, {
      value: "female",
      label: "F"
    }]
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginBottom: 8
    }
  }, "Enter your bodyweight to see DOTS & Wilks."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(NumField, {
    value: inp,
    onChange: setInp,
    suffix: unit
  })), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: saveBw
  }, "Save")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: sex,
    onChange: setSex,
    options: [{
      value: "male",
      label: "Male"
    }, {
      value: "female",
      label: "Female"
    }]
  }))), share && /*#__PURE__*/React.createElement(ShareSheet, {
    data: share,
    onClose: () => setShare(null)
  }));
}
function MeetCard({
  analysis,
  unit,
  state,
  setState
}) {
  const [open, setOpen] = useState(false);
  const meet = state.meet || {
    date: null,
    name: "",
    attempts: {}
  };
  const days = meet.date ? daysUntil(meet.date) : null;
  return /*#__PURE__*/React.createElement(Card, {
    accent: C.red
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: label
  }, "Meet prep"), meet.date && days != null && days >= 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 13,
      color: days <= 14 ? C.red : C.text
    }
  }, days === 0 ? "Meet day" : days + " day" + (days === 1 ? "" : "s") + " out")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 8,
      lineHeight: 1.5
    }
  }, meet.date ? (meet.name ? meet.name + " — plan" : "Plan") + " your openers, second and third attempts off your current maxes — in kilos, rounded to the plates." : "Set a meet date and IRONSET builds your nine attempts off your current strength."), /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    onClick: () => setOpen(true),
    style: {
      marginTop: 12,
      width: "100%"
    }
  }, meet.date ? "Open meet prep" : "Set up meet prep"), /*#__PURE__*/React.createElement(MeetSheet, {
    open: open,
    onClose: () => setOpen(false),
    analysis,
    unit,
    state,
    setState
  }));
}
function MeetSheet({
  open,
  onClose,
  analysis,
  unit,
  state,
  setState
}) {
  const meet = state.meet || {
    date: null,
    name: "",
    attempts: {}
  };
  const [share, setShare] = useState(null);
  const sex = state.settings && state.settings.sex || "male";
  const bwArr = state.bodyweight || [];
  const bwKg = bwArr.length ? bwArr[bwArr.length - 1].kg : null;
  const setMeet = patch => setState(s => ({
    ...s,
    meet: {
      ...(s.meet || {
        date: null,
        name: "",
        attempts: {}
      }),
      ...patch
    }
  }));
  const lifts = [analysis.big.squat, analysis.big.bench, analysis.big.deadlift].filter(Boolean);
  const attemptsFor = lf => {
    const ov = meet.attempts && meet.attempts[lf.name] || {};
    const kg = toKg(lf.e1rm, unit);
    return {
      opener: ov.opener != null ? ov.opener : round2_5(kg * 0.9),
      second: ov.second != null ? ov.second : round2_5(kg * 0.95),
      third: ov.third != null ? ov.third : round2_5(kg * 1.0)
    };
  };
  const setAttempt = (name, key, val) => setMeet({
    attempts: {
      ...(meet.attempts || {}),
      [name]: {
        ...((meet.attempts || {})[name] || {}),
        [key]: val
      }
    }
  });
  const autoLift = name => setMeet({
    attempts: {
      ...(meet.attempts || {}),
      [name]: {}
    }
  });
  const thirdsTotal = lifts.reduce((a, lf) => a + attemptsFor(lf).third, 0);
  const openersTotal = lifts.reduce((a, lf) => a + attemptsFor(lf).opener, 0);
  const dots = bwKg != null && lifts.length === 3 ? dotsCoeff(bwKg, sex) * thirdsTotal : null;
  const pct = {
    opener: "90%",
    second: "95%",
    third: "100%"
  };
  const lblmap = {
    opener: "Opener",
    second: "Second",
    third: "Third"
  };
  const shareMeet = () => {
    const sub = lifts.map(lf => {
      const n = lf.name.toLowerCase();
      const ab = n.includes("squat") ? "S" : n.includes("bench") ? "B" : "D";
      return ab + " " + fmt(attemptsFor(lf).third);
    }).join("    ");
    doShare(setShare, {
      type: "stat",
      label: meet.name || "Projected meet total",
      value: fmt(thirdsTotal),
      unit: "kg",
      sub,
      date: meet.date ? fmtMeetDate(meet.date) : ""
    });
  };
  const inputStyle = {
    width: "100%",
    background: C.bg2,
    border: `1px solid ${C.line2}`,
    borderRadius: 12,
    padding: "0 12px",
    height: 44,
    color: C.text,
    fontSize: 15,
    fontWeight: 600,
    outline: "none"
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Meet prep"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 6
    }
  }, "Meet date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: meet.date || "",
    onChange: e => setMeet({
      date: e.target.value || null
    }),
    style: {
      ...inputStyle,
      fontFamily: MONO,
      colorScheme: "dark"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 6
    }
  }, "Meet name (optional)"), /*#__PURE__*/React.createElement("input", {
    value: meet.name || "",
    onChange: e => setMeet({
      name: e.target.value
    }),
    placeholder: "e.g. State Championship",
    style: {
      ...inputStyle,
      fontFamily: SANS
    }
  })), lifts.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      padding: "10px 2px",
      lineHeight: 1.5
    }
  }, "Log squat, bench, and deadlift first \u2014 your attempts build off their estimated maxes.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: C.surface,
      border: `1px solid ${C.line}`,
      borderRadius: 12,
      padding: "14px 16px",
      position: "relative",
      marginBottom: 12,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: shareMeet,
    "aria-label": "Share",
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 4,
      position: "absolute",
      top: 8,
      right: 8
    }
  }, /*#__PURE__*/React.createElement(Share, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10
    }
  }, "If you hit your thirds"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 38,
      fontWeight: 700,
      lineHeight: 1,
      marginTop: 6
    }
  }, fmt(thirdsTotal), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: C.muted,
      marginLeft: 4
    }
  }, "kg")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.muted,
      marginTop: 6
    }
  }, "Openers in the bag ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.text,
      fontFamily: MONO
    }
  }, fmt(openersTotal)), " kg", dots != null && /*#__PURE__*/React.createElement(React.Fragment, null, " \xB7 DOTS ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.text,
      fontFamily: MONO
    }
  }, fmt(Math.round(dots)))))), lifts.map(lf => {
    const at = attemptsFor(lf);
    return /*#__PURE__*/React.createElement(Card, {
      key: lf.name,
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        fontSize: 15
      }
    }, lf.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: C.muted
      }
    }, "e1RM ", fmt(lf.e1rm), " ", unit, " \xB7 ", /*#__PURE__*/React.createElement("button", {
      onClick: () => autoLift(lf.name),
      style: {
        background: "none",
        border: "none",
        color: C.red,
        fontWeight: 700,
        fontSize: 11.5,
        cursor: "pointer",
        padding: 0
      }
    }, "Auto"))), ["opener", "second", "third"].map(k => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 800,
        fontSize: 13
      }
    }, lblmap[k]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: C.faint
      }
    }, pct[k], " \xB7 ", fmt(Math.round(at[k] * LBKG)), " lb")), /*#__PURE__*/React.createElement(Stepper, {
      value: at[k],
      step: 2.5,
      min: 0,
      suffix: "kg",
      onChange: v => setAttempt(lf.name, k, v)
    }))));
  }), meet.date && /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    onClick: () => setMeet({
      date: null,
      attempts: {}
    }),
    style: {
      width: "100%",
      marginTop: 4
    }
  }, "Clear meet")), share && /*#__PURE__*/React.createElement(ShareSheet, {
    data: share,
    onClose: () => setShare(null)
  }));
}

/* ============================== INSIGHTS ================================ */
function BlockSheet({
  open,
  onClose,
  plan,
  setPlan,
  exNames,
  inputMode
}) {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [day, setDay] = useState(DAYS[Math.max(0, (new Date().getDay() + 6) % 7)]);
  const items = plan[day] || [];
  const upd = next => setPlan({
    ...plan,
    [day]: next
  });
  const rir = inputMode === "rir";
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Weekly plan"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.faint,
      marginBottom: 12,
      lineHeight: 1.5
    }
  }, "Set each day's lifts and targets once. On that day, Train opens pre-loaded \u2014 the engine still computes every load live."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      flexWrap: "wrap",
      marginBottom: 14
    }
  }, DAYS.map(d => /*#__PURE__*/React.createElement(Chip, {
    key: d,
    active: d === day,
    onClick: () => setDay(d)
  }, d, (plan[d] || []).length ? ` ·${(plan[d] || []).length}` : ""))), items.map((it, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    style: {
      marginBottom: 10,
      padding: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: it.name,
    onChange: e => upd(items.map((x, j) => j === i ? {
      ...x,
      name: e.target.value
    } : x)),
    style: {
      background: "#0F1216",
      border: `1px solid ${C.line2}`,
      borderRadius: 9,
      color: C.text,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 13.5,
      padding: "8px 10px",
      outline: "none",
      maxWidth: "72%"
    }
  }, exNames.map(n => /*#__PURE__*/React.createElement("option", {
    key: n,
    value: n
  }, n))), /*#__PURE__*/React.createElement("button", {
    onClick: () => upd(items.filter((_, j) => j !== i)),
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, "Reps"), /*#__PURE__*/React.createElement(Stepper, {
    value: it.reps,
    min: 1,
    max: 20,
    onChange: v => upd(items.map((x, j) => j === i ? {
      ...x,
      reps: v
    } : x))
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, rir ? "RIR" : "RPE"), /*#__PURE__*/React.createElement(Stepper, {
    value: rir ? 10 - it.rpe : it.rpe,
    step: 0.5,
    min: rir ? 0 : 5,
    max: rir ? 5 : 10,
    onChange: v => upd(items.map((x, j) => j === i ? {
      ...x,
      rpe: rir ? 10 - v : v
    } : x))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: C.line,
      margin: "13px -13px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em"
    }
  }, "Back-offs"), /*#__PURE__*/React.createElement("button", {
    onClick: () => upd(items.map((x, j) => j === i ? x.bo ? {
      ...x,
      bo: null
    } : {
      ...x,
      bo: {
        sets: 2,
        reps: 5,
        rpe: 7
      }
    } : x)),
    style: {
      background: "none",
      border: "none",
      color: C.red,
      fontWeight: 800,
      fontSize: 11.5,
      cursor: "pointer",
      padding: 0
    }
  }, it.bo ? "Remove" : "+ Add")), it.bo && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginTop: 9
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, "Sets"), /*#__PURE__*/React.createElement(Stepper, {
    value: it.bo.sets,
    min: 1,
    max: 8,
    onChange: v => upd(items.map((x, j) => j === i ? {
      ...x,
      bo: {
        ...x.bo,
        sets: v
      }
    } : x))
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, "Reps"), /*#__PURE__*/React.createElement(Stepper, {
    value: it.bo.reps,
    min: 1,
    max: 20,
    onChange: v => upd(items.map((x, j) => j === i ? {
      ...x,
      bo: {
        ...x.bo,
        reps: v
      }
    } : x))
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginBottom: 5,
      fontWeight: 700
    }
  }, rir ? "RIR" : "RPE"), /*#__PURE__*/React.createElement(Stepper, {
    value: rir ? 10 - it.bo.rpe : it.bo.rpe,
    step: 0.5,
    min: rir ? 0 : 5,
    max: rir ? 5 : 10,
    onChange: v => upd(items.map((x, j) => j === i ? {
      ...x,
      bo: {
        ...x.bo,
        rpe: rir ? 10 - v : v
      }
    } : x))
  }))))), exNames.length > 0 && /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    style: {
      width: "100%",
      marginTop: 4
    },
    onClick: () => upd([...items, {
      name: exNames[0],
      reps: 3,
      rpe: 8
    }])
  }, "+ Add lift to ", day), items.length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => upd([]),
    style: {
      display: "block",
      margin: "12px auto 0",
      background: "none",
      border: "none",
      color: C.faint,
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Clear ", day));
}

// Continuous freshness color: red-orange when badly depleted, through amber, into
// green as capacity returns — anchored to the app palette so 98% and 82% never read
// the same. `dim` darkens for the gradient's left edge.
function freshColor(pct, dim) {
  const t = Math.max(0, Math.min(1, (pct - 45) / 50));
  const A = [5, 76, 53],
    B = [42, 67, 55],
    D = [135, 38, 62]; // red -> gold -> green (HSL)
  const lerp = (a, b, k) => a + (b - a) * k;
  let h, s, l;
  if (t < 0.5) {
    const k = t / 0.5;
    h = lerp(A[0], B[0], k);
    s = lerp(A[1], B[1], k);
    l = lerp(A[2], B[2], k);
  } else {
    const k = Math.pow((t - 0.5) / 0.5, 0.72);
    h = lerp(B[0], D[0], k);
    s = lerp(B[1], D[1], k);
    l = lerp(B[2], D[2], k);
  }
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l - (dim || 0))}%)`;
}
function FreshnessCard({
  state
}) {
  const [share, setShare] = useState(null);
  // Main lifts only, same as the readiness card. An accessory's own recovery is not
  // a thing anybody plans around, and listing a barbell row beside a deadlift
  // invites exactly the comparison the two are not on the same scale for.
  const mains = Object.entries(state.exercises).filter(([n, e]) => !e.parent && e.sets.length && !isAccessory(n, state));
  if (!mains.length) return null;
  const now = Date.now(),
    DAY = 86400000;
  const rows = mains.map(([name, ex]) => {
    const scale = learnRecoveryScale(ex.sets);
    const rawAt = d => residualFatigue(ex.sets, now + d * DAY, true).raw;
    let full = 0;
    for (let d = 0; d <= 12; d++) {
      full = d;
      if (trimFor(rawAt(d), scale) < 0.01) break;
    }
    return {
      name,
      pct: readinessFor(rawAt(0), scale),
      full,
      ready: trimFor(rawAt(0), scale) < 0.01
    };
  }).sort((a, b) => a.pct - b.pct);
  return /*#__PURE__*/React.createElement(Card, {
    accent: C.blue
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 3
    }
  }, "Freshness forecast"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doShare(setShare, {
      type: "freshness",
      date: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      }),
      rows: rows.map(r => ({
        name: r.name,
        pct: r.pct,
        color: freshColor(r.pct),
        note: r.ready ? "ready" : `full in ${r.full}d`
      }))
    }),
    "aria-label": "Share forecast",
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 4,
      marginTop: -2,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Share, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginBottom: 13,
      lineHeight: 1.5
    }
  }, "Estimated capacity right now, per lift \u2014 and when recent hard work has fully cleared."), rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: freshColor(r.pct),
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 14
    }
  }, r.pct, "%"), r.ready ? " · ready" : ` · full in ${r.full}d`)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 3,
      background: "#0F1216",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.4) inset"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.max(6, Math.min(100, r.pct))}%`,
      height: "100%",
      borderRadius: 3,
      background: `linear-gradient(90deg, ${freshColor(r.pct, 11)}, ${freshColor(r.pct)})`,
      boxShadow: `0 0 8px ${freshColor(r.pct)}55`
    }
  })))), share && /*#__PURE__*/React.createElement(ShareSheet, {
    data: share,
    onClose: () => setShare(null)
  }));
}
function SessionCard({
  session,
  unit,
  inputMode
}) {
  const [share, setShare] = useState(null);
  if (!session) return null;
  const {
    lifts,
    totalSets,
    backoffs,
    anyUp
  } = session;
  const eff = s => inputMode === "rir" ? `${fmt(10 - s.rpe)} RIR` : `RPE ${fmt(s.rpe)}`;
  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  const shareSession = () => doShare(setShare, {
    type: "session",
    date: dateStr,
    headline: lifts.length === 1 ? lifts[0].name : `${lifts.length} lifts \u00b7 ${totalSets} sets`,
    sub: anyUp ? "new estimated high" : `${totalSets} sets${backoffs ? ` \u00b7 ${backoffs} back-off` : ""}`,
    lifts: lifts.map(l => ({
      name: l.name,
      up: l.up,
      detail: `${fmt(l.top.weight)}${unit} \u00d7 ${l.top.reps} @ ${eff(l.top)}`,
      e1rm: l.e1rm != null ? fmt(Math.round(l.e1rm)) : null
    }))
  });
  return /*#__PURE__*/React.createElement(Card, {
    accent: C.good,
    style: {
      padding: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "13px 16px 11px",
      borderBottom: `1px solid ${C.line}`,
      background: "linear-gradient(180deg, rgba(226,59,46,0.08), transparent)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9.5,
      color: C.red
    }
  }, "Today's session"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: DISPLAY,
      fontWeight: 800,
      fontSize: 17,
      marginTop: 2
    }
  }, dateStr)), /*#__PURE__*/React.createElement("button", {
    onClick: shareSession,
    "aria-label": "Share session",
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 6,
      marginLeft: "auto",
      marginRight: 10,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Share, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 22,
      fontWeight: 700,
      lineHeight: 1
    }
  }, lifts.length, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: C.muted
    }
  }, " ", lifts.length === 1 ? "lift" : "lifts")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: C.muted,
      marginTop: 2
    }
  }, totalSets, " set", totalSets !== 1 ? "s" : "", backoffs ? ` · ${backoffs} back-off` : ""))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 16px 12px"
    }
  }, lifts.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.name,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "9px 0",
      borderBottom: l === lifts[lifts.length - 1] ? "none" : `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, l.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.muted,
      marginTop: 2,
      fontFamily: MONO
    }
  }, loadLabel(l.top, unit), " \xD7 ", l.top.reps, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: C.faint
    }
  }, "@ ", eff(l.top)))), l.e1rm != null && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      flexShrink: 0,
      marginLeft: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 700,
      color: l.up ? C.good : C.text
    }
  }, l.up ? "▲ " : "", fmt(Math.round(l.e1rm))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 8,
      marginTop: 1
    }
  }, "est 1rm")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: anyUp ? C.good : C.muted,
      marginTop: 10,
      fontWeight: 600,
      textAlign: "center"
    }
  }, anyUp ? "New estimated high today — strength trending up." : "Logged and in the books. Keep stacking sessions.")), share && /*#__PURE__*/React.createElement(ShareSheet, {
    data: share,
    onClose: () => setShare(null)
  }));
}

// Surfaces what the engine has actually learned about this lifter — data we compute on
// every render and have never shown. Always present, so Insights has a floor.
function ProfileCard({
  state,
  unit
}) {
  const [share, setShare] = useState(null);
  const rows = Object.entries(state.exercises).filter(([n, e]) => !e.parent && e.sets.length >= 5).map(([name, ex]) => ({
    name,
    top: learnDropScale(ex.sets, DEFAULT_FATIGUE_K, true),
    chain: learnDropScale(ex.sets, DEFAULT_FATIGUE_K, false),
    rec: learnRecoveryScale(ex.sets)
  }));
  if (!rows.length) return null;
  const read = (v, lo, mid, hi) => v < 0.78 ? {
    txt: lo,
    c: C.good
  } : v > 1.22 ? {
    txt: hi,
    c: C.red
  } : {
    txt: mid,
    c: C.amber
  };
  const dims = r => [["After a top set", read(r.top, "Holds strength", "Normal drop-off", "Falls off fast")], ["Between back-offs", read(r.chain, "Holds weight", "Steady descent", "Drops quickly")], ["Week to week", read(r.rec, "Recovers fast", "Normal recovery", "Carries fatigue")]];
  return /*#__PURE__*/React.createElement(Card, {
    accent: C.amber
  }, /*#__PURE__*/React.createElement(SectionHead, {
    accent: C.amber,
    sub: "Learned from your own logged sets \u2014 this is what shapes the loads IRONSET gives you.",
    right: /*#__PURE__*/React.createElement("button", {
      "aria-label": "Share profile",
      onClick: () => doShare(setShare, {
        type: "session",
        headline: "My fatigue profile",
        sub: "learned from logged sets",
        lifts: rows.map(r => ({
          name: r.name,
          detail: dims(r).map(d => d[1].txt).join("  ·  "),
          e1rm: null
        })),
        date: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric"
        })
      }),
      style: {
        background: "none",
        border: "none",
        color: C.faint,
        cursor: "pointer",
        padding: 4,
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(Share, {
      size: 14
    }))
  }, "Your profile"), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
      padding: i === 0 ? "0 0 13px" : "13px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 9
    }
  }, r.name), dims(r).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: C.faint
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12.5,
      fontWeight: 700,
      color: v.c
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 99,
      background: v.c
    }
  }), v.txt))))), share && /*#__PURE__*/React.createElement(ShareSheet, {
    data: share,
    onClose: () => setShare(null)
  }));
}

// Rolling record of the last training days, so the tab has substance on rest days too.
function RecentCard({
  state,
  unit,
  inputMode
}) {
  const [share, setShare] = useState(null);
  const today = new Date().toDateString();
  const byDay = {};
  for (const [name, ex] of Object.entries(state.exercises)) for (const s of ex.sets) {
    const k = new Date(s.ts).toDateString();
    (byDay[k] = byDay[k] || []).push({
      ...s,
      lift: name
    });
  }
  const days = Object.keys(byDay).sort((a, b) => new Date(b) - new Date(a)).slice(0, 5);
  if (!days.length) return null;
  const eff = s => inputMode === "rir" ? `${fmt(10 - s.rpe)} RIR` : `RPE ${fmt(s.rpe)}`;
  return /*#__PURE__*/React.createElement(Card, {
    accent: C.blue
  }, /*#__PURE__*/React.createElement(SectionHead, {
    accent: C.blue,
    right: /*#__PURE__*/React.createElement("button", {
      "aria-label": "Share recent",
      onClick: () => doShare(setShare, {
        type: "session",
        headline: "Recent sessions",
        sub: `${days.length} training days`,
        lifts: days.map(d => {
          const all = byDay[d],
            w = all.filter(s => !s.backoff),
            p = w.length ? w : all;
          const tp = p.reduce((x, y) => y.weight > x.weight ? y : x, p[0]);
          return {
            name: dshort(new Date(d).getTime()),
            detail: `${fmt(tp.weight)}${unit} × ${tp.reps} · ${all.length} sets`,
            e1rm: null
          };
        }),
        date: new Date().toLocaleDateString(undefined, {
          month: "short",
          day: "numeric"
        })
      }),
      style: {
        background: "none",
        border: "none",
        color: C.faint,
        cursor: "pointer",
        padding: 4,
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement(Share, {
      size: 14
    }))
  }, "Recent sessions"), days.map((d, i) => {
    const all = byDay[d];
    const work = all.filter(s => !s.backoff);
    const pool = work.length ? work : all;
    const top = pool.reduce((x, y) => y.weight > x.weight ? y : x, pool[0]);
    const lifts = Array.from(new Set(all.map(s => s.lift)));
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        borderTop: i === 0 ? "none" : `1px solid ${C.line}`,
        padding: i === 0 ? "0 0 12px" : "12px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: 13.5
      }
    }, lifts.slice(0, 2).join(" · "), lifts.length > 2 ? ` +${lifts.length - 2}` : ""), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontFamily: MONO,
        whiteSpace: "nowrap",
        color: d === today ? C.good : C.faint,
        fontWeight: d === today ? 700 : 400
      }
    }, d === today ? "Today" : dshort(new Date(d).getTime()))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: C.muted,
        marginTop: 4,
        fontFamily: MONO
      }
    }, "top ", loadLabel(top, unit), " \xD7 ", top.reps, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.faint
      }
    }, "@ ", eff(top)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: C.faint
      }
    }, "  \xB7  ", all.length, " sets")));
  }), share && /*#__PURE__*/React.createElement(ShareSheet, {
    data: share,
    onClose: () => setShare(null)
  }));
}

// Several lifts on one chart. Absolute weights can't share an axis — a 687 deadlift
// would flatten a 391 bench into a straight line — so each lift is indexed to its own
// starting point and the chart answers the question that actually matters: which of
// them is still moving.
function MultiTrend({
  series,
  height = 184,
  days = 90
}) {
  const uid = useMemo(() => "mt" + Math.random().toString(36).slice(2, 7), []);
  const cut = Date.now() - days * 86400000;
  const live = (series || []).map(s2 => ({
    ...s2,
    pts: (s2.points || []).filter(p => p.ts >= cut)
  })).filter(s2 => s2.pts.length > 1);
  if (live.length === 0) return /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.faint,
      fontSize: 13,
      padding: "34px 4px",
      textAlign: "center"
    }
  }, "Not enough logged yet to chart a trend.");
  const norm = live.map(s2 => {
    const base = s2.pts[0].value || 1;
    return {
      ...s2,
      rel: s2.pts.map(p => ({
        ts: p.ts,
        v: (p.value - base) / base * 100
      }))
    };
  });
  const allV = norm.flatMap(s2 => s2.rel.map(r => r.v));
  const allT = norm.flatMap(s2 => s2.rel.map(r => r.ts));
  const lo = Math.min(0, Math.min.apply(null, allV)),
    hi = Math.max(1, Math.max.apply(null, allV));
  const pad = Math.max(1.5, (hi - lo) * 0.16);
  const minY = lo - pad,
    maxY = hi + pad;
  const minX = Math.min.apply(null, allT),
    maxX = Math.max.apply(null, allT),
    spanX = maxX - minX || 1;
  const W = 320,
    H = height,
    gut = 30,
    padR = 10,
    padT = 12,
    padB = 20;
  const px = t => gut + (t - minX) / spanX * (W - gut - padR);
  const py = v => padT + (1 - (v - minY) / (maxY - minY)) * (H - padT - padB);
  const zeroY = py(0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: "100%",
      height: "auto",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("defs", null, norm.map((s2, i) => /*#__PURE__*/React.createElement("linearGradient", {
    key: i,
    id: `${uid}${i}`,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: s2.color,
    stopOpacity: "0.26"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: s2.color,
    stopOpacity: "0"
  })))), /*#__PURE__*/React.createElement("line", {
    x1: gut,
    x2: W - padR,
    y1: zeroY,
    y2: zeroY,
    stroke: C.line2,
    strokeWidth: "1",
    strokeDasharray: "3 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: gut - 6,
    y: zeroY + 3,
    fill: C.faint,
    fontSize: "8",
    fontFamily: MONO,
    textAnchor: "end"
  }, "0%"), /*#__PURE__*/React.createElement("text", {
    x: gut - 6,
    y: py(maxY - pad * 0.6) + 3,
    fill: C.faint,
    fontSize: "8",
    fontFamily: MONO,
    textAnchor: "end"
  }, "+", Math.round(maxY - pad * 0.6), "%"), norm.map((s2, i) => {
    const pts = s2.rel.map(r => [px(r.ts), py(r.v)]);
    const line = smoothPath(pts);
    const area = line + ` L${pts[pts.length - 1][0].toFixed(1)} ${zeroY.toFixed(1)} L${pts[0][0].toFixed(1)} ${zeroY.toFixed(1)} Z`;
    const last = pts[pts.length - 1];
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("path", {
      d: area,
      fill: `url(#${uid}${i})`
    }), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: s2.color,
      strokeWidth: "2.3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: last[0],
      cy: last[1],
      r: "6",
      fill: s2.color,
      opacity: "0.18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: last[0],
      cy: last[1],
      r: "3",
      fill: s2.color,
      stroke: C.bg2,
      strokeWidth: "1.5"
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      marginTop: 10
    }
  }, norm.map((s2, i) => {
    const d = s2.rel[s2.rel.length - 1].v;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 99,
        background: s2.color,
        boxShadow: `0 0 8px ${tint(s2.color, 0.8)}`
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: C.muted,
        fontWeight: 600
      }
    }, s2.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 11.5,
        fontWeight: 700,
        color: d > 0.2 ? C.good : d < -0.2 ? C.red : C.faint
      }
    }, d > 0 ? "+" : "", d.toFixed(1), "%"));
  })));
}
function Analysis({
  analysis,
  unit,
  state,
  setState,
  models,
  view
}) {
  const {
    total,
    totalDelta,
    parts,
    insights
  } = analysis;
  const sevColor = {
    alert: C.red,
    watch: C.gold,
    win: C.good,
    note: "#7FA8C9"
  };
  const [share, setShare] = useState(null);
  const [showEngine, setShowEngine] = useState(false);
  const dismissed = state.dismissedInsights || {};
  const dismiss = it => setState(s => ({
    ...s,
    dismissedInsights: {
      ...(s.dismissedInsights || {}),
      [it.id]: it.detail
    }
  }));
  const shownInsights = insights.filter(it => dismissed[it.id] !== it.detail);
  const iconBtn = {
    background: "none",
    border: "none",
    color: C.faint,
    cursor: "pointer",
    padding: 4,
    flexShrink: 0,
    display: "flex",
    alignItems: "center"
  };
  const dateStr = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const shareStat = () => {
    const sub = parts.slice(0, 3).map(p => {
      const n = p.name.toLowerCase();
      const ab = n.includes("squat") ? "S" : n.includes("bench") ? "B" : n.includes("dead") ? "D" : p.name.slice(0, 2).toUpperCase();
      return ab + " " + fmt(Math.round(p.e1rm));
    }).join("    ");
    doShare(setShare, {
      type: "stat",
      label: "Projected total",
      value: fmt(Math.round(total)),
      unit,
      delta: totalDelta != null ? Math.round(totalDelta) : null,
      sub,
      date: dateStr
    });
  };
  const shareInsight = it => doShare(setShare, {
    type: "insight",
    title: it.title,
    detail: it.detail,
    accent: sevColor[it.sev],
    date: dateStr
  });
  if ((!insights || insights.length === 0) && (!parts || parts.length === 0)) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, view === "today" && /*#__PURE__*/React.createElement(SessionCard, {
    session: analysis.session,
    unit: unit,
    inputMode: state.settings.inputMode
  }), view === "deep" && /*#__PURE__*/React.createElement(ProfileCard, {
    state: state,
    unit: unit
  }), view === "deep" && /*#__PURE__*/React.createElement(RecentCard, {
    state: state,
    unit: unit,
    inputMode: state.settings.inputMode
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      textAlign: "center",
      color: C.muted,
      fontSize: 13.5,
      padding: "28px 18px",
      lineHeight: 1.6
    }
  }, "Log a few sets and I'll start reading your training here \u2014 strength trends, hidden gains from your variations, RPE calibration, weak points. No two lifters get the same reads."));
  // Main lifts for the trend, variations for the ratio bars — two different questions,
  // so two different charts rather than one that half-answers both.
  const trendSeries = Object.keys(state.exercises || {}).filter(n => !state.exercises[n].parent && !isAccessory(n, state) && models && models[n] && models[n].points.length > 1).map(n => ({
    name: n,
    color: hueFor(n, state),
    points: models[n].points
  }));
  // Accessories were left out of everything here, which made them invisible: you can
  // only push what you can see. They get their own read, in their own unit.
  const accProgress = Object.keys(state.exercises || {}).filter(n => isAccessory(n, state) && models && models[n] && models[n].e1rm != null && models[n].points.length > 1 && !isTimed(n, state)).map(n => {
    const pts = models[n].points,
      reps = accessoryReps(n, state);
    const cut = Date.now() - 30 * 864e5;
    const prior = pts.filter(pt => pt.ts <= cut).slice(-1)[0] || pts[0];
    const work = workingWeight(models[n].e1rm, reps);
    const was = workingWeight(prior.value, reps);
    return {
      name: n,
      color: hueFor(n, state),
      reps,
      work,
      pct: was > 0 ? (work - was) / was * 100 : 0
    };
  }).sort((a, b2) => b2.pct - a.pct);
  const ratios = Object.keys(state.exercises || {}).filter(n => state.exercises[n].parent && models && models[n] && models[n].e1rm != null && models[state.exercises[n].parent] && models[state.exercises[n].parent].e1rm).map(n => {
    const par = state.exercises[n].parent;
    return {
      name: n,
      parent: par,
      color: hueFor(n, state),
      pct: models[n].e1rm / models[par].e1rm * 100,
      expected: (models[n].ratio || 1) * 100
    };
  }).sort((a, b2) => a.pct - a.expected - (b2.pct - b2.expected));

  /* Insights stopped being a place you go and became two things you already had
     open: what today looks like, on the Dashboard, and what a lift has been doing,
     on the screen where that lift is selected. Same analysis, no fifth tab. */
  const today = view === "today",
    lift = view === "deep";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, today && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SessionCard, {
    session: analysis.session,
    unit: unit,
    inputMode: state.settings.inputMode
  }), trendSeries.length > 0 && /*#__PURE__*/React.createElement(Card, {
    accent: C.red
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, "Strength trend"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: C.faint,
      fontFamily: MONO
    }
  }, "90 days")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      lineHeight: 1.5,
      margin: "6px 0 10px"
    }
  }, "Each lift against where it started, so they share one axis and you can see which is still climbing."), /*#__PURE__*/React.createElement(MultiTrend, {
    series: trendSeries
  })), shownInsights.length > 0 && /*#__PURE__*/React.createElement(SectionHead, {
    accent: C.red,
    right: Object.keys(dismissed).length > 0 ? /*#__PURE__*/React.createElement("button", {
      onClick: () => setState(s => ({
        ...s,
        dismissedInsights: {}
      })),
      style: {
        background: "none",
        border: "none",
        color: C.faint,
        fontSize: 11.5,
        fontWeight: 700,
        cursor: "pointer",
        padding: 0
      }
    }, "Restore dismissed") : null
  }, "What changed"), shownInsights.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      background: G.card,
      border: `1px solid ${C.line}`,
      borderLeft: `3px solid ${sevColor[it.sev]}`,
      borderRadius: R.surface,
      padding: "14px 15px",
      boxShadow: ELEV
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 99,
      background: sevColor[it.sev],
      flexShrink: 0,
      boxShadow: `0 0 8px ${sevColor[it.sev]}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 13.5
    }
  }, it.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => shareInsight(it),
    "aria-label": "Share",
    style: iconBtn
  }, /*#__PURE__*/React.createElement(Share, {
    size: 15
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => dismiss(it),
    "aria-label": "Dismiss",
    style: iconBtn
  }, /*#__PURE__*/React.createElement(X, {
    size: 15
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      marginTop: 5,
      lineHeight: 1.5
    }
  }, it.detail))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      textAlign: "center",
      marginTop: 2,
      lineHeight: 1.5
    }
  }, "These read your own logged data and refresh every time you train.")), lift && /*#__PURE__*/React.createElement(React.Fragment, null, ratios.length > 0 && /*#__PURE__*/React.createElement(Card, {
    accent: C.violet
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, "Variations vs their main lift"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      lineHeight: 1.5,
      margin: "6px 0 13px"
    }
  }, "The marker is where each one normally sits. Well short of it is a weak point worth training."), ratios.map(r => {
    const off = r.pct - r.expected;
    const tone = off < -6 ? C.red : off < -2 ? C.gold : C.good;
    return /*#__PURE__*/React.createElement("div", {
      key: r.name,
      style: {
        marginBottom: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, r.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: 11.5,
        fontWeight: 700,
        color: tone,
        flexShrink: 0,
        marginLeft: 8
      }
    }, Math.round(r.pct), "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        height: 7,
        borderRadius: 4,
        background: "rgba(255,255,255,0.05)",
        overflow: "visible"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${Math.max(2, Math.min(100, r.pct))}%`,
        height: "100%",
        borderRadius: 4,
        background: `linear-gradient(90deg, ${tint(r.color, 0.45)}, ${r.color})`,
        transition: "width .4s ease"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: -3,
        bottom: -3,
        left: `${Math.max(1, Math.min(99, r.expected))}%`,
        width: 2,
        borderRadius: 1,
        background: C.text,
        opacity: 0.75
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: C.faint,
        marginTop: 5
      }
    }, "of ", r.parent, " \xB7 normally ", Math.round(r.expected), "%"));
  })), accProgress.length > 0 && /*#__PURE__*/React.createElement(Card, {
    accent: C.good
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 9.5
    }
  }, "Accessory progress"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      lineHeight: 1.5,
      margin: "6px 0 13px"
    }
  }, "What each one moves for the reps you actually train it in, and where it has gone in a month. Accessories aren't one-rep lifts, so there is no max here \u2014 just the working load."), accProgress.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "9px 0",
      borderTop: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: a.color,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 12.5,
      fontWeight: 700,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO,
      fontSize: 10.5,
      color: C.faint,
      marginTop: 2
    }
  }, fmt(roundTo(a.work, 1)), unit, " \xD7 ", a.reps)), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO,
      fontSize: 13,
      fontWeight: 700,
      color: a.pct > 1 ? C.good : a.pct < -1 ? C.red : C.muted
    }
  }, a.pct > 0 ? "+" : "", a.pct.toFixed(1), "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 9.5,
      color: C.faint,
      fontFamily: MONO,
      marginTop: 2
    }
  }, a.pct > 1 ? "climbing" : a.pct < -1 ? "slipping" : "flat"))))), /*#__PURE__*/React.createElement(ProfileCard, {
    state: state,
    unit: unit
  }), /*#__PURE__*/React.createElement(RecentCard, {
    state: state,
    unit: unit,
    inputMode: state.settings.inputMode
  }), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: () => setShowEngine(true),
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(Info, {
    size: 15
  }), " How the engine thinks"), /*#__PURE__*/React.createElement(Sheet, {
    open: showEngine,
    onClose: () => setShowEngine(false),
    title: "The engine"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.text,
      lineHeight: 1.6,
      marginBottom: 16
    }
  }, "Every number in IRONSET is computed from your own logged sets \u2014 nothing generic, nothing canned. Here's the thinking underneath."), [["Estimated 1RM", "Every set implies a max through the RPE chart — a triple at 9 and a heavy single speak the same language. New sets blend in with recent work weighted most, and each set's pull is earned: hard, low-rep sets move the number; light or long sets barely nudge it, because their ratings are the least reliable."], ["Freshness correction", "A set performed under predicted residual fatigue from a hard recent session is read as a fatigued-day performance and converted to fresh terms before it touches your estimate — a brutal week can't masquerade as strength loss."], ["Variations", "Linked variations feed one family model through a learned ratio to their main lift, so a paused-squat PR sharpens your squat estimate too."], ["Back-offs", "Suggestions come off your actual last set, discounted by your personal fatigue profile — learned separately per lift, and separately for the top-set drop versus the chain, from every transition you've ever logged."], ["Week-over-week capacity", "Work above ~RPE 8 leaves a recovery debt that decays across the days between sessions. Its size is learned per lift from your own history, and when it applies your prescriptions are trimmed — visibly — while your max stays untouched."], ["Daily conditions", "Sleep, illness, stress and the belt you left at home are invisible to a training log, so you declare them instead. A check-in shades today's prescriptions by a few percent — kit is applied per lift, since a belt is worth real weight on a squat and almost nothing on a bench — and every set you log is stamped with the handicap that was in force. The estimator divides that straight back out, so hitting a trimmed target on effort leaves your max exactly where it was. The rule that keeps this honest: a check-in can hold your estimate up, it can never push it up. A genuine PR on a rough day scores exactly what it would have scored anyway."]].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 5,
      color: C.red
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.muted,
      lineHeight: 1.6
    }
  }, d))))), share && /*#__PURE__*/React.createElement(ShareSheet, {
    data: share,
    onClose: () => setShare(null)
  }));
}
function ShareSheet({
  data,
  onClose
}) {
  if (!data) return null;
  const canShare = typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare({
    files: [data.file]
  });
  const save = () => {
    const a = document.createElement("a");
    a.href = data.url;
    a.download = data.file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const reshare = async () => {
    try {
      await navigator.share({
        files: [data.file]
      });
    } catch (e) {}
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: true,
    onClose: onClose,
    title: "Share"
  }, /*#__PURE__*/React.createElement("img", {
    src: data.url,
    alt: "IRONSET card",
    style: {
      width: "100%",
      borderRadius: 12,
      display: "block",
      border: `1px solid ${C.line}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, canShare && /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: reshare,
    style: {
      flex: 1
    }
  }, "Share"), /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    onClick: save,
    style: {
      flex: 1
    }
  }, "Save image")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 10,
      textAlign: "center",
      lineHeight: 1.5
    }
  }, "On iPhone you can also press and hold the image to save it or send it straight to Instagram or Messages."));
}

/* ============================== LINK SHEET ============================== */
function LinkSheet({
  name,
  exercise,
  mains,
  childNames,
  effectiveRatio,
  onClose,
  onSave,
  state
}) {
  const isMainWithKids = childNames.length > 0;
  const [parent, setParent] = useState(exercise.parent || "");
  // Whether this movement belongs in the strength readouts at all. Some accessories
  // are worth logging and charting without ever counting toward a total.
  const tracked = !isAccessory(name, state);
  const [mode, setMode] = useState(typeof exercise.ratioManual === "number" ? "custom" : "auto");
  const [pct, setPct] = useState(String(Math.round((exercise.ratioManual ?? exercise.ratio ?? effectiveRatio ?? 0.9) * 100)));
  const fld = {
    fontSize: 11,
    color: C.muted,
    marginBottom: 6,
    fontWeight: 700
  };
  const options = mains.filter(m => m !== name);
  // The library knows a push-up from a bench press, but not how YOU do a given
  // movement — and it cannot know about anything you named yourself.
  const bwNow = isBodyweightMove(name, state);
  const bwRow = /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18,
      borderBottom: `1px solid ${C.line}`,
      paddingBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9.5,
      marginBottom: 8
    }
  }, "What you load"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: !bwNow,
    onClick: () => onSave({
      bw: false
    })
  }, "External weight"), /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: bwNow,
    onClick: () => onSave({
      bw: true
    })
  }, "Bodyweight")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 9,
      lineHeight: 1.5
    }
  }, bwNow ? `Logged against ${Math.round(bwShareFor(name) * 100)}% of your bodyweight — the share this movement actually holds up — plus anything you add. Leave the weight box empty for a plain set.` : "Every set is the weight you put on the bar or the stack."));
  const trackRow = /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18,
      borderBottom: `1px solid ${C.line}`,
      paddingBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 9.5,
      marginBottom: 8
    }
  }, "Strength tracking"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: tracked,
    onClick: () => onSave({
      accessory: false
    })
  }, "Track in 1RM"), /*#__PURE__*/React.createElement(Chip, {
    sm: true,
    active: !tracked,
    onClick: () => onSave({
      accessory: true
    })
  }, "Don\u2019t track")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 9,
      lineHeight: 1.5
    }
  }, "Untracked movements are still logged, charted and prescribed \u2014 they just stay out of your estimated maxes, your projected total and your readiness."));
  const save = () => {
    if (!parent) {
      onSave({
        parent: undefined,
        ratio: undefined,
        ratioManual: undefined
      });
      return;
    }
    const patch = {
      parent
    };
    if (mode === "custom") patch.ratioManual = Math.min(1.5, Math.max(0.3, (parseFloat(pct) || 90) / 100));else {
      patch.ratioManual = undefined;
      if (typeof exercise.ratio !== "number") patch.ratio = defaultRatio(name);
    }
    onSave(patch);
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: true,
    onClose: onClose,
    title: "Link to a main lift"
  }, bwRow, trackRow, isMainWithKids ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: C.muted,
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: C.text
    }
  }, name), " is a main lift and already pools: ", childNames.join(", "), ". Relink those variations elsewhere first if you want to make this one a variation.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: fld
  }, "Variation of"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    active: parent === "",
    onClick: () => setParent("")
  }, "None \u2014 main lift"), options.map(m => /*#__PURE__*/React.createElement(Chip, {
    key: m,
    active: parent === m,
    onClick: () => setParent(m)
  }, m)))), parent && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: fld
  }, "Strength ratio to ", parent), /*#__PURE__*/React.createElement(Segmented, {
    value: mode,
    onChange: setMode,
    options: [{
      value: "auto",
      label: "AUTO"
    }, {
      value: "custom",
      label: "CUSTOM"
    }]
  }), mode === "custom" ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120
    }
  }, /*#__PURE__*/React.createElement(NumField, {
    value: pct,
    onChange: setPct,
    suffix: "%"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: C.faint
    }
  }, "of your ", parent)) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 8
    }
  }, "Currently \u2248", Math.round((effectiveRatio || 0.9) * 100), "%. Auto-learns the real ratio once both lifts have a few logged sets.")), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: save,
    style: {
      width: "100%"
    }
  }, "Save")));
}

/* ============================== EDIT SET ================================= */
function EditSetSheet({
  set,
  unit,
  inputMode,
  onClose,
  onSave,
  onDelete
}) {
  const [date, setDate] = useState(dateStrFromTs(set.ts));
  const [weight, setWeight] = useState(String(set.weight));
  const [reps, setReps] = useState(set.reps);
  const [int, setInt] = useState(inputMode === "rir" ? 10 - set.rpe : set.rpe);
  const [note, setNote] = useState(set.note || "");
  const fld = {
    fontSize: 11,
    color: C.muted,
    marginBottom: 6,
    fontWeight: 700
  };
  const save = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    const rpe = inputMode === "rir" ? 10 - int : int;
    let ts = set.ts; // keep original time-of-day unless the day actually changed
    if (date !== dateStrFromTs(set.ts)) {
      const [y, m, d] = date.split("-").map(Number);
      ts = new Date(y, m - 1, d, 12, 0, 0).getTime();
    }
    onSave({
      ts,
      weight: w,
      reps,
      rpe,
      note: note.trim() || undefined
    });
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: true,
    onClose: onClose,
    title: "Edit set"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: fld
  }, "Date"), /*#__PURE__*/React.createElement(DateField, {
    value: date,
    onChange: setDate
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-end",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 110px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: fld
  }, "Weight"), /*#__PURE__*/React.createElement(NumField, {
    value: weight,
    onChange: setWeight,
    suffix: unit
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: fld
  }, "Reps"), /*#__PURE__*/React.createElement(Stepper, {
    value: reps,
    onChange: setReps,
    min: 1,
    max: 30
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: fld
  }, inputMode === "rir" ? "RIR" : "RPE"), /*#__PURE__*/React.createElement(Stepper, {
    value: int,
    onChange: setInt,
    step: 0.5,
    min: inputMode === "rir" ? 0 : 5,
    max: inputMode === "rir" ? 6 : 10
  }))), /*#__PURE__*/React.createElement("input", {
    value: note,
    onChange: e => setNote(e.target.value),
    placeholder: "Note (optional)",
    style: {
      width: "100%",
      background: C.bg2,
      border: `1px solid ${C.line}`,
      borderRadius: 12,
      padding: "11px 12px",
      color: C.text,
      fontFamily: SANS,
      fontSize: 14,
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint
    }
  }, "New estimate from this set: ", fmt(e1rmFromSet(parseFloat(weight) || 0, reps, inputMode === "rir" ? 10 - int : int)), " ", unit, " e1RM"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: save,
    style: {
      flex: 1
    },
    disabled: !parseFloat(weight)
  }, "Save changes"), /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    onClick: onDelete
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 15
  })))));
}

/* ============================== SETTINGS ================================= */
/* --------------------------- the video sheet ----------------------------
   One clip per set. Record it here — which keeps the file small because we
   choose the resolution and bitrate ourselves — or bring one in from the
   camera roll, which gets shrunk on the way in if it is enormous.
------------------------------------------------------------------------ */
function ClipSheet({
  open,
  onClose,
  setId,
  ex,
  set,
  unit,
  inputMode,
  clip,
  onSave,
  onDelete
}) {
  const [mode, setMode] = useState("idle"); // idle | camera | preview | busy
  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState(null);
  const [playUrl, setPlayUrl] = useState(null);
  const [err, setErr] = useState("");
  const [prog, setProg] = useState(0);
  const [stage, setStage] = useState("");
  const [recSecs, setRecSecs] = useState(0);
  const [facing, setFacing] = useState("environment");
  const [armDel, setArmDel] = useState(false);
  const camRef = useRef(null),
    streamRef = useRef(null),
    recRef = useRef(null),
    cancelRef = useRef(false);
  const playRef = useRef(null);
  const stopStream = () => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    } catch (e) {}
    streamRef.current = null;
  };
  const reset = () => {
    stopStream();
    if (url) URL.revokeObjectURL(url);
    setBlob(null);
    setUrl(null);
    setMode("idle");
    setErr("");
    setProg(0);
    setStage("");
    setRecSecs(0);
  };

  // the stored clip, fetched only while the sheet is open
  useEffect(() => {
    let dead = false,
      made = null;
    if (open && clip) {
      clipBlob(setId).then(b => {
        if (dead) return;
        if (!b) {
          setErr("That clip is no longer stored on this device.");
          return;
        }
        made = URL.createObjectURL(b);
        setPlayUrl(made);
      }).catch(() => {});
    }
    return () => {
      dead = true;
      if (made) URL.revokeObjectURL(made);
      setPlayUrl(null);
    };
  }, [open, clip, setId]);
  useEffect(() => {
    if (!open) {
      reset();
      setArmDel(false);
    }
  }, [open]);
  useEffect(() => () => {
    stopStream();
    if (url) URL.revokeObjectURL(url);
  }, []);
  useEffect(() => {
    if (mode === "camera" && camRef.current && streamRef.current) {
      camRef.current.srcObject = streamRef.current;
      camRef.current.play().catch(() => {});
    }
  }, [mode]);
  const openCamera = async () => {
    setErr("");
    if (!canRecord()) {
      setErr("This browser can't record video. Choose a file instead.");
      return;
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: facing
          },
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          },
          frameRate: {
            ideal: 30
          }
        },
        audio: false
      });
      setMode("camera");
    } catch (e) {
      setErr(/NotAllowed|Permission/i.test(String(e && e.name) + String(e && e.message)) ? "Camera access was declined. Allow it in your browser's site settings, or choose a file instead." : "No camera available here — choose a file instead.");
    }
  };
  const flip = async () => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    stopStream();
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: next
          },
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        },
        audio: false
      });
      if (camRef.current) {
        camRef.current.srcObject = streamRef.current;
        camRef.current.play().catch(() => {});
      }
    } catch (e) {
      setErr("Couldn't switch camera.");
    }
  };
  const startRec = () => {
    if (!streamRef.current) return;
    const mime = pickMime();
    let rec;
    try {
      rec = new MediaRecorder(streamRef.current, mime ? {
        mimeType: mime,
        videoBitsPerSecond: 2.2e6
      } : undefined);
    } catch (e) {
      setErr("This browser can't record here. Choose a file instead.");
      return;
    }
    const chunks = [];
    rec.ondataavailable = e => {
      if (e.data && e.data.size) chunks.push(e.data);
    };
    rec.onstop = () => {
      const b = new Blob(chunks, {
        type: mime || "video/webm"
      });
      stopStream();
      if (!b.size) {
        setErr("Nothing was recorded.");
        setMode("idle");
        return;
      }
      setBlob(b);
      setUrl(URL.createObjectURL(b));
      setMode("preview");
    };
    recRef.current = rec;
    rec.start(500);
    setRecSecs(0);
    setMode("rec");
  };
  const stopRec = () => {
    try {
      if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    } catch (e) {}
  };
  useEffect(() => {
    if (mode !== "rec") return;
    const t = setInterval(() => setRecSecs(s => {
      const n = s + 1;
      if (n >= CLIP_MAX_SECS) stopRec();
      return n;
    }), 1000);
    return () => clearInterval(t);
  }, [mode]);
  const pickFile = e => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (!/^video\//.test(f.type || "")) {
      setErr("That's not a video file.");
      return;
    }
    setErr("");
    if (url) URL.revokeObjectURL(url);
    setBlob(f);
    setUrl(URL.createObjectURL(f));
    setMode("preview");
  };
  const save = async () => {
    if (!blob) return;
    cancelRef.current = false;
    setMode("busy");
    setErr("");
    setProg(0);
    let b = blob;
    if (b.size > CLIP_BIG && canCompress()) {
      setStage("Shrinking — this plays the clip through once");
      try {
        const small = await shrinkVideo(b, setProg, () => cancelRef.current);
        if (small && small.size > 0 && small.size < b.size) b = small;
      } catch (e) {}
      if (cancelRef.current) {
        setMode("preview");
        setStage("");
        return;
      }
    }
    setStage("Saving");
    const meta = await grabThumb(b);
    try {
      await clipSave(setId, b, meta.thumb);
    } catch (e) {
      setErr("Couldn't save the video — this device's storage is full. Free up space in Settings and try again.");
      setMode("preview");
      setStage("");
      return;
    }
    onSave({
      ex,
      ts: set && set.ts || Date.now(),
      bytes: b.size,
      dur: meta.dur,
      w: meta.w,
      h: meta.h,
      type: b.type
    });
    reset();
  };
  const remove = async () => {
    try {
      await clipDrop(setId);
    } catch (e) {}
    onDelete();
    setArmDel(false);
  };
  const setLine = set ? set.secs != null ? fmtDur(set.secs) : `${fmt(set.weight)}${unit} × ${set.reps} @ ${inputMode === "rir" ? `${fmt(10 - set.rpe)} RIR` : `RPE ${fmt(set.rpe)}`}` : "";
  const frame = {
    width: "100%",
    borderRadius: R.ctrl,
    background: "#000",
    display: "block",
    maxHeight: "48vh",
    objectFit: "contain"
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: clip && mode === "idle" ? "Set video" : "Film this set"
  }, set && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 15,
      letterSpacing: "-0.02em"
    }
  }, ex), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 12.5,
      color: C.muted,
      marginTop: 3
    }
  }, setLine, set.ts ? ` · ${dshort(set.ts)}` : "")), err && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.red,
      marginBottom: 11,
      lineHeight: 1.5
    }
  }, err), clip && mode === "idle" && /*#__PURE__*/React.createElement("div", null, playUrl ? /*#__PURE__*/React.createElement("video", {
    ref: playRef,
    src: playUrl,
    controls: true,
    playsInline: true,
    style: frame
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      ...frame,
      height: 180,
      display: "grid",
      placeItems: "center",
      color: C.faint,
      fontSize: 13
    }
  }, "Loading\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11.5,
      color: C.faint,
      fontFamily: MONO,
      margin: "9px 2px 14px"
    }
  }, /*#__PURE__*/React.createElement("span", null, fmtSecs(clip.dur), " \xB7 ", fmtBytes(clip.bytes)), /*#__PURE__*/React.createElement("span", null, clip.w && clip.h ? `${clip.w}×${clip.h}` : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    onClick: () => {
      setErr("");
      openCamera();
    },
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Camera, {
    size: 15
  }), " Refilm"), /*#__PURE__*/React.createElement("label", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    as: "span",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(Upload, {
    size: 15
  }), " Replace"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "video/*",
    onChange: pickFile,
    style: {
      display: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, playUrl && /*#__PURE__*/React.createElement("a", {
    href: playUrl,
    download: `${(ex || "set").replace(/\W+/g, "-").toLowerCase()}-${dshort(clip.ts).replace(/\W+/g, "")}.${/mp4/.test(clip.type || "") ? "mp4" : "webm"}`,
    style: {
      flex: 1,
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    as: "span",
    style: {
      width: "100%",
      fontSize: 12.5,
      minHeight: 38
    }
  }, "Save to phone")), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: () => setArmDel(true),
    style: {
      flex: 1,
      fontSize: 12.5,
      minHeight: 38,
      color: C.red
    }
  }, /*#__PURE__*/React.createElement(Trash2, {
    size: 14
  }), " Delete")), armDel && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    onClick: remove,
    style: {
      flex: 1
    }
  }, "Delete this video"), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: () => setArmDel(false),
    style: {
      flex: 1
    }
  }, "Keep"))), !clip && mode === "idle" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: C.faint,
      lineHeight: 1.55,
      marginBottom: 14
    }
  }, "Keep the camera still and get the whole bar in frame. Clips stay on this device \u2014 nothing is uploaded anywhere \u2014 and are kept small enough to hold a training year of them."), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: openCamera,
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(Camera, {
    size: 16
  }), " Record now"), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    as: "span",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(Upload, {
    size: 15
  }), " Choose a file"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "video/*",
    onChange: pickFile,
    style: {
      display: "none"
    }
  }))), (mode === "camera" || mode === "rec") && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("video", {
    ref: camRef,
    muted: true,
    playsInline: true,
    style: {
      ...frame,
      transform: facing === "user" ? "scaleX(-1)" : "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontSize: 15,
      fontWeight: 700,
      minWidth: 48,
      color: mode === "rec" ? C.red : C.faint,
      fontVariantNumeric: "tabular-nums"
    }
  }, fmtSecs(recSecs)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, mode === "rec" ? /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    onClick: stopRec,
    style: {
      width: "100%"
    }
  }, "Stop") : /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: startRec,
    style: {
      width: "100%"
    }
  }, "Start recording")), mode === "camera" && /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: flip,
    style: {
      minHeight: 42,
      padding: "8px 12px",
      fontSize: 12.5
    }
  }, "Flip")), mode === "camera" && /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: reset,
    style: {
      width: "100%",
      marginTop: 8,
      fontSize: 12.5,
      minHeight: 38
    }
  }, "Cancel"), mode === "rec" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 9,
      textAlign: "center"
    }
  }, "Stops on its own at ", Math.round(CLIP_MAX_SECS / 60), " minutes.")), mode === "preview" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("video", {
    src: url,
    controls: true,
    playsInline: true,
    style: frame
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      fontFamily: MONO,
      margin: "9px 2px 14px"
    }
  }, fmtBytes(blob ? blob.size : 0), blob && blob.size > CLIP_BIG && canCompress() ? " — will be shrunk on save" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: save,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Check, {
    size: 16
  }), " Keep this"), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: reset,
    style: {
      flex: 1
    }
  }, "Discard"))), mode === "busy" && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 0 2px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5,
      marginBottom: 9
    }
  }, stage, "\u2026"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      borderRadius: 3,
      background: C.line,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      borderRadius: 3,
      background: C.red,
      width: `${Math.max(3, Math.round(prog * 100))}%`,
      transition: "width .25s linear"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 9,
      lineHeight: 1.5
    }
  }, "Leave this open until it finishes. A long clip takes as long as the clip itself."), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: () => {
      cancelRef.current = true;
    },
    style: {
      width: "100%",
      marginTop: 11,
      fontSize: 12.5,
      minHeight: 38
    }
  }, "Cancel")));
}
function DeviceRow({
  on,
  title,
  note,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "9px 0",
      borderTop: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginTop: 5,
      flexShrink: 0,
      background: on ? C.good : C.faint,
      boxShadow: on ? `0 0 7px ${C.good}` : "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 2,
      lineHeight: 1.45
    }
  }, note)), action ? /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action) : null);
}
function SettingsSheet({
  open,
  onClose,
  settings,
  setSetting,
  state,
  setState
}) {
  const restoreExercise = name => setState(s => {
    const item = (s.trash || []).find(x => x.name === name);
    if (!item) return s;
    const key = s.exercises[name] ? `${name} (restored)` : name;
    return {
      ...s,
      exercises: {
        ...s.exercises,
        [key]: {
          ...item.ex,
          name: key
        }
      },
      trash: (s.trash || []).filter(x => x.name !== name)
    };
  });
  const purgeExercise = name => setState(s => {
    const item = (s.trash || []).find(x => x.name === name);
    const clips = {
      ...(s.clips || {})
    };
    for (const x of item && item.ex && item.ex.sets || []) {
      if (clips[x.id]) {
        delete clips[x.id];
        clipDrop(x.id).catch(() => {});
      }
    }
    return {
      ...s,
      clips,
      trash: (s.trash || []).filter(x => x.name !== name)
    };
  });
  const [backup, setBackup] = useState("");
  const [importText, setImportText] = useState("");
  const [err, setErr] = useState("");
  const [armReset, setArmReset] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [store, setStore] = useState(null);
  const [canInstall, setCanInstall] = useState(() => !!pwa().prompt);
  const refreshStore = () => storageReport().then(setStore);
  useEffect(() => {
    if (open) refreshStore();
  }, [open]);
  useEffect(() => {
    const on = () => {
      setCanInstall(!!pwa().prompt);
      refreshStore();
    };
    window.addEventListener("ironset-installable", on);
    window.addEventListener("ironset-installed", on);
    window.addEventListener("ironset-sw", on);
    return () => {
      window.removeEventListener("ironset-installable", on);
      window.removeEventListener("ironset-installed", on);
      window.removeEventListener("ironset-sw", on);
    };
  }, []);
  const doInstall = async () => {
    const ev = pwa().prompt;
    if (!ev) return;
    try {
      ev.prompt();
      await ev.userChoice;
    } catch (e) {}
    if (window.IRONSET_PWA) window.IRONSET_PWA.prompt = null;
    setCanInstall(false);
    refreshStore();
  };
  const doPersist = async () => {
    await askPersist();
    refreshStore();
  };
  const [armClips, setArmClips] = useState(false);
  const clearClips = async () => {
    for (const id of Object.keys(state.clips || {})) {
      try {
        await clipDrop(id);
      } catch (e) {}
    }
    setState(s => ({
      ...s,
      clips: {}
    }));
    setArmClips(false);
    refreshStore();
  };
  const testStorage = () => {
    try {
      const tk = "ironset-selftest",
        v = String(Date.now());
      localStorage.setItem(tk, v);
      const ok = localStorage.getItem(tk) === v;
      localStorage.removeItem(tk);
      setSaveStatus(ok ? {
        ok: true,
        msg: "Saving works on this device. ✓"
      } : {
        ok: false,
        msg: "Couldn't read data back — Private Browsing may be blocking storage."
      });
    } catch (e) {
      setSaveStatus({
        ok: false,
        msg: "Storage blocked: " + (e && e.message || String(e)) + " — turn off Private Browsing."
      });
    }
  };
  const [dlOk, setDlOk] = useState(false);
  const fileRef = useRef(null);
  const exportData = () => setBackup(JSON.stringify(state));
  const applyBackup = txt => {
    setErr("");
    try {
      const p = JSON.parse(txt);
      if (!p || typeof p !== "object" || !p.exercises) throw new Error("bad shape");
      setState({
        ...DEFAULT,
        ...p,
        settings: {
          ...DEFAULT.settings,
          ...(p.settings || {})
        }
      });
      onClose();
    } catch (e) {
      setErr("That doesn't look like valid IRONSET backup data.");
    }
  };
  const downloadBackup = () => {
    setErr("");
    try {
      const d = new Date();
      const stamp = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      const blob = new Blob([JSON.stringify(state)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ironset-backup-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setDlOk(true);
      setTimeout(() => setDlOk(false), 2500);
    } catch (e) {
      setErr("Couldn't create the file — use Show backup and copy the text instead.");
    }
  };
  const pickFile = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => applyBackup(String(r.result || ""));
    r.onerror = () => setErr("Couldn't read that file.");
    r.readAsText(f);
    e.target.value = "";
  };
  const importData = () => applyBackup(importText);
  const row = {
    marginBottom: 18
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "Settings"
  }, /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 8
    }
  }, "Training style"), /*#__PURE__*/React.createElement(Segmented, {
    value: settings.trainingMode || "rpe",
    onChange: v => {
      if (v === "percent") {
        setSetting("trainingMode", "percent");
        setSetting("inputMode", "rir");
      } else {
        setSetting("trainingMode", "rpe");
        setSetting("inputMode", "rpe");
      }
    },
    options: [{
      value: "rpe",
      label: "RPE"
    }, {
      value: "percent",
      label: "%"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 6
    }
  }, settings.trainingMode === "percent" ? "Prescribe by reps and a % of your max." : "Prescribe by reps and RPE — the app suggests the load.")), settings.trainingMode === "percent" && /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 8
    }
  }, "Percentages run off"), /*#__PURE__*/React.createElement(Segmented, {
    value: settings.maxMode || "dynamic",
    onChange: v => setSetting("maxMode", v),
    options: [{
      value: "dynamic",
      label: "Estimated max"
    }, {
      value: "locked",
      label: "Max I set"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 6
    }
  }, settings.maxMode === "locked" ? "A training max you set per lift and bump yourself each cycle." : "Your live estimated max — auto-updates as you log.")), /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 8
    }
  }, "Units"), /*#__PURE__*/React.createElement(Segmented, {
    value: settings.unit,
    onChange: v => {
      if (v === settings.unit) return;
      const f = v === "kg" ? 1 / LBKG : LBKG;
      const cv = w => typeof w === "number" ? Math.round(w * f * 10) / 10 : w;
      setState(s => {
        const exercises = {};
        for (const [k, e] of Object.entries(s.exercises)) exercises[k] = {
          ...e,
          sets: e.sets.map(st => ({
            ...st,
            weight: cv(st.weight),
            rec: st.rec != null ? cv(st.rec) : st.rec
          })),
          tmax: e.tmax != null ? cv(e.tmax) : e.tmax
        };
        return {
          ...s,
          exercises,
          settings: {
            ...s.settings,
            unit: v,
            bar: roundTo((s.settings.bar || 0) * f, v === "kg" ? 2.5 : 5),
            round: v === "kg" ? 2.5 : 5,
            unitSchema: 2
          }
        };
      });
    },
    options: [{
      value: "lb",
      label: "LB"
    }, {
      value: "kg",
      label: "KG"
    }]
  })), settings.trainingMode !== "percent" && /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 8
    }
  }, "Prescribe intensity as"), /*#__PURE__*/React.createElement(Segmented, {
    value: settings.inputMode,
    onChange: v => setSetting("inputMode", v),
    options: [{
      value: "rpe",
      label: "RPE"
    }, {
      value: "rir",
      label: "RIR"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginTop: 6
    }
  }, "RPE 8 and 2 RIR mean the same thing \u2014 pick the scale you think in.")), /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 8
    }
  }, "Round loads to nearest"), /*#__PURE__*/React.createElement(Segmented, {
    value: settings.round,
    onChange: v => setSetting("round", v),
    options: [{
      value: 1,
      label: "1"
    }, {
      value: 2.5,
      label: "2.5"
    }, {
      value: 5,
      label: "5"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 8
    }
  }, "Bar weight (for plate math)"), /*#__PURE__*/React.createElement(NumField, {
    value: settings.bar,
    onChange: v => setSetting("bar", parseFloat(v) || 0),
    suffix: settings.unit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${C.line}`,
      paddingTop: 16,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 8
    }
  }, "This device"), /*#__PURE__*/React.createElement(DeviceRow, {
    on: !!(store && store.installed),
    title: store && store.installed ? "Installed" : "Not installed",
    note: store && store.installed ? "Opens like any other app, full screen, with no browser chrome." : isApple() ? "Tap Share, then Add to Home Screen — it then opens full screen and keeps your training safely." : "Add it to your home screen and it opens full screen, offline, with your training kept safe.",
    action: canInstall ? /*#__PURE__*/React.createElement(Btn, {
      kind: "primary",
      onClick: doInstall,
      style: {
        minHeight: 38,
        padding: "8px 14px",
        fontSize: 13
      }
    }, "Install") : null
  }), /*#__PURE__*/React.createElement(DeviceRow, {
    on: !!(store && store.offline),
    title: store && store.offline ? "Works offline" : "Going offline-ready",
    note: store && store.offline ? "The whole app is cached here. Train in a basement gym with no signal." : "Caching the app now — it will open with no connection once this finishes."
  }), /*#__PURE__*/React.createElement(DeviceRow, {
    on: !!(store && store.persisted),
    title: store && store.persisted ? "Storage protected" : "Storage not protected",
    note: store && store.persisted ? "Your browser has promised not to clear this app's data to reclaim space." : "Browsers quietly evict site data when a device runs low. Lock it down so your log can't go with it.",
    action: store && store.askable ? /*#__PURE__*/React.createElement(Btn, {
      kind: "primary",
      onClick: doPersist,
      style: {
        minHeight: 38,
        padding: "8px 14px",
        fontSize: 13
      }
    }, "Protect") : null
  }), (() => {
    const clips = state.clips || {};
    const n = Object.keys(clips).length;
    if (!n) return null;
    return /*#__PURE__*/React.createElement(DeviceRow, {
      on: true,
      title: `${n} set video${n === 1 ? "" : "s"} · ${fmtBytes(clipBytes(clips))}`,
      note: "Kept on this device and nowhere else. The oldest go automatically when the space runs short; a backup file carries your log but not the footage.",
      action: /*#__PURE__*/React.createElement(Btn, {
        kind: "ghost",
        onClick: () => setArmClips(true),
        style: {
          minHeight: 38,
          padding: "8px 12px",
          fontSize: 12.5,
          color: C.red
        }
      }, "Delete all")
    });
  })(), armClips && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    onClick: clearClips,
    style: {
      flex: 1
    }
  }, "Delete every video"), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: () => setArmClips(false),
    style: {
      flex: 1
    }
  }, "Keep them")), store && store.quota > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11.5,
      color: C.faint,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", null, "Space used"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      color: C.muted
    }
  }, fmtBytes(store.usage), " of ", fmtBytes(store.quota))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      borderRadius: 3,
      background: C.line,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${Math.max(1, Math.min(100, store.usage / store.quota * 100))}%`,
      background: C.red,
      borderRadius: 3
    }
  }))), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: testStorage,
    style: {
      width: "100%",
      marginTop: 12,
      fontSize: 12.5,
      minHeight: 38
    }
  }, "Test saving on this device"), saveStatus && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      marginTop: 8,
      fontWeight: 600,
      color: saveStatus.ok ? C.good : C.red
    }
  }, saveStatus.msg)), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${C.line}`,
      paddingTop: 16,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 8
    }
  }, "Recently deleted"), (state.trash || []).length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginBottom: 18,
      lineHeight: 1.5
    }
  }, "Nothing deleted. Lifts you remove land here so you can bring them back.") : /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, (state.trash || []).map(x => /*#__PURE__*/React.createElement("div", {
    key: x.name,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "10px 0",
      borderTop: `1px solid ${C.line}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5
    }
  }, x.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: C.faint,
      marginTop: 2
    }
  }, x.ex && x.ex.sets ? x.ex.sets.length : 0, " sets \xB7 deleted ", dshort(x.ts))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    onClick: () => restoreExercise(x.name),
    style: {
      minHeight: 38,
      padding: "8px 14px",
      fontSize: 13
    }
  }, "Restore"), /*#__PURE__*/React.createElement("button", {
    onClick: () => purgeExercise(x.name),
    "aria-label": "Remove permanently",
    style: {
      background: "none",
      border: "none",
      color: C.faint,
      cursor: "pointer",
      padding: 6
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 16
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label,
      fontSize: 10,
      marginBottom: 4
    }
  }, "Backup"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: C.faint,
      marginBottom: 9,
      lineHeight: 1.5
    }
  }, "Your training is saved on this device only. Download a backup file now and then \u2014 clearing your browser data would otherwise wipe it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    onClick: downloadBackup,
    style: {
      flex: 1
    }
  }, dlOk ? "Saved ✓" : "Download backup"), /*#__PURE__*/React.createElement(Btn, {
    kind: "solid",
    onClick: () => fileRef.current && fileRef.current.click(),
    style: {
      flex: 1
    }
  }, "Restore from file")), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "application/json,.json",
    onChange: pickFile,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: exportData,
    style: {
      flex: 1,
      fontSize: 12.5,
      minHeight: 38
    }
  }, "Show as text"), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: importData,
    style: {
      flex: 1,
      fontSize: 12.5,
      minHeight: 38
    },
    disabled: !importText.trim()
  }, "Restore from text")), backup && /*#__PURE__*/React.createElement("textarea", {
    readOnly: true,
    value: backup,
    onFocus: e => e.target.select(),
    rows: 3,
    style: {
      width: "100%",
      marginTop: 8,
      background: C.bg,
      border: `1px solid ${C.line}`,
      borderRadius: 8,
      color: C.muted,
      fontSize: 11,
      fontFamily: MONO,
      padding: 8,
      resize: "vertical"
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    value: importText,
    onChange: e => setImportText(e.target.value),
    placeholder: "Paste backup data here to restore",
    rows: 2,
    style: {
      width: "100%",
      marginTop: 8,
      background: C.bg,
      border: `1px solid ${C.line}`,
      borderRadius: 8,
      color: C.text,
      fontSize: 11,
      fontFamily: MONO,
      padding: 8,
      resize: "vertical",
      outline: "none"
    }
  }), err && /*#__PURE__*/React.createElement("div", {
    style: {
      color: C.red,
      fontSize: 12,
      marginTop: 6
    }
  }, err)), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: `1px solid ${C.line}`,
      paddingTop: 16,
      marginTop: 16
    }
  }, armReset ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    onClick: async () => {
      for (const id of Object.keys(state.clips || {})) {
        try {
          await clipDrop(id);
        } catch (e) {}
      }
      setState(DEFAULT);
      setArmReset(false);
      onClose();
    },
    style: {
      flex: 1
    }
  }, "Yes, erase everything"), /*#__PURE__*/React.createElement(Btn, {
    kind: "ghost",
    onClick: () => setArmReset(false),
    style: {
      flex: 1
    }
  }, "Cancel")) : /*#__PURE__*/React.createElement(Btn, {
    kind: "danger",
    onClick: () => setArmReset(true),
    style: {
      width: "100%"
    }
  }, "Reset all data")));
}
class Boundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      err: null
    };
  }
  static getDerivedStateFromError(err) {
    return {
      err
    };
  }
  componentDidCatch(e, info) {
    console.error(e, info);
  }
  render() {
    if (this.state.err) return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 20,
        minHeight: "100vh",
        background: "#0C0D10",
        color: "#ECEAE3",
        fontFamily: "system-ui, sans-serif"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 800,
        marginBottom: 8
      }
    }, "IRONSET hit an error"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "#9098A4",
        marginBottom: 10
      }
    }, "Reload the page. Your saved data on this device is untouched."), /*#__PURE__*/React.createElement("pre", {
      style: {
        whiteSpace: "pre-wrap",
        fontSize: 11,
        color: "#E23B2E"
      }
    }, String(this.state.err && this.state.err.message || this.state.err)));
    return this.props.children;
  }
}
ReactDOM.createRoot(document.getElementById("root")).render( /*#__PURE__*/React.createElement(Boundary, null, /*#__PURE__*/React.createElement(App, null)));