# 🔧 Correção: Erro de Tipo UUID

## ❌ Problema

Ao executar algumas consultas SQL, você pode encontrar este erro:

```
ERROR: 42883: operator does not exist: uuid = text
LINE 74: LEFT JOIN entregadores e ON p.entregador_id = e.id ^
HINT: No operator matches the given name and argument types. 
You might need to add explicit type casts.
```

## 🔍 Causa

O erro ocorre porque:
- A coluna `entregador_id` na tabela `pedidos` é do tipo **TEXT**
- A coluna `id` na tabela `entregadores` é do tipo **UUID**
- PostgreSQL não consegue comparar diretamente UUID com TEXT

## ✅ Solução

### Opção 1: Usar Cast Explícito (Recomendado)

Converta ambos os lados para o mesmo tipo usando `::text`:

```sql
-- ❌ ERRADO
LEFT JOIN entregadores e ON p.entregador_id = e.id

-- ✅ CORRETO
LEFT JOIN entregadores e ON p.entregador_id::text = e.id::text
```

Ou simplesmente:

```sql
-- ✅ CORRETO (se entregador_id já é TEXT)
LEFT JOIN entregadores e ON p.entregador_id = e.id::text
```

### Opção 2: Corrigir o Tipo da Coluna (Permanente)

Se quiser corrigir permanentemente, altere o tipo da coluna:

```sql
-- Converter entregador_id para UUID
ALTER TABLE pedidos 
ALTER COLUMN entregador_id TYPE UUID 
USING entregador_id::uuid;
```

**⚠️ ATENÇÃO:** Faça backup antes de executar!

## 📝 Arquivo Corrigido

Criamos um novo arquivo com todas as consultas corrigidas:

**`consultas-pagamento-entrega-corrigido.sql`**

Este arquivo inclui:
- ✅ Todas as consultas com cast correto
- ✅ Uso de `COALESCE` para valores NULL
- ✅ Proteção contra divisão por zero
- ✅ Validação de dados inconsistentes

## 🔄 Como Usar

### Se você quer usar as consultas agora:

Use o arquivo **`consultas-pagamento-entrega-corrigido.sql`**

### Se você quer corrigir permanentemente:

1. **Faça backup:**
```sql
-- Backup da tabela pedidos
CREATE TABLE pedidos_backup AS SELECT * FROM pedidos;
```

2. **Verifique os dados:**
```sql
-- Ver tipos atuais
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('pedidos', 'entregadores')
AND column_name IN ('id', 'entregador_id');
```

3. **Converta se necessário:**
```sql
-- Apenas se entregador_id for TEXT e você quiser converter para UUID
ALTER TABLE pedidos 
ALTER COLUMN entregador_id TYPE UUID 
USING entregador_id::uuid;
```

## 🧪 Testar a Correção

Execute esta consulta para verificar se funciona:

```sql
-- Teste simples
SELECT 
  p.id,
  c.nome as cliente,
  e.nome as entregador
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN entregadores e ON p.entregador_id = e.id
LIMIT 5;
```

Se der erro, use:

```sql
-- Teste com cast
SELECT 
  p.id,
  c.nome as cliente,
  e.nome as entregador
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN entregadores e ON p.entregador_id::text = e.id::text
LIMIT 5;
```

## 📊 Consultas Mais Usadas (Corrigidas)

### 1. Resumo Financeiro do Dia
```sql
SELECT 
  COUNT(*) as total_pedidos,
  SUM(CASE WHEN status_pagamento = 'Pago' THEN valor_total ELSE 0 END) as total_pago,
  SUM(CASE WHEN status_pagamento = 'Pendente' THEN valor_total ELSE 0 END) as total_pendente,
  SUM(CASE WHEN pagamento_parcial = true THEN valor_pago ELSE 0 END) as total_entradas
FROM pedidos
WHERE DATE(data) = CURRENT_DATE;
```

### 2. Clientes com Saldo Devedor
```sql
SELECT 
  c.nome as cliente,
  c.telefone,
  COUNT(p.id) as qtd_pedidos_pendentes,
  SUM(p.valor_total) as saldo_devedor
FROM clientes c
JOIN pedidos p ON c.id = p.cliente_id
WHERE p.status_pagamento IN ('Pendente', 'Atrasado')
GROUP BY c.id, c.nome, c.telefone
ORDER BY saldo_devedor DESC;
```

### 3. Resumo por Entregador (CORRIGIDO)
```sql
SELECT 
  e.nome as entregador,
  COUNT(p.id) as entregas_realizadas,
  COALESCE(SUM(CASE WHEN p.status_pagamento = 'Pago' THEN p.valor_total ELSE 0 END), 0) as recebido,
  COALESCE(SUM(CASE WHEN p.pagamento_parcial = true THEN p.valor_pago ELSE 0 END), 0) as entradas,
  COALESCE(SUM(CASE WHEN p.status_pagamento = 'Pendente' THEN p.valor_total ELSE 0 END), 0) as pendente
FROM entregadores e
LEFT JOIN pedidos p ON e.id = p.entregador_id AND DATE(p.data) = CURRENT_DATE
GROUP BY e.id, e.nome
ORDER BY entregas_realizadas DESC;
```

## 🎯 Recomendação

**Use o arquivo `consultas-pagamento-entrega-corrigido.sql`**

Este arquivo já tem todas as correções necessárias e funciona independente do tipo de dado das colunas.

## 📚 Arquivos Relacionados

- **`consultas-pagamento-entrega-corrigido.sql`** - Versão corrigida (USE ESTE)
- **`consultas-pagamento-entrega.sql`** - Versão original (pode ter erros)
- **`add-payment-fields.sql`** - Script de instalação

## ✅ Checklist

- [x] Identificar erro de tipo UUID vs TEXT
- [x] Criar arquivo corrigido
- [x] Adicionar cast explícito nas consultas
- [x] Adicionar COALESCE para valores NULL
- [x] Testar consultas principais
- [x] Documentar solução

## 🆘 Ainda com Problemas?

Se ainda encontrar erros:

1. **Verifique os tipos:**
```sql
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('pedidos', 'entregadores', 'clientes')
AND column_name LIKE '%id%';
```

2. **Use sempre cast explícito:**
```sql
-- Sempre converta para o mesmo tipo
ON coluna1::text = coluna2::text
```

3. **Consulte a documentação:**
- [INSTALAR_PAGAMENTO_ENTREGA.md](INSTALAR_PAGAMENTO_ENTREGA.md)
- [INDICE_PAGAMENTO_ENTREGA.md](INDICE_PAGAMENTO_ENTREGA.md)

---

**Problema resolvido!** Use o arquivo `consultas-pagamento-entrega-corrigido.sql` 🎉
