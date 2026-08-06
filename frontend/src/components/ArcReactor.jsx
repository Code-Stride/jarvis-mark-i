import React from 'react';
import { Cpu, Zap, Activity, Shield, Volume2, Mic } from 'lucide-react';

export default function ArcReactor({ status, isListening, isSpeaking, activeEngine, onReactorClick }) {
  // Determine arc color theme based on state
  const isAlert = status === 'ERROR' || status === 'OFFLINE';
  const glowColor = isAlert 
    ? 'rgba(255, 0, 85, 0.8)' 
    : isSpeaking 
      ? 'rgba(255, 183, 3, 0.85)' 
      : isListening 
        ? 'rgba(0, 255, 170, 0.85)' 
        : 'rgba(0, 243, 255, 0.75)';

  const strokeColor = isAlert 
    ? '#ff0055' 
    : isSpeaking 
      ? '#ffb703' 
      : isListening 
        ? '#00ffaa' 
        : '#00f3ff';

  const statusLabel = isAlert 
    ? 'ALERT // DIAGNOSTIC NEEDED' 
    : isSpeaking 
      ? 'VOICE OUTPUT // ACTIVE' 
      : isListening 
        ? 'LISTENING FOR SIR...' 
        : 'ONLINE // ALPHA-0 OVERRIDE';

  return (
    <div 
      onClick={onReactorClick}
      className="relative flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-cyan-500/30 rounded-2xl backdrop-blur-md shadow-[0_0_25px_rgba(0,243,255,0.15)] hover:border-cyan-400/60 transition-all cursor-pointer group"
    >
      {/* Corner HUD brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 rounded-tl"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60 rounded-tr"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60 rounded-bl"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 rounded-br"></div>

      {/* Top HUD badge */}
      <div className="flex items-center gap-2 mb-3 px-3 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded-full text-[10px] tracking-wider uppercase font-orbitron text-cyan-300">
        <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-amber-400 animate-ping' : isListening ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
        <span>STARK CORE // {statusLabel}</span>
      </div>

      {/* Animated Arc Reactor SVG */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        {/* Glowing background halo */}
        <div 
          className="absolute inset-2 rounded-full blur-xl transition-all duration-700"
          style={{ backgroundColor: glowColor }}
        ></div>

        <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
          <defs>
            <filter id="reactor-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer ring */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="#061e38"
            strokeWidth="3"
          />

          {/* Rotating dashed ring */}
          <circle
            cx="100"
            cy="100"
            r="84"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeDasharray="18 10 6 10"
            className="origin-center animate-spin-slow"
            filter="url(#reactor-glow)"
          />

          {/* Inner counter-rotating ring */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeDasharray="25 15"
            className="origin-center animate-spin-reverse-slow"
            filter="url(#reactor-glow)"
          />

          {/* Stark 10-node ring */}
          {[...Array(10)].map((_, i) => {
            const angle = (i * 36) * (Math.PI / 180);
            const x1 = 100 + 52 * Math.cos(angle);
            const y1 = 100 + 52 * Math.sin(angle);
            const x2 = 100 + 60 * Math.cos(angle);
            const y2 = 100 + 60 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#reactor-glow)"
              />
            );
          })}

          {/* Hexagonal inner containment ring */}
          <polygon
            points="100,56 138,78 138,122 100,144 62,122 62,78"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeOpacity="0.7"
            className="origin-center animate-pulse"
          />

          {/* Core glow ring */}
          <circle
            cx="100"
            cy="100"
            r="32"
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            filter="url(#reactor-glow)"
          />

          {/* Center reactor nucleus */}
          <circle
            cx="100"
            cy="100"
            r="20"
            fill={strokeColor}
            fillOpacity="0.95"
            className="origin-center animate-pulse-fast"
            filter="url(#reactor-glow)"
          />

          {/* Tiny center dot */}
          <circle
            cx="100"
            cy="100"
            r="6"
            fill="#ffffff"
            filter="url(#reactor-glow)"
          />
        </svg>

        {/* Hover label */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 rounded-full pointer-events-none">
          <span className="text-xs font-orbitron text-cyan-300 font-bold tracking-widest uppercase">
            {isListening ? 'LISTENING' : isSpeaking ? 'SPEAKING' : 'RUN DIAGNOSTIC'}
          </span>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="w-full flex items-center justify-between mt-3 pt-3 border-t border-cyan-950 text-xs font-mono text-cyan-400">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-200">ENGINE:</span>
          <span className="text-amber-400 uppercase font-semibold">{activeEngine}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300 text-[11px]">ALPHA-0 OVERRIDE</span>
        </div>
      </div>
    </div>
  );
}
