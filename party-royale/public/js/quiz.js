// Who Sings It? The music quiz: the lobby and its rules, each song (a 3-2-1,
// type the answer with names popping up as you go, or take a hint for four
// choices; then the reveal), the double-or-nothing bet, and the final scores.
import { html, useState, useEffect, useMemo, useRef } from './lib.js';
import { request } from './api.js';
import { Avatar, Confetti, Countdown, Cover, PlayButton, Seg, Sheet, ThemeBanner, places, playClip, stopPreview, themeEmoji, themeTitle, toast, useGame, useNow, usePreview } from './ui.js';
import { ShareBody, ThemePicker, WhosHere } from './lobby.js';
import { Podium } from './final.js';
import { saveParty } from './past.js';
import { Guide, GuideSheet, markSeen, useGuide } from './howto.js';
import { sfx } from './sfx.js';

const fmt = (n) => Number(n || 0).toLocaleString();
const signed = (n) => (n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : '±0');
const SHAPES = ['▲', '◆', '●', '■'];
const listNames = (names) => (names.length > 1 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : names[0]);

const ANSWER_HELP = {
  type: 'Type it: names pop up as you type. Stuck? A hint shows four choices, for half the points',
  choice: 'Four choices every time, no typing. Easiest for little ones',
};

const LEVEL_HELP = {
  easy: 'The biggest hits: songs everybody knows',
  medium: 'Hits and fan favorites',
  hard: 'Deeper cuts and hidden gems, for real music nerds',
};

const ASK_HELP = {
  artist: 'A song plays: who sings it?',
  song: 'A song plays: what is it called? (The choices are all by the same artist)',
  mix: 'Take turns: name the artist, then the song, then the artist…',
};

// ------------------------------------------------------------ lobby

export function quizSummary(s) {
  return [
    s.theme ? `${themeEmoji(s.theme)} ${themeTitle(s.theme)}` : '🎲 Hits and classics',
    { artist: '🎤 Name the artist', song: '🎵 Name the song', mix: '🔀 Artist or song' }[s.ask],
    s.answers === 'choice' ? '🔘 Pick from four' : '⌨️ Type it (💡 hints for half points)',
    { easy: '🙂 Easy: the biggest hits', medium: '😎 Medium', hard: '🔥 Hard: deeper cuts' }[s.level],
    `🎶 ${s.rounds} songs`,
    `⏱ ${s.seconds}s to answer`,
    s.wager ? '💰 Double or nothing to finish' : null,
    s.sound === 'host' ? "🔈 Music plays on the host's phone" : '📱 Music plays on every phone',
    s.clean ? '🧼 Clean songs only' : null,
  ].filter(Boolean);
}

export function QuizRules() {
  const { view, act } = useGame();
  const s = view.settings;
  const set = (patch) => {
    sfx.tap();
    act({ type: 'settings', settings: patch });
  };
  if (!view.me.host || view.phase !== 'lobby') {
    return html`<div class="rules-summary">${quizSummary(s).map((t) => html`<span class="pill">${t}</span>`)}</div>`;
  }
  return html`<div class="card">
    <div class="rule rule-col">
      <div class="rule-text">
        <strong>What kind of music?</strong>
        <span>${s.theme ? 'Every song fits the theme' : "Optional: today's hits and all-time classics, or pick a genre, decade or vibe"}</span>
      </div>
      <${ThemePicker} theme=${s.theme} set=${set} kind="song" />
    </div>
    <div class="rule rule-col">
      <div class="rule-text"><strong>How hard?</strong><span>${LEVEL_HELP[s.level]}</span></div>
      <${Seg} label="How hard" value=${s.level}
        options=${[['easy', '🙂 Easy'], ['medium', '😎 Medium'], ['hard', '🔥 Hard']]}
        onChange=${(v) => set({ level: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text"><strong>What do you name?</strong><span>${ASK_HELP[s.ask]}</span></div>
      <${Seg} label="What to name" value=${s.ask} className="stacked"
        options=${[['artist', '🎤', 'The artist'], ['song', '🎵', 'The song'], ['mix', '🔀', 'Mix']].map(
          ([v, emoji, text]) => [v, html`<span class="seg-emoji">${emoji}</span>${text}`],
        )}
        onChange=${(v) => set({ ask: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text"><strong>How do you answer?</strong><span>${ANSWER_HELP[s.answers]}</span></div>
      <${Seg} label="How to answer" value=${s.answers} className="stacked"
        options=${[['type', '⌨️', 'Type it'], ['choice', '🔘', 'Pick from 4']].map(
          ([v, emoji, text]) => [v, html`<span class="seg-emoji">${emoji}</span>${text}`],
        )}
        onChange=${(v) => set({ answers: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text"><strong>How many songs?</strong><span>${s.wager ? 'Plus one more for the double-or-nothing finale' : 'About half a minute each'}</span></div>
      <${Seg} label="Songs" value=${s.rounds} options=${[5, 10, 15, 20].map((n) => [n, String(n)])} onChange=${(v) => set({ rounds: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text"><strong>Time to answer</strong><span>A right answer scores 100, plus up to 50 more for answering fast</span></div>
      <${Seg} label="Time to answer" value=${s.seconds} options=${[10, 15, 20, 30].map((n) => [n, `${n}s`])} onChange=${(v) => set({ seconds: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text">
        <strong>Double or nothing</strong>
        <span>${s.wager
          ? 'Before the last song, everyone bets some or all of their points. Right: win that much. Wrong: lose it'
          : 'Off: the last song is like all the others'}</span>
      </div>
      <${Seg} label="Double or nothing" value=${s.wager ? 'on' : 'off'} options=${[['on', '💰 On'], ['off', 'Off']]} onChange=${(v) => set({ wager: v === 'on' })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text">
        <strong>Where the music plays</strong>
        <span>${s.sound === 'host'
          ? "On your phone, for everyone to hear. Best when you're all in one room (even better on a speaker)"
          : "On every phone at once. Best when you're playing from different places"}</span>
      </div>
      <${Seg} label="Where the music plays" value=${s.sound} options=${[['host', '🔈 My phone'], ['all', '📱 Every phone']]} onChange=${(v) => set({ sound: v })} />
    </div>
    <div class="rule rule-col">
      <div class="rule-text"><strong>Explicit lyrics</strong><span>${s.clean ? 'Explicit songs are left out' : 'Anything goes'}</span></div>
      <${Seg} label="Explicit lyrics" value=${s.clean ? 'clean' : 'any'} options=${[['any', '🔊 Allowed'], ['clean', '🧼 Clean only']]}
        onChange=${(v) => set({ clean: v === 'clean' })} />
    </div>
  </div>`;
}

export function QuizLobby() {
  const { view, act, code } = useGame();
  const host = view.players.find((p) => p.host);
  const theme = view.settings.theme;
  const picking = theme ? `Picking ${themeTitle(theme)} songs` : 'Picking the songs';
  const start = () => {
    sfx.whoosh();
    act({ type: 'start' });
  };
  return html`<div>
    <p class="eyebrow">🎤 Who sings it?</p>
    <h1 class="screen-title">Get the crew in here</h1>
    <p class="screen-sub">A song plays and everyone picks the answer on their own phone. The faster you're right, the more you score.</p>
    ${view.settings.theme ? html`<div class="section"><${ThemeBanner} theme=${view.settings.theme} /></div>` : null}

    <div class="card card-glow share-card section"><${ShareBody} code=${code} /></div>
    <${WhosHere} />

    <section class="section">
      <div class="section-head"><h2>Quiz rules</h2>${view.me.host ? html`<span class="tag">tap to change</span>` : null}</div>
      <${QuizRules} />
    </section>

    <div class="dock">
      ${view.me.host
        ? html`<div>
            <button class="btn btn-gold btn-block btn-xl" disabled=${view.loading} onClick=${start}>
              ${view.loading ? html`<span class="spinner small" /> ${picking}…` : '🎤 Start the quiz'}
            </button>
            <p class="dock-note">${view.players.length < 2 ? 'Tip: wait for a few people. Late arrivals can still join.' : 'People who join later can still play.'}</p>
          </div>`
        : html`<div class="card center" style=${{ padding: '16px' }}>
            <strong class="dots">${view.loading ? `🎵 ${picking}` : `Waiting for ${host ? host.name : 'the host'} to start`}</strong>
          </div>`}
    </div>
  </div>`;
}

// ------------------------------------------------------------ the game

// Four big buttons: a multiple-choice game, or after a hint.
function Options({ q, mine, onPick, waiting }) {
  const options = q.options.length ? q.options : ['', '', '', ''];
  return html`<div class="qz-options ${mine ? 'locked' : ''}">
    ${options.map(
      (o, i) => html`<button class="qz-option o${i} ${mine === o ? 'chosen' : ''}" key=${o || i} disabled=${!!mine || waiting || !o} onClick=${() => onPick(o)}>
        <span class="shape" aria-hidden="true">${SHAPES[i]}</span>
        <span class="label">${waiting || !o ? '· · ·' : o}</span>
        ${mine === o ? html`<span class="who"><b>🔒</b></span>` : null}
      </button>`,
    )}
  </div>`;
}

// Type the answer: names pop up as you type, and a tap locks one in.
const suggestCache = new Map();
function AnswerBox({ ask, waiting, onSubmit, onHint, canHint, onFocus }) {
  const [text, setText] = useState('');
  const [list, setList] = useState([]);
  const box = useRef(null);
  const kind = ask === 'song' ? 'song' : 'artist';
  const query = text.trim();
  useEffect(() => {
    if (query.length < 2) return setList([]);
    const key = `${kind}:${query.toLowerCase()}`;
    if (suggestCache.has(key)) return setList(suggestCache.get(key));
    let live = true;
    const t = setTimeout(async () => {
      try {
        const { results } = await request(`/api/music/suggest?${new URLSearchParams({ kind, q: query })}`);
        if (suggestCache.size > 300) suggestCache.clear();
        suggestCache.set(key, results);
        if (live) setList(results);
      } catch {}
    }, 220);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [query, kind]);
  const submit = (value) => value.trim() && onSubmit(value.trim());
  const focus = () => {
    onFocus?.();
    // Keep the box and its suggestions above the keyboard.
    setTimeout(() => box.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 250);
  };
  return html`<div class="qz-answer" ref=${box}>
    <form onSubmit=${(e) => (e.preventDefault(), submit(text))}>
      <div class="input-icon">
        <span>🔍</span>
        <input class="input qz-input" type="search" value=${text} disabled=${waiting}
          placeholder=${waiting ? 'Get ready…' : ask === 'song' ? 'Type the song name…' : 'Type the artist…'}
          aria-label=${ask === 'song' ? 'The song' : 'The artist'}
          autocomplete="off" autocorrect="off" autocapitalize="words" spellcheck="false" enterkeyhint="send"
          onFocus=${focus} onInput=${(e) => setText(e.target.value)} />
      </div>
    </form>
    ${list.length
      ? html`<div class="qz-suggest" role="listbox">
          ${list.map(
            (m) => html`<button class="qz-suggest-item" role="option" key=${`${m.title}|${m.artist || ''}`} onClick=${() => submit(m.title)}>
              <span class="qz-sg-pic">${m.cover ? html`<img src=${m.cover} alt="" loading="lazy" />` : kind === 'song' ? '🎵' : '🎤'}</span>
              <span class="grow"><strong>${m.title}</strong>${m.artist ? html`<span>${m.artist}</span>` : null}</span>
              <span class="qz-sg-go" aria-hidden="true">→</span>
            </button>`,
          )}
        </div>`
      : null}
    ${query.length >= 2
      ? html`<button class="btn btn-hot btn-block" onClick=${() => submit(text)}>🔒 Lock in “${query}”</button>`
      : null}
    ${canHint
      ? html`<button class="btn btn-quiet btn-block qz-hint-btn" disabled=${waiting} onClick=${onHint}>💡 Need a hint? See 4 choices (half points)</button>`
      : null}
  </div>`;
}

// Everyone's answers, right ones first (fastest at the top).
function Answers({ r, players, meId }) {
  const rows = players
    .map((p) => ({ p, choice: r.choices[p.id], right: r.right.indexOf(p.id), points: r.points[p.id] || 0, hint: r.hints?.includes(p.id) }))
    .sort((x, y) => (x.right < 0) - (y.right < 0) || x.right - y.right || (x.choice == null) - (y.choice == null));
  return html`<div class="card qz-answers">
    ${rows.map(
      ({ p, choice, right, points, hint }) => html`<div class="qz-answer-row ${right >= 0 ? 'good' : choice == null ? 'none' : 'bad'}" key=${p.id}>
        <${Avatar} p=${p} size=${30} />
        <span class="grow">
          <span class="w">${p.id === meId ? 'You' : p.name}${hint ? html` <span class="tag">💡 hint</span>` : null}</span>
          <span class="qz-said">${choice == null ? 'No answer' : `“${choice}”`}</span>
        </span>
        <span class="qz-mark">${right >= 0 ? (points ? signed(points) : '✓') : points ? signed(points) : choice == null ? '' : '✗'}</span>
      </div>`,
    )}
  </div>`;
}

function Standings({ scores, meId, limit = Infinity }) {
  const at = places(scores, (r) => r.points);
  return html`<div class="road qz-standings">
    ${scores.slice(0, limit).map(
      (r, i) => html`<div class="road-row ${r.id === meId ? 'me' : ''}" key=${r.id}>
        <span class="r">#${at[i]}</span>
        <${Avatar} p=${r} size=${32} />
        <span class="grow"><span class="w">${r.id === meId ? 'You' : r.name}</span><br /><span class="small muted">${r.right} right</span></span>
        ${r.delta ? html`<span class="qz-delta ${r.delta > 0 ? 'up' : 'down'}">${signed(r.delta)}</span>` : null}
        <span class="score">${fmt(r.points)}</span>
      </div>`,
    )}
  </div>`;
}

function Verdict({ q, meId }) {
  const r = q.result;
  const got = r.right.includes(meId);
  const delta = r.points[meId] || 0;
  const answered = meId in r.choices;
  let text;
  if (r.final) {
    text = got
      ? delta ? `💰 Right! You win ${fmt(delta)}` : '✓ Right! (you bet nothing)'
      : delta ? `💸 Wrong! You lose ${fmt(-delta)}` : answered ? '✗ Wrong, but you bet nothing' : '⏱ No answer';
  } else {
    text = got ? `✓ You got it! +${fmt(delta)}${r.hints?.includes(meId) ? ' (💡 half for the hint)' : ''}` : answered ? `✗ Not this time: it's ${r.answer}` : `⏱ Too slow! It's ${r.answer}`;
  }
  return html`<div class="qz-verdict ${got ? 'good' : 'bad'}">${text}</div>`;
}

function Bet({ q, meId, act }) {
  const b = q.bet;
  const myPoints = q.scores.find((r) => r.id === meId)?.points || 0;
  const [amount, setAmount] = useState(() => Math.min(b.max, Math.round(b.max / 20) * 10));
  const [busy, setBusy] = useState(false);
  const hint = [b.decade && `The ${b.decade}`, b.genre].filter(Boolean).join(' · ');
  const lock = async () => {
    setBusy(true);
    sfx.pop();
    if (!(await act({ type: 'wager', amount }))) setBusy(false);
  };
  return html`<div class="qz-bet">
    <h1 class="duel-title">💰 Double <span class="hl">or nothing</span></h1>
    <p class="screen-sub center">One last song. Bet some or all of your points: get it right and win that much, get it wrong and lose it.</p>
    <div class="card qz-hint">
      <span class="eyebrow">The last song</span>
      <strong>${hint || 'Could be anything 🎲'}</strong>
      <span>${q.ask === 'song' ? '🎵 Name the song' : '🎤 Name the artist'}</span>
    </div>
    ${b.mine == null
      ? html`<div class="card qz-wager">
          <p class="small muted center">
            You have <b>${fmt(myPoints)}</b> ${myPoints === 1 ? 'point' : 'points'}${myPoints < b.max ? html`<br />Low on points? You can still bet up to ${fmt(b.max)}` : ''}
          </p>
          <div class="qz-amount" aria-live="polite">${fmt(amount)}</div>
          <input class="qz-range" type="range" min="0" max=${b.max} step="10" value=${amount} aria-label="Your bet"
            onInput=${(e) => setAmount(Math.min(b.max, Number(e.target.value)))} />
          <div class="chips qz-quick">
            ${[['Nothing', 0], ['Half', Math.round(b.max / 2)], ['All in 🔥', b.max]].map(
              ([label, v]) => html`<button class="chip ${amount === v ? 'on' : ''}" key=${label} onClick=${() => (sfx.tap(), setAmount(v))}>${label}</button>`,
            )}
          </div>
          <button class="btn btn-gold btn-block btn-xl" disabled=${busy} onClick=${lock}>🔒 Lock in ${fmt(amount)}</button>
        </div>`
      : html`<div class="card center qz-locked">
          <span class="big">🔒</span>
          <strong>Your bet: ${fmt(b.mine)}</strong>
          <span class="small muted">No take-backs! The last song starts once everyone's in.</span>
        </div>`}
  </div>`;
}

// Before the first song: how to play, on every phone. It starts when every
// guest taps "I'm ready", or when the host starts it.
export function QuizIntro() {
  const { view, act, code } = useGame();
  const q = view.quiz;
  const me = view.players.find((p) => p.id === view.me.id);
  const host = view.players.find((p) => p.host);
  const here = view.players.filter((p) => p.online);
  const guests = here.filter((p) => !p.host);
  const readyCount = guests.filter((p) => p.voted).length;
  useEffect(() => markSeen(code, 'quiz'), []);
  const ready = () => {
    sfx.pop();
    act({ type: 'ready' });
  };
  const start = () => {
    sfx.whoosh();
    act({ type: 'next', round: 0, stage: 'intro' });
  };
  return html`<div class="quiz">
    <p class="eyebrow">🎤 Who sings it? · ${q.total} songs${q.finale ? ' + a finale' : ''}</p>
    <h1 class="screen-title">How to play</h1>
    <p class="screen-sub">Have a quick read: the first song starts when everyone's ready.</p>
    <div class="section"><${Guide} part="quiz" /></div>
    <div class="voters">
      <p class="small muted" style=${{ fontWeight: 800 }}>${guests.length ? `${readyCount} of ${guests.length} ready` : 'Just you so far'}</p>
      <div class="face-row">
        ${here.map((p) => html`<${Avatar} key=${p.id} p=${p} size=${36} className=${p.voted ? '' : 'waiting'} badge=${p.voted ? '✓' : null} />`)}
      </div>
    </div>
    <div class="dock">
      ${view.me.host
        ? html`<div>
            <button class="btn btn-gold btn-block btn-xl" onClick=${start}>▶ Start the first song</button>
            <p class="dock-note">${guests.length
              ? readyCount === guests.length ? "Everyone's ready!" : `${readyCount} of ${guests.length} ready. It starts by itself once everyone is.`
              : 'Playing solo? Start whenever you like.'}</p>
          </div>`
        : me?.voted
          ? html`<div class="card center" style=${{ padding: '14px' }}><strong class="dots">✓ You're ready! Waiting for ${guests.length - readyCount ? 'the others' : host ? host.name : 'the host'}</strong></div>`
          : html`<button class="btn btn-hot btn-block btn-xl" onClick=${ready}>I'm ready! 🙌</button>`}
    </div>
  </div>`;
}

export function QuizGame() {
  const { view, act, code, sess, offset } = useGame();
  const q = view.quiz;
  const s = view.settings;
  const meId = view.me.id;
  const now = useNow(offset, 150);
  const [pending, setPending] = useState(null); // an answer on its way to the server
  const [sheet, setSheet] = useState(false);
  const [alsoHere, setAlsoHere] = useState(false); // play on this phone too, when the host's phone is the speaker
  const [blocked, setBlocked] = useState(false); // the phone wants a tap before it plays
  const [typing, setTyping] = useState(false); // the answer box has the keyboard up
  // Joined after the how-to-play screen? It shows between songs instead.
  const [guide, setGuide] = useGuide('quiz', { auto: q.stage === 'reveal' });
  const urls = useRef({});
  const host = view.players.find((p) => p.host);
  const listen = s.sound === 'all' || view.me.host || alsoHere;
  const key = `quiz:${view.code}:${q.round}`;
  const audio = usePreview();
  const playingHere = audio?.key === key;

  const clip = (round) =>
    urls.current[round]
      ? Promise.resolve(urls.current[round])
      : request(`/api/rooms/${code}/clip?${new URLSearchParams({ round, p: sess.playerId, s: sess.secret })}`).then((r) => (urls.current[round] = r.url));
  const play = async () => {
    const url = await clip(q.round).catch(() => null);
    if (!url) return toast("Couldn't load this song 😕", 'error');
    setBlocked(!(await playClip(url, key)));
  };

  // Each song starts on cue, right after the 3-2-1.
  const playing = q.stage === 'play';
  useEffect(() => {
    setPending(null);
    setBlocked(false);
    setTyping(false);
    if (!playing || !listen) return;
    clip(q.round).catch(() => {});
    const t = setTimeout(play, Math.max(0, q.startsAt - (Date.now() + offset.current)));
    return () => clearTimeout(t);
  }, [q.round, playing, listen]);
  useEffect(() => {
    if (q.stage === 'wager') stopPreview();
  }, [q.stage]);
  useEffect(() => stopPreview, []);

  // A sound for how you did.
  const shown = useRef(null);
  useEffect(() => {
    if (q.stage !== 'reveal' || shown.current === q.round) return;
    shown.current = q.round;
    if (q.result.right.includes(meId)) sfx.right();
    else sfx.wrong();
  }, [q.stage, q.round]);

  const before = playing && now < q.startsAt;
  const count = Math.ceil((q.startsAt - now) / 1000);
  useEffect(() => {
    if (before && count > 0) sfx.tick();
  }, [count]);

  const mine = pending || q.myAnswer;
  const pick = async (choice) => {
    if (mine) return;
    sfx.tap();
    setPending(choice);
    if (!(await act({ type: 'answer', round: q.round, choice }))) setPending(null);
  };
  const choosing = s.answers === 'choice' || q.hinted;
  const hint = () => {
    sfx.tap();
    act({ type: 'hint', round: q.round });
  };
  const advance = () => {
    sfx.tap();
    act({ type: 'next', round: q.round, stage: q.stage });
  };

  const here = view.players.filter((p) => p.online);
  const waitingOn = here.filter((p) => !p.voted);
  const myRow = q.scores.find((r) => r.id === meId);
  const songs = q.total + (q.finale ? 1 : 0);
  const left = q.endsAt ? Math.max(0, q.endsAt - now) : 0;
  const share = playing && !before ? left / (q.endsAt - q.startsAt) : 1;
  const nextLabel = q.round < q.total ? '▶ Next song' : q.finale && q.round === q.total ? '💰 On to the final bet' : '🏆 See the final scores';
  const question = q.ask === 'song' ? html`What's this <span class="hl">song?</span>` : html`Who <span class="hl">sings it?</span>`;
  const r = q.result;

  return html`<div class="quiz">
    <div class="round-row">
      <span class="pill ${q.final || q.stage === 'wager' ? 'pill-gold' : 'pill-hot'}">${q.final || q.stage === 'wager' ? '💰 The final song' : `🎵 Song ${q.round} of ${q.total}`}</span>
      ${q.stage === 'wager' ? html`<${Countdown} endsAt=${q.endsAt} offset=${offset} />` : null}
      <button class="pill qz-me" onClick=${() => (sfx.tap(), setSheet(true))} aria-label="Scores">🏅 ${fmt(myRow?.points)}</button>
    </div>
    <div class="progress ${q.final ? 'gold' : ''}"><i style=${{ width: `${Math.max(4, ((q.round - (r ? 0 : 1)) / songs) * 100)}%` }} /></div>

    ${q.stage === 'wager'
      ? html`<${Bet} q=${q} meId=${meId} act=${act} key="bet" />`
      : q.stage === 'play'
        ? html`<div key=${`play${q.round}`}>
            <h1 class="duel-title">${question}</h1>
            ${q.final ? html`<p class="center"><span class="pill pill-gold">💰 Your bet: ${fmt(q.bet?.mine || 0)}</span></p>` : null}
            <div class="qz-stage ${typing && !before ? 'small' : ''}">
              <div class="qz-disc ${playingHere ? 'spin' : ''}" aria-hidden="true">${before ? null : html`<span>?</span>`}</div>
              ${before ? html`<div class="qz-count" key=${count}>${count}</div>` : null}
            </div>
            <div class="qz-timer ${share < 0.25 ? 'low' : ''}"><i style=${{ width: `${share * 100}%` }} /><span>${before ? 'Get ready…' : `${Math.ceil(left / 1000)}s`}</span></div>
            <div class="qz-sound">
              ${listen
                ? blocked
                  ? html`<button class="btn btn-gold btn-sm" onClick=${play}>🔊 Tap to hear it</button>`
                  : !before
                    ? html`<button class="chip soft" onClick=${play}>${playingHere ? '🔊 Playing · start over' : '🔊 Play it again'}</button>`
                    : null
                : html`<span>🔈 Listen to ${host ? `${host.name}'s` : "the host's"} phone</span>
                    <button class="chip soft" onClick=${() => (setAlsoHere(true), play())}>Play it here too</button>`}
            </div>
            ${choosing
              ? html`${q.hinted ? html`<p class="center small muted qz-hint-note">💡 Hint: it's one of these (half points)</p>` : null}
                  <${Options} q=${q} mine=${mine} onPick=${pick} waiting=${before} />`
              : mine
                ? html`<div class="card center qz-locked"><span class="big">🔒</span><strong>“${mine}”</strong><span class="small muted">Locked in! Let's see…</span></div>`
                : html`<${AnswerBox} key=${q.round} ask=${q.ask} waiting=${before} onSubmit=${pick} onHint=${hint} canHint=${!before} onFocus=${() => setTyping(true)} />`}
            <div class="voters">
              <p class="small muted" style=${{ fontWeight: 800 }}>
                ${mine
                  ? `${q.done} of ${here.length} answered`
                  : before
                    ? choosing ? 'The choices show up when the song starts' : 'Get ready to type!'
                    : choosing ? 'Tap your answer. Faster scores more!' : 'Faster scores more!'}
              </p>
              <div class="face-row">
                ${here.map((p) => html`<${Avatar} key=${p.id} p=${p} size=${36} className=${p.voted ? '' : 'waiting'} badge=${p.voted ? '✓' : null} />`)}
              </div>
              ${view.me.host && q.done > 0 && waitingOn.length
                ? html`<button class="btn btn-quiet btn-sm" style=${{ marginTop: '12px' }} onClick=${advance}>Reveal it now</button>`
                : null}
            </div>
          </div>`
        : html`<div key=${`reveal${q.round}`}>
            <div class="qz-song card">
              <${Cover} item=${r.song} />
              <div class="grow">
                <p class="eyebrow">${r.final ? 'The final song was…' : r.right.length ? `${r.right.length} of ${Object.keys(r.choices).length} got it` : 'Nobody got it!'}</p>
                <h2>${r.song.title}</h2>
                <p class="qz-artist">${r.song.artist}</p>
                <p class="small muted">${[r.song.album, r.song.year].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
            <${Verdict} q=${q} meId=${meId} />
            <${Answers} r=${r} players=${view.players} meId=${meId} />
            ${r.fastest && !r.final
              ? html`<p class="center qz-fast"><span class="pill">⚡ Fastest: ${r.fastest === meId ? 'you!' : view.players.find((p) => p.id === r.fastest)?.name || '?'}</span></p>`
              : null}
            <section class="section">
              <div class="section-head"><h2>🏅 Scores</h2>${q.scores.length > 5 ? html`<button class="chip soft" onClick=${() => setSheet(true)}>All ${q.scores.length}</button>` : null}</div>
              <div class="card"><${Standings} scores=${q.scores} meId=${meId} limit=${5} /></div>
            </section>
          </div>`}

    <div class="dock">
      ${q.stage === 'reveal'
        ? view.me.host
          ? html`<button class="btn ${q.round === q.total && q.finale ? 'btn-gold' : 'btn-hot'} btn-block btn-xl" onClick=${advance}>${nextLabel}</button>`
          : html`<div class="card center" style=${{ padding: '14px' }}><strong class="dots">Waiting for ${host ? host.name : 'the host'}</strong></div>`
        : q.stage === 'wager' && q.bet?.mine != null
          ? html`<div class="card center" style=${{ padding: '14px' }}>
              <strong class="dots">${waitingOn.length ? `Waiting on ${waitingOn.map((p) => p.name).slice(0, 3).join(', ')}` : 'Here it comes'}</strong>
              ${view.me.host && waitingOn.length
                ? html`<div style=${{ marginTop: '8px' }}><button class="btn btn-quiet btn-sm" onClick=${advance}>Start the last song now</button></div>`
                : null}
            </div>`
          : null}
    </div>

    <${Sheet} open=${sheet} onClose=${() => setSheet(false)} title="🏅 Scores">
      <${Standings} scores=${q.scores} meId=${meId} />
      <p class="small muted" style=${{ marginTop: '14px' }}>✓ 100 for a right answer, plus up to 50 for speed${s.answers === 'type' ? ' · 💡 half with a hint' : ''}${q.finale ? ' · 💰 the last song is double or nothing' : ''}</p>
      <button class="chip soft" style=${{ marginTop: '12px' }} onClick=${() => (setSheet(false), setGuide(true))}>❓ How to play</button>
    </${Sheet}>
    <${GuideSheet} part="quiz" open=${guide} onClose=${() => setGuide(false)} />
  </div>`;
}

// ------------------------------------------------------------ the end

export function quizSnapshot(view) {
  return {
    id: `${view.code}-${view.final.at}`,
    game: 'quiz',
    code: view.code,
    at: view.final.at,
    meId: view.me.id,
    players: view.players.length,
    settings: view.settings,
    quiz: { scores: view.quiz.scores, history: view.quiz.history || [], total: view.quiz.total, finale: view.quiz.finale },
  };
}

export function QuizRecap({ data, live }) {
  const { scores, history } = data.quiz;
  const top = scores[0];
  const winners = top ? scores.filter((r) => r.points === top.points) : [];
  const nameOf = (p) => (p.id === data.meId ? 'You' : p.name);
  return html`<div>
    ${live ? html`<${Confetti} burst=${data.at} />` : null}
    <div class="final-hero">
      <div class="rays-wrap" aria-hidden="true"><div class="rays" /></div>
      <p class="eyebrow">🎤 Who sings it? · ${winners.length > 1 ? "It's a tie!" : 'And the winner is…'}</p>
      <div class="qz-winners">${winners.map((p) => html`<${Avatar} key=${p.id} p=${p} size=${winners.length > 1 ? 84 : 112} crown />`)}</div>
      <h1 class="champ-title">${winners.length ? listNames(winners.map(nameOf)) : 'Nobody'}</h1>
      ${top ? html`<p class="champ-meta">${fmt(top.points)} points · ${top.right} of ${history.length} right</p>` : null}
      ${data.settings.theme ? html`<div class="champ-stats"><span class="pill">${themeEmoji(data.settings.theme)} ${themeTitle(data.settings.theme)}</span></div>` : null}
    </div>

    <${Podium} pickers=${scores.map((r) => ({ ...r, champ: r.points === top.points }))} meId=${data.meId}
      title="🏅 Final scores" tag=${`${history.length} songs`} icon="🏅" />

    <section class="section">
      <div class="section-head"><h2>🎵 The songs</h2><span class="tag">▶ to hear one again</span></div>
      <div class="card qz-songs">
        ${history.map(
          (h) => html`<div class="qz-song-row ${h.final ? 'final' : ''}" key=${h.round}>
            <span class="r">${h.final ? '💰' : h.round}</span>
            <${Cover} item=${h.song} tiny><${PlayButton} item=${h.song} /></${Cover}>
            <span class="grow">
              <strong>${h.song.title}</strong>
              <span class="small">${[h.song.artist, h.song.year].filter(Boolean).join(' · ')}</span>
              <span class="small muted">${h.right.length ? `${h.right.length} got it` : 'Nobody got it'}${h.right.includes(data.meId) ? ' · ✓ you too' : ''}</span>
            </span>
          </div>`,
        )}
      </div>
    </section>
  </div>`;
}

export function QuizFinal() {
  const { view, act } = useGame();
  const data = useMemo(() => quizSnapshot(view), [view.final.at, view.quiz.history?.length]);
  // Keep a copy on this phone for "Past parties".
  useEffect(() => saveParty(data), [data.id]);
  useEffect(() => sfx.fanfare(), []);
  return html`<div>
    <${QuizRecap} data=${data} live />
    <div class="dock">
      ${view.me.host
        ? html`<div class="row">
            <button class="btn btn-ghost" style=${{ flex: 1 }} disabled=${view.loading} onClick=${() => (sfx.pop(), act({ type: 'again' }))}>⚙️ New rules</button>
            <button class="btn btn-hot" style=${{ flex: 1.4 }} disabled=${view.loading} onClick=${() => (sfx.whoosh(), act({ type: 'rematch' }))}>
              ${view.loading ? 'Picking songs…' : '🎤 Play again'}
            </button>
          </div>`
        : html`<div class="card center" style=${{ padding: '14px' }}><strong>${view.loading ? '🎵 New songs on the way' : '🎤 What a game!'}</strong></div>`}
    </div>
  </div>`;
}
