// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import AdminCharts from "../../../charts/AdminBoard/AdminCharts";

// const DashboardReports = () => {
//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#11142D">
//         Dashboard
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         <AdminCharts
//           title="Properties for Sale"
//           value={684}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <AdminCharts
//           title="Properties for Rent"
//           value={550}
//           series={[60, 40]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <AdminCharts
//           title="Total customers"
//           value={5684}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <AdminCharts
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

// export default DashboardReports;

// import React, { useEffect } from "react";
// import { Typography, Box, Stack, CircularProgress } from "@mui/material";
// import AdminCharts from "../../../charts/AdminBoard/AdminCharts";
// import { useDispatch, useSelector } from "react-redux";
// import { getDailySalesReport } from "../../../redux/slices/aggregateSalesSlice";
// import { Toaster } from "react-hot-toast";

// const DashboardReports = () => {
//   const dispatch = useDispatch();
//   const { dailySalesReport, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );

//   useEffect(() => {
//     dispatch(getDailySalesReport());
//   }, [dispatch]);

//   if (status === "loading") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <Box>
//         <Typography color="error">
//           Error fetching daily sales report: {error.message}
//           {error.status && (
//             <Typography color="error">Status Code: {error.status}</Typography>
//           )}
//         </Typography>
//         <Toaster />
//       </Box>
//     );
//   }

//   if (status === "succeeded" && dailySalesReport && dailySalesReport.data) {
//     const { overallDailySales, departments } = dailySalesReport.data;

//     return (
//       <Box>
//         <Typography fontSize={25} fontWeight={700} color="#11142D">
//           Dashboard
//         </Typography>

//         <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//           <AdminCharts
//             title="Overall Daily Sales"
//             value={overallDailySales}
//             series={[75, 25]}
//             colors={["#275be8", "#c4e8ef"]}
//           />
//           {Object.entries(departments || {}).map(([deptName, deptData]) => (
//             <AdminCharts
//               key={deptName}
//               title={deptName}
//               value={deptData.totalSales}
//               series={[60, 40]}
//               colors={["#275be8", "#c4e8ef"]}
//             />
//           ))}
//         </Box>

//         <Stack
//           mt="25px"
//           width="100%"
//           direction={{ xs: "column", lg: "row" }}
//           gap={4}
//         />
//         <Toaster />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Typography>No sales data available for today.</Typography>
//       <Toaster />
//     </Box>
//   );
// };

// export default DashboardReports;

// DashboardReports.jsx (React Component)
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// //import AdminCharts from "../../../charts/AdminBoard/AdminCharts";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import DashboardCharts from "../../../charts/Dashboard/DashboardCharts";
// import DashboardRevenue from "../../../charts/Dashboard/DashboardRevenue";
// import AggregatePaymentMethod from "../../../charts/AggregatePaymentMethod";
// import { getDailySalesReportData } from "../../../redux/slices/aggregateSalesSlice";

// const DashboardReports = () => {
//   const dispatch = useDispatch();
//   const { dailySalesReport, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );

//   useEffect(() => {
//     if (status === "idle") {
//       console.log("Dispatching getDailySalesReportData");
//       dispatch(getDailySalesReportData());
//     }
//   }, [dispatch, status]);

//   console.log("Current state:", { dailySalesReport, status, error });

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (status === "failed") {
//     return <div>Error: {error}</div>;
//   }

//   const { overallDailySales = 0, departments = {} } = dailySalesReport || {};

//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//         Dashboard
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         <DashboardCharts
//           title="Total Sales Today"
//           value={overallDailySales}
//           series={[75, 25]}
//           colors={["#fe6c00", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Restaurant"
//           value={departments.restaurant?.totalSales ?? 0}
//           series={[60, 40]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Minimart"
//           value={departments.minimart?.totalSales ?? 0}
//           series={[75, 25]}
//           colors={["#fcfcfc", "#bf9d09"]}
//         />
//         <DashboardCharts
//           title="Laundry"
//           value={departments.laundry?.totalSales ?? 0}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Kabasa"
//           value={departments.kabasa?.totalSales ?? 0}
//           series={[75, 25]}
//           colors={["#043415", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Hall"
//           value={departments.hall?.totalSales ?? 0}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Front Office"
//           value={departments.frontOffice?.totalSales ?? 0}
//           series={[75, 25]}
//           colors={["#e82727", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Seminar"
//           value={departments.seminar?.totalSales ?? 0}
//           series={[75, 25]}
//           colors={["#c70479", "#c4e8ef"]}
//         />
//       </Box>

//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       >
//         <DashboardRevenue />
//         <AggregatePaymentMethod />
//       </Stack>
//     </Box>
//   );
// };

// export default DashboardReports;

// DashboardReports.jsx
import React, { useEffect, useState, useRef } from "react"; // Import useState and useRef
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DashboardCharts from "../../../charts/Dashboard/DashboardCharts";
import DashboardRevenue from "../../../charts/Dashboard/DashboardRevenue";
import AggregatePaymentMethod from "../../../charts/AggregatePaymentMethod";
import { getDailySalesReportData } from "../../../redux/slices/aggregateSalesSlice";
import { CircularProgress } from "@mui/material";

const DashboardReports = () => {
  const dispatch = useDispatch();
  const { dailySalesReport, status, error } = useSelector(
    (state) => state.aggregateSales
  );
  const intervalRef = useRef(null); // Ref to hold the interval ID

  useEffect(() => {
    // Fetch data immediately on mount
    dispatch(getDailySalesReportData());

    // Set up polling:  Fetch data every 5 seconds (adjust as needed)
    intervalRef.current = setInterval(() => {
      dispatch(getDailySalesReportData());
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup function: Clear the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch]); // Correct dependency array: only dispatch

  if (status === "loading") {
    // return <div>Loading...</div>;
    return (
      <Box
        key="loading"
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
    );
  }

  if (status === "failed") {
    // return <div>Error: {error}</div>;
    return (
      <Box sx={{ color: "red", textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Error: {error || "Unknown error"}</Typography>
      </Box>
    );
  }

  // Safer way to access potentially undefined properties
  const overallDailySales = dailySalesReport?.overallDailySales ?? 0;
  const restaurantSales =
    dailySalesReport?.departments?.restaurant?.totalSales ?? 0;
  const minimartSales =
    dailySalesReport?.departments?.minimart?.totalSales ?? 0;
  const laundrySales = dailySalesReport?.departments?.laundry?.totalSales ?? 0;
  const kabasaSales = dailySalesReport?.departments?.kabasa?.totalSales ?? 0;
  const hallSales = dailySalesReport?.departments?.hall?.totalSales ?? 0;
  const frontOfficeSales =
    dailySalesReport?.departments?.frontOffice?.totalSales ?? 0;
  const seminarSales = dailySalesReport?.departments?.seminar?.totalSales ?? 0;

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#fe6c00">
        Dashboard
      </Typography>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <DashboardCharts
          title="Total Sales Today"
          value={overallDailySales}
          series={[75, 25]}
          colors={["#fe6c00", "#c4e8ef"]}
        />
        <DashboardCharts
          title="Restaurant"
          value={restaurantSales}
          series={[60, 40]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <DashboardCharts
          title="Minimart"
          value={minimartSales}
          series={[75, 25]}
          colors={["#fcfcfc", "#bf9d09"]}
        />
        <DashboardCharts
          title="Laundry"
          value={laundrySales}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <DashboardCharts
          title="Kabsa"
          value={kabasaSales}
          series={[75, 25]}
          colors={["#043415", "#c4e8ef"]}
        />
        <DashboardCharts
          title="Hall"
          value={hallSales}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <DashboardCharts
          title="Front Office"
          value={frontOfficeSales}
          series={[75, 25]}
          colors={["#e82727", "#c4e8ef"]}
        />
        <DashboardCharts
          title="Seminar"
          value={seminarSales}
          series={[75, 25]}
          colors={["#c70479", "#c4e8ef"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <DashboardRevenue />
        <AggregatePaymentMethod />
      </Stack>
    </Box>
  );
};

export default DashboardReports;
