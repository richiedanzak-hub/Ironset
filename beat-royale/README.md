# 🎧 Beat Royale

**Toss songs in the hat. Battle them head‑to‑head. The last track standing wins the night.**

The music version of [Reel Royale](../reel-royale/). Same game, but for songs, albums or artists:

1. **Fill the hat.** Everyone secretly adds songs (or albums, or artists) they love, typed in or picked from the ✨ ideas browser.
2. **Head-to-head.** Two picks come out of the hat. Play the 30-second previews, everyone votes on their own phone, and the winner stays on.
3. **Crown the champ.** The last one standing wins, with buttons to play it on Spotify, Apple Music, YouTube or Deezer.

Everyone plays on their own phone. The host sends a link (or shows a QR code), and people join by typing their name. There are no accounts or app downloads.

## What's in it

- **Songs, albums or artists.** The host picks one in the lobby; songs are the default.
- **A theme for the night (optional).** The host taps a ready-made theme (90s Rock, 80s Party, Road trip, Sing-along…) or makes one from a genre, decade, vibe and a name. Everyone sees it on the invite, in the lobby and while adding songs, and the ideas browser sticks to it.
- **Off-theme picks are blocked** when the theme has a genre or decade (the host can switch this to "Allowed"). Each pick is checked as it goes in, against the genres Deezer files the song and artist under and the year of its first release. Close genres count: a Rock night takes Alternative and Metal. A song that doesn't fit is marked right on it ("Shake It Off is Pop, not Rock") instead of going in.
- **The original album, every time.** A song picked from a compilation ("The Ultimate Workout Collection") is switched to the version on the artist's own album, with that album's cover and year. Search also prefers the original version.
- **Champions round (optional).** When the hat is empty, every pick that won at least one matchup comes back, and they play king of the hill against each other for the real crown.
- **Clean-only parties.** One switch hides explicit songs and albums everywhere and blocks them from the hat.
- **30-second previews** on every cover. **Play the matchup** plays 15 seconds of each, back to back, which is handy on a speaker.
- **Brainstorm helper:**
  - Lists: 🔥 Top charts (today's), 🆕 New, 🏆 All-time classics, 🎲 Surprise me
  - Filters: genre, decade (60s to 2020s) and vibe (party, sing-along, feel-good, chill, workout, road trip, love songs)
  - It keeps loading as you scroll (up to about 2,000 per list): the chart, then playlist after playlist, then more songs by artists it has shown. Nothing repeats.
  - Every phone gets its own shuffle, and 🔀 Shuffle mixes it up again
  - Previews and one-tap adding
- **Search that finds the deep cuts.** Type a title, or a title and artist ("Still Waiting - Sum 41", "on the loose saga"). Exact matches come first, and Apple's catalog fills in when Deezer comes up short.
- **Same house rules as Reel Royale:**
  - minimum and maximum picks per person, and optional timers
  - reveal who picked what: never, after each vote, or always
  - ties: coin flip, champ stays, or 3-way showdown
- **Duplicates merge,** including remasters and live versions ("Bohemian Rhapsody - Remastered 2011" is the same song).
- **Champion screen:**
  - cover, year, album, length and BPM
  - listen-on links that open the song itself on Spotify, Apple Music and YouTube (found through Apple's catalog and [song.link](https://odesli.co), both keyless), or a search when there's no exact match
  - a "best taste" podium
  - everyone's picks, grouped by person, with how far each one got (unless the host chose to keep picks secret; then you see only your own)
  - the full road to the crown
- **Past parties.** Each phone keeps the recap of every party it finished (up to 30), under 📜 Past parties on the home screen or in the party menu. They're stored on the phone, so they survive the server restarting.

## Where the music data comes from

**[Deezer's public API](https://developers.deezer.com/api).** It's free and needs **no key and no account**:

- charts updated daily, overall and per genre
- millions of songs, albums and artists
- album covers and artist photos
- 30-second previews for nearly every track

Apple's iTunes search (also keyless) fills in when Deezer has few results, and takes over if Deezer can't be reached. The ideas browser falls back to a built-in list of about 230 classic songs and 70 albums.

Deezer allows 50 requests every 5 seconds per server. The app stays under that and waits and retries when Deezer says "slow down", which can happen on shared hosting like Render's free plan.

**Is the music data working?** Open `/api/music/status` on your site (for example https://beat-royale.onrender.com/api/music/status). It runs a live test search on Deezer and Apple and shows each one's last error, if any.

Why not the others:

- **Spotify** needs a developer app and no longer gives new apps previews or recommendations.
- **Last.fm** needs a key and has almost no images.
- **MusicBrainz** has great facts but no popularity or charts.

## Run it at home

You need [Node.js](https://nodejs.org) 18 or newer. There's nothing else to install.

```sh
cd beat-royale
npm start
```

Open the address it prints. Phones on the same Wi-Fi can join with the invite link.

## Put it online (free) with Render

Make a second web service next to Reel Royale:

1. On **dashboard.render.com**, tap **+ New → Web Service** and pick the **Ironset** repo.
2. Fill in the settings:
   - **Name:** `beat-royale`
   - **Language:** Node
   - **Branch:** the branch this folder is on
   - **Root Directory:** `beat-royale`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
3. Leave Environment Variables empty, because no key is needed. Then deploy.

The free plan sleeps after 15 quiet minutes, so open the link a minute before you play.

## For developers

```sh
npm test        # game rules, HTTP + live updates, Deezer/iTunes adapters (against a fake server)
npm run dev     # restart on changes
```

```
server.js          start the server
src/game.js        the game rules (pure, fully tested)
src/app.js         HTTP API, static files, live updates (Server-Sent Events)
src/music.js       Deezer / iTunes / built-in catalog
src/catalog.js     the built-in backup list
public/js/         the app screens (lobby, submit, ideas, battle, final)
```

| Variable | What it does |
| --- | --- |
| `PORT` | Port to listen on (default `3000`) |
| `PUBLIC_URL` | The address used in invite links, if the automatic one is wrong (Render sets this for you) |

## Credits

Music data, covers and previews are from Deezer. Bundled libraries and fonts: Preact (MIT), htm (Apache-2.0), qrcode-generator (MIT), and the Fredoka and Nunito fonts (SIL Open Font License).
