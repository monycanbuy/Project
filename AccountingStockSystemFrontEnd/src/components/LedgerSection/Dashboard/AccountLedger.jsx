// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useDispatch, useSelector } from "react-redux";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   CircularProgress,
//   Box,
//   Tab,
//   Button,
//   TextField,
//   IconButton,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import Typography from "@mui/material/Typography";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import { fetchAccountLedger } from "../../../redux/slices/ledgerTransactionSlice"; // Adjust path as needed

// const AccountLedger = () => {
//   const dispatch = useDispatch();
//   const { summary, status, error } = useSelector(
//     (state) => state.ledgerTransactions
//   );
//   const [value, setValue] = useState("0");
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     console.log("Fetching account ledger summary...");
//     dispatch(fetchAccountLedger());

//     const interval = setInterval(() => {
//       console.log("Polling for updated account ledger summary...");
//       dispatch(fetchAccountLedger());
//     }, 30000); // Refresh every 30 seconds

//     return () => clearInterval(interval);
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Redux state:", { summary, status, error });
//   }, [summary, status, error]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleRefresh = () => {
//     console.log("Manual refresh triggered...");
//     dispatch(fetchAccountLedger());
//   };

//   const handleSearch = (value) => {
//     setSearchText(value);
//   };

//   const handleExport = () => {
//     const csvRows = [];
//     const headers = columns.map((col) => col.headerName);
//     csvRows.push(headers.join(","));

//     rows.forEach((row) => {
//       const values = columns.map((col) =>
//         typeof row[col.field] === "string"
//           ? `"${row[col.field].replace(/"/g, '""')}"`
//           : row[col.field]
//       );
//       csvRows.push(values.join(","));
//     });

//     const csvContent = csvRows.join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "account_ledger.csv";
//     link.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const numberFormatter = new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   const columns = [
//     { field: "date", headerName: "Date", flex: 1 },
//     { field: "account", headerName: "Account", flex: 1 },
//     { field: "sumOfDebit", headerName: "Sum of Debit", flex: 1 },
//     { field: "sumOfCredit", headerName: "Sum of Credit", flex: 1 },
//     { field: "sumOfBalance", headerName: "Sum of Balance", flex: 1 },
//   ];

//   const data = Array.isArray(summary.entries)
//     ? summary.entries.map((item, index) => {
//         console.log("Mapping item:", item);
//         const date = item.date || `row-${index}`;
//         const debit = item.sumOfDebit || 0;
//         const credit = item.sumOfCredit || 0;
//         const balance = debit - credit;
//         return {
//           id: `${date}-${item.account}-${index}`,
//           date: date,
//           account: item.account || "Unknown",
//           sumOfDebit: numberFormatter.format(debit),
//           sumOfCredit: numberFormatter.format(credit),
//           sumOfBalance: numberFormatter.format(balance),
//         };
//       })
//     : [];

//   console.log("Processed data:", data);

//   const totals = {
//     id: "totals",
//     date: "Totals",
//     account: "",
//     sumOfDebit: numberFormatter.format(summary.totals.totalDebit || 0),
//     sumOfCredit: numberFormatter.format(summary.totals.totalCredit || 0),
//     sumOfBalance: numberFormatter.format(
//       (summary.totals.totalDebit || 0) - (summary.totals.totalCredit || 0)
//     ),
//   };

//   const filteredData = data.filter(
//     (row) =>
//       row.date.toLowerCase().includes(searchText.toLowerCase()) ||
//       row.account.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const rows = filteredData.length > 0 ? [...filteredData, totals] : [];
//   console.log("Rows for DataGrid:", rows);

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

//   if (status === "loading" && summary.entries.length === 0) {
//     return (
//       <ThemeProvider theme={createTheme()}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "200px",
//             width: "100%",
//           }}
//         >
//           <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <Box sx={{ color: "red", textAlign: "center", mt: 4 }}>
//         <Typography variant="h6">Error: {error || "Unknown error"}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         <Box
//           sx={{
//             padding: "8px",
//             backgroundColor: "#d0d0d0",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "8px",
//           }}
//         >
//           <Typography variant="h6" sx={{ color: "#000" }}>
//             Account Ledger
//           </Typography>
//           <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
//             <TextField
//               variant="outlined"
//               size="small"
//               placeholder="Search..."
//               value={searchText}
//               onChange={(e) => handleSearch(e.target.value)}
//               sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//             />
//             <IconButton onClick={handleExport} title="Download CSV">
//               <GetAppIcon />
//             </IconButton>
//             <IconButton onClick={handlePrint} title="Print">
//               <PrintIcon />
//             </IconButton>
//           </Box>
//         </Box>
//         <Box sx={{ height: 600, width: "100%" }}>
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             pageSize={10}
//             rowsPerPageOptions={[10]}
//             disableSelectionOnClick
//           />
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AccountLedger;

import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CircularProgress,
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import { fetchAccountLedger } from "../../../redux/slices/ledgerTransactionSlice";
import { checkAuthStatus } from "../../../redux/slices/authSlice";

const AccountLedger = () => {
  const dispatch = useDispatch();
  const {
    summary = {},
    status,
    error,
  } = useSelector((state) => state.ledgerTransactions || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const [searchText, setSearchText] = useState("");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("AccountLedger - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching account ledger summary...");
        dispatch(fetchAccountLedger())
          .unwrap()
          .then()
          .catch((err) => console.error("Fetch failed:", err));
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching account ledger...");
            dispatch(fetchAccountLedger())
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

    const interval = setInterval(() => {
      if (isAuthenticated) {
        //console.log("Polling for updated account ledger summary...");
        dispatch(fetchAccountLedger());
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    //console.log("Redux state:", { summary, status, error });
  }, [summary, status, error]);

  const numberFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "account", headerName: "Account", flex: 1 },
    { field: "sumOfDebit", headerName: "Sum of Debit", flex: 1 },
    { field: "sumOfCredit", headerName: "Sum of Credit", flex: 1 },
    { field: "sumOfBalance", headerName: "Sum of Balance", flex: 1 },
  ];

  const data = Array.isArray(summary.entries)
    ? summary.entries.map((item, index) => {
        //console.log("Mapping item:", item);
        const date = item.date || `row-${index}`;
        const debit = item.sumOfDebit || 0;
        const credit = item.sumOfCredit || 0;
        const balance = debit - credit;
        return {
          id: `${date}-${item.account || "unknown"}-${index}`,
          date,
          account: item.account || "Unknown",
          sumOfDebit: numberFormatter.format(debit),
          sumOfCredit: numberFormatter.format(credit),
          sumOfBalance: numberFormatter.format(balance),
        };
      })
    : [];

  const totals = {
    id: "totals",
    date: "Totals",
    account: "",
    sumOfDebit: numberFormatter.format(summary.totals?.totalDebit || 0),
    sumOfCredit: numberFormatter.format(summary.totals?.totalCredit || 0),
    sumOfBalance: numberFormatter.format(
      (summary.totals?.totalDebit || 0) - (summary.totals?.totalCredit || 0)
    ),
  };

  const filteredData = data.filter(
    (row) =>
      row.date.toLowerCase().includes(searchText.toLowerCase()) ||
      row.account.toLowerCase().includes(searchText.toLowerCase())
  );

  const rows = filteredData.length > 0 ? [...filteredData, totals] : [];

  const handleRefresh = useCallback(() => {
    //console.log("Manual refresh triggered...");
    dispatch(fetchAccountLedger());
  }, [dispatch]);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
  }, []);

  const handleExport = useCallback(() => {
    const csvRows = [];
    const headers = columns.map((col) => col.headerName);
    csvRows.push(headers.join(","));

    rows.forEach((row) => {
      const values = columns.map((col) =>
        typeof row[col.field] === "string"
          ? `"${row[col.field].replace(/"/g, '""')}"`
          : row[col.field]
      );
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "account_ledger.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  }, [rows, columns]); // Added columns as a dependency

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

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
          Please log in to view the account ledger.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {status === "loading" &&
        (!summary.entries || summary.entries.length === 0) ? (
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
                : error || "Failed to load account ledger"}
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
                Account Ledger
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
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleRefresh}
                  sx={{
                    backgroundColor: "#fe6c00",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>
            {rows.length === 0 && status !== "loading" ? (
              <Typography>No account ledger data available</Typography>
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

export default AccountLedger;
