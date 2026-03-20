
import { useState } from "react";
import StudentForm from "../components/StudentForm";
import ProfessionalForm from "../components/ProfessionalForm";
import WorkerForm from "../components/WorkerForm";
import { createProfile } from "../services/profileService";
import Stepper from "../components/Stepper";
export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
  try {
    const email = localStorage.getItem("email"); // or decode from token

    await createProfile({
      email,
      userType,
      ...formData,
    });

    alert("Profile Saved ✅");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      <div className="w-[600px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <Stepper step={step} />
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-center mb-6">
              Who are you?
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {["student", "professional", "worker"].map((type) => (
                <div
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`p-4 rounded-xl cursor-pointer text-center border 
                  ${userType === type ? "border-blue-400 bg-blue-500/20" : "border-white/20"}`}
                >
                  {type.toUpperCase()}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-purple-600 py-2 rounded-lg"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {userType === "student" && (
              <StudentForm formData={formData} setFormData={setFormData} />
            )}
            {userType === "professional" && (
              <ProfessionalForm formData={formData} setFormData={setFormData} />
            )}
            {userType === "worker" && (
              <WorkerForm formData={formData} setFormData={setFormData} />
            )}

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-green-500 py-2 rounded-lg"
            >
              Submit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}