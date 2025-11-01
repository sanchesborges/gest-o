# 🚨 DEPLOY URGENTE NECESSÁRIO

## ⚠️ Problema

O código corrigido foi enviado para o Git, mas o **Vercel ainda não fez o deploy**. 

A aplicação em produção ainda está usando o código antigo com os erros:
- ❌ Campos errados ao salvar clientes
- ❌ Erro de `.includes()` com undefined
- ❌ IDs como string em vez de UUID

## ✅ Solução Imediata

### 1️⃣ Execute o SQL no Supabase AGORA

Isso vai corrigir os clientes existentes:

```sql
-- Atualizar clientes com valores NULL
UPDATE clientes 
SET tipo = 'Mercado'::tipo_cliente
WHERE tipo IS NULL;

UPDATE clientes 
SET condicao_pagamento = '15 dias'::condicao_pagamento
WHERE condicao_pagamento IS NULL;

-- Verificar resultado
SELECT id, nome, tipo::text, condicao_pagamento::text 
FROM clientes;
```

### 2️⃣ Forçar Deploy no Vercel

**Opção A: Via Dashboard**
1. Acesse: https://vercel.com
2. Vá no seu projeto
3. Clique em **"Deployments"**
4. Clique em **"Redeploy"** no último deploy
5. Aguarde 2-3 minutos

**Opção B: Via Git (forçar novo commit)**
```bash
git commit --allow-empty -m "chore: trigger deploy"
git push origin main
```

### 3️⃣ Verificar Deploy

1. Aguarde o deploy terminar (2-3 minutos)
2. Acesse: https://gestao-sepia.vercel.app
3. Pressione **Ctrl + Shift + R** (hard refresh)
4. Teste criar um pedido

## 🔍 Como Saber se o Deploy Funcionou

Abra o console (F12) e tente criar um pedido. Você deve ver:

**✅ Código Novo (correto):**
```
🛒 Tentando salvar pedido: 550e8400-e29b-41d4-a716-446655440000
   Cliente: 123e4567-e89b-12d3-a456-426614174000
   Valor Total: 45.00
✅ Pedido salvo no Supabase
```

**❌ Código Antigo (errado):**
```
Erro ao salvar cliente: Object
Erro ao salvar pedido: Object
Cannot read properties of undefined (reading 'includes')
```

## 📊 Status do Código

| Arquivo | Status Git | Status Vercel |
|---------|-----------|---------------|
| hooks/useAppData.ts | ✅ Atualizado | ❌ Aguardando deploy |
| components/OrderForm.tsx | ✅ Atualizado | ❌ Aguardando deploy |

## ⏱️ Tempo Estimado

- **SQL:** 10 segundos
- **Deploy:** 2-3 minutos
- **Total:** ~3 minutos

## 🎯 Checklist

- [ ] SQL executado no Supabase
- [ ] Deploy iniciado no Vercel
- [ ] Deploy concluído (verde)
- [ ] Hard refresh no navegador (Ctrl + Shift + R)
- [ ] Teste criar pedido
- [ ] Modal fecha após salvar
- [ ] Pedido aparece na lista
- [ ] Pedido persiste após F5

## 🚨 Se Ainda Houver Erro Após Deploy

1. Limpe o cache do navegador:
   - Ctrl + Shift + Delete
   - Marque "Dados em cache"
   - Clique em "Limpar dados"

2. Feche e abra o navegador novamente

3. Acesse a aplicação

4. Teste criar um pedido

## 📝 Commit Atual

```
commit b2134be
fix: corrigir salvamento de pedidos no Supabase
- IDs como UUID válidos
- Mapeamento correto de clientes
- Logs detalhados
```

## 🔗 Links Úteis

- Vercel Dashboard: https://vercel.com
- Supabase Dashboard: https://bkwgowsumeylnwbintdz.supabase.co
- Aplicação: https://gestao-sepia.vercel.app
- GitHub: https://github.com/sanchesborges/gest-o

---

**IMPORTANTE:** Não tente criar pedidos até o deploy estar completo! ⚠️
