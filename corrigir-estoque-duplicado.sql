-- ⚠️ CORREÇÃO DE ESTOQUE DUPLICADO
-- Execute este script no Supabase SQL Editor para corrigir os estoques

-- PASSO 1: Ver o problema atual
SELECT 
    p.id,
    p.nome,
    p.estoque_atual as estoque_incorreto,
    COALESCE(SUM(e.quantidade), 0) as soma_entradas,
    COALESCE(SUM(ip.quantidade), 0) as soma_saidas,
    COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0) as estoque_correto,
    p.estoque_atual - (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON e.produto_id = p.id
LEFT JOIN itens_pedido ip ON ip.produto_id = p.id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- PASSO 2: Corrigir os estoques
-- Este comando vai recalcular o estoque baseado nas entradas e saídas reais
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

-- PASSO 3: Verificar se foi corrigido
SELECT 
    p.id,
    p.nome,
    p.estoque_atual as estoque_corrigido,
    COALESCE(SUM(e.quantidade), 0) as soma_entradas,
    COALESCE(SUM(ip.quantidade), 0) as soma_saidas,
    COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0) as estoque_calculado,
    p.estoque_atual - (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON e.produto_id = p.id
LEFT JOIN itens_pedido ip ON ip.produto_id = p.id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;

-- ✅ Se a coluna "diferenca" mostrar 0 para todos os produtos, está corrigido!
