import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import "./AuthLayouts.css";

const AuthLayouts = () => {
  return (
    <div className="auth-container">
      {/* Floating Shapes */}
      <motion.div
        className="floating-shape shape-1"
        animate={{
          y: ["0%", "-20%", "0%"],
          x: ["0%", "10%", "0%"],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0,
        }}
      />
      <motion.div
        className="floating-shape shape-2"
        animate={{
          y: ["0%", "25%", "0%"],
          x: ["0%", "-15%", "0%"],
          rotate: [0, -360],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 5,
        }}
      />
      <motion.div
        className="floating-shape shape-3"
        animate={{
          y: ["0%", "30%", "0%"],
          x: ["0%", "-20%", "0%"],
          rotate: [0, 360],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />
      {/* Render nested auth pages */}
      <Outlet />
    </div>
  );
};

export default AuthLayouts;
