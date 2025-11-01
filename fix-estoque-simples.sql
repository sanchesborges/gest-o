-- CORREÇÃO SIMPLES DE ESTOQUE
-- Execute passo a passo

-- PASSO 1: Ver situação atual
SELECT 
    p.id,
    p.nome,
    p.estoque_atual as estoque_no_sistema,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    COALESCE(SUM(ip.quantidade), 0) as total_vendas,
    (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as estoque_correto
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- PASSO 2: Recalcular todos os estoques
-- (Execute este UPDATE para corrigir)
WITH estoque_calculado AS (
    SELECT 
        p.id,
        (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as estoque_correto
    FROM produtos p
    LEFT JOIN entradas_estoque e ON p.id = e.produto_id
    LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
    GROUP BY p.id
)
UPDATE produtos p
SET estoque_atual = ec.estoque_correto
FROM estoque_calculado ec
WHERE p.id = ec.id;

-- PASSO 3: Verificar resultado
SELECT 
    nome,
    estoque_atual,
    CASE 
        WHEN estoque_atual < 0 THEN '❌ NEGATIVO'
        WHEN estoque_atual = 0 THEN '⚠️ ZERADO'
        WHEN estoque_atual < estoque_minimo THEN '⚠️ BAIXO'
        ELSE '✅ OK'
    END as status
FROM produtos
ORDER BY nome;
