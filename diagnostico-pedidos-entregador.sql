-- ============================================
-- DIAGNÓSTICO: Pedidos do Entregador
-- ============================================

-- 1. Ver todos os pedidos (SEM JOIN para evitar erro UUID)
SELECT 
  id,
  entregador_id,
  cliente_id,
  status,
  status_pagamento,
  valor_total,
  valor_pago,
  pagamento_parcial,
  data
FROM pedidos
WHERE entregador_id IS NOT NULL
ORDER BY data DESC;

-- 2. Ver apenas pedidos ENTREGUES com pagamento PENDENTE
SELECT 
  id,
  entregador_id,
  status,
  status_pagamento,
  valor_total,
  valor_pago,
  pagamento_parcial
FROM pedidos
WHERE entregador_id IS NOT NULL
  AND status = 'Entregue'
  AND status_pagamento IN ('Pendente', 'Atrasado')
  AND valor_total > 0
ORDER BY data DESC;

-- 3. Contar pedidos por status
SELECT 
  status,
  status_pagamento,
  COUNT(*) as quantidade,
  SUM(valor_total) as total
FROM pedidos
WHERE entregador_id IS NOT NULL
GROUP BY status, status_pagamento
ORDER BY status, status_pagamento;

-- 4. Ver pedidos de um entregador específico
-- SUBSTITUA 'ID_DO_ENTREGADOR' pelo ID real
SELECT 
  id,
  status,
  status_pagamento,
  valor_total,
  valor_pago,
  pagamento_parcial,
  data
FROM pedidos
WHERE entregador_id = 'ID_DO_ENTREGADOR'
ORDER BY data DESC;

-- 5. Ver se há pedidos com entrada mas ainda pendentes
SELECT 
  id,
  entregador_id,
  status,
  status_pagamento,
  valor_total as saldo_atual,
  valor_pago as entrada_recebida,
  (valor_total + COALESCE(valor_pago, 0)) as valor_original,
  pagamento_parcial
FROM pedidos
WHERE entregador_id IS NOT NULL
  AND pagamento_parcial = true
ORDER BY data DESC;

-- 6. Verificar tipos de dados das colunas
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'pedidos'
AND column_name IN ('id', 'entregador_id', 'cliente_id')
ORDER BY column_name;

-- 7. Ver todos os entregadores
SELECT 
  id,
  nome,
  telefone
FROM entregadores
ORDER BY nome;

-- 8. Contar pedidos por entregador (SEM JOIN)
SELECT 
  entregador_id,
  COUNT(*) as total_pedidos,
  SUM(CASE WHEN status = 'Entregue' THEN 1 ELSE 0 END) as entregues,
  SUM(CASE WHEN status_pagamento = 'Pendente' THEN 1 ELSE 0 END) as pendentes
FROM pedidos
WHERE entregador_id IS NOT NULL
GROUP BY entregador_id;
