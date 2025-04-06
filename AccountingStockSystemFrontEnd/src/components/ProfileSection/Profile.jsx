// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import {
//   logout,
//   fetchUserDetails,
//   getCurrentlyLoggedInUsers,
// } from "../../redux/slices/authSlice";
// import { CircularProgress } from "@mui/material";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, isAuthenticated, currentlyLoggedInUsers, isLoading, error } =
//     useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login");
//     } else {
//       // Fetch latest user details and currently logged-in users
//       dispatch(fetchUserDetails());
//       dispatch(getCurrentlyLoggedInUsers());
//     }
//   }, [isAuthenticated, dispatch, navigate]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   if (!user || isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           background:
//             "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//         }}
//       >
//         <CircularProgress color="#fe6c00" size={60} />
//       </Box>
//     );
//   }

//   if (error) {
//     return <Typography>Error: {error}</Typography>;
//   }

//   const formatDate = (date) => {
//     return date
//       ? new Date(date).toLocaleString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "Never";
//   };

//   const loginHistory = Array.isArray(user.loginHistory)
//     ? user.loginHistory
//     : [];

//   return (
//     <Box
//       sx={{
//         maxWidth: 1000,
//         width: "100%",
//         mx: "auto",
//         mt: 4,
//         p: 4,
//         //bgcolor: "rgba(71, 59, 51, 0.8)",
//         borderRadius: "16px",
//         boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
//         border: "1px solid rgba(71, 59, 51, 0.8)",
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography
//         variant="h4"
//         sx={{
//           fontWeight: 700,
//           mb: 4,
//           textAlign: "center",
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         Profile
//       </Typography>

//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Profile Information
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Name:</strong> {user.fullName || "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Email:</strong> {user.email || "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Phone:</strong> {user.phoneNumber || "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Roles:</strong>{" "}
//             {user.roles?.map((role) => role.name || role).join(", ") || "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Status:</strong> {user.status || "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
//           </Typography>
//         </CardContent>
//       </Card>

//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Account Activity
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Joined:</strong> {formatDate(user.createdAt)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Login:</strong> {formatDate(user.lastLogin)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Currently Logged-In Users:</strong> {currentlyLoggedInUsers}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf", mt: 2 }}>
//             <strong>Recent Logins:</strong>
//           </Typography>
//           <List dense sx={{ color: "#d9cfcf" }}>
//             {loginHistory.length > 0 ? (
//               loginHistory.slice(0, 3).map((login, index) => (
//                 <ListItem key={index}>
//                   <ListItemText
//                     primary={formatDate(login.timestamp)}
//                     secondary={`IP: ${login.ip || "Unknown"} | Device: ${
//                       login.device || "Unknown"
//                     }`}
//                     secondaryTypographyProps={{ sx: { color: "#808191" } }}
//                   />
//                 </ListItem>
//               ))
//             ) : (
//               <ListItem>
//                 <ListItemText primary="No login history available" />
//               </ListItem>
//             )}
//           </List>
//         </CardContent>
//       </Card>

//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Work Metrics
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Tasks Completed:</strong>{" "}
//             {user.workMetrics?.tasksCompleted ?? "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Sales Generated:</strong> ₦
//             {user.workMetrics?.salesGenerated
//               ? user.workMetrics.salesGenerated.toLocaleString("en-NG", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : "0.00"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Work Ratio:</strong>{" "}
//             {user.workMetrics?.tasksCompleted > 0
//               ? (
//                   user.workMetrics.salesGenerated /
//                   user.workMetrics.tasksCompleted
//                 ).toFixed(2)
//               : "N/A"}{" "}
//             (Sales per Task)
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Updated:</strong>{" "}
//             {formatDate(user.workMetrics?.lastUpdated)}
//           </Typography>
//         </CardContent>
//       </Card>

//       <Button
//         variant="contained"
//         fullWidth
//         onClick={handleLogout}
//         sx={{
//           py: 2,
//           bgcolor: "linear-gradient(to right, #fe6c00, #fea767)",
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           color: "#fff",
//           fontWeight: "bold",
//           borderRadius: "8px",
//           boxShadow: "0 4px 16px rgba(254, 108, 0, 0.5)",
//           "&:hover": {
//             background: "linear-gradient(to right, #ff8c00, #ffbc80)",
//             boxShadow: "0 6px 20px rgba(254, 108, 0, 0.7)",
//           },
//           "&:focus": {
//             outline: "none",
//             ring: "2px solid #fe6c00",
//             ringOffset: "2px",
//             ringOffsetColor: "rgba(33, 33, 33, 0.8)",
//           },
//         }}
//       >
//         Logout
//       </Button>
//     </Box>
//   );
// };

// export default Profile;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import {
//   logout,
//   fetchUserDetails,
//   getCurrentlyLoggedInUsers,
// } from "../../redux/slices/authSlice";
// import { CircularProgress, Avatar } from "@mui/material";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, isAuthenticated, currentlyLoggedInUsers, isLoading, error } =
//     useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login");
//     } else {
//       dispatch(fetchUserDetails());
//       dispatch(getCurrentlyLoggedInUsers());
//     }
//   }, [isAuthenticated, dispatch, navigate]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   if (!user || isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           background:
//             "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//         }}
//       >
//         <CircularProgress color="#fe6c00" size={60} />
//       </Box>
//     );
//   }

//   if (error) {
//     return <Typography>Error: {error}</Typography>;
//   }

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "Never";

//   const loginHistory = Array.isArray(user.loginHistory)
//     ? user.loginHistory
//     : [];

//   return (
//     <Box
//       sx={{
//         maxWidth: 1000,
//         width: "100%",
//         mx: "auto",
//         mt: 4,
//         p: 4,
//         borderRadius: "16px",
//         boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
//         border: "1px solid rgba(71, 59, 51, 0.8)",
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography
//         variant="h4"
//         sx={{
//           fontWeight: 700,
//           mb: 4,
//           textAlign: "center",
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         Profile
//       </Typography>

//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Profile Information
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               gap: 2,
//             }}
//           >
//             {/* Left Side: Profile Details */}
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Name:</strong> {user.fullName || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Email:</strong> {user.email || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Phone:</strong> {user.phoneNumber || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Roles:</strong>{" "}
//                 {user.roles?.map((role) => role.name || role).join(", ") ||
//                   "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Status:</strong> {user.status || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
//               </Typography>
//             </Box>

//             {/* Right Side: Profile Image Upload */}
//             <Box
//               sx={{
//                 flex: 1,
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: "100%",
//                   maxWidth: 200,
//                   height: 200,
//                   bgcolor: "rgba(66, 66, 66, 0.3)",
//                   borderRadius: "12px",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   border: "2px dashed #fe6c00",
//                   cursor: "pointer",
//                   "&:hover": {
//                     bgcolor: "rgba(66, 66, 66, 0.5)",
//                     borderColor: "#fea767",
//                   },
//                 }}
//                 onClick={() => console.log("Image upload clicked")} // Placeholder for upload logic
//               >
//                 <Avatar
//                   sx={{
//                     width: 80,
//                     height: 80,
//                     mb: 1,
//                     bgcolor: "#fe6c00",
//                   }}
//                   src={user.profileImage || undefined} // Use profileImage if available
//                 >
//                   {!user.profileImage && (user.fullName?.[0] || "U")}
//                 </Avatar>
//                 <Typography sx={{ color: "#d9cfcf", fontSize: "0.9rem" }}>
//                   Click to Upload Image
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Account Activity Card */}
//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Account Activity
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Joined:</strong> {formatDate(user.createdAt)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Login:</strong> {formatDate(user.lastLogin)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Currently Logged-In Users:</strong> {currentlyLoggedInUsers}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf", mt: 2 }}>
//             <strong>Recent Logins:</strong>
//           </Typography>
//           <List dense sx={{ color: "#d9cfcf" }}>
//             {loginHistory.length > 0 ? (
//               loginHistory.slice(0, 3).map((login, index) => (
//                 <ListItem key={index}>
//                   <ListItemText
//                     primary={formatDate(login.timestamp)}
//                     secondary={`IP: ${login.ip || "Unknown"} | Device: ${
//                       login.device || "Unknown"
//                     }`}
//                     secondaryTypographyProps={{ sx: { color: "#808191" } }}
//                   />
//                 </ListItem>
//               ))
//             ) : (
//               <ListItem>
//                 <ListItemText primary="No login history available" />
//               </ListItem>
//             )}
//           </List>
//         </CardContent>
//       </Card>

//       {/* Work Metrics Card */}
//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Work Metrics
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Tasks Completed:</strong>{" "}
//             {user.workMetrics?.tasksCompleted ?? "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Sales Generated:</strong> ₦
//             {user.workMetrics?.salesGenerated
//               ? user.workMetrics.salesGenerated.toLocaleString("en-NG", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : "0.00"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Work Ratio:</strong>{" "}
//             {user.workMetrics?.tasksCompleted > 0
//               ? (
//                   user.workMetrics.salesGenerated /
//                   user.workMetrics.tasksCompleted
//                 ).toFixed(2)
//               : "N/A"}{" "}
//             (Sales per Task)
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Updated:</strong>{" "}
//             {formatDate(user.workMetrics?.lastUpdated)}
//           </Typography>
//         </CardContent>
//       </Card>

//       <Button
//         variant="contained"
//         fullWidth
//         onClick={handleLogout}
//         sx={{
//           py: 2,
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           color: "#fff",
//           fontWeight: "bold",
//           borderRadius: "8px",
//           boxShadow: "0 4px 16px rgba(254, 108, 0, 0.5)",
//           "&:hover": {
//             background: "linear-gradient(to right, #ff8c00, #ffbc80)",
//             boxShadow: "0 6px 20px rgba(254, 108, 0, 0.7)",
//           },
//         }}
//       >
//         Logout
//       </Button>
//     </Box>
//   );
// };

// export default Profile;

// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import {
//   logout,
//   fetchUserDetails,
//   getCurrentlyLoggedInUsers,
//   uploadProfileImage, // Correct thunk
// } from "../../redux/slices/authSlice";
// import { CircularProgress, Avatar } from "@mui/material";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const {
//     user,
//     isAuthenticated,
//     currentlyLoggedInUsers,
//     isLoading,
//     isImageUploading,
//     imageUploadError,
//   } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login");
//     } else {
//       dispatch(fetchUserDetails());
//       dispatch(getCurrentlyLoggedInUsers());
//     }
//   }, [isAuthenticated, dispatch, navigate]);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/login");
//   };

//   const handleImageClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const maxSize = 2 * 1024 * 1024; // 2MB in bytes
//     if (file.size > maxSize) {
//       alert("File size exceeds 2MB. Please select a smaller image.");
//       event.target.value = null; // Reset input
//       return;
//     }

//     dispatch(uploadProfileImage(file))
//       .unwrap()
//       .then(() => {
//         console.log("Image uploaded successfully");
//       })
//       .catch((err) => {
//         alert(`Upload failed: ${err.message}`);
//       });
//   };

//   if (!user || isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           background:
//             "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//         }}
//       >
//         <CircularProgress color="#fe6c00" size={60} />
//       </Box>
//     );
//   }

//   if (imageUploadError) {
//     return <Typography>Error: {imageUploadError}</Typography>;
//   }

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "Never";

//   const loginHistory = Array.isArray(user.loginHistory)
//     ? user.loginHistory
//     : [];

//   const getProfileImageUrl = () => {
//     const baseURL = "http://localhost:8000"; // Adjust as per your backend
//     return user.profileImage
//       ? `${baseURL}${user.profileImage}?v=${Date.now()}`
//       : undefined;
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 1000,
//         width: "100%",
//         mx: "auto",
//         mt: 4,
//         p: 4,
//         borderRadius: "16px",
//         boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
//         border: "1px solid rgba(71, 59, 51, 0.8)",
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography
//         variant="h4"
//         sx={{
//           fontWeight: 700,
//           mb: 4,
//           textAlign: "center",
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         Profile
//       </Typography>

//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Profile Information
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               gap: 2,
//             }}
//           >
//             {/* Left Side: Profile Details */}
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Name:</strong> {user.fullName || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Email:</strong> {user.email || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Phone:</strong> {user.phoneNumber || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Roles:</strong>{" "}
//                 {user.roles?.map((role) => role.name || role).join(", ") ||
//                   "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Status:</strong> {user.status || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
//               </Typography>
//             </Box>

//             {/* Right Side: Profile Image Upload */}
//             <Box
//               sx={{
//                 flex: 1,
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: "100%",
//                   maxWidth: 200,
//                   height: 200,
//                   bgcolor: "rgba(66, 66, 66, 0.3)",
//                   borderRadius: "12px",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   border: "2px dashed #fe6c00",
//                   cursor: "pointer",
//                   "&:hover": {
//                     bgcolor: "rgba(66, 66, 66, 0.5)",
//                     borderColor: "#fea767",
//                   },
//                   position: "relative",
//                 }}
//                 onClick={handleImageClick}
//               >
//                 {isImageUploading ? (
//                   <CircularProgress color="#fe6c00" size={40} />
//                 ) : (
//                   <>
//                     <Avatar
//                       sx={{
//                         width: 80,
//                         height: 80,
//                         mb: 1,
//                         bgcolor: "#fe6c00",
//                       }}
//                       src={getProfileImageUrl()}
//                     >
//                       {!user.profileImage && (user.fullName?.[0] || "U")}
//                     </Avatar>
//                     <Typography sx={{ color: "#d9cfcf", fontSize: "0.9rem" }}>
//                       Click to Upload Image (Max 2MB)
//                     </Typography>
//                   </>
//                 )}
//               </Box>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept="image/jpeg,image/jpg,image/png"
//                 style={{ display: "none" }}
//                 onChange={handleImageChange}
//               />
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Account Activity Card */}
//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Account Activity
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Joined:</strong> {formatDate(user.createdAt)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Login:</strong> {formatDate(user.lastLogin)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Currently Logged-In Users:</strong> {currentlyLoggedInUsers}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf", mt: 2 }}>
//             <strong>Recent Logins:</strong>
//           </Typography>
//           <List dense sx={{ color: "#d9cfcf" }}>
//             {loginHistory.length > 0 ? (
//               loginHistory.slice(0, 3).map((login, index) => (
//                 <ListItem key={index}>
//                   <ListItemText
//                     primary={formatDate(login.timestamp)}
//                     secondary={`IP: ${login.ip || "Unknown"} | Device: ${
//                       login.device || "Unknown"
//                     }`}
//                     secondaryTypographyProps={{ sx: { color: "#808191" } }}
//                   />
//                 </ListItem>
//               ))
//             ) : (
//               <ListItem>
//                 <ListItemText primary="No login history available" />
//               </ListItem>
//             )}
//           </List>
//         </CardContent>
//       </Card>

//       {/* Work Metrics Card */}
//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Work Metrics
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Tasks Completed:</strong>{" "}
//             {user.workMetrics?.tasksCompleted ?? "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Sales Generated:</strong> ₦
//             {user.workMetrics?.salesGenerated
//               ? user.workMetrics.salesGenerated.toLocaleString("en-NG", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : "0.00"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Work Ratio:</strong>{" "}
//             {user.workMetrics?.tasksCompleted > 0
//               ? (
//                   user.workMetrics.salesGenerated /
//                   user.workMetrics.tasksCompleted
//                 ).toFixed(2)
//               : "N/A"}{" "}
//             (Sales per Task)
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Updated:</strong>{" "}
//             {formatDate(user.workMetrics?.lastUpdated)}
//           </Typography>
//         </CardContent>
//       </Card>

//       <Button
//         variant="contained"
//         fullWidth
//         onClick={handleLogout}
//         sx={{
//           py: 2,
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           color: "#fff",
//           fontWeight: "bold",
//           borderRadius: "8px",
//           boxShadow: "0 4px 16px rgba(254, 108, 0, 0.5)",
//           "&:hover": {
//             background: "linear-gradient(to right, #ff8c00, #ffbc80)",
//             boxShadow: "0 6px 20px rgba(254, 108, 0, 0.7)",
//           },
//         }}
//       >
//         Logout
//       </Button>
//     </Box>
//   );
// };

// export default Profile;

// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import {
//   logoutUser,
//   fetchUserDetails,
//   getCurrentlyLoggedInUsers,
//   uploadProfileImage,
// } from "../../redux/slices/authSlice";
// import { CircularProgress, Avatar } from "@mui/material";
// import { persistor } from "../../redux/store";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const {
//     user,
//     isAuthenticated,
//     currentlyLoggedInUsers,
//     isLoading,
//     isImageUploading,
//     imageUploadError,
//   } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login");
//     } else {
//       dispatch(fetchUserDetails())
//         .unwrap()
//         .then((data) => console.log("Fetched user details:", data))
//         .catch((err) => console.error("Fetch user details failed:", err));
//       dispatch(getCurrentlyLoggedInUsers());
//     }
//   }, [isAuthenticated, dispatch, navigate]);

//   // const handleLogout = () => {
//   //   dispatch(logout());
//   //   navigate("/login");
//   // };
//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutUser()).unwrap();
//       console.log("Logout successful");
//       await persistor.purge(); // Purge persisted state
//       console.log("Persisted state purged");
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//       await persistor.purge(); // Purge even if API fails
//       navigate("/login"); // Navigate regardless
//     }
//   };

//   const handleImageClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const maxSize = 2 * 1024 * 1024; // 2MB
//     if (file.size > maxSize) {
//       alert("File size exceeds 2MB. Please select a smaller image.");
//       event.target.value = null;
//       return;
//     }

//     dispatch(uploadProfileImage(file))
//       .unwrap()
//       .then((data) => {
//         console.log("Image uploaded successfully:", data);
//         dispatch(fetchUserDetails()); // Refresh user data after upload
//       })
//       .catch((err) => {
//         alert(`Upload failed: ${err.message}`);
//       });
//   };

//   if (!user || isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           background:
//             "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//         }}
//       >
//         <CircularProgress color="#fe6c00" size={60} />
//       </Box>
//     );
//   }

//   if (imageUploadError) {
//     return <Typography>Error: {imageUploadError}</Typography>;
//   }

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "Never";

//   const loginHistory = Array.isArray(user.loginHistory)
//     ? user.loginHistory
//     : [];

//   const getProfileImageUrl = () => {
//     const url = user?.profileImage
//       ? `${user.profileImage}?v=${Date.now()}`
//       : undefined;
//     console.log("Profile image URL:", url); // Debug log
//     return url;
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 1000,
//         width: "100%",
//         mx: "auto",
//         mt: 4,
//         p: 4,
//         borderRadius: "16px",
//         boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
//         border: "1px solid rgba(71, 59, 51, 0.8)",
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography
//         variant="h4"
//         sx={{
//           fontWeight: 700,
//           mb: 4,
//           textAlign: "center",
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         Profile
//       </Typography>

//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Profile Information
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               gap: 2,
//             }}
//           >
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Name:</strong> {user.fullName || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Email:</strong> {user.email || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Phone:</strong> {user.phoneNumber || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Roles:</strong>{" "}
//                 {user.roles?.map((role) => role.name || role).join(", ") ||
//                   "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Status:</strong> {user.status || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 flex: 1,
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: "100%",
//                   maxWidth: 200,
//                   height: 200,
//                   bgcolor: "rgba(66, 66, 66, 0.3)",
//                   borderRadius: "12px",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   border: "2px dashed #fe6c00",
//                   cursor: "pointer",
//                   "&:hover": {
//                     bgcolor: "rgba(66, 66, 66, 0.5)",
//                     borderColor: "#fea767",
//                   },
//                   position: "relative",
//                 }}
//                 onClick={handleImageClick}
//               >
//                 {isImageUploading ? (
//                   <CircularProgress color="#fe6c00" size={40} />
//                 ) : (
//                   <>
//                     <Avatar
//                       sx={{ width: 80, height: 80, mb: 1, bgcolor: "#fe6c00" }}
//                       src={getProfileImageUrl()}
//                       onError={(e) => {
//                         console.error("Image load error:", e.target.src);
//                         e.target.src = ""; // Fallback to initial
//                       }}
//                     >
//                       {!user.profileImage && (user.fullName?.[0] || "U")}
//                     </Avatar>
//                     <Typography sx={{ color: "#d9cfcf", fontSize: "0.9rem" }}>
//                       Click to Upload Image (Max 2MB)
//                     </Typography>
//                   </>
//                 )}
//               </Box>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept="image/jpeg,image/jpg,image/png"
//                 style={{ display: "none" }}
//                 onChange={handleImageChange}
//               />
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Account Activity Card */}
//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Account Activity
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Joined:</strong> {formatDate(user.createdAt)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Login:</strong> {formatDate(user.lastLogin)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Currently Logged-In Users:</strong> {currentlyLoggedInUsers}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf", mt: 2 }}>
//             <strong>Recent Logins:</strong>
//           </Typography>
//           <List dense sx={{ color: "#d9cfcf" }}>
//             {loginHistory.length > 0 ? (
//               loginHistory.slice(0, 3).map((login, index) => (
//                 <ListItem key={index}>
//                   <ListItemText
//                     primary={formatDate(login.timestamp)}
//                     secondary={`IP: ${login.ip || "Unknown"} | Device: ${
//                       login.device || "Unknown"
//                     }`}
//                     secondaryTypographyProps={{ sx: { color: "#ffc397" } }}
//                   />
//                 </ListItem>
//               ))
//             ) : (
//               <ListItem>
//                 <ListItemText primary="No login history available" />
//               </ListItem>
//             )}
//           </List>
//         </CardContent>
//       </Card>

//       {/* Work Metrics Card */}
//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Work Metrics
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Tasks Completed:</strong>{" "}
//             {user.workMetrics?.tasksCompleted ?? "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Sales Generated:</strong> ₦
//             {user.workMetrics?.salesGenerated
//               ? user.workMetrics.salesGenerated.toLocaleString("en-NG", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : "0.00"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Work Ratio:</strong>{" "}
//             {user.workMetrics?.tasksCompleted > 0
//               ? (
//                   user.workMetrics.salesGenerated /
//                   user.workMetrics.tasksCompleted
//                 ).toFixed(2)
//               : "N/A"}{" "}
//             (Sales per Task)
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Updated:</strong>{" "}
//             {formatDate(user.workMetrics?.lastUpdated)}
//           </Typography>
//         </CardContent>
//       </Card>

//       <Button
//         variant="contained"
//         fullWidth
//         onClick={handleLogout}
//         sx={{
//           py: 2,
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           color: "#fff",
//           fontWeight: "bold",
//           borderRadius: "8px",
//           boxShadow: "0 4px 16px rgba(254, 108, 0, 0.5)",
//           "&:hover": {
//             background: "linear-gradient(to right, #ff8c00, #ffbc80)",
//             boxShadow: "0 6px 20px rgba(254, 108, 0, 0.7)",
//           },
//         }}
//       >
//         Logout
//       </Button>
//     </Box>
//   );
// };

// export default Profile;

// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Divider from "@mui/material/Divider";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import Snackbar from "@mui/material/Snackbar"; // For toast
// import Alert from "@mui/material/Alert"; // For toast content
// import { Toaster, toast } from "react-hot-toast";
// import {
//   logoutUser,
//   fetchUserDetails,
//   getCurrentlyLoggedInUsers,
//   uploadProfileImage,
// } from "../../redux/slices/authSlice";
// import { CircularProgress, Avatar } from "@mui/material";
// import { persistor } from "../../redux/store";

// const Profile = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const {
//     user,
//     isAuthenticated,
//     currentlyLoggedInUsers,
//     isLoading,
//     isImageUploading,
//     imageUploadError,
//   } = useSelector((state) => state.auth);

//   // State for toast
//   const [openToast, setOpenToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastSeverity, setToastSeverity] = useState("success"); // success or error

//   // State for logout loading
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login");
//     } else {
//       dispatch(fetchUserDetails())
//         .unwrap()
//         .then((data) => console.log("Fetched user details:", data))
//         .catch((err) => console.error("Fetch user details failed:", err));
//       dispatch(getCurrentlyLoggedInUsers());
//     }
//   }, [isAuthenticated, dispatch, navigate]);

//   const handleLogout = async () => {
//     setIsLoggingOut(true); // Show loading indicator
//     try {
//       await dispatch(logoutUser()).unwrap();
//       console.log("Logout successful");
//       await persistor.purge();
//       console.log("Persisted state purged");
//       // Simulate delay for user feedback (e.g., 1 second)
//       setTimeout(() => {
//         setIsLoggingOut(false);
//         navigate("/login");
//       }, 1000);
//     } catch (err) {
//       console.error("Logout failed:", err);
//       await persistor.purge();
//       setTimeout(() => {
//         setIsLoggingOut(false);
//         navigate("/login");
//       }, 1000);
//     }
//   };

//   const handleImageClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const maxSize = 2 * 1024 * 1024; // 2MB
//     if (file.size > maxSize) {
//       setToastMessage("File size exceeds 2MB. Please select a smaller image.");
//       setToastSeverity("error");
//       setOpenToast(true);
//       event.target.value = null;
//       return;
//     }

//     dispatch(uploadProfileImage(file))
//       .unwrap()
//       .then((data) => {
//         console.log("Image uploaded successfully:", data);
//         // setToastMessage("Profile image updated successfully!");
//         // setToastSeverity("success");
//         toast.success("Profile image  updated successfully!", {
//           duration: 5000,
//         });
//         setOpenToast(true);
//         dispatch(fetchUserDetails()); // Refresh user data
//       })
//       .catch((err) => {
//         console.error("Upload failed:", err);
//         toast.err("Profile image  updated successfully!", {
//           duration: 5000,
//         });
//         // setToastMessage(`Upload failed: ${err.message}`);
//         // setToastSeverity("error");
//         setOpenToast(true);
//       });
//   };

//   const handleCloseToast = () => {
//     setOpenToast(false);
//   };

//   if (!user || isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           background:
//             "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//         }}
//       >
//         <CircularProgress color="#fe6c00" size={60} />
//       </Box>
//     );
//   }

//   if (imageUploadError) {
//     return <Typography>Error: {imageUploadError}</Typography>;
//   }

//   const formatDate = (date) =>
//     date
//       ? new Date(date).toLocaleString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "Never";

//   const loginHistory = Array.isArray(user.loginHistory)
//     ? user.loginHistory
//     : [];

//   const getProfileImageUrl = () => {
//     const url = user?.profileImage
//       ? `${user.profileImage}?v=${Date.now()}`
//       : undefined;
//     console.log("Profile image URL:", url);
//     return url;
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 1000,
//         width: "100%",
//         mx: "auto",
//         mt: 4,
//         p: 4,
//         borderRadius: "16px",
//         boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
//         border: "1px solid rgba(71, 59, 51, 0.8)",
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography
//         variant="h4"
//         sx={{
//           fontWeight: 700,
//           mb: 4,
//           textAlign: "center",
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         Profile
//       </Typography>

//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Profile Information
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               gap: 2,
//             }}
//           >
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Name:</strong> {user.fullName || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Email:</strong> {user.email || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Phone:</strong> {user.phoneNumber || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Roles:</strong>{" "}
//                 {user.roles?.map((role) => role.name || role).join(", ") ||
//                   "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Status:</strong> {user.status || "N/A"}
//               </Typography>
//               <Typography sx={{ color: "#d9cfcf" }}>
//                 <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 flex: 1,
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: "100%",
//                   maxWidth: 200,
//                   height: 200,
//                   bgcolor: "rgba(66, 66, 66, 0.3)",
//                   borderRadius: "12px",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   border: "2px dashed #fe6c00",
//                   cursor: "pointer",
//                   "&:hover": {
//                     bgcolor: "rgba(66, 66, 66, 0.5)",
//                     borderColor: "#fea767",
//                   },
//                   position: "relative",
//                 }}
//                 onClick={handleImageClick}
//               >
//                 {isImageUploading ? (
//                   <CircularProgress color="#fe6c00" size={40} />
//                 ) : (
//                   <>
//                     <Avatar
//                       sx={{ width: 80, height: 80, mb: 1, bgcolor: "#fe6c00" }}
//                       src={getProfileImageUrl()}
//                       onError={(e) => {
//                         console.error("Image load error:", e.target.src);
//                         e.target.src = "";
//                       }}
//                     >
//                       {!user.profileImage && (user.fullName?.[0] || "U")}
//                     </Avatar>
//                     <Typography sx={{ color: "#d9cfcf", fontSize: "0.9rem" }}>
//                       Click to Upload Image (Max 2MB)
//                     </Typography>
//                   </>
//                 )}
//               </Box>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept="image/jpeg,image/jpg,image/png"
//                 style={{ display: "none" }}
//                 onChange={handleImageChange}
//               />
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Account Activity Card */}
//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Account Activity
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Joined:</strong> {formatDate(user.createdAt)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Login:</strong> {formatDate(user.lastLogin)}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Currently Logged-In Users:</strong> {currentlyLoggedInUsers}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf", mt: 2 }}>
//             <strong>Recent Logins:</strong>
//           </Typography>
//           <List dense sx={{ color: "#d9cfcf" }}>
//             {loginHistory.length > 0 ? (
//               loginHistory.slice(0, 3).map((login, index) => (
//                 <ListItem key={index}>
//                   <ListItemText
//                     primary={formatDate(login.timestamp)}
//                     secondary={`IP: ${login.ip || "Unknown"} | Device: ${
//                       login.device || "Unknown"
//                     }`}
//                     secondaryTypographyProps={{ sx: { color: "#ffc397" } }}
//                   />
//                 </ListItem>
//               ))
//             ) : (
//               <ListItem>
//                 <ListItemText primary="No login history available" />
//               </ListItem>
//             )}
//           </List>
//         </CardContent>
//       </Card>

//       {/* Work Metrics Card */}
//       <Card
//         sx={{
//           mb: 4,
//           bgcolor: "rgba(48, 41, 36, 0.5)",
//           border: "1px solid rgba(66, 66, 66, 0.7)",
//           borderRadius: "12px",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
//           >
//             Work Metrics
//           </Typography>
//           <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Tasks Completed:</strong>{" "}
//             {user.workMetrics?.tasksCompleted ?? "N/A"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Sales Generated:</strong> ₦
//             {user.workMetrics?.salesGenerated
//               ? user.workMetrics.salesGenerated.toLocaleString("en-NG", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : "0.00"}
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Work Ratio:</strong>{" "}
//             {user.workMetrics?.tasksCompleted > 0
//               ? (
//                   user.workMetrics.salesGenerated /
//                   user.workMetrics.tasksCompleted
//                 ).toFixed(2)
//               : "N/A"}{" "}
//             (Sales per Task)
//           </Typography>
//           <Typography sx={{ color: "#d9cfcf" }}>
//             <strong>Last Updated:</strong>{" "}
//             {formatDate(user.workMetrics?.lastUpdated)}
//           </Typography>
//         </CardContent>
//       </Card>

//       <Button
//         variant="contained"
//         fullWidth
//         onClick={handleLogout}
//         disabled={isLoggingOut} // Disable button during logout
//         sx={{
//           py: 2,
//           background: "linear-gradient(to right, #fe6c00, #fea767)",
//           color: "#fff",
//           fontWeight: "bold",
//           borderRadius: "8px",
//           boxShadow: "0 4px 16px rgba(254, 108, 0, 0.5)",
//           "&:hover": {
//             background: "linear-gradient(to right, #ff8c00, #ffbc80)",
//             boxShadow: "0 6px 20px rgba(254, 108, 0, 0.7)",
//           },
//           "&:disabled": {
//             background: "grey",
//             cursor: "not-allowed",
//           },
//         }}
//       >
//         {isLoggingOut ? (
//           <>
//             <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
//             Logging Out...
//           </>
//         ) : (
//           "Logout"
//         )}
//       </Button>

//       {/* Toast Notification */}
//       <Snackbar
//         open={openToast}
//         autoHideDuration={3000} // 3 seconds
//         onClose={handleCloseToast}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseToast}
//           severity={toastSeverity}
//           sx={{ width: "100%" }}
//         >
//           {toastMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Profile;

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  logoutUser,
  fetchUserDetails,
  getCurrentlyLoggedInUsers,
  uploadProfileImage,
} from "../../redux/slices/authSlice";
import { CircularProgress, Avatar } from "@mui/material";
import { persistor } from "../../redux/store";
import toast from "react-hot-toast"; // Import react-hot-toast

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    user,
    isAuthenticated,
    currentlyLoggedInUsers,
    isLoading,
    isImageUploading,
    imageUploadError,
  } = useSelector((state) => state.auth);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      dispatch(fetchUserDetails())
        .unwrap()
        .then()
        .catch((err) => console.error("Fetch user details failed:", err));
      dispatch(getCurrentlyLoggedInUsers());
    }
  }, [isAuthenticated, dispatch, navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      //console.log("Logout successful");
      await persistor.purge();
      //console.log("Persisted state purged");
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Logout failed:", err);
      await persistor.purge();
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate("/login");
      }, 1000);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 2MB. Please select a smaller image.", {
        duration: 5000,
      });
      event.target.value = null;
      return;
    }

    dispatch(uploadProfileImage(file))
      .unwrap()
      .then((data) => {
        //console.log("Image uploaded successfully:", data);
        toast.success("Profile image updated successfully!", {
          duration: 5000,
        });
        dispatch(fetchUserDetails()); // Refresh user data
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        toast.error(`Upload failed: ${err.message}`, {
          // Fixed toast.err to toast.error
          duration: 5000,
        });
      });
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Never";

  const loginHistory = Array.isArray(user.loginHistory)
    ? user.loginHistory
    : [];

  const getProfileImageUrl = () => {
    const url = user?.profileImage
      ? `${user.profileImage}?v=${Date.now()}`
      : undefined;
    //console.log("Profile image URL:", url);
    return url;
  };

  if (!user || isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background:
            "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
        }}
      >
        <CircularProgress color="#fe6c00" size={60} />
      </Box>
    );
  }

  if (imageUploadError) {
    return <Typography>Error: {imageUploadError}</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 1000,
        width: "100%",
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(71, 59, 51, 0.8)",
        background:
          "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
          textAlign: "center",
          background: "linear-gradient(to right, #fe6c00, #fea767)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Profile
      </Typography>

      <Card
        sx={{
          mb: 4,
          bgcolor: "rgba(48, 41, 36, 0.5)",
          border: "1px solid rgba(66, 66, 66, 0.7)",
          borderRadius: "12px",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
          >
            Profile Information
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "#d9cfcf" }}>
                <strong>Name:</strong> {user.fullName || "N/A"}
              </Typography>
              <Typography sx={{ color: "#d9cfcf" }}>
                <strong>Email:</strong> {user.email || "N/A"}
              </Typography>
              <Typography sx={{ color: "#d9cfcf" }}>
                <strong>Phone:</strong> {user.phoneNumber || "N/A"}
              </Typography>
              <Typography sx={{ color: "#d9cfcf" }}>
                <strong>Roles:</strong>{" "}
                {user.roles?.map((role) => role.name || role).join(", ") ||
                  "N/A"}
              </Typography>
              <Typography sx={{ color: "#d9cfcf" }}>
                <strong>Status:</strong> {user.status || "N/A"}
              </Typography>
              <Typography sx={{ color: "#d9cfcf" }}>
                <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  height: 200,
                  bgcolor: "rgba(66, 66, 66, 0.3)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dashed #fe6c00",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(66, 66, 66, 0.5)",
                    borderColor: "#fea767",
                  },
                  position: "relative",
                }}
                onClick={handleImageClick}
              >
                {isImageUploading ? (
                  <CircularProgress color="#fe6c00" size={40} />
                ) : (
                  <>
                    <Avatar
                      sx={{ width: 80, height: 80, mb: 1, bgcolor: "#fe6c00" }}
                      src={getProfileImageUrl()}
                      onError={(e) => {
                        console.error("Image load error:", e.target.src);
                        e.target.src = "";
                      }}
                    >
                      {!user.profileImage && (user.fullName?.[0] || "U")}
                    </Avatar>
                    <Typography sx={{ color: "#d9cfcf", fontSize: "0.9rem" }}>
                      Click to Upload Image (Max 2MB)
                    </Typography>
                  </>
                )}
              </Box>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/jpg,image/png"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Account Activity Card */}
      <Card
        sx={{
          mb: 4,
          bgcolor: "rgba(48, 41, 36, 0.5)",
          border: "1px solid rgba(66, 66, 66, 0.7)",
          borderRadius: "12px",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
          >
            Account Activity
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
          <Typography sx={{ color: "#d9cfcf" }}>
            <strong>Joined:</strong> {formatDate(user.createdAt)}
          </Typography>
          <Typography sx={{ color: "#d9cfcf" }}>
            <strong>Last Login:</strong> {formatDate(user.lastLogin)}
          </Typography>
          <Typography sx={{ color: "#d9cfcf" }}>
            <strong>Currently Logged-In Users:</strong> {currentlyLoggedInUsers}
          </Typography>
          <Typography sx={{ color: "#d9cfcf", mt: 2 }}>
            <strong>Recent Logins:</strong>
          </Typography>
          <List dense sx={{ color: "#d9cfcf" }}>
            {loginHistory.length > 0 ? (
              loginHistory.slice(0, 3).map((login, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={formatDate(login.timestamp)}
                    secondary={`IP: ${login.ip || "Unknown"} | Device: ${
                      login.device || "Unknown"
                    }`}
                    secondaryTypographyProps={{ sx: { color: "#ffc397" } }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No login history available" />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Work Metrics Card */}
      <Card
        sx={{
          mb: 4,
          bgcolor: "rgba(48, 41, 36, 0.5)",
          border: "1px solid rgba(66, 66, 66, 0.7)",
          borderRadius: "12px",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#fe6c00", mb: 2 }}
          >
            Work Metrics
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
          <Typography sx={{ color: "#d9cfcf" }}>
            <strong>Tasks Completed:</strong>{" "}
            {user.workMetrics?.tasksCompleted ?? "N/A"}
          </Typography>
          <Typography sx={{ color: "#d9cfcf" }}>
            <strong>Sales Generated:</strong> ₦
            {user.workMetrics?.salesGenerated
              ? user.workMetrics.salesGenerated.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </Typography>
          <Typography sx={{ color: "#d9cfcf" }}>
            <strong>Work Ratio:</strong>{" "}
            {user.workMetrics?.tasksCompleted > 0
              ? (
                  user.workMetrics.salesGenerated /
                  user.workMetrics.tasksCompleted
                ).toFixed(2)
              : "N/A"}{" "}
            (Sales per Task)
          </Typography>
          <Typography sx={{ color: "#d9cfcf" }}>
            <strong>Last Updated:</strong>{" "}
            {formatDate(user.workMetrics?.lastUpdated)}
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        fullWidth
        onClick={handleLogout}
        disabled={isLoggingOut}
        sx={{
          py: 2,
          background: "linear-gradient(to right, #fe6c00, #fea767)",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(254, 108, 0, 0.5)",
          "&:hover": {
            background: "linear-gradient(to right, #ff8c00, #ffbc80)",
            boxShadow: "0 6px 20px rgba(254, 108, 0, 0.7)",
          },
          "&:disabled": {
            background: "grey",
            cursor: "not-allowed",
          },
        }}
      >
        {isLoggingOut ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Logging Out...
          </>
        ) : (
          "Logout"
        )}
      </Button>
    </Box>
  );
};

export default Profile;
