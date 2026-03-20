// // export default function StudentForm({ formData, setFormData }) {
// //   return (
// //     <div className="space-y-4">
// //       <h2 className="text-xl font-semibold">Student Details</h2>

// //       <input
// //         type="text"
// //         placeholder="College / School"
// //         className="w-full p-2 rounded bg-white/20"
// //         onChange={(e) =>
// //           setFormData({ ...formData, college: e.target.value })
// //         }
// //       />

// //       <input
// //         type="text"
// //         placeholder="Degree"
// //         className="w-full p-2 rounded bg-white/20"
// //         onChange={(e) =>
// //           setFormData({ ...formData, degree: e.target.value })
// //         }
// //       />

// //       <select
// //         className="w-full p-2 rounded bg-white/20"
// //         onChange={(e) =>
// //           setFormData({ ...formData, year: e.target.value })
// //         }
// //       >
// //         <option>1st Year</option>
// //         <option>2nd Year</option>
// //         <option>3rd Year</option>
// //         <option>4th Year</option>
// //       </select>

// //       <input
// //         type="text"
// //         placeholder="Interests (AI, Web Dev...)"
// //         className="w-full p-2 rounded bg-white/20"
// //         onChange={(e) =>
// //           setFormData({
// //             ...formData,
// //             interests: e.target.value.split(","),
// //           })
// //         }
// //       />

// //       <input
// //         type="text"
// //         placeholder="Career Goal"
// //         className="w-full p-2 rounded bg-white/20"
// //         onChange={(e) =>
// //           setFormData({ ...formData, careerGoal: e.target.value })
// //         }
// //       />
// //     </div>
// //   );
// // }

// import { FaUser, FaPhone, FaMapMarkerAlt, FaGlobe, FaUniversity, FaBook, FaLightbulb, FaTools } from "react-icons/fa";

// export default function StudentForm({ formData, setFormData }) {
//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   return (
//     <div className="space-y-6">

//       {/* 🔹 BASIC INFO */}
//       <div className="space-y-4">
//         <h2 className="text-lg font-semibold text-gray-300">Basic Information</h2>

//         <div className="inputBox">
//           <FaUser className="icon" />
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={formData.name || ""}
//             onChange={(e) => handleChange("name", e.target.value)}
//           />
//         </div>

//         <div className="inputBox">
//           <FaPhone className="icon" />
//           <input
//             type="text"
//             placeholder="Phone Number"
//             value={formData.phone || ""}
//             onChange={(e) => handleChange("phone", e.target.value)}
//           />
//         </div>

//         <div className="inputBox">
//           <FaMapMarkerAlt className="icon" />
//           <input
//             type="text"
//             placeholder="Location (City)"
//             value={formData.location || ""}
//             onChange={(e) => handleChange("location", e.target.value)}
//           />
//         </div>

//         <div className="inputBox">
//           <FaGlobe className="icon" />
//           <select
//             value={formData.language || ""}
//             onChange={(e) => handleChange("language", e.target.value)}
//           >
//             <option value="">Preferred Language</option>
//             <option>English</option>
//             <option>Hindi</option>
//           </select>
//         </div>
//       </div>

//       {/* 🎓 EDUCATION */}
//       <div className="space-y-4">
//         <h2 className="text-lg font-semibold text-gray-300">Education</h2>

//         <div className="inputBox">
//           <FaUniversity className="icon" />
//           <input
//             type="text"
//             placeholder="College / School"
//             value={formData.college || ""}
//             onChange={(e) => handleChange("college", e.target.value)}
//           />
//         </div>

//         <div className="inputBox">
//           <FaBook className="icon" />
//           <input
//             type="text"
//             placeholder="Degree"
//             value={formData.degree || ""}
//             onChange={(e) => handleChange("degree", e.target.value)}
//           />
//         </div>

//         <div className="inputBox">
//           <FaBook className="icon" />
//           <select
//             value={formData.year || ""}
//             onChange={(e) => handleChange("year", e.target.value)}
//           >
//             <option value="">Select Year</option>
//             <option>1st Year</option>
//             <option>2nd Year</option>
//             <option>3rd Year</option>
//             <option>4th Year</option>
//           </select>
//         </div>
//       </div>

//       {/* 🧠 CAREER */}
//       <div className="space-y-4">
//         <h2 className="text-lg font-semibold text-gray-300">Career & Skills</h2>

//         <div className="inputBox">
//           <FaLightbulb className="icon" />
//           <input
//             type="text"
//             placeholder="Interests (AI, Web Dev...)"
//             value={formData.interests || ""}
//             onChange={(e) =>
//               handleChange("interests", e.target.value.split(","))
//             }
//           />
//         </div>

//         <div className="inputBox">
//           <FaTools className="icon" />
//           <input
//             type="text"
//             placeholder="Skills (comma separated)"
//             value={formData.skills || ""}
//             onChange={(e) =>
//               handleChange("skills", e.target.value.split(","))
//             }
//           />
//         </div>

//         <div className="inputBox">
//           <FaLightbulb className="icon" />
//           <input
//             type="text"
//             placeholder="Career Goal"
//             value={formData.careerGoal || ""}
//             onChange={(e) => handleChange("careerGoal", e.target.value)}
//           />
//         </div>
//       </div>

//       {/* 📄 RESUME */}
//       <div className="space-y-4">
//         <h2 className="text-lg font-semibold text-gray-300">Resume</h2>

//         <div className="inputBox">
//           <input
//             type="file"
//             onChange={(e) => handleChange("resume", e.target.files[0])}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }