# 🎨 Favicon do Maná

## ✅ Implementação Completa

O favicon do Maná foi criado baseado na logo original, mantendo a identidade visual da marca.

## 📁 Arquivos Criados

### 1. **favicon.svg** (Principal)
- Tamanho: 32x32px
- Formato: SVG (vetorial, escala perfeitamente)
- Cores: Roxo/Azul (#5B6B9E, #4A5A8D) com letra "M" verde (#A8D96E)
- Borda circular verde como na logo original

### 2. **favicon-16x16.svg**
- Versão otimizada para 16x16px
- Usado em abas do navegador

### 3. **favicon-32x32.svg**
- Versão otimizada para 32x32px
- Usado em favoritos e bookmarks

### 4. **favicon.ico**
- Formato tradicional para compatibilidade com navegadores antigos

## 🎨 Design do Favicon

```
┌─────────────────┐
│   ╭─────────╮   │
│  ╱           ╲  │  ← Círculo roxo/azul (#5B6B9E)
│ │             │ │
│ │      M      │ │  ← Letra "M" verde (#A8D96E)
│ │             │ │
│  ╲           ╱  │
│   ╰─────────╯   │  ← Borda verde (#A8D96E)
└─────────────────┘
```

## 🔧 Configuração no HTML

O `index.html` foi atualizado com as seguintes tags:

```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
<link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg" />
<link rel="alternate icon" href="/favicon.ico" />
<link rel="shortcut icon" href="/favicon.ico" />
```

## 🌐 Compatibilidade

- ✅ **Chrome/Edge**: Usa favicon.svg
- ✅ **Firefox**: Usa favicon.svg
- ✅ **Safari**: Usa favicon.svg
- ✅ **Navegadores Antigos**: Usa favicon.ico como fallback
- ✅ **PWA**: Usa os ícones definidos no manifest.json

## 📱 Ícones PWA

Os ícones do PWA (192x192 e 512x512) já foram criados anteriormente e estão configurados no `manifest.json`:
- `icon-192.svg`
- `icon-512.svg`

## 🎯 Resultado

Agora o app Maná tem:
- ✅ Favicon personalizado na aba do navegador
- ✅ Ícone correto nos favoritos
- ✅ Ícone correto quando instalado como PWA
- ✅ Identidade visual consistente em todos os lugares

## 🔄 Como Atualizar

Se precisar atualizar o favicon:

1. Edite os arquivos SVG em `public/`
2. Mantenha as cores da marca:
   - Primária: #5B6B9E (roxo/azul)
   - Secundária: #A8D96E (verde)
3. Limpe o cache do navegador (Ctrl+Shift+R)

---

**Nota**: O favicon pode levar alguns segundos para atualizar no navegador. Se não aparecer imediatamente, limpe o cache ou abra em uma aba anônima.
