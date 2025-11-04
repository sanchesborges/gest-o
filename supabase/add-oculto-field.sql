-- Adicionar campo 'oculto' na tabela produtos
-- Este campo permite ocultar produtos do Controle de Estoque sem deletá-los do banco

ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS oculto BOOLEAN DEFAULT FALSE;

-- Comentário explicativo
COMMENT ON COLUMN produtos.oculto IS 'Indica se o produto está oculto na visualização de Controle de Estoque';
