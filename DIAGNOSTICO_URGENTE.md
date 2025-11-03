# 🚨 DIAGNÓSTICO URGENTE - Erro ao Salvar Pedido

## ❌ Erro Atual

```
Erro ao salvar itens do pedido: new row for relation "produtos" violates check constraint "produtos_estoque_atual_check"
```

O pedido é salvo, mas os itens falham.

## 🔍 Possíveis Causas

### 1. Trigger Duplicando Atualização de Estoque

**Hipótese:** Pode haver um trigger na tabela `itens_pedido` que atualiza o estoque automaticamente quando um item é inserido.

**Resultado:**
- Código atualiza estoque: 50 - 10 = 40 ✅
- Trigger atualiza estoque novamente: 40 - 10 = 30 ❌ (duplicação)

**Como verificar:**
Execute `verificar-constraint-produtos.sql` no Supabase e procure por triggers na tabela `itens_pedido`.

### 2. Estoque Já Está Negativo no Banco

**Hipótese:** Alguns produtos já têm estoque negativo no banco.

**Como verificar:**
```sql
SELECT nome, estoque_atual
FROM produtos
WHERE estoque_atual < 0
ORDER BY estoque_atual ASC;
```

### 3. Race Condition (Múltiplas Requisições)

**Hipótese:** Duas requisições estão atualizando o estoque ao mesmo tempo.

**Como verificar:**
Veja os logs no console do navegador (F12) e procure por múltiplas chamadas.

## 🔧 AÇÃO IMEDIATA

### Passo 1: Verificar Estoque Atual

Execute no Supabase:
```sql
SELECT 
    nome,
    estoque_atual,
    estoque_minimo,
    CASE 
        WHEN estoque_atual < 0 THEN '❌ NEGATIVO'
        WHEN estoque_atual = 0 THEN '⚠️ ZERADO'
        ELSE '✅ OK'
    END as status
FROM produtos
ORDER BY estoque_atual ASC;
```

### Passo 2: Verificar Triggers

Execute no Supabase:
```sql
-- Ver triggers em itens_pedido
SELECT
    tgname AS trigger_name,
    pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgrelid = 'public.itens_pedido'::regclass
  AND tgisinternal = false;
```

### Passo 3: Ver Logs no Console

1. Abra o Console do navegador (F12)
2. Vá na aba "Console"
3. Tente criar um pedido
4. Copie TODOS os logs que aparecem
5. Procure por:
   - `📦 Validando e atualizando estoque dos produtos...`
   - Valores de estoque antes e depois
   - Mensagens de erro

## 🎯 Soluções Possíveis

### Se houver TRIGGER duplicando:

**Opção 1: Remover o trigger**
```sql
DROP TRIGGER IF EXISTS nome_do_trigger ON itens_pedido;
```

**Opção 2: Desabilitar o trigger temporariamente**
```sql
ALTER TABLE itens_pedido DISABLE TRIGGER nome_do_trigger;
```

**Opção 3: Modificar o código para não atualizar estoque manualmente**
(Deixar o trigger fazer o trabalho)

### Se houver ESTOQUE NEGATIVO:

```sql
-- Corrigir estoques negativos
UPDATE produtos
SET estoque_atual = 0
WHERE estoque_atual < 0;
```

### Se for RACE CONDITION:

Adicionar lock na transação (implementar depois).

## 📊 Informações Necessárias

Para resolver, preciso saber:

1. **Resultado do SQL de verificar estoque:**
   - Há produtos com estoque negativo?
   - Qual o estoque do produto que você tentou vender?

2. **Resultado do SQL de verificar triggers:**
   - Há triggers na tabela `itens_pedido`?
   - Qual a definição deles?

3. **Logs do console:**
   - O que aparece no console quando você tenta criar o pedido?
   - Qual o valor do estoque antes e depois?

## 🚨 EXECUTE AGORA

1. Abra o Supabase SQL Editor
2. Execute `check-estoque-produtos.sql`
3. Execute `verificar-constraint-produtos.sql`
4. Me envie os resultados

Isso vai me ajudar a identificar a causa exata do problema!
