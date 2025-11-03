# 🔧 Instalação: Pagamento na Entrega

## 📋 Pré-requisitos

- Acesso ao Supabase SQL Editor
- Sistema já funcionando com entregadores

## 🚀 Passo a Passo

### 1️⃣ Atualizar Banco de Dados

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole o conteúdo do arquivo `add-payment-fields.sql`:

```sql
-- Adicionar campos de pagamento na tabela pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS valor_pago DECIMAL(10,2) DEFAULT 0;

ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS pagamento_parcial BOOLEAN DEFAULT false;

ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP;

ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS metodo_pagamento_entrega TEXT;

-- Comentários para documentação
COMMENT ON COLUMN pedidos.valor_pago IS 'Valor efetivamente pago pelo cliente no momento da entrega';
COMMENT ON COLUMN pedidos.pagamento_parcial IS 'Indica se o cliente fez apenas um pagamento parcial';
COMMENT ON COLUMN pedidos.data_pagamento IS 'Data em que o pagamento foi registrado pelo entregador';
COMMENT ON COLUMN pedidos.metodo_pagamento_entrega IS 'Método de pagamento usado na entrega (Dinheiro, PIX, etc)';

-- Atualizar pedidos existentes
UPDATE pedidos 
SET valor_pago = 0 
WHERE valor_pago IS NULL;
```

5. Clique em **Run** ou pressione `Ctrl+Enter`
6. Verifique se apareceu "Success. No rows returned"

### 2️⃣ Verificar Instalação

Execute esta query para verificar se os campos foram criados:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos'
AND column_name IN ('valor_pago', 'pagamento_parcial', 'data_pagamento', 'metodo_pagamento_entrega');
```

Deve retornar 4 linhas:
```
valor_pago               | numeric  | YES
pagamento_parcial        | boolean  | YES
data_pagamento          | timestamp| YES
metodo_pagamento_entrega| text     | YES
```

### 3️⃣ Testar Funcionalidade

1. **Criar um pedido de teste:**
   - Acesse "Gestão de Pedidos"
   - Crie um novo pedido (ex: R$ 100,00)

2. **Atribuir a um entregador:**
   - Clique em "Atribuir Entregador"
   - Selecione um entregador
   - Copie o link enviado

3. **Testar como entregador:**
   - Abra o link em uma aba anônima
   - Veja a nova seção "💰 Pagamento"
   - Teste as três opções

4. **Verificar resultados:**
   - Volte para "Gestão de Pedidos"
   - Verifique se o valor foi atualizado
   - Vá em "Contas a Receber"
   - Verifique os totais

## ✅ Checklist de Instalação

- [ ] Script SQL executado com sucesso
- [ ] Campos criados na tabela pedidos
- [ ] Pedido de teste criado
- [ ] Link de entrega testado
- [ ] Opção "Não Pago" testada
- [ ] Opção "Pago Integralmente" testada
- [ ] Opção "Pagamento Parcial" testada
- [ ] Valores atualizados em "Gestão de Pedidos"
- [ ] Totais corretos em "Contas a Receber"

## 🔍 Verificação de Dados

### Ver pedidos com pagamento:
```sql
SELECT 
  id,
  valor_total,
  valor_pago,
  pagamento_parcial,
  status_pagamento,
  data_pagamento
FROM pedidos
WHERE valor_pago > 0;
```

### Ver total pago vs pendente:
```sql
SELECT 
  status_pagamento,
  COUNT(*) as quantidade,
  SUM(valor_total) as total
FROM pedidos
GROUP BY status_pagamento;
```

## 🐛 Troubleshooting

### Erro: "column already exists"
**Solução:** Os campos já foram criados. Pule para o passo 2.

### Erro: "permission denied"
**Solução:** Você precisa de permissões de administrador no Supabase.

### Interface não mostra opções de pagamento
**Solução:** 
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Recarregue a página (Ctrl+F5)
3. Verifique se está usando o link correto do entregador

### Valor não atualiza após entrada
**Solução:**
1. Verifique se o script SQL foi executado
2. Verifique se digitou o valor corretamente
3. Recarregue os dados em "Gestão de Pedidos"

### Erro ao confirmar entrega
**Solução:**
1. Verifique sua conexão com internet
2. Verifique se coletou a assinatura
3. Verifique o console do navegador (F12)

## 📱 Testando em Produção

### Teste Completo:

1. **Criar 3 pedidos de teste:**
   - Pedido A: R$ 100,00
   - Pedido B: R$ 200,00
   - Pedido C: R$ 150,00

2. **Atribuir aos entregadores**

3. **Testar cenários:**
   - Pedido A: Marcar como "Não Pago"
   - Pedido B: Marcar como "Pago Integralmente"
   - Pedido C: Marcar como "Parcial" com entrada de R$ 50

4. **Verificar resultados:**
   ```
   Gestão de Pedidos:
   - Pedido A: R$ 100,00 - PENDENTE
   - Pedido B: R$ 200,00 - PAGO
   - Pedido C: R$ 100,00 - PENDENTE (era R$ 150)
   
   Contas a Receber:
   - Total a Receber: R$ 200,00 (A + C)
   - Total Pago: R$ 200,00 (B)
   ```

## 🎓 Treinamento de Entregadores

### Pontos Importantes:

1. **Sempre coletar assinatura**
2. **Confirmar valor com cliente antes de marcar**
3. **Se cliente pagar tudo, marcar "Pago Integralmente"**
4. **Se cliente der entrada, marcar "Parcial" e digitar valor**
5. **Se cliente não pagar, deixar "Não Pago"**

### Material de Treinamento:

- Leia: `GUIA_RAPIDO_PAGAMENTO_ENTREGA.md`
- Veja: `FLUXO_PAGAMENTO_ENTREGA.md`
- Pratique: Criar pedidos de teste

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no console (F12)
2. Verifique se o script SQL foi executado
3. Verifique se os campos existem no banco
4. Teste com um pedido novo
5. Limpe o cache do navegador

## 🎉 Pronto!

Agora seu sistema está pronto para registrar pagamentos na entrega!

### Próximos Passos:

1. ✅ Treinar entregadores
2. ✅ Monitorar primeiras entregas
3. ✅ Coletar feedback
4. ✅ Ajustar conforme necessário

## 📚 Documentação Adicional

- `IMPLEMENTACAO_PAGAMENTO_ENTREGADOR.md` - Detalhes técnicos
- `GUIA_RAPIDO_PAGAMENTO_ENTREGA.md` - Guia para usuários
- `FLUXO_PAGAMENTO_ENTREGA.md` - Fluxos visuais
- `add-payment-fields.sql` - Script SQL
