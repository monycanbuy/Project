// // src/components/Reports/InventoryValueReport.jsx
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchInventoryValueByCategory } from "../../../redux/slices/inventoriesSlice";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   CircularProgress,
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   useTheme, // Import useTheme
// } from "@mui/material";

// const InventoryValueReport = () => {
//   const dispatch = useDispatch();
//   const {
//     inventoryValueByCategory,
//     inventoryValueByCategoryStatus,
//     inventoryValueByCategoryError,
//   } = useSelector((state) => state.inventories);
//   const [showTable, setShowTable] = useState(false);
//   const theme = useTheme(); // Get the current theme

//   useEffect(() => {
//     dispatch(fetchInventoryValueByCategory());
//   }, [dispatch]);

//   if (inventoryValueByCategoryStatus === "loading") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   if (inventoryValueByCategoryStatus === "failed") {
//     return (
//       <Typography color="error">
//         Error: {inventoryValueByCategoryError}
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ padding: 3 }}>
//       {" "}
//       {/* Add padding around the entire component */}
//       <Typography
//         variant="h4"
//         gutterBottom
//         component="div"
//         sx={{ color: theme.palette.primary.main }}
//       >
//         Inventory Value by Category
//       </Typography>
//       <Box sx={{ mb: 2 }}>
//         <Button
//           variant="contained"
//           onClick={() => setShowTable(!showTable)}
//           sx={{
//             backgroundColor: "#fe6c00",
//             color: "#fff",
//             "&:hover": {
//               backgroundColor: "#fec80a",
//               color: "#bdbabb",
//             },
//           }}
//         >
//           {showTable ? "Show Chart" : "Show Table"}
//         </Button>
//       </Box>
//       {showTable ? (
//         <TableContainer
//           component={Paper}
//           elevation={3}
//           sx={{ marginBottom: "20px" }}
//         >
//           <Table sx={{ minWidth: 650 }} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Category</TableCell>
//                 <TableCell align="right">Total Value</TableCell>
//                 <TableCell align="right">Location</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {inventoryValueByCategory.map((item, index) => (
//                 <TableRow
//                   key={index}
//                   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                 >
//                   <TableCell component="th" scope="row">
//                     {item.category}
//                   </TableCell>
//                   <TableCell align="right">{item.totalValue}</TableCell>
//                   <TableCell align="right">{item.location}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <Paper
//           elevation={3}
//           sx={{ width: "100%", height: 400, padding: 2, marginBottom: "20px" }}
//         >
//           {" "}
//           {/* Wrap in Paper */}
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={inventoryValueByCategory}
//               margin={{
//                 top: 5,
//                 right: 30,
//                 left: 20,
//                 bottom: 5,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="category" stroke={theme.palette.text.secondary} />
//               <YAxis
//                 tickFormatter={(value) => `$${value.toFixed(2)}`}
//                 stroke={theme.palette.text.secondary}
//               />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="totalValue" fill="#8884d8" name="Total Value" />
//             </BarChart>
//           </ResponsiveContainer>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default InventoryValueReport;

// import { Box, Stack, Typography } from "@mui/material";
// import React from "react";
// import PieChart from "../../../charts/PieChart";
// import TotalRevenue from "../../../charts/TotalRevenue";
// import Cards from "../../Cards/Cards";
// import PropertyReferrals from "../../../charts/PropertyReferrals";

// const InventoryValueReport = () => {
//   return (
//     <Box>
//       <Typography fontSize={20} fontWeight={700} color="#fe6c00">
//         Dashboard
//       </Typography>
//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         <PieChart
//           title="Properties for Sale"
//           value={684}
//           series={[75, 25]}
//           colors={["#fe6c00", "#275be8"]}
//         />
//         <PieChart
//           title="Properties for Rent"
//           value={550}
//           series={[60, 40]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <PieChart
//           title="Total customers"
//           value={5684}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <PieChart
//           title="Properties for Cities"
//           value={555}
//           series={[75, 25]}
//           colors={["#bcb308", "#c4e8ef"]}
//         />
//       </Box>
//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       >
//         <TotalRevenue />
//         <PropertyReferrals />
//       </Stack>
//     </Box>
//   );
// };

// export default InventoryValueReport;

//src / components / Reports / InventoryValueReport.jsx;
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchTotalInventoryCount,
//   fetchTotalInventoryValue,
//   fetchLowStockReport,
//   fetchNearExpiryReport,
// } from "../../../redux/slices/inventoriesSlice"; //  correct path
// import { Box, Stack, Typography, CircularProgress } from "@mui/material";
// import PieChart from "../../../charts/PieChart"; //  correct pathMake sure this path is correct
// import TotalRevenue from "../../../charts/TotalRevenue";
//import TotalRevenue from "../../../charts/TotalRevenue"; // You'll need to create/adapt this
//import Cards from "../../Cards/Cards"; // You'll likely integrate data into cards here
//import PropertyReferrals from "../../../charts/PropertyReferrals"; // This seems unrelated to inventory

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
//   } = useSelector((state) => state.inventories);

//   useEffect(() => {
//     dispatch(fetchTotalInventoryCount());
//     dispatch(fetchTotalInventoryValue());
//     dispatch(fetchLowStockReport());
//     dispatch(fetchNearExpiryReport(30)); // Fetch with default 30 days, or get from props
//   }, [dispatch]);

//   if (
//     totalInventoryCountStatus === "loading" ||
//     totalInventoryValueStatus === "loading" ||
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
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (
//     totalInventoryCountError ||
//     totalInventoryValueError ||
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
//         {lowStockReportError && (
//           <Typography color="error">Error: {lowStockReportError}</Typography>
//         )}
//         {nearExpiryReportError && (
//           <Typography color="error">Error: {nearExpiryReportError}</Typography>
//         )}
//       </div>
//     );
//   }

//   //prepare data for pie chart
//   const pieChartData = [
//     {
//       title: "Total Inventory Items",
//       value: totalInventoryCount,
//       series: [totalInventoryCount, 0], // No "other" part for total count
//       colors: ["#0088FE", "#e0e0e0"],
//     },
//     {
//       title: "Total Inventory Value (₦)",
//       value: totalInventoryValue.toFixed(2),
//       series: [totalInventoryValue, 0], // No "other" part for total value
//       colors: ["#00C49F", "#e0e0e0"],
//     },
//     {
//       title: "Low Stock Items",
//       value: lowStockReport.length,
//       series: [lowStockReport.length, 100 - lowStockReport.length], // Example: Placeholder for "other"
//       colors: ["#FFBB28", "#e0e0e0"],
//     },
//     {
//       title: "Near Expiry Items",
//       value: nearExpiryReport.length,
//       series: [nearExpiryReport.length, 100 - nearExpiryReport.length],
//       colors: ["#FF8042", "#e0e0e0"], // Example colors
//     },
//   ];

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom component="div">
//         Inventory Dashboard
//       </Typography>
//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         {pieChartData.map((data, index) => (
//           <PieChart
//             key={index} // Use index as key (since titles might not be unique)
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
//         {/* <TotalRevenue /> // You'll need to implement/adapt these */}
//         {/* <PropertyReferrals /> */}
//       </Stack>
//     </Box>
//   );
// };

// export default InventoryDashboard;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchTotalInventoryAndSales, // Use the combined thunk
//   fetchLowStockReport,
//   fetchNearExpiryReport,
//   fetchTotalInventoryCount,
// } from "../../../redux/slices/inventoriesSlice"; // Correct path
// import {
//   Box,
//   Stack,
//   Typography,
//   CircularProgress,
//   Grid,
//   Card,
//   CardContent,
// } from "@mui/material";
// import PieChart from "../../../charts/PieChart"; //  Make sure this path is correct
// // import TotalRevenue from "../../../charts/TotalRevenue"; // You'll need to create/adapt this
// // import Cards from "../../Cards/Cards"; // You'll likely integrate data into cards here
// // import PropertyReferrals from "../../../charts/PropertyReferrals"; // This seems unrelated to inventory

// const InventoryDashboard = () => {
//   // Renamed component
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
//     totalDailySales, // Get from Redux
//     totalDailySalesStatus,
//     totalDailySalesError,
//   } = useSelector((state) => state.inventories);

//   useEffect(() => {
//     dispatch(fetchTotalInventoryAndSales()); // Fetch combined data
//     dispatch(fetchLowStockReport());
//     dispatch(fetchNearExpiryReport(30));
//     dispatch(fetchTotalInventoryCount());
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
//         <CircularProgress />
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
//       </div>
//     );
//   }

//   // Prepare data for pie charts (as before, but with more descriptive names)
//   const pieChartData = [
//     {
//       title: "Total Items",
//       value: totalInventoryCount,
//       series: [totalInventoryCount, 0], // No "other" part for total count
//       colors: ["#0088FE", "#e0e0e0"],
//     },
//     {
//       title: "Total Value (₦)",
//       value: totalInventoryValue.toFixed(2), // Format as currency
//       series: [totalInventoryValue, 0], // No "other" part for total value
//       colors: ["#00C49F", "#e0e0e0"],
//     },
//     {
//       title: "Total Sales (₦)",
//       value: totalDailySales.toFixed(2),
//       series: [totalDailySales, 0], // Assuming you want a pie chart for this
//       colors: ["#e86f1d", "#e0e0e0"],
//     },
//     {
//       title: "Low Stock",
//       value: lowStockReport.length,
//       series: [
//         lowStockReport.length,
//         Math.max(0, totalInventoryCount - lowStockReport.length),
//       ], // Avoid negative values
//       colors: ["#FFBB28", "#e0e0e0"],
//     },

//     {
//       title: "Near Expiry",
//       value: nearExpiryReport.length,
//       series: [
//         nearExpiryReport.length,
//         Math.max(0, totalInventoryCount - nearExpiryReport.length),
//       ],
//       colors: ["#FF8042", "#e0e0e0"], // Example colors
//     },
//   ];

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Inventory Dashboard
//       </Typography>

//       <Grid container spacing={3}>
//         {pieChartData.map((data, index) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//             <Card elevation={3} sx={{ height: "100%" }}>
//               <CardContent>
//                 <PieChart
//                   title={data.title}
//                   value={data.value}
//                   series={data.series}
//                   colors={data.colors}
//                 />
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Other report sections can go here, using Grid for layout */}
//     </Box>
//   );
// };

// export default InventoryDashboard; // Renamed component

// src/components/Reports/InventoryDashboard.jsx

// // src/components/Reports/InventoryDashboard.jsx
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchTotalInventoryCount,
//   fetchTotalInventoryValue,
//   fetchLowStockReport,
//   fetchNearExpiryReport,
//   fetchTotalDailySales, // Import the *separate* thunk for daily sales
// } from "../../../redux/slices/inventoriesSlice"; //  correct path

// import {
//   Box,
//   Stack,
//   Typography,
//   CircularProgress,
//   Grid,
//   Card,
//   CardContent,
// } from "@mui/material";
// import PieChart from "../../../charts/PieChart"; //  Make sure this path is correct
// import TotalRevenue from "../../../charts/TotalRevenue"; // Import TotalRevenue

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
//     totalDailySales, // Get from Redux
//     totalDailySalesStatus, // Get status
//     totalDailySalesError, // Get error
//   } = useSelector((state) => state.inventories);

//   useEffect(() => {
//     dispatch(fetchTotalInventoryCount());
//     dispatch(fetchTotalInventoryValue()); // Fetch total inventory value
//     dispatch(fetchLowStockReport());
//     dispatch(fetchNearExpiryReport(30));
//     dispatch(fetchTotalDailySales()); // Fetch daily sales (last 7 days by default)
//   }, [dispatch]);

//   // --- Loading State ---
//   if (
//     totalInventoryCountStatus === "loading" ||
//     totalInventoryValueStatus === "loading" ||
//     lowStockReportStatus === "loading" ||
//     nearExpiryReportStatus === "loading" ||
//     totalDailySalesStatus === "loading" // Check loading status
//   ) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="200px"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // --- Error State ---
//   if (
//     totalInventoryCountError ||
//     totalInventoryValueError ||
//     lowStockReportError ||
//     nearExpiryReportError ||
//     totalDailySalesError
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
//         {lowStockReportError && (
//           <Typography color="error">Error: {lowStockReportError}</Typography>
//         )}
//         {nearExpiryReportError && (
//           <Typography color="error">Error: {nearExpiryReportError}</Typography>
//         )}
//         {totalDailySalesError && (
//           <Typography color="error">Error: {totalDailySalesError}</Typography>
//         )}{" "}
//         {/* Display daily sales error */}
//       </div>
//     );
//   }
//   // Calculate total sales from the daily sales data (handle null/undefined)
//   const totalSalesValue = Array.isArray(totalDailySales)
//     ? totalDailySales.reduce((sum, item) => sum + (item.totalSales || 0), 0)
//     : 0;

//   // Prepare data for pie charts (as before, but with more descriptive names)
//   const pieChartData = [
//     {
//       title: "Total Items",
//       value: totalInventoryCount,
//       series: [totalInventoryCount, 0], // No "other" part for total count
//       colors: ["#0088FE", "#e0e0e0"],
//     },
//     {
//       title: "Total Value (₦)",
//       value: totalInventoryValue.toFixed(2), // Format as currency
//       series: [totalInventoryValue, 0], // No "other" part for total value
//       colors: ["#00C49F", "#e0e0e0"],
//     },
//     {
//       title: "Total Sales (₦)",
//       value: totalSalesValue.toFixed(2), // Use calculated total
//       series: [totalSalesValue, 0], // Assuming you want a pie chart for this
//       colors: ["#e86f1d", "#e0e0e0"],
//     },
//     {
//       title: "Low Stock",
//       value: lowStockReport.length,
//       series: [
//         lowStockReport.length,
//         Math.max(0, totalInventoryCount - lowStockReport.length),
//       ], // Avoid negative values
//       colors: ["#FFBB28", "#e0e0e0"],
//     },

//     {
//       title: "Near Expiry",
//       value: nearExpiryReport.length,
//       series: [
//         nearExpiryReport.length,
//         Math.max(0, totalInventoryCount - nearExpiryReport.length),
//       ],
//       colors: ["#FF8042", "#e0e0e0"], // Example colors
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

//       <Grid container spacing={3}>
//         {pieChartData.map((data, index) => (
//           <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//             <Card elevation={3} sx={{ height: "100%" }}>
//               <CardContent>
//                 <PieChart
//                   title={data.title}
//                   value={data.value}
//                   series={data.series}
//                   colors={data.colors}
//                 />
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       >
//         <TotalRevenue />
//       </Stack>
//     </Box>
//   );
// };

// export default InventoryDashboard;

// src/components/Reports/InventoryDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalInventoryCount,
  fetchTotalInventoryValue,
  fetchLowStockReport,
  fetchNearExpiryReport,
  fetchTotalDailySales,
} from "../../../redux/slices/inventoriesSlice";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import PieChart from "../../../charts/PieChart";
import TotalRevenue from "../../../charts/TotalRevenue";
import TopSellingItems from "../../../charts/TopSellingItems";

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalInventoryCount,
    totalInventoryCountStatus,
    totalInventoryCountError,
    totalInventoryValue,
    totalInventoryValueStatus,
    totalInventoryValueError,
    lowStockReport,
    lowStockReportStatus,
    lowStockReportError,
    nearExpiryReport,
    nearExpiryReportStatus,
    nearExpiryReportError,
    totalDailySales,
    totalDailySalesStatus,
    totalDailySalesError,
  } = useSelector((state) => {
    console.log("Redux State:", state.inventories); // Debug state
    return state.inventories;
  });

  useEffect(() => {
    dispatch(fetchTotalInventoryCount());
    dispatch(fetchTotalInventoryValue());
    dispatch(fetchLowStockReport());
    dispatch(fetchNearExpiryReport(30));
    dispatch(fetchTotalDailySales()); // Ensure this fetches today's sales
  }, [dispatch]);

  if (
    totalInventoryCountStatus === "loading" ||
    totalInventoryValueStatus === "loading" ||
    totalDailySalesStatus === "loading" ||
    lowStockReportStatus === "loading" ||
    nearExpiryReportStatus === "loading"
  ) {
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

  if (
    totalInventoryCountError ||
    totalInventoryValueError ||
    totalDailySalesError ||
    lowStockReportError ||
    nearExpiryReportError
  ) {
    return (
      <div>
        {totalInventoryCountError && (
          <Typography color="error">
            Error: {totalInventoryCountError}
          </Typography>
        )}
        {totalInventoryValueError && (
          <Typography color="error">
            Error: {totalInventoryValueError}
          </Typography>
        )}
        {totalDailySalesError && (
          <Typography color="error">Error: {totalDailySalesError}</Typography>
        )}
        {lowStockReportError && (
          <Typography color="error">Error: {lowStockReportError}</Typography>
        )}
        {nearExpiryReportError && (
          <Typography color="error">Error: {nearExpiryReportError}</Typography>
        )}
      </div>
    );
  }

  // Format totalDailySales for display
  const formattedTotalDailySales = totalDailySales
    ? totalDailySales.toFixed(2)
    : "0.00";

  const totalSalesValue = Array.isArray(totalDailySales)
    ? totalDailySales.reduce((sum, item) => sum + (item.totalSales || 0), 0)
    : 0;

  const pieChartData = [
    {
      title: "Total Value (₦)",
      value: totalInventoryValue ? totalInventoryValue.toFixed(2) : "0.00",
      series: [totalInventoryValue || 0, 0],
      colors: ["#00C49F", "#e0e0e0"],
    },
    {
      title: "Total Items",
      value: totalInventoryCount,
      series: [totalInventoryCount || 0, 0],
      colors: ["#0088FE", "#e0e0e0"],
    },
    {
      title: "Total Sales Today (₦)",
      value: totalSalesValue.toFixed(2), // Use calculated total
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
