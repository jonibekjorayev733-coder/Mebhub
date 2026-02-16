@echo off
REM Backend Server Starter for Windows
echo ============================================================
echo 🚀 PAYMENT SYSTEM - BACKEND SERVER
echo ============================================================
echo 📍 URL: http://127.0.0.1:8000
echo 📚 API Docs: http://127.0.0.1:8000/docs  
echo ============================================================
echo.

cd /d "%~dp0"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

pause
