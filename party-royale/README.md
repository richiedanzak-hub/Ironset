# 🎉 Party Royale

**Toss movies or songs in the hat. Battle them head‑to‑head. The last one standing wins the night.**

One party game, two modes:

- **🎬 Movie night.** Everyone adds movies they'd like to watch. The winner is tonight's movie, with where to stream it.
- **🎧 Music battle.** Everyone adds songs (or albums, or artists) they love. Play the 30-second previews and crown the anthem of the night.

How a game goes:

1. **Fill the hat.** Everyone secretly adds picks, typed in or chosen from the ✨ ideas browser.
2. **Head-to-head.** Two picks come out of the hat, everyone votes on their own phone, and the winner stays on.
3. **Crown the champ.** The last one standing wins.

Everyone plays on their own phone. The host sends a link (or shows a QR code), and people join by typing their name. There are no accounts or app downloads.

## What's in it

- **Movies, songs, albums or artists.** The host picks one on the home screen and can switch in the lobby.
- **A theme for the night (optional).** Ready-made themes for each mode (Horror night, Family movie night, 90s Rock, 80s Party, Road trip…) or your own genre, decade and name. The ideas browser sticks to it.
- **Off-theme picks are blocked** when the theme has a genre or decade (the host can switch this to "Allowed"). Each pick is checked as it goes in, and one that doesn't fit is marked right on it ("Oppenheimer is Drama / History, not Animation").
- **Champions round (optional).** When the hat is empty, every pick that won a matchup comes back for one last king-of-the-hill.
- **House rules:** minimum and maximum picks per person, optional timers, reveal who picked what (never, after each vote, or always), and ties (coin flip, champ stays, or a 3-way showdown).
- **Ideas browser:**
  - Movies: popular, top rated, trending, hidden gems, surprise me; filter by genre, decade and streaming service; family friendly and under 2 hours
  - Music: today's charts, new, all-time classics, surprise me; filter by genre, decade and vibe; it keeps loading as you scroll and every phone gets its own shuffle
- **Music extras:** 30-second previews on every cover, "play the matchup", clean-only parties, and every song switched to its original album and cover (not a workout compilation).
- **Champion screen:**
  - Movies: where to watch (stream, free, rent, buy) by country, plus the trailer
  - Music: buttons that open the song itself on Spotify, Apple Music, YouTube and Deezer
  - a "best taste" podium, everyone's picks and how far each got, and the road to the crown
- **Past parties.** Each phone keeps the recap of every party it finished (up to 30), under 📜 Past parties.

## Where the data comes from

- **Music: [Deezer's public API](https://developers.deezer.com/api).** Free, no key. Charts, covers, 30-second previews and genres. Apple's iTunes search fills gaps, and [song.link](https://odesli.co) finds the song on Spotify and YouTube.
- **When a song first came out: [MusicBrainz](https://musicbrainz.org)** (free, no key) and Apple. Deezer often files a classic under a re-recording or a remastered reissue ("Rock You Like a Hurricane" on 2011's *Comeblack*), so the year and album come from these instead: *Love at First Sting*, 1984. That's what the decade check and the cover use.
- **Movies: [TMDB](https://www.themoviedb.org)** with a free key (see below): posters, ratings, genres, the full catalog and where to watch. Without a key, movie search still works through Apple's iTunes search and the ideas browser uses a built-in list of about 400 favourites.

**Is the data working?** Open `/api/music/status` on your site for a live check of Deezer and Apple.

## Turn on movie posters, ratings and "where to watch" (free)

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API**, request a key (Developer, personal use), and copy either the **API Key** or the **API Read Access Token**. Either one works.
3. Set it as `TMDB_API_KEY`:
   - Render: **Environment → Add Environment Variable**
   - At home: `TMDB_API_KEY=your_key npm start`

## Run it at home

You need [Node.js](https://nodejs.org) 18 or newer. There's nothing else to install.

```sh
cd party-royale
npm start
```

Open the address it prints. Phones on the same Wi-Fi can join with the invite link.

## Put it online (free) with Render

1. On **dashboard.render.com**, tap **+ New → Web Service** and pick the **Ironset** repo (or point an existing service at this folder: **Settings → Root Directory**).
2. Settings:
   - **Language:** Node
   - **Root Directory:** `party-royale`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
3. Add `TMDB_API_KEY` under **Environment** for movie posters (optional).

The free plan sleeps after 15 quiet minutes, so open the link a minute before you play.

## For developers

```sh
npm test        # game rules, HTTP + live updates, Deezer/iTunes/TMDB adapters (against fake servers)
npm run dev     # restart on changes
```

```
server.js              start the server
src/game.js            the game rules (pure, fully tested)
src/app.js             HTTP API, static files, live updates (Server-Sent Events)
src/music.js           Deezer / iTunes / song.link / built-in music list
src/movies.js          TMDB / iTunes / built-in movie list
src/*-catalog.js       the built-in backup lists
public/js/             the app screens (home, lobby, submit, ideas, battle, final, past parties)
```

| Variable | What it does |
| --- | --- |
| `PORT` | Port to listen on (default `3000`) |
| `TMDB_API_KEY` | TMDB key or read access token, for movie posters, ratings and where to watch |
| `PUBLIC_URL` | The address used in invite links, if the automatic one is wrong (Render sets this for you) |

## Credits

Music data, covers and previews from Deezer. Movie data from TMDB: this product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability by JustWatch, via TMDB. Bundled libraries and fonts: Preact (MIT), htm (Apache-2.0), qrcode-generator (MIT), and the Fredoka and Nunito fonts (SIL Open Font License).
