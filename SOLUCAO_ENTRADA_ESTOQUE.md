# 🔧 Solução: Produtos não estão sendo salvos na tabela entradas_estoque

## 🔍 Diagnóstico

O código está tentando salvar os dados no Supabase, mas provavelmente está falhando silenciosamente. As causas mais comuns são:

### 1. **Row Level Security (RLS) bloqueando inserções**
   - A tabela `entradas_estoque` pode ter RLS ativado sem políticas de INSERT
   - Solução: Desabilitar RLS ou criar política de INSERT

### 2. **Permissões insuficientes**
   - A chave anônima pode não ter permissão para INSERT
   - Solução: Verificar permissões da tabela

### 3. **Constraint de chave estrangeira**
   - O `produto_id` pode não existir na tabela produtos
   - Solução: Verificar se os IDs dos produtos estão corretos

## ✅ Soluções

### Solução 1: Desabilitar RLS (Mais Rápido)

Execute este SQL no Supabase:

```sql
-- Desabilitar RLS na tabela entradas_estoque
ALTER TABLE entradas_estoque DISABLE ROW LEVEL SECURITY;
```

### Solução 2: Criar Política RLS (Recomendado)

Execute este SQL no Supabase:

```sql
-- Habilitar RLS
ALTER TABLE entradas_estoque ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir INSERT para todos
CREATE POLICY "Permitir INSERT em entradas_estoque"
ON entradas_estoque
FOR INSERT
TO public
WITH CHECK (true);

-- Criar política para permitir SELECT para todos
CREATE POLICY "Permitir SELECT em entradas_estoque"
ON entradas_estoque
FOR SELECT
TO public
USING (true);

-- Criar política para permitir UPDATE para todos
CREATE POLICY "Permitir UPDATE em entradas_estoque"
ON entradas_estoque
FOR UPDATE
TO public
USING (true);

-- Criar política para permitir DELETE para todos
CREATE POLICY "Permitir DELETE em entradas_estoque"
ON entradas_estoque
FOR DELETE
TO public
USING (true);
```

### Solução 3: Verificar estrutura da tabela

Execute este SQL para verificar se a tabela está correta:

```sql
-- Ver estrutura da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'entradas_estoque'
ORDER BY ordinal_position;

-- Ver constraints
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'entradas_estoque';
```

## 🧪 Como Testar

### Opção 1: Usar o script de teste

1. Abra o arquivo `test-entrada-estoque.js`
2. Substitua `SUA_URL_AQUI` e `SUA_CHAVE_AQUI` pelas suas credenciais
3. Execute: `node test-entrada-estoque.js`

### Opção 2: Testar direto no SQL Editor do Supabase

```sql
-- Inserir uma entrada de teste
INSERT INTO entradas_estoque (
    id,
    produto_id,
    quantidade,
    fornecedor,
    data_recebimento
) VALUES (
    'teste_' || extract(epoch from now())::text,
    (SELECT id FROM produtos LIMIT 1),
    10,
    'Teste Manual',
    now()
);

-- Verificar se foi inserido
SELECT * FROM entradas_estoque ORDER BY data_recebimento DESC LIMIT 5;
```

## 📋 Checklist de Verificação

- [ ] Verificar se RLS está ativado na tabela `entradas_estoque`
- [ ] Verificar se existem políticas RLS configuradas
- [ ] Testar inserção manual via SQL Editor
- [ ] Verificar se os IDs dos produtos existem
- [ ] Verificar logs do console do navegador (F12)
- [ ] Verificar se a URL e chave do Supabase estão corretas em `lib/supabase.ts`

## 🎯 Próximos Passos

1. Execute a **Solução 1** (desabilitar RLS) para testar rapidamente
2. Se funcionar, implemente a **Solução 2** (políticas RLS) para segurança
3. Use o script de teste para confirmar que está funcionando
4. Teste no aplicativo adicionando uma entrada de estoque

## 💡 Dica

Abra o console do navegador (F12) e veja se há mensagens de erro quando você tenta adicionar uma entrada de estoque. O código já tem logs que mostram:
- `📦 Salvando entrada de estoque:` - quando tenta salvar
- `✅ Entrada de estoque salva com sucesso no Supabase!` - quando funciona
- `❌ Erro ao salvar entrada de estoque no Supabase:` - quando falha
