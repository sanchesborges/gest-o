-- Script para verificar se há triggers ou funções que podem estar duplicando o estoque

-- 1. Verificar todos os triggers na tabela entradas_estoque
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table IN ('entradas_estoque', 'produtos', 'itens_pedido')
ORDER BY event_object_table, trigger_name;

-- 2. Verificar funções relacionadas a estoque
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (
    routine_name LIKE '%estoque%' 
    OR routine_name LIKE '%entrada%'
    OR routine_definition LIKE '%estoque_atual%'
  )
ORDER BY routine_name;

-- 3. Verificar políticas RLS (Row Level Security) que podem afetar
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('entradas_estoque', 'produtos', 'itens_pedido')
ORDER BY tablename, policyname;
