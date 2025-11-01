# 🔧 Correção: Erro ao Salvar Pedido - Estoque Negativo

## 🐛 Problema

Ao criar um pedido na página **Gestão de Pedidos**, aparecia este erro:

```
Erro ao salvar itens do pedido: new row for relation "produtos" violates check constraint "produtos_estoque_atual_check"
```

Mas o pedido era salvo mesmo assim, causando inconsistência nos dados.

## 🔍 Causa Raiz

O banco de dados tem uma **constraint** que impede estoque negativo:

```sql
CHECK (estoque_atual >= 0)
```

O problema estava na **ordem das operações** e na **fonte dos dados**:

### Fluxo Antigo (Errado):

1. ✅ Salvar pedido
2. ❌ Validar estoque usando **estado local React** (pode estar desatualizado)
3. ❌ Atualizar estoque (pode ficar negativo)
4. ❌ Salvar itens (falha se estoque ficou negativo)
5. ❌ Atualizar estado local novamente (duplicação)

### Problemas:

- **Estado local desatualizado**: O React não atualiza o estado imediatamente
- **Validação incorreta**: Validava com dados antigos
- **Atualização duplicada**: Estado local era atualizado 2 vezes
- **Ordem errada**: Tentava salvar itens depois de atualizar estoque

## ✅ Solução Implementada

### Novo Fluxo (Correto):

1. ✅ Salvar pedido
2. ✅ **Buscar estoque atual do BANCO** (dados sempre atualizados)
3. ✅ Validar se há estoque suficiente
4. ✅ Atualizar estoque no banco
5. ✅ Salvar itens do pedido
6. ✅ Atualizar estado local UMA vez com valores corretos

### Mudanças no Código:

```typescript
// ANTES: Usava estado local (pode estar desatualizado)
const produto = produtos.find(p => p.id === item.produtoId);
const novoEstoque = produto.estoqueAtual - item.quantidade;

// DEPOIS: Busca do banco (sempre atualizado)
const { data: produtoAtual } = await supabase
  .from('produtos')
  .select('estoque_atual, nome')
  .eq('id', item.produtoId)
  .single();

const novoEstoque = produtoAtual.estoque_atual - item.quantidade;
```

### Validação Antes de Atualizar:

```typescript
if (novoEstoque < 0) {
  alert(`Estoque insuficiente!\n\nProduto: ${produtoAtual.nome}\nEstoque atual: ${estoqueAtual}\nQuantidade solicitada: ${item.quantidade}`);
  
  // Deletar o pedido que foi criado
  await supabase.from('pedidos').delete().eq('id', newPedido.id);
  return;
}
```

### Atualização Única do Estado Local:

```typescript
// Guardar novos estoques durante o loop
const estoqueAtualizado: { [key: string]: number } = {};
estoqueAtualizado[item.produtoId] = novoEstoque;

// Atualizar estado local UMA vez no final
setProdutos(prevProdutos =>
  prevProdutos.map(p =>
    estoqueAtualizado[p.id] !== undefined
      ? { ...p, estoqueAtual: estoqueAtualizado[p.id] }
      : p
  )
);
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

### 2. Corrigir Estoques Negativos (se houver)

Se encontrar produtos com estoque negativo, execute `fix-estoque-negativo.sql`:

```sql
-- Zerar estoques negativos
UPDATE produtos
SET estoque_atual = 0
WHERE estoque_atual < 0;
```

### 3. Adicionar Estoque

Vá em **Controle de Estoque** → **Registrar Entrada** e adicione produtos.

### 4. Testar Pedido com Estoque Insuficiente

1. Vá em **Gestão de Pedidos**
2. Clique em **Novo Pedido**
3. Tente adicionar mais produtos do que tem em estoque
4. ✅ Deve mostrar alerta claro: "Estoque insuficiente!"
5. ✅ Pedido NÃO deve ser salvo

### 5. Testar Pedido com Estoque Suficiente

1. Vá em **Gestão de Pedidos**
2. Clique em **Novo Pedido**
3. Adicione produtos com quantidade menor que o estoque
4. ✅ Deve salvar com sucesso
5. ✅ Estoque deve ser atualizado corretamente

## 📊 Logs no Console

### Sucesso:

```
🛒 Tentando salvar pedido: 550e8400-...
   Cliente: abc123
   Valor Total: 150.00
   Itens: 2
✅ Pedido salvo no Supabase
📦 Validando e atualizando estoque dos produtos...
   Biscoito Maná: 50 - 2 = 48
   Pão de Queijo: 30 - 5 = 25
📦 Salvando itens do pedido: 2
✅ Itens salvos no Supabase
✅ Pedido adicionado com sucesso!
```

### Estoque Insuficiente:

```
🛒 Tentando salvar pedido: 550e8400-...
✅ Pedido salvo no Supabase
📦 Validando e atualizando estoque dos produtos...
   Biscoito Maná: 5 - 10 = -5
❌ Estoque insuficiente para Biscoito Maná
[ALERTA] Estoque insuficiente!
Produto: Biscoito Maná
Estoque atual: 5
Quantidade solicitada: 10
```

## 🚨 Situações Comuns

### Situação 1: Produto Sem Estoque

**Sintoma:** Erro ao criar pedido

**Solução:**
1. Vá em **Controle de Estoque**
2. Clique em **Registrar Entrada**
3. Adicione o produto
4. Tente criar o pedido novamente

### Situação 2: Estoque Negativo no Banco

**Sintoma:** Produtos com estoque < 0 no banco

**Solução:**
```sql
UPDATE produtos
SET estoque_atual = 0
WHERE estoque_atual < 0;
```

### Situação 3: Quantidade Maior que Estoque

**Sintoma:** Alerta "Estoque insuficiente"

**Solução:**
- Reduza a quantidade no pedido, OU
- Adicione mais estoque antes de criar o pedido

## 📁 Arquivos Modificados

- ✅ `hooks/useAppData.ts` - Função `addPedido` corrigida
- ✅ `check-estoque-produtos.sql` - Script para verificar estoque
- ✅ `fix-estoque-negativo.sql` - Script para corrigir estoque negativo
- ✅ `CORRECAO_ERRO_PEDIDO_ESTOQUE.md` - Esta documentação

## ✨ Benefícios

- ✅ Busca estoque sempre do banco (dados atualizados)
- ✅ Valida antes de atualizar (previne estoque negativo)
- ✅ Mensagem de erro clara para o usuário
- ✅ Rollback automático se houver erro
- ✅ Estado local atualizado corretamente UMA vez
- ✅ Logs detalhados para debug

## 🎯 Resultado

Agora o sistema:
1. ✅ Busca estoque do banco (sempre atualizado)
2. ✅ Valida antes de salvar
3. ✅ Mostra mensagem clara se estoque insuficiente
4. ✅ Não permite estoque negativo
5. ✅ Faz rollback automático se houver erro
6. ✅ Atualiza estado local corretamente
