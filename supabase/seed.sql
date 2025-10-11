-- =====================================================
-- SHIRLEY - Dados Iniciais (SEED)
-- Popula o banco com dados de exemplo
-- =====================================================

-- =====================================================
-- PRODUTOS
-- =====================================================

INSERT INTO produtos (nome, tipo, tamanho_pacote, preco_padrao, estoque_minimo, estoque_atual) VALUES
('Biscoito Polvilho', 'Biscoito Polvilho', '1kg', 16.00, 20, 100),
('Biscoito Goma', 'Biscoito Goma', '1kg', 16.00, 10, 50),
('Fubá', 'Fubá', '1kg', 15.00, 15, 80),
('Pão de Queijo', 'Pão de Queijo', '1kg', 15.00, 25, 120),
('Biscoito Polvilho', 'Biscoito Polvilho', '5kg', 80.00, 10, 40),
('Biscoito Goma', 'Biscoito Goma', '5kg', 80.00, 8, 30),
('Fubá', 'Fubá', '5kg', 80.00, 8, 25),
('Pão de Queijo', 'Pão de Queijo', '25g', 0.50, 100, 500),
('Pão de Queijo', 'Pão de Queijo', '30g', 0.60, 100, 400),
('Pão de Queijo', 'Pão de Queijo', '40g', 0.80, 80, 300),
('Pão de Queijo', 'Pão de Queijo', '100g', 2.00, 50, 200),
('Rapadura', 'Rapadura', '1kg', 14.00, 15, 60);

-- =====================================================
-- CLIENTES
-- =====================================================

INSERT INTO clientes (nome, tipo, endereco, telefone, condicao_pagamento) VALUES
('MADÁ', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('LUCAS', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('D.LUCIA', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('FLAM SER', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('FLAM BEL', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('FLAM MAT', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('SUP BAHIA', 'Mercado', 'A definir', '(00) 00000-0000', '7 dias'),
('CAFE MIX', 'Restaurante', 'A definir', '(00) 00000-0000', '7 dias'),
('IDEAL', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('RENER', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('SANDUBS', 'Restaurante', 'A definir', '(00) 00000-0000', '7 dias'),
('TRADIÇÃO', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('VOU LÁ', 'Padaria', 'A definir', '(00) 00000-0000', '7 dias'),
('AVULSOS', 'Outros', 'Vendas avulsas', '(00) 00000-0000', 'À vista');

-- =====================================================
-- ENTREGADORES
-- =====================================================

INSERT INTO entregadores (nome, telefone) VALUES
('João da Silva', '(11) 91111-1111'),
('Carlos Souza', '(21) 92222-2222'),
('Maria Santos', '(31) 93333-3333');

-- =====================================================
-- EXEMPLO DE PEDIDO
-- =====================================================

-- Inserir um pedido de exemplo
DO $$
DECLARE
  v_cliente_id UUID;
  v_entregador_id UUID;
  v_pedido_id UUID;
  v_produto1_id UUID;
  v_produto2_id UUID;
BEGIN
  -- Buscar IDs
  SELECT id INTO v_cliente_id FROM clientes WHERE nome = 'MADÁ' LIMIT 1;
  SELECT id INTO v_entregador_id FROM entregadores WHERE nome = 'João da Silva' LIMIT 1;
  SELECT id INTO v_produto1_id FROM produtos WHERE nome = 'Biscoito Polvilho' AND tamanho_pacote = '1kg' LIMIT 1;
  SELECT id INTO v_produto2_id FROM produtos WHERE nome = 'Pão de Queijo' AND tamanho_pacote = '1kg' LIMIT 1;
  
  -- Criar pedido
  INSERT INTO pedidos (
    cliente_id, 
    entregador_id, 
    data, 
    valor_total, 
    status, 
    data_vencimento_pagamento, 
    status_pagamento
  ) VALUES (
    v_cliente_id,
    v_entregador_id,
    NOW(),
    235.00,
    'Pendente',
    CURRENT_DATE + INTERVAL '7 days',
    'Pendente'
  ) RETURNING id INTO v_pedido_id;
  
  -- Adicionar itens ao pedido
  INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
  (v_pedido_id, v_produto1_id, 10, 16.00),
  (v_pedido_id, v_produto2_id, 5, 15.00);
  
END $$;

-- =====================================================
-- EXEMPLO DE ENTRADA DE ESTOQUE
-- =====================================================

DO $$
DECLARE
  v_produto_id UUID;
BEGIN
  SELECT id INTO v_produto_id FROM produtos WHERE nome = 'Biscoito Polvilho' AND tamanho_pacote = '1kg' LIMIT 1;
  
  INSERT INTO entradas_estoque (
    produto_id,
    quantidade,
    data_recebimento,
    fornecedor
  ) VALUES (
    v_produto_id,
    50,
    NOW(),
    'Fábrica Matriz'
  );
END $$;

-- =====================================================
-- VERIFICAR DADOS INSERIDOS
-- =====================================================

-- Contar registros
SELECT 
  'Produtos' AS tabela, COUNT(*) AS total FROM produtos
UNION ALL
SELECT 'Clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'Entregadores', COUNT(*) FROM entregadores
UNION ALL
SELECT 'Pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'Itens Pedido', COUNT(*) FROM itens_pedido
UNION ALL
SELECT 'Entradas Estoque', COUNT(*) FROM entradas_estoque;

-- =====================================================
-- FIM DO SEED
-- =====================================================
