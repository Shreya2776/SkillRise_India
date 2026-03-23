import React from "react";
import { Briefcase, Building2, MapPin, Calendar, Clock, Trash2, ExternalLink } from "lucide-react";

export default function OpportunityCard({ opportunity, onDelete, showDelete = false }) {
  const getTypeColor = (type) => {
    switch (type) {
      case "job": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "training": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "course": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "camp": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-white/10 text-white border-white/20";
    }
  };

  const getRelativeTime = (dateStr) => {
    const diff = new Date() - new Date(dateStr);
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:bg-white/[0.04] transition-all group shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${getTypeColor(opportunity.type)}`}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getTypeColor(opportunity.type)}`}>
                {opportunity.type}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                <Clock size={12} />
                {getRelativeTime(opportunity.createdAt)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
              {opportunity.title}
            </h3>
            {opportunity.createdBy && (
               <div className="flex items-center gap-1.5 text-sm text-white/50 mb-3">
                 <Building2 size={14} className="text-white/30" />
                 <span className="font-medium">{opportunity.createdBy.name}</span>
               </div>
            )}
          </div>
        </div>
        
        {showDelete && onDelete && (
          <button 
            onClick={() => onDelete(opportunity._id)}
            className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-red-500/20"
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <p className="text-sm text-white/70 leading-relaxed mb-6 font-medium">
        {opportunity.description}
      </p>

      {opportunity.skills && opportunity.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {opportunity.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-white/[0.05] border border-white/[0.08] text-white/80 rounded-lg text-xs font-semibold">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/40">
          {opportunity.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-400" />
              {opportunity.location}
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-orange-400" />
              Due: {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>

        {opportunity.applyLink && !showDelete && (
          <a
            href={opportunity.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-cyan-500/20"
          >
            Apply Now <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
