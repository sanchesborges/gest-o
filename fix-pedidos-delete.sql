-- Script para corrigir exclusão de pedidos
-- Ajustar Foreign Keys e Políticas RLS

-- ============================================
-- PARTE 1: Ajustar Foreign Keys para CASCADE
-- ============================================

-- 1.1 Ajustar itens_pedido (já deve estar configurado, mas vamos garantir)
ALTER TABLE itens_pedido 
DROP CONSTRAINT IF EXISTS itens_pedido_pedido_id_fkey;

ALTER TABLE itens_pedido
ADD CONSTRAINT itens_pedido_pedido_id_fkey 
FOREIGN KEY (pedido_id) 
REFERENCES pedidos(id) 
ON DELETE CASCADE;

-- 1.2 Ajustar pagamentos
ALTER TABLE pagamentos 
DROP CONSTRAINT IF EXISTS pagamentos_pedido_id_fkey;

ALTER TABLE pagamentos
ADD CONSTRAINT pagamentos_pedido_id_fkey 
FOREIGN KEY (pedido_id) 
REFERENCES pedidos(id) 
ON DELETE CASCADE;

-- ============================================
-- PARTE 2: Ajustar Políticas RLS para Pedidos
-- ============================================

-- 2.1 Remover políticas antigas de DELETE
DROP POLICY IF EXISTS "Permitir delete de pedidos" ON pedidos;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON pedidos;
DROP POLICY IF EXISTS "Enable delete for all users" ON pedidos;

-- 2.2 Criar nova política permissiva para DELETE
CREATE POLICY "Permitir delete de pedidos para todos"
ON pedidos
FOR DELETE
TO public
USING (true);

-- 2.3 Garantir que as outras operações também funcionem
DROP POLICY IF EXISTS "Permitir select de pedidos" ON pedidos;
CREATE POLICY "Permitir select de pedidos"
ON pedidos
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Permitir insert de pedidos" ON pedidos;
CREATE POLICY "Permitir insert de pedidos"
ON pedidos
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir update de pedidos" ON pedidos;
CREATE POLICY "Permitir update de pedidos"
ON pedidos
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ============================================
-- PARTE 3: Políticas RLS para Itens de Pedido
-- ============================================

-- 3.1 Garantir que itens_pedido também permita DELETE
DROP POLICY IF EXISTS "Permitir delete de itens_pedido" ON itens_pedido;
CREATE POLICY "Permitir delete de itens_pedido"
ON itens_pedido
FOR DELETE
TO public
USING (true);

-- ============================================
-- PARTE 4: Políticas RLS para Pagamentos
-- ============================================

-- 4.1 Garantir que pagamentos também permita DELETE
DROP POLICY IF EXISTS "Permitir delete de pagamentos" ON pagamentos;
CREATE POLICY "Permitir delete de pagamentos"
ON pagamentos
FOR DELETE
TO public
USING (true);

-- ============================================
-- PARTE 5: Verificações
-- ============================================

-- 5.1 Listar todas as políticas da tabela pedidos
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('pedidos', 'itens_pedido', 'pagamentos')
ORDER BY tablename, policyname;

-- 5.2 Verificar foreign keys
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
    AND ccu.table_name = 'pedidos';

-- 5.3 Contar pedidos
SELECT COUNT(*) as total_pedidos FROM pedidos;

-- ============================================
-- PARTE 6: Teste de exclusão (comentado)
-- ============================================
-- Descomente as linhas abaixo para testar a exclusão

-- DELETE FROM pedidos WHERE id = 'ID_DO_PEDIDO_AQUI';
