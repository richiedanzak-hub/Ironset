// Talking to the server: JSON calls, saved sessions and the live stream.

export class ApiError extends Error {}

export async function request(path, body) {
  let res;
  try {
    res = await fetch(path, body === undefined
      ? { headers: { accept: 'application/json' } }
      : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new ApiError("Can't reach the game. Check your connection.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new ApiError(data.error || 'Something went wrong');
    err.status = res.status;
    throw err;
  }
  return data;
}

// localStorage can throw (private mode, blocked storage); never let that break the game.
export const store = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  del(key) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

export const session = {
  get: (code) => store.get(`rr:party:${code}`),
  set: (code, s) => store.set(`rr:party:${code}`, s),
  clear: (code) => store.del(`rr:party:${code}`),
};

export const profile = {
  get: () => store.get('rr:profile') || {},
  set: (p) => store.set('rr:profile', p),
};

let configPromise;
export const getConfig = () => (configPromise ||= request('/api/config').catch(() => ({})));

// The link other people open. If the host is looking at "localhost", swap in
// the computer's Wi-Fi address so phones can actually reach it.
export async function inviteLink(code) {
  const cfg = await getConfig();
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const base = cfg.publicUrl || (local && cfg.lanUrl) || location.origin;
  return `${base.replace(/\/$/, '')}/j/${code}`;
}

export const region = (() => {
  const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
  const m = lang.match(/-([A-Za-z]{2})\b/);
  return (m ? m[1] : 'US').toUpperCase();
})();

export function sendAction(code, s, action) {
  return request(`/api/rooms/${code}/act`, { p: s.playerId, s: s.secret, action });
}

// Keep a live stream open. The browser reconnects EventSource on its own; on
// top of that we reconnect when a phone wakes up or the stream goes quiet
// (the server pings every 20s), and ask the server why if it refuses us.
export function subscribe(code, s, { onView, onGone, onStatus }) {
  const query = `p=${encodeURIComponent(s.playerId)}&s=${encodeURIComponent(s.secret)}`;
  let es = null;
  let stopped = false;
  let lastHeard = Date.now();
  let retry = null;

  const stop = (reason) => {
    stopped = true;
    es?.close();
    clearTimeout(retry);
    if (reason) onGone(reason);
  };

  const check = async () => {
    if (stopped) return;
    try {
      await request(`/api/rooms/${code}/me?${query}`);
      open();
    } catch (err) {
      if (err.status === 404) stop('ended');
      else if (err.status === 403) stop('removed');
      else retry = setTimeout(check, 3000);
    }
  };

  function open() {
    if (stopped) return;
    es?.close();
    lastHeard = Date.now();
    es = new EventSource(`/api/rooms/${code}/stream?${query}`);
    es.onmessage = (e) => {
      lastHeard = Date.now();
      onStatus('live');
      try {
        onView(JSON.parse(e.data));
      } catch {}
    };
    es.addEventListener('ping', () => {
      lastHeard = Date.now();
    });
    es.addEventListener('gone', (e) => {
      let reason = 'ended';
      try {
        reason = JSON.parse(e.data).reason || reason;
      } catch {}
      stop(reason);
    });
    es.onerror = () => {
      if (stopped) return;
      onStatus('reconnecting');
      if (es.readyState === EventSource.CLOSED) {
        clearTimeout(retry);
        retry = setTimeout(check, 1200);
      }
    };
  }

  const wake = () => {
    if (stopped || document.visibilityState !== 'visible') return;
    if (!es || es.readyState === EventSource.CLOSED || Date.now() - lastHeard > 25_000) open();
  };
  const watchdog = setInterval(() => {
    if (!stopped && document.visibilityState === 'visible' && Date.now() - lastHeard > 50_000) {
      onStatus('reconnecting');
      open();
    }
  }, 10_000);

  document.addEventListener('visibilitychange', wake);
  window.addEventListener('online', wake);
  window.addEventListener('pageshow', wake);
  open();

  return () => {
    stop();
    clearInterval(watchdog);
    document.removeEventListener('visibilitychange', wake);
    window.removeEventListener('online', wake);
    window.removeEventListener('pageshow', wake);
  };
}
