// // vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // export default defineConfig({
// //   plugins: [react()],
// //   resolve: {
// //     mainFields: ["browser", "module", "main"],
// //   },
// //   server: {
// //     // Add this server section
// //     proxy: {
// //       "/api": {
// //         target:
// //           process.env.NODE_ENV === "development"
// //             ? "http://localhost:8000"
// //             : "https://accounting-stock-system-backend.onrender.com",
// //         changeOrigin: true,
// //         // Proxy requests that start with /api
// //         //target: "http://localhost:8000",
// //         //target: "https://accounting-stock-system-backend.onrender.com", //  Your backend server's address and port
// //         //changeOrigin: true, // Important for virtual hosted sites
// //         // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Only if your backend routes *don't* include /api
// //       },
// //     },
// //   },
// // });
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     mainFields: ["browser", "module", "main"],
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target:
//           process.env.NODE_ENV === "development"
//             ? "http://localhost:8000"
//             : "https://accounting-stock-system-backend.onrender.com",
//         changeOrigin: true,
//         secure: process.env.NODE_ENV !== "development",
//         //secure: false, // For dev (http)
//         configure: (proxy, options) => {
//           proxy.on("proxyReq", (proxyReq, req, res) => {
//             proxyReq.setHeader("Origin", "http://localhost:5173");
//           });
//         },
//       },
//     },
//   },
// });

// // export default defineConfig({
// //   plugins: [react()],
// //   resolve: {
// //     mainFields: ["browser", "module", "main"],
// //   },
// //   server: {
// //     proxy: {
// //       "/api": {
// //         target:
// //           process.env.NODE_ENV === "development"
// //             ? "http://localhost:8000"
// //             : "https://accounting-stock-system-backend.onrender.com",
// //         changeOrigin: true,
// //         secure: process.env.NODE_ENV !== "development", // HTTPS in prod, HTTP in dev
// //       },
// //     },
// //   },
// // });

//vite.config.js
// import { defineConfig } from "vite"; // Add this import
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     mainFields: ["browser", "module", "main"],
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target:
//           process.env.NODE_ENV === "development"
//             ? "http://localhost:8000" // Changed from 5000 to 8000
//             : "https://accounting-stock-system-backend.onrender.com",
//         changeOrigin: true,
//         secure: process.env.NODE_ENV !== "development",
//       },
//       "/uploads": {
//         target:
//           process.env.NODE_ENV === "development"
//             ? "http://localhost:8000" // Changed from 5000 to 8000
//             : "https://accounting-stock-system-backend.onrender.com",
//         changeOrigin: true,
//         secure: process.env.NODE_ENV !== "development",
//       },
//     },
//   },
// });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     mainFields: ["browser", "module", "main"],
//   },
//   server: {
//     port: 5173, // Default Vite port
//     proxy: {
//       "/api": {
//         target: "http://localhost:8000", // Backend URL
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix if backend doesn’t expect it
//         secure: false, // For development
//       },
//       "/uploads": {
//         target: "http://localhost:8000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
