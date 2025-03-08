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
//   fetchInventoryAdjustments,
//   deleteInventoryAdjustment,
// } from "../../redux/slices/inventoryAdjustmentSlice"; // Adjust the path as needed
// import AddNewInventoryAdjustmentDrawer from "../AddDrawerSection/AddNewInventoryAdjustmentDrawer";

// const InventoryAdjustment = () => {
//   const dispatch = useDispatch();
//   const { inventoryAdjustments, isLoading, error } = useSelector(
//     (state) => state.inventoryAdjustments
//   );
//   const { inventories } = useSelector((state) => state.inventories);
//   const { locations } = useSelector((state) => state.locations);
//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   // State for managing the delete confirmation dialog
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [adjustmentToDelete, setAdjustmentToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Fetching inventory adjustments...");
//     dispatch(fetchInventoryAdjustments());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Inventory Adjustments from state:", inventoryAdjustments);
//     if (
//       inventoryAdjustments &&
//       Array.isArray(inventoryAdjustments) &&
//       inventoryAdjustments.length > 0
//     ) {
//       const formattedData = inventoryAdjustments.map((adjustment) => [
//         adjustment.product.name,
//         adjustment.type,
//         adjustment.changeInQuantity,
//         adjustment.newQuantity,
//         adjustment.reason || "N/A",
//         format(new Date(adjustment.transactionDate), "yyyy-MM-dd HH:mm:ss"),
//         adjustment._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No inventory adjustments data available or data is not in expected format"
//       );
//     }
//   }, [inventoryAdjustments]);

//   const handleEditClick = (adjustment) => {
//     if (!adjustment || adjustment.length < 7) {
//       // Adjust length check
//       console.error("Invalid adjustment data:", adjustment);
//       return;
//     }

//     const adjustmentData = {
//       _id: adjustment, // Adjust index for _id
//       product: inventories.find((inv) => inv.name === adjustment)?._id || "",
//       type: adjustment,
//       changeInQuantity: adjustment,
//       newQuantity: adjustment,
//       reason: adjustment,
//       transactionDate: adjustment,
//     };
//     setEditData(adjustmentData);
//     setDrawerOpen(true);
//   };

//   // Function to open delete confirmation dialog
//   const handleDeleteClick = (adjustmentId) => {
//     setAdjustmentToDelete(adjustmentId);
//     setDeleteDialogOpen(true);
//   };

//   // Function to confirm and execute delete
//   const confirmDelete = () => {
//     if (adjustmentToDelete) {
//       dispatch(deleteInventoryAdjustment(adjustmentToDelete))
//         .then(() => {
//           console.log("Adjustment deleted successfully");
//           dispatch(fetchInventoryAdjustments()); // Refresh the list
//         })
//         .catch((error) => {
//           console.error("Error deleting adjustment:", error);
//           // Here you might want to show some error feedback to the user
//         });
//     }
//     setDeleteDialogOpen(false);
//     setAdjustmentToDelete(null);
//   };

//   // Function to cancel delete operation
//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setAdjustmentToDelete(null);
//   };

//   const columns = [
//     { name: "Product Name", options: { filter: true, sort: true } },
//     { name: "Adjustment Type", options: { filter: true, sort: true } },
//     { name: "Change In Quantity", options: { filter: true, sort: true } },
//     { name: "New Quantity", options: { filter: true, sort: true } },
//     { name: "Reason", options: { filter: true, sort: true } },
//     // Removed: { name: "From Location", options: { filter: true, sort: true } },
//     // Removed: { name: "To Location", options: { filter: true, sort: true } },
//     { name: "Date", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         //...
//         customBodyRender: (value, tableMeta) => {
//           const adjustment = tableMeta.rowData;
//           return (
//             <>
//               {/*... */}
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(adjustment)} // Adjust index
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
//         Add New Adjustment
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
//               title={"Inventory Adjustments"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewInventoryAdjustmentDrawer
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
//               onClose={cancelDelete}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Delete Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this adjustment?
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

// export default InventoryAdjustment;

import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import MUIDataTable from "mui-datatables";
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
  Tab,
} from "@mui/material";
import { format } from "date-fns";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventoryAdjustments,
  deleteInventoryAdjustment,
} from "../../redux/slices/inventoryAdjustmentSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewInventoryAdjustmentDrawer from "../AddDrawerSection/AddNewInventoryAdjustmentDrawer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InventoryAdjustmentReports from "./Reports/InventoryAdjustmentReports";

const InventoryAdjustment = () => {
  const dispatch = useDispatch();
  const { inventoryAdjustments, isLoading, error } = useSelector(
    (state) => state.inventoryAdjustments
  );
  const { inventories } = useSelector((state) => state.inventories);
  const { locations } = useSelector((state) => state.locations);
  const { users, user } = useSelector((state) => state.auth); // Assuming users for staff/approvedBy

  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adjustmentToDelete, setAdjustmentToDelete] = useState(null);
  const [value, setValue] = useState("0");

  useEffect(() => {
    console.log("Fetching inventory adjustments...");
    dispatch(fetchInventoryAdjustments());
  }, [dispatch]);

  useEffect(() => {
    console.log("Inventory Adjustments from state:", inventoryAdjustments);
    if (
      inventoryAdjustments &&
      Array.isArray(inventoryAdjustments) &&
      inventoryAdjustments.length > 0
    ) {
      const formattedData = inventoryAdjustments.map((adjustment) => {
        const productName = adjustment.product?.name || "N/A";
        const staffName = adjustment.staff?.fullName || "N/A";
        const approvedByName = adjustment.approvedBy?.fullName || "N/A";
        const locationName = adjustment.adjustmentLocation?.name || "N/A";

        return [
          productName,
          adjustment.type,
          adjustment.adjustmentReason,
          adjustment.changeInQuantity,
          adjustment.previousQuantity,
          adjustment.newQuantity,
          adjustment.adjustmentCost !== undefined
            ? `₦${adjustment.adjustmentCost.toFixed(2)}`
            : "N/A",
          adjustment.reason || "N/A",
          staffName,
          adjustment.status,
          approvedByName,
          adjustment.referenceId || "N/A",
          adjustment.referenceType || "N/A",
          adjustment.batchNumber || "N/A",
          locationName,
          adjustment.transactionDate
            ? format(
                new Date(adjustment.transactionDate),
                "yyyy-MM-dd HH:mm:ss"
              )
            : "N/A",
          adjustment._id || "N/A",
        ];
      });
      console.log("Formatted Data:", formattedData);
      setData(formattedData);
    } else {
      console.log(
        "No inventory adjustments data available or data is not in expected format"
      );
    }
  }, [inventoryAdjustments]);

  const handleEditClick = (adjustmentId) => {
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

    console.log("Edit data:", adjustmentData);
    setEditData(adjustmentData);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (adjustmentId) => {
    setAdjustmentToDelete(adjustmentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (adjustmentToDelete) {
      dispatch(deleteInventoryAdjustment(adjustmentToDelete))
        .then(() => {
          console.log("Adjustment deleted successfully");
          dispatch(fetchInventoryAdjustments());
        })
        .catch((error) => {
          console.error("Error deleting adjustment:", error);
        });
    }
    setDeleteDialogOpen(false);
    setAdjustmentToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setAdjustmentToDelete(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { name: "Product Name", options: { filter: true, sort: true } },
    { name: "Adjustment Type", options: { filter: true, sort: true } },
    { name: "Adjustment Reason", options: { filter: true, sort: true } },
    { name: "Change In Quantity", options: { filter: true, sort: true } },
    { name: "Previous Quantity", options: { filter: true, sort: true } },
    { name: "New Quantity", options: { filter: true, sort: true } },
    { name: "Adjustment Cost", options: { filter: true, sort: true } },
    { name: "Reason", options: { filter: true, sort: true } },
    { name: "Staff", options: { filter: true, sort: true } },
    { name: "Status", options: { filter: true, sort: true } },
    { name: "Approved By", options: { filter: true, sort: true } },
    { name: "Reference ID", options: { filter: true, sort: true } },
    { name: "Reference Type", options: { filter: true, sort: true } },
    { name: "Batch Number", options: { filter: true, sort: true } },
    { name: "Adjustment Location", options: { filter: true, sort: true } },
    { name: "Date", options: { filter: true, sort: true } },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const adjustmentId = tableMeta.rowData[16]; // _id at index 16
          return (
            <span>
              {hasPermission(user, "update:inventoryAdjustment") && (
                <i
                  className="bx bx-pencil"
                  style={{
                    color: "#fe6c00",
                    cursor: "pointer",
                    marginRight: "12px",
                  }}
                  onClick={() => handleEditClick(adjustmentId)}
                ></i>
              )}

              {hasPermission(user, "delete:inventoryAdjustment") && (
                <i
                  className="bx bx-trash"
                  style={{ color: "#fe1e00", cursor: "pointer" }}
                  onClick={() => handleDeleteClick(adjustmentId)}
                ></i>
              )}
            </span>
          );
        },
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
            color: "#fff", // Default color when not selected
            "&.Mui-selected": {
              color: "#fe6c00", // Color when selected
            },
            "&:hover": {
              color: "#fe6c00", // Color on hover
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: "#fe6c00", // Color of the indicator when selected
          },
        },
      },
    },
  });

  const options = {
    filterType: "checkbox",
    rowsPerPage: 10,
    customToolbar: () =>
      hasPermission(user, "write:inventoryAdjustment") ? (
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
          Add New Adjustment
        </Button>
      ) : null,
  };

  const loadingData = [
    [
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
      </Box>,
    ],
  ];
  const memoizedInitialData = useMemo(() => editData || {}, [editData]);

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
          {error ? (
            <div>Error: {error.message || "An error occurred."}</div>
          ) : (
            <>
              <MUIDataTable
                title={"Inventory Adjustments"}
                data={isLoading ? loadingData : data}
                columns={columns}
                options={options}
                initialData={memoizedInitialData}
              />
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
                <DialogTitle>{"Delete Confirmation"}</DialogTitle>
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
            </>
          )}
        </TabPanel>
        <TabPanel value="1">
          <InventoryAdjustmentReports />
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
};

export default InventoryAdjustment;
