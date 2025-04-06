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
  createCustomer,
  updateCustomer,
} from "../../redux/slices/customerSlice"; // Adjust path
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

const AddNewCustomerDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        address: initialData.address || "",
        status: initialData.status || "active",
      });
      setTouched({
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
        status: true,
      });
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "name":
        if (!value) error.name = "Name is required";
        break;
      case "email":
        if (!value) error.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error.email = "Invalid email format";
        }
        break;
      case "phoneNumber":
        if (!value) error.phoneNumber = "Phone number is required";
        else if (!/^[0-9]{10,15}$/.test(value)) {
          error.phoneNumber = "Phone number must be 10-15 digits";
        }
        break;
      case "address":
        if (!value) error.address = "Address is required";
        break;
      case "status":
        if (!value) error.status = "Status is required";
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
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      status: "active",
    });
    setErrors({});
    setTouched({});
  };

  const validateForm = () => {
    const fieldsToValidate = [
      "name",
      "email",
      "phoneNumber",
      "address",
      "status",
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
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      status: true,
    });
    const isValid = validateForm();
    if (!isValid) return;

    const customerData = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      status: formData.status,
    };

    try {
      if (editMode) {
        await dispatch(
          updateCustomer({
            id: initialData._id,
            customerData,
          })
        ).unwrap();
        toast.success("Customer updated successfully!");
      } else {
        await dispatch(createCustomer(customerData)).unwrap();
        toast.success("Customer added successfully!");
      }
      onClose();
      onSaveSuccess && onSaveSuccess();
      resetForm();
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Unauthorized")) {
        toast.error(
          "You lack permission to modify customers. Contact an admin."
        );
      } else if (errorMessage.includes("already exists")) {
        toast.error("Email or phone number already exists.");
      } else {
        toast.error(
          `Error ${editMode ? "updating" : "adding"} customer: ${errorMessage}`
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
            <h2>{editMode ? "Edit Customer" : "Add New Customer"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange("name")}
            onBlur={handleChange("name")}
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            required
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            onBlur={handleChange("email")}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            required
          />

          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            onBlur={handleChange("phoneNumber")}
            error={touched.phoneNumber && !!errors.phoneNumber}
            helperText={touched.phoneNumber && errors.phoneNumber}
            required
          />

          <TextField
            label="Address"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleChange("address")}
            onBlur={handleChange("address")}
            error={touched.address && !!errors.address}
            helperText={touched.address && errors.address}
            required
          />

          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status}
              onChange={handleChange("status")}
              onBlur={handleChange("status")}
              label="Status"
              required
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            {touched.status && errors.status && (
              <FormHelperText>{errors.status}</FormHelperText>
            )}
          </FormControl>

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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewCustomerDrawer;
