@echo off
set BASE_DIR=%~dp0
echo ===========================================
echo       MediSync - Starting Servers
echo ===========================================

echo Starting Django backend...
start cmd /k "cd /d %BASE_DIR%backend && ..\venv\Scripts\activate && python manage.py runserver 8001"

timeout /t 3 /nobreak > nul

echo Starting Vite frontend (React)...
start cmd /k "cd /d %BASE_DIR%frontend && npm run dev"

echo.
echo ===========================================
echo Servers started!
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8001/api/
echo ===========================================
pause