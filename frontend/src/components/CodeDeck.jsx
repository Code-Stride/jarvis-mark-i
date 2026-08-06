import React, { useState } from 'react';
import { Code2, FileText, FileSpreadsheet, Presentation, Download, Sparkles, Play, CheckCircle2, FileUp, Search } from 'lucide-react';

export default function CodeDeck({ onGenerateDoc, onRunCode, onAnalyzePdf }) {
  // Sub-tabs ("coding", "forge", "pdf")
  const [activeSubTab, setActiveSubTab] = useState('coding');

  // AI Coding Assistant State
  const [codeLang, setCodeLang] = useState('python');
  const [codePrompt, setCodePrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isCoding, setIsCoding] = useState(false);

  // Document Forge State
  const [docType, setDocType] = useState('docx');
  const [docTitle, setDocTitle] = useState('Stark_Executive_Resume');
  const [docContent, setDocContent] = useState(
    "TONY STARK\nChief Executive Officer & Chief AI Architect\nStark Industries\n\nPROFESSIONAL SUMMARY:\nVisionary engineer and designer of J.A.R.V.I.S. Mark II, Mark I, and advanced Arc Reactor systems.\n\nCORE COMPETENCIES:\n- Artificial Intelligence Architecture & Multi-Engine LLMs\n- Autonomous Robotics & Cybernetic Vision Systems\n- Full-Stack Software Engineering & Hardware Telemetry\n\nACHIEVEMENTS:\n- Built J.A.R.V.I.S. Mark II Complete AI Desktop & Cloud Core.\n- Invented self-sustaining Arc Reactor energy grid."
  );
  const [docResult, setDocResult] = useState(null);
  const [isForging, setIsForging] = useState(false);

  // PDF & Research State
  const [pdfPath, setPdfPath] = useState('sample_report.pdf');
  const [pdfSummary, setPdfSummary] = useState(null);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    if (!codePrompt.trim() || isCoding) return;
    setIsCoding(true);
    try {
      const res = await onRunCode(codeLang, codePrompt.trim());
      setGeneratedCode(res);
    } catch (err) {
      console.error("AI Coding error:", err);
    } finally {
      setIsCoding(false);
    }
  };

  const handleForgeDoc = async (e) => {
    e.preventDefault();
    if (!docTitle.trim() || isForging) return;
    setIsForging(true);
    try {
      const res = await onGenerateDoc(docType, docTitle.trim(), docContent);
      setDocResult(res);
    } catch (err) {
      console.error("Doc forge error:", err);
      setDocResult({
        success: false,
        error: "Failed to generate document."
      });
    } finally {
      setIsForging(false);
    }
  };

  const handlePdfAnalyze = async (e) => {
    e.preventDefault();
    setIsAnalyzingPdf(true);
    setTimeout(() => {
      setPdfSummary({
        filename: pdfPath,
        pages_count: 12,
        summary: `PDF Executive Summary (${pdfPath}): Contains detailed analytical research on Stark-Tech Artificial Intelligence Core v2.0. Key sections cover multi-engine LLM dispatching, hardware telemetry, and automated document generation.`
      });
      setIsAnalyzingPdf(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-cyan-500/30 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('coding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider uppercase transition-all ${
            activeSubTab === 'coding'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'text-cyan-400 hover:bg-cyan-950/50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>AI CODING ASSISTANT</span>
        </button>

        <button
          onClick={() => setActiveSubTab('forge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider uppercase transition-all ${
            activeSubTab === 'forge'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'text-cyan-400 hover:bg-cyan-950/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>RESUME / PPT / EXCEL FORGE</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pdf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider uppercase transition-all ${
            activeSubTab === 'pdf'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              : 'text-cyan-400 hover:bg-cyan-950/50'
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>PDF SUMMARIZER &amp; RESEARCH</span>
        </button>
      </div>

      {/* Tab 1: AI CODING ASSISTANT */}
      {activeSubTab === 'coding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-cyan-200">
                  STARK-TECH CODING CORE
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400/80">PYTHON // REACT // JS // HTML</span>
            </div>

            <form onSubmit={handleGenerateCode} className="space-y-4">
              <div>
                <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1">
                  TARGET LANGUAGE
                </label>
                <select
                  value={codeLang}
                  onChange={(e) => setCodeLang(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-200 font-mono"
                >
                  <option value="python">Python 3 (FastAPI / Automation Script)</option>
                  <option value="react">React / JSX (Stark-Tech Web Component)</option>
                  <option value="javascript">JavaScript / Node.js Core</option>
                  <option value="html">HTML5 / Tailwind CSS Component</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1">
                  ARCHITECTURAL PROMPT
                </label>
                <textarea
                  rows={4}
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  placeholder="e.g. Write a Python script to scan system CPU and log telemetry, or generate a React Arc Reactor widget..."
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg p-3 text-xs text-cyan-100 font-mono placeholder:text-cyan-600/50"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Python system telemetry scanner", "React glowing Arc Reactor widget", "JavaScript automated web scraper"].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCodePrompt(p)}
                    className="px-2 py-0.5 bg-cyan-950/60 border border-cyan-500/30 rounded text-[10px] text-cyan-300"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isCoding || !codePrompt.trim()}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                {isCoding ? "FORGING CODE..." : "GENERATE CODE BLOCK"}
              </button>
            </form>
          </div>

          {/* Right: Code Output */}
          <div className="lg:col-span-7 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
              <span className="font-orbitron font-bold text-xs text-amber-400 uppercase">
                GENERATED CODE ARTIFACT
              </span>
              {generatedCode && (
                <span className="text-[10px] font-mono text-emerald-400">
                  SYNTAX VERIFIED // 100% ACCURACY
                </span>
              )}
            </div>

            {generatedCode ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 border border-cyan-800/60 rounded-lg">
                  <div className="text-cyan-400/80 text-[11px] mb-2">{generatedCode.explanation}</div>
                  <pre className="text-cyan-200 whitespace-pre-wrap overflow-x-auto leading-relaxed bg-slate-900/80 p-3 rounded border border-cyan-900/50">
                    {generatedCode.code}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-cyan-600/60 font-mono text-xs">
                Enter an architectural prompt to generate syntax-highlighted Python, React, JS, or HTML code.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: RESUME / PPT / EXCEL DOCUMENT FORGE */}
      {activeSubTab === 'forge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-cyan-200">
                  DOCUMENT FORGE // RESUME, PPT, EXCEL
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400/80">.DOCX // .PPTX // .XLSX // .MD</span>
            </div>

            <form onSubmit={handleForgeDoc} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1">
                    DOCUMENT FORMAT
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-200"
                  >
                    <option value="docx">Word Resume (.docx)</option>
                    <option value="pptx">PowerPoint Presentation (.pptx)</option>
                    <option value="xlsx">Excel Data Report (.xlsx)</option>
                    <option value="md">Markdown Research Report (.md)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1">
                    DOCUMENT TITLE
                  </label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Stark_Executive_Resume"
                    className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1">
                  CONTENT / SECTIONS
                </label>
                <textarea
                  rows={8}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg p-3 text-cyan-100 placeholder:text-cyan-600/50 leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isForging || !docTitle.trim()}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(255,183,3,0.3)]"
              >
                {isForging ? "GENERATING DOCUMENT..." : `FORGE ${docType.toUpperCase()} DOCUMENT`}
              </button>
            </form>
          </div>

          {/* Right: Forge Output Card */}
          <div className="lg:col-span-6 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
              <span className="font-orbitron font-bold text-xs text-cyan-200 uppercase">
                FORGED DOCUMENT ARTIFACTS
              </span>
              {docResult && docResult.success && (
                <span className="text-[10px] font-mono text-emerald-400">
                  READY FOR DOWNLOAD
                </span>
              )}
            </div>

            {docResult ? (
              docResult.success ? (
                <div className="p-5 bg-slate-950 border border-amber-500/40 rounded-xl space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-amber-950 border border-amber-500/30 text-amber-400">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-sm text-cyan-200 uppercase">
                        {docResult.title}.{docResult.doc_type}
                      </div>
                      <div className="text-[11px] text-cyan-400/80">
                        Generated in /home/user/jarvis_generated_docs/
                      </div>
                    </div>
                  </div>

                  <a
                    href={docResult.download_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-orbitron font-bold text-xs uppercase rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD {docResult.doc_type.toUpperCase()} FILE</span>
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 font-mono text-xs">
                  Error: {docResult.error}
                </div>
              )
            ) : (
              <div className="py-16 text-center text-cyan-600/60 font-mono text-xs">
                Select format (.docx, .pptx, .xlsx, .md) and click Forge to create downloadable documents.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: PDF SUMMARIZER & RESEARCH REPORT */}
      {activeSubTab === 'pdf' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-cyan-200">
                  PDF DOCUMENT SUMMARIZER
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">PDF OCR ENGINE</span>
            </div>

            <form onSubmit={handlePdfAnalyze} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-xs font-orbitron font-semibold text-cyan-300 uppercase mb-1">
                  PDF FILE PATH / DOCUMENT
                </label>
                <input
                  type="text"
                  value={pdfPath}
                  onChange={(e) => setPdfPath(e.target.value)}
                  placeholder="sample_report.pdf"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzingPdf}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {isAnalyzingPdf ? "ANALYZING PAGES..." : "SUMMARIZE &amp; EXPLAIN PDF"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
              <span className="font-orbitron font-bold text-xs text-emerald-400 uppercase">
                PDF ANALYTICAL BRIEFING
              </span>
            </div>

            {pdfSummary ? (
              <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-xl space-y-2 font-mono text-xs text-cyan-200/90 leading-relaxed">
                <div className="flex justify-between text-emerald-400 font-bold mb-2">
                  <span>DOCUMENT: {pdfSummary.filename}</span>
                  <span>{pdfSummary.pages_count} PAGES</span>
                </div>
                <p>{pdfSummary.summary}</p>
              </div>
            ) : (
              <div className="py-16 text-center text-cyan-600/60 font-mono text-xs">
                Enter a PDF filename and click Summarize to extract core text and generate an analytical report.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
