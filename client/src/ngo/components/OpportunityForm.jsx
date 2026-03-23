import React, { useState } from "react";
import { Plus, Send, Briefcase, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OpportunityForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "job",
    skills: "",
    location: "",
    deadline: "",
    applyLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.type) {
      setMsg({ type: "error", text: "Please fill required fields (Title, Description, Type)" });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      await onSubmit(formData);
      setMsg({ type: "success", text: "Opportunity posted!" });
      setFormData({ title: "", description: "", type: "job", skills: "", location: "", deadline: "", applyLink: "" });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/15 font-medium outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#11111a] border border-white/[0.08] rounded-2xl p-5 shadow-2xl overflow-hidden relative"
    >
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.04]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-400">
          <Briefcase size={18} />
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Post Opportunity</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-0.5">Quick post action</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {msg.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 px-3 py-2.5 mb-4 rounded-xl border text-xs ${
              msg.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            } font-medium`}
          >
            {msg.type === "error" ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Title *</label>
            <input type="text" placeholder="e.g. Graphic Designer Needed" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Type *</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className={inputClass}>
              <option value="job" className="bg-black">Job</option>
              <option value="training" className="bg-black">Training</option>
              <option value="course" className="bg-black">Course</option>
              <option value="camp" className="bg-black">Camp</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Description *</label>
          <textarea rows="2" placeholder="Brief context about this opportunity..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Skills (comma separated)</label>
            <input type="text" placeholder="e.g. React, UX" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Location</label>
            <input type="text" placeholder="e.g. Remote / Delhi" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
           <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Deadline</label>
            <input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-0.5">Apply Link</label>
            <input type="text" placeholder="https://..." value={formData.applyLink} onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full group flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-sky-600 hover:shadow-blue-500/20`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Post Opportunity
                <Send size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
