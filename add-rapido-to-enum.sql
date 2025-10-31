-- Script para adicionar "Rápido" ao ENUM tipo_produto

-- ============================================
-- PARTE 1: Ver valores atuais do ENUM
-- ============================================

SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value,
    e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'tipo_produto'
ORDER BY e.enumsortorder;

-- ============================================
-- PARTE 2: Adicionar "Rápido" ao ENUM
-- ============================================

-- IMPORTANTE: Execute este comando SOZINHO primeiro
-- Depois execute os comandos seguintes em outra query

ALTER TYPE tipo_produto ADD VALUE 'Rápido';

-- ============================================
-- PARTE 3: Atualizar cache do Supabase
-- ============================================

-- Execute este comando DEPOIS de adicionar o valor ao ENUM
-- (em uma query separada ou após commit)

NOTIFY pgrst, 'reload schema';

-- ============================================
-- PARTE 4: Verificar se foi adicionado
-- ============================================

SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value,
    e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'tipo_produto'
ORDER BY e.enumsortorder;

-- ============================================
-- PARTE 5: Teste de inserção
-- ============================================

-- Execute este teste DEPOIS de adicionar o valor ao ENUM
-- (em uma query separada ou após commit)

INSERT INTO produtos (
    id,
    nome,
    tipo,
    tamanho_pacote,
    preco_padrao,
    estoque_minimo,
    estoque_atual
) VALUES (
    gen_random_uuid(),
    'Produto Teste Rápido',
    'Rápido',
    '1kg',
    14.00,
    10,
    0
);

-- Verificar
SELECT * FROM produtos WHERE tipo = 'Rápido';

-- Limpar teste (opcional)
-- DELETE FROM produtos WHERE nome = 'Produto Teste Rápido';

-- ============================================
-- PARTE 6: Atualizar produtos existentes (opcional)
-- ============================================

-- Se você tinha produtos com tipo "Rapadura", pode atualizá-los
-- UPDATE produtos SET tipo = 'Rápido' WHERE tipo = 'Rapadura';
