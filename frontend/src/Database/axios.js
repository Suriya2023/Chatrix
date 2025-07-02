import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5005/api", // 🟢 Update this if port/backend is wrong
  withCredentials: true, // ✅ Correct way
});
