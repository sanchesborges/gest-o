# 🚀 Guia Rápido: Pagamento na Entrega

## 📦 Para o Entregador

### Quando receber o link de entrega:

1. **Abra o link** enviado pelo WhatsApp
2. **Verifique os itens** do pedido com o cliente
3. **Escolha a opção de pagamento:**

   ### ⏳ Cliente NÃO pagou?
   - Deixe marcado "Não Pago (Pendente)"
   - Colete a assinatura
   - Confirme a entrega
   
   ### ✅ Cliente pagou TUDO?
   - Marque "Pago Integralmente"
   - Colete a assinatura
   - Confirme a entrega
   
   ### 💵 Cliente deu uma ENTRADA?
   - Marque "Pagamento Parcial (Entrada)"
   - Digite o valor que o cliente pagou
   - Veja o saldo restante calculado automaticamente
   - Colete a assinatura
   - Confirme a entrega

4. **Colete a assinatura** do cliente
5. **Confirme a entrega**

## 💡 Exemplos Práticos

### Exemplo 1: Cliente Não Pagou
```
Valor da Nota: R$ 100,00
Cliente: "Vou pagar depois"

✅ Marque: "Não Pago (Pendente)"
📊 Resultado: Nota fica pendente de R$ 100,00
```

### Exemplo 2: Cliente Pagou Tudo
```
Valor da Nota: R$ 100,00
Cliente: "Aqui está os R$ 100"

✅ Marque: "Pago Integralmente"
📊 Resultado: Nota marcada como PAGA
```

### Exemplo 3: Cliente Deu Entrada
```
Valor da Nota: R$ 100,00
Cliente: "Só tenho R$ 50 agora, o resto pago depois"

✅ Marque: "Pagamento Parcial (Entrada)"
✅ Digite: 50
📊 Sistema mostra:
   - Valor Total: R$ 100,00
   - Entrada: R$ 50,00
   - Saldo Restante: R$ 50,00
📊 Resultado: Nota fica pendente de R$ 50,00
```

## 🏢 Para o Administrador

### Gestão de Pedidos
- Veja o **Valor Total** atualizado após entradas
- Veja o **Status de Pagamento** (Pago/Pendente)

### Contas a Receber
- **Total a Receber**: Soma dos pedidos pendentes (com valores atualizados)
- **Total Pago**: Soma dos pedidos pagos integralmente
- **Lista**: Mostra apenas pedidos pendentes ou atrasados

## ⚠️ Importante

- ✅ Sempre colete a assinatura do cliente
- ✅ Confirme o valor da entrada com o cliente antes de digitar
- ✅ O saldo restante será cobrado depois
- ✅ Se o cliente pagar tudo, marque "Pago Integralmente"
- ❌ Não marque "Pago" se o cliente só deu entrada

## 🔧 Instalação

Execute este comando no Supabase SQL Editor:

```sql
-- Copie e cole o conteúdo do arquivo add-payment-fields.sql
```

Ou execute diretamente:
```sql
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS valor_pago DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pagamento_parcial BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP,
ADD COLUMN IF NOT EXISTS metodo_pagamento_entrega TEXT;
```

## 📱 Testando

1. Crie um pedido de teste
2. Atribua a um entregador
3. Abra o link enviado
4. Teste as três opções de pagamento
5. Verifique em "Gestão de Pedidos" e "Contas a Receber"

## 🆘 Problemas?

### Campos não aparecem?
- Execute o script SQL no Supabase
- Recarregue a página

### Valor não atualiza?
- Verifique se digitou o valor corretamente
- Valor da entrada deve ser menor que o total

### Erro ao confirmar?
- Verifique se coletou a assinatura
- Verifique sua conexão com internet
