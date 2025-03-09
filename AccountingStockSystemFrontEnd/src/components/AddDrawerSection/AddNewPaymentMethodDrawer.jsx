// import React, { useState, useEffect, useCallback } from "react";
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
//   addPaymentMethod,
//   updatePaymentMethod,
//   fetchPaymentMethods,
// } from "../../redux/slices/paymentMethodsSlice";
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

// const AddNewPaymentMethodDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.paymentMethods);

//   const [formData, setFormData] = useState({
//     name: "",
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     // Update form data only when editMode or initialData changes
//     if (editMode) {
//       setFormData({
//         name: initialData.name || "",
//       });
//     } else {
//       setFormData({
//         name: "",
//       });
//     }
//   }, [editMode, JSON.stringify(initialData)]); // Deep comparison of initialData

//   const handleChange = useCallback(
//     (field) => (event) => {
//       const value = event.target.value;
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [field]: undefined,
//       }));
//       validateField(field, value);
//     },
//     []
//   );

//   const validateField = useCallback((name, value) => {
//     let error = {};
//     switch (name) {
//       case "name":
//         if (!value.trim()) error.name = "Payment method name is required";
//         break;
//       default:
//         break;
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       ...error,
//     }));
//   }, []);

//   const resetForm = useCallback(() => {
//     setFormData({
//       name: "",
//     });
//     setErrors({});
//   }, []);

//   const handleSave = useCallback(() => {
//     // Validate all fields before saving
//     let formErrors = {};
//     Object.keys(formData).forEach((field) => {
//       validateField(field, formData[field]);
//       if (field === "name" && !formData[field].trim()) {
//         formErrors[field] = "Payment method name is required";
//       }
//     });

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     if (editMode) {
//       dispatch(
//         updatePaymentMethod({
//           paymentMethodId: initialData._id, // Changed to _id to match your API structure
//           paymentMethodData: { ...formData }, // Spread to ensure we're sending an object with name
//         })
//       )
//         .then(() => {
//           toast.success("Payment method updated successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           onClose();
//           dispatch(fetchPaymentMethods());
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating payment method: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(addPaymentMethod(formData))
//         .then(() => {
//           toast.success("Payment method added successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           onClose();
//           dispatch(fetchPaymentMethods());
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding payment method: " +
//               (error.response?.data?.message || error.message),
//             { duration: 7000 }
//           );
//         });
//     }
//   }, [dispatch, editMode, initialData._id, formData, onClose]);

//   const handleCancel = useCallback(() => {
//     resetForm();
//     onClose();
//   }, [onClose, resetForm]);

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
//               {editMode ? "Edit Payment Method" : "Add New Payment Method"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Payment Method Name"
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
//               {isLoading ? <CircularProgress size={24} /> : "Save"}
//             </Button>
//           </Box>
//         </Box>
//       </StyledDrawer>
//       <Toaster />
//     </>
//   );
// };

// export default AddNewPaymentMethodDrawer;

// import React, { useState, useEffect, useCallback } from "react";
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
//   addPaymentMethod,
//   updatePaymentMethod,
//   fetchPaymentMethods,
// } from "../../redux/slices/paymentMethodsSlice";
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

// const AddNewPaymentMethodDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.paymentMethods);

//   const [formData, setFormData] = useState({
//     name: "",
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     // Update form data only when editMode or initialData changes
//     if (editMode) {
//       setFormData({
//         name: initialData.name || "",
//       });
//       console.log("Edit Mode ID:", initialData._id); // Debug log
//     } else {
//       setFormData({
//         name: "",
//       });
//     }
//   }, [editMode, JSON.stringify(initialData)]); // Deep comparison of initialData

//   const handleChange = useCallback(
//     (field) => (event) => {
//       const value = event.target.value;
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         [field]: undefined,
//       }));
//       validateField(field, value);
//     },
//     []
//   );

//   const validateField = useCallback((name, value) => {
//     let error = {};
//     switch (name) {
//       case "name":
//         if (!value.trim()) error.name = "Payment method name is required";
//         break;
//       default:
//         break;
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       ...error,
//     }));
//   }, []);

//   const resetForm = useCallback(() => {
//     setFormData({
//       name: "",
//     });
//     setErrors({});
//   }, []);

//   const handleSave = useCallback(() => {
//     // Validate all fields before saving
//     let formErrors = {};
//     Object.keys(formData).forEach((field) => {
//       validateField(field, formData[field]);
//       if (field === "name" && !formData[field].trim()) {
//         formErrors[field] = "Payment method name is required";
//       }
//     });

//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     console.log("Form Data:", formData);
//     console.log("Initial Data ID:", initialData._id);

//     if (editMode) {
//       dispatch(
//         updatePaymentMethod({
//           paymentMethodId: initialData._id,
//           paymentMethodData: { ...formData }, // Spread to ensure we're sending an object with name
//         })
//       )
//         .then(() => {
//           toast.success("Payment method updated successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           onClose();
//           dispatch(fetchPaymentMethods());
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating payment method: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(addPaymentMethod(formData))
//         .then(() => {
//           toast.success("Payment method added successfully!", {
//             duration: 5000,
//           });
//           resetForm();
//           onClose();
//           dispatch(fetchPaymentMethods());
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding payment method: " +
//               (error.response?.data?.message || error.message),
//             { duration: 7000 }
//           );
//         });
//     }
//   }, [dispatch, editMode, initialData._id, formData, onClose]);

//   const handleCancel = useCallback(() => {
//     resetForm();
//     onClose();
//   }, [onClose, resetForm]);

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
//               {editMode ? "Edit Payment Method" : "Add New Payment Method"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Payment Method Name"
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
//               {isLoading ? <CircularProgress size={24} /> : "Save"}
//             </Button>
//           </Box>
//         </Box>
//       </StyledDrawer>
//       <Toaster />
//     </>
//   );
// };

// export default AddNewPaymentMethodDrawer;

import React, { useState, useEffect, useCallback } from "react";
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
  addPaymentMethod,
  updatePaymentMethod,
  fetchPaymentMethods,
} from "../../redux/slices/paymentMethodsSlice";
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

const AddNewPaymentMethodDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.paymentMethods);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Update form data only when editMode or initialData changes
    if (editMode) {
      setFormData({
        name: initialData.name || "",
      });
      console.log("Edit Mode ID:", initialData._id); // Debug log
    } else {
      setFormData({
        name: "",
      });
    }
  }, [editMode, JSON.stringify(initialData)]); // Deep comparison of initialData

  const handleChange = useCallback(
    (field) => (event) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
      validateField(field, value);
    },
    []
  );

  const validateField = useCallback((name, value) => {
    let error = {};
    switch (name) {
      case "name":
        if (!value.trim()) error.name = "Payment method name is required";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
    });
    setErrors({});
  }, []);

  const handleSave = useCallback(() => {
    // Validate all fields before saving
    let formErrors = {};
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (field === "name" && !formData[field].trim()) {
        formErrors[field] = "Payment method name is required";
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    console.log("Form Data:", formData);
    console.log("Initial Data ID:", initialData._id);

    if (editMode) {
      dispatch(
        updatePaymentMethod({
          paymentMethodId: initialData._id,
          paymentMethodData: { ...formData }, // Spread to ensure we're sending an object with name
        })
      )
        .then(() => {
          toast.success("Payment method updated successfully!", {
            duration: 5000,
          });
          resetForm();
          onClose();
          dispatch(fetchPaymentMethods());
        })
        .catch((error) => {
          toast.error(
            "Error updating payment method: " +
              (error.response?.data?.message || error.message)
          );
        });
    } else {
      dispatch(addPaymentMethod(formData))
        .then(() => {
          toast.success("Payment method added successfully!", {
            duration: 5000,
          });
          resetForm();
          onClose();
          dispatch(fetchPaymentMethods());
        })
        .catch((error) => {
          toast.error(
            "Error adding payment method: " +
              (error.response?.data?.message || error.message),
            { duration: 7000 }
          );
        });
    }
  }, [dispatch, editMode, initialData._id, formData, onClose]);

  const handleCancel = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

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
            <h2>
              {editMode ? "Edit Payment Method" : "Add New Payment Method"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Payment Method Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
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
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
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

export default AddNewPaymentMethodDrawer;
