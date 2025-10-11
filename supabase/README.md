# 🗄️ Configuração do Banco de Dados Supabase

Este diretório contém os arquivos SQL necessários para configurar o banco de dados do **Shirley** no Supabase.

## 📁 Arquivos

- **`schema.sql`** - Schema completo do banco de dados (tabelas, índices, triggers, views)
- **`seed.sql`** - Dados iniciais para popular o banco (produtos, clientes, entregadores)

## 🚀 Como Configurar

### 1️⃣ Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: Shirley
   - **Database Password**: (escolha uma senha forte)
   - **Region**: Escolha a mais próxima de você
5. Clique em **"Create new project"**
6. Aguarde alguns minutos até o projeto ser criado

### 2️⃣ Executar o Schema

1. No painel do Supabase, vá em **"SQL Editor"** (ícone de banco de dados)
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo **`schema.sql`**
4. Cole no editor
5. Clique em **"Run"** (ou pressione Ctrl+Enter)
6. Aguarde a execução (pode levar alguns segundos)
7. Você verá a mensagem de sucesso ✅

### 3️⃣ Popular com Dados Iniciais (Opcional)

1. Ainda no **SQL Editor**, clique em **"New query"**
2. Copie todo o conteúdo do arquivo **`seed.sql`**
3. Cole no editor
4. Clique em **"Run"**
5. Você verá uma tabela mostrando quantos registros foram inseridos

### 4️⃣ Obter Credenciais da API

1. No painel do Supabase, vá em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave pública)
4. Guarde essas informações para configurar no app

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `produtos` | Catálogo de produtos (biscoitos, pão de queijo, etc) |
| `clientes` | Cadastro de clientes (padarias, mercados, restaurantes) |
| `entregadores` | Cadastro de entregadores |
| `pedidos` | Pedidos realizados pelos clientes |
| `itens_pedido` | Itens individuais de cada pedido |
| `pagamentos` | Registro de pagamentos recebidos |
| `entradas_estoque` | Histórico de entradas de estoque |

### Views Úteis

| View | Descrição |
|------|-----------|
| `produtos_estoque_baixo` | Produtos com estoque abaixo do mínimo |
| `resumo_pedidos_cliente` | Resumo financeiro por cliente |
| `desempenho_entregadores` | Estatísticas de cada entregador |

### Triggers Automáticos

- ✅ **Atualização de estoque** ao criar pedido
- ✅ **Atualização de estoque** ao registrar entrada
- ✅ **Atualização automática** do campo `updated_at`

## 🔐 Segurança (RLS)

O banco está configurado com **Row Level Security (RLS)** habilitado em todas as tabelas.

Por padrão, apenas usuários autenticados podem acessar os dados. Você pode ajustar as políticas conforme necessário.

## 📝 Dados Iniciais Incluídos

Após executar o `seed.sql`, você terá:

- ✅ **12 produtos** (biscoitos, pão de queijo, fubá, rapadura)
- ✅ **14 clientes** (MADÁ, LUCAS, D.LUCIA, etc)
- ✅ **3 entregadores** de exemplo
- ✅ **1 pedido** de exemplo
- ✅ **1 entrada de estoque** de exemplo

## 🔄 Conectar o App ao Supabase

Depois de configurar o banco, você precisará:

1. Instalar o cliente Supabase:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Criar arquivo de configuração:
   ```typescript
   // lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = 'SUA_PROJECT_URL'
   const supabaseKey = 'SUA_ANON_KEY'
   
   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

3. Substituir os dados mock pelos dados do Supabase

## 🆘 Problemas Comuns

### Erro: "permission denied"
- Verifique se o RLS está configurado corretamente
- Certifique-se de estar autenticado

### Erro: "relation does not exist"
- Execute o `schema.sql` primeiro
- Verifique se não há erros na execução

### Dados não aparecem
- Execute o `seed.sql` para popular o banco
- Verifique as políticas de RLS

## 📚 Documentação

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.postgresqltutorial.com/)

---

**Dica**: Faça backup regular do seu banco de dados! O Supabase oferece backups automáticos no plano pago.
