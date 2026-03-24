@echo off
REM Start both backend and frontend for Volatility Terminal

echo Starting Sovereign Terminal...
echo.

REM Start backend in new window
start "Backend API" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

REM Wait for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in new window
start "Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Terminal started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
