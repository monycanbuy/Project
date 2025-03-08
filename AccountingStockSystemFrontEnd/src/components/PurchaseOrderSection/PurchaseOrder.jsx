// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import {
//   Button,
//   CircularProgress,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from "@mui/material";
// import { format } from "date-fns";
// import "boxicons";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchPurchaseOrders,
//   voidPurchaseOrder,
// } from "../../redux/slices/purchaseOrderSlice";
// import AddNewPurchaseOrderDrawer from "../AddDrawerSection/AddNewPurchaseOrderDrawer";

// const PurchaseOrders = () => {
//   const dispatch = useDispatch();
//   const { purchaseOrders, isLoading, error } = useSelector(
//     (state) => state.purchaseOrders
//   );
//   const { inventories } = useSelector((state) => state.inventories);
//   const { suppliers } = useSelector((state) => state.suppliers);
//   const [data, setData] = useState();
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   // State for managing the void confirmation dialog
//   const [voidDialogOpen, setVoidDialogOpen] = useState(false);
//   const [purchaseOrderToVoid, setPurchaseOrderToVoid] = useState(null);

//   useEffect(() => {
//     console.log("Fetching purchase orders...");
//     dispatch(fetchPurchaseOrders());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log("Purchase Orders from state:", purchaseOrders);
//     if (
//       purchaseOrders &&
//       Array.isArray(purchaseOrders) &&
//       purchaseOrders.length > 0
//     ) {
//       const formattedData = purchaseOrders.map((order) => [
//         order.supplier.contactPerson, // Assuming supplier is populated with contactPerson
//         format(new Date(order.orderDate), "yyyy-MM-dd HH:mm:ss"),
//         order.expectedDelivery
//           ? format(new Date(order.expectedDelivery), "yyyy-MM-dd HH:mm:ss")
//           : "N/A",
//         order.items.map((item) => ({
//           productName: item.inventory.name,
//           quantity: item.quantityOrdered,
//           unitPrice: item.unitPrice,
//         })),
//         order.status,
//         order._id || "N/A",
//       ]);
//       console.log("Formatted Data:", formattedData);
//       setData(formattedData);
//     } else {
//       console.log(
//         "No purchase orders data available or data is not in expected format"
//       );
//     }
//   }, [purchaseOrders]);

//   const handleEditClick = (order) => {
//     if (!order || order.length < 6) {
//       console.error("Invalid order data:", order);
//       return;
//     }

//     const orderData = {
//       _id: order,
//       supplier:
//         suppliers.find((supplier) => supplier.contactPerson === order)?._id ||
//         "",
//       orderDate: order,
//       expectedDelivery: order,
//       items: order.map((item) => ({
//         inventory:
//           inventories.find((inv) => inv.name === item.productName)?._id || "",
//         quantityOrdered: item.quantity,
//         unitPrice: item.unitPrice,
//       })),
//       status: order,
//     };

//     setEditData(orderData);
//     setDrawerOpen(true);
//   };

//   const handleVoidClick = (orderId) => {
//     setPurchaseOrderToVoid(orderId);
//     setVoidDialogOpen(true);
//   };

//   const confirmVoid = () => {
//     if (purchaseOrderToVoid) {
//       dispatch(voidPurchaseOrder(purchaseOrderToVoid))
//         .then(() => {
//           console.log("Purchase order voided successfully");
//           dispatch(fetchPurchaseOrders()); // Refresh the list
//         })
//         .catch((error) => {
//           console.error("Error voiding purchase order:", error);
//           // Here you might want to show some error feedback to the user
//         });
//     }
//     setVoidDialogOpen(false);
//     setPurchaseOrderToVoid(null);
//   };

//   const cancelVoid = () => {
//     setVoidDialogOpen(false);
//     setPurchaseOrderToVoid(null);
//   };

//   const columns = [
//     { name: "Supplier", options: { filter: true, sort: true } },
//     {
//       name: "Order Date",
//       options: { filter: true, sort: true, customBodyRender: (value) => value },
//     },
//     {
//       name: "Expected Delivery",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => value,
//       },
//     },
//     {
//       name: "Items",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value) => (
//           <ul>
//             {value.map((item, index) => (
//               <li key={index}>
//                 {item.productName} - {item.quantity} x {item.unitPrice}
//               </li>
//             ))}
//           </ul>
//         ),
//       },
//     },
//     { name: "Status", options: { filter: true, sort: true } },
//     {
//       name: "Action",
//       options: {
//         filter: false,
//         sort: false,
//         customBodyRender: (value, tableMeta) => {
//           const order = tableMeta.rowData;
//           return (
//             <>
//               <i
//                 className="bx bx-pencil"
//                 style={{
//                   color: "#fe6c00",
//                   cursor: "pointer",
//                   marginRight: "12px",
//                 }}
//                 onClick={() => handleEditClick(order)}
//               ></i>
//               <i
//                 className="bx bx-trash"
//                 style={{ color: "#fe1e00", cursor: "pointer" }}
//                 onClick={() => handleVoidClick(order)}
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
//     rowsPerPage: 10,
//     //... your other options
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
//               title={"Purchase Orders"} // Set the title
//               data={isLoading ? loadingData : data}
//               columns={columns}
//               options={options}
//             />
//             <AddNewPurchaseOrderDrawer // Use the drawer component
//               open={drawerOpen}
//               onClose={() => {
//                 setDrawerOpen(false);
//                 setEditData(null);
//               }}
//               editMode={!!editData}
//               initialData={editData || {}}
//             />
//             <Dialog
//               open={voidDialogOpen}
//               onClose={cancelVoid}
//               aria-labelledby="alert-dialog-title"
//               aria-describedby="alert-dialog-description"
//             >
//               <DialogTitle id="alert-dialog-title">
//                 {"Void Confirmation"}
//               </DialogTitle>
//               <DialogContent>
//                 <DialogContentText id="alert-dialog-description">
//                   Are you sure you want to void this purchase order?
//                 </DialogContentText>
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={cancelVoid} color="primary">
//                   Cancel
//                 </Button>
//                 <Button onClick={confirmVoid} color="secondary" autoFocus>
//                   Void
//                 </Button>
//               </DialogActions>
//             </Dialog>
//           </>
//         )}
//       </div>
//     </ThemeProvider>
//   );
// };

// export default PurchaseOrders;

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
  fetchPurchaseOrders,
  voidPurchaseOrder,
} from "../../redux/slices/purchaseOrderSlice";
import { hasPermission } from "../../utils/authUtils";
import AddNewPurchaseOrderDrawer from "../AddDrawerSection/AddNewPurchaseOrderDrawer";
import { toast, Toaster } from "react-hot-toast"; // Import toast

const PurchaseOrders = () => {
  const dispatch = useDispatch();
  const { purchaseOrders, isLoading, error } = useSelector(
    (state) => state.purchaseOrders
  );
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]); // Initialize as empty array
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [purchaseOrderToVoid, setPurchaseOrderToVoid] = useState(null);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  useEffect(() => {
    if (purchaseOrders && Array.isArray(purchaseOrders)) {
      const formattedData = purchaseOrders.map((order) => [
        order.supplier ? order.supplier.contactPerson : "N/A", // Handle null supplier
        order.orderDate
          ? format(new Date(order.orderDate), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        order.expectedDelivery
          ? format(new Date(order.expectedDelivery), "yyyy-MM-dd HH:mm:ss")
          : "N/A",
        order.items.map((item) => ({
          productName: item.inventory ? item.inventory.name : "N/A", // Handle null inventory
          quantity: item.quantityOrdered,
          unitPrice: item.unitPrice,
        })),
        order.status || "N/A",
        order._id, // Keep the _id for actions
      ]);
      setData(formattedData);
    } else {
      setData([]); // Set to empty array if no data
    }
  }, [purchaseOrders]);

  const handleEditClick = (order) => {
    // Pass the *entire* order object
    setEditData(order);
    setDrawerOpen(true);
  };

  const handleVoidClick = (orderId) => {
    setPurchaseOrderToVoid(orderId); // Store only the ID
    setVoidDialogOpen(true);
  };

  const confirmVoid = () => {
    if (purchaseOrderToVoid) {
      dispatch(voidPurchaseOrder(purchaseOrderToVoid))
        .unwrap() // Use unwrap for better error handling
        .then(() => {
          dispatch(fetchPurchaseOrders());
          toast.success("Purchase order voided successfully!");
        })
        .catch((error) => {
          // Display the *specific* error message from Redux
          toast.error(`Error voiding purchase order: ${error.message}`);
        })
        .finally(() => {
          setVoidDialogOpen(false);
          setPurchaseOrderToVoid(null);
        });
    }
  };

  const cancelVoid = () => {
    setVoidDialogOpen(false);
    setPurchaseOrderToVoid(null);
  };

  const columns = [
    { name: "Supplier", options: { filter: true, sort: true } },
    { name: "Order Date", options: { filter: true, sort: true } },
    { name: "Expected Delivery", options: { filter: true, sort: true } },
    {
      name: "Items",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (items) => (
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.productName} - {item.quantity} x ₦
                {item.unitPrice.toFixed(2)}
              </li>
            ))}
          </ul>
        ),
      },
    },
    { name: "Status", options: { filter: true, sort: true } },
    {
      name: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const order = purchaseOrders[tableMeta.rowIndex];
          if (!order) return null;
          return (
            <>
              {hasPermission(user, "write:purchaseorders") && (
                <i
                  className="bx bx-pencil"
                  style={{
                    color: "#fe6c00",
                    cursor: "pointer",
                    marginRight: "12px",
                  }}
                  onClick={() => handleEditClick(order)}
                ></i>
              )}

              {hasPermission(user, "delete:purchaseorders") && (
                <i
                  className="bx bx-trash"
                  style={{ color: "#fe1e00", cursor: "pointer" }}
                  onClick={() => handleVoidClick(order._id)}
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
              fontSize: "18px",
            },
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
              "& .MuiTypography-root": {
                fontSize: "18px",
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
      hasPermission(user, "write:paymentmethod") ? (
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
          Add New Purchase Order
        </Button>
      ) : null,
  };
  //   customToolbar: () => (
  //     // Corrected placement
  //     <Button
  //       variant="contained"
  //       size="small"
  //       onClick={() => {
  //         setEditData(null);
  //         setDrawerOpen(true);
  //       }}
  //       sx={{
  //         backgroundColor: "#fe6c00",
  //         color: "#fff",
  //         "&:hover": {
  //           backgroundColor: "#fec80a",
  //           color: "#bdbabb",
  //         },
  //       }}
  //     >
  //       Add New Purchase Order
  //     </Button>
  //   ),
  // };

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
          <div>
            Error: {error.message || "An error occurred."}
            {error.status && <div>Status Code: {error.status}</div>}
          </div>
        ) : (
          <>
            <MUIDataTable
              title={"Purchase Orders"}
              data={isLoading ? loadingData : data}
              columns={columns}
              options={options}
            />
            <AddNewPurchaseOrderDrawer
              open={drawerOpen}
              onClose={() => {
                setDrawerOpen(false);
                setEditData(null);
              }}
              editMode={!!editData}
              initialData={editData || {}}
              onSaveSuccess={() => dispatch(fetchPurchaseOrders())}
            />
            <Dialog
              open={voidDialogOpen}
              onClose={cancelVoid}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Void Confirmation"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to void this purchase order?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelVoid} color="primary">
                  Cancel
                </Button>
                <Button onClick={confirmVoid} color="secondary" autoFocus>
                  Void
                </Button>
              </DialogActions>
            </Dialog>
            <Toaster />
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default PurchaseOrders;
