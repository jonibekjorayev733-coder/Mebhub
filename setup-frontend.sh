#!/bin/bash
# Frontend Setup va Deploy Script (macOS/Linux)

echo "🚀 BoardGame Frontend - Deploy Script"
echo "========================================"

# 1. Clone repository
echo "📥 Repository'ni klonlash..."
git clone https://github.com/ITdewjonibek/boardgame.git boardgame-frontend
cd boardgame-frontend
git checkout main

# 2. Install dependencies
echo "📦 Dependencies o'rnatilmoqda..."
npm install

# 3. Build for production
echo "🔨 Production build yasalmoqda..."
npm run build

# 4. Check if .env exists, if not create template
if [ ! -f .env ]; then
    echo "📝 .env file yaratilmoqda..."
    cat > .env << EOF
VITE_API_URL=http://localhost:8000
EOF
fi

echo ""
echo "✅ Frontend tayyor!"
echo ""
echo "🚀 Lokal server'ni ishga tushirish uchun:"
echo "   npm run dev"
echo ""
echo "📦 Production build preview uchun:"
echo "   npm run preview"
echo ""
echo "🌐 Vercel'da deploy qilish uchun:"
echo "   npm install -g vercel"
echo "   vercel"
