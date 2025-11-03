// ========================================
// SCRIPT PARA LIMPAR CACHE DO NAVEGADOR
// ========================================
// 
// COMO USAR:
// 1. Abra o Console do Navegador (F12)
// 2. Copie e cole TODO este código
// 3. Pressione Enter
// 4. Aguarde a mensagem de sucesso
// 5. A página será recarregada automaticamente
//
// ========================================

console.log('🧹 Iniciando limpeza de cache...\n');

// Função para limpar tudo
async function limparTudo() {
  let etapas = 0;
  
  // 1. Desregistrar Service Workers
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      await registration.unregister();
      etapas++;
      console.log(`✅ ${etapas}. Service Worker desregistrado`);
    }
    if (registrations.length === 0) {
      console.log('ℹ️  Nenhum Service Worker encontrado');
    }
  } catch (e) {
    console.log('⚠️  Erro ao desregistrar Service Workers:', e.message);
  }
  
  // 2. Limpar Cache Storage
  try {
    const cacheNames = await caches.keys();
    for (let name of cacheNames) {
      await caches.delete(name);
      etapas++;
      console.log(`✅ ${etapas}. Cache deletado: ${name}`);
    }
    if (cacheNames.length === 0) {
      console.log('ℹ️  Nenhum cache encontrado');
    }
  } catch (e) {
    console.log('⚠️  Erro ao limpar caches:', e.message);
  }
  
  // 3. Limpar localStorage
  try {
    const localStorageKeys = Object.keys(localStorage);
    localStorage.clear();
    etapas++;
    console.log(`✅ ${etapas}. localStorage limpo (${localStorageKeys.length} itens removidos)`);
  } catch (e) {
    console.log('⚠️  Erro ao limpar localStorage:', e.message);
  }
  
  // 4. Limpar sessionStorage
  try {
    const sessionStorageKeys = Object.keys(sessionStorage);
    sessionStorage.clear();
    etapas++;
    console.log(`✅ ${etapas}. sessionStorage limpo (${sessionStorageKeys.length} itens removidos)`);
  } catch (e) {
    console.log('⚠️  Erro ao limpar sessionStorage:', e.message);
  }
  
  // 5. Limpar IndexedDB (se houver)
  try {
    const databases = await indexedDB.databases();
    for (let db of databases) {
      if (db.name) {
        indexedDB.deleteDatabase(db.name);
        etapas++;
        console.log(`✅ ${etapas}. IndexedDB deletado: ${db.name}`);
      }
    }
  } catch (e) {
    console.log('ℹ️  IndexedDB não disponível ou vazio');
  }
  
  console.log('\n🎉 Limpeza concluída!');
  console.log(`📊 Total de etapas: ${etapas}`);
  console.log('\n🔄 Recarregando página em 2 segundos...');
  
  setTimeout(() => {
    location.reload(true); // Hard reload
  }, 2000);
}

// Executar limpeza
limparTudo().catch(error => {
  console.error('❌ Erro durante a limpeza:', error);
  console.log('\n💡 Tente fazer manualmente:');
  console.log('1. DevTools (F12) → Application');
  console.log('2. Clear storage → Clear site data');
});
