# 🔧 Solução: Erro "invalid input value for enum tipo_cliente"

## 🔍 Erro Completo

```
ERROR: 22P02: invalid input value for enum tipo_cliente: ""
LINE 14: WHERE tipo IS NULL OR tipo = '';
```

## 🎯 Causa

O erro acontece porque:

1. A coluna `tipo` no banco é um **ENUM**, não TEXT
2. O SQL tentou comparar com string vazia: `tipo = ''`
3. ENUMs não aceitam strings vazias, apenas valores NULL ou valores válidos do ENUM

## ✅ Solução Correta

### SQL Correto (funciona com ENUM)

```sql
-- ✅ CORRETO: Atualizar apenas valores NULL
UPDATE clientes 
SET tipo = 'Mercado'::tipo_cliente
WHERE tipo IS NULL;

UPDATE clientes 
SET condicao_pagamento = '15 dias'::condicao_pagamento
WHERE condicao_pagamento IS NULL;
```

### ❌ SQL Errado (causa o erro)

```sql
-- ❌ ERRADO: Tentar comparar ENUM com string vazia
UPDATE clientes 
SET tipo = 'Mercado' 
WHERE tipo IS NULL OR tipo = '';  -- ← Erro aqui!
```

## 📊 Estrutura do Banco

O Supabase usa ENUMs para estas colunas:

```sql
-- ENUM para tipo de cliente
CREATE TYPE tipo_cliente AS ENUM (
  'Mercado',
  'Padaria',
  'Varejo',
  'Restaurante',
  'Outros'
);

-- ENUM para condição de pagamento
CREATE TYPE condicao_pagamento AS ENUM (
  'À vista',
  'Pagar na próxima entrega',
  '7 dias',
  '15 dias',
  '30 dias'
);

-- Tabela clientes usa esses ENUMs
CREATE TABLE clientes (
    id UUID PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo tipo_cliente,              -- ← ENUM, não TEXT
    condicao_pagamento condicao_pagamento,  -- ← ENUM, não TEXT
    ...
);
```

## 🧪 Como Testar

### 1. Verificar Estrutura

```sql
-- Ver tipo das colunas
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'clientes';
```

Resultado esperado:
```
column_name          | data_type | udt_name
---------------------|-----------|-------------------
tipo                 | USER-DEFINED | tipo_cliente
condicao_pagamento   | USER-DEFINED | condicao_pagamento
```

### 2. Ver Valores Válidos do ENUM

```sql
-- Ver valores permitidos
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname IN ('tipo_cliente', 'condicao_pagamento')
ORDER BY t.typname, e.enumsortorder;
```

### 3. Atualizar Valores NULL

```sql
-- Atualizar com CAST explícito
UPDATE clientes 
SET tipo = 'Mercado'::tipo_cliente
WHERE tipo IS NULL;

UPDATE clientes 
SET condicao_pagamento = '15 dias'::condicao_pagamento
WHERE condicao_pagamento IS NULL;
```

### 4. Verificar Resultado

```sql
-- Converter ENUM para TEXT na visualização
SELECT 
    id, 
    nome, 
    tipo::text as tipo,
    condicao_pagamento::text as condicao_pagamento
FROM clientes;
```

## 🚨 Erros Comuns

### Erro: "invalid input value for enum"

**Causa:** Tentando inserir valor que não existe no ENUM

**Solução:** Use apenas valores válidos:
- Para `tipo_cliente`: 'Mercado', 'Padaria', 'Varejo', 'Restaurante', 'Outros'
- Para `condicao_pagamento`: 'À vista', 'Pagar na próxima entrega', '7 dias', '15 dias', '30 dias'

### Erro: "cannot cast type text to tipo_cliente"

**Causa:** Tentando inserir sem CAST

**Solução:** Use `::tipo_cliente` para fazer o CAST:
```sql
UPDATE clientes SET tipo = 'Mercado'::tipo_cliente;
```

## 💡 Diferença: TEXT vs ENUM

| Aspecto | TEXT | ENUM |
|---------|------|------|
| Valores | Qualquer string | Apenas valores pré-definidos |
| String vazia | ✅ Aceita `''` | ❌ Não aceita `''` |
| NULL | ✅ Aceita | ✅ Aceita |
| Validação | Nenhuma | Automática |
| Performance | Menor | Maior |

## ✅ Checklist

- [ ] SQL atualizado para usar `::tipo_cliente`
- [ ] SQL atualizado para usar `::condicao_pagamento`
- [ ] Removido `OR tipo = ''` da condição WHERE
- [ ] Removido `OR condicao_pagamento = ''` da condição WHERE
- [ ] SQL executado com sucesso
- [ ] Clientes verificados (sem NULL)

## 📝 Arquivos Corretos

Use estes arquivos SQL:

- ✅ **`fix-clientes-enum.sql`** - SQL correto para ENUMs
- ✅ **`fix-clientes-safe.sql`** - SQL seguro (só NULL)
- ❌ ~~`fix-clientes-schema.sql`~~ - Tinha erro com string vazia

## 🎯 Resumo

1. ✅ Use `WHERE tipo IS NULL` (não `OR tipo = ''`)
2. ✅ Use `'Mercado'::tipo_cliente` (com CAST)
3. ✅ Use `'15 dias'::condicao_pagamento` (com CAST)
4. ✅ Execute o SQL correto
5. ✅ Recarregue a aplicação (F5)
6. ✅ Teste criar um pedido

Pronto! Agora deve funcionar! 🎉
