-- Script para verificar e corrigir schema da tabela produtos

-- ============================================
-- PARTE 1: Verificar colunas atuais
-- ============================================

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'produtos'
ORDER BY ordinal_position;

-- ============================================
-- PARTE 2: Verificar se a coluna existe
-- ============================================

SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'produtos' 
    AND column_name = 'preco_unitario'
) as coluna_preco_existe;

-- ============================================
-- PARTE 3: Possíveis nomes da coluna de preço
-- ============================================

-- Verificar se existe com outro nome
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'produtos' 
AND column_name LIKE '%preco%';

-- ============================================
-- PARTE 4: Adicionar coluna se não existir
-- ============================================

-- Se a coluna não existir, adicione-a
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'produtos' 
        AND column_name = 'preco_unitario'
    ) THEN
        ALTER TABLE produtos ADD COLUMN preco_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0;
        RAISE NOTICE 'Coluna preco_unitario adicionada';
    ELSE
        RAISE NOTICE 'Coluna preco_unitario já existe';
    END IF;
END $$;

-- ============================================
-- PARTE 5: Verificar dados existentes
-- ============================================

SELECT 
    id,
    nome,
    tipo,
    tamanho_pacote,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'produtos' 
            AND column_name = 'preco_unitario'
        ) THEN preco_unitario::text
        ELSE 'coluna não existe'
    END as preco
FROM produtos
LIMIT 5;

-- ============================================
-- PARTE 6: Recriar tabela se necessário (CUIDADO!)
-- ============================================

-- ATENÇÃO: Só execute isso se a tabela estiver com problemas graves
-- Isso vai APAGAR todos os dados!

/*
DROP TABLE IF EXISTS produtos CASCADE;

CREATE TABLE produtos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'Biscoito',
    tamanho_pacote TEXT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 0,
    estoque_atual INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recriar políticas RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de produtos" ON produtos FOR SELECT USING (true);
CREATE POLICY "Permitir inserção pública de produtos" ON produtos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização pública de produtos" ON produtos FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão pública de produtos" ON produtos FOR DELETE USING (true);
*/

-- ============================================
-- PARTE 7: Atualizar schema cache do Supabase
-- ============================================

-- Força o Supabase a atualizar o cache do schema
NOTIFY pgrst, 'reload schema';
