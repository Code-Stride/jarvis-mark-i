import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Terminal, Bot, User, Sparkles, Zap, Shield, Cpu } from 'lucide-react';

export default function ChatInterface({
  messages,
  onSendMessage,
  isListening,
  onStartListening,
  onStopListening,
  activeEngine
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const quickChips = [
    { label: "System Telemetry", command: "Run system telemetry diagnostic" },
    { label: "Time & Weather", command: "What is the time and weather?" },
    { label: "Check Root Disk (df -h)", command: "run command df -h" },
    { label: "Check Memory (free -h)", command: "run command free -h" },
    { label: "Remember Coffee Preference", command: "Remember that my favorite beverage is Black Coffee" },
    { label: "Who am I?", command: "What do you remember about me?" },
  ];

  return (
    <div className="flex flex-col h-[520px] bg-slate-900/70 border border-cyan-500/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.1)]">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-950/90 border-b border-cyan-900/50">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-orbitron text-xs uppercase tracking-widest text-cyan-200 font-bold">
            J.A.R.V.I.S. // NEURAL DIALOGUE TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/30 rounded text-[10px] font-orbitron text-cyan-300 uppercase">
            ACTIVE ENGINE: {activeEngine}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-cyan-500/60 p-6">
            <Bot className="w-12 h-12 mb-3 text-cyan-400/40 animate-pulse" />
            <p className="font-orbitron text-sm tracking-wide text-cyan-300 mb-1">
              STARK NEURAL INTERFACE READY
            </p>
            <p className="text-xs font-mono max-w-md">
              Ask J.A.R.V.I.S. for hardware diagnostics, weather, memory queries, or to execute terminal commands.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-relaxed font-mono ${
                    isUser
                      ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-100 rounded-br-none shadow-[0_0_10px_rgba(0,243,255,0.15)]'
                      : 'bg-slate-950/90 border border-cyan-800/60 text-cyan-200 rounded-bl-none'
                  }`}
                >
                  {/* Tool execution badges if any */}
                  {msg.executedTools && msg.executedTools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-cyan-900/50">
                      {msg.executedTools.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-cyan-900/40 border border-cyan-500/40 rounded text-[10px] text-cyan-300 font-orbitron uppercase flex items-center gap-1"
                        >
                          <Zap className="w-2.5 h-2.5 text-amber-400" />
                          <span>TOOL: {t.tool}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message body */}
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>

                  {/* Timestamp & source */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-cyan-900/30 text-[10px] text-cyan-500/70 font-mono">
                    <span>{isUser ? 'SIR' : 'J.A.R.V.I.S.'}</span>
                    <span>{new Date(msg.timestamp * 1000).toLocaleTimeString()}</span>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-cyan-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-cyan-900/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-orbitron text-cyan-500 uppercase tracking-wider shrink-0">
          PROTOCOLS:
        </span>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(chip.command)}
            className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 hover:border-cyan-400 rounded-full text-xs text-cyan-300 font-mono whitespace-nowrap transition-all"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-cyan-900/60 flex items-center gap-2">
        {/* Voice mic input */}
        <button
          type="button"
          onClick={isListening ? onStopListening : onStartListening}
          className={`p-2.5 rounded-lg border transition-all ${
            isListening
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
              : 'bg-cyan-950/70 text-cyan-400 border-cyan-500/40 hover:border-cyan-400'
          }`}
          title={isListening ? "Stop voice listening" : "Start voice listening"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Command J.A.R.V.I.S. (e.g. 'Run system check', 'Remember my favorite tea', 'run uptime')..."
          className="flex-1 bg-slate-900/80 border border-cyan-500/30 rounded-lg px-4 py-2.5 text-sm text-cyan-200 placeholder:text-cyan-600/60 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] disabled:shadow-none"
        >
          <span>SEND</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
