// src/components/SessionExpiredDialog.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setSessionExpired } from "../../redux/slices/authSlice";

const SessionExpiredDialog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSessionExpired = useSelector((state) => state.auth.sessionExpired);

  //   console.log(
  //     "SessionExpiredDialog rendered, isSessionExpired:",
  //     isSessionExpired
  //   );

  const handleRedirect = () => {
    //console.log("handleRedirect called");
    dispatch(logout()); // Clear auth state
    dispatch(setSessionExpired(false)); // Close dialog
    navigate("/login"); // Redirect to login
  };

  const handleCancel = () => {
    //console.log("handleCancel called");
    dispatch(setSessionExpired(false)); // Close dialog
    navigate("/login"); // Redirect anyway for security
  };

  return (
    <Dialog open={isSessionExpired} onClose={handleCancel}>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your session has expired. Please sign in again to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRedirect} variant="contained" color="primary">
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
