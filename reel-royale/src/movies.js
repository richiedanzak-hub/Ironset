// Movie data for search, the brainstorm helper and "where to watch".
//
// With TMDB_API_KEY set, everything comes from The Movie Database (posters,
// ratings, streaming availability via JustWatch). Without a key the game still
// works: search falls back to the iTunes Store search API (no key needed) and
// the brainstorm helper browses the built-in catalog.

import { CATALOG, CATALOG_GENRES } from './catalog.js';
import { movieKey } from './game.js';

const TMDB_IMG = 'https://image.tmdb.org/t/p/';
const PAGE_SIZE = 24;

export const LISTS = ['popular', 'top', 'trending', 'gems', 'surprise'];

export const ERAS = {
  '2020s': [2020, null],
  '2010s': [2010, 2019],
  '2000s': [2000, 2009],
  '1990s': [1990, 1999],
  '1980s': [1980, 1989],
  '1970s': [1970, 1979],
  classic: [null, 1969],
};

// Store and channel add-on entries clutter the "streaming on" filter.
const PROVIDER_NOISE = /channel|with ads|amazon video|google play|fandango|vudu|microsoft|spectrum|directv|youtube|apple tv store|plex channel/i;

const ITUNES_GENRES = {
  'Action & Adventure': 'Action',
  'Kids & Family': 'Family',
  'Sci-Fi & Fantasy': 'Science Fiction',
  'Music Feature Films': 'Music',
  Musicals: 'Music',
  'Concert Films': 'Music',
  Anime: 'Animation',
};

// JustWatch uses "uk" rather than the ISO "gb".
const justWatchCountry = (region) => (region === 'GB' ? 'uk' : region.toLowerCase());

const yearOf = (date) => {
  const y = parseInt(String(date || '').slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
};

const trimText = (s, n = 320) => {
  if (typeof s !== 'string' || !s) return null;
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
};

function shuffle(list, rng = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function cleanRegion(region) {
  const r = String(region || '').toUpperCase();
  return /^[A-Z]{2}$/.test(r) ? r : 'US';
}

// Tiny TTL cache that also shares in-flight requests.
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

const HOUR = 3_600_000;

export function createMovies({
  apiKey = process.env.TMDB_API_KEY || process.env.TMDB_TOKEN || '',
  tmdbBase = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  itunesBase = process.env.ITUNES_BASE_URL || 'https://itunes.apple.com',
  fetchImpl = globalThis.fetch,
  rng = Math.random,
} = {}) {
  const key = apiKey.trim();
  const hasTmdb = key.length > 0;
  // A v4 "read access token" is a JWT; a v3 key is 32 hex characters.
  const bearer = key.startsWith('eyJ');
  const cache = new Cache();

  async function getJson(url, headers = {}) {
    const res = await fetchImpl(url, { headers: { accept: 'application/json', ...headers }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`${new URL(url).host} answered ${res.status}`);
    return JSON.parse(await res.text());
  }

  function tmdb(path, params = {}, ttl = 6 * HOUR) {
    const url = new URL(tmdbBase + path);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
    const cacheKey = url.toString();
    if (!bearer) url.searchParams.set('api_key', key);
    return cache.wrap(cacheKey, ttl, () => getJson(url.toString(), bearer ? { authorization: `Bearer ${key}` } : {}));
  }

  // ------------------------------------------------------------ TMDB

  async function genreMaps() {
    const data = await tmdb('/genre/movie/list', { language: 'en-US' }, 24 * HOUR);
    const byId = new Map();
    const byName = new Map();
    for (const g of data.genres || []) {
      if (g.name === 'TV Movie') continue;
      byId.set(g.id, g.name);
      byName.set(g.name.toLowerCase(), g.id);
    }
    return { byId, byName };
  }

  function fromTmdb(r, byId) {
    return {
      tmdbId: r.id,
      title: r.title || r.original_title,
      year: yearOf(r.release_date),
      poster: r.poster_path ? `${TMDB_IMG}w342${r.poster_path}` : null,
      rating: r.vote_count >= 25 && typeof r.vote_average === 'number' ? Math.round(r.vote_average * 10) / 10 : null,
      genres: (r.genre_ids || r.genres?.map((g) => g.id) || []).map((id) => byId.get(id)).filter(Boolean).slice(0, 3),
      overview: trimText(r.overview),
      runtime: r.runtime || null,
    };
  }

  async function tmdbSearch(q, year) {
    const [{ byId }, data] = await Promise.all([
      genreMaps(),
      tmdb('/search/movie', { query: q, include_adult: false, language: 'en-US', page: 1, year }, HOUR),
    ]);
    const k = movieKey(q);
    const results = (data.results || []).map((r) => fromTmdb(r, byId));
    // Exact title matches float to the top; otherwise keep TMDB's order.
    return [...results.filter((m) => movieKey(m.title) === k), ...results.filter((m) => movieKey(m.title) !== k)];
  }

  async function tmdbBrowse(o) {
    const { byId, byName } = await genreMaps();
    const genreIds = o.genres.map((g) => byName.get(g.toLowerCase())).filter(Boolean);
    const filtered = genreIds.length || o.era || o.providers.length || o.family || o.short;
    if (o.list === 'trending' && !filtered) {
      const data = await tmdb('/trending/movie/week', { language: 'en-US', page: o.page }, 3 * HOUR);
      return { results: (data.results || []).map((r) => fromTmdb(r, byId)), page: o.page, pages: Math.min(data.total_pages || 1, 20) };
    }
    const p = { include_adult: false, include_video: false, language: 'en-US', page: o.page };
    const minVotes = filtered ? 400 : 1500;
    switch (o.list) {
      case 'top':
        Object.assign(p, { sort_by: 'vote_average.desc', 'vote_count.gte': minVotes });
        break;
      case 'gems':
        Object.assign(p, { sort_by: 'vote_average.desc', 'vote_count.gte': 150, 'vote_count.lte': 2500, 'vote_average.gte': 7 });
        break;
      case 'surprise':
        Object.assign(p, { sort_by: 'vote_average.desc', 'vote_count.gte': Math.round(minVotes / 2) });
        break;
      case 'trending': {
        const since = new Date(Date.now() - 540 * 86_400_000).toISOString().slice(0, 10);
        Object.assign(p, { sort_by: 'popularity.desc', 'vote_count.gte': 40 });
        if (!o.era) p['primary_release_date.gte'] = since;
        break;
      }
      default:
        Object.assign(p, { sort_by: 'popularity.desc', 'vote_count.gte': 300 });
    }
    if (genreIds.length) p.with_genres = genreIds.join('|');
    if (o.era) {
      const [from, to] = ERAS[o.era];
      if (from) p['primary_release_date.gte'] = `${from}-01-01`;
      if (to) p['primary_release_date.lte'] = `${to}-12-31`;
    }
    if (o.providers.length) {
      Object.assign(p, { with_watch_providers: o.providers.join('|'), watch_region: o.region, with_watch_monetization_types: 'flatrate|free|ads' });
    }
    if (o.family) Object.assign(p, { certification_country: 'US', 'certification.lte': 'PG' });
    if (o.short) Object.assign(p, { 'with_runtime.gte': 60, 'with_runtime.lte': 120 });

    if (o.list === 'surprise') {
      p.page = 1 + Math.floor(rng() * 12);
      let data = await tmdb('/discover/movie', p);
      if (!data.results?.length && data.total_pages > 0) {
        p.page = 1 + Math.floor(rng() * Math.min(data.total_pages, 500));
        data = await tmdb('/discover/movie', p);
      }
      return { results: shuffle((data.results || []).map((r) => fromTmdb(r, byId)), rng), page: o.page, pages: 50 };
    }
    const data = await tmdb('/discover/movie', p);
    return { results: (data.results || []).map((r) => fromTmdb(r, byId)), page: o.page, pages: Math.min(data.total_pages || 1, 500) };
  }

  function providerList(list) {
    const seen = new Set();
    return (list || [])
      .slice()
      .sort((a, b) => (a.display_priority ?? 99) - (b.display_priority ?? 99))
      .filter((p) => !seen.has(p.provider_id) && seen.add(p.provider_id))
      .map((p) => ({ id: p.provider_id, name: p.provider_name, logo: p.logo_path ? `${TMDB_IMG}w92${p.logo_path}` : null }));
  }

  // ------------------------------------------------------------ iTunes + catalog

  async function itunes(term, { limit = 12, country = 'US' } = {}) {
    const url = `${itunesBase}/search?${new URLSearchParams({ term, media: 'movie', entity: 'movie', limit: String(limit), country })}`;
    const data = await cache.wrap(url, 6 * HOUR, () => getJson(url));
    return (data.results || [])
      .filter((r) => r.trackName && (!r.kind || r.kind === 'feature-movie'))
      .map((r) => ({
        title: r.trackName,
        year: yearOf(r.releaseDate),
        poster: r.artworkUrl100 ? r.artworkUrl100.replace(/\/\d+x\d+bb\./, '/400x600bb.') : null,
        genres: r.primaryGenreName ? [ITUNES_GENRES[r.primaryGenreName] || r.primaryGenreName] : [],
        overview: trimText(r.longDescription),
        runtime: r.trackTimeMillis ? Math.round(r.trackTimeMillis / 60000) : null,
        rating: null,
        tmdbId: null,
        apple: { url: r.trackViewUrl, rent: r.trackRentalPrice ?? null, buy: r.trackPrice ?? r.collectionPrice ?? null, currency: r.currency },
      }));
  }

  const fromCatalog = (m) => ({
    title: m.title,
    year: m.year,
    genres: m.genres.slice(0, 3),
    runtime: m.runtime,
    poster: null,
    rating: null,
    tmdbId: null,
    overview: null,
  });

  function catalogSearch(q) {
    const k = movieKey(q);
    if (!k) return [];
    return CATALOG.filter((m) => movieKey(m.title).includes(k))
      .sort((a, b) => Number(movieKey(b.title) === k) - Number(movieKey(a.title) === k) || a.tier - b.tier)
      .slice(0, 8)
      .map(fromCatalog);
  }

  function catalogBrowse(o) {
    const [from, to] = o.era ? ERAS[o.era] : [null, null];
    let list = CATALOG.filter(
      (m) =>
        (!o.genres.length || m.genres.some((g) => o.genres.includes(g))) &&
        (!from || m.year >= from) &&
        (!to || m.year <= to) &&
        (!o.family || m.family) &&
        (!o.short || m.runtime <= 120),
    );
    switch (o.list) {
      case 'top':
        list.sort((a, b) => b.score - a.score || a.tier - b.tier);
        break;
      case 'trending':
        list.sort((a, b) => b.year - a.year || a.tier - b.tier);
        break;
      case 'gems':
        list = list.filter((m) => m.gem || (m.tier === 3 && m.score >= 7.6)).sort((a, b) => b.score - a.score);
        break;
      case 'surprise':
        list = shuffle(list, rng);
        break;
      default:
        list.sort((a, b) => a.tier - b.tier || b.score - a.score || a.rank - b.rank);
    }
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const start = (o.page - 1) * PAGE_SIZE;
    return { results: list.slice(start, start + PAGE_SIZE).map(fromCatalog), page: o.page, pages };
  }

  const dedupe = (list) => {
    const seen = new Set();
    return list.filter((m) => {
      const k = `${movieKey(m.title)}:${m.year || ''}`;
      return !seen.has(k) && seen.add(k);
    });
  };

  const warned = new Set();
  const warnOnce = (what, err) => {
    if (warned.has(what)) return;
    warned.add(what);
    console.warn(`[movies] ${what} unavailable: ${err.message}`);
  };

  // Best match for a title someone typed by hand, or null.
  async function details(title, year) {
    const k = movieKey(title);
    if (!k) return null;
    const exact = (m) => movieKey(m.title) === k && (!year || m.year === year);
    if (hasTmdb) {
      try {
        return (await tmdbSearch(title, year || undefined)).find(exact) || null;
      } catch (err) {
        warnOnce('TMDB search', err);
      }
    }
    const local = CATALOG.find(exact);
    try {
      const hit = (await itunes(title, { limit: 5 })).find(exact);
      if (hit) {
        const { apple, ...m } = hit;
        return local ? { ...m, genres: local.genres.slice(0, 3), year: local.year } : m;
      }
    } catch (err) {
      warnOnce('iTunes search', err);
    }
    return local ? fromCatalog(local) : null;
  }

  // ------------------------------------------------------------ public API

  return {
    source: hasTmdb ? 'tmdb' : 'offline',

    async search(q) {
      const query = String(q || '').trim().slice(0, 80);
      if (query.length < 2) return [];
      if (hasTmdb) {
        try {
          return (await tmdbSearch(query)).slice(0, 10);
        } catch (err) {
          warnOnce('TMDB search', err);
        }
      }
      let found = [];
      try {
        found = await itunes(query, { limit: 10 });
      } catch (err) {
        warnOnce('iTunes search', err);
      }
      return dedupe([...catalogSearch(query), ...found])
        .map(({ apple, ...m }) => m)
        .slice(0, 10);
    },

    details,

    async browse(query = {}) {
      const o = {
        list: LISTS.includes(query.list) ? query.list : 'popular',
        genres: String(query.genres || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6),
        era: ERAS[query.era] ? query.era : null,
        providers: String(query.providers || '').split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 10),
        region: cleanRegion(query.region),
        family: query.family === '1' || query.family === true,
        short: query.short === '1' || query.short === true,
        page: Math.min(500, Math.max(1, parseInt(query.page, 10) || 1)),
      };
      if (hasTmdb) {
        try {
          return { ...(await tmdbBrowse(o)), source: 'tmdb' };
        } catch (err) {
          warnOnce('TMDB browse', err);
        }
      }
      return { ...catalogBrowse(o), source: 'offline' };
    },

    async meta(region) {
      const r = cleanRegion(region);
      if (hasTmdb) {
        try {
          const [{ byId }, providers] = await Promise.all([
            genreMaps(),
            tmdb('/watch/providers/movie', { watch_region: r, language: 'en-US' }, 24 * HOUR),
          ]);
          const streaming = (providers.results || [])
            .map((p) => ({ ...p, display_priority: p.display_priorities?.[r] ?? p.display_priority }))
            .filter((p) => !PROVIDER_NOISE.test(p.provider_name));
          return {
            source: 'tmdb',
            region: r,
            genres: [...byId.values()].sort(),
            providers: providerList(streaming).slice(0, 14),
          };
        } catch (err) {
          warnOnce('TMDB genres/providers', err);
        }
      }
      return { source: 'offline', region: r, genres: CATALOG_GENRES, providers: [] };
    },

    async watch({ tmdbId, title, year, region }) {
      const r = cleanRegion(region);
      const name = String(title || '').slice(0, 150);
      const y = parseInt(year, 10) || null;
      const label = `${name}${y ? ` (${y})` : ''}`;
      const out = {
        region: r,
        source: 'links',
        stream: [],
        free: [],
        rent: [],
        buy: [],
        link: null,
        apple: null,
        details: null,
        links: {
          justwatch: `https://www.justwatch.com/${justWatchCountry(r)}/search?q=${encodeURIComponent(name)}`,
          google: `https://www.google.com/search?q=${encodeURIComponent(`where to watch ${label}`)}`,
          trailer: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${label} trailer`)}`,
        },
      };
      if (hasTmdb) {
        try {
          let id = parseInt(tmdbId, 10) || (await details(name, y))?.tmdbId;
          if (id) {
            const [{ byId }, d] = await Promise.all([
              genreMaps(),
              tmdb(`/movie/${id}`, { language: 'en-US', append_to_response: 'watch/providers,videos' }, 3 * HOUR),
            ]);
            const wp = d['watch/providers']?.results?.[r];
            const videos = (d.videos?.results || []).filter((v) => v.site === 'YouTube');
            const trailer = videos.find((v) => v.type === 'Trailer' && v.official) || videos.find((v) => v.type === 'Trailer') || videos[0];
            if (trailer) out.links.trailer = `https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`;
            Object.assign(out, {
              source: 'tmdb',
              link: wp?.link || `https://www.themoviedb.org/movie/${id}/watch?locale=${r}`,
              stream: providerList(wp?.flatrate),
              free: providerList([...(wp?.free || []), ...(wp?.ads || [])]),
              rent: providerList(wp?.rent),
              buy: providerList(wp?.buy),
              details: { ...fromTmdb(d, byId), tagline: d.tagline || null },
            });
            return out;
          }
        } catch (err) {
          warnOnce('TMDB watch providers', err);
        }
      }
      try {
        const k = movieKey(name);
        const hit = (await itunes(name, { limit: 5, country: r })).find((m) => movieKey(m.title) === k && (!y || m.year === y));
        if (hit) {
          out.apple = hit.apple;
          const { apple, ...details } = hit;
          out.details = details;
        }
      } catch (err) {
        warnOnce('iTunes lookup', err);
      }
      return out;
    },
  };
}
