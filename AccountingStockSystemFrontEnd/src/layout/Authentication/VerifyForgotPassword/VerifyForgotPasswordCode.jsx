import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyForgotPasswordCodeAsync,
  resetAuthState,
} from "../../../redux/slices/authSlice"; // Ensure this path is correct
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyForgotPasswordCode = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isVerifyingCode, verificationMessage, verificationError } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    providedCode: "",
    newPassword: "",
  });

  // Extract email from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setFormData((prevState) => ({
        ...prevState,
        email: decodeURIComponent(emailFromUrl),
      }));
    }
  }, [location]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit form data
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending:", formData); // Debugging log
    dispatch(verifyForgotPasswordCodeAsync(formData));
  };

  // In the component where you navigate from send to verify
  useEffect(() => {
    // When navigating to verify forgot password
    history.pushState(null, null, window.location.pathname);
    window.onpopstate = function (event) {
      history.go(1); // This prevents going back by one step
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  // Handle API responses
  useEffect(() => {
    if (verificationError) {
      toast.error(verificationError.message || verificationError, {
        duration: 5000,
        position: "top-center",
      });
    }
    if (
      verificationMessage &&
      typeof verificationMessage === "object" &&
      verificationMessage.message
    ) {
      // Show success message
      toast.success(verificationMessage.message, {
        duration: 3000,
        position: "top-center",
      });

      // Redirect after showing the toast for 3 seconds
      setTimeout(() => {
        dispatch(resetAuthState()); // Optional: Reset any necessary state
        navigate("/login");
      }, 3000);
    }
  }, [verificationError, verificationMessage, navigate, dispatch]);

  return (
    <div className="verify-password-container">
      <h2>Verify Code and Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            disabled
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            name="providedCode"
            value={formData.providedCode}
            onChange={handleChange}
            placeholder="Verification Code"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            required
          />
        </div>
        <button type="submit" className="verify-btn" disabled={isVerifyingCode}>
          {isVerifyingCode ? "Verifying..." : "Verify and Reset Password"}
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default VerifyForgotPasswordCode;
