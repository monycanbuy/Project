// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   InputAdornment,
//   IconButton,
//   Alert,
//   CircularProgress, // Import CircularProgress
// } from "@mui/material";
// import MailIcon from "@mui/icons-material/Mail"; // Import Mail icon
// import LockIcon from "@mui/icons-material/Lock"; // Import Lock icon

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     // Simulate an API call (replace with your actual login logic)
//     setTimeout(() => {
//       if (email === "test@example.com" && password === "password") {
//         // Successful login (replace with your actual success handling)
//         // Example: dispatch(loginSuccess(userData));
//         // Example: navigate("/dashboard");
//       } else {
//         setError("Invalid credentials");
//       }
//       setIsLoading(false);
//     }, 2000);
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
//           }}
//         >
//           Welcome Back
//         </Typography>

//         <form onSubmit={handleLogin}>
//           <TextField
//             type="email"
//             label="Email Address"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <IconButton disabled>
//                     <MailIcon sx={{ color: "#fcfcfc" }} /> {/* Use MUI icon */}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//               style: { color: "white" },
//             }}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#ffffff",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#fe6c00",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "#fe6c00",
//                   //boxShadow: "0 0 0 2px rgba(34, 197, 94, 1)",
//                 },
//                 "& .MuiInputBase-input": {
//                   color: "#fcfcfc",
//                 },
//               },
//               "& .MuiInputLabel-root": {
//                 color: "#fcfcfc",
//               },
//               "& .MuiInputLabel-root.Mui-focused": {
//                 color: "#fe6c00",
//               },
//             }}
//           />

//           <TextField
//             type="password"
//             label="Password"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <IconButton disabled>
//                     <LockIcon sx={{ color: "#fcfcfc" }} /> {/* Use MUI icon */}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//               style: { color: "white" },
//             }}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "#ffffff",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "#fe6c00",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "#fe6c00",
//                   //boxShadow: "0 0 0 2px rgba(34, 197, 94, 1)",
//                 },
//                 "& .MuiInputBase-input": {
//                   color: "#fcfcfc",
//                 },
//               },
//               "& .MuiInputLabel-root": {
//                 color: "#fcfcfc",
//               },
//               "& .MuiInputLabel-root.Mui-focused": {
//                 color: "#fe6c00",
//               },
//             }}
//           />

//           <Box display="flex" alignItems="center" mb={3}>
//             <Link
//               to="/forgotpassword"
//               style={{ color: "#fcfcfc", textDecoration: "none" }}
//             >
//               Forgot password?
//             </Link>
//           </Box>

//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error}
//             </Alert>
//           )}

//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             disabled={isLoading}
//             sx={{
//               background:
//                 "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//               color: "#fcfcfc",
//               fontWeight: "bold",
//               borderRadius: "0.5rem",
//               boxShadow:
//                 "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//               "&:hover": {
//                 background: "linear-gradient(to right, #f19b46, #ffc397)",
//                 boxShadow:
//                   "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//               },
//               "&:focus": {
//                 outline: "none",
//                 boxShadow:
//                   "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//               },
//               "&:disabled": {
//                 opacity: 0.7,
//                 cursor: "not-allowed",
//                 color: "white",
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//               },
//               py: 1.5,
//               px: 2,
//               mt: 2,
//             }}
//           >
//             {isLoading ? (
//               <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//             ) : (
//               "Login"
//             )}
//           </Button>
//         </form>
//       </Box>
//       <Box
//         px={4}
//         py={2}
//         bgcolor="#fe6c00"
//         display="flex"
//         justifyContent="center"
//       >
//         <Typography
//           variant="body2"
//           color="textSecondary"
//           style={{ color: "#fcfcfc", textDecoration: "none" }}
//         >
//           Don't have an account?{" "}
//           <Link
//             to="/signup"
//             style={{ color: "#fcfcfc", textDecoration: "none" }}
//           >
//             Sign up
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Login;

// Login.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
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
// import MailIcon from "@mui/icons-material/Mail";
// import LockIcon from "@mui/icons-material/Lock";
// import {
//   loginUser,
//   verifyOTP,
//   clearError,
// } from "../../../redux/slices/authSlice";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const {
//     isLoading,
//     error,
//     needsVerification,
//     verificationMessage,
//     isVerified,
//     isAuthenticated,
//     codeSent,
//   } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     dispatch(loginUser({ email, password }))
//       .unwrap()
//       .then((result) => {
//         if (!result.needsVerification) {
//           navigate("/admin");
//         }
//       })
//       .catch((err) => {
//         console.error("Login failed:", err);
//       });
//   };

//   const handleVerifyOTP = (e) => {
//     e.preventDefault();
//     dispatch(verifyOTP({ email, providedCode: otp }))
//       .unwrap()
//       .then(() => {
//         setTimeout(() => {
//           navigate("/admin");
//         }, 2000);
//       })
//       .catch((err) => {
//         console.error("OTP verification failed:", err);
//       });
//   };

//   const getDisplayError = (rawError) => {
//     if (!rawError) return null;
//     switch (rawError) {
//       case "Unauthorized: No token provided in cookies":
//         return null;
//       case "Failed to login":
//         return "Invalid email or password. Please try again.";
//       case "Failed to verify OTP":
//         return "Invalid verification code. Please check and try again.";
//       default:
//         return "An unexpected error occurred. Please try again later.";
//     }
//   };

//   const displayError = getDisplayError(error);

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
//           }}
//         >
//           Welcome Back
//         </Typography>

//         {displayError && !needsVerification && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {displayError}
//           </Alert>
//         )}
//         {needsVerification && codeSent && !verificationMessage && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Verification code has been sent to your email.
//           </Alert>
//         )}
//         {verificationMessage && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {verificationMessage}
//           </Alert>
//         )}

//         {!needsVerification ? (
//           <form onSubmit={handleLogin}>
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
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <TextField
//               type="password"
//               label="Password"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <IconButton disabled>
//                       <LockIcon sx={{ color: "#fcfcfc" }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 style: { color: "white" },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <Box display="flex" alignItems="center" mb={3}>
//               <Link
//                 to="/forgotpassword"
//                 style={{ color: "#fcfcfc", textDecoration: "none" }}
//               >
//                 Forgot password?
//               </Link>
//             </Box>

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
//                     "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </form>
//         ) : (
//           <form onSubmit={handleVerifyOTP}>
//             <TextField
//               type="text"
//               label="Verification Code"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//               InputProps={{
//                 style: { color: "white" },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
//                     "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Verify OTP"
//               )}
//             </Button>
//           </form>
//         )}
//       </Box>
//       <Box
//         px={4}
//         py={2}
//         bgcolor="#fe6c00"
//         display="flex"
//         justifyContent="center"
//       >
//         <Typography
//           variant="body2"
//           color="textSecondary"
//           style={{ color: "#fcfcfc", textDecoration: "none" }}
//         >
//           Don't have an account?{" "}
//           <Link
//             to="/signup"
//             style={{ color: "#fcfcfc", textDecoration: "none" }}
//           >
//             Sign up
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Login;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
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
// import MailIcon from "@mui/icons-material/Mail";
// import LockIcon from "@mui/icons-material/Lock";
// import {
//   loginUser,
//   verifyOTP,
//   clearError,
// } from "../../../redux/slices/authSlice";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const {
//     isLoading,
//     error,
//     needsVerification,
//     verificationMessage,
//     isVerified,
//     isAuthenticated,
//     codeSent,
//   } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     dispatch(loginUser({ email, password }))
//       .unwrap()
//       .then((result) => {
//         if (!result.needsVerification) {
//           navigate("/admin");
//         }
//       })
//       .catch((err) => {
//         console.error("Login failed:", err);
//       });
//   };

//   const handleVerifyOTP = (e) => {
//     e.preventDefault();
//     dispatch(verifyOTP({ email, providedCode: otp }))
//       .unwrap()
//       .then(() => {
//         setTimeout(() => {
//           navigate("/admin");
//         }, 2000);
//       })
//       .catch((err) => {
//         console.error("OTP verification failed:", err);
//       });
//   };

//   const getDisplayError = (rawError) => {
//     if (!rawError) return null;
//     switch (rawError) {
//       case "Unauthorized: No token provided in cookies":
//         return null;
//       case "Failed to login":
//         return "Invalid email or password. Please try again.";
//       case "Failed to verify OTP":
//         return "Invalid verification code. Please check and try again.";
//       default:
//         return "An unexpected error occurred. Please try again later.";
//     }
//   };

//   const displayError = getDisplayError(error);

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
//           }}
//         >
//           Welcome Back
//         </Typography>

//         {displayError && !needsVerification && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {displayError}
//           </Alert>
//         )}
//         {needsVerification && codeSent && !verificationMessage && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Verification code has been sent to your email.
//           </Alert>
//         )}
//         {verificationMessage && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {verificationMessage}
//           </Alert>
//         )}

//         {!needsVerification ? (
//           <form onSubmit={handleLogin}>
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
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <TextField
//               type="password"
//               label="Password"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <IconButton disabled>
//                       <LockIcon sx={{ color: "#fcfcfc" }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 style: { color: "white" },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <Box display="flex" alignItems="center" mb={3}>
//               <Link
//                 to="/forgotpassword"
//                 style={{ color: "#fcfcfc", textDecoration: "none" }}
//               >
//                 Forgot password?
//               </Link>
//             </Box>

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
//                     "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </form>
//         ) : (
//           <form onSubmit={handleVerifyOTP}>
//             <TextField
//               type="text"
//               label="Verification Code"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//               InputProps={{
//                 style: { color: "white" },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
//                     "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Verify OTP"
//               )}
//             </Button>
//           </form>
//         )}
//       </Box>
//       <Box
//         px={4}
//         py={2}
//         bgcolor="#fe6c00"
//         display="flex"
//         justifyContent="center"
//       >
//         <Typography
//           variant="body2"
//           color="textSecondary"
//           style={{ color: "#fcfcfc", textDecoration: "none" }}
//         >
//           Don't have an account?{" "}
//           <Link
//             to="/signup"
//             style={{ color: "#fcfcfc", textDecoration: "none" }}
//           >
//             Sign up
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Login;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
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
// import MailIcon from "@mui/icons-material/Mail";
// import LockIcon from "@mui/icons-material/Lock";
// import {
//   loginUser,
//   verifyOTP,
//   clearError,
// } from "../../../redux/slices/authSlice";
// import { getAuthorizedRoute } from "../../../utils/authUtils";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const {
//     isLoading,
//     error,
//     needsVerification,
//     verificationMessage,
//     isVerified,
//     isAuthenticated,
//     codeSent,
//     user,
//   } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     dispatch(loginUser({ email, password }))
//       .unwrap()
//       .then((result) => {
//         if (!result.needsVerification) {
//           const route = getAuthorizedRoute(user);
//           navigate(route);
//         }
//       })
//       .catch((err) => {
//         console.error("Login failed:", err);
//       });
//   };

//   const handleVerifyOTP = (e) => {
//     e.preventDefault();
//     dispatch(verifyOTP({ email, providedCode: otp }))
//       .unwrap()
//       .then(() => {
//         const route = getAuthorizedRoute(user);
//         setTimeout(() => {
//           navigate(route);
//         }, 2000);
//       })
//       .catch((err) => {
//         console.error("OTP verification failed:", err);
//       });
//   };

//   const getDisplayError = (rawError) => {
//     if (!rawError) return null;
//     switch (rawError) {
//       case "Unauthorized: No token provided in cookies":
//         return null;
//       case "Failed to login":
//         return "Invalid email or password. Please try again.";
//       case "Failed to verify OTP":
//         return "Invalid verification code. Please check and try again.";
//       default:
//         return "An unexpected error occurred. Please try again later.";
//     }
//   };

//   const displayError = getDisplayError(error);

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
//           }}
//         >
//           Welcome Back
//         </Typography>

//         {displayError && !needsVerification && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {displayError}
//           </Alert>
//         )}
//         {needsVerification && codeSent && !verificationMessage && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Verification code has been sent to your email.
//           </Alert>
//         )}
//         {verificationMessage && (
//           <Alert severity="success" sx={{ mb: 2 }}>
//             {verificationMessage}
//           </Alert>
//         )}

//         {!needsVerification ? (
//           <form onSubmit={handleLogin}>
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
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <TextField
//               type="password"
//               label="Password"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <IconButton disabled>
//                       <LockIcon sx={{ color: "#fcfcfc" }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 style: { color: "white" },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <Box display="flex" alignItems="center" mb={3}>
//               <Link
//                 to="/forgotpassword"
//                 style={{ color: "#fcfcfc", textDecoration: "none" }}
//               >
//                 Forgot password?
//               </Link>
//             </Box>

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
//                     "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </form>
//         ) : (
//           <form onSubmit={handleVerifyOTP}>
//             <TextField
//               type="text"
//               label="Verification Code"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//               InputProps={{
//                 style: { color: "white" },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
//                     "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Verify OTP"
//               )}
//             </Button>
//           </form>
//         )}
//       </Box>
//       <Box
//         px={4}
//         py={2}
//         bgcolor="#fe6c00"
//         display="flex"
//         justifyContent="center"
//       >
//         <Typography
//           variant="body2"
//           color="textSecondary"
//           style={{ color: "#fcfcfc", textDecoration: "none" }}
//         >
//           Don't have an account?{" "}
//           <Link
//             to="/signup"
//             style={{ color: "#fcfcfc", textDecoration: "none" }}
//           >
//             Sign up
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Login;

// Login.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
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
// import MailIcon from "@mui/icons-material/Mail";
// import LockIcon from "@mui/icons-material/Lock";
// import {
//   loginUser,
//   verifyOTP,
//   clearError,
// } from "../../../redux/slices/authSlice";
// import { getAuthorizedRoute } from "../../../utils/authUtils"; // Add this import

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const {
//     isLoading,
//     error,
//     needsVerification,
//     verificationMessage,
//     isVerified,
//     isAuthenticated,
//     codeSent,
//     user,
//   } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Auth State:", {
//       isAuthenticated,
//       isVerified,
//       user,
//       needsVerification,
//       error,
//     });
//     if (isAuthenticated && user && !needsVerification) {
//       const redirectTo = getAuthorizedRoute(user, isAuthenticated);
//       console.log("Redirecting to:", redirectTo);
//       navigate(redirectTo);
//     }
//   }, [isAuthenticated, user, needsVerification, navigate]);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     dispatch(loginUser({ email, password }))
//       .unwrap()
//       .then((result) => {
//         console.log("Login Result:", result);
//       })
//       .catch((err) => {
//         console.error("Login failed:", err);
//       });
//   };

//   const handleVerifyOTP = (e) => {
//     e.preventDefault();
//     dispatch(verifyOTP({ email, providedCode: otp }))
//       .unwrap()
//       .then(() => {
//         console.log("OTP Verified, waiting for redirect...");
//       })
//       .catch((err) => {
//         console.error("OTP verification failed:", err);
//       });
//   };

//   const getDisplayError = (rawError) => {
//     if (!rawError) return null;
//     switch (rawError) {
//       case "Unauthorized: No token provided in cookies":
//         return null;
//       case "Failed to login":
//         return "Invalid email or password. Please try again.";
//       case "Failed to verify OTP":
//         return "Invalid verification code. Please check and try again.";
//       default:
//         return "An unexpected error occurred. Please try again later.";
//     }
//   };

//   const displayError = getDisplayError(error);

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
//           }}
//         >
//           Welcome Back
//         </Typography>

//         {displayError && !needsVerification && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {displayError}
//           </Alert>
//         )}
//         {needsVerification && codeSent && !verificationMessage && (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Verification code has been sent to your email.
//           </Alert>
//         )}

//         {!needsVerification ? (
//           <form onSubmit={handleLogin}>
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
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <TextField
//               type="password"
//               label="Password"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <IconButton disabled>
//                       <LockIcon sx={{ color: "#fcfcfc" }} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//                 style: { color: "white" },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <Box display="flex" alignItems="center" mb={3}>
//               <Link
//                 to="/forgotpassword"
//                 style={{ color: "#fcfcfc", textDecoration: "none" }}
//               >
//                 Forgot password?
//               </Link>
//             </Box>

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
//                     "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </form>
//         ) : (
//           <form onSubmit={handleVerifyOTP}>
//             <TextField
//               type="text"
//               label="Verification Code"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               required
//               InputProps={{ style: { color: "white" } }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": { borderColor: "#ffffff" },
//                   "&:hover fieldset": { borderColor: "#fe6c00" },
//                   "&.Mui-focused fieldset": { borderColor: "#fe6c00" },
//                   "& .MuiInputBase-input": { color: "#fcfcfc" },
//                 },
//                 "& .MuiInputLabel-root": { color: "#fcfcfc" },
//                 "& .MuiInputLabel-root.Mui-focused": { color: "#fe6c00" },
//               }}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 background:
//                   "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
//                     "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
//                 },
//                 "&:disabled": {
//                   opacity: 0.7,
//                   cursor: "not-allowed",
//                   color: "white",
//                   background:
//                     "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//                 },
//                 py: 1.5,
//                 px: 2,
//                 mt: 2,
//               }}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Verify OTP"
//               )}
//             </Button>
//           </form>
//         )}
//       </Box>
//       <Box
//         px={4}
//         py={2}
//         bgcolor="#fe6c00"
//         display="flex"
//         justifyContent="center"
//       >
//         <Typography
//           variant="body2"
//           color="textSecondary"
//           style={{ color: "#fcfcfc", textDecoration: "none" }}
//         >
//           Don't have an account?{" "}
//           <Link
//             to="/signup"
//             style={{ color: "#fcfcfc", textDecoration: "none" }}
//           >
//             Sign up
//           </Link>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default Login;

// Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import {
  loginUser,
  verifyOTP,
  clearError,
} from "../../../redux/slices/authSlice";
import { getAuthorizedRoute } from "../../../utils/authUtils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    needsVerification,
    verificationMessage,
    isVerified,
    isAuthenticated,
    codeSent,
    user,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    console.log("Auth State:", {
      isAuthenticated,
      isVerified,
      user,
      needsVerification,
      error,
    });
    if (isAuthenticated && user && !needsVerification) {
      const redirectTo = getAuthorizedRoute(user, isAuthenticated);
      console.log("Redirecting to:", redirectTo);
      navigate(redirectTo);
    }
  }, [isAuthenticated, user, needsVerification, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((result) => {
        console.log("Login Result:", result);
        // No need to dispatch checkAuthStatus here; loginUser sets state
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    dispatch(verifyOTP({ email, providedCode: otp }))
      .unwrap()
      .then(() => {
        console.log("OTP Verified, waiting for redirect...");
      })
      .catch((err) => {
        console.error("OTP verification failed:", err);
      });
  };

  const getDisplayError = (rawError) => {
    if (!rawError) return null;
    switch (rawError) {
      case "Unauthorized: No token provided in cookies":
        return null;
      case "Failed to login":
        return "Invalid email or password. Please try again.";
      case "Failed to verify OTP":
        return "Invalid verification code. Please check and try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  };

  const displayError = getDisplayError(error);

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
          }}
        >
          Welcome Back
        </Typography>

        {displayError && !needsVerification && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {displayError}
          </Alert>
        )}
        {needsVerification && codeSent && !verificationMessage && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Verification code has been sent to your email.
          </Alert>
        )}

        {!needsVerification ? (
          <form onSubmit={handleLogin}>
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
              label="Password"
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
                style: { color: "white" },
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

            <Box display="flex" alignItems="center" mb={3}>
              <Link
                to="/forgotpassword"
                style={{ color: "#fcfcfc", textDecoration: "none" }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                background:
                  "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
                    "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
                },
                "&:disabled": {
                  opacity: 0.7,
                  cursor: "not-allowed",
                  color: "white",
                  background:
                    "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
                },
                py: 1.5,
                px: 2,
                mt: 2,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <TextField
              type="text"
              label="Verification Code"
              variant="outlined"
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              InputProps={{ style: { color: "white" } }}
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
              disabled={isLoading}
              sx={{
                background:
                  "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
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
                    "0 0 0 2px rgba(34, 197, 94, 1), 0 0 0 4px rgba(55, 65, 81, 1)",
                },
                "&:disabled": {
                  opacity: 0.7,
                  cursor: "not-allowed",
                  color: "white",
                  background:
                    "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
                },
                py: 1.5,
                px: 2,
                mt: 2,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        )}
      </Box>
      <Box
        px={4}
        py={2}
        bgcolor="#fe6c00"
        display="flex"
        justifyContent="center"
      >
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ color: "#fcfcfc", textDecoration: "none" }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ color: "#fcfcfc", textDecoration: "none" }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
