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
- **`callwild/`** (working title *Call of the Wild*) teaches game calls and scores your attempts.
  It has 25 calls across ducks, geese, turkey, elk, whitetail, predators and turkey locators. Each
  lesson covers what the call is, when to use it, how to make it, common mistakes and a practice
  drill, plus a real recording of the animal and a rhythm guide. Tap record and blow your call at
  the phone. `analysis.js` splits the recording into notes and measures note count, speed,
  rhythm, pitch and volume shape, note length, clean stops, and the shape inside each note
  (a honk's break, a yelp's drop, a bugle's climb). It scores those against the targets in
  `calls.js` and turns the biggest misses into tips. Everything runs on the phone; nothing is
  uploaded. The analyzer is plain JS with no DOM, so the same file runs under Node for testing.
  The reference clips in `callwild/sounds/` are real recordings from xeno-canto and the National
  Park Service, credited on the About screen. Most are CC BY-NC-SA, which rules out commercial
  use. The app has its own folder so its service worker (scope `callwild/`) can't collide with
  IRONSET's. The scoring targets are a first draft and need a seasoned caller's check.
