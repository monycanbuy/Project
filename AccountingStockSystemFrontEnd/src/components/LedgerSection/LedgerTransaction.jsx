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
//   DialogContentText,
//   DialogActions,
//   TextField,
//   Typography,
//   IconButton,
//   Tab,
// } from "@mui/material";
// import { format } from "date-fns";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchLedgerTransactions,
//   voidLedgerTransaction,
// } from "../../redux/slices/ledgerTransactionSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewLedgerTransactionDrawer from "../AddDrawerSection/AddNewLedgerTransactionDrawer";
// import AccountLedger from "./Dashboard/AccountLedger";

// const LedgerTransaction = () => {
//   const dispatch = useDispatch();
//   const { transactions, status } = useSelector(
//     (state) => state.ledgerTransactions
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [transactionToVoid, setTransactionToVoid] = useState(null);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     dispatch(fetchLedgerTransactions());
//   }, [dispatch]);

//   useEffect(() => {
//     if (transactions && Array.isArray(transactions)) {
//       setFilteredTransactions(transactions);
//     } else {
//       setFilteredTransactions([]);
//     }
//   }, [transactions]);

//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (!transactions || !Array.isArray(transactions)) return;
//     if (searchVal.trim() === "") {
//       setFilteredTransactions(transactions);
//     } else {
//       const filtered = transactions.filter((transaction) => {
//         const searchLower = searchVal.toLowerCase();
//         const customerName =
//           transaction.referenceId?.customer?.name ||
//           transaction.referenceId?.name ||
//           "";
//         const invoiceNumber =
//           transaction.referenceType === "Debtor"
//             ? transaction.referenceId?.invoices?.[0]?.invoiceNumber || ""
//             : transaction.referenceId?.invoiceNumber || "";
//         return (
//           transaction.description?.toLowerCase().includes(searchLower) ||
//           transaction.referenceType?.toLowerCase().includes(searchLower) ||
//           customerName.toLowerCase().includes(searchLower) ||
//           invoiceNumber.toLowerCase().includes(searchLower) ||
//           transaction.entries?.some((entry) =>
//             entry.account?.name?.toLowerCase().includes(searchLower)
//           ) ||
//           transaction.comment?.toLowerCase().includes(searchLower)
//         );
//       });
//       setFilteredTransactions(filtered);
//     }
//   };

//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredTransactions
//       .flatMap((transaction) =>
//         transaction.entries.map((entry, index) => ({
//           id: `${transaction._id}_${index}`,
//           transactionId: transaction._id,
//           date: transaction.date
//             ? format(new Date(transaction.date), "yyyy-MM-dd HH:mm")
//             : "N/A",
//           description: transaction.description || "N/A",
//           account: entry.account?.name || "N/A",
//           debit: entry.debit || 0,
//           credit: entry.credit || 0,
//           comment: transaction.comment || "N/A",
//           referenceId:
//             transaction.referenceType === "Debtor"
//               ? transaction.referenceId?.invoices?.[0]?.invoiceNumber || "N/A"
//               : transaction.referenceId?.invoiceNumber ||
//                 transaction.referenceId?._id ||
//                 "N/A",
//           status: transaction.status || "N/A",
//         }))
//       )
//       .map((row) =>
//         columns
//           .map((col) => {
//             const value = row[col.field] || "N/A";
//             return `"${value.toString().replace(/"/g, '""')}"`;
//           })
//           .join(",")
//       )
//       .join("\n");
//     const csvContent = `${headers}\n${csvRows}`;
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "ledger_transactions.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (transactionId) => {
//       const rawTransaction = transactions.find((t) => t._id === transactionId);
//       if (rawTransaction) {
//         setEditData(rawTransaction);
//         setDrawerOpen(true);
//       }
//     },
//     [transactions]
//   );

//   const handleVoidClick = useCallback((transactionId) => {
//     setTransactionToVoid(transactionId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmVoid = useCallback(() => {
//     if (transactionToVoid) {
//       dispatch(voidLedgerTransaction(transactionToVoid))
//         .unwrap()
//         .then(() => {
//           dispatch(fetchLedgerTransactions());
//           toast.success("Transaction voided successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error voiding transaction: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setTransactionToVoid(null);
//   }, [dispatch, transactionToVoid]);

//   const cancelVoid = () => {
//     setDeleteDialogOpen(false);
//     setTransactionToVoid(null);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     {
//       field: "date",
//       headerName: "Date",
//       flex: 1,
//       renderCell: (params) =>
//         params.row.date
//           ? format(new Date(params.row.date), "yyyy-MM-dd HH:mm")
//           : "N/A",
//     },
//     { field: "description", headerName: "Description", flex: 1 },
//     { field: "account", headerName: "Account", flex: 1 },
//     { field: "debit", headerName: "Debit", flex: 1, type: "number" },
//     { field: "credit", headerName: "Credit", flex: 1, type: "number" },
//     { field: "comment", headerName: "Comment", flex: 1 },
//     {
//       field: "referenceId",
//       headerName: "Reference ID",
//       flex: 1,
//       renderCell: (params) => params.row.referenceId || "N/A",
//     },
//     { field: "status", headerName: "Status", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:ledger-transaction") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "10px",
//               }}
//               onClick={() => handleEditClick(params.row.transactionId)}
//             ></i>
//           )}
//           {hasPermission(user, "delete:ledger-transaction") && (
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "10px",
//               }}
//               onClick={() => handleVoidClick(params.row.transactionId)}
//             ></i>
//           )}
//         </>
//       ),
//     },
//   ];

//   const rows = filteredTransactions.flatMap((transaction) =>
//     transaction.entries.map((entry, index) => ({
//       id: `${transaction._id}_${index}`,
//       transactionId: transaction._id,
//       date: transaction.date,
//       description: transaction.description || "N/A",
//       account: entry.account?.name || "N/A",
//       debit: entry.debit || 0,
//       credit: entry.credit || 0,
//       comment: transaction.comment || "N/A",
//       referenceId:
//         transaction.referenceType === "Debtor"
//           ? transaction.referenceId?.invoices?.[0]?.invoiceNumber || "N/A"
//           : transaction.referenceId?.invoiceNumber ||
//             transaction.referenceId?._id ||
//             "N/A",
//       status: transaction.status || "N/A",
//     }))
//   );

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
//           <TabList onChange={handleChange} aria-label="ledger tabs">
//             <Tab label="Ledger Transaction Records" value="0" />
//             <Tab label="Account Ledger" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           <Box sx={{ width: "100%" }}>
//             <Box
//               sx={{
//                 padding: "8px",
//                 backgroundColor: "#d0d0d0",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "8px",
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Ledger Transactions
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
//                 <IconButton onClick={handleExport} title="Download CSV">
//                   <GetAppIcon />
//                 </IconButton>
//                 <IconButton onClick={handlePrint} title="Print">
//                   <PrintIcon />
//                 </IconButton>
//                 {hasPermission(user, "write:ledger-transaction") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditData(null);
//                       setDrawerOpen(true);
//                     }}
//                     sx={{ backgroundColor: "#fe6c00" }}
//                   >
//                     Add New Transaction
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             {status === "loading" ? (
//               <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
//               </Box>
//             ) : !filteredTransactions || filteredTransactions.length === 0 ? (
//               <Typography>No ledger transactions available</Typography>
//             ) : (
//               <Box sx={{ height: 600, width: "100%" }}>
//                 <DataGrid
//                   rows={rows}
//                   columns={columns}
//                   pageSizeOptions={[10, 20, 50]}
//                   initialState={{
//                     pagination: { paginationModel: { pageSize: 10 } },
//                   }}
//                   disableSelectionOnClick
//                 />
//               </Box>
//             )}
//             <AddNewLedgerTransactionDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchLedgerTransactions())}
//             />
//             <Dialog open={deleteDialogOpen} onClose={cancelVoid}>
//               <DialogTitle>Void Confirmation</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to void this transaction?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelVoid}>Cancel</Button>
//                 <Button onClick={confirmVoid} color="secondary">
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster />
//           </Box>
//         </TabPanel>
//         <TabPanel value="1">
//           <AccountLedger />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default LedgerTransaction;

import React, { useEffect, useState, useCallback } from "react";
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
  fetchLedgerTransactions,
  voidLedgerTransaction,
} from "../../redux/slices/ledgerTransactionSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewLedgerTransactionDrawer from "../AddDrawerSection/AddNewLedgerTransactionDrawer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AccountLedger from "./Dashboard/AccountLedger";

const LedgerTransaction = () => {
  const dispatch = useDispatch();
  const {
    transactions = [],
    status,
    error,
  } = useSelector((state) => state.ledgerTransactions || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToVoid, setTransactionToVoid] = useState(null);
  const [value, setValue] = useState("0");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("LedgerTransaction - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching ledger transactions...");
        dispatch(fetchLedgerTransactions())
          .unwrap()
          .then()
          .catch((err) => console.error("Fetch failed:", err));
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching ledger transactions...");
            dispatch(fetchLedgerTransactions())
              .unwrap()
              .then()
              .catch((err) =>
                console.error("Fetch failed after auth check:", err)
              );
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
    if (
      transactions &&
      Array.isArray(transactions) &&
      status !== "loading" &&
      !error
    ) {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions([]);
    }
  }, [transactions, status, error]);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (!transactions || !Array.isArray(transactions)) return;
      if (searchVal.trim() === "") {
        setFilteredTransactions(transactions);
      } else {
        const filtered = transactions.filter((transaction) => {
          const searchLower = searchVal.toLowerCase();
          const customerName =
            transaction.referenceId?.customer?.name ||
            transaction.referenceId?.name ||
            "";
          const invoiceNumber =
            transaction.referenceType === "Debtor"
              ? transaction.referenceId?.invoices?.[0]?.invoiceNumber || ""
              : transaction.referenceId?.invoiceNumber || "";
          return (
            transaction.description?.toLowerCase().includes(searchLower) ||
            transaction.referenceType?.toLowerCase().includes(searchLower) ||
            customerName.toLowerCase().includes(searchLower) ||
            invoiceNumber.toLowerCase().includes(searchLower) ||
            transaction.entries?.some((entry) =>
              entry.account?.name?.toLowerCase().includes(searchLower)
            ) ||
            transaction.comment?.toLowerCase().includes(searchLower)
          );
        });
        setFilteredTransactions(filtered);
      }
    },
    [transactions]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredTransactions
      .flatMap((transaction) =>
        transaction.entries.map((entry, index) => ({
          id: `${transaction._id}_${index}`,
          transactionId: transaction._id,
          date: transaction.date
            ? format(new Date(transaction.date), "yyyy-MM-dd HH:mm")
            : "N/A",
          description: transaction.description || "N/A",
          account: entry.account?.name || "N/A",
          debit: entry.debit || 0,
          credit: entry.credit || 0,
          comment: transaction.comment || "N/A",
          referenceId:
            transaction.referenceType === "Debtor"
              ? transaction.referenceId?.invoices?.[0]?.invoiceNumber || "N/A"
              : transaction.referenceId?.invoiceNumber ||
                transaction.referenceId?._id ||
                "N/A",
          status: transaction.status || "N/A",
        }))
      )
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
    link.download = "ledger_transactions.csv";
    link.click();
  }, [filteredTransactions]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEditClick = useCallback(
    (transactionId) => {
      const rawTransaction = transactions.find((t) => t._id === transactionId);
      if (rawTransaction) {
        setEditData(rawTransaction);
        setDrawerOpen(true);
      } else {
        toast.error("Transaction not found for editing");
      }
    },
    [transactions]
  );

  const handleVoidClick = useCallback((transactionId) => {
    setTransactionToVoid(transactionId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmVoid = useCallback(() => {
    if (transactionToVoid) {
      dispatch(voidLedgerTransaction(transactionToVoid))
        .unwrap()
        .then(() => {
          dispatch(fetchLedgerTransactions());
          toast.success("Transaction voided successfully!", { duration: 5000 });
        })
        .catch((err) => {
          toast.error(
            `Error voiding transaction: ${err.message || "Unknown error"}`,
            {
              duration: 5000,
            }
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setTransactionToVoid(null);
        });
    }
  }, [dispatch, transactionToVoid]);

  const cancelVoid = useCallback(() => {
    setDeleteDialogOpen(false);
    setTransactionToVoid(null);
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) =>
        params.row.date
          ? format(new Date(params.row.date), "yyyy-MM-dd HH:mm")
          : "N/A",
    },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "account", headerName: "Account", flex: 1 },
    { field: "debit", headerName: "Debit", flex: 1, type: "number" },
    { field: "credit", headerName: "Credit", flex: 1, type: "number" },
    { field: "comment", headerName: "Comment", flex: 1 },
    {
      field: "referenceId",
      headerName: "Reference ID",
      flex: 1,
      renderCell: (params) => params.row.referenceId || "N/A",
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:ledger-transaction") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => handleEditClick(params.row.transactionId)}
              title="Edit Transaction"
            ></i>
          )}
          {hasPermission(user, "delete:ledger-transaction") && (
            <i
              className="bx bx-trash"
              style={{
                color: "#fe1e00",
                cursor: "pointer",
                marginRight: "10px",
              }}
              onClick={() => handleVoidClick(params.row.transactionId)}
              title="Void Transaction"
            ></i>
          )}
        </>
      ),
    },
  ];

  // const rows = filteredTransactions.flatMap((transaction) =>
  //   transaction.entries?.map((entry, index) => ({
  //     id: `${transaction._id}_${index}`,
  //     transactionId: transaction._id || `temp-${Math.random()}`, // Fallback ID
  //     date: transaction.date || null,
  //     description: transaction.description || "N/A",
  //     account: entry.account?.name || "N/A",
  //     debit: entry.debit || 0,
  //     credit: entry.credit || 0,
  //     comment: transaction.comment || "N/A",
  //     referenceId:
  //       transaction.referenceType === "Debtor"
  //         ? transaction.referenceId?.invoices?.[0]?.invoiceNumber || "N/A"
  //         : transaction.referenceId?.invoiceNumber ||
  //           transaction.referenceId?._id ||
  //           "N/A",
  //     status: transaction.status || "N/A",
  //   }) || []
  // );
  const rows = filteredTransactions.flatMap((transaction) =>
    transaction.entries.map((entry, index) => ({
      id: `${transaction._id}_${index}`,
      transactionId: transaction._id,
      date: transaction.date,
      description: transaction.description || "N/A",
      account: entry.account?.name || "N/A",
      debit: entry.debit || 0,
      credit: entry.credit || 0,
      comment: transaction.comment || "N/A",
      referenceId:
        transaction.referenceType === "Debtor"
          ? transaction.referenceId?.invoices?.[0]?.invoiceNumber || "N/A"
          : transaction.referenceId?.invoiceNumber ||
            transaction.referenceId?._id ||
            "N/A",
      status: transaction.status || "N/A",
    }))
  );

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
          Please log in to view ledger transactions.
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
          <TabList onChange={handleChange} aria-label="ledger tabs">
            <Tab label="Ledger Transaction Records" value="0" />
            <Tab label="Account Ledger" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <Box sx={{ width: "100%" }}>
            {status === "loading" && filteredTransactions.length === 0 ? (
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
                    : error || "Failed to load ledger transactions"}
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
                    Ledger Transactions
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
                    {hasPermission(user, "write:ledger-transaction") && (
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
                        Add New Transaction
                      </Button>
                    )}
                  </Box>
                </Box>
                {filteredTransactions.length === 0 && status !== "loading" ? (
                  <Typography>No ledger transactions available</Typography>
                ) : (
                  <Box sx={{ height: 600, width: "100%" }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSizeOptions={[10, 20, 50]}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                      }}
                      disableSelectionOnClick
                    />
                  </Box>
                )}
                <AddNewLedgerTransactionDrawer
                  open={drawerOpen}
                  onClose={() => {
                    setDrawerOpen(false);
                    setEditData(null);
                  }}
                  editMode={!!editData}
                  initialData={editData || {}}
                  onSaveSuccess={() => dispatch(fetchLedgerTransactions())}
                />
                <Dialog open={deleteDialogOpen} onClose={cancelVoid}>
                  <DialogTitle>Void Confirmation</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to void this transaction?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={cancelVoid}>Cancel</Button>
                    <Button onClick={confirmVoid} color="secondary" autoFocus>
                      Void
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
            <Toaster />
          </Box>
        </TabPanel>
        <TabPanel value="1">
          <AccountLedger />
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
};

export default LedgerTransaction;
