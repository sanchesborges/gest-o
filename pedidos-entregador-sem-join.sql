-- ============================================
-- PEDIDOS POR ENTREGADOR (SEM JOIN)
-- ============================================

-- Query 1: Pedidos do Rafael (df63fb48-43dd-44b9-9846-4380b983bbbf)
SELECT 
    p.id,
    p.status,
    p.status_pagamento,
    p.valor_total,
    p.valor_pago,
    p.pagamento_parcial,
    p.data_entrega,
    p.entregador_id,
    p.created_at
FROM pedidos p
WHERE p.entregador_id::text = 'df63fb48-43dd-44b9-9846-4380b983bbbf'
ORDER BY p.created_at DESC;

-- Query 2: Pedidos do Thiago (609fb4b1-ada5-4e49-8ade-091f102c8be9)
SELECT 
    p.id,
    p.status,
    p.status_pagamento,
    p.valor_total,
    p.valor_pago,
    p.pagamento_parcial,
    p.data_entrega,
    p.entregador_id,
    p.created_at
FROM pedidos p
WHERE p.entregador_id::text = '609fb4b1-ada5-4e49-8ade-091f102c8be9'
ORDER BY p.created_at DESC;

-- Query 3: Todos os pedidos com entregador atribuído
SELECT 
    p.entregador_id,
    COUNT(*) as total_pedidos,
    COUNT(CASE WHEN p.status = 'Entregue' THEN 1 END) as entregues,
    COUNT(CASE WHEN p.status = 'Pendente' THEN 1 END) as pendentes,
    COUNT(CASE WHEN p.status_pagamento = 'Pendente' THEN 1 END) as pagamentos_pendentes
FROM pedidos p
WHERE p.entregador_id IS NOT NULL
GROUP BY p.entregador_id;

-- Query 4: Detalhes dos pedidos entregues com pagamento pendente
SELECT 
    p.id,
    p.entregador_id,
    p.status,
    p.status_pagamento,
    p.valor_total,
    p.valor_pago,
    p.pagamento_parcial,
    p.data_entrega
FROM pedidos p
WHERE p.status = 'Entregue'
AND p.status_pagamento = 'Pendente'
ORDER BY p.data_entrega DESC;
