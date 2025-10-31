## 🔧 Solução: Estoque Atual Errado

## ❌ Problema

1. O estoque atual mostrado não bate com as entradas registradas
2. No modal de entrada, sempre mostra um valor fixo (ex: 140)
3. Ao adicionar entrada, o estoque não atualiza corretamente

## 🔍 Causas Possíveis

### Causa 1: Estoque no Banco Desatualizado
O banco de dados pode ter valores antigos ou incorretos.

### Causa 2: Entradas Duplicadas
Pode haver entradas de estoque duplicadas no banco.

### Causa 3: Sincronização Falhou
As entradas foram salvas localmente mas não no Supabase.

## ✅ Solução

### Passo 1: Verificar Estoque Atual

Execute no **Supabase SQL Editor**:

```sql
-- Ver estoque de todos os produtos
SELECT 
    p.nome,
    p.estoque_atual,
    COALESCE(SUM(e.quantidade), 0) as total_entradas
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
ORDER BY p.nome;
```

Isso mostra:
- `estoque_atual`: O que está registrado no banco
- `total_entradas`: Soma de todas as entradas
- Se os valores não batem, há um problema

### Passo 2: Identificar Produtos com Problema

```sql
-- Ver produtos com estoque suspeito
SELECT 
    p.id,
    p.nome,
    p.estoque_atual as estoque_registrado,
    COALESCE(SUM(e.quantidade), 0) as total_entradas,
    p.estoque_atual - COALESCE(SUM(e.quantidade), 0) as diferenca
FROM produtos p
LEFT JOIN entradas_estoque e ON p.id = e.produto_id
GROUP BY p.id, p.nome, p.estoque_atual
HAVING p.estoque_atual != COALESCE(SUM(e.quantidade), 0)
ORDER BY ABS(p.estoque_atual - COALESCE(SUM(e.quantidade), 0)) DESC;
```

### Passo 3: Corrigir Estoque

#### Opção A: Recalcular Baseado em Entradas

```sql
-- Recalcular estoque de todos os produtos
UPDATE produtos p
SET estoque_atual = COALESCE((
    SELECT SUM(e.quantidade)
    FROM entradas_estoque e
    WHERE e.produto_id = p.id
), 0);
```

#### Opção B: Corrigir Produto Específico

```sql
-- Corrigir um produto específico
UPDATE produtos 
SET estoque_atual = 50  -- Valor correto
WHERE nome = 'Nome do Produto';
```

#### Opção C: Resetar Tudo

```sql
-- Resetar estoque de todos para 0
UPDATE produtos SET estoque_atual = 0;

-- Depois adicione as entradas novamente pela aplicação
```

### Passo 4: Verificar Entradas Duplicadas

```sql
-- Ver se há entradas duplicadas
SELECT 
    p.nome,
    e.quantidade,
    e.fornecedor,
    e.data_recebimento,
    COUNT(*) as vezes
FROM entradas_estoque e
JOIN produtos p ON e.produto_id = p.id
GROUP BY p.nome, e.quantidade, e.fornecedor, e.data_recebimento
HAVING COUNT(*) > 1;
```

Se houver duplicadas, remova:

```sql
-- Remover duplicadas (mantém apenas uma)
DELETE FROM entradas_estoque
WHERE id NOT IN (
    SELECT MIN(id)
    FROM entradas_estoque
    GROUP BY produto_id, quantidade, fornecedor, data_recebimento
);
```

### Passo 5: Atualizar Cache

```sql
NOTIFY pgrst, 'reload schema';
```

### Passo 6: Testar na Aplicação

1. Recarregue a página (F5)
2. Vá em **Controle de Estoque**
3. Verifique se os valores estão corretos
4. Adicione uma entrada de estoque
5. Veja no console (F12):
   ```
   📦 Salvando entrada de estoque localmente...
   ✅ Entrada salva localmente!
   ✅ Sincronizado com Supabase!
   📦 Atualizando estoque de Produto: 50 + 10 = 60
   ✅ Estoque atualizado no Supabase!
   ```
6. Recarregue a página
7. ✅ Estoque deve estar atualizado

## 🧪 Teste Completo

### 1. Ver Estoque Antes

```sql
SELECT nome, estoque_atual FROM produtos WHERE nome = 'Pão de Queijo';
```

### 2. Adicionar Entrada pela Aplicação

- Vá em Controle de Estoque
- Clique em Registrar Entrada
- Selecione o produto
- Adicione quantidade (ex: 10)
- Salve

### 3. Ver Estoque Depois

```sql
SELECT nome, estoque_atual FROM produtos WHERE nome = 'Pão de Queijo';
```

### 4. Verificar Entrada Foi Salva

```sql
SELECT * FROM entradas_estoque 
WHERE produto_id = (SELECT id FROM produtos WHERE nome = 'Pão de Queijo')
ORDER BY created_at DESC
LIMIT 1;
```

## 📊 Entender o Fluxo

### Como Deveria Funcionar:

1. **Adicionar Entrada**:
   - Atualiza estado local: `estoqueAtual += quantidade`
   - Salva entrada no Supabase
   - Atualiza estoque no Supabase

2. **Recarregar Página**:
   - Busca produtos do Supabase
   - Mostra estoque atualizado

### O Que Pode Dar Errado:

1. **Entrada salva, estoque não atualizado**:
   - Entrada foi para `entradas_estoque`
   - Mas `produtos.estoque_atual` não foi atualizado

2. **Estoque atualizado localmente, não no banco**:
   - Estado React foi atualizado
   - Mas Supabase não foi atualizado
   - Ao recarregar, volta ao valor antigo

3. **Entradas duplicadas**:
   - Mesma entrada foi salva múltiplas vezes
   - Estoque fica inflado

## 💡 Prevenção

### 1. Sempre Verifique os Logs

No console (F12), você deve ver:
```
📦 Salvando entrada de estoque localmente...
✅ Entrada salva localmente!
✅ Sincronizado com Supabase!
📦 Atualizando estoque de Produto: 50 + 10 = 60
✅ Estoque atualizado no Supabase!
```

Se não ver todos esses logs, algo falhou.

### 2. Recarregue Após Adicionar

Sempre recarregue a página após adicionar entrada para confirmar que foi salvo no banco.

### 3. Verifique no Supabase

Periodicamente, verifique no Table Editor se os valores estão corretos.

## ✅ Checklist

- [ ] Executar query para ver estoque atual vs entradas
- [ ] Identificar produtos com diferença
- [ ] Decidir: recalcular ou corrigir manualmente
- [ ] Executar UPDATE para corrigir
- [ ] Verificar entradas duplicadas
- [ ] Remover duplicadas se houver
- [ ] Executar NOTIFY pgrst, 'reload schema'
- [ ] Recarregar aplicação
- [ ] Testar adicionar entrada
- [ ] Ver logs no console
- [ ] Recarregar e confirmar atualização

## 📝 Resumo

**Problema**: Estoque não bate com entradas  
**Causa**: Banco desatualizado ou entradas duplicadas  
**Solução**: Recalcular estoque baseado em entradas  
**Resultado**: Estoque correto e sincronizado! ✅
