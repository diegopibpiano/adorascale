#!/bin/bash

# AdoraScale PWA Setup Script
# Executa: bash setup.sh

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║      AdoraScale PWA - Setup Inicial                 ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Verifica Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✓ Node.js encontrado: $NODE_VERSION"
    echo ""
    
    # Instala dependências
    echo "📦 Instalando dependências..."
    npm install
    
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║                SETUP CONCLUÍDO!                      ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
    echo "Próximos passos:"
    echo ""
    echo "1. Para iniciar servidor HTTPS (recomendado para PWA):"
    echo "   npm run dev"
    echo ""
    echo "2. Para iniciar servidor HTTP simples:"
    echo "   npm start"
    echo ""
    echo "3. Acesse:"
    echo "   ➜ HTTPS: https://localhost:8443"
    echo "   ➜ HTTP:  http://localhost:8080"
    echo ""
    echo "4. Para testar como PWA em smartphone:"
    echo "   • Certifique-se que o servidor está rodando"
    echo "   • Use HTTPS (porta 8443)"
    echo "   • Acesse pelo IP local ou ngrok"
    echo ""
    
else
    echo "❌ Node.js não encontrado!"
    echo ""
    echo "Opções:"
    echo "1. Instale Node.js: https://nodejs.org/"
    echo ""
    echo "2. Ou use Python para servidor simples:"
    echo "   python -m http.server 8080"
    echo ""
fi

echo "ℹ️  Para mais informações, veja:"
echo "   • README.md - Guia rápido"
echo "   • PWA_README.md - Guia completo de PWA"
echo ""
