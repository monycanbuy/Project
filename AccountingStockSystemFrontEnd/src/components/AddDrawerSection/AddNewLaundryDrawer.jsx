import React, { useState, useEffect, useRef } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  addLaundry,
  fetchLaundries,
  updateLaundry,
} from "../../redux/slices/laundrySlice";
import { fetchLaundryServices } from "../../redux/slices/laundryServicesSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import { Toaster, toast } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0",
    boxSizing: "border-box",
  },
}));

const AddNewLaundryDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const {
    services: laundryServices,
    status: servicesStatus,
    servicesError,
  } = useSelector((state) => state.laundryServices);
  const {
    paymentMethods,
    status: paymentMethodsStatus,
    error: paymentMethodsError,
  } = useSelector((state) => state.paymentMethods);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (laundryServices === undefined || laundryServices.length === 0) {
      //console.log("Fetching laundry services...");
      dispatch(fetchLaundryServices());
    }
  }, [dispatch, laundryServices]);

  useEffect(() => {
    if (paymentMethodsStatus === "idle") {
      //console.log("Fetching payment methods...");
      dispatch(fetchPaymentMethods()).catch((err) =>
        console.error("Payment methods fetch failed:", err)
      );
    }
  }, [dispatch, paymentMethodsStatus]);

  const [formData, setFormData] = useState({
    customer: "",
    receiptNo: "",
    transactionDate: "", // Added transactionDate
    phoneNo: "",
    paymentMethod: "",
    discount: 0,
    totalAmount: 0,
    status: "Pending",
    isVoided: false,
  });
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && isInitialMount.current) {
      if (editMode && initialData._id) {
        const { _id, salesBy, isVoided, ...restOfInitialData } = initialData;
        setFormData({
          ...restOfInitialData,
          transactionDate: initialData.transactionDate
            ? new Date(initialData.transactionDate).toISOString().slice(0, 16)
            : "", // Format for datetime-local
          paymentMethod: initialData.paymentMethod?._id || "",
          status: initialData.status || "Pending",
          isVoided: initialData.isVoided || false,
        });
        setServices(
          (initialData.services || []).map(
            ({ serviceType, qty, unitPrice }) => ({
              serviceType: serviceType.serviceType,
              unitPrice: serviceType.price || unitPrice,
              qty: qty,
              price: (serviceType.price || unitPrice) * qty,
            })
          )
        );
      } else {
        setFormData({
          customer: "",
          receiptNo: "",
          transactionDate: "",
          phoneNo: "",
          paymentMethod: "",
          discount: 0,
          totalAmount: 0,
          status: "Pending",
          isVoided: false,
        });
        setServices([]);
      }
      setErrors({});
      isInitialMount.current = false;
    }
    if (!open) {
      isInitialMount.current = true;
    }
  }, [open, editMode, initialData]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "customer":
        if (!value) error.customer = "Customer name is required";
        break;
      case "receiptNo":
        if (!value) error.receiptNo = "Receipt number is required";
        break;
      case "transactionDate":
        if (!value) error.transactionDate = "Transaction date is required";
        break;
      case "phoneNo":
        if (!value) error.phoneNo = "Phone number is required";
        break;
      case "paymentMethod":
        if (!value) error.paymentMethod = "Payment method is required";
        break;
      case "services":
        if (services.length === 0)
          error.services = "At least one service is required";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
  };

  const handleChange = (field) => (event) => {
    //console.log("Field change -", field, ":", event.target.value);
    setFormData((prev) => {
      const newData = { ...prev, [field]: event.target.value || "" };
      //console.log("New formData:", newData);
      return newData;
    });
    validateField(field, event.target.value);
  };

  const addService = () => {
    setServices([
      ...services,
      { serviceType: "", unitPrice: 0, qty: 1, price: 0 },
    ]);
  };

  const removeService = (index) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
    calculateTotalAmount(newServices);
  };

  const handleServiceChange = (index, field) => (event) => {
    const newServices = [...services];
    newServices[index][field] = event.target.value;
    if (field === "serviceType") {
      const selectedService = laundryServices.find(
        (s) => s.serviceType === event.target.value
      );
      if (selectedService) {
        newServices[index].unitPrice = selectedService.price;
        newServices[index].price =
          selectedService.price * newServices[index].qty;
      }
    } else if (field === "qty") {
      newServices[index].price =
        newServices[index].unitPrice * parseFloat(event.target.value) || 0;
    }
    setServices(newServices);
    calculateTotalAmount(newServices);
  };

  const calculateTotalAmount = (updatedServices = services) => {
    const subTotal = updatedServices.reduce(
      (acc, service) => acc + (service.price || 0),
      0
    );
    const discountAmount = subTotal * (formData.discount / 100) || 0;
    const total = subTotal - discountAmount;

    setFormData((prev) => ({
      ...prev,
      totalAmount: parseFloat(total.toFixed(2)),
    }));
  };

  const handleSave = () => {
    //console.log("Save clicked - formData:", formData, "services:", services);
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );
    validateField("services", services);

    if (Object.values(errors).some((error) => error)) {
      //console.log("Validation errors:", errors);
      toast.error("Please fix all errors before saving");
      return;
    }

    const validatedServices = services.map((service) => ({
      serviceType:
        laundryServices.find((s) => s.serviceType === service.serviceType)
          ?._id || "",
      qty: Number(service.qty),
      unitPrice: Number(service.unitPrice),
    }));

    const {
      totalAmount,
      createdAt,
      updatedAt,
      __v,
      isVoided,
      ...formDataWithoutExcludedFields
    } = formData;
    const laundryData = {
      ...formDataWithoutExcludedFields,
      services: validatedServices,
      discount: Number(formData.discount),
    };

    if (editMode) {
      dispatch(updateLaundry({ id: initialData._id, laundryData }))
        .unwrap()
        .then(() => {
          toast.success("Laundry record updated successfully!", {
            duration: 5000,
          });
          dispatch(fetchLaundries());
          onClose();
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(
            `Error updating laundry record: ${error || "Unknown error"}`,
            { duration: 5000 }
          );
        });
    } else {
      dispatch(addLaundry(laundryData))
        .unwrap()
        .then(() => {
          toast.success("Laundry record added successfully!", {
            duration: 5000,
          });
          dispatch(fetchLaundries());
          onClose();
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(
            `Error adding laundry record: ${error || "Unknown error"}`,
            { duration: 5000 }
          );
        });
    }
  };

  const handleCancel = () => {
    //console.log("Cancel clicked");
    onClose();
  };

  if (
    !laundryServices ||
    (!paymentMethods && paymentMethodsStatus === "loading")
  ) {
    //console.log("Returning loading state - waiting for critical data");
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

  const isDisabled = editMode && formData.isVoided;

  return (
    <>
      {paymentMethodsStatus === "failed" && (
        <Box sx={{ color: "red", p: 2 }}>
          Warning: Payment methods failed to load -{" "}
          {paymentMethodsError || "Unknown error"}
        </Box>
      )}
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
              {editMode ? "Edit Laundry Record" : "Add New Laundry Record"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Customer"
            fullWidth
            margin="normal"
            value={formData.customer}
            onChange={handleChange("customer")}
            error={!!errors.customer}
            helperText={errors.customer}
            disabled={isDisabled}
          />
          <TextField
            label="Receipt No"
            fullWidth
            margin="normal"
            value={formData.receiptNo}
            onChange={handleChange("receiptNo")}
            error={!!errors.receiptNo}
            helperText={errors.receiptNo}
            disabled={isDisabled}
          />
          <TextField
            label="Transaction Date" // Added transactionDate field
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.transactionDate}
            onChange={handleChange("transactionDate")}
            error={!!errors.transactionDate}
            helperText={errors.transactionDate}
            InputLabelProps={{ shrink: true }}
            disabled={isDisabled}
          />
          <TextField
            label="Phone No"
            fullWidth
            margin="normal"
            value={formData.phoneNo}
            onChange={handleChange("phoneNo")}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo}
            disabled={isDisabled}
          />
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={formData.paymentMethod || ""}
              onChange={handleChange("paymentMethod")}
              label="Payment Method"
              error={!!errors.paymentMethod}
              required
              disabled={isDisabled}
            >
              {paymentMethods && paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <MenuItem key={method._id} value={method._id}>
                    {method.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No payment methods available</MenuItem>
              )}
            </Select>
            {errors.paymentMethod && (
              <Box sx={{ color: "red", mt: 1 }}>{errors.paymentMethod}</Box>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ minWidth: 200, mt: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status || "Pending"}
              onChange={handleChange("status")}
              label="Status"
              required
              disabled={isDisabled}
            >
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Refund">Refund</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Discount (%)"
            fullWidth
            margin="normal"
            type="number"
            value={formData.discount}
            onChange={handleChange("discount")}
            disabled={isDisabled}
          />
          <TextField
            label="Total Amount"
            fullWidth
            margin="normal"
            value={formData.totalAmount}
            disabled
          />

          <h3>Services</h3>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="services table">
              <TableHead>
                <TableRow>
                  <TableCell>Service Type</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl fullWidth sx={{ minWidth: 200 }}>
                        <InputLabel id={`service-type-label-${index}`}>
                          Service Type
                        </InputLabel>
                        <Select
                          labelId={`service-type-label-${index}`}
                          value={row.serviceType || ""}
                          onChange={handleServiceChange(index, "serviceType")}
                          label="Service Type"
                          disabled={isDisabled}
                        >
                          {laundryServices.map((ls) => (
                            <MenuItem key={ls._id} value={ls.serviceType}>
                              {ls.serviceType}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">{row.unitPrice}</TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={row.qty}
                        onChange={handleServiceChange(index, "qty")}
                        disabled={isDisabled}
                      />
                    </TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => removeService(index)}
                        disabled={editMode || isDisabled}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            startIcon={<AddIcon />}
            onClick={addService}
            sx={{ mb: 2 }}
            disabled={editMode || isDisabled}
          >
            Add Service
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
              disabled={
                servicesStatus === "loading" ||
                paymentMethodsStatus === "loading" ||
                isDisabled
              }
            >
              {servicesStatus === "loading" ||
              paymentMethodsStatus === "loading" ? (
                <CircularProgress size={24} />
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

export default AddNewLaundryDrawer;
