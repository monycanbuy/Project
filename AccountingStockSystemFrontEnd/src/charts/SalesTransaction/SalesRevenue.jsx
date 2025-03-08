import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowCircleUpRounded from "@mui/icons-material/ArrowCircleUpRounded";
import ArrowCircleDownRounded from "@mui/icons-material/ArrowCircleDownRounded";
import {
  fetchAllTimeTotalSales,
  fetchSalesForLastTwoWeeks,
} from "../../redux/slices/salesTransactionSlice"; // Adjust path

const SalesRevenue = () => {
  const dispatch = useDispatch();
  const {
    allTimeTotalSales,
    allTimeTotalSalesStatus,
    allTimeTotalSalesError,
    lastTwoWeeksSales,
    lastTwoWeeksSalesStatus,
    lastTwoWeeksSalesError,
  } = useSelector((state) => state.salesTransactions);

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: ["#fe6c00", "#ffc397"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: false,
      },
      stroke: {
        colors: ["transparent"],
        width: 4,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#fcfcfc", // Text color for x-axis labels
          },
        },
      },
      yaxis: {
        title: {
          text: "₦ (thousands)",
          style: {
            color: "#fcfcfc", // Text color for y-axis title
          },
        },
        labels: {
          style: {
            colors: "#fcfcfc", // Text color for y-axis labels (numbers)
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        labels: {
          colors: "#fcfcfc", // Text color for legend
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `₦ ${val} thousands`,
        },
      },
    },
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchAllTimeTotalSales());
    dispatch(fetchSalesForLastTwoWeeks());
  }, [dispatch]);

  // Process daily sales data for the last two weeks
  useEffect(() => {
    if (lastTwoWeeksSalesStatus === "succeeded" && lastTwoWeeksSales) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      const lastWeekStart = new Date(sevenDaysAgo);
      lastWeekStart.setDate(sevenDaysAgo.getDate() - 7);

      const dailySalesMap = new Map(
        lastTwoWeeksSales.map((sale) => [sale.date, sale.totalSales])
      );

      const lastWeekData = [];
      const runningWeekData = [];
      const categories = [];
      for (let i = 0; i < 7; i++) {
        const lastWeekDate = new Date(lastWeekStart);
        lastWeekDate.setDate(lastWeekStart.getDate() + i);
        const runningWeekDate = new Date(sevenDaysAgo);
        runningWeekDate.setDate(sevenDaysAgo.getDate() + i);

        const lastWeekDateStr = lastWeekDate.toISOString().split("T")[0];
        const runningWeekDateStr = runningWeekDate.toISOString().split("T")[0];

        const dayName = runningWeekDate.toLocaleString("en-US", {
          weekday: "short",
        });

        lastWeekData.push(dailySalesMap.get(lastWeekDateStr) || 0);
        runningWeekData.push(dailySalesMap.get(runningWeekDateStr) || 0);
        categories.push(dayName);
      }

      setChartData({
        series: [
          { name: "Last Week", data: lastWeekData },
          { name: "Running Week", data: runningWeekData },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            ...chartData.options.xaxis,
            categories,
          },
        },
      });
    }
  }, [lastTwoWeeksSalesStatus, lastTwoWeeksSales]);

  // Calculate percentage difference
  const calculatePercentageChange = () => {
    const previousWeekRevenue =
      chartData.series[0]?.data.reduce((a, b) => a + b, 0) || 0;
    const currentWeekRevenue =
      chartData.series[1]?.data.reduce((a, b) => a + b, 0) || 0;

    if (previousWeekRevenue === 0) {
      return currentWeekRevenue > 0 ? 100 : 0; // If last week is 0, return 100% if there's revenue, else 0%
    }
    const difference = currentWeekRevenue - previousWeekRevenue;
    const percentageChange = (difference / previousWeekRevenue) * 100;
    return Number(percentageChange.toFixed(1)); // Round to 1 decimal place
  };

  const percentageChange = calculatePercentageChange();
  const isIncrease = percentageChange >= 0;

  // Extract total sales with fallback
  const totalSales = allTimeTotalSales?.totalSales || 0;

  // Format value with Naira sign and commas
  const formatValue = (value) =>
    `₦${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

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
          "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
      }}
    >
      <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
        Total Revenue
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        {allTimeTotalSalesStatus === "loading" ? (
          <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
            Loading...
          </Typography>
        ) : allTimeTotalSalesStatus === "failed" ? (
          <Typography fontSize={28} fontWeight={700} color="#ff6f61">
            Error
          </Typography>
        ) : (
          <Typography fontSize={28} fontWeight={700} color="#d9cfcf">
            {formatValue(totalSales)}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" gap={1}>
          {isIncrease ? (
            <ArrowCircleUpRounded sx={{ fontSize: 25, color: "#fcfcfc" }} />
          ) : (
            <ArrowCircleDownRounded sx={{ fontSize: 25, color: "#ff6f61" }} /> // Red for decrease
          )}
          <Stack>
            <Typography
              fontSize={15}
              color={isIncrease ? "#ffc397" : "#ff6f61"} // Orange for increase, red for decrease
            >
              {Math.abs(percentageChange)}%
            </Typography>
            <Typography fontSize={12} color="#808191">
              Than Last Week
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {lastTwoWeeksSalesStatus === "loading" ? (
        <Typography color="#fcfcfc">Loading chart...</Typography>
      ) : lastTwoWeeksSalesStatus === "failed" ? (
        <Typography color="#ff6f61">
          Chart Error: {lastTwoWeeksSalesError?.message}
        </Typography>
      ) : (
        <ReactApexChart
          series={chartData.series}
          type="bar"
          height={310}
          options={chartData.options}
        />
      )}
    </Box>
  );
};

export default SalesRevenue;
