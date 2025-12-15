@echo off
echo ========================================================
echo   Starting Agentic Predictive Maintenance Platform 🚀
echo ========================================================
echo.
echo [1/3] Checking Docker configuration...
if not exist "docker-compose.yml" (
    echo Error: docker-compose.yml not found!
    pause
    exit /b
)

echo [2/3] Building and starting containers...
echo       (This may take a few minutes on first run)

REM Try modern Docker Compose v2 first
docker compose up --build
if %errorlevel% neq 0 (
    echo.
    echo 'docker compose' failed. Trying legacy 'docker-compose'...
    docker-compose up --build
)

pause
