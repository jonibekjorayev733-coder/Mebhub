#!/bin/bash
# Backend Setup va Deploy Script (macOS/Linux)

echo "🚀 BoardGame Backend - Deploy Script"
echo "======================================"

# 1. Clone repository
echo "📥 Repository'ni klonlash..."
git clone https://github.com/ITdewjonibek/boardgame.git boardgame-backend
cd boardgame-backend
git checkout becendrot1

# 2. Create virtual environment
echo "📦 Virtual muhit yaratilmoqda..."
python3 -m venv venv
source venv/bin/activate

# 3. Install Python dependencies
echo "📦 Python dependencies o'rnatilmoqda..."
pip install -r requirements.txt

# 4. Create .env file if doesn't exist
if [ ! -f .env ]; then
    echo "📝 .env file yaratilmoqda..."
    cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/boardgame
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
EOF
fi

# 5. Run migrations
echo "🗄️ Database migrations bajarilmoqda..."
python migrate.py

# 6. Seed data (optional)
echo "🌱 Boshlang'ich data to'ldirish..."
python seed_all.py

echo ""
echo "✅ Backend tayyor!"
echo ""
echo "🚀 Backend server'ni ishga tushirish uchun:"
echo "   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "📝 .env file'da DATABASE_URL'ni o'zgartirib qo'ying!"
echo ""
