-- ============================================
-- FIX SIMPLES: Permitir inserções na tabela entradas_estoque
-- ============================================

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
-- TESTE: Inserir uma entrada de teste (SEM especificar ID)
-- ============================================

-- Inserir entrada de teste (deixando o Supabase gerar o ID automaticamente)
INSERT INTO entradas_estoque (
    produto_id,
    quantidade,
    fornecedor,
    data_recebimento
) VALUES (
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
