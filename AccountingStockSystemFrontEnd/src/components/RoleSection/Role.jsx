// // Role.jsx
// import React, { useEffect, useState, useCallback } from "react";
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
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editRoleData, setEditRoleData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState(null);

//   useEffect(() => {
//     console.log("useEffect for rolesStatus:", rolesStatus);
//     if (rolesStatus === "idle") {
//       dispatch(fetchRoles());
//     }
//   }, [dispatch, rolesStatus]);

//   useEffect(() => {
//     if (roles && Array.isArray(roles)) {
//       const formattedData = roles.map((role) => [
//         role.name || "N/A",
//         role.permissions.join(", ") || "None", // Display permissions
//         role._id || "N/A",
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]);
//     }
//   }, [roles]);

//   const handleEditClick = useCallback(
//     (index) => {
//       const role = roles[index];
//       if (!role) {
//         console.error("Invalid role data at index:", index);
//         return;
//       }
//       setEditRoleData(role);
//       setDrawerOpen(true);
//     },
//     [roles, setEditRoleData, setDrawerOpen]
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
//   }, [dispatch, roleToDelete, setDeleteDialogOpen, setRoleToDelete]);

//   const handleCloseDialog = useCallback(() => {
//     setDeleteDialogOpen(false);
//     setRoleToDelete(null);
//   }, [setDeleteDialogOpen, setRoleToDelete]);

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     { name: "Permissions", options: { filter: true, sort: false } }, // New column
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => {
//           const role = roles[tableMeta.rowIndex];
//           return (
//             <>
//               {hasPermission(user, "update:roles") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(tableMeta.rowIndex)}
//                 ></i>
//               )}

//               {hasPermission(user, "delete:roles") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleDeleteClick(role._id)}
//                 ></i>
//               )}
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
//     customToolbar: () =>
//       hasPermission(user, "write:roles") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={() => {
//             setEditRoleData(null);
//             setDrawerOpen(true);
//           }}
//           sx={{
//             backgroundColor: "#fe6c00",
//             color: "#fff",
//             "&:hover": {
//               backgroundColor: "#fec80a",
//               color: "#bdbabb",
//             },
//           }}
//         >
//           Add New Role
//         </Button>
//       ) : null,
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
//           <div>Error: {error.message || "An error occurred."}</div>
//         ) : (
//           <>
//             <MUIDataTable
//               title={"Roles"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
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
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Role;

// Role.jsx
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
} from "@mui/material";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, deleteRole } from "../../redux/slices/roleSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewRoleDrawer from "../AddDrawerSection/AddNewRoleDrawer";

const Role = () => {
  const dispatch = useDispatch();
  const {
    list: roles = [],
    status: rolesStatus,
    isLoading = false,
    error,
  } = useSelector((state) => state.roles || {});
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRoleData, setEditRoleData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => {
    console.log("useEffect for rolesStatus:", rolesStatus);
    if (rolesStatus === "idle") {
      dispatch(fetchRoles());
    }
  }, [dispatch, rolesStatus]);

  useEffect(() => {
    if (roles && Array.isArray(roles)) {
      const formattedData = roles.map((role) => ({
        id: role._id || "N/A",
        name: role.name || "N/A",
        permissions: role.permissions.join(", ") || "None", // Display permissions
      }));
      setData(formattedData);
    } else {
      setData([]);
    }
  }, [roles]);

  const handleEditClick = useCallback(
    (role) => {
      if (!role) {
        console.error("Invalid role data:", role);
        return;
      }
      setEditRoleData(role);
      setDrawerOpen(true);
    },
    [setEditRoleData, setDrawerOpen]
  );

  const handleDeleteClick = useCallback(
    (roleId) => {
      setRoleToDelete(roleId);
      setDeleteDialogOpen(true);
    },
    [setRoleToDelete, setDeleteDialogOpen]
  );

  const handleConfirmDelete = useCallback(() => {
    if (roleToDelete) {
      dispatch(deleteRole(roleToDelete))
        .then(() => {
          dispatch(fetchRoles());
          toast.success("Role deleted successfully!", { duration: 5000 });
        })
        .catch((error) => {
          toast.error(
            "Error deleting role: " +
              (error.response?.data?.message || error.message)
          );
        });
    }
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  }, [dispatch, roleToDelete, setDeleteDialogOpen, setRoleToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  }, [setDeleteDialogOpen, setRoleToDelete]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "permissions", headerName: "Permissions", flex: 1 }, // New column
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
                onClick={() => handleEditClick(role)}
              ></i>
            )}

            {hasPermission(user, "delete:roles") && (
              <i
                className="bx bx-trash"
                style={{ color: "#fe1e00", cursor: "pointer" }}
                onClick={() => handleDeleteClick(role._id)}
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
      name: (
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
          <div>Error: {error.message || "An error occurred."}</div>
        ) : (
          <>
            {isLoading ? (
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
                  components={{
                    Toolbar: () =>
                      hasPermission(user, "write:roles") ? (
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
                      ) : null,
                  }}
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
                  Are you sure you want to delete this role?
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

export default Role;
