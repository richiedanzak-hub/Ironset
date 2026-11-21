import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const SP = process.env.SP;
if (!SP) { console.error('set SP to a directory holding vendor/node_modules — see test/run.sh'); process.exit(1); }
const NM = SP + '/vendor/node_modules';
const MAP = {
  'react/18.2.0/umd/react.production.min.js': NM + '/react/umd/react.production.min.js',
  'react-dom/18.2.0/umd/react-dom.production.min.js': NM + '/react-dom/umd/react-dom.production.min.js',
  'babel-standalone/7.23.2/babel.min.js': NM + '/@babel/standalone/babel.min.js',
};
export async function open(seed) {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 402, height: 880 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await p.route('**://cdnjs.cloudflare.com/**', (route) => {
    const u = route.request().url();
    const hit = Object.keys(MAP).find((k) => u.includes(k));
    if (!hit) return route.abort();
    route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(MAP[hit], 'utf8') });
  });
  await p.route('**://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  if (seed) await p.addInitScript(seed);
  await p.goto('file://' + process.cwd() + '/ironset.html');
  await p.waitForSelector('text=Dashboard', { timeout: 20000 });
  for (let i = 0; i < 6; i++) {
    const next = p.getByRole('button', { name: /Next|Let's lift/ });
    if (await next.count() === 0) break;
    await next.first().click(); await p.waitForTimeout(150);
  }
  return { b, p, errs };
}
export const plan = (p) => p.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('lift-weight-suggester-v1') || '{}');
  const d = (s.program && s.program.days) || {};
  return Object.keys(d).sort().map((k) => k + ':' + d[k].map((x) => x.ex).join('+'));
});
