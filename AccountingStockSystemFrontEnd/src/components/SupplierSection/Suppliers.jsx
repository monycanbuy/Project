// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
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
//   fetchSuppliers,
//   deleteSupplier,
// } from "../../redux/slices/suppliersSlice"; // Adjust the path as needed
// import { hasPermission } from "../../utils/authUtils";
// import AddNewSuppliersDrawer from "../AddDrawerSection/AddNewSuppliersDrawer";

// const Suppliers = () => {
//   const dispatch = useDispatch();
//   const { suppliers, status, error } = useSelector((state) => state.suppliers);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   useEffect(() => {
//     dispatch(fetchSuppliers());
//   }, [dispatch]);

//   useEffect(() => {
//     if (suppliers && Array.isArray(suppliers) && suppliers.length > 0) {
//       const formattedData = suppliers.map((supplier) => [
//         supplier.contactPerson || "N/A",
//         supplier.contactPhone || "N/A",
//         supplier.contactEmail || "N/A",
//         supplier.address || "N/A",
//         supplier.staffInvolved ? supplier.staffInvolved.fullName : "N/A",
//         new Date(supplier.createdAt).toLocaleString() || "N/A",
//         supplier._id || "N/A",
//       ]);
//       setData(formattedData);
//     }
//   }, [suppliers]);

//   const handleEditClick = (supplier) => {
//     if (!supplier || supplier.length < 7) {
//       console.error("Invalid supplier data:", supplier);
//       return;
//     }
//     const supplierData = {
//       _id: supplier[6],
//       contactPerson: supplier[0],
//       contactPhone: supplier[1],
//       contactEmail: supplier[2],
//       address: supplier[3],
//       staffInvolved: { _id: supplier[4]._id, fullName: supplier[4].fullName }, // Assuming this structure
//       createdAt: supplier[5],
//     };
//     setEditData(supplierData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     dispatch(deleteSupplier(deleteId))
//       .then(() => {
//         setDeleteDialogOpen(false);
//         setDeleteId(null);
//         setData((prevData) =>
//           prevData.filter((supplier) => supplier[5] !== deleteId)
//         );
//       })
//       .catch((error) => {
//         console.error("Error deleting supplier:", error);
//       });
//   };

//   const columns = [
//     { name: "Contact Person", options: { filter: true, sort: true } },
//     { name: "Contact Phone", options: { filter: true, sort: true } },
//     { name: "Contact Email", options: { filter: true, sort: true } },
//     { name: "Address", options: { filter: true, sort: true } },
//     { name: "Created By", options: { filter: true, sort: true } },
//     { name: "Created At", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const supplier = tableMeta.rowData;
//           return (
//             <>
//               {hasPermission(user, "update:suppliers") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(supplier)}
//                 ></i>
//               )}
//               {hasPermission(user, "delete:suppliers") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleDeleteClick(supplier[6])}
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
//     customToolbar: () =>
//       hasPermission(user, "write:suppliers") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={() => {
//             setEditData(null);
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
//           Add New Supplier
//         </Button>
//       ) : null,
//   };
//   //   customToolbar: () => (
//   //     <Button
//   //       variant="contained"
//   //       size="small"
//   //       onClick={() => {
//   //         setEditData(null);
//   //         setDrawerOpen(true);
//   //       }}
//   //       sx={{
//   //         backgroundColor: "#fe6c00",
//   //         color: "#fff",
//   //         "&:hover": {
//   //           backgroundColor: "#fec80a",
//   //           color: "#bdbabb",
//   //         },
//   //       }}
//   //     >
//   //       Add New Supplier
//   //     </Button>
//   //   ),
//   // };

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
//               title={"Suppliers"}
//               data={status === "loading" ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewSuppliersDrawer
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
//               onClose={() => setDeleteDialogOpen(false)}
//             >
//               <DialogTitle>Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this supplier?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button
//                   onClick={() => setDeleteDialogOpen(false)}
//                   color="primary"
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmDelete} color="primary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default Suppliers;

// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
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
//   fetchSuppliers,
//   deleteSupplier,
// } from "../../redux/slices/suppliersSlice"; // Adjust the path as needed
// import { hasPermission } from "../../utils/authUtils";
// import AddNewSuppliersDrawer from "../AddDrawerSection/AddNewSuppliersDrawer";

// const Suppliers = () => {
//   const dispatch = useDispatch();
//   const { suppliers, status, error } = useSelector((state) => state.suppliers);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   useEffect(() => {
//     dispatch(fetchSuppliers());
//   }, [dispatch]);

//   useEffect(() => {
//     if (suppliers && Array.isArray(suppliers) && suppliers.length > 0) {
//       const formattedData = suppliers.map((supplier) => ({
//         id: supplier._id || "N/A",
//         contactPerson: supplier.contactPerson || "N/A",
//         contactPhone: supplier.contactPhone || "N/A",
//         contactEmail: supplier.contactEmail || "N/A",
//         address: supplier.address || "N/A",
//         staffInvolved: supplier.staffInvolved
//           ? supplier.staffInvolved.fullName
//           : "N/A",
//         createdAt: new Date(supplier.createdAt).toLocaleString() || "N/A",
//       }));
//       setData(formattedData);
//     }
//   }, [suppliers]);

//   const handleEditClick = (supplier) => {
//     if (!supplier) {
//       console.error("Invalid supplier data:", supplier);
//       return;
//     }
//     setEditData(supplier);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     dispatch(deleteSupplier(deleteId))
//       .then(() => {
//         setDeleteDialogOpen(false);
//         setDeleteId(null);
//         dispatch(fetchSuppliers());
//       })
//       .catch((error) => {
//         console.error("Error deleting supplier:", error);
//       });
//   };

//   const columns = [
//     { field: "contactPerson", headerName: "Contact Person", flex: 1 },
//     { field: "contactPhone", headerName: "Contact Phone", flex: 1 },
//     { field: "contactEmail", headerName: "Contact Email", flex: 1 },
//     { field: "address", headerName: "Address", flex: 1 },
//     { field: "staffInvolved", headerName: "Created By", flex: 1 },
//     { field: "createdAt", headerName: "Created At", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:suppliers") && (
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
//           {hasPermission(user, "delete:suppliers") && (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
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
//             "& .MuiDataGrid-toolbarContainer": {
//               backgroundColor: "#d0d0d0",
//               "& .MuiButton-root": {
//                 color: "#3f51b5",
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
//       contactPerson: (
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
//           <div>Error: {error.message || "An error occurred."}</div>
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
//                   components={{
//                     Toolbar: () =>
//                       hasPermission(user, "write:suppliers") ? (
//                         <Button
//                           variant="contained"
//                           size="small"
//                           onClick={() => {
//                             setEditData(null);
//                             setDrawerOpen(true);
//                           }}
//                           sx={{
//                             backgroundColor: "#fe6c00",
//                             color: "#fff",
//                             "&:hover": {
//                               backgroundColor: "#fec80a",
//                               color: "#bdbabb",
//                             },
//                           }}
//                         >
//                           Add New Supplier
//                         </Button>
//                       ) : null,
//                   }}
//                 />
//               </Box>
//             )}
//             <AddNewSuppliersDrawer
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
//               onClose={() => setDeleteDialogOpen(false)}
//             >
//               <DialogTitle>Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this supplier?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button
//                   onClick={() => setDeleteDialogOpen(false)}
//                   color="primary"
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmDelete} color="primary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default Suppliers;

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
// import {
//   fetchSuppliers,
//   deleteSupplier,
// } from "../../redux/slices/suppliersSlice"; // Adjust the path as needed
// import { hasPermission } from "../../utils/authUtils";
// import AddNewSuppliersDrawer from "../AddDrawerSection/AddNewSuppliersDrawer";

// const Suppliers = () => {
//   const dispatch = useDispatch();
//   const { suppliers, status, error } = useSelector((state) => state.suppliers);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   useEffect(() => {
//     dispatch(fetchSuppliers());
//   }, [dispatch]);

//   useEffect(() => {
//     if (suppliers && Array.isArray(suppliers) && suppliers.length > 0) {
//       const formattedData = suppliers.map((supplier) => ({
//         id: supplier._id || "N/A",
//         contactPerson: supplier.contactPerson || "N/A",
//         contactPhone: supplier.contactPhone || "N/A",
//         contactEmail: supplier.contactEmail || "N/A",
//         address: supplier.address || "N/A",
//         staffInvolved: supplier.staffInvolved
//           ? supplier.staffInvolved.fullName
//           : "N/A",
//         createdAt: new Date(supplier.createdAt).toLocaleString() || "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData); // Initialize filtered data
//     }
//   }, [suppliers]);

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
//     link.download = "suppliers.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (supplier) => {
//       if (!supplier) {
//         console.error("Invalid supplier data:", supplier);
//         return;
//       }
//       setEditData(supplier);
//       setDrawerOpen(true);
//     },
//     [setEditData, setDrawerOpen]
//   );

//   const handleDeleteClick = useCallback(
//     (id) => {
//       setDeleteId(id);
//       setDeleteDialogOpen(true);
//     },
//     [setDeleteId, setDeleteDialogOpen]
//   );

//   const confirmDelete = useCallback(() => {
//     if (deleteId) {
//       dispatch(deleteSupplier(deleteId))
//         .then(() => {
//           dispatch(fetchSuppliers());
//           toast.success("Supplier deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting supplier: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setDeleteId(null);
//   }, [dispatch, deleteId, setDeleteDialogOpen, setDeleteId]);

//   const handleCloseDialog = useCallback(() => {
//     setDeleteDialogOpen(false);
//     setDeleteId(null);
//   }, [setDeleteDialogOpen, setDeleteId]);

//   const columns = [
//     { field: "contactPerson", headerName: "Contact Person", flex: 1 },
//     { field: "contactPhone", headerName: "Contact Phone", flex: 1 },
//     { field: "contactEmail", headerName: "Contact Email", flex: 1 },
//     { field: "address", headerName: "Address", flex: 1 },
//     { field: "staffInvolved", headerName: "Created By", flex: 1 },
//     { field: "createdAt", headerName: "Created At", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:suppliers") && (
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
//           {hasPermission(user, "delete:suppliers") && (
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
//       contactPerson: (
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
//                   display: "none", // Hide toolbar when printing
//                 },
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Suppliers
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
//                 {hasPermission(user, "write:suppliers") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditData(null);
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
//                     Add New Supplier
//                   </Button>
//                 )}
//               </Box>
//             </Box>
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
//             <AddNewSuppliersDrawer
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
//               <DialogTitle id="alert-dialog-title">
//                 {"Confirm Delete"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this supplier?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleCloseDialog} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmDelete} color="primary" autoFocus>
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

// export default Suppliers;

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
import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
import PrintIcon from "@mui/icons-material/Print"; // Print icon
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  deleteSupplier,
} from "../../redux/slices/suppliersSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewSuppliersDrawer from "../AddDrawerSection/AddNewSuppliersDrawer";

const Suppliers = () => {
  const dispatch = useDispatch();
  const { suppliers, status, error } = useSelector((state) => state.suppliers);
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  useEffect(() => {
    if (suppliers && Array.isArray(suppliers) && suppliers.length > 0) {
      const formattedData = suppliers.map((supplier) => ({
        id: supplier._id || "N/A",
        contactPerson: supplier.contactPerson || "N/A",
        contactPhone: supplier.contactPhone || "N/A",
        contactEmail: supplier.contactEmail || "N/A",
        address: supplier.address || "N/A",
        staffInvolved: supplier.staffInvolved
          ? supplier.staffInvolved.fullName
          : "N/A",
        createdAt: new Date(supplier.createdAt).toLocaleString() || "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    }
  }, [suppliers]);

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
    link.download = "suppliers.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (supplier) => {
      if (!supplier) {
        console.error("Invalid supplier data:", supplier);
        return;
      }
      // Find the raw supplier data using the formatted row's id
      const rawSupplier = suppliers.find((s) => s._id === supplier.id);
      if (!rawSupplier) {
        console.error("Raw supplier not found for id:", supplier.id);
        return;
      }
      setEditData(rawSupplier);
      setDrawerOpen(true);
    },
    [suppliers, setEditData, setDrawerOpen]
  );

  const handleDeleteClick = useCallback(
    (id) => {
      setDeleteId(id);
      setDeleteDialogOpen(true);
    },
    [setDeleteId, setDeleteDialogOpen]
  );

  const confirmDelete = useCallback(() => {
    if (deleteId) {
      dispatch(deleteSupplier(deleteId))
        .then(() => {
          dispatch(fetchSuppliers());
          toast.success("Supplier deleted successfully!", { duration: 5000 });
        })
        .catch((error) => {
          toast.error(
            "Error deleting supplier: " +
              (error.response?.data?.message || error.message)
          );
        });
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  }, [dispatch, deleteId, setDeleteDialogOpen, setDeleteId]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  }, [setDeleteDialogOpen, setDeleteId]);

  const columns = [
    { field: "contactPerson", headerName: "Contact Person", flex: 1 },
    { field: "contactPhone", headerName: "Contact Phone", flex: 1 },
    { field: "contactEmail", headerName: "Contact Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "staffInvolved", headerName: "Created By", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:suppliers") && (
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
          {hasPermission(user, "delete:suppliers") && (
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

  const loadingData = [
    {
      id: "loading",
      contactPerson: (
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
      <Box sx={{ width: "100%" }}>
        {error ? (
          <div>Error: {error.message || "An error occurred."}</div>
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
                "@media print": {
                  display: "none",
                },
              }}
            >
              <Typography variant="h6" sx={{ color: "#000" }}>
                Suppliers
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
                  sx={{
                    color: "#473b33",
                    "&:hover": { color: "#fec80a" },
                  }}
                  title="Download CSV"
                >
                  <GetAppIcon />
                </IconButton>
                <IconButton
                  onClick={handlePrint}
                  sx={{
                    color: "#302924",
                    "&:hover": { color: "#fec80a" },
                  }}
                  title="Print"
                >
                  <PrintIcon />
                </IconButton>
                {hasPermission(user, "write:suppliers") && (
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
                    Add New Supplier
                  </Button>
                )}
              </Box>
            </Box>
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
            <AddNewSuppliersDrawer
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
              <DialogTitle id="alert-dialog-title">
                {"Confirm Delete"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this supplier?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} color="primary" autoFocus>
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

export default Suppliers;
