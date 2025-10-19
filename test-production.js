// Script de teste para executar no console do site em produção
// Pressione F12, vá na aba Console, e cole este código

console.log('🔍 INICIANDO DIAGNÓSTICO DO SITE...\n');

// Teste 1: Verificar se React está carregado
const reactLoaded = typeof React !== 'undefined';
console.log(`1. React carregado: ${reactLoaded ? '✅' : '❌'}`);

// Teste 2: Verificar se o root existe
const rootExists = !!document.getElementById('root');
console.log(`2. Div #root existe: ${rootExists ? '✅' : '❌'}`);

// Teste 3: Verificar se há conteúdo no root
const rootHasContent = document.getElementById('root')?.children.length > 0;
console.log(`3. Root tem conteúdo: ${rootHasContent ? '✅' : '❌'}`);

// Teste 4: Verificar localStorage
try {
  const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
  const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
  const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
  
  console.log('\n4. Dados no localStorage:');
  console.log(`   - Pedidos: ${pedidos.length} ✅`);
  console.log(`   - Clientes: ${clientes.length} ✅`);
  console.log(`   - Entregadores: ${entregadores.length} ✅`);
  console.log(`   - Produtos: ${produtos.length} ✅`);
} catch (e) {
  console.log('4. Erro ao ler localStorage: ❌', e);
}

// Teste 5: Verificar rota atual
console.log(`\n5. Rota atual: ${window.location.hash || '(vazio)'}`);
console.log(`   URL completa: ${window.location.href}`);

// Teste 6: Verificar Tailwind CSS
const hasTailwind = !!document.querySelector('script[src*="tailwindcss"]');
console.log(`\n6. Tailwind CSS carregado: ${hasTailwind ? '✅' : '❌'}`);

// Teste 7: Verificar se há elementos com classes do Tailwind
const hasStyledElements = document.querySelectorAll('[class*="bg-"]').length > 0;
console.log(`7. Elementos com estilos Tailwind: ${hasStyledElements ? '✅' : '❌'}`);

// Teste 8: Verificar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log(`\n8. Service Workers ativos: ${registrations.length}`);
    registrations.forEach((reg, i) => {
      console.log(`   SW ${i + 1}: ${reg.active?.state || 'inativo'}`);
    });
  });
} else {
  console.log('\n8. Service Worker não suportado');
}

// Teste 9: Verificar erros no console
const errors = [];
const originalError = console.error;
console.error = function(...args) {
  errors.push(args);
  originalError.apply(console, args);
};

setTimeout(() => {
  console.log(`\n9. Erros capturados: ${errors.length}`);
  if (errors.length > 0) {
    console.log('   Erros:', errors);
  }
}, 1000);

// Teste 10: Verificar componentes React
setTimeout(() => {
  const hasReactComponents = document.querySelectorAll('[data-reactroot], [data-reactid]').length > 0 || 
                             document.getElementById('root')?.children.length > 0;
  console.log(`\n10. Componentes React renderizados: ${hasReactComponents ? '✅' : '❌'}`);
  
  // Verificar se a página de pedidos está visível
  const hasPedidosTitle = document.body.textContent.includes('Gestão de Pedidos');
  console.log(`11. Título "Gestão de Pedidos" visível: ${hasPedidosTitle ? '✅' : '❌'}`);
  
  console.log('\n' + '='.repeat(50));
  console.log('DIAGNÓSTICO COMPLETO!');
  console.log('='.repeat(50));
  
  if (!hasPedidosTitle && window.location.hash === '#/pedidos') {
    console.log('\n⚠️ PROBLEMA DETECTADO:');
    console.log('A página de pedidos deveria estar visível mas não está.');
    console.log('\nSOLUÇÕES:');
    console.log('1. Limpar cache: Ctrl+Shift+R');
    console.log('2. Limpar localStorage: localStorage.clear(); location.reload();');
    console.log('3. Desregistrar Service Worker e recarregar');
  }
}, 2000);

// Função auxiliar para limpar tudo
console.log('\n💡 DICA: Para limpar tudo e começar do zero, execute:');
console.log('   limparTudo()');

window.limparTudo = function() {
  console.log('🧹 Limpando tudo...');
  localStorage.clear();
  sessionStorage.clear();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(reg => reg.unregister());
      console.log('✅ Service Workers desregistrados');
      console.log('🔄 Recarregando página...');
      setTimeout(() => location.reload(), 500);
    });
  } else {
    console.log('🔄 Recarregando página...');
    location.reload();
  }
};
