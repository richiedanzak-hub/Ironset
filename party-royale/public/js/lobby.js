// The lobby: invite people, set the house rules, open the hat.
import { html, useState, useEffect, useMemo } from './lib.js';
import { inviteLink, request } from './api.js';
import { Avatar, DECADES, Seg, Stepper, ThemeBanner, VIBES, noun, themeRule, themeTitle, toast, useGame } from './ui.js';
import { sfx } from './sfx.js';

export function ShareBody({ code }) {
  const settings = useGame()?.view?.settings;
  const theme = settings?.theme;
  const [link, setLink] = useState('');
  const [showQr, setShowQr] = useState(false);
  useEffect(() => {
    inviteLink(code).then(setLink);
  }, [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast('Link copied! Paste it in the group chat 💬', 'good');
    } catch {
      window.prompt('Copy this link:', link);
    }
  };
  const share = async () => {
    sfx.tap();
    if (!navigator.share) return copy();
    try {
      const about = theme ? ` Theme: ${themeTitle(theme)}.` : '';
      const what = settings?.kind === 'movie' ? '🎬 Join our movie night!' : '🎧 Join our music battle!';
      await navigator.share({ title: 'Party Royale', text: `${what}${about} Party code: ${code}`, url: link });
    } catch {}
  };

  const qr = useMemo(() => {
    if (!showQr || !link || !window.qrcode) return '';
    const q = window.qrcode(0, 'M');
    q.addData(link);
    q.make();
    return q.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
  }, [showQr, link]);

  return html`<div>
    <p class="share-label center">Party code</p>
    <div class="big-code" aria-label="Party code ${code}">${[...code].map((c) => html`<b>${c}</b>`)}</div>
    <p class="share-link">${link.replace(/^https?:\/\//, '')}</p>
    <div class="share-actions">
      <button class="btn btn-hot" onClick=${share}>📤 Send invite</button>
      <button class="btn btn-ghost" onClick=${copy}>📋 Copy link</button>
    </div>
    <button class="btn btn-quiet btn-block" style=${{ marginTop: '6px' }} onClick=${() => setShowQr(!showQr)}>
      ${showQr ? 'Hide QR code' : '📷 Show a QR code for people in the room'}
    </button>
    ${showQr && qr ? html`<div class="qr" dangerouslySetInnerHTML=${{ __html: qr }} />` : null}
  </div>`;
}

const REVEAL_HELP = {
  hidden: 'Nobody ever finds out who added what 🤫',
  reveal: 'Each pick is revealed once its matchup is decided',
  open: 'Everyone sees who added each pick while voting',
};

const TIE_HELP = {
  coin: 'A coin flip decides',
  champ: 'The reigning champ keeps the crown (a coin flip decides round 1)',
  keep: 'Both stay in and the next pick joins for a 3‑way showdown',
};

const KIND_LABEL = { movie: '🎬 Movie', song: '🎵 Song', album: '💿 Album', artist: '🎤 Artist' };

// One-tap themes. Genres use TMDB's and Deezer's names so the ideas and the
// theme check can follow them.
const MOVIE_PRESETS = [
  ['👻 Horror night', { genre: 'Horror', name: 'Horror night' }],
  ['😂 Comedy night', { genre: 'Comedy', name: 'Comedy night' }],
  ['🧸 Family movie night', { genre: 'Family', name: 'Family movie night' }],
  ['💥 Action', { genre: 'Action' }],
  ['🚀 Sci-fi', { genre: 'Science Fiction', name: 'Sci-fi night' }],
  ['🎨 Animated', { genre: 'Animation', name: 'Animated movies' }],
  ['💘 Romance', { genre: 'Romance', name: 'Date night' }],
  ['🔪 Thrillers', { genre: 'Thriller', name: 'Thriller night' }],
  ['📼 80s Classics', { decade: '80s', name: '80s Classics' }],
  ['💿 90s Throwbacks', { decade: '90s', name: '90s Throwbacks' }],
];
const MUSIC_PRESETS = [
  ['🎸 90s Rock', { decade: '90s', genre: 'Rock' }],
  ['🪩 80s Party', { decade: '80s', vibe: 'party' }],
  ['💿 2000s Throwbacks', { decade: '2000s', name: '2000s Throwbacks' }],
  ['🔥 Hits right now', { decade: '2020s', name: 'Hits right now' }],
  ['🎤 Sing-along', { vibe: 'singalong' }],
  ['🚗 Road trip', { vibe: 'roadtrip' }],
  ['🤠 Country', { genre: 'Country' }],
  ['🎙️ Hip hop', { genre: 'Rap/Hip Hop', name: 'Hip hop' }],
  ['🕺 Soul & Funk', { genre: 'Soul & Funk' }],
  ['💘 Love songs', { vibe: 'love' }],
];
const MOVIE_GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'];
const FALLBACK_GENRES = ['Pop', 'Rock', 'Rap/Hip Hop', 'R&B', 'Dance', 'Alternative', 'Country', 'Latin Music', 'Soul & Funk', 'Electro', 'Metal', 'Reggae', 'Jazz', 'Folk', 'Blues', 'Films/Games'];

const sameTheme = (a, b) => ['name', 'genre', 'decade', 'vibe'].every((k) => (a?.[k] || null) === (b?.[k] || null));

function ThemePicker({ theme, set, kind }) {
  const movies = kind === 'movie';
  const PRESETS = movies ? MOVIE_PRESETS : MUSIC_PRESETS;
  const fallback = movies ? MOVIE_GENRES : FALLBACK_GENRES;
  const preset = PRESETS.find(([, t]) => sameTheme(t, theme));
  const [custom, setCustom] = useState(!!theme && !preset);
  const [genres, setGenres] = useState(null);
  const [name, setName] = useState(theme?.name || '');
  useEffect(() => setName(theme?.name || ''), [theme?.name]);
  useEffect(() => setGenres(null), [movies]);
  useEffect(() => {
    if (custom && !genres) {
      request(movies ? '/api/movies/meta' : '/api/music/meta')
        .then((m) => setGenres(m.genres?.length ? m.genres : fallback))
        .catch(() => setGenres(fallback));
    }
  }, [custom, genres]);

  const change = (patch) => set({ theme: { ...(theme || {}), ...patch } });
  const toggle = (k, v) => change({ [k]: theme?.[k] === v ? null : v });
  const saveName = () => name.trim() !== (theme?.name || '') && change({ name: name.trim() || null });

  return html`<div>
    <div class="wrap-chips">
      <button class="chip ${!theme ? 'on' : ''}" onClick=${() => (setCustom(false), set({ theme: null }))}>🎲 Anything goes</button>
      ${PRESETS.map(
        ([label, t]) => html`<button class="chip ${preset?.[1] === t ? 'on' : ''}" key=${label}
          onClick=${() => (setCustom(false), set({ theme: t }))}>${label}</button>`,
      )}
      <button class="chip soft ${custom ? 'on' : ''}" onClick=${() => setCustom(!custom)} aria-expanded=${custom}>✏️ Make your own</button>
    </div>
    ${custom
      ? html`<div class="filter-panel theme-panel">
          <h3>Name it (optional)</h3>
          <input class="input" placeholder=${movies ? 'e.g. Halloween scare-fest' : "e.g. Mom's birthday bangers"} maxlength="40" value=${name}
            onInput=${(e) => setName(e.target.value)} onBlur=${saveName} onKeyDown=${(e) => e.key === 'Enter' && e.target.blur()} />
          <h3>Genre</h3>
          <div class="wrap-chips">
            ${(genres || fallback).map((g) => html`<button class="chip ${theme?.genre === g ? 'on' : ''}" key=${g} onClick=${() => toggle('genre', g)}>${g}</button>`)}
          </div>
          <h3>Decade</h3>
          <div class="wrap-chips">
            ${DECADES.map(([v, label]) => html`<button class="chip ${theme?.decade === v ? 'on' : ''}" key=${v} onClick=${() => toggle('decade', v)}>${label}</button>`)}
          </div>
          ${movies
            ? null
            : html`<h3>Vibe</h3>
                <div class="wrap-chips">
                  ${VIBES.map(([v, label]) => html`<button class="chip ${theme?.vibe === v ? 'on' : ''}" key=${v} onClick=${() => toggle('vibe', v)}>${label}</button>`)}
                </div>`}
        </div>`
      : null}
  </div>`;
}

const quizOn = (s) => s.quiz && (s.kind === 'song' || s.kind === 'album');

export function rulesSummary(s) {
  const n = (count) => noun(s.kind, count);
  const bracket = s.format !== 'classic';
  const each = s.maxPerPlayer
    ? s.minPerPlayer === s.maxPerPlayer
      ? `${s.maxPerPlayer} ${n(s.maxPerPlayer)} each`
      : `${s.minPerPlayer}–${s.maxPerPlayer} ${n(2)} each`
    : s.minPerPlayer
      ? `${s.minPerPlayer}+ ${n(2)} each`
      : `As many ${n(2)} as you like`;
  return [
    s.theme ? `🎨 ${themeTitle(s.theme)}` : null,
    s.themeStrict && themeRule(s.theme, s.kind) ? `🔒 ${themeRule(s.theme, s.kind)}` : null,
    `${KIND_LABEL[s.kind]} battle`,
    `🎶 ${each}`,
    s.clean && s.kind !== 'movie' ? '🧼 Clean picks only' : null,
    s.submitSeconds ? `⏱ ${Math.round(s.submitSeconds / 60)} min to add` : '⏱ No time limit',
    bracket ? '🏆 Bracket: winners move on' : '👑 King of the hill',
    s.scoring ? '🏅 Points game' : null,
    quizOn(s) ? '🎤 Who sings it?' : null,
    s.scoring ? null : { hidden: '🤫 Picks stay secret', reveal: '🎭 Pickers revealed after each vote', open: '👀 Pickers shown while voting' }[s.reveal],
    bracket ? null : { coin: '🪙 Ties: coin flip', champ: '👑 Ties: champ stays', keep: '⚔️ Ties: 3‑way showdown' }[s.ties],
    s.voteSeconds ? `⚡ ${s.voteSeconds}s to vote` : null,
    !bracket && s.champions ? '🏆 Champions round at the end' : null,
  ].filter(Boolean);
}

export function RulesCard() {
  const { view, act } = useGame();
  const s = view.settings;
  const canEdit = view.me.host && (view.phase === 'lobby' || view.phase === 'submit');
  const set = (patch) => {
    sfx.tap();
    act({ type: 'settings', settings: patch });
  };

  if (!canEdit) {
    return html`<div class="rules-summary">${rulesSummary(s).map((t) => html`<span class="pill">${t}</span>`)}</div>`;
  }

  const noCap = s.maxPerPlayer === 0;
  const bracket = s.format !== 'classic';
  const inLobby = view.phase === 'lobby';
  return html`<div class="card">
    <div class="rule rule-col">
      <div class="rule-text">
        <strong>Theme for the night</strong>
        <span>${s.theme ? 'Everyone sees it, and the ideas stick to it' : 'Optional: steer everyone to a genre, decade or vibe'}</span>
      </div>
      <${ThemePicker} theme=${s.theme} set=${set} kind=${s.kind} />
    </div>
    ${themeRule(s.theme, s.kind)
      ? html`<div class="rule rule-col">
          <div class="rule-text">
            <strong>Off-theme picks</strong>
            <span>${s.themeStrict ? `${themeRule(s.theme, s.kind)}. Each pick is checked as it goes in` : 'Allowed: the theme is just a suggestion'}</span>
          </div>
          <${Seg} label="Off-theme picks" value=${s.themeStrict ? 'block' : 'allow'}
            options=${[['block', '🚫 Blocked'], ['allow', '👍 Allowed']]}
            onChange=${(v) => set({ themeStrict: v === 'block' })} />
        </div>`
      : null}
    <div class="rule rule-col">
      <div class="rule-text"><strong>What are we battling?</strong><span>${inLobby ? 'Movies for a movie night, or songs, albums or artists' : 'Locked in once the hat opens'}</span></div>
      <${Seg} label="What to battle" value=${s.kind} disabled=${!inLobby} className="stacked"
        options=${[['movie', '🎬', 'Movies'], ['song', '🎵', 'Songs'], ['album', '💿', 'Albums'], ['artist', '🎤', 'Artists']].map(
          ([v, emoji, text]) => [v, html`<span class="seg-emoji">${emoji}</span>${text}`],
        )}
        onChange=${(v) => set({ kind: v })} />
    </div>
    ${s.kind !== 'movie'
      ? html`<div class="rule rule-col">
          <div class="rule-text"><strong>Explicit lyrics</strong><span>${s.clean ? 'Explicit songs and albums are hidden and blocked' : 'Anything goes'}</span></div>
          <${Seg} label="Explicit lyrics" value=${s.clean ? 'clean' : 'any'}
            options=${[['any', '🔊 Allowed'], ['clean', '🧼 Clean only']]}
            onChange=${(v) => set({ clean: v === 'clean' })} />
        </div>`
      : null}
    <div class="rule">
      <div class="rule-text"><strong>Minimum each</strong><span>Must add this many before "I'm done"</span></div>
      <${Stepper} label="Minimum picks each" value=${s.minPerPlayer} min=${0} max=${20} onChange=${(v) => set({ minPerPlayer: v })} />
    </div>
    <div class="rule">
      <div class="rule-text">
        <strong>Maximum each</strong>
        <span><button class="chip soft ${noCap ? 'on' : ''}" style=${{ marginTop: '6px', padding: '5px 10px', fontSize: '0.78rem' }}
          onClick=${() => set({ maxPerPlayer: noCap ? Math.max(5, s.minPerPlayer) : 0 })}>${noCap ? '✓ ' : ''}No limit</button></span>
      </div>
      <${Stepper}
        label="Maximum picks each"
        value=${noCap ? 51 : s.maxPerPlayer}
        min=${1}
        max=${50}
        disabled=${noCap}
        format=${(v) => (v > 50 ? '∞' : String(v))}
        onChange=${(v) => set({ maxPerPlayer: v })}
      />
    </div>
    <div class="rule rule-col">
      <div class="rule-text"><strong>Time to fill the hat</strong><span>Or end it when everyone taps "I'm done"</span></div>
      <${Seg} label="Submission timer" value=${s.submitSeconds}
        options=${[[0, 'No timer'], [120, '2 min'], [300, '5 min'], [600, '10 min']]}
        onChange=${(v) => set({ submitSeconds: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text">
        <strong>How it plays</strong>
        <span>${bracket
          ? 'Bracket: picks pair off and the winners move on, round by round. Everyone gets a fair shot'
          : 'King of the hill: the winner stays on and takes on the next pick from the hat'}</span>
      </div>
      <${Seg} label="Format" value=${s.format}
        options=${[['bracket', '🏆 Bracket'], ['classic', '👑 King of the hill']]}
        onChange=${(v) => set({ format: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text">
        <strong>Points game</strong>
        <span>${s.scoring
          ? '🕵️ +1 for guessing who picked each one · ⭐ +2 when your pick wins a matchup · 👑 +3 if yours is the champion'
          : 'Off: just vote for your favorites'}</span>
      </div>
      <${Seg} label="Points game" value=${s.scoring ? 'on' : 'off'}
        options=${[['on', '🏅 On'], ['off', 'Off']]}
        onChange=${(v) => set({ scoring: v === 'on' })} />
    </div>
    ${s.kind === 'song' || s.kind === 'album'
      ? html`<div class="rule rule-col">
          <div class="rule-text">
            <strong>Who sings it?</strong>
            <span>${s.quiz
              ? `Each ${noun(s.kind)} starts as a mystery: hear the preview and pick the artist${s.scoring ? ' (+1)' : ''}, then it's revealed`
              : 'Off: songs are shown right away'}</span>
          </div>
          <${Seg} label="Who sings it" value=${s.quiz ? 'on' : 'off'}
            options=${[['on', '🎤 On'], ['off', 'Off']]}
            onChange=${(v) => set({ quiz: v === 'on' })} />
        </div>`
      : null}
    ${s.scoring
      ? null
      : html`<div class="rule rule-col">
          <div class="rule-text"><strong>Reveal who picked what?</strong><span>${REVEAL_HELP[s.reveal]}</span></div>
          <${Seg} label="Reveal pickers" value=${s.reveal}
            options=${[['hidden', '🤫 Never'], ['reveal', '🎭 After vote'], ['open', '👀 Always']]}
            onChange=${(v) => set({ reveal: v })} />
        </div>`}
    ${bracket
      ? null
      : html`<div class="rule rule-col">
          <div class="rule-text"><strong>If a vote ties</strong><span>${TIE_HELP[s.ties]}</span></div>
          <${Seg} label="Tie breaker" value=${s.ties}
            options=${[['coin', '🪙 Coin flip'], ['champ', '👑 Champ'], ['keep', '⚔️ 3‑way']]}
            onChange=${(v) => set({ ties: v })} />
        </div>
        <div class="rule rule-col">
          <div class="rule-text">
            <strong>Champions round</strong>
            <span>${s.champions ? `Every ${noun(s.kind)} that wins a matchup comes back for one last showdown` : 'Off: the last one standing wins'}</span>
          </div>
          <${Seg} label="Champions round" value=${s.champions ? 'on' : 'off'}
            options=${[['off', 'Off'], ['on', '🏆 On']]}
            onChange=${(v) => set({ champions: v === 'on' })} />
        </div>`}
    <div class="rule rule-col">
      <div class="rule-text"><strong>Time to vote</strong><span>Keeps things moving if someone wanders off</span></div>
      <${Seg} label="Vote timer" value=${s.voteSeconds}
        options=${[[0, 'No timer'], [15, '15s'], [30, '30s'], [60, '60s']]}
        onChange=${(v) => set({ voteSeconds: v })} />
    </div>
  </div>`;
}

export function Lobby() {
  const { view, act, code } = useGame();
  const host = view.players.find((p) => p.host);
  const start = () => {
    sfx.whoosh();
    act({ type: 'start' });
  };

  return html`<div>
    <p class="eyebrow">Party lobby</p>
    <h1 class="screen-title">Get the crew in here</h1>
    <p class="screen-sub">Everyone joins on their own phone. Send the link, or they can type the code.</p>
    ${view.settings.theme ? html`<div class="section"><${ThemeBanner} theme=${view.settings.theme} /></div>` : null}

    <div class="card card-glow share-card section"><${ShareBody} code=${code} /></div>

    <section class="section">
      <div class="section-head"><h2>Who's here</h2><span class="tag">${view.players.length} ${view.players.length === 1 ? 'player' : 'players'}</span></div>
      <div class="players">
        ${view.players.map(
          (p) => html`<div class="player" key=${p.id}>
            <${Avatar} p=${p} size=${58} off=${!p.online} crown=${p.host} />
            <span class="player-name">${p.name}</span>
            <span class="player-sub">${p.id === view.me.id ? 'you' : p.online ? '' : 'away'}</span>
          </div>`,
        )}
        <div class="player" style=${{ opacity: 0.6 }}>
          <span class="avatar ghost" style=${{ width: '58px', height: '58px', fontSize: '26px' }}>＋</span>
          <span class="player-name">Waiting…</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>House rules</h2>${view.me.host ? html`<span class="tag">tap to change</span>` : null}</div>
      <${RulesCard} />
    </section>

    <div class="dock">
      ${view.me.host
        ? html`<div>
            <button class="btn btn-gold btn-block btn-xl" onClick=${start}>🎩 Open the hat</button>
            <p class="dock-note">${view.players.length < 2 ? 'Tip: wait for a few people. Late arrivals can still join.' : `Anyone who joins later can still add ${noun(view.settings.kind, 2)}.`}</p>
          </div>`
        : html`<div class="card center" style=${{ padding: '16px' }}>
            <strong class="dots">Waiting for ${host ? host.name : 'the host'} to open the hat</strong>
          </div>`}
    </div>
  </div>`;
}
