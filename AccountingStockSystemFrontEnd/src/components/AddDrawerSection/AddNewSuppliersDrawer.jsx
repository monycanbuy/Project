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
  createSupplier,
  fetchSuppliers,
  updateSupplier,
} from "../../redux/slices/suppliersSlice"; // Adjust path as needed
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

const AddNewSuppliersDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.suppliers);

  const [formData, setFormData] = useState({
    address: "",
    contactPhone: "",
    contactEmail: "",
    contactPerson: "",
  });

  // Update formData when editMode or initialData changes
  useEffect(() => {
    if (editMode) {
      setFormData({
        address: initialData.address || "",
        contactPhone: initialData.contactPhone || "",
        contactEmail: initialData.contactEmail || "",
        contactPerson: initialData.contactPerson || "",
      });
    } else {
      // Reset form data for creating a new supplier
      setFormData({
        address: "",
        contactPhone: "",
        contactEmail: "",
        contactPerson: "",
      });
    }
  }, [editMode, initialData]);

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "contactPhone":
        if (!value) error.contactPhone = "Contact phone is required";
        break;
      case "contactEmail":
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error.contactEmail = "Invalid email address";
        }
        break;
      case "contactPerson":
        if (!value) error.contactPerson = "Contact person is required";
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
      address: "",
      contactPhone: "",
      contactEmail: "",
      contactPerson: "",
    });
    setErrors({});
    setIsSaving(false);
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    setIsSaving(true); // Start spinner on save button

    if (editMode) {
      const { _id, ...supplierData } = formData; // Exclude _id from the update data
      dispatch(updateSupplier({ id: initialData._id, supplierData }))
        .then(() => {
          toast.success("Supplier updated successfully!", {
            duration: 5000,
          });
          resetForm();
          dispatch(fetchSuppliers());
          onClose();
        })
        .catch((error) => {
          toast.error(
            "Error updating supplier: " +
              (error.response?.data?.message || error.message)
          );
        })
        .finally(() => setIsSaving(false)); // Stop spinner
    } else {
      dispatch(createSupplier(formData))
        .then(() => {
          toast.success("Supplier added successfully!", {
            duration: 5000,
          });
          resetForm();
          dispatch(fetchSuppliers());
          onClose();
        })
        .catch((error) => {
          toast.error(
            "Error adding supplier: " +
              (error.response?.data?.message || error.message),
            { duration: 7000 }
          );
        })
        .finally(() => setIsSaving(false)); // Stop spinner
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Disable save button if any required field is empty or has an error
  const isSaveDisabled =
    !formData.contactPhone ||
    !formData.contactPerson ||
    Object.values(errors).some((error) => error);

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
            <h2>{editMode ? "Edit Supplier" : "Add New Supplier"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            label="Contact Person"
            fullWidth
            margin="normal"
            value={formData.contactPerson}
            onChange={handleChange("contactPerson")}
            error={!!errors.contactPerson}
            helperText={errors.contactPerson}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Contact Email"
            fullWidth
            margin="normal"
            value={formData.contactEmail}
            onChange={handleChange("contactEmail")}
            error={!!errors.contactEmail}
            helperText={errors.contactEmail}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Contact Phone"
            fullWidth
            margin="normal"
            value={formData.contactPhone}
            onChange={handleChange("contactPhone")}
            error={!!errors.contactPhone}
            helperText={errors.contactPhone}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={formData.address}
            onChange={handleChange("address")}
            error={!!errors.address}
            helperText={errors.address}
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
              disabled={isLoading || isSaveDisabled || isSaving}
            >
              {isSaving ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewSuppliersDrawer;
