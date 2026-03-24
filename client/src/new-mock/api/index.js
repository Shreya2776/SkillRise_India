import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

// We'll use a base URL for the mock API that includes /api
const MOCK_API_BASE = API_ENDPOINTS.MOCK_AUTH.replace("/auth", "");

const api = axios.create({
  baseURL: MOCK_API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// Interviews
export const interviewAPI = {
  create: (data) => api.post("/interviews/create", data),
  getAll: (params) => api.get("/interviews", { params }),
  getOne: (id) => api.get(`/interviews/${id}`),
  update: (id, data) => api.put(`/interviews/${id}`, data),
  delete: (id) => api.delete(`/interviews/${id}`),
  submitFeedback: (id, choices) => api.post("/interviews/submit", { interviewId: id, answers: choices }),
  generateFeedback: (id) => api.post(`/interviews/${id}/generate-feedback`),
  generateNextQuestion: (id, transcript) => api.post(`/interviews/${id}/next-question`, { transcript }),
  getStats: () => api.get("/interviews/stats"),
  generateQuestions: (data) => api.post("/interviews/generate-questions", data),
};

export default api;
