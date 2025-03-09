// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { format } from "date-fns";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchStockMovements,
//   deleteStockMovement,
// } from "../../redux/slices/stockMovementSlice";
// import AddNewStockMovementDrawer from "../AddDrawerSection/AddNewStockMovementDrawer";

// const StockMovement = () => {
//   const dispatch = useDispatch();
//   const { stockMovements, isLoading, error } = useSelector(
//     (state) => state.stockMovements
//   );
//   const { inventories } = useSelector((state) => state.inventories);
//   const { locations } = useSelector((state) => state.locations);
//   const [data, setData] = useState();
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   // State for managing the delete confirmation dialog
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [movementToDelete, setMovementToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Fetching stock movements...");
//     dispatch(fetchStockMovements());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Stock Movements from state:", stockMovements);
//     if (
//       stockMovements &&
//       Array.isArray(stockMovements) &&
//       stockMovements.length > 0
//     ) {
//       const formattedData = stockMovements.map((movement) => [
//         movement.inventory.name,
//         movement.type,
//         movement.quantity !== undefined ? movement.quantity : "N/A",
//         movement.reason || "N/A",
//         movement.fromLocation ? movement.fromLocation.name : "N/A",
//         movement.toLocation ? movement.toLocation.name : "N/A",
//         format(new Date(movement.transactionDate), "yyyy-MM-dd HH:mm:ss"),
//         movement._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No stock movements data available or data is not in expected format"
//       );
//     }
//   }, [stockMovements]);

//   const handleEditClick = (movement) => {
//     if (!movement || movement.length < 8) {
//       console.error("Invalid movement data:", movement);
//       return;
//     }

//     const movementData = {
//       _id: movement[movement.length - 1], // Assuming _id is at index 7
//       inventory: inventories.find((inv) => inv.name === movement[0])?._id || "",
//       type: movement[1], // type is at index 1
//       quantity: movement[2], // quantity is at index 2
//       reason: movement[3], // reason is at index 3
//       fromLocation:
//         locations.find((loc) => loc.name === movement[4])?._id || "", // fromLocation is at index 4
//       toLocation: locations.find((loc) => loc.name === movement[5])?._id || "", // toLocation is at index 5
//       transactionDate: movement[6], // transactionDate is at index 6
//     };

//     setEditData(movementData);
//     setDrawerOpen(true);
//   };

//   // Function to open delete confirmation dialog
//   const handleDeleteClick = (movementId) => {
//     setMovementToDelete(movementId);
//     setDeleteDialogOpen(true);
//   };

//   // Function to confirm and execute delete
//   const confirmDelete = () => {
//     if (movementToDelete) {
//       dispatch(deleteStockMovement(movementToDelete))
//         .then(() => {
//           console.log("Movement deleted successfully");
//           dispatch(fetchStockMovements()); // Refresh the list
//         })
//         .catch((error) => {
//           console.error("Error deleting movement:", error);
//           // Here you might want to show some error feedback to the user
//         });
//     }
//     setDeleteDialogOpen(false);
//     setMovementToDelete(null);
//   };

//   // Function to cancel delete operation
//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setMovementToDelete(null);
//   };

//   const columns = [
//     { name: "Inventory", options: { filter: true, sort: true } },
//     { name: "Type", options: { filter: true, sort: true } },
//     { name: "Quantity", options: { filter: true, sort: true } },
//     { name: "Reason", options: { filter: true, sort: true } },
//     { name: "From Location", options: { filter: true, sort: true } },
//     { name: "To Location", options: { filter: true, sort: true } },
//     { name: "Date", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const movement = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(movement)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(movement)}
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
//         Add New Movement
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
//               title={"Stock Movements"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewStockMovementDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchStockMovements())}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={cancelDelete}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Delete Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this stock movement?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmDelete} color="secondary" autoFocus>
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

// export default StockMovement;

// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { format } from "date-fns";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchStockMovements,
//   deleteStockMovement,
// } from "../../redux/slices/stockMovementSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewStockMovementDrawer from "../AddDrawerSection/AddNewStockMovementDrawer";
// import { toast, Toaster } from "react-hot-toast"; // Import toast

// const StockMovement = () => {
//   const dispatch = useDispatch();
//   const { stockMovements, isLoading, error } = useSelector(
//     (state) => state.stockMovements
//   );
//   const { inventories } = useSelector((state) => state.inventories); // You might not need this
//   const { locations } = useSelector((state) => state.locations); // You might not need this
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [movementToDelete, setMovementToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchStockMovements());
//   }, [dispatch]);

//   useEffect(() => {
//     if (stockMovements && Array.isArray(stockMovements)) {
//       const formattedData = stockMovements.map((movement) => [
//         // Handle null inventory *here*
//         movement.inventory ? movement.inventory.name : "N/A",
//         movement.type || "N/A",
//         movement.quantity !== undefined ? movement.quantity : "N/A",
//         movement.reason || "N/A",
//         movement.fromLocation ? movement.fromLocation.name : "N/A",
//         movement.toLocation ? movement.toLocation.name : "N/A",
//         movement.transactionDate
//           ? format(new Date(movement.transactionDate), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         movement._id, // Keep _id for actions, but don't display it
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]); // Set to empty array if no data
//     }
//   }, [stockMovements]);

//   const handleEditClick = (movement) => {
//     // Pass the *entire* movement object, not a reconstructed one.
//     setEditData(movement);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (movementId) => {
//     setMovementToDelete(movementId); // Store only the ID
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (movementToDelete) {
//       dispatch(deleteStockMovement(movementToDelete))
//         .then(() => {
//           dispatch(fetchStockMovements()); // Refresh
//           toast.success("Stock movement deleted successfully!"); // Add success toast
//         })
//         .catch((error) => {
//           toast.error(`Error deleting stock movement: ${error.message}`); // Add error toast
//         });
//     }
//     setDeleteDialogOpen(false);
//     setMovementToDelete(null);
//   };

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setMovementToDelete(null);
//   };
//   const columns = [
//     { name: "Inventory", options: { filter: true, sort: true } },
//     { name: "Type", options: { filter: true, sort: true } },
//     { name: "Quantity", options: { filter: true, sort: true } },
//     { name: "Reason", options: { filter: true, sort: true } },
//     { name: "From Location", options: { filter: true, sort: true } },
//     { name: "To Location", options: { filter: true, sort: true } },
//     { name: "Date", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           // Use stockMovements directly
//           const movement = stockMovements[tableMeta.rowIndex];
//           if (!movement) return null; // Handle potential undefined
//           return (
//             <>
//               {hasPermission(user, "update:stockMovement") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(movement)} // Pass entire object
//                 ></i>
//               )}
//               {hasPermission(user, "delete:stockMovement") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleDeleteClick(movement._id)} // Pass only the ID
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
//       hasPermission(user, "write:stockMovement") ? (
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
//           Add New Movement
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
//           <div>
//             Error: {error.message || "An error occurred."}
//             {error.status && <div>Status Code: {error.status}</div>}
//             {/* Optionally show more details, but be careful about sensitive info */}
//             {/* {error.data && <pre>{JSON.stringify(error.data, null, 2)}</pre>} */}
//           </div>
//         ) : (
//           <>
//             <MUIDataTable
//               title={"Stock Movements"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewStockMovementDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchStockMovements())}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={cancelDelete}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Delete Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this stock movement?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmDelete} color="secondary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster /> {/* Correct Toaster placement */}
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default StockMovement;

// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { format } from "date-fns";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchStockMovements,
//   deleteStockMovement,
// } from "../../redux/slices/stockMovementSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewStockMovementDrawer from "../AddDrawerSection/AddNewStockMovementDrawer";
// import { toast, Toaster } from "react-hot-toast"; // Import toast

// const StockMovement = () => {
//   const dispatch = useDispatch();
//   const { stockMovements, isLoading, error } = useSelector(
//     (state) => state.stockMovements
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [movementToDelete, setMovementToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchStockMovements());
//   }, [dispatch]);

//   useEffect(() => {
//     if (stockMovements && Array.isArray(stockMovements)) {
//       const formattedData = stockMovements.map((movement) => ({
//         id: movement._id,
//         inventory: movement.inventory ? movement.inventory.name : "N/A",
//         type: movement.type || "N/A",
//         quantity: movement.quantity !== undefined ? movement.quantity : "N/A",
//         reason: movement.reason || "N/A",
//         fromLocation: movement.fromLocation
//           ? movement.fromLocation.name
//           : "N/A",
//         toLocation: movement.toLocation ? movement.toLocation.name : "N/A",
//         transactionDate: movement.transactionDate
//           ? format(new Date(movement.transactionDate), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//       }));
//       setData(formattedData);
//     } else {
//       setData([]); // Set to empty array if no data
//     }
//   }, [stockMovements]);

//   const handleEditClick = (movement) => {
//     // Pass the *entire* movement object, not a reconstructed one.
//     setEditData(movement);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (movementId) => {
//     setMovementToDelete(movementId); // Store only the ID
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (movementToDelete) {
//       dispatch(deleteStockMovement(movementToDelete))
//         .then(() => {
//           dispatch(fetchStockMovements()); // Refresh
//           toast.success("Stock movement deleted successfully!"); // Add success toast
//         })
//         .catch((error) => {
//           toast.error(`Error deleting stock movement: ${error.message}`); // Add error toast
//         });
//     }
//     setDeleteDialogOpen(false);
//     setMovementToDelete(null);
//   };

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setMovementToDelete(null);
//   };

//   const columns = [
//     { field: "inventory", headerName: "Inventory", flex: 1 },
//     { field: "type", headerName: "Type", flex: 1 },
//     { field: "quantity", headerName: "Quantity", flex: 1 },
//     { field: "reason", headerName: "Reason", flex: 1 },
//     { field: "fromLocation", headerName: "From Location", flex: 1 },
//     { field: "toLocation", headerName: "To Location", flex: 1 },
//     { field: "transactionDate", headerName: "Date", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:stockMovement") && (
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
//           {hasPermission(user, "delete:stockMovement") && (
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
//             backgroundColor: "#f0f0f0",
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
//                   rows={data}
//                   columns={columns}
//                   pageSize={10}
//                   rowsPerPageOptions={[10]}
//                   disableSelectionOnClick
//                   components={{
//                     Toolbar: () =>
//                       hasPermission(user, "write:stockMovement") ? (
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
//                           Add New Movement
//                         </Button>
//                       ) : null,
//                   }}
//                 />
//               </Box>
//             )}
//             <AddNewStockMovementDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchStockMovements())}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={cancelDelete}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Delete Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this stock movement?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmDelete} color="secondary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster /> {/* Correct Toaster placement */}
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default StockMovement;

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
// import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
// import PrintIcon from "@mui/icons-material/Print"; // Print icon
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchStockMovements,
//   deleteStockMovement,
// } from "../../redux/slices/stockMovementSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewStockMovementDrawer from "../AddDrawerSection/AddNewStockMovementDrawer";

// const StockMovement = () => {
//   const dispatch = useDispatch();
//   const { stockMovements, isLoading, error } = useSelector(
//     (state) => state.stockMovements
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [movementToDelete, setMovementToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchStockMovements());
//   }, [dispatch]);

//   useEffect(() => {
//     if (stockMovements && Array.isArray(stockMovements)) {
//       const formattedData = stockMovements.map((movement) => ({
//         id: movement._id,
//         inventory: movement.inventory ? movement.inventory.name : "N/A",
//         type: movement.type || "N/A",
//         quantity: movement.quantity !== undefined ? movement.quantity : "N/A",
//         reason: movement.reason || "N/A",
//         fromLocation: movement.fromLocation
//           ? movement.fromLocation.name
//           : "N/A",
//         toLocation: movement.toLocation ? movement.toLocation.name : "N/A",
//         transactionDate: movement.transactionDate
//           ? format(new Date(movement.transactionDate), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData); // Initialize filtered data
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [stockMovements]);

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
//     link.download = "stock_movements.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (movement) => {
//       if (!movement) {
//         console.error("Invalid movement data:", movement);
//         return;
//       }
//       setEditData(movement);
//       setDrawerOpen(true);
//     },
//     [setEditData, setDrawerOpen]
//   );

//   const handleDeleteClick = useCallback(
//     (movementId) => {
//       setMovementToDelete(movementId);
//       setDeleteDialogOpen(true);
//     },
//     [setMovementToDelete, setDeleteDialogOpen]
//   );

//   const confirmDelete = useCallback(() => {
//     if (movementToDelete) {
//       dispatch(deleteStockMovement(movementToDelete))
//         .then(() => {
//           dispatch(fetchStockMovements());
//           toast.success("Stock movement deleted successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error deleting stock movement: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setMovementToDelete(null);
//   }, [dispatch, movementToDelete]);

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setMovementToDelete(null);
//   };

//   const columns = [
//     { field: "inventory", headerName: "Inventory", flex: 1 },
//     { field: "type", headerName: "Type", flex: 1 },
//     { field: "quantity", headerName: "Quantity", flex: 1 },
//     { field: "reason", headerName: "Reason", flex: 1 },
//     { field: "fromLocation", headerName: "From Location", flex: 1 },
//     { field: "toLocation", headerName: "To Location", flex: 1 },
//     { field: "transactionDate", headerName: "Date", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:stockMovement") && (
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
//           {hasPermission(user, "delete:stockMovement") && (
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
//       inventory: (
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
//           <div>
//             Error: {error.message || "An error occurred."}
//             {error.status && <div>Status Code: {error.status}</div>}
//           </div>
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
//                 Stock Movements
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
//                 {hasPermission(user, "write:stockMovement") && (
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
//                     Add New Movement
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
//             <AddNewStockMovementDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchStockMovements())}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={cancelDelete}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Delete Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this stock movement?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmDelete} color="secondary" autoFocus>
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

// export default StockMovement;

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
import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
import PrintIcon from "@mui/icons-material/Print"; // Print icon
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockMovements,
  deleteStockMovement,
} from "../../redux/slices/stockMovementSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewStockMovementDrawer from "../AddDrawerSection/AddNewStockMovementDrawer";

const StockMovement = () => {
  const dispatch = useDispatch();
  const { stockMovements, isLoading, error } = useSelector(
    (state) => state.stockMovements
  );
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movementToDelete, setMovementToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchStockMovements());
  }, [dispatch]);

  useEffect(() => {
    if (stockMovements && Array.isArray(stockMovements)) {
      const formattedData = stockMovements.map((movement) => ({
        id: movement._id,
        inventory: movement.inventory ? movement.inventory.name : "N/A",
        type: movement.type || "N/A",
        quantity: movement.quantity !== undefined ? movement.quantity : "N/A",
        reason: movement.reason || "N/A",
        fromLocation: movement.fromLocation
          ? movement.fromLocation.name
          : "N/A",
        toLocation: movement.toLocation ? movement.toLocation.name : "N/A",
        transactionDate: movement.transactionDate
          ? format(new Date(movement.transactionDate), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [stockMovements]);

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
    link.download = "stock_movements.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (movement) => {
      if (!movement) {
        console.error("Invalid movement data:", movement);
        return;
      }
      // Find the raw stock movement data using the formatted row's id
      const rawMovement = stockMovements.find((m) => m._id === movement.id);
      if (!rawMovement) {
        console.error("Raw stock movement not found for id:", movement.id);
        return;
      }
      setEditData(rawMovement);
      setDrawerOpen(true);
    },
    [stockMovements, setEditData, setDrawerOpen]
  );

  const handleDeleteClick = useCallback(
    (movementId) => {
      setMovementToDelete(movementId);
      setDeleteDialogOpen(true);
    },
    [setMovementToDelete, setDeleteDialogOpen]
  );

  const confirmDelete = useCallback(() => {
    if (movementToDelete) {
      dispatch(deleteStockMovement(movementToDelete))
        .then(() => {
          dispatch(fetchStockMovements());
          toast.success("Stock movement deleted successfully!");
        })
        .catch((error) => {
          toast.error(`Error deleting stock movement: ${error.message}`);
        });
    }
    setDeleteDialogOpen(false);
    setMovementToDelete(null);
  }, [dispatch, movementToDelete]);

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setMovementToDelete(null);
  };

  const columns = [
    { field: "inventory", headerName: "Inventory", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 1 },
    { field: "fromLocation", headerName: "From Location", flex: 1 },
    { field: "toLocation", headerName: "To Location", flex: 1 },
    { field: "transactionDate", headerName: "Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:stockMovement") && (
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
          {hasPermission(user, "delete:stockMovement") && (
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
      inventory: (
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
          <div>
            Error: {error.message || "An error occurred."}
            {error.status && <div>Status Code: {error.status}</div>}
          </div>
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
                Stock Movements
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
                {hasPermission(user, "write:stockMovement") && (
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
                    Add New Movement
                  </Button>
                )}
              </Box>
            </Box>
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
            <AddNewStockMovementDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => dispatch(fetchStockMovements())}
            />
            <Dialog
              open={deleteDialogOpen}
              onClose={cancelDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete Confirmation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this stock movement?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelDelete} color="primary">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} color="secondary" autoFocus>
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

export default StockMovement;
