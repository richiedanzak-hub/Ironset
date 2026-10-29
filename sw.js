/* IRONSET service worker — makes the app open and work with no connection. */
const VERSION = "ironset-v2";
const SHELL = VERSION + "-shell";
const DEPS = VERSION + "-deps";
const KEEP = [SHELL, DEPS];

/* Same-origin files the app is made of. */
const SHELL_URLS = [
  "./ironset.html",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
];

/* Third-party code the app cannot boot without: React and the fonts. Versioned
   URLs, so they never go stale. The JSX compiler used to live here too — 2.8MB
   of it, on every cold start — until the compile moved to build time. */
const DEP_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
  "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap",
];

/* Storing a response can fail on its own (quota, an opaque body a browser
   refuses to keep); never let that take the whole install down. */
const keep = (cache, req, res) => {
  if (!res || (!res.ok && res.type !== "opaque")) return Promise.resolve();
  try { return cache.put(req, res).catch(() => {}); } catch (err) { return Promise.resolve(); }
};

/* Everything the deps cache is allowed to answer for: the hosts above, plus
   the font files the stylesheet pulls in. One source of truth, so adding a
   dependency above is all it takes. */
const DEP_ORIGINS = DEP_URLS.map(function (u) { return new URL(u).origin; }).concat(["https://fonts.gstatic.com"]);

const cacheQuietly = (cache, url) =>
  fetch(url, { credentials: "omit" })
    .then((res) => keep(cache, url, res))
    .catch(() => null);

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    await Promise.all(SHELL_URLS.map((u) => cacheQuietly(shell, u)));
    const deps = await caches.open(DEPS);
    await Promise.all(DEP_URLS.map((u) => cacheQuietly(deps, u)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith("ironset-") && KEEP.indexOf(n) < 0).map((n) => caches.delete(n)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (err) {}
    }
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => {
  if (e.data === "skip-waiting") self.skipWaiting();
});

/* Newest copy wins when there is a connection; the cached copy keeps the app
   usable when there isn't. */
async function freshFirst(req, cacheName, preload, fallback) {
  const cache = await caches.open(cacheName);
  try {
    const res = (preload && (await preload)) || (await fetch(req));
    await keep(cache, req, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(req)) || (fallback ? await cache.match(fallback) : null);
    if (hit) return hit;
    throw err;
  }
}

/* Versioned third-party files never change, so serve them instantly and only
   go to the network when we have never seen them. */
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  await keep(cache, req, res.clone());
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  /* Video playback asks for byte ranges; a cached whole-file answer would
     break seeking, so leave those alone. */
  if (req.headers.has("range")) return;

  const url = new URL(req.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (req.mode === "navigate") {
    /* Other pages live beside this one in the same folder; leave them to the
       network rather than answering for them with IRONSET. */
    const own = url.origin === self.location.origin &&
      (url.pathname.endsWith("/ironset.html") || url.pathname.endsWith("/"));
    if (own) e.respondWith(freshFirst(req, SHELL, e.preloadResponse, "./ironset.html"));
    return;
  }
  if (url.origin === self.location.origin) {
    e.respondWith(freshFirst(req, SHELL, null, null));
    return;
  }
  if (DEP_ORIGINS.indexOf(url.origin) >= 0) {
    e.respondWith(cacheFirst(req, DEPS).catch(() => caches.match(req).then((r) => r || Response.error())));
  }
});
