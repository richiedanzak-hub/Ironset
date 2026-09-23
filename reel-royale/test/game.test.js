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

const add = (room, pid, title, extra = {}) => game.act(room, pid, { type: 'add', movie: { title, ...extra } }, T0, rng);

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
  // Different TMDB ids with the same title are different movies.
  add(room, ids[0], 'Dune', { tmdbId: 841 });
  add(room, ids[1], 'Dune', { tmdbId: 438631 });
  assert.equal(Object.keys(room.entries).length, 3);
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

test('the submission timer ends the round, but never with fewer than 2 movies', () => {
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

function toBattle(titles, settings = {}) {
  const { room, ids } = party(['Mom', 'Dad', 'Kid'], { maxPerPlayer: 0, ...settings });
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
  vote(room, ids[2], b.champ);
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
  vote(room, ids[0], b.champ);
  vote(room, ids[0], b.challenger);
  assert.equal(b.votes[ids[0]], b.challenger);
  assert.throws(() => game.act(room, ids[1], { type: 'vote', round: 5, entryId: b.champ }, T0), /closed/);
  assert.throws(() => game.act(room, ids[1], { type: 'vote', round: 1, entryId: 'nope' }, T0), /one of the two/);
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

test('vote timer closes the vote without waiting on stragglers', () => {
  const { room, ids } = toBattle(['A', 'B'], { voteSeconds: 20 });
  const b = room.battle;
  vote(room, ids[0], b.champ);
  game.tick(room, T0 + 10_000, rng);
  assert.equal(b.stage, 'voting');
  game.tick(room, T0 + 21_000, rng);
  assert.equal(b.stage, 'result');
  assert.equal(b.result.winner, b.champ);
});

test('a player who leaves mid-vote does not block the round', () => {
  const { room, ids } = toBattle(['A', 'B', 'C']);
  const b = room.battle;
  vote(room, ids[0], b.champ);
  vote(room, ids[1], b.champ);
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
  assert.equal(byOf(hidden.room, hidden.ids[0], hb.champ), null);
  game.act(hidden.room, hidden.ids[0], { type: 'close', round: 1 }, T0, rng);
  assert.equal(byOf(hidden.room, hidden.ids[0], hb.champ), null);
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

test('battle views only include movies already drawn from the hat', () => {
  const { room, ids } = toBattle(['A', 'B', 'C', 'D', 'E']);
  const v = game.viewFor(room, ids[1], T0);
  assert.equal(Object.keys(v.entries).length, 2);
  assert.equal(v.battle.left, 3);
  assert.equal(v.battle.myVote, null);
  vote(room, ids[1], room.battle.champ);
  const v2 = game.viewFor(room, ids[0], T0);
  assert.equal(v2.players.find((p) => p.id === ids[1]).voted, true);
  assert.equal(v2.battle.myVote, null, "can't see other people's votes");
});

test('final view ranks the pickers by matchups their movies won', () => {
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
  const typed = add(room, ids[0], 'jaws');
  assert.equal(typed.needsDetails, true);
  add(room, ids[1], 'Jaws', { year: 1975, tmdbId: 578 });
  // "jaws" matched by title already, so it merged at add time.
  assert.equal(Object.keys(room.entries).length, 1);

  const other = add(room, ids[0], 'heat');
  game.applyDetails(room, other.entryId, { title: 'Heat', year: 1995, tmdbId: 949, poster: 'https://image.tmdb.org/t/p/w342/heat.jpg' }, T0);
  const heat = room.entries[other.entryId];
  assert.equal(heat.title, 'Heat');
  assert.equal(heat.year, 1995);
  assert.equal(heat.poster, 'https://image.tmdb.org/t/p/w342/heat.jpg');
});

test('movie input is sanitised', () => {
  const m = game.cleanMovie({ title: '  Jaws\n\n', year: 1975.5, poster: 'javascript:alert(1)', tmdbId: '5', rating: 11, genres: ['Horror', 7] });
  assert.equal(m.title, 'Jaws');
  assert.equal(m.year, null);
  assert.equal(m.poster, null);
  assert.equal(m.tmdbId, null);
  assert.equal(m.rating, null);
  assert.deepEqual(m.genres, ['Horror']);
  assert.throws(() => game.cleanMovie({ title: '' }), /Type a movie/);
  assert.equal(game.movieKey('The Lord of the Rings: The Return of the King'), game.movieKey('lord of the rings the return of the king'));
});
