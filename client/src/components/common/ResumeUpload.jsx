import React, { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "../../services/utils";

const BASE_URL = "http://localhost:5000/api";

export default function ResumeUpload({ onParsed }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // Re-wires logic straight to Axios for robust multipart extraction mapping
      const res = await axios.post(`${BASE_URL}/resume/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const data = res.data;
      setResult(data);
      onParsed && onParsed(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      upload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Neo-Sci-Fi Draggable Interface Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative overflow-hidden border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 group",
          dragging 
            ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]" 
            : "border-white/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className={cn(
             "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
             dragging ? "bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/30" : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
          )}>
            {uploading ? <Loader2 size={32} className="animate-spin" /> : <UploadCloud size={32} />}
          </div>
          
          <div className="space-y-1">
            <p className="text-white font-medium text-lg tracking-tight">
              {uploading ? "Extracting Neural Matrix..." : "Drag & Drop Profile Document"}
            </p>
            <p className="text-white/40 text-[13px] font-sans">
              Supports .PDF and .DOCX (Max 5MB limitation constraint)
            </p>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        className="hidden"
        onChange={(e) => upload(e.target.files[0])}
      />

      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-rose-400">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-sm font-semibold uppercase tracking-wider">{error}</p>
        </div>
      )}

      {/* Styled Result Extractor */}
      {result && (
        <div className="bg-[#11111d] border border-emerald-500/30 rounded-2xl p-6 space-y-5 shadow-xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
               <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs">Profile Synthesized</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/30 w-16 shrink-0">Role</span>
               <span className="text-[15px] font-medium text-white">{result.role}</span>
            </div>
            <div className="flex items-baseline gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/30 w-16 shrink-0">Skills</span>
               <div className="flex flex-wrap gap-2 flex-1">
                  {result.skills?.slice(0, 6).map(skill => (
                     <span key={skill} className="px-3 py-1 bg-white/[0.04] border border-white/5 rounded-lg text-xs text-white/80 font-medium">
                        {skill}
                     </span>
                  ))}
                  {result.skills?.length > 6 && (
                     <span className="px-3 py-1 bg-white/5 rounded-lg text-[11px] font-black text-white/40 tracking-widest uppercase flex items-center">
                        +{result.skills.length - 6} Node<span className="lowercase">s</span>
                     </span>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
