# Solução: Produtos não são excluídos permanentemente

## 🔍 Problema Identificado

Os produtos "Biscoito Polvilho" e "Pão de Queijo" somem da interface ao serem excluídos, mas voltam quando a página é atualizada. Isso indica que:

1. A exclusão funciona localmente (no estado React)
2. Mas falha no Supabase (banco de dados)
3. Ao recarregar, os dados são buscados novamente do Supabase

## 🎯 Causas Possíveis

### 1. Políticas RLS (Row Level Security)
O Supabase pode estar bloqueando a operação DELETE devido às políticas de segurança.

### 2. Foreign Keys sem CASCADE
Se existem registros relacionados em outras tabelas (como `itens_pedido` ou `entradas_estoque`), o banco impede a exclusão para manter a integridade referencial.

## ✅ Solução

### Opção 1: Executar SQL no Supabase (Recomendado)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute o script `fix-produtos-delete-completo.sql`

Este script irá:
- ✅ Ajustar as foreign keys para `ON DELETE CASCADE`
- ✅ Criar políticas RLS permissivas para DELETE
- ✅ Verificar a configuração atual

### Opção 2: Testar com HTML

1. Abra o arquivo `test-delete-produtos.html`
2. Cole suas credenciais do Supabase:
   ```javascript
   const SUPABASE_URL = 'sua-url-aqui';
   const SUPABASE_ANON_KEY = 'sua-chave-aqui';
   ```
3. Abra o arquivo no navegador
4. Clique em "Tentar Excluir" para ver o erro exato

### Opção 3: Verificar no Console do Navegador

Abra o DevTools (F12) e veja os erros no console quando tentar excluir. Procure por:
- `foreign key constraint`
- `policy violation`
- `permission denied`

## 🔧 Script SQL Completo

```sql
-- Ajustar Foreign Keys para CASCADE
ALTER TABLE itens_pedido 
DROP CONSTRAINT IF EXISTS itens_pedido_produto_id_fkey;

ALTER TABLE itens_pedido
ADD CONSTRAINT itens_pedido_produto_id_fkey 
FOREIGN KEY (produto_id) 
REFERENCES produtos(id) 
ON DELETE CASCADE;

ALTER TABLE entradas_estoque 
DROP CONSTRAINT IF EXISTS entradas_estoque_produto_id_fkey;

ALTER TABLE entradas_estoque
ADD CONSTRAINT entradas_estoque_produto_id_fkey 
FOREIGN KEY (produto_id) 
REFERENCES produtos(id) 
ON DELETE CASCADE;

-- Criar política RLS para DELETE
DROP POLICY IF EXISTS "Permitir delete de produtos para todos" ON produtos;

CREATE POLICY "Permitir delete de produtos para todos"
ON produtos
FOR DELETE
TO public
USING (true);
```

## 🧪 Como Testar

1. Execute o script SQL no Supabase
2. Volte à aplicação
3. Tente excluir "Biscoito Polvilho" ou "Pão de Queijo"
4. Atualize a página (F5)
5. Verifique se os produtos foram realmente excluídos

## 📝 Notas Importantes

- **ON DELETE CASCADE**: Quando um produto é excluído, todos os registros relacionados (itens de pedido, entradas de estoque) também serão excluídos automaticamente
- **Backup**: Considere fazer backup antes de executar o script
- **Produção**: Em produção, você pode querer usar `ON DELETE RESTRICT` e implementar uma exclusão lógica (soft delete) ao invés de física

## 🔍 Verificação Adicional

Se o problema persistir, verifique:

1. **Console do navegador**: Erros JavaScript
2. **Network tab**: Resposta da API do Supabase
3. **Supabase Logs**: Logs de erro no dashboard
4. **Permissões**: Se o usuário tem permissão de DELETE

## 💡 Alternativa: Soft Delete

Se preferir não excluir permanentemente, implemente um soft delete:

```sql
-- Adicionar coluna deleted_at
ALTER TABLE produtos ADD COLUMN deleted_at TIMESTAMP;

-- Atualizar queries para ignorar produtos deletados
-- SELECT * FROM produtos WHERE deleted_at IS NULL;
```

Então, ao invés de DELETE, use UPDATE:
```javascript
await supabase
  .from('produtos')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', produtoId);
```
