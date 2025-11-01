# 🚨 RESOLVER DUPLICAÇÃO DE ESTOQUE - AÇÃO IMEDIATA

## ❌ Problema Confirmado

Os dados do banco mostram que o estoque está **DUPLICADO**:

| Produto | Estoque Atual | Deveria Ser | Diferença |
|---------|--------------|-------------|-----------|
| Biscoito de Queijo 1kg | **160** | 80 | +80 |
| Biscoito de Queijo (G) 1kg | **72** | 36 | +36 |

## ✅ Correções Já Aplicadas no Código

1. ✅ Proteção contra cliques duplos no botão
2. ✅ Logs detalhados para debug
3. ✅ Melhor tratamento de erros

## 🔧 PASSO 1: Corrigir Dados Existentes

### Execute este SQL no Supabase SQL Editor:

```sql
-- Recalcular todos os estoques baseado nas entradas e saídas reais
UPDATE produtos p
SET estoque_atual = (
    SELECT COALESCE(SUM(e.quantidade), 0)
    FROM entradas_estoque e
    WHERE e.produto_id = p.id
) - (
    SELECT COALESCE(SUM(ip.quantidade), 0)
    FROM itens_pedido ip
    WHERE ip.produto_id = p.id
);
```

### Verificar se foi corrigido:

```sql
SELECT 
    p.nome,
    p.estoque_atual as estoque_corrigido,
    COALESCE(SUM(e.quantidade), 0) as soma_entradas,
    COALESCE(SUM(ip.quantidade), 0) as soma_saidas
FROM produtos p
LEFT JOIN entradas_estoque e ON e.produto_id = p.id
LEFT JOIN itens_pedido ip ON ip.produto_id = p.id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;
```

✅ Se `estoque_corrigido = soma_entradas - soma_saidas`, está correto!

## 🔍 PASSO 2: Verificar Triggers no Banco

Execute este SQL para ver se há triggers que podem estar duplicando:

```sql
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('entradas_estoque', 'produtos')
ORDER BY event_object_table;
```

Se encontrar algum trigger relacionado a `estoque_atual`, pode ser a causa da duplicação.

## 🧪 PASSO 3: Testar

1. Recarregue a página (F5) para pegar os dados corrigidos
2. Acesse **Controle de Estoque**
3. Anote o estoque atual de um produto (ex: 80)
4. Clique em **Registrar Entrada**
5. Adicione 10 unidades
6. Clique em **Registrar**
7. Abra o Console (F12) e veja os logs:
   ```
   📦 [addEntradaEstoque] Iniciando...
      Estoque atual no banco: 80
      Novo estoque calculado: 90 (80 + 10)
      ✅ Entrada salva no banco
      ✅ Estoque atualizado no banco: 90
   ✅ [addEntradaEstoque] Concluído com sucesso!
   ```
8. Verifique que o estoque mostra **90** (não 100 ou 110)

## 📊 PASSO 4: Monitorar

Execute este SQL após cada entrada para verificar:

```sql
SELECT 
    p.nome,
    p.estoque_atual,
    COUNT(e.id) as total_entradas,
    SUM(e.quantidade) as soma_quantidades
FROM produtos p
LEFT JOIN entradas_estoque e ON e.produto_id = p.id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;
```

## 📁 Arquivos de Suporte

- `corrigir-estoque-duplicado.sql` - Script completo de correção
- `verificar-triggers.sql` - Verificar triggers no banco
- `debug-duplicacao-estoque.sql` - Diagnóstico detalhado
- `CORRECAO_DUPLICACAO_ESTOQUE_FINAL.md` - Documentação completa

## ⚠️ Importante

Após corrigir os dados, **não delete as entradas antigas** da tabela `entradas_estoque`. Elas são o histórico correto. O problema estava apenas no cálculo do `estoque_atual` na tabela `produtos`.
