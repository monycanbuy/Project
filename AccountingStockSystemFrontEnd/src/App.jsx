// import React, { useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { checkAuthStatus } from "./redux/slices/authSlice";
// import { hasPermission } from "./utils/authUtils";
// import { Box, Typography, Button } from "@mui/material";

// import "./App.css";
// import "./StyledCss.css";
// import Login from "./layout/Authentication/LoginAuth/Login";
// import OTPRequest from "./layout/Authentication/RequestOtpSection/OTPRequest";
// import VerifyVerificationCode from "./layout/Authentication/VerifyVerificationCodeSection/VerifyVerificationCode";
// import AdminLayout from "./layout/AdminLayout/AdminLayout";
// import SendForgotPasswordCode from "./layout/Authentication/SendForgotPassword/SendForgotPasswordCode";
// import VerifyForgotPasswordCode from "./layout/Authentication/VerifyForgotPassword/VerifyForgotPasswordCode";
// import AdminUsers from "./components/AuthenticationSection/AdminUsers";
// import Laundrys from "./components/LaundrysSection/Laundrys";
// import Laundries from "./components/LaundriesSection/Laundries";
// import Dishes from "./components/DishesSection/Dishes";
// import Category from "./components/CategorySection/Category";
// import OrderItems from "./components/OrderItemSection/OrderItem";
// import Seminar from "./components/SeminarSection/Seminar";
// import Kabasa from "./components/KabasaSection/Kabasa";
// import FrontOffice from "./components/FrontOfficeSection/FrontOffice";
// import Role from "./components/RoleSection/Role";
// import PaymentMethod from "./components/PaymentMethodSection/PaymentMethod";
// import HallTypes from "./components/HallTypesSection/HallTypes";
// import Hall from "./components/HallSection/Hall";
// import Suppliers from "./components/SupplierSection/Suppliers";
// import UnifiedSales from "./components/UnifiedSection/UnifiedSales";
// import SalesUnified from "./components/UnificationSection/SalesUnified";
// import Dashboard from "./components/DashBoardSection/Dashboard";
// import Location from "./components/LocationSection/Location";
// import Inventory from "./components/InventorySection/Inventory";
// import Alert from "./components/AlertsSection/Alert";
// import AuditLogs from "./components/AuditLogSection/AuditLog";
// import InventoryAdjustment from "./components/InventoryAdjustmentSection/InventoryAdjustment";
// import PurchaseOrder from "./components/PurchaseOrderSection/PurchaseOrder";
// import StockMovement from "./components/StockMovementSection/StockMovement";
// import UnifiedTransaction from "./components/UnifiedTransactionSection/UnifiedTransaction";
// import EmailVerificationPage from "./layout/Authentication/Pages/EmailVerificationPage";
// import ForgotPasswordPage from "./layout/Authentication/Pages/ForgotPasswordPage";
// import ResetPasswordPage from "./layout/Authentication/Pages/ResetPasswordPage";
// import AuthLayouts from "./layout/AuthLayout/AuthLayouts";
// import Profile from "./components/ProfileSection/Profile";

// function App() {
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const isVerified = useSelector((state) => state.auth.isVerified);
//   const forgotPasswordEmail = useSelector(
//     (state) => state.auth.forgotPasswordEmail
//   );
//   const authStatus = useSelector((state) => state.auth.status);
//   const user = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     if (authStatus === "idle") {
//       dispatch(checkAuthStatus());
//     }
//   }, [dispatch, authStatus]);

//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated || !isVerified || !user) {
//       // FIX: Reordered conditions
//       console.log(
//         "ProtectedRoute blocked: not authenticated, verified, or user data missing",
//         {
//           user,
//           isAuthenticated,
//           isVerified,
//         }
//       );
//       return <Navigate to="/login" replace />;
//     }
//     console.log(
//       "ProtectedRoute allowed: user authenticated and verified",
//       user
//     );
//     return children;
//   };

//   const UnauthorizedPage = () => (
//     <Box sx={{ textAlign: "center", padding: "20px", color: "#fff" }}>
//       <Typography variant="h5">Unauthorized</Typography>
//       <Typography>You don’t have permission to access this area.</Typography>
//       <Button
//         variant="contained"
//         onClick={() => (window.location.href = "/admin")}
//         sx={{ mt: 2 }}
//       >
//         Go to Dashboard
//       </Button>
//     </Box>
//   );

//   return (
//     <Router>
//       <Routes>
//         <Route element={<AuthLayouts />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/request-otp" element={<OTPRequest />} />
//           <Route path="/forgot-password" element={<SendForgotPasswordCode />} />
//           <Route
//             path="/verification-page"
//             element={<EmailVerificationPage />}
//           />
//           <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
//           <Route path="/reset-password" element={<ResetPasswordPage />} />
//           <Route
//             path="/verify-forgot-password-code"
//             element={
//               forgotPasswordEmail ? (
//                 <VerifyForgotPasswordCode />
//               ) : (
//                 <Navigate to="/forgot-password" replace />
//               )
//             }
//           />
//         </Route>

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           {hasPermission(user, "read:users") && (
//             <Route path="users" element={<AdminUsers />} />
//           )}
//           {hasPermission(user, "read:laundryService") && (
//             <Route path="laundryservice" element={<Laundrys />} />
//           )}
//           {hasPermission(user, "read:laundries") && (
//             <Route path="laundries" element={<Laundries />} />
//           )}
//           {hasPermission(user, "read:dishes") && (
//             <Route path="dishes" element={<Dishes />} />
//           )}
//           {hasPermission(user, "read:categories") && (
//             <Route path="category" element={<Category />} />
//           )}
//           {hasPermission(user, "read:orderitems") && (
//             <Route path="orderitem" element={<OrderItems />} />
//           )}
//           {hasPermission(user, "read:seminars") && (
//             <Route path="seminar" element={<Seminar />} />
//           )}
//           {hasPermission(user, "read:kabsa") && (
//             <Route path="kabsa" element={<Kabasa />} />
//           )}
//           {hasPermission(user, "read:frontoffice") && (
//             <Route path="front-office" element={<FrontOffice />} />
//           )}
//           {hasPermission(user, "read:roles") && (
//             <Route path="roles" element={<Role />} />
//           )}
//           {hasPermission(user, "read:paymentmethod") && (
//             <Route path="payment-methods" element={<PaymentMethod />} />
//           )}
//           {hasPermission(user, "read:halltypes") && (
//             <Route path="hall-types" element={<HallTypes />} />
//           )}
//           {hasPermission(user, "read:hall") && (
//             <Route path="hall" element={<Hall />} />
//           )}
//           {hasPermission(user, "read:unified-sales") && (
//             <Route path="unified-sales" element={<UnifiedSales />} />
//           )}
//           {hasPermission(user, "read:suppliers") && (
//             <Route path="suppliers" element={<Suppliers />} />
//           )}
//           {hasPermission(user, "read:inventory") && (
//             <Route path="inventory" element={<Inventory />} />
//           )}
//           {hasPermission(user, "read:sales-unified") && (
//             <Route path="sales-unified" element={<SalesUnified />} />
//           )}
//           {hasPermission(user, "read:dashboard") && (
//             <Route path="dashboard" element={<Dashboard />} />
//           )}
//           {hasPermission(user, "read:locations") && (
//             <Route path="locations" element={<Location />} />
//           )}
//           {hasPermission(user, "read:alerts") && (
//             <Route path="alerts" element={<Alert />} />
//           )}
//           {hasPermission(user, "read:auditlogs") && (
//             <Route path="audit-logs" element={<AuditLogs />} />
//           )}
//           {hasPermission(user, "read:inventoryAdjustment") && (
//             <Route
//               path="inventory-adjustment"
//               element={<InventoryAdjustment />}
//             />
//           )}
//           {hasPermission(user, "read:purchaseorders") && (
//             <Route path="purchase-order" element={<PurchaseOrder />} />
//           )}
//           {hasPermission(user, "read:stockMovement") && (
//             <Route path="stock-movement" element={<StockMovement />} />
//           )}
//           {hasPermission(user, "read:salestransactions") && (
//             <Route
//               path="unified-transaction"
//               element={<UnifiedTransaction />}
//             />
//           )}

//           <Route path="profile" element={<Profile />} />
//         </Route>

//         <Route
//           path="*"
//           element={
//             isAuthenticated && isVerified && user ? (
//               <UnauthorizedPage />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

//App.jsx;
// import React, { useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { checkAuthStatus } from "./redux/slices/authSlice";
// import { hasPermission } from "./utils/authUtils";
// import { Box, CircularProgress, Typography, Button } from "@mui/material";

// import "./App.css";
// import "./StyledCss.css";
// import Login from "./layout/Authentication/LoginAuth/Login";
// import OTPRequest from "./layout/Authentication/RequestOtpSection/OTPRequest";
// import VerifyVerificationCode from "./layout/Authentication/VerifyVerificationCodeSection/VerifyVerificationCode";
// import AdminLayout from "./layout/AdminLayout/AdminLayout";
// import SendForgotPasswordCode from "./layout/Authentication/SendForgotPassword/SendForgotPasswordCode";
// import VerifyForgotPasswordCode from "./layout/Authentication/VerifyForgotPassword/VerifyForgotPasswordCode";
// import AdminUsers from "./components/AuthenticationSection/AdminUsers";
// import Laundrys from "./components/LaundrysSection/Laundrys";
// import Laundries from "./components/LaundriesSection/Laundries";
// import Dishes from "./components/DishesSection/Dishes";
// import Category from "./components/CategorySection/Category";
// import OrderItems from "./components/OrderItemSection/OrderItem";
// import Seminar from "./components/SeminarSection/Seminar";
// import Kabasa from "./components/KabasaSection/Kabasa";
// import FrontOffice from "./components/FrontOfficeSection/FrontOffice";
// import Role from "./components/RoleSection/Role";
// import PaymentMethod from "./components/PaymentMethodSection/PaymentMethod";
// import HallTypes from "./components/HallTypesSection/HallTypes";
// import Hall from "./components/HallSection/Hall";
// import Suppliers from "./components/SupplierSection/Suppliers";
// import UnifiedSales from "./components/UnifiedSection/UnifiedSales";
// import SalesUnified from "./components/UnificationSection/SalesUnified";
// import Dashboard from "./components/DashBoardSection/Dashboard";
// import Location from "./components/LocationSection/Location";
// import Inventory from "./components/InventorySection/Inventory";
// import Alert from "./components/AlertsSection/Alert";
// import AuditLogs from "./components/AuditLogSection/AuditLog";
// import InventoryAdjustment from "./components/InventoryAdjustmentSection/InventoryAdjustment";
// import PurchaseOrder from "./components/PurchaseOrderSection/PurchaseOrder";
// import StockMovement from "./components/StockMovementSection/StockMovement";
// import UnifiedTransaction from "./components/UnifiedTransactionSection/UnifiedTransaction";
// import EmailVerificationPage from "./layout/Authentication/Pages/EmailVerificationPage";
// import ForgotPasswordPage from "./layout/Authentication/Pages/ForgotPasswordPage";
// import ResetPasswordPage from "./layout/Authentication/Pages/ResetPasswordPage";
// import AuthLayouts from "./layout/AuthLayout/AuthLayouts";
// import Profile from "./components/ProfileSection/Profile";

// function App() {
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const isVerified = useSelector((state) => state.auth.isVerified);
//   const forgotPasswordEmail = useSelector(
//     (state) => state.auth.forgotPasswordEmail
//   );
//   const status = useSelector((state) => state.auth.status);
//   const user = useSelector((state) => state.auth.user);

//   useEffect(() => {
//     dispatch(checkAuthStatus()); // Unconditional initial check
//     const intervalId = setInterval(() => {
//       dispatch(checkAuthStatus()); // Periodic check every 15 minutes
//     }, 15 * 60 * 1000); // 900,000 ms

//     return () => clearInterval(intervalId); // Cleanup on unmount
//   }, [dispatch]);

//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated || !isVerified || !user) {
//       console.log(
//         "ProtectedRoute blocked: not authenticated, verified, or user data missing",
//         { user, isAuthenticated, isVerified }
//       );
//       return <Navigate to="/login" replace />;
//     }
//     console.log(
//       "ProtectedRoute allowed: user authenticated and verified",
//       user
//     );
//     return children;
//   };

//   const UnauthorizedPage = () => (
//     <Box sx={{ textAlign: "center", padding: "20px", color: "#fff" }}>
//       <Typography variant="h5">Unauthorized</Typography>
//       <Typography>You don’t have permission to access this area.</Typography>
//       <Button
//         variant="contained"
//         onClick={() => (window.location.href = "/admin")}
//         sx={{ mt: 2 }}
//       >
//         Go to Dashboard
//       </Button>
//     </Box>
//   );

//   // Show loading spinner during auth check
//   if (status === "loading") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           //backgroundColor: "rgba(0, 0, 0, 0.8)", // Optional: dark overlay
//           background:
//             "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//         }}
//       >
//         <CircularProgress color="#fe6c00" size={60} />
//       </Box>
//     );
//   }

//   return (
//     <Router>
//       <Routes>
//         <Route element={<AuthLayouts />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/request-otp" element={<OTPRequest />} />
//           <Route path="/forgot-password" element={<SendForgotPasswordCode />} />
//           <Route
//             path="/verification-page"
//             element={<EmailVerificationPage />}
//           />
//           <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
//           <Route path="/reset-password" element={<ResetPasswordPage />} />
//           <Route
//             path="/verify-forgot-password-code"
//             element={
//               forgotPasswordEmail ? (
//                 <VerifyForgotPasswordCode />
//               ) : (
//                 <Navigate to="/forgot-password" replace />
//               )
//             }
//           />
//         </Route>

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute>
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           {hasPermission(user, "read:users") && (
//             <Route path="users" element={<AdminUsers />} />
//           )}
//           {hasPermission(user, "read:laundryService") && (
//             <Route path="laundryservice" element={<Laundrys />} />
//           )}
//           {hasPermission(user, "read:laundries") && (
//             <Route path="laundries" element={<Laundries />} />
//           )}
//           {hasPermission(user, "read:dishes") && (
//             <Route path="dishes" element={<Dishes />} />
//           )}
//           {hasPermission(user, "read:categories") && (
//             <Route path="category" element={<Category />} />
//           )}
//           {hasPermission(user, "read:orderitems") && (
//             <Route path="orderitem" element={<OrderItems />} />
//           )}
//           {hasPermission(user, "read:seminars") && (
//             <Route path="seminar" element={<Seminar />} />
//           )}
//           {hasPermission(user, "read:kabsa") && (
//             <Route path="kabsa" element={<Kabasa />} />
//           )}
//           {hasPermission(user, "read:frontoffice") && (
//             <Route path="front-office" element={<FrontOffice />} />
//           )}
//           {hasPermission(user, "read:roles") && (
//             <Route path="roles" element={<Role />} />
//           )}
//           {hasPermission(user, "read:paymentmethod") && (
//             <Route path="payment-methods" element={<PaymentMethod />} />
//           )}
//           {hasPermission(user, "read:halltypes") && (
//             <Route path="hall-types" element={<HallTypes />} />
//           )}
//           {hasPermission(user, "read:hall") && (
//             <Route path="hall" element={<Hall />} />
//           )}
//           {hasPermission(user, "read:unified-sales") && (
//             <Route path="unified-sales" element={<UnifiedSales />} />
//           )}
//           {hasPermission(user, "read:suppliers") && (
//             <Route path="suppliers" element={<Suppliers />} />
//           )}
//           {hasPermission(user, "read:inventory") && (
//             <Route path="inventory" element={<Inventory />} />
//           )}
//           {hasPermission(user, "read:sales-unified") && (
//             <Route path="sales-unified" element={<SalesUnified />} />
//           )}
//           {hasPermission(user, "read:dashboard") && (
//             <Route path="dashboard" element={<Dashboard />} />
//           )}
//           {hasPermission(user, "read:locations") && (
//             <Route path="locations" element={<Location />} />
//           )}
//           {hasPermission(user, "read:alerts") && (
//             <Route path="alerts" element={<Alert />} />
//           )}
//           {hasPermission(user, "read:auditlogs") && (
//             <Route path="audit-logs" element={<AuditLogs />} />
//           )}
//           {hasPermission(user, "read:inventoryAdjustment") && (
//             <Route
//               path="inventory-adjustment"
//               element={<InventoryAdjustment />}
//             />
//           )}
//           {hasPermission(user, "read:purchaseorders") && (
//             <Route path="purchase-order" element={<PurchaseOrder />} />
//           )}
//           {hasPermission(user, "read:stockMovement") && (
//             <Route path="stock-movement" element={<StockMovement />} />
//           )}
//           {hasPermission(user, "read:salestransactions") && (
//             <Route
//               path="unified-transaction"
//               element={<UnifiedTransaction />}
//             />
//           )}
//           <Route path="profile" element={<Profile />} />
//         </Route>

//         <Route
//           path="*"
//           element={
//             isAuthenticated && isVerified && user ? (
//               <UnauthorizedPage />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus } from "./redux/slices/authSlice";
import { hasPermission } from "./utils/authUtils";
import { Box, CircularProgress, Typography, Button } from "@mui/material";

import "./App.css";
import "./StyledCss.css";
import Login from "./layout/Authentication/LoginAuth/Login";
import OTPRequest from "./layout/Authentication/RequestOtpSection/OTPRequest";
import VerifyVerificationCode from "./layout/Authentication/VerifyVerificationCodeSection/VerifyVerificationCode";
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import SendForgotPasswordCode from "./layout/Authentication/SendForgotPassword/SendForgotPasswordCode";
import VerifyForgotPasswordCode from "./layout/Authentication/VerifyForgotPassword/VerifyForgotPasswordCode";
import AdminUsers from "./components/AuthenticationSection/AdminUsers";
import Laundrys from "./components/LaundrysSection/Laundrys";
import Laundries from "./components/LaundriesSection/Laundries";
import Dishes from "./components/DishesSection/Dishes";
import Category from "./components/CategorySection/Category";
import OrderItems from "./components/OrderItemSection/OrderItem";
import Seminar from "./components/SeminarSection/Seminar";
import Kabasa from "./components/KabasaSection/Kabasa";
import FrontOffice from "./components/FrontOfficeSection/FrontOffice";
import Role from "./components/RoleSection/Role";
import PaymentMethod from "./components/PaymentMethodSection/PaymentMethod";
import HallTypes from "./components/HallTypesSection/HallTypes";
import Hall from "./components/HallSection/Hall";
import Suppliers from "./components/SupplierSection/Suppliers";
import UnifiedSales from "./components/UnifiedSection/UnifiedSales";
import SalesUnified from "./components/UnificationSection/SalesUnified";
import Dashboard from "./components/DashBoardSection/Dashboard";
import Location from "./components/LocationSection/Location";
import Inventory from "./components/InventorySection/Inventory";
import Alert from "./components/AlertsSection/Alert";
import AuditLogs from "./components/AuditLogSection/AuditLog";
import InventoryAdjustment from "./components/InventoryAdjustmentSection/InventoryAdjustment";
import PurchaseOrder from "./components/PurchaseOrderSection/PurchaseOrder";
import StockMovement from "./components/StockMovementSection/StockMovement";
import UnifiedTransaction from "./components/UnifiedTransactionSection/UnifiedTransaction";
import EmailVerificationPage from "./layout/Authentication/Pages/EmailVerificationPage";
import ForgotPasswordPage from "./layout/Authentication/Pages/ForgotPasswordPage";
import ResetPasswordPage from "./layout/Authentication/Pages/ResetPasswordPage";
import AuthLayouts from "./layout/AuthLayout/AuthLayouts";
import Profile from "./components/ProfileSection/Profile";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isVerified = useSelector((state) => state.auth.isVerified);
  const forgotPasswordEmail = useSelector(
    (state) => state.auth.forgotPasswordEmail
  );
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

  useEffect(() => {
    console.log("Initial state on mount:", {
      isAuthenticated,
      isVerified,
      user,
    });
    dispatch(checkAuthStatus())
      .unwrap()
      .then(() => console.log("Auth check succeeded"))
      .catch((error) => {
        console.error("Auth check failed:", error);
        if (error.status === 401 || error.status === 403) {
          window.location.href = "/login";
        }
      })
      .finally(() => setIsInitialCheckDone(true));

    const intervalId = setInterval(() => {
      dispatch(checkAuthStatus())
        .unwrap()
        .catch((error) => {
          console.error("Periodic auth check failed:", error);
          if (error.status === 401 || error.status === 403) {
            window.location.href = "/login";
          }
        });
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (!isInitialCheckDone || status === "loading") {
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

  const UnauthorizedPage = () => (
    <Box sx={{ textAlign: "center", padding: "20px", color: "#fff" }}>
      <Typography variant="h5">Unauthorized</Typography>
      <Typography>You don’t have permission to access this area.</Typography>
      <Button
        variant="contained"
        onClick={() => (window.location.href = "/admin")}
        sx={{ mt: 2 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );

  return (
    <Routes>
      <Route element={<AuthLayouts />}>
        <Route path="/login" element={<Login />} />
        <Route path="/request-otp" element={<OTPRequest />} />
        <Route path="/forgot-password" element={<SendForgotPasswordCode />} />
        <Route path="/verification-page" element={<EmailVerificationPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/verify-forgot-password-code"
          element={
            forgotPasswordEmail ? (
              <VerifyForgotPasswordCode />
            ) : (
              <Navigate to="/forgot-password" replace />
            )
          }
        />
      </Route>

      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="laundryservice" element={<Laundrys />} />
        <Route path="laundries" element={<Laundries />} />
        <Route path="dishes" element={<Dishes />} />
        <Route path="category" element={<Category />} />
        <Route path="orderitem" element={<OrderItems />} />
        <Route path="seminar" element={<Seminar />} />
        <Route path="kabsa" element={<Kabasa />} />
        <Route path="front-office" element={<FrontOffice />} />
        <Route path="roles" element={<Role />} />
        <Route path="payment-methods" element={<PaymentMethod />} />
        <Route path="hall-types" element={<HallTypes />} />
        <Route path="hall" element={<Hall />} />
        <Route path="unified-sales" element={<UnifiedSales />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="sales-unified" element={<SalesUnified />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="locations" element={<Location />} />
        <Route path="alerts" element={<Alert />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="inventory-adjustment" element={<InventoryAdjustment />} />
        <Route path="purchase-order" element={<PurchaseOrder />} />
        <Route path="stock-movement" element={<StockMovement />} />
        <Route path="unified-transaction" element={<UnifiedTransaction />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
