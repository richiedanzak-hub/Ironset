// The champion: confetti, a preview, where to listen, and how it got here.
import { html, useState, useEffect } from './lib.js';
import { request } from './api.js';
import { Avatar, Confetti, Cover, PlayButton, durationText, itemMeta, noun, prefetchPreviews, stopPreview, themeEmoji, themeTitle, useGame } from './ui.js';
import { sfx } from './sfx.js';

const HEADLINE = { song: "Tonight's anthem is…", album: 'Album of the night…', artist: 'Artist of the night…' };

const listNames = (names) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : names[0]);
const bigNumber = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(n));

function ListenCard({ links }) {
  return html`<section class="section card listen">
    <h2>🎧 Listen now</h2>
    <div class="listen-grid">
      <a class="listen-btn spotify" href=${links.spotify} target="_blank" rel="noopener"><span class="dot" />Spotify</a>
      <a class="listen-btn apple" href=${links.apple} target="_blank" rel="noopener"><span class="dot" />Apple Music</a>
      <a class="listen-btn youtube" href=${links.youtube} target="_blank" rel="noopener"><span class="dot" />YouTube</a>
      <a class="listen-btn deezer" href=${links.deezer} target="_blank" rel="noopener"><span class="dot" />Deezer</a>
    </div>
    <p class="attrib">Opens the app if you have it, or the website if you don't.</p>
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
    <div class="section-head"><h2>🏆 Best taste</h2><span class="tag">points = matchups your picks won</span></div>
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
        ${history.map((h, i) => {
          const score = h.fighters.map((id) => h.tally[id]).sort((x, y) => y - x).join('–');
          const kept = h.method === 'keep';
          const top = entries[kept ? h.survivors[0] : h.winner];
          const how = h.method === 'coin' ? (h.fighters.length > 2 ? '🎲' : '🪙') : h.method === 'champ' ? '🤝' : score;
          const divider = h.champions && !history[i - 1]?.champions;
          return html`${divider ? html`<div class="road-divider" key="champions">🏆 Champions round</div>` : null}
          <div class="road-row" key=${h.round}>
            <span class="r">R${h.round}</span>
            <${Cover} item=${top} tiny />
            <span class="grow">
              <span class="w">${kept ? `🤝 ${listNames(h.survivors.map((id) => entries[id].title))} tie` : top.title}</span>
              ${h.losers.length ? html`<br /><span class="l">${h.losers.map((id) => entries[id].title).join(', ')}</span>` : null}
            </span>
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
  const kind = champ.kind || view.settings.kind;
  const [about, setAbout] = useState(null);

  useEffect(() => {
    sfx.fanfare();
    prefetchPreviews([champ]);
    const q = new URLSearchParams({ kind, id: champ.deezerId || '', title: champ.title, artist: champ.artist || '' });
    request(`/api/music/about?${q}`).then(setAbout).catch(() => {});
    return stopPreview;
  }, [view.final.winner]);

  const facts = about?.facts || {};
  const item = { ...champ, cover: facts.cover || champ.cover, year: champ.year || facts.year || null };
  const wins = b.wins[champ.id] || 0;
  const votes = b.history.reduce((n, h) => n + (h.tally[champ.id] || 0), 0);
  const q = encodeURIComponent([champ.title, champ.artist].filter(Boolean).join(' '));
  const links = about?.links || {
    spotify: `https://open.spotify.com/search/${q}`,
    apple: `https://music.apple.com/us/search?term=${q}`,
    youtube: `https://www.youtube.com/results?search_query=${q}`,
    deezer: `https://www.deezer.com/search/${q}`,
  };
  const factPills = [
    facts.album && kind === 'song' ? `💿 ${facts.album}` : null,
    item.year ? `📅 ${item.year}` : null,
    facts.duration ? `⏱ ${durationText(facts.duration)}` : null,
    facts.bpm ? `🥁 ${facts.bpm} BPM` : null,
    facts.tracks ? `🎵 ${facts.tracks} tracks` : null,
    facts.label ? `🏷️ ${facts.label}` : null,
    facts.fans ? `❤️ ${bigNumber(facts.fans)} fans` : null,
    facts.albums ? `💿 ${facts.albums} albums` : null,
  ].filter(Boolean);

  return html`<div>
    <${Confetti} burst=${view.final.winner} />
    <div class="final-hero">
      <div class="rays-wrap" aria-hidden="true"><div class="rays" /></div>
      <p class="eyebrow">${b.champions ? 'Champion of champions…' : HEADLINE[kind]}</p>
      <div class="champ-frame">
        <span class="crown-top" aria-hidden="true">👑</span>
        <span class="sparkle s1" aria-hidden="true">✨</span>
        <span class="sparkle s2" aria-hidden="true">🎵</span>
        <span class="sparkle s3" aria-hidden="true">✨</span>
        <${Cover} item=${item} />
      </div>
      <h1 class="champ-title">${champ.title}</h1>
      <p class="champ-meta">${kind === 'artist' ? itemMeta(item) : champ.artist || ''}</p>
      ${factPills.length ? html`<div class="champ-stats">${factPills.map((t) => html`<span class="pill">${t}</span>`)}</div>` : null}
      ${view.settings.theme || b.champions
        ? html`<div class="champ-stats">
            ${view.settings.theme ? html`<span class="pill">${themeEmoji(view.settings.theme)} ${themeTitle(view.settings.theme)}</span>` : null}
            ${b.champions ? html`<span class="pill pill-gold">🏆 Beat ${b.champions.ids.length - 1} other ${b.champions.ids.length === 2 ? 'champion' : 'champions'}</span>` : null}
          </div>`
        : null}
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
      <div style=${{ marginTop: '20px' }}>
        <${PlayButton} item=${item} big label=${kind === 'song' ? '▶ Play it!' : kind === 'album' ? '▶ Play a track from it' : '▶ Play their top song'} />
      </div>
    </div>

    <div class="section card stats-grid">
      <div><b>${wins}</b><span>${wins === 1 ? 'matchup won' : 'matchups won'}</span></div>
      <div><b>${votes}</b><span>votes earned</span></div>
      <div><b>${Object.keys(E).length}</b><span>${noun(kind, Object.keys(E).length)} in the hat</span></div>
    </div>

    <${ListenCard} links=${links} />
    ${view.final.pickers?.length > 1 ? html`<${Podium} pickers=${view.final.pickers} meId=${view.me.id} />` : null}
    <${Road} history=${b.history} entries=${E} />

    <div class="dock">
      ${view.me.host
        ? html`<div class="row">
            <button class="btn btn-ghost" style=${{ flex: 1 }} onClick=${() => (sfx.whoosh(), act({ type: 'rematch' }))}>🎲 Rematch</button>
            <button class="btn btn-hot" style=${{ flex: 1.4 }} onClick=${() => (sfx.pop(), act({ type: 'again' }))}>🔁 New game</button>
          </div>`
        : html`<div class="card center" style=${{ padding: '14px' }}><strong>🎶 Turn it up!</strong></div>`}
    </div>
  </div>`;
}
