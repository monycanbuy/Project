// import React, { useEffect, useState, useCallback } from "react";
// import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Typography,
//   IconButton,
//   TextField,
//   InputAdornment,
// } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts, deleteProduct } from "../../redux/slices/productsSlice"; // Adjust the path as needed
// import { hasPermission } from "../../../../AccountingStockSystem/middlewares/authMiddleware";
// import AddNewProductDrawer from "../AddDrawerSection/AddNewProductDrawer";
// import "./Products.css"; // Import the CSS file

// const Products = () => {
//   const dispatch = useDispatch();
//   const { products, status, error, pagination } = useSelector(
//     (state) => state.products
//   );
//   const { categories } = useSelector((state) => state.categories);
//   const { user } = useSelector((state) => state.auth);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);
//   const apiRef = useGridApiRef();

//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return !isNaN(date.getTime())
//       ? date.toISOString().split("T")[0] // Format date as YYYY-MM-DD
//       : "N/A";
//   };

//   useEffect(() => {
//     dispatch(fetchProducts({ page: 1, limit: 10 }));
//   }, [dispatch]);

//   // Ensure products is always an array
//   const formattedProducts = Array.isArray(products)
//     ? products.map((product) => ({
//         ...product,
//         createdAt: formatDate(product.createdAt),
//         category: {
//           name: product.category?.name || "N/A",
//           id: product.category?._id || "N/A",
//         },
//         supplier: {
//           contactPerson: product.supplier?.contactPerson || "N/A",
//           id: product.supplier?._id || "N/A",
//         },
//         location: {
//           name: product.location?.name || "N/A",
//           id: product.location?._id || "N/A",
//         },
//         expiryDate: formatDate(product.expiryDate) || "N/A",
//         reorderLevel: product.reorderLevel || "N/A",
//         reorderQuantity: product.reorderQuantity || "N/A",
//         unit: product.unit || "N/A",
//         isPerishable: product.isPerishable ? "Yes" : "No",
//         lastRestocked: formatDate(product.lastRestocked) || "N/A",
//         description: product.description || "N/A",
//         price: new Intl.NumberFormat("en-NG", {
//           style: "currency",
//           currency: "NGN",
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }).format(product.price || 0),
//         stockKeeper: product.stockKeeper?.fullName || "N/A",
//       }))
//     : [];

//   const handleEditClick = (params) => {
//     const product = params.row;

//     // Parse the price if it's coming as a formatted string (remove currency symbol and parse)
//     const priceValue =
//       typeof product.price === "string"
//         ? parseFloat(product.price.replace(/[^0-9.-]+/g, "")) // This regex removes everything that's not a number, minus sign or decimal point
//         : product.price;
//     // Ensure dropdowns in AddNewProductDrawer are pre-selected
//     setEditData({
//       ...product,
//       category: product.category?.id || "",
//       supplier: product.supplier?.id || "",
//       location: product.location?.id || "", // Added for location
//       price: priceValue,
//     });
//     setDrawerOpen(true);
//   };

//   const handleDeleteClick = (id) => {
//     console.log("Setting delete ID to:", id);
//     if (id) {
//       setDeleteId(id);
//       setDeleteDialogOpen(true);
//     } else {
//       console.error("Attempted to delete with undefined ID");
//     }
//   };

//   const confirmDelete = () => {
//     console.log("Attempting to delete product with ID:", deleteId);
//     if (deleteId) {
//       dispatch(deleteProduct(deleteId))
//         .then((response) => {
//           console.log("Delete response:", response);
//           setDeleteDialogOpen(false);
//           setDeleteId(null);
//           // Optionally refresh DataGrid here
//           dispatch(fetchProducts({ page: pagination.currentPage, limit: 10 })); // Refresh the product list
//         })
//         .catch((error) => {
//           console.error("Error deleting product:", error);
//         });
//     } else {
//       console.error("Deletion attempted with no ID");
//     }
//   };

//   const handleSearch = useCallback(
//     (event) => {
//       const value = event.target.value;
//       setSearchText(value);
//       apiRef.current.setFilterModel({
//         items: [
//           {
//             columnField: "name", // Search on product name
//             operatorValue: "contains",
//             value: value,
//           },
//         ],
//       });
//     },
//     [apiRef]
//   );

//   const handleSearchIconClick = () => {
//     if (searchOpen && searchText) {
//       setSearchText("");
//       apiRef.current.setFilterModel({ items: [] });
//     }
//     setSearchOpen((prev) => !prev);
//   };

//   // Define columns with flex property to take up equal space
//   const columns = [
//     { field: "createdAt", headerName: "Date", flex: 1 },
//     { field: "name", headerName: "Name", flex: 1 },
//     { field: "price", headerName: "Price", flex: 1 },
//     {
//       field: "category",
//       headerName: "Category",
//       flex: 1,
//       renderCell: (params) => params.row.category.name,
//     },
//     {
//       field: "supplier",
//       headerName: "Supplier",
//       flex: 1,
//       renderCell: (params) => params.row.supplier.contactPerson,
//     },
//     {
//       field: "location",
//       headerName: "Location",
//       flex: 1,
//       renderCell: (params) => params.row.location.name,
//     },
//     { field: "stockQuantity", headerName: "Stock Quantity", flex: 1 },
//     { field: "stockKeeper", headerName: "Stock Keeper", flex: 1 },
//     { field: "expiryDate", headerName: "Expiry Date", flex: 1 },
//     { field: "reorderLevel", headerName: "Reorder Level", flex: 1 },
//     { field: "reorderQuantity", headerName: "Reorder Quantity", flex: 1 },
//     //{ field: "unit", headerName: "Unit", flex: 1 },
//     { field: "isPerishable", headerName: "Perishable", flex: 1 },
//     { field: "lastRestocked", headerName: "Last Restocked", flex: 1 },
//     //{ field: "description", headerName: "Description", flex: 1 },
//     {
//       field: "imageUrl",
//       headerName: "Image",
//       flex: 1,
//       renderCell: (params) => (
//         <img
//           src={params.value}
//           alt="Product"
//           style={{ width: "50px", height: "50px", objectFit: "cover" }}
//         />
//       ),
//     },
//     {
//       field: "actions",
//       headerName: "Action",
//       flex: 1,
//       sortable: false,
//       filterable: false,
//       renderCell: (params) => (
//         <>
//           {hasPermission(user, "update:products") && (
//             <i
//               className="bx bx-pencil"
//               style={{
//                 color: "#fe6c00",
//                 cursor: "pointer",
//                 marginRight: "12px",
//               }}
//               onClick={() => handleEditClick(params)}
//             ></i>
//           )}

//           {hasPermission(user, "delete:products") && (
//             <i
//               className="bx bx-trash"
//               style={{ color: "#fe1e00", cursor: "pointer" }}
//               onClick={() => handleDeleteClick(params.id)}
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
//             "& .MuiDataGrid-cell": {
//               color: "#fff",
//               fontSize: "18px",
//             },
//             "& .MuiDataGrid-columnHeader": {
//               backgroundColor: "#e0e0e0",
//               color: "#000",
//               fontSize: "18px",
//               fontWeight: "bold",
//             },
//             "& .MuiDataGrid-row": {
//               backgroundColor: "#29221d",
//               "&:hover": {
//                 backgroundColor: "#1e1611",
//                 color: "#bdbabb",
//               },
//             },
//             "& .MuiTablePagination-root": {
//               color: "#fff", // Set pagination text color to white
//             },
//             "& .MuiTablePagination-selectIcon": {
//               color: "#fff", // Set pagination select icon color to white
//             },
//             "& .MuiTablePagination-actions button": {
//               color: "#fff", // Set pagination buttons color to white
//             },
//           },
//         },
//       },
//     },
//   });

//   const options = {
//     rowsPerPageOptions: [10, 25, 50],
//     pageSize: 10,
//     checkboxSelection: false,
//     disableSelectionOnClick: true,
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <div>
//         {error ? (
//           <div>Error: {error.message || "An error occurred."}</div>
//         ) : (
//           <>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//                 backgroundColor: "#bdbabb", // Set background color
//                 padding: "10px", // Add padding for better spacing
//               }}
//             >
//               <Typography variant="h6">Products</Typography>
//               <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                 {searchOpen ? (
//                   <TextField
//                     value={searchText}
//                     onChange={handleSearch}
//                     placeholder="Search..."
//                     variant="outlined"
//                     size="small"
//                     sx={{ width: "200px" }}
//                     InputProps={{
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton onClick={handleSearchIconClick}>
//                             <SearchIcon />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                   />
//                 ) : (
//                   <IconButton onClick={handleSearchIconClick} color="primary">
//                     <SearchIcon />
//                   </IconButton>
//                 )}
//                 <IconButton onClick={() => window.print()} color="primary">
//                   <PrintIcon />
//                 </IconButton>
//                 <IconButton
//                   onClick={() =>
//                     apiRef.current.exportDataAsCsv({ fileName: "products" })
//                   }
//                   color="primary"
//                 >
//                   <CloudDownloadIcon />
//                 </IconButton>
//                 hasPermission(user, "write:paymentmethod") ? (
//                 <Button
//                   onClick={() => {
//                     setEditData(null);
//                     setDrawerOpen(true);
//                   }}
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   sx={{
//                     backgroundColor: "#fe6c00",
//                     color: "#fff",
//                     "&:hover": {
//                       backgroundColor: "#fec80a",
//                       color: "#bdbabb",
//                     },
//                   }}
//                 >
//                   Add New Product
//                 </Button>
//                 ):null
//                 {/* <Button
//                   onClick={() => {
//                     setEditData(null);
//                     setDrawerOpen(true);
//                   }}
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   sx={{
//                     backgroundColor: "#fe6c00",
//                     color: "#fff",
//                     "&:hover": {
//                       backgroundColor: "#fec80a",
//                       color: "#bdbabb",
//                     },
//                   }}
//                 >
//                   Add New Product
//                 </Button> */}
//               </Box>
//             </Box>

//             <DataGrid
//               className="printable-data-grid" // Add a class to the DataGrid
//               apiRef={apiRef}
//               rows={status === "loading" ? [] : formattedProducts}
//               columns={columns}
//               loading={status === "loading"}
//               autoHeight
//               getRowId={(row) => row._id} // Use this to specify how to get the ID
//               sx={{
//                 "@media print": {
//                   ".MuiDataGrid-main": { maxHeight: "none !important" },
//                 },
//               }}
//               {...options}
//             />
//             <AddNewProductDrawer
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//             <Dialog
//               open={deleteDialogOpen}
//               onClose={() => setDeleteDialogOpen(false)}
//             >
//               <DialogTitle>Confirm Delete</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Are you sure you want to delete this product?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button
//                   onClick={() => setDeleteDialogOpen(false)}
//                   color="primary"
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmDelete} color="primary" autoFocus>
//                   Delete
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default Products;

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
import { fetchProducts, deleteProduct } from "../../redux/slices/productsSlice";
import { hasPermission } from "../../utils/authUtils"; // Corrected import path
import AddNewProductDrawer from "../AddDrawerSection/AddNewProductDrawer";
import "./Products.css";

const Products = () => {
  const dispatch = useDispatch();
  const { products, status, error, pagination } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth);
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
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "N/A";
  };

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const formattedProducts = Array.isArray(products)
    ? products.map((product) => ({
        ...product,
        createdAt: formatDate(product.createdAt),
        category: {
          name: product.category?.name || "N/A",
          id: product.category?._id || "N/A",
        },
        supplier: {
          contactPerson: product.supplier?.contactPerson || "N/A",
          id: product.supplier?._id || "N/A",
        },
        location: {
          name: product.location?.name || "N/A",
          id: product.location?._id || "N/A",
        },
        expiryDate: formatDate(product.expiryDate) || "N/A",
        reorderLevel: product.reorderLevel || "N/A",
        reorderQuantity: product.reorderQuantity || "N/A",
        unit: product.unit || "N/A",
        isPerishable: product.isPerishable ? "Yes" : "No",
        lastRestocked: formatDate(product.lastRestocked) || "N/A",
        description: product.description || "N/A",
        price: new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(product.price || 0),
        stockKeeper: product.stockKeeper?.fullName || "N/A",
      }))
    : [];

  const handleEditClick = (params) => {
    const product = params.row;
    const priceValue =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
        : product.price;
    setEditData({
      ...product,
      category: product.category?.id || "",
      supplier: product.supplier?.id || "",
      location: product.location?.id || "",
      price: priceValue,
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

  const confirmDelete = () => {
    console.log("Attempting to delete product with ID:", deleteId);
    if (deleteId) {
      dispatch(deleteProduct(deleteId))
        .then((response) => {
          console.log("Delete response:", response);
          setDeleteDialogOpen(false);
          setDeleteId(null);
          dispatch(fetchProducts({ page: pagination.currentPage, limit: 10 }));
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    } else {
      console.error("Deletion attempted with no ID");
    }
  };

  const handleSearch = useCallback(
    (event) => {
      const value = event.target.value;
      setSearchText(value);
      apiRef.current.setFilterModel({
        items: [
          {
            columnField: "name",
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

  const columns = [
    { field: "createdAt", headerName: "Date", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      renderCell: (params) => params.row.category.name,
    },
    {
      field: "supplier",
      headerName: "Supplier",
      flex: 1,
      renderCell: (params) => params.row.supplier.contactPerson,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      renderCell: (params) => params.row.location.name,
    },
    { field: "stockQuantity", headerName: "Stock Quantity", flex: 1 },
    { field: "stockKeeper", headerName: "Stock Keeper", flex: 1 },
    { field: "expiryDate", headerName: "Expiry Date", flex: 1 },
    { field: "reorderLevel", headerName: "Reorder Level", flex: 1 },
    { field: "reorderQuantity", headerName: "Reorder Quantity", flex: 1 },
    { field: "isPerishable", headerName: "Perishable", flex: 1 },
    { field: "lastRestocked", headerName: "Last Restocked", flex: 1 },
    {
      field: "imageUrl",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Product"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {hasPermission(user, "update:products") && (
            <i
              className="bx bx-pencil"
              style={{
                color: "#fe6c00",
                cursor: "pointer",
                marginRight: "12px",
              }}
              onClick={() => handleEditClick(params)}
            ></i>
          )}
          {hasPermission(user, "delete:products") && (
            <i
              className="bx bx-trash"
              style={{ color: "#fe1e00", cursor: "pointer" }}
              onClick={() => handleDeleteClick(params.id)}
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
            "& .MuiDataGrid-cell": { color: "#fff", fontSize: "18px" },
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
            "& .MuiTablePagination-root": { color: "#fff" },
            "& .MuiTablePagination-selectIcon": { color: "#fff" },
            "& .MuiTablePagination-actions button": { color: "#fff" },
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
              <Typography variant="h6">Products</Typography>
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
                    apiRef.current.exportDataAsCsv({ fileName: "products" })
                  }
                  color="primary"
                >
                  <CloudDownloadIcon />
                </IconButton>
                {hasPermission(user, "write:products") && (
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
                    Add New Product
                  </Button>
                )}
              </Box>
            </Box>

            <DataGrid
              className="printable-data-grid"
              apiRef={apiRef}
              rows={status === "loading" ? [] : formattedProducts}
              columns={columns}
              loading={status === "loading"}
              autoHeight
              getRowId={(row) => row._id}
              sx={{
                "@media print": {
                  ".MuiDataGrid-main": { maxHeight: "none !important" },
                },
              }}
              {...options}
            />
            <AddNewProductDrawer
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
                  Are you sure you want to delete this product?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDeleteDialogOpen(false)}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button onClick={confirmDelete} color="primary" autoFocus>
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

export default Products;
