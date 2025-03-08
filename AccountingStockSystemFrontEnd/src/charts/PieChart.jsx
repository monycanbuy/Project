//import type { PieChartProps } from "interfaces/home";

import { Box, Stack, Typography } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import React from "react";

const PieChart = ({ title, value, series, colors }) => {
  return (
    <Box
      id="chart"
      flex={1}
      display="flex"
      //bgcolor="#fcfcfc"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      pl={3.5}
      py={2}
      gap={2}
      borderRadius="15px"
      minHeight="110px"
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
        <Typography fontSize={24} color="#fe6c00" fontWeight={700} mt={1}>
          {value}
        </Typography>
      </Stack>
      <ReactApexChart
        options={{
          chart: { type: "donut" },
          colors,
          legend: { show: false },
          dataLabels: { enabled: false },
        }}
        series={series}
        type="donut"
        width="120px"
      />
    </Box>
  );
};

export default PieChart;

// src/charts/PieChart.jsx

// // src/charts/PieChart.jsx
// import { Box, Stack, Typography } from "@mui/material";
// import ReactApexChart from "react-apexcharts";
// import React from "react";

// const PieChart = ({ title, value, series, colors }) => {
//   const chartOptions = {
//     chart: {
//       type: "donut", // Keep as donut
//     },
//     colors: colors, // Use the provided colors
//     labels: ["Value", "Remaining"], //  Add labels for clarity
//     legend: { show: false }, // Keep legend hidden (optional)
//     dataLabels: {
//       enabled: true, //  Show percentage labels INSIDE the chart
//       formatter: function (val) {
//         return val.toFixed(1) + "%"; // Format as percentage with one decimal place
//       },
//       style: {
//         fontSize: "14px", // Style the labels
//         fontFamily: "Helvetica, Arial, sans-serif",
//         fontWeight: "bold",
//       },
//     },
//     plotOptions: {
//       // Add plotOptions for more control
//       pie: {
//         donut: {
//           size: "75%", // Control donut size
//           labels: {
//             show: true, // Show value labels inside
//             value: {
//               show: true,
//               fontSize: "22px",
//               fontFamily: "Helvetica, Arial, sans-serif",
//               fontWeight: 600,
//               color: undefined,
//               offsetY: -10, // Adjust vertical position
//               formatter: function (val) {
//                 return val.toFixed(1) + "%";
//               },
//             },
//             name: {
//               //name of the label
//               show: true,
//               fontSize: "16px",
//               fontFamily: "Helvetica, Arial, sans-serif",
//               fontWeight: 400,
//               color: undefined,
//               offsetY: 20, // Adjust vertical position of the name
//             },
//             total: {
//               // Total label (optional)
//               show: true,
//               label: title,
//               fontSize: "14px",
//               color: "#888",
//               formatter: function (w) {
//                 //  Format the total value (add commas, currency symbol, etc.)
//                 return value; //show original value
//               },
//             },
//           },
//         },
//       },
//     },
//   };

//   return (
//     <Box
//       id="chart"
//       flex={1}
//       display="flex"
//       bgcolor="#fcfcfc"
//       flexDirection="row"
//       justifyContent="space-between"
//       alignItems="center"
//       pl={3.5}
//       py={2}
//       gap={2}
//       borderRadius="15px"
//       minHeight="110px"
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
//         <Typography fontSize={24} color="#fe6c00" fontWeight={700} mt={1}>
//           {/* Display the value prop */}
//           {value}
//         </Typography>
//       </Stack>

//       <ReactApexChart
//         options={chartOptions}
//         series={series}
//         type="donut"
//         width={120}
//       />
//     </Box>
//   );
// };

// export default PieChart;
