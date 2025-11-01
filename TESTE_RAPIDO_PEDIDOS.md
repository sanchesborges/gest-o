# 🚀 Teste Rápido: Verificar se Pedidos Estão Salvando

## ⚡ Teste em 3 Passos

### 1️⃣ Abra o Console do Navegador

1. Pressione **F12** no navegador
2. Clique na aba **Console**
3. Deixe aberto

### 2️⃣ Crie um Novo Pedido

1. Vá em **Gestão de Pedidos**
2. Clique em **Novo Pedido**
3. Selecione um cliente
4. Adicione produtos
5. Clique em **Salvar Pedido**

### 3️⃣ Observe os Logs

**✅ Se estiver funcionando, você verá:**

```
🛒 Tentando salvar pedido: o1730000000
   Cliente: c123
   Valor Total: 45.00
   Itens: 2
✅ Pedido salvo no Supabase: [...]
📦 Salvando itens do pedido: 2
✅ Itens salvos no Supabase: [...]
📦 Atualizando estoque dos produtos...
✅ Estoque atualizado!
✅ Pedido adicionado com sucesso!
```

**❌ Se houver erro, você verá:**

```
🛒 Tentando salvar pedido: o1730000000
❌ ERRO ao salvar pedido no Supabase: [mensagem]
   Código: 42501
   Mensagem: permission denied for table pedidos
```

E um **alerta** aparecerá na tela dizendo que houve erro.

## 🔍 Teste de Persistência

1. Após criar o pedido, **pressione F5**
2. ✅ O pedido deve continuar na lista
3. ❌ Se desaparecer, não foi salvo no banco

## 🧪 Teste Alternativo (Arquivo HTML)

Se quiser testar sem usar a aplicação:

1. Abra o arquivo **`test-pedidos.html`** no navegador
2. Clique em **"1. Verificar Conexão"**
3. Clique em **"2. Listar Pedidos"**
4. Clique em **"3. Testar Inserção"**

Isso vai testar diretamente a conexão com o Supabase.

## 📊 Verificar no Supabase

1. Acesse: https://bkwgowsumeylnwbintdz.supabase.co
2. Vá em **Table Editor**
3. Abra a tabela **`pedidos`**
4. ✅ Os pedidos devem estar lá

## 🚨 Se Houver Erro

### Erro: "permission denied"

Execute no SQL Editor do Supabase:

```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'pedidos';

-- Se não houver políticas, criar:
CREATE POLICY "Permitir inserção pública de pedidos" 
ON pedidos FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura pública de pedidos" 
ON pedidos FOR SELECT USING (true);
```

### Erro: "column does not exist"

Verifique se a tabela tem as colunas corretas:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'pedidos';
```

Deve ter:
- id
- cliente_id
- entregador_id
- data
- valor_total
- status
- status_pagamento
- data_vencimento_pagamento
- assinatura

### Erro: "foreign key constraint"

O cliente não existe. Cadastre um cliente primeiro:

1. Vá em **Cadastro de Clientes**
2. Adicione um cliente
3. Tente criar o pedido novamente

## ✅ Tudo Funcionando?

Se você viu os logs de sucesso e o pedido persistiu após F5, está tudo certo! 🎉

## 📝 Próximos Passos

Se ainda houver problemas, copie os logs do console e verifique:

1. Qual é a mensagem de erro exata?
2. O pedido aparece no Supabase?
3. Há algum erro de permissão?

Com essas informações, será possível resolver o problema específico.
