-- ============================================
-- TESTE COM ENTREGADORES ESPECÍFICOS
-- ============================================

-- Query 1: Ver todos os entregadores disponíveis
SELECT 
    id,
    nome,
    telefone
FROM entregadores
ORDER BY nome;

-- Query 2: Pedidos do entregador df63fb48-43dd-44b9-9846-4380b983bbbf
SELECT 
    p.id,
    p.numero_pedido,
    c.nome as cliente,
    p.status,
    p.status_pagamento,
    p.valor_total,
    p.valor_pago,
    p.pagamento_parcial,
    p.data_entrega,
    e.nome as entregador
FROM pedidos p
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN entregadores e ON p.entregador_id = e.id
WHERE p.entregador_id = 'df63fb48-43dd-44b9-9846-4380b983bbbf'
ORDER BY p.created_at DESC;

-- Query 3: Pedidos do entregador 609fb4b1-ada5-4e49-8ade-091f102c8be9
SELECT 
    p.id,
    p.numero_pedido,
    c.nome as cliente,
    p.status,
    p.status_pagamento,
    p.valor_total,
    p.valor_pago,
    p.pagamento_parcial,
    p.data_entrega,
    e.nome as entregador
FROM pedidos p
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN entregadores e ON p.entregador_id = e.id
WHERE p.entregador_id = '609fb4b1-ada5-4e49-8ade-091f102c8be9'
ORDER BY p.created_at DESC;

-- Query 4: Resumo por entregador
SELECT 
    e.nome as entregador,
    COUNT(*) as total_pedidos,
    COUNT(CASE WHEN p.status = 'Entregue' THEN 1 END) as entregues,
    COUNT(CASE WHEN p.status_pagamento = 'Pendente' THEN 1 END) as pagamentos_pendentes,
    SUM(CASE WHEN p.status_pagamento = 'Pendente' THEN p.valor_total - p.valor_pago ELSE 0 END) as valor_pendente
FROM pedidos p
LEFT JOIN entregadores e ON p.entregador_id = e.id
WHERE p.entregador_id IS NOT NULL
GROUP BY e.id, e.nome
ORDER BY e.nome;
