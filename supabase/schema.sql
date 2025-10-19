-- =====================================================
-- MANÁ - Schema SQL para Supabase
-- Sistema de Gestão de Produtos e Entregas
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS (Tipos Enumerados)
-- =====================================================

-- Tipo de Produto
CREATE TYPE tipo_produto AS ENUM (
  'Pão de Queijo',
  'Biscoito de Queijo',
  'Biscoito Ferradura',
  'Biscoito Polvilho',
  'Biscoito Goma',
  'Fubá',
  'Rapadura'
);

-- Tipo de Cliente
CREATE TYPE tipo_cliente AS ENUM (
  'Mercado',
  'Padaria',
  'Varejo',
  'Restaurante',
  'Outros'
);

-- Condição de Pagamento
CREATE TYPE condicao_pagamento AS ENUM (
  'À vista',
  'Pagar na próxima entrega',
  '7 dias',
  '15 dias',
  '30 dias'
);

-- Status do Pedido
CREATE TYPE status_pedido AS ENUM (
  'Pendente',
  'Entregue',
  'Cancelado'
);

-- Status do Pagamento
CREATE TYPE status_pagamento AS ENUM (
  'Pendente',
  'Pago',
  'Atrasado'
);

-- Método de Pagamento
CREATE TYPE metodo_pagamento AS ENUM (
  'Dinheiro',
  'PIX',
  'Boleto'
);

-- =====================================================
-- TABELAS
-- =====================================================

-- Tabela: Produtos
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  tipo tipo_produto NOT NULL,
  tamanho_pacote VARCHAR(50) NOT NULL,
  preco_padrao DECIMAL(10, 2) NOT NULL CHECK (preco_padrao >= 0),
  estoque_minimo INTEGER NOT NULL CHECK (estoque_minimo >= 0),
  estoque_atual INTEGER NOT NULL DEFAULT 0 CHECK (estoque_atual >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  tipo tipo_cliente NOT NULL,
  endereco TEXT NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  condicao_pagamento condicao_pagamento NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Entregadores
CREATE TABLE entregadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Entradas de Estoque
CREATE TABLE entradas_estoque (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  data_recebimento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  data_validade DATE,
  fornecedor VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  entregador_id UUID REFERENCES entregadores(id) ON DELETE SET NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  valor_total DECIMAL(10, 2) NOT NULL CHECK (valor_total >= 0),
  status status_pedido NOT NULL DEFAULT 'Pendente',
  data_vencimento_pagamento DATE NOT NULL,
  status_pagamento status_pagamento NOT NULL DEFAULT 'Pendente',
  assinatura TEXT, -- Base64 da assinatura
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Itens do Pedido
CREATE TABLE itens_pedido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario DECIMAL(10, 2) NOT NULL CHECK (preco_unitario >= 0),
  subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (quantidade * preco_unitario) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: Pagamentos
CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  valor DECIMAL(10, 2) NOT NULL CHECK (valor > 0),
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metodo metodo_pagamento NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES para melhor performance
-- =====================================================

CREATE INDEX idx_produtos_tipo ON produtos(tipo);
CREATE INDEX idx_produtos_estoque ON produtos(estoque_atual);
CREATE INDEX idx_clientes_tipo ON clientes(tipo);
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_entregador ON pedidos(entregador_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_data ON pedidos(data DESC);
CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_pedido_produto ON itens_pedido(produto_id);
CREATE INDEX idx_pagamentos_pedido ON pagamentos(pedido_id);
CREATE INDEX idx_entradas_estoque_produto ON entradas_estoque(produto_id);

-- =====================================================
-- TRIGGERS para atualizar updated_at automaticamente
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON produtos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entregadores_updated_at
  BEFORE UPDATE ON entregadores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER para atualizar estoque ao criar pedido
-- =====================================================

CREATE OR REPLACE FUNCTION atualizar_estoque_pedido()
RETURNS TRIGGER AS $$
BEGIN
  -- Diminui o estoque do produto
  UPDATE produtos
  SET estoque_atual = estoque_atual - NEW.quantidade
  WHERE id = NEW.produto_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_estoque_pedido
  AFTER INSERT ON itens_pedido
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_estoque_pedido();

-- =====================================================
-- TRIGGER para aumentar estoque ao registrar entrada
-- =====================================================

CREATE OR REPLACE FUNCTION atualizar_estoque_entrada()
RETURNS TRIGGER AS $$
BEGIN
  -- Aumenta o estoque do produto
  UPDATE produtos
  SET estoque_atual = estoque_atual + NEW.quantidade
  WHERE id = NEW.produto_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_estoque_entrada
  AFTER INSERT ON entradas_estoque
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_estoque_entrada();

-- =====================================================
-- VIEWS úteis
-- =====================================================

-- View: Produtos com estoque baixo
CREATE VIEW produtos_estoque_baixo AS
SELECT 
  id,
  nome,
  tipo,
  tamanho_pacote,
  estoque_atual,
  estoque_minimo,
  (estoque_minimo - estoque_atual) AS quantidade_faltante
FROM produtos
WHERE estoque_atual < estoque_minimo
ORDER BY (estoque_minimo - estoque_atual) DESC;

-- View: Resumo de pedidos por cliente
CREATE VIEW resumo_pedidos_cliente AS
SELECT 
  c.id AS cliente_id,
  c.nome AS cliente_nome,
  COUNT(p.id) AS total_pedidos,
  SUM(p.valor_total) AS valor_total_pedidos,
  SUM(CASE WHEN p.status_pagamento = 'Pendente' THEN p.valor_total ELSE 0 END) AS valor_pendente,
  SUM(CASE WHEN p.status_pagamento = 'Pago' THEN p.valor_total ELSE 0 END) AS valor_pago
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id
GROUP BY c.id, c.nome
ORDER BY valor_total_pedidos DESC;

-- View: Desempenho dos entregadores
CREATE VIEW desempenho_entregadores AS
SELECT 
  e.id AS entregador_id,
  e.nome AS entregador_nome,
  COUNT(p.id) AS total_entregas,
  SUM(p.valor_total) AS valor_total_entregue,
  COUNT(DISTINCT p.cliente_id) AS clientes_atendidos
FROM entregadores e
LEFT JOIN pedidos p ON e.id = p.entregador_id AND p.status = 'Entregue'
GROUP BY e.id, e.nome
ORDER BY total_entregas DESC;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE entradas_estoque ENABLE ROW LEVEL SECURITY;

-- Políticas: Permitir todas as operações para usuários autenticados
-- (Você pode ajustar conforme suas necessidades de segurança)

CREATE POLICY "Permitir tudo para autenticados" ON produtos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para autenticados" ON clientes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para autenticados" ON entregadores
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para autenticados" ON pedidos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para autenticados" ON itens_pedido
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para autenticados" ON pagamentos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir tudo para autenticados" ON entradas_estoque
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- COMENTÁRIOS nas tabelas e colunas
-- =====================================================

COMMENT ON TABLE produtos IS 'Catálogo de produtos disponíveis';
COMMENT ON TABLE clientes IS 'Cadastro de clientes (padarias, mercados, etc)';
COMMENT ON TABLE entregadores IS 'Cadastro de entregadores';
COMMENT ON TABLE pedidos IS 'Pedidos realizados pelos clientes';
COMMENT ON TABLE itens_pedido IS 'Itens individuais de cada pedido';
COMMENT ON TABLE pagamentos IS 'Registro de pagamentos recebidos';
COMMENT ON TABLE entradas_estoque IS 'Histórico de entradas de estoque';

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
