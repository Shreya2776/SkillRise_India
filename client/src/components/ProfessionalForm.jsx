export default function ProfessionalForm({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Professional Details</h2>

      <input
        type="text"
        placeholder="Current Job Role"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({ ...formData, currentRole: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Experience (years)"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({ ...formData, experience: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Company (optional)"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({ ...formData, company: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Salary Range"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({ ...formData, salaryRange: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Skills (comma separated)"
        className="w-full p-2 rounded bg-white/20"
        onChange={(e) =>
          setFormData({
            ...formData,
            skills: e.target.value.split(","),
          })
        }
      />
    </div>
  );
}