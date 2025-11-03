-- Script para verificar se as atualizações de produtos estão sendo salvas no Supabase

-- 1. Ver todos os produtos atuais
SELECT 
    id,
    nome,
    tipo,
    tamanho_pacote,
    preco_padrao,
    estoque_minimo,
    estoque_atual,
    created_at,
    updated_at
FROM produtos
ORDER BY nome;

-- 2. Ver produtos atualizados recentemente (últimas 24 horas)
SELECT 
    id,
    nome,
    tipo,
    tamanho_pacote,
    preco_padrao,
    estoque_minimo,
    estoque_atual,
    created_at,
    updated_at,
    EXTRACT(EPOCH FROM (NOW() - updated_at))/60 as minutos_desde_atualizacao
FROM produtos
WHERE updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;

-- 3. Ver produtos que foram modificados (updated_at diferente de created_at)
SELECT 
    id,
    nome,
    tipo,
    tamanho_pacote,
    preco_padrao,
    estoque_minimo,
    estoque_atual,
    created_at,
    updated_at,
    updated_at - created_at as tempo_desde_criacao
FROM produtos
WHERE updated_at > created_at
ORDER BY updated_at DESC;

-- 4. Contar quantos produtos foram atualizados
SELECT 
    COUNT(*) as total_produtos,
    COUNT(CASE WHEN updated_at > created_at THEN 1 END) as produtos_atualizados,
    COUNT(CASE WHEN updated_at = created_at THEN 1 END) as produtos_nunca_atualizados
FROM produtos;

-- 5. Ver histórico de um produto específico (substitua 'NOME_DO_PRODUTO' pelo nome real)
-- SELECT * FROM produtos WHERE nome LIKE '%Pão de Queijo%' ORDER BY updated_at DESC;
