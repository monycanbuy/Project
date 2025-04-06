// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPaymentHistory } from "../../../redux/slices/debtorsSlice";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   TextField,
//   IconButton,
// } from "@mui/material";
// import { format } from "date-fns";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";

// const InitialPaymentHistory = () => {
//   const dispatch = useDispatch();
//   const { paymentHistory, loading, error } = useSelector(
//     (state) => state.debtors
//   );
//   const [filteredPayments, setFilteredPayments] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     console.log("Fetching payment history...");
//     dispatch(fetchPaymentHistory()).then((result) =>
//       console.log("Fetch result:", result)
//     );
//   }, [dispatch]);

//   useEffect(() => {
//     if (paymentHistory && Array.isArray(paymentHistory)) {
//       setFilteredPayments(paymentHistory);
//     }
//   }, [paymentHistory]);

//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredPayments(paymentHistory);
//     } else {
//       const filtered = paymentHistory.filter((payment) =>
//         Object.values(payment).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchVal.toLowerCase())
//         )
//       );
//       setFilteredPayments(filtered);
//     }
//   };

//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredPayments
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
//     link.download = "payment_history.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const columns = [
//     { field: "customerName", headerName: "Name Of Debtor", flex: 1 },
//     { field: "invoiceNumber", headerName: "Invoice Number", flex: 1 },
//     { field: "amount", headerName: "Amount", flex: 1 },
//     {
//       field: "date",
//       headerName: "Date",
//       flex: 1,
//       renderCell: (params) =>
//         params.row.date
//           ? format(new Date(params.row.date), "yyyy-MM-dd HH:mm")
//           : "N/A",
//     },
//     { field: "method", headerName: "Payment Method", flex: 1 },
//   ];

//   const rows =
//     loading || !filteredPayments
//       ? []
//       : filteredPayments.map((payment) => ({
//           id: payment.paymentId,
//           customerName: payment.customerName,
//           invoiceNumber: payment.invoiceNumber,
//           amount: payment.amount,
//           date: payment.date,
//           method: payment.method,
//         }));

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
//                 Payment History
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
//             {loading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
//               </Box>
//             ) : !filteredPayments || filteredPayments.length === 0 ? (
//               <Typography>No payment history available</Typography>
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
//           </>
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default InitialPaymentHistory;

import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentHistory } from "../../../redux/slices/debtorsSlice";
import { checkAuthStatus } from "../../../redux/slices/authSlice";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";

const InitialPaymentHistory = () => {
  const dispatch = useDispatch();
  const {
    paymentHistory = [],
    loading = false,
    error,
  } = useSelector((state) => state.debtors || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("InitialPaymentHistory - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching payment history...");
        dispatch(fetchPaymentHistory())
          .unwrap()
          .then()
          .catch((err) => console.error("Fetch failed:", err));
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching payment history...");
            dispatch(fetchPaymentHistory())
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
    if (paymentHistory && Array.isArray(paymentHistory) && !loading && !error) {
      setFilteredPayments(paymentHistory);
    } else {
      setFilteredPayments([]);
    }
  }, [paymentHistory, loading, error]);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (searchVal.trim() === "") {
        setFilteredPayments(paymentHistory);
      } else {
        const filtered = paymentHistory.filter((payment) =>
          Object.values(payment).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchVal.toLowerCase())
          )
        );
        setFilteredPayments(filtered);
      }
    },
    [paymentHistory]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredPayments
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
    link.download = "payment_history.csv";
    link.click();
  }, [filteredPayments]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const columns = [
    { field: "customerName", headerName: "Name Of Debtor", flex: 1 },
    { field: "invoiceNumber", headerName: "Invoice Number", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) =>
        params.row.date
          ? format(new Date(params.row.date), "yyyy-MM-dd HH:mm")
          : "N/A",
    },
    { field: "method", headerName: "Payment Method", flex: 1 },
  ];

  const rows = filteredPayments.map((payment) => ({
    id: payment.paymentId || `payment-${Math.random()}`, // Fallback ID if paymentId is missing
    customerName: payment.customerName || "N/A",
    invoiceNumber: payment.invoiceNumber || "N/A",
    amount: payment.amount || 0,
    date: payment.date || null,
    method: payment.method || "N/A",
  }));

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
        <Typography variant="h6">
          Please log in to view payment history.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {loading && filteredPayments.length === 0 ? (
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
                : error || "Failed to load payment history"}
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
                Payment History
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
            {filteredPayments.length === 0 && !loading ? (
              <Typography>No payment history available</Typography>
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
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default InitialPaymentHistory;
