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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createStockMovement,
  fetchStockMovements,
  updateStockMovement,
} from "../../redux/slices/stockMovementSlice";
import { fetchInventories } from "../../redux/slices/inventoriesSlice";
import { fetchLocations } from "../../redux/slices/locationSlice";
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

const AddNewStockMovementDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.stockMovements);
  const { inventories } = useSelector((state) => state.inventories);
  const { locations } = useSelector((state) => state.locations);

  const [formData, setFormData] = useState({
    inventory: "",
    type: "Issue",
    quantity: 1,
    fromLocation: "",
    toLocation: "",
    reason: "",
    transactionDate: new Date(),
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track which fields have been interacted with

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(fetchLocations());
  }, [dispatch]);

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        inventory: initialData.inventory?._id || "",
        type: initialData.type || "Issue",
        quantity: initialData.quantity !== undefined ? initialData.quantity : 1,
        fromLocation: initialData.fromLocation?._id || "",
        toLocation: initialData.toLocation?._id || "",
        reason: initialData.reason || "",
        transactionDate: initialData.transactionDate
          ? new Date(initialData.transactionDate)
          : new Date(),
      });
      // In edit mode, assume all fields are "touched" to show errors if invalid
      setTouched({
        inventory: true,
        type: true,
        quantity: true,
        fromLocation: true,
        toLocation: true,
      });
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "inventory":
        if (!value) error.inventory = "Inventory is required";
        break;
      case "type":
        if (!value) error.type = "Type is required";
        break;
      case "quantity":
        if (!value) error.quantity = "Quantity is required";
        else if (isNaN(parseInt(value)) || parseInt(value) <= 0) {
          error.quantity = "Quantity must be a positive integer";
        }
        break;
      case "fromLocation":
        if (!value) error.fromLocation = "From Location is required";
        break;
      case "toLocation":
        if (!value) error.toLocation = "To Location is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Only validate if the field has been touched
    if (touched[field] || event.type === "blur") {
      const fieldErrors = validateField(field, newValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...fieldErrors,
        ...(Object.keys(fieldErrors).length === 0 && { [field]: undefined }),
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      transactionDate: date,
    }));
  };

  const resetForm = () => {
    setFormData({
      inventory: "",
      type: "Issue",
      quantity: 1,
      fromLocation: "",
      toLocation: "",
      reason: "",
      transactionDate: new Date(),
    });
    setErrors({});
    setTouched({});
  };

  const validateForm = () => {
    const fieldsToValidate = [
      "inventory",
      "type",
      "quantity",
      "fromLocation",
      "toLocation",
    ];
    const newErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(newErrors, fieldErrors);
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setTouched({
      inventory: true,
      type: true,
      quantity: true,
      fromLocation: true,
      toLocation: true,
    }); // Mark all fields as touched on submit
    const isValid = validateForm();
    if (!isValid) return;

    const movementData = {
      inventory: formData.inventory,
      type: formData.type,
      quantity: Number(formData.quantity),
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      reason: formData.reason,
      transactionDate: formData.transactionDate.toISOString(),
    };

    try {
      if (editMode) {
        await dispatch(
          updateStockMovement({
            id: initialData._id,
            stockMovementData: movementData,
          })
        ).unwrap();
        toast.success("Stock movement updated successfully!");
      } else {
        await dispatch(createStockMovement(movementData)).unwrap();
        toast.success("Stock movement added successfully!");
      }
      onClose();
      onSaveSuccess && onSaveSuccess();
      resetForm();
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Unauthorized")) {
        toast.error(
          "You lack permission to add stock movements. Contact an admin."
        );
      } else {
        toast.error(
          `Error ${
            editMode ? "updating" : "adding"
          } stock movement: ${errorMessage}`
        );
      }
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
            <h2>
              {editMode ? "Edit Stock Movement" : "Add New Stock Movement"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal" error={!!errors.inventory}>
            <InputLabel id="inventory-label">Inventory</InputLabel>
            <Select
              labelId="inventory-label"
              value={formData.inventory}
              onChange={handleChange("inventory")}
              onBlur={handleChange("inventory")} // Validate on blur
              label="Inventory"
              required
            >
              {inventories.map((inventory) => (
                <MenuItem key={inventory._id} value={inventory._id}>
                  {inventory.name}
                </MenuItem>
              ))}
            </Select>
            {touched.inventory && errors.inventory && (
              <FormHelperText>{errors.inventory}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.type}>
            <InputLabel id="type-label">Movement Type</InputLabel>
            <Select
              labelId="type-label"
              value={formData.type}
              onChange={handleChange("type")}
              onBlur={handleChange("type")}
              label="Movement Type"
              required
            >
              <MenuItem value="Issue">Issue</MenuItem>
              <MenuItem value="Return">Return</MenuItem>
              <MenuItem value="Adjustment">Adjustment</MenuItem>
            </Select>
            {touched.type && errors.type && (
              <FormHelperText>{errors.type}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.quantity}
            onChange={handleChange("quantity")}
            onBlur={handleChange("quantity")}
            error={touched.quantity && !!errors.quantity}
            helperText={touched.quantity && errors.quantity}
            required
            inputProps={{ min: 1 }}
          />

          <FormControl fullWidth margin="normal" error={!!errors.fromLocation}>
            <InputLabel id="from-location-label">From Location</InputLabel>
            <Select
              labelId="from-location-label"
              value={formData.fromLocation}
              onChange={handleChange("fromLocation")}
              onBlur={handleChange("fromLocation")}
              label="From Location"
              required
            >
              {locations.map((location) => (
                <MenuItem key={location._id} value={location._id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
            {touched.fromLocation && errors.fromLocation && (
              <FormHelperText>{errors.fromLocation}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.toLocation}>
            <InputLabel id="to-location-label">To Location</InputLabel>
            <Select
              labelId="to-location-label"
              value={formData.toLocation}
              onChange={handleChange("toLocation")}
              onBlur={handleChange("toLocation")}
              label="To Location"
              required
            >
              {locations.map((location) => (
                <MenuItem key={location._id} value={location._id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
            {touched.toLocation && errors.toLocation && (
              <FormHelperText>{errors.toLocation}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Reason"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.reason}
            onChange={handleChange("reason")}
          />

          <TextField
            label="Transaction Date"
            fullWidth
            margin="normal"
            type="datetime-local"
            value={formData.transactionDate.toISOString().slice(0, 16)}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            InputLabelProps={{ shrink: true }}
            required
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
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
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewStockMovementDrawer;
