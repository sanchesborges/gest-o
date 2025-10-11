# 🔧 Como Corrigir o Problema da Tela Preta no PWA

Se você instalou o app e está vendo uma **tela preta com códigos**, siga estes passos:

## 📱 Solução Rápida (Recomendada)

### **Passo 1: Limpar o Service Worker**

1. Acesse no navegador do celular:
   ```
   https://seu-site.com/unregister-sw.html
   ```

2. Aguarde a mensagem de sucesso ✅

3. Clique em **"Voltar ao App"**

### **Passo 2: Desinstalar o App Antigo**

1. Pressione e segure o ícone do app
2. Selecione **"Desinstalar"** ou **"Remover"**
3. Confirme

### **Passo 3: Limpar Cache do Navegador**

**No Chrome (Android):**
1. Abra o Chrome
2. Menu (⋮) → **Configurações**
3. **Privacidade e segurança**
4. **Limpar dados de navegação**
5. Selecione:
   - ✅ Cookies e dados de sites
   - ✅ Imagens e arquivos em cache
6. Clique em **"Limpar dados"**

**No Safari (iPhone):**
1. Vá em **Ajustes** → **Safari**
2. Role até **"Limpar Histórico e Dados de Sites"**
3. Confirme

### **Passo 4: Reinstalar o App**

1. Acesse o site normalmente no navegador
2. O app agora deve funcionar corretamente
3. Se quiser, instale novamente (opcional)

## 🔍 Por que isso aconteceu?

O problema ocorreu porque o **Service Worker** estava cacheando arquivos TypeScript/JSX sem compilar, causando a tela preta com código.

## ✅ O que foi corrigido?

- ✅ Service Worker atualizado para não cachear arquivos de código
- ✅ Service Worker temporariamente desabilitado
- ✅ Página de limpeza criada (`unregister-sw.html`)

## 🚀 Próximos Passos

Para usar o PWA em produção corretamente, você precisará:

1. **Fazer build do projeto** (compilar TypeScript → JavaScript)
2. **Hospedar os arquivos compilados**
3. **Reativar o Service Worker** (descomentar no `index.html`)

## 💡 Dica

Por enquanto, use o app **direto no navegador** sem instalar. Ele funciona perfeitamente assim! 

Quando tiver um build de produção, aí sim pode instalar como PWA.

---

**Precisa de ajuda?** Entre em contato com o suporte.
