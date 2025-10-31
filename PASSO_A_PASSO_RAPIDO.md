# 🚀 Passo a Passo: Adicionar Tipo "Rápido"

## ⚠️ IMPORTANTE

Valores de ENUM precisam ser commitados antes de serem usados. Por isso, você precisa executar os comandos em **etapas separadas**.

## 📋 Passo a Passo

### Passo 1: Adicionar "Rápido" ao ENUM

No **Supabase SQL Editor**, execute **APENAS** este comando:

```sql
ALTER TYPE tipo_produto ADD VALUE 'Rápido';
```

✅ Clique em **Run** (ou Ctrl+Enter)  
✅ Aguarde a confirmação de sucesso

---

### Passo 2: Atualizar Cache (NOVA QUERY)

Abra uma **NOVA query** no SQL Editor e execute:

```sql
NOTIFY pgrst, 'reload schema';
```

✅ Clique em **Run**

---

### Passo 3: Verificar (NOVA QUERY)

Abra uma **NOVA query** e execute:

```sql
SELECT 
    e.enumlabel AS tipo_disponivel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'tipo_produto'
ORDER BY e.enumsortorder;
```

✅ Você deve ver "Rápido" na lista

---

### Passo 4: Testar Inserção (NOVA QUERY)

Abra uma **NOVA query** e execute:

```sql
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
```

✅ Deve inserir com sucesso!

---

### Passo 5: Verificar Produto

```sql
SELECT * FROM produtos WHERE tipo = 'Rápido';
```

✅ Deve mostrar o produto teste

---

### Passo 6: Limpar Teste (Opcional)

```sql
DELETE FROM produtos WHERE nome = 'Teste Rápido';
```

---

### Passo 7: Testar na Aplicação

1. Vá em **Cadastro de Produtos**
2. Clique em **Novo Produto**
3. Selecione tipo **"Rápido"**
4. Preencha os campos
5. Salve
6. Veja no console (F12):
   ```
   📦 Tentando adicionar produto: Produto Teste
   ✅ Produto salvo com sucesso no Supabase
   ```
7. Recarregue a página (F5)
8. ✅ Produto deve continuar aparecendo!

---

## 🎯 Resumo dos Comandos

Execute **um de cada vez**, em queries separadas:

```sql
-- Query 1
ALTER TYPE tipo_produto ADD VALUE 'Rápido';

-- Query 2 (nova query)
NOTIFY pgrst, 'reload schema';

-- Query 3 (nova query) - Verificar
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = 'tipo_produto'::regtype;

-- Query 4 (nova query) - Testar
INSERT INTO produtos (id, nome, tipo, tamanho_pacote, preco_padrao, estoque_minimo, estoque_atual)
VALUES (gen_random_uuid(), 'Teste', 'Rápido', '1kg', 14.00, 10, 0);
```

---

## ❌ NÃO Faça Isso

**ERRADO** - Executar tudo junto:
```sql
ALTER TYPE tipo_produto ADD VALUE 'Rápido';
INSERT INTO produtos (...) VALUES (..., 'Rápido', ...);  -- ❌ ERRO!
```

**CERTO** - Executar em queries separadas:
```sql
-- Query 1
ALTER TYPE tipo_produto ADD VALUE 'Rápido';

-- Query 2 (NOVA QUERY)
INSERT INTO produtos (...) VALUES (..., 'Rápido', ...);  -- ✅ OK!
```

---

## 💡 Por Que Isso Acontece?

PostgreSQL requer que novos valores de ENUM sejam **commitados** (salvos) antes de serem usados. Quando você executa comandos em queries separadas, cada query é automaticamente commitada.

---

## ✅ Checklist

- [ ] Executar ALTER TYPE (Query 1)
- [ ] Executar NOTIFY (Query 2)
- [ ] Verificar valores do ENUM (Query 3)
- [ ] Testar inserção manual (Query 4)
- [ ] Testar na aplicação
- [ ] Ver log de sucesso no console
- [ ] Recarregar página e confirmar

---

## 🎉 Pronto!

Após seguir esses passos, o tipo "Rápido" estará funcionando perfeitamente!
