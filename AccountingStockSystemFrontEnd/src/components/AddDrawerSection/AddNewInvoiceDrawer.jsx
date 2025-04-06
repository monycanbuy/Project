import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  addInvoice,
  updateInvoice,
  addPayment,
  addInitialPayment, // Add this import
} from "../../redux/slices/debtorsSlice";
import { fetchDebtors } from "../../redux/slices/debtorsSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
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

const AddNewInvoiceDrawer = ({
  open,
  onClose,
  debtorId,
  mode,
  invoiceData = {},
}) => {
  const dispatch = useDispatch();
  const { debtors, loading: debtorLoading } = useSelector(
    (state) => state.debtors
  );
  const {
    paymentMethods,
    status: paymentStatus,
    error: paymentError,
  } = useSelector((state) => state.paymentMethods);
  const [formData, setFormData] = useState({
    debtorId: debtorId || "",
    invoiceNumber: "",
    amount: 0,
    issuedDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    initialPaymentAmount: 0, // Add for initial payment
    initialPaymentMethod: "", // Add for initial payment
    paymentAmount: 0,
    method: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      dispatch(fetchDebtors());
      dispatch(fetchPaymentMethods());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (mode === "updateInvoice" && invoiceData) {
      setFormData({
        debtorId: debtorId || "",
        invoiceNumber: invoiceData.invoiceNumber || "",
        amount: invoiceData.amount || 0,
        issuedDate: invoiceData.issuedDate
          ? new Date(invoiceData.issuedDate).toISOString().split("T")[0]
          : "",
        dueDate: invoiceData.dueDate
          ? new Date(invoiceData.dueDate).toISOString().split("T")[0]
          : "",
        initialPaymentAmount: invoiceData.initialPayment?.amount || 0,
        initialPaymentMethod: invoiceData.initialPayment?.method || "",
        paymentAmount: 0,
        method: "",
      });
    } else if (mode === "addPayment" && invoiceData) {
      setFormData({
        debtorId: debtorId || "",
        invoiceNumber: invoiceData.invoiceNumber || "",
        amount: 0,
        issuedDate: "",
        dueDate: "",
        initialPaymentAmount: 0,
        initialPaymentMethod: "",
        paymentAmount: 0,
        method: "",
      });
    } else if (mode === "addInitialPayment" && invoiceData) {
      setFormData({
        debtorId: debtorId || "",
        invoiceNumber: invoiceData.invoiceNumber || "",
        amount: 0,
        issuedDate: "",
        dueDate: "",
        initialPaymentAmount: invoiceData.initialPayment?.amount || 0,
        initialPaymentMethod: invoiceData.initialPayment?.method || "",
        paymentAmount: 0,
        method: "",
      });
    } else {
      setFormData({
        debtorId: debtorId || "",
        invoiceNumber: "",
        amount: 0,
        issuedDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        initialPaymentAmount: 0,
        initialPaymentMethod: "",
        paymentAmount: 0,
        method: "",
      });
    }
  }, [mode, invoiceData, debtorId]);

  const validateForm = () => {
    const newErrors = {};
    if (mode === "addInvoice" || mode === "updateInvoice") {
      if (!formData.debtorId || !/^[0-9a-fA-F]{24}$/.test(formData.debtorId)) {
        newErrors.debtorId = "Please select a valid debtor";
      }
      if (!formData.invoiceNumber)
        newErrors.invoiceNumber = "Invoice number is required";
      if (formData.amount <= 0)
        newErrors.amount = "Amount must be greater than 0";
      if (!formData.issuedDate)
        newErrors.issuedDate = "Issued date is required";
      if (!formData.dueDate) newErrors.dueDate = "Due date is required";
      if (formData.initialPaymentAmount > 0 && !formData.initialPaymentMethod) {
        newErrors.initialPaymentMethod =
          "Payment method is required for initial payment";
      }
      if (formData.initialPaymentAmount < 0) {
        newErrors.initialPaymentAmount = "Initial payment cannot be negative";
      }
      if (formData.initialPaymentAmount > formData.amount) {
        newErrors.initialPaymentAmount =
          "Initial payment cannot exceed invoice amount";
      }
    } else if (mode === "addPayment") {
      if (!formData.debtorId || !/^[0-9a-fA-F]{24}$/.test(formData.debtorId)) {
        newErrors.debtorId = "Invalid debtor ID";
      }
      if (invoiceData._id && !/^[0-9a-fA-F]{24}$/.test(invoiceData._id)) {
        newErrors.invoiceId = "Invalid invoice ID";
      }
      if (!formData.method || !/^[0-9a-fA-F]{24}$/.test(formData.method)) {
        newErrors.method = "Please select a valid payment method";
      }
      if (formData.paymentAmount <= 0)
        newErrors.paymentAmount = "Amount must be greater than 0";
    } else if (mode === "addInitialPayment") {
      if (!formData.debtorId || !/^[0-9a-fA-F]{24}$/.test(formData.debtorId)) {
        newErrors.debtorId = "Invalid debtor ID";
      }
      if (invoiceData._id && !/^[0-9a-fA-F]{24}$/.test(invoiceData._id)) {
        newErrors.invoiceId = "Invalid invoice ID";
      }
      if (
        !formData.initialPaymentMethod ||
        !/^[0-9a-fA-F]{24}$/.test(formData.initialPaymentMethod)
      ) {
        newErrors.initialPaymentMethod = "Please select a valid payment method";
      }
      if (formData.initialPaymentAmount <= 0) {
        newErrors.initialPaymentAmount =
          "Initial payment must be greater than 0";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "amount" ||
        field === "paymentAmount" ||
        field === "initialPaymentAmount"
          ? Number(event.target.value) || 0
          : event.target.value,
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (mode === "addInvoice") {
        const invoicePayload = {
          invoiceNumber: formData.invoiceNumber,
          amount: formData.amount,
          issuedDate: formData.issuedDate,
          dueDate: formData.dueDate,
          initialPayment:
            formData.initialPaymentAmount > 0
              ? {
                  amount: formData.initialPaymentAmount,
                  method: formData.initialPaymentMethod,
                  date: new Date(),
                }
              : undefined,
        };
        await dispatch(
          addInvoice({
            debtorId: formData.debtorId,
            invoiceData: invoicePayload,
          })
        ).unwrap();
        toast.success("Invoice added successfully!");
      } else if (mode === "updateInvoice") {
        const invoicePayload = {
          invoiceNumber: formData.invoiceNumber,
          amount: formData.amount,
          issuedDate: formData.issuedDate,
          dueDate: formData.dueDate,
          initialPayment:
            formData.initialPaymentAmount > 0
              ? {
                  amount: formData.initialPaymentAmount,
                  method: formData.initialPaymentMethod,
                  date: new Date(),
                }
              : undefined,
        };
        await dispatch(
          updateInvoice({
            debtorId: formData.debtorId,
            invoiceId: invoiceData._id,
            invoiceData: invoicePayload,
          })
        ).unwrap();
        toast.success("Invoice updated successfully!");
      } else if (mode === "addPayment") {
        const paymentPayload = {
          invoiceId: invoiceData._id,
          amount: formData.paymentAmount,
          method: formData.method,
          date: new Date(),
        };
        await dispatch(
          addPayment({
            debtorId: formData.debtorId,
            paymentData: paymentPayload,
          })
        ).unwrap();
        toast.success("Payment added successfully!");
      } else if (mode === "addInitialPayment") {
        const paymentPayload = {
          amount: formData.initialPaymentAmount,
          method: formData.initialPaymentMethod,
          date: new Date(),
        };
        await dispatch(
          addInitialPayment({
            debtorId: formData.debtorId,
            invoiceId: invoiceData._id,
            paymentData: paymentPayload,
          })
        ).unwrap();
        toast.success("Initial payment added successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Frontend error:", error);
      toast.error(`Error ${mode}: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <h2>
            {mode === "addInvoice"
              ? "Add Invoice"
              : mode === "updateInvoice"
              ? "Update Invoice"
              : mode === "addPayment"
              ? "Add Payment"
              : "Add Initial Payment"}
          </h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <FormControl fullWidth margin="normal" error={!!errors.debtorId}>
          <InputLabel>Debtor</InputLabel>
          <Select
            value={formData.debtorId}
            onChange={handleChange("debtorId")}
            label="Debtor"
            disabled={mode !== "addInvoice" || debtorLoading}
          >
            {debtorLoading ? (
              <MenuItem value="" disabled>
                Loading debtors...
              </MenuItem>
            ) : debtors.length === 0 ? (
              <MenuItem value="" disabled>
                No debtors available
              </MenuItem>
            ) : (
              debtors.map((debtor) => (
                <MenuItem key={debtor._id} value={debtor._id}>
                  {debtor.customer?.name || "N/A"}
                </MenuItem>
              ))
            )}
          </Select>
          {errors.debtorId && (
            <FormHelperText>{errors.debtorId}</FormHelperText>
          )}
        </FormControl>

        {(mode === "addInvoice" || mode === "updateInvoice") && (
          <>
            <TextField
              label="Invoice Number"
              fullWidth
              margin="normal"
              value={formData.invoiceNumber}
              onChange={handleChange("invoiceNumber")}
              error={!!errors.invoiceNumber}
              helperText={errors.invoiceNumber}
            />
            <TextField
              label="Amount"
              fullWidth
              margin="normal"
              type="number"
              value={formData.amount}
              onChange={handleChange("amount")}
              error={!!errors.amount}
              helperText={errors.amount}
            />
            <TextField
              label="Issued Date"
              fullWidth
              margin="normal"
              type="date"
              value={formData.issuedDate}
              onChange={handleChange("issuedDate")}
              error={!!errors.issuedDate}
              helperText={errors.issuedDate}
            />
            <TextField
              label="Due Date"
              fullWidth
              margin="normal"
              type="date"
              value={formData.dueDate}
              onChange={handleChange("dueDate")}
              error={!!errors.dueDate}
              helperText={errors.dueDate}
            />
            <TextField
              label="Initial Payment Amount"
              fullWidth
              margin="normal"
              type="number"
              value={formData.initialPaymentAmount}
              onChange={handleChange("initialPaymentAmount")}
              error={!!errors.initialPaymentAmount}
              helperText={errors.initialPaymentAmount}
            />
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.initialPaymentMethod}
            >
              <InputLabel>Initial Payment Method</InputLabel>
              <Select
                value={formData.initialPaymentMethod}
                onChange={handleChange("initialPaymentMethod")}
                label="Initial Payment Method"
                disabled={paymentStatus === "loading"}
              >
                {paymentStatus === "loading" ? (
                  <MenuItem value="" disabled>
                    Loading payment methods...
                  </MenuItem>
                ) : paymentError ? (
                  <MenuItem value="" disabled>
                    Error loading payment methods
                  </MenuItem>
                ) : paymentMethods.length === 0 ? (
                  <MenuItem value="" disabled>
                    No payment methods available
                  </MenuItem>
                ) : (
                  paymentMethods.map((method) => (
                    <MenuItem key={method._id} value={method._id}>
                      {method.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.initialPaymentMethod && (
                <FormHelperText>{errors.initialPaymentMethod}</FormHelperText>
              )}
            </FormControl>
          </>
        )}

        {mode === "addPayment" && (
          <>
            <TextField
              label="Invoice Number"
              fullWidth
              margin="normal"
              value={formData.invoiceNumber}
              disabled
            />
            <FormControl fullWidth margin="normal" error={!!errors.method}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={formData.method}
                onChange={handleChange("method")}
                label="Payment Method"
                disabled={paymentStatus === "loading"}
              >
                {paymentStatus === "loading" ? (
                  <MenuItem value="" disabled>
                    Loading payment methods...
                  </MenuItem>
                ) : paymentError ? (
                  <MenuItem value="" disabled>
                    Error loading payment methods
                  </MenuItem>
                ) : paymentMethods.length === 0 ? (
                  <MenuItem value="" disabled>
                    No payment methods available
                  </MenuItem>
                ) : (
                  paymentMethods.map((method) => (
                    <MenuItem key={method._id} value={method._id}>
                      {method.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.method && (
                <FormHelperText>{errors.method}</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Amount"
              fullWidth
              margin="normal"
              type="number"
              value={formData.paymentAmount}
              onChange={handleChange("paymentAmount")}
              error={!!errors.paymentAmount}
              helperText={errors.paymentAmount}
            />
          </>
        )}

        {mode === "addInitialPayment" && (
          <>
            <TextField
              label="Invoice Number"
              fullWidth
              margin="normal"
              value={formData.invoiceNumber}
              disabled
            />
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.initialPaymentMethod}
            >
              <InputLabel>Initial Payment Method</InputLabel>
              <Select
                value={formData.initialPaymentMethod}
                onChange={handleChange("initialPaymentMethod")}
                label="Initial Payment Method"
                disabled={paymentStatus === "loading"}
              >
                {paymentStatus === "loading" ? (
                  <MenuItem value="" disabled>
                    Loading payment methods...
                  </MenuItem>
                ) : paymentError ? (
                  <MenuItem value="" disabled>
                    Error loading payment methods
                  </MenuItem>
                ) : paymentMethods.length === 0 ? (
                  <MenuItem value="" disabled>
                    No payment methods available
                  </MenuItem>
                ) : (
                  paymentMethods.map((method) => (
                    <MenuItem key={method._id} value={method._id}>
                      {method.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.initialPaymentMethod && (
                <FormHelperText>{errors.initialPaymentMethod}</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Initial Payment Amount"
              fullWidth
              margin="normal"
              type="number"
              value={formData.initialPaymentAmount}
              onChange={handleChange("initialPaymentAmount")}
              error={!!errors.initialPaymentAmount}
              helperText={errors.initialPaymentAmount}
            />
          </>
        )}

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ width: "120px", borderRadius: "12px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={debtorLoading || paymentStatus === "loading"}
            sx={{
              width: "120px",
              borderRadius: "12px",
              backgroundColor: "green",
              color: "white",
              "&:hover": { backgroundColor: "darkgreen" },
            }}
          >
            {debtorLoading || paymentStatus === "loading" ? (
              <CircularProgress size={24} />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>
      <Toaster />
    </StyledDrawer>
  );
};

export default AddNewInvoiceDrawer;
