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
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
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
//       setFilteredData(formattedData); // Initialize filtered data
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [purchaseOrders]);

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
//     link.download = "purchase_orders.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = (order) => {
//     setEditData(order);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (orderId) => {
//     setPurchaseOrderToVoid(orderId);
//     setVoidDialogOpen(true);
//   };

//   const confirmVoid = () => {
//     if (purchaseOrderToVoid) {
//       dispatch(voidPurchaseOrder(purchaseOrderToVoid))
//         .unwrap()
//         .then(() => {
//           dispatch(fetchPurchaseOrders());
//           toast.success("Purchase order voided successfully!");
//         })
//         .catch((error) => {
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
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
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
//                 Purchase Orders
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
//                 {hasPermission(user, "write:purchaseorders") && (
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
//                     Add New Purchase Order
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
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default PurchaseOrders;

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchaseOrders,
  voidPurchaseOrder,
} from "../../redux/slices/purchaseOrderSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewPurchaseOrderDrawer from "../AddDrawerSection/AddNewPurchaseOrderDrawer";
import { toast, Toaster } from "react-hot-toast";

const PurchaseOrders = () => {
  const dispatch = useDispatch();
  const {
    purchaseOrders = [],
    isLoading = false,
    error,
  } = useSelector((state) => state.purchaseOrders || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [purchaseOrderToVoid, setPurchaseOrderToVoid] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("PurchaseOrders - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching purchase orders...");
        dispatch(fetchPurchaseOrders());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching purchase orders...");
            dispatch(fetchPurchaseOrders());
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
    //console.log("PurchaseOrders - Data update", { purchaseOrders });
    if (purchaseOrders && Array.isArray(purchaseOrders)) {
      const formattedData = purchaseOrders.map((order) => ({
        id: order._id || "N/A",
        supplier: order.supplier ? order.supplier.contactPerson : "N/A",
        orderDate: order.orderDate
          ? format(new Date(order.orderDate), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        expectedDelivery: order.expectedDelivery
          ? format(new Date(order.expectedDelivery), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        items: order.items.map((item) => ({
          productName: item.inventory ? item.inventory.name : "N/A",
          quantity: item.quantityOrdered ?? "N/A",
          unitPrice: item.unitPrice ?? "N/A",
        })),
        status: order.status || "N/A",
      }));
      //console.log("Formatted Data:", formattedData);
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
      // console.log(
      //   "No purchase orders data available or data is not in expected format"
      // );
    }
  }, [purchaseOrders]);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (searchVal.trim() === "") {
        setFilteredData(data);
      } else {
        const filtered = data.filter((row) =>
          Object.values(row).some((value) => {
            if (Array.isArray(value)) {
              return value.some(
                (item) =>
                  item.productName &&
                  item.productName
                    .toLowerCase()
                    .includes(searchVal.toLowerCase())
              );
            }
            return (
              value &&
              value.toString().toLowerCase().includes(searchVal.toLowerCase())
            );
          })
        );
        setFilteredData(filtered);
      }
    },
    [data]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredData
      .map((row) => {
        const rowValues = columns.map((col) => {
          if (col.field === "items") {
            const itemsString = row[col.field]
              .map(
                (item) =>
                  `${item.productName} - ${item.quantity} x ₦${item.unitPrice}`
              )
              .join("; ");
            return `"${itemsString.replace(/"/g, '""')}"`;
          }
          return `"${(row[col.field] || "").toString().replace(/"/g, '""')}"`;
        });
        return rowValues.join(",");
      })
      .join("\n");
    const csvContent = `${headers}\n${csvRows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "purchase_orders.csv";
    link.click();
  }, [filteredData]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEditClick = useCallback((order) => {
    setEditData(order);
    setDrawerOpen(true);
  }, []);

  const handleVoidClick = useCallback((orderId) => {
    setPurchaseOrderToVoid(orderId);
    setVoidDialogOpen(true);
  }, []);

  const confirmVoid = useCallback(() => {
    if (purchaseOrderToVoid) {
      dispatch(voidPurchaseOrder(purchaseOrderToVoid))
        .unwrap()
        .then(() => {
          toast.success("Purchase order voided successfully!", {
            duration: 5000,
          });
          dispatch(fetchPurchaseOrders());
        })
        .catch((error) => {
          toast.error(
            `Error voiding purchase order: ${error.message || "Unknown error"}`,
            { duration: 5000 }
          );
        })
        .finally(() => {
          setVoidDialogOpen(false);
          setPurchaseOrderToVoid(null);
        });
    }
  }, [dispatch, purchaseOrderToVoid]);

  const cancelVoid = useCallback(() => {
    setVoidDialogOpen(false);
    setPurchaseOrderToVoid(null);
  }, []);

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  const columns = useMemo(
    () => [
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
                {Number(item.unitPrice).toFixed(2)}
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
    ],
    [user, handleEditClick, handleVoidClick]
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
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view purchase orders.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {isLoading && filteredData.length === 0 ? (
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
              {error.status && ` (Status: ${error.status})`}
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
          <>
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
                Void Confirmation
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
          </>
        )}
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default PurchaseOrders;
