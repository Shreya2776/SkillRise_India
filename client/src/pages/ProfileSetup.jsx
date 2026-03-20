import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import {
  User,
  Phone,
  MapPin,
  BookOpen,
  GraduationCap,
  Target,
} from "lucide-react";

export default function ProfileSetup() {
  const [index, setIndex] = useState(0);
  const [formData, setFormData] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/profile/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role: index === 0 ? "student" : index === 1 ? "professional" : "worker",
        data: formData,
      }),
    });

    alert("Profile Saved ✅");

  } catch (err) {
    console.log(err);
  }
};

  const handlers = useSwipeable({
    onSwipedLeft: () => index < 2 && setIndex(index + 1),
    onSwipedRight: () => index > 0 && setIndex(index - 1),
    trackMouse: true,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0f0f1a] to-black text-white">

      <div
        {...handlers}
        className="w-[800px] max-w-[95%] h-[680px] max-h-[92vh] rounded-3xl p-6 
        bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
      >

        {/* TABS */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-6">
          {["Student", "Professional", "Worker"].map((tab, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`flex-1 py-2 rounded-lg text-sm transition
                ${index === i
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "text-gray-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SLIDER */}
        <div
          className="flex transition-transform duration-500 h-[calc(100%-70px)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >

          {/* STUDENT */}
          <FormWrapper title="Student Profile" onSubmit={handleSubmit}>
            <Full><Input icon={<User />} placeholder="Full Name" onChange={(e)=>handleChange("name",e.target.value)} /></Full>

            <Input icon={<Phone />} placeholder="Phone" onChange={(e)=>handleChange("phone",e.target.value)} />
            <Input icon={<MapPin />} placeholder="Location" onChange={(e)=>handleChange("location",e.target.value)} />

            <Full><Input icon={<GraduationCap />} placeholder="College" onChange={(e)=>handleChange("college",e.target.value)} /></Full>

            <Input icon={<BookOpen />} placeholder="Degree" onChange={(e)=>handleChange("degree",e.target.value)} />

            <Select options={["Year","1st","2nd","3rd","4th"]} onChange={(v)=>handleChange("year",v)} />

            <Full><Input icon={<Target />} placeholder="Interests" onChange={(e)=>handleChange("interests",e.target.value)} /></Full>
            <Full><Input icon={<Target />} placeholder="Career Goal" onChange={(e)=>handleChange("goal",e.target.value)} /></Full>
          </FormWrapper>

          {/* PROFESSIONAL */}
          <FormWrapper title="Professional Profile" onSubmit={handleSubmit}>
            <Full><Input icon={<User />} placeholder="Full Name" onChange={(e)=>handleChange("name",e.target.value)} /></Full>

            <Input icon={<Phone />} placeholder="Phone" onChange={(e)=>handleChange("phone",e.target.value)} />
            <Input icon={<MapPin />} placeholder="Location" onChange={(e)=>handleChange("location",e.target.value)} />

            <Full><Input icon={<BookOpen />} placeholder="Language" onChange={(e)=>handleChange("lang",e.target.value)} /></Full>

            <Input icon={<BookOpen />} placeholder="Role" onChange={(e)=>handleChange("role",e.target.value)} />
            <Input icon={<Target />} placeholder="Experience" onChange={(e)=>handleChange("exp",e.target.value)} />

            <Full><Input icon={<BookOpen />} placeholder="Company" onChange={(e)=>handleChange("company",e.target.value)} /></Full>

            <Full><Input icon={<Target />} placeholder="Skills" onChange={(e)=>handleChange("skills",e.target.value)} /></Full>

            <Input icon={<Target />} placeholder="Salary" onChange={(e)=>handleChange("salary",e.target.value)} />

            <Select options={["Career Goal","Switch","Growth"]} onChange={(v)=>handleChange("goal",v)} />
          </FormWrapper>

          {/* WORKER */}
          <FormWrapper title="Worker Profile" onSubmit={handleSubmit}>
            <Full><Input icon={<User />} placeholder="Full Name" onChange={(e)=>handleChange("name",e.target.value)} /></Full>

            <Input icon={<Phone />} placeholder="Phone" onChange={(e)=>handleChange("phone",e.target.value)} />
            <Input icon={<MapPin />} placeholder="Location" onChange={(e)=>handleChange("location",e.target.value)} />

            <Full><Input icon={<BookOpen />} placeholder="Language" onChange={(e)=>handleChange("lang",e.target.value)} /></Full>

            <Select options={["Skill Type","Electrician","Driver","Plumber"]} onChange={(v)=>handleChange("skill",v)} />
            <Select options={["Experience","Beginner","Intermediate","Expert"]} onChange={(v)=>handleChange("exp",v)} />

            <Full><Input icon={<Target />} placeholder="Skills" onChange={(e)=>handleChange("skills",e.target.value)} /></Full>

            <Input icon={<BookOpen />} placeholder="Tools" onChange={(e)=>handleChange("tools",e.target.value)} />

            <Select options={["Work Type","Daily","Contract","Full-time"]} onChange={(v)=>handleChange("work",v)} />

            <Full><Input icon={<MapPin />} placeholder="Work Radius" onChange={(e)=>handleChange("radius",e.target.value)} /></Full>

            <Full><input type="file" className="input" /></Full>
          </FormWrapper>

        </div>
      </div>

      {/* 🔥 SCROLLBAR + INPUT STYLE */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #7c3aed, #3b82f6);
          border-radius: 10px;
        }

        .input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 12px;
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.1);
          color: #d1d5db;
          font-size: 14px;
        }

        .input:focus {
          outline: none;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}

/* WRAPPER */
function FormWrapper({ title, children, onSubmit }) {
  return (
    <div className="min-w-full px-6 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="flex-1 overflow-y-auto pr-2 custom-scroll min-h-0">
        <div className="grid grid-cols-2 gap-4">{children}</div>
      </div>

      <div className="pt-4 bg-gradient-to-t from-black/40">
        <button onClick={onSubmit} className="w-full bg-green-500 py-3 rounded-xl font-semibold">
          Save Profile
        </button>
      </div>
    </div>
  );
}

function Full({ children }) {
  return <div className="col-span-2">{children}</div>;
}

function Input({ icon, placeholder, onChange }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
      <div className="text-gray-400">{icon}</div>
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="bg-transparent outline-none w-full text-white placeholder-gray-400 text-sm"
      />
    </div>
  );
}

/* 🔥 CUSTOM SELECT */
function Select({ options, onChange }) {
  return (
    <div className="relative">
      <select
        onChange={(e)=>onChange(e.target.value)}
        className="input appearance-none pr-8"
      >
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        ▼
      </div>
    </div>
  );
}