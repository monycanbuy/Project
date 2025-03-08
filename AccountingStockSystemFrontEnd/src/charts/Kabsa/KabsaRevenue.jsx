// KabasaRevenue.jsx (unchanged from last fix)
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
import ArrowCircleDownRounded from "@mui/icons-material/ArrowCircleDownRounded";
import {
  fetchKabasaAllTimeSales,
  fetchKabasaDailySalesAllDays,
} from "../../redux/slices/kabasaSlice";
import { WeeklyRevenueOptions } from "../days.config";

const KabasaRevenue = () => {
  const dispatch = useDispatch();
  const {
    allTimeSales,
    allTimeSalesStatus,
    allTimeSalesError,
    dailySalesAllDays,
    dailySalesAllDaysStatus,
    dailySalesAllDaysError,
  } = useSelector((state) => state.kabasa);

  useEffect(() => {
    dispatch(fetchKabasaAllTimeSales());
    dispatch(fetchKabasaDailySalesAllDays());
  }, [dispatch]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const getWeeklyChartData = () => {
    if (!dailySalesAllDays || dailySalesAllDaysStatus !== "succeeded") {
      return {
        lastWeek: [0, 0, 0, 0, 0, 0, 0],
        runningWeek: [0, 0, 0, 0, 0, 0, 0],
        lastWeekTotal: 0,
        runningWeekTotal: 0,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const lastWeekStart = new Date(sevenDaysAgo);
    lastWeekStart.setDate(sevenDaysAgo.getDate() - 7);

    const dailySalesMap = new Map(
      dailySalesAllDays.map((sale) => [sale.date, sale.totalSales / 1000])
    );

    const lastWeekData = [];
    const runningWeekData = [];
    let lastWeekTotal = 0;
    let runningWeekTotal = 0;

    for (let i = 0; i < 7; i++) {
      const lastWeekDate = new Date(lastWeekStart);
      lastWeekDate.setDate(lastWeekStart.getDate() + i);
      const runningWeekDate = new Date(sevenDaysAgo);
      runningWeekDate.setDate(sevenDaysAgo.getDate() + i);

      const lastWeekDateStr = lastWeekDate.toISOString().split("T")[0];
      const runningWeekDateStr = runningWeekDate.toISOString().split("T")[0];

      const lastWeekValue = dailySalesMap.get(lastWeekDateStr) || 0;
      const runningWeekValue = dailySalesMap.get(runningWeekDateStr) || 0;

      lastWeekData.push(lastWeekValue);
      runningWeekData.push(runningWeekValue);
      lastWeekTotal += lastWeekValue;
      runningWeekTotal += runningWeekValue;
    }

    return {
      lastWeek: lastWeekData,
      runningWeek: runningWeekData,
      lastWeekTotal,
      runningWeekTotal,
    };
  };

  const weeklyData = getWeeklyChartData();
  const chartSeries = [
    { name: "Last Week", data: weeklyData.lastWeek },
    { name: "Running Week", data: weeklyData.runningWeek },
  ];

  const calculatePercentageChange = () => {
    const previousWeekRevenue = weeklyData.lastWeekTotal * 1000;
    const currentWeekRevenue = weeklyData.runningWeekTotal * 1000;

    if (previousWeekRevenue === 0) {
      return currentWeekRevenue > 0 ? 100 : 0;
    }
    const difference = currentWeekRevenue - previousWeekRevenue;
    const percentageChange = (difference / previousWeekRevenue) * 100;
    return Number(percentageChange.toFixed(1));
  };

  const percentageChange = calculatePercentageChange();
  const isIncrease = percentageChange >= 0;

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
        Total Revenue
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
          {allTimeSalesStatus === "loading"
            ? "Loading..."
            : allTimeSalesError
            ? "Error"
            : formatCurrency(allTimeSales?.totalSales)}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          {isIncrease ? (
            <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
          ) : (
            <ArrowCircleDownRounded sx={{ fontSize: 25, color: "#ff6f61" }} />
          )}
          <Stack>
            <Typography
              fontSize={15}
              color={isIncrease ? "#ffc397" : "#ff6f61"}
            >
              {Math.abs(percentageChange)}%
            </Typography>
            <Typography fontSize={12} color="#808191">
              Than Last Week
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {dailySalesAllDaysStatus === "loading" ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={310}
        >
          <Typography color="#fff">Loading chart...</Typography>
        </Box>
      ) : dailySalesAllDaysError ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={310}
        >
          <Typography color="error">
            Error: {dailySalesAllDaysError.message}
          </Typography>
        </Box>
      ) : (
        <ReactApexChart
          series={chartSeries}
          type="bar"
          height={310}
          options={WeeklyRevenueOptions}
        />
      )}
    </Box>
  );
};

export default KabasaRevenue;
