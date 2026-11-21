/* The readiness card, and how much of it is the lifter's to decide: which lifts
   it watches, how hard it is allowed to cut a prescription, and whether a rough
   night counts toward the number on the dial. */
import { open } from './harness.mjs';
const ok = (b, ...m) => (b ? 'PASS' : 'FAIL') + ' ' + m.join(' ');
// A brutal squat session three days ago, so there is real debt to act on.
const SEED = (extra, ck) => new Function(`
  const now = Date.now(), DAY = 864e5;
  const mk = (w,r,rpe,d) => ({ id:'x'+Math.random().toString(36).slice(2), ts: now-d*DAY, weight:w, reps:r, rpe, backoff:false });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: {
      'Low-Bar Squat': { name:'Low-Bar Squat', sets:[mk(455,5,8,40),mk(475,5,8,24),mk(500,5,9.5,3),mk(480,5,9.5,3),mk(470,5,9.5,3)] },
      'Competition Bench': { name:'Competition Bench', sets:[mk(290,3,8,30),mk(305,3,8,20)] },
      'Overhead Press': { name:'Overhead Press', sets:[mk(185,5,8,26),mk(190,5,8,19)] },
    },
    bodyweight: [{ts:now-DAY,kg:125}], meet:{date:null,name:'',attempts:{}},
    checkins: ${JSON.stringify(ck || {})}, clips:{},
    settings: Object.assign({unit:'lb',round:5,bar:45,inputMode:'rpe',sex:'male',trainingMode:'rpe',
      maxMode:'dynamic',topPct:85,onboarded:true,tour:true,
      backoff:{sets:1,reps:5,rpe:8,level:'normal',pct:75,steps:[]}}, ${JSON.stringify(extra || {})}),
  }));`);
const today = () => { const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const body = (p) => p.evaluate(() => document.body.innerText);
const sheet = (p) => p.evaluate(() => {
  const o = [...document.querySelectorAll('div')].find((d) => d.style.position === 'fixed' && d.style.inset === '0px');
  return o ? o.innerText : '';
});
const dial = (p) => p.evaluate(() => {
  const m = document.body.innerText.match(/READINESS · TODAY\s*\n\s*(\d+)/);
  return m ? parseInt(m[1]) : null;
});
const why = async (p) => { await p.evaluate(() => { const el = document.querySelector('[aria-label="Why this score"]')
  || [...document.querySelectorAll('button')].find((x) => /why/i.test(x.getAttribute('aria-label') || '')); if (el) el.click(); });
  await p.waitForTimeout(500); };

// ---- 1. it watches the lifts you told the dashboard to watch ---------------
{
  const { b, p, errs } = await open(SEED());
  let t = await body(p);
  console.log('=== WHICH LIFTS ===');
  console.log('all three by default:', ok(/LOW-BAR SQUAT/.test(t) && /OVERHEAD PRESS/.test(t)));
  await b.close();
  const two = await open(SEED({ dashLifts: ['Low-Bar Squat', 'Competition Bench'] }));
  t = await body(two.p);
  const ready = t.slice(t.indexOf('READINESS'), t.indexOf("TODAY'S CHECK-IN"));
  console.log('FOLLOWS THE CHOICE  :', ok(/LOW-BAR SQUAT/.test(ready) && !/OVERHEAD PRESS/.test(ready)),
    'the readiness bars drop the lifts you took off the dashboard');
  console.log('ERRORS:', errs.length ? [...new Set(errs)].join(' | ') : 'NONE');
  await two.b.close();
}

// ---- 2. how hard it is allowed to cut ---------------------------------------
{
  console.log('\n=== HOW HARD IT BITES ===');
  const a = await open(SEED());
  console.log('a trim by default   :', ok(/trimmed/i.test(await (async () => { await why(a.p); return sheet(a.p); })())),
    ((await sheet(a.p)).match(/Loads trimmed[^\n]*/) || [''])[0].slice(0, 60));
  const defDial = await dial(a.p);
  await a.b.close();

  const z = await open(SEED({ trimCap: 0 }));
  await why(z.p);
  let t = await sheet(z.p);
  console.log('OFF MEANS OFF       :', ok(/Trimming is off/.test(t) && !/Loads trimmed/.test(t)),
    (t.match(/Trimming is off[^\n]*/) || [''])[0].slice(0, 62));
  console.log('says so up top too  :', ok(/not to act on that/.test(t)));
  console.log('STILL SAYS YOU ARE TIRED:', ok((await dial(z.p)) === defDial),
    'the dial reads ' + (await dial(z.p)) + ' either way — the debt is real, the app just is not acting on it');
  await z.b.close();

  const l = await open(SEED({ trimCap: 0.05 }));
  await why(l.p);
  t = await sheet(l.p);
  const pct = parseFloat((t.match(/Loads trimmed ([\d.]+)%/) || [0, '0'])[1]);
  console.log('A SMALLER CAP HOLDS :', ok(pct > 0 && pct <= 5.01), 'trimmed ' + pct + '% with the cap at 5%');
  console.log('and the blurb agrees:', ok(/at most 5%/.test(t)));
  await l.b.close();
}

// ---- 3. whether a rough night counts ----------------------------------------
{
  console.log('\n=== WHAT THE NUMBER COUNTS ===');
  const ck = {}; ck[today()] = { score: 3, gear: [], ts: Date.now() };
  const withCk = await open(SEED({}, ck));
  const low = await dial(withCk.p);
  await withCk.b.close();
  const trainOnly = await open(SEED({ checkinInScore: false }, ck));
  const high = await dial(trainOnly.p);
  await trainOnly.b.close();
  console.log('a bad night pulls it:', ok(low != null && high != null && low < high), low + ' with the check-in counted');
  console.log('TRAINING ONLY IGNORES IT:', ok(high > low), high + ' when you tell it to read training alone');
}

// ---- 4. and the number that ends up on the bar -----------------------------
{
  console.log('\n=== WHAT GOES ON THE BAR ===');
  const sugg = async (p) => {
    await p.evaluate(() => { const el = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Train'); if (el) el.click(); });
    await p.waitForTimeout(1000);
    const t = await p.evaluate(() => document.body.innerText);
    const m = t.match(/\n(\d{3,4})\s*\n\s*lb/);
    return m ? parseInt(m[1]) : null;
  };
  const a = await open(SEED());            const normal = await sugg(a.p); await a.b.close();
  const z = await open(SEED({ trimCap: 0 })); const full = await sugg(z.p);  await z.b.close();
  console.log('trimmed by default  :', ok(normal != null), normal + ' lb suggested with the cap at 10%');
  console.log('OFF PUTS IT BACK    :', ok(full != null && normal != null && full > normal),
    full + ' lb with trimming off — ' + (full - normal) + ' lb more on the bar');
}
