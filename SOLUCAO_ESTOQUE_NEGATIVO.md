# 🔧 Solução: Erro de Estoque Negativo ao Salvar Pedido

## 🔍 Erro Completo

```
Erro ao salvar itens do pedido: new row for relation "produtos" violates check constraint "produtos_estoque_atual_check"
```

## 🎯 Causa

O banco de dados tem uma **constraint** que impede estoque negativo:

```sql
CHECK (estoque_atual >= 0)
```

Isso acontece quando:
1. Você tenta vender mais produtos do que tem em estoque
2. O estoque já está zerado ou negativo
3. Houve erro anterior que deixou o estoque inconsistente

## ✅ Correções Aplicadas

### 1. Validação de Estoque ANTES de Salvar

O código agora valida se há estoque suficiente **antes** de criar o pedido:

```typescript
// Validar estoque ANTES de salvar
for (const item of newPedido.itens) {
  const produto = produtos.find(p => p.id === item.produtoId);
  if (produto) {
    const novoEstoque = produto.estoqueAtual - item.quantidade;
    
    if (novoEstoque < 0) {
      alert(`Estoque insuficiente!\n\nProduto: ${produto.nome}\nEstoque atual: ${produto.estoqueAtual}\nQuantidade solicitada: ${item.quantidade}`);
      
      // Deletar o pedido que foi criado
      await supabase.from('pedidos').delete().eq('id', newPedido.id);
      return;
    }
  }
}
```

### 2. Ordem Correta de Operações

**Antes (errado):**
1. Salvar pedido ✅
2. Salvar itens ❌ (falha se estoque negativo)
3. Atualizar estoque (nunca chega aqui)

**Depois (correto):**
1. Salvar pedido ✅
2. **Validar estoque** ✅
3. **Atualizar estoque** ✅
4. Salvar itens ✅

### 3. Rollback Automático

Se houver erro, o pedido é deletado automaticamente:

```typescript
if (estoqueError) {
  // Deletar o pedido que foi criado
  await supabase.from('pedidos').delete().eq('id', newPedido.id);
  return;
}
```

## 🧪 Como Testar

### 1. Verificar Estoque Atual

Execute `check-estoque-produtos.sql` no Supabase:

```sql
SELECT 
    nome,
    estoque_atual,
    estoque_minimo,
    CASE 
        WHEN estoque_atual < 0 THEN '❌ NEGATIVO'
        WHEN estoque_atual = 0 THEN '⚠️ ZERADO'
        WHEN estoque_atual < estoque_minimo THEN '⚠️ BAIXO'
        ELSE '✅ OK'
    END as status
FROM produtos
ORDER BY estoque_atual ASC;
```

### 2. Corrigir Estoques Negativos

Se houver produtos com estoque negativo, execute:

```sql
-- Zerar estoques negativos
UPDATE produtos
SET estoque_atual = 0
WHERE estoque_atual < 0;
```

### 3. Adicionar Estoque

Vá em **Entrada de Estoque** e adicione produtos.

### 4. Testar Pedido

1. Vá em **Gestão de Pedidos**
2. Clique em **Novo Pedido**
3. Tente adicionar mais produtos do que tem em estoque
4. ✅ Deve mostrar alerta: "Estoque insuficiente!"

## 📊 Mensagens de Erro

### ✅ Novo Comportamento (correto)

**Estoque insuficiente:**
```
Estoque insuficiente!

Produto: Pão de Queijo 1kg
Estoque atual: 5
Quantidade solicitada: 10

Por favor, ajuste a quantidade ou adicione estoque.
```

**Sucesso:**
```
🛒 Tentando salvar pedido: 550e8400-...
📦 Validando estoque dos produtos...
   Pão de Queijo: 50 - 2 = 48
📦 Atualizando estoque dos produtos...
✅ Estoque atualizado!
📦 Salvando itens do pedido: 2
✅ Itens salvos no Supabase
✅ Pedido adicionado com sucesso!
```

### ❌ Comportamento Antigo (errado)

```
Erro ao salvar itens do pedido: new row for relation "produtos" violates check constraint
```

## 🔍 Verificar Estoque no Sistema

### Via Interface

1. Vá em **Cadastro de Produtos**
2. Veja a coluna **Estoque Atual**
3. Se estiver zerado ou baixo, adicione estoque

### Via SQL

```sql
-- Ver produtos com estoque baixo
SELECT 
    nome,
    estoque_atual,
    estoque_minimo,
    (estoque_minimo - estoque_atual) as faltam
FROM produtos
WHERE estoque_atual < estoque_minimo
ORDER BY faltam DESC;
```

## 🚨 Situações Comuns

### Situação 1: Produto Sem Estoque

**Problema:** Tentou vender produto com estoque zerado

**Solução:**
1. Vá em **Entrada de Estoque**
2. Adicione o produto
3. Tente criar o pedido novamente

### Situação 2: Estoque Negativo no Banco

**Problema:** Banco tem produtos com estoque < 0

**Solução:**
```sql
-- Corrigir
UPDATE produtos
SET estoque_atual = 0
WHERE estoque_atual < 0;
```

### Situação 3: Quantidade Maior que Estoque

**Problema:** Tentou vender 10 unidades mas só tem 5

**Solução:**
- Reduza a quantidade no pedido, OU
- Adicione mais estoque antes de criar o pedido

## 📝 Constraint do Banco

O banco tem esta regra:

```sql
CREATE TABLE produtos (
  ...
  estoque_atual INTEGER NOT NULL DEFAULT 0 CHECK (estoque_atual >= 0),
  ...
);
```

Isso **impede** que o estoque fique negativo, o que é correto!

## ✅ Checklist

- [x] Validação de estoque adicionada
- [x] Ordem de operações corrigida
- [x] Rollback automático implementado
- [x] Mensagem de erro clara
- [ ] Estoque verificado no banco
- [ ] Estoques negativos corrigidos
- [ ] Teste criar pedido com estoque insuficiente
- [ ] Teste criar pedido com estoque suficiente

## 📁 Arquivos

- ✅ `hooks/useAppData.ts` - Validação de estoque
- ✅ `check-estoque-produtos.sql` - Verificar estoque
- ✅ `fix-estoque-negativo.sql` - Corrigir estoque

## 🎯 Resultado

Agora o sistema:
1. ✅ Valida estoque antes de salvar
2. ✅ Mostra mensagem clara se estoque insuficiente
3. ✅ Não permite estoque negativo
4. ✅ Faz rollback se houver erro

## 🔗 Próximos Passos

1. Execute `check-estoque-produtos.sql` para ver o estoque
2. Se houver negativos, execute `fix-estoque-negativo.sql`
3. Adicione estoque via **Entrada de Estoque**
4. Teste criar um pedido
5. ✅ Deve funcionar!
