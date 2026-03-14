@echo off
REM Frontend Setup va Deploy Script (Windows)

echo.
echo 🚀 BoardGame Frontend - Deploy Script
echo ========================================
echo.

REM 1. Clone repository
echo 📥 Repository klonlash...
git clone https://github.com/ITdewjonibek/boardgame.git boardgame-frontend
cd boardgame-frontend
git checkout main

REM 2. Install dependencies
echo.
echo 📦 Dependencies o'rnatilmoqda...
call npm install

REM 3. Build for production
echo.
echo 🔨 Production build yasalmoqda...
call npm run build

REM 4. Check if .env exists, if not create template
if not exist .env (
    echo.
    echo 📝 .env file yaratilmoqda...
    (
        echo VITE_API_URL=http://localhost:8000
    ) > .env
)

echo.
echo ✅ Frontend tayyor!
echo.
echo 🚀 Lokal server'ni ishga tushirish uchun:
echo    npm run dev
echo.
echo 📦 Production build preview uchun:
echo    npm run preview
echo.
echo 🌐 Vercel'da deploy qilish uchun:
echo    npm install -g vercel
echo    vercel
echo.
