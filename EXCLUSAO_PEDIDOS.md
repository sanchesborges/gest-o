# 🗑️ Exclusão de Pedidos - Gestão de Pedidos

## ✨ Nova Funcionalidade

Agora você pode excluir pedidos diretamente da página de **Gestão de Pedidos** com seleção múltipla.

## 🎯 Como Usar

### 1. Acesse Gestão de Pedidos
- Vá para a página **Gestão de Pedidos**
- Você verá checkboxes ao lado de cada pedido (apenas para ADMIN)

### 2. Selecione os Pedidos
- **Mobile (Cards)**: Checkbox no canto superior esquerdo de cada card
- **Desktop (Tabela)**: Checkbox na primeira coluna de cada linha
- **Selecionar Todos**: Clique no checkbox no cabeçalho da tabela (desktop)

### 3. Exclua os Pedidos
- Após selecionar, aparece o botão **"Excluir (X)"** no topo
- Clique no botão
- Confirme a exclusão no modal
- Os pedidos serão removidos do banco de dados

## 🔄 Restauração de Estoque

**Importante**: Quando um pedido PENDENTE é excluído, o estoque dos produtos é **automaticamente restaurado**.

### Exemplo:
```
Pedido Original:
- 10x Pão de Queijo (estoque foi reduzido em 10)
- 5x Biscoito Polvilho (estoque foi reduzido em 5)

Ao Excluir:
✅ Estoque de Pão de Queijo: +10 unidades
✅ Estoque de Biscoito Polvilho: +5 unidades
```

**Nota**: Pedidos já ENTREGUES também podem ser excluídos, mas o estoque NÃO é restaurado (pois os produtos já foram entregues).

## 🔒 Permissões

- ✅ **ADMIN**: Pode ver checkboxes e excluir pedidos
- ❌ **ENTREGADOR**: Não vê checkboxes, não pode excluir

## 📋 Funcionalidades

### Seleção Múltipla
- ✅ Selecione vários pedidos de uma vez
- ✅ Checkbox "Selecionar Todos" no cabeçalho da tabela
- ✅ Contador mostra quantos pedidos estão selecionados

### Modal de Confirmação
- ✅ Confirma antes de excluir
- ✅ Mostra quantos pedidos serão excluídos
- ✅ Aviso que a ação não pode ser desfeita

### Exclusão no Banco
- ✅ Remove do Supabase (banco de dados)
- ✅ Remove itens do pedido automaticamente (CASCADE)
- ✅ Remove pagamentos relacionados automaticamente (CASCADE)
- ✅ Logs detalhados no console

### Tratamento de Erros
- ✅ Logs detalhados de erro
- ✅ Fallback para localStorage se Supabase falhar
- ✅ Alertas informativos para o usuário

## 🧪 Como Testar

### Teste 1: Excluir um Pedido
1. Vá em **Gestão de Pedidos**
2. Marque o checkbox de um pedido
3. Clique em **"Excluir (1)"**
4. Confirme a exclusão
5. ✅ Verifique se o pedido sumiu
6. ✅ Atualize a página (F5) - pedido não deve voltar

### Teste 2: Excluir Múltiplos Pedidos
1. Marque vários checkboxes
2. Clique em **"Excluir (X)"** onde X é o número de pedidos
3. Confirme
4. ✅ Todos devem ser excluídos

### Teste 3: Selecionar Todos
1. Clique no checkbox do cabeçalho da tabela
2. ✅ Todos os pedidos visíveis devem ser selecionados
3. Clique novamente
4. ✅ Todos devem ser desmarcados

### Teste 4: Restauração de Estoque
1. Anote o estoque atual de um produto
2. Crie um pedido PENDENTE com esse produto
3. ✅ Verifique que o estoque diminuiu
4. Exclua o pedido
5. ✅ Verifique que o estoque foi restaurado

### Teste 5: Verificar no Console
1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Tente excluir um pedido
4. ✅ Veja os logs:
   ```
   🗑️ Tentando excluir pedido: o1234567890
   📦 Restaurando estoque dos produtos...
     ✅ Estoque de Pão de Queijo restaurado: +10
   ✅ Pedido excluído com sucesso do Supabase
   ```

## 🔧 Configuração do Banco de Dados

Para garantir que a exclusão funcione corretamente, execute o script SQL:

### No Supabase Dashboard:
1. Vá em **SQL Editor**
2. Execute o arquivo `fix-pedidos-delete.sql`

### O que o script faz:
- ✅ Configura `ON DELETE CASCADE` para itens_pedido
- ✅ Configura `ON DELETE CASCADE` para pagamentos
- ✅ Cria políticas RLS permissivas para DELETE
- ✅ Verifica a configuração atual

## ⚠️ Avisos Importantes

### 1. Ação Irreversível
- A exclusão é permanente
- Não há como recuperar pedidos excluídos
- Use com cuidado!

### 2. Dados Relacionados
Ao excluir um pedido, também são excluídos:
- ✅ Itens do pedido (itens_pedido)
- ✅ Pagamentos relacionados (pagamentos)

### 3. Estoque
- Pedidos PENDENTES: Estoque é restaurado
- Pedidos ENTREGUES: Estoque NÃO é restaurado

### 4. Filtros
- A seleção funciona apenas nos pedidos visíveis
- Se você filtrar por cliente, só pode selecionar pedidos daquele cliente
- Use "Selecionar Todos" para selecionar apenas os filtrados

## 🐛 Solução de Problemas

### Problema: Pedido some mas volta ao recarregar
**Causa**: Erro ao excluir do Supabase

**Solução**:
1. Abra o console (F12)
2. Veja o erro exato
3. Execute o script `fix-pedidos-delete.sql`
4. Tente novamente

### Problema: Erro de foreign key constraint
**Causa**: Foreign keys não estão configuradas com CASCADE

**Solução**:
1. Execute o script `fix-pedidos-delete.sql` no Supabase
2. Isso configura CASCADE automaticamente

### Problema: Permission denied
**Causa**: Políticas RLS bloqueando DELETE

**Solução**:
1. Execute o script `fix-pedidos-delete.sql`
2. Isso cria políticas permissivas

## 📊 Logs e Debugging

### Logs de Sucesso:
```
🗑️ Tentando excluir pedido: o1234567890
📦 Restaurando estoque dos produtos...
  ✅ Estoque de Pão de Queijo restaurado: +10
  ✅ Estoque de Biscoito Polvilho restaurado: +5
✅ Pedido excluído com sucesso do Supabase
```

### Logs de Erro:
```
❌ ERRO ao excluir pedido do Supabase:
   Código: 23503
   Mensagem: update or delete on table "pedidos" violates foreign key constraint...
   Detalhes: Key (id)=(o1234567890) is still referenced from table "itens_pedido"
```

## 💡 Dicas

1. **Backup**: Considere fazer backup antes de excluir muitos pedidos
2. **Filtros**: Use filtros para encontrar pedidos específicos antes de excluir
3. **Confirmação**: Sempre revise os pedidos selecionados antes de confirmar
4. **Console**: Mantenha o console aberto para ver logs detalhados
5. **Teste**: Teste primeiro com pedidos de teste antes de excluir pedidos reais

## 🎨 Interface

### Mobile (Cards):
- Checkbox no canto superior esquerdo
- Botão "Excluir (X)" aparece no topo quando há seleção

### Desktop (Tabela):
- Coluna de checkbox à esquerda
- Checkbox "Selecionar Todos" no cabeçalho
- Botão "Excluir (X)" no topo da página

### Modal de Confirmação:
- Título: "Confirmar Exclusão"
- Mensagem clara sobre quantos pedidos serão excluídos
- Botões: "Cancelar" e "Excluir"
- Design consistente com o resto da aplicação
