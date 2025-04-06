import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct } from "../../redux/slices/productsSlice"; // Adjust path as needed
import { fetchSuppliers } from "../../redux/slices/suppliersSlice"; // Adjust path as needed
import { fetchCategories } from "../../redux/slices/categorySlice"; // Adjust path as needed
import { fetchLocations } from "../../redux/slices/locationSlice"; // Adjust path as needed
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

const AddNewProductDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.products);
  const { suppliers } = useSelector((state) => state.suppliers);
  const { categories } = useSelector((state) => state.categories);
  const { locations } = useSelector((state) => state.locations);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    location: "",
    stockQuantity: "",
    supplier: "",
    expiryDate: "",
    imageUrl: "",
    reorderLevel: "",
    reorderQuantity: "",
    unit: "",
    isPerishable: false,
    lastRestocked: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Fetch suppliers and categories when the component mounts
  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchCategories());
    dispatch(fetchLocations());
  }, [dispatch]);

  // Update formData when editMode or initialData changes
  useEffect(() => {
    if (editMode) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category?.id || "",
        location: initialData.location?.id || "",
        stockQuantity: initialData.stockQuantity || "",
        supplier: initialData.supplier?.id || "", // Use ID to pre-select supplier
        expiryDate: initialData.expiryDate
          ? new Date(initialData.expiryDate).toISOString().split("T")[0]
          : "", // Format date
        imageUrl: initialData.imageUrl || "",
        reorderLevel: initialData.reorderLevel || "",
        reorderQuantity: initialData.reorderQuantity || "",
        unit: initialData.unit || "",
        isPerishable: initialData.isPerishable || false,
        lastRestocked: initialData.lastRestocked
          ? new Date(initialData.lastRestocked).toISOString().split("T")[0]
          : "", // Format date
      });
      setImagePreview(initialData.imageUrl || null);
    } else {
      // Reset form data for creating a new product
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        location: "",
        stockQuantity: "",
        supplier: "",
        expiryDate: "",
        imageUrl: "",
        reorderLevel: "",
        reorderQuantity: "",
        unit: "",
        isPerishable: false,
        lastRestocked: "",
      });
      setImagePreview(null);
    }
  }, [editMode, initialData]);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "name":
        if (!value) error.name = "Name is required";
        break;
      case "price":
        if (!value) error.price = "Price is required";
        else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
          error.price = "Price must be a non-negative number";
        }
        break;
      case "category":
        if (!value) error.category = "Category is required";
        break;
      case "location":
        if (!value) error.location = "Location is required";
        break;
      case "stockQuantity":
        if (!value) error.stockQuantity = "Stock quantity is required";
        else if (isNaN(parseInt(value)) || parseInt(value) < 0) {
          error.stockQuantity = "Stock quantity must be a non-negative integer";
        }
        break;
      case "supplier":
        if (!value) error.supplier = "Supplier is required";
        break;
      case "reorderLevel":
        if (!value) error.reorderLevel = "Reorder level is required";
        else if (isNaN(parseInt(value)) || parseInt(value) < 0) {
          error.reorderLevel = "Reorder level must be a non-negative integer";
        }
        break;
      case "reorderQuantity":
        if (!value) error.reorderQuantity = "Reorder quantity is required";
        else if (isNaN(parseInt(value)) || parseInt(value) < 0) {
          error.reorderQuantity =
            "Reorder quantity must be a non-negative integer";
        }
        break;
      case "unit":
        if (!value) error.unit = "Unit is required";
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
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileType = file.type;
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
      ];

      if (fileSize > 2) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      if (!validTypes.includes(fileType)) {
        toast.error(
          "Invalid file type. Only PNG, JPEG, JPG, and SVG are allowed."
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      location: "",
      stockQuantity: "",
      supplier: "",
      expiryDate: "",
      imageUrl: "",
      reorderLevel: "",
      reorderQuantity: "",
      unit: "",
      isPerishable: false,
      lastRestocked: "",
    });
    setImagePreview(null);
    setErrors({});
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    const productData = {
      ...formData,
      isPerishable: Boolean(formData.isPerishable),
    };

    if (editMode) {
      const { _id, ...updateData } = productData; // Exclude _id from the update data
      dispatch(updateProduct({ id: initialData._id, productData: updateData }))
        .then(() => {
          toast.success("Product updated successfully!", {
            duration: 5000,
          });
          resetForm();
          onClose();
        })
        .catch((error) => {
          toast.error(
            "Error updating product: " +
              (error.response?.data?.message || error.message)
          );
        });
    } else {
      dispatch(createProduct(productData))
        .then(() => {
          toast.success("Product added successfully!", {
            duration: 5000,
          });
          resetForm();
          onClose();
        })
        .catch((error) => {
          toast.error(
            "Error adding product: " +
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

  const quillRef = useRef(null);

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
            <h2>{editMode ? "Edit Product" : "Add New Product"}</h2>
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
          <ReactQuill
            ref={quillRef}
            value={formData.description}
            onChange={(value) =>
              handleChange("description")({ target: { value } })
            }
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link", "image", "video"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "video",
            ]}
            style={{ minHeight: "200px" }} // Adjust the height as needed
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
          <TextField
            label="Category"
            fullWidth
            margin="normal"
            select
            value={formData.category}
            onChange={handleChange("category")}
            error={!!errors.category}
            helperText={errors.category}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Location"
            fullWidth
            margin="normal"
            select
            value={formData.location}
            onChange={handleChange("location")}
            error={!!errors.location}
            helperText={errors.location}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          >
            {locations.map((location) => (
              <MenuItem key={location._id} value={location._id}>
                {location.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Stock Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange("stockQuantity")}
            error={!!errors.stockQuantity}
            helperText={errors.stockQuantity}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Supplier"
            fullWidth
            margin="normal"
            select
            value={formData.supplier}
            onChange={handleChange("supplier")}
            error={!!errors.supplier}
            helperText={errors.supplier}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier._id} value={supplier._id}>
                {supplier.contactPerson}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Expiry Date"
            fullWidth
            margin="normal"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange("expiryDate")}
            error={!!errors.expiryDate}
            helperText={errors.expiryDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Reorder Level"
            fullWidth
            margin="normal"
            type="number"
            value={formData.reorderLevel}
            onChange={handleChange("reorderLevel")}
            error={!!errors.reorderLevel}
            helperText={errors.reorderLevel}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Reorder Quantity"
            fullWidth
            margin="normal"
            type="number"
            value={formData.reorderQuantity}
            onChange={handleChange("reorderQuantity")}
            error={!!errors.reorderQuantity}
            helperText={errors.reorderQuantity}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Unit"
            fullWidth
            margin="normal"
            value={formData.unit}
            onChange={handleChange("unit")}
            error={!!errors.unit}
            helperText={errors.unit}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isPerishable}
                onChange={handleChange("isPerishable")}
              />
            }
            label="Perishable"
            sx={{ mt: 2 }}
          />
          <TextField
            label="Last Restocked"
            fullWidth
            margin="normal"
            type="date"
            value={formData.lastRestocked}
            onChange={handleChange("lastRestocked")}
            error={!!errors.lastRestocked}
            helperText={errors.lastRestocked}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              sx={{ marginRight: 2 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                onChange={handleImageChange}
              />
            </Button>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Product Preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
          </Box>

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

export default AddNewProductDrawer;
