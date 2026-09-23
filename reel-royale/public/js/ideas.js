// The brainstorm helper: browse movies by list, genre, era and streaming
// service, and toss any of them into the hat with one tap.
import { html, useState, useEffect, useRef } from './lib.js';
import { request, region } from './api.js';
import { Poster, Sheet, findPick, movieKey, movieMeta, toast } from './ui.js';

const LISTS = [
  ['popular', '🔥 Popular'],
  ['top', '🏆 Top rated'],
  ['trending', '📈 Trending'],
  ['gems', '💎 Hidden gems'],
  ['surprise', '🎲 Surprise me'],
];

const ERAS = [
  ['2020s', '2020s'],
  ['2010s', '2010s'],
  ['2000s', '2000s'],
  ['1990s', '90s'],
  ['1980s', '80s'],
  ['1970s', '70s'],
  ['classic', 'Classics'],
];

const keyOf = (m) => `${m.tmdbId || movieKey(m.title)}:${m.year || ''}`;
const dedupe = (list) => {
  const seen = new Set();
  return list.filter((m) => !seen.has(keyOf(m)) && seen.add(keyOf(m)));
};
const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function IdeaCard({ m, pick, full, onAdd, onRemove }) {
  const [busy, setBusy] = useState(false);
  const click = async () => {
    setBusy(true);
    await (pick ? onRemove(pick) : onAdd(m));
    setBusy(false);
  };
  return html`<div class="idea">
    <${Poster} movie=${m} rating />
    <div class="idea-title">${m.title}</div>
    <div class="idea-meta">${movieMeta(m)}</div>
    <button class="add-btn ${pick ? 'on' : ''}" disabled=${busy || (!pick && full)} onClick=${click}>
      ${pick ? '✓ In the hat' : full ? 'Limit reached' : '+ Add'}
    </button>
  </div>`;
}

export function IdeasSheet({ open, onClose, mine, full, onAdd, onRemove, countText }) {
  const [meta, setMeta] = useState(null);
  const [list, setList] = useState('popular');
  const [genres, setGenres] = useState([]);
  const [era, setEra] = useState(null);
  const [providers, setProviders] = useState([]);
  const [family, setFamily] = useState(false);
  const [short, setShort] = useState(false);
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

  useEffect(() => {
    if (open && !meta) {
      request(`/api/movies/meta?region=${region}`)
        .then(setMeta)
        .catch(() => setMeta({ genres: [], providers: [] }));
    }
  }, [open]);

  const params = (p) =>
    new URLSearchParams({
      list,
      genres: genres.join(','),
      era: era || '',
      providers: providers.join(','),
      region,
      family: family ? '1' : '',
      short: short ? '1' : '',
      page: String(p),
    });

  const query = q.trim();
  const searching = query.length >= 2;
  const filterKey = JSON.stringify([list, genres, era, providers, family, short, searching ? query : '', seed]);

  useEffect(() => {
    if (!open) return;
    let live = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = searching
          ? { ...(await request(`/api/movies/search?q=${encodeURIComponent(query)}`)), page: 1, pages: 1 }
          : await request(`/api/movies/browse?${params(1)}`);
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
      const data = await request(`/api/movies/browse?${params(page + 1)}`);
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

  const filterCount = genres.length + (era ? 1 : 0) + providers.length;
  const clearFilters = () => {
    setGenres([]);
    setEra(null);
    setProviders([]);
    setFamily(false);
    setShort(false);
  };

  return html`<${Sheet} open=${open} onClose=${onClose} title="Movie ideas ✨" full>
    <div>
      <div class="input-icon">
        <span>🔍</span>
        <input class="input" type="search" placeholder="Search any movie" value=${q} autocomplete="off" enterkeyhint="search"
          aria-label="Search movies" onInput=${(e) => setQ(e.target.value)} />
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
          🎛️ Filters ${filterCount ? html`<span class="count">${filterCount}</span>` : null}
        </button>
        <button class="chip soft ${family ? 'on' : ''}" onClick=${() => setFamily(!family)}>👪 Family friendly</button>
        <button class="chip soft ${short ? 'on' : ''}" onClick=${() => setShort(!short)}>⏱ Under 2 hours</button>
      </div>
    </div>

    <div class="ideas-body" ref=${body}>
      ${panel
        ? html`<div class="filter-panel">
            <h3>Genre</h3>
            <div class="wrap-chips">
              ${(meta?.genres || []).map(
                (g) => html`<button class="chip ${genres.includes(g) ? 'on' : ''}" key=${g} onClick=${() => setGenres(toggle(genres, g))}>${g}</button>`,
              )}
            </div>
            <h3>Released</h3>
            <div class="wrap-chips">
              <button class="chip ${!era ? 'on' : ''}" onClick=${() => setEra(null)}>Any time</button>
              ${ERAS.map(([v, label]) => html`<button class="chip ${era === v ? 'on' : ''}" key=${v} onClick=${() => setEra(era === v ? null : v)}>${label}</button>`)}
            </div>
            ${meta?.providers?.length
              ? html`<h3>Streaming on (${region})</h3>
                  <div class="wrap-chips">
                    ${meta.providers.map(
                      (p) => html`<button class="chip ${providers.includes(p.id) ? 'on' : ''}" key=${p.id} onClick=${() => setProviders(toggle(providers, p.id))}>
                        ${p.logo ? html`<img src=${p.logo} alt="" />` : null}${p.name}
                      </button>`,
                    )}
                  </div>`
              : null}
            <div class="row" style=${{ marginTop: '14px' }}>
              <button class="btn btn-quiet btn-sm" onClick=${clearFilters}>Clear all</button>
              <div class="spacer" />
              <button class="btn btn-white btn-sm" onClick=${() => setPanel(false)}>Show movies</button>
            </div>
          </div>`
        : null}
      ${!loading && !items.length
        ? html`<div class="empty" style=${{ marginTop: '18px' }}><span class="big">🤷</span>No movies match that. Try loosening the filters.</div>`
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
        ${source === 'tmdb'
          ? 'Movie info from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.'
          : source === 'offline'
            ? 'Browsing the built-in movie list. Search still finds any movie.'
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
