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
  FormControlLabel,
  Checkbox,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  createInventory,
  fetchInventories,
  updateInventory,
} from "../../redux/slices/inventoriesSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchSuppliers } from "../../redux/slices/suppliersSlice";
import { fetchLocations } from "../../redux/slices/locationSlice";
import AddIcon from "@mui/icons-material/Add";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0px",
    bottom: "50px",
    boxSizing: "border-box",
  },
}));

const AddNewInventoryDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.inventories);
  const { categories } = useSelector((state) => state.categories);
  const { suppliers } = useSelector((state) => state.suppliers);
  const { locations } = useSelector((state) => state.locations);

  const [propertyImage, setPropertyImage] = useState({ name: "", url: "" });
  const [formErrors, setFormErrors] = useState({});

  // Initialize formData with defaults or initialData when drawer opens
  const getInitialFormData = useCallback(() => {
    let populatedBatches = [];
    if (editMode && initialData.batches) {
      populatedBatches = initialData.batches.map((batch) => ({
        batchNumber: batch.batchNumber || "",
        quantity: batch.quantity !== undefined ? String(batch.quantity) : "",
        expiryDate: batch.expiryDate
          ? format(new Date(batch.expiryDate), "yyyy-MM-dd")
          : "",
        receivedDate: batch.receivedDate
          ? format(new Date(batch.receivedDate), "yyyy-MM-dd")
          : "",
      }));
    }

    return {
      name: initialData.name || "",
      description: initialData.description || "",
      costPrice:
        initialData.costPrice !== undefined
          ? String(initialData.costPrice)
          : "",
      sellingPrice:
        initialData.sellingPrice !== undefined
          ? String(initialData.sellingPrice)
          : "",
      category: initialData.category?._id || "",
      stockQuantity:
        initialData.stockQuantity !== undefined
          ? String(initialData.stockQuantity)
          : "",
      supplier: initialData.supplier || "",
      imageUrl: initialData.imageUrl || "",
      reorderLevel:
        initialData.reorderLevel !== undefined
          ? String(initialData.reorderLevel)
          : "",
      reorderQuantity:
        initialData.reorderQuantity !== undefined
          ? String(initialData.reorderQuantity)
          : "",
      // locationName: initialData.locationName?._id || "",
      locationName: initialData.locationName || "",
      unit: initialData.unit || "",
      isPerishable: initialData.isPerishable || false,
      lastRestocked: initialData.lastRestocked
        ? format(new Date(initialData.lastRestocked), "yyyy-MM-dd")
        : null,
      isActive:
        initialData.isActive === undefined ? true : initialData.isActive,
      batches: populatedBatches,
    };
  }, [editMode, initialData]);

  const [formData, setFormData] = useState(getInitialFormData());

  // Reset form when drawer opens or mode changes
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
      setPropertyImage({
        name: initialData.imageUrl ? "Existing Image" : "",
        url: initialData.imageUrl || "",
      });
      console.log("Form data set on open:", getInitialFormData());
      setFormErrors({});
    }
  }, [open, getInitialFormData]);

  // Fetch dropdown data once on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSuppliers());
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleAddBatch = () => {
    setFormData((prev) => ({
      ...prev,
      batches: [
        ...prev.batches,
        { batchNumber: "", quantity: "", expiryDate: "" },
      ],
    }));
  };

  const handleRemoveBatch = (index) => {
    setFormData((prev) => {
      const newBatches = [...prev.batches];
      newBatches.splice(index, 1);
      const updatedBatches = newBatches.map((batch, i) => ({
        ...batch,
        batchNumber: generateBatchNumber(prev.name, i),
      }));
      return { ...prev, batches: updatedBatches };
    });
  };

  const handleBatchChange = (index, field, value) => {
    const updatedBatches = [...formData.batches];
    updatedBatches[index] = {
      ...updatedBatches[index],
      [field]: field === "quantity" ? parseInt(value, 10) || 0 : value,
    };
    if (field !== "batchNumber") {
      updatedBatches[index].batchNumber = generateBatchNumber(
        formData.name,
        index
      );
    }
    setFormData((prev) => ({
      ...prev,
      batches: updatedBatches,
    }));
  };

  const generateBatchNumber = (itemName, index) => {
    const now = new Date();
    const datePart = format(now, "yyyyMMdd");
    const itemPart = itemName.toUpperCase().replace(/\s+/g, "").substring(0, 4);
    const indexPart = String(index + 1).padStart(3, "0");
    return `${itemPart}-${datePart}-${indexPart}`; // Fixed HTML-like syntax
  };

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      batches: prev.batches.map((batch, index) => ({
        ...batch,
        batchNumber: generateBatchNumber(newName, index),
      })),
    }));
  };

  const handleDateChange = (field) => (event) => {
    const value = event.target.value ? new Date(event.target.value) : null;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name) errors.name = "Name is required";
    if (formData.costPrice === "" || parseFloat(formData.costPrice) < 0)
      errors.costPrice = "Cost Price is required and must be non-negative";
    if (formData.sellingPrice === "" || parseFloat(formData.sellingPrice) < 0)
      errors.sellingPrice =
        "Selling Price is required and must be non-negative";
    if (!formData.category) errors.category = "Category is required";
    if (
      formData.stockQuantity === "" ||
      parseInt(formData.stockQuantity, 10) < 0
    )
      errors.stockQuantity =
        "Stock Quantity is required and must be a non-negative integer";
    if (!formData.supplier) errors.supplier = "Supplier is required";
    if (formData.reorderLevel === "" || parseInt(formData.reorderLevel, 10) < 0)
      errors.reorderLevel =
        "Reorder Level is required and must be a non-negative integer";
    if (
      formData.reorderQuantity === "" ||
      parseInt(formData.reorderQuantity, 10) < 0
    )
      errors.reorderQuantity =
        "Reorder Quantity is required and must be a non-negative integer";
    if (!formData.locationName) errors.locationName = "Location is required";
    if (!formData.unit) errors.unit = "Unit is required";

    if (formData.isPerishable) {
      if (!formData.batches || formData.batches.length === 0) {
        errors.batches = "At least one batch is required for perishable items";
      } else {
        const totalBatchQuantity = formData.batches.reduce(
          (sum, batch) => sum + (parseInt(batch.quantity, 10) || 0),
          0
        );
        const stockQuantity = parseInt(formData.stockQuantity, 10) || 0;
        if (totalBatchQuantity !== stockQuantity) {
          errors.batches = `Batch quantities (${totalBatchQuantity}) must match stockQuantity (${stockQuantity}) for perishable items`;
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      console.log("Form validation failed:", formErrors);
      return;
    }

    const dataToSend = {
      ...formData,
      costPrice: parseFloat(formData.costPrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      stockQuantity: parseInt(formData.stockQuantity, 10),
      reorderLevel: parseInt(formData.reorderLevel, 10),
      reorderQuantity: parseInt(formData.reorderQuantity, 10),
      lastRestocked: formData.lastRestocked
        ? new Date(formData.lastRestocked).toISOString()
        : null,
    };

    if (formData.isPerishable) {
      dataToSend.batches = formData.batches
        .filter((batch) => batch.quantity && batch.batchNumber)
        .map((batch) => ({
          batchNumber: batch.batchNumber,
          quantity: parseInt(batch.quantity, 10) || 0,
          expiryDate: batch.expiryDate
            ? new Date(batch.expiryDate).toISOString()
            : null,
          receivedDate: batch.receivedDate
            ? new Date(batch.receivedDate).toISOString()
            : null,
        }));
    } else {
      delete dataToSend.batches;
    }

    console.log("dataToSend", dataToSend);

    try {
      if (editMode) {
        await dispatch(
          updateInventory({ id: initialData._id, inventoryData: dataToSend })
        ).unwrap();
      } else {
        await dispatch(createInventory(dataToSend)).unwrap();
      }
      dispatch(fetchInventories());
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving inventory:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: error.response?.data?.message || "Failed to save inventory",
      }));
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      costPrice: "",
      sellingPrice: "",
      category: "",
      stockQuantity: "",
      supplier: "",
      imageUrl: "",
      reorderLevel: "",
      reorderQuantity: "",
      locationName: "",
      unit: "",
      isPerishable: false,
      lastRestocked: null,
      isActive: true,
      batches: [],
    });
    setPropertyImage({ name: "", url: "" });
    setFormErrors({});
  };

  const handleImageChange = (file) => {
    if (!file) {
      setPropertyImage({ name: "", url: "" });
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setPropertyImage({ name: file.name, url: result });
      setFormData((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  return (
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
            {editMode ? "Edit Inventory" : "Add New Inventory"}
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleNameChange} // Use handleNameChange for batch number updates
          error={Boolean(formErrors.name)}
          helperText={formErrors.name}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange("description")}
          error={Boolean(formErrors.description)}
          helperText={formErrors.description}
        />
        <TextField
          label="Cost Price"
          fullWidth
          margin="normal"
          type="number"
          value={formData.costPrice}
          onChange={handleChange("costPrice")}
          error={Boolean(formErrors.costPrice)}
          helperText={formErrors.costPrice}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <TextField
          label="Selling Price"
          fullWidth
          margin="normal"
          type="number"
          value={formData.sellingPrice}
          onChange={handleChange("sellingPrice")}
          error={Boolean(formErrors.sellingPrice)}
          helperText={formErrors.sellingPrice}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={formData.category}
            onChange={handleChange("category")}
            label="Category"
            error={Boolean(formErrors.category)}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {formErrors.category && (
            <FormHelperText error>{formErrors.category}</FormHelperText>
          )}
        </FormControl>
        <TextField
          label="Stock Quantity"
          fullWidth
          margin="normal"
          type="number"
          value={formData.stockQuantity}
          onChange={handleChange("stockQuantity")}
          error={Boolean(formErrors.stockQuantity)}
          helperText={formErrors.stockQuantity}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="supplier-label">Supplier</InputLabel>
          <Select
            labelId="supplier-label"
            value={formData.supplier || ""}
            onChange={handleChange("supplier")}
            label="Supplier"
            error={Boolean(formErrors.supplier)}
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier._id} value={supplier._id}>
                {supplier.contactPerson}
              </MenuItem>
            ))}
          </Select>
          {formErrors.supplier && (
            <FormHelperText error>{formErrors.supplier}</FormHelperText>
          )}
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isPerishable}
              onChange={handleChange("isPerishable")}
              color="primary"
            />
          }
          label="Is Perishable"
          sx={{ mt: 2 }}
        />

        {formData.isPerishable && (
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mt: 2, mb: 1, fontWeight: "bold" }}
            >
              Batches
            </Typography>
            {formData.batches.map((batch, index) => (
              <Box key={index} sx={{ border: "1px solid #ccc", p: 2, mb: 2 }}>
                <TextField
                  label="Batch Number"
                  fullWidth
                  margin="normal"
                  value={batch.batchNumber}
                  onChange={(e) =>
                    handleBatchChange(index, "batchNumber", e.target.value)
                  }
                />
                <TextField
                  label="Quantity"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={batch.quantity}
                  onChange={(e) =>
                    handleBatchChange(index, "quantity", e.target.value)
                  }
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  label="Expiry Date"
                  fullWidth
                  margin="normal"
                  type="date"
                  value={batch.expiryDate}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    handleBatchChange(index, "expiryDate", e.target.value)
                  }
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveBatch(index)}
                  sx={{ mt: 1 }}
                >
                  Remove Batch
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddBatch}
              sx={{ mt: 1 }}
            >
              Add Batch
            </Button>
            {formErrors.batches && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formErrors.batches}
              </Alert>
            )}
          </Box>
        )}
        <Stack direction="column" gap={1} justifyContent="center" mb={2}>
          <Stack direction="row" gap={2}>
            <Typography
              color="#11142d"
              fontSize={16}
              fontWeight={500}
              my="10px"
            >
              Property Photo
            </Typography>
            <Button
              component="label"
              sx={{
                width: "fit-content",
                color: "#2ed480",
                textTransform: "capitalize",
                fontSize: 16,
              }}
            >
              Upload *
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </Button>
          </Stack>
          <Typography
            fontSize={14}
            color="#808191"
            sx={{ wordBreak: "break-all" }}
          >
            {propertyImage?.name}
          </Typography>
        </Stack>
        <TextField
          label="Reorder Level"
          fullWidth
          margin="normal"
          type="number"
          value={formData.reorderLevel}
          onChange={handleChange("reorderLevel")}
          error={Boolean(formErrors.reorderLevel)}
          helperText={formErrors.reorderLevel}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <TextField
          label="Reorder Quantity"
          fullWidth
          margin="normal"
          type="number"
          value={formData.reorderQuantity}
          onChange={handleChange("reorderQuantity")}
          error={Boolean(formErrors.reorderQuantity)}
          helperText={formErrors.reorderQuantity}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            value={formData.locationName || ""}
            onChange={handleChange("locationName")}
            label="Location"
            error={Boolean(formErrors.locationName)}
          >
            {locations.map((location) => (
              <MenuItem key={location._id} value={location._id}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
          {formErrors.locationName && (
            <FormHelperText error>{formErrors.locationName}</FormHelperText>
          )}
        </FormControl>
        <TextField
          label="Unit"
          fullWidth
          margin="normal"
          value={formData.unit}
          onChange={handleChange("unit")}
          error={Boolean(formErrors.unit)}
          helperText={formErrors.unit}
        />
        {editMode && (
          <TextField
            label="Last Restocked"
            fullWidth
            margin="normal"
            type="date"
            value={formData.lastRestocked || ""}
            InputLabelProps={{ shrink: true }}
            onChange={handleDateChange("lastRestocked")}
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isActive}
              onChange={handleChange("isActive")}
              color="primary"
            />
          }
          label="Is Active"
          sx={{ mt: 2 }}
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
  );
};

export default AddNewInventoryDrawer;
