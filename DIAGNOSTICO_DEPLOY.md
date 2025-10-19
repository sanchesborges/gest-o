# 🔍 Diagnóstico: Página de Pedidos não aparece após deploy

## ✅ Verificações Realizadas

### 1. Build Local
- ✅ Build executado com sucesso
- ✅ Sem erros de TypeScript
- ✅ Todos os arquivos gerados corretamente

### 2. Código
- ✅ Componente Orders.tsx sem erros
- ✅ Rotas configuradas corretamente no App.tsx
- ✅ Hooks funcionando corretamente

## 🐛 Possíveis Causas

### 1. Cache do Navegador/CDN
O problema mais comum após deploy é o cache. O navegador ou CDN pode estar servindo a versão antiga.

**Solução:**
```bash
# Limpar cache do navegador
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Ou abrir em modo anônimo
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)
```

### 2. Service Worker Desatualizado
O Service Worker pode estar servindo arquivos antigos do cache.

**Solução:**
1. Abra DevTools (F12)
2. Vá em Application > Service Workers
3. Clique em "Unregister" ou "Skip waiting"
4. Recarregue a página

### 3. localStorage com Dados Corrompidos
Dados antigos no localStorage podem causar problemas.

**Solução:**
```javascript
// No console do navegador (F12)
localStorage.clear();
location.reload();
```

### 4. Erro de JavaScript Silencioso
Pode haver um erro que está impedindo a renderização.

**Verificar:**
1. Abra o console (F12)
2. Vá na aba "Console"
3. Procure por erros em vermelho
4. Vá na aba "Network" e veja se todos os arquivos carregaram

### 5. Problema com Tailwind CSS via CDN
O Tailwind está sendo carregado via CDN, pode haver problema de conexão.

**Verificar:**
1. Abra DevTools > Network
2. Procure por `cdn.tailwindcss.com`
3. Veja se o status é 200 (OK)

### 6. Problema com React Router
O HashRouter pode não estar funcionando corretamente no deploy.

**Verificar:**
- URL deve ser: `https://gestao-sepia.vercel.app/#/pedidos`
- Note o `#` antes de `/pedidos`

## 🔧 Soluções Passo a Passo

### Solução 1: Limpar Cache Completo

1. **No Vercel (se for o host):**
   - Vá no dashboard do Vercel
   - Clique em "Deployments"
   - Force um novo deploy (Redeploy)

2. **No Navegador:**
   ```
   1. Pressione F12 (DevTools)
   2. Clique com botão direito no ícone de reload
   3. Selecione "Empty Cache and Hard Reload"
   ```

3. **Limpar tudo:**
   ```javascript
   // No console (F12)
   localStorage.clear();
   sessionStorage.clear();
   
   // Desregistrar Service Worker
   navigator.serviceWorker.getRegistrations().then(function(registrations) {
     for(let registration of registrations) {
       registration.unregister();
     }
   });
   
   // Recarregar
   location.reload();
   ```

### Solução 2: Verificar Erros no Console

1. Abra o site em produção
2. Pressione F12
3. Vá na aba "Console"
4. Tire um print de qualquer erro em vermelho
5. Vá na aba "Network"
6. Veja se algum arquivo falhou ao carregar (status diferente de 200)

### Solução 3: Testar em Modo Anônimo

1. Abra uma janela anônima (Ctrl + Shift + N)
2. Acesse o site
3. Se funcionar, o problema é cache local
4. Se não funcionar, o problema está no deploy

### Solução 4: Verificar Configuração do Vercel

Se estiver usando Vercel, verifique:

1. **Build Command:** `npm run build`
2. **Output Directory:** `dist`
3. **Install Command:** `npm install`

### Solução 5: Adicionar Configuração de Rotas

Crie um arquivo `vercel.json` na raiz do projeto:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Isso garante que todas as rotas sejam redirecionadas para o index.html.

## 📋 Checklist de Debug

Execute este checklist e anote os resultados:

- [ ] Build local funciona? (`npm run build` + `npm run preview`)
- [ ] Console mostra erros? (F12 > Console)
- [ ] Todos os arquivos carregaram? (F12 > Network)
- [ ] Service Worker está ativo? (F12 > Application > Service Workers)
- [ ] localStorage tem dados? (F12 > Application > Local Storage)
- [ ] URL está correta? (deve ter `#` antes da rota)
- [ ] Funciona em modo anônimo?
- [ ] Funciona em outro navegador?
- [ ] Tailwind CSS carregou? (elementos têm estilos)

## 🚀 Teste Rápido

Execute este código no console do site em produção:

```javascript
// Teste 1: Verificar se React está carregado
console.log('React:', typeof React !== 'undefined' ? '✅' : '❌');

// Teste 2: Verificar se o root existe
console.log('Root div:', document.getElementById('root') ? '✅' : '❌');

// Teste 3: Verificar localStorage
console.log('localStorage:', {
  pedidos: JSON.parse(localStorage.getItem('pedidos') || '[]').length,
  clientes: JSON.parse(localStorage.getItem('clientes') || '[]').length,
  entregadores: JSON.parse(localStorage.getItem('entregadores') || '[]').length
});

// Teste 4: Verificar rota atual
console.log('Rota atual:', window.location.hash);

// Teste 5: Verificar erros
console.log('Erros:', window.onerror ? 'Há erros' : 'Sem erros');
```

## 📞 Próximos Passos

Se nenhuma solução funcionar:

1. **Compartilhe:**
   - URL do site em produção
   - Print do console (F12 > Console)
   - Print da aba Network (F12 > Network)
   - Resultado do checklist acima

2. **Teste local:**
   ```bash
   npm run build
   npm run preview
   ```
   Se funcionar localmente mas não em produção, o problema é no deploy.

3. **Verifique logs do Vercel:**
   - Vá no dashboard do Vercel
   - Clique no deployment
   - Veja os logs de build e runtime

## 🔄 Forçar Novo Deploy

Se tudo mais falhar, force um novo deploy:

```bash
# Faça uma pequena alteração
git commit --allow-empty -m "Force redeploy"
git push
```

Ou no Vercel:
1. Vá em Deployments
2. Clique nos 3 pontos do último deploy
3. Clique em "Redeploy"
4. Marque "Use existing Build Cache" como OFF
