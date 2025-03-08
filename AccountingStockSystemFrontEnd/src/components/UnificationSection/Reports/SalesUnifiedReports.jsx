import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnotherUnifiedSalesSummary } from "../../../redux/slices/salesUnifiedSlice"; // Adjust path as needed
import {
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  background: "#29221d",
  color: "#fff",
  marginBottom: theme.spacing(2),
  "& .MuiCardContent-root": {
    padding: theme.spacing(2),
  },
}));

const SalesUnifiedReports = () => {
  const dispatch = useDispatch();
  const { summary, status, error } = useSelector(
    (state) => state.anotherUnifiedSales
  );
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    // Fetch summary when component mounts or when date changes
    dispatch(fetchAnotherUnifiedSalesSummary({ fromDate, toDate }))
      .then(() => {
        setLoading(false);
        console.log("Summary fetch succeeded:", summary);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching summary:", err);
      });
  }, [dispatch, fromDate, toDate]);

  const handleFetchSummary = () => {
    dispatch(fetchAnotherUnifiedSalesSummary({ fromDate, toDate }));
  };

  useEffect(() => {
    console.log("Summary state updated:", summary);
  }, [summary]);

  console.log("Current summary data:", summary);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
      </Box>
    );
  }

  // Error state with check if error exists
  if (status === "failed") {
    console.error("Failed status detected:", error);
    return (
      <Typography variant="h6" component="div" color="error">
        {error && error.message
          ? error.message
          : "An error occurred while fetching data."}
      </Typography>
    );
  }

  // No data state
  if (!summary) {
    console.log("Summary is undefined or null:", summary);
    return (
      <Typography variant="h6" component="div">
        No summary data available.
      </Typography>
    );
  }

  // Handle noDataForRange
  if (summary.noDataForRange) {
    console.log("No data for range:", summary);
    return (
      <Typography variant="h6" component="div" color="warning.main">
        {summary.message || "No sales found for the criteria"}
      </Typography>
    );
  }

  // Before accessing properties, check if they exist
  if (
    typeof summary.totalSales !== "number" ||
    typeof summary.totalDiscountCount !== "number" ||
    typeof summary.totalDiscountSum !== "number" ||
    !Array.isArray(summary.restaurantSales) ||
    !Array.isArray(summary.minimartSales)
  ) {
    console.error("Summary data structure mismatch:", summary);
    return <Typography>Invalid summary data structure.</Typography>;
  }

  return (
    <Box
      sx={{ flexGrow: 1, p: 3, backgroundColor: "#302924", borderRadius: 5 }}
    >
      <Box sx={{ mb: 3 }}>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
            style: { color: "#fff" },
          }}
          InputProps={{
            style: { color: "#fff" },
          }}
          sx={{
            mr: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "& .MuiInputLabel-root": {
              color: "#fff",
            },
            "& .MuiInputBase-input": {
              color: "#fff",
            },
          }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
            style: { color: "#fff" },
          }}
          InputProps={{
            style: { color: "#fff" },
          }}
          sx={{
            mr: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
            "& .MuiInputLabel-root": {
              color: "#fff",
            },
            "& .MuiInputBase-input": {
              color: "#fff",
            },
            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
              color: "#fff",
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleFetchSummary}
          sx={{
            backgroundColor: "#fe6c00",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#fe6c00",
              opacity: 0.8,
            },
          }}
        >
          Filter
        </Button>
      </Box>
      <Typography variant="h4" component="div" sx={{ mb: 3, color: "#ffffff" }}>
        Unified Sales Report
      </Typography>

      {/* Summary Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Sales
              </Typography>
              <Typography variant="h5" component="div">
                ₦{summary.totalSales.toFixed(2)}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Discounts
              </Typography>
              <Typography variant="h5" component="div">
                {summary.totalDiscountCount} (₦
                {summary.totalDiscountSum.toFixed(2)})
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Payment Methods */}
      <Paper
        elevation={3}
        sx={{ p: 3, mt: 3, bgcolor: "#29221d", color: "#fff" }}
      >
        <Typography variant="h5" component="div" gutterBottom>
          Payment Methods
        </Typography>
        {summary.paymentMethods &&
          summary.paymentMethods.map &&
          summary.paymentMethods.map((method, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" component="div">
                {method.method}
              </Typography>
              <Typography component="div">
                - Transactions: {method.count}
              </Typography>
              <Typography component="div">
                - Total Amount: ₦{method.amount.toFixed(2)}
              </Typography>
              <Typography component="div">
                - Discounts: {method.discountCount} (₦
                {method.discountSum.toFixed(2)})
              </Typography>
            </Box>
          ))}
      </Paper>

      {/* Restaurant vs Minimart Sales */}
      <Paper
        elevation={3}
        sx={{ p: 3, mt: 3, bgcolor: "#29221d", color: "#fff" }}
      >
        <Typography variant="h5" component="div" gutterBottom>
          Sales by Department
        </Typography>
        {["restaurantSales", "minimartSales"].map((dept) => (
          <Box key={dept} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" component="div">
              {dept === "restaurantSales" ? "Restaurant" : "Minimart"}
            </Typography>
            {summary[dept].map((sale, idx) => (
              <Box key={idx}>
                <Typography component="div">
                  - Payment Method: {sale.paymentMethod}
                </Typography>
                <Typography component="div">- Count: {sale.count}</Typography>
                <Typography component="div">
                  - Amount: ₦{sale.amount.toFixed(2)}
                </Typography>
                <Typography component="div">
                  - Discounts: {sale.discountCount} (₦
                  {sale.discountSum.toFixed(2)})
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default SalesUnifiedReports;
