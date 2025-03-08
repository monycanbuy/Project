// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
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
//       const formattedData = alerts.map((alert) => [
//         alert.type || "N/A",
//         alert.message || "N/A",
//         alert.action || "N/A",
//         alert.user ? alert.user.fullName : "N/A",
//         alert.read ? "Read" : "Unread",
//         alert.status || "N/A",
//         alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "N/A",
//         alert._id || "N/A",
//       ]);
//       console.log("Alerts - Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       setData([]);
//       console.log("Alerts - No valid alerts data");
//     }
//   }, [alerts]);

//   const handleEditClick = (alertId) => {
//     const alert = alerts.find((a) => a._id === alertId);
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
//     { name: "Type", options: { filter: true, sort: true } },
//     { name: "Message", options: { filter: true, sort: false } },
//     { name: "Action", options: { filter: true, sort: false } },
//     { name: "User", options: { filter: true, sort: true } },
//     { name: "Read Status", options: { filter: true, sort: true } },
//     { name: "Alert Status", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) =>
//           value ? new Date(value).toLocaleString() : "N/A",
//       },
//     },
//     {
//       name: "Actions",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const alertId = tableMeta.rowData[7];
//           const alert = alerts.find((a) => a._id === alertId);
//           if (!alert) return null;

//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(alertId)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleDeleteClick(alertId)}
//               ></i>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => handleToggleRead(alertId)}
//                 sx={{
//                   color: alert.read ? "green" : "#fe6c00",
//                   borderColor: alert.read ? "green" : "#fe6c00",
//                   "&:hover": {
//                     borderColor: alert.read ? "darkgreen" : "#fec80a",
//                     backgroundColor: alert.read
//                       ? "rgba(0, 128, 0, 0.04)"
//                       : "rgba(254, 108, 0, 0.04)",
//                   },
//                 }}
//               >
//                 {alert.read ? "Mark Unread" : "Mark Read"}
//               </Button>
//             </>
//           );
//         },
//       },
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MUIDataTable: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
//             "& .MuiTableRow-root": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiTableCell-root": { color: "#bdbabb" },
//               },
//             },
//             "& .MuiTableCell-root": { color: "#fff", fontSize: "18px" },
//             "& .MuiTableRow-head": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiTableCell-root": {
//                 color: "#000",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               },
//             },
//             "& .MuiToolbar-root": {
//               backgroundColor: "#d0d0d0",
//               "& .MuiTypography-root": { fontSize: "18px" },
//               "& .MuiIconButton-root": { color: "#3f51b5" },
//             },
//           },
//         },
//       },
//     },
//   });

//   const options = {
//     filterType: "checkbox",
//     rowsPerPage: 10,
//     customToolbar: () => (
//       <Button
//         variant="contained"
//         size="small"
//         onClick={() => {
//           setEditData(null);
//           setDrawerOpen(true);
//         }}
//         sx={{
//           backgroundColor: "#fe6c00",
//           color: "#fff",
//           "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
//         }}
//       >
//         Add New Alert
//       </Button>
//     ),
//   };

//   const loadingData = [
//     [
//       <Box
//         key="loading"
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "200px",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
//   ];

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
//             <MUIDataTable
//               title="Alerts"
//               data={status === "loading" ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
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
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlerts,
  deleteAlert,
  markAlertAsRead,
} from "../../redux/slices/alertsSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice"; // Add this for auth check
import AddNewAlertDrawer from "../AddDrawerSection/AddNewAlertDrawer";

const Alerts = () => {
  const dispatch = useDispatch();
  const { alerts, status, error } = useSelector((state) => state.alerts);
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Add auth state
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState(null);

  useEffect(() => {
    console.log("Alerts - Checking auth and fetching alerts...");
    if (isAuthenticated) {
      dispatch(fetchAlerts());
    } else {
      dispatch(checkAuthStatus()).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(fetchAlerts());
        }
      });
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    console.log("Alerts - State:", {
      alerts,
      status,
      error,
      isAuthenticated,
      user,
    });
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
      console.log("Alerts - Formatted Data:", formattedData);
      setData(formattedData);
    } else {
      setData([]);
      console.log("Alerts - No valid alerts data");
    }
  }, [alerts]);

  const handleEditClick = (alert) => {
    if (alert) {
      setEditData(alert);
      setDrawerOpen(true);
    }
  };

  const handleDeleteClick = (alertId) => {
    setAlertToDelete(alertId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (alertToDelete) {
      dispatch(deleteAlert(alertToDelete))
        .unwrap()
        .then(() => {
          toast.success("Alert deleted successfully!", { duration: 5000 });
          dispatch(fetchAlerts()); // Refresh after delete
        })
        .catch((err) => {
          console.error("Delete error:", err);
          toast.error(
            `Error deleting alert: ${err.message || "Unknown error"}`
          );
        });
    }
    setDeleteDialogOpen(false);
    setAlertToDelete(null);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setAlertToDelete(null);
  };

  const handleToggleRead = (alertId) => {
    dispatch(markAlertAsRead(alertId))
      .unwrap()
      .then(() => {
        toast.success("Alert status updated!");
        dispatch(fetchAlerts()); // Refresh to reflect change
      })
      .catch((err) => {
        console.error("Toggle read error:", err);
        toast.error(`Error updating alert: ${err.message || "Unknown error"}`);
        if (err.message === "Unauthorized: No token provided in cookies") {
          dispatch(checkAuthStatus()); // Retry auth if token issue
        }
      });
  };

  const columns = [
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
  ];

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
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
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#d0d0d0",
              "& .MuiButton-root": { color: "#3f51b5" },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        {status === "failed" && error ? (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            Error:{" "}
            {typeof error === "string"
              ? error
              : error.message || "An error occurred"}
          </div>
        ) : (
          <>
            {status === "loading" ? (
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
            ) : (
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                  components={{
                    Toolbar: () => (
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
                    ),
                  }}
                />
              </Box>
            )}
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
          </>
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default Alerts;
