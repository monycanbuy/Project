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
//   fetchAuditLogs,
//   deleteAuditLog,
// } from "../../redux/slices/auditLogSlice";

// const AuditLogs = () => {
//   const dispatch = useDispatch();
//   const { auditLogs, status, error } = useSelector((state) => state.auditlogs);
//   const [data, setData] = useState([]);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [logToDelete, setLogToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAuditLogs());
//   }, [dispatch]);

//   useEffect(() => {
//     if (auditLogs && Array.isArray(auditLogs) && auditLogs.length > 0) {
//       const formattedData = auditLogs.map((log) => ({
//         id: log._id,
//         user: log.userId ? log.userId.fullName : "System", // Show "System" instead of "N/A"
//         action: log.action || "N/A",
//         description: log.description || "N/A",
//         timestamp: log.timestamp
//           ? new Date(log.timestamp).toLocaleString()
//           : "N/A",
//         resourceId: log.resourceId || "N/A",
//         resourceType: log.resourceType || "N/A",
//       }));
//       setData(formattedData);
//     } else {
//       setData([]);
//     }
//   }, [auditLogs]);

//   const handleDeleteClick = (logId) => {
//     setLogToDelete(logId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (logToDelete) {
//       dispatch(deleteAuditLog(logToDelete))
//         .unwrap()
//         .then(() => {
//           dispatch(fetchAuditLogs());
//           toast.success("Audit log deleted successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error deleting audit log: ${error.message}`);
//         })
//         .finally(() => {
//           setDeleteDialogOpen(false);
//           setLogToDelete(null);
//         });
//     }
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setLogToDelete(null);
//   };

//   const columns = [
//     { field: "user", headerName: "User", flex: 1 },
//     { field: "action", headerName: "Action", flex: 1 },
//     { field: "description", headerName: "Description", flex: 1 },
//     { field: "timestamp", headerName: "Timestamp", flex: 1 },
//     { field: "resourceId", headerName: "Resource ID", flex: 1 },
//     { field: "resourceType", headerName: "Resource Type", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <i
//           className="bx bx-trash"
//           style={{ color: "#fe1e00", cursor: "pointer" }}
//           onClick={() => handleDeleteClick(params.row.id)}
//         ></i>
//       ),
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

//   const loadingData = [
//     {
//       id: "loading",
//       user: (
//         <Box
//           key="loading"
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "200px",
//             width: "100%",
//           }}
//         >
//           <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {error ? (
//           <div>
//             Error: {error.message || "An error occurred."}
//             {error.status && <div>Status Code: {error.status}</div>}
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
//                   width: "100%",
//                 }}
//               >
//                 <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//               </Box>
//             ) : (
//               <Box sx={{ height: 600, width: "100%" }}>
//                 <DataGrid
//                   rows={data}
//                   columns={columns}
//                   pageSize={10}
//                   rowsPerPageOptions={[10]}
//                   disableSelectionOnClick
//                 />
//               </Box>
//             )}
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={handleCloseDialog}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Delete"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this audit log?
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

// export default AuditLogs;

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
  fetchAuditLogs,
  deleteAuditLog,
} from "../../redux/slices/auditLogSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";

const AuditLogs = () => {
  const dispatch = useDispatch();
  const {
    auditLogs = [],
    status = "idle",
    error,
  } = useSelector((state) => state.auditlogs || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("AuditLogs - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching audit logs...");
        dispatch(fetchAuditLogs());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching audit logs...");
            dispatch(fetchAuditLogs());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    //console.log("AuditLogs - Data update", { auditLogs });
    if (auditLogs && Array.isArray(auditLogs) && auditLogs.length > 0) {
      const formattedData = auditLogs.map((log) => ({
        id: log._id || "N/A",
        user: log.userId ? log.userId.fullName : "System",
        action: log.action || "N/A",
        description: log.description || "N/A",
        timestamp: log.timestamp
          ? new Date(log.timestamp).toLocaleString()
          : "N/A",
        resourceId: log.resourceId || "N/A",
        resourceType: log.resourceType || "N/A",
      }));
      //console.log("Formatted Data:", formattedData);
      setData(formattedData);
    } else {
      setData([]);
      // console.log(
      //   "No audit logs data available or data is not in expected format"
      // );
    }
  }, [auditLogs]);

  const handleDeleteClick = useCallback((logId) => {
    setLogToDelete(logId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (logToDelete) {
      dispatch(deleteAuditLog(logToDelete))
        .unwrap()
        .then(() => {
          toast.success("Audit log deleted successfully!", { duration: 5000 });
          dispatch(fetchAuditLogs());
        })
        .catch((error) => {
          toast.error(
            `Error deleting audit log: ${error.message || "Unknown error"}`
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setLogToDelete(null);
        });
    }
  }, [dispatch, logToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setLogToDelete(null);
  }, []);

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  const columns = useMemo(
    () => [
      { field: "user", headerName: "User", flex: 1 },
      { field: "action", headerName: "Action", flex: 1 },
      { field: "description", headerName: "Description", flex: 1 },
      { field: "timestamp", headerName: "Timestamp", flex: 1 },
      { field: "resourceId", headerName: "Resource ID", flex: 1 },
      { field: "resourceType", headerName: "Resource Type", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (
          <i
            className="bx bx-trash"
            style={{ color: "#fe1e00", cursor: "pointer" }}
            onClick={() => handleDeleteClick(params.row.id)}
          ></i>
        ),
      },
    ],
    [handleDeleteClick]
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
          },
        },
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">Please log in to view audit logs.</Typography>
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
              width: "100%",
            }}
          >
            <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
          </Box>
        ) : error ? (
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
              Error: {error.message || "An error occurred"}
              {error.status && ` (Status: ${error.status})`}
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
          <>
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={data}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                disableSelectionOnClick
              />
            </Box>
            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this audit log?
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
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default AuditLogs;
