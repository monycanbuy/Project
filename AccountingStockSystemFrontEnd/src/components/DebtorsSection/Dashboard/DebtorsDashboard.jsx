// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDebtors } from "../../../redux/slices/debtorsSlice";
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

// const DebtorsDashboard = () => {
//   const dispatch = useDispatch();
//   const { debtors, loading, error } = useSelector((state) => state.debtors);
//   const [filteredDebtors, setFilteredDebtors] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     dispatch(fetchDebtors());
//   }, [dispatch]);

//   useEffect(() => {
//     if (debtors && Array.isArray(debtors)) {
//       const processedDebtors = debtors.map((debtor) => {
//         const invoices = debtor.invoices || [];
//         const payments = invoices.flatMap((inv) => [
//           ...(inv.initialPayment ? [inv.initialPayment] : []),
//           ...(inv.payments || []),
//         ]);

//         const bankPos =
//           payments
//             .filter(
//               (p) => p.method?.name === "Bank" || p.method?.name === "POS"
//             )
//             .reduce((sum, p) => sum + (p.amount || 0), 0) || "—";

//         const wht5Percent = payments
//           .filter((p) => p.whtRate === 5)
//           .reduce((sum, p) => sum + (p.whtAmount || 0), 0);
//         const wht10Percent = payments
//           .filter((p) => p.whtRate === 10)
//           .reduce((sum, p) => sum + (p.whtAmount || 0), 0);
//         const whtTotal = wht5Percent + wht10Percent || "—";

//         const cashRefund = invoices.reduce(
//           (sum, inv) => sum + (inv.cashRefund || 0),
//           0
//         );
//         const badDebtWriteOff = invoices.reduce(
//           (sum, inv) => sum + (inv.badDebtWriteOff || 0),
//           0
//         );
//         const actualDebtPaid = payments.reduce(
//           (sum, p) => sum + (p.amount || 0),
//           0
//         );

//         const latestDate = payments.length
//           ? format(
//               new Date(
//                 Math.max(...payments.map((p) => new Date(p.date).getTime()))
//               ),
//               "yyyy-MM-dd HH:mm"
//             )
//           : "—";

//         return {
//           id: debtor._id,
//           nameOfDebtor: debtor.customer?.name || "N/A",
//           openingBalance: debtor.openingBalance || 0,
//           creditReceived: debtor.totalCreditReceived || 0,
//           totalDebt: debtor.totalDebt || 0,
//           bankPos,
//           wht: whtTotal,
//           cashRefund,
//           actualDebtPaid,
//           badDebtWriteOff,
//           totalDeductions: debtor.totalDeduction || 0,
//           closingBalance: debtor.closingBalance || 0,
//           date: latestDate,
//         };
//       });
//       setFilteredDebtors(processedDebtors);
//     }
//   }, [debtors]);

//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredDebtors(
//         debtors.map((debtor) => processDebtorData(debtor)) // Reprocess all debtors
//       );
//     } else {
//       const filtered = debtors
//         .map((debtor) => processDebtorData(debtor))
//         .filter((row) =>
//           Object.values(row).some(
//             (value) =>
//               value &&
//               value.toString().toLowerCase().includes(searchVal.toLowerCase())
//           )
//         );
//       setFilteredDebtors(filtered);
//     }
//   };

//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredDebtors
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
//     link.download = "debtors_dashboard.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const processDebtorData = (debtor) => {
//     const invoices = debtor.invoices || [];
//     const payments = invoices.flatMap((inv) => [
//       ...(inv.initialPayment ? [inv.initialPayment] : []),
//       ...(inv.payments || []),
//     ]);

//     const bankPos =
//       payments
//         .filter((p) => p.method?.name === "Bank" || p.method?.name === "POS")
//         .reduce((sum, p) => sum + (p.amount || 0), 0) || "—";

//     const wht5Percent = payments
//       .filter((p) => p.whtRate === 5)
//       .reduce((sum, p) => sum + (p.whtAmount || 0), 0);
//     const wht10Percent = payments
//       .filter((p) => p.whtRate === 10)
//       .reduce((sum, p) => sum + (p.whtAmount || 0), 0);
//     const whtTotal = wht5Percent + wht10Percent || "—";

//     const cashRefund = invoices.reduce(
//       (sum, inv) => sum + (inv.cashRefund || 0),
//       0
//     );
//     const badDebtWriteOff = invoices.reduce(
//       (sum, inv) => sum + (inv.badDebtWriteOff || 0),
//       0
//     );
//     const actualDebtPaid = payments.reduce(
//       (sum, p) => sum + (p.amount || 0),
//       0
//     );

//     const latestDate = payments.length
//       ? format(
//           new Date(
//             Math.max(...payments.map((p) => new Date(p.date).getTime()))
//           ),
//           "yyyy-MM-dd HH:mm"
//         )
//       : "—";

//     return {
//       id: debtor._id,
//       nameOfDebtor: debtor.customer?.name || "N/A",
//       openingBalance: debtor.openingBalance || 0,
//       creditReceived: debtor.totalCreditReceived || 0,
//       totalDebt: debtor.totalDebt || 0,
//       bankPos,
//       wht: whtTotal,
//       cashRefund,
//       actualDebtPaid,
//       badDebtWriteOff,
//       totalDeductions: debtor.totalDeduction || 0,
//       closingBalance: debtor.closingBalance || 0,
//       date: latestDate,
//     };
//   };

//   const columns = [
//     { field: "nameOfDebtor", headerName: "NAME OF DEBTOR", flex: 1 },
//     { field: "openingBalance", headerName: "OP. BAL", flex: 1 },
//     { field: "creditReceived", headerName: "CREDIT RECEIVED", flex: 1 },
//     { field: "totalDebt", headerName: "TOTAL DEBT", flex: 1 },
//     { field: "bankPos", headerName: "BANK/POS", flex: 1 },
//     { field: "wht", headerName: "5%/10% WHT", flex: 1 },
//     { field: "cashRefund", headerName: "CASH REFUND", flex: 1 },
//     { field: "actualDebtPaid", headerName: "ACTUAL DEBT PAID", flex: 1 },
//     { field: "badDebtWriteOff", headerName: "B/DEBT W/OFF", flex: 1 },
//     { field: "totalDeductions", headerName: "TOTAL DEDUCTIONS", flex: 1 },
//     { field: "closingBalance", headerName: "CLOSING BALANCE", flex: 1 },
//     { field: "date", headerName: "DATE", flex: 1 },
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
//                 Debtors Dashboard
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
//             ) : !filteredDebtors || filteredDebtors.length === 0 ? (
//               <Typography>No debtors available</Typography>
//             ) : (
//               <Box sx={{ height: 600, width: "100%" }}>
//                 <DataGrid
//                   rows={filteredDebtors}
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

// export default DebtorsDashboard;

import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchDebtors } from "../../../redux/slices/debtorsSlice";
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

const DebtorsDashboard = () => {
  const dispatch = useDispatch();
  const {
    debtors = [],
    loading = false,
    error,
  } = useSelector((state) => state.debtors || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [filteredDebtors, setFilteredDebtors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("DebtorsDashboard - Mount check", {
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
      const processedDebtors = debtors.map((debtor) =>
        processDebtorData(debtor)
      );
      setFilteredDebtors(processedDebtors);
    } else {
      setFilteredDebtors([]);
    }
  }, [debtors, loading, error]);

  const processDebtorData = useCallback((debtor) => {
    const invoices = debtor.invoices || [];
    const payments = invoices.flatMap((inv) => [
      ...(inv.initialPayment ? [inv.initialPayment] : []),
      ...(inv.payments || []),
    ]);

    const bankPos =
      payments
        .filter((p) => p.method?.name === "Bank" || p.method?.name === "POS")
        .reduce((sum, p) => sum + (p.amount || 0), 0) || "—";

    const wht5Percent = payments
      .filter((p) => p.whtRate === 5)
      .reduce((sum, p) => sum + (p.whtAmount || 0), 0);
    const wht10Percent = payments
      .filter((p) => p.whtRate === 10)
      .reduce((sum, p) => sum + (p.whtAmount || 0), 0);
    const whtTotal = wht5Percent + wht10Percent || "—";

    const cashRefund = invoices.reduce(
      (sum, inv) => sum + (inv.cashRefund || 0),
      0
    );
    const badDebtWriteOff = invoices.reduce(
      (sum, inv) => sum + (inv.badDebtWriteOff || 0),
      0
    );
    const actualDebtPaid = payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    const latestDate = payments.length
      ? format(
          new Date(
            Math.max(...payments.map((p) => new Date(p.date).getTime()))
          ),
          "yyyy-MM-dd HH:mm"
        )
      : "—";

    return {
      id: debtor._id || `debtor-${Math.random()}`, // Fallback ID
      nameOfDebtor: debtor.customer?.name || "N/A",
      openingBalance: debtor.openingBalance || 0,
      creditReceived: debtor.totalCreditReceived || 0,
      totalDebt: debtor.totalDebt || 0,
      bankPos,
      wht: whtTotal,
      cashRefund,
      actualDebtPaid,
      badDebtWriteOff,
      totalDeductions: debtor.totalDeduction || 0,
      closingBalance: debtor.closingBalance || 0,
      date: latestDate,
    };
  }, []);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (searchVal.trim() === "") {
        setFilteredDebtors(debtors.map((debtor) => processDebtorData(debtor)));
      } else {
        const filtered = debtors
          .map((debtor) => processDebtorData(debtor))
          .filter((row) =>
            Object.values(row).some(
              (value) =>
                value &&
                value.toString().toLowerCase().includes(searchVal.toLowerCase())
            )
          );
        setFilteredDebtors(filtered);
      }
    },
    [debtors, processDebtorData]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredDebtors
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
    link.download = "debtors_dashboard.csv";
    link.click();
  }, [filteredDebtors]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const columns = [
    { field: "nameOfDebtor", headerName: "NAME OF DEBTOR", flex: 1 },
    { field: "openingBalance", headerName: "OP. BAL", flex: 1 },
    { field: "creditReceived", headerName: "CREDIT RECEIVED", flex: 1 },
    { field: "totalDebt", headerName: "TOTAL DEBT", flex: 1 },
    { field: "bankPos", headerName: "BANK/POS", flex: 1 },
    { field: "wht", headerName: "5%/10% WHT", flex: 1 },
    { field: "cashRefund", headerName: "CASH REFUND", flex: 1 },
    { field: "actualDebtPaid", headerName: "ACTUAL DEBT PAID", flex: 1 },
    { field: "badDebtWriteOff", headerName: "B/DEBT W/OFF", flex: 1 },
    { field: "totalDeductions", headerName: "TOTAL DEDUCTIONS", flex: 1 },
    { field: "closingBalance", headerName: "CLOSING BALANCE", flex: 1 },
    { field: "date", headerName: "DATE", flex: 1 },
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
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view the debtors dashboard.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {loading && filteredDebtors.length === 0 ? (
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
                : error || "Failed to load debtors dashboard"}
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
                Debtors Dashboard
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
            {filteredDebtors.length === 0 && !loading ? (
              <Typography>No debtors available</Typography>
            ) : (
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={filteredDebtors}
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

export default DebtorsDashboard;
