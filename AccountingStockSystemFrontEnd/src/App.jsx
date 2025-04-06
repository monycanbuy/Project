// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { checkAuthStatus, fetchUserDetails } from "./redux/slices/authSlice";
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
// import Customer from "./components/CustomerSection/Customer";
// import Account from "./components/AccountSection/Account";
// import Debtors from "./components/DebtorsSection/Debtors";
// import LedgerTransaction from "./components/LedgerSection/LedgerTransaction";
// import AccountSale from "./components/AccountSaleSection/AccountSale";
// import PettyCash from "./components/PettyCashSection/PettyCash";

// function App() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const isVerified = useSelector((state) => state.auth.isVerified);
//   const forgotPasswordEmail = useSelector(
//     (state) => state.auth.forgotPasswordEmail
//   );
//   const status = useSelector((state) => state.auth.status);
//   const user = useSelector((state) => state.auth.user);
//   const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

//   // useEffect(() => {
//   //   console.log("Initial state on mount:", {
//   //     isAuthenticated,
//   //     isVerified,
//   //     user,
//   //   });
//   //   dispatch(checkAuthStatus())
//   //     .unwrap()
//   //     .then(() => console.log("Auth check succeeded"))
//   //     .catch((error) => {
//   //       console.error("Auth check failed:", error);
//   //       if (error.status === 401 || error.status === 403) {
//   //         window.location.href = "/login";
//   //       }
//   //     })
//   //     .finally(() => setIsInitialCheckDone(true));

//   //   const intervalId = setInterval(() => {
//   //     dispatch(checkAuthStatus())
//   //       .unwrap()
//   //       .catch((error) => {
//   //         console.error("Periodic auth check failed:", error);
//   //         if (error.status === 401 || error.status === 403) {
//   //           window.location.href = "/login";
//   //         }
//   //       });
//   //   }, 15 * 60 * 1000);

//   //   return () => clearInterval(intervalId);
//   // }, [dispatch]);

//   useEffect(() => {
//     // Run only once on mount if user is not yet loaded
//     if (!user) {
//       console.log("Running initial auth check...");
//       dispatch(checkAuthStatus())
//         .unwrap()
//         .then((data) => {
//           console.log("Auth check succeeded:", data);
//           // If authenticated, fetch user details once
//           if (data.isAuthenticated) {
//             dispatch(fetchUserDetails())
//               .unwrap()
//               .then((userData) =>
//                 console.log("Fetched user details:", userData)
//               )
//               .catch((err) => console.error("Fetch user details failed:", err));
//           }
//         })
//         .catch((error) => {
//           console.error("Auth check failed:", error);
//           // if (error.status === 401 || error.status === 403) {
//           //   window.location.href = "/login";
//           // }
//         })
//         .finally(() => setIsInitialCheckDone(true));
//     } else {
//       // If user is already in state, skip fetch
//       console.log("User already loaded, skipping initial fetch:", user);
//       setIsInitialCheckDone(true);
//     }

//     // No periodic interval needed since we rely on Redux persistence
//   }, [dispatch, user]);

//   if (!isInitialCheckDone || status === "loading") {
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
//     <Routes>
//       <Route element={<AuthLayouts />}>
//         <Route path="/login" element={<Login />} />
//         <Route path="/request-otp" element={<OTPRequest />} />
//         <Route path="/forgot-password" element={<SendForgotPasswordCode />} />
//         <Route path="/verification-page" element={<EmailVerificationPage />} />
//         <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
//         <Route path="/reset-password" element={<ResetPasswordPage />} />
//         <Route
//           path="/verify-forgot-password-code"
//           element={
//             forgotPasswordEmail ? (
//               <VerifyForgotPasswordCode />
//             ) : (
//               <Navigate to="/forgot-password" replace />
//             )
//           }
//         />
//       </Route>

//       <Route path="/admin/*" element={<AdminLayout />}>
//         <Route index element={<Dashboard />} />
//         <Route path="users" element={<AdminUsers />} />
//         <Route path="laundryservice" element={<Laundrys />} />
//         <Route path="laundries" element={<Laundries />} />
//         <Route path="dishes" element={<Dishes />} />
//         <Route path="category" element={<Category />} />
//         <Route path="orderitem" element={<OrderItems />} />
//         <Route path="seminar" element={<Seminar />} />
//         <Route path="kabsa" element={<Kabasa />} />
//         <Route path="front-office" element={<FrontOffice />} />
//         <Route path="roles" element={<Role />} />
//         <Route path="payment-methods" element={<PaymentMethod />} />
//         <Route path="hall-types" element={<HallTypes />} />
//         <Route path="hall" element={<Hall />} />
//         <Route path="unified-sales" element={<UnifiedSales />} />
//         <Route path="suppliers" element={<Suppliers />} />
//         <Route path="inventory" element={<Inventory />} />
//         <Route path="sales-unified" element={<SalesUnified />} />
//         <Route path="dashboard" element={<Dashboard />} />
//         <Route path="locations" element={<Location />} />
//         <Route path="alerts" element={<Alert />} />
//         <Route path="audit-logs" element={<AuditLogs />} />
//         <Route path="inventory-adjustment" element={<InventoryAdjustment />} />
//         <Route path="purchase-order" element={<PurchaseOrder />} />
//         <Route path="stock-movement" element={<StockMovement />} />
//         <Route path="unified-transaction" element={<UnifiedTransaction />} />
//         <Route path="profile" element={<Profile />} />
//         <Route path="customer" element={<Customer />} />
//         <Route path="accounts" element={<Account />} />
//         <Route path="debtors" element={<Debtors />} />
//         <Route path="ledger-transactions" element={<LedgerTransaction />} />
//         <Route path="sales" element={<AccountSale />} />
//         <Route path="petty-cash" element={<PettyCash />} />
//         <Route path="*" element={<Navigate to="/admin" replace />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/login" replace />} />
//     </Routes>
//   );
// }

// export default function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus, fetchUserDetails } from "./redux/slices/authSlice";
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
import Customer from "./components/CustomerSection/Customer";
import Account from "./components/AccountSection/Account";
import Debtors from "./components/DebtorsSection/Debtors";
import LedgerTransaction from "./components/LedgerSection/LedgerTransaction";
import AccountSale from "./components/AccountSaleSection/AccountSale";
import PettyCash from "./components/PettyCashSection/PettyCash";
import SessionExpiredDialog from "./components/SessionSection/SessionExpiredDialog";

function App() {
  // const dispatch = useDispatch();
  // const location = useLocation();
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const isVerified = useSelector((state) => state.auth.isVerified);
  // const forgotPasswordEmail = useSelector(
  //   (state) => state.auth.forgotPasswordEmail
  // );
  // const status = useSelector((state) => state.auth.status);
  // const user = useSelector((state) => state.auth.user);
  // const sessionExpired = useSelector((state) => state.auth.sessionExpired); // Add this
  // const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isVerified = useSelector((state) => state.auth.isVerified);
  const forgotPasswordEmail = useSelector(
    (state) => state.auth.forgotPasswordEmail
  );
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const sessionExpired = useSelector((state) => state.auth.sessionExpired);
  const token = useSelector((state) => state.auth.token);
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

  // useEffect(() => {
  //   console.log("Running initial auth check...");
  //   dispatch(checkAuthStatus())
  //     .unwrap()
  //     .then((data) => {
  //       console.log("Auth check succeeded:", data);
  //       if (data.isAuthenticated) {
  //         dispatch(fetchUserDetails())
  //           .unwrap()
  //           .then((userData) => console.log("Fetched user details:", userData))
  //           .catch((err) => console.error("Fetch user details failed:", err));
  //       }
  //     })
  //     .catch((error) => console.error("Auth check failed:", error))
  //     .finally(() => setIsInitialCheckDone(true));
  // }, [dispatch]);

  // if (!isInitialCheckDone || status === "loading") {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <CircularProgress color="#fe6c00" size={60} />
  //     </Box>
  //   );
  // }

  // useEffect(() => {
  //   console.log("Running initial auth check...");
  //   dispatch(checkAuthStatus())
  //     .unwrap()
  //     .then((data) => {
  //       console.log("Auth check succeeded:", data);
  //       if (data.isAuthenticated) {
  //         dispatch(fetchUserDetails())
  //           .unwrap()
  //           .then((userData) => console.log("Fetched user details:", userData))
  //           .catch((err) => console.error("Fetch user details failed:", err));
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Auth check failed:", error);
  //     })
  //     .finally(() => setIsInitialCheckDone(true));
  // }, [dispatch]);

  // useEffect(() => {
  //   console.log("App.jsx sessionExpired changed:", sessionExpired);
  // }, [sessionExpired]);

  // useEffect(() => {
  //   console.log("Running initial auth check...");
  //   dispatch(checkAuthStatus())
  //     .unwrap()
  //     .then((data) => {
  //       console.log("Auth check succeeded:", data);
  //       if (data.isAuthenticated) {
  //         dispatch(fetchUserDetails())
  //           .unwrap()
  //           .then((userData) => console.log("Fetched user details:", userData))
  //           .catch((err) => console.error("Fetch user details failed:", err));
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Auth check failed:", error);
  //       // Don’t redirect here; let the interceptor handle it
  //     })
  //     .finally(() => setIsInitialCheckDone(true));

  //   // Optional: Uncomment this for periodic checks if needed
  //   // const intervalId = setInterval(() => {
  //   //   dispatch(checkAuthStatus())
  //   //     .unwrap()
  //   //     .catch((error) => {
  //   //       console.error("Periodic auth check failed:", error);
  //   //     });
  //   // }, 15 * 60 * 1000);
  //   // return () => clearInterval(intervalId);
  // }, [dispatch]);
  useEffect(() => {
    //console.log("Running initial auth check...");
    dispatch(checkAuthStatus())
      .unwrap()
      .then()
      //.catch((error) => console.error("Auth check failed:", error))
      // .catch((error) => console.error("Auth check failed:", error))
      .finally(() => setIsInitialCheckDone(true));
  }, [dispatch]);

  if (!isInitialCheckDone || status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
    <>
      <Routes>
        <Route element={<AuthLayouts />}>
          <Route path="/login" element={<Login />} />
          <Route path="/request-otp" element={<OTPRequest />} />
          <Route path="/forgot-password" element={<SendForgotPasswordCode />} />
          <Route
            path="/verification-page"
            element={<EmailVerificationPage />}
          />
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
          <Route
            path="inventory-adjustment"
            element={<InventoryAdjustment />}
          />
          <Route path="purchase-order" element={<PurchaseOrder />} />
          <Route path="stock-movement" element={<StockMovement />} />
          <Route path="unified-transaction" element={<UnifiedTransaction />} />
          <Route path="profile" element={<Profile />} />
          <Route path="customer" element={<Customer />} />
          <Route path="accounts" element={<Account />} />
          <Route path="debtors" element={<Debtors />} />
          <Route path="ledger-transactions" element={<LedgerTransaction />} />
          <Route path="sales" element={<AccountSale />} />
          <Route path="petty-cash" element={<PettyCash />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <SessionExpiredDialog /> {/* Add the dialog here */}
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
