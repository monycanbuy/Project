import React, { useEffect, useState, useCallback } from "react";
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
  fetchHallTypes,
  deleteHallType,
} from "../../redux/slices/hallTypesSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewHallTypeDrawer from "../AddDrawerSection/AddNewHallTypesDrawer";

const HallTypes = () => {
  const dispatch = useDispatch();
  const {
    list: hallTypes = [],
    status: hallTypesStatus,
    isLoading = false,
    error,
  } = useSelector((state) => state.hallTypes || {});
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editHallTypeData, setEditHallTypeData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hallTypeToDelete, setHallTypeToDelete] = useState(null);

  useEffect(() => {
    console.log("useEffect for hallTypesStatus:", hallTypesStatus);
    if (hallTypesStatus === "idle") {
      dispatch(fetchHallTypes());
    }
    console.log("Current hallTypes state:", hallTypes); // Log the current state
  }, [dispatch, hallTypesStatus]);

  useEffect(() => {
    if (hallTypes && Array.isArray(hallTypes)) {
      console.log("Hall types array:", hallTypes); // Check what's in hallTypes
      const formattedData = hallTypes.map((hall) => [
        hall.name || "N/A",
        hall.price !== undefined ? `₦${hall.price.toFixed(2)}` : "N/A",
        hall._id || "N/A",
      ]);
      setData(formattedData);
    } else {
      console.log("Hall types is not an array or is empty:", hallTypes);
      setData([]);
    }
  }, [hallTypes]);

  // Memoize handleEditClick to prevent unnecessary re-renders
  const handleEditClick = useCallback(
    (index) => {
      const hall = hallTypes[index];
      if (!hall) {
        console.error("Invalid hall type data at index:", index);
        return;
      }
      setEditHallTypeData(hall);
      setDrawerOpen(true);
    },
    [hallTypes, setEditHallTypeData, setDrawerOpen]
  );

  // Memoize handleDeleteClick similarly
  const handleDeleteClick = useCallback(
    (hallId) => {
      setHallTypeToDelete(hallId);
      setDeleteDialogOpen(true);
    },
    [setHallTypeToDelete, setDeleteDialogOpen]
  );

  const handleConfirmDelete = useCallback(() => {
    if (hallTypeToDelete) {
      dispatch(deleteHallType(hallTypeToDelete))
        .then(() => {
          dispatch(fetchHallTypes()); // Refresh the list after delete
          toast.success("Hall type deleted successfully!", { duration: 5000 });
        })
        .catch((error) => {
          toast.error(
            "Error deleting hall type: " +
              (error.response?.data?.message || error.message)
          );
        });
    }
    setDeleteDialogOpen(false);
    setHallTypeToDelete(null);
  }, [dispatch, hallTypeToDelete, setDeleteDialogOpen, setHallTypeToDelete]);

  const handleCloseDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setHallTypeToDelete(null);
  }, [setDeleteDialogOpen, setHallTypeToDelete]);

  const columns = [
    { name: "Name", options: { filter: true, sort: true } },
    { name: "Price", options: { filter: false, sort: true } },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => {
          const hall = hallTypes[tableMeta.rowIndex];
          return (
            <>
              {hasPermission(user, "update:halltypes") && (
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

              {hasPermission(user, "delete:halltypes") && (
                <i
                  className="bx bx-trash"
                  style={{ color: "#fe1e00", cursor: "pointer" }}
                  onClick={() => handleDeleteClick(hall._id)}
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
      hasPermission(user, "write:halltypes") ? (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setEditHallTypeData(null); // Reset for new hall type
            setDrawerOpen(true); // Open drawer for adding new hall type
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
        {error ? (
          <div>Error: {error.message || "An error occurred."}</div>
        ) : (
          <>
            <MUIDataTable
              title={"Hall Types"}
              data={isLoading ? loadingData : data}
              columns={columns}
              options={options}
            />
            <AddNewHallTypeDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditHallTypeData(null); // Reset edit data on close
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
              <DialogTitle id="alert-dialog-title">
                {"Confirm Delete"}
              </DialogTitle>
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
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default HallTypes;
