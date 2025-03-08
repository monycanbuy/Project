// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchHallTransactions,
//   voidHallTransaction,
// } from "../../redux/slices/hallSlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewHallDrawer from "../AddDrawerSection/AddNewHallDrawer";
// import { Toaster, toast } from "react-hot-toast";
// import HallReports from "./Reports/HallReports";

// const Hall = () => {
//   const dispatch = useDispatch();
//   const {
//     transactions: hallTransactions = [],
//     isLoading,
//     error,
//   } = useSelector((state) => state.hallTransactions || {});
//   const { paymentMethods } = useSelector((state) => state.paymentMethods);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [totalAmountSum, setTotalAmountSum] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [openVoidDialog, setOpenVoidDialog] = useState(false); // State for voiding confirmation dialog
//   const [hallToVoid, setHallToVoid] = useState(null); // State to hold the hall transaction to void
//   const [value, setValue] = useState("0");

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toLocaleString("en-US", {
//           dateStyle: "medium",
//           timeStyle: "short",
//         })
//       : "N/A";
//   };

//   useEffect(() => {
//     dispatch(fetchHallTransactions());
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   useEffect(() => {
//     if (
//       hallTransactions &&
//       Array.isArray(hallTransactions) &&
//       hallTransactions.length > 0
//     ) {
//       const sum = hallTransactions.reduce(
//         (sum, transaction) => sum + parseFloat(transaction.totalAmount || 0),
//         0
//       );

//       const formattedData = hallTransactions.map((transaction) => {
//         const staffInvolved = transaction.staffInvolved
//           ? transaction.staffInvolved.fullName
//           : "N/A";
//         const paymentMethod = transaction.paymentMethod
//           ? paymentMethods.find(
//               (pm) => pm._id === transaction.paymentMethod._id
//             )
//           : null;
//         return [
//           transaction.customerName || "N/A",
//           transaction.contactPhone || "N/A",
//           transaction.startTime ? formatDate(transaction.startTime) : "N/A",
//           transaction.endTime ? formatDate(transaction.endTime) : "N/A",
//           staffInvolved,
//           transaction.eventType || "N/A",
//           paymentMethod ? paymentMethod.name : "N/A",
//           transaction.paymentStatus || "N/A",
//           transaction.notes || "N/A",
//           transaction.isVoided ? "Yes" : "No",
//           transaction.totalAmount !== undefined
//             ? `₦${parseFloat(transaction.totalAmount).toFixed(2)}`
//             : "₦0.00",
//         ];
//       });

//       formattedData.push([
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "",
//         "Grand Total:",
//         <strong key="grand-total">₦{sum.toFixed(2)}</strong>,
//       ]);

//       setData(formattedData);
//       setTotalAmountSum(sum);
//     } else {
//       setData([]);
//       setTotalAmountSum(0);
//     }
//   }, [hallTransactions, paymentMethods]);

//   const handleEditClick = (index) => {
//     const transaction = hallTransactions[index];
//     if (!transaction) {
//       console.error("Invalid transaction data at index:", index);
//       return;
//     }
//     setEditData(transaction);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (index) => {
//     const transaction = hallTransactions[index];
//     if (!transaction) {
//       console.error("Invalid transaction data at index:", index);
//       return;
//     }
//     setHallToVoid(transaction);
//     setOpenVoidDialog(true); // Open the void confirmation dialog
//   };

//   const handleConfirmVoid = async () => {
//     if (hallToVoid) {
//       try {
//         const response = await dispatch(
//           voidHallTransaction(hallToVoid._id)
//         ).unwrap();
//         if (response.success) {
//           toast.success("Hall transaction successfully voided");
//           dispatch(fetchHallTransactions()); // Refresh the table
//         } else {
//           toast.error(response.message || "Failed to void hall transaction");
//         }
//       } catch (error) {
//         if (error.message === "This transaction has already been voided") {
//           toast.error("This hall transaction has already been voided.");
//         } else {
//           toast.error(error.message || "Failed to void hall transaction");
//         }
//       } finally {
//         setOpenVoidDialog(false);
//       }
//     }
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const columns = [
//     { name: "Customer Name", options: { filter: true, sort: true } },
//     { name: "Contact Phone", options: { filter: true, sort: false } },
//     { name: "Start Time", options: { filter: true, sort: true } },
//     { name: "End Time", options: { filter: true, sort: true } },
//     { name: "Staff Involved", options: { filter: true, sort: false } },
//     { name: "Event Type", options: { filter: true, sort: false } },
//     { name: "Payment Method", options: { filter: true, sort: false } },
//     { name: "Payment Status", options: { filter: true, sort: false } },
//     { name: "Notes", options: { filter: true, sort: false } },
//     { name: "Voided", options: { filter: true, sort: false } },
//     { name: "Total Amount", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => {
//           const transaction = hallTransactions[tableMeta.rowIndex];
//           if (!transaction) return null;
//           return (
//             <>
//               {hasPermission(user, "write:hall") && (
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

//               {hasPermission(user, "delete:hall") && (
//                 <i
//                   className="bx bx-trash"
//                   style={{
//                     color: "#fe1e00",
//                     cursor: transaction.isVoided ? "not-allowed" : "pointer",
//                     opacity: transaction.isVoided ? 0.5 : 1,
//                   }}
//                   onClick={() =>
//                     !transaction.isVoided && handleVoidClick(tableMeta.rowIndex)
//                   }
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
//       MuiTab: {
//         styleOverrides: {
//           root: {
//             color: "#fff", // Default color when not selected
//             "&.Mui-selected": {
//               color: "#fe6c00", // Color when selected
//             },
//             "&:hover": {
//               color: "#fe6c00", // Color on hover
//             },
//           },
//         },
//       },
//       MuiTabs: {
//         styleOverrides: {
//           indicator: {
//             backgroundColor: "#fe6c00", // Color of the indicator when selected
//           },
//         },
//       },
//     },
//   });

//   const options = {
//     filterType: "checkbox",
//     rowsPerPage: 10,
//     customToolbar: () =>
//       hasPermission(user, "write:hall") ? (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={() => {
//             setEditData(null);
//             setDrawerOpen(true);
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
//           Add New Hall Transaction
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
//       <TabContext value={value}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <TabList onChange={handleChange} aria-label="hall tabs">
//             <Tab label="Transaction Records" value="0" />
//             <Tab label="Reports" value="1" />
//           </TabList>
//         </Box>
//         <TabPanel value="0">
//           {error ? (
//             <div>Error: {error.message || "An error occurred."}</div>
//           ) : (
//             <>
//               <MUIDataTable
//                 title={"Hall Transaction Records"}
//                 data={isLoading ? loadingData : data}
//                 columns={columns}
//                 options={options}
//               />
//               <AddNewHallDrawer
//                 open={drawerOpen}
//                 onClose={() => {
//                   setDrawerOpen(false);
//                   setEditData(null);
//                 }}
//                 editMode={!!editData}
//                 initialData={editData || {}}
//                 onSaveSuccess={() => dispatch(fetchHallTransactions())}
//               />
//               <Dialog
//                 open={openVoidDialog}
//                 onClose={() => setOpenVoidDialog(false)}
//                 aria-labelledby="void-dialog-title"
//                 aria-describedby="void-dialog-description"
//               >
//                 <DialogTitle id="void-dialog-title">
//                   {"Confirm Void Transaction"}
//                 </DialogTitle>
//                 <DialogContent>
//                   <DialogContentText id="void-dialog-description">
//                     Are you sure you want to void this transaction? This action
//                     cannot be undone.
//                   </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                   <Button
//                     onClick={() => setOpenVoidDialog(false)}
//                     color="primary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button onClick={handleConfirmVoid} color="error" autoFocus>
//                     Void
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </>
//           )}
//         </TabPanel>
//         <TabPanel value="1">
//           <HallReports />
//         </TabPanel>
//       </TabContext>
//       <Toaster />
//     </ThemeProvider>
//   );
// };

// export default Hall;

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
import {
  fetchHallTransactions,
  voidHallTransaction,
} from "../../redux/slices/hallSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewHallDrawer from "../AddDrawerSection/AddNewHallDrawer";
import { Toaster, toast } from "react-hot-toast";
import HallReports from "./Reports/HallReports";

const Hall = () => {
  const dispatch = useDispatch();
  const {
    transactions: hallTransactions = [],
    isLoading,
    error,
  } = useSelector((state) => state.hallTransactions || {});
  const { paymentMethods } = useSelector((state) => state.paymentMethods);
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [totalAmountSum, setTotalAmountSum] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openVoidDialog, setOpenVoidDialog] = useState(false); // State for voiding confirmation dialog
  const [hallToVoid, setHallToVoid] = useState(null); // State to hold the hall transaction to void
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
    dispatch(fetchHallTransactions());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (
      hallTransactions &&
      Array.isArray(hallTransactions) &&
      hallTransactions.length > 0
    ) {
      const sum = hallTransactions.reduce(
        (sum, transaction) => sum + parseFloat(transaction.totalAmount || 0),
        0
      );

      const formattedData = hallTransactions.map((transaction) => {
        const staffInvolved = transaction.staffInvolved
          ? transaction.staffInvolved.fullName
          : "N/A";
        const paymentMethod = transaction.paymentMethod
          ? paymentMethods.find(
              (pm) => pm._id === transaction.paymentMethod._id
            )
          : null;
        return {
          id: transaction._id || "N/A",
          customerName: transaction.customerName || "N/A",
          contactPhone: transaction.contactPhone || "N/A",
          startTime: transaction.startTime
            ? formatDate(transaction.startTime)
            : "N/A",
          endTime: transaction.endTime
            ? formatDate(transaction.endTime)
            : "N/A",
          staffInvolved,
          eventType: transaction.eventType || "N/A",
          paymentMethod: paymentMethod ? paymentMethod.name : "N/A",
          paymentStatus: transaction.paymentStatus || "N/A",
          notes: transaction.notes || "N/A",
          isVoided: transaction.isVoided ? "Yes" : "No",
          totalAmount:
            transaction.totalAmount !== undefined
              ? `₦${parseFloat(transaction.totalAmount).toFixed(2)}`
              : "₦0.00",
        };
      });

      setData(formattedData);
      setTotalAmountSum(sum);
    } else {
      setData([]);
      setTotalAmountSum(0);
    }
  }, [hallTransactions, paymentMethods]);

  const handleEditClick = (transaction) => {
    if (!transaction) {
      console.error("Invalid transaction data:", transaction);
      return;
    }
    setEditData(transaction);
    setDrawerOpen(true);
  };

  const handleVoidClick = (transaction) => {
    if (!transaction) {
      console.error("Invalid transaction data:", transaction);
      return;
    }
    setHallToVoid(transaction);
    setOpenVoidDialog(true); // Open the void confirmation dialog
  };

  const handleConfirmVoid = async () => {
    if (hallToVoid) {
      try {
        const response = await dispatch(
          voidHallTransaction(hallToVoid._id)
        ).unwrap();
        if (response.success) {
          toast.success("Hall transaction successfully voided");
          dispatch(fetchHallTransactions()); // Refresh the table
        } else {
          toast.error(response.message || "Failed to void hall transaction");
        }
      } catch (error) {
        if (error.message === "This transaction has already been voided") {
          toast.error("This hall transaction has already been voided.");
        } else {
          toast.error(error.message || "Failed to void hall transaction");
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
    { field: "customerName", headerName: "Customer Name", flex: 1 },
    { field: "contactPhone", headerName: "Contact Phone", flex: 1 },
    { field: "startTime", headerName: "Start Time", flex: 1 },
    { field: "endTime", headerName: "End Time", flex: 1 },
    { field: "staffInvolved", headerName: "Staff Involved", flex: 1 },
    { field: "eventType", headerName: "Event Type", flex: 1 },
    { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
    { field: "paymentStatus", headerName: "Payment Status", flex: 1 },
    { field: "notes", headerName: "Notes", flex: 1 },
    { field: "isVoided", headerName: "Voided", flex: 1 },
    { field: "totalAmount", headerName: "Total Amount", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "write:hall") && (
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
          {hasPermission(user, "delete:hall") && (
            <i
              className="bx bx-trash"
              style={{
                color: "#fe1e00",
                cursor:
                  params.row.isVoided === "Yes" ? "not-allowed" : "pointer",
                opacity: params.row.isVoided === "Yes" ? 0.5 : 1,
              }}
              onClick={() =>
                params.row.isVoided !== "Yes" && handleVoidClick(params.row)
              }
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
            "& .MuiDataGrid-toolbarContainer": {
              backgroundColor: "#d0d0d0",
              "& .MuiButton-root": { color: "#3f51b5" },
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

  return (
    <ThemeProvider theme={theme}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="hall tabs">
            <Tab label="Transaction Records" value="0" />
            <Tab label="Reports" value="1" />
          </TabList>
        </Box>
        <TabPanel value="0">
          {error ? (
            <div>Error: {error.message || "An error occurred."}</div>
          ) : (
            <>
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
                    rows={data}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                    components={{
                      Toolbar: () =>
                        hasPermission(user, "write:hall") ? (
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
                            Add New Hall Transaction
                          </Button>
                        ) : null,
                    }}
                  />
                </Box>
              )}
              <AddNewHallDrawer
                open={drawerOpen}
                onClose={() => {
                  setDrawerOpen(false);
                  setEditData(null);
                }}
                editMode={!!editData}
                initialData={editData || {}}
                onSaveSuccess={() => dispatch(fetchHallTransactions())}
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
          <HallReports />
        </TabPanel>
      </TabContext>
      <Toaster />
    </ThemeProvider>
  );
};

export default Hall;
