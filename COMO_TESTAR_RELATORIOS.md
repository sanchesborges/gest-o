# 🧪 Como Testar a Página de Relatórios

## 🚀 Iniciando o Teste

### 1. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Aguarde a mensagem:
```
VITE v6.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2. Acessar a Aplicação

Abra o navegador e acesse: `http://localhost:5173/`

## 📋 Roteiro de Testes

### Teste 1: Navegação Básica

**Objetivo**: Verificar se a página de relatórios está acessível

1. Na tela inicial, localize o botão **"Relatórios"**
   - ✅ Deve ter ícone de documento (FileText)
   - ✅ Deve ter cor roxa/púrpura
   - ✅ Deve estar na grade de 6 botões

2. Clique no botão "Relatórios"
   - ✅ Deve navegar para `/relatorios`
   - ✅ Deve carregar a página sem erros
   - ✅ Deve mostrar o título "Relatórios"

### Teste 2: Filtros e Configurações

**Objetivo**: Verificar se os filtros funcionam corretamente

1. **Tipo de Relatório**
   - Selecione "Pedidos do Período"
   - ✅ Preview deve atualizar
   - Selecione "Resumo de Produtos"
   - ✅ Preview deve mudar completamente

2. **Datas**
   - Altere a "Data Início"
   - ✅ Relatório deve atualizar automaticamente
   - Altere a "Data Fim"
   - ✅ Relatório deve atualizar automaticamente
   - Coloque data fim antes da data início
   - ✅ Deve mostrar "Nenhum pedido encontrado" ou dados vazios

3. **Período Padrão**
   - ✅ Deve vir com últimos 7 dias pré-selecionados

### Teste 3: Relatório de Pedidos

**Objetivo**: Verificar a geração do relatório de pedidos

1. Selecione "Pedidos do Período"
2. Escolha um período com pedidos cadastrados
3. Verifique o preview:
   - ✅ Mostra total de pedidos
   - ✅ Mostra valor total
   - ✅ Lista clientes corretamente
   - ✅ Mostra datas formatadas (dd/mm/aaaa)
   - ✅ Mostra status dos pedidos
   - ✅ Lista itens de cada pedido
   - ✅ Valores monetários com R$ e 2 casas decimais

### Teste 4: Relatório de Produtos

**Objetivo**: Verificar a geração do relatório de produtos

1. Selecione "Resumo de Produtos"
2. Escolha um período com pedidos cadastrados
3. Verifique o preview:
   - ✅ Mostra valor total de produção
   - ✅ Lista produtos ordenados por quantidade
   - ✅ Mostra quantidade total de cada produto
   - ✅ Mostra valor total por produto
   - ✅ Exibe gráfico de barras visual
   - ✅ Barras proporcionais às quantidades

### Teste 5: Exportação WhatsApp (Texto)

**Objetivo**: Verificar o compartilhamento via WhatsApp

1. Configure um relatório (qualquer tipo)
2. Clique em "WhatsApp (Texto)"
3. Verifique:
   - ✅ WhatsApp Web/App abre em nova aba
   - ✅ Mensagem está pré-formatada
   - ✅ Texto usa Markdown (negrito, emojis)
   - ✅ Dados estão corretos
   - ✅ Formatação está legível

**Teste Manual no WhatsApp:**
- Envie a mensagem para você mesmo
- ✅ Verifique se a formatação aparece corretamente
- ✅ Verifique se os emojis aparecem
- ✅ Verifique se está legível no mobile

### Teste 6: Exportação como Imagem

**Objetivo**: Verificar o download da imagem

1. Configure um relatório
2. Clique em "Salvar Imagem"
3. Aguarde o processamento (pode levar 2-3 segundos)
4. Verifique:
   - ✅ Imagem é baixada automaticamente
   - ✅ Nome do arquivo: `relatorio-mana-[tipo]-[timestamp].png`
   - ✅ Imagem abre corretamente
   - ✅ Qualidade está boa (legível)
   - ✅ Todos os elementos estão visíveis
   - ✅ Cores estão corretas

**Teste de Qualidade:**
- Abra a imagem baixada
- Zoom in para verificar nitidez
- ✅ Texto deve estar legível mesmo com zoom

### Teste 7: Exportação como PDF

**Objetivo**: Verificar a geração do PDF

1. Configure um relatório
2. Clique em "Exportar PDF"
3. Aguarde o processamento (pode levar 3-5 segundos)
4. Verifique:
   - ✅ PDF é baixado automaticamente
   - ✅ Nome do arquivo: `relatorio-mana-[tipo]-[timestamp].pdf`
   - ✅ PDF abre corretamente
   - ✅ Formato A4
   - ✅ Todos os elementos estão visíveis
   - ✅ Qualidade de impressão adequada

**Teste de Impressão:**
- Abra o PDF
- Vá em "Imprimir" (Ctrl+P)
- ✅ Preview de impressão deve estar correto

### Teste 8: Casos Extremos

**Objetivo**: Verificar comportamento em situações especiais

1. **Período sem dados**
   - Selecione um período futuro ou sem pedidos
   - ✅ Deve mostrar "Nenhum pedido encontrado"
   - ✅ Totais devem ser zero
   - ✅ Não deve dar erro

2. **Período com 1 pedido**
   - Selecione um período com apenas 1 pedido
   - ✅ Deve exibir corretamente
   - ✅ Totais devem estar corretos

3. **Período com muitos pedidos**
   - Selecione um período longo (ex: 1 mês)
   - ✅ Deve carregar todos os pedidos
   - ✅ Scroll deve funcionar
   - ✅ Exportação deve funcionar (pode demorar mais)

4. **Relatório muito grande**
   - Gere um relatório com muitos dados
   - Tente exportar como imagem/PDF
   - ✅ Deve funcionar (pode demorar)
   - ⚠️ Se der erro, considere limitar o período

### Teste 9: Responsividade

**Objetivo**: Verificar em diferentes tamanhos de tela

1. **Desktop (> 1024px)**
   - ✅ Layout em 3 colunas (filtros e botões)
   - ✅ Preview amplo e legível
   - ✅ Todos os elementos visíveis

2. **Tablet (768px - 1024px)**
   - ✅ Layout adaptado
   - ✅ Botões ainda acessíveis
   - ✅ Preview legível

3. **Mobile (< 768px)**
   - ✅ Layout em 1 coluna
   - ✅ Botões empilhados
   - ✅ Preview otimizado
   - ✅ Fácil de usar com toque

**Como testar:**
- Abra DevTools (F12)
- Clique no ícone de dispositivo móvel
- Teste diferentes resoluções

### Teste 10: Performance

**Objetivo**: Verificar velocidade e fluidez

1. **Carregamento Inicial**
   - ✅ Página carrega em < 2 segundos
   - ✅ Sem travamentos

2. **Mudança de Filtros**
   - Altere tipo de relatório
   - ✅ Atualização instantânea (< 500ms)
   - Altere datas
   - ✅ Atualização rápida

3. **Exportação**
   - WhatsApp: ✅ Imediato
   - Imagem: ✅ < 5 segundos
   - PDF: ✅ < 10 segundos

### Teste 11: Navegação e Retorno

**Objetivo**: Verificar fluxo de navegação

1. Acesse a página de relatórios
2. Navegue para outra página (ex: Pedidos)
3. Volte para relatórios
   - ✅ Filtros devem estar resetados
   - ✅ Página carrega normalmente

4. Use o botão voltar do navegador
   - ✅ Deve funcionar corretamente

### Teste 12: Console de Erros

**Objetivo**: Verificar se há erros no console

1. Abra DevTools (F12)
2. Vá para a aba "Console"
3. Use todas as funcionalidades da página
4. Verifique:
   - ✅ Sem erros vermelhos
   - ✅ Sem warnings críticos
   - ⚠️ Warnings de otimização são aceitáveis

## 🐛 Reportando Problemas

Se encontrar algum problema, anote:

1. **O que você estava fazendo**
   - Exemplo: "Tentando exportar PDF de relatório de produtos"

2. **O que esperava que acontecesse**
   - Exemplo: "PDF deveria baixar automaticamente"

3. **O que realmente aconteceu**
   - Exemplo: "Nada aconteceu, sem erro no console"

4. **Informações do ambiente**
   - Navegador e versão
   - Sistema operacional
   - Tamanho da tela
   - Console errors (se houver)

5. **Passos para reproduzir**
   - Liste exatamente o que fazer para ver o problema

## ✅ Checklist Rápido

Marque conforme testa:

- [ ] Navegação para a página funciona
- [ ] Filtros funcionam
- [ ] Relatório de Pedidos exibe corretamente
- [ ] Relatório de Produtos exibe corretamente
- [ ] WhatsApp abre e formata corretamente
- [ ] Imagem baixa com qualidade
- [ ] PDF baixa corretamente
- [ ] Funciona em mobile
- [ ] Funciona em desktop
- [ ] Sem erros no console
- [ ] Performance adequada
- [ ] Casos extremos funcionam

## 🎯 Critérios de Sucesso

A funcionalidade está pronta quando:

✅ Todos os testes básicos passam
✅ Exportações funcionam em todos os formatos
✅ Responsividade está adequada
✅ Sem erros críticos no console
✅ Performance é aceitável
✅ Usuários conseguem usar sem dificuldade

## 📞 Suporte

Se precisar de ajuda durante os testes:

1. Consulte `COMO_USAR_RELATORIOS.md`
2. Verifique `RELATORIOS_FEATURE.md`
3. Revise o código em `components/Reports.tsx`
4. Entre em contato com o desenvolvedor

---

**Boa sorte com os testes! 🚀**
