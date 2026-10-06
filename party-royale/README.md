# 🎉 Party Royale

**Battle your movies and songs head‑to‑head, or race to name that song. Everyone plays on their own phone.**

Three games:

- **🎬 Movie night.** Everyone adds movies they'd like to watch. The winner is tonight's movie, with where to stream it.
- **🎧 Music battle.** Everyone adds songs (or albums, or artists) they love. Play the 30-second previews and crown the anthem of the night.
- **🎤 Who sings it?** A music quiz. A song plays and everyone races to name the artist (or the song). Bet your points on the last one. [More below](#-who-sings-it).

How a battle goes:

1. **Fill the hat.** Everyone secretly adds picks, typed in or chosen from the ✨ ideas browser.
2. **The bracket.** Picks pair off at random, everyone votes on their own phone, and the winners move on round by round (Quarterfinals, Semifinals, Final). Every pick gets the same shot.
3. **Score points.** Guess who picked each one, and earn points when your picks win.
4. **Crown the champ.** The last pick standing wins the night, and the player with the most points wins the game.

## The points game

It's on by default. The host can switch it off in the lobby.

| Points | How you earn them |
| --- | --- |
| 🕵️ +1 | Guess who picked each pick, the first time it shows up |
| ⭐ +2 | Your pick wins a matchup |
| 👑 +3 | Your pick is the champion |

The **🗂️ The bracket** and **🏅 Scores** buttons show where things stand at any time. The final screen shows the scores podium and each player's breakdown.

Everyone plays on their own phone. The host sends a link (or shows a QR code), and people join by typing their name. There are no accounts or app downloads.

## 🎤 Who sings it?

A separate game from the battles: no hat, no picks. The game brings the songs.

1. **A song plays.** After a 3‑2‑1, a 30-second preview starts. By default it plays on the host's phone, so everyone in the room hears one clean sound (hook it up to a speaker). Playing from different places? Switch it to every phone. Anyone can also tap "Play it here too".
2. **Pick the answer.** Four big buttons on every phone. No changing your mind once you tap.
3. **The reveal.** The cover, title, artist and original album, who picked what, who was fastest, and the scores.
4. **Double or nothing.** Before the last song, you see a hint (say "The 80s · Rock"), then everyone secretly bets some or all of their points. Get it right and win what you bet, get it wrong and lose it. Anyone low on points can still bet up to 100.

| Points | How you earn them |
| --- | --- |
| ✓ 100 | A right answer |
| ⚡ up to +50 | Answering fast (the full 50 right away, less as the clock runs down) |
| 💰 ± your bet | The last song, with the finale on |

House rules: what to name (🎤 the artist, 🎵 the song, or 🔀 take turns), how many songs (5, 10, 15 or 20), time to answer (10–30 seconds), the theme (the same ready-made ones as the music battle, or your own genre, decade and vibe), clean songs only, and where the music plays.

The songs: well-known ones that fit the theme, one per artist, each checked to make sure its preview plays. The wrong choices sound right on purpose: other well-known artists from the same kind of music and time, and, when you name the song, other songs by the same artist. Each song is switched to its original album and year once the game starts. Your phone never gets the answer before the reveal (not even a song id to look up).

## What's in a battle

- **Movies, songs, albums or artists.** The host picks one on the home screen and can switch in the lobby.
- **A theme for the night (optional).** Ready-made themes for each mode (Horror night, Family movie night, 90s Rock, 80s Party, Road trip…) or your own genre, decade and name. The ideas browser sticks to it.
- **Off-theme picks are blocked** when the theme has a genre or decade (the host can switch this to "Allowed"). Each pick is checked as it goes in, and one that doesn't fit is marked right on it ("Oppenheimer is Drama / History, not Animation").
- **Two ways to play:**
  - 🏆 **Bracket** (default): picks pair off and the winners move on. Odd numbers get byes. Two picks from the same person don't meet in round 1 when that can be avoided. Ties are a coin flip.
  - 👑 **King of the hill:** the winner stays on and fights the next pick out of the hat. Only this mode has the **champions round** (every pick that won a matchup comes back for one last battle) and the tie options (coin flip, champ stays, or a 3-way showdown).
- **House rules:** minimum and maximum picks per person, optional timers, the points game, and (with points off) when to reveal who picked what.
- **Ideas browser:**
  - Movies: popular, top rated, trending, hidden gems, surprise me; filter by genre, decade and streaming service; family friendly and under 2 hours
  - Music: today's charts, new, all-time classics, surprise me; filter by genre, decade and vibe; it keeps loading as you scroll and every phone gets its own shuffle
- **Music extras:** 30-second previews on every cover, "play the matchup", clean-only parties, and every song switched to its original album and cover (not a workout compilation).
- **Champion screen:**
  - Movies: where to watch (stream, free, rent, buy) by country, plus the trailer
  - Music: buttons that open the song itself on Spotify, Apple Music, YouTube and Deezer
  - the final scores podium (or, with points off, a "best taste" podium), everyone's picks and how far each got, and the road to the crown
- **Past parties.** Each phone keeps the recap of every party it finished (up to 30), battles and quizzes, under 📜 Past parties.

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
src/game.js            the battle rules, and what both games share (pure, fully tested)
src/quiz.js            Who sings it? rules (pure, fully tested)
src/app.js             HTTP API, static files, live updates (Server-Sent Events)
src/music.js           Deezer / iTunes / song.link / built-in music list
src/movies.js          TMDB / iTunes / built-in movie list
src/*-catalog.js       the built-in backup lists
public/js/             the app screens (home, lobby, submit, ideas, battle, final, quiz, past parties)
```

| Variable | What it does |
| --- | --- |
| `PORT` | Port to listen on (default `3000`) |
| `TMDB_API_KEY` | TMDB key or read access token, for movie posters, ratings and where to watch |
| `PUBLIC_URL` | The address used in invite links, if the automatic one is wrong (Render sets this for you) |

## Credits

Music data, covers and previews from Deezer. Movie data from TMDB: this product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability by JustWatch, via TMDB. Bundled libraries and fonts: Preact (MIT), htm (Apache-2.0), qrcode-generator (MIT), and the Fredoka and Nunito fonts (SIL Open Font License).
