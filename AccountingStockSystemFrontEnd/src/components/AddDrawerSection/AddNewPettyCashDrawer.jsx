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
  createPettyCash,
  updatePettyCash,
} from "../../redux/slices/pettyCashSlice"; // Adjust path
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

const AddNewPettyCashDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.pettyCash); // Using status instead of loading for consistency with slice

  const [formData, setFormData] = useState({
    initialAmount: "",
    balance: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        initialAmount: initialData.initialAmount || "",
        balance: initialData.balance || "",
        status: initialData.status || "active",
      });
      setTouched({
        initialAmount: true,
        balance: true,
        status: true,
      });
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "initialAmount":
        if (!value && value !== 0)
          error.initialAmount = "Initial amount is required";
        else if (isNaN(value) || Number(value) < 0) {
          error.initialAmount = "Initial amount must be a non-negative number";
        }
        break;
      case "balance":
        if (!value && value !== 0) error.balance = "Balance is required";
        else if (isNaN(value) || Number(value) < 0) {
          error.balance = "Balance must be a non-negative number";
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
      initialAmount: "",
      balance: "",
      status: "active",
    });
    setErrors({});
    setTouched({});
  };

  const validateForm = () => {
    const fieldsToValidate = ["initialAmount", "balance", "status"];
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
      initialAmount: true,
      balance: true,
      status: true,
    });
    const isValid = validateForm();
    if (!isValid) return;

    const pettyCashData = {
      initialAmount: Number(formData.initialAmount),
      balance: Number(formData.balance),
      status: formData.status,
    };

    try {
      if (editMode) {
        await dispatch(
          updatePettyCash({
            id: initialData._id,
            pettyCashData,
          })
        ).unwrap();
        toast.success("Petty cash updated successfully!");
      } else {
        await dispatch(createPettyCash(pettyCashData)).unwrap();
        toast.success("Petty cash added successfully!");
      }
      onClose();
      onSaveSuccess && onSaveSuccess();
      resetForm();
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      if (errorMessage.includes("Unauthorized")) {
        toast.error(
          "You lack permission to modify petty cash. Contact an admin."
        );
      } else if (errorMessage.includes("already exists")) {
        toast.error("Petty cash with these details already exists.");
      } else {
        toast.error(
          `Error ${
            editMode ? "updating" : "adding"
          } petty cash: ${errorMessage}`
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
            <h2>{editMode ? "Edit Petty Cash" : "Add New Petty Cash"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Initial Amount"
            fullWidth
            margin="normal"
            type="number"
            value={formData.initialAmount}
            onChange={handleChange("initialAmount")}
            onBlur={handleChange("initialAmount")}
            error={touched.initialAmount && !!errors.initialAmount}
            helperText={touched.initialAmount && errors.initialAmount}
            required
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Balance"
            fullWidth
            margin="normal"
            type="number"
            value={formData.balance}
            onChange={handleChange("balance")}
            onBlur={handleChange("balance")}
            error={touched.balance && !!errors.balance}
            helperText={touched.balance && errors.balance}
            required
            inputProps={{ min: 0 }}
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
              disabled={status === "loading"}
            >
              {status === "loading" ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewPettyCashDrawer;
