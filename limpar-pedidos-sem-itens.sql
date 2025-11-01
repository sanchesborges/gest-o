-- Script para limpar pedidos sem itens e restaurar estoque

-- PASSO 1: Ver pedidos sem itens e calcular estoque a restaurar
SELECT 
    ped.id as pedido_id,
    ped.data,
    ped.valor_total,
    ped.status,
    'Será deletado' as acao
FROM pedidos ped
LEFT JOIN itens_pedido ip ON ip.pedido_id = ped.id
WHERE ip.id IS NULL
ORDER BY ped.data DESC;

-- PASSO 2: Deletar pedidos sem itens
-- ⚠️ ATENÇÃO: Isso vai deletar os pedidos que não têm itens
-- Descomente para executar:
/*
DELETE FROM pedidos
WHERE id IN (
    SELECT ped.id
    FROM pedidos ped
    LEFT JOIN itens_pedido ip ON ip.pedido_id = ped.id
    WHERE ip.id IS NULL
);
*/

-- PASSO 3: Recalcular estoques baseado em entradas e saídas reais
-- Isso vai corrigir qualquer inconsistência
/*
UPDATE produtos p
SET estoque_atual = (
    SELECT COALESCE(SUM(e.quantidade), 0)
    FROM entradas_estoque e
    WHERE e.produto_id = p.id
) - (
    SELECT COALESCE(SUM(ip.quantidade), 0)
    FROM itens_pedido ip
    WHERE ip.produto_id = p.id
);
*/

-- PASSO 4: Verificar se foi corrigido
/*
SELECT 
    nome,
    estoque_atual,
    estoque_minimo,
    CASE 
        WHEN estoque_atual < 0 THEN '❌ NEGATIVO'
        WHEN estoque_atual = 0 THEN '⚠️ ZERADO'
        ELSE '✅ OK'
    END as status
FROM produtos
ORDER BY estoque_atual ASC;
*/
