const CACHE_NAME = "medequity-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Only cache static assets, not HTML pages or API routes
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/data/")) return;

  const isStatic = url.pathname.startsWith("/_next/static/") || url.pathname.match(/\.(js|css|svg|png|jpg|woff2?)$/);

  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          return res;
        });
      })
    );
  }
});
