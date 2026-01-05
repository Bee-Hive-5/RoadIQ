@echo off
echo ========================================================
echo   Starting Agentic Platform (NO DOCKER MODE) 🚀
echo ========================================================
echo.
echo NOTE: This requires Python and Node.js installed.
echo.

set USE_CELERY=False
REM Environment variables loaded from .env files in individual directories
REM Configured by Agent

echo [1/3] Installing Backend Defaults...
cd backend
python -m pip install -r requirements.txt
echo Starting Backend API...
start "Backend API" cmd /c "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
cd ..

echo [2/3] Installing Frontend Defaults...
cd frontend
call npm install
echo Starting Frontend UI...
start "Frontend UI" cmd /c "npm run dev"
cd ..

echo.
echo [3/3] Launching...
echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:5173
echo.
echo Please open: http://localhost:5173
REM Script finished
