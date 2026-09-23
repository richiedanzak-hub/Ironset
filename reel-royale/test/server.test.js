import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { createMovies } from '../src/movies.js';

let server;
let base;

before(async () => {
  // Point iTunes at a closed port so tests never touch the network.
  const movies = createMovies({ apiKey: '', itunesBase: 'http://127.0.0.1:9' });
  ({ server } = createApp({ movies, port: 0, rng: () => 0 }));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.closeAllConnections();
  server.close();
});

const post = (path, body) =>
  fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

// Reads server-sent events from a stream until `until` returns true for a view.
async function openStream(code, s) {
  const controller = new AbortController();
  const res = await fetch(`${base}/api/rooms/${code}/stream?p=${s.playerId}&s=${s.secret}`, { signal: controller.signal });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/event-stream/);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  return {
    async next(until = () => true) {
      for (;;) {
        let idx;
        while ((idx = buffer.indexOf('\n\n')) >= 0) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const event = /^event: (.*)$/m.exec(chunk)?.[1] || 'message';
          const data = /^data: (.*)$/m.exec(chunk)?.[1];
          if (!data) continue;
          const payload = JSON.parse(data);
          if (event === 'message' && until(payload)) return payload;
          if (event === 'gone') return { gone: payload.reason };
        }
        const { value, done } = await reader.read();
        if (done) throw new Error('stream ended');
        buffer += decoder.decode(value, { stream: true });
      }
    },
    close: () => controller.abort(),
  };
}

test('host a party, join by code, and see each other live', async () => {
  const hostRes = await post('/api/rooms', { name: 'Mom', avatar: '🦊' });
  assert.equal(hostRes.status, 200);
  const host = await hostRes.json();
  assert.match(host.code, /^[B-DF-HJ-NP-TV-XZ]{4}$/);

  const preview = await (await fetch(`${base}/api/rooms/${host.code.toLowerCase()}`)).json();
  assert.equal(preview.host.name, 'Mom');
  assert.equal(preview.phase, 'lobby');

  const hostStream = await openStream(host.code, host);
  const first = await hostStream.next();
  assert.equal(first.players.length, 1);
  assert.equal(first.me.host, true);

  const guest = await (await post(`/api/rooms/${host.code}/join`, { name: 'Dad', avatar: '🐸' })).json();
  const seen = await hostStream.next((v) => v.players.length === 2);
  assert.deepEqual(seen.players.map((p) => p.name), ['Mom', 'Dad']);

  // Someone else can't act as the host.
  const forged = await post(`/api/rooms/${host.code}/act`, { p: host.playerId, s: guest.secret, action: { type: 'start' } });
  assert.equal(forged.status, 403);
  const notHost = await post(`/api/rooms/${host.code}/act`, { p: guest.playerId, s: guest.secret, action: { type: 'start' } });
  assert.equal(notHost.status, 403);
  assert.match((await notHost.json()).error, /Only the host/);

  const ok = await post(`/api/rooms/${host.code}/act`, { p: host.playerId, s: host.secret, action: { type: 'start' } });
  assert.equal(ok.status, 200);
  const submit = await hostStream.next((v) => v.phase === 'submit');
  assert.equal(submit.hatCount, 0);

  const add = await (await post(`/api/rooms/${host.code}/act`, { p: guest.playerId, s: guest.secret, action: { type: 'add', movie: { title: 'Jaws' } } })).json();
  assert.ok(add.entryId);
  const counted = await hostStream.next((v) => v.hatCount === 1);
  assert.equal(counted.mine.length, 0, "the host can't see the guest's pick");

  // Kicking the guest ends their stream.
  const guestStream = await openStream(host.code, guest);
  await guestStream.next();
  await post(`/api/rooms/${host.code}/act`, { p: host.playerId, s: host.secret, action: { type: 'kick', playerId: guest.playerId } });
  assert.deepEqual(await guestStream.next(() => false), { gone: 'kicked' });
  const me = await fetch(`${base}/api/rooms/${host.code}/me?p=${guest.playerId}&s=${guest.secret}`);
  assert.equal(me.status, 403);

  hostStream.close();
});

test('bad requests get friendly errors', async () => {
  const missing = await fetch(`${base}/api/rooms/ZZZZ`);
  assert.equal(missing.status, 404);
  assert.match((await missing.json()).error, /doesn't exist/);

  const noName = await post('/api/rooms', { name: '  ' });
  assert.equal(noName.status, 400);

  const junk = await fetch(`${base}/api/rooms`, { method: 'POST', body: '{nope' });
  assert.equal(junk.status, 400);

  const huge = await post('/api/rooms', { name: 'x'.repeat(40_000) });
  assert.equal(huge.status, 413);
});

test('static files, app routes and path traversal', async () => {
  const home = await fetch(`${base}/`);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.match(home.headers.get('content-security-policy'), /default-src 'self'/);
  assert.match(await home.text(), /Reel Royale/);

  const invite = await fetch(`${base}/j/BCDF`);
  assert.equal(invite.status, 200);
  assert.match(invite.headers.get('content-type'), /text\/html/);

  const js = await fetch(`${base}/js/app.js`);
  assert.match(js.headers.get('content-type'), /javascript/);

  for (const path of ['/../src/game.js', '/%2e%2e/src/game.js', '/..%2fsrc%2fgame.js', '/nope.css']) {
    assert.equal((await fetch(base + path)).status, 404, path);
  }
});

test('movie endpoints work without a TMDB key', async () => {
  const cfg = await (await fetch(`${base}/api/config`)).json();
  assert.equal(cfg.movies, 'offline');

  const browse = await (await fetch(`${base}/api/movies/browse?list=top&genres=Animation&family=1`)).json();
  assert.equal(browse.source, 'offline');
  assert.ok(browse.results.length > 5);
  assert.ok(browse.results.every((m) => m.genres.includes('Animation')));

  const search = await (await fetch(`${base}/api/movies/search?q=goonies`)).json();
  assert.equal(search.results[0].title, 'The Goonies');

  const watch = await (await fetch(`${base}/api/movies/watch?title=Jaws&year=1975&region=GB`)).json();
  assert.match(watch.links.justwatch, /justwatch\.com\/uk\/search\?q=Jaws/);
  assert.match(watch.links.trailer, /youtube\.com/);
});
