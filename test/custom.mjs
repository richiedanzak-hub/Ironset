/* The dashboard, and how much of it is the lifter's to decide. The seed is the
   situation that started this: two squats a hyphen apart, one of them empty. */
import { open } from './harness.mjs';
const ok = (b, ...m) => (b ? 'PASS' : 'FAIL') + ' ' + m.join(' ');
const SEED = (extra) => new Function(`
  const now = Date.now(), DAY = 864e5;
  const mk = (w,r,rpe,d) => ({ id:'x'+Math.random().toString(36).slice(2), ts: now-d*DAY, weight:w, reps:r, rpe, backoff:false });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: {
      // The empty duplicate sorts first, which is exactly how it used to win.
      'Low Bar Squat': { name:'Low Bar Squat', sets: [] },
      'Low-Bar Squat': { name:'Low-Bar Squat', sets:[mk(455,5,8,40),mk(475,5,8,28),mk(495,3,8,14),mk(515,3,8,4)] },
      'Competition Bench': { name:'Competition Bench', sets:[mk(290,3,8,30),mk(305,3,8,6)] },
      'Conventional Deadlift': { name:'Conventional Deadlift', sets:[mk(585,2,8,20),mk(605,2,8,5)] },
      'Overhead Press': { name:'Overhead Press', sets:[mk(185,5,8,18),mk(190,5,8,3)] },
    },
    bodyweight: [{ts:now-DAY,kg:125}], meet:{date:null,name:'',attempts:{}}, checkins:{}, clips:{},
    settings: Object.assign({unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',
      maxMode:'dynamic',topPct:85,onboarded:true,tour:true,
      backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}}, ${JSON.stringify(extra || {})}),
  }));`);

const body = (p) => p.evaluate(() => document.body.innerText);
// Just the open sheet. innerText of the whole page also carries the dashboard
// sitting behind the modal, which is how "is X in this sheet" quietly lies.
const sheet = (p) => p.evaluate(() => {
  const o = [...document.querySelectorAll('div')].find((d) => d.style.position === 'fixed' && d.style.inset === '0px');
  return o ? o.innerText : '';
});
const tap = async (p, re) => { const hit = await p.evaluate((src) => { const rx = new RegExp(src);
  const el = [...document.querySelectorAll('button,[role="button"]')]
    .filter((x) => rx.test((x.getAttribute('aria-label') || '') + ' ' + x.textContent.trim().replace(/\s+/g, ' ')))[0];
  if (el) { el.click(); return true; } return false; }, re);
  if (!hit) console.log('  (no button for ' + re + ')');
  await p.waitForTimeout(400); return hit; };
const settings = (p) => p.evaluate(() => JSON.parse(localStorage.getItem('lift-weight-suggester-v1')).settings);

// ---- 1. the total, and the empty duplicate that used to break it -----------
{
  const { b, p, errs } = await open(SEED());
  let t = await body(p);
  const total = (t.match(/PROJECTED TOTAL\s*\n?\s*([\d,]+)/) || [])[1];
  console.log('=== THE TOTAL ===');
  console.log('a total at all     :', ok(!!total && total !== '—'), 'projected total = ' + total);
  await tap(p, 'Projected total');
  t = await sheet(p);
  console.log('names its lifts    :', ok(/Low-Bar Squat/.test(t) && /Competition Bench/.test(t) && /Conventional Deadlift/.test(t)));
  console.log('PICKS THE TRAINED  :', ok(!/Low Bar Squat\b(?!-)/.test(t.replace(/Low-Bar Squat/g, ''))),
    'the empty "Low Bar Squat" is not in it');
  console.log('leaves out the rest:', ok(!/Overhead Press/.test(t)), 'OHP has an estimate but is not one of the three');
  const shares = (t.match(/(\d+)% of total/g) || []).map((x) => parseInt(x));
  const sum = shares.reduce((a, c) => a + c, 0);
  console.log('SHARES ADD UP      :', ok(shares.length === 3 && Math.abs(sum - 100) <= 2), shares.join(' + ') + ' = ' + sum + '%');
  console.log('offers the picker  :', ok(/Choose which lifts count/.test(t)));
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 2. naming them yourself ----------------------------------------------
{
  const { b, p, errs } = await open(SEED());
  console.log('\n=== NAMING THEM YOURSELF ===');
  await tap(p, 'Projected total');
  await tap(p, 'Choose which lifts count');
  let t = await sheet(p);
  console.log('the sheet opens    :', ok(/Lifts in your total/i.test(t)));
  console.log('shows set counts   :', ok(/never logged/.test(t)), 'the empty duplicate is marked, not just listed');
  console.log('says it guessed    :', ok(/Picked for you/i.test(t)), (t.match(/Picked for you[^\n]*/) || [''])[0].slice(0, 80));
  // Swap the deadlift out for the overhead press and watch the total follow.
  await p.evaluate(() => { const el = [...document.querySelectorAll('button')]
    .filter((x) => /^Conventional Deadlift/.test(x.textContent.trim())).pop(); if (el) el.click(); });
  await p.waitForTimeout(400);
  const s = await settings(p);
  console.log('WRITES THE CHOICE  :', ok(Array.isArray(s.totalLifts) && s.totalLifts.indexOf('Conventional Deadlift') < 0),
    'totalLifts = ' + JSON.stringify(s.totalLifts));
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 3. which lifts the dashboard shows -----------------------------------
{
  const { b, p, errs } = await open(SEED({ dashLifts: ['Low-Bar Squat', 'Competition Bench'] }));
  const t = await body(p);
  console.log('\n=== LIFTS ON THE DASHBOARD ===');
  console.log('keeps what you chose:', ok(/Low-Bar Squat/.test(t) && /Competition Bench/.test(t)));
  console.log('DROPS THE REST     :', ok(!/Overhead Press/.test(t) && !/Conventional Deadlift/.test(t)),
    'OHP and deadlift are off the front page');
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 4. the stack is a list ------------------------------------------------
{
  const { b, p, errs } = await open(SEED());
  console.log('\n=== THE CARD STACK ===');
  let t = await body(p);
  const order0 = ['READINESS', "TODAY'S CHECK-IN", 'PROJECTED TOTAL'].map((x) => t.indexOf(x));
  console.log('ships in order     :', ok(order0[0] < order0[1] && order0[1] < order0[2]), 'readiness, check-in, total');
  console.log('no duplicate prompt:', ok(!/how did you sleep/i.test(t)),
    'the dead-end row above the check-in card is gone');
  console.log('the card remains   :', ok(/TODAY'S CHECK-IN/i.test(t)), 'the one that actually takes an answer');

  await tap(p, 'Customize this screen');
  t = await body(p);
  console.log('customize opens    :', ok(/What is on the dashboard/i.test(t)));
  // Hide the strength score, and move readiness down one.
  await p.evaluate(() => { const row = [...document.querySelectorAll('div')]
    .find((d) => d.querySelector('button[aria-label^="Hide Strength score"]'));
    if (row) row.querySelector('button[aria-label^="Hide Strength score"]').click(); });
  await p.waitForTimeout(300);
  await p.evaluate(() => { const b2 = [...document.querySelectorAll('button[aria-label="Move down"]')][0]; if (b2) b2.click(); });
  await p.waitForTimeout(300);
  const s = await settings(p);
  console.log('HIDES A CARD       :', ok((s.cardsOff || []).indexOf('score') >= 0), 'cardsOff = ' + JSON.stringify(s.cardsOff));
  console.log('REORDERS           :', ok(Array.isArray(s.cards) && s.cards[0] === 'checkin'),
    'cards = ' + JSON.stringify((s.cards || []).slice(0, 3)));
  await p.evaluate(() => { const el = [...document.querySelectorAll('div')]
    .find((d) => d.style.position === 'fixed' && d.style.inset === '0px'); if (el) el.click(); });
  await p.waitForTimeout(500);
  t = await body(p);
  console.log('and the screen obeys:', ok(!/STRENGTH SCORE/.test(t) && t.indexOf("TODAY'S CHECK-IN") < t.indexOf('READINESS')),
    'score gone, check-in now first');
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}

// ---- 5. charts, and where the app opens ------------------------------------
{
  const { b, p, errs } = await open(SEED({ window: 365, chartZero: true, homeTab: 'train' }));
  console.log('\n=== CHARTS AND HABITS ===');
  let t = await body(p);
  console.log('OPENS WHERE TOLD   :', ok(/Log set|Add your first lift|TRAINING|WEEK/i.test(t) && !/READINESS · TODAY/.test(t)),
    'landed on Train, not the dashboard');
  await p.evaluate(() => { const el = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Dashboard'); if (el) el.click(); });
  await p.waitForTimeout(800);
  t = await body(p);
  console.log('trend says its range:', ok(/1 year/.test(t)), (t.match(/STRENGTH TREND[\s\S]{0,40}/) || [''])[0].replace(/\n/g, ' '));
  await p.evaluate(() => { const el = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'History'); if (el) el.click(); });
  await p.waitForTimeout(800);
  t = await body(p);
  console.log('history follows too:', ok(/1 YEAR/i.test(t)), 'the stat next to the chart is named for the same window');
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await b.close();
}
