// import React, { useEffect, useState, useMemo } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
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
//   Typography,
//   IconButton,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchLaundryServices,
//   deleteLaundryService,
// } from "../../redux/slices/laundryServicesSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewLaundryServiceDrawer from "../AddDrawerSection/AddNewLaundryServiceDrawer";
// import { Toaster, toast } from "react-hot-toast";

// const Laundrys = () => {
//   const dispatch = useDispatch();
//   const { services, status, error } = useSelector(
//     (state) => state.laundryServices
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [serviceToDelete, setServiceToDelete] = useState(null);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     if (status === "idle" || status === "failed") {
//       console.log("Fetching laundry services...");
//       dispatch(fetchLaundryServices());
//     }
//   }, [dispatch, status]);

//   // Format rows once from services
//   const rows = useMemo(() => {
//     console.log("Formatting rows from services:", services);
//     if (services && Array.isArray(services)) {
//       return services.map((service) => ({
//         id: service._id,
//         serviceType: service.serviceType || "N/A",
//         price:
//           service.price !== undefined
//             ? `₦${parseFloat(service.price).toFixed(2)}`
//             : "N/A",
//         createdAt: service.createdAt || "N/A",
//       }));
//     }
//     return [];
//   }, [services]);

//   // Filter rows based on searchText
//   const filteredRows = useMemo(() => {
//     console.log("Filtering rows with searchText:", searchText);
//     if (searchText.trim() === "") {
//       return rows;
//     }
//     return rows.filter((row) =>
//       Object.values(row).some(
//         (value) =>
//           value &&
//           value.toString().toLowerCase().includes(searchText.toLowerCase())
//       )
//     );
//   }, [rows, searchText]);

//   const handleSearch = (searchVal) => {
//     console.log("Search triggered with value:", searchVal);
//     setSearchText(searchVal);
//   };

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
//     link.download = "laundry_services.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = (service) => {
//     const priceString = service.price; // "₦22.00"
//     const price = parseFloat(priceString.replace("₦", ""));
//     const serviceData = {
//       _id: service.id,
//       serviceType: service.serviceType,
//       price: price,
//     };
//     console.log("Edit Data:", serviceData);
//     setEditData(serviceData);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (serviceId) => {
//     setServiceToDelete(serviceId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (serviceToDelete) {
//       dispatch(deleteLaundryService(serviceToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("Laundry service deleted successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchLaundryServices());
//         })
//         .catch((error) => {
//           toast.error("Error deleting service: " + (error || "Unknown error"), {
//             duration: 7000,
//           });
//         })
//         .finally(() => {
//           setDeleteDialogOpen(false);
//           setServiceToDelete(null);
//         });
//     }
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setServiceToDelete(null);
//   };

//   const columns = [
//     {
//       field: "serviceType",
//       headerName: "Service Type",
//       flex: 1,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "price",
//       headerName: "Price",
//       flex: 1,
//       filterable: true,
//       sortable: true,
//     },
//     {
//       field: "createdAt",
//       headerName: "Created At",
//       flex: 1,
//       filterable: true,
//       sortable: true,
//       renderCell: (params) => {
//         const date = new Date(params.value);
//         return date.toString() === "Invalid Date"
//           ? "N/A"
//           : date.toLocaleString();
//       },
//     },
//     {
//       field: "action",
//       headerName: "Action",
//       flex: 1,
//       filterable: false,
//       sortable: false,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:laundryService") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(params.row)}
//             />
//           )}
//           {hasPermission(user, "delete:laundryService") && (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(params.row.id)}
//             />
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
//       <Box sx={{ width: "100%", position: "relative" }}>
//         {status === "failed" ? (
//           <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//             Error: {error || "An error occurred"}
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
//                 "@media print": { display: "none" },
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Laundry Services
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
//                   sx={{ color: "#473b33", "&:hover": { color: "#fec80a" } }}
//                   title="Download CSV"
//                 >
//                   <GetAppIcon />
//                 </IconButton>
//                 <IconButton
//                   onClick={handlePrint}
//                   sx={{ color: "#302924", "&:hover": { color: "#fec80a" } }}
//                   title="Print"
//                 >
//                   <PrintIcon />
//                 </IconButton>
//                 {hasPermission(user, "write:laundryService") && (
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
//                     Add New Service
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
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
//               </Box>
//             ) : (
//               <Box sx={{ height: 600, width: "100%" }}>
//                 <DataGrid
//                   rows={filteredRows}
//                   columns={columns}
//                   pageSizeOptions={[10, 20, 50]}
//                   initialState={{
//                     pagination: { paginationModel: { pageSize: 10 } },
//                   }}
//                   checkboxSelection={false}
//                   disableRowSelectionOnClick
//                 />
//               </Box>
//             )}
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={handleCloseDialog}
//               aria-labelledby="delete-dialog-title"
//               aria-describedby="delete-dialog-description"
//             >
//               <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="delete-dialog-description">
//                   Are you sure you want to delete this laundry service? This
//                   action cannot be undone.
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
//             <AddNewLaundryServiceDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//           </>
//         )}
//       </Box>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Laundrys;

import React, { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLaundryServices,
  deleteLaundryService,
} from "../../redux/slices/laundryServicesSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice"; // For Retry
import { hasPermission } from "../../utils/authUtils";
import AddNewLaundryServiceDrawer from "../AddDrawerSection/AddNewLaundryServiceDrawer";
import { Toaster, toast } from "react-hot-toast";

const Laundrys = () => {
  const dispatch = useDispatch();
  const { services, status, error } = useSelector(
    (state) => state.laundryServices
  );
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      //console.log("Fetching laundry services...");
      dispatch(fetchLaundryServices())
        .unwrap()
        .catch((err) => {
          console.error("Fetch laundry services failed:", err);
          if (err.status === 401) {
            //console.log("401 detected in Laundrys component");
          }
        });
    }
  }, [dispatch, status]);

  // Format rows once from services
  const rows = useMemo(() => {
    //console.log("Formatting rows from services:", services);
    if (services && Array.isArray(services)) {
      return services.map((service) => ({
        id: service._id,
        serviceType: service.serviceType || "N/A",
        price:
          service.price !== undefined
            ? `₦${parseFloat(service.price).toFixed(2)}`
            : "N/A",
        createdAt: service.createdAt || "N/A",
      }));
    }
    return [];
  }, [services]);

  // Filter rows based on searchText
  const filteredRows = useMemo(() => {
    //console.log("Filtering rows with searchText:", searchText);
    if (searchText.trim() === "") {
      return rows;
    }
    return rows.filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [rows, searchText]);

  const handleSearch = (searchVal) => {
    //console.log("Search triggered with value:", searchVal);
    setSearchText(searchVal);
  };

  const handleExport = () => {
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
    link.download = "laundry_services.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = (service) => {
    const priceString = service.price; // "₦22.00"
    const price = parseFloat(priceString.replace("₦", ""));
    const serviceData = {
      _id: service.id,
      serviceType: service.serviceType,
      price: price,
    };
    //console.log("Edit Data:", serviceData);
    setEditData(serviceData);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (serviceId) => {
    setServiceToDelete(serviceId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      dispatch(deleteLaundryService(serviceToDelete))
        .unwrap()
        .then(() => {
          toast.success("Laundry service deleted successfully!", {
            duration: 5000,
          });
          dispatch(fetchLaundryServices());
        })
        .catch((error) => {
          toast.error("Error deleting service: " + (error || "Unknown error"), {
            duration: 7000,
          });
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setServiceToDelete(null);
        });
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const handleRetry = () => {
    dispatch(checkAuthStatus()); // Trigger auth check on retry
  };

  const columns = [
    {
      field: "serviceType",
      headerName: "Service Type",
      flex: 1,
      filterable: true,
      sortable: true,
    },
    {
      field: "price",
      headerName: "Price",
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
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toString() === "Invalid Date"
          ? "N/A"
          : date.toLocaleString();
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:laundryService") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleEditClick(params.row)}
            />
          )}
          {hasPermission(user, "delete:laundryService") && (
            <i
              className="bx bx-trash"
              style={{ color: "#fe1e00", cursor: "pointer" }}
              onClick={() => handleDeleteClick(params.row.id)}
            />
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
        {status === "failed" ? (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#302924", // Dark brown-black from your theme
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
              Error: {error || "An error occurred"}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{
                backgroundColor: "#fe6c00",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#fec80a",
                  color: "#000",
                },
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
                Laundry Services
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
                {hasPermission(user, "write:laundryService") && (
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
                    Add New Service
                  </Button>
                )}
              </Box>
            </Box>
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
                <CircularProgress sx={{ color: "#fe6c00" }} />
              </Box>
            ) : (
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
            )}
            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDialog}
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
            >
              <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-dialog-description">
                  Are you sure you want to delete this laundry service? This
                  action cannot be undone.
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
            <AddNewLaundryServiceDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
            />
          </>
        )}
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default Laundrys;
