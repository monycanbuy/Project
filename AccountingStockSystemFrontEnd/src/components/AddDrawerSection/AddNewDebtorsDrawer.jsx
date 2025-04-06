import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  FormHelperText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createDebtor,
  updateDebtor,
  recalculateDebtorBalance,
} from "../../redux/slices/debtorsSlice";
import { fetchCustomers } from "../../redux/slices/customerSlice";
import { toast, Toaster } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0px",
    bottom: "50px",
    boxSizing: "border-box",
  },
}));

const AddNewDebtorDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { loading: debtorLoading } = useSelector((state) => state.debtors);
  const { customers, loading: customerLoading } = useSelector(
    (state) => state.customers
  );

  const [formData, setFormData] = useState({
    customer: "",
    openingBalance: 0,
    totalDebt: 0,
    totalCreditReceived: 0,
    totalDeduction: 0,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open && customers.length === 0) {
      dispatch(fetchCustomers());
    }
  }, [open, customers.length, dispatch]);

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        customer: initialData.customer?._id || "",
        openingBalance: initialData.openingBalance || 0,
        totalDebt: initialData.totalDebt || 0,
        totalCreditReceived: initialData.totalCreditReceived || 0,
        totalDeduction: initialData.totalDeduction || 0,
      });
      setTouched({
        customer: true,
        openingBalance: true,
        totalDebt: true,
        totalCreditReceived: true,
        totalDeduction: true,
      });
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "customer":
        if (!value) error.customer = "Customer is required";
        break;
      case "openingBalance":
        if (value < 0)
          error.openingBalance = "Opening balance cannot be negative";
        break;
      case "totalDebt":
        if (value < 0) error.totalDebt = "Total debt cannot be negative";
        break;
      case "totalCreditReceived":
        if (value < 0)
          error.totalCreditReceived =
            "Total credit received cannot be negative";
        break;
      case "totalDeduction":
        if (value < 0)
          error.totalDeduction = "Total deduction cannot be negative";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (field) => (event) => {
    const newValue =
      field === "customer"
        ? event.target.value
        : Number(event.target.value) || 0;
    setFormData((prev) => ({ ...prev, [field]: newValue }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (touched[field] || event.type === "blur") {
      const fieldErrors = validateField(field, newValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...fieldErrors,
        ...(Object.keys(fieldErrors).length === 0 && { [field]: undefined }),
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      customer: "",
      openingBalance: 0,
      totalDebt: 0,
      totalCreditReceived: 0,
      totalDeduction: 0,
    });
    setErrors({});
    setTouched({});
  };

  const validateForm = () => {
    const fieldsToValidate = editMode
      ? [
          "customer",
          "openingBalance",
          "totalDebt",
          "totalCreditReceived",
          "totalDeduction",
        ]
      : ["customer", "openingBalance"];
    const newErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(newErrors, fieldErrors);
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      let debtorId;
      let shouldRecalculate = false;

      if (editMode) {
        // Update Debtor
        const debtorData = {
          customer: formData.customer,
          openingBalance: formData.openingBalance,
        };
        // Check if openingBalance changed
        if (initialData.openingBalance !== formData.openingBalance) {
          shouldRecalculate = true;
        }
        const updatedDebtor = await dispatch(
          updateDebtor({
            id: initialData._id,
            debtorData,
          })
        ).unwrap();
        debtorId = initialData._id;
        toast.success("Debtor updated successfully!");
      } else {
        // Create Debtor
        const debtorData = {
          customer: formData.customer,
          openingBalance: formData.openingBalance,
        };
        const newDebtor = await dispatch(createDebtor(debtorData)).unwrap();
        debtorId = newDebtor.data._id;
        // Only recalculate if openingBalance is non-zero and you expect invoices
        shouldRecalculate = formData.openingBalance !== 0;
        toast.success("Debtor created successfully!");
      }

      if (shouldRecalculate) {
        await dispatch(recalculateDebtorBalance(debtorId)).unwrap();
      }

      if (onSaveSuccess) onSaveSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving debtor:", error);
      toast.error(
        `${editMode ? "Update" : "Create"} failed: ${
          error.message || "Unknown error"
        }`
      );
    }
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  return (
    <>
      <StyledDrawer anchor="right" open={open} onClose={handleCancel}>
        <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <h2>{editMode ? "Edit Debtor" : "Add New Debtor"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal" error={!!errors.customer}>
            <InputLabel id="customer-label">Customer</InputLabel>
            <Select
              labelId="customer-label"
              value={formData.customer}
              onChange={handleChange("customer")}
              onBlur={handleChange("customer")}
              label="Customer"
              required
              disabled={customerLoading || editMode} // Disable customer change in edit mode
            >
              {customerLoading ? (
                <MenuItem value="" disabled>
                  Loading customers...
                </MenuItem>
              ) : customers.length === 0 ? (
                <MenuItem value="" disabled>
                  No customers available
                </MenuItem>
              ) : (
                customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {touched.customer && errors.customer && (
              <FormHelperText>{errors.customer}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Opening Balance"
            fullWidth
            margin="normal"
            type="number"
            value={formData.openingBalance}
            onChange={handleChange("openingBalance")}
            onBlur={handleChange("openingBalance")}
            error={touched.openingBalance && !!errors.openingBalance}
            helperText={touched.openingBalance && errors.openingBalance}
          />

          {editMode && (
            <>
              <TextField
                label="Total Debt"
                fullWidth
                margin="normal"
                type="number"
                value={formData.totalDebt}
                disabled // Read-only, managed by invoices
                helperText="Managed via invoices"
              />
              <TextField
                label="Total Credit Received"
                fullWidth
                margin="normal"
                type="number"
                value={formData.totalCreditReceived}
                disabled // Read-only, managed by payments
                helperText="Managed via payments"
              />
              <TextField
                label="Total Deduction"
                fullWidth
                margin="normal"
                type="number"
                value={formData.totalDeduction}
                disabled // Read-only, managed by invoices
                helperText="Managed via refunds/write-offs"
              />
              <Typography variant="caption" color="textSecondary">
                To modify Total Debt, Credit Received, or Deduction, use the
                Invoices section.
              </Typography>
            </>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ width: "120px", borderRadius: "12px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                width: "120px",
                borderRadius: "12px",
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              disabled={debtorLoading || customerLoading}
            >
              {debtorLoading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewDebtorDrawer;
