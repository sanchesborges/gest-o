-- Script para corrigir a tabela de entregadores
-- Execute este SQL no painel do Supabase (SQL Editor)

-- 1. Deletar a tabela antiga (se existir)
DROP TABLE IF EXISTS entregadores CASCADE;

-- 2. Criar a tabela correta
CREATE TABLE entregadores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar Row Level Security
ALTER TABLE entregadores ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de acesso
CREATE POLICY "Permitir leitura pública de entregadores" 
    ON entregadores FOR SELECT 
    USING (true);

CREATE POLICY "Permitir inserção pública de entregadores" 
    ON entregadores FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de entregadores" 
    ON entregadores FOR UPDATE 
    USING (true);

CREATE POLICY "Permitir exclusão pública de entregadores" 
    ON entregadores FOR DELETE 
    USING (true);

-- 5. Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_entregadores_nome ON entregadores(nome);

-- Pronto! Agora teste novamente.
