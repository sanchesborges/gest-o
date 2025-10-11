-- =====================================================
-- SHIRLEY - Queries Úteis
-- Consultas SQL comuns para análise e relatórios
-- =====================================================

-- =====================================================
-- PRODUTOS
-- =====================================================

-- Listar todos os produtos com estoque baixo
SELECT 
  nome,
  tipo,
  tamanho_pacote,
  estoque_atual,
  estoque_minimo,
  (estoque_minimo - estoque_atual) AS faltando
FROM produtos
WHERE estoque_atual < estoque_minimo
ORDER BY (estoque_minimo - estoque_atual) DESC;

-- Produtos mais vendidos (por quantidade)
SELECT 
  p.nome,
  p.tamanho_pacote,
  SUM(ip.quantidade) AS total_vendido,
  COUNT(DISTINCT ip.pedido_id) AS num_pedidos
FROM produtos p
JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, p.tamanho_pacote
ORDER BY total_vendido DESC
LIMIT 10;

-- Valor total em estoque
SELECT 
  SUM(estoque_atual * preco_padrao) AS valor_total_estoque
FROM produtos;

-- =====================================================
-- CLIENTES
-- =====================================================

-- Top 10 clientes por valor total de pedidos
SELECT 
  c.nome,
  c.tipo,
  COUNT(p.id) AS total_pedidos,
  SUM(p.valor_total) AS valor_total,
  AVG(p.valor_total) AS ticket_medio
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.id, c.nome, c.tipo
ORDER BY valor_total DESC
LIMIT 10;

-- Clientes com pagamentos atrasados
SELECT 
  c.nome,
  c.telefone,
  COUNT(p.id) AS pedidos_atrasados,
  SUM(p.valor_total) AS valor_total_atrasado
FROM clientes c
JOIN pedidos p ON c.id = p.cliente_id
WHERE p.status_pagamento = 'Atrasado'
GROUP BY c.id, c.nome, c.telefone
ORDER BY valor_total_atrasado DESC;

-- Clientes inativos (sem pedidos nos últimos 30 dias)
SELECT 
  c.nome,
  c.tipo,
  c.telefone,
  MAX(p.data) AS ultimo_pedido
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.id, c.nome, c.tipo, c.telefone
HAVING MAX(p.data) < NOW() - INTERVAL '30 days' OR MAX(p.data) IS NULL
ORDER BY ultimo_pedido DESC NULLS LAST;

-- =====================================================
-- PEDIDOS
-- =====================================================

-- Pedidos pendentes de entrega
SELECT 
  p.id,
  c.nome AS cliente,
  c.endereco,
  c.telefone,
  p.valor_total,
  p.data,
  e.nome AS entregador
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN entregadores e ON p.entregador_id = e.id
WHERE p.status = 'Pendente'
ORDER BY p.data;

-- Faturamento por período
SELECT 
  DATE_TRUNC('day', data) AS dia,
  COUNT(*) AS num_pedidos,
  SUM(valor_total) AS faturamento_dia
FROM pedidos
WHERE data >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', data)
ORDER BY dia DESC;

-- Faturamento mensal
SELECT 
  TO_CHAR(data, 'YYYY-MM') AS mes,
  COUNT(*) AS num_pedidos,
  SUM(valor_total) AS faturamento_mes,
  AVG(valor_total) AS ticket_medio
FROM pedidos
GROUP BY TO_CHAR(data, 'YYYY-MM')
ORDER BY mes DESC;

-- Pedidos por status
SELECT 
  status,
  COUNT(*) AS quantidade,
  SUM(valor_total) AS valor_total
FROM pedidos
GROUP BY status
ORDER BY quantidade DESC;

-- =====================================================
-- PAGAMENTOS
-- =====================================================

-- Contas a receber (pedidos pendentes e atrasados)
SELECT 
  c.nome AS cliente,
  p.id AS pedido,
  p.data AS data_pedido,
  p.data_vencimento_pagamento,
  p.valor_total,
  p.status_pagamento,
  CASE 
    WHEN p.data_vencimento_pagamento < CURRENT_DATE THEN 'VENCIDO'
    WHEN p.data_vencimento_pagamento = CURRENT_DATE THEN 'VENCE HOJE'
    ELSE 'A VENCER'
  END AS situacao
FROM pedidos p
JOIN clientes c ON p.cliente_id = c.id
WHERE p.status_pagamento IN ('Pendente', 'Atrasado')
ORDER BY p.data_vencimento_pagamento;

-- Total a receber
SELECT 
  SUM(valor_total) AS total_a_receber
FROM pedidos
WHERE status_pagamento IN ('Pendente', 'Atrasado');

-- Pagamentos recebidos por método
SELECT 
  metodo,
  COUNT(*) AS quantidade,
  SUM(valor) AS valor_total
FROM pagamentos
GROUP BY metodo
ORDER BY valor_total DESC;

-- Pagamentos recebidos por período
SELECT 
  DATE_TRUNC('day', data) AS dia,
  COUNT(*) AS num_pagamentos,
  SUM(valor) AS valor_recebido
FROM pagamentos
WHERE data >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', data)
ORDER BY dia DESC;

-- =====================================================
-- ENTREGADORES
-- =====================================================

-- Desempenho dos entregadores
SELECT 
  e.nome,
  COUNT(p.id) AS total_entregas,
  SUM(p.valor_total) AS valor_total_entregue,
  AVG(p.valor_total) AS ticket_medio,
  COUNT(DISTINCT p.cliente_id) AS clientes_atendidos
FROM entregadores e
LEFT JOIN pedidos p ON e.id = p.entregador_id AND p.status = 'Entregue'
GROUP BY e.id, e.nome
ORDER BY total_entregas DESC;

-- Entregas pendentes por entregador
SELECT 
  e.nome AS entregador,
  COUNT(p.id) AS entregas_pendentes,
  SUM(p.valor_total) AS valor_total
FROM entregadores e
LEFT JOIN pedidos p ON e.id = p.entregador_id AND p.status = 'Pendente'
GROUP BY e.id, e.nome
ORDER BY entregas_pendentes DESC;

-- =====================================================
-- ESTOQUE
-- =====================================================

-- Histórico de entradas de estoque
SELECT 
  p.nome AS produto,
  p.tamanho_pacote,
  e.quantidade,
  e.fornecedor,
  e.data_recebimento,
  e.data_validade
FROM entradas_estoque e
JOIN produtos p ON e.produto_id = p.id
ORDER BY e.data_recebimento DESC
LIMIT 50;

-- Movimentação de estoque por produto
SELECT 
  p.nome,
  p.tamanho_pacote,
  p.estoque_atual,
  COALESCE(SUM(e.quantidade), 0) AS total_entradas,
  COALESCE(SUM(ip.quantidade), 0) AS total_saidas
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, p.tamanho_pacote, p.estoque_atual
ORDER BY p.nome;

-- =====================================================
-- RELATÓRIOS GERENCIAIS
-- =====================================================

-- Dashboard resumo
SELECT 
  (SELECT COUNT(*) FROM produtos WHERE estoque_atual < estoque_minimo) AS produtos_estoque_baixo,
  (SELECT COUNT(*) FROM pedidos WHERE status = 'Pendente') AS pedidos_pendentes,
  (SELECT SUM(valor_total) FROM pedidos WHERE status_pagamento IN ('Pendente', 'Atrasado')) AS contas_a_receber,
  (SELECT SUM(valor_total) FROM pedidos WHERE data >= CURRENT_DATE - INTERVAL '30 days') AS faturamento_30_dias,
  (SELECT COUNT(*) FROM clientes) AS total_clientes,
  (SELECT COUNT(*) FROM entregadores) AS total_entregadores;

-- Análise de vendas por tipo de produto
SELECT 
  p.tipo,
  COUNT(DISTINCT ip.pedido_id) AS num_pedidos,
  SUM(ip.quantidade) AS quantidade_vendida,
  SUM(ip.subtotal) AS valor_total
FROM produtos p
JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.tipo
ORDER BY valor_total DESC;

-- Análise de vendas por tipo de cliente
SELECT 
  c.tipo AS tipo_cliente,
  COUNT(DISTINCT p.id) AS num_pedidos,
  SUM(p.valor_total) AS valor_total,
  AVG(p.valor_total) AS ticket_medio
FROM clientes c
JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.tipo
ORDER BY valor_total DESC;

-- =====================================================
-- FIM DAS QUERIES
-- =====================================================
