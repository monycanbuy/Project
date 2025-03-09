// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Drawer,
//   Box,
//   TextField,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createCategory,
//   updateCategory,
// } from "../../redux/slices/categorySlice";
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

// const AddNewCategoryDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.categories);

//   const [formData, setFormData] = useState({
//     name: "",
//   });

//   useEffect(() => {
//     if (editMode) {
//       setFormData({
//         name: initialData.name || "",
//       });
//     } else {
//       setFormData({
//         name: "",
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

//   const resetForm = () => {
//     setFormData({
//       name: "",
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
//         updateCategory({ categoryId: initialData._id, categoryData: formData })
//       )
//         .then(() => {
//           toast.success("Category updated successfully!", { duration: 5000 });
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating category: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(createCategory(formData))
//         .then(() => {
//           toast.success("Category added successfully!", { duration: 5000 });
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding category: " +
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
//             <h2>{editMode ? "Edit Category" : "Add New Category"}</h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Category Name"
//             fullWidth
//             margin="normal"
//             value={formData.name}
//             onChange={handleChange("name")}
//             error={!!errors.name}
//             helperText={errors.name}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           </Box>
//         </Box>
//       </StyledDrawer>
//       <Toaster />
//     </>
//   );
// };

// export default AddNewCategoryDrawer;
// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Drawer,
//   Box,
//   TextField,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createCategory,
//   updateCategory,
// } from "../../redux/slices/categorySlice";
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

// const AddNewCategoryDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.categories);

//   const [formData, setFormData] = useState({
//     name: "",
//   });

//   useEffect(() => {
//     if (editMode) {
//       setFormData({
//         name: initialData.name || "",
//       });
//     } else {
//       setFormData({
//         name: "",
//       });
//     }
//   }, [editMode, initialData]);

//   const [errors, setErrors] = useState({});
//   const [isFormValid, setIsFormValid] = useState(false);

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "name":
//         if (!value) error.name = "Name is required";
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

//   useEffect(() => {
//     const isValid =
//       Object.values(formData).every((value) => value !== "") &&
//       Object.values(errors).every((error) => error === undefined);
//     setIsFormValid(isValid);
//   }, [formData, errors]);

//   const resetForm = () => {
//     setFormData({
//       name: "",
//     });
//     setErrors({});
//   };

//   const handleSave = (event) => {
//     event.preventDefault();
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );

//     if (!isFormValid) {
//       return;
//     }

//     if (editMode) {
//       dispatch(
//         updateCategory({ categoryId: initialData._id, categoryData: formData })
//       )
//         .then(() => {
//           toast.success("Category updated successfully!", { duration: 5000 });
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating category: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(createCategory(formData))
//         .then(() => {
//           toast.success("Category added successfully!", { duration: 5000 });
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding category: " +
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
//         <Box
//           component="form"
//           onSubmit={handleSave}
//           sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <h2>{editMode ? "Edit Category" : "Add New Category"}</h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Category Name"
//             fullWidth
//             margin="normal"
//             value={formData.name}
//             onChange={handleChange("name")}
//             error={!!errors.name}
//             helperText={errors.name}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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
//               type="submit"
//               sx={{
//                 width: "120px",
//                 borderRadius: "12px",
//                 backgroundColor: "green",
//                 color: "white",
//                 "&:hover": { backgroundColor: "darkgreen" },
//               }}
//               disabled={isLoading || !isFormValid}
//             >
//               {isLoading ? (
//                 <CircularProgress size={24} sx={{ color: "#fe6c00" }} />
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           </Box>
//         </Box>
//       </StyledDrawer>
//       <Toaster />
//     </>
//   );
// };

// export default AddNewCategoryDrawer;

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
  createCategory,
  updateCategory,
  fetchCategories, // Add this import
} from "../../redux/slices/categorySlice";
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

const AddNewCategoryDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({ name: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMode) {
      setFormData({ name: initialData.name || "" });
    } else {
      resetForm();
    }
  }, [editMode, initialData, open]);

  const validateField = (name, value) => {
    let error = {};
    if (name === "name" && !value) {
      error.name = "Name is required";
    }
    return error;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    const fieldErrors = validateField(field, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
      ...(Object.keys(fieldErrors).length === 0 && { [field]: undefined }),
    }));
  };

  const validateForm = () => {
    const newErrors = validateField("name", formData.name);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setErrors({});
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (editMode) {
        await dispatch(
          updateCategory({
            categoryId: initialData._id,
            categoryData: formData,
          })
        ).unwrap();
        toast.success("Category updated successfully!", { duration: 5000 });
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success("Category added successfully!", { duration: 5000 });
      }
      dispatch(fetchCategories()); // Refresh the list
      resetForm();
      onClose();
    } catch (error) {
      const errorMessage = error?.message || "Unknown error";
      toast.error(
        `Error ${editMode ? "updating" : "adding"} category: ${errorMessage}`,
        { duration: 7000 }
      );
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <StyledDrawer anchor="right" open={open} onClose={handleCancel}>
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
            <h2>{editMode ? "Edit Category" : "Add New Category"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            required
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
              disabled={isLoading}
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

export default AddNewCategoryDrawer;
