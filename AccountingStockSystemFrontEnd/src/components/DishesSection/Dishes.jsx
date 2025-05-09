// import React, { useEffect, useState, useCallback } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Toaster, toast } from "react-hot-toast";
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
//   fetchDishes,
//   createDish,
//   updateDish,
//   deleteDish,
// } from "../../redux/slices/dishesSlice";
// import { fetchCategories } from "../../redux/slices/categorySlice"; // Import fetchCategories
// import { fetchInventories } from "../../redux/slices/inventoriesSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewDishesDrawer from "../AddDrawerSection/AddNewDishesDrawer";

// const Dishes = () => {
//   const dispatch = useDispatch();
//   const { items: dishes, status, error } = useSelector((state) => state.dishes);
//   const { user } = useSelector((state) => state.auth);
//   const { categories, status: categoriesStatus } = useSelector(
//     (state) => state.categories
//   );
//   const { inventories, status: inventoriesStatus } = useSelector(
//     (state) => state.inventories
//   );

//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [dishToDelete, setDishToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchDishes());
//     dispatch(fetchCategories());
//     dispatch(fetchInventories());
//   }, [dispatch]);

//   useEffect(() => {
//     if (dishes && Array.isArray(dishes)) {
//       const formattedData = dishes.map((dish) => ({
//         id: dish._id,
//         name: dish.name || "N/A",
//         description: dish.description || "N/A",
//         price: dish.price !== undefined ? `₦${dish.price.toFixed(2)}` : "N/A",
//         category: dish.category?.name || "N/A",
//         createdAt: dish.createdAt
//           ? format(new Date(dish.createdAt), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData); // Initialize filtered data
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [dishes]);

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
//     link.download = "dishes.csv";
//     link.click();
//   };

//   // Print functionality
//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (dish) => {
//       if (!dish) {
//         console.error("Invalid dish data:", dish);
//         return;
//       }
//       const dishData = {
//         _id: dish.id,
//         name: dish.name,
//         description: dish.description,
//         price: dish.price,
//         category: dish.category._id,
//         ingredients: dish.ingredients.map((ingredient) => ({
//           inventoryItem: ingredient.inventoryItem._id,
//           quantity: ingredient.quantity,
//         })),
//       };
//       setEditData(dishData);
//       setDrawerOpen(true);
//     },
//     [setEditData, setDrawerOpen]
//   );

//   const handleDeleteClick = useCallback(
//     (dishId) => {
//       setDishToDelete(dishId);
//       setDeleteDialogOpen(true);
//     },
//     [setDishToDelete, setDeleteDialogOpen]
//   );

//   const handleConfirmDelete = useCallback(() => {
//     if (dishToDelete) {
//       dispatch(deleteDish(dishToDelete))
//         .unwrap()
//         .then(() => {
//           toast.success("Dish deleted successfully!");
//           dispatch(fetchDishes());
//         })
//         .catch((error) => {
//           toast.error(`Error deleting dish: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setDishToDelete(null);
//   }, [dispatch, dishToDelete]);

//   const handleCloseDialog = () => {
//     setDeleteDialogOpen(false);
//     setDishToDelete(null);
//   };

//   const handleSaveDish = (dishData) => {
//     if (editData) {
//       dispatch(updateDish({ dishId: editData._id, dishData }))
//         .unwrap()
//         .then(() => {
//           dispatch(fetchDishes());
//           toast.success("Dish updated successfully!");
//         })
//         .catch((err) => toast.error(`Error updating dish: ${err.message}`));
//     } else {
//       dispatch(createDish(dishData))
//         .unwrap()
//         .then(() => {
//           dispatch(fetchDishes());
//           toast.success("Dish created successfully!");
//         })
//         .catch((err) => toast.error(`Error creating dish: ${err.message}`));
//     }
//     setDrawerOpen(false);
//     setEditData(null);
//   };

//   const columns = [
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "description", headerName: "Description", flex: 1 },
//     { field: "price", headerName: "Price", flex: 1 },
//     { field: "category", headerName: "Category", flex: 1 },
//     { field: "createdAt", headerName: "Created At", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:dishes") && (
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
//           {hasPermission(user, "delete:dishes") && (
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

//   if (categoriesStatus === "loading" || inventoriesStatus === "loading") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress sx={{ color: "#fe6c00" }} />
//       </Box>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         {error && (
//           <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>
//         )}
//         <Box
//           sx={{
//             padding: "8px",
//             backgroundColor: "#d0d0d0",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "8px",
//             "@media print": {
//               display: "none",
//             },
//           }}
//         >
//           <Typography variant="h6" sx={{ color: "#000" }}>
//             Dishes
//           </Typography>
//           <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
//             <TextField
//               variant="outlined"
//               size="small"
//               placeholder="Search..."
//               value={searchText}
//               onChange={(e) => handleSearch(e.target.value)}
//               sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
//             />
//             <IconButton
//               onClick={handleExport}
//               sx={{
//                 color: "#473b33",
//                 "&:hover": { color: "#fec80a" },
//               }}
//               title="Download CSV"
//             >
//               <GetAppIcon />
//             </IconButton>
//             <IconButton
//               onClick={handlePrint}
//               sx={{
//                 color: "#302924",
//                 "&:hover": { color: "#fec80a" },
//               }}
//               title="Print"
//             >
//               <PrintIcon />
//             </IconButton>
//             {hasPermission(user, "write:dishes") && (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={() => {
//                   setEditData(null);
//                   setDrawerOpen(true);
//                 }}
//                 sx={{
//                   backgroundColor: "#fe6c00",
//                   color: "#fff",
//                   "&:hover": {
//                     backgroundColor: "#fec80a",
//                     color: "#bdbabb",
//                   },
//                 }}
//               >
//                 Add New Dish
//               </Button>
//             )}
//           </Box>
//         </Box>
//         {status === "loading" ? (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "200px",
//               width: "100%",
//             }}
//           >
//             <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
//           </Box>
//         ) : (
//           <Box sx={{ height: 600, width: "100%" }}>
//             <DataGrid
//               rows={filteredData}
//               columns={columns}
//               pageSizeOptions={[10, 20, 50]}
//               initialState={{
//                 pagination: { paginationModel: { pageSize: 10 } },
//               }}
//               disableSelectionOnClick
//             />
//           </Box>
//         )}
//         <AddNewDishesDrawer
//           open={drawerOpen}
//           onClose={() => {
//             setDrawerOpen(false);
//             setEditData(null);
//           }}
//           editMode={!!editData}
//           initialData={editData}
//           categories={categories}
//           inventoryItems={inventories}
//           onSaveSuccess={() => dispatch(fetchDishes())}
//         />
//         <Dialog
//           open={deleteDialogOpen}
//           onClose={handleCloseDialog}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
//           <DialogContent>
//             <DialogContentText id="alert-dialog-description">
//               Are you sure you want to delete this dish?
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//               Delete
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Toaster />
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default Dishes;

import React, { useEffect, useState, useCallback } from "react";
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
  fetchDishes,
  createDish,
  updateDish,
  deleteDish,
} from "../../redux/slices/dishesSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchInventories } from "../../redux/slices/inventoriesSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice"; // For Retry
import { hasPermission } from "../../utils/authUtils";
import AddNewDishesDrawer from "../AddDrawerSection/AddNewDishesDrawer";

const Dishes = () => {
  const dispatch = useDispatch();
  const { items: dishes, status, error } = useSelector((state) => state.dishes);
  const { user } = useSelector((state) => state.auth);
  const { categories, status: categoriesStatus } = useSelector(
    (state) => state.categories
  );
  const { inventories, status: inventoriesStatus } = useSelector(
    (state) => state.inventories
  );

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);

  useEffect(() => {
    //console.log("Fetching dishes, categories, and inventories...");
    dispatch(fetchDishes())
      .unwrap()
      .catch((err) => {
        console.error("Fetch dishes failed:", err);
        if (err.status === 401) {
          //console.log("401 detected in Dishes component");
        }
      });
    dispatch(fetchCategories());
    dispatch(fetchInventories());
  }, [dispatch]);

  useEffect(() => {
    if (dishes && Array.isArray(dishes)) {
      const formattedData = dishes.map((dish) => ({
        id: dish._id,
        name: dish.name || "N/A",
        description: dish.description || "N/A",
        price: dish.price !== undefined ? `₦${dish.price.toFixed(2)}` : "N/A",
        category: dish.category?.name || "N/A",
        createdAt: dish.createdAt
          ? format(new Date(dish.createdAt), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [dishes]);

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
    link.download = "dishes.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (dish) => {
      if (!dish) {
        console.error("Invalid dish data:", dish);
        return;
      }
      const rawDish = dishes.find((d) => d._id === dish.id);
      if (!rawDish) {
        console.error("Dish not found in raw data:", dish.id);
        return;
      }
      const dishData = {
        _id: rawDish._id,
        name: rawDish.name,
        description: rawDish.description,
        price: rawDish.price,
        category: rawDish.category?._id,
        ingredients:
          rawDish.ingredients?.map((ingredient) => ({
            inventoryItem: ingredient.inventoryItem?._id,
            quantity: ingredient.quantity,
          })) || [],
      };
      setEditData(dishData);
      setDrawerOpen(true);
    },
    [dishes]
  );

  const handleDeleteClick = useCallback((dishId) => {
    setDishToDelete(dishId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (dishToDelete) {
      dispatch(deleteDish(dishToDelete))
        .unwrap()
        .then(() => {
          toast.success("Dish deleted successfully!");
          dispatch(fetchDishes());
        })
        .catch((error) => {
          toast.error(`Error deleting dish: ${error.message}`);
        });
    }
    setDeleteDialogOpen(false);
    setDishToDelete(null);
  }, [dispatch, dishToDelete]);

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setDishToDelete(null);
  };

  const handleSaveDish = (dishData) => {
    if (editData) {
      dispatch(updateDish({ dishId: editData._id, dishData }))
        .unwrap()
        .then(() => {
          dispatch(fetchDishes());
          toast.success("Dish updated successfully!");
        })
        .catch((err) => toast.error(`Error updating dish: ${err.message}`));
    } else {
      dispatch(createDish(dishData))
        .unwrap()
        .then(() => {
          dispatch(fetchDishes());
          toast.success("Dish created successfully!");
        })
        .catch((err) => toast.error(`Error creating dish: ${err.message}`));
    }
    setDrawerOpen(false);
    setEditData(null);
  };

  const handleRetry = () => {
    dispatch(checkAuthStatus());
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:dishes") && (
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
          {hasPermission(user, "delete:dishes") && (
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

  if (categoriesStatus === "loading" || inventoriesStatus === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#fe6c00" }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", minHeight: "100vh", position: "relative" }}>
        {status === "failed" && error ? (
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
                Dishes
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
                {hasPermission(user, "write:dishes") && (
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
                    Add New Dish
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
            <AddNewDishesDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData}
              categories={categories}
              inventoryItems={inventories}
              onSaveSuccess={() => dispatch(fetchDishes())}
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
                  Are you sure you want to delete this dish?
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

export default Dishes;
