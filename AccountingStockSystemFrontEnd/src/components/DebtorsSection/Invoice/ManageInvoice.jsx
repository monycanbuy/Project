// import React, { useEffect, useState, useCallback } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   TextField,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import { format } from "date-fns";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { hasPermission } from "../../../utils/authUtils";
// import AddNewInvoiceDrawer from "../../AddDrawerSection/AddNewInvoiceDrawer";
// import { fetchDebtors } from "../../../redux/slices/debtorsSlice";

// const ManageInvoice = () => {
//   const dispatch = useDispatch();
//   const { debtors, loading, error } = useSelector((state) => state.debtors);
//   const { user } = useSelector((state) => state.auth);
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);
//   const [invoiceMode, setInvoiceMode] = useState("addInvoice");
//   const [selectedDebtorId, setSelectedDebtorId] = useState(null);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   useEffect(() => {
//     dispatch(fetchDebtors());
//   }, [dispatch]);

//   useEffect(() => {
//     if (debtors && Array.isArray(debtors)) {
//       const allInvoices = debtors.flatMap((debtor) =>
//         (debtor.invoices || []).map((invoice) => ({
//           id: invoice._id,
//           debtorId: debtor._id,
//           customerName: debtor.customer?.name || "N/A",
//           invoiceNumber: invoice.invoiceNumber || "N/A",
//           amount: invoice.amount || 0,
//           issuedDate: invoice.issuedDate
//             ? format(new Date(invoice.issuedDate), "yyyy-MM-dd")
//             : "N/A",
//           dueDate: invoice.dueDate
//             ? format(new Date(invoice.dueDate), "yyyy-MM-dd")
//             : "N/A",
//           paidAmount:
//             (invoice.initialPayment?.amount || 0) +
//             (invoice.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) ||
//               0),
//           initialPaymentMethod: invoice.initialPayment?.method?.name || "N/A",
//           status: invoice.status || "Pending",
//           hasInitialPayment: !!invoice.initialPayment,
//           payments: invoice.payments || [],
//           initialPayment: invoice.initialPayment || null,
//         }))
//       );
//       setInvoices(allInvoices);
//       setFilteredInvoices(allInvoices);
//     }
//   }, [debtors]);

//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredInvoices(invoices);
//     } else {
//       const filtered = invoices.filter((row) =>
//         Object.values(row).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchVal.toLowerCase())
//         )
//       );
//       setFilteredInvoices(filtered);
//     }
//   };

//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredInvoices
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
//     link.download = "invoices.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleAddInvoice = useCallback(() => {
//     setInvoiceMode("addInvoice");
//     setSelectedDebtorId(null);
//     setSelectedInvoice(null);
//     setInvoiceDrawerOpen(true);
//   }, []);

//   const handleUpdateInvoice = useCallback((row) => {
//     setInvoiceMode("updateInvoice");
//     setSelectedDebtorId(row.debtorId);
//     setSelectedInvoice({
//       _id: row.id,
//       invoiceNumber: row.invoiceNumber,
//       amount: row.amount,
//       issuedDate: row.issuedDate,
//       dueDate: row.dueDate,
//     });
//     setInvoiceDrawerOpen(true);
//   }, []);

//   const handleAddPayment = useCallback((row) => {
//     setInvoiceMode("addPayment");
//     setSelectedDebtorId(row.debtorId);
//     setSelectedInvoice({
//       _id: row.id,
//       invoiceNumber: row.invoiceNumber,
//     });
//     setInvoiceDrawerOpen(true);
//   }, []);

//   const handleAddInitialPayment = useCallback((row) => {
//     setInvoiceMode("addInitialPayment");
//     setSelectedDebtorId(row.debtorId);
//     setSelectedInvoice({
//       _id: row.id,
//       invoiceNumber: row.invoiceNumber,
//     });
//     setInvoiceDrawerOpen(true);
//   }, []);

//   const paymentColumns = [
//     {
//       field: "type",
//       headerName: "Type",
//       width: 100,
//       valueGetter: (params) => params.row.type,
//     },
//     { field: "amount", headerName: "Amount", width: 100 },
//     {
//       field: "method",
//       headerName: "Method",
//       width: 120,
//       valueGetter: (params) => params.row.method?.name || "N/A",
//     },
//     {
//       field: "date",
//       headerName: "Date",
//       width: 150,
//       valueGetter: (params) =>
//         format(new Date(params.row.date), "yyyy-MM-dd HH:mm"),
//     },
//   ];

//   const columns = [
//     { field: "customerName", headerName: "Customer Name", flex: 1 },
//     { field: "invoiceNumber", headerName: "Invoice Number", flex: 1 },
//     { field: "amount", headerName: "Amount", flex: 1 },
//     { field: "issuedDate", headerName: "Issued Date", flex: 1 },
//     { field: "dueDate", headerName: "Due Date", flex: 1 },
//     { field: "paidAmount", headerName: "Paid Amount", flex: 1 },
//     {
//       field: "initialPaymentMethod",
//       headerName: "Initial Payment Method",
//       flex: 1,
//     },
//     { field: "status", headerName: "Status", flex: 1 },
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
//                 onClick={() => handleUpdateInvoice(params.row)}
//                 title="Update Invoice"
//               ></i>
//               <i
//                 className="bx bx-money"
//                 style={{
//                   color: "#0066cc",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleAddPayment(params.row)}
//                 title="Add Payment"
//               ></i>
//               <i
//                 className="bx bx-coin"
//                 style={{
//                   color: params.row.hasInitialPayment ? "#ccc" : "#00cc00",
//                   cursor: params.row.hasInitialPayment
//                     ? "not-allowed"
//                     : "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() =>
//                   !params.row.hasInitialPayment &&
//                   handleAddInitialPayment(params.row)
//                 }
//                 title={
//                   params.row.hasInitialPayment
//                     ? "Initial Payment Already Added"
//                     : "Add Initial Payment"
//                 }
//               ></i>
//             </>
//           )}
//         </>
//       ),
//     },
//   ];

//   const getDetailPanelContent = useCallback((row) => {
//     const paymentRows = [
//       ...(row.initialPayment
//         ? [
//             {
//               id: `initial-${row.id}`,
//               type: "Initial Payment",
//               amount: row.initialPayment.amount,
//               method: row.initialPayment.method,
//               date: row.initialPayment.date,
//             },
//           ]
//         : []),
//       ...row.payments.map((p, index) => ({
//         id: `${row.id}-payment-${index}`,
//         type: "Payment",
//         amount: p.amount,
//         method: p.method,
//         date: p.date,
//       })),
//     ];

//     return (
//       <Box sx={{ p: 2 }}>
//         <Typography variant="subtitle1">Payment History</Typography>
//         <DataGrid
//           rows={paymentRows}
//           columns={paymentColumns}
//           autoHeight
//           disableSelectionOnClick
//           hideFooter
//         />
//       </Box>
//     );
//   }, []);

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
//                 Invoices
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
//                     onClick={handleAddInvoice}
//                     sx={{ backgroundColor: "#fe6c00" }}
//                   >
//                     Add Invoice
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
//                   rows={filteredInvoices}
//                   columns={columns}
//                   pageSizeOptions={[10, 20, 50]}
//                   initialState={{
//                     pagination: { paginationModel: { pageSize: 10 } },
//                   }}
//                   disableSelectionOnClick
//                   getDetailPanelContent={getDetailPanelContent}
//                   getDetailPanelHeight={() => "auto"}
//                 />
//               </Box>
//             )}
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
//             <Toaster />
//           </>
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ManageInvoice;

import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Toaster, toast } from "react-hot-toast";
import {
  Button,
  CircularProgress,
  Box,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { hasPermission } from "../../../utils/authUtils";
import AddNewInvoiceDrawer from "../../AddDrawerSection/AddNewInvoiceDrawer";
import { fetchDebtors } from "../../../redux/slices/debtorsSlice";
import { checkAuthStatus } from "../../../redux/slices/authSlice";

const ManageInvoice = () => {
  const dispatch = useDispatch();
  const {
    debtors = [],
    loading = false,
    error,
  } = useSelector((state) => state.debtors || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);
  const [invoiceMode, setInvoiceMode] = useState("addInvoice");
  const [selectedDebtorId, setSelectedDebtorId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("ManageInvoice - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching debtors...");
        dispatch(fetchDebtors())
          .unwrap()
          .then()
          .catch((err) => console.error("Fetch failed:", err));
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching debtors...");
            dispatch(fetchDebtors())
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
    if (debtors && Array.isArray(debtors) && !loading && !error) {
      const allInvoices = debtors.flatMap((debtor) =>
        (debtor.invoices || []).map((invoice) => ({
          id: invoice._id || "N/A",
          debtorId: debtor._id || "N/A",
          customerName: debtor.customer?.name || "N/A",
          invoiceNumber: invoice.invoiceNumber || "N/A",
          amount: invoice.amount || 0,
          issuedDate: invoice.issuedDate
            ? format(new Date(invoice.issuedDate), "yyyy-MM-dd")
            : "N/A",
          dueDate: invoice.dueDate
            ? format(new Date(invoice.dueDate), "yyyy-MM-dd")
            : "N/A",
          paidAmount:
            (invoice.initialPayment?.amount || 0) +
            (invoice.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) ||
              0),
          initialPaymentMethod: invoice.initialPayment?.method?.name || "N/A",
          status: invoice.status || "Pending",
          hasInitialPayment: !!invoice.initialPayment,
          payments: invoice.payments || [],
          initialPayment: invoice.initialPayment || null,
        }))
      );
      setInvoices(allInvoices);
      setFilteredInvoices(allInvoices);
    } else {
      setInvoices([]);
      setFilteredInvoices([]);
    }
  }, [debtors, loading, error]);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (searchVal.trim() === "") {
        setFilteredInvoices(invoices);
      } else {
        const filtered = invoices.filter((row) =>
          Object.values(row).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchVal.toLowerCase())
          )
        );
        setFilteredInvoices(filtered);
      }
    },
    [invoices]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredInvoices
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
    link.download = "invoices.csv";
    link.click();
  }, [filteredInvoices]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleAddInvoice = useCallback(() => {
    setInvoiceMode("addInvoice");
    setSelectedDebtorId(null);
    setSelectedInvoice(null);
    setInvoiceDrawerOpen(true);
  }, []);

  const handleUpdateInvoice = useCallback((row) => {
    setInvoiceMode("updateInvoice");
    setSelectedDebtorId(row.debtorId);
    setSelectedInvoice({
      _id: row.id,
      invoiceNumber: row.invoiceNumber,
      amount: row.amount,
      issuedDate: row.issuedDate,
      dueDate: row.dueDate,
    });
    setInvoiceDrawerOpen(true);
  }, []);

  const handleAddPayment = useCallback((row) => {
    setInvoiceMode("addPayment");
    setSelectedDebtorId(row.debtorId);
    setSelectedInvoice({
      _id: row.id,
      invoiceNumber: row.invoiceNumber,
    });
    setInvoiceDrawerOpen(true);
  }, []);

  const handleAddInitialPayment = useCallback((row) => {
    setInvoiceMode("addInitialPayment");
    setSelectedDebtorId(row.debtorId);
    setSelectedInvoice({
      _id: row.id,
      invoiceNumber: row.invoiceNumber,
    });
    setInvoiceDrawerOpen(true);
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const paymentColumns = [
    {
      field: "type",
      headerName: "Type",
      width: 100,
      valueGetter: (params) => params.row.type,
    },
    { field: "amount", headerName: "Amount", width: 100 },
    {
      field: "method",
      headerName: "Method",
      width: 120,
      valueGetter: (params) => params.row.method?.name || "N/A",
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueGetter: (params) =>
        format(new Date(params.row.date), "yyyy-MM-dd HH:mm"),
    },
  ];

  const columns = [
    { field: "customerName", headerName: "Customer Name", flex: 1 },
    { field: "invoiceNumber", headerName: "Invoice Number", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "issuedDate", headerName: "Issued Date", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    { field: "paidAmount", headerName: "Paid Amount", flex: 1 },
    {
      field: "initialPaymentMethod",
      headerName: "Initial Payment Method",
      flex: 1,
    },
    { field: "status", headerName: "Status", flex: 1 },
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
                onClick={() => handleUpdateInvoice(params.row)}
                title="Update Invoice"
              ></i>
              <i
                className="bx bx-money"
                style={{
                  color: "#0066cc",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleAddPayment(params.row)}
                title="Add Payment"
              ></i>
              <i
                className="bx bx-coin"
                style={{
                  color: params.row.hasInitialPayment ? "#ccc" : "#00cc00",
                  cursor: params.row.hasInitialPayment
                    ? "not-allowed"
                    : "pointer",
                  marginRight: "12px",
                }}
                onClick={() =>
                  !params.row.hasInitialPayment &&
                  handleAddInitialPayment(params.row)
                }
                title={
                  params.row.hasInitialPayment
                    ? "Initial Payment Already Added"
                    : "Add Initial Payment"
                }
              ></i>
            </>
          )}
        </>
      ),
    },
  ];

  const getDetailPanelContent = useCallback((row) => {
    const paymentRows = [
      ...(row.initialPayment
        ? [
            {
              id: `initial-${row.id}`,
              type: "Initial Payment",
              amount: row.initialPayment.amount,
              method: row.initialPayment.method,
              date: row.initialPayment.date,
            },
          ]
        : []),
      ...row.payments.map((p, index) => ({
        id: `${row.id}-payment-${index}`,
        type: "Payment",
        amount: p.amount,
        method: p.method,
        date: p.date,
      })),
    ];

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1">Payment History</Typography>
        <DataGrid
          rows={paymentRows}
          columns={paymentColumns}
          autoHeight
          disableSelectionOnClick
          hideFooter
        />
      </Box>
    );
  }, []);

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
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">Please log in to view invoices.</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {loading && filteredInvoices.length === 0 ? (
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
                : error || "Failed to load invoices"}
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
                Invoices
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
                {hasPermission(user, "write:debtors") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddInvoice}
                    sx={{
                      backgroundColor: "#fe6c00",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#fec80a",
                        color: "#bdbabb",
                      },
                    }}
                  >
                    Add Invoice
                  </Button>
                )}
              </Box>
            </Box>
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={filteredInvoices}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                disableSelectionOnClick
                getDetailPanelContent={getDetailPanelContent}
                getDetailPanelHeight={() => "auto"}
              />
            </Box>
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
          </>
        )}
        <Toaster />
      </Box>
    </ThemeProvider>
  );
};

export default ManageInvoice;
