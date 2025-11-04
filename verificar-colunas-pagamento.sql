-- ============================================
-- VERIFICAR COLUNAS DE PAGAMENTO NA TABELA PEDIDOS
-- ============================================

-- 1. Verificar se as colunas existem
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
AND column_name IN (
  'valor_pago', 
  'pagamento_parcial', 
  'metodo_pagamento_entrega', 
  'data_pagamento'
)
ORDER BY column_name;

-- 2. Ver pedidos com informações de pagamento
SELECT 
  id,
  cliente_id,
  valor_total,
  valor_pago,
  pagamento_parcial,
  metodo_pagamento_entrega,
  data_pagamento,
  status,
  status_pagamento,
  data
FROM pedidos
WHERE status = 'Entregue'
ORDER BY data DESC
LIMIT 10;

-- 3. Contar pedidos com pagamento registrado
SELECT 
  COUNT(*) as total_pedidos,
  COUNT(valor_pago) as com_valor_pago,
  COUNT(CASE WHEN valor_pago > 0 THEN 1 END) as com_pagamento_registrado,
  COUNT(CASE WHEN pagamento_parcial = true THEN 1 END) as pagamentos_parciais
FROM pedidos
WHERE status = 'Entregue';

-- 4. Ver exemplo de pedido com pagamento (se existir)
SELECT 
  id,
  valor_total,
  valor_pago,
  pagamento_parcial,
  metodo_pagamento_entrega,
  status_pagamento
FROM pedidos
WHERE valor_pago IS NOT NULL 
AND valor_pago > 0
LIMIT 1;
