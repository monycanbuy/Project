// import ReactApexChart from "react-apexcharts";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";

// const SeminarCharts = ({ title, value, series, colors }) => {
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
//     >
//       <Stack direction="column">
//         <Typography fontSize={14} color="#808191">
//           {title}
//         </Typography>
//         <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
//           {value}
//         </Typography>
//       </Stack>

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

// export default SeminarCharts;

//SeminarChart components
import ReactApexChart from "react-apexcharts";
import { Box, Typography, Stack } from "@mui/material";

const SeminarChart = ({ title, value, series, colors, labels }) => {
  const chartOptions = {
    chart: {
      type: "donut",
    },
    colors: colors,
    labels: labels, // Use event types as labels (from props)
    legend: {
      show: true,
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      //ADD TOOLTIP
      y: {
        formatter: function (val, opts) {
          // Get the corresponding label (which is the event type)
          const eventType = opts.w.config.labels[opts.seriesIndex];
          //console.log("eventType", eventType)
          return `${eventType} - ₦${val.toFixed(2)}`; // "Event Type - Value"
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: false, // Keep this as false
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: function (val) {
                return "₦" + val;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

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

      {/* <ReactApexChart
        options={chartOptions}
        series={series}
        type="donut"
        width={120}
      /> */}
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

export default SeminarChart;
