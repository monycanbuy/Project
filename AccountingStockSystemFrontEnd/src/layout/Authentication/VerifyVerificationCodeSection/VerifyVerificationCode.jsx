import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, verifyOTP, logout } from "../../../redux/slices/authSlice"; // Assuming you have a logout action
import { useNavigate } from "react-router-dom";
import "./VerifyVerificationCode.css";

const VerifyVerificationCode = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, verificationSuccess, user } = useSelector(
    (state) => state.auth
  );
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [successMessage, setSuccessMessage] = useState("");

  // Use the email from the user state if available
  const email = user?.email || "";

  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        dispatch(clearError());
      }, 5000); // Clear after 5 seconds or adjust time as needed
    }
    return () => clearTimeout(timeout);
  }, [dispatch, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    try {
      await dispatch(
        verifyOTP({ email, providedCode: verificationCode })
      ).unwrap();
      if (verificationSuccess) {
        setSuccessMessage("Verification successful! Redirecting...");

        // Clear all session data
        setTimeout(() => {
          // Clear local storage (tokens and other persisted data)
          localStorage.clear();

          // Dispatch logout action to clear Redux state
          dispatch(logout());

          // Navigate to login page
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      setSuccessMessage("Verification unsuccessful. Please try again.");
    }
  };

  const handleOTPChange = (index, value) => {
    const newOTP = [...otp];
    newOTP[index] = value.slice(0, 1); // Limit to one character
    setOTP(newOTP);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="otp-container">
      <div className="login-form">
        <h2>Verify Your Code</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group otp-group">
            {otp.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                maxLength="1"
                onChange={(e) => handleOTPChange(index, e.target.value)}
                id={`otp-${index}`}
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="login-btn"
            disabled={isLoading || otp.some((val) => val === "") || !email}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
          {successMessage && (
            <p style={{ color: "green", marginTop: "10px" }}>
              {successMessage}
            </p>
          )}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default VerifyVerificationCode;
