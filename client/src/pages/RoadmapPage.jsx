import { useState, useCallback } from "react";
import { useRoadmap } from "../hooks/useRoadmap";
import Roadmap from "../components/Roadmap/RoadmapContainer";
import { 
  Rocket, 
  RefreshCw, 
  ShieldAlert, 
  Trash2, 
  Upload, 
  Map as MapIcon, 
  Briefcase,
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoadmapPage() {
  const { roadmap, generate, update, careerSwitchGenerate, error, loading, clearRoadmap } = useRoadmap();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [duration, setDuration] = useState("");

  const handleGenerate = useCallback(async () => {
    const profile = {
      name: "Strategy Builder",
      targetRole: targetRole || "Software Developer",
      duration: duration || "6 months",
      resume: "Current focus",
      skills: [],
      experience: "Current"
    };

    try {
      await generate({ profile });
    } catch (e) {
      console.error("Roadmap generation error:", e);
    }
  }, [generate, targetRole, duration]);

  const handleUpdate = useCallback(async () => {
    if (!pdfFile || !targetRole || !duration) return;
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    const formData = new FormData();
    formData.append("resume", pdfFile);
    formData.append("targetRole", targetRole);
    formData.append("duration", duration);
    formData.append("completedSteps", JSON.stringify(Object.keys(saved).filter((k) => saved[k])));

    await update(formData);
    setShowUpdateForm(false);
  }, [update, pdfFile, targetRole, duration]);

  const handleCareerSwitch = useCallback(async () => {
    if (!pdfFile || !targetRole || !duration) return;
    const formData = new FormData();
    formData.append("resume", pdfFile);
    formData.append("targetRole", targetRole);
    formData.append("duration", duration);

    await careerSwitchGenerate(formData);
    setShowUpdateForm(false);
  }, [careerSwitchGenerate, pdfFile, targetRole, duration]);

  return (
    <div className="min-h-screen bg-[#06060a] text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-[10px] uppercase font-black tracking-widest text-purple-300/80">SkillRise Architect</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Roadmaps</span>
          </h1>
          <p className="text-base text-white/40 max-w-xl mx-auto font-medium">
            AI-powered career engineering to reach your next milestone with industry-specific precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Side */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                  <MapIcon size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-lg">Forge Path</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">Target Professional Role</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" />
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Frontend Specialist"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/40 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">Time Horizon</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" />
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 6 Months"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500/40 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-3">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full h-12 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : <Rocket size={18} />}
                    {loading ? "Architecting..." : "Generate Roadmap"}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowUpdateForm(!showUpdateForm)}
                      className="h-11 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      {showUpdateForm ? "Close Form" : "Scan Resume"}
                    </button>
                    {roadmap && (
                      <button
                        onClick={clearRoadmap}
                        className="h-11 rounded-2xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showUpdateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                        <Upload size={18} className="text-blue-400" />
                      </div>
                      <h4 className="font-bold text-sm">Resume Enhancement</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="block p-6 border border-dashed border-white/10 rounded-2xl hover:border-purple-500/40 hover:bg-white/5 transition-all cursor-pointer text-center group">
                        <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files[0])} />
                        <Upload className="mx-auto mb-2 text-white/20 group-hover:text-purple-400 transition-colors" size={24} />
                        <p className="text-[11px] font-bold text-white/40">
                          {pdfFile ? pdfFile.name : "SELECT PDF RESUME"}
                        </p>
                      </label>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleUpdate}
                          className="h-11 bg-purple-600/80 text-white font-bold rounded-xl text-xs hover:bg-purple-600 transition-all"
                        >
                          Bridge Skills Gap
                        </button>
                        <button
                          onClick={handleCareerSwitch}
                          className="h-11 bg-white/5 border border-white/5 text-white font-bold rounded-xl text-xs hover:bg-white/10 transition-all"
                        >
                          Pivot Career Path
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-8">
            <div className="relative min-h-[500px] rounded-[2.5rem] bg-[#0c0c14] border border-white/5 overflow-hidden p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-10"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin mb-6" />
                    <h3 className="text-xl font-bold mb-2">Synthesizing Path...</h3>
                    <p className="text-sm text-white/30 max-w-xs">Connecting your profile with market requirements and industry trends.</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                      <ShieldAlert className="text-rose-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Process Denied</h3>
                    <p className="text-sm text-white/30 max-w-xs">{error}</p>
                  </motion.div>
                ) : (roadmap && roadmap.length > 0) ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                      <div>
                        <h2 className="text-2xl font-black text-white">{targetRole || "Strategic Path"}</h2>
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mt-1 block">Confirmed Timeline: {duration || "6 Months"}</span>
                      </div>
                    </div>
                    <Roadmap data={roadmap} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
                  >
                    <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 rotate-12">
                      <MapIcon size={32} className="text-white/10 -rotate-12" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 italic text-white/60">No objectives mapped.</h3>
                    <p className="text-sm text-white/20 max-w-xs font-medium">
                      Define your target role and timeline to generate an AI career trajectory.
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-purple-500/30">
                      <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Command</span>
                      <ArrowRight size={12} className="animate-pulse" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
