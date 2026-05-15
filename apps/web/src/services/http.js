import axios from "axios";
import { AUTH_TOKEN_STORAGE_KEY } from "../utils/auth-storage.js";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  timeout: 10000
});

http.interceptors.request.use((config) => {
  const storedToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);
