// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useDispatch, useSelector } from "react-redux";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { CircularProgress, Box, Tab, Button } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import DashboardReports from "./Reports/DashboardReports";
// import Typography from "@mui/material/Typography";
// import { fetchDailySalesHistory } from "../../redux/slices/aggregateSalesSlice";

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const { salesHistory, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     console.log("Fetching daily sales history...");
//     dispatch(fetchDailySalesHistory());

//     const interval = setInterval(() => {
//       console.log("Polling for updated sales history...");
//       dispatch(fetchDailySalesHistory());
//     }, 30000);

//     return () => clearInterval(interval);
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Redux state:", { salesHistory, status, error });
//   }, [salesHistory, status, error]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleRefresh = () => {
//     console.log("Manual refresh triggered...");
//     dispatch(fetchDailySalesHistory());
//   };

//   const numberFormatter = new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   const columns = [
//     { field: "date", headerName: "Date", flex: 1 },
//     { field: "laundry", headerName: "Laundry", flex: 1 },
//     { field: "hallTransaction", headerName: "Hall Transaction", flex: 1 },
//     { field: "frontOfficeSale", headerName: "Front Office Sale", flex: 1 },
//     { field: "seminar", headerName: "Seminar", flex: 1 },
//     {
//       field: "totalMinimartRestaurant",
//       headerName: "Minimart & Restaurant",
//       flex: 1,
//     },
//     { field: "totalAmount", headerName: "Total Amount", flex: 1 },
//   ];

//   const data = Array.isArray(salesHistory)
//     ? salesHistory
//         .filter((item) => item && (item.date || item.Date)) // Handle both 'date' and 'Date'
//         .map((item, index) => {
//           console.log("Mapping item:", item);
//           const date = item.date || item.Date || `row-${index}`; // Fallback for date
//           return {
//             id: date, // Use date as ID, fallback to index-based
//             date: date,
//             laundry: numberFormatter.format(item.laundry || item.Laundry || 0),
//             hallTransaction: numberFormatter.format(
//               item.hallTransaction || item.HallTransaction || 0
//             ),
//             frontOfficeSale: numberFormatter.format(
//               item.frontOfficeSale || item.FrontOfficeSale || 0
//             ),
//             seminar: numberFormatter.format(item.seminar || item.Seminar || 0),
//             totalMinimartRestaurant: numberFormatter.format(
//               item.totalMinimartRestaurant ||
//                 item["Total of Minimart&Restaurant"] ||
//                 0
//             ),
//             totalAmount: numberFormatter.format(
//               item.totalAmount || item.TotalAmount || 0
//             ),
//           };
//         })
//     : [];

//   console.log("Processed data:", data); // Log the final data array

//   const totals = data.reduce((acc, row) => {
//     Object.keys(row).forEach((key, index) => {
//       if (index > 0) {
//         // Skip 'id'
//         const value = row[key];
//         if (typeof value !== "string") {
//           console.error(`Unexpected value for ${key}:`, value);
//           acc[key] = acc[key] || 0;
//         } else {
//           acc[key] =
//             (acc[key] || 0) + parseFloat(value.replace(/[^0-9.-]+/g, "") || 0);
//         }
//       }
//     });
//     return acc;
//   }, {});

//   const totalsRow = {
//     id: "totals",
//     date: "Totals",
//     laundry: numberFormatter.format(totals.laundry || 0),
//     hallTransaction: numberFormatter.format(totals.hallTransaction || 0),
//     frontOfficeSale: numberFormatter.format(totals.frontOfficeSale || 0),
//     seminar: numberFormatter.format(totals.seminar || 0),
//     totalMinimartRestaurant: numberFormatter.format(
//       totals.totalMinimartRestaurant || 0
//     ),
//     totalAmount: numberFormatter.format(totals.totalAmount || 0),
//   };

//   const rows = data.length > 0 ? [...data, totalsRow] : [];
//   console.log("Rows for DataGrid:", rows); // Log the rows array

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

//   if (status === "loading" && salesHistory.length === 0) {
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
//       <TabContext value={value}>
//         <Box
//           sx={{
//             borderBottom: 1,
//             borderColor: "divider",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <TabList onChange={handleChange} aria-label="dashboard tabs">
//             <Tab label="Dashboard Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//           <Button onClick={handleRefresh} sx={{ mr: 2, color: "#fe6c00" }}>
//             Refresh
//           </Button>
//         </Box>
//         <TabPanel value="0">
//           <Box sx={{ height: 600, width: "100%" }}>
//             <DataGrid
//               rows={rows}
//               columns={columns}
//               pageSize={10}
//               rowsPerPageOptions={[10]}
//               disableSelectionOnClick
//             />
//           </Box>
//         </TabPanel>
//         <TabPanel value="1">
//           <DashboardReports />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress, Box, Tab, Button, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { fetchDailySalesHistory } from "../../redux/slices/aggregateSalesSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import DashboardReports from "./Reports/DashboardReports";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    salesHistory = [],
    status = "idle",
    error,
  } = useSelector((state) => state.aggregateSales || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const [value, setValue] = useState("0");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("Dashboard - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching daily sales history...");
        dispatch(fetchDailySalesHistory());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching daily sales history...");
            dispatch(fetchDailySalesHistory());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }

    const interval = setInterval(() => {
      //console.log("Polling for updated sales history...");
      if (isAuthenticated) {
        dispatch(fetchDailySalesHistory());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    //console.log("Redux state:", { salesHistory, status, error });
  }, [salesHistory, status, error]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRefresh = () => {
    //console.log("Manual refresh triggered...");
    if (isAuthenticated) {
      dispatch(fetchDailySalesHistory());
    }
  };

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  const numberFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const columns = useMemo(
    () => [
      { field: "date", headerName: "Date", flex: 1 },
      { field: "laundry", headerName: "Laundry", flex: 1 },
      { field: "hallTransaction", headerName: "Hall Transaction", flex: 1 },
      { field: "frontOfficeSale", headerName: "Front Office Sale", flex: 1 },
      { field: "seminar", headerName: "Seminar", flex: 1 },
      {
        field: "totalMinimartRestaurant",
        headerName: "Minimart & Restaurant",
        flex: 1,
      },
      { field: "totalAmount", headerName: "Total Amount", flex: 1 },
    ],
    []
  );

  const data = Array.isArray(salesHistory)
    ? salesHistory
        .filter((item) => item && (item.date || item.Date))
        .map((item, index) => {
          //console.log("Mapping item:", item);
          const date = item.date || item.Date || `row-${index}`;
          return {
            id: date,
            date: date,
            laundry: numberFormatter.format(item.laundry || item.Laundry || 0),
            hallTransaction: numberFormatter.format(
              item.hallTransaction || item.HallTransaction || 0
            ),
            frontOfficeSale: numberFormatter.format(
              item.frontOfficeSale || item.FrontOfficeSale || 0
            ),
            seminar: numberFormatter.format(item.seminar || item.Seminar || 0),
            totalMinimartRestaurant: numberFormatter.format(
              item.totalMinimartRestaurant ||
                item["Total of Minimart&Restaurant"] ||
                0
            ),
            totalAmount: numberFormatter.format(
              item.totalAmount || item.TotalAmount || 0
            ),
          };
        })
    : [];

  //console.log("Processed data:", data);

  const totals = data.reduce((acc, row) => {
    Object.keys(row).forEach((key, index) => {
      if (index > 0) {
        const value = row[key];
        if (typeof value !== "string") {
          console.error(`Unexpected value for ${key}:`, value);
          acc[key] = acc[key] || 0;
        } else {
          acc[key] =
            (acc[key] || 0) + parseFloat(value.replace(/[^0-9.-]+/g, "") || 0);
        }
      }
    });
    return acc;
  }, {});

  const totalsRow = {
    id: "totals",
    date: "Totals",
    laundry: numberFormatter.format(totals.laundry || 0),
    hallTransaction: numberFormatter.format(totals.hallTransaction || 0),
    frontOfficeSale: numberFormatter.format(totals.frontOfficeSale || 0),
    seminar: numberFormatter.format(totals.seminar || 0),
    totalMinimartRestaurant: numberFormatter.format(
      totals.totalMinimartRestaurant || 0
    ),
    totalAmount: numberFormatter.format(totals.totalAmount || 0),
  };

  const rows = data.length > 0 ? [...data, totalsRow] : [];
  //console.log("Rows for DataGrid:", rows);

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
          Please log in to view the dashboard.
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TabList onChange={handleChange} aria-label="dashboard tabs">
            <Tab label="Dashboard Table" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
          <Button onClick={handleRefresh} sx={{ mr: 2, color: "#fe6c00" }}>
            Refresh
          </Button>
        </Box>
        <TabPanel value="0">
          {status === "loading" && salesHistory.length === 0 ? (
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
          ) : status === "failed" ? (
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
                Error: {error?.message || error || "Unknown error"}
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
        </TabPanel>
        <TabPanel value="1">
          <DashboardReports />
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
};

export default Dashboard;
