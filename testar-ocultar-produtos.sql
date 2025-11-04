-- Script para testar a funcionalidade de ocultar produtos

-- 1. Verificar se a coluna 'oculto' existe
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'produtos' AND column_name = 'oculto';

-- 2. Ver todos os produtos e seu status de oculto
SELECT id, nome, tamanho_pacote, estoque_atual, oculto
FROM produtos
ORDER BY nome;

-- 3. Contar produtos visíveis vs ocultos
SELECT 
  COUNT(*) FILTER (WHERE oculto = false) as produtos_visiveis,
  COUNT(*) FILTER (WHERE oculto = true) as produtos_ocultos,
  COUNT(*) as total_produtos
FROM produtos;

-- 4. Testar ocultar um produto (substitua o ID)
-- UPDATE produtos SET oculto = true WHERE id = 'SEU_ID_AQUI';

-- 5. Testar mostrar um produto novamente (substitua o ID)
-- UPDATE produtos SET oculto = false WHERE id = 'SEU_ID_AQUI';

-- 6. Ver apenas produtos visíveis (como o sistema carrega)
SELECT id, nome, tamanho_pacote, estoque_atual
FROM produtos
WHERE oculto = false
ORDER BY nome;

-- 7. Ver apenas produtos ocultos
SELECT id, nome, tamanho_pacote, estoque_atual
FROM produtos
WHERE oculto = true
ORDER BY nome;
