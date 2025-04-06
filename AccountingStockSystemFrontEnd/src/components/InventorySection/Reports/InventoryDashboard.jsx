// // src/components/Reports/InventoryDashboard.jsx
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchTotalInventoryCount,
//   fetchTotalInventoryValue,
//   fetchLowStockReport,
//   fetchNearExpiryReport,
//   fetchTotalDailySales,
// } from "../../../redux/slices/inventoriesSlice";
// import { Box, Stack, Typography, CircularProgress } from "@mui/material";
// import PieChart from "../../../charts/PieChart";
// import TotalRevenue from "../../../charts/TotalRevenue";
// import TopSellingItems from "../../../charts/TopSellingItems";

// const InventoryDashboard = () => {
//   const dispatch = useDispatch();
//   const {
//     totalInventoryCount,
//     totalInventoryCountStatus,
//     totalInventoryCountError,
//     totalInventoryValue,
//     totalInventoryValueStatus,
//     totalInventoryValueError,
//     lowStockReport,
//     lowStockReportStatus,
//     lowStockReportError,
//     nearExpiryReport,
//     nearExpiryReportStatus,
//     nearExpiryReportError,
//     totalDailySales,
//     totalDailySalesStatus,
//     totalDailySalesError,
//   } = useSelector((state) => {
//     console.log("Redux State:", state.inventories); // Debug state
//     return state.inventories;
//   });

//   useEffect(() => {
//     dispatch(fetchTotalInventoryCount());
//     dispatch(fetchTotalInventoryValue());
//     dispatch(fetchLowStockReport());
//     dispatch(fetchNearExpiryReport(30));
//     dispatch(fetchTotalDailySales()); // Ensure this fetches today's sales
//   }, [dispatch]);

//   if (
//     totalInventoryCountStatus === "loading" ||
//     totalInventoryValueStatus === "loading" ||
//     totalDailySalesStatus === "loading" ||
//     lowStockReportStatus === "loading" ||
//     nearExpiryReportStatus === "loading"
//   ) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="200px"
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   if (
//     totalInventoryCountError ||
//     totalInventoryValueError ||
//     totalDailySalesError ||
//     lowStockReportError ||
//     nearExpiryReportError
//   ) {
//     return (
//       <div>
//         {totalInventoryCountError && (
//           <Typography color="error">
//             Error: {totalInventoryCountError}
//           </Typography>
//         )}
//         {totalInventoryValueError && (
//           <Typography color="error">
//             Error: {totalInventoryValueError}
//           </Typography>
//         )}
//         {totalDailySalesError && (
//           <Typography color="error">Error: {totalDailySalesError}</Typography>
//         )}
//         {lowStockReportError && (
//           <Typography color="error">Error: {lowStockReportError}</Typography>
//         )}
//         {nearExpiryReportError && (
//           <Typography color="error">Error: {nearExpiryReportError}</Typography>
//         )}
//       </div>
//     );
//   }

//   // Format totalDailySales for display
//   const formattedTotalDailySales = totalDailySales
//     ? totalDailySales.toFixed(2)
//     : "0.00";

//   const totalSalesValue = Array.isArray(totalDailySales)
//     ? totalDailySales.reduce((sum, item) => sum + (item.totalSales || 0), 0)
//     : 0;

//   const pieChartData = [
//     {
//       title: "Total Value (₦)",
//       value: totalInventoryValue ? totalInventoryValue.toFixed(2) : "0.00",
//       series: [totalInventoryValue || 0, 0],
//       colors: ["#00C49F", "#e0e0e0"],
//     },
//     {
//       title: "Total Items",
//       value: totalInventoryCount,
//       series: [totalInventoryCount || 0, 0],
//       colors: ["#0088FE", "#e0e0e0"],
//     },
//     {
//       title: "Total Sales Today (₦)",
//       value: totalSalesValue.toFixed(2), // Use calculated total
//       series: [totalSalesValue, 0],
//       colors: ["#e86f1d", "#e0e0e0"],
//     },
//     {
//       title: "Low Stock",
//       value: lowStockReport.length,
//       series: [
//         lowStockReport.length,
//         Math.max(0, totalInventoryCount - lowStockReport.length),
//       ],
//       colors: ["#FFBB28", "#e0e0e0"],
//     },
//     {
//       title: "Near Expiry",
//       value: nearExpiryReport.length,
//       series: [
//         nearExpiryReport.length,
//         Math.max(0, totalInventoryCount - nearExpiryReport.length),
//       ],
//       colors: ["#FF8042", "#e0e0e0"],
//     },
//   ];

//   return (
//     <Box p={3}>
//       <Typography
//         variant="h4"
//         gutterBottom
//         fontSize={25}
//         fontWeight={700}
//         color="#fcfcfc"
//       >
//         Inventory Dashboard
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         {pieChartData.map((data, index) => (
//           <PieChart
//             key={index}
//             title={data.title}
//             value={data.value}
//             series={data.series}
//             colors={data.colors}
//           />
//         ))}
//       </Box>
//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       >
//         <TotalRevenue />
//         <TopSellingItems />
//       </Stack>
//     </Box>
//   );
// };

// export default InventoryDashboard;

// src/components/Reports/InventoryDashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalInventoryCount,
  fetchTotalInventoryValue,
  fetchLowStockReport,
  fetchNearExpiryReport,
  fetchTotalDailySales,
} from "../../../redux/slices/inventoriesSlice";
import { checkAuthStatus } from "../../../redux/slices/authSlice";
import {
  Box,
  Stack,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import PieChart from "../../../charts/PieChart";
import TotalRevenue from "../../../charts/TotalRevenue";
import TopSellingItems from "../../../charts/TopSellingItems";

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalInventoryCount = 0,
    totalInventoryCountStatus = "idle",
    totalInventoryCountError,
    totalInventoryValue = 0,
    totalInventoryValueStatus = "idle",
    totalInventoryValueError,
    lowStockReport = [],
    lowStockReportStatus = "idle",
    lowStockReportError,
    nearExpiryReport = [],
    nearExpiryReportStatus = "idle",
    nearExpiryReportError,
    totalDailySales = 0,
    totalDailySalesStatus = "idle",
    totalDailySalesError,
  } = useSelector((state) => {
    //console.log("Redux State:", state.inventories);
    return state.inventories || {};
  });
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("InventoryDashboard - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching dashboard data...");
        dispatch(fetchTotalInventoryCount());
        dispatch(fetchTotalInventoryValue());
        dispatch(fetchLowStockReport());
        dispatch(fetchNearExpiryReport(30));
        dispatch(fetchTotalDailySales());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching dashboard data...");
            dispatch(fetchTotalInventoryCount());
            dispatch(fetchTotalInventoryValue());
            dispatch(fetchLowStockReport());
            dispatch(fetchNearExpiryReport(30));
            dispatch(fetchTotalDailySales());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            //console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  const isLoading = [
    totalInventoryCountStatus,
    totalInventoryValueStatus,
    lowStockReportStatus,
    nearExpiryReportStatus,
    totalDailySalesStatus,
  ].some((status) => status === "loading");

  const errors = {
    totalInventoryCountError,
    totalInventoryValueError,
    lowStockReportError,
    nearExpiryReportError,
    totalDailySalesError,
  };
  const hasError = Object.values(errors).some((error) => error);

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view the dashboard.
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
      </Box>
    );
  }

  if (hasError) {
    return (
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
          {totalInventoryCountError &&
            `Total Count Error: ${
              totalInventoryCountError.message || totalInventoryCountError
            }`}
          {totalInventoryValueError &&
            `Total Value Error: ${
              totalInventoryValueError.message || totalInventoryValueError
            }`}
          {lowStockReportError &&
            `Low Stock Error: ${
              lowStockReportError.message || lowStockReportError
            }`}
          {nearExpiryReportError &&
            `Near Expiry Error: ${
              nearExpiryReportError.message || nearExpiryReportError
            }`}
          {totalDailySalesError &&
            `Daily Sales Error: ${
              totalDailySalesError.message || totalDailySalesError
            }`}
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
    );
  }

  const totalSalesValue = Array.isArray(totalDailySales)
    ? totalDailySales.reduce((sum, item) => sum + (item.totalSales || 0), 0)
    : totalDailySales || 0;

  const pieChartData = [
    {
      title: "Total Value (₦)",
      value: totalInventoryValue.toFixed(2),
      series: [totalInventoryValue, 0],
      colors: ["#00C49F", "#e0e0e0"],
    },
    {
      title: "Total Items",
      value: totalInventoryCount,
      series: [totalInventoryCount, 0],
      colors: ["#0088FE", "#e0e0e0"],
    },
    {
      title: "Total Sales Today (₦)",
      value: totalSalesValue.toFixed(2),
      series: [totalSalesValue, 0],
      colors: ["#e86f1d", "#e0e0e0"],
    },
    {
      title: "Low Stock",
      value: lowStockReport.length,
      series: [
        lowStockReport.length,
        Math.max(0, totalInventoryCount - lowStockReport.length),
      ],
      colors: ["#FFBB28", "#e0e0e0"],
    },
    {
      title: "Near Expiry",
      value: nearExpiryReport.length,
      series: [
        nearExpiryReport.length,
        Math.max(0, totalInventoryCount - nearExpiryReport.length),
      ],
      colors: ["#FF8042", "#e0e0e0"],
    },
  ];

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        gutterBottom
        fontSize={25}
        fontWeight={700}
        color="#fcfcfc"
      >
        Inventory Dashboard
      </Typography>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        {pieChartData.map((data, index) => (
          <PieChart
            key={index}
            title={data.title}
            value={data.value}
            series={data.series}
            colors={data.colors}
          />
        ))}
      </Box>
      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <TotalRevenue />
        <TopSellingItems />
      </Stack>
    </Box>
  );
};

export default InventoryDashboard;
