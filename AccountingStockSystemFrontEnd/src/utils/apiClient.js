// import axios from "axios";

// export const apiClient = axios.create({
//   baseURL: "/api", // Vite proxy handles the full URL
//   withCredentials: true, // If using cookies
// });

// import axios from "axios";

// export const apiClient = axios.create({
//   baseURL:
//     process.env.NODE_ENV === "production"
//       ? "https://accounting-stock-system-backend.onrender.com/api"
//       : "http://localhost:8000/api",
//   withCredentials: true, // Keep if using cookies for auth
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add interceptor for JWT token (if using Bearer auth)
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // Adjust based on your auth storage (e.g., Redux)
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default apiClient;

import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://accounting-stock-system-backend.onrender.com/api"
      : "http://localhost:8000/api",
  withCredentials: true, // Required for cookies to be sent/received
  headers: {
    "Content-Type": "application/json",
  },
});

// Remove the token interceptor since you're not using Bearer auth via headers
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Optional: Add logging for debugging
apiClient.interceptors.request.use((config) => {
  console.log("Request URL:", config.url);
  console.log("Sending request with cookies enabled");
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
