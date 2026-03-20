export default function StudentForm({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Student Details</h2>

      <input
        type="text"
        placeholder="College / School"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({ ...formData, college: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Degree"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({ ...formData, degree: e.target.value })
        }
      />

      <select
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({ ...formData, year: e.target.value })
        }
      >
        <option>1st Year</option>
        <option>2nd Year</option>
        <option>3rd Year</option>
        <option>4th Year</option>
      </select>

      <input
        type="text"
        placeholder="Interests (AI, Web Dev...)"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({
            ...formData,
            interests: e.target.value.split(","),
          })
        }
      />

      <input
        type="text"
        placeholder="Career Goal"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({ ...formData, careerGoal: e.target.value })
        }
      />
    </div>
  );
}