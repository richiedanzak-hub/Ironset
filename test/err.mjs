/* Walks all four tabs on a cold install and on a seeded one, and reports any
   render crash the error boundary would otherwise swallow. */
import { open } from './harness.mjs';
const seed = () => {
  const now = Date.now(), DAY = 864e5;
  const mk = (w, r, rpe, d) => ({ id: 'x' + Math.random().toString(36).slice(2), ts: now - d * DAY, weight: w, reps: r, rpe, backoff: false });
  localStorage.setItem('lift-weight-suggester-v1', JSON.stringify({
    exercises: {
      'Low-Bar Squat': { name: 'Low-Bar Squat', sets: [mk(500, 3, 8, 21), mk(515, 3, 8, 7)] },
      'Competition Bench': { name: 'Competition Bench', sets: [mk(300, 3, 8, 12)] },
      'Conventional Deadlift': { name: 'Conventional Deadlift', sets: [mk(600, 2, 8, 10)] },
    },
    bodyweight: [{ ts: now - DAY, kg: 125 }], meet: { date: null, name: '', attempts: {} }, checkins: {}, clips: {},
    settings: { unit: 'lb', round: 5, bar: 45, inputMode: 'rpe', sex: 'male', trainingMode: 'rpe',
      maxMode: 'dynamic', topPct: 85, onboarded: true, tour: true,
      backoff: { sets: 1, reps: 5, rpe: 8, level: 'normal', pct: 75, steps: [] } },
  }));
};
for (const [what, s] of [['cold', null], ['seeded', seed]]) {
  const { b, p, errs } = await open(s);
  for (const tab of ['Train', 'Plan', 'History', 'Dashboard']) {
    await p.evaluate((x) => { const el = [...document.querySelectorAll('button')].find((y) => y.textContent.trim() === x); if (el) el.click(); }, tab);
    await p.waitForTimeout(800);
    const boom = await p.evaluate(() => (/hit an error/i.test(document.body.innerText)
      ? document.body.innerText.split('\n').filter(Boolean).slice(0, 3).join(' | ') : null));
    if (boom) console.log('RENDER CRASH (' + what + ') on ' + tab + ':', boom);
  }
  if (errs.length) console.log('ERRORS (' + what + '):', [...new Set(errs)].join(' | '));
  await b.close();
}
