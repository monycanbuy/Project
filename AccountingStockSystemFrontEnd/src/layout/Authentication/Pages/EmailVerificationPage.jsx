// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { verifyOTP } from "../../../redux/slices/authSlice";

// const EmailVerificationPage = () => {
//   const [code, setCode] = useState(["", "", "", "", "", ""]);
//   const inputRefs = useRef([]);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Redux state
//   const { isLoading, error, verificationSuccess, verificationMessage } =
//     useSelector((state) => state.auth);

//   // Get email from navigation state
//   const email = location.state?.email;

//   useEffect(() => {
//     if (!email) {
//       navigate("/login", { replace: true }); // Redirect if no email
//     }
//   }, [email, navigate]);

//   const handleChange = (index, value) => {
//     const newCode = [...code];

//     if (value.length > 1) {
//       const pastedCode = value.slice(0, 6).split("");
//       for (let i = 0; i < 6; i++) {
//         newCode[i] = pastedCode[i] || "";
//       }
//       setCode(newCode);

//       const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
//       const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
//       if (inputRefs.current[focusIndex]) {
//         inputRefs.current[focusIndex].focus();
//       }
//     } else {
//       newCode[index] = value;
//       setCode(newCode);

//       if (value && index < 5 && inputRefs.current[index + 1]) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !code[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const providedCode = code.join("");
//     if (providedCode.length !== 6) return;

//     await dispatch(verifyOTP({ email, providedCode })).unwrap();
//   };

//   // Handle redirect to /admin on success
//   useEffect(() => {
//     if (verificationSuccess) {
//       const timer = setTimeout(() => {
//         navigate("/admin", { replace: true }); // Changed to /admin
//       }, 2000); // 2-second delay
//       return () => clearTimeout(timer); // Cleanup
//     }
//   }, [verificationSuccess, navigate]);

//   // Auto-submit when code is complete
//   useEffect(() => {
//     if (code.every((digit) => digit !== "") && !isLoading) {
//       handleSubmit(new Event("submit"));
//     }
//   }, [code, isLoading]);

//   return (
//     <Box
//       sx={{
//         maxWidth: "450px",
//         width: "100%",
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 150.68%)",
//         backdropFilter: "blur(10px)",
//         borderRadius: "1rem",
//         boxShadow:
//           "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
//         overflow: "hidden",
//         mx: "auto",
//         p: 4,
//       }}
//     >
//       <Typography
//         variant="h4"
//         component="h2"
//         gutterBottom
//         align="center"
//         sx={{
//           fontWeight: "bold",
//           background: "linear-gradient(to right, #f37c06, #fcfcfc)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           mb: 3,
//         }}
//       >
//         Verify Your Email
//       </Typography>
//       <Typography
//         variant="body1"
//         align="center"
//         color="textSecondary"
//         paragraph
//         sx={{ color: "#fff" }}
//       >
//         Enter the 6-digit code sent to your email address.
//       </Typography>

//       <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//         <Box display="flex" justifyContent="space-between" my={3} gap={1}>
//           {code.map((digit, index) => (
//             <TextField
//               key={index}
//               inputRef={(el) => (inputRefs.current[index] = el)}
//               type="text"
//               inputMode="numeric"
//               pattern="[0-9]*"
//               maxLength="1"
//               value={digit}
//               onChange={(e) => {
//                 if (/^[0-9]*$/.test(e.target.value)) {
//                   handleChange(index, e.target.value);
//                 }
//               }}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               variant="outlined"
//               InputProps={{
//                 sx: {
//                   width: "48px",
//                   height: "48px",
//                   padding: 0,
//                   background: "rgba(255, 255, 255, 0.1)", // Slight background for cube effect
//                   "& .MuiInputBase-input": {
//                     textAlign: "center",
//                     fontSize: "1.5rem",
//                     fontWeight: "bold",
//                     color: "#fff",
//                     padding: 0,
//                     height: "48px",
//                     lineHeight: "48px",
//                     borderRadius: "0.5rem",
//                   },
//                 },
//               }}
//               sx={{
//                 width: "48px",
//                 height: "48px",
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": {
//                     borderColor: "rgba(255, 255, 255, 0.5)",
//                     borderWidth: "2px",
//                     borderRadius: "0.5rem",
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "#fe6c00",
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "#fe6c00",
//                     boxShadow: "0 0 0 2px rgba(254, 108, 0, 0.5)",
//                   },
//                 },
//               }}
//             />
//           ))}
//         </Box>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {verificationSuccess && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {verificationMessage || "Your account has been verified!"}
//           </Alert>
//         )}

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           disabled={isLoading || code.some((digit) => !digit)}
//           sx={{
//             background:
//               "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 650.68%)",
//             color: "#fcfcfc",
//             fontWeight: "bold",
//             borderRadius: "0.5rem",
//             boxShadow:
//               "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//             "&:hover": {
//               background: "linear-gradient(to right, #f19b46, #ffc397)",
//               boxShadow:
//                 "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//             },
//             "&:focus": {
//               outline: "none",
//               boxShadow:
//                 "0 0 0 2px rgba(255, 255, 255, 1), 0 0 0 4px rgba(156, 163, 175, 1)",
//             },
//             "&:disabled": {
//               opacity: 0.7,
//               cursor: "not-allowed",
//             },
//             py: 1.5,
//             px: 2,
//             mt: 2,
//           }}
//         >
//           {isLoading ? (
//             <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//           ) : (
//             "Verify Email"
//           )}
//         </Button>
//       </form>
//       <Box px={4} py={2} display="flex" justifyContent="center">
//         <Typography
//           variant="body2"
//           color="textSecondary"
//           style={{ color: "#fcfcfc", textDecoration: "none" }}
//         >
//           Didn't receive a code?{" "}
//           <Link
//             to="/login"
//             style={{ color: "#fcfcfc", textDecoration: "none" }}
//           >
//             Resend
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default EmailVerificationPage;

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../../../redux/slices/authSlice";
import { motion } from "framer-motion"; // Optional: for animations

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoading, error, verificationSuccess, verificationMessage } =
    useSelector((state) => state.auth);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const providedCode = code.join("");
    if (providedCode.length !== 6) return;

    await dispatch(verifyOTP({ email, providedCode })).unwrap();
  };

  useEffect(() => {
    if (verificationSuccess) {
      const timer = setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verificationSuccess, navigate]);

  useEffect(() => {
    if (code.every((digit) => digit !== "") && !isLoading) {
      handleSubmit(new Event("submit"));
    }
  }, [code, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }} // Optional: subtle entrance animation
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          maxWidth: "450px",
          width: "100%",
          background:
            "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 150.68%)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          mx: "auto",
          p: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(to right, #f37c06, #fcfcfc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
          }}
        >
          Verify Your Email
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          paragraph
          sx={{ color: "#fff" }}
        >
          Enter the 6-digit code sent to your email address.
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box display="flex" justifyContent="space-between" my={3} gap={1}>
            {code.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => {
                  if (/^[0-9]*$/.test(e.target.value)) {
                    handleChange(index, e.target.value);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(index, e)}
                variant="outlined"
                InputProps={{
                  sx: {
                    width: "48px",
                    height: "48px",
                    padding: 0,
                    background: "rgba(66, 59, 55, 0.8)", // Darker cube background
                    boxShadow:
                      "2px 2px 4px rgba(0, 0, 0, 0.4), -2px -2px 4px rgba(255, 255, 255, 0.1)", // 3D cube effect
                    borderRadius: "8px", // Slightly sharper than 0.5rem
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#fff",
                      padding: 0,
                      height: "48px",
                      lineHeight: "48px",
                    },
                  },
                }}
                sx={{
                  width: "48px",
                  height: "48px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "2px solid rgba(255, 255, 255, 0.5)",
                      borderRadius: "8px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fe6c00",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fe6c00",
                      boxShadow: "0 0 0 2px rgba(254, 108, 0, 0.5)",
                    },
                  },
                  "&:hover": {
                    transform: "translateY(-2px)", // Lift effect like a cube
                    transition: "transform 0.2s ease",
                  },
                }}
              />
            ))}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {verificationSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {verificationMessage || "Your account has been verified!"}
            </Alert>
          )}

          <motion.div
            whileHover={{ scale: 1.05 }} // Optional: button hover effect
            whileTap={{ scale: 0.95 }} // Optional: button tap effect
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || code.some((digit) => !digit)}
              sx={{
                background:
                  "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 650.68%)",
                color: "#fcfcfc",
                fontWeight: "bold",
                borderRadius: "0.5rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                "&:hover": {
                  background: "linear-gradient(to right, #f19b46, #ffc397)",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                },
                "&:focus": {
                  outline: "none",
                  boxShadow:
                    "0 0 0 2px rgba(255, 255, 255, 1), 0 0 0 4px rgba(156, 163, 175, 1)",
                },
                "&:disabled": {
                  opacity: 0.7,
                  cursor: "not-allowed",
                },
                py: 1.5,
                px: 2,
                mt: 2,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
              ) : (
                "Verify Email"
              )}
            </Button>
          </motion.div>
        </form>

        <Box px={4} py={2} display="flex" justifyContent="center">
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ color: "#fcfcfc", textDecoration: "none" }}
          >
            Didn't receive a code?{" "}
            <Link
              to="/login"
              style={{ color: "#fcfcfc", textDecoration: "none" }}
            >
              Resend
            </Link>
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default EmailVerificationPage;
