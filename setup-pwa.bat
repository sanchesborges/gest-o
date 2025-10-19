@echo off
echo 🚀 Configurando PWA do Maná...
echo.

REM Instalar plugin PWA
echo 📦 Instalando vite-plugin-pwa...
call npm install vite-plugin-pwa -D

echo.
echo ✅ Plugin instalado!
echo.

REM Fazer build
echo 🔨 Criando build de produção...
call npm run build

echo.
echo ✅ Build criado!
echo.

REM Testar preview
echo 🌐 Iniciando preview...
echo Acesse: http://localhost:4173
echo.
call npm run preview
