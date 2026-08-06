// API & WebSocket Service for J.A.R.V.I.S.

const API_BASE = "/api";

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error("Failed to fetch system status");
  return res.json();
}

export async function fetchTelemetry() {
  const res = await fetch(`${API_BASE}/telemetry`);
  if (!res.ok) throw new Error("Failed to fetch telemetry");
  return res.json();
}

export async function sendChatMessage(message, engine = null) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, engine })
  });
  if (!res.ok) throw new Error("Failed to process chat message");
  return res.json();
}

export async function fetchFacts(query = null) {
  const url = query ? `${API_BASE}/memory?query=${encodeURIComponent(query)}` : `${API_BASE}/memory`;
  const res = await fetch(url);
  return res.json();
}

export async function saveFact(key, value, category = "general") {
  const res = await fetch(`${API_BASE}/memory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value, category })
  });
  return res.json();
}

export async function deleteFact(key) {
  const res = await fetch(`${API_BASE}/memory/${encodeURIComponent(key)}`, {
    method: "DELETE"
  });
  return res.json();
}

export async function fetchMacros() {
  const res = await fetch(`${API_BASE}/macros`);
  return res.json();
}

export async function runMacro(name) {
  const res = await fetch(`${API_BASE}/macros/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function executeCommand(command) {
  const res = await fetch(`${API_BASE}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command })
  });
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

export async function updateSettings(settingsData) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settingsData)
  });
  return res.json();
}

// WebSocket connection for real-time telemetry updates
export class JarvisWebSocket {
  constructor(onTelemetry, onChatResponse, onCommandResponse) {
    this.onTelemetry = onTelemetry;
    this.onChatResponse = onChatResponse;
    this.onCommandResponse = onCommandResponse;
    this.socket = null;
    this.reconnectTimer = null;
  }

  connect() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/stream`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log("J.A.R.V.I.S. WebSocket Neural Link established.");
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "TELEMETRY_UPDATE" && this.onTelemetry) {
            this.onTelemetry(data.data);
          } else if (data.type === "CHAT_RESPONSE" && this.onChatResponse) {
            this.onChatResponse(data.data);
          } else if (data.type === "COMMAND_RESPONSE" && this.onCommandResponse) {
            this.onCommandResponse(data.data);
          }
        } catch (err) {
          console.error("WebSocket message parsing error:", err);
        }
      };

      this.socket.onclose = () => {
        console.warn("WebSocket closed. Reconnecting in 3s...");
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      };

      this.socket.onerror = (err) => {
        console.error("WebSocket Error:", err);
      };
    } catch (err) {
      console.error("Failed to connect WebSocket:", err);
    }
  }

  sendChat(message, engine = null) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: "CHAT",
        message,
        engine
      }));
    }
  }

  sendCommand(command) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: "RUN_COMMAND",
        command
      }));
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
