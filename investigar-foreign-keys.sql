-- Investigar foreign keys e suas constraints

-- 1. Ver todas as foreign keys da tabela itens_pedido
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'itens_pedido'
    AND tc.table_schema = 'public';

-- 2. Ver se há triggers em itens_pedido que validam estoque
SELECT
    t.tgname AS trigger_name,
    t.tgenabled AS enabled,
    pg_get_triggerdef(t.oid) AS trigger_definition
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
WHERE c.relname = 'itens_pedido'
    AND t.tgisinternal = false;

-- 3. Ver se há funções relacionadas a validação de estoque
SELECT
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND (
        routine_name LIKE '%estoque%'
        OR routine_name LIKE '%validar%'
        OR routine_name LIKE '%check%'
        OR routine_definition LIKE '%estoque_atual%'
    )
ORDER BY routine_name;
