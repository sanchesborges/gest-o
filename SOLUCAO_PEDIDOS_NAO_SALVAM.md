# 🔧 Solução: Pedidos Não Estão Sendo Salvos no Banco

## 🔍 Problema Identificado

Os pedidos criados na página "Gestão de Pedidos" → "Novo Pedido" **desaparecem ao recarregar a página**.

### Sintomas:
- ✅ Pedido aparece na lista após criação
- ❌ Pedido desaparece ao pressionar F5 (recarregar)
- ❌ Pedido não está sendo salvo no Supabase
- ⚠️ Nenhum erro visível para o usuário

## 🎯 Causa Raiz

O código estava **silenciosamente falhando** ao salvar no Supabase, mas:
1. Não mostrava o erro para o usuário
2. Salvava apenas no estado local do React
3. Não verificava se a operação teve sucesso

## ✅ Correções Aplicadas

### 1. Adicionados Logs Detalhados

Agora o código registra cada etapa:

```typescript
console.log('🛒 Tentando salvar pedido:', newPedido.id);
console.log('   Cliente:', newPedido.clienteId);
console.log('   Valor Total:', newPedido.valorTotal);
console.log('   Itens:', newPedido.itens.length);
```

### 2. Verificação de Erros

Antes o código ignorava erros:
```typescript
if (pedidoError) {
  console.error('Erro ao salvar pedido:', pedidoError); // ❌ Só logava
}
```

Agora mostra alerta e para a execução:
```typescript
if (pedidoError) {
  console.error('❌ ERRO ao salvar pedido no Supabase:', pedidoError);
  console.error('   Código:', pedidoError.code);
  console.error('   Mensagem:', pedidoError.message);
  
  alert(`Erro ao salvar pedido: ${pedidoError.message}\n\nO pedido foi salvo localmente, mas pode desaparecer ao recarregar a página.`);
  
  saveToStorage('pedidos', [...pedidos, newPedido]);
  setPedidos(prev => [...prev, newPedido]);
  return; // ✅ Para aqui se houver erro
}
```

### 3. Confirmação de Sucesso

Agora confirma que salvou:
```typescript
console.log('✅ Pedido salvo no Supabase:', pedidoData);
console.log('✅ Itens salvos no Supabase:', itensData);
console.log('✅ Estoque atualizado!');
console.log('✅ Pedido adicionado com sucesso!');
```

## 🧪 Como Testar

### Teste 1: Verificar Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba "Console"
3. Crie um novo pedido
4. Observe os logs:

**Se estiver funcionando:**
```
🛒 Tentando salvar pedido: o1234567890
   Cliente: c123
   Valor Total: 45.00
   Itens: 2
✅ Pedido salvo no Supabase: [...]
📦 Salvando itens do pedido: 2
✅ Itens salvos no Supabase: [...]
📦 Atualizando estoque dos produtos...
   Pão de Queijo: 50 - 2 = 48
✅ Estoque atualizado!
✅ Pedido adicionado com sucesso!
```

**Se houver erro:**
```
🛒 Tentando salvar pedido: o1234567890
❌ ERRO ao salvar pedido no Supabase: [mensagem do erro]
   Código: 42501
   Mensagem: permission denied for table pedidos
```

### Teste 2: Verificar Persistência

1. Crie um novo pedido
2. Veja se aparece na lista
3. **Pressione F5** para recarregar
4. ✅ O pedido deve continuar aparecendo

### Teste 3: Verificar no Supabase

1. Acesse o Supabase Dashboard
2. Vá em "Table Editor"
3. Abra a tabela `pedidos`
4. ✅ O pedido deve estar lá

## 🔍 Diagnóstico de Problemas

### Use o Arquivo de Teste

Abra o arquivo `test-pedidos.html` no navegador:

1. **Substitua as credenciais** do Supabase no arquivo
2. Clique em "1. Verificar Conexão"
3. Clique em "2. Listar Pedidos"
4. Clique em "3. Testar Inserção"

### Execute o SQL de Verificação

No Supabase SQL Editor, execute `check-pedidos-table.sql`:

```sql
-- Ver estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos';

-- Ver pedidos salvos
SELECT COUNT(*) as total_pedidos FROM pedidos;
```

## 🚨 Possíveis Erros e Soluções

### Erro: "permission denied for table pedidos"

**Causa:** RLS (Row Level Security) bloqueando inserções

**Solução:** Execute no SQL Editor:
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'pedidos';

-- Criar política se não existir
CREATE POLICY "Permitir inserção pública de pedidos" 
ON pedidos FOR INSERT WITH CHECK (true);
```

### Erro: "null value in column violates not-null constraint"

**Causa:** Algum campo obrigatório está vazio

**Solução:** Verifique os logs para ver qual campo está null:
```typescript
console.log('   Cliente:', newPedido.clienteId); // Não pode ser null
console.log('   Valor Total:', newPedido.valorTotal); // Não pode ser null
```

### Erro: "foreign key constraint"

**Causa:** Cliente ou produto não existe no banco

**Solução:** Verifique se o cliente existe:
```sql
SELECT id, nome FROM clientes WHERE id = 'c123';
```

## 📊 Fluxo de Salvamento

```
1. Usuário preenche formulário
   ↓
2. Clica em "Salvar Pedido"
   ↓
3. addPedido() é chamado
   ↓
4. Tenta salvar no Supabase
   ├─ ✅ Sucesso → Salva localmente
   └─ ❌ Erro → Mostra alerta + Salva só localmente
   ↓
5. Atualiza estoque
   ↓
6. Atualiza interface
```

## ✅ Checklist de Verificação

- [ ] Console mostra logs de sucesso
- [ ] Pedido persiste após F5
- [ ] Pedido aparece no Supabase
- [ ] Estoque é atualizado corretamente
- [ ] Itens do pedido são salvos
- [ ] Nenhum erro no console

## 🎯 Próximos Passos

Se ainda houver problemas:

1. **Abra o console do navegador** (F12)
2. **Crie um pedido**
3. **Copie TODOS os logs** que aparecerem
4. **Tire um print** da mensagem de erro (se houver)
5. **Verifique no Supabase** se o pedido foi salvo

Com essas informações, será possível identificar exatamente onde está o problema!

## 📝 Arquivos Modificados

- ✅ `hooks/useAppData.ts` - Função `addPedido` com logs e verificações
- ✅ `test-pedidos.html` - Arquivo de teste criado
- ✅ `check-pedidos-table.sql` - SQL de verificação criado

## 🔗 Arquivos Relacionados

- `components/OrderForm.tsx` - Formulário de criação de pedidos
- `components/Orders.tsx` - Lista de pedidos
- `supabase-schema.sql` - Schema do banco de dados
