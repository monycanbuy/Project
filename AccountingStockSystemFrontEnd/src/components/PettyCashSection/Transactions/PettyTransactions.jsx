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
// } from "@mui/material";
// import { format } from "date-fns";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllPettyCashTransactions,
//   deletePettyCash,
// } from "../../../redux/slices/pettyCashSlice";
// import { hasPermission } from "../../../utils/authUtils";
// import AddPettyCashTransactionDrawer from "../../AddDrawerSection/AddPettyCashTransactionDrawer";

// const PettyTransactions = () => {
//   const dispatch = useDispatch();
//   const { transactions, status, error } = useSelector(
//     (state) => state.pettyCash
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [transactionToDelete, setTransactionToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAllPettyCashTransactions());
//   }, [dispatch]);

//   useEffect(() => {
//     if (transactions && Array.isArray(transactions)) {
//       const formattedData = transactions.map((tx) => ({
//         id: tx.id,
//         pettyCashId: tx.pettyCashId || "N/A",
//         date: tx.date
//           ? format(new Date(tx.date), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         details: tx.details || "N/A",
//         voucherNo: tx.voucherNo || "N/A",
//         checkNo: tx.checkNo || "N/A",
//         totalPayment: tx.totalPayment || 0,
//         expenseBreakdowns: tx.expenseBreakdowns
//           ? tx.expenseBreakdowns.map((b) => `${b.name}: ${b.amount}`).join(", ")
//           : "N/A",
//         ledgerTransactionDescription: tx.ledgerTransactionDescription || "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [transactions]);

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
//     link.download = "petty_cash_transactions.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (transaction) => {
//       const rawTransaction = transactions.find((t) => t.id === transaction.id);
//       if (rawTransaction) {
//         setEditData(rawTransaction);
//         setDrawerOpen(true);
//       }
//     },
//     [transactions]
//   );

//   const handleDeleteClick = useCallback((transactionId) => {
//     setTransactionToDelete(transactionId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmDelete = useCallback(() => {
//     if (transactionToDelete) {
//       // Assuming deletePettyCash can be adapted for transactions or you have a deletePettyCashTransaction action
//       dispatch(deletePettyCash(transactionToDelete)) // Replace with proper delete action if available
//         .then(() => {
//           dispatch(fetchAllPettyCashTransactions());
//           toast.success("Transaction deleted successfully!");
//         })
//         .catch((err) => {
//           toast.error(`Error deleting transaction: ${err.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setTransactionToDelete(null);
//   }, [dispatch, transactionToDelete]);

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setTransactionToDelete(null);
//   };

//   const columns = [
//     { field: "pettyCashId", headerName: "Petty Cash ID", flex: 2 },
//     { field: "date", headerName: "Date", flex: 2 },
//     { field: "details", headerName: "Details", flex: 3 },
//     { field: "voucherNo", headerName: "Voucher No", flex: 1 },
//     { field: "checkNo", headerName: "Check No", flex: 1 },
//     {
//       field: "totalPayment",
//       headerName: "Total Payment",
//       flex: 1,
//       type: "number",
//     },
//     { field: "expenseBreakdowns", headerName: "Expense Breakdowns", flex: 3 },
//     {
//       field: "ledgerTransactionDescription",
//       headerName: "Ledger Description",
//       flex: 2,
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
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
//         </>
//       ),
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MuiDataGrid: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": {
//               backgroundColor: "#f0f0f0",
//             },
//             "& .MuiDataGrid-row": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiDataGrid-cell": {
//                   color: "#bdbabb",
//                 },
//               },
//             },
//             "& .MuiDataGrid-cell": {
//               color: "#fff",
//               fontSize: "18px",
//             },
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
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         {error ? (
//           <div>Error: {error}</div>
//         ) : (
//           <>
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
//                 Petty Cash Transactions
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
//               </Box>
//             </Box>
//             {status === "loading" ? (
//               <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
//               </Box>
//             ) : !filteredData || filteredData.length === 0 ? (
//               <Typography>No transactions available</Typography>
//             ) : (
//               <Box sx={{ height: 600, width: "100%" }}>
//                 <DataGrid
//                   rows={filteredData}
//                   columns={columns}
//                   pageSizeOptions={[10, 20, 50]}
//                   initialState={{
//                     pagination: { paginationModel: { pageSize: 10 } },
//                   }}
//                   disableSelectionOnClick
//                 />
//               </Box>
//             )}
//             <AddPettyCashTransactionDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchAllPettyCashTransactions())}
//             />
//             <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//               <DialogTitle>Delete Confirmation</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure youales to delete this transaction?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete}>Cancel</Button>
//                 <Button onClick={confirmDelete} color="secondary">
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster />
//           </>
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default PettyTransactions;

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
} from "@mui/material";
import { format } from "date-fns";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPettyCashTransactions,
  deletePettyCash, // Assuming this exists or needs to be added
} from "../../../redux/slices/pettyCashSlice";
import { checkAuthStatus } from "../../../redux/slices/authSlice";
import { hasPermission } from "../../../utils/authUtils";
import AddPettyCashTransactionDrawer from "../../AddDrawerSection/AddPettyCashTransactionDrawer";

const PettyTransactions = () => {
  const dispatch = useDispatch();
  const {
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
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("PettyTransactions - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching petty cash transactions...");
        dispatch(fetchAllPettyCashTransactions())
          .unwrap()
          .then()
          .catch((err) => console.error("Fetch failed:", err));
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching petty cash transactions...");
            dispatch(fetchAllPettyCashTransactions())
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
    // console.log("PettyTransactions - Data update", {
    //   transactions,
    //   status,
    //   error,
    // });
    if (
      transactions &&
      Array.isArray(transactions) &&
      status === "succeeded" &&
      !error
    ) {
      const formattedData = transactions.map((tx) => ({
        id: tx._id || tx.id || "N/A", // Adjust based on actual transaction ID field
        pettyCashId: tx.pettyCashId || "N/A",
        date: tx.date
          ? format(new Date(tx.date), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        details: tx.details || "N/A",
        voucherNo: tx.voucherNo || "N/A",
        checkNo: tx.checkNo || "N/A",
        totalPayment: tx.totalPayment || 0,
        expenseBreakdowns: tx.expenseBreakdowns
          ? tx.expenseBreakdowns.map((b) => `${b.name}: ${b.amount}`).join(", ")
          : "N/A",
        ledgerTransactionDescription: tx.ledgerTransactionDescription || "N/A",
      }));
      //console.log("Formatted Data:", formattedData);
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
      //console.log("No valid transactions data or error present");
    }
  }, [transactions, status, error]);

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

  const handleExport = useCallback(() => {
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
    link.download = "petty_cash_transactions.csv";
    link.click();
  }, [filteredData]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEditClick = useCallback(
    (transaction) => {
      //console.log("Edit clicked for transaction:", transaction);
      const rawTransaction = transactions.find(
        (t) => (t._id || t.id) === transaction.id
      );
      if (rawTransaction) {
        setEditData(rawTransaction);
        setDrawerOpen(true);
      } else {
        console.error("Raw transaction not found for id:", transaction.id);
      }
    },
    [transactions]
  );

  const handleDeleteClick = useCallback((transactionId) => {
    //console.log("Delete clicked for transaction ID:", transactionId);
    setTransactionToDelete(transactionId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (transactionToDelete) {
      //console.log("Confirming delete for transaction:", transactionToDelete);
      dispatch(deletePettyCashTransaction(transactionToDelete)) // Assuming this action exists
        .unwrap()
        .then(() => {
          toast.success("Transaction deleted successfully!", {
            duration: 5000,
          });
          dispatch(fetchAllPettyCashTransactions());
        })
        .catch((err) => {
          toast.error(
            `Error deleting transaction: ${err.message || "Unknown error"}`,
            { duration: 5000 }
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setTransactionToDelete(null);
        });
    }
  }, [dispatch, transactionToDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { field: "pettyCashId", headerName: "Petty Cash ID", flex: 2 },
      { field: "date", headerName: "Date", flex: 2 },
      { field: "details", headerName: "Details", flex: 3 },
      { field: "voucherNo", headerName: "Voucher No", flex: 1 },
      { field: "checkNo", headerName: "Check No", flex: 1 },
      {
        field: "totalPayment",
        headerName: "Total Payment",
        flex: 1,
        type: "number",
      },
      { field: "expenseBreakdowns", headerName: "Expense Breakdowns", flex: 3 },
      {
        field: "ledgerTransactionDescription",
        headerName: "Ledger Description",
        flex: 2,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
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
          </>
        ),
      },
    ],
    [user, handleEditClick, handleDeleteClick]
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
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view petty cash transactions.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
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
            <CircularProgress size={60} sx={{ color: "#fe6c00" }} />
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
                : error || "Failed to load transactions"}
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
                Petty Cash Transactions
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
              </Box>
            </Box>
            {filteredData.length === 0 ? (
              <Typography>No transactions available</Typography>
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
            <AddPettyCashTransactionDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => dispatch(fetchAllPettyCashTransactions())}
            />
            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Delete Confirmation
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this transaction?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                <Button onClick={confirmDelete} color="secondary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default PettyTransactions;
