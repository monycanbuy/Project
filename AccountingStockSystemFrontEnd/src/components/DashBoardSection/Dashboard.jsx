// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
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
//   ); // Changed to salesHistory

//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     console.log("Fetching daily sales history...");
//     dispatch(fetchDailySalesHistory());

//     // Poll every 30 seconds for live updates
//     const interval = setInterval(() => {
//       console.log("Polling for updated sales history...");
//       dispatch(fetchDailySalesHistory());
//     }, 30000);

//     return () => clearInterval(interval); // Cleanup on unmount
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
//     { name: "Date", label: "Date" },
//     { name: "Laundry", label: "Laundry" },
//     // { name: "Kabsa", label: "Kabsa" },
//     { name: "HallTransaction", label: "Hall Transaction" },
//     { name: "FrontOfficeSale", label: "Front Office Sale" },
//     { name: "Seminar", label: "Seminar" },
//     { name: "Total of Minimart&Restaurant", label: "Minimart & Restaurant" },
//     { name: "TotalAmount", label: "Total Amount" },
//   ];

//   const data = Array.isArray(salesHistory)
//     ? salesHistory.map((item) => {
//         return columns.map((col) =>
//           col.name === "Date"
//             ? item[col.name]
//             : numberFormatter.format(item[col.name] || 0)
//         );
//       })
//     : [];

//   const totals = data.reduce((acc, row) => {
//     row.slice(1).forEach((value, index) => {
//       acc[index] =
//         (acc[index] || 0) + parseFloat(value.replace(/[^0-9.-]+/g, ""));
//     });
//     return acc;
//   }, []);

//   data.push([
//     "Totals",
//     ...totals.map((value) => numberFormatter.format(value)),
//   ]);

//   const options = {
//     filterType: "checkbox",
//   };

//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//           width: "100%",
//         }}
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

//   if (status === "loading" && salesHistory.length === 0) {
//     // Only show loading initially
//     return (
//       <ThemeProvider theme={createTheme()}>
//         <MUIDataTable
//           title={"Daily Sales Report"}
//           data={loadingData}
//           columns={[{ name: "Loading", label: "Loading" }]}
//           options={{
//             ...options,
//             download: false,
//             print: false,
//             viewColumns: false,
//           }}
//         />
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

//   const theme = createTheme({
//     components: {
//       MUIDataTable: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
//             "& .MuiTableRow-root": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiTableCell-root": { color: "#bdbabb" },
//               },
//             },
//             "& .MuiTableCell-root": { color: "#fff", fontSize: "18px" },
//             "& .MuiTableRow-head": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiTableCell-root": {
//                 color: "#000",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               },
//             },
//             "& .MuiToolbar-root": {
//               backgroundColor: "#d0d0d0",
//               "& .MuiTypography-root": { fontSize: "18px" },
//               "& .MuiIconButton-root": { color: "#3f51b5" },
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
//           <MUIDataTable
//             title={"Daily Sales Report"}
//             data={data}
//             columns={columns.map((col, index) => ({
//               ...col,
//               options: {
//                 sort: col.name === "Date", // Fixed sort condition
//                 customBodyRender: (value) => value,
//                 setCellProps: () => ({
//                   style: {
//                     textAlign: index === 0 ? "left" : "center",
//                   },
//                 }),
//               },
//             }))}
//             options={options}
//           />
//         </TabPanel>
//         <TabPanel value="1">
//           <DashboardReports />s
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress, Box, Tab, Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DashboardReports from "./Reports/DashboardReports";
import Typography from "@mui/material/Typography";
import { fetchDailySalesHistory } from "../../redux/slices/aggregateSalesSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { salesHistory, status, error } = useSelector(
    (state) => state.aggregateSales
  );
  const [value, setValue] = useState("0");

  useEffect(() => {
    console.log("Fetching daily sales history...");
    dispatch(fetchDailySalesHistory());

    const interval = setInterval(() => {
      console.log("Polling for updated sales history...");
      dispatch(fetchDailySalesHistory());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    console.log("Redux state:", { salesHistory, status, error });
  }, [salesHistory, status, error]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRefresh = () => {
    console.log("Manual refresh triggered...");
    dispatch(fetchDailySalesHistory());
  };

  const numberFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const columns = [
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
  ];

  const data = Array.isArray(salesHistory)
    ? salesHistory
        .filter((item) => item && (item.date || item.Date)) // Handle both 'date' and 'Date'
        .map((item, index) => {
          console.log("Mapping item:", item);
          const date = item.date || item.Date || `row-${index}`; // Fallback for date
          return {
            id: date, // Use date as ID, fallback to index-based
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

  console.log("Processed data:", data); // Log the final data array

  const totals = data.reduce((acc, row) => {
    Object.keys(row).forEach((key, index) => {
      if (index > 0) {
        // Skip 'id'
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
  console.log("Rows for DataGrid:", rows); // Log the rows array

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
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
            "& .MuiData GreeceGrid-toolbarContainer": {
              backgroundColor: "#d0d0d0",
              "& .MuiButton-root": { color: "#3f51b5" },
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

  if (status === "loading" && salesHistory.length === 0) {
    return (
      <ThemeProvider theme={createTheme()}>
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
      </ThemeProvider>
    );
  }

  if (status === "failed") {
    return (
      <Box sx={{ color: "red", textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Error: {error || "Unknown error"}</Typography>
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
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
            />
          </Box>
        </TabPanel>
        <TabPanel value="1">
          <DashboardReports />
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
};

export default Dashboard;
