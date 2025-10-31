-- Script para verificar e corrigir tipo da coluna ID

-- ============================================
-- PARTE 1: Verificar tipo atual da coluna ID
-- ============================================

SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'produtos' 
AND column_name = 'id';

-- ============================================
-- PARTE 2: Ver todos os IDs atuais
-- ============================================

SELECT id, nome FROM produtos LIMIT 10;

-- ============================================
-- PARTE 3: Opções de Correção
-- ============================================

-- OPÇÃO A: Se a coluna é UUID e você quer manter UUID
-- Neste caso, o código já foi corrigido para gerar UUIDs válidos
-- Nenhuma alteração no banco é necessária

-- OPÇÃO B: Se você quer mudar a coluna de UUID para TEXT
-- ATENÇÃO: Isso pode afetar foreign keys!

/*
-- Remover foreign keys temporariamente
ALTER TABLE itens_pedido DROP CONSTRAINT IF EXISTS itens_pedido_produto_id_fkey;
ALTER TABLE entradas_estoque DROP CONSTRAINT IF EXISTS entradas_estoque_produto_id_fkey;

-- Alterar tipo da coluna
ALTER TABLE produtos ALTER COLUMN id TYPE TEXT;

-- Recriar foreign keys
ALTER TABLE itens_pedido
ADD CONSTRAINT itens_pedido_produto_id_fkey 
FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE;

ALTER TABLE entradas_estoque
ADD CONSTRAINT entradas_estoque_produto_id_fkey 
FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE;
*/

-- ============================================
-- PARTE 4: Verificar foreign keys
-- ============================================

SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'produtos';

-- ============================================
-- PARTE 5: Teste de inserção com UUID
-- ============================================

-- Testar inserção com UUID válido
/*
INSERT INTO produtos (
    id,
    nome,
    tipo,
    tamanho_pacote,
    preco_padrao,
    estoque_minimo,
    estoque_atual
) VALUES (
    gen_random_uuid(),  -- Gera UUID válido
    'Produto Teste UUID',
    'Pão de Queijo',
    '1kg',
    25.00,
    10,
    0
);

-- Verificar
SELECT * FROM produtos WHERE nome = 'Produto Teste UUID';

-- Limpar
DELETE FROM produtos WHERE nome = 'Produto Teste UUID';
*/
