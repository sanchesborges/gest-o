# 🚨 Solução Rápida: Failed to Fetch

## O Problema

Erro: `TypeError: Failed to fetch` ao tentar conectar com Supabase

## ✅ Solução Imediata (Teste Agora)

### 1. Limpar Cache do Service Worker

Abra o Console do Navegador (F12) e execute:

```javascript
// Desregistrar Service Worker
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
    console.log('✅ Service Worker desregistrado');
  }
});

// Limpar todos os caches
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
    console.log('✅ Cache deletado:', name);
  }
});

// Limpar localStorage
localStorage.clear();
console.log('✅ localStorage limpo');

// Recarregar página
setTimeout(() => {
  console.log('🔄 Recarregando...');
  location.reload();
}, 1000);
```

### 2. Ou Faça Manualmente:

1. Abra DevTools (F12)
2. Vá em **Application** (ou Aplicativo)
3. No menu lateral:
   - **Service Workers** → Clique em "Unregister"
   - **Cache Storage** → Delete todos os caches
   - **Local Storage** → Delete tudo
   - **Session Storage** → Delete tudo
4. Feche e abra o navegador novamente
5. Acesse a aplicação

### 3. Teste em Modo Anônimo

1. Abra uma janela anônima/privada (Ctrl+Shift+N)
2. Acesse: http://localhost:3000 (ou a porta que está usando)
3. Teste adicionar estoque
4. Se funcionar, o problema é cache/service worker

## 🔧 Correções Aplicadas

### 1. Configuração do Supabase Client (`lib/supabase.ts`)

Adicionei configurações para melhorar a conexão:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
});
```

### 2. Vite Config (`vite.config.ts`)

Configurei o Service Worker para **NÃO cachear** requisições do Supabase:

```typescript
{
  urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
  handler: 'NetworkOnly', // Sempre busca da rede
  options: {
    cacheName: 'supabase-api',
    networkTimeoutSeconds: 10
  }
}
```

### 3. Fallback no useAppData (`hooks/useAppData.ts`)

Agora quando o Supabase falha, salva localmente sem perder dados.

## 🧪 Teste Após Limpar Cache

1. Recarregue a página (Ctrl+F5 - hard reload)
2. Abra o Console (F12)
3. Vá em "Controle de Estoque"
4. Adicione 10 unidades de um produto
5. Observe os logs

### Logs Esperados (Sucesso):

```
📦 [INICIO] Salvando entrada de estoque...
   🔍 Buscando estoque atual do banco...
   📊 Estoque no BANCO: 10
   ➕ Quantidade: 10
   🎯 Novo estoque: 20
   💾 Atualizando banco...
   ✅ Banco atualizado com sucesso!
```

### Se Ainda Falhar:

```
❌ Erro ao buscar produto do Supabase: {message: 'Failed to fetch'}
⚠️ MODO OFFLINE: Atualizando apenas localmente
```

## 🔍 Diagnóstico Adicional

### Verificar se o Supabase está acessível:

1. Abra uma nova aba
2. Acesse: https://bkwgowsumeylnwbintdz.supabase.co
3. Você deve ver uma página do Supabase (não erro 404)

### Testar com cURL (no terminal):

```bash
curl -X GET "https://bkwgowsumeylnwbintdz.supabase.co/rest/v1/produtos?select=id,nome&limit=1" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU"
```

Se retornar dados JSON, o Supabase está OK.

## 🚀 Reiniciar Servidor de Desenvolvimento

Se nada funcionar, reinicie o servidor:

```bash
# Parar o servidor (Ctrl+C)
# Limpar cache do Vite
rm -rf node_modules/.vite

# Reiniciar
npm run dev
```

## 📞 Próximo Passo

Depois de limpar o cache e testar, me envie:

1. ✅ Se funcionou ou ❌ se ainda falha
2. Os logs completos do console
3. Screenshot do erro (se houver)

Vou identificar o problema exato! 🔍
