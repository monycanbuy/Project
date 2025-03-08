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
//       const formattedData = auditLogs.map((log) => [
//         log.userId ? log.userId.fullName : "System", // Show "System" instead of "N/A"
//         log.action || "N/A",
//         log.description || "N/A",
//         log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A",
//         log.resourceId || "N/A",
//         log.resourceType || "N/A",
//         log._id,
//       ]);
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
//     { name: "User", options: { filter: true, sort: true } },
//     { name: "Action", options: { filter: true, sort: false } },
//     { name: "Description", options: { filter: true, sort: false } },
//     { name: "Timestamp", options: { filter: true, sort: true } },
//     { name: "Resource ID", options: { filter: true, sort: false } },
//     { name: "Resource Type", options: { filter: true, sort: false } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const log = auditLogs[tableMeta.rowIndex];
//           if (!log) return null;
//           return (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(log._id)}
//             ></i>
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
//           width: "100%",
//         }}
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//       </Box>,
//     ],
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
//             <MUIDataTable
//               title={"Audit Logs"}
//               data={status === "loading" ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
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
  fetchAuditLogs,
  deleteAuditLog,
} from "../../redux/slices/auditLogSlice";

const AuditLogs = () => {
  const dispatch = useDispatch();
  const { auditLogs, status, error } = useSelector((state) => state.auditlogs);
  const [data, setData] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  useEffect(() => {
    if (auditLogs && Array.isArray(auditLogs) && auditLogs.length > 0) {
      const formattedData = auditLogs.map((log) => ({
        id: log._id,
        user: log.userId ? log.userId.fullName : "System", // Show "System" instead of "N/A"
        action: log.action || "N/A",
        description: log.description || "N/A",
        timestamp: log.timestamp
          ? new Date(log.timestamp).toLocaleString()
          : "N/A",
        resourceId: log.resourceId || "N/A",
        resourceType: log.resourceType || "N/A",
      }));
      setData(formattedData);
    } else {
      setData([]);
    }
  }, [auditLogs]);

  const handleDeleteClick = (logId) => {
    setLogToDelete(logId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (logToDelete) {
      dispatch(deleteAuditLog(logToDelete))
        .unwrap()
        .then(() => {
          dispatch(fetchAuditLogs());
          toast.success("Audit log deleted successfully!");
        })
        .catch((error) => {
          toast.error(`Error deleting audit log: ${error.message}`);
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setLogToDelete(null);
        });
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setLogToDelete(null);
  };

  const columns = [
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

  const loadingData = [
    {
      id: "loading",
      user: (
        <Box
          key="loading"
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
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div>
        {error ? (
          <div>
            Error: {error.message || "An error occurred."}
            {error.status && <div>Status Code: {error.status}</div>}
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
                  width: "100%",
                }}
              >
                <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
              </Box>
            ) : (
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                />
              </Box>
            )}
            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Confirm Delete"}
              </DialogTitle>
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
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default AuditLogs;
