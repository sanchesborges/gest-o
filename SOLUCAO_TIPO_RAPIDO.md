# 🔧 Solução: Tipo "Rápido" Não Salva

## ❌ Problema

Ao cadastrar um produto com tipo "Rápido", aparece erro dizendo que será salvo apenas localmente.

## 🔍 Causa Provável

O banco de dados tem uma **constraint** (restrição) ou **ENUM** que define quais tipos são válidos, e "Rápido" não está incluído.

### Possíveis Constraints:

1. **CHECK Constraint**: Lista de valores permitidos
2. **ENUM Type**: Tipo enumerado com valores fixos
3. **Foreign Key**: Referência a outra tabela

## ✅ Solução

### Passo 1: Identificar o Problema

Execute no **Supabase SQL Editor**:

```sql
-- Ver tipo da coluna
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'produtos' AND column_name = 'tipo';

-- Ver constraints
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'produtos'::regclass
AND conname LIKE '%tipo%';

-- Ver valores atuais
SELECT DISTINCT tipo FROM produtos;
```

### Passo 2: Aplicar Solução Correta

#### Solução A: Se for CHECK Constraint

```sql
-- Remover constraint antiga
ALTER TABLE produtos DROP CONSTRAINT IF EXISTS produtos_tipo_check;

-- Criar nova constraint com "Rápido"
ALTER TABLE produtos ADD CONSTRAINT produtos_tipo_check 
CHECK (tipo IN (
    'Pão de Queijo',
    'Biscoito de Queijo',
    'Biscoito Ferradura',
    'Biscoito Polvilho',
    'Biscoito Goma',
    'Fubá',
    'Rápido'
));

-- Atualizar cache
NOTIFY pgrst, 'reload schema';
```

#### Solução B: Se for ENUM Type

```sql
-- Adicionar "Rápido" ao enum
ALTER TYPE tipo_produto_enum ADD VALUE 'Rápido';

-- Atualizar cache
NOTIFY pgrst, 'reload schema';
```

#### Solução C: Se for TEXT sem Constraint

Se a coluna é TEXT e não tem constraints, o problema pode ser apenas cache:

```sql
-- Apenas atualizar cache
NOTIFY pgrst, 'reload schema';
```

### Passo 3: Atualizar Produtos Existentes (Opcional)

Se você tinha produtos com tipo "Rapadura", pode atualizá-los:

```sql
UPDATE produtos 
SET tipo = 'Rápido' 
WHERE tipo = 'Rapadura';
```

### Passo 4: Testar

```sql
-- Testar inserção
INSERT INTO produtos (
    id,
    nome,
    tipo,
    tamanho_pacote,
    preco_padrao,
    estoque_minimo,
    estoque_atual
) VALUES (
    gen_random_uuid(),
    'Teste Rápido',
    'Rápido',
    '1kg',
    14.00,
    10,
    0
);

-- Verificar
SELECT * FROM produtos WHERE tipo = 'Rápido';

-- Limpar teste
DELETE FROM produtos WHERE nome = 'Teste Rápido';
```

## 🧪 Como Testar na Aplicação

1. **Execute o script SQL** apropriado no Supabase
2. **Vá em Cadastro de Produtos**
3. **Clique em Novo Produto**
4. **Selecione tipo "Rápido"**
5. **Preencha os outros campos**
6. **Salve**
7. **Veja no console (F12)**:
   ```
   📦 Tentando adicionar produto: Produto Teste
   ✅ Produto salvo com sucesso no Supabase
   ```
8. **Recarregue a página (F5)**
9. ✅ Produto deve continuar aparecendo

## 📊 Estrutura Recomendada

### Opção 1: TEXT sem Constraint (Mais Flexível)

```sql
ALTER TABLE produtos ALTER COLUMN tipo TYPE TEXT;
```

**Vantagens:**
- ✅ Fácil adicionar novos tipos
- ✅ Não precisa alterar banco ao mudar código

**Desvantagens:**
- ❌ Permite valores inválidos
- ❌ Sem validação no banco

### Opção 2: CHECK Constraint (Recomendado)

```sql
ALTER TABLE produtos ADD CONSTRAINT produtos_tipo_check 
CHECK (tipo IN ('Pão de Queijo', 'Biscoito de Queijo', ...));
```

**Vantagens:**
- ✅ Valida valores no banco
- ✅ Fácil de atualizar

**Desvantagens:**
- ❌ Precisa atualizar ao adicionar tipos

### Opção 3: ENUM Type

```sql
CREATE TYPE tipo_produto_enum AS ENUM ('Pão de Queijo', ...);
```

**Vantagens:**
- ✅ Forte tipagem
- ✅ Validação no banco

**Desvantagens:**
- ❌ Difícil de modificar
- ❌ Não pode remover valores facilmente

## 🔄 Reiniciar Projeto Supabase

Se o cache não atualizar, tente:

1. Vá em **Settings** → **General**
2. Clique em **Pause project**
3. Aguarde alguns segundos
4. Clique em **Resume project**

## 💡 Dicas

1. **Sempre teste no SQL Editor primeiro** - Insira um produto manualmente
2. **Use NOTIFY pgrst, 'reload schema'** - Atualiza o cache
3. **Verifique o console** - Veja o erro exato
4. **Mantenha sincronizado** - Código e banco devem ter os mesmos tipos

## ✅ Checklist

- [ ] Executar script de verificação
- [ ] Identificar tipo de constraint
- [ ] Aplicar solução apropriada
- [ ] Executar NOTIFY pgrst, 'reload schema'
- [ ] Testar inserção manual no SQL Editor
- [ ] Testar cadastro na aplicação
- [ ] Ver log de sucesso no console
- [ ] Recarregar página e confirmar persistência

## 📝 Resumo

**Problema:** Tipo "Rápido" não salva  
**Causa:** Constraint/ENUM não inclui "Rápido"  
**Solução:** Adicionar "Rápido" à constraint/ENUM  
**Resultado:** Produtos com tipo "Rápido" salvos com sucesso! ✅
