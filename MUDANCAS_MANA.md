# 🎨 Mudanças de Branding: Shirley → Maná

## ✅ Alterações Realizadas

### 1. Nome do Aplicativo
- ✅ Todos os arquivos atualizados de "Shirley" para "Maná"
- ✅ package.json e package-lock.json
- ✅ manifest.json
- ✅ index.html (título e meta tags)
- ✅ Todos os componentes React
- ✅ Arquivos SQL (schema, queries, seed)
- ✅ Documentação (README, INSTALACAO_PWA.md)

### 2. Logo e Ícones
- ✅ Criados novos ícones SVG baseados na logo do Maná
  - icon-192.svg (para dispositivos móveis)
  - icon-512.svg (para PWA)
- ✅ Logo salva em public/logo-mana.png

### 3. Cores do Tema
- ✅ Cor primária atualizada: #4f46e5 → #5B6B9E (roxo/azul da logo)
- ✅ Cor secundária atualizada: #10b981 → #A8D96E (verde da logo)
- ✅ Theme color no manifest.json e meta tags
- ✅ Cores dos gráficos atualizadas (Dashboard e Gráficos)

### 4. Textos e Mensagens
- ✅ Notas de entrega
- ✅ Portal do entregador
- ✅ Prompt de instalação PWA
- ✅ Cabeçalhos e títulos

## 🎨 Paleta de Cores do Maná

- **Primária**: #5B6B9E (Roxo/Azul)
- **Secundária**: #A8D96E (Verde)
- **Acento**: #f59e0b (Laranja)
- **Fundo**: #ffffff (Branco)

## 📝 Observações

As classes CSS do Tailwind ainda usam `indigo-600` em vários componentes. Essas classes funcionam bem visualmente, mas se quiser personalizar ainda mais, você pode:

1. Criar classes customizadas no Tailwind config
2. Substituir `indigo-600` por `[#5B6B9E]` (sintaxe arbitrary do Tailwind)
3. Ou manter como está, já que o roxo do indigo é similar ao da logo

## 🚀 Próximos Passos

1. Testar a instalação do PWA em diferentes dispositivos
2. Verificar se os ícones aparecem corretamente
3. Ajustar cores adicionais se necessário
4. Atualizar o cache do service worker (já atualizado para 'mana-gest-v1')

---

**Data da mudança**: 19/10/2025
