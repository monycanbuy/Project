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
//   fetchHallTransactions,
//   voidHallTransaction,
// } from "../../redux/slices/hallSlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewHallDrawer from "../AddDrawerSection/AddNewHallDrawer";
// import { Toaster, toast } from "react-hot-toast";
// import HallReports from "./Reports/HallReports";

// const Hall = () => {
//   const dispatch = useDispatch();
//   const {
//     transactions: hallTransactions = [],
//     isLoading,
//     error,
//   } = useSelector((state) => state.hallTransactions || {});
//   const { paymentMethods } = useSelector((state) => state.paymentMethods);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [totalAmountSum, setTotalAmountSum] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false);
//   const [hallToVoid, setHallToVoid] = useState(null);
//   const [value, setValue] = useState("0");
//   const [searchText, setSearchText] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-NG", {
//           timeZone: "Africa/Lagos", // WAT (UTC+1)
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     dispatch(fetchHallTransactions());
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("hallTransactions:", hallTransactions); // Debug log
//     if (
//       hallTransactions &&
//       Array.isArray(hallTransactions) &&
//       hallTransactions.length > 0
//     ) {
//       const sum = hallTransactions.reduce(
//         (sum, transaction) => sum + parseFloat(transaction.totalAmount || 0),
//         0
//       );

//       const formattedData = hallTransactions.map((transaction) => {
//         const staffInvolved = transaction.staffInvolved
//           ? transaction.staffInvolved.fullName
//           : "N/A";
//         const paymentMethod = transaction.paymentMethod
//           ? paymentMethods.find(
//               (pm) => pm._id === transaction.paymentMethod._id
//             )
//           : null;
//         return {
//           id: transaction._id || "N/A",
//           customerName: transaction.customerName || "N/A",
//           date: transaction.date ? formatDate(transaction.date) : "N/A",
//           // date: formatDate(transaction.date), // Formatted for display
//           // rawDate: transaction.date || null, // Raw ISO for sorting, fallback to null
//           contactPhone: transaction.contactPhone || "N/A",
//           startTime: transaction.startTime
//             ? formatDate(transaction.startTime)
//             : "N/A",
//           endTime: transaction.endTime
//             ? formatDate(transaction.endTime)
//             : "N/A",
//           staffInvolved,
//           eventType: transaction.eventType || "N/A",
//           paymentMethod: paymentMethod ? paymentMethod.name : "N/A",
//           paymentStatus: transaction.paymentStatus || "N/A",
//           notes: transaction.notes || "N/A",
//           isVoided: transaction.isVoided ? "Yes" : "No",
//           totalAmount:
//             transaction.totalAmount !== undefined
//               ? `₦${parseFloat(transaction.totalAmount).toFixed(2)}`
//               : "₦0.00",
//         };
//       });

//       setData(formattedData);
//       setFilteredData(formattedData);
//       setTotalAmountSum(sum);
//     } else {
//       setData([]);
//       setFilteredData([]);
//       setTotalAmountSum(0);
//     }
//   }, [hallTransactions, paymentMethods]);

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
//     link.download = "hall_transactions.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = (transaction) => {
//     if (!transaction) {
//       console.error("Invalid transaction data:", transaction);
//       return;
//     }
//     const rawTransaction = hallTransactions.find(
//       (t) => t._id === transaction.id
//     );
//     if (!rawTransaction) {
//       console.error("Raw transaction not found for id:", transaction.id);
//       return;
//     }
//     setEditData(rawTransaction);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (transaction) => {
//     if (!transaction) {
//       console.error("Invalid transaction data:", transaction);
//       return;
//     }
//     setHallToVoid(transaction);
//     setOpenVoidDialog(true);
//   };

//   const handleConfirmVoid = async () => {
//     if (hallToVoid) {
//       try {
//         const response = await dispatch(
//           voidHallTransaction(hallToVoid.id)
//         ).unwrap();
//         if (response.success) {
//           toast.success("Hall transaction successfully voided");
//           dispatch(fetchHallTransactions());
//         } else {
//           toast.error(response.message || "Failed to void hall transaction");
//         }
//       } catch (error) {
//         if (error.message === "This transaction has already been voided") {
//           toast.error("This hall transaction has already been voided.");
//         } else {
//           toast.error(error.message || "Failed to void hall transaction");
//         }
//       } finally {
//         setOpenVoidDialog(false);
//         setHallToVoid(null);
//       }
//     }
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { field: "customerName", headerName: "Customer Name", flex: 1 },
//     // {
//     //   field: "date",
//     //   headerName: "Transaction Date",
//     //   flex: 1,
//     //   type: "dateTime",
//     //   valueGetter: (params) =>
//     //     params.row.rawDate ? new Date(params.row.rawDate) : null, // Safe handling
//     // },
//     {
//       field: "date", // Added transactionDate
//       headerName: "Transaction Date",
//       width: 180,
//       filterable: true,
//       sortable: true,
//     },
//     { field: "contactPhone", headerName: "Contact Phone", flex: 1 },
//     { field: "startTime", headerName: "Start Time", flex: 1 },
//     { field: "endTime", headerName: "End Time", flex: 1 },
//     { field: "staffInvolved", headerName: "Staff Involved", flex: 1 },
//     { field: "eventType", headerName: "Event Type", flex: 1 },
//     { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
//     { field: "paymentStatus", headerName: "Payment Status", flex: 1 },
//     { field: "notes", headerName: "Notes", flex: 1 },
//     { field: "isVoided", headerName: "Voided", flex: 1 },
//     { field: "totalAmount", headerName: "Total Amount", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "write:hall") && (
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
//           {hasPermission(user, "delete:hall") && (
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor:
//                   params.row.isVoided === "Yes" ? "not-allowed" : "pointer",
//                 opacity: params.row.isVoided === "Yes" ? 0.5 : 1,
//               }}
//               onClick={() =>
//                 params.row.isVoided !== "Yes" && handleVoidClick(params.row)
//               }
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
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Transaction Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div>Error: {error.message || "An error occurred."}</div>
//           ) : (
//             <Box sx={{ width: "100%" }}>
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
//                   Hall Transactions
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
//                   {hasPermission(user, "write:hall") && (
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={() => {
//                         setEditData(null);
//                         setDrawerOpen(true);
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
//                       Add New Hall Transaction
//                     </Button>
//                   )}
//                 </Box>
//               </Box>
//               {isLoading ? (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     height: "200px",
//                     width: "100%",
//                   }}
//                 >
//                   <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//                 </Box>
//               ) : (
//                 <Box sx={{ height: 600, width: "100%" }}>
//                   <DataGrid
//                     rows={filteredData}
//                     columns={columns}
//                     pageSizeOptions={[10, 20, 50]}
//                     initialState={{
//                       pagination: { paginationModel: { pageSize: 10 } },
//                       sorting: {
//                         sortModel: [{ field: "date", sort: "asc" }],
//                       },
//                     }}
//                     disableSelectionOnClick
//                   />
//                 </Box>
//               )}
//               <AddNewHallDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//                 onSaveSuccess={() => dispatch(fetchHallTransactions())}
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
//             </Box>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <HallReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Hall;

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  fetchHallTransactions,
  voidHallTransaction,
} from "../../redux/slices/hallSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewHallDrawer from "../AddDrawerSection/AddNewHallDrawer";
import HallReports from "./Reports/HallReports";

const Hall = () => {
  const dispatch = useDispatch();
  const {
    transactions: hallTransactions = [],
    isLoading = false,
    error,
  } = useSelector((state) => state.hallTransactions || {});
  const { paymentMethods = [] } = useSelector(
    (state) => state.paymentMethods || {}
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [totalAmountSum, setTotalAmountSum] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openVoidDialog, setOpenVoidDialog] = useState(false);
  const [hallToVoid, setHallToVoid] = useState(null);
  const [value, setValue] = useState("0");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

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
    //console.log("Hall - Mount check", { isAuthenticated, initialFetchDone });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching hall transactions and payment methods...");
        dispatch(fetchHallTransactions());
        dispatch(fetchPaymentMethods());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching data...");
            dispatch(fetchHallTransactions());
            dispatch(fetchPaymentMethods());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    //console.log("Hall - Data update", { hallTransactions, paymentMethods });
    if (
      hallTransactions &&
      Array.isArray(hallTransactions) &&
      hallTransactions.length > 0
    ) {
      const sum = hallTransactions.reduce(
        (sum, transaction) => sum + parseFloat(transaction.totalAmount || 0),
        0
      );

      const formattedData = hallTransactions.map((transaction) => {
        const staffInvolved = transaction.staffInvolved
          ? transaction.staffInvolved.fullName
          : "N/A";
        const paymentMethod = transaction.paymentMethod
          ? paymentMethods.find(
              (pm) => pm._id === transaction.paymentMethod._id
            )
          : null;
        return {
          id: transaction._id || "N/A",
          customerName: transaction.customerName || "N/A",
          date: transaction.date ? formatDate(transaction.date) : "N/A",
          contactPhone: transaction.contactPhone || "N/A",
          startTime: transaction.startTime
            ? formatDate(transaction.startTime)
            : "N/A",
          endTime: transaction.endTime
            ? formatDate(transaction.endTime)
            : "N/A",
          staffInvolved,
          eventType: transaction.eventType || "N/A",
          paymentMethod: paymentMethod ? paymentMethod.name : "N/A",
          paymentStatus: transaction.paymentStatus || "N/A",
          notes: transaction.notes || "N/A",
          isVoided: transaction.isVoided ? "Yes" : "No",
          totalAmount:
            transaction.totalAmount !== undefined
              ? `₦${parseFloat(transaction.totalAmount).toFixed(2)}`
              : "₦0.00",
        };
      });

      setData(formattedData);
      setFilteredData(formattedData);
      setTotalAmountSum(sum);
    } else {
      setData([]);
      setFilteredData([]);
      setTotalAmountSum(0);
    }
  }, [hallTransactions, paymentMethods]);

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
    link.download = "hall_transactions.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (transaction) => {
      if (!transaction) {
        console.error("Invalid transaction data:", transaction);
        return;
      }
      const rawTransaction = hallTransactions.find(
        (t) => t._id === transaction.id
      );
      if (!rawTransaction) {
        console.error("Raw transaction not found for id:", transaction.id);
        return;
      }
      setEditData(rawTransaction);
      setDrawerOpen(true);
    },
    [hallTransactions]
  );

  const handleVoidClick = useCallback((transaction) => {
    if (!transaction) {
      console.error("Invalid transaction data:", transaction);
      return;
    }
    setHallToVoid(transaction);
    setOpenVoidDialog(true);
  }, []);

  const handleConfirmVoid = useCallback(async () => {
    if (hallToVoid) {
      try {
        const response = await dispatch(
          voidHallTransaction(hallToVoid.id)
        ).unwrap();
        if (response.success) {
          toast.success("Hall transaction successfully voided");
          dispatch(fetchHallTransactions());
        } else {
          toast.error(response.message || "Failed to void hall transaction");
        }
      } catch (error) {
        toast.error(error.message || "Failed to void hall transaction");
      } finally {
        setOpenVoidDialog(false);
        setHallToVoid(null);
      }
    }
  }, [dispatch, hallToVoid]);

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = useMemo(
    () => [
      { field: "customerName", headerName: "Customer Name", flex: 1 },
      {
        field: "date",
        headerName: "Transaction Date",
        width: 180,
        filterable: true,
        sortable: true,
      },
      { field: "contactPhone", headerName: "Contact Phone", flex: 1 },
      { field: "startTime", headerName: "Start Time", flex: 1 },
      { field: "endTime", headerName: "End Time", flex: 1 },
      { field: "staffInvolved", headerName: "Staff Involved", flex: 1 },
      { field: "eventType", headerName: "Event Type", flex: 1 },
      { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
      { field: "paymentStatus", headerName: "Payment Status", flex: 1 },
      { field: "notes", headerName: "Notes", flex: 1 },
      { field: "isVoided", headerName: "Voided", flex: 1 },
      { field: "totalAmount", headerName: "Total Amount", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (
          <>
            {hasPermission(user, "write:hall") && (
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
            {hasPermission(user, "delete:hall") && (
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor:
                    params.row.isVoided === "Yes" ? "not-allowed" : "pointer",
                  opacity: params.row.isVoided === "Yes" ? 0.5 : 1,
                }}
                onClick={() =>
                  params.row.isVoided !== "Yes" && handleVoidClick(params.row)
                }
              ></i>
            )}
          </>
        ),
      },
    ],
    [user, handleEditClick, handleVoidClick]
  );

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

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="hall tabs">
            <Tab label="Transaction Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                width: "100%",
              }}
            >
              <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
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
                Error: {error.message || "An error occurred"}
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
            <Box sx={{ width: "100%" }}>
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
                  Hall Transactions
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
                  {hasPermission(user, "write:hall") && (
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
                      Add New Hall Transaction
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
                    sorting: { sortModel: [{ field: "date", sort: "asc" }] },
                  }}
                  disableSelectionOnClick
                />
              </Box>
              <AddNewHallDrawer
                open={drawerOpen}
                onClose={() => {
                  setDrawerOpen(false);
                  setEditData(null);
                }}
                editMode={!!editData}
                initialData={editData || {}}
                onSaveSuccess={() => dispatch(fetchHallTransactions())}
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
          <HallReports />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default Hall;
