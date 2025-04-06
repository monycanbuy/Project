// import React, { useEffect, useState, useCallback } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Typography,
//   IconButton,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { format } from "date-fns";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchPettyCashes,
//   deletePettyCash,
//   recalculatePettyCashBalance,
//   fetchAllPettyCashTransactions,
// } from "../../redux/slices/pettyCashSlice";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewPettyCashDrawer from "../AddDrawerSection/AddNewPettyCashDrawer";
// import AddPettyCashTransactionDrawer from "../AddDrawerSection/AddPettyCashTransactionDrawer";
// import PettyTransactions from "../PettyCashSection/Transactions/PettyTransactions"; // Import PettyTransactions
// import PettyCashDashboard from "./DashBoard/PettyCashDashboard";
// import ExpenseCategories from "../ExpenseSection/ExpenseCategories";

// const PettyCash = () => {
//   const dispatch = useDispatch();
//   const { pettyCashes, transactions, status, error } = useSelector(
//     (state) => state.pettyCash
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [customerToDelete, setCustomerToDelete] = useState(null);
//   const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);
//   const [selectedPettyCashId, setSelectedPettyCashId] = useState(null);
//   const [tabValue, setTabValue] = useState(0);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     dispatch(fetchPettyCashes());
//     dispatch(fetchAllPettyCashTransactions()); // Fetch all transactions on load
//   }, [dispatch]);

//   useEffect(() => {
//     if (pettyCashes && Array.isArray(pettyCashes)) {
//       const formattedData = pettyCashes.map((pettyCash) => ({
//         id: pettyCash._id,
//         balance: pettyCash.balance || 0,
//         initialAmount: pettyCash.initialAmount || 0,
//         transactionCount: pettyCash.transactions.length,
//         lastReplenished: pettyCash.lastReplenished
//           ? format(new Date(pettyCash.lastReplenished), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         createdBy: pettyCash.createdBy?.fullName || "N/A",
//         createdAt: pettyCash.createdAt
//           ? format(new Date(pettyCash.createdAt), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         status: pettyCash.status || "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [pettyCashes]);

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

//   const handleExport = (type) => {
//     const isPettyCash = type === "pettyCash";
//     const targetData = isPettyCash ? filteredData : transactions;
//     const targetColumns = isPettyCash ? columns : transactionColumns;

//     const headers = targetColumns.map((col) => col.headerName).join(",");
//     const csvRows = targetData
//       .map((row) =>
//         targetColumns
//           .map((col) => {
//             const value = col.valueGetter
//               ? col.valueGetter({ value: row[col.field] })
//               : row[col.field];
//             return `"${(value || "").toString().replace(/"/g, '""')}"`;
//           })
//           .join(",")
//       )
//       .join("\n");
//     const csvContent = `${headers}\n${csvRows}`;
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${type}.csv`;
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (customer) => {
//       const rawPettyCash = pettyCashes.find((c) => c._id === customer.id);
//       if (rawPettyCash) {
//         setEditData(rawPettyCash);
//         setDrawerOpen(true);
//       }
//     },
//     [pettyCashes]
//   );

//   const handleDeleteClick = useCallback((customerId) => {
//     setCustomerToDelete(customerId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmDelete = useCallback(() => {
//     if (customerToDelete) {
//       dispatch(deletePetttyCash(customerToDelete))
//         .then(() => {
//           dispatch(fetchPettyCashes());
//           toast.success("Petty cash deactivated successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error deactivating petty cash: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setCustomerToDelete(null);
//   }, [dispatch, customerToDelete]);

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setCustomerToDelete(null);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleRecalculateBalance = useCallback(
//     (pettyCashId) => {
//       dispatch(recalculatePettyCashBalance(pettyCashId))
//         .then(() => {
//           dispatch(fetchPettyCashes());
//           toast.success("Petty cash balance recalculated successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error recalculating balance: ${error.message}`);
//         });
//     },
//     [dispatch]
//   );

//   const handleAddTransactionClick = useCallback((pettyCashId) => {
//     setSelectedPettyCashId(pettyCashId);
//     setTransactionDrawerOpen(true);
//   }, []);

//   const columns = [
//     { field: "balance", headerName: "Balance", flex: 1, type: "number" },
//     {
//       field: "initialAmount",
//       headerName: "Initial Amount",
//       flex: 1,
//       type: "number",
//     },
//     {
//       field: "transactionCount",
//       headerName: "Transactions",
//       flex: 1,
//       type: "number",
//     },
//     { field: "lastReplenished", headerName: "Last Replenished", flex: 2 },
//     { field: "createdBy", headerName: "Created By", flex: 2 },
//     { field: "createdAt", headerName: "Created At", flex: 2 },
//     { field: "status", headerName: "Status", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 2,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:petty-cash") && (
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
//           {hasPermission(user, "delete:petty-cash") && (
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleDeleteClick(params.row.id)}
//             ></i>
//           )}
//           {hasPermission(user, "update:petty-cash") && (
//             <i
//               className="bx bx-calculator"
//               style={{
//                 color: "#00cc00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleRecalculateBalance(params.row.id)}
//               title="Recalculate Balance"
//             ></i>
//           )}
//           {hasPermission(user, "write:petty-cash") && (
//             <i
//               className="bx bx-plus"
//               style={{
//                 color: "#007bff",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleAddTransactionClick(params.row.id)}
//               title="Add Transaction"
//             ></i>
//           )}
//         </>
//       ),
//     },
//   ];

//   const transactionColumns = [
//     { field: "pettyCashId", headerName: "Petty Cash ID", flex: 2 },
//     {
//       field: "date",
//       headerName: "Date",
//       flex: 2,
//       valueFormatter: ({ value }) =>
//         format(new Date(value), "yyyy-MM-dd HH:mm:ss"),
//     },
//     { field: "details", headerName: "Details", flex: 3 },
//     { field: "voucherNo", headerName: "Voucher No", flex: 1 },
//     { field: "checkNo", headerName: "Check No", flex: 1 },
//     {
//       field: "totalPayment",
//       headerName: "Total Payment",
//       flex: 1,
//       type: "number",
//     },
//     {
//       field: "expenseBreakdowns",
//       headerName: "Expenses",
//       flex: 3,
//       valueGetter: ({ value }) =>
//         value.map((b) => `${b.name}: ${b.amount}`).join(", "),
//     },
//     {
//       field: "ledgerTransactionDescription",
//       headerName: "Ledger Description",
//       flex: 2,
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MuiDataGrid: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
//             "& .MuiDataGrid-row": { backgroundColor: "#29221d" },
//             "& .MuiDataGrid-row:hover": {
//               backgroundColor: "#1e1611",
//               "& .MuiDataGrid-cell": { color: "#bdbabb" },
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
//               "& .MuiTablePagination-root": { color: "#fcfcfc" },
//               "& .MuiIconButton-root": { color: "#fcfcfc" },
//             },
//             "@media print": { "& .MuiDataGrid-main": { color: "#000" } },
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
//           <TabList onChange={handleChange} aria-label="pettcash tabs">
//             <Tab label="Petty Cash Funds" value="0" />
//             <Tab label="All Transactions" value="1" />
//             <Tab label="PettyCash Dashboard" value="2" />
//             <Tab label="Expense Categries" value="3" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           <Box sx={{ width: "100%" }}>
//             {error ? (
//               <Box sx={{ p: 2 }}>
//                 <Typography color="error">
//                   Error: {error.message || "An unknown error occurred"}
//                 </Typography>
//               </Box>
//             ) : (
//               <>
//                 <Box
//                   sx={{
//                     padding: "8px",
//                     backgroundColor: "#d0d0d0",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   <Typography variant="h6" sx={{ color: "#000" }}>
//                     Petty Cash Management
//                   </Typography>
//                   <Box
//                     sx={{ display: "flex", gap: "8px", alignItems: "center" }}
//                   >
//                     <TextField
//                       variant="outlined"
//                       size="small"
//                       placeholder="Search..."
//                       value={searchText}
//                       onChange={(e) => handleSearch(e.target.value)}
//                       sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//                     />
//                     <IconButton
//                       onClick={() => handleExport("pettyCash")}
//                       title="Download Petty Cash CSV"
//                     >
//                       <GetAppIcon />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleExport("transactions")}
//                       title="Download Transactions CSV"
//                     >
//                       <GetAppIcon />
//                     </IconButton>
//                     <IconButton onClick={handlePrint} title="Print">
//                       <PrintIcon />
//                     </IconButton>
//                     {hasPermission(user, "write:petty-cash") && (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => {
//                           setEditData(null);
//                           setDrawerOpen(true);
//                         }}
//                         sx={{ backgroundColor: "#fe6c00" }}
//                       >
//                         Add New Petty Cash
//                       </Button>
//                     )}
//                   </Box>
//                 </Box>

//                 {tabValue === 0 && (
//                   <>
//                     {status === "loading" && !filteredData.length ? (
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "center",
//                           py: 4,
//                         }}
//                       >
//                         <CircularProgress sx={{ color: "#fe6c00" }} />
//                       </Box>
//                     ) : !filteredData || filteredData.length === 0 ? (
//                       <Typography>No petty cash records available</Typography>
//                     ) : (
//                       <Box sx={{ height: 600, width: "100%" }}>
//                         <DataGrid
//                           rows={filteredData}
//                           columns={columns}
//                           pageSizeOptions={[10, 20, 50]}
//                           initialState={{
//                             pagination: { paginationModel: { pageSize: 10 } },
//                           }}
//                           disableSelectionOnClick
//                         />
//                       </Box>
//                     )}
//                   </>
//                 )}

//                 {tabValue === 1 && (
//                   <PettyTransactions /> // Render PettyTransactions component here
//                 )}

//                 <AddNewPettyCashDrawer
//                   open={drawerOpen}
//                   onClose={() => {
//                     setDrawerOpen(false);
//                     setEditData(null);
//                   }}
//                   editMode={!!editData}
//                   initialData={editData || {}}
//                   onSaveSuccess={() => dispatch(fetchPettyCashes())}
//                 />
//                 <AddPettyCashTransactionDrawer
//                   open={transactionDrawerOpen}
//                   onClose={() => {
//                     setTransactionDrawerOpen(false);
//                     setSelectedPettyCashId(null);
//                   }}
//                   pettyCashId={selectedPettyCashId}
//                   onSaveSuccess={() => {
//                     dispatch(fetchPettyCashes());
//                     dispatch(fetchAllPettyCashTransactions());
//                   }}
//                 />
//                 <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//                   <DialogTitle>Deactivate Confirmation</DialogTitle>
//                   <DialogContent>
//                     <Typography>
//                       Are you sure you want to deactivate this petty cash?
//                     </Typography>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={cancelDelete}>Cancel</Button>
//                     <Button onClick={confirmDelete} color="secondary">
//                       Deactivate
//                     </Button>
//                   </DialogActions>
//                 </Dialog>
//                 <Toaster />
//               </>
//             )}
//           </Box>
//         </TabPanel>
//         <TabPanel value="1">
//           <PettyTransactions />
//         </TabPanel>
//         <TabPanel value="2">
//           <PettyCashDashboard />
//         </TabPanel>
//         <TabPanel value="3">
//           <ExpenseCategories />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default PettyCash;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Toaster, toast } from "react-hot-toast";
import {
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Tab,
} from "@mui/material";
import { format } from "date-fns";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPettyCashes,
  deletePettyCash,
  recalculatePettyCashBalance,
  fetchAllPettyCashTransactions,
} from "../../redux/slices/pettyCashSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddNewPettyCashDrawer from "../AddDrawerSection/AddNewPettyCashDrawer";
import AddPettyCashTransactionDrawer from "../AddDrawerSection/AddPettyCashTransactionDrawer";
import PettyTransactions from "../PettyCashSection/Transactions/PettyTransactions";
import PettyCashDashboard from "./DashBoard/PettyCashDashboard";
import ExpenseCategories from "../ExpenseSection/ExpenseCategories";

const PettyCash = () => {
  const dispatch = useDispatch();
  const {
    pettyCashes = [],
    transactions = [],
    status = "idle",
    error,
  } = useSelector((state) => state.pettyCash || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);
  const [selectedPettyCashId, setSelectedPettyCashId] = useState(null);
  const [value, setValue] = useState("0");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("PettyCash - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching petty cash data...");
        dispatch(fetchPettyCashes());
        dispatch(fetchAllPettyCashTransactions());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching petty cash data...");
            dispatch(fetchPettyCashes());
            dispatch(fetchAllPettyCashTransactions());
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
    //console.log("PettyCash - Data update", { pettyCashes, status, error });
    if (pettyCashes && Array.isArray(pettyCashes)) {
      const formattedData = pettyCashes.map((pettyCash) => ({
        id: pettyCash._id || "N/A",
        balance: pettyCash.balance || 0,
        initialAmount: pettyCash.initialAmount || 0,
        transactionCount: pettyCash.transactions?.length || 0,
        lastReplenished: pettyCash.lastReplenished
          ? format(new Date(pettyCash.lastReplenished), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        createdBy: pettyCash.createdBy?.fullName || "N/A",
        createdAt: pettyCash.createdAt
          ? format(new Date(pettyCash.createdAt), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        status: pettyCash.status || "N/A",
      }));
      //console.log("Formatted Data:", formattedData);
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
      // console.log(
      //   "No petty cash data available or data is not in expected format"
      // );
    }
  }, [pettyCashes]);

  const handleSearch = useCallback(
    (searchVal) => {
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
    },
    [data]
  );

  const handleExport = useCallback(
    (type) => {
      const isPettyCash = type === "pettyCash";
      const targetData = isPettyCash ? filteredData : transactions;
      const targetColumns = isPettyCash ? columns : transactionColumns;

      const headers = targetColumns.map((col) => col.headerName).join(",");
      const csvRows = targetData
        .map((row) =>
          targetColumns
            .map((col) => {
              const value = col.valueGetter
                ? col.valueGetter({ value: row[col.field] })
                : row[col.field];
              return `"${(value || "").toString().replace(/"/g, '""')}"`;
            })
            .join(",")
        )
        .join("\n");
      const csvContent = `${headers}\n${csvRows}`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${type}.csv`;
      link.click();
    },
    [filteredData, transactions]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEditClick = useCallback(
    (customer) => {
      const rawPettyCash = pettyCashes.find((c) => c._id === customer.id);
      if (rawPettyCash) {
        setEditData(rawPettyCash);
        setDrawerOpen(true);
      } else {
        console.error("Raw petty cash not found for id:", customer.id);
      }
    },
    [pettyCashes]
  );

  const handleDeleteClick = useCallback((customerId) => {
    setCustomerToDelete(customerId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (customerToDelete) {
      dispatch(deletePettyCash(customerToDelete)) // Fixed typo: deletePetttyCash -> deletePettyCash
        .unwrap()
        .then(() => {
          toast.success("Petty cash deactivated successfully!", {
            duration: 5000,
          });
          dispatch(fetchPettyCashes());
        })
        .catch((error) => {
          toast.error(
            `Error deactivating petty cash: ${
              error.message || "Unknown error"
            }`,
            { duration: 5000 }
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setCustomerToDelete(null);
        });
    }
  }, [dispatch, customerToDelete]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  }, []);

  const handleChange = useCallback((event, newValue) => {
    //console.log("Tab changed to:", newValue);
    setValue(newValue);
  }, []);

  const handleRecalculateBalance = useCallback(
    (pettyCashId) => {
      dispatch(recalculatePettyCashBalance(pettyCashId))
        .unwrap()
        .then(() => {
          toast.success("Petty cash balance recalculated successfully!", {
            duration: 5000,
          });
          dispatch(fetchPettyCashes());
        })
        .catch((error) => {
          toast.error(
            `Error recalculating balance: ${error.message || "Unknown error"}`,
            { duration: 5000 }
          );
        });
    },
    [dispatch]
  );

  const handleAddTransactionClick = useCallback((pettyCashId) => {
    setSelectedPettyCashId(pettyCashId);
    setTransactionDrawerOpen(true);
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { field: "balance", headerName: "Balance", flex: 1, type: "number" },
      {
        field: "initialAmount",
        headerName: "Initial Amount",
        flex: 1,
        type: "number",
      },
      {
        field: "transactionCount",
        headerName: "Transactions",
        flex: 1,
        type: "number",
      },
      { field: "lastReplenished", headerName: "Last Replenished", flex: 2 },
      { field: "createdBy", headerName: "Created By", flex: 2 },
      { field: "createdAt", headerName: "Created At", flex: 2 },
      { field: "status", headerName: "Status", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 2,
        renderCell: (params) => (
          <>
            {hasPermission(user, "update:petty-cash") && (
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
            {hasPermission(user, "delete:petty-cash") && (
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleDeleteClick(params.row.id)}
              ></i>
            )}
            {hasPermission(user, "update:petty-cash") && (
              <i
                className="bx bx-calculator"
                style={{
                  color: "#00cc00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleRecalculateBalance(params.row.id)}
                title="Recalculate Balance"
              ></i>
            )}
            {hasPermission(user, "write:petty-cash") && (
              <i
                className="bx bx-plus"
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleAddTransactionClick(params.row.id)}
                title="Add Transaction"
              ></i>
            )}
          </>
        ),
      },
    ],
    [
      user,
      handleEditClick,
      handleDeleteClick,
      handleRecalculateBalance,
      handleAddTransactionClick,
    ]
  );

  const transactionColumns = useMemo(
    () => [
      { field: "pettyCashId", headerName: "Petty Cash ID", flex: 2 },
      {
        field: "date",
        headerName: "Date",
        flex: 2,
        valueFormatter: ({ value }) =>
          value ? format(new Date(value), "yyyy-MM-dd HH:mm:ss") : "N/A",
      },
      { field: "details", headerName: "Details", flex: 3 },
      { field: "voucherNo", headerName: "Voucher No", flex: 1 },
      { field: "checkNo", headerName: "Check No", flex: 1 },
      {
        field: "totalPayment",
        headerName: "Total Payment",
        flex: 1,
        type: "number",
      },
      {
        field: "expenseBreakdowns",
        headerName: "Expenses",
        flex: 3,
        valueGetter: ({ value }) =>
          value?.map((b) => `${b.name}: ${b.amount}`).join(", ") || "N/A",
      },
      {
        field: "ledgerTransactionDescription",
        headerName: "Ledger Description",
        flex: 2,
      },
    ],
    []
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

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view petty cash data.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="pettycash tabs">
            <Tab label="Petty Cash Funds" value="0" />
            <Tab label="All Transactions" value="1" />
            <Tab label="PettyCash Dashboard" value="2" />
            <Tab label="Expense Categories" value="3" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <Box sx={{ width: "100%" }}>
            {status === "loading" && filteredData.length === 0 ? (
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
                  Error:{" "}
                  {error.message || error || "Failed to load petty cash data"}
                  {error.status && ` (Status: ${error.status})`}
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
                    Petty Cash Management
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
                      onClick={() => handleExport("pettyCash")}
                      sx={{ color: "#473b33", "&:hover": { color: "#fec80a" } }}
                      title="Download Petty Cash CSV"
                    >
                      <GetAppIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleExport("transactions")}
                      sx={{ color: "#473b33", "&:hover": { color: "#fec80a" } }}
                      title="Download Transactions CSV"
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
                    {hasPermission(user, "write:petty-cash") && (
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
                        Add New Petty Cash
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
                <AddNewPettyCashDrawer
                  open={drawerOpen}
                  onClose={() => {
                    setDrawerOpen(false);
                    setEditData(null);
                  }}
                  editMode={!!editData}
                  initialData={editData || {}}
                  onSaveSuccess={() => dispatch(fetchPettyCashes())}
                />
                <AddPettyCashTransactionDrawer
                  open={transactionDrawerOpen}
                  onClose={() => {
                    setTransactionDrawerOpen(false);
                    setSelectedPettyCashId(null);
                  }}
                  pettyCashId={selectedPettyCashId}
                  onSaveSuccess={() => {
                    dispatch(fetchPettyCashes());
                    dispatch(fetchAllPettyCashTransactions());
                  }}
                />
                <Dialog
                  open={deleteDialogOpen}
                  onClose={cancelDelete}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Deactivate Confirmation
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to deactivate this petty cash?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="secondary" autoFocus>
                      Deactivate
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Box>
        </TabPanel>
        <TabPanel value="1">
          <PettyTransactions />
        </TabPanel>
        <TabPanel value="2">
          <PettyCashDashboard />
        </TabPanel>
        <TabPanel value="3">
          <ExpenseCategories />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default PettyCash;
