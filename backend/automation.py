import psutil
import platform
import subprocess
import time
import datetime
import requests
from typing import Dict, Any, Optional
from config import settings

class AutomationEngine:
    """
    J.A.R.V.I.S. System Automation & Telemetry Engine.
    Monitors CPU, Memory, Disk, and Network, and executes safe automation commands.
    """
    def __init__(self):
        self.boot_time = psutil.boot_time()
        self.os_info = f"{platform.system()} {platform.release()} ({platform.machine()})"
        self._last_net_io = psutil.net_io_counters()
        self._last_net_time = time.time()

    def get_system_telemetry(self) -> Dict[str, Any]:
        """
        Fetch real-time CPU, Memory, Disk, Network, and Uptime metrics.
        """
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=0.1)
        cpu_cores = psutil.cpu_percent(interval=0.1, percpu=True)
        cpu_freq = psutil.cpu_freq()
        cpu_freq_current = round(cpu_freq.current, 1) if cpu_freq else 0.0

        # Memory usage
        mem = psutil.virtual_memory()
        mem_used_gb = round(mem.used / (1024**3), 2)
        mem_total_gb = round(mem.total / (1024**3), 2)
        mem_percent = mem.percent

        # Disk usage (root "/")
        try:
            disk = psutil.disk_usage("/")
            disk_used_gb = round(disk.used / (1024**3), 2)
            disk_total_gb = round(disk.total / (1024**3), 2)
            disk_percent = disk.percent
        except Exception:
            disk_used_gb = 0.0
            disk_total_gb = 0.0
            disk_percent = 0.0

        # Network speed calculation
        now = time.time()
        net_io = psutil.net_io_counters()
        time_diff = max(now - self._last_net_time, 0.1)
        bytes_sent_sec = (net_io.bytes_sent - self._last_net_io.bytes_sent) / time_diff
        bytes_recv_sec = (net_io.bytes_recv - self._last_net_io.bytes_recv) / time_diff
        self._last_net_io = net_io
        self._last_net_time = now

        # Uptime
        uptime_seconds = int(time.time() - self.boot_time)
        hours = uptime_seconds // 3600
        minutes = (uptime_seconds % 3600) // 60
        uptime_str = f"{hours}h {minutes}m"

        return {
            "os": self.os_info,
            "uptime": uptime_str,
            "cpu": {
                "percent": cpu_percent,
                "cores_count": len(cpu_cores),
                "cores": cpu_cores,
                "freq_mhz": cpu_freq_current
            },
            "memory": {
                "used_gb": mem_used_gb,
                "total_gb": mem_total_gb,
                "percent": mem_percent
            },
            "disk": {
                "used_gb": disk_used_gb,
                "total_gb": disk_total_gb,
                "percent": disk_percent
            },
            "network": {
                "kb_sent_sec": round(bytes_sent_sec / 1024, 1),
                "kb_recv_sec": round(bytes_recv_sec / 1024, 1)
            },
            "timestamp": now
        }

    def run_safe_shell_command(self, command: str) -> Dict[str, Any]:
        """
        Execute a safe shell command with timeout and output capture.
        """
        if not settings.ALLOW_SHELL_COMMANDS:
            return {
                "success": False,
                "output": "",
                "error": "Shell command execution is disabled in J.A.R.V.I.S. security configuration."
            }

        # Prevent obviously destructive rm -rf / commands
        dangerous_tokens = ["rm -rf /", "mkfs", "> /dev/sda", "dd if=","reboot", "shutdown -h"]
        if any(token in command for token in dangerous_tokens):
            return {
                "success": False,
                "output": "",
                "error": f"SECURITY OVERRIDE: Command '{command}' contains restricted tokens."
            }

        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=settings.SAFE_COMMAND_TIMEOUT,
                cwd="/home/user"
            )
            output = result.stdout.strip()
            error_output = result.stderr.strip()
            if result.returncode == 0:
                return {
                    "success": True,
                    "output": output or "Command completed successfully with no output.",
                    "error": ""
                }
            else:
                return {
                    "success": False,
                    "output": output,
                    "error": error_output or f"Process exited with code {result.returncode}"
                }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": f"Command timed out after {settings.SAFE_COMMAND_TIMEOUT} seconds."
            }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": str(e)
            }

    def get_time_and_weather(self, location: str = "Asansol, West Bengal, India") -> Dict[str, Any]:
        """
        Get current time and check live weather for the user's location.
        """
        now_dt = datetime.datetime.now()
        time_str = now_dt.strftime("%A, %B %d, %Y - %I:%M %p")

        # Free Open-Meteo weather API or wttr.in for quick location weather
        weather_summary = "Weather service online."
        temp_c = None
        condition = "Clear"
        try:
            # We can use wttr.in JSON format for fast zero-key weather
            encoded_loc = requests.utils.quote(location)
            resp = requests.get(f"https://wttr.in/{encoded_loc}?format=j1", timeout=4)
            if resp.status_code == 200:
                data = resp.json()
                current = data.get("current_condition", [{}])[0]
                temp_c = current.get("temp_C", "N/A")
                desc = current.get("weatherDesc", [{"value": "Clear"}])[0].get("value", "Clear")
                weather_summary = f"{desc}, {temp_c}°C in {location}"
                condition = desc
        except Exception:
            weather_summary = f"Location: {location} (Weather API unreachable, local time verified)."

        return {
            "datetime": time_str,
            "location": location,
            "weather": weather_summary,
            "condition": condition,
            "temperature_c": temp_c
        }

# Singleton instance
automation_engine = AutomationEngine()
