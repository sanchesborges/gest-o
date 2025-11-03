# 🧪 TESTE NO CONSOLE - Encontrar o Problema Real

## 📋 Instruções

1. Abra a aplicação: http://localhost:3000/#/estoque
2. Abra o Console (F12)
3. **COPIE E COLE** cada bloco de código abaixo, um por vez
4. Me envie os resultados de CADA teste

---

## TESTE 1: Verificar Estoque Atual

```javascript
// Buscar todos os produtos e seus estoques
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
const supabase = createClient(
  'https://bkwgowsumeylnwbintdz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU'
);

const { data, error } = await supabase
  .from('produtos')
  .select('id, nome, estoque_atual')
  .limit(3);

if (error) {
  console.log('❌ ERRO:', error);
} else {
  console.log('📦 PRODUTOS:');
  console.table(data);
}
```

**Me envie:** A tabela que aparecer

---

## TESTE 2: Adicionar 1 Unidade (Teste Simples)

```javascript
// Pegar o primeiro produto
const { data: produto } = await supabase
  .from('produtos')
  .select('id, nome, estoque_atual')
  .limit(1)
  .single();

console.log('📦 Produto selecionado:', produto.nome);
console.log('📊 Estoque ANTES:', produto.estoque_atual);

// Calcular novo estoque
const estoqueAntes = produto.estoque_atual;
const quantidade = 1;
const novoEstoque = estoqueAntes + quantidade;

console.log('➕ Adicionando:', quantidade);
console.log('🎯 Novo estoque deveria ser:', novoEstoque);

// Atualizar
await supabase
  .from('produtos')
  .update({ estoque_atual: novoEstoque })
  .eq('id', produto.id);

// Verificar o que foi salvo
const { data: resultado } = await supabase
  .from('produtos')
  .select('estoque_atual')
  .eq('id', produto.id)
  .single();

console.log('✅ Estoque DEPOIS:', resultado.estoque_atual);

if (resultado.estoque_atual === novoEstoque) {
  console.log('✅ CORRETO!');
} else {
  console.log('❌ ERRO! Esperado:', novoEstoque, 'Obtido:', resultado.estoque_atual);
  console.log('⚠️ DIFERENÇA:', resultado.estoque_atual - novoEstoque);
}
```

**Me envie:** Todos os logs que aparecerem

---

## TESTE 3: Verificar se Há Triggers no Banco

```javascript
// Este teste verifica se o banco está fazendo algo estranho
const produtoId = produto.id; // Usar o mesmo produto do teste anterior

// Buscar estoque atual
const { data: antes } = await supabase
  .from('produtos')
  .select('estoque_atual')
  .eq('id', produtoId)
  .single();

console.log('📊 Estoque atual:', antes.estoque_atual);

// Definir um valor EXATO
const valorExato = 100;
console.log('🎯 Definindo estoque para:', valorExato);

await supabase
  .from('produtos')
  .update({ estoque_atual: valorExato })
  .eq('id', produtoId);

// Verificar o que foi salvo
const { data: depois } = await supabase
  .from('produtos')
  .select('estoque_atual')
  .eq('id', produtoId)
  .single();

console.log('✅ Estoque salvo:', depois.estoque_atual);

if (depois.estoque_atual === valorExato) {
  console.log('✅ BANCO OK - Não há trigger duplicando');
} else {
  console.log('❌ PROBLEMA NO BANCO!');
  console.log('   Enviado:', valorExato);
  console.log('   Recebido:', depois.estoque_atual);
  console.log('   ⚠️ Há um trigger ou função no banco multiplicando valores!');
}
```

**Me envie:** O resultado final

---

## TESTE 4: Verificar Estado Local React

```javascript
// Abrir a aplicação e verificar o estado
// Este código só funciona se você estiver na página da aplicação

// Verificar se há múltiplas instâncias do contexto
console.log('🔍 Verificando estado React...');

// Tentar acessar o estado através do React DevTools
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('✅ React DevTools disponível');
} else {
  console.log('⚠️ React DevTools não encontrado');
}

// Verificar localStorage
const produtosLocal = localStorage.getItem('produtos');
if (produtosLocal) {
  const produtos = JSON.parse(produtosLocal);
  console.log('📦 Produtos no localStorage:', produtos.length);
  console.table(produtos.map(p => ({ nome: p.nome, estoque: p.estoqueAtual })));
} else {
  console.log('ℹ️ Nenhum produto no localStorage');
}
```

**Me envie:** O que aparecer

---

## 🎯 Depois dos Testes

Me envie:
1. ✅ Resultado do TESTE 1
2. ✅ Resultado do TESTE 2 (IMPORTANTE!)
3. ✅ Resultado do TESTE 3 (IMPORTANTE!)
4. ✅ Resultado do TESTE 4

Com esses testes vou identificar EXATAMENTE onde está o problema:
- Se é no banco (trigger)
- Se é no código React
- Se é no localStorage
- Se é na lógica de atualização

Aguardo os resultados! 🔍
