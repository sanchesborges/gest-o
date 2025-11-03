# 💰 Pagamento na Entrega - Sistema Maná

## 🚀 Início Rápido

### Para Instalar (5 minutos):
```sql
-- 1. Abra o Supabase SQL Editor
-- 2. Execute este comando:
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS valor_pago DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pagamento_parcial BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP,
ADD COLUMN IF NOT EXISTS metodo_pagamento_entrega TEXT;

-- 3. Pronto! Recarregue a aplicação
```

### Para Usar:
1. Entregador recebe link via WhatsApp
2. Abre a nota de entrega
3. Marca opção de pagamento:
   - ⏳ Não Pago
   - ✅ Pago Integralmente
   - 💵 Pagamento Parcial (com valor)
4. Coleta assinatura
5. Confirma entrega

## 📖 Documentação

### 📚 [Ver Índice Completo](INDICE_PAGAMENTO_ENTREGA.md)

### Documentos Principais:

| Documento | Para Quem | Tempo |
|-----------|-----------|-------|
| [RESUMO_FUNCIONALIDADE_PAGAMENTO.md](RESUMO_FUNCIONALIDADE_PAGAMENTO.md) | Todos | 5 min |
| [INSTALAR_PAGAMENTO_ENTREGA.md](INSTALAR_PAGAMENTO_ENTREGA.md) | Admin/Dev | 5 min |
| [GUIA_RAPIDO_PAGAMENTO_ENTREGA.md](GUIA_RAPIDO_PAGAMENTO_ENTREGA.md) | Entregadores | 3 min |
| [FLUXO_PAGAMENTO_ENTREGA.md](FLUXO_PAGAMENTO_ENTREGA.md) | Todos | 5 min |

## 🎯 O Que Faz

### Problema Resolvido:
Antes, todas as notas ficavam pendentes. Agora o entregador registra o pagamento na hora da entrega.

### Funcionalidades:
- ✅ Registrar pagamento completo
- ✅ Registrar pagamento parcial (entrada)
- ✅ Abater entrada do valor total automaticamente
- ✅ Atualizar Contas a Receber em tempo real
- ✅ Mensagem WhatsApp com info de pagamento

## 💡 Exemplos

### Exemplo 1: Cliente Não Paga
```
Nota: R$ 100,00
Cliente: "Pago depois"
Ação: Marcar "Não Pago"
Resultado: Fica pendente R$ 100,00
```

### Exemplo 2: Cliente Paga Tudo
```
Nota: R$ 100,00
Cliente: "Aqui está"
Ação: Marcar "Pago Integralmente"
Resultado: Entra em "Total Pago"
```

### Exemplo 3: Cliente Dá Entrada
```
Nota: R$ 100,00
Cliente: "Tenho R$ 50 agora"
Ação: Marcar "Parcial" → Digitar R$ 50
Resultado: Fica pendente R$ 50,00 (abatido R$ 50)
```

## 📊 Impacto

### Antes:
```
10 entregas = R$ 2.000 pendente
(Sem controle de quem pagou)
```

### Agora:
```
10 entregas:
- 4 pagaram: R$ 800 ✅
- 3 não pagaram: R$ 600 ⏳
- 3 deram entrada: R$ 300 de R$ 600 💵

Total Pago: R$ 800
Total a Receber: R$ 900
```

## 🔧 Instalação Completa

### 1. Execute o SQL:
```bash
# Arquivo: add-payment-fields.sql
# Ou copie o comando acima
```

### 2. Verifique:
```sql
SELECT column_name 
FROM information_schema.columns
WHERE table_name = 'pedidos'
AND column_name LIKE '%pago%';
```

### 3. Teste:
- Crie um pedido
- Atribua a entregador
- Abra o link
- Teste as 3 opções

## 📱 Interface

```
┌─────────────────────────────┐
│ 💰 PAGAMENTO                │
├─────────────────────────────┤
│ ○ ⏳ Não Pago               │
│ ○ ✅ Pago Integralmente     │
│ ○ 💵 Pagamento Parcial      │
│                             │
│ [Se parcial: campo valor]   │
│                             │
│ Cálculo automático:         │
│ • Total: R$ 100,00          │
│ • Entrada: R$ 50,00         │
│ • Saldo: R$ 50,00           │
└─────────────────────────────┘
```

## 📈 Relatórios

### Consultas Úteis:

```sql
-- Resumo do dia
SELECT 
  SUM(CASE WHEN status_pagamento = 'Pago' THEN valor_total ELSE 0 END) as pago,
  SUM(CASE WHEN status_pagamento = 'Pendente' THEN valor_total ELSE 0 END) as pendente
FROM pedidos
WHERE DATE(data) = CURRENT_DATE;

-- Clientes com saldo
SELECT c.nome, SUM(p.valor_total) as saldo
FROM clientes c
JOIN pedidos p ON c.id = p.cliente_id
WHERE p.status_pagamento = 'Pendente'
GROUP BY c.nome;
```

**Arquivos de Consultas:**
- 🌟 **[consultas-essenciais-pagamento.sql](consultas-essenciais-pagamento.sql)** - 10 consultas principais (RECOMENDADO)
- 📊 **[consultas-pagamento-entrega-corrigido.sql](consultas-pagamento-entrega-corrigido.sql)** - 16 consultas completas

## 🎓 Treinamento

### Para Entregadores (30 min):
1. Ler [GUIA_RAPIDO_PAGAMENTO_ENTREGA.md](GUIA_RAPIDO_PAGAMENTO_ENTREGA.md)
2. Ver exemplos em [FLUXO_PAGAMENTO_ENTREGA.md](FLUXO_PAGAMENTO_ENTREGA.md)
3. Praticar com pedidos de teste

### Para Administradores (40 min):
1. Ler [RESUMO_FUNCIONALIDADE_PAGAMENTO.md](RESUMO_FUNCIONALIDADE_PAGAMENTO.md)
2. Instalar seguindo [INSTALAR_PAGAMENTO_ENTREGA.md](INSTALAR_PAGAMENTO_ENTREGA.md)
3. Testar todos os cenários
4. Explorar [consultas-pagamento-entrega.sql](consultas-pagamento-entrega.sql)

## ⚠️ Importante

### Para Entregadores:
- ✅ Sempre coletar assinatura
- ✅ Confirmar valor com cliente
- ✅ Se pagou tudo, marcar "Pago"
- ✅ Se deu entrada, marcar "Parcial"
- ❌ Não marcar "Pago" se foi só entrada

### Para Administradores:
- ✅ Executar script SQL antes de usar
- ✅ Testar com pedidos de teste primeiro
- ✅ Treinar entregadores
- ✅ Monitorar primeiras entregas

## 🐛 Problemas?

### Interface não aparece?
```bash
# 1. Limpar cache (Ctrl+Shift+Delete)
# 2. Recarregar (Ctrl+F5)
# 3. Verificar se SQL foi executado
```

### Valor não atualiza?
```sql
-- Verificar se campos existem:
SELECT * FROM pedidos LIMIT 1;
-- Deve ter: valor_pago, pagamento_parcial, etc.
```

### Erro ao confirmar?
- Verificar conexão internet
- Verificar se coletou assinatura
- Ver console do navegador (F12)

**[Ver mais soluções](INSTALAR_PAGAMENTO_ENTREGA.md#troubleshooting)**

## 📞 Suporte

### Documentação:
- **Visão Geral:** [RESUMO_FUNCIONALIDADE_PAGAMENTO.md](RESUMO_FUNCIONALIDADE_PAGAMENTO.md)
- **Instalação:** [INSTALAR_PAGAMENTO_ENTREGA.md](INSTALAR_PAGAMENTO_ENTREGA.md)
- **Uso:** [GUIA_RAPIDO_PAGAMENTO_ENTREGA.md](GUIA_RAPIDO_PAGAMENTO_ENTREGA.md)
- **Fluxos:** [FLUXO_PAGAMENTO_ENTREGA.md](FLUXO_PAGAMENTO_ENTREGA.md)
- **Técnico:** [IMPLEMENTACAO_PAGAMENTO_ENTREGADOR.md](IMPLEMENTACAO_PAGAMENTO_ENTREGADOR.md)
- **Índice:** [INDICE_PAGAMENTO_ENTREGA.md](INDICE_PAGAMENTO_ENTREGA.md)

### Scripts:
- **SQL:** [add-payment-fields.sql](add-payment-fields.sql)
- **Consultas:** [consultas-pagamento-entrega-corrigido.sql](consultas-pagamento-entrega-corrigido.sql) ⭐
- **Correção UUID:** [CORRECAO_ERRO_UUID.md](CORRECAO_ERRO_UUID.md)

## 🎉 Começar Agora

### Passo 1: Instalar
```sql
-- Execute no Supabase:
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS valor_pago DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pagamento_parcial BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP,
ADD COLUMN IF NOT EXISTS metodo_pagamento_entrega TEXT;
```

### Passo 2: Testar
1. Criar pedido de teste
2. Atribuir a entregador
3. Abrir link
4. Testar as 3 opções

### Passo 3: Usar
1. Treinar entregadores
2. Começar a usar em produção
3. Monitorar resultados

**Tempo total: 15 minutos**

## 📊 Métricas de Sucesso

Acompanhe:
- Taxa de pagamento na entrega
- Valor médio de entradas
- Redução de inadimplência
- Tempo de recebimento

**[Ver consultas de métricas](consultas-pagamento-entrega-corrigido.sql)** ⭐

## 🔄 Atualizações

### Versão 1.0 (03/11/2025)
- ✅ Registro de pagamento na entrega
- ✅ Suporte a pagamento parcial
- ✅ Abatimento automático de entradas
- ✅ Atualização de Contas a Receber
- ✅ Mensagem WhatsApp com info de pagamento

## 📝 Licença

Parte do Sistema Maná - Gestão de Produtos Congelados

---

**Dúvidas?** Consulte o [INDICE_PAGAMENTO_ENTREGA.md](INDICE_PAGAMENTO_ENTREGA.md) para encontrar a documentação específica que precisa.

**Pronto para começar?** Leia [INSTALAR_PAGAMENTO_ENTREGA.md](INSTALAR_PAGAMENTO_ENTREGA.md)
