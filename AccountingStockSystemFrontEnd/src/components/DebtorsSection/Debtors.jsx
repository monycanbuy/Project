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
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewDebtorsDrawer from "../AddDrawerSection/AddNewDebtorsDrawer";
// import { deleteDebtor, fetchDebtors } from "../../redux/slices/debtorsSlice";
// import AddNewInvoiceDrawer from "../AddDrawerSection/AddNewInvoiceDrawer";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import ManageInvoice from "./Invoice/ManageInvoice";
// import InitialPaymentHistory from "./Payment/InitialPaymentHistory";
// import DebtorsDashboard from "./Dashboard/DebtorsDashboard";

// const Debtors = () => {
//   const dispatch = useDispatch();
//   const { debtors, loading, error } = useSelector((state) => state.debtors);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [debtorDrawerOpen, setDebtorDrawerOpen] = useState(false);
//   const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [invoiceMode, setInvoiceMode] = useState("addInvoice");
//   const [selectedDebtorId, setSelectedDebtorId] = useState(null);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [debtorToDelete, setDebtorToDelete] = useState(null);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     dispatch(fetchDebtors());
//   }, [dispatch]);

//   useEffect(() => {
//     if (debtors && Array.isArray(debtors)) {
//       const formattedData = debtors.map((debtor) => ({
//         id: debtor._id,
//         customerName: debtor.customer?.name || "N/A",
//         openingBalance: debtor.openingBalance || 0,
//         totalDebt: debtor.totalDebt || 0,
//         totalCreditReceived: debtor.totalCreditReceived || 0,
//         totalDeduction: debtor.totalDeduction || 0,
//         closingBalance: debtor.closingBalance || 0,
//         status: debtor.status || "N/A",
//         createdBy: debtor.createdBy?.fullName || "N/A",
//         createdAt: debtor.createdAt
//           ? format(new Date(debtor.createdAt), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         invoices: debtor.invoices || [],
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [debtors]);

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
//     link.download = "debtors.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (debtor) => {
//       const rawDebtor = debtors.find((d) => d._id === debtor.id);
//       if (rawDebtor) {
//         setEditData(rawDebtor);
//         setDebtorDrawerOpen(true);
//       }
//     },
//     [debtors]
//   );

//   const handleAddInvoice = useCallback((debtorId) => {
//     setSelectedDebtorId(debtorId);
//     setInvoiceMode("addInvoice");
//     setSelectedInvoice(null);
//     setInvoiceDrawerOpen(true);
//   }, []);

//   const handleAddPayment = useCallback((debtorId, invoice) => {
//     setSelectedDebtorId(debtorId);
//     setInvoiceMode("addPayment");
//     setSelectedInvoice(invoice);
//     setInvoiceDrawerOpen(true);
//   }, []);

//   const handleDeleteClick = useCallback((debtorId) => {
//     setDebtorToDelete(debtorId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmDelete = useCallback(() => {
//     if (debtorToDelete) {
//       dispatch(deleteDebtor(debtorToDelete))
//         .then(() => {
//           dispatch(fetchDebtors());
//           toast.success("Debtor deleted successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error deleting debtor: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setDebtorToDelete(null);
//   }, [dispatch, debtorToDelete]);

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setDebtorToDelete(null);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { field: "customerName", headerName: "Name Of Debtor", flex: 2 },
//     { field: "openingBalance", headerName: "Opening Balance", flex: 1 },
//     { field: "totalDebt", headerName: "Total Debt", flex: 1 },
//     {
//       field: "totalCreditReceived",
//       headerName: "Total Credit Received",
//       flex: 1,
//     },
//     { field: "totalDeduction", headerName: "Total Deduction", flex: 1 },
//     { field: "closingBalance", headerName: "Closing Balance", flex: 1 },
//     { field: "status", headerName: "Status", flex: 1 },
//     { field: "createdBy", headerName: "Created By", flex: 2 },
//     { field: "createdAt", headerName: "Created At", flex: 2 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "write:debtors") && (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(params.row)}
//               ></i>
//               <i
//                 className="bx bx-plus"
//                 style={{
//                   color: "#00cc00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleAddInvoice(params.row.id)}
//                 title="Add Invoice"
//               ></i>
//               {params.row.invoices.length > 0 && (
//                 <i
//                   className="bx bx-money"
//                   style={{
//                     color: "#0066cc",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() =>
//                     handleAddPayment(params.row.id, params.row.invoices[0])
//                   }
//                   title="Add Payment"
//                 ></i>
//               )}
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleDeleteClick(params.row.id)}
//               ></i>
//             </>
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
//           <TabList onChange={handleChange} aria-label="debtor tabs">
//             <Tab label="Debtor Records" value="0" />
//             <Tab label="Invoice" value="1" />
//             <Tab label="Payment History" value="2" />
//             <Tab label="Debtors Dashboard" value="3" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           <Box sx={{ width: "100%" }}>
//             {error ? (
//               <div>Error: {error}</div>
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
//                     Debtors
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
//                     <IconButton onClick={handleExport} title="Download CSV">
//                       <GetAppIcon />
//                     </IconButton>
//                     <IconButton onClick={handlePrint} title="Print">
//                       <PrintIcon />
//                     </IconButton>
//                     {hasPermission(user, "write:debtors") && (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => {
//                           setEditData(null);
//                           setDebtorDrawerOpen(true);
//                         }}
//                         sx={{ backgroundColor: "#fe6c00" }}
//                       >
//                         Add New Debtor
//                       </Button>
//                     )}
//                   </Box>
//                 </Box>
//                 {loading ? (
//                   <Box
//                     sx={{ display: "flex", justifyContent: "center", py: 4 }}
//                   >
//                     <CircularProgress sx={{ color: "#fe6c00" }} />
//                   </Box>
//                 ) : (
//                   <Box sx={{ height: 600, width: "100%" }}>
//                     <DataGrid
//                       rows={filteredData}
//                       columns={columns}
//                       pageSizeOptions={[10, 20, 50]}
//                       initialState={{
//                         pagination: { paginationModel: { pageSize: 10 } },
//                       }}
//                       disableSelectionOnClick
//                     />
//                   </Box>
//                 )}
//                 <AddNewDebtorsDrawer
//                   open={debtorDrawerOpen}
//                   onClose={() => {
//                     setDebtorDrawerOpen(false);
//                     setEditData(null);
//                   }}
//                   editMode={!!editData}
//                   initialData={editData || {}}
//                   onSaveSuccess={() => dispatch(fetchDebtors())}
//                 />
//                 <AddNewInvoiceDrawer
//                   open={invoiceDrawerOpen}
//                   onClose={() => {
//                     setInvoiceDrawerOpen(false);
//                     setSelectedDebtorId(null);
//                     setSelectedInvoice(null);
//                     dispatch(fetchDebtors());
//                   }}
//                   debtorId={selectedDebtorId}
//                   mode={invoiceMode}
//                   invoiceData={selectedInvoice || {}}
//                 />
//                 <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//                   <DialogTitle>Delete Confirmation</DialogTitle>
//                   <DialogContent>
//                     <DialogContentText>
//                       Are you sure you want to delete this debtor?
//                     </DialogContentText>
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={cancelDelete}>Cancel</Button>
//                     <Button onClick={confirmDelete} color="secondary">
//                       Delete
//                     </Button>
//                   </DialogActions>
//                 </Dialog>
//                 <Toaster />
//               </>
//             )}
//           </Box>
//         </TabPanel>
//         <TabPanel value="1">
//           <ManageInvoice />
//         </TabPanel>
//         <TabPanel value="2">
//           <InitialPaymentHistory />
//         </TabPanel>
//         <TabPanel value="3">
//           <DebtorsDashboard />
//         </TabPanel>
//       </TabContext>
//       {/* <Box sx={{ width: "100%" }}>
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
//                 Debtors
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
//                 {hasPermission(user, "write:debtors") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditData(null);
//                       setDebtorDrawerOpen(true);
//                     }}
//                     sx={{ backgroundColor: "#fe6c00" }}
//                   >
//                     Add New Debtor
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             {loading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
//               </Box>
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
//             <AddNewDebtorsDrawer
//               open={debtorDrawerOpen}
//               onClose={() => {
//                 setDebtorDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchDebtors())}
//             />
//             <AddNewInvoiceDrawer
//               open={invoiceDrawerOpen}
//               onClose={() => {
//                 setInvoiceDrawerOpen(false);
//                 setSelectedDebtorId(null);
//                 setSelectedInvoice(null);
//                 dispatch(fetchDebtors());
//               }}
//               debtorId={selectedDebtorId}
//               mode={invoiceMode}
//               invoiceData={selectedInvoice || {}}
//             />
//             <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//               <DialogTitle>Delete Confirmation</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this debtor?
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
//       </Box> */}
//     </ThemeProvider>
//   );
// };

// export default Debtors;

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
import { hasPermission } from "../../utils/authUtils";
import { deleteDebtor, fetchDebtors } from "../../redux/slices/debtorsSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import AddNewDebtorsDrawer from "../AddDrawerSection/AddNewDebtorsDrawer";
import AddNewInvoiceDrawer from "../AddDrawerSection/AddNewInvoiceDrawer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ManageInvoice from "./Invoice/ManageInvoice";
import InitialPaymentHistory from "./Payment/InitialPaymentHistory";
import DebtorsDashboard from "./Dashboard/DebtorsDashboard";

const Debtors = () => {
  const dispatch = useDispatch();
  const {
    debtors = [],
    loading = false,
    error,
  } = useSelector((state) => state.debtors || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debtorDrawerOpen, setDebtorDrawerOpen] = useState(false);
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [invoiceMode, setInvoiceMode] = useState("addInvoice");
  const [selectedDebtorId, setSelectedDebtorId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debtorToDelete, setDebtorToDelete] = useState(null);
  const [value, setValue] = useState("0");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    console.log("Debtors - Mount check", { isAuthenticated, initialFetchDone });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        console.log("Fetching debtors...");
        dispatch(fetchDebtors())
          .unwrap()
          .then(() => console.log("Fetch succeeded"))
          .catch((err) => console.error("Fetch failed:", err));
        setInitialFetchDone(true);
      } else {
        console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            console.log("Auth succeeded, fetching debtors...");
            dispatch(fetchDebtors())
              .unwrap()
              .then(() => console.log("Fetch succeeded after auth check"))
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
    console.log("Debtors - Data update", { debtors, loading, error });
    if (debtors && Array.isArray(debtors) && !loading && !error) {
      const formattedData = debtors.map((debtor) => ({
        id: debtor._id || "N/A",
        customerName: debtor.customer?.name || "N/A",
        openingBalance: debtor.openingBalance || 0,
        totalDebt: debtor.totalDebt || 0,
        totalCreditReceived: debtor.totalCreditReceived || 0,
        totalDeduction: debtor.totalDeduction || 0,
        closingBalance: debtor.closingBalance || 0,
        status: debtor.status || "N/A",
        createdBy: debtor.createdBy?.fullName || "N/A",
        createdAt: debtor.createdAt
          ? format(new Date(debtor.createdAt), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        invoices: debtor.invoices || [],
      }));
      console.log("Formatted Data:", formattedData);
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
      console.log("No valid debtors data or error present");
    }
  }, [debtors, loading, error]);

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
    link.download = "debtors.csv";
    link.click();
  }, [filteredData]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEditClick = useCallback(
    (debtor) => {
      console.log("Edit clicked for debtor:", debtor);
      const rawDebtor = debtors.find((d) => d._id === debtor.id);
      if (rawDebtor) {
        setEditData(rawDebtor);
        setDebtorDrawerOpen(true);
      } else {
        console.error("Raw debtor not found for id:", debtor.id);
        toast.error("Cannot edit debtor: Data not found");
      }
    },
    [debtors]
  );

  const handleAddInvoice = useCallback((debtorId) => {
    console.log("Add invoice for debtor ID:", debtorId);
    setSelectedDebtorId(debtorId);
    setInvoiceMode("addInvoice");
    setSelectedInvoice(null);
    setInvoiceDrawerOpen(true);
  }, []);

  const handleAddPayment = useCallback((debtorId, invoice) => {
    console.log("Add payment for debtor ID:", debtorId, "Invoice:", invoice);
    setSelectedDebtorId(debtorId);
    setInvoiceMode("addPayment");
    setSelectedInvoice(invoice);
    setInvoiceDrawerOpen(true);
  }, []);

  const handleDeleteClick = useCallback((debtorId) => {
    console.log("Delete clicked for debtor ID:", debtorId);
    setDebtorToDelete(debtorId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (debtorToDelete) {
      console.log("Confirming delete for debtor:", debtorToDelete);
      dispatch(deleteDebtor(debtorToDelete))
        .unwrap()
        .then(() => {
          toast.success("Debtor deleted successfully!", { duration: 5000 });
          dispatch(fetchDebtors());
        })
        .catch((err) => {
          toast.error(
            `Error deleting debtor: ${err.message || "Unknown error"}`,
            { duration: 5000 }
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setDebtorToDelete(null);
        });
    }
  }, [dispatch, debtorToDelete]);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setDebtorToDelete(null);
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleTabChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const columns = useMemo(
    () => [
      { field: "customerName", headerName: "Name Of Debtor", flex: 2 },
      {
        field: "openingBalance",
        headerName: "Opening Balance",
        flex: 1,
        type: "number",
      },
      { field: "totalDebt", headerName: "Total Debt", flex: 1, type: "number" },
      {
        field: "totalCreditReceived",
        headerName: "Total Credit Received",
        flex: 1,
        type: "number",
      },
      {
        field: "totalDeduction",
        headerName: "Total Deduction",
        flex: 1,
        type: "number",
      },
      {
        field: "closingBalance",
        headerName: "Closing Balance",
        flex: 1,
        type: "number",
      },
      { field: "status", headerName: "Status", flex: 1 },
      { field: "createdBy", headerName: "Created By", flex: 2 },
      { field: "createdAt", headerName: "Created At", flex: 2 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (
          <>
            {hasPermission(user, "write:debtors") && (
              <>
                <i
                  className="bx bx-pencil"
                  style={{
                    color: "#fe6c00",
                    cursor: "pointer",
                    marginRight: "12px",
                  }}
                  onClick={() => handleEditClick(params.row)}
                  title="Edit Debtor"
                ></i>
                <i
                  className="bx bx-plus"
                  style={{
                    color: "#00cc00",
                    cursor: "pointer",
                    marginRight: "12px",
                  }}
                  onClick={() => handleAddInvoice(params.row.id)}
                  title="Add Invoice"
                ></i>
                {params.row.invoices.length > 0 && (
                  <i
                    className="bx bx-money"
                    style={{
                      color: "#0066cc",
                      cursor: "pointer",
                      marginRight: "12px",
                    }}
                    onClick={() =>
                      handleAddPayment(params.row.id, params.row.invoices[0])
                    }
                    title="Add Payment"
                  ></i>
                )}
                <i
                  className="bx bx-trash"
                  style={{
                    color: "#fe1e00",
                    cursor: "pointer",
                    marginRight: "12px",
                  }}
                  onClick={() => handleDeleteClick(params.row.id)}
                  title="Delete Debtor"
                ></i>
              </>
            )}
          </>
        ),
      },
    ],
    [
      user,
      handleEditClick,
      handleAddInvoice,
      handleAddPayment,
      handleDeleteClick,
    ]
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
        <Typography variant="h6">Please log in to view debtors.</Typography>
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
          <TabList onChange={handleTabChange} aria-label="debtor tabs">
            <Tab label="Debtor Records" value="0" />
            <Tab label="Invoice" value="1" />
            <Tab label="Payment History" value="2" />
            <Tab label="Debtors Dashboard" value="3" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <Box sx={{ width: "100%" }}>
            {loading && filteredData.length === 0 ? (
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
                    : error || "Failed to load debtors"}
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
                    Debtors
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
                    {hasPermission(user, "write:debtors") && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setEditData(null);
                          setDebtorDrawerOpen(true);
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
                        Add New Debtor
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
                <AddNewDebtorsDrawer
                  open={debtorDrawerOpen}
                  onClose={() => {
                    setDebtorDrawerOpen(false);
                    setEditData(null);
                  }}
                  editMode={!!editData}
                  initialData={editData || {}}
                  onSaveSuccess={() => dispatch(fetchDebtors())}
                />
                <AddNewInvoiceDrawer
                  open={invoiceDrawerOpen}
                  onClose={() => {
                    setInvoiceDrawerOpen(false);
                    setSelectedDebtorId(null);
                    setSelectedInvoice(null);
                    dispatch(fetchDebtors());
                  }}
                  debtorId={selectedDebtorId}
                  mode={invoiceMode}
                  invoiceData={selectedInvoice || {}}
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
                      Are you sure you want to delete this debtor?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button
                      onClick={handleConfirmDelete}
                      color="secondary"
                      autoFocus
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Box>
        </TabPanel>
        <TabPanel value="1">
          <ManageInvoice />
        </TabPanel>
        <TabPanel value="2">
          <InitialPaymentHistory />
        </TabPanel>
        <TabPanel value="3">
          <DebtorsDashboard />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default Debtors;
