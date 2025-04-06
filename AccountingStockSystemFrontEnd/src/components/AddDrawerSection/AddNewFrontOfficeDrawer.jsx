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
  createFrontOfficeSale,
  fetchFrontOfficeSaleById,
  updateFrontOfficeSale,
  fetchFrontOfficeSales,
} from "../../redux/slices/frontOfficeSlice";
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

const AddNewFrontOfficeDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.frontOffice);

  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    notes: "",
  });

  // Update formData when editMode or initialData changes
  useEffect(() => {
    // console.log("Edit Mode:", editMode);
    // console.log("Initial Data:", initialData);

    // Safely format the date for datetime-local input
    let formattedDate = "";
    if (initialData.date && initialData.date !== "N/A") {
      const dateObj = new Date(initialData.date);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().slice(0, 16);
      } else {
        console.warn("Invalid date value in initialData:", initialData.date);
      }
    }

    if (editMode && initialData) {
      setFormData({
        date: formattedDate,
        amount:
          initialData.amount !== undefined && !isNaN(initialData.amount)
            ? initialData.amount.toString()
            : "",
        notes: initialData.notes || "",
      });
    } else {
      // Reset form data for creating a new front office sale
      setFormData({
        date: "",
        amount: "",
        notes: "",
      });
    }
    //console.log("Updated Form Data:", formData);
  }, [editMode, initialData]);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "date":
        if (!value) error.date = "Date is required";
        break;
      case "amount":
        if (!value) error.amount = "Amount is required";
        else if (isNaN(Number(value))) error.amount = "Amount must be a number";
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
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleBlur = (field) => (event) => {
    const { value } = event.target;
    validateField(field, value);
  };

  const resetForm = () => {
    setFormData({
      date: "",
      amount: "",
      notes: "",
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

    const saleData = {
      date: formData.date,
      amount: parseFloat(formData.amount), // Ensure amount is a number
      notes: formData.notes,
    };

    if (editMode) {
      dispatch(updateFrontOfficeSale({ id: initialData._id, saleData }))
        .then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            toast.success("Sale updated successfully!", { duration: 5000 });
            resetForm();
            onClose();
            dispatch(fetchFrontOfficeSales());
          } else {
            toast.error("Failed to update sale: " + response.payload, {
              duration: 5000,
            });
          }
        })
        .catch((error) => {
          toast.error(
            "Error updating sale: " +
              (error.response?.data?.message || error.message)
          );
        });
    } else {
      dispatch(createFrontOfficeSale(saleData))
        .then(() => {
          toast.success("Sale created successfully!", { duration: 5000 });
          resetForm();
          onClose();
          dispatch(fetchFrontOfficeSales());
        })
        .catch((error) => {
          toast.error(
            "Error creating sale: " +
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
        <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <h2>{editMode ? "Edit Sale" : "Add New Sale"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Date"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.date}
            onChange={handleChange("date")}
            onBlur={handleBlur("date")}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={formData.amount}
            onChange={handleChange("amount")}
            onBlur={handleBlur("amount")}
            error={!!errors.amount}
            helperText={errors.amount}
          />
          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={formData.notes}
            onChange={handleChange("notes")}
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

export default AddNewFrontOfficeDrawer;
