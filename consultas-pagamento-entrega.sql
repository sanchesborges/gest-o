-- ============================================
-- CONSULTAS ÚTEIS: Pagamento na Entrega
-- ============================================

-- 1. Ver todos os pedidos com informações de pagamento
SELECT 
  p.id,
  c.nome as cliente,
  p.valor_total,
  p.valor_pago,
  p.pagamento_parcial,
  p.status,
  p.status_pagamento,
  p.data_pagamento
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
ORDER BY p.data DESC;

-- 2. Ver pedidos com pagamento parcial
SELECT 
  p.id,
  c.nome as cliente,
  p.valor_total as saldo_atual,
  p.valor_pago as entrada_recebida,
  (p.valor_total + p.valor_pago) as valor_original,
  p.data_pagamento
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE p.pagamento_parcial = true
ORDER BY p.data DESC;

-- 3. Resumo financeiro do dia
SELECT 
  COUNT(*) as total_pedidos,
  SUM(CASE WHEN status_pagamento = 'Pago' THEN valor_total ELSE 0 END) as total_pago,
  SUM(CASE WHEN status_pagamento = 'Pendente' THEN valor_total ELSE 0 END) as total_pendente,
  SUM(CASE WHEN pagamento_parcial = true THEN valor_pago ELSE 0 END) as total_entradas
FROM pedidos
WHERE DATE(data) = CURRENT_DATE;

-- 4. Clientes com saldo devedor
SELECT 
  c.nome as cliente,
  c.telefone,
  COUNT(p.id) as qtd_pedidos_pendentes,
  SUM(p.valor_total) as saldo_devedor
FROM clientes c
JOIN pedidos p ON c.id = p.cliente_id
WHERE p.status_pagamento IN ('Pendente', 'Atrasado')
GROUP BY c.id, c.nome, c.telefone
ORDER BY saldo_devedor DESC;

-- 5. Histórico de entradas recebidas
SELECT 
  p.id,
  c.nome as cliente,
  p.valor_pago as entrada,
  p.data_pagamento,
  p.valor_total as saldo_restante
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE p.valor_pago > 0 AND p.pagamento_parcial = true
ORDER BY p.data_pagamento DESC;

-- 6. Pedidos pagos integralmente na entrega
SELECT 
  p.id,
  c.nome as cliente,
  p.valor_total as valor_pago,
  p.data_pagamento,
  e.nome as entregador
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN entregadores e ON p.entregador_id::text = e.id::text
WHERE p.status_pagamento = 'Pago' 
  AND p.data_pagamento IS NOT NULL
ORDER BY p.data_pagamento DESC;

-- 7. Resumo por entregador (hoje)
SELECT 
  e.nome as entregador,
  COUNT(p.id) as entregas_realizadas,
  SUM(CASE WHEN p.status_pagamento = 'Pago' THEN p.valor_total ELSE 0 END) as recebido,
  SUM(CASE WHEN p.pagamento_parcial = true THEN p.valor_pago ELSE 0 END) as entradas,
  SUM(CASE WHEN p.status_pagamento = 'Pendente' THEN p.valor_total ELSE 0 END) as pendente
FROM entregadores e
LEFT JOIN pedidos p ON e.id::text = p.entregador_id::text AND DATE(p.data) = CURRENT_DATE
GROUP BY e.id, e.nome
ORDER BY entregas_realizadas DESC;

-- 8. Pedidos com maior saldo devedor
SELECT 
  p.id,
  c.nome as cliente,
  p.valor_total as saldo_devedor,
  p.valor_pago as entrada_recebida,
  (p.valor_total + p.valor_pago) as valor_original,
  p.data,
  CURRENT_DATE - DATE(p.data) as dias_pendente
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE p.status_pagamento = 'Pendente'
ORDER BY p.valor_total DESC
LIMIT 10;

-- 9. Taxa de pagamento na entrega (últimos 30 dias)
SELECT 
  COUNT(*) as total_entregas,
  SUM(CASE WHEN status_pagamento = 'Pago' THEN 1 ELSE 0 END) as pagas_na_entrega,
  SUM(CASE WHEN pagamento_parcial = true THEN 1 ELSE 0 END) as com_entrada,
  SUM(CASE WHEN status_pagamento = 'Pendente' AND valor_pago = 0 THEN 1 ELSE 0 END) as nao_pagas,
  ROUND(
    (SUM(CASE WHEN status_pagamento = 'Pago' THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 
    2
  ) as taxa_pagamento_percentual
FROM pedidos
WHERE data >= CURRENT_DATE - INTERVAL '30 days'
  AND status = 'Entregue';

-- 10. Valor médio de entradas
SELECT 
  COUNT(*) as qtd_entradas,
  AVG(valor_pago) as media_entrada,
  MIN(valor_pago) as menor_entrada,
  MAX(valor_pago) as maior_entrada,
  SUM(valor_pago) as total_entradas
FROM pedidos
WHERE pagamento_parcial = true
  AND valor_pago > 0;

-- 11. Clientes que sempre pagam na entrega
SELECT 
  c.nome as cliente,
  COUNT(p.id) as total_pedidos,
  SUM(CASE WHEN p.status_pagamento = 'Pago' THEN 1 ELSE 0 END) as pedidos_pagos,
  ROUND(
    (SUM(CASE WHEN p.status_pagamento = 'Pago' THEN 1 ELSE 0 END)::numeric / COUNT(p.id)::numeric) * 100,
    2
  ) as taxa_pagamento
FROM clientes c
JOIN pedidos p ON c.id = p.cliente_id
WHERE p.status = 'Entregue'
GROUP BY c.id, c.nome
HAVING COUNT(p.id) >= 3
ORDER BY taxa_pagamento DESC;

-- 12. Evolução de pagamentos por mês
SELECT 
  TO_CHAR(data, 'YYYY-MM') as mes,
  COUNT(*) as total_entregas,
  SUM(CASE WHEN status_pagamento = 'Pago' THEN 1 ELSE 0 END) as pagas,
  SUM(CASE WHEN pagamento_parcial = true THEN 1 ELSE 0 END) as com_entrada,
  SUM(CASE WHEN status_pagamento = 'Pago' THEN valor_total ELSE 0 END) as valor_recebido,
  SUM(CASE WHEN pagamento_parcial = true THEN valor_pago ELSE 0 END) as valor_entradas
FROM pedidos
WHERE status = 'Entregue'
GROUP BY TO_CHAR(data, 'YYYY-MM')
ORDER BY mes DESC;

-- 13. Atualizar pedido para pago (manualmente)
-- USE COM CUIDADO!
-- UPDATE pedidos 
-- SET 
--   status_pagamento = 'Pago',
--   valor_pago = valor_total,
--   data_pagamento = CURRENT_TIMESTAMP,
--   pagamento_parcial = false
-- WHERE id = 'ID_DO_PEDIDO';

-- 14. Registrar entrada adicional (manualmente)
-- USE COM CUIDADO!
-- UPDATE pedidos 
-- SET 
--   valor_pago = valor_pago + 50.00,  -- Adicionar mais R$ 50
--   valor_total = valor_total - 50.00, -- Abater do saldo
--   data_pagamento = CURRENT_TIMESTAMP
-- WHERE id = 'ID_DO_PEDIDO';

-- 15. Ver pedidos que precisam de cobrança (vencidos)
SELECT 
  p.id,
  c.nome as cliente,
  c.telefone,
  p.valor_total as saldo_devedor,
  p.data_vencimento_pagamento as vencimento,
  CURRENT_DATE - p.data_vencimento_pagamento as dias_atraso
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE p.status_pagamento = 'Atrasado'
ORDER BY dias_atraso DESC;

-- 16. Relatório completo de um cliente específico
-- Substitua 'NOME_DO_CLIENTE' pelo nome real
SELECT 
  p.id,
  p.data,
  p.valor_total as saldo_atual,
  p.valor_pago as entrada,
  p.status,
  p.status_pagamento,
  p.data_pagamento,
  e.nome as entregador
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN entregadores e ON p.entregador_id::text = e.id::text
WHERE c.nome ILIKE '%NOME_DO_CLIENTE%'
ORDER BY p.data DESC;

-- 17. Dashboard financeiro completo
SELECT 
  'Total Pedidos' as metrica,
  COUNT(*)::text as valor
FROM pedidos
WHERE status = 'Entregue'

UNION ALL

SELECT 
  'Total Pago',
  'R$ ' || TO_CHAR(SUM(valor_total), 'FM999,999,990.00')
FROM pedidos
WHERE status_pagamento = 'Pago'

UNION ALL

SELECT 
  'Total Pendente',
  'R$ ' || TO_CHAR(SUM(valor_total), 'FM999,999,990.00')
FROM pedidos
WHERE status_pagamento IN ('Pendente', 'Atrasado')

UNION ALL

SELECT 
  'Total Entradas',
  'R$ ' || TO_CHAR(SUM(valor_pago), 'FM999,999,990.00')
FROM pedidos
WHERE pagamento_parcial = true

UNION ALL

SELECT 
  'Taxa Pagamento',
  TO_CHAR(
    (COUNT(CASE WHEN status_pagamento = 'Pago' THEN 1 END)::numeric / 
     COUNT(*)::numeric) * 100,
    'FM990.00'
  ) || '%'
FROM pedidos
WHERE status = 'Entregue';

-- 18. Limpar dados de teste (USE COM MUITO CUIDADO!)
-- DELETE FROM pedidos WHERE id IN ('id1', 'id2', 'id3');

-- 19. Resetar pagamento de um pedido (USE COM CUIDADO!)
-- UPDATE pedidos 
-- SET 
--   valor_pago = 0,
--   pagamento_parcial = false,
--   data_pagamento = NULL,
--   status_pagamento = 'Pendente'
-- WHERE id = 'ID_DO_PEDIDO';

-- 20. Backup de dados de pagamento
SELECT 
  p.id,
  p.cliente_id,
  c.nome as cliente_nome,
  p.valor_total,
  p.valor_pago,
  p.pagamento_parcial,
  p.status_pagamento,
  p.data_pagamento,
  p.data,
  p.status
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE p.valor_pago > 0 OR p.status_pagamento = 'Pago'
ORDER BY p.data DESC;
