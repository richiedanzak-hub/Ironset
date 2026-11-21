/* The thing you are trying to progress should not read like the thing that
   supports it. */
import { open } from './harness.mjs';
let F = 0;
const say = (b, m) => { if (!b) F++; console.log((b ? 'PASS ' : 'FAIL ') + m); };
const body = (p) => p.evaluate(() => document.body.innerText);
const go = async (p, t) => { await p.evaluate((x) => { const el = [...document.querySelectorAll('button')]
  .filter((y) => y.textContent.trim() === x).pop(); if (el) el.click(); }, t); await p.waitForTimeout(900); };

const SEED = new Function(`
  const now = Date.now(), DAY = 864e5;
  const S = (w,d) => ({ id:'x'+Math.random().toString(36).slice(2), ts: now-d*DAY, weight:w, reps:1, rpe:10, backoff:false });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: {
      'Low-Bar Squat': { name:'Low-Bar Squat', sets:[S(495,20),S(500,6)] },
      'Bench Press': { name:'Bench Press', sets:[S(315,18),S(320,5)] },
      '3ct Pause Squat': { name:'3ct Pause Squat', parent:'Low-Bar Squat', sets:[S(425,16),S(430,4)] },
      'Pin Squat': { name:'Pin Squat', parent:'Low-Bar Squat', sets:[S(445,14),S(450,3)] },
      'Leg Curl': { name:'Leg Curl', accessory:true, sets:[S(120,10)] },
    },
    bodyweight: [{ts:now-DAY,kg:125}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: null,
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
      topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }));`);

const { b, p, errs } = await open(SEED);
await go(p, 'History');
await p.waitForTimeout(400);

// Open the picker from History.
await p.evaluate(() => { const el = [...document.querySelectorAll('button')]
  .find((x) => /History for/i.test(x.textContent)); if (el) el.click(); });
await p.waitForTimeout(600);
const t = await body(p);
const at = (x) => t.toUpperCase().indexOf(x.toUpperCase());

say(at("What you're progressing") >= 0, 'the picker names what you are progressing');
say(at('Variations of them') >= 0, 'and separates their variations');
say(at('Accessories') >= 0, 'and the accessories');
say(at("What you're progressing") < at('Variations of them')
  && at('Variations of them') < at('Accessories'), 'in that order');

// The competition lifts are above the line, the variations below it.
const pos = (n) => t.indexOf(n);
say(pos('Low-Bar Squat') < at('Variations of them')
  && pos('Bench Press') < at('Variations of them'), 'squat and bench sit above the variations');
say(pos('3ct Pause Squat') > at('Variations of them')
  && pos('Pin Squat') > at('Variations of them'), 'the pause and pin squats sit under it');
say(pos('Leg Curl') > at('Accessories'), 'the leg curl is an accessory');

// A variation says what it is worth as a share of the lift it supports.
say(/8\d% of Squat/.test(t), 'a variation is priced against its parent: '
  + (t.match(/\d+% of Squat/) || ['-'])[0]);

// And History itself places the lift you are looking at.
await p.evaluate(() => { const el = [...document.querySelectorAll('button')]
  .filter((x) => /^3ct Pause Squat/.test(x.textContent.trim())).pop(); if (el) el.click(); });
await p.waitForTimeout(700);
const h = await body(p);
say(/A variation of Squat — worth 8\d% of it/.test(h),
  'History says where the lift sits: ' + (h.match(/A variation of [^\n]*/) || ['-'])[0]);

console.log('errors: ' + (errs.length ? errs.join(' | ') : 'none'));
if (errs.length) F++;
console.log(F ? 'FAILS ' + F : 'ALL PASS');
await b.close();
