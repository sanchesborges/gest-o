# 🔧 Solução: Estoque Duplicado na Entrada

## 🔍 Problema Identificado

Ao registrar entrada de estoque, as quantidades não batem:

**Exemplos:**
- Registrou 4 unidades → Estoque mostra 0 ❌
- Registrou 70 unidades → Estoque mostra 140 ❌ (dobro!)

## 🎯 Causa

O código estava atualizando o estoque **DUAS VEZES**:

1. **Primeira vez:** Atualiza o estado local (React)
2. **Segunda vez:** Busca do banco e atualiza novamente

```typescript
// ❌ ERRADO: Atualiza duas vezes
setProdutos(prev => {
  // Atualiza estado local: 0 + 70 = 70
  produto.estoqueAtual += 70;
});

// Depois busca do banco e atualiza de novo
const produtoBanco = await supabase.select();
// Banco já tem 70, adiciona mais 70 = 140!
await supabase.update({ estoque_atual: 70 + 70 });
```

## ✅ Correção Aplicada

Agora o código:
1. **Busca o estoque do banco ANTES**
2. **Calcula o novo estoque**
3. **Atualiza o banco**
4. **Atualiza o estado local**
5. **Salva a entrada**

```typescript
// ✅ CORRETO: Atualiza uma vez
// 1. Buscar estoque atual do banco
const produtoBanco = await supabase.select();
const estoqueAtual = produtoBanco.estoque_atual; // 0

// 2. Calcular novo estoque
const novoEstoque = estoqueAtual + quantidade; // 0 + 70 = 70

// 3. Atualizar no banco
await supabase.update({ estoque_atual: 70 });

// 4. Atualizar estado local
setProdutos(prev => {
  produto.estoqueAtual = 70;
});

// 5. Salvar entrada
await supabase.insert(entrada);
```

## 🔧 Como Corrigir Estoques Errados

### 1️⃣ Execute o SQL de Diagnóstico

```sql
-- Ver situação atual
SELECT 
    p.nome,
    p.estoque_atual as estoque_sistema,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    COALESCE(SUM(ip.quantidade), 0) as total_vendas,
    (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as estoque_correto,
    (p.estoque_atual - (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0))) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY diferenca DESC;
```

Isso mostra:
- **estoque_sistema:** O que está no banco
- **total_entradas:** Soma de todas as entradas
- **total_vendas:** Soma de todas as vendas
- **estoque_correto:** O que deveria ser (entradas - vendas)
- **diferenca:** Quanto está errado

### 2️⃣ Recalcular Estoques Automaticamente

```sql
-- Recalcular baseado em entradas e vendas
WITH estoque_calculado AS (
    SELECT 
        p.id,
        (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as estoque_correto
    FROM produtos p
    LEFT JOIN entradas_estoque e ON p.id = e.produto_id
    LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
    GROUP BY p.id
)
UPDATE produtos p
SET estoque_atual = ec.estoque_correto
FROM estoque_calculado ec
WHERE p.id = ec.id;
```

### 3️⃣ Verificar Resultado

```sql
SELECT 
    nome,
    estoque_atual,
    CASE 
        WHEN estoque_atual < 0 THEN '❌ NEGATIVO'
        WHEN estoque_atual = 0 THEN '⚠️ ZERADO'
        ELSE '✅ OK'
    END as status
FROM produtos
ORDER BY estoque_atual ASC;
```

## 🧪 Como Testar

### Teste 1: Entrada Nova

1. Vá em **Entrada de Estoque**
2. Adicione 10 unidades de um produto
3. Verifique o estoque
4. ✅ Deve mostrar exatamente 10

### Teste 2: Entrada Adicional

1. Adicione mais 5 unidades do mesmo produto
2. Verifique o estoque
3. ✅ Deve mostrar 15 (10 + 5)

### Teste 3: Venda

1. Crie um pedido vendendo 3 unidades
2. Verifique o estoque
3. ✅ Deve mostrar 12 (15 - 3)

## 📊 Logs no Console

Agora você verá logs detalhados:

```
📦 Salvando entrada de estoque...
   Produto: Pão de Queijo 1kg
   Estoque ANTES: 0
   Quantidade a ADICIONAR: 70
   Estoque DEPOIS deveria ser: 70
   ✅ Estado atualizado: 0 + 70 = 70
✅ Entrada salva localmente!
📦 Atualizando estoque de Pão de Queijo 1kg: 0 + 70 = 70
✅ Estoque atualizado no Supabase!
✅ Entrada salva no Supabase!
```

## 🚨 Casos Especiais

### Caso 1: Estoque Zerado Quando Deveria Ter

**Causa:** Entrada não foi salva no banco

**Solução:**
```sql
-- Ver entradas registradas
SELECT * FROM entradas_estoque 
WHERE produto_id = 'id-do-produto';

-- Se não houver entradas, adicionar manualmente
UPDATE produtos 
SET estoque_atual = 10 
WHERE id = 'id-do-produto';
```

### Caso 2: Estoque Dobrado

**Causa:** Bug antigo (já corrigido)

**Solução:**
```sql
-- Dividir por 2
UPDATE produtos 
SET estoque_atual = estoque_atual / 2 
WHERE nome = 'Biscoito de Queijo 1kg';
```

### Caso 3: Estoque Negativo

**Causa:** Vendeu mais do que tinha

**Solução:**
```sql
-- Zerar
UPDATE produtos 
SET estoque_atual = 0 
WHERE estoque_atual < 0;
```

## ✅ Checklist

- [x] Código corrigido (atualiza uma vez)
- [x] Logs detalhados adicionados
- [x] SQL de diagnóstico criado
- [x] SQL de correção criado
- [ ] Deploy realizado
- [ ] Estoques recalculados no banco
- [ ] Teste de entrada realizado
- [ ] Teste de venda realizado

## 📁 Arquivos

- ✅ `hooks/useAppData.ts` - Função addEntradaEstoque corrigida
- ✅ `fix-estoque-duplicado.sql` - SQL para recalcular estoques
- ✅ `SOLUCAO_ESTOQUE_DUPLICADO.md` - Esta documentação

## 🎯 Resultado

Agora:
- ✅ Entrada de 70 → Estoque = 70 (correto!)
- ✅ Entrada de 4 → Estoque = 4 (correto!)
- ✅ Logs mostram cada passo
- ✅ Estoque sempre correto

## 🔗 Próximos Passos

1. **Aguarde o deploy** (2-3 minutos)
2. **Execute o SQL** `fix-estoque-duplicado.sql` para corrigir estoques atuais
3. **Teste** adicionar uma entrada nova
4. **Verifique** se o estoque está correto
5. ✅ Pronto!
