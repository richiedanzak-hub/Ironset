/* The to-failure path, end to end: one name on every screen, and a set to
   failure that actually tells you what it was worth. */
import { open } from './harness.mjs';
const ok = (b, ...m) => (b ? 'PASS' : 'FAIL') + ' ' + m.join(' ');
const body = (p) => p.evaluate(() => document.body.innerText);
const SEED = (priorReps) => new Function(`
  const now = Date.now(), DAY = 864e5;
  const is = (d) => { const x = new Date(); x.setDate(x.getDate()+d);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  const mk = (w,r,rpe,d) => ({ id:'x'+Math.random().toString(36).slice(2), ts: now-d*DAY,
    weight:w, reps:r, rpe, backoff:false });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: { 'Low-Bar Squat': { name:'Low-Bar Squat', sets:[
      mk(455,5,8,28), mk(405,${priorReps},10,14), mk(495,3,8,7) ] } },
    bodyweight: [{ts:now-DAY,kg:100}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: { name:'Block', startDate:is(0), active:true, days: {
      [is(0)]: [{ id:'sq', ex:'Low-Bar Squat', metric:'reps', role:'main', sets:1, reps:5,
                  mode:'rpe', val:8, bo:null, note:'', amrap:'last' }],
      [is(2)]: [{ id:'sq2', ex:'Low-Bar Squat', metric:'reps', role:'main', sets:3, reps:5,
                  mode:'rpe', val:8, bo:null, note:'', amrap:'all' }],
    } },
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
      topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }));`);

// React controlled input: the native setter plus an input event is the only way in.
const setWeight = (p, v) => p.evaluate((val) => {
  const inp = [...document.querySelectorAll('input[inputmode="decimal"]')]
    .find((i) => i.type === 'number' || i.type === 'text');
  if (!inp) return false;
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  set.call(inp, String(val));
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}, v);
const toTrain = async (p) => { await p.getByRole('button', { name: 'Train' }).first().click();
  await p.waitForTimeout(900); };
const logIt = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('button')]
  .find((x) => /^Log /.test(x.textContent.trim())); if (b) { b.click(); return b.textContent.trim(); } return null; });

let F = 0;
const say = (b, m) => { if (!b) F++; console.log(ok(b, m)); };

/* ---- 1. The word is "to failure", on every screen that mentions it ---- */
{
  const { b, p, errs } = await open(SEED(3));
  await toTrain(p);
  const train = await body(p);
  say(/TO FAILURE/.test(train), 'Train hero badge says TO FAILURE, not AMRAP');
  const btn = await p.evaluate(() => { const x = [...document.querySelectorAll('button')]
    .find((y) => /^Log /.test(y.textContent.trim())); return x ? x.textContent.trim() : null; });
  say(/reps? to failure$/.test(btn || ''), 'log button: "' + btn + '"');
  await p.getByRole('button', { name: 'Plan' }).first().click();
  await p.waitForTimeout(600);
  const plan = await body(p);
  say(/last to failure/i.test(plan), 'plan summary: "last to failure"');
  say(!/AMRAP/.test(plan) && !/AMRAP/.test(train), 'the word AMRAP appears nowhere');
  // Day +2 is amrap:"all"
  await p.evaluate(() => { const d = new Date(); d.setDate(d.getDate()+2);
    const ds = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
    const el = document.querySelector(`[data-date="${ds}"]`); if (el) el.click(); });
  await p.waitForTimeout(500);
  say(/all to failure/i.test(await body(p)), 'every-set version reads "all to failure"');
  console.log('  errors: ' + (errs.length ? errs.join(' | ') : 'none'));
  if (errs.length) F++;
  await b.close();
}

/* ---- 2. The payoff: a rep PR gets said out loud ---- */
for (const [prior, want, what] of [[3, /\+2 reps? at 405lb/, 'beat it: "+2 reps"'],
                                   [5, /level with your best/i, 'matched it: "level with your best"'],
                                   [8, /Your best there is 8/, 'under it: names the standing best']]) {
  const { b, p, errs } = await open(SEED(prior));
  await toTrain(p);
  say(await setWeight(p, 405), `[prior ${prior}] typed 405 into the weight box`);
  await p.waitForTimeout(250);
  await logIt(p);
  await p.waitForTimeout(600);
  const t = await body(p);
  say(want.test(t), `[prior ${prior}] ${what}`);
  if (errs.length) { F++; console.log('  errors: ' + errs.join(' | ')); }
  await b.close();
}

/* ---- 3. First time at a weight says so instead of comparing to nothing ---- */
{
  const { b, p, errs } = await open(SEED(3));
  await toTrain(p);
  await setWeight(p, 365);
  await p.waitForTimeout(250);
  await logIt(p);
  await p.waitForTimeout(600);
  const t = await body(p);
  say(/First time you.{0,3}ve taken 365lb to failure/.test(t), 'a new weight: "first time… that\'s the number to beat"');
  say(/number to beat/.test(t), 'and it frames it as a target');
  // A set NOT to failure must not produce the banner.
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('lift-weight-suggester-v1')));
  const last = st.exercises['Low-Bar Squat'].sets.slice(-1)[0];
  say(last.rpe === 10, 'the prescribed set stored at RPE 10 (0 RIR), got ' + last.rpe);
  if (errs.length) { F++; console.log('  errors: ' + errs.join(' | ')); }
  await b.close();
}

console.log(F ? 'FAILS ' + F : 'ALL PASS');

/* ---- 4. The plan's own back-off sets have to survive the walk to the gym ---- */
{
  const SEED2 = new Function(`
    const now = Date.now(), DAY = 864e5;
    const is = (d) => { const x = new Date(); x.setDate(x.getDate()+d);
      return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
    localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
      exercises: { 'Low-Bar Squat': { name:'Low-Bar Squat', sets:[
        { id:'a', ts: now-14*DAY, weight:455, reps:5, rpe:8, backoff:false } ] } },
      bodyweight: [{ts:now-DAY,kg:100}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
      program: { name:'Block', startDate:is(0), active:true, days: {
        [is(0)]: [{ id:'sq', ex:'Low-Bar Squat', metric:'reps', role:'main', sets:1, reps:3,
          mode:'rpe', val:8, note:'', bo:{ sets:3, reps:8, mode:'rpe', val:7 } }],
      } },
      // The global default deliberately disagrees with the plan on every number.
      settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
        topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:9,level:'normal',pct:75,steps:[]}},
    }));`);
  const { b, p, errs } = await open(SEED2);
  await toTrain(p);
  const t = await body(p);
  // 1 top set + 3 back-offs = 4, not the global 1 + 1 = 2.
  say(/0\s*\/\s*4\s*SETS/i.test(t), 'day progress counts the plan\'s 4 sets: ' + (t.match(/\d\/\d+ SETS/) || ['-'])[0]);
  const btn = await p.evaluate(() => { const x = [...document.querySelectorAll('button')]
    .find((y) => /^Log set/.test(y.textContent.trim())); return x ? x.textContent.trim() : null; });
  say(btn === 'Log set 1', 'logger is on set 1 of the planned four: "' + btn + '"');
  // The ledger's back-off rows must read the PLAN's 8 @ RPE 7, not 5 @ RPE 9.
  say(/8 reps\s*@\s*RPE 7/.test(t), 'back-off rows read the plan (8 @ RPE 7), not the global default');
  say(!/5 reps\s*@\s*RPE 9/.test(t), 'the global default (5 @ RPE 9) is nowhere on the screen');
  // And the global default must still be intact — the gym must not rewrite it.
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('lift-weight-suggester-v1')));
  say(st.settings.backoff.reps === 5 && st.settings.backoff.rpe === 9,
    'the global default is untouched: ' + JSON.stringify(st.settings.backoff));
  if (errs.length) { F++; console.log('  errors: ' + errs.join(' | ')); }
  await b.close();
}
console.log(F ? 'TOTAL FAILS ' + F : 'ALL PASS (final)');
