@echo off
cd /d "c:\react Jonibek\vite-project\Totcbecend"
echo.
echo ========================================
echo   BACKEND SERVER STARTING...
echo ========================================
echo.
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
