/* A speed day written in percentages. Every row of the ledger has to be printed
   in the language it was measured in — the old code put a "%" after whatever
   number it held, and those numbers were always RPEs. */
import { open } from './harness.mjs';
let F = 0;
const say = (b, m) => { if (!b) F++; console.log((b ? 'PASS ' : 'FAIL ') + m); };
const body = (p) => p.evaluate(() => document.body.innerText);
const go = async (p, t) => { await p.evaluate((x) => { const el = [...document.querySelectorAll('button')]
  .filter((y) => y.textContent.trim() === x).pop(); if (el) el.click(); }, t); await p.waitForTimeout(1000); };
const logIt = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button')]
  .find((x) => /^Log /.test(x.textContent.trim())); if (b) { b.click(); return true; } return false; });

// Locked max of 400: a 67.5% speed day is 270lb, and 5 sets across.
const SEED = new Function(`
  const now = Date.now(), DAY = 864e5;
  const is = (d) => { const x = new Date(); x.setDate(x.getDate()+d);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  const S=(w,r,rpe,d)=>({id:'x'+Math.random(),ts:now-d*DAY,weight:w,reps:r,rpe,backoff:false});
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: { 'Bench Press': { name:'Bench Press', tmax:400, sets:[S(350,3,8,21),S(365,2,8.5,10)] } },
    bodyweight: [{ts:now-DAY,kg:100}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: { name:'Block', startDate:is(0), active:true, days: { [is(0)]: [
      { id:'sb', ex:'Bench Press', metric:'reps', role:'main', sets:5, reps:3, mode:'pct', val:67.5, note:'' } ] } },
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'percent',maxMode:'locked',
      topPct:67.5,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }));`);

const { b, p, errs } = await open(SEED);
await go(p, 'Train');
const t = await body(p);

say(/3 reps @ 67\.5%/.test(t), 'the prescription reads 67.5%: ' + (t.match(/3 reps @ [\d.]+%/) || ['-'])[0]);
// Every row still to come must be the written percentage, never an RPE with a % on it.
const rows = (t.match(/3 reps @ [\d.]+%/g) || []);
say(rows.length >= 5, `all five target rows carry a percentage (${rows.length})`);
say(rows.every((r) => /67\.5%/.test(r)), 'and every one of them is 67.5%: ' + [...new Set(rows)].join(', '));
say(!/@ 8(\.5)?%/.test(t), 'no RPE 8 / 8.5 printed as "8%" or "8.5%"');

// Log one, rated light, and check the logged row.
await logIt(p);
await p.waitForTimeout(900);
const t2 = await body(p);
const got = (t2.match(/\d+lb × 3 @ [^\s]+/) || ['-'])[0];
say(/\d+lb × 3 @ 6[78](\.5)?%/.test(t2), 'the logged row reads the percentage the bar actually was: ' + got);
say(!/× 3 @ [0-9](\.5)?%\b/.test(t2), 'and not the RPE with a % stuck on it');

/* The same ledger in RPE mode must be untouched. */
const SEED2 = new Function(`
  const now = Date.now(), DAY = 864e5;
  const is = (d) => { const x = new Date(); x.setDate(x.getDate()+d);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  const S=(w,r,rpe,d)=>({id:'y'+Math.random(),ts:now-d*DAY,weight:w,reps:r,rpe,backoff:false});
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: { 'Bench Press': { name:'Bench Press', sets:[S(315,3,8,14),S(320,3,8.5,6)] } },
    bodyweight: [{ts:now-DAY,kg:100}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: { name:'Block', startDate:is(0), active:true, days: { [is(0)]: [
      { id:'rb', ex:'Bench Press', metric:'reps', role:'main', sets:3, reps:3, mode:'rpe', val:8.5, note:'' } ] } },
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
      topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }));`);
await b.close();
const two = await open(SEED2);
await go(two.p, 'Train');
const t3 = await body(two.p);
say(/3 reps @ RPE 8\.5/.test(t3), 'RPE mode still prints RPE: ' + (t3.match(/3 reps @ [^\n]*/) || ['-'])[0]);
say(!/reps @ [\d.]+%/.test(t3), 'and no percentages appear on an RPE day');

console.log('errors: ' + (errs.length ? errs.join(' | ') : 'none'));
if (errs.length || two.errs.length) F++;
console.log(F ? 'FAILS ' + F : 'ALL PASS');
await two.b.close();
