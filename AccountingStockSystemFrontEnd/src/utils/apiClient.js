// import axios from "axios";

// export const apiClient = axios.create({
//   baseURL: "/api", // Vite proxy handles the full URL
//   withCredentials: true, // If using cookies
// });

import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://accounting-stock-system-backend.onrender.com/api"
      : "http://localhost:8000/api",
  withCredentials: true, // Keep if using cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for JWT token (if using Bearer auth)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth storage (e.g., Redux)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
