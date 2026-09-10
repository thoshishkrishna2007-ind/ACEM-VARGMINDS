@echo off
title ACEM-VARGMINDS Launcher
echo ===================================================
echo   Starting ACEM-VARGMINDS (Backend + Frontend)
echo ===================================================

:: 1. Start Backend in a dedicated window using the virtual environment directly
echo Starting FastAPI Backend on port 8000...
start "ACEM Backend" cmd /k "cd backend && ..\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

:: 2. Wait 2 seconds for backend to initialize
timeout /t 2 /nobreak >nul

:: 3. Start Frontend in a dedicated window
echo Starting Vite Frontend on port 5173...
start "ACEM Frontend" cmd /k "cd frontend && npm run dev"

:: 4. Wait 3 seconds and automatically open the site in your default browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo ===================================================
echo   Both servers launched successfully!
echo   You can close this launcher window anytime.
echo ===================================================
exit