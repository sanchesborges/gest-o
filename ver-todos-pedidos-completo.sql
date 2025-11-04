-- ============================================
-- VER TODOS OS PEDIDOS COM ENTREGADOR_ID
-- ============================================

-- Query 1: TODOS os pedidos mostrando entregador_id
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

-- Query 2: Resumo de pedidos COM e SEM entregador
SELECT 
    CASE 
        WHEN entregador_id IS NULL THEN 'SEM ENTREGADOR'
        ELSE 'COM ENTREGADOR'
    END as tipo,
    COUNT(*) as quantidade
FROM pedidos
GROUP BY (entregador_id IS NULL);

-- Query 3: Pedidos COM entregador atribuído (detalhado)
SELECT 
    p.id,
    p.entregador_id,
    e.nome as entregador_nome,
    p.status,
    p.status_pagamento,
    p.valor_total
FROM pedidos p
LEFT JOIN entregadores e ON p.entregador_id::text = e.id::text
WHERE p.entregador_id IS NOT NULL
ORDER BY p.created_at DESC;
