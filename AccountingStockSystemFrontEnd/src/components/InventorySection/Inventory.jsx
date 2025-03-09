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
//   IconButton,
//   Tooltip,
//   TableCell,
//   Avatar,
//   Tab,
// } from "@mui/material";
// import { format, isBefore, addDays } from "date-fns";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchInventories,
//   deleteInventory,
// } from "../../redux/slices/inventoriesSlice";
// import AddNewInventoryDrawer from "../AddDrawerSection/AddNewInventoryDrawer";
// import { styled } from "@mui/material/styles";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import InventoryDashboard from "./Reports/InventoryDashboard";

// const Inventory = () => {
//   const dispatch = useDispatch();
//   const { inventories, isLoading, error } = useSelector(
//     (state) => state.inventories
//   );
//   const { categories } = useSelector((state) => state.categories);
//   const { suppliers } = useSelector((state) => state.suppliers);
//   const { locations } = useSelector((state) => state.locations);
//   const { users } = useSelector((state) => state.auth);

//   const [data, setData] = useState();
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   // State for managing the delete confirmation dialog
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [inventoryToDelete, setInventoryToDelete] = useState(null);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     console.log("Fetching inventories...");
//     dispatch(fetchInventories());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Inventories from state:", inventories);
//     console.log("Categories from state:", categories); // Log categories for debugging

//     //   if (inventories && Array.isArray(inventories) && inventories.length > 0) {
//     //     const formattedData = inventories.map((inventory) => {
//     //       // Find the category name from the categories array using the category ID
//     //       const categoryName =
//     //         categories.find((cat) => cat._id === inventory.category)?.name ||
//     //         "N/A";
//     //       const supplierName =
//     //         suppliers.find((sup) => sup._id === inventory.supplier)
//     //           ?.contactPerson || "N/A";
//     //       const locationName =
//     //         locations.find((loc) => loc._id === inventory.locationName)?.name ||
//     //         "N/A";
//     //       const stockKeeperName =
//     //         users.find((user) => user._id === inventory.stockKeeper)?.fullName ||
//     //         "N/A";

//     //       return [
//     //         inventory.name || "N/A",
//     //         inventory.description || "N/A",
//     //         inventory.price !== undefined
//     //           ? `₦${parseFloat(inventory.price).toFixed(2)}`
//     //           : "N/A",
//     //         inventory.category.name, // Use the found category name here
//     //         inventory.stockQuantity !== undefined
//     //           ? inventory.stockQuantity
//     //           : "N/A",
//     //         inventory.supplier.contactPerson,
//     //         inventory.expiryDate &&
//     //         typeof inventory.expiryDate === "string" &&
//     //         inventory.expiryDate.trim() !== ""
//     //           ? format(new Date(inventory.expiryDate), "yyyy-MM-dd HH:mm:ss")
//     //           : "N/A",
//     //         inventory.imageUrl || "N/A",
//     //         inventory.reorderLevel !== undefined ? inventory.reorderLevel : "N/A",
//     //         inventory.reorderQuantity !== undefined
//     //           ? inventory.reorderQuantity
//     //           : "N/A",
//     //         inventory.locationName.name,
//     //         inventory.unit || "N/A",
//     //         inventory.isPerishable ? "Yes" : "No",
//     //         inventory.lastRestocked
//     //           ? format(new Date(inventory.lastRestocked), "yyyy-MM-dd HH:mm:ss")
//     //           : "N/A",
//     //         format(new Date(inventory.createdAt), "yyyy-MM-dd HH:mm:ss") || "N/A",
//     //         inventory.stockKeeper.fullName,
//     //         inventory._id || "N/A",
//     //       ];
//     //     });
//     //     console.log("Formatted Data:", formattedData);
//     //     setData(formattedData);
//     //   } else {
//     //     console.log(
//     //       "No inventories data available or data is not in expected format"
//     //     );
//     //   }
//     // }, [inventories, categories]);

//     if (inventories && Array.isArray(inventories) && inventories.length > 0) {
//       const formattedData = inventories.map((inventory) => {
//         // Find the category name from the categories array using the category ID
//         const categoryName =
//           categories.find((cat) => cat._id === inventory.category?._id)?.name ||
//           "N/A";
//         const supplierName =
//           suppliers.find((sup) => sup._id === inventory.supplier?._id)
//             ?.contactPerson || "N/A";
//         const locationName =
//           locations.find((loc) => loc._id === inventory.locationName?._id)
//             ?.name || "N/A";
//         const stockKeeperName = inventory.stockKeeper
//           ? users.find((user) => user._id === inventory.stockKeeper?._id)
//               ?.fullName || "N/A"
//           : "N/A";

//         return [
//           inventory.name || "N/A",
//           inventory.description || "N/A",
//           inventory.price !== undefined
//             ? `₦${parseFloat(inventory.price).toFixed(2)}`
//             : "N/A",
//           categoryName, // Use the found category name here
//           inventory.stockQuantity !== undefined
//             ? inventory.stockQuantity
//             : "N/A",
//           supplierName,
//           inventory.expiryDate &&
//           typeof inventory.expiryDate === "string" &&
//           inventory.expiryDate.trim() !== ""
//             ? format(new Date(inventory.expiryDate), "yyyy-MM-dd HH:mm:ss")
//             : "N/A",
//           inventory.imageUrl || "N/A",
//           inventory.reorderLevel !== undefined ? inventory.reorderLevel : "N/A",
//           inventory.reorderQuantity !== undefined
//             ? inventory.reorderQuantity
//             : "N/A",
//           locationName,
//           inventory.unit || "N/A",
//           inventory.isPerishable ? "Yes" : "No",
//           inventory.lastRestocked
//             ? format(new Date(inventory.lastRestocked), "yyyy-MM-dd HH:mm:ss")
//             : "N/A",
//           format(new Date(inventory.createdAt), "yyyy-MM-dd HH:mm:ss") || "N/A",
//           stockKeeperName,
//           inventory._id || "N/A",
//         ];
//       });
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No inventories data available or data is not in expected format"
//       );
//     }
//   }, [inventories, categories, suppliers, locations, users]);

//   const handleEditClick = (inventory) => {
//     if (!inventory || inventory.length < 16) {
//       console.error("Invalid inventory data:", inventory);
//       return;
//     }
//     const categoryObject = categories.find((cat) => cat._id === inventory[3]);
//     const supplierObject = suppliers.find(
//       (sup) => sup.contactPerson === inventory[5]
//     );
//     const locationObject = locations.find((loc) => loc.name === inventory[10]);
//     const category = categories.find((cat) => cat.name === inventory[3]);
//     const inventoryData = {
//       _id: inventory[16],
//       name: inventory[0],
//       description: inventory[1],
//       price: inventory[2].replace(/[^0-9.-]+/g, ""),
//       category: category
//         ? { _id: category._id, name: category.name }
//         : { _id: "", name: "" },
//       stockQuantity: inventory[4],
//       supplier: supplierObject ? supplierObject._id : "",
//       expiryDate: inventory[6],
//       imageUrl: inventory[7],
//       reorderLevel: inventory[8],
//       reorderQuantity: inventory[9],
//       locationName: locationObject ? locationObject._id : "",
//       unit: inventory[11],
//       isPerishable: inventory[12] === "Yes",
//       lastRestocked: inventory[13],
//     };
//     setEditData(inventoryData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (inventory) => {
//     const inventoryId = inventory[inventory.length - 1]; // Extract the _id from the array
//     setInventoryToDelete(inventoryId);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (inventoryToDelete) {
//       dispatch(deleteInventory(inventoryToDelete))
//         .then(() => {
//           console.log("Inventory deleted successfully");
//           dispatch(fetchInventories()); // Refresh the list
//         })
//         .catch((error) => {
//           console.error("Error deleting inventory:", error);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setInventoryToDelete(null);
//   };

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setInventoryToDelete(null);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const StyledTableCell = styled(TableCell)(({ theme, isDanger }) => ({
//     color: isDanger ? "red" : "inherit", // Change text color to red if isDanger is true
//     fontWeight: isDanger ? "bold" : "normal",
//   }));

//   const DangerButton = styled(Button)(({ theme }) => ({
//     backgroundColor: "red",
//     color: "white",
//     "&:hover": {
//       backgroundColor: "darkred",
//     },
//   }));

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     { name: "Description", options: { filter: true, sort: true } },
//     { name: "Price", options: { filter: true, sort: true } },
//     { name: "Category", options: { filter: true, sort: true } },
//     { name: "Stock Quantity", options: { filter: true, sort: true } },
//     { name: "Supplier", options: { filter: true, sort: true } },
//     { name: "Expiry Date", options: { filter: true, sort: true } },
//     {
//       name: "Image", // Changed column name
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           return (
//             <Avatar src={value} alt="Inventory Image" variant="rounded" /> // Use Avatar
//           );
//         },
//       },
//     },
//     //{ name: "Reorder Level", options: { filter: true, sort: true } },
//     {
//       name: "Reorder Level",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value, tableMeta) => {
//           const inventory = tableMeta.rowData;
//           const isDanger = inventory.stockQuantity <= inventory.reorderLevel; // Check if stock is below reorder level

//           return <StyledTableCell isDanger={isDanger}>{value}</StyledTableCell>;
//         },
//       },
//     },
//     { name: "Reorder Quantity", options: { filter: true, sort: true } },
//     { name: "Location Name", options: { filter: true, sort: true } },
//     { name: "Unit", options: { filter: true, sort: true } },
//     { name: "Perishable", options: { filter: true, sort: true } },
//     { name: "Last Restocked", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           const dateObj = new Date(value); // Create a Date object from the value
//           return isNaN(dateObj.getTime()) // Check if the Date object is valid
//             ? "N/A" // If not valid, display "N/A"
//             : format(dateObj, "yyyy-MM-dd HH:mm:ss"); // If valid, format the date
//         },
//       },
//     },
//     { name: "Stock Keeper", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const inventory = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(inventory)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(inventory)}
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
//           "&:hover": {
//             backgroundColor: "#fec80a",
//             color: "#bdbabb",
//           },
//         }}
//       >
//         Add New Inventory
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
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Inventory Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div>Error: {error.message || "An error occurred."}</div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title={"Inventories"}
//                 data={isLoading ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewInventoryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={deleteDialogOpen}
//                 onClose={cancelDelete}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//               >
//                 <DialogTitle id="alert-dialog-title">
//                   {"Delete Confirmation"}
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="alert-dialog-description">
//                     Are you sure you want to delete this inventory?
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={cancelDelete} color="primary">
//                     Cancel
//                   </Button>
//                   <Button onClick={confirmDelete} color="secondary" autoFocus>
//                     Delete
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <InventoryDashboard />
//         </TabPanel>
//       </TabContext>
//       {/* <div>

//       </div> */}
//     </ThemeProvider>
//   );
// };

// export default Inventory;

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
//   Avatar,
//   Tab,
//   TableCell,
// } from "@mui/material";
// import { format } from "date-fns";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchInventories,
//   deleteInventory,
// } from "../../redux/slices/inventoriesSlice";
// import AddNewInventoryDrawer from "../AddDrawerSection/AddNewInventoryDrawer";
// import { styled } from "@mui/material/styles";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import InventoryDashboard from "./Reports/InventoryDashboard";

// const Inventory = () => {
//   const dispatch = useDispatch();
//   const { inventories, isLoading, error } = useSelector(
//     (state) => state.inventories
//   );
//   const { categories } = useSelector((state) => state.categories);
//   const { suppliers } = useSelector((state) => state.suppliers);
//   const { locations } = useSelector((state) => state.locations);
//   const { users } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   // State for managing the delete confirmation dialog
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [inventoryToDelete, setInventoryToDelete] = useState(null);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     console.log("Fetching inventories...");
//     dispatch(fetchInventories());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Inventories from state:", inventories);
//     console.log("Categories from state:", categories); // Log categories for debugging

//     if (inventories && Array.isArray(inventories) && inventories.length > 0) {
//       const formattedData = inventories.map((inventory) => {
//         // Find the category name from the categories array using the category ID
//         const categoryName =
//           categories.find((cat) => cat._id === inventory.category?._id)?.name ||
//           "N/A";
//         const supplierName =
//           suppliers.find((sup) => sup._id === inventory.supplier?._id)
//             ?.contactPerson || "N/A";
//         const locationName =
//           locations.find((loc) => loc._id === inventory.locationName?._id)
//             ?.name || "N/A";
//         const stockKeeperName = inventory.stockKeeper
//           ? users.find((user) => user._id === inventory.stockKeeper?._id)
//               ?.fullName || "N/A"
//           : "N/A";

//         return [
//           inventory.name || "N/A",
//           inventory.description || "N/A",
//           inventory.costPrice !== undefined
//             ? `₦${parseFloat(inventory.costPrice).toFixed(2)}`
//             : "N/A",
//           inventory.sellingPrice !== undefined
//             ? `₦${parseFloat(inventory.sellingPrice).toFixed(2)}`
//             : "N/A",
//           categoryName, // Use the found category name here
//           inventory.stockQuantity !== undefined
//             ? inventory.stockQuantity
//             : "N/A",
//           supplierName,
//           inventory.batches.map((batch) => batch.batchNumber).join(", ") ||
//             "N/A",
//           inventory.batches.map((batch) => batch.quantity).join(", ") || "N/A",
//           inventory.batches
//             .map((batch) =>
//               batch.expiryDate
//                 ? format(new Date(batch.expiryDate), "yyyy-MM-dd")
//                 : "N/A"
//             )
//             .join(", "),
//           inventory.imageUrl || "N/A",
//           inventory.reorderLevel !== undefined ? inventory.reorderLevel : "N/A",
//           inventory.reorderQuantity !== undefined
//             ? inventory.reorderQuantity
//             : "N/A",
//           locationName,
//           inventory.unit || "N/A",
//           inventory.isPerishable ? "Yes" : "No",
//           inventory.lastRestocked
//             ? format(new Date(inventory.lastRestocked), "yyyy-MM-dd HH:mm:ss")
//             : "N/A",
//           format(new Date(inventory.createdAt), "yyyy-MM-dd HH:mm:ss") || "N/A",
//           stockKeeperName,
//           inventory.isActive ? "Active" : "Inactive",
//           inventory._id || "N/A",
//         ];
//       });
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No inventories data available or data is not in expected format"
//       );
//     }
//   }, [inventories, categories, suppliers, locations, users]);

//   const handleEditClick = (inventory) => {
//     if (!inventory || inventory.length < 21) {
//       console.error("Invalid inventory data:", inventory);
//       return;
//     }
//     const categoryObject = categories.find((cat) => cat._id === inventory[4]);
//     const supplierObject = suppliers.find(
//       (sup) => sup.contactPerson === inventory[6]
//     );
//     const locationObject = locations.find((loc) => loc.name === inventory[13]);
//     const category = categories.find((cat) => cat.name === inventory[4]);
//     const inventoryData = {
//       _id: inventory[20],
//       name: inventory[0],
//       description: inventory[1],
//       costPrice: inventory[2].replace(/[^0-9.-]+/g, ""),
//       sellingPrice: inventory[3].replace(/[^0-9.-]+/g, ""),
//       category: category
//         ? { _id: category._id, name: category.name }
//         : { _id: "", name: "" },
//       stockQuantity: inventory[5],
//       supplier: supplierObject ? supplierObject._id : "",
//       batches: inventory[7].split(", ").map((batchNumber, index) => ({
//         batchNumber,
//         quantity: parseInt(inventory[8].split(", ")[index], 10),
//         expiryDate: inventory[9].split(", ")[index],
//       })),
//       imageUrl: inventory[10],
//       reorderLevel: inventory[11],
//       reorderQuantity: inventory[12],
//       locationName: locationObject ? locationObject._id : "",
//       unit: inventory[14],
//       isPerishable: inventory[15] === "Yes",
//       lastRestocked: inventory[16],
//       isActive: inventory[19] === "Active",
//     };
//     setEditData(inventoryData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (inventory) => {
//     const inventoryId = inventory[inventory.length - 1]; // Extract the _id from the array
//     setInventoryToDelete(inventoryId);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (inventoryToDelete) {
//       dispatch(deleteInventory(inventoryToDelete))
//         .then(() => {
//           console.log("Inventory deleted successfully");
//           dispatch(fetchInventories()); // Refresh the list
//         })
//         .catch((error) => {
//           console.error("Error deleting inventory:", error);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setInventoryToDelete(null);
//   };

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setInventoryToDelete(null);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const StyledTableCell = styled(TableCell)(({ theme, isDanger }) => ({
//     color: isDanger ? "red" : "inherit", // Change text color to red if isDanger is true
//     fontWeight: isDanger ? "bold" : "normal",
//   }));

//   const DangerButton = styled(Button)(({ theme }) => ({
//     backgroundColor: "red",
//     color: "white",
//     "&:hover": {
//       backgroundColor: "darkred",
//     },
//   }));

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     { name: "Description", options: { filter: true, sort: true } },
//     { name: "Cost Price", options: { filter: true, sort: true } },
//     { name: "Selling Price", options: { filter: true, sort: true } },
//     { name: "Category", options: { filter: true, sort: true } },
//     { name: "Stock Quantity", options: { filter: true, sort: true } },
//     { name: "Supplier", options: { filter: true, sort: true } },
//     { name: "Batch Numbers", options: { filter: true, sort: true } },
//     { name: "Batch Quantities", options: { filter: true, sort: true } },
//     { name: "Batch Expiry Dates", options: { filter: true, sort: true } },
//     {
//       name: "Image", // Changed column name
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value) => {
//           return (
//             <Avatar src={value} alt="Inventory Image" variant="rounded" /> // Use Avatar
//           );
//         },
//       },
//     },
//     {
//       name: "Reorder Level",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value, tableMeta) => {
//           const inventory = tableMeta.rowData;
//           const isDanger = inventory[5] <= inventory[11]; // Check if stock is below reorder level

//           return <StyledTableCell isDanger={isDanger}>{value}</StyledTableCell>;
//         },
//       },
//     },
//     { name: "Reorder Quantity", options: { filter: true, sort: true } },
//     { name: "Location Name", options: { filter: true, sort: true } },
//     { name: "Unit", options: { filter: true, sort: true } },
//     { name: "Perishable", options: { filter: true, sort: true } },
//     { name: "Last Restocked", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           const dateObj = new Date(value); // Create a Date object from the value
//           return isNaN(dateObj.getTime()) // Check if the Date object is valid
//             ? "N/A" // If not valid, display "N/A"
//             : format(dateObj, "yyyy-MM-dd HH:mm:ss"); // If valid, format the date
//         },
//       },
//     },
//     { name: "Stock Keeper", options: { filter: true, sort: true } },
//     { name: "Status", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const inventory = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(inventory)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(inventory)}
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
//           "&:hover": {
//             backgroundColor: "#fec80a",
//             color: "#bdbabb",
//           },
//         }}
//       >
//         Add New Inventory
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
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Inventory Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div>Error: {error.message || "An error occurred."}</div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title={"Inventories"}
//                 data={isLoading ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewInventoryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={deleteDialogOpen}
//                 onClose={cancelDelete}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//               >
//                 <DialogTitle id="alert-dialog-title">
//                   {"Delete Confirmation"}
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="alert-dialog-description">
//                     Are you sure you want to delete this inventory?
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={cancelDelete} color="primary">
//                     Cancel
//                   </Button>
//                   <Button onClick={confirmDelete} color="secondary" autoFocus>
//                     Delete
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <InventoryDashboard />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default Inventory;

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
//   Avatar,
//   Tab,
//   TableCell,
// } from "@mui/material";
// import { format } from "date-fns";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchInventories,
//   deleteInventory,
// } from "../../redux/slices/inventoriesSlice";
// import AddNewInventoryDrawer from "../AddDrawerSection/AddNewInventoryDrawer";
// import { styled } from "@mui/material/styles";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import InventoryDashboard from "./Reports/InventoryDashboard";

// const Inventory = () => {
//   const dispatch = useDispatch();
//   const { inventories, isLoading, error } = useSelector(
//     (state) => state.inventories
//   );
//   const { categories } = useSelector((state) => state.categories);
//   const { suppliers } = useSelector((state) => state.suppliers);
//   const { locations } = useSelector((state) => state.locations);
//   const { users } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   // State for managing the delete confirmation dialog
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [inventoryToDelete, setInventoryToDelete] = useState(null);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     console.log("Fetching inventories...");
//     dispatch(fetchInventories());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Inventories from state:", inventories);
//     console.log("Categories from state:", categories); // Log categories for debugging

//     if (inventories && Array.isArray(inventories) && inventories.length > 0) {
//       const formattedData = inventories.map((inventory) => {
//         // Find the category name from the categories array using the category ID
//         const categoryName =
//           categories.find((cat) => cat._id === inventory.category?._id)?.name ||
//           "N/A";
//         const supplierName =
//           suppliers.find((sup) => sup._id === inventory.supplier?._id)
//             ?.contactPerson || "N/A";
//         const locationName =
//           locations.find((loc) => loc._id === inventory.locationName?._id)
//             ?.name || "N/A";
//         const stockKeeperName = inventory.stockKeeper
//           ? users.find((user) => user._id === inventory.stockKeeper?._id)
//               ?.fullName || "N/A"
//           : "N/A";

//         return [
//           inventory.name || "N/A",
//           inventory.description || "N/A",
//           inventory.costPrice !== undefined
//             ? `₦${parseFloat(inventory.costPrice).toFixed(2)}`
//             : "N/A",
//           inventory.sellingPrice !== undefined
//             ? `₦${parseFloat(inventory.sellingPrice).toFixed(2)}`
//             : "N/A",
//           categoryName, // Use the found category name here
//           inventory.stockQuantity !== undefined
//             ? inventory.stockQuantity
//             : "N/A",
//           supplierName,
//           inventory.batches.map((batch) => batch.batchNumber).join(", ") ||
//             "N/A",
//           inventory.batches.map((batch) => batch.quantity).join(", ") || "N/A",
//           inventory.batches
//             .map((batch) =>
//               batch.expiryDate
//                 ? format(new Date(batch.expiryDate), "yyyy-MM-dd")
//                 : "N/A"
//             )
//             .join(", "),
//           inventory.imageUrl || "N/A",
//           inventory.reorderLevel !== undefined ? inventory.reorderLevel : "N/A",
//           inventory.reorderQuantity !== undefined
//             ? inventory.reorderQuantity
//             : "N/A",
//           locationName,
//           inventory.unit || "N/A",
//           inventory.isPerishable ? "Yes" : "No",
//           inventory.lastRestocked
//             ? format(new Date(inventory.lastRestocked), "yyyy-MM-dd HH:mm:ss")
//             : "N/A",
//           format(new Date(inventory.createdAt), "yyyy-MM-dd HH:mm:ss") || "N/A",
//           stockKeeperName,
//           inventory.isActive ? "Active" : "Inactive",
//           inventory._id || "N/A",
//         ];
//       });
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No inventories data available or data is not in expected format"
//       );
//     }
//   }, [inventories, categories, suppliers, locations, users]);

//   const handleEditClick = (inventory) => {
//     if (!inventory || inventory.length < 21) {
//       console.error("Invalid inventory data:", inventory);
//       return;
//     }
//     const categoryObject = categories.find((cat) => cat._id === inventory[4]);
//     const supplierObject = suppliers.find(
//       (sup) => sup.contactPerson === inventory[6]
//     );
//     const locationObject = locations.find((loc) => loc.name === inventory[13]);
//     const category = categories.find((cat) => cat.name === inventory[4]);
//     const inventoryData = {
//       _id: inventory[20],
//       name: inventory[0],
//       description: inventory[1],
//       costPrice: inventory[2].replace(/[^0-9.-]+/g, ""),
//       sellingPrice: inventory[3].replace(/[^0-9.-]+/g, ""),
//       category: category
//         ? { _id: category._id, name: category.name }
//         : { _id: "", name: "" },
//       stockQuantity: inventory[5],
//       supplier: supplierObject ? supplierObject._id : "",
//       batches: inventory[7].split(", ").map((batchNumber, index) => ({
//         batchNumber,
//         quantity: parseInt(inventory[8].split(", ")[index], 10),
//         expiryDate: inventory[9].split(", ")[index],
//       })),
//       imageUrl: inventory[10],
//       reorderLevel: inventory[11],
//       reorderQuantity: inventory[12],
//       locationName: locationObject ? locationObject._id : "",
//       unit: inventory[14],
//       isPerishable: inventory[15] === "Yes",
//       lastRestocked: inventory[16],
//       isActive: inventory[19] === "Active",
//     };
//     setEditData(inventoryData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (inventory) => {
//     const inventoryId = inventory[inventory.length - 1]; // Extract the _id from the array
//     setInventoryToDelete(inventoryId);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (inventoryToDelete) {
//       dispatch(deleteInventory(inventoryToDelete))
//         .then(() => {
//           console.log("Inventory deleted successfully");
//           dispatch(fetchInventories()); // Refresh the list
//         })
//         .catch((error) => {
//           console.error("Error deleting inventory:", error);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setInventoryToDelete(null);
//   };

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setInventoryToDelete(null);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const StyledTableCell = styled(TableCell)(({ theme, isDanger }) => ({
//     color: isDanger ? "red" : "inherit", // Change text color to red if isDanger is true
//     fontWeight: isDanger ? "bold" : "normal",
//   }));

//   const DangerButton = styled(Button)(({ theme }) => ({
//     backgroundColor: "red",
//     color: "white",
//     "&:hover": {
//       backgroundColor: "darkred",
//     },
//   }));

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     { name: "Description", options: { filter: true, sort: true } },
//     { name: "Cost Price", options: { filter: true, sort: true } },
//     { name: "Selling Price", options: { filter: true, sort: true } },
//     { name: "Category", options: { filter: true, sort: true } },
//     { name: "Stock Quantity", options: { filter: true, sort: true } },
//     { name: "Supplier", options: { filter: true, sort: true } },
//     { name: "Batch Numbers", options: { filter: true, sort: true } },
//     { name: "Batch Quantities", options: { filter: true, sort: true } },
//     { name: "Batch Expiry Dates", options: { filter: true, sort: true } },
//     {
//       name: "Image", // Changed column name
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value) => {
//           return (
//             <Avatar src={value} alt="Inventory Image" variant="rounded" /> // Use Avatar
//           );
//         },
//       },
//     },
//     {
//       name: "Reorder Level",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value, tableMeta) => {
//           const inventory = tableMeta.rowData;
//           const isDanger = inventory[5] <= inventory[11]; // Check if stock is below reorder level

//           return <StyledTableCell isDanger={isDanger}>{value}</StyledTableCell>;
//         },
//       },
//     },
//     { name: "Reorder Quantity", options: { filter: true, sort: true } },
//     { name: "Location Name", options: { filter: true, sort: true } },
//     { name: "Unit", options: { filter: true, sort: true } },
//     { name: "Perishable", options: { filter: true, sort: true } },
//     { name: "Last Restocked", options: { filter: true, sort: true } },
//     {
//       name: "Created At",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           const dateObj = new Date(value); // Create a Date object from the value
//           return isNaN(dateObj.getTime()) // Check if the Date object is valid
//             ? "N/A" // If not valid, display "N/A"
//             : format(dateObj, "yyyy-MM-dd HH:mm:ss"); // If valid, format the date
//         },
//       },
//     },
//     { name: "Stock Keeper", options: { filter: true, sort: true } },
//     { name: "Status", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const inventory = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(inventory)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(inventory)}
//               ></i>
//             </>
//           );
//         },
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
//       MuiTab: {
//         styleOverrides: {
//           root: {
//             color: "#fff",
//             "&.Mui-selected": { color: "#fe6c00" },
//             "&:hover": { color: "#fe6c00" },
//           },
//         },
//       },
//       MuiTabs: {
//         styleOverrides: {
//           indicator: { backgroundColor: "#fe6c00" },
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
//         Add New Inventory
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
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Inventory Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div>Error: {error.message || "An error occurred."}</div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title={"Inventories"}
//                 data={isLoading ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewInventoryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//               />
//               <Dialog
//                 open={deleteDialogOpen}
//                 onClose={cancelDelete}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//               >
//                 <DialogTitle id="alert-dialog-title">
//                   {"Delete Confirmation"}
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="alert-dialog-description">
//                     Are you sure you want to delete this inventory?
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={cancelDelete} color="primary">
//                     Cancel
//                   </Button>
//                   <Button onClick={confirmDelete} color="secondary" autoFocus>
//                     Delete
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <InventoryDashboard />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default Inventory;

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
//   Avatar,
//   Tab,
// } from "@mui/material";
// import { format } from "date-fns";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchInventories,
//   deleteInventory,
// } from "../../redux/slices/inventoriesSlice";
// import AddNewInventoryDrawer from "../AddDrawerSection/AddNewInventoryDrawer";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import InventoryDashboard from "./Reports/InventoryDashboard";
// import Typography from "@mui/material/Typography";

// const Inventory = () => {
//   const dispatch = useDispatch();
//   const { inventories, isLoading, error } = useSelector(
//     (state) => state.inventories
//   );
//   const { categories } = useSelector((state) => state.categories);
//   const { suppliers } = useSelector((state) => state.suppliers);
//   const { locations } = useSelector((state) => state.locations);
//   const { users } = useSelector((state) => state.auth);
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [inventoryToDelete, setInventoryToDelete] = useState(null);
//   const [value, setValue] = useState("0");

//   useEffect(() => {
//     if (isAuthenticated) {
//       console.log("Fetching inventories...");
//       dispatch(fetchInventories());
//     }
//   }, [dispatch, isAuthenticated]);

//   useEffect(() => {
//     console.log("Inventories from state:", inventories);
//     if (inventories && Array.isArray(inventories) && inventories.length > 0) {
//       const formattedData = inventories.map((inventory) => {
//         const categoryName =
//           categories.find((cat) => cat._id === inventory.category?._id)?.name ||
//           "N/A";
//         const supplierName =
//           suppliers.find((sup) => sup._id === inventory.supplier?._id)
//             ?.contactPerson || "N/A";
//         const locationName =
//           locations.find((loc) => loc._id === inventory.locationName?._id)
//             ?.name || "N/A";
//         const stockKeeperName = inventory.stockKeeper
//           ? users.find((user) => user._id === inventory.stockKeeper?._id)
//               ?.fullName || "N/A"
//           : "N/A";

//         return {
//           id: inventory._id,
//           name: inventory.name || "N/A",
//           description: inventory.description || "N/A",
//           costPrice:
//             inventory.costPrice !== undefined
//               ? `₦${parseFloat(inventory.costPrice).toFixed(2)}`
//               : "N/A",
//           sellingPrice:
//             inventory.sellingPrice !== undefined
//               ? `₦${parseFloat(inventory.sellingPrice).toFixed(2)}`
//               : "N/A",
//           category: categoryName,
//           stockQuantity:
//             inventory.stockQuantity !== undefined
//               ? inventory.stockQuantity
//               : "N/A",
//           supplier: supplierName,
//           batchNumbers:
//             inventory.batches?.map((batch) => batch.batchNumber).join(", ") ||
//             "N/A",
//           batchQuantities:
//             inventory.batches?.map((batch) => batch.quantity).join(", ") ||
//             "N/A",
//           batchExpiryDates:
//             inventory.batches
//               ?.map((batch) =>
//                 batch.expiryDate
//                   ? format(new Date(batch.expiryDate), "yyyy-MM-dd")
//                   : "N/A"
//               )
//               .join(", ") || "N/A",
//           imageUrl: inventory.imageUrl || "",
//           reorderLevel:
//             inventory.reorderLevel !== undefined
//               ? inventory.reorderLevel
//               : "N/A",
//           reorderQuantity:
//             inventory.reorderQuantity !== undefined
//               ? inventory.reorderQuantity
//               : "N/A",
//           locationName: locationName,
//           unit: inventory.unit || "N/A",
//           isPerishable: inventory.isPerishable ? "Yes" : "No",
//           lastRestocked: inventory.lastRestocked
//             ? format(new Date(inventory.lastRestocked), "yyyy-MM-dd HH:mm:ss")
//             : "N/A",
//           createdAt: inventory.createdAt
//             ? format(new Date(inventory.createdAt), "yyyy-MM-dd HH:mm:ss")
//             : "N/A",
//           stockKeeper: stockKeeperName,
//           isActive: inventory.isActive ? "Active" : "Inactive",
//         };
//       });
//       console.log("Formatted Data for DataGrid:", formattedData);
//       setData(formattedData);
//     } else {
//       setData([]);
//     }
//   }, [inventories, categories, suppliers, locations, users]);

//   const handleEditClick = (row) => {
//     const inventory = inventories.find((inv) => inv._id === row.id);
//     if (!inventory) {
//       console.error("Inventory not found for edit:", row.id);
//       return;
//     }
//     setEditData({
//       _id: inventory._id,
//       name: inventory.name,
//       description: inventory.description,
//       costPrice: inventory.costPrice,
//       sellingPrice: inventory.sellingPrice,
//       category: inventory.category || { _id: "", name: "" },
//       stockQuantity: inventory.stockQuantity,
//       supplier: inventory.supplier || "",
//       batches: inventory.batches || [],
//       imageUrl: inventory.imageUrl,
//       reorderLevel: inventory.reorderLevel,
//       reorderQuantity: inventory.reorderQuantity,
//       locationName: inventory.locationName || "",
//       unit: inventory.unit,
//       isPerishable: inventory.isPerishable,
//       lastRestocked: inventory.lastRestocked,
//       isActive: inventory.isActive,
//     });
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (id) => {
//     setInventoryToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (inventoryToDelete) {
//       dispatch(deleteInventory(inventoryToDelete))
//         .unwrap()
//         .then(() => {
//           console.log("Inventory deleted successfully");
//           dispatch(fetchInventories());
//         })
//         .catch((err) => console.error("Error deleting inventory:", err));
//     }
//     setDeleteDialogOpen(false);
//     setInventoryToDelete(null);
//   };

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setInventoryToDelete(null);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "description", headerName: "Description", flex: 1 },
//     { field: "costPrice", headerName: "Cost Price", flex: 1 },
//     { field: "sellingPrice", headerName: "Selling Price", flex: 1 },
//     { field: "category", headerName: "Category", flex: 1 },
//     { field: "stockQuantity", headerName: "Stock Quantity", flex: 1 },
//     { field: "supplier", headerName: "Supplier", flex: 1 },
//     { field: "batchNumbers", headerName: "Batch Numbers", flex: 1 },
//     { field: "batchQuantities", headerName: "Batch Quantities", flex: 1 },
//     { field: "batchExpiryDates", headerName: "Batch Expiry Dates", flex: 1 },
//     {
//       field: "imageUrl",
//       headerName: "Image",
//       flex: 1,
//       renderCell: (params) => (
//         <Avatar src={params.value} alt="Inventory Image" variant="rounded" />
//       ),
//     },
//     {
//       field: "reorderLevel",
//       headerName: "Reorder Level",
//       flex: 1,
//       renderCell: (params) => (
//         <Typography
//           color={params.row.stockQuantity <= params.value ? "red" : "inherit"}
//           fontWeight={
//             params.row.stockQuantity <= params.value ? "bold" : "normal"
//           }
//         >
//           {params.value}
//         </Typography>
//       ),
//     },
//     { field: "reorderQuantity", headerName: "Reorder Quantity", flex: 1 },
//     { field: "locationName", headerName: "Location Name", flex: 1 },
//     { field: "unit", headerName: "Unit", flex: 1 },
//     { field: "isPerishable", headerName: "Perishable", flex: 1 },
//     { field: "lastRestocked", headerName: "Last Restocked", flex: 1 },
//     { field: "createdAt", headerName: "Created At", flex: 1 },
//     { field: "stockKeeper", headerName: "Stock Keeper", flex: 1 },
//     { field: "isActive", headerName: "Status", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Action",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           <i
//             className="bx bx-pencil"
//             style={{
//               color: "#fe6c00",
//               cursor: "pointer",
//               marginRight: "12px",
//             }}
//             onClick={() => handleEditClick(params.row)}
//           ></i>
//           <i
//             className="bx bx-trash"
//             style={{ color: "#fe1e00", cursor: "pointer" }}
//             onClick={() => handleDeleteClick(params.row.id)}
//           ></i>
//         </>
//       ),
//     },
//   ];

//   const theme = createTheme({
//     components: {
//       MuiDataGrid: {
//         styleOverrides: {
//           root: {
//             "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
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
//       MuiTab: {
//         styleOverrides: {
//           root: {
//             color: "#fff",
//             "&.Mui-selected": { color: "#fe6c00" },
//             "&:hover": { color: "#fe6c00" },
//           },
//         },
//       },
//       MuiTabs: {
//         styleOverrides: {
//           indicator: { backgroundColor: "#fe6c00" },
//         },
//       },
//     },
//   });

//   if (!isAuthenticated) {
//     return (
//       <Box sx={{ textAlign: "center", padding: "20px" }}>
//         <Typography variant="h6">Please log in to view inventories.</Typography>
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box
//           sx={{
//             borderBottom: 1,
//             borderColor: "divider",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <TabList onChange={handleChange} aria-label="inventory tabs">
//             <Tab label="Inventory Table" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div>
//               Error: {error.message || "An error occurred."}
//               {error.status && <div>Status Code: {error.status}</div>}
//             </div>
//           ) : (
//             <>
//               {isLoading ? (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     height: "200px",
//                     width: "100%",
//                   }}
//                 >
//                   <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//                 </Box>
//               ) : (
//                 <Box sx={{ height: 600, width: "100%" }}>
//                   <DataGrid
//                     rows={data}
//                     columns={columns}
//                     pageSize={10}
//                     rowsPerPageOptions={[10]}
//                     disableSelectionOnClick
//                     components={{
//                       Toolbar: () => (
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
//                             margin: "8px",
//                           }}
//                         >
//                           Add New Inventory
//                         </Button>
//                       ),
//                     }}
//                   />
//                 </Box>
//               )}
//               <AddNewInventoryDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//                 onSaveSuccess={() => dispatch(fetchInventories())} // Refresh after save
//               />
//               <Dialog
//                 open={deleteDialogOpen}
//                 onClose={cancelDelete}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//               >
//                 <DialogTitle id="alert-dialog-title">
//                   {"Delete Confirmation"}
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="alert-dialog-description">
//                     Are you sure you want to delete this inventory?
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button onClick={cancelDelete} color="primary">
//                     Cancel
//                   </Button>
//                   <Button onClick={confirmDelete} color="secondary" autoFocus>
//                     Delete
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <InventoryDashboard />
//         </TabPanel>
//       </TabContext>
//     </ThemeProvider>
//   );
// };

// export default Inventory;

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
  Avatar,
  Tab,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
import PrintIcon from "@mui/icons-material/Print"; // Print icon
import { format } from "date-fns";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventories,
  deleteInventory,
} from "../../redux/slices/inventoriesSlice";
import AddNewInventoryDrawer from "../AddDrawerSection/AddNewInventoryDrawer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InventoryDashboard from "./Reports/InventoryDashboard";

const Inventory = () => {
  const dispatch = useDispatch();
  const { inventories, isLoading, error } = useSelector(
    (state) => state.inventories
  );
  const { categories } = useSelector((state) => state.categories);
  const { suppliers } = useSelector((state) => state.suppliers);
  const { locations } = useSelector((state) => state.locations);
  const { users, isAuthenticated } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);
  const [value, setValue] = useState("0");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Fetching inventories...");
      dispatch(fetchInventories());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    console.log("Inventories from state:", inventories);
    if (inventories && Array.isArray(inventories) && inventories.length > 0) {
      const formattedData = inventories.map((inventory) => {
        const categoryName =
          categories.find((cat) => cat._id === inventory.category?._id)?.name ||
          "N/A";
        const supplierName =
          suppliers.find((sup) => sup._id === inventory.supplier?._id)
            ?.contactPerson || "N/A";
        const locationName =
          locations.find((loc) => loc._id === inventory.locationName?._id)
            ?.name || "N/A";
        const stockKeeperName = inventory.stockKeeper
          ? users.find((user) => user._id === inventory.stockKeeper?._id)
              ?.fullName || "N/A"
          : "N/A";

        return {
          id: inventory._id,
          name: inventory.name || "N/A",
          description: inventory.description || "N/A",
          costPrice:
            inventory.costPrice !== undefined
              ? `₦${parseFloat(inventory.costPrice).toFixed(2)}`
              : "N/A",
          sellingPrice:
            inventory.sellingPrice !== undefined
              ? `₦${parseFloat(inventory.sellingPrice).toFixed(2)}`
              : "N/A",
          category: categoryName,
          stockQuantity:
            inventory.stockQuantity !== undefined
              ? inventory.stockQuantity
              : "N/A",
          supplier: supplierName,
          batchNumbers:
            inventory.batches?.map((batch) => batch.batchNumber).join(", ") ||
            "N/A",
          batchQuantities:
            inventory.batches?.map((batch) => batch.quantity).join(", ") ||
            "N/A",
          batchExpiryDates:
            inventory.batches
              ?.map((batch) =>
                batch.expiryDate
                  ? format(new Date(batch.expiryDate), "yyyy-MM-dd")
                  : "N/A"
              )
              .join(", ") || "N/A",
          imageUrl: inventory.imageUrl || "",
          reorderLevel:
            inventory.reorderLevel !== undefined
              ? inventory.reorderLevel
              : "N/A",
          reorderQuantity:
            inventory.reorderQuantity !== undefined
              ? inventory.reorderQuantity
              : "N/A",
          locationName: locationName,
          unit: inventory.unit || "N/A",
          isPerishable: inventory.isPerishable ? "Yes" : "No",
          lastRestocked: inventory.lastRestocked
            ? format(new Date(inventory.lastRestocked), "yyyy-MM-dd HH:mm:ss")
            : "N/A",
          createdAt: inventory.createdAt
            ? format(new Date(inventory.createdAt), "yyyy-MM-dd HH:mm:ss")
            : "N/A",
          stockKeeper: stockKeeperName,
          isActive: inventory.isActive ? "Active" : "Inactive",
        };
      });
      console.log("Formatted Data for DataGrid:", formattedData);
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [inventories, categories, suppliers, locations, users]);

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
    const rows = filteredData
      .map((row) =>
        columns
          .map(
            (col) =>
              `"${(row[col.field] || "").toString().replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventory.csv";
    link.click();
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // const handleEditClick = (row) => {
  //   const inventory = inventories.find((inv) => inv._id === row.id);
  //   if (!inventory) {
  //     console.error("Inventory not found for edit:", row.id);
  //     return;
  //   }
  //   setEditData({
  //     _id: inventory._id,
  //     name: inventory.name,
  //     description: inventory.description,
  //     costPrice: inventory.costPrice,
  //     sellingPrice: inventory.sellingPrice,
  //     category: inventory.category || { _id: "", name: "" },
  //     stockQuantity: inventory.stockQuantity,
  //     supplier: inventory.supplier || "",
  //     batches: inventory.batches || [],
  //     imageUrl: inventory.imageUrl,
  //     reorderLevel: inventory.reorderLevel,
  //     reorderQuantity: inventory.reorderQuantity,
  //     locationName: inventory.locationName || "",
  //     unit: inventory.unit,
  //     isPerishable: inventory.isPerishable,
  //     lastRestocked: inventory.lastRestocked,
  //     isActive: inventory.isActive,
  //   });
  //   setDrawerOpen(true);
  // };
  const handleEditClick = (row) => {
    const inventory = inventories.find((inv) => inv._id === row.id);
    if (!inventory) {
      console.error("Inventory not found for edit:", row.id);
      return;
    }
    setEditData({
      _id: inventory._id,
      name: inventory.name || "",
      description: inventory.description || "",
      costPrice: inventory.costPrice !== undefined ? inventory.costPrice : "",
      sellingPrice:
        inventory.sellingPrice !== undefined ? inventory.sellingPrice : "",
      category: inventory.category || { _id: "", name: "" }, // This line is the focus
      stockQuantity:
        inventory.stockQuantity !== undefined ? inventory.stockQuantity : "",
      supplier: inventory.supplier?._id || inventory.supplier || "",
      batches: inventory.batches || [],
      imageUrl: inventory.imageUrl || "",
      reorderLevel:
        inventory.reorderLevel !== undefined ? inventory.reorderLevel : "",
      reorderQuantity:
        inventory.reorderQuantity !== undefined
          ? inventory.reorderQuantity
          : "",
      locationName: inventory.locationName?._id || inventory.locationName || "",
      unit: inventory.unit || "",
      isPerishable: inventory.isPerishable || false,
      lastRestocked: inventory.lastRestocked || null,
      isActive: inventory.isActive !== undefined ? inventory.isActive : true,
    });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (id) => {
    setInventoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (inventoryToDelete) {
      dispatch(deleteInventory(inventoryToDelete))
        .unwrap()
        .then(() => {
          console.log("Inventory deleted successfully");
          dispatch(fetchInventories());
        })
        .catch((err) => console.error("Error deleting inventory:", err));
    }
    setDeleteDialogOpen(false);
    setInventoryToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setInventoryToDelete(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "costPrice", headerName: "Cost Price", flex: 1 },
    { field: "sellingPrice", headerName: "Selling Price", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "stockQuantity", headerName: "Stock Quantity", flex: 1 },
    { field: "supplier", headerName: "Supplier", flex: 1 },
    { field: "batchNumbers", headerName: "Batch Numbers", flex: 1 },
    { field: "batchQuantities", headerName: "Batch Quantities", flex: 1 },
    { field: "batchExpiryDates", headerName: "Batch Expiry Dates", flex: 1 },
    {
      field: "imageUrl",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Avatar src={params.value} alt="Inventory Image" variant="rounded" />
      ),
    },
    {
      field: "reorderLevel",
      headerName: "Reorder Level",
      flex: 1,
      renderCell: (params) => (
        <Typography
          color={params.row.stockQuantity <= params.value ? "red" : "inherit"}
          fontWeight={
            params.row.stockQuantity <= params.value ? "bold" : "normal"
          }
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "reorderQuantity", headerName: "Reorder Quantity", flex: 1 },
    { field: "locationName", headerName: "Location Name", flex: 1 },
    { field: "unit", headerName: "Unit", flex: 1 },
    { field: "isPerishable", headerName: "Perishable", flex: 1 },
    { field: "lastRestocked", headerName: "Last Restocked", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    { field: "stockKeeper", headerName: "Stock Keeper", flex: 1 },
    { field: "isActive", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <>
          <i
            className="bx bx-pencil"
            style={{
              color: "#fe6c00",
              cursor: "pointer",
              marginRight: "12px",
            }}
            onClick={() => handleEditClick(params.row)}
          ></i>
          <i
            className="bx bx-trash"
            style={{ color: "#fe1e00", cursor: "pointer" }}
            onClick={() => handleDeleteClick(params.row.id)}
          ></i>
        </>
      ),
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
            "@media print": {
              "& .MuiDataGrid-main": {
                color: "#000", // Ensure text is readable when printing
              },
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

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">Please log in to view inventories.</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TabList onChange={handleChange} aria-label="inventory tabs">
            <Tab label="Inventory Table" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {error ? (
            <div>
              Error: {error.message || "An error occurred."}
              {error.status && <div>Status Code: {error.status}</div>}
            </div>
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
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      padding: "8px",
                      backgroundColor: "#d0d0d0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                      "@media print": {
                        display: "none", // Hide toolbar when printing
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#000" }}>
                      Inventory
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: "8px", alignItems: "center" }}
                    >
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
                        Add New Inventory
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ height: 600, width: "100%" }}>
                    <DataGrid
                      rows={filteredData}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                      disableSelectionOnClick
                    />
                  </Box>
                </Box>
              )}
              <AddNewInventoryDrawer
                open={drawerOpen}
                onClose={() => {
                  setDrawerOpen(false);
                  setEditData(null);
                }}
                editMode={!!editData}
                initialData={editData || {}}
                onSaveSuccess={() => dispatch(fetchInventories())}
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
                    Are you sure you want to delete this inventory?
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
            </>
          )}
        </TabPanel>
        <TabPanel value="1">
          <InventoryDashboard />
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
};

export default Inventory;
