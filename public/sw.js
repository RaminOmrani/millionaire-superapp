/* Millionaire super app — minimal service worker.
 * Pages are always network-first (content is edited live from /admin), so nothing stale is served.
 * Only when the network is down do navigations fall back to the cached /offline page.
 * Fonts, brand SVGs and hashed Next assets are cache-first (they never change under the same URL). */
const VERSION = "v1";
const STATIC = `static-${VERSION}`;
const PRECACHE = ["/offline", "/fonts/Vazirmatn-Variable.woff2", "/brand/millionaire/mark.svg", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) return;

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/offline")));
    return;
  }

  if (/^\/(fonts|brand|icons|_next\/static)\//.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
