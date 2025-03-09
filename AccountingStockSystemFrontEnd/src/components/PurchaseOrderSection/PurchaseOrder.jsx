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
//   fetchPurchaseOrders,
//   voidPurchaseOrder,
// } from "../../redux/slices/purchaseOrderSlice";
// import AddNewPurchaseOrderDrawer from "../AddDrawerSection/AddNewPurchaseOrderDrawer";

// const PurchaseOrders = () => {
//   const dispatch = useDispatch();
//   const { purchaseOrders, isLoading, error } = useSelector(
//     (state) => state.purchaseOrders
//   );
//   const { inventories } = useSelector((state) => state.inventories);
//   const { suppliers } = useSelector((state) => state.suppliers);
//   const [data, setData] = useState();
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   // State for managing the void confirmation dialog
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [purchaseOrderToVoid, setPurchaseOrderToVoid] = useState(null);

//   useEffect(() => {
//     console.log("Fetching purchase orders...");
//     dispatch(fetchPurchaseOrders());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Purchase Orders from state:", purchaseOrders);
//     if (
//       purchaseOrders &&
//       Array.isArray(purchaseOrders) &&
//       purchaseOrders.length > 0
//     ) {
//       const formattedData = purchaseOrders.map((order) => [
//         order.supplier.contactPerson, // Assuming supplier is populated with contactPerson
//         format(new Date(order.orderDate), "yyyy-MM-dd HH:mm:ss"),
//         order.expectedDelivery
//           ? format(new Date(order.expectedDelivery), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         order.items.map((item) => ({
//           productName: item.inventory.name,
//           quantity: item.quantityOrdered,
//           unitPrice: item.unitPrice,
//         })),
//         order.status,
//         order._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No purchase orders data available or data is not in expected format"
//       );
//     }
//   }, [purchaseOrders]);

//   const handleEditClick = (order) => {
//     if (!order || order.length < 6) {
//       console.error("Invalid order data:", order);
//       return;
//     }

//     const orderData = {
//       _id: order,
//       supplier:
//         suppliers.find((supplier) => supplier.contactPerson === order)?._id ||
//         "",
//       orderDate: order,
//       expectedDelivery: order,
//       items: order.map((item) => ({
//         inventory:
//           inventories.find((inv) => inv.name === item.productName)?._id || "",
//         quantityOrdered: item.quantity,
//         unitPrice: item.unitPrice,
//       })),
//       status: order,
//     };

//     setEditData(orderData);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (orderId) => {
//     setPurchaseOrderToVoid(orderId);
//     setVoidDialogOpen(true);
//   };

//   const confirmVoid = () => {
//     if (purchaseOrderToVoid) {
//       dispatch(voidPurchaseOrder(purchaseOrderToVoid))
//         .then(() => {
//           console.log("Purchase order voided successfully");
//           dispatch(fetchPurchaseOrders()); // Refresh the list
//         })
//         .catch((error) => {
//           console.error("Error voiding purchase order:", error);
//           // Here you might want to show some error feedback to the user
//         });
//     }
//     setVoidDialogOpen(false);
//     setPurchaseOrderToVoid(null);
//   };

//   const cancelVoid = () => {
//     setVoidDialogOpen(false);
//     setPurchaseOrderToVoid(null);
//   };

//   const columns = [
//     { name: "Supplier", options: { filter: true, sort: true } },
//     {
//       name: "Order Date",
//       options: { filter: true, sort: true, customBodyRender: (value) => value },
//     },
//     {
//       name: "Expected Delivery",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => value,
//       },
//     },
//     {
//       name: "Items",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value) => (
//           <ul>
//             {value.map((item, index) => (
//               <li key={index}>
//                 {item.productName} - {item.quantity} x {item.unitPrice}
//               </li>
//             ))}
//           </ul>
//         ),
//       },
//     },
//     { name: "Status", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const order = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(order)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleVoidClick(order)}
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
//     //... your other options
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
//               title={"Purchase Orders"} // Set the title
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewPurchaseOrderDrawer // Use the drawer component
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//             <Dialog
//               open={voidDialogOpen}
//               onClose={cancelVoid}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Void Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to void this purchase order?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelVoid} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmVoid} color="secondary" autoFocus>
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default PurchaseOrders;

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
//   fetchPurchaseOrders,
//   voidPurchaseOrder,
// } from "../../redux/slices/purchaseOrderSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewPurchaseOrderDrawer from "../AddDrawerSection/AddNewPurchaseOrderDrawer";
// import { toast, Toaster } from "react-hot-toast"; // Import toast

// const PurchaseOrders = () => {
//   const dispatch = useDispatch();
//   const { purchaseOrders, isLoading, error } = useSelector(
//     (state) => state.purchaseOrders
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]); // Initialize as empty array
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [purchaseOrderToVoid, setPurchaseOrderToVoid] = useState(null);

//   useEffect(() => {
//     dispatch(fetchPurchaseOrders());
//   }, [dispatch]);

//   useEffect(() => {
//     if (purchaseOrders && Array.isArray(purchaseOrders)) {
//       const formattedData = purchaseOrders.map((order) => [
//         order.supplier ? order.supplier.contactPerson : "N/A", // Handle null supplier
//         order.orderDate
//           ? format(new Date(order.orderDate), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         order.expectedDelivery
//           ? format(new Date(order.expectedDelivery), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         order.items.map((item) => ({
//           productName: item.inventory ? item.inventory.name : "N/A", // Handle null inventory
//           quantity: item.quantityOrdered,
//           unitPrice: item.unitPrice,
//         })),
//         order.status || "N/A",
//         order._id, // Keep the _id for actions
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]); // Set to empty array if no data
//     }
//   }, [purchaseOrders]);

//   const handleEditClick = (order) => {
//     // Pass the *entire* order object
//     setEditData(order);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (orderId) => {
//     setPurchaseOrderToVoid(orderId); // Store only the ID
//     setVoidDialogOpen(true);
//   };

//   const confirmVoid = () => {
//     if (purchaseOrderToVoid) {
//       dispatch(voidPurchaseOrder(purchaseOrderToVoid))
//         .unwrap() // Use unwrap for better error handling
//         .then(() => {
//           dispatch(fetchPurchaseOrders());
//           toast.success("Purchase order voided successfully!");
//         })
//         .catch((error) => {
//           // Display the *specific* error message from Redux
//           toast.error(`Error voiding purchase order: ${error.message}`);
//         })
//         .finally(() => {
//           setVoidDialogOpen(false);
//           setPurchaseOrderToVoid(null);
//         });
//     }
//   };

//   const cancelVoid = () => {
//     setVoidDialogOpen(false);
//     setPurchaseOrderToVoid(null);
//   };

//   const columns = [
//     { name: "Supplier", options: { filter: true, sort: true } },
//     { name: "Order Date", options: { filter: true, sort: true } },
//     { name: "Expected Delivery", options: { filter: true, sort: true } },
//     {
//       name: "Items",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (items) => (
//           <ul>
//             {items.map((item, index) => (
//               <li key={index}>
//                 {item.productName} - {item.quantity} x ₦
//                 {item.unitPrice.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         ),
//       },
//     },
//     { name: "Status", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const order = purchaseOrders[tableMeta.rowIndex];
//           if (!order) return null;
//           return (
//             <>
//               {hasPermission(user, "write:purchaseorders") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(order)}
//                 ></i>
//               )}

//               {hasPermission(user, "delete:purchaseorders") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleVoidClick(order._id)}
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
//       hasPermission(user, "write:paymentmethod") ? (
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
//           Add New Purchase Order
//         </Button>
//       ) : null,
//   };
//   //   customToolbar: () => (
//   //     // Corrected placement
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
//   //       Add New Purchase Order
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
//           <div>
//             Error: {error.message || "An error occurred."}
//             {error.status && <div>Status Code: {error.status}</div>}
//           </div>
//         ) : (
//           <>
//             <MUIDataTable
//               title={"Purchase Orders"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewPurchaseOrderDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchPurchaseOrders())}
//             />
//             <Dialog
//               open={voidDialogOpen}
//               onClose={cancelVoid}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Void Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to void this purchase order?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelVoid} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmVoid} color="secondary" autoFocus>
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster />
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default PurchaseOrders;

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
//   fetchPurchaseOrders,
//   voidPurchaseOrder,
// } from "../../redux/slices/purchaseOrderSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewPurchaseOrderDrawer from "../AddDrawerSection/AddNewPurchaseOrderDrawer";
// import { toast, Toaster } from "react-hot-toast"; // Import toast

// const PurchaseOrders = () => {
//   const dispatch = useDispatch();
//   const { purchaseOrders, isLoading, error } = useSelector(
//     (state) => state.purchaseOrders
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]); // Initialize as empty array
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [purchaseOrderToVoid, setPurchaseOrderToVoid] = useState(null);

//   useEffect(() => {
//     dispatch(fetchPurchaseOrders());
//   }, [dispatch]);

//   useEffect(() => {
//     if (purchaseOrders && Array.isArray(purchaseOrders)) {
//       const formattedData = purchaseOrders.map((order) => ({
//         id: order._id,
//         supplier: order.supplier ? order.supplier.contactPerson : "N/A", // Handle null supplier
//         orderDate: order.orderDate
//           ? format(new Date(order.orderDate), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         expectedDelivery: order.expectedDelivery
//           ? format(new Date(order.expectedDelivery), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         items: order.items.map((item) => ({
//           productName: item.inventory ? item.inventory.name : "N/A", // Handle null inventory
//           quantity: item.quantityOrdered,
//           unitPrice: item.unitPrice,
//         })),
//         status: order.status || "N/A",
//       }));
//       setData(formattedData);
//     } else {
//       setData([]); // Set to empty array if no data
//     }
//   }, [purchaseOrders]);

//   const handleEditClick = (order) => {
//     // Pass the *entire* order object
//     setEditData(order);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (orderId) => {
//     setPurchaseOrderToVoid(orderId); // Store only the ID
//     setVoidDialogOpen(true);
//   };

//   const confirmVoid = () => {
//     if (purchaseOrderToVoid) {
//       dispatch(voidPurchaseOrder(purchaseOrderToVoid))
//         .unwrap() // Use unwrap for better error handling
//         .then(() => {
//           dispatch(fetchPurchaseOrders());
//           toast.success("Purchase order voided successfully!");
//         })
//         .catch((error) => {
//           // Display the *specific* error message from Redux
//           toast.error(`Error voiding purchase order: ${error.message}`);
//         })
//         .finally(() => {
//           setVoidDialogOpen(false);
//           setPurchaseOrderToVoid(null);
//         });
//     }
//   };

//   const cancelVoid = () => {
//     setVoidDialogOpen(false);
//     setPurchaseOrderToVoid(null);
//   };

//   const columns = [
//     { field: "supplier", headerName: "Supplier", flex: 1 },
//     { field: "orderDate", headerName: "Order Date", flex: 1 },
//     { field: "expectedDelivery", headerName: "Expected Delivery", flex: 1 },
//     {
//       field: "items",
//       headerName: "Items",
//       flex: 1,
//       renderCell: (params) => (
//         <ul>
//           {params.value.map((item, index) => (
//             <li key={index}>
//               {item.productName} - {item.quantity} x ₦
//               {item.unitPrice.toFixed(2)}
//             </li>
//           ))}
//         </ul>
//       ),
//     },
//     { field: "status", headerName: "Status", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "write:purchaseorders") && (
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

//           {hasPermission(user, "delete:purchaseorders") && (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleVoidClick(params.row.id)}
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
//                       hasPermission(user, "write:paymentmethod") ? (
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
//                           Add New Purchase Order
//                         </Button>
//                       ) : null,
//                   }}
//                 />
//               </Box>
//             )}
//             <AddNewPurchaseOrderDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchPurchaseOrders())}
//             />
//             <Dialog
//               open={voidDialogOpen}
//               onClose={cancelVoid}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Void Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to void this purchase order?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelVoid} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmVoid} color="secondary" autoFocus>
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster />
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default PurchaseOrders;

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  fetchPurchaseOrders,
  voidPurchaseOrder,
} from "../../redux/slices/purchaseOrderSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewPurchaseOrderDrawer from "../AddDrawerSection/AddNewPurchaseOrderDrawer";
import { toast, Toaster } from "react-hot-toast"; // Import toast

const PurchaseOrders = () => {
  const dispatch = useDispatch();
  const { purchaseOrders, isLoading, error } = useSelector(
    (state) => state.purchaseOrders
  );
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]); // Initialize as empty array
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [purchaseOrderToVoid, setPurchaseOrderToVoid] = useState(null);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  useEffect(() => {
    if (purchaseOrders && Array.isArray(purchaseOrders)) {
      const formattedData = purchaseOrders.map((order) => ({
        id: order._id,
        supplier: order.supplier ? order.supplier.contactPerson : "N/A", // Handle null supplier
        orderDate: order.orderDate
          ? format(new Date(order.orderDate), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        expectedDelivery: order.expectedDelivery
          ? format(new Date(order.expectedDelivery), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        items: order.items.map((item) => ({
          productName: item.inventory ? item.inventory.name : "N/A", // Handle null inventory
          quantity: item.quantityOrdered,
          unitPrice: item.unitPrice,
        })),
        status: order.status || "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData); // Initialize filtered data
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [purchaseOrders]);

  // Search functionality
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

  // CSV Export functionality
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
    link.download = "purchase_orders.csv";
    link.click();
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = (order) => {
    setEditData(order);
    setDrawerOpen(true);
  };

  const handleVoidClick = (orderId) => {
    setPurchaseOrderToVoid(orderId);
    setVoidDialogOpen(true);
  };

  const confirmVoid = () => {
    if (purchaseOrderToVoid) {
      dispatch(voidPurchaseOrder(purchaseOrderToVoid))
        .unwrap()
        .then(() => {
          dispatch(fetchPurchaseOrders());
          toast.success("Purchase order voided successfully!");
        })
        .catch((error) => {
          toast.error(`Error voiding purchase order: ${error.message}`);
        })
        .finally(() => {
          setVoidDialogOpen(false);
          setPurchaseOrderToVoid(null);
        });
    }
  };

  const cancelVoid = () => {
    setVoidDialogOpen(false);
    setPurchaseOrderToVoid(null);
  };

  const columns = [
    { field: "supplier", headerName: "Supplier", flex: 1 },
    { field: "orderDate", headerName: "Order Date", flex: 1 },
    { field: "expectedDelivery", headerName: "Expected Delivery", flex: 1 },
    {
      field: "items",
      headerName: "Items",
      flex: 1,
      renderCell: (params) => (
        <ul>
          {params.value.map((item, index) => (
            <li key={index}>
              {item.productName} - {item.quantity} x ₦
              {item.unitPrice.toFixed(2)}
            </li>
          ))}
        </ul>
      ),
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "write:purchaseorders") && (
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
          {hasPermission(user, "delete:purchaseorders") && (
            <i
              className="bx bx-trash"
              style={{
                color: "#fe1e00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleVoidClick(params.row.id)}
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
              backgroundColor: "#29221d", // Match row background
              color: "#fcfcfc", // Light text for visibility
              "& .MuiTablePagination-root": {
                color: "#fcfcfc",
              },
              "& .MuiIconButton-root": {
                color: "#fcfcfc",
              },
            },
            "@media print": {
              "& .MuiDataGrid-main": {
                color: "#000", // Ensure text is readable when printing
              },
            },
          },
        },
      },
    },
  });

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
                Purchase Orders
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
                {hasPermission(user, "write:purchaseorders") && (
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
                    Add New Purchase Order
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
            <AddNewPurchaseOrderDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => dispatch(fetchPurchaseOrders())}
            />
            <Dialog
              open={voidDialogOpen}
              onClose={cancelVoid}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Void Confirmation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to void this purchase order?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelVoid} color="primary">
                  Cancel
                </Button>
                <Button onClick={confirmVoid} color="secondary" autoFocus>
                  Void
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

export default PurchaseOrders;
