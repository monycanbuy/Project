// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import {
//   getAllTimeTotalSales,
//   getMonthlySalesComparison,
// } from "../../redux/slices/aggregateSalesSlice";
// import { Stack } from "@mui/material";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import ReactApexChart from "react-apexcharts";

// const DashboardRevenue = () => {
//   const dispatch = useDispatch();
//   const { allTimeTotalSales, monthlyComparison, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );

//   useEffect(() => {
//     console.log("Current status:", status);
//     if (status === "idle") {
//       console.log("Dispatching getAllTimeTotalSales...");
//       dispatch(getAllTimeTotalSales());
//       console.log("Dispatching getMonthlySalesComparison...");
//       dispatch(getMonthlySalesComparison());
//     }
//   }, [dispatch, status]);

//   if (status === "loading") {
//     return (
//       <Box p={4} flex={1} display="flex" flexDirection="column">
//         <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//           Loading...
//         </Typography>
//       </Box>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <Box p={4} flex={1} display="flex" flexDirection="column">
//         <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//           Error: {error}
//         </Typography>
//       </Box>
//     );
//   }

//   console.log("allTimeTotalSales:", allTimeTotalSales);

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
//         Total Revenue (All Time)
//       </Typography>
//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         <Typography fontSize={28} fontWeight={700} color="#d9cfcf" my="20px">
//           ₦
//           {(allTimeTotalSales ?? 0).toLocaleString("en-NG", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
//           <Stack>
//             <Typography fontSize={15} color="#ff6f61">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#808191">
//               Than Last Month
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>
//       <ReactApexChart
//         series={monthlyComparison.series.map((serie) => ({
//           name: serie.name,
//           data: [...serie.data], // Deep copy of data array
//         }))} // Ensure fully extensible series
//         type="bar"
//         height={310}
//         options={Object.assign(
//           {},
//           {
//             chart: {
//               type: "bar",
//               height: 310,
//               toolbar: {
//                 show: false,
//               },
//             },
//             plotOptions: {
//               bar: {
//                 horizontal: false,
//                 columnWidth: "55%",
//                 endingShape: "rounded",
//               },
//             },
//             dataLabels: {
//               enabled: false,
//             },
//             stroke: {
//               show: true,
//               width: 2,
//               colors: ["transparent"],
//             },
//             xaxis: {
//               categories: [...monthlyComparison.dates], // Fresh copy of dates
//               labels: {
//                 style: {
//                   colors: "#fcfcfc",
//                 },
//               },
//             },
//             yaxis: {
//               title: {
//                 text: "Sales (₦)",
//                 style: {
//                   color: "#fcfcfc",
//                 },
//               },
//               labels: {
//                 style: {
//                   colors: "#fcfcfc",
//                 },
//                 formatter: (value) => `₦${value.toLocaleString("en-NG")}`,
//               },
//             },
//             fill: {
//               opacity: 1,
//             },
//             tooltip: {
//               y: {
//                 formatter: (value) => `₦${value.toLocaleString("en-NG")}`,
//               },
//             },
//             colors: ["#FF4560", "#00E396"],
//             legend: {
//               position: "top",
//               labels: {
//                 colors: "#fcfcfc",
//               },
//             },
//           }
//         )} // Ensure extensible options object
//       />
//     </Box>
//   );
// };

// export default DashboardRevenue;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import {
//   getAllTimeTotalSales,
//   getMonthlySalesComparison,
// } from "../../redux/slices/aggregateSalesSlice";
// import { Stack } from "@mui/material";
// import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
// import ReactApexChart from "react-apexcharts";
// import CircularProgress from "@mui/material/CircularProgress"; // Added for loading indicator

// const DashboardRevenue = () => {
//   const dispatch = useDispatch();
//   const { allTimeTotalSales, monthlyComparison, status, error } = useSelector(
//     (state) => state.aggregateSales
//   );

//   useEffect(() => {
//     console.log("Current status:", status);
//     if (status === "idle") {
//       console.log("Dispatching getAllTimeTotalSales...");
//       dispatch(getAllTimeTotalSales());
//       console.log("Dispatching getMonthlySalesComparison...");
//       dispatch(getMonthlySalesComparison());
//     }
//   }, [dispatch, status]);

//   if (status === "loading") {
//     return (
//       <Box p={4} flex={1} display="flex" flexDirection="column">
//         <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//           Loading...
//         </Typography>
//       </Box>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <Box p={4} flex={1} display="flex" flexDirection="column">
//         <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
//           Error: {error}
//         </Typography>
//       </Box>
//     );
//   }

//   console.log("allTimeTotalSales:", allTimeTotalSales);

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
//         Total Revenue (All Time)
//       </Typography>
//       <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
//         <Typography fontSize={28} fontWeight={700} color="#d9cfcf" my="20px">
//           ₦
//           {(allTimeTotalSales ?? 0).toLocaleString("en-NG", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}
//         </Typography>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
//           <Stack>
//             <Typography fontSize={15} color="#ff6f61">
//               0.8%
//             </Typography>
//             <Typography fontSize={12} color="#808191">
//               Than Last Month
//             </Typography>
//           </Stack>
//         </Stack>
//       </Stack>
//       {status === "loading" ? (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           height={310}
//         >
//           <CircularProgress sx={{ color: "#fcfcfc" }} />{" "}
//           {/* White circular loader */}
//         </Box>
//       ) : (
//         <ReactApexChart
//           series={monthlyComparison.series.map((serie) => ({
//             name: serie.name,
//             data: [...serie.data],
//           }))}
//           type="bar"
//           height={310}
//           options={Object.assign(
//             {},
//             {
//               chart: {
//                 type: "bar",
//                 height: 310,
//                 toolbar: {
//                   show: false,
//                 },
//               },
//               plotOptions: {
//                 bar: {
//                   horizontal: false,
//                   columnWidth: "55%",
//                   endingShape: "rounded",
//                 },
//               },
//               dataLabels: {
//                 enabled: false,
//               },
//               stroke: {
//                 show: true,
//                 width: 2,
//                 colors: ["transparent"],
//               },
//               xaxis: {
//                 categories: [...monthlyComparison.dates],
//                 labels: {
//                   style: {
//                     colors: "#fcfcfc",
//                   },
//                 },
//               },
//               yaxis: {
//                 title: {
//                   text: "Sales (₦)",
//                   style: {
//                     color: "#fcfcfc",
//                   },
//                 },
//                 labels: {
//                   style: {
//                     colors: "#fcfcfc",
//                   },
//                   formatter: (value) => `₦${value.toLocaleString("en-NG")}`,
//                 },
//               },
//               fill: {
//                 opacity: 1,
//               },
//               tooltip: {
//                 y: {
//                   formatter: (value) => `₦${value.toLocaleString("en-NG")}`,
//                 },
//               },
//               colors: ["#FF4560", "#00E396"],
//               legend: {
//                 position: "top",
//                 labels: {
//                   colors: "#fcfcfc",
//                 },
//               },
//             }
//           )}
//         />
//       )}
//     </Box>
//   );
// };

// export default DashboardRevenue;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  getAllTimeTotalSales,
  getMonthlySalesComparison,
} from "../../redux/slices/aggregateSalesSlice";
import { Stack } from "@mui/material";
import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
import ReactApexChart from "react-apexcharts";
import CircularProgress from "@mui/material/CircularProgress";

const DashboardRevenue = () => {
  const dispatch = useDispatch();
  const { allTimeTotalSales, monthlyComparison, status, error } = useSelector(
    (state) => state.aggregateSales
  );

  useEffect(() => {
    console.log("Current status:", status);
    if (status === "idle") {
      console.log("Dispatching getAllTimeTotalSales...");
      dispatch(getAllTimeTotalSales());
      console.log("Dispatching getMonthlySalesComparison...");
      dispatch(getMonthlySalesComparison());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return (
      <Box p={4} flex={1} display="flex" flexDirection="column">
        <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box p={4} flex={1} display="flex" flexDirection="column">
        <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  console.log("allTimeTotalSales:", allTimeTotalSales);
  console.log("monthlyComparison:", monthlyComparison);

  // Calculate percentage change from monthlyComparison
  const lastMonthSales =
    monthlyComparison.series
      .find((s) => s.name === "Last Month")
      ?.data.reduce((sum, val) => sum + val, 0) || 0;
  const runningMonthSales =
    monthlyComparison.series
      .find((s) => s.name === "Running Month")
      ?.data.reduce((sum, val) => sum + val, 0) || 0;
  const percentageChange =
    lastMonthSales === 0
      ? runningMonthSales > 0
        ? 100
        : 0 // If last month is 0, show 100% if running month has sales, else 0%
      : (((runningMonthSales - lastMonthSales) / lastMonthSales) * 100).toFixed(
          1
        );
  const isIncrease = runningMonthSales >= lastMonthSales;

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
        Total Revenue (All Time)
      </Typography>
      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        <Typography fontSize={28} fontWeight={700} color="#d9cfcf" my="20px">
          ₦
          {(allTimeTotalSales ?? 0).toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
          <Stack>
            <Typography
              fontSize={15}
              color={isIncrease ? "#ff6f61" : "#00E396"}
            >
              {percentageChange}%
            </Typography>
            <Typography fontSize={12} color="#808191">
              Than Last Month
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {status === "loading" ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={310}
        >
          <CircularProgress sx={{ color: "#fcfcfc" }} />
        </Box>
      ) : (
        <ReactApexChart
          series={monthlyComparison.series.map((serie) => ({
            name: serie.name,
            data: [...serie.data],
          }))}
          type="bar"
          height={310}
          options={Object.assign(
            {},
            {
              chart: {
                type: "bar",
                height: 310,
                toolbar: {
                  show: false,
                },
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
              stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
              },
              xaxis: {
                categories: [...monthlyComparison.dates],
                labels: {
                  style: {
                    colors: "#fcfcfc",
                  },
                },
              },
              yaxis: {
                title: {
                  text: "Sales (₦)",
                  style: {
                    color: "#fcfcfc",
                  },
                },
                labels: {
                  style: {
                    colors: "#fcfcfc",
                  },
                  formatter: (value) => `₦${value.toLocaleString("en-NG")}`,
                },
              },
              fill: {
                opacity: 1,
              },
              tooltip: {
                y: {
                  formatter: (value) => `₦${value.toLocaleString("en-NG")}`,
                },
              },
              colors: ["#FF4560", "#00E396"],
              legend: {
                position: "top",
                labels: {
                  colors: "#fcfcfc",
                },
              },
            }
          )}
        />
      )}
    </Box>
  );
};

export default DashboardRevenue;
