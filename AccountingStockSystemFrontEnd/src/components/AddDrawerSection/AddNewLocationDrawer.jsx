import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createLocation,
  updateLocation,
} from "../../redux/slices/locationSlice"; // Adjust path as needed
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

const AddNewLocationDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.locations);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
  });

  useEffect(() => {
    if (editMode) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
        capacity: initialData.capacity || "",
      });
    } else {
      setFormData({
        name: "",
        type: "",
        capacity: "",
      });
    }
  }, [editMode, initialData]);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "name":
        if (!value) error.name = "Name is required";
        break;
      case "type":
        if (!value) error.type = "Type is required";
        break;
      case "capacity":
        if (value && (isNaN(parseInt(value)) || parseInt(value) < 0)) {
          error.capacity = "Capacity must be a non-negative integer";
        }
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
    if (!event.target) return;
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
    validateField(field, value);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      capacity: "",
    });
    setErrors({});
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    if (editMode) {
      const locationData = {
        _id: initialData._id,
        ...formData,
      };
      dispatch(updateLocation({ id: locationData._id, locationData }))
        .then(() => {
          toast.success("Location updated successfully!", {
            duration: 5000,
          });
          resetForm();
          onClose();
        })
        .catch((error) => {
          toast.error(
            "Error updating location: " +
              (error.response?.data?.message || error.message)
          );
        });
    } else {
      dispatch(createLocation(formData))
        .then(() => {
          toast.success("Location added successfully!", {
            duration: 5000,
          });
          resetForm();
          onClose();
        })
        .catch((error) => {
          toast.error(
            "Error adding location: " +
              (error.response?.data?.message || error.message),
            { duration: 7000 }
          );
        });
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid = formData.name && formData.type && formData.capacity;

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
            <h2>{editMode ? "Edit Location" : "Add New Location"}</h2>
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
            error={!!errors.name}
            helperText={errors.name}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Type"
            fullWidth
            margin="normal"
            select
            value={formData.type}
            onChange={handleChange("type")}
            error={!!errors.type}
            helperText={errors.type}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          >
            <MenuItem value="Kitchen">Kitchen</MenuItem>
            <MenuItem value="Storeroom">Storeroom</MenuItem>
            <MenuItem value="Shelf">Shelf</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Capacity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.capacity}
            onChange={handleChange("capacity")}
            error={!!errors.capacity}
            helperText={errors.capacity}
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
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
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

export default AddNewLocationDrawer;
