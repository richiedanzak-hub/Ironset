// Filling the hat: search or type a title, browse ideas, remove picks, "I'm done".
import { html, useState, useEffect } from './lib.js';
import { request } from './api.js';
import { Avatar, Countdown, Cover, PlayButton, findPick, itemKey, itemMeta, noun, stopPreview, toast, useGame } from './ui.js';
import { IdeasSheet } from './ideas.js';
import { sfx } from './sfx.js';

const itemFields = (m) => ({
  title: m.title,
  artist: m.artist ?? null,
  album: m.album ?? null,
  year: m.year ?? null,
  cover: m.cover ?? null,
  deezerId: m.deezerId ?? null,
  genres: m.genres || [],
  explicit: !!m.explicit,
  duration: m.duration ?? null,
});

const PLACEHOLDER = { song: 'Search a song or artist…', album: 'Search an album…', artist: 'Search an artist or band…' };

function SearchBox({ onAdd, mine, full, kind, clean }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    let live = true;
    setLoading(true);
    const t = setTimeout(() => {
      request(`/api/music/search?${new URLSearchParams({ kind, q: query, clean: clean ? '1' : '' })}`)
        .then((d) => live && setResults(d.results))
        .catch(() => live && setResults([]))
        .finally(() => live && setLoading(false));
    }, 280);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [q]);

  const pick = async (m) => {
    if (await onAdd(m)) {
      setQ('');
      setResults(null);
    }
  };
  const addTyped = () => {
    const typed = q.trim();
    if (!typed) return;
    const exact = results?.find((m) => itemKey(m.title) === itemKey(typed) || itemKey(`${m.title}${m.artist || ''}`) === itemKey(typed));
    pick(exact || { title: typed });
  };

  const typed = q.trim();
  const open = focused && typed.length >= 2;
  return html`<div class="search-wrap">
    <div class="input-icon">
      <span>🔍</span>
      <input
        class="input"
        type="search"
        placeholder=${full ? "You've hit the limit" : PLACEHOLDER[kind]}
        value=${q}
        disabled=${full}
        autocomplete="off"
        enterkeyhint="done"
        aria-label="Add a pick"
        onInput=${(e) => setQ(e.target.value)}
        onFocus=${() => setFocused(true)}
        onBlur=${() => setFocused(false)}
        onKeyDown=${(e) => e.key === 'Enter' && addTyped()}
      />
    </div>
    ${open
      ? html`<div class="suggest" role="listbox" onMouseDown=${(e) => e.preventDefault()}>
          ${loading && !results ? html`<div class="load-more"><div class="spinner" /></div>` : null}
          ${(results || []).map((m) => {
            const had = findPick(mine, m);
            return html`<button class="suggest-item" key=${`${m.deezerId || m.title}-${m.artist}`} disabled=${!!had} onClick=${() => pick(m)}>
              <${Cover} item=${m} tiny />
              <span class="grow"><strong>${m.title}${m.explicit ? html` <span class="e-tag">E</span>` : null}</strong><span>${itemMeta(m) || noun(kind)}</span></span>
              <span class="plus ${had ? 'done' : ''}">${had ? '✓' : '+'}</span>
            </button>`;
          })}
          ${results && !results.length ? html`<div class="suggest-empty">No matches. You can still add it as typed 👇</div>` : null}
          <button class="suggest-item" onClick=${addTyped}>
            <span class="how-num" style=${{ width: '40px', height: '40px', fontSize: '20px', borderRadius: '10px' }}>✍️</span>
            <span class="grow"><strong>Add “${typed}”</strong><span>Exactly as typed</span></span>
            <span class="plus">+</span>
          </button>
        </div>`
      : null}
  </div>`;
}

export function Submit() {
  const { view, act, offset } = useGame();
  const s = view.settings;
  const me = view.players.find((p) => p.id === view.me.id);
  const mine = view.mine;
  const [ideas, setIdeas] = useState(false);
  useEffect(() => stopPreview, []);
  const full = s.maxPerPlayer > 0 && mine.length >= s.maxPerPlayer;
  const need = Math.max(0, s.minPerPlayer - mine.length);
  const waiting = view.players.filter((p) => p.online && !p.ready);

  const add = async (m, { quiet = false } = {}) => {
    const out = await act({ type: 'add', item: itemFields(m) });
    if (!out) return false;
    sfx.drop();
    if (!out.notice && !quiet) toast(`🎩 ${m.title} is in the hat!`, 'good', 1600);
    return true;
  };
  const remove = async (entry) => {
    sfx.tap();
    return !!(await act({ type: 'remove', entryId: entry.id }));
  };
  const setReady = (ready) => {
    if (ready) sfx.pop();
    else sfx.tap();
    act({ type: 'ready', ready });
  };
  const endNow = () => {
    const notDone = waiting.filter((p) => p.id !== view.me.id).length;
    if (notDone && !confirm(`${notDone} ${notDone === 1 ? 'person is' : 'people are'} still adding. Close the hat anyway?`)) return;
    act({ type: 'endSubmit' });
  };

  const limitText = s.maxPerPlayer
    ? s.minPerPlayer
      ? `Add ${s.minPerPlayer === s.maxPerPlayer ? s.maxPerPlayer : `${s.minPerPlayer} to ${s.maxPerPlayer}`} ${noun(s.kind, 2)}`
      : `Add up to ${s.maxPerPlayer} ${noun(s.kind, 2)}`
    : s.minPerPlayer
      ? `Add at least ${s.minPerPlayer}, as many as you like`
      : 'Add as many as you like';

  return html`<div>
    <div class="card card-glow hat-meter">
      <span class="hat-icon bump" key=${view.hatCount}>🎩</span>
      <div class="grow">
        <div class="hat-count">${view.hatCount}<small>${noun(s.kind, view.hatCount)} in the hat</small></div>
      </div>
      ${view.submit.endsAt ? html`<${Countdown} endsAt=${view.submit.endsAt} offset=${offset} />` : null}
    </div>

    <h1 class="screen-title section" style=${{ marginTop: '22px' }}>Toss in your ${noun(s.kind, 2)}</h1>
    <p class="screen-sub">${limitText}. Your picks stay secret until they're drawn 🤫</p>

    <div class="stack section" style=${{ marginTop: '16px' }}>
      <${SearchBox} onAdd=${add} mine=${mine} full=${full} kind=${s.kind} clean=${s.clean} />
      <button class="ideas-cta" onClick=${() => (sfx.tap(), setIdeas(true))}>
        <span class="big">✨</span>
        <span><strong>Need ideas?</strong><span>Today's charts, classics, genres, decades & vibes</span></span>
        <span class="chev">›</span>
      </button>
    </div>

    <section class="section">
      <div class="section-head">
        <h2>Your picks</h2>
        <span class="tag">${mine.length}${s.maxPerPlayer ? ` / ${s.maxPerPlayer}` : ''}${need ? ` · ${need} more to go` : ''}</span>
      </div>
      ${mine.length
        ? html`<div class="pick-list">
            ${mine.map(
              (e) => html`<div class="pick" key=${e.id}>
                <${Cover} item=${e} tiny />
                <div class="grow"><strong>${e.title}</strong><span>${itemMeta(e) || 'Added as typed'}</span></div>
                <${PlayButton} item=${e} />
                <button class="x" aria-label=${`Remove ${e.title}`} onClick=${() => remove(e)}>✕</button>
              </div>`,
            )}
          </div>`
        : html`<div class="empty"><span class="big">🎧</span>Your ${noun(s.kind, 2)} show up here. Only you can see them.</div>`}
    </section>

    <section class="section">
      <div class="section-head"><h2>The crew</h2><span class="tag">${view.players.filter((p) => p.ready).length} of ${view.players.filter((p) => p.online).length} done</span></div>
      <div class="crew-list">
        ${view.players.map(
          (p) => html`<span class="crew-chip ${p.ready ? 'ready' : ''}" key=${p.id} style=${{ opacity: p.online ? 1 : 0.5 }}>
            <${Avatar} p=${p} size=${30} off=${!p.online} />
            ${p.id === view.me.id ? 'You' : p.name}
            <span class="n">${p.ready ? '✓' : `${p.count} 🎶`}</span>
          </span>`,
        )}
      </div>
      ${view.me.host
        ? html`<div class="host-tools">
            ${view.submit.endsAt ? html`<button class="btn btn-ghost btn-sm" onClick=${() => act({ type: 'extend', seconds: 60 })}>⏱ +1 min</button>` : null}
            <button class="btn btn-ghost btn-sm" disabled=${view.hatCount < 2} onClick=${endNow}>🎩 Close the hat now</button>
          </div>`
        : null}
    </section>

    <div class="dock">
      ${me?.ready
        ? html`<div>
            <button class="btn btn-ghost btn-block btn-xl" onClick=${() => setReady(false)}>✓ You're done · add more?</button>
            <p class="dock-note">
              ${waiting.length
                ? html`<span class="dots">Waiting on ${waiting.map((p) => p.name).slice(0, 3).join(', ')}${waiting.length > 3 ? ` +${waiting.length - 3}` : ''}</span>`
                : view.hatCount < 2
                  ? 'The hat needs at least 2 picks'
                  : 'Starting…'}
            </p>
          </div>`
        : html`<button class="btn btn-mint btn-block btn-xl" disabled=${need > 0} onClick=${() => setReady(true)}>
            ${need > 0 ? `Add ${need} more to finish` : "I'm done adding ✓"}
          </button>`}
    </div>

    <${IdeasSheet}
      open=${ideas}
      kind=${s.kind}
      clean=${s.clean}
      onClose=${() => setIdeas(false)}
      mine=${mine}
      full=${full}
      onAdd=${(m) => add(m, { quiet: true })}
      onRemove=${remove}
      countText=${`${mine.length}${s.maxPerPlayer ? ` of ${s.maxPerPlayer}` : ''} picked`}
    />
  </div>`;
}
