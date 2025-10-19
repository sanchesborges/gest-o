const CACHE_NAME = 'mana-gest-v1';

// Lista de arquivos que NÃO devem ser cacheados
const EXCLUDE_FROM_CACHE = [
  '/index.tsx',
  '.tsx',
  '.ts',
  '.jsx',
  '.js'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  // Força o novo service worker a se tornar ativo imediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Não cachear arquivos TypeScript/JavaScript/JSX
  const shouldExclude = EXCLUDE_FROM_CACHE.some(ext => 
    requestUrl.pathname.includes(ext)
  );
  
  if (shouldExclude) {
    // Sempre buscar da rede para arquivos de código
    event.respondWith(fetch(event.request));
    return;
  }

  // Para outros recursos (imagens, CSS, etc), usar estratégia Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cachear apenas respostas bem-sucedidas
        if (response.status === 200 && event.request.method === 'GET') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tentar servir do cache
        return caches.match(event.request);
      })
  );
});
