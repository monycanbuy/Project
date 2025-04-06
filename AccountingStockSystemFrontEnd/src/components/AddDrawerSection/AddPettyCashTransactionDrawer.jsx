import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenseCategories } from "../../redux/slices/expenseCategorySlice";
import { addPettyCashTransaction } from "../../redux/slices/pettyCashSlice";
import { toast, Toaster } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "40%",
    height: "100vh",
    top: "0px",
    bottom: "50px",
    boxSizing: "border-box",
  },
}));

const AddPettyCashTransactionDrawer = ({
  open,
  onClose,
  pettyCashId,
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.pettyCash);
  const { categories: expenseCategories, loading: categoriesLoading } =
    useSelector((state) => state.expenseCategories);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    details: "",
    voucherNo: "",
    checkNo: null,
    ledgerTransactionDescription: null,
    totalPayment: "",
    expenseBreakdowns: [{ category: "", amount: "" }],
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      //console.log("Drawer opened, pettyCashId:", pettyCashId);
      if (!expenseCategories || expenseCategories.length === 0) {
        //console.log("Fetching expense categories...");
        dispatch(fetchExpenseCategories());
      }
    } else {
      //console.log("Drawer closed, resetting form");
      resetForm();
    }
    //console.log("Expense categories:", expenseCategories);
  }, [open, dispatch, expenseCategories]);

  const validateField = (name, value, index = null) => {
    let error = {};
    if (index !== null) {
      if (name === "expenseBreakdowns.category") {
        if (!value || value === "") {
          error[`expenseBreakdowns[${index}].category`] =
            "Expense category is required";
        }
      }
      if (name === "expenseBreakdowns.amount") {
        if (!value && value !== 0) {
          error[`expenseBreakdowns[${index}].amount`] = "Amount is required";
        } else if (isNaN(value) || Number(value) <= 0) {
          error[`expenseBreakdowns[${index}].amount`] =
            "Amount must be a positive number";
        }
      }
    } else {
      switch (name) {
        case "date":
          if (!value) error.date = "Date is required";
          break;
        case "details":
          if (!value) error.details = "Details are required";
          break;
        case "voucherNo":
          if (!value) error.voucherNo = "Voucher number is required";
          break;
        case "totalPayment":
          if (!value && value !== 0)
            error.totalPayment = "Total payment is required";
          else if (isNaN(value) || Number(value) <= 0)
            error.totalPayment = "Total payment must be a positive number";
          break;
        default:
          break;
      }
    }
    return error;
  };

  const handleChange =
    (field, index = null) =>
    (event) => {
      const newValue = event.target.value;
      // console.log(
      //   `handleChange: ${field}${index !== null ? `[${index}]` : ""} =`,
      //   newValue
      // );

      // Update formData
      setFormData((prev) => {
        if (index !== null) {
          const updatedBreakdowns = [...prev.expenseBreakdowns];
          updatedBreakdowns[index][field] = newValue;
          return { ...prev, expenseBreakdowns: updatedBreakdowns };
        }
        return { ...prev, [field]: newValue };
      });

      // Mark field as touched
      const fieldKey =
        index !== null ? `expenseBreakdowns[${index}].${field}` : field;
      setTouched((prev) => ({ ...prev, [fieldKey]: true }));

      // Revalidate the field immediately
      const fieldName = index !== null ? `expenseBreakdowns.${field}` : field;
      const fieldErrors = validateField(fieldName, newValue, index);

      // Clear error if field is now valid, otherwise set new error
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        if (Object.keys(fieldErrors).length === 0) {
          delete updatedErrors[fieldKey]; // Clear error if valid
        } else {
          updatedErrors[fieldKey] = fieldErrors[fieldKey];
        }
        return updatedErrors;
      });

      //console.log("Updated formData:", JSON.stringify(formData, null, 2));
    };

  const resetForm = () => {
    //console.log("Resetting form");
    setFormData({
      date: new Date().toISOString().slice(0, 16),
      details: "",
      voucherNo: "",
      checkNo: null,
      ledgerTransactionDescription: null,
      totalPayment: "",
      expenseBreakdowns: [{ category: "", amount: "" }],
    });
    setErrors({});
    setTouched({});
  };

  const validateForm = () => {
    //console.log("Validating form:", JSON.stringify(formData, null, 2));
    const fieldsToValidate = ["date", "details", "voucherNo", "totalPayment"];
    let newErrors = {};

    // Validate top-level fields
    fieldsToValidate.forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(newErrors, fieldErrors);
    });

    // Validate expense breakdowns
    formData.expenseBreakdowns.forEach((breakdown, index) => {
      const categoryErrors = validateField(
        "expenseBreakdowns.category",
        breakdown.category,
        index
      );
      const amountErrors = validateField(
        "expenseBreakdowns.amount",
        breakdown.amount,
        index
      );
      Object.assign(newErrors, categoryErrors, amountErrors);
    });

    // Validate total payment vs breakdown sum
    const breakdownSum = formData.expenseBreakdowns.reduce(
      (sum, b) => sum + (Number(b.amount) || 0),
      0
    );
    const totalPayment = Number(formData.totalPayment) || 0;
    if (breakdownSum !== totalPayment) {
      newErrors.totalPayment =
        "Sum of expense breakdowns must equal total payment";
    }

    //console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddBreakdown = () => {
    //console.log("Adding new expense breakdown");
    setFormData((prev) => ({
      ...prev,
      expenseBreakdowns: [
        ...prev.expenseBreakdowns,
        { category: "", amount: "" },
      ],
    }));
  };

  const handleRemoveBreakdown = (index) => {
    //console.log("Removing breakdown at index:", index);
    setFormData((prev) => ({
      ...prev,
      expenseBreakdowns: prev.expenseBreakdowns.filter((_, i) => i !== index),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`expenseBreakdowns[${index}].category`];
      delete newErrors[`expenseBreakdowns[${index}].amount`];
      return newErrors;
    });
  };

  const handleSave = async () => {
    //console.log("Starting handleSave, pettyCashId:", pettyCashId);
    //console.log("Form data:", JSON.stringify(formData, null, 2));
    setTouched({
      date: true,
      details: true,
      voucherNo: true,
      totalPayment: true,
      ...formData.expenseBreakdowns.reduce(
        (acc, _, index) => ({
          ...acc,
          [`expenseBreakdowns[${index}].category`]: true,
          [`expenseBreakdowns[${index}].amount`]: true,
        }),
        {}
      ),
    });

    if (!validateForm()) {
      //console.log("Validation failed");
      toast.error("Please fix all errors before saving", { duration: 4000 });
      return;
    }
    //console.log("Validation passed");

    const transactionData = {
      date: new Date(formData.date).toISOString(),
      details: formData.details,
      voucherNo: formData.voucherNo,
      checkNo: formData.checkNo || null,
      totalPayment: Number(formData.totalPayment),
      expenseBreakdowns: formData.expenseBreakdowns.map((b) => ({
        category: b.category,
        amount: Number(b.amount),
      })),
    };

    // console.log(
    //   "Transaction data being sent:",
    //   JSON.stringify(transactionData, null, 2)
    // );
    // console.log(
    //   "Full payload with ID:",
    //   JSON.stringify({ id: pettyCashId, transactionData }, null, 2)
    // );

    try {
      const result = await dispatch(
        addPettyCashTransaction({
          id: pettyCashId,
          transactionData,
        })
      ).unwrap();
      //console.log("API response:", JSON.stringify(result, null, 2));
      toast.success("Transaction added successfully!");
      onClose();
      onSaveSuccess && onSaveSuccess();
      resetForm();
    } catch (error) {
      console.error("Dispatch error:", JSON.stringify(error, null, 2));
      toast.error(`Error: ${error.message || "Unknown error"}`);
    }
  };

  const handleCancel = () => {
    //console.log("Cancelling");
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
            <Typography variant="h6">Add Petty Cash Transaction</Typography>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Date"
            fullWidth
            margin="normal"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange("date")}
            error={touched.date && !!errors.date}
            helperText={touched.date && errors.date}
            required
          />
          <TextField
            label="Details"
            fullWidth
            margin="normal"
            value={formData.details}
            onChange={handleChange("details")}
            error={touched.details && !!errors.details}
            helperText={touched.details && errors.details}
            required
          />
          <TextField
            label="Voucher Number"
            fullWidth
            margin="normal"
            value={formData.voucherNo}
            onChange={handleChange("voucherNo")}
            error={touched.voucherNo && !!errors.voucherNo}
            helperText={touched.voucherNo && errors.voucherNo}
            required
          />
          <TextField
            label="Check Number (Optional)"
            fullWidth
            margin="normal"
            value={formData.checkNo || ""}
            onChange={handleChange("checkNo")}
          />
          <TextField
            label="Ledger Transaction Description (Optional)"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.ledgerTransactionDescription || ""}
            onChange={handleChange("ledgerTransactionDescription")}
          />
          <TextField
            label="Total Payment"
            fullWidth
            margin="normal"
            type="number"
            value={formData.totalPayment}
            onChange={handleChange("totalPayment")}
            error={touched.totalPayment && !!errors.totalPayment}
            helperText={touched.totalPayment && errors.totalPayment}
            required
            inputProps={{ min: 0 }}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Expense Breakdowns
          </Typography>
          {formData.expenseBreakdowns.map((breakdown, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <FormControl
                fullWidth
                sx={{ flex: 2 }}
                error={
                  touched[`expenseBreakdowns[${index}].category`] &&
                  !!errors[`expenseBreakdowns[${index}].category`]
                }
              >
                <InputLabel>Expense Category</InputLabel>
                <Select
                  value={breakdown.category || ""}
                  onChange={handleChange("category", index)}
                  label="Expense Category"
                  required
                >
                  {categoriesLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : expenseCategories && expenseCategories.length > 0 ? (
                    expenseCategories
                      .filter((cat) => cat.active)
                      .map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name} ({cat.code})
                        </MenuItem>
                      ))
                  ) : (
                    <MenuItem disabled>No categories available</MenuItem>
                  )}
                </Select>
                <FormHelperText>
                  {touched[`expenseBreakdowns[${index}].category`] &&
                    errors[`expenseBreakdowns[${index}].category`]}
                </FormHelperText>
              </FormControl>
              <TextField
                label="Amount"
                type="number"
                value={breakdown.amount}
                onChange={handleChange("amount", index)}
                error={
                  touched[`expenseBreakdowns[${index}].amount`] &&
                  !!errors[`expenseBreakdowns[${index}].amount`]
                }
                helperText={
                  touched[`expenseBreakdowns[${index}].amount`] &&
                  errors[`expenseBreakdowns[${index}].amount`]
                }
                required
                inputProps={{ min: 0 }}
                sx={{ flex: 1 }}
              />
              {formData.expenseBreakdowns.length > 1 && (
                <IconButton onClick={() => handleRemoveBreakdown(index)}>
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddBreakdown}
            sx={{ mb: 2 }}
          >
            Add Another Expense
          </Button>

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
              disabled={status === "loading" || categoriesLoading}
            >
              {status === "loading" ? (
                <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddPettyCashTransactionDrawer;
