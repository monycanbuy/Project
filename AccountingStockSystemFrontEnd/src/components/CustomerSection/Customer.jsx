// import React, { useEffect, useState, useCallback } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import { format } from "date-fns";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCustomers,
//   deleteCustomer,
// } from "../../redux/slices/customerSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewCustomerDrawer from "../AddDrawerSection/AddNewCustomerDrawer";

// const Customer = () => {
//   const dispatch = useDispatch();
//   const { customers, loading, error } = useSelector((state) => state.customers);
//   const { user, sessionExpired } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [customerToDelete, setCustomerToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Fetching customers...");
//     dispatch(fetchCustomers())
//       .unwrap()
//       .catch((err) => {
//         console.error("Fetch customers failed:", err);
//         if (err.status === 401) {
//           console.log("401 detected in Customer component");
//         }
//       });
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Session expired state in Customer:", sessionExpired);
//   }, [sessionExpired]);

//   useEffect(() => {
//     if (customers && Array.isArray(customers)) {
//       const formattedData = customers.map((customer) => ({
//         id: customer._id,
//         name: customer.name || "N/A",
//         email: customer.email || "N/A",
//         phoneNumber: customer.phoneNumber || "N/A",
//         address: customer.address || "N/A",
//         status: customer.status || "N/A",
//         createdBy: customer.createdBy?.fullName || "N/A",
//         createdAt: customer.createdAt
//           ? format(new Date(customer.createdAt), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [customers]);

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
//     link.download = "customers.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (customer) => {
//       const rawCustomer = customers.find((c) => c._id === customer.id);
//       if (rawCustomer) {
//         setEditData(rawCustomer);
//         setDrawerOpen(true);
//       }
//     },
//     [customers]
//   );

//   const handleDeleteClick = useCallback((customerId) => {
//     setCustomerToDelete(customerId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmDelete = useCallback(() => {
//     if (customerToDelete) {
//       dispatch(deleteCustomer(customerToDelete))
//         .then(() => {
//           dispatch(fetchCustomers());
//           toast.success("Customer deleted successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error deleting customer: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setCustomerToDelete(null);
//   }, [dispatch, customerToDelete]);

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setCustomerToDelete(null);
//   };

//   const columns = [
//     { field: "name", headerName: "Name", flex: 2 },
//     { field: "email", headerName: "Email", flex: 3 },
//     { field: "phoneNumber", headerName: "Phone Number", flex: 2 },
//     { field: "address", headerName: "Address", flex: 2 },
//     { field: "status", headerName: "Status", flex: 1 },
//     { field: "createdBy", headerName: "Created By", flex: 2 },
//     { field: "createdAt", headerName: "Created At", flex: 2 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:customer") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(params.row)}
//             ></i>
//           )}
//           {hasPermission(user, "delete:customer") && (
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleDeleteClick(params.row.id)}
//             ></i>
//           )}
//         </>
//       ),
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
//               backgroundColor: "#29221d",
//               color: "#fcfcfc",
//               "& .MuiTablePagination-root": {
//                 color: "#fcfcfc",
//               },
//               "& .MuiIconButton-root": {
//                 color: "#fcfcfc",
//               },
//             },
//             "@media print": {
//               "& .MuiDataGrid-main": {
//                 color: "#000",
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         {error ? (
//           <div>Error: {error}</div>
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
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Customers
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
//                 <IconButton onClick={handleExport} title="Download CSV">
//                   <GetAppIcon />
//                 </IconButton>
//                 <IconButton onClick={handlePrint} title="Print">
//                   <PrintIcon />
//                 </IconButton>
//                 {hasPermission(user, "write:customer") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditData(null);
//                       setDrawerOpen(true);
//                     }}
//                     sx={{ backgroundColor: "#fe6c00" }}
//                   >
//                     Add New Customer
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             {loading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
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
//             <AddNewCustomerDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchCustomers())}
//             />
//             <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//               <DialogTitle>Delete Confirmation</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this customer?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete}>Cancel</Button>
//                 <Button onClick={confirmDelete} color="secondary">
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster />
//           </>
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default Customer;

// import React, { useEffect, useState, useCallback } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   TextField,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import { format } from "date-fns";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCustomers,
//   deleteCustomer,
// } from "../../redux/slices/customerSlice";
// import { checkAuthStatus } from "../../redux/slices/authSlice"; // Import checkAuthStatus
// import { hasPermission } from "../../utils/authUtils";
// import AddNewCustomerDrawer from "../AddDrawerSection/AddNewCustomerDrawer";

// const Customer = () => {
//   const dispatch = useDispatch();
//   const { customers, loading, error } = useSelector((state) => state.customers);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [customerToDelete, setCustomerToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Fetching customers...");
//     dispatch(fetchCustomers())
//       .unwrap()
//       .catch((err) => {
//         console.error("Fetch customers failed:", err);
//         if (err.status === 401) {
//           console.log("401 detected in Customer component");
//         }
//       });
//   }, [dispatch]);

//   useEffect(() => {
//     if (customers && Array.isArray(customers)) {
//       const formattedData = customers.map((customer) => ({
//         id: customer._id,
//         name: customer.name || "N/A",
//         email: customer.email || "N/A",
//         phoneNumber: customer.phoneNumber || "N/A",
//         address: customer.address || "N/A",
//         status: customer.status || "N/A",
//         createdBy: customer.createdBy?.fullName || "N/A",
//         createdAt: customer.createdAt
//           ? format(new Date(customer.createdAt), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [customers]);

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
//     link.download = "customers.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (customer) => {
//       const rawCustomer = customers.find((c) => c._id === customer.id);
//       if (rawCustomer) {
//         setEditData(rawCustomer);
//         setDrawerOpen(true);
//       }
//     },
//     [customers]
//   );

//   const handleDeleteClick = useCallback((customerId) => {
//     setCustomerToDelete(customerId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmDelete = useCallback(() => {
//     if (customerToDelete) {
//       dispatch(deleteCustomer(customerToDelete))
//         .then(() => {
//           dispatch(fetchCustomers());
//           toast.success("Customer deleted successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error deleting customer: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setCustomerToDelete(null);
//   }, [dispatch, customerToDelete]);

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setCustomerToDelete(null);
//   };

//   const handleRetry = () => {
//     dispatch(checkAuthStatus()); // Trigger auth check on retry
//   };

//   const columns = [
//     { field: "name", headerName: "Name", flex: 2 },
//     { field: "email", headerName: "Email", flex: 3 },
//     { field: "phoneNumber", headerName: "Phone Number", flex: 2 },
//     { field: "address", headerName: "Address", flex: 2 },
//     { field: "status", headerName: "Status", flex: 1 },
//     { field: "createdBy", headerName: "Created By", flex: 2 },
//     { field: "createdAt", headerName: "Created At", flex: 2 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:customer") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(params.row)}
//             ></i>
//           )}
//           {hasPermission(user, "delete:customer") && (
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleDeleteClick(params.row.id)}
//             ></i>
//           )}
//         </>
//       ),
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
//               backgroundColor: "#29221d",
//               color: "#fcfcfc",
//               "& .MuiTablePagination-root": {
//                 color: "#fcfcfc",
//               },
//               "& .MuiIconButton-root": {
//                 color: "#fcfcfc",
//               },
//             },
//             "@media print": {
//               "& .MuiDataGrid-main": {
//                 color: "#000",
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         {error ? (
//           <Box sx={{ color: "red", textAlign: "center", padding: "20px" }}>
//             <Typography>Error: {error}</Typography>
//             <Button onClick={handleRetry} sx={{ mt: 2 }}>
//               Retry
//             </Button>
//           </Box>
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
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Customers
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
//                 <IconButton onClick={handleExport} title="Download CSV">
//                   <GetAppIcon />
//                 </IconButton>
//                 <IconButton onClick={handlePrint} title="Print">
//                   <PrintIcon />
//                 </IconButton>
//                 {hasPermission(user, "write:customer") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditData(null);
//                       setDrawerOpen(true);
//                     }}
//                     sx={{ backgroundColor: "#fe6c00" }}
//                   >
//                     Add New Customer
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             {loading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
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
//             <AddNewCustomerDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchCustomers())}
//             />
//             <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//               <DialogTitle>Delete Confirmation</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this customer?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete}>Cancel</Button>
//                 <Button onClick={confirmDelete} color="secondary">
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster />
//           </>
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default Customer;

import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Toaster, toast } from "react-hot-toast";
import {
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  deleteCustomer,
} from "../../redux/slices/customerSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice"; // For Retry
import { hasPermission } from "../../utils/authUtils";
import AddNewCustomerDrawer from "../AddDrawerSection/AddNewCustomerDrawer";

const Customer = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    //console.log("Fetching customers...");
    dispatch(fetchCustomers())
      .unwrap()
      .catch((err) => {
        console.error("Fetch customers failed:", err);
        if (err.status === 401) {
          //console.log("401 detected in Customer component");
        }
      });
  }, [dispatch]);

  useEffect(() => {
    if (customers && Array.isArray(customers)) {
      const formattedData = customers.map((customer) => ({
        id: customer._id,
        name: customer.name || "N/A",
        email: customer.email || "N/A",
        phoneNumber: customer.phoneNumber || "N/A",
        address: customer.address || "N/A",
        status: customer.status || "N/A",
        createdBy: customer.createdBy?.fullName || "N/A",
        createdAt: customer.createdAt
          ? format(new Date(customer.createdAt), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [customers]);

  const handleSearch = (searchVal) => {
    setSearchText(searchVal);
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
  };

  const handleExport = () => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredData
      .map((row) =>
        columns
          .map(
            (col) =>
              `"${(row[col.field] || "").toString().replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");
    const csvContent = `${headers}\n${csvRows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customers.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (customer) => {
      const rawCustomer = customers.find((c) => c._id === customer.id);
      if (rawCustomer) {
        setEditData(rawCustomer);
        setDrawerOpen(true);
      }
    },
    [customers]
  );

  const handleDeleteClick = useCallback((customerId) => {
    setCustomerToDelete(customerId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (customerToDelete) {
      dispatch(deleteCustomer(customerToDelete))
        .then(() => {
          dispatch(fetchCustomers());
          toast.success("Customer deleted successfully!");
        })
        .catch((error) => {
          toast.error(`Error deleting customer: ${error.message}`);
        });
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  }, [dispatch, customerToDelete]);

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleRetry = () => {
    dispatch(checkAuthStatus()); // Trigger auth check on retry
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 2 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 2 },
    { field: "address", headerName: "Address", flex: 2 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "createdBy", headerName: "Created By", flex: 2 },
    { field: "createdAt", headerName: "Created At", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:customer") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleEditClick(params.row)}
            ></i>
          )}
          {hasPermission(user, "delete:customer") && (
            <i
              className="bx bx-trash"
              style={{
                color: "#fe1e00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleDeleteClick(params.row.id)}
            ></i>
          )}
        </>
      ),
    },
  ];

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": {
              backgroundColor: "#f0f0f0",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiDataGrid-cell": {
                  color: "#bdbabb",
                },
              },
            },
            "& .MuiDataGrid-cell": {
              color: "#fff",
              fontSize: "18px",
            },
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
              "& .MuiTablePagination-root": {
                color: "#fcfcfc",
              },
              "& .MuiIconButton-root": {
                color: "#fcfcfc",
              },
            },
            "@media print": {
              "& .MuiDataGrid-main": {
                color: "#000",
              },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", minHeight: "100vh", position: "relative" }}>
        {error ? (
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
              zIndex: 1300, // Above most content
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#fe1e00", mb: 2, fontWeight: "bold" }}
            >
              Error: {error}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{
                backgroundColor: "#fe6c00",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#fec80a",
                  color: "#000",
                },
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
              }}
            >
              <Typography variant="h6" sx={{ color: "#000" }}>
                Customers
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
                <IconButton onClick={handleExport} title="Download CSV">
                  <GetAppIcon />
                </IconButton>
                <IconButton onClick={handlePrint} title="Print">
                  <PrintIcon />
                </IconButton>
                {hasPermission(user, "write:customer") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEditData(null);
                      setDrawerOpen(true);
                    }}
                    sx={{ backgroundColor: "#fe6c00" }}
                  >
                    Add New Customer
                  </Button>
                )}
              </Box>
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#fe6c00" }} />
              </Box>
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
            <AddNewCustomerDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => dispatch(fetchCustomers())}
            />
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this customer?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelDelete}>Cancel</Button>
                <Button onClick={confirmDelete} color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            <Toaster />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Customer;
