# 🧪 Como Testar: Pedidos Para Fábrica

## ✅ Checklist de Teste

### 1. Acesso à Funcionalidade
- [ ] Abrir a página "Gestão de Pedidos"
- [ ] Verificar se o botão "Pedidos Fábrica" (roxo) está visível
- [ ] Clicar no botão e verificar se o modal abre

### 2. Interface do Modal
- [ ] Verificar cabeçalho com ícone de fábrica
- [ ] Verificar presença dos filtros (Data Início, Data Fim, Checkbox)
- [ ] Verificar se a tabela de produtos é exibida
- [ ] Verificar botões de ação (Baixar Imagem, Compartilhar WhatsApp)

### 3. Filtros

#### Sem Filtros (Padrão)
- [ ] Abrir modal sem definir filtros
- [ ] Verificar se mostra apenas pedidos PENDENTES
- [ ] Verificar se a consolidação está correta

#### Com Data Início
- [ ] Definir uma data de início
- [ ] Verificar se filtra pedidos a partir dessa data
- [ ] Verificar se as quantidades mudam

#### Com Data Fim
- [ ] Definir uma data de fim
- [ ] Verificar se filtra pedidos até essa data
- [ ] Verificar se as quantidades mudam

#### Com Período Completo
- [ ] Definir data início e fim
- [ ] Verificar se filtra corretamente o período
- [ ] Verificar se o período aparece no cabeçalho

#### Incluir Pedidos Entregues
- [ ] Marcar checkbox "Incluir pedidos entregues"
- [ ] Verificar se as quantidades aumentam
- [ ] Desmarcar e verificar se volta ao normal

### 4. Consolidação de Produtos

#### Verificar Cálculos
- [ ] Criar 2-3 pedidos com produtos repetidos
- [ ] Abrir "Pedidos Fábrica"
- [ ] Verificar se as quantidades estão somadas corretamente
- [ ] Verificar se o total de itens está correto

#### Exemplo de Teste Manual:
```
Pedido 1:
- Pão de Queijo 1kg: 10 un
- Biscoito 1kg: 5 un

Pedido 2:
- Pão de Queijo 1kg: 15 un
- Biscoito 1kg: 8 un

Resultado Esperado:
- Pão de Queijo 1kg: 25 un
- Biscoito 1kg: 13 un
- Total: 38 itens
```

### 5. Ordenação
- [ ] Verificar se produtos estão em ordem alfabética
- [ ] Adicionar produtos com nomes diferentes
- [ ] Verificar se a ordenação se mantém

### 6. Exportar Imagem

#### Baixar Imagem
- [ ] Clicar em "Baixar Imagem"
- [ ] Verificar se o download inicia
- [ ] Abrir a imagem baixada
- [ ] Verificar qualidade da imagem
- [ ] Verificar se todos os elementos estão visíveis:
  - [ ] Cabeçalho
  - [ ] Data
  - [ ] Período (se aplicável)
  - [ ] Tabela completa
  - [ ] Total
  - [ ] Rodapé

#### Qualidade Visual
- [ ] Verificar se o texto está legível
- [ ] Verificar se as cores estão corretas
- [ ] Verificar se não há cortes ou sobreposições
- [ ] Verificar se a imagem está em alta resolução

### 7. Compartilhar WhatsApp

#### Mensagem
- [ ] Clicar em "Compartilhar WhatsApp"
- [ ] Verificar se o WhatsApp Web abre
- [ ] Verificar se a mensagem está formatada corretamente
- [ ] Verificar se contém:
  - [ ] Título "PEDIDO PARA FÁBRICA - MANÁ"
  - [ ] Data atual
  - [ ] Período (se filtrado)
  - [ ] Lista de produtos com quantidades
  - [ ] Total de itens
  - [ ] Rodapé

#### Formato da Mensagem
```
Verificar se está assim:

*PEDIDO PARA FÁBRICA - MANÁ*

📅 *Data:* [data atual]
📊 *Período:* [se aplicável]

*PRODUTOS NECESSÁRIOS:*
━━━━━━━━━━━━━━━━━━━━

• *Produto 1*: X un
• *Produto 2*: Y un

━━━━━━━━━━━━━━━━━━━━
📦 *TOTAL:* Z itens

_Pedido gerado automaticamente pelo sistema Maná_
```

### 8. Casos Especiais

#### Sem Pedidos
- [ ] Limpar todos os filtros
- [ ] Verificar se mostra mensagem "Nenhum produto encontrado"
- [ ] Verificar se os botões de ação não aparecem

#### Período Sem Pedidos
- [ ] Definir período futuro ou sem pedidos
- [ ] Verificar mensagem apropriada
- [ ] Verificar se sugere ajustar filtros

#### Muitos Produtos
- [ ] Criar pedidos com 10+ produtos diferentes
- [ ] Verificar se a tabela rola corretamente
- [ ] Verificar se a imagem captura todos os produtos

### 9. Responsividade

#### Mobile
- [ ] Abrir em dispositivo móvel ou modo responsivo
- [ ] Verificar se o modal se ajusta à tela
- [ ] Verificar se os filtros ficam em coluna
- [ ] Verificar se os botões ficam empilhados
- [ ] Verificar se a tabela é rolável

#### Desktop
- [ ] Verificar layout em tela grande
- [ ] Verificar se os filtros ficam em linha
- [ ] Verificar se os botões ficam lado a lado

### 10. Performance

#### Tempo de Resposta
- [ ] Abrir modal com poucos pedidos (< 10)
- [ ] Abrir modal com muitos pedidos (> 50)
- [ ] Verificar se não há travamentos
- [ ] Verificar se os filtros respondem rapidamente

#### Geração de Imagem
- [ ] Medir tempo para gerar imagem pequena
- [ ] Medir tempo para gerar imagem grande
- [ ] Verificar se não trava o navegador

### 11. Integração

#### Com Pedidos Existentes
- [ ] Criar pedido novo
- [ ] Verificar se aparece imediatamente em "Pedidos Fábrica"
- [ ] Marcar pedido como entregue
- [ ] Verificar se some da lista padrão
- [ ] Marcar checkbox e verificar se volta

#### Com Produtos
- [ ] Adicionar produto novo
- [ ] Criar pedido com esse produto
- [ ] Verificar se aparece corretamente consolidado

### 12. Fechar Modal
- [ ] Clicar no X no canto superior direito
- [ ] Verificar se fecha corretamente
- [ ] Clicar fora do modal
- [ ] Verificar se fecha corretamente
- [ ] Reabrir e verificar se os filtros foram resetados

## 🐛 Problemas Comuns e Soluções

### Imagem não baixa
- Verificar permissões do navegador
- Tentar em navegador diferente
- Verificar bloqueador de pop-ups

### WhatsApp não abre
- Verificar se WhatsApp Web está funcionando
- Verificar conexão com internet
- Tentar copiar mensagem manualmente

### Quantidades erradas
- Verificar se os filtros estão corretos
- Verificar se os pedidos têm os produtos esperados
- Verificar se não há pedidos duplicados

### Modal não abre
- Verificar console do navegador para erros
- Recarregar a página
- Limpar cache do navegador

## ✨ Teste Completo Sugerido

1. **Preparação**
   - Criar 5 pedidos com produtos variados
   - Alguns produtos repetidos entre pedidos
   - Marcar 2 pedidos como entregues

2. **Teste Básico**
   - Abrir "Pedidos Fábrica"
   - Verificar consolidação padrão (só pendentes)
   - Marcar "incluir entregues" e verificar diferença

3. **Teste de Filtros**
   - Definir período da última semana
   - Verificar se filtra corretamente
   - Limpar filtros

4. **Teste de Exportação**
   - Baixar imagem
   - Verificar qualidade
   - Compartilhar no WhatsApp
   - Verificar mensagem

5. **Teste de Usabilidade**
   - Fechar e reabrir modal
   - Testar em mobile
   - Testar com muitos produtos

## 📊 Resultado Esperado

Ao final dos testes, você deve ter:
- ✅ Modal funcionando perfeitamente
- ✅ Filtros aplicando corretamente
- ✅ Consolidação precisa de produtos
- ✅ Imagem de alta qualidade
- ✅ Mensagem WhatsApp formatada
- ✅ Interface responsiva
- ✅ Performance adequada

---

**Boa sorte nos testes! 🚀**
