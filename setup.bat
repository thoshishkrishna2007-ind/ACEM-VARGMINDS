@echo off
title ACEM-VARGMINDS First Time Setup
echo ===================================================
echo      Running First-Time Automatic Setup...
echo ===================================================

:: 1. Python Virtual Environment Setup
echo [1/4] Setting up Python virtual environment...
python -m venv .venv

:: 2. Install Backend Packages
echo [2/4] Installing backend packages from requirements.txt...
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

:: 3. Setup Frontend .env file
echo [3/4] Configuring frontend environment...
if not exist "frontend\.env" (
    echo VITE_API_BASE_URL=http://localhost:8000 > frontend\.env
)

:: 4. Install Frontend Packages
echo [4/4] Installing npm dependencies for frontend...
cd frontend
call npm install
cd ..

echo ===================================================
echo      Setup Complete! 
echo      Double-click "run.bat" to start the app.
echo ===================================================
pause