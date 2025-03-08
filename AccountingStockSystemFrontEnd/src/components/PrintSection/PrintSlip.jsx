import React, { forwardRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";

const PrintSlip = forwardRef(({ formData, items }, ref) => {
  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get current date and time using dayjs and format it
  const currentDate = dayjs().format("YYYY-MM-DD HH:mm"); // You can adjust the format

  return (
    <Box
      ref={ref}
      sx={{
        width: "80mm",
        padding: 2,
        height: "auto",
        backgroundColor: "#fff",
        color: "#000",
        fontSize: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" align="left">
          POS Receipt
        </Typography>
      </Box>
      <Typography variant="body2">Date:{currentDate}</Typography>
      <Typography variant="body2">Sale Type: {formData.saleType}</Typography>
      <Typography variant="body2">
        Payment Method: {formData.paymentMethod}
      </Typography>
      <Typography variant="body2">Location: {formData.location}</Typography>
      <Typography variant="body2">Discount: {formData.discount}%</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Sub Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.item}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {formatCurrency(item.priceAtSale)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(item.subTotal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body2" align="right">
        Grand Total: {formatCurrency(formData.totalAmount)}
      </Typography>
    </Box>
  );
});

export default PrintSlip;
