const CACHE_NAME = 'bakery-gest-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/hooks/useAppData.ts',
  '/services/geminiService.ts',
  '/components/Dashboard.tsx',
  '/components/Stock.tsx',
  '/components/Orders.tsx',
  '/components/Clients.tsx',
  '/components/Financials.tsx',
  '/components/OrderForm.tsx',
  '/components/DeliveryNote.tsx',
  '/components/Products.tsx',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-router-dom@^7.9.2',
  'https://aistudiocdn.com/react-dom@^19.1.1/',
  'https://aistudiocdn.com/@google/genai@^1.20.0',
  'https://aistudiocdn.com/jspdf@^3.0.3',
  'https://aistudiocdn.com/lucide-react@^0.544.0',
  'https://aistudiocdn.com/recharts@^3.2.1',
  'https://aistudiocdn.com/react-signature-canvas@^1.1.0-alpha.2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use a request with no-cache to ensure we get the latest from the network.
        const requests = urlsToCache.map(url => new Request(url, {cache: 'no-cache'}));
        return cache.addAll(requests);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
              return response;
            }

            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
