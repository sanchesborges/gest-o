# 🔧 Solução: Produtos Somem ao Recarregar

## 🔍 Problema Identificado

Você cadastra produtos na página **Cadastro de Produtos**, mas quando atualiza a página (F5), os produtos desaparecem.

### Causa:
- Os produtos são salvos localmente (no estado React)
- Mas a inserção no Supabase está **falhando**
- Ao recarregar, os dados são buscados do Supabase (que não tem os produtos novos)

## 🎯 Diagnóstico

### Passo 1: Verificar o Erro no Console

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Tente cadastrar um produto
4. Veja a mensagem de erro

Você verá algo como:
```
📦 Tentando adicionar produto: Pão de Queijo Tradicional
   Dados: { id: 'p1234567890', nome: '...', ... }
❌ ERRO ao salvar produto no Supabase:
   Código: 42501
   Mensagem: new row violates row-level security policy for table "produtos"
```

### Possíveis Erros:

#### Erro 1: Policy Violation (42501)
```
Mensagem: new row violates row-level security policy
```
**Causa**: Políticas RLS bloqueando INSERT

#### Erro 2: Permission Denied (42501)
```
Mensagem: permission denied for table produtos
```
**Causa**: Usuário não tem permissão de INSERT

#### Erro 3: Column Mismatch
```
Mensagem: column "..." does not exist
```
**Causa**: Nome de coluna incorreto

## ✅ Solução

### Opção 1: Executar Script SQL (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Execute o arquivo `fix-produtos-insert.sql`

Este script irá:
- ✅ Verificar políticas RLS atuais
- ✅ Criar políticas permissivas para INSERT
- ✅ Garantir que SELECT, UPDATE e DELETE também funcionem
- ✅ Verificar estrutura da tabela

### Opção 2: Verificar Manualmente

#### 2.1 Verificar Políticas RLS

No Supabase Dashboard → SQL Editor:

```sql
-- Ver políticas atuais
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'produtos';
```

#### 2.2 Criar Política de INSERT

```sql
-- Criar política permissiva
CREATE POLICY "Permitir insert de produtos para todos"
ON produtos
FOR INSERT
TO public
WITH CHECK (true);
```

#### 2.3 Verificar se RLS está habilitado

```sql
-- Habilitar RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
```

## 🧪 Como Testar

### Teste 1: Verificar Logs no Console

1. Abra o console (F12)
2. Cadastre um produto
3. Veja os logs:

**Sucesso:**
```
📦 Tentando adicionar produto: Pão de Queijo Tradicional
   Dados: { ... }
✅ Produto salvo com sucesso no Supabase: [...]
```

**Erro:**
```
📦 Tentando adicionar produto: Pão de Queijo Tradicional
❌ ERRO ao salvar produto no Supabase:
   Código: 42501
   Mensagem: new row violates row-level security policy
```

### Teste 2: Verificar no Supabase

1. Cadastre um produto
2. Vá no Supabase Dashboard → **Table Editor**
3. Abra a tabela `produtos`
4. ✅ Verifique se o produto aparece

### Teste 3: Recarregar Página

1. Cadastre um produto
2. Atualize a página (F5)
3. ✅ O produto deve continuar aparecendo

## 🔍 Verificações Adicionais

### Verificar Estrutura da Tabela

No SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'produtos';
```

Deve ter as colunas:
- `id` (text)
- `nome` (text)
- `tipo` (text)
- `tamanho_pacote` (text)
- `preco_unitario` (numeric)
- `estoque_minimo` (integer)
- `estoque_atual` (integer)

### Verificar Mapeamento de Campos

No código, os campos são mapeados assim:
```typescript
{
  id: newProduto.id,
  nome: newProduto.nome,
  tipo: newProduto.tipo,
  tamanho_pacote: newProduto.tamanhoPacote,  // snake_case
  preco_unitario: newProduto.precoPadrao,    // snake_case
  estoque_minimo: newProduto.estoqueMinimo,  // snake_case
  estoque_atual: newProduto.estoqueAtual     // snake_case
}
```

## 📊 Logs Detalhados

### Logs de Sucesso:
```
📦 Tentando adicionar produto: Pão de Queijo Tradicional 5kg (25g)
   Dados: {
     id: 'p1730000000000',
     nome: 'Pão de Queijo Tradicional 5kg (25g)',
     tipo: 'Pão de Queijo',
     tamanhoPacote: '5kg (25g)',
     precoPadrao: 120,
     estoqueMinimo: 10,
     estoqueAtual: 0
   }
✅ Produto salvo com sucesso no Supabase: [{...}]
```

### Logs de Erro:
```
📦 Tentando adicionar produto: Pão de Queijo Tradicional
❌ ERRO ao salvar produto no Supabase:
   Código: 42501
   Mensagem: new row violates row-level security policy for table "produtos"
   Detalhes: null
   Hint: null
```

## 🚨 Alertas para o Usuário

Agora quando há erro, o sistema mostra um alerta:
```
Erro ao salvar produto: new row violates row-level security policy

O produto foi salvo localmente, mas pode desaparecer ao recarregar a página.
```

## 🔧 Script SQL Completo

Execute no Supabase SQL Editor:

```sql
-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir insert de produtos" ON produtos;

-- Criar política permissiva para INSERT
CREATE POLICY "Permitir insert de produtos para todos"
ON produtos
FOR INSERT
TO public
WITH CHECK (true);

-- Garantir SELECT
CREATE POLICY "Permitir select de produtos"
ON produtos
FOR SELECT
TO public
USING (true);

-- Garantir UPDATE
CREATE POLICY "Permitir update de produtos"
ON produtos
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Garantir DELETE
CREATE POLICY "Permitir delete de produtos para todos"
ON produtos
FOR DELETE
TO public
USING (true);

-- Habilitar RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
```

## 💡 Dicas

1. **Sempre verifique o console** - Os logs mostram exatamente o que está acontecendo
2. **Execute o script SQL** - Resolve a maioria dos problemas de RLS
3. **Teste após executar** - Cadastre um produto e recarregue a página
4. **Verifique no Supabase** - Confirme que o produto foi salvo na tabela

## 📝 Checklist de Solução

- [ ] Abrir console (F12)
- [ ] Tentar cadastrar produto
- [ ] Ver erro no console
- [ ] Executar `fix-produtos-insert.sql` no Supabase
- [ ] Tentar cadastrar novamente
- [ ] Ver log de sucesso no console
- [ ] Recarregar página (F5)
- [ ] Confirmar que produto continua aparecendo
- [ ] Verificar no Supabase Table Editor

## 🎯 Resultado Esperado

Após executar o script SQL:
1. ✅ Produtos são salvos no Supabase
2. ✅ Produtos permanecem após recarregar
3. ✅ Logs mostram sucesso no console
4. ✅ Produtos aparecem no Table Editor do Supabase
