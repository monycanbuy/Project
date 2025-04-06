import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createExpenseCategory,
  updateExpenseCategory,
  fetchExpenseCategories,
} from "../../redux/slices/expenseCategorySlice"; // Adjust path
import { Toaster, toast } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0px",
    bottom: "50px",
    boxSizing: "border-box",
  },
}));

const AddNewExpenseCategoriesDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.expenseCategories);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    active: true,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        active: initialData.active !== undefined ? initialData.active : true,
      });
      setErrors({});
      setTouched({});
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const validateField = (name, value) => {
    let error = {};
    if (name === "name") {
      if (!value) {
        error.name = "Category name is required";
      } else if (value.length > 50) {
        error.name = "Name cannot exceed 50 characters";
      }
    }
    if (name === "code") {
      if (!value) {
        error.code = "Category code is required";
      } else if (value.length > 50) {
        error.code = "Code cannot exceed 50 characters";
      } else if (!/^[A-Za-z0-9-]+$/.test(value)) {
        error.code = "Code must be alphanumeric with dashes only";
      }
    }
    return error;
  };

  const handleChange = (field) => (event) => {
    const value =
      field === "active" ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    const fieldErrors = validateField(field, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
      ...(Object.keys(fieldErrors).length === 0 && { [field]: undefined }),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      ...validateField("name", formData.name),
      ...validateField("code", formData.code),
    };
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ name: "", code: "", active: true });
    setErrors({});
    setTouched({});
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setTouched({ name: true, code: true }); // Mark all fields as touched

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", { duration: 4000 });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toLowerCase(), // Enforce lowercase as per schema
      active: formData.active,
    };

    try {
      if (editMode) {
        await dispatch(
          updateExpenseCategory({
            id: initialData._id,
            categoryData: payload,
          })
        ).unwrap();
        toast.success("Expense category updated successfully!", {
          duration: 5000,
        });
      } else {
        await dispatch(createExpenseCategory(payload)).unwrap();
        toast.success("Expense category added successfully!", {
          duration: 5000,
        });
      }
      dispatch(fetchExpenseCategories()); // Refresh the list
      resetForm();
      onClose();
    } catch (error) {
      const errorMessage = error?.message || "Unknown error";
      if (errorMessage.includes("duplicate key")) {
        if (errorMessage.includes("name")) {
          setErrors((prev) => ({
            ...prev,
            name: "Category name already exists",
          }));
          toast.error("Category name already exists", { duration: 7000 });
        } else if (errorMessage.includes("code")) {
          setErrors((prev) => ({
            ...prev,
            code: "Category code already exists",
          }));
          toast.error("Category code already exists", { duration: 7000 });
        }
      } else {
        toast.error(
          `Error ${
            editMode ? "updating" : "adding"
          } expense category: ${errorMessage}`,
          { duration: 7000 }
        );
      }
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <StyledDrawer anchor="right" open={open} onClose={handleCancel}>
        <Box
          component="form"
          onSubmit={handleSave}
          sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              {editMode ? "Edit Expense Category" : "Add New Expense Category"}
            </Typography>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange("name")}
            onBlur={handleChange("name")}
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            required
            inputProps={{ maxLength: 50 }}
          />

          <TextField
            label="Category Code"
            fullWidth
            margin="normal"
            value={formData.code}
            onChange={handleChange("code")}
            onBlur={handleChange("code")}
            error={touched.code && !!errors.code}
            helperText={touched.code && errors.code}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            required
            inputProps={{ maxLength: 50 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.active}
                onChange={handleChange("active")}
                color="primary"
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />

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
              type="submit"
              sx={{
                width: "120px",
                borderRadius: "12px",
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              disabled={loading}
            >
              {loading ? (
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

export default AddNewExpenseCategoriesDrawer;
