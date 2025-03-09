// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundrySummary } from "../../../redux/slices/laundrySlice"; // Adjust path as needed
// import {
//   Typography,
//   Box,
//   Paper,
//   Card,
//   CardContent,
//   Grid,
//   CircularProgress,
//   TextField,
//   Button,
// } from "@mui/material";
// import { styled } from "@mui/system";

// const StyledCard = styled(Card)(({ theme }) => ({
//   background: "#29221d",
//   color: "#fff",
//   marginBottom: theme.spacing(2),
//   "& .MuiCardContent-root": {
//     padding: theme.spacing(2),
//   },
// }));

// const LaundriesReports = () => {
//   const dispatch = useDispatch();
//   const { summary, status, error } = useSelector((state) => state.laundry);
//   const [loading, setLoading] = useState(true);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   useEffect(() => {
//     // Fetch summary when component mounts or when date or tab changes
//     dispatch(fetchLaundrySummary({ fromDate, toDate }))
//       .then(() => setLoading(false))
//       .catch(() => setLoading(false)); // Also handle errors
//   }, [dispatch, fromDate, toDate]);

//   const handleFetchSummary = () => {
//     dispatch(fetchLaundrySummary({ fromDate, toDate }));
//   };

//   useEffect(() => {
//     console.log("Summary updated:", summary);
//   }, [summary]);

//   console.log("Summary data:", summary);

//   // Loading state
//   if (loading) {
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

//   // Error state with check if error exists
//   if (status === "failed") {
//     return (
//       <Typography variant="h6" component="div" color="error">
//         {error && error.message
//           ? error.message
//           : "An error occurred while fetching data."}
//       </Typography>
//     );
//   }

//   // No data state
//   if (!summary || Object.keys(summary).length === 0) {
//     return (
//       <Typography variant="h6" component="div">
//         No summary data available.
//       </Typography>
//     );
//   }

//   // Handle noDataForRange
//   if (summary.noDataForRange) {
//     return (
//       <Typography variant="h6" component="div" color="warning.main">
//         {summary.message || "No search found for the criteria"}
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ flexGrow: 1, p: 3 }}>
//       <Box sx={{ mb: 3 }}>
//         <TextField
//           label="From Date"
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           InputLabelProps={{
//             shrink: true,
//             style: { color: "#fff" }, // Change label color to white
//           }}
//           InputProps={{
//             style: { color: "#fff" }, // Change text color to white
//           }}
//           sx={{
//             mr: 2,
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#fff", // Change border color to white
//             },
//             "& .MuiInputLabel-root": {
//               color: "#fff", // Ensure label is white when not focused
//             },
//             "& .MuiInputBase-input": {
//               color: "#fff", // Text color inside input
//             },
//           }}
//         />
//         <TextField
//           label="To Date"
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           InputLabelProps={{
//             shrink: true,
//             style: { color: "#fff" }, // Change label color to white
//           }}
//           InputProps={{
//             style: { color: "#fff" }, // Change text color to white
//           }}
//           sx={{
//             mr: 2,
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#fff", // Change border color to white
//             },
//             "& .MuiInputLabel-root": {
//               color: "#fff", // Ensure label is white when not focused
//             },
//             "& .MuiInputBase-input": {
//               color: "#fff", // Text color inside input
//             },
//             "& .MuiInputAdornment-root .MuiSvgIcon-root": {
//               color: "#fff", // Change color of the date picker icon inside InputAdornment
//             },
//           }}
//         />
//         <Button
//           variant="contained"
//           onClick={handleFetchSummary}
//           sx={{
//             backgroundColor: "#fe6c00", // Change button background to #fe6c00
//             color: "#fff", // Text color white
//             "&:hover": {
//               backgroundColor: "#fe6c00", // Keep same color on hover if you want
//               opacity: 0.8, // Optional: slightly reduce opacity for hover effect
//             },
//           }}
//         >
//           Filter
//         </Button>
//       </Box>
//       <Typography variant="h4" component="div" sx={{ mb: 3, color: "#ffffff" }}>
//         Laundry Sales Report
//       </Typography>

//       {/* Summary Overview */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={4}>
//           <StyledCard>
//             <CardContent>
//               <Typography variant="h6" component="div">
//                 Total Sales
//               </Typography>
//               <Typography variant="h5" component="div">
//                 ₦{summary.totalSales.toFixed(2)}
//               </Typography>
//             </CardContent>
//           </StyledCard>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <StyledCard>
//             <CardContent>
//               <Typography variant="h6" component="div">
//                 Total Discounts
//               </Typography>
//               <Typography variant="h5" component="div">
//                 {summary.totalDiscountCount} (₦
//                 {summary.totalDiscountSum.toFixed(2)})
//               </Typography>
//             </CardContent>
//           </StyledCard>
//         </Grid>
//       </Grid>

//       {/* Payment Methods */}
//       <Paper
//         elevation={3}
//         sx={{ p: 3, mt: 3, bgcolor: "#29221d", color: "#fff" }}
//       >
//         <Typography variant="h5" component="div" gutterBottom>
//           Payment Methods
//         </Typography>
//         {summary.paymentMethods.map((method, index) => (
//           <Box key={index} sx={{ mb: 2 }}>
//             <Typography variant="subtitle1" component="div">
//               {method.method}
//             </Typography>
//             <Typography component="div">
//               - Transactions: {method.count}
//             </Typography>
//             <Typography component="div">
//               - Total Amount: ₦{method.amount.toFixed(2)}
//             </Typography>
//             <Typography component="div">
//               - Discounts: {method.discountCount} (₦
//               {method.discountSum.toFixed(2)})
//             </Typography>
//           </Box>
//         ))}
//       </Paper>

//       {/* Payment Statuses */}
//       <Paper
//         elevation={3}
//         sx={{ p: 3, mt: 3, bgcolor: "#29221d", color: "#fff" }}
//       >
//         <Typography variant="h5" component="div" gutterBottom>
//           Payment Statuses
//         </Typography>
//         {Object.entries(summary.statusCounts).map(([status, data], index) => (
//           <Box key={index} sx={{ mb: 2 }}>
//             <Typography variant="subtitle1" component="div">
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </Typography>
//             <Typography component="div">- Count: {data.count}</Typography>
//             <Typography component="div">
//               - Amount: ₦{data.amount.toFixed(2)}
//             </Typography>
//           </Box>
//         ))}
//       </Paper>
//     </Box>
//   );
// };

// export default LaundriesReports;

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import LaundriesCharts from "../../../charts/Laundries/LaundryCharts";
// import LaundriesRevenue from "../../../charts/Laundries/LaundriesRevenue";
// import { fetchDailyLaundrySales } from "../../../redux/slices/laundrySlice"; // Adjust path

// const LaundriesReports = () => {
//   const dispatch = useDispatch();
//   const { dailySales, dailySalesStatus, dailySalesError } = useSelector(
//     (state) => state.laundry
//   );

//   // Fetch daily sales data on mount
//   useEffect(() => {
//     dispatch(fetchDailyLaundrySales({})); // Fetch today's sales
//     // Optional: dispatch(fetchDailyLaundrySales({ date: "2025-02-23" })) for a specific date
//   }, [dispatch]);

//   // Extract data from Redux state with fallback values
//   const totalSales = dailySales?.totalSales || 0;
//   const paymentMethodSales = dailySales?.paymentMethodSales || {
//     cash: 0,
//     pos: 0,
//     transfer: 0,
//     "signing credit": 0,
//     credit: 0,
//   };

//   // Prepare series data for payment methods (single value for simplicity)
//   const paymentMethods = [
//     { title: "Cash", value: paymentMethodSales.cash, key: "cash" },
//     { title: "POS", value: paymentMethodSales.pos, key: "pos" },
//     { title: "Transfer", value: paymentMethodSales.transfer, key: "transfer" },
//     {
//       title: "Signing Credit",
//       value: paymentMethodSales["signing credit"],
//       key: "signing credit",
//     },
//     { title: "Credit", value: paymentMethodSales.credit, key: "credit" },
//   ];

//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//         Dashboard
//       </Typography>

//       {/* Loading and Error States */}
//       {dailySalesStatus === "loading" && (
//         <Typography>Loading daily sales...</Typography>
//       )}
//       {dailySalesStatus === "failed" && (
//         <Typography color="error">
//           Error: {dailySalesError?.message || "Failed to load daily sales"}
//         </Typography>
//       )}

//       {/* Display Charts when Data is Available */}
//       {dailySalesStatus === "succeeded" && (
//         <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//           {/* Total Sales Chart */}
//           <LaundriesCharts
//             title="Total Sales"
//             value={`₦${totalSales.toFixed(2)}`}
//             series={[totalSales]} // Single value for total sales
//             colors={["#fe6c00"]}
//           />

//           {/* Payment Method Charts */}
//           {paymentMethods.map((method) => (
//             <LaundriesCharts
//               key={method.key}
//               title={method.title}
//               value={`₦${method.value.toFixed(2)}`}
//               series={[method.value]} // Single value for each payment method
//               colors={["#275be8"]}
//             />
//           ))}
//         </Box>
//       )}

//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       >
//         <LaundriesRevenue />
//       </Stack>
//     </Box>
//   );
// };

// export default LaundriesReports;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LaundriesCharts from "../../../charts/Laundries/LaundryCharts";
import LaundriesRevenue from "../../../charts/Laundries/LaundriesRevenue";
import { fetchDailyLaundrySales } from "../../../redux/slices/laundrySlice";

const LaundriesReports = () => {
  const dispatch = useDispatch();
  const { dailySales, dailySalesStatus, dailySalesError } = useSelector(
    (state) => state.laundry
  );

  useEffect(() => {
    if (dailySalesStatus === "idle") {
      console.log("Fetching daily laundry sales...");
      dispatch(fetchDailyLaundrySales({})); // Fetch today's sales
    }
  }, [dispatch, dailySalesStatus]);

  // Robust fallbacks
  const totalSales =
    dailySales && typeof dailySales.totalSales === "number"
      ? dailySales.totalSales
      : 0;
  const paymentMethodSales = dailySales?.paymentMethodSales || {
    cash: 0,
    pos: 0,
    transfer: 0,
    "signing credit": 0,
    credit: 0,
  };

  const paymentMethods = [
    { title: "Cash", value: paymentMethodSales.cash || 0, key: "cash" },
    { title: "POS", value: paymentMethodSales.pos || 0, key: "pos" },
    {
      title: "Transfer",
      value: paymentMethodSales.transfer || 0,
      key: "transfer",
    },
    {
      title: "Signing Credit",
      value: paymentMethodSales["signing credit"] || 0,
      key: "signing credit",
    },
    { title: "Credit", value: paymentMethodSales.credit || 0, key: "credit" },
  ];

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#fe6c00">
        Dashboard
      </Typography>

      {/* Loading and Error States */}
      {dailySalesStatus === "loading" && (
        <Typography>Loading daily sales...</Typography>
      )}
      {dailySalesStatus === "failed" && (
        <Typography color="error">
          Error: {dailySalesError?.message || "Failed to load daily sales"}
        </Typography>
      )}

      {/* Render Charts Only When Data is Valid */}
      {dailySalesStatus === "succeeded" && dailySales && (
        <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
          <LaundriesCharts
            title="Total Sales"
            value={`₦${totalSales.toFixed(2)}`}
            series={[totalSales]}
            colors={["#fe6c00"]}
          />
          {paymentMethods.map((method) => (
            <LaundriesCharts
              key={method.key}
              title={method.title}
              value={`₦${method.value.toFixed(2)}`}
              series={[method.value]}
              colors={["#275be8"]}
            />
          ))}
        </Box>
      )}

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <LaundriesRevenue />
      </Stack>
    </Box>
  );
};

export default LaundriesReports;
