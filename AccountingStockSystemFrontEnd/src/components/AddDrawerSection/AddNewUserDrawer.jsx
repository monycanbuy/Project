import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Chip,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  fetchAllUsers,
  updateUser,
} from "../../redux/slices/authSlice";
import { fetchRoles } from "../../redux/slices/roleSlice";
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

const AddNewUserDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const {
    list: roles,
    status: rolesStatus,
    isLoading: rolesLoading,
  } = useSelector((state) => state.roles);
  const { isLoading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (rolesStatus === "idle") {
      dispatch(fetchRoles());
    }
  }, [dispatch, rolesStatus]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    status: "active",
    roles: [],
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (editMode) {
      console.log("initialData.roles:", initialData.roles);
      const roleIds = initialData.roles.map((role) =>
        typeof role === "object" ? String(role._id) : String(role)
      );
      setFormData({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        password: "",
        phoneNumber: initialData.phoneNumber || "",
        status: initialData.status || "active",
        roles: roleIds,
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        status: "active",
        roles: [],
      });
    }
  }, [editMode, initialData]);

  useEffect(() => {
    const isValid =
      Object.values(errors).every((error) => !error) &&
      formData.fullName &&
      formData.email &&
      (editMode || formData.password) &&
      formData.phoneNumber &&
      formData.roles.length > 0;
    setIsFormValid(isValid);
  }, [errors, formData, editMode]);

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "fullName":
        error.fullName = !value ? "Full name is required" : undefined;
        break;
      case "email":
        error.email = !value
          ? "Email is required"
          : !/\S+@\S+\.\S+/.test(value)
          ? "Email is invalid"
          : undefined;
        break;
      case "password":
        if (!value && !editMode) error.password = "Password is required";
        break;
      case "phoneNumber":
        if (!value) error.phoneNumber = "Phone number is required";
        break;
      case "roles":
        if (!value || value.length === 0)
          error.roles = "At least one role is required";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, ...error }));
  };

  const handleChange = (field) => (event) => {
    let value = event.target.value;
    if (field === "roles") {
      value = value.filter((roleId) => roles.some((r) => r._id === roleId));
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
  };

  const handleBlur = (field) => (event) => {
    const { value } = event.target;
    validateField(field, value);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      status: "active",
      roles: [],
    });
    setErrors({});
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please fix all errors before saving");
      return;
    }

    const action = editMode ? updateUser : signupUser;
    const payload = editMode
      ? {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          status: formData.status,
          roles: formData.roles.map(String),
        }
      : formData;

    console.log(
      `Attempting to ${editMode ? "update" : "signup"} with data:`,
      payload
    );
    console.log(
      "Roles array type check:",
      payload.roles.map((r) => typeof r)
    );

    dispatch(action(editMode ? { _id: initialData._id, ...payload } : payload))
      .unwrap()
      .then(() => {
        toast.success(
          `User ${editMode ? "updated" : "signed up"} successfully!`,
          { duration: 5000 }
        );
        resetForm();
        dispatch(fetchAllUsers()).then(() => onClose());
      })
      .catch((error) => {
        toast.error(
          `Error ${editMode ? "updating" : "signing up"}: ` +
            (error.message || "Unknown error"),
          { duration: 7000 }
        );
      });
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

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
            <h2>{editMode ? "Edit User" : "Add New User"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={formData.fullName}
            onChange={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />
          {!editMode && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            />
          )}
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status || "active"}
              onChange={handleChange("status")}
              sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="deleted">Deleted</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Roles</InputLabel>
            <Select
              multiple
              value={formData.roles}
              onChange={handleChange("roles")}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((roleId) => {
                    const role = roles.find((r) => r._id === roleId);
                    return role ? (
                      <Chip
                        key={role._id}
                        label={role.name}
                        sx={{ bgcolor: "#fe6c00", color: "#fff" }}
                      />
                    ) : null;
                  })}
                </Box>
              )}
              MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
              sx={{ "& .MuiInputBase-root": { height: "40px" } }}
              disabled={rolesLoading}
            >
              {rolesLoading ? (
                <MenuItem value="">Loading roles...</MenuItem>
              ) : (
                roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    <Checkbox checked={formData.roles.includes(role._id)} />
                    {role.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.roles && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                {errors.roles}
              </span>
            )}
          </FormControl>

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
              disabled={!isFormValid || authLoading || rolesLoading}
            >
              {authLoading || rolesLoading ? (
                <CircularProgress size={24} />
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

export default AddNewUserDrawer;
