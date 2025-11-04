-- ============================================
-- REMOVER ENTREGADOR ANTIGO (OPCIONAL)
-- ============================================

-- Query 1: Ver o entregador antigo
SELECT 
    id,
    nome,
    telefone,
    created_at
FROM entregadores
WHERE id = 'ent1760969471353';

-- Query 2: Verificar se tem pedidos atribuídos a ele
SELECT COUNT(*) as total_pedidos
FROM pedidos
WHERE entregador_id = 'ent1760969471353';

-- Query 3: REMOVER o entregador antigo (só execute se não tiver pedidos)
-- ATENÇÃO: Descomente a linha abaixo apenas se a Query 2 retornar 0
-- DELETE FROM entregadores WHERE id = 'ent1760969471353';

-- Query 4: Confirmar remoção
SELECT 
    id,
    nome
FROM entregadores
ORDER BY nome;
