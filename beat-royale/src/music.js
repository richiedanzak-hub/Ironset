// Music data for search, the brainstorm helper, previews and "listen on".
//
// Deezer's public API needs no key or account and has daily-updated charts,
// album covers, artist photos and 30-second previews, so it's the main source.
// If Deezer can't be reached, search falls back to Apple's iTunes search
// (also keyless) and browsing falls back to a built-in list of classics.

import { SONG_CATALOG, ALBUM_CATALOG, ARTIST_CATALOG, CATALOG_GENRES } from './catalog.js';
import { itemKey, songKey } from './game.js';

const PAGE_SIZE = 24;
const MIN = 60_000;
const HOUR = 60 * MIN;

export const KINDS = ['song', 'album', 'artist'];
export const LISTS = ['top', 'new', 'classics', 'surprise'];
export const DECADES = ['2020s', '2010s', '2000s', '90s', '80s', '70s', '60s'];
export const VIBES = {
  party: 'party hits',
  singalong: 'sing along',
  feelgood: 'feel good hits',
  chill: 'chill hits',
  workout: 'workout hits',
  roadtrip: 'road trip songs',
  love: 'love songs',
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

function shuffle(list, rng = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Deezer serves a grey placeholder for artists with no photo; treat it as none.
const picture = (url) => (typeof url === 'string' && url && !/\/images\/(artist|cover)\/\//.test(url) ? url : null);

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
  fetchImpl = globalThis.fetch,
  rng = Math.random,
} = {}) {
  const cache = new Cache();

  async function getJson(url) {
    const res = await fetchImpl(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`${new URL(url).host} answered ${res.status}`);
    return JSON.parse(await res.text());
  }

  // Deezer reports errors (like "quota exceeded") inside a 200 response.
  function deezer(path, params = {}, ttl = HOUR) {
    const url = new URL(deezerBase + path);
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    return cache.wrap(url.toString(), ttl, async () => {
      const data = await getJson(url.toString());
      if (data?.error) {
        if (data.error.code === 800) return { data: [] }; // "no data"
        throw new Error(`Deezer: ${data.error.message || data.error.type}`);
      }
      return data;
    });
  }

  const warned = new Set();
  const warnOnce = (what, err) => {
    if (warned.has(what)) return;
    warned.add(what);
    console.warn(`[music] ${what} unavailable: ${err.message}`);
  };

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

  const dedupe = (items) => {
    const seen = new Set();
    return items.filter((m) => {
      const k = `${m.kind === 'artist' ? itemKey(m.title) : songKey(m.title)}|${itemKey(m.artist)}`;
      return !seen.has(k) && seen.add(k);
    });
  };

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

  // Finds a fitting playlist ("90s rock hits") and returns its tracks.
  // Deezer's own editors' playlists win over fan-made ones.
  async function playlistTracks(query, { random = false } = {}) {
    const found = await deezer('/search/playlist', { q: query, limit: 12 }, 6 * HOUR);
    const lists = (found.data || []).filter((p) => (p.nb_tracks || 0) >= 15);
    if (!lists.length) return [];
    const score = (p) => (/deezer|editor/i.test(p.user?.name || '') ? 3 : 0) + (p.nb_tracks >= 40 ? 1 : 0);
    const ranked = lists.map((p, i) => ({ p, s: score(p) - i * 0.1 })).sort((x, y) => y.s - x.s).map((x) => x.p);
    const pick = random ? ranked[Math.floor(rng() * Math.min(5, ranked.length))] : ranked[0];
    const tracks = await deezer(`/playlist/${pick.id}/tracks`, { limit: 150 }, 6 * HOUR);
    return tracks.data || [];
  }

  async function deezerBrowse(o) {
    const genreList = await genres();
    const genreId = o.genre ? genreList.find(([, name]) => name.toLowerCase() === o.genre.toLowerCase())?.[0] : 0;
    const plain = !o.decade && !o.vibe;
    const path = { song: 'tracks', album: 'albums', artist: 'artists' }[o.kind];

    // Today's charts, overall or for one genre.
    if (o.list === 'top' && plain) {
      const data = await deezer(`/chart/${genreId || 0}/${path}`, { limit: 100 }, 30 * MIN);
      const conv = { song: fromTrack, album: (a) => fromAlbum(a), artist: (a) => fromArtist(a) }[o.kind];
      const items = (data.data || []).map(conv);
      if (items.length >= 10) return items;
    }
    // Fresh albums straight from Deezer's editors.
    if (o.list === 'new' && plain && o.kind === 'album') {
      const data = await deezer(`/editorial/${genreId || 0}/releases`, { limit: 60 }, HOUR);
      const items = (data.data || []).map((a) => fromAlbum(a));
      if (items.length >= 10) return items;
    }
    // Everything else: a matching playlist, e.g. "80s rock party hits".
    const genreWord = o.genre ? GENRE_WORDS[o.genre] || o.genre.toLowerCase() : '';
    const tail = {
      top: o.vibe ? '' : 'hits',
      new: 'new releases',
      classics: o.genre ? 'classics' : 'greatest hits of all time',
      surprise: ['hits', 'classics', 'anthems', 'essentials', 'hidden gems'][Math.floor(rng() * 5)],
    }[o.list];
    const query = [o.decade, genreWord, o.vibe ? VIBES[o.vibe] : '', tail].filter(Boolean).join(' ');
    const tracks = await playlistTracks(query, { random: o.list === 'surprise' });
    return tracksTo(o.kind, o.list === 'surprise' ? shuffle(tracks, rng) : tracks);
  }

  // ---------------------------------------------------------------- iTunes (backup search)

  async function itunes(kind, term, limit = 15) {
    const url = `${itunesBase}/search?${new URLSearchParams({ term, media: 'music', entity: ITUNES_KIND[kind], limit: String(limit), country: 'US' })}`;
    const data = await cache.wrap(url, 6 * HOUR, () => getJson(url));
    const art = (u) => (u ? u.replace(/\/\d+x\d+bb\./, '/500x500bb.') : null);
    return (data.results || []).map((r) => {
      if (kind === 'song') {
        return {
          kind, title: r.trackName, artist: r.artistName || null, album: r.collectionName || null,
          year: yearOf(r.releaseDate), cover: art(r.artworkUrl100), deezerId: null,
          explicit: r.trackExplicitness === 'explicit', duration: r.trackTimeMillis ? Math.round(r.trackTimeMillis / 1000) : null,
          genres: r.primaryGenreName ? [r.primaryGenreName] : [], previewUrl: r.previewUrl || null,
        };
      }
      if (kind === 'album') {
        return {
          kind, title: r.collectionName, artist: r.artistName || null, album: null,
          year: yearOf(r.releaseDate), cover: art(r.artworkUrl100), deezerId: null,
          explicit: r.collectionExplicitness === 'explicit', duration: null,
          genres: r.primaryGenreName ? [r.primaryGenreName] : [],
        };
      }
      return { kind, title: r.artistName, artist: null, album: null, year: null, cover: null, deezerId: null, explicit: false, duration: null, genres: r.primaryGenreName ? [r.primaryGenreName] : [] };
    }).filter((m) => m.title);
  }

  // ---------------------------------------------------------------- built-in list

  const catalogFor = (kind) => ({ song: SONG_CATALOG, album: ALBUM_CATALOG, artist: ARTIST_CATALOG })[kind];
  const fromRow = (r) => ({ kind: r.kind, title: r.title, artist: r.artist, album: null, year: r.year, cover: null, deezerId: null, explicit: r.explicit, duration: null, genres: [r.genre] });
  const DECADE_RANGE = { '2020s': [2020, 2099], '2010s': [2010, 2019], '2000s': [2000, 2009], '90s': [1990, 1999], '80s': [1980, 1989], '70s': [1970, 1979], '60s': [0, 1969] };
  const VIBE_TAG = { party: 'p', singalong: 's', love: 'l', chill: 'c', feelgood: 'f', workout: 'w', roadtrip: 'r' };

  function catalogBrowse(o) {
    const [from, to] = o.decade ? DECADE_RANGE[o.decade] : [0, 9999];
    let list = catalogFor(o.kind).filter(
      (r) =>
        (!o.genre || r.genre === o.genre) &&
        (o.kind === 'artist' || !o.decade || (r.year >= from && r.year <= to)) &&
        (!o.vibe || r.tags.includes(VIBE_TAG[o.vibe])),
    );
    if (o.list === 'new') list = [...list].sort((a, b) => (b.year || 0) - (a.year || 0));
    else if (o.list === 'classics') list = list.filter((r) => !r.year || r.year < 2000);
    else if (o.list === 'surprise') list = shuffle(list, rng);
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

  const cleanOnly = (items, clean) => (clean ? items.filter((m) => !m.explicit) : items);

  // ---------------------------------------------------------------- public

  async function search(kind, q, { clean = false } = {}) {
    const query = String(q || '').trim().slice(0, 80);
    if (query.length < 2 || !KINDS.includes(kind)) return [];
    try {
      const path = { song: '/search/track', album: '/search/album', artist: '/search/artist' }[kind];
      const data = await deezer(path, { q: query, limit: 20 }, HOUR);
      const conv = { song: fromTrack, album: (a) => fromAlbum(a), artist: (a) => fromArtist(a) }[kind];
      return cleanOnly(dedupe((data.data || []).map(conv)), clean).slice(0, 12);
    } catch (err) {
      warnOnce('Deezer search', err);
    }
    let found = [];
    try {
      found = await itunes(kind, query);
    } catch (err) {
      warnOnce('iTunes search', err);
    }
    return cleanOnly(dedupe([...found, ...catalogSearch(kind, query)]), clean)
      .map(({ previewUrl, ...m }) => m)
      .slice(0, 12);
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
    return (await search(kind, title, { clean })).find(fits) || null;
  }

  async function browse(query = {}) {
    const o = {
      kind: KINDS.includes(query.kind) ? query.kind : 'song',
      list: LISTS.includes(query.list) ? query.list : 'top',
      genre: String(query.genre || '').slice(0, 40) || null,
      decade: DECADES.includes(query.decade) ? query.decade : null,
      vibe: VIBES[query.vibe] ? query.vibe : null,
      clean: query.clean === '1' || query.clean === true,
      page: Math.min(50, Math.max(1, parseInt(query.page, 10) || 1)),
    };
    let all;
    let source = 'deezer';
    try {
      all = await deezerBrowse(o);
    } catch (err) {
      warnOnce('Deezer browse', err);
    }
    if (!all?.length) {
      all = catalogBrowse(o);
      source = 'offline';
    }
    all = cleanOnly(dedupe(all), o.clean);
    const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    const start = (o.page - 1) * PAGE_SIZE;
    return { results: all.slice(start, start + PAGE_SIZE), page: o.page, pages, source };
  }

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
    return { source, genres: names, decades: DECADES, vibes: Object.keys(VIBES) };
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

  // Extra facts and "listen on" links for the champion.
  async function about({ kind, id, title, artist }) {
    const q = encodeURIComponent([title, artist].filter(Boolean).join(' '));
    const deezerId = parseInt(id, 10) || null;
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
    if (!deezerId) return out;
    try {
      const d = await deezer(`/${path}/${deezerId}`, {}, 6 * HOUR);
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
    } catch (err) {
      warnOnce('Deezer details', err);
    }
    return out;
  }

  return { source: 'deezer', search, details, browse, meta, preview, about };
}
