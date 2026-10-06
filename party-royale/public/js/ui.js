// Shared building blocks: avatars, covers and posters, previews, sheets, toasts, confetti, timers.
import { html, useState, useEffect, useRef, createContext, useContext } from './lib.js';
import { request } from './api.js';

export const GameCtx = createContext(null);
export const useGame = () => useContext(GameCtx);

export const AVATARS = ['🍿', '🎬', '🎧', '🎸', '🎤', '🥁', '🎹', '🎷', '🎺', '🎻', '🪩', '🦄', '🐸', '🦊', '🐼', '🐯', '🦁', '🐙', '👻', '🤖', '👽', '🤠', '🥷', '🦖', '🐶', '🐱', '🐧', '🦉', '🌈', '⭐', '🔥', '👑', '🧙', '🦸'];
export const randomAvatar = () => AVATARS[Math.floor(Math.random() * AVATARS.length)];

// ------------------------------------------------------------ movies and music

const NOUNS = { movie: ['movie', 'movies'], song: ['song', 'songs'], album: ['album', 'albums'], artist: ['artist', 'artists'] };
export const noun = (kind, n = 1) => (NOUNS[kind] || NOUNS.song)[n === 1 ? 0 : 1];
export const KIND_EMOJI = { movie: '🎬', song: '🎵', album: '💿', artist: '🎤' };
export const isMovie = (m) => m?.kind === 'movie';

const GENRE_EMOJI = {
  // music (Deezer's genres)
  Pop: '🎤', Rock: '🎸', 'Rap/Hip Hop': '🎙️', 'R&B': '💜', Dance: '🪩', Electro: '🎛️', Country: '🤠',
  'Latin Music': '💃', Jazz: '🎷', Classical: '🎻', Metal: '🤘', Reggae: '🌴', 'Soul & Funk': '🕺',
  Alternative: '🎧', Folk: '🪕', Blues: '🎺', 'Films/Games': '🎬', Kids: '🧸',
  // movies (TMDB's genres)
  Action: '💥', Adventure: '🗺️', Animation: '🎨', Comedy: '😂', Crime: '🕵️', Documentary: '🎥',
  Drama: '🎭', Family: '🧸', Fantasy: '🧙', History: '📜', Horror: '👻', Music: '🎵', Mystery: '🔍',
  Romance: '💘', 'Science Fiction': '🚀', Thriller: '🔪', War: '🎖️', Western: '🤠',
};
const coverEmoji = (m) => (m.genres || []).map((g) => GENRE_EMOJI[g]).find(Boolean) || KIND_EMOJI[m.kind] || '🎵';

export const durationText = (sec) => (sec ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` : '');
// Bracket rounds by how many picks are left: "Quarterfinals", "Final"…
export function bracketRoundName(bracket, r) {
  const winners = bracket.rounds[r + 1].length;
  return winners === 1 ? 'Final' : winners === 2 ? 'Semifinals' : winners === 4 ? 'Quarterfinals' : `Round of ${winners * 2}`;
}

// Places for a sorted list, with ties sharing a place: 1, 2, 2, 4.
export function places(list, score) {
  const out = [];
  list.forEach((x, i) => out.push(i && score(x) === score(list[i - 1]) ? out[i - 1] : i + 1));
  return out;
}

// Real matchups in a bracket round (byes don't count), and which one this is.
export function bracketProgress(bracket, r, k) {
  const slots = bracket.rounds[r];
  const real = [];
  for (let i = 0; i < slots.length / 2; i++) if (r > 0 || (slots[2 * i] && slots[2 * i + 1])) real.push(i);
  return { index: real.indexOf(k) + 1, count: real.length };
}

export const runtimeText = (min) => (min ? `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m` : '');

// "Queen · 1975" for songs and albums; the genre for artists; "1975 · Horror" for movies.
export const itemMeta = (m) =>
  m.mystery ? '' : (m.kind === 'artist' ? [m.genres?.[0] || 'Artist'] : m.kind === 'movie' ? [m.year, m.genres?.[0]] : [m.artist, m.year]).filter(Boolean).join(' · ');

// ------------------------------------------------------------ party theme

export const DECADES = [
  ['2020s', '2020s'], ['2010s', '2010s'], ['2000s', '2000s'], ['90s', '90s'], ['80s', '80s'], ['70s', '70s'], ['60s', '60s & older'],
];
export const VIBES = [
  ['party', '🎉 Party'], ['singalong', '🎤 Sing-along'], ['feelgood', '☀️ Feel-good'], ['chill', '😌 Chill'],
  ['workout', '💪 Workout'], ['roadtrip', '🚗 Road trip'], ['love', '💘 Love songs'],
];
const VIBE_WORD = { party: 'party', singalong: 'sing-along', feelgood: 'feel-good', chill: 'chill', workout: 'workout', roadtrip: 'road trip', love: 'love songs' };
const VIBE_EMOJI = { party: '🎉', singalong: '🎤', feelgood: '☀️', chill: '😌', workout: '💪', roadtrip: '🚗', love: '💘' };

// "90s Rock", "80s party", "Road trip", or the name the host gave it.
export const themeParts = (t) => (t ? [t.decade, t.genre, t.vibe && VIBE_WORD[t.vibe]].filter(Boolean) : []);
export function themeTitle(t) {
  if (!t) return null;
  if (t.name) return t.name;
  const text = themeParts(t).join(' ');
  return text[0].toUpperCase() + text.slice(1);
}
// "Only 90s Rock songs get in", when off-theme picks are blocked.
export function themeRule(t, kind) {
  if (!t || (!t.genre && !t.decade)) return null;
  const era = t.decade === '60s' ? '60s or earlier' : t.decade;
  const nouns = noun(kind, 2);
  if (t.genre && t.decade) return `Only ${t.decade} ${t.genre} ${nouns} get in`;
  if (t.genre) return `Only ${t.genre} ${nouns} get in`;
  return `Only ${nouns} from the ${era} get in`;
}
export const themeEmoji = (t) => (t?.vibe ? VIBE_EMOJI[t.vibe] : GENRE_EMOJI[t?.genre] || '🎨');

export function ThemeBanner({ theme, sub }) {
  if (!theme) return null;
  const details = theme.name ? themeParts(theme).join(' · ') : '';
  return html`<div class="theme-banner">
    <span class="theme-emoji" aria-hidden="true">${themeEmoji(theme)}</span>
    <div class="grow">
      <span class="theme-eyebrow">Tonight's theme</span>
      <strong>${themeTitle(theme)}</strong>
      ${details || sub ? html`<span class="theme-sub">${[details, sub].filter(Boolean).join(' · ')}</span>` : null}
    </div>
  </div>`;
}

function hue(text) {
  let h = 7;
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return h % 360;
}

export function itemKey(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/^\s*(the|a|an)\s+/, '')
    .replace(/[^a-z0-9]+/g, '');
}

export function songKey(title) {
  return itemKey(
    String(title || '')
      .replace(/\s*[([](feat\.?|ft\.?|with|remaster|remix|live|acoustic|radio edit|single|album|explicit|clean|mono|stereo|deluxe|bonus|original|\d{4})[^)\]]*[)\]]/gi, '')
      .replace(/\s+-\s+.*\b(remaster(ed)?|live|version|edit|mix|mono|stereo|deluxe)\b.*$/i, ''),
  );
}

// Which of my picks (if any) is this?
export function findPick(mine, m) {
  if (isMovie(m)) {
    const k = itemKey(m.title);
    return mine.find((e) => (m.tmdbId && e.tmdbId ? m.tmdbId === e.tmdbId : itemKey(e.title) === k && (!e.year || !m.year || e.year === m.year)));
  }
  const k = m.kind === 'artist' ? itemKey(m.title) : songKey(m.title);
  const a = itemKey(m.artist);
  return mine.find((e) => {
    if (m.deezerId && e.deezerId && m.deezerId === e.deezerId) return true;
    const ek = e.kind === 'artist' ? itemKey(e.title) : songKey(e.title);
    const ea = itemKey(e.artist);
    return ek === k && (!a || !ea || a === ea);
  });
}

// Real album art or movie poster when we have it; otherwise a bold made-up
// one. Movies are poster-shaped and can show their rating.
export function Cover({ item, tiny, rating, children }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [item.cover]);
  // "Who sings it?": nothing to see yet, just a preview to hear.
  if (item.mystery) {
    return html`<div class="cover cover-fallback mystery ${tiny ? 'tiny-cover' : ''}">
      <span class="cf-emoji">❓</span>
      <span class="cf-title">${tiny ? '' : `Mystery ${noun(item.kind)}`}</span>
      ${children}
    </div>`;
  }
  const movie = isMovie(item);
  const shape = movie ? 'poster' : item.kind === 'artist' ? 'is-artist' : '';
  const badge = movie
    ? rating && item.rating ? html`<span class="rating">★ ${item.rating.toFixed(1)}</span>` : null
    : item.explicit ? html`<span class="explicit" title="Explicit">E</span>` : null;
  if (item.cover && !broken) {
    return html`<div class="cover ${shape}">
      ${badge}<img src=${item.cover} alt="" loading="lazy" decoding="async" onError=${() => setBroken(true)} />${children}
    </div>`;
  }
  return html`<div class="cover cover-fallback ${shape} ${tiny ? 'tiny-cover' : ''}" style=${{ '--h': hue(`${item.title}${item.artist || ''}`) }}>
    ${badge}
    <span class="cf-emoji">${coverEmoji(item)}</span>
    <span class="cf-title">${item.title}</span>
    <span class="cf-artist">${movie ? item.year || '' : item.artist || ''}</span>
    ${children}
  </div>`;
}

// ------------------------------------------------------------ previews

// One shared <audio> element. iPhones only let a page play sound in direct
// response to a tap, so the element is "unlocked" during the tap and the real
// preview (whose link has to be fetched) starts right after.
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
const player = typeof Audio !== 'undefined' ? new Audio() : null;
const urlCache = new Map(); // key -> { url, at }
let playing = null; // { key, state: 'loading' | 'playing' }
let stopTimer = null;
let queue = [];
const previewSubs = new Set();
const emitPreview = () => previewSubs.forEach((fn) => fn(playing));

export const previewKey = (m) => `${m.kind || 'song'}:${m.deezerId || itemKey(`${m.title}${m.artist || ''}`)}`;

async function previewUrl(m) {
  const key = previewKey(m);
  const hit = urlCache.get(key);
  if (hit && Date.now() - hit.at < 10 * 60_000) return hit.url;
  const q = new URLSearchParams({ kind: m.kind || 'song', id: m.deezerId || '', title: m.title, artist: m.artist || '' });
  const { url } = await request(`/api/music/preview?${q}`);
  urlCache.set(key, { url, at: Date.now() });
  return url;
}

// Fetch preview links ahead of time so a tap can start playing instantly.
// (Music only: movies have trailers on the champion screen instead.)
export function prefetchPreviews(items) {
  for (const m of items) if (!isMovie(m)) previewUrl(m).catch(() => {});
}

export function stopPreview() {
  clearTimeout(stopTimer);
  queue = [];
  if (player) {
    player.pause();
    player.removeAttribute('src');
  }
  playing = null;
  emitPreview();
}

async function start(m, seconds) {
  const key = previewKey(m);
  playing = { key, state: 'loading' };
  emitPreview();
  const cached = urlCache.get(key);
  if (!cached && player) {
    player.src = SILENT;
    player.play().catch(() => {});
  }
  try {
    const url = cached?.url ?? (await previewUrl(m));
    if (playing?.key !== key) return;
    if (!url) {
      toast(`No preview for ${m.title} 🤷`, 'error');
      return next();
    }
    player.src = url;
    await player.play();
    if (playing?.key !== key) return;
    playing = { key, state: 'playing' };
    emitPreview();
    clearTimeout(stopTimer);
    if (seconds) stopTimer = setTimeout(next, seconds * 1000);
  } catch {
    if (playing?.key === key) {
      toast("Couldn't play that preview", 'error');
      stopPreview();
    }
  }
}

function next() {
  const m = queue.shift();
  if (m) start(m, 15);
  else stopPreview();
}

if (player) player.addEventListener('ended', () => (queue.length ? next() : stopPreview()));

export function togglePreview(m) {
  if (!player) return;
  const same = playing?.key === previewKey(m);
  stopPreview();
  if (!same) start(m);
}

// Plays ~15 seconds of each, back to back ("play the matchup").
export function playAll(items) {
  items = items.filter((m) => !isMovie(m));
  if (!player || !items.length) return;
  stopPreview();
  queue = items.slice(1);
  start(items[0], 15);
}

export function usePreview() {
  const [state, setState] = useState(playing);
  useEffect(() => {
    previewSubs.add(setState);
    return () => previewSubs.delete(setState);
  }, []);
  return state;
}

const Eq = () => html`<span class="eq" aria-hidden="true"><i /><i /><i /></span>`;

export function PlayButton({ item, big, label }) {
  const state = usePreview();
  if (isMovie(item)) return null;
  const mine = state?.key === previewKey(item) ? state.state : null;
  const tap = (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePreview(item);
  };
  const icon = mine === 'loading' ? html`<span class="spinner small" />` : mine === 'playing' ? html`<${Eq} />` : '▶';
  if (big) {
    return html`<button class="btn btn-gold btn-block btn-xl" onClick=${tap}>
      ${mine === 'playing' ? html`<${Eq} /> Playing… tap to stop` : mine === 'loading' ? 'Loading preview…' : label || '▶ Play a preview'}
    </button>`;
  }
  return html`<button class="play-btn ${mine || ''}" aria-label=${mine === 'playing' ? `Stop ${item.title}` : `Play a preview of ${item.title}`} onClick=${tap}>
    ${icon}
  </button>`;
}

// ------------------------------------------------------------ people

export function Avatar({ p, size = 40, off, badge, crown, className = '' }) {
  if (!p) return null;
  return html`<span
    class="avatar ${off ? 'off' : ''} ${className}"
    style=${{ '--c': p.color || '#a855f7', width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.55)}px` }}
    title=${p.name}
    aria-label=${p.name}
  >${p.avatar}${crown ? html`<span class="crown">👑</span>` : null}${badge ? html`<span class="badge">${badge}</span>` : null}</span>`;
}

export function ProfileForm({ value, onChange, onSubmit }) {
  return html`<div class="stack" style=${{ gap: '20px' }}>
    <label class="field">
      <span class="label">What should we call you?</span>
      <input
        class="input"
        value=${value.name}
        maxlength="20"
        placeholder="e.g. Grandma"
        autocomplete="nickname"
        enterkeyhint="go"
        onInput=${(e) => onChange({ ...value, name: e.target.value })}
        onKeyDown=${(e) => e.key === 'Enter' && onSubmit?.()}
      />
    </label>
    <div class="field">
      <span class="label">Pick your look</span>
      <div class="avatar-grid" role="radiogroup" aria-label="Avatar">
        ${AVATARS.map(
          (a) => html`<button
            type="button"
            class="avatar-pick ${value.avatar === a ? 'on' : ''}"
            role="radio"
            aria-checked=${value.avatar === a}
            aria-label=${a}
            onClick=${() => onChange({ ...value, avatar: a })}
          >${a}</button>`,
        )}
      </div>
    </div>
  </div>`;
}

// ------------------------------------------------------------ controls

export function Stepper({ value, min, max, onChange, format = String, label, disabled }) {
  return html`<div class="stepper" role="group" aria-label=${label}>
    <button type="button" aria-label="Less" disabled=${disabled || value <= min} onClick=${() => onChange(value - 1)}>−</button>
    <output aria-live="polite">${format(value)}</output>
    <button type="button" aria-label="More" disabled=${disabled || value >= max} onClick=${() => onChange(value + 1)}>+</button>
  </div>`;
}

export function Seg({ options, value, onChange, disabled, label, className = '' }) {
  return html`<div class="seg ${className}" role="radiogroup" aria-label=${label} aria-disabled=${disabled ? 'true' : 'false'}>
    ${options.map(
      ([v, text]) => html`<button
        type="button"
        role="radio"
        aria-checked=${v === value}
        class=${v === value ? 'on' : ''}
        disabled=${disabled}
        onClick=${() => v !== value && onChange(v)}
      >${text}</button>`,
    )}
  </div>`;
}

// ------------------------------------------------------------ sheets

export function Sheet({ open, onClose, title, full, className = '', children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);
  if (!open) return null;
  return html`<div class="sheet-backdrop" onClick=${(e) => e.target === e.currentTarget && onClose?.()}>
    <div class="sheet ${full ? 'full' : ''} ${className}" role="dialog" aria-modal="true" aria-label=${title}>
      ${full ? null : html`<div class="sheet-grip" />`}
      ${title
        ? html`<div class="sheet-head">
            <h2>${title}</h2>
            <button class="icon-btn" type="button" onClick=${onClose} aria-label="Close">✕</button>
          </div>`
        : null}
      ${children}
    </div>
  </div>`;
}

// ------------------------------------------------------------ toasts

let toastList = [];
let toastSeq = 0;
const toastListeners = new Set();
const emitToasts = () => toastListeners.forEach((fn) => fn(toastList));

export function toast(text, kind = 'info', ms = 2800) {
  const t = { id: ++toastSeq, text, kind };
  toastList = [...toastList, t].slice(-3);
  emitToasts();
  setTimeout(() => {
    toastList = toastList.filter((x) => x.id !== t.id);
    emitToasts();
  }, ms);
}

export function Toasts() {
  const [list, setList] = useState(toastList);
  useEffect(() => {
    toastListeners.add(setList);
    return () => toastListeners.delete(setList);
  }, []);
  return html`<div class="toasts" role="status" aria-live="polite">
    ${list.map((t) => html`<div key=${t.id} class="toast ${t.kind}">${t.text}</div>`)}
  </div>`;
}

// ------------------------------------------------------------ time

// Server time, ticking. `offset` is a ref holding (server clock - this phone's clock).
export function useNow(offset, every = 500) {
  const read = () => Date.now() + (offset?.current || 0);
  const [now, setNow] = useState(read);
  useEffect(() => {
    const id = setInterval(() => setNow(read()), every);
    return () => clearInterval(id);
  }, [every]);
  return now;
}

export function Countdown({ endsAt, offset, prefix = '⏱' }) {
  const now = useNow(offset, 250);
  const left = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const text = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return html`<span class="pill ${left <= 15 ? 'pill-danger' : 'pill-gold'}" aria-label="${left} seconds left">${prefix} ${text}</span>`;
}

// ------------------------------------------------------------ confetti

export function Confetti({ burst = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    const colors = ['#ff5fa2', '#fcd34d', '#a78bfa', '#67e8f9', '#34d399', '#ffffff', '#fb923c'];
    const bits = Array.from({ length: 170 }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height * 0.7,
      vx: (Math.random() - 0.5) * 3 * dpr,
      vy: (2 + Math.random() * 4) * dpr,
      spin: Math.random() * Math.PI,
      vs: (Math.random() - 0.5) * 0.3,
      w: (6 + Math.random() * 6) * dpr,
      h: (9 + Math.random() * 9) * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const start = performance.now();
    let raf;
    const frame = (t) => {
      const age = t - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, age - 4200) / 1400);
      for (const b of bits) {
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.04 * dpr;
        b.spin += b.vs;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.spin);
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.spin * 1.7)) + 1);
        ctx.restore();
      }
      if (age < 5600) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [burst]);
  return html`<canvas class="confetti" ref=${ref} aria-hidden="true" />`;
}

export const Loading = ({ text = 'Loading' }) => html`<div class="loading">
  <div><span class="hat">🎩</span><span class="dots">${text}</span></div>
</div>`;
