// import { getTrendingSkills } from "../utils/calculations";
// import { Flame } from "lucide-react";

// const RANK_COLORS = [
//   "from-amber-400 to-orange-500",
//   "from-violet-400 to-purple-500",
//   "from-sky-400 to-blue-500",
// ];

// export default function TrendingSkills() {
//   const trending = getTrendingSkills(3);

//   return (
//     <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
//       <div className="flex items-center gap-3 mb-6">
//         <Flame className="w-5 h-5 text-orange-400" />
//         <h3 className="text-lg font-black text-white uppercase tracking-tight">
//           Trending Skills
//         </h3>
//       </div>
//       <div className="space-y-4">
//         {trending.map((s, i) => (
//           <div
//             key={s.skill}
//             className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all group"
//           >
//             {/* Rank badge */}
//             <div
//               className={`w-10 h-10 rounded-xl bg-gradient-to-br ${RANK_COLORS[i]} flex items-center justify-center text-white font-black text-sm shadow-lg`}
//             >
//               #{i + 1}
//             </div>

//             <div className="flex-1">
//               <p className="text-white font-bold text-sm">{s.label}</p>
//               <div className="mt-2 h-2 bg-white/[0.06] rounded-full overflow-hidden">
//                 <div
//                   className={`h-full rounded-full bg-gradient-to-r ${RANK_COLORS[i]} transition-all duration-1000 ease-out`}
//                   style={{ width: `${s.demand}%` }}
//                 />
//               </div>
//             </div>

//             <span className="text-sm font-black text-white/60 tabular-nums">
//               {s.demand}%
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


export default function TrendingSkills({ skills = [] }) {
  const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4">Trending Skills</h3>
      <div className="space-y-4">
        {skills.slice(0, 5).map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/80 capitalize">{skill.skill}</span>
              <span className="text-white/60">{skill.count} users</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${skill.percentage}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
