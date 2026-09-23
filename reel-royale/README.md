# 🎬 Reel Royale

**Toss movies in the hat. Vote head‑to‑head. The last movie standing is tonight's pick.**

A party game for deciding movie night, based on the paper-and-hat version:

1. **Fill the hat.** Everyone secretly adds movies they'd like to watch, typed in or picked from the ✨ ideas browser.
2. **Head-to-head.** Two movies come out of the hat and everyone votes on their own phone. The winner stays on and faces the next movie drawn.
3. **Crown the champ.** The last movie standing wins, and the app shows where you can stream, rent or buy it.

Everyone plays on their own phone. The host sends a link (or shows a QR code) and people join by typing their name. There are no accounts or app downloads.

## What's in it

- **Join by link, QR code or 4-letter code.** Opening the link asks for a name and an avatar, and that's it. If someone's phone locks or the page reloads, they drop straight back into the game.
- **House rules (host):**
  - minimum and maximum movies per person
  - an optional timer for filling the hat
  - an optional vote timer
  - whether to reveal who picked each movie: *never*, *after each vote*, or *always*
  - tie-breaker: coin flip, the reigning champ keeps the crown, or **3-way showdown** (both tied movies stay in and the next movie from the hat joins them; a tied 3-way can grow to a 4-way, and a random draw settles anything past that)
- **Secret hat.** You only see your own picks until they're drawn. You can remove your picks any time before the hat closes.
- **Duplicates merge.** If two people add the same movie, it goes in once and both get credit ("Great minds!").
- **The hat closes** when everyone taps *I'm done*, when the timer runs out, or when the host closes it early.
- **Brainstorm helper.**
  - Lists: Popular, Top rated, Trending, Hidden gems, Surprise me
  - Filters: genre, decade, family friendly, under 2 hours
  - With a TMDB key, also filter by **what's on your streaming services**
  - One tap adds a movie to the hat
- **Battle screen.** Posters face off VS-style. Everyone sees who has voted (but not how), with a champion win streak, an animated reveal, an **OUT** stamp and a coin flip for ties.
- **Champion screen.**
  - Where to watch: streaming, free, rent and buy options by country
  - Trailer, JustWatch and Google links
  - Matchup history
  - A "best taste" podium ranking whose movies won the most matchups
- **Host tools:** extend the timer, close voting, remove a player, hand over hosting, rematch with the same hat, or start a new game. If the host's phone disappears for 90 seconds, someone else becomes host automatically.

## Run it at home (easiest for a family night)

You need [Node.js](https://nodejs.org) 18 or newer on a computer. There's nothing to install beyond that.

```sh
cd reel-royale
npm start
```

It prints two addresses:

```
On this computer:     http://localhost:3000
Phones on your Wi-Fi: http://192.168.1.23:3000
```

Open the first one, tap **Host a movie night**, and share the invite. The invite link automatically uses the Wi-Fi address, so phones on the same Wi-Fi can open it.

## Put it online (free) so anyone can join from anywhere

The repo includes a [Render](https://render.com) blueprint (`render.yaml` in the repo root):

1. Sign in to render.com with GitHub.
2. Choose **New → Blueprint** and pick this repository.
3. When it asks for `TMDB_API_KEY`, paste your key (see below) or leave it empty for now.
4. Click **Apply**. In a minute or two you'll get a link like `https://reel-royale.onrender.com`.

On Render's free plan the app goes to sleep after 15 quiet minutes, so the first visit after a break takes about a minute to wake up. Open it a minute before game time.

It also runs anywhere else that runs Node (Railway, Fly.io, a Raspberry Pi…). The start command is `node server.js`, and the app listens on `PORT`.

## Turn on posters, ratings and "where to watch" (free)

Without a key, the game still works: search still finds movies (via Apple's iTunes search), and the ideas browser uses a built-in list of nearly 400 crowd favourites. With a free [TMDB](https://www.themoviedb.org) key you also get:

- real posters and ratings for every movie
- the full TMDB catalogue in the ideas browser
- the **streaming service filter**
- live **where to watch** for the winner

To get a key:

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API**, request a key (Developer, personal use), and copy either the **API Key** or the **API Read Access Token**. Either one works.
3. Set it as `TMDB_API_KEY`:
   - Render: **Environment → Add Environment Variable**
   - At home: `TMDB_API_KEY=your_key npm start`

## Tips

- **Only one phone?** Have the host type in everyone's picks, then vote by show of hands and tap the winner. When only one person is connected, their vote decides each matchup.
- **Late arrivals** can join at any time. They can add movies while the hat is open and vote as soon as they're in.
- **Someone's phone died?** They can reopen the link and type the same name to get their seat back.

## Settings (environment variables)

| Variable | What it does |
| --- | --- |
| `PORT` | Port to listen on (default `3000`) |
| `TMDB_API_KEY` | TMDB v3 API key or v4 read access token. Turns on posters, ratings, streaming filters and where-to-watch |
| `PUBLIC_URL` | The address used in invite links, if the automatic one is wrong (Render sets this for you) |

## For developers

No dependencies and no build step. It's plain Node on the server, and [Preact](https://preactjs.com) + [htm](https://github.com/developit/htm) modules in the browser (vendored in `public/vendor`).

```sh
npm test        # game rules, HTTP + live updates, TMDB/iTunes adapters
npm run dev     # restart on changes
```

```
server.js          start the server
src/game.js        the game rules (pure, fully tested)
src/app.js         HTTP API, static files, live updates (Server-Sent Events)
src/movies.js      TMDB / iTunes / built-in catalog
src/catalog.js     the built-in movie list
public/js/         the app screens (lobby, submit, ideas, battle, final)
public/styles.css  the purple party theme
```

Rooms live in memory and are cleaned up after 6 idle hours.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability is provided by JustWatch via TMDB.

Bundled libraries and fonts:

- Preact (MIT)
- htm (Apache-2.0)
- qrcode-generator (MIT)
- Fredoka and Nunito fonts (SIL Open Font License)
