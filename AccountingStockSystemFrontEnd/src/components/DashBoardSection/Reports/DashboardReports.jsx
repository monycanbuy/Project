// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import DashboardCharts from "../../../charts/Dashboard/DashboardCharts";
// import DashboardRevenue from "../../../charts/Dashboard/DashboardRevenue";
// import AggregatePaymentMethod from "../../../charts/AggregatePaymentMethod";
// import {
//   getDailySalesReportData,
//   getAllTimeTotalSales,
//   getMonthlySalesComparison,
//   getPaymentMethodsReport,
// } from "../../../redux/slices/aggregateSalesSlice";
// import { CircularProgress } from "@mui/material";

// const DashboardReports = () => {
//   const dispatch = useDispatch();
//   const { dailySalesReport, dailySalesStatus, dailySalesError } = useSelector(
//     (state) => state.aggregateSales
//   );
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     // Initial fetch
//     dispatch(getDailySalesReportData());
//     dispatch(getAllTimeTotalSales());
//     dispatch(getMonthlySalesComparison());
//     dispatch(getPaymentMethodsReport());

//     // Polling every 1 minute (60,000 milliseconds)
//     intervalRef.current = setInterval(() => {
//       dispatch(getDailySalesReportData());
//       dispatch(getAllTimeTotalSales());
//       dispatch(getMonthlySalesComparison());
//       dispatch(getPaymentMethodsReport());
//     }, 60000); // Changed from 5000 to 60000

//     // Cleanup on unmount
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [dispatch]);

//   if (dailySalesStatus === "loading") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//           width: "100%",
//         }}
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   if (dailySalesStatus === "failed") {
//     return (
//       <Box sx={{ color: "red", textAlign: "center", mt: 4 }}>
//         <Typography variant="h6">
//           Error: {dailySalesError || "Unknown error"}
//         </Typography>
//       </Box>
//     );
//   }

//   const overallDailySales = dailySalesReport?.overallDailySales ?? 0;
//   const restaurantSales =
//     dailySalesReport?.departments?.restaurant?.totalSales ?? 0;
//   const minimartSales =
//     dailySalesReport?.departments?.minimart?.totalSales ?? 0;
//   const laundrySales = dailySalesReport?.departments?.laundry?.totalSales ?? 0;
//   const kabasaSales = dailySalesReport?.departments?.kabasa?.totalSales ?? 0;
//   const hallSales = dailySalesReport?.departments?.hall?.totalSales ?? 0;
//   const frontOfficeSales =
//     dailySalesReport?.departments?.frontOffice?.totalSales ?? 0;
//   const seminarSales = dailySalesReport?.departments?.seminar?.totalSales ?? 0;

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
//           value={restaurantSales}
//           series={[60, 40]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Minimart"
//           value={minimartSales}
//           series={[75, 25]}
//           colors={["#fcfcfc", "#bf9d09"]}
//         />
//         <DashboardCharts
//           title="Laundry"
//           value={laundrySales}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Kabasa"
//           value={kabasaSales}
//           series={[75, 25]}
//           colors={["#043415", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Hall"
//           value={hallSales}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Front Office"
//           value={frontOfficeSales}
//           series={[75, 25]}
//           colors={["#e82727", "#c4e8ef"]}
//         />
//         <DashboardCharts
//           title="Seminar"
//           value={seminarSales}
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

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDailySalesReportData,
  getAllTimeTotalSales,
  getMonthlySalesComparison,
  getPaymentMethodsReport,
} from "../../../redux/slices/aggregateSalesSlice";
import { checkAuthStatus } from "../../../redux/slices/authSlice";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import DashboardCharts from "../../../charts/Dashboard/DashboardCharts";
import DashboardRevenue from "../../../charts/Dashboard/DashboardRevenue";
import AggregatePaymentMethod from "../../../charts/AggregatePaymentMethod";

const DashboardReports = () => {
  const dispatch = useDispatch();
  const {
    dailySalesReport = {},
    dailySalesStatus = "idle",
    dailySalesError,
    allTimeTotalSalesStatus = "idle",
    allTimeTotalSalesError,
    monthlySalesComparisonStatus = "idle",
    monthlySalesComparisonError,
    paymentMethodsReportStatus = "idle",
    paymentMethodsReportError,
  } = useSelector((state) => state.aggregateSales || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const intervalRef = useRef(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("DashboardReports - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching initial dashboard reports data...");
        dispatch(getDailySalesReportData());
        dispatch(getAllTimeTotalSales());
        dispatch(getMonthlySalesComparison());
        dispatch(getPaymentMethodsReport());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching dashboard reports data...");
            dispatch(getDailySalesReportData());
            dispatch(getAllTimeTotalSales());
            dispatch(getMonthlySalesComparison());
            dispatch(getPaymentMethodsReport());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }

    intervalRef.current = setInterval(() => {
      if (isAuthenticated) {
        //console.log("Polling for updated dashboard reports data...");
        dispatch(getDailySalesReportData());
        dispatch(getAllTimeTotalSales());
        dispatch(getMonthlySalesComparison());
        dispatch(getPaymentMethodsReport());
      }
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, isAuthenticated, initialFetchDone]);

  const isLoading = [
    dailySalesStatus,
    allTimeTotalSalesStatus,
    monthlySalesComparisonStatus,
    paymentMethodsReportStatus,
  ].some((status) => status === "loading");

  const errors = {
    dailySalesError,
    allTimeTotalSalesError,
    monthlySalesComparisonError,
    paymentMethodsReportError,
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
          Please log in to view the dashboard reports.
        </Typography>
      </Box>
    );
  }

  if (isLoading && !dailySalesReport.overallDailySales) {
    return (
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
          {dailySalesError &&
            `Daily Sales Error: ${dailySalesError.message || dailySalesError}`}
          {allTimeTotalSalesError &&
            `All Time Sales Error: ${
              allTimeTotalSalesError.message || allTimeTotalSalesError
            }`}
          {monthlySalesComparisonError &&
            `Monthly Comparison Error: ${
              monthlySalesComparisonError.message || monthlySalesComparisonError
            }`}
          {paymentMethodsReportError &&
            `Payment Methods Error: ${
              paymentMethodsReportError.message || paymentMethodsReportError
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
          title="Kabasa"
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
