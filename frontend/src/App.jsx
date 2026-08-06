import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Activity, Database, Zap, Settings as SettingsIcon, 
  Volume2, VolumeX, Cpu, Shield, Sparkles, RefreshCw, Radio, Camera, Code2 
} from 'lucide-react';

import ArcReactor from './components/ArcReactor.jsx';
import VoiceVisualizer from './components/VoiceVisualizer.jsx';
import ChatInterface from './components/ChatInterface.jsx';
import TelemetryHUD from './components/TelemetryHUD.jsx';
import MemoryDeck from './components/MemoryDeck.jsx';
import AutomationDeck from './components/AutomationDeck.jsx';
import VisionDeck from './components/VisionDeck.jsx';
import CodeDeck from './components/CodeDeck.jsx';
import SettingsModal from './components/SettingsModal.jsx';

import { 
  fetchStatus, fetchTelemetry, sendChatMessage, fetchFacts, saveFact, 
  deleteFact, fetchMacros, runMacro, executeCommand, fetchSettings, 
  updateSettings, JarvisWebSocket 
} from './services/api.js';

import { JarvisSpeechEngine } from './services/speech.js';

export default function App() {
  // Navigation State ("command", "vision", "code", "telemetry", "memory", "automation")
  const [activeTab, setActiveTab] = useState('command');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Core App State
  const [status, setStatus] = useState('ONLINE');
  const [activeEngine, setActiveEngine] = useState('jarvis-local');
  const [userName, setUserName] = useState('Sir');
  const [telemetry, setTelemetry] = useState(null);
  const [messages, setMessages] = useState([]);
  const [facts, setFacts] = useState([]);
  const [macros, setMacros] = useState([]);
  const [settings, setSettingsData] = useState(null);

  // Speech & Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Refs for services
  const speechEngineRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Speech Engine
    speechEngineRef.current = new JarvisSpeechEngine({
      onSpeechResult: (transcript) => {
        handleSendMessage(transcript);
      },
      onSpeechError: (err) => {
        console.warn("Speech engine warning:", err);
      },
      onListeningChange: (listening) => {
        setIsListening(listening);
      },
      onSpeakingChange: (speaking) => {
        setIsSpeaking(speaking);
      }
    });

    // 2. Initialize WebSocket for live telemetry & chat streaming
    wsRef.current = new JarvisWebSocket(
      (telemetryData) => {
        setTelemetry(telemetryData);
      },
      (chatResponse) => {
        handleChatResponse(chatResponse);
      },
      (cmdResponse) => {
        console.log("Command WebSocket Response:", cmdResponse);
      }
    );
    wsRef.current.connect();

    // 3. Load initial data
    loadInitialData();

    // 4. Greeting message from J.A.R.V.I.S.
    setTimeout(() => {
      const greetingText = `Good day, Sir. J.A.R.V.I.S. Mark II Complete AI Desktop & Cloud Assistant is online with all 24 agentic features armed and operational. How may I assist your projects today?`;
      setMessages([
        {
          role: 'assistant',
          content: greetingText,
          timestamp: Math.floor(Date.now() / 1000),
          executedTools: []
        }
      ]);
      if (speechEngineRef.current) {
        speechEngineRef.current.speak(greetingText);
      }
    }, 800);

    return () => {
      if (wsRef.current) wsRef.current.disconnect();
      if (speechEngineRef.current) speechEngineRef.current.stopSpeaking();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const statRes = await fetchStatus();
      setStatus(statRes.status);
      setActiveEngine(statRes.active_engine);
      setUserName(statRes.user_name);

      const telRes = await fetchTelemetry();
      setTelemetry(telRes);

      const factsRes = await fetchFacts();
      setFacts(factsRes.facts || []);

      const macrosRes = await fetchMacros();
      setMacros(macrosRes.macros || []);

      const settingsRes = await fetchSettings();
      setSettingsData(settingsRes);
    } catch (err) {
      console.error("Failed to load initial J.A.R.V.I.S. data:", err);
    }
  };

  const handleChatResponse = (response) => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: response.response_text,
        timestamp: response.timestamp || Math.floor(Date.now() / 1000),
        executedTools: response.executed_tools || []
      }
    ]);

    if (response.telemetry) {
      setTelemetry(response.telemetry);
    }
    if (response.memory_updates && response.memory_updates.length > 0) {
      fetchFacts().then((res) => setFacts(res.facts || []));
    }

    if (speechEngineRef.current && voiceEnabled) {
      speechEngineRef.current.speak(response.response_text);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: Math.floor(Date.now() / 1000)
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await sendChatMessage(text, activeEngine);
      handleChatResponse(res);
    } catch (err) {
      console.error("Error communicating with J.A.R.V.I.S. neural core:", err);
      const errText = "I encountered a transient communication latency with my neural core, Sir. Please check network connectivity.";
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errText,
          timestamp: Math.floor(Date.now() / 1000)
        }
      ]);
      if (speechEngineRef.current && voiceEnabled) {
        speechEngineRef.current.speak(errText);
      }
    }
  };

  const handleAddFact = async (key, value, category) => {
    try {
      await saveFact(key, value, category);
      const updated = await fetchFacts();
      setFacts(updated.facts || []);
    } catch (err) {
      console.error("Failed to add fact:", err);
    }
  };

  const handleDeleteFact = async (key) => {
    try {
      await deleteFact(key);
      setFacts((prev) => prev.filter((f) => f.key !== key));
    } catch (err) {
      console.error("Failed to delete fact:", err);
    }
  };

  const handleSearchFacts = async (query) => {
    try {
      const res = await fetchFacts(query);
      setFacts(res.facts || []);
    } catch (err) {
      console.error("Failed to search facts:", err);
    }
  };

  const handleRunMacro = async (name) => {
    try {
      const res = await runMacro(name);
      if (speechEngineRef.current && voiceEnabled) {
        speechEngineRef.current.speak(`Executing protocol ${name}, ${userName}.`);
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const handleExecuteCommand = async (command) => {
    try {
      const res = await executeCommand(command);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      const res = await updateSettings(newSettings);
      setSettingsData(res.settings);
      setActiveEngine(res.settings.active_engine);
      setUserName(res.settings.user_name);
      if (speechEngineRef.current) {
        speechEngineRef.current.updateSettings(
          voiceEnabled,
          res.settings.voice_pitch,
          res.settings.voice_rate
        );
      }
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  // Handler for Vision Analysis API call
  const handleAnalyzeVision = async (payload) => {
    const res = await fetch('/api/vision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  };

  // Handler for Document Forge API call
  const handleGenerateDoc = async (docType, title, content) => {
    const res = await fetch('/api/forge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_type: docType, title, content })
    });
    return res.json();
  };

  // Handler for AI Coding API call
  const handleRunCode = async (language, prompt) => {
    const res = await fetch('/api/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, prompt })
    });
    return res.json();
  };

  const toggleVoice = (enabled) => {
    setVoiceEnabled(enabled);
    if (speechEngineRef.current) {
      speechEngineRef.current.enabled = enabled;
      if (!enabled) speechEngineRef.current.stopSpeaking();
    }
  };

  const startListening = () => {
    if (speechEngineRef.current) speechEngineRef.current.startListening();
  };

  const stopListening = () => {
    if (speechEngineRef.current) speechEngineRef.current.stopListening();
  };

  const handleReactorClick = () => {
    if (isListening) {
      stopListening();
    } else {
      handleSendMessage("Run system telemetry diagnostic");
    }
  };

  return (
    <div className="min-h-screen bg-[#040914] text-cyan-400 font-mono antialiased hud-grid scanlines flex flex-col">
      {/* Top Navigation HUD Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-cyan-500/30 backdrop-blur-lg px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)]">
              <span className="font-orbitron font-extrabold text-sm text-cyan-200">J</span>
            </div>
            <div>
              <h1 className="font-orbitron font-extrabold text-base sm:text-lg tracking-widest text-cyan-200">
                J.A.R.V.I.S. <span className="text-xs text-cyan-400/80 font-normal">// MARK II CORE</span>
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-cyan-400/80 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>STATUS: {status} // v2.0.0 (24 FEATURES ONLINE)</span>
              </div>
            </div>
          </div>

          {/* Nav Tabs (6 Futuristic Tabs) */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-cyan-500/30 rounded-xl overflow-x-auto max-w-full">
            {[
              { id: 'command', label: 'COMMAND DECK', icon: Terminal },
              { id: 'vision', label: 'VISION & KINETIC', icon: Camera },
              { id: 'code', label: 'CODE & DOCS FORGE', icon: Code2 },
              { id: 'telemetry', label: 'TELEMETRY HUD', icon: Activity },
              { id: 'memory', label: 'MEMORY BANKS', icon: Database },
              { id: 'automation', label: 'AUTOMATION', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-orbitron text-xs tracking-wider uppercase transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                      : 'text-cyan-400/80 hover:text-cyan-200 hover:bg-cyan-950/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded-full text-xs font-mono text-cyan-300">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeEngine}</span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 hover:border-cyan-400 rounded-lg text-cyan-300 transition-all shadow-[0_0_10px_rgba(0,243,255,0.1)]"
              title="J.A.R.V.I.S. Core Configuration"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Global Voice Visualizer Strip */}
        <VoiceVisualizer
          isListening={isListening}
          isSpeaking={isSpeaking}
          voiceEnabled={voiceEnabled}
          onToggleVoice={toggleVoice}
          onStartListening={startListening}
          onStopListening={stopListening}
        />

        {/* Dynamic Tab Renderer */}
        {activeTab === 'command' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Arc Reactor Core & Status */}
            <div className="lg:col-span-4 space-y-6">
              <ArcReactor
                status={status}
                isListening={isListening}
                isSpeaking={isSpeaking}
                activeEngine={activeEngine}
                onReactorClick={handleReactorClick}
              />

              {/* Mini Quick Telemetry Summary */}
              {telemetry && (
                <div className="p-4 bg-slate-900/60 border border-cyan-500/30 rounded-xl space-y-3">
                  <div className="text-xs font-orbitron font-semibold text-cyan-300 uppercase flex items-center justify-between">
                    <span>SYSTEM DIAGNOSTICS</span>
                    <span className="text-[10px] text-emerald-400 font-mono">LIVE FEED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-slate-950 rounded border border-cyan-900/40">
                      <div className="text-cyan-400/70 text-[10px]">CPU LOAD</div>
                      <div className="text-cyan-100 font-bold">{telemetry.cpu.percent}%</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-cyan-900/40">
                      <div className="text-cyan-400/70 text-[10px]">MEMORY (RAM)</div>
                      <div className="text-cyan-100 font-bold">{telemetry.memory.percent}%</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-cyan-900/40">
                      <div className="text-cyan-400/70 text-[10px]">DISK SPACE</div>
                      <div className="text-cyan-100 font-bold">{telemetry.disk.percent}%</div>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-cyan-900/40">
                      <div className="text-cyan-400/70 text-[10px]">UPTIME</div>
                      <div className="text-cyan-100 font-bold">{telemetry.uptime}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Dialogue Command Deck */}
            <div className="lg:col-span-8">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isListening={isListening}
                onStartListening={startListening}
                onStopListening={stopListening}
                activeEngine={activeEngine}
              />
            </div>
          </div>
        )}

        {activeTab === 'vision' && (
          <VisionDeck onAnalyzeVision={handleAnalyzeVision} />
        )}

        {activeTab === 'code' && (
          <CodeDeck
            onGenerateDoc={handleGenerateDoc}
            onRunCode={handleRunCode}
          />
        )}

        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            <TelemetryHUD telemetry={telemetry} />
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="space-y-6">
            <MemoryDeck
              facts={facts}
              onAddFact={handleAddFact}
              onDeleteFact={handleDeleteFact}
              onSearchFacts={handleSearchFacts}
            />
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="space-y-6">
            <AutomationDeck
              macros={macros}
              onRunMacro={handleRunMacro}
              onExecuteCommand={handleExecuteCommand}
            />
          </div>
        )}
      </main>

      {/* Footer HUD Bar */}
      <footer className="bg-slate-950 border-t border-cyan-900/50 py-3 px-4 sm:px-8 text-[11px] font-mono text-cyan-400/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span>STARK INDUSTRIES // ARTIFICIAL INTELLIGENCE CORE — MARK II (v2.0.0)</span>
            <span>|</span>
            <span className="text-cyan-300">USER: {userName.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>24 AGENTIC PROTOCOLS ONLINE</span>
            <span>ALPHA-0 PROTOCOL</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
