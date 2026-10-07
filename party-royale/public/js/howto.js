// How to play: the steps, the theme, how scoring works and how to win. Each
// guide shows up by itself when its part of the game begins (once per phone),
// and any time after from "❓ How to play".
//   fill    battle games, while everyone adds picks to the hat
//   battle  battle games, when the matchups start
//   quiz    Who Sings It?, just before the first song
import { html, useState, useEffect } from './lib.js';
import { store } from './api.js';
import { Sheet, ThemeBanner, noun, themeRule, useGame } from './ui.js';
import { sfx } from './sfx.js';

export const GUIDE_TITLE = {
  fill: '🎩 How to play: fill the hat',
  battle: '⚔️ How the battle works',
  quiz: '🎤 How to play Who sings it?',
};

// Which guide fits where the party is now.
export const guideFor = (view) => (view.game === 'quiz' ? 'quiz' : view.phase === 'battle' || view.phase === 'final' ? 'battle' : 'fill');

const TIES = {
  coin: 'A coin flip decides.',
  champ: 'The reigning champ keeps the crown (a coin flip decides the very first matchup).',
  keep: 'Both stay in and the next one joins them for a 3‑way showdown.',
};
const REVEAL = {
  hidden: 'Nobody ever finds out who added what 🤫',
  reveal: 'Who added each one is revealed once its matchup is decided.',
  open: 'You can see who added each one while you vote.',
};

function Steps({ steps }) {
  return html`<div class="how howto-steps">
    ${steps.filter(Boolean).map(
      ([icon, title, text]) => html`<div class="how-step" key=${title}>
        <span class="how-num" aria-hidden="true">${icon}</span>
        <div><strong>${title}</strong><span>${text}</span></div>
      </div>`,
    )}
  </div>`;
}

function Box({ title, rows, lines, className = '' }) {
  return html`<div class="howto-box ${className}">
    <h3>${title}</h3>
    ${(rows || []).filter(Boolean).map(
      ([pts, text]) => html`<div class="howto-pts" key=${text}><b>${pts}</b><span>${text}</span></div>`,
    )}
    ${(lines || []).filter(Boolean).map((t) => html`<p key=${t}>${t}</p>`)}
  </div>`;
}

const Theme = ({ s }) =>
  s.theme ? html`<${ThemeBanner} theme=${s.theme} sub=${(s.themeStrict !== false && themeRule(s.theme, s.kind)) || 'Keep it on theme!'} />` : null;

function battleScoring(s) {
  return s.scoring
    ? html`<${Box} title="🏅 The points game" rows=${[
        ['+1', `🕵️ For each right guess of who picked a ${noun(s.kind)}`],
        ['+2', '⭐ Each time one of your picks wins a matchup'],
        ['+3', '👑 If your pick is the champion'],
      ]} />`
    : html`<${Box} title="🏅 Scoring" lines=${['No points tonight: just vote for your favorites.', REVEAL[s.reveal]]} />`;
}

function battleWin(s) {
  const one = noun(s.kind);
  return html`<${Box} className="win" title="🏆 How to win" lines=${[
    `The last ${one} standing is the champion${s.kind === 'movie' ? ": that's tonight's movie" : ''}.`,
    s.scoring ? 'The player with the most points wins the game.' : 'Whoever picked it gets the bragging rights.',
  ]} />`;
}

function FillGuide({ s }) {
  const many = noun(s.kind, 2);
  const movie = s.kind === 'movie';
  const limit = s.maxPerPlayer
    ? s.minPerPlayer === s.maxPerPlayer
      ? `Add ${s.maxPerPlayer} ${noun(s.kind, s.maxPerPlayer)} each.`
      : `Add ${s.minPerPlayer ? `${s.minPerPlayer} to ` : 'up to '}${s.maxPerPlayer} ${many} each.`
    : s.minPerPlayer
      ? `Add at least ${s.minPerPlayer}, as many as you like.`
      : 'Add as many as you like.';
  const bracket = s.format !== 'classic';
  return html`<div class="howto">
    <${Theme} s=${s} />
    <${Steps} steps=${[
      ['🔍', `Add ${many}`, `Search any ${noun(s.kind)}, or tap ✨ Need ideas? to browse.${movie ? '' : ' ▶ plays a preview.'}`],
      ['🎯', 'How many', `${limit} Changed your mind? Tap ✕ to take one back out.`],
      ['🤫', 'Keep it secret', s.scoring ? "Nobody sees who added what. In the points game, everyone tries to guess, so surprise them!" : "Nobody sees who added what while you add them."],
      ['✅', 'Tap “I’m done”', s.submitSeconds ? `The battle starts when everyone's done, or when the ${Math.round(s.submitSeconds / 60)}‑minute timer runs out.` : "The battle starts when everyone's done (the host can start it sooner)."],
      ['⚔️', 'Then the battle', bracket ? `Your ${many} pair off in a bracket. Everyone votes, and the winners move on until one is left.` : `King of the hill: two at a time, everyone votes, and the winner stays on to face the next one.`],
    ]} />
    ${battleScoring(s)}
    ${battleWin(s)}
  </div>`;
}

function BattleGuide({ s, count }) {
  const many = noun(s.kind, 2);
  const movie = s.kind === 'movie';
  const bracket = s.format !== 'classic';
  const byes = bracket && count > 2 && (count & (count - 1)) !== 0;
  return html`<div class="howto">
    <${Theme} s=${s} />
    <${Steps} steps=${[
      bracket
        ? ['🗂️', 'The bracket', `${count ? `All ${count} ${many}` : `The ${many}`} pair off at random. The winner of each matchup moves on, round by round, to the final.${byes ? ' With an odd number, a few get a free pass (a bye) into round 2.' : ''}`]
        : ['👑', 'King of the hill', `Two come out of the hat. The winner stays on and takes on the next one, until the hat is empty.${s.champions ? ' Then every winner comes back for one last champions round.' : ''}`],
      ['👆', 'Vote', `Tap the one you like best. ${movie ? 'ⓘ shows what it’s about.' : '▶ plays a preview, or 🔊 plays both.'} You can change your vote until everyone's in.`],
      s.scoring ? ['🕵️', 'Guess who picked it', `The first time a ${noun(s.kind)} shows up, tap who you think added it (not your own).`] : null,
      ['⚖️', 'A tie?', bracket ? TIES.coin : TIES[s.ties]],
      s.voteSeconds ? ['⏱', `${s.voteSeconds} seconds a matchup`, 'Then the votes are counted, ready or not.'] : null,
      bracket || s.scoring ? ['📊', 'Where things stand', `Tap ${[bracket && '🗂️ The bracket', s.scoring && '🏅 Scores'].filter(Boolean).join(' or ')} at the top, any time.`] : null,
    ]} />
    ${battleScoring(s)}
    ${battleWin(s)}
  </div>`;
}

function QuizGuide({ s, host }) {
  const what = { artist: 'who sings it', song: 'the name of the song', mix: 'who sings it or the song (they take turns)' }[s.ask];
  const typing = s.answers !== 'choice';
  return html`<div class="howto">
    <${Theme} s=${s} />
    <${Steps} steps=${[
      ['🔊', 'A song plays', s.sound === 'host'
        ? `After a 3‑2‑1, ${host ? `${host}'s` : "the host's"} phone plays a 30-second clip for everyone. Want it closer? Tap “Play it here too”.`
        : 'After a 3‑2‑1, a 30-second clip plays on every phone.'],
      typing
        ? ['⌨️', `Type ${what}`, 'Names pop up as you type: tap one to lock it in. Close enough counts (a typo, capitals or “the” don’t matter).']
        : ['👆', `Pick ${what}`, 'Tap the right one of four.'],
      typing ? ['💡', 'Stuck?', 'Tap “Need a hint?” to see four choices, for half the points.'] : null,
      ['⚡', 'Be quick', `${s.seconds} seconds a song. The faster you're right, the more you score. No changing your answer!`],
      s.wager ? ['💰', 'Double or nothing', 'Before the last song you get a hint about it, then bet some or all of your points. Right: win your bet. Wrong: lose it.'] : null,
    ]} />
    <${Box} title="🏅 Scoring" rows=${[
      ['100', '✓ A right answer'],
      ['+50', '⚡ Up to this much more for answering fast'],
      typing ? ['½', '💡 Half the points with a hint'] : null,
      s.wager ? ['±', '💰 Your bet, on the last song'] : null,
    ]} />
    <${Box} className="win" title="🏆 How to win" lines=${[
      `${s.rounds} songs${s.wager ? ' plus the double-or-nothing finale' : ''}. The most points at the end wins.`,
      { easy: '🙂 Easy: the biggest hits.', medium: '😎 Medium: hits and fan favorites.', hard: '🔥 Hard: deeper cuts.' }[s.level],
    ]} />
  </div>`;
}

export function Guide({ part }) {
  const { view } = useGame();
  const s = view.settings;
  if (part === 'quiz') return html`<${QuizGuide} s=${s} host=${view.players.find((p) => p.host)?.name} />`;
  if (part === 'battle') return html`<${BattleGuide} s=${s} count=${view.battle ? view.battle.total + 1 : view.hatCount} />`;
  return html`<${FillGuide} s=${s} />`;
}

export function GuideSheet({ part, open, onClose }) {
  return html`<${Sheet} open=${open} onClose=${onClose} title=${GUIDE_TITLE[part]} className="howto-sheet">
    <${Guide} part=${part} />
    <button class="btn btn-hot btn-block btn-xl" style=${{ marginTop: '18px' }} onClick=${() => (sfx.tap(), onClose())}>Got it, let's play! 🎉</button>
  </${Sheet}>`;
}

// Opens a guide by itself the first time this phone reaches that part of the
// party (after `delay`, e.g. once an intro animation is done).
const seenKey = (code, part) => `rr:howto:${code}:${part}:${new Date().toDateString()}`;
export const markSeen = (code, part) => store.set(seenKey(code, part), true);

export function useGuide(part, { delay = 0, auto = true } = {}) {
  const { code } = useGame();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!auto || store.get(seenKey(code, part))) return;
    const t = setTimeout(() => {
      markSeen(code, part);
      setOpen(true);
    }, delay);
    return () => clearTimeout(t);
  }, [part, auto]);
  return [open, setOpen];
}
