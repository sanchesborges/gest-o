-- ============================================
-- CONSULTAS ESSENCIAIS: Pagamento na Entrega
-- Versão Simplificada e Testada
-- ============================================

-- IMPORTANTE: Estas consultas foram testadas e funcionam!
-- Use estas para relatórios diários

-- ============================================
-- 1. RESUMO FINANCEIRO DO DIA
-- ============================================
-- Use esta consulta todo dia para ver o resumo
SELECT 
  COUNT(*) as total_pedidos,
  SUM(CASE WHEN status_pagamento = 'Pago' THEN valor_total ELSE 0 END) as total_pago,
  SUM(CASE WHEN status_pagamento = 'Pendente' THEN valor_total ELSE 0 END) as total_pendente,
  SUM(CASE WHEN pagamento_parcial = true THEN COALESCE(valor_pago, 0) ELSE 0 END) as total_entradas
FROM pedidos
WHERE DATE(data) = CURRENT_DATE;

-- ============================================
-- 2. CLIENTES COM SALDO DEVEDOR
-- ============================================
-- Veja quem ainda deve
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

-- ============================================
-- 3. PEDIDOS COM PAGAMENTO PARCIAL
-- ============================================
-- Veja quem deu entrada
SELECT 
  p.id,
  c.nome as cliente,
  p.valor_total as saldo_atual,
  COALESCE(p.valor_pago, 0) as entrada_recebida,
  (p.valor_total + COALESCE(p.valor_pago, 0)) as valor_original,
  p.data_pagamento
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE p.pagamento_parcial = true
ORDER BY p.data DESC;

-- ============================================
-- 4. HISTÓRICO DE ENTRADAS
-- ============================================
-- Todas as entradas recebidas
SELECT 
  p.id,
  c.nome as cliente,
  COALESCE(p.valor_pago, 0) as entrada,
  p.data_pagamento,
  p.valor_total as saldo_restante
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE p.valor_pago > 0 AND p.pagamento_parcial = true
ORDER BY p.data_pagamento DESC;

-- ============================================
-- 5. TAXA DE PAGAMENTO (ÚLTIMOS 30 DIAS)
-- ============================================
-- Veja quantos % pagam na entrega
SELECT 
  COUNT(*) as total_entregas,
  SUM(CASE WHEN status_pagamento = 'Pago' THEN 1 ELSE 0 END) as pagas_na_entrega,
  SUM(CASE WHEN pagamento_parcial = true THEN 1 ELSE 0 END) as com_entrada,
  SUM(CASE WHEN status_pagamento = 'Pendente' AND COALESCE(valor_pago, 0) = 0 THEN 1 ELSE 0 END) as nao_pagas,
  ROUND(
    (SUM(CASE WHEN status_pagamento = 'Pago' THEN 1 ELSE 0 END)::numeric / 
     NULLIF(COUNT(*), 0)::numeric) * 100, 
    2
  ) as taxa_pagamento_percentual
FROM pedidos
WHERE data >= CURRENT_DATE - INTERVAL '30 days'
  AND status = 'Entregue';

-- ============================================
-- 6. DASHBOARD COMPLETO
-- ============================================
-- Resumo geral do sistema
SELECT 
  'Total Pedidos Entregues' as metrica,
  COUNT(*)::text as valor
FROM pedidos
WHERE status = 'Entregue'

UNION ALL

SELECT 
  'Total Pago',
  'R$ ' || TO_CHAR(COALESCE(SUM(valor_total), 0), 'FM999,999,990.00')
FROM pedidos
WHERE status_pagamento = 'Pago'

UNION ALL

SELECT 
  'Total Pendente',
  'R$ ' || TO_CHAR(COALESCE(SUM(valor_total), 0), 'FM999,999,990.00')
FROM pedidos
WHERE status_pagamento IN ('Pendente', 'Atrasado')

UNION ALL

SELECT 
  'Total Entradas Recebidas',
  'R$ ' || TO_CHAR(COALESCE(SUM(valor_pago), 0), 'FM999,999,990.00')
FROM pedidos
WHERE pagamento_parcial = true

UNION ALL

SELECT 
  'Taxa de Pagamento',
  COALESCE(
    TO_CHAR(
      (COUNT(CASE WHEN status_pagamento = 'Pago' THEN 1 END)::numeric / 
       NULLIF(COUNT(*), 0)::numeric) * 100,
      'FM990.00'
    ) || '%',
    '0%'
  )
FROM pedidos
WHERE status = 'Entregue';

-- ============================================
-- 7. PEDIDOS VENCIDOS (PRECISAM COBRANÇA)
-- ============================================
-- Quem está atrasado
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

-- ============================================
-- 8. VALOR MÉDIO DE ENTRADAS
-- ============================================
-- Estatísticas de entradas
SELECT 
  COUNT(*) as qtd_entradas,
  ROUND(AVG(valor_pago)::numeric, 2) as media_entrada,
  MIN(valor_pago) as menor_entrada,
  MAX(valor_pago) as maior_entrada,
  SUM(valor_pago) as total_entradas
FROM pedidos
WHERE pagamento_parcial = true
  AND valor_pago > 0;

-- ============================================
-- 9. PEDIDOS DE UM CLIENTE ESPECÍFICO
-- ============================================
-- Substitua 'João' pelo nome do cliente
SELECT 
  p.id,
  p.data,
  p.valor_total as saldo_atual,
  COALESCE(p.valor_pago, 0) as entrada,
  p.status,
  p.status_pagamento,
  p.data_pagamento
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE c.nome ILIKE '%João%'  -- MUDE AQUI
ORDER BY p.data DESC;

-- ============================================
-- 10. TODOS OS PEDIDOS COM PAGAMENTO
-- ============================================
-- Visão completa
SELECT 
  p.id,
  c.nome as cliente,
  p.data,
  p.valor_total,
  COALESCE(p.valor_pago, 0) as valor_pago,
  p.pagamento_parcial,
  p.status,
  p.status_pagamento,
  p.data_pagamento
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
ORDER BY p.data DESC
LIMIT 50;

-- ============================================
-- COMANDOS ÚTEIS
-- ============================================

-- Ver estrutura da tabela pedidos
-- SELECT column_name, data_type 
-- FROM information_schema.columns
-- WHERE table_name = 'pedidos'
-- ORDER BY column_name;

-- Verificar dados inconsistentes
-- SELECT 
--   id,
--   valor_total,
--   valor_pago,
--   pagamento_parcial,
--   status_pagamento,
--   CASE 
--     WHEN pagamento_parcial = true AND COALESCE(valor_pago, 0) = 0 THEN 'Erro: Marcado como parcial mas sem valor'
--     WHEN pagamento_parcial = false AND COALESCE(valor_pago, 0) > 0 THEN 'Aviso: Tem valor mas não marcado como parcial'
--     WHEN status_pagamento = 'Pago' AND COALESCE(valor_pago, 0) = 0 THEN 'Erro: Marcado como pago mas sem valor'
--     ELSE 'OK'
--   END as status_validacao
-- FROM pedidos
-- WHERE valor_pago IS NOT NULL OR pagamento_parcial IS NOT NULL;

-- ============================================
-- DICAS DE USO
-- ============================================

-- 1. Execute a consulta #1 todo dia de manhã
-- 2. Use a consulta #2 para fazer cobranças
-- 3. Use a consulta #7 para pedidos vencidos
-- 4. Use a consulta #6 para relatório semanal
-- 5. Use a consulta #9 para ver histórico de um cliente

-- ============================================
-- FIM
-- ============================================
