// Shared building blocks: avatars, posters, sheets, toasts, confetti, timers.
import { html, useState, useEffect, useRef, createContext, useContext } from './lib.js';

export const GameCtx = createContext(null);
export const useGame = () => useContext(GameCtx);

export const AVATARS = ['🍿', '🎬', '🦄', '🐸', '🦊', '🐼', '🐯', '🦁', '🐙', '👻', '🤖', '👽', '🧛', '🤠', '🥷', '🦖', '🐶', '🐱', '🐵', '🐧', '🦉', '🐝', '🍕', '🌮', '🍩', '🌈', '⭐', '🔥', '🎸', '👑', '🧙', '🦸'];
export const randomAvatar = () => AVATARS[Math.floor(Math.random() * AVATARS.length)];

// ------------------------------------------------------------ movies

const GENRE_EMOJI = {
  Action: '💥', Adventure: '🗺️', Animation: '🎨', Comedy: '😂', Crime: '🕵️', Documentary: '🎥',
  Drama: '🎭', Family: '🧸', Fantasy: '🧙', History: '📜', Horror: '👻', Music: '🎵', Mystery: '🔍',
  Romance: '💘', 'Science Fiction': '🚀', Thriller: '🔪', War: '🎖️', Western: '🤠',
};
export const genreEmoji = (genres) => (genres || []).map((g) => GENRE_EMOJI[g]).find(Boolean) || '🎬';

export const runtimeText = (min) => (min ? `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m` : '');
export const movieMeta = (m, { runtime = false } = {}) =>
  [m.year, m.genres?.[0], runtime && runtimeText(m.runtime)].filter(Boolean).join(' · ');

function hue(text) {
  let h = 7;
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return h % 360;
}

export function movieKey(title) {
  return String(title || '')
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/^\s*(the|a|an)\s+/, '')
    .replace(/[^a-z0-9]+/g, '');
}

// Which of my picks (if any) is this movie?
export function findPick(mine, m) {
  const k = movieKey(m.title);
  return mine.find((e) =>
    m.tmdbId && e.tmdbId ? m.tmdbId === e.tmdbId : movieKey(e.title) === k && (!e.year || !m.year || e.year === m.year),
  );
}

// Real poster when we have one; otherwise a bold made-up one.
export function Poster({ movie, tiny, rating }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [movie.poster]);
  const badge = rating && movie.rating ? html`<span class="rating">★ ${movie.rating.toFixed(1)}</span>` : null;
  if (movie.poster && !broken) {
    return html`<div class="poster">
      ${badge}<img src=${movie.poster} alt="" loading="lazy" decoding="async" onError=${() => setBroken(true)} />
    </div>`;
  }
  return html`<div class="poster poster-fallback ${tiny ? 'tiny-poster' : ''}" style=${{ '--h': hue(movie.title || '') }}>
    ${badge}
    <span class="pf-emoji" style=${badge ? { alignSelf: 'flex-end' } : null}>${genreEmoji(movie.genres)}</span>
    <span class="pf-title">${movie.title}</span>
    <span class="pf-year">${movie.year || ''}</span>
  </div>`;
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

export function Seg({ options, value, onChange, disabled, label }) {
  return html`<div class="seg" role="radiogroup" aria-label=${label} aria-disabled=${disabled ? 'true' : 'false'}>
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
