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
  addOrderItem,
  updateOrderItem,
} from "../../redux/slices/orderItemSlice"; // Adjust path as needed
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

const AddNewOrderItemDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.orderItems);

  const [formData, setFormData] = useState({
    itemName: "",
    unitPrice: "",
  });

  useEffect(() => {
    if (editMode) {
      setFormData({
        itemName: initialData.itemName || "",
        unitPrice: initialData.unitPrice || "",
      });
    } else {
      setFormData({ itemName: "", unitPrice: "" });
    }
  }, [editMode, initialData]);

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "itemName":
        if (!value) error.itemName = "Item name is required";
        break;
      case "unitPrice":
        if (!value) error.unitPrice = "Unit price is required";
        else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
          error.unitPrice = "Unit price must be a non-negative number";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, ...error }));
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    validateField(field, value);
  };

  useEffect(() => {
    const isValid =
      Object.values(formData).every((value) => value !== "") &&
      Object.values(errors).every((error) => error === undefined);
    setIsFormValid(isValid);
  }, [formData, errors]);

  const resetForm = () => {
    setFormData({ itemName: "", unitPrice: "" });
    setErrors({});
  };

  const handleSave = (event) => {
    event.preventDefault();
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (!isFormValid) {
      return;
    }

    if (editMode) {
      const itemData = { _id: initialData._id, ...formData };
      dispatch(updateOrderItem({ id: itemData._id, itemData }))
        .then(() => {
          toast.success("Order item updated successfully!", { duration: 5000 });
          resetForm();
          onClose();
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(
            "Error updating order item: " +
              (error.response?.data?.message || error.message)
          );
        });
    } else {
      dispatch(addOrderItem(formData))
        .then(() => {
          toast.success("Order item added successfully!", { duration: 5000 });
          resetForm();
          onClose();
        })
        .catch((error) => {
          toast.error(
            "Error adding order item: " +
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

  return (
    <>
      <StyledDrawer anchor="right" open={open} onClose={onClose}>
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
            <h2>{editMode ? "Edit Order Item" : "Add New Order Item"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Item Name"
            fullWidth
            margin="normal"
            value={formData.itemName}
            onChange={handleChange("itemName")}
            error={!!errors.itemName}
            helperText={errors.itemName}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Unit Price"
            fullWidth
            margin="normal"
            type="number"
            value={formData.unitPrice}
            onChange={handleChange("unitPrice")}
            error={!!errors.unitPrice}
            helperText={errors.unitPrice}
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
              type="submit"
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

export default AddNewOrderItemDrawer;
