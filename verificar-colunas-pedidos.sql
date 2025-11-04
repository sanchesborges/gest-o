-- ============================================
-- VERIFICAR ESTRUTURA DA TABELA PEDIDOS
-- ============================================

-- Query 1: Ver todas as colunas da tabela pedidos
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos'
ORDER BY ordinal_position;

-- Query 2: Ver um pedido completo para entender a estrutura
SELECT *
FROM pedidos
LIMIT 1;
