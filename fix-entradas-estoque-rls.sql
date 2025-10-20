-- ============================================
-- FIX: Permitir inserções na tabela entradas_estoque
-- ============================================

-- Opção 1: DESABILITAR RLS (Mais rápido para testar)
-- Descomente a linha abaixo se quiser desabilitar completamente o RLS
-- ALTER TABLE entradas_estoque DISABLE ROW LEVEL SECURITY;

-- Opção 2: CRIAR POLÍTICAS RLS (Recomendado para produção)
-- Habilitar RLS
ALTER TABLE entradas_estoque ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir INSERT em entradas_estoque" ON entradas_estoque;
DROP POLICY IF EXISTS "Permitir SELECT em entradas_estoque" ON entradas_estoque;
DROP POLICY IF EXISTS "Permitir UPDATE em entradas_estoque" ON entradas_estoque;
DROP POLICY IF EXISTS "Permitir DELETE em entradas_estoque" ON entradas_estoque;

-- Criar política para permitir INSERT para todos
CREATE POLICY "Permitir INSERT em entradas_estoque"
ON entradas_estoque
FOR INSERT
TO public
WITH CHECK (true);

-- Criar política para permitir SELECT para todos
CREATE POLICY "Permitir SELECT em entradas_estoque"
ON entradas_estoque
FOR SELECT
TO public
USING (true);

-- Criar política para permitir UPDATE para todos
CREATE POLICY "Permitir UPDATE em entradas_estoque"
ON entradas_estoque
FOR UPDATE
TO public
USING (true);

-- Criar política para permitir DELETE para todos
CREATE POLICY "Permitir DELETE em entradas_estoque"
ON entradas_estoque
FOR DELETE
TO public
USING (true);

-- ============================================
-- TESTE: Inserir uma entrada de teste
-- ============================================

-- Inserir entrada de teste (usando gen_random_uuid() para gerar UUID)
INSERT INTO entradas_estoque (
    id,
    produto_id,
    quantidade,
    fornecedor,
    data_recebimento
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM produtos LIMIT 1),
    10,
    'Teste de Política RLS',
    now()
);

-- Verificar se foi inserido
SELECT 
    e.*,
    p.nome as produto_nome
FROM entradas_estoque e
LEFT JOIN produtos p ON e.produto_id = p.id
ORDER BY e.data_recebimento DESC 
LIMIT 5;

-- ============================================
-- VERIFICAÇÃO: Ver status do RLS
-- ============================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables
WHERE tablename = 'entradas_estoque';

-- Ver políticas existentes
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
WHERE tablename = 'entradas_estoque';
