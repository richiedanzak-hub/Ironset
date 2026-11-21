/* Weak-point work: diagnosed from the lifter's own variation ratios, then
   visible, reviewable and removable instead of fire-and-forget. */
import { open } from './harness.mjs';
let F = 0;
const say = (b, m) => { if (!b) F++; console.log((b ? 'PASS ' : 'FAIL ') + m); };
const body = (p) => p.evaluate(() => document.body.innerText);
const go = async (p, t) => { await p.evaluate((x) => { const el = [...document.querySelectorAll('button')]
  .filter((y) => y.textContent.trim() === x).pop(); if (el) el.click(); }, t); await p.waitForTimeout(900); };
const pick = async (p, re) => { const hit = await p.evaluate((src) => { const rx = new RegExp(src);
  const el = [...document.querySelectorAll('button')].filter((x) => rx.test(x.textContent.trim()))[0];
  if (el) { el.click(); return el.textContent.trim().slice(0, 40); } return null; }, re);
  await p.waitForTimeout(450); return hit; };

/* Squat ~500. Its PAUSE variation sits right on its usual 86%; its PIN variation
   is way under its usual 90%. Which is the app saying, in its own data, that the
   mid-range is the problem — without being told. */
const SEED = new Function(`
  const now = Date.now(), DAY = 864e5;
  const is = (d) => { const x = new Date(); x.setDate(x.getDate()+d);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  const S = (w, d) => ({ id:'x'+Math.random().toString(36).slice(2), ts: now-d*DAY,
    weight:w, reps:1, rpe:10, backoff:false });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: {
      'Low-Bar Squat': { name:'Low-Bar Squat', sets:[S(495,30),S(500,16),S(500,4)] },
      '3ct Pause Squat': { name:'3ct Pause Squat', parent:'Low-Bar Squat', sets:[S(425,28),S(430,14),S(430,6)] },
      'Pin Squat': { name:'Pin Squat', parent:'Low-Bar Squat', sets:[S(395,26),S(400,12),S(400,5)] },
      'Bench Press': { name:'Bench Press', sets:[S(315,10)] },
    },
    bodyweight: [{ts:now-DAY,kg:125}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: { name:'Block', startDate:is(0), active:true, days: {
      [is(1)]: [{ id:'s1', ex:'Low-Bar Squat', metric:'reps', role:'main', sets:3, reps:3, mode:'rpe', val:8, note:'' }],
      [is(8)]: [{ id:'s2', ex:'Low-Bar Squat', metric:'reps', role:'main', sets:3, reps:3, mode:'rpe', val:8.5, note:'' }],
    } },
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
      topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }));`);

const { b, p, errs } = await open(SEED);
await go(p, 'Plan');
say(!/Weak-point work/i.test(await body(p)), 'no review card before anything is prescribed');

await go(p, 'Fix a weak point');
await p.waitForTimeout(400);
say(/What do you have to train with/i.test(await body(p)), 'the short flow opens on equipment');
await pick(p, '^A full gym');
say(/Which lift is furthest behind/i.test(await body(p)), 'then which lift');
await pick(p, '^Squat');
const q = await body(p);
say(/break down/i.test(q), 'then where it breaks down');

/* THE NEW PART: it does not just ask, it answers from the log. */
say(/Your numbers say/i.test(q), 'it reads the sticking point off your own variations');
say(/a few inches above parallel/i.test(q), 'and it names the mid-range: ' + (q.match(/Your numbers say[^\n]*/) || ['-'])[0]);
say(/Pin Squat is 8\d% of your Squat where 90% is usual/i.test(q.replace(/\s+/g, ' ')),
  'showing its working: ' + (q.replace(/\s+/g,' ').match(/your Pin Squat is[^.]*/i) || ['-'])[0]);

await pick(p, 'A few inches above parallel');
await p.waitForTimeout(300);
// limits is multi-select: skip it
await pick(p, '^(Skip|Next|None|Continue|Nothing)');
await p.waitForTimeout(500);
const rxc = await body(p);
say(/Pin Squat/.test(rxc) && /Box Squat/.test(rxc), 'the prescription names the right movements');
const added = await pick(p, 'Add (this|these|it)|Put (this|these|it) in|Add to');
say(!!added, 'there is a button that puts it in the plan: ' + added);
await p.waitForTimeout(900);

/* ---- The follow-through that did not exist ---- */
const after = await body(p);
say(/Weak-point work/i.test(after), 'Plan now carries a weak-point review card');
say(/Squat · A few inches above parallel/i.test(after), 'it names what it is for');
say(/not yet/i.test(after), 'and says the prescribed movements have not been done');
say(/still point here|point at/i.test(after), 'and it answers whether it is working: '
  + (after.match(/Your numbers (still point here|now point at)[^.]*/) || ['-'])[0]);
// The work lands on the squat days ahead, so go and look at one.
await p.evaluate(() => { const d = new Date(); d.setDate(d.getDate()+1);
  const ds = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const el = document.querySelector(`[data-date="${ds}"]`); if (el) el.click(); });
await p.waitForTimeout(600);
const day = await body(p);
say(/Pin Squat/.test(day), 'the prescribed movement is on the squat day');
const rxBadges = await p.evaluate(() => [...document.querySelectorAll('span')]
  .filter((x) => x.textContent.trim() === 'RX').length);
say(rxBadges > 0, 'prescribed slots are badged RX in the day: ' + rxBadges);

say(/Pins set where it stalls/.test(day), 'and it carries its coaching note into the plan');
await pick(p, 'Take this work back out');
await p.waitForTimeout(800);
const gone = await body(p);
say(!/Squat · A few inches above parallel/i.test(gone), 'and it can all be taken back out');

console.log('errors: ' + (errs.length ? errs.join(' | ') : 'none'));
if (errs.length) F++;
console.log(F ? 'FAILS ' + F : 'ALL PASS');
await b.close();
