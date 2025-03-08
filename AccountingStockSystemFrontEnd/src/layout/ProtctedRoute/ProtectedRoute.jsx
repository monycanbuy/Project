// ProtectedRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children, isAuthenticated }) => {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;

// ProtectedRoute.jsx
// ProtectedRoute.jsx
// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ allowedStep, redirectPath = "/login" }) => {
//   const { isSendingCode, isVerifyingCode, isAuthenticated } = useSelector(
//     (state) => state.auth
//   );

//   // Check if the route is part of the password reset flow
//   if (allowedStep === "sendCode" || allowedStep === "verifyCode") {
//     // Ensure the user is in the correct step of the password reset process
//     if (
//       (allowedStep === "sendCode" && !isSendingCode) ||
//       (allowedStep === "verifyCode" && (!isVerifyingCode || !isSendingCode))
//     ) {
//       return <Navigate to={redirectPath} replace />;
//     }
//   } else {
//     // For all other routes, check if the user is authenticated
//     if (!isAuthenticated) {
//       return <Navigate to="/login" replace />;
//     }
//   }

//   // If all conditions are met, render the protected route
//   return <Outlet />;
// };

// export default ProtectedRoute;

// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ condition, children, redirectPath = "/login" }) => {
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   console.log(isAuthenticated);
//   console.log("Children:", children);
//   // Check if the user is authenticated for routes not related to password reset
//   if (!condition) {
//     return <Navigate to={redirectPath} replace />;
//   }

//   return <Outlet />;
//   // return <>{children}</>;
// };

// export default ProtectedRoute;

// import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ condition, children, redirectPath = "/login" }) => {
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   // UseEffect for debugging to track re-renders
//   useEffect(() => {
//     console.log("ProtectedRoute re-render", { isAuthenticated, condition });
//   }, [isAuthenticated, condition]);

//   // Log values for debugging
//   console.log("Is Authenticated:", isAuthenticated);
//   console.log("Condition:", condition);

//   // Ensure no early return before hooks are executed
//   if (!condition) {
//     return <Navigate to={redirectPath} replace />;
//   }

//   return children; // Removed fragment for simplicity, but keep if needed for context
// };

// export default ProtectedRoute;
// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// const ProtectedRoute = ({ condition, children, redirectPath = "/login" }) => {
//   const { isAuthenticated, isLoading, user, error } = useSelector(
//     (state) => state.auth
//   );
//   const dispatch = useDispatch();
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     console.log("Effect ran:", {
//       token: localStorage.getItem("accessToken"),
//       user,
//       isLoading,
//     });

//     const initializeAuth = async () => {
//       const token = localStorage.getItem("accessToken");
//       console.log("Protected Route Mount:", {
//         token: !!token,
//         isAuthenticated,
//         user: !!user,
//         isLoading,
//       });

//       if (token && !user && !isLoading) {
//         try {
//           await dispatch(fetchUserDetails()).unwrap();
//         } catch (err) {
//           console.error("Failed to fetch user details:", err);
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");
//         }
//       }
//       setIsInitialized(true);
//     };

//     initializeAuth();
//   }, []); // Empty dependency array to run this effect only once on mount

//   // ... rest of the component ...
// };

// export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../redux/slices/authSlice"; // Adjust path if needed

const ProtectedRoute = ({ condition, children, redirectPath = "/login" }) => {
  const { isAuthenticated, isLoading, user, error } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("ProtectedRoute - Initial state:", {
      isAuthenticated,
      isLoading,
      user: !!user,
      error,
    });

    const initializeAuth = async () => {
      // No need to check localStorage since we're using cookies
      if (!user && !isLoading && isAuthenticated) {
        console.log("Fetching user details in ProtectedRoute...");
        try {
          await dispatch(fetchUserDetails()).unwrap();
        } catch (err) {
          console.error("Failed to fetch user details:", err);
          // Optionally clear cookies if needed, but not localStorage
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, user, isLoading, isAuthenticated]);

  // Wait for initialization to complete
  if (!isInitialized || (isLoading && !user)) {
    console.log("ProtectedRoute - Waiting for initialization or loading...");
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log(
      "ProtectedRoute - Not authenticated, redirecting to:",
      redirectPath
    );
    return <Navigate to={redirectPath} replace />;
  }

  // Render children if authenticated
  console.log("ProtectedRoute - Rendering children for authenticated user");
  return children;
};

export default ProtectedRoute;
