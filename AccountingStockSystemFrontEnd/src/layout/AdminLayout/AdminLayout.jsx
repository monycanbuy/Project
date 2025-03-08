// import React, { useContext, useEffect } from "react";
// import { SidebarContext } from "../../context/sidebarContext";
// import Sidebar from "../Sidebar/Sidebar";
// import Content from "../Content/Content";
// import { useDispatch, useSelector } from "react-redux";
// import { checkAuthStatus } from "../../redux/slices/authSlice";
// import AddNewUserDrawer from "../../components/AddDrawerSection/AddNewUserDrawer";
// import ErrorBoundary from "../../error/ErrorBoundary";
// import { Outlet } from "react-router-dom";
// import { CircularProgress, Button } from "@mui/material";
// import { Navigate } from "react-router-dom";

// const AdminLayout = () => {
//   const dispatch = useDispatch();
//   const { user, isLoading, error, isAuthenticated } = useSelector(
//     (state) => state.auth
//   );
//   const sidebarContext = useContext(SidebarContext);

//   useEffect(() => {
//     console.log("AdminLayout - Checking auth...");
//     if (!isAuthenticated && !user) {
//       dispatch(checkAuthStatus());
//     }
//   }, [dispatch, isAuthenticated, user]);

//   if (isLoading && !user) {
//     return (
//       <div
//         className="admin-layout"
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress color="inherit" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
//         <p>Error loading user data: {error}</p>
//         <Button onClick={() => dispatch(checkAuthStatus())}>Retry</Button>
//         <Button onClick={() => (window.location.href = "/login")}>Login</Button>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     console.log("Redirecting to login...");
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="app min-h-screen">
//       <ErrorBoundary>
//         <Sidebar />
//         <Content>
//           <Outlet />
//         </Content>
//         {sidebarContext?.isDrawerOpen && (
//           <AddNewUserDrawer
//             open={sidebarContext.isDrawerOpen}
//             onClose={() => sidebarContext.toggleDrawer(false, false)}
//             editMode={false}
//             initialData={{}}
//             uploadImageMode={sidebarContext.isUploadMode}
//           />
//         )}
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default AdminLayout;

// import React, { useContext, useEffect } from "react";
// import { SidebarContext } from "../../context/sidebarContext";
// import Sidebar from "../Sidebar/Sidebar";
// import Content from "../Content/Content";
// import { useDispatch, useSelector } from "react-redux";
// import { checkAuthStatus, logoutUser } from "../../redux/slices/authSlice"; // Add logoutUser
// import AddNewUserDrawer from "../../components/AddDrawerSection/AddNewUserDrawer";
// import ErrorBoundary from "../../error/ErrorBoundary";
// import { Outlet, Navigate } from "react-router-dom";
// import { CircularProgress, Button, Box } from "@mui/material";

// const AdminLayout = () => {
//   const dispatch = useDispatch();
//   const { user, isLoading, error, isAuthenticated, isVerified } = useSelector(
//     (state) => state.auth
//   );
//   const sidebarContext = useContext(SidebarContext) || {
//     isDrawerOpen: false,
//     isUploadMode: false,
//     toggleDrawer: () => {},
//   };

//   // Initial auth check and periodic validation
//   useEffect(() => {
//     // Initial check
//     if (!isAuthenticated && !user && !isLoading) {
//       dispatch(checkAuthStatus());
//     }

//     // Periodic token validation (every 60 seconds)
//     const interval = setInterval(() => {
//       if (isAuthenticated) {
//         dispatch(checkAuthStatus());
//       }
//     }, 60000); // Adjust interval as needed (e.g., 30000 for 30s)

//     return () => clearInterval(interval); // Cleanup
//   }, [dispatch, isAuthenticated, user, isLoading]);

//   // Immediate logout on token expiry or auth failure
//   useEffect(() => {
//     if (isAuthenticated && error === "Unauthorized: Token expired") {
//       console.log("Token expired, logging out...");
//       dispatch(logoutUser());
//     }
//   }, [dispatch, isAuthenticated, error]);

//   // Loading state
//   if (isLoading && !user) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           bgcolor: "#f9f9f9",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   // Error state
//   if (error && error !== "Unauthorized: Token expired") {
//     // Handle expiry separately
//     return (
//       <Box
//         sx={{
//           textAlign: "center",
//           padding: "20px",
//           color: "red",
//           bgcolor: "#fff",
//           minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           gap: 2,
//         }}
//       >
//         <p>Error: {error}</p>
//         <Button
//           variant="contained"
//           onClick={() => dispatch(checkAuthStatus())}
//           sx={{ bgcolor: "#fe6c00", "&:hover": { bgcolor: "#f19b46" } }}
//         >
//           Retry
//         </Button>
//         <Button
//           variant="outlined"
//           onClick={() => dispatch(logoutUser())}
//           sx={{ borderColor: "#fe6c00", color: "#fe6c00" }}
//         >
//           Logout
//         </Button>
//       </Box>
//     );
//   }

//   // Redirect if not authenticated
//   if (!isAuthenticated) {
//     console.log("AdminLayout - Not authenticated, redirecting to /login");
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="admin-layout">
//       <ErrorBoundary>
//         <Box sx={{ display: "flex", minHeight: "100vh" }}>
//           <Sidebar />
//           <Content>
//             <Outlet />
//           </Content>
//           {sidebarContext.isDrawerOpen && (
//             <AddNewUserDrawer
//               open={sidebarContext.isDrawerOpen}
//               onClose={() => sidebarContext.toggleDrawer(false, false)}
//               editMode={false}
//               initialData={{}}
//               uploadImageMode={sidebarContext.isUploadMode}
//             />
//           )}
//         </Box>
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default AdminLayout;

// import React, { useContext, useEffect } from "react";
// import { SidebarContext } from "../../context/sidebarContext";
// import Sidebar from "../Sidebar/Sidebar";
// import Content from "../Content/Content";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   checkAuthStatus,
//   logoutUser,
//   updateActivity,
// } from "../../redux/slices/authSlice";
// import AddNewUserDrawer from "../../components/AddDrawerSection/AddNewUserDrawer";
// import ErrorBoundary from "../../error/ErrorBoundary";
// import { Outlet, Navigate } from "react-router-dom";
// import { CircularProgress, Button, Box } from "@mui/material";
// import throttle from "lodash/throttle"; // Install lodash if not already: npm install lodash

// const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
// const CHECK_INTERVAL = 60 * 1000; // Check every minute

// const AdminLayout = () => {
//   const dispatch = useDispatch();
//   const { user, isLoading, error, isAuthenticated, isVerified, lastActivity } =
//     useSelector((state) => state.auth);
//   const sidebarContext = useContext(SidebarContext) || {
//     isDrawerOpen: false,
//     isUploadMode: false,
//     toggleDrawer: () => {},
//   };

//   // Initial auth check
//   useEffect(() => {
//     if (!isAuthenticated && !user && !isLoading) {
//       console.log("Initial auth check in AdminLayout");
//       dispatch(checkAuthStatus());
//     }
//   }, [dispatch, isAuthenticated, user, isLoading]);

//   // Track user activity with throttling
//   useEffect(() => {
//     const throttledUpdateActivity = throttle(() => {
//       console.log("User activity detected");
//       dispatch(updateActivity());
//     }, 1000); // Update every 1 second max

//     window.addEventListener("mousemove", throttledUpdateActivity);
//     window.addEventListener("keydown", throttledUpdateActivity);
//     return () => {
//       window.removeEventListener("mousemove", throttledUpdateActivity);
//       window.removeEventListener("keydown", throttledUpdateActivity);
//       throttledUpdateActivity.cancel(); // Clean up throttle
//     };
//   }, [dispatch]);

//   // Idle check
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const timeSinceLastActivity = Date.now() - lastActivity;
//       if (isAuthenticated && timeSinceLastActivity > IDLE_TIMEOUT) {
//         console.log("User idle for over 15 minutes, checking auth...");
//         dispatch(checkAuthStatus()).then((result) => {
//           if (result.type === "auth/checkAuthStatus/rejected") {
//             console.log("Token invalid after idle, logging out...");
//             dispatch(logoutUser());
//           }
//         });
//       }
//     }, CHECK_INTERVAL);

//     return () => clearInterval(interval);
//   }, [dispatch, isAuthenticated, lastActivity]); // Dependencies stable

//   // Loading state
//   if (isLoading && !user) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           bgcolor: "#f9f9f9",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   // Redirect if not authenticated or verified
//   if (!isAuthenticated || !isVerified) {
//     console.log(
//       "AdminLayout - Not authenticated/verified, redirecting to /login"
//     );
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="admin-layout">
//       <ErrorBoundary>
//         <Box sx={{ display: "flex", minHeight: "100vh" }}>
//           <Sidebar />
//           <Content>
//             <Outlet />
//           </Content>
//           {sidebarContext.isDrawerOpen && (
//             <AddNewUserDrawer
//               open={sidebarContext.isDrawerOpen}
//               onClose={() => sidebarContext.toggleDrawer(false, false)}
//               editMode={false}
//               initialData={{}}
//               uploadImageMode={sidebarContext.isUploadMode}
//             />
//           )}
//         </Box>
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default AdminLayout;

// import React, { useContext, useEffect } from "react";
// import { SidebarContext } from "../../context/sidebarContext";
// import Sidebar from "../Sidebar/Sidebar";
// import Content from "../Content/Content";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   checkAuthStatus,
//   logoutUser,
//   updateActivity,
// } from "../../redux/slices/authSlice";
// import AddNewUserDrawer from "../../components/AddDrawerSection/AddNewUserDrawer";
// import ErrorBoundary from "../../error/ErrorBoundary";
// import { Outlet, Navigate } from "react-router-dom";
// import { CircularProgress, Button, Box } from "@mui/material";

// const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

// const AdminLayout = () => {
//   const dispatch = useDispatch();
//   const { user, isLoading, error, isAuthenticated, isVerified, lastActivity } =
//     useSelector((state) => state.auth);
//   const sidebarContext = useContext(SidebarContext) || {
//     isDrawerOpen: false,
//     isUploadMode: false,
//     toggleDrawer: () => {},
//   };

//   // Initial auth check
//   useEffect(() => {
//     if (!isAuthenticated && !user && !isLoading) {
//       dispatch(checkAuthStatus());
//     }
//   }, [dispatch, isAuthenticated, user, isLoading]);

//   // Track user activity (e.g., clicks, typing)
//   useEffect(() => {
//     const handleActivity = () => {
//       dispatch(updateActivity());
//     };

//     window.addEventListener("mousemove", handleActivity);
//     window.addEventListener("keydown", handleActivity);
//     return () => {
//       window.removeEventListener("mousemove", handleActivity);
//       window.removeEventListener("keydown", handleActivity);
//     };
//   }, [dispatch]);

//   // Idle timeout check
//   useEffect(() => {
//     const checkIdle = setInterval(() => {
//       const timeSinceLastActivity = Date.now() - lastActivity;
//       if (isAuthenticated && timeSinceLastActivity > IDLE_TIMEOUT) {
//         console.log("User idle for too long, checking auth...");
//         dispatch(checkAuthStatus()).then((result) => {
//           if (result.type === "auth/checkAuthStatus/rejected") {
//             console.log("Token invalid after idle, logging out...");
//             dispatch(logoutUser());
//           }
//         });
//       }
//     }, 60000); // Check every minute, but only act after 15 minutes of inactivity

//     return () => clearInterval(checkIdle);
//   }, [dispatch, isAuthenticated, lastActivity]);

//   // Loading state
//   if (isLoading && !user) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           bgcolor: "#f9f9f9",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   // Redirect if not authenticated or verified
//   if (!isAuthenticated || !isVerified) {
//     console.log(
//       "AdminLayout - Not authenticated/verified, redirecting to /login"
//     );
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="admin-layout">
//       <ErrorBoundary>
//         <Box sx={{ display: "flex", minHeight: "100vh" }}>
//           <Sidebar />
//           <Content>
//             <Outlet />
//           </Content>
//           {sidebarContext.isDrawerOpen && (
//             <AddNewUserDrawer
//               open={sidebarContext.isDrawerOpen}
//               onClose={() => sidebarContext.toggleDrawer(false, false)}
//               editMode={false}
//               initialData={{}}
//               uploadImageMode={sidebarContext.isUploadMode}
//             />
//           )}
//         </Box>
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default AdminLayout;

// import React, { useContext } from "react";
// import { useSelector } from "react-redux";
// import { Outlet, Navigate } from "react-router-dom";
// import Sidebar from "../Sidebar/Sidebar";
// import Content from "../Content/Content";
// import AddNewUserDrawer from "../../components/AddDrawerSection/AddNewUserDrawer";
// import { SidebarContext } from "../../context/sidebarContext";
// import { Box } from "@mui/material";
// import ErrorBoundary from "../../error/ErrorBoundary";

// const AdminLayout = () => {
//   const { isAuthenticated, isVerified, user } = useSelector(
//     (state) => state.auth
//   );
//   const sidebarContext = useContext(SidebarContext) || {
//     isDrawerOpen: false,
//     isUploadMode: false,
//     toggleDrawer: () => {},
//   };

//   if (!isAuthenticated || !isVerified || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="admin-layout">
//       <ErrorBoundary>
//         <Box sx={{ display: "flex", minHeight: "100vh" }}>
//           <Sidebar />
//           <Content>
//             <Outlet />
//           </Content>
//           {sidebarContext.isDrawerOpen && (
//             <AddNewUserDrawer
//               open={sidebarContext.isDrawerOpen}
//               onClose={() => sidebarContext.toggleDrawer(false, false)}
//               editMode={false}
//               initialData={{}}
//               uploadImageMode={sidebarContext.isUploadMode}
//             />
//           )}
//         </Box>
//       </ErrorBoundary>
//     </div>
//   );
// };

// export default AdminLayout;

import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Content from "../Content/Content";
import AddNewUserDrawer from "../../components/AddDrawerSection/AddNewUserDrawer";
import { SidebarContext } from "../../context/sidebarContext";
import { Box } from "@mui/material";
import ErrorBoundary from "../../error/ErrorBoundary";

const AdminLayout = () => {
  // const { isAuthenticated, isVerified, user } = useSelector(
  //   (state) => state.auth
  // );
  const sidebarContext = useContext(SidebarContext) || {
    isDrawerOpen: false,
    isUploadMode: false,
    toggleDrawer: () => {},
  };

  // Redirect to login if not authenticated, verified, or user is missing
  // if (!isAuthenticated || !isVerified || !user) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <div className="admin-layout">
      <ErrorBoundary>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <Content>
            <Outlet />
          </Content>
          {sidebarContext.isDrawerOpen && (
            <AddNewUserDrawer
              open={sidebarContext.isDrawerOpen}
              onClose={() => sidebarContext.toggleDrawer(false, false)}
              editMode={false}
              initialData={{}}
              uploadImageMode={sidebarContext.isUploadMode}
            />
          )}
        </Box>
      </ErrorBoundary>
    </div>
  );
};

export default AdminLayout;
