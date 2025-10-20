# 🔧 Corrigir Tabela de Entregadores

## ❌ Problema Identificado:

A tabela `entregadores` foi criada com a coluna `veiculo`, mas o sistema não usa essa coluna.

**Estrutura Incorreta:**
- id
- nome
- telefone
- **veiculo** ❌ (não deveria existir)

**Estrutura Correta:**
- id
- nome
- telefone ✅

## ✅ Solução:

### Passo 1: Acessar o Supabase

1. Acesse: https://supabase.com/dashboard/project/bkwgowsumeylnwbintdz
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**

### Passo 2: Executar o SQL de Correção

Copie e cole TODO o conteúdo do arquivo `fix-entregadores-table.sql`:

```sql
-- Script para corrigir a tabela de entregadores

-- 1. Deletar a tabela antiga (se existir)
DROP TABLE IF EXISTS entregadores CASCADE;

-- 2. Criar a tabela correta
CREATE TABLE entregadores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar Row Level Security
ALTER TABLE entregadores ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas de acesso
CREATE POLICY "Permitir leitura pública de entregadores" 
    ON entregadores FOR SELECT 
    USING (true);

CREATE POLICY "Permitir inserção pública de entregadores" 
    ON entregadores FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de entregadores" 
    ON entregadores FOR UPDATE 
    USING (true);

CREATE POLICY "Permitir exclusão pública de entregadores" 
    ON entregadores FOR DELETE 
    USING (true);

-- 5. Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_entregadores_nome ON entregadores(nome);
```

### Passo 3: Executar

1. Clique em **RUN** (ou Ctrl+Enter)
2. Aguarde a mensagem de sucesso
3. Verifique se não há erros

### Passo 4: Verificar

1. Vá em **Table Editor**
2. Clique na tabela **entregadores**
3. Verifique as colunas:
   - ✅ id
   - ✅ nome
   - ✅ telefone
   - ✅ created_at
   - ✅ updated_at
   - ❌ veiculo (NÃO deve existir)

### Passo 5: Testar

1. Abra o arquivo `test-supabase-simple.html` no navegador
2. Clique em **"3. Testar Inserção"**
3. Deve aparecer: **"✅ Entregador inserido com sucesso!"**

### Passo 6: Testar no Sistema

1. Acesse o sistema
2. Vá em **Controle de Entregadores**
3. Cadastre um novo entregador
4. Atualize a página
5. O entregador deve continuar lá! ✅

## 🎯 Por que isso aconteceu?

O SQL inicial tinha a coluna `veiculo` porque foi baseado em um exemplo genérico. Mas o tipo `Entregador` no código TypeScript não tem essa coluna.

## 📊 Estrutura Final Correta:

```typescript
interface Entregador {
  id: string;
  nome: string;
  telefone?: string;
}
```

```sql
CREATE TABLE entregadores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## ⚠️ Nota Importante:

Se você já tinha entregadores cadastrados na tabela antiga, eles serão perdidos ao executar o `DROP TABLE`. 

Se quiser manter os dados:
1. Exporte os dados antes (Table Editor → Export)
2. Execute o SQL de correção
3. Importe os dados novamente (sem a coluna veiculo)

## ✅ Checklist:

- [ ] Executei o SQL de correção
- [ ] Verifiquei que a tabela foi recriada
- [ ] Testei inserção no test-supabase-simple.html
- [ ] Testei cadastro no sistema
- [ ] Entregador persiste após atualizar a página
- [ ] Entregador aparece em outros dispositivos

## 🎉 Pronto!

Após executar o SQL, o sistema deve funcionar perfeitamente! 🚀
