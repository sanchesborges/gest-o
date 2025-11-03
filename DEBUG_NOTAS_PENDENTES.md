# 🔍 Debug: Notas Pendentes

## 🐛 Problemas Identificados e Corrigidos

### Problema 1: Botão "Enviar Nota ao Cliente" Não Aparece
**Status:** ✅ O botão está implementado corretamente

**Localização:** `components/EntregadorDeliveryView.tsx` linha ~350

**Quando aparece:**
- ✅ Após confirmar a entrega
- ✅ Quando há assinatura coletada
- ✅ Quando `pedido.assinatura` existe

**Possível causa:** Página sendo recarregada após confirmação

**Solução:** O botão está lá! Verifique se:
1. A entrega foi confirmada
2. A assinatura foi coletada
3. A página não foi recarregada

### Problema 2: Notas com Pagamento Parcial Não Aparecem
**Status:** ✅ CORRIGIDO

**Causa:** Filtro não estava verificando se o pedido estava ENTREGUE

**Correção aplicada:**
```typescript
// ANTES (errado):
const pendingNotes = pedidos.filter(p => 
  p.entregadorId === entregadorId &&
  (p.statusPagamento === StatusPagamento.PENDENTE || ...) &&
  p.valorTotal > 0
)

// DEPOIS (correto):
const pendingNotes = pedidos.filter(p => 
  p.entregadorId === entregadorId &&
  p.status === 'Entregue' && // ✅ ADICIONADO
  (p.statusPagamento === StatusPagamento.PENDENTE || ...) &&
  p.valorTotal > 0
)
```

## 🧪 Como Testar

### Teste 1: Botão "Enviar Nota ao Cliente"

#### Passo a Passo:
1. Acesse como entregador
2. Abra um pedido para entrega
3. Marque opção de pagamento (qualquer uma)
4. Colete assinatura
5. Clique em "Confirmar Entrega"
6. **Aguarde a confirmação**
7. **NÃO recarregue a página**
8. Role para baixo até a seção de assinatura
9. Você deve ver o botão verde "📱 Enviar Nota ao Cliente"

#### Se não aparecer:
- Verifique se a entrega foi confirmada (mensagem de sucesso)
- Verifique se há assinatura na tela
- Abra o console (F12) e veja se há erros

### Teste 2: Notas Pendentes

#### Cenário de Teste:
```
1. Criar pedido de R$ 100
2. Atribuir ao entregador
3. Entregador confirma com entrada de R$ 50
4. Sistema deve:
   - Marcar como ENTREGUE
   - Status pagamento: PENDENTE
   - Valor total: R$ 50 (abatido)
   - Valor pago: R$ 50
5. Ir em "Notas Pendentes"
6. Deve aparecer a nota com saldo de R$ 50
```

#### Verificar no Console:
Abra o console (F12) e procure por:
```
🔍 EntregadorPendingNotes - Todos os pedidos: X
🔍 Pedidos do entregador: X
🔍 Pedidos entregues: X
🔍 Pedidos pendentes: X
📋 Pedido do entregador: { ... }
✅ Notas pendentes encontradas: X
```

## 🔍 Logs de Debug

### O Que Verificar:

#### 1. Status do Pedido:
```javascript
status: "Entregue" // ✅ Deve ser "Entregue"
```

#### 2. Status de Pagamento:
```javascript
statusPagamento: "Pendente" // ✅ Deve ser "Pendente"
```

#### 3. Valor Total:
```javascript
valorTotal: 50 // ✅ Deve ser o saldo (após abatimento)
```

#### 4. Valor Pago:
```javascript
valorPago: 50 // ✅ Deve ser a entrada
```

#### 5. Pagamento Parcial:
```javascript
pagamentoParcial: true // ✅ Deve ser true
```

## 🎯 Checklist de Verificação

### Para "Enviar Nota ao Cliente":
- [ ] Entrega foi confirmada
- [ ] Assinatura foi coletada
- [ ] Página não foi recarregada
- [ ] Botão verde aparece abaixo da assinatura

### Para "Notas Pendentes":
- [ ] Pedido foi entregue (status = "Entregue")
- [ ] Status de pagamento é "Pendente"
- [ ] Valor total > 0
- [ ] Entregador ID está correto
- [ ] Aba "Notas Pendentes" está selecionada

## 🔧 Comandos de Debug

### No Console do Navegador (F12):

#### Ver todos os pedidos:
```javascript
// Cole no console:
console.table(
  JSON.parse(localStorage.getItem('pedidos') || '[]')
    .map(p => ({
      id: p.id.substring(0, 8),
      status: p.status,
      statusPagamento: p.statusPagamento,
      valorTotal: p.valorTotal,
      valorPago: p.valorPago,
      pagamentoParcial: p.pagamentoParcial
    }))
)
```

#### Ver pedidos do entregador:
```javascript
// Substitua ENTREGADOR_ID pelo ID do entregador
const entregadorId = 'ENTREGADOR_ID';
console.table(
  JSON.parse(localStorage.getItem('pedidos') || '[]')
    .filter(p => p.entregadorId === entregadorId)
    .map(p => ({
      id: p.id.substring(0, 8),
      status: p.status,
      statusPagamento: p.statusPagamento,
      valorTotal: p.valorTotal,
      valorPago: p.valorPago
    }))
)
```

## 🐛 Problemas Comuns

### Problema: Botão não aparece após confirmar
**Causa:** Página foi recarregada
**Solução:** Não recarregue a página após confirmar

### Problema: Nota não aparece em "Notas Pendentes"
**Causa:** Status não é "Entregue"
**Solução:** Confirme a entrega primeiro

### Problema: Nota aparece em "Minhas Entregas" mas não em "Notas Pendentes"
**Causa:** Status de pagamento não é "Pendente"
**Solução:** Verifique se o pagamento foi marcado corretamente

## ✅ Correções Aplicadas

### Arquivo: `components/EntregadorPendingNotes.tsx`

**Linha ~183:**
```typescript
// ✅ Adicionado filtro por status "Entregue"
p.status === 'Entregue' &&
```

**Linha ~178-200:**
```typescript
// ✅ Adicionados logs de debug
console.log('🔍 EntregadorPendingNotes - Todos os pedidos:', pedidos.length);
console.log('📋 Pedido do entregador:', { ... });
console.log('✅ Notas pendentes encontradas:', pendingNotes.length);
```

## 🎯 Próximos Passos

1. **Teste o cenário completo:**
   - Criar pedido
   - Atribuir ao entregador
   - Confirmar com entrada parcial
   - Verificar em "Notas Pendentes"

2. **Verifique os logs:**
   - Abra o console (F12)
   - Veja os logs de debug
   - Identifique onde está o problema

3. **Se ainda não funcionar:**
   - Copie os logs do console
   - Verifique os valores no localStorage
   - Verifique se o pedido está no banco de dados

## 📞 Suporte

### Se o problema persistir:

1. **Abra o console (F12)**
2. **Vá em "Notas Pendentes"**
3. **Copie todos os logs que começam com 🔍 ou 📋**
4. **Verifique:**
   - Quantos pedidos do entregador existem
   - Quantos estão com status "Entregue"
   - Quantos têm statusPagamento "Pendente"
   - Quantos passam no filtro (match: true)

---

**Status:** ✅ Correções aplicadas
**Data:** 03/11/2025
**Arquivos modificados:** `components/EntregadorPendingNotes.tsx`
