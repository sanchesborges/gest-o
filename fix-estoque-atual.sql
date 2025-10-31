-- Script para verificar e corrigir estoque atual

-- ============================================
-- PARTE 1: Ver estoque atual vs entradas
-- ============================================

-- Ver produtos e seu estoque
SELECT 
    p.id,
    p.nome,
    p.estoque_atual,
    p.estoque_minimo
FROM produtos p
ORDER BY p.nome;

-- Ver entradas de estoque por produto
SELECT 
    p.nome,
    p.estoque_atual as estoque_registrado,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    p.estoque_atual - COALESCE(SUM(e.quantidade), 0) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- ============================================
-- PARTE 2: Recalcular estoque baseado em entradas
-- ============================================

-- Ver o que deveria ser o estoque (baseado em entradas)
SELECT 
    p.id,
    p.nome,
    p.estoque_atual as estoque_atual,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    COALESCE(SUM(e.quantidade), 0) as estoque_correto
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- ============================================
-- PARTE 3: Corrigir estoque (CUIDADO!)
-- ============================================

-- OPÇÃO A: Resetar estoque para 0 e recalcular baseado em entradas
/*
UPDATE produtos p
SET estoque_atual = COALESCE((
    SELECT SUM(e.quantidade)
    FROM entradas_estoque e
    WHERE e.produto_id = p.id
), 0);
*/

-- OPÇÃO B: Corrigir produto específico
/*
UPDATE produtos 
SET estoque_atual = 0  -- ou o valor correto
WHERE id = 'ID_DO_PRODUTO_AQUI';
*/

-- OPÇÃO C: Ver produtos com estoque suspeito (muito alto)
SELECT 
    p.id,
    p.nome,
    p.estoque_atual,
    COALESCE(SUM(e.quantidade), 0) as total_entradas
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
HAVING p.estoque_atual > COALESCE(SUM(e.quantidade), 0) + 100  -- Diferença maior que 100
ORDER BY p.estoque_atual DESC;

-- ============================================
-- PARTE 4: Ver últimas entradas
-- ============================================

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

-- ============================================
-- PARTE 5: Limpar entradas duplicadas (se houver)
-- ============================================

-- Ver se há entradas duplicadas
SELECT 
    produto_id,
    quantidade,
    fornecedor,
    data_recebimento,
    COUNT(*) as duplicatas
FROM entradas_estoque
GROUP BY produto_id, quantidade, fornecedor, data_recebimento
HAVING COUNT(*) > 1;
