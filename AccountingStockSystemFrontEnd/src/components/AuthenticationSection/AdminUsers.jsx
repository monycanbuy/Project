// // AdminUsers.jsx
// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Tab,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllUsers,
//   checkAuthStatus,
//   deleteUser,
// } from "../../redux/slices/authSlice";
// import { fetchRoles } from "../../redux/slices/roleSlice";
// import AddNewUserDrawer from "../AddDrawerSection/AddNewUserDrawer";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import AdminReports from "./Reports/AdminReports";
// import { Toaster, toast } from "react-hot-toast"; // Re-import toaster

// const AdminUsers = () => {
//   const dispatch = useDispatch();
//   const {
//     users,
//     isLoading: authLoading,
//     error: authError,
//     isAuthenticated,
//   } = useSelector((state) => state.auth);
//   const {
//     list: roles,
//     status: rolesStatus,
//     error: rolesError,
//   } = useSelector((state) => state.roles);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [value, setValue] = useState("0");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Add dialog state
//   const [userToDelete, setUserToDelete] = useState(null); // Track user to delete

//   useEffect(() => {
//     console.log("AdminUsers - Initial fetch...");
//     if (isAuthenticated) {
//       dispatch(fetchAllUsers());
//       dispatch(fetchRoles());
//     } else {
//       dispatch(checkAuthStatus());
//     }
//   }, [dispatch, isAuthenticated]);

//   useEffect(() => {
//     console.log("AdminUsers - State:", { users, roles, authError, rolesError });
//     if (users && Array.isArray(users)) {
//       const formattedData = users.map((user) => [
//         user.fullName || "N/A",
//         user.email || "N/A",
//         user.phoneNumber || "N/A",
//         //user.roles?.[0]?.name || "No Role",
//         user.roles && user.roles.length > 0
//           ? user.roles.map((role) => role.name).join(", ")
//           : "No Role",
//         user.status || "N/A",
//         user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
//         user._id || "N/A",
//         user.verified ?? false,
//         user.isLocked ?? false,
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]);
//     }
//   }, [users]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleEditClick = (userRow) => {
//     if (!userRow || userRow.length < 9) {
//       console.error("Invalid user data:", userRow);
//       return;
//     }
//     const originalUser = users.find((u) => u._id === userRow[6]);
//     if (!originalUser) {
//       console.error("User not found:", userRow[6]);
//       return;
//     }
//     const userData = {
//       _id: userRow[6],
//       fullName: userRow[0],
//       email: userRow[1],
//       phoneNumber: userRow[2],
//       status: originalUser.status || "active",
//       roles: originalUser.roles || [],
//       verified: userRow[7],
//       isLocked: userRow[8],
//       availableRoles: roles,
//     };
//     console.log("Edit Data:", userData);
//     setEditData(userData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (userId) => {
//     setUserToDelete(userId);
//     setDeleteDialogOpen(true); // Open dialog
//   };

//   const handleConfirmDelete = () => {
//     if (userToDelete) {
//       dispatch(deleteUser(userToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("User deleted successfully!", { duration: 5000 });
//           dispatch(fetchAllUsers());
//         })
//         .catch((error) => {
//           toast.error(
//             "Failed to delete user: " + (error.message || "Unknown error"),
//             { duration: 5000 }
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setUserToDelete(null);
//   };

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     { name: "Email", options: { filter: true, sort: false } },
//     { name: "Phone Number", options: { filter: true, sort: false } },
//     { name: "Role", options: { filter: true, sort: true } },
//     {
//       name: "Status",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color:
//                 value === "active"
//                   ? "green"
//                   : value === "suspended"
//                   ? "orange"
//                   : "red",
//             }}
//           >
//             {value.charAt(0).toUpperCase() + value.slice(1)}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "Verified",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color: value ? "green" : "red",
//               backgroundColor: "#fff",
//               fontSize: "0.8rem",
//               borderRadius: "12px",
//               padding: "5px 10px",
//             }}
//           >
//             {value ? "Verified" : "Not Verified"}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Is Locked",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => (
//           <span
//             style={{
//               color: value ? "red" : "green",
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               padding: "10px",
//               fontSize: "0.8rem",
//             }}
//           >
//             {value ? "Locked" : "Unlocked"}
//           </span>
//         ),
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => (
//           <>
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(tableMeta.rowData)}
//             ></i>
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(tableMeta.rowData[6])}
//             ></i>
//           </>
//         ),
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
//       MuiTab: {
//         styleOverrides: {
//           root: {
//             color: "#fff", // Default color when not selected
//             "&.Mui-selected": {
//               color: "#fe6c00", // Color when selected
//             },
//             "&:hover": {
//               color: "#fe6c00", // Color on hover
//             },
//           },
//         },
//       },
//       MuiTabs: {
//         styleOverrides: {
//           indicator: {
//             backgroundColor: "#fe6c00", // Color of the indicator when selected
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
//         Add New User
//       </Button>
//     ),
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Admin Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {authLoading ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "200px",
//               }}
//             >
//               <CircularProgress sx={{ color: "#fe6c00" }} />
//             </Box>
//           ) : authError ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {authError}
//               <Button onClick={() => dispatch(checkAuthStatus())}>Retry</Button>
//             </div>
//           ) : data.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "20px" }}>
//               No users found
//             </div>
//           ) : (
//             <MUIDataTable
//               title="Employee List"
//               data={data}
//               columns={columns}
//               options={options}
//             />
//           )}
//           <AddNewUserDrawer
//             open={drawerOpen}
//             onClose={() => {
//               setDrawerOpen(false);
//               setEditData(null);
//             }}
//             editMode={!!editData}
//             initialData={editData || { availableRoles: roles }}
//           />
//           <Dialog
//             open={deleteDialogOpen}
//             onClose={handleCloseDialog}
//             aria-labelledby="alert-dialog-title"
//             aria-describedby="alert-dialog-description"
//           >
//             <DialogTitle id="alert-dialog-title">
//               {"Confirm Delete"}
//             </DialogTitle>
//             <DialogContent>
//               <DialogContentText id="alert-dialog-description">
//                 Are you sure you want to delete this user?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseDialog} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </TabPanel>
//         <TabPanel value="1">
//           <AdminReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster /> {/* Re-add toaster */}
//     </ThemeProvider>
//   );
// };

// export default AdminUsers;

import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Button,
  CircularProgress,
  Box,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  checkAuthStatus,
  deleteUser,
} from "../../redux/slices/authSlice";
import { fetchRoles } from "../../redux/slices/roleSlice";
import { hasPermission } from "../../utils/authUtils"; // Add this import
import AddNewUserDrawer from "../AddDrawerSection/AddNewUserDrawer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AdminReports from "./Reports/AdminReports";
import { Toaster, toast } from "react-hot-toast";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const {
    users,
    isLoading: authLoading,
    error: authError,
    isAuthenticated,
    user, // Add current user
  } = useSelector((state) => state.auth);
  const {
    list: roles,
    status: rolesStatus,
    error: rolesError,
  } = useSelector((state) => state.roles);
  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [value, setValue] = useState("0");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    console.log("AdminUsers - Initial fetch...");
    if (isAuthenticated) {
      dispatch(fetchAllUsers());
      dispatch(fetchRoles());
    } else {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    console.log("AdminUsers - State:", { users, roles, authError, rolesError });
    if (users && Array.isArray(users)) {
      const formattedData = users.map((user) => [
        user.fullName || "N/A",
        user.email || "N/A",
        user.phoneNumber || "N/A",
        user.roles && user.roles.length > 0
          ? user.roles.map((role) => role.name).join(", ")
          : "No Role",
        user.status || "N/A",
        user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
        user._id || "N/A",
        user.verified ?? false,
        user.isLocked ?? false,
      ]);
      setData(formattedData);
    } else {
      setData([]);
    }
  }, [users]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEditClick = (userRow) => {
    if (!userRow || userRow.length < 9) {
      console.error("Invalid user data:", userRow);
      return;
    }
    const originalUser = users.find((u) => u._id === userRow[6]);
    if (!originalUser) {
      console.error("User not found:", userRow[6]);
      return;
    }
    const userData = {
      _id: userRow[6],
      fullName: userRow[0],
      email: userRow[1],
      phoneNumber: userRow[2],
      status: originalUser.status || "active",
      roles: originalUser.roles || [],
      verified: userRow[7],
      isLocked: userRow[8],
      availableRoles: roles,
    };
    console.log("Edit Data:", userData);
    setEditData(userData);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete))
        .unwrap()
        .then(() => {
          toast.success("User deleted successfully!", { duration: 5000 });
          dispatch(fetchAllUsers());
        })
        .catch((error) => {
          toast.error(
            "Failed to delete user: " + (error.message || "Unknown error"),
            { duration: 5000 }
          );
        });
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const columns = [
    { name: "Name", options: { filter: true, sort: true } },
    { name: "Email", options: { filter: true, sort: false } },
    { name: "Phone Number", options: { filter: true, sort: false } },
    { name: "Role", options: { filter: true, sort: true } },
    {
      name: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <span
            style={{
              color:
                value === "active"
                  ? "green"
                  : value === "suspended"
                  ? "orange"
                  : "red",
            }}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        ),
      },
    },
    {
      name: "Created At",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => new Date(value).toLocaleString(),
      },
    },
    {
      name: "Verified",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <span
            style={{
              color: value ? "green" : "red",
              backgroundColor: "#fff",
              fontSize: "0.8rem",
              borderRadius: "12px",
              padding: "5px 10px",
            }}
          >
            {value ? "Verified" : "Not Verified"}
          </span>
        ),
      },
    },
    {
      name: "Is Locked",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <span
            style={{
              color: value ? "red" : "green",
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "10px",
              fontSize: "0.8rem",
            }}
          >
            {value ? "Locked" : "Unlocked"}
          </span>
        ),
      },
    },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => (
          <>
            {hasPermission(user, "update:users") && (
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleEditClick(tableMeta.rowData)}
              ></i>
            )}
            {hasPermission(user, "delete:users") && (
              <i
                className="bx bx-trash"
                style={{ color: "#fe1e00", cursor: "pointer" }}
                onClick={() => handleDeleteClick(tableMeta.rowData[6])}
              ></i>
            )}
          </>
        ),
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
      MuiTab: {
        styleOverrides: {
          root: {
            color: "#fff",
            "&.Mui-selected": { color: "#fe6c00" },
            "&:hover": { color: "#fe6c00" },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { backgroundColor: "#fe6c00" },
        },
      },
    },
  });

  const options = {
    filterType: "checkbox",
    rowsPerPage: 10,
    customToolbar: () =>
      hasPermission(user, "write:users") ? (
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
            "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
          }}
        >
          Add New User
        </Button>
      ) : null,
  };

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="hall tabs">
            <Tab label="Admin Table" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {authLoading ? (
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
          ) : authError ? (
            <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
              Error: {authError}
              <Button onClick={() => dispatch(checkAuthStatus())}>Retry</Button>
            </div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              No users found
            </div>
          ) : (
            <MUIDataTable
              title="Employee List"
              data={data}
              columns={columns}
              options={options}
            />
          )}
          <AddNewUserDrawer
            open={drawerOpen}
            onClose={() => {
              setDrawerOpen(false);
              setEditData(null);
            }}
            editMode={!!editData}
            initialData={editData || { availableRoles: roles }}
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
                Are you sure you want to delete this user?
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
        </TabPanel>
        <TabPanel value="1">
          <AdminReports />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default AdminUsers;
