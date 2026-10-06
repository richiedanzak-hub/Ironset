// The brainstorm helper: browse today's charts, classics, genres, decades and
// vibes, hear a preview, and toss anything into the hat with one tap. Lists
// never really end (the server keeps finding more), and when the host set a
// theme, its genre, decade and vibe are locked in.
import { html, useState, useEffect, useRef } from './lib.js';
import { request } from './api.js';
import { Cover, DECADES, PlayButton, Sheet, VIBES, findPick, itemKey, itemMeta, noun, stopPreview, themeTitle, toast } from './ui.js';

const LISTS = [
  ['top', '🔥 Top charts'],
  ['new', '🆕 New'],
  ['classics', '🏆 All-time classics'],
  ['surprise', '🎲 Surprise me'],
];

// Each phone gets its own shuffle of every list, kept while the page is open.
const PHONE_SEED = Math.random().toString(36).slice(2, 10);

const keyOf = (m) => `${m.deezerId || itemKey(m.title)}:${itemKey(m.artist)}`;
const dedupe = (list) => {
  const seen = new Set();
  return list.filter((m) => !seen.has(keyOf(m)) && seen.add(keyOf(m)));
};

function IdeaCard({ m, pick, full, onAdd, onRemove }) {
  const [busy, setBusy] = useState(false);
  const [offTheme, setOffTheme] = useState(null);
  const click = async () => {
    setBusy(true);
    const out = await (pick ? onRemove(pick) : onAdd(m));
    if (out?.offTheme) setOffTheme(out.offTheme);
    setBusy(false);
  };
  return html`<div class="idea ${offTheme ? 'off-theme' : ''}">
    <${Cover} item=${m}><${PlayButton} item=${m} /></${Cover}>
    <div class="idea-title">${m.title}</div>
    <div class="idea-meta">${offTheme ? `🚫 ${offTheme}` : itemMeta(m)}</div>
    <button class="add-btn ${pick ? 'on' : ''}" disabled=${busy || !!offTheme || (!pick && full)} onClick=${click}>
      ${pick ? '✓ In the hat' : offTheme ? 'Off theme' : busy ? 'Checking…' : full ? 'Limit reached' : '+ Add'}
    </button>
  </div>`;
}

export function IdeasSheet({ open, onClose, kind, clean: houseClean, theme, mine, full, onAdd, onRemove, countText }) {
  const [meta, setMeta] = useState(null);
  const [list, setList] = useState('top');
  const [pickGenre, setGenre] = useState(null);
  const [pickDecade, setDecade] = useState(null);
  const [pickVibe, setVibe] = useState(null);
  const [cleanPick, setCleanPick] = useState(false);
  const [panel, setPanel] = useState(false);
  const [q, setQ] = useState('');
  const [shuffles, setShuffles] = useState(0);
  const [items, setItems] = useState([]);
  const [next, setNext] = useState(0);       // how far into the list the server has sent us
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);
  const [hidden, setHidden] = useState(0);
  const body = useRef(null);
  const sentinel = useRef(null);
  const more = useRef(null);
  const tries = useRef(0);
  const clean = houseClean || cleanPick;
  // The host's theme wins over the player's own filters.
  const genre = theme?.genre || pickGenre;
  const decade = theme?.decade || pickDecade;
  const vibe = theme?.vibe || pickVibe;
  const seed = `${PHONE_SEED}${shuffles || ''}`;

  useEffect(() => {
    if (open && !meta) {
      request('/api/music/meta')
        .then(setMeta)
        .catch(() => setMeta({ genres: [] }));
    }
    if (!open) stopPreview();
  }, [open]);

  const params = (offset) =>
    new URLSearchParams({ kind, list, genre: genre || '', decade: decade || '', vibe: vibe || '', clean: clean ? '1' : '', seed, offset: String(offset) });

  const query = q.trim();
  const searching = query.length >= 2;
  const filterKey = JSON.stringify([kind, list, genre, decade, vibe, clean, searching ? query : '', seed]);
  const liveKey = useRef(filterKey);
  liveKey.current = filterKey;

  useEffect(() => {
    if (!open) return;
    let live = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = searching
          ? { ...(await request(`/api/music/search?${new URLSearchParams({ kind, q: query, clean: clean ? '1' : '' })}`)), more: false }
          : await request(`/api/music/browse?${params(0)}`);
        if (!live) return;
        setItems(dedupe(data.results));
        setNext(data.next || 0);
        setHasMore(!!data.more);
        setHidden(data.hidden || 0);
        tries.current = 0;
        if (data.source) setSource(data.source);
        body.current?.scrollTo?.({ top: 0 });
      } catch (err) {
        if (live) {
          setItems([]);
          toast(err.message, 'error');
        }
      } finally {
        if (live) setLoading(false);
      }
    }, searching ? 300 : 0);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [open, filterKey]);

  more.current = async () => {
    if (loading || searching || !hasMore) return;
    setLoading(true);
    const key = filterKey;
    const stale = () => key !== liveKey.current;
    try {
      const data = await request(`/api/music/browse?${params(next)}`);
      if (stale()) return;
      setItems((prev) => dedupe([...prev, ...data.results]));
      setNext(data.next ?? next);
      // The server sometimes needs another go to find more; give it a few.
      tries.current = data.results.length ? 0 : tries.current + 1;
      setHasMore(!!data.more && tries.current < 4);
    } catch {
      if (stale()) return;
      tries.current += 1;
      setHasMore(tries.current < 4);
    } finally {
      if (!stale()) setLoading(false);
    }
  };

  // Load more before the bottom scrolls into view.
  useEffect(() => {
    if (!open || !body.current || !sentinel.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && more.current(), { root: body.current, rootMargin: '600px 0px' });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [open, items.length > 0]);

  // If a load didn't push the bottom out of reach, keep going.
  useEffect(() => {
    if (!open || loading || !hasMore || !body.current || !sentinel.current) return;
    const gap = sentinel.current.getBoundingClientRect().top - body.current.getBoundingClientRect().bottom;
    if (gap < 600) {
      const t = setTimeout(() => more.current(), tries.current ? 900 : 50);
      return () => clearTimeout(t);
    }
  }, [open, loading, hasMore, items.length]);

  const locked = { genre: !!theme?.genre, decade: !!theme?.decade, vibe: !!theme?.vibe };
  const filterCount = (genre ? 1 : 0) + (decade ? 1 : 0) + (vibe ? 1 : 0);
  // With the filters open, the bottom button closes them (not the whole sheet).
  const closePanel = () => {
    setPanel(false);
    body.current?.scrollTo?.({ top: 0 });
  };
  const clearFilters = () => {
    setGenre(null);
    setDecade(null);
    setVibe(null);
  };
  const one = (k, current, set, v) => !locked[k] && set(current === v ? null : v);
  const shown = filterCount ? [genre, DECADES.find(([v]) => v === decade)?.[1], VIBES.find(([v]) => v === vibe)?.[1]].filter(Boolean).join(' · ') : '';
  const lockNote = html`<span class="lock-note">🔒 Set by the theme</span>`;

  return html`<${Sheet} open=${open} onClose=${onClose} title=${`${noun(kind)[0].toUpperCase()}${noun(kind).slice(1)} ideas ✨`} full>
    <div>
      <div class="input-icon">
        <span>🔍</span>
        <input class="input" type="search" placeholder=${`Search any ${noun(kind)}`} value=${q} autocomplete="off" enterkeyhint="search"
          aria-label="Search music" onInput=${(e) => setQ(e.target.value)} />
      </div>
      <div class="chips" style=${{ marginTop: '12px', opacity: searching ? 0.45 : 1 }}>
        ${LISTS.map(
          ([v, label]) => html`<button class="chip ${list === v ? 'on' : ''}" key=${v}
            onClick=${() => {
              setQ('');
              if (v === list) setShuffles(shuffles + 1);
              setList(v);
            }}>${label}</button>`,
        )}
      </div>
      <div class="chips" style=${{ marginTop: '8px', opacity: searching ? 0.45 : 1 }}>
        <button class="chip soft ${panel || filterCount ? 'on' : ''}" aria-expanded=${panel}
          onClick=${() => {
            if (!panel) body.current?.scrollTo?.({ top: 0 });
            setPanel(!panel);
          }}>
          ${theme && (theme.genre || theme.decade || theme.vibe) ? '🔒' : '🎛️'} ${shown || 'Genre, decade & vibe'}
          ${filterCount ? html`<span class="count">${filterCount}</span>` : null}
        </button>
        <button class="chip soft" onClick=${() => (setQ(''), setShuffles(shuffles + 1))} aria-label="Shuffle the list">🔀 Shuffle</button>
        ${kind !== 'artist'
          ? html`<button class="chip soft ${clean ? 'on' : ''}" disabled=${houseClean} onClick=${() => setCleanPick(!cleanPick)}>
              ${houseClean ? '🔒' : '🧼'} Clean only
            </button>`
          : null}
      </div>
    </div>

    <div class="ideas-body" ref=${body}>
      ${theme ? html`<p class="theme-line">🎨 Theme: <strong>${themeTitle(theme)}</strong></p>` : null}
      ${panel
        ? html`<div class="filter-panel">
            <h3>Genre ${locked.genre ? lockNote : null}</h3>
            <div class="wrap-chips">
              ${(locked.genre ? [genre] : meta?.genres || []).map(
                (g) => html`<button class="chip ${genre === g ? 'on' : ''}" key=${g} disabled=${locked.genre} onClick=${() => one('genre', genre, setGenre, g)}>${g}</button>`,
              )}
            </div>
            <h3>Decade ${locked.decade ? lockNote : null}</h3>
            <div class="wrap-chips">
              ${DECADES.filter(([v]) => !locked.decade || v === decade).map(
                ([v, label]) => html`<button class="chip ${decade === v ? 'on' : ''}" key=${v} disabled=${locked.decade} onClick=${() => one('decade', decade, setDecade, v)}>${label}</button>`,
              )}
            </div>
            <h3>Vibe ${locked.vibe ? lockNote : null}</h3>
            <div class="wrap-chips">
              ${VIBES.filter(([v]) => !locked.vibe || v === vibe).map(
                ([v, label]) => html`<button class="chip ${vibe === v ? 'on' : ''}" key=${v} disabled=${locked.vibe} onClick=${() => one('vibe', vibe, setVibe, v)}>${label}</button>`,
              )}
            </div>
            <div class="row" style=${{ marginTop: '14px' }}>
              <button class="btn btn-quiet btn-sm" onClick=${clearFilters}>${theme ? 'Clear mine' : 'Clear all'}</button>
            </div>
          </div>`
        : null}
      ${!loading && !items.length
        ? html`<div class="empty" style=${{ marginTop: '18px' }}><span class="big">🤷</span>Nothing matches that. Try loosening the filters.</div>`
        : null}
      <div class="idea-grid">
        ${items.map(
          (m) => html`<${IdeaCard} key=${keyOf(m)} m=${m} pick=${findPick(mine, m)} full=${full} onAdd=${onAdd} onRemove=${onRemove} />`,
        )}
      </div>
      <div class="load-more" ref=${sentinel}>
        ${loading
          ? html`<div class="spinner" />`
          : items.length && !searching && !hasMore
            ? html`<span>That's all for this one! Tap <strong>🔀 Shuffle</strong> or try another list.</span>`
            : searching && hidden
              ? `🧼 ${hidden} explicit ${hidden === 1 ? 'result' : 'results'} hidden`
              : null}
      </div>
      <p class="source-note">
        ${source === 'deezer'
          ? 'Charts, covers and previews from Deezer.'
          : source === 'offline'
            ? "Showing the built-in list (couldn't reach Deezer). Search still works."
            : null}
      </p>
    </div>

    <div class="ideas-foot">
      <strong>🎩 ${countText}</strong>
      <div class="spacer" />
      ${panel
        ? html`<button class="btn btn-white" onClick=${closePanel}>Show ${noun(kind, 2)}</button>`
        : html`<button class="btn btn-hot" onClick=${onClose}>Done</button>`}
    </div>
  </${Sheet}>`;
}
