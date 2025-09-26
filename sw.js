
const CACHE_NAME = 'bakery-gest-v3'; // Versão do cache incrementada para forçar a atualização
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];
const CDN_URL_PATTERN = /^https:\/\/aistudiocdn\.com\//;

// Ao instalar, armazena em cache o app shell principal
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('ServiceWorker: Armazenando app shell em cache');
        return cache.addAll(APP_SHELL_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ao ativar, limpa caches antigos e assume o controle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('ServiceWorker: Deletando cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Ao buscar (fetch), aplica diferentes estratégias de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia 1: Requisições de navegação (Network-first)
  // Garante que o usuário obtenha o HTML mais recente se estiver online.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          // Se for bem-sucedido, armazena em cache e retorna
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // Se a rede falhar, serve do cache
          console.log('Falha no fetch para navegação; servindo do cache.', error);
          const cache = await caches.open(CACHE_NAME);
          return await cache.match(request) || await cache.match('/index.html');
        }
      })()
    );
    return;
  }

  // Estratégia 2: Recursos da CDN (Cache-first)
  // São versionados e imutáveis, então é seguro servir do cache.
  if (CDN_URL_PATTERN.test(request.url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(c => c.put(request, networkResponse.clone()));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Estratégia 3: Arquivos JS/TSX próprios da aplicação e outros recursos (Network-first)
  // Crucial para arquivos transpilados dinamicamente. Evita servir código antigo/quebrado do cache.
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        // Se for bem-sucedido, armazena em cache e retorna
        const cache = await caches.open(CACHE_NAME);
        // Apenas armazena em cache respostas válidas para evitar erros de cache
        if (networkResponse && networkResponse.status === 200) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // Se a rede falhar, tenta servir do cache
        console.log(`Falha no fetch para o recurso (${request.url}); servindo do cache.`, error);
        return await caches.match(request);
      }
    })()
  );
});
