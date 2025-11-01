-- Script para verificar o estoque atual de todos os produtos

-- 1. Ver todos os produtos e seu status de estoque
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo,
    CASE 
        WHEN estoque_atual < 0 THEN '❌ NEGATIVO'
        WHEN estoque_atual = 0 THEN '⚠️ ZERADO'
        WHEN estoque_atual < estoque_minimo THEN '⚠️ BAIXO'
        ELSE '✅ OK'
    END as status,
    CASE 
        WHEN estoque_atual < estoque_minimo THEN estoque_minimo - estoque_atual
        ELSE 0
    END as faltam
FROM produtos
ORDER BY 
    CASE 
        WHEN estoque_atual < 0 THEN 1
        WHEN estoque_atual = 0 THEN 2
        WHEN estoque_atual < estoque_minimo THEN 3
        ELSE 4
    END,
    estoque_atual ASC;

-- 2. Resumo geral
SELECT 
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN estoque_atual < 0 THEN 1 END) as negativos,
    COUNT(CASE WHEN estoque_atual = 0 THEN 1 END) as zerados,
    COUNT(CASE WHEN estoque_atual < estoque_minimo AND estoque_atual > 0 THEN 1 END) as baixos,
    COUNT(CASE WHEN estoque_atual >= estoque_minimo THEN 1 END) as ok
FROM produtos;

-- 3. Produtos com estoque negativo (se houver)
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo
FROM produtos
WHERE estoque_atual < 0
ORDER BY estoque_atual ASC;
