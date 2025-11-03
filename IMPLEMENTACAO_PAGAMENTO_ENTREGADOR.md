# Implementação: Pagamento na Entrega

## 📋 Resumo da Funcionalidade

Agora o entregador pode registrar o pagamento diretamente na nota de entrega, com três opções:

### 1. ⏳ Não Pago (Pendente)
- Cliente não pagou na entrega
- Status de pagamento permanece **PENDENTE**
- Valor total não muda
- Aparece em "Contas a Receber"

### 2. ✅ Pago Integralmente
- Cliente pagou o valor total
- Status de pagamento muda para **PAGO**
- Valor é somado em "Total Pago" na página Contas a Receber
- Não aparece mais em "Contas a Receber" (pendentes)

### 3. 💵 Pagamento Parcial (Entrada)
- Cliente deu uma entrada (pagamento parcial)
- Entregador informa o valor da entrada
- Status de pagamento permanece **PENDENTE**
- **Valor total do pedido é ABATIDO** pelo valor da entrada
- Exemplo: Nota de R$ 100, cliente deu R$ 50
  - Novo valor total: R$ 50
  - Status: PENDENTE
  - Aparece em "Contas a Receber" com o novo valor (R$ 50)

## 🗄️ Alterações no Banco de Dados

### Novos Campos na Tabela `pedidos`:

```sql
-- Valor efetivamente pago pelo cliente
valor_pago DECIMAL(10,2) DEFAULT 0

-- Indica se foi pagamento parcial
pagamento_parcial BOOLEAN DEFAULT false

-- Data do pagamento
data_pagamento TIMESTAMP

-- Método de pagamento usado na entrega
metodo_pagamento_entrega TEXT
```

### Script SQL:
Execute o arquivo `add-payment-fields.sql` no Supabase.

## 📱 Interface do Entregador

### Nova Seção: "💰 Pagamento"

Aparece antes da assinatura, com três opções de radio button:

1. **⏳ Não Pago (Pendente)** - Padrão
2. **✅ Pago Integralmente** - Marca como pago
3. **💵 Pagamento Parcial (Entrada)** - Abre campo para valor

### Campo de Entrada (quando "Pagamento Parcial" selecionado):
- Input numérico para valor da entrada
- Mostra cálculo em tempo real:
  - Valor Total
  - Entrada
  - Saldo Restante
- Validação: entrada deve ser menor que o total

## 🔄 Fluxo de Funcionamento

### Cenário 1: Cliente Não Paga
```
1. Entregador seleciona "Não Pago"
2. Coleta assinatura
3. Confirma entrega
4. Status: ENTREGUE / PENDENTE
5. Aparece em "Contas a Receber"
```

### Cenário 2: Cliente Paga Tudo
```
1. Entregador seleciona "Pago Integralmente"
2. Coleta assinatura
3. Confirma entrega
4. Status: ENTREGUE / PAGO
5. Soma em "Total Pago"
6. NÃO aparece em "Contas a Receber"
```

### Cenário 3: Cliente Dá Entrada
```
1. Entregador seleciona "Pagamento Parcial"
2. Informa valor da entrada (ex: R$ 50)
3. Sistema calcula saldo (R$ 100 - R$ 50 = R$ 50)
4. Coleta assinatura
5. Confirma entrega
6. Status: ENTREGUE / PENDENTE
7. Valor total atualizado para R$ 50
8. Aparece em "Contas a Receber" com novo valor
```

## 📊 Impacto nas Páginas

### Gestão de Pedidos
- Coluna "Valor Total" mostra valor atualizado (após abatimento)
- Coluna "Pagamento" mostra status correto (PAGO/PENDENTE)

### Contas a Receber
- **Total a Receber**: Soma apenas pedidos PENDENTES (com valor atualizado)
- **Total Pago**: Soma pedidos com status PAGO
- Lista mostra apenas pedidos PENDENTES ou ATRASADOS

## 📝 Mensagem WhatsApp

A mensagem enviada ao confirmar entrega agora inclui informações de pagamento:

### Se Pago:
```
✅ PAGAMENTO: PAGO INTEGRALMENTE
```

### Se Parcial:
```
💰 ENTRADA: R$ 50.00
💳 SALDO RESTANTE: R$ 50.00
```

### Se Não Pago:
```
⏳ PAGAMENTO: PENDENTE
```

## 🔧 Arquivos Modificados

1. **add-payment-fields.sql** - Script SQL para adicionar campos
2. **types.ts** - Interface Pedido atualizada
3. **components/EntregadorDeliveryView.tsx** - Interface de pagamento
4. **hooks/useAppData.ts** - Lógica de atualização de pedidos

## ✅ Como Testar

1. Execute o script SQL no Supabase
2. Acesse como entregador via link de entrega
3. Teste os três cenários:
   - Marcar como não pago
   - Marcar como pago integralmente
   - Informar pagamento parcial (ex: R$ 50 de R$ 100)
4. Verifique em "Gestão de Pedidos" se o valor foi atualizado
5. Verifique em "Contas a Receber" se os totais estão corretos

## 🎯 Próximos Passos (Opcional)

- [ ] Adicionar histórico de pagamentos parciais
- [ ] Permitir múltiplas entradas no mesmo pedido
- [ ] Relatório de entradas recebidas por entregador
- [ ] Notificação automática quando pedido for totalmente pago
