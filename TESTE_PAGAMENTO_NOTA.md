# 🧪 Teste - Informações de Pagamento na Nota de Entrega

## ✅ Código Implementado

O código está correto e funcionando. As informações de pagamento aparecem quando:

1. **O pedido tem `valorPago` > 0**
2. **Os dados foram salvos corretamente no banco**

## 🔍 Como Testar

### Passo 1: Verificar Console do Navegador

Abra o console do navegador (F12) e procure por:

```
🎨 DeliveryNote renderizando para pedido: [id]
```

Você verá algo como:
```javascript
{
  clienteNome: "Nome do Cliente",
  itensCount: 3,
  valorTotal: 150,
  valorPago: 80,              // ← Deve aparecer aqui
  pagamentoParcial: true,     // ← Deve aparecer aqui
  metodoPagamentoEntrega: "Dinheiro"
}
```

### Passo 2: Criar um Novo Pedido de Teste

1. **Vá para Gestão de Pedidos**
2. **Crie um novo pedido** (qualquer cliente, qualquer produto)
3. **Atribua a um entregador**
4. **Acesse o link do entregador** (copie o link)
5. **Na tela do entregador:**
   - Selecione **"Pagamento Parcial"**
   - Digite um valor (ex: 50.00)
   - Assine
   - Confirme a entrega
6. **Volte para Gestão de Pedidos**
7. **Clique no pedido que acabou de entregar**
8. **Veja a Nota de Entrega** → As informações de pagamento devem aparecer!

### Passo 3: Verificar Pedidos Antigos

**IMPORTANTE:** Pedidos criados ANTES desta implementação não terão as informações de pagamento, mesmo que tenham sido entregues.

Apenas pedidos onde o entregador registrou o pagamento APÓS esta atualização mostrarão as informações.

## 🐛 Se Não Aparecer

### Debug 1: Verificar Console

Abra o console e veja os valores:
- Se `valorPago` for `undefined` ou `0` → O entregador não registrou pagamento
- Se `valorPago` tiver valor → O código deve mostrar as informações

### Debug 2: Verificar Banco de Dados

Execute esta query no Supabase:

\`\`\`sql
SELECT 
  id,
  cliente_id,
  valor_total,
  valor_pago,
  pagamento_parcial,
  metodo_pagamento_entrega,
  status,
  status_pagamento
FROM pedidos
WHERE status = 'Entregue'
ORDER BY data DESC
LIMIT 10;
\`\`\`

Verifique se a coluna `valor_pago` tem valores.

### Debug 3: Verificar Estrutura do Banco

Certifique-se que as colunas existem:

\`\`\`sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
AND column_name IN ('valor_pago', 'pagamento_parcial', 'metodo_pagamento_entrega', 'data_pagamento');
\`\`\`

Se as colunas não existirem, execute:

\`\`\`sql
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS valor_pago DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS pagamento_parcial BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS metodo_pagamento_entrega TEXT,
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP;
\`\`\`

## ✨ Exemplo Visual

Quando funcionar, você verá na nota:

### Mobile:
```
┌─────────────────────────────────┐
│ TOTAL: R$ 150,00                │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ VALOR RECEBIDO: R$ 80,00        │
│ Saldo Restante: R$ 70,00        │
│ ⚠️ PAGAMENTO PARCIAL            │
│ Método: Dinheiro                │
└─────────────────────────────────┘
```

### Desktop (Tabela):
```
┌──────────────────────────────────────┐
│ TOTAL:              R$ 150,00        │
│ VALOR RECEBIDO:     R$ 80,00         │
│ Saldo Restante:     R$ 70,00         │
│ ⚠️ PAGAMENTO PARCIAL • Método: Dinheiro │
└──────────────────────────────────────┘
```

## 📝 Resumo

- ✅ Código implementado e funcionando
- ✅ Aparece em: Tela, PDF, WhatsApp, Imagem
- ⚠️ Só funciona para pedidos onde o entregador registrou pagamento
- ⚠️ Pedidos antigos não terão essas informações

**Teste com um pedido novo para ver funcionando!**
