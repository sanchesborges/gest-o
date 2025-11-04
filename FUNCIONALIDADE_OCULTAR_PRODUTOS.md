# Funcionalidade: Ocultar vs Excluir Produtos

## 📋 Resumo

Implementada diferenciação entre **ocultar** e **excluir** produtos nas páginas de Controle de Estoque e Cadastro de Produtos.

## 🎯 Objetivo

Evitar que produtos sejam excluídos permanentemente do banco de dados quando o usuário apenas quer removê-los da visualização do Controle de Estoque.

## 🔄 Comportamento

### 1️⃣ Controle de Estoque (Stock.tsx)

**Ação: OCULTAR**
- ✅ Remove o produto da visualização da página
- ✅ Produto continua no banco de dados
- ✅ Produto continua disponível em:
  - Cadastro de Produtos
  - Modal "Entrada no Estoque"
  - Modal "Novo Pedido" (Adicionar Produto)
  - Gestão de Pedidos

**Como funciona:**
1. Usuário seleciona produtos na página Controle de Estoque
2. Clica no botão "Remover (X)"
3. Aparece modal explicando que o produto será apenas removido da visualização
4. Ao confirmar, o campo `oculto` é marcado como `true` no banco
5. Produto desaparece da lista, mas continua no sistema

### 2️⃣ Cadastro de Produtos (Products.tsx)

**Ação: EXCLUIR PERMANENTEMENTE**
- ⚠️ Remove o produto completamente do banco de dados
- ⚠️ Ação irreversível
- ⚠️ Modal de confirmação com aviso destacado

**Como funciona:**
1. Usuário seleciona produtos na página Cadastro de Produtos
2. Clica no botão "Excluir (X)"
3. Aparece modal com aviso de exclusão permanente
4. Ao confirmar, o produto é deletado do banco de dados
5. Produto desaparece de todo o sistema

## 🗄️ Alterações no Banco de Dados

### Nova Coluna: `oculto`

```sql
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS oculto BOOLEAN DEFAULT FALSE;
```

- **Tipo:** BOOLEAN
- **Padrão:** FALSE
- **Propósito:** Marcar produtos ocultos da visualização do Controle de Estoque

## 💻 Alterações no Código

### 1. Hook useAppData.ts

**Nova função adicionada:**
```typescript
ocultarProduto: (produtoId: string) => Promise<void>
```

**Modificação no carregamento:**
```typescript
// Agora filtra produtos ocultos
.select('*')
.eq('oculto', false)
```

### 2. Stock.tsx

**Mudanças:**
- Usa `ocultarProduto` em vez de `deleteProduto`
- Botão mudou de "Excluir" para "Remover"
- Cor do botão mudou de vermelho para laranja
- Modal explica que produto não será excluído

### 3. Products.tsx

**Mudanças:**
- Mantém `deleteProduto` (exclusão permanente)
- Modal de confirmação mais enfático
- Aviso destacado sobre irreversibilidade

## 📝 Instruções de Uso

### Para Ocultar um Produto (Controle de Estoque):

1. Acesse **Controle de Estoque**
2. Marque a caixa de seleção do(s) produto(s)
3. Clique em **"Remover (X)"**
4. Confirme no modal
5. ✅ Produto removido da visualização, mas continua no sistema

### Para Excluir Permanentemente (Cadastro de Produtos):

1. Acesse **Cadastro de Produtos**
2. Marque a caixa de seleção do(s) produto(s)
3. Clique em **"Excluir (X)"**
4. Leia o aviso de exclusão permanente
5. Confirme no modal
6. ⚠️ Produto excluído permanentemente do banco

## 🔍 Onde Produtos Ocultos Ainda Aparecem

Produtos ocultos do Controle de Estoque continuam visíveis em:

- ✅ **Cadastro de Produtos** - Para gerenciamento completo
- ✅ **Modal "Entrada no Estoque"** - Para adicionar estoque
- ✅ **Modal "Novo Pedido"** - Para criar pedidos
- ✅ **Gestão de Pedidos** - Para visualizar pedidos existentes

## 🎨 Diferenças Visuais

| Página | Botão | Cor | Modal |
|--------|-------|-----|-------|
| Controle de Estoque | "Remover" | Laranja | Informativo |
| Cadastro de Produtos | "Excluir" | Vermelho | Aviso Crítico |

## 🚀 Próximos Passos

1. Execute o SQL para adicionar a coluna `oculto`:
   ```bash
   # No Supabase SQL Editor
   supabase/add-oculto-field.sql
   ```

2. Teste a funcionalidade:
   - Oculte um produto no Controle de Estoque
   - Verifique que ele ainda aparece em Cadastro de Produtos
   - Verifique que ele ainda aparece no modal de Entrada no Estoque
   - Verifique que ele ainda aparece no modal de Novo Pedido

3. Teste a exclusão permanente:
   - Exclua um produto em Cadastro de Produtos
   - Verifique que ele desaparece de todo o sistema

## ✅ Benefícios

1. **Segurança:** Evita exclusões acidentais
2. **Flexibilidade:** Produtos podem ser temporariamente removidos da visualização
3. **Histórico:** Produtos continuam disponíveis para pedidos antigos
4. **Usabilidade:** Interface mais clara sobre o que cada ação faz
