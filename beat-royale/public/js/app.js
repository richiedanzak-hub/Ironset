// Beat Royale: app shell, routing and the live party connection.
import { html, render, useState, useEffect, useRef, useCallback } from './lib.js';
import { session, subscribe, sendAction } from './api.js';
import { Avatar, GameCtx, Loading, Sheet, Toasts, toast, useGame } from './ui.js';
import { Home, JoinScreen, Gone } from './home.js';
import { Lobby, RulesCard, ShareBody } from './lobby.js';
import { Submit } from './submit.js';
import { Battle } from './battle.js';
import { Final } from './final.js';
import { Past } from './past.js';
import { sfx } from './sfx.js';

// /j/ABCD is a party; /past and /past/<id> are recaps saved on this phone.
const route = () => {
  const party = location.pathname.match(/^\/j\/([A-Za-z]{4})\/?$/);
  if (party) return { code: party[1].toUpperCase() };
  const past = location.pathname.match(/^\/past(?:\/([^/]+))?\/?$/);
  if (past) return { past: past[1] ? decodeURIComponent(past[1]) : '' };
  return {};
};

function TopBar({ open }) {
  const { view, status } = useGame();
  return html`<header class="topbar">
    <button class="code-chip" onClick=${() => open('share')} aria-label="Invite people, party code ${view.code}">
      <span aria-hidden="true">🎟️</span>${view.code}<small>Invite</small>
    </button>
    <div class="spacer" />
    <button class="crew-btn" onClick=${() => open('crew')} aria-label="Players">
      <span class="face-stack">${view.players.slice(0, 4).map((p) => html`<${Avatar} key=${p.id} p=${p} size=${30} off=${!p.online} />`)}</span>
      ${view.players.length}
    </button>
    <button class="icon-btn" onClick=${() => open('menu')} aria-label="Menu">⋯</button>
    ${status === 'reconnecting' ? html`<span class="pill pill-hot status-pill dots">Reconnecting</span>` : null}
  </header>`;
}

function CrewSheet({ open, onClose }) {
  const { view, act } = useGame();
  const host = view.me.host;
  const kick = (p) => {
    if (confirm(`Remove ${p.name} from the party?`)) act({ type: 'kick', playerId: p.id });
  };
  const promote = (p) => {
    if (confirm(`Make ${p.name} the host? They'll control the game.`)) act({ type: 'makeHost', playerId: p.id });
  };
  return html`<${Sheet} open=${open} onClose=${onClose} title=${`The crew (${view.players.length})`}>
    ${view.players.map(
      (p) => html`<div class="crew-row" key=${p.id}>
        <${Avatar} p=${p} size=${44} off=${!p.online} crown=${p.host} />
        <div class="grow">
          <strong>${p.name}${p.id === view.me.id ? ' (you)' : ''}</strong>
          <span>${[p.host && 'Host', p.online ? 'Here' : 'Away', view.phase === 'submit' && `${p.count} in the hat`].filter(Boolean).join(' · ')}</span>
        </div>
        ${host && p.id !== view.me.id
          ? html`<button class="btn btn-quiet btn-sm" onClick=${() => promote(p)}>👑</button>
              <button class="btn btn-danger btn-sm" onClick=${() => kick(p)}>Remove</button>`
          : null}
      </div>`,
    )}
  </${Sheet}>`;
}

function MenuSheet({ open, onClose, show, leave, go }) {
  const { view, act } = useGame();
  const [muted, setMuted] = useState(sfx.muted);
  const canRules = view.me.host && (view.phase === 'lobby' || view.phase === 'submit');
  const restart = () => {
    if (confirm('Start over? Everyone goes back to the lobby and the hat is emptied.')) {
      onClose();
      act({ type: 'again' });
    }
  };
  return html`<${Sheet} open=${open} onClose=${onClose} title="Menu">
    <div class="menu-list">
      <button class="menu-item" onClick=${() => show('share')}><span class="ic">🎟️</span>Invite people</button>
      ${canRules ? html`<button class="menu-item" onClick=${() => show('rules')}><span class="ic">📜</span>House rules</button>` : null}
      <button class="menu-item" onClick=${() => setMuted(sfx.toggle())}><span class="ic">${muted ? '🔇' : '🔊'}</span>Sound ${muted ? 'off' : 'on'}</button>
      ${view.phase === 'lobby' || view.phase === 'final'
        ? html`<button class="menu-item" onClick=${() => go('/past')}><span class="ic">📜</span>Past parties</button>`
        : null}
      ${view.me.host && view.phase !== 'lobby' ? html`<button class="menu-item" onClick=${restart}><span class="ic">🔄</span>Start over</button>` : null}
      <button class="menu-item danger" onClick=${leave}><span class="ic">🚪</span>Leave party</button>
    </div>
  </${Sheet}>`;
}

function Party({ code, go }) {
  const [sess, setSess] = useState(() => session.get(code));
  const [view, setView] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [gone, setGone] = useState(null);
  const [sheet, setSheet] = useState(null);
  const offset = useRef(0);
  const seen = useRef(null);

  useEffect(() => {
    if (!sess) return;
    return subscribe(code, sess, {
      onView: (v) => {
        offset.current = v.now - Date.now();
        setView(v);
      },
      onGone: (reason) => {
        session.clear(code);
        if (reason === 'left') go('/');
        else setGone(reason);
      },
      onStatus: setStatus,
    });
  }, [sess]);

  // Friendly nudges when people arrive, and when the phase changes.
  useEffect(() => {
    if (!view) return;
    const prev = seen.current;
    seen.current = view;
    if (!prev) return;
    const before = new Set(prev.players.map((p) => p.id));
    for (const p of view.players) {
      if (!before.has(p.id) && p.id !== view.me.id) {
        toast(`${p.avatar} ${p.name} joined!`, 'info', 2200);
        sfx.pop();
      }
    }
    if (prev.phase !== view.phase) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSheet(null);
    }
    if (prev.hostId !== view.hostId && view.me.host) toast("👑 You're the host now", 'good');
  }, [view]);

  // Returns null when a move is refused (after a toast saying why). With
  // `inline`, a pick that doesn't fit the theme comes back as { offTheme }
  // instead, so it can be shown right on the song.
  const act = useCallback(
    async (action, { inline = false } = {}) => {
      try {
        const out = await sendAction(code, sess, action);
        if (out.notice) toast(out.notice, 'good', 3400);
        return out;
      } catch (err) {
        if (inline && err.status === 422) return { offTheme: err.message };
        toast(err.message, 'error');
        return null;
      }
    },
    [code, sess],
  );

  const leave = async () => {
    if (!confirm('Leave this party?')) return;
    await act({ type: 'leave' });
    session.clear(code);
    go('/');
  };

  if (gone) {
    return html`<${Gone} reason=${gone} go=${go} onRejoin=${gone === 'removed' || gone === 'kicked' ? () => (setGone(null), setView(null), setSess(null)) : null} />`;
  }
  if (!sess) {
    return html`<${JoinScreen} code=${code} go=${go} onJoined=${(s) => (session.set(code, s), setSess(s))} />`;
  }
  if (!view) return html`<main class="app no-dock"><${Loading} text=${status === 'reconnecting' ? 'Reconnecting' : 'Joining the party'} /></main>`;

  const ctx = { view, act, code, sess, offset, status };
  const Screen = { lobby: Lobby, submit: Submit, battle: Battle, final: Final }[view.phase];
  return html`<${GameCtx.Provider} value=${ctx}>
    <main class="app">
      <${TopBar} open=${setSheet} />
      <${Screen} />
    </main>
    <${Sheet} open=${sheet === 'share'} onClose=${() => setSheet(null)} title="Invite the crew"><${ShareBody} code=${code} /></${Sheet}>
    <${Sheet} open=${sheet === 'rules'} onClose=${() => setSheet(null)} title="House rules"><${RulesCard} /></${Sheet}>
    <${CrewSheet} open=${sheet === 'crew'} onClose=${() => setSheet(null)} />
    <${MenuSheet} open=${sheet === 'menu'} onClose=${() => setSheet(null)} show=${setSheet} leave=${leave} go=${go} />
  </${GameCtx.Provider}>`;
}

function App() {
  const [where, setWhere] = useState(route);
  useEffect(() => {
    const onPop = () => setWhere(route());
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);
  const go = useCallback((path) => {
    history.pushState(null, '', path);
    setWhere(route());
    window.scrollTo(0, 0);
  }, []);
  const screen = where.code
    ? html`<${Party} key=${where.code} code=${where.code} go=${go} />`
    : where.past !== undefined
      ? html`<${Past} key=${where.past} id=${where.past} go=${go} />`
      : html`<${Home} go=${go} />`;
  return html`${screen}<${Toasts} />`;
}

const root = document.getElementById('root');
root.textContent = '';
render(html`<${App} />`, root);
