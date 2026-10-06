// HTTP layer: static files, the JSON API and live updates.
//
// Live updates use Server-Sent Events: each phone keeps one EventSource open
// and receives its own view of the room whenever anything changes. Moves go
// up as plain POSTs. No WebSocket library needed, and EventSource reconnects
// by itself when a phone wakes up.

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomInt } from 'node:crypto';
import * as game from './game.js';
import { applySongDetails, clipSong, songsNeeded } from './quiz.js';
import { checkTheme, createMusic } from './music.js';
import { createMovies } from './movies.js';

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const CODE_LETTERS = 'BCDFGHJKLMNPQRSTVWXZ'; // no vowels, so no accidental words
const ROOM_IDLE_MS = 6 * 3_600_000;
const ROOM_MAX_AGE_MS = 24 * 3_600_000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'content-security-policy': [
    "default-src 'self'",
    "img-src 'self' data: https://*.dzcdn.net https://image.tmdb.org https://*.mzstatic.com",
    "media-src 'self' data: https://*.dzcdn.net https://*.itunes.apple.com https://*.mzstatic.com",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    "connect-src 'self'",
    "font-src 'self'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join('; '),
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function lanUrl(port) {
  for (const list of Object.values(networkInterfaces())) {
    for (const a of list || []) {
      if ((a.family === 'IPv4' || a.family === 4) && !a.internal) return `http://${a.address}:${port}`;
    }
  }
  return null;
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...SECURITY_HEADERS });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 32_768) throw new HttpError(413, 'Request too large');
    chunks.push(chunk);
  }
  try {
    return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
  } catch {
    throw new HttpError(400, 'Bad request');
  }
}

// Fixed-window limiter so a stuck client can't burn through Deezer's or TMDB's rate limit.
function limiter(perMinute) {
  const hits = new Map();
  return (req) => {
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    const now = Date.now();
    const h = hits.get(ip);
    if (!h || h.reset < now) {
      if (hits.size > 5000) hits.clear();
      hits.set(ip, { n: 1, reset: now + 60_000 });
      return;
    }
    h.n += 1;
    if (h.n > perMinute) throw new HttpError(429, 'Slow down a little!');
  };
}

export function createApp({
  music = createMusic(),
  movies = createMovies(),
  now = () => Date.now(),
  rng = Math.random,
  publicUrl = process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || null,
  port = Number(process.env.PORT) || 3000,
} = {}) {
  const rooms = new Map();
  const streams = new Map(); // room code -> Set of { res, pid }
  const dirty = new Set();
  const lookupLimit = limiter(300);
  const suggestLimit = limiter(1200); // a whole family typing answers on one Wi-Fi

  // -------------------------------------------------------------- rooms

  function newCode() {
    for (let tries = 0; tries < 1000; tries++) {
      let code = '';
      for (let i = 0; i < 4; i++) code += CODE_LETTERS[randomInt(CODE_LETTERS.length)];
      if (!rooms.has(code)) return code;
    }
    throw new HttpError(503, 'Too many parties right now');
  }

  function getRoom(code) {
    const room = rooms.get(String(code || '').toUpperCase());
    if (!room) throw new HttpError(404, "That party doesn't exist (or it ended)");
    return room;
  }

  function send(conn, payload, event) {
    conn.res.write(`${event ? `event: ${event}\n` : ''}data: ${JSON.stringify(payload)}\n\n`);
  }

  function flush(room) {
    const set = streams.get(room.code);
    if (!set) return;
    const t = now();
    for (const conn of set) {
      if (room.players[conn.pid]) send(conn, game.viewFor(room, conn.pid, t));
    }
  }

  // Many changes in one tick go out as one update.
  function broadcast(room) {
    if (dirty.has(room.code)) return;
    dirty.add(room.code);
    setImmediate(() => {
      dirty.delete(room.code);
      if (rooms.get(room.code) === room) flush(room);
    });
  }

  function dropStreams(code, pid, reason) {
    for (const conn of streams.get(code) || []) {
      if (pid && conn.pid !== pid) continue;
      send(conn, { reason }, 'gone');
      conn.res.end();
    }
  }

  function deleteRoom(code, reason) {
    dropStreams(code, null, reason);
    streams.delete(code);
    rooms.delete(code);
  }

  // Genres, year and full details for a pick, from the right database.
  const lookup = (kind, item, opts) => (kind === 'movie' ? movies.lookup(item) : music.lookup(kind, item, opts));

  // After a pick goes in: fill in details for something typed by hand, and
  // swap a compilation version for the original album, cover and year.
  async function refine(room, entryId) {
    const e = room.entries[entryId];
    if (!e) return;
    try {
      const info = await lookup(e.kind, e, { clean: room.settings.clean });
      if (info.found && rooms.get(room.code) === room && game.applyDetails(room, entryId, info.item, now(), { replace: true })) broadcast(room);
    } catch (err) {
      console.warn('[details]', err.message);
    }
  }

  // With a theme that has a genre or decade, a pick has to fit it. The check
  // happens before the pick goes in, and the original release goes in with it.
  async function checkPick(room, move) {
    const s = room.settings;
    const theme = s.theme;
    if (!s.themeStrict || !theme || (!theme.genre && !theme.decade) || room.phase !== 'submit') return move;
    let item;
    try {
      item = game.cleanItem(move.item);
    } catch {
      return move; // the game reports what's wrong with it
    }
    let info;
    try {
      info = await lookup(s.kind, item, { clean: s.clean });
    } catch (err) {
      console.warn('[theme check]', err.message);
      return move; // can't check right now; don't hold up the party
    }
    if (info.missing) throw new HttpError(422, `Couldn't find "${item.title}" to check it fits the theme. Pick it from the search results instead 👆`);
    if (!info.found) return move; // no details on file; let it in
    const verdict = checkTheme(info, theme);
    if (!verdict.ok) throw new HttpError(422, verdict.message);
    return { ...move, item: info.item, checked: true };
  }

  // Who Sings It?: find the songs, then start. Everyone sees "picking the
  // songs…" meanwhile. Afterwards, each song is switched to its original
  // album, cover and year, in the order they'll be played.
  async function startQuiz(room, pid) {
    const s = game.prepareQuiz(room, pid, now());
    broadcast(room);
    let songs;
    try {
      songs = await music.quizSongs({ theme: s.theme, clean: s.clean, count: songsNeeded(s), ask: s.ask, seed: `${room.code}${now()}` });
    } catch (err) {
      console.warn('[quiz songs]', err.message);
      songs = [];
    }
    if (rooms.get(room.code) !== room) return;
    try {
      game.playQuiz(room, songs, now(), rng);
    } finally {
      broadcast(room);
    }
    refineSongs(room, room.quiz);
  }

  async function refineSongs(room, quiz) {
    const order = quiz.songs.map((_, i) => i);
    if (quiz.finale) order.splice(1, 0, order.pop()); // the finale hint needs the last song's year early
    for (const i of order) {
      if (room.quiz !== quiz || rooms.get(room.code) !== room) return;
      try {
        const info = await music.lookup('song', quiz.songs[i], { clean: room.settings.clean });
        if (info.found && applySongDetails(room, quiz, i, { ...info.item, genres: info.genres })) broadcast(room);
      } catch (err) {
        console.warn('[quiz details]', err.message);
      }
    }
  }

  // -------------------------------------------------------------- API

  async function api(req, res, url, parts) {
    const [section, code, action] = parts;
    const method = req.method;

    if (section === 'config' && method === 'GET') {
      return sendJson(res, 200, { music: music.source, movies: movies.source, publicUrl, lanUrl: lanUrl(port) });
    }

    if (section === 'rooms') {
      if (!code && method === 'POST') {
        const body = await readJson(req);
        const room = game.createRoom(newCode(), now(), { kind: body.kind, game: body.game });
        const { player } = game.joinRoom(room, body, now());
        rooms.set(room.code, room);
        return sendJson(res, 200, { code: room.code, playerId: player.id, secret: player.secret });
      }

      const room = getRoom(code);

      if (!action && method === 'GET') {
        const host = room.players[room.hostId];
        return sendJson(res, 200, {
          code: room.code,
          phase: room.phase,
          players: room.order.length,
          host: host ? { name: host.name, avatar: host.avatar } : null,
          game: room.game,
          kind: room.settings.kind,
          theme: room.settings.theme,
        });
      }

      // Who Sings It?: this round's song, as a link to play. Just the audio:
      // no title or artist.
      if (action === 'clip' && method === 'GET') {
        if (!game.authenticate(room, url.searchParams.get('p'), url.searchParams.get('s'))) throw new HttpError(403, 'Not in this party');
        const song = clipSong(room, url.searchParams.get('round'));
        if (!song) throw new HttpError(404, 'No song for that round');
        return sendJson(res, 200, { url: (await music.quizClip(song)) || null });
      }

      if (action === 'join' && method === 'POST') {
        const { player, rejoined } = game.joinRoom(room, await readJson(req), now());
        broadcast(room);
        return sendJson(res, 200, { code: room.code, playerId: player.id, secret: player.secret, rejoined });
      }

      // Lets a phone whose live stream was refused find out whether it's still in.
      if (action === 'me' && method === 'GET') {
        if (!game.authenticate(room, url.searchParams.get('p'), url.searchParams.get('s'))) throw new HttpError(403, 'Not in this party');
        return sendJson(res, 200, { ok: true });
      }

      if (action === 'stream' && method === 'GET') {
        const pid = url.searchParams.get('p');
        if (!game.authenticate(room, pid, url.searchParams.get('s'))) throw new HttpError(403, 'Not in this party');
        res.writeHead(200, {
          'content-type': 'text/event-stream; charset=utf-8',
          'cache-control': 'no-cache, no-transform',
          connection: 'keep-alive',
          'x-accel-buffering': 'no',
        });
        res.write('retry: 2000\n\n');
        const conn = { res, pid };
        if (!streams.has(room.code)) streams.set(room.code, new Set());
        streams.get(room.code).add(conn);
        if (game.connect(room, pid, now())) broadcast(room);
        else send(conn, game.viewFor(room, pid, now()));
        req.on('close', () => {
          streams.get(room.code)?.delete(conn);
          if (rooms.get(room.code) === room) game.disconnect(room, pid, now());
        });
        return;
      }

      if (action === 'act' && method === 'POST') {
        const body = await readJson(req);
        const me = game.authenticate(room, body.p, body.s);
        if (!me) throw new HttpError(403, 'Not in this party');
        if (room.game === 'quiz' && (body.action?.type === 'start' || body.action?.type === 'rematch')) {
          await startQuiz(room, me.id);
          return sendJson(res, 200, { ok: true });
        }
        const move = body.action?.type === 'add' ? await checkPick(room, body.action) : body.action;
        const out = game.act(room, me.id, move, now(), rng);
        if (out.removed) dropStreams(room.code, out.removed, out.removed === me.id ? 'left' : 'kicked');
        if (!room.order.length) deleteRoom(room.code, 'ended');
        else broadcast(room);
        if (move?.type === 'add' && out.entryId && !move.checked && !out.notice) refine(room, out.entryId);
        return sendJson(res, 200, { ok: true, notice: out.notice || null, entryId: out.entryId || null });
      }
    }

    if (section === 'movies' && method === 'GET') {
      lookupLimit(req);
      const q = Object.fromEntries(url.searchParams);
      if (code === 'search') return sendJson(res, 200, { results: await movies.search(q.q), source: movies.source });
      if (code === 'browse') return sendJson(res, 200, await movies.browse(q));
      if (code === 'meta') return sendJson(res, 200, await movies.meta(q.region));
      if (code === 'watch') return sendJson(res, 200, await movies.watch(q));
    }

    if (section === 'music' && method === 'GET' && code === 'suggest') {
      suggestLimit(req);
      return sendJson(res, 200, await music.suggest(url.searchParams.get('kind'), url.searchParams.get('q')));
    }

    if (section === 'music' && method === 'GET') {
      lookupLimit(req);
      const q = Object.fromEntries(url.searchParams);
      if (code === 'search') return sendJson(res, 200, await music.search(q.kind, q.q, { clean: q.clean === '1' }));
      if (code === 'browse') return sendJson(res, 200, await music.browse(q));
      if (code === 'meta') return sendJson(res, 200, await music.meta());
      if (code === 'preview') return sendJson(res, 200, await music.preview(q));
      if (code === 'about') return sendJson(res, 200, await music.about(q));
      // Open this in a browser to see whether Deezer and Apple are answering.
      if (code === 'status') return sendJson(res, 200, await music.status());
    }

    throw new HttpError(404, 'Not found');
  }

  // -------------------------------------------------------------- static

  async function serveStatic(req, res, pathname) {
    if (req.method !== 'GET' && req.method !== 'HEAD') throw new HttpError(405, 'Method not allowed');
    let rel;
    try {
      rel = decodeURIComponent(pathname);
    } catch {
      throw new HttpError(400, 'Bad path');
    }
    // App routes like /j/ABCD all load the single page.
    if (rel === '/' || rel.startsWith('/j/') || !extname(rel)) rel = '/index.html';
    const file = normalize(join(PUBLIC, rel));
    if (!file.startsWith(PUBLIC + sep)) throw new HttpError(404, 'Not found');
    let data;
    try {
      data = await readFile(file);
    } catch {
      throw new HttpError(404, 'Not found');
    }
    const longCache = rel.startsWith('/vendor/') || rel.startsWith('/fonts/');
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] || 'application/octet-stream',
      'cache-control': longCache ? 'public, max-age=604800' : 'no-cache',
      ...SECURITY_HEADERS,
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  }

  // -------------------------------------------------------------- server

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    try {
      if (parts[0] === 'api') await api(req, res, url, parts.slice(1));
      else await serveStatic(req, res, url.pathname);
    } catch (err) {
      const status = err.status || 500;
      if (status >= 500) console.error(err);
      if (res.headersSent) return res.end();
      if (parts[0] === 'api' || status !== 404) sendJson(res, status, { error: status >= 500 ? 'Something went wrong' : err.message });
      else {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('Not found');
      }
    }
  });

  const timers = [
    setInterval(() => {
      const t = now();
      for (const room of rooms.values()) if (game.tick(room, t, rng)) broadcast(room);
    }, 1000),
    // Keeps proxies from closing quiet streams, and lets phones notice a dead one.
    setInterval(() => {
      for (const set of streams.values()) for (const conn of set) conn.res.write('event: ping\ndata: 1\n\n');
    }, 20_000),
    setInterval(() => {
      const t = now();
      for (const [code, room] of rooms) {
        const listening = streams.get(code)?.size;
        if (t - room.updatedAt > ROOM_MAX_AGE_MS || (!listening && t - room.updatedAt > ROOM_IDLE_MS)) deleteRoom(code, 'expired');
      }
    }, 60_000),
  ];
  for (const t of timers) t.unref();
  server.on('close', () => timers.forEach(clearInterval));

  return { server, rooms, music, movies };
}
