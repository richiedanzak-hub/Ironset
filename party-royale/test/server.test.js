import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { createMusic } from '../src/music.js';
import { createMovies } from '../src/movies.js';

let server;
let base;

before(async () => {
  // Point Deezer, TMDB and iTunes at a closed port so tests never touch the network.
  const music = createMusic({ deezerBase: 'http://127.0.0.1:9', itunesBase: 'http://127.0.0.1:9', musicbrainzBase: 'http://127.0.0.1:9' });
  const movies = createMovies({ apiKey: '', itunesBase: 'http://127.0.0.1:9' });
  ({ server } = createApp({ music, movies, port: 0, rng: () => 0 }));
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

  const add = await (await post(`/api/rooms/${host.code}/act`, { p: guest.playerId, s: guest.secret, action: { type: 'add', item: { title: 'Hey Jude', artist: 'The Beatles' } } })).json();
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
  assert.match(await home.text(), /Party Royale/);

  const invite = await fetch(`${base}/j/BCDF`);
  assert.equal(invite.status, 200);
  assert.match(invite.headers.get('content-type'), /text\/html/);

  const js = await fetch(`${base}/js/app.js`);
  assert.match(js.headers.get('content-type'), /javascript/);

  for (const path of ['/../src/game.js', '/%2e%2e/src/game.js', '/..%2fsrc%2fgame.js', '/nope.css']) {
    assert.equal((await fetch(base + path)).status, 404, path);
  }
});

test('music endpoints keep working when Deezer is unreachable', async () => {
  const cfg = await (await fetch(`${base}/api/config`)).json();
  assert.equal(cfg.music, 'deezer');

  const browse = await (await fetch(`${base}/api/music/browse?kind=song&list=top&genre=Rock&decade=80s`)).json();
  assert.equal(browse.source, 'offline');
  assert.ok(browse.results.length > 3);
  assert.ok(browse.results.every((s) => s.genres.includes('Rock') && s.year >= 1980 && s.year < 1990));

  const search = await (await fetch(`${base}/api/music/search?kind=album&q=rumours`)).json();
  assert.equal(search.results[0].artist, 'Fleetwood Mac');

  const about = await (await fetch(`${base}/api/music/about?kind=song&title=Hey%20Jude&artist=The%20Beatles`)).json();
  assert.match(about.links.spotify, /open\.spotify\.com\/search\/Hey%20Jude%20The%20Beatles/);

  const preview = await (await fetch(`${base}/api/music/preview?kind=song&title=Hey%20Jude`)).json();
  assert.equal(preview.url, null);
});

test('with a theme, picks that do not fit are turned away and the rest go in as the original', async () => {
  // A stand-in music service: anything with "country" in it is Country.
  const music = {
    source: 'deezer',
    async lookup(kind, item) {
      if (/nowhere/i.test(item.title)) return { item, genres: [], years: [], found: false, missing: true };
      if (/mystery/i.test(item.title)) return { item, genres: [], years: [], found: false, missing: false };
      const country = /country/i.test(item.title);
      return {
        found: true,
        item: { ...item, album: country ? 'Twang' : 'Infest', year: 2000 },
        genres: country ? ['Country'] : ['Rock'],
        years: [2000],
      };
    },
  };
  const app = createApp({ music, movies: createMovies({ apiKey: '', itunesBase: 'http://127.0.0.1:9' }), port: 0, rng: () => 0 });
  await new Promise((resolve) => app.server.listen(0, '127.0.0.1', resolve));
  const at = `http://127.0.0.1:${app.server.address().port}`;
  const send = (path, body) => fetch(at + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  try {
    const host = await (await send('/api/rooms', { name: 'Mom' })).json();
    const act = (action) => send(`/api/rooms/${host.code}/act`, { p: host.playerId, s: host.secret, action });
    await act({ type: 'settings', settings: { theme: { genre: 'Rock', decade: '2000s' } } });
    await act({ type: 'start' });

    const off = await act({ type: 'add', item: { title: 'Country Roads', artist: 'John Denver' } });
    assert.equal(off.status, 422);
    assert.match((await off.json()).error, /Country Roads is Country, not Rock/);
    const unknown = await act({ type: 'add', item: { title: 'Nowhere Song' } });
    assert.equal(unknown.status, 422);
    assert.match((await unknown.json()).error, /Couldn't find "Nowhere Song"/);
    const noDetails = await act({ type: 'add', item: { title: 'Mystery Track', deezerId: 99 } });
    assert.equal(noDetails.status, 200, 'no details on file: benefit of the doubt');

    const ok = await act({ type: 'add', item: { title: 'Last Resort', artist: 'Papa Roach', album: 'Workout Hits' } });
    assert.equal(ok.status, 200);
    const room = app.rooms.get(host.code);
    assert.deepEqual(Object.values(room.entries).map((e) => [e.title, e.album]), [['Mystery Track', null], ['Last Resort', 'Infest']]);

    // The host can let anything in.
    await act({ type: 'settings', settings: { themeStrict: false } });
    assert.equal((await act({ type: 'add', item: { title: 'Country Roads', artist: 'John Denver' } })).status, 200);
  } finally {
    app.server.closeAllConnections();
    app.server.close();
  }
});

test('movie nights: host one, see it on the invite, and search movies', async () => {
  const host = await (await post('/api/rooms', { name: 'Mom', kind: 'movie' })).json();
  const invite = await (await fetch(`${base}/api/rooms/${host.code}`)).json();
  assert.equal(invite.kind, 'movie');
  const cfg = await (await fetch(`${base}/api/config`)).json();
  assert.equal(cfg.movies, 'offline');
  assert.equal(cfg.music, 'deezer');
  const found = await (await fetch(`${base}/api/movies/search?q=jaws`)).json();
  assert.equal(found.results[0].title, 'Jaws');
  assert.equal(found.results[0].kind, 'movie');
  const ideas = await (await fetch(`${base}/api/movies/browse?list=top&genres=Horror&era=80s`)).json();
  assert.ok(ideas.results.length > 0);
  assert.ok(ideas.results.every((m) => m.genres.includes('Horror') && m.year >= 1980 && m.year <= 1989));
  const watch = await (await fetch(`${base}/api/movies/watch?title=Jaws&year=1975&region=US`)).json();
  assert.match(watch.links.trailer, /youtube\.com/);
  // Pages allow TMDB posters.
  const page = await fetch(`${base}/`);
  assert.match(page.headers.get('content-security-policy'), /image\.tmdb\.org/);
});
