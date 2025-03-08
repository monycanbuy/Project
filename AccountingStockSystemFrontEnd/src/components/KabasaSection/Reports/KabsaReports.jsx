import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PieChart from "../../../charts/SeminarCharts"; // Assuming same chart component
import { fetchKabasaDailySalesSummary } from "../../../redux/slices/kabasaSlice";
import KabasaRevenue from "../../../charts/Kabsa/KabsaRevenue"; // Assuming you have or will create this
import KabasaTopSellingItem from "../../../charts/KabsaTopSellingItem";
// import TopPaymentMethod from "../../../charts/TopPaymentMethod"; // Adjust if Kabasa-specific version needed

const KabasaReports = () => {
  const dispatch = useDispatch();
  const { dailySalesSummary, status, error } = useSelector(
    (state) => state.kabasa
  );

  useEffect(() => {
    dispatch(fetchKabasaDailySalesSummary());
  }, [dispatch]);

  const totalSales = dailySalesSummary?.totalSales || 0;
  const paymentMethods = dailySalesSummary
    ? [
        { name: "Cash", value: dailySalesSummary.cash || 0 },
        { name: "POS", value: dailySalesSummary.pos || 0 },
        { name: "Transfer", value: dailySalesSummary.transfer || 0 },
        {
          name: "Signing Credit",
          value: dailySalesSummary["signing credit"] || 0,
        },
        { name: "Credit", value: dailySalesSummary.credit || 0 },
      ]
    : [];

  // For "Total Sales", use totalSales vs. a max value (e.g., 100)
  const totalSalesSeries = [totalSales, totalSales > 0 ? 100 - totalSales : 0];

  return (
    <Box>
      <Typography fontSize={20} fontWeight={700} color="#fe6c00">
        Kabasa Dashboard
      </Typography>

      {status === "loading" && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt="20px"
        >
          <CircularProgress size={40} sx={{ color: "#fe6c00" }} />
        </Box>
      )}
      {status === "succeeded" && dailySalesSummary && (
        <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
          {/* Total Sales Pie Chart as Donut */}
          <PieChart
            title="Total Sales"
            value={`₦${totalSales.toFixed(2)}`}
            series={totalSalesSeries} // Two values for donut effect
            colors={["#fe6c00", "#e0e0e0"]} // Filled vs. unfilled
          />
          {/* Individual Payment Method Pie Charts as Donuts */}
          {paymentMethods.map((method, index) => (
            <PieChart
              key={index}
              title={method.name}
              value={`₦${method.value.toFixed(2)}`}
              series={[
                method.value,
                totalSales > 0 ? totalSales - method.value : 0,
              ]} // Donut: value vs. remainder
              colors={["#e827b5", "#e0e0e0"]} // Filled vs. unfilled
            />
          ))}
        </Box>
      )}
      {status === "failed" && (
        <Typography color="error" mt="20px">
          Error loading sales data: {error?.message || "Unknown error"}
        </Typography>
      )}

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <KabasaRevenue /> {/* Placeholder; replace with actual component */}
        <KabasaTopSellingItem />
      </Stack>
    </Box>
  );
};

export default KabasaReports;
