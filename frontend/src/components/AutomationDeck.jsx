import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, AlertTriangle, Shield, Cpu, Zap, RefreshCw } from 'lucide-react';

export default function AutomationDeck({ macros, onRunMacro, onExecuteCommand }) {
  const [shellCommand, setShellCommand] = useState('');
  const [commandOutput, setCommandOutput] = useState(null);
  const [isRunningCommand, setIsRunningCommand] = useState(false);
  const [activeMacroResult, setActiveMacroResult] = useState(null);

  const handleRunCommand = async (e) => {
    e.preventDefault();
    if (!shellCommand.trim() || isRunningCommand) return;
    setIsRunningCommand(true);
    try {
      const res = await onExecuteCommand(shellCommand.trim());
      setCommandOutput(res);
    } catch (err) {
      setCommandOutput({
        success: false,
        output: '',
        error: err.message || "Failed to execute command."
      });
    } finally {
      setIsRunningCommand(false);
    }
  };

  const handleRunMacroClick = async (name) => {
    try {
      const res = await onRunMacro(name);
      setActiveMacroResult(res);
    } catch (err) {
      setActiveMacroResult({
        error: err.message || "Failed to execute macro."
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left: Saved Automation Macros */}
      <div className="bg-slate-900/70 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-md flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-cyan-200">
              AUTOMATION MACRO PROTOCOLS
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/80">
            {macros.length} MACROS ARMED
          </span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {macros.map((macro, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-950/60 border border-cyan-900/50 rounded-lg hover:border-cyan-500/40 transition-all flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-orbitron font-bold text-xs text-cyan-200 uppercase">
                    {macro.name}
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-400/70 mt-1">
                  {macro.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {macro.commands && macro.commands.map((c, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-cyan-900/30 border border-cyan-500/20 rounded text-[9px] font-mono text-cyan-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRunMacroClick(macro.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 rounded-lg text-xs font-orbitron text-cyan-300 uppercase transition-all shrink-0 shadow-[0_0_10px_rgba(0,243,255,0.15)]"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>EXECUTE</span>
              </button>
            </div>
          ))}
        </div>

        {/* Macro Execution Result Box */}
        {activeMacroResult && (
          <div className="mt-4 p-3.5 bg-slate-950/90 border border-cyan-500/40 rounded-lg text-xs font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="font-orbitron font-bold text-amber-400">
                MACRO OUTPUT // {activeMacroResult.macro || "RESULT"}
              </span>
              <button
                onClick={() => setActiveMacroResult(null)}
                className="text-cyan-500 hover:text-cyan-300 text-[10px]"
              >
                [CLEAR]
              </button>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto text-cyan-200/90">
              {activeMacroResult.error ? (
                <div className="text-rose-400">{activeMacroResult.error}</div>
              ) : (
                activeMacroResult.results && activeMacroResult.results.map((r, idx) => (
                  <div key={idx} className="p-2 bg-slate-900/60 rounded border border-cyan-900/50">
                    <div className="text-cyan-400 text-[10px] font-bold">{r.command}</div>
                    <pre className="text-[11px] whitespace-pre-wrap overflow-x-auto mt-1 text-cyan-100">
                      {typeof r.result === 'object' ? JSON.stringify(r.result, null, 2) : r.result}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Safe Command Terminal */}
      <div className="bg-slate-900/70 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-md flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-cyan-200">
              STARK SAFE SYSTEM SHELL
            </h3>
          </div>
          <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 rounded text-[10px] font-mono text-emerald-300">
            SANDBOXED EXECUTION
          </span>
        </div>

        {/* Command Form */}
        <form onSubmit={handleRunCommand} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-emerald-400 font-bold">
              $&gt;
            </span>
            <input
              type="text"
              value={shellCommand}
              onChange={(e) => setShellCommand(e.target.value)}
              placeholder="Enter system command (e.g. 'df -h', 'uptime', 'free -h', 'ls -la /home/user')..."
              className="w-full pl-8 pr-3 py-2 bg-slate-950/90 border border-cyan-500/30 rounded-lg text-xs text-cyan-100 font-mono placeholder:text-cyan-600/50 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={!shellCommand.trim() || isRunningCommand}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-orbitron font-bold text-xs uppercase rounded-lg transition-all"
          >
            {isRunningCommand ? "RUNNING..." : "RUN"}
          </button>
        </form>

        {/* Quick Sample Commands */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {["df -h", "free -h", "uptime", "ls -la /home/user", "whoami", "ps aux | head -5"].map((cmd, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setShellCommand(cmd)}
              className="px-2 py-0.5 bg-slate-950 hover:bg-cyan-950 border border-cyan-900 rounded text-[10px] font-mono text-cyan-300"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Command Output Terminal */}
        <div className="flex-1 min-h-[220px] bg-slate-950 border border-cyan-900/60 rounded-lg p-3.5 overflow-y-auto font-mono text-xs">
          {!commandOutput ? (
            <div className="text-cyan-600/60 text-center py-12">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>TERMINAL STANDBY. ENTER A COMMAND ABOVE.</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-1.5">
                <span className="text-[11px] font-orbitron font-bold uppercase flex items-center gap-1.5">
                  {commandOutput.success ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">STATUS: 0 // SUCCESS</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-rose-400">STATUS: ERROR</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] text-cyan-400/60">
                  /home/user #
                </span>
              </div>

              <pre className="text-cyan-200 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                {commandOutput.output || commandOutput.error}
              </pre>

              {commandOutput.error && commandOutput.output && (
                <div className="mt-2 pt-2 border-t border-rose-900/40 text-rose-300">
                  <span className="font-bold">Error:</span> {commandOutput.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
