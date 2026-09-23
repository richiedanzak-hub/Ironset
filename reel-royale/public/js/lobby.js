// The lobby: invite people, set the house rules, open the hat.
import { html, useState, useEffect, useMemo } from './lib.js';
import { inviteLink } from './api.js';
import { Avatar, Seg, Stepper, toast, useGame } from './ui.js';
import { sfx } from './sfx.js';

export function ShareBody({ code }) {
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
      await navigator.share({ title: 'Reel Royale', text: `🎬 Join our movie night! Party code: ${code}`, url: link });
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
  open: "Everyone sees who added each movie while voting",
};

const TIE_HELP = {
  coin: 'A coin flip decides',
  champ: 'The reigning champ keeps the crown (a coin flip decides round 1)',
  keep: 'Both stay in and the next movie joins for a 3‑way showdown',
};

export function rulesSummary(s) {
  const each = s.maxPerPlayer
    ? s.minPerPlayer === s.maxPerPlayer
      ? `${s.maxPerPlayer} movie${s.maxPerPlayer === 1 ? '' : 's'} each`
      : `${s.minPerPlayer}–${s.maxPerPlayer} movies each`
    : s.minPerPlayer
      ? `${s.minPerPlayer}+ movies each`
      : 'As many movies as you like';
  return [
    `🎬 ${each}`,
    s.submitSeconds ? `⏱ ${Math.round(s.submitSeconds / 60)} min to add` : '⏱ No time limit',
    { hidden: '🤫 Picks stay secret', reveal: '🎭 Pickers revealed after each vote', open: '👀 Pickers shown while voting' }[s.reveal],
    { coin: '🪙 Ties: coin flip', champ: '👑 Ties: champ stays', keep: '⚔️ Ties: 3‑way showdown' }[s.ties],
    s.voteSeconds ? `⚡ ${s.voteSeconds}s to vote` : null,
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
  return html`<div class="card">
    <div class="rule">
      <div class="rule-text"><strong>Minimum each</strong><span>Must add this many before "I'm done"</span></div>
      <${Stepper} label="Minimum movies each" value=${s.minPerPlayer} min=${0} max=${20} onChange=${(v) => set({ minPerPlayer: v })} />
    </div>
    <div class="rule">
      <div class="rule-text">
        <strong>Maximum each</strong>
        <span><button class="chip soft ${noCap ? 'on' : ''}" style=${{ marginTop: '6px', padding: '5px 10px', fontSize: '0.78rem' }}
          onClick=${() => set({ maxPerPlayer: noCap ? Math.max(5, s.minPerPlayer) : 0 })}>${noCap ? '✓ ' : ''}No limit</button></span>
      </div>
      <${Stepper}
        label="Maximum movies each"
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
      <div class="rule-text"><strong>Reveal who picked what?</strong><span>${REVEAL_HELP[s.reveal]}</span></div>
      <${Seg} label="Reveal pickers" value=${s.reveal}
        options=${[['hidden', '🤫 Never'], ['reveal', '🎭 After vote'], ['open', '👀 Always']]}
        onChange=${(v) => set({ reveal: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text"><strong>If a vote ties</strong><span>${TIE_HELP[s.ties]}</span></div>
      <${Seg} label="Tie breaker" value=${s.ties}
        options=${[['coin', '🪙 Coin flip'], ['champ', '👑 Champ'], ['keep', '⚔️ 3‑way']]}
        onChange=${(v) => set({ ties: v })} />
    </div>
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
            <p class="dock-note">${view.players.length < 2 ? 'Tip: wait for a few people. Late arrivals can still join.' : 'Anyone who joins later can still add movies.'}</p>
          </div>`
        : html`<div class="card center" style=${{ padding: '16px' }}>
            <strong class="dots">Waiting for ${host ? host.name : 'the host'} to open the hat</strong>
          </div>`}
    </div>
  </div>`;
}
