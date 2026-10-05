// Beat Royale game engine.
//
// A room is a plain object. Everything in here is synchronous and depends only
// on the arguments (`now` for time, `rng` for randomness), so the rules can be
// tested without a server. The server owns sockets, timers and persistence and
// calls `act`, `tick`, `connect` and `disconnect`.
//
// Phases:  lobby -> submit -> battle -> final
//   lobby   players gather, the host sets the house rules
//   submit  everyone tosses songs (or albums, or artists) into the hat, secretly
//   battle  king of the hill: two picks face off, the group votes, the winner
//           stays on and faces the next pick drawn from the hat
//   final   the last pick standing is crowned

import { randomBytes } from 'node:crypto';

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
  kind: 'song',        // what's being battled: 'song' | 'album' | 'artist' (set in the lobby)
  clean: false,        // true = no explicit songs or albums
});

export const KINDS = ['song', 'album', 'artist'];

const REVEAL = ['hidden', 'reveal', 'open'];
const TIES = ['coin', 'champ', 'keep'];
export const MAX_FIGHTERS = 4;      // a 'keep' tie can grow a matchup up to a 4-way
const COLORS = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#fb923c', '#f87171', '#22d3ee', '#c084fc', '#a3e635'];
const COVER_RE = /^https:\/\/([\w-]+\.dzcdn\.net|is\d+-ssl\.mzstatic\.com)\/[\w\-./%]+$/;

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
  return s && [...s].length <= 4 ? s : '🎧';
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

// "Bohemian Rhapsody - Remastered 2011" and "Bohemian Rhapsody (Live)" are the
// same song for this game.
export function songKey(title) {
  return itemKey(
    String(title || '')
      .replace(/\s*[([](feat\.?|ft\.?|with|remaster|remix|live|acoustic|radio edit|single|album|explicit|clean|mono|stereo|deluxe|bonus|original|\d{4})[^)\]]*[)\]]/gi, '')
      .replace(/\s+-\s+.*\b(remaster(ed)?|live|version|edit|mix|mono|stereo|deluxe)\b.*$/i, ''),
  );
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
  };
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
  if (KINDS.includes(p.kind)) next.kind = p.kind;
  if (typeof p.clean === 'boolean') next.clean = p.clean;
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

export function createRoom(code, now) {
  return {
    code,
    createdAt: now,
    updatedAt: now,
    v: 0,
    hostId: null,
    settings: { ...DEFAULT_SETTINGS },
    players: {},
    order: [],
    alumni: {},      // players who left, so their picks can still be credited
    entries: {},
    entrySeq: 0,
    phase: 'lobby',
    submit: null,
    battle: null,
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
  if (room.battle) delete room.battle.votes[pid];
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

function startBattle(room, now, rng) {
  const order = shuffle(Object.keys(room.entries), rng);
  room.phase = 'battle';
  room.final = null;
  room.battle = {
    order,
    next: 2,               // index of the next pick to draw from the hat
    round: 1,
    total: order.length - 1, // every round after the first draws exactly one pick
    fighters: [order[0], order[1]],
    champ: null,           // reigning champion, if one is in this matchup
    challenger: order[1],  // the pick drawn most recently
    stage: 'voting',
    votes: {},
    endsAt: voteDeadline(room, now),
    result: null,
    history: [],
    wins: {},
    startedAt: now,
  };
  for (const p of playerList(room)) p.ready = false;
}

function closeVoting(room, now, rng) {
  const b = room.battle;
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
  const ties = room.settings.ties;
  let winner = null;
  let survivors = null;
  let method = 'votes';
  if (leaders.length === 1) {
    winner = leaders[0];
  } else if (ties === 'keep' && b.next < b.order.length && leaders.length < MAX_FIGHTERS) {
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
  b.result = { winner, losers, survivors, tied, tally, votes, method, last: !survivors && b.next >= b.order.length };
  b.history.push({ round: b.round, fighters: [...fighters], champ: b.champ, winner, losers, survivors, tally, method });
  b.stage = 'result';
  b.endsAt = null;
}

function nextMatchup(room, now) {
  const b = room.battle;
  const r = b.result;
  if (r.last) {
    room.phase = 'final';
    room.final = { winner: r.winner, at: now };
    return;
  }
  const newcomer = b.order[b.next];
  b.next += 1;
  if (r.survivors) {
    b.fighters = [...r.survivors, newcomer];
    if (!r.survivors.includes(b.champ)) b.champ = null;
  } else {
    b.fighters = [r.winner, newcomer];
    b.champ = r.winner;
  }
  b.challenger = newcomer;
  b.round += 1;
  b.stage = 'voting';
  b.votes = {};
  b.result = null;
  b.endsAt = voteDeadline(room, now);
}

// Automatic transitions: everyone done, everyone voted, timers.
function settle(room, now, rng) {
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
    const allVoted = active.length > 0 && active.every((p) => b.votes[p.id]);
    if ((b.endsAt && now >= b.endsAt) || allVoted) {
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

export function act(room, pid, action, now, rng = Math.random) {
  const me = room.players[pid];
  if (!me) throw new GameError('You are not in this party', 403);
  const type = action?.type;
  let out = {};

  switch (type) {
    case 'profile': {
      requirePhase(room, 'lobby', 'submit');
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
      if (room.phase !== 'lobby') delete patch.kind; // can't switch songs/albums/artists mid-game
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
      if (room.settings.clean && item.explicit) throw new GameError('Clean picks only tonight 🧼 Try the clean version!');
      const mine = picksOf(room, pid);
      const max = room.settings.maxPerPlayer;
      if (max && mine.length >= max) throw new GameError(`That's your limit: ${max} per person`);
      const dupe = findDuplicate(room, item);
      if (dupe) {
        if (dupe.by.includes(pid)) throw new GameError('That one is already in your picks');
        dupe.by.push(pid);
        for (const k of ['artist', 'album', 'year', 'cover', 'deezerId', 'duration']) dupe[k] ??= item[k];
        if (!dupe.genres.length) dupe.genres = item.genres;
        out = { entryId: dupe.id, notice: 'Great minds! Someone already tossed that one in the hat 🎩' };
        break;
      }
      if (entryCount(room) >= LIMITS.entries) throw new GameError('The hat is stuffed! No more room.');
      room.entrySeq += 1;
      const entry = { id: `m${room.entrySeq}`, kind: room.settings.kind, ...item, by: [pid], at: now };
      room.entries[entry.id] = entry;
      out = { entryId: entry.id, needsDetails: !entry.deezerId && !entry.cover };
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
      if (b.stage === 'result' && action.round === b.round) nextMatchup(room, now);
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

// Fill in cover/artist/etc. for something typed in by hand. If the details
// reveal it's a pick someone else already added, the two merge.
export function applyDetails(room, entryId, details, now) {
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
    for (const k of ['artist', 'album', 'year', 'cover', 'deezerId', 'duration']) e[k] = e[k] ?? item[k];
    e.explicit = e.explicit || item.explicit;
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
    genres: e.genres,
    mine: e.by.includes(pid),
    by: showBy ? e.by.map((id) => personView(room, id)).filter(Boolean) : null,
  };
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

  const view = {
    code: room.code,
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
      voted: room.phase === 'battle' && b.stage === 'voting' ? !!b.votes[p.id] : false,
    })),
    hatCount: entryCount(room),
    mine: picksOf(room, pid)
      .sort((x, y) => x.at - y.at)
      .map((e) => entryView(room, e, pid, false)),
  };

  if (room.phase === 'submit') view.submit = { endsAt: room.submit.endsAt, startedAt: room.submit.startedAt };

  if (b && (room.phase === 'battle' || room.phase === 'final')) {
    // Only picks already drawn from the hat are sent; the rest stay a surprise.
    const drawn = b.order.slice(0, b.next);
    const decided = new Set(b.history.flatMap((h) => h.fighters));
    const showBy = (id) => s.reveal === 'open' || (s.reveal === 'reveal' && (room.phase === 'final' || decided.has(id)));
    view.entries = Object.fromEntries(drawn.map((id) => [id, entryView(room, room.entries[id], pid, showBy(id))]));
    view.battle = {
      round: b.round,
      total: b.total,
      left: b.order.length - b.next,
      stage: b.stage,
      endsAt: b.endsAt,
      fighters: b.fighters,
      champ: b.champ,
      challenger: b.challenger,
      myVote: b.votes[pid] || null,
      votedCount: Object.keys(b.votes).filter((id) => room.players[id]).length,
      result: b.result
        ? { ...b.result, voters: Object.fromEntries(Object.keys(b.result.votes).map((id) => [id, personView(room, id)])) }
        : null,
      history: b.history,
      wins: b.wins,
      startedAt: b.startedAt,
    };
  }

  if (room.phase === 'final') {
    view.final = {
      winner: room.final.winner,
      pickers: s.reveal === 'hidden' ? null : pickerBoard(room),
    };
  }
  return view;
}
