# 🗄️ Configuração do Supabase

## Passo 1: Criar as Tabelas no Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto: **bkwgowsumeylnwbintdz**
3. Vá em **SQL Editor** (no menu lateral)
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `supabase-schema.sql`
6. Cole no editor SQL
7. Clique em **Run** (ou pressione Ctrl+Enter)

## Passo 2: Verificar se as Tabelas foram Criadas

1. Vá em **Table Editor** (no menu lateral)
2. Você deve ver as seguintes tabelas:
   - ✅ produtos
   - ✅ clientes
   - ✅ entregadores
   - ✅ pedidos
   - ✅ itens_pedido
   - ✅ entradas_estoque
   - ✅ pagamentos

## Passo 3: Migrar Dados Existentes (Opcional)

Se você já tem dados no localStorage e quer mantê-los:

1. Abra o console do navegador (F12)
2. Execute o script `debug-storage.js` para ver os dados atuais
3. Use o painel do Supabase para inserir os dados manualmente
4. Ou aguarde - o sistema vai começar a salvar novos dados automaticamente

## Estrutura das Tabelas

### produtos
- id (TEXT) - PK
- nome (TEXT)
- tamanho_pacote (TEXT)
- preco_unitario (DECIMAL)
- estoque_atual (INTEGER)

### clientes
- id (TEXT) - PK
- nome (TEXT)
- telefone (TEXT)
- endereco (TEXT)
- bairro (TEXT)

### entregadores
- id (TEXT) - PK
- nome (TEXT)
- telefone (TEXT)
- veiculo (TEXT)

### pedidos
- id (TEXT) - PK
- cliente_id (TEXT) - FK
- entregador_id (TEXT) - FK
- data (TIMESTAMP)
- valor_total (DECIMAL)
- status (TEXT)
- status_pagamento (TEXT)
- data_vencimento_pagamento (TIMESTAMP)
- assinatura (TEXT)

### itens_pedido
- id (TEXT) - PK
- pedido_id (TEXT) - FK
- produto_id (TEXT) - FK
- quantidade (INTEGER)
- preco_unitario (DECIMAL)

### entradas_estoque
- id (TEXT) - PK
- produto_id (TEXT) - FK
- quantidade (INTEGER)
- fornecedor (TEXT)
- data_recebimento (TIMESTAMP)
- data_validade (TIMESTAMP)

### pagamentos
- id (TEXT) - PK
- pedido_id (TEXT) - FK
- valor (DECIMAL)
- metodo (TEXT)
- data (TIMESTAMP)

## Segurança (RLS - Row Level Security)

As políticas estão configuradas para permitir acesso público por enquanto.

**⚠️ IMPORTANTE:** Para produção, você deve:
1. Implementar autenticação de usuários
2. Ajustar as políticas RLS para restringir acesso
3. Criar roles específicos (admin, entregador, etc.)

## Próximos Passos

Após criar as tabelas:
1. O sistema vai começar a salvar dados no Supabase automaticamente
2. Dados serão sincronizados entre todos os dispositivos
3. Você pode visualizar os dados no painel do Supabase em tempo real

## Troubleshooting

### Erro: "relation already exists"
- As tabelas já foram criadas. Tudo certo!

### Erro: "permission denied"
- Verifique se as políticas RLS estão corretas
- Verifique se a chave anon está correta

### Dados não aparecem
- Verifique o console do navegador (F12) para erros
- Verifique se as tabelas foram criadas corretamente
- Verifique a conexão com o Supabase

## Comandos Úteis

### Ver todos os dados de uma tabela
```sql
SELECT * FROM entregadores;
```

### Limpar uma tabela
```sql
DELETE FROM entregadores;
```

### Contar registros
```sql
SELECT COUNT(*) FROM entregadores;
```
