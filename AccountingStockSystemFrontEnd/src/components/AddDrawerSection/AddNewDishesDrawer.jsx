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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormHelperText,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createDish,
  updateDish,
  fetchDishes,
} from "../../redux/slices/dishesSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchInventories } from "../../redux/slices/inventoriesSlice";
import { toast } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0",
    boxSizing: "border-box",
  },
}));

const AddNewDishesDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.dishes);
  const { categories = [], status: categoriesStatus } = useSelector(
    (state) => state.categories
  );
  const { inventories: inventoryItems = [], status: inventoryStatus } =
    useSelector((state) => state.inventories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "", // Store the category ID
    ingredients: [],
  });
  const [errors, setErrors] = useState({});

  // Fetch necessary data
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
    if (inventoryStatus === "idle") {
      dispatch(fetchInventories());
    }
  }, [dispatch, categoriesStatus, inventoryStatus]);

  // Initialize/reset form
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category || "", // Use category ID directly
        ingredients:
          initialData.ingredients.map((ing) => ({
            //Keep existing structure.
            inventoryItem: ing.inventoryItem,
            quantity: ing.quantity,
          })) || [],
      });
    } else {
      // Reset form for new dish
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        ingredients: [],
      });
    }
    setErrors({});
  }, [editMode, initialData, open]); // Include open

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "name":
        if (!value) error.name = "Name is required";
        break;
      case "description":
        if (!value) error.description = "Description is required";
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
      case "ingredients":
        value.forEach((item, index) => {
          if (!item.inventoryItem) {
            error[`ingredients.${index}.inventoryItem`] =
              "Inventory is required";
          }
        });
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
    return Object.keys(error).length === 0;
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    validateField(field, event.target.value);
  };

  const handleIngredientChange = (index, field) => (event) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = event.target.value;
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { inventoryItem: "", quantity: 1 }], // Default quantity
    }));
  };

  const removeIngredient = (index) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const handleSave = async () => {
    const fieldsToValidate = [
      "name",
      "description",
      "price",
      "category",
      "ingredients",
    ];
    let isValid = true;

    for (const field of fieldsToValidate) {
      if (field === "ingredients") {
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
      } else {
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
      }
    }
    if (!isValid) {
      return;
    }

    const dishData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category, // Send category ID
      ingredients: formData.ingredients.map((ingredient) => ({
        inventoryItem: ingredient.inventoryItem,
        quantity: parseFloat(ingredient.quantity), // Ensure quantity is a number
      })),
    };

    try {
      if (editMode) {
        await dispatch(
          updateDish({ dishId: initialData._id, dishData })
        ).unwrap();
        toast.success("Dish updated successfully!");
      } else {
        await dispatch(createDish(dishData)).unwrap();
        toast.success("Dish created successfully!");
      }
      onClose();
      onSaveSuccess && onSaveSuccess(); // Refresh
    } catch (error) {
      toast.error(
        `Error ${editMode ? "updating" : "creating"} dish: ${error.message}`
      );
    }
  };

  const handleCancel = () => {
    onClose();
    setErrors({}); // Clear errors
  };

  if (categoriesStatus === "loading" || inventoryStatus === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <StyledDrawer anchor="right" open={open} onClose={handleCancel}>
        <Box sx={{ p: 2, width: "100%", overflow: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <h2>{editMode ? "Edit Dish" : "Add New Dish"}</h2>
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
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange("description")}
            error={!!errors.description}
            helperText={errors.description}
            required
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={formData.price}
            onChange={handleChange("price")}
            error={!!errors.price}
            helperText={errors.price}
            required
          />

          <FormControl fullWidth margin="normal" error={!!errors.category}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={formData.category}
              onChange={handleChange("category")}
              label="Category"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
            )}
          </FormControl>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Ingredients
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Inventory Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.ingredients.map((ingredient, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors[`ingredients.${index}.inventoryItem`]}
                      >
                        <InputLabel id={`inventory-item-label-${index}`}>
                          Inventory Item
                        </InputLabel>
                        <Select
                          labelId={`inventory-item-label-${index}`}
                          value={ingredient.inventoryItem}
                          onChange={handleIngredientChange(
                            index,
                            "inventoryItem"
                          )}
                          label="Inventory Item"
                        >
                          {inventoryItems.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[`ingredients.${index}.inventoryItem`] && (
                          <FormHelperText>
                            {errors[`ingredients.${index}.inventoryItem`]}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={ingredient.quantity}
                        onChange={handleIngredientChange(index, "quantity")}
                        inputProps={{ min: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeIngredient(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addIngredient}
            sx={{ mt: 1 }}
          >
            Add Ingredient
          </Button>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
              disabled={isLoading}
              sx={{
                width: "120px",
                borderRadius: "12px",
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
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
    </>
  );
};

export default AddNewDishesDrawer;
