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
// import { fetchAccounts, deleteAccount } from "../../redux/slices/accountSlice"; // Adjust path
// import { hasPermission } from "../../utils/authUtils";
// import AddNewAccountDrawer from "../AddDrawerSection/AddNewAccountDrawer";

// const Account = () => {
//   const dispatch = useDispatch();
//   const { accounts, loading, error } = useSelector((state) => state.accounts);
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [accountToDelete, setAccountToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAccounts()); // Fetch all active accounts
//   }, [dispatch]);

//   useEffect(() => {
//     if (accounts && Array.isArray(accounts)) {
//       const formattedData = accounts.map((account) => ({
//         id: account._id,
//         accountCode: account.accountCode || "N/A",
//         name: account.name || "N/A",
//         type: account.type || "N/A",
//         subType: account.subType || "N/A",
//         description: account.description || "N/A",
//         status: account.status || "N/A",
//         createdBy: account.createdBy?.fullName || "N/A",
//         createdAt: account.createdAt
//           ? format(new Date(account.createdAt), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//       }));
//       setData(formattedData);
//       setFilteredData(formattedData);
//     } else {
//       setData([]);
//       setFilteredData([]);
//     }
//   }, [accounts]);

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
//     link.download = "accounts.csv";
//     link.click();
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleEditClick = useCallback(
//     (account) => {
//       const rawAccount = accounts.find((a) => a._id === account.id);
//       if (rawAccount) {
//         setEditData(rawAccount);
//         setDrawerOpen(true);
//       }
//     },
//     [accounts]
//   );

//   const handleDeleteClick = useCallback((accountId) => {
//     setAccountToDelete(accountId);
//     setDeleteDialogOpen(true);
//   }, []);

//   const confirmDelete = useCallback(() => {
//     if (accountToDelete) {
//       dispatch(deleteAccount(accountToDelete))
//         .then(() => {
//           dispatch(fetchAccounts());
//           toast.success("Account deactivated successfully!");
//         })
//         .catch((error) => {
//           toast.error(`Error deactivating account: ${error.message}`);
//         });
//     }
//     setDeleteDialogOpen(false);
//     setAccountToDelete(null);
//   }, [dispatch, accountToDelete]);

//   const cancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setAccountToDelete(null);
//   };

//   const columns = [
//     { field: "accountCode", headerName: "Account Code", flex: 1 },
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "type", headerName: "Type", flex: 1 },
//     { field: "subType", headerName: "Sub Type", flex: 1 },
//     { field: "description", headerName: "Description", flex: 1 },
//     { field: "status", headerName: "Status", flex: 1 },
//     { field: "createdBy", headerName: "Created By", flex: 1 },
//     { field: "createdAt", headerName: "Created At", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:account") && (
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
//           {hasPermission(user, "delete:account") && (
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

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: "100%" }}>
//         {error ? (
//           <div>Error: {error}</div>
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
//                 Accounts
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
//                 {hasPermission(user, "write:account") && (
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => {
//                       setEditData(null);
//                       setDrawerOpen(true);
//                     }}
//                     sx={{ backgroundColor: "#fe6c00" }}
//                   >
//                     Add New Account
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//             {loading ? (
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
//                 />
//               </Box>
//             )}
//             <AddNewAccountDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//               onSaveSuccess={() => dispatch(fetchAccounts())}
//             />
//             <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
//               <DialogTitle>Deactivate Confirmation</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to deactivate this account?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelDelete}>Cancel</Button>
//                 <Button onClick={confirmDelete} color="secondary">
//                   Deactivate
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

// export default Account;

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
import { fetchAccounts, deleteAccount } from "../../redux/slices/accountSlice";
import { checkAuthStatus } from "../../redux/slices/authSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewAccountDrawer from "../AddDrawerSection/AddNewAccountDrawer";

const Account = () => {
  const dispatch = useDispatch();
  const {
    accounts = [],
    loading = false,
    error,
  } = useSelector((state) => state.accounts || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    //console.log("Account - Mount check", { isAuthenticated, initialFetchDone });
    if (!initialFetchDone) {
      if (isAuthenticated) {
        //console.log("Fetching accounts...");
        dispatch(fetchAccounts()).unwrap().then().catch();
        setInitialFetchDone(true);
      } else {
        //console.log("Checking auth status...");
        dispatch(checkAuthStatus())
          .unwrap()
          .then(() => {
            //console.log("Auth succeeded, fetching accounts...");
            dispatch(fetchAccounts())
              .unwrap()
              .then()
              .catch((err) =>
                console.error("Fetch failed after auth check:", err)
              );
            setInitialFetchDone(true);
          })
          .catch((err) => {
            //console.error("Auth check failed:", err);
            setInitialFetchDone(true);
          });
      }
    }
  }, [dispatch, isAuthenticated, initialFetchDone]);

  useEffect(() => {
    if (accounts && Array.isArray(accounts) && !loading && !error) {
      const formattedData = accounts.map((account) => ({
        id: account._id || `temp-${Math.random()}`, // Fallback ID
        accountCode: account.accountCode || "N/A",
        name: account.name || "N/A",
        type: account.type || "N/A",
        subType: account.subType || "N/A",
        description: account.description || "N/A",
        status: account.status || "N/A",
        createdBy: account.createdBy?.fullName || "N/A",
        createdAt: account.createdAt
          ? format(new Date(account.createdAt), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
      }));
      setData(formattedData);
      setFilteredData(formattedData);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [accounts, loading, error]);

  const handleSearch = useCallback(
    (searchVal) => {
      setSearchText(searchVal);
      if (!data || !Array.isArray(data)) return;
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
    },
    [data]
  );

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.headerName).join(",");
    const csvRows = filteredData
      .map((row) =>
        columns
          .map(
            (col) =>
              `"${(row[col.field] || "N/A").toString().replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");
    const csvContent = `${headers}\n${csvRows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "accounts.csv";
    link.click();
  }, [filteredData]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleEditClick = useCallback(
    (account) => {
      const rawAccount = accounts.find((a) => a._id === account.id);
      if (rawAccount) {
        setEditData(rawAccount);
        setDrawerOpen(true);
      } else {
        toast.error("Account not found for editing");
      }
    },
    [accounts]
  );

  const handleDeleteClick = useCallback((accountId) => {
    setAccountToDelete(accountId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (accountToDelete) {
      dispatch(deleteAccount(accountToDelete))
        .unwrap()
        .then(() => {
          dispatch(fetchAccounts());
          toast.success("Account deactivated successfully!", {
            duration: 5000,
          });
        })
        .catch((err) => {
          toast.error(
            `Error deactivating account: ${err.message || "Unknown error"}`,
            {
              duration: 5000,
            }
          );
        })
        .finally(() => {
          setDeleteDialogOpen(false);
          setAccountToDelete(null);
        });
    }
  }, [dispatch, accountToDelete]);

  const cancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  }, []);

  const handleRetry = useCallback(() => {
    setInitialFetchDone(false);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const columns = [
    { field: "accountCode", headerName: "Account Code", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "subType", headerName: "Sub Type", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "createdBy", headerName: "Created By", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:account") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleEditClick(params.row)}
              title="Edit Account"
            ></i>
          )}
          {hasPermission(user, "delete:account") && (
            <i
              className="bx bx-trash"
              style={{
                color: "#fe1e00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleDeleteClick(params.row.id)}
              title="Deactivate Account"
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
            "& .MuiPaper-root": { backgroundColor: "#f0f0f0" },
            "& .MuiDataGrid-row": { backgroundColor: "#29221d" },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#1e1611",
              "& .MuiDataGrid-cell": { color: "#bdbabb" },
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
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#29221d",
              color: "#fcfcfc",
              "& .MuiTablePagination-root": { color: "#fcfcfc" },
              "& .MuiIconButton-root": { color: "#fcfcfc" },
            },
            "@media print": { "& .MuiDataGrid-main": { color: "#000" } },
          },
        },
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">Please log in to view accounts.</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        {loading && filteredData.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#fe6c00" }} />
          </Box>
        ) : error ? (
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
              Error:{" "}
              {typeof error === "object" && error.message
                ? error.message
                : error || "Failed to load accounts"}
              {error?.status && ` (Status: ${error.status})`}
            </Typography>
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{
                backgroundColor: "#fe6c00",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "4px",
                "&:hover": { backgroundColor: "#fec80a", color: "#000" },
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
                "@media print": { display: "none" },
              }}
            >
              <Typography variant="h6" sx={{ color: "#000" }}>
                Accounts
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
                  sx={{ color: "#473b33", "&:hover": { color: "#fec80a" } }}
                  title="Download CSV"
                >
                  <GetAppIcon />
                </IconButton>
                <IconButton
                  onClick={handlePrint}
                  sx={{ color: "#302924", "&:hover": { color: "#fec80a" } }}
                  title="Print"
                >
                  <PrintIcon />
                </IconButton>
                {hasPermission(user, "write:account") && (
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
                    Add New Account
                  </Button>
                )}
              </Box>
            </Box>
            {filteredData.length === 0 && !loading ? (
              <Typography>No accounts available</Typography>
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
            <AddNewAccountDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => dispatch(fetchAccounts())}
            />
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
              <DialogTitle>Deactivate Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to deactivate this account?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelDelete}>Cancel</Button>
                <Button onClick={confirmDelete} color="secondary" autoFocus>
                  Deactivate
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

export default Account;
