-- Adicionar campo de custo ao produto
-- Este campo armazena o custo de compra/produção do produto

ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS custo_unitario DECIMAL(10, 2) DEFAULT 0;

COMMENT ON COLUMN produtos.custo_unitario IS 'Custo de compra/produção do produto (usado para calcular lucro)';

-- Atualizar produtos existentes com custo padrão (pode ser ajustado depois)
UPDATE produtos 
SET custo_unitario = 0 
WHERE custo_unitario IS NULL;
