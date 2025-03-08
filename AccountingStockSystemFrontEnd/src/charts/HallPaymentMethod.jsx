import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchHallDailySalesByPaymentMethod } from "../redux/slices/hallSlice"; // Adjust path

// ProgressBar component with total amount display
const ProgressBar = ({ title, totalAmount, percentage, color }) => {
  // Format total amount as NGN
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <Box width="100%">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontSize={16} fontWeight={500} color="#fcfcfc">
          {`${title} - ${formatCurrency(totalAmount)}`}
        </Typography>
        <Typography fontSize={16} fontWeight={500} color="#fe6c00">
          {percentage}%
        </Typography>
      </Stack>
      <Box
        mt={2}
        position="relative"
        width="100%"
        height="8px"
        borderRadius={1}
        bgcolor="#e4e8ef"
      >
        <Box
          width={`${percentage}%`}
          bgcolor={color}
          position="absolute"
          height="100%"
          borderRadius={1}
        />
      </Box>
    </Box>
  );
};

const HallPaymentMethod = () => {
  const dispatch = useDispatch();
  const {
    hallDailySalesByPaymentMethod,
    hallDailySalesByPaymentMethodStatus,
    hallDailySalesByPaymentMethodError,
  } = useSelector((state) => state.hallTransactions);

  // Fetch payment method totals on mount
  useEffect(() => {
    dispatch(fetchHallDailySalesByPaymentMethod());
  }, [dispatch]);

  // Debugging logs
  console.log("hallDailySalesByPaymentMethod:", hallDailySalesByPaymentMethod);
  console.log(
    "hallDailySalesByPaymentMethodStatus:",
    hallDailySalesByPaymentMethodStatus
  );
  console.log(
    "hallDailySalesByPaymentMethodError:",
    hallDailySalesByPaymentMethodError
  );

  // Prepare progress bar data from hallDailySalesByPaymentMethod
  const paymentMethodData = () => {
    if (
      hallDailySalesByPaymentMethodStatus !== "succeeded" ||
      !Array.isArray(hallDailySalesByPaymentMethod) ||
      hallDailySalesByPaymentMethod.length === 0
    ) {
      return [
        {
          title: "No Sales Data",
          totalAmount: 0,
          percentage: 0,
          color: "#e0e0e0",
        },
      ];
    }

    const maxAmount = Math.max(
      ...hallDailySalesByPaymentMethod.map((m) => m.totalAmount || 0)
    );
    return hallDailySalesByPaymentMethod.map((method, index) => {
      const percentage =
        maxAmount > 0 ? Math.round((method.totalAmount / maxAmount) * 100) : 0;
      return {
        title: method.paymentMethod,
        totalAmount: method.totalAmount,
        percentage: percentage > 0 ? percentage : 1, // Ensure visible bar for non-zero values
        color: ["#6C5DD3", "#7FBA7A", "#FFCE73", "#FFA2C0", "#F45252"][
          index % 5
        ],
      };
    });
  };

  const data = paymentMethodData();

  return (
    <Box
      p={4}
      id="chart"
      minWidth={490}
      display="flex"
      flexDirection="column"
      borderRadius="15px"
      sx={{
        background:
          "linear-gradient(114.07deg, rgba(66, 59, 55, 0.6) 3.49%, rgba(66, 59, 55, 0) 34.7%), linear-gradient(138.58deg, rgba(59, 43, 30, 0.37) 43.56%, #fea767 112.68%)",
      }}
    >
      <Typography fontSize={18} fontWeight={600} color="#fcfcfc">
        Top Payment Methods
      </Typography>

      {hallDailySalesByPaymentMethodStatus === "loading" ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          my="20px"
        >
          <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
        </Box>
      ) : hallDailySalesByPaymentMethodStatus === "failed" ? (
        <Typography fontSize={16} color="error.main" my="20px">
          Error:{" "}
          {hallDailySalesByPaymentMethodError?.message || "Failed to load data"}
        </Typography>
      ) : (
        <Stack my="20px" direction="column" gap={4} color="#fff">
          {data.map((bar) => (
            <ProgressBar key={bar.title} {...bar} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default HallPaymentMethod;
