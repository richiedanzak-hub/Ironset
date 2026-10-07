// Past parties: when a party crowns its champion (or a quiz ends), this phone
// keeps a copy of the recap, so it can be looked at again any time. The server forgets
// parties after a few hours (and whenever it restarts), so the copy lives in
// the phone's own storage.
import { html } from './lib.js';
import { Avatar, Cover, themeEmoji, themeTitle, noun } from './ui.js';
import { Recap } from './final.js';
import { QuizRecap } from './quiz.js';

const KEY = 'rr:past';
const KEEP = 30;

export function pastParties() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list.filter((p) => p?.id && (p.game === 'quiz' ? p.quiz?.scores?.length : p.entries?.[p.final?.winner])) : [];
  } catch {
    return [];
  }
}

function write(list) {
  // Storage is small, so drop the oldest parties until it fits.
  for (let n = Math.min(list.length, KEEP); n > 0; n = Math.floor(n * 0.7)) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, n)));
      return;
    } catch {}
  }
}

// Everything the recap needs, taken from the final view.
export function snapshot(view) {
  const b = view.battle;
  return {
    id: `${view.code}-${view.final.at}`,
    code: view.code,
    at: view.final.at,
    meId: view.me.id,
    players: view.players.length,
    settings: view.settings,
    entries: view.entries,
    battle: { history: b.history, wins: b.wins, champions: b.champions || null, bracket: b.bracket || null, format: b.format || 'classic' },
    final: { winner: view.final.winner, pickers: view.final.pickers },
  };
}

export function saveParty(data) {
  write([data, ...pastParties().filter((p) => p.id !== data.id)]);
}

export function forgetParty(id) {
  write(pastParties().filter((p) => p.id !== id));
}

const when = (at) =>
  new Date(at).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

function PastList({ go }) {
  const list = pastParties();
  return html`<main class="app no-dock">
    <header class="topbar"><button class="btn btn-quiet btn-sm" onClick=${() => go('/')}>← Home</button></header>
    <p class="eyebrow">Saved on this phone</p>
    <h1 class="screen-title">Past parties</h1>
    <p class="screen-sub">Every party you finish is saved here: the champion and everyone's picks, or the quiz scores and songs.</p>
    ${list.length
      ? html`<div class="stack section">
          ${list.map((p) => {
            if (p.game === 'quiz') {
              const top = p.quiz.scores[0];
              const songs = p.quiz.history.length;
              return html`<button class="past-card" key=${p.id} onClick=${() => go(`/past/${encodeURIComponent(p.id)}`)}>
                <${Avatar} p=${top} size=${56} crown />
                <span class="grow">
                  <strong>🎤 ${top.id === p.meId ? 'You' : top.name} won Who sings it?</strong>
                  <span>${top.points.toLocaleString()} points</span>
                  <span class="past-meta">
                    ${when(p.at)} · ${songs} ${songs === 1 ? 'song' : 'songs'} · ${p.players} ${p.players === 1 ? 'player' : 'players'}
                    ${p.settings.theme ? html` · ${themeEmoji(p.settings.theme)} ${themeTitle(p.settings.theme)}` : null}
                  </span>
                </span>
                <span class="chev">›</span>
              </button>`;
            }
            const champ = p.entries[p.final.winner];
            const kind = p.settings.kind;
            const count = Object.keys(p.entries).length;
            return html`<button class="past-card" key=${p.id} onClick=${() => go(`/past/${encodeURIComponent(p.id)}`)}>
              <${Cover} item=${champ} tiny />
              <span class="grow">
                <strong>👑 ${champ.title}</strong>
                <span>${(kind === 'movie' ? champ.year : champ.artist) || noun(kind)}</span>
                <span class="past-meta">
                  ${when(p.at)} · ${count} ${noun(kind, count)} · ${p.players} ${p.players === 1 ? 'player' : 'players'}
                  ${p.settings.theme ? html` · ${themeEmoji(p.settings.theme)} ${themeTitle(p.settings.theme)}` : null}
                </span>
              </span>
              <span class="chev">›</span>
            </button>`;
          })}
        </div>`
      : html`<div class="empty section"><span class="big">📜</span>No parties yet. Finish one and its recap shows up here.</div>`}
  </main>`;
}

function PastRecap({ id, go }) {
  const data = pastParties().find((p) => p.id === id);
  if (!data) return html`<${PastList} go=${go} />`;
  const remove = () => {
    if (!confirm('Remove this party from this phone?')) return;
    forgetParty(id);
    go('/past');
  };
  return html`<main class="app">
    <header class="topbar"><button class="btn btn-quiet btn-sm" onClick=${() => go('/past')}>← Past parties</button></header>
    <p class="past-when">${when(data.at)} · party ${data.code}</p>
    ${data.game === 'quiz' ? html`<${QuizRecap} data=${data} />` : html`<${Recap} data=${data} />`}
    <div class="center section"><button class="btn btn-quiet btn-sm" onClick=${remove}>🗑️ Remove from this phone</button></div>
    <div class="dock">
      <button class="btn btn-hot btn-block btn-xl" onClick=${() => go('/')}>🎧 Start a new party</button>
    </div>
  </main>`;
}

export function Past({ id, go }) {
  return id ? html`<${PastRecap} id=${id} go=${go} />` : html`<${PastList} go=${go} />`;
}
