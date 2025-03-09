// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSalesTransactions,
//   voidSalesTransaction,
// } from "../../redux/slices/salesTransactionSlice";
// import {
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Box,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import UnifiedTransactionReport from "./Reports/UnifiedTransactionReport";
// import AddNewUnifiedTransactionDrawer from "../AddNewUnifiedTransactionDrawer";

// const UnifiedTransaction = () => {
//   const dispatch = useDispatch();
//   const { salesTransactions, status, error } = useSelector(
//     (state) => state.salesTransactions
//   );
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [saleToVoid, setSaleToVoid] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     const fetchSales = () => {
//       setIsFetching(true);
//       dispatch(fetchSalesTransactions()).finally(() => setIsFetching(false));
//     };

//     const debounceFetch = setTimeout(fetchSales, 300);
//     return () => clearTimeout(debounceFetch);
//   }, [dispatch]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     {
//       name: "date",
//       label: "Date",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "totalAmount",
//       label: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) =>
//           new Intl.NumberFormat("en-NG", {
//             style: "currency",
//             currency: "NGN",
//             minimumFractionDigits: 2,
//           }).format(value),
//       },
//     },
//     {
//       name: "paymentMethod",
//       label: "Payment Method",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.name || "Unknown",
//       },
//     },
//     {
//       name: "location",
//       label: "Location",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.name || "Unknown",
//       },
//     },
//     {
//       name: "saleType",
//       label: "Sale Type",
//       options: {
//         filter: true,
//         sort: false,
//         filterOptions: {
//           names: ["restaurant", "minimart", "kabasa"], // Added kabasa here
//         },
//       },
//     },
//     {
//       name: "cashier",
//       label: "Cashier",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.fullName || "Unknown",
//       },
//     },
//     {
//       name: "isVoided",
//       label: "Voided",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => (value ? "Yes" : "No"),
//       },
//     },
//     {
//       name: "actions",
//       label: "Actions",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const sale = salesTransactions[tableMeta.rowIndex];
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => {
//                   setEditData(sale);
//                   setDrawerOpen(true);
//                 }}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => {
//                   setSaleToVoid(sale);
//                   setVoidDialogOpen(true);
//                 }}
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
//             color: "#fff",
//             "&.Mui-selected": {
//               color: "#fe6c00",
//             },
//             "&:hover": {
//               color: "#fe6c00",
//             },
//           },
//         },
//       },
//       MuiTabs: {
//         styleOverrides: {
//           indicator: {
//             backgroundColor: "#fe6c00",
//           },
//         },
//       },
//     },
//   });

//   const options = {
//     filterType: "checkbox",
//     responsive: "standard",
//     selectableRows: "none",
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
//         Add New Sale
//       </Button>
//     ),
//   };

//   const handleConfirmVoid = () => {
//     if (saleToVoid) {
//       dispatch(voidSalesTransaction(saleToVoid._id));
//       setVoidDialogOpen(false);
//       setIsFetching(true);
//       dispatch(fetchSalesTransactions()).finally(() => setIsFetching(false));
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="sales unified tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           <div>
//             {isFetching && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 1000,
//                 }}
//               >
//                 <CircularProgress size={60} style={{ color: "#fe6c00" }} />
//               </div>
//             )}
//             <MUIDataTable
//               title={"Unified Sales List"}
//               data={salesTransactions}
//               columns={columns}
//               options={options}
//             />
//             <AddNewUnifiedTransactionDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchSalesTransactions())}
//             />
//             <Dialog
//               open={voidDialogOpen}
//               onClose={() => setVoidDialogOpen(false)}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Void Transaction"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to void this transaction? This action
//                   cannot be undone.
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={() => setVoidDialogOpen(false)}>Cancel</Button>
//                 <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </div>
//         </TabPanel>
//         <TabPanel value="1">
//           <UnifiedTransactionReport />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default UnifiedTransaction;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSalesTransactions,
//   voidSalesTransaction,
// } from "../../redux/slices/salesTransactionSlice";
// import {
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Box,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { hasPermission } from "../../utils/authUtils"; // Add this import
// import UnifiedTransactionReport from "./Reports/UnifiedTransactionReport";
// import AddNewUnifiedTransactionDrawer from "../AddNewUnifiedTransactionDrawer";

// const UnifiedTransaction = () => {
//   const dispatch = useDispatch();
//   const { salesTransactions, status, error } = useSelector(
//     (state) => state.salesTransactions
//   );
//   const { user } = useSelector((state) => state.auth); // Add user for permissions
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [saleToVoid, setSaleToVoid] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     const fetchSales = () => {
//       setIsFetching(true);
//       dispatch(fetchSalesTransactions()).finally(() => setIsFetching(false));
//     };

//     const debounceFetch = setTimeout(fetchSales, 300);
//     return () => clearTimeout(debounceFetch);
//   }, [dispatch]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   // Define sale types and their permissions
//   const saleTypesPermissions = {
//     restaurant: "read:restaurant",
//     minimart: "read:minimart",
//     kabasa: "read:kabasa",
//   };

//   // Filter sale types based on user permissions
//   const allowedSaleTypes = Object.keys(saleTypesPermissions).filter((type) =>
//     hasPermission(user, saleTypesPermissions[type])
//   );

//   const columns = [
//     {
//       name: "date",
//       label: "Date",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "totalAmount",
//       label: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) =>
//           new Intl.NumberFormat("en-NG", {
//             style: "currency",
//             currency: "NGN",
//             minimumFractionDigits: 2,
//           }).format(value),
//       },
//     },
//     {
//       name: "paymentMethod",
//       label: "Payment Method",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.name || "Unknown",
//       },
//     },
//     {
//       name: "location",
//       label: "Location",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.name || "Unknown",
//       },
//     },
//     {
//       name: "saleType",
//       label: "Sale Type",
//       options: {
//         filter: true,
//         sort: false,
//         filterOptions: {
//           names:
//             allowedSaleTypes.length > 0
//               ? allowedSaleTypes
//               : ["restaurant", "minimart", "kabasa"], // Fallback if no permissions
//         },
//       },
//     },
//     {
//       name: "cashier",
//       label: "Cashier",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.fullName || "Unknown",
//       },
//     },
//     {
//       name: "isVoided",
//       label: "Voided",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => (value ? "Yes" : "No"),
//       },
//     },
//     {
//       name: "actions",
//       label: "Actions",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const sale = salesTransactions[tableMeta.rowIndex];
//           return (
//             <>
//               {hasPermission(user, "update:salestransactions") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => {
//                     setEditData(sale);
//                     setDrawerOpen(true);
//                   }}
//                 ></i>
//               )}
//               {hasPermission(user, "void:salestransactions") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => {
//                     setSaleToVoid(sale);
//                     setVoidDialogOpen(true);
//                   }}
//                 ></i>
//               )}
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
//     responsive: "standard",
//     selectableRows: "none",
//     customToolbar: () =>
//       hasPermission(user, "write:salestransactions") ? (
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
//             "&:hover": {
//               backgroundColor: "#fec80a",
//               color: "#bdbabb",
//             },
//           }}
//         >
//           Add New Sale
//         </Button>
//       ) : null,
//   };

//   const handleConfirmVoid = () => {
//     if (saleToVoid) {
//       dispatch(voidSalesTransaction(saleToVoid._id));
//       setVoidDialogOpen(false);
//       setIsFetching(true);
//       dispatch(fetchSalesTransactions()).finally(() => setIsFetching(false));
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="sales unified tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           <div>
//             {isFetching && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 1000,
//                 }}
//               >
//                 <CircularProgress size={60} style={{ color: "#fe6c00" }} />
//               </div>
//             )}
//             <MUIDataTable
//               title={"Unified Sales List"}
//               data={salesTransactions}
//               columns={columns}
//               options={options}
//             />
//             <AddNewUnifiedTransactionDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchSalesTransactions())}
//             />
//             <Dialog
//               open={voidDialogOpen}
//               onClose={() => setVoidDialogOpen(false)}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Void Transaction"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to void this transaction? This action
//                   cannot be undone.
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={() => setVoidDialogOpen(false)}>Cancel</Button>
//                 <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </div>
//         </TabPanel>
//         <TabPanel value="1">
//           <UnifiedTransactionReport />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default UnifiedTransaction;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSalesTransactions,
//   voidSalesTransaction,
// } from "../../redux/slices/salesTransactionSlice";
// import {
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Box,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { hasPermission } from "../../utils/authUtils";
// import UnifiedTransactionReport from "./Reports/UnifiedTransactionReport";
// import AddNewUnifiedTransactionDrawer from "../AddNewUnifiedTransactionDrawer";

// const UnifiedTransaction = () => {
//   const dispatch = useDispatch();
//   const { salesTransactions, status, error } = useSelector(
//     (state) => state.salesTransactions
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [saleToVoid, setSaleToVoid] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     console.log("Fetching sales transactions...");
//     const fetchSales = () => {
//       setIsFetching(true);
//       dispatch(fetchSalesTransactions()).finally(() => {
//         setIsFetching(false);
//         console.log("Sales transactions fetched:", salesTransactions);
//       });
//     };

//     const debounceFetch = setTimeout(fetchSales, 300);
//     return () => clearTimeout(debounceFetch);
//   }, [dispatch]);

//   const handleChange = (event, newValue) => {
//     console.log("Tab changed to:", newValue);
//     setValue(newValue);
//   };

//   const handleAddNewClick = () => {
//     console.log("Add New Sale button clicked");
//     setEditData(null);
//     setDrawerOpen(true);
//   };

//   const handleEditClick = (sale) => {
//     console.log("Edit clicked for sale:", sale);
//     setEditData(sale);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (sale) => {
//     console.log("Void clicked for sale:", sale);
//     setSaleToVoid(sale);
//     setVoidDialogOpen(true);
//   };

//   const handleConfirmVoid = () => {
//     if (saleToVoid) {
//       console.log("Confirming void for sale:", saleToVoid);
//       dispatch(voidSalesTransaction(saleToVoid._id))
//         .then(() => {
//           console.log("Void successful");
//           setVoidDialogOpen(false);
//           setIsFetching(true);
//           dispatch(fetchSalesTransactions()).finally(() =>
//             setIsFetching(false)
//           );
//         })
//         .catch((error) => console.error("Void failed:", error));
//       setSaleToVoid(null);
//     } else {
//       console.log("No sale to void");
//       setVoidDialogOpen(false);
//     }
//   };

//   const columns = [
//     {
//       name: "date",
//       label: "Date",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "totalAmount",
//       label: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) =>
//           new Intl.NumberFormat("en-NG", {
//             style: "currency",
//             currency: "NGN",
//             minimumFractionDigits: 2,
//           }).format(value),
//       },
//     },
//     {
//       name: "paymentMethod",
//       label: "Payment Method",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.name || "Unknown",
//       },
//     },
//     {
//       name: "location",
//       label: "Location",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.name || "Unknown",
//       },
//     },
//     {
//       name: "saleType",
//       label: "Sale Type",
//       options: {
//         filter: true,
//         sort: false,
//         filterOptions: {
//           names: ["restaurant", "minimart", "kabasa"].filter((type) =>
//             hasPermission(user, `read:${type}`)
//           ),
//         },
//       },
//     },
//     {
//       name: "cashier",
//       label: "Cashier",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.fullName || "Unknown",
//       },
//     },
//     {
//       name: "isVoided",
//       label: "Voided",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => (value ? "Yes" : "No"),
//       },
//     },
//     {
//       name: "actions",
//       label: "Actions",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const sale = salesTransactions[tableMeta.rowIndex];
//           return (
//             <div style={{ display: "flex", gap: "12px" }}>
//               {hasPermission(user, "update:salestransactions") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(sale)}
//                 ></i>
//               )}
//               {hasPermission(user, "void:salestransactions") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleVoidClick(sale)}
//                 ></i>
//               )}
//             </div>
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
//     responsive: "standard",
//     selectableRows: "none",
//     customToolbar: () =>
//       hasPermission(user, "write:salestransactions") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={handleAddNewClick}
//           sx={{
//             backgroundColor: "#fe6c00",
//             color: "#fff",
//             "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
//           }}
//         >
//           Add New Sale
//         </Button>
//       ) : null,
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="sales unified tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           <div>
//             {isFetching && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 1000,
//                 }}
//               >
//                 <CircularProgress size={60} style={{ color: "#fe6c00" }} />
//               </div>
//             )}
//             <MUIDataTable
//               title={"Unified Sales List"}
//               data={salesTransactions}
//               columns={columns}
//               options={options}
//             />
//             <AddNewUnifiedTransactionDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 console.log("Drawer closing");
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => {
//                 console.log("Save success, refetching");
//                 dispatch(fetchSalesTransactions());
//               }}
//             />
//             <Dialog
//               open={voidDialogOpen}
//               onClose={() => {
//                 console.log("Void dialog closing");
//                 setVoidDialogOpen(false);
//               }}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Void Transaction"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to void this transaction? This action
//                   cannot be undone.
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={() => setVoidDialogOpen(false)}>Cancel</Button>
//                 <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </div>
//         </TabPanel>
//         <TabPanel value="1">
//           <UnifiedTransactionReport />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default UnifiedTransaction;

// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSalesTransactions,
//   voidSalesTransaction,
// } from "../../redux/slices/salesTransactionSlice";
// import {
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Box,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { hasPermission } from "../../utils/authUtils";
// import UnifiedTransactionReport from "./Reports/UnifiedTransactionReport";
// import AddNewUnifiedTransactionDrawer from "../AddNewUnifiedTransactionDrawer";

// const UnifiedTransaction = () => {
//   const dispatch = useDispatch();
//   const { salesTransactions, status, error } = useSelector(
//     (state) => state.salesTransactions
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [saleToVoid, setSaleToVoid] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     console.log("Fetching sales transactions...");
//     const fetchSales = () => {
//       setIsFetching(true);
//       dispatch(fetchSalesTransactions()).finally(() => {
//         setIsFetching(false);
//         console.log("Sales transactions fetched:", salesTransactions);
//       });
//     };

//     const debounceFetch = setTimeout(fetchSales, 300);
//     return () => clearTimeout(debounceFetch);
//   }, [dispatch]);

//   const handleChange = (event, newValue) => {
//     console.log("Tab changed to:", newValue);
//     setValue(newValue);
//   };

//   const handleAddNewClick = () => {
//     console.log("Add New Sale button clicked");
//     setEditData(null);
//     setDrawerOpen(true);
//   };

//   const handleEditClick = (sale) => {
//     console.log("Edit clicked for sale:", sale);
//     setEditData(sale);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (sale) => {
//     console.log("Void clicked for sale:", sale);
//     setSaleToVoid(sale);
//     setVoidDialogOpen(true);
//   };

//   const handleConfirmVoid = () => {
//     if (saleToVoid) {
//       console.log("Confirming void for sale:", saleToVoid);
//       dispatch(voidSalesTransaction(saleToVoid._id))
//         .then(() => {
//           console.log("Void successful");
//           setVoidDialogOpen(false);
//           setIsFetching(true);
//           dispatch(fetchSalesTransactions()).finally(() =>
//             setIsFetching(false)
//           );
//         })
//         .catch((error) => console.error("Void failed:", error));
//       setSaleToVoid(null);
//     } else {
//       console.log("No sale to void");
//       setVoidDialogOpen(false);
//     }
//   };

//   const columns = [
//     {
//       field: "date",
//       headerName: "Date",
//       width: 180,
//       filterable: true,
//       sortable: true,
//       renderCell: (params) => new Date(params.value).toLocaleString(),
//     },
//     {
//       field: "totalAmount",
//       headerName: "Total Amount",
//       width: 150,
//       filterable: true,
//       sortable: true,
//       renderCell: (params) =>
//         new Intl.NumberFormat("en-NG", {
//           style: "currency",
//           currency: "NGN",
//           minimumFractionDigits: 2,
//         }).format(params.value),
//     },
//     {
//       field: "paymentMethod",
//       headerName: "Payment Method",
//       width: 150,
//       filterable: true,
//       sortable: false,
//       renderCell: (params) => params.value?.name || "Unknown",
//     },
//     {
//       field: "location",
//       headerName: "Location",
//       width: 150,
//       filterable: true,
//       sortable: false,
//       renderCell: (params) => params.value?.name || "Unknown",
//     },
//     {
//       field: "saleType",
//       headerName: "Sale Type",
//       width: 120,
//       filterable: true,
//       sortable: false,
//       filterOperators: ["equals"], // Basic filtering
//     },
//     {
//       field: "cashier",
//       headerName: "Cashier",
//       width: 150,
//       filterable: true,
//       sortable: false,
//       renderCell: (params) => params.value?.fullName || "Unknown",
//     },
//     {
//       field: "isVoided",
//       headerName: "Voided",
//       width: 100,
//       filterable: true,
//       sortable: false,
//       renderCell: (params) => (params.value ? "Yes" : "No"),
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       width: 150,
//       filterable: false,
//       sortable: false,
//       renderCell: (params) => {
//         const sale = params.row;
//         return (
//           <div style={{ display: "flex", gap: "12px" }}>
//             {hasPermission(user, "update:salestransactions") && (
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(sale)}
//               ></i>
//             )}
//             {hasPermission(user, "void:salestransactions") && (
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleVoidClick(sale)}
//               ></i>
//             )}
//           </div>
//         );
//       },
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

//   const rows = salesTransactions.map((sale) => ({
//     id: sale._id, // DataGrid requires a unique 'id' field
//     date: sale.date,
//     totalAmount: sale.totalAmount,
//     paymentMethod: sale.paymentMethod,
//     location: sale.location,
//     saleType: sale.saleType,
//     cashier: sale.cashier,
//     isVoided: sale.isVoided,
//   }));

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="sales unified tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           <div style={{ position: "relative" }}>
//             {isFetching && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 1000,
//                 }}
//               >
//                 <CircularProgress size={60} style={{ color: "#fe6c00" }} />
//               </div>
//             )}
//             <Box sx={{ height: 600, width: "100%" }}>
//               <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 pageSizeOptions={[5, 10, 20]}
//                 initialState={{
//                   pagination: { paginationModel: { pageSize: 5 } },
//                 }}
//                 checkboxSelection={false} // No selectable rows
//                 disableRowSelectionOnClick
//                 slots={{
//                   toolbar: () =>
//                     hasPermission(user, "write:salestransactions") ? (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={handleAddNewClick}
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
//                         Add New Sale
//                       </Button>
//                     ) : null,
//                 }}
//               />
//             </Box>
//             <AddNewUnifiedTransactionDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 console.log("Drawer closing");
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => {
//                 console.log("Save success, refetching");
//                 dispatch(fetchSalesTransactions());
//               }}
//             />
//             <Dialog
//               open={voidDialogOpen}
//               onClose={() => {
//                 console.log("Void dialog closing");
//                 setVoidDialogOpen(false);
//               }}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Void Transaction"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to void this transaction? This action
//                   cannot be undone.
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={() => setVoidDialogOpen(false)}>Cancel</Button>
//                 <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </div>
//         </TabPanel>
//         <TabPanel value="1">
//           <UnifiedTransactionReport />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default UnifiedTransaction;

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
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSalesTransactions,
  voidSalesTransaction,
} from "../../redux/slices/salesTransactionSlice";
import { hasPermission } from "../../utils/authUtils";
import UnifiedTransactionReport from "./Reports/UnifiedTransactionReport";
import AddNewUnifiedTransactionDrawer from "../AddNewUnifiedTransactionDrawer";

const UnifiedTransaction = () => {
  const dispatch = useDispatch();
  const {
    salesTransactions = [],
    status,
    error,
  } = useSelector((state) => state.salesTransactions || {});
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [saleToVoid, setSaleToVoid] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [value, setValue] = useState("0");

  useEffect(() => {
    console.log("Fetching sales transactions...");
    const fetchSales = () => {
      setIsFetching(true);
      dispatch(fetchSalesTransactions()).finally(() => {
        setIsFetching(false);
        console.log("Sales transactions fetched:", salesTransactions);
      });
    };

    const debounceFetch = setTimeout(fetchSales, 300);
    return () => clearTimeout(debounceFetch);
  }, [dispatch]);

  useEffect(() => {
    if (salesTransactions && Array.isArray(salesTransactions)) {
      const formattedData = salesTransactions.map((sale) => ({
        id: sale._id || "N/A",
        date: sale.date ? new Date(sale.date).toLocaleString() : "N/A",
        totalAmount: sale.totalAmount
          ? new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 2,
            }).format(sale.totalAmount)
          : "N/A",
        paymentMethod: sale.paymentMethod?.name || "Unknown",
        location: sale.location?.name || "Unknown",
        saleType: sale.saleType || "N/A",
        cashier: sale.cashier?.fullName || "Unknown",
        isVoided: sale.isVoided ? "Yes" : "No",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [salesTransactions]);

  const handleChange = (event, newValue) => {
    console.log("Tab changed to:", newValue);
    setValue(newValue);
  };

  const handleAddNewClick = useCallback(() => {
    console.log("Add New Sale button clicked, setting drawerOpen to true");
    setEditData(null);
    setDrawerOpen(true);
  }, []);

  const handleEditClick = useCallback(
    (sale) => {
      console.log("Edit clicked for sale:", sale);
      const originalSale = salesTransactions.find((s) => s._id === sale.id);
      console.log("Original sale data:", originalSale);
      setEditData(originalSale || sale);
      setDrawerOpen(true);
    },
    [salesTransactions]
  );

  const handleVoidClick = useCallback(
    (saleId) => {
      console.log("Void clicked for sale ID:", saleId);
      const sale = salesTransactions.find((s) => s._id === saleId);
      setSaleToVoid(sale);
      setVoidDialogOpen(true);
    },
    [salesTransactions]
  );

  const handleConfirmVoid = useCallback(() => {
    if (saleToVoid) {
      console.log("Confirming void for sale:", saleToVoid);
      dispatch(voidSalesTransaction(saleToVoid._id))
        .then(() => {
          toast.success("Transaction voided successfully!", {
            duration: 5000,
          });
          setVoidDialogOpen(false);
          setIsFetching(true);
          dispatch(fetchSalesTransactions()).finally(() =>
            setIsFetching(false)
          );
        })
        .catch((error) => {
          toast.error(
            "Error voiding transaction: " +
              (error.response?.data?.message || error.message)
          );
        });
      setSaleToVoid(null);
    } else {
      setVoidDialogOpen(false);
    }
  }, [dispatch, saleToVoid]);

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
    link.download = "unified_sales.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDrawerClose = useCallback(() => {
    console.log("Drawer close triggered");
    setDrawerOpen(false);
    setEditData(null);
  }, []);

  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "totalAmount", headerName: "Total Amount", flex: 1 },
    { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "saleType",
      headerName: "Sale Type",
      flex: 1,
    },
    { field: "cashier", headerName: "Cashier", flex: 1 },
    { field: "isVoided", headerName: "Voided", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:salestransactions") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleEditClick(params.row)}
            ></i>
          )}
          {hasPermission(user, "void:salestransactions") && (
            <i
              className="bx bx-trash"
              style={{
                color: "#fe1e00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleVoidClick(params.row.id)}
            ></i>
          )}
        </>
      ),
    },
  ];

  // const theme = createTheme({
  //   components: {
  //     MuiDataGrid: {
  //       styleOverrides: {
  //         root: {
  //           backgroundColor: "#f0f0f0",
  //           "& .MuiDataGrid-row": {
  //             backgroundColor: "#29221d",
  //             "&:hover": {
  //               backgroundColor: "#1e1611",
  //               "& .MuiDataGrid-cell": { color: "#bdbabb" },
  //             },
  //           },
  //           "& .MuiDataGrid-cell": { color: "#fff", fontSize: "18px" },
  //           "& .MuiDataGrid-columnHeaders": {
  //             backgroundColor: "#e0e0e0",
  //             "& .MuiDataGrid-columnHeaderTitle": {
  //               color: "#000",
  //               fontSize: "18px",
  //               fontWeight: "bold",
  //             },
  //           },
  //           "& .MuiDataGrid-footerContainer": {
  //             backgroundColor: "#29221d",
  //             color: "#fcfcfc",
  //             "& .MuiTablePagination-root": {
  //               color: "#fcfcfc",
  //             },
  //             "& .MuiIconButton-root": {
  //               color: "#fcfcfc",
  //             },
  //           },
  //           "@media print": {
  //             "& .MuiDataGrid-main": {
  //               color: "#000",
  //             },
  //           },
  //         },
  //       },
  //     },
  //     MuiTab: {
  //       styleOverrides: {
  //         root: {
  //           color: "#fff",
  //           "&.Mui-selected": { color: "#fe6c00" },
  //           "&:hover": { color: "#fe6c00" },
  //         },
  //       },
  //     },
  //     MuiTabs: {
  //       styleOverrides: {
  //         indicator: { backgroundColor: "#fe6c00" },
  //       },
  //     },
  //   },
  // });
  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
            "& .MuiDataGrid-row": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiDataGrid-cell": { color: "#bdbabb" },
              },
            },
            "& .MuiDataGrid-cell": { color: "#fff", fontSize: "18px" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e0e0e0",
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#000",
                fontSize: "18px",
                fontWeight: "bold",
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
  console.log("UnifiedTransaction rendering, drawerOpen:", drawerOpen);

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="sales unified tabs">
            <Tab label="Sales Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <Box sx={{ width: "100%", position: "relative" }}>
            {isFetching && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                }}
              >
                <CircularProgress size={60} sx={{ color: "#fe6c00" }} />
              </Box>
            )}
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
                Unified Sales List
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
                    color: "#fe6c00",
                    "&:hover": { color: "#fec80a" },
                  }}
                  title="Download CSV"
                >
                  <GetAppIcon />
                </IconButton>
                <IconButton
                  onClick={handlePrint}
                  sx={{
                    color: "#fe6c00",
                    "&:hover": { color: "#fec80a" },
                  }}
                  title="Print"
                >
                  <PrintIcon />
                </IconButton>
                {hasPermission(user, "write:salestransactions") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddNewClick}
                    sx={{
                      backgroundColor: "#fe6c00",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#fec80a",
                        color: "#bdbabb",
                      },
                    }}
                  >
                    Add New Sale
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
            <AddNewUnifiedTransactionDrawer
              open={drawerOpen}
              onClose={handleDrawerClose}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => {
                console.log("Save success, refetching");
                dispatch(fetchSalesTransactions());
              }}
            />
            <Dialog
              open={voidDialogOpen}
              onClose={() => setVoidDialogOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Confirm Void Transaction"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to void this transaction? This action
                  cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setVoidDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmVoid} color="error" autoFocus>
                  Void
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </TabPanel>
        <TabPanel value="1">
          <UnifiedTransactionReport />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default UnifiedTransaction;
