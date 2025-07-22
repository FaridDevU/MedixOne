#!/bin/bash

# Script de instalación para MedixOne
echo "🏥 Instalando MedixOne - Plataforma Web de Gestión Médica"
echo "=================================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar si PostgreSQL está disponible
echo "🗄️  Verificando configuración de base de datos..."

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Por favor configura las variables de entorno en .env"
fi

# Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npm run db:generate

echo "✅ Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables en .env"
echo "2. Ejecuta: npm run db:push"
echo "3. Inicia el servidor: npm run dev"
echo ""
echo "🌐 La aplicación estará disponible en: http://localhost:3000"