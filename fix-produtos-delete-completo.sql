-- Script completo para corrigir exclusão de produtos
-- Este script resolve problemas de RLS e foreign keys

-- ============================================
-- PARTE 1: Ajustar Foreign Keys para CASCADE
-- ============================================

-- Remover constraints antigas e recriar com ON DELETE CASCADE
-- Isso permite que quando um produto for excluído, os registros relacionados também sejam

-- 1.1 Ajustar itens_pedido
ALTER TABLE itens_pedido 
DROP CONSTRAINT IF EXISTS itens_pedido_produto_id_fkey;

ALTER TABLE itens_pedido
ADD CONSTRAINT itens_pedido_produto_id_fkey 
FOREIGN KEY (produto_id) 
REFERENCES produtos(id) 
ON DELETE CASCADE;

-- 1.2 Ajustar entradas_estoque
ALTER TABLE entradas_estoque 
DROP CONSTRAINT IF EXISTS entradas_estoque_produto_id_fkey;

ALTER TABLE entradas_estoque
ADD CONSTRAINT entradas_estoque_produto_id_fkey 
FOREIGN KEY (produto_id) 
REFERENCES produtos(id) 
ON DELETE CASCADE;

-- ============================================
-- PARTE 2: Ajustar Políticas RLS
-- ============================================

-- 2.1 Remover políticas antigas de DELETE
DROP POLICY IF EXISTS "Permitir delete de produtos" ON produtos;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON produtos;
DROP POLICY IF EXISTS "Enable delete for all users" ON produtos;

-- 2.2 Criar nova política permissiva para DELETE
CREATE POLICY "Permitir delete de produtos para todos"
ON produtos
FOR DELETE
TO public
USING (true);

-- 2.3 Verificar se RLS está habilitado
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- 2.4 Garantir que as outras operações também funcionem
DROP POLICY IF EXISTS "Permitir select de produtos" ON produtos;
CREATE POLICY "Permitir select de produtos"
ON produtos
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Permitir insert de produtos" ON produtos;
CREATE POLICY "Permitir insert de produtos"
ON produtos
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir update de produtos" ON produtos;
CREATE POLICY "Permitir update de produtos"
ON produtos
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ============================================
-- PARTE 3: Verificações
-- ============================================

-- 3.1 Listar todas as políticas da tabela produtos
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'produtos';

-- 3.2 Verificar foreign keys
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND ccu.table_name = 'produtos';

-- 3.3 Listar produtos
SELECT id, nome, estoque_atual FROM produtos ORDER BY nome;

-- ============================================
-- PARTE 4: Teste de exclusão (comentado)
-- ============================================
-- Descomente as linhas abaixo para testar a exclusão

-- DELETE FROM produtos WHERE nome = 'Biscoito Polvilho';
-- DELETE FROM produtos WHERE nome = 'Pão de Queijo';
