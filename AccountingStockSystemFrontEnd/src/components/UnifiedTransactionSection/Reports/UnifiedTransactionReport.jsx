// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import SalesCharts from "../../../charts/SalesTransaction/SalesCharts";
// import { fetchTodaySales } from "../../../redux/slices/salesTransactionSlice"; // Adjust path
// import SalesRevenue from "../../../charts/SalesTransaction/SalesRevenue";
// import TopSalesPaymentMethod from "../../../charts/TopSalesPaymentMethod";

// const UnifiedTransactionReport = () => {
//   const dispatch = useDispatch();
//   const { todaySales, todaySalesStatus, todaySalesError } = useSelector(
//     (state) => state.salesTransactions
//   );

//   // Fetch today's sales on mount
//   useEffect(() => {
//     dispatch(fetchTodaySales());
//   }, [dispatch]);

//   // Extract sales data with fallback values
//   const totalSales = todaySales?.totalSales || 0;
//   const restaurantSales = todaySales?.breakdown?.restaurant || 0;
//   const minimartSales = todaySales?.breakdown?.minimart || 0;

//   // Format values with Naira symbol
//   const formatValue = (value) =>
//     `₦${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

//   return (
//     <Box>
//       <Typography fontSize={25} fontWeight={700} color="#fcfcfc">
//         Dashboard
//       </Typography>

//       {/* Loading and Error States */}
//       {todaySalesStatus === "loading" && (
//         <Typography>Loading today's sales...</Typography>
//       )}
//       {todaySalesStatus === "failed" && (
//         <Typography color="error">
//           Error: {todaySalesError?.message || "Failed to load today's sales"}
//         </Typography>
//       )}

//       {/* Display Charts */}
//       {todaySalesStatus === "succeeded" && (
//         <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
//           <SalesCharts
//             title="Total Sales" // Fixed typo from "totalSales to "Total Sales"
//             value={formatValue(totalSales)}
//             series={[totalSales]}
//             colors={["#275be8"]}
//           />
//           <SalesCharts
//             title="Restaurant"
//             value={formatValue(restaurantSales)}
//             series={[restaurantSales]}
//             colors={["#275be8"]}
//           />
//           <SalesCharts
//             title="Minimart"
//             value={formatValue(minimartSales)}
//             series={[minimartSales]}
//             colors={["#275be8"]}
//           />
//         </Box>
//       )}

//       <Stack
//         mt="25px"
//         width="100%"
//         direction={{ xs: "column", lg: "row" }}
//         gap={4}
//       >
//         <SalesRevenue />
//         <TopSalesPaymentMethod />
//       </Stack>
//     </Box>
//   );
// };

// export default UnifiedTransactionReport;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SalesCharts from "../../../charts/SalesTransaction/SalesCharts";
import {
  fetchTodaySales,
  fetchLastSevenDaysSales,
  fetchAllTimeTotalSales,
  fetchDailySalesByPaymentMethod,
} from "../../../redux/slices/salesTransactionSlice"; // Adjust path + Import other thunks
import SalesRevenue from "../../../charts/SalesTransaction/SalesRevenue";
import TopSalesPaymentMethod from "../../../charts/TopSalesPaymentMethod";
import { CircularProgress } from "@mui/material";

const UnifiedTransactionReport = () => {
  const dispatch = useDispatch();
  const {
    todaySales,
    todaySalesStatus,
    todaySalesError,
    lastSevenDaysSales, // Add these
    lastSevenDaysSalesStatus,
    lastSevenDaysSalesError,
    allTimeTotalSales,
    allTimeTotalSalesStatus,
    allTimeTotalSalesError,
    dailySalesByPaymentMethod,
    dailySalesByPaymentMethodStatus,
    dailySalesByPaymentMethodError,
  } = useSelector((state) => state.salesTransactions);

  // Fetch today's sales on mount
  useEffect(() => {
    dispatch(fetchTodaySales());
    dispatch(fetchLastSevenDaysSales()); // Fetch other data
    dispatch(fetchAllTimeTotalSales());
    dispatch(fetchDailySalesByPaymentMethod());
  }, [dispatch]);

  // Extract sales data with fallback values
  const totalSales = todaySales?.totalSales || 0;
  const restaurantSales = todaySales?.breakdown?.restaurant || 0;
  const minimartSales = todaySales?.breakdown?.minimart || 0;
  const kabasaSales = todaySales?.breakdown?.kabasa || 0; // Add kabasa

  // Format values with Naira symbol
  const formatValue = (value) =>
    `₦${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#fcfcfc">
        Dashboard
      </Typography>

      {/* Loading and Error States for Today's Sales */}
      {todaySalesStatus === "loading" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress sx={{ color: "#fe6c00" }} />
        </Box>
      )}
      {todaySalesStatus === "failed" && (
        <Typography color="error">
          Error: {todaySalesError?.message || "Failed to load today's sales"}
        </Typography>
      )}

      {/* Display Charts for Today's Sales*/}
      {todaySalesStatus === "succeeded" && (
        <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
          <SalesCharts
            title="Total Sales"
            value={formatValue(totalSales)}
            series={[totalSales]}
            colors={["#275be8"]}
          />
          <SalesCharts
            title="Restaurant"
            value={formatValue(restaurantSales)}
            series={[restaurantSales]}
            colors={["#275be8"]}
          />
          <SalesCharts
            title="Minimart"
            value={formatValue(minimartSales)}
            series={[minimartSales]}
            colors={["#275be8"]}
          />
          <SalesCharts
            title="Kabasa" // Add Kabasa chart
            value={formatValue(kabasaSales)}
            series={[kabasaSales]}
            colors={["#275be8"]} // Choose a color
          />
        </Box>
      )}

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        {/* Loading and Error for Last Seven Days Sales */}
        {lastSevenDaysSalesStatus === "loading" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress sx={{ color: "#fe6c00" }} />
          </Box>
        )}
        {lastSevenDaysSalesStatus === "failed" && (
          <Typography color="error">
            Error:{" "}
            {lastSevenDaysSalesError?.message ||
              "Failed to load last seven days sales"}
          </Typography>
        )}
        {/* SalesRevenue (Last Seven Days) - Only display if data loaded */}
        {lastSevenDaysSalesStatus === "succeeded" && (
          <SalesRevenue salesData={lastSevenDaysSales} />
        )}

        {/* Loading and Error for Daily Sales by Payment Method */}
        {dailySalesByPaymentMethodStatus === "loading" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress sx={{ color: "#fe6c00" }} />
          </Box>
        )}
        {dailySalesByPaymentMethodStatus === "failed" && (
          <Typography color="error">
            Error:{" "}
            {dailySalesByPaymentMethodError?.message ||
              "Failed to load daily sales by payment method"}
          </Typography>
        )}

        {/* TopSalesPaymentMethod - Only display if data loaded */}
        {dailySalesByPaymentMethodStatus === "succeeded" && (
          <TopSalesPaymentMethod
            paymentMethodSalesData={dailySalesByPaymentMethod}
          />
        )}
      </Stack>
      {/* All-Time Total Sales - Added outside the Stack */}
      {allTimeTotalSalesStatus === "loading" && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <CircularProgress sx={{ color: "#fe6c00" }} />
        </Box>
      )}
      {allTimeTotalSalesStatus === "failed" && (
        <Typography color="error" mt={2}>
          Error:{" "}
          {allTimeTotalSalesError?.message ||
            "Failed to load all-time total sales"}
        </Typography>
      )}
      {allTimeTotalSalesStatus === "succeeded" && (
        <Box mt={2}>
          <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
            All-Time Total Sales:{" "}
            {formatValue(allTimeTotalSales?.totalSales || 0)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UnifiedTransactionReport;
