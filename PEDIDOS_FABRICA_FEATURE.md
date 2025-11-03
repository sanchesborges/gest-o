# 🏭 Pedidos Para Fábrica - Nova Funcionalidade

## 📋 Descrição

Nova seção que consolida automaticamente todos os produtos vendidos nos pedidos de clientes, gerando um pedido agregado para enviar à fábrica.

## 🎯 Objetivo

Facilitar o processo de reposição de estoque, consolidando automaticamente as quantidades de produtos vendidos em um único pedido para a fábrica.

## 🚀 Como Acessar

1. Acesse a página **Gestão de Pedidos**
2. Clique no botão **"Pedidos Fábrica"** (roxo) ao lado do botão "Novo Pedido"

## ⚙️ Funcionalidades

### 1. Filtros Disponíveis

- **Data Início**: Filtra pedidos a partir de uma data específica
- **Data Fim**: Filtra pedidos até uma data específica
- **Incluir Pedidos Entregues**: Por padrão, considera apenas pedidos pendentes. Marque esta opção para incluir também os entregues

### 2. Consolidação Automática

O sistema automaticamente:
- Agrupa todos os produtos dos pedidos filtrados
- Soma as quantidades de cada produto
- Exibe uma lista consolidada ordenada alfabeticamente
- Calcula o total de itens necessários

### 3. Exportação e Compartilhamento

#### Baixar Imagem
- Gera uma imagem PNG do pedido consolidado
- Formato profissional pronto para impressão
- Inclui cabeçalho com data e período

#### Compartilhar WhatsApp
- Envia mensagem formatada com a lista de produtos
- Inclui todas as informações do pedido
- Abre automaticamente o WhatsApp Web
- Permite anexar a imagem manualmente

## 📊 Exemplo de Uso

### Cenário
Você registrou:
- 10 pedidos de clientes diferentes
- Cada pedido contém diversos produtos
- Precisa fazer um pedido para a fábrica

### Processo
1. Acesse "Pedidos Fábrica"
2. Defina o período (opcional)
3. O sistema mostra:
   - Pão de Queijo 1kg: 45 un
   - Biscoito de Queijo 1kg: 30 un
   - Pão de Queijo 5kg: 12 un
   - Total: 87 itens

4. Clique em "Compartilhar WhatsApp"
5. Mensagem é enviada automaticamente
6. Baixe a imagem e anexe no WhatsApp

## 📱 Formato da Mensagem WhatsApp

```
*PEDIDO PARA FÁBRICA - MANÁ*

📅 *Data:* 02/11/2025
📊 *Período:* 01/11/2025 até 02/11/2025

*PRODUTOS NECESSÁRIOS:*
━━━━━━━━━━━━━━━━━━━━

• *Pão de Queijo 1kg*: 45 un
• *Biscoito de Queijo 1kg*: 30 un
• *Pão de Queijo 5kg*: 12 un

━━━━━━━━━━━━━━━━━━━━
📦 *TOTAL:* 87 itens

_Pedido gerado automaticamente pelo sistema Maná_
```

## 🎨 Interface

### Cabeçalho
- Título: "PEDIDO PARA FÁBRICA"
- Subtítulo: "Maná - Produtos de Qualidade"
- Data de geração
- Período filtrado (se aplicável)

### Tabela
- Coluna 1: Nome do Produto
- Coluna 2: Quantidade Total
- Rodapé: Total de itens

### Botões de Ação
- **Baixar Imagem** (verde): Download em PNG
- **Compartilhar WhatsApp** (verde escuro): Envio direto

## 💡 Dicas de Uso

1. **Pedidos Pendentes**: Por padrão, considera apenas pedidos não entregues para evitar duplicação
2. **Período Específico**: Use os filtros de data para pedidos de uma semana ou mês específico
3. **Reposição Regular**: Gere o pedido semanalmente para manter o estoque sempre abastecido
4. **Backup**: Sempre baixe a imagem para ter um registro visual do pedido

## 🔧 Tecnologias Utilizadas

- **html2canvas**: Conversão de HTML para imagem
- **React Hooks**: useState, useMemo, useRef
- **WhatsApp API**: Compartilhamento direto
- **Tailwind CSS**: Estilização responsiva

## ✅ Benefícios

1. **Economia de Tempo**: Não precisa mais contar manualmente os produtos
2. **Precisão**: Elimina erros de contagem
3. **Profissionalismo**: Pedidos formatados e organizados
4. **Rastreabilidade**: Histórico de pedidos com data e período
5. **Praticidade**: Compartilhamento direto via WhatsApp

## 🎯 Próximos Passos

Após implementação, você pode:
1. Testar com diferentes períodos
2. Verificar a consolidação de produtos
3. Gerar e compartilhar seu primeiro pedido
4. Ajustar os filtros conforme necessidade

---

**Desenvolvido para otimizar o processo de reposição de estoque da Maná** 🍞
