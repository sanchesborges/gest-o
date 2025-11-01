-- Verificar estrutura da tabela pedidos
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos'
ORDER BY ordinal_position;

-- Verificar estrutura da tabela itens_pedido
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'itens_pedido'
ORDER BY ordinal_position;

-- Verificar se há pedidos salvos
SELECT COUNT(*) as total_pedidos FROM pedidos;

-- Verificar últimos pedidos
SELECT id, cliente_id, data, valor_total, status
FROM pedidos
ORDER BY created_at DESC
LIMIT 5;

-- Verificar itens dos últimos pedidos
SELECT ip.*, p.nome as produto_nome
FROM itens_pedido ip
LEFT JOIN produtos p ON ip.produto_id = p.id
ORDER BY ip.created_at DESC
LIMIT 10;
