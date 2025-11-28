@echo off
cd C:/Users/rened/OneDrive/Desktop/projeto-loja-veiculos
echo Building backend...
docker compose build backend
echo.
echo Starting backend...
docker compose up -d backend
echo.
echo Waiting for backend to start...
timeout /t 3
echo.
echo Recent logs:
docker compose logs backend --tail 20
