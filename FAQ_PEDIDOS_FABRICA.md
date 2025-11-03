# ❓ FAQ: Pedidos Para Fábrica

## 🎯 Perguntas Gerais

### O que é "Pedidos Para Fábrica"?
É uma funcionalidade que consolida automaticamente todos os produtos vendidos nos pedidos de clientes, gerando um pedido agregado para enviar à fábrica.

### Por que usar essa funcionalidade?
- ⏱️ Economiza tempo (2 min vs 30 min manual)
- ✅ Elimina erros de contagem
- 📊 Gera relatórios profissionais
- 📱 Compartilha direto no WhatsApp

### Onde encontro essa funcionalidade?
```
Gestão de Pedidos → Botão "Pedidos Fábrica" (roxo)
```

---

## 🔍 Filtros e Configurações

### Como funciona o filtro padrão?
Por padrão, o sistema mostra apenas pedidos com status **PENDENTE**, ou seja, pedidos que ainda não foram entregues.

### Por que só mostra pedidos pendentes?
Para evitar duplicação. Se você já fez um pedido para a fábrica e os produtos foram entregues, não faz sentido pedir novamente.

### Como incluir pedidos já entregues?
Marque o checkbox **"Incluir pedidos entregues"**. Útil para análises históricas.

### Como filtrar por período?
Use os campos:
- **Data Início**: Pedidos a partir dessa data
- **Data Fim**: Pedidos até essa data

### Posso deixar os filtros vazios?
Sim! Sem filtros de data, o sistema mostra todos os pedidos pendentes.

### Os filtros são obrigatórios?
Não. Você pode usar ou não, conforme sua necessidade.

---

## 📊 Consolidação

### Como funciona a consolidação?
O sistema:
1. Pega todos os pedidos filtrados
2. Agrupa produtos iguais
3. Soma as quantidades
4. Ordena alfabeticamente

### Exemplo de consolidação?
```
Entrada:
- Pedido 1: Pão de Queijo 1kg (10 un)
- Pedido 2: Pão de Queijo 1kg (15 un)
- Pedido 3: Biscoito 1kg (5 un)

Saída:
- Biscoito 1kg: 5 un
- Pão de Queijo 1kg: 25 un
Total: 30 itens
```

### A consolidação é automática?
Sim! Você não precisa fazer nada, o sistema calcula automaticamente.

### Como sei se a consolidação está correta?
Você pode verificar manualmente alguns produtos ou confiar no sistema (testado e validado).

---

## 💾 Exportação

### Quais formatos posso exportar?
- **Imagem PNG**: Alta qualidade, pronta para impressão
- **WhatsApp**: Mensagem formatada + opção de anexar imagem

### A imagem tem boa qualidade?
Sim! Gerada em alta resolução (scale 2x) para impressão profissional.

### Posso editar a imagem depois?
Sim, você pode abrir em qualquer editor de imagens.

### Como baixar a imagem?
Clique no botão **"Baixar Imagem"** (verde). O download inicia automaticamente.

### Onde a imagem é salva?
Na pasta de downloads padrão do seu navegador.

### Qual o nome do arquivo?
```
pedido-fabrica-YYYY-MM-DD.png
Exemplo: pedido-fabrica-2025-11-02.png
```

---

## 📱 WhatsApp

### Como funciona o compartilhamento?
1. Clique em "Compartilhar WhatsApp"
2. Sistema gera mensagem formatada
3. WhatsApp Web abre automaticamente
4. Você escolhe o contato e envia

### A mensagem já vem pronta?
Sim! Formatada profissionalmente com:
- Título
- Data
- Período (se aplicável)
- Lista de produtos
- Total de itens

### Posso editar a mensagem?
Sim! Antes de enviar, você pode adicionar ou modificar o texto.

### Como anexar a imagem no WhatsApp?
1. Baixe a imagem primeiro
2. No WhatsApp, clique no ícone de anexo
3. Selecione a imagem baixada
4. Envie

### Por que não anexa a imagem automaticamente?
Limitação do WhatsApp Web. A API não permite anexar arquivos automaticamente.

### Funciona no WhatsApp mobile?
Sim! O link abre o WhatsApp do seu celular se você estiver usando mobile.

---

## 🐛 Problemas Comuns

### "Nenhum produto encontrado"
**Causas possíveis:**
- Não há pedidos no período selecionado
- Todos os pedidos estão entregues (e checkbox desmarcado)
- Filtros muito restritivos

**Solução:**
- Ajuste os filtros
- Marque "incluir entregues"
- Verifique se há pedidos cadastrados

### Imagem não baixa
**Causas possíveis:**
- Bloqueador de pop-ups ativo
- Permissões do navegador
- Problema temporário

**Solução:**
- Desative bloqueador de pop-ups
- Verifique permissões
- Tente em outro navegador
- Recarregue a página

### WhatsApp não abre
**Causas possíveis:**
- WhatsApp Web não está acessível
- Sem conexão com internet
- Bloqueador de pop-ups

**Solução:**
- Verifique conexão
- Desative bloqueador
- Tente abrir WhatsApp Web manualmente

### Quantidades parecem erradas
**Causas possíveis:**
- Filtros aplicados incorretamente
- Pedidos duplicados no sistema
- Checkbox "incluir entregues" marcado/desmarcado

**Solução:**
- Verifique os filtros
- Verifique se não há pedidos duplicados
- Ajuste o checkbox conforme necessário

### Modal não abre
**Causas possíveis:**
- Erro no sistema
- Cache do navegador
- Problema temporário

**Solução:**
- Recarregue a página (F5)
- Limpe cache do navegador
- Tente em modo anônimo
- Verifique console para erros

---

## ⚙️ Técnicas

### Posso usar em qualquer navegador?
Sim! Funciona em:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Funciona offline?
Não. Precisa de conexão para:
- Buscar pedidos do banco
- Gerar imagem
- Abrir WhatsApp

### É seguro?
Sim! Todos os dados ficam no seu sistema, nada é enviado para servidores externos.

### Posso usar no celular?
Sim! Interface totalmente responsiva.

### Há limite de produtos?
Não. O sistema suporta qualquer quantidade de produtos.

### Há limite de pedidos?
Não. Mas muitos pedidos podem deixar a geração de imagem mais lenta.

---

## 📈 Uso Avançado

### Posso gerar múltiplos pedidos?
Sim! Você pode:
1. Gerar pedido da semana 1
2. Baixar imagem
3. Ajustar filtros
4. Gerar pedido da semana 2
5. Baixar outra imagem

### Como comparar períodos?
1. Gere pedido do período 1
2. Anote ou baixe
3. Ajuste filtros para período 2
4. Compare os resultados

### Posso salvar configurações de filtros?
Não atualmente. Você precisa configurar toda vez que abrir.

### Posso exportar para Excel?
Não diretamente. Mas você pode:
1. Baixar a imagem
2. Usar OCR para extrair dados
3. Ou digitar manualmente

### Posso automatizar o processo?
Não atualmente. É necessário abrir manualmente.

---

## 🎯 Melhores Práticas

### Com que frequência devo usar?
Recomendado:
- **Semanal**: Para reposição regular
- **Mensal**: Para análise e planejamento
- **Sob demanda**: Quando necessário

### Devo sempre baixar a imagem?
Recomendado para:
- ✅ Backup/histórico
- ✅ Relatórios
- ✅ Apresentações

### Como organizar as imagens?
Sugestão de estrutura:
```
📁 Pedidos Fábrica/
  📁 2025/
    📁 Novembro/
      📄 pedido-semana-44.png
      📄 pedido-semana-45.png
    📁 Outubro/
      📄 pedido-semana-40.png
```

### Devo incluir pedidos entregues?
Depende do objetivo:
- **Reposição**: Não (só pendentes)
- **Análise**: Sim (histórico completo)
- **Planejamento**: Não (só futuros)

---

## 🔮 Futuras Melhorias

### Recursos planejados:
- 📧 Envio por email
- 📄 Exportação em PDF
- 📊 Gráficos de tendência
- 🔔 Alertas automáticos
- 💾 Salvar pedidos gerados
- 👥 Filtro por cliente
- 📅 Agendamento automático

### Como sugerir melhorias?
Entre em contato com o suporte ou desenvolvedor.

---

## 📞 Suporte

### Ainda tem dúvidas?
1. Leia a documentação completa em `PEDIDOS_FABRICA_FEATURE.md`
2. Veja exemplos práticos em `EXEMPLOS_USO_PEDIDOS_FABRICA.md`
3. Siga o guia de testes em `COMO_TESTAR_PEDIDOS_FABRICA.md`

### Encontrou um bug?
Reporte com:
- Descrição do problema
- Passos para reproduzir
- Screenshots (se possível)
- Navegador e versão

### Precisa de ajuda?
Entre em contato com o suporte técnico.

---

**Esperamos que essas respostas ajudem! 🎉**
