import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

export default function VoiceVisualizer({
  isListening,
  isSpeaking,
  voiceEnabled,
  onToggleVoice,
  onStartListening,
  onStopListening
}) {
  // Generate 16 bars for the audio visualizer
  const bars = [15, 25, 45, 65, 85, 95, 75, 55, 60, 80, 90, 70, 50, 30, 20, 15];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-5 py-4 bg-slate-900/70 border border-cyan-500/30 rounded-xl backdrop-blur-md">
      {/* Left state badge */}
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg border ${isListening ? 'border-emerald-500 bg-emerald-950/50 text-emerald-400 animate-pulse' : isSpeaking ? 'border-amber-500 bg-amber-950/50 text-amber-400 animate-pulse' : 'border-cyan-500/50 bg-cyan-950/50 text-cyan-400'}`}>
          {isListening ? (
            <Mic className="w-5 h-5 animate-bounce" />
          ) : isSpeaking ? (
            <Volume2 className="w-5 h-5 animate-pulse" />
          ) : (
            <Radio className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="text-xs font-orbitron font-semibold tracking-wide text-cyan-200">
            {isListening ? 'VOICE RECOGNITION ACTIVE' : isSpeaking ? 'J.A.R.V.I.S. SPEAKING' : 'VOICE INTERFACE STANDBY'}
          </div>
          <div className="text-[11px] text-cyan-400/80 font-mono">
            {voiceEnabled ? 'UK Butler Cadence // AUDIO SYNTHESIS: ON' : 'AUDIO SYNTHESIS: MUTED'}
          </div>
        </div>
      </div>

      {/* Middle Animated Waveform */}
      <div className="flex items-center gap-1.5 h-10 px-4 bg-slate-950/80 border border-cyan-900/50 rounded-lg">
        {bars.map((maxH, idx) => {
          let height = '8px';
          let bgColor = 'bg-cyan-900/60';
          let animation = 'none';

          if (isSpeaking) {
            height = `${Math.max(12, (maxH * ((idx % 3) + 1)) % 36)}px`;
            bgColor = 'bg-amber-400 shadow-[0_0_8px_rgba(255,183,3,0.7)]';
            animation = `pulse 0.7s infinite alternate`;
          } else if (isListening) {
            height = `${Math.max(12, (maxH * ((idx % 2) + 1)) % 36)}px`;
            bgColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(0,255,170,0.7)]';
            animation = `pulse 0.5s infinite alternate`;
          } else {
            height = `${maxH / 5}px`;
            bgColor = 'bg-cyan-600/40';
          }

          return (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-200 ${bgColor}`}
              style={{
                height,
                animation,
                animationDelay: `${idx * 60}ms`
              }}
            />
          );
        })}
      </div>

      {/* Right Control Buttons */}
      <div className="flex items-center gap-2">
        {/* Toggle Listening Microphone */}
        <button
          onClick={isListening ? onStopListening : onStartListening}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider transition-all border ${
            isListening
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border-cyan-500/40 hover:border-cyan-400'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>STOP LISTENING</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>VOICE INPUT</span>
            </>
          )}
        </button>

        {/* Toggle Text-to-Speech Mute/Unmute */}
        <button
          onClick={() => onToggleVoice(!voiceEnabled)}
          title={voiceEnabled ? "Mute Voice Synthesis" : "Enable Voice Synthesis"}
          className={`p-2 rounded-lg border transition-all ${
            voiceEnabled
              ? 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40 hover:border-cyan-400'
              : 'bg-slate-900 text-slate-500 border-slate-700 hover:text-slate-400'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
