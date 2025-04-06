// // AdminUsers.jsx
// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Tab,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllUsers,
//   checkAuthStatus,
//   deleteUser,
// } from "../../redux/slices/authSlice";
// import { fetchRoles } from "../../redux/slices/roleSlice";
// import AddNewUserDrawer from "../AddDrawerSection/AddNewUserDrawer";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import AdminReports from "./Reports/AdminReports";
// import { Toaster, toast } from "react-hot-toast"; // Re-import toaster

// const AdminUsers = () => {
//   const dispatch = useDispatch();
//   const {
//     users,
//     isLoading: authLoading,
//     error: authError,
//     isAuthenticated,
//   } = useSelector((state) => state.auth);
//   const {
//     list: roles,
//     status: rolesStatus,
//     error: rolesError,
//   } = useSelector((state) => state.roles);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [value, setValue] = useState("0");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Add dialog state
//   const [userToDelete, setUserToDelete] = useState(null); // Track user to delete

//   useEffect(() => {
//     console.log("AdminUsers - Initial fetch...");
//     if (isAuthenticated) {
//       dispatch(fetchAllUsers());
//       dispatch(fetchRoles());
//     } else {
//       dispatch(checkAuthStatus());
//     }
//   }, [dispatch, isAuthenticated]);

//   useEffect(() => {
//     console.log("AdminUsers - State:", { users, roles, authError, rolesError });
//     if (users && Array.isArray(users)) {
//       const formattedData = users.map((user) => [
//         user.fullName || "N/A",
//         user.email || "N/A",
//         user.phoneNumber || "N/A",
//         //user.roles?.[0]?.name || "No Role",
//         user.roles && user.roles.length > 0
//           ? user.roles.map((role) => role.name).join(", ")
//           : "No Role",
//         user.status || "N/A",
//         user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
//         user._id || "N/A",
//         user.verified ?? false,
//         user.isLocked ?? false,
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]);
//     }
//   }, [users]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleEditClick = (userRow) => {
//     if (!userRow || userRow.length < 9) {
//       console.error("Invalid user data:", userRow);
//       return;
//     }
//     const originalUser = users.find((u) => u._id === userRow[6]);
//     if (!originalUser) {
//       console.error("User not found:", userRow[6]);
//       return;
//     }
//     const userData = {
//       _id: userRow[6],
//       fullName: userRow[0],
//       email: userRow[1],
//       phoneNumber: userRow[2],
//       status: originalUser.status || "active",
//       roles: originalUser.roles || [],
//       verified: userRow[7],
//       isLocked: userRow[8],
//       availableRoles: roles,
//     };
//     console.log("Edit Data:", userData);
//     setEditData(userData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (userId) => {
//     setUserToDelete(userId);
//     setDeleteDialogOpen(true); // Open dialog
//   };

//   const handleConfirmDelete = () => {
//     if (userToDelete) {
//       dispatch(deleteUser(userToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("User deleted successfully!", { duration: 5000 });
//           dispatch(fetchAllUsers());
//         })
//         .catch((error) => {
//           toast.error(
//             "Failed to delete user: " + (error.message || "Unknown error"),
//             { duration: 5000 }
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     { name: "Email", options: { filter: true, sort: false } },
//     { name: "Phone Number", options: { filter: true, sort: false } },
//     { name: "Role", options: { filter: true, sort: true } },
//     {
//       name: "Status",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color:
//                 value === "active"
//                   ? "green"
//                   : value === "suspended"
//                   ? "orange"
//                   : "red",
//             }}
//           >
//             {value.charAt(0).toUpperCase() + value.slice(1)}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "Verified",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color: value ? "green" : "red",
//               backgroundColor: "#fff",
//               fontSize: "0.8rem",
//               borderRadius: "12px",
//               padding: "5px 10px",
//             }}
//           >
//             {value ? "Verified" : "Not Verified"}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Is Locked",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color: value ? "red" : "green",
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               padding: "10px",
//               fontSize: "0.8rem",
//             }}
//           >
//             {value ? "Locked" : "Unlocked"}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => (
//           <>
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(tableMeta.rowData)}
//             ></i>
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(tableMeta.rowData[6])}
//             ></i>
//           </>
//         ),
//       },
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MUIDataTable: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
//             "& .MuiTableRow-root": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiTableCell-root": { color: "#bdbabb" },
//               },
//             },
//             "& .MuiTableCell-root": { color: "#fff", fontSize: "18px" },
//             "& .MuiTableRow-head": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiTableCell-root": {
//                 color: "#000",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               },
//             },
//             "& .MuiToolbar-root": {
//               backgroundColor: "#d0d0d0",
//               "& .MuiTypography-root": { fontSize: "18px" },
//               "& .MuiIconButton-root": { color: "#3f51b5" },
//             },
//           },
//         },
//       },
//       MuiTab: {
//         styleOverrides: {
//           root: {
//             color: "#fff", // Default color when not selected
//             "&.Mui-selected": {
//               color: "#fe6c00", // Color when selected
//             },
//             "&:hover": {
//               color: "#fe6c00", // Color on hover
//             },
//           },
//         },
//       },
//       MuiTabs: {
//         styleOverrides: {
//           indicator: {
//             backgroundColor: "#fe6c00", // Color of the indicator when selected
//           },
//         },
//       },
//     },
//   });

//   const options = {
//     filterType: "checkbox",
//     rowsPerPage: 10,
//     customToolbar: () => (
//       <Button
//         variant="contained"
//         size="small"
//         onClick={() => {
//           setEditData(null);
//           setDrawerOpen(true);
//         }}
//         sx={{
//           backgroundColor: "#fe6c00",
//           color: "#fff",
//           "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
//         }}
//       >
//         Add New User
//       </Button>
//     ),
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Admin Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {authLoading ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "200px",
//               }}
//             >
//               <CircularProgress sx={{ color: "#fe6c00" }} />
//             </Box>
//           ) : authError ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {authError}
//               <Button onClick={() => dispatch(checkAuthStatus())}>Retry</Button>
//             </div>
//           ) : data.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "20px" }}>
//               No users found
//             </div>
//           ) : (
//             <MUIDataTable
//               title="Employee List"
//               data={data}
//               columns={columns}
//               options={options}
//             />
//           )}
//           <AddNewUserDrawer
//             open={drawerOpen}
//             onClose={() => {
//               setDrawerOpen(false);
//               setEditData(null);
//             }}
//             editMode={!!editData}
//             initialData={editData || { availableRoles: roles }}
//           />
//           <Dialog
//             open={deleteDialogOpen}
//             onClose={handleCloseDialog}
//             aria-labelledby="alert-dialog-title"
//             aria-describedby="alert-dialog-description"
//           >
//             <DialogTitle id="alert-dialog-title">
//               {"Confirm Delete"}
//             </DialogTitle>
//             <DialogContent>
//               <DialogContentText id="alert-dialog-description">
//                 Are you sure you want to delete this user?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseDialog} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </TabPanel>
//         <TabPanel value="1">
//           <AdminReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster /> {/* Re-add toaster */}
//     </ThemeProvider>
//   );
// };

// export default AdminUsers;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Tab,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllUsers,
//   checkAuthStatus,
//   deleteUser,
// } from "../../redux/slices/authSlice";
// import { fetchRoles } from "../../redux/slices/roleSlice";
// import { hasPermission } from "../../utils/authUtils"; // Add this import
// import AddNewUserDrawer from "../AddDrawerSection/AddNewUserDrawer";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import AdminReports from "./Reports/AdminReports";
// import { Toaster, toast } from "react-hot-toast";

// const AdminUsers = () => {
//   const dispatch = useDispatch();
//   const {
//     users,
//     isLoading: authLoading,
//     error: authError,
//     isAuthenticated,
//     user, // Add current user
//   } = useSelector((state) => state.auth);
//   const {
//     list: roles,
//     status: rolesStatus,
//     error: rolesError,
//   } = useSelector((state) => state.roles);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [value, setValue] = useState("0");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);

//   useEffect(() => {
//     console.log("AdminUsers - Initial fetch...");
//     if (isAuthenticated) {
//       dispatch(fetchAllUsers());
//       dispatch(fetchRoles());
//     } else {
//       dispatch(checkAuthStatus());
//     }
//   }, [dispatch, isAuthenticated]);

//   useEffect(() => {
//     console.log("AdminUsers - State:", { users, roles, authError, rolesError });
//     if (users && Array.isArray(users)) {
//       const formattedData = users.map((user) => [
//         user.fullName || "N/A",
//         user.email || "N/A",
//         user.phoneNumber || "N/A",
//         user.roles && user.roles.length > 0
//           ? user.roles.map((role) => role.name).join(", ")
//           : "No Role",
//         user.status || "N/A",
//         user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
//         user._id || "N/A",
//         user.verified ?? false,
//         user.isLocked ?? false,
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]);
//     }
//   }, [users]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleEditClick = (userRow) => {
//     if (!userRow || userRow.length < 9) {
//       console.error("Invalid user data:", userRow);
//       return;
//     }
//     const originalUser = users.find((u) => u._id === userRow[6]);
//     if (!originalUser) {
//       console.error("User not found:", userRow[6]);
//       return;
//     }
//     const userData = {
//       _id: userRow[6],
//       fullName: userRow[0],
//       email: userRow[1],
//       phoneNumber: userRow[2],
//       status: originalUser.status || "active",
//       roles: originalUser.roles || [],
//       verified: userRow[7],
//       isLocked: userRow[8],
//       availableRoles: roles,
//     };
//     console.log("Edit Data:", userData);
//     setEditData(userData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (userId) => {
//     setUserToDelete(userId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (userToDelete) {
//       dispatch(deleteUser(userToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("User deleted successfully!", { duration: 5000 });
//           dispatch(fetchAllUsers());
//         })
//         .catch((error) => {
//           toast.error(
//             "Failed to delete user: " + (error.message || "Unknown error"),
//             { duration: 5000 }
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     { name: "Email", options: { filter: true, sort: false } },
//     { name: "Phone Number", options: { filter: true, sort: false } },
//     { name: "Role", options: { filter: true, sort: true } },
//     {
//       name: "Status",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color:
//                 value === "active"
//                   ? "green"
//                   : value === "suspended"
//                   ? "orange"
//                   : "red",
//             }}
//           >
//             {value.charAt(0).toUpperCase() + value.slice(1)}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "Verified",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color: value ? "green" : "red",
//               backgroundColor: "#fff",
//               fontSize: "0.8rem",
//               borderRadius: "12px",
//               padding: "5px 10px",
//             }}
//           >
//             {value ? "Verified" : "Not Verified"}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Is Locked",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color: value ? "red" : "green",
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               padding: "10px",
//               fontSize: "0.8rem",
//             }}
//           >
//             {value ? "Locked" : "Unlocked"}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => (
//           <>
//             {hasPermission(user, "update:users") && (
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(tableMeta.rowData)}
//               ></i>
//             )}
//             {hasPermission(user, "delete:users") && (
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(tableMeta.rowData[6])}
//               ></i>
//             )}
//           </>
//         ),
//       },
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MUIDataTable: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
//             "& .MuiTableRow-root": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiTableCell-root": { color: "#bdbabb" },
//               },
//             },
//             "& .MuiTableCell-root": { color: "#fff", fontSize: "18px" },
//             "& .MuiTableRow-head": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiTableCell-root": {
//                 color: "#000",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               },
//             },
//             "& .MuiToolbar-root": {
//               backgroundColor: "#d0d0d0",
//               "& .MuiTypography-root": { fontSize: "18px" },
//               "& .MuiIconButton-root": { color: "#3f51b5" },
//             },
//           },
//         },
//       },
//       MuiTab: {
//         styleOverrides: {
//           root: {
//             color: "#fff",
//             "&.Mui-selected": { color: "#fe6c00" },
//             "&:hover": { color: "#fe6c00" },
//           },
//         },
//       },
//       MuiTabs: {
//         styleOverrides: {
//           indicator: { backgroundColor: "#fe6c00" },
//         },
//       },
//     },
//   });

//   const options = {
//     filterType: "checkbox",
//     rowsPerPage: 10,
//     customToolbar: () =>
//       hasPermission(user, "write:users") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={() => {
//             setEditData(null);
//             setDrawerOpen(true);
//           }}
//           sx={{
//             backgroundColor: "#fe6c00",
//             color: "#fff",
//             "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
//           }}
//         >
//           Add New User
//         </Button>
//       ) : null,
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Admin Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {authLoading ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "200px",
//               }}
//             >
//               <CircularProgress sx={{ color: "#fe6c00" }} />
//             </Box>
//           ) : authError ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {authError}
//               <Button onClick={() => dispatch(checkAuthStatus())}>Retry</Button>
//             </div>
//           ) : data.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "20px" }}>
//               No users found
//             </div>
//           ) : (
//             <MUIDataTable
//               title="Employee List"
//               data={data}
//               columns={columns}
//               options={options}
//             />
//           )}
//           <AddNewUserDrawer
//             open={drawerOpen}
//             onClose={() => {
//               setDrawerOpen(false);
//               setEditData(null);
//             }}
//             editMode={!!editData}
//             initialData={editData || { availableRoles: roles }}
//           />
//           <Dialog
//             open={deleteDialogOpen}
//             onClose={handleCloseDialog}
//             aria-labelledby="alert-dialog-title"
//             aria-describedby="alert-dialog-description"
//           >
//             <DialogTitle id="alert-dialog-title">
//               {"Confirm Delete"}
//             </DialogTitle>
//             <DialogContent>
//               <DialogContentText id="alert-dialog-description">
//                 Are you sure you want to delete this user?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseDialog} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </TabPanel>
//         <TabPanel value="1">
//           <AdminReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default AdminUsers;

// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Tab,
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllUsers,
//   checkAuthStatus,
//   deleteUser,
// } from "../../redux/slices/authSlice";
// import { fetchRoles } from "../../redux/slices/roleSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewUserDrawer from "../AddDrawerSection/AddNewUserDrawer";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import AdminReports from "./Reports/AdminReports";
// import { Toaster, toast } from "react-hot-toast";

// const AdminUsers = () => {
//   const dispatch = useDispatch();
//   const {
//     users,
//     isLoading: authLoading,
//     error: authError,
//     isAuthenticated,
//     user,
//   } = useSelector((state) => state.auth);
//   const {
//     list: roles,
//     status: rolesStatus,
//     error: rolesError,
//   } = useSelector((state) => state.roles);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [value, setValue] = useState("0");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);

//   useEffect(() => {
//     console.log("AdminUsers - Initial fetch...");
//     if (isAuthenticated) {
//       dispatch(fetchAllUsers());
//       dispatch(fetchRoles());
//     } else {
//       dispatch(checkAuthStatus());
//     }
//   }, [dispatch, isAuthenticated]);

//   const rows = users
//     ? users.map((user) => ({
//         id: user._id, // Required by DataGrid
//         fullName: user.fullName || "N/A",
//         email: user.email || "N/A",
//         phoneNumber: user.phoneNumber || "N/A",
//         roles:
//           user.roles && user.roles.length > 0
//             ? user.roles.map((role) => role.name).join(", ")
//             : "No Role",
//         status: user.status || "N/A",
//         createdAt: user.createdAt
//           ? new Date(user.createdAt).toLocaleString()
//           : "N/A",
//         verified: user.verified ?? false,
//         isLocked: user.isLocked ?? false,
//       }))
//     : [];

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleEditClick = (userRow) => {
//     const originalUser = users.find((u) => u._id === userRow.id);
//     if (!originalUser) {
//       console.error("User not found:", userRow.id);
//       return;
//     }
//     const userData = {
//       _id: originalUser._id,
//       fullName: originalUser.fullName,
//       email: originalUser.email,
//       phoneNumber: originalUser.phoneNumber,
//       status: originalUser.status || "active",
//       roles: originalUser.roles || [],
//       verified: originalUser.verified,
//       isLocked: originalUser.isLocked,
//       availableRoles: roles,
//     };
//     console.log("Edit Data:", userData);
//     setEditData(userData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (userId) => {
//     setUserToDelete(userId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (userToDelete) {
//       dispatch(deleteUser(userToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("User deleted successfully!", { duration: 5000 });
//           dispatch(fetchAllUsers());
//         })
//         .catch((error) => {
//           toast.error(
//             "Failed to delete user: " + (error.message || "Unknown error"),
//             { duration: 5000 }
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   const columns = [
//     {
//       field: "fullName",
//       headerName: "Name",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "email",
//       headerName: "Email",
//       width: 200,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "phoneNumber",
//       headerName: "Phone Number",
//       width: 150,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "roles",
//       headerName: "Role",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 120,
//       filterable: true,
//       sortable: true,
//       renderCell: (params) => (
//         <span
//           style={{
//             color:
//               params.value === "active"
//                 ? "green"
//                 : params.value === "suspended"
//                 ? "orange"
//                 : "red",
//           }}
//         >
//           {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
//         </span>
//       ),
//     },
//     {
//       field: "createdAt",
//       headerName: "Created At",
//       width: 180,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "verified",
//       headerName: "Verified",
//       width: 120,
//       filterable: true,
//       sortable: true,
//       renderCell: (params) => (
//         <span
//           style={{
//             color: params.value ? "green" : "red",
//             backgroundColor: "#fff",
//             fontSize: "0.8rem",
//             borderRadius: "12px",
//             padding: "5px 10px",
//           }}
//         >
//           {params.value ? "Verified" : "Not Verified"}
//         </span>
//       ),
//     },
//     {
//       field: "isLocked",
//       headerName: "Is Locked",
//       width: 120,
//       filterable: true,
//       sortable: true,
//       renderCell: (params) => (
//         <span
//           style={{
//             color: params.value ? "red" : "green",
//             backgroundColor: "#fff",
//             borderRadius: "12px",
//             padding: "10px",
//             fontSize: "0.8rem",
//           }}
//         >
//           {params.value ? "Locked" : "Unlocked"}
//         </span>
//       ),
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       width: 150,
//       filterable: false,
//       sortable: false,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:users") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(params.row)}
//             />
//           )}
//           {hasPermission(user, "delete:users") && (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(params.row.id)}
//             />
//           )}
//         </>
//       ),
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MuiDataGrid: {
//         styleOverrides: {
//           root: {
//             backgroundColor: "#f0f0f0",
//             "& .MuiDataGrid-row": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiDataGrid-cell": { color: "#bdbabb" },
//               },
//             },
//             "& .MuiDataGrid-cell": { color: "#fff", fontSize: "18px" },
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiDataGrid-columnHeaderTitle": {
//                 color: "#000",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               },
//             },
//             "& .MuiDataGrid-toolbarContainer": {
//               backgroundColor: "#d0d0d0",
//               "& .MuiButton-root": { color: "#3f51b5" },
//             },
//           },
//         },
//       },
//       MuiTab: {
//         styleOverrides: {
//           root: {
//             color: "#fff",
//             "&.Mui-selected": { color: "#fe6c00" },
//             "&:hover": { color: "#fe6c00" },
//           },
//         },
//       },
//       MuiTabs: {
//         styleOverrides: {
//           indicator: { backgroundColor: "#fe6c00" },
//         },
//       },
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Admin Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {authLoading ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "200px",
//               }}
//             >
//               <CircularProgress sx={{ color: "#fe6c00" }} />
//             </Box>
//           ) : authError ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {authError}
//               <Button onClick={() => dispatch(checkAuthStatus())}>Retry</Button>
//             </div>
//           ) : rows.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "20px" }}>
//               No users found
//             </div>
//           ) : (
//             <Box sx={{ height: 600, width: "100%" }}>
//               <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 pageSizeOptions={[10, 20, 50]}
//                 initialState={{
//                   pagination: { paginationModel: { pageSize: 10 } },
//                 }}
//                 checkboxSelection={false}
//                 disableRowSelectionOnClick
//                 slots={{
//                   toolbar: () =>
//                     hasPermission(user, "write:users") ? (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => {
//                           setEditData(null);
//                           setDrawerOpen(true);
//                         }}
//                         sx={{
//                           backgroundColor: "#fe6c00",
//                           color: "#fff",
//                           "&:hover": {
//                             backgroundColor: "#fec80a",
//                             color: "#bdbabb",
//                           },
//                           m: 1,
//                         }}
//                       >
//                         Add New User
//                       </Button>
//                     ) : null,
//                 }}
//               />
//             </Box>
//           )}
//           <AddNewUserDrawer
//             open={drawerOpen}
//             onClose={() => {
//               setDrawerOpen(false);
//               setEditData(null);
//             }}
//             editMode={!!editData}
//             initialData={editData || { availableRoles: roles }}
//           />
//           <Dialog
//             open={deleteDialogOpen}
//             onClose={handleCloseDialog}
//             aria-labelledby="alert-dialog-title"
//             aria-describedby="alert-dialog-description"
//           >
//             <DialogTitle id="alert-dialog-title">
//               {"Confirm Delete"}
//             </DialogTitle>
//             <DialogContent>
//               <DialogContentText id="alert-dialog-description">
//                 Are you sure you want to delete this user?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseDialog} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </TabPanel>
//         <TabPanel value="1">
//           <AdminReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default AdminUsers;

import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Toaster, toast } from "react-hot-toast";
import {
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Tab,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
import PrintIcon from "@mui/icons-material/Print"; // Print icon
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  checkAuthStatus,
  deleteUser,
} from "../../redux/slices/authSlice";
import { fetchRoles } from "../../redux/slices/roleSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewUserDrawer from "../AddDrawerSection/AddNewUserDrawer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AdminReports from "./Reports/AdminReports";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const {
    users,
    isLoading: authLoading,
    error: authError,
    isAuthenticated,
    user,
  } = useSelector((state) => state.auth);
  const {
    list: roles,
    status: rolesStatus,
    error: rolesError,
  } = useSelector((state) => state.roles);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [value, setValue] = useState("0");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    //console.log("AdminUsers - Initial fetch...");
    if (isAuthenticated) {
      dispatch(fetchAllUsers());
      dispatch(fetchRoles());
    } else {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    //console.log("AdminUsers - State:", { users, roles, authError, rolesError });
    if (users && Array.isArray(users)) {
      const formattedData = users.map((user) => ({
        id: user._id,
        fullName: user.fullName || "N/A",
        email: user.email || "N/A",
        phoneNumber: user.phoneNumber || "N/A",
        roles:
          user.roles && user.roles.length > 0
            ? user.roles.map((role) => role.name).join(", ")
            : "No Role",
        status: user.status || "N/A",
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleString()
          : "N/A",
        verified: user.verified ?? false,
        isLocked: user.isLocked ?? false,
      }));
      setData(formattedData);
      setFilteredData(formattedData); // Initialize filtered data
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [users]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEditClick = useCallback(
    (userRow) => {
      const originalUser = users.find((u) => u._id === userRow.id);
      if (!originalUser) {
        console.error("User not found:", userRow.id);
        return;
      }
      const userData = {
        _id: originalUser._id,
        fullName: originalUser.fullName,
        email: originalUser.email,
        phoneNumber: originalUser.phoneNumber,
        status: originalUser.status || "active",
        roles: originalUser.roles || [],
        verified: originalUser.verified,
        isLocked: originalUser.isLocked,
        availableRoles: roles,
      };
      //console.log("Edit Data:", userData);
      setEditData(userData);
      setDrawerOpen(true);
    },
    [users, roles]
  );

  const handleDeleteClick = useCallback((userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete))
        .unwrap()
        .then(() => {
          toast.success("User deleted successfully!", { duration: 5000 });
          dispatch(fetchAllUsers());
        })
        .catch((error) => {
          toast.error(
            "Failed to delete user: " + (error.message || "Unknown error"),
            { duration: 5000 }
          );
        });
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }, [dispatch, userToDelete]);

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSearch = (searchVal) => {
    setSearchText(searchVal);
    if (searchVal.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) =>
        Object.values(row).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchVal.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  };

  const handleExport = () => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredData
      .map((row) =>
        columns
          .map(
            (col) =>
              `"${(row[col.field] || "").toString().replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");
    const csvContent = `${headers}\n${csvRows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "admin_users.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      filterable: true,
      sortable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      filterable: true,
      sortable: false,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      filterable: true,
      sortable: false,
    },
    {
      field: "roles",
      headerName: "Role",
      flex: 1,
      filterable: true,
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <span
          style={{
            color:
              params.value === "active"
                ? "green"
                : params.value === "suspended"
                ? "orange"
                : "red",
          }}
        >
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      filterable: true,
      sortable: true,
    },
    {
      field: "verified",
      headerName: "Verified",
      flex: 1,
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "green" : "red",
            backgroundColor: "#fff",
            fontSize: "0.8rem",
            borderRadius: "12px",
            padding: "5px 10px",
          }}
        >
          {params.value ? "Verified" : "Not Verified"}
        </span>
      ),
    },
    {
      field: "isLocked",
      headerName: "Is Locked",
      flex: 1,
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <span
          style={{
            color: params.value ? "red" : "green",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "10px",
            fontSize: "0.8rem",
          }}
        >
          {params.value ? "Locked" : "Unlocked"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:users") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleEditClick(params.row)}
            />
          )}
          {hasPermission(user, "delete:users") && (
            <i
              className="bx bx-trash"
              style={{
                color: "#fe1e00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleDeleteClick(params.row.id)}
            />
          )}
        </>
      ),
    },
  ];

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": {
              backgroundColor: "#f0f0f0",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiDataGrid-cell": {
                  color: "#bdbabb",
                },
              },
            },
            "& .MuiDataGrid-cell": {
              color: "#fff",
              fontSize: "18px",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e0e0e0",
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#000",
                fontSize: "18px",
                fontWeight: "bold",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#29221d", // Match row background
              color: "#fcfcfc", // Light text for visibility
              "& .MuiTablePagination-root": {
                color: "#fcfcfc",
              },
              "& .MuiIconButton-root": {
                color: "#fcfcfc",
              },
            },
            "@media print": {
              "& .MuiDataGrid-main": {
                color: "#000", // Ensure text is readable when printing
              },
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: "#fff",
            "&.Mui-selected": { color: "#fe6c00" },
            "&:hover": { color: "#fe6c00" },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { backgroundColor: "#fe6c00" },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="admin tabs">
            <Tab label="Admin Table" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {authLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress sx={{ color: "#fe6c00" }} />
            </Box>
          ) : authError ? (
            <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
              Error: {authError}
              <Button onClick={() => dispatch(checkAuthStatus())}>Retry</Button>
            </div>
          ) : filteredData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              No users found
            </div>
          ) : (
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  padding: "8px",
                  backgroundColor: "#d0d0d0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  "@media print": {
                    display: "none",
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: "#000" }}>
                  Admin Users
                </Typography>
                <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
                  />
                  <IconButton
                    onClick={handleExport}
                    sx={{
                      color: "#473b33",
                      "&:hover": { color: "#fec80a" },
                    }}
                    title="Download CSV"
                  >
                    <GetAppIcon />
                  </IconButton>
                  <IconButton
                    onClick={handlePrint}
                    sx={{
                      color: "#302924",
                      "&:hover": { color: "#fec80a" },
                    }}
                    title="Print"
                  >
                    <PrintIcon />
                  </IconButton>
                  {hasPermission(user, "write:users") && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setEditData(null);
                        setDrawerOpen(true);
                      }}
                      sx={{
                        backgroundColor: "#fe6c00",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#fec80a",
                          color: "#bdbabb",
                        },
                      }}
                    >
                      Add New User
                    </Button>
                  )}
                </Box>
              </Box>
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={filteredData}
                  columns={columns}
                  pageSizeOptions={[10, 20, 50]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  disableSelectionOnClick
                />
              </Box>
            </Box>
          )}
          <AddNewUserDrawer
            open={drawerOpen}
            onClose={() => {
              setDrawerOpen(false);
              setEditData(null);
            }}
            editMode={!!editData}
            initialData={editData || { availableRoles: roles }}
          />
          <Dialog
            open={deleteDialogOpen}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this user?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
        <TabPanel value="1">
          <AdminReports />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default AdminUsers;
