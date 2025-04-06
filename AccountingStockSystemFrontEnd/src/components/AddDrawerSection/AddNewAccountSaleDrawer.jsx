import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Drawer,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import {
  createAccountSale,
  updateAccountSale,
} from "../../redux/slices/accountSaleSlice";
import { fetchCustomers } from "../../redux/slices/customerSlice";

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0px",
    boxSizing: "border-box",
  },
});

const AddNewAccountSaleDrawer = ({
  open,
  onClose,
  editMode,
  initialData,
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { customers, loading: customersLoading } = useSelector(
    (state) => state.customers
  );

  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    isCreditSale: false,
    invoiceNumber: "",
    date: new Date().toISOString().slice(0, 16),
    status: "Pending",
  });

  useEffect(() => {
    if (open && customers.length === 0) {
      dispatch(fetchCustomers());
    }
  }, [open, customers.length, dispatch]);

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        customer: initialData.customer?._id || "",
        amount: initialData.amount || "",
        isCreditSale: initialData.isCreditSale || false,
        invoiceNumber: initialData.invoiceNumber || "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().slice(0, 16)
          : "",
        status: initialData.status || "Pending",
      });
    } else {
      setFormData({
        customer: "",
        amount: "",
        isCreditSale: false,
        invoiceNumber: "",
        date: new Date().toISOString().slice(0, 16),
        status: "Pending",
      });
    }
  }, [editMode, initialData, open]);

  const handleChange = (field) => (event) => {
    const value =
      field === "isCreditSale"
        ? event.target.value === "true"
        : event.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    if (!formData.customer) {
      toast.error("Please select a customer");
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.invoiceNumber) {
      toast.error("Please enter an invoice number");
      return;
    }

    const saleData = { ...formData };
    if (editMode) {
      dispatch(updateAccountSale({ id: initialData._id, saleData }))
        .unwrap()
        .then((response) => {
          toast.success("Sale updated successfully!");
          onClose();
          onSaveSuccess();
        })
        .catch((error) => {
          toast.error(error.message || "Failed to update sale");
        });
    } else {
      dispatch(createAccountSale(saleData))
        .unwrap()
        .then((response) => {
          toast.success("Sale created successfully!");
          onClose();
          onSaveSuccess();
        })
        .catch((error) => {
          toast.error(error.message || "Failed to create sale");
        });
    }
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">
            {editMode ? "Edit Account Sale" : "Add New Account Sale"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {customersLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Customer</InputLabel>
              <Select
                value={formData.customer}
                onChange={handleChange("customer")}
                label="Customer"
                required
              >
                <MenuItem value="">
                  <em>Select a customer</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={handleChange("amount")}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 0 }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Is Credit Sale</InputLabel>
              <Select
                value={formData.isCreditSale}
                onChange={handleChange("isCreditSale")}
                label="Is Credit Sale"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Invoice Number"
              value={formData.invoiceNumber}
              onChange={handleChange("invoiceNumber")}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Date"
              type="datetime-local"
              value={formData.date}
              onChange={handleChange("date")}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleChange("status")}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            onClick={onClose}
            sx={{ width: "120px", borderRadius: "12px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={customersLoading}
            sx={{
              width: "120px",
              borderRadius: "12px",
              backgroundColor: "green",
              color: "white",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default AddNewAccountSaleDrawer;
