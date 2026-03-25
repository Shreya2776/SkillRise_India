import StepCard from "./StepCard";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function Timeline({ roadmap }) {
  const phases = Array.isArray(roadmap) ? roadmap : [];

  if (phases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
        <p className="text-white/40 font-medium">No roadmap generated yet.</p>
      </div>
    );
  }

  // Sort phases by month if they aren't already
  const sortedPhases = [...phases].sort((a, b) => (a.month || 0) - (b.month || 0));

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-10 py-12">
      {/* Central Glowing Line */}
      <div className="absolute left-8 sm:left-[3.25rem] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-blue-500/0" />
      
      <div className="space-y-12">
        {sortedPhases.map((phase, index) => (
          <div key={index} className="relative pl-12 sm:pl-20">
            {/* Timeline Node */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="absolute left-[1.65rem] sm:left-[2.9rem] top-0 -translate-x-1/2 flex items-center justify-center"
            >
              <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] border-4 border-gray-950" />
            </motion.div>

            {/* Month Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Calendar size={12} className="text-purple-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">
                Month {phase.month || index + 1}
              </span>
            </motion.div>

            {/* Content Segment */}
            <div className="space-y-2">
              <StepCard step={phase} index={index} />
            </div>
          </div>
        ))}
      </div>

      {/* Completion Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-12 text-center"
      >
        <div className="inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 backdrop-blur-xl">
          <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
            End of Strategic Plan
          </p>
        </div>
      </motion.div>
    </div>
  );
}
