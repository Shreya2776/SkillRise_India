import axios from "axios";

const API = axios.create({
 baseURL:"http://localhost:5001/api/analyzer"
});

export const analyzeResume = async(formData)=>{

 const res = await API.post(
  "/analyze",
  formData,
  {
   headers:{
    "Content-Type":"multipart/form-data"
   }
  }
 );

 return res.data;
};