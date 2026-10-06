import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as game from '../src/game.js';

const T0 = 1_700_000_000_000;

// Deterministic "random": always picks the first option.
const rng = () => 0;

function party(names = ['Mom', 'Dad', 'Kid'], settings = {}) {
  const room = game.createRoom('BCDF', T0);
  const ids = names.map((name) => game.joinRoom(room, { name, avatar: '🍿' }, T0).player.id);
  for (const id of ids) game.connect(room, id, T0);
  if (Object.keys(settings).length) game.act(room, ids[0], { type: 'settings', settings }, T0);
  return { room, ids };
}

const add = (room, pid, title, extra = {}) => game.act(room, pid, { type: 'add', item: { title, ...extra } }, T0, rng);

test('first player to join hosts, names must be unique among people here', () => {
  const { room, ids } = party();
  assert.equal(room.hostId, ids[0]);
  assert.throws(() => game.joinRoom(room, { name: 'mom' }, T0), /already here/);
  assert.throws(() => game.joinRoom(room, { name: '   ' }, T0), /Pick a name/);
});

test('a dropped player can reclaim their seat by name', () => {
  const { room, ids } = party();
  game.disconnect(room, ids[1], T0);
  game.tick(room, T0 + game.PRESENCE_GRACE_MS + 1, rng);
  assert.equal(room.players[ids[1]].online, false);
  const { player, rejoined } = game.joinRoom(room, { name: 'DAD' }, T0 + 20_000);
  assert.equal(rejoined, true);
  assert.equal(player.id, ids[1]);
});

test('only the host can change rules or start', () => {
  const { room, ids } = party();
  assert.throws(() => game.act(room, ids[1], { type: 'start' }, T0), /Only the host/);
  game.act(room, ids[0], { type: 'start' }, T0);
  assert.equal(room.phase, 'submit');
});

test('settings are clamped and min/max stay consistent', () => {
  const s = game.cleanSettings(game.DEFAULT_SETTINGS, { minPerPlayer: 8, maxPerPlayer: 3 });
  assert.equal(s.maxPerPlayer, 3);
  assert.equal(s.minPerPlayer, 3);
  const s2 = game.cleanSettings(game.DEFAULT_SETTINGS, { minPerPlayer: 9 });
  assert.equal(s2.maxPerPlayer, 9);
  const s3 = game.cleanSettings(game.DEFAULT_SETTINGS, { maxPerPlayer: 0, minPerPlayer: 12, reveal: 'nope', submitSeconds: -5 });
  assert.equal(s3.maxPerPlayer, 0);
  assert.equal(s3.minPerPlayer, 12);
  assert.equal(s3.reveal, 'reveal');
  assert.equal(s3.submitSeconds, 0);
});

test('max per person is enforced, and players can remove their own picks', () => {
  const { room, ids } = party(['Mom', 'Dad'], { maxPerPlayer: 2 });
  game.act(room, ids[0], { type: 'start' }, T0);
  add(room, ids[0], 'Jaws');
  const { entryId } = add(room, ids[0], 'Heat');
  assert.throws(() => add(room, ids[0], 'Alien'), /limit/);
  assert.throws(() => game.act(room, ids[1], { type: 'remove', entryId }, T0), /not one of your picks/);
  game.act(room, ids[0], { type: 'remove', entryId }, T0);
  add(room, ids[0], 'Alien');
  assert.deepEqual(game.viewFor(room, ids[0], T0).mine.map((m) => m.title), ['Jaws', 'Alien']);
});

test('minimum picks gate the "I\'m done" button', () => {
  const { room, ids } = party(['Mom', 'Dad'], { minPerPlayer: 2 });
  game.act(room, ids[0], { type: 'start' }, T0);
  add(room, ids[0], 'Jaws');
  assert.throws(() => game.act(room, ids[0], { type: 'ready', ready: true }, T0), /at least 2/);
  add(room, ids[0], 'Heat');
  game.act(room, ids[0], { type: 'ready', ready: true }, T0);
  assert.equal(room.players[ids[0]].ready, true);
  // Dropping below the minimum un-readies you.
  game.act(room, ids[0], { type: 'remove', entryId: room.players && Object.values(room.entries)[0].id }, T0);
  assert.equal(room.players[ids[0]].ready, false);
});

test('duplicates merge and credit both players', () => {
  const { room, ids } = party(['Mom', 'Dad']);
  game.act(room, ids[0], { type: 'start' }, T0);
  add(room, ids[0], 'The Matrix', { year: 1999 });
  const out = add(room, ids[1], 'matrix');
  assert.match(out.notice, /Great minds/);
  assert.equal(Object.keys(room.entries).length, 1);
  assert.deepEqual(Object.values(room.entries)[0].by, [ids[0], ids[1]]);
  assert.throws(() => add(room, ids[1], 'The Matrix'), /already in your picks/);
  // Same title by different artists are different songs...
  add(room, ids[0], 'Hello', { artist: 'Adele', deezerId: 1 });
  add(room, ids[1], 'Hello', { artist: 'Lionel Richie', deezerId: 2 });
  assert.equal(Object.keys(room.entries).length, 3);
  // ...but a remaster or live version of the same song is the same pick.
  const again = add(room, ids[1], 'Bohemian Rhapsody', { artist: 'Queen', deezerId: 10 });
  const live = add(room, ids[0], 'Bohemian Rhapsody - Remastered 2011', { artist: 'Queen', deezerId: 11 });
  assert.equal(live.entryId, again.entryId);
  assert.match(live.notice, /Great minds/);
});

test('others cannot see what is in the hat during submissions', () => {
  const { room, ids } = party(['Mom', 'Dad']);
  game.act(room, ids[0], { type: 'start' }, T0);
  add(room, ids[0], 'Jaws');
  add(room, ids[1], 'Heat');
  const v = game.viewFor(room, ids[1], T0);
  assert.equal(v.hatCount, 2);
  assert.deepEqual(v.mine.map((m) => m.title), ['Heat']);
  assert.equal(v.entries, undefined);
  assert.equal(v.players.find((p) => p.id === ids[0]).count, 1);
});

test('submissions end when everyone here is done', () => {
  const { room, ids } = party(['Mom', 'Dad', 'Kid']);
  game.act(room, ids[0], { type: 'start' }, T0);
  add(room, ids[0], 'Jaws');
  add(room, ids[1], 'Heat');
  game.act(room, ids[0], { type: 'ready', ready: true }, T0);
  game.act(room, ids[1], { type: 'ready', ready: true }, T0);
  assert.equal(room.phase, 'submit', 'Kid is still adding');
  // Kid's phone dies. After the grace period they no longer hold things up.
  game.disconnect(room, ids[2], T0);
  game.tick(room, T0 + 5_000, rng);
  assert.equal(room.phase, 'submit');
  game.tick(room, T0 + game.PRESENCE_GRACE_MS + 1, rng);
  assert.equal(room.phase, 'battle');
});

test('the submission timer ends the round, but never with fewer than 2 picks', () => {
  const { room, ids } = party(['Mom', 'Dad'], { submitSeconds: 60 });
  game.act(room, ids[0], { type: 'start' }, T0);
  assert.equal(room.submit.endsAt, T0 + 60_000);
  add(room, ids[0], 'Jaws');
  game.tick(room, T0 + 61_000, rng);
  assert.equal(room.phase, 'submit');
  assert.equal(room.submit.endsAt, null);
  add(room, ids[1], 'Heat');
  game.act(room, ids[0], { type: 'extend', seconds: 30 }, T0 + 62_000);
  game.tick(room, T0 + 93_000, rng);
  assert.equal(room.phase, 'battle');
});

test('host can end submissions early', () => {
  const { room, ids } = party(['Mom', 'Dad']);
  game.act(room, ids[0], { type: 'start' }, T0);
  add(room, ids[0], 'Jaws');
  assert.throws(() => game.act(room, ids[0], { type: 'endSubmit' }, T0), /at least 2/);
  add(room, ids[0], 'Heat');
  assert.throws(() => game.act(room, ids[1], { type: 'endSubmit' }, T0), /Only the host/);
  game.act(room, ids[0], { type: 'endSubmit' }, T0, rng);
  assert.equal(room.phase, 'battle');
});

// King of the hill without the points game, unless a test says otherwise.
function toBattle(titles, settings = {}) {
  const { room, ids } = party(['Mom', 'Dad', 'Kid'], { maxPerPlayer: 0, format: 'classic', scoring: false, ...settings });
  game.act(room, ids[0], { type: 'start' }, T0);
  titles.forEach((t, i) => add(room, ids[i % ids.length], t));
  game.act(room, ids[0], { type: 'endSubmit' }, T0, rng);
  return { room, ids };
}

const vote = (room, pid, entryId) => game.act(room, pid, { type: 'vote', round: room.battle.round, entryId }, T0, rng);
const next = (room, pid) => game.act(room, pid, { type: 'next', round: room.battle.round }, T0, rng);

test('king of the hill: winner stays on until the hat is empty', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D']);
  const b = room.battle;
  assert.equal(b.total, 3);
  const order = [...b.order];

  // Round 1: 2 votes for the challenger.
  vote(room, ids[0], b.challenger);
  vote(room, ids[1], b.challenger);
  assert.equal(b.stage, 'voting');
  vote(room, ids[2], b.fighters[0]);
  assert.equal(b.stage, 'result');
  assert.equal(b.result.winner, order[1]);
  assert.equal(b.result.method, 'votes');

  // A stale "next" (wrong round) is ignored; the right one advances.
  game.act(room, ids[2], { type: 'next', round: 99 }, T0, rng);
  assert.equal(b.round, 1);
  next(room, ids[2]);
  assert.equal(b.round, 2);
  assert.equal(b.champ, order[1]);
  assert.equal(b.challenger, order[2]);

  for (let r = 2; r <= 3; r++) {
    for (const id of ids) vote(room, id, b.champ);
    assert.equal(b.result.winner, order[1]);
    next(room, ids[0]);
  }
  assert.equal(room.phase, 'final');
  assert.equal(room.final.winner, order[1]);
  assert.equal(b.wins[order[1]], 3);
  assert.equal(b.history.length, 3);
});

test('votes can be changed until everyone has voted, and old rounds are closed', () => {
  const { room, ids } = toBattle(['A', 'B', 'C']);
  const b = room.battle;
  vote(room, ids[0], b.fighters[0]);
  vote(room, ids[0], b.challenger);
  assert.equal(b.votes[ids[0]], b.challenger);
  assert.throws(() => game.act(room, ids[1], { type: 'vote', round: 5, entryId: b.fighters[0] }, T0), /closed/);
  assert.throws(() => game.act(room, ids[1], { type: 'vote', round: 1, entryId: 'nope' }, T0), /one of the choices/);
});

test('ties: coin flip by default, or the reigning champ keeps the crown', () => {
  const coin = toBattle(['A', 'B', 'C']).room;
  const cb = coin.battle;
  game.act(coin, coin.hostId, { type: 'close', round: 1 }, T0, () => 0.9);
  assert.equal(cb.result.method, 'coin');
  assert.equal(cb.result.winner, cb.challenger);

  const { room, ids } = toBattle(['A', 'B', 'C'], { ties: 'champ' });
  const b = room.battle;
  // Round 1 has no champ yet, so it still flips a coin.
  game.act(room, ids[0], { type: 'close', round: 1 }, T0, () => 0.9);
  assert.equal(b.result.method, 'coin');
  next(room, ids[0]);
  vote(room, ids[0], b.champ);
  vote(room, ids[1], b.challenger);
  game.act(room, ids[0], { type: 'close', round: 2 }, T0, rng);
  assert.equal(b.result.method, 'champ');
  assert.equal(b.result.winner, b.champ);
});

test('ties: "keep" puts both through and the next pick makes it a 3-way', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D', 'E'], { ties: 'keep' });
  const b = room.battle;
  const [a, c] = b.fighters;
  vote(room, ids[0], a);
  vote(room, ids[1], c);
  game.act(room, ids[0], { type: 'close', round: 1 }, T0, rng);
  assert.equal(b.result.method, 'keep');
  assert.equal(b.result.winner, null);
  assert.deepEqual(b.result.survivors, [a, c]);
  assert.deepEqual(b.result.losers, []);
  assert.equal(b.result.last, false);
  assert.equal(b.wins[a], undefined, 'a tie is not a win');

  next(room, ids[0]);
  assert.equal(b.round, 2);
  assert.equal(b.fighters.length, 3);
  const third = b.fighters[2];
  assert.deepEqual(b.fighters, [a, c, third]);
  assert.equal(b.challenger, third);
  const v = game.viewFor(room, ids[2], T0);
  assert.deepEqual(v.battle.fighters, [a, c, third]);
  assert.ok(v.entries[third]);

  // Most votes wins a 3-way outright; everyone else is out.
  vote(room, ids[0], third);
  vote(room, ids[1], third);
  vote(room, ids[2], a);
  assert.equal(b.result.method, 'votes');
  assert.equal(b.result.winner, third);
  assert.deepEqual([...b.result.losers].sort(), [a, c].sort());
  assert.equal(b.wins[third], 1);

  // ...and it's back to 1v1 with the winner as champ.
  next(room, ids[0]);
  assert.deepEqual(b.fighters, [third, b.order[3]]);
  assert.equal(b.champ, third);
});

test('ties: "keep" can grow to a 4-way, then a random draw settles it', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D', 'E', 'F'], { ties: 'keep' });
  const b = room.battle;
  const close = () => game.act(room, ids[0], { type: 'close', round: b.round }, T0, rng);
  close(); // 0-0
  next(room, ids[0]);
  assert.equal(b.fighters.length, 3);
  close(); // 0-0-0: all three stay
  assert.equal(b.result.method, 'keep');
  assert.equal(b.result.survivors.length, 3);
  next(room, ids[0]);
  assert.equal(b.fighters.length, game.MAX_FIGHTERS);
  const four = [...b.fighters];
  close(); // a 4-way can't grow any more
  assert.equal(b.result.method, 'coin');
  assert.equal(b.result.winner, four[0]);
  assert.equal(b.result.tied.length, 4);
  assert.equal(b.result.losers.length, 3);
  // Every round still draws exactly one movie, so the round count holds.
  assert.equal(b.round, 3);
  assert.equal(b.next, 4);
  assert.equal(b.total, 5);
});

test('ties: "keep" with an empty hat falls back to a coin flip', () => {
  const { room, ids } = toBattle(['A', 'B'], { ties: 'keep' });
  game.act(room, ids[0], { type: 'close', round: 1 }, T0, rng);
  assert.equal(room.battle.result.method, 'coin');
  assert.equal(room.battle.result.last, true);
  next(room, ids[0]);
  assert.equal(room.phase, 'final');
});

test('ties: "keep" drops the champ if it misses a 3-way tie', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D', 'E', 'F'], { ties: 'keep' });
  const b = room.battle;
  const [a] = b.fighters;
  for (const id of ids) vote(room, id, a);
  next(room, ids[0]);
  assert.equal(b.champ, a);
  const c = b.challenger;
  vote(room, ids[0], a);
  vote(room, ids[1], c);
  game.act(room, ids[0], { type: 'close', round: 2 }, T0, rng);
  next(room, ids[0]);
  assert.equal(b.champ, a, 'still champ after a tie it was part of');
  const d = b.challenger;
  vote(room, ids[0], c);
  vote(room, ids[1], d);
  game.act(room, ids[0], { type: 'close', round: 3 }, T0, rng);
  assert.deepEqual(b.result.survivors, [c, d]);
  assert.deepEqual(b.result.losers, [a]);
  next(room, ids[0]);
  assert.equal(b.champ, null);
  assert.equal(b.fighters.length, 3);
});

test('vote timer closes the vote without waiting on stragglers', () => {
  const { room, ids } = toBattle(['A', 'B'], { voteSeconds: 20 });
  const b = room.battle;
  vote(room, ids[0], b.fighters[0]);
  game.tick(room, T0 + 10_000, rng);
  assert.equal(b.stage, 'voting');
  game.tick(room, T0 + 21_000, rng);
  assert.equal(b.stage, 'result');
  assert.equal(b.result.winner, b.fighters[0]);
});

test('a player who leaves mid-vote does not block the round', () => {
  const { room, ids } = toBattle(['A', 'B', 'C']);
  const b = room.battle;
  vote(room, ids[0], b.fighters[0]);
  vote(room, ids[1], b.fighters[0]);
  game.act(room, ids[2], { type: 'leave' }, T0, rng);
  assert.equal(b.stage, 'result');
  assert.equal(room.players[ids[2]], undefined);
});

test('the host role moves on if the host disappears', () => {
  const { room, ids } = party();
  game.disconnect(room, ids[0], T0);
  game.tick(room, T0 + game.PRESENCE_GRACE_MS + 1, rng);
  assert.equal(room.hostId, ids[0]);
  game.tick(room, T0 + game.HOST_HANDOFF_MS + 1, rng);
  assert.equal(room.hostId, ids[1]);
});

test('kicking a player during submissions removes their picks', () => {
  const { room, ids } = party(['Mom', 'Dad']);
  game.act(room, ids[0], { type: 'start' }, T0);
  add(room, ids[1], 'Jaws');
  add(room, ids[0], 'Jaws');
  add(room, ids[1], 'Heat');
  game.act(room, ids[0], { type: 'kick', playerId: ids[1] }, T0, rng);
  assert.deepEqual(Object.values(room.entries).map((e) => e.title), ['Jaws']);
  assert.throws(() => game.act(room, ids[1], { type: 'ready', ready: true }, T0), /not in this party/);
});

test('submitters: hidden, revealed after each vote, or shown while voting', () => {
  const byOf = (room, pid, id) => game.viewFor(room, pid, T0).entries[id].by;

  const hidden = toBattle(['A', 'B', 'C'], { reveal: 'hidden' });
  const hb = hidden.room.battle;
  assert.equal(byOf(hidden.room, hidden.ids[0], hb.fighters[0]), null);
  game.act(hidden.room, hidden.ids[0], { type: 'close', round: 1 }, T0, rng);
  assert.equal(byOf(hidden.room, hidden.ids[0], hb.fighters[0]), null);
  const owner = hidden.room.entries[hb.order[0]].by[0];
  assert.equal(game.viewFor(hidden.room, owner, T0).entries[hb.order[0]].mine, true);

  const reveal = toBattle(['A', 'B', 'C'], { reveal: 'reveal' });
  const rb = reveal.room.battle;
  assert.equal(byOf(reveal.room, reveal.ids[1], rb.challenger), null);
  game.act(reveal.room, reveal.ids[0], { type: 'close', round: 1 }, T0, rng);
  const pickedBy = reveal.room.players[reveal.room.entries[rb.challenger].by[0]].name;
  assert.equal(byOf(reveal.room, reveal.ids[1], rb.challenger)[0].name, pickedBy);

  const open = toBattle(['A', 'B', 'C'], { reveal: 'open' });
  const ob = open.room.battle;
  assert.ok(byOf(open.room, open.ids[1], ob.challenger)[0].name);
});

test('battle views only include picks already drawn from the hat', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D', 'E']);
  const v = game.viewFor(room, ids[1], T0);
  assert.equal(Object.keys(v.entries).length, 2);
  assert.equal(v.battle.left, 3);
  assert.equal(v.battle.myVote, null);
  vote(room, ids[1], room.battle.fighters[0]);
  const v2 = game.viewFor(room, ids[0], T0);
  assert.equal(v2.players.find((p) => p.id === ids[1]).voted, true);
  assert.equal(v2.battle.myVote, null, "can't see other people's votes");
});

test('final view ranks the pickers by matchups their picks won', () => {
  const { room, ids } = toBattle(['A', 'B', 'C']);
  const b = room.battle;
  while (room.phase === 'battle') {
    for (const id of ids) vote(room, id, b.challenger);
    next(room, ids[0]);
  }
  const v = game.viewFor(room, ids[0], T0);
  assert.equal(v.phase, 'final');
  const winner = room.entries[v.final.winner];
  assert.equal(v.final.pickers[0].id, winner.by[0]);
  assert.equal(v.final.pickers[0].champ, true);
});

test('rematch reshuffles the same hat; play again clears it', () => {
  const { room, ids } = toBattle(['A', 'B']);
  game.act(room, ids[0], { type: 'close', round: 1 }, T0, rng);
  next(room, ids[0]);
  assert.equal(room.phase, 'final');
  game.act(room, ids[0], { type: 'rematch' }, T0, rng);
  assert.equal(room.phase, 'battle');
  assert.equal(room.battle.round, 1);
  game.act(room, ids[0], { type: 'again' }, T0, rng);
  assert.equal(room.phase, 'lobby');
  assert.equal(Object.keys(room.entries).length, 0);
});

test('details typed-in titles get filled in, merging with a matching pick', () => {
  const { room, ids } = party(['Mom', 'Dad']);
  game.act(room, ids[0], { type: 'start' }, T0);
  const typed = add(room, ids[0], 'thriller');
  assert.equal(typed.needsDetails, true);
  add(room, ids[1], 'Thriller', { artist: 'Michael Jackson', deezerId: 1109731 });
  // "thriller" matched by title already, so it merged at add time.
  assert.equal(Object.keys(room.entries).length, 1);

  const other = add(room, ids[0], 'hey jude');
  const cover = 'https://cdn-images.dzcdn.net/images/cover/abc123/500x500-000000-80-0-0.jpg';
  game.applyDetails(room, other.entryId, { title: 'Hey Jude', artist: 'The Beatles', year: 1968, deezerId: 3135553, cover }, T0);
  const jude = room.entries[other.entryId];
  assert.equal(jude.title, 'Hey Jude');
  assert.equal(jude.artist, 'The Beatles');
  assert.equal(jude.cover, cover);
  assert.equal(jude.kind, 'song');
});

test('item input is sanitised', () => {
  const m = game.cleanItem({ title: '  Hey Jude\n\n', year: 1968.5, cover: 'javascript:alert(1)', deezerId: '5', explicit: 'yes', genres: ['Rock', 7], duration: -3 });
  assert.equal(m.title, 'Hey Jude');
  assert.equal(m.year, null);
  assert.equal(m.cover, null);
  assert.equal(m.deezerId, null);
  assert.equal(m.explicit, false);
  assert.equal(m.duration, null);
  assert.deepEqual(m.genres, ['Rock']);
  assert.throws(() => game.cleanItem({ title: '' }), /Type a name/);
  const dz = 'https://e-cdns-images.dzcdn.net/images/cover/1/250x250.jpg';
  assert.equal(game.cleanItem({ title: 'x', cover: dz }).cover, dz);
  assert.equal(game.songKey('Old Town Road (feat. Billy Ray Cyrus) [Remix]'), game.songKey('Old Town Road'));
});

test('clean-only parties turn away explicit picks', () => {
  const { room, ids } = party(['Mom', 'Kid'], { clean: true });
  game.act(room, ids[0], { type: 'start' }, T0);
  assert.throws(() => add(room, ids[1], 'Bad Song', { explicit: true }), /Clean picks only/);
  add(room, ids[1], 'Good Song', { explicit: false });
  assert.equal(Object.keys(room.entries).length, 1);
});

test('songs, albums or artists is picked in the lobby and locked after', () => {
  const { room, ids } = party(['Mom', 'Dad'], { kind: 'album' });
  assert.equal(room.settings.kind, 'album');
  game.act(room, ids[0], { type: 'settings', settings: { kind: 'nope' } }, T0);
  assert.equal(room.settings.kind, 'album');
  game.act(room, ids[0], { type: 'start' }, T0);
  game.act(room, ids[0], { type: 'settings', settings: { kind: 'artist', clean: true } }, T0);
  assert.equal(room.settings.kind, 'album', "can't switch mid-game");
  assert.equal(room.settings.clean, true, 'other rules can still change');
  add(room, ids[0], 'Rumours', { artist: 'Fleetwood Mac' });
  assert.equal(Object.values(room.entries)[0].kind, 'album');
});

test('artists are matched by name alone', () => {
  const { room, ids } = party(['Mom', 'Dad'], { kind: 'artist' });
  game.act(room, ids[0], { type: 'start' }, T0);
  add(room, ids[0], 'The Beatles', { deezerId: 1 });
  const out = add(room, ids[1], 'beatles');
  assert.match(out.notice, /Great minds/);
  assert.equal(Object.keys(room.entries).length, 1);
});

const everyone = (room, ids, entryId) => ids.forEach((pid) => vote(room, pid, entryId));

test('champions round: every pick that won a matchup battles again at the end', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D', 'E'], { champions: true });
  const b = room.battle;
  const order = [...b.order];
  everyone(room, ids, b.challenger); // order[1] wins
  next(room, ids[0]);
  everyone(room, ids, b.challenger); // order[2] takes over
  next(room, ids[0]);
  everyone(room, ids, b.champ);
  next(room, ids[0]);
  everyone(room, ids, b.champ); // the hat is empty now
  assert.equal(b.result.last, false);
  assert.equal(b.result.toChampions, 2);

  next(room, ids[0]);
  assert.equal(room.phase, 'battle');
  assert.equal(b.round, 5);
  assert.equal(b.total, 5, 'one more matchup for two champions');
  assert.deepEqual([...b.fighters].sort(), [order[1], order[2]].sort());
  assert.equal(b.champ, null, 'everyone starts even');
  const view = game.viewFor(room, ids[0], T0);
  assert.deepEqual(view.battle.champions, { from: 5, before: order[2], ids: [order[2], order[1]] });
  assert.equal(view.battle.left, 0);
  assert.equal(Object.keys(view.entries).length, 5);

  everyone(room, ids, order[1]);
  assert.equal(b.result.last, true);
  assert.equal(b.result.toChampions, 0, 'only one champions round');
  assert.equal(b.history.at(-1).champions, true);
  assert.equal(b.history[0].champions, false);
  next(room, ids[0]);
  assert.equal(room.phase, 'final');
  assert.equal(room.final.winner, order[1]);
  assert.equal(b.wins[order[1]], 2);
  assert.equal(game.viewFor(room, ids[0], T0).final.at, T0, 'when it ended, for the saved recap');
});

test('champions round: a bigger field plays king of the hill too, and ties still work', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D', 'E', 'F'], { champions: true, ties: 'keep' });
  const b = room.battle;
  // The challenger wins every time, so five picks each win once.
  for (let r = 1; r <= 5; r++) {
    everyone(room, ids, b.challenger);
    next(room, ids[0]);
  }
  assert.equal(b.champions.ids.length, 5);
  assert.equal(b.total, 9);
  // A tie keeps both and draws the next champion in.
  vote(room, ids[0], b.fighters[0]);
  vote(room, ids[1], b.fighters[1]);
  game.act(room, ids[0], { type: 'close', round: b.round }, T0, rng);
  assert.equal(b.result.method, 'keep');
  next(room, ids[0]);
  assert.equal(b.fighters.length, 3);
  assert.equal(game.viewFor(room, ids[0], T0).battle.left, 2);
});

test('champions round is skipped when one pick won everything', () => {
  const { room, ids } = toBattle(['A', 'B', 'C'], { champions: true });
  const b = room.battle;
  everyone(room, ids, b.fighters[0]);
  next(room, ids[0]);
  everyone(room, ids, b.champ);
  assert.equal(b.result.last, true);
  assert.equal(b.result.toChampions, 0);
  next(room, ids[0]);
  assert.equal(room.phase, 'final');
});

test('the host can set a theme for the night', () => {
  const { room, ids } = party();
  const set = (pid, theme) => game.act(room, pid, { type: 'settings', settings: { theme } }, T0);
  set(ids[0], { genre: 'Rock', decade: '90s', vibe: 'nope', name: '  Garage   night ' });
  assert.deepEqual(room.settings.theme, { name: 'Garage night', genre: 'Rock', decade: '90s', vibe: null });
  assert.equal(game.viewFor(room, ids[1], T0).settings.theme.genre, 'Rock');
  assert.throws(() => set(ids[1], { genre: 'Pop' }), /Only the host/);
  set(ids[0], { decade: '1890s' });
  assert.equal(room.settings.theme, null, 'nothing valid left means no theme');
  game.act(room, ids[0], { type: 'start' }, T0);
  set(ids[0], { vibe: 'roadtrip' });
  assert.equal(room.settings.theme.vibe, 'roadtrip', 'can still change while the hat is open');
});

test('a pick can be switched to its original release', () => {
  const { room, ids } = party(['Mom', 'Dad']);
  game.act(room, ids[0], { type: 'start' }, T0);
  const art = (id) => `https://cdn-images.dzcdn.net/images/cover/${id}/500x500-000000-80-0-0.jpg`;
  const { entryId } = add(room, ids[0], 'Last Resort', { artist: 'Papa Roach', album: 'Workout Hits', year: 2010, deezerId: 7001, cover: art('workout') });
  game.applyDetails(room, entryId, { title: 'Last Resort', artist: 'Papa Roach', album: 'Infest', year: 2000, deezerId: 7002, cover: art('infest'), explicit: true }, T0, { replace: true });
  const e = room.entries[entryId];
  assert.deepEqual([e.album, e.year, e.deezerId, e.cover, e.explicit], ['Infest', 2000, 7002, art('infest'), true]);
  // Without `replace`, details only fill gaps.
  game.applyDetails(room, entryId, { title: 'Last Resort', album: 'Something Else', year: 1999 }, T0);
  assert.equal(room.entries[entryId].album, 'Infest');
});

test('movie nights: a room can start as one, and duplicates match by TMDB id or title and year', () => {
  assert.equal(game.createRoom('BCDF', T0, { kind: 'movie' }).settings.kind, 'movie');
  assert.equal(game.createRoom('BCDF', T0, { kind: 'nope' }).settings.kind, 'song');
  const { room, ids } = party(['Mom', 'Dad'], { kind: 'movie', maxPerPlayer: 0 });
  game.act(room, ids[0], { type: 'start' }, T0);
  const poster = 'https://image.tmdb.org/t/p/w342/jaws.jpg';
  const jaws = add(room, ids[0], 'Jaws', { year: 1975, tmdbId: 578, cover: poster, rating: 7.66, runtime: 124, overview: 'Shark.' });
  assert.match(add(room, ids[1], 'JAWS', { year: 1975 }).notice, /Great minds/);
  add(room, ids[1], 'Jaws', { year: 2019 }); // a different movie with the same name
  assert.equal(Object.keys(room.entries).length, 2);
  const e = room.entries[jaws.entryId];
  assert.deepEqual([e.kind, e.cover, e.rating, e.runtime, e.overview], ['movie', poster, 7.7, 124, 'Shark.']);
  assert.equal(game.cleanItem({ title: 'X', cover: 'https://evil.example/x.jpg' }).cover, null);
});

test('switching between movies and music clears a theme that no longer fits', () => {
  const { room, ids } = party(['Mom'], { kind: 'movie' });
  const set = (settings) => game.act(room, ids[0], { type: 'settings', settings }, T0);
  set({ theme: { genre: 'Horror' } });
  set({ kind: 'song' });
  assert.equal(room.settings.theme, null, 'no Horror theme for music');
  set({ theme: { genre: 'Rock' } });
  set({ kind: 'album' });
  assert.equal(room.settings.theme.genre, 'Rock', 'songs to albums keeps it');
  set({ kind: 'movie', theme: { genre: 'Comedy' } });
  assert.equal(room.settings.theme.genre, 'Comedy');
});

// ---------------------------------------------------------------- bracket, points

test('bracket: picks pair off and the winners move on until one is left', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D'], { format: 'bracket' });
  const b = room.battle;
  assert.equal(b.total, 3);
  assert.deepEqual(b.bracket.rounds.map((r) => r.length), [4, 2, 1]);
  const first = [...b.fighters];
  assert.deepEqual(first, b.bracket.rounds[0].slice(0, 2));
  everyone(room, ids, first[0]);
  assert.equal(b.result.last, false);
  next(room, ids[0]);
  const second = [...b.fighters];
  assert.deepEqual(second, b.bracket.rounds[0].slice(2, 4), 'every pick plays in round 1');
  everyone(room, ids, second[1]);
  next(room, ids[0]);
  assert.deepEqual(b.fighters, [first[0], second[1]], 'the winners meet in the final');
  assert.equal(b.champ, null);
  everyone(room, ids, second[1]);
  assert.equal(b.result.last, true);
  next(room, ids[0]);
  assert.equal(room.phase, 'final');
  assert.equal(room.final.winner, second[1]);
  assert.deepEqual(b.bracket.rounds[2], [second[1]]);
  assert.equal(Object.keys(game.viewFor(room, ids[0], T0).entries).length, 4, 'the whole bracket is shown');
});

test('bracket: odd numbers get byes, ties are a coin flip, and there is no champions round', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D', 'E'], { format: 'bracket', ties: 'keep', champions: true });
  const b = room.battle;
  assert.equal(b.bracket.size, 8);
  assert.equal(b.bracket.rounds[0].filter((x) => x === null).length, 3);
  assert.equal(b.bracket.rounds[1].filter(Boolean).length, 3, 'byes go straight to round 2');
  let matchups = 0;
  while (room.phase === 'battle') {
    vote(room, ids[0], b.fighters[0]);
    vote(room, ids[1], b.fighters[1]);
    game.act(room, ids[0], { type: 'close', round: b.round }, T0, rng);
    assert.equal(b.result.method, 'coin', 'no 3-way showdowns in a bracket');
    assert.equal(b.fighters.length, 2);
    matchups += 1;
    next(room, ids[0]);
  }
  assert.equal(matchups, 4);
  assert.equal(b.champions, null);
  assert.equal(new Set(b.history.flatMap((h) => h.fighters)).size, 5, 'every pick played');
});

test('bracket: round 1 never pits two picks from the same person when it can be avoided', () => {
  for (let seed = 1; seed <= 40; seed++) {
    let x = seed;
    const seeded = () => ((x = (x * 16807) % 2147483647) / 2147483647);
    const { room, ids } = party(['Mom', 'Dad', 'Kid'], { maxPerPlayer: 0, format: 'bracket', scoring: false });
    game.act(room, ids[0], { type: 'start' }, T0);
    // Mom brings 3, Dad 2, Kid 1: 6 picks, so 2 byes and 2 real matchups.
    ['A', 'B', 'C'].forEach((t) => add(room, ids[0], t));
    ['D', 'E'].forEach((t) => add(room, ids[1], t));
    add(room, ids[2], 'F');
    game.act(room, ids[0], { type: 'endSubmit' }, T0, seeded);
    const first = room.battle.bracket.rounds[0];
    for (let k = 0; k < first.length / 2; k++) {
      const [a, b] = [first[2 * k], first[2 * k + 1]];
      if (a && b) assert.notDeepEqual(room.entries[a].by, room.entries[b].by, `seed ${seed}: ${room.entries[a].title} vs ${room.entries[b].title}`);
    }
    assert.equal(new Set(first.filter(Boolean)).size, 6, 'every pick is still in the bracket');
  }
});

test('points game: guess who picked it, score when your picks win, and a bonus for the champion', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D'], { format: 'bracket', scoring: true, reveal: 'open' });
  const b = room.battle;
  const owner = (id) => room.entries[id].by[0];
  const [x, y] = b.fighters;
  assert.equal(game.viewFor(room, ids[0], T0).entries[x].by, null, 'pickers stay secret while guessing');
  for (const pid of ids) vote(room, pid, x);
  assert.equal(b.stage, 'voting', 'not done until the guesses are in');
  const someoneElse = (pid) => ids.find((p) => p !== pid);
  assert.throws(() => game.act(room, owner(x), { type: 'guess', round: b.round, entryId: x, playerId: someoneElse(owner(x)) }, T0), /your pick/);
  assert.throws(() => game.act(room, ids[0], { type: 'guess', round: b.round, entryId: x, playerId: ids[0] }, T0), /someone else/);
  // Everyone guesses x right and y wrong.
  for (const pid of ids) {
    for (const id of [x, y]) {
      if (owner(id) === pid) continue;
      const guess = id === x ? owner(x) : ids.find((p) => p !== pid && p !== owner(y));
      game.act(room, pid, { type: 'guess', round: b.round, entryId: id, playerId: guess }, T0, rng);
    }
  }
  assert.equal(b.stage, 'result');
  for (const pid of ids) {
    const want = { guess: owner(x) === pid ? 0 : 1, win: owner(x) === pid ? 2 : 0 };
    assert.equal(b.points[pid]?.guess || 0, want.guess);
    assert.equal(b.points[pid]?.win || 0, want.win);
  }
  assert.deepEqual(b.result.guessed[x].sort(), ids.filter((p) => p !== owner(x)).sort());
  assert.deepEqual(b.result.guessed[y], []);
  assert.ok(game.viewFor(room, ids[0], T0).entries[x].by.length, 'revealed after the matchup');

  // Finish: the same pick wins everything.
  while (room.phase === 'battle') {
    if (b.stage === 'result') next(room, ids[0]);
    if (room.phase !== 'battle') break;
    const pick = b.fighters.includes(x) ? x : b.fighters[0];
    if (b.fighters.includes(x)) {
      assert.throws(() => game.act(room, ids.find((p) => p !== owner(x)), { type: 'guess', round: b.round, entryId: x, playerId: owner(x) }, T0), /already know/);
    }
    for (const pid of ids) {
      vote(room, pid, pick);
      for (const id of b.fighters) {
        if (b.stage === 'voting' && !b.seen.includes(id) && !room.entries[id].by.includes(pid)) {
          game.act(room, pid, { type: 'guess', round: b.round, entryId: id, playerId: ids.find((p) => p !== pid) }, T0, rng);
        }
      }
    }
  }
  assert.equal(room.final.winner, x);
  assert.equal(b.points[owner(x)].win, 4, 'two wins');
  assert.equal(b.points[owner(x)].champ, 3);
  const scores = game.viewFor(room, ids[0], T0).final.scores;
  assert.equal(scores.length, 3);
  assert.equal(scores[0].total, Math.max(...scores.map((r) => r.total)));
  assert.ok(scores.every((r) => r.total === r.guess + r.win + r.champ));
});

test('format and points settings', () => {
  assert.equal(game.DEFAULT_SETTINGS.format, 'bracket');
  assert.equal(game.DEFAULT_SETTINGS.scoring, true);
  const s = game.cleanSettings(game.DEFAULT_SETTINGS, { format: 'classic', scoring: false });
  assert.deepEqual([s.format, s.scoring], ['classic', false]);
  assert.equal(game.cleanSettings(s, { format: 'swiss' }).format, 'classic');
});
