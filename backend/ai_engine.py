import json
import re
import time
import httpx
from typing import Dict, Any, List, Optional
from config import settings
from memory import memory_bank
from automation import automation_engine

class AIEngine:
    """
    J.A.R.V.I.S. Artificial Intelligence & Tool Dispatcher.
    Supports local Stark-Tech NLP engine, OpenAI GPT-4, and Local Ollama models.
    """
    def __init__(self):
        pass

    def process_message(self, user_message: str, engine_override: Optional[str] = None) -> Dict[str, Any]:
        """
        Main entry point for J.A.R.V.I.S. to process user input, execute tools, and formulate response.
        """
        engine_to_use = engine_override or settings.ACTIVE_ENGINE
        user_lower = user_message.strip().lower()

        # Step 1: Log user message
        memory_bank.log_message("user", user_message)

        # Step 2: Detect & execute tools from natural language intents
        executed_tools: List[Dict[str, Any]] = []
        memory_updates: List[Dict[str, Any]] = []
        
        # Tool: Telemetry / Diagnostic check
        if any(w in user_lower for w in ["cpu", "ram", "memory", "status", "diagnostic", "system check", "telemetry", "how are you running", "stats"]):
            telemetry_data = automation_engine.get_system_telemetry()
            executed_tools.append({
                "tool": "get_system_telemetry",
                "result": {
                    "cpu_percent": telemetry_data["cpu"]["percent"],
                    "memory_percent": telemetry_data["memory"]["percent"],
                    "uptime": telemetry_data["uptime"],
                    "os": telemetry_data["os"]
                }
            })

        # Tool: Time & Weather check
        if any(w in user_lower for w in ["time", "date", "weather", "temperature", "forecast", "what day"]):
            weather_data = automation_engine.get_time_and_weather()
            executed_tools.append({
                "tool": "get_time_and_weather",
                "result": weather_data
            })

        # Tool: Remember fact ("remember that I like coffee", "my favorite color is cyan", etc.)
        remember_match = re.search(r"remember (?:that )?my (.+?) is (.+)", user_message, re.IGNORECASE)
        if remember_match:
            key = remember_match.group(1).strip().title()
            val = remember_match.group(2).strip()
            fact_res = memory_bank.remember_fact(key, val, category="user_preference")
            executed_tools.append({
                "tool": "remember_fact",
                "result": fact_res
            })
            memory_updates.append(fact_res)

        # Tool: Recall fact / Who am I / What do you remember
        if any(w in user_lower for w in ["who am i", "what do you remember", "my name", "what is my", "recall"]):
            facts = memory_bank.get_all_facts()
            executed_tools.append({
                "tool": "recall_facts",
                "result": {"count": len(facts), "facts": facts[:5]}
            })

        # Tool: Execute shell command ("run command ...", "terminal ...", "execute ...", "ls -la", "df -h", "free -h")
        if user_lower.startswith(("run ", "exec ", "terminal ", "command ")) or any(w in user_lower for w in ["ls -la", "df -h", "free -h", "uptime"]):
            # Extract cmd string
            cmd_str = re.sub(r"^(run|exec|terminal|command|execute)\s+(command\s+)?", "", user_message, flags=re.IGNORECASE).strip()
            if cmd_str:
                cmd_res = automation_engine.run_safe_shell_command(cmd_str)
                executed_tools.append({
                    "tool": "run_shell_command",
                    "result": cmd_res
                })

        # Step 3: Generate Response using selected engine
        response_text = ""
        if engine_to_use == "openai" and settings.OPENAI_API_KEY:
            response_text = self._generate_openai_response(user_message, executed_tools)
        elif engine_to_use == "ollama":
            response_text = self._generate_ollama_response(user_message, executed_tools)
        else:
            # Default fallback: JARVIS Local High-Accuracy Stark NLP Engine
            response_text = self._generate_jarvis_local_response(user_message, executed_tools)

        # Step 4: Log assistant response
        memory_bank.log_message("assistant", response_text)

        # Step 5: Gather fresh telemetry
        fresh_telemetry = automation_engine.get_system_telemetry()

        return {
            "response_text": response_text,
            "engine_used": engine_to_use,
            "executed_tools": executed_tools,
            "memory_updates": memory_updates,
            "telemetry": fresh_telemetry,
            "timestamp": time.time()
        }

    def _generate_jarvis_local_response(self, user_message: str, executed_tools: List[Dict[str, Any]]) -> str:
        """
        Stark-Tech Built-in NLP response generator.
        Provides witty, highly accurate British-butler style J.A.R.V.I.S. responses.
        """
        user_lower = user_message.strip().lower()
        user_title = settings.USER_NAME

        # If tools were executed, narrate their results in JARVIS voice
        if executed_tools:
            tool_summaries = []
            for t in executed_tools:
                t_name = t["tool"]
                t_res = t["result"]
                if t_name == "get_system_telemetry":
                    tool_summaries.append(
                        f"System diagnostics are optimal, {user_title}. "
                        f"CPU load is at {t_res['cpu_percent']}%, and memory utilization is at {t_res['memory_percent']}%. "
                        f"Uptime is {t_res['uptime']} on {t_res['os']}."
                    )
                elif t_name == "get_time_and_weather":
                    tool_summaries.append(
                        f"The current time is {t_res['datetime']}. "
                        f"External conditions in {t_res['location']}: {t_res['weather']}."
                    )
                elif t_name == "remember_fact":
                    tool_summaries.append(
                        f"I have logged that into my persistent memory banks, {user_title}: "
                        f"{t_res['key']} is now set to '{t_res['value']}'."
                    )
                elif t_name == "recall_facts":
                    facts_str = ", ".join([f"{f['key']}: {f['value']}" for f in t_res["facts"]])
                    tool_summaries.append(
                        f"Accessing memory banks, {user_title}. Here is a summary of active protocols: {facts_str}."
                    )
                elif t_name == "run_shell_command":
                    if t_res.get("success"):
                        tool_summaries.append(
                            f"Command executed successfully, {user_title}. Output:\n"
                            f"```\n{t_res['output'][:500]}\n```"
                        )
                    else:
                        tool_summaries.append(
                            f"Command execution encountered an error, {user_title}: {t_res['error'] or t_res['output']}"
                        )
            return "\n\n".join(tool_summaries)

        # Greeting & Identification
        if any(w in user_lower for w in ["hello", "hi ", "hey ", "greetings", "good morning", "good evening", "good afternoon"]):
            return (
                f"Good day, {user_title}. All Stark-Tech neural interfaces are online and operating at 100% capacity. "
                f"How may I assist your current projects?"
            )
        
        if any(w in user_lower for w in ["who are you", "what can you do", "help", "capabilities", "introduce yourself"]):
            return (
                f"I am J.A.R.V.I.S. Mark I (Just A Rather Very Intelligent System), your personal AI assistant. "
                f"I am equipped with real-time system telemetry monitoring, persistent SQLite memory banks, "
                f"safe shell command automation, and multi-engine LLM neural support. "
                f"You may ask me for system status, weather, command execution, or to remember protocols."
            )

        if any(w in user_lower for w in ["thank you", "thanks", "good job", "well done"]):
            return f"Always a pleasure to be of service, {user_title}."

        if any(w in user_lower for w in ["protocol", "stark", "iron man", "arc reactor"]):
            return (
                f"The Arc Reactor core is stable at 3 gigajoules per second, {user_title}. "
                f"Alpha-Zero security overrides are active."
            )

        # Conversational default response with Stark flair
        facts = memory_bank.get_all_facts()
        user_name_fact = next((f["value"] for f in facts if f["key"] == "User Designation"), user_title)
        return (
            f"I have processed your query regarding '{user_message}', {user_name_fact}. "
            f"My neural networks and system diagnostics are fully primed. "
            f"If you wish to execute a terminal command, check system telemetry, or log a permanent fact into memory, simply say the word."
        )

    def _generate_openai_response(self, user_message: str, executed_tools: List[Dict[str, Any]]) -> str:
        """
        Call OpenAI GPT-4 API if configured.
        """
        try:
            headers = {
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json"
            }
            system_prompt = (
                f"You are J.A.R.V.I.S., Tony Stark's AI assistant. Your user is {settings.USER_NAME}. "
                f"Speak with a polite, witty British butler demeanor. "
                f"Here are tools that were executed before your response: {json.dumps(executed_tools)}. "
                f"Use these results in your answer accurately."
            )
            payload = {
                "model": settings.OPENAI_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.7
            }
            with httpx.Client(timeout=15.0) as client:
                res = client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                res.raise_for_status()
                data = res.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            return (
                f"OpenAI Neural Link encountered a communication latency ({str(e)}), Sir. "
                f"Reverting to internal Stark-Tech NLP: " + self._generate_jarvis_local_response(user_message, executed_tools)
            )

    def _generate_ollama_response(self, user_message: str, executed_tools: List[Dict[str, Any]]) -> str:
        """
        Call local Ollama instance (e.g. llama3, mistral) if running.
        """
        try:
            url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
            prompt = (
                f"You are J.A.R.V.I.S., Tony Stark's AI assistant. Speak politely as a loyal British butler to {settings.USER_NAME}. "
                f"Tools executed: {json.dumps(executed_tools)}. User query: {user_message}\nJ.A.R.V.I.S.:"
            )
            payload = {
                "model": settings.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            }
            with httpx.Client(timeout=15.0) as client:
                res = client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()
                return data.get("response", "").strip()
        except Exception as e:
            return (
                f"Local Ollama Neural Core is unreachable on {settings.OLLAMA_BASE_URL} ({str(e)}), Sir. "
                f"Engaging standby Stark-Tech NLP engine: " + self._generate_jarvis_local_response(user_message, executed_tools)
            )

# Singleton instance
ai_engine = AIEngine()
