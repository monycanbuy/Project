// import React, { useEffect, useState } from "react";
// import { useMemo } from "react";
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
//   Tab,
//   TextField,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
// import PrintIcon from "@mui/icons-material/Print"; // Print icon
// import { format } from "date-fns";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchInventoryAdjustments,
//   deleteInventoryAdjustment,
// } from "../../redux/slices/inventoryAdjustmentSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewInventoryAdjustmentDrawer from "../AddDrawerSection/AddNewInventoryAdjustmentDrawer";
// import InventoryAdjustmentReports from "./Reports/InventoryAdjustmentReports";
// import { Toaster, toast } from "react-hot-toast";

// const InventoryAdjustment = () => {
//   const dispatch = useDispatch();
//   const { inventoryAdjustments, isLoading, error } = useSelector(
//     (state) => state.inventoryAdjustments
//   );
//   const { inventories } = useSelector((state) => state.inventories);
//   const { locations } = useSelector((state) => state.locations);
//   const { users, user } = useSelector((state) => state.auth);

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [adjustmentToDelete, setAdjustmentToDelete] = useState(null);
//   const [value, setValue] = useState("0");
//   const [searchText, setSearchText] = useState("");
//   const [filteredRows, setFilteredRows] = useState([]);

//   useEffect(() => {
//     console.log("Fetching inventory adjustments...");
//     dispatch(fetchInventoryAdjustments());
//   }, [dispatch]);

//   const rows = useMemo(
//     () =>
//       inventoryAdjustments
//         ? inventoryAdjustments.map((adjustment) => ({
//             id: adjustment._id,
//             productName: adjustment.product?.name || "N/A",
//             type: adjustment.type || "N/A",
//             adjustmentReason: adjustment.adjustmentReason || "N/A",
//             changeInQuantity: adjustment.changeInQuantity ?? "N/A",
//             previousQuantity: adjustment.previousQuantity ?? "N/A",
//             newQuantity: adjustment.newQuantity ?? "N/A",
//             adjustmentCost:
//               adjustment.adjustmentCost !== undefined
//                 ? `₦${adjustment.adjustmentCost.toFixed(2)}`
//                 : "N/A",
//             reason: adjustment.reason || "N/A",
//             staff: adjustment.staff?.fullName || "N/A",
//             status: adjustment.status || "N/A",
//             approvedBy: adjustment.approvedBy?.fullName || "N/A",
//             referenceId: adjustment.referenceId || "N/A",
//             referenceType: adjustment.referenceType || "N/A",
//             batchNumber: adjustment.batchNumber || "N/A",
//             adjustmentLocation: adjustment.adjustmentLocation?.name || "N/A",
//             transactionDate: adjustment.transactionDate
//               ? format(
//                   new Date(adjustment.transactionDate),
//                   "yyyy-MM-dd HH:mm:ss"
//                 )
//               : "N/A",
//           }))
//         : [],
//     [inventoryAdjustments]
//   );

//   useEffect(() => {
//     setFilteredRows(rows); // Initialize filtered rows with all rows
//   }, [rows]);

//   // Search functionality
//   const handleSearch = (searchVal) => {
//     setSearchText(searchVal);
//     if (searchVal.trim() === "") {
//       setFilteredRows(rows);
//     } else {
//       const filtered = rows.filter((row) =>
//         Object.values(row).some(
//           (value) =>
//             value &&
//             value.toString().toLowerCase().includes(searchVal.toLowerCase())
//         )
//       );
//       setFilteredRows(filtered);
//     }
//   };

//   // CSV Export functionality
//   const handleExport = () => {
//     const headers = columns.map((col) => col.headerName).join(",");
//     const csvRows = filteredRows
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
//     link.download = "inventory_adjustments.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = (adjustmentId) => {
//     const adjustment = inventoryAdjustments.find(
//       (adj) => adj._id === adjustmentId
//     );
//     if (!adjustment) {
//       console.error("Adjustment not found:", adjustmentId);
//       return;
//     }

//     const adjustmentData = {
//       _id: adjustment._id,
//       product: adjustment.product?._id || "",
//       type: adjustment.type || "",
//       adjustmentReason: adjustment.adjustmentReason || "",
//       changeInQuantity:
//         adjustment.changeInQuantity !== undefined
//           ? String(adjustment.changeInQuantity)
//           : "",
//       previousQuantity:
//         adjustment.previousQuantity !== undefined
//           ? String(adjustment.previousQuantity)
//           : "",
//       newQuantity:
//         adjustment.newQuantity !== undefined
//           ? String(adjustment.newQuantity)
//           : "",
//       adjustmentCost:
//         adjustment.adjustmentCost !== undefined
//           ? String(adjustment.adjustmentCost)
//           : "",
//       reason: adjustment.reason || "",
//       staff: adjustment.staff?._id || "",
//       status: adjustment.status || "Pending",
//       approvedBy: adjustment.approvedBy?._id || null,
//       referenceId: adjustment.referenceId || null,
//       referenceType: adjustment.referenceType || null,
//       batchNumber: adjustment.batchNumber || "",
//       adjustmentLocation: adjustment.adjustmentLocation?._id || null,
//       transactionDate: adjustment.transactionDate
//         ? format(new Date(adjustment.transactionDate), "yyyy-MM-dd")
//         : null,
//     };

//     console.log("Edit data:", adjustmentData);
//     setEditData(adjustmentData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (adjustmentId) => {
//     setAdjustmentToDelete(adjustmentId);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     if (adjustmentToDelete) {
//       dispatch(deleteInventoryAdjustment(adjustmentToDelete))
//         .unwrap()
//         .then(() => {
//           console.log("Adjustment deleted successfully");
//           toast.success("Inventory adjustment deleted successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchInventoryAdjustments());
//         })
//         .catch((error) => {
//           console.error("Error deleting adjustment:", error);
//           toast.error(
//             "Error deleting adjustment: " + (error.message || "Unknown error"),
//             { duration: 5000 }
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setAdjustmentToDelete(null);
//   };

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setAdjustmentToDelete(null);
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     {
//       field: "productName",
//       headerName: "Product Name",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "type",
//       headerName: "Adjustment Type",
//       width: 130,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "adjustmentReason",
//       headerName: "Adjustment Reason",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "changeInQuantity",
//       headerName: "Change In Quantity",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "previousQuantity",
//       headerName: "Previous Quantity",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "newQuantity",
//       headerName: "New Quantity",
//       width: 130,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "adjustmentCost",
//       headerName: "Adjustment Cost",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "reason",
//       headerName: "Reason",
//       width: 200,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "staff",
//       headerName: "Staff",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       width: 120,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "approvedBy",
//       headerName: "Approved By",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "referenceId",
//       headerName: "Reference ID",
//       width: 130,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "referenceType",
//       headerName: "Reference Type",
//       width: 130,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "batchNumber",
//       headerName: "Batch Number",
//       width: 130,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "adjustmentLocation",
//       headerName: "Adjustment Location",
//       width: 150,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "transactionDate",
//       headerName: "Date",
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
//       renderCell: (params) => (
//         <span>
//           {hasPermission(user, "update:inventoryAdjustment") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(params.row.id)}
//             />
//           )}
//           {hasPermission(user, "delete:inventoryAdjustment") && (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(params.row.id)}
//             />
//           )}
//         </span>
//       ),
//     },
//   ];

//   // const theme = createTheme({
//   //   components: {
//   //     MuiDataGrid: {
//   //       styleOverrides: {
//   //         root: {
//   //           backgroundColor: "#f0f0f0",
//   //           "& .MuiDataGrid-row": {
//   //             backgroundColor: "#29221d",
//   //             "&:hover": {
//   //               backgroundColor: "#1e1611",
//   //               "& .MuiDataGrid-cell": { color: "#bdbabb" },
//   //             },
//   //           },
//   //           "& .MuiDataGrid-cell": { color: "#fff", fontSize: "18px" },
//   //           "& .MuiDataGrid-columnHeaders": {
//   //             backgroundColor: "#e0e0e0",
//   //             "& .MuiDataGrid-columnHeaderTitle": {
//   //               color: "#000",
//   //               fontSize: "18px",
//   //               fontWeight: "bold",
//   //             },
//   //           },
//   //           "@media print": {
//   //             "& .MuiDataGrid-main": {
//   //               color: "#000", // Ensure text is readable when printing
//   //             },
//   //           },
//   //         },
//   //       },
//   //     },
//   //     MuiTab: {
//   //       styleOverrides: {
//   //         root: {
//   //           color: "#fff",
//   //           "&.Mui-selected": { color: "#fe6c00" },
//   //           "&:hover": { color: "#fe6c00" },
//   //         },
//   //       },
//   //     },
//   //     MuiTabs: {
//   //       styleOverrides: {
//   //         indicator: { backgroundColor: "#fe6c00" },
//   //       },
//   //     },
//   //   },
//   // });
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
//             "@media print": {
//               "& .MuiDataGrid-main": {
//                 color: "#000", // Ensure text is readable when printing
//               },
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
//   const memoizedInitialData = useMemo(() => editData || {}, [editData]);

//   return (
//     <ThemeProvider theme={theme}>
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="Inventory tabs">
//             <Tab label="Inventory Adjustment Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//               Error: {error.message || "An error occurred."}
//             </div>
//           ) : (
//             <Box sx={{ width: "100%", position: "relative" }}>
//               <Box
//                 sx={{
//                   padding: "8px",
//                   backgroundColor: "#d0d0d0",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "8px",
//                   "@media print": {
//                     display: "none", // Hide toolbar when printing
//                   },
//                 }}
//               >
//                 <Typography variant="h6" sx={{ color: "#000" }}>
//                   Inventory Adjustments
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                   <TextField
//                     variant="outlined"
//                     size="small"
//                     placeholder="Search..."
//                     value={searchText}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//                   />
//                   <IconButton
//                     onClick={handleExport}
//                     sx={{
//                       color: "#473b33",
//                       "&:hover": { color: "#fec80a" },
//                     }}
//                     title="Download CSV"
//                   >
//                     <GetAppIcon />
//                   </IconButton>
//                   <IconButton
//                     onClick={handlePrint}
//                     sx={{
//                       color: "#302924",
//                       "&:hover": { color: "#fec80a" },
//                     }}
//                     title="Print"
//                   >
//                     <PrintIcon />
//                   </IconButton>
//                   {hasPermission(user, "write:inventoryAdjustment") && (
//                     <Button
//                       variant="contained"
//                       size="small"
//                       onClick={() => {
//                         setEditData(null);
//                         setDrawerOpen(true);
//                       }}
//                       sx={{
//                         backgroundColor: "#fe6c00",
//                         color: "#fff",
//                         "&:hover": {
//                           backgroundColor: "#fec80a",
//                           color: "#bdbabb",
//                         },
//                       }}
//                     >
//                       Add New Adjustment
//                     </Button>
//                   )}
//                 </Box>
//               </Box>
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
//                   <CircularProgress sx={{ color: "#fe6c00" }} />
//                 </Box>
//               ) : (
//                 <Box sx={{ height: 600, width: "100%" }}>
//                   <DataGrid
//                     rows={filteredRows}
//                     columns={columns}
//                     pageSizeOptions={[10, 20, 50]}
//                     initialState={{
//                       pagination: { paginationModel: { pageSize: 10 } },
//                     }}
//                     checkboxSelection={false}
//                     disableRowSelectionOnClick
//                   />
//                 </Box>
//               )}
//               <AddNewInventoryAdjustmentDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={memoizedInitialData}
//               />
//               <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//                 <DialogTitle>{"Delete Confirmation"}</DialogTitle>
//                 <DialogContent>
//                   <DialogContentText>
//                     Are you sure you want to delete this adjustment?
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
//             </Box>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <InventoryAdjustmentReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default InventoryAdjustment;

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
  Tab,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import { format } from "date-fns";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventoryAdjustments,
  deleteInventoryAdjustment,
} from "../../redux/slices/inventoryAdjustmentSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewInventoryAdjustmentDrawer from "../AddDrawerSection/AddNewInventoryAdjustmentDrawer";
import InventoryAdjustmentReports from "./Reports/InventoryAdjustmentReports";

const InventoryAdjustment = () => {
  const dispatch = useDispatch();
  const {
    inventoryAdjustments = [],
    isLoading = false,
    error,
  } = useSelector((state) => state.inventoryAdjustments || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adjustmentToDelete, setAdjustmentToDelete] = useState(null);
  const [value, setValue] = useState("0");
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("InventoryAdjustment - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching inventory adjustments...");
        dispatch(fetchInventoryAdjustments());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching inventory adjustments...");
            dispatch(fetchInventoryAdjustments());
            setInitialFetchDone(true);
          })
          .catch((err) => {
            console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  const rows = useMemo(
    () =>
      inventoryAdjustments.map((adjustment) => ({
        id: adjustment._id || "N/A",
        productName: adjustment.product?.name || "N/A",
        type: adjustment.type || "N/A",
        adjustmentReason: adjustment.adjustmentReason || "N/A",
        changeInQuantity: adjustment.changeInQuantity ?? "N/A",
        previousQuantity: adjustment.previousQuantity ?? "N/A",
        newQuantity: adjustment.newQuantity ?? "N/A",
        adjustmentCost:
          adjustment.adjustmentCost !== undefined
            ? `₦${adjustment.adjustmentCost.toFixed(2)}`
            : "N/A",
        reason: adjustment.reason || "N/A",
        staff: adjustment.staff?.fullName || "N/A",
        status: adjustment.status || "N/A",
        approvedBy: adjustment.approvedBy?.fullName || "N/A",
        referenceId: adjustment.referenceId || "N/A",
        referenceType: adjustment.referenceType || "N/A",
        batchNumber: adjustment.batchNumber || "N/A",
        adjustmentLocation: adjustment.adjustmentLocation?.name || "N/A",
        transactionDate: adjustment.transactionDate
          ? format(new Date(adjustment.transactionDate), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
      })),
    [inventoryAdjustments]
  );

  useEffect(() => {
    //console.log("InventoryAdjustment - Rows updated", { rows });
    setFilteredRows(rows);
  }, [rows]);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (searchVal.trim() === "") {
        setFilteredRows(rows);
      } else {
        const filtered = rows.filter((row) =>
          Object.values(row).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchVal.toLowerCase())
          )
        );
        setFilteredRows(filtered);
      }
    },
    [rows]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredRows
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
    link.download = "inventory_adjustments.csv";
    link.click();
  }, [filteredRows]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEditClick = useCallback(
    (adjustmentId) => {
      const adjustment = inventoryAdjustments.find(
        (adj) => adj._id === adjustmentId
      );
      if (!adjustment) {
        console.error("Adjustment not found:", adjustmentId);
        return;
      }

      const adjustmentData = {
        _id: adjustment._id,
        product: adjustment.product?._id || "",
        type: adjustment.type || "",
        adjustmentReason: adjustment.adjustmentReason || "",
        changeInQuantity:
          adjustment.changeInQuantity !== undefined
            ? String(adjustment.changeInQuantity)
            : "",
        previousQuantity:
          adjustment.previousQuantity !== undefined
            ? String(adjustment.previousQuantity)
            : "",
        newQuantity:
          adjustment.newQuantity !== undefined
            ? String(adjustment.newQuantity)
            : "",
        adjustmentCost:
          adjustment.adjustmentCost !== undefined
            ? String(adjustment.adjustmentCost)
            : "",
        reason: adjustment.reason || "",
        staff: adjustment.staff?._id || "",
        status: adjustment.status || "Pending",
        approvedBy: adjustment.approvedBy?._id || null,
        referenceId: adjustment.referenceId || null,
        referenceType: adjustment.referenceType || null,
        batchNumber: adjustment.batchNumber || "",
        adjustmentLocation: adjustment.adjustmentLocation?._id || null,
        transactionDate: adjustment.transactionDate
          ? format(new Date(adjustment.transactionDate), "yyyy-MM-dd")
          : null,
      };

      //console.log("Edit data:", adjustmentData);
      setEditData(adjustmentData);
      setDrawerOpen(true);
    },
    [inventoryAdjustments]
  );

  const handleDeleteClick = useCallback((adjustmentId) => {
    setAdjustmentToDelete(adjustmentId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (adjustmentToDelete) {
      dispatch(deleteInventoryAdjustment(adjustmentToDelete))
        .unwrap()
        .then(() => {
          //console.log("Adjustment deleted successfully");
          toast.success("Inventory adjustment deleted successfully!", {
            duration: 5000,
          });
          dispatch(fetchInventoryAdjustments());
        })
        .catch((error) => {
          console.error("Error deleting adjustment:", error);
          toast.error(
            "Error deleting adjustment: " + (error.message || "Unknown error"),
            { duration: 5000 }
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setAdjustmentToDelete(null);
        });
    }
  }, [dispatch, adjustmentToDelete]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setAdjustmentToDelete(null);
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
      { field: "productName", headerName: "Product Name", width: 150 },
      { field: "type", headerName: "Adjustment Type", width: 130 },
      {
        field: "adjustmentReason",
        headerName: "Adjustment Reason",
        width: 150,
      },
      {
        field: "changeInQuantity",
        headerName: "Change In Quantity",
        width: 150,
      },
      {
        field: "previousQuantity",
        headerName: "Previous Quantity",
        width: 150,
      },
      { field: "newQuantity", headerName: "New Quantity", width: 130 },
      { field: "adjustmentCost", headerName: "Adjustment Cost", width: 150 },
      { field: "reason", headerName: "Reason", width: 200 },
      { field: "staff", headerName: "Staff", width: 150 },
      { field: "status", headerName: "Status", width: 120 },
      { field: "approvedBy", headerName: "Approved By", width: 150 },
      { field: "referenceId", headerName: "Reference ID", width: 130 },
      { field: "referenceType", headerName: "Reference Type", width: 130 },
      { field: "batchNumber", headerName: "Batch Number", width: 130 },
      {
        field: "adjustmentLocation",
        headerName: "Adjustment Location",
        width: 150,
      },
      { field: "transactionDate", headerName: "Date", width: 180 },
      {
        field: "action",
        headerName: "Action",
        width: 150,
        filterable: false,
        sortable: false,
        renderCell: (params) => (
          <span>
            {hasPermission(user, "update:inventoryAdjustment") && (
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleEditClick(params.row.id)}
              />
            )}
            {hasPermission(user, "delete:inventoryAdjustment") && (
              <i
                className="bx bx-trash"
                style={{ color: "#fe1e00", cursor: "pointer" }}
                onClick={() => handleDeleteClick(params.row.id)}
              />
            )}
          </span>
        ),
      },
    ],
    [user, handleEditClick, handleDeleteClick]
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
        <Typography variant="h6">
          Please log in to view inventory adjustments.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="Inventory tabs">
            <Tab label="Inventory Adjustment Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {isLoading && filteredRows.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                width: "100%",
              }}
            >
              <CircularProgress sx={{ color: "#fe6c00" }} />
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
            <Box sx={{ width: "100%", position: "relative" }}>
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
                  Inventory Adjustments
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
                  {hasPermission(user, "write:inventoryAdjustment") && (
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
                      Add New Adjustment
                    </Button>
                  )}
                </Box>
              </Box>
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  pageSizeOptions={[10, 20, 50]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  checkboxSelection={false}
                  disableRowSelectionOnClick
                />
              </Box>
              <AddNewInventoryAdjustmentDrawer
                open={drawerOpen}
                onClose={() => {
                  setDrawerOpen(false);
                  setEditData(null);
                }}
                editMode={!!editData}
                initialData={editData || {}}
              />
              <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this adjustment?
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
          <InventoryAdjustmentReports />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default InventoryAdjustment;
