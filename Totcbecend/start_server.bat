@echo off
REM Start Backend API Server
cd /d "%~dp0"
echo.
echo ============================================================
echo ^🚀 Backend API Server
echo ============================================================
echo ^📍 http://127.0.0.1:8000
echo ^📊 http://127.0.0.1:8000/docs
echo ============================================================
echo ^✅ Server is starting...
echo ============================================================
echo.

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --log-level warning --no-access-log

pause
