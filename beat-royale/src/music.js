// Music data for search, the brainstorm helper, previews and "listen on".
//
// Deezer's public API needs no key or account and has daily-updated charts,
// album covers, artist photos and 30-second previews, so it's the main source.
// Apple's iTunes search (also keyless) fills gaps and takes over if Deezer
// can't be reached; a built-in list of classics is the last resort.

import { SONG_CATALOG, ALBUM_CATALOG, ARTIST_CATALOG, CATALOG_GENRES } from './catalog.js';
import { DECADES, KINDS, itemKey, songKey } from './game.js';

export { DECADES, KINDS };

const PAGE_SIZE = 24;
const SEARCH_SIZE = 25;
const FEED_MAX = 2000;        // suggestions per list before it calls it a night
const MIN = 60_000;
const HOUR = 60 * MIN;

export const LISTS = ['top', 'new', 'classics', 'surprise'];

// How each vibe reads in a playlist search. The first phrase is the main one;
// the others keep the ideas coming once it runs dry.
const VIBE_WORDS = {
  party: ['party hits', 'party anthems', 'dance party', 'party'],
  singalong: ['sing along', 'karaoke', 'singalong anthems', 'sing in the car'],
  feelgood: ['feel good hits', 'good vibes', 'happy hits', 'feel good'],
  chill: ['chill hits', 'chill vibes', 'chill', 'relax'],
  workout: ['workout hits', 'gym', 'running', 'workout'],
  roadtrip: ['road trip songs', 'driving songs', 'road trip', 'car anthems'],
  love: ['love songs', 'romantic', 'ballads', 'slow jams'],
};
export const VIBES = Object.fromEntries(Object.entries(VIBE_WORDS).map(([k, words]) => [k, words[0]]));

// Words added to playlist searches for each list. The first is the main one.
const LIST_WORDS = {
  top: ['hits', 'top hits', 'best of', 'anthems', 'essentials', 'favorites', 'greatest hits', 'bangers', 'mix', 'popular'],
  new: ['new releases', 'new music', 'fresh', 'new music friday', 'brand new', 'release radar', 'latest', 'new hits'],
  classics: ['classics', 'greatest hits', 'legends', 'all time', 'essentials', 'timeless', 'icons', 'golden hits', 'anthems'],
  surprise: ['hidden gems', 'deep cuts', 'one hit wonders', 'underrated', 'forgotten hits', 'guilty pleasures', 'b sides', 'cult classics', 'throwback', 'discoveries', 'covers', 'indie'],
};

// Deezer's genre ids, used if the live genre list can't be fetched.
const DEEZER_GENRES = [
  [132, 'Pop'], [116, 'Rap/Hip Hop'], [152, 'Rock'], [165, 'R&B'], [113, 'Dance'], [85, 'Alternative'],
  [84, 'Country'], [197, 'Latin Music'], [169, 'Soul & Funk'], [106, 'Electro'], [464, 'Metal'],
  [144, 'Reggae'], [129, 'Jazz'], [466, 'Folk'], [153, 'Blues'], [98, 'Classical'], [173, 'Films/Games'],
  [95, 'Kids'], [2, 'African Music'], [16, 'Asian Music'], [75, 'Brazilian Music'], [81, 'Indian Music'],
];

// How each genre reads in a playlist search ("90s hip hop hits").
const GENRE_WORDS = {
  'Rap/Hip Hop': 'hip hop',
  'R&B': 'r&b',
  'Films/Games': 'movie soundtrack',
  'Soul & Funk': 'soul funk',
  'Latin Music': 'latin',
  'Electro': 'electronic',
  'Kids': 'kids songs',
  'African Music': 'afrobeats',
  'Asian Music': 'k-pop',
  'Brazilian Music': 'brazilian',
  'Indian Music': 'bollywood',
};

const ITUNES_KIND = { song: 'song', album: 'album', artist: 'musicArtist' };

const yearOf = (date) => {
  const y = parseInt(String(date || '').slice(0, 4), 10);
  return Number.isFinite(y) && y > 1800 ? y : null;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// A repeatable random sequence: the same seed always shuffles the same way,
// so each phone keeps its own order while it scrolls.
export function seeded(text) {
  let h = 2166136261;
  for (const ch of String(text)) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, rng = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffles within small groups, so a chart gets mixed up but the biggest
// hits still come first.
const jumble = (list, rng, size = 6) => {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(...shuffle(list.slice(i, i + size), rng));
  return out;
};

// Deezer serves a grey placeholder for artists with no photo; treat it as none.
const picture = (url) => (typeof url === 'string' && url && !/\/images\/(artist|cover)\/\//.test(url) ? url : null);

// Same song (or album, or artist) by the same artist, whatever the version.
const sameKey = (m) => `${m.kind === 'artist' ? itemKey(m.title) : songKey(m.title)}|${itemKey(m.artist)}`;

const dedupe = (items) => {
  const seen = new Set();
  return items.filter((m) => {
    const k = sameKey(m);
    return !seen.has(k) && seen.add(k);
  });
};

// Filter first, then merge versions, so a clean version isn't lost behind
// an explicit one with the same name.
const cleanOnly = (items, clean) => (clean ? items.filter((m) => !m.explicit) : items);

class Cache {
  constructor(max = 800) {
    this.max = max;
    this.map = new Map();
  }

  wrap(key, ttlMs, load) {
    const hit = this.map.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;
    const value = load();
    this.map.set(key, { value, expires: Date.now() + ttlMs });
    Promise.resolve(value).catch(() => this.map.delete(key));
    if (this.map.size > this.max) this.map.delete(this.map.keys().next().value);
    return value;
  }
}

export function createMusic({
  deezerBase = process.env.DEEZER_BASE_URL || 'https://api.deezer.com',
  itunesBase = process.env.ITUNES_BASE_URL || 'https://itunes.apple.com',
  // song.link (Odesli) turns a Deezer link into Spotify, Apple Music and
  // YouTube links for the same song. Keyless, about 10 lookups a minute.
  odesliBase = process.env.ODESLI_BASE_URL || 'https://api.song.link',
  fetchImpl = globalThis.fetch,
  // Deezer allows 50 calls per 5 seconds from one server address. Shared
  // hosting can share that address with other apps, so stay well under it
  // and wait a moment whenever Deezer says to slow down.
  deezerBudget = 40,
  retryDelays = [700, 1600, 3000],
} = {}) {
  const cache = new Cache();
  const feeds = new Map();
  const stamps = [];
  const stat = () => ({ ok: 0, failed: 0, retried: 0, lastOk: null, lastError: null, lastErrorAt: null });
  const health = { deezer: stat(), itunes: stat() };

  const noteOk = (src) => {
    health[src].ok += 1;
    health[src].lastOk = new Date().toISOString();
  };
  const noteFail = (src, err) => {
    health[src].failed += 1;
    health[src].lastError = err.message;
    health[src].lastErrorAt = new Date().toISOString();
  };

  const warned = new Set();
  const warnOnce = (what, err) => {
    if (warned.has(what)) return;
    warned.add(what);
    console.warn(`[music] ${what} unavailable: ${err.message}`);
  };

  async function pace() {
    for (;;) {
      const t = Date.now();
      while (stamps.length && stamps[0] <= t - 5000) stamps.shift();
      if (stamps.length < deezerBudget) {
        stamps.push(t);
        return;
      }
      await sleep(stamps[0] + 5000 - t + 5);
    }
  }

  async function getJson(url) {
    const res = await fetchImpl(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      const err = new Error(`${new URL(url).host} answered ${res.status}`);
      err.retry = res.status === 429 || res.status >= 500;
      throw err;
    }
    return JSON.parse(await res.text());
  }

  // One Deezer call, retried when Deezer is busy or over its limit.
  // Deezer reports errors (like "quota exceeded") inside a 200 response.
  async function deezerCall(url) {
    for (let attempt = 0; ; attempt++) {
      await pace();
      let err;
      try {
        const data = await getJson(url);
        if (!data?.error) {
          noteOk('deezer');
          return data;
        }
        if (data.error.code === 800) {
          noteOk('deezer');
          return { data: [] }; // "no data"
        }
        err = new Error(`Deezer: ${data.error.message || data.error.type}`);
        err.retry = data.error.code === 4 || data.error.code === 700; // over the limit, or busy
      } catch (e) {
        err = e;
      }
      if (err.retry && attempt < retryDelays.length) {
        health.deezer.retried += 1;
        await sleep(retryDelays[attempt]);
        continue;
      }
      noteFail('deezer', err);
      throw err;
    }
  }

  function deezer(path, params = {}, ttl = HOUR) {
    const url = new URL(deezerBase + path);
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    if (!ttl) return deezerCall(url.toString());
    return cache.wrap(url.toString(), ttl, () => deezerCall(url.toString()));
  }

  // ---------------------------------------------------------------- Deezer → items

  const fromTrack = (t) => ({
    kind: 'song',
    title: t.title_short || t.title,
    artist: t.artist?.name || null,
    album: t.album?.title || null,
    year: yearOf(t.release_date || t.album?.release_date),
    cover: picture(t.album?.cover_big || t.album?.cover_medium),
    deezerId: t.id,
    explicit: !!t.explicit_lyrics,
    duration: t.duration || null,
    genres: [],
  });

  const fromAlbum = (a, artist = a.artist) => ({
    kind: 'album',
    title: a.title,
    artist: artist?.name || null,
    album: null,
    year: yearOf(a.release_date),
    cover: picture(a.cover_big || a.cover_medium),
    deezerId: a.id,
    explicit: !!a.explicit_lyrics,
    duration: null,
    genres: [],
  });

  const fromArtist = (a, fallbackCover = null) => ({
    kind: 'artist',
    title: a.name,
    artist: null,
    album: null,
    year: null,
    cover: picture(a.picture_big || a.picture_medium) || fallbackCover,
    deezerId: a.id,
    explicit: false,
    duration: null,
    genres: [],
    fans: a.nb_fan || null,
  });

  const converter = (kind) => ({ song: fromTrack, album: (a) => fromAlbum(a), artist: (a) => fromArtist(a) })[kind];

  // Albums or artists drawn from a list of tracks (playlists, charts).
  function tracksTo(kind, tracks) {
    if (kind === 'song') return tracks.map(fromTrack);
    const seen = new Set();
    const out = [];
    for (const t of tracks) {
      if (kind === 'album' && t.album && !seen.has(t.album.id)) {
        seen.add(t.album.id);
        out.push({ ...fromAlbum(t.album, t.artist), explicit: !!t.explicit_lyrics });
      }
      if (kind === 'artist' && t.artist && !seen.has(t.artist.id)) {
        seen.add(t.artist.id);
        // Playlist tracks often skip artist photos; the album cover stands in.
        out.push(fromArtist(t.artist, picture(t.album?.cover_big)));
      }
    }
    return out;
  }

  async function genres() {
    try {
      const data = await deezer('/genre', {}, 24 * HOUR);
      const list = (data.data || []).filter((g) => g.id !== 0).map((g) => [g.id, g.name]);
      if (list.length) return list;
    } catch (err) {
      warnOnce('Deezer genres', err);
    }
    return DEEZER_GENRES;
  }

  // ---------------------------------------------------------------- iTunes

  async function itunes(kind, term, limit = 15, ttl = 6 * HOUR) {
    const url = `${itunesBase}/search?${new URLSearchParams({ term, media: 'music', entity: ITUNES_KIND[kind], limit: String(limit), country: 'US' })}`;
    const load = async () => {
      try {
        const out = await getJson(url);
        noteOk('itunes');
        return out;
      } catch (err) {
        noteFail('itunes', err);
        throw err;
      }
    };
    const data = await (ttl ? cache.wrap(url, ttl, load) : load());
    const art = (u) => (u ? u.replace(/\/\d+x\d+bb\./, '/500x500bb.') : null);
    return (data.results || []).map((r) => {
      if (kind === 'song') {
        return {
          kind, title: r.trackName, artist: r.artistName || null, album: r.collectionName || null,
          year: yearOf(r.releaseDate), cover: art(r.artworkUrl100), deezerId: null,
          explicit: r.trackExplicitness === 'explicit', duration: r.trackTimeMillis ? Math.round(r.trackTimeMillis / 1000) : null,
          genres: r.primaryGenreName ? [r.primaryGenreName] : [], previewUrl: r.previewUrl || null, url: r.trackViewUrl || null,
        };
      }
      if (kind === 'album') {
        return {
          kind, title: r.collectionName, artist: r.artistName || null, album: null,
          year: yearOf(r.releaseDate), cover: art(r.artworkUrl100), deezerId: null,
          explicit: r.collectionExplicitness === 'explicit', duration: null,
          genres: r.primaryGenreName ? [r.primaryGenreName] : [], url: r.collectionViewUrl || null,
        };
      }
      return { kind, title: r.artistName, artist: null, album: null, year: null, cover: null, deezerId: null, explicit: false, duration: null, genres: r.primaryGenreName ? [r.primaryGenreName] : [], url: r.artistLinkUrl || null };
    }).filter((m) => m.title);
  }

  // ---------------------------------------------------------------- built-in list

  const catalogFor = (kind) => ({ song: SONG_CATALOG, album: ALBUM_CATALOG, artist: ARTIST_CATALOG })[kind];
  const fromRow = (r) => ({ kind: r.kind, title: r.title, artist: r.artist, album: null, year: r.year, cover: null, deezerId: null, explicit: r.explicit, duration: null, genres: [r.genre] });
  const DECADE_RANGE = { '2020s': [2020, 2099], '2010s': [2010, 2019], '2000s': [2000, 2009], '90s': [1990, 1999], '80s': [1980, 1989], '70s': [1970, 1979], '60s': [0, 1969] };
  const VIBE_TAG = { party: 'p', singalong: 's', love: 'l', chill: 'c', feelgood: 'f', workout: 'w', roadtrip: 'r' };

  function catalogBrowse(o, rand) {
    const [from, to] = o.decade ? DECADE_RANGE[o.decade] : [0, 9999];
    let list = catalogFor(o.kind).filter(
      (r) =>
        (!o.genre || r.genre === o.genre) &&
        (o.kind === 'artist' || !o.decade || (r.year >= from && r.year <= to)) &&
        (!o.vibe || r.tags.includes(VIBE_TAG[o.vibe])),
    );
    if (o.list === 'new') list = [...list].sort((a, b) => (b.year || 0) - (a.year || 0));
    else if (o.list === 'classics') list = list.filter((r) => !r.year || r.year < 2000);
    list = o.list === 'surprise' ? shuffle(list, rand) : jumble(list, rand);
    return list.map(fromRow);
  }

  function catalogSearch(kind, q) {
    const k = itemKey(q);
    if (!k) return [];
    return catalogFor(kind)
      .filter((r) => itemKey(r.title).includes(k) || itemKey(`${r.title} ${r.artist || ''}`).includes(k) || itemKey(`${r.artist || ''} ${r.title}`).includes(k))
      .slice(0, 8)
      .map(fromRow);
  }

  // ---------------------------------------------------------------- search

  // "Still Waiting - Sum 41", "Sum 41 – Still Waiting", "still waiting by sum 41"
  const splitQuery = (q) => q.match(/^(.+?)\s+(?:-|–|—|by)\s+(.+)$/i)?.slice(1, 3) || null;

  // Every typed word should show up somewhere in a result.
  const words = (text) => String(text || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').match(/[a-z0-9]+/g) || [];
  const STOP = new Set(['the', 'a', 'an', 'by', 'and', 'of']);
  const mentions = (m, q) => {
    const have = new Set(words(`${m.title} ${m.artist || ''} ${m.album || ''}`));
    return words(q).every((w) => STOP.has(w) || have.has(w));
  };

  async function search(kind, q, { clean = false } = {}) {
    const query = String(q || '').trim().slice(0, 80);
    if (query.length < 2 || !KINDS.includes(kind)) return { results: [], source: null, hidden: 0 };
    const path = { song: '/search/track', album: '/search/album', artist: '/search/artist' }[kind];
    const conv = converter(kind);
    const parts = kind === 'artist' ? null : splitQuery(query);

    // A plain search, plus exact title + artist searches when it looks like
    // "title - artist" (in either order).
    const asks = [deezer(path, { q: query, limit: 50 }, HOUR)];
    if (parts) {
      const field = kind === 'song' ? 'track' : 'album';
      const quote = (s) => `"${s.replace(/"/g, '').trim()}"`;
      asks.push(deezer(path, { q: `${field}:${quote(parts[0])} artist:${quote(parts[1])}`, limit: 15 }, HOUR));
      asks.push(deezer(path, { q: `artist:${quote(parts[0])} ${field}:${quote(parts[1])}`, limit: 15 }, HOUR));
    }
    const answers = await Promise.allSettled(asks);

    // Best matches first: title + artist, then the exact title, then the rest
    // in Deezer's own order (most relevant and popular first).
    const typed = itemKey(query);
    const halves = parts?.map(itemKey);
    const fit = (m) => {
      const k = kind === 'artist' ? itemKey(m.title) : songKey(m.title);
      const a = itemKey(m.artist);
      if (a && (typed === k + a || typed === a + k)) return 3;
      if (halves && a && ((k === halves[0] && a === halves[1]) || (k === halves[1] && a === halves[0]))) return 3;
      if (k === typed) return 2;
      if (halves && (k === halves[0] || k === halves[1])) return 1;
      return 0;
    };

    let merged = [];
    let deezerOk = false;
    for (const [i, a] of answers.entries()) {
      if (a.status === 'rejected') {
        warnOnce('Deezer search', a.reason);
        continue;
      }
      deezerOk = true;
      const items = (a.value.data || []).map(conv);
      // The exact title + artist searches only add exact hits.
      merged = i === 0 ? [...merged, ...items] : [...items.filter((m) => fit(m) === 3), ...merged];
    }
    let source = deezerOk ? 'deezer' : null;
    // Apple fills in when Deezer is down or comes up short.
    if (!deezerOk || dedupe(cleanOnly(merged, clean)).length < 8) {
      try {
        const extra = await itunes(kind, query.replace(/\s+[-–—]\s+/g, ' '), 25);
        merged = [...merged, ...(deezerOk ? extra.filter((m) => mentions(m, query)) : extra)];
        source ||= 'itunes';
      } catch (err) {
        warnOnce('iTunes search', err);
      }
    }
    if (!deezerOk) merged = [...merged, ...catalogSearch(kind, query)];
    source ||= 'offline';

    const ranked = merged.map((m, i) => ({ m, s: fit(m), i })).sort((x, y) => y.s - x.s || x.i - y.i).map((x) => x.m);
    const results = dedupe(cleanOnly(ranked, clean));
    const shown = new Set(results.map(sameKey));
    const hidden = clean ? dedupe(ranked).filter((m) => !shown.has(sameKey(m))).length : 0;
    return {
      results: results.slice(0, SEARCH_SIZE).map(({ previewUrl, url, ...m }) => m),
      source,
      hidden,
    };
  }

  // Best match for something typed in by hand, e.g. "thriller michael jackson".
  async function details(kind, title, { clean = false } = {}) {
    const typed = itemKey(title);
    if (!typed) return null;
    const keyOf = (m) => (kind === 'artist' ? itemKey(m.title) : songKey(m.title));
    const fits = (m) => {
      const k = keyOf(m);
      const a = itemKey(m.artist);
      return k === typed || (a && (typed === k + a || typed === a + k));
    };
    const halves = splitQuery(String(title));
    const fitsSplit = (m) =>
      halves && itemKey(m.artist) && [0, 1].some((i) => keyOf(m) === itemKey(halves[i]) && itemKey(m.artist) === itemKey(halves[1 - i]));
    const { results } = await search(kind, title, { clean });
    return results.find((m) => fits(m) || fitsSplit(m)) || null;
  }

  // ---------------------------------------------------------------- endless ideas
  //
  // Each list is a "feed" that keeps growing: first the chart (when there is
  // one), then playlist after playlist from a long list of matching searches
  // ("90s rock hits", "90s rock anthems", …), then the top songs of artists
  // it has already shown. Every phone gets its own shuffle (the seed), and a
  // feed never repeats a song.

  function playlistQueries(o, rand) {
    const genre = o.genre ? GENRE_WORDS[o.genre] || o.genre.toLowerCase() : '';
    const vibes = o.vibe ? VIBE_WORDS[o.vibe] : [''];
    let tails = [...LIST_WORDS[o.list]];
    if (o.list === 'top' && o.vibe) tails = ['', ...tails]; // "party hits" already says "hits"
    if (o.list === 'classics' && o.genre && !o.vibe) tails = tails.filter((t) => t !== 'greatest hits');
    if (o.list === 'classics' && !o.genre && !o.decade) tails[0] = 'greatest hits of all time';
    const year = new Date().getFullYear();
    const extra = [];
    if (!o.decade && (o.list === 'top' || o.list === 'new')) extra.push(`hits ${year}`, `${year}`, `hits ${year - 1}`, 'viral hits', 'trending');
    if (!o.decade && (o.list === 'classics' || o.list === 'surprise')) extra.push(...['70s', '80s', '90s', '2000s'].map((d) => `${d} ${LIST_WORDS[o.list][0]}`));

    const all = [];
    for (const tail of [...tails, ...extra]) {
      for (const vibe of vibes) all.push([o.decade, genre, vibe, tail].filter(Boolean).join(' '));
    }
    const unique = [...new Set(all)].filter(Boolean);
    const [first, ...rest] = unique;
    return o.list === 'surprise' ? shuffle(unique, rand).slice(0, 24) : [first, ...shuffle(rest, rand)].slice(0, 24);
  }

  function newFeed(o) {
    const rand = seeded([o.seed, o.kind, o.list, o.genre, o.decade, o.vibe, o.clean].join('|'));
    const plain = !o.decade && !o.vibe;
    const queue = [];
    if (o.list === 'top' && plain) queue.push({ type: 'chart' });
    if (o.list === 'new' && plain && o.kind === 'album') queue.push({ type: 'releases' });
    for (const q of playlistQueries(o, rand)) queue.push({ type: 'search', q });
    return {
      o, rand, queue,
      items: [], seen: new Set(), playlists: new Set(),
      artists: [], artistIds: new Set(), expanded: 0,
      done: false, lock: Promise.resolve(), at: Date.now(),
    };
  }

  function getFeed(o) {
    const key = JSON.stringify([o.kind, o.list, o.genre, o.decade, o.vibe, o.clean, o.seed]);
    let feed = feeds.get(key);
    if (!feed || Date.now() - feed.at > 30 * MIN) feed = newFeed(o);
    feed.at = Date.now();
    feeds.delete(key);
    feeds.set(key, feed); // most recently used goes last
    while (feeds.size > 80) feeds.delete(feeds.keys().next().value);
    return feed;
  }

  const rememberArtists = (feed, list) => {
    for (const a of list) {
      if (a?.id && feed.artists.length < 400 && !feed.artistIds.has(a.id)) {
        feed.artistIds.add(a.id);
        feed.artists.push(a);
      }
    }
  };

  // Runs one step of a feed and returns the items it found.
  async function runStep(feed, step) {
    const { o, rand } = feed;
    const path = { song: 'tracks', album: 'albums', artist: 'artists' }[o.kind];
    if (step.type === 'chart' || step.type === 'releases') {
      const list = await genres();
      const genreId = o.genre ? list.find(([, name]) => name.toLowerCase() === o.genre.toLowerCase())?.[0] : 0;
      if (o.genre && !genreId) return [];
      const data = step.type === 'chart'
        ? await deezer(`/chart/${genreId || 0}/${path}`, { limit: 100 }, 30 * MIN)
        : await deezer(`/editorial/${genreId || 0}/releases`, { limit: 100 }, HOUR);
      const rows = data.data || [];
      rememberArtists(feed, o.kind === 'artist' ? rows : rows.map((r) => r.artist));
      return jumble(rows.map(converter(step.type === 'releases' ? 'album' : o.kind)), rand);
    }
    if (step.type === 'search') {
      const found = await deezer('/search/playlist', { q: step.q, limit: 25 }, 6 * HOUR);
      const lists = (found.data || []).filter((p) => (p.nb_tracks || 0) >= 15 && !feed.playlists.has(p.id));
      // Deezer's own editors' playlists first.
      const score = (p) => (/deezer|editor/i.test(p.user?.name || '') ? 3 : 0) + (p.nb_tracks >= 40 ? 1 : 0);
      let ranked = lists.map((p, i) => ({ p, s: score(p) - i * 0.1 })).sort((x, y) => y.s - x.s).map((x) => x.p);
      ranked = o.list === 'surprise' ? shuffle(ranked.slice(0, 15), rand) : [ranked[0], ...shuffle(ranked.slice(1, 10), rand)].filter(Boolean);
      for (const p of ranked) feed.playlists.add(p.id);
      const [best, ...others] = ranked.slice(0, 8).map((p) => ({ type: 'playlist', id: p.id }));
      // The best playlist for this search plays next; the rest wait their
      // turn behind the other searches, so the mix stays varied.
      if (best) feed.queue.unshift(best);
      feed.queue.push(...others);
      return [];
    }
    if (step.type === 'playlist') {
      const data = await deezer(`/playlist/${step.id}/tracks`, { limit: 100 }, 6 * HOUR);
      const tracks = data.data || [];
      rememberArtists(feed, tracks.map((t) => t.artist));
      return shuffle(tracksTo(o.kind, tracks), rand);
    }
    if (step.type === 'artist') {
      const a = step.artist;
      if (o.kind === 'song') {
        const data = await deezer(`/artist/${a.id}/top`, { limit: 25 }, 6 * HOUR);
        return shuffle((data.data || []).map(fromTrack), rand);
      }
      if (o.kind === 'album') {
        const data = await deezer(`/artist/${a.id}/albums`, { limit: 25 }, 6 * HOUR);
        const albums = (data.data || []).filter((x) => !x.record_type || x.record_type === 'album');
        return shuffle(albums.map((x) => fromAlbum(x, a)), rand);
      }
      const data = await deezer(`/artist/${a.id}/related`, { limit: 25 }, 6 * HOUR);
      const related = data.data || [];
      rememberArtists(feed, related); // and so on, and so on
      return shuffle(related.map((x) => fromArtist(x)), rand);
    }
    return [];
  }

  // Adds what's new, skipping anything already shown in this feed.
  function take(feed, items) {
    let added = 0;
    for (const m of cleanOnly(items, feed.o.clean)) {
      const k = sameKey(m);
      if (!m.title || feed.seen.has(k)) continue;
      feed.seen.add(k);
      feed.items.push(m);
      added += 1;
      if (feed.items.length >= FEED_MAX) break;
    }
    return added;
  }

  // Grows the feed until it has `want` items. Stops after a handful of calls
  // so one request never takes too long; the next scroll picks up from there.
  async function fill(feed, want, budget) {
    let failures = 0;
    while (feed.items.length < want && !feed.done && budget > 0) {
      if (feed.items.length >= FEED_MAX) {
        feed.done = true;
        break;
      }
      if (!feed.queue.length) {
        const next = feed.artists[feed.expanded];
        if (!next) {
          feed.done = true;
          break;
        }
        feed.expanded += 1;
        feed.queue.push({ type: 'artist', artist: next });
      }
      const step = feed.queue.shift();
      budget -= 1;
      try {
        take(feed, await runStep(feed, step));
      } catch (err) {
        warnOnce('Deezer ideas', err);
        step.tries = (step.tries || 0) + 1;
        if (step.tries < 3) feed.queue.push(step);
        if (++failures >= 3) break;
      }
    }
  }

  async function browse(query = {}) {
    const o = {
      kind: KINDS.includes(query.kind) ? query.kind : 'song',
      list: LISTS.includes(query.list) ? query.list : 'top',
      genre: String(query.genre || '').slice(0, 40) || null,
      decade: DECADES.includes(query.decade) ? query.decade : null,
      vibe: VIBE_WORDS[query.vibe] ? query.vibe : null,
      clean: query.clean === '1' || query.clean === true,
      seed: String(query.seed || '').slice(0, 24),
    };
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const offset = Math.min(FEED_MAX, Math.max(0, parseInt(query.offset, 10) || (page - 1) * PAGE_SIZE));
    const want = offset + PAGE_SIZE;

    const feed = getFeed(o);
    // One request at a time per feed, so two quick scrolls don't double up.
    const run = feed.lock.then(() => fill(feed, want, feed.items.length < offset ? 40 : 12));
    feed.lock = run.catch(() => {});
    await run;

    if (feed.items.length) {
      const results = feed.items.slice(offset, want);
      const more = !feed.done || feed.items.length > offset + results.length;
      return { results, offset, next: offset + results.length, more, source: 'deezer' };
    }
    const all = dedupe(cleanOnly(catalogBrowse(o, seeded(`${o.seed}|${o.kind}|${o.list}`)), o.clean));
    const results = all.slice(offset, want);
    return { results, offset, next: offset + results.length, more: all.length > want, source: 'offline' };
  }

  // ---------------------------------------------------------------- other lookups

  async function meta() {
    let names = CATALOG_GENRES;
    let source = 'offline';
    try {
      const data = await deezer('/genre', {}, 24 * HOUR);
      const list = (data.data || []).filter((g) => g.id !== 0).map((g) => g.name);
      if (list.length) {
        names = list;
        source = 'deezer';
      }
    } catch (err) {
      warnOnce('Deezer genres', err);
    }
    return { source, genres: names, decades: DECADES, vibes: Object.keys(VIBE_WORDS) };
  }

  // A 30-second preview. Deezer preview links expire, so they're fetched fresh.
  async function preview({ kind, id, title, artist }) {
    const deezerId = parseInt(id, 10) || null;
    try {
      if (deezerId && kind === 'song') {
        const t = await deezer(`/track/${deezerId}`, {}, 10 * MIN);
        if (t.preview) return { url: t.preview, title: t.title_short || t.title, artist: t.artist?.name };
      }
      if (deezerId && kind === 'album') {
        const data = await deezer(`/album/${deezerId}/tracks`, { limit: 50 }, 10 * MIN);
        const best = (data.data || []).filter((t) => t.preview).sort((a, b) => (b.rank || 0) - (a.rank || 0))[0];
        if (best) return { url: best.preview, title: best.title_short || best.title, artist: best.artist?.name };
      }
      if (deezerId && kind === 'artist') {
        const data = await deezer(`/artist/${deezerId}/top`, { limit: 5 }, 10 * MIN);
        const best = (data.data || []).find((t) => t.preview);
        if (best) return { url: best.preview, title: best.title_short || best.title, artist: best.artist?.name };
      }
      // Typed in by hand: find it first.
      const q = [title, artist].filter(Boolean).join(' ');
      if (q) {
        const path = kind === 'artist' ? `/search/artist` : kind === 'album' ? '/search/album' : '/search/track';
        const hit = (await deezer(path, { q, limit: 1 }, HOUR)).data?.[0];
        if (hit?.id) return preview({ kind, id: hit.id });
      }
    } catch (err) {
      warnOnce('Deezer previews', err);
    }
    try {
      const q = [title, artist].filter(Boolean).join(' ');
      const hit = q && (await itunes('song', q, 1))[0];
      if (hit?.previewUrl) return { url: hit.previewUrl, title: hit.title, artist: hit.artist };
    } catch (err) {
      warnOnce('iTunes previews', err);
    }
    return { url: null };
  }

  // The exact song (or album, or artist) on Apple Music, from Apple's own
  // catalog. Its search page doesn't reliably open in the Music app.
  async function appleLink(kind, title, artist) {
    const k = kind === 'artist' ? itemKey(title) : songKey(title);
    const a = itemKey(artist);
    const found = await itunes(kind, [title, artist].filter(Boolean).join(' '), 15);
    const same = (m) => (kind === 'artist' ? itemKey(m.title) : songKey(m.title)) === k;
    const hit =
      found.find((m) => m.url && same(m) && (!a || itemKey(m.artist) === a)) ||
      found.find((m) => m.url && same(m) && a && itemKey(m.artist).includes(a));
    return hit?.url || null;
  }

  // Direct Spotify, Apple Music and YouTube links for a Deezer song or album.
  async function songLinks(kind, deezerId) {
    const page = `https://www.deezer.com/${kind === 'song' ? 'track' : 'album'}/${deezerId}`;
    const url = `${odesliBase}/v1-alpha.1/links?${new URLSearchParams({ url: page, userCountry: 'US' })}`;
    const data = await cache.wrap(url, 24 * HOUR, () => getJson(url));
    const at = (name) => data?.linksByPlatform?.[name]?.url || null;
    return { spotify: at('spotify'), apple: at('appleMusic'), youtube: at('youtube') || at('youtubeMusic') };
  }

  // Extra facts and "listen on" links for the champion. Each lookup is
  // cached on its own, so a failed one is tried again next time.
  async function about(query) {
    const kind = KINDS.includes(query.kind) ? query.kind : 'song';
    const deezerId = parseInt(query.id, 10) || null;
    const title = String(query.title || '').slice(0, 150);
    const artist = String(query.artist || '').slice(0, 120);
    const q = encodeURIComponent([title, artist].filter(Boolean).join(' '));
    const path = kind === 'song' ? 'track' : kind;
    const out = {
      links: {
        spotify: `https://open.spotify.com/search/${q}`,
        apple: `https://music.apple.com/us/search?term=${q}`,
        youtube: `https://www.youtube.com/results?search_query=${q}`,
        deezer: deezerId ? `https://www.deezer.com/${path}/${deezerId}` : `https://www.deezer.com/search/${q}`,
      },
      facts: null,
    };
    const [direct, apple, details] = await Promise.all([
      deezerId && kind !== 'artist'
        ? songLinks(kind, deezerId).catch((err) => warnOnce('song.link', err))
        : null,
      title ? appleLink(kind, title, artist).catch((err) => warnOnce('Apple Music links', err)) : null,
      deezerId ? deezer(`/${path}/${deezerId}`, {}, 6 * HOUR).catch((err) => warnOnce('Deezer details', err)) : null,
    ]);
    // Apple's own catalog first; song.link's Apple link is a good second.
    out.links.apple = apple || direct?.apple || out.links.apple;
    out.links.spotify = direct?.spotify || out.links.spotify;
    out.links.youtube = direct?.youtube || out.links.youtube;
    const d = details;
    if (!d) return out;
    if (kind === 'song') {
      out.facts = {
        year: yearOf(d.release_date || d.album?.release_date),
        album: d.album?.title || null,
        duration: d.duration || null,
        bpm: d.bpm ? Math.round(d.bpm) : null,
        cover: picture(d.album?.cover_xl || d.album?.cover_big),
      };
    } else if (kind === 'album') {
      out.facts = {
        year: yearOf(d.release_date),
        tracks: d.nb_tracks || null,
        duration: d.duration || null,
        label: d.label || null,
        genres: (d.genres?.data || []).map((g) => g.name).slice(0, 3),
        fans: d.fans || null,
        cover: picture(d.cover_xl || d.cover_big),
      };
    } else {
      out.facts = { fans: d.nb_fan || null, albums: d.nb_album || null, cover: picture(d.picture_xl || d.picture_big) };
    }
    return out;
  }

  // A quick live check of each source, for /api/music/status.
  function status() {
    return cache.wrap('status', 30_000, async () => {
      const probe = async (load) => {
        const t = Date.now();
        try {
          const out = await load();
          return { ok: true, ms: Date.now() - t, ...out };
        } catch (err) {
          return { ok: false, ms: Date.now() - t, error: err.message };
        }
      };
      const name = (m) => (m ? `${m.title} – ${m.artist}` : null);
      const [deezerNow, itunesNow] = await Promise.all([
        probe(async () => ({ top: name((await deezer('/search/track', { q: 'still waiting sum 41', limit: 3 }, 0)).data?.map(fromTrack)[0]) })),
        probe(async () => ({ top: name((await itunes('song', 'still waiting sum 41', 3, 0))[0]) })),
      ]);
      return {
        checkedAt: new Date().toISOString(),
        deezer: { now: deezerNow, ...health.deezer },
        itunes: { now: itunesNow, ...health.itunes },
        ideaLists: feeds.size,
      };
    });
  }

  return { source: 'deezer', search, details, browse, meta, preview, about, status };
}
