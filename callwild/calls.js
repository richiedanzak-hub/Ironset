/* Call of the Wild — the lessons, and what each call is scored against.

   Everything a caller reads (what the call is, when to use it, how to make it,
   what goes wrong) and everything the analyzer measures against (note counts,
   speed, rhythm, pitch and volume shape, note length) for every call lives
   here, so improving a lesson or a target is an edit to one entry.

   The targets are a first draft built from published calling instruction and
   from measuring real recordings. They want a seasoned caller's ear before
   anyone treats a score as gospel — each species says so on its page.

   Scoring rows are [part, weight, settings]; the parts are defined in
   analysis.js. `ghost` draws the target pattern behind the caller's notes:
   {t: start s, d: length s, s: pitch in half-steps from the first note,
   v: loudness 0-1, path: pitch shape inside the note as [fraction, half-steps]}. */
(function (root) {
  "use strict";

  /* A run of notes: n of them, `ioi` apart, each `dur` long, the pitch sliding
     `drop` half-steps from first to last and the volume fading by `fade` (0-1). */
  function run(n, ioi, dur, drop, fade, extra) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var k = n > 1 ? i / (n - 1) : 0;
      var q = { t: i * ioi, d: typeof dur === "function" ? dur(i) : dur, s: -drop * k, v: 1 - (fade || 0) * k };
      if (extra) extra(q, i);
      out.push(q);
    }
    if (typeof ioi === "function") { // custom spacing
      var t = 0;
      for (var j = 0; j < out.length; j++) { out[j].t = t; t += ioi(j); }
    }
    return out;
  }
  function at(times, dur, extra) {
    return times.map(function (t, i) { var q = { t: t, d: typeof dur === "function" ? dur(i) : dur, s: 0, v: 1 }; if (extra) extra(q, i); return q; });
  }

  var species = [
    {
      id: "duck", name: "Ducks", tone: 620, tag: "Mallard hen calls, plus a drake and a pintail whistle",
      gear: "A hen mallard call. Single-reed calls are louder and have more range but are harder to control; double-reed calls are easier to learn and harder to squeal. Start on a double reed.",
      intro: "Nearly every duck call you will ever blow is a hen mallard's quack, strung together different ways. Get one clean quack, then build.",
      calls: ["duck-quack", "duck-greeting", "duck-lonesome", "duck-comeback", "duck-hail", "duck-feeding", "duck-drake", "duck-pintail"]
    },
    {
      id: "goose", name: "Geese", tone: 420, tag: "Canada goose: honk, cluck, moan, double cluck",
      gear: "A short-reed goose call. It takes two hands: one around the barrel's end to make back-pressure, which is what makes the reed break.",
      intro: "Everything comes from the honk — a low note that breaks over into a high one. A cluck is a short honk; a moan is a long honk that never breaks.",
      calls: ["goose-honk", "goose-cluck", "goose-moan", "goose-double"]
    },
    {
      id: "turkey", name: "Turkey", tone: 900, tag: "Wild turkey: yelp, cluck, purr, cutt",
      gear: "A box call or a slate (pot) call is the easiest start. A mouth (diaphragm) call takes practice but leaves your hands free. Every lesson here works on any of them.",
      intro: "Rhythm matters more than tone with turkeys. A yelp with a natural beat beats a pretty yelp with a robotic one.",
      calls: ["turkey-yelp", "turkey-cluck", "turkey-purr", "turkey-cutt"]
    },
    {
      id: "elk", name: "Elk", tone: 700, tag: "Cow call and bull bugle",
      gear: "A diaphragm call for the mouth; add a bugle tube for bugling. Open reed cow calls (squeeze-style) are an easy way to start on cow calls.",
      intro: "Cow calls bring more elk than bugles do. Learn the mew first; save the bugle for when you have it right.",
      calls: ["elk-cow", "elk-bugle"]
    },
    {
      id: "deer", name: "Whitetail", tone: 170, tag: "Grunt, tending grunt, doe bleat",
      gear: "A grunt tube with an adjustable reed, and a can call for bleats.",
      intro: "Deer calling is quiet and sparse. A few soft grunts or bleats, then a long wait — 15 to 30 minutes or more.",
      calls: ["deer-grunt", "deer-tending", "deer-bleat"]
    },
    {
      id: "predator", name: "Predators", tone: 700, tag: "Rabbit distress and coyote howl",
      gear: "An open-reed or closed-reed predator mouth call for distress sounds; a howler for coyote vocals.",
      intro: "Distress calling is acting: a rabbit in trouble sounds desperate and ragged, not pretty.",
      calls: ["pred-rabbit", "pred-howl"]
    },
    {
      id: "locator", name: "Locators", tone: 420, tag: "Barred owl and crow — to make a gobbler sound off",
      gear: "Your own voice works for a barred owl. A crow call is cheap and loud. Both are used to make turkeys gobble so you know where they are.",
      intro: "A locator is not meant to bring anything in. It is a loud, sudden sound that makes a tom shock-gobble and give himself away.",
      calls: ["loc-owl", "loc-crow"]
    }
  ];

  var calls = {

    /* ============================ DUCKS ============================ */

    "duck-quack": {
      species: "duck", name: "Basic quack", level: 1, say: "quit",
      what: "The single quack of a hen mallard. Every other duck call is built out of it.",
      when: "Any time. A few lonely quacks on a calm day, or mixed into your other calls.",
      steps: [
        "Hold the call like a cigar between your thumb and first finger. Cup your other hand loosely around the far end.",
        "Seal your lips around the mouthpiece. Keep your teeth off it.",
        "Push the air from your gut — the muscle you use to cough — not from your cheeks.",
        "Say “quit” or “hut” into the call: one short burst.",
        "Stop the air hard at the end of the word. That crisp stop is what makes it a duck and not a kazoo."
      ],
      mistakes: [
        "Puffing from the cheeks: the quack comes out thin and squeaky.",
        "Letting the air trail off, so the quack fades out instead of stopping.",
        "Blowing too hard: the reed locks up or squeals."
      ],
      drill: "Blow five quacks with a one-second pause between each. Make all five sound the same.",
      listen: [{ clip: "mallard-hen-quacks", label: "Real hen mallard" }],
      spec: {
        kind: "single", maxSec: 10, pitch: [150, 1800], hp: 150,
        score: [
          ["count", 0.6, { range: [2, 8] }],
          ["length", 1, { range: [0.12, 0.35] }],
          ["crisp", 1.2, { max: 0.06 }],
          ["steady", 1, { jump: 5 }],
          ["pauses", 0.6, { range: [0.3, 2.0] }],
          ["consistent", 0.8, {}]
        ]
      },
      ghost: at([0, 1.1, 2.2, 3.3], 0.22)
    },

    "duck-greeting": {
      species: "duck", name: "Greeting call", level: 2, say: "kanc",
      what: "Five to seven quacks that step down in pitch and volume at an even pace: KANC, KANC, kanc, kanc, kanc.",
      when: "When ducks first notice your spread, or are working at medium range. It says “come on over.”",
      steps: [
        "Start from a good basic quack — every note in this call is one.",
        "Blow the first note full and loud.",
        "Make each note after it a little lower and a little softer, like walking down stairs.",
        "Keep an even beat, about three notes a second.",
        "Stop after five to seven notes, then watch the birds."
      ],
      mistakes: [
        "Rushing: the last notes pile on top of each other.",
        "Blowing every note at the same pitch, so the call never comes down.",
        "Not knowing when to stop — eight, nine, ten notes."
      ],
      drill: "Tap your foot. One “kanc” per tap, five or six taps, each a step lower than the one before.",
      listen: [{ clip: "mallard-hen-series", label: "Real hen: descending series" }],
      spec: {
        kind: "series", maxSec: 10, pitch: [150, 1800], hp: 150, groupGap: 0.8,
        score: [
          ["count", 1, { range: [5, 7] }],
          ["pace", 0.8, { range: [2.4, 4.5] }],
          ["rhythm", 1.2, { kind: "even", cv: 0.22 }],
          ["pitch", 1, { dir: "down", range: [1, 8] }],
          ["volume", 0.6, { dir: "down", min: 3 }],
          ["length", 0.6, { range: [0.08, 0.32] }],
          ["crisp", 0.7, { max: 0.07 }],
          ["steady", 0.6, { jump: 5 }]
        ]
      },
      ghost: run(6, 0.32, 0.2, 5, 0.6)
    },

    "duck-lonesome": {
      species: "duck", name: "Lonesome hen", level: 2, say: "kaaanc",
      what: "Single, long, nasal quacks with long pauses between: a lone hen looking for company.",
      when: "Calm, bluebird days and wary late-season ducks that have heard every greeting call in the flyway.",
      steps: [
        "Blow one long, drawn-out quack — about half a second — with a nasal, pleading tone.",
        "Let it end on its own; don't chop it short.",
        "Wait one to three seconds.",
        "Do it again. Lazy and patient wins."
      ],
      mistakes: [
        "Clipping the quacks short, so it sounds like a nervous basic quack.",
        "Not waiting long enough between quacks."
      ],
      drill: "Three long quacks, counting “one-Mississippi, two-Mississippi” between each.",
      listen: [{ clip: "mallard-hen-lonesome", label: "Real hen: single quacks" }],
      spec: {
        kind: "single", maxSec: 12, pitch: [150, 1800], hp: 150,
        score: [
          ["count", 0.6, { range: [2, 6] }],
          ["length", 1.2, { range: [0.3, 0.8] }],
          ["pauses", 1.2, { range: [1.0, 3.5] }],
          ["steady", 0.6, { jump: 5 }],
          ["consistent", 0.6, {}]
        ]
      },
      ghost: at([0, 2.1, 4.2], 0.5)
    },

    "duck-comeback": {
      species: "duck", name: "Comeback call", level: 3, say: "KANC",
      what: "Fast, hard and pleading: five to eight quick notes, the first one loudest.",
      when: "When ducks are leaving or swinging wide. Hit it as they turn away; stop as soon as they turn back.",
      steps: [
        "Hit the first note hard to grab their attention.",
        "Rattle off the rest quickly — five or six a second — each a little lower.",
        "Keep every note crisp; going fast is no excuse for mush.",
        "Stop at eight notes or fewer."
      ],
      mistakes: [
        "Going fast and losing the clean stop on each note.",
        "Soft first note: the attention-grabber gets lost."
      ],
      drill: "Say “KANC-kanc-kanc-kanc-kanc” out loud (no call) as fast as you can keep it clean, then do it on the call.",
      listen: [{ clip: "mallard-hen-series-2", label: "Real hen: loud first note, then quicker, softer ones" }],
      spec: {
        kind: "series", maxSec: 8, pitch: [150, 1800], hp: 150, groupGap: 0.6,
        score: [
          ["count", 1, { range: [5, 8] }],
          ["pace", 1.2, { range: [4.5, 8] }],
          ["volume", 0.8, { dir: "firstloud" }],
          ["pitch", 0.8, { dir: "down", range: [0.5, 8] }],
          ["length", 0.6, { range: [0.06, 0.2] }],
          ["crisp", 0.8, { max: 0.06 }],
          ["steady", 0.6, { jump: 5 }]
        ]
      },
      ghost: run(6, 0.17, 0.12, 4, 0.5)
    },

    "duck-hail": {
      species: "duck", name: "Hail call", level: 3, say: "KAAANC",
      what: "The long-range call: loud, drawn-out notes up front that taper off — KAAANC, KAAANC, KAANC, KANC, kanc, kanc.",
      when: "Only for ducks far off — 100 yards or more — that aren't headed your way. Once they turn toward you, stop hailing.",
      steps: [
        "Take a big breath and open your hand off the end of the call for volume.",
        "Draw the first two or three notes out long, about half a second each.",
        "Let every note after that get shorter, quicker, lower and softer.",
        "Seven to fourteen notes in all, then stop."
      ],
      mistakes: [
        "Hailing at ducks that are already close. It flares them.",
        "Every note the same length: no taper, just loud.",
        "Squealing on the first notes from too much air."
      ],
      drill: "Breathe in for four counts, then blow: three long notes, then let the rest roll down and out.",
      listen: [{ clip: "mallard-hen-long", label: "Real hen: a long, loud run of quacks" }],
      spec: {
        kind: "series", maxSec: 12, pitch: [150, 1800], hp: 150, groupGap: 0.8,
        score: [
          ["count", 1, { range: [7, 14] }],
          ["firstLong", 1, { range: [0.3, 0.8] }],
          ["taper", 1.2, { ratio: 1.6 }],
          ["pitch", 0.8, { dir: "down", range: [1, 10] }],
          ["volume", 0.6, { dir: "down", min: 3 }],
          ["steady", 0.8, { jump: 5 }]
        ]
      },
      ghost: (function () {
        var d = [0.5, 0.46, 0.38, 0.28, 0.22, 0.19, 0.17, 0.15, 0.14], t = 0;
        return d.map(function (len, i) { var q = { t: t, d: len, s: -6 * i / (d.length - 1), v: 1 - 0.6 * i / (d.length - 1) }; t += len + 0.08; return q; });
      })()
    },

    "duck-feeding": {
      species: "duck", name: "Feeding chuckle", level: 4, say: "tikka",
      what: "A fast, rolling chatter — tikka-tikka-tikka — the sound of contented ducks feeding.",
      when: "For ducks that are close in and circling. Mix in a few quacks. Keep it soft, and don't run it forever.",
      steps: [
        "Start slow: say “tick-it” or “tuk-a” into the call, one at a time, without using your voice.",
        "Speed up until the syllables roll into each other: tikka-tikka-tikka.",
        "Keep the air steady and the beat even — a purr of notes, not a stutter.",
        "Run it for two to four seconds, then break it with a quack or two."
      ],
      mistakes: [
        "Going for speed before the notes are clean. Slow and clean beats fast and mushy.",
        "Uneven bursts: chuckle, stop, chuckle — it should roll."
      ],
      drill: "Say “tikka” ten times slowly, then ten times at double speed, then as fast as you can stay even. Do the same on the call.",
      listen: [{ clip: "mallard-feeding", label: "Real mallards feeding" }],
      spec: {
        kind: "series", maxSec: 8, pitch: [150, 2500], hp: 150, groupGap: 0.45, split: 4, minNote: 0.02,
        score: [
          ["count", 0.6, { range: [10, 80] }],
          ["pace", 1.4, { range: [7, 14], soft: 2 }],
          ["rhythm", 1, { kind: "even", cv: 0.35, drift: 0.4 }],
          ["runLen", 1, { range: [1.5, 5] }],
          ["length", 0.6, { range: [0.025, 0.11] }],
          ["volume", 0.4, { dir: "even", max: 8 }]
        ]
      },
      ghost: run(28, 0.09, 0.055, 0, 0)
    },

    "duck-drake": {
      species: "duck", tone: 380, name: "Drake “raeb”", level: 2, say: "raeb",
      what: "The drake mallard's soft, raspy “raeb, raeb.” Lower and buzzier than a hen.",
      when: "Close in, mixed with hen calls, for wary birds. A little drake talk adds realism to a spread.",
      steps: [
        "Use a drake call, or growl softly into your hen call.",
        "Unlike a hen quack, voice this one: say “raeb” with a low hum in your throat.",
        "Short and soft, about half a second apart, a few at a time."
      ],
      mistakes: [
        "Too loud. Drakes talk quietly.",
        "Clean tone — a drake is raspy, not musical."
      ],
      drill: "Four soft “raebs,” half a second apart, then silence.",
      listen: [{ clip: "mallard-drake", label: "Real drake mallard" }],
      spec: {
        kind: "single", maxSec: 8, pitch: [120, 1500], hp: 120,
        score: [
          ["count", 0.6, { range: [2, 8] }],
          ["length", 1, { range: [0.08, 0.32] }],
          ["pauses", 1, { range: [0.25, 1.2] }],
          ["consistent", 0.6, {}]
        ]
      },
      ghost: at([0, 0.7, 1.4, 2.1], 0.18)
    },

    "duck-pintail": {
      species: "duck", tone: 1800, name: "Pintail whistle", level: 3, say: "prrip",
      what: "The drake pintail's rolling whistle — “prrip, prrip” — high and trilled.",
      when: "Where pintails (and wigeon) are using. Mixed with a few hen quacks, it's a confidence call.",
      steps: [
        "Use a pintail or three-in-one whistle.",
        "Roll your tongue (or flutter your throat) while blowing a short burst: “prrrip.”",
        "Two or three whistles, a beat apart, then quiet."
      ],
      mistakes: [
        "Straight, plain whistle with no roll.",
        "Overdoing it. A few whistles go a long way."
      ],
      drill: "Practice the roll with no whistle: a rolled “prrr” on your tongue. Then add the whistle.",
      listen: [{ clip: "pintail-drake", label: "Real drake pintail" }],
      spec: {
        kind: "single", maxSec: 8, pitch: [500, 4000], hp: 400,
        score: [
          ["count", 0.6, { range: [2, 8] }],
          ["high", 1, { min: 1000 }],
          ["length", 1, { range: [0.08, 0.4] }],
          ["pauses", 0.8, { range: [0.2, 1.5] }]
        ]
      },
      ghost: at([0, 0.7, 1.4], 0.2)
    },

    /* ============================ GEESE ============================ */

    "goose-honk": {
      species: "goose", name: "Honk", level: 1, say: "her-onk",
      what: "The Canada goose's basic two-part honk: a low “her” that breaks over into a high “onk.”",
      when: "To get geese's attention at a distance, and as the base of every other goose call.",
      steps: [
        "Wrap your hand around the end of the call so it makes back-pressure. On a short reed, that's what makes it break.",
        "Push air from your gut and say a low “her.”",
        "Let the pressure build until the reed snaps over into a high “onk.” Some callers think “ga-whit.”",
        "Add a little growl from your throat for gravel. Clean air alone sounds plastic.",
        "Cut each honk off clean."
      ],
      mistakes: [
        "No break: one flat note. Close your hand more for back-pressure.",
        "Pushing more air instead of more pressure. Pressure makes it break, not volume.",
        "Notes that trail off instead of ending."
      ],
      drill: "Five honks, slow, a second apart. Listen for the snap from low to high in every one.",
      listen: [{ clip: "goose-honks", label: "Real Canada goose honks" }],
      spec: {
        kind: "single", maxSec: 10, pitch: [150, 2500], hp: 150, split: 8,
        score: [
          ["count", 0.5, { range: [2, 8] }],
          ["breakUp", 1.5, { jump: 4 }],
          ["length", 0.8, { range: [0.12, 0.6] }],
          ["crisp", 0.8, { max: 0.08 }],
          ["pauses", 0.6, { range: [0.25, 2] }]
        ]
      },
      ghost: at([0, 1.0, 2.0], 0.32, function (q) { q.path = [[0, 0], [0.4, 0], [0.45, 9], [1, 9]]; })
    },

    "goose-cluck": {
      species: "goose", name: "Cluck", level: 2, say: "hut",
      what: "A short, fast honk — “hut” — often in quick runs. Excited geese cluck.",
      when: "When geese are working your spread. Clucks in rhythm sound like a happy flock.",
      steps: [
        "Start from your honk, then cut it to a fraction of the length: “hut.”",
        "Keep the break — even a short cluck snaps from low to high.",
        "String several together in a steady rhythm."
      ],
      mistakes: [
        "Clucks so short the break disappears.",
        "Running them together into a mush."
      ],
      drill: "Eight clucks in a steady beat, about four a second.",
      listen: [{ clip: "goose-clucks", label: "Real Canada geese: quick, short clucks" }],
      spec: {
        kind: "series", maxSec: 8, pitch: [150, 2500], hp: 150, groupGap: 0.6,
        score: [
          ["count", 0.8, { range: [3, 12] }],
          ["length", 1, { range: [0.05, 0.2] }],
          ["pace", 1, { range: [2.5, 7] }],
          ["crisp", 0.8, { max: 0.06 }],
          ["breakUp", 0.8, { jump: 3 }]
        ]
      },
      ghost: run(8, 0.24, 0.1, 0, 0, function (q) { q.path = [[0, 0], [0.4, 0], [0.5, 5], [1, 5]]; })
    },

    "goose-moan": {
      species: "goose", name: "Moan", level: 2, say: "hrrrr",
      what: "A long, drawn-out, low honk that never breaks — calm, content geese.",
      when: "For geese that are circling or close in, and to settle a flock.",
      steps: [
        "Open your hand a little so the call doesn't break.",
        "Push a slow, steady stream of air and say a long, low “hrrrrr.”",
        "Hold it for close to a second, then let it go."
      ],
      mistakes: [
        "Letting it break — then it's a honk, not a moan.",
        "Wavering air that makes the tone shake."
      ],
      drill: "Three moans, each a full second, with a breath between.",
      listen: [],
      noClip: "No clean recording of a real moan yet: geese tuck it into the flock's talk. The rhythm guide plays its long, unbroken shape.",
      spec: {
        kind: "single", maxSec: 10, pitch: [120, 2000], hp: 120, split: 9, bridge: 0.08,
        score: [
          ["count", 0.4, { range: [1, 5] }],
          ["length", 1.2, { range: [0.5, 1.6] }],
          ["steady", 1.2, { jump: 4 }],
          ["smooth", 0.8, { wobble: 0.6 }]
        ]
      },
      ghost: at([0, 1.6, 3.2], 0.9, function (q) { q.path = [[0, 0], [0.5, 0.5], [1, -1]]; })
    },

    "goose-double": {
      species: "goose", name: "Double cluck", level: 3, say: "ga-whit",
      what: "Quick pairs of notes — “ga-whit, ga-whit” — the feeding rhythm of a happy flock.",
      when: "Geese close in and committed. It's the sound of geese on the ground feeding.",
      steps: [
        "Say “ga-whit” into the call: the “ga” low, the “whit” high and sharp.",
        "Keep the two halves tight together, then a short beat before the next pair.",
        "Run eight to sixteen notes in a rolling rhythm."
      ],
      mistakes: [
        "Pairs that blur into single notes.",
        "Losing the rhythm as you speed up."
      ],
      drill: "Say “ga-whit ga-whit ga-whit” out loud in a steady rhythm, then on the call.",
      listen: [{ clip: "goose-pairs", label: "Real Canada geese calling in quick pairs" }],
      spec: {
        kind: "series", maxSec: 8, pitch: [150, 2500], hp: 150, groupGap: 0.5, split: 5,
        score: [
          ["count", 0.8, { range: [6, 20] }],
          ["pace", 1, { range: [4.5, 10] }],
          ["length", 0.8, { range: [0.04, 0.16] }],
          ["pairs", 1.2, {}],
          ["crisp", 0.6, { max: 0.06 }]
        ]
      },
      ghost: (function () {
        var out = [], t = 0;
        for (var i = 0; i < 5; i++) { out.push({ t: t, d: 0.08, s: 0, v: 1 }); out.push({ t: t + 0.12, d: 0.08, s: 4, v: 1 }); t += 0.36; }
        return out;
      })()
    },

    /* ============================ TURKEY =========================== */

    "turkey-yelp": {
      species: "turkey", name: "Yelp", level: 1, say: "kee-yuk",
      what: "A run of four to eight even notes, each rolling from high to low: kee-yuk, kee-yuk, kee-yuk.",
      when: "The all-purpose turkey call: to say “I'm here,” to strike a gobbler, and to bring him the last hundred yards.",
      steps: [
        "Box call: hold the box still in one hand and draw the lid across the lip in short, even strokes. Slate: draw small ovals with the striker.",
        "Mouth call: seat it on the roof of your mouth, tongue lightly against it, and say “chirp-chalk” — the “chirp” high, the “chalk” dropping low.",
        "Every note has to roll over from high to low.",
        "Four to eight notes at a steady, unhurried beat."
      ],
      mistakes: [
        "Notes that stay on one pitch — no roll from high to low.",
        "Machine-gun speed. A hen's yelp has a relaxed beat.",
        "Uneven spacing that sounds like a person fumbling a call."
      ],
      drill: "Say “kee-yuk” out loud six times to a slow walking beat, then copy it on the call.",
      listen: [{ clip: "turkey-yelps", label: "Real wild turkeys" }],
      spec: {
        kind: "series", maxSec: 10, pitch: [250, 3500], hp: 250, groupGap: 0.7,
        score: [
          ["count", 1, { range: [4, 9] }],
          ["pace", 1, { range: [2.2, 5] }],
          ["rhythm", 1.2, { kind: "even", cv: 0.22 }],
          ["breakDown", 1.2, { drop: 2 }],
          ["length", 0.6, { range: [0.08, 0.32] }]
        ]
      },
      ghost: run(6, 0.32, 0.18, 0, 0.2, function (q) { q.path = [[0, 6], [0.35, 6], [0.5, 0], [1, 0]]; })
    },

    "turkey-cluck": {
      species: "turkey", name: "Cluck", level: 1, say: "puk",
      what: "A single short, sharp “puk.” Turkeys cluck to keep in touch.",
      when: "Between yelps, or on its own to a bird that is close. Soft clucks say everything is fine.",
      steps: [
        "Box call: pop the lid off the lip in one short, sharp stroke.",
        "Mouth call: say “puk” with a quick burst of air, like a mini-cough.",
        "One at a time, with a pause between each."
      ],
      mistakes: [
        "Clucks that drag out into a yelp.",
        "Too fast. Spaced clucks sound content; rapid ones sound alarmed."
      ],
      drill: "Five clucks, a second or two apart. Sharp start, sharp stop.",
      listen: [{ clip: "turkey-clucks", label: "Real hen clucking" }],
      spec: {
        kind: "single", maxSec: 10, pitch: [250, 3500], hp: 250,
        score: [
          ["count", 0.5, { range: [2, 8] }],
          ["length", 1.2, { range: [0.03, 0.13] }],
          ["crisp", 1, { max: 0.05 }],
          ["pauses", 1, { range: [0.25, 2.5] }]
        ]
      },
      ghost: at([0, 0.9, 1.8, 2.7], 0.07, function (q) { q.path = [[0, 3], [1, 0]]; })
    },

    "turkey-purr": {
      species: "turkey", name: "Purr", level: 2, say: "prrrr",
      what: "A soft, rolling “prrrr” for one to three seconds: a relaxed, feeding bird.",
      when: "Close work. It calms a gobbler that's hung up out of range.",
      steps: [
        "Box call: hold the lid lightly and drag it slowly across the lip so it skips and rolls.",
        "Mouth call: flutter your lips or roll the back of your throat while blowing gently.",
        "Keep it soft and let it roll for a second or two."
      ],
      mistakes: [
        "A smooth note with no roll.",
        "Too loud: a purr is meant for a bird nearby."
      ],
      drill: "Three purrs, each about two seconds long, with a pause between.",
      listen: [],
      noClip: "No clean recording of a real purr yet: it is soft and gets lost under other turkey talk. The rhythm guide plays the roll.",
      spec: {
        kind: "single", maxSec: 10, pitch: [250, 3500], hp: 250, split: 0, minNote: 0.2,
        score: [
          ["count", 0.4, { range: [1, 4] }],
          ["holdLen", 1, { range: [0.8, 3.5] }],
          ["rolling", 1.6, { min: 0.12 }]
        ]
      },
      ghost: at([0, 2.6], 1.8, function (q) { q.roll = true; })
    },

    "turkey-cutt": {
      species: "turkey", name: "Cutt", level: 3, say: "puk-puk-puka",
      what: "Loud, fast, uneven clucks — “puk, puk-puka, puk” — a fired-up hen.",
      when: "To strike a gobbler that won't answer yelps, or to fire up one that's gobbling.",
      steps: [
        "Start from a sharp cluck.",
        "Throw them out in uneven bursts: two quick, a pause, three quick, one.",
        "Make them loud. Cutting is excited."
      ],
      mistakes: [
        "Too even. A cutt is erratic, not a metronome.",
        "Notes that blur into yelps."
      ],
      drill: "Say “puk, puk-puka, puk, puk-puk” out loud with an uneven rhythm, then copy it.",
      listen: [{ clip: "turkey-cutts", label: "Real agitated turkeys: sharp clucks in an uneven rhythm" }],
      spec: {
        kind: "series", maxSec: 8, pitch: [250, 3500], hp: 250, groupGap: 0.7,
        score: [
          ["count", 0.8, { range: [4, 14] }],
          ["length", 1, { range: [0.03, 0.13] }],
          ["rhythm", 1.2, { kind: "erratic", cv: 0.28 }],
          ["pace", 0.8, { range: [3, 9] }],
          ["crisp", 0.8, { max: 0.05 }]
        ]
      },
      ghost: at([0, 0.14, 0.42, 0.53, 0.64, 1.0, 1.12, 1.5], 0.06)
    },

    /* ============================== ELK ============================= */

    "elk-cow": {
      species: "elk", name: "Cow call (mew)", level: 1, say: "eee-uh",
      what: "A nasal “eee-uh” mew, half a second to a second and a half, that slides down at the end.",
      when: "The most useful sound in elk hunting: to calm elk, to stop a walking bull, and to pull bulls to you in the rut.",
      steps: [
        "Diaphragm call on the roof of your mouth, tongue lightly on the latex.",
        "Start with a little more tongue pressure for a higher “eee,” then ease off so it slides down to “uh.”",
        "Keep it nasal and a little whiny. Half a second to a second and a half.",
        "Space your mews out: a few seconds apart."
      ],
      mistakes: [
        "Flat, one-pitch notes with no slide down.",
        "Squeaky, thin mews from too much tongue pressure."
      ],
      drill: "Say “eee-uh” out loud with a whine, then three mews on the call, a few seconds apart.",
      listen: [{ clip: "elk-calf-mew", label: "Real elk calf mewing (higher than a cow)" }],
      spec: {
        kind: "single", maxSec: 12, pitch: [250, 3000], hp: 150, split: 9,
        score: [
          ["count", 0.4, { range: [1, 4] }],
          ["length", 1.2, { range: [0.4, 1.6] }],
          ["breakDown", 1, { drop: 1, label: "Slides down" }],
          ["pauses", 0.6, { range: [0.8, 5], single: true }]
        ]
      },
      ghost: at([0, 2.4], 1.1, function (q) { q.path = [[0, 1], [0.3, 2], [0.75, 0], [1, -3]]; })
    },

    "elk-bugle": {
      species: "elk", tone: 480, name: "Bugle", level: 3, say: "aaa-EEEEE-uh",
      what: "A bull's challenge: a low growl that climbs to a high whistle, holds, then drops away — often finished with grunts.",
      when: "In the rut, to locate bulls and to challenge a herd bull. Use it sparingly; a bad bugle sends bulls away.",
      steps: [
        "Diaphragm call in your mouth, bugle tube to your lips.",
        "Start low and growly, from your chest.",
        "Increase tongue pressure to climb — step up into a high, clear whistle.",
        "Hold the top for a second or two, then drop off the end. Add a few grunts if you like."
      ],
      mistakes: [
        "Not climbing high enough: it never reaches the whistle.",
        "Cracking or wavering at the top.",
        "Ending at the top instead of dropping off."
      ],
      drill: "Hum low and slide up as high as you can, hold it, drop it. That's the shape — then do it on the call.",
      listen: [{ clip: "elk-bugle", label: "Real bull elk, Yellowstone" }],
      spec: {
        kind: "single", maxSec: 12, pitch: [90, 3200], hp: 80, split: 0, bridge: 0.3, groupGap: 1.2,
        score: [
          ["holdLen", 1, { range: [1.2, 4.5] }],
          ["riseFall", 1.6, { climb: 8, drop: 3 }]
        ]
      },
      ghost: at([0], 2.8, function (q) { q.path = [[0, 0], [0.25, 4], [0.32, 14], [0.8, 14], [0.92, 6], [1, 2]]; })
    },

    /* ============================= DEER ============================= */

    "deer-grunt": {
      species: "deer", name: "Grunt", level: 1, say: "urp",
      what: "A short, deep “urp,” like a soft burp — the everyday sound of a buck.",
      when: "Any time in fall, and most of all around the rut. A few soft grunts, then wait 15–30 minutes.",
      steps: [
        "Grunt tube to your lips, reed set to “buck.”",
        "Push a short puff of air from your belly while saying “urp” deep in your throat.",
        "Keep it soft and short. One to three grunts, then go quiet."
      ],
      mistakes: [
        "Too high: it sounds like a fawn, not a buck.",
        "Too long or too loud for a deer that's close."
      ],
      drill: "Three short grunts, a second apart, as deep as you can make them.",
      listen: [],
      noClip: "No free recording of a real buck grunt yet. The rhythm guide plays the timing.",
      spec: {
        kind: "single", maxSec: 10, pitch: [60, 900], hp: 60,
        score: [
          ["count", 0.4, { range: [1, 6] }],
          ["length", 1, { range: [0.12, 0.6] }],
          ["deep", 1.4, { max: 280 }],
          ["pauses", 0.6, { range: [0.4, 3], single: true }]
        ]
      },
      ghost: at([0, 1.0, 2.0], 0.3)
    },

    "deer-tending": {
      species: "deer", name: "Tending grunt", level: 2, say: "urp-urp-urp",
      what: "A run of short grunts, like a buck trailing a doe: urp, urp, urp, urp…",
      when: "During the rut, to sound like a buck with a hot doe. It brings in curious and jealous bucks.",
      steps: [
        "Same grunt as before, but in a walking rhythm.",
        "Short grunts, two or three a second, for a few seconds.",
        "Keep it deep; let the volume rise and fall a little as if he's moving."
      ],
      mistakes: [
        "Grunts too long to keep the rhythm.",
        "Too high-pitched."
      ],
      drill: "Walk across the room grunting once per step.",
      listen: [],
      noClip: "No free recording of a real tending buck yet. The rhythm guide plays the walking rhythm.",
      spec: {
        kind: "series", maxSec: 10, pitch: [60, 900], hp: 60, groupGap: 1.0,
        score: [
          ["count", 0.8, { range: [4, 14] }],
          ["length", 0.8, { range: [0.08, 0.4] }],
          ["pace", 1, { range: [1.2, 4] }],
          ["rhythm", 0.8, { kind: "even", cv: 0.35, drift: 0.4 }],
          ["deep", 1.2, { max: 280 }]
        ]
      },
      ghost: run(7, 0.42, 0.2, 0, 0)
    },

    "deer-bleat": {
      species: "deer", tone: 450, name: "Doe bleat", level: 1, say: "maaa",
      what: "A nasal “maaa,” under a second long, sliding down at the end.",
      when: "Year-round as a social call; in the rut, an estrous bleat draws bucks looking for does.",
      steps: [
        "Easiest with a can call: tip it over and back.",
        "With your voice or a tube: say a nasal “maaa” through your nose and let the pitch fall at the end.",
        "One or two bleats, then a long wait."
      ],
      mistakes: [
        "Too long and drawn out.",
        "Blowing a string of them. Less is more with deer."
      ],
      drill: "Two bleats, a few seconds apart, each sliding down at the end.",
      listen: [{ clip: "deer-bleat", label: "Real whitetail (Coues) bleats" }],
      spec: {
        kind: "single", maxSec: 10, pitch: [150, 2500], hp: 120, split: 9,
        score: [
          ["count", 0.4, { range: [1, 4] }],
          ["length", 1.2, { range: [0.25, 1.2] }],
          ["breakDown", 1, { drop: 1, label: "Slides down" }],
          ["pauses", 0.6, { range: [1, 6], single: true }]
        ]
      },
      ghost: at([0, 2.6], 0.6, function (q) { q.path = [[0, 2], [0.4, 1], [1, -3]]; })
    },

    /* =========================== PREDATORS ========================== */

    "pred-rabbit": {
      species: "predator", name: "Rabbit distress", level: 1, say: "waaa",
      what: "A desperate, wavering, high-pitched “waaa-waaa” cry: a cottontail in trouble.",
      when: "Coyotes, foxes and bobcats. Call in sequences of 30–60 seconds, then pause and watch.",
      steps: [
        "Put the call deep enough in your mouth that your lips seal on the barrel.",
        "Blow hard from your gut while saying “waaa,” and let it break and waver.",
        "Open and close your hand over the end to add the cry.",
        "A run of three to eight cries, ragged and panicky, then a short break."
      ],
      mistakes: [
        "Pretty, even notes. A rabbit in trouble isn't musical.",
        "Nonstop calling: give it breaks."
      ],
      drill: "Six cries, each about half a second, letting the pitch crack and waver.",
      listen: [],
      noClip: "No free recording of a real rabbit in distress yet. The rhythm guide plays the timing of a sequence.",
      spec: {
        kind: "series", maxSec: 12, pitch: [300, 3500], hp: 250, groupGap: 1.6, split: 8,
        score: [
          ["count", 0.8, { range: [3, 10] }],
          ["length", 0.8, { range: [0.25, 1.2] }],
          ["waver", 1.4, { min: 0.45 }],
          ["high", 0.8, { min: 500 }],
          ["pauses", 0.6, { range: [0.08, 1.2] }]
        ]
      },
      ghost: at([0, 0.75, 1.5, 2.3, 3.0], 0.55, function (q) { q.path = [[0, 0], [0.2, 2], [0.4, -1], [0.6, 2.5], [0.8, 0], [1, -2]]; })
    },

    "pred-howl": {
      species: "predator", name: "Coyote howl", level: 2, say: "owww-ooo",
      what: "A lone howl that rises, holds, and falls away, two to five seconds long.",
      when: "To locate coyotes, and in breeding season to pull in a territorial one.",
      steps: [
        "Howler or your voice, with your hands cupped.",
        "Start low, slide up smoothly, hold the top.",
        "Let it fall away at the end."
      ],
      mistakes: [
        "Too short: a howl is long.",
        "Choppy pitch instead of a smooth glide."
      ],
      drill: "Hum a siren: low to high, hold, down. Make it last three seconds.",
      listen: [{ clip: "coyote-howl", label: "Real coyotes, Yellowstone" }],
      spec: {
        kind: "single", maxSec: 12, pitch: [200, 2500], hp: 150, split: 0, bridge: 0.3, groupGap: 1.2,
        score: [
          ["holdLen", 1, { range: [1.5, 6] }],
          ["riseFall", 1.4, { climb: 4, drop: 3 }],
          ["smooth", 1, { wobble: 0.6 }]
        ]
      },
      ghost: at([0], 3.2, function (q) { q.path = [[0, 0], [0.25, 6], [0.7, 7], [1, 1]]; })
    },

    /* ============================ LOCATORS ========================== */

    "loc-owl": {
      species: "locator", name: "Barred owl", level: 2, say: "who-cooks-for-you",
      what: "“Who cooks for you, who cooks for you-all”: two phrases of hoots, the last note drawn out and falling.",
      when: "At dawn and dusk to make a roosted gobbler shock-gobble — from 100 to 200 yards away, softly at first.",
      steps: [
        "Cup your hands around your mouth, or use an owl hooter.",
        "Hoot from your chest: “who cooks for you” — four quick hoots, the third and fourth rising.",
        "Take a breath, then “who cooks for you-all,” dragging the last “all” out and down.",
        "Then listen hard."
      ],
      mistakes: [
        "One long run with no break between phrases.",
        "Chopping the last note short."
      ],
      drill: "Say the words “who cooks for you, who cooks for you-all” in a deep voice, then hoot the same rhythm.",
      listen: [{ clip: "barred-owl", label: "Real barred owl" }],
      spec: {
        kind: "series", maxSec: 10, pitch: [150, 1200], hp: 100, groupGap: 1.8, split: 12,
        score: [
          ["count", 1, { range: [7, 11] }],
          ["phrase", 1.6, {}],
          ["length", 0.4, { range: [0.1, 1.2] }]
        ]
      },
      ghost: (function () {
        var t = [0, 0.28, 0.52, 0.72, 1.5, 1.78, 2.02, 2.22, 2.45], d = [0.22, 0.2, 0.16, 0.16, 0.22, 0.2, 0.16, 0.16, 0.7];
        return t.map(function (x, i) { return { t: x, d: d[i], s: [0, 0, 1, 2, 0, 0, 1, 2, 0][i], v: 1, path: i === 8 ? [[0, 1], [0.4, 1], [1, -4]] : null }; });
      })()
    },

    "loc-crow": {
      species: "locator", tone: 800, name: "Crow caw", level: 1, say: "caw",
      what: "Loud, harsh caws, three to six in a row, evenly spaced.",
      when: "Mid-morning, when owls are quiet, to make a gobbler sound off.",
      steps: [
        "Hold the call in your fist and blow hard from your gut.",
        "Say “caw” — sharp start, harsh tone.",
        "Three to six caws at an even beat, about two a second, then listen."
      ],
      mistakes: [
        "Notes too long and smooth — a crow is harsh and clipped.",
        "Uneven spacing."
      ],
      drill: "Five caws to a steady beat, two a second.",
      listen: [{ clip: "crow-caws", label: "Real American crow" }],
      spec: {
        kind: "series", maxSec: 8, pitch: [200, 3000], hp: 250, groupGap: 1.0,
        score: [
          ["count", 1, { range: [3, 7] }],
          ["pace", 1, { range: [1.4, 3.5] }],
          ["rhythm", 1, { kind: "even", cv: 0.25 }],
          ["length", 0.8, { range: [0.15, 0.45] }]
        ]
      },
      ghost: run(5, 0.5, 0.28, 0, 0)
    }
  };

  /* Where every recording came from. All of it is free to use with credit;
     the CC BY-NC-SA ones are non-commercial only (see the About screen). */
  var sounds = {
    "mallard-hen-quacks": { what: "A hen mallard quacking: single, evenly spaced quacks", by: "Barry Edmonston", ref: "XC692779", url: "https://xeno-canto.org/692779", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "Canada, 2021" },
    "mallard-hen-series": { what: "A hen mallard's descending series — the “decrescendo” that greeting and hail calls copy", by: "Patrik Åberg", ref: "XC110314", url: "https://xeno-canto.org/110314", license: "CC BY-NC-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/3.0/", where: "Sweden, 2012" },
    "mallard-hen-series-2": { what: "Another hen series: one long, loud quack, then shorter and softer ones", by: "Patrik Åberg", ref: "XC110314", url: "https://xeno-canto.org/110314", license: "CC BY-NC-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/3.0/", where: "Sweden, 2012" },
    "mallard-hen-lonesome": { what: "A hen calling now and then: single quacks with long pauses", by: "Patrik Åberg", ref: "XC110314", url: "https://xeno-canto.org/110314", license: "CC BY-NC-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/3.0/", where: "Sweden, 2012" },
    "mallard-hen-long": { what: "A hen mallard's long, loud run of quacks", by: "Sonothèque ADVL (Corentin Rivière)", ref: "XC730554", url: "https://xeno-canto.org/730554", license: "CC0 (public domain)", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", where: "France, 2022" },
    "mallard-feeding": { what: "Mallards feeding at the edge of a pond", by: "Andrew Harrop", ref: "XC1189375", url: "https://xeno-canto.org/1189375", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "United Kingdom, 2026" },
    "mallard-drake": { what: "A drake mallard's raspy call", by: "Patrik Åberg", ref: "XC26967", url: "https://xeno-canto.org/26967", license: "CC BY-NC-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/3.0/", where: "Sweden, 2007" },
    "pintail-drake": { what: "A drake pintail's rolling whistle", by: "David Darrell-Lambert", ref: "XC1082420", url: "https://xeno-canto.org/1082420", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "United Kingdom, 2026" },
    "goose-honks": { what: "A Canada goose honking: low-to-high honks with clean gaps", by: "Richard E. Webster", ref: "XC816269", url: "https://xeno-canto.org/816269", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "United States, 2023" },
    "goose-clucks": { what: "Canada geese clucking: quick, short honks", by: "Doug Hynes", ref: "XC934272", url: "https://xeno-canto.org/934272", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/", where: "Canada, 2010" },
    "goose-pairs": { what: "Canada geese calling in quick pairs", by: "Michael Hurben", ref: "XC844837", url: "https://xeno-canto.org/844837", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "United States, 2023" },
    "turkey-yelps": { what: "Wild turkeys yelping", by: "Richard E. Webster", ref: "XC779658", url: "https://xeno-canto.org/779658", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "United States, 2022" },
    "turkey-clucks": { what: "A wild turkey hen with poults, clucking", by: "Paul Driver", ref: "XC770958", url: "https://xeno-canto.org/770958", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "United States, 2013" },
    "turkey-cutts": { what: "Agitated young turkeys: sharp clucks in an uneven rhythm", by: "Jonathon Jongsma", ref: "XC104533", url: "https://xeno-canto.org/104533", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/", where: "United States, 2012" },
    "elk-bugle": { what: "A bull elk bugling at Mammoth Hot Springs", by: "U.S. National Park Service, Yellowstone", ref: "Elk Bugle One", url: "https://www.nps.gov/yell/learn/photosmultimedia/sounds-elk.htm", license: "Public domain", licenseUrl: "https://www.nps.gov/yell/learn/photosmultimedia/sounds-elk.htm", where: "Yellowstone National Park" },
    "elk-calf-mew": { what: "An elk calf mewing", by: "U.S. National Park Service, Yellowstone", ref: "Elk Calf", url: "https://www.nps.gov/yell/learn/photosmultimedia/sounds-elk.htm", license: "Public domain", licenseUrl: "https://www.nps.gov/yell/learn/photosmultimedia/sounds-elk.htm", where: "Yellowstone National Park" },
    "deer-bleat": { what: "Whitetail deer bleats (Coues subspecies, identified by call)", by: "Paul Marvin", ref: "XC975498", url: "https://xeno-canto.org/975498", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "United States, 2022" },
    "coyote-howl": { what: "Coyotes howling along the Gibbon River", by: "U.S. National Park Service, Yellowstone", ref: "Coyotes Howling", url: "https://www.nps.gov/yell/learn/photosmultimedia/sounds-coyote.htm", license: "Public domain", licenseUrl: "https://www.nps.gov/yell/learn/photosmultimedia/sounds-coyote.htm", where: "Yellowstone National Park" },
    "barred-owl": { what: "A barred owl's two-phrase call", by: "Sunny Tseng", ref: "XC911365", url: "https://xeno-canto.org/911365", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "Canada, 2021" },
    "crow-caws": { what: "An American crow cawing", by: "Thomas Magarian", ref: "XC462765", url: "https://xeno-canto.org/462765", license: "CC BY-NC-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/", where: "United States, 2018" }
  };

  Object.keys(calls).forEach(function (id) { calls[id].id = id; });
  var data = { species: species, calls: calls, sounds: sounds };
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.CALLWILD = data;
})(typeof self !== "undefined" ? self : this);
