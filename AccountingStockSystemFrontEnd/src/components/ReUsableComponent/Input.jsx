// Input.jsx
import React from "react";
import "./Input.css"; // Import the CSS file

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="input-container">
      <div className="input-icon-wrapper">
        <Icon className="input-icon" />
      </div>
      <input {...props} className="input-field" />
    </div>
  );
};

export default Input;
