import React, { useState, useEffect, useCallback } from "react";
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
  createHallType,
  updateHallType,
  fetchHallTypes,
} from "../../redux/slices/hallTypesSlice";
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

const AddNewHallTypeDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.hallTypes);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (editMode) {
      // Parse price from string (e.g., "₦123.45") to a clean number string (e.g., "123.45")
      const parsedPrice = initialData.price
        ? initialData.price.replace("₦", "")
        : "";
      setFormData({
        name: initialData.name || "",
        price: parsedPrice,
      });
    } else {
      setFormData({
        name: "",
        price: "",
      });
    }
  }, [editMode, initialData]);

  useEffect(() => {
    const isValid = formData.name.trim() !== "" && formData.price.trim() !== "";
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = useCallback(
    (field) => (event) => {
      let value = event.target.value;
      if (field === "price") {
        value = value.replace(/[^0-9.]/g, ""); // Only allow numbers and decimal points
      }
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
      validateField(field, value);
    },
    []
  );

  const validateField = useCallback((name, value) => {
    let error = {};
    switch (name) {
      case "name":
        if (!value.trim()) error.name = "Hall name is required";
        break;
      case "price":
        if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0)
          error.price = "Price must be a positive number";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      price: "",
    });
    setErrors({});
  }, []);

  const handleSave = useCallback(() => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    const hallData = {
      ...formData,
      price: parseFloat(formData.price), // Convert price to number for API
    };

    if (editMode) {
      dispatch(updateHallType({ hallId: initialData.id, hallData })) // Use 'id' to match HallTypes.jsx
        .then(() => {
          toast.success("Hall updated successfully!", { duration: 5000 });
          resetForm();
          onClose();
          dispatch(fetchHallTypes());
        })
        .catch((error) => {
          toast.error(
            "Error updating hall: " +
              (error.response?.data?.message || error.message)
          );
        });
    } else {
      dispatch(createHallType(hallData))
        .then(() => {
          toast.success("Hall added successfully!", { duration: 5000 });
          resetForm();
          onClose();
          dispatch(fetchHallTypes());
        })
        .catch((error) => {
          toast.error(
            "Error adding hall: " +
              (error.response?.data?.message || error.message),
            { duration: 7000 }
          );
        });
    }
  }, [dispatch, editMode, initialData.id, formData, errors, onClose]);

  const handleCancel = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

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
            <h2>{editMode ? "Edit Hall" : "Add New Hall"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Hall Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />

          <TextField
            label="Price"
            type="text" // Use 'text' to allow controlled filtering in handleChange
            fullWidth
            margin="normal"
            value={formData.price}
            onChange={handleChange("price")}
            error={!!errors.price}
            helperText={errors.price}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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
              onClick={handleSave}
              sx={{
                width: "120px",
                borderRadius: "12px",
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
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

export default AddNewHallTypeDrawer;
