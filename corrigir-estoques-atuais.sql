-- Script para corrigir estoques atuais baseado nas entradas

-- ============================================
-- PARTE 1: Ver situação atual
-- ============================================

-- Ver estoque atual vs soma de entradas
SELECT 
    p.nome,
    p.estoque_atual as estoque_registrado,
    COALESCE(SUM(e.quantidade), 0) as soma_entradas,
    p.estoque_atual - COALESCE(SUM(e.quantidade), 0) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
HAVING p.estoque_atual != COALESCE(SUM(e.quantidade), 0)
ORDER BY ABS(p.estoque_atual - COALESCE(SUM(e.quantidade), 0)) DESC;

-- ============================================
-- PARTE 2: Corrigir TODOS os estoques
-- ============================================

-- Recalcular estoque de todos os produtos baseado nas entradas
UPDATE produtos p
SET estoque_atual = COALESCE((
    SELECT SUM(e.quantidade)
    FROM entradas_estoque e
    WHERE e.produto_id = p.id
), 0);

-- ============================================
-- PARTE 3: Verificar correção
-- ============================================

-- Ver estoques após correção
SELECT 
    p.nome,
    p.estoque_atual,
    COALESCE(SUM(e.quantidade), 0) as soma_entradas
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- ============================================
-- PARTE 4: Corrigir produto específico (se necessário)
-- ============================================

-- Corrigir apenas Biscoito de Queijo ( P ) 1kg
UPDATE produtos 
SET estoque_atual = 70
WHERE id = 'b7e56d89-3dd5-4c46-a759-2f82308de235';
