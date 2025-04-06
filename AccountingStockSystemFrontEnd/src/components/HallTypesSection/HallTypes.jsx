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
//   Typography,
//   IconButton,
// } from "@mui/material";
// import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
// import PrintIcon from "@mui/icons-material/Print"; // Print icon
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchHallTypes,
//   deleteHallType,
// } from "../../redux/slices/hallTypesSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewHallTypeDrawer from "../AddDrawerSection/AddNewHallTypesDrawer";

// const HallTypes = () => {
//   const dispatch = useDispatch();
//   const {
//     list: hallTypes = [],
//     status: hallTypesStatus,
//     isLoading = false,
//     error,
//   } = useSelector((state) => state.hallTypes || {});
//   const { user } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editHallTypeData, setEditHallTypeData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [hallTypeToDelete, setHallTypeToDelete] = useState(null);

//   useEffect(() => {
//     console.log("useEffect for hallTypesStatus:", hallTypesStatus);
//     if (hallTypesStatus === "idle") {
//       dispatch(fetchHallTypes());
//     }
//     console.log("Current hallTypes state:", hallTypes);
//   }, [dispatch, hallTypesStatus]);

//   useEffect(() => {
//     if (hallTypes && Array.isArray(hallTypes)) {
//       console.log("Hall types array:", hallTypes);
//       const formattedData = hallTypes.map((hall) => ({
//         id: hall._id || "N/A",
//         name: hall.name || "N/A",
//         price: hall.price !== undefined ? `₦${hall.price.toFixed(2)}` : "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData); // Initialize filtered data
//     } else {
//       console.log("Hall types is not an array or is empty:", hallTypes);
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [hallTypes]);

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
//     link.download = "hall_types.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (hall) => {
//       if (!hall) {
//         console.error("Invalid hall type data:", hall);
//         return;
//       }
//       setEditHallTypeData(hall);
//       setDrawerOpen(true);
//     },
//     [setEditHallTypeData, setDrawerOpen]
//   );

//   const handleDeleteClick = useCallback(
//     (hallId) => {
//       setHallTypeToDelete(hallId);
//       setDeleteDialogOpen(true);
//     },
//     [setHallTypeToDelete, setDeleteDialogOpen]
//   );

//   const handleConfirmDelete = useCallback(() => {
//     if (hallTypeToDelete) {
//       dispatch(deleteHallType(hallTypeToDelete))
//         .then(() => {
//           dispatch(fetchHallTypes());
//           toast.success("Hall type deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting hall type: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setHallTypeToDelete(null);
//   }, [dispatch, hallTypeToDelete, setDeleteDialogOpen, setHallTypeToDelete]);

//   const handleCloseDialog = useCallback(() => {
//     setDeleteDialogOpen(false);
//     setHallTypeToDelete(null);
//   }, [setDeleteDialogOpen, setHallTypeToDelete]);

//   const columns = [
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "price", headerName: "Price", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:halltypes") && (
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
//           {hasPermission(user, "delete:halltypes") && (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(params.row.id)}
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
//           <div>Error: {error.message || "An error occurred."}</div>
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
//                   display: "none", // Hide toolbar when printing
//                 },
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Hall Types
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
//                 {hasPermission(user, "write:halltypes") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditHallTypeData(null);
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
//                     Add New Hall Type
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
//             <AddNewHallTypeDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditHallTypeData(null);
//               }}
//               editMode={!!editHallTypeData}
//               initialData={editHallTypeData || {}}
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
//                   Are you sure you want to delete this hall type?
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
//       </Box>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default HallTypes;

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
  Typography,
  IconButton,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHallTypes,
  deleteHallType,
} from "../../redux/slices/hallTypesSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewHallTypeDrawer from "../AddDrawerSection/AddNewHallTypesDrawer";

const HallTypes = () => {
  const dispatch = useDispatch();
  const {
    list: hallTypes = [],
    status: hallTypesStatus = "idle",
    isLoading = false,
    error,
  } = useSelector((state) => state.hallTypes || {});
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editHallTypeData, setEditHallTypeData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hallTypeToDelete, setHallTypeToDelete] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    // console.log("HallTypes - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching hall types...");
        dispatch(fetchHallTypes());
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching hall types...");
            dispatch(fetchHallTypes());
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
    //console.log("HallTypes - Data update", { hallTypes, hallTypesStatus });
    if (hallTypes && Array.isArray(hallTypes)) {
      const formattedData = hallTypes.map((hall) => ({
        id: hall._id || "N/A",
        name: hall.name || "N/A",
        price: hall.price !== undefined ? `₦${hall.price.toFixed(2)}` : "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [hallTypes]);

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
    link.download = "hall_types.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (hall) => {
      if (!hall) {
        console.error("Invalid hall type data:", hall);
        return;
      }
      const originalHall = hallTypes.find((h) => h._id === hall.id);
      setEditHallTypeData(originalHall);
      setDrawerOpen(true);
    },
    [hallTypes]
  );

  const handleDeleteClick = useCallback((hallId) => {
    setHallTypeToDelete(hallId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (hallTypeToDelete) {
      dispatch(deleteHallType(hallTypeToDelete))
        .unwrap()
        .then(() => {
          toast.success("Hall type deleted successfully!", { duration: 5000 });
          dispatch(fetchHallTypes());
        })
        .catch((error) => {
          toast.error(
            "Error deleting hall type: " +
              (error.response?.data?.message || error.message)
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setHallTypeToDelete(null);
        });
    }
  }, [dispatch, hallTypeToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setHallTypeToDelete(null);
  }, []);

  const handleRetry = () => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  };

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1 },
      { field: "price", headerName: "Price", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (params) => (
          <>
            {hasPermission(user, "update:halltypes") && (
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
            {hasPermission(user, "delete:halltypes") && (
              <i
                className="bx bx-trash"
                style={{ color: "#fe1e00", cursor: "pointer" }}
                onClick={() => handleDeleteClick(params.row.id)}
              ></i>
            )}
          </>
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
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", minHeight: "100vh", position: "relative" }}>
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
                Hall Types
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
                {hasPermission(user, "write:halltypes") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEditHallTypeData(null);
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
                    Add New Hall Type
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
            <AddNewHallTypeDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditHallTypeData(null);
              }}
              editMode={!!editHallTypeData}
              initialData={editHallTypeData || {}}
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
                  Are you sure you want to delete this hall type?
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
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default HallTypes;
