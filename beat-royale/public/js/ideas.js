// The brainstorm helper: browse today's charts, classics, genres, decades and
// vibes, hear a preview, and toss anything into the hat with one tap.
import { html, useState, useEffect, useRef } from './lib.js';
import { request } from './api.js';
import { Cover, PlayButton, Sheet, findPick, itemKey, itemMeta, noun, stopPreview, toast } from './ui.js';

const LISTS = [
  ['top', '🔥 Top charts'],
  ['new', '🆕 New'],
  ['classics', '🏆 All-time classics'],
  ['surprise', '🎲 Surprise me'],
];

const DECADES = [
  ['2020s', '2020s'],
  ['2010s', '2010s'],
  ['2000s', '2000s'],
  ['90s', '90s'],
  ['80s', '80s'],
  ['70s', '70s'],
  ['60s', '60s & older'],
];

const VIBES = [
  ['party', '🎉 Party'],
  ['singalong', '🎤 Sing-along'],
  ['feelgood', '☀️ Feel-good'],
  ['chill', '😌 Chill'],
  ['workout', '💪 Workout'],
  ['roadtrip', '🚗 Road trip'],
  ['love', '💘 Love songs'],
];

const keyOf = (m) => `${m.deezerId || itemKey(m.title)}:${itemKey(m.artist)}`;
const dedupe = (list) => {
  const seen = new Set();
  return list.filter((m) => !seen.has(keyOf(m)) && seen.add(keyOf(m)));
};

function IdeaCard({ m, pick, full, onAdd, onRemove }) {
  const [busy, setBusy] = useState(false);
  const click = async () => {
    setBusy(true);
    await (pick ? onRemove(pick) : onAdd(m));
    setBusy(false);
  };
  return html`<div class="idea">
    <${Cover} item=${m}><${PlayButton} item=${m} /></${Cover}>
    <div class="idea-title">${m.title}</div>
    <div class="idea-meta">${itemMeta(m)}</div>
    <button class="add-btn ${pick ? 'on' : ''}" disabled=${busy || (!pick && full)} onClick=${click}>
      ${pick ? '✓ In the hat' : full ? 'Limit reached' : '+ Add'}
    </button>
  </div>`;
}

export function IdeasSheet({ open, onClose, kind, clean: houseClean, mine, full, onAdd, onRemove, countText }) {
  const [meta, setMeta] = useState(null);
  const [list, setList] = useState('top');
  const [genre, setGenre] = useState(null);
  const [decade, setDecade] = useState(null);
  const [vibe, setVibe] = useState(null);
  const [cleanPick, setCleanPick] = useState(false);
  const [panel, setPanel] = useState(false);
  const [q, setQ] = useState('');
  const [seed, setSeed] = useState(0);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);
  const body = useRef(null);
  const sentinel = useRef(null);
  const more = useRef(null);
  const clean = houseClean || cleanPick;

  useEffect(() => {
    if (open && !meta) {
      request('/api/music/meta')
        .then(setMeta)
        .catch(() => setMeta({ genres: [] }));
    }
    if (!open) stopPreview();
  }, [open]);

  const params = (p) =>
    new URLSearchParams({ kind, list, genre: genre || '', decade: decade || '', vibe: vibe || '', clean: clean ? '1' : '', page: String(p) });

  const query = q.trim();
  const searching = query.length >= 2;
  const filterKey = JSON.stringify([kind, list, genre, decade, vibe, clean, searching ? query : '', seed]);

  useEffect(() => {
    if (!open) return;
    let live = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = searching
          ? { ...(await request(`/api/music/search?${new URLSearchParams({ kind, q: query, clean: clean ? '1' : '' })}`)), page: 1, pages: 1 }
          : await request(`/api/music/browse?${params(1)}`);
        if (!live) return;
        setItems(dedupe(data.results));
        setPage(1);
        setPages(data.pages || 1);
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
    if (loading || searching || page >= pages) return;
    setLoading(true);
    try {
      const data = await request(`/api/music/browse?${params(page + 1)}`);
      setItems((prev) => dedupe([...prev, ...data.results]));
      setPage(page + 1);
      setPages(data.pages || 1);
    } catch {}
    setLoading(false);
  };

  // Load the next page before the bottom scrolls into view.
  useEffect(() => {
    if (!open || !body.current || !sentinel.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && more.current(), { root: body.current, rootMargin: '600px 0px' });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [open, items.length > 0]);

  const filterCount = (genre ? 1 : 0) + (decade ? 1 : 0) + (vibe ? 1 : 0);
  const clearFilters = () => {
    setGenre(null);
    setDecade(null);
    setVibe(null);
  };
  const one = (current, set, v) => set(current === v ? null : v);
  const shown = filterCount ? [genre, DECADES.find(([v]) => v === decade)?.[1], VIBES.find(([v]) => v === vibe)?.[1]].filter(Boolean).join(' · ') : '';

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
              if (v === 'surprise' && list === 'surprise') setSeed(seed + 1);
              setList(v);
            }}>${label}</button>`,
        )}
      </div>
      <div class="chips" style=${{ marginTop: '8px', opacity: searching ? 0.45 : 1 }}>
        <button class="chip soft ${panel || filterCount ? 'on' : ''}" onClick=${() => setPanel(!panel)} aria-expanded=${panel}>
          🎛️ ${shown || 'Genre, decade & vibe'} ${filterCount ? html`<span class="count">${filterCount}</span>` : null}
        </button>
        ${kind !== 'artist'
          ? html`<button class="chip soft ${clean ? 'on' : ''}" disabled=${houseClean} onClick=${() => setCleanPick(!cleanPick)}>
              ${houseClean ? '🔒' : '🧼'} Clean only
            </button>`
          : null}
      </div>
    </div>

    <div class="ideas-body" ref=${body}>
      ${panel
        ? html`<div class="filter-panel">
            <h3>Genre</h3>
            <div class="wrap-chips">
              ${(meta?.genres || []).map(
                (g) => html`<button class="chip ${genre === g ? 'on' : ''}" key=${g} onClick=${() => one(genre, setGenre, g)}>${g}</button>`,
              )}
            </div>
            <h3>Decade</h3>
            <div class="wrap-chips">
              ${DECADES.map(([v, label]) => html`<button class="chip ${decade === v ? 'on' : ''}" key=${v} onClick=${() => one(decade, setDecade, v)}>${label}</button>`)}
            </div>
            <h3>Vibe</h3>
            <div class="wrap-chips">
              ${VIBES.map(([v, label]) => html`<button class="chip ${vibe === v ? 'on' : ''}" key=${v} onClick=${() => one(vibe, setVibe, v)}>${label}</button>`)}
            </div>
            <div class="row" style=${{ marginTop: '14px' }}>
              <button class="btn btn-quiet btn-sm" onClick=${clearFilters}>Clear all</button>
              <div class="spacer" />
              <button class="btn btn-white btn-sm" onClick=${() => setPanel(false)}>Show ${noun(kind, 2)}</button>
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
        ${loading ? html`<div class="spinner" />` : items.length && !searching && page >= pages ? "That's the whole list!" : null}
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
      <button class="btn btn-hot" onClick=${onClose}>Done</button>
    </div>
  </${Sheet}>`;
}
