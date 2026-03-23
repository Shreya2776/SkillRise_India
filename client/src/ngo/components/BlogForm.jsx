import React, { useState } from "react";
import { INDIAN_REGIONS, SKILL_LABELS } from "../utils/mockData";
import { PlusCircle, Info, Tag, MapPin, AlignLeft, Type } from "lucide-react";

export default function BlogForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    region: INDIAN_REGIONS[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.skills) return;

    const newBlog = {
      ...formData,
      id: Date.now(),
      skills: formData.skills.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean),
      date: new Date().toISOString().split("T")[0],
    };

    onSubmit(newBlog);
    setFormData({ title: "", description: "", skills: "", region: INDIAN_REGIONS[0] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-sm hover:border-blue-500/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <PlusCircle className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-white tracking-tight">Create New Post</h2>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60 flex items-center gap-2">
            <Type size={16} />
            Post Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
            placeholder="E.g., How to improve Digital Literacy"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60 flex items-center gap-2">
            <AlignLeft size={16} />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-white/20"
            placeholder="Write a brief overview of the blog or course..."
            required
          ></textarea>
        </div>

        {/* Skills & Region Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <Tag size={16} />
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
              placeholder="e.g., communication, sales"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <MapPin size={16} />
              Region
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            >
              {INDIAN_REGIONS.map((region) => (
                <option key={region} value={region} className="bg-gray-900 border-none outline-none">
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
        >
          <PlusCircle size={20} />
          Create Blog Post
        </button>
      </div>

      <div className="mt-6 flex items-start gap-2 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
        <Info className="text-blue-400 mt-0.5 shrink-0" size={16} />
        <p className="text-[12px] text-blue-400/70 leading-relaxed italic">
          Help bridge the skill gap by posting relevant courses and training programs for Job Seekers.
        </p>
      </div>
    </form>
  );
}
