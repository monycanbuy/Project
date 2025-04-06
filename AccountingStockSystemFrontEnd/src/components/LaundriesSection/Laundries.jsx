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
//   IconButton,
//   Typography,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
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
//   const [filteredData, setFilteredData] = useState([]);

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-NG", {
//           timeZone: "Africa/Lagos",
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
//     if (laundries) {
//       const formattedData = laundries.map((laundry) => ({
//         id: laundry._id,
//         customer: laundry.customer || "N/A",
//         transactionDate: laundry.transactionDate
//           ? formatDate(laundry.transactionDate)
//           : "N/A", // Added transactionDate
//         receiptNo: laundry.receiptNo || "N/A",
//         phoneNo: laundry.phoneNo || "N/A",
//         salesBy: laundry.salesBy ? laundry.salesBy.fullName : "N/A",
//         paymentMethod: laundry.paymentMethod
//           ? laundry.paymentMethod.name
//           : "N/A",
//         isVoided: laundry.isVoided ? "Yes" : "No",
//         status: laundry.status || "N/A",
//         totalAmount: `₦${(parseFloat(laundry.totalAmount) || 0).toFixed(2)}`,
//       }));
//       setFilteredData(formattedData);
//     }
//   }, [laundries]);

//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredData(
//         laundries.map((laundry) => ({
//           id: laundry._id,
//           customer: laundry.customer || "N/A",
//           transactionDate: laundry.transactionDate
//             ? formatDate(laundry.transactionDate)
//             : "N/A",
//           receiptNo: laundry.receiptNo || "N/A",
//           phoneNo: laundry.phoneNo || "N/A",
//           salesBy: laundry.salesBy ? laundry.salesBy.fullName : "N/A",
//           paymentMethod: laundry.paymentMethod
//             ? laundry.paymentMethod.name
//             : "N/A",
//           isVoided: laundry.isVoided ? "Yes" : "No",
//           status: laundry.status || "N/A",
//           totalAmount: `₦${(parseFloat(laundry.totalAmount) || 0).toFixed(2)}`,
//         }))
//       );
//     } else {
//       const filtered = laundries
//         .filter((row) =>
//           Object.values(row).some(
//             (value) =>
//               value &&
//               value.toString().toLowerCase().includes(searchVal.toLowerCase())
//           )
//         )
//         .map((laundry) => ({
//           id: laundry._id,
//           customer: laundry.customer || "N/A",
//           transactionDate: laundry.transactionDate
//             ? formatDate(laundry.transactionDate)
//             : "N/A",
//           receiptNo: laundry.receiptNo || "N/A",
//           phoneNo: laundry.phoneNo || "N/A",
//           salesBy: laundry.salesBy ? laundry.salesBy.fullName : "N/A",
//           paymentMethod: laundry.paymentMethod
//             ? laundry.paymentMethod.name
//             : "N/A",
//           isVoided: laundry.isVoided ? "Yes" : "No",
//           status: laundry.status || "N/A",
//           totalAmount: `₦${(parseFloat(laundry.totalAmount) || 0).toFixed(2)}`,
//         }));
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
//     link.download = "laundries.csv";
//     link.click();
//   };

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
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "transactionDate", // Added transactionDate
//       headerName: "Transaction Date",
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
//                   Laundry Records
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
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAddNewClick();
//                       }}
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
//               <DataGrid
//                 rows={filteredData}
//                 columns={columns}
//                 pageSizeOptions={[10, 20, 50]}
//                 initialState={{
//                   pagination: { paginationModel: { pageSize: 10 } },
//                 }}
//                 checkboxSelection={false}
//                 disableRowSelectionOnClick
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
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaundries, voidLaundry } from "../../redux/slices/laundrySlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice"; // For Retry
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
      ? date.toLocaleString("en-NG", {
          timeZone: "Africa/Lagos",
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A";
  };

  useEffect(() => {
    //console.log("Fetching laundries and payment methods...");
    dispatch(fetchLaundries())
      .unwrap()
      .catch((err) => {
        console.error("Fetch laundries failed:", err);
        if (err.status === 401) {
          //console.log("401 detected in Laundries component");
        }
      });
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (laundries) {
      const formattedData = laundries.map((laundry) => ({
        id: laundry._id,
        customer: laundry.customer || "N/A",
        transactionDate: laundry.transactionDate
          ? formatDate(laundry.transactionDate)
          : "N/A",
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
      setFilteredData(
        laundries.map((laundry) => ({
          id: laundry._id,
          customer: laundry.customer || "N/A",
          transactionDate: laundry.transactionDate
            ? formatDate(laundry.transactionDate)
            : "N/A",
          receiptNo: laundry.receiptNo || "N/A",
          phoneNo: laundry.phoneNo || "N/A",
          salesBy: laundry.salesBy ? laundry.salesBy.fullName : "N/A",
          paymentMethod: laundry.paymentMethod
            ? laundry.paymentMethod.name
            : "N/A",
          isVoided: laundry.isVoided ? "Yes" : "No",
          status: laundry.status || "N/A",
          totalAmount: `₦${(parseFloat(laundry.totalAmount) || 0).toFixed(2)}`,
        }))
      );
    } else {
      const filtered = laundries
        .filter((row) =>
          Object.values(row).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchVal.toLowerCase())
          )
        )
        .map((laundry) => ({
          id: laundry._id,
          customer: laundry.customer || "N/A",
          transactionDate: laundry.transactionDate
            ? formatDate(laundry.transactionDate)
            : "N/A",
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

  const handleRetry = () => {
    dispatch(checkAuthStatus()); // Trigger auth check on retry
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
      field: "transactionDate",
      headerName: "Transaction Date",
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
        if (params.row.id === "grand-total") return null;
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
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#29221d",
              color: "#fcfcfc",
              "& .MuiTablePagination-root": {
                color: "#fcfcfc",
              },
              "& .MuiIconButton-root": {
                color: "#fcfcfc",
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
          <TabList onChange={handleChange} aria-label="laundry tabs">
            <Tab label="Sales Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {status === "failed" && error ? (
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
                Error: {error || "An error occurred"}
              </Typography>
              <Button
                variant="contained"
                onClick={handleRetry}
                sx={{
                  backgroundColor: "#fe6c00",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#fec80a",
                    color: "#000",
                  },
                }}
              >
                Retry
              </Button>
            </Box>
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
                  //console.log("Closing drawer");
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
