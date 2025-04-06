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
//   fetchCategories,
//   deleteCategory,
// } from "../../redux/slices/categorySlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewCategoryDrawer from "../AddDrawerSection/AddNewCategoryDrawer";

// const Category = () => {
//   const dispatch = useDispatch();
//   const {
//     categories,
//     status: categoriesStatus,
//     isLoading,
//     error,
//   } = useSelector((state) => state.categories || {});
//   const { user } = useSelector((state) => state.auth);

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editCategoryData, setEditCategoryData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState(null);

//   useEffect(() => {
//     console.log("Categories State:", {
//       categories,
//       categoriesStatus,
//       isLoading,
//       error,
//     });
//     if (categoriesStatus === "idle" || categoriesStatus === "failed") {
//       dispatch(fetchCategories());
//     }
//   }, [dispatch, categoriesStatus]);

//   useEffect(() => {
//     console.log("Categories data for mapping:", categories);
//     if (categories && Array.isArray(categories)) {
//       const formattedData = categories.map((category) => ({
//         id: category._id || "N/A",
//         name: category.name || "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData); // Initialize filtered data
//     } else {
//       console.log("No valid categories array, setting empty data");
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [categories]);

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
//     link.download = "categories.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   // const handleEditClick = useCallback(
//   //   (category) => {
//   //     if (!category) {
//   //       console.error("Invalid category data:", category);
//   //       return;
//   //     }
//   //     setEditCategoryData(category);
//   //     setDrawerOpen(true);
//   //   },
//   //   [setEditCategoryData, setDrawerOpen]
//   // );
//   const handleEditClick = useCallback((category) => {
//     if (!category || !category.id) {
//       console.error("Invalid category data:", category);
//       toast.error("Cannot edit category: Missing ID");
//       return;
//     }
//     setEditCategoryData({ _id: category.id, name: category.name }); // Map 'id' to '_id'
//     setDrawerOpen(true);
//   }, []);

//   const handleDeleteClick = useCallback(
//     (categoryId) => {
//       setCategoryToDelete(categoryId);
//       setDeleteDialogOpen(true);
//     },
//     [setCategoryToDelete, setDeleteDialogOpen]
//   );

//   const handleConfirmDelete = useCallback(() => {
//     if (categoryToDelete) {
//       dispatch(deleteCategory(categoryToDelete))
//         .then(() => {
//           dispatch(fetchCategories());
//           toast.success("Category deleted successfully!", { duration: 5000 });
//         })
//         .catch((error) => {
//           toast.error(
//             "Error deleting category: " +
//               (error.response?.data?.message || error.message)
//           );
//         });
//     }
//     setDeleteDialogOpen(false);
//     setCategoryToDelete(null);
//   }, [dispatch, categoryToDelete, setDeleteDialogOpen, setCategoryToDelete]);

//   const handleCloseDialog = useCallback(() => {
//     setDeleteDialogOpen(false);
//     setCategoryToDelete(null);
//   }, [setDeleteDialogOpen, setCategoryToDelete]);

//   const columns = [
//     { field: "name", headerName: "Name", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:categories") && (
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
//           {hasPermission(user, "delete:categories") && (
//             <i
//               className="bx bx-trash"
//               style={{
//                 color: "#fe1e00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
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

//   const loadingData = [
//     {
//       id: "loading",
//       name: (
//         <Box
//           key="loading"
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "200px",
//             width: "100%",
//           }}
//         >
//           <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         {error ? (
//           <div>
//             Error: {error.message}
//             {error.status && <div>Status: {error.status}</div>}
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
//                 Categories
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
//                 {hasPermission(user, "write:categories") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditCategoryData(null);
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
//                     Add New Category
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
//             <AddNewCategoryDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditCategoryData(null);
//               }}
//               editMode={!!editCategoryData}
//               initialData={editCategoryData || {}}
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
//                   Are you sure you want to delete this category?
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

// export default Category;

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
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import PrintIcon from "@mui/icons-material/Print";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
} from "../../redux/slices/categorySlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewCategoryDrawer from "../AddDrawerSection/AddNewCategoryDrawer";

const Category = () => {
  const dispatch = useDispatch();
  const {
    categories,
    status: categoriesStatus,
    isLoading,
    error,
  } = useSelector((state) => state.categories || {});
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    // console.log("Categories State:", {
    //   categories,
    //   categoriesStatus,
    //   isLoading,
    //   error,
    // });
    // Only fetch if status is idle (initial load) or explicitly needed
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories())
        .unwrap()
        .catch((err) => {
          console.error("Fetch categories failed:", err);
          if (err.status === 401) {
            //console.log("401 detected in Category component");
          }
        });
    }
  }, [dispatch, categoriesStatus]);

  useEffect(() => {
    //console.log("Categories data for mapping:", categories);
    if (
      categories &&
      Array.isArray(categories) &&
      categoriesStatus === "succeeded"
    ) {
      const formattedData = categories.map((category) => ({
        id: category._id || "N/A",
        name: category.name || "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else if (categoriesStatus === "failed") {
      // Clear data on failure to avoid stale UI
      setData([]);
      setFilteredData([]);
    }
  }, [categories, categoriesStatus]);

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
    link.download = "categories.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback((category) => {
    if (!category || !category.id) {
      console.error("Invalid category data:", category);
      toast.error("Cannot edit category: Missing ID");
      return;
    }
    setEditCategoryData({ _id: category.id, name: category.name });
    setDrawerOpen(true);
  }, []);

  const handleDeleteClick = useCallback((categoryId) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete))
        .then(() => {
          dispatch(fetchCategories());
          toast.success("Category deleted successfully!", { duration: 5000 });
        })
        .catch((error) => {
          toast.error(
            "Error deleting category: " +
              (error.response?.data?.message || error.message)
          );
        });
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  }, [dispatch, categoryToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  }, []);

  const handleRetry = () => {
    dispatch(checkAuthStatus()).then(() => {
      // After auth check, attempt to refetch categories
      dispatch(fetchCategories());
    });
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:categories") && (
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
          {hasPermission(user, "delete:categories") && (
            <i
              className="bx bx-trash"
              style={{
                color: "#fe1e00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleDeleteClick(params.row.id)}
            ></i>
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
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", minHeight: "100vh", position: "relative" }}>
        {categoriesStatus === "failed" && error ? (
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
                "@media print": {
                  display: "none",
                },
              }}
            >
              <Typography variant="h6" sx={{ color: "#000" }}>
                Categories
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
                {hasPermission(user, "write:categories") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEditCategoryData(null);
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
                    Add New Category
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
                  disableSelectionOnClick
                />
              </Box>
            )}
            <AddNewCategoryDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditCategoryData(null);
              }}
              editMode={!!editCategoryData}
              initialData={editCategoryData || {}}
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
                  Are you sure you want to delete this category?
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
            <Toaster />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Category;
