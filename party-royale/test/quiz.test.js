import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as game from '../src/game.js';
import { COUNTDOWN_MS, QUIZ_POINTS, WAGER_MS, clipSong, decadeOf, sameAnswer } from '../src/quiz.js';

const T0 = 1_700_000_000_000;
const rng = () => 0;

function party(names = ['Mom', 'Dad', 'Kid'], settings = {}) {
  const room = game.createRoom('QZQZ', T0, { game: 'quiz' });
  const ids = names.map((name) => game.joinRoom(room, { name, avatar: '🎤' }, T0).player.id);
  for (const id of ids) game.connect(room, id, T0);
  game.act(room, ids[0], { type: 'settings', settings: { seconds: 20, ...settings } }, T0);
  return { room, ids };
}

const song = (i, extra = {}) => ({
  title: `Tune ${i}`,
  artist: `Singer ${i}`,
  album: `Record ${i}`,
  year: 1980 + i,
  genres: ['Rock'],
  deezerId: 1000 + i,
  decoys: { artist: [`Wrong ${i}a`, `Wrong ${i}b`, `Wrong ${i}c`], song: [`Not It ${i}a`, `Not It ${i}b`, `Not It ${i}c`] },
  ...extra,
});
const songs = (n) => Array.from({ length: n }, (_, i) => song(i + 1));

function begin(room, ids, list, t = T0) {
  game.prepareQuiz(room, ids[0], t);
  game.playQuiz(room, list, t, rng);
}

const answer = (room, pid, choice, t) => game.act(room, pid, { type: 'answer', round: room.quiz.round, choice }, t, rng);
const next = (room, pid, t) => game.act(room, pid, { type: 'next', round: room.quiz.round, stage: room.quiz.stage }, t, rng);
const right = (room) => (room.quiz.ask === 'song' ? room.quiz.songs[room.quiz.round - 1].title : room.quiz.songs[room.quiz.round - 1].artist);
const wrong = (room) => room.quiz.options.find((o) => o !== right(room));

test('who sings it: its own kind of party, with its own rules', () => {
  const fresh = game.createRoom('ABCD', T0, { game: 'quiz' });
  assert.equal(fresh.game, 'quiz');
  assert.deepEqual([fresh.settings.ask, fresh.settings.answers, fresh.settings.rounds, fresh.settings.seconds, fresh.settings.wager], ['artist', 'type', 10, 30, true]);
  const { room, ids } = party();
  game.act(room, ids[0], { type: 'settings', settings: { ask: 'mix', rounds: 5, seconds: 15, sound: 'all', theme: { decade: '80s' }, rounds2: 9 } }, T0);
  assert.deepEqual([room.settings.ask, room.settings.rounds, room.settings.seconds, room.settings.sound, room.settings.theme.decade], ['mix', 5, 15, 'all', '80s']);
  game.act(room, ids[0], { type: 'settings', settings: { rounds: 7, seconds: 3, ask: 'lyrics' } }, T0);
  assert.deepEqual([room.settings.ask, room.settings.rounds, room.settings.seconds], ['mix', 5, 15], 'only the offered choices');
  assert.throws(() => game.act(room, ids[1], { type: 'settings', settings: { rounds: 20 } }, T0), /Only the host/);
  assert.throws(() => game.act(room, ids[0], { type: 'add', item: { title: 'x' } }, T0), /not available/);
  assert.equal(game.viewFor(room, ids[0], T0).game, 'quiz');
});

test('the host starts it, the server brings the songs, and nobody can sneak songs in', () => {
  const { room, ids } = party();
  assert.throws(() => game.act(room, ids[0], { type: 'start', songs: songs(5) }, T0), /picking the songs/);
  assert.throws(() => game.prepareQuiz(room, ids[1], T0), /Only the host/);
  game.prepareQuiz(room, ids[0], T0);
  assert.equal(game.viewFor(room, ids[1], T0).loading, true, 'everyone sees the songs being picked');
  assert.throws(() => game.prepareQuiz(room, ids[0], T0), /Already/);
  assert.throws(() => game.act(room, ids[0], { type: 'settings', settings: { rounds: 20 } }, T0), /picking the songs/, 'rules stay put while the songs load');
  assert.throws(() => game.playQuiz(room, [song(1, { decoys: {} })], T0, rng), /enough songs/);
  assert.equal(room.loading, false);
  assert.equal(room.phase, 'lobby');

  begin(room, ids, songs(11));
  const q = room.quiz;
  assert.equal(room.phase, 'quiz');
  assert.equal(q.total, 10);
  assert.equal(q.songs.length, 11, 'ten songs and the finale');
  assert.equal(q.round, 1);
  assert.equal(q.startsAt, T0 + COUNTDOWN_MS, 'a 3-2-1 first');
  assert.equal(q.endsAt, q.startsAt + 20_000);
  assert.equal(q.options.length, 4);
  assert.ok(q.options.includes('Singer 1'));
});

test('a round: answers stay secret, right ones score more when fast, then the reveal', () => {
  const { room, ids } = party();
  begin(room, ids, songs(6));
  const q = room.quiz;
  const [mom, dad, kid] = ids;

  // What a phone sees while the song plays: a box to type in. No title, no
  // song id, and no choices (those are a hint).
  const view = game.viewFor(room, dad, T0 + 4000);
  const seen = JSON.stringify(view);
  assert.ok(!seen.includes('Tune 1'), 'no title');
  assert.ok(!seen.includes('Singer 1'), 'no artist');
  assert.ok(!seen.includes('1001'), 'no Deezer id to look up');
  assert.ok(!seen.includes('Record 1'), 'no album');
  assert.deepEqual(view.quiz.options, []);
  assert.equal(view.quiz.result, null);

  assert.throws(() => answer(room, mom, right(room), T0), /Wait for the song/);
  assert.throws(() => answer(room, mom, '   ', T0 + 4000), /Type an answer/);
  answer(room, mom, 'singer 1', q.startsAt + 2000); // 18 of 20 seconds left
  assert.throws(() => answer(room, mom, wrong(room), q.startsAt + 3000), /locked in/);
  answer(room, dad, wrong(room), q.startsAt + 1000);
  assert.equal(q.stage, 'play');
  assert.equal(game.viewFor(room, kid, T0).quiz.done, 2);
  assert.equal(game.viewFor(room, kid, T0).players.find((p) => p.id === mom).voted, true, 'faces show who has answered');
  answer(room, kid, right(room), q.startsAt + 19_000);
  assert.equal(q.stage, 'reveal', 'everyone answered');

  const r = game.viewFor(room, dad, T0).quiz.result;
  assert.equal(r.answer, 'Singer 1');
  assert.equal(r.song.title, 'Tune 1');
  assert.deepEqual(r.right, [mom, kid], 'fastest first');
  assert.equal(r.fastest, mom);
  assert.equal(r.points[mom], QUIZ_POINTS.right + 45);
  assert.equal(r.points[kid], QUIZ_POINTS.right + 3);
  assert.equal(r.points[dad], 0);
  assert.equal(r.choices[dad], wrong(room));
  assert.equal(r.choices[mom], 'singer 1', 'everyone sees what everyone typed');
  const scores = game.viewFor(room, dad, T0).quiz.scores;
  assert.deepEqual(scores.map((s) => s.id), [mom, kid, dad]);
  assert.equal(scores[0].delta, 145);

  assert.throws(() => next(room, dad, T0), /Only the host/);
  next(room, mom, T0 + 30_000);
  assert.equal(q.round, 2);
  assert.equal(q.stage, 'play');
  game.act(room, mom, { type: 'next', round: 1, stage: 'reveal' }, T0, rng);
  assert.equal(q.round, 2, 'a double tap does nothing');
});

test('typed answers: close enough counts, and a hint costs half the points', () => {
  const { room, ids } = party();
  const list = songs(4);
  list[0] = song(1, { artist: "Guns N' Roses", title: "Sweet Child O' Mine" });
  begin(room, ids, list);
  const q = room.quiz;
  const [mom, dad, kid] = ids;
  const t = q.startsAt + 2000;

  assert.throws(() => game.act(room, dad, { type: 'hint', round: q.round }, T0), /Wait for the song/);
  game.act(room, dad, { type: 'hint', round: q.round }, t, rng);
  const dadSees = game.viewFor(room, dad, t).quiz;
  assert.equal(dadSees.hinted, true);
  assert.equal(dadSees.options.length, 4, 'four choices for the one who asked');
  assert.ok(dadSees.options.includes("Guns N' Roses"));
  assert.deepEqual(game.viewFor(room, mom, t).quiz.options, [], 'nobody else');
  assert.throws(() => answer(room, dad, 'guns and roses', t), /four answers/, 'with a hint, pick one of the four');

  answer(room, mom, 'guns and roses', t);
  answer(room, dad, "Guns N' Roses", t);
  answer(room, kid, 'Guns', t);
  assert.throws(() => game.act(room, kid, { type: 'hint', round: q.round }, t, rng), /Too late/);
  assert.deepEqual(q.result.right, [mom, dad]);
  assert.equal(q.result.points[mom], 145);
  assert.equal(q.result.points[dad], Math.round(145 * QUIZ_POINTS.hint));
  assert.equal(q.result.points[kid], 0);
  assert.deepEqual(q.result.hints, [dad]);
  next(room, mom, T0);
  assert.deepEqual(game.viewFor(room, dad, T0).quiz.options, [], 'hints reset each song');
});

test('what counts as the same name', () => {
  const yes = [
    ['artist', 'the beatles', 'The Beatles'],
    ['artist', 'Beatles', 'The Beatles'],
    ['artist', 'earth wind and fire', 'Earth, Wind & Fire'],
    ['artist', 'Beyonce', 'Beyoncé'],
    ['artist', 'Micheal Jackson', 'Michael Jackson'],
    ['song', 'bohemian rhapsody', 'Bohemian Rhapsody - Remastered 2011'],
    ['song', 'Hey Jud', 'Hey Jude'],
    ['song', 'dont stop believin', "Don't Stop Believin'"],
  ];
  const no = [
    ['artist', 'Queen', 'Queens of the Stone Age'],
    ['artist', 'ABBY', 'ABBA'],
    ['artist', 'Taylor', 'Taylor Swift'],
    ['song', 'Hey', 'Hey Jude'],
    ['artist', '', 'Queen'],
  ];
  for (const [ask, given, answer] of yes) assert.ok(sameAnswer(ask, given, answer), `${given} = ${answer}`);
  for (const [ask, given, answer] of no) assert.ok(!sameAnswer(ask, given, answer), `${given} ≠ ${answer}`);
});

test('multiple choice for everyone, when the host picks it', () => {
  const { room, ids } = party(['Mom', 'Dad'], { answers: 'choice' });
  begin(room, ids, songs(3));
  const q = room.quiz;
  assert.equal(game.viewFor(room, ids[1], T0).quiz.options.length, 4);
  assert.throws(() => answer(room, ids[1], 'Somebody Else', q.startsAt), /four answers/);
  answer(room, ids[0], right(room), q.startsAt);
  answer(room, ids[1], wrong(room), q.startsAt);
  assert.equal(q.result.points[ids[0]], 150, 'full points: no hint involved');
});

test("time's up: whoever answered scores, and the host can reveal early", () => {
  const { room, ids } = party();
  begin(room, ids, songs(4));
  const q = room.quiz;
  answer(room, ids[1], right(room), q.startsAt + 5000);
  game.tick(room, q.endsAt - 1, rng);
  assert.equal(q.stage, 'play');
  game.tick(room, q.endsAt, rng);
  assert.equal(q.stage, 'reveal');
  assert.equal(q.result.points[ids[1]], 100 + Math.round(50 * 15 / 20));
  next(room, ids[0], T0);
  next(room, ids[0], T0 + 5000);
  assert.equal(q.stage, 'reveal', 'host: reveal now');
});

test('name the song, or take turns; a song without three other titles asks for the artist', () => {
  const { room, ids } = party(['Mom', 'Dad'], { ask: 'mix', wager: false });
  const list = songs(4);
  list[3].decoys.song = ['Only one'];
  begin(room, ids, list);
  const q = room.quiz;
  const asks = [];
  for (let i = 0; i < 4; i++) {
    asks.push(q.ask);
    if (q.ask === 'song') assert.ok(q.options.includes(q.songs[q.round - 1].title));
    next(room, ids[0], T0);
    next(room, ids[0], T0);
  }
  assert.deepEqual(asks, ['artist', 'song', 'artist', 'artist']);
  assert.equal(room.phase, 'final', 'no finale: done after the last song');
});

test('the finale: bet some or all of your points, double them or lose them', () => {
  const { room, ids } = party(['Mom', 'Dad', 'Kid'], { rounds: 5 });
  const list = songs(6);
  list[5] = song(6, { year: 1987, genres: ['Pop'] });
  begin(room, ids, list);
  const q = room.quiz;
  const [mom, dad, kid] = ids;
  // Mom gets everything right fast; Dad gets one right; Kid gets none.
  for (let i = 0; i < 5; i++) {
    answer(room, mom, right(room), q.startsAt);
    answer(room, dad, i === 0 ? right(room) : wrong(room), q.startsAt + 10_000);
    answer(room, kid, wrong(room), q.startsAt);
    next(room, mom, T0);
  }
  assert.equal(q.scores[mom].points, 750);
  assert.equal(q.scores[dad].points, 125);
  assert.equal(q.scores[kid]?.points || 0, 0);
  assert.equal(q.stage, 'wager');
  assert.equal(q.endsAt, T0 + WAGER_MS);

  const v = game.viewFor(room, kid, T0).quiz;
  assert.deepEqual([v.bet.decade, v.bet.genre], ['80s', 'Pop'], 'a hint about the last song');
  assert.equal(v.bet.max, QUIZ_POINTS.minBet, 'even with no points, you can bet 100');
  assert.equal(v.ask, 'artist');
  assert.deepEqual(v.options, []);
  assert.equal(game.viewFor(room, mom, T0).quiz.bet.max, 750);

  const bet = (pid, amount) => game.act(room, pid, { type: 'wager', amount }, T0, rng);
  assert.throws(() => bet(dad, 126), /0 to 125/);
  assert.throws(() => bet(dad, -5), /0 to 125/);
  bet(mom, 750);
  assert.throws(() => bet(mom, 10), /bet is in/);
  bet(dad, 100);
  assert.equal(q.stage, 'wager');
  bet(kid, 100);
  assert.equal(q.stage, 'play', 'everyone bet: the last song plays');
  assert.equal(q.round, 6);
  assert.equal(game.viewFor(room, kid, T0).quiz.final, true);

  answer(room, mom, wrong(room), q.startsAt + 1000);
  answer(room, dad, right(room), q.startsAt + 1000);
  game.act(room, kid, { type: 'hint', round: q.round }, q.startsAt + 1000, rng);
  answer(room, kid, right(room), q.startsAt + 1000);
  assert.equal(q.stage, 'reveal');
  assert.equal(q.result.points[mom], -750, 'all in, and lost it');
  assert.equal(q.result.points[dad], 100, 'no speed bonus: just the bet');
  assert.equal(q.result.points[kid], 50, 'a hint wins half the bet');
  assert.deepEqual(q.result.wagers, { [mom]: 750, [dad]: 100, [kid]: 100 });
  assert.deepEqual([q.scores[mom].points, q.scores[dad].points, q.scores[kid].points], [0, 225, 50]);

  next(room, mom, T0);
  assert.equal(room.phase, 'final');
  const fin = game.viewFor(room, kid, T0);
  assert.equal(fin.quiz.history.length, 6);
  assert.equal(fin.quiz.history[5].final, true);
  assert.deepEqual(fin.quiz.scores.map((s) => s.name), ['Dad', 'Kid', 'Mom']);
  assert.deepEqual(fin.quiz.history[5].hints, [kid]);
  assert.ok(fin.final.at);
});

test('no answer to the final song loses the bet, and unplaced bets are 0', () => {
  const { room, ids } = party(['Mom', 'Dad'], { rounds: 5 });
  begin(room, ids, songs(3));
  const q = room.quiz;
  assert.equal(q.total, 2, 'fewer songs found than asked for: the game is shorter');
  for (let i = 0; i < 2; i++) {
    answer(room, ids[0], right(room), q.startsAt);
    answer(room, ids[1], right(room), q.startsAt);
    next(room, ids[0], T0);
  }
  game.act(room, ids[0], { type: 'wager', amount: 200 }, T0, rng);
  game.tick(room, T0 + WAGER_MS, rng);
  assert.equal(q.stage, 'play', "time's up for betting");
  assert.equal(q.wagers[ids[1]], undefined);
  game.tick(room, q.endsAt, rng);
  assert.equal(q.result.points[ids[0]], -200);
  assert.equal(q.result.points[ids[1]], undefined, 'no bet, nothing lost');
  assert.equal(q.scores[ids[0]].points, 100);
});

test('people can leave or drop mid-quiz, and the host can start over', () => {
  const { room, ids } = party();
  begin(room, ids, songs(4));
  const q = room.quiz;
  answer(room, ids[2], right(room), q.startsAt);
  game.act(room, ids[2], { type: 'leave' }, T0, rng);
  assert.equal(q.answers[ids[2]], undefined);
  assert.throws(() => game.act(room, ids[1], { type: 'profile', name: 'Pops' }, T0), /not available/);
  // Dad's phone drops: once he's gone, the game doesn't wait for him.
  game.disconnect(room, ids[1], T0);
  answer(room, ids[0], right(room), q.startsAt);
  assert.equal(q.stage, 'play');
  game.tick(room, T0 + game.PRESENCE_GRACE_MS + 1, rng);
  assert.equal(q.stage, 'reveal');
  game.act(room, ids[0], { type: 'again' }, T0, rng);
  assert.equal(room.phase, 'lobby');
  assert.equal(room.quiz, null);
});

test('play again from the final scores, and what each phone may play', () => {
  const { room, ids } = party(['Mom', 'Dad'], { rounds: 5, wager: false });
  begin(room, ids, songs(5));
  assert.equal(clipSong(room, 1).deezerId, 1001, 'the song playing now');
  assert.equal(clipSong(room, 2), null, 'not the next one');
  assert.equal(clipSong(room, 'x'), null);
  for (let i = 0; i < 5; i++) {
    next(room, ids[0], T0);
    next(room, ids[0], T0);
  }
  assert.equal(room.phase, 'final');
  begin(room, ids, songs(5).map((s) => ({ ...s, title: `${s.title} again` })));
  assert.equal(room.phase, 'quiz');
  assert.equal(room.quiz.round, 1);
  assert.deepEqual(room.quiz.scores, {}, 'a fresh scoreboard');
});

test('decades for the finale hint', () => {
  assert.deepEqual([1965, 1975, 1989, 1999, 2004, 2015, 2024, null].map(decadeOf), ['60s', '70s', '80s', '90s', '2000s', '2010s', '2020s', null]);
});
