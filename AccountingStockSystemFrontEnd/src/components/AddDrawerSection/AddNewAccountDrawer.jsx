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
import { createAccount, updateAccount } from "../../redux/slices/accountSlice"; // Adjust path
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

const AddNewAccountDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.accounts);

  const [formData, setFormData] = useState({
    accountCode: "",
    name: "",
    type: "",
    subType: "",
    description: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        accountCode: initialData.accountCode || "",
        name: initialData.name || "",
        type: initialData.type || "",
        subType: initialData.subType || "",
        description: initialData.description || "",
        status: initialData.status || "active",
      });
      setTouched({
        accountCode: true,
        name: true,
        type: true,
        subType: true,
        description: true,
        status: true,
      });
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "accountCode":
        if (!value) error.accountCode = "Account code is required";
        else if (!/^[A-Za-z0-9-]+$/.test(value)) {
          error.accountCode = "Account code must be alphanumeric with dashes";
        }
        break;
      case "name":
        if (!value) error.name = "Name is required";
        else if (value.length > 50) {
          error.name = "Name cannot exceed 50 characters";
        }
        break;
      case "type":
        if (!value) error.type = "Type is required";
        break;
      case "subType":
        if (value && value.length > 50) {
          error.subType = "Sub-type cannot exceed 50 characters";
        }
        break;
      case "description":
        if (value && value.length > 200) {
          error.description = "Description cannot exceed 200 characters";
        }
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
      accountCode: "",
      name: "",
      type: "",
      subType: "",
      description: "",
      status: "active",
    });
    setErrors({});
    setTouched({});
  };

  const validateForm = () => {
    const fieldsToValidate = [
      "accountCode",
      "name",
      "type",
      "subType",
      "description",
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
      accountCode: true,
      name: true,
      type: true,
      subType: true,
      description: true,
      status: true,
    });
    const isValid = validateForm();
    if (!isValid) return;

    const accountData = {
      accountCode: formData.accountCode,
      name: formData.name,
      type: formData.type,
      subType: formData.subType,
      description: formData.description,
      status: formData.status,
    };

    try {
      if (editMode) {
        await dispatch(
          updateAccount({
            id: initialData._id,
            accountData,
          })
        ).unwrap();
        toast.success("Account updated successfully!");
      } else {
        await dispatch(createAccount(accountData)).unwrap();
        toast.success("Account added successfully!");
      }
      onClose();
      onSaveSuccess && onSaveSuccess();
      resetForm();
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Unauthorized")) {
        toast.error(
          "You lack permission to modify accounts. Contact an admin."
        );
      } else {
        toast.error(
          `Error ${editMode ? "updating" : "adding"} account: ${errorMessage}`
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
            <h2>{editMode ? "Edit Account" : "Add New Account"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Account Code"
            fullWidth
            margin="normal"
            value={formData.accountCode}
            onChange={handleChange("accountCode")}
            onBlur={handleChange("accountCode")}
            error={touched.accountCode && !!errors.accountCode}
            helperText={touched.accountCode && errors.accountCode}
            required
          />

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

          <FormControl fullWidth margin="normal" error={!!errors.type}>
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              value={formData.type}
              onChange={handleChange("type")}
              onBlur={handleChange("type")}
              label="Type"
              required
            >
              <MenuItem value="Asset">Asset</MenuItem>
              <MenuItem value="Liability">Liability</MenuItem>
              <MenuItem value="Equity">Equity</MenuItem>
              <MenuItem value="Revenue">Revenue</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
            {touched.type && errors.type && (
              <FormHelperText>{errors.type}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Sub Type"
            fullWidth
            margin="normal"
            value={formData.subType}
            onChange={handleChange("subType")}
            onBlur={handleChange("subType")}
            error={touched.subType && !!errors.subType}
            helperText={touched.subType && errors.subType}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange("description")}
            onBlur={handleChange("description")}
            error={touched.description && !!errors.description}
            helperText={touched.description && errors.description}
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

export default AddNewAccountDrawer;
