const CACHE_NAME = 'bakery-gest-v2';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// On install, cache the core app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(APP_SHELL_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
      })
  );
});

// On activate, clean up old caches and take control of the page
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Tell the active service worker to take control of the page immediately.
        return self.clients.claim();
      })
  );
});

// On fetch, apply caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // For navigation requests, use a network-first strategy.
  // Fall back to the cached index.html if the network fails.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch (error) {
          console.log('Fetch failed; serving index.html from cache.', error);
          const cache = await caches.open(CACHE_NAME);
          return await cache.match('/index.html');
        }
      })()
    );
    return;
  }

  // For non-navigation requests (assets like JS, CSS, fonts, etc.),
  // use a cache-first strategy.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      
      // If we have a cached response, return it.
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise, fetch from the network.
      try {
        const networkResponse = await fetch(request);
        // Cache the new response for future use.
        // We only cache successful GET responses.
        if (request.method === 'GET' && networkResponse && networkResponse.status === 200) {
          // We must clone the response to cache it because responses are streams.
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.log('Fetch failed; resource not in cache.', error);
        // If fetch fails and the resource is not in cache, we can't do anything.
        // The browser will handle the error.
      }
    })()
  );
});
