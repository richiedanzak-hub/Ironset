# Ironset

Two single-file web apps. Each is one static HTML page with no server, no account and no build step. Open the file in a browser, or add it to a phone's home screen. All data stays in that browser's local storage.

- **`ironset.html`** is a strength-training log for lifters who train by RPE. It installs as a
  home-screen app (`manifest.webmanifest`) and caches itself through `sw.js`, so it opens and
  works in a gym with no signal.
- **`steady.html`** gives short, simple workouts to people who find exercise hard to start, and to older adults who want to keep their strength and balance. A one-minute setup asks about age, goals, daily routine, sore joints, equipment and available time. The app then builds a 5 to 20 minute session for each day. An animated stick figure demonstrates every move, and a voice coach talks the person through the session.
