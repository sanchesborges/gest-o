-- ============================================
-- VERIFICAR TIPOS DE DADOS DAS COLUNAS
-- ============================================

-- Query 1: Verificar tipo da coluna id em entregadores
SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'entregadores'
AND column_name = 'id';

-- Query 2: Verificar tipo da coluna entregador_id em pedidos
SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'pedidos'
AND column_name = 'entregador_id';

-- Query 3: Ver os IDs dos entregadores e seus tipos
SELECT 
    id,
    nome,
    pg_typeof(id) as tipo_id
FROM entregadores;

-- Query 4: Ver os entregador_id dos pedidos e seus tipos
SELECT DISTINCT
    entregador_id,
    pg_typeof(entregador_id) as tipo_entregador_id
FROM pedidos
WHERE entregador_id IS NOT NULL;
