// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import MailIcon from "@mui/icons-material/Mail"; // For email input
// import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Consistent icon usage

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false); // Local loading state
//   const [error, setError] = useState(""); //Local Error state

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(""); // Clear previous errors

//     // Simulate sending email (replace with actual API call)
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

//       // Simulate success (replace with actual API response handling)
//       setIsSubmitted(true);
//       // toast.success("Reset link sent if email exists."); // Example success message
//     } catch (err) {
//       //You can use the error message from the backend if available, e.g., error.response.data.message
//       setError("An error occurred. Please try again.");
//       console.error("Forgot Password Error:", err); // Log the error for debugging
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: "450px",
//         width: "100%",
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 450.68%)",
//         backdropFilter: "blur(10px)",
//         borderRadius: "1rem",
//         boxShadow:
//           "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
//         overflow: "hidden",
//         mx: "auto",
//       }}
//     >
//       <Box p={4}>
//         <Typography
//           variant="h4"
//           component="h2"
//           gutterBottom
//           align="center"
//           sx={{
//             fontWeight: "bold",
//             background: "linear-gradient(to right, #fff, #fcfcfc)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             mb: 3,
//           }}
//         >
//           Forgot Password
//         </Typography>

//         {!isSubmitted ? (
//           <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//             <Typography
//               variant="body1"
//               align="center"
//               color="textSecondary"
//               paragraph
//               sx={{ mb: 3, color: "#fff" }}
//             >
//               Enter your email address and we'll send you a link to reset your
//               password.
//             </Typography>

//             <TextField
//               type="email"
//               label="Email Address"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <IconButton disabled>
//                       <MailIcon sx={{ color: "#fcfcfc" }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 style: { color: "white" },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": {
//                     borderColor: "#ffffff",
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "#fe6c00",
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "#fe6c00",
//                     //boxShadow: "0 0 0 2px rgba(34, 197, 94, 1)",
//                   },
//                   "& .MuiInputBase-input": {
//                     color: "#fcfcfc",
//                   },
//                 },
//                 "& .MuiInputLabel-root": {
//                   color: "#fcfcfc",
//                 },
//                 "& .MuiInputLabel-root.Mui-focused": {
//                   color: "#fe6c00",
//                 },
//               }}
//             />
//             {error && ( // Display error message
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 650.68%)",
//                 color: "#fcfcfc",
//                 fontWeight: "bold",
//                 borderRadius: "0.5rem",
//                 boxShadow:
//                   "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//                 "&:hover": {
//                   background: "linear-gradient(to right, #f19b46, #ffc397)",
//                   boxShadow:
//                     "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//                 },
//                 "&:focus": {
//                   outline: "none",
//                   boxShadow:
//                     "0 0 0 2px rgba(255, 255, 255, 1), 0 0 0 4px rgba(156, 163, 175, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 650.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Send Reset Link"
//               )}
//             </Button>
//           </form>
//         ) : (
//           <Box textAlign="center">
//             <Box
//               sx={{
//                 width: "64px", // Example size, adjust as needed
//                 height: "64px",
//                 backgroundColor: "#34d399",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 1rem", // Center horizontally and add margin-bottom
//               }}
//             >
//               <MailIcon sx={{ color: "#fff", fontSize: "32px" }} />
//             </Box>
//             <Typography
//               variant="body1"
//               color="textSecondary"
//               paragraph
//               sx={{ color: "#fff" }}
//             >
//               If an account exists for {email}, you will receive a password
//               reset link shortly.
//             </Typography>
//           </Box>
//         )}
//       </Box>

//       <Box
//         px={4}
//         py={2}
//         bgcolor="#fe6c00"
//         display="flex"
//         justifyContent="center"
//       >
//         <Link
//           to={"/login"}
//           style={{
//             color: "#fcfcfc",
//             textDecoration: "none",
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <ArrowBackIcon sx={{ mr: 1, color: "#fcfcfc" }} />{" "}
//           {/* Use MUI icon */}
//           Back to Login
//         </Link>
//       </Box>
//     </Box>
//   );
// };

// export default ForgotPasswordPage;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux"; // Import useDispatch
import { sendForgotPasswordCodeAsync } from "../../../redux/slices/authSlice";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const dispatch = useDispatch(); // Get dispatch

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage(""); // Clear previous success messages

    try {
      // Dispatch the thunk, and await it!  Important for error handling.
      const resultAction = await dispatch(sendForgotPasswordCodeAsync(email));

      // Check for a successful action *using unwrapResult*:
      if (sendForgotPasswordCodeAsync.fulfilled.match(resultAction)) {
        setIsSubmitted(true);
        setSuccessMessage(
          resultAction.payload.message ||
            "If that email address is in our system, we have sent you a code to reset your password."
        ); // Set success message
        setEmail(""); // Clear email field after successful submission
      } else if (sendForgotPasswordCodeAsync.rejected.match(resultAction)) {
        setError(resultAction.payload.message || "Failed to send reset code.");
      }
    } catch (err) {
      //This catch block is now less likely to be hit, but still important
      setError(err.message || "An unexpected error occurred."); // Set error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "450px",
        width: "100%",
        background:
          "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 450.68%)",
        backdropFilter: "blur(10px)",
        borderRadius: "1rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        mx: "auto",
      }}
    >
      <Box p={4}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(to right, #fff, #fcfcfc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 3,
          }}
        >
          Forgot Password
        </Typography>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Typography
              variant="body1"
              align="center"
              color="textSecondary"
              paragraph
              sx={{ mb: 3, color: "#fff" }}
            >
              Enter your email address and we'll send you a code to reset your
              password.
            </Typography>

            <TextField
              type="email"
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton disabled>
                      <MailIcon sx={{ color: "#fcfcfc" }} />
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: "white" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ffffff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fe6c00",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fe6c00",
                  },
                  "& .MuiInputBase-input": {
                    color: "#fcfcfc",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fcfcfc",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fe6c00",
                },
              }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
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
                  color: "white",
                  background:
                    "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 650.68%)",
                },
                py: 1.5,
                px: 2,
                mt: 2,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        ) : (
          <Box textAlign="center">
            <Box
              sx={{
                width: "64px",
                height: "64px",
                backgroundColor: "#34d399",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <MailIcon sx={{ color: "#fff", fontSize: "32px" }} />
            </Box>
            <Typography
              variant="body1"
              color="textSecondary"
              paragraph
              sx={{ color: "#fff" }}
            >
              {successMessage}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        px={4}
        py={2}
        bgcolor="#fe6c00"
        display="flex"
        justifyContent="center"
      >
        <Link
          to={"/login"}
          style={{
            color: "#fcfcfc",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowBackIcon sx={{ mr: 1, color: "#fcfcfc" }} />
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
