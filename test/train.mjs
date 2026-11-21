/* The Train screen after it stopped being a strip of pills over one card, and
   the loads that were never expressible: assistance, and two dumbbells. */
import { open } from './harness.mjs';
const ok = (b, ...m) => (b ? 'PASS' : 'FAIL') + ' ' + m.join(' ');
const SEED = (extra) => new Function(`
  const now = Date.now(), DAY = 864e5;
  const is = (d) => { const x = new Date(); x.setDate(x.getDate()+d);
    return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
  const mk = (w,r,rpe,d,extra) => Object.assign({ id:'x'+Math.random().toString(36).slice(2),
    ts: now-d*DAY, weight:w, reps:r, rpe, backoff:false }, extra||{});
  const sl = (ex, role, sets, reps) => ({ id:'id'+ex.replace(/\\W/g,''), ex, metric:'reps', role,
    sets, reps, mode:'rpe', val:8, bo:null, note:'' });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify(Object.assign({
    exercises: {
      'Low-Bar Squat': { name:'Low-Bar Squat', sets:[mk(455,5,8,21),mk(495,3,8,7)] },
      'Weighted Pull-Up': { name:'Weighted Pull-Up', accessory:true, bw:true, sets:[
        mk(265,8,8,14,{bwBase:220,added:45}), mk(265,8,8.5,7,{bwBase:220,added:45}) ] },
      'Dumbbell Bench': { name:'Dumbbell Bench', accessory:true, perHand:true, sets:[
        mk(160,10,8,14,{each:80}), mk(170,10,8,7,{each:85}) ] },
      'Face Pull': { name:'Face Pull', accessory:true, tick:true, sets: [] },
    },
    bodyweight: [{ts:now-DAY,kg:100}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: { name:'Block', startDate:is(0), active:true, days: {
      [is(0)]: [sl('Low-Bar Squat','main',2,4), sl('Weighted Pull-Up','accessory',3,8),
                sl('Dumbbell Bench','accessory',3,10), sl('Face Pull','accessory',3,15)],
    } },
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
      topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }, ${JSON.stringify(extra || {})})));`);
const body = (p) => p.evaluate(() => document.body.innerText);
const store = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('lift-weight-suggester-v1')));
const go = async (p, t) => { await p.evaluate((x) => { const el = [...document.querySelectorAll('button')]
  .find((y) => y.textContent.trim() === x); if (el) el.click(); }, t); await p.waitForTimeout(900); };
const tap = async (p, re) => { const hit = await p.evaluate((src) => { const rx = new RegExp(src);
  const el = [...document.querySelectorAll('button,[role="button"]')]
    .filter((x) => rx.test(((x.getAttribute('aria-label') || '') + ' ' + x.textContent.trim().replace(/\s+/g, ' ')).trim()))[0];
  if (el) { el.click(); return true; } return false; }, re);
  if (!hit) console.log('  (no control for ' + re + ')');
  await p.waitForTimeout(500); return hit; };
// The value in a labelled chip on the logger.
// The weight chip holds an <input>, so its value is not in the text.
const chip = (p, name) => p.evaluate((n) => {
  const lab = [...document.querySelectorAll('div')].find((d) => d.textContent.trim() === n && d.children.length === 0);
  if (!lab) return null;
  const box = lab.parentElement;
  const inp = box.querySelector('input');
  if (inp) return String(inp.value).trim();
  return ((box.children[1] || {}).textContent || '').trim();
}, name);
// The minus button of a chip, however many times you want it.
const nudgeDown = (p, names, times) => p.evaluate(([ns, t]) => {
  const lab = [...document.querySelectorAll('div')]
    .find((d) => ns.indexOf(d.textContent.trim()) >= 0 && d.children.length === 0);
  if (!lab) return false;
  const btns = [...lab.parentElement.querySelectorAll('button')];
  btns[0].click();
  return true;
}, [names, times]);
const nudgeMany = async (p, names, times) => {
  for (let i = 0; i < times; i++) { await nudgeDown(p, names, 1); await p.waitForTimeout(70); }
};

// ---- 1. the whole session, on one screen -----------------------------------
{
  const { b, p, errs } = await open(SEED());
  await go(p, 'Train');
  const t = await body(p);
  console.log('=== ONE SCREEN ===');
  console.log('EVERY MOVEMENT SHOWS:', ok(/Low-Bar Squat/.test(t) && /Weighted Pull-Up/.test(t)
    && /Dumbbell Bench/.test(t) && /Face Pull/.test(t)), 'all four, without tapping anything');
  console.log('the first is open   :', ok(/Log set 1/.test(t)), 'the logger is in the list, at its position');
  console.log('the rest are rows   :', ok((t.match(/@ RPE 8/g) || []).length >= 2), 'each showing what it asks for');
  console.log('tick row has a circle:', ok(await p.evaluate(() => !!document.querySelector('[aria-label="Mark Face Pull done"]'))));
  console.log('and there is no strip:', ok(!/Another lift\s*\n[\s\S]{0,40}Switch lift/.test(t)), 'nothing to thumb sideways');
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 2. it moves on by itself ----------------------------------------------
{
  const { b, p, errs } = await open(SEED());
  await go(p, 'Train');
  console.log('\n=== IT MOVES ON ===');
  const open1 = await p.evaluate(() => (document.body.innerText.match(/Log set \d/) || [''])[0]);
  await tap(p, '^Log set 1$');
  await p.waitForTimeout(1700);
  await tap(p, '^Log set 2$');
  await p.waitForTimeout(2200);
  const t = await body(p);
  console.log('two sets of two logged:', ok(open1 === 'Log set 1'));
  console.log('AUTO-ADVANCES        :', ok(/Weighted Pull-Up/.test(t) && /Just bodyweight|Added to BW|Assisted by/i.test(t)),
    'the next movement opened by itself when the squat ran out of sets');
  const st = await store(p);
  console.log('and the squat is done:', ok(st.exercises['Low-Bar Squat'].sets.length === 4), 'two new sets on file');
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 3. a pull-up is not a 465lb lift --------------------------------------
{
  const { b, p, errs } = await open(SEED());
  await go(p, 'Train');
  console.log('\n=== BODYWEIGHT, ASSISTED OR LOADED ===');
  await tap(p, '^Weighted Pull-Up');
  let t = await body(p);
  const box = parseFloat(await chip(p, 'Added to BW') || await chip(p, 'Just bodyweight') || await chip(p, 'Assisted by') || 'NaN');
  console.log('THE BOX IS WHAT YOU ADD:', ok(isFinite(box) && Math.abs(box) < 120),
    'it offers ' + box + ', not the ~250 total it used to put there');
  console.log('and says what that is :', ok(/of work, against/.test(t)), (t.match(/You[^\n]*of work[^\n]*/) || [''])[0].slice(0, 96));
  // Take a band: assistance is a negative number, which had nowhere to go before.
  await nudgeMany(p, ['Added to BW', 'Just bodyweight', 'Assisted by'], 16);
  await p.waitForTimeout(400);
  t = await body(p);
  console.log('ASSISTANCE IS SAYABLE:', ok(/Assisted by/i.test(t) && /of help/.test(t)),
    (t.match(/You minus[^\n]*/) || [''])[0].slice(0, 70));
  await tap(p, '^Log set 1$');
  await p.waitForTimeout(600);
  const st = await store(p);
  const last = st.exercises['Weighted Pull-Up'].sets.slice(-1)[0];
  console.log('stored as real work  :', ok(last.added < 0 && last.weight < last.bwBase && last.weight > 0),
    `weight ${last.weight} = bodyweight ${last.bwBase} ${last.added}`);
  await go(p, 'History');
  console.log('and reads back right :', ok(/BW−/.test(await body(p))), (((await body(p)).match(/BW[−+][\d.]+/) || [''])[0]));
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 4. two dumbbells, one load --------------------------------------------
{
  const { b, p, errs } = await open(SEED());
  await go(p, 'Train');
  console.log('\n=== TWO DUMBBELLS ===');
  await tap(p, '^Dumbbell Bench');
  const t = await body(p);
  const per = parseFloat(await chip(p, 'Per hand · sugg') || await chip(p, 'Per hand') || 'NaN');
  console.log('SUGGESTS PER HAND    :', ok(isFinite(per) && per > 40 && per < 120), 'offers ' + per + ' a hand, not the pair');
  console.log('and says the total   :', ok(/in each hand/.test(t)), (t.match(/[\d.]+lb in each hand[^\n]*/) || [''])[0]);
  await tap(p, '^Log set 1$');
  await p.waitForTimeout(600);
  const st = await store(p);
  const last = st.exercises['Dumbbell Bench'].sets.slice(-1)[0];
  console.log('STORES THE WORK      :', ok(last.each === per && last.weight === per * 2),
    `${last.each} in each hand recorded as ${last.weight} of work`);
  await go(p, 'History');
  console.log('and reads back right :', ok(new RegExp(per + 'lb×2').test(await body(p))),
    (((await body(p)).match(/[\d.]+lb×2/) || [''])[0]));
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}
