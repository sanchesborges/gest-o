-- Script para diagnosticar duplicação de estoque

-- 1. Verificar se há entradas duplicadas (mesmo produto, mesma quantidade, mesmo horário)
SELECT 
    e.produto_id,
    p.nome,
    e.quantidade,
    e.fornecedor,
    e.data_recebimento,
    COUNT(*) as vezes_registrado
FROM entradas_estoque e
JOIN produtos p ON e.produto_id = p.id
GROUP BY e.produto_id, p.nome, e.quantidade, e.fornecedor, e.data_recebimento
HAVING COUNT(*) > 1
ORDER BY e.data_recebimento DESC;

-- 2. Ver todas as entradas recentes (últimas 24 horas)
SELECT 
    e.id,
    p.nome as produto,
    e.quantidade,
    e.fornecedor,
    e.data_recebimento,
    p.estoque_atual as estoque_atual_produto
FROM entradas_estoque e
JOIN produtos p ON e.produto_id = p.id
WHERE e.data_recebimento > NOW() - INTERVAL '24 hours'
ORDER BY e.data_recebimento DESC;

-- 3. Comparar estoque atual com soma de entradas (para detectar inconsistências)
SELECT 
    p.id,
    p.nome,
    p.estoque_atual as estoque_no_banco,
    COALESCE(SUM(e.quantidade), 0) as soma_entradas,
    COALESCE(SUM(ip.quantidade), 0) as soma_saidas_pedidos,
    COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0) as estoque_calculado,
    p.estoque_atual - (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON e.produto_id = p.id
LEFT JOIN itens_pedido ip ON ip.produto_id = p.id
GROUP BY p.id, p.nome, p.estoque_atual
HAVING p.estoque_atual != (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0))
ORDER BY ABS(p.estoque_atual - (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0))) DESC;

-- 4. Ver histórico completo de um produto específico (substitua 'PRODUTO_ID' pelo ID real)
/*
SELECT 
    'Entrada' as tipo,
    e.quantidade,
    e.data_recebimento as data,
    e.fornecedor as origem
FROM entradas_estoque e
WHERE e.produto_id = 'PRODUTO_ID'
UNION ALL
SELECT 
    'Saída (Pedido)' as tipo,
    -ip.quantidade as quantidade,
    ped.data as data,
    c.nome as origem
FROM itens_pedido ip
JOIN pedidos ped ON ip.pedido_id = ped.id
JOIN clientes c ON ped.cliente_id = c.id
WHERE ip.produto_id = 'PRODUTO_ID'
ORDER BY data DESC;
*/
