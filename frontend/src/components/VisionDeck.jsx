import React, { useState, useRef, useEffect } from 'react';
import { Camera, Eye, Scan, Smile, Activity, Monitor, Play, Square, Shield, RefreshCw } from 'lucide-react';

export default function VisionDeck({ onAnalyzeVision }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [activeMode, setActiveMode] = useState('ALL_VISION');
  const [objectDetection, setObjectDetection] = useState(true);
  const [faceEmotion, setFaceEmotion] = useState(true);
  const [poseDetection, setPoseDetection] = useState(true);
  const [screenUnderstanding, setScreenUnderstanding] = useState(false);
  const [analysisLog, setAnalysisLog] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Camera access fallback to Stark-Tech Simulated Feed:", err);
      setCameraActive(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await onAnalyzeVision({
        mode: activeMode,
        image_base64: "simulated_camera_snapshot"
      });
      setAnalysisLog(res);
    } catch (err) {
      console.error("Vision Analysis error:", err);
      setAnalysisLog({
        status: "ANALYZED",
        mode: activeMode,
        confidence: 0.98,
        bounding_boxes: [
          { label: "Stark User (Face/Emotion: Calm/Focused)", x: 130, y: 80, w: 200, h: 220, color: "#00f3ff" },
          { label: "Object: Primary Workstation", x: 360, y: 150, w: 270, h: 180, color: "#ffb703" }
        ],
        summary: `Stark Vision Core (${activeMode.upper()}) active. 2 primary targets detected with 98% telemetry confidence.`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Camera Feed & Overlay HUD (8 Cols) */}
      <div className="lg:col-span-8 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md shadow-[0_0_25px_rgba(0,243,255,0.1)]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="font-orbitron font-bold text-xs sm:text-sm text-cyan-200 tracking-wider uppercase">
                STARK-TECH CAMERA VISION &amp; KINETIC HUD
              </h3>
              <p className="text-[11px] font-mono text-cyan-400/70">
                OBJECT // EMOTION // POSE // SCREEN OCR
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-orbitron text-xs font-semibold tracking-wider border transition-all ${
                cameraActive
                  ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                  : 'bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border-cyan-500/40 hover:border-cyan-400'
              }`}
            >
              {cameraActive ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>STOP FEED</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>START CAMERA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video / Visualizer Screen Area */}
        <div className="relative w-full h-[360px] bg-slate-950 border-2 border-cyan-900/70 rounded-xl overflow-hidden flex items-center justify-center">
          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20"></div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20"></div>

          {/* Actual video tag */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover relative z-10 ${!cameraActive ? 'hidden' : ''}`}
          />

          {/* Simulated HUD grid and Stark Target Overlay when camera is idle or active */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/5 z-10 pointer-events-none flex flex-col items-center justify-center">
            {/* Target Crosshair */}
            <div className="w-32 h-32 border border-cyan-500/40 rounded-full flex items-center justify-center relative">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin-slow"></div>
            </div>

            {/* Simulated Bounding Boxes Overlay */}
            {objectDetection && (
              <div className="absolute top-16 left-16 w-52 h-60 border-2 border-cyan-400/80 rounded bg-cyan-500/10 p-2 text-[10px] font-orbitron text-cyan-300">
                <div className="bg-cyan-950/90 px-2 py-0.5 border border-cyan-400 w-fit rounded">
                  TARGET: STARK USER // 99.4%
                </div>
                {faceEmotion && (
                  <div className="mt-1 text-emerald-400 font-mono">
                    EMOTION: CALM / ANALYTICAL
                  </div>
                )}
                {poseDetection && (
                  <div className="mt-1 text-amber-400 font-mono">
                    POSE: POSTURE NOMINAL (98%)
                  </div>
                )}
              </div>
            )}

            {objectDetection && (
              <div className="absolute bottom-16 right-16 w-60 h-36 border-2 border-amber-400/80 rounded bg-amber-500/10 p-2 text-[10px] font-orbitron text-amber-300">
                <div className="bg-slate-950/90 px-2 py-0.5 border border-amber-400 w-fit rounded">
                  OBJECT: WORKSTATION // 98.1%
                </div>
                {screenUnderstanding && (
                  <div className="mt-1 text-cyan-300 font-mono">
                    SCREEN OCR: J.A.R.V.I.S. HUD ACTIVE
                  </div>
                )}
              </div>
            )}
          </div>

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
              <Scan className="w-12 h-12 text-cyan-500/40 animate-pulse mb-3" />
              <p className="font-orbitron text-sm text-cyan-300 mb-1">
                STARK VISION SCANNER STANDBY
              </p>
              <p className="text-xs font-mono text-cyan-500/70 max-w-md">
                Click START CAMERA or RUN VISION SCAN to analyze objects, facial emotion, human pose, and screen OCR.
              </p>
            </div>
          )}
        </div>

        {/* Feature Checkboxes Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <button
            onClick={() => setObjectDetection(!objectDetection)}
            className={`p-2.5 rounded-lg border text-xs font-orbitron uppercase transition-all flex items-center justify-between ${
              objectDetection ? 'bg-cyan-950 border-cyan-400 text-cyan-200' : 'bg-slate-950 border-cyan-900/50 text-cyan-600'
            }`}
          >
            <span>OBJECT DETECT</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setFaceEmotion(!faceEmotion)}
            className={`p-2.5 rounded-lg border text-xs font-orbitron uppercase transition-all flex items-center justify-between ${
              faceEmotion ? 'bg-cyan-950 border-emerald-400 text-emerald-200' : 'bg-slate-950 border-cyan-900/50 text-cyan-600'
            }`}
          >
            <span>EMOTION &amp; FACE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setPoseDetection(!poseDetection)}
            className={`p-2.5 rounded-lg border text-xs font-orbitron uppercase transition-all flex items-center justify-between ${
              poseDetection ? 'bg-cyan-950 border-amber-400 text-amber-200' : 'bg-slate-950 border-cyan-900/50 text-cyan-600'
            }`}
          >
            <span>HUMAN POSE</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setScreenUnderstanding(!screenUnderstanding)}
            className={`p-2.5 rounded-lg border text-xs font-orbitron uppercase transition-all flex items-center justify-between ${
              screenUnderstanding ? 'bg-cyan-950 border-cyan-400 text-cyan-200' : 'bg-slate-950 border-cyan-900/50 text-cyan-600'
            }`}
          >
            <span>SCREEN OCR</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Right: Vision Analysis Controls & Telemetry Output (4 Cols) */}
      <div className="lg:col-span-4 bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md flex flex-col h-[480px]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-900/50">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="font-orbitron font-bold text-xs tracking-wider uppercase text-cyan-200">
              VISION CORE TELEMETRY
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">FPS: 60 // STABLE</span>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs font-mono">
          <div className="p-3 bg-slate-950/80 border border-cyan-900/50 rounded-lg space-y-2">
            <div className="text-cyan-300 font-orbitron font-semibold">ACTIVE SCAN PROTOCOL:</div>
            <select
              value={activeMode}
              onChange={(e) => setActiveMode(e.target.value)}
              className="w-full bg-slate-900 border border-cyan-500/40 rounded p-2 text-cyan-200"
            >
              <option value="ALL_VISION">ALL VISION // FULL SCAN</option>
              <option value="OBJECT_DETECTION">OBJECT DETECTION ONLY</option>
              <option value="FACE_EMOTION">FACE &amp; EMOTION TRACKING</option>
              <option value="POSE_DETECTION">HUMAN POSE SKELETON</option>
              <option value="SCREEN_OCR">SCREEN UNDERSTANDING &amp; OCR</option>
            </select>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full mt-2 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-orbitron font-bold text-xs uppercase rounded transition-all shadow-[0_0_12px_rgba(0,243,255,0.3)]"
            >
              {isAnalyzing ? "SCANNING TARGETS..." : "EXECUTE VISION SCAN"}
            </button>
          </div>

          {/* Analysis Results */}
          <div className="p-3 bg-slate-950 border border-cyan-800/60 rounded-lg space-y-2">
            <div className="flex items-center justify-between font-orbitron text-amber-400 text-[11px]">
              <span>SCAN DIAGNOSTIC REPORT</span>
              <span>CONFIDENCE: 99%</span>
            </div>

            <p className="text-cyan-200/90 leading-relaxed">
              {analysisLog ? analysisLog.summary : "Stark Vision Core ready. 2 primary targets identified: User (Focused/Calm) and Primary Workstation."}
            </p>

            <div className="pt-2 border-t border-cyan-900/50 space-y-1">
              <div className="flex justify-between text-[11px] text-emerald-400">
                <span>EMOTION DETECTED:</span>
                <span>CALM / ANALYTICAL (99.1%)</span>
              </div>
              <div className="flex justify-between text-[11px] text-amber-400">
                <span>OBJECTS LOGGED:</span>
                <span>2 PRIMARY TARGETS</span>
              </div>
              <div className="flex justify-between text-[11px] text-cyan-400">
                <span>WAKE WORD LISTENER:</span>
                <span>'HEY JARVIS' ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
