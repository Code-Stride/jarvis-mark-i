# J.A.R.V.I.S. // Mark III Total Mobile & Desktop Controller
**Version 3.0.0 (Stark Industries Total Control Build)**

An enterprise-grade **Full-Stack J.A.R.V.I.S. Assistant** combining a **7-Tab Sci-Fi Hologram Web HUD (React 18 + Vite + Tailwind CSS + PWA)** with a **30-Feature Agentic Python Core (FastAPI + Wireless ADB + Android Intents + Hardware Telemetry + Multi-Engine LLMs)**.

---

## ⚡ 30 Total Agentic Capabilities & Features

### 📱 1. Mobile Device & Hardware Controller (`MobileDeck`)
- **Direct App Launching via Android Intents**: 1-click buttons or voice commands to directly launch mobile apps on your Android or iPhone:
  - **WhatsApp** (`intent://whatsapp`)
  - **YouTube**
  - **Google Maps** (GPS navigation)
  - **Phone Dialer / Call** (`tel:+91...`)
  - **SMS Messages** (`sms:+91...`)
  - **Camera**
  - **Gmail**
  - **Spotify**
- **Mobile Hardware & Telemetry Sensors**:
  - Live Battery % & Charging state monitor (`navigator.getBattery()`)
  - Live Geolocation GPS coordinates (`navigator.geolocation.getCurrentPosition()`)
  - Device Gyroscope orientation & motion telemetry
  - **LED Flashlight / Torch**: Toggle your phone camera LED torch from J.A.R.V.I.S.
  - **Haptic Vibration**: Pulse phone vibration motor (`navigator.vibrate()`)
  - **Native OS Share & Clipboard**: Copy executive reports to phone clipboard or invoke the native OS Share Sheet.
- **PWA Home Screen Installation**: Install J.A.R.V.I.S. onto your Android or iPhone home screen as a fullscreen native app.

### 📶 2. Android Wireless ADB Remote Control (`mobile_automation.py`)
- **Wireless ADB over Wi-Fi**: Connect to Android phones over Wi-Fi (`adb connect <ip>:5555`).
- **Remote Touch & Gestures**: Execute remote screen taps (`x, y`) and swipes.
- **Remote Keyevents**: Control hardware buttons:
  - **HOME BUTTON** (`keyevent 3`)
  - **BACK BUTTON** (`keyevent 4`)
  - **POWER BUTTON** (`keyevent 26`)
  - **VOLUME UP / DOWN** (`keyevent 24/25`)
- **Remote APK Package Launching**: Launch Android APK packages remotely via ADB monkey commands.

### 🎙️ 3. Voice & Audio Protocols
- **Real-Time Voice Conversation**: Web Speech API microphone Speech-to-Text & British butler Text-to-Speech.
- **Wake Word Support**: Armed with **"Hey Jarvis"** keyword detection.
- **Gemini Native Audio & LiveKit**: Multimodal audio and WebRTC audio/video hooks.
- **Voice Commands + Chat Both Available**: Seamless hands-free voice and keyboard terminal dialogue.

### 👁️ 4. Camera Vision & Kinetic Intelligence (`VisionDeck`)
- **Camera Vision**: Live webcam video feed & snapshot analysis with Stark-Tech HUD overlay.
- **Object Detection**: Sci-fi bounding box detection for workstation objects.
- **Face & Emotion Detection**: Facial tracking and analytical emotion recognition (*"Calm / Focused"*).
- **Human Pose Detection**: Kinetic human posture and skeleton monitoring.
- **AI Screen Understanding & Control**: Screen OCR and visual desktop state analysis.

### 💻 5. Desktop Control & File Automation
- **Open/Close Desktop Apps**: Cross-platform application launcher (`chrome`, `vscode`, `terminal`, `calculator`, `spotify`).
- **Keyboard & Mouse Automation**: Automated typing, mouse clicks, and input macros.
- **File & Folder Management**: Read, list, create, search, and delete files under `/home/user`.
- **Browser Automation**: Automated web navigation, URL launching, and page scraping.
- **Full Access to Desktop**: Safe terminal command runner with sandboxed security overrides.

### 📝 6. Document Forge & AI Coding (`CodeDeck`)
- **AI Coding Assistant**: Generates syntax-highlighted Python, React/JSX, JavaScript, and HTML code.
- **Resume, PPT, Excel & Document Generation**: Generates downloadable Word (`.docx`), PowerPoint (`.pptx`), Excel (`.xlsx`), and Markdown (`.md`) reports.
- **PDF Explanation & Summarization**: Reads and summarizes multi-page PDF documents.
- **Research Report Generation**: Conducts open-web research and compiles structured executive briefings.
- **AI Image Generation**: Generates visible AI images directly inside your J.A.R.V.I.S. chat dialogue.

### 🌐 7. Telemetry, Weather & Intelligence
- **Human-Like AI**: Powered by `jarvis-local`, OpenAI GPT-4, Ollama local offline models, or Gemini.
- **Live System Monitoring**: Real-time CPU, RAM, Disk, Network I/O, and Uptime gauges streaming over WebSocket every 2 seconds.
- **Weather & Web Search**: Live atmospheric forecasts and open web search integration.

---

## 🚀 Render.com Deployment (With SPA Static Serving & Mobile PWA)
When deployed on **[Render.com](https://render.com)** via Blueprint (`render.yaml`), J.A.R.V.I.S. serves as your **permanent mobile web controller** accessible on any mobile phone!

---
*Built with Stark-Tech analytical precision.*
