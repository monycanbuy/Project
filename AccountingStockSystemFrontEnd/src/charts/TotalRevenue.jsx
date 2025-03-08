// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";

// import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";

// const TotalRevenue = () => {
//   return (
//     <Box
//       p={4}
//       flex={1}
//       //bgcolor="#302924"
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
//           ₦ 236,535
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
//           <Stack>
//             <Typography fontSize={15} color="#ffc397">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#808191">
//               Than Last Month
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>

//       <ReactApexChart
//         series={TotalRevenueSeries}
//         type="bar"
//         height={310}
//         options={TotalRevenueOptions}
//       />
//     </Box>
//   );
// };

// export default TotalRevenue;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";

// import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";
// import { fetchTotalSales } from "../redux/slices/inventoriesSlice";

// const TotalRevenue = () => {
//   const dispatch = useDispatch();
//   const { totalSales, totalSalesStatus, totalSalesError } = useSelector(
//     (state) => state.inventories
//   );

//   useEffect(() => {
//     dispatch(fetchTotalSales());
//   }, [dispatch]);

//   return (
//     <Box
//       p={4}
//       flex={1}
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
//           ₦ {totalSales.toLocaleString()}
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
//           <Stack>
//             <Typography fontSize={15} color="#ffc397">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#808191">
//               Than Last Month
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>

//       <ReactApexChart
//         series={TotalRevenueSeries}
//         type="bar"
//         height={310}
//         options={TotalRevenueOptions}
//       />
//     </Box>
//   );
// };

// export default TotalRevenue;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import dayjs from "dayjs";
// import {
//   fetchDailySales,
//   fetchTotalSales,
// } from "../redux/slices/inventoriesSlice"; // Added fetchTotalSales

// const TotalRevenue = () => {
//   const dispatch = useDispatch();
//   const {
//     dailySales,
//     dailySalesStatus,
//     dailySalesError,
//     totalSales,
//     totalSalesStatus,
//     totalSalesError,
//   } = useSelector((state) => state.inventories);

//   const [chartOptions, setChartOptions] = useState({
//     chart: { type: "bar", toolbar: { show: false } },
//     colors: ["#fe6c00", "#ffc397"],
//     plotOptions: {
//       bar: { borderRadius: 4, horizontal: false, columnWidth: "55%" },
//     },
//     dataLabels: { enabled: false },
//     grid: {
//       show: true,
//       borderColor: "#90A4AE",
//       strokeDashArray: 0,
//       xaxis: { lines: { show: true } },
//       yaxis: { lines: { show: true } },
//     },
//     stroke: { colors: ["transparent"], width: 4 },
//     xaxis: { categories: [], labels: { style: { colors: "#bdbabb" } } },
//     yaxis: {
//       title: { text: "₦ (thousands)", style: { color: "#fe6c00" } },
//       labels: {
//         formatter: (value) => value / 1000,
//         style: { colors: "#fff" },
//       },
//     },
//     fill: { opacity: 1 },
//     legend: { position: "top", horizontalAlign: "right" },
//     tooltip: { y: { formatter: (val) => `₦ ${val.toLocaleString()}` } },
//   });
//   const [chartSeries, setChartSeries] = useState([
//     { name: "Total Sales", data: [] },
//   ]);

//   // Fetch daily sales and total sales on mount
//   useEffect(() => {
//     dispatch(fetchDailySales({})); // Fetch all daily sales for chart
//     dispatch(fetchTotalSales()); // Fetch all-time total sales
//   }, [dispatch]);

//   // Update chart data when dailySales changes
//   useEffect(() => {
//     if (dailySalesStatus === "succeeded" && Array.isArray(dailySales)) {
//       // Filter last 7 days
//       const sevenDaysAgo = dayjs().subtract(7, "day").startOf("day");
//       const last7DaysSales = dailySales.filter(
//         (item) =>
//           dayjs(item.date).isAfter(sevenDaysAgo) ||
//           dayjs(item.date).isSame(sevenDaysAgo)
//       );

//       // Prepare chart data
//       const categories = last7DaysSales.map((item) => item.date);
//       const data = last7DaysSales.map((item) => item.totalSales || 0);

//       setChartOptions((prevOptions) => ({
//         ...prevOptions,
//         xaxis: { ...prevOptions.xaxis, categories },
//       }));
//       setChartSeries([{ name: "Total Sales", data }]);
//     }
//   }, [dailySales, dailySalesStatus]);

//   // Calculate total revenue for the last 7 days
//   const totalRevenue =
//     dailySalesStatus === "succeeded" && Array.isArray(dailySales)
//       ? dailySales
//           .filter(
//             (item) =>
//               dayjs(item.date).isAfter(dayjs().subtract(7, "day")) ||
//               dayjs(item.date).isSame(dayjs().subtract(7, "day"))
//           )
//           .reduce((acc, cur) => acc + (cur.totalSales || 0), 0)
//       : 0;

//   return (
//     <Box
//       p={4}
//       flex={1}
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
//         <Typography fontSize={28} fontWeight={700} color="#fe6c00">
//           ₦{" "}
//           {(totalSalesStatus === "succeeded" ? totalSales : 0).toLocaleString()}
//         </Typography>
//       </Stack>
//       <Typography fontSize={14} fontWeight={600} color="#fcfcfc">
//         Total Revenue (Last 7 Days)
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         <Typography fontSize={22} fontWeight={500} color="#d9cfcf">
//           ₦ {totalRevenue.toLocaleString()}
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
//           <Stack>
//             <Typography fontSize={15} color="#ffc397">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#808191">
//               Than Last Week
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>

//       {dailySalesStatus === "loading" ? (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           height={310}
//         >
//           <Typography color="#fcfcfc">Loading...</Typography>
//         </Box>
//       ) : dailySalesStatus === "failed" ? (
//         <Typography color="error">Error: {dailySalesError}</Typography>
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

// export default TotalRevenue;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
import ArrowCircleDownRounded from "@mui/icons-material/ArrowCircleDownRounded"; // For decrease
import dayjs from "dayjs";
import {
  fetchDailySales,
  fetchTotalSales,
} from "../redux/slices/inventoriesSlice";

const TotalRevenue = () => {
  const dispatch = useDispatch();
  const {
    dailySales,
    dailySalesStatus,
    dailySalesError,
    totalSales,
    totalSalesStatus,
  } = useSelector((state) => state.inventories);

  const [chartOptions, setChartOptions] = useState({
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#fe6c00", "#ffc397"],
    plotOptions: {
      bar: { borderRadius: 4, horizontal: false, columnWidth: "55%" },
    },
    dataLabels: { enabled: false },
    grid: {
      show: true,
      borderColor: "#90A4AE",
      strokeDashArray: 0,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    stroke: { colors: ["transparent"], width: 4 },
    xaxis: { categories: [], labels: { style: { colors: "#bdbabb" } } },
    yaxis: {
      title: { text: "₦ (thousands)", style: { color: "#fe6c00" } },
      labels: {
        formatter: (value) => value / 1000,
        style: { colors: "#fff" },
      },
    },
    fill: { opacity: 1 },
    legend: { position: "top", horizontalAlign: "right" },
    tooltip: { y: { formatter: (val) => `₦ ${val.toLocaleString()}` } },
  });
  const [chartSeries, setChartSeries] = useState([
    { name: "Total Sales", data: [] },
  ]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchDailySales({})); // Fetch all daily sales for chart and comparison
    dispatch(fetchTotalSales()); // Fetch all-time total sales
  }, [dispatch]);

  // Update chart data when dailySales changes
  useEffect(() => {
    if (dailySalesStatus === "succeeded" && Array.isArray(dailySales)) {
      const sevenDaysAgo = dayjs().subtract(7, "day").startOf("day");
      const last7DaysSales = dailySales.filter(
        (item) =>
          dayjs(item.date).isAfter(sevenDaysAgo) ||
          dayjs(item.date).isSame(sevenDaysAgo)
      );

      const categories = last7DaysSales.map((item) => item.date);
      const data = last7DaysSales.map((item) => item.totalSales || 0);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: { ...prevOptions.xaxis, categories },
      }));
      setChartSeries([{ name: "Total Sales", data }]);
    }
  }, [dailySales, dailySalesStatus]);

  // Calculate total revenue for the last 7 days
  const totalRevenue =
    dailySalesStatus === "succeeded" && Array.isArray(dailySales)
      ? dailySales
          .filter(
            (item) =>
              dayjs(item.date).isAfter(dayjs().subtract(7, "day")) ||
              dayjs(item.date).isSame(dayjs().subtract(7, "day"))
          )
          .reduce((acc, cur) => acc + (cur.totalSales || 0), 0)
      : 0;

  // Calculate total revenue for the previous 7 days (week before last)
  const previousWeekRevenue =
    dailySalesStatus === "succeeded" && Array.isArray(dailySales)
      ? dailySales
          .filter(
            (item) =>
              (dayjs(item.date).isAfter(dayjs().subtract(14, "day")) &&
                dayjs(item.date).isBefore(dayjs().subtract(7, "day"))) ||
              dayjs(item.date).isSame(dayjs().subtract(14, "day"))
          )
          .reduce((acc, cur) => acc + (cur.totalSales || 0), 0)
      : 0;

  // Calculate percentage difference
  const calculatePercentageChange = () => {
    if (previousWeekRevenue === 0) {
      return totalRevenue > 0 ? 100 : 0; // If previous week is 0, return 100% if there's revenue, else 0%
    }
    const difference = totalRevenue - previousWeekRevenue;
    const percentageChange = (difference / previousWeekRevenue) * 100;
    return Number(percentageChange.toFixed(1)); // Round to 1 decimal place
  };

  const percentageChange = calculatePercentageChange();
  const isIncrease = percentageChange >= 0;

  return (
    <Box
      p={4}
      flex={1}
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
          ₦{" "}
          {(totalSalesStatus === "succeeded" ? totalSales : 0).toLocaleString()}
        </Typography>
      </Stack>
      <Typography fontSize={14} fontWeight={600} color="#fcfcfc">
        Total Revenue (Last 7 Days)
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        <Typography fontSize={22} fontWeight={500} color="#d9cfcf">
          ₦ {totalRevenue.toLocaleString()}
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

      {dailySalesStatus === "loading" ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={310}
        >
          <Typography color="#fcfcfc">Loading...</Typography>
        </Box>
      ) : dailySalesStatus === "failed" ? (
        <Typography color="error">Error: {dailySalesError}</Typography>
      ) : (
        <ReactApexChart
          series={chartSeries}
          type="bar"
          height={310}
          options={chartOptions}
        />
      )}
    </Box>
  );
};

export default TotalRevenue;
