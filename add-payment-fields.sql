-- Adicionar campos de pagamento na tabela pedidos
-- Estes campos permitem que o entregador registre pagamentos parciais ou totais

-- Adicionar campo para valor pago pelo cliente
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS valor_pago DECIMAL(10,2) DEFAULT 0;

-- Adicionar campo para indicar se foi pagamento parcial
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS pagamento_parcial BOOLEAN DEFAULT false;

-- Adicionar campo para data do pagamento
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP;

-- Adicionar campo para método de pagamento usado na entrega
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS metodo_pagamento_entrega TEXT;

-- Comentários para documentação
COMMENT ON COLUMN pedidos.valor_pago IS 'Valor efetivamente pago pelo cliente no momento da entrega';
COMMENT ON COLUMN pedidos.pagamento_parcial IS 'Indica se o cliente fez apenas um pagamento parcial';
COMMENT ON COLUMN pedidos.data_pagamento IS 'Data em que o pagamento foi registrado pelo entregador';
COMMENT ON COLUMN pedidos.metodo_pagamento_entrega IS 'Método de pagamento usado na entrega (Dinheiro, PIX, etc)';

-- Atualizar pedidos existentes para ter valor_pago = 0
UPDATE pedidos 
SET valor_pago = 0 
WHERE valor_pago IS NULL;
