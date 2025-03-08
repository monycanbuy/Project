// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";

// import { TotalRevenueOptions, TotalRevenueSeries } from "../chart.config";

// const AdminRevenue = () => {
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
//           "linear-gradient(114.07deg, rgba(57, 53, 51, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
//       }}
//     >
//       <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//         Task Achievements
//       </Typography>

//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
//           $236,535
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
//           <Stack>
//             <Typography fontSize={15} color="#ff6f61">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#fcfcfc">
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

// export default AdminRevenue;

import React from "react";
import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const AdminRevenue = ({ staffTaskAchievements = [] }) => {
  console.log("staffTaskAchievements in AdminRevenue:", staffTaskAchievements);

  const totalTasks = staffTaskAchievements.reduce(
    (sum, staff) => sum + (staff.tasksCompleted || 0),
    0
  );

  // Ensure treemap displays even with zero values
  const series = [
    {
      data:
        staffTaskAchievements.length > 0
          ? staffTaskAchievements.map((staff) => ({
              x: staff.fullName || "Unknown",
              y: staff.tasksCompleted > 0 ? staff.tasksCompleted : 1, // Minimum value of 1 for visibility
            }))
          : [{ x: "No Tasks", y: 1 }],
    },
  ];

  const options = {
    chart: {
      type: "treemap",
      height: 310,
      toolbar: { show: false },
    },
    title: {
      text: "Staff Task Achievements",
      align: "left",
      style: { fontSize: "18px", fontWeight: 600, color: "#fcfcfc" },
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
    colors: [
      "#fe6c00",
      "#1bf81b",
      "#e827be",
      "#0344f5",
      "#7411d6",
      "#ff9800",
      "#4caf50",
      "#f44336",
      "#2196f3",
      "#9c27b0",
    ],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        color: "#fff",
      },
      formatter: (text, op) =>
        staffTaskAchievements.length > 0 && totalTasks > 0
          ? `${text}: ${
              staffTaskAchievements[op.dataPointIndex].tasksCompleted
            }`
          : "No Tasks",
    },
    tooltip: {
      y: {
        formatter: (value) =>
          staffTaskAchievements.length > 0 && totalTasks > 0
            ? `${
                value === 1 &&
                staffTaskAchievements[op.dataPointIndex]?.tasksCompleted === 0
                  ? 0
                  : value
              } tasks`
            : "No tasks",
      },
    },
    noData: {
      text: "No staff task data available",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#fff",
        fontSize: "14px",
      },
    },
  };

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
        Task Achievements
      </Typography>

      <Box my="20px">
        <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
          {totalTasks} Tasks
        </Typography>
      </Box>

      <ReactApexChart
        options={options}
        series={series}
        type="treemap"
        height={310}
      />
    </Box>
  );
};

export default AdminRevenue;
