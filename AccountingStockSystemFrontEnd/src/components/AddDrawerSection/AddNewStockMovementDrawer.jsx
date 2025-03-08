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
//   createStockMovement,
//   fetchStockMovements,
//   updateStockMovement,
// } from "../../redux/slices/stockMovementSlice";
// import { fetchInventories } from "../../redux/slices/inventoriesSlice";
// import { fetchLocations } from "../../redux/slices/locationSlice";
// import { Toaster, toast } from "react-hot-toast";

// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   "& .MuiDrawer-paper": {
//     width: "30%",
//     height: "100vh",
//     top: "0px",
//     bottom: "50px",
//     boxSizing: "border-box",
//   },
// }));

// const AddNewStockMovementDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
//   onSaveSuccess,
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.stockMovements);
//   const { inventories } = useSelector((state) => state.inventories);
//   const { locations } = useSelector((state) => state.locations);

//   const [formData, setFormData] = useState({
//     inventory: "",
//     type: "Issue",
//     quantity: 0,
//     fromLocation: "",
//     toLocation: "",
//     reason: "",
//     transactionDate: "",
//   });

//   useEffect(() => {
//     dispatch(fetchInventories());
//     dispatch(fetchLocations());
//   }, [dispatch]);

//   useEffect(() => {
//     if (editMode) {
//       setFormData({
//         inventory: initialData.inventory || "",
//         type: initialData.type || "Issue",
//         quantity: initialData.quantity || 0,
//         fromLocation: initialData.fromLocation || "",
//         toLocation: initialData.toLocation || "",
//         reason: initialData.reason || "",
//         transactionDate: initialData.transactionDate
//           ? new Date(initialData.transactionDate)
//           : null,
//       });
//     } else {
//       setFormData({
//         inventory: "",
//         type: "Issue",
//         quantity: 0,
//         fromLocation: "",
//         toLocation: "",
//         reason: "",
//         transactionDate: null,
//       });
//     }
//   }, [editMode, initialData]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "inventory":
//         if (!value) error.inventory = "Inventory is required";
//         break;
//       case "type":
//         if (!value) error.type = "Type is required";
//         break;
//       case "quantity":
//         if (!value) error.quantity = "Quantity is required";
//         else if (isNaN(parseInt(value)) || parseInt(value) <= 0) {
//           error.quantity = "Quantity must be a positive integer";
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
//     console.log(field, event.target.value);
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: undefined,
//     }));
//     validateField(field, value);
//   };

//   const handleDateChange = (field) => (event) => {
//     const value = event.target.value ? new Date(event.target.value) : null; // Convert string to Date or set to null
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: undefined,
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       inventory: "",
//       type: "Issue",
//       quantity: 0,
//       fromLocation: "",
//       toLocation: "",
//       reason: "",
//       transactionDate: "",
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

//     if (editMode) {
//       dispatch(
//         updateStockMovement({
//           id: initialData._id,
//           stockMovementData: formData,
//         })
//       )
//         .then(() => {
//           toast.success("Stock movement updated successfully!", {
//             duration: 5000,
//           });
//           return dispatch(fetchStockMovements());
//         })
//         .then(() => {
//           onClose();
//           onSaveSuccess && onSaveSuccess();
//           resetForm();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating stock movement: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(createStockMovement(formData))
//         .then((response) => {
//           toast.success("Stock movement added successfully!", {
//             duration: 5000,
//           });
//           return dispatch(fetchStockMovements());
//         })
//         .then(() => {
//           onClose();
//           onSaveSuccess && onSaveSuccess();
//           resetForm();
//         })
//         .catch((error) => {
//           console.log("Error creating stock movement:", error); // Log the error object
//           console.error("Error response:", error.response);
//           console.error("Error:", error);
//           console.log("Error response:", error.response);
//           toast.error(
//             "Error adding stock movement: " +
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
//               {editMode ? "Edit Stock Movement" : "Add New Stock Movement"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="inventory-label">Inventory</InputLabel>
//             <Select
//               labelId="inventory-label"
//               value={formData.inventory || ""}
//               onChange={handleChange("inventory")}
//               label="Inventory"
//               error={!!errors.inventory}
//               helperText={errors.inventory}
//             >
//               {inventories.map((inventory) => (
//                 <MenuItem key={inventory._id} value={inventory._id}>
//                   {inventory.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="type-label">Movement Type</InputLabel>
//             <Select
//               labelId="type-label"
//               value={formData.type}
//               onChange={handleChange("type")}
//               label="Movement Type"
//               error={!!errors.type}
//               helperText={errors.type}
//             >
//               <MenuItem value="Issue">Issue</MenuItem>
//               <MenuItem value="Return">Return</MenuItem>
//               <MenuItem value="Adjustment">Adjustment</MenuItem>
//             </Select>
//           </FormControl>

//           <TextField
//             label="Quantity"
//             fullWidth
//             margin="normal"
//             type="number"
//             value={formData.quantity}
//             onChange={handleChange("quantity")}
//             error={!!errors.quantity}
//             FormHelperText={errors.quantity}
//             sx={{ "&.MuiInputBase-root": { height: "40px" } }}
//           />

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="from-location-label">From Location</InputLabel>
//             <Select
//               labelId="from-location-label"
//               value={formData.fromLocation}
//               onChange={handleChange("fromLocation")}
//               label="From Location"
//               error={!!errors.fromLocation}
//             >
//               {locations.map((location) => (
//                 <MenuItem key={location._id} value={location._id}>
//                   {location.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             {!!errors.fromLocation && (
//               <FormHelperText error>{errors.fromLocation}</FormHelperText>
//             )}
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="to-location-label">To Location</InputLabel>
//             <Select
//               labelId="to-location-label"
//               value={formData.toLocation}
//               onChange={handleChange("toLocation")}
//               label="To Location"
//               error={!!errors.toLocation}
//             >
//               {locations.map((location) => (
//                 <MenuItem key={location._id} value={location._id}>
//                   {location.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             {!!errors.toLocation && (
//               <FormHelperText error>{errors.toLocation}</FormHelperText>
//             )}
//           </FormControl>

//           <TextField
//             label="Reason"
//             fullWidth
//             margin="normal"
//             multiline
//             rows={3}
//             value={formData.reason}
//             onChange={handleChange("reason")}
//             error={!!errors.reason}
//             helperText={errors.reason}
//           />

//           <TextField
//             label="Transaction Date"
//             fullWidth
//             margin="normal"
//             type="date"
//             value={
//               formData.transactionDate &&
//               !isNaN(formData.transactionDate.valueOf())
//                 ? formData.transactionDate.toISOString().split("T")[0]
//                 : ""
//             }
//             onChange={handleDateChange("transactionDate")}
//             error={!!errors.transactionDate}
//             helperText={errors.transactionDate}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{ "&.MuiInputBase-root": { height: "40px" } }}
//           />

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

// export default AddNewStockMovementDrawer;

import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  FormHelperText, // Import FormHelperText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createStockMovement,
  fetchStockMovements,
  updateStockMovement,
} from "../../redux/slices/stockMovementSlice";
import { fetchInventories } from "../../redux/slices/inventoriesSlice";
import { fetchLocations } from "../../redux/slices/locationSlice";
import { toast, Toaster } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0px",
    bottom: "50px",
    boxSizing: "border-box",
  },
}));

const AddNewStockMovementDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.stockMovements);
  const { inventories } = useSelector((state) => state.inventories);
  const { locations } = useSelector((state) => state.locations);

  const [formData, setFormData] = useState({
    inventory: "",
    type: "Issue",
    quantity: 1, // Default to 1, as 0 is usually invalid
    fromLocation: "",
    toLocation: "",
    reason: "",
    transactionDate: new Date(), // Use a Date object
  });

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(fetchLocations());
  }, [dispatch]);

  useEffect(() => {
    if (editMode && initialData) {
      // Handle potentially null inventory, fromLocation, and toLocation
      setFormData({
        inventory: initialData.inventory?._id || "", // Use _id for select values
        type: initialData.type || "Issue",
        quantity: initialData.quantity !== undefined ? initialData.quantity : 1,
        fromLocation: initialData.fromLocation?._id || "", // Use _id
        toLocation: initialData.toLocation?._id || "", // Use _id
        reason: initialData.reason || "",
        transactionDate: initialData.transactionDate
          ? new Date(initialData.transactionDate)
          : new Date(), // Use current date as default if null
      });
    } else {
      resetForm(); // Use the reset function
    }
  }, [editMode, initialData, open]); // Add `open` to the dependency array

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "inventory":
        if (!value) error.inventory = "Inventory is required";
        break;
      case "type":
        if (!value) error.type = "Type is required";
        break;
      case "quantity":
        if (!value) error.quantity = "Quantity is required";
        else if (isNaN(parseInt(value)) || parseInt(value) <= 0) {
          error.quantity = "Quantity must be a positive integer";
        }
        break;
      case "fromLocation":
        if (!value) error.fromLocation = "From Location is required";
        break;
      case "toLocation":
        if (!value) error.toLocation = "To Location is required";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
    return Object.keys(error).length === 0; // Return true if no error
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    validateField(field, event.target.value);
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      transactionDate: date,
    }));
  };

  const resetForm = () => {
    setFormData({
      inventory: "",
      type: "Issue",
      quantity: 1,
      fromLocation: "",
      toLocation: "",
      reason: "",
      transactionDate: new Date(),
    });
    setErrors({}); // Clear errors on reset
  };

  const handleSave = async () => {
    // Validate all required fields before submission
    const fieldsToValidate = [
      "inventory",
      "type",
      "quantity",
      "fromLocation",
      "toLocation",
    ];
    let isValid = true;
    for (const field of fieldsToValidate) {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    }
    if (!isValid) return;

    // Prepare data for the API call
    const movementData = {
      inventory: formData.inventory,
      type: formData.type,
      quantity: Number(formData.quantity), // Ensure quantity is a number
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      reason: formData.reason,
      transactionDate: formData.transactionDate.toISOString(), // Convert Date to ISO string
    };

    try {
      if (editMode) {
        await dispatch(
          updateStockMovement({
            id: initialData._id,
            stockMovementData: movementData,
          })
        ).unwrap();
        toast.success("Stock movement updated successfully!");
      } else {
        await dispatch(createStockMovement(movementData)).unwrap();
        toast.success("Stock movement added successfully!");
      }
      onClose();
      onSaveSuccess && onSaveSuccess();
      resetForm(); // Reset form after successful save
    } catch (error) {
      toast.error(
        `Error ${editMode ? "updating" : "adding"} stock movement: ${
          error.message || "Unknown error"
        }`
      );
    }
  };

  const handleCancel = () => {
    onClose();
    resetForm(); // Reset form on cancel
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
              {editMode ? "Edit Stock Movement" : "Add New Stock Movement"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal" error={!!errors.inventory}>
            <InputLabel id="inventory-label">Inventory</InputLabel>
            <Select
              labelId="inventory-label"
              value={formData.inventory}
              onChange={handleChange("inventory")}
              label="Inventory"
              required
            >
              {inventories.map((inventory) => (
                <MenuItem key={inventory._id} value={inventory._id}>
                  {inventory.name}
                </MenuItem>
              ))}
            </Select>
            {errors.inventory && (
              <FormHelperText>{errors.inventory}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.type}>
            <InputLabel id="type-label">Movement Type</InputLabel>
            <Select
              labelId="type-label"
              value={formData.type}
              onChange={handleChange("type")}
              label="Movement Type"
              required
            >
              <MenuItem value="Issue">Issue</MenuItem>
              <MenuItem value="Return">Return</MenuItem>
              <MenuItem value="Adjustment">Adjustment</MenuItem>
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>

          <TextField
            label="Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.quantity}
            onChange={handleChange("quantity")}
            error={!!errors.quantity}
            helperText={errors.quantity} // Use helperText for error message
            required
            inputProps={{ min: 1 }} // Ensure quantity is at least 1
          />

          <FormControl fullWidth margin="normal" error={!!errors.fromLocation}>
            <InputLabel id="from-location-label">From Location</InputLabel>
            <Select
              labelId="from-location-label"
              value={formData.fromLocation}
              onChange={handleChange("fromLocation")}
              label="From Location"
            >
              {locations.map((location) => (
                <MenuItem key={location._id} value={location._id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
            {errors.fromLocation && (
              <FormHelperText>{errors.fromLocation}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.toLocation}>
            <InputLabel id="to-location-label">To Location</InputLabel>
            <Select
              labelId="to-location-label"
              value={formData.toLocation}
              onChange={handleChange("toLocation")}
              label="To Location"
            >
              {locations.map((location) => (
                <MenuItem key={location._id} value={location._id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
            {errors.toLocation && (
              <FormHelperText>{errors.toLocation}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Reason"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.reason}
            onChange={handleChange("reason")}
          />

          <TextField
            label="Transaction Date"
            fullWidth
            margin="normal"
            type="datetime-local"
            value={formData.transactionDate.toISOString().slice(0, 16)}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 3,
            }}
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

export default AddNewStockMovementDrawer;
