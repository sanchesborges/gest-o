# 💰 Histórico de Notas Pendentes - Entregador

## 🎯 O Que Foi Implementado

Agora o entregador tem acesso a um **histórico de todas as notas pendentes de pagamento** dos seus clientes. Ele pode receber pagamentos de pedidos anteriores diretamente pelo sistema.

## ✨ Funcionalidades

### 1. Aba "Notas Pendentes"
- ✅ Nova aba na página do entregador
- ✅ Lista todas as notas com pagamento pendente ou parcial
- ✅ Mostra saldo devedor de cada nota
- ✅ Destaca notas atrasadas

### 2. Informações Detalhadas
- ✅ Nome do cliente
- ✅ Número do pedido
- ✅ Data da entrega original
- ✅ Valor original (se houve entrada)
- ✅ Entrada já recebida
- ✅ Saldo devedor atual

### 3. Receber Pagamento
- ✅ Modal completo para registrar pagamento
- ✅ Pode receber valor total ou parcial
- ✅ Escolher método de pagamento
- ✅ Cálculo automático do novo saldo
- ✅ Marca como PAGO se receber tudo

## 📱 Interface

### Abas do Entregador:
```
┌─────────────────────────────────────┐
│ [📦 Minhas Entregas] [💰 Notas Pendentes] │
└─────────────────────────────────────┘
```

### Lista de Notas Pendentes:
```
┌─────────────────────────────────────┐
│ ⏰ Notas Pendentes de Pagamento     │
│ 3 notas pendentes                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ João Silva                          │
│ Pedido #ABC123                      │
│ Entrega: 01/11/2025                 │
│                                     │
│ 💰 Pagamento Parcial                │
│ Valor Original: R$ 200,00           │
│ Entrada: R$ 80,00                   │
│                                     │
│ Saldo Devedor: R$ 120,00            │
│                                     │
│ [💵 Receber Pagamento]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Maria Santos              [ATRASADO]│
│ Pedido #DEF456                      │
│ Entrega: 25/10/2025                 │
│                                     │
│ Saldo Devedor: R$ 150,00            │
│                                     │
│ [💵 Receber Pagamento]              │
└─────────────────────────────────────┘
```

### Modal de Pagamento:
```
┌─────────────────────────────────────┐
│ Receber Pagamento              [X]  │
├─────────────────────────────────────┤
│                                     │
│ Cliente                             │
│ João Silva                          │
│ (11) 98765-4321                     │
│                                     │
│ Pedido #ABC123                      │
│ Data: 01/11/2025                    │
│ - Pão de Queijo 5kg (2x)            │
│                                     │
│ 💰 Pagamento Anterior               │
│ Valor Original: R$ 200,00           │
│ Entrada Recebida: R$ 80,00          │
│ Saldo Devedor: R$ 120,00            │
│                                     │
│ Valor Recebido (R$)                 │
│ [120.00]                            │
│ Máximo: R$ 120,00                   │
│                                     │
│ Método de Pagamento                 │
│ [Dinheiro ▼]                        │
│                                     │
│ Resumo do Pagamento                 │
│ Saldo Atual: R$ 120,00              │
│ Valor a Receber: R$ 120,00          │
│ Novo Saldo: R$ 0,00                 │
│ ✅ Pedido será marcado como PAGO!   │
│                                     │
│ [Cancelar] [✅ Confirmar Pagamento] │
└─────────────────────────────────────┘
```

## 🔄 Fluxo de Uso

### Cenário 1: Cliente Quer Pagar Saldo Total

```
1. Entregador vai em "Notas Pendentes"
2. Vê nota do cliente com saldo de R$ 120
3. Clica em "Receber Pagamento"
4. Valor já vem preenchido com R$ 120
5. Escolhe método (Dinheiro/PIX/Boleto)
6. Confirma pagamento
7. Sistema marca nota como PAGA
8. Nota sai da lista de pendentes
```

### Cenário 2: Cliente Quer Dar Mais Uma Entrada

```
1. Entregador vai em "Notas Pendentes"
2. Vê nota do cliente com saldo de R$ 120
3. Clica em "Receber Pagamento"
4. Cliente diz: "Tenho R$ 50 agora"
5. Entregador digita R$ 50
6. Sistema mostra: Novo Saldo = R$ 70
7. Confirma pagamento
8. Nota continua pendente com R$ 70
```

### Cenário 3: Cliente Quer Pagar Tudo de Uma Vez

```
Nota Original: R$ 200
Entrada Anterior: R$ 80
Saldo: R$ 120

Cliente: "Vou pagar tudo agora"
Entregador: Digita R$ 120
Sistema: ✅ Pedido será marcado como PAGO!
Confirma
Nota sai da lista ✅
```

## 💡 Casos de Uso Reais

### Caso 1: Entrega Nova + Pagamento de Nota Antiga
```
Entregador vai entregar novo pedido
Cliente: "Aproveita e recebo aquele de semana passada"
Entregador:
1. Entrega o pedido novo normalmente
2. Vai em "Notas Pendentes"
3. Encontra a nota antiga do cliente
4. Recebe o pagamento
5. Pronto! Duas entregas resolvidas
```

### Caso 2: Cliente Liga Querendo Pagar
```
Cliente liga: "Quero pagar aquela nota"
Entregador:
1. Vai até o cliente
2. Abre "Notas Pendentes"
3. Encontra a nota do cliente
4. Recebe o pagamento
5. Cliente fica em dia
```

### Caso 3: Fim do Mês - Cobranças
```
Entregador vai em "Notas Pendentes"
Vê lista de clientes com saldo
Liga para cada um oferecendo receber
Agenda visitas para receber pagamentos
```

## 🎨 Detalhes Visuais

### Notas Atrasadas:
- 🔴 Borda vermelha
- 🔴 Fundo vermelho claro
- 🔴 Badge "ATRASADO"

### Notas com Pagamento Parcial:
- 🟡 Destaque amarelo
- 💰 Ícone de pagamento parcial
- 📊 Mostra valor original e entrada

### Notas Normais:
- 🟡 Borda amarela
- ⏰ Ícone de relógio
- 💵 Saldo devedor em destaque

## 🔧 Detalhes Técnicos

### Arquivos Criados:
1. ✅ `components/EntregadorPendingNotes.tsx` - Componente principal

### Arquivos Modificados:
1. ✅ `components/Orders.tsx` - Adicionadas abas e integração

### Funcionalidades:
- ✅ Filtro automático por entregador
- ✅ Ordenação por data (mais recentes primeiro)
- ✅ Modal de pagamento completo
- ✅ Validações de valor
- ✅ Cálculo automático de saldo
- ✅ Atualização em tempo real

### Validações:
- ✅ Valor deve ser maior que zero
- ✅ Valor não pode ser maior que o saldo
- ✅ Método de pagamento obrigatório
- ✅ Confirmação antes de salvar

## 📊 Informações Mostradas

### Para Cada Nota:
```
✅ Nome do cliente
✅ Número do pedido
✅ Data da entrega original
✅ Status (Normal/Atrasado)
✅ Valor original (se houve entrada)
✅ Entrada já recebida
✅ Saldo devedor atual
✅ Botão para receber pagamento
```

### No Modal de Pagamento:
```
✅ Dados do cliente (nome e telefone)
✅ Detalhes do pedido
✅ Itens do pedido
✅ Histórico de pagamentos anteriores
✅ Campo para valor a receber
✅ Seleção de método
✅ Resumo do pagamento
✅ Cálculo do novo saldo
✅ Indicação se será marcado como pago
```

## 🎯 Benefícios

### Para o Entregador:
✅ Vê todas as notas pendentes em um só lugar
✅ Pode receber pagamentos de pedidos antigos
✅ Não precisa lembrar quem deve
✅ Facilita cobranças
✅ Aumenta recebimentos

### Para o Cliente:
✅ Pode pagar em múltiplas vezes
✅ Flexibilidade de pagamento
✅ Não precisa pagar tudo de uma vez
✅ Pode pagar quando tiver dinheiro

### Para o Negócio:
✅ Reduz inadimplência
✅ Facilita recebimentos
✅ Controle de pendências
✅ Histórico completo
✅ Mais profissional

## ⚠️ Validações e Regras

### Notas que Aparecem:
✅ Apenas do entregador logado
✅ Apenas com status PENDENTE ou ATRASADO
✅ Apenas com saldo maior que zero
✅ Ordenadas por data (mais recentes primeiro)

### Ao Receber Pagamento:
✅ Se valor = saldo → Marca como PAGO
✅ Se valor < saldo → Atualiza saldo e continua PENDENTE
✅ Se valor > saldo → Não permite

### Métodos de Pagamento:
✅ Dinheiro
✅ PIX
✅ Boleto

## 🎉 Resultado

Agora o entregador tem um **histórico completo de notas pendentes** e pode receber pagamentos de pedidos anteriores de forma fácil e organizada!

### Fluxo Completo:
```
1. Entregador acessa sistema
2. Clica em "Notas Pendentes"
3. Vê lista de clientes com saldo
4. Clica em "Receber Pagamento"
5. Informa valor recebido
6. Escolhe método
7. Confirma
8. Sistema atualiza automaticamente
9. Cliente fica em dia! ✅
```

---

**Arquivos:**
- `components/EntregadorPendingNotes.tsx` (novo)
- `components/Orders.tsx` (modificado)

**Status:** ✅ Implementado e funcionando
**Data:** 03/11/2025
