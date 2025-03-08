// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Button, CircularProgress, Box } from "@mui/material";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllUnifiedSales } from "../../redux/slices/unifiedSalesSlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import AddNewUnifiedSalesDrawer from "../AddDrawerSection/AddNewUnifiedSalesDrawer";

// const UnifiedSales = () => {
//   const dispatch = useDispatch();
//   const {
//     sales: unifiedSales,
//     status,
//     error,
//   } = useSelector((state) => state.unifiedSales);
//   const [data, setData] = useState([]);
//   const [totalAmountSum, setTotalAmountSum] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

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
//     dispatch(getAllUnifiedSales());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchPaymentMethods());
//   }, [dispatch]);

//   useEffect(() => {
//     if (
//       unifiedSales &&
//       Array.isArray(unifiedSales) &&
//       unifiedSales.length > 0
//     ) {
//       const sum = unifiedSales.reduce(
//         (sum, sale) => sum + parseFloat(sale.totalAmount || 0),
//         0
//       );
//       const formattedData = unifiedSales.map((sale) => [
//         sale.saleType || "N/A",
//         sale.date ? formatDate(sale.date) : "N/A",
//         sale.paymentMethod?.name || "N/A",
//         sale.totalAmount || "N/A",
//       ]);

//       // Add the grand total row at the end
//       formattedData.push([
//         "",
//         "",
//         "Grand Total:",
//         <strong key="grand-total"> ${sum.toFixed(2)}</strong>,
//       ]);

//       setData(formattedData);
//       setTotalAmountSum(sum);
//     } else {
//       setData([]);
//       setTotalAmountSum(0);
//     }
//   }, [unifiedSales]);

//   const handleEditClick = (index) => {
//     const sale = unifiedSales[index];
//     if (!sale) {
//       console.error("Invalid sale data at index:", index);
//       return;
//     }
//     setEditData(sale);
//     setDrawerOpen(true);
//   };

//   const columns = [
//     { name: "Sale Type", options: { filter: true, sort: true } },
//     { name: "Date", options: { filter: true, sort: true } },
//     { name: "Payment Method", options: { filter: true, sort: false } },
//     {
//       name: "Total Amount",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value, tableMeta) => {
//           if (tableMeta.rowIndex === unifiedSales.length) {
//             return <strong>{value}</strong>;
//           }
//           return `$${parseFloat(value).toFixed(2)}`;
//         },
//       },
//     },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (_, tableMeta) => {
//           if (tableMeta.rowIndex === unifiedSales.length) return null; // Don't show actions for grand total row
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
//               title={"Unified Sales Records"}
//               data={status === "loading" ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewUnifiedSalesDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default UnifiedSales;

import React, { useEffect, useState, useCallback } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { getAllUnifiedSales } from "../../redux/slices/unifiedSalesSlice"; // Adjust the path as needed
import AddNewUnifiedSalesDrawer from "../AddDrawerSection/AddNewUnifiedSalesDrawer";

const UnifiedSales = () => {
  const dispatch = useDispatch();
  const { sales, status, error } = useSelector((state) => state.unifiedSales);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const apiRef = useGridApiRef();

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return !isNaN(date.getTime())
      ? date.toISOString().split("T")[0] // Format date as YYYY-MM-DD
      : "N/A";
  };

  useEffect(() => {
    dispatch(getAllUnifiedSales());
  }, [dispatch]);

  // Format sales directly for DataGrid
  const formattedSales = sales.map((sale) => ({
    ...sale,
    id: sale._id, // Ensure each row has a unique id property
    date: formatDate(sale.date),
    paymentMethod: sale.paymentMethod?.name || "N/A",
    cashier: sale.cashier?.name || "N/A",
  }));

  const handleEditClick = (params) => {
    const sale = params.row;
    // Ensure dropdowns in AddNewUnifiedSalesDrawer are pre-selected
    setEditData({
      ...sale,
      paymentMethod: sale.paymentMethod?._id || sale.paymentMethod || "",
      cashier: sale.cashier?._id || sale.cashier || "",
    });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (id) => {
    console.log("Setting delete ID to:", id);
    if (id) {
      setDeleteId(id);
      setDeleteDialogOpen(true);
    } else {
      console.error("Attempted to delete with undefined ID");
    }
  };

  const handleSearch = useCallback(
    (event) => {
      const value = event.target.value;
      setSearchText(value);
      apiRef.current.setFilterModel({
        items: [
          {
            columnField: "saleType", // Search on sale type
            operatorValue: "contains",
            value: value,
          },
        ],
      });
    },
    [apiRef]
  );

  const handleSearchIconClick = () => {
    if (searchOpen && searchText) {
      setSearchText("");
      apiRef.current.setFilterModel({ items: [] });
    }
    setSearchOpen((prev) => !prev);
  };

  // Define columns with flex property to take up equal space
  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "saleType", headerName: "Sale Type", flex: 1 },
    { field: "totalAmount", headerName: "Total Amount", flex: 1 },
    { field: "paymentMethod", headerName: "Payment Method", flex: 1 },
    { field: "cashier", headerName: "Cashier", flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <i
            className="bx bx-pencil"
            style={{ color: "#fe6c00", cursor: "pointer", marginRight: "12px" }}
            onClick={() => handleEditClick(params)}
          ></i>
          <i
            className="bx bx-trash"
            style={{ color: "#fe1e00", cursor: "pointer" }}
            onClick={() => handleDeleteClick(params.id)}
          ></i>
        </>
      ),
    },
  ];

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            "& .MuiDataGrid-cell": {
              color: "#fff",
              fontSize: "18px",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#e0e0e0",
              color: "#000",
              fontSize: "18px",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: "#29221d",
              "&:hover": {
                backgroundColor: "#1e1611",
                color: "#bdbabb",
              },
            },
            "& .MuiTablePagination-root": {
              color: "#fff",
            },
            "& .MuiTablePagination-selectIcon": {
              color: "#fff",
            },
            "& .MuiTablePagination-actions button": {
              color: "#fff",
            },
          },
        },
      },
    },
  });

  const options = {
    rowsPerPageOptions: [10, 25, 50],
    pageSize: 10,
    checkboxSelection: false,
    disableSelectionOnClick: true,
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {error ? (
          <div>Error: {error.message || "An error occurred."}</div>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                backgroundColor: "#bdbabb",
                padding: "10px",
              }}
            >
              <Typography variant="h6">Unified Sales</Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {searchOpen ? (
                  <TextField
                    value={searchText}
                    onChange={handleSearch}
                    placeholder="Search..."
                    variant="outlined"
                    size="small"
                    sx={{ width: "200px" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearchIconClick}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <IconButton onClick={handleSearchIconClick} color="primary">
                    <SearchIcon />
                  </IconButton>
                )}
                <IconButton onClick={() => window.print()} color="primary">
                  <PrintIcon />
                </IconButton>
                <IconButton
                  onClick={() =>
                    apiRef.current.exportDataAsCsv({
                      fileName: "unified_sales",
                    })
                  }
                  color="primary"
                >
                  <CloudDownloadIcon />
                </IconButton>
                <Button
                  onClick={() => {
                    setEditData(null);
                    setDrawerOpen(true);
                  }}
                  variant="contained"
                  startIcon={<AddIcon />}
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
              </Box>
            </Box>

            <DataGrid
              className="printable-data-grid"
              apiRef={apiRef}
              rows={status === "loading" ? [] : formattedSales}
              columns={columns}
              loading={status === "loading"}
              autoHeight
              getRowId={(row) => row.id} // Use this to specify how to get the ID
              sx={{
                "@media print": {
                  ".MuiDataGrid-main": { maxHeight: "none !important" },
                },
              }}
              {...options}
            />
            <AddNewUnifiedSalesDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
            />
            <Dialog
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
            >
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this sale?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button color="primary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default UnifiedSales;
