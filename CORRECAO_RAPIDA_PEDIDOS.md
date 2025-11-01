# ⚡ Correção Rápida: Pedidos Não Salvam

## 🎯 Problema
Modal não fecha ao salvar pedido e erro no console: `Cannot read properties of undefined (reading 'includes')`

## ✅ Solução em 3 Passos

### 1️⃣ Execute o SQL no Supabase

1. Acesse: https://bkwgowsumeylnwbintdz.supabase.co
2. Vá em **SQL Editor**
3. Cole e execute:

```sql
-- As colunas já existem como ENUM no banco
-- Apenas atualizar valores NULL

UPDATE clientes 
SET tipo = 'Mercado'::tipo_cliente
WHERE tipo IS NULL;

UPDATE clientes 
SET condicao_pagamento = '15 dias'::condicao_pagamento
WHERE condicao_pagamento IS NULL;

-- Verificar
SELECT id, nome, tipo::text, condicao_pagamento::text FROM clientes;
```

### 2️⃣ Recarregue a Aplicação

Pressione **F5** no navegador para recarregar os dados.

### 3️⃣ Teste Criar um Pedido

1. Vá em **Gestão de Pedidos**
2. Clique em **Novo Pedido**
3. Selecione cliente e produtos
4. Clique em **Salvar Pedido**
5. ✅ Modal deve fechar
6. ✅ Pedido deve aparecer na lista

## 🔍 Verificar se Funcionou

Abra o console (F12) e veja:

```
✅ Pedido salvo no Supabase
✅ Itens salvos no Supabase
✅ Estoque atualizado!
✅ Pedido adicionado com sucesso!
```

## 🚨 Se Ainda Houver Erro

Execute novamente o SQL e limpe o cache:
- **Ctrl + Shift + Delete**
- Marque "Dados em cache"
- Clique em "Limpar dados"
- Recarregue (F5)

## 📝 O Que Foi Corrigido

1. ✅ Valores NULL atualizados na tabela clientes (tipo e condicao_pagamento)
2. ✅ Código agora mapeia corretamente os campos do banco
3. ✅ Código defensivo para evitar erro com `undefined`
4. ✅ Try-catch para capturar erros
5. ✅ IDs agora são gerados como UUID válidos (não mais strings)

Pronto! Agora os pedidos devem salvar corretamente! 🎉
