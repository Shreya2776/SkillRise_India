import axios from "../lib/axios";

export const uploadResume = async (file: File) => {

  const formData = new FormData();
  formData.append("resume", file);

  const res = await axios.post("/resume/analyze", formData);

  return res.data;
};