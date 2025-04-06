import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  updateCategory,
  fetchCategories, // Add this import
} from "../../redux/slices/categorySlice";
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

const AddNewCategoryDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMode) {
      setFormData({ name: initialData.name || "" });
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const validateField = (name, value) => {
    let error = {};
    if (name === "name" && !value) {
      error.name = "Name is required";
    }
    return error;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    const fieldErrors = validateField(field, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
      ...(Object.keys(fieldErrors).length === 0 && { [field]: undefined }),
    }));
  };

  const validateForm = () => {
    const newErrors = validateField("name", formData.name);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setErrors({});
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (editMode) {
        await dispatch(
          updateCategory({
            categoryId: initialData._id,
            categoryData: formData,
          })
        ).unwrap();
        toast.success("Category updated successfully!", { duration: 5000 });
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success("Category added successfully!", { duration: 5000 });
      }
      dispatch(fetchCategories()); // Refresh the list
      resetForm();
      onClose();
    } catch (error) {
      const errorMessage = error?.message || "Unknown error";
      toast.error(
        `Error ${editMode ? "updating" : "adding"} category: ${errorMessage}`,
        { duration: 7000 }
      );
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
            <h2>{editMode ? "Edit Category" : "Add New Category"}</h2>
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
            error={!!errors.name}
            helperText={errors.name}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            required
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
              disabled={isLoading}
            >
              {isLoading ? (
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

export default AddNewCategoryDrawer;
