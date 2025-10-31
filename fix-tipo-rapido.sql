-- Script para adicionar o tipo "Rápido" no banco de dados

-- ============================================
-- PARTE 1: Verificar tipo atual da coluna
-- ============================================

SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'produtos' 
AND column_name = 'tipo';

-- ============================================
-- PARTE 2: Verificar se existe ENUM ou CHECK constraint
-- ============================================

-- Ver constraints da tabela
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'produtos'::regclass
AND conname LIKE '%tipo%';

-- Ver se existe um tipo ENUM
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname LIKE '%tipo%'
ORDER BY e.enumsortorder;

-- ============================================
-- PARTE 3: Ver valores atuais de tipo
-- ============================================

SELECT DISTINCT tipo FROM produtos ORDER BY tipo;

-- ============================================
-- PARTE 4: Soluções Possíveis
-- ============================================

-- SOLUÇÃO A: Se a coluna é TEXT sem constraints
-- Neste caso, não precisa fazer nada no banco
-- O problema pode ser apenas no cache do Supabase

-- SOLUÇÃO B: Se existe um CHECK constraint
-- Remover constraint antiga e criar nova com "Rápido"

/*
-- Remover constraint antiga (substitua o nome correto)
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS produtos_tipo_check;

-- Criar nova constraint incluindo "Rápido"
ALTER TABLE produtos ADD CONSTRAINT produtos_tipo_check 
CHECK (tipo IN (
    'Pão de Queijo',
    'Biscoito de Queijo',
    'Biscoito Ferradura',
    'Biscoito Polvilho',
    'Biscoito Goma',
    'Fubá',
    'Rápido'
));
*/

-- SOLUÇÃO C: Se existe um tipo ENUM
-- Adicionar novo valor ao ENUM

/*
-- Adicionar "Rápido" ao enum (substitua o nome correto do enum)
ALTER TYPE tipo_produto_enum ADD VALUE 'Rápido';

-- OU se precisar remover "Rapadura" e adicionar "Rápido"
-- Infelizmente não dá para remover valores de ENUM diretamente
-- Seria necessário:
-- 1. Criar novo ENUM
-- 2. Alterar coluna para usar novo ENUM
-- 3. Remover ENUM antigo
*/

-- SOLUÇÃO D: Atualizar produtos existentes de "Rapadura" para "Rápido"

/*
UPDATE produtos 
SET tipo = 'Rápido' 
WHERE tipo = 'Rapadura';
*/

-- ============================================
-- PARTE 5: Atualizar schema cache do Supabase
-- ============================================

NOTIFY pgrst, 'reload schema';

-- ============================================
-- PARTE 6: Teste de inserção
-- ============================================

/*
-- Testar inserção com tipo "Rápido"
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

-- Limpar
DELETE FROM produtos WHERE nome = 'Produto Teste Rápido';
*/
