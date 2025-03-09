// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
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
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import AddNewLaundryDrawer from "../AddDrawerSection/AddNewLaundryDrawer";
// import { Toaster, toast } from "react-hot-toast";
// import LaundryReports from "./Reports/LaundriesReports"; // Assuming you have a LaundryReports component

// const Laundries = () => {
//   const dispatch = useDispatch();
//   const { laundries, isLoading, error } = useSelector((state) => state.laundry);
//   const { paymentMethods } = useSelector((state) => state.paymentMethods);
//   const [data, setData] = useState([]);
//   const [totalAmountSum, setTotalAmountSum] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false); // State for voiding confirmation dialog
//   const [laundryToVoid, setLaundryToVoid] = useState(null); // State to hold the laundry to void
//   const [value, setValue] = useState("0");

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-US", {
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     dispatch(fetchLaundries());
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   useEffect(() => {
//     if (laundries && Array.isArray(laundries) && laundries.length > 0) {
//       const sum = laundries.reduce(
//         (sum, laundry) => sum + parseFloat(laundry.totalAmount || 0),
//         0
//       );

//       const formattedData = laundries.map((laundry) => {
//         const soldBy = laundry.salesBy ? laundry.salesBy.fullName : "N/A";
//         const paymentMethodName = laundry.paymentMethod
//           ? laundry.paymentMethod.name
//           : "N/A";

//         return [
//           laundry.customer || "N/A",
//           laundry.createdAt ? formatDate(laundry.createdAt) : "N/A",
//           laundry.receiptNo || "N/A",
//           laundry.phoneNo || "N/A",
//           soldBy,
//           paymentMethodName,
//           laundry.isVoided ? "Yes" : "No",
//           laundry.status || "N/A",
//           laundry.totalAmount || "N/A",
//         ];
//       });

//       formattedData.push([
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "Grand Total:",
//         <strong key="grand-total"> ${sum.toFixed(2)}</strong>,
//       ]);

//       setData(formattedData);
//       setTotalAmountSum(sum);
//     } else {
//       setData([]);
//       setTotalAmountSum(0);
//     }
//   }, [laundries]);

//   const handleEditClick = (index) => {
//     const laundry = laundries[index];
//     if (!laundry) {
//       console.error("Invalid laundry data at index:", index);
//       return;
//     }
//     setEditData(laundry);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (index) => {
//     const laundry = laundries[index];
//     if (!laundry) {
//       console.error("Invalid laundry data at index:", index);
//       return;
//     }
//     setLaundryToVoid(laundry);
//     setOpenVoidDialog(true); // Open the void confirmation dialog
//   };

//   const handleConfirmVoid = async () => {
//     if (laundryToVoid) {
//       try {
//         const response = await dispatch(
//           voidLaundry(laundryToVoid._id)
//         ).unwrap();
//         if (response.success) {
//           toast.success("Laundry record successfully voided");
//         } else {
//           toast.error(response.message || "Failed to void laundry record");
//         }
//       } catch (error) {
//         if (error.message === "Laundry record is already voided") {
//           toast.error("This laundry record has already been voided.");
//         } else {
//           toast.error(error.message || "Failed to void laundry record");
//         }
//       } finally {
//         setOpenVoidDialog(false);
//       }
//     }
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { name: "Customer", options: { filter: true, sort: true } },
//     { name: "Created At", options: { filter: true, sort: true } },
//     { name: "Receipt No", options: { filter: true, sort: false } },
//     { name: "Phone No", options: { filter: true, sort: false } },
//     {
//       name: "Sold By",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },
//     { name: "Payment Method", options: { filter: true, sort: false } },
//     {
//       name: "Voided",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },
//     { name: "Status", options: { filter: true, sort: false } },
//     {
//       name: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value, tableMeta) => {
//           if (tableMeta.rowIndex === laundries.length) {
//             return <strong>{value}</strong>;
//           }
//           return `$${parseFloat(value).toFixed(2)}`;
//         },
//       },
//     },

//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => {
//           if (tableMeta.rowIndex === laundries.length) return null;
//           const laundry = laundries[tableMeta.rowIndex];
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(tableMeta.rowIndex)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: laundry.isVoided ? "not-allowed" : "pointer",
//                   opacity: laundry.isVoided ? 0.5 : 1,
//                 }}
//                 onClick={() =>
//                   !laundry.isVoided && handleVoidClick(tableMeta.rowIndex)
//                 }
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
//         Add New Laundry
//       </Button>
//     ),
//   };

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
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="laundry tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div>Error: {error.message || "An error occurred."}</div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title={"Laundry Records"}
//                 data={isLoading ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewLaundryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={openVoidDialog}
//                 onClose={() => setOpenVoidDialog(false)}
//                 aria-labelledby="void-dialog-title"
//                 aria-describedby="void-dialog-description"
//               >
//                 <DialogTitle id="void-dialog-title">
//                   {"Confirm Void Transaction"}
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="void-dialog-description">
//                     Are you sure you want to void this transaction? This action
//                     cannot be undone.
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => setOpenVoidDialog(false)}
//                     color="primary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                     Void
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <LaundryReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundries;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
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
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import AddNewLaundryDrawer from "../AddDrawerSection/AddNewLaundryDrawer";
// import { Toaster, toast } from "react-hot-toast";
// import LaundryReports from "./Reports/LaundriesReports"; // Assuming you have a LaundryReports component

// const Laundries = () => {
//   const dispatch = useDispatch();
//   const { laundries, isLoading, error } = useSelector((state) => state.laundry);
//   const { paymentMethods } = useSelector((state) => state.paymentMethods);
//   const [data, setData] = useState([]);
//   const [totalAmountSum, setTotalAmountSum] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false); // State for voiding confirmation dialog
//   const [laundryToVoid, setLaundryToVoid] = useState(null); // State to hold the laundry to void
//   const [value, setValue] = useState("0");

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-US", {
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     dispatch(fetchLaundries());
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   useEffect(() => {
//     if (laundries && Array.isArray(laundries) && laundries.length > 0) {
//       const sum = laundries.reduce(
//         (sum, laundry) => sum + parseFloat(laundry.totalAmount || 0),
//         0
//       );

//       const formattedData = laundries.map((laundry) => {
//         const soldBy = laundry.salesBy ? laundry.salesBy.fullName : "N/A";
//         const paymentMethodName = laundry.paymentMethod
//           ? laundry.paymentMethod.name
//           : "N/A";

//         return [
//           laundry.customer || "N/A",
//           laundry.createdAt ? formatDate(laundry.createdAt) : "N/A",
//           laundry.receiptNo || "N/A",
//           laundry.phoneNo || "N/A",
//           soldBy,
//           paymentMethodName,
//           laundry.isVoided ? "Yes" : "No",
//           laundry.status || "N/A", // Add status field
//           laundry.totalAmount !== undefined
//             ? `₦${parseFloat(laundry.totalAmount).toFixed(2)}`
//             : "₦0.00",
//         ];
//       });

//       formattedData.push([
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "Grand Total:",
//         <strong key="grand-total">₦{sum.toFixed(2)}</strong>,
//       ]);

//       setData(formattedData);
//       setTotalAmountSum(sum);
//     } else {
//       setData([]);
//       setTotalAmountSum(0);
//     }
//   }, [laundries]);

//   const handleEditClick = (index) => {
//     const laundry = laundries[index];
//     if (!laundry) {
//       console.error("Invalid laundry data at index:", index);
//       return;
//     }
//     setEditData(laundry);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (index) => {
//     const laundry = laundries[index];
//     if (!laundry) {
//       console.error("Invalid laundry data at index:", index);
//       return;
//     }
//     setLaundryToVoid(laundry);
//     setOpenVoidDialog(true); // Open the void confirmation dialog
//   };

//   const handleConfirmVoid = async () => {
//     if (laundryToVoid) {
//       try {
//         const response = await dispatch(
//           voidLaundry(laundryToVoid._id)
//         ).unwrap();
//         if (response.success) {
//           toast.success("Laundry record successfully voided");
//         } else {
//           toast.error(response.message || "Failed to void laundry record");
//         }
//       } catch (error) {
//         if (error.message === "Laundry record is already voided") {
//           toast.error("This laundry record has already been voided.");
//         } else {
//           toast.error(error.message || "Failed to void laundry record");
//         }
//       } finally {
//         setOpenVoidDialog(false);
//       }
//     }
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { name: "Customer", options: { filter: true, sort: true } },
//     { name: "Created At", options: { filter: true, sort: true } },
//     { name: "Receipt No", options: { filter: true, sort: false } },
//     { name: "Phone No", options: { filter: true, sort: false } },
//     {
//       name: "Sold By",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },
//     { name: "Payment Method", options: { filter: true, sort: false } },
//     {
//       name: "Voided",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },
//     { name: "Status", options: { filter: true, sort: false } }, // Add status column
//     {
//       name: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value, tableMeta) => {
//           if (tableMeta.rowIndex === laundries.length) {
//             return <strong>{value}</strong>;
//           }
//           return `₦${parseFloat(value).toFixed(2)}`;
//         },
//       },
//     },

//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => {
//           if (tableMeta.rowIndex === laundries.length) return null;
//           const laundry = laundries[tableMeta.rowIndex];
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(tableMeta.rowIndex)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: laundry.isVoided ? "not-allowed" : "pointer",
//                   opacity: laundry.isVoided ? 0.5 : 1,
//                 }}
//                 onClick={() =>
//                   !laundry.isVoided && handleVoidClick(tableMeta.rowIndex)
//                 }
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
//         Add New Laundry
//       </Button>
//     ),
//   };

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
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="laundry tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div>Error: {error.message || "An error occurred."}</div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title={"Laundry Records"}
//                 data={isLoading ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewLaundryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={openVoidDialog}
//                 onClose={() => setOpenVoidDialog(false)}
//                 aria-labelledby="void-dialog-title"
//                 aria-describedby="void-dialog-description"
//               >
//                 <DialogTitle id="void-dialog-title">
//                   {"Confirm Void Transaction"}
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="void-dialog-description">
//                     Are you sure you want to void this transaction? This action
//                     cannot be undone.
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => setOpenVoidDialog(false)}
//                     color="primary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                     Void
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <LaundryReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundries;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
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
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import AddNewLaundryDrawer from "../AddDrawerSection/AddNewLaundryDrawer";
// import { Toaster, toast } from "react-hot-toast";
// import LaundryReports from "./Reports/LaundriesReports";

// const Laundries = () => {
//   const dispatch = useDispatch();
//   const { laundries, status, error } = useSelector((state) => state.laundry);
//   const { paymentMethods } = useSelector((state) => state.paymentMethods);
//   const [data, setData] = useState([]);
//   const [totalAmountSum, setTotalAmountSum] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false);
//   const [laundryToVoid, setLaundryToVoid] = useState(null);
//   const [value, setValue] = useState("0");

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-US", {
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     console.log("Fetching laundries and payment methods...");
//     dispatch(fetchLaundries());
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Laundries - State:", { laundries, status, error });
//     if (laundries && Array.isArray(laundries) && laundries.length > 0) {
//       const sum = laundries.reduce(
//         (sum, laundry) => sum + parseFloat(laundry.totalAmount || 0),
//         0
//       );
//       const formattedData = laundries.map((laundry) => [
//         laundry.customer || "N/A",
//         laundry.createdAt ? formatDate(laundry.createdAt) : "N/A",
//         laundry.receiptNo || "N/A",
//         laundry.phoneNo || "N/A",
//         laundry.salesBy ? laundry.salesBy.fullName : "N/A",
//         laundry.paymentMethod ? laundry.paymentMethod.name : "N/A",
//         laundry.isVoided ? "Yes" : "No",
//         laundry.status || "N/A",
//         laundry.totalAmount !== undefined
//           ? `₦${parseFloat(laundry.totalAmount).toFixed(2)}`
//           : "₦0.00",
//         laundry._id, // Added for easier access in actions
//       ]);

//       formattedData.push([
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "Grand Total:",
//         `₦${sum.toFixed(2)}`,
//         "",
//       ]);

//       setData(formattedData);
//       setTotalAmountSum(sum);
//     } else {
//       setData([]);
//       setTotalAmountSum(0);
//       console.log("No laundries data available");
//     }
//   }, [laundries]);

//   const handleEditClick = (laundryId) => {
//     const laundry = laundries.find((l) => l._id === laundryId);
//     if (!laundry) {
//       console.error("Invalid laundry data for ID:", laundryId);
//       return;
//     }
//     setEditData(laundry);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (laundryId) => {
//     const laundry = laundries.find((l) => l._id === laundryId);
//     if (!laundry) {
//       console.error("Invalid laundry data for ID:", laundryId);
//       return;
//     }
//     setLaundryToVoid(laundry);
//     setOpenVoidDialog(true);
//   };

//   const handleConfirmVoid = () => {
//     if (laundryToVoid) {
//       dispatch(voidLaundry(laundryToVoid._id))
//         .unwrap()
//         .then((response) => {
//           toast.success("Laundry record successfully voided");
//           dispatch(fetchLaundries()); // Refresh data
//         })
//         .catch((err) => {
//           console.error("Void error:", err);
//           if (err === "Laundry record is already voided") {
//             toast.error("This laundry record has already been voided.");
//           } else {
//             toast.error(err || "Failed to void laundry record");
//           }
//         })
//         .finally(() => {
//           setOpenVoidDialog(false);
//           setLaundryToVoid(null);
//         });
//     }
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { name: "Customer", options: { filter: true, sort: true } },
//     { name: "Created At", options: { filter: true, sort: true } },
//     { name: "Receipt No", options: { filter: true, sort: false } },
//     { name: "Phone No", options: { filter: true, sort: false } },
//     { name: "Sold By", options: { filter: true, sort: false } },
//     { name: "Payment Method", options: { filter: true, sort: false } },
//     { name: "Voided", options: { filter: true, sort: false } },
//     { name: "Status", options: { filter: true, sort: false } },
//     {
//       name: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value, tableMeta) =>
//           tableMeta.rowIndex === laundries.length
//             ? value
//             : `₦${parseFloat(value).toFixed(2)}`,
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           if (tableMeta.rowIndex === laundries.length) return null;
//           const laundryId = tableMeta.rowData[9]; // _id is at index 9
//           const laundry = laundries.find((l) => l._id === laundryId);
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(laundryId)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: laundry.isVoided ? "not-allowed" : "pointer",
//                   opacity: laundry.isVoided ? 0.5 : 1,
//                 }}
//                 onClick={() => !laundry.isVoided && handleVoidClick(laundryId)}
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
//         Add New Laundry
//       </Button>
//     ),
//   };

//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="laundry tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {status === "failed" && error ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {error || "An error occurred"}
//             </div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title="Laundry Records"
//                 data={status === "loading" ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewLaundryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={openVoidDialog}
//                 onClose={() => setOpenVoidDialog(false)}
//                 aria-labelledby="void-dialog-title"
//                 aria-describedby="void-dialog-description"
//               >
//                 <DialogTitle id="void-dialog-title">
//                   Confirm Void Transaction
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="void-dialog-description">
//                     Are you sure you want to void this transaction? This action
//                     cannot be undone.
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => setOpenVoidDialog(false)}
//                     color="primary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                     Void
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <LaundryReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundries;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
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
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import AddNewLaundryDrawer from "../AddDrawerSection/AddNewLaundryDrawer";
// import { Toaster, toast } from "react-hot-toast";
// import LaundryReports from "./Reports/LaundriesReports";

// const Laundries = () => {
//   const dispatch = useDispatch();
//   const { laundries, status, error } = useSelector((state) => state.laundry);
//   const { paymentMethods } = useSelector((state) => state.paymentMethods);
//   const [data, setData] = useState([]);
//   const [totalAmountSum, setTotalAmountSum] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false);
//   const [laundryToVoid, setLaundryToVoid] = useState(null);
//   const [value, setValue] = useState("0");

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-US", {
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     console.log("Fetching laundries and payment methods...");
//     dispatch(fetchLaundries());
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Laundries - State:", { laundries, status, error });
//     if (laundries && Array.isArray(laundries) && laundries.length > 0) {
//       const sum = laundries.reduce(
//         (sum, laundry) => sum + parseFloat(laundry.totalAmount || 0),
//         0
//       );
//       const formattedData = laundries.map((laundry) => [
//         laundry.customer || "N/A",
//         laundry.createdAt ? formatDate(laundry.createdAt) : "N/A",
//         laundry.receiptNo || "N/A",
//         laundry.phoneNo || "N/A",
//         laundry.salesBy ? laundry.salesBy.fullName : "N/A",
//         laundry.paymentMethod ? laundry.paymentMethod.name : "N/A",
//         laundry.isVoided ? "Yes" : "No",
//         laundry.status || "N/A",
//         laundry.totalAmount !== undefined
//           ? `₦${parseFloat(laundry.totalAmount).toFixed(2)}`
//           : "₦0.00",
//         laundry._id,
//       ]);

//       formattedData.push([
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "Grand Total:",
//         `₦${sum.toFixed(2)}`,
//         "",
//       ]);

//       setData(formattedData);
//       setTotalAmountSum(sum);
//     } else {
//       setData([]);
//       setTotalAmountSum(0);
//       console.log("No laundries data available");
//     }
//   }, [laundries]);

//   const handleEditClick = (laundryId) => {
//     const laundry = laundries.find((l) => l._id === laundryId);
//     if (!laundry) {
//       console.error("Invalid laundry data for ID:", laundryId);
//       return;
//     }
//     setEditData(laundry);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (laundryId) => {
//     const laundry = laundries.find((l) => l._id === laundryId);
//     if (!laundry) {
//       console.error("Invalid laundry data for ID:", laundryId);
//       return;
//     }
//     setLaundryToVoid(laundry);
//     setOpenVoidDialog(true);
//   };

//   const handleConfirmVoid = () => {
//     if (laundryToVoid) {
//       dispatch(voidLaundry(laundryToVoid._id))
//         .unwrap()
//         .then((response) => {
//           toast.success("Laundry record successfully voided");
//           dispatch(fetchLaundries()); // Refresh data
//         })
//         .catch((err) => {
//           console.error("Void error:", err);
//           toast.error(err || "Failed to void laundry record");
//         })
//         .finally(() => {
//           setOpenVoidDialog(false);
//           setLaundryToVoid(null);
//         });
//     }
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { name: "Customer", options: { filter: true, sort: true } },
//     { name: "Created At", options: { filter: true, sort: true } },
//     { name: "Receipt No", options: { filter: true, sort: false } },
//     { name: "Phone No", options: { filter: true, sort: false } },
//     { name: "Sold By", options: { filter: true, sort: false } },
//     { name: "Payment Method", options: { filter: true, sort: false } },
//     { name: "Voided", options: { filter: true, sort: false } },
//     { name: "Status", options: { filter: true, sort: false } },
//     {
//       name: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value, tableMeta) =>
//           tableMeta.rowIndex === laundries.length
//             ? value
//             : `₦${parseFloat(value).toFixed(2)}`,
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           if (tableMeta.rowIndex === laundries.length) return null; // Grand total row
//           const laundryId = tableMeta.rowData[9]; // _id at index 9
//           const laundry = laundries.find((l) => l._id === laundryId) || {};
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(laundryId)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: laundry.isVoided ? "not-allowed" : "pointer",
//                   opacity: laundry.isVoided ? 0.5 : 1,
//                 }}
//                 onClick={() => !laundry.isVoided && handleVoidClick(laundryId)}
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
//         Add New Laundry
//       </Button>
//     ),
//   };

//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="laundry tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {status === "failed" && error ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {error || "An error occurred"}
//             </div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title="Laundry Records"
//                 data={status === "loading" ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewLaundryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={openVoidDialog}
//                 onClose={() => setOpenVoidDialog(false)}
//                 aria-labelledby="void-dialog-title"
//                 aria-describedby="void-dialog-description"
//               >
//                 <DialogTitle id="void-dialog-title">
//                   Confirm Void Transaction
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="void-dialog-description">
//                     Are you sure you want to void this transaction? This action
//                     cannot be undone.
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => setOpenVoidDialog(false)}
//                     color="primary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                     Void
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <LaundryReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundries;

// import React, { useEffect, useState, useCallback } from "react";
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
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import AddNewLaundryDrawer from "../AddDrawerSection/AddNewLaundryDrawer";
// import { hasPermission } from "../../utils/authUtils";
// import { Toaster, toast } from "react-hot-toast";
// import LaundryReports from "./Reports/LaundriesReports";

// const Laundries = () => {
//   const dispatch = useDispatch();
//   const { laundries, status, error } = useSelector((state) => state.laundry);
//   const { paymentMethods } = useSelector((state) => state.paymentMethods); // Not directly used in this corrected code, but kept for completeness
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false);
//   const [laundryToVoid, setLaundryToVoid] = useState(null);
//   const [value, setValue] = useState("0");

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-US", {
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     dispatch(fetchLaundries());
//     dispatch(fetchPaymentMethods()); // Fetch payment methods (good practice)
//   }, [dispatch]);

//   useEffect(() => {
//     if (laundries && Array.isArray(laundries)) {
//       // Calculate the sum *directly* from the laundries data
//       const sum = laundries.reduce(
//         (acc, laundry) => acc + (parseFloat(laundry.totalAmount) || 0), // Ensure totalAmount is a number
//         0
//       );

//       const formattedData = laundries.map((laundry) => [
//         laundry.customer || "N/A",
//         laundry.createdAt ? formatDate(laundry.createdAt) : "N/A",
//         laundry.receiptNo || "N/A",
//         laundry.phoneNo || "N/A",
//         laundry.salesBy ? laundry.salesBy.fullName : "N/A",
//         laundry.paymentMethod ? laundry.paymentMethod.name : "N/A",
//         laundry.isVoided ? "Yes" : "No",
//         laundry.status || "N/A",
//         `₦${(parseFloat(laundry.totalAmount) || 0).toFixed(2)}`, // Format *here*, keep original value for calculations.
//         laundry._id,
//       ]);

//       // Add the "Grand Total" row *after* processing the laundry data
//       formattedData.push([
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "Grand Total:",
//         `₦${sum.toFixed(2)}`,
//         "",
//       ]);

//       setData(formattedData);
//     } else {
//       setData([]); // Set to empty array if no data
//       console.log("No laundries data available");
//     }
//   }, [laundries]); // Depend only on laundries

//   const handleEditClick = useCallback(
//     (laundryId) => {
//       const laundry = laundries.find((l) => l._id === laundryId);
//       if (!laundry) {
//         console.error("Invalid laundry data for ID:", laundryId);
//         return;
//       }
//       setEditData(laundry);
//       setDrawerOpen(true);
//     },
//     [laundries]
//   );

//   const handleVoidClick = useCallback(
//     (laundryId) => {
//       const laundry = laundries.find((l) => l._id === laundryId);
//       if (!laundry) {
//         console.error("Invalid laundry data for ID:", laundryId);
//         return;
//       }
//       setLaundryToVoid(laundry);
//       setOpenVoidDialog(true);
//     },
//     [laundries]
//   );
//   const handleConfirmVoid = () => {
//     if (laundryToVoid) {
//       dispatch(voidLaundry(laundryToVoid._id))
//         .unwrap()
//         .then((response) => {
//           toast.success("Laundry record successfully voided");
//           dispatch(fetchLaundries());
//         })
//         .catch((err) => {
//           console.error("Void error:", err);
//           toast.error(err || "Failed to void laundry record");
//         })
//         .finally(() => {
//           setOpenVoidDialog(false);
//           setLaundryToVoid(null);
//         });
//     }
//   };

//   const handleAddNewClick = useCallback(() => {
//     setEditData(null);
//     setDrawerOpen(true);
//   }, []);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { name: "Customer", options: { filter: true, sort: true } },
//     { name: "Created At", options: { filter: true, sort: true } },
//     { name: "Receipt No", options: { filter: true, sort: false } },
//     { name: "Phone No", options: { filter: true, sort: false } },
//     { name: "Sold By", options: { filter: true, sort: false } },
//     { name: "Payment Method", options: { filter: true, sort: false } },
//     { name: "Voided", options: { filter: true, sort: false } },
//     { name: "Status", options: { filter: true, sort: false } },
//     {
//       name: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         // No customBodyRender needed here anymore
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           // Check if it's the *last* row (Grand Total)
//           if (tableMeta.rowIndex === data.length - 1) {
//             return null; // Don't show actions for the grand total
//           }

//           const laundryId = tableMeta.rowData[9]; // Get the _id
//           const laundry = laundries.find((l) => l._id === laundryId); // Find the laundry object

//           if (!laundry) {
//             return null; // Or some error indicator if you like
//           }

//           return (
//             <>
//               {hasPermission(user, "update:laundries") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleEditClick(laundryId);
//                   }}
//                 ></i>
//               )}

//               {hasPermission(user, "void:laundries") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{
//                     color: "#fe1e00",
//                     cursor: laundry.isVoided ? "not-allowed" : "pointer",
//                     opacity: laundry.isVoided ? 0.5 : 1,
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     !laundry.isVoided && handleVoidClick(laundryId);
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

//   const options = {
//     filterType: "checkbox",
//     rowsPerPage: 10,
//     customToolbar: () =>
//       hasPermission(user, "write:laundries") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleAddNewClick();
//           }}
//           sx={{
//             backgroundColor: "#fe6c00",
//             color: "#fff",
//             "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
//           }}
//         >
//           Add New Laundry
//         </Button>
//       ) : null,
//   };

//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="laundry tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {status === "failed" && error ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {error || "An error occurred"}
//             </div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title="Laundry Records"
//                 data={status === "loading" ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewLaundryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   console.log("Closing drawer");
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={openVoidDialog}
//                 onClose={() => setOpenVoidDialog(false)}
//                 aria-labelledby="void-dialog-title"
//                 aria-describedby="void-dialog-description"
//               >
//                 <DialogTitle id="void-dialog-title">
//                   Confirm Void Transaction
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="void-dialog-description">
//                     Are you sure you want to void this transaction? This action
//                     cannot be undone.
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => setOpenVoidDialog(false)}
//                     color="primary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                     Void
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <LaundryReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundries;

// import React, { useEffect, useState, useCallback } from "react";
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
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import AddNewLaundryDrawer from "../AddDrawerSection/AddNewLaundryDrawer";
// import { hasPermission } from "../../utils/authUtils";
// import { Toaster, toast } from "react-hot-toast";
// import LaundryReports from "./Reports/LaundriesReports";

// const Laundries = () => {
//   const dispatch = useDispatch();
//   const { laundries, status, error } = useSelector((state) => state.laundry);
//   const { paymentMethods } = useSelector((state) => state.paymentMethods);
//   const { user } = useSelector((state) => state.auth);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false);
//   const [laundryToVoid, setLaundryToVoid] = useState(null);
//   const [value, setValue] = useState("0");

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-US", {
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     dispatch(fetchLaundries());
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   const rows = laundries
//     ? [
//         ...laundries.map((laundry) => ({
//           id: laundry._id, // Required by DataGrid
//           customer: laundry.customer || "N/A",
//           createdAt: laundry.createdAt ? formatDate(laundry.createdAt) : "N/A",
//           receiptNo: laundry.receiptNo || "N/A",
//           phoneNo: laundry.phoneNo || "N/A",
//           salesBy: laundry.salesBy ? laundry.salesBy.fullName : "N/A",
//           paymentMethod: laundry.paymentMethod
//             ? laundry.paymentMethod.name
//             : "N/A",
//           isVoided: laundry.isVoided ? "Yes" : "No",
//           status: laundry.status || "N/A",
//           totalAmount: `₦${(parseFloat(laundry.totalAmount) || 0).toFixed(2)}`,
//         })),
//         {
//           id: "grand-total",
//           customer: "",
//           createdAt: "",
//           receiptNo: "",
//           phoneNo: "",
//           salesBy: "",
//           paymentMethod: "",
//           isVoided: "",
//           status: "Grand Total:",
//           totalAmount: `₦${laundries
//             .reduce(
//               (acc, laundry) => acc + (parseFloat(laundry.totalAmount) || 0),
//               0
//             )
//             .toFixed(2)}`,
//         },
//       ]
//     : [];

//   const handleEditClick = useCallback(
//     (laundryId) => {
//       const laundry = laundries.find((l) => l._id === laundryId);
//       if (!laundry) {
//         console.error("Invalid laundry data for ID:", laundryId);
//         return;
//       }
//       setEditData(laundry);
//       setDrawerOpen(true);
//     },
//     [laundries]
//   );

//   const handleVoidClick = useCallback(
//     (laundryId) => {
//       const laundry = laundries.find((l) => l._id === laundryId);
//       if (!laundry) {
//         console.error("Invalid laundry data for ID:", laundryId);
//         return;
//       }
//       setLaundryToVoid(laundry);
//       setOpenVoidDialog(true);
//     },
//     [laundries]
//   );

//   const handleConfirmVoid = () => {
//     if (laundryToVoid) {
//       dispatch(voidLaundry(laundryToVoid._id))
//         .unwrap()
//         .then((response) => {
//           toast.success("Laundry record successfully voided");
//           dispatch(fetchLaundries());
//         })
//         .catch((err) => {
//           console.error("Void error:", err);
//           toast.error(err || "Failed to void laundry record");
//         })
//         .finally(() => {
//           setOpenVoidDialog(false);
//           setLaundryToVoid(null);
//         });
//     }
//   };

//   const handleAddNewClick = useCallback(() => {
//     setEditData(null);
//     setDrawerOpen(true);
//   }, []);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     {
//       field: "customer",
//       headerName: "Customer",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "createdAt",
//       headerName: "Created At",
//       width: 180,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "receiptNo",
//       headerName: "Receipt No",
//       width: 120,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "phoneNo",
//       headerName: "Phone No",
//       width: 120,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "salesBy",
//       headerName: "Sold By",
//       width: 150,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "paymentMethod",
//       headerName: "Payment Method",
//       width: 150,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "isVoided",
//       headerName: "Voided",
//       width: 100,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 120,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "totalAmount",
//       headerName: "Total Amount",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       width: 150,
//       filterable: false,
//       sortable: false,
//       renderCell: (params) => {
//         if (params.row.id === "grand-total") return null; // No actions for grand total
//         const laundryId = params.row.id;
//         const laundry = laundries.find((l) => l._id === laundryId);
//         if (!laundry) return null;
//         return (
//           <>
//             {hasPermission(user, "update:laundries") && (
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEditClick(laundryId);
//                 }}
//               />
//             )}
//             {hasPermission(user, "void:laundries") && (
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: laundry.isVoided ? "not-allowed" : "pointer",
//                   opacity: laundry.isVoided ? 0.5 : 1,
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   !laundry.isVoided && handleVoidClick(laundryId);
//                 }}
//               />
//             )}
//           </>
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

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="laundry tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {status === "failed" && error ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {error || "An error occurred"}
//             </div>
//           ) : (
//             <Box sx={{ height: 600, width: "100%", position: "relative" }}>
//               {status === "loading" && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     zIndex: 1000,
//                   }}
//                 >
//                   <CircularProgress sx={{ color: "#fe6c00" }} />
//                 </Box>
//               )}
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
//                     hasPermission(user, "write:laundries") ? (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleAddNewClick();
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
//                         Add New Laundry
//                       </Button>
//                     ) : null,
//                 }}
//               />
//               <AddNewLaundryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   console.log("Closing drawer");
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={openVoidDialog}
//                 onClose={() => setOpenVoidDialog(false)}
//                 aria-labelledby="void-dialog-title"
//                 aria-describedby="void-dialog-description"
//               >
//                 <DialogTitle id="void-dialog-title">
//                   Confirm Void Transaction
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="void-dialog-description">
//                     Are you sure you want to void this transaction? This action
//                     cannot be undone.
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => setOpenVoidDialog(false)}
//                     color="primary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                     Void
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </Box>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <LaundryReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundries;

// import React, { useEffect, useState, useCallback } from "react";
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
//   TextField,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
// import PrintIcon from "@mui/icons-material/Print"; // Print icon
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import AddNewLaundryDrawer from "../AddDrawerSection/AddNewLaundryDrawer";
// import { hasPermission } from "../../utils/authUtils";
// import { Toaster, toast } from "react-hot-toast";
// import LaundryReports from "./Reports/LaundriesReports";

// const Laundries = () => {
//   const dispatch = useDispatch();
//   const { laundries, status, error } = useSelector((state) => state.laundry);
//   const { paymentMethods } = useSelector((state) => state.paymentMethods);
//   const { user } = useSelector((state) => state.auth);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false);
//   const [laundryToVoid, setLaundryToVoid] = useState(null);
//   const [value, setValue] = useState("0");
//   const [searchText, setSearchText] = useState("");
//   const [filteredRows, setFilteredRows] = useState([]);

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-US", {
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     dispatch(fetchLaundries());
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   const rows = laundries
//     ? [
//         ...laundries.map((laundry) => ({
//           id: laundry._id,
//           customer: laundry.customer || "N/A",
//           createdAt: laundry.createdAt ? formatDate(laundry.createdAt) : "N/A",
//           receiptNo: laundry.receiptNo || "N/A",
//           phoneNo: laundry.phoneNo || "N/A",
//           salesBy: laundry.salesBy ? laundry.salesBy.fullName : "N/A",
//           paymentMethod: laundry.paymentMethod
//             ? laundry.paymentMethod.name
//             : "N/A",
//           isVoided: laundry.isVoided ? "Yes" : "No",
//           status: laundry.status || "N/A",
//           totalAmount: `₦${(parseFloat(laundry.totalAmount) || 0).toFixed(2)}`,
//         })),
//         {
//           id: "grand-total",
//           customer: "",
//           createdAt: "",
//           receiptNo: "",
//           phoneNo: "",
//           salesBy: "",
//           paymentMethod: "",
//           isVoided: "",
//           status: "Grand Total:",
//           totalAmount: `₦${laundries
//             .reduce(
//               (acc, laundry) => acc + (parseFloat(laundry.totalAmount) || 0),
//               0
//             )
//             .toFixed(2)}`,
//         },
//       ]
//     : [];

//   useEffect(() => {
//     setFilteredRows(rows); // Initialize filtered rows with all rows
//   }, [rows]);

//   // Search functionality
//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredRows(rows);
//     } else {
//       const filtered = rows.filter((row) =>
//         Object.values(row).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchVal.toLowerCase())
//         )
//       );
//       setFilteredRows(filtered);
//     }
//   };

//   // CSV Export functionality
//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredRows
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
//     link.download = "laundries.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (laundryId) => {
//       const laundry = laundries.find((l) => l._id === laundryId);
//       if (!laundry) {
//         console.error("Invalid laundry data for ID:", laundryId);
//         return;
//       }
//       setEditData(laundry);
//       setDrawerOpen(true);
//     },
//     [laundries]
//   );

//   const handleVoidClick = useCallback(
//     (laundryId) => {
//       const laundry = laundries.find((l) => l._id === laundryId);
//       if (!laundry) {
//         console.error("Invalid laundry data for ID:", laundryId);
//         return;
//       }
//       setLaundryToVoid(laundry);
//       setOpenVoidDialog(true);
//     },
//     [laundries]
//   );

//   const handleConfirmVoid = () => {
//     if (laundryToVoid) {
//       dispatch(voidLaundry(laundryToVoid._id))
//         .unwrap()
//         .then((response) => {
//           toast.success("Laundry record successfully voided");
//           dispatch(fetchLaundries());
//         })
//         .catch((err) => {
//           console.error("Void error:", err);
//           toast.error(err || "Failed to void laundry record");
//         })
//         .finally(() => {
//           setOpenVoidDialog(false);
//           setLaundryToVoid(null);
//         });
//     }
//   };

//   const handleAddNewClick = useCallback(() => {
//     setEditData(null);
//     setDrawerOpen(true);
//   }, []);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     {
//       field: "customer",
//       headerName: "Customer",
//       flex: 1,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "createdAt",
//       headerName: "Created At",
//       flex: 1,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "receiptNo",
//       headerName: "Receipt No",
//       flex: 1,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "phoneNo",
//       headerName: "Phone No",
//       flex: 1,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "salesBy",
//       headerName: "Sold By",
//       flex: 1,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "paymentMethod",
//       headerName: "Payment Method",
//       flex: 1,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "isVoided",
//       headerName: "Voided",
//       flex: 1,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       flex: 1,
//       filterable: true,
//       sortable: false,
//     },
//     {
//       field: "totalAmount",
//       headerName: "Total Amount",
//       flex: 1,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       flex: 1,
//       filterable: false,
//       sortable: false,
//       renderCell: (params) => {
//         if (params.row.id === "grand-total") return null;
//         const laundryId = params.row.id;
//         const laundry = laundries.find((l) => l._id === laundryId);
//         if (!laundry) return null;
//         return (
//           <>
//             {hasPermission(user, "update:laundries") && (
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEditClick(laundryId);
//                 }}
//               />
//             )}
//             {hasPermission(user, "void:laundries") && (
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: laundry.isVoided ? "not-allowed" : "pointer",
//                   opacity: laundry.isVoided ? 0.5 : 1,
//                 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   !laundry.isVoided && handleVoidClick(laundryId);
//                 }}
//               />
//             )}
//           </>
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
//             "& .MuiDataGrid-footerContainer": {
//               backgroundColor: "#29221d",
//               color: "#fcfcfc",
//               "& .MuiTablePagination-root": {
//                 color: "#fcfcfc",
//               },
//               "& .MuiIconButton-root": {
//                 color: "#fcfcfc",
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

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="laundry tabs">
//             <Tab label="Sales Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {status === "failed" && error ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {error || "An error occurred"}
//             </div>
//           ) : (
//             <Box sx={{ width: "100%", position: "relative" }}>
//               <Box
//                 sx={{
//                   padding: "8px",
//                   backgroundColor: "#d0d0d0",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "8px",
//                   "@media print": {
//                     display: "none",
//                   },
//                 }}
//               >
//                 <Typography variant="h6" sx={{ color: "#000" }}>
//                   Laundries
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                   <TextField
//                     variant="outlined"
//                     size="small"
//                     placeholder="Search..."
//                     value={searchText}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//                   />
//                   <IconButton
//                     onClick={handleExport}
//                     sx={{
//                       color: "#473b33",
//                       "&:hover": { color: "#fec80a" },
//                     }}
//                     title="Download CSV"
//                   >
//                     <GetAppIcon />
//                   </IconButton>
//                   <IconButton
//                     onClick={handlePrint}
//                     sx={{
//                       color: "#302924",
//                       "&:hover": { color: "#fec80a" },
//                     }}
//                     title="Print"
//                   >
//                     <PrintIcon />
//                   </IconButton>
//                   {hasPermission(user, "write:laundries") && (
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={handleAddNewClick}
//                       sx={{
//                         backgroundColor: "#fe6c00",
//                         color: "#fff",
//                         "&:hover": {
//                           backgroundColor: "#fec80a",
//                           color: "#bdbabb",
//                         },
//                       }}
//                     >
//                       Add New Laundry
//                     </Button>
//                   )}
//                 </Box>
//               </Box>
//               {status === "loading" ? (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     height: "200px",
//                     width: "100%",
//                   }}
//                 >
//                   <CircularProgress sx={{ color: "#fe6c00" }} />
//                 </Box>
//               ) : (
//                 <Box sx={{ height: 600, width: "100%" }}>
//                   <DataGrid
//                     rows={filteredRows}
//                     columns={columns}
//                     pageSizeOptions={[10, 20, 50]}
//                     initialState={{
//                       pagination: { paginationModel: { pageSize: 10 } },
//                     }}
//                     checkboxSelection={false}
//                     disableRowSelectionOnClick
//                   />
//                 </Box>
//               )}
//               <AddNewLaundryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   console.log("Closing drawer");
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={openVoidDialog}
//                 onClose={() => setOpenVoidDialog(false)}
//                 aria-labelledby="void-dialog-title"
//                 aria-describedby="void-dialog-description"
//               >
//                 <DialogTitle id="void-dialog-title">
//                   Confirm Void Transaction
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="void-dialog-description">
//                     Are you sure you want to void this transaction? This action
//                     cannot be undone.
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => setOpenVoidDialog(false)}
//                     color="primary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                     Void
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </Box>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <LaundryReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundries;

import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
import PrintIcon from "@mui/icons-material/Print"; // Print icon
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import AddNewLaundryDrawer from "../AddDrawerSection/AddNewLaundryDrawer";
import { hasPermission } from "../../utils/authUtils";
import { Toaster, toast } from "react-hot-toast";
import LaundryReports from "./Reports/LaundriesReports";

const Laundries = () => {
  const dispatch = useDispatch();
  const { laundries, status, error } = useSelector((state) => state.laundry);
  const { paymentMethods } = useSelector((state) => state.paymentMethods);
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openVoidDialog, setOpenVoidDialog] = useState(false);
  const [laundryToVoid, setLaundryToVoid] = useState(null);
  const [value, setValue] = useState("0");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return !isNaN(date.getTime())
      ? date.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A";
  };

  useEffect(() => {
    dispatch(fetchLaundries());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (laundries) {
      const formattedData = laundries.map((laundry) => ({
        id: laundry._id, // Required by DataGrid
        customer: laundry.customer || "N/A",
        createdAt: laundry.createdAt ? formatDate(laundry.createdAt) : "N/A",
        receiptNo: laundry.receiptNo || "N/A",
        phoneNo: laundry.phoneNo || "N/A",
        salesBy: laundry.salesBy ? laundry.salesBy.fullName : "N/A",
        paymentMethod: laundry.paymentMethod
          ? laundry.paymentMethod.name
          : "N/A",
        isVoided: laundry.isVoided ? "Yes" : "No",
        status: laundry.status || "N/A",
        totalAmount: `₦${(parseFloat(laundry.totalAmount) || 0).toFixed(2)}`,
      }));
      setFilteredData(formattedData);
    }
  }, [laundries]);

  const handleSearch = (searchVal) => {
    setSearchText(searchVal);
    if (searchVal.trim() === "") {
      setFilteredData(laundries);
    } else {
      const filtered = laundries.filter((row) =>
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
    link.download = "laundries.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (laundryId) => {
      const laundry = laundries.find((l) => l._id === laundryId);
      if (!laundry) {
        console.error("Invalid laundry data for ID:", laundryId);
        return;
      }
      setEditData(laundry);
      setDrawerOpen(true);
    },
    [laundries]
  );

  const handleVoidClick = useCallback(
    (laundryId) => {
      const laundry = laundries.find((l) => l._id === laundryId);
      if (!laundry) {
        console.error("Invalid laundry data for ID:", laundryId);
        return;
      }
      setLaundryToVoid(laundry);
      setOpenVoidDialog(true);
    },
    [laundries]
  );

  const handleConfirmVoid = () => {
    if (laundryToVoid) {
      dispatch(voidLaundry(laundryToVoid._id))
        .unwrap()
        .then((response) => {
          toast.success("Laundry record successfully voided");
          dispatch(fetchLaundries());
        })
        .catch((err) => {
          console.error("Void error:", err);
          toast.error(err || "Failed to void laundry record");
        })
        .finally(() => {
          setOpenVoidDialog(false);
          setLaundryToVoid(null);
        });
    }
  };

  const handleAddNewClick = useCallback(() => {
    setEditData(null);
    setDrawerOpen(true);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    {
      field: "customer",
      headerName: "Customer",
      width: 150,
      filterable: true,
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      filterable: true,
      sortable: true,
    },
    {
      field: "receiptNo",
      headerName: "Receipt No",
      width: 120,
      filterable: true,
      sortable: false,
    },
    {
      field: "phoneNo",
      headerName: "Phone No",
      width: 120,
      filterable: true,
      sortable: false,
    },
    {
      field: "salesBy",
      headerName: "Sold By",
      width: 150,
      filterable: true,
      sortable: false,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      width: 150,
      filterable: true,
      sortable: false,
    },
    {
      field: "isVoided",
      headerName: "Voided",
      width: 100,
      filterable: true,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      filterable: true,
      sortable: false,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 150,
      filterable: true,
      sortable: true,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        if (params.row.id === "grand-total") return null; // No actions for grand total
        const laundryId = params.row.id;
        const laundry = laundries.find((l) => l._id === laundryId);
        if (!laundry) return null;
        return (
          <>
            {hasPermission(user, "update:laundries") && (
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(laundryId);
                }}
              />
            )}
            {hasPermission(user, "void:laundries") && (
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor: laundry.isVoided ? "not-allowed" : "pointer",
                  opacity: laundry.isVoided ? 0.5 : 1,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  !laundry.isVoided && handleVoidClick(laundryId);
                }}
              />
            )}
          </>
        );
      },
    },
  ];

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: "#f0f0f0",
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
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#d0d0d0",
              "& .MuiButton-root": { color: "#3f51b5" },
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
          <TabList onChange={handleChange} aria-label="laundry tabs">
            <Tab label="Sales Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {status === "failed" && error ? (
            <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
              Error: {error || "An error occurred"}
            </div>
          ) : (
            <Box sx={{ height: 600, width: "100%", position: "relative" }}>
              {status === "loading" && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000,
                  }}
                >
                  <CircularProgress sx={{ color: "#fe6c00" }} />
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
                  Laundry Records
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
                  {hasPermission(user, "write:laundries") && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddNewClick();
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
                      Add New Laundry
                    </Button>
                  )}
                </Box>
              </Box>
              <DataGrid
                rows={filteredData}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                checkboxSelection={false}
                disableRowSelectionOnClick
              />
              <AddNewLaundryDrawer
                open={drawerOpen}
                onClose={() => {
                  console.log("Closing drawer");
                  setDrawerOpen(false);
                  setEditData(null);
                }}
                editMode={!!editData}
                initialData={editData || {}}
              />
              <Dialog
                open={openVoidDialog}
                onClose={() => setOpenVoidDialog(false)}
                aria-labelledby="void-dialog-title"
                aria-describedby="void-dialog-description"
              >
                <DialogTitle id="void-dialog-title">
                  Confirm Void Transaction
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="void-dialog-description">
                    Are you sure you want to void this transaction? This action
                    cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpenVoidDialog(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmVoid} color="error" autoFocus>
                    Void
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </TabPanel>
        <TabPanel value="1">
          <LaundryReports />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default Laundries;
