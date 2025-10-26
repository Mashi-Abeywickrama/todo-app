import axios from "axios";
import { API_BASE } from "./baseUrl";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s safety timeout
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize errors
    if (error.response) {
      console.error("API Error:", error.response.data?.message || error.message);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;