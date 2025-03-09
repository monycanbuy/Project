// import React, { useEffect, useState } from "react";
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
//   fetchCategories,
//   deleteCategory,
// } from "../../redux/slices/categorySlice";
// import AddNewCategoryDrawer from "../AddDrawerSection/AddNewCategoryDrawer";

// const Category = () => {
//   const dispatch = useDispatch();
//   const {
//     categories,
//     status: categoriesStatus,
//     isLoading,
//     error,
//   } = useSelector((state) => state.categories || {});

//   const [data, setData] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editCategoryData, setEditCategoryData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState(null);

//   useEffect(() => {
//     if (categoriesStatus === "idle") {
//       dispatch(fetchCategories());
//     }
//   }, [dispatch, categoriesStatus]);

//   useEffect(() => {
//     console.log("Categories data:", categories);
//     if (categories && Array.isArray(categories)) {
//       const formattedData = categories.map((category) => [
//         category.name || "N/A",
//         category._id || "N/A", // Assuming categories have an _id
//       ]);
//       setData(formattedData);
//     } else {
//       setData([]);
//     }
//   }, [categories]);

//   const handleEditClick = (index) => {
//     const category = categories[index];
//     if (!category) {
//       console.error("Invalid category data at index:", index);
//       return;
//     }
//     setEditCategoryData(category);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (categoryId) => {
//     setCategoryToDelete(categoryId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (categoryToDelete) {
//       dispatch(deleteCategory(categoryToDelete))
//         .then(() => {
//           dispatch(fetchCategories()); // Refresh the list after delete
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
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setCategoryToDelete(null);
//   };

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => {
//           const category = categories[tableMeta.rowIndex];
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(tableMeta.rowIndex)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleDeleteClick(category._id)}
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
//           setEditCategoryData(null); // Reset for new category
//           setDrawerOpen(true); // Open drawer for adding new category
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
//         Add New Category
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
//               title={"Categories"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewCategoryDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditCategoryData(null); // Reset edit data on close
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
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Category;

// Category.jsx
// import React, { useEffect, useState } from "react";
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
//   fetchCategories,
//   deleteCategory,
// } from "../../redux/slices/categorySlice";
// import { hasPermission } from "../../utils/authUtils"; // Add this import
// import AddNewCategoryDrawer from "../AddDrawerSection/AddNewCategoryDrawer";

// const Category = () => {
//   const dispatch = useDispatch();
//   const {
//     categories,
//     status: categoriesStatus,
//     isLoading,
//     error,
//   } = useSelector((state) => state.categories || {});
//   const { user } = useSelector((state) => state.auth); // Add this

//   const [data, setData] = useState([]);
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
//       const formattedData = categories.map((category) => {
//         console.log("Mapping category:", category);
//         return [category.name || "N/A", category._id || "N/A"];
//       });
//       setData(formattedData);
//     } else {
//       console.log("No valid categories array, setting empty data");
//       setData([]);
//     }
//   }, [categories]);

//   const handleEditClick = (index) => {
//     const category = categories[index];
//     if (!category) {
//       console.error("Invalid category data at index:", index);
//       return;
//     }
//     setEditCategoryData(category);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (categoryId) => {
//     setCategoryToDelete(categoryId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     if (categoryToDelete) {
//       dispatch(deleteCategory(categoryToDelete))
//         .then(() => {
//           dispatch(fetchCategories()); // Refresh the list after delete
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
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setCategoryToDelete(null);
//   };

//   const columns = [
//     { name: "Name", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => {
//           const category = categories[tableMeta.rowIndex];
//           return (
//             <>
//               {hasPermission(user, "update:categories") && (
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

//               {hasPermission(user, "delete:categories") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{ color: "#fe1e00", cursor: "pointer" }}
//                   onClick={() => handleDeleteClick(category._id)}
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
//       hasPermission(user, "write:categories") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={() => {
//             setEditCategoryData(null); // Reset for new category
//             setDrawerOpen(true); // Open drawer for adding new category
//           }}
//           sx={{
//             backgroundColor: "#fe6c00",
//             color: "#fff",
//             "&:hover": {
//               backgroundColor: "#fec80a",
//               color: "#bdbabb",
//             },
//           }}
//         >
//           Add New Category
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
//         {/* IMPROVED ERROR DISPLAY */}
//         {error ? (
//           <div>
//             Error: {error.message}
//             {error.status && <div>Status: {error.status}</div>}
//             {/* Optionally display more details if needed */}
//             {/* {error.data && <div>Details: {JSON.stringify(error.data)}</div>} */}
//           </div>
//         ) : (
//           <>
//             <MUIDataTable
//               title={"Categories"}
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewCategoryDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditCategoryData(null); // Reset edit data on close
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
//       </div>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Category;

// import React, { useEffect, useState } from "react";
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
// } from "@mui/material";
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

//   const rows = categories
//     ? categories.map((category) => ({
//         id: category._id, // Required by DataGrid
//         name: category.name || "N/A",
//       }))
//     : [];

//   const handleEditClick = (categoryId) => {
//     const category = categories.find((c) => c._id === categoryId);
//     if (!category) {
//       console.error("Invalid category data for ID:", categoryId);
//       return;
//     }
//     setEditCategoryData(category);
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (categoryId) => {
//     setCategoryToDelete(categoryId);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = () => {
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
//   };

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setCategoryToDelete(null);
//   };

//   const columns = [
//     {
//       field: "name",
//       headerName: "Name",
//       width: 200,
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
//         <>
//           {hasPermission(user, "update:categories") && (
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
//           {hasPermission(user, "delete:categories") && (
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
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ position: "relative" }}>
//         {error ? (
//           <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
//             Error: {error.message}
//             {error.status && <div>Status: {error.status}</div>}
//           </div>
//         ) : (
//           <>
//             {isLoading && (
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   zIndex: 1000,
//                 }}
//               >
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
//               </Box>
//             )}
//             <Box sx={{ height: 600, width: "100%" }}>
//               <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 pageSizeOptions={[10, 20, 50]}
//                 initialState={{
//                   pagination: { paginationModel: { pageSize: 10 } },
//                 }}
//                 checkboxSelection={false}
//                 disableRowSelectionOnClick
//                 slots={{
//                   toolbar: () =>
//                     hasPermission(user, "write:categories") ? (
//                       <Button
//                         variant="contained"
//                         size="small"
//                         onClick={() => {
//                           setEditCategoryData(null);
//                           setDrawerOpen(true);
//                         }}
//                         sx={{
//                           backgroundColor: "#fe6c00",
//                           color: "#fff",
//                           "&:hover": {
//                             backgroundColor: "#fec80a",
//                             color: "#bdbabb",
//                           },
//                           m: 1,
//                         }}
//                       >
//                         Add New Category
//                       </Button>
//                     ) : null,
//                 }}
//               />
//             </Box>
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
//         <Toaster />
//       </Box>
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
import GetAppIcon from "@mui/icons-material/GetApp"; // Download icon
import PrintIcon from "@mui/icons-material/Print"; // Print icon
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
} from "../../redux/slices/categorySlice";
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
    console.log("Categories State:", {
      categories,
      categoriesStatus,
      isLoading,
      error,
    });
    if (categoriesStatus === "idle" || categoriesStatus === "failed") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  useEffect(() => {
    console.log("Categories data for mapping:", categories);
    if (categories && Array.isArray(categories)) {
      const formattedData = categories.map((category) => ({
        id: category._id || "N/A",
        name: category.name || "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData); // Initialize filtered data
    } else {
      console.log("No valid categories array, setting empty data");
      setData([]);
      setFilteredData([]);
    }
  }, [categories]);

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

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // const handleEditClick = useCallback(
  //   (category) => {
  //     if (!category) {
  //       console.error("Invalid category data:", category);
  //       return;
  //     }
  //     setEditCategoryData(category);
  //     setDrawerOpen(true);
  //   },
  //   [setEditCategoryData, setDrawerOpen]
  // );
  const handleEditClick = useCallback((category) => {
    if (!category || !category.id) {
      console.error("Invalid category data:", category);
      toast.error("Cannot edit category: Missing ID");
      return;
    }
    setEditCategoryData({ _id: category.id, name: category.name }); // Map 'id' to '_id'
    setDrawerOpen(true);
  }, []);

  const handleDeleteClick = useCallback(
    (categoryId) => {
      setCategoryToDelete(categoryId);
      setDeleteDialogOpen(true);
    },
    [setCategoryToDelete, setDeleteDialogOpen]
  );

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
  }, [dispatch, categoryToDelete, setDeleteDialogOpen, setCategoryToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  }, [setDeleteDialogOpen, setCategoryToDelete]);

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
              backgroundColor: "#29221d", // Match row background
              color: "#fcfcfc", // Light text for visibility
              "& .MuiTablePagination-root": {
                color: "#fcfcfc",
              },
              "& .MuiIconButton-root": {
                color: "#fcfcfc",
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
      <Box sx={{ width: "100%" }}>
        {error ? (
          <div>
            Error: {error.message}
            {error.status && <div>Status: {error.status}</div>}
          </div>
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
          </>
        )}
      </Box>
      <Toaster />
    </ThemeProvider>
  );
};

export default Category;
