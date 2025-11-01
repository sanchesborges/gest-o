-- Verificar estoque de todos os produtos

SELECT 
    id,
    nome,
    tipo::text as tipo,
    tamanho_pacote,
    estoque_atual,
    estoque_minimo,
    CASE 
        WHEN estoque_atual < 0 THEN '❌ NEGATIVO'
        WHEN estoque_atual = 0 THEN '⚠️ ZERADO'
        WHEN estoque_atual < estoque_minimo THEN '⚠️ BAIXO'
        ELSE '✅ OK'
    END as status_estoque
FROM produtos
ORDER BY estoque_atual ASC, nome;

-- Contar produtos por status
SELECT 
    COUNT(*) FILTER (WHERE estoque_atual < 0) as negativos,
    COUNT(*) FILTER (WHERE estoque_atual = 0) as zerados,
    COUNT(*) FILTER (WHERE estoque_atual > 0 AND estoque_atual < estoque_minimo) as baixos,
    COUNT(*) FILTER (WHERE estoque_atual >= estoque_minimo) as ok,
    COUNT(*) as total
FROM produtos;

-- Produtos com estoque negativo (ERRO!)
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo
FROM produtos
WHERE estoque_atual < 0;

-- Produtos com estoque zerado
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo
FROM produtos
WHERE estoque_atual = 0;

-- Produtos com estoque baixo
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo,
    (estoque_minimo - estoque_atual) as faltam
FROM produtos
WHERE estoque_atual > 0 AND estoque_atual < estoque_minimo
ORDER BY faltam DESC;
