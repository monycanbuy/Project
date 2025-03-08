// import React, { useState } from "react";
// // import { useAuthStore } from "../store/authStore"; // Commented out
// import { useNavigate, useParams } from "react-router-dom";
// // import Input from "../components/Input"; // Assuming this is a custom component, keep if needed.  If it's just a styled input, replace.
// // import { Lock } from "lucide-react"; // Replaced with MUI Icon
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   InputAdornment,
//   IconButton,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import LockIcon from "@mui/icons-material/Lock"; // MUI Icon
// // import toast from "react-hot-toast"; // Comment out -  we'll simulate success

// const ResetPasswordPage = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   // const { resetPassword, error, isLoading, message } = useAuthStore(); // Commented out

//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false); // Local loading state
//   const [error, setError] = useState(""); // Local error state
//   const [message, setMessage] = useState(""); // Local success message

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       // alert("Passwords do not match"); // Replace with MUI Alert
//       setError("Passwords do not match."); // Set error state
//       return;
//     }

//     setError(""); // Clear previous errors
//     setIsLoading(true);
//     try {
//       // await resetPassword(token, password); // Commented out, replaced by simulation
//       // toast.success("Password reset successfully, redirecting to login page..."); //Comment out

//       // Simulate API call and success/failure
//       await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

//       // Simulate Success (for design purposes):
//       setMessage("Password reset successfully!");
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (error) {
//       console.error(error);
//       // toast.error(error.message || "Error resetting password"); //Comment out
//       setError(error.message || "Error resetting password"); // Set error to state
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
//           background: "linear-gradient(to right, #fff, #fcfcfc)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           mb: 3,
//         }}
//       >
//         Reset Password
//       </Typography>
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}
//       {message && (
//         <Alert severity="success" sx={{ mb: 2 }}>
//           {message}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//         <TextField
//           type="password"
//           label="New Password"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <IconButton disabled>
//                   <LockIcon sx={{ color: "#fcfcfc" }} />
//                 </IconButton>
//               </InputAdornment>
//             ),
//             style: { color: "#fcfcfc" },
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": {
//                 borderColor: "#ffffff",
//               },
//               "&:hover fieldset": {
//                 borderColor: "#fe6c00",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#fe6c00",
//                 //boxShadow: "0 0 0 2px rgba(34, 197, 94, 1)",
//               },
//               "& .MuiInputBase-input": {
//                 color: "#fcfcfc",
//               },
//             },
//             "& .MuiInputLabel-root": {
//               color: "#fcfcfc",
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#fe6c00",
//             },
//           }}
//         />

//         <TextField
//           type="password"
//           label="Confirm New Password"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <IconButton disabled>
//                   <LockIcon sx={{ color: "#fcfcfc" }} />
//                 </IconButton>
//               </InputAdornment>
//             ),
//             style: { color: "#fcfcfc" },
//           }}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               "& fieldset": {
//                 borderColor: "#ffffff",
//               },
//               "&:hover fieldset": {
//                 borderColor: "#fe6c00",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#fe6c00",
//                 //boxShadow: "0 0 0 2px rgba(34, 197, 94, 1)",
//               },
//               "& .MuiInputBase-input": {
//                 color: "#fcfcfc",
//               },
//             },
//             "& .MuiInputLabel-root": {
//               color: "#fcfcfc",
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#fe6c00",
//             },
//           }}
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           disabled={isLoading}
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
//               color: "white",
//               background:
//                 "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 650.68%)",
//             },
//             py: 1.5,
//             px: 2,
//             mt: 2,
//           }}
//         >
//           {isLoading ? (
//             <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//           ) : (
//             "Set New Password"
//           )}
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default ResetPasswordPage;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { verifyForgotPasswordCodeAsync } from "../../../redux/slices/authSlice";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(""); // For client-side validation

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  // Extract token from URL query params
  const token = new URLSearchParams(search).get("token");

  // Redux state
  const { isVerifyingCode, verificationMessage, verificationError } =
    useSelector((state) => state.auth);

  // Redirect on success
  useEffect(() => {
    if (verificationMessage) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [verificationMessage, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!token) {
      setLocalError("Invalid or missing reset link.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError(""); // Clear local error
    dispatch(verifyForgotPasswordCodeAsync({ token, newPassword: password }));
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
          background: "linear-gradient(to right, #fff, #fcfcfc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        Reset Password
      </Typography>

      {/* Display errors */}
      {localError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError}
        </Alert>
      )}
      {verificationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {verificationError}
        </Alert>
      )}
      {verificationMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {verificationMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          type="password"
          label="New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton disabled>
                  <LockIcon sx={{ color: "#fcfcfc" }} />
                </IconButton>
              </InputAdornment>
            ),
            style: { color: "#fcfcfc" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#ffffff" },
              "&:hover fieldset": { borderColor: "#fe6c00" },
              "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
              "& .MuiInputBase-input": { color: "#fcfcfc" },
            },
            "& .MuiInputLabel-root": { color: "#fcfcfc" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
          }}
        />

        <TextField
          type="password"
          label="Confirm New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton disabled>
                  <LockIcon sx={{ color: "#fcfcfc" }} />
                </IconButton>
              </InputAdornment>
            ),
            style: { color: "#fcfcfc" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#ffffff" },
              "&:hover fieldset": { borderColor: "#fe6c00" },
              "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
              "& .MuiInputBase-input": { color: "#fcfcfc" },
            },
            "& .MuiInputLabel-root": { color: "#fcfcfc" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isVerifyingCode}
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
          {isVerifyingCode ? (
            <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
          ) : (
            "Set New Password"
          )}
        </Button>
      </form>
    </Box>
  );
};

export default ResetPasswordPage;
