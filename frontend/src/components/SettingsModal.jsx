import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Cpu, User, Volume2, Shield, Key, Save, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  if (!isOpen || !settings) return null;

  const [activeEngine, setActiveEngine] = useState(settings.active_engine || 'jarvis-local');
  const [userName, setUserName] = useState(settings.user_name || 'Sir');
  const [voicePitch, setVoicePitch] = useState(settings.voice_pitch || 0.95);
  const [voiceRate, setVoiceRate] = useState(settings.voice_rate || 1.05);
  const [allowShell, setAllowShell] = useState(settings.allow_shell ?? true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await onSaveSettings({
      active_engine: activeEngine,
      user_name: userName,
      voice_pitch: Number(voicePitch),
      voice_rate: Number(voiceRate),
      allow_shell: allowShell,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,243,255,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-900/60">
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="font-orbitron font-bold text-sm tracking-wider uppercase text-cyan-200">
              J.A.R.V.I.S. // CORE CONFIGURATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-cyan-500 hover:text-cyan-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* User Name */}
          <div>
            <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>USER DESIGNATION (TITLE)</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Sir, Tony Stark, Boss..."
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg px-3.5 py-2 text-xs text-cyan-100 font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* AI Engine Selection */}
          <div>
            <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>ACTIVE AI NEURAL ENGINE</span>
            </label>
            <select
              value={activeEngine}
              onChange={(e) => setActiveEngine(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg px-3.5 py-2 text-xs text-cyan-100 font-mono focus:outline-none focus:border-cyan-400"
            >
              <option value="jarvis-local">
                jarvis-local // Built-in Stark-Tech High-Accuracy NLP (Offline / No Key Needed)
              </option>
              <option value="openai">
                openai // OpenAI GPT-4 / GPT-4o (Requires OPENAI_API_KEY)
              </option>
              <option value="ollama">
                ollama // Local Ollama LLM (e.g. llama3 / mistral on localhost:11434)
              </option>
            </select>
            <p className="text-[11px] text-cyan-400/70 font-mono mt-1">
              {activeEngine === 'jarvis-local' && 'Zero external latency. Emulates Paul Bettany British-butler persona & tool execution.'}
              {activeEngine === 'openai' && 'Connects to OpenAI API if OPENAI_API_KEY is configured in backend/.env.'}
              {activeEngine === 'ollama' && 'Connects to your local offline Ollama server.'}
            </p>
          </div>

          {/* Voice Pitch & Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1.5 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>VOICE PITCH ({voicePitch})</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={voicePitch}
                onChange={(e) => setVoicePitch(e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1.5 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>VOICE RATE ({voiceRate})</span>
              </label>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={voiceRate}
                onChange={(e) => setVoiceRate(e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Security Shell Allowlist */}
          <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-cyan-900/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-orbitron font-semibold text-cyan-200">
                  ALLOW SYSTEM SHELL COMMANDS
                </div>
                <div className="text-[11px] text-cyan-400/70 font-mono">
                  Enables J.A.R.V.I.S. to run terminal commands (df, free, uptime, ls).
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={allowShell}
              onChange={(e) => setAllowShell(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cyan-900/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-orbitron text-xs uppercase rounded-lg transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            >
              {savedMessage ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>SAVED!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>APPLY SETTINGS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
