const CACHE_NAME = 'shirley-gest-v5'; // Versão do cache incrementada para forçar uma atualização completa.
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pré-armazenando o App Shell em cache.');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
        // Força o novo service worker a se tornar ativo imediatamente.
        return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Torna-se o controlador para todos os clientes imediatamente.
  );
});

self.addEventListener('fetch', (event) => {
  // Estratégia: Tenta a rede primeiro, se falhar, usa o cache.
  // Isso garante que os usuários online sempre obtenham a versão mais recente,
  // enquanto os usuários offline ainda podem usar o aplicativo com os dados em cache.
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      // Se a requisição de rede for bem-sucedida, atualizamos o cache.
      const responseToCache = networkResponse.clone();
      caches.open(CACHE_NAME).then((cache) => {
        // Armazena em cache apenas requisições GET bem-sucedidas.
        if (event.request.method === 'GET' && responseToCache.status === 200) {
          cache.put(event.request, responseToCache);
        }
      });
      // Retorna a resposta da rede para o navegador.
      return networkResponse;
    }).catch(() => {
      // Se a requisição de rede falhar (provavelmente offline),
      // tenta servir a resposta a partir do cache.
      console.log(`[Service Worker] Requisição para ${event.request.url} falhou. Servindo do cache.`);
      return caches.match(event.request);
    })
  );
});
