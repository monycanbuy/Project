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
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createDish,
//   updateDish,
//   fetchDishes,
// } from "../../redux/slices/dishesSlice";
// import { fetchCategories } from "../../redux/slices/categorySlice";
// import { fetchInventories } from "../../redux/slices/inventoriesSlice";
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

// const AddNewDishesDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
//   onSave,
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.dishes);
//   const { categories = [], status: categoriesStatus = "idle" } = useSelector(
//     (state) => state.categories || {}
//   );
//   const { inventories: inventoryItems = [], status: inventoryStatus = "idle" } =
//     useSelector((state) => state.inventories || {});

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     categoryName: "",
//     category: null,
//     ingredients: [],
//   });

//   useEffect(() => {
//     if (categoriesStatus === "idle") {
//       dispatch(fetchCategories());
//     }
//     if (inventoryStatus === "idle") {
//       dispatch(fetchInventories());
//     }
//   }, [dispatch, categoriesStatus, inventoryStatus]);

//   useEffect(() => {
//     if (editMode) {
//       setFormData({
//         name: initialData.name || "",
//         description: initialData.description || "",
//         price: initialData.price || "",
//         categoryName: initialData.category?.name || "",
//         category: initialData.category?.name || "", // Use category name
//         ingredients: initialData.ingredients || [],
//       });
//     } else {
//       setFormData({
//         name: "",
//         description: "",
//         price: "",
//         categoryName: "",
//         category: null,
//         ingredients: [],
//       });
//     }
//   }, [editMode, initialData]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "name":
//         if (!value) error.name = "Name is required";
//         break;
//       case "description":
//         if (!value) error.description = "Description is required";
//         break;
//       case "price":
//         if (!value) error.price = "Price is required";
//         else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
//           error.price = "Price must be a non-negative number";
//         }
//         break;
//       case "categoryName":
//         if (!value) error.categoryName = "Category is required";
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
//     const value = event.target.value;
//     if (field === "categoryName") {
//       const selectedCategory = categories.find((cat) => cat.name === value);
//       setFormData((prev) => ({
//         ...prev,
//         categoryName: value,
//         category: selectedCategory ? selectedCategory.name : null, // Use category name
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: undefined,
//     }));
//     validateField(field, value);
//   };

//   const handleIngredientChange = (index, field) => (event) => {
//     const newIngredients = [...formData.ingredients];
//     newIngredients[index][field] =
//       field === "quantity"
//         ? parseFloat(event.target.value)
//         : event.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       ingredients: newIngredients,
//     }));
//   };

//   const addIngredient = () => {
//     setFormData((prev) => ({
//       ...prev,
//       ingredients: [...prev.ingredients, { inventoryItem: "", quantity: 0 }],
//     }));
//   };

//   const removeIngredient = (index) => {
//     const newIngredients = [...formData.ingredients];
//     newIngredients.splice(index, 1);
//     setFormData((prev) => ({
//       ...prev,
//       ingredients: newIngredients,
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       categoryName: "",
//       category: null,
//       ingredients: [],
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

//     const dishData = {
//       name: formData.name,
//       description: formData.description,
//       price: formData.price,
//       category: formData.category, // Send category name
//       ingredients: formData.ingredients.map((ingredient) => ({
//         inventoryItem: ingredient.inventoryItem,
//         quantity: ingredient.quantity,
//       })),
//     };

//     if (editMode) {
//       dispatch(updateDish({ dishId: initialData._id, dishData }))
//         .then(() => {
//           toast.success("Dish updated successfully!", { duration: 5000 });
//           resetForm();
//           dispatch(fetchDishes()).then(() => onClose());
//           onSave && onSave(formData);
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating dish: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(createDish(dishData))
//         .then(() => {
//           toast.success("Dish added successfully!", { duration: 5000 });
//           resetForm();
//           dispatch(fetchDishes()).then(() => onClose());
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding dish: " +
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
//             <h2>{editMode ? "Edit Dish" : "Add New Dish"}</h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Name"
//             fullWidth
//             margin="normal"
//             value={formData.name}
//             onChange={handleChange("name")}
//             error={!!errors.name}
//             helperText={errors.name}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
//           />
//           <TextField
//             label="Description"
//             fullWidth
//             margin="normal"
//             multiline
//             rows={3}
//             value={formData.description}
//             onChange={handleChange("description")}
//             error={!!errors.description}
//             helperText={errors.description}
//           />
//           <TextField
//             label="Price"
//             fullWidth
//             margin="normal"
//             type="number"
//             value={formData.price}
//             onChange={handleChange("price")}
//             error={!!errors.price}
//             helperText={errors.price}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Category</InputLabel>
//             <Select
//               value={formData.categoryName}
//               onChange={handleChange("categoryName")}
//               label="Category"
//               error={!!errors.categoryName}
//             >
//               {categoriesStatus === "succeeded" && categories.length > 0 ? (
//                 categories.map((category) => (
//                   <MenuItem key={category._id} value={category.name}>
//                     {category.name}
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem disabled>
//                   {categoriesStatus === "loading"
//                     ? "Loading categories..."
//                     : "No categories available"}
//                 </MenuItem>
//               )}
//             </Select>
//           </FormControl>

//           <Typography variant="h6" sx={{ mt: 2 }}>
//             Ingredients
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table size="small" aria-label="ingredients table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Ingredient</TableCell>
//                   <TableCell align="right">Quantity</TableCell>
//                   <TableCell align="right">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {formData.ingredients.map((ingredient, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <FormControl fullWidth sx={{ minWidth: 200 }}>
//                         <InputLabel id={`ingredient-label-${index}`}>
//                           Ingredient
//                         </InputLabel>
//                         <Select
//                           labelId={`ingredient-label-${index}`}
//                           value={ingredient.inventoryItem}
//                           onChange={handleIngredientChange(
//                             index,
//                             "inventoryItem"
//                           )}
//                           label="Ingredient"
//                         >
//                           {inventoryItems.map((item) => (
//                             <MenuItem key={item._id} value={item._id}>
//                               {item.name}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </TableCell>
//                     <TableCell align="right">
//                       <TextField
//                         type="number"
//                         value={ingredient.quantity}
//                         onChange={handleIngredientChange(index, "quantity")}
//                       />
//                     </TableCell>
//                     <TableCell align="right">
//                       <IconButton onClick={() => removeIngredient(index)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Button
//             startIcon={<AddIcon />}
//             onClick={addIngredient}
//             sx={{ mb: 2 }}
//           >
//             Add Ingredient
//           </Button>

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

// export default AddNewDishesDrawer;

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
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createDish,
//   updateDish,
//   fetchDishes,
// } from "../../redux/slices/dishesSlice";
// import { fetchCategories } from "../../redux/slices/categorySlice";
// import { fetchInventories } from "../../redux/slices/inventoriesSlice";
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

// const AddNewDishesDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
//   onSave,
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.dishes);
//   const {
//     categories = [],
//     status: categoriesStatus = "idle",
//     error: categoriesError,
//   } = useSelector((state) => state.categories || {});
//   const {
//     inventories: inventoryItems = [],
//     status: inventoryStatus = "idle",
//     error: inventoryError,
//   } = useSelector((state) => state.inventories || {});

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     categoryName: "",
//     category: null,
//     ingredients: [],
//   });

//   useEffect(() => {
//     if (categoriesStatus === "idle") {
//       dispatch(fetchCategories());
//     }
//     if (inventoryStatus === "idle") {
//       dispatch(fetchInventories());
//     }
//   }, [dispatch, categoriesStatus, inventoryStatus]);

//   useEffect(() => {
//     if (editMode) {
//       setFormData({
//         name: initialData.name || "",
//         description: initialData.description || "",
//         price: initialData.price || "",
//         categoryName: initialData.category?.name || "",
//         category: initialData.category || null, // IMPORTANT: Keep category as an object
//         ingredients: initialData.ingredients || [],
//       });
//     } else {
//       setFormData({
//         name: "",
//         description: "",
//         price: "",
//         categoryName: "",
//         category: null,
//         ingredients: [],
//       });
//     }
//   }, [editMode, initialData]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "name":
//         if (!value) error.name = "Name is required";
//         break;
//       case "description":
//         if (!value) error.description = "Description is required";
//         break;
//       case "price":
//         if (!value) error.price = "Price is required";
//         else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
//           error.price = "Price must be a non-negative number";
//         }
//         break;
//       case "categoryName":
//         if (!value) error.categoryName = "Category is required";
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
//     const value = event.target.value;
//     if (field === "categoryName") {
//       const selectedCategory = categories.find((cat) => cat.name === value);
//       setFormData((prev) => ({
//         ...prev,
//         categoryName: value,
//         category: selectedCategory || null, //  Set to the entire category object, or null if not found
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: undefined,
//     }));
//     validateField(field, value);
//   };

//   const handleIngredientChange = (index, field) => (event) => {
//     const newIngredients = [...formData.ingredients];
//     newIngredients[index][field] =
//       field === "quantity"
//         ? parseFloat(event.target.value)
//         : event.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       ingredients: newIngredients,
//     }));
//   };

//   const addIngredient = () => {
//     setFormData((prev) => ({
//       ...prev,
//       ingredients: [...prev.ingredients, { inventoryItem: "", quantity: 0 }],
//     }));
//   };

//   const removeIngredient = (index) => {
//     const newIngredients = [...formData.ingredients];
//     newIngredients.splice(index, 1);
//     setFormData((prev) => ({
//       ...prev,
//       ingredients: newIngredients,
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       categoryName: "",
//       category: null,
//       ingredients: [],
//     });
//     setErrors({});
//   };
//   const handleSave = async () => {
//     // <-- Make the function async
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );

//     if (Object.values(errors).some((error) => error)) {
//       return;
//     }

//     const dishData = {
//       name: formData.name,
//       description: formData.description,
//       price: formData.price,
//       category: formData.categoryName, // Use categoryName (string)
//       ingredients: formData.ingredients.map((ingredient) => ({
//         inventoryItem: ingredient.inventoryItem,
//         quantity: ingredient.quantity,
//       })),
//     };

//     try {
//       if (editMode) {
//         await dispatch(updateDish({ dishId: initialData._id, dishData })); // AWAIT the update
//         toast.success("Dish updated successfully!", { duration: 5000 });
//       } else {
//         await dispatch(createDish(dishData)); // AWAIT the create
//         toast.success("Dish added successfully!", { duration: 5000 });
//       }

//       resetForm();
//       await dispatch(fetchDishes()); // AWAIT fetching the updated list
//       onSave && onSave(formData); // Consider moving this *before* onClose()
//       onClose();
//     } catch (error) {
//       toast.error("Error: " + (error.response?.data?.message || error.message));
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
//             <h2>{editMode ? "Edit Dish" : "Add New Dish"}</h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Name"
//             fullWidth
//             margin="normal"
//             value={formData.name}
//             onChange={handleChange("name")}
//             error={!!errors.name}
//             helperText={errors.name}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
//           />
//           <TextField
//             label="Description"
//             fullWidth
//             margin="normal"
//             multiline
//             rows={3}
//             value={formData.description}
//             onChange={handleChange("description")}
//             error={!!errors.description}
//             helperText={errors.description}
//           />
//           <TextField
//             label="Price"
//             fullWidth
//             margin="normal"
//             type="number"
//             value={formData.price}
//             onChange={handleChange("price")}
//             error={!!errors.price}
//             helperText={errors.price}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Category</InputLabel>
//             <Select
//               value={formData.categoryName}
//               onChange={handleChange("categoryName")}
//               label="Category"
//               error={!!errors.categoryName}
//             >
//               {categoriesStatus === "succeeded" && categories.length > 0 ? (
//                 categories.map((category) => (
//                   <MenuItem key={category._id} value={category.name}>
//                     {category.name}
//                   </MenuItem>
//                 ))
//               ) : (
//                 <MenuItem disabled>
//                   {categoriesStatus === "loading"
//                     ? "Loading categories..."
//                     : "No categories available"}
//                 </MenuItem>
//               )}
//             </Select>
//           </FormControl>

//           <Typography variant="h6" sx={{ mt: 2 }}>
//             Ingredients
//           </Typography>
//           <TableContainer component={Paper}>
//             <Table size="small" aria-label="ingredients table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Ingredient</TableCell>
//                   <TableCell align="right">Quantity</TableCell>
//                   <TableCell align="right">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {formData.ingredients.map((ingredient, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <FormControl fullWidth sx={{ minWidth: 200 }}>
//                         <InputLabel id={`ingredient-label-${index}`}>
//                           Ingredient
//                         </InputLabel>
//                         <Select
//                           labelId={`ingredient-label-${index}`}
//                           value={ingredient.inventoryItem}
//                           onChange={handleIngredientChange(
//                             index,
//                             "inventoryItem"
//                           )}
//                           label="Ingredient"
//                         >
//                           {inventoryStatus === "loading" && (
//                             <MenuItem disabled>Loading ingredients...</MenuItem>
//                           )}
//                           {inventoryStatus === "failed" && (
//                             <MenuItem disabled>
//                               Error: {inventoryError}
//                             </MenuItem>
//                           )}
//                           {inventoryStatus === "succeeded" &&
//                             inventoryItems.map((item) => (
//                               <MenuItem key={item._id} value={item._id}>
//                                 {item.name}
//                               </MenuItem>
//                             ))}
//                         </Select>
//                       </FormControl>
//                     </TableCell>
//                     <TableCell align="right">
//                       <TextField
//                         type="number"
//                         value={ingredient.quantity}
//                         onChange={handleIngredientChange(index, "quantity")}
//                       />
//                     </TableCell>
//                     <TableCell align="right">
//                       <IconButton onClick={() => removeIngredient(index)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Button
//             startIcon={<AddIcon />}
//             onClick={addIngredient}
//             sx={{ mb: 2 }}
//           >
//             Add Ingredient
//           </Button>

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

// export default AddNewDishesDrawer;

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
