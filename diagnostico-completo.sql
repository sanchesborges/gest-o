-- 🚨 DIAGNÓSTICO COMPLETO - Execute este script e me envie os resultados

-- ========================================
-- 1. VERIFICAR ESTOQUE ATUAL DOS PRODUTOS
-- ========================================
SELECT 
    '=== ESTOQUE ATUAL ===' as secao,
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
ORDER BY estoque_atual ASC;

-- ========================================
-- 2. VERIFICAR TRIGGERS EM ITENS_PEDIDO
-- ========================================
SELECT
    '=== TRIGGERS EM ITENS_PEDIDO ===' as secao,
    tgname AS trigger_name,
    CASE tgtype
        WHEN 1 THEN 'BEFORE INSERT'
        WHEN 2 THEN 'AFTER INSERT'
        WHEN 3 THEN 'BEFORE UPDATE'
        WHEN 4 THEN 'AFTER UPDATE'
        WHEN 5 THEN 'BEFORE DELETE'
        WHEN 6 THEN 'AFTER DELETE'
        ELSE 'OTHER'
    END as trigger_type,
    tgenabled AS enabled,
    pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgrelid = 'public.itens_pedido'::regclass
  AND tgisinternal = false;

-- ========================================
-- 3. VERIFICAR TRIGGERS EM PRODUTOS
-- ========================================
SELECT
    '=== TRIGGERS EM PRODUTOS ===' as secao,
    tgname AS trigger_name,
    CASE tgtype
        WHEN 1 THEN 'BEFORE INSERT'
        WHEN 2 THEN 'AFTER INSERT'
        WHEN 3 THEN 'BEFORE UPDATE'
        WHEN 4 THEN 'AFTER UPDATE'
        WHEN 5 THEN 'BEFORE DELETE'
        WHEN 6 THEN 'AFTER DELETE'
        ELSE 'OTHER'
    END as trigger_type,
    tgenabled AS enabled,
    pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgrelid = 'public.produtos'::regclass
  AND tgisinternal = false;

-- ========================================
-- 4. VERIFICAR CONSTRAINT NA TABELA PRODUTOS
-- ========================================
SELECT
    '=== CONSTRAINTS EM PRODUTOS ===' as secao,
    con.conname AS constraint_name,
    CASE con.contype
        WHEN 'c' THEN 'CHECK'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'u' THEN 'UNIQUE'
    END AS constraint_type,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'produtos'
  AND con.contype = 'c'
ORDER BY con.conname;

-- ========================================
-- 5. VERIFICAR ÚLTIMOS PEDIDOS E ITENS
-- ========================================
SELECT
    '=== ÚLTIMOS 5 PEDIDOS ===' as secao,
    ped.id as pedido_id,
    ped.data,
    ped.status,
    COUNT(ip.id) as total_itens
FROM pedidos ped
LEFT JOIN itens_pedido ip ON ip.pedido_id = ped.id
GROUP BY ped.id, ped.data, ped.status
ORDER BY ped.data DESC
LIMIT 5;

-- ========================================
-- 6. VERIFICAR SE HÁ PEDIDOS SEM ITENS
-- ========================================
SELECT
    '=== PEDIDOS SEM ITENS ===' as secao,
    ped.id as pedido_id,
    ped.data,
    ped.status,
    ped.valor_total
FROM pedidos ped
LEFT JOIN itens_pedido ip ON ip.pedido_id = ped.id
WHERE ip.id IS NULL
ORDER BY ped.data DESC
LIMIT 10;
