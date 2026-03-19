import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../../services/utils";

const BASE_URL = "http://localhost:5000/api";

export default function PreAssessment({ role, skills, candidateType = "experienced", onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await axios.post(`${BASE_URL}/assessment/generate`, { candidateType, role, skills });
        if (res.data.questions) {
          setQuestions(res.data.questions);
        } else {
            throw new Error(res.data.error || "Failed to generate questions");
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [role, skills, candidateType]);

  const select = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: { selected: option } }));
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length) {
      setError(`CALIBRATION INCOMPLETE: Please answer all remaining nodes.`);
      return;
    }
    setError(null);
    setSubmitting(true);

    const answersArray = questions.map(q => ({ id: q.id, selected: answers[q.id]?.selected }));

    try {
      const res = await axios.post(`${BASE_URL}/assessment/submit`, {
        candidateType, role, skills, questions, answers: answersArray
      });
      if (res.data.success || res.status === 200 || res.status === 201) {
           onComplete({
               difficulty: res.data.result?.difficulty || res.data.difficulty || "medium",
               percentage: res.data.result?.percentage || res.data.percentage || 0
           });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-6">
        <Loader2 size={48} className="animate-spin text-indigo-500" />
        <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Synthesizing Adaptive Nodes...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-4 text-center mb-8">
        <h2 className="text-4xl font-black text-white tracking-tighter">PRE-ASSESSMENT CALIBRATION</h2>
        <p className="text-white/40 text-sm font-medium">Clear these {questions.length} baseline nodes to establish your interview difficulty gradient.</p>
      </div>

      <div className="space-y-8 max-h-[55vh] overflow-y-auto scrollbar-hide pr-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-[#11111d] border border-white/10 rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="text-lg text-white font-medium leading-relaxed font-sans flex gap-4">
               <span className="text-[12px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-lg shrink-0 h-fit mt-1">N-{idx + 1}</span>
               {q.question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(q.options).map(([key, val]) => {
                const isSelected = answers[q.id]?.selected === key;
                return (
                  <button
                    key={key}
                    onClick={() => select(q.id, key)}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl text-left transition-all border outline-none",
                      isSelected 
                        ? "bg-indigo-600 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white" 
                        : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:border-white/20 hover:text-white/80"
                    )}
                  >
                    <span className={cn("flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black shrink-0", isSelected ? "bg-white/20 text-white" : "bg-white/10 text-white/40")}>{key}</span>
                    <span className="text-sm font-medium">{val}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-4 bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-rose-400">
           <AlertCircle size={20} />
           <p className="text-sm font-bold uppercase tracking-wider">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full group py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.5em] text-[11px] flex items-center justify-center gap-4 hover:bg-emerald-500 transition-all shadow-emerald-500/20 shadow-2xl active:scale-95 disabled:opacity-50"
      >
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={20} />}
        {submitting ? "Processing Matrix..." : "Confirm Baseline Calibration"}
      </button>
    </div>
  );
}
