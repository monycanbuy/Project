// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Dedicated Axios instance for cookie-based auth
// export const apiClient = axios.create({
//   baseURL: "/api",
//   withCredentials: true,
// });

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error.response?.data || error.message)
// );

// // Constants (relative to baseURL)
// const AUTH_URL = "/auth/signin";
// const USER_DETAILS = "/auth/fetchuserdetails";
// const VERIFICATION_URL = "/auth/send-verification-code";
// const VERIFY_OTP_URL = "/auth/verify-verification-code";
// const USERS_URL = "/auth/users";
// const SIGNUP_URL = "/auth/signup";
// const ROLES_URL = "/roles";
// const UPDATE_PROFILE_IMAGE_URL = "/auth/update-profile-image";
// const UPDATE_PASSWORD_URL = "/auth/update-password";
// const FORGOT_PASSWORD_API_URL = "/auth/send-forgot-password-code";
// const VERIFY_FORGOT_PASSWORD_CODE_API_URL = "/auth/verify-forgot-password-code";
// const CURRENTLY_LOGGED_IN_URL = "/auth/currently-logged-in";
// const LOGGED_IN_TODAY_URL = "/auth/logged-in-today";
// const STAFF_TASK_ACHIEVEMENTS_URL = "/auth/staff-task-achievements";
// const TOTAL_USERS_URL = "/auth/total-users";

// // Thunks
// // export const signupUser = createAsyncThunk(
// //   "auth/signupUser",
// //   async (userData, { rejectWithValue }) => {
// //     try {
// //       const response = await apiClient.post(SIGNUP_URL, {
// //         fullName: userData.fullName,
// //         email: userData.email,
// //         password: userData.password,
// //         phoneNumber: userData.phoneNumber,
// //         roles: userData.roles || ["user"],
// //       });
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue({
// //         message: error.response?.data?.message || "Failed to sign up",
// //         status: error.response?.status || 500,
// //       });
// //     }
// //   }
// // );

// export const signupUser = createAsyncThunk(
//   "auth/signupUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post(SIGNUP_URL, {
//         fullName: userData.fullName,
//         email: userData.email,
//         password: userData.password,
//         phoneNumber: userData.phoneNumber,
//         roles: userData.roles || ["user"],
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to sign up",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const requestData = {
//         emailOrPhone: userData.email,
//         password: userData.password,
//       };
//       const response = await apiClient.post(AUTH_URL, requestData);
//       console.log("Login response headers:", response.headers); // Check for Set-Cookie
//       console.log("Login response data:", response.data);
//       if (response.status === 202) {
//         return {
//           needsVerification: true,
//           email: response.data.email,
//           codeSent: response.data.codeSent,
//           message: response.data.message,
//         };
//       }
//       console.log(
//         "Login response data:",
//         JSON.stringify(response.data, null, 2)
//       );
//       return response.data; // Now includes roles: [{ name, permissions }]
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to login",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const sendVerificationCode = createAsyncThunk(
//   "auth/sendVerificationCode",
//   async (email, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.patch(VERIFICATION_URL, { email });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message || "Failed to send verification code",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const fetchUserDetails = createAsyncThunk(
//   "auth/fetchUserDetails",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(USER_DETAILS);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message || "Failed to fetch user details",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const verifyOTP = createAsyncThunk(
//   "auth/verifyOTP",
//   async ({ email, providedCode }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.patch(VERIFY_OTP_URL, {
//         email,
//         providedCode,
//       });
//       console.log("Verify OTP response data:", response.data);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to verify OTP",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const fetchAllUsers = createAsyncThunk(
//   "auth/fetchAllUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(USERS_URL);
//       console.log("fetchAllUsers API response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "fetchAllUsers API error:",
//         error.response?.data || error.message
//       );
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to fetch users",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const updateUser = createAsyncThunk(
//   "auth/updateUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const safeUserData = {
//         ...userData,
//         roles: userData.roles.map(String),
//       };
//       const response = await apiClient.patch(
//         `${USERS_URL}/${userData._id}`,
//         safeUserData
//       );
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const fetchRoles = createAsyncThunk(
//   "auth/fetchRoles",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(ROLES_URL);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to fetch roles",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// // export const uploadProfileImage = createAsyncThunk(
// //   "auth/uploadProfileImage",
// //   async (file, { rejectWithValue }) => {
// //     try {
// //       const formData = new FormData();
// //       formData.append("profileImage", file);
// //       const response = await apiClient.post(
// //         UPDATE_PROFILE_IMAGE_URL,
// //         formData,
// //         {
// //           headers: { "Content-Type": "multipart/form-data" },
// //         }
// //       );
// //       return response.data;
// //     } catch (error) {
// //       return rejectWithValue({
// //         message:
// //           error.response?.data?.message || "Failed to upload profile image",
// //         status: error.response?.status || 500,
// //       });
// //     }
// //   }
// // );
// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await apiClient.post("/auth/signout"); // Match backend POST route
//       console.log("Logout API response:", response.data);

//       // Clear Redux state
//       dispatch(logout());

//       return response.data;
//     } catch (error) {
//       console.error("Logout error:", error.response?.data || error.message);
//       // Clear state even if API fails
//       dispatch(logout());
//       return rejectWithValue({
//         message: error.response?.data?.message || "Logout failed",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const uploadProfileImage = createAsyncThunk(
//   "auth/uploadProfileImage",
//   async (file, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       formData.append("image", file); // Match backend field name "image"
//       const response = await apiClient.post(
//         UPDATE_PROFILE_IMAGE_URL, // "/auth/update-profile-image"
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       console.log("Upload response:", response.data); // Debug log
//       return response.data;
//     } catch (error) {
//       console.error("Upload error:", error);
//       return rejectWithValue({
//         message:
//           error.response?.data?.message || "Failed to upload profile image",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const updateUserPassword = createAsyncThunk(
//   "auth/updateUserPassword",
//   async ({ oldPassword, newPassword }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.patch(UPDATE_PASSWORD_URL, {
//         oldPassword,
//         newPassword,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to update password",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const sendForgotPasswordCodeAsync = createAsyncThunk(
//   "auth/sendForgotPasswordCode",
//   async (email, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.patch(FORGOT_PASSWORD_API_URL, {
//         email,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message ||
//           "Failed to send forgot password code",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const verifyForgotPasswordCodeAsync = createAsyncThunk(
//   "auth/verifyForgotPasswordCode",
//   async ({ token, newPassword }, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.patch(
//         VERIFY_FORGOT_PASSWORD_CODE_API_URL,
//         {
//           token,
//           newPassword,
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message ||
//           "Failed to verify forgot password code",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// // export const logoutUser = createAsyncThunk(
// //   "auth/logoutUser",
// //   async (_, { dispatch }) => {
// //     try {
// //       await apiClient.get("/auth/signout");
// //       dispatch(logout());
// //     } catch (error) {
// //       console.error("Logout error:", error);
// //       dispatch(logout());
// //     }
// //   }
// // );
// // export const logoutUser = createAsyncThunk(
// //   "auth/logoutUser",
// //   async (_, { dispatch }) => {
// //     try {
// //       await apiClient.get("/auth/signout");
// //       dispatch(logout());
// //     } catch (error) {
// //       console.error("Logout error:", error);
// //       dispatch(logout());
// //     }
// //   }
// // );

// // export const checkAuthStatus = createAsyncThunk(
// //   "auth/checkAuthStatus",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await apiClient.get(USER_DETAILS);
// //       console.log("checkAuthStatus response:", response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error("checkAuthStatus error:", error);
// //       return rejectWithValue(error.message || "Failed to check auth status");
// //     }
// //   }
// // );
// // export const checkAuthStatus = createAsyncThunk(
// //   "auth/checkAuthStatus",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await apiClient.get(USER_DETAILS);
// //       console.log("checkAuthStatus response:", response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error("checkAuthStatus error:", error);
// //       return rejectWithValue(error.message || "Failed to check auth status");
// //     }
// //   }
// // );
// // export const checkAuthStatus = createAsyncThunk(
// //   "auth/checkAuthStatus",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await apiClient.get(USER_DETAILS);
// //       console.log("checkAuthStatus response:", response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error("checkAuthStatus error:", error);
// //       return rejectWithValue(error.message || "Failed to check auth status");
// //     }
// //   }
// // );
// // export const logoutUser = createAsyncThunk(
// //   "auth/logoutUser",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await apiClient.post("/auth/signout"); // Use POST to match backend
// //       console.log("Logout response:", response.data);
// //       return response.data;
// //     } catch (error) {
// //       console.error("Logout error:", error.response?.data || error.message);
// //       return rejectWithValue({
// //         message: error.response?.data?.message || "Logout failed",
// //         status: error.response?.status || 500,
// //       });
// //     }
// //   }
// // );

// export const checkAuthStatus = createAsyncThunk(
//   "auth/checkAuthStatus",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(USER_DETAILS);
//       console.log("checkAuthStatus response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "checkAuthStatus error:",
//         error.response?.data || error.message
//       );
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to check auth status",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const deleteUser = createAsyncThunk(
//   "auth/deleteUser",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.delete(`${USERS_URL}/${userId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to delete user",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const getCurrentlyLoggedInUsers = createAsyncThunk(
//   "auth/getCurrentlyLoggedInUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(CURRENTLY_LOGGED_IN_URL);
//       return response.data.data.currentlyLoggedInUsers;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message ||
//           "Failed to fetch currently logged-in users",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const getLoggedInToday = createAsyncThunk(
//   "auth/getLoggedInToday",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(LOGGED_IN_TODAY_URL);
//       return response.data.data.loggedInToday;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message ||
//           "Failed to fetch users logged in today",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const getStaffTaskAchievements = createAsyncThunk(
//   "auth/getStaffTaskAchievements",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(STAFF_TASK_ACHIEVEMENTS_URL);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue({
//         message:
//           error.response?.data?.message ||
//           "Failed to fetch staff task achievements",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const getTotalUsers = createAsyncThunk(
//   "auth/getTotalUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(TOTAL_USERS_URL);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to fetch total users",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// // Slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     users: [],
//     user: null,
//     token: null,
//     roles: [],
//     email: "",
//     isLoading: false,
//     error: null,
//     verificationSuccess: false,
//     isVerified: false,
//     isAuthenticated: false,
//     needsVerification: false,
//     codeSent: null,
//     verificationMessage: null,
//     forgotPasswordEmail: null,
//     isImageUploading: false,
//     imageUploadError: null,
//     changePasswordStatus: null,
//     changePasswordError: null,
//     isSendingCode: false,
//     sendCodeMessage: null,
//     sendCodeError: null,
//     isVerifyingCode: false,
//     verificationError: null,
//     currentlyLoggedInUsers: 0,
//     loggedInToday: 0,
//     staffTaskAchievements: [],
//     userStats: { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 },
//     status: "idle", // Added for checkAuthStatus
//     lastActivity: Date.now(),
//   },
//   reducers: {
//     logout: (state) => {
//       // state.user = null;
//       // state.token = null;
//       // state.isAuthenticated = false;
//       // state.isVerified = false;
//       // state.error = null;
//       // state.needsVerification = false;
//       // state.codeSent = null;
//       // state.verificationMessage = null;
//       // state.status = "idle";
//       // state.lastActivity = Date.now();
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.isVerified = false;
//       state.error = null;
//       state.needsVerification = false;
//       state.codeSent = null;
//       state.verificationMessage = null;
//       state.status = "idle";
//       state.email = "";
//       state.verificationSuccess = false;
//       state.currentlyLoggedInUsers = 0;
//       state.loggedInToday = 0;
//       state.staffTaskAchievements = [];
//       state.userStats = { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 };
//       state.lastActivity = Date.now();
//     },
//     clearError: (state) => {
//       state.error = null;
//       state.imageUploadError = null;
//       state.changePasswordError = null;
//       state.sendCodeError = null;
//       state.verificationError = null;
//     },
//     setEmail: (state, action) => {
//       state.email = action.payload;
//     },
//     setUserDetails: (state, action) => {
//       state.user = action.payload;
//       state.email = action.payload.email;
//       state.isVerified = action.payload.verified || false;
//       state.isAuthenticated = true;
//       state.error = null;
//     },
//     setSendingCodeFlag: (state, action) => {
//       state.isSendingCode = action.payload;
//     },
//     setRoles: (state, action) => {
//       state.roles = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(signupUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(signupUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         //state.user = action.payload.result;
//       })
//       .addCase(signupUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//         state.needsVerification = false;
//         state.codeSent = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         if (action.payload.needsVerification) {
//           state.needsVerification = true;
//           state.email = action.payload.email;
//           state.codeSent = action.payload.codeSent;
//           state.verificationMessage = action.payload.message;
//         } else {
//           //state.user = action.payload; // Store full user object with roles
//           state.user = {
//             ...action.payload,
//             lastLogin: action.payload.lastLogin || null, // Ensure lastLogin is included
//             loginHistory: action.payload.loginHistory || [], // Ensure loginHistory is included
//           };
//           //state.token = null;
//           state.token = action.payload.token || null; // Still null with cookies
//           state.email = action.payload.email;
//           state.isVerified = action.payload.verified || false;
//           state.isAuthenticated = true;
//           console.log(
//             "User logged in with roles:",
//             JSON.stringify(state.user.roles, null, 2)
//           );
//           state.error = null;
//           state.needsVerification = false;
//           state.codeSent = null;
//           console.log(
//             "User logged in with roles:",
//             JSON.stringify(state.user.roles, null, 2)
//           );
//         }
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//         state.isVerified =
//           action.payload.verified !== undefined
//             ? action.payload.verified
//             : false;
//         state.needsVerification = false;
//         state.codeSent = null;
//       })
//       .addCase(sendVerificationCode.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(sendVerificationCode.fulfilled, (state) => {
//         state.isLoading = false;
//         state.verificationSuccess = true;
//         state.error = null;
//       })
//       .addCase(sendVerificationCode.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(fetchUserDetails.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserDetails.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.data;
//         state.email = action.payload.data.email;
//         state.isVerified = action.payload.data.verified || false;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(fetchUserDetails.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//         state.isAuthenticated = false;
//       })
//       .addCase(verifyOTP.pending, (state) => {
//         state.isLoading = true;
//         state.verificationSuccess = false;
//         state.error = null;
//       })
//       .addCase(verifyOTP.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.verificationSuccess = true;
//         state.isVerified = true;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//         //state.user = action.payload.user;
//         state.email = action.payload.email;
//         //state.isAuthenticated = true;
//         state.error = null;
//         state.verificationMessage = action.payload.message;
//         state.needsVerification = false;
//         state.codeSent = null;
//       })
//       .addCase(verifyOTP.rejected, (state, action) => {
//         state.isLoading = false;
//         state.verificationSuccess = false;
//         state.error = action.payload.message;
//         if (action.payload.message === "You are already verified!") {
//           state.isVerified = true;
//           state.needsVerification = false;
//           state.codeSent = null;
//         }
//       })
//       .addCase(fetchAllUsers.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllUsers.fulfilled, (state, action) => {
//         state.isLoading = false;
//         if (action.payload.success && Array.isArray(action.payload.data)) {
//           state.users = action.payload.data;
//           state.error = null;
//         } else {
//           state.error = "Unexpected users response format";
//         }
//       })
//       .addCase(fetchAllUsers.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(updateUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(updateUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         const updatedUser = action.payload;
//         state.users = state.users.map((user) =>
//           user._id === updatedUser._id ? updatedUser : user
//         );
//         if (state.user && state.user._id === updatedUser._id) {
//           state.user = updatedUser;
//         }
//         state.error = null;
//       })
//       .addCase(updateUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(fetchRoles.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchRoles.fulfilled, (state, action) => {
//         state.isLoading = false;
//         if (action.payload.success && Array.isArray(action.payload.data)) {
//           state.roles = action.payload.data;
//           state.error = null;
//         } else {
//           state.error = "Unexpected roles response format";
//         }
//       })
//       .addCase(fetchRoles.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(uploadProfileImage.pending, (state) => {
//         state.isImageUploading = true;
//         state.imageUploadError = null;
//       })
//       // .addCase(uploadProfileImage.fulfilled, (state, action) => {
//       //   state.isImageUploading = false;
//       //   if (action.payload.user) {
//       //     state.user = action.payload.user;
//       //   }
//       // })
//       .addCase(uploadProfileImage.fulfilled, (state, action) => {
//         state.isImageUploading = false;
//         if (action.payload.success && action.payload.user) {
//           state.user = action.payload.user; // Update with full user object including Cloudinary URL
//           console.log(
//             "Updated user with Cloudinary URL:",
//             state.user.profileImage
//           );
//         } else {
//           console.warn("Upload succeeded but no user data:", action.payload);
//         }
//       })
//       .addCase(uploadProfileImage.rejected, (state, action) => {
//         state.isImageUploading = false;
//         state.imageUploadError = action.payload.message;
//       })
//       .addCase(updateUserPassword.pending, (state) => {
//         state.changePasswordStatus = "loading";
//         state.changePasswordError = null;
//       })
//       .addCase(updateUserPassword.fulfilled, (state) => {
//         state.changePasswordStatus = "succeeded";
//         state.changePasswordError = null;
//       })
//       .addCase(updateUserPassword.rejected, (state, action) => {
//         state.changePasswordStatus = "failed";
//         state.changePasswordError = action.payload.message;
//       })
//       .addCase(sendForgotPasswordCodeAsync.pending, (state) => {
//         state.isSendingCode = true;
//         state.sendCodeError = null;
//         state.sendCodeMessage = null;
//       })
//       .addCase(sendForgotPasswordCodeAsync.fulfilled, (state, action) => {
//         state.isSendingCode = false;
//         state.sendCodeMessage = action.payload.message;
//       })
//       .addCase(sendForgotPasswordCodeAsync.rejected, (state, action) => {
//         state.isSendingCode = false;
//         state.sendCodeError = action.payload.message;
//       })
//       .addCase(verifyForgotPasswordCodeAsync.pending, (state) => {
//         state.isVerifyingCode = true;
//         state.verificationError = null;
//         state.verificationMessage = null;
//       })
//       .addCase(verifyForgotPasswordCodeAsync.fulfilled, (state, action) => {
//         state.isVerifyingCode = false;
//         state.verificationMessage = action.payload.message;
//         state.verificationSuccess = true;
//       })
//       .addCase(verifyForgotPasswordCodeAsync.rejected, (state, action) => {
//         state.isVerifyingCode = false;
//         state.verificationError = action.payload.message;
//       })
//       .addCase(checkAuthStatus.pending, (state) => {
//         console.log("checkAuthStatus pending:", { ...state });
//         state.isLoading = true;
//         state.error = null;
//         state.needsVerification = false;
//         state.codeSent = null;
//         state.status = "loading";
//       })
//       .addCase(checkAuthStatus.fulfilled, (state, action) => {
//         console.log("checkAuthStatus fulfilled:", action.payload);
//         state.isLoading = false;
//         //state.user = action.payload.data;
//         state.user = action.payload.data || action.payload;
//         state.email = action.payload.data.email;
//         //state.isVerified = action.payload.data.verified || false;
//         state.isVerified =
//           action.payload.data?.verified || action.payload.verified || false;
//         state.isAuthenticated = true;
//         state.status = "succeeded";
//         state.error = null;
//         state.needsVerification = false;
//         state.codeSent = null;
//       })
//       .addCase(checkAuthStatus.rejected, (state, action) => {
//         console.log("checkAuthStatus rejected:", action.payload);
//         state.isLoading = false;
//         //state.error = action.payload;
//         state.error = action.payload?.message || "Auth check failed";
//         state.isAuthenticated = false;
//         state.user = null;
//         state.email = "";
//         state.isVerified = false;
//         state.needsVerification = false;
//         state.codeSent = null;
//         state.status = "failed";
//       })
//       .addCase(logoutUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.isLoading = false;
//         state.users = [];
//         state.user = null;
//         state.roles = [];
//         state.email = "";
//         state.isAuthenticated = false;
//         state.token = null;
//         state.isVerified = false;
//         state.isAuthenticated = false;
//         state.error = null;
//         state.verificationSuccess = false;
//         state.currentlyLoggedInUsers = 0;
//         state.needsVerification = false;
//         state.isImageUploading = false;
//         state.imageUploadError = null;
//         state.changePasswordStatus = null;
//         state.changePasswordError = null;
//         state.isSendingCode = false;
//         state.sendCodeMessage = null;
//         state.sendCodeError = null;
//         state.isVerifyingCode = false;
//         state.verificationMessage = null;
//         state.verificationError = null;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//         state.users = [];
//         state.user = null;
//         state.roles = [];
//         state.email = "";
//         state.token = null;
//         state.isVerified = false;
//         state.isAuthenticated = false;
//         state.verificationSuccess = false;
//         state.isImageUploading = false;
//         state.imageUploadError = null;
//         state.changePasswordStatus = null;
//         state.changePasswordError = null;
//         state.isSendingCode = false;
//         state.sendCodeMessage = null;
//         state.sendCodeError = null;
//         state.isVerifyingCode = false;
//         state.verificationMessage = null;
//         state.verificationError = null;
//       })
//       .addCase(getCurrentlyLoggedInUsers.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(getCurrentlyLoggedInUsers.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.currentlyLoggedInUsers = action.payload;
//         state.error = null;
//       })
//       .addCase(getCurrentlyLoggedInUsers.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(getLoggedInToday.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(getLoggedInToday.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.loggedInToday = action.payload;
//         state.error = null;
//       })
//       .addCase(getLoggedInToday.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(getStaffTaskAchievements.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(getStaffTaskAchievements.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.staffTaskAchievements = action.payload;
//         state.error = null;
//       })
//       .addCase(getStaffTaskAchievements.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(getTotalUsers.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(getTotalUsers.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.userStats = action.payload;
//         state.error = null;
//       })
//       .addCase(getTotalUsers.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       })
//       .addCase(deleteUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.users = state.users.filter(
//           (user) => user._id !== action.meta.arg
//         );
//       })
//       .addCase(deleteUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload.message;
//       });
//   },
// });

// export const {
//   logout,
//   clearError,
//   setEmail,
//   setUserDetails,
//   resetAuthState,
//   setSendingCodeFlag,
//   setRoles,
// } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";
// import axios from "axios";
// import store from "../store";

//Dedicated Axios instance for cookie-based auth
// export const apiClient = axios.create({
//   baseURL: "/api",
//   withCredentials: true,
// });

// // Axios Interceptor for session expiration
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     console.log("Interceptor caught error:", { status, error });
//     if (status === 401 || status === 403) {
//       store.dispatch(setSessionExpired(true)); // Trigger session expired dialog
//     }
//     return Promise.reject(error.response?.data || error.message);
//   }
// );

// Constants (relative to baseURL)
const AUTH_URL = "/auth/signin";
const USER_DETAILS = "/auth/fetchuserdetails";
const VERIFICATION_URL = "/auth/send-verification-code";
const VERIFY_OTP_URL = "/auth/verify-verification-code";
const USERS_URL = "/auth/users";
const SIGNUP_URL = "/auth/signup";
const ROLES_URL = "/roles";
const UPDATE_PROFILE_IMAGE_URL = "/auth/update-profile-image";
const UPDATE_PASSWORD_URL = "/auth/update-password";
const FORGOT_PASSWORD_API_URL = "/auth/send-forgot-password-code";
const VERIFY_FORGOT_PASSWORD_CODE_API_URL = "/auth/verify-forgot-password-code";
const CURRENTLY_LOGGED_IN_URL = "/auth/currently-logged-in";
const LOGGED_IN_TODAY_URL = "/auth/logged-in-today";
const STAFF_TASK_ACHIEVEMENTS_URL = "/auth/staff-task-achievements";
const TOTAL_USERS_URL = "/auth/total-users";

// Thunks (keeping your latest versions)
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(SIGNUP_URL, {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        roles: userData.roles || ["user"],
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to sign up",
        status: error.response?.status || 500,
      });
    }
  }
);

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const requestData = {
//         emailOrPhone: userData.email,
//         password: userData.password,
//       };
//       const response = await apiClient.post(AUTH_URL, requestData);
//       console.log("Login response headers:", response.headers); // Check for Set-Cookie
//       console.log("Login response data:", response.data);
//       if (response.status === 202) {
//         return {
//           needsVerification: true,
//           email: response.data.email,
//           codeSent: response.data.codeSent,
//           message: response.data.message,
//         };
//       }
//       console.log(
//         "Login response data:",
//         JSON.stringify(response.data, null, 2)
//       );
//       return response.data; // Now includes roles: [{ name, permissions }]
//     } catch (error) {
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to login",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const requestData = {
//         emailOrPhone: userData.email,
//         password: userData.password,
//       };
//       const response = await apiClient.post(AUTH_URL, requestData);
//       //console.log("Login response data:", response.data);
//       return response.data; // Expect { token, user, ... }
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to login"
//       );
//     }
//   }
// );
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/signin", {
        emailOrPhone: userData.email,
        password: userData.password,
      });
      return response.data; // No token expected
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to login"
      );
    }
  }
);

export const sendVerificationCode = createAsyncThunk(
  "auth/sendVerificationCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(VERIFICATION_URL, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to send verification code",
        status: error.response?.status || 500,
      });
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(USER_DETAILS);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch user details",
        status: error.response?.status || 500,
      });
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, providedCode }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(VERIFY_OTP_URL, {
        email,
        providedCode,
      });
      //console.log("Verify OTP response data:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to verify OTP",
        status: error.response?.status || 500,
      });
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(USERS_URL);
      //console.log("fetchAllUsers API response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "fetchAllUsers API error:",
        error.response?.data || error.message
      );
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch users",
        status: error.response?.status || 500,
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const safeUserData = {
        ...userData,
        roles: userData.roles.map(String),
      };
      const response = await apiClient.patch(
        `${USERS_URL}/${userData._id}`,
        safeUserData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "auth/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ROLES_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch roles",
        status: error.response?.status || 500,
      });
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "auth/uploadProfileImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // Match backend field name "image"
      const response = await apiClient.post(
        UPDATE_PROFILE_IMAGE_URL,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      //console.log("Upload response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Upload error:", error);
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to upload profile image",
        status: error.response?.status || 500,
      });
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "auth/updateUserPassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(UPDATE_PASSWORD_URL, {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to update password",
        status: error.response?.status || 500,
      });
    }
  }
);

export const sendForgotPasswordCodeAsync = createAsyncThunk(
  "auth/sendForgotPasswordCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(FORGOT_PASSWORD_API_URL, {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Failed to send forgot password code",
        status: error.response?.status || 500,
      });
    }
  }
);

export const verifyForgotPasswordCodeAsync = createAsyncThunk(
  "auth/verifyForgotPasswordCode",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        VERIFY_FORGOT_PASSWORD_CODE_API_URL,
        {
          token,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Failed to verify forgot password code",
        status: error.response?.status || 500,
      });
    }
  }
);

// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await apiClient.post("/auth/signout"); // Match backend POST route
//       console.log("Logout API response:", response.data);
//       dispatch(logout()); // Clear Redux state
//       return response.data;
//     } catch (error) {
//       console.error("Logout error:", error.response?.data || error.message);
//       dispatch(logout()); // Clear state even if API fails
//       return rejectWithValue({
//         message: error.response?.data?.message || "Logout failed",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );

// export const checkAuthStatus = createAsyncThunk(
//   "auth/checkAuthStatus",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(USER_DETAILS);
//       console.log("checkAuthStatus response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "checkAuthStatus error:",
//         error.response?.data || error.message
//       );
//       return rejectWithValue({
//         message: error.response?.data?.message || "Failed to check auth status",
//         status: error.response?.status || 500,
//       });
//     }
//   }
// );
// export const checkAuthStatus = createAsyncThunk(
//   "auth/checkAuthStatus",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.get(USER_DETAILS);
//       console.log("checkAuthStatus response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "checkAuthStatus error:",
//         error.response?.data || error.message
//       );
//       return rejectWithValue(
//         error.response?.data?.message || "Auth check failed"
//       );
//     }
//   }
// );
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/fetchuserdetails");
      //console.log("checkAuthStatus response:", response.data);
      return response.data;
    } catch (error) {
      // console.error(
      //   "checkAuthStatus error:",
      //   error.response?.data || error.message
      // );
      const redirectTo = error.response?.data?.redirectTo;
      if (redirectTo) {
        window.location.href = redirectTo; // Redirect if instructed
      }
      return rejectWithValue(
        error.response?.data?.message || "Auth check failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/signout");
      //console.log("Logout API response:", response.data);
      dispatch(logout());
      return response.data;
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      dispatch(logout());
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${USERS_URL}/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to delete user",
        status: error.response?.status || 500,
      });
    }
  }
);

export const getCurrentlyLoggedInUsers = createAsyncThunk(
  "auth/getCurrentlyLoggedInUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(CURRENTLY_LOGGED_IN_URL);
      return response.data.data.currentlyLoggedInUsers;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Failed to fetch currently logged-in users",
        status: error.response?.status || 500,
      });
    }
  }
);

export const getLoggedInToday = createAsyncThunk(
  "auth/getLoggedInToday",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(LOGGED_IN_TODAY_URL);
      return response.data.data.loggedInToday;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Failed to fetch users logged in today",
        status: error.response?.status || 500,
      });
    }
  }
);

export const getStaffTaskAchievements = createAsyncThunk(
  "auth/getStaffTaskAchievements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(STAFF_TASK_ACHIEVEMENTS_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Failed to fetch staff task achievements",
        status: error.response?.status || 500,
      });
    }
  }
);

export const getTotalUsers = createAsyncThunk(
  "auth/getTotalUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(TOTAL_USERS_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch total users",
        status: error.response?.status || 500,
      });
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    users: [],
    user: null,
    token: null,
    roles: [],
    email: "",
    isLoading: false,
    error: null,
    verificationSuccess: false,
    isVerified: false,
    isAuthenticated: false,
    needsVerification: false,
    codeSent: null,
    verificationMessage: null,
    forgotPasswordEmail: null,
    isImageUploading: false,
    imageUploadError: null,
    changePasswordStatus: null,
    changePasswordError: null,
    isSendingCode: false,
    sendCodeMessage: null,
    sendCodeError: null,
    isVerifyingCode: false,
    verificationError: null,
    currentlyLoggedInUsers: 0,
    loggedInToday: 0,
    staffTaskAchievements: [],
    userStats: { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 },
    status: "idle",
    lastActivity: Date.now(),
    sessionExpired: false, // New state for session expiration dialog
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.sessionExpired = false; // Reset on logout
      state.isAuthenticated = false;
      state.isVerified = false;
      state.error = null;
      state.needsVerification = false;
      state.codeSent = null;
      state.verificationMessage = null;
      state.status = "idle";
      state.email = "";
      state.verificationSuccess = false;
      state.currentlyLoggedInUsers = 0;
      state.loggedInToday = 0;
      state.staffTaskAchievements = [];
      state.userStats = { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 };
      state.lastActivity = Date.now();
    },
    clearError: (state) => {
      state.error = null;
      state.imageUploadError = null;
      state.changePasswordError = null;
      state.sendCodeError = null;
      state.verificationError = null;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
      state.email = action.payload.email;
      state.isVerified = action.payload.verified || false;
      state.isAuthenticated = true;
      state.error = null;
    },
    setSendingCodeFlag: (state, action) => {
      state.isSendingCode = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setSessionExpired: (state, action) => {
      //console.log("setSessionExpired called with:", action.payload);
      state.sessionExpired = action.payload; // Toggle session expired state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.needsVerification = false;
        state.codeSent = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.needsVerification) {
          state.needsVerification = true;
          state.email = action.payload.email;
          state.codeSent = action.payload.codeSent;
          state.verificationMessage = action.payload.message;
        } else {
          state.user = {
            ...action.payload,
            lastLogin: action.payload.lastLogin || null,
            loginHistory: action.payload.loginHistory || [],
          };
          state.token = action.payload.token || null;
          state.email = action.payload.email;
          state.isVerified = action.payload.verified || false;
          state.isAuthenticated = true;
          state.error = null;
          state.needsVerification = false;
          state.codeSent = null;
          state.sessionExpired = false; // Reset on successful login
          // console.log(
          //   "User logged in with roles:",
          //   JSON.stringify(state.user.roles, null, 2)
          // );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.isVerified =
          action.payload.verified !== undefined
            ? action.payload.verified
            : false;
        state.needsVerification = false;
        state.codeSent = null;
      })
      .addCase(sendVerificationCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.isLoading = false;
        state.verificationSuccess = true;
        state.error = null;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.email = action.payload.data.email;
        state.isVerified = action.payload.data.verified || false;
        state.isAuthenticated = true;
        state.error = null;
        state.sessionExpired = false; // Reset on successful fetch
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.isAuthenticated = false;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.verificationSuccess = false;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationSuccess = true;
        state.isVerified = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.email = action.payload.email;
        state.error = null;
        state.verificationMessage = action.payload.message;
        state.needsVerification = false;
        state.codeSent = null;
        state.sessionExpired = false; // Reset on successful verification
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.verificationSuccess = false;
        state.error = action.payload.message;
        if (action.payload.message === "You are already verified!") {
          state.isVerified = true;
          state.needsVerification = false;
          state.codeSent = null;
        }
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && Array.isArray(action.payload.data)) {
          state.users = action.payload.data;
          state.error = null;
        } else {
          state.error = "Unexpected users response format";
        }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        if (state.user && state.user._id === updatedUser._id) {
          state.user = updatedUser;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && Array.isArray(action.payload.data)) {
          state.roles = action.payload.data;
          state.error = null;
        } else {
          state.error = "Unexpected roles response format";
        }
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(uploadProfileImage.pending, (state) => {
        state.isImageUploading = true;
        state.imageUploadError = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isImageUploading = false;
        if (action.payload.success && action.payload.user) {
          state.user = action.payload.user;
          // console.log(
          //   "Updated user with Cloudinary URL:",
          //   state.user.profileImage
          // );
        } else {
          console.warn("Upload succeeded but no user data:", action.payload);
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isImageUploading = false;
        state.imageUploadError = action.payload.message;
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.changePasswordStatus = "loading";
        state.changePasswordError = null;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.changePasswordStatus = "succeeded";
        state.changePasswordError = null;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.changePasswordStatus = "failed";
        state.changePasswordError = action.payload.message;
      })
      .addCase(sendForgotPasswordCodeAsync.pending, (state) => {
        state.isSendingCode = true;
        state.sendCodeError = null;
        state.sendCodeMessage = null;
      })
      .addCase(sendForgotPasswordCodeAsync.fulfilled, (state, action) => {
        state.isSendingCode = false;
        state.sendCodeMessage = action.payload.message;
      })
      .addCase(sendForgotPasswordCodeAsync.rejected, (state, action) => {
        state.isSendingCode = false;
        state.sendCodeError = action.payload.message;
      })
      .addCase(verifyForgotPasswordCodeAsync.pending, (state) => {
        state.isVerifyingCode = true;
        state.verificationError = null;
        state.verificationMessage = null;
      })
      .addCase(verifyForgotPasswordCodeAsync.fulfilled, (state, action) => {
        state.isVerifyingCode = false;
        state.verificationMessage = action.payload.message;
        state.verificationSuccess = true;
      })
      .addCase(verifyForgotPasswordCodeAsync.rejected, (state, action) => {
        state.isVerifyingCode = false;
        state.verificationError = action.payload.message;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        //console.log("checkAuthStatus pending:", { ...state });
        state.isLoading = true;
        state.error = null;
        state.needsVerification = false;
        state.codeSent = null;
        state.status = "loading";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        // console.log("checkAuthStatus fulfilled:", action.payload);
        state.isLoading = false;
        state.user = action.payload.data || action.payload;
        state.email = action.payload.data.email;
        state.isVerified =
          action.payload.data?.verified || action.payload.verified || false;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
        state.needsVerification = false;
        state.codeSent = null;
        state.sessionExpired = false; // Reset on successful check
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        //console.log("checkAuthStatus rejected:", action.payload);
        state.isLoading = false;
        state.error = action.payload.message || "Auth check failed";
        state.isAuthenticated = false;
        state.user = null;
        state.email = "";
        state.isVerified = false;
        state.needsVerification = false;
        state.codeSent = null;
        state.status = "failed";
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.users = [];
        state.user = null;
        state.roles = [];
        state.email = "";
        state.token = null;
        state.isVerified = false;
        state.isAuthenticated = false;
        state.error = null;
        state.verificationSuccess = false;
        state.needsVerification = false;
        state.isImageUploading = false;
        state.imageUploadError = null;
        state.changePasswordStatus = null;
        state.changePasswordError = null;
        state.isSendingCode = false;
        state.sendCodeMessage = null;
        state.sendCodeError = null;
        state.isVerifyingCode = false;
        state.verificationMessage = null;
        state.verificationError = null;
        state.sessionExpired = false; // Reset on logout
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.users = [];
        state.user = null;
        state.roles = [];
        state.email = "";
        state.token = null;
        state.isVerified = false;
        state.isAuthenticated = false;
        state.verificationSuccess = false;
        state.isImageUploading = false;
        state.imageUploadError = null;
        state.changePasswordStatus = null;
        state.changePasswordError = null;
        state.isSendingCode = false;
        state.sendCodeMessage = null;
        state.sendCodeError = null;
        state.isVerifyingCode = false;
        state.verificationMessage = null;
        state.verificationError = null;
        state.sessionExpired = false; // Reset even on failure
      })
      .addCase(getCurrentlyLoggedInUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentlyLoggedInUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentlyLoggedInUsers = action.payload;
        state.error = null;
      })
      .addCase(getCurrentlyLoggedInUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(getLoggedInToday.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLoggedInToday.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loggedInToday = action.payload;
        state.error = null;
      })
      .addCase(getLoggedInToday.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(getStaffTaskAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStaffTaskAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staffTaskAchievements = action.payload;
        state.error = null;
      })
      .addCase(getStaffTaskAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(getTotalUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTotalUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStats = action.payload;
        state.error = null;
      })
      .addCase(getTotalUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.meta.arg
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const {
  logout,
  clearError,
  setEmail,
  setUserDetails,
  setSendingCodeFlag,
  resetAuthState,
  setRoles,
  setSessionExpired, // Export new action
} = authSlice.actions;
//console.log("Exporting authSlice.reducer:", authSlice.reducer);
export default authSlice.reducer;
