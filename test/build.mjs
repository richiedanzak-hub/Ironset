/* Build me a block, after the recommended door stopped being less capable than
   the manual one: set the length, move the start, see the week, then commit. */
import { open } from './harness.mjs';
let F = 0;
const say = (b, m) => { if (!b) F++; console.log((b ? 'PASS ' : 'FAIL ') + m); };
const body = (p) => p.evaluate(() => document.body.innerText);
const go = async (p, t) => { await p.evaluate((x) => { const el = [...document.querySelectorAll('button')]
  .filter((y) => y.textContent.trim() === x).pop(); if (el) el.click(); }, t); await p.waitForTimeout(900); };
const pick = async (p, re) => { const hit = await p.evaluate((src) => { const rx = new RegExp(src);
  const el = [...document.querySelectorAll('button')].filter((x) => rx.test(x.textContent.trim())).pop();
  if (el) { el.click(); return el.textContent.trim().slice(0, 40); } return null; }, re);
  await p.waitForTimeout(500); return hit; };
const stepper = (p, name, dir) => p.evaluate(([n, d]) => {
  const lab = [...document.querySelectorAll('div')].find((x) => x.textContent.trim() === n && !x.children.length);
  if (!lab) return false;
  const btns = [...lab.parentElement.querySelectorAll('button')];
  btns[d > 0 ? btns.length - 1 : 0].click(); return true;
}, [name, dir]);
const stepVal = (p, name) => p.evaluate((n) => {
  const lab = [...document.querySelectorAll('div')].find((x) => x.textContent.trim() === n && !x.children.length);
  if (!lab) return null;
  return (lab.parentElement.textContent || '').replace(n, '').replace(/[−+-]/g, '').trim();
}, name);

const SEED = new Function(`
  const now = Date.now(), DAY = 864e5;
  const S = (w,r,rpe,d) => ({ id:'x'+Math.random().toString(36).slice(2), ts: now-d*DAY,
    weight:w, reps:r, rpe, backoff:false });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: { 'Low-Bar Squat': { name:'Low-Bar Squat', sets:[S(455,5,8,14),S(475,3,8,5)] },
      'Bench Press': { name:'Bench Press', sets:[S(275,5,8,12),S(285,3,8,4)] },
      'Deadlift': { name:'Deadlift', sets:[S(545,3,8,10),S(565,2,9,3)] } },
    bodyweight: [{ts:now-DAY,kg:125}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{}, ticks:{},
    program: null,
    settings:{unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',maxMode:'dynamic',
      topPct:85,onboarded:true,tour:true,backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}},
  }));`);

const { b, p, errs } = await open(SEED);
await go(p, 'Plan');
await pick(p, 'Build me a block');
await p.waitForTimeout(500);

// Answer the flow, skipping anything optional.
for (let i = 0; i < 14; i++) {
  const t = await body(p);
  if (/My pick/i.test(t)) break;
  if (/What are you training for/i.test(t)) { await pick(p, '^Get stronger'); continue; }
  if (/How many days a week/i.test(t)) { await pick(p, '^4 days'); continue; }
  if (/How long have you trained/i.test(t)) { await pick(p, '^Intermediate'); continue; }
  if (/What do you have to train with/i.test(t)) { await pick(p, '^A full gym'); continue; }
  if (/Which lift is furthest behind/i.test(t)) { await pick(p, '^Bench'); continue; }
  if (/break down/i.test(t)) { await pick(p, '^Off the chest'); continue; }
  if (/working around/i.test(t)) { await pick(p, 'Nothing to work around|^Continue with'); continue; }
  if (/handle volume/i.test(t)) { await pick(p, 'Somewhere in the middle'); continue; }
  if (/bodyweight going/i.test(t)) { await pick(p, '^Holding steady'); continue; }
  if (!(await pick(p, '^Skip this'))) break;
}
const t = await body(p);
if (!/My pick/i.test(t)) console.log('--- STUCK ON ---\n' + t.slice(0, 900) + '\n---');
say(/My pick/i.test(t), 'it reaches a recommendation');
say(/Because /.test(t), 'and says why: ' + (t.match(/Because [^\n]{0,80}/) || ['-'])[0]);

/* The part that did not exist: shape it before you take it. */
say(/Weeks/.test(t), 'the pick carries a length control');
say(/Starts/.test(t), 'and a start date');
say(/Week one/i.test(t), 'and shows week one before you commit');
const weeks0 = await stepVal(p, 'Weeks');
await stepper(p, 'Weeks', 1); await p.waitForTimeout(450);
const weeks1 = await stepVal(p, 'Weeks');
say(weeks1 && weeks0 && Number(weeks1) === Number(weeks0) + 1,
  `the length actually changes: ${weeks0} → ${weeks1}`);
say(new RegExp(`${weeks1} weeks in all`, 'i').test(await body(p)), 'and the preview heading follows it');

// The runner-up can be set up instead.
say(/Set this one up instead/.test(t), 'the other picks can be chosen instead');
await pick(p, 'Set this one up instead');
await p.waitForTimeout(600);
const t2 = await body(p);
say((t2.match(/Week one/gi) || []).length === 1, 'only the selected pick shows its setup');

// Commit, and check the block landed with the weeks asked for.
const started = await pick(p, '^Start ');
say(!!started, 'and it starts: ' + started);
await p.waitForTimeout(1200);
const st = await p.evaluate(() => JSON.parse(localStorage.getItem('lift-weight-suggester-v1')));
const keys = Object.keys((st.program || {}).days || {}).sort();
say(keys.length > 0, 'a block landed on the calendar: ' + keys.length + ' sessions');
const span = keys.length ? Math.round((new Date(keys[keys.length-1]) - new Date(keys[0])) / 864e5 / 7) + 1 : 0;
say(span >= 4, `and it runs the length that was set: about ${span} weeks`);

console.log('errors: ' + (errs.length ? errs.join(' | ') : 'none'));
if (errs.length) F++;
console.log(F ? 'FAILS ' + F : 'ALL PASS');
await b.close();
