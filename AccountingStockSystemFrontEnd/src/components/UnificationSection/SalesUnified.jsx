// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAnotherUnifiedSales,
//   voidAnotherUnifiedSale,
// } from "../../redux/slices/salesUnifiedSlice";
// import {
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import AddNewSalesUnifiedDrawer from "../AddDrawerSection/AddNewSalesUnifiedDrawer";

// const SalesUnified = () => {
//   const dispatch = useDispatch();
//   const { sales, status, error } = useSelector(
//     (state) => state.anotherUnifiedSales
//   );
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [saleToVoid, setSaleToVoid] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     const fetchSales = () => {
//       setIsFetching(true);
//       dispatch(fetchAnotherUnifiedSales()).finally(() => setIsFetching(false));
//     };

//     // Debounce the fetch operation
//     const debounceFetch = setTimeout(fetchSales, 300);

//     // Cleanup function to clear the timeout if component unmounts or effect runs again
//     return () => clearTimeout(debounceFetch);
//   }, [dispatch]);

//   const columns = [
//     {
//       name: "date",
//       label: "Date",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => new Date(value).toLocaleString(),
//       },
//     },
//     {
//       name: "totalAmount",
//       label: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) =>
//           new Intl.NumberFormat("en-NG", {
//             style: "currency",
//             currency: "NGN",
//             minimumFractionDigits: 2,
//           }).format(value),
//       },
//     },
//     {
//       name: "paymentMethod",
//       label: "Payment Method",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.name || "Unknown",
//       },
//     },
//     {
//       name: "saleType",
//       label: "Sale Type",
//       options: {
//         filter: true,
//         sort: false,
//       },
//     },
//     {
//       name: "cashier",
//       label: "Cashier",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => value?.fullName || "Unknown",
//       },
//     },
//     {
//       name: "isVoided",
//       label: "Voided",
//       options: {
//         filter: true,
//         sort: false,
//         customBodyRender: (value) => (value ? "Yes" : "No"),
//       },
//     },
//     {
//       name: "actions",
//       label: "Actions",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const sale = sales[tableMeta.rowIndex];
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => {
//                   setEditData(sale);
//                   setDrawerOpen(true);
//                 }}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => {
//                   setSaleToVoid(sale);
//                   setVoidDialogOpen(true);
//                 }}
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
//             "& .MuiPaper-root": {
//               backgroundColor: "#f0f0f0",
//             },
//             "& .MuiTableRow-root": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 "& .MuiTableCell-root": {
//                   color: "#bdbabb",
//                 },
//               },
//             },
//             "& .MuiTableCell-root": {
//               color: "#fff",
//               fontSize: "18px",
//             },
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
//               "& .MuiTypography-root": {
//                 fontSize: "18px",
//               },
//               "& .MuiIconButton-root": {
//                 color: "#3f51b5",
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   const options = {
//     filterType: "checkbox",
//     responsive: "standard",
//     selectableRows: "none",
//     customToolbar: () => (
//       <Button
//         variant="contained"
//         size="small"
//         onClick={() => {
//           setEditData(null);
//           setDrawerOpen(true);
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
//         Add New Sale
//       </Button>
//     ),
//   };

//   // Function to handle void confirmation
//   const handleConfirmVoid = () => {
//     if (saleToVoid) {
//       dispatch(voidAnotherUnifiedSale(saleToVoid._id));
//       setVoidDialogOpen(false);
//       // Refresh table after voiding - consider debouncing this if it's happening too often
//       setIsFetching(true);
//       dispatch(fetchAnotherUnifiedSales()).finally(() => setIsFetching(false));
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         <>
//           {isFetching && (
//             <div
//               style={{
//                 position: "absolute",
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//                 zIndex: 1000,
//               }}
//             >
//               <CircularProgress size={60} style={{ color: "#fe6c00" }} />
//             </div>
//           )}
//           <MUIDataTable
//             title={"Unified Sales List"}
//             data={sales}
//             columns={columns}
//             options={options}
//           />
//           <AddNewSalesUnifiedDrawer
//             open={drawerOpen}
//             onClose={() => {
//               setDrawerOpen(false);
//               setEditData(null);
//             }}
//             editMode={!!editData}
//             initialData={editData || {}}
//             onSaveSuccess={() => dispatch(fetchAnotherUnifiedSales())}
//           />
//           <Dialog
//             open={voidDialogOpen}
//             onClose={() => setVoidDialogOpen(false)}
//             aria-labelledby="alert-dialog-title"
//             aria-describedby="alert-dialog-description"
//           >
//             <DialogTitle id="alert-dialog-title">
//               {"Confirm Void Transaction"}
//             </DialogTitle>
//             <DialogContent>
//               <DialogContentText id="alert-dialog-description">
//                 Are you sure you want to void this transaction? This action
//                 cannot be undone.
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setVoidDialogOpen(false)}>Cancel</Button>
//               <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                 Void
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default SalesUnified;
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnotherUnifiedSales,
  voidAnotherUnifiedSale,
} from "../../redux/slices/salesUnifiedSlice";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddNewSalesUnifiedDrawer from "../AddDrawerSection/AddNewSalesUnifiedDrawer";
import SalesUnifiedReports from "./Reports/SalesUnifiedReports"; // Assuming you have this component

const SalesUnified = () => {
  const dispatch = useDispatch();
  const { sales, status, error } = useSelector(
    (state) => state.anotherUnifiedSales
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [saleToVoid, setSaleToVoid] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [value, setValue] = useState("0"); // State for tab control

  useEffect(() => {
    const fetchSales = () => {
      setIsFetching(true);
      dispatch(fetchAnotherUnifiedSales()).finally(() => setIsFetching(false));
    };

    // Debounce the fetch operation
    const debounceFetch = setTimeout(fetchSales, 300);

    // Cleanup function to clear the timeout if component unmounts or effect runs again
    return () => clearTimeout(debounceFetch);
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    {
      name: "date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => new Date(value).toLocaleString(),
      },
    },
    {
      name: "totalAmount",
      label: "Total Amount",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) =>
          new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
          }).format(value),
      },
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => value?.name || "Unknown",
      },
    },
    {
      name: "saleType",
      label: "Sale Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "cashier",
      label: "Cashier",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => value?.fullName || "Unknown",
      },
    },
    {
      name: "isVoided",
      label: "Voided",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => (value ? "Yes" : "No"),
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const sale = sales[tableMeta.rowIndex];
          return (
            <>
              <i
                className="bx bx-pencil"
                style={{
                  color: "#fe6c00",
                  cursor: "pointer",
                  marginRight: "12px",
                }}
                onClick={() => {
                  setEditData(sale);
                  setDrawerOpen(true);
                }}
              ></i>
              <i
                className="bx bx-trash"
                style={{ color: "#fe1e00", cursor: "pointer" }}
                onClick={() => {
                  setSaleToVoid(sale);
                  setVoidDialogOpen(true);
                }}
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
    responsive: "standard",
    selectableRows: "none",
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
        Add New Sale
      </Button>
    ),
  };

  // Function to handle void confirmation
  const handleConfirmVoid = () => {
    if (saleToVoid) {
      dispatch(voidAnotherUnifiedSale(saleToVoid._id));
      setVoidDialogOpen(false);
      // Refresh table after voiding - consider debouncing this if it's happening too often
      setIsFetching(true);
      dispatch(fetchAnotherUnifiedSales()).finally(() => setIsFetching(false));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="sales unified tabs">
            <Tab label="Sales Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          <div>
            <>
              {isFetching && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000,
                  }}
                >
                  <CircularProgress size={60} style={{ color: "#fe6c00" }} />
                </div>
              )}
              <MUIDataTable
                title={"Unified Sales List"}
                data={sales}
                columns={columns}
                options={options}
              />
              <AddNewSalesUnifiedDrawer
                open={drawerOpen}
                onClose={() => {
                  setDrawerOpen(false);
                  setEditData(null);
                }}
                editMode={!!editData}
                initialData={editData || {}}
                onSaveSuccess={() => dispatch(fetchAnotherUnifiedSales())}
              />
              <Dialog
                open={voidDialogOpen}
                onClose={() => setVoidDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Confirm Void Transaction"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to void this transaction? This action
                    cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setVoidDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmVoid} color="error" autoFocus>
                    Void
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          </div>
        </TabPanel>
        <TabPanel value="1">
          <SalesUnifiedReports />
        </TabPanel>
      </TabContext>
    </ThemeProvider>
  );
};

export default SalesUnified;
