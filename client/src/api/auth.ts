import api from "@/lib/axios";
import { Role } from "@/types/auth";

export const registerApi = (data: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => api.post("/auth/register", data);

export const loginApi = (data: {
  email: string;
  password: string;
  role: Role;
}) => api.post("/auth/login", data);

export const meApi = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logoutApi = () => api.post("/auth/logout");

export const googleLoginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;