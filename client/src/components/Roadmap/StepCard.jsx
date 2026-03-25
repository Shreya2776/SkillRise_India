import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Wrench, 
  Target, 
  ChevronDown, 
  ExternalLink,
  Youtube,
  GraduationCap,
  Hammer
} from "lucide-react";

export default function StepCard({ step, index }) {
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(index === 0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    setDone(saved[step.title] || false);
  }, [step.title]);

  const toggle = (e) => {
    e.stopPropagation();
    const updated = !done;
    setDone(updated);

    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    saved[step.title] = updated;
    localStorage.setItem("progress", JSON.stringify(saved));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative group mb-8 rounded-3xl border transition-all duration-500 overflow-hidden
        ${done 
          ? "bg-emerald-500/5 border-emerald-500/20" 
          : "bg-white/[0.03] border-white/10 hover:border-purple-500/30 hover:bg-white/[0.05]"
        }`}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none
        ${done ? "bg-emerald-500/5" : "bg-purple-500/5"} 
        blur-3xl`} 
      />

      <div 
        className="relative p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={toggle}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${done 
                  ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                  : "bg-white/5 text-white/30 hover:text-white/60 hover:bg-white/10"
                }`}
            >
              {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </motion.button>

            <div className="flex-1">
              <h3 className={`text-lg font-bold tracking-tight transition-all duration-300
                ${done ? "text-emerald-400 line-through opacity-70" : "text-white group-hover:text-purple-400"}`}>
                {step.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-white/30 flex items-center gap-1.5">
                  <Target size={12} className="text-purple-400" />
                  Phase Content
                </span>
              </div>
            </div>
          </div>

          <motion.div 
            animate={{ rotate: expanded ? 180 : 0 }}
            className="text-white/20 group-hover:text-white/40"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-white/5 space-y-6">
                {/* Skills & Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                      <BookOpen size={14} className="text-purple-400" />
                      Core Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.skills?.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] font-medium text-purple-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                      <Wrench size={14} className="text-blue-400" />
                      Required Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.tools?.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                    <Hammer size={14} className="text-amber-400" />
                    Practical Tasks
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {step.tasks?.map((t, i) => (
                      <li key={i} className="flex gap-3 text-sm text-white/70 leading-relaxed group/task">
                        <span className="text-purple-500/50 mt-1 font-bold">0{i+1}.</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                    <GraduationCap size={14} className="text-emerald-400" />
                    Verified Resources
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(step.resources || {}).map(([type, value]) => (
                      <div key={type} className="flex flex-col gap-1">
                        <span className="text-[10px] text-white/20 uppercase font-bold tracking-wider">{type}</span>
                        <div className="flex items-center gap-2 text-white/80 group/link">
                          {type === 'free' && <Youtube size={14} className="text-red-500" />}
                          {type === 'paid' && <ExternalLink size={14} className="text-blue-400" />}
                          {type === 'practice' && <Target size={14} className="text-purple-400" />}
                          <span className="text-[13px] font-medium truncate">{value || 'Exploring...'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {step.outcome && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest">
                      Milestone Outcome: {step.outcome}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
