# 🔍 Diagnóstico: Pedidos Não Aparecem para Entregador

## 🐛 Problema Relatado

- Página "Minhas Entregas" não mostra notas
- Página "Notas Pendentes" não mostra notas
- Mostra "Tudo em dia" mesmo com notas para receber

## 🔍 Verificações Necessárias

### 1. Abrir Console do Navegador (F12)

Pressione **F12** e vá na aba **Console**. Procure por estas mensagens:

#### Na aba "Minhas Entregas":
```
Filtrando pedido: [id] entregadorId do pedido: [uuid] entregadorId da URL: [uuid] Match: true/false
```

#### Na aba "Notas Pendentes":
```
🔍 EntregadorPendingNotes - Todos os pedidos: X
🔍 Pedidos do entregador: X
🔍 Pedidos entregues: X
🔍 Pedidos pendentes: X
📋 Pedido do entregador: { ... }
✅ Notas pendentes encontradas: X
```

### 2. Verificar Dados no Console

Cole este código no console (F12):

```javascript
// Ver todos os pedidos
const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
console.table(pedidos.map(p => ({
  id: p.id.substring(0, 8),
  entregadorId: p.entregadorId ? p.entregadorId.substring(0, 8) : 'SEM',
  status: p.status,
  statusPagamento: p.statusPagamento,
  valorTotal: p.valorTotal,
  valorPago: p.valorPago
})));
```

### 3. Verificar ID do Entregador na URL

A URL deve ser algo como:
```
/#/pedidos/entregador/[UUID-DO-ENTREGADOR]
```

Copie o UUID da URL e compare com os pedidos.

### 4. Verificar no Banco de Dados

Execute no Supabase SQL Editor:

```sql
-- Ver todos os pedidos com entregador
SELECT 
  id,
  entregador_id,
  status,
  status_pagamento,
  valor_total,
  valor_pago,
  pagamento_parcial
FROM pedidos
WHERE entregador_id IS NOT NULL
ORDER BY data DESC;
```

## 🎯 Possíveis Causas

### Causa 1: Entregador ID Não Corresponde
**Sintoma:** Match: false nos logs
**Solução:** Verificar se o pedido foi atribuído ao entregador correto

**Como verificar:**
```javascript
// No console
const urlParams = window.location.hash.split('/');
const entregadorIdURL = urlParams[urlParams.length - 1];
console.log('Entregador ID da URL:', entregadorIdURL);

const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
const pedidosDoEntregador = pedidos.filter(p => p.entregadorId === entregadorIdURL);
console.log('Pedidos deste entregador:', pedidosDoEntregador.length);
```

### Causa 2: Pedidos Não Estão com Status "Entregue"
**Sintoma:** Pedidos aparecem em "Minhas Entregas" mas não em "Notas Pendentes"
**Solução:** Confirmar a entrega dos pedidos

**Como verificar:**
```javascript
const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
const entregadorId = 'COLE_O_ID_AQUI';
const pedidosEntregador = pedidos.filter(p => p.entregadorId === entregadorId);

console.log('Status dos pedidos:');
pedidosEntregador.forEach(p => {
  console.log(`Pedido ${p.id.substring(0,8)}: ${p.status} / ${p.statusPagamento}`);
});
```

### Causa 3: Status de Pagamento Não é "Pendente"
**Sintoma:** Pedidos entregues mas não aparecem em "Notas Pendentes"
**Solução:** Verificar se statusPagamento é "Pendente" ou "Atrasado"

**Como verificar:**
```javascript
const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
const entregadorId = 'COLE_O_ID_AQUI';

const pendentes = pedidos.filter(p => 
  p.entregadorId === entregadorId &&
  p.status === 'Entregue' &&
  (p.statusPagamento === 'Pendente' || p.statusPagamento === 'Atrasado') &&
  p.valorTotal > 0
);

console.log('Notas pendentes:', pendentes.length);
console.table(pendentes.map(p => ({
  id: p.id.substring(0,8),
  status: p.status,
  statusPagamento: p.statusPagamento,
  valorTotal: p.valorTotal
})));
```

### Causa 4: Valor Total é Zero
**Sintoma:** Pedido com entrada igual ao total
**Solução:** Verificar se valorTotal > 0

**Como verificar:**
```javascript
const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
const entregadorId = 'COLE_O_ID_AQUI';

pedidos.filter(p => p.entregadorId === entregadorId).forEach(p => {
  console.log(`Pedido ${p.id.substring(0,8)}:`, {
    valorTotal: p.valorTotal,
    valorPago: p.valorPago,
    saldo: p.valorTotal
  });
});
```

## 🔧 Soluções

### Solução 1: Atribuir Pedido ao Entregador

Se o pedido não tem entregador:
1. Vá em "Gestão de Pedidos" (como admin)
2. Clique em "Atribuir Entregador"
3. Selecione o entregador
4. Confirme

### Solução 2: Confirmar Entrega

Se o pedido está "Pendente" (não entregue):
1. Entregador abre o link da entrega
2. Marca opção de pagamento
3. Coleta assinatura
4. Confirma entrega

### Solução 3: Verificar Status de Pagamento

Se o pedido foi marcado como "Pago" por engano:
```sql
-- No Supabase SQL Editor
UPDATE pedidos 
SET status_pagamento = 'Pendente'
WHERE id = 'ID_DO_PEDIDO';
```

### Solução 4: Verificar Valor Total

Se o valor total é zero:
```sql
-- No Supabase SQL Editor
SELECT id, valor_total, valor_pago, pagamento_parcial
FROM pedidos
WHERE entregador_id = 'ID_DO_ENTREGADOR'
AND valor_total = 0;
```

## 📊 Checklist de Diagnóstico

Execute estas verificações em ordem:

- [ ] **Passo 1:** Abrir console (F12)
- [ ] **Passo 2:** Ir em "Notas Pendentes"
- [ ] **Passo 3:** Ver logs no console
- [ ] **Passo 4:** Copiar ID do entregador da URL
- [ ] **Passo 5:** Executar script de verificação
- [ ] **Passo 6:** Comparar IDs
- [ ] **Passo 7:** Verificar status dos pedidos
- [ ] **Passo 8:** Verificar valores

## 🎯 Exemplo de Diagnóstico

### Cenário: Pedido Não Aparece

**Console mostra:**
```
🔍 EntregadorPendingNotes - Todos os pedidos: 5
🔍 Pedidos do entregador: 2
🔍 Pedidos entregues: 1
🔍 Pedidos pendentes: 1
📋 Pedido do entregador: {
  id: "abc123",
  status: "Pendente",  // ❌ Deveria ser "Entregue"
  statusPagamento: "Pendente",
  valorTotal: 100,
  match: false  // ❌ Não passou no filtro
}
✅ Notas pendentes encontradas: 0
```

**Problema identificado:** Status é "Pendente" em vez de "Entregue"

**Solução:** Confirmar a entrega do pedido

## 🔍 Script de Diagnóstico Completo

Cole este script no console para diagnóstico completo:

```javascript
console.log('=== DIAGNÓSTICO COMPLETO ===');

// 1. ID do entregador da URL
const urlParts = window.location.hash.split('/');
const entregadorIdURL = urlParts[urlParts.length - 1];
console.log('1. Entregador ID da URL:', entregadorIdURL);

// 2. Todos os pedidos
const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
console.log('2. Total de pedidos:', pedidos.length);

// 3. Pedidos do entregador
const pedidosEntregador = pedidos.filter(p => p.entregadorId === entregadorIdURL);
console.log('3. Pedidos do entregador:', pedidosEntregador.length);

// 4. Pedidos entregues
const pedidosEntregues = pedidosEntregador.filter(p => p.status === 'Entregue');
console.log('4. Pedidos entregues:', pedidosEntregues.length);

// 5. Pedidos pendentes
const pedidosPendentes = pedidosEntregues.filter(p => 
  (p.statusPagamento === 'Pendente' || p.statusPagamento === 'Atrasado') &&
  p.valorTotal > 0
);
console.log('5. Notas pendentes:', pedidosPendentes.length);

// 6. Detalhes
console.log('6. Detalhes dos pedidos do entregador:');
console.table(pedidosEntregador.map(p => ({
  id: p.id.substring(0, 8),
  status: p.status,
  statusPagamento: p.statusPagamento,
  valorTotal: p.valorTotal,
  valorPago: p.valorPago || 0,
  saldo: p.valorTotal,
  match: p.status === 'Entregue' && 
         (p.statusPagamento === 'Pendente' || p.statusPagamento === 'Atrasado') &&
         p.valorTotal > 0
})));

console.log('=== FIM DO DIAGNÓSTICO ===');
```

## 📞 Próximos Passos

1. **Execute o script de diagnóstico completo**
2. **Copie os resultados**
3. **Identifique qual verificação falhou**
4. **Aplique a solução correspondente**

## 🎯 Resultado Esperado

Após correção, você deve ver:
```
🔍 EntregadorPendingNotes - Todos os pedidos: 5
🔍 Pedidos do entregador: 2
🔍 Pedidos entregues: 2
🔍 Pedidos pendentes: 2
📋 Pedido do entregador: {
  id: "abc123",
  status: "Entregue",  // ✅
  statusPagamento: "Pendente",  // ✅
  valorTotal: 100,  // ✅
  match: true  // ✅
}
✅ Notas pendentes encontradas: 2  // ✅
```

---

**Execute o diagnóstico e me envie os resultados!** 🔍
