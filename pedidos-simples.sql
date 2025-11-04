-- ============================================
-- QUERIES SIMPLES PARA DIAGNÓSTICO
-- ============================================

-- Query 1: Ver TODAS as colunas de um pedido
SELECT *
FROM pedidos
WHERE entregador_id IS NOT NULL
LIMIT 1;

-- Query 2: Pedidos do Rafael
SELECT *
FROM pedidos
WHERE entregador_id::text = 'df63fb48-43dd-44b9-9846-4380b983bbbf';

-- Query 3: Pedidos do Thiago
SELECT *
FROM pedidos
WHERE entregador_id::text = '609fb4b1-ada5-4e49-8ade-091f102c8be9';

-- Query 4: Resumo por entregador
SELECT 
    entregador_id,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'Entregue' THEN 1 END) as entregues,
    COUNT(CASE WHEN status_pagamento = 'Pendente' THEN 1 END) as pendentes
FROM pedidos
WHERE entregador_id IS NOT NULL
GROUP BY entregador_id;
