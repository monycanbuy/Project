// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import CircularProgress from "@mui/material/CircularProgress";
// import InventoryCharts from "../../../charts/InventoryAdjustment/InventoryCharts";
// import ReactApexChart from "react-apexcharts"; // Add bar chart
// import { fetchDailyProfitAndLoss } from "../../../redux/slices/inventoryAdjustmentSlice";

// const InventoryAdjustmentReports = () => {
//   const dispatch = useDispatch();
//   const { dailyProfitAndLoss, status, error } = useSelector(
//     (state) => state.inventoryAdjustments
//   );

//   useEffect(() => {
//     console.log("Component Mounted - Dispatching fetchDailyProfitAndLoss");
//     dispatch(fetchDailyProfitAndLoss());
//   }, [dispatch]);

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

//   // Bar chart configuration
//   const barChartOptions = {
//     chart: {
//       type: "bar",
//       height: 350,
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "55%",
//         endingShape: "rounded",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     xaxis: {
//       categories: ["Revenue", "COGS", "Losses", "Profit"],
//       labels: {
//         style: {
//           colors: "#fff", // White for contrast
//         },
//       },
//     },
//     yaxis: {
//       title: {
//         text: "Amount (₦)",
//         style: { color: "#fff" },
//       },
//       labels: {
//         style: { colors: "#fff" },
//         formatter: (val) => `₦${val.toLocaleString("en-NG")}`,
//       },
//     },
//     colors: ["#fe6c00", "#efb405", "#473b33", "#ffc397"], // Match your chart colors
//     legend: { show: false }, // No legend needed for single series
//     tooltip: {
//       y: {
//         formatter: (val) => `₦${val.toLocaleString("en-NG")}`,
//       },
//     },
//   };

//   const barChartSeries = [
//     {
//       name: "Daily P&L",
//       data: [
//         dailyProfitAndLoss.revenue,
//         dailyProfitAndLoss.cogs,
//         dailyProfitAndLoss.inventoryLosses,
//         dailyProfitAndLoss.profit,
//       ],
//     },
//   ];

//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#fe6c00">
//         Dashboard - {dailyProfitAndLoss.date || "Today"}
//       </Typography>

//       <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
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
//         <Box
//           p={4}
//           flex={1}
//           //bgcolor="#1A1F2B"
//           borderRadius="15px"
//           sx={{
//             background:
//               "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//           }}
//         >
//           <Typography fontSize={18} fontWeight={600} color="#fe6c00" mb={2}>
//             Daily Profit & Loss Overview
//           </Typography>
//           <ReactApexChart
//             options={barChartOptions}
//             series={barChartSeries}
//             type="bar"
//             height={350}
//           />
//         </Box>
//       </Stack>
//     </Box>
//   );
// };

// export default InventoryAdjustmentReports;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import InventoryCharts from "../../../charts/InventoryAdjustment/InventoryCharts";
import ReactApexChart from "react-apexcharts";
import { fetchDailyProfitAndLoss } from "../../../redux/slices/inventoryAdjustmentSlice";
import { checkAuthStatus } from "../../../redux/slices/authSlice";

const InventoryAdjustmentReports = () => {
  const dispatch = useDispatch();
  const {
    dailyProfitAndLoss = {
      revenue: 0,
      cogs: 0,
      inventoryLosses: 0,
      profit: 0,
      date: "",
    },
    status = "idle",
    error,
  } = useSelector((state) => state.inventoryAdjustments || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("InventoryAdjustmentReports - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching daily profit and loss...");
        dispatch(fetchDailyProfitAndLoss());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching daily profit and loss...");
            dispatch(fetchDailyProfitAndLoss());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    //console.log("State Updated:", { dailyProfitAndLoss, status, error });
  }, [dailyProfitAndLoss, status, error]);

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view inventory adjustment reports.
        </Typography>
      </Box>
    );
  }

  if (status === "loading" && !dailyProfitAndLoss.revenue) {
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

  if (status === "failed" || error) {
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
          Error: {error?.message || "Failed to load profit and loss data"}
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
        style: { colors: "#fff" },
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
    colors: ["#fe6c00", "#efb405", "#473b33", "#ffc397"],
    legend: { show: false },
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
          sx={{
            background:
              "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
            borderRadius: "15px",
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
