import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createAlert,
  updateAlert,
  fetchAlerts,
} from "../../redux/slices/alertsSlice";
import { Toaster, toast } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0",
    boxSizing: "border-box",
  },
}));

const AddNewAlertDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.alerts);

  const [formData, setFormData] = useState({
    type: "lowStock",
    message: "",
    action: "",
    data: { inventoryId: "", reorderQuantity: "" },
    read: false,
    status: "active",
  });

  const [initialUser, setInitialUser] = useState(null);
  const [errors, setErrors] = useState({});

  // New state to track *only* the fields that have changed.
  const [changedFields, setChangedFields] = useState({});

  useEffect(() => {
    if (editMode) {
      // Initialize formData with initialData
      setFormData({
        _id: initialData._id, // Keep _id for updates
        type: initialData.type || "lowStock",
        message: initialData.message || "",
        action: initialData.action || "",
        data: initialData.data || { inventoryId: "", reorderQuantity: "" },
        read: initialData.read || false,
        status: initialData.status || "active",
      });

      setInitialUser(initialData.user);
      setChangedFields({}); // Reset changedFields on drawer open/close
    } else {
      setFormData({
        type: "lowStock",
        message: "",
        action: "",
        data: { inventoryId: "", reorderQuantity: "" },
        read: false,
        status: "active",
      });
      setInitialUser(null);
      setChangedFields({}); // Reset changedFields
    }
  }, [editMode, initialData, open]); // Add 'open' to dependency array

  const handleChange = (field) => (event) => {
    if (field !== "user") {
      const value =
        field === "data" ? JSON.parse(event.target.value) : event.target.value;

      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
      // Mark the field as changed.
      setChangedFields((prev) => ({ ...prev, [field]: value }));
    }
    validateField(field, event.target.value);
  };

  const handleDataChange = (key) => (event) => {
    const newData = { ...formData.data, [key]: event.target.value };
    setFormData((prev) => ({ ...prev, data: newData }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      data: undefined, // Clear previous data errors.
    }));
    // Mark 'data' as changed, and include the specific sub-field that changed.
    setChangedFields((prev) => ({
      ...prev,
      data: { ...prev.data, [key]: event.target.value },
    }));
    validateField("data", newData);
  };

  const handleReadChange = (event) => {
    const newReadStatus = event.target.value === "read";
    setFormData((prev) => ({ ...prev, read: newReadStatus }));
    // *Crucially* mark 'read' as changed.
    setChangedFields((prev) => ({ ...prev, read: newReadStatus }));
  };

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "type":
        if (!value) error.type = "Type is required";
        break;
      case "message":
        if (!value) error.message = "Message is required";
        break;
      case "action":
        if (!value) error.action = "Action is required";
        break;
      case "data":
        if (!value.inventoryId || !value.reorderQuantity)
          error.data = "Data fields are required";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
  };

  const resetForm = () => {
    setFormData({
      type: "lowStock",
      message: "",
      action: "",
      data: { inventoryId: "", reorderQuantity: "" },
      read: false,
      status: "active",
    });
    setErrors({});
    setInitialUser(null);
    setChangedFields({}); // Reset changed fields.
  };

  const handleSave = () => {
    if (editMode) {
      // Only send the changed fields, along with the _id.
      const updateData = {
        ...changedFields,
      };

      // If nothing has changed, don't send a request
      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      dispatch(updateAlert({ id: formData._id, alertData: updateData }))
        .then(() => {
          toast.success("Alert updated successfully!", { duration: 5000 });
          resetForm();
          dispatch(fetchAlerts()).then(() => onClose());
        })
        .catch((error) => {
          toast.error(
            "Error updating alert: " +
              (error.response?.data?.message || error.message)
          );
        });
    } else {
      // Validate all fields when adding new alert.
      Object.keys(formData).forEach((field) =>
        validateField(field, formData[field])
      );

      if (Object.values(errors).some((error) => error)) {
        return;
      }
      dispatch(createAlert(formData))
        .then(() => {
          toast.success("Alert added successfully!", { duration: 5000 });
          resetForm();
          dispatch(fetchAlerts()).then(() => onClose());
        })
        .catch((error) => {
          toast.error(
            "Error adding alert: " +
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
            <h2>{editMode ? "Edit Alert" : "Add New Alert"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="alert-type-label">Alert Type</InputLabel>
            <Select
              labelId="alert-type-label"
              value={formData.type}
              onChange={handleChange("type")}
              label="Alert Type"
              error={!!errors.type}
            >
              <MenuItem value="lowStock">Low Stock</MenuItem>
              <MenuItem value="nearExpiry">Near Expiry</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Message"
            fullWidth
            margin="normal"
            value={formData.message}
            onChange={handleChange("message")}
            error={!!errors.message}
            helperText={errors.message}
          />
          <TextField
            label="Action"
            fullWidth
            margin="normal"
            value={formData.action}
            onChange={handleChange("action")}
            error={!!errors.action}
            helperText={errors.action}
          />

          <TextField
            label="Inventory ID"
            fullWidth
            margin="normal"
            value={formData.data.inventoryId || ""}
            onChange={handleDataChange("inventoryId")}
            error={errors.data && errors.data.includes("inventoryId")} // Check for specific data field error
            helperText={
              errors.data && errors.data.includes("inventoryId")
                ? "Inventory ID is required"
                : ""
            }
          />
          <TextField
            label="Reorder Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={formData.data.reorderQuantity || ""}
            onChange={handleDataChange("reorderQuantity")}
            error={errors.data && errors.data.includes("reorderQuantity")} //check for specific data field error
            helperText={
              errors.data && errors.data.includes("reorderQuantity")
                ? "Reorder Quantity is required and must be valid"
                : ""
            }
          />

          {/* Display the user, but it's not editable and not part of the submitted form */}
          <TextField
            label="User"
            fullWidth
            margin="normal"
            value={
              editMode && initialUser
                ? initialUser.fullName
                : "Current User (Not Editable)"
            } // Show initial user's full name
            disabled // Always disabled
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="alert-status-label">Alert Status</InputLabel>
            <Select
              labelId="alert-status-label"
              value={formData.status}
              onChange={handleChange("status")}
              label="Alert Status"
              disabled={editMode} // If editing, status can't be changed
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="read-status-label">Read Status</InputLabel>
            <Select
              labelId="read-status-label"
              value={formData.read ? "read" : "unread"}
              onChange={handleReadChange} // Use dedicated handler
              label="Read Status"
            >
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
            </Select>
          </FormControl>

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

export default AddNewAlertDrawer;
