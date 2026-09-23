import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createMovies } from '../src/movies.js';
import { CATALOG } from '../src/catalog.js';

// A stand-in for TMDB and iTunes that records what it was asked.
const calls = [];
let fake;
let base;

const TMDB = {
  '/3/genre/movie/list': { genres: [{ id: 27, name: 'Horror' }, { id: 35, name: 'Comedy' }, { id: 10770, name: 'TV Movie' }] },
  '/3/search/movie': {
    results: [
      { id: 1, title: 'Jaws 2', release_date: '1978-06-16', poster_path: '/j2.jpg', vote_average: 6.2, vote_count: 900, genre_ids: [27] },
      { id: 578, title: 'Jaws', release_date: '1975-06-20', poster_path: '/jaws.jpg', vote_average: 7.66, vote_count: 10000, genre_ids: [27], overview: 'Shark.' },
    ],
  },
  '/3/discover/movie': {
    total_pages: 3,
    results: [{ id: 9, title: 'Airplane!', release_date: '1980-07-02', poster_path: '/a.jpg', vote_average: 7.3, vote_count: 3000, genre_ids: [35] }],
  },
  '/3/trending/movie/week': { total_pages: 1, results: [{ id: 5, title: 'New Thing', release_date: '2026-01-01', vote_count: 3, genre_ids: [] }] },
  '/3/movie/578': {
    id: 578,
    title: 'Jaws',
    release_date: '1975-06-20',
    runtime: 124,
    tagline: "You'll never go in the water again.",
    poster_path: '/jaws.jpg',
    vote_average: 7.7,
    vote_count: 10000,
    genres: [{ id: 27, name: 'Horror' }],
    videos: { results: [{ site: 'YouTube', type: 'Teaser', key: 'tease' }, { site: 'YouTube', type: 'Trailer', official: true, key: 'U1fu_sA7XhE' }] },
    'watch/providers': {
      results: {
        US: {
          link: 'https://www.themoviedb.org/movie/578-jaws/watch?locale=US',
          flatrate: [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/n.jpg', display_priority: 2 }, { provider_id: 15, provider_name: 'Hulu', logo_path: '/h.jpg', display_priority: 1 }],
          rent: [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/a.jpg', display_priority: 4 }],
        },
      },
    },
  },
  '/3/watch/providers/movie': {
    results: [
      { provider_id: 8, provider_name: 'Netflix', logo_path: '/n.jpg', display_priorities: { US: 1 } },
      { provider_id: 1796, provider_name: 'Netflix basic with Ads', logo_path: '/nb.jpg', display_priorities: { US: 2 } },
      { provider_id: 1853, provider_name: 'Paramount Plus Apple TV Channel', logo_path: '/p.jpg', display_priorities: { US: 3 } },
      { provider_id: 337, provider_name: 'Disney Plus', logo_path: '/d.jpg', display_priorities: { US: 4 } },
    ],
  },
};

const ITUNES = {
  resultCount: 2,
  results: [
    {
      kind: 'feature-movie',
      trackName: 'Paddington 2',
      releaseDate: '2018-01-12T08:00:00Z',
      primaryGenreName: 'Kids & Family',
      artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/Video/v4/aa/bb/source/100x100bb.jpg',
      trackViewUrl: 'https://itunes.apple.com/us/movie/paddington-2/id1',
      trackRentalPrice: 3.99,
      trackPrice: 9.99,
      currency: 'USD',
      trackTimeMillis: 6240000,
    },
    { kind: 'song', trackName: 'Not a movie' },
  ],
};

before(async () => {
  fake = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    calls.push({ path: url.pathname, params: Object.fromEntries(url.searchParams), auth: req.headers.authorization });
    const body = url.pathname === '/search' ? ITUNES : TMDB[url.pathname];
    res.writeHead(body ? 200 : 404, { 'content-type': url.pathname === '/search' ? 'text/javascript' : 'application/json' });
    res.end(JSON.stringify(body || { status_message: 'nope' }));
  });
  await new Promise((r) => fake.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${fake.address().port}`;
});

after(() => fake.close());

const lastCall = (path) => calls.filter((c) => c.path === path).at(-1);

test('TMDB search maps results and puts exact title matches first', async () => {
  const movies = createMovies({ apiKey: 'a'.repeat(32), tmdbBase: `${base}/3` });
  assert.equal(movies.source, 'tmdb');
  const results = await movies.search('jaws');
  assert.equal(results[0].title, 'Jaws');
  assert.equal(results[0].tmdbId, 578);
  assert.equal(results[0].year, 1975);
  assert.equal(results[0].rating, 7.7);
  assert.equal(results[0].poster, 'https://image.tmdb.org/t/p/w342/jaws.jpg');
  assert.deepEqual(results[0].genres, ['Horror']);
  assert.equal(lastCall('/3/search/movie').params.api_key, 'a'.repeat(32));
});

test('a v4 read token is sent as a bearer header', async () => {
  const token = `eyJ${'x'.repeat(40)}`;
  const movies = createMovies({ apiKey: token, tmdbBase: `${base}/3` });
  await movies.search('bearer check');
  const call = lastCall('/3/search/movie');
  assert.equal(call.auth, `Bearer ${token}`);
  assert.equal(call.params.api_key, undefined);
});

test('brainstorm filters become TMDB discover parameters', async () => {
  const movies = createMovies({ apiKey: 'b'.repeat(32), tmdbBase: `${base}/3` });
  const out = await movies.browse({ list: 'top', genres: 'Comedy,Horror', era: '1980s', providers: '8,337', region: 'gb', family: '1', short: '1', page: '2' });
  assert.equal(out.source, 'tmdb');
  assert.equal(out.results[0].title, 'Airplane!');
  const p = lastCall('/3/discover/movie').params;
  assert.equal(p.sort_by, 'vote_average.desc');
  assert.equal(p.with_genres, '35|27');
  assert.equal(p['primary_release_date.gte'], '1980-01-01');
  assert.equal(p['primary_release_date.lte'], '1989-12-31');
  assert.equal(p.with_watch_providers, '8|337');
  assert.equal(p.watch_region, 'GB');
  assert.equal(p['certification.lte'], 'PG');
  assert.equal(p['with_runtime.lte'], '120');
  assert.equal(p.page, '2');

  const trending = await movies.browse({ list: 'trending' });
  assert.equal(trending.results[0].title, 'New Thing');
  assert.equal(trending.results[0].rating, null, 'too few votes to show a rating');
});

test('streaming filter options skip channel and ad-tier duplicates', async () => {
  const movies = createMovies({ apiKey: 'c'.repeat(32), tmdbBase: `${base}/3` });
  const meta = await movies.meta('us');
  assert.deepEqual(meta.genres, ['Comedy', 'Horror']);
  assert.deepEqual(meta.providers.map((p) => p.name), ['Netflix', 'Disney Plus']);
});

test('where to watch: providers sorted, official trailer linked', async () => {
  const movies = createMovies({ apiKey: 'd'.repeat(32), tmdbBase: `${base}/3` });
  const w = await movies.watch({ tmdbId: '578', title: 'Jaws', year: '1975', region: 'US' });
  assert.equal(w.source, 'tmdb');
  assert.deepEqual(w.stream.map((p) => p.name), ['Hulu', 'Netflix']);
  assert.equal(w.rent[0].logo, 'https://image.tmdb.org/t/p/w92/a.jpg');
  assert.equal(w.links.trailer, 'https://www.youtube.com/watch?v=U1fu_sA7XhE');
  assert.equal(w.details.runtime, 124);
  assert.match(w.link, /themoviedb\.org/);

  // No TMDB id: look it up by title first.
  const byTitle = await movies.watch({ title: 'Jaws', year: '1975', region: 'US' });
  assert.equal(byTitle.stream.length, 2);
});

test('without a key: iTunes search plus the built-in catalog', async () => {
  const movies = createMovies({ apiKey: '', itunesBase: base });
  assert.equal(movies.source, 'offline');
  const results = await movies.search('paddington');
  const p2 = results.find((m) => m.title === 'Paddington 2');
  assert.ok(p2);
  const fromItunes = results.find((m) => m.poster);
  assert.equal(fromItunes.poster, 'https://is1-ssl.mzstatic.com/image/thumb/Video/v4/aa/bb/source/400x600bb.jpg');
  assert.equal(fromItunes.apple, undefined, 'store links stay server-side');
  assert.ok(!results.some((m) => m.title === 'Not a movie'));

  const w = await movies.watch({ title: 'Paddington 2', year: '2018', region: 'US' });
  assert.equal(w.apple.rent, 3.99);
  assert.equal(w.details.runtime, 104);
});

test('offline browse filters and pages the catalog', async () => {
  const movies = createMovies({ apiKey: '', itunesBase: 'http://127.0.0.1:9' });
  const gems = await movies.browse({ list: 'gems' });
  assert.ok(gems.results.length > 10);
  const classics = await movies.browse({ era: 'classic', list: 'top' });
  assert.ok(classics.results.every((m) => m.year <= 1969));
  const all = await movies.browse({ page: '1' });
  assert.equal(all.results.length, 24);
  assert.equal(all.pages, Math.ceil(CATALOG.length / 24));
  const short = await movies.browse({ short: '1', genres: 'Horror' });
  assert.ok(short.results.every((m) => m.runtime <= 120 && m.genres.includes('Horror')));
  // Still works (with the catalog) when iTunes is unreachable.
  assert.equal((await movies.search('the goonies'))[0].year, 1985);
});

test('catalog rows are well formed', () => {
  const seen = new Set();
  const GENRES = new Set(['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western']);
  for (const m of CATALOG) {
    const key = `${m.title}|${m.year}`;
    assert.ok(!seen.has(key), `duplicate ${key}`);
    seen.add(key);
    assert.ok(m.year > 1900 && m.year < 2030, key);
    assert.ok(m.runtime > 60 && m.runtime < 240, key);
    assert.ok(m.score > 0 && m.score <= 10, key);
    assert.ok([1, 2, 3].includes(m.tier), key);
    for (const g of m.genres) assert.ok(GENRES.has(g), `${key}: ${g}`);
  }
});
