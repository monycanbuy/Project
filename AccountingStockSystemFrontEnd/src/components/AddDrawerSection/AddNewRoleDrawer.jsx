// // AddNewRoleDrawer.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Button,
//   Drawer,
//   Box,
//   TextField,
//   IconButton,
//   CircularProgress,
//   FormControlLabel,
//   Checkbox,
//   Typography,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createRole,
//   updateRole,
//   fetchRoles,
//   fetchPermissions,
// } from "../../redux/slices/roleSlice";
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

// const AddNewRoleDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
// }) => {
//   const dispatch = useDispatch();
//   const { isLoading, permissions } = useSelector((state) => state.roles);

//   const [formData, setFormData] = useState({
//     name: "",
//     permissions: [],
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     dispatch(fetchPermissions()); // Fetch on mount
//   }, [dispatch]);

//   useEffect(() => {
//     if (editMode && initialData) {
//       setFormData({
//         name: initialData.name || "",
//         permissions: initialData.permissions || [],
//       });
//     } else {
//       setFormData({
//         name: "",
//         permissions: [],
//       });
//     }
//   }, [editMode, initialData]);

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

//   const handlePermissionChange = useCallback(
//     (permission) => (event) => {
//       setFormData((prev) => ({
//         ...prev,
//         permissions: event.target.checked
//           ? [...prev.permissions, permission]
//           : prev.permissions.filter((p) => p !== permission),
//       }));
//     },
//     []
//   );

//   const validateField = useCallback((name, value) => {
//     let error = {};
//     if (name === "name" && !value.trim()) {
//       error.name = "Role name is required";
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       ...error,
//     }));
//   }, []);

//   const resetForm = useCallback(() => {
//     setFormData({
//       name: "",
//       permissions: [],
//     });
//     setErrors({});
//   }, []);

//   const handleSave = useCallback(() => {
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );

//     if (Object.values(errors).some((error) => error)) {
//       return;
//     }

//     if (editMode) {
//       dispatch(
//         updateRole({
//           roleId: initialData._id,
//           name: formData.name,
//           permissions: formData.permissions,
//         })
//       )
//         .then(() => {
//           toast.success("Role updated successfully!", { duration: 5000 });
//           resetForm();
//           onClose();
//           dispatch(fetchRoles());
//         })
//         .catch((error) => {
//           toast.error(
//             "Error updating role: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     } else {
//       dispatch(
//         createRole({ name: formData.name, permissions: formData.permissions })
//       )
//         .then(() => {
//           toast.success("Role added successfully!", { duration: 5000 });
//           resetForm();
//           onClose();
//           dispatch(fetchRoles());
//         })
//         .catch((error) => {
//           toast.error(
//             "Error adding role: " +
//               (error.response?.data?.message || error.message),
//             { duration: 7000 }
//           );
//         });
//     }
//   }, [dispatch, editMode, initialData._id, formData, errors, onClose]);

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
//             <h2>{editMode ? "Edit Role" : "Add New Role"}</h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Role Name"
//             fullWidth
//             margin="normal"
//             value={formData.name}
//             onChange={handleChange("name")}
//             error={!!errors.name}
//             helperText={errors.name}
//             sx={{ "& .MuiInputBase-root": { height: "40px" } }}
//           />

//           <Box sx={{ mt: 2 }}>
//             <h3>Permissions</h3>
//             {isLoading ? (
//               <CircularProgress size={24} />
//             ) : permissions && permissions.length > 0 ? (
//               permissions.map((permission) => (
//                 <FormControlLabel
//                   key={permission.name}
//                   control={
//                     <Checkbox
//                       checked={formData.permissions.includes(permission.name)}
//                       onChange={handlePermissionChange(permission.name)}
//                     />
//                   }
//                   label={`${permission.name} - ${
//                     permission.description || "No description"
//                   }`}
//                 />
//               ))
//             ) : (
//               <Typography>No permissions available</Typography>
//             )}
//           </Box>

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

// export default AddNewRoleDrawer;

import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createRole,
  updateRole,
  fetchRoles,
  fetchPermissions,
} from "../../redux/slices/roleSlice";
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

const AddNewRoleDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { isLoading, permissions } = useSelector((state) => state.roles);

  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    dispatch(fetchPermissions()); // Fetch on mount
  }, [dispatch]);

  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        name: initialData.name || "",
        permissions: initialData.permissions || [],
      });
    } else {
      setFormData({
        name: "",
        permissions: [],
      });
    }
  }, [editMode, initialData]);

  useEffect(() => {
    const isValid =
      formData.name.trim() !== "" && formData.permissions.length > 0;
    setIsFormValid(isValid);
  }, [formData]);

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

  const handlePermissionChange = useCallback(
    (permission) => (event) => {
      setFormData((prev) => ({
        ...prev,
        permissions: event.target.checked
          ? [...prev.permissions, permission]
          : prev.permissions.filter((p) => p !== permission),
      }));
    },
    []
  );

  const validateField = useCallback((name, value) => {
    let error = {};
    if (name === "name" && !value.trim()) {
      error.name = "Role name is required";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      permissions: [],
    });
    setErrors({});
  }, []);

  const handleSave = useCallback(() => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    if (editMode) {
      dispatch(
        updateRole({
          roleId: initialData._id,
          name: formData.name,
          permissions: formData.permissions,
        })
      )
        .then(() => {
          toast.success("Role updated successfully!", { duration: 5000 });
          resetForm();
          onClose();
          dispatch(fetchRoles());
        })
        .catch((error) => {
          toast.error(
            "Error updating role: " +
              (error.response?.data?.message || error.message)
          );
        });
    } else {
      dispatch(
        createRole({ name: formData.name, permissions: formData.permissions })
      )
        .then(() => {
          toast.success("Role added successfully!", { duration: 5000 });
          resetForm();
          onClose();
          dispatch(fetchRoles());
        })
        .catch((error) => {
          toast.error(
            "Error adding role: " +
              (error.response?.data?.message || error.message),
            { duration: 7000 }
          );
        });
    }
  }, [dispatch, editMode, initialData._id, formData, errors, onClose]);

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
            <h2>{editMode ? "Edit Role" : "Add New Role"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Role Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />

          <Box sx={{ mt: 2 }}>
            <h3>Permissions</h3>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : permissions && permissions.length > 0 ? (
              permissions.map((permission) => (
                <FormControlLabel
                  key={permission.name}
                  control={
                    <Checkbox
                      checked={formData.permissions.includes(permission.name)}
                      onChange={handlePermissionChange(permission.name)}
                    />
                  }
                  label={`${permission.name} - ${
                    permission.description || "No description"
                  }`}
                />
              ))
            ) : (
              <Typography>No permissions available</Typography>
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
              disabled={isLoading || !isFormValid}
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

export default AddNewRoleDrawer;
