import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Square, Trash2, Loader2 } from "lucide-react";
import { cn } from "../../services/utils";

/**
 * VoiceInput
 * ──────────
 * Provides a high-tech browser SpeechRecognition interface for candidate responses.
 *
 * Props:
 *   onTranscript(text: string) — returns final transcribed content
 *   disabled?: boolean         — generic interaction lockout
 */
export default function VoiceInput({
  onTranscript,
  disabled = false,
  placeholder = "Engaging Neural Matrix: Start speaking...",
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [finalText, setFinalText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      setFinalText((prev) => prev + finalTranscript);
      setInterim(interimTranscript);
    };

    rec.onerror = (event) => {
      console.warn("[VoiceInput] Extraction failure:", event.error);
      setListening(false);
    };

    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    setSupported(true);
  }, []);

  const toggle = useCallback(() => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      const combined = (finalText + interim).trim();
      if (combined) onTranscript?.(combined);
    } else {
      setFinalText("");
      setInterim("");
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening, finalText, interim, onTranscript]);

  const clear = () => {
    setFinalText("");
    setInterim("");
  };

  const displayText = finalText + interim;

  if (!supported) {
    return (
      <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase font-black tracking-widest bg-white/5 px-4 py-2 rounded-lg">
         <Mic size={14} className="opacity-50" />
         Speech recognition unavailable in this browser
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-700">
      {/* Dynamic Transcription HUD */}
      <div className={cn(
        "relative min-h-[100px] p-6 rounded-2xl border transition-all duration-300 backdrop-blur-sm",
        listening 
          ? "bg-indigo-500/5 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
          : "bg-white/[0.02] border-white/10"
      )}>
        <p className={cn(
          "text-sm leading-relaxed font-sans transition-colors",
          displayText ? "text-white/90" : "text-white/30 italic"
        )}>
          {displayText || placeholder}
          {listening && (
            <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-2 animate-pulse align-middle" />
          )}
        </p>

        {listening && (
          <div className="absolute top-4 right-6 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
             <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Live Transcribing</span>
          </div>
        )}
      </div>

      {/* Control Surface */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          disabled={disabled}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20",
            listening 
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
              : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
          )}
        >
          {listening ? <Square size={14} fill="currentColor" /> : <Mic size={14} />}
          {listening ? "Terminate Stream" : "Establish Audio Link"}
        </button>

        {displayText && !listening && (
          <button
            onClick={clear}
            className="p-3 bg-white/5 border border-white/10 text-white/40 rounded-xl hover:bg-white/10 hover:text-white transition-all"
            title="Purge Transcript"
          >
            <Trash2 size={16} />
          </button>
        )}

        {listening && (
           <div className="flex-1 flex justify-end">
              <Loader2 size={18} className="animate-spin text-indigo-400 opacity-40" />
           </div>
        )}
      </div>
    </div>
  );
}
