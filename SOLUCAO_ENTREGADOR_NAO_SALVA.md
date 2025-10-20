# 🔧 Solução: Entregador não está sendo salvo

## ❌ Problema:
Ao cadastrar um entregador, ele aparece na lista mas desaparece ao atualizar a página.

## 🎯 Causa:
A coluna `avatar_url` não foi adicionada na tabela `entregadores` do Supabase.

## ✅ Solução:

### Passo 1: Adicionar a coluna no Supabase

1. **Acesse:** https://supabase.com/dashboard/project/bkwgowsumeylnwbintdz
2. **Vá em:** SQL Editor (menu lateral)
3. **Clique em:** New Query
4. **Cole e execute:**

```sql
ALTER TABLE entregadores 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

5. **Clique em:** RUN (ou Ctrl+Enter)

### Passo 2: Verificar se funcionou

1. Vá em **Table Editor**
2. Clique na tabela **entregadores**
3. Verifique se a coluna `avatar_url` aparece

### Passo 3: Testar novamente

1. Recarregue a página do sistema
2. Cadastre um novo entregador
3. Atualize a página (F5)
4. O entregador deve continuar lá! ✅

## 🔍 Como verificar o erro no console:

1. Abra o console do navegador (F12)
2. Vá na aba "Console"
3. Cadastre um entregador
4. Procure por mensagens de erro

### Se aparecer:
```
Erro ao salvar entregador no Supabase: {
  message: "column 'avatar_url' does not exist"
}
```

**Solução:** Execute o SQL do Passo 1

### Se aparecer:
```
✅ Entregador salvo com sucesso no Supabase!
```

**Ótimo!** Está funcionando corretamente.

## 📊 Estrutura da Tabela Correta:

```
entregadores
├── id (TEXT) - PK
├── nome (TEXT)
├── telefone (TEXT)
├── avatar_url (TEXT) ← NOVA COLUNA
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🧪 Teste Completo:

1. **Cadastrar sem foto:**
   - Nome: "Teste 1"
   - Telefone: "(11) 11111-1111"
   - Sem foto
   - Deve salvar ✅

2. **Cadastrar com foto:**
   - Nome: "Teste 2"
   - Telefone: "(22) 22222-2222"
   - Com foto do dispositivo
   - Deve salvar ✅

3. **Verificar no banco:**
   - Vá em Table Editor → entregadores
   - Deve ter 2 registros
   - O segundo deve ter `avatar_url` preenchido

## 🔄 O que foi corrigido no código:

### Antes (errado):
```typescript
const { error } = await supabase
  .from('entregadores')
  .insert([newEntregador]); // Enviava avatarUrl (camelCase)
```

### Depois (correto):
```typescript
const { error } = await supabase
  .from('entregadores')
  .insert([{
    id: newEntregador.id,
    nome: newEntregador.nome,
    telefone: newEntregador.telefone,
    avatar_url: newEntregador.avatarUrl // Mapeia para snake_case
  }]);
```

## 💡 Dica:

Se você já tinha entregadores cadastrados antes e eles sumiram:
- Eles estão no localStorage do navegador
- Após adicionar a coluna, cadastre-os novamente
- Ou migre manualmente do localStorage para o Supabase

## ✅ Checklist:

- [ ] Executei o SQL para adicionar a coluna
- [ ] Verifiquei que a coluna foi criada
- [ ] Recarreguei a página do sistema
- [ ] Cadastrei um entregador de teste
- [ ] Atualizei a página (F5)
- [ ] O entregador continua na lista
- [ ] Verifiquei no Table Editor do Supabase

## 🎉 Pronto!

Após executar o SQL, tudo deve funcionar perfeitamente! 🚀
