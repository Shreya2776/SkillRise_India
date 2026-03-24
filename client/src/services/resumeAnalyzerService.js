import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const API = axios.create({
  baseURL: API_ENDPOINTS.ANALYZER
});

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await API.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};