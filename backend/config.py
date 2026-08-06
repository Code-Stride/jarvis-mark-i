import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

class Settings:
    # App general
    APP_NAME: str = "J.A.R.V.I.S. Artificial Intelligence Core"
    VERSION: str = "1.0.0-MARK-I"
    USER_NAME: str = os.getenv("JARVIS_USER_NAME", "Sir")
    
    # AI Engine settings ("jarvis-local", "openai", "ollama")
    ACTIVE_ENGINE: str = os.getenv("JARVIS_AI_ENGINE", "jarvis-local")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3")
    
    # Storage paths
    SQLITE_DB_PATH: Path = DATA_DIR / "jarvis_memory.db"
    LOG_FILE_PATH: Path = DATA_DIR / "jarvis_activity.log"
    
    # Voice Synthesis settings
    VOICE_ENABLED: bool = True
    VOICE_PITCH: float = 0.95    # Slightly authoritative, calm British butler pitch
    VOICE_RATE: float = 1.05     # Slightly crisp cadence
    VOICE_ACCENT: str = "en-GB"  # Default British English accent
    
    # Automation & Security
    ALLOW_SHELL_COMMANDS: bool = os.getenv("JARVIS_ALLOW_SHELL", "true").lower() == "true"
    SAFE_COMMAND_TIMEOUT: int = 15

settings = Settings()
