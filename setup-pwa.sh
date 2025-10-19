#!/bin/bash

echo "🚀 Configurando PWA do Maná..."
echo ""

# Instalar plugin PWA
echo "📦 Instalando vite-plugin-pwa..."
npm install vite-plugin-pwa -D

echo ""
echo "✅ Plugin instalado!"
echo ""

# Fazer build
echo "🔨 Criando build de produção..."
npm run build

echo ""
echo "✅ Build criado!"
echo ""

# Testar preview
echo "🌐 Iniciando preview..."
echo "Acesse: http://localhost:4173"
echo ""
npm run preview
