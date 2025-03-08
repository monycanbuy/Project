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
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
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
  fetchCategories,
  deleteCategory,
} from "../../redux/slices/categorySlice";
import { hasPermission } from "../../utils/authUtils"; // Add this import
import AddNewCategoryDrawer from "../AddDrawerSection/AddNewCategoryDrawer";

const Category = () => {
  const dispatch = useDispatch();
  const {
    categories,
    status: categoriesStatus,
    isLoading,
    error,
  } = useSelector((state) => state.categories || {});
  const { user } = useSelector((state) => state.auth); // Add this

  const [data, setData] = useState([]);
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
      const formattedData = categories.map((category) => {
        console.log("Mapping category:", category);
        return [category.name || "N/A", category._id || "N/A"];
      });
      setData(formattedData);
    } else {
      console.log("No valid categories array, setting empty data");
      setData([]);
    }
  }, [categories]);

  const handleEditClick = (index) => {
    const category = categories[index];
    if (!category) {
      console.error("Invalid category data at index:", index);
      return;
    }
    setEditCategoryData(category);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete))
        .then(() => {
          dispatch(fetchCategories()); // Refresh the list after delete
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
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const columns = [
    { name: "Name", options: { filter: true, sort: true } },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => {
          const category = categories[tableMeta.rowIndex];
          return (
            <>
              {hasPermission(user, "update:categories") && (
                <i
                  className="bx bx-pencil"
                  style={{
                    color: "#fe6c00",
                    cursor: "pointer",
                    marginRight: "12px",
                  }}
                  onClick={() => handleEditClick(tableMeta.rowIndex)}
                ></i>
              )}

              {hasPermission(user, "delete:categories") && (
                <i
                  className="bx bx-trash"
                  style={{ color: "#fe1e00", cursor: "pointer" }}
                  onClick={() => handleDeleteClick(category._id)}
                ></i>
              )}
            </>
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
    },
  });

  const options = {
    filterType: "checkbox",
    rowsPerPage: 10,
    customToolbar: () =>
      hasPermission(user, "write:categories") ? (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setEditCategoryData(null); // Reset for new category
            setDrawerOpen(true); // Open drawer for adding new category
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

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* IMPROVED ERROR DISPLAY */}
        {error ? (
          <div>
            Error: {error.message}
            {error.status && <div>Status: {error.status}</div>}
            {/* Optionally display more details if needed */}
            {/* {error.data && <div>Details: {JSON.stringify(error.data)}</div>} */}
          </div>
        ) : (
          <>
            <MUIDataTable
              title={"Categories"}
              data={isLoading ? loadingData : data}
              columns={columns}
              options={options}
            />
            <AddNewCategoryDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditCategoryData(null); // Reset edit data on close
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
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default Category;
