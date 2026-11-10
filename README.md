# Ironset

Three web apps with no server, no account and no sign-in. Open the file in a browser, or add it to a phone's home screen. All data stays in that browser's local storage.

- **`ironset.html`** is a strength-training log for lifters who train by RPE. It is **generated** —
  edit `src/ironset.src.html` and run `node build.mjs`, which compiles the JSX and writes
  `ironset.html` plus `app.js`. The app was authored as one file with an in-browser JSX compiler
  until that compiler reached 2.8MB, five times the app, on every cold start; moving the compile
  to build time took the app from usable in 6.7s to usable in 0.4s on a throttled phone. A test
  in the suite rebuilds and compares, so a forgotten build fails rather than shipping stale. It installs as a
  home-screen app (`manifest.webmanifest`) and caches itself through `sw.js`, so it opens and
  works in a gym with no signal. Sets can carry video, kept in IndexedDB on the device.
- **`steady.html`** gives short, simple workouts to people who find exercise hard to start, and to older adults who want to keep their strength and balance. A one-minute setup asks about age, goals, daily routine, sore joints, equipment and available time. The app then builds a 5 to 20 minute session for each day. An animated stick figure demonstrates every move, and a voice coach talks the person through the session.
- **`callwild/`** (working title *Call of the Wild*) teaches game calls and scores your attempts:
  47 calls across 14 animals — mallards and other puddle ducks, pintail and wigeon, teal, wood
  duck, divers, Canada geese, wild turkey, elk, whitetail, moose, bobwhite, mourning dove,
  predators and turkey locators. Every call listed has a real recording behind it: a call with no
  recording isn't listed. Each lesson covers what the call is, when to use it, how to make it,
  common mistakes and a practice drill, plus the recording and a rhythm guide. Tap record and blow
  your call at the phone. `analysis.js` splits the recording into notes and measures note count,
  speed, rhythm, pitch and volume shape, note length, clean stops, and the shape inside each note
  (a honk's break, a yelp's drop, a bugle's climb). It also checks how the call *sounds* against
  its real recording: where its pitch sits (or how bright it is, for a raspy call), and whether it
  is a clean note, a raspy one, or just air. Timing parts and sound parts are each a weighted
  geometric mean, and the score is the two multiplied, so a total miss on one part sinks the
  score and the right rhythm on the wrong sound (a whistle in a quack's rhythm, clapping) can't
  score well. When a low score is clearly a different call of the same group (a goose honk in a
  duck lesson), the result names it, but never a close cousin whose real recordings the scorer
  can't tell apart either. Everything runs on the phone; nothing is uploaded. The look is a dark
  field theme: a topo-map texture, blaze orange for the one thing to do next, and the sound
  pictures drawn like a thermal scope's view. A Daylight theme is there for bright sun.

  Targets come from two places. For calls that are a caller's craft, timing targets are set by
  hand in `calls.js` from calling instruction. For calls that copy an animal closely, they are
  measured from the call's own recording. `node callwild/tools/learn.cjs` (needs ffmpeg) rewrites
  the LEARNED block in `calls.js`: those timing targets, the sound targets for every call, and each
  call's cousins. `node callwild/tools/check.cjs` then grades the scoring: every real recording on
  its own lesson and on every other lesson, decoys (whistling, humming, talking, clapping,
  blowing) on every lesson, and each recording altered the way a person's call differs (pitch,
  tempo, room echo, a bassy or tinny phone, noise). The clips in `callwild/sounds/` come from xeno-canto, the National
  Park Service (Yellowstone and Rocky Mountain) and SoundBible, including Fish and Wildlife Service
  recordings. They are trimmed, lightly de-noised and level-matched, and credited on the About
  screen. Most are licensed non-commercial only. The app has its own folder so its service worker
  (scope `callwild/`) can't collide with IRONSET's. The scoring targets are a first draft and need
  a seasoned caller's check.
