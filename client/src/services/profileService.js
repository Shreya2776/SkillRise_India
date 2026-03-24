import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const createProfile = async (data) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);
  const API_URL = API_ENDPOINTS.PROFILE;
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

  });
};