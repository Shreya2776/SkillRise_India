// export default function WorkerForm({ formData, setFormData }) {
//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">Worker Details</h2>

//       <input
//         type="text"
//         placeholder="Full Name"
//         className="w-full p-2 rounded bg-white/20"
//         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//       />

//       <select
//         className="w-full p-2 rounded bg-white/20"
//         onChange={(e) => setFormData({ ...formData, skillType: e.target.value })}
//       >
//         <option>Electrician</option>
//         <option>Plumber</option>
//         <option>Driver</option>
//       </select>

//       <select
//         className="w-full p-2 rounded bg-white/20"
//         onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//       >
//         <option>Beginner</option>
//         <option>1-2 years</option>
//         <option>3-5 years</option>
//       </select>

//       <select
//         className="w-full p-2 rounded bg-white/20"
//         onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
//       >
//         <option>Daily</option>
//         <option>Contract</option>
//         <option>Full-time</option>
//       </select>

//       <input
//         type="text"
//         placeholder="Preferred Location"
//         className="w-full p-2 rounded bg-white/20"
//         onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//       />
//     </div>
//   );
// }