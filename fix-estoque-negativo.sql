-- Script para corrigir estoques negativos

-- ⚠️ ATENÇÃO: Este script vai modificar dados!
-- Execute apenas se tiver certeza do que está fazendo

-- PASSO 1: Ver produtos com estoque negativo
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo,
    'Será zerado' as acao
FROM produtos
WHERE estoque_atual < 0
ORDER BY estoque_atual ASC;

-- PASSO 2: Zerar estoques negativos
-- Descomente a linha abaixo para executar
/*
UPDATE produtos
SET estoque_atual = 0
WHERE estoque_atual < 0;
*/

-- PASSO 3: Verificar se foi corrigido
/*
SELECT 
    id,
    nome,
    estoque_atual,
    estoque_minimo,
    CASE 
        WHEN estoque_atual < 0 THEN '❌ AINDA NEGATIVO'
        WHEN estoque_atual = 0 THEN '✅ ZERADO'
        ELSE '✅ OK'
    END as status
FROM produtos
ORDER BY estoque_atual ASC;
*/

-- ALTERNATIVA: Recalcular estoque baseado em entradas e saídas
-- Use este se quiser recalcular tudo do zero
/*
UPDATE produtos p
SET estoque_atual = (
    -- Soma todas as entradas
    SELECT COALESCE(SUM(e.quantidade), 0)
    FROM entradas_estoque e
    WHERE e.produto_id = p.id
) - (
    -- Subtrai todas as saídas (pedidos)
    SELECT COALESCE(SUM(ip.quantidade), 0)
    FROM itens_pedido ip
    WHERE ip.produto_id = p.id
);
*/
