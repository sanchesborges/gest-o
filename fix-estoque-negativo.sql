-- Corrigir produtos com estoque negativo

-- 1. Ver produtos com problema
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo
FROM produtos
WHERE estoque_atual < 0
ORDER BY estoque_atual ASC;

-- 2. OPÇÃO A: Zerar estoques negativos
-- (Use se quiser resetar para zero)
UPDATE produtos
SET estoque_atual = 0
WHERE estoque_atual < 0;

-- 3. OPÇÃO B: Definir estoque mínimo
-- (Use se quiser definir um valor específico)
-- UPDATE produtos
-- SET estoque_atual = estoque_minimo
-- WHERE estoque_atual < 0;

-- 4. OPÇÃO C: Definir valor específico
-- (Use se quiser definir um valor fixo, ex: 10)
-- UPDATE produtos
-- SET estoque_atual = 10
-- WHERE estoque_atual < 0;

-- 5. Verificar resultado
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
    END as status
FROM produtos
ORDER BY estoque_atual ASC, nome;
