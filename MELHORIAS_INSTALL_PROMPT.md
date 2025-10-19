# 🔔 Melhorias no Prompt de Instalação PWA

## ✅ Mudanças Aplicadas

### Problema Anterior:
- ✅ Desktop: Notificação aparecia
- ❌ Celular: Notificação não aparecia
- ❌ Tablet (iOS): Sem opção de instalar

### Solução Implementada:

#### 1. Detecção de iOS/iPad
```typescript
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
```

Agora detecta automaticamente se é iOS/iPad.

#### 2. Prompt Automático para iOS
```typescript
if (iOS) {
  setTimeout(() => {
    setShowPrompt(true);
  }, 3000);
}
```

Após 3 segundos, mostra o prompt mesmo em iOS/iPad.

#### 3. Instruções Específicas por Plataforma

**Android/Chrome:**
- Botão "Instalar Agora" (se disponível)
- Ou instruções: Menu (⋮) → "Adicionar à tela inicial"

**iOS/iPad:**
- Instruções passo a passo:
  1. Toque no botão Compartilhar (□↑)
  2. Role e toque em "Adicionar à Tela de Início"
  3. Toque em "Adicionar"

#### 4. Reexibição Inteligente
```typescript
// Mostra novamente após 7 dias
if (daysSinceDismissed > 7) {
  setShowPrompt(true);
}
```

Se o usuário dispensar, o prompt reaparece após 7 dias.

#### 5. Z-Index Maior
```typescript
z-[70]  // Acima de tudo
```

Garante que o prompt fique acima da navbar e outros elementos.

---

## 🎨 Visual Atualizado

### Cores do Maná
- Gradiente: `from-[#5B6B9E] to-[#4A5A8D]`
- Botão: `text-[#5B6B9E]`

### Layout Responsivo
- Instruções em card destacado
- Texto menor e mais legível
- Botão full-width em mobile

---

## 📱 Comportamento por Dispositivo

### Desktop (Chrome/Edge)
```
┌─────────────────────────┐
│ 📥 Instalar Maná        │
│ Instale o app...        │
│ [Instalar Agora]        │
└─────────────────────────┘
```
- Aparece automaticamente
- Botão funcional

### Android (Chrome)
```
┌─────────────────────────┐
│ 📥 Instalar Maná        │
│ Instale o app...        │
│ [Instalar Agora]        │
└─────────────────────────┘
```
- Aparece após 3 segundos
- Botão funcional

### iOS/iPad (Safari)
```
┌─────────────────────────┐
│ 📥 Instalar Maná        │
│ Instale o app...        │
│                         │
│ 📱 Como instalar:       │
│ 1. Toque em □↑          │
│ 2. "Adicionar à Tela"   │
│ 3. Toque em "Adicionar" │
│                         │
│ [Entendi]               │
└─────────────────────────┘
```
- Aparece após 3 segundos
- Instruções passo a passo
- Botão "Entendi"

---

## 🔍 Detecção de Instalação

### Verifica se já está instalado:
```typescript
// PWA instalado (Android/Desktop)
window.matchMedia('(display-mode: standalone)').matches

// PWA instalado (iOS)
window.navigator.standalone === true
```

Se já estiver instalado, o prompt não aparece.

---

## ⏱️ Timing

### Desktop/Android
- Aparece quando o evento `beforeinstallprompt` dispara
- Geralmente após alguns segundos de uso

### iOS/iPad
- Aparece após 3 segundos
- Não depende de evento (iOS não suporta)

### Reexibição
- Após 7 dias se foi dispensado
- Imediatamente se nunca foi dispensado

---

## 🎯 Casos de Uso

### Caso 1: Primeiro Acesso (Android)
1. Usuário abre o site
2. Após alguns segundos → Prompt aparece
3. Usuário clica "Instalar Agora"
4. PWA é instalado

### Caso 2: Primeiro Acesso (iOS/iPad)
1. Usuário abre o site
2. Após 3 segundos → Prompt aparece
3. Usuário lê as instruções
4. Usuário segue os passos
5. PWA é instalado

### Caso 3: Usuário Dispensa
1. Usuário clica no X
2. Prompt desaparece
3. Após 7 dias → Prompt reaparece

### Caso 4: Já Instalado
1. Usuário abre o PWA instalado
2. Prompt não aparece
3. Experiência limpa

---

## 🔧 Configurações

### Tempo de Reexibição
```typescript
// Alterar de 7 para X dias
if (daysSinceDismissed > 7) {  // ← Mudar aqui
```

### Delay para iOS
```typescript
setTimeout(() => {
  setShowPrompt(true);
}, 3000);  // ← 3 segundos, ajustar se necessário
```

### Z-Index
```typescript
z-[70]  // ← Ajustar se necessário
```

---

## 📊 Comparação

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Desktop** | ✅ Funciona | ✅ Funciona |
| **Android** | ❌ Não aparece | ✅ Aparece |
| **iOS/iPad** | ❌ Não aparece | ✅ Aparece com instruções |
| **Reexibição** | ❌ Nunca | ✅ Após 7 dias |
| **Instruções** | ❌ Genéricas | ✅ Específicas por plataforma |
| **Z-Index** | 50 | 70 |

---

## 🎨 Customização

### Cores
```typescript
// Gradiente do fundo
from-[#5B6B9E] to-[#4A5A8D]

// Cor do botão
text-[#5B6B9E]
```

### Texto
```typescript
// Título
"Instalar Maná"

// Descrição
"Instale o app para acesso rápido e funcione offline!"
```

### Instruções iOS
```typescript
<ol className="list-decimal list-inside space-y-1">
  <li>Toque no botão Compartilhar (□↑)</li>
  <li>Role e toque em "Adicionar à Tela de Início"</li>
  <li>Toque em "Adicionar"</li>
</ol>
```

---

## ✅ Benefícios

### Usabilidade
- ✅ Prompt aparece em todos os dispositivos
- ✅ Instruções claras para iOS
- ✅ Não é intrusivo (pode dispensar)
- ✅ Reaparece após tempo razoável

### Visual
- ✅ Cores da marca
- ✅ Layout responsivo
- ✅ Animação suave
- ✅ Acima de todos os elementos

### Técnico
- ✅ Detecta plataforma
- ✅ Detecta se já está instalado
- ✅ Salva preferência do usuário
- ✅ Compatível com todos os navegadores

---

## 🧪 Teste

### Desktop
1. Abrir site
2. Aguardar prompt
3. Clicar "Instalar Agora"
4. ✅ PWA instalado

### Android
1. Abrir site no Chrome
2. Aguardar 3 segundos
3. Prompt aparece
4. Clicar "Instalar Agora"
5. ✅ PWA instalado

### iOS/iPad
1. Abrir site no Safari
2. Aguardar 3 segundos
3. Prompt aparece com instruções
4. Seguir passos
5. ✅ PWA instalado

### Dispensar
1. Clicar no X
2. Prompt desaparece
3. Aguardar 7 dias
4. ✅ Prompt reaparece

---

## 📝 Código Resumido

```typescript
// Detectar iOS
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// Mostrar após 3s em iOS
if (iOS) {
  setTimeout(() => setShowPrompt(true), 3000);
}

// Instruções específicas
{isIOS ? (
  <InstrucoesIOS />
) : (
  <BotaoInstalar />
)}

// Reexibir após 7 dias
if (daysSinceDismissed > 7) {
  setShowPrompt(true);
}
```

---

**Data**: 19/10/2025  
**Status**: ✅ Implementado  
**Impacto**: Alto (facilita instalação em todos os dispositivos)
