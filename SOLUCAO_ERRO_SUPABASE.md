# 🔧 Solução: Erro "Failed to fetch" do Supabase

## ❌ Erro que você está vendo:

```
Erro ao salvar entregador no Supabase: {
  message: 'TypeError: Failed to fetch',
  details: 'TypeError: Failed to fetch...',
  hint: '',
  code: ''
}
```

## 🎯 Causas Possíveis:

### 1. Projeto Pausado no Supabase ⏸️

**Solução:**
1. Acesse: https://supabase.com/dashboard/project/bkwgowsumeylnwbintdz
2. Se aparecer "Project is paused", clique em **"Resume project"**
3. Aguarde 1-2 minutos para o projeto iniciar
4. Teste novamente

### 2. Tabelas Não Foram Criadas 📋

**Solução:**
1. Acesse: https://supabase.com/dashboard/project/bkwgowsumeylnwbintdz
2. Vá em **SQL Editor**
3. Execute TODO o conteúdo do arquivo `supabase-schema.sql`
4. Verifique em **Table Editor** se as 7 tabelas foram criadas

### 3. Políticas RLS Não Foram Criadas 🔒

**Solução:**
1. Vá em **Authentication** → **Policies**
2. Verifique se existem políticas para todas as tabelas
3. Se não existir, execute o SQL novamente (incluindo as políticas)

### 4. Problema de Rede/CORS 🌐

**Solução:**
1. Verifique sua conexão com a internet
2. Tente desabilitar extensões do navegador (AdBlock, etc.)
3. Tente em modo anônimo/privado
4. Tente em outro navegador

### 5. URL ou Chave Incorreta 🔑

**Solução:**
1. Acesse: https://supabase.com/dashboard/project/bkwgowsumeylnwbintdz
2. Vá em **Settings** → **API**
3. Copie a **URL** e a **anon public key**
4. Verifique se estão corretas em `lib/supabase.ts`

## ✅ Como Verificar se o Supabase Está Funcionando:

### Teste 1: Verificar Status do Projeto
1. Acesse o painel do Supabase
2. Se estiver "Active" (verde), está OK
3. Se estiver "Paused" (cinza), clique em "Resume"

### Teste 2: Testar Conexão Diretamente
1. Abra o console do navegador (F12)
2. Cole e execute:

```javascript
fetch('https://bkwgowsumeylnwbintdz.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Supabase OK:', d))
.catch(e => console.error('❌ Erro:', e));
```

3. Se aparecer "✅ Supabase OK", a conexão está funcionando
4. Se aparecer "❌ Erro", há problema de conexão

### Teste 3: Verificar Tabelas
1. Vá em **Table Editor**
2. Clique em **entregadores**
3. Se a tabela existir, está OK
4. Se não existir, execute o SQL

## 🔄 Enquanto o Supabase Não Funciona:

**Boa notícia:** O sistema tem fallback automático para localStorage!

Isso significa que:
- ✅ Você pode continuar usando o sistema normalmente
- ✅ Os dados são salvos no localStorage do navegador
- ✅ Quando o Supabase voltar a funcionar, você pode migrar os dados

## 📊 Como Migrar Dados do localStorage para Supabase:

Quando o Supabase estiver funcionando, execute no console (F12):

```javascript
// 1. Pegar dados do localStorage
const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');

// 2. Importar supabase
import { supabase } from './lib/supabase.js';

// 3. Inserir no Supabase
for (const entregador of entregadores) {
  await supabase.from('entregadores').insert([entregador]);
}

console.log('✅ Migração concluída!');
```

## 🎯 Checklist de Verificação:

- [ ] Projeto está "Active" no painel do Supabase
- [ ] Tabelas foram criadas (7 tabelas)
- [ ] Políticas RLS foram criadas
- [ ] URL e chave estão corretas em `lib/supabase.ts`
- [ ] Teste de conexão funcionou
- [ ] Não há bloqueio de firewall/antivírus

## 🆘 Se Nada Funcionar:

### Opção 1: Usar Apenas localStorage (Temporário)
O sistema já está configurado para isso. Continue usando normalmente.

### Opção 2: Criar Novo Projeto Supabase
1. Crie um novo projeto em https://supabase.com
2. Copie a nova URL e chave
3. Atualize `lib/supabase.ts`
4. Execute o SQL para criar as tabelas

### Opção 3: Usar Outro Banco
- Firebase Firestore
- MongoDB Atlas
- PostgreSQL próprio

## 📞 Informações de Debug:

Se precisar de ajuda, forneça:
1. Status do projeto no painel (Active/Paused)
2. Resultado do teste de conexão (console)
3. Screenshot do erro completo
4. Navegador e versão

## ✨ Próximos Passos:

1. **Verifique o status do projeto no Supabase**
2. **Se estiver pausado, clique em "Resume"**
3. **Aguarde 1-2 minutos**
4. **Teste cadastrar um entregador novamente**
5. **Verifique no Table Editor se apareceu**

---

**Nota:** O erro "Failed to fetch" geralmente é porque o projeto está pausado ou as tabelas não foram criadas. Siga os passos acima e deve funcionar! 🚀
