# 🔍 Troubleshooting: Produtos Não Aparecem

## ❌ Problema

Os produtos dos pedidos não estão aparecendo no modal "Pedidos Para Fábrica".

## 🔍 Possíveis Causas

### 1. Filtros de Data Aplicados
**Causa mais comum!**

Se você tem filtros de data aplicados (Data Início ou Data Fim), o sistema só mostra pedidos desse período.

**Solução**:
1. Clique em **"Limpar Filtros"**
2. Veja se os produtos aparecem

### 2. Checkbox Desmarcado
Se o checkbox "Incluir pedidos entregues" está desmarcado e você só tem pedidos entregues.

**Solução**:
1. **Marque** o checkbox "Incluir pedidos entregues" ✅
2. Veja se os produtos aparecem

### 3. Não Há Pedidos Cadastrados
Se realmente não há pedidos no sistema.

**Solução**:
1. Vá para "Gestão de Pedidos"
2. Verifique se há pedidos listados
3. Se não houver, cadastre alguns pedidos

### 4. Pedidos Sem Itens
Se os pedidos existem mas não têm produtos.

**Solução**:
1. Vá para "Gestão de Pedidos"
2. Verifique se os pedidos têm produtos
3. Edite ou recrie os pedidos com produtos

## 🧪 Passo a Passo para Resolver

### Passo 1: Abrir Console
```
Pressione F12
Vá para aba "Console"
```

### Passo 2: Abrir Modal
```
Gestão de Pedidos → Pedidos Fábrica
```

### Passo 3: Verificar Logs
Procure por estes logs no console:
```
🏭 FactoryOrders montado!
📦 Total de pedidos disponíveis: X
🔍 Debug - Total de pedidos: X
🔍 Debug - Filtros: {startDate: "...", endDate: "...", includeDelivered: true}
🔍 Debug - Mostrando todos os pedidos: X
🔍 Debug - Total filtrado: X
🔍 Debug - Produtos consolidados: X [array]
```

### Passo 4: Analisar Logs

#### Se mostra "Total de pedidos: 0"
**Problema**: Não há pedidos no sistema
**Solução**: Cadastre pedidos em "Gestão de Pedidos"

#### Se mostra "Total filtrado: 0"
**Problema**: Filtros estão bloqueando tudo
**Solução**: Clique em "Limpar Filtros"

#### Se mostra "Produtos consolidados: 0"
**Problema**: Pedidos não têm produtos
**Solução**: Verifique os pedidos em "Gestão de Pedidos"

### Passo 5: Verificar Painel de Debug

Se não aparecem produtos, o painel amarelo mostra:
```
Informações de Debug:
• Total de pedidos: X
• Pedidos pendentes: Y
• Pedidos entregues: Z
• Incluir entregues: Sim/Não

Filtros Aplicados:
• Data início: DD/MM/YYYY ou Nenhum
• Data fim: DD/MM/YYYY ou Nenhum

Pedidos Pendentes:
• Lista dos pedidos pendentes

Pedidos Entregues:
• Lista dos primeiros 5 pedidos entregues
```

## ✅ Solução Rápida

### Solução 1: Limpar Tudo
```
1. Clique em "Limpar Filtros"
2. Certifique-se que "Incluir entregues" está MARCADO ✅
3. Deve mostrar todos os produtos
```

### Solução 2: Verificar Pedidos
```
1. Vá para "Gestão de Pedidos"
2. Veja se há pedidos listados
3. Clique em um pedido para ver os produtos
4. Se não houver produtos, o pedido está vazio
```

### Solução 3: Recarregar Página
```
1. Pressione Ctrl+Shift+R
2. Abra "Pedidos Fábrica" novamente
3. Veja se resolve
```

## 📊 Cenários Comuns

### Cenário 1: "Tenho 14 pedidos mas não aparecem"
**Causa**: Filtros de data aplicados

**Solução**:
```
1. Veja se há datas nos campos "Data Início" ou "Data Fim"
2. Clique em "Limpar Filtros"
3. Produtos devem aparecer
```

### Cenário 2: "Só aparece 1 produto"
**Causa**: Checkbox "Incluir entregues" desmarcado

**Solução**:
```
1. Marque o checkbox "Incluir pedidos entregues" ✅
2. Produtos devem aparecer
```

### Cenário 3: "Aparece 'Nenhum produto encontrado'"
**Causa**: Múltiplas possibilidades

**Solução**:
```
1. Veja o painel amarelo de debug
2. Siga as dicas mostradas
3. Ajuste os filtros conforme necessário
```

## 🔍 Debug Avançado

### Verificar no Console

#### Log 1: Total de Pedidos
```javascript
📦 Total de pedidos disponíveis: 14
```
✅ Há pedidos no sistema

#### Log 2: Filtros
```javascript
🔍 Debug - Filtros: {
  startDate: "2025-11-01",
  endDate: "2025-11-01",
  includeDelivered: false
}
```
⚠️ Filtros aplicados! Pode estar bloqueando

#### Log 3: Após Filtros
```javascript
🔍 Debug - Total filtrado: 0
```
❌ Nenhum pedido passou pelos filtros

#### Log 4: Produtos Consolidados
```javascript
🔍 Debug - Produtos consolidados: 0 []
```
❌ Nenhum produto para mostrar

### Interpretação

Se os logs mostram:
- Total de pedidos: **14** ✅
- Total filtrado: **0** ❌
- Produtos consolidados: **0** ❌

**Conclusão**: Os filtros estão bloqueando tudo!

**Solução**: Limpar filtros ou ajustar datas

## 💡 Dicas

### Dica 1: Sempre Limpe Primeiro
Antes de investigar, clique em "Limpar Filtros" para ver se resolve.

### Dica 2: Veja o Console
O console mostra exatamente o que está acontecendo.

### Dica 3: Use o Painel de Debug
O painel amarelo mostra informações úteis quando não há produtos.

### Dica 4: Verifique os Pedidos
Vá para "Gestão de Pedidos" e veja se os pedidos têm produtos.

## 🎯 Checklist de Verificação

- [ ] Console aberto (F12)
- [ ] Modal "Pedidos Fábrica" aberto
- [ ] Logs aparecem no console
- [ ] Clicou em "Limpar Filtros"
- [ ] Checkbox "Incluir entregues" está MARCADO ✅
- [ ] Verificou se há pedidos em "Gestão de Pedidos"
- [ ] Verificou se os pedidos têm produtos
- [ ] Recarregou a página (Ctrl+Shift+R)

## 📞 Ainda Não Resolveu?

Se após seguir todos os passos ainda não aparecem produtos:

1. **Tire prints**:
   - Console com os logs
   - Painel de debug (amarelo)
   - Tela de "Gestão de Pedidos"

2. **Verifique**:
   - Há pedidos cadastrados?
   - Os pedidos têm produtos?
   - Os produtos estão cadastrados?

3. **Teste**:
   - Cadastre um novo pedido
   - Adicione produtos
   - Abra "Pedidos Fábrica"
   - Veja se aparece

---

**Na maioria dos casos, clicar em "Limpar Filtros" resolve! 🎯**
