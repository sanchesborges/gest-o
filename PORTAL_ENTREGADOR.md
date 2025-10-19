# 🚚 Portal do Entregador - Maná

## Como Funciona

### 🔗 Link de Acesso

Quando você atribui um pedido a um entregador, o sistema gera automaticamente um link único:

```
https://seusite.com/#/entregador/[ID_DO_ENTREGADOR]
```

### 🎯 Acesso Restrito

O entregador que acessar esse link verá **APENAS**:

1. ✅ **Seus próprios pedidos** (filtrados pelo ID dele)
2. ✅ **Botão de Pedidos** na barra inferior
3. ❌ **NÃO** tem acesso a:
   - Dashboard administrativo
   - Estoque
   - Clientes
   - Financeiro
   - Produtos
   - Outros entregadores

### 📱 Interface do Entregador

A interface é simplificada e mostra apenas:

- **Lista de Pedidos**: Somente os pedidos atribuídos a ele
- **Filtros**: Status e Cliente (para organizar suas entregas)
- **Ações Disponíveis**:
  - Ver Romaneio (Nota de Entrega)
  - Coletar Assinatura
  - Confirmar Entrega

### 🔐 Segurança

- Cada entregador tem um ID único
- O link só mostra pedidos daquele entregador específico
- Não há acesso a dados sensíveis do negócio
- Não pode criar, editar ou deletar pedidos

### 📨 Mensagem WhatsApp

Quando você atribui um pedido, a mensagem enviada inclui:

```
*NOVA ENTREGA ATRIBUÍDA - MANÁ*

Olá, [Nome]! Você tem uma nova entrega.

📦 DETALHES DA ENTREGA
━━━━━━━━━━━━━━━━━━━━
Cliente: [Nome do Cliente]
Endereço: [Endereço]
Telefone Cliente: [Telefone]

Itens para Entregar:
- [Quantidade]x [Produto]

💰 Valor Total a Receber: R$ [Valor]
💳 Condição de Pagamento: [Condição]

━━━━━━━━━━━━━━━━━━━━
🔗 ACESSE SEU PORTAL DE ENTREGAS:
[Link único do entregador]

Clique no link acima para ver seus pedidos e coletar assinaturas.
```

### 🎨 Experiência do Usuário

1. **Entregador recebe a mensagem** com todas as informações
2. **Clica no link** do portal
3. **Vê apenas seus pedidos** pendentes
4. **Abre o romaneio** do pedido
5. **Coleta a assinatura** do cliente
6. **Confirma a entrega**
7. Sistema atualiza automaticamente o status

### 🔄 Fluxo Completo

```
Admin → Atribui Pedido → Entregador
                ↓
        Mensagem WhatsApp
                ↓
        Link do Portal
                ↓
        Página Restrita
                ↓
        Apenas Seus Pedidos
                ↓
        Coleta Assinatura
                ↓
        Confirma Entrega
```

---

**Nota**: O portal do entregador é totalmente responsivo e funciona perfeitamente em dispositivos móveis!
