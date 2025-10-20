-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'Biscoito',
    tamanho_pacote TEXT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    estoque_minimo INTEGER NOT NULL DEFAULT 0,
    estoque_atual INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    endereco TEXT NOT NULL,
    bairro TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Entregadores
CREATE TABLE IF NOT EXISTS entregadores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id TEXT PRIMARY KEY,
    cliente_id TEXT NOT NULL REFERENCES clientes(id),
    entregador_id TEXT REFERENCES entregadores(id),
    data TIMESTAMP WITH TIME ZONE NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL,
    status_pagamento TEXT NOT NULL,
    data_vencimento_pagamento TIMESTAMP WITH TIME ZONE NOT NULL,
    assinatura TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id TEXT PRIMARY KEY,
    pedido_id TEXT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id TEXT NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Entradas de Estoque
CREATE TABLE IF NOT EXISTS entradas_estoque (
    id TEXT PRIMARY KEY,
    produto_id TEXT NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    fornecedor TEXT NOT NULL,
    data_recebimento TIMESTAMP WITH TIME ZONE NOT NULL,
    data_validade TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
    id TEXT PRIMARY KEY,
    pedido_id TEXT NOT NULL REFERENCES pedidos(id),
    valor DECIMAL(10, 2) NOT NULL,
    metodo TEXT NOT NULL,
    data TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_entregador ON pedidos(entregador_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(data);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_itens_pedido_produto ON itens_pedido(produto_id);
CREATE INDEX IF NOT EXISTS idx_entradas_estoque_produto ON entradas_estoque(produto_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_pedido ON pagamentos(pedido_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE entradas_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (permitir tudo por enquanto - ajuste conforme necessário)
CREATE POLICY "Permitir leitura pública de produtos" ON produtos FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de produtos" ON produtos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de produtos" ON produtos FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de produtos" ON produtos FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de clientes" ON clientes FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de clientes" ON clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de clientes" ON clientes FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de clientes" ON clientes FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de entregadores" ON entregadores FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de entregadores" ON entregadores FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de entregadores" ON entregadores FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de entregadores" ON entregadores FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de pedidos" ON pedidos FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de pedidos" ON pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de pedidos" ON pedidos FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de pedidos" ON pedidos FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de itens_pedido" ON itens_pedido FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de itens_pedido" ON itens_pedido FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de itens_pedido" ON itens_pedido FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de itens_pedido" ON itens_pedido FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de entradas_estoque" ON entradas_estoque FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de entradas_estoque" ON entradas_estoque FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de entradas_estoque" ON entradas_estoque FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de entradas_estoque" ON entradas_estoque FOR DELETE USING (true);

CREATE POLICY "Permitir leitura pública de pagamentos" ON pagamentos FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de pagamentos" ON pagamentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de pagamentos" ON pagamentos FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de pagamentos" ON pagamentos FOR DELETE USING (true);
