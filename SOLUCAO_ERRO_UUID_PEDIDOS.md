# 🔧 Solução: Erro "invalid input syntax for type uuid"

## 🔍 Erro Completo

```
❌ ERRO ao salvar pedido no Supabase
   Código: 22P02
   Mensagem: invalid input syntax for type uuid: "o1762000980789"
```

## 🎯 Causa

O banco de dados Supabase usa **UUID** para os IDs, mas o código estava gerando strings simples:

```typescript
// ❌ ERRADO: Gera string "o1762000980789"
id: `o${Date.now()}`

// ❌ ERRADO: Gera string "c1762000980789"
id: `c${Date.now()}`

// ❌ ERRADO: Gera string "item1762000980789_0"
id: `item${Date.now()}_${index}`
```

## ✅ Solução

Usar `crypto.randomUUID()` para gerar UUIDs válidos:

```typescript
// ✅ CORRETO: Gera UUID válido
id: crypto.randomUUID()
// Exemplo: "550e8400-e29b-41d4-a716-446655440000"
```

## 📊 Estrutura do Banco

Todas as tabelas no Supabase usam UUID:

```sql
-- Produtos
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);

-- Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);

-- Pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);

-- Itens do Pedido
CREATE TABLE itens_pedido (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);

-- Entradas de Estoque
CREATE TABLE entradas_estoque (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);

-- Pagamentos
CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);

-- Entregadores
CREATE TABLE entregadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ...
);
```

## 🔧 Correções Aplicadas

### 1. addPedido

**Antes:**
```typescript
const newPedido: Pedido = {
    ...pedidoData,
    id: `o${Date.now()}` // ❌ String
};
```

**Depois:**
```typescript
const uuid = crypto.randomUUID();
const newPedido: Pedido = {
    ...pedidoData,
    id: uuid // ✅ UUID válido
};
```

### 2. Itens do Pedido

**Antes:**
```typescript
const itensToInsert = newPedido.itens.map((item, index) => ({
    id: `item${Date.now()}_${index}`, // ❌ String
    ...
}));
```

**Depois:**
```typescript
const itensToInsert = newPedido.itens.map((item) => ({
    id: crypto.randomUUID(), // ✅ UUID válido
    ...
}));
```

### 3. addCliente

**Antes:**
```typescript
id: `c${Date.now()}` // ❌ String
```

**Depois:**
```typescript
id: crypto.randomUUID() // ✅ UUID válido
```

### 4. addPagamento

**Antes:**
```typescript
id: `pay${Date.now()}` // ❌ String
```

**Depois:**
```typescript
id: crypto.randomUUID() // ✅ UUID válido
```

### 5. addEntregador

**Antes:**
```typescript
id: `ent${Date.now()}` // ❌ String
```

**Depois:**
```typescript
id: crypto.randomUUID() // ✅ UUID válido
```

### 6. addEntradaEstoque

**Antes:**
```typescript
const tempId = `e${Date.now()}`; // ❌ String
```

**Depois:**
```typescript
const uuid = crypto.randomUUID(); // ✅ UUID válido
```

## 🧪 Como Testar

### 1. Recarregue a Aplicação

Pressione **F5** para recarregar com o código corrigido.

### 2. Teste Criar um Pedido

1. Vá em **Gestão de Pedidos**
2. Clique em **Novo Pedido**
3. Selecione cliente e produtos
4. Clique em **Salvar Pedido**

### 3. Verifique os Logs

Abra o console (F12) e veja:

```
🛒 Tentando salvar pedido: 550e8400-e29b-41d4-a716-446655440000
   Cliente: 123e4567-e89b-12d3-a456-426614174000
   Valor Total: 45.00
   Itens: 2
✅ Pedido salvo no Supabase: [...]
📦 Salvando itens do pedido: 2
✅ Itens salvos no Supabase: [...]
📦 Atualizando estoque dos produtos...
✅ Estoque atualizado!
✅ Pedido adicionado com sucesso!
```

### 4. Verifique no Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor**
3. Abra a tabela **pedidos**
4. ✅ O ID deve ser um UUID válido

## 💡 Diferença: String vs UUID

| Aspecto | String (`o1762000980789`) | UUID (`550e8400-...`) |
|---------|---------------------------|----------------------|
| Formato | Qualquer texto | Formato específico |
| Tamanho | Variável | Sempre 36 caracteres |
| Validação | Nenhuma | Automática pelo banco |
| Colisão | Possível | Praticamente impossível |
| Performance | Menor | Maior |

## 🚨 Erros Comuns

### Erro: "invalid input syntax for type uuid"

**Causa:** Tentando inserir string onde o banco espera UUID

**Solução:** Use `crypto.randomUUID()` em vez de `Date.now()`

### Erro: "crypto is not defined"

**Causa:** Navegador muito antigo

**Solução:** Use polyfill ou biblioteca como `uuid`:
```typescript
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();
```

## ✅ Checklist

- [x] addPedido usa crypto.randomUUID()
- [x] Itens do pedido usam crypto.randomUUID()
- [x] addCliente usa crypto.randomUUID()
- [x] addPagamento usa crypto.randomUUID()
- [x] addEntregador usa crypto.randomUUID()
- [x] addEntradaEstoque usa crypto.randomUUID()
- [ ] Aplicação recarregada (F5)
- [ ] Pedido criado com sucesso
- [ ] Pedido persiste após F5
- [ ] UUID válido no banco

## 📝 Arquivo Modificado

- ✅ `hooks/useAppData.ts` - Todas as funções de criação corrigidas

## 🎯 Resultado

Agora todos os IDs são gerados como UUIDs válidos e os pedidos devem ser salvos corretamente no Supabase! 🎉

## 🔗 Referências

- [UUID no PostgreSQL](https://www.postgresql.org/docs/current/datatype-uuid.html)
- [crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- [UUID RFC 4122](https://www.rfc-editor.org/rfc/rfc4122)
