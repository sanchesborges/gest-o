# 🔧 SOLUÇÃO FINAL - Erro ao Salvar Pedido

## 🎯 Problema Confirmado

Os pedidos estão sendo salvos, mas os **itens NÃO**:
- Pedido `b0f5c23f...` - R$ 600,00 - SEM ITENS ❌
- Pedido `c53de6a1...` - R$ 1920,00 - SEM ITENS ❌

## 🔍 Causa Provável

Há duas possibilidades:

### Possibilidade 1: Trigger Duplicando Atualização

Pode haver um trigger na tabela `itens_pedido` que atualiza o estoque automaticamente:

```
1. Código atualiza estoque: 50 - 10 = 40 ✅
2. Código tenta inserir item ✅
3. Trigger atualiza estoque novamente: 40 - 10 = 30 ❌
4. Constraint falha porque tentou atualizar 2 vezes
```

### Possibilidade 2: Constraint Validando na Inserção

A constraint `produtos_estoque_atual_check` pode estar sendo validada durante a inserção de itens por causa de um trigger ou foreign key.

## 🚨 AÇÃO IMEDIATA

### Passo 1: Verificar se há Triggers

Execute `investigar-foreign-keys.sql` no Supabase e me envie o resultado completo.

### Passo 2: Limpar Pedidos Sem Itens

Execute no Supabase:

```sql
-- Ver pedidos sem itens
SELECT 
    ped.id,
    ped.data,
    ped.valor_total
FROM pedidos ped
LEFT JOIN itens_pedido ip ON ip.pedido_id = ped.id
WHERE ip.id IS NULL;

-- Deletar pedidos sem itens
DELETE FROM pedidos
WHERE id IN (
    SELECT ped.id
    FROM pedidos ped
    LEFT JOIN itens_pedido ip ON ip.pedido_id = ped.id
    WHERE ip.id IS NULL
);
```

### Passo 3: Recalcular Estoques

```sql
UPDATE produtos p
SET estoque_atual = (
    SELECT COALESCE(SUM(e.quantidade), 0)
    FROM entradas_estoque e
    WHERE e.produto_id = p.id
) - (
    SELECT COALESCE(SUM(ip.quantidade), 0)
    FROM itens_pedido ip
    WHERE ip.produto_id = p.id
);
```

## 🔧 Soluções Possíveis

### Solução A: Se houver trigger duplicando

**Remover o trigger:**
```sql
DROP TRIGGER IF EXISTS nome_do_trigger ON itens_pedido;
```

**OU modificar o código para não atualizar estoque manualmente** (deixar o trigger fazer).

### Solução B: Se não houver trigger

**Modificar a ordem das operações:**
1. Salvar pedido
2. Salvar itens PRIMEIRO
3. Atualizar estoque DEPOIS

Isso evita que a constraint seja validada durante a inserção.

## 📊 Informações Necessárias

Execute estes SQLs e me envie os resultados:

1. `investigar-foreign-keys.sql` - Ver triggers e foreign keys
2. `diagnostico-completo.sql` - Ver estado completo do banco

Com essas informações, vou implementar a solução correta!

## 🎯 Próximos Passos

1. Execute os SQLs acima
2. Me envie os resultados
3. Vou implementar a correção definitiva
4. Testar e commitar

Estamos quase lá! 🚀
