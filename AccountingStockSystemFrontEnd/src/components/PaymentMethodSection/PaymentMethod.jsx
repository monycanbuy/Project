// import React, { useEffect, useState, useCallback } from "react";
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
//   } = useSelector((state) => {
//     console.log("Redux state.paymentMethods:", state.paymentMethods); // Debug full state
//     return state.paymentMethods || {};
//   });
//   const { user } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editPaymentMethodData, setEditPaymentMethodData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Payment methods status:", status);
//     if (status === "idle") {
//       console.log("Dispatching fetchPaymentMethods...");
//       dispatch(fetchPaymentMethods());
//     }
//   }, [dispatch, status]);

//   useEffect(() => {
//     console.log("Payment methods list:", paymentMethods);
//     if (
//       paymentMethods &&
//       Array.isArray(paymentMethods) &&
//       paymentMethods.length > 0
//     ) {
//       const formattedData = paymentMethods.map((method) => [
//         method.name || "N/A",
//         method._id || "N/A",
//       ]);
//       console.log("Formatted data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log("No payment methods data available");
//       setData([]);
//     }
//   }, [paymentMethods]);

//   const handleEditClick = useCallback(
//     (index) => {
//       const method = paymentMethods[index];
//       if (!method) {
//         console.error("Invalid payment method data at index:", index);
//         return;
//       }
//       console.log("Editing payment method:", method);
//       setEditPaymentMethodData(method);
//       setDrawerOpen(true);
//     },
//     [paymentMethods]
//   );

//   const handleDeleteClick = useCallback((methodId) => {
//     console.log("Delete clicked for ID:", methodId);
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
//     { name: "Name", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => {
//           const method = paymentMethods[tableMeta.rowIndex];
//           return (
//             <>
//               {hasPermission(user, "update:paymentmethod") && (
//                 <i
//                   className="bx bx-pencil"
//                   style={{
//                     color: "#fe6c00",
//                     cursor: "pointer",
//                     marginRight: "12px",
//                   }}
//                   onClick={() => handleEditClick(tableMeta.rowIndex)}
//                 ></i>
//               )}

//               {hasPermission(user, "delete:paymentmethod") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleDeleteClick(method._id)}
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
//       hasPermission(user, "write:paymentmethod") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={() => {
//             console.log("Add New Payment Method clicked");
//             setEditPaymentMethodData(null);
//             setDrawerOpen(true);
//           }}
//           sx={{
//             backgroundColor: "#fe6c00",
//             color: "#fff",
//             "&:hover": { backgroundColor: "#fec80a", color: "#bdbabb" },
//           }}
//         >
//           Add New Payment Method
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
//           <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//             Error:{" "}
//             {typeof error === "object" && error.message
//               ? error.message
//               : error || "An error occurred."}
//           </div>
//         ) : (
//           <>
//             <MUIDataTable
//               title="Payment Methods"
//               data={status === "loading" ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
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
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default PaymentMethod;

import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPaymentMethods,
  deletePaymentMethod,
} from "../../redux/slices/paymentMethodsSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewPaymentMethodDrawer from "../AddDrawerSection/AddNewPaymentMethodDrawer";

const PaymentMethod = () => {
  const dispatch = useDispatch();
  const {
    paymentMethods = [], // Default to empty array
    status, // "idle", "loading", "succeeded", "failed"
    error,
  } = useSelector((state) => {
    console.log("Redux state.paymentMethods:", state.paymentMethods); // Debug full state
    return state.paymentMethods || {};
  });
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editPaymentMethodData, setEditPaymentMethodData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);

  useEffect(() => {
    console.log("Payment methods status:", status);
    if (status === "idle") {
      console.log("Dispatching fetchPaymentMethods...");
      dispatch(fetchPaymentMethods());
    }
  }, [dispatch, status]);

  useEffect(() => {
    console.log("Payment methods list:", paymentMethods);
    if (
      paymentMethods &&
      Array.isArray(paymentMethods) &&
      paymentMethods.length > 0
    ) {
      const formattedData = paymentMethods.map((method) => ({
        id: method._id || "N/A",
        name: method.name || "N/A",
      }));
      console.log("Formatted data:", formattedData);
      setData(formattedData);
    } else {
      console.log("No payment methods data available");
      setData([]);
    }
  }, [paymentMethods]);

  const handleEditClick = useCallback((method) => {
    if (!method) {
      console.error("Invalid payment method data:", method);
      return;
    }
    console.log("Editing payment method:", method);
    setEditPaymentMethodData(method);
    setDrawerOpen(true);
  }, []);

  const handleDeleteClick = useCallback((methodId) => {
    console.log("Delete clicked for ID:", methodId);
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
          dispatch(fetchPaymentMethods()); // Refresh the list
        })
        .catch((error) => {
          toast.error(
            "Error deleting payment method: " + (error || "Unknown error"),
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

  const columns = [
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
                onClick={() => handleEditClick(method)}
              ></i>
            )}

            {hasPermission(user, "delete:paymentmethod") && (
              <i
                className="bx bx-trash"
                style={{ color: "#fe1e00", cursor: "pointer" }}
                onClick={() => handleDeleteClick(method._id)}
              ></i>
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
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#d0d0d0",
              "& .MuiButton-root": { color: "#3f51b5" },
            },
          },
        },
      },
    },
  });

  const loadingData = [
    {
      id: "loading",
      name: (
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
      <div>
        {error ? (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            Error:{" "}
            {typeof error === "object" && error.message
              ? error.message
              : error || "An error occurred."}
          </div>
        ) : (
          <>
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
            ) : (
              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                  components={{
                    Toolbar: () =>
                      hasPermission(user, "write:paymentmethod") ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            console.log("Add New Payment Method clicked");
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
                      ) : null,
                  }}
                />
              </Box>
            )}
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
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default PaymentMethod;
