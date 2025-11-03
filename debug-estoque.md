# 🔍 Debug: Duplicação de Estoque

## Teste Manual

Para identificar onde está o problema, siga estes passos:

### 1. Abra o Console do Navegador (F12)

### 2. Limpe o Console

### 3. Vá em "Controle de Estoque"

### 4. Anote o Estoque Atual
- Exemplo: Produto X tem 10 unidades

### 5. Clique em "Registrar Entrada"

### 6. Selecione o Produto X

### 7. Adicione 10 unidades

### 8. Observe os Logs no Console

Você deve ver algo assim:

```
📦 Produto selecionado: Produto X Estoque: 10
🚀 Iniciando registro de entrada de estoque...
   Itens a registrar: 1
   📦 Antes: Produto X - Estoque: 10
📦 Salvando entrada de estoque...
   Produto: Produto X
   Estoque ANTES: 10
   Quantidade a ADICIONAR: 10
   Estoque DEPOIS deveria ser: 20
📦 Atualizando estoque de Produto X: 10 + 10 = 20
✅ Estoque atualizado no Supabase!
✅ Entrada salva no Supabase!
   ✅ Estado local atualizado: 20
   ✅ Depois: Produto X - Estoque: 20
✅ Registro concluído!
```

### 9. Verifique o Estoque na Lista

**Resultado Esperado:** 20 unidades
**Resultado com Bug:** 30 ou 40 unidades

### 10. Copie TODOS os logs do console e me envie

## Possíveis Causas

### Causa 1: Banco de Dados com Trigger
- Verificar se há um trigger na tabela `produtos` que está somando automaticamente

### Causa 2: Múltiplas Chamadas
- O `handleSubmit` pode estar sendo chamado duas vezes
- Verificar se há algum `useEffect` que está disparando novamente

### Causa 3: Estado Desatualizado
- O React pode estar usando um estado antigo (closure)
- Precisamos usar callbacks em todos os `setState`

### Causa 4: localStorage Conflitando
- O localStorage pode ter valores antigos que estão sendo somados

## Solução Temporária

Se o problema persistir, você pode:

1. Limpar o localStorage:
```javascript
localStorage.clear();
```

2. Recarregar a página (F5)

3. Tentar adicionar estoque novamente
