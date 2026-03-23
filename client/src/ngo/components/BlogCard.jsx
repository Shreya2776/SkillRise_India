import React from "react";
import { SKILL_LABELS } from "../utils/mockData";
import { Trash2, Calendar, MapPin, Tag } from "lucide-react";

export default function BlogCard({ blog, onDelete }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 group flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {blog.title}
          </h3>
          <button
            onClick={() => onDelete(blog.id)}
            className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <p className="text-white/60 mt-3 text-sm leading-relaxed mb-4">
          {blog.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {blog.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md flex items-center gap-1"
            >
              <Tag size={12} />
              {SKILL_LABELS[skill] || skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{blog.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>{blog.region}</span>
        </div>
      </div>
    </div>
  );
}
