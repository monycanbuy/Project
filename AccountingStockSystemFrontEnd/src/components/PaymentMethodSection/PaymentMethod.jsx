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
//   IconButton,
//   Typography,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
// import PrintIcon from "@mui/icons-material/Print"; // Print icon
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchPaymentMethods,
//   deletePaymentMethod,
// } from "../../redux/slices/paymentMethodsSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewPaymentMethodDrawer from "../AddDrawerSection/AddNewPaymentMethodDrawer";

// const PaymentMethod = () => {
//   const dispatch = useDispatch();
//   const {
//     paymentMethods = [], // Default to empty array
//     status, // "idle", "loading", "succeeded", "failed"
//     error,
//   } = useSelector((state) => state.paymentMethods || {});
//   const { user } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editPaymentMethodData, setEditPaymentMethodData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchPaymentMethods());
//     }
//   }, [dispatch, status]);

//   useEffect(() => {
//     if (paymentMethods.length > 0) {
//       const formattedData = paymentMethods.map((method) => ({
//         id: method._id || "N/A",
//         name: method.name || "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [paymentMethods]);

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
//     link.download = "payment_methods.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback((method) => {
//     if (!method) {
//       console.error("Invalid payment method data:", method);
//       return;
//     }
//     setEditPaymentMethodData(method);
//     setDrawerOpen(true);
//   }, []);

//   const handleDeleteClick = useCallback((methodId) => {
//     setPaymentMethodToDelete(methodId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const handleConfirmDelete = useCallback(() => {
//     if (paymentMethodToDelete) {
//       dispatch(deletePaymentMethod(paymentMethodToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("Payment method deleted successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchPaymentMethods()); // Refresh the list
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting payment method: " + (error || "Unknown error"),
//             { duration: 5000 }
//           );
//         })
//         .finally(() => {
//           setDeleteDialogOpen(false);
//           setPaymentMethodToDelete(null);
//         });
//     }
//   }, [dispatch, paymentMethodToDelete]);

//   const handleCloseDialog = useCallback(() => {
//     setDeleteDialogOpen(false);
//     setPaymentMethodToDelete(null);
//   }, []);

//   const columns = [
//     { field: "name", headerName: "Name", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => {
//         const method = paymentMethods.find((m) => m._id === params.row.id);
//         return (
//           <>
//             {hasPermission(user, "update:paymentmethod") && (
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(method)}
//               ></i>
//             )}

//             {hasPermission(user, "delete:paymentmethod") && (
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(method._id)}
//               ></i>
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

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         {error ? (
//           <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//             Error:{" "}
//             {typeof error === "object" && error.message
//               ? error.message
//               : error || "An error occurred."}
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
//                 Payment Methods
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
//                 {hasPermission(user, "write:paymentmethod") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditPaymentMethodData(null);
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
//                     Add New Payment Method
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
//                   pageSize={10}
//                   rowsPerPageOptions={[10]}
//                   disableSelectionOnClick
//                 />
//               </Box>
//             )}
//             <AddNewPaymentMethodDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditPaymentMethodData(null);
//               }}
//               editMode={!!editPaymentMethodData}
//               initialData={editPaymentMethodData || {}}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={handleCloseDialog}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to delete this payment method?
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
//       </Box>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default PaymentMethod;

import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  IconButton,
  Typography,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPaymentMethods,
  deletePaymentMethod,
} from "../../redux/slices/paymentMethodsSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewPaymentMethodDrawer from "../AddDrawerSection/AddNewPaymentMethodDrawer";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const {
    paymentMethods = [],
    status = "idle",
    error,
  } = useSelector((state) => state.paymentMethods || {});
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editPaymentMethodData, setEditPaymentMethodData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("PaymentMethod - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching payment methods...");
        dispatch(fetchPaymentMethods());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching payment methods...");
            dispatch(fetchPaymentMethods());
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
    //console.log("PaymentMethod - Data update", { paymentMethods, status });
    if (
      paymentMethods &&
      Array.isArray(paymentMethods) &&
      paymentMethods.length > 0
    ) {
      const formattedData = paymentMethods.map((method) => ({
        id: method._id || "N/A",
        name: method.name || "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [paymentMethods]);

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
    link.download = "payment_methods.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (method) => {
      if (!method) {
        console.error("Invalid payment method data:", method);
        return;
      }
      const originalMethod = paymentMethods.find((m) => m._id === method.id);
      setEditPaymentMethodData(originalMethod);
      setDrawerOpen(true);
    },
    [paymentMethods]
  );

  const handleDeleteClick = useCallback((methodId) => {
    setPaymentMethodToDelete(methodId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (paymentMethodToDelete) {
      dispatch(deletePaymentMethod(paymentMethodToDelete))
        .unwrap()
        .then(() => {
          toast.success("Payment method deleted successfully!", {
            duration: 5000,
          });
          dispatch(fetchPaymentMethods());
        })
        .catch((error) => {
          toast.error(
            "Error deleting payment method: " +
              (error.message || "Unknown error"),
            { duration: 5000 }
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setPaymentMethodToDelete(null);
        });
    }
  }, [dispatch, paymentMethodToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setPaymentMethodToDelete(null);
  }, []);

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => {
          const method = paymentMethods.find((m) => m._id === params.row.id);
          return (
            <>
              {hasPermission(user, "update:paymentmethod") && (
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
              {hasPermission(user, "delete:paymentmethod") && (
                <i
                  className="bx bx-trash"
                  style={{ color: "#fe1e00", cursor: "pointer" }}
                  onClick={() => handleDeleteClick(method?._id)}
                ></i>
              )}
            </>
          );
        },
      },
    ],
    [user, paymentMethods, handleEditClick, handleDeleteClick]
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", minHeight: "100vh", position: "relative" }}>
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
                Payment Methods
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
                {hasPermission(user, "write:paymentmethod") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEditPaymentMethodData(null);
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
                    Add New Payment Method
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
            <AddNewPaymentMethodDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditPaymentMethodData(null);
              }}
              editMode={!!editPaymentMethodData}
              initialData={editPaymentMethodData || {}}
            />
            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this payment method?
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
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default PaymentMethod;
