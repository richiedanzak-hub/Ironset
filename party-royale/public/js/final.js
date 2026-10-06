// The champion: confetti, a preview, where to listen, everyone's picks and
// how it got here. The same recap shows past parties saved on this phone.
import { html, useState, useEffect, useMemo } from './lib.js';
import { request, region as myRegion } from './api.js';
import { ScoreList } from './battle.js';
import { Avatar, Confetti, Cover, PlayButton, bracketRoundName, durationText, isMovie, places, itemMeta, noun, prefetchPreviews, runtimeText, stopPreview, themeEmoji, themeTitle, useGame } from './ui.js';
import { saveParty, snapshot } from './past.js';
import { sfx } from './sfx.js';

const HEADLINE = { movie: "Tonight's movie is…", song: "Tonight's anthem is…", album: 'Album of the night…', artist: 'Artist of the night…' };

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

// ------------------------------------------------------------ movies: where to watch

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

// ------------------------------------------------------------ podium, picks, road

export function Podium({ pickers, meId, title = '🏆 Best taste', tag = 'points = matchups your picks won', icon = '⭐' }) {
  const top = pickers.slice(0, 3);
  const at = places(pickers, (p) => p.points);
  const spots = [
    [top[1], 'second', at[1]],
    [top[0], 'first', at[0]],
    [top[2], 'third', at[2]],
  ];
  return html`<section class="section">
    <div class="section-head"><h2>${title}</h2><span class="tag">${tag}</span></div>
    <div class="card">
      <div class="podium">
        ${spots.map(([p, cls, n]) =>
          p
            ? html`<div class="podium-spot ${cls}" key=${cls}>
                <${Avatar} p=${p} crown=${p.champ} />
                <span class="name">${p.id === meId ? 'You' : p.name}</span>
                <span class="pts">${icon} ${p.points}</span>
                <div class="podium-block">${n}</div>
              </div>`
            : html`<div key=${cls} />`,
        )}
      </div>
      ${pickers.length > 3
        ? html`<div class="road" style=${{ marginTop: '14px' }}>
            ${pickers.slice(3).map(
              (p, i) => html`<div class="road-row" key=${p.id}>
                <span class="r">#${at[i + 3]}</span><${Avatar} p=${p} size=${28} />
                <span class="grow w">${p.id === meId ? 'You' : p.name}</span><span class="score">${icon} ${p.points}</span>
              </div>`,
            )}
          </div>`
        : null}
    </div>
  </section>`;
}

// How far a pick got: the crown, the champions round, wins, and when it went out.
function fateOf(id, data) {
  const { history, wins, champions } = data.battle;
  const w = wins[id] || 0;
  const out = [...history].reverse().find((h) => h.losers.includes(id));
  const crowned = id === data.final.winner;
  const inChamps = !!champions?.ids.includes(id);
  const text = crowned
    ? '👑 Champion'
    : [
        inChamps ? '🏆 Champions round' : null,
        w ? `⭐ ${w} ${w === 1 ? 'win' : 'wins'}` : null,
        out ? (data.battle.bracket && out.bracketRound != null ? `out in the ${bracketRoundName(data.battle.bracket, out.bracketRound)}` : `out in round ${out.round}`) : null,
      ]
        .filter(Boolean)
        .join(' · ');
  return { crowned, text, sort: [crowned ? 0 : 1, inChamps ? 0 : 1, -w, -(out?.round || 0)] };
}

// Best result first: the champion, then the champions round, then most wins.
const byFate = (data) => (x, y) => {
  const a = fateOf(x.id, data).sort;
  const b = fateOf(y.id, data).sort;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
};

function PickRow({ e, data, person }) {
  const fate = fateOf(e.id, data);
  const others = (e.by || []).filter((p) => p.id !== person?.id);
  return html`<div class="pick-row ${fate.crowned ? 'crowned' : ''}">
    <${Cover} item=${e} tiny />
    <span class="grow">
      <span class="w">${e.title}</span>
      <span class="sub">${[isMovie(e) ? e.year : e.artist, fate.text].filter(Boolean).join(' · ')}</span>
      ${others.length ? html`<span class="sub">🤝 Also picked by ${listNames(others.map((p) => (p.id === data.meId ? 'you' : p.name)))}</span>` : null}
    </span>
    <${PlayButton} item=${e} />
  </div>`;
}

function EveryonesPicks({ data }) {
  const all = Object.values(data.entries);
  const kind = data.settings.kind;
  if (!data.final.pickers) {
    const mine = all.filter((e) => e.mine).sort(byFate(data));
    if (!mine.length) return null;
    return html`<section class="section">
      <div class="section-head"><h2>🤫 Your picks</h2><span class="tag">picks stayed secret tonight</span></div>
      <div class="card picks-card">${mine.map((e) => html`<${PickRow} key=${e.id} e=${e} data=${data} />`)}</div>
    </section>`;
  }
  return html`<section class="section">
    <div class="section-head"><h2>🎶 Everyone's picks</h2><span class="tag">${all.length} ${noun(kind, all.length)}</span></div>
    <div class="stack">
      ${data.final.pickers.map((p) => {
        const picks = all.filter((e) => e.by?.some((x) => x.id === p.id)).sort(byFate(data));
        return html`<div class="card picks-card" key=${p.id}>
          <div class="picks-head">
            <${Avatar} p=${p} size=${36} crown=${p.champ} />
            <strong class="grow">${p.id === data.meId ? 'You' : p.name}</strong>
            <span class="tag">${picks.length} ${noun(kind, picks.length)} · ⭐ ${p.points}</span>
          </div>
          ${picks.map((e) => html`<${PickRow} key=${e.id} e=${e} data=${data} person=${p} />`)}
        </div>`;
      })}
    </div>
  </section>`;
}

function Road({ history, entries, bracket }) {
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
          // Bracket rounds get a heading each; king of the hill marks the champions round.
          const divider = bracket
            ? h.bracketRound !== history[i - 1]?.bracketRound && bracketRoundName(bracket, h.bracketRound)
            : h.champions && !history[i - 1]?.champions && '🏆 Champions round';
          return html`${divider ? html`<div class="road-divider" key=${`d${i}`}>${divider}</div>` : null}
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

// The whole recap, from a snapshot of the final view. `live` adds the
// confetti and fanfare for the party that just ended.
export function Recap({ data, live = false }) {
  const b = data.battle;
  const E = data.entries;
  const champ = E[data.final.winner];
  const kind = champ.kind || data.settings.kind;
  const movie = kind === 'movie';
  const [about, setAbout] = useState(null);
  const [extra, setExtra] = useState(null); // movie details from "where to watch"

  useEffect(() => {
    if (live) sfx.fanfare();
    if (movie) return;
    prefetchPreviews([champ]);
    const q = new URLSearchParams({ kind, id: champ.deezerId || '', title: champ.title, artist: champ.artist || '' });
    request(`/api/music/about?${q}`).then(setAbout).catch(() => {});
    return stopPreview;
  }, [data.id]);

  const facts = about?.facts || {};
  const missing = (v) => v == null || (Array.isArray(v) && !v.length);
  const filled = extra ? Object.fromEntries(Object.entries(extra).filter(([k, v]) => !missing(v) && missing(champ[k]))) : {};
  const item = movie
    ? { ...champ, ...filled }
    : { ...champ, cover: facts.cover || champ.cover, year: champ.year || facts.year || null };
  const wins = b.wins[champ.id] || 0;
  const votes = b.history.reduce((n, h) => n + (h.tally[champ.id] || 0), 0);
  const q = encodeURIComponent([champ.title, champ.artist].filter(Boolean).join(' '));
  const links = about?.links || {
    spotify: `https://open.spotify.com/search/${q}`,
    apple: `https://music.apple.com/us/search?term=${q}`,
    youtube: `https://www.youtube.com/results?search_query=${q}`,
    deezer: `https://www.deezer.com/search/${q}`,
  };
  const factPills = movie ? [
    item.year ? `📅 ${item.year}` : null,
    item.runtime ? `⏱ ${runtimeText(item.runtime)}` : null,
    item.rating ? `★ ${item.rating.toFixed(1)}` : null,
    item.genres?.length ? item.genres.slice(0, 2).join(' · ') : null,
  ].filter(Boolean) : [
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
    ${live ? html`<${Confetti} burst=${data.final.winner} />` : null}
    <div class="final-hero">
      <div class="rays-wrap" aria-hidden="true"><div class="rays" /></div>
      <p class="eyebrow">${b.champions ? 'Champion of champions…' : HEADLINE[kind]}</p>
      <div class="champ-frame">
        <span class="crown-top" aria-hidden="true">👑</span>
        <span class="sparkle s1" aria-hidden="true">✨</span>
        <span class="sparkle s2" aria-hidden="true">${movie ? '⭐' : '🎵'}</span>
        <span class="sparkle s3" aria-hidden="true">✨</span>
        <${Cover} item=${item} />
      </div>
      <h1 class="champ-title">${champ.title}</h1>
      <p class="champ-meta">${movie ? '' : kind === 'artist' ? itemMeta(item) : champ.artist || ''}</p>
      ${factPills.length ? html`<div class="champ-stats">${factPills.map((t) => html`<span class="pill">${t}</span>`)}</div>` : null}
      ${data.settings.theme || b.champions
        ? html`<div class="champ-stats">
            ${data.settings.theme ? html`<span class="pill">${themeEmoji(data.settings.theme)} ${themeTitle(data.settings.theme)}</span>` : null}
            ${b.champions ? html`<span class="pill pill-gold">🏆 Beat ${b.champions.ids.length - 1} other ${b.champions.ids.length === 2 ? 'champion' : 'champions'}</span>` : null}
          </div>`
        : null}
      ${champ.by?.length
        ? html`<div class="champ-stats">
            <span class="pill pill-gold">
              ${champ.by.slice(0, 3).map((p) => html`<${Avatar} key=${p.id} p=${p} size=${22} />`)}
              Picked by ${champ.by.map((p) => (p.id === data.meId ? 'you' : p.name)).join(' & ')}
            </span>
          </div>`
        : champ.mine
          ? html`<div class="champ-stats"><span class="pill pill-gold">🤫 Psst… this was your pick</span></div>`
          : null}
      ${movie
        ? null
        : html`<div style=${{ marginTop: '20px' }}>
            <${PlayButton} item=${item} big label=${kind === 'song' ? '▶ Play it!' : kind === 'album' ? '▶ Play a track from it' : '▶ Play their top song'} />
          </div>`}
    </div>

    <div class="section card stats-grid">
      <div><b>${wins}</b><span>${wins === 1 ? 'matchup won' : 'matchups won'}</span></div>
      <div><b>${votes}</b><span>votes earned</span></div>
      <div><b>${Object.keys(E).length}</b><span>${noun(kind, Object.keys(E).length)} in the hat</span></div>
    </div>

    ${movie ? html`<${WatchCard} movie=${champ} onDetails=${setExtra} />` : html`<${ListenCard} links=${links} />`}
    ${data.final.scores
      ? html`<${Podium} pickers=${data.final.scores.map((r) => ({ ...r, points: r.total, champ: r.champ > 0 }))} meId=${data.meId}
            title="🏅 Final scores" tag="guesses + wins" icon="🏅" />
          <section class="section card"><${ScoreList} scores=${data.final.scores} meId=${data.meId} /></section>`
      : data.final.pickers?.length > 1
        ? html`<${Podium} pickers=${data.final.pickers} meId=${data.meId} />`
        : null}
    <${EveryonesPicks} data=${data} />
    <${Road} history=${b.history} entries=${E} bracket=${b.bracket} />
  </div>`;
}

export function Final() {
  const { view, act } = useGame();
  const data = useMemo(() => snapshot(view), [view]);
  // Keep a copy on this phone for "Past parties".
  useEffect(() => saveParty(data), [data.id]);
  return html`<div>
    <${Recap} data=${data} live />
    <div class="dock">
      ${view.me.host
        ? html`<div class="row">
            <button class="btn btn-ghost" style=${{ flex: 1 }} onClick=${() => (sfx.whoosh(), act({ type: 'rematch' }))}>🎲 Rematch</button>
            <button class="btn btn-hot" style=${{ flex: 1.4 }} onClick=${() => (sfx.pop(), act({ type: 'again' }))}>🔁 New game</button>
          </div>`
        : html`<div class="card center" style=${{ padding: '14px' }}><strong>${view.settings.kind === 'movie' ? '🍿 Grab the popcorn!' : '🎶 Turn it up!'}</strong></div>`}
    </div>
  </div>`;
}
