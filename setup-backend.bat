@echo off
REM Backend Setup va Deploy Script (Windows)

echo.
echo 🚀 BoardGame Backend - Deploy Script
echo ======================================
echo.

REM 1. Clone repository
echo 📥 Repository klonlash...
git clone https://github.com/ITdewjonibek/boardgame.git boardgame-backend
cd boardgame-backend
git checkout becendrot1

REM 2. Create virtual environment
echo.
echo 📦 Virtual muhit yaratilmoqda...
python -m venv venv
call venv\Scripts\activate.bat

REM 3. Install Python dependencies
echo.
echo 📦 Python dependencies o'rnatilmoqda...
pip install -r requirements.txt

REM 4. Create .env file if doesn't exist
if not exist .env (
    echo.
    echo 📝 .env file yaratilmoqda...
    (
        echo DATABASE_URL=postgresql://user:password@localhost:5432/boardgame
        echo SECRET_KEY=your-secret-key-change-this-in-production
        echo ALGORITHM=HS256
        echo CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
    ) > .env
)

REM 5. Run migrations
echo.
echo 🗄️ Database migrations bajarilmoqda...
python migrate.py

REM 6. Seed data (optional)
echo.
echo 🌱 Boshlang'ich data to'ldirish...
python seed_all.py

echo.
echo ✅ Backend tayyor!
echo.
echo 🚀 Backend server'ni ishga tushirish uchun:
echo    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo 📝 .env file'da DATABASE_URL'ni o'zgartirib qo'ying!
echo.
