// // export default Alerts;
// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAlerts,
//   deleteAlert,
//   markAlertAsRead,
// } from "../../redux/slices/alertsSlice";
// import { checkAuthStatus } from "../../redux/slices/authSlice"; // Add this for auth check
// import AddNewAlertDrawer from "../AddDrawerSection/AddNewAlertDrawer";

// const Alerts = () => {
//   const dispatch = useDispatch();
//   const { alerts, status, error } = useSelector((state) => state.alerts);
//   const { isAuthenticated, user } = useSelector((state) => state.auth); // Add auth state
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [alertToDelete, setAlertToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Alerts - Checking auth and fetching alerts...");
//     if (isAuthenticated) {
//       dispatch(fetchAlerts());
//     } else {
//       dispatch(checkAuthStatus()).then((result) => {
//         if (result.meta.requestStatus === "fulfilled") {
//           dispatch(fetchAlerts());
//         }
//       });
//     }
//   }, [dispatch, isAuthenticated]);

//   useEffect(() => {
//     console.log("Alerts - State:", {
//       alerts,
//       status,
//       error,
//       isAuthenticated,
//       user,
//     });
//     if (alerts && Array.isArray(alerts)) {
//       const formattedData = alerts.map((alert) => ({
//         id: alert._id || "N/A",
//         type: alert.type || "N/A",
//         message: alert.message || "N/A",
//         action: alert.action || "N/A",
//         user: alert.user ? alert.user.fullName : "N/A",
//         readStatus: alert.read ? "Read" : "Unread",
//         alertStatus: alert.status || "N/A",
//         createdAt: alert.createdAt
//           ? new Date(alert.createdAt).toLocaleString()
//           : "N/A",
//       }));
//       console.log("Alerts - Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       setData([]);
//       console.log("Alerts - No valid alerts data");
//     }
//   }, [alerts]);

//   const handleEditClick = (alert) => {
//     if (alert) {
//       setEditData(alert);
//       setDrawerOpen(true);
//     }
//   };

//   const handleDeleteClick = (alertId) => {
//     setAlertToDelete(alertId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (alertToDelete) {
//       dispatch(deleteAlert(alertToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("Alert deleted successfully!", { duration: 5000 });
//           dispatch(fetchAlerts()); // Refresh after delete
//         })
//         .catch((err) => {
//           console.error("Delete error:", err);
//           toast.error(
//             `Error deleting alert: ${err.message || "Unknown error"}`
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setAlertToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setAlertToDelete(null);
//   };

//   const handleToggleRead = (alertId) => {
//     dispatch(markAlertAsRead(alertId))
//       .unwrap()
//       .then(() => {
//         toast.success("Alert status updated!");
//         dispatch(fetchAlerts()); // Refresh to reflect change
//       })
//       .catch((err) => {
//         console.error("Toggle read error:", err);
//         toast.error(`Error updating alert: ${err.message || "Unknown error"}`);
//         if (err.message === "Unauthorized: No token provided in cookies") {
//           dispatch(checkAuthStatus()); // Retry auth if token issue
//         }
//       });
//   };

//   const columns = [
//     { field: "type", headerName: "Type", flex: 1 },
//     { field: "message", headerName: "Message", flex: 1 },
//     { field: "action", headerName: "Action", flex: 1 },
//     { field: "user", headerName: "User", flex: 1 },
//     { field: "readStatus", headerName: "Read Status", flex: 1 },
//     { field: "alertStatus", headerName: "Alert Status", flex: 1 },
//     { field: "createdAt", headerName: "Created At", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => {
//         const alert = alerts.find((a) => a._id === params.row.id);
//         if (!alert) return null;

//         return (
//           <>
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(alert)}
//             ></i>
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleDeleteClick(alert._id)}
//             ></i>
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => handleToggleRead(alert._id)}
//               sx={{
//                 color: alert.read ? "green" : "#fe6c00",
//                 borderColor: alert.read ? "green" : "#fe6c00",
//                 "&:hover": {
//                   borderColor: alert.read ? "darkgreen" : "#fec80a",
//                   backgroundColor: alert.read
//                     ? "rgba(0, 128, 0, 0.04)"
//                     : "rgba(254, 108, 0, 0.04)",
//                 },
//               }}
//             >
//               {alert.read ? "Mark Unread" : "Mark Read"}
//             </Button>
//           </>
//         );
//       },
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MuiDataGrid: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
//             "& .MuiDataGrid-row": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiDataGrid-cell": { color: "#bdbabb" },
//               },
//             },
//             "& .MuiDataGrid-cell": { color: "#fff", fontSize: "18px" },
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiDataGrid-columnHeaderTitle": {
//                 color: "#000",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               },
//             },
//             "& .MuiDataGrid-toolbarContainer": {
//               backgroundColor: "#d0d0d0",
//               "& .MuiButton-root": { color: "#3f51b5" },
//             },
//           },
//         },
//       },
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {status === "failed" && error ? (
//           <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//             Error:{" "}
//             {typeof error === "string"
//               ? error
//               : error.message || "An error occurred"}
//           </div>
//         ) : (
//           <>
//             {status === "loading" ? (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: "200px",
//                 }}
//               >
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
//               </Box>
//             ) : (
//               <Box sx={{ height: 600, width: "100%" }}>
//                 <DataGrid
//                   rows={data}
//                   columns={columns}
//                   pageSize={10}
//                   rowsPerPageOptions={[10]}
//                   disableSelectionOnClick
//                   components={{
//                     Toolbar: () => (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => {
//                           setEditData(null);
//                           setDrawerOpen(true);
//                         }}
//                         sx={{
//                           backgroundColor: "#fe6c00",
//                           color: "#fff",
//                           "&:hover": {
//                             backgroundColor: "#fec80a",
//                             color: "#bdbabb",
//                           },
//                         }}
//                       >
//                         Add New Alert
//                       </Button>
//                     ),
//                   }}
//                 />
//               </Box>
//             )}
//             <AddNewAlertDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={handleCloseDialog}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this alert?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleCloseDialog} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Alerts;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Toaster, toast } from "react-hot-toast";
import {
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlerts,
  deleteAlert,
  markAlertAsRead,
} from "../../redux/slices/alertsSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import AddNewAlertDrawer from "../AddDrawerSection/AddNewAlertDrawer";

const Alerts = () => {
  const dispatch = useDispatch();
  const {
    alerts = [],
    status = "idle",
    error,
  } = useSelector((state) => state.alerts || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    //console.log("Alerts - Mount check", { isAuthenticated, initialFetchDone });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching alerts...");
        dispatch(fetchAlerts());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching alerts...");
            dispatch(fetchAlerts());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            //console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    //console.log("Alerts - Data update", { alerts, status, error });
    if (alerts && Array.isArray(alerts)) {
      const formattedData = alerts.map((alert) => ({
        id: alert._id || "N/A",
        type: alert.type || "N/A",
        message: alert.message || "N/A",
        action: alert.action || "N/A",
        user: alert.user ? alert.user.fullName : "N/A",
        readStatus: alert.read ? "Read" : "Unread",
        alertStatus: alert.status || "N/A",
        createdAt: alert.createdAt
          ? new Date(alert.createdAt).toLocaleString()
          : "N/A",
      }));
      //console.log("Alerts - Formatted Data:", formattedData);
      setData(formattedData);
    } else {
      setData([]);
      //console.log("Alerts - No valid alerts data");
    }
  }, [alerts]);

  const handleEditClick = useCallback((alert) => {
    if (alert) {
      setEditData(alert);
      setDrawerOpen(true);
    }
  }, []);

  const handleDeleteClick = useCallback((alertId) => {
    setAlertToDelete(alertId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (alertToDelete) {
      dispatch(deleteAlert(alertToDelete))
        .unwrap()
        .then(() => {
          toast.success("Alert deleted successfully!", { duration: 5000 });
          dispatch(fetchAlerts());
        })
        .catch((err) => {
          console.error("Delete error:", err);
          toast.error(
            `Error deleting alert: ${err.message || "Unknown error"}`
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setAlertToDelete(null);
        });
    }
  }, [dispatch, alertToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setAlertToDelete(null);
  }, []);

  const handleToggleRead = useCallback(
    (alertId) => {
      dispatch(markAlertAsRead(alertId))
        .unwrap()
        .then(() => {
          toast.success("Alert status updated!");
          dispatch(fetchAlerts());
        })
        .catch((err) => {
          console.error("Toggle read error:", err);
          toast.error(
            `Error updating alert: ${err.message || "Unknown error"}`
          );
          if (err.message === "Unauthorized: No token provided in cookies") {
            dispatch(checkAuthStatus());
          }
        });
    },
    [dispatch]
  );

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  const columns = useMemo(
    () => [
      { field: "type", headerName: "Type", flex: 1 },
      { field: "message", headerName: "Message", flex: 1 },
      { field: "action", headerName: "Action", flex: 1 },
      { field: "user", headerName: "User", flex: 1 },
      { field: "readStatus", headerName: "Read Status", flex: 1 },
      { field: "alertStatus", headerName: "Alert Status", flex: 1 },
      { field: "createdAt", headerName: "Created At", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => {
          const alert = alerts.find((a) => a._id === params.row.id);
          if (!alert) return null;

          return (
            <>
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleEditClick(alert)}
              ></i>
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleDeleteClick(alert._id)}
              ></i>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleToggleRead(alert._id)}
                sx={{
                  color: alert.read ? "green" : "#fe6c00",
                  borderColor: alert.read ? "green" : "#fe6c00",
                  "&:hover": {
                    borderColor: alert.read ? "darkgreen" : "#fec80a",
                    backgroundColor: alert.read
                      ? "rgba(0, 128, 0, 0.04)"
                      : "rgba(254, 108, 0, 0.04)",
                  },
                }}
              >
                {alert.read ? "Mark Unread" : "Mark Read"}
              </Button>
            </>
          );
        },
      },
    ],
    [handleEditClick, handleDeleteClick, handleToggleRead, alerts]
  );

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: "#f0f0f0",
            "& .MuiDataGrid-row": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiDataGrid-cell": { color: "#bdbabb" },
              },
            },
            "& .MuiDataGrid-cell": { color: "#fff", fontSize: "18px" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#e0e0e0",
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#000",
                fontSize: "18px",
                fontWeight: "bold",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#29221d",
              color: "#fcfcfc",
              "& .MuiTablePagination-root": { color: "#fcfcfc" },
              "& .MuiIconButton-root": { color: "#fcfcfc" },
            },
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#d0d0d0",
              "& .MuiButton-root": { color: "#3f51b5" },
            },
          },
        },
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">Please log in to view alerts.</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {status === "loading" && data.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress sx={{ color: "#fe6c00" }} />
          </Box>
        ) : status === "failed" && error ? (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#302924",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              textAlign: "center",
              zIndex: 1300,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#fe1e00", mb: 2, fontWeight: "bold" }}
            >
              Error: {error.message || error || "An error occurred"}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{
                backgroundColor: "#fe6c00",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "4px",
                "&:hover": { backgroundColor: "#fec80a", color: "#000" },
              }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={data}
              columns={columns}
              pageSizeOptions={[10, 20, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableSelectionOnClick
              slots={{
                toolbar: () => (
                  <Box sx={{ p: 1, backgroundColor: "#d0d0d0" }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setEditData(null);
                        setDrawerOpen(true);
                      }}
                      sx={{
                        backgroundColor: "#fe6c00",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#fec80a",
                          color: "#bdbabb",
                        },
                      }}
                    >
                      Add New Alert
                    </Button>
                  </Box>
                ),
              }}
            />
            <AddNewAlertDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
            />
            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this alert?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default Alerts;
