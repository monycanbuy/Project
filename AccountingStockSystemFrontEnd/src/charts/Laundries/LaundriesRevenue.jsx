// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import { TotalRevenueOptions, TotalRevenueSeries } from "../chart.config";

// const LaundriesRevenue = () => {
//   return (
//     <Box
//       p={4}
//       flex={1}
//       //bgcolor="#fcfcfc"
//       id="chart"
//       display="flex"
//       flexDirection="column"
//       borderRadius="15px"
//       sx={{
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Total Revenue
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
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
//         series={TotalRevenueSeries}
//         type="bar"
//         height={310}
//         options={TotalRevenueOptions}
//       />
//     </Box>
//   );
// };

// export default LaundriesRevenue;

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import { TotalRevenueOptions, TotalRevenueSeries } from "../chart.config";
// import { fetchAllTimeLaundrySales } from "../../redux/slices/laundrySlice"; // Adjust path

// const LaundriesRevenue = () => {
//   const dispatch = useDispatch();
//   const { allTimeSales, allTimeSalesStatus, allTimeSalesError } = useSelector(
//     (state) => state.laundry
//   );

//   // Fetch all-time sales data on mount
//   useEffect(() => {
//     dispatch(fetchAllTimeLaundrySales({})); // Fetch all-time sales
//     // Optional: dispatch(fetchAllTimeLaundrySales({ fromDate: "2024-01-01", toDate: "2025-02-23" })) for a range
//   }, [dispatch]);

//   // Format total sales with Naira symbol and commas
//   const formatCurrency = (amount) => {
//     return `₦${(amount || 0).toLocaleString("en-US", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     })}`;
//   };

//   const totalSales = allTimeSales?.totalSales || 0;

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
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Total Revenue
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         {allTimeSalesStatus === "loading" ? (
//           <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//             Loading...
//           </Typography>
//         ) : allTimeSalesStatus === "failed" ? (
//           <Typography fontSize={28} fontWeight={700} color="#ff6f61">
//             Error
//           </Typography>
//         ) : (
//           <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//             {formatCurrency(totalSales)}
//           </Typography>
//         )}
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
//         series={TotalRevenueSeries}
//         type="bar"
//         height={310}
//         options={TotalRevenueOptions}
//       />
//     </Box>
//   );
// };

// export default LaundriesRevenue;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import {
//   fetchAllTimeLaundrySales,
//   fetchDailySalesAllDays,
// } from "../../redux/slices/laundrySlice"; // Adjust path

// const LaundriesRevenue = () => {
//   const dispatch = useDispatch();
//   const {
//     allTimeSales,
//     allTimeSalesStatus,
//     allTimeSalesError,
//     dailySalesAllDays,
//     dailySalesAllDaysStatus,
//   } = useSelector((state) => state.laundry);

//   const [chartData, setChartData] = useState({
//     series: [],
//     options: {
//       chart: {
//         type: "bar",
//         toolbar: {
//           show: false,
//         },
//       },
//       colors: ["#fe6c00", "#ffc397"],
//       plotOptions: {
//         bar: {
//           borderRadius: 4,
//           horizontal: false,
//           columnWidth: "55%",
//         },
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       grid: {
//         show: false,
//       },
//       stroke: {
//         colors: ["transparent"],
//         width: 4,
//       },
//       xaxis: {
//         categories: [],
//         labels: {
//           style: {
//             colors: "#bdbabb", // Color for x-axis labels
//           },
//         },
//       },
//       yaxis: {
//         title: {
//           text: "₦ (thousands)",
//           style: {
//             color: "#fe6c00", // Color for y-axis title
//           },
//         },
//         labels: {
//           style: {
//             colors: "#fff", // Color for y-axis labels (numbers)
//           },
//         },
//       },
//       fill: {
//         opacity: 1,
//       },
//       legend: {
//         position: "top",
//         horizontalAlign: "right",
//       },
//       tooltip: {
//         y: {
//           formatter(val) {
//             return `₦ ${val} thousands`;
//           },
//         },
//       },
//     },
//   });

//   // Fetch all-time sales data and daily sales data on mount
//   useEffect(() => {
//     dispatch(fetchAllTimeLaundrySales());
//     dispatch(fetchDailySalesAllDays());
//   }, [dispatch]);

//   // Process daily sales data for the last seven days
//   useEffect(() => {
//     if (dailySalesAllDaysStatus === "succeeded" && dailySalesAllDays) {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const sevenDaysAgo = new Date(today);
//       sevenDaysAgo.setDate(today.getDate() - 6);

//       const dailySalesMap = new Map(
//         dailySalesAllDays.map((sale) => [sale.date, sale.totalSales])
//       );

//       const seriesData = [];
//       const categories = [];
//       for (let i = 0; i < 7; i++) {
//         const currentDate = new Date(sevenDaysAgo);
//         currentDate.setDate(sevenDaysAgo.getDate() + i);
//         const dateStr = currentDate.toISOString().split("T")[0];
//         const dayName = currentDate.toLocaleString("en-US", {
//           weekday: "short",
//         });

//         seriesData.push(dailySalesMap.get(dateStr) || 0);
//         categories.push(dayName);
//       }

//       setChartData({
//         series: [{ name: "Daily Sales", data: seriesData }],
//         options: {
//           ...chartData.options,
//           xaxis: {
//             ...chartData.options.xaxis,
//             categories,
//           },
//         },
//       });
//     }
//   }, [dailySalesAllDaysStatus, dailySalesAllDays]);

//   // Format total sales with Naira symbol and commas
//   const formatCurrency = (amount) => {
//     return `₦${(amount || 0).toLocaleString("en-US", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     })}`;
//   };

//   const totalSales = allTimeSales?.totalSales || 0;

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
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Total Revenue
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         {allTimeSalesStatus === "loading" ? (
//           <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//             Loading...
//           </Typography>
//         ) : allTimeSalesStatus === "failed" ? (
//           <Typography fontSize={28} fontWeight={700} color="#ff6f61">
//             Error
//           </Typography>
//         ) : (
//           <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//             {formatCurrency(totalSales)}
//           </Typography>
//         )}
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
//         series={chartData.series}
//         type="bar"
//         height={310}
//         options={chartData.options}
//       />
//     </Box>
//   );
// };

// export default LaundriesRevenue;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import {
//   fetchAllTimeLaundrySales,
//   fetchDailySalesAllDays,
// } from "../../redux/slices/laundrySlice"; // Adjust path

// const LaundriesRevenue = () => {
//   const dispatch = useDispatch();
//   const {
//     allTimeSales,
//     allTimeSalesStatus,
//     allTimeSalesError,
//     dailySalesAllDays,
//     dailySalesAllDaysStatus,
//   } = useSelector((state) => state.laundry);

//   const [chartData, setChartData] = useState({
//     series: [],
//     options: {
//       chart: {
//         type: "bar",
//         toolbar: {
//           show: false,
//         },
//       },
//       colors: ["#fe6c00", "#ffc397"],
//       plotOptions: {
//         bar: {
//           borderRadius: 4,
//           horizontal: false,
//           columnWidth: "55%",
//         },
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       grid: {
//         show: false,
//       },
//       stroke: {
//         colors: ["transparent"],
//         width: 4,
//       },
//       xaxis: {
//         categories: [],
//         labels: {
//           style: {
//             colors: "#bdbabb", // Color for x-axis labels
//           },
//         },
//       },
//       yaxis: {
//         title: {
//           text: "₦ (thousands)",
//           style: {
//             color: "#fe6c00", // Color for y-axis title
//           },
//         },
//         labels: {
//           style: {
//             colors: "#fff", // Color for y-axis labels (numbers)
//           },
//         },
//       },
//       fill: {
//         opacity: 1,
//       },
//       legend: {
//         position: "top",
//         horizontalAlign: "right",
//         labels: {
//           colors: "#fcfcfc", // Color for legend labels
//         },
//       },
//       tooltip: {
//         y: {
//           formatter(val) {
//             return `₦ ${val} thousands`;
//           },
//         },
//       },
//     },
//   });

//   // Fetch all-time sales data and daily sales data on mount
//   useEffect(() => {
//     dispatch(fetchAllTimeLaundrySales());
//     dispatch(fetchDailySalesAllDays());
//   }, [dispatch]);

//   // Process daily sales data for the last seven days
//   useEffect(() => {
//     if (dailySalesAllDaysStatus === "succeeded" && dailySalesAllDays) {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const sevenDaysAgo = new Date(today);
//       sevenDaysAgo.setDate(today.getDate() - 6);

//       const lastWeekStart = new Date(sevenDaysAgo);
//       lastWeekStart.setDate(sevenDaysAgo.getDate() - 7);

//       const dailySalesMap = new Map(
//         dailySalesAllDays.map((sale) => [sale.date, sale.totalSales])
//       );

//       const lastWeekData = [];
//       const runningWeekData = [];
//       const categories = [];
//       for (let i = 0; i < 7; i++) {
//         const lastWeekDate = new Date(lastWeekStart);
//         lastWeekDate.setDate(lastWeekStart.getDate() + i);
//         const runningWeekDate = new Date(sevenDaysAgo);
//         runningWeekDate.setDate(sevenDaysAgo.getDate() + i);

//         const lastWeekDateStr = lastWeekDate.toISOString().split("T")[0];
//         const runningWeekDateStr = runningWeekDate.toISOString().split("T")[0];

//         const dayName = runningWeekDate.toLocaleString("en-US", {
//           weekday: "short",
//         });

//         lastWeekData.push(dailySalesMap.get(lastWeekDateStr) || 0);
//         runningWeekData.push(dailySalesMap.get(runningWeekDateStr) || 0);
//         categories.push(dayName);
//       }

//       setChartData({
//         series: [
//           { name: "Last Week", data: lastWeekData },
//           { name: "Running Week", data: runningWeekData },
//         ],
//         options: {
//           ...chartData.options,
//           xaxis: {
//             ...chartData.options.xaxis,
//             categories,
//           },
//         },
//       });
//     }
//   }, [dailySalesAllDaysStatus, dailySalesAllDays]);

//   // Format total sales with Naira symbol and commas
//   const formatCurrency = (amount) => {
//     return `₦${(amount || 0).toLocaleString("en-US", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     })}`;
//   };

//   const totalSales = allTimeSales?.totalSales || 0;

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
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Total Revenue
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         {allTimeSalesStatus === "loading" ? (
//           <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//             Loading...
//           </Typography>
//         ) : allTimeSalesStatus === "failed" ? (
//           <Typography fontSize={28} fontWeight={700} color="#ff6f61">
//             Error
//           </Typography>
//         ) : (
//           <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//             {formatCurrency(totalSales)}
//           </Typography>
//         )}
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
//         series={chartData.series}
//         type="bar"
//         height={310}
//         options={chartData.options}
//       />
//     </Box>
//   );
// };

// export default LaundriesRevenue;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
import ArrowCircleDownRounded from "@mui/icons-material/ArrowCircleDownRounded";
import {
  fetchAllTimeLaundrySales,
  fetchDailySalesAllDays,
} from "../../redux/slices/laundrySlice"; // Adjust path

const LaundriesRevenue = () => {
  const dispatch = useDispatch();
  const {
    allTimeSales,
    allTimeSalesStatus,
    allTimeSalesError,
    dailySalesAllDays,
    dailySalesAllDaysStatus,
  } = useSelector((state) => state.laundry);

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: ["#fe6c00", "#ffc397"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
      },
      stroke: {
        colors: ["transparent"],
        width: 4,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#bdbabb", // Color for x-axis labels
          },
        },
      },
      yaxis: {
        title: {
          text: "₦ (thousands)",
          style: {
            color: "#fe6c00", // Color for y-axis title
          },
        },
        labels: {
          style: {
            colors: "#fff", // Color for y-axis labels (numbers)
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "#fcfcfc", // Color for legend labels
        },
      },
      tooltip: {
        y: {
          formatter(val) {
            return `₦ ${val} thousands`;
          },
        },
      },
    },
  });

  // Fetch all-time sales data and daily sales data on mount
  useEffect(() => {
    dispatch(fetchAllTimeLaundrySales());
    dispatch(fetchDailySalesAllDays());
  }, [dispatch]);

  // Process daily sales data for the last seven days
  useEffect(() => {
    if (dailySalesAllDaysStatus === "succeeded" && dailySalesAllDays) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      const lastWeekStart = new Date(sevenDaysAgo);
      lastWeekStart.setDate(sevenDaysAgo.getDate() - 7);

      const dailySalesMap = new Map(
        dailySalesAllDays.map((sale) => [sale.date, sale.totalSales])
      );

      const lastWeekData = [];
      const runningWeekData = [];
      const categories = [];
      for (let i = 0; i < 7; i++) {
        const lastWeekDate = new Date(lastWeekStart);
        lastWeekDate.setDate(lastWeekStart.getDate() + i);
        const runningWeekDate = new Date(sevenDaysAgo);
        runningWeekDate.setDate(sevenDaysAgo.getDate() + i);

        const lastWeekDateStr = lastWeekDate.toISOString().split("T")[0];
        const runningWeekDateStr = runningWeekDate.toISOString().split("T")[0];

        const dayName = runningWeekDate.toLocaleString("en-US", {
          weekday: "short",
        });

        lastWeekData.push(dailySalesMap.get(lastWeekDateStr) || 0);
        runningWeekData.push(dailySalesMap.get(runningWeekDateStr) || 0);
        categories.push(dayName);
      }

      setChartData({
        series: [
          { name: "Last Week", data: lastWeekData },
          { name: "Running Week", data: runningWeekData },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            ...chartData.options.xaxis,
            categories,
          },
        },
      });
    }
  }, [dailySalesAllDaysStatus, dailySalesAllDays]);

  // Calculate percentage difference
  const calculatePercentageChange = () => {
    const previousWeekRevenue =
      chartData.series[0]?.data.reduce((a, b) => a + b, 0) || 0;
    const currentWeekRevenue =
      chartData.series[1]?.data.reduce((a, b) => a + b, 0) || 0;

    if (previousWeekRevenue === 0) {
      return currentWeekRevenue > 0 ? 100 : 0; // If last week is 0, return 100% if there's revenue, else 0%
    }
    const difference = currentWeekRevenue - previousWeekRevenue;
    const percentageChange = (difference / previousWeekRevenue) * 100;
    return Number(percentageChange.toFixed(1)); // Round to 1 decimal place
  };

  const percentageChange = calculatePercentageChange();
  const isIncrease = percentageChange >= 0;

  // Format total sales with Naira symbol and commas
  const formatCurrency = (amount) => {
    return `₦${(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const totalSales = allTimeSales?.totalSales || 0;

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
          "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
      }}
    >
      <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
        Total Revenue
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        {allTimeSalesStatus === "loading" ? (
          <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
            Loading...
          </Typography>
        ) : allTimeSalesStatus === "failed" ? (
          <Typography fontSize={28} fontWeight={700} color="#ff6f61">
            Error
          </Typography>
        ) : (
          <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
            {formatCurrency(totalSales)}
          </Typography>
        )}
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

      <ReactApexChart
        series={chartData.series}
        type="bar"
        height={310}
        options={chartData.options}
      />
    </Box>
  );
};

export default LaundriesRevenue;
