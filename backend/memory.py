import sqlite3
import json
import time
from typing import List, Dict, Any, Optional
from config import settings

class MemoryBank:
    """
    J.A.R.V.I.S. Persistent Memory Bank using SQLite.
    Stores user facts, automation macros, conversation history, and preferences.
    """
    def __init__(self, db_path: str = str(settings.SQLITE_DB_PATH)):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Facts table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS facts (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    category TEXT DEFAULT 'general',
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL
                )
            """)
            # Macros table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS macros (
                    name TEXT PRIMARY KEY,
                    description TEXT NOT NULL,
                    commands TEXT NOT NULL, -- JSON array of command strings
                    created_at REAL NOT NULL
                )
            """)
            # Conversation history table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS conversation_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    timestamp REAL NOT NULL
                )
            """)
            # Preferences table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS preferences (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            """)
            conn.commit()
            self._seed_defaults(cursor, conn)

    def _seed_defaults(self, cursor, conn):
        """Seed default J.A.R.V.I.S. facts and macros on first boot."""
        cursor.execute("SELECT COUNT(*) as count FROM facts")
        if cursor.fetchone()["count"] == 0:
            now = time.time()
            default_facts = [
                ("User Designation", settings.USER_NAME, "profile", now, now),
                ("Primary Protocol", "Protect and serve Sir with utmost analytical precision.", "directive", now, now),
                ("Base Location", "Stark Tower / Residence (Asia/Calcutta TZ)", "location", now, now),
                ("Preferred Beverage", "Earl Grey Tea or Black Coffee", "preference", now, now),
                ("Core Security Level", "Alpha-Zero Override", "security", now, now)
            ]
            cursor.executemany(
                "INSERT INTO facts (key, value, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                default_facts
            )
            
            default_macros = [
                ("morning_protocol", "Morning system check and briefing", json.dumps([
                    "GET_TELEMETRY",
                    "CHECK_TIME",
                    "RECALL_FACTS:User Designation"
                ]), now),
                ("system_diagnostic", "Run full CPU and Memory diagnostic", json.dumps([
                    "GET_TELEMETRY",
                    "RUN_SHELL:df -h"
                ]), now),
                ("lockdown", "Initiate simulated security lockdown protocol", json.dumps([
                    "GET_TELEMETRY",
                    "RECALL_FACTS:Core Security Level"
                ]), now)
            ]
            cursor.executemany(
                "INSERT INTO macros (name, description, commands, created_at) VALUES (?, ?, ?, ?)",
                default_macros
            )
            conn.commit()

    # --- FACT METHODS ---
    def remember_fact(self, key: str, value: str, category: str = "general") -> Dict[str, Any]:
        now = time.time()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO facts (key, value, category, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                    value = excluded.value,
                    category = excluded.category,
                    updated_at = excluded.updated_at
            """, (key, value, category, now, now))
            conn.commit()
        return {"key": key, "value": value, "category": category, "updated_at": now}

    def get_all_facts(self) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT key, value, category, updated_at FROM facts ORDER BY updated_at DESC")
            return [dict(row) for row in cursor.fetchall()]

    def search_facts(self, query: str) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            wildcard = f"%{query.lower()}%"
            cursor.execute("""
                SELECT key, value, category, updated_at FROM facts
                WHERE LOWER(key) LIKE ? OR LOWER(value) LIKE ? OR LOWER(category) LIKE ?
                ORDER BY updated_at DESC
            """, (wildcard, wildcard, wildcard))
            return [dict(row) for row in cursor.fetchall()]

    def delete_fact(self, key: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM facts WHERE key = ?", (key,))
            conn.commit()
            return cursor.rowcount > 0

    # --- MACRO METHODS ---
    def save_macro(self, name: str, description: str, commands: List[str]) -> Dict[str, Any]:
        now = time.time()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO macros (name, description, commands, created_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(name) DO UPDATE SET
                    description = excluded.description,
                    commands = excluded.commands
            """, (name, description, json.dumps(commands), now))
            conn.commit()
        return {"name": name, "description": description, "commands": commands}

    def get_all_macros(self) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name, description, commands, created_at FROM macros ORDER BY name ASC")
            results = []
            for row in cursor.fetchall():
                item = dict(row)
                try:
                    item["commands"] = json.loads(item["commands"])
                except Exception:
                    item["commands"] = []
                results.append(item)
            return results

    def get_macro(self, name: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name, description, commands, created_at FROM macros WHERE name = ?", (name,))
            row = cursor.fetchone()
            if not row:
                return None
            item = dict(row)
            try:
                item["commands"] = json.loads(item["commands"])
            except Exception:
                item["commands"] = []
            return item

    # --- CONVERSATION LOG METHODS ---
    def log_message(self, role: str, content: str) -> None:
        now = time.time()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO conversation_log (role, content, timestamp) VALUES (?, ?, ?)",
                (role, content, now)
            )
            conn.commit()

    def get_recent_conversation(self, limit: int = 20) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT role, content, timestamp FROM conversation_log ORDER BY timestamp DESC LIMIT ?",
                (limit,)
            )
            rows = cursor.fetchall()
            return [dict(r) for r in reversed(rows)]

    def clear_history(self) -> None:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM conversation_log")
            conn.commit()

# Singleton instance
memory_bank = MemoryBank()
