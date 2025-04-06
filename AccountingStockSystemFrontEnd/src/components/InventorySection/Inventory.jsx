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
//   TextField,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
// import PrintIcon from "@mui/icons-material/Print"; // Print icon
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

// const Inventory = () => {
//   const dispatch = useDispatch();
//   const { inventories, isLoading, error } = useSelector(
//     (state) => state.inventories
//   );
//   const { categories } = useSelector((state) => state.categories);
//   const { suppliers } = useSelector((state) => state.suppliers);
//   const { locations } = useSelector((state) => state.locations);
//   const { users, isAuthenticated } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [inventoryToDelete, setInventoryToDelete] = useState(null);
//   const [value, setValue] = useState("0");
//   const [searchText, setSearchText] = useState("");

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
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [inventories, categories, suppliers, locations, users]);

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
//     const rows = filteredData
//       .map((row) =>
//         columns
//           .map(
//             (col) =>
//               `"${(row[col.field] || "").toString().replace(/"/g, '""')}"`
//           )
//           .join(",")
//       )
//       .join("\n");
//     const csvContent = `${headers}\n${rows}`;
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "inventory.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = (row) => {
//     const inventory = inventories.find((inv) => inv._id === row.id);
//     if (!inventory) {
//       console.error("Inventory not found for edit:", row.id);
//       return;
//     }
//     setEditData({
//       _id: inventory._id,
//       name: inventory.name || "",
//       description: inventory.description || "",
//       costPrice: inventory.costPrice !== undefined ? inventory.costPrice : "",
//       sellingPrice:
//         inventory.sellingPrice !== undefined ? inventory.sellingPrice : "",
//       category: inventory.category || { _id: "", name: "" }, // This line is the focus
//       stockQuantity:
//         inventory.stockQuantity !== undefined ? inventory.stockQuantity : "",
//       supplier: inventory.supplier?._id || inventory.supplier || "",
//       batches: inventory.batches || [],
//       imageUrl: inventory.imageUrl || "",
//       reorderLevel:
//         inventory.reorderLevel !== undefined ? inventory.reorderLevel : "",
//       reorderQuantity:
//         inventory.reorderQuantity !== undefined
//           ? inventory.reorderQuantity
//           : "",
//       locationName: inventory.locationName?._id || inventory.locationName || "",
//       unit: inventory.unit || "",
//       isPerishable: inventory.isPerishable || false,
//       lastRestocked: inventory.lastRestocked || null,
//       isActive: inventory.isActive !== undefined ? inventory.isActive : true,
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
//                 <Box sx={{ width: "100%" }}>
//                   <Box
//                     sx={{
//                       padding: "8px",
//                       backgroundColor: "#d0d0d0",
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: "8px",
//                       "@media print": {
//                         display: "none", // Hide toolbar when printing
//                       },
//                     }}
//                   >
//                     <Typography variant="h6" sx={{ color: "#000" }}>
//                       Inventory
//                     </Typography>
//                     <Box
//                       sx={{ display: "flex", gap: "8px", alignItems: "center" }}
//                     >
//                       <TextField
//                         variant="outlined"
//                         size="small"
//                         placeholder="Search..."
//                         value={searchText}
//                         onChange={(e) => handleSearch(e.target.value)}
//                         sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//                       />
//                       <IconButton
//                         onClick={handleExport}
//                         sx={{
//                           color: "#473b33",
//                           "&:hover": { color: "#fec80a" },
//                         }}
//                         title="Download CSV"
//                       >
//                         <GetAppIcon />
//                       </IconButton>
//                       <IconButton
//                         onClick={handlePrint}
//                         sx={{
//                           color: "#302924",
//                           "&:hover": { color: "#fec80a" },
//                         }}
//                         title="Print"
//                       >
//                         <PrintIcon />
//                       </IconButton>
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
//                         }}
//                       >
//                         Add New Inventory
//                       </Button>
//                     </Box>
//                   </Box>
//                   <Box sx={{ height: 600, width: "100%" }}>
//                     <DataGrid
//                       rows={filteredData}
//                       columns={columns}
//                       pageSize={10}
//                       rowsPerPageOptions={[10]}
//                       disableSelectionOnClick
//                     />
//                   </Box>
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
//                 onSaveSuccess={() => dispatch(fetchInventories())}
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

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Avatar,
  Tab,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import { format } from "date-fns";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventories,
  deleteInventory,
} from "../../redux/slices/inventoriesSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import AddNewInventoryDrawer from "../AddDrawerSection/AddNewInventoryDrawer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InventoryDashboard from "./Reports/InventoryDashboard";

const Inventory = () => {
  const dispatch = useDispatch();
  const {
    inventories = [],
    isLoading = false,
    error,
  } = useSelector((state) => state.inventories || {});
  const { categories = [] } = useSelector((state) => state.categories || {});
  const { suppliers = [] } = useSelector((state) => state.suppliers || {});
  const { locations = [] } = useSelector((state) => state.locations || {});
  const { users = [], isAuthenticated } = useSelector(
    (state) => state.auth || {}
  );

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);
  const [value, setValue] = useState("0");
  const [searchText, setSearchText] = useState("");
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("Inventory - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching inventories...");
        dispatch(fetchInventories());
        setInitialFetchDone(true);
      } else {
        console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching inventories...");
            dispatch(fetchInventories());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    //console.log("Inventory - Data update", { inventories });
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
          id: inventory._id || "N/A",
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
      //console.log("Formatted Data for DataGrid:", formattedData);
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [inventories, categories, suppliers, locations, users]);

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

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (row) => {
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
        category: inventory.category || { _id: "", name: "" },
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
        locationName:
          inventory.locationName?._id || inventory.locationName || "",
        unit: inventory.unit || "",
        isPerishable: inventory.isPerishable || false,
        lastRestocked: inventory.lastRestocked || null,
        isActive: inventory.isActive !== undefined ? inventory.isActive : true,
      });
      setDrawerOpen(true);
    },
    [inventories]
  );

  const handleDeleteClick = useCallback((id) => {
    setInventoryToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (inventoryToDelete) {
      dispatch(deleteInventory(inventoryToDelete))
        .unwrap()
        .then(() => {
          toast.success("Inventory deleted successfully!", { duration: 5000 });
          dispatch(fetchInventories());
        })
        .catch((err) => {
          toast.error(
            "Error deleting inventory: " + (err.message || "Unknown error")
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setInventoryToDelete(null);
        });
    }
  }, [dispatch, inventoryToDelete]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setInventoryToDelete(null);
  }, []);

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  const columns = useMemo(
    () => [
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
    ],
    [handleEditClick, handleDeleteClick]
  );

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
              "& .MuiTablePagination-root": { color: "#fcfcfc" },
              "& .MuiIconButton-root": { color: "#fcfcfc" },
            },
            "@media print": { "& .MuiDataGrid-main": { color: "#000" } },
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
                Error: {error.message || "An error occurred"}
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
            <Box sx={{ width: "100%" }}>
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
                  Inventory
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
                  pageSizeOptions={[10, 20, 50]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  disableSelectionOnClick
                />
              </Box>
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
                  Delete Confirmation
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
            </Box>
          )}
        </TabPanel>
        <TabPanel value="1">
          <InventoryDashboard />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default Inventory;
