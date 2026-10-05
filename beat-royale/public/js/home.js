// Screens outside a party: home, joining from a link, and "party's over".
import { html, useState, useEffect } from './lib.js';
import { request, session, profile } from './api.js';
import { Avatar, ProfileForm, Sheet, Loading, toast, randomAvatar, themeEmoji, themeTitle } from './ui.js';
import { sfx } from './sfx.js';

const savedProfile = () => {
  const p = profile.get();
  return { name: p.name || '', avatar: p.avatar || randomAvatar() };
};

function Wordmark() {
  return html`<div class="home-hero">
    <div class="logo-art" aria-hidden="true">
      <span class="ticket t1">🎵</span>
      <span class="ticket t2">💿</span>
      <span class="ticket t3">🎤</span>
      <span class="hat">🎩</span>
    </div>
    <h1 class="wordmark">Beat<span>Royale</span></h1>
    <p class="tagline">Toss songs in the hat. Battle them head‑to‑head. The last track standing wins the night.</p>
  </div>`;
}

export function Home({ go }) {
  const [mode, setMode] = useState(null); // 'host' | 'join'
  const [form, setForm] = useState(savedProfile);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const host = async () => {
    if (!form.name.trim()) return toast('Pop your name in first 👆', 'error');
    setBusy(true);
    try {
      const s = await request('/api/rooms', form);
      profile.set(form);
      session.set(s.code, s);
      sfx.pop();
      go(`/j/${s.code}`);
    } catch (err) {
      toast(err.message, 'error');
      setBusy(false);
    }
  };

  const join = () => {
    const c = code.trim().toUpperCase();
    if (!/^[A-Z]{4}$/.test(c)) return toast('Party codes are 4 letters', 'error');
    sfx.tap();
    go(`/j/${c}`);
  };

  return html`<main class="app no-dock">
    <${Wordmark} />
    <div class="stack" style=${{ marginTop: '26px' }}>
      <button class="btn btn-hot btn-xl btn-block" onClick=${() => (sfx.tap(), setMode('host'))}>🎧 Host a music battle</button>
      <button class="btn btn-ghost btn-xl btn-block" onClick=${() => (sfx.tap(), setMode('join'))}>🎟️ I have a party code</button>
    </div>

    <section class="section card">
      <div class="section-head"><h2>How it works</h2></div>
      <div class="how">
        <div class="how-step"><span class="how-num">🎩</span><div><strong>Fill the hat</strong><span>Everyone secretly adds songs, albums or artists they love.</span></div></div>
        <div class="how-step"><span class="how-num">⚔️</span><div><strong>Head-to-head</strong><span>Two come out. Play the previews, everyone votes, the winner stays on.</span></div></div>
        <div class="how-step"><span class="how-num">👑</span><div><strong>Crown the champ</strong><span>Last one standing wins, with links to play it on Spotify, Apple Music & more.</span></div></div>
      </div>
    </section>

    <${Sheet} open=${mode === 'host'} onClose=${() => setMode(null)} title="Host a party">
      <${ProfileForm} value=${form} onChange=${setForm} onSubmit=${host} />
      <button class="btn btn-hot btn-block btn-xl" style=${{ marginTop: '22px' }} disabled=${busy} onClick=${host}>
        ${busy ? 'Setting up…' : 'Create party 🎉'}
      </button>
    </${Sheet}>

    <${Sheet} open=${mode === 'join'} onClose=${() => setMode(null)} title="Join a party">
      <label class="field">
        <span class="label">Party code</span>
        <input
          class="input code-input"
          value=${code}
          maxlength="4"
          placeholder="ABCD"
          autocapitalize="characters"
          autocomplete="off"
          spellcheck="false"
          enterkeyhint="go"
          onInput=${(e) => setCode(e.target.value.replace(/[^a-z]/gi, '').toUpperCase())}
          onKeyDown=${(e) => e.key === 'Enter' && join()}
        />
      </label>
      <p class="small muted center" style=${{ marginTop: '10px' }}>Got a link instead? Just tap it, no code needed.</p>
      <button class="btn btn-hot btn-block btn-xl" style=${{ marginTop: '20px' }} disabled=${code.length !== 4} onClick=${join}>
        Find party →
      </button>
    </${Sheet}>
  </main>`;
}

export function JoinScreen({ code, go, onJoined }) {
  const [info, setInfo] = useState(null);
  const [missing, setMissing] = useState(false);
  const [form, setForm] = useState(savedProfile);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    request(`/api/rooms/${code}`)
      .then(setInfo)
      .catch((err) => (err.status === 404 ? setMissing(true) : toast(err.message, 'error')));
  }, [code]);

  const join = async () => {
    if (!form.name.trim()) return toast('Pop your name in first 👆', 'error');
    setBusy(true);
    try {
      const s = await request(`/api/rooms/${code}/join`, form);
      profile.set(form);
      sfx.pop();
      onJoined(s);
    } catch (err) {
      toast(err.message, 'error');
      setBusy(false);
    }
  };

  if (missing) return html`<${Gone} reason="missing" go=${go} />`;
  if (!info) return html`<main class="app no-dock"><${Loading} text="Finding the party" /></main>`;

  const hostName = info.host?.name;
  return html`<main class="app">
    <div class="card card-glow invite-card">
      ${info.host ? html`<${Avatar} p=${{ ...info.host, color: '#fcd34d' }} size=${64} crown />` : null}
      <p class="eyebrow">You're invited!</p>
      <h1 class="invite-title">${hostName ? `${hostName}'s music battle` : 'Music battle'}</h1>
      <div class="big-code" aria-label="Party code ${code}">${[...code].map((c) => html`<b>${c}</b>`)}</div>
      <p class="small muted" style=${{ marginTop: '10px' }}>
        ${info.players} ${info.players === 1 ? 'person' : 'people'} here ·
        ${info.phase === 'lobby' ? ' getting ready' : info.phase === 'submit' ? ' filling the hat' : info.phase === 'battle' ? ' battling now' : ' crowned a champ'}
      </p>
      ${info.theme ? html`<p style=${{ marginTop: '12px' }}><span class="pill pill-gold">${themeEmoji(info.theme)} Theme: ${themeTitle(info.theme)}</span></p>` : null}
    </div>
    <div class="section">
      <${ProfileForm} value=${form} onChange=${setForm} onSubmit=${join} />
    </div>
    <div class="dock">
      <button class="btn btn-hot btn-block btn-xl" disabled=${busy} onClick=${join}>${busy ? 'Joining…' : 'Join the party 🎉'}</button>
    </div>
  </main>`;
}

const GONE = {
  missing: ['🤔', "Hmm, can't find that party", 'Double-check the code, or ask for a fresh link.'],
  ended: ['🎧', 'That party has wrapped', 'Everyone left, so the party closed. Start a new one any time!'],
  expired: ['😴', 'That party fell asleep', 'Parties close after a few quiet hours. Start a new one!'],
  kicked: ['👋', 'You were removed from the party', 'If that was a mistake, ask the host to send the link again.'],
  removed: ["🚪", "You're not in this party anymore", 'You can hop back in with the same link.'],
};

export function Gone({ reason, go, onRejoin }) {
  const [emoji, title, text] = GONE[reason] || GONE.ended;
  return html`<main class="app no-dock">
    <div class="loading">
      <div>
        <span class="hat" style=${{ animation: 'none' }}>${emoji}</span>
        <h1 class="screen-title">${title}</h1>
        <p class="screen-sub" style=${{ maxWidth: '300px', margin: '10px auto 26px' }}>${text}</p>
        <div class="stack">
          ${onRejoin ? html`<button class="btn btn-hot btn-block" onClick=${onRejoin}>Join again</button>` : null}
          <button class="btn btn-ghost btn-block" onClick=${() => go('/')}>Back to start</button>
        </div>
      </div>
    </div>
  </main>`;
}
