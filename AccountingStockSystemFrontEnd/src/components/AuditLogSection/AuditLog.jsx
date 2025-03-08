// // import React, { useEffect, useState } from "react";
// // import MUIDataTable from "mui-datatables";
// // import { createTheme, ThemeProvider } from "@mui/material/styles";
// // import { Toaster, toast } from "react-hot-toast";
// // import {
// //   Button,
// //   CircularProgress,
// //   Box,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogContentText,
// //   DialogTitle,
// // } from "@mui/material";
// // import "boxicons";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   fetchAuditLogs,
// //   deleteAuditLog,
// // } from "../../redux/slices/auditLogSlice";

// // const AuditLogs = () => {
// //   const dispatch = useDispatch();
// //   const { auditLogs, isLoading, error } = useSelector(
// //     (state) => state.auditlogs
// //   );
// //   const [data, setData] = useState();
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [logToDelete, setLogToDelete] = useState(null);

// //   useEffect(() => {
// //     dispatch(fetchAuditLogs());
// //   }, [dispatch]);

// //   useEffect(() => {
// //     if (auditLogs && Array.isArray(auditLogs) && auditLogs.length > 0) {
// //       const formattedData = auditLogs.map((log) => [
// //         log.userId.fullName, // Assuming userId is populated with user details
// //         log.action,
// //         log.description,
// //         new Date(log.timestamp).toLocaleString(),
// //         log.resourceId,
// //         log.resourceType,
// //         log._id,
// //       ]);
// //       setData(formattedData);
// //     } else {
// //       console.log(
// //         "No audit logs data available or data is not in expected format"
// //       );
// //     }
// //   }, [auditLogs]);

// //   const handleDeleteClick = (logId) => {
// //     setLogToDelete(logId);
// //     setDeleteDialogOpen(true);
// //   };

// //   const handleConfirmDelete = () => {
// //     if (logToDelete) {
// //       dispatch(deleteAuditLog(logToDelete))
// //         .then(() => {
// //           dispatch(fetchAuditLogs()); // Refresh the list after delete
// //           toast.success("Audit log deleted successfully!", { duration: 5000 });
// //         })
// //         .catch((error) => {
// //           toast.error(
// //             "Error deleting audit log: " +
// //               (error.response?.data?.message || error.message)
// //           );
// //         });
// //     }
// //     setDeleteDialogOpen(false);
// //     setLogToDelete(null);
// //   };

// //   const handleCloseDialog = () => {
// //     setDeleteDialogOpen(false);
// //     setLogToDelete(null);
// //   };

// //   const columns = [
// //     { name: "User", options: { filter: true, sort: true } },
// //     { name: "Action", options: { filter: true, sort: false } },
// //     { name: "Description", options: { filter: true, sort: false } },
// //     {
// //       name: "Timestamp",
// //       options: {
// //         filter: true,
// //         sort: true,
// //         customBodyRender: (value) => new Date(value).toLocaleString(),
// //       },
// //     },
// //     { name: "Resource ID", options: { filter: true, sort: false } },
// //     { name: "Resource Type", options: { filter: true, sort: false } },
// //     {
// //       name: "Action",
// //       options: {
// //         filter: false,
// //         sort: false,
// //         customBodyRender: (value, tableMeta) => {
// //           const logId = tableMeta.rowData; // Assuming _id is at index 6
// //           return (
// //             <i
// //               className="bx bx-trash"
// //               style={{ color: "#fe1e00", cursor: "pointer" }}
// //               onClick={() => handleDeleteClick(logId)}
// //             ></i>
// //           );
// //         },
// //       },
// //     },
// //   ];

// //   const theme = createTheme({
// //     components: {
// //       MUIDataTable: {
// //         styleOverrides: {
// //           root: {
// //             "& .MuiPaper-root": {
// //               backgroundColor: "#f0f0f0",
// //             },
// //             "& .MuiTableRow-root": {
// //               backgroundColor: "#29221d",
// //               "&:hover": {
// //                 backgroundColor: "#1e1611",
// //                 "& .MuiTableCell-root": {
// //                   color: "#bdbabb",
// //                 },
// //               },
// //             },
// //             "& .MuiTableCell-root": {
// //               color: "#fff",
// //               fontSize: "18px",
// //             },
// //             "& .MuiTableRow-head": {
// //               backgroundColor: "#e0e0e0",
// //               "& .MuiTableCell-root": {
// //                 color: "#000",
// //                 fontSize: "18px",
// //                 fontWeight: "bold",
// //               },
// //             },
// //             "& .MuiToolbar-root": {
// //               backgroundColor: "#d0d0d0",
// //               "& .MuiTypography-root": {
// //                 fontSize: "18px",
// //               },
// //               "& .MuiIconButton-root": {
// //                 color: "#3f51b5",
// //               },
// //             },
// //           },
// //         },
// //       },
// //     },
// //   });

// //   const options = {
// //     filterType: "checkbox",
// //     rowsPerPage: 10,
// //   };

// //   const loadingData = [
// //     [
// //       <Box
// //         key="loading"
// //         sx={{
// //           display: "flex",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           height: "200px",
// //           width: "100%",
// //         }}
// //       >
// //         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
// //       </Box>,
// //     ],
// //   ];

// //   return (
// //     <ThemeProvider theme={theme}>
// //       <div>
// //         {error ? (
// //           <div>Error: {error.message || "An error occurred."}</div>
// //         ) : (
// //           <>
// //             <MUIDataTable
// //               title={"Audit Logs"}
// //               data={isLoading ? loadingData : data}
// //               columns={columns}
// //               options={options}
// //             />
// //             <Dialog
// //               open={deleteDialogOpen}
// //               onClose={handleCloseDialog}
// //               aria-labelledby="alert-dialog-title"
// //               aria-describedby="alert-dialog-description"
// //             >
// //               <DialogTitle id="alert-dialog-title">
// //                 {"Confirm Delete"}
// //               </DialogTitle>
// //               <DialogContent>
// //                 <DialogContentText id="alert-dialog-description">
// //                   Are you sure you want to delete this audit log?
// //                 </DialogContentText>
// //               </DialogContent>
// //               <DialogActions>
// //                 <Button onClick={handleCloseDialog} color="primary">
// //                   Cancel
// //                 </Button>
// //                 <Button onClick={handleConfirmDelete} color="primary" autoFocus>
// //                   Delete
// //                 </Button>
// //               </DialogActions>
// //             </Dialog>
// //           </>
// //         )}
// //       </div>
// //       <Toaster />
// //     </ThemeProvider>
// //   );
// // };

// // export default AuditLogs;

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
// } from "../../redux/slices/auditLogSlice"; // Corrected import path

// const AuditLogs = () => {
//   const dispatch = useDispatch();
//   const { auditLogs, status, error } = useSelector(
//     (state) => state.auditlogs // Corrected reducer name: state.auditlogs
//   );
//   const [data, setData] = useState([]); // Initialize to an empty array
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [logToDelete, setLogToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAuditLogs());
//   }, [dispatch]);

//   useEffect(() => {
//     if (auditLogs && Array.isArray(auditLogs) && auditLogs.length > 0) {
//       const formattedData = auditLogs.map((log) => [
//         log.userId ? log.userId.fullName : "N/A", // Handle potentially missing userId
//         log.action || "N/A",
//         log.description || "N/A",
//         log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A", // Format date
//         log.resourceId || "N/A",
//         log.resourceType || "N/A",
//         log._id, // Keep the _id for the delete action, but it won't be displayed
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]); // Set to an empty array if no data
//     }
//   }, [auditLogs]);

//   const handleDeleteClick = (logId) => {
//     setLogToDelete(logId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (logToDelete) {
//       dispatch(deleteAuditLog(logToDelete))
//         .unwrap() // Use unwrap for proper error handling
//         .then(() => {
//           dispatch(fetchAuditLogs()); // Refresh the list
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
//     {
//       name: "Timestamp",
//       options: {
//         filter: true,
//         sort: true,
//         // No customBodyRender needed here, as we format in useEffect
//       },
//     },
//     { name: "Resource ID", options: { filter: true, sort: false } },
//     { name: "Resource Type", options: { filter: true, sort: false } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const log = auditLogs[tableMeta.rowIndex]; // Use auditLogs, more reliable
//           if (!log) return null; // Add this check
//           return (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(log._id)} // Pass the _id
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
//             "& .MuiPaper-root": {
//               backgroundColor: "#f0f0f0",
//             },
//             "& .MuiTableRow-root": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiTableCell-root": {
//                   color: "#bdbabb",
//                 },
//               },
//             },
//             "& .MuiTableCell-root": {
//               color: "#fff",
//               fontSize: "18px",
//             },
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
//               "& .MuiTypography-root": {
//                 fontSize: "18px",
//               },
//               "& .MuiIconButton-root": {
//                 color: "#3f51b5",
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   const options = {
//     filterType: "checkbox",
//     rowsPerPage: 10,
//     // ... other options ...
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
//               data={status === "loading" ? loadingData : data} // Use status, more reliable
//               columns={columns}
//               options={options}
//             />
//             {/* Delete Confirmation Dialog */}
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
//       <Toaster /> {/* Add Toaster for notifications */}
//     </ThemeProvider>
//   );
// };

// export default AuditLogs;

import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
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
      const formattedData = auditLogs.map((log) => [
        log.userId ? log.userId.fullName : "System", // Show "System" instead of "N/A"
        log.action || "N/A",
        log.description || "N/A",
        log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A",
        log.resourceId || "N/A",
        log.resourceType || "N/A",
        log._id,
      ]);
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
    { name: "User", options: { filter: true, sort: true } },
    { name: "Action", options: { filter: true, sort: false } },
    { name: "Description", options: { filter: true, sort: false } },
    { name: "Timestamp", options: { filter: true, sort: true } },
    { name: "Resource ID", options: { filter: true, sort: false } },
    { name: "Resource Type", options: { filter: true, sort: false } },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const log = auditLogs[tableMeta.rowIndex];
          if (!log) return null;
          return (
            <i
              className="bx bx-trash"
              style={{ color: "#fe1e00", cursor: "pointer" }}
              onClick={() => handleDeleteClick(log._id)}
            ></i>
          );
        },
      },
    },
  ];

  const theme = createTheme({
    components: {
      MUIDataTable: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
            "& .MuiTableRow-root": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiTableCell-root": { color: "#bdbabb" },
              },
            },
            "& .MuiTableCell-root": { color: "#fff", fontSize: "18px" },
            "& .MuiTableRow-head": {
              backgroundColor: "#e0e0e0",
              "& .MuiTableCell-root": {
                color: "#000",
                fontSize: "18px",
                fontWeight: "bold",
              },
            },
            "& .MuiToolbar-root": {
              backgroundColor: "#d0d0d0",
              "& .MuiTypography-root": { fontSize: "18px" },
              "& .MuiIconButton-root": { color: "#3f51b5" },
            },
          },
        },
      },
    },
  });

  const options = {
    filterType: "checkbox",
    rowsPerPage: 10,
  };

  const loadingData = [
    [
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
      </Box>,
    ],
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
            <MUIDataTable
              title={"Audit Logs"}
              data={status === "loading" ? loadingData : data}
              columns={columns}
              options={options}
            />
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
