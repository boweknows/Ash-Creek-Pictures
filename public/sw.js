const CACHE = "ash-creek-career-os-v1";
const ASSETS = ["/", "/today", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => cached);
    }),
  );
});
