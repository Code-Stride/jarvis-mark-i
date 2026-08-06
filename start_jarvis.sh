#!/bin/bash
# J.A.R.V.I.S. Full-Stack Assistant Launcher

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================"
echo "   J.A.R.V.I.S. MARK I ARTIFICIAL INTELLIGENCE CORE   "
echo "   Version 1.0.0 (Stark-Tech Prototype)               "
echo "======================================================"
echo "[1/2] Initializing Python FastAPI Neural Backend on port 8000..."
./venv/bin/python backend/main.py &
BACKEND_PID=$!

# Wait 2 seconds for backend to initialize
sleep 2

echo "[2/2] Launching Stark-Tech Web HUD (Vite React) on port 3000..."
cd frontend
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!

echo "======================================================"
echo "  J.A.R.V.I.S. is ONLINE."
echo "  - Backend API & WebSockets: http://0.0.0.0:8000/api/status"
echo "  - Stark-Tech Web HUD:       http://0.0.0.0:3000"
echo "======================================================"

# Handle termination
trap "echo 'Shutting down J.A.R.V.I.S. core...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

wait $FRONTEND_PID
