// The champion: confetti, where to watch it, and how it got here.
import { html, useState, useEffect } from './lib.js';
import { request, region as myRegion } from './api.js';
import { Avatar, Confetti, Poster, runtimeText, useGame } from './ui.js';
import { sfx } from './sfx.js';

const REGIONS = ['US', 'CA', 'GB', 'IE', 'AU', 'NZ', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'BR', 'MX', 'IN', 'JP', 'KR', 'ZA'];
const flag = (code) => String.fromCodePoint(...[...code].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));

function ProviderRow({ title, list, link }) {
  if (!list?.length) return null;
  return html`<div class="watch-group">
    <h3>${title}</h3>
    <div class="providers">
      ${list.map(
        (p) => html`<a class="provider" key=${p.id} href=${link} target="_blank" rel="noopener">
          ${p.logo ? html`<img src=${p.logo} alt="" loading="lazy" />` : null}
          <span>${p.name}</span>
        </a>`,
      )}
    </div>
  </div>`;
}

function WatchCard({ movie, onDetails }) {
  const [region, setRegion] = useState(myRegion);
  const [data, setData] = useState(null);

  useEffect(() => {
    let live = true;
    setData(null);
    const q = new URLSearchParams({ tmdbId: movie.tmdbId || '', title: movie.title, year: movie.year || '', region });
    request(`/api/movies/watch?${q}`)
      .then((d) => {
        if (!live) return;
        setData(d);
        if (d.details) onDetails?.(d.details);
      })
      .catch(() => live && setData({ failed: true }));
    return () => {
      live = false;
    };
  }, [movie.id, region]);

  const regions = REGIONS.includes(region) ? REGIONS : [region, ...REGIONS];
  const any = data && [data.stream, data.free, data.rent, data.buy].some((l) => l?.length);
  const links = data?.links || {
    justwatch: `https://www.justwatch.com/${region === 'GB' ? 'uk' : region.toLowerCase()}/search?q=${encodeURIComponent(movie.title)}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(`where to watch ${movie.title} ${movie.year || ''}`)}`,
    trailer: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} ${movie.year || ''} trailer`)}`,
  };
  const money = (v, cur) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur || 'USD' }).format(v);
    } catch {
      return `$${v}`;
    }
  };

  return html`<section class="section card watch">
    <div class="row">
      <h2>📺 Where to watch</h2>
      <div class="spacer" />
      <select class="select" aria-label="Country" value=${region} onChange=${(e) => setRegion(e.target.value)}>
        ${regions.map((c) => html`<option value=${c}>${flag(c)} ${c}</option>`)}
      </select>
    </div>

    ${!data
      ? html`<div class="watch-group"><div class="skeleton" /></div>`
      : any
        ? html`<div>
            <${ProviderRow} title="Stream it" list=${data.stream} link=${data.link} />
            <${ProviderRow} title="Free" list=${data.free} link=${data.link} />
            <${ProviderRow} title="Rent" list=${data.rent} link=${data.link} />
            <${ProviderRow} title="Buy" list=${data.buy} link=${data.link} />
          </div>`
        : data.source === 'tmdb'
          ? html`<p class="muted small" style=${{ marginTop: '12px', fontWeight: 700 }}>Not on any streaming service in this country right now. Try the links below.</p>`
          : null}

    ${data?.apple?.url
      ? html`<a class="btn btn-white btn-block" style=${{ marginTop: '16px' }} href=${data.apple.url} target="_blank" rel="noopener">
          ${data.apple.rent ? `Rent ${money(data.apple.rent, data.apple.currency)}` : data.apple.buy ? `Buy ${money(data.apple.buy, data.apple.currency)}` : 'Find it'} on Apple TV
        </a>`
      : null}

    <div class="watch-links">
      <a class="btn btn-hot wide" href=${links.trailer} target="_blank" rel="noopener">▶ Watch the trailer</a>
      <a class="btn btn-ghost" href=${links.justwatch} target="_blank" rel="noopener">🔎 JustWatch</a>
      <a class="btn btn-ghost" href=${links.google} target="_blank" rel="noopener">🌐 Google it</a>
    </div>
    <p class="attrib">
      ${data?.source === 'tmdb' ? 'Streaming info by JustWatch, via TMDB.' : 'Streaming services change often, so tap JustWatch for the latest.'}
    </p>
  </section>`;
}

function Podium({ pickers, meId }) {
  const top = pickers.slice(0, 3);
  const spots = [
    [top[1], 'second', 2],
    [top[0], 'first', 1],
    [top[2], 'third', 3],
  ];
  return html`<section class="section">
    <div class="section-head"><h2>🏆 Best taste</h2><span class="tag">points = matchups your movies won</span></div>
    <div class="card">
      <div class="podium">
        ${spots.map(([p, cls, n]) =>
          p
            ? html`<div class="podium-spot ${cls}" key=${cls}>
                <${Avatar} p=${p} crown=${p.champ} />
                <span class="name">${p.id === meId ? 'You' : p.name}</span>
                <span class="pts">⭐ ${p.points}</span>
                <div class="podium-block">${n}</div>
              </div>`
            : html`<div key=${cls} />`,
        )}
      </div>
      ${pickers.length > 3
        ? html`<div class="road" style=${{ marginTop: '14px' }}>
            ${pickers.slice(3).map(
              (p, i) => html`<div class="road-row" key=${p.id}>
                <span class="r">#${i + 4}</span><${Avatar} p=${p} size=${28} />
                <span class="grow w">${p.id === meId ? 'You' : p.name}</span><span class="score">⭐ ${p.points}</span>
              </div>`,
            )}
          </div>`
        : null}
    </div>
  </section>`;
}

function Road({ history, entries }) {
  return html`<section class="section">
    <details class="fold card">
      <summary class="row">
        <h2 style=${{ fontSize: '1.15rem' }}>⚔️ The road to the crown</h2>
        <div class="spacer" />
        <span class="tag muted small" style=${{ fontWeight: 800 }}>${history.length} ${history.length === 1 ? 'matchup' : 'matchups'} <span class="chev">›</span></span>
      </summary>
      <div class="road" style=${{ marginTop: '14px' }}>
        ${history.map((h) => {
          const w = entries[h.winner];
          const l = entries[h.loser];
          const how = h.method === 'coin' ? '🪙' : h.method === 'champ' ? '🤝' : `${h.tally[h.winner]}–${h.tally[h.loser]}`;
          return html`<div class="road-row" key=${h.round}>
            <span class="r">R${h.round}</span>
            <${Poster} movie=${w} tiny />
            <span class="grow"><span class="w">${w.title}</span><br /><span class="l">${l.title}</span></span>
            <span class="score">${how}</span>
          </div>`;
        })}
      </div>
    </details>
  </section>`;
}

export function Final() {
  const { view, act } = useGame();
  const b = view.battle;
  const E = view.entries;
  const champ = E[view.final.winner];
  const [extra, setExtra] = useState(null);

  useEffect(() => {
    sfx.fanfare();
  }, [view.final.winner]);

  const wins = b.wins[champ.id] || 0;
  const votes = b.history.reduce((n, h) => n + (h.tally[champ.id] || 0), 0);
  const missing = (v) => v == null || (Array.isArray(v) && !v.length);
  const movie = { ...champ, ...(extra ? Object.fromEntries(Object.entries(extra).filter(([k, v]) => !missing(v) && missing(champ[k]))) : {}) };

  return html`<div>
    <${Confetti} burst=${view.final.winner} />
    <div class="final-hero">
      <div class="rays-wrap" aria-hidden="true"><div class="rays" /></div>
      <p class="eyebrow">Tonight's movie is…</p>
      <div class="champ-frame">
        <span class="crown-top" aria-hidden="true">👑</span>
        <span class="sparkle s1" aria-hidden="true">✨</span>
        <span class="sparkle s2" aria-hidden="true">⭐</span>
        <span class="sparkle s3" aria-hidden="true">✨</span>
        <${Poster} movie=${movie} rating />
      </div>
      <h1 class="champ-title">${movie.title}</h1>
      <p class="champ-meta">${[movie.year, movie.genres?.slice(0, 2).join(' · '), runtimeText(movie.runtime)].filter(Boolean).join(' · ')}</p>
      ${champ.by?.length
        ? html`<div class="champ-stats">
            <span class="pill pill-gold">
              ${champ.by.slice(0, 3).map((p) => html`<${Avatar} key=${p.id} p=${p} size=${22} />`)}
              Picked by ${champ.by.map((p) => (p.id === view.me.id ? 'you' : p.name)).join(' & ')}
            </span>
          </div>`
        : champ.mine
          ? html`<div class="champ-stats"><span class="pill pill-gold">🤫 Psst… this was your pick</span></div>`
          : null}
    </div>

    <div class="section card stats-grid">
      <div><b>${wins}</b><span>${wins === 1 ? 'matchup won' : 'matchups won'}</span></div>
      <div><b>${votes}</b><span>votes earned</span></div>
      <div><b>${b.total + 1}</b><span>movies in the hat</span></div>
    </div>

    <${WatchCard} movie=${champ} onDetails=${setExtra} />
    ${view.final.pickers?.length > 1 ? html`<${Podium} pickers=${view.final.pickers} meId=${view.me.id} />` : null}
    <${Road} history=${b.history} entries=${E} />

    <div class="dock">
      ${view.me.host
        ? html`<div class="row">
            <button class="btn btn-ghost" style=${{ flex: 1 }} onClick=${() => (sfx.whoosh(), act({ type: 'rematch' }))}>🎲 Rematch</button>
            <button class="btn btn-hot" style=${{ flex: 1.4 }} onClick=${() => (sfx.pop(), act({ type: 'again' }))}>🔁 New game</button>
          </div>`
        : html`<div class="card center" style=${{ padding: '14px' }}><strong>🍿 Grab the popcorn!</strong></div>`}
    </div>
  </div>`;
}
