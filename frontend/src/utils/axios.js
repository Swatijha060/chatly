import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://chatly-8w8p.onrender.com",
  withCredentials: false,
});


API.interceptors.request.use((config) => {
  const stored = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = stored?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
