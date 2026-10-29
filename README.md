# Ironset

Two web apps with no server, no account and no sign-in. Open the file in a browser, or add it to a phone's home screen. All data stays in that browser's local storage.

- **`ironset.html`** is a strength-training log for lifters who train by RPE. It is **generated** —
  edit `src/ironset.src.html` and run `node build.mjs`, which compiles the JSX and writes
  `ironset.html` plus `app.js`. The app was authored as one file with an in-browser JSX compiler
  until that compiler reached 2.8MB, five times the app, on every cold start; moving the compile
  to build time took the app from usable in 6.7s to usable in 0.4s on a throttled phone. A test
  in the suite rebuilds and compares, so a forgotten build fails rather than shipping stale. It installs as a
  home-screen app (`manifest.webmanifest`) and caches itself through `sw.js`, so it opens and
  works in a gym with no signal. Sets can carry video, kept in IndexedDB on the device.
- **`steady.html`** gives short, simple workouts to people who find exercise hard to start, and to older adults who want to keep their strength and balance. A one-minute setup asks about age, goals, daily routine, sore joints, equipment and available time. The app then builds a 5 to 20 minute session for each day. An animated stick figure demonstrates every move, and a voice coach talks the person through the session.
