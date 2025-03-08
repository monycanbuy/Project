import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
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
  Tabs,
  Tab,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchKabasas, voidKabasa } from "../../redux/slices/kabasaSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import AddNewKabasaDrawer from "../AddDrawerSection/AddNewKabasaDrawer";
import { Toaster, toast } from "react-hot-toast";
import KabsaReports from "./Reports/KabsaReports";

const Kabasa = () => {
  const dispatch = useDispatch();
  const { kabasas, isLoading, error } = useSelector((state) => state.kabasa);
  const { paymentMethods } = useSelector((state) => state.paymentMethods);
  const [data, setData] = useState([]);
  const [totalAmountSum, setTotalAmountSum] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openVoidDialog, setOpenVoidDialog] = useState(false); // State for voiding confirmation dialog
  const [kabasaToVoid, setKabasaToVoid] = useState(null); // State to hold the kabasa to void
  const [value, setValue] = useState("0");

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return !isNaN(date.getTime())
      ? date.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "N/A";
  };

  useEffect(() => {
    dispatch(fetchKabasas());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (kabasas && Array.isArray(kabasas) && kabasas.length > 0) {
      const sum = kabasas.reduce(
        (sum, kabasa) => sum + parseFloat(kabasa.totalAmount || 0),
        0
      );

      const formattedData = kabasas.map((kabasa) => {
        const soldBy = kabasa.salesBy ? kabasa.salesBy.fullName : "N/A";
        const paymentMethodName = kabasa.paymentMethod
          ? kabasa.paymentMethod.name
          : "N/A";

        return [
          formatDate(kabasa.createdAt) || "N/A",
          kabasa.orderItems
            .map((item) => item.itemName || "Unnamed Item")
            .join(", ") || "N/A",
          kabasa.additionalNotes || "N/A",
          kabasa.status || "N/A",
          paymentMethodName,
          soldBy,
          kabasa.isVoided ? "Yes" : "No",
          kabasa.totalAmount !== undefined
            ? `₦${parseFloat(kabasa.totalAmount).toFixed(2)}`
            : "₦0.00",
        ];
      });

      formattedData.push([
        "",
        "",
        "",
        "",
        "",
        "",
        "Grand Total:",
        <strong key="grand-total">₦{sum.toFixed(2)}</strong>,
      ]);

      setData(formattedData);
      setTotalAmountSum(sum);
    } else {
      setData([]);
      setTotalAmountSum(0);
    }
  }, [kabasas]);

  const handleEditClick = (index) => {
    const kabasa = kabasas[index];
    if (!kabasa) {
      console.error("Invalid kabasa data at index:", index);
      return;
    }
    setEditData(kabasa);
    setDrawerOpen(true);
  };

  const handleVoidClick = (index) => {
    const kabasa = kabasas[index];
    if (!kabasa) {
      console.error("Invalid kabasa data at index:", index);
      return;
    }
    setKabasaToVoid(kabasa);
    setOpenVoidDialog(true); // Open the void confirmation dialog
  };

  const handleConfirmVoid = async () => {
    if (kabasaToVoid) {
      try {
        const response = await dispatch(voidKabasa(kabasaToVoid._id)).unwrap();
        if (response.success) {
          toast.success("Kabasa record successfully voided");
        } else {
          toast.error(response.message || "Failed to void kabasa record");
        }
      } catch (error) {
        if (error.message === "Kabasa record is already voided") {
          toast.error("This kabasa record has already been voided.");
        } else {
          toast.error(error.message || "Failed to void kabasa record");
        }
      } finally {
        setOpenVoidDialog(false);
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { name: "Date", options: { filter: true, sort: true } },
    { name: "Order Items", options: { filter: true, sort: true } },
    { name: "Additional Notes", options: { filter: true, sort: false } },
    { name: "Status", options: { filter: true, sort: false } },
    { name: "Payment Method", options: { filter: true, sort: false } },
    {
      name: "Sold By",
      options: {
        filter: true,
        sort: false,
      },
    },
    { name: "Voided", options: { filter: true, sort: false } },
    { name: "Total Amount", options: { filter: true, sort: true } },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => {
          if (tableMeta.rowIndex === kabasas.length) return null;
          const kabasa = kabasas[tableMeta.rowIndex];
          return (
            <>
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => handleEditClick(tableMeta.rowIndex)}
              ></i>
              <i
                className="bx bx-trash"
                style={{
                  color: "#fe1e00",
                  cursor: kabasa.isVoided ? "not-allowed" : "pointer",
                  opacity: kabasa.isVoided ? 0.5 : 1,
                }}
                onClick={() =>
                  !kabasa.isVoided && handleVoidClick(tableMeta.rowIndex)
                }
              ></i>
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
      MuiTab: {
        styleOverrides: {
          root: {
            color: "#fff", // Default color when not selected
            "&.Mui-selected": {
              color: "#fe6c00", // Color when selected
            },
            "&:hover": {
              color: "#fe6c00", // Color on hover
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: "#fe6c00", // Color of the indicator when selected
          },
        },
      },
    },
  });

  const options = {
    filterType: "checkbox",
    rowsPerPage: 10,
    customToolbar: () => (
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
        Add New Kabasa
      </Button>
    ),
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
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="kabasa tabs">
            <Tab label="Sales Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {error ? (
            <div>Error: {error.message || "An error occurred."}</div>
          ) : (
            <>
              <MUIDataTable
                title={"Kabasa Records"}
                data={isLoading ? loadingData : data}
                columns={columns}
                options={options}
              />
              <AddNewKabasaDrawer
                open={drawerOpen}
                onClose={() => {
                  setDrawerOpen(false);
                  setEditData(null);
                }}
                editMode={!!editData}
                initialData={editData || {}}
                onSaveSuccess={() => dispatch(fetchKabasas())}
              />
              <Dialog
                open={openVoidDialog}
                onClose={() => setOpenVoidDialog(false)}
                aria-labelledby="void-dialog-title"
                aria-describedby="void-dialog-description"
              >
                <DialogTitle id="void-dialog-title">
                  {"Confirm Void Transaction"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="void-dialog-description">
                    Are you sure you want to void this transaction? This action
                    cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setOpenVoidDialog(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmVoid} color="error" autoFocus>
                    Void
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </TabPanel>
        <TabPanel value="1">
          <KabsaReports />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default Kabasa;
