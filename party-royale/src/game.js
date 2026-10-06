// Party Royale game engine: movies, songs, albums or artists.
//
// There are two games. This file is the battle (and everything both games
// share: players, hosts, presence). Who Sings It?, the music quiz, has its
// own rules in quiz.js; a room's `game` says which one it plays.
//
// A room is a plain object. Everything in here is synchronous and depends only
// on the arguments (`now` for time, `rng` for randomness), so the rules can be
// tested without a server. The server owns sockets, timers and persistence and
// calls `act`, `tick`, `connect` and `disconnect`.
//
// Phases:  lobby -> submit -> battle -> final
//   lobby   players gather, the host sets the house rules
//   submit  everyone tosses movies (or songs, albums, artists) into the hat, secretly
//   battle  two picks face off and the group votes, in one of two formats:
//           bracket  picks pair off and winners move on, round by round,
//                    until one is left (the default: everyone gets a fair shot)
//           classic  king of the hill: the winner stays on and faces the next
//                    pick drawn from the hat. With the champions round on,
//                    every pick that won a matchup then goes again.
//           In the points game, players also guess who picked each pick.
//   final   the last pick standing is crowned, and the points are counted

import { randomBytes } from 'node:crypto';
import { QUIZ_DEFAULTS, cleanQuizSettings, forgetPlayer, quizAct, quizDone, quizView, settleQuiz, startQuiz } from './quiz.js';

export const LIMITS = { players: 30, entries: 400, name: 20, title: 150 };
export const PRESENCE_GRACE_MS = 15_000;   // a dropped phone counts as "here" this long
export const HOST_HANDOFF_MS = 90_000;     // host offline this long -> someone else hosts

export const DEFAULT_SETTINGS = Object.freeze({
  minPerPlayer: 1,     // must add at least this many before "I'm done"
  maxPerPlayer: 5,     // 0 = no cap
  submitSeconds: 0,    // 0 = no timer
  voteSeconds: 0,      // 0 = no timer
  reveal: 'reveal',    // 'hidden' | 'reveal' (after each vote) | 'open' (while voting)
  ties: 'coin',        // 'coin' | 'champ' (reigning champ keeps the crown) | 'keep' (tied picks stay, next one joins)
  kind: 'song',        // what's being battled: 'movie' | 'song' | 'album' | 'artist' (set in the lobby)
  clean: false,        // true = no explicit songs or albums (music only)
  theme: null,         // { name, genre, decade, vibe }: the host's theme for the night
  themeStrict: true,   // true = picks outside the theme's genre or decade are turned away (checked by the server)
  champions: false,    // classic only: every pick that won a matchup battles again at the end
  format: 'bracket',   // 'bracket' (pair off, winners move on) | 'classic' (king of the hill)
  scoring: true,       // points game: guess who picked what, and score when your picks win
});

// The points game.
export const POINTS = {
  guess: 1,    // guessed who picked it
  win: 2,      // your pick won a matchup
  champ: 3,    // your pick is the champion
};

export const KINDS = ['movie', 'song', 'album', 'artist'];
export const MUSIC_KINDS = ['song', 'album', 'artist'];
const modeOf = (kind) => (kind === 'movie' ? 'movie' : 'music');
export const DECADES = ['2020s', '2010s', '2000s', '90s', '80s', '70s', '60s'];
export const VIBES = ['party', 'singalong', 'feelgood', 'chill', 'workout', 'roadtrip', 'love'];

const REVEAL = ['hidden', 'reveal', 'open'];
const TIES = ['coin', 'champ', 'keep'];
const FORMATS = ['bracket', 'classic'];
export const MAX_FIGHTERS = 4;      // a 'keep' tie can grow a matchup up to a 4-way
const COLORS = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#fb923c', '#f87171', '#22d3ee', '#c084fc', '#a3e635'];
// Album covers from Deezer, movie posters from TMDB, either from Apple.
const COVER_RE = /^https:\/\/([\w-]+\.dzcdn\.net|image\.tmdb\.org|is\d+-ssl\.mzstatic\.com)\/[\w\-./%]+$/;

export class GameError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const newId = () => randomBytes(6).toString('base64url');
const newSecret = () => randomBytes(18).toString('base64url');

// ---------------------------------------------------------------- cleaning

function cleanText(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanAvatar(value) {
  const s = cleanText(value, 16);
  return s && [...s].length <= 4 ? s : '🎉';
}

function clampInt(value, lo, hi, fallback) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
}

// "The Beatles", "beatles" and "The  Beatles!" all land on "beatles".
export function itemKey(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/^\s*(the|a|an)\s+/, '')
    .replace(/[^a-z0-9]+/g, '');
}

// "Bohemian Rhapsody - Remastered 2011" and "Bohemian Rhapsody (Live)" are
// both just "Bohemian Rhapsody".
export function plainTitle(title) {
  return String(title || '')
    .replace(/\s*[([](feat\.?|ft\.?|with|remaster|remix|live|acoustic|radio edit|single|album|explicit|clean|mono|stereo|deluxe|bonus|original|\d{4})[^)\]]*[)\]]/gi, '')
    .replace(/\s+-\s+.*\b(remaster(ed)?|live|version|edit|mix|mono|stereo|deluxe)\b.*$/i, '')
    .trim();
}

// ...and the same song for this game.
export function songKey(title) {
  return itemKey(plainTitle(title));
}

export function cleanItem(input) {
  const m = input && typeof input === 'object' ? input : {};
  const title = cleanText(m.title, LIMITS.title);
  if (!title) throw new GameError('Type a name first');
  const year = Number.isInteger(m.year) && m.year > 1800 && m.year < 2200 ? m.year : null;
  const genres = Array.isArray(m.genres)
    ? m.genres.map((g) => cleanText(g, 24)).filter(Boolean).slice(0, 3)
    : [];
  return {
    title,
    artist: cleanText(m.artist, 120) || null,
    album: cleanText(m.album, 150) || null,
    year,
    cover: typeof m.cover === 'string' && COVER_RE.test(m.cover) ? m.cover : null,
    deezerId: Number.isInteger(m.deezerId) && m.deezerId > 0 ? m.deezerId : null,
    genres,
    explicit: m.explicit === true,
    duration: Number.isInteger(m.duration) && m.duration > 0 && m.duration < 36_000 ? m.duration : null,
    // Movies
    tmdbId: Number.isInteger(m.tmdbId) && m.tmdbId > 0 ? m.tmdbId : null,
    rating: typeof m.rating === 'number' && m.rating >= 0 && m.rating <= 10 ? Math.round(m.rating * 10) / 10 : null,
    runtime: Number.isInteger(m.runtime) && m.runtime > 0 && m.runtime < 1000 ? m.runtime : null,
    overview: cleanText(m.overview, 500) || null,
  };
}

// Details that can be filled in later (typed picks, original releases).
const DETAIL_KEYS = ['artist', 'album', 'year', 'cover', 'deezerId', 'duration', 'tmdbId', 'rating', 'runtime', 'overview'];

// "90s Rock", "Road trip songs", or just a name like "Mom's birthday".
export function cleanTheme(input) {
  if (!input || typeof input !== 'object') return null;
  const theme = {
    name: cleanText(input.name, 40) || null,
    genre: cleanText(input.genre, 40) || null,
    decade: DECADES.includes(input.decade) ? input.decade : null,
    vibe: VIBES.includes(input.vibe) ? input.vibe : null,
  };
  return theme.name || theme.genre || theme.decade || theme.vibe ? theme : null;
}

export function cleanSettings(current, patch) {
  const next = { ...current };
  const p = patch && typeof patch === 'object' ? patch : {};
  if ('minPerPlayer' in p) next.minPerPlayer = clampInt(p.minPerPlayer, 0, 20, next.minPerPlayer);
  if ('maxPerPlayer' in p) next.maxPerPlayer = clampInt(p.maxPerPlayer, 0, 50, next.maxPerPlayer);
  if (next.maxPerPlayer && next.minPerPlayer > next.maxPerPlayer) {
    // Whichever number the host just touched wins; the other follows it.
    if ('maxPerPlayer' in p) next.minPerPlayer = next.maxPerPlayer;
    else next.maxPerPlayer = next.minPerPlayer;
  }
  if ('submitSeconds' in p) next.submitSeconds = clampInt(p.submitSeconds, 0, 3600, next.submitSeconds);
  if ('voteSeconds' in p) next.voteSeconds = clampInt(p.voteSeconds, 0, 600, next.voteSeconds);
  if (REVEAL.includes(p.reveal)) next.reveal = p.reveal;
  if (TIES.includes(p.ties)) next.ties = p.ties;
  if (KINDS.includes(p.kind)) {
    // A Rock theme makes no sense for a movie night (and Horror none for music).
    if (modeOf(p.kind) !== modeOf(next.kind) && !('theme' in p)) next.theme = null;
    next.kind = p.kind;
  }
  if (typeof p.clean === 'boolean') next.clean = p.clean;
  if ('theme' in p) next.theme = cleanTheme(p.theme);
  if (typeof p.champions === 'boolean') next.champions = p.champions;
  if (typeof p.themeStrict === 'boolean') next.themeStrict = p.themeStrict;
  if (FORMATS.includes(p.format)) next.format = p.format;
  if (typeof p.scoring === 'boolean') next.scoring = p.scoring;
  return next;
}

// ---------------------------------------------------------------- helpers

const playerList = (room) => room.order.map((id) => room.players[id]).filter(Boolean);
const activePlayers = (room) => playerList(room).filter((p) => p.online);
const entryList = (room) => Object.values(room.entries);
const entryCount = (room) => Object.keys(room.entries).length;
const picksOf = (room, pid) => entryList(room).filter((e) => e.by.includes(pid));

function bump(room, now) {
  room.v += 1;
  room.updatedAt = now;
}

function requireHost(room, pid) {
  if (room.hostId !== pid) throw new GameError('Only the host can do that', 403);
}

function requirePhase(room, ...phases) {
  if (!phases.includes(room.phase)) throw new GameError('That move is not available right now', 409);
}

function shuffle(list, rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findDuplicate(room, item, exceptId) {
  if (room.settings.kind === 'movie') {
    // Same TMDB id, or the same title (and year, when both have one).
    const key = itemKey(item.title);
    return entryList(room).find((e) => {
      if (e.id === exceptId) return false;
      if (item.tmdbId && e.tmdbId) return item.tmdbId === e.tmdbId;
      return itemKey(e.title) === key && (!e.year || !item.year || e.year === item.year);
    }) || null;
  }
  const key = room.settings.kind === 'artist' ? itemKey(item.title) : songKey(item.title);
  const artist = itemKey(item.artist);
  for (const e of entryList(room)) {
    if (e.id === exceptId) continue;
    if (item.deezerId && e.deezerId) {
      if (item.deezerId === e.deezerId) return e;
      // Different ids can still be the same song (single vs album version).
    }
    const eKey = room.settings.kind === 'artist' ? itemKey(e.title) : songKey(e.title);
    const eArtist = itemKey(e.artist);
    if (eKey === key && (!artist || !eArtist || artist === eArtist)) return e;
  }
  return null;
}

// ---------------------------------------------------------------- rooms & players

// `init` can set the opening rules, e.g. { kind: 'movie' } for a movie night,
// or { game: 'quiz' } for Who Sings It?
export function createRoom(code, now, init = {}) {
  const quiz = init?.game === 'quiz';
  return {
    code,
    game: quiz ? 'quiz' : 'battle',
    createdAt: now,
    updatedAt: now,
    v: 0,
    hostId: null,
    settings: quiz ? cleanQuizSettings(QUIZ_DEFAULTS, init) : cleanSettings(DEFAULT_SETTINGS, init),
    players: {},
    order: [],
    alumni: {},      // players who left, so their picks can still be credited
    entries: {},
    entrySeq: 0,
    phase: 'lobby',
    submit: null,
    battle: null,
    quiz: null,      // Who Sings It?
    loading: false,  // Who Sings It?: the server is finding the songs
    final: null,
  };
}

export function joinRoom(room, input, now) {
  const name = cleanText(input?.name, LIMITS.name);
  if (!name) throw new GameError('Pick a name first');
  const avatar = cleanAvatar(input?.avatar);
  const same = playerList(room).find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (same) {
    if (same.online) throw new GameError(`Someone called ${same.name} is already here. Try a nickname!`, 409);
    // Same name, but that player dropped off: treat it as them coming back on
    // a new phone or a cleared browser, and hand them the seat.
    same.secret = newSecret();
    same.avatar = avatar;
    same.lastSeen = now;
    same.online = true;
    bump(room, now);
    return { player: same, rejoined: true };
  }
  if (room.order.length >= LIMITS.players) throw new GameError('This party is full', 403);
  const player = {
    id: newId(),
    secret: newSecret(),
    name,
    avatar,
    color: COLORS[room.order.length % COLORS.length],
    joinedAt: now,
    lastSeen: now,
    conns: 0,
    online: true,
    ready: false,
  };
  room.players[player.id] = player;
  room.order.push(player.id);
  if (!room.hostId) room.hostId = player.id;
  bump(room, now);
  return { player, rejoined: false };
}

export function authenticate(room, pid, secret) {
  const p = room.players[pid];
  return p && typeof secret === 'string' && p.secret === secret ? p : null;
}

export function connect(room, pid, now) {
  const p = room.players[pid];
  if (!p) return false;
  p.conns += 1;
  p.lastSeen = now;
  if (p.online) return false;
  p.online = true;
  bump(room, now);
  return true;
}

export function disconnect(room, pid, now) {
  const p = room.players[pid];
  if (!p) return;
  p.conns = Math.max(0, p.conns - 1);
  p.lastSeen = now;
  // `online` flips later in tick(), after the grace period.
}

function removePlayer(room, pid, now, rng) {
  const p = room.players[pid];
  if (!p) return;
  room.alumni[pid] = { name: p.name, avatar: p.avatar, color: p.color };
  delete room.players[pid];
  room.order = room.order.filter((id) => id !== pid);
  if (room.phase === 'lobby' || room.phase === 'submit') {
    for (const e of entryList(room)) {
      e.by = e.by.filter((id) => id !== pid);
      if (!e.by.length) delete room.entries[e.id];
    }
  }
  if (room.battle) {
    delete room.battle.votes[pid];
    delete room.battle.guesses[pid];
  }
  forgetPlayer(room, pid);
  if (room.hostId === pid) {
    const next = activePlayers(room)[0] || playerList(room)[0];
    room.hostId = next ? next.id : null;
  }
  settle(room, now, rng);
}

// ---------------------------------------------------------------- phase changes

function startSubmit(room, now) {
  room.phase = 'submit';
  room.submit = {
    startedAt: now,
    endsAt: room.settings.submitSeconds ? now + room.settings.submitSeconds * 1000 : null,
  };
  for (const p of playerList(room)) p.ready = false;
}

function voteDeadline(room, now) {
  return room.settings.voteSeconds ? now + room.settings.voteSeconds * 1000 : null;
}

// ---------------------------------------------------------------- bracket

// Round 1 has a slot for every pick, padded to a power of two with byes
// (null): the first picks drawn get a free pass to round 2. Later rounds
// start empty and fill up as matchups are decided.
function seedBracket(order) {
  let size = 2;
  while (size < order.length) size *= 2;
  const byes = size - order.length;
  const first = [];
  for (let i = 0; i < byes; i++) first.push(order[i], null);
  first.push(...order.slice(byes));
  const rounds = [first];
  for (let n = size / 2; n >= 1; n /= 2) rounds.push(Array(n).fill(null));
  for (let k = 0; k < size / 2; k++) if (first[2 * k + 1] === null) rounds[1][k] = first[2 * k];
  return { size, rounds, at: null };
}

// Rearranges a shuffled order so first-round matchups don't pit someone's
// picks against each other, when it can. The first `byes` picks sit out.
function spreadOwners(order, entries, byes) {
  const out = [...order];
  const clash = (x, y) => entries[x].by.some((pid) => entries[y].by.includes(pid));
  for (let i = byes; i + 1 < out.length; i += 2) {
    if (!clash(out[i], out[i + 1])) continue;
    // Swap the second pick with one further on (or one with a bye) that fits.
    const fits = (j) => {
      if (clash(out[i], out[j])) return false;
      if (j < byes) return true;
      const partner = j % 2 === byes % 2 ? j + 1 : j - 1;
      return !clash(out[i + 1], out[partner]);
    };
    const j = [...out.keys()].find((j) => (j > i + 1 || j < byes) && fits(j));
    if (j !== undefined) [out[i + 1], out[j]] = [out[j], out[i + 1]];
  }
  return out;
}

// The next matchup to play: the earliest round first, top to bottom.
function nextBracketPair(br) {
  for (let r = 0; r < br.rounds.length - 1; r++) {
    const slots = br.rounds[r];
    for (let k = 0; k < slots.length / 2; k++) {
      const [x, y] = [slots[2 * k], slots[2 * k + 1]];
      if (x && y && !br.rounds[r + 1][k]) return { r, k, fighters: [x, y] };
    }
  }
  return null;
}

// ---------------------------------------------------------------- matchups

const isFresh = (b, id) => !b.seen.includes(id);
const owns = (room, pid, id) => !!room.entries[id]?.by.includes(pid);

// What a player still has to do before the matchup can move on.
function todo(room, pid) {
  const b = room.battle;
  if (b.stage !== 'voting') return 0;
  let left = b.votes[pid] ? 0 : 1;
  if (room.settings.scoring) {
    left += b.fighters.filter((id) => isFresh(b, id) && !owns(room, pid, id) && !b.guesses[pid]?.[id]).length;
  }
  return left;
}

function beginMatchup(room, fighters, now) {
  const b = room.battle;
  b.round += 1;
  b.fighters = fighters;
  b.votes = {};
  b.guesses = {};
  b.result = null;
  b.stage = 'voting';
  b.endsAt = voteDeadline(room, now);
}

const addPoints = (b, pid, kind, n, scored) => {
  const p = (b.points[pid] ||= { guess: 0, win: 0, champ: 0 });
  p[kind] += n;
  if (scored) {
    const s = (scored[pid] ||= { guess: 0, win: 0, champ: 0 });
    s[kind] += n;
  }
};

function startBattle(room, now, rng) {
  const s = room.settings;
  let order = shuffle(Object.keys(room.entries), rng);
  if (s.format === 'bracket') {
    let size = 2;
    while (size < order.length) size *= 2;
    order = spreadOwners(order, room.entries, size - order.length);
  }
  room.phase = 'battle';
  room.final = null;
  const b = (room.battle = {
    format: s.format,
    order,                 // every pick, in the order drawn from the hat
    pool: order,           // classic: what's being drawn from now (the champions, later on)
    next: 2,               // classic: index of the next pick to draw from the pool
    round: 0,              // matchups played so far (counts up as each one starts)
    total: order.length - 1, // a pick goes out in every matchup, so N picks take N - 1
    fighters: [],
    champ: null,           // classic: reigning champion, if one is in this matchup
    challenger: null,      // classic: the pick drawn most recently
    stage: 'voting',       // 'voting' -> 'result'
    votes: {},
    guesses: {},           // pid -> { entryId: who they think picked it }
    endsAt: null,
    result: null,
    history: [],
    wins: {},
    champions: null,       // classic: { from: round, ids } once the champions round starts
    bracket: s.format === 'bracket' ? seedBracket(order) : null,
    points: {},            // pid -> { guess, win, champ }
    seen: [],              // picks that have been in a matchup (and so were revealed)
    startedAt: now,
  });
  for (const p of playerList(room)) p.ready = false;
  if (b.bracket) {
    const pair = nextBracketPair(b.bracket);
    b.bracket.at = { r: pair.r, k: pair.k };
    beginMatchup(room, pair.fighters, now);
  } else {
    b.challenger = order[1];
    beginMatchup(room, [order[0], order[1]], now);
  }
}

// Every pick that won at least one matchup, in the order they were drawn.
const championsOf = (b) => b.order.filter((id) => b.wins[id] > 0);

function startChampions(room, now, rng) {
  const b = room.battle;
  const ids = shuffle(championsOf(b), rng);
  b.pool = ids;
  b.next = 2;
  b.total += ids.length - 1;
  b.champions = { from: b.round + 1, ids, before: b.result.winner };
  b.champ = null;
  b.challenger = ids[1];
  beginMatchup(room, [ids[0], ids[1]], now);
}

function closeVoting(room, now, rng) {
  const b = room.battle;
  const s = room.settings;
  const fighters = b.fighters;
  const tally = Object.fromEntries(fighters.map((id) => [id, 0]));
  const votes = {};
  for (const [pid, eid] of Object.entries(b.votes)) {
    if (room.players[pid] && eid in tally) {
      tally[eid] += 1;
      votes[pid] = eid;
    }
  }
  const top = Math.max(...fighters.map((id) => tally[id]));
  const leaders = fighters.filter((id) => tally[id] === top);
  // Brackets settle ties with a coin flip; the other tie rules are for king of the hill.
  const ties = b.bracket ? 'coin' : s.ties;
  let winner = null;
  let survivors = null;
  let method = 'votes';
  if (leaders.length === 1) {
    winner = leaders[0];
  } else if (ties === 'keep' && b.next < b.pool.length && leaders.length < MAX_FIGHTERS) {
    survivors = leaders;   // they all stay in and the next pick joins them
    method = 'keep';
  } else if (ties === 'champ' && b.champ && leaders.includes(b.champ)) {
    winner = b.champ;
    method = 'champ';
  } else {
    winner = leaders[Math.floor(rng() * leaders.length)];
    method = 'coin';
  }
  const losers = fighters.filter((id) => id !== winner && !survivors?.includes(id));
  if (winner) b.wins[winner] = (b.wins[winner] || 0) + 1;
  const tied = leaders.length > 1 ? leaders : null;

  // Points: right guesses on who picked the new picks, and a win for the
  // winner's picker(s).
  const scored = {};
  const guessed = {};
  if (s.scoring) {
    for (const id of fighters.filter((f) => isFresh(b, f))) {
      const right = Object.keys(b.guesses).filter((pid) => room.players[pid] && owns(room, b.guesses[pid][id], id));
      for (const pid of right) addPoints(b, pid, 'guess', POINTS.guess, scored);
      guessed[id] = right;
    }
    if (winner) for (const pid of room.entries[winner].by) addPoints(b, pid, 'win', POINTS.win, scored);
  }
  for (const id of fighters) if (isFresh(b, id)) b.seen.push(id);

  let last;
  let toChampions = 0;
  if (b.bracket) {
    const { r, k } = b.bracket.at;
    b.bracket.rounds[r + 1][k] = winner;
    last = r + 1 === b.bracket.rounds.length - 1;
  } else {
    const empty = !survivors && b.next >= b.pool.length;
    // The hat is empty: on to the champions round, if it's on and there's
    // more than one champion to battle.
    const champions = empty && s.champions && !b.champions ? championsOf(b).length : 0;
    toChampions = champions >= 2 ? champions : 0;
    last = empty && !toChampions;
  }
  if (last && s.scoring) for (const pid of room.entries[winner].by) addPoints(b, pid, 'champ', POINTS.champ, scored);

  b.result = { winner, losers, survivors, tied, tally, votes, method, last, toChampions, guessed, guesses: b.guesses, scored };
  b.history.push({
    round: b.round, fighters: [...fighters], champ: b.champ, winner, losers, survivors, tally, method,
    champions: !!b.champions, bracketRound: b.bracket ? b.bracket.at.r : null,
  });
  b.stage = 'result';
  b.endsAt = null;
}

function nextMatchup(room, now, rng) {
  const b = room.battle;
  const r = b.result;
  if (r.last) {
    room.phase = 'final';
    room.final = { winner: r.winner, at: now };
    return;
  }
  if (r.toChampions) {
    startChampions(room, now, rng);
    return;
  }
  if (b.bracket) {
    const pair = nextBracketPair(b.bracket);
    b.bracket.at = { r: pair.r, k: pair.k };
    beginMatchup(room, pair.fighters, now);
    return;
  }
  const newcomer = b.pool[b.next];
  b.next += 1;
  if (r.survivors) {
    if (!r.survivors.includes(b.champ)) b.champ = null;
    b.challenger = newcomer;
    beginMatchup(room, [...r.survivors, newcomer], now);
  } else {
    b.champ = r.winner;
    b.challenger = newcomer;
    beginMatchup(room, [r.winner, newcomer], now);
  }
}

// Automatic transitions: everyone done adding, everyone voted, timers.
function settle(room, now, rng) {
  if (room.game === 'quiz') return settleQuiz(room, now, rng);
  let changed = false;
  if (room.phase === 'submit') {
    const count = entryCount(room);
    const timeUp = room.submit.endsAt && now >= room.submit.endsAt;
    const active = activePlayers(room);
    const allReady = active.length > 0 && active.every((p) => p.ready);
    if (timeUp && count < 2) {
      room.submit.endsAt = null;   // can't battle with fewer than 2; keep the hat open
      changed = true;
    } else if (count >= 2 && (timeUp || allReady)) {
      startBattle(room, now, rng);
      changed = true;
    }
  }
  if (room.phase === 'battle' && room.battle.stage === 'voting') {
    const b = room.battle;
    const active = activePlayers(room);
    const allDone = active.length > 0 && active.every((p) => todo(room, p.id) === 0);
    if ((b.endsAt && now >= b.endsAt) || allDone) {
      closeVoting(room, now, rng);
      changed = true;
    }
  }
  return changed;
}

// Called about once a second by the server. Returns true if anything a player
// can see has changed.
export function tick(room, now, rng = Math.random) {
  let changed = false;
  for (const p of playerList(room)) {
    const online = p.conns > 0 || now - p.lastSeen < PRESENCE_GRACE_MS;
    if (online !== p.online) {
      p.online = online;
      changed = true;
    }
  }
  const host = room.players[room.hostId];
  if (!host || (!host.online && now - host.lastSeen > HOST_HANDOFF_MS)) {
    const next = activePlayers(room).find((p) => p.id !== room.hostId);
    if (next) {
      room.hostId = next.id;
      changed = true;
    }
  }
  if (settle(room, now, rng)) changed = true;
  if (changed) bump(room, now);
  return changed;
}

// ---------------------------------------------------------------- actions

const SHARED_MOVES = new Set(['profile', 'kick', 'makeHost', 'leave']);

export function act(room, pid, action, now, rng = Math.random) {
  const me = room.players[pid];
  if (!me) throw new GameError('You are not in this party', 403);
  const type = action?.type;
  let out = {};

  // Who Sings It? has its own moves; the shared ones (names, hosts, leaving) are below.
  if (room.game === 'quiz' && !SHARED_MOVES.has(type)) {
    out = quizAct(room, pid, action, now, rng);
    settle(room, now, rng);
    bump(room, now);
    return out;
  }

  switch (type) {
    case 'profile': {
      if (room.game === 'quiz') requirePhase(room, 'lobby');
      else requirePhase(room, 'lobby', 'submit');
      const name = cleanText(action.name, LIMITS.name) || me.name;
      const clash = playerList(room).find((p) => p.id !== pid && p.name.toLowerCase() === name.toLowerCase());
      if (clash) throw new GameError('Someone already has that name');
      me.name = name;
      if (action.avatar) me.avatar = cleanAvatar(action.avatar);
      break;
    }

    case 'settings': {
      requireHost(room, pid);
      requirePhase(room, 'lobby', 'submit');
      const before = room.settings.submitSeconds;
      const patch = { ...action.settings };
      if (room.phase !== 'lobby') delete patch.kind; // can't switch movies/songs/albums/artists mid-game
      room.settings = cleanSettings(room.settings, patch);
      if (room.phase === 'submit' && room.settings.submitSeconds !== before) {
        room.submit.endsAt = room.settings.submitSeconds ? now + room.settings.submitSeconds * 1000 : null;
      }
      if (room.phase === 'submit') {
        for (const p of playerList(room)) {
          if (p.ready && picksOf(room, p.id).length < room.settings.minPerPlayer) p.ready = false;
        }
      }
      break;
    }

    case 'start': {
      requireHost(room, pid);
      requirePhase(room, 'lobby');
      startSubmit(room, now);
      break;
    }

    case 'add': {
      requirePhase(room, 'submit');
      const item = cleanItem(action.item);
      if (room.settings.clean && item.explicit && room.settings.kind !== 'movie') throw new GameError('Clean picks only tonight 🧼 Try the clean version!');
      const mine = picksOf(room, pid);
      const max = room.settings.maxPerPlayer;
      if (max && mine.length >= max) throw new GameError(`That's your limit: ${max} per person`);
      const dupe = findDuplicate(room, item);
      if (dupe) {
        if (dupe.by.includes(pid)) throw new GameError('That one is already in your picks');
        dupe.by.push(pid);
        for (const k of DETAIL_KEYS) dupe[k] ??= item[k];
        if (!dupe.genres.length) dupe.genres = item.genres;
        out = { entryId: dupe.id, notice: 'Great minds! Someone already tossed that one in the hat 🎩' };
        break;
      }
      if (entryCount(room) >= LIMITS.entries) throw new GameError('The hat is stuffed! No more room.');
      room.entrySeq += 1;
      const entry = { id: `m${room.entrySeq}`, kind: room.settings.kind, ...item, by: [pid], at: now };
      room.entries[entry.id] = entry;
      out = { entryId: entry.id, needsDetails: !entry.deezerId && !entry.tmdbId && !entry.cover };
      break;
    }

    case 'remove': {
      requirePhase(room, 'submit');
      const e = room.entries[action.entryId];
      if (!e || !e.by.includes(pid)) throw new GameError("That's not one of your picks");
      e.by = e.by.filter((id) => id !== pid);
      if (!e.by.length) delete room.entries[e.id];
      if (me.ready && picksOf(room, pid).length < room.settings.minPerPlayer) me.ready = false;
      break;
    }

    case 'ready': {
      requirePhase(room, 'submit');
      const ready = !!action.ready;
      const min = room.settings.minPerPlayer;
      if (ready && picksOf(room, pid).length < min) {
        throw new GameError(`Add at least ${min} pick${min === 1 ? '' : 's'} first`);
      }
      me.ready = ready;
      break;
    }

    case 'extend': {
      requireHost(room, pid);
      requirePhase(room, 'submit');
      const secs = clampInt(action.seconds, 10, 600, 60);
      room.submit.endsAt = Math.max(room.submit.endsAt || now, now) + secs * 1000;
      break;
    }

    case 'endSubmit': {
      requireHost(room, pid);
      requirePhase(room, 'submit');
      if (entryCount(room) < 2) throw new GameError('The hat needs at least 2 picks');
      startBattle(room, now, rng);
      break;
    }

    case 'vote': {
      requirePhase(room, 'battle');
      const b = room.battle;
      if (b.stage !== 'voting' || action.round !== b.round) {
        throw new GameError('Voting for that matchup is closed', 409);
      }
      if (!b.fighters.includes(action.entryId)) throw new GameError('Pick one of the choices in this matchup');
      b.votes[pid] = action.entryId;
      break;
    }

    case 'guess': {
      // Points game: who picked this one?
      requirePhase(room, 'battle');
      const b = room.battle;
      if (!room.settings.scoring) throw new GameError('Guessing is off tonight');
      if (b.stage !== 'voting' || action.round !== b.round) throw new GameError('Guessing for that matchup is closed', 409);
      if (!b.fighters.includes(action.entryId) || !isFresh(b, action.entryId)) throw new GameError("You already know who picked that one");
      if (owns(room, pid, action.entryId)) throw new GameError("That's your pick 🤫");
      if (!room.players[action.playerId] || action.playerId === pid) throw new GameError('Pick someone else in the party');
      (b.guesses[pid] ||= {})[action.entryId] = action.playerId;
      break;
    }

    case 'close': {
      requireHost(room, pid);
      requirePhase(room, 'battle');
      const b = room.battle;
      if (b.stage === 'voting' && action.round === b.round) closeVoting(room, now, rng);
      break;
    }

    case 'next': {
      requirePhase(room, 'battle');
      const b = room.battle;
      // Anyone can advance; the round number makes a double tap harmless.
      if (b.stage === 'result' && action.round === b.round) nextMatchup(room, now, rng);
      break;
    }

    case 'rematch': {
      requireHost(room, pid);
      requirePhase(room, 'final');
      startBattle(room, now, rng);
      break;
    }

    case 'again': {
      requireHost(room, pid);
      requirePhase(room, 'final', 'battle', 'submit');
      room.entries = {};
      room.battle = null;
      room.final = null;
      room.submit = null;
      room.phase = 'lobby';
      for (const p of playerList(room)) p.ready = false;
      break;
    }

    case 'kick': {
      requireHost(room, pid);
      if (action.playerId === pid) throw new GameError('Use "Leave party" to leave');
      if (!room.players[action.playerId]) throw new GameError('That player already left');
      removePlayer(room, action.playerId, now, rng);
      out = { removed: action.playerId };
      break;
    }

    case 'makeHost': {
      requireHost(room, pid);
      if (!room.players[action.playerId]) throw new GameError('That player already left');
      room.hostId = action.playerId;
      break;
    }

    case 'leave': {
      removePlayer(room, pid, now, rng);
      out = { removed: pid };
      break;
    }

    default:
      throw new GameError('Unknown move');
  }

  settle(room, now, rng);
  bump(room, now);
  return out;
}

// Who Sings It? starts in two steps, because the server has to find the
// songs in between: the host asks (everyone sees "picking the songs…"), then
// the songs arrive and the first one plays. `songs` never comes from a phone.
export function prepareQuiz(room, pid, now) {
  if (room.game !== 'quiz') throw new GameError('This party is a battle', 409);
  requireHost(room, pid);
  requirePhase(room, 'lobby', 'final');
  if (room.loading) throw new GameError('Already picking the songs 🎵', 409);
  room.loading = true;
  bump(room, now);
  return room.settings;
}

export function playQuiz(room, songs, now, rng = Math.random) {
  try {
    startQuiz(room, songs, now, rng);
  } finally {
    room.loading = false;
    bump(room, now);
  }
}

export function cancelQuiz(room, now) {
  room.loading = false;
  bump(room, now);
}

// Fill in cover/artist/etc. for something typed in by hand, or with
// `replace`, switch a pick to its original release (album, cover, year). If
// the details reveal it's a pick someone else already added, the two merge.
export function applyDetails(room, entryId, details, now, { replace = false } = {}) {
  const e = room.entries[entryId];
  if (!e || room.phase !== 'submit' || !details) return false;
  let item;
  try {
    item = cleanItem({ ...details, title: details.title || e.title });
  } catch {
    return false;
  }
  const twin = findDuplicate(room, item, e.id);
  if (twin) {
    for (const pid of e.by) if (!twin.by.includes(pid)) twin.by.push(pid);
    delete room.entries[e.id];
  } else {
    e.title = item.title;
    for (const k of DETAIL_KEYS) e[k] = replace ? item[k] ?? e[k] : e[k] ?? item[k];
    e.explicit = replace && item.deezerId ? item.explicit : e.explicit || item.explicit;
    if (!e.genres.length) e.genres = item.genres;
  }
  bump(room, now);
  return true;
}

// ---------------------------------------------------------------- views

function personView(room, pid) {
  const p = room.players[pid] || room.alumni[pid];
  return p ? { id: pid, name: p.name, avatar: p.avatar, color: p.color } : null;
}

function entryView(room, e, pid, showBy) {
  return {
    id: e.id,
    title: e.title,
    year: e.year,
    kind: e.kind,
    artist: e.artist,
    album: e.album,
    cover: e.cover,
    deezerId: e.deezerId,
    explicit: e.explicit,
    duration: e.duration,
    tmdbId: e.tmdbId,
    rating: e.rating,
    runtime: e.runtime,
    overview: e.overview,
    genres: e.genres,
    mine: e.by.includes(pid),
    by: showBy ? e.by.map((id) => personView(room, id)).filter(Boolean) : null,
  };
}

// The points game standings: everyone who played, most points first.
function scoreboard(room) {
  const b = room.battle;
  const ids = new Set([...room.order, ...Object.keys(b.points)]);
  return [...ids]
    .map((id) => {
      const p = b.points[id] || { guess: 0, win: 0, champ: 0 };
      return { ...personView(room, id), ...p, total: p.guess + p.win + p.champ };
    })
    .filter((r) => r.id)
    .sort((x, y) => y.total - x.total || y.win + y.champ - (x.win + x.champ));
}

// Points = matchups won by the picks you put in the hat.
function pickerBoard(room) {
  const b = room.battle;
  const score = new Map();
  for (const e of entryList(room)) {
    for (const pid of e.by) {
      const cur = score.get(pid) || { points: 0, champ: false };
      cur.points += b.wins[e.id] || 0;
      if (room.final && room.final.winner === e.id) cur.champ = true;
      score.set(pid, cur);
    }
  }
  return [...score.entries()]
    .map(([pid, s]) => ({ ...personView(room, pid), ...s }))
    .filter((r) => r.id)
    .sort((x, y) => y.points - x.points || Number(y.champ) - Number(x.champ));
}

export function viewFor(room, pid, now) {
  const me = room.players[pid];
  const b = room.battle;
  const s = room.settings;
  const counts = {};
  for (const e of entryList(room)) for (const id of e.by) counts[id] = (counts[id] || 0) + 1;

  const quiz = room.game === 'quiz';
  const view = {
    code: room.code,
    game: room.game,
    v: room.v,
    now,
    phase: room.phase,
    hostId: room.hostId,
    me: me ? { id: me.id, host: room.hostId === me.id } : null,
    settings: s,
    players: playerList(room).map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      color: p.color,
      online: p.online,
      host: p.id === room.hostId,
      count: counts[p.id] || 0,
      ready: room.phase === 'submit' ? p.ready : false,
      // Done with this matchup: voted (and guessed, in the points game).
      // In the quiz: answered this song, or placed a bet.
      voted: quiz ? quizDone(room, p.id) : room.phase === 'battle' && b.stage === 'voting' ? todo(room, p.id) === 0 : false,
    })),
    hatCount: entryCount(room),
    mine: picksOf(room, pid)
      .sort((x, y) => x.at - y.at)
      .map((e) => entryView(room, e, pid, false)),
  };

  if (quiz) {
    view.loading = !!room.loading;
    view.quiz = quizView(room, pid, now);
    if (room.phase === 'final') view.final = { at: room.final.at };
    return view;
  }

  if (room.phase === 'submit') view.submit = { endsAt: room.submit.endsAt, startedAt: room.submit.startedAt };

  if (b && (room.phase === 'battle' || room.phase === 'final')) {
    // King of the hill only sends picks already drawn from the hat; a bracket
    // shows them all (that's the bracket).
    const listed = b.bracket || b.champions ? b.order : b.order.slice(0, b.next);
    const decided = new Set(b.history.flatMap((h) => h.fighters));
    // In the points game, pickers are revealed after each matchup (guessing them is the game).
    const reveal = s.scoring ? 'reveal' : s.reveal;
    const showBy = (id) => reveal === 'open' || (reveal === 'reveal' && (room.phase === 'final' || decided.has(id)));
    view.entries = Object.fromEntries(listed.map((id) => [id, entryView(room, room.entries[id], pid, showBy(id))]));
    const here = activePlayers(room);
    view.battle = {
      format: b.format,
      round: b.round,
      total: b.total,
      left: b.bracket ? b.total - b.round + (b.stage === 'result' ? 0 : 1) : b.pool.length - b.next,
      stage: b.stage,
      endsAt: b.endsAt,
      fighters: b.fighters,
      champ: b.champ,
      challenger: b.challenger,
      bracket: b.bracket,
      // Picks in this matchup for the first time (their pickers are still a secret).
      fresh: b.stage === 'result' ? [] : b.fighters.filter((id) => isFresh(b, id)),
      myGuesses: b.guesses[pid] || {},
      myVote: b.votes[pid] || null,
      todo: room.phase === 'battle' ? todo(room, pid) : 0,
      votedCount: here.filter((p) => todo(room, p.id) === 0).length,
      scores: s.scoring ? scoreboard(room) : null,
      result: b.result
        ? { ...b.result, voters: Object.fromEntries(Object.keys(b.result.votes).map((id) => [id, personView(room, id)])) }
        : null,
      history: b.history,
      wins: b.wins,
      // The champions are listed most wins first, not in the order they'll come up.
      champions: b.champions
        ? { from: b.champions.from, before: b.champions.before, ids: [...b.champions.ids].sort((x, y) => b.wins[y] - b.wins[x]) }
        : null,
      startedAt: b.startedAt,
    };
  }

  if (room.phase === 'final') {
    view.final = {
      winner: room.final.winner,
      at: room.final.at,
      pickers: s.reveal === 'hidden' && !s.scoring ? null : pickerBoard(room),
      scores: s.scoring ? scoreboard(room) : null,
    };
  }
  return view;
}
