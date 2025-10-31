-- Script para corrigir inserção de produtos
-- Verificar e ajustar políticas RLS

-- ============================================
-- PARTE 1: Verificar Políticas RLS Atuais
-- ============================================

-- 1.1 Listar todas as políticas da tabela produtos
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
WHERE tablename = 'produtos'
ORDER BY cmd;

-- ============================================
-- PARTE 2: Ajustar Políticas RLS para INSERT
-- ============================================

-- 2.1 Remover políticas antigas de INSERT
DROP POLICY IF EXISTS "Permitir insert de produtos" ON produtos;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON produtos;
DROP POLICY IF EXISTS "Enable insert for all users" ON produtos;

-- 2.2 Criar nova política permissiva para INSERT
CREATE POLICY "Permitir insert de produtos para todos"
ON produtos
FOR INSERT
TO public
WITH CHECK (true);

-- 2.3 Garantir que SELECT também funcione
DROP POLICY IF EXISTS "Permitir select de produtos" ON produtos;
CREATE POLICY "Permitir select de produtos"
ON produtos
FOR SELECT
TO public
USING (true);

-- 2.4 Garantir que UPDATE também funcione
DROP POLICY IF EXISTS "Permitir update de produtos" ON produtos;
CREATE POLICY "Permitir update de produtos"
ON produtos
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 2.5 Garantir que DELETE também funcione
DROP POLICY IF EXISTS "Permitir delete de produtos para todos" ON produtos;
CREATE POLICY "Permitir delete de produtos para todos"
ON produtos
FOR DELETE
TO public
USING (true);

-- ============================================
-- PARTE 3: Verificar RLS está habilitado
-- ============================================

-- 3.1 Habilitar RLS na tabela produtos
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PARTE 4: Verificar estrutura da tabela
-- ============================================

-- 4.1 Verificar colunas da tabela produtos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'produtos'
ORDER BY ordinal_position;

-- ============================================
-- PARTE 5: Testar inserção (comentado)
-- ============================================
-- Descomente as linhas abaixo para testar a inserção

/*
INSERT INTO produtos (
    id,
    nome,
    tipo,
    tamanho_pacote,
    preco_unitario,
    estoque_minimo,
    estoque_atual
) VALUES (
    'test_' || gen_random_uuid()::text,
    'Produto Teste',
    'Pão de Queijo',
    '1kg',
    25.00,
    10,
    0
);

-- Verificar se foi inserido
SELECT * FROM produtos WHERE nome = 'Produto Teste';

-- Remover produto de teste
DELETE FROM produtos WHERE nome = 'Produto Teste';
*/

-- ============================================
-- PARTE 6: Verificar políticas finais
-- ============================================

SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies
WHERE tablename = 'produtos'
ORDER BY cmd;
