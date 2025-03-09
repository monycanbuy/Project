// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Drawer,
//   Box,
//   TextField,
//   IconButton,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addLaundryService,
//   updateLaundryService,
// } from "../../redux/slices/laundryServicesSlice"; // Adjust path as needed
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

// const AddNewLaundryServiceDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.laundryServices);

//   const [formData, setFormData] = useState({
//     serviceType: "",
//     price: "",
//   });

//   // Update formData when editMode or initialData changes
//   useEffect(() => {
//     if (editMode) {
//       setFormData({
//         serviceType: initialData.serviceType || "",
//         price: initialData.price || "",
//       });
//     } else {
//       // Reset form data for creating a new service
//       setFormData({
//         serviceType: "",
//         price: "",
//       });
//     }
//   }, [editMode, initialData]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "serviceType":
//         if (!value) error.serviceType = "Service type is required";
//         break;
//       case "price":
//         if (!value) error.price = "Price is required";
//         else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
//           error.price = "Price must be a non-negative number";
//         }
//         break; // Here we omit the else to not set an error for valid input
//       default:
//         break;
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       ...error,
//     }));
//   };

//   const handleChange = (field) => (event) => {
//     if (!event.target) return;
//     const value = event.target.value;
//     console.log(`Updating ${field} to value:`, value);
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     console.log("Before error clear:", errors);
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: undefined,
//     }));
//     console.log("After error clear:", errors);
//     validateField(field, value);
//     console.log("After validation:", errors);
//   };

//   const resetForm = () => {
//     setFormData({
//       serviceType: "",
//       price: "",
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
//       const serviceData = {
//         _id: initialData._id,
//         ...formData,
//       };
//       dispatch(updateLaundryService({ id: serviceData._id, serviceData }))
//         .then(() => {
//           toast.success("Laundry service updated successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating laundry service: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(addLaundryService(formData))
//         .then(() => {
//           toast.success("Laundry service added successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding laundry service: " +
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
//               {editMode ? "Edit Laundry Service" : "Add New Laundry Service"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Service Type"
//             fullWidth
//             margin="normal"
//             value={formData.serviceType}
//             onChange={handleChange("serviceType")}
//             error={!!errors.serviceType}
//             helperText={errors.serviceType}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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

// export default AddNewLaundryServiceDrawer;

// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Drawer,
//   Box,
//   TextField,
//   IconButton,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addLaundryService,
//   updateLaundryService,
// } from "../../redux/slices/laundryServicesSlice"; // Adjust path as needed
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

// const AddNewLaundryServiceDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.laundryServices);

//   const [formData, setFormData] = useState({
//     serviceType: "",
//     price: "",
//   });

//   // Update formData when editMode or initialData changes
//   useEffect(() => {
//     if (editMode) {
//       setFormData({
//         serviceType: initialData.serviceType || "",
//         price: initialData.price || "",
//       });
//     } else {
//       // Reset form data for creating a new service
//       setFormData({
//         serviceType: "",
//         price: "",
//       });
//     }
//   }, [editMode, initialData]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "serviceType":
//         if (!value) error.serviceType = "Service type is required";
//         break;
//       case "price":
//         if (!value) error.price = "Price is required";
//         else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
//           error.price = "Price must be a non-negative number";
//         }
//         break; // Here we omit the else to not set an error for valid input
//       default:
//         break;
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       ...error,
//     }));
//   };

//   const handleChange = (field) => (event) => {
//     if (!event.target) return;
//     const value = event.target.value;
//     console.log(`Updating ${field} to value:`, value);
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     console.log("Before error clear:", errors);
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: undefined,
//     }));
//     console.log("After error clear:", errors);
//     validateField(field, value);
//     console.log("After validation:", errors);
//   };

//   const resetForm = () => {
//     setFormData({
//       serviceType: "",
//       price: "",
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
//       const serviceData = {
//         _id: initialData._id,
//         ...formData,
//       };
//       dispatch(updateLaundryService({ id: serviceData._id, serviceData }))
//         .then(() => {
//           toast.success("Laundry service updated successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating laundry service: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(addLaundryService(formData))
//         .then(() => {
//           toast.success("Laundry service added successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding laundry service: " +
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
//               {editMode ? "Edit Laundry Service" : "Add New Laundry Service"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Service Type"
//             fullWidth
//             margin="normal"
//             value={formData.serviceType}
//             onChange={handleChange("serviceType")}
//             error={!!errors.serviceType}
//             helperText={errors.serviceType}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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

// export default AddNewLaundryServiceDrawer;

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
//   addLaundryService,
//   updateLaundryService,
//   fetchLaundryServices,
// } from "../../redux/slices/laundryServicesSlice";
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

// const AddNewLaundryServiceDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { status } = useSelector((state) => state.laundryServices); // Use status instead of isLoading
//   const isLoading = status === "loading"; // Derive isLoading from status

//   const [formData, setFormData] = useState({
//     serviceType: "",
//     price: "",
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (editMode && initialData._id) {
//       setFormData({
//         serviceType: initialData.serviceType || "",
//         price: initialData.price !== undefined ? String(initialData.price) : "",
//       });
//     } else {
//       setFormData({
//         serviceType: "",
//         price: "",
//       });
//     }
//     setErrors({});
//   }, [editMode, initialData]);

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "serviceType":
//         if (!value) error.serviceType = "Service type is required";
//         break;
//       case "price":
//         if (!value) error.price = "Price is required";
//         else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
//           error.price = "Price must be a non-negative number";
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
//     const value = event.target.value;
//     console.log(`Updating ${field} to value:`, value);
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
//       serviceType: "",
//       price: "",
//     });
//     setErrors({});
//   };

//   const handleSave = () => {
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );

//     if (Object.values(errors).some((error) => error)) {
//       toast.error("Please fix all errors before saving");
//       return;
//     }

//     const serviceData = {
//       serviceType: formData.serviceType,
//       price: parseFloat(formData.price),
//     };

//     if (editMode) {
//       dispatch(updateLaundryService({ id: initialData._id, serviceData }))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service updated successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           dispatch(fetchLaundryServices());
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating laundry service: " + (error || "Unknown error"),
//             { duration: 7000 }
//           );
//         });
//     } else {
//       dispatch(addLaundryService(serviceData))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service added successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           dispatch(fetchLaundryServices());
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding laundry service: " + (error || "Unknown error"),
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
//               {editMode ? "Edit Laundry Service" : "Add New Laundry Service"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Service Type"
//             fullWidth
//             margin="normal"
//             value={formData.serviceType}
//             onChange={handleChange("serviceType")}
//             error={!!errors.serviceType}
//             helperText={errors.serviceType}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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
//               disabled={Object.values(errors).some((e) => e) || isLoading}
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

// export default AddNewLaundryServiceDrawer;

// import React, { useState, useEffect } from "react"; // Remove useRef
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
//   addLaundryService,
//   updateLaundryService,
//   fetchLaundryServices,
// } from "../../redux/slices/laundryServicesSlice";
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

// const AddNewLaundryServiceDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { status } = useSelector((state) => state.laundryServices);
//   const isLoading = status === "loading";

//   const [formData, setFormData] = useState({
//     serviceType: "",
//     price: "",
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     // Always sync formData when drawer opens or editMode/initialData changes
//     if (open) {
//       if (editMode && initialData._id) {
//         console.log("Setting formData for edit:", initialData);
//         setFormData({
//           serviceType: initialData.serviceType || "",
//           price:
//             initialData.price !== undefined ? String(initialData.price) : "",
//         });
//       } else {
//         console.log("Resetting formData for add mode");
//         setFormData({
//           serviceType: "",
//           price: "",
//         });
//       }
//       setErrors({});
//     }
//   }, [open, editMode, initialData]);

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "serviceType":
//         if (!value) error.serviceType = "Service type is required";
//         break;
//       case "price":
//         if (!value) error.price = "Price is required";
//         else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
//           error.price = "Price must be a non-negative number";
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
//     const value = event.target.value;
//     console.log(`Updating ${field} to value:`, value);
//     setFormData((prev) => {
//       const newData = { ...prev, [field]: value };
//       console.log("New formData:", newData);
//       return newData;
//     });
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [field]: undefined,
//     }));
//     validateField(field, value);
//   };

//   const resetForm = () => {
//     setFormData({
//       serviceType: "",
//       price: "",
//     });
//     setErrors({});
//   };

//   const handleSave = () => {
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );

//     if (Object.values(errors).some((error) => error)) {
//       toast.error("Please fix all errors before saving");
//       return;
//     }

//     const serviceData = {
//       serviceType: formData.serviceType,
//       price: parseFloat(formData.price),
//     };

//     if (editMode) {
//       dispatch(updateLaundryService({ id: initialData._id, serviceData }))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service updated successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           dispatch(fetchLaundryServices());
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating laundry service: " + (error || "Unknown error"),
//             { duration: 7000 }
//           );
//         });
//     } else {
//       dispatch(addLaundryService(serviceData))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service added successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           dispatch(fetchLaundryServices());
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding laundry service: " + (error || "Unknown error"),
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
//               {editMode ? "Edit Laundry Service" : "Add New Laundry Service"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Service Type"
//             fullWidth
//             margin="normal"
//             value={formData.serviceType}
//             onChange={handleChange("serviceType")}
//             error={!!errors.serviceType}
//             helperText={errors.serviceType}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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
//               disabled={Object.values(errors).some((e) => e) || isLoading}
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

// export default AddNewLaundryServiceDrawer;

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
//   addLaundryService,
//   updateLaundryService,
//   fetchLaundryServices,
// } from "../../redux/slices/laundryServicesSlice";
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

// const AddNewLaundryServiceDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { status } = useSelector((state) => state.laundryServices);
//   const isLoading = status === "loading";

//   const [formData, setFormData] = useState({
//     serviceType: "",
//     price: "",
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (open) {
//       if (editMode && initialData._id) {
//         setFormData({
//           serviceType: initialData.serviceType || "",
//           price:
//             initialData.price !== undefined ? String(initialData.price) : "",
//         });
//       } else {
//         setFormData({
//           serviceType: "",
//           price: "",
//         });
//       }
//       setErrors({});
//     }
//   }, [open, editMode, initialData]);

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "serviceType":
//         if (!value) error.serviceType = "Service type is required";
//         break;
//       case "price":
//         if (!value) error.price = "Price is required";
//         else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
//           error.price = "Price must be a non-negative number";
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
//       serviceType: "",
//       price: "",
//     });
//     setErrors({});
//   };

//   const handleSave = () => {
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );

//     if (Object.values(errors).some((error) => error)) {
//       toast.error("Please fix all errors before saving");
//       return;
//     }

//     const serviceData = {
//       serviceType: formData.serviceType,
//       price: parseFloat(formData.price),
//     };

//     if (editMode) {
//       dispatch(updateLaundryService({ id: initialData._id, serviceData }))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service updated successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           dispatch(fetchLaundryServices());
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating laundry service: " + (error || "Unknown error"),
//             { duration: 7000 }
//           );
//         });
//     } else {
//       dispatch(addLaundryService(serviceData))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service added successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           dispatch(fetchLaundryServices());
//           onClose();
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding laundry service: " + (error || "Unknown error"),
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
//       <StyledDrawer anchor="right" open={open} onClose={handleCancel}>
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
//               {editMode ? "Edit Laundry Service" : "Add New Laundry Service"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Service Type"
//             fullWidth
//             margin="normal"
//             value={formData.serviceType}
//             onChange={handleChange("serviceType")}
//             error={!!errors.serviceType}
//             helperText={errors.serviceType}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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
//               disabled={Object.values(errors).some((e) => e) || isLoading}
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

// export default AddNewLaundryServiceDrawer;

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
  addLaundryService,
  updateLaundryService,
  fetchLaundryServices,
} from "../../redux/slices/laundryServicesSlice";
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

const AddNewLaundryServiceDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.laundryServices);
  const isLoading = status === "loading";

  const [formData, setFormData] = useState({
    serviceType: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editMode && initialData._id) {
        setFormData({
          serviceType: initialData.serviceType || "",
          price:
            initialData.price !== undefined ? String(initialData.price) : "",
        });
      } else {
        setFormData({
          serviceType: "",
          price: "",
        });
      }
      setErrors({});
    }
  }, [open, editMode, initialData._id]); // Depend on _id to avoid unnecessary resets

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "serviceType":
        if (!value) error.serviceType = "Service type is required";
        break;
      case "price":
        if (!value) error.price = "Price is required";
        else if (isNaN(parseFloat(value)) || parseFloat(value) < 0) {
          error.price = "Price must be a non-negative number";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Validation moved to handleSave to prevent state thrashing
  };

  const resetForm = () => {
    setFormData({
      serviceType: "",
      price: "",
    });
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(newErrors, fieldErrors);
    });

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fix all errors before saving");
      return;
    }

    const serviceData = {
      serviceType: formData.serviceType,
      price: parseFloat(formData.price),
    };

    try {
      if (editMode) {
        await dispatch(
          updateLaundryService({ id: initialData._id, serviceData })
        ).unwrap();
        toast.success("Laundry service updated successfully!", {
          duration: 5000,
        });
      } else {
        await dispatch(addLaundryService(serviceData)).unwrap();
        toast.success("Laundry service added successfully!", {
          duration: 5000,
        });
      }
      resetForm();
      await dispatch(fetchLaundryServices()).unwrap();
      onClose();
    } catch (error) {
      toast.error(
        "Error saving laundry service: " + (error.message || "Unknown error"),
        {
          duration: 7000,
        }
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
              {editMode ? "Edit Laundry Service" : "Add New Laundry Service"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Service Type"
            fullWidth
            margin="normal"
            value={formData.serviceType}
            onChange={handleChange("serviceType")}
            error={!!errors.serviceType}
            helperText={errors.serviceType}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
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

export default AddNewLaundryServiceDrawer;
