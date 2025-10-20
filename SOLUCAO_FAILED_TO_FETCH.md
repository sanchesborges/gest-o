# 🔧 Solução: Erro "Failed to fetch" no React

## 🔍 Diagnóstico

O teste HTML funcionou perfeitamente, mas o React está dando erro "Failed to fetch". Isso indica um problema específico do ambiente de desenvolvimento React/Vite.

## ✅ Soluções

### Solução 1: Limpar cache do Vite e recarregar

1. **Pare o servidor de desenvolvimento** (Ctrl+C no terminal)
2. **Delete a pasta de cache do Vite:**
   ```bash
   rmdir /s /q node_modules\.vite
   ```
3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```
4. **No navegador, faça um hard refresh:**
   - Windows: `Ctrl + Shift + R` ou `Ctrl + F5`
   - Limpe o cache do navegador (F12 → Network → Disable cache)

### Solução 2: Verificar se há proxy/CORS no Vite

Verifique se existe um arquivo `vite.config.ts` ou `vite.config.js` com configurações de proxy.

### Solução 3: Adicionar logs detalhados

O código já foi atualizado com logs mais detalhados. Após reiniciar, você verá:
- `📦 Iniciando salvamento de entrada de estoque...`
- `📝 Dados formatados para inserção:`
- `🔗 URL do Supabase:`
- `⏳ Enviando requisição para Supabase...`
- `📬 Resposta recebida do Supabase`

Isso vai ajudar a identificar exatamente onde o erro ocorre.

### Solução 4: Verificar se o problema é de CORS

Se o erro persistir, pode ser CORS. Adicione isto no `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://bkwgowsumeylnwbintdz.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### Solução 5: Usar a mesma abordagem do HTML (sem .single())

Tente remover o `.single()` da query:

```typescript
const { data: insertedData, error } = await supabase
  .from('entradas_estoque')
  .insert([dataToInsert])
  .select();

// Pegar o primeiro item do array
const newEntrada = insertedData?.[0];
```

## 🧪 Próximos Passos

1. **Reinicie o servidor de desenvolvimento**
2. **Limpe o cache do navegador**
3. **Tente adicionar uma entrada de estoque novamente**
4. **Verifique os logs no console** (F12)

## 💡 Por que o HTML funcionou mas o React não?

- O HTML usa a biblioteca Supabase diretamente do CDN
- O React usa a biblioteca instalada via npm
- Pode haver diferença de versão ou cache do Vite
- O Vite pode estar fazendo alguma transformação que causa o erro

## 🎯 Teste Rápido

Abra o console do navegador (F12) e execute:

```javascript
// Testar se o supabase está acessível
console.log(window.supabase);

// Testar fetch direto
fetch('https://bkwgowsumeylnwbintdz.supabase.co/rest/v1/produtos?select=count', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Fetch OK:', d))
.catch(e => console.error('❌ Fetch Error:', e));
```

Se o fetch direto funcionar, o problema é com a biblioteca Supabase no React.
