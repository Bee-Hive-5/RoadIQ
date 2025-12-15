@echo off
echo ========================================================
echo   Starting Agentic Platform (NODE.JS EDITION) 🚀
echo ========================================================
echo.
echo Installing Node modules...

cd backend-node
call npm install
start "Backend API" cmd /c "npm start"
cd ..

cd frontend
call npm install
start "Frontend UI" cmd /c "npm run dev"
cd ..

echo.
echo ========================================================
echo   SYSTEM LAUNCHED
echo ========================================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Please leave this window open.
pause
