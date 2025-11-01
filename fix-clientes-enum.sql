-- Correção para tabela clientes com ENUMs
-- O banco usa ENUMs, não TEXT

-- Passo 1: Verificar estrutura
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'clientes'
ORDER BY ordinal_position;

-- Passo 2: Verificar valores dos ENUMs
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname IN ('tipo_cliente', 'condicao_pagamento')
ORDER BY t.typname, e.enumsortorder;

-- Passo 3: Atualizar clientes com tipo NULL
-- Usar CAST para converter string para ENUM
UPDATE clientes 
SET tipo = 'Mercado'::tipo_cliente
WHERE tipo IS NULL;

-- Passo 4: Atualizar clientes com condição de pagamento NULL
UPDATE clientes 
SET condicao_pagamento = '15 dias'::condicao_pagamento
WHERE condicao_pagamento IS NULL;

-- Passo 5: Verificar resultado
SELECT 
    id, 
    nome, 
    tipo::text as tipo,
    condicao_pagamento::text as condicao_pagamento
FROM clientes 
ORDER BY nome;

-- Passo 6: Contar problemas
SELECT 
    COUNT(*) as total_clientes,
    COUNT(tipo) as com_tipo,
    COUNT(condicao_pagamento) as com_condicao,
    COUNT(*) FILTER (WHERE tipo IS NULL) as sem_tipo,
    COUNT(*) FILTER (WHERE condicao_pagamento IS NULL) as sem_condicao
FROM clientes;
