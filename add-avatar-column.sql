-- Script para adicionar coluna avatar_url na tabela entregadores
-- Execute este SQL no painel do Supabase (SQL Editor)

-- Adicionar coluna avatar_url
ALTER TABLE entregadores 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Pronto! Agora os entregadores podem ter foto de avatar.
