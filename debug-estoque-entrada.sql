-- DEBUG: Verificar entradas de estoque e estoque atual

-- 1. Ver todas as entradas registradas
SELECT 
    e.id,
    p.nome as produto,
    e.quantidade,
    e.fornecedor,
    e.data_recebimento,
    e.created_at
FROM entradas_estoque e
JOIN produtos p ON e.produto_id = p.id
ORDER BY e.created_at DESC
LIMIT 20;

-- 2. Ver estoque atual de cada produto
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo
FROM produtos
ORDER BY nome;

-- 3. Comparar entradas vs estoque (ver se bate)
SELECT 
    p.nome,
    p.estoque_atual as estoque_sistema,
    COUNT(e.id) as num_entradas,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    COALESCE(SUM(ip.quantidade), 0) as total_vendas,
    (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as estoque_calculado,
    CASE 
        WHEN p.estoque_atual = (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) THEN '✅ CORRETO'
        ELSE '❌ ERRADO'
    END as status
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- 4. Ver produtos que têm entradas mas estoque zerado (BUG!)
SELECT 
    p.nome,
    p.estoque_atual,
    COUNT(e.id) as num_entradas,
    SUM(e.quantidade) as total_entradas
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
WHERE p.estoque_atual = 0 AND e.id IS NOT NULL
GROUP BY p.id, p.nome, p.estoque_atual;

-- 5. Ver últimas 10 entradas com detalhes
SELECT 
    p.nome as produto,
    e.quantidade,
    e.fornecedor,
    TO_CHAR(e.data_recebimento, 'DD/MM/YYYY HH24:MI') as data_entrada,
    p.estoque_atual as estoque_atual_produto
FROM entradas_estoque e
JOIN produtos p ON e.produto_id = p.id
ORDER BY e.created_at DESC
LIMIT 10;
