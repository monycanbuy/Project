//import { useList } from "@refinedev/core";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import InventoryCharts from "../../../charts/InventoryAdjustment/InventoryCharts";

// const InventoryAdjustmentReports = () => {

//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//         Dashboard
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//       <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//         Date
//       </Typography>
//         <InventoryCharts
//           title="Revenue"
//           value={684}
//           series={[75, 25]}
//           colors={["#e827be", "#3b05c5"]}
//         />
//         <InventoryCharts
//           title="Cogs"
//           value={550}
//           series={[60, 40]}
//           colors={["#efb405", "#01582b"]}
//         />
//         <InventoryCharts
//           title="Inventory Losses"
//           value={5684}
//           series={[75, 25]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <InventoryCharts
//           title="Profit"
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
//       >
//         {/* <TotalRevenue />
//         <PropertyReferrals /> */}
//       </Stack>
//     </Box>
//   );
// };

// export default InventoryAdjustmentReports;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import CircularProgress from "@mui/material/CircularProgress";
// import InventoryCharts from "../../../charts/InventoryAdjustment/InventoryCharts";
// import { fetchDailyProfitAndLoss } from "../../../redux/slices/inventoryAdjustmentSlice";

// const InventoryAdjustmentReports = () => {
//   const dispatch = useDispatch();
//   const { dailyProfitAndLoss, status, error } = useSelector(
//     (state) => state.inventoryAdjustments
//   );

//   // Dispatch on mount, no dependency on status
//   useEffect(() => {
//     console.log("Component Mounted - Dispatching fetchDailyProfitAndLoss");
//     dispatch(fetchDailyProfitAndLoss());
//   }, [dispatch]);

//   // Log state changes
//   useEffect(() => {
//     console.log("State Updated:", { dailyProfitAndLoss, status, error });
//   }, [dailyProfitAndLoss, status, error]);

//   if (status === "loading") {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <Box p={4}>
//         <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//           Dashboard
//         </Typography>
//         <Typography mt={2} color="#fff">
//           Error: {error?.message || "Failed to load profit and loss data"}
//         </Typography>
//       </Box>
//     );
//   }

//   const total =
//     dailyProfitAndLoss.revenue +
//     dailyProfitAndLoss.cogs +
//     dailyProfitAndLoss.inventoryLosses;
//   const revenuePercentage =
//     total > 0 ? (dailyProfitAndLoss.revenue / total) * 100 : 75;
//   const cogsPercentage =
//     total > 0 ? (dailyProfitAndLoss.cogs / total) * 100 : 60;
//   const lossesPercentage =
//     total > 0 ? (dailyProfitAndLoss.inventoryLosses / total) * 100 : 75;

//   console.log("Rendering with dailyProfitAndLoss:", dailyProfitAndLoss);

//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//         Dashboard
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//         <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//           {dailyProfitAndLoss.date || "Today"}
//         </Typography>
//         <InventoryCharts
//           title="Revenue"
//           value={dailyProfitAndLoss.revenue}
//           series={[revenuePercentage, 100 - revenuePercentage]}
//           colors={["#e827be", "#3b05c5"]}
//         />
//         <InventoryCharts
//           title="COGS"
//           value={dailyProfitAndLoss.cogs}
//           series={[cogsPercentage, 100 - cogsPercentage]}
//           colors={["#efb405", "#01582b"]}
//         />
//         <InventoryCharts
//           title="Inventory Losses"
//           value={dailyProfitAndLoss.inventoryLosses}
//           series={[lossesPercentage, 100 - lossesPercentage]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//         <InventoryCharts
//           title="Profit"
//           value={dailyProfitAndLoss.profit}
//           series={[
//             dailyProfitAndLoss.profit >= 0 ? 75 : 25,
//             dailyProfitAndLoss.profit >= 0 ? 25 : 75,
//           ]}
//           colors={["#275be8", "#c4e8ef"]}
//         />
//       </Box>

//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       >
//         {/* <TotalRevenue /> <PropertyReferrals /> */}
//       </Stack>
//     </Box>
//   );
// };

// export default InventoryAdjustmentReports;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import InventoryCharts from "../../../charts/InventoryAdjustment/InventoryCharts";
import ReactApexChart from "react-apexcharts"; // Add bar chart
import { fetchDailyProfitAndLoss } from "../../../redux/slices/inventoryAdjustmentSlice";

const InventoryAdjustmentReports = () => {
  const dispatch = useDispatch();
  const { dailyProfitAndLoss, status, error } = useSelector(
    (state) => state.inventoryAdjustments
  );

  useEffect(() => {
    console.log("Component Mounted - Dispatching fetchDailyProfitAndLoss");
    dispatch(fetchDailyProfitAndLoss());
  }, [dispatch]);

  useEffect(() => {
    console.log("State Updated:", { dailyProfitAndLoss, status, error });
  }, [dailyProfitAndLoss, status, error]);

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress sx={{ color: "#fe6c00" }} />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box p={4}>
        <Typography fontSize={25} fontWeight={700} color="#fe6c00">
          Dashboard
        </Typography>
        <Typography mt={2} color="#fff">
          Error: {error?.message || "Failed to load profit and loss data"}
        </Typography>
      </Box>
    );
  }

  const total =
    dailyProfitAndLoss.revenue +
    dailyProfitAndLoss.cogs +
    dailyProfitAndLoss.inventoryLosses;
  const revenuePercentage =
    total > 0 ? (dailyProfitAndLoss.revenue / total) * 100 : 75;
  const cogsPercentage =
    total > 0 ? (dailyProfitAndLoss.cogs / total) * 100 : 60;
  const lossesPercentage =
    total > 0 ? (dailyProfitAndLoss.inventoryLosses / total) * 100 : 75;

  // Bar chart configuration
  const barChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Revenue", "COGS", "Losses", "Profit"],
      labels: {
        style: {
          colors: "#fff", // White for contrast
        },
      },
    },
    yaxis: {
      title: {
        text: "Amount (₦)",
        style: { color: "#fff" },
      },
      labels: {
        style: { colors: "#fff" },
        formatter: (val) => `₦${val.toLocaleString("en-NG")}`,
      },
    },
    colors: ["#fe6c00", "#efb405", "#473b33", "#ffc397"], // Match your chart colors
    legend: { show: false }, // No legend needed for single series
    tooltip: {
      y: {
        formatter: (val) => `₦${val.toLocaleString("en-NG")}`,
      },
    },
  };

  const barChartSeries = [
    {
      name: "Daily P&L",
      data: [
        dailyProfitAndLoss.revenue,
        dailyProfitAndLoss.cogs,
        dailyProfitAndLoss.inventoryLosses,
        dailyProfitAndLoss.profit,
      ],
    },
  ];

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#fe6c00">
        Dashboard - {dailyProfitAndLoss.date || "Today"}
      </Typography>

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
        <InventoryCharts
          title="Revenue"
          value={dailyProfitAndLoss.revenue}
          series={[revenuePercentage, 100 - revenuePercentage]}
          colors={["#e827be", "#3b05c5"]}
        />
        <InventoryCharts
          title="COGS"
          value={dailyProfitAndLoss.cogs}
          series={[cogsPercentage, 100 - cogsPercentage]}
          colors={["#efb405", "#01582b"]}
        />
        <InventoryCharts
          title="Inventory Losses"
          value={dailyProfitAndLoss.inventoryLosses}
          series={[lossesPercentage, 100 - lossesPercentage]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <InventoryCharts
          title="Profit"
          value={dailyProfitAndLoss.profit}
          series={[
            dailyProfitAndLoss.profit >= 0 ? 75 : 25,
            dailyProfitAndLoss.profit >= 0 ? 25 : 75,
          ]}
          colors={["#275be8", "#c4e8ef"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <Box
          p={4}
          flex={1}
          //bgcolor="#1A1F2B"
          borderRadius="15px"
          sx={{
            background:
              "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
          }}
        >
          <Typography fontSize={18} fontWeight={600} color="#fe6c00" mb={2}>
            Daily Profit & Loss Overview
          </Typography>
          <ReactApexChart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={350}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default InventoryAdjustmentReports;
