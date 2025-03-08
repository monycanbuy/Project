import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordCodeAsync } from "../../../redux/slices/authSlice"; // Ensure this path is correct
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./SendForgotPasswordCode.css";

const SendForgotPasswordCode = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSendingCode, sendCodeMessage, sendCodeError } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const previousSendCodeMessage = useRef(sendCodeMessage);
  const previousSendCodeError = useRef(sendCodeError);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendForgotPasswordCodeAsync(email));
  };
  // In SendForgotPasswordCode component
  useEffect(() => {
    return () => {
      dispatch({ type: "auth/clearSendingCodeFlag" }); // Action to clear isSendingCode
    };
  }, [dispatch]);

  // In VerifyForgotPasswordCode component
  useEffect(() => {
    return () => {
      dispatch({ type: "auth/clearVerifyingCodeFlag" }); // Action to clear isVerifyingCode
    };
  }, [dispatch]);

  // Effect for handling errors and messages from Redux store
  useEffect(() => {
    console.log("sendCodeMessage changed:", sendCodeMessage);
    if (sendCodeError !== previousSendCodeError.current) {
      if (sendCodeError) {
        setError(sendCodeError);
        toast.error(sendCodeError, {
          duration: 5000,
          position: "top-center",
        });
      } else {
        setError(null);
      }
      previousSendCodeError.current = sendCodeError;
    }

    if (
      sendCodeMessage &&
      typeof sendCodeMessage === "object" &&
      sendCodeMessage.message
    ) {
      console.log("Redirecting to verification page...");
      toast.success(sendCodeMessage.message, {
        duration: 5000,
        position: "top-center",
      });
      navigate(
        `/verify-forgot-password-code?email=${encodeURIComponent(email)}`
      );
    }
  }, [sendCodeError, sendCodeMessage, navigate, email]);

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password?</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <button
          type="submit"
          className="send-code-btn"
          disabled={isSendingCode}
        >
          {isSendingCode ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {/* <Toaster /> */}
    </div>
  );
};

export default SendForgotPasswordCode;
