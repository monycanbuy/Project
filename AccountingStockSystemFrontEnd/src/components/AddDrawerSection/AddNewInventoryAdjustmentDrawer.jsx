// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Drawer,
//   Box,
//   TextField,
//   IconButton,
//   MenuItem,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   FormHelperText,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDispatch, useSelector } from "react-redux";
// import { format } from "date-fns";
// import {
//   createInventoryAdjustment,
//   fetchInventoryAdjustments,
//   updateInventoryAdjustment,
// } from "../../redux/slices/inventoryAdjustmentSlice";
// import { fetchInventories } from "../../redux/slices/inventoriesSlice";
// import { fetchLocations } from "../../redux/slices/locationSlice";
// import { Toaster, toast } from "react-hot-toast";
// import { fetchAllUsers } from "../../redux/slices/authSlice";

// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   "& .MuiDrawer-paper": {
//     width: "30%",
//     height: "100vh",
//     top: "0px",
//     bottom: "50px",
//     boxSizing: "border-box",
//   },
// }));

// const AddNewInventoryAdjustmentDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.inventoryAdjustments);
//   const { inventories } = useSelector((state) => state.inventories);
//   const { locations } = useSelector((state) => state.locations);
//   const { users } = useSelector((state) => state.auth); // Assuming users are fetched this way

//   const [formData, setFormData] = useState({
//     product: "", // Default to empty string, this will be an ObjectId of inventory
//     type: "Adjustment",
//     changeInQuantity: 0,
//     newQuantity: 0,
//     reason: "",
//     transactionDate: "",
//     staff: "", // User ID for who is performing the adjustment
//   });

//   useEffect(() => {
//     dispatch(fetchInventories());
//     dispatch(fetchLocations());
//     dispatch(fetchAllUsers());
//   }, [dispatch]);

//   useEffect(() => {
//     if (editMode) {
//       setFormData({
//         product: initialData.product || "",
//         type: initialData.type || "Adjustment",
//         changeInQuantity: initialData.changeInQuantity || 0,
//         newQuantity: initialData.newQuantity || 0,
//         reason: initialData.reason || "",
//         transactionDate: initialData.transactionDate
//           ? new Date(initialData.transactionDate).toISOString().split("T")[0]
//           : "",
//         staff: initialData.staff || "", // Assuming staff is stored in adjustments
//       });
//     } else {
//       setFormData({
//         product: "",
//         type: "Adjustment",
//         changeInQuantity: 0,
//         newQuantity: 0,
//         reason: "",
//         transactionDate: format(new Date(), "yyyy-MM-dd"), // Default to today's date
//         staff: "", // Default to empty string
//       });
//     }
//   }, [editMode, initialData]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "product":
//         if (!value) error.product = "Product is required";
//         break;
//       case "type":
//         if (!value) error.type = "Type is required";
//         break;
//       case "changeInQuantity":
//       case "newQuantity":
//         if (!value)
//           error[name] = `${
//             name.charAt(0).toUpperCase() + name.slice(1)
//           } is required`;
//         else if (isNaN(parseFloat(value))) {
//           error[name] = `${
//             name.charAt(0).toUpperCase() + name.slice(1)
//           } must be a number`;
//         }
//         break;
//       default:
//         break;
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       ...error,
//     }));
//   };

//   const handleChange = (field) => (event) => {
//     const { value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [field]:
//         field === "staff" ? value : isNaN(value) ? value : parseFloat(value),
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: undefined,
//     }));
//     validateField(field, value);
//   };

//   const handleDateChange = (event) => {
//     setFormData((prev) => ({
//       ...prev,
//       transactionDate: event.target.value,
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       product: "",
//       type: "Adjustment",
//       changeInQuantity: 0,
//       newQuantity: 0,
//       reason: "",
//       transactionDate: "",
//       staff: "",
//     });
//     setErrors({});
//   };

//   const handleSave = () => {
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );

//     if (Object.values(errors).some((error) => error)) {
//       return;
//     }

//     const adjustmentData = {
//       ...formData,
//       transactionDate: new Date(formData.transactionDate), // Convert back to Date object for backend
//     };

//     if (editMode) {
//       dispatch(
//         updateInventoryAdjustment({
//           id: initialData._id,
//           adjustmentData: adjustmentData,
//         })
//       )
//         .then(() => {
//           toast.success("Inventory adjustment updated successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchInventoryAdjustments());
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating inventory adjustment: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(createInventoryAdjustment(adjustmentData))
//         .then(() => {
//           toast.success("Inventory adjustment added successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchInventoryAdjustments());
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           toast.error(
//             "Error adding inventory adjustment: " +
//               (error.response?.data?.message || error.message),
//             { duration: 7000 }
//           );
//         });
//     }
//   };

//   const handleCancel = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <>
//       <StyledDrawer anchor="right" open={open} onClose={onClose}>
//         <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <h2>
//               {editMode
//                 ? "Edit Inventory Adjustment"
//                 : "Add New Inventory Adjustment"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="product-label">Product</InputLabel>
//             <Select
//               labelId="product-label"
//               value={formData.product}
//               onChange={handleChange("product")}
//               label="Product"
//               error={!!errors.product}
//             >
//               {inventories.map((inventory) => (
//                 <MenuItem key={inventory._id} value={inventory._id}>
//                   {inventory.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             {errors.product && (
//               <FormHelperText error>{errors.product}</FormHelperText>
//             )}
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="type-label">Adjustment Type</InputLabel>
//             <Select
//               labelId="type-label"
//               value={formData.type}
//               onChange={handleChange("type")}
//               label="Adjustment Type"
//               error={!!errors.type}
//             >
//               <MenuItem value="Adjustment">Adjustment</MenuItem>
//               <MenuItem value="Correction">Correction</MenuItem>
//               <MenuItem value="Damage">Damage</MenuItem>
//               <MenuItem value="Loss">Loss</MenuItem>
//             </Select>
//             {errors.type && (
//               <FormHelperText error>{errors.type}</FormHelperText>
//             )}
//           </FormControl>

//           <TextField
//             label="Change In Quantity"
//             fullWidth
//             margin="normal"
//             type="number"
//             value={formData.changeInQuantity}
//             onChange={handleChange("changeInQuantity")}
//             error={!!errors.changeInQuantity}
//             helperText={errors.changeInQuantity}
//           />

//           <TextField
//             label="New Quantity"
//             fullWidth
//             margin="normal"
//             type="number"
//             value={formData.newQuantity}
//             onChange={handleChange("newQuantity")}
//             error={!!errors.newQuantity}
//             helperText={errors.newQuantity}
//           />

//           <TextField
//             label="Reason"
//             fullWidth
//             margin="normal"
//             multiline
//             rows={3}
//             value={formData.reason}
//             onChange={handleChange("reason")}
//           />

//           <TextField
//             label="Transaction Date"
//             fullWidth
//             margin="normal"
//             type="date"
//             value={formData.transactionDate}
//             onChange={handleDateChange}
//             InputLabelProps={{ shrink: true }}
//           />

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="staff-label">Staff</InputLabel>
//             <Select
//               labelId="staff-label"
//               value={formData.staff}
//               onChange={handleChange("staff")}
//               label="Staff"
//             >
//               {users.map((user) => (
//                 <MenuItem key={user._id} value={user._id}>
//                   {user.fullName || user.username || "Unknown User"}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <Box
//             sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
//           >
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               sx={{ width: "120px", borderRadius: "12px" }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={handleSave}
//               sx={{
//                 width: "120px",
//                 borderRadius: "12px",
//                 backgroundColor: "green",
//                 color: "white",
//                 "&:hover": { backgroundColor: "darkgreen" },
//               }}
//               disabled={isLoading}
//             >
//               {isLoading ? <CircularProgress size={24} /> : "Save"}
//             </Button>
//           </Box>
//         </Box>
//       </StyledDrawer>
//       <Toaster />
//     </>
//   );
// };

// export default AddNewInventoryAdjustmentDrawer;

import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Typography,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  createInventoryAdjustment,
  fetchInventoryAdjustments,
  updateInventoryAdjustment,
} from "../../redux/slices/inventoryAdjustmentSlice";
import { fetchInventories } from "../../redux/slices/inventoriesSlice";
import { fetchLocations } from "../../redux/slices/locationSlice";
import { fetchAllUsers } from "../../redux/slices/authSlice";
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

const AddNewInventoryAdjustmentDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.inventoryAdjustments);
  const { inventories } = useSelector((state) => state.inventories);
  const { locations } = useSelector((state) => state.locations);
  const { users = [], user: currentUser } = useSelector((state) => state.auth); // Default to empty array

  const getInitialFormData = useCallback(() => {
    if (editMode && initialData._id) {
      const selectedInventory = inventories.find(
        (inv) => inv._id === initialData.product
      );
      return {
        product: initialData.product || "",
        type: initialData.type || "Adjustment",
        adjustmentReason: initialData.adjustmentReason || "Other",
        changeInQuantity:
          initialData.changeInQuantity !== undefined
            ? String(initialData.changeInQuantity)
            : "",
        previousQuantity:
          initialData.previousQuantity !== undefined
            ? String(initialData.previousQuantity)
            : "",
        newQuantity:
          initialData.newQuantity !== undefined
            ? String(initialData.newQuantity)
            : "",
        adjustmentCost:
          initialData.adjustmentCost !== undefined
            ? String(initialData.adjustmentCost)
            : "",
        reason: initialData.reason || "",
        status: initialData.status || "Pending",
        approvedBy: initialData.approvedBy || null,
        adjustmentLocation: initialData.adjustmentLocation || null,
        transactionDate: initialData.transactionDate
          ? format(new Date(initialData.transactionDate), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
      };
    }
    return {
      product: "",
      type: "Adjustment",
      adjustmentReason: "Other",
      changeInQuantity: "",
      previousQuantity: "",
      newQuantity: "",
      adjustmentCost: "",
      reason: "",
      status: "Pending",
      approvedBy: null,
      adjustmentLocation: null,
      transactionDate: format(new Date(), "yyyy-MM-dd"),
    };
  }, [editMode, initialData, inventories]);

  const [formData, setFormData] = useState(getInitialFormData());
  const [formErrors, setFormErrors] = useState({});
  const [previousStockQuantity, setPreviousStockQuantity] = useState(0);

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(fetchLocations());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
      const selectedInventory = inventories.find(
        (inv) => inv._id === (editMode ? initialData.product : formData.product)
      );
      setPreviousStockQuantity(selectedInventory?.stockQuantity || 0);
      setFormErrors({});
    }
  }, [open, getInitialFormData]);

  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case "product":
        errors.product = !value ? "Product is required" : null;
        break;
      case "type":
        errors.type = !value ? "Adjustment type is required" : null;
        break;
      case "adjustmentReason":
        errors.adjustmentReason = !value
          ? "Adjustment reason is required"
          : null;
        break;
      case "changeInQuantity":
        if (value === "" || isNaN(parseInt(value))) {
          errors.changeInQuantity =
            "Change in quantity is required and must be a number";
        } else if (!Number.isInteger(parseFloat(value))) {
          errors.changeInQuantity = "Change in quantity must be an integer";
        } else {
          errors.changeInQuantity = null;
        }
        break;
      case "previousQuantity":
        errors.previousQuantity =
          value === "" || isNaN(parseInt(value)) || parseInt(value) < 0
            ? "Previous quantity is required and must be non-negative"
            : null;
        break;
      case "newQuantity":
        errors.newQuantity =
          value === "" || isNaN(parseInt(value)) || parseInt(value) < 0
            ? "New quantity is required and must be non-negative"
            : null;
        break;
      default:
        break;
    }

    setFormErrors((prev) => {
      const updatedErrors = { ...prev, ...errors };
      Object.keys(errors).forEach((key) => {
        if (errors[key] === null) delete updatedErrors[key];
      });
      return updatedErrors;
    });
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => {
      const updatedForm = { ...prev, [field]: value };
      if (field === "product") {
        const selectedInventory = inventories.find((inv) => inv._id === value);
        updatedForm.previousQuantity = selectedInventory
          ? String(selectedInventory.stockQuantity)
          : "";
        updatedForm.newQuantity = "";
        updatedForm.adjustmentCost = "";
        setPreviousStockQuantity(selectedInventory?.stockQuantity || 0);
      } else if (field === "changeInQuantity" && !isNaN(parseInt(value))) {
        const change = parseInt(value, 10);
        updatedForm.newQuantity = String(previousStockQuantity + change);
        const selectedInventory = inventories.find(
          (inv) => inv._id === updatedForm.product
        );
        updatedForm.adjustmentCost = String(
          change * (selectedInventory?.costPrice || 0)
        );
      }
      validateField(field, value);
      return updatedForm;
    });
  };

  const handleDateChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      transactionDate: value,
    }));
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setPreviousStockQuantity(0);
    setFormErrors({});
  };

  const validateForm = () => {
    const requiredFields = [
      "product",
      "type",
      "adjustmentReason",
      "changeInQuantity",
      "previousQuantity",
      "newQuantity",
    ];
    const errors = {};

    requiredFields.forEach((field) => {
      validateField(field, formData[field]);
    });

    const prevQty = parseInt(formData.previousQuantity, 10);
    const changeQty = parseInt(formData.changeInQuantity, 10);
    const newQty = parseInt(formData.newQuantity, 10);
    if (
      !isNaN(prevQty) &&
      !isNaN(changeQty) &&
      !isNaN(newQty) &&
      newQty !== prevQty + changeQty
    ) {
      errors.newQuantity =
        "New quantity must equal previous quantity plus change in quantity";
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys({ ...formErrors, ...errors }).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      console.log("Form validation failed:", formErrors);
      toast.error("Please correct the errors in the form");
      return;
    }

    const adjustmentData = {
      product: formData.product,
      type: formData.type,
      adjustmentReason: formData.adjustmentReason,
      changeInQuantity: parseInt(formData.changeInQuantity, 10),
      previousQuantity: parseInt(formData.previousQuantity, 10),
      newQuantity: parseInt(formData.newQuantity, 10),
      adjustmentCost: parseFloat(formData.adjustmentCost) || 0,
      reason: formData.reason,
      status: formData.status,
      approvedBy: formData.approvedBy || null,
      adjustmentLocation: formData.adjustmentLocation || null,
      transactionDate: new Date(formData.transactionDate).toISOString(),
    };

    try {
      if (editMode) {
        await dispatch(
          updateInventoryAdjustment({
            id: initialData._id,
            adjustmentData,
          })
        ).unwrap();
        toast.success("Inventory adjustment updated successfully!", {
          duration: 5000,
        });
      } else {
        await dispatch(createInventoryAdjustment(adjustmentData)).unwrap();
        toast.success("Inventory adjustment added successfully!", {
          duration: 5000,
        });
      }
      dispatch(fetchInventoryAdjustments());
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving inventory adjustment:", error);
      toast.error(
        `Error: ${error.message || "Failed to save inventory adjustment"}`,
        { duration: 7000 }
      );
      setFormErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to save inventory adjustment",
      }));
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const selectedInventory = inventories.find(
    (inv) => inv._id === formData.product
  );

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
            <Typography variant="h5">
              {editMode
                ? "Edit Inventory Adjustment"
                : "Add New Inventory Adjustment"}
            </Typography>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              value={formData.product}
              onChange={handleChange("product")}
              label="Product"
              error={!!formErrors.product}
            >
              {inventories.map((inventory) => (
                <MenuItem key={inventory._id} value={inventory._id}>
                  {inventory.name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.product && (
              <FormHelperText error>{formErrors.product}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label">Adjustment Type</InputLabel>
            <Select
              labelId="type-label"
              value={formData.type}
              onChange={handleChange("type")}
              label="Adjustment Type"
              error={!!formErrors.type}
            >
              <MenuItem value="Issue">Issue</MenuItem>
              <MenuItem value="Return">Return</MenuItem>
              <MenuItem value="Adjustment">Adjustment</MenuItem>
            </Select>
            {formErrors.type && (
              <FormHelperText error>{formErrors.type}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="adjustmentReason-label">
              Adjustment Reason
            </InputLabel>
            <Select
              labelId="adjustmentReason-label"
              value={formData.adjustmentReason}
              onChange={handleChange("adjustmentReason")}
              label="Adjustment Reason"
              error={!!formErrors.adjustmentReason}
            >
              <MenuItem value="Damage">Damage</MenuItem>
              <MenuItem value="Theft">Theft</MenuItem>
              <MenuItem value="Expiry">Expiry</MenuItem>
              <MenuItem value="Error">Error</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {formErrors.adjustmentReason && (
              <FormHelperText error>
                {formErrors.adjustmentReason}
              </FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Previous Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.previousQuantity}
            onChange={handleChange("previousQuantity")}
            error={!!formErrors.previousQuantity}
            helperText={formErrors.previousQuantity}
            disabled
          />

          <TextField
            label="Change In Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.changeInQuantity}
            onChange={handleChange("changeInQuantity")}
            error={!!formErrors.changeInQuantity}
            helperText={formErrors.changeInQuantity}
          />

          <TextField
            label="New Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.newQuantity}
            onChange={handleChange("newQuantity")}
            error={!!formErrors.newQuantity}
            helperText={formErrors.newQuantity}
            disabled
          />

          <TextField
            label="Adjustment Cost"
            fullWidth
            margin="normal"
            type="number"
            value={formData.adjustmentCost}
            onChange={handleChange("adjustmentCost")}
            error={!!formErrors.adjustmentCost}
            helperText={formErrors.adjustmentCost}
            disabled
          />

          <TextField
            label="Reason"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.reason}
            onChange={handleChange("reason")}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status}
              onChange={handleChange("status")}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="approvedBy-label">Approved By</InputLabel>
            <Select
              labelId="approvedBy-label"
              value={formData.approvedBy || ""}
              onChange={handleChange("approvedBy")}
              label="Approved By"
              disabled={!users.length} // Disable if no users
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.fullName || user.username || "Unknown User"}
                </MenuItem>
              ))}
            </Select>
            {!users.length && <FormHelperText>Loading users...</FormHelperText>}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="adjustmentLocation-label">
              Adjustment Location
            </InputLabel>
            <Select
              labelId="adjustmentLocation-label"
              value={formData.adjustmentLocation || ""}
              onChange={handleChange("adjustmentLocation")}
              label="Adjustment Location"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {locations.map((location) => (
                <MenuItem key={location._id} value={location._id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Transaction Date"
            fullWidth
            margin="normal"
            type="date"
            value={formData.transactionDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
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
          {formErrors.submit && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {formErrors.submit}
            </Alert>
          )}
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewInventoryAdjustmentDrawer;
