/* Call of the Wild service worker — the app opens, and practice works, with no signal.

   It lives in its own folder so its scope is callwild/ only: a worker at the
   repo root would fight IRONSET's for the same scope and one would replace the
   other. */
const VERSION = "callwild-v1";
const SHELL = VERSION + "-shell";
const DEPS = VERSION + "-deps";
const SOUNDS = VERSION + "-sounds";
const KEEP = [SHELL, DEPS, SOUNDS];

const SHELL_URLS = [
  "./",
  "./index.html",
  "./analysis.js",
  "./calls.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
];

/* Every reference recording, so lessons can be heard offline. ~700 KB in all. */
const SOUND_URLS = [
  "mallard-hen-quacks", "mallard-hen-series", "mallard-hen-series-2", "mallard-hen-lonesome",
  "mallard-feeding", "mallard-drake", "pintail-drake", "canada-goose", "turkey-yelps",
  "turkey-clucks", "elk-bugle", "elk-calf-mew", "deer-bleat", "coyote-howl", "barred-owl", "crow-caws",
].map((id) => "./sounds/" + id + ".mp3");

/* Third-party code the app cannot boot without: React and the fonts. Versioned, so they never go stale. */
const DEP_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap",
];
const DEP_ORIGINS = DEP_URLS.map((u) => new URL(u).origin).concat(["https://fonts.gstatic.com"]);

/* Storing a response can fail on its own (quota, an opaque body); never let that take the install down. */
const keep = (cache, req, res) => {
  if (!res || (!res.ok && res.type !== "opaque")) return Promise.resolve();
  try { return cache.put(req, res).catch(() => {}); } catch (err) { return Promise.resolve(); }
};
const cacheQuietly = (cache, url) => fetch(url, { credentials: "omit" }).then((res) => keep(cache, url, res)).catch(() => null);

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    await Promise.all(SHELL_URLS.map((u) => cacheQuietly(shell, u)));
    const deps = await caches.open(DEPS);
    await Promise.all(DEP_URLS.map((u) => cacheQuietly(deps, u)));
    const sounds = await caches.open(SOUNDS);
    await Promise.all(SOUND_URLS.map((u) => cacheQuietly(sounds, new URL(u, self.location).href)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith("callwild-") && KEEP.indexOf(n) < 0).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

/* Newest copy wins when there is a connection; the cached copy keeps the app usable when there isn't. */
async function freshFirst(req, cacheName, fallback) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    await keep(cache, req, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(req)) || (fallback ? await cache.match(fallback) : null);
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  await keep(cache, req, res.clone());
  return res;
}

/* Audio elements ask for byte ranges, and Safari will not play a clip that
   answers a range request with the whole file — so cut the range out of the
   cached copy and answer 206 like a server would. */
async function ranged(req) {
  const cache = await caches.open(SOUNDS);
  let res = await cache.match(req.url);
  if (!res) {
    res = await fetch(req.url, { credentials: "omit" });
    if (!res.ok) return res;
    await keep(cache, req.url, res.clone());
  }
  const buf = await res.arrayBuffer(), size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") || "");
  let start = 0, end = size - 1;
  if (m && m[1]) { start = parseInt(m[1], 10); if (m[2]) end = parseInt(m[2], 10); }
  else if (m && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); }
  start = Math.min(start, size - 1); end = Math.min(Math.max(end, start), size - 1);
  return new Response(buf.slice(start, end + 1), {
    status: 206, statusText: "Partial Content",
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": "bytes " + start + "-" + end + "/" + size,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  const scope = self.registration.scope;

  if (url.origin === self.location.origin && req.url.startsWith(scope)) {
    if (url.pathname.indexOf("/sounds/") >= 0) {
      e.respondWith(req.headers.has("range") ? ranged(req) : cacheFirst(req, SOUNDS));
      return;
    }
    if (req.headers.has("range")) return;
    e.respondWith(freshFirst(req, SHELL, req.mode === "navigate" ? "./index.html" : null));
    return;
  }
  if (DEP_ORIGINS.indexOf(url.origin) >= 0) {
    e.respondWith(cacheFirst(req, DEPS).catch(() => caches.match(req).then((r) => r || Response.error())));
  }
});
