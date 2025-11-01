# 🔍 Debug: Estoque Não Aparece Após Entrada

## 🎯 Problema

Ao registrar entrada de estoque:
- Alguns produtos não aparecem na lista
- Alguns mostram quantidade zerada mesmo após adicionar
- Outros mostram corretamente

## 🔍 Possíveis Causas

### 1. Estado Local Desatualizado
O componente mostra dados do estado React, não do banco diretamente.

**Solução:** Recarregar a página (F5)

### 2. Entrada Não Foi Salva no Banco
A entrada foi salva apenas localmente, não no Supabase.

**Solução:** Verificar logs no console

### 3. Estoque Calculado Errado
Bug anterior que duplicava ou zerava estoque.

**Solução:** Recalcular estoques

## 🧪 Como Diagnosticar

### Passo 1: Verificar Console do Navegador

Abra o console (F12) e procure por:

**✅ Sucesso:**
```
📦 Salvando entrada de estoque...
   Produto: Pão de Queijo 1kg
   Estoque ANTES: 0
   Quantidade a ADICIONAR: 10
   Estoque DEPOIS deveria ser: 10
✅ Estado atualizado: 0 + 10 = 10
✅ Entrada salva localmente!
📦 Atualizando estoque de Pão de Queijo 1kg: 0 + 10 = 10
✅ Estoque atualizado no Supabase!
✅ Entrada salva no Supabase!
```

**❌ Erro:**
```
❌ Erro ao buscar produto: ...
❌ Erro ao atualizar estoque no Supabase: ...
⚠️ Entrada salva apenas localmente
```

### Passo 2: Verificar no Banco

Execute `debug-estoque-entrada.sql` no Supabase:

```sql
-- Ver últimas entradas
SELECT 
    p.nome as produto,
    e.quantidade,
    e.fornecedor,
    e.data_recebimento,
    p.estoque_atual
FROM entradas_estoque e
JOIN produtos p ON e.produto_id = p.id
ORDER BY e.created_at DESC
LIMIT 10;
```

Isso mostra:
- Quais entradas foram salvas
- Qual o estoque atual de cada produto

### Passo 3: Comparar Entradas vs Estoque

```sql
SELECT 
    p.nome,
    p.estoque_atual as estoque_sistema,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    COALESCE(SUM(ip.quantidade), 0) as total_vendas,
    (COALESCE(SUM(e.quantidade), 0) - COALESCE(SUM(ip.quantidade), 0)) as estoque_correto
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;
```

Compara:
- **estoque_sistema:** O que está no banco
- **total_entradas:** Soma de todas as entradas
- **estoque_correto:** O que deveria ser

## 🔧 Soluções

### Solução 1: Recarregar a Página

**Quando usar:** Entrada foi salva mas não aparece

**Como fazer:**
1. Pressione **F5** ou **Ctrl + R**
2. Verifique se o estoque aparece agora

### Solução 2: Recalcular Estoques

**Quando usar:** Estoque está errado no banco

**Como fazer:**

Execute `fix-estoque-simples.sql`:

```sql
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

### Solução 3: Limpar Cache do Navegador

**Quando usar:** Página não atualiza mesmo após F5

**Como fazer:**
1. Pressione **Ctrl + Shift + Delete**
2. Marque "Dados em cache"
3. Clique em "Limpar dados"
4. Recarregue a página

### Solução 4: Hard Refresh

**Quando usar:** Código antigo ainda está em cache

**Como fazer:**
1. Pressione **Ctrl + Shift + R** (Windows/Linux)
2. Ou **Cmd + Shift + R** (Mac)

## 📊 Cenários Comuns

### Cenário 1: Entrada Salva mas Não Aparece

**Sintoma:** Adicionou 10 unidades, mas mostra 0

**Causa:** Estado local não foi atualizado

**Solução:**
1. Recarregue a página (F5)
2. Se ainda não aparecer, execute SQL de recálculo

### Cenário 2: Alguns Produtos Aparecem, Outros Não

**Sintoma:** Produto A mostra 10, Produto B mostra 0

**Causa:** Entrada do Produto B não foi salva no banco

**Solução:**
1. Verifique logs no console
2. Adicione entrada novamente
3. Se erro persistir, verifique permissões RLS

### Cenário 3: Estoque Dobrado

**Sintoma:** Adicionou 10, mostra 20

**Causa:** Bug antigo (já corrigido)

**Solução:**
1. Execute SQL de recálculo
2. Aguarde deploy do código corrigido

### Cenário 4: Estoque Zerado Após Entrada

**Sintoma:** Tinha 10, adicionou 5, mostra 0

**Causa:** Erro ao atualizar banco

**Solução:**
1. Verifique logs no console
2. Execute SQL de recálculo
3. Adicione entrada novamente

## ✅ Checklist de Verificação

- [ ] Abri o console (F12)
- [ ] Vi os logs da entrada
- [ ] Logs mostram sucesso ou erro?
- [ ] Recarreguei a página (F5)
- [ ] Executei SQL de verificação
- [ ] Entrada está no banco?
- [ ] Estoque está correto no banco?
- [ ] Executei SQL de recálculo (se necessário)
- [ ] Limpei cache do navegador (se necessário)
- [ ] Fiz hard refresh (Ctrl + Shift + R)

## 🎯 Fluxo de Debug

```
1. Adicionar entrada
   ↓
2. Verificar console
   ├─ ✅ Sucesso → Recarregar página
   └─ ❌ Erro → Ver mensagem de erro
   ↓
3. Verificar banco (SQL)
   ├─ ✅ Entrada salva → Recalcular estoque
   └─ ❌ Entrada não salva → Adicionar novamente
   ↓
4. Recalcular estoque (SQL)
   ↓
5. Recarregar página
   ↓
6. ✅ Estoque correto!
```

## 📁 Arquivos de Debug

- `debug-estoque-entrada.sql` - Verificar entradas e estoque
- `fix-estoque-simples.sql` - Recalcular estoques
- `check-estoque-produtos.sql` - Ver status de todos os produtos

## 🚨 Se Nada Funcionar

1. **Copie os logs do console** (tudo que aparecer)
2. **Execute todos os SQLs de debug**
3. **Tire prints** do que está aparecendo
4. **Anote** quais produtos têm problema

Com essas informações, será possível identificar o problema específico!

## 💡 Dica Rápida

**Sempre que adicionar entrada:**
1. Veja os logs no console
2. Recarregue a página (F5)
3. Verifique se apareceu

Se não aparecer, há um problema que precisa ser investigado!
