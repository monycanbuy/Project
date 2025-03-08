// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  server: {
    // Add this server section
    proxy: {
      "/api": {
        // Proxy requests that start with /api
        target: "https://accounting-stock-system-backend.onrender.com", //  Your backend server's address and port
        changeOrigin: true, // Important for virtual hosted sites
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Only if your backend routes *don't* include /api
      },
    },
  },
});
