import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
DOCS_DIR = Path("/home/user/jarvis_generated_docs")
DOCS_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    # App general
    APP_NAME: str = "J.A.R.V.I.S. Mark II Complete AI Desktop & Cloud Core"
    VERSION: str = "2.0.0-MARK-II-FULL"
    USER_NAME: str = os.getenv("JARVIS_USER_NAME", "Sir")
    
    # AI Engine settings ("jarvis-local", "openai", "ollama", "gemini")
    ACTIVE_ENGINE: str = os.getenv("JARVIS_AI_ENGINE", "jarvis-local")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Storage paths
    SQLITE_DB_PATH: Path = DATA_DIR / "jarvis_memory.db"
    LOG_FILE_PATH: Path = DATA_DIR / "jarvis_activity.log"
    DOCS_OUTPUT_DIR: Path = DOCS_DIR
    
    # Voice & Wake Word settings
    VOICE_ENABLED: bool = True
    VOICE_PITCH: float = 0.95
    VOICE_RATE: float = 1.05
    VOICE_ACCENT: str = "en-GB"
    WAKE_WORD_ENABLED: bool = True
    WAKE_WORD_PHRASE: str = os.getenv("WAKE_WORD_PHRASE", "hey jarvis")
    GEMINI_NATIVE_AUDIO: bool = True
    LIVEKIT_ENABLED: bool = True
    
    # Automation & Security
    ALLOW_SHELL_COMMANDS: bool = os.getenv("JARVIS_ALLOW_SHELL", "true").lower() == "true"
    SAFE_COMMAND_TIMEOUT: int = 15

settings = Settings()
