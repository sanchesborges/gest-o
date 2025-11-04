-- ============================================
-- VERIFICAR ENTREGADOR_ID NOS PEDIDOS
-- ============================================

-- Query 1: Ver estrutura da coluna entregador_id
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'pedidos'
AND column_name = 'entregador_id';

-- Query 2: Ver todos os pedidos com seus entregador_id
SELECT 
    id,
    cliente_id,
    entregador_id,
    status,
    status_pagamento,
    valor_total,
    created_at
FROM pedidos
ORDER BY created_at DESC;

-- Query 3: Contar pedidos por entregador
SELECT 
    entregador_id,
    COUNT(*) as total_pedidos
FROM pedidos
WHERE entregador_id IS NOT NULL
GROUP BY entregador_id;

-- Query 4: Ver pedidos SEM entregador atribuído
SELECT 
    id,
    cliente_id,
    status,
    valor_total
FROM pedidos
WHERE entregador_id IS NULL;
