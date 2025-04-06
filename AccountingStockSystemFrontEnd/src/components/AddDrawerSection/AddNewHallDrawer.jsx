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
  createHallTransaction,
  updateHallTransaction,
  fetchHallTransactions,
} from "../../redux/slices/hallSlice";
import { fetchHallTypes } from "../../redux/slices/hallTypesSlice";
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

const AddNewHallDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { paymentMethods, status: paymentMethodsStatus } = useSelector(
    (state) => state.paymentMethods
  );
  const { list: hallTypes, status: hallTypesStatus } = useSelector(
    (state) => state.hallTypes
  );

  useEffect(() => {
    if (paymentMethodsStatus === "idle") {
      dispatch(fetchPaymentMethods());
    }
    if (!hallTypes || hallTypes.length === 0) {
      dispatch(fetchHallTypes());
    }
  }, [dispatch, paymentMethodsStatus, hallTypes]);

  const [formData, setFormData] = useState({
    customerName: "",
    contactPhone: "",
    transactionDate: "", // Added transactionDate
    eventType: "conference",
    startTime: "",
    endTime: "",
    paymentMethod: "",
    paymentStatus: "Pending",
    notes: "",
    discount: 0,
    totalAmount: 0,
  });

  const [hallsList, setHallsList] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMode && initialData) {
      const {
        _id,
        createdAt,
        updatedAt,
        __v,
        isVoided,
        transactionId,
        date,
        startTime,
        endTime,
        totalAmount,
        paymentMethod,
        ...restOfInitialData
      } = initialData;

      const parsedTotalAmount =
        totalAmount !== undefined ? Number(totalAmount) : 0;
      const paymentMethodId =
        paymentMethods.find((pm) =>
          paymentMethod?._id
            ? pm._id === paymentMethod._id
            : pm.name === paymentMethod
        )?._id || "";

      setFormData({
        ...restOfInitialData,
        transactionDate: date ? new Date(date).toISOString().slice(0, 16) : "", // Format for datetime-local
        startTime: startTime
          ? new Date(startTime).toISOString().slice(0, 16)
          : "",
        endTime: endTime ? new Date(endTime).toISOString().slice(0, 16) : "",
        paymentMethod: paymentMethodId,
        totalAmount: parsedTotalAmount,
        discount: initialData.discount || 0,
      });

      setHallsList(
        (initialData.halls || []).map(({ hallId, name, qty, price }) => ({
          hallId: hallId?._id || hallId, // Handle populated vs ID-only cases
          name: name || "",
          qty: qty !== undefined ? qty : 1,
          price: price !== undefined ? price : 0,
          total: (qty || 1) * (price || 0),
        }))
      );
    } else {
      setFormData({
        customerName: "",
        contactPhone: "",
        transactionDate: "",
        eventType: "conference",
        startTime: "",
        endTime: "",
        paymentMethod: "",
        paymentStatus: "Pending",
        notes: "",
        discount: 0,
        totalAmount: 0,
      });
      setHallsList([]);
    }
  }, [editMode, initialData, paymentMethods]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "halls":
        if (hallsList.length === 0)
          error.halls = "At least one hall service is required";
        break;
      case "paymentMethod":
        if (!value || !paymentMethods.some((pm) => pm._id === value))
          error.paymentMethod = "Please select a valid payment method.";
        break;
      case "discount":
        if (value < 0 || value > 100) {
          error.discount = "Discount must be between 0 and 100";
        }
        break;
      case "customerName":
        if (!value) error.customerName = "Customer name is required";
        break;
      case "contactPhone":
        if (!value) error.contactPhone = "Contact phone is required";
        break;
      case "startTime":
        if (!value) error.startTime = "Start time is required";
        break;
      case "endTime":
        if (!value) error.endTime = "End time is required";
        break;
      case "transactionDate":
        if (!value) error.transactionDate = "Transaction date is required";
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
    const value =
      field === "discount"
        ? parseFloat(event.target.value) || 0
        : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
    if (field === "discount") {
      calculateTotalAmount();
    }
  };

  const handleHallChange = (index, field) => (event) => {
    setHallsList((prevHalls) => {
      const newHalls = [...prevHalls];
      if (field === "name") {
        const selectedHall = hallTypes.find(
          (hall) => hall.name === event.target.value
        );
        if (selectedHall) {
          newHalls[index] = {
            ...newHalls[index],
            hallId: selectedHall._id,
            name: event.target.value,
            price: selectedHall.price,
            total: selectedHall.price * (newHalls[index].qty || 1),
          };
        }
      } else if (field === "qty") {
        const qty = parseInt(event.target.value) || 1;
        newHalls[index].qty = qty;
        newHalls[index].total = newHalls[index].price * qty;
      }
      calculateTotalAmount(newHalls);
      return newHalls;
    });
  };

  const addHall = () => {
    setHallsList([...hallsList, { name: "", qty: 1, price: 0, total: 0 }]);
    calculateTotalAmount([...hallsList, { total: 0 }]);
  };

  const removeHall = (index) => {
    const newHalls = [...hallsList];
    newHalls.splice(index, 1);
    setHallsList(newHalls);
    calculateTotalAmount(newHalls);
  };

  const calculateTotalAmount = (halls = hallsList) => {
    const subTotal = halls.reduce((sum, hall) => sum + (hall.total || 0), 0);
    const discountPercentage = parseFloat(formData.discount || 0) / 100;
    const discountAmount = subTotal * discountPercentage;
    const total = subTotal - discountAmount;

    setFormData((prev) => ({
      ...prev,
      totalAmount: total,
    }));
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );
    validateField("halls", hallsList);

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please fix all errors before saving");
      return;
    }

    if (!paymentMethods.some((pm) => pm._id === formData.paymentMethod)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        paymentMethod: "Please select a valid payment method.",
      }));
      return;
    }

    if (!Array.isArray(hallsList) || hallsList.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        halls: "At least one hall must be selected.",
      }));
      return;
    }

    const baseTransactionData = {
      customerName: formData.customerName,
      contactPhone: formData.contactPhone,
      date: formData.transactionDate, // Send as 'date' to match backend
      eventType: formData.eventType,
      startTime: formData.startTime,
      endTime: formData.endTime,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      notes: formData.notes,
      discount: formData.discount,
      halls: hallsList.map((hall) => ({
        hallId: hall.hallId,
        name: hall.name,
        qty: Number(hall.qty),
        price: Number(hall.price),
      })),
    };

    let dataToSend;
    if (editMode) {
      dataToSend = {
        ...baseTransactionData,
        totalAmount: formData.totalAmount,
      };
    } else {
      dataToSend = baseTransactionData;
    }

    if (editMode) {
      dispatch(
        updateHallTransaction({
          id: initialData._id, // Use _id consistently
          transactionData: dataToSend,
        })
      )
        .then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            toast.success("Hall transaction updated successfully!", {
              duration: 5000,
            });
            dispatch(fetchHallTransactions()).then(() => onClose());
            onSaveSuccess && onSaveSuccess();
          } else {
            toast.error("Failed to update hall transaction", {
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          toast.error(`Error updating hall transaction: ${error.message}`, {
            duration: 5000,
          });
        });
    } else {
      dispatch(createHallTransaction(dataToSend))
        .then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            toast.success("Hall transaction added successfully!", {
              duration: 5000,
            });
            dispatch(fetchHallTransactions()).then(() => onClose());
            onSaveSuccess && onSaveSuccess();
          } else {
            toast.error("Failed to add hall transaction", { duration: 5000 });
          }
        })
        .catch((error) => {
          toast.error(`Error adding hall transaction: ${error.message}`, {
            duration: 5000,
          });
        });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = () => {
    return (
      formData.customerName &&
      formData.contactPhone &&
      formData.transactionDate &&
      formData.startTime &&
      formData.endTime &&
      formData.paymentMethod &&
      hallsList.length > 0 &&
      !Object.values(errors).some((error) => error)
    );
  };

  if (hallTypesStatus === "loading" || paymentMethodsStatus === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isDisabled = editMode && initialData.isVoided;

  return (
    <>
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
              {editMode ? "Edit Hall Transaction" : "Add New Hall Transaction"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Customer Name"
            fullWidth
            margin="normal"
            value={formData.customerName}
            onChange={handleChange("customerName")}
            error={!!errors.customerName}
            helperText={errors.customerName}
            disabled={isDisabled}
          />
          <TextField
            label="Contact Phone"
            fullWidth
            margin="normal"
            value={formData.contactPhone}
            onChange={handleChange("contactPhone")}
            error={!!errors.contactPhone}
            helperText={errors.contactPhone}
            disabled={isDisabled}
          />
          <TextField
            label="Transaction Date"
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="event-type-label">Event Type</InputLabel>
            <Select
              labelId="event-type-label"
              value={formData.eventType}
              onChange={handleChange("eventType")}
              label="Event Type"
              disabled={isDisabled}
            >
              <MenuItem value="conference">Conference</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="webinar">Webinar</MenuItem>
              <MenuItem value="Wedding">Wedding</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.startTime}
            onChange={handleChange("startTime")}
            error={!!errors.startTime}
            helperText={errors.startTime}
            InputLabelProps={{ shrink: true }}
            disabled={isDisabled}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.endTime}
            onChange={handleChange("endTime")}
            error={!!errors.endTime}
            helperText={errors.endTime}
            InputLabelProps={{ shrink: true }}
            disabled={isDisabled}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={formData.paymentMethod}
              onChange={handleChange("paymentMethod")}
              label="Payment Method"
              error={!!errors.paymentMethod}
              required
              disabled={isDisabled}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method._id} value={method._id}>
                  {method.name}
                </MenuItem>
              ))}
            </Select>
            {errors.paymentMethod && (
              <Box sx={{ color: "red", mt: 1 }}>{errors.paymentMethod}</Box>
            )}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="payment-status-label">Payment Status</InputLabel>
            <Select
              labelId="payment-status-label"
              value={formData.paymentStatus}
              onChange={handleChange("paymentStatus")}
              label="Payment Status"
              disabled={isDisabled}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Refund">Refund</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Additional Notes"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={formData.notes}
            onChange={handleChange("notes")}
            disabled={isDisabled}
          />
          <TextField
            label="Discount (%)"
            fullWidth
            margin="normal"
            type="number"
            value={formData.discount}
            onChange={handleChange("discount")}
            InputProps={{
              inputProps: { min: 0, max: 100, step: 1 },
            }}
            disabled={isDisabled}
          />
          <TextField
            label="Total Amount"
            fullWidth
            margin="normal"
            value={`₦${formData.totalAmount.toFixed(2)}`}
            InputProps={{
              readOnly: true,
            }}
          />
          <h3>Hall Services</h3>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="halls table">
              <TableHead>
                <TableRow>
                  <TableCell>Hall Name</TableCell>
                  <TableCell align="right">Num of Days</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hallsList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl fullWidth sx={{ minWidth: 200 }}>
                        <InputLabel id={`hall-name-label-${index}`}>
                          Hall Name
                        </InputLabel>
                        <Select
                          labelId={`hall-name-label-${index}`}
                          value={row.name}
                          onChange={handleHallChange(index, "name")}
                          label="Hall Name"
                          disabled={isDisabled}
                        >
                          {hallTypes.map((type) => (
                            <MenuItem key={type._id} value={type.name}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={row.qty}
                        onChange={handleHallChange(index, "qty")}
                        disabled={isDisabled}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        value={row.price}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">{row.total.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => removeHall(index)}
                        disabled={isDisabled}
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
            onClick={addHall}
            sx={{ mb: 2 }}
            disabled={isDisabled}
          >
            Add Hall Service
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
                hallTypesStatus === "loading" ||
                paymentMethodsStatus === "loading" ||
                paymentMethods.length === 0 ||
                isDisabled ||
                !isFormValid()
              }
            >
              {hallTypesStatus === "loading" ||
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

export default AddNewHallDrawer;
