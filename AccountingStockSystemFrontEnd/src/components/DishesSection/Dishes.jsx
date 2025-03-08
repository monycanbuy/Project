import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { format } from "date-fns";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDishes,
  createDish,
  updateDish,
  deleteDish,
} from "../../redux/slices/dishesSlice";
import { fetchCategories } from "../../redux/slices/categorySlice"; // Import fetchCategories
import { fetchInventories } from "../../redux/slices/inventoriesSlice";
import { hasPermission } from "../../utils/authUtils";
import { Toaster, toast } from "react-hot-toast";
import AddNewDishesDrawer from "../AddDrawerSection/AddNewDishesDrawer";

const Dishes = () => {
  const dispatch = useDispatch();
  const { items: dishes, status, error } = useSelector((state) => state.dishes);
  const { user } = useSelector((state) => state.auth); // Add this
  const { categories, status: categoriesStatus } = useSelector(
    (state) => state.categories
  ); // Get categories
  const { inventories, status: inventoriesStatus } = useSelector(
    (state) => state.inventories
  ); // Get inventory

  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchDishes());
    dispatch(fetchCategories()); // VERY IMPORTANT: Fetch categories
    dispatch(fetchInventories());
  }, [dispatch]);

  useEffect(() => {
    if (dishes && Array.isArray(dishes)) {
      const formattedData = dishes.map((dish) => [
        dish.name || "N/A",
        dish.description || "N/A",
        dish.price !== undefined ? `₦${dish.price.toFixed(2)}` : "N/A",
        dish.category?.name || "N/A", // Display category name
        dish.createdAt
          ? format(new Date(dish.createdAt), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        dish._id, // Keep _id for actions
      ]);
      setData(formattedData);
    } else {
      setData([]);
    }
  }, [dishes]);

  const handleEditClick = (dishId) => {
    const dish = dishes.find((d) => d._id === dishId); // Find the *full* dish object
    if (!dish) {
      console.error("Dish not found for editing:", dishId);
      return;
    }

    // Prepare data for the drawer.  Crucially, we only send the category *ID*
    const dishData = {
      _id: dish._id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category._id, //  Send the category ID, *not* the whole object
      ingredients: dish.ingredients.map((ingredient) => ({
        inventoryItem: ingredient.inventoryItem._id, // Send inventory item ID
        quantity: ingredient.quantity,
      })),
    };

    setEditData(dishData);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (dishId) => {
    setDishToDelete(dishId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (dishToDelete) {
      dispatch(deleteDish(dishToDelete))
        .unwrap()
        .then(() => {
          toast.success("Dish deleted successfully!");
        })
        .catch((error) => {
          toast.error(`Error deleting dish: ${error.message}`);
        });
    }
    setDeleteDialogOpen(false);
    setDishToDelete(null);
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setDishToDelete(null);
  };
  const handleSaveDish = (dishData) => {
    if (editData) {
      // Include the _id for updates
      dispatch(updateDish({ dishId: editData._id, dishData }))
        .unwrap()
        .then(() => {
          dispatch(fetchDishes()); // Refresh after update
          toast.success("Dish updated successfully!");
        })
        .catch((err) => toast.error(`Error updating dish: ${err.message}`));
    } else {
      dispatch(createDish(dishData))
        .unwrap()
        .then(() => {
          dispatch(fetchDishes()); // Refresh after create
          toast.success("Dish created successfully!");
        })
        .catch((err) => toast.error(`Error creating dish: ${err.message}`));
    }
    setDrawerOpen(false); // Close drawer
    setEditData(null); //Reset
  };

  const columns = [
    { name: "Name", options: { filter: true, sort: true } },
    { name: "Description", options: { filter: true, sort: false } },
    { name: "Price", options: { filter: true, sort: true } },
    { name: "Category", options: { filter: true, sort: false } },
    {
      name: "Created At",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) =>
          value ? format(new Date(value), "yyyy-MM-dd HH:mm:ss") : "N/A",
      },
    },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const dishId = tableMeta.rowData[5]; // Get the dish _id
          return (
            <>
              {hasPermission(user, "update:dishes") && (
                <i
                  className="bx bx-pencil"
                  style={{
                    color: "#fe6c00",
                    cursor: "pointer",
                    marginRight: "12px",
                  }}
                  onClick={() => handleEditClick(dishId)} // Pass the dishId, not the row
                ></i>
              )}

              {hasPermission(user, "delete:dishes") && (
                <i
                  className="bx bx-trash"
                  style={{ color: "#fe1e00", cursor: "pointer" }}
                  onClick={() => handleDeleteClick(dishId)}
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
            "& .MuiPaper-root": {
              backgroundColor: "#f0f0f0",
            },
            "& .MuiTableRow-root": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                "& .MuiTableCell-root": {
                  color: "#bdbabb",
                },
              },
            },
            "& .MuiTableCell-root": {
              color: "#fff",
              fontSize: "17px",
            },
            "& .MuiTableRow-head": {
              backgroundColor: "#e0e0e0",
              "& .MuiTableCell-root": {
                color: "#000",
                fontSize: "17px",
                fontWeight: "bold",
              },
            },
            "& .MuiToolbar-root": {
              backgroundColor: "#d0d0d0",
              "& .MuiTypography-root": {
                fontSize: "17px",
              },
              "& .MuiIconButton-root": {
                color: "#3f51b5",
              },
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
      hasPermission(user, "write:dishes") ? (
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
      ) : null,
  };

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
      <div>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>Error: {error}</div>
        )}

        {status !== "loading" && (
          <MUIDataTable
            title={"Dishes"}
            data={data}
            columns={columns}
            options={options}
          />
        )}

        <AddNewDishesDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditData(null);
          }}
          editMode={!!editData}
          initialData={editData}
          categories={categories} // Pass categories
          inventoryItems={inventories} // Pass in inventories
          onSaveSuccess={() => dispatch(fetchDishes())} // Pass onSaveSuccess
        />

        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
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
      </div>
    </ThemeProvider>
  );
};

export default Dishes;
