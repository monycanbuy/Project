// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAlerts, deleteAlert } from "../../redux/slices/alertsSlice";
// import AddNewAlertDrawer from "../AddDrawerSection/AddNewAlertDrawer";

// const Alerts = () => {
//   const dispatch = useDispatch();
//   const { alerts, isLoading, error } = useSelector((state) => state.alerts);
//   const [data, setData] = useState([]); // Initialize as an empty array
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [alertToDelete, setAlertToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAlerts());
//   }, [dispatch]);

//   useEffect(() => {
//     if (alerts && Array.isArray(alerts) && alerts.length > 0) {
//       const formattedData = alerts.map((alert) => [
//         alert.type,
//         alert.message,
//         alert.action,
//         alert.data,
//         alert.user.fullName,
//         alert.read ? "Read" : "Unread",
//         alert.status,
//         alert.createdAt, // Keep the raw date here.  We'll format it in the column definition.
//         alert._id,
//       ]);
//       setData(formattedData);
//     } else {
//       // Handle the case where there are no alerts or the data is not in the expected format.
//       //  Set data to an empty array to clear the table.
//       setData([]);
//       console.log("No alerts data available or data is not in expected format");
//     }
//   }, [alerts]);

//   const handleEditClick = (alert) => {
//     // simplified and corrected handleEditClick
//     setEditData(alert); // Pass the entire alert object
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (alertId) => {
//     setAlertToDelete(alertId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (alertToDelete) {
//       dispatch(deleteAlert(alertToDelete))
//         .then(() => {
//           dispatch(fetchAlerts()); // Refresh the list after delete
//           toast.success("Alert deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting alert: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setAlertToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setAlertToDelete(null);
//   };

//   const columns = [
//     { name: "Type", options: { filter: true, sort: true } },
//     { name: "Message", options: { filter: true, sort: false } },
//     { name: "Action", options: { filter: true, sort: false } },
//     {
//       name: "Data",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (data) => JSON.stringify(data),
//       },
//     },
//     { name: "User", options: { filter: true, sort: true } },
//     { name: "Status", options: { filter: true, sort: true } },
//     { name: "Alert Status", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         // Use customBodyRender to format the date *within* the column definition.
//         customBodyRender: (value) => {
//           //Check if the value is valid
//           if (!value) return "";

//           try {
//             return new Date(value).toLocaleString();
//           } catch (error) {
//             console.error("Error parsing date:", value);
//             return "Invalid Date"; // Return a placeholder or error message
//           }
//         },
//       },
//     },
//     {
//       name: "Action", // Corrected:  "Actions" -> "Action" to match your rendering
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const alertId = tableMeta.rowData[8]; // _id is now consistently in the 9th column (index 8)
//           const alert = alerts.find((a) => a._id === alertId); // find alert using id.
//           if (!alert) return null; // prevent displaying if no alert match the id

//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(alert)} // Pass the *entire alert object*
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(alertId)} //pass alert id.
//               ></i>
//             </>
//           );
//         },
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
//           "&:hover": {
//             backgroundColor: "#fec80a",
//             color: "#bdbabb",
//           },
//         }}
//       >
//         Add New Alert
//       </Button>
//     ),
//   };
//   // loadingData is now correctly structured for MUI DataTables.
//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//           width: "100%",
//         }}
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {error ? (
//           <div>Error: {error.message || "An error occurred."}</div>
//         ) : (
//           <>
//             <MUIDataTable
//               title={"Alerts"}
//               data={isLoading ? loadingData : data} // Use loadingData when isLoading is true
//               columns={columns}
//               options={options}
//             />
//             <AddNewAlertDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={handleCloseDialog}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Delete"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this alert?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleCloseDialog} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Alerts;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAlerts,
//   deleteAlert,
//   markAlertAsRead,
// } from "../../redux/slices/alertsSlice"; // Import markAlertAsRead
// import AddNewAlertDrawer from "../AddDrawerSection/AddNewAlertDrawer";

// const Alerts = () => {
//   const dispatch = useDispatch();
//   const { alerts, isLoading, error } = useSelector((state) => state.alerts);
//   const [data, setData] = useState([]); // Initialize as an empty array
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [alertToDelete, setAlertToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAlerts());
//   }, [dispatch]);

//   useEffect(() => {
//     if (alerts && Array.isArray(alerts)) {
//       const formattedData = alerts.map((alert) => [
//         alert.type,
//         alert.message,
//         alert.action,
//         alert.data,
//         alert.user ? alert.user.fullName : "N/A", // Handle potentially missing user
//         alert.read ? "Read" : "Unread",
//         alert.status,
//         alert.createdAt,
//         alert._id,
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]); //  Set to empty array if alerts is null/undefined/empty
//       console.log("No alerts data available or data is not in expected format");
//     }
//   }, [alerts]);

//   const handleEditClick = (alert) => {
//     setEditData(alert); // Pass the entire alert object
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (alertId) => {
//     setAlertToDelete(alertId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (alertToDelete) {
//       dispatch(deleteAlert(alertToDelete))
//         .then(() => {
//           dispatch(fetchAlerts()); // Refresh the list after delete
//           toast.success("Alert deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting alert: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setAlertToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setAlertToDelete(null);
//   };

//   // New function to handle marking an alert as read/unread
//   const handleToggleRead = (alertId) => {
//     dispatch(markAlertAsRead(alertId));
//   };

//   const columns = [
//     { name: "Type", options: { filter: true, sort: true } },
//     { name: "Message", options: { filter: true, sort: false } },
//     { name: "Action", options: { filter: true, sort: false } },
//     {
//       name: "Data",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (data) => JSON.stringify(data),
//       },
//     },
//     { name: "User", options: { filter: true, sort: true } },
//     { name: "Read Status", options: { filter: true, sort: true } }, // Show "Read Status", not just "Status"
//     { name: "Alert Status", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           if (!value) return "";
//           try {
//             return new Date(value).toLocaleString();
//           } catch (error) {
//             console.error("Error parsing date:", value);
//             return "Invalid Date";
//           }
//         },
//       },
//     },
//     {
//       name: "Action", // Keep this as "Action" for consistency
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const alertId = tableMeta.rowData[8];
//           const alert = alerts.find((a) => a._id === alertId);
//           if (!alert) return null;

//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(alert)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(alertId)}
//               ></i>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => handleToggleRead(alertId)}
//                 sx={{
//                   marginLeft: "12px",
//                   color: alert.read ? "green" : "#fe6c00", //  Color based on read status
//                   borderColor: alert.read ? "green" : "#fe6c00",
//                   "&:hover": {
//                     borderColor: alert.read ? "darkgreen" : "#fec80a",
//                     backgroundColor: alert.read
//                       ? "rgba(0, 128, 0, 0.04)"
//                       : "rgba(254, 108, 0, 0.04)", // Light background on hover
//                   },
//                 }}
//               >
//                 {alert.read ? "Mark Unread" : "Mark Read"}
//               </Button>
//             </>
//           );
//         },
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
//           "&:hover": {
//             backgroundColor: "#fec80a",
//             color: "#bdbabb",
//           },
//         }}
//       >
//         Add New Alert
//       </Button>
//     ),
//   };
//   // loadingData is now correctly structured for MUI DataTables.
//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//           width: "100%",
//         }}
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {error ? (
//           <div>Error: {error.message || "An error occurred."}</div>
//         ) : (
//           <>
//             <MUIDataTable
//               title={"Alerts"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewAlertDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={handleCloseDialog}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Delete"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this alert?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleCloseDialog} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Alerts;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAlerts,
//   deleteAlert,
//   markAlertAsRead,
// } from "../../redux/slices/alertsSlice"; // Import markAlertAsRead
// import AddNewAlertDrawer from "../AddDrawerSection/AddNewAlertDrawer";

// const Alerts = () => {
//   const dispatch = useDispatch();
//   const { alerts, status, error } = useSelector((state) => state.alerts);
//   const [data, setData] = useState([]); // Initialize as an empty array
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [alertToDelete, setAlertToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAlerts());
//   }, [dispatch]);

//   useEffect(() => {
//     if (alerts && Array.isArray(alerts)) {
//       const formattedData = alerts.map((alert) => [
//         alert.type,
//         alert.message,
//         alert.action,
//         alert.user ? alert.user.fullName : "N/A", // Handle potentially missing user
//         alert.read ? "Read" : "Unread",
//         alert.status,
//         new Date(alert.createdAt).toLocaleString(), // Format date here
//         alert._id,
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]); //  Set to empty array if alerts is null/undefined/empty
//       console.log("No alerts data available or data is not in expected format");
//     }
//   }, [alerts]);

//   const handleEditClick = (alert) => {
//     setEditData(alert); // Pass the entire alert object
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (alertId) => {
//     setAlertToDelete(alertId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (alertToDelete) {
//       dispatch(deleteAlert(alertToDelete))
//         .then(() => {
//           dispatch(fetchAlerts()); // Refresh the list after delete
//           toast.success("Alert deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting alert: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setAlertToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setAlertToDelete(null);
//   };

//   // New function to handle marking an alert as read/unread
//   const handleToggleRead = (alertId) => {
//     dispatch(markAlertAsRead(alertId));
//   };

//   const columns = [
//     { name: "Type", options: { filter: true, sort: true } },
//     { name: "Message", options: { filter: true, sort: false } },
//     { name: "Action", options: { filter: true, sort: false } },
//     { name: "User", options: { filter: true, sort: true } },
//     { name: "Read Status", options: { filter: true, sort: true } }, // Show "Read Status", not just "Status"
//     { name: "Alert Status", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           if (!value) return "";
//           try {
//             return new Date(value).toLocaleString();
//           } catch (error) {
//             console.error("Error parsing date:", value);
//             return "Invalid Date";
//           }
//         },
//       },
//     },
//     {
//       name: "Action", // Keep this as "Action" for consistency
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const alertId = tableMeta.rowData[7]; //7 instead of 8
//           const alert = alerts.find((a) => a._id === alertId);
//           if (!alert) return null;

//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(alert)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(alertId)}
//               ></i>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => handleToggleRead(alertId)}
//                 sx={{
//                   marginLeft: "12px",
//                   color: alert.read ? "green" : "#fe6c00", //  Color based on read status
//                   borderColor: alert.read ? "green" : "#fe6c00",
//                   "&:hover": {
//                     borderColor: alert.read ? "darkgreen" : "#fec80a",
//                     backgroundColor: alert.read
//                       ? "rgba(0, 128, 0, 0.04)"
//                       : "rgba(254, 108, 0, 0.04)", // Light background on hover
//                   },
//                 }}
//               >
//                 {alert.read ? "Mark Unread" : "Mark Read"}
//               </Button>
//             </>
//           );
//         },
//       },
//     },
//   ];

//   const theme = createTheme({
//     //theming configurations
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
//           "&:hover": {
//             backgroundColor: "#fec80a",
//             color: "#bdbabb",
//           },
//         }}
//       >
//         Add New Alert
//       </Button>
//     ),
//   };
//   // loadingData is now correctly structured for MUI DataTables.
//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//           width: "100%",
//         }}
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {error ? (
//           <div>Error: {error.message || "An error occurred."}</div>
//         ) : (
//           <>
//             <MUIDataTable
//               title={"Alerts"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewAlertDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={handleCloseDialog}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Delete"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this alert?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleCloseDialog} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Alerts;

import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
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
} from "@mui/material";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlerts,
  deleteAlert,
  markAlertAsRead,
} from "../../redux/slices/alertsSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice"; // Add this for auth check
import AddNewAlertDrawer from "../AddDrawerSection/AddNewAlertDrawer";

const Alerts = () => {
  const dispatch = useDispatch();
  const { alerts, status, error } = useSelector((state) => state.alerts);
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Add auth state
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);

  useEffect(() => {
    console.log("Alerts - Checking auth and fetching alerts...");
    if (isAuthenticated) {
      dispatch(fetchAlerts());
    } else {
      dispatch(checkAuthStatus()).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(fetchAlerts());
        }
      });
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    console.log("Alerts - State:", {
      alerts,
      status,
      error,
      isAuthenticated,
      user,
    });
    if (alerts && Array.isArray(alerts)) {
      const formattedData = alerts.map((alert) => [
        alert.type || "N/A",
        alert.message || "N/A",
        alert.action || "N/A",
        alert.user ? alert.user.fullName : "N/A",
        alert.read ? "Read" : "Unread",
        alert.status || "N/A",
        alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "N/A",
        alert._id || "N/A",
      ]);
      console.log("Alerts - Formatted Data:", formattedData);
      setData(formattedData);
    } else {
      setData([]);
      console.log("Alerts - No valid alerts data");
    }
  }, [alerts]);

  const handleEditClick = (alertId) => {
    const alert = alerts.find((a) => a._id === alertId);
    if (alert) {
      setEditData(alert);
      setDrawerOpen(true);
    }
  };

  const handleDeleteClick = (alertId) => {
    setAlertToDelete(alertId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (alertToDelete) {
      dispatch(deleteAlert(alertToDelete))
        .unwrap()
        .then(() => {
          toast.success("Alert deleted successfully!", { duration: 5000 });
          dispatch(fetchAlerts()); // Refresh after delete
        })
        .catch((err) => {
          console.error("Delete error:", err);
          toast.error(
            `Error deleting alert: ${err.message || "Unknown error"}`
          );
        });
    }
    setDeleteDialogOpen(false);
    setAlertToDelete(null);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setAlertToDelete(null);
  };

  const handleToggleRead = (alertId) => {
    dispatch(markAlertAsRead(alertId))
      .unwrap()
      .then(() => {
        toast.success("Alert status updated!");
        dispatch(fetchAlerts()); // Refresh to reflect change
      })
      .catch((err) => {
        console.error("Toggle read error:", err);
        toast.error(`Error updating alert: ${err.message || "Unknown error"}`);
        if (err.message === "Unauthorized: No token provided in cookies") {
          dispatch(checkAuthStatus()); // Retry auth if token issue
        }
      });
  };

  const columns = [
    { name: "Type", options: { filter: true, sort: true } },
    { name: "Message", options: { filter: true, sort: false } },
    { name: "Action", options: { filter: true, sort: false } },
    { name: "User", options: { filter: true, sort: true } },
    { name: "Read Status", options: { filter: true, sort: true } },
    { name: "Alert Status", options: { filter: true, sort: true } },
    {
      name: "Created At",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) =>
          value ? new Date(value).toLocaleString() : "N/A",
      },
    },
    {
      name: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const alertId = tableMeta.rowData[7];
          const alert = alerts.find((a) => a._id === alertId);
          if (!alert) return null;

          return (
            <>
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleEditClick(alertId)}
              ></i>
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleDeleteClick(alertId)}
              ></i>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleToggleRead(alertId)}
                sx={{
                  color: alert.read ? "green" : "#fe6c00",
                  borderColor: alert.read ? "green" : "#fe6c00",
                  "&:hover": {
                    borderColor: alert.read ? "darkgreen" : "#fec80a",
                    backgroundColor: alert.read
                      ? "rgba(0, 128, 0, 0.04)"
                      : "rgba(254, 108, 0, 0.04)",
                  },
                }}
              >
                {alert.read ? "Mark Unread" : "Mark Read"}
              </Button>
            </>
          );
        },
      },
    },
  ];

  const theme = createTheme({
    components: {
      MUIDataTable: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
            "& .MuiTableRow-root": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiTableCell-root": { color: "#bdbabb" },
              },
            },
            "& .MuiTableCell-root": { color: "#fff", fontSize: "18px" },
            "& .MuiTableRow-head": {
              backgroundColor: "#e0e0e0",
              "& .MuiTableCell-root": {
                color: "#000",
                fontSize: "18px",
                fontWeight: "bold",
              },
            },
            "& .MuiToolbar-root": {
              backgroundColor: "#d0d0d0",
              "& .MuiTypography-root": { fontSize: "18px" },
              "& .MuiIconButton-root": { color: "#3f51b5" },
            },
          },
        },
      },
    },
  });

  const options = {
    filterType: "checkbox",
    rowsPerPage: 10,
    customToolbar: () => (
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
          "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
        }}
      >
        Add New Alert
      </Button>
    ),
  };

  const loadingData = [
    [
      <Box
        key="loading"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress sx={{ color: "#fe6c00" }} />
      </Box>,
    ],
  ];

  return (
    <ThemeProvider theme={theme}>
      <div>
        {status === "failed" && error ? (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            Error:{" "}
            {typeof error === "string"
              ? error
              : error.message || "An error occurred"}
          </div>
        ) : (
          <>
            <MUIDataTable
              title="Alerts"
              data={status === "loading" ? loadingData : data}
              columns={columns}
              options={options}
            />
            <AddNewAlertDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
            />
            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this alert?
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
          </>
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default Alerts;
