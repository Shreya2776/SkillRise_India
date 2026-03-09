"use client";

import { useState } from "react";
import { loginApi, registerApi, googleLoginUrl } from "@/api/auth";
import { Role } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const roleLabels: Record<Role, string> = {
  USER: "User",
  RECRUITER: "Recruiter",
  ADMIN: "Admin",
};

export default function AuthForm() {
  const { setUser } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<Role>("USER");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const redirect = (role: Role) => {
    if (role === "USER") router.push("/user/dashboard");
    if (role === "RECRUITER") router.push("/recruiter/dashboard");
    if (role === "ADMIN") router.push("/admin/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        await registerApi({ ...form, role });
      }

      const res = await loginApi({
        email: form.email,
        password: form.password,
        role,
      });

      setUser(res.data.user);
      redirect(res.data.user.role);
    } catch (err) {
      alert("Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-2xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden min-h-[550px]">
        
        {/* Left Side: Illustration */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 p-12 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            {mode === "login" ? (
              <>
                <div className="bg-white/40 p-6 rounded-3xl mb-8 backdrop-blur-sm">
                   <img 
                      src="/login image.webp"
                      alt="Login Illustration"
                      className="w-64 h-64 object-contain"
                    />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome Back!</h2>
                <p className="text-slate-700 mt-2">To keep connected with us please login with your personal info</p>
              </>
            ) : (
              <>
                <div className="bg-white/40 p-6 rounded-3xl mb-8 backdrop-blur-sm">
                   <img 
                    src="https://illustrations.popsy.co/blue/abstract-art-6.svg"
                    alt="Signup Illustration" 
                    className="w-64 h-64 object-contain"
                   />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Join Our Journey</h2>
                <p className="text-slate-700 mt-2">Enter your personal details and start your journey with us</p>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {mode === "login" ? "Login" : "Create Account"}
            </h1>
            <p className="text-slate-600 mt-2 text-sm font-medium">
              {mode === "login" ? "Please enter your details to login" : "Sign up to get started"}
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            {(Object.keys(roleLabels) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  role === r ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                required
              />
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              required
            />

            {mode === "signup" && (
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                required
              />
            )}

            {mode === "login" && (
              <div className="flex justify-between items-center text-xs text-blue-600 font-bold">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" /> Remember Me
                </label>
                <button type="button" className="hover:underline">Forgot Password?</button>
              </div>
            )}

            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]">
              {mode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6">
            <button 
                type="button"
                onClick={() => (window.location.href = googleLoginUrl)}
                className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 transition-all font-bold shadow-sm active:scale-[0.98]"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
          </div>

          <p className="text-center mt-8 text-sm text-slate-600">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-blue-600 font-extrabold cursor-pointer hover:underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}