// Who Sings It? A music quiz for the whole party.
//
// Every round, a song plays (a 30-second preview) and everyone types who
// sings it, or what it's called, on their own phone (with suggestions as they
// type). Stuck? A hint turns it into four choices, for half the points. A
// right answer scores 100, plus up to 50 more for answering fast. With the
// finale on, the last song is double or nothing: before it plays, everyone
// bets some or all of their points on getting it right.
//
// The host can also make every round multiple choice (no typing), for
// little ones.
//
// Like the battle, this is pure: `now` for time and `rng` for randomness. The
// server finds the songs (with the answers and the wrong choices) and hands
// them to `startQuiz`. Views never include an answer before its reveal.
//
// Phases:  lobby -> quiz -> final
//   First:      intro (how to play, until every guest is ready or the host starts)
//   Each song:  play (a 3-2-1, then answers open) -> reveal
//   Before the last song, with the finale on:  wager

import { GameError, cleanTheme, itemKey, songKey } from './game.js';

export const QUIZ_DEFAULTS = Object.freeze({
  kind: 'song',    // always songs (shared screens read this)
  ask: 'artist',   // what to name: 'artist' | 'song' (the title) | 'mix' (take turns)
  answers: 'type', // 'type' (type it, or take a hint for half points) | 'choice' (always four choices)
  level: 'medium', // how well known the songs are: 'easy' (the biggest hits) | 'medium' | 'hard' (deeper cuts)
  rounds: 10,      // songs before the finale
  seconds: 30,     // time to answer each one
  sound: 'host',   // 'host' (one phone plays it: best in one room) | 'all' (every phone)
  wager: true,     // the double-or-nothing finale
  theme: null,     // { name, genre, decade, vibe }: what kind of songs
  clean: false,    // no explicit songs
});

export const QUIZ_POINTS = {
  right: 100,      // a right answer
  speed: 50,       // up to this much more for answering fast
  hint: 0.5,       // a hint (four choices) is worth this share of the points
  minBet: 100,     // anyone can bet at least this much in the finale
};

export const ASKS = ['artist', 'song', 'mix'];
export const ANSWER_MODES = ['type', 'choice'];
export const LEVELS = ['easy', 'medium', 'hard'];
export const ROUND_COUNTS = [5, 10, 15, 20];
export const ANSWER_SECONDS = [10, 15, 20, 30];
export const COUNTDOWN_MS = 3000;   // the 3-2-1 before each song
export const WAGER_MS = 30_000;     // time to place a bet

export function cleanQuizSettings(current, patch) {
  const next = { ...current };
  const p = patch && typeof patch === 'object' ? patch : {};
  if (ASKS.includes(p.ask)) next.ask = p.ask;
  if (ANSWER_MODES.includes(p.answers)) next.answers = p.answers;
  if (LEVELS.includes(p.level)) next.level = p.level;
  if (ROUND_COUNTS.includes(Number(p.rounds))) next.rounds = Number(p.rounds);
  if (ANSWER_SECONDS.includes(Number(p.seconds))) next.seconds = Number(p.seconds);
  if (p.sound === 'host' || p.sound === 'all') next.sound = p.sound;
  if (typeof p.wager === 'boolean') next.wager = p.wager;
  if (typeof p.clean === 'boolean') next.clean = p.clean;
  if ('theme' in p) next.theme = cleanTheme(p.theme);
  return next;
}

// How many songs the server should find for these rules.
export const songsNeeded = (s) => s.rounds + (s.wager ? 1 : 0);

// ---------------------------------------------------------------- helpers

const text = (v, max = 150) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const here = (room) => room.order.map((id) => room.players[id]).filter((p) => p?.online);

function shuffle(list, rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function personView(room, pid) {
  const p = room.players[pid] || room.alumni[pid];
  return p ? { id: pid, name: p.name, avatar: p.avatar, color: p.color } : null;
}

// A song from the server: the answer, its details, and three wrong choices
// for each kind of question.
function cleanSong(s) {
  const distinct = (list, answer) => {
    const seen = new Set([answer.toLowerCase()]);
    return (Array.isArray(list) ? list : []).map((x) => text(x)).filter((x) => x && !seen.has(x.toLowerCase()) && seen.add(x.toLowerCase()));
  };
  const title = text(s?.title);
  const artist = text(s?.artist, 120);
  if (!title || !artist) return null;
  return {
    kind: 'song',
    title,
    artist,
    album: text(s.album) || null,
    year: Number.isInteger(s.year) ? s.year : null,
    cover: text(s.cover, 500) || null,
    deezerId: Number.isInteger(s.deezerId) ? s.deezerId : null,
    genres: (Array.isArray(s.genres) ? s.genres : []).map((g) => text(g, 40)).filter(Boolean).slice(0, 3),
    decoys: { artist: distinct(s.decoys?.artist, artist).slice(0, 3), song: distinct(s.decoys?.song, title).slice(0, 3) },
  };
}

// What everyone sees once a song is revealed.
const publicSong = (s) => ({ kind: 'song', title: s.title, artist: s.artist, album: s.album, year: s.year, cover: s.cover, deezerId: s.deezerId, genres: s.genres });

const answerOf = (song, ask) => (ask === 'song' ? song.title : song.artist);

// Typed answers count when they're the same name, give or take capitals,
// punctuation, "the", "&" and a typo or two in a long name. Song titles also
// ignore "(Remastered)", "(feat. …)" and the like.
const keyFor = (ask, value) => (ask === 'song' ? songKey(value) : itemKey(value));

function typos(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return row[b.length];
}

export function sameAnswer(ask, given, answer) {
  const [a, b] = [keyFor(ask, given), keyFor(ask, answer)];
  if (!a || !b) return false;
  if (a === b) return true;
  const allowed = b.length >= 10 ? 2 : b.length >= 5 ? 1 : 0;
  return allowed > 0 && Math.abs(a.length - b.length) <= allowed && typos(a, b) <= allowed;
}

// "Mix" takes turns: artist, then title, then artist… A song without three
// wrong choices for its turn asks the other question.
function askFor(setting, song, round) {
  const want = setting === 'mix' ? (round % 2 ? 'artist' : 'song') : setting;
  if (song.decoys[want].length >= 3) return want;
  const other = want === 'song' ? 'artist' : 'song';
  return song.decoys[other].length >= 3 ? other : want;
}

export const decadeOf = (year) =>
  !year ? null : year < 1970 ? '60s' : year < 2000 ? `${String(year).slice(2, 3)}0s` : `${String(year).slice(0, 3)}0s`;

const isFinal = (q) => q.finale && q.round === q.total + 1;
const scoreOf = (q, pid) => (q.scores[pid] ||= { points: 0, right: 0 });
export const maxBet = (q, pid) => Math.max(q.scores[pid]?.points || 0, QUIZ_POINTS.minBet);

// ---------------------------------------------------------------- the game

export function setLoading(room, on) {
  room.loading = !!on;
}

export function startQuiz(room, songs, now, rng = Math.random) {
  if (room.phase !== 'lobby' && room.phase !== 'final') throw new GameError('The quiz is already on', 409);
  const s = room.settings;
  const list = (Array.isArray(songs) ? songs : []).map(cleanSong).filter((x) => x && (x.decoys.artist.length >= 3 || x.decoys.song.length >= 3));
  const finale = s.wager && list.length > 1;
  const total = Math.min(s.rounds, list.length - (finale ? 1 : 0));
  room.loading = false;
  if (total < 1) throw new GameError("Couldn't find enough songs. Try another theme 🎲", 422);
  room.phase = 'quiz';
  room.final = null;
  room.quiz = {
    songs: list.slice(0, total + (finale ? 1 : 0)),
    total,               // songs before the finale
    finale,              // a double-or-nothing song comes last
    round: 0,
    stage: 'intro',      // 'intro' (how to play) -> 'play' -> 'reveal' (and 'wager' before the final song)
    ready: {},           // pid -> true: read how to play and ready for the first song
    ask: null,           // 'artist' | 'song' for this round
    finalAsk: null,      // the final song's question, announced while betting
    options: [],
    startsAt: null,      // the song starts (after the 3-2-1)
    endsAt: null,        // answers (or bets) close
    answers: {},         // pid -> { choice, at }: what they typed or picked
    hints: {},           // pid -> true: asked for the four choices this round
    wagers: {},          // pid -> points bet on the final song
    scores: {},          // pid -> { points, right }
    result: null,
    history: [],
    startedAt: now,
  };
  for (const p of Object.values(room.players)) p.ready = false;
}

function beginRound(room, now, rng) {
  const q = room.quiz;
  q.round += 1;
  const song = q.songs[q.round - 1];
  q.ask = isFinal(q) && q.finalAsk ? q.finalAsk : askFor(room.settings.ask, song, q.round);
  const decoys = song.decoys[q.ask].slice(0, 3);
  q.options = shuffle([answerOf(song, q.ask), ...decoys], rng);
  q.answers = {};
  q.hints = {};
  q.result = null;
  q.stage = 'play';
  q.startsAt = now + COUNTDOWN_MS;
  q.endsAt = q.startsAt + room.settings.seconds * 1000;
}

function startWager(room, now) {
  const q = room.quiz;
  q.stage = 'wager';
  q.wagers = {};
  q.answers = {};
  q.hints = {};
  q.options = [];
  q.result = null;
  q.finalAsk = askFor(room.settings.ask, q.songs[q.total], q.total + 1);
  q.startsAt = null;
  q.endsAt = now + WAGER_MS;
}

// Answers close: score them and show the song.
function reveal(room, now) {
  const q = room.quiz;
  const song = q.songs[q.round - 1];
  const answer = answerOf(song, q.ask);
  const final = isFinal(q);
  const points = {};
  const right = [];
  const choices = {};
  const answered = Object.entries(q.answers).filter(([pid]) => room.players[pid]).sort((x, y) => x[1].at - y[1].at);
  // A hint halves what a right answer wins (not what a wrong one loses).
  const share = (pid) => (q.hints[pid] && room.settings.answers === 'type' ? QUIZ_POINTS.hint : 1);
  for (const [pid, a] of answered) {
    const ok = sameAnswer(q.ask, a.choice, answer);
    const score = scoreOf(q, pid);
    let delta = 0;
    if (final) {
      const bet = q.wagers[pid] || 0;
      delta = ok ? Math.round(bet * share(pid)) : -Math.min(bet, score.points);
    } else if (ok) {
      const left = Math.max(0, q.endsAt - a.at) / (room.settings.seconds * 1000);
      delta = Math.round((QUIZ_POINTS.right + QUIZ_POINTS.speed * Math.min(1, left)) * share(pid));
    }
    if (ok) {
      right.push(pid);
      score.right += 1;
    }
    score.points += delta;
    points[pid] = delta;
    choices[pid] = a.choice;
  }
  // No answer to the final song loses the bet, like a wrong one.
  if (final) {
    for (const [pid, bet] of Object.entries(q.wagers)) {
      if (pid in points || !room.players[pid]) continue;
      const score = scoreOf(q, pid);
      points[pid] = -Math.min(bet, score.points);
      score.points += points[pid];
    }
  }
  const hints = Object.keys(q.hints).filter((pid) => room.players[pid]);
  q.result = {
    answer, ask: q.ask, song: publicSong(song), choices, right, points, hints,
    fastest: right[0] || null, final, wagers: final ? { ...q.wagers } : null,
  };
  q.history.push({ round: q.round, ask: q.ask, answer, song: publicSong(song), right, points, choices, hints, final });
  q.stage = 'reveal';
  q.endsAt = null;
}

function finish(room, now) {
  room.phase = 'final';
  room.final = { at: now };
  room.quiz.stage = 'done';
}

// Everyone answered (or bet), or time's up.
export function settleQuiz(room, now, rng = Math.random) {
  const q = room.quiz;
  if (room.phase !== 'quiz' || !q) return false;
  const people = here(room);
  if (q.stage === 'intro') {
    // The host starts it whenever they like; it also starts once every guest
    // has read how to play.
    const guests = people.filter((p) => p.id !== room.hostId);
    if (guests.length > 0 && guests.every((p) => q.ready[p.id])) {
      beginRound(room, now, rng);
      return true;
    }
  }
  if (q.stage === 'play') {
    const all = people.length > 0 && people.every((p) => q.answers[p.id]);
    if (all || now >= q.endsAt) {
      reveal(room, now);
      return true;
    }
  }
  if (q.stage === 'wager') {
    const all = people.length > 0 && people.every((p) => q.wagers[p.id] != null);
    if (all || now >= q.endsAt) {
      beginRound(room, now, rng);
      return true;
    }
  }
  return false;
}

// A player left: their answer and bet go with them (their score stays on the board).
export function forgetPlayer(room, pid) {
  if (!room.quiz) return;
  delete room.quiz.answers[pid];
  delete room.quiz.wagers[pid];
  delete room.quiz.hints[pid];
  delete room.quiz.ready[pid];
}

const requireHost = (room, pid) => {
  if (room.hostId !== pid) throw new GameError('Only the host can do that', 403);
};

export function quizAct(room, pid, action, now, rng = Math.random) {
  const q = room.quiz;
  switch (action.type) {
    case 'settings': {
      requireHost(room, pid);
      if (room.phase !== 'lobby') throw new GameError('The rules are locked once the quiz starts', 409);
      if (room.loading) throw new GameError('Hang on, picking the songs 🎵', 409);
      room.settings = cleanQuizSettings(room.settings, action.settings);
      return {};
    }

    case 'start':
    case 'rematch':
      // The server finds the songs first and then calls startQuiz.
      throw new GameError('Hang on, still picking the songs', 409);

    case 'ready': {
      // Read how to play: ready for the first song.
      if (room.phase !== 'quiz' || q.stage !== 'intro') return {};
      q.ready[pid] = true;
      return {};
    }

    case 'hint': {
      // The four choices, for half the points.
      if (room.phase !== 'quiz' || q.stage !== 'play' || action.round !== q.round) throw new GameError('Too late for a hint', 409);
      if (room.settings.answers !== 'type') return {};
      if (q.answers[pid]) throw new GameError("You're locked in", 409);
      if (now < q.startsAt - 1000) throw new GameError('Wait for the song! 🎵', 409);
      q.hints[pid] = true;
      return {};
    }

    case 'answer': {
      if (room.phase !== 'quiz' || q.stage !== 'play' || action.round !== q.round) throw new GameError("Too late, answers for that one are closed", 409);
      if (q.answers[pid]) throw new GameError("You're locked in", 409);
      if (now < q.startsAt - 1000) throw new GameError('Wait for the song! 🎵', 409);
      const choice = text(action.choice, 120);
      const choosing = room.settings.answers === 'choice' || q.hints[pid];
      if (choosing ? !q.options.includes(choice) : !choice) throw new GameError(choosing ? 'Pick one of the four answers' : 'Type an answer first');
      q.answers[pid] = { choice, at: Math.max(now, q.startsAt) };
      return {};
    }

    case 'wager': {
      if (room.phase !== 'quiz' || q.stage !== 'wager') throw new GameError('Betting is closed', 409);
      if (q.wagers[pid] != null) throw new GameError('Your bet is in', 409);
      const max = maxBet(q, pid);
      const amount = Math.round(Number(action.amount));
      if (!Number.isFinite(amount) || amount < 0 || amount > max) throw new GameError(`Bet anything from 0 to ${max}`);
      q.wagers[pid] = amount;
      return {};
    }

    case 'next': {
      // Host: on to the next song, the bets, or the final scores. Also ends
      // answers or bets early. The round and stage make a double tap harmless.
      requireHost(room, pid);
      if (room.phase !== 'quiz' || action.round !== q.round || action.stage !== q.stage) return {};
      if (q.stage === 'intro') beginRound(room, now, rng);
      else if (q.stage === 'play') reveal(room, now);
      else if (q.stage === 'wager') beginRound(room, now, rng);
      else if (q.stage === 'reveal') {
        if (q.round < q.total) beginRound(room, now, rng);
        else if (q.finale && q.round === q.total) startWager(room, now);
        else finish(room, now);
      }
      return {};
    }

    case 'again': {
      requireHost(room, pid);
      room.phase = 'lobby';
      room.quiz = null;
      room.final = null;
      room.loading = false;
      return {};
    }

    default:
      throw new GameError('That move is not available right now', 409);
  }
}

// The original album, cover and year, found after the game started.
export function applySongDetails(room, quiz, index, details) {
  if (room.quiz !== quiz || !quiz.songs[index] || !details) return false;
  const song = quiz.songs[index];
  if (details.album) song.album = text(details.album) || song.album;
  if (details.cover) song.cover = text(details.cover, 500) || song.cover;
  if (Number.isInteger(details.year)) song.year = details.year;
  if (Array.isArray(details.genres) && details.genres.length && !song.genres.length) song.genres = details.genres.slice(0, 3);
  // Rounds already played show the details too.
  for (const h of quiz.history) {
    if (h.round === index + 1) h.song = publicSong(song);
  }
  if (quiz.result && quiz.round === index + 1) quiz.result.song = publicSong(song);
  return true;
}

// The song a phone may play: this round's or an earlier one.
export function clipSong(room, round) {
  const q = room.quiz;
  const n = Number(round);
  if (!q || !Number.isInteger(n) || n < 1 || n > q.round) return null;
  return q.songs[n - 1];
}

// ---------------------------------------------------------------- views

function scoreboard(room) {
  const q = room.quiz;
  const ids = new Set([...room.order, ...Object.keys(q.scores)]);
  const last = q.result?.points || {};
  return [...ids]
    .map((id) => ({ ...personView(room, id), points: q.scores[id]?.points || 0, right: q.scores[id]?.right || 0, delta: last[id] ?? null }))
    .filter((r) => r.id)
    .sort((x, y) => y.points - x.points || y.right - x.right);
}

// Has this player done their part in the current stage?
export const quizDone = (room, pid) => {
  const q = room.quiz;
  if (room.phase !== 'quiz' || !q) return false;
  if (q.stage === 'intro') return pid === room.hostId || !!q.ready[pid];
  if (q.stage === 'play') return !!q.answers[pid];
  if (q.stage === 'wager') return q.wagers[pid] != null;
  return false;
};

export function quizView(room, pid, now) {
  const q = room.quiz;
  if (!q) return null;
  const people = here(room);
  const final = isFinal(q);
  const upcoming = q.stage === 'wager' ? q.songs[q.total] : final ? q.songs[q.round - 1] : null;
  return {
    round: q.round,
    total: q.total,
    finale: q.finale,
    final,
    stage: q.stage,
    startsAt: q.startsAt,
    endsAt: q.endsAt,
    ask: q.stage === 'wager' ? q.finalAsk : q.ask,
    // The four choices: for everyone in a multiple-choice game, otherwise
    // only for someone who asked for a hint.
    options: q.stage === 'play' && (room.settings.answers === 'choice' || q.hints[pid]) ? q.options : [],
    hinted: !!q.hints[pid],
    myAnswer: q.answers[pid]?.choice ?? null,
    done: people.filter((p) => quizDone(room, p.id)).length,
    result: q.stage === 'reveal' || q.stage === 'done' ? q.result : null,
    scores: scoreboard(room),
    // The finale: what the last song is (roughly), and the bets.
    bet: upcoming
      ? {
          decade: decadeOf(upcoming.year),
          genre: upcoming.genres[0] || null,
          max: maxBet(q, pid),
          mine: q.wagers[pid] ?? null,
          placed: Object.keys(q.wagers).length,
        }
      : null,
    history: room.phase === 'final' ? q.history : null,
    startedAt: q.startedAt,
  };
}
