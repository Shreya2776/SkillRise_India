import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlogForm from "../components/BlogForm";
import BlogCard from "../components/BlogCard";
import SkillsPanel from "../components/SkillsPanel";
import ImpactPanel from "../components/ImpactPanel";
import Suggestions from "../components/Suggestions";
import { initialBlogs, SKILL_LABELS } from "../utils/mockData";
import { getTrendingSkills } from "../utils/calculations";
import { Sparkles, LayoutGrid, BookOpen, Flame, TrendingUp } from "lucide-react";

export default function NgoDashboard() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    setTrending(getTrendingSkills(blogs, 3));
  }, [blogs]);

  const handleAddBlog = (newBlog) => {
    setBlogs([newBlog, ...blogs]);
  };

  const handleDeleteBlog = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-[#070708] text-white selection:bg-blue-500/30 font-sans p-6 md:p-12"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 items-start">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 group"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-500 group-hover:rotate-12 transition-transform duration-500" size={32} />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              NGO <span className="text-blue-500">Dashboard</span>
            </h1>
          </div>
          <p className="text-white/40 font-medium max-w-xl text-lg leading-relaxed">
            Welcome to the <span className="text-white/80">SkillRise Hub</span>. Promote skills, track your impact, and empower the workforce across India.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all duration-500"
        >
           <div className="p-2 bg-blue-500/10 rounded-xl">
              <BookOpen className="text-blue-400" size={24} />
           </div>
           <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">Total Active Content</p>
              <p className="text-2xl font-black">{blogs.length} Posts</p>
           </div>
        </motion.div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Column: Stats & Trending (4 cols) */}
        <aside className="xl:col-span-4 space-y-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ImpactPanel blogs={blogs} />
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-sm hover:border-blue-500/20 transition-all duration-300"
          >
             <div className="flex items-center gap-3 mb-6">
                <Flame className="text-orange-500" size={24} />
                <h2 className="text-xl font-bold text-white tracking-tight italic uppercase tracking-wider">Trending Skills</h2>
             </div>
             <div className="space-y-4">
                {trending.map(({ skill, count }, idx) => (
                  <motion.div 
                    key={skill} 
                    whileHover={{ x: 10 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-transparent border border-white/5 rounded-xl transition-all group cursor-default"
                  >
                    <div className="flex items-center gap-3">
                       <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${idx === 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-white/40'}`}>
                          0{idx + 1}
                       </span>
                       <span className="font-bold text-white/70 group-hover:text-white transition-colors">
                          {SKILL_LABELS[skill] || skill.toUpperCase()}
                       </span>
                    </div>
                    <div className="text-xs font-black px-3 py-1 bg-white/5 rounded-full text-white/30 border border-white/5 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all">
                       {count} Posts
                    </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Suggestions blogs={blogs} />
          </motion.div>
        </aside>

        {/* Right Column: Form & Content (8 cols) */}
        <main className="xl:col-span-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="md:col-span-1"
             >
                <BlogForm onSubmit={handleAddBlog} />
             </motion.div>
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.6 }}
               className="md:col-span-1 flex flex-col justify-between"
             >
                <SkillsPanel blogs={blogs} />
                <div className="mt-8 p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center gap-4 group">
                   <TrendingUp className="text-blue-400 animate-bounce" size={32} />
                   <p className="text-sm font-medium text-white/60 leading-relaxed italic group-hover:text-blue-200 transition-colors">
                      "Real-time analytics help you focus on skills that are most in demand across rural India."
                   </p>
                </div>
             </motion.div>
          </div>

          <section className="space-y-8 pt-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                 <LayoutGrid className="text-blue-500" size={24} />
                 <h2 className="text-2xl font-black text-white uppercase tracking-wider">Your Content Gallery</h2>
              </div>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest hidden sm:block">Total Reach: {blogs.length * 524} Lives</p>
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {blogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <BlogCard blog={blog} onDelete={handleDeleteBlog} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {blogs.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full h-64 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-2xl text-white/20 italic"
                >
                  No posts available. Start by creating your first educational content!
                </motion.div>
              )}
            </motion.div>
          </section>
        </main>
      </div>

      <footer className="mt-24 pt-12 border-t border-white/10 text-center text-white/20 text-xs space-y-4">
          <p className="font-bold tracking-[0.3em] uppercase opacity-50">SkillRise India 2026 • NGO Portal</p>
          <div className="flex justify-center gap-8 font-medium tracking-tight">
             <a href="#" className="hover:text-blue-400/60 transition-colors">Documentation</a>
             <a href="#" className="hover:text-blue-400/60 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-blue-400/60 transition-colors">Partner Guidelines</a>
          </div>
      </footer>
    </motion.div>
  );
}
