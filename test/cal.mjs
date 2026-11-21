import { open } from './harness.mjs';
let F = 0;
const ok = (c, m) => { if (!c) { F++; console.log('FAIL: ' + m); } else console.log('pass: ' + m); };

const D = (n) => { const d = new Date(); d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
const TS = (n) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(12,0,0,0); return d.getTime(); };

// -4 planned + trained, -3 planned + skipped, -2 nothing planned but trained,
// -1 planned, ticked only (no sets), +2 planned ahead.
const seed = `(() => {
  const S = {
    unit:'lb', inputMode:'rpe', bodyweight:220, onboarded:true, ticks:{ '${D(-1)}': { 'Lat Pulldown': true } },
    exercises: {
      'Low-Bar Squat': { bar:45, round:5, sets:[{w:405,r:5,rpe:8,ts:${TS(-4)}}].map(x=>({id:'a'+x.ts,weight:x.w,reps:x.r,rpe:x.rpe,ts:x.ts})) },
      'Bench Press': { bar:45, round:5, sets:[{w:275,r:5,rpe:8,ts:${TS(-2)}}].map(x=>({id:'b'+x.ts,weight:x.w,reps:x.r,rpe:x.rpe,ts:x.ts})) },
      'Lat Pulldown': { bar:0, round:5, tick:true, sets:[] }
    },
    program: { active:true, start:'${D(-4)}', days: {
      '${D(-4)}': [{ id:'s1', ex:'Low-Bar Squat', role:'main', sets:3, reps:5, mode:'rpe', val:8 }],
      '${D(-3)}': [{ id:'s2', ex:'Bench Press', role:'main', sets:3, reps:5, mode:'rpe', val:8 }],
      '${D(-1)}': [{ id:'s3', ex:'Lat Pulldown', role:'accessory', sets:3, reps:10 }],
      '${D(2)}':  [{ id:'s4', ex:'Low-Bar Squat', role:'main', sets:3, reps:3, mode:'rpe', val:8.5 }]
    } }
  };
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify(S));
})()`;

const { b, p, errs } = await open(seed);
await p.getByRole('button', { name: 'Plan' }).first().click();
await p.waitForTimeout(500);

const read = (ds) => p.evaluate((d) => {
  const el = document.querySelector(`[data-date="${d}"]`);
  if (!el) return null;
  const marks = [...el.querySelectorAll('span span')].map((s) => {
    const c = getComputedStyle(s);
    return { fill: c.backgroundColor !== 'rgba(0, 0, 0, 0)', ring: c.borderTopWidth !== '0px',
             dim: Math.abs(parseFloat(c.opacity) - 0.5) < 0.1 };
  });
  return { label: el.getAttribute('aria-label'), dashed: getComputedStyle(el).borderTopStyle, marks };
}, ds);

const dates = { done: D(-4), missed: D(-3), extra: D(-2), ticked: D(-1), ahead: D(2), rest: D(1) };

const done = await read(dates.done);
ok(done && /trained/.test(done.label) && !/not trained/.test(done.label), 'planned + trained reads "trained": ' + (done && done.label));
ok(done && done.marks.length === 1 && done.marks[0].fill && !done.marks[0].dim, 'trained day: solid mark');

const missed = await read(dates.missed);
ok(missed && /not trained/.test(missed.label), 'planned + skipped reads "not trained": ' + (missed && missed.label));
ok(missed && missed.marks.length === 1 && missed.marks[0].ring && !missed.marks[0].fill, 'missed day: hollow ring');
ok(missed && missed.dashed === 'dashed', 'missed day: dashed cell border, got ' + (missed && missed.dashed));

const ahead = await read(dates.ahead);
ok(ahead && /, 1 planned$/.test(ahead.label), 'future planned reads "1 planned": ' + (ahead && ahead.label));
ok(ahead && ahead.marks.length === 1 && ahead.marks[0].fill && ahead.marks[0].dim, 'future day: faint mark');
ok(ahead && ahead.dashed !== 'dashed', 'future day is NOT drawn as missed');

const extra = await read(dates.extra);
ok(extra && /^.*trained, 1 logged$/.test(extra.label), 'off-plan work still reads trained: ' + (extra && extra.label));

// THE tick bug: a day of nothing but ticked accessories must not read as skipped.
const ticked = await read(dates.ticked);
ok(ticked && !/not trained/.test(ticked.label), 'ticked-only day is not "not trained": ' + (ticked && ticked.label));
ok(ticked && ticked.dashed !== 'dashed', 'ticked-only day not dashed');

const rest = await read(dates.rest);
ok(rest && /nothing planned/.test(rest.label), 'empty day reads "nothing planned": ' + (rest && rest.label));
ok(rest && rest.marks.length === 0, 'empty day has no marks');

const body = await p.evaluate(() => document.body.innerText);
ok(/trained/i.test(body) && /missed/i.test(body) && /ahead/i.test(body), 'legend names all three states');

console.log('ERRORS: ' + (errs.length ? errs.join(' | ') : 'none'));
console.log(F ? 'FAILS ' + F : 'ALL PASS');
await b.close();
