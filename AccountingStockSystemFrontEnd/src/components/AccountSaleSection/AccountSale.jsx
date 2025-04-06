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
// import GetAppIcon from "@mui/icons-material/GetApp";
// import PrintIcon from "@mui/icons-material/Print";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAccountSales,
//   deleteAccountSale,
// } from "../../redux/slices/accountSaleSlice";
// import { hasPermission } from "../../utils/authUtils";
// import AddNewAccountSaleDrawer from "../AddDrawerSection/AddNewAccountSaleDrawer";

// const AccountSale = () => {
//   const dispatch = useDispatch();
//   const { accountSales, status, error } = useSelector(
//     (state) => state.accountSales
//   );
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [saleToDelete, setSaleToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAccountSales());
//   }, [dispatch]);

//   useEffect(() => {
//     if (accountSales && Array.isArray(accountSales)) {
//       console.log("Raw accountSales:", accountSales); // Debug
//       const formattedData = accountSales.map((sale) => ({
//         id: sale._id,
//         customer: sale.customer?.name || "N/A",
//         amount: sale.amount || "N/A",
//         isCreditSale: sale.isCreditSale ? "Yes" : "No",
//         ledgerTransactionId:
//           sale.ledgerTransactionId?.description ||
//           sale.ledgerTransactionId ||
//           "N/A",
//         invoiceNumber: sale.invoiceNumber || "N/A",
//         date: sale.date
//           ? format(new Date(sale.date), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         status: sale.status || "N/A",
//         createdBy: sale.createdBy?.fullName || "N/A",
//         createdAt: sale.createdAt
//           ? format(new Date(sale.createdAt), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [accountSales]);

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
//     link.download = "account_sales.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (sale) => {
//       const rawSale = accountSales.find((s) => s._id === sale.id);
//       if (rawSale) {
//         setEditData(rawSale);
//         setDrawerOpen(true);
//       }
//     },
//     [accountSales]
//   );

//   const handleDeleteClick = useCallback((saleId) => {
//     setSaleToDelete(saleId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmDelete = useCallback(() => {
//     if (saleToDelete) {
//       dispatch(deleteAccountSale(saleToDelete))
//         .then(() => {
//           dispatch(fetchAccountSales());
//           toast.success("Account sale cancelled successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error cancelling account sale: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setSaleToDelete(null);
//   }, [dispatch, saleToDelete]);

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setSaleToDelete(null);
//   };

//   const columns = [
//     { field: "customer", headerName: "Customer", flex: 2 },
//     { field: "amount", headerName: "Amount", flex: 1 },
//     { field: "isCreditSale", headerName: "Credit Sale", flex: 1 },
//     { field: "ledgerTransactionId", headerName: "Ledger Transaction", flex: 2 },
//     { field: "invoiceNumber", headerName: "Invoice Number", flex: 2 },
//     { field: "date", headerName: "Sale Date", flex: 2 },
//     { field: "status", headerName: "Status", flex: 1 },
//     { field: "createdBy", headerName: "Created By", flex: 2 },
//     { field: "createdAt", headerName: "Created At", flex: 2 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:account-sale") && (
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
//           {hasPermission(user, "delete:account-sale") && (
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
//               backgroundColor: "#29221d",
//               color: "#fcfcfc",
//               "& .MuiTablePagination-root": {
//                 color: "#fcfcfc",
//               },
//               "& .MuiIconButton-root": {
//                 color: "#fcfcfc",
//               },
//             },
//             "@media print": {
//               "& .MuiDataGrid-main": {
//                 color: "#000",
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   // Custom NoRowsOverlay component
//   const CustomNoRowsOverlay = () => (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100%",
//         backgroundColor: "#29221d", // Match row background
//       }}
//     >
//       <Typography
//         sx={{
//           color: "#fff", // White text to match grid cells
//           fontSize: "18px", // Match cell font size
//         }}
//       >
//         No account sales available
//       </Typography>
//     </Box>
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         {error ? (
//           <Box sx={{ p: 2 }}>
//             <Typography color="error">
//               Error fetching account sales:{" "}
//               {typeof error === "string"
//                 ? error
//                 : error.message || "An unknown error occurred"}
//             </Typography>
//             <Typography variant="body2">
//               Check the server logs for more details.
//             </Typography>
//           </Box>
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
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#000" }}>
//                 Account Sales
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
//                 <IconButton onClick={handleExport} title="Download CSV">
//                   <GetAppIcon />
//                 </IconButton>
//                 <IconButton onClick={handlePrint} title="Print">
//                   <PrintIcon />
//                 </IconButton>
//                 {hasPermission(user, "write:account-sale") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditData(null);
//                       setDrawerOpen(true);
//                     }}
//                     sx={{ backgroundColor: "#fe6c00" }}
//                   >
//                     Add New Sale
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             {status === "loading" ? (
//               <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//                 <CircularProgress sx={{ color: "#fe6c00" }} />
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
//                   slots={{
//                     noRowsOverlay: CustomNoRowsOverlay, // Use custom overlay
//                   }}
//                 />
//               </Box>
//             )}
//             <AddNewAccountSaleDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchAccountSales())}
//             />
//             <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//               <DialogTitle>Cancel Confirmation</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this account sale?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete}>Cancel</Button>
//                 <Button onClick={confirmDelete} color="secondary">
//                   Confirm Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             <Toaster />
//           </>
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default AccountSale;

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
  fetchAccountSales,
  deleteAccountSale,
} from "../../redux/slices/accountSaleSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice"; // Import checkAuthStatus
import { hasPermission } from "../../utils/authUtils";
import AddNewAccountSaleDrawer from "../AddDrawerSection/AddNewAccountSaleDrawer";

const AccountSale = () => {
  const dispatch = useDispatch();
  const { accountSales, status, error } = useSelector(
    (state) => state.accountSales || {}
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth || {}); // Add isAuthenticated

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false); // Add flag

  useEffect(() => {
    // console.log("AccountSale - Mount check", {
    //   isAuthenticated,
    //   initialFetchDone,
    // });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching account sales...");
        dispatch(fetchAccountSales()).finally(() => {
          setInitialFetchDone(true);
        });
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching account sales...");
            dispatch(fetchAccountSales()).finally(() => {
              setInitialFetchDone(true);
            });
          })
          .catch((err) => {
            //console.error("Auth check failed:", err);
            setInitialFetchDone(true); // Set flag even on failure
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    if (accountSales && Array.isArray(accountSales)) {
      //console.log("Raw accountSales:", accountSales); // Debug
      const formattedData = accountSales.map((sale) => ({
        id: sale._id || "N/A",
        customer: sale.customer?.name || "N/A",
        amount: sale.amount || "N/A",
        isCreditSale: sale.isCreditSale ? "Yes" : "No",
        ledgerTransactionId:
          sale.ledgerTransactionId?.description ||
          sale.ledgerTransactionId ||
          "N/A",
        invoiceNumber: sale.invoiceNumber || "N/A",
        date: sale.date
          ? format(new Date(sale.date), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        status: sale.status || "N/A",
        createdBy: sale.createdBy?.fullName || "N/A",
        createdAt: sale.createdAt
          ? format(new Date(sale.createdAt), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [accountSales]);

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
    link.download = "account_sales.csv";
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = useCallback(
    (sale) => {
      const rawSale = accountSales.find((s) => s._id === sale.id);
      if (rawSale) {
        setEditData(rawSale);
        setDrawerOpen(true);
      }
    },
    [accountSales]
  );

  const handleDeleteClick = useCallback((saleId) => {
    setSaleToDelete(saleId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (saleToDelete) {
      dispatch(deleteAccountSale(saleToDelete))
        .then(() => {
          dispatch(fetchAccountSales());
          toast.success("Account sale cancelled successfully!");
        })
        .catch((error) => {
          toast.error(`Error cancelling account sale: ${error.message}`);
        });
    }
    setDeleteDialogOpen(false);
    setSaleToDelete(null);
  }, [dispatch, saleToDelete]);

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setSaleToDelete(null);
  };

  const columns = [
    { field: "customer", headerName: "Customer", flex: 2 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "isCreditSale", headerName: "Credit Sale", flex: 1 },
    { field: "ledgerTransactionId", headerName: "Ledger Transaction", flex: 2 },
    { field: "invoiceNumber", headerName: "Invoice Number", flex: 2 },
    { field: "date", headerName: "Sale Date", flex: 2 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "createdBy", headerName: "Created By", flex: 2 },
    { field: "createdAt", headerName: "Created At", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:account-sale") && (
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
          {hasPermission(user, "delete:account-sale") && (
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

  // Custom NoRowsOverlay component
  const CustomNoRowsOverlay = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#29221d", // Match row background
      }}
    >
      <Typography
        sx={{
          color: "#fff", // White text to match grid cells
          fontSize: "18px", // Match cell font size
        }}
      >
        No account sales available
      </Typography>
    </Box>
  );

  // Render unauthorized message if not authenticated
  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">
          Please log in to view account sales.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {error ? (
          <Box sx={{ p: 2 }}>
            <Typography color="error">
              Error fetching account sales:{" "}
              {typeof error === "string"
                ? error
                : error.message || "An unknown error occurred"}
            </Typography>
            <Typography variant="body2">
              Check the server logs for more details.
            </Typography>
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
              }}
            >
              <Typography variant="h6" sx={{ color: "#000" }}>
                Account Sales
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
                <IconButton onClick={handleExport} title="Download CSV">
                  <GetAppIcon />
                </IconButton>
                <IconButton onClick={handlePrint} title="Print">
                  <PrintIcon />
                </IconButton>
                {hasPermission(user, "write:account-sale") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEditData(null);
                      setDrawerOpen(true);
                    }}
                    sx={{ backgroundColor: "#fe6c00" }}
                  >
                    Add New Sale
                  </Button>
                )}
              </Box>
            </Box>
            {status === "loading" ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#fe6c00" }} />
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
                  slots={{
                    noRowsOverlay: CustomNoRowsOverlay, // Use custom overlay
                  }}
                />
              </Box>
            )}
            <AddNewAccountSaleDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => dispatch(fetchAccountSales())}
            />
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
              <DialogTitle>Cancel Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this account sale?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelDelete}>Cancel</Button>
                <Button onClick={confirmDelete} color="secondary">
                  Confirm Delete
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

export default AccountSale;
