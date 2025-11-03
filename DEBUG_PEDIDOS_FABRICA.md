# 🔍 Debug: Pedidos Para Fábrica

## Problema Reportado
- Filtros de data não funcionam corretamente
- Quando sem data definida, mostra apenas "Ferradura 1kg: 2 un"
- Quando define data do dia 01, os pedidos não aparecem

## ✅ Correções Aplicadas

### 1. Normalização de Datas
**Problema**: Comparação de datas não estava normalizando corretamente
**Solução**: Agora converte `p.data` para objeto Date e normaliza as horas

### 2. Debug Adicionado
**Console**: Logs detalhados no console do navegador
**Tela**: Informações de debug quando não há resultados

### 3. Botão Limpar Filtros
**Novo**: Botão para resetar todos os filtros rapidamente

### 4. Contador de Pedidos
**Novo**: Mostra total de pedidos, pendentes e entregues na tela

## 🧪 Como Testar Agora

### Passo 1: Limpar Cache
```
1. Pressione Ctrl+Shift+R (ou Cmd+Shift+R no Mac)
2. Ou feche e abra o navegador
```

### Passo 2: Abrir Console
```
1. Pressione F12
2. Vá para aba "Console"
```

### Passo 3: Abrir Modal
```
1. Vá para "Gestão de Pedidos"
2. Clique em "Pedidos Fábrica"
```

### Passo 4: Verificar Logs
No console você deve ver:
```
🏭 FactoryOrders montado!
📦 Total de pedidos disponíveis: X
📦 Pedidos: [array com detalhes]
🔍 Debug - Total de pedidos: X
🔍 Debug - Filtros: {startDate: "", endDate: "", includeDelivered: false}
🔍 Debug - Após filtro de status (pendentes): X
🔍 Debug - Total filtrado: X
```

### Passo 5: Verificar Tela
Na parte de filtros você deve ver:
```
Total de pedidos no sistema: X | Pendentes: Y | Entregues: Z
```

### Passo 6: Testar Filtros

#### Teste 1: Sem Filtros
```
1. Clique em "Limpar Filtros"
2. Deve mostrar todos os pedidos PENDENTES
3. Veja os logs no console
```

#### Teste 2: Com Data Início
```
1. Defina data início (ex: 01/11/2025)
2. Veja os logs mostrando comparação de datas
3. Verifique se os pedidos aparecem
```

#### Teste 3: Incluir Entregues
```
1. Marque "Incluir pedidos entregues"
2. Deve mostrar mais produtos
3. Veja o contador mudar
```

## 🔍 O Que Verificar no Console

### Logs Esperados
```javascript
🏭 FactoryOrders montado!
📦 Total de pedidos disponíveis: 5
📦 Pedidos: [
  {id: "abc", data: "2025-11-01", status: "Pendente", itens: 3},
  {id: "def", data: "2025-11-02", status: "Pendente", itens: 2},
  ...
]
🔍 Debug - Total de pedidos: 5
🔍 Debug - Filtros: {startDate: "2025-11-01", endDate: "", includeDelivered: false}
🔍 Debug - Após filtro de status (pendentes): 4
🔍 Pedido data: 01/11/2025 vs início: 01/11/2025 - Match: true
🔍 Pedido data: 02/11/2025 vs início: 01/11/2025 - Match: true
🔍 Debug - Após filtro data início: 2
🔍 Debug - Total filtrado: 2
```

## 🐛 Possíveis Problemas

### Problema 1: Console não mostra nada
**Causa**: Modal não está sendo renderizado
**Solução**: 
1. Verifique se clicou no botão correto
2. Recarregue a página (Ctrl+Shift+R)
3. Verifique se há erros no console

### Problema 2: Mostra 0 pedidos
**Causa**: Não há pedidos cadastrados ou todos estão entregues
**Solução**:
1. Vá para "Gestão de Pedidos"
2. Verifique se há pedidos listados
3. Marque "Incluir pedidos entregues"

### Problema 3: Data não filtra
**Causa**: Formato de data incorreto
**Solução**:
1. Veja os logs de comparação de datas
2. Verifique se as datas estão no formato correto
3. Tente limpar filtros e definir novamente

### Problema 4: Mostra apenas "Ferradura 1kg: 2 un"
**Causa**: Há apenas 1 pedido pendente com esse produto
**Solução**:
1. Marque "Incluir pedidos entregues"
2. Ou ajuste os filtros de data
3. Ou cadastre mais pedidos

## 📊 Informações de Debug na Tela

Quando não há resultados, a tela mostra:
```
Nenhum produto encontrado

Informações de Debug:
• Total de pedidos: X
• Pedidos pendentes: Y
• Pedidos entregues: Z
• Filtro data início: DD/MM/YYYY ou Nenhum
• Filtro data fim: DD/MM/YYYY ou Nenhum
• Incluir entregues: Sim ou Não
```

## 🎯 Checklist de Verificação

- [ ] Console aberto (F12)
- [ ] Página recarregada (Ctrl+Shift+R)
- [ ] Modal "Pedidos Fábrica" aberto
- [ ] Logs aparecem no console
- [ ] Contador de pedidos visível na tela
- [ ] Botão "Limpar Filtros" visível
- [ ] Informações de debug aparecem quando sem resultados

## 💡 Dicas

### Dica 1: Sempre Limpe os Filtros Primeiro
Antes de testar, clique em "Limpar Filtros" para garantir estado limpo.

### Dica 2: Veja os Logs
Os logs mostram exatamente o que está acontecendo em cada etapa.

### Dica 3: Verifique o Contador
O contador na parte de filtros mostra quantos pedidos existem no sistema.

### Dica 4: Teste com Entregues
Se não aparecer nada, marque "Incluir pedidos entregues" para ver se há pedidos.

## 🔄 Próximos Passos

1. **Recarregue a página** (Ctrl+Shift+R)
2. **Abra o console** (F12)
3. **Abra o modal** "Pedidos Fábrica"
4. **Tire um print** dos logs do console
5. **Tire um print** da tela com as informações de debug
6. **Compartilhe** os prints para análise

## 📸 O Que Fotografar

### Print 1: Console
Mostre os logs que aparecem quando abre o modal

### Print 2: Tela - Filtros
Mostre a área de filtros com o contador de pedidos

### Print 3: Tela - Resultados
Mostre o que aparece (produtos ou mensagem de debug)

## ✅ Resultado Esperado

Após as correções:
- ✅ Sem filtros: Mostra todos os pedidos pendentes
- ✅ Com data início: Mostra pedidos a partir dessa data
- ✅ Com data fim: Mostra pedidos até essa data
- ✅ Com ambas datas: Mostra pedidos no período
- ✅ Incluir entregues: Mostra todos os pedidos
- ✅ Logs detalhados no console
- ✅ Informações de debug na tela

---

**Teste agora e veja os logs! 🔍**
