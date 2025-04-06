import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api", // Vite proxy handles the full URL
  withCredentials: true, // If using cookies
});
