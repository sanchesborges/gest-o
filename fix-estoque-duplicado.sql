-- Corrigir estoques duplicados/errados

-- 1. Ver situação atual
SELECT 
    p.id,
    p.nome,
    p.estoque_atual as estoque_sistema,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    COALESCE(SUM(ip.quantidade), 0) as total_vendas,
    (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as estoque_correto,
    (p.estoque_atual - (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0))) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY diferenca DESC;

-- 2. Recalcular estoque correto para cada produto
WITH estoque_calculado AS (
    SELECT 
        p.id,
        p.nome,
        COALESCE(SUM(e.quantidade), 0) as total_entradas,
        COALESCE(SUM(ip.quantidade), 0) as total_vendas,
        (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as estoque_correto
    FROM produtos p
    LEFT JOIN entradas_estoque e ON p.id = e.produto_id
    LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
    GROUP BY p.id, p.nome
)
UPDATE produtos p
SET estoque_atual = ec.estoque_correto
FROM estoque_calculado ec
WHERE p.id = ec.id;

-- 3. Verificar resultado
SELECT 
    p.id,
    p.nome,
    p.estoque_atual,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    COALESCE(SUM(ip.quantidade), 0) as total_vendas,
    CASE 
        WHEN p.estoque_atual = (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) THEN '✅ CORRETO'
        ELSE '❌ ERRADO'
    END as status
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- 4. Resumo (versão simplificada)
SELECT 
    COUNT(*) as total_produtos
FROM produtos;
