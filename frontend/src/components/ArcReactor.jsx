import React from 'react';
import { Cpu, Zap, Activity, Shield, Volume2, Mic, Radio, ShieldCheck } from 'lucide-react';

export default function ArcReactor({ status, isListening, isSpeaking, activeEngine, onReactorClick }) {
  const isAlert = status === 'ERROR' || status === 'OFFLINE';
  const glowColor = isAlert 
    ? 'rgba(255, 0, 85, 0.85)' 
    : isSpeaking 
      ? 'rgba(255, 183, 3, 0.9)' 
      : isListening 
        ? 'rgba(0, 255, 170, 0.9)' 
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
      ? 'VOICE SYNTHESIS // ACTIVE' 
      : isListening 
        ? 'VOICE RECOGNITION // LISTENING...' 
        : 'ONLINE // MARK III OVERRIDE';

  return (
    <div 
      onClick={onReactorClick}
      className="stark-panel p-6 cursor-pointer group flex flex-col items-center justify-center transition-all duration-300"
    >
      {/* Iron Man Visor Corner Markers */}
      <div className="stark-corner-tl"></div>
      <div className="stark-corner-tr"></div>
      <div className="stark-corner-bl"></div>
      <div className="stark-corner-br"></div>

      {/* Top HUD Badge */}
      <div className="flex items-center gap-2 mb-3 px-3.5 py-1 bg-cyan-950/90 border border-cyan-400/50 rounded-full text-[10px] tracking-widest uppercase font-orbitron text-cyan-200 shadow-[0_0_12px_rgba(0,243,255,0.3)]">
        <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-amber-400 animate-ping' : isListening ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
        <span>MCU CORE // {statusLabel}</span>
      </div>

      {/* Authentic MCU Arc Reactor SVG */}
      <div className="relative w-48 h-48 flex items-center justify-center my-3">
        {/* Ambient energy aura */}
        <div 
          className="absolute inset-2 rounded-full blur-2xl transition-all duration-700"
          style={{ backgroundColor: glowColor }}
        ></div>

        <svg viewBox="0 0 220 220" className="w-full h-full relative z-10">
          <defs>
            <filter id="mcu-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Degree Marking Ring */}
          <circle
            cx="110"
            cy="110"
            r="102"
            fill="none"
            stroke="#08203e"
            strokeWidth="3.5"
          />

          {/* 4 Cardinal Degree Ticks (0, 90, 180, 270) */}
          {[0, 90, 180, 270].map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 110 + 96 * Math.cos(rad);
            const y1 = 110 + 96 * Math.sin(rad);
            const x2 = 110 + 106 * Math.cos(rad);
            const y2 = 110 + 106 * Math.sin(rad);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth="2.5"
                filter="url(#mcu-glow)"
              />
            );
          })}

          {/* Rotating Dashed Energy Ring */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeDasharray="22 10 8 10"
            className={`origin-center ${isSpeaking ? 'animate-spin-slow' : 'animate-spin-slow'}`}
            filter="url(#mcu-glow)"
          />

          {/* Inner Counter-Rotating Containment Ring */}
          <circle
            cx="110"
            cy="110"
            r="76"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeDasharray="28 14"
            className="origin-center animate-spin-reverse-slow"
            filter="url(#mcu-glow)"
          />

          {/* Stark 10-Node Containment Struts */}
          {[...Array(10)].map((_, i) => {
            const angle = (i * 36) * (Math.PI / 180);
            const x1 = 110 + 56 * Math.cos(angle);
            const y1 = 110 + 56 * Math.sin(angle);
            const x2 = 110 + 66 * Math.cos(angle);
            const y2 = 110 + 66 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth="3.2"
                strokeLinecap="round"
                filter="url(#mcu-glow)"
              />
            );
          })}

          {/* Hexagonal Inner Containment Frame */}
          <polygon
            points="110,60 152,85 152,135 110,160 68,135 68,85"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeOpacity="0.85"
            className="origin-center animate-pulse"
            filter="url(#mcu-glow)"
          />

          {/* Core Energy Aura Ring */}
          <circle
            cx="110"
            cy="110"
            r="36"
            fill="none"
            stroke={strokeColor}
            strokeWidth="4.5"
            filter="url(#mcu-glow)"
          />

          {/* Center Reactor Nucleus */}
          <circle
            cx="110"
            cy="110"
            r="22"
            fill={strokeColor}
            fillOpacity="0.95"
            className="origin-center animate-pulse-fast"
            filter="url(#mcu-glow)"
          />

          {/* Center Energy Core White Dot */}
          <circle
            cx="110"
            cy="110"
            r="7"
            fill="#ffffff"
            filter="url(#mcu-glow)"
          />
        </svg>

        {/* Hover label */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/85 rounded-full pointer-events-none">
          <span className="text-xs font-orbitron text-cyan-300 font-bold tracking-widest uppercase">
            {isListening ? 'LISTENING...' : isSpeaking ? 'SPEAKING...' : 'RUN DIAGNOSTIC'}
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="w-full flex items-center justify-between mt-4 pt-3 border-t border-cyan-900/70 text-xs font-mono text-cyan-400">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-200">ENGINE:</span>
          <span className="text-amber-400 uppercase font-bold">{activeEngine}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-300 text-[11px] font-semibold">3.0 GIGAJOULES/S</span>
        </div>
      </div>
    </div>
  );
}
