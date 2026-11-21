/* The Plan editor after it stopped being eight ungrouped controls in
   dependency-inverted order, and the two model fields nothing ever showed. */
import { open } from './harness.mjs';
let F = 0;
const say = (b, m) => { if (!b) F++; console.log((b ? 'PASS ' : 'FAIL ') + m); };
const body = (p) => p.evaluate(() => document.body.innerText);
const go = async (p, t) => { await p.evaluate((x) => { const el = [...document.querySelectorAll('button')]
  .filter((y) => y.textContent.trim() === x).pop(); if (el) el.click(); }, t); await p.waitForTimeout(1000); };
const store = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('lift-weight-suggester-v1')));

const SEED = new Function(`
  const now = Date.now(), DAY = 864e5;
  const is = (d) => { const x = new Date(); x.setDate(x.getDate()+d);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: { 'Low-Bar Squat': { name:'Low-Bar Squat', sets:[
        { id:'a', ts: now-7*DAY, weight:455, reps:5, rpe:8, backoff:false } ] },
      'Leg Curl': { name:'Leg Curl', accessory:true, tick:true, sets:[] } },
    bodyweight: [{ts:now-DAY,kg:100}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: { name:'Block', startDate:is(0), active:true, days: {
      [is(0)]: [
        { id:'sq', ex:'Low-Bar Squat', metric:'reps', role:'main', sets:1, reps:3, mode:'rpe', val:8,
          note:'Tempo 3-1-1, beltless', rest:180, bo:{ sets:2, reps:6, mode:'rpe', val:7 } },
        { id:'lc', ex:'Leg Curl', metric:'reps', role:'accessory', sets:3, reps:12, mode:'rpe', val:8, note:'' } ],
    } },
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
      topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }));`);

const { b, p, errs } = await open(SEED);
await go(p, 'Plan');

// The collapsed line already carries the note.
say(/Tempo 3-1-1/.test(await body(p)), 'the plan summary shows the note');

// Open the squat slot.
await p.evaluate(() => { const el = [...document.querySelectorAll('button')]
  .find((x) => /Low-Bar Squat/.test(x.textContent) && /@/.test(x.textContent)); if (el) el.click(); });
await p.waitForTimeout(500);
const t = await body(p);

// Four sections, and they appear in dependency order.
const at = (s) => t.toUpperCase().indexOf(s.toUpperCase());
for (const h of ['The work', 'After the top set', 'How it is run', 'This movement'])
  say(at(h) >= 0, `section heading present: "${h}"`);
say(at('The work') < at('After the top set')
  && at('After the top set') < at('How it is run')
  && at('How it is run') < at('This movement'), 'sections run in dependency order');

// "Measured in" chose the meaning of the steppers and used to sit BELOW them.
say(at('The work') < at('Sets') && at('RPE') < at('Take sets to failure'),
  'the mode control comes before the numbers it governs');

// The two fields that nothing ever showed.
say(/3:00/.test(t), 'rest reads 3:00 in the editor');
const noteVal = await p.evaluate(() => { const i = [...document.querySelectorAll('input')]
  .find((x) => x.placeholder && /Tempo/.test(x.placeholder)); return i ? i.value : null; });
say(noteVal === 'Tempo 3-1-1, beltless', 'the note is editable, loaded with its value: ' + noteVal);

// Editing the note writes through to the plan.
await p.evaluate(() => { const i = [...document.querySelectorAll('input')]
  .find((x) => x.placeholder && /Tempo/.test(x.placeholder));
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  set.call(i, 'Pause 2ct in the hole');
  i.dispatchEvent(new Event('input', { bubbles: true })); });
await p.waitForTimeout(500);
const st = await store(p);
const day = Object.values(st.program.days)[0];
say(day[0].note === 'Pause 2ct in the hole', 'the edit reached the plan: ' + JSON.stringify(day[0].note));

// A tick-only slot must not be shown the controls it has no use for.
await p.evaluate(() => { const el = [...document.querySelectorAll('button')]
  .find((x) => /Leg Curl/.test(x.textContent) && /12/.test(x.textContent)); if (el) el.click(); });
await p.waitForTimeout(500);
const t2 = await body(p);
say(/Just tick it off/.test(t2), 'the tick-only slot still offers its tracking choice');
say(!/Take sets to failure/.test(t2.slice(t2.indexOf('Leg Curl'))),
  'a tick-only slot is not asked about taking sets to failure');

/* ---- Train reads both out ---- */
await go(p, 'Train');
const tt = await body(p);
say(/Pause 2ct in the hole/.test(tt), 'Train prints the plan\'s note');
say(/3:00 rest/i.test(tt), 'Train states the prescribed rest: ' + (tt.match(/[\d:]+ rest/i) || ['-'])[0]);

if (F) console.log('--- TRAIN SCREEN ---\n' + tt + '\n---');
console.log('errors: ' + (errs.length ? errs.join(' | ') : 'none'));
if (errs.length) F++;
console.log(F ? 'FAILS ' + F : 'ALL PASS');
await b.close();
