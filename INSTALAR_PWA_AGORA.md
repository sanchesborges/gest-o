# 🚀 Como Instalar o PWA AGORA (5 Minutos)

## ⚡ Solução Rápida

O PWA não funciona em mobile/tablet porque você está em **modo desenvolvimento**.

**Solução**: Fazer build de produção!

---

## 📋 3 Comandos Simples

### 1️⃣ Instalar Plugin PWA
```bash
npm install vite-plugin-pwa -D
```
⏱️ Tempo: ~1 minuto

### 2️⃣ Fazer Build
```bash
npm run build
```
⏱️ Tempo: ~2 minutos

### 3️⃣ Testar
```bash
npm run preview
```
⏱️ Tempo: ~30 segundos

**Pronto!** Agora acesse `http://localhost:4173`

---

## 📱 Testar no Celular/Tablet

### Opção 1: IP da Rede Local

1. **Descobrir seu IP:**
```bash
ipconfig  # Windows
```

2. **Procurar por "IPv4":**
```
Exemplo: 192.168.1.100
```

3. **Acessar no celular/tablet:**
```
http://192.168.1.100:4173
```

4. **Instalar:**
- Menu (⋮) → "Adicionar à tela inicial"

---

### Opção 2: Deploy Rápido (Vercel)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Você receberá um link:
```
https://mana-xxx.vercel.app
```

Acesse no celular/tablet e instale!

---

## ✅ Checklist

- [ ] Plugin instalado
- [ ] Build feito
- [ ] Preview rodando
- [ ] Testado no desktop
- [ ] Testado no mobile
- [ ] PWA instalado

---

## 🆘 Problemas?

### Build falha?
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Preview não abre?
```bash
# Verificar se a porta está livre
netstat -ano | findstr :4173

# Ou usar outra porta
npm run preview -- --port 5000
```

### Mobile não acessa?
- Verificar se estão na mesma rede Wi-Fi
- Desabilitar firewall temporariamente
- Usar deploy (Vercel/Netlify)

---

## 🎯 Resultado

Após os 3 comandos:

✅ Desktop: PWA funciona  
✅ Mobile: PWA funciona  
✅ Tablet: PWA funciona  
✅ Offline: Funciona  

---

**Tempo total: 5 minutos**  
**Dificuldade: Fácil**  
**Status: Pronto para usar!**
