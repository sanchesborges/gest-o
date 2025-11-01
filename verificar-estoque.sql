-- Script para verificar e corrigir estoques duplicados

-- 1. Ver o estoque atual de todos os produtos
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo
FROM produtos
ORDER BY nome;

-- 2. Ver todas as entradas de estoque
SELECT 
    e.id,
    p.nome as produto,
    e.quantidade,
    e.fornecedor,
    e.data_recebimento
FROM entradas_estoque e
JOIN produtos p ON e.produto_id = p.id
ORDER BY e.data_recebimento DESC;

-- 3. Calcular o estoque correto baseado nas entradas
-- (assumindo que o estoque inicial era 0)
SELECT 
    p.id,
    p.nome,
    p.estoque_atual as estoque_registrado,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    p.estoque_atual - COALESCE(SUM(e.quantidade), 0) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON e.produto_id = p.id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- 4. Se precisar recalcular os estoques (CUIDADO! Isso vai sobrescrever os valores)
-- Descomente as linhas abaixo apenas se tiver certeza

/*
-- Resetar todos os estoques para 0
UPDATE produtos SET estoque_atual = 0;

-- Recalcular baseado nas entradas
UPDATE produtos p
SET estoque_atual = (
    SELECT COALESCE(SUM(e.quantidade), 0)
    FROM entradas_estoque e
    WHERE e.produto_id = p.id
);
*/
