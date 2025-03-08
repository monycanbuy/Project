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
import { fetchSeminars, voidSeminar } from "../../redux/slices/seminarSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewSeminarDrawer from "../AddDrawerSection/AddNewSeminarDrawer";
import { Toaster, toast } from "react-hot-toast";
import SeminarReports from "./Reports/SeminarReports";

const Seminar = () => {
  const dispatch = useDispatch();
  const { seminars, isLoading, error } = useSelector((state) => state.seminar);
  const { paymentMethods } = useSelector((state) => state.paymentMethods);
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [totalAmountSum, setTotalAmountSum] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openVoidDialog, setOpenVoidDialog] = useState(false); // State for voiding confirmation dialog
  const [seminarToVoid, setSeminarToVoid] = useState(null); // State to hold the seminar to void
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
    dispatch(fetchSeminars());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (seminars && Array.isArray(seminars) && seminars.length > 0) {
      const sum = seminars.reduce(
        (sum, seminar) => sum + parseFloat(seminar.totalAmount || 0),
        0
      );

      const formattedData = seminars.map((seminar) => {
        const soldBy = seminar.salesBy ? seminar.salesBy.fullName : "N/A";
        const paymentMethodName = seminar.paymentMethod
          ? seminar.paymentMethod.name
          : "N/A";
        return [
          seminar.organizationName || "N/A",
          seminar.contactPhone || "N/A",
          seminar.seminarDate ? formatDate(seminar.seminarDate) : "N/A",
          soldBy,
          seminar.address || "N/A",
          seminar.eventType || "N/A",
          paymentMethodName,
          seminar.status || "N/A",
          seminar.additionalNotes || "N/A",
          seminar.isVoided ? "Yes" : "No",
          seminar.totalAmount !== undefined
            ? `₦${parseFloat(seminar.totalAmount).toFixed(2)}`
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
  }, [seminars, paymentMethods]);

  const handleEditClick = (index) => {
    const seminar = seminars[index];
    if (!seminar) {
      console.error("Invalid seminar data at index:", index);
      return;
    }
    setEditData(seminar);
    setDrawerOpen(true);
  };

  const handleVoidClick = (index) => {
    const seminar = seminars[index];
    if (!seminar) {
      console.error("Invalid seminar data at index:", index);
      return;
    }
    setSeminarToVoid(seminar);
    setOpenVoidDialog(true); // Open the void confirmation dialog
  };

  const handleConfirmVoid = async () => {
    if (seminarToVoid) {
      try {
        const response = await dispatch(
          voidSeminar(seminarToVoid._id)
        ).unwrap();
        if (response.success) {
          toast.success("Seminar record successfully voided");
          dispatch(fetchSeminars()); // Refresh the table
        } else {
          toast.error(response.message || "Failed to void seminar record");
        }
      } catch (error) {
        if (error.message === "This seminar has already been voided") {
          toast.error("This seminar record has already been voided.");
        } else {
          toast.error(error.message || "Failed to void seminar record");
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
    { name: "Organization", options: { filter: true, sort: true } },
    { name: "Contact Phone", options: { filter: true, sort: false } },
    { name: "Date", options: { filter: true, sort: true } },
    { name: "Sold By", options: { filter: true, sort: false } },
    { name: "Address", options: { filter: true, sort: false } },
    { name: "Event Type", options: { filter: true, sort: false } },
    { name: "Payment Method", options: { filter: true, sort: false } },
    { name: "Status", options: { filter: true, sort: false } },
    { name: "Notes", options: { filter: true, sort: false } },
    { name: "Voided", options: { filter: true, sort: false } },
    { name: "Total Amount", options: { filter: true, sort: true } },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => {
          if (tableMeta.rowIndex === seminars.length) return null;
          const seminar = seminars[tableMeta.rowIndex];
          return (
            <>
              {hasPermission(user, "update:seminars") && (
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
              {hasPermission(user, "delete:seminars") && (
                <i
                  className="bx bx-trash"
                  style={{
                    color: "#fe1e00",
                    cursor: seminar.isVoided ? "not-allowed" : "pointer",
                    opacity: seminar.isVoided ? 0.5 : 1,
                  }}
                  onClick={() =>
                    !seminar.isVoided && handleVoidClick(tableMeta.rowIndex)
                  }
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
    customToolbar: () =>
      hasPermission(user, "write:seminars") ? (
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
          Add New Seminar
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
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="seminar tabs">
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
                title={"Seminar Records"}
                data={isLoading ? loadingData : data}
                columns={columns}
                options={options}
              />
              <AddNewSeminarDrawer
                open={drawerOpen}
                onClose={() => {
                  setDrawerOpen(false);
                  setEditData(null);
                }}
                editMode={!!editData}
                initialData={editData || {}}
                onSaveSuccess={() => dispatch(fetchSeminars())}
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
          <SeminarReports />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default Seminar;
