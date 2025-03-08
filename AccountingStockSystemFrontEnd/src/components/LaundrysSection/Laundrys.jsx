// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Button, CircularProgress, Box } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundryServices } from "../../redux/slices/laundryServicesSlice"; // Adjust the path as needed
// import AddNewLaundryServiceDrawer from "../AddDrawerSection/AddNewLaundryServiceDrawer"; // Assuming you have this component

// const Laundrys = () => {
//   const dispatch = useDispatch();
//   const { services, isLoading, error } = useSelector(
//     (state) => state.laundryServices
//   );
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     console.log("Fetching laundry services...");
//     dispatch(fetchLaundryServices());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Services from state:", services);
//     if (services && Array.isArray(services) && services.length > 0) {
//       const formattedData = services.map((service) => [
//         service.serviceType || "N/A",
//         service.price !== undefined
//           ? `₦${parseFloat(service.price).toFixed(2)}`
//           : "N/A",
//         new Date(service.createdAt).toLocaleString() || "N/A",
//         service._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No laundry services data available or data is not in expected format"
//       );
//     }
//   }, [services]);

//   const handleEditClick = (service) => {
//     if (!service || service.length < 4) {
//       console.error("Invalid service data:", service);
//       return;
//     }
//     const serviceData = {
//       _id: service[3],
//       serviceType: service[0],
//       price: service[1],
//     };
//     setEditData(serviceData);
//     setDrawerOpen(true);
//   };

//   const columns = [
//     { name: "Service Type", options: { filter: true, sort: true } },
//     { name: "Price", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const service = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(service)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 // Add onClick for deleting - Note: Implement this functionality
//               ></i>
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
//           "&:hover": {
//             backgroundColor: "#fec80a",
//             color: "#bdbabb",
//           },
//         }}
//       >
//         Add New Service
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
//               title={"Laundry Services"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewLaundryServiceDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default Laundrys;

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
//   fetchLaundryServices,
//   deleteLaundryService,
// } from "../../redux/slices/laundryServicesSlice"; // Adjust path
// import { Toaster, toast } from "react-hot-toast";
// import AddNewLaundryServiceDrawer from "../AddDrawerSection/AddNewLaundryServiceDrawer";

// const Laundrys = () => {
//   const dispatch = useDispatch();
//   const { services, status, error } = useSelector(
//     (state) => state.laundryServices
//   );
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [serviceToDelete, setServiceToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Fetching laundry services...");
//     dispatch(fetchLaundryServices());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("LaundryServices - State:", { services, status, error });
//     if (services && Array.isArray(services) && services.length > 0) {
//       const formattedData = services.map((service) => [
//         service.serviceType || "N/A",
//         service.price !== undefined
//           ? `₦${parseFloat(service.price).toFixed(2)}`
//           : "N/A",
//         service.createdAt
//           ? new Date(service.createdAt).toLocaleString()
//           : "N/A",
//         service._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       setData([]);
//       console.log(
//         "No laundry services data available or data is not in expected format"
//       );
//     }
//   }, [services]);

//   const handleEditClick = (serviceId) => {
//     const service = services.find((s) => s._id === serviceId);
//     if (service) {
//       setEditData(service);
//       setDrawerOpen(true);
//     } else {
//       console.error("Service not found for editing:", serviceId);
//     }
//   };

//   const handleDeleteClick = (serviceId) => {
//     setServiceToDelete(serviceId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (serviceToDelete) {
//       dispatch(deleteLaundryService(serviceToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service deleted successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchLaundryServices()); // Refresh after delete
//         })
//         .catch((err) => {
//           console.error("Delete error:", err);
//           toast.error(`Error deleting service: ${err || "Unknown error"}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setServiceToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setServiceToDelete(null);
//   };

//   const columns = [
//     { name: "Service Type", options: { filter: true, sort: true } },
//     { name: "Price", options: { filter: true, sort: true } },
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
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const serviceId = tableMeta.rowData[3];
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(serviceId)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(serviceId)}
//               ></i>
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
//         Add New Service
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
//             Error: {error || "An error occurred"}
//           </div>
//         ) : (
//           <>
//             <MUIDataTable
//               title="Laundry Services"
//               data={status === "loading" ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewLaundryServiceDrawer
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
//               aria-labelledby="delete-dialog-title"
//               aria-describedby="delete-dialog-description"
//             >
//               <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="delete-dialog-description">
//                   Are you sure you want to delete this laundry service?
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

// export default Laundrys;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Button, CircularProgress, Box } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLaundryServices } from "../../redux/slices/laundryServicesSlice";
// import AddNewLaundryServiceDrawer from "../AddDrawerSection/AddNewLaundryServiceDrawer";

// const Laundrys = () => {
//   const dispatch = useDispatch();
//   const { services, status, error } = useSelector(
//     (state) => state.laundryServices
//   );
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     console.log("Fetching laundry services...");
//     dispatch(fetchLaundryServices());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Services from state:", services);
//     if (services && Array.isArray(services) && services.length > 0) {
//       const formattedData = services.map((service) => [
//         service.serviceType || "N/A",
//         service.price !== undefined
//           ? `₦${parseFloat(service.price).toFixed(2)}`
//           : "N/A",
//         service.createdAt
//           ? new Date(service.createdAt).toLocaleString()
//           : "N/A",
//         service._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No laundry services data available or data is not in expected format"
//       );
//       setData([]);
//     }
//   }, [services]);

//   const handleEditClick = (service) => {
//     if (!service || service.length < 4) {
//       console.error("Invalid service data:", service);
//       return;
//     }
//     const priceString = service[1]; // "₦22.00"
//     const price = parseFloat(priceString.replace("₦", "")); // Convert to number (22.00)
//     const serviceData = {
//       _id: service[3],
//       serviceType: service[0],
//       price: price,
//     };
//     console.log("Edit Data:", serviceData);
//     setEditData(serviceData);
//     setDrawerOpen(true);
//   };

//   const columns = [
//     { name: "Service Type", options: { filter: true, sort: true } },
//     { name: "Price", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           const date = new Date(value);
//           return date.toString() === "Invalid Date"
//             ? "N/A"
//             : date.toLocaleString();
//         },
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const service = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(service)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//               ></i>
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
//         Add New Service
//       </Button>
//     ),
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {status === "failed" ? (
//           <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//             Error: {error || "An error occurred"}
//           </div>
//         ) : (
//           <MUIDataTable
//             title="Laundry Services"
//             data={
//               status === "loading"
//                 ? [
//                     [
//                       <CircularProgress
//                         key="loading"
//                         sx={{ color: "#fe6c00" }}
//                       />,
//                     ],
//                   ]
//                 : data
//             }
//             columns={columns}
//             options={options}
//           />
//         )}
//         <AddNewLaundryServiceDrawer
//           open={drawerOpen}
//           onClose={() => {
//             setDrawerOpen(false);
//             setEditData(null);
//           }}
//           editMode={!!editData}
//           initialData={editData || {}}
//         />
//       </div>
//     </ThemeProvider>
//   );
// };

// export default Laundrys;

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
//   fetchLaundryServices,
//   deleteLaundryService,
// } from "../../redux/slices/laundryServicesSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewLaundryServiceDrawer from "../AddDrawerSection/AddNewLaundryServiceDrawer";
// import { Toaster, toast } from "react-hot-toast";

// const Laundrys = () => {
//   const dispatch = useDispatch();
//   const { services, status, error } = useSelector(
//     (state) => state.laundryServices
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [serviceToDelete, setServiceToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Fetching laundry services...");
//     dispatch(fetchLaundryServices());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Services from state:", services);
//     if (services && Array.isArray(services) && services.length > 0) {
//       const formattedData = services.map((service) => {
//         const rawDate = service.createdAt;
//         console.log("Raw createdAt for service:", service._id, rawDate); // Debug raw date
//         return [
//           service.serviceType || "N/A",
//           service.price !== undefined
//             ? `₦${parseFloat(service.price).toFixed(2)}`
//             : "N/A",
//           rawDate,
//           service._id || "N/A",
//         ];
//       });
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No laundry services data available or data is not in expected format"
//       );
//       setData([]);
//     }
//   }, [services]);

//   const handleEditClick = (service) => {
//     if (!service || service.length < 4) {
//       console.error("Invalid service data:", service);
//       return;
//     }
//     const priceString = service[1]; // "₦22.00"
//     const price = parseFloat(priceString.replace("₦", ""));
//     const serviceData = {
//       _id: service[3],
//       serviceType: service[0],
//       price: price,
//     };
//     console.log("Edit Data:", serviceData);
//     setEditData(serviceData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (serviceId) => {
//     setServiceToDelete(serviceId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (serviceToDelete) {
//       dispatch(deleteLaundryService(serviceToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service deleted successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchLaundryServices());
//           // No need to fetch again; reducer updates state
//         })
//         .catch((error) => {
//           toast.error("Error deleting service: " + (error || "Unknown error"), {
//             duration: 7000,
//           });
//         })
//         .finally(() => {
//           setDeleteDialogOpen(false);
//           setServiceToDelete(null);
//         });
//     }
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setServiceToDelete(null);
//   };

//   const columns = [
//     { name: "Service Type", options: { filter: true, sort: true } },
//     { name: "Price", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           console.log("customBodyRender value:", value); // Debug value passed
//           const date = new Date(value);
//           return date.toString() === "Invalid Date"
//             ? "N/A"
//             : date.toLocaleString();
//         },
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const service = tableMeta.rowData;
//           const serviceId = service[3]; // _id
//           return (
//             <>
//               {hasPermission(user, "update:laundryService") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(service)}
//                 ></i>
//               )}
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(service)}
//               ></i>
//               {hasPermission(user, "delete:laundryService") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleDeleteClick(serviceId)}
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
//       hasPermission(user, "write:laundryService") ? (
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
//             "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
//           }}
//         >
//           Add New Service
//         </Button>
//       ) : null,
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {status === "failed" ? (
//           <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//             Error: {error || "An error occurred"}
//           </div>
//         ) : (
//           <>
//             <MUIDataTable
//               title="Laundry Services"
//               data={
//                 status === "loading"
//                   ? [
//                       [
//                         <CircularProgress
//                           key="loading"
//                           sx={{ color: "#fe6c00" }}
//                         />,
//                       ],
//                     ]
//                   : data
//               }
//               columns={columns}
//               options={options}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={handleCloseDialog}
//               aria-labelledby="delete-dialog-title"
//               aria-describedby="delete-dialog-description"
//             >
//               <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="delete-dialog-description">
//                   Are you sure you want to delete this laundry service? This
//                   action cannot be undone.
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleCloseDialog} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleConfirmDelete} color="error" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//         <AddNewLaundryServiceDrawer
//           open={drawerOpen}
//           onClose={() => {
//             setDrawerOpen(false);
//             setEditData(null);
//           }}
//           editMode={!!editData}
//           initialData={editData || {}}
//         />
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundrys;

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  fetchLaundryServices,
  deleteLaundryService,
} from "../../redux/slices/laundryServicesSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewLaundryServiceDrawer from "../AddDrawerSection/AddNewLaundryServiceDrawer";
import { Toaster, toast } from "react-hot-toast";

const Laundrys = () => {
  const dispatch = useDispatch();
  const { services, status, error } = useSelector(
    (state) => state.laundryServices
  );
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    console.log("Fetching laundry services...");
    dispatch(fetchLaundryServices());
  }, [dispatch]);

  const rows = services
    ? services.map((service) => ({
        id: service._id, // Required by DataGrid
        serviceType: service.serviceType || "N/A",
        price:
          service.price !== undefined
            ? `₦${parseFloat(service.price).toFixed(2)}`
            : "N/A",
        createdAt: service.createdAt || "N/A",
      }))
    : [];

  const handleEditClick = (service) => {
    const priceString = service.price; // "₦22.00"
    const price = parseFloat(priceString.replace("₦", ""));
    const serviceData = {
      _id: service.id,
      serviceType: service.serviceType,
      price: price,
    };
    console.log("Edit Data:", serviceData);
    setEditData(serviceData);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (serviceId) => {
    setServiceToDelete(serviceId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      dispatch(deleteLaundryService(serviceToDelete))
        .unwrap()
        .then(() => {
          toast.success("Laundry service deleted successfully!", {
            duration: 5000,
          });
          dispatch(fetchLaundryServices());
        })
        .catch((error) => {
          toast.error("Error deleting service: " + (error || "Unknown error"), {
            duration: 7000,
          });
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setServiceToDelete(null);
        });
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const columns = [
    {
      field: "serviceType",
      headerName: "Service Type",
      width: 200,
      filterable: true,
      sortable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      filterable: true,
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 180,
      filterable: true,
      sortable: true,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toString() === "Invalid Date"
          ? "N/A"
          : date.toLocaleString();
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:laundryService") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleEditClick(params.row)}
            />
          )}
          {hasPermission(user, "delete:laundryService") && (
            <i
              className="bx bx-trash"
              style={{ color: "#fe1e00", cursor: "pointer" }}
              onClick={() => handleDeleteClick(params.row.id)}
            />
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
      <Box sx={{ position: "relative" }}>
        {status === "failed" ? (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            Error: {error || "An error occurred"}
          </div>
        ) : (
          <>
            {status === "loading" && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                }}
              >
                <CircularProgress sx={{ color: "#fe6c00" }} />
              </Box>
            )}
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                checkboxSelection={false}
                disableRowSelectionOnClick
                slots={{
                  toolbar: () =>
                    hasPermission(user, "write:laundryService") ? (
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
                          m: 1,
                        }}
                      >
                        Add New Service
                      </Button>
                    ) : null,
                }}
              />
            </Box>
            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDialog}
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
            >
              <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-dialog-description">
                  Are you sure you want to delete this laundry service? This
                  action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="error" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        <AddNewLaundryServiceDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditData(null);
          }}
          editMode={!!editData}
          initialData={editData || {}}
        />
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default Laundrys;
