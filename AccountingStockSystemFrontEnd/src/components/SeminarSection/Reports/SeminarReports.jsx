import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PieChart from "../../../charts/SeminarCharts";
import { fetchDailySales } from "../../../redux/slices/seminarSlice";
import SeminarRevenue from "../../../charts/SeminarRevenue";
import TopPaymentMethod from "../../../charts/TopPaymentMethod";

const SeminarReports = () => {
  const dispatch = useDispatch();
  const { dailySales, dailySalesStatus } = useSelector(
    (state) => state.seminar
  );

  useEffect(() => {
    dispatch(fetchDailySales({}));
  }, [dispatch]);

  const totalSales = dailySales?.totalSales || 0;
  const eventSales = dailySales?.eventSales || {};
  const eventTypes = [
    { name: "Workshop", value: eventSales.workshop || 0 },
    { name: "Conference", value: eventSales.conference || 0 },
    { name: "Webinar", value: eventSales.webinar || 0 },
    { name: "Wedding", value: eventSales.Wedding || 0 },
  ];

  // For "Total Sales", use totalSales vs. a max value (e.g., 100 or totalSales itself)
  const totalSalesSeries = [totalSales, totalSales > 0 ? 100 - totalSales : 0]; // Example max of 100

  return (
    <Box>
      <Typography fontSize={20} fontWeight={700} color="#fe6c00">
        Seminar Dashboard
      </Typography>

      {dailySalesStatus === "loading" && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt="20px"
        >
          <CircularProgress size={40} sx={{ color: "#fe6c00" }} />
        </Box>
      )}
      {dailySalesStatus === "succeeded" && dailySales && (
        <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
          {/* Total Sales Pie Chart as Donut */}
          <PieChart
            title="Total Sales"
            value={`₦${totalSales.toFixed(2)}`}
            series={totalSalesSeries} // Two values for donut effect
            colors={["#fe6c00", "#e0e0e0"]} // Filled vs. unfilled
          />
          {/* Individual Event Type Pie Charts as Donuts */}
          {eventTypes.map((event, index) => (
            <PieChart
              key={index}
              title={event.name}
              value={`₦${event.value.toFixed(2)}`}
              series={[
                event.value,
                totalSales > 0 ? totalSales - event.value : 0,
              ]} // Donut: value vs. remainder
              colors={["#e827b5", "#e0e0e0"]} // Filled vs. unfilled
            />
          ))}
        </Box>
      )}
      {dailySalesStatus === "failed" && (
        <Typography color="error" mt="20px">
          Error loading sales data
        </Typography>
      )}

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <SeminarRevenue />
        <TopPaymentMethod />
      </Stack>
    </Box>
  );
};

export default SeminarReports;
