# 📝 Resumo: Produtos Somem ao Recarregar

## ⚠️ Problema
Produtos cadastrados desaparecem ao recarregar a página (F5).

## 🔍 Causa
Produtos são salvos localmente, mas a inserção no Supabase está falhando (provavelmente políticas RLS bloqueando INSERT).

## ✅ Solução Rápida

### 1. Verificar o Erro
- Abra o console (F12)
- Cadastre um produto
- Veja o erro exato

### 2. Executar Script SQL
No Supabase Dashboard → SQL Editor:
```sql
-- Execute o arquivo: fix-produtos-insert.sql
```

### 3. Testar
- Cadastre um produto
- Recarregue a página (F5)
- ✅ Produto deve continuar aparecendo

## 🔧 O que o Script Faz
- ✅ Cria políticas RLS permissivas para INSERT
- ✅ Garante que SELECT, UPDATE e DELETE funcionem
- ✅ Verifica estrutura da tabela

## 📊 Logs Adicionados

Agora você verá no console:

**Sucesso:**
```
📦 Tentando adicionar produto: Pão de Queijo
✅ Produto salvo com sucesso no Supabase
```

**Erro:**
```
📦 Tentando adicionar produto: Pão de Queijo
❌ ERRO ao salvar produto no Supabase:
   Código: 42501
   Mensagem: new row violates row-level security policy
```

## 🎯 Resultado Esperado

Após executar o script:
1. ✅ Produtos salvos no Supabase
2. ✅ Produtos permanecem após F5
3. ✅ Logs de sucesso no console

## 📁 Arquivos

- `fix-produtos-insert.sql` - Script SQL para corrigir
- `SOLUCAO_PRODUTOS_SOMEM.md` - Documentação completa
- `hooks/useAppData.ts` - Logs detalhados adicionados
