const CACHE_NAME = 'shirley-gest-v4'; // Nova versão do cache para forçar a atualização.
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalação: Armazena em cache o "app shell" (os arquivos básicos da aplicação).
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

// Ativação: Limpa caches antigos para evitar conflitos.
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

// Fetch: Intercepta as requisições de rede.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Estratégia para requisições de navegação (ex: abrir o app).
  // Tenta a rede primeiro para obter a versão mais recente do HTML.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          // Se funcionar, guarda a nova versão em cache.
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // Se a rede falhar (offline), serve a página principal do cache.
          console.log('Falha na navegação; servindo index.html do cache.', error);
          const cache = await caches.open(CACHE_NAME);
          return await cache.match('/index.html');
        }
      })()
    );
    return;
  }

  // Estratégia para outros recursos (scripts, etc.).
  // Tenta a rede primeiro, e se falhar, usa o cache.
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        
        // --- CORREÇÃO PARA O CONTENT-TYPE ---
        // Se a requisição for para um arquivo .tsx/.ts, suspeitamos que o Content-Type
        // pode estar incorreto. Forçamos para que seja um script JavaScript executável.
        if (request.url.endsWith('.tsx') || request.url.endsWith('.ts')) {
          const clonedResponse = networkResponse.clone();
          const body = await clonedResponse.blob();
          const headers = new Headers(clonedResponse.headers);
          headers.set('Content-Type', 'application/javascript; charset=utf-8');

          const correctedResponse = new Response(body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: headers
          });
          
          // Armazena a resposta corrigida no cache.
          cache.put(request, correctedResponse);
        } else {
          // Para todos os outros recursos, armazena em cache normalmente.
          cache.put(request, networkResponse.clone());
        }

        // Retorna a resposta original da rede para o navegador.
        return networkResponse;
      } catch (error) {
        // A requisição de rede falhou (provavelmente offline).
        // Tenta servir o recurso a partir do cache.
        console.log(`Falha no fetch para ${request.url}; servindo do cache.`, error);
        return await caches.match(request);
      }
    })()
  );
});
