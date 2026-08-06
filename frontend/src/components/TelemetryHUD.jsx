import React from 'react';
import { Cpu, HardDrive, Activity, Wifi, ShieldCheck, Clock, Terminal } from 'lucide-react';

export default function TelemetryHUD({ telemetry }) {
  if (!telemetry) {
    return (
      <div className="p-4 bg-slate-900/60 border border-cyan-500/30 rounded-xl text-center text-cyan-400 font-mono text-sm">
        ESTABLISHING TELEMETRY SENSOR FEED...
      </div>
    );
  }

  const { cpu, memory, disk, network, uptime, os } = telemetry;

  const getBarColor = (percent) => {
    if (percent > 85) return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
    if (percent > 65) return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]';
    return 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]';
  };

  return (
    <div className="bg-slate-900/70 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-cyan-200">
            STARK HARDWARE TELEMETRY
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-cyan-400/80">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>UPTIME: {uptime}</span>
          </span>
          <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/30 rounded text-[10px] text-cyan-300 font-orbitron">
            {os}
          </span>
        </div>
      </div>

      {/* Grid of Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Gauge */}
        <div className="p-3.5 bg-slate-950/60 border border-cyan-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-orbitron font-semibold text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>CPU LOAD</span>
            </span>
            <span className="text-sm font-bold font-mono text-cyan-100">
              {cpu.percent}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-500 ${getBarColor(cpu.percent)}`}
              style={{ width: `${Math.min(100, Math.max(2, cpu.percent))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-cyan-400/70 font-mono">
            <span>{cpu.cores_count} CORES</span>
            <span>{cpu.freq_mhz > 0 ? `${cpu.freq_mhz} MHz` : 'ONLINE'}</span>
          </div>
        </div>

        {/* RAM Gauge */}
        <div className="p-3.5 bg-slate-950/60 border border-cyan-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-orbitron font-semibold text-cyan-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>MEMORY (RAM)</span>
            </span>
            <span className="text-sm font-bold font-mono text-cyan-100">
              {memory.percent}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-500 ${getBarColor(memory.percent)}`}
              style={{ width: `${Math.min(100, Math.max(2, memory.percent))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-cyan-400/70 font-mono">
            <span>{memory.used_gb} GB USED</span>
            <span>/ {memory.total_gb} GB</span>
          </div>
        </div>

        {/* Disk Space Gauge */}
        <div className="p-3.5 bg-slate-950/60 border border-cyan-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-orbitron font-semibold text-cyan-300 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>ROOT DISK</span>
            </span>
            <span className="text-sm font-bold font-mono text-cyan-100">
              {disk.percent}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-500 ${getBarColor(disk.percent)}`}
              style={{ width: `${Math.min(100, Math.max(2, disk.percent))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-cyan-400/70 font-mono">
            <span>{disk.used_gb} GB USED</span>
            <span>/ {disk.total_gb} GB</span>
          </div>
        </div>

        {/* Network Gauge */}
        <div className="p-3.5 bg-slate-950/60 border border-cyan-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-orbitron font-semibold text-cyan-300 flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>NETWORK I/O</span>
            </span>
            <span className="text-xs font-mono text-cyan-300">
              ACTIVE FEED
            </span>
          </div>
          <div className="space-y-1 my-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-400/70">INBOUND:</span>
              <span className="text-emerald-400 font-semibold">{network.kb_recv_sec} KB/s</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-400/70">OUTBOUND:</span>
              <span className="text-cyan-400 font-semibold">{network.kb_sent_sec} KB/s</span>
            </div>
          </div>
          <div className="text-[10px] text-cyan-500/80 font-mono text-right mt-1">
            2.0S INTERVAL STREAM
          </div>
        </div>
      </div>
    </div>
  );
}
