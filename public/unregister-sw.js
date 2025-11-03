// Script para desregistrar Service Worker
// Este arquivo força a remoção do SW que está causando problemas

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister().then(function(success) {
        if (success) {
          console.log('✅ Service Worker desregistrado com sucesso');
        }
      });
    }
  });
}

// Limpar todos os caches
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
      console.log('✅ Cache deletado:', name);
    }
  });
}

console.log('🧹 Limpeza de Service Worker concluída');
