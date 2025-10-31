# 🔧 Solução: Erro "Could not find the 'preco_unitario' column"

## ❌ Erro Completo

```
❌ ERRO ao salvar produto no Supabase:
   Código: PGRST204
   Mensagem: Could not find the 'preco_unitario' column of 'produtos' in the schema cache
```

## 🔍 Causa

Este erro significa que:
1. A coluna `preco_unitario` não existe na tabela `produtos` do Supabase
2. OU a coluna tem um nome diferente
3. OU o schema cache do Supabase está desatualizado

## ✅ Solução

### Opção 1: Verificar Nome da Coluna (Recomendado)

1. Acesse o **Supabase Dashboard**
2. Vá em **Table Editor**
3. Abra a tabela `produtos`
4. Veja quais colunas existem

**Possíveis nomes:**
- `preco_unitario` ✅ (correto)
- `preco` ❌
- `precoPadrao` ❌
- `price` ❌

### Opção 2: Executar Script de Verificação

No **SQL Editor** do Supabase, execute:

```sql
-- Ver todas as colunas da tabela produtos
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'produtos'
ORDER BY ordinal_position;
```

### Opção 3: Adicionar Coluna se Não Existir

Se a coluna não existir, execute no **SQL Editor**:

```sql
-- Adicionar coluna preco_unitario
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS preco_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- Atualizar schema cache
NOTIFY pgrst, 'reload schema';
```

### Opção 4: Recriar Tabela (ÚLTIMA OPÇÃO)

⚠️ **ATENÇÃO**: Isso vai apagar todos os produtos!

Só use se as outras opções não funcionarem:

```sql
-- Backup dos dados (se houver)
CREATE TABLE produtos_backup AS SELECT * FROM produtos;

-- Apagar tabela antiga
DROP TABLE IF EXISTS produtos CASCADE;

-- Recriar tabela correta
CREATE TABLE produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'Biscoito',
    tamanho_pacote TEXT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 0,
    estoque_atual INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Criar políticas
CREATE POLICY "Permitir leitura pública de produtos" 
ON produtos FOR SELECT USING (true);

CREATE POLICY "Permitir inserção pública de produtos" 
ON produtos FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de produtos" 
ON produtos FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão pública de produtos" 
ON produtos FOR DELETE USING (true);

-- Atualizar schema cache
NOTIFY pgrst, 'reload schema';
```

## 🧪 Como Testar

### Teste 1: Verificar Colunas

No SQL Editor:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'produtos';
```

Deve retornar:
- id
- nome
- tipo
- tamanho_pacote
- **preco_unitario** ✅
- estoque_minimo
- estoque_atual
- created_at
- updated_at

### Teste 2: Inserir Produto Manualmente

No SQL Editor:
```sql
INSERT INTO produtos (
    id,
    nome,
    tipo,
    tamanho_pacote,
    preco_unitario,
    estoque_minimo,
    estoque_atual
) VALUES (
    'test_' || gen_random_uuid()::text,
    'Produto Teste',
    'Pão de Queijo',
    '1kg',
    25.00,
    10,
    0
);

-- Verificar
SELECT * FROM produtos WHERE nome = 'Produto Teste';

-- Limpar
DELETE FROM produtos WHERE nome = 'Produto Teste';
```

Se isso funcionar, o problema está resolvido!

### Teste 3: Cadastrar pela Aplicação

1. Vá em **Cadastro de Produtos**
2. Clique em **Novo Produto**
3. Preencha os dados
4. Salve
5. Veja no console: `✅ Produto salvo com sucesso no Supabase`

## 🔄 Atualizar Schema Cache

Às vezes o Supabase precisa atualizar o cache do schema. Execute:

```sql
NOTIFY pgrst, 'reload schema';
```

Ou reinicie o projeto no Supabase Dashboard:
1. Vá em **Settings** → **General**
2. Clique em **Pause project**
3. Aguarde alguns segundos
4. Clique em **Resume project**

## 📊 Estrutura Correta da Tabela

A tabela `produtos` deve ter esta estrutura:

```sql
CREATE TABLE produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'Biscoito',
    tamanho_pacote TEXT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0,  -- ← Esta coluna!
    estoque_minimo INTEGER NOT NULL DEFAULT 0,
    estoque_atual INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Checklist de Solução

- [ ] Verificar se coluna `preco_unitario` existe
- [ ] Se não existir, adicionar com ALTER TABLE
- [ ] Executar NOTIFY pgrst, 'reload schema'
- [ ] Testar inserção manual no SQL Editor
- [ ] Testar cadastro pela aplicação
- [ ] Ver log de sucesso no console
- [ ] Recarregar página e confirmar que produto permanece

## 💡 Dicas

1. **Sempre verifique primeiro** - Use o SQL Editor para ver as colunas
2. **Não apague a tabela** - A menos que seja absolutamente necessário
3. **Faça backup** - Se tiver dados importantes
4. **Atualize o cache** - Execute NOTIFY pgrst, 'reload schema'
5. **Teste manualmente** - Insira um produto pelo SQL Editor primeiro

## 🚨 Se Nada Funcionar

1. Verifique se está conectado ao projeto correto no Supabase
2. Verifique se a URL e ANON_KEY estão corretas
3. Tente pausar e resumir o projeto no Supabase
4. Entre em contato com o suporte do Supabase

## 📝 Arquivos de Ajuda

- `fix-produtos-schema.sql` - Script completo de verificação e correção
- `check-produtos-columns.sql` - Script simples para ver colunas
- `supabase-schema.sql` - Schema original da tabela
