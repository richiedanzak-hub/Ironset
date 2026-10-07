import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { checkTheme, createMusic } from '../src/music.js';
import { SONG_CATALOG, ALBUM_CATALOG, ARTIST_CATALOG } from '../src/music-catalog.js';

// A stand-in for Deezer and iTunes that records what it was asked.
const calls = [];
let fake;
let base;

const cover = (id) => `https://cdn-images.dzcdn.net/images/cover/${id}/500x500-000000-80-0-0.jpg`;
const artist = (id, name, pic = true) => ({
  id, name, type: 'artist',
  ...(pic ? { picture_big: `https://cdn-images.dzcdn.net/images/artist/a${id}/500x500-000000-80-0-0.jpg` } : {}),
});
const track = (id, title, artistObj, albumId, extra = {}) => ({
  id, title, title_short: title.replace(/ \(.*\)$/, ''), duration: 210, rank: 900000 - id, explicit_lyrics: false,
  preview: `https://cdnt-preview.dzcdn.net/api/1/1/a/b/c/0/${id}.mp3?hdnea=exp=1`,
  artist: artistObj, album: { id: albumId, title: `Album ${albumId}`, cover_big: cover(albumId) }, type: 'track', ...extra,
});

const queen = artist(412, 'Queen');
const eminem = artist(13, 'Eminem');
const sum41 = artist(41000, 'Sum 41');
const saga = artist(53000, 'Saga');
// Papa Roach's "Last Resort": picked from a workout compilation, but it's
// from Infest (2000). Deezer also has a clean Infest, a deluxe reissue, the
// single, a Greatest Hits and a cover band's version.
const roach = { id: 7200, name: 'Papa Roach' };
const onAlbum = (id, albumId, title, extra = {}) => track(id, 'Last Resort', roach, albumId, { explicit_lyrics: true, ...extra, album: { id: albumId, title, cover_big: cover(albumId) } });
const ROACH_TRACKS = [
  onAlbum(7001, 7100, 'The Ultimate Workout Collection: Blood Sweat And Tears'),
  onAlbum(7003, 7302, 'Last Resort'),
  onAlbum(7002, 7300, 'Infest'),
  onAlbum(7007, 7305, 'Infest', { explicit_lyrics: false }),
  onAlbum(7004, 7303, 'Greatest Hits'),
  track(7006, 'Last Resort', artist(9999, 'Tribute Kids'), 9998),
];
const roachAlbum = (id, title, date, type, genre, extra = {}) => ({ id, title, cover_big: cover(id), release_date: date, record_type: type, genre_id: genre, explicit_lyrics: true, ...extra });
// Scorpions' "Rock You Like a Hurricane": first out on Love at First Sting
// (1984). Deezer's search only turns up the 2011 re-recording (Comeblack) and
// a 2015 deluxe reissue, and the 1984 album is on page two of their albums.
const scorpions = { id: 8000, name: 'Scorpions' };
const HURRICANE = 'Rock You Like a Hurricane';
const onScorpionsAlbum = (id, albumId, title) => track(id, HURRICANE, scorpions, albumId, { album: { id: albumId, title, cover_big: cover(albumId) } });
const scorpionsAlbum = (id, title, date) => ({ id, title, cover_big: cover(id), release_date: date, record_type: 'album', genre_id: 152, explicit_lyrics: false });
const MUSICBRAINZ = {
  [`recording:"${HURRICANE}" AND artist:"Scorpions"`]: {
    recordings: [
      { title: HURRICANE, 'artist-credit': [{ name: 'Scorpions' }], 'first-release-date': '2011-11-04', releases: [{ title: 'Comeblack', date: '2011-11-04', 'release-group': { 'primary-type': 'Album' } }] },
      {
        title: HURRICANE, 'artist-credit': [{ name: 'Scorpions' }], 'first-release-date': '1984-02-20',
        releases: [
          { title: 'Best of Rockers ’n’ Ballads', date: '1989-09-01', 'release-group': { 'primary-type': 'Album', 'secondary-types': ['Compilation'] } },
          { title: 'Love at First Sting', date: '1984-03-27', 'release-group': { 'primary-type': 'Album', 'secondary-types': [] } },
        ],
      },
      { title: `${HURRICANE} (live)`, 'artist-credit': [{ name: 'Scorpions' }], 'first-release-date': '1985-06-01', releases: [{ title: 'World Wide Live', date: '1985-06-01', 'release-group': { 'primary-type': 'Album', 'secondary-types': ['Live'] } }] },
      { title: HURRICANE, 'artist-credit': [{ name: 'Tribute Band' }], 'first-release-date': '1979-01-01' },
    ],
  },
};
const QUOTA = { error: { type: 'Exception', message: 'Quota limit exceeded', code: 4 } };
let flaky = 0;

// Endless playlists for "pop" searches: five per search, fifty songs each,
// with a few hits that show up in every playlist.
const hash = (text) => [...text].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7);
const popPlaylists = (q) => ({ data: Array.from({ length: 5 }, (_, j) => ({ id: 100000 + hash(q) * 10 + j, title: `${q} ${j}`, nb_tracks: 50, user: { name: j ? 'fan' : 'Deezer Pop Editor' } })) });
const popTracks = (id) => ({
  data: Array.from({ length: 50 }, (_, i) =>
    i < 5
      ? track(id * 100 + i, `Shared Hit ${i}`, artist(90000 + i, 'Shared Star'), 91000 + i)
      : track(id * 100 + i, `Pop Song ${id}-${i}`, artist(id * 10 + (i % 7), `Pop Star ${id}-${i % 7}`), id * 10 + i),
  ),
});
const DYNAMIC = [
  [/^\/playlist\/(\d+)\/tracks$/, (id) => (id >= 100000 ? popTracks(id) : null)],
  [/^\/artist\/(\d+)\/related$/, (id) => ({ data: Array.from({ length: 10 }, (_, k) => ({ ...artist((id * 10 + k + 1) % 1e9, `Related ${id}-${k}`) })) })],
  // Chart songs on their own; Chart Song 3 has no preview anywhere.
  [/^\/track\/(\d+)$/, (id) =>
    id >= 100 && id < 130 ? track(id, `Chart Song ${id - 100}`, artist(400 + id, `Star ${id - 100}`), 500 + id, id === 103 ? { preview: '' } : {})
    : id >= 300 && id < 312 ? track(id, `Rock Chart ${id - 300}`, artist(10 + id, `Rocker ${id - 300}`), 20 + id)
    : DEEZER['/playlist/52/tracks'].data.find((t) => t.id === id) || null],
  [/^\/artist\/(\d+)\/top$/, (id) => ({ data: Array.from({ length: 10 }, (_, k) => track(id * 100 + k, `Top ${id}-${k}`, artist(id, `Artist ${id}`), id)) })],
];
const nopic = { id: 77, name: 'Fan Band', picture_big: 'https://cdn-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg' };

const DEEZER = {
  '/genre': { data: [{ id: 0, name: 'All' }, { id: 132, name: 'Pop' }, { id: 152, name: 'Rock' }, { id: 116, name: 'Rap/Hip Hop' }, { id: 85, name: 'Alternative' }] },
  '/track/7001': { ...ROACH_TRACKS[0], release_date: '2010-07-17' },
  // A "rock anthems" playlist: Guns N' Roses are rock (1987). Bon Jovi here
  // are like a pop singer with a few "Alternative" albums: most of their
  // albums would pass for rock, but the hit is on a pop album.
  '/artist/41/albums': { data: [{ id: 210, title: 'Appetite for Destruction', record_type: 'album', genre_id: 152, release_date: '1987-07-21' }] },
  '/artist/42/albums': {
    data: [
      { id: 211, title: 'Slippery When Wet', record_type: 'album', genre_id: 132, release_date: '1986-08-18' },
      { id: 212, title: 'Have a Nice Day', record_type: 'album', genre_id: 85, release_date: '2005-09-20' },
      { id: 213, title: 'Lost Highway', record_type: 'album', genre_id: 85, release_date: '2007-06-19' },
    ],
  },
  '/artist/7200/albums': {
    data: [
      roachAlbum(7300, 'Infest', '2000-04-25', 'album', 152),
      roachAlbum(7305, 'Infest', '2000-04-25', 'album', 152, { explicit_lyrics: false }),
      roachAlbum(7301, 'Infest (Deluxe Edition)', '2020-04-24', 'album', 152),
      roachAlbum(7302, 'Last Resort', '2000-02-01', 'single', 85),
      roachAlbum(7303, 'Greatest Hits', '2010-06-08', 'compile', 116),
      roachAlbum(7304, 'Getting Away With Murder', '2004-08-31', 'album', 85),
    ],
  },
  '/track/8001': { ...onScorpionsAlbum(8001, 8100, 'Comeblack'), release_date: '2011-11-04' },
  '/artist/8000/albums': (q, params) =>
    params.get('index') === '100'
      ? { data: [scorpionsAlbum(8102, 'Love At First Sting', '1984-03-27'), scorpionsAlbum(8103, 'Blackout', '1982-03-29')] }
      : {
          data: [scorpionsAlbum(8100, 'Comeblack', '2011-11-04'), scorpionsAlbum(8101, 'Love At First Sting (50th Anniversary Deluxe Edition)', '2015-11-06')],
          next: 'https://api.deezer.com/artist/8000/albums?limit=100&index=100',
        },
  '/album/8102/tracks': { data: [{ id: 8003, title: HURRICANE, duration: 252, explicit_lyrics: false, artist: scorpions }, { id: 8004, title: 'Still Loving You', artist: scorpions }] },
  '/album/8102': { id: 8102, title: 'Love At First Sting', record_type: 'album', genres: { data: [{ name: 'Rock' }] } },
  '/album/7300': { id: 7300, title: 'Infest', record_type: 'album', genres: { data: [{ name: 'Rock' }, { name: 'Alternative' }] } },
  '/album/7301': { id: 7301, title: 'Infest (Deluxe Edition)', release_date: '2020-04-24', record_type: 'album', cover_big: cover(7301), artist: roach, genres: { data: [{ name: 'Rock' }] } },
  '/search/track': (q) => {
    if (q === 'quota') return QUOTA;
    if (q === 'flaky' && flaky++ === 0) return QUOTA;
    if (q === 'track:"Still Waiting" artist:"Sum 41"') return { data: [track(41, 'Still Waiting', sum41, 4100, { explicit_lyrics: true })] };
    if (/^still waiting/i.test(q)) {
      // Lots of songs share the name; Sum 41's isn't in the first page.
      return { data: Array.from({ length: 50 }, (_, i) => track(4200 + i, i % 2 ? 'Still Waiting' : 'Still Waiting for You', artist(4300 + i, `Band ${i}`), 4400 + i)) };
    }
    if (q === 'on the loose') {
      return { data: [track(51, 'On the Loose Tonight', artist(5100, 'Party Crew'), 5101), track(52, 'On the Loose', artist(5200, 'Niall Horan'), 5201), track(53, 'On the Loose', saga, 5301)] };
    }
    if (q === 'track:"Last Resort" artist:"Papa Roach"') return { data: ROACH_TRACKS };
    if (q === `track:"Sweet Child O' Mine" artist:"Guns N' Roses"`) return { data: [track(201, "Sweet Child O' Mine", artist(41, "Guns N' Roses", false), 210)] };
    if (q === `track:"Livin' on a Prayer" artist:"Bon Jovi"`) return { data: [track(202, "Livin' on a Prayer", artist(42, 'Bon Jovi', false), 211)] };
    if (q === `track:"${HURRICANE}" artist:"Scorpions"`) {
      return { data: [onScorpionsAlbum(8001, 8100, 'Comeblack'), onScorpionsAlbum(8002, 8101, 'Love At First Sting (50th Anniversary Deluxe Edition)')] };
    }
    if (q === 'last resort') return { data: [ROACH_TRACKS[0], ROACH_TRACKS[2]] };
    if (q === 'dirty') {
      return { data: [track(61, 'Still Waiting', sum41, 6100, { explicit_lyrics: true }), track(62, 'Still Waiting', sum41, 6200), track(63, 'Only Dirty', eminem, 6300, { explicit_lyrics: true })] };
    }
    return {
      data: [
        track(1, 'Bohemian Rhapsody', queen, 10),
        track(2, 'Bohemian Rhapsody (Remastered 2011)', queen, 11),
        track(3, 'Lose Yourself', eminem, 20, { explicit_lyrics: true }),
      ],
    };
  },
  '/search/album': () => ({ data: [{ id: 10, title: 'A Night at the Opera', cover_big: cover(10), explicit_lyrics: false, artist: queen, type: 'album' }] }),
  '/search/artist': () => ({ data: [{ ...queen, nb_fan: 5000000 }, nopic] }),
  '/chart/0/tracks': { data: Array.from({ length: 30 }, (_, i) => track(100 + i, `Chart Song ${i}`, artist(500 + i, `Star ${i}`), 600 + i)) },
  '/chart/0/albums': { data: Array.from({ length: 12 }, (_, i) => ({ id: 700 + i, title: `Hot Album ${i}`, cover_big: cover(700 + i), artist: artist(800 + i, `Band ${i}`) })) },
  '/chart/152/tracks': { data: Array.from({ length: 12 }, (_, i) => track(300 + i, `Rock Chart ${i}`, artist(310 + i, `Rocker ${i}`), 320 + i)) },
  '/editorial/0/releases': { data: Array.from({ length: 12 }, (_, i) => ({ id: 1000 + i, title: `Fresh ${i}`, release_date: '2026-09-26', cover_big: cover(1000 + i), artist: artist(1100 + i, `New Act ${i}`) })) },
  '/search/playlist': (q) => (/\bpop\b/.test(q) ? popPlaylists(q) : {
    data: [
      { id: 51, title: 'my 80s mix', nb_tracks: 20, user: { name: 'jimbo' } },
      { id: 52, title: '80s Rock Anthems', nb_tracks: 80, user: { name: 'Deezer Rock Editor' } },
      { id: 53, title: 'tiny list', nb_tracks: 4, user: { name: 'Deezer Pop Editor' } },
    ],
  }),
  '/chart/0/artists': { data: Array.from({ length: 12 }, (_, i) => ({ ...artist(900 + i, `Chart Artist ${i}`), nb_fan: 1000 * i })) },
  '/playlist/52/tracks': {
    data: [
      track(201, 'Sweet Child O\' Mine', artist(41, "Guns N' Roses", false), 210),
      track(202, 'Livin\' on a Prayer', artist(42, 'Bon Jovi', false), 211, { explicit_lyrics: false }),
      track(203, 'Paradise City', artist(41, "Guns N' Roses", false), 210, { explicit_lyrics: true }),
    ],
  },
  '/track/1': { id: 1, title: 'Bohemian Rhapsody', preview: 'https://cdnt-preview.dzcdn.net/fresh1.mp3', artist: queen, release_date: '1975-10-31', bpm: 71.9, duration: 354, album: { title: 'A Night at the Opera', cover_xl: cover('xl') } },
  '/album/10/tracks': { data: [{ id: 5, title: 'Deep Cut', rank: 10, preview: 'https://cdnt-preview.dzcdn.net/deep.mp3' }, { id: 1, title: 'Bohemian Rhapsody', rank: 999, preview: 'https://cdnt-preview.dzcdn.net/hit.mp3' }] },
  '/artist/412/top': { data: [{ id: 1, title: 'Bohemian Rhapsody', preview: 'https://cdnt-preview.dzcdn.net/top.mp3', artist: queen }] },
  '/album/10': { id: 10, title: 'A Night at the Opera', release_date: '1975-11-21', nb_tracks: 12, duration: 2600, label: 'EMI', genres: { data: [{ name: 'Rock' }] }, fans: 123456, cover_xl: cover('opera') },
};

const itunesFor = (term) =>
  /hurricane/i.test(term)
    ? { results: [
        { trackName: HURRICANE, artistName: 'Scorpions', collectionName: 'Comeblack', releaseDate: '2011-11-04T08:00:00Z' },
        { trackName: HURRICANE, artistName: 'Scorpions', collectionName: 'Love at First Sting', releaseDate: '1984-03-27T08:00:00Z' },
      ] }
    : /still waiting/i.test(term)
    ? { results: [{ trackName: 'Still Waiting', artistName: 'Sum 41', collectionName: 'Does This Look Infected?', releaseDate: '2002-11-26T08:00:00Z', trackExplicitness: 'explicit', trackViewUrl: 'https://music.apple.com/us/album/still-waiting/1440?i=1441&uo=4' }] }
    : ITUNES;

// song.link knows Bohemian Rhapsody (Deezer track 1) only.
const songLink = (page) =>
  page === 'https://www.deezer.com/track/1'
    ? {
        linksByPlatform: {
          spotify: { url: 'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv' },
          appleMusic: { url: 'https://geo.music.apple.com/us/album/_/1440806041?i=1440806768' },
          youtube: { url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ' },
        },
      }
    : { statusCode: 404, code: 'NOT_FOUND' };

const ITUNES = {
  results: [{
    trackName: 'Hey Jude', artistName: 'The Beatles', collectionName: 'Past Masters', releaseDate: '1968-08-26T07:00:00Z',
    artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/Music/aa/source/100x100bb.jpg', primaryGenreName: 'Rock',
    trackExplicitness: 'notExplicit', trackTimeMillis: 431000, previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/heyjude.m4a',
    trackViewUrl: 'https://music.apple.com/us/album/hey-jude/1441?i=1442&uo=4',
  }],
};

before(async () => {
  fake = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const q = url.searchParams.get('q') || url.searchParams.get('term');
    calls.push({ path: url.pathname, q, params: Object.fromEntries(url.searchParams) });
    let body =
      url.pathname === '/search' ? itunesFor(q)
      : url.pathname === '/v1-alpha.1/links' ? songLink(url.searchParams.get('url'))
      : url.pathname === '/recording' ? MUSICBRAINZ[url.searchParams.get('query')] || { recordings: [] }
      : DEEZER[url.pathname];
    if (typeof body === 'function') body = body(q, url.searchParams);
    for (const [re, make] of DYNAMIC) {
      const m = !body && url.pathname.match(re);
      if (m) body = make(Number(m[1]));
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body || { error: { type: 'DataException', message: 'no data', code: 800 } }));
  });
  await new Promise((r) => fake.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${fake.address().port}`;
});

after(() => fake.close());

const music = (extra = {}) =>
  createMusic({ deezerBase: base, itunesBase: base, odesliBase: base, musicbrainzBase: base, musicbrainzGap: 0, retryDelays: [1, 1, 1], deezerBudget: 10_000, ...extra });
const titles = (list) => list.map((m) => m.title);
const keys = (list) => list.map((m) => `${m.title}|${m.artist}`);
const lastCall = (path) => calls.filter((c) => c.path === path).at(-1);

test('song search maps Deezer tracks, merges remasters, and can hide explicit ones', async () => {
  const m = music();
  const { results: all, source } = await m.search('song', 'bohemian');
  assert.equal(source, 'deezer');
  assert.deepEqual(titles(all), ['Bohemian Rhapsody', 'Lose Yourself']);
  const first = all[0];
  assert.equal(first.artist, 'Queen');
  assert.equal(first.album, 'Album 10');
  assert.equal(first.cover, cover(10));
  assert.equal(first.deezerId, 1);
  assert.equal(first.kind, 'song');
  const clean = await m.search('song', 'bohemian', { clean: true });
  assert.ok(!clean.results.some((s) => s.explicit));
  assert.equal(clean.hidden, 1, 'tells the player an explicit song was hidden');
});

test('clean parties keep the clean version even when the explicit one comes first', async () => {
  const { results, hidden } = await music().search('song', 'dirty', { clean: true });
  assert.deepEqual(results.map((s) => [s.title, s.deezerId]), [['Still Waiting', 62]]);
  assert.equal(hidden, 1, 'only the song with no clean version counts as hidden');
});

test('"title - artist" searches find the exact song, even when the title is common', async () => {
  const m = music();
  const { results } = await m.search('song', 'Still Waiting - Sum 41');
  assert.equal(results[0].artist, 'Sum 41');
  assert.equal(results[0].deezerId, 41);
  assert.ok(results.length >= 20, 'still shows plenty of other matches');
  assert.ok(calls.some((c) => c.q === 'track:"Still Waiting" artist:"Sum 41"'));
  assert.ok(calls.some((c) => c.q === 'artist:"Still Waiting" track:"Sum 41"'), 'tries "artist - title" too');
  assert.equal((await m.details('song', 'Still Waiting - Sum 41')).deezerId, 41);
});

test('exact titles come before longer ones, and less common songs still make the list', async () => {
  const { results } = await music().search('song', 'on the loose');
  assert.deepEqual(keys(results).slice(0, 3), ['On the Loose|Niall Horan', 'On the Loose|Saga', 'On the Loose Tonight|Party Crew']);
});

test('Apple fills in when Deezer comes up short, but only with real matches', async () => {
  const m = music();
  const few = await m.search('song', 'on the loose');
  assert.ok(!few.results.some((s) => s.title === 'Hey Jude'), 'unrelated Apple results are dropped');
  assert.ok(calls.some((c) => c.path === '/search' && c.q === 'on the loose'));
});

test('when Deezer refuses, search falls back to iTunes', async () => {
  const m = music();
  const { results, source } = await m.search('song', 'quota');
  assert.equal(source, 'itunes');
  assert.equal(results[0].title, 'Hey Jude');
  assert.equal(results[0].cover, 'https://is1-ssl.mzstatic.com/image/thumb/Music/aa/source/500x500bb.jpg');
  assert.equal(results[0].year, 1968);
  assert.equal(results[0].previewUrl, undefined, 'preview links are fetched fresh, not stored');
});

test('a "slow down" from Deezer is retried instead of giving up', async () => {
  const m = music();
  const { results, source } = await m.search('song', 'flaky');
  assert.equal(source, 'deezer');
  assert.equal(results[0].title, 'Bohemian Rhapsody');
  const status = await m.status();
  assert.ok(status.deezer.retried >= 1);
  assert.equal(status.deezer.now.ok, true);
  assert.equal(status.deezer.now.top, 'Still Waiting for You – Band 0');
  assert.equal(status.itunes.now.top, 'Still Waiting – Sum 41');
});

test('top charts for songs, albums and artists, mixed up a little for each phone', async () => {
  const m = music();
  const songs = await m.browse({ kind: 'song', list: 'top' });
  assert.equal(songs.source, 'deezer');
  assert.equal(songs.results.length, 24);
  assert.equal(songs.more, true);
  assert.ok(titles(songs.results.slice(0, 6)).every((t) => /^Chart Song [0-5]$/.test(t)), 'the biggest hits still come first');
  const next = await m.browse({ kind: 'song', list: 'top', offset: songs.next });
  assert.ok(titles(next.results).includes('Chart Song 29'));
  assert.ok(!next.results.some((s) => titles(songs.results).includes(s.title)), 'no repeats');
  assert.ok(titles((await m.browse({ kind: 'album', list: 'top' })).results).includes('Hot Album 0'));
  assert.ok(titles((await m.browse({ kind: 'artist', list: 'top' })).results).includes('Chart Artist 0'));
  const rock = await m.browse({ kind: 'song', list: 'top', genre: 'Rock' });
  assert.match(rock.results[0].title, /^Rock Chart/, 'genre charts use the genre id');

  const a = await m.browse({ kind: 'song', list: 'top', seed: 'alice' });
  const b = await m.browse({ kind: 'song', list: 'top', seed: 'bob' });
  assert.notDeepEqual(titles(a.results), titles(b.results), 'each phone gets its own order');
  const again = await music().browse({ kind: 'song', list: 'top', seed: 'alice' });
  assert.deepEqual(titles(again.results), titles(a.results), 'the same phone keeps its order');
});

test('new releases come from Deezer editors for albums', async () => {
  const fresh = await music().browse({ kind: 'album', list: 'new' });
  assert.match(fresh.results[0].title, /^Fresh/);
  assert.equal(fresh.results[0].year, 2026);
});

test('decade, genre and vibe filters search matching playlists, preferring Deezer editors', async () => {
  const m = music();
  let from = calls.length;
  const firstSearch = () => calls.slice(from).find((c) => c.path === '/search/playlist').q;
  const out = await m.browse({ kind: 'song', list: 'top', genre: 'Rock', decade: '80s' });
  assert.equal(firstSearch(), '80s rock hits');
  assert.equal(calls.slice(from).find((c) => c.path.startsWith('/playlist/')).path, '/playlist/52/tracks', 'the editor list beats the fan mix');
  assert.deepEqual(titles(out.results).sort(), ["Livin' on a Prayer", 'Paradise City', "Sweet Child O' Mine"]);
  assert.ok(calls.slice(from).filter((c) => c.path === '/search/playlist').length > 3, 'keeps looking for more');

  from = calls.length;
  await m.browse({ kind: 'song', list: 'classics', genre: 'Rap/Hip Hop', vibe: 'party' });
  assert.equal(firstSearch(), 'hip hop party hits classics');

  const clean = await m.browse({ kind: 'song', list: 'top', genre: 'Rock', decade: '80s', clean: '1' });
  assert.ok(!clean.results.some((s) => s.title === 'Paradise City'));

  const albums = await m.browse({ kind: 'album', list: 'top', decade: '80s', genre: 'Rock' });
  assert.equal(albums.results.length, 2, 'one card per album');
  const artists = await m.browse({ kind: 'artist', list: 'top', decade: '80s', genre: 'Rock' });
  assert.deepEqual(titles(artists.results).sort(), ['Bon Jovi', "Guns N' Roses"]);
  assert.equal(artists.results.find((a) => a.title === "Guns N' Roses").cover, cover(210), 'album art stands in for a missing artist photo');
});

test('ideas keep coming: hundreds of songs, no repeats, a different mix for each phone', async () => {
  const m = music();
  const seen = new Set();
  let offset = 0;
  let res;
  for (let i = 0; i < 12; i++) {
    res = await m.browse({ kind: 'song', list: 'classics', genre: 'Pop', seed: 'alice', offset });
    assert.equal(res.results.length, 24);
    for (const k of keys(res.results)) {
      assert.ok(!seen.has(k), `repeat: ${k}`);
      seen.add(k);
    }
    offset = res.next;
  }
  assert.equal(seen.size, 288);
  assert.equal(res.more, true);
  assert.equal([...seen].filter((k) => k.startsWith('Shared Hit 0|')).length, 1, 'a song in many playlists shows once');

  const bob = await m.browse({ kind: 'song', list: 'classics', genre: 'Pop', seed: 'bob' });
  const alice = await m.browse({ kind: 'song', list: 'classics', genre: 'Pop', seed: 'alice' });
  assert.notDeepEqual(keys(bob.results), keys(alice.results));
});

test('artist ideas keep going through related artists', async () => {
  const m = music();
  const seen = new Set();
  let offset = 0;
  for (let i = 0; i < 8; i++) {
    const res = await m.browse({ kind: 'artist', list: 'top', seed: 'x', offset });
    for (const a of res.results) seen.add(a.title);
    assert.equal(res.more, true);
    offset = res.next;
  }
  assert.ok(seen.size >= 150, `only ${seen.size}`);
  assert.ok([...seen].some((t) => t.startsWith('Related')));
});

test('a song picked from a compilation becomes the original: album, cover and year', async () => {
  const m = music();
  const info = await m.lookup('song', { title: 'Last Resort', artist: 'Papa Roach', deezerId: 7001, album: 'The Ultimate Workout Collection: Blood Sweat And Tears', year: 2010 });
  assert.equal(info.found, true);
  assert.equal(info.item.album, 'Infest');
  assert.equal(info.item.cover, cover(7300));
  assert.equal(info.item.year, 2000);
  assert.equal(info.item.deezerId, 7002, 'previews and facts follow the original track');
  assert.equal(info.item.explicit, true, 'keeps the version that was picked');
  assert.deepEqual(info.genres.sort(), ['Alternative', 'Rock']);
  assert.deepEqual(info.years, [2000]);

  const clean = await m.lookup('song', { title: 'Last Resort', artist: 'Papa Roach', deezerId: 7001 }, { clean: true });
  assert.equal(clean.item.deezerId, 7007, 'clean parties get the clean original');
  assert.equal(clean.item.explicit, false);
});

test('the original album and year even when Deezer files the song under a re-recording', async () => {
  const info = await music().lookup('song', { title: HURRICANE, artist: 'Scorpions', deezerId: 8001, album: 'Comeblack', year: 2011 });
  assert.equal(info.item.album, 'Love At First Sting', 'found on page two of their albums, by the name MusicBrainz gives');
  assert.equal(info.item.deezerId, 8003, 'the 1984 recording, from that album’s track list');
  assert.equal(info.item.cover, cover(8102));
  assert.equal(info.item.year, 1984);
  assert.deepEqual(info.years, [1984]);
  assert.ok(info.genres.includes('Rock'));
  assert.equal(checkTheme(info, { decade: '80s' }).ok, true, 'fits an 80s night');
  assert.equal(calls.filter((c) => c.path === '/recording').at(-1).params.fmt, 'json');

  // MusicBrainz down: Apple knows the original album and year too.
  const noMb = await music({ musicbrainzBase: 'http://127.0.0.1:9' }).lookup('song', { title: HURRICANE, artist: 'Scorpions', deezerId: 8001 });
  assert.deepEqual([noMb.item.album, noMb.item.year], ['Love At First Sting', 1984]);
});

test('search shows the version from the artist’s own album over a compilation', async () => {
  const { results } = await music().search('song', 'last resort');
  assert.equal(results.length, 1);
  assert.equal(results[0].album, 'Infest');
});

test('albums become their first edition, artists get their genres and active years', async () => {
  const m = music();
  const album = await m.lookup('album', { title: 'Infest (Deluxe Edition)', artist: 'Papa Roach', deezerId: 7301 });
  assert.equal(album.item.deezerId, 7300);
  assert.equal(album.item.year, 2000);
  const band = await m.lookup('artist', { title: 'Papa Roach', deezerId: 7200 });
  assert.deepEqual(band.genres.sort(), ['Alternative', 'Rock'], 'compilations do not count');
  assert.deepEqual(band.years, [2000, 2004, 2020]);
});

test('typed picks are found first; unknown ones say so', async () => {
  const m = music();
  const typed = await m.lookup('song', { title: 'last resort' });
  assert.equal(typed.item.album, 'Infest');
  const unknown = await m.lookup('song', { title: 'Definitely Not A Song' });
  assert.equal(unknown.found, false);
  assert.equal(unknown.missing, true, 'Deezer answered, it just has no such song');
  const noDetails = await m.lookup('song', { title: 'Mystery Track', deezerId: 123456 });
  assert.deepEqual([noDetails.found, noDetails.missing], [false, false], 'a Deezer song with no details on file is unknown, not missing');
  const offline = createMusic({ deezerBase: 'http://127.0.0.1:9', itunesBase: 'http://127.0.0.1:9', musicbrainzBase: 'http://127.0.0.1:9' });
  const nothing = await offline.lookup('song', { title: 'Definitely Not A Song' });
  assert.equal(nothing.missing, false, "can't tell without a music service");
});

test('theme check: genre (with close relatives) and decade', () => {
  const info = { item: { title: 'Last Resort', kind: 'song' }, genres: ['Rock', 'Alternative'], years: [2000] };
  assert.deepEqual(checkTheme(info, { genre: 'Country' }), { ok: false, message: 'Last Resort is Rock / Alternative, not Country' });
  assert.equal(checkTheme(info, { genre: 'Rock' }).ok, true);
  assert.equal(checkTheme(info, { genre: 'Alternative' }).ok, true);
  assert.equal(checkTheme({ ...info, genres: ['Alternative'] }, { genre: 'Rock' }).ok, true, 'a Rock night takes Alternative');
  assert.equal(checkTheme(info, { genre: 'Metal' }).ok, false);
  assert.deepEqual(checkTheme(info, { decade: '90s' }), { ok: false, message: 'Last Resort is from 2000, not the 90s' });
  assert.equal(checkTheme(info, { decade: '2000s', genre: 'rock' }).ok, true);
  const band = { item: { title: 'Papa Roach', kind: 'artist' }, genres: ['Rock'], years: [2000, 2004] };
  assert.equal(checkTheme(band, { decade: '90s' }).message, "Papa Roach didn't release anything in the 90s");
  assert.equal(checkTheme({ item: { title: 'Mystery' }, genres: [], years: [] }, { genre: 'Rock', decade: '80s' }).ok, true, 'unknown gets the benefit of the doubt');
});

test('previews: a song, an album’s biggest track, an artist’s top track', async () => {
  const m = music();
  assert.equal((await m.preview({ kind: 'song', id: '1' })).url, 'https://cdnt-preview.dzcdn.net/fresh1.mp3');
  assert.equal((await m.preview({ kind: 'album', id: '10' })).url, 'https://cdnt-preview.dzcdn.net/hit.mp3');
  assert.equal((await m.preview({ kind: 'artist', id: '412' })).url, 'https://cdnt-preview.dzcdn.net/top.mp3');
  // Typed in by hand: searched first.
  assert.equal((await m.preview({ kind: 'song', title: 'Bohemian Rhapsody', artist: 'Queen' })).url, 'https://cdnt-preview.dzcdn.net/fresh1.mp3');
});

test('champion facts and listen-on links', async () => {
  const m = music();
  const song = await m.about({ kind: 'song', id: '1', title: 'Bohemian Rhapsody', artist: 'Queen' });
  assert.equal(song.facts.year, 1975);
  assert.equal(song.facts.bpm, 72);
  assert.equal(song.links.deezer, 'https://www.deezer.com/track/1');
  assert.equal(song.links.spotify, 'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv', 'straight to the song via song.link');
  assert.equal(song.links.apple, 'https://geo.music.apple.com/us/album/_/1440806041?i=1440806768', "song.link fills in when Apple's search has no match");
  assert.equal(song.links.youtube, 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ');
  const sum41 = await m.about({ kind: 'song', id: '41', title: 'Still Waiting', artist: 'Sum 41' });
  assert.equal(sum41.links.apple, 'https://music.apple.com/us/album/still-waiting/1440?i=1441&uo=4', 'the exact song on Apple Music');
  assert.equal(sum41.links.spotify, 'https://open.spotify.com/search/Still%20Waiting%20Sum%2041', 'search link when song.link has nothing');
  const album = await m.about({ kind: 'album', id: '10', title: 'A Night at the Opera', artist: 'Queen' });
  assert.equal(album.facts.tracks, 12);
  assert.deepEqual(album.facts.genres, ['Rock']);
  const typed = await m.about({ kind: 'song', title: 'Hey Jude' });
  assert.equal(typed.facts, null);
  assert.match(typed.links.youtube, /Hey%20Jude/);
  assert.equal(typed.links.apple, 'https://music.apple.com/us/album/hey-jude/1441?i=1442&uo=4');
  const other = await m.about({ kind: 'song', title: 'Some Other Song', artist: 'Nobody' });
  assert.equal(other.links.apple, 'https://music.apple.com/us/search?term=Some%20Other%20Song%20Nobody', 'no wrong-song links');
  const fromApple = (await m.search('song', 'quota')).results;
  assert.equal(fromApple[0].title, 'Hey Jude');
  assert.ok(!fromApple.some((r) => 'url' in r), 'store links stay on the server');
});

test('typed-in picks are matched by title, or title plus artist', async () => {
  const m = music();
  assert.equal((await m.details('song', 'bohemian rhapsody')).deezerId, 1);
  assert.equal((await m.details('song', 'queen bohemian rhapsody')).deezerId, 1);
  assert.equal(await m.details('song', 'some other song'), null);
  assert.equal(await m.details('song', 'lose yourself', { clean: true }), null, 'clean parties never pick up the explicit version');
});

test('the built-in list takes over when Deezer is down', async () => {
  const offline = createMusic({ deezerBase: 'http://127.0.0.1:9', itunesBase: 'http://127.0.0.1:9', musicbrainzBase: 'http://127.0.0.1:9' });
  const top = await offline.browse({ kind: 'song', list: 'top' });
  assert.equal(top.source, 'offline');
  assert.ok(titles(top.results.slice(0, 6)).includes('Bohemian Rhapsody'));
  assert.equal(top.more, true);
  const eighties = await offline.browse({ kind: 'song', decade: '80s', vibe: 'party' });
  assert.ok(eighties.results.length > 3);
  assert.ok(eighties.results.every((s) => s.year >= 1980 && s.year <= 1989));
  const clean = await offline.browse({ kind: 'song', genre: 'Rap/Hip Hop', clean: '1' });
  assert.ok(clean.results.every((s) => !s.explicit));
  assert.ok((await offline.browse({ kind: 'artist' })).results.length > 20);
  const thriller = await offline.search('song', 'thriller');
  assert.equal(thriller.results[0].artist, 'Michael Jackson');
  assert.equal(thriller.source, 'offline');
  const meta = await offline.meta();
  assert.equal(meta.source, 'offline');
  assert.ok(meta.genres.includes('Rock'));
  const status = await offline.status();
  assert.equal(status.deezer.now.ok, false);
  assert.equal(status.itunes.now.ok, false);
  assert.ok(status.deezer.lastError);
});

test('who sings it: well-known songs, one per artist, each with a clip and believable wrong answers', async () => {
  const m = music();
  const songs = await m.quizSongs({ count: 8, ask: 'mix', seed: 'party' });
  assert.equal(songs.length, 8);
  assert.equal(new Set(songs.map((s) => s.artist)).size, 8, 'one song per artist');
  assert.ok(!songs.some((s) => s.title === 'Chart Song 3'), 'no clip, no question');
  for (const s of songs) {
    assert.equal(s.decoys.artist.length, 3);
    assert.ok(!s.decoys.artist.includes(s.artist));
    assert.equal(new Set(s.decoys.artist).size, 3);
    assert.equal(s.decoys.song.length, 3);
    assert.ok(!s.decoys.song.includes(s.title));
  }
  const star = songs.find((s) => /^Star /.test(s.artist));
  assert.ok(star.decoys.song.every((t) => t.startsWith('Top ')), 'other songs by the same artist');
  const again = await m.quizSongs({ count: 8, ask: 'artist', seed: 'party' });
  assert.deepEqual(again.map((s) => s.decoys.song), again.map(() => []), 'name-the-artist games skip the extra lookups');
  const other = await m.quizSongs({ count: 8, ask: 'artist', seed: 'another party' });
  assert.notDeepEqual(other.map((s) => s.title), again.map((s) => s.title), 'every game gets its own songs');
});

test('who sings it: with a theme, only songs that really fit it (genre and decade)', async () => {
  const m = music();
  const eighties = await m.quizSongs({ theme: { genre: 'Rock', decade: '80s' }, count: 4, seed: 'rock' });
  assert.deepEqual(eighties.map((s) => s.title), ["Sweet Child O' Mine"], "Livin' on a Prayer is on a pop album, whatever else Bon Jovi made");
  assert.equal(eighties[0].year, 1987, 'the year it first came out, on their own album');
  const noughties = await m.quizSongs({ theme: { genre: 'Rock', decade: '2000s' }, count: 4, seed: 'rock' });
  assert.deepEqual(noughties, [], 'a 1987 song is not 2000s rock');
  const rock = await m.quizSongs({ theme: { genre: 'Rock' }, count: 4, seed: 'rock' });
  assert.deepEqual(rock.map((s) => s.title), ["Sweet Child O' Mine"], "songs whose genre can't be told are left out, not guessed");
  assert.ok(!rock[0].decoys.artist.includes('Bon Jovi'), 'and wrong choices skip artists that clearly are not rock');
  const decade = await m.quizSongs({ theme: { decade: '80s' }, count: 3, seed: 'rock' });
  assert.deepEqual(decade.map((s) => s.title).slice(0, 2).sort(), ["Livin' on a Prayer", "Sweet Child O' Mine"], 'any genre goes when the theme is just a decade');
});

test('who sings it: easy is the biggest hits, hard the deeper cuts', async () => {
  const m = music();
  // The chart runs from Chart Song 0 (the biggest) down to Chart Song 29.
  const index = (s) => Number(s.title.match(/Chart Song (\d+)/)?.[1] ?? 99);
  const easy = await m.quizSongs({ count: 4, level: 'easy', seed: 'lvl' });
  const hard = await m.quizSongs({ count: 4, level: 'hard', seed: 'lvl' });
  assert.equal(easy.length, 4);
  assert.equal(hard.length, 4);
  assert.ok(easy.every((s) => index(s) < 10), `easy: ${easy.map((s) => s.title)}`);
  assert.ok(hard.every((s) => index(s) >= 14), `hard: ${hard.map((s) => s.title)}`);
  assert.ok(calls.some((c) => c.path === '/search/playlist' && /hidden gems|deep cuts|one hit wonders|underrated|forgotten/.test(c.q)), 'hard games dig into deep cuts');
});

test('who sings it: wrong choices are artists like the right one', async () => {
  const songs = await music().quizSongs({ count: 3, level: 'easy', ask: 'artist', seed: 'alike' });
  for (const s of songs) {
    assert.equal(s.decoys.artist.length, 3);
    assert.ok(s.decoys.artist.every((d) => d.startsWith('Related ')), `${s.artist}: ${s.decoys.artist}`);
  }
});

test('quiz suggestions: artists or songs as you type, and the built-in list when Deezer is down', async () => {
  const m = music();
  const artists = await m.suggest('artist', 'que');
  assert.deepEqual(artists.results.map((r) => r.title).slice(0, 2), ['Queen', 'Fan Band'], 'Deezer first');
  assert.equal(artists.results.length, 3, 'only two from Deezer, so Apple adds more');
  assert.equal(artists.results[0].artist, null);
  const songs = await m.suggest('song', 'bohemian');
  assert.deepEqual(songs.results.map((r) => [r.title, r.artist]).slice(0, 2), [['Bohemian Rhapsody', 'Queen'], ['Lose Yourself', 'Eminem']], 'remasters merged into one');
  assert.deepEqual((await m.suggest('artist', 'q')).results, [], 'two letters first');
  const down = createMusic({ deezerBase: 'http://127.0.0.1:9', itunesBase: 'http://127.0.0.1:9', retryDelays: [] });
  const offline = await down.suggest('artist', 'beatl');
  assert.ok(offline.results.some((r) => r.title === 'The Beatles'));
});

test('quiz clips are the song itself or nothing', async () => {
  const m = music();
  assert.match(await m.quizClip({ deezerId: 1, title: 'Bohemian Rhapsody', artist: 'Queen' }), /fresh1\.mp3/);
  assert.match(await m.quizClip({ title: 'Hey Jude', artist: 'The Beatles' }), /heyjude\.m4a/, 'found on Apple by title and artist');
  assert.equal(await m.quizClip({ deezerId: 103, title: 'Chart Song 3', artist: 'Star 3' }), null, 'never a different song that happens to match the search');
});

test('catalog rows are well formed', () => {
  const genres = new Set(['Pop', 'Rap/Hip Hop', 'Rock', 'R&B', 'Dance', 'Alternative', 'Country', 'Latin Music', 'Soul & Funk', 'Metal', 'Reggae', 'Jazz', 'Folk', 'Blues', 'Films/Games']);
  for (const list of [SONG_CATALOG, ALBUM_CATALOG]) {
    const seen = new Set();
    for (const r of list) {
      const key = `${r.title}|${r.artist}`;
      assert.ok(!seen.has(key), `duplicate ${key}`);
      seen.add(key);
      assert.ok(r.year > 1950 && r.year < 2030, key);
      assert.ok(genres.has(r.genre), `${key}: ${r.genre}`);
      assert.match(r.tags, /^[pslcfwre]*$/, key);
    }
  }
  assert.ok(ARTIST_CATALOG.every((a) => a.title && a.kind === 'artist'));
});
