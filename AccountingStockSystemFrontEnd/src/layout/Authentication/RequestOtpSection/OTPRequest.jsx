// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   sendVerificationCode,
//   fetchUserDetails,
//   clearError,
// } from "../../../redux/slices/authSlice";
// import { useNavigate } from "react-router-dom";
// import "./OTPRequest.css";

// const OTPRequest = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoading, error, verificationSuccess } = useSelector(
//     (state) => state.auth
//   );
//   const [email, setEmail] = useState("");
//   const [verificationSent, setVerificationSent] = useState(false);

//   // useEffect(() => {
//   //   if (!isAuthenticated) {
//   //     console.log("User not authenticated, redirecting to login");
//   //     navigate("/login");
//   //   }
//   // }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     let timeout;
//     if (error) {
//       timeout = setTimeout(() => {
//         dispatch(clearError());
//       }, 5000); // Clear after 5 seconds or adjust time as needed
//     }
//     return () => clearTimeout(timeout);
//   }, [dispatch, error]);

//   const handleSendEmail = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(sendVerificationCode(email)).unwrap();
//       setVerificationSent(true);
//       console.log("Verification code sent successfully");
//     } catch (error) {
//       console.error("Failed to send verification code:", error);
//     }
//   };

//   useEffect(() => {
//     if (verificationSent) {
//       const timer = setTimeout(async () => {
//         await dispatch(fetchUserDetails()); // Assuming this action exists
//         navigate("/verify-otp");
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [verificationSent, navigate, dispatch]);

//   useEffect(() => {
//     // Reset verificationSent when navigating back to this component
//     return () => setVerificationSent(false);
//   }, []);

//   return (
//     <div className="otp-container">
//       <div className="login-form">
//         {verificationSent ? (
//           <div>
//             <h2>Verification Sent</h2>
//             <p>
//               Check your email for the verification code. Redirecting in 5
//               seconds...
//             </p>
//           </div>
//         ) : (
//           <>
//             <h2>Request Verification Code</h2>
//             <form onSubmit={handleSendEmail}>
//               <div className="input-group">
//                 <i className="bx bxs-envelope"></i>
//                 <input
//                   type="email"
//                   name="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="login-btn"
//                 disabled={isLoading || !email}
//               >
//                 {isLoading ? "Sending..." : "Send Verification Code"}
//               </button>
//               {error && (
//                 <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
//               )}
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OTPRequest;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendVerificationCode,
  fetchUserDetails,
  clearError,
} from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "./OTPRequest.css";

const OTPRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, verificationSuccess, isAuthenticated } =
    useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  // Check if user is authenticated, if not, redirect to login
  useEffect(() => {}, [isAuthenticated, navigate]);

  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        dispatch(clearError());
      }, 5000); // Clear after 5 seconds or adjust time as needed
    }
    return () => clearTimeout(timeout);
  }, [dispatch, error]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendVerificationCode(email)).unwrap();
      setVerificationSent(true);
      console.log("Verification code sent successfully");
    } catch (error) {
      console.error("Failed to send verification code:", error);
    }
  };

  useEffect(() => {
    if (verificationSent) {
      const timer = setTimeout(async () => {
        await dispatch(fetchUserDetails()); // Assuming this action exists
        navigate("/verify-otp");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [verificationSent, navigate, dispatch]);

  useEffect(() => {
    // Reset verificationSent when navigating back to this component
    return () => setVerificationSent(false);
  }, []);

  return (
    <div className="otp-container">
      <div className="login-form">
        {verificationSent ? (
          <div>
            <h2>Verification Sent</h2>
            <p>
              Check your email for the verification code. Redirecting in 5
              seconds...
            </p>
          </div>
        ) : (
          <>
            <h2>Request Verification Code</h2>
            <form onSubmit={handleSendEmail}>
              <div className="input-group">
                <i className="bx bxs-envelope"></i>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button
                type="submit"
                className="login-btn"
                disabled={isLoading || !email}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPRequest;
