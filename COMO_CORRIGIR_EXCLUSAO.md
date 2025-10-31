# 🔧 Como Corrigir a Exclusão de Produtos

## Problema
Os produtos "Biscoito Polvilho" e "Pão de Queijo" não são excluídos permanentemente do banco de dados.

## Solução Rápida (3 passos)

### 1️⃣ Abra o Console do Navegador
- Pressione **F12** no navegador
- Vá na aba **Console**

### 2️⃣ Tente Excluir um Produto
- Selecione "Biscoito Polvilho" ou "Pão de Queijo"
- Clique em "Excluir"
- **Observe a mensagem de erro no console**

Você verá algo como:
```
❌ ERRO ao excluir produto do Supabase:
   Código: 23503
   Mensagem: update or delete on table "produtos" violates foreign key constraint...
```

### 3️⃣ Execute o Script SQL no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Cole o conteúdo do arquivo `fix-produtos-delete-completo.sql`
5. Clique em **Run** (ou pressione Ctrl+Enter)

## O que o Script Faz

✅ **Ajusta Foreign Keys**: Permite que quando um produto for excluído, os registros relacionados também sejam removidos automaticamente (CASCADE)

✅ **Corrige Políticas RLS**: Garante que a operação DELETE seja permitida

✅ **Verifica Configuração**: Mostra as políticas e constraints atuais

## Testando a Correção

1. Após executar o script SQL
2. Volte à aplicação
3. Tente excluir "Biscoito Polvilho"
4. Atualize a página (F5)
5. ✅ O produto deve ter sido excluído permanentemente

## Se o Problema Persistir

### Opção A: Usar o Teste HTML
1. Abra `test-delete-produtos.html`
2. Cole suas credenciais do Supabase (URL e ANON_KEY)
3. Abra no navegador
4. Teste a exclusão e veja o erro detalhado

### Opção B: Verificar Manualmente no Supabase
1. Vá em **Table Editor** no Supabase
2. Abra a tabela `produtos`
3. Tente excluir manualmente "Biscoito Polvilho"
4. Veja qual erro aparece

## Logs Adicionados

Agora a aplicação mostra logs detalhados no console:
- 🗑️ Quando tenta excluir
- ✅ Quando tem sucesso
- ❌ Quando falha (com código e mensagem do erro)

## Próximos Passos

Depois de corrigir, você pode:
1. Testar a exclusão de outros produtos
2. Verificar se as dependências estão sendo removidas corretamente
3. Considerar implementar soft delete (exclusão lógica) para manter histórico
