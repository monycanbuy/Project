// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchHallSummary } from "../../../redux/slices/hallSlice"; // Adjust path as needed
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

// const HallReports = () => {
//   const dispatch = useDispatch();
//   const { summary, status, error } = useSelector(
//     (state) => state.hallTransactions
//   );
//   const [loading, setLoading] = useState(true);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   useEffect(() => {
//     // Fetch summary when component mounts or when date changes
//     dispatch(fetchHallSummary({ fromDate, toDate }))
//       .then(() => setLoading(false))
//       .catch(() => setLoading(false)); // Also handle errors
//   }, [dispatch, fromDate, toDate]);

//   const handleFetchSummary = () => {
//     dispatch(fetchHallSummary({ fromDate, toDate }));
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
//         Hall Sales Report
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

// export default HallReports;

// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import HallCharts from "../../../charts/Hall/HallCharts";

// const HallReports = () => {
//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#11142D">
//         Dashboard
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         <HallCharts
//           title="Properties for Sale"
//           value={684}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <HallCharts
//           title="Properties for Rent"
//           value={550}
//           series={[60, 40]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <HallCharts
//           title="Total customers"
//           value={5684}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <HallCharts
//           title="Properties for Cities"
//           value={555}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//       </Box>

//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       ></Stack>
//     </Box>
//   );
// };

// export default HallReports;

// src/components/HallReports.jsx
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PieChart from "../../../charts/Hall/HallCharts"; // Adjust path (assuming similar to SeminarCharts)
import { fetchHallDailySalesByEventType } from "../../../redux/slices/hallSlice"; // Adjust path
import HallRevenue from "../../../charts/Hall/HallRevenue";
import HallPaymentMethod from "../../../charts/HallPaymentMethod";

const HallReports = () => {
  const dispatch = useDispatch();
  const { hallDailySales, hallDailySalesStatus, hallDailySalesError } =
    useSelector((state) => state.hallTransactions);

  useEffect(() => {
    dispatch(fetchHallDailySalesByEventType({}));
  }, [dispatch]);

  const totalSales = hallDailySales?.totalSales || 0;
  const eventSales = hallDailySales?.eventSales || {};
  const eventTypes = [
    { name: "Conference", value: eventSales.conference || 0 },
    { name: "Workshop", value: eventSales.workshop || 0 },
    { name: "Webinar", value: eventSales.webinar || 0 },
    { name: "Wedding", value: eventSales.Wedding || 0 },
  ];

  // For "Total Sales", use totalSales vs. a max value (e.g., 100 or totalSales itself)
  const totalSalesSeries = [totalSales, totalSales > 0 ? 100 - totalSales : 0]; // Example max of 100

  return (
    <Box>
      <Typography fontSize={20} fontWeight={700} color="#fe6c00">
        Hall Transaction Dashboard
      </Typography>

      {hallDailySalesStatus === "loading" && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt="20px"
        >
          <CircularProgress size={40} sx={{ color: "#fe6c00" }} />
        </Box>
      )}
      {hallDailySalesStatus === "succeeded" && hallDailySales && (
        <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
          {/* Total Sales Pie Chart as Donut */}
          <PieChart
            title="Total Sales"
            value={`₦${totalSales.toFixed(2)}`}
            series={totalSalesSeries} // Two values for donut effect
            colors={["#fe6c00", "#e0e0e0"]} // Filled vs. unfilled
          />
          {/* Individual Event Type Pie Charts as Donuts */}
          {eventTypes.map((event, index) => (
            <PieChart
              key={index}
              title={event.name}
              value={`₦${event.value.toFixed(2)}`}
              series={[
                event.value,
                totalSales > 0 ? totalSales - event.value : 0,
              ]} // Donut: value vs. remainder
              colors={["#e827b5", "#e0e0e0"]} // Filled vs. unfilled
            />
          ))}
        </Box>
      )}
      {hallDailySalesStatus === "failed" && (
        <Typography color="error" mt="20px">
          Error loading sales data:{" "}
          {hallDailySalesError?.message || "Unknown error"}
        </Typography>
      )}

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <HallRevenue />
        <HallPaymentMethod />
      </Stack>
    </Box>
  );
};

export default HallReports;
