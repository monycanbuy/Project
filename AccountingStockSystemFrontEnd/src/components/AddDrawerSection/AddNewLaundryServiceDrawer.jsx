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
  addLaundryService,
  updateLaundryService,
  fetchLaundryServices,
} from "../../redux/slices/laundryServicesSlice";
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

const AddNewLaundryServiceDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.laundryServices);
  const isLoading = status === "loading";

  const [formData, setFormData] = useState({
    serviceType: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editMode && initialData._id) {
        setFormData({
          serviceType: initialData.serviceType || "",
          price:
            initialData.price !== undefined ? String(initialData.price) : "",
        });
      } else {
        setFormData({
          serviceType: "",
          price: "",
        });
      }
      setErrors({});
    }
  }, [open, editMode, initialData._id]); // Depend on _id to avoid unnecessary resets

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "serviceType":
        if (!value) error.serviceType = "Service type is required";
        break;
      case "price":
        if (!value) error.price = "Price is required";
        else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
          error.price = "Price must be a non-negative number";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Validation moved to handleSave to prevent state thrashing
  };

  const resetForm = () => {
    setFormData({
      serviceType: "",
      price: "",
    });
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(newErrors, fieldErrors);
    });

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fix all errors before saving");
      return;
    }

    const serviceData = {
      serviceType: formData.serviceType,
      price: parseFloat(formData.price),
    };

    try {
      if (editMode) {
        await dispatch(
          updateLaundryService({ id: initialData._id, serviceData })
        ).unwrap();
        toast.success("Laundry service updated successfully!", {
          duration: 5000,
        });
      } else {
        await dispatch(addLaundryService(serviceData)).unwrap();
        toast.success("Laundry service added successfully!", {
          duration: 5000,
        });
      }
      resetForm();
      await dispatch(fetchLaundryServices()).unwrap();
      onClose();
    } catch (error) {
      toast.error(
        "Error saving laundry service: " + (error.message || "Unknown error"),
        {
          duration: 7000,
        }
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
              {editMode ? "Edit Laundry Service" : "Add New Laundry Service"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Service Type"
            fullWidth
            margin="normal"
            value={formData.serviceType}
            onChange={handleChange("serviceType")}
            error={!!errors.serviceType}
            helperText={errors.serviceType}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            type="number"
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

export default AddNewLaundryServiceDrawer;
