/* The third tracking level: work that shows up in the session, gets ticked off,
   and is never asked to name a weight. */
import { open } from './harness.mjs';
const ok = (b, ...m) => (b ? 'PASS' : 'FAIL') + ' ' + m.join(' ');
const iso = (d) => { const x = new Date(); x.setDate(x.getDate() + d);
  return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
const SEED = (tick) => new Function(`
  const now = Date.now(), DAY = 864e5;
  const is = (d) => { const x = new Date(); x.setDate(x.getDate()+d);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  const mk = (w,r,rpe,d) => ({ id:'x'+Math.random().toString(36).slice(2), ts: now-d*DAY, weight:w, reps:r, rpe, backoff:false });
  const sl = (ex, role, sets, reps) => ({ id:'id'+ex.replace(/\\W/g,''), ex, metric:'reps', role: role,
    sets, reps, mode:'rpe', val:8, bo:null, note:'' });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: {
      'Low-Bar Squat': { name:'Low-Bar Squat', sets:[mk(455,5,8,21),mk(495,3,8,7)] },
      'Barbell Row': { name:'Barbell Row', accessory:true, sets:[mk(185,8,8,7)] },
      'Face Pull': { name:'Face Pull', accessory:true, tick: ${tick ? 'true' : 'false'}, sets: [] },
    },
    bodyweight: [{ts:now-DAY,kg:125}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: { name:'Block', startDate:is(0), active:true, days: {
      [is(0)]: [sl('Low-Bar Squat','main',3,4), sl('Barbell Row','accessory',3,8), sl('Face Pull','accessory',3,15)],
    } },
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
      topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }));`);
const body = (p) => p.evaluate(() => document.body.innerText);
const store = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('lift-weight-suggester-v1')));
const go = async (p, t) => { await p.evaluate((x) => { const el = [...document.querySelectorAll('button')]
  .find((y) => y.textContent.trim() === x); if (el) el.click(); }, t); await p.waitForTimeout(900); };
const tap = async (p, re) => { const hit = await p.evaluate((src) => { const rx = new RegExp(src);
  const el = [...document.querySelectorAll('button,[role="button"]')]
    .filter((x) => rx.test(((x.getAttribute('aria-label') || '') + ' ' + x.textContent.trim().replace(/\s+/g, ' ')).trim()))[0];
  if (el) { el.click(); return true; } return false; }, re);
  if (!hit) console.log('  (no control for ' + re + ') candidates:',
    await p.evaluate(() => [...document.querySelectorAll('button,[role="button"]')]
      .map((x) => JSON.stringify(x.textContent.trim().slice(0, 22))).slice(0, 26).join(' ')));
  await p.waitForTimeout(450); return hit; };

// ---- 1. choosing it in Plan ------------------------------------------------
{
  const { b, p, errs } = await open(SEED(false));
  console.log('=== CHOOSING IT ===');
  await go(p, 'Plan');
  await p.evaluate(() => { const el = [...document.querySelectorAll('button')]
    .find((x) => x.textContent.trim().startsWith('Face Pull')); if (el) el.click(); });
  await p.waitForTimeout(450);
  let t = await body(p);
  console.log('three levels offered:', ok(/Track in 1RM/.test(t) && /Log, don.t track/.test(t) && /Just tick it off/.test(t)),
    'how much to track: all three');
  console.log('load controls present:', ok(/RPE/.test(t) && /Back-offs/i.test(t)), 'before you switch it');
  await tap(p, '^Just tick it off$');
  t = await body(p);
  const st = await store(p);
  console.log('WRITES IT ON THE LIFT:', ok(st.exercises['Face Pull'].tick === true), 'exercises["Face Pull"].tick');
  console.log('HIDES THE LOAD CONTROLS:', ok(!/Back-offs/i.test(t) && !/Take sets to failure/i.test(t)),
    'no effort, no failure setting, no back-offs');
  console.log('keeps the shape       :', ok(/Sets/i.test(t) && /Reps/i.test(t)), 'sets and reps still say what the work is');
  console.log('summary drops the load:', ok(/3 × 15/.test(t) && !/3×15 @/.test(t)), (t.match(/3 × 15[^\n]*/) || [''])[0]);
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 2. training it --------------------------------------------------------
{
  const { b, p, errs } = await open(SEED(true));
  console.log('\n=== TRAINING IT ===');
  await go(p, 'Train');
  let t = await body(p);
  console.log('it is in the session :', ok(/Face Pull/.test(t)));
  console.log('day counts it        :', ok(/\/7 DONE/.test(t)), (t.match(/\d+\/\d+ \w+/) || [''])[0] + ' — 3 + 3 sets plus one thing to tick');
  await tap(p, '^Face Pull');
  t = await body(p);
  console.log('NO WEIGHT TO PICK    :', ok(!/Weight · sugg/.test(t) && !/Log set/.test(t)),
    'the weight / reps / RPE card is gone');
  console.log('ONE BUTTON INSTEAD   :', ok(/Mark done/.test(t)), (t.match(/The plan asks for[^\n]*/) || [''])[0]);
  await tap(p, '^Mark done$');
  t = await body(p);
  const st = await store(p);
  const day = (st.ticks || {})[Object.keys(st.ticks || {})[0]] || {};
  console.log('RECORDS THE TICK     :', ok(!!day['Face Pull']), 'ticks = ' + JSON.stringify(Object.keys(st.ticks || {})) + ' → ' + Object.keys(day));
  console.log('button flips         :', ok(/tap to undo/i.test(t)));
  console.log('day progress moves   :', ok(/1\/7 DONE/.test(t)), (t.match(/\d+\/\d+ DONE/) || [''])[0]);
  console.log('LOGS NO SETS         :', ok(st.exercises['Face Pull'].sets.length === 0),
    'nothing fake in the history, so nothing reaches the estimator');
  await tap(p, 'tap to undo');
  console.log('and undoes           :', ok(!((await store(p)).ticks || {})[iso(0)]), 'the tick comes back off');
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 3. without opening it -------------------------------------------------
{
  const { b, p, errs } = await open(SEED(true));
  console.log('\n=== WITHOUT OPENING IT ===');
  await go(p, 'Train');
  // The session is the screen now, so there is no sheet to open first: the row
  // is already in front of you with its circle on it.
  const before = await p.evaluate(() => (document.body.innerText.match(/Log set \d/) || [''])[0]);
  console.log('the row is on screen :', ok(/Face Pull/.test(await body(p))));
  await tap(p, 'Mark Face Pull done');
  const st = await store(p);
  const day = (st.ticks || {})[Object.keys(st.ticks || {})[0]] || {};
  console.log('TICKS FROM THE LIST  :', ok(!!day['Face Pull']), 'one tap, from the row itself');
  console.log('without switching to it:', ok((await p.evaluate(() => (document.body.innerText.match(/Log set \d/) || [''])[0])) === before),
    'the logger is still on the lift you were doing');
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}
