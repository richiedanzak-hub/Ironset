import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createMusic } from '../src/music.js';
import { SONG_CATALOG, ALBUM_CATALOG, ARTIST_CATALOG } from '../src/catalog.js';

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
const nopic = { id: 77, name: 'Fan Band', picture_big: 'https://cdn-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg' };

const DEEZER = {
  '/genre': { data: [{ id: 0, name: 'All' }, { id: 132, name: 'Pop' }, { id: 152, name: 'Rock' }, { id: 116, name: 'Rap/Hip Hop' }] },
  '/search/track': (q) => (q === 'quota' ? { error: { type: 'Exception', message: 'Quota limit exceeded', code: 4 } } : {
    data: [
      track(1, 'Bohemian Rhapsody', queen, 10),
      track(2, 'Bohemian Rhapsody (Remastered 2011)', queen, 11),
      track(3, 'Lose Yourself', eminem, 20, { explicit_lyrics: true }),
    ],
  }),
  '/search/album': () => ({ data: [{ id: 10, title: 'A Night at the Opera', cover_big: cover(10), explicit_lyrics: false, artist: queen, type: 'album' }] }),
  '/search/artist': () => ({ data: [{ ...queen, nb_fan: 5000000 }, nopic] }),
  '/chart/0/tracks': { data: Array.from({ length: 30 }, (_, i) => track(100 + i, `Chart Song ${i}`, artist(500 + i, `Star ${i}`), 600 + i)) },
  '/chart/0/albums': { data: Array.from({ length: 12 }, (_, i) => ({ id: 700 + i, title: `Hot Album ${i}`, cover_big: cover(700 + i), artist: artist(800 + i, `Band ${i}`) })) },
  '/chart/0/artists': { data: Array.from({ length: 12 }, (_, i) => ({ ...artist(900 + i, `Chart Artist ${i}`), nb_fan: 1000 * i })) },
  '/chart/152/tracks': { data: Array.from({ length: 12 }, (_, i) => track(300 + i, `Rock Chart ${i}`, artist(310 + i, `Rocker ${i}`), 320 + i)) },
  '/editorial/0/releases': { data: Array.from({ length: 12 }, (_, i) => ({ id: 1000 + i, title: `Fresh ${i}`, release_date: '2026-09-26', cover_big: cover(1000 + i), artist: artist(1100 + i, `New Act ${i}`) })) },
  '/search/playlist': () => ({
    data: [
      { id: 51, title: 'my 80s mix', nb_tracks: 20, user: { name: 'jimbo' } },
      { id: 52, title: '80s Rock Anthems', nb_tracks: 80, user: { name: 'Deezer Rock Editor' } },
      { id: 53, title: 'tiny list', nb_tracks: 4, user: { name: 'Deezer Pop Editor' } },
    ],
  }),
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

const ITUNES = {
  results: [{
    trackName: 'Hey Jude', artistName: 'The Beatles', collectionName: 'Past Masters', releaseDate: '1968-08-26T07:00:00Z',
    artworkUrl100: 'https://is1-ssl.mzstatic.com/image/thumb/Music/aa/source/100x100bb.jpg', primaryGenreName: 'Rock',
    trackExplicitness: 'notExplicit', trackTimeMillis: 431000, previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/heyjude.m4a',
  }],
};

before(async () => {
  fake = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const q = url.searchParams.get('q') || url.searchParams.get('term');
    calls.push({ path: url.pathname, q, params: Object.fromEntries(url.searchParams) });
    let body = url.pathname === '/search' ? ITUNES : DEEZER[url.pathname];
    if (typeof body === 'function') body = body(q);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body || { error: { type: 'DataException', message: 'no data', code: 800 } }));
  });
  await new Promise((r) => fake.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${fake.address().port}`;
});

after(() => fake.close());

const music = () => createMusic({ deezerBase: base, itunesBase: base, rng: () => 0 });
const lastCall = (path) => calls.filter((c) => c.path === path).at(-1);

test('song search maps Deezer tracks, merges remasters, and can hide explicit ones', async () => {
  const m = music();
  const all = await m.search('song', 'bohemian');
  assert.deepEqual(all.map((s) => s.title), ['Bohemian Rhapsody', 'Lose Yourself']);
  const first = all[0];
  assert.equal(first.artist, 'Queen');
  assert.equal(first.album, 'Album 10');
  assert.equal(first.cover, cover(10));
  assert.equal(first.deezerId, 1);
  assert.equal(first.kind, 'song');
  const clean = await m.search('song', 'bohemian', { clean: true });
  assert.ok(!clean.some((s) => s.explicit));
});

test('album and artist search, with Deezer’s blank artist photos dropped', async () => {
  const m = music();
  const albums = await m.search('album', 'opera');
  assert.equal(albums[0].title, 'A Night at the Opera');
  assert.equal(albums[0].artist, 'Queen');
  const artists = await m.search('artist', 'queen');
  assert.equal(artists[0].title, 'Queen');
  assert.match(artists[0].cover, /a412/);
  assert.equal(artists[1].cover, null, 'placeholder photo becomes our own art');
});

test('when Deezer refuses, search falls back to iTunes', async () => {
  const m = music();
  const results = await m.search('song', 'quota');
  assert.equal(results[0].title, 'Hey Jude');
  assert.equal(results[0].cover, 'https://is1-ssl.mzstatic.com/image/thumb/Music/aa/source/500x500bb.jpg');
  assert.equal(results[0].year, 1968);
  assert.equal(results[0].previewUrl, undefined, 'preview links are fetched fresh, not stored');
});

test('top charts for songs, albums and artists, paged 24 at a time', async () => {
  const m = music();
  const songs = await m.browse({ kind: 'song', list: 'top' });
  assert.equal(songs.source, 'deezer');
  assert.equal(songs.results.length, 24);
  assert.equal(songs.pages, 2);
  assert.equal((await m.browse({ kind: 'song', list: 'top', page: '2' })).results.length, 6);
  assert.equal((await m.browse({ kind: 'album', list: 'top' })).results[0].title, 'Hot Album 0');
  assert.equal((await m.browse({ kind: 'artist', list: 'top' })).results[0].title, 'Chart Artist 0');
  const rock = await m.browse({ kind: 'song', list: 'top', genre: 'Rock' });
  assert.equal(rock.results[0].title, 'Rock Chart 0', 'genre charts use the genre id');
});

test('new releases come from Deezer editors for albums', async () => {
  const fresh = await music().browse({ kind: 'album', list: 'new' });
  assert.equal(fresh.results[0].title, 'Fresh 0');
  assert.equal(fresh.results[0].year, 2026);
});

test('decade, genre and vibe filters find a matching playlist, preferring Deezer editors', async () => {
  const m = music();
  const out = await m.browse({ kind: 'song', list: 'top', genre: 'Rock', decade: '80s' });
  assert.equal(lastCall('/search/playlist').q, '80s rock hits');
  assert.equal(lastCall('/playlist/52/tracks').path, '/playlist/52/tracks', 'the editor list beats the fan mix');
  assert.deepEqual(out.results.map((s) => s.title), ["Sweet Child O' Mine", "Livin' on a Prayer", 'Paradise City']);

  await m.browse({ kind: 'song', list: 'classics', genre: 'Rap/Hip Hop', vibe: 'party' });
  assert.equal(lastCall('/search/playlist').q, 'hip hop party hits classics');

  const clean = await m.browse({ kind: 'song', list: 'top', genre: 'Rock', decade: '80s', clean: '1' });
  assert.ok(!clean.results.some((s) => s.title === 'Paradise City'));

  const albums = await m.browse({ kind: 'album', list: 'top', decade: '80s', genre: 'Rock' });
  assert.equal(albums.results.length, 2, 'one card per album');
  const artists = await m.browse({ kind: 'artist', list: 'top', decade: '80s', genre: 'Rock' });
  assert.deepEqual(artists.results.map((a) => a.title), ["Guns N' Roses", 'Bon Jovi']);
  assert.equal(artists.results[0].cover, cover(210), 'album art stands in for a missing artist photo');
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
  assert.equal(song.links.spotify, 'https://open.spotify.com/search/Bohemian%20Rhapsody%20Queen');
  const album = await m.about({ kind: 'album', id: '10', title: 'A Night at the Opera', artist: 'Queen' });
  assert.equal(album.facts.tracks, 12);
  assert.deepEqual(album.facts.genres, ['Rock']);
  const typed = await m.about({ kind: 'song', title: 'Hey Jude' });
  assert.equal(typed.facts, null);
  assert.match(typed.links.youtube, /Hey%20Jude/);
});

test('typed-in picks are matched by title, or title plus artist', async () => {
  const m = music();
  assert.equal((await m.details('song', 'bohemian rhapsody')).deezerId, 1);
  assert.equal((await m.details('song', 'queen bohemian rhapsody')).deezerId, 1);
  assert.equal(await m.details('song', 'some other song'), null);
  assert.equal(await m.details('song', 'lose yourself', { clean: true }), null, 'clean parties never pick up the explicit version');
});

test('the built-in list takes over when Deezer is down', async () => {
  const offline = createMusic({ deezerBase: 'http://127.0.0.1:9', itunesBase: 'http://127.0.0.1:9', rng: () => 0 });
  const top = await offline.browse({ kind: 'song', list: 'top' });
  assert.equal(top.source, 'offline');
  assert.equal(top.results[0].title, 'Bohemian Rhapsody');
  const eighties = await offline.browse({ kind: 'song', decade: '80s', vibe: 'party' });
  assert.ok(eighties.results.length > 3);
  assert.ok(eighties.results.every((s) => s.year >= 1980 && s.year <= 1989));
  const clean = await offline.browse({ kind: 'song', genre: 'Rap/Hip Hop', clean: '1' });
  assert.ok(clean.results.every((s) => !s.explicit));
  assert.ok((await offline.browse({ kind: 'artist' })).results.length > 20);
  assert.equal((await offline.search('song', 'thriller'))[0].artist, 'Michael Jackson');
  const meta = await offline.meta();
  assert.equal(meta.source, 'offline');
  assert.ok(meta.genres.includes('Rock'));
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
