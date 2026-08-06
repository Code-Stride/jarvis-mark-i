# J.A.R.V.I.S. // Stark Industries Artificial Intelligence Core
**Version 1.0.0 (Mark I Build)**

A complete Full-Stack AI Assistant combining a **Futuristic Holographic Web HUD (React 18 + Vite + Tailwind CSS)** with a **Modular Python Core (FastAPI + SQLite Memory Bank + psutil Telemetry + Multi-Engine LLM support)**.

---

## ⚡ Key Capabilities & Features

### 1. 🌐 Sci-Fi Stark-Tech Hologram HUD (Frontend)
- **Animated Stark Arc Reactor**: Interactive SVG Arc Reactor with glowing energy rings that pulse and change color based on J.A.R.V.I.S.'s state (*Online Cyan, Voice Listening Emerald, Speaking Gold, Alert Crimson*).
- **Voice Control (Speech-to-Text & Text-to-Speech)**: Integrated browser Web Speech API for hands-free microphone voice control and synthesized British butler voice responses.
- **Live Hardware Telemetry Gauges**: Real-time visual monitoring of CPU load, CPU cores & frequency, Memory (RAM) GB/%, Root Disk space, Network I/O KB/s, and uptime.
- **SQL-Powered Long-Term Memory Bank**: Add, search, and delete persistent facts, user preferences, and system protocols stored in a local SQLite database.
- **Automation Deck & Safe Shell**: Execute multi-step automation macros and run sandboxed terminal commands (`df -h`, `free -h`, `uptime`, `ls -la`) directly from the HUD.
- **Settings Modal**: Switch AI Engines on the fly, customize your User Designation (*"Sir"*, *"Tony Stark"*, *"Boss"*), and tune voice synthesis pitch/cadence.

### 2. 🧠 Modular Python AI & Automation Core (Backend)
- **Multi-Engine AI Architecture**:
  - `jarvis-local` *(Default)*: Built-in Stark-Tech NLP engine with Paul Bettany-style British butler persona, parsing natural language intents to execute tools offline with zero API keys required.
  - `openai`: Plug-and-play **OpenAI GPT-4 / GPT-4o** integration via `.env`.
  - `ollama`: Plug-and-play **Local Offline LLMs** (e.g. `llama3`, `mistral`, `phi3`) running on your machine via `http://localhost:11434`.
- **Tool Calling & Agentic Capabilities**:
  - Automatically invokes system diagnostics (`get_system_telemetry`).
  - Checks live time and local weather (`get_time_and_weather`).
  - Stores and retrieves persistent facts (`remember_fact`, `recall_facts`).
  - Runs safe shell commands (`run_shell_command`).
- **Real-Time WebSocket Streaming**: Bi-directional low-latency WebSocket connection (`/ws/stream`) broadcasting hardware telemetry every 2 seconds.

---

## 🚀 Quick Start Guide (Running on Your Local PC)

### Prerequisites
- **Python 3.10+**
- **Node.js v18+ & npm**
- *Optional*: **Ollama** (for local offline LLM models) or **OpenAI API Key**

### 1. Clone & Set Up the Repository
```bash
git clone https://github.com/yourusername/jarvis-assistant.git
cd jarvis-assistant
```

### 2. Backend Setup (Python)
Create a virtual environment and install dependencies:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 3. Frontend Setup (Node / Vite)
Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 4. Launch J.A.R.V.I.S.
Run the universal start script:
```bash
chmod +x start_jarvis.sh
./start_jarvis.sh
```
- **Stark-Tech HUD**: Open your browser at `http://localhost:3000`
- **FastAPI REST & WebSocket Backend**: Available at `http://localhost:8000`
- **API Swagger Docs**: Visit `http://localhost:8000/docs`

---

## ⚙️ AI Engine Configuration

You can switch engines directly from the **Settings Modal** in the Web HUD, or by editing `backend/.env`:

```ini
# User Designation
JARVIS_USER_NAME="Tony Stark"

# Default Engine ("jarvis-local", "openai", "ollama")
JARVIS_AI_ENGINE="jarvis-local"

# OpenAI GPT-4 Settings (if JARVIS_AI_ENGINE="openai")
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_MODEL="gpt-4o"

# Local Ollama Settings (if JARVIS_AI_ENGINE="ollama")
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3"

# System Security
JARVIS_ALLOW_SHELL="true"
```

### Installing Offline Ollama Models
To use 100% offline local LLMs with J.A.R.V.I.S.:
1. Install [Ollama](https://ollama.com).
2. Pull a model in your terminal:
   ```bash
   ollama pull llama3
   ```
3. Open J.A.R.V.I.S. Settings in the UI and select `ollama` as your Active Engine!

---

## 📂 Project Architecture

```
jarvis-assistant/
├── start_jarvis.sh          # Universal startup launcher (Backend + Frontend)
├── backend/                 # Python FastAPI AI & Automation Core
│   ├── main.py              # REST API + WebSocket server
│   ├── config.py            # Environment & security configuration
│   ├── ai_engine.py         # Multi-engine LLM handler & tool calling dispatcher
│   ├── memory.py            # SQLite long-term memory bank & macro storage
│   ├── automation.py        # Hardware telemetry (psutil) & safe shell command runner
│   └── requirements.txt     # Python dependencies
└── frontend/                # Stark-Tech Web HUD (Vite + React 18 + Tailwind)
    ├── index.html           # Main HTML entry
    ├── vite.config.js       # Vite server & API proxying
    └── src/
        ├── App.jsx          # Main J.A.R.V.I.S. UI Controller
        ├── index.css        # Sci-Fi scanline grid & custom animations
        ├── components/
        │   ├── ArcReactor.jsx     # Animated SVG Stark Arc Reactor core
        │   ├── VoiceVisualizer.jsx # Real-time audio waveform visualizer
        │   ├── ChatInterface.jsx   # Sci-Fi command log & tool badges
        │   ├── TelemetryHUD.jsx    # CPU, RAM, Disk, Network gauges
        │   ├── MemoryDeck.jsx      # Persistent SQLite fact manager
        │   ├── AutomationDeck.jsx  # Macro runner & safe shell terminal
        │   └── SettingsModal.jsx   # Core configuration modal
        └── services/
            ├── api.js              # REST & WebSocket client
            └── speech.js           # Web Speech API Speech-to-Text & Text-to-Speech
```

---

## 🔒 Security & Custom Automation

### Safe System Shell Execution
By default, `JARVIS_ALLOW_SHELL=true` allows J.A.R.V.I.S. to run diagnostic terminal commands (`df -h`, `uptime`, `ls -la`, etc.). The automation engine includes token validation to block destructive patterns (`rm -rf /`, `mkfs`, `dd if=`) and enforces a strict execution timeout.

### Adding Custom Automation Macros
You can create custom macros in the **Automation Deck** or via the SQLite database to chain commands:
```json
{
  "name": "morning_protocol",
  "description": "Morning system check and briefing",
  "commands": [
    "GET_TELEMETRY",
    "CHECK_TIME",
    "RECALL_FACTS:User Designation"
  ]
}
```

---

## 🎙️ Voice Controls & Accent Customization
- **Speech-to-Text**: Click the **VOICE INPUT** microphone button on the HUD to talk to J.A.R.V.I.S. naturally.
- **Text-to-Speech**: J.A.R.V.I.S. automatically selects a British English (`en-GB`) voice when available in your OS/browser to emulate the classic butler cadence. You can adjust pitch and speed in the Settings Modal.

---
*Built with Stark-Tech analytical precision.*
