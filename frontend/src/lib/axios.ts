import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("weather@token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
