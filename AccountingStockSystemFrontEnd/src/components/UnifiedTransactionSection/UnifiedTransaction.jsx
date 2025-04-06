// import React, { useEffect, useState, useCallback } from "react";
// import { DataGrid } from "@mui/x-data-grid";
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
//   TextField,
//   Typography,
//   IconButton,
//   Tab,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSalesTransactions,
//   voidSalesTransaction,
// } from "../../redux/slices/salesTransactionSlice";
// import { hasPermission } from "../../utils/authUtils";
// import UnifiedTransactionReport from "./Reports/UnifiedTransactionReport";
// import AddNewUnifiedTransactionDrawer from "../AddNewUnifiedTransactionDrawer";

// const UnifiedTransaction = () => {
//   const dispatch = useDispatch();
//   const {
//     salesTransactions = [],
//     status,
//     error,
//   } = useSelector((state) => state.salesTransactions || {});
//   const { user } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
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

//   useEffect(() => {
//     if (salesTransactions && Array.isArray(salesTransactions)) {
//       const formattedData = salesTransactions.map((sale) => ({
//         id: sale._id || "N/A",
//         transactionDate: sale.transactionDate
//           ? new Date(sale.transactionDate).toLocaleString("en-NG", {
//               timeZone: "Africa/Lagos",
//             })
//           : "N/A",
//         totalAmount: sale.totalAmount
//           ? new Intl.NumberFormat("en-NG", {
//               style: "currency",
//               currency: "NGN",
//               minimumFractionDigits: 2,
//             }).format(sale.totalAmount)
//           : "N/A",
//         paymentMethod: sale.paymentMethod?.name || "Unknown",
//         location: sale.location?.name || "Unknown",
//         saleType: sale.saleType || "N/A",
//         cashier: sale.cashier?.fullName || "Unknown",
//         isVoided: sale.isVoided ? "Yes" : "No",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [salesTransactions]);

//   const handleChange = (event, newValue) => {
//     console.log("Tab changed to:", newValue);
//     setValue(newValue);
//   };

//   const handleAddNewClick = useCallback(() => {
//     console.log("Add New Sale button clicked, setting drawerOpen to true");
//     setEditData(null);
//     setDrawerOpen(true);
//   }, []);

//   const handleEditClick = useCallback(
//     (sale) => {
//       console.log("Edit clicked for sale:", sale);
//       const originalSale = salesTransactions.find((s) => s._id === sale.id);
//       console.log("Original sale data:", originalSale);
//       setEditData(originalSale || sale);
//       setDrawerOpen(true);
//     },
//     [salesTransactions]
//   );

//   const handleVoidClick = useCallback(
//     (saleId) => {
//       console.log("Void clicked for sale ID:", saleId);
//       const sale = salesTransactions.find((s) => s._id === saleId);
//       setSaleToVoid(sale);
//       setVoidDialogOpen(true);
//     },
//     [salesTransactions]
//   );

//   const handleConfirmVoid = useCallback(() => {
//     if (saleToVoid) {
//       console.log("Confirming void for sale:", saleToVoid);
//       dispatch(voidSalesTransaction(saleToVoid._id))
//         .then(() => {
//           toast.success("Transaction voided successfully!", {
//             duration: 5000,
//           });
//           setVoidDialogOpen(false);
//           setIsFetching(true);
//           dispatch(fetchSalesTransactions()).finally(() =>
//             setIsFetching(false)
//           );
//         })
//         .catch((error) => {
//           toast.error(
//             "Error voiding transaction: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//       setSaleToVoid(null);
//     } else {
//       setVoidDialogOpen(false);
//     }
//   }, [dispatch, saleToVoid]);

//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredData(data);
//     } else {
//       const filtered = data.filter((row) =>
//         Object.values(row).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchVal.toLowerCase())
//         )
//       );
//       setFilteredData(filtered);
//     }
//   };

//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredData
//       .map((row) =>
//         columns
//           .map(
//             (col) =>
//               `"${(row[col.field] || "").toString().replace(/"/g, '""')}"`
//           )
//           .join(",")
//       )
//       .join("\n");
//     const csvContent = `${headers}\n${csvRows}`;
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "unified_sales.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleDrawerClose = useCallback(() => {
//     console.log("Drawer close triggered");
//     setDrawerOpen(false);
//     setEditData(null);
//   }, []);

//   const columns = [
//     { field: "transactionDate", headerName: "Transaction Date", flex: 1 },
//     { field: "totalAmount", headerName: "Total Amount", flex: 1 },
//     { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
//     { field: "location", headerName: "Location", flex: 1 },
//     { field: "saleType", headerName: "Sale Type", flex: 1 },
//     { field: "cashier", headerName: "Cashier", flex: 1 },
//     { field: "isVoided", headerName: "Voided", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:salestransactions") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(params.row)}
//             ></i>
//           )}
//           {hasPermission(user, "void:salestransactions") && (
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleVoidClick(params.row.id)}
//             ></i>
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
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
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
//             "@media print": {
//               "& .MuiDataGrid-main": {
//                 color: "#000",
//               },
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

//   console.log("UnifiedTransaction rendering, drawerOpen:", drawerOpen);

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
//           <Box sx={{ width: "100%", position: "relative" }}>
//             {isFetching && (
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 1000,
//                 }}
//               >
//                 <CircularProgress size={60} sx={{ color: "#fe6c00" }} />
//               </Box>
//             )}
//             <Box
//               sx={{
//                 padding: "8px",
//                 backgroundColor: "#d0d0d0",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "8px",
//                 "@media print": {
//                   display: "none",
//                 },
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Unified Sales List
//               </Typography>
//               <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                 <TextField
//                   variant="outlined"
//                   size="small"
//                   placeholder="Search..."
//                   value={searchText}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//                 />
//                 <IconButton
//                   onClick={handleExport}
//                   sx={{
//                     color: "#fe6c00",
//                     "&:hover": { color: "#fec80a" },
//                   }}
//                   title="Download CSV"
//                 >
//                   <GetAppIcon />
//                 </IconButton>
//                 <IconButton
//                   onClick={handlePrint}
//                   sx={{
//                     color: "#fe6c00",
//                     "&:hover": { color: "#fec80a" },
//                   }}
//                   title="Print"
//                 >
//                   <PrintIcon />
//                 </IconButton>
//                 {hasPermission(user, "write:salestransactions") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={handleAddNewClick}
//                     sx={{
//                       backgroundColor: "#fe6c00",
//                       color: "#fff",
//                       "&:hover": {
//                         backgroundColor: "#fec80a",
//                         color: "#bdbabb",
//                       },
//                     }}
//                   >
//                     Add New Sale
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             <Box sx={{ height: 600, width: "100%" }}>
//               <DataGrid
//                 rows={filteredData}
//                 columns={columns}
//                 pageSizeOptions={[10, 20, 50]}
//                 initialState={{
//                   pagination: { paginationModel: { pageSize: 10 } },
//                 }}
//                 disableSelectionOnClick
//               />
//             </Box>
//             <AddNewUnifiedTransactionDrawer
//               open={drawerOpen}
//               onClose={handleDrawerClose}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => {
//                 console.log("Save success, refetching");
//                 dispatch(fetchSalesTransactions());
//               }}
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
//           </Box>
//         </TabPanel>
//         <TabPanel value="1">
//           <UnifiedTransactionReport />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default UnifiedTransaction;

// import React, { useEffect, useState, useCallback } from "react";
// import { DataGrid } from "@mui/x-data-grid";
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
//   TextField,
//   Typography,
//   IconButton,
//   Tab,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSalesTransactions,
//   voidSalesTransaction,
// } from "../../redux/slices/salesTransactionSlice";
// import { checkAuthStatus } from "../../redux/slices/authSlice"; // Import checkAuthStatus
// import { hasPermission } from "../../utils/authUtils";
// import UnifiedTransactionReport from "./Reports/UnifiedTransactionReport";
// import AddNewUnifiedTransactionDrawer from "../AddNewUnifiedTransactionDrawer";

// const UnifiedTransaction = () => {
//   const dispatch = useDispatch();
//   const {
//     salesTransactions = [],
//     status,
//     error,
//   } = useSelector((state) => state.salesTransactions || {});
//   const { isAuthenticated, user } = useSelector((state) => state.auth || {}); // Add isAuthenticated

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [saleToVoid, setSaleToVoid] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [value, setValue] = useState("0");
//   const [initialFetchDone, setInitialFetchDone] = useState(false); // Add flag

//   useEffect(() => {
//     console.log("UnifiedTransaction - Mount check", {
//       isAuthenticated,
//       initialFetchDone,
//     });
//     if (!initialFetchDone) {
//       if (isAuthenticated) {
//         console.log("Fetching sales transactions...");
//         setIsFetching(true);
//         dispatch(fetchSalesTransactions()).finally(() => {
//           setIsFetching(false);
//           setInitialFetchDone(true);
//         });
//       } else {
//         console.log("Checking auth status...");
//         dispatch(checkAuthStatus())
//           .unwrap()
//           .then(() => {
//             console.log("Auth succeeded, fetching sales transactions...");
//             setIsFetching(true);
//             dispatch(fetchSalesTransactions()).finally(() => {
//               setIsFetching(false);
//               setInitialFetchDone(true);
//             });
//           })
//           .catch((err) => {
//             console.error("Auth check failed:", err);
//             setInitialFetchDone(true); // Set flag even on failure to prevent rechecking
//           });
//       }
//     }
//   }, [dispatch, isAuthenticated, initialFetchDone]);

//   useEffect(() => {
//     if (salesTransactions && Array.isArray(salesTransactions)) {
//       const formattedData = salesTransactions.map((sale) => ({
//         id: sale._id || "N/A",
//         transactionDate: sale.transactionDate
//           ? new Date(sale.transactionDate).toLocaleString("en-NG", {
//               timeZone: "Africa/Lagos",
//             })
//           : "N/A",
//         totalAmount: sale.totalAmount
//           ? new Intl.NumberFormat("en-NG", {
//               style: "currency",
//               currency: "NGN",
//               minimumFractionDigits: 2,
//             }).format(sale.totalAmount)
//           : "N/A",
//         paymentMethod: sale.paymentMethod?.name || "Unknown",
//         location: sale.location?.name || "Unknown",
//         saleType: sale.saleType || "N/A",
//         cashier: sale.cashier?.fullName || "Unknown",
//         isVoided: sale.isVoided ? "Yes" : "No",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [salesTransactions]);

//   const handleChange = (event, newValue) => {
//     console.log("Tab changed to:", newValue);
//     setValue(newValue);
//   };

//   const handleAddNewClick = useCallback(() => {
//     console.log("Add New Sale button clicked, setting drawerOpen to true");
//     setEditData(null);
//     setDrawerOpen(true);
//   }, []);

//   const handleEditClick = useCallback(
//     (sale) => {
//       console.log("Edit clicked for sale:", sale);
//       const originalSale = salesTransactions.find((s) => s._id === sale.id);
//       console.log("Original sale data:", originalSale);
//       setEditData(originalSale || sale);
//       setDrawerOpen(true);
//     },
//     [salesTransactions]
//   );

//   const handleVoidClick = useCallback(
//     (saleId) => {
//       console.log("Void clicked for sale ID:", saleId);
//       const sale = salesTransactions.find((s) => s._id === saleId);
//       setSaleToVoid(sale);
//       setVoidDialogOpen(true);
//     },
//     [salesTransactions]
//   );

//   const handleConfirmVoid = useCallback(() => {
//     if (saleToVoid) {
//       console.log("Confirming void for sale:", saleToVoid);
//       dispatch(voidSalesTransaction(saleToVoid._id))
//         .then(() => {
//           toast.success("Transaction voided successfully!", {
//             duration: 5000,
//           });
//           setVoidDialogOpen(false);
//           setIsFetching(true);
//           dispatch(fetchSalesTransactions()).finally(() =>
//             setIsFetching(false)
//           );
//         })
//         .catch((error) => {
//           toast.error(
//             "Error voiding transaction: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//       setSaleToVoid(null);
//     } else {
//       setVoidDialogOpen(false);
//     }
//   }, [dispatch, saleToVoid]);

//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredData(data);
//     } else {
//       const filtered = data.filter((row) =>
//         Object.values(row).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchVal.toLowerCase())
//         )
//       );
//       setFilteredData(filtered);
//     }
//   };

//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredData
//       .map((row) =>
//         columns
//           .map(
//             (col) =>
//               `"${(row[col.field] || "").toString().replace(/"/g, '""')}"`
//           )
//           .join(",")
//       )
//       .join("\n");
//     const csvContent = `${headers}\n${csvRows}`;
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "unified_sales.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleDrawerClose = useCallback(() => {
//     console.log("Drawer close triggered");
//     setDrawerOpen(false);
//     setEditData(null);
//   }, []);

//   const columns = [
//     { field: "transactionDate", headerName: "Transaction Date", flex: 1 },
//     { field: "totalAmount", headerName: "Total Amount", flex: 1 },
//     { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
//     { field: "location", headerName: "Location", flex: 1 },
//     { field: "saleType", headerName: "Sale Type", flex: 1 },
//     { field: "cashier", headerName: "Cashier", flex: 1 },
//     { field: "isVoided", headerName: "Voided", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:salestransactions") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(params.row)}
//             ></i>
//           )}
//           {hasPermission(user, "void:salestransactions") && (
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleVoidClick(params.row.id)}
//             ></i>
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
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
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
//             "@media print": {
//               "& .MuiDataGrid-main": { color: "#000" },
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

//   // Render unauthorized message if not authenticated
//   if (!isAuthenticated) {
//     return (
//       <Box sx={{ textAlign: "center", padding: "20px" }}>
//         <Typography variant="h6">
//           Please log in to view unified transactions.
//         </Typography>
//       </Box>
//     );
//   }

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
//           <Box sx={{ width: "100%", position: "relative" }}>
//             {isFetching && (
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 1000,
//                 }}
//               >
//                 <CircularProgress size={60} sx={{ color: "#fe6c00" }} />
//               </Box>
//             )}
//             <Box
//               sx={{
//                 padding: "8px",
//                 backgroundColor: "#d0d0d0",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "8px",
//                 "@media print": { display: "none" },
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Unified Sales List
//               </Typography>
//               <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                 <TextField
//                   variant="outlined"
//                   size="small"
//                   placeholder="Search..."
//                   value={searchText}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//                 />
//                 <IconButton
//                   onClick={handleExport}
//                   sx={{
//                     color: "#fe6c00",
//                     "&:hover": { color: "#fec80a" },
//                   }}
//                   title="Download CSV"
//                 >
//                   <GetAppIcon />
//                 </IconButton>
//                 <IconButton
//                   onClick={handlePrint}
//                   sx={{
//                     color: "#fe6c00",
//                     "&:hover": { color: "#fec80a" },
//                   }}
//                   title="Print"
//                 >
//                   <PrintIcon />
//                 </IconButton>
//                 {hasPermission(user, "write:salestransactions") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={handleAddNewClick}
//                     sx={{
//                       backgroundColor: "#fe6c00",
//                       color: "#fff",
//                       "&:hover": {
//                         backgroundColor: "#fec80a",
//                         color: "#bdbabb",
//                       },
//                     }}
//                   >
//                     Add New Sale
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             <Box sx={{ height: 600, width: "100%" }}>
//               <DataGrid
//                 rows={filteredData}
//                 columns={columns}
//                 pageSizeOptions={[10, 20, 50]}
//                 initialState={{
//                   pagination: { paginationModel: { pageSize: 10 } },
//                 }}
//                 disableSelectionOnClick
//               />
//             </Box>
//             <AddNewUnifiedTransactionDrawer
//               open={drawerOpen}
//               onClose={handleDrawerClose}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => {
//                 console.log("Save success, refetching");
//                 dispatch(fetchSalesTransactions());
//               }}
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
//           </Box>
//         </TabPanel>
//         <TabPanel value="1">
//           <UnifiedTransactionReport />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
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
import { checkAuthStatus, logout } from "../../redux/slices/authSlice"; // Add logout
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
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [saleToVoid, setSaleToVoid] = useState(null);
  const [value, setValue] = useState("0");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("UnifiedTransaction - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching sales transactions...");
        dispatch(fetchSalesTransactions())
          .unwrap()
          .then(() => console.log("Fetch succeeded"))
          .catch((err) => {
            console.error("Fetch failed:", err);
            if (err?.response?.status === 401) {
              toast.error("Session expired. Please log in again.");
              dispatch(logout()); // Logout on 401
            }
          })
          .finally(() => setInitialFetchDone(true));
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching sales transactions...");
            dispatch(fetchSalesTransactions())
              .unwrap()
              .then()
              .catch((err) => {
                console.error("Fetch failed after auth check:", err);
                if (err?.response?.status === 401) {
                  toast.error("Session expired. Please log in again.");
                  dispatch(logout());
                }
              })
              .finally(() => setInitialFetchDone(true));
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    if (
      salesTransactions &&
      Array.isArray(salesTransactions) &&
      status !== "loading" &&
      !error
    ) {
      const formattedData = salesTransactions.map((sale) => ({
        id: sale._id || `temp-${Math.random()}`,
        transactionDate: sale.transactionDate
          ? new Date(sale.transactionDate).toLocaleString("en-NG", {
              timeZone: "Africa/Lagos",
            })
          : "N/A",
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
  }, [salesTransactions, status, error]);

  const handleChange = useCallback((event, newValue) => {
    //console.log("Tab changed to:", newValue);
    setValue(newValue);
  }, []);

  const handleAddNewClick = useCallback(() => {
    //console.log("Add New Sale button clicked");
    setEditData(null);
    setDrawerOpen(true);
  }, []);

  const handleEditClick = useCallback(
    (sale) => {
      //console.log("Edit clicked for sale:", sale);
      const originalSale = salesTransactions.find((s) => s._id === sale.id);
      if (originalSale) {
        setEditData(originalSale);
        setDrawerOpen(true);
      } else {
        toast.error("Sale not found for editing");
      }
    },
    [salesTransactions]
  );

  const handleVoidClick = useCallback(
    (saleId) => {
      //console.log("Void clicked for sale ID:", saleId);
      const sale = salesTransactions.find((s) => s._id === saleId);
      if (sale) {
        setSaleToVoid(sale);
        setVoidDialogOpen(true);
      } else {
        toast.error("Sale not found for voiding");
      }
    },
    [salesTransactions]
  );

  const handleConfirmVoid = useCallback(() => {
    if (saleToVoid) {
      //console.log("Confirming void for sale:", saleToVoid);
      dispatch(voidSalesTransaction(saleToVoid._id))
        .unwrap()
        .then(() => {
          toast.success("Transaction voided successfully!", { duration: 5000 });
          dispatch(fetchSalesTransactions());
        })
        .catch((err) => {
          toast.error(
            `Error voiding transaction: ${err.message || "Unknown error"}`,
            {
              duration: 5000,
            }
          );
          if (err?.response?.status === 401) {
            toast.error("Session expired. Please log in again.");
            dispatch(logout());
          }
        })
        .finally(() => {
          setVoidDialogOpen(false);
          setSaleToVoid(null);
        });
    } else {
      setVoidDialogOpen(false);
    }
  }, [dispatch, saleToVoid]);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (!data || !Array.isArray(data)) return;
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
    },
    [data]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredData
      .map((row) =>
        columns
          .map(
            (col) =>
              `"${(row[col.field] || "N/A").toString().replace(/"/g, '""')}"`
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
  }, [filteredData]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDrawerClose = useCallback(() => {
    //console.log("Drawer close triggered");
    setDrawerOpen(false);
    setEditData(null);
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const columns = [
    { field: "transactionDate", headerName: "Transaction Date", flex: 1 },
    { field: "totalAmount", headerName: "Total Amount", flex: 1 },
    { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "saleType", headerName: "Sale Type", flex: 1 },
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
              title="Edit Sale"
            ></i>
          )}
          {hasPermission(user, "void:salestransactions") &&
            params.row.isVoided !== "Yes" && (
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleVoidClick(params.row.id)}
                title="Void Sale"
              ></i>
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
            "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
            "& .MuiDataGrid-row": { backgroundColor: "#29221d" },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#1e1611",
              "& .MuiDataGrid-cell": { color: "#bdbabb" },
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
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#29221d",
              color: "#fcfcfc",
              "& .MuiTablePagination-root": { color: "#fcfcfc" },
              "& .MuiIconButton-root": { color: "#fcfcfc" },
            },
            "@media print": { "& .MuiDataGrid-main": { color: "#000" } },
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

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view unified transactions.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "#29221d",
          }}
        >
          <TabList onChange={handleChange} aria-label="sales unified tabs">
            <Tab label="Sales Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <Box sx={{ width: "100%" }}>
            {status === "loading" && filteredData.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#fe6c00" }} />
              </Box>
            ) : error ? (
              <Box
                sx={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#302924",
                  color: "#fff",
                  padding: "24px 32px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  textAlign: "center",
                  zIndex: 1300,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#fe1e00", mb: 2, fontWeight: "bold" }}
                >
                  Error:{" "}
                  {typeof error === "object" && error.message
                    ? error.message
                    : error || "Failed to load sales transactions"}
                  {error?.status && ` (Status: ${error.status})`}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleRetry}
                  sx={{
                    backgroundColor: "#fe6c00",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#fec80a", color: "#000" },
                  }}
                >
                  Retry
                </Button>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    padding: "8px",
                    backgroundColor: "#d0d0d0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    "@media print": { display: "none" },
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#000" }}>
                    Unified Sales List
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: "8px", alignItems: "center" }}
                  >
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
                      sx={{ color: "#473b33", "&:hover": { color: "#fec80a" } }}
                      title="Download CSV"
                    >
                      <GetAppIcon />
                    </IconButton>
                    <IconButton
                      onClick={handlePrint}
                      sx={{ color: "#302924", "&:hover": { color: "#fec80a" } }}
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
                {filteredData.length === 0 && status !== "loading" ? (
                  <Typography>No sales transactions available</Typography>
                ) : (
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
                )}
                <AddNewUnifiedTransactionDrawer
                  open={drawerOpen}
                  onClose={handleDrawerClose}
                  editMode={!!editData}
                  initialData={editData || {}}
                  onSaveSuccess={() => {
                    //console.log("Save success, refetching");
                    dispatch(fetchSalesTransactions());
                  }}
                />
                <Dialog
                  open={voidDialogOpen}
                  onClose={() => setVoidDialogOpen(false)}
                >
                  <DialogTitle>Confirm Void Transaction</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to void this transaction? This
                      action cannot be undone.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setVoidDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmVoid} color="error" autoFocus>
                      Void
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
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
