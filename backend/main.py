import asyncio
import json
import time
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from config import settings
from memory import memory_bank
from automation import automation_engine
from ai_engine import ai_engine

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Backend API and WebSocket stream for J.A.R.V.I.S. Full-Stack Assistant."
)

# Allow all origins so preview domain and local hosts connect seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request / Response Models ---
class ChatRequest(BaseModel):
    message: str
    engine: Optional[str] = None

class MemoryFactRequest(BaseModel):
    key: str
    value: str
    category: Optional[str] = "general"

class CommandRequest(BaseModel):
    command: str

class SettingsUpdateRequest(BaseModel):
    active_engine: Optional[str] = None
    user_name: Optional[str] = None
    voice_pitch: Optional[float] = None
    voice_rate: Optional[float] = None
    allow_shell: Optional[bool] = None

class MacroRunRequest(BaseModel):
    name: str

# --- REST Endpoints ---

@app.get("/api/status")
def get_system_status():
    """Get core health, active engine, and brief status of J.A.R.V.I.S."""
    telemetry = automation_engine.get_system_telemetry()
    facts = memory_bank.get_all_facts()
    macros = memory_bank.get_all_macros()
    return {
        "status": "ONLINE",
        "system_name": settings.APP_NAME,
        "version": settings.VERSION,
        "user_name": settings.USER_NAME,
        "active_engine": settings.ACTIVE_ENGINE,
        "voice": {
            "enabled": settings.VOICE_ENABLED,
            "pitch": settings.VOICE_PITCH,
            "rate": settings.VOICE_RATE,
            "accent": settings.VOICE_ACCENT
        },
        "memory_stats": {
            "facts_count": len(facts),
            "macros_count": len(macros)
        },
        "telemetry_summary": {
            "cpu_percent": telemetry["cpu"]["percent"],
            "memory_percent": telemetry["memory"]["percent"],
            "uptime": telemetry["uptime"],
            "os": telemetry["os"]
        }
    }

@app.get("/api/telemetry")
def get_detailed_telemetry():
    """Get full hardware telemetry (CPU, RAM, Disk, Network)."""
    return automation_engine.get_system_telemetry()

@app.post("/api/chat")
def chat_with_jarvis(request: ChatRequest):
    """Send a prompt to J.A.R.V.I.S. and receive speech text, tools executed, and system telemetry."""
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    result = ai_engine.process_message(request.message, engine_override=request.engine)
    return result

@app.get("/api/memory")
def get_memory_facts(query: Optional[str] = None):
    """Retrieve all facts or search facts by keyword."""
    if query:
        return {"facts": memory_bank.search_facts(query)}
    return {"facts": memory_bank.get_all_facts()}

@app.post("/api/memory")
def store_memory_fact(request: MemoryFactRequest):
    """Store or update a fact in SQLite persistent storage."""
    fact = memory_bank.remember_fact(request.key, request.value, request.category)
    return {"status": "success", "fact": fact}

@app.delete("/api/memory/{key}")
def delete_memory_fact(key: str):
    """Delete a fact from persistent storage."""
    deleted = memory_bank.delete_fact(key)
    if not deleted:
        raise HTTPException(status_code=404, detail="Fact not found.")
    return {"status": "deleted", "key": key}

@app.get("/api/macros")
def get_all_macros():
    """List all automation macros stored in J.A.R.V.I.S."""
    return {"macros": memory_bank.get_all_macros()}

@app.post("/api/macros/run")
def run_macro(request: MacroRunRequest):
    """Execute a saved automation macro by name."""
    macro = memory_bank.get_macro(request.name)
    if not macro:
        raise HTTPException(status_code=404, detail="Macro not found.")
    
    results = []
    for cmd in macro.get("commands", []):
        if cmd == "GET_TELEMETRY":
            results.append({"command": cmd, "result": automation_engine.get_system_telemetry()})
        elif cmd == "CHECK_TIME":
            results.append({"command": cmd, "result": automation_engine.get_time_and_weather()})
        elif cmd.startswith("RECALL_FACTS:"):
            key = cmd.split(":", 1)[1]
            facts = memory_bank.search_facts(key)
            results.append({"command": cmd, "result": facts})
        elif cmd.startswith("RUN_SHELL:"):
            sh_cmd = cmd.split(":", 1)[1]
            results.append({"command": cmd, "result": automation_engine.run_safe_shell_command(sh_cmd)})
        else:
            results.append({"command": cmd, "result": "Unknown macro command protocol."})
            
    return {
        "status": "success",
        "macro": macro["name"],
        "description": macro["description"],
        "results": results,
        "timestamp": time.time()
    }

@app.post("/api/command")
def run_system_command(request: CommandRequest):
    """Execute a safe terminal command."""
    res = automation_engine.run_safe_shell_command(request.command)
    return res

@app.get("/api/settings")
def get_settings():
    """Get active J.A.R.V.I.S. settings."""
    return {
        "active_engine": settings.ACTIVE_ENGINE,
        "user_name": settings.USER_NAME,
        "openai_configured": bool(settings.OPENAI_API_KEY),
        "ollama_url": settings.OLLAMA_BASE_URL,
        "voice_pitch": settings.VOICE_PITCH,
        "voice_rate": settings.VOICE_RATE,
        "allow_shell": settings.ALLOW_SHELL_COMMANDS
    }

@app.post("/api/settings")
def update_settings(request: SettingsUpdateRequest):
    """Update active J.A.R.V.I.S. settings."""
    if request.active_engine:
        settings.ACTIVE_ENGINE = request.active_engine
    if request.user_name:
        settings.USER_NAME = request.user_name
    if request.voice_pitch is not None:
        settings.VOICE_PITCH = request.voice_pitch
    if request.voice_rate is not None:
        settings.VOICE_RATE = request.voice_rate
    if request.allow_shell is not None:
        settings.ALLOW_SHELL_COMMANDS = request.allow_shell
    return {"status": "updated", "settings": get_settings()}

# --- WebSocket Manager for Real-Time Telemetry & Chat Streaming ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_json(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    """
    Bidirectional WebSocket connection.
    Streams real-time system telemetry and allows instant chat commands.
    """
    await manager.connect(websocket)
    try:
        # Background task to send telemetry every 2 seconds while connected
        async def send_telemetry_loop():
            while True:
                try:
                    telemetry = automation_engine.get_system_telemetry()
                    await websocket.send_json({
                        "type": "TELEMETRY_UPDATE",
                        "data": telemetry
                    })
                    await asyncio.sleep(2)
                except Exception:
                    break

        telemetry_task = asyncio.create_task(send_telemetry_loop())

        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            msg_type = data.get("type", "CHAT")

            if msg_type == "CHAT":
                message = data.get("message", "")
                engine = data.get("engine", None)
                res = ai_engine.process_message(message, engine_override=engine)
                await websocket.send_json({
                    "type": "CHAT_RESPONSE",
                    "data": res
                })
            elif msg_type == "RUN_COMMAND":
                cmd = data.get("command", "")
                res = automation_engine.run_safe_shell_command(cmd)
                await websocket.send_json({
                    "type": "COMMAND_RESPONSE",
                    "data": res
                })
            elif msg_type == "PING":
                await websocket.send_json({"type": "PONG", "timestamp": time.time()})

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# --- SPA Static File Serving for Render.com Production ---
BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("ws/"):
            raise HTTPException(status_code=404, detail="API route not found.")
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
