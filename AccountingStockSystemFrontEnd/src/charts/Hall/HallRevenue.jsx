// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import { WeeklyRevenueOptions, WeeklyRevenueSeries } from "../days.config";

// const HallRevenue = () => {
//   return (
//     <Box
//       p={4}
//       flex={1}
//       bgcolor="#fcfcfc"
//       id="chart"
//       display="flex"
//       flexDirection="column"
//       borderRadius="15px"
//     >
//       <Typography fontSize={18} fontWeight={600} color="#11142d">
//         Total Revenue
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         <Typography fontSize={28} fontWeight={700} color="#11142d">
//           $236,535
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#475be8" }} />
//           <Stack>
//             <Typography fontSize={15} color="#475be8">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#808191">
//               Than Last Month
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>

//       <ReactApexChart
//         series={WeeklyRevenueSeries}
//         type="bar"
//         height={310}
//         options={WeeklyRevenueOptions}
//       />
//     </Box>
//   );
// };

// export default HallRevenue;

// src/charts/HallRevenue.jsx
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import { WeeklyRevenueOptions, WeeklyRevenueSeries } from "../days.config";
// import { fetchHallAllTimeSales } from "../../redux/slices/hallSlice"; // Adjust path

// const HallRevenue = () => {
//   const dispatch = useDispatch();
//   const { hallAllTimeSales, hallAllTimeSalesStatus, hallAllTimeSalesError } =
//     useSelector((state) => state.hallTransactions);

//   // Fetch all-time sales on mount
//   useEffect(() => {
//     dispatch(fetchHallAllTimeSales());
//   }, [dispatch]);

//   // Format total sales as NGN (Nigerian Naira)
//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(amount || 0);

//   // Get total sales value or fallback
//   const totalSales = hallAllTimeSales?.totalSales || 0;

//   return (
//     <Box
//       p={4}
//       flex={1}
//       bgcolor="#fcfcfc"
//       id="chart"
//       display="flex"
//       flexDirection="column"
//       borderRadius="15px"
//       sx={{
//         background:
//           "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Total Revenue
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//           {hallAllTimeSalesStatus === "loading"
//             ? "Loading..."
//             : hallAllTimeSalesError
//             ? "Error"
//             : formatCurrency(totalSales)}
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#475be8" }} />
//           <Stack>
//             <Typography fontSize={15} color="#475be8">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#808191">
//               Than Last Month
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>

//       <ReactApexChart
//         series={WeeklyRevenueSeries}
//         type="bar"
//         height={310}
//         options={WeeklyRevenueOptions}
//       />
//     </Box>
//   );
// };

// export default HallRevenue;

// src/charts/HallRevenue.jsx
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import {
//   fetchHallAllTimeSales,
//   fetchHallDailySalesAllDays,
// } from "../../redux/slices/hallSlice"; // Adjust path

// const HallRevenue = () => {
//   const dispatch = useDispatch();
//   const {
//     hallAllTimeSales,
//     hallAllTimeSalesStatus,
//     hallAllTimeSalesError,
//     hallDailySalesAllDays,
//     hallDailySalesAllDaysStatus,
//     hallDailySalesAllDaysError,
//   } = useSelector((state) => state.hallTransactions);

//   // Fetch data on mount
//   useEffect(() => {
//     dispatch(fetchHallAllTimeSales());
//     dispatch(fetchHallDailySalesAllDays());
//   }, [dispatch]);

//   // Format currency as NGN (Nigerian Naira)
//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(amount || 0);

//   // Get total all-time sales value or fallback
//   const totalSales = hallAllTimeSales?.totalSales || 0;

//   // Process last 7 days for the bar chart
//   const getLastSevenDaysChartData = () => {
//     if (!hallDailySalesAllDays || hallDailySalesAllDaysStatus !== "succeeded") {
//       return {
//         series: [{ name: "Daily Transactions", data: [0, 0, 0, 0, 0, 0, 0] }],
//         options: {
//           chart: { type: "bar", toolbar: { show: false } },
//           colors: ["#fe6c00"],
//           plotOptions: {
//             bar: { borderRadius: 4, horizontal: false, columnWidth: "55%" },
//           },
//           dataLabels: { enabled: false },
//           grid: { show: false },
//           stroke: { colors: ["transparent"], width: 4 },
//           xaxis: {
//             categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//             labels: { style: { colors: "#bdbabb" } },
//           },
//           yaxis: {
//             title: { text: "Transactions", style: { color: "#fe6c00" } },
//             labels: { style: { colors: "#fff" } },
//           },
//           fill: { opacity: 1 },
//           legend: {
//             position: "top",
//             horizontalAlign: "right",
//             labels: { colors: "#fff" },
//           },
//           tooltip: { y: { formatter: (val) => `${val} transactions` } },
//         },
//       };
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const sevenDaysAgo = new Date(today);
//     sevenDaysAgo.setDate(today.getDate() - 6); // Last 7 days including today

//     const dailySalesMap = new Map(
//       hallDailySalesAllDays.map((sale) => [sale.date, sale.totalSales])
//     );

//     const seriesData = [];
//     const categories = [];
//     for (let i = 0; i < 7; i++) {
//       const currentDate = new Date(sevenDaysAgo);
//       currentDate.setDate(sevenDaysAgo.getDate() + i);
//       const dateStr = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
//       const dayName = currentDate.toLocaleString("en-US", { weekday: "short" }); // Mon, Tue, etc.

//       seriesData.push(dailySalesMap.get(dateStr) || 0); // Transaction count or 0
//       categories.push(dayName);
//     }

//     return {
//       series: [{ name: "Daily Transactions", data: seriesData }],
//       options: {
//         chart: { type: "bar", toolbar: { show: false } },
//         colors: ["#fe6c00"],
//         plotOptions: {
//           bar: { borderRadius: 4, horizontal: false, columnWidth: "55%" },
//         },
//         dataLabels: { enabled: false },
//         grid: { show: false },
//         stroke: { colors: ["transparent"], width: 4 },
//         xaxis: {
//           categories, // Dynamic day names (e.g., Mon, Tue, ...)
//           labels: { style: { colors: "#bdbabb" } },
//         },
//         yaxis: {
//           title: { text: "Transactions", style: { color: "#fe6c00" } },
//           labels: { style: { colors: "#fff" } },
//         },
//         fill: { opacity: 1 },
//         legend: {
//           position: "top",
//           horizontalAlign: "right",
//           labels: { colors: "#fff" },
//         },
//         tooltip: { y: { formatter: (val) => `${val} transactions` } },
//       },
//     };
//   };

//   const { series: chartSeries, options: chartOptions } =
//     getLastSevenDaysChartData();

//   return (
//     <Box
//       p={4}
//       flex={1}
//       bgcolor="#fcfcfc"
//       id="chart"
//       display="flex"
//       flexDirection="column"
//       borderRadius="15px"
//       sx={{
//         background:
//           "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Total Revenue
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//           {hallAllTimeSalesStatus === "loading"
//             ? "Loading..."
//             : hallAllTimeSalesError
//             ? "Error"
//             : formatCurrency(totalSales)}
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#475be8" }} />
//           <Stack>
//             <Typography fontSize={15} color="#475be8">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#808191">
//               Than Last Month
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>

//       {hallDailySalesAllDaysStatus === "loading" ? (
//         <Typography color="#fff">Loading chart...</Typography>
//       ) : hallDailySalesAllDaysError ? (
//         <Typography color="error">
//           Error: {hallDailySalesAllDaysError.message}
//         </Typography>
//       ) : (
//         <ReactApexChart
//           series={chartSeries}
//           type="bar"
//           height={310}
//           options={chartOptions}
//         />
//       )}
//     </Box>
//   );
// };

// export default HallRevenue;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
import ArrowCircleDownRounded from "@mui/icons-material/ArrowCircleDownRounded"; // Add this import
import {
  fetchHallAllTimeSales,
  fetchHallDailySalesAllDays,
} from "../../redux/slices/hallSlice"; // Adjust path

const HallRevenue = () => {
  const dispatch = useDispatch();
  const {
    hallAllTimeSales,
    hallAllTimeSalesStatus,
    hallAllTimeSalesError,
    hallDailySalesAllDays,
    hallDailySalesAllDaysStatus,
    hallDailySalesAllDaysError,
  } = useSelector((state) => state.hallTransactions);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchHallAllTimeSales());
    dispatch(fetchHallDailySalesAllDays());
  }, [dispatch]);

  // Format currency as NGN (Nigerian Naira)
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  // Get total all-time sales value or fallback
  const totalSales = hallAllTimeSales?.totalSales || 0;

  // Process last 7 days for the bar chart
  const getLastSevenDaysChartData = () => {
    if (!hallDailySalesAllDays || hallDailySalesAllDaysStatus !== "succeeded") {
      return {
        lastWeek: [0, 0, 0, 0, 0, 0, 0],
        runningWeek: [0, 0, 0, 0, 0, 0, 0],
        lastWeekTotal: 0,
        runningWeekTotal: 0,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days ago

    const lastWeekStart = new Date(sevenDaysAgo);
    lastWeekStart.setDate(sevenDaysAgo.getDate() - 7); // Start of last week

    const dailySalesMap = new Map(
      hallDailySalesAllDays.map((sale) => [sale.date, sale.totalSales])
    );

    const lastWeekData = [];
    const runningWeekData = [];
    let lastWeekTotal = 0;
    let runningWeekTotal = 0;

    for (let i = 0; i < 7; i++) {
      const lastWeekDate = new Date(lastWeekStart);
      lastWeekDate.setDate(lastWeekStart.getDate() + i);
      const runningWeekDate = new Date(sevenDaysAgo);
      runningWeekDate.setDate(sevenDaysAgo.getDate() + i);

      const lastWeekDateStr = lastWeekDate.toISOString().split("T")[0];
      const runningWeekDateStr = runningWeekDate.toISOString().split("T")[0];

      const lastWeekValue = dailySalesMap.get(lastWeekDateStr) || 0;
      const runningWeekValue = dailySalesMap.get(runningWeekDateStr) || 0;

      lastWeekData.push(lastWeekValue);
      runningWeekData.push(runningWeekValue);
      lastWeekTotal += lastWeekValue;
      runningWeekTotal += runningWeekValue;
    }

    return {
      lastWeek: lastWeekData,
      runningWeek: runningWeekData,
      lastWeekTotal,
      runningWeekTotal,
    };
  };

  const weeklyData = getLastSevenDaysChartData();
  const chartSeries = [
    { name: "Last Week", data: weeklyData.lastWeek },
    { name: "Running Week", data: weeklyData.runningWeek },
  ];

  // Calculate percentage difference
  const calculatePercentageChange = () => {
    const previousWeekRevenue = weeklyData.lastWeekTotal;
    const currentWeekRevenue = weeklyData.runningWeekTotal;

    if (previousWeekRevenue === 0) {
      return currentWeekRevenue > 0 ? 100 : 0; // If last week is 0, return 100% if there's revenue, else 0%
    }
    const difference = currentWeekRevenue - previousWeekRevenue;
    const percentageChange = (difference / previousWeekRevenue) * 100;
    return Number(percentageChange.toFixed(1)); // Round to 1 decimal place
  };

  const percentageChange = calculatePercentageChange();
  const isIncrease = percentageChange >= 0;

  return (
    <Box
      p={4}
      flex={1}
      bgcolor="#fcfcfc"
      id="chart"
      display="flex"
      flexDirection="column"
      borderRadius="15px"
      sx={{
        background:
          "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
      }}
    >
      <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
        Total Revenue
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
          {hallAllTimeSalesStatus === "loading"
            ? "Loading..."
            : hallAllTimeSalesError
            ? "Error"
            : formatCurrency(totalSales)}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          {isIncrease ? (
            <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
          ) : (
            <ArrowCircleDownRounded sx={{ fontSize: 25, color: "#ff6f61" }} /> // Red for decrease
          )}
          <Stack>
            <Typography
              fontSize={15}
              color={isIncrease ? "#ffc397" : "#ff6f61"} // Orange for increase, red for decrease
            >
              {Math.abs(percentageChange)}%
            </Typography>
            <Typography fontSize={12} color="#808191">
              Than Last Week
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {hallDailySalesAllDaysStatus === "loading" ? (
        <Typography color="#fff">Loading chart...</Typography>
      ) : hallDailySalesAllDaysError ? (
        <Typography color="error">
          Error: {hallDailySalesAllDaysError.message}
        </Typography>
      ) : (
        <ReactApexChart
          series={chartSeries}
          type="bar"
          height={310}
          options={{
            chart: { type: "bar", toolbar: { show: false } },
            colors: ["#fe6c00"],
            plotOptions: {
              bar: { borderRadius: 4, horizontal: false, columnWidth: "55%" },
            },
            dataLabels: { enabled: false },
            grid: { show: false },
            stroke: { colors: ["transparent"], width: 4 },
            xaxis: {
              categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              labels: { style: { colors: "#bdbabb" } },
            },
            yaxis: {
              title: { text: "Transactions", style: { color: "#fe6c00" } },
              labels: { style: { colors: "#fff" } },
            },
            fill: { opacity: 1 },
            legend: {
              position: "top",
              horizontalAlign: "right",
              labels: { colors: "#fff" },
            },
            tooltip: { y: { formatter: (val) => `${val} transactions` } },
          }}
        />
      )}
    </Box>
  );
};

export default HallRevenue;
