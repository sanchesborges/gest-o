-- Script para verificar constraints e triggers na tabela produtos

-- 1. Ver todas as constraints da tabela produtos
SELECT
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    CASE con.contype
        WHEN 'c' THEN 'CHECK'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'u' THEN 'UNIQUE'
        WHEN 't' THEN 'TRIGGER'
        WHEN 'x' THEN 'EXCLUSION'
    END AS constraint_type_desc,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'produtos'
  AND nsp.nspname = 'public'
ORDER BY con.contype, con.conname;

-- 2. Ver triggers na tabela produtos
SELECT
    tgname AS trigger_name,
    tgtype AS trigger_type,
    tgenabled AS enabled,
    pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgrelid = 'public.produtos'::regclass
  AND tgisinternal = false
ORDER BY tgname;

-- 3. Ver triggers na tabela itens_pedido que podem afetar produtos
SELECT
    tgname AS trigger_name,
    tgtype AS trigger_type,
    tgenabled AS enabled,
    pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgrelid = 'public.itens_pedido'::regclass
  AND tgisinternal = false
ORDER BY tgname;

-- 4. Ver a definição completa da tabela produtos
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'produtos'
ORDER BY ordinal_position;
