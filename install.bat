@echo off
echo 🏥 Instalando MedixOne - Plataforma Web de Gestión Médica
echo ==================================================

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18+ primero.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env...
    copy .env.example .env
    echo ⚠️  Por favor configura las variables de entorno en .env
)

REM Generar cliente Prisma
echo 🔧 Generando cliente Prisma...
call npm run db:generate

echo ✅ Instalación completada!
echo.
echo 📋 Próximos pasos:
echo 1. Configura las variables en .env
echo 2. Ejecuta: npm run db:push
echo 3. Inicia el servidor: npm run dev
echo.
echo 🌐 La aplicación estará disponible en: http://localhost:3000
pause