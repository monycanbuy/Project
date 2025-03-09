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
//   fetchOrderItems,
//   deleteOrderItem,
// } from "../../redux/slices/orderItemSlice";
// import AddNewOrderItemDrawer from "../AddDrawerSection/AddNewOrderItemDrawer";

// const OrderItems = () => {
//   const dispatch = useDispatch();
//   const { items, isLoading, error } = useSelector((state) => state.orderItems);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Fetching order items...");
//     dispatch(fetchOrderItems());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Items from state:", items);
//     if (items && Array.isArray(items) && items.length > 0) {
//       const formattedData = items.map((item) => [
//         item.itemName || "N/A",
//         item.unitPrice !== undefined ? `₦${item.unitPrice.toFixed(2)}` : "N/A",
//         new Date(item.createdAt).toLocaleString() || "N/A",
//         item._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No order items data available or data is not in expected format"
//       );
//     }
//   }, [items]);

//   const handleEditClick = (item) => {
//     if (!item || item.length < 4) {
//       console.error("Invalid item data:", item);
//       return;
//     }
//     const itemData = {
//       _id: item[3],
//       itemName: item[0],
//       unitPrice: item[1],
//     };
//     setEditData(itemData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (itemId) => {
//     setItemToDelete(itemId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (itemToDelete) {
//       dispatch(deleteOrderItem(itemToDelete))
//         .then(() => {
//           dispatch(fetchOrderItems()); // Refresh the list after delete
//           toast.success("Order item deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting order item: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const columns = [
//     { name: "Item Name", options: { filter: true, sort: true } },
//     { name: "Unit Price", options: { filter: true, sort: true } },
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
//           const item = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(item)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(item[3])}
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
//         Add New Item
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
//               title={"Order Items"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewOrderItemDrawer
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
//                   Are you sure you want to delete this order item?
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

// export default OrderItems;

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
//   fetchOrderItems,
//   deleteOrderItem,
// } from "../../redux/slices/orderItemSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewOrderItemDrawer from "../AddDrawerSection/AddNewOrderItemDrawer";

// const OrderItems = () => {
//   const dispatch = useDispatch();
//   const { items, isLoading, error } = useSelector((state) => state.orderItems);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchOrderItems());
//   }, [dispatch]);

//   useEffect(() => {
//     if (items && Array.isArray(items) && items.length > 0) {
//       const formattedData = items.map((item) => [
//         item.itemName || "N/A",
//         item.unitPrice !== undefined ? `₦${item.unitPrice.toFixed(2)}` : "N/A",
//         // Format the date *here*
//         item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
//         item._id || "N/A",
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]); // Set to empty array if no data
//     }
//   }, [items]);

//   const handleEditClick = (item) => {
//     // Simplified data extraction, directly use the item from `items`
//     if (!item) {
//       console.error("Invalid item data:", item);
//       return;
//     }
//     setEditData(item); // Pass the whole item object, much cleaner
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (itemId) => {
//     setItemToDelete(itemId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (itemToDelete) {
//       dispatch(deleteOrderItem(itemToDelete))
//         .then(() => {
//           dispatch(fetchOrderItems());
//           toast.success("Order item deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting order item: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const columns = [
//     { name: "Item Name", options: { filter: true, sort: true } },
//     { name: "Unit Price", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         // No customBodyRender needed here - date is already formatted
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           // Use items directly, more reliable
//           const item = items[tableMeta.rowIndex];
//           if (!item) return null; // Handle potential undefined item

//           return (
//             <>
//               {hasPermission(user, "update:orderitems") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(item)} // Pass the whole item
//                 ></i>
//               )}

//               {hasPermission(user, "delete:orderitems") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleDeleteClick(item._id)} // Use item._id
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
//       hasPermission(user, "write:orderitems") ? (
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
//           Add New Item
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
//   //       Add New Item
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
//               title={"Order Items"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewOrderItemDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchOrderItems())}
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
//                   Are you sure you want to delete this order item?
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

// export default OrderItems;

// import React, { useEffect, useState } from "react";
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
// } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchOrderItems,
//   deleteOrderItem,
// } from "../../redux/slices/orderItemSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewOrderItemDrawer from "../AddDrawerSection/AddNewOrderItemDrawer";

// const OrderItems = () => {
//   const dispatch = useDispatch();
//   const { items, isLoading, error } = useSelector((state) => state.orderItems);
//   const { user } = useSelector((state) => state.auth);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchOrderItems());
//   }, [dispatch]);

//   const rows = items
//     ? items.map((item) => ({
//         id: item._id, // Required by DataGrid
//         itemName: item.itemName || "N/A",
//         unitPrice:
//           item.unitPrice !== undefined
//             ? `₦${item.unitPrice.toFixed(2)}`
//             : "N/A",
//         createdAt: item.createdAt
//           ? new Date(item.createdAt).toLocaleString()
//           : "N/A",
//       }))
//     : [];

//   const handleEditClick = (item) => {
//     if (!item) {
//       console.error("Invalid item data:", item);
//       return;
//     }
//     setEditData(item);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (itemId) => {
//     setItemToDelete(itemId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (itemToDelete) {
//       dispatch(deleteOrderItem(itemToDelete))
//         .then(() => {
//           dispatch(fetchOrderItems());
//           toast.success("Order item deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting order item: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setItemToDelete(null);
//   };

//   const columns = [
//     {
//       field: "itemName",
//       headerName: "Item Name",
//       width: 200,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "unitPrice",
//       headerName: "Unit Price",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "createdAt",
//       headerName: "Created At",
//       width: 180,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       width: 150,
//       filterable: false,
//       sortable: false,
//       renderCell: (params) => {
//         const item = items.find((i) => i._id === params.row.id);
//         if (!item) return null;
//         return (
//           <>
//             {hasPermission(user, "update:orderitems") && (
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(item)}
//               />
//             )}
//             {hasPermission(user, "delete:orderitems") && (
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(item._id)}
//               />
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
//       <Box sx={{ position: "relative" }}>
//         {error ? (
//           <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//             Error: {error.message || "An error occurred."}
//           </div>
//         ) : (
//           <>
//             {isLoading && (
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 1000,
//                 }}
//               >
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
//               </Box>
//             )}
//             <Box sx={{ height: 600, width: "100%" }}>
//               <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 pageSizeOptions={[10, 20, 50]}
//                 initialState={{
//                   pagination: { paginationModel: { pageSize: 10 } },
//                 }}
//                 checkboxSelection={false}
//                 disableRowSelectionOnClick
//                 slots={{
//                   toolbar: () =>
//                     hasPermission(user, "write:orderitems") ? (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => {
//                           setEditData(null);
//                           setDrawerOpen(true);
//                         }}
//                         sx={{
//                           backgroundColor: "#fe6c00",
//                           color: "#fff",
//                           "&:hover": {
//                             backgroundColor: "#fec80a",
//                             color: "#bdbabb",
//                           },
//                           m: 1,
//                         }}
//                       >
//                         Add New Item
//                       </Button>
//                     ) : null,
//                 }}
//               />
//             </Box>
//             <AddNewOrderItemDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchOrderItems())}
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
//                   Are you sure you want to delete this order item?
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
//         <Toaster />
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default OrderItems;

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
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
import PrintIcon from "@mui/icons-material/Print"; // Print icon
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderItems,
  deleteOrderItem,
} from "../../redux/slices/orderItemSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewOrderItemDrawer from "../AddDrawerSection/AddNewOrderItemDrawer";

const OrderItems = () => {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector((state) => state.orderItems);
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchOrderItems());
  }, [dispatch]);

  useEffect(() => {
    if (items && Array.isArray(items) && items.length > 0) {
      const formattedData = items.map((item) => ({
        id: item._id,
        itemName: item.itemName || "N/A",
        unitPrice:
          item.unitPrice !== undefined
            ? `₦${item.unitPrice.toFixed(2)}`
            : "N/A",
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "N/A",
      }));
      setFilteredData(formattedData);
    } else {
      setFilteredData([]);
    }
  }, [items]);

  // Search functionality
  const handleSearch = (searchVal) => {
    setSearchText(searchVal);
    if (searchVal.trim() === "") {
      setFilteredData(items);
    } else {
      const filtered = items.filter((row) =>
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
    link.download = "order_items.csv";
    link.click();
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = (item) => {
    if (!item) {
      console.error("Invalid item data:", item);
      return;
    }
    setEditData(item);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteOrderItem(itemToDelete))
        .then(() => {
          dispatch(fetchOrderItems());
          toast.success("Order item deleted successfully!", { duration: 5000 });
        })
        .catch((error) => {
          toast.error(
            "Error deleting order item: " +
              (error.response?.data?.message || error.message)
          );
        });
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const columns = [
    {
      field: "itemName",
      headerName: "Item Name",
      flex: 1,
      filterable: true,
      sortable: true,
    },
    {
      field: "unitPrice",
      headerName: "Unit Price",
      flex: 1,
      filterable: true,
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      filterable: true,
      sortable: true,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        const item = items.find((i) => i._id === params.row.id);
        if (!item) return null;
        return (
          <>
            {hasPermission(user, "update:orderitems") && (
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleEditClick(item)}
              />
            )}
            {hasPermission(user, "delete:orderitems") && (
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleDeleteClick(item._id)}
              />
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
      <Box sx={{ width: "100%" }}>
        {error ? (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            Error: {error.message || "An error occurred."}
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
                Order Items
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
                {hasPermission(user, "write:orderitems") && (
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
                    Add New Item
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
                  disableRowSelectionOnClick
                />
              </Box>
            )}
            <AddNewOrderItemDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => dispatch(fetchOrderItems())}
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
                  Are you sure you want to delete this order item?
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
        <Toaster />
      </Box>
    </ThemeProvider>
  );
};

export default OrderItems;
