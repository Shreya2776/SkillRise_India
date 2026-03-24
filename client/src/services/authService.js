import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const API = axios.create({
  baseURL: API_ENDPOINTS.AUTH,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
export const registerUser = (data) => API.post("/register", data);

export const loginUser = (data) => API.post("/login", data);