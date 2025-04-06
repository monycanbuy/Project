// import React, { useEffect, useState, useCallback } from "react";
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
//   TextField,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
// import PrintIcon from "@mui/icons-material/Print"; // Print icon
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchRoles, deleteRole } from "../../redux/slices/roleSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewRoleDrawer from "../AddDrawerSection/AddNewRoleDrawer";

// const Role = () => {
//   const dispatch = useDispatch();
//   const {
//     list: roles = [],
//     status: rolesStatus,
//     isLoading = false,
//     error,
//   } = useSelector((state) => state.roles || {});
//   const { user } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editRoleData, setEditRoleData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState(null);

//   useEffect(() => {
//     if (rolesStatus === "idle") {
//       dispatch(fetchRoles());
//     }
//   }, [dispatch, rolesStatus]);

//   useEffect(() => {
//     if (roles && Array.isArray(roles)) {
//       const formattedData = roles.map((role) => ({
//         id: role._id || "N/A",
//         name: role.name || "N/A",
//         permissions: role.permissions.join(", ") || "None",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData); // Initialize filtered data
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [roles]);

//   // Search functionality
//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredData(data);
//     } else {
//       const filtered = data.filter((row) =>
//         Object.values(row).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchVal.toLowerCase())
//         )
//       );
//       setFilteredData(filtered);
//     }
//   };

//   // CSV Export functionality
//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredData
//       .map((row) =>
//         columns
//           .map(
//             (col) =>
//               `"${(row[col.field] || "").toString().replace(/"/g, '""')}"`
//           )
//           .join(",")
//       )
//       .join("\n");
//     const csvContent = `${headers}\n${csvRows}`;
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "roles.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (role) => {
//       if (!role) {
//         console.error("Invalid role data:", role);
//         return;
//       }
//       setEditRoleData(role);
//       setDrawerOpen(true);
//     },
//     [setEditRoleData, setDrawerOpen]
//   );

//   const handleDeleteClick = useCallback(
//     (roleId) => {
//       setRoleToDelete(roleId);
//       setDeleteDialogOpen(true);
//     },
//     [setRoleToDelete, setDeleteDialogOpen]
//   );

//   const handleConfirmDelete = useCallback(() => {
//     if (roleToDelete) {
//       dispatch(deleteRole(roleToDelete))
//         .then(() => {
//           dispatch(fetchRoles());
//           toast.success("Role deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting role: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setRoleToDelete(null);
//   }, [dispatch, roleToDelete]);

//   const handleCloseDialog = useCallback(() => {
//     setDeleteDialogOpen(false);
//     setRoleToDelete(null);
//   }, []);

//   const columns = [
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "permissions", headerName: "Permissions", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => {
//         const role = roles.find((r) => r._id === params.row.id);
//         return (
//           <>
//             {hasPermission(user, "update:roles") && (
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(role)}
//               ></i>
//             )}
//             {hasPermission(user, "delete:roles") && (
//               <i
//                 className="bx bx-trash"
//                 style={{
//                   color: "#fe1e00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleDeleteClick(role._id)}
//               ></i>
//             )}
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
//             "& .MuiPaper-root": {
//               backgroundColor: "#f0f0f0",
//             },
//             "& .MuiDataGrid-row": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiDataGrid-cell": {
//                   color: "#bdbabb",
//                 },
//               },
//             },
//             "& .MuiDataGrid-cell": {
//               color: "#fff",
//               fontSize: "18px",
//             },
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: "#e0e0e0",
//               "& .MuiDataGrid-columnHeaderTitle": {
//                 color: "#000",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//               },
//             },
//             "& .MuiDataGrid-footerContainer": {
//               backgroundColor: "#29221d", // Match row background
//               color: "#fcfcfc", // Light text for visibility
//               "& .MuiTablePagination-root": {
//                 color: "#fcfcfc",
//               },
//               "& .MuiIconButton-root": {
//                 color: "#fcfcfc",
//               },
//             },
//             "@media print": {
//               "& .MuiDataGrid-main": {
//                 color: "#000", // Ensure text is readable when printing
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   const loadingData = [
//     {
//       id: "loading",
//       name: (
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
//       <Box sx={{ width: "100%" }}>
//         {error ? (
//           <div>Error: {error.message || "An error occurred."}</div>
//         ) : (
//           <>
//             <Box
//               sx={{
//                 padding: "8px",
//                 backgroundColor: "#d0d0d0",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "8px",
//                 "@media print": {
//                   display: "none",
//                 },
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Roles
//               </Typography>
//               <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                 <TextField
//                   variant="outlined"
//                   size="small"
//                   placeholder="Search..."
//                   value={searchText}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//                 />
//                 <IconButton
//                   onClick={handleExport}
//                   sx={{
//                     color: "#473b33",
//                     "&:hover": { color: "#fec80a" },
//                   }}
//                   title="Download CSV"
//                 >
//                   <GetAppIcon />
//                 </IconButton>
//                 <IconButton
//                   onClick={handlePrint}
//                   sx={{
//                     color: "#302924",
//                     "&:hover": { color: "#fec80a" },
//                   }}
//                   title="Print"
//                 >
//                   <PrintIcon />
//                 </IconButton>
//                 {hasPermission(user, "write:roles") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditRoleData(null);
//                       setDrawerOpen(true);
//                     }}
//                     sx={{
//                       backgroundColor: "#fe6c00",
//                       color: "#fff",
//                       "&:hover": {
//                         backgroundColor: "#fec80a",
//                         color: "#bdbabb",
//                       },
//                     }}
//                   >
//                     Add New Role
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             {isLoading ? (
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
//                   rows={filteredData}
//                   columns={columns}
//                   pageSizeOptions={[10, 20, 50]}
//                   initialState={{
//                     pagination: { paginationModel: { pageSize: 10 } },
//                   }}
//                   disableSelectionOnClick
//                 />
//               </Box>
//             )}
//             <AddNewRoleDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditRoleData(null);
//               }}
//               editMode={!!editRoleData}
//               initialData={editRoleData || {}}
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
//                   Are you sure you want to delete this role?
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
//       </Box>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Role;

import React, { useEffect, useState, useCallback } from "react";
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
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, deleteRole } from "../../redux/slices/roleSlice";
import { checkAuthStatus, logout } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewRoleDrawer from "../AddDrawerSection/AddNewRoleDrawer";

const Role = () => {
  const dispatch = useDispatch();
  const {
    list: roles = [],
    status,
    error,
  } = useSelector((state) => state.roles || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRoleData, setEditRoleData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    //console.log("Role - Mount check", { isAuthenticated, initialFetchDone });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching roles...");
        dispatch(fetchRoles())
          .unwrap()
          .then()
          .catch((err) => {
            //console.error("Fetch failed:", err);
            if (err?.response?.status === 401) {
              toast.error("Session expired. Please log in again.");
              dispatch(logout());
            }
          })
          .finally(() => setInitialFetchDone(true));
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching roles...");
            dispatch(fetchRoles())
              .unwrap()
              .then()
              .catch((err) => {
                //console.error("Fetch failed after auth check:", err);
                if (err?.response?.status === 401) {
                  toast.error("Session expired. Please log in again.");
                  dispatch(logout());
                }
              })
              .finally(() => setInitialFetchDone(true));
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    if (roles && Array.isArray(roles) && status !== "loading" && !error) {
      const formattedData = roles.map((role) => ({
        id: role._id || `temp-${Math.random()}`, // Fallback ID
        name: role.name || "N/A",
        permissions: Array.isArray(role.permissions)
          ? role.permissions.join(", ")
          : "None",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [roles, status, error]);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (!data || !Array.isArray(data)) return;
      if (searchVal.trim() === "") {
        setFilteredData(data);
      } else {
        const filtered = data.filter((row) =>
          Object.values(row).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchVal.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    },
    [data]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredData
      .map((row) =>
        columns
          .map(
            (col) =>
              `"${(row[col.field] || "N/A").toString().replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");
    const csvContent = `${headers}\n${csvRows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "roles.csv";
    link.click();
  }, [filteredData]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEditClick = useCallback(
    (role) => {
      //console.log("Edit clicked for role:", role);
      const originalRole = roles.find((r) => r._id === role.id);
      if (originalRole) {
        setEditRoleData(originalRole);
        setDrawerOpen(true);
      } else {
        toast.error("Role not found for editing");
      }
    },
    [roles]
  );

  const handleDeleteClick = useCallback(
    (roleId) => {
      //console.log("Delete clicked for role ID:", roleId);
      const role = roles.find((r) => r._id === roleId);
      if (role) {
        setRoleToDelete(roleId);
        setDeleteDialogOpen(true);
      } else {
        toast.error("Role not found for deletion");
      }
    },
    [roles]
  );

  const handleConfirmDelete = useCallback(() => {
    if (roleToDelete) {
      //console.log("Confirming delete for role:", roleToDelete);
      dispatch(deleteRole(roleToDelete))
        .unwrap()
        .then(() => {
          dispatch(fetchRoles());
          toast.success("Role deleted successfully!", { duration: 5000 });
        })
        .catch((err) => {
          toast.error(
            `Error deleting role: ${err.message || "Unknown error"}`,
            {
              duration: 5000,
            }
          );
          if (err?.response?.status === 401) {
            toast.error("Session expired. Please log in again.");
            dispatch(logout());
          }
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setRoleToDelete(null);
        });
    } else {
      setDeleteDialogOpen(false);
    }
  }, [dispatch, roleToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "permissions", headerName: "Permissions", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        const role = roles.find((r) => r._id === params.row.id);
        return (
          <>
            {hasPermission(user, "update:roles") && (
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleEditClick(params.row)}
                title="Edit Role"
              ></i>
            )}
            {hasPermission(user, "delete:roles") && (
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleDeleteClick(params.row.id)}
                title="Delete Role"
              ></i>
            )}
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
            "& .MuiDataGrid-row": { backgroundColor: "#29221d" },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#1e1611",
              "& .MuiDataGrid-cell": { color: "#bdbabb" },
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
            "@media print": { "& .MuiDataGrid-main": { color: "#000" } },
          },
        },
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">Please log in to view roles.</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {status === "loading" && filteredData.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#fe6c00" }} />
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
              Error:{" "}
              {typeof error === "object" && error.message
                ? error.message
                : error || "Failed to load roles"}
              {error?.status && ` (Status: ${error.status})`}
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
            <Box
              sx={{
                padding: "8px",
                backgroundColor: "#d0d0d0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                "@media print": { display: "none" },
              }}
            >
              <Typography variant="h6" sx={{ color: "#000" }}>
                Roles
              </Typography>
              <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
                />
                <IconButton
                  onClick={handleExport}
                  sx={{ color: "#473b33", "&:hover": { color: "#fec80a" } }}
                  title="Download CSV"
                >
                  <GetAppIcon />
                </IconButton>
                <IconButton
                  onClick={handlePrint}
                  sx={{ color: "#302924", "&:hover": { color: "#fec80a" } }}
                  title="Print"
                >
                  <PrintIcon />
                </IconButton>
                {hasPermission(user, "write:roles") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEditRoleData(null);
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
                    Add New Role
                  </Button>
                )}
              </Box>
            </Box>
            {filteredData.length === 0 && status !== "loading" ? (
              <Typography>No roles available</Typography>
            ) : (
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={filteredData}
                  columns={columns}
                  pageSizeOptions={[10, 20, 50]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  disableSelectionOnClick
                />
              </Box>
            )}
            <AddNewRoleDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditRoleData(null);
              }}
              editMode={!!editRoleData}
              initialData={editRoleData || {}}
              onSaveSuccess={() => dispatch(fetchRoles())} // Refresh roles after save
            />
            <Dialog open={deleteDialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this role?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleConfirmDelete} color="error" autoFocus>
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

export default Role;
