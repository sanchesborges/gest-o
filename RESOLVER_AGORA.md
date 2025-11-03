# 🚨 RESOLVER AGORA - Erro "Failed to Fetch"

## 🎯 O Problema

O navegador está **bloqueando** as requisições para o Supabase por causa de **CORS**.

O Supabase ESTÁ FUNCIONANDO (testei), mas o navegador bloqueia.

## ✅ SOLUÇÃO RÁPIDA (3 Minutos)

### PASSO 1: Abrir Chrome em Modo Desenvolvimento

1. **Feche TODOS os navegadores** (Chrome, Edge, etc)

2. **Abra o terminal** (CMD ou PowerShell)

3. **Cole e execute**:

```powershell
Start-Process "chrome.exe" -ArgumentList "--disable-web-security","--user-data-dir=C:\temp\chrome-dev","--disable-features=IsolateOrigins,site-per-process","http://localhost:3000"
```

4. **Aguarde** o Chrome abrir com aviso amarelo no topo

5. **Teste** adicionar estoque

### PASSO 2: Se Não Funcionar

**Opção A - Firefox (Sem CORS):**
1. Baixe Firefox
2. Abra: http://localhost:3000
3. Teste

**Opção B - Extensão CORS:**
1. Instale: [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock)
2. Ative a extensão
3. Recarregue a página
4. Teste

### PASSO 3: Configurar CORS no Supabase (Permanente)

1. Acesse: https://supabase.com/dashboard
2. Login
3. Selecione seu projeto
4. **Settings** → **API**
5. Role até **CORS Configuration**
6. Adicione estas URLs:
   ```
   http://localhost:3000
   http://localhost:5173
   http://127.0.0.1:3000
   ```
7. Salve

## 🧪 Testar se Funcionou

Abra o console (F12) e execute:

```javascript
fetch('https://bkwgowsumeylnwbintdz.supabase.co/rest/v1/produtos?select=id,nome&limit=1', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU'
  }
})
.then(r => r.json())
.then(d => console.log('✅ FUNCIONOU:', d))
.catch(e => console.log('❌ ERRO:', e));
```

Se aparecer `✅ FUNCIONOU:`, o CORS está resolvido!

## 📞 Depois de Resolver

1. Teste adicionar 10 unidades no estoque
2. Verifique se aparece 10 (não 20)
3. Me confirme se funcionou

## 🎯 Resumo

```
1. Fechar todos os navegadores
2. Abrir Chrome com --disable-web-security
3. Testar adicionar estoque
4. Confirmar se funcionou
```

Isso VAI FUNCIONAR! 💪
