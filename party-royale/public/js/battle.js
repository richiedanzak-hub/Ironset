// Head-to-head: two picks, everyone votes. In a bracket the winner moves on
// to the next round; in king of the hill it stays on. In the points game,
// everyone also guesses who picked what.
import { html, useState, useEffect, useRef } from './lib.js';
import { Avatar, Countdown, Cover, PlayButton, Sheet, bracketProgress, bracketRoundName, durationText, places, isMovie, itemMeta, noun, playAll, prefetchPreviews, runtimeText, stopPreview, useGame } from './ui.js';
import { sfx } from './sfx.js';

const names = (people) => {
  if (people.length === 1) return people[0].name;
  if (people.length === 2) return `${people[0].name} & ${people[1].name}`;
  return `${people[0].name} +${people.length - 1}`;
};

function Fighter({ m, badge, picked, outcome, tally, voters, fresh, canVote, onVote, onInfo }) {
  const title = m.title;
  const press = (e) => {
    if (!canVote) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onVote();
  };
  return html`<div
    class="fighter ${picked ? 'picked' : ''} ${outcome || ''} ${fresh ? 'fresh' : ''}"
    role="button"
    tabindex=${canVote ? 0 : -1}
    aria-pressed=${picked ? 'true' : 'false'}
    aria-disabled=${canVote ? 'false' : 'true'}
    aria-label=${canVote ? `Vote for ${title}` : title}
    onClick=${press}
    onKeyDown=${press}
  >
    ${outcome === 'won' ? null : badge}
    ${outcome === 'won' ? html`<span class="crown-top" aria-hidden="true">👑</span>` : null}
    <${Cover} item=${m} rating><${PlayButton} item=${m} /></${Cover}>
    <button class="fighter-info-btn" aria-label=${`About ${m.title}`} onClick=${(e) => (e.stopPropagation(), onInfo(m))}>i</button>
    ${picked && !outcome ? html`<span class="my-vote">Your pick ✓</span>` : null}
    ${outcome === 'lost' ? html`<span class="stamp">OUT</span>` : null}
    ${outcome === 'kept' ? html`<span class="stamp keep">STILL IN</span>` : null}
    <span class="fighter-title">${title}</span>
    <span class="fighter-meta">${itemMeta(m) || ' '}</span>
    ${m.by?.length
      ? html`<span class="fighter-by">
          <span class="face-stack">${m.by.slice(0, 2).map((p) => html`<${Avatar} key=${p.id} p=${p} size=${20} />`)}</span>
          <span class="who">${names(m.by)}'s pick</span>
        </span>`
      : m.mine
        ? html`<span class="fighter-by">🤫<span class="who"> Your pick</span></span>`
        : null}
    ${outcome
      ? html`<span class="tally">
          <b>${tally}</b>
          <span class="face-stack">${voters.slice(0, 6).map((p) => html`<${Avatar} key=${p.id} p=${p} size=${24} />`)}</span>
        </span>`
      : null}
  </div>`;
}

function CoinFlip({ a, b, winner, onDone }) {
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    sfx.coin();
    const t1 = setTimeout(() => {
      setLanded(true);
      sfx.reveal();
    }, 2150);
    const t2 = setTimeout(onDone, 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  const face = (m) => html`${[...m.title.replace(/^(the|a|an)\s+/i, '')][0]?.toUpperCase()}<small>${m.title}</small>`;
  return html`<div class="coin-overlay" onClick=${onDone}>
    <div>
      <h2>It's a tie! 🪙</h2>
      <div class="coin-scene">
        <div class="coin ${winner === a.id ? 'to-a' : 'to-b'}">
          <div class="coin-face">${face(a)}</div>
          <div class="coin-face back">${face(b)}</div>
        </div>
      </div>
      <p class="coin-caption">${landed ? `${(winner === a.id ? a : b).title} wins the toss!` : 'Flipping for it…'}</p>
    </div>
  </div>`;
}

function ShuffleIntro({ count, kind, bracket, onDone }) {
  useEffect(() => {
    sfx.whoosh();
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, []);
  return html`<div class="shuffle-overlay" onClick=${onDone}>
    <div>
      <div class="shuffle-hat">🎩${(kind === 'movie' ? ['🎬', '🍿', '🎟️'] : ['🎵', '💿', '🎤']).map((e) => html`<span class="fly">${e}</span>`)}</div>
      <h2>${bracket ? 'Building the bracket…' : 'Shuffling the hat…'}</h2>
      <p>${count} in the hat${bracket ? `, ${count - 1} matchups` : ''}. One champion.</p>
    </div>
  </div>`;
}

function ChampionsIntro({ items, kind, onDone }) {
  useEffect(() => {
    sfx.fanfare();
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, []);
  return html`<div class="shuffle-overlay" onClick=${onDone}>
    <div>
      <div class="champ-stack">${items.slice(0, 6).map((m) => html`<${Cover} key=${m.id} item=${m} tiny />`)}</div>
      <h2>🏆 Champions round!</h2>
      <p>${items.length} ${noun(kind, items.length)} won a matchup. Now they battle each other for the crown.</p>
    </div>
  </div>`;
}

function MovieInfo({ item }) {
  return html`<div class="row" style=${{ alignItems: 'flex-start', gap: '16px' }}>
      <${Cover} item=${item} rating />
      <div class="stack" style=${{ gap: '8px' }}>
        ${item.year ? html`<span class="pill">📅 ${item.year}</span>` : null}
        ${item.runtime ? html`<span class="pill">⏱ ${runtimeText(item.runtime)}</span>` : null}
        ${item.rating ? html`<span class="pill pill-gold">★ ${item.rating.toFixed(1)} / 10</span>` : null}
        ${item.genres?.length ? html`<span class="pill">${item.genres.slice(0, 3).join(' · ')}</span>` : null}
      </div>
    </div>
    ${item.overview ? html`<p>${item.overview}</p>` : null}`;
}

function ItemInfo({ item, onClose }) {
  return html`<${Sheet} open=${!!item} onClose=${onClose} title=${item?.title || ''} className="detail-sheet">
    ${item && isMovie(item)
      ? html`<${MovieInfo} item=${item} />`
      : item
      ? html`<div class="row" style=${{ alignItems: 'flex-start', gap: '16px' }}>
            <${Cover} item=${item} />
            <div class="stack" style=${{ gap: '8px' }}>
              ${item.artist ? html`<span class="pill">🎤 ${item.artist}</span>` : null}
              ${item.album ? html`<span class="pill">💿 ${item.album}</span>` : null}
              ${item.year ? html`<span class="pill">📅 ${item.year}</span>` : null}
              ${item.duration ? html`<span class="pill">⏱ ${durationText(item.duration)}</span>` : null}
              ${item.explicit ? html`<span class="pill pill-hot">🅴 Explicit</span>` : null}
            </div>
          </div>
          <div style=${{ marginTop: '18px' }}><${PlayButton} item=${item} big /></div>`
      : null}
  </${Sheet}>`;
}

function Roulette({ items, winner, onDone }) {
  const [i, setI] = useState(0);
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    const n = items.length;
    const steps = n * 4 + items.findIndex((m) => m.id === winner);
    let k = 0;
    let timer;
    const tick = () => {
      k += 1;
      setI(k % n);
      sfx.tick();
      if (k >= steps) {
        setLanded(true);
        sfx.reveal();
        timer = setTimeout(onDone, 1400);
        return;
      }
      timer = setTimeout(tick, 70 + (k / steps) ** 3 * 380);
    };
    timer = setTimeout(tick, 250);
    return () => clearTimeout(timer);
  }, []);
  return html`<div class="coin-overlay" onClick=${onDone}>
    <div>
      <h2>${items.length}‑way tie! 🎲</h2>
      <div class="roulette">
        ${items.map(
          (m, n) => html`<div class="roulette-row ${n === i ? 'on' : ''} ${landed && n === i ? 'won' : ''}" key=${m.id}>
            <${Cover} item=${m} tiny /><span>${m.title}</span>
          </div>`,
        )}
      </div>
      <p class="coin-caption">${landed ? `${items[i].title} wins the draw!` : 'Drawing one at random…'}</p>
    </div>
  </div>`;
}

function banner(result, b, entries) {
  const n = b.fighters.length;
  if (result.method === 'keep') {
    const k = result.survivors.length;
    const who = result.losers.length ? `The top ${k} stay in` : k === 2 ? 'Both stay in' : `All ${k} stay in`;
    return ["🤝 It's a tie!", `${who}. The next pick joins for a ${k + 1}‑way showdown`, true];
  }
  const w = entries[result.winner];
  if (result.method === 'coin') {
    return result.tied?.length > 2 ? ['🎲 Random draw!', `${w.title} wins the draw`, true] : ['🪙 Coin flip!', `${w.title} wins the toss`, true];
  }
  if (result.method === 'champ') return ['🤝 Dead heat!', `Ties go to the champ. ${w.title} holds on`, true];
  if (b.bracket) {
    if (result.last) return ['👑 We have a champion!', `${w.title} wins the bracket`, true];
    return ['⚡ Moving on!', `${w.title} goes through to the ${bracketRoundName(b.bracket, b.bracket.at.r + 1)}`, false];
  }
  if (b.champions && result.last) return ['🏆 Champion of champions!', `${w.title} beats the best of the best`, true];
  if (b.champions && b.round === b.champions.from) return ['⚡ Champions clash!', `${w.title} wins the first champions matchup`, true];
  if (b.round === 1) return ['⚡ First crown!', `${w.title} takes the throne`, true];
  if (n > 2) return ['🏆 Last one standing!', `${w.title} wins the ${n}‑way showdown`, true];
  if (result.winner === b.champ) return ['🛡️ The champ holds!', `${w.title} survives another round`, true];
  return ['💥 Upset!', `${w.title} is the new champ`, false];
}

// Points game: who picked each new pick in this matchup?
function GuessPanel({ b, E, players, meId, mine, onGuess, result }) {
  const ids = result ? Object.keys(result.guessed || {}) : b.fresh.filter((id) => !E[id].mine);
  if (!ids.length) return null;
  const others = players.filter((p) => p.id !== meId);
  return html`<section class="section card guess-panel">
    <h3>🕵️ Who picked ${ids.length === 1 ? 'it' : 'them'}?</h3>
    ${ids.map((id) => {
      const m = E[id];
      if (result) {
        const right = result.guessed[id].map((pid) => players.find((p) => p.id === pid)?.name).filter(Boolean);
        const myGuess = result.guesses[meId]?.[id];
        return html`<div class="guess-row" key=${id}>
          <${Cover} item=${m} tiny />
          <span class="grow">
            <strong>${m.title}</strong>
            <span class="small">${m.by?.length ? `Picked by ${names(m.by)}` : ''}${right.length ? ` · ✓ ${right.join(', ')}` : ' · nobody guessed it'}</span>
          </span>
          ${m.mine ? html`<span class="tag">yours</span>` : myGuess ? html`<span class="tag ${result.guessed[id].includes(meId) ? 'good' : 'bad'}">${result.guessed[id].includes(meId) ? '✓ +1' : '✗'}</span>` : null}
        </div>`;
      }
      return html`<div class="guess-row" key=${id}>
        <${Cover} item=${m} tiny />
        <span class="grow">
          <strong>${m.title}</strong>
          <span class="guess-faces">
            ${others.map(
              (p) => html`<button class="guess-face ${mine[id] === p.id ? 'on' : ''}" key=${p.id} aria-label=${`${p.name} picked ${m.title}`} onClick=${() => onGuess(id, p.id)}>
                <${Avatar} p=${p} size=${34} /><span>${p.name}</span>
              </button>`,
            )}
          </span>
        </span>
      </div>`;
    })}
  </section>`;
}

// Points earned in the matchup that just finished.
function RoundPoints({ result, players, meId }) {
  const rows = Object.entries(result.scored || {})
    .map(([pid, s]) => ({ p: players.find((x) => x.id === pid), s, total: s.guess + s.win + s.champ }))
    .filter((r) => r.p && r.total)
    .sort((x, y) => y.total - x.total);
  if (!rows.length) return null;
  const parts = (s) => [s.guess && `🕵️ +${s.guess}`, s.win && `⭐ +${s.win}`, s.champ && `👑 +${s.champ}`].filter(Boolean).join(' · ');
  return html`<div class="round-points">
    ${rows.map(
      ({ p, s, total }) => html`<span class="pill ${p.id === meId ? 'pill-gold' : ''}" key=${p.id}>
        <${Avatar} p=${p} size=${22} /> ${p.id === meId ? 'You' : p.name} +${total}<span class="muted"> (${parts(s)})</span>
      </span>`,
    )}
  </div>`;
}

export function ScoreList({ scores, meId, from = 0 }) {
  const at = places(scores, (r) => r.total);
  return html`<div class="road">
    ${scores.map(
      (r, i) => i < from ? null : html`<div class="road-row" key=${r.id}>
        <span class="r">#${at[i]}</span>
        <${Avatar} p=${r} size=${30} />
        <span class="grow">
          <span class="w">${r.id === meId ? 'You' : r.name}</span>
          <br /><span class="small muted">🕵️ ${r.guess} · ⭐ ${r.win}${r.champ ? ` · 👑 ${r.champ}` : ''}</span>
        </span>
        <span class="score">${r.total}</span>
      </div>`,
    )}
  </div>`;
}

// The whole bracket, round by round.
export function BracketView({ bracket, entries, current }) {
  const label = (id, r) => {
    if (!id) return r === 0 ? 'Bye' : 'To be decided';
    const m = entries[id];
    return m?.title || '?';
  };
  return html`<div class="bracket">
    ${bracket.rounds.slice(0, -1).map(
      (slots, r) => html`<div class="bracket-round" key=${r}>
        <h3>${bracketRoundName(bracket, r)}</h3>
        ${Array.from({ length: slots.length / 2 }, (_, k) => {
          const [x, y] = [slots[2 * k], slots[2 * k + 1]];
          if (r === 0 && (!x || !y)) return null; // byes skip round 1
          const winner = bracket.rounds[r + 1][k];
          const now = current && current.r === r && current.k === k;
          return html`<div class="bracket-match ${now ? 'now' : ''}" key=${k}>
            ${[x, y].map(
              (id) => html`<div class="bracket-slot ${winner && id === winner ? 'won' : winner && id ? 'lost' : ''}">
                ${id && entries[id] ? html`<${Cover} item=${entries[id]} tiny />` : html`<span class="bracket-dot" />`}
                <span>${label(id, r)}</span>
              </div>`,
            )}
            ${now ? html`<span class="bracket-now">▶ Now</span>` : null}
          </div>`;
        })}
      </div>`,
    )}
    ${bracket.rounds.at(-1)[0]
      ? html`<div class="bracket-champ">👑 ${label(bracket.rounds.at(-1)[0], 1)}</div>`
      : null}
  </div>`;
}

export function Battle() {
  const { view, act, offset } = useGame();
  const b = view.battle;
  const E = view.entries;
  const fighters = b.fighters.map((id) => E[id]);
  const n = fighters.length;
  const result = b.stage === 'result' ? b.result : null;

  const [pending, setPending] = useState(null);
  const [guesses, setGuesses] = useState({}); // "who picked it?" guesses not yet confirmed by the server
  const [sheet, setSheet] = useState(null); // 'bracket' | 'scores'
  const [info, setInfo] = useState(null);
  const kind = view.settings.kind;
  const scoring = view.settings.scoring;
  const br = b.bracket;
  const at = br?.at;
  const roundName = br ? bracketRoundName(br, at.r) : null;
  const prog = br ? bracketProgress(br, at.r, at.k) : null;
  const [drawSeen, setDrawSeen] = useState(0); // round whose tie-break animation we've shown
  const [intro, setIntro] = useState(() => b.round === 1 && b.stage !== 'result' && Date.now() + offset.current - b.startedAt < 3000);
  const lastRound = useRef(b.round);
  const champs = b.champions;
  const champRound = champs ? b.round - champs.from + 1 : 0;
  const champTotal = champs ? champs.ids.length - 1 : 0;
  const [champIntro, setChampIntro] = useState(false);
  const champIntroShown = useRef(false);
  useEffect(() => {
    if (champs && champRound === 1 && b.stage === 'voting' && !champIntroShown.current) {
      champIntroShown.current = true;
      setChampIntro(true);
    }
  }, [!!champs, b.round]);

  useEffect(() => setPending(null), [b.round, b.stage]);
  useEffect(() => setGuesses({}), [b.round]);
  useEffect(() => {
    prefetchPreviews(fighters);
    return stopPreview;
  }, [b.round]);

  const tied = result?.method === 'coin' ? (result.tied || b.fighters).map((id) => E[id]) : null;
  const breaking = tied && drawSeen !== b.round;
  const revealed = result && !breaking;

  // Sounds for a new challenger and for each reveal.
  useEffect(() => {
    if (b.round !== lastRound.current && b.stage !== 'result') sfx.whoosh();
    lastRound.current = b.round;
  }, [b.round]);
  useEffect(() => {
    if (!revealed || result.method === 'coin') return;
    if (b.round > 1 && result.winner && result.winner === b.challenger && n === 2) sfx.upset();
    else sfx.reveal();
  }, [revealed, b.round]);

  const myVote = pending || b.myVote;
  const canVote = b.stage === 'voting';
  const myGuesses = { ...b.myGuesses, ...guesses };
  const guess = (id, pid) => {
    sfx.tap();
    setGuesses({ ...guesses, [id]: pid });
    act({ type: 'guess', round: b.round, entryId: id, playerId: pid });
  };
  const vote = (id) => {
    if (!canVote) return;
    sfx.tap();
    setPending(id);
    act({ type: 'vote', round: b.round, entryId: id }).then((out) => !out && setPending(null));
  };

  const here = view.players.filter((p) => p.online);
  const waitingOn = here.filter((p) => !p.voted);
  const votersFor = (id) =>
    result ? Object.entries(result.votes).filter(([, eid]) => eid === id).map(([pid]) => result.voters[pid]).filter(Boolean) : [];

  const badgeFor = (id) => {
    const w = b.wins[id] || 0;
    const winsText = `${w} ${w === 1 ? 'win' : 'wins'}`;
    if (br) {
      if (at.r === 0) return html`<span class="fighter-badge new">🎩 Fresh from the hat</span>`;
      return w ? html`<span class="fighter-badge champ">🏆 ${winsText}</span>` : html`<span class="fighter-badge new">🎟️ Bye into this round</span>`;
    }
    if (champs && (champRound === 1 || id === b.challenger)) return html`<span class="fighter-badge champ">🏆 Champion · ${winsText}</span>`;
    if (b.round === 1) return html`<span class="fighter-badge new">🎩 Fresh from the hat</span>`;
    if (id === b.champ) return html`<span class="fighter-badge champ">👑 Champ${n > 2 ? '' : ` · ${winsText}`}</span>`;
    if (id === b.challenger) return html`<span class="fighter-badge new">🎩 ${n > 2 ? 'New' : 'New challenger'}</span>`;
    return html`<span class="fighter-badge tied">🤝 Still in</span>`;
  };

  const outcome = (id) => {
    if (!revealed) return null;
    if (result.winner === id) return 'won';
    return result.survivors?.includes(id) ? 'kept' : 'lost';
  };
  const done = (champs ? champRound : b.round) - 1 + (result ? 1 : 0);
  const outOf = champs ? champTotal : b.total;
  const [title, sub, gold] = revealed ? banner(result, b, E) : [];
  const heading = br
      ? roundName === 'Final'
        ? html`The <span class="hl">final!</span>`
        : roundName === 'Semifinals'
          ? html`Who goes to <span class="hl">the final?</span>`
          : html`Who <span class="hl">moves on?</span>`
    : champRound === 1 && n === 2
      ? html`The champions <span class="hl">face off!</span>`
      : b.round === 1 && n === 2
      ? html`First two out of <span class="hl">the hat!</span>`
      : n > 2
        ? html`<span class="hl">${n}‑way</span> showdown!`
        : b.champ
          ? html`Can anything <span class="hl">dethrone</span> the champ?`
          : html`Which one <span class="hl">wins?</span>`;
  const advance = () => {
    sfx.tap();
    act({ type: 'next', round: b.round });
  };

  return html`<div>
    <div class="round-row">
      ${br
        ? html`<span class="pill pill-hot">🏆 ${roundName}${prog.count > 1 ? ` · ${prog.index} of ${prog.count}` : ''}</span>`
        : champs
          ? html`<span class="pill pill-gold">🏆 Champions · ${champRound} of ${champTotal}</span>`
          : html`<span class="pill pill-hot">⚔️ Round ${b.round} of ${b.total}</span>`}
      ${b.endsAt && !result ? html`<${Countdown} endsAt=${b.endsAt} offset=${offset} />` : null}
      <span class="pill">${br ? `⚔️ ${b.left} ${b.left === 1 ? 'matchup' : 'matchups'} left` : champs ? `👑 ${b.left} more ${b.left === 1 ? 'champ' : 'champs'}` : `🎩 ${b.left} left`}</span>
    </div>
    <div class="progress ${champs ? 'gold' : ''}"><i style=${{ width: `${Math.max(4, (done / outOf) * 100)}%` }} /></div>
    ${br || scoring
      ? html`<div class="battle-tools">
          ${br ? html`<button class="chip soft" onClick=${() => setSheet('bracket')}>🗂️ The bracket</button>` : null}
          ${scoring ? html`<button class="chip soft" onClick=${() => setSheet('scores')}>🏅 Scores</button>` : null}
        </div>`
      : null}

    ${revealed
      ? html`<div class="banner" key=${`b${b.round}`}>
          <span class="banner-big ${gold ? 'gold' : ''}">${title}</span>
          <span class="banner-sub">${sub}</span>
          ${result.toChampions
            ? html`<span class="banner-next">🏆 The hat's empty! ${result.toChampions} champions head to the champions round</span>`
            : null}
        </div>`
      : html`<h1 class="duel-title">${heading}</h1>`}

    <div class="duel n${n}" key=${`d${b.round}`}>
      ${fighters.map(
        (m) => html`<${Fighter}
          key=${m.id}
          m=${m}
          badge=${badgeFor(m.id)}
          picked=${myVote === m.id}
          outcome=${outcome(m.id)}
          tally=${result ? result.tally[m.id] : 0}
          voters=${votersFor(m.id)}
          fresh=${m.id === b.challenger && b.round > 1}
          canVote=${canVote}
          onVote=${() => vote(m.id)}
          onInfo=${setInfo}
        />`,
      )}
      ${n === 2 ? html`<span class="vs" aria-hidden="true">VS</span>` : null}
    </div>

    ${!result && kind !== 'movie'
      ? html`<div class="center" style=${{ marginTop: '16px' }}>
          <button class="btn btn-ghost btn-sm" onClick=${() => playAll(fighters)}>🔊 Play the matchup (15s each)</button>
        </div>`
      : null}

    ${scoring && canVote ? html`<${GuessPanel} b=${b} E=${E} players=${view.players} meId=${view.me.id} mine=${myGuesses} onGuess=${guess} />` : null}
    ${scoring && revealed ? html`<${GuessPanel} b=${b} E=${E} players=${view.players} meId=${view.me.id} result=${result} />` : null}
    ${scoring && revealed ? html`<${RoundPoints} result=${result} players=${view.players} meId=${view.me.id} />` : null}

    ${!result
      ? html`<div class="voters">
          <p class="small muted" style=${{ fontWeight: 800 }}>
            ${!myVote
              ? `Tap your favorite ${noun(kind)}. ${kind === 'movie' ? 'ⓘ shows what it’s about' : '▶ plays a preview'}`
              : b.todo
                ? 'Now guess who picked them 👆'
                : `${b.votedCount} of ${here.length} done`}
          </p>
          <div class="face-row">
            ${here.map((p) => html`<${Avatar} key=${p.id} p=${p} size=${38} className=${p.voted ? '' : 'waiting'} badge=${p.voted ? '✓' : null} />`)}
          </div>
          ${view.me.host && b.votedCount > 0 && waitingOn.length
            ? html`<button class="btn btn-quiet btn-sm" style=${{ marginTop: '12px' }} onClick=${() => act({ type: 'close', round: b.round })}>
                Close voting now
              </button>`
            : null}
        </div>`
      : null}

    <div class="dock">
      ${revealed
        ? result.last
          ? html`<button class="btn btn-gold btn-block btn-xl" onClick=${() => (sfx.pop(), act({ type: 'next', round: b.round }))}>👑 Crown the champion</button>`
          : result.toChampions
            ? html`<button class="btn btn-gold btn-block btn-xl" onClick=${advance}>🏆 Start the champions round</button>`
            : result.method === 'keep'
              ? html`<button class="btn btn-hot btn-block btn-xl" onClick=${advance}>${champs ? '🏆 Bring in another champion' : '🎩 Draw one to join the fight'}</button>`
              : html`<button class="btn btn-hot btn-block btn-xl" onClick=${advance}>${br ? '⚔️ Next matchup' : champs ? '🏆 Bring in the next champion' : `🎩 Draw the next ${noun(kind)}`}</button>`
        : !result && !b.todo && waitingOn.length
          ? html`<div class="card center" style=${{ padding: '14px' }}>
              <strong class="dots">Waiting on ${waitingOn.map((p) => p.name).slice(0, 3).join(', ')}${waitingOn.length > 3 ? ` +${waitingOn.length - 3}` : ''}</strong>
              <p class="tiny muted">You can still change your vote</p>
            </div>`
          : null}
    </div>

    ${breaking
      ? tied.length > 2
        ? html`<${Roulette} items=${tied} winner=${result.winner} onDone=${() => setDrawSeen(b.round)} />`
        : html`<${CoinFlip} a=${tied[0]} b=${tied[1]} winner=${result.winner} onDone=${() => setDrawSeen(b.round)} />`
      : null}
    ${intro ? html`<${ShuffleIntro} count=${b.total + 1} kind=${kind} bracket=${!!br} onDone=${() => setIntro(false)} />` : null}
    <${Sheet} open=${sheet === 'bracket' && br} onClose=${() => setSheet(null)} title="🗂️ The bracket">
      ${br ? html`<${BracketView} bracket=${br} entries=${E} current=${result ? null : at} />` : null}
    </${Sheet}>
    <${Sheet} open=${sheet === 'scores' && b.scores} onClose=${() => setSheet(null)} title="🏅 Scores">
      ${b.scores ? html`<${ScoreList} scores=${b.scores} meId=${view.me.id} />` : null}
      <p class="small muted" style=${{ marginTop: '14px' }}>🕵️ +1 right guess on who picked it · ⭐ +2 a win for your pick · 👑 +3 your pick is the champion</p>
    </${Sheet}>
    ${champIntro && champs
      ? html`<${ChampionsIntro} items=${champs.ids.map((id) => E[id])} kind=${view.settings.kind} onDone=${() => setChampIntro(false)} />`
      : null}
    <${ItemInfo} item=${info} onClose=${() => setInfo(null)} />
  </div>`;
}
