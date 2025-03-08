// KabasaCharts.jsx
// import React from "react";
// import ReactApexChart from "react-apexcharts";
// import { Box, Typography, Stack } from "@mui/material";

// const KabasaChart = ({ title, series, categories }) => {
//   // Format currency as NGN for tooltips
//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(amount || 0);

//   const chartOptions = {
//     chart: {
//       type: "bar",
//       toolbar: {
//         show: false,
//       },
//     },
//     colors: ["#fe6c00"], // Single color for bars (adjustable)
//     plotOptions: {
//       bar: {
//         borderRadius: 4,
//         horizontal: false,
//         columnWidth: "55%",
//       },
//     },
//     dataLabels: {
//       enabled: false, // No labels on bars
//     },
//     grid: {
//       show: false, // Clean look without grid
//     },
//     stroke: {
//       colors: ["transparent"],
//       width: 4,
//     },
//     xaxis: {
//       categories: categories, // Dynamic day names (e.g., "Mon", "Tue")
//       labels: {
//         style: {
//           colors: "#bdbabb",
//         },
//       },
//     },
//     yaxis: {
//       title: {
//         text: "₦ (thousands)", // NGN in thousands
//         style: {
//           color: "#fe6c00",
//         },
//       },
//       labels: {
//         style: {
//           colors: "#fff",
//         },
//       },
//     },
//     tooltip: {
//       y: {
//         formatter: (val, opts) => {
//           const day = opts.w.config.xaxis.categories[opts.dataPointIndex];
//           return `${day} - ${formatCurrency(val * 1000)}`; // Convert back from thousands
//         },
//       },
//     },
//     legend: {
//       show: false, // No legend needed for single series
//     },
//   };

//   return (
//     <Box
//       id="chart"
//       flex={1}
//       display="flex"
//       flexDirection="column" // Changed to column for bar chart layout
//       justifyContent="space-between"
//       alignItems="center"
//       pl={3.5}
//       py={2}
//       gap={2}
//       borderRadius="15px"
//       minHeight="310px" // Adjusted height for bar chart
//       width="fit-content"
//       sx={{
//         background:
//           "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Stack direction="column">
//         <Typography fontSize={14} color="#d9cfcf">
//           {title}
//         </Typography>
//       </Stack>

//       {/* <ReactApexChart
//         options={chartOptions}
//         series={series}
//         type="bar"
//         height={260} // Adjusted to fit within box
//         width="100%"
//       /> */}
//       <ReactApexChart
//         options={{
//           chart: { type: "donut" },
//           colors,
//           legend: { show: false },
//           dataLabels: { enabled: false },
//         }}
//         series={series}
//         type="donut"
//         width="120px"
//       />
//     </Box>
//   );
// };

// export default KabasaChart;

// KabasaCharts.jsx
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Typography, Stack } from "@mui/material";

const KabasaChart = ({ title, series, categories }) => {
  // Format currency as NGN for tooltips
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#fe6c00"], // Single color for bars (adjustable)
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false, // No labels on bars
    },
    grid: {
      show: false, // Clean look without grid
    },
    stroke: {
      colors: ["transparent"],
      width: 4,
    },
    xaxis: {
      categories: categories, // Dynamic day names (e.g., "Mon", "Tue")
      labels: {
        style: {
          colors: "#bdbabb",
        },
      },
    },
    yaxis: {
      title: {
        text: "₦ (thousands)", // NGN in thousands
        style: {
          color: "#fe6c00",
        },
      },
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const day = opts.w.config.xaxis.categories[opts.dataPointIndex];
          return `${day} - ${formatCurrency(val * 1000)}`; // Convert back from thousands
        },
      },
    },
    legend: {
      show: false, // No legend needed for single series
    },
  };

  return (
    <Box
      id="chart"
      flex={1}
      display="flex"
      flexDirection="column" // Changed to column for bar chart layout
      justifyContent="space-between"
      alignItems="center"
      pl={3.5}
      py={2}
      gap={2}
      borderRadius="15px"
      minHeight="310px" // Adjusted height for bar chart
      width="fit-content"
      sx={{
        background:
          "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
      }}
    >
      <Stack direction="column">
        <Typography fontSize={14} color="#d9cfcf">
          {title}
        </Typography>
      </Stack>

      <ReactApexChart
        options={chartOptions}
        series={series}
        type="bar"
        height={260} // Adjusted to fit within box
        width="100%"
      />
    </Box>
  );
};

export default KabasaChart;
