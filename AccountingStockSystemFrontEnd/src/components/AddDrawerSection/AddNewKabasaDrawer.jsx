// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Drawer,
//   Box,
//   TextField,
//   IconButton,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createKabasa,
//   updateKabasa,
//   fetchKabasas,
// } from "../../redux/slices/kabasaSlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import { fetchOrderItems } from "../../redux/slices/orderItemSlice";
// import { Toaster, toast } from "react-hot-toast";

// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   "& .MuiDrawer-paper": {
//     width: "30%",
//     height: "100vh",
//     top: "0",
//     boxSizing: "border-box",
//   },
// }));

// const AddNewKabasaDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
//   onSaveSuccess,
// }) => {
//   const dispatch = useDispatch();
//   const { paymentMethods, status: paymentMethodsStatus } = useSelector(
//     (state) => state.paymentMethods
//   );
//   const { items: orderItems, isLoading: isLoadingItems } = useSelector(
//     (state) => state.orderItems
//   );

//   useEffect(() => {
//     if (paymentMethodsStatus === "idle") {
//       dispatch(fetchPaymentMethods());
//     }
//     if (!orderItems || orderItems.length === 0) {
//       dispatch(fetchOrderItems()); // Fetch items for the dropdown
//     }
//   }, [dispatch, paymentMethodsStatus, orderItems]);

//   // State for form data
//   const [formData, setFormData] = useState({
//     discount: 0,
//     status: "Pending",
//     paymentMethod: "",
//     additionalNotes: "",
//     totalAmount: 0,
//   });

//   // State for order items table
//   const [orderItemsList, setOrderItemsList] = useState([]);
//   console.log("Sending orderItemsList:", orderItemsList);

//   useEffect(() => {
//     if (editMode) {
//       const { _id, salesBy, createdAt, updatedAt, __v, ...restOfInitialData } =
//         initialData;

//       setFormData({
//         ...restOfInitialData,
//         paymentMethod: initialData.paymentMethod._id,
//         orderItems: initialData.orderItems || [],
//       });
//       setOrderItemsList(
//         (initialData.orderItems || []).map(({ itemName, qty, unitPrice }) => ({
//           itemName,
//           qty: qty !== undefined ? qty : 1, // Only default if undefined
//           unitPrice: unitPrice !== undefined ? unitPrice : 0,
//           price: (qty || 1) * (unitPrice || 0),
//         }))
//       );
//     } else {
//       setFormData({
//         orderItems: [],
//         discount: 0,
//         status: "Pending",
//         paymentMethod: "",
//         additionalNotes: "",
//         totalAmount: 0,
//       });
//       setOrderItemsList([]);
//     }
//   }, [editMode, initialData, paymentMethods]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "orderItems":
//         if (orderItemsList.length === 0)
//           error.orderItems = "At least one item is required";
//         break;
//       case "paymentMethod":
//         if (!value || !paymentMethods.some((pm) => pm._id === value))
//           error.paymentMethod = "Please select a valid payment method.";
//         break;
//       case "discount":
//         if (value < 0 || value > 100) {
//           error.discount = "Discount must be between 0 and 100";
//         }
//         break;
//       default:
//         break;
//     }
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       ...error,
//     }));
//   };

//   const handleChange = (field) => (event) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: event.target.value,
//     }));
//     if (field === "discount") {
//       calculateTotalAmount();
//     }
//   };

//   const handleItemChange = (index, field) => (event) => {
//     const newItems = [...orderItemsList];
//     if (field === "itemName") {
//       const selectedItem = orderItems.find(
//         (item) => item.itemName === event.target.value
//       );
//       newItems[index].itemName = event.target.value;
//       newItems[index].unitPrice = selectedItem ? selectedItem.unitPrice : 0;
//       newItems[index].price = newItems[index].unitPrice * newItems[index].qty;
//     } else if (field === "qty") {
//       newItems[index].qty = event.target.value;
//       newItems[index].price = newItems[index].unitPrice * event.target.value;
//     }
//     setOrderItemsList(newItems);
//     calculateTotalAmount(newItems);
//   };

//   const addItem = () => {
//     setOrderItemsList([
//       ...orderItemsList,
//       { itemName: "", qty: 1, unitPrice: 0, price: 0 },
//     ]);
//     calculateTotalAmount([...orderItemsList, { price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = [...orderItemsList];
//     newItems.splice(index, 1);
//     setOrderItemsList(newItems);
//     calculateTotalAmount(newItems);
//   };

//   const calculateTotalAmount = (items = orderItemsList) => {
//     const subTotal = items.reduce((sum, item) => sum + item.price, 0);
//     const discountPercentage = parseFloat(formData.discount) / 100;
//     const discountAmount = subTotal * discountPercentage; // This should give you the discount amount
//     const total = subTotal - discountAmount; // Now subtract the discount from the subtotal

//     setFormData((prev) => ({
//       ...prev,
//       totalAmount: total,
//     }));
//   };

//   const handleSave = () => {
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );
//     validateField("orderItems", orderItemsList);

//     if (Object.values(errors).some((error) => error)) {
//       return;
//     }

//     // Additional check for paymentMethod
//     if (!paymentMethods.some((pm) => pm._id === formData.paymentMethod)) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         paymentMethod: "Please select a valid payment method.",
//       }));
//       return;
//     }

//     const validatedItems = orderItemsList
//       .map((item) => {
//         const correspondingOrderItem = orderItems.find(
//           (orderItem) => orderItem.itemName === item.itemName
//         );
//         if (!correspondingOrderItem) {
//           console.error(
//             "Could not find OrderItem for itemName:",
//             item.itemName
//           );
//           toast.error(`Item ${item.itemName} not found in the system.`);
//           return null;
//         }
//         return {
//           itemId: correspondingOrderItem._id,
//           itemName: item.itemName,
//           qty: Number(item.qty),
//           unitPrice: Number(item.unitPrice),
//         };
//       })
//       .filter((item) => item !== null);

//     // Explicitly exclude salesBy and totalAmount from kabasaData
//     const { salesBy, totalAmount, ...kabasaData } = {
//       ...formData,
//       orderItems: validatedItems,
//     };

//     if (editMode) {
//       dispatch(updateKabasa({ id: initialData._id, kabasaData }))
//         .then(() => {
//           toast.success("Kabasa record updated successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchKabasas()).then(() => onClose());
//           onSaveSuccess && onSaveSuccess();
//         })
//         .catch((error) => {
//           toast.error(`Error updating Kabasa record: ${error.message}`, {
//             duration: 5000,
//           });
//         });
//     } else {
//       dispatch(createKabasa(kabasaData))
//         .then(() => {
//           toast.success("Kabasa record added successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchKabasas()).then(() => onClose());
//           onSaveSuccess && onSaveSuccess();
//         })
//         .catch((error) => {
//           toast.error(`Error adding Kabasa record: ${error.message}`, {
//             duration: 5000,
//           });
//         });
//     }
//   };

//   const handleCancel = () => {
//     onClose();
//   };

//   if (isLoadingItems || paymentMethodsStatus === "loading") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <StyledDrawer anchor="right" open={open} onClose={onClose}>
//         <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mb: 2,
//             }}
//           >
//             <h2>{editMode ? "Edit Kabasa Record" : "Add New Kabasa Record"}</h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <FormControl fullWidth margin="normal">
//             <InputLabel id="payment-method-label">Payment Method</InputLabel>
//             <Select
//               labelId="payment-method-label"
//               value={formData.paymentMethod}
//               onChange={handleChange("paymentMethod")}
//               label="Payment Method"
//               error={!!errors.paymentMethod}
//               required
//             >
//               {paymentMethods.map((method) => (
//                 <MenuItem key={method._id} value={method._id}>
//                   {method.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             {errors.paymentMethod && (
//               <Box sx={{ color: "red", mt: 1 }}>{errors.paymentMethod}</Box>
//             )}
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="status-label">Status</InputLabel>
//             <Select
//               labelId="status-label"
//               value={formData.status}
//               onChange={handleChange("status")}
//               label="Status"
//             >
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="Paid">Paid</MenuItem>
//               <MenuItem value="Cancelled">Cancelled</MenuItem>
//               <MenuItem value="Refund">Refund</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             label="Additional Notes"
//             fullWidth
//             multiline
//             rows={4}
//             margin="normal"
//             value={formData.additionalNotes}
//             onChange={handleChange("additionalNotes")}
//           />
//           <TextField
//             label="Discount (%)"
//             fullWidth
//             margin="normal"
//             type="number"
//             value={formData.discount}
//             onChange={handleChange("discount")}
//             InputProps={{
//               inputProps: { min: 1, max: 100, step: 1 },
//             }}
//           />
//           <TextField
//             label="Total Amount"
//             fullWidth
//             margin="normal"
//             value={formData.totalAmount.toFixed(2)}
//             InputProps={{
//               readOnly: true,
//             }}
//           />
//           <h3>Order Items</h3>
//           <TableContainer component={Paper}>
//             <Table size="small" aria-label="order items table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Item Name</TableCell>
//                   <TableCell align="right">Quantity</TableCell>
//                   <TableCell align="right">Unit Price</TableCell>
//                   <TableCell align="right">Price</TableCell>
//                   <TableCell align="right">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orderItemsList.map((row, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <FormControl fullWidth sx={{ minWidth: 200 }}>
//                         <InputLabel id={`item-name-label-${index}`}>
//                           Item Name
//                         </InputLabel>
//                         <Select
//                           labelId={`item-name-label-${index}`}
//                           value={row.itemName}
//                           onChange={handleItemChange(index, "itemName")}
//                           label="Item Name"
//                         >
//                           {orderItems.map((item) => (
//                             <MenuItem key={item._id} value={item.itemName}>
//                               {item.itemName}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </TableCell>
//                     <TableCell align="right">
//                       <TextField
//                         type="number"
//                         value={row.qty}
//                         onChange={handleItemChange(index, "qty")}
//                       />
//                     </TableCell>
//                     <TableCell align="right">
//                       <TextField
//                         value={row.unitPrice}
//                         InputProps={{
//                           readOnly: true,
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell align="right">{row.price.toFixed(2)}</TableCell>
//                     <TableCell align="right">
//                       <IconButton onClick={() => removeItem(index)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Button
//             startIcon={<AddIcon />}
//             onClick={addItem}
//             sx={{ mb: 2 }}
//             disabled={editMode}
//           >
//             Add Item
//           </Button>

//           <Box
//             sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
//           >
//             <Button
//               variant="outlined"
//               onClick={handleCancel}
//               sx={{ width: "120px", borderRadius: "12px" }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={handleSave}
//               sx={{
//                 width: "120px",
//                 borderRadius: "12px",
//                 backgroundColor: "green",
//                 color: "white",
//                 "&:hover": { backgroundColor: "darkgreen" },
//               }}
//               disabled={
//                 isLoadingItems ||
//                 paymentMethodsStatus === "loading" ||
//                 paymentMethods.length === 0
//               }
//             >
//               {isLoadingItems || paymentMethodsStatus === "loading" ? (
//                 <CircularProgress size={24} />
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           </Box>
//         </Box>
//       </StyledDrawer>
//       <Toaster />
//     </>
//   );
// };

// export default AddNewKabasaDrawer;

import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  createKabasa,
  updateKabasa,
  fetchKabasas,
} from "../../redux/slices/kabasaSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import { fetchOrderItems } from "../../redux/slices/orderItemSlice";
import { Toaster, toast } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0",
    boxSizing: "border-box",
  },
}));

const AddNewKabasaDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { paymentMethods, status: paymentMethodsStatus } = useSelector(
    (state) => state.paymentMethods
  );
  const { items: orderItems, isLoading: isLoadingItems } = useSelector(
    (state) => state.orderItems
  );

  useEffect(() => {
    if (paymentMethodsStatus === "idle") {
      dispatch(fetchPaymentMethods());
    }
    if (!orderItems || orderItems.length === 0) {
      dispatch(fetchOrderItems()); // Fetch items for the dropdown
    }
  }, [dispatch, paymentMethodsStatus, orderItems]);

  // State for form data
  const [formData, setFormData] = useState({
    discount: 0,
    status: "Pending",
    paymentMethod: "",
    additionalNotes: "",
    totalAmount: 0,
  });

  // State for order items table
  const [orderItemsList, setOrderItemsList] = useState([]);
  console.log("Sending orderItemsList:", orderItemsList);

  useEffect(() => {
    if (editMode) {
      const {
        _id,
        salesBy,
        createdAt,
        updatedAt,
        __v,
        isVoided,
        ...restOfInitialData
      } = initialData;

      setFormData({
        ...restOfInitialData,
        paymentMethod: initialData.paymentMethod._id,
        orderItems: initialData.orderItems || [],
        isVoided: initialData.isVoided || false,
      });
      setOrderItemsList(
        (initialData.orderItems || []).map(({ itemName, qty, unitPrice }) => ({
          itemName,
          qty: qty !== undefined ? qty : 1, // Only default if undefined
          unitPrice: unitPrice !== undefined ? unitPrice : 0,
          price: (qty || 1) * (unitPrice || 0),
        }))
      );
    } else {
      setFormData({
        orderItems: [],
        discount: 0,
        status: "Pending",
        paymentMethod: "",
        additionalNotes: "",
        totalAmount: 0,
        isVoided: false,
      });
      setOrderItemsList([]);
    }
  }, [editMode, initialData, paymentMethods]);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "orderItems":
        if (orderItemsList.length === 0)
          error.orderItems = "At least one item is required";
        break;
      case "paymentMethod":
        if (!value || !paymentMethods.some((pm) => pm._id === value))
          error.paymentMethod = "Please select a valid payment method.";
        break;
      case "discount":
        if (value < 0 || value > 100) {
          error.discount = "Discount must be between 0 and 100";
        }
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...error,
    }));
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (field === "discount") {
      calculateTotalAmount();
    }
  };

  const handleItemChange = (index, field) => (event) => {
    const newItems = [...orderItemsList];
    if (field === "itemName") {
      const selectedItem = orderItems.find(
        (item) => item.itemName === event.target.value
      );
      newItems[index].itemName = event.target.value;
      newItems[index].unitPrice = selectedItem ? selectedItem.unitPrice : 0;
      newItems[index].price = newItems[index].unitPrice * newItems[index].qty;
    } else if (field === "qty") {
      newItems[index].qty = event.target.value;
      newItems[index].price = newItems[index].unitPrice * event.target.value;
    }
    setOrderItemsList(newItems);
    calculateTotalAmount(newItems);
  };

  const addItem = () => {
    setOrderItemsList([
      ...orderItemsList,
      { itemName: "", qty: 1, unitPrice: 0, price: 0 },
    ]);
    calculateTotalAmount([...orderItemsList, { price: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = [...orderItemsList];
    newItems.splice(index, 1);
    setOrderItemsList(newItems);
    calculateTotalAmount(newItems);
  };

  const calculateTotalAmount = (items = orderItemsList) => {
    const subTotal = items.reduce((sum, item) => sum + item.price, 0);
    const discountPercentage = parseFloat(formData.discount) / 100;
    const discountAmount = subTotal * discountPercentage; // This should give you the discount amount
    const total = subTotal - discountAmount; // Now subtract the discount from the subtotal

    setFormData((prev) => ({
      ...prev,
      totalAmount: total,
    }));
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );
    validateField("orderItems", orderItemsList);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    // Additional check for paymentMethod
    if (!paymentMethods.some((pm) => pm._id === formData.paymentMethod)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        paymentMethod: "Please select a valid payment method.",
      }));
      return;
    }

    const validatedItems = orderItemsList
      .map((item) => {
        const correspondingOrderItem = orderItems.find(
          (orderItem) => orderItem.itemName === item.itemName
        );
        if (!correspondingOrderItem) {
          console.error(
            "Could not find OrderItem for itemName:",
            item.itemName
          );
          toast.error(`Item ${item.itemName} not found in the system.`);
          return null;
        }
        return {
          itemId: correspondingOrderItem._id,
          itemName: item.itemName,
          qty: Number(item.qty),
          unitPrice: Number(item.unitPrice),
        };
      })
      .filter((item) => item !== null);

    // Explicitly exclude salesBy and totalAmount from kabasaData
    const { salesBy, totalAmount, ...kabasaData } = {
      ...formData,
      orderItems: validatedItems,
    };

    if (editMode) {
      dispatch(updateKabasa({ id: initialData._id, kabasaData }))
        .then(() => {
          toast.success("Kabasa record updated successfully!", {
            duration: 5000,
          });
          dispatch(fetchKabasas()).then(() => onClose());
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(`Error updating Kabasa record: ${error.message}`, {
            duration: 5000,
          });
        });
    } else {
      dispatch(createKabasa(kabasaData))
        .then(() => {
          toast.success("Kabasa record added successfully!", {
            duration: 5000,
          });
          dispatch(fetchKabasas()).then(() => onClose());
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(`Error adding Kabasa record: ${error.message}`, {
            duration: 5000,
          });
        });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (isLoadingItems || paymentMethodsStatus === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isDisabled = editMode && formData.isVoided;

  return (
    <>
      <StyledDrawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <h2>{editMode ? "Edit Kabasa Record" : "Add New Kabasa Record"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={formData.paymentMethod}
              onChange={handleChange("paymentMethod")}
              label="Payment Method"
              error={!!errors.paymentMethod}
              required
              disabled={isDisabled}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method._id} value={method._id}>
                  {method.name}
                </MenuItem>
              ))}
            </Select>
            {errors.paymentMethod && (
              <Box sx={{ color: "red", mt: 1 }}>{errors.paymentMethod}</Box>
            )}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status}
              onChange={handleChange("status")}
              label="Status"
              disabled={isDisabled}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Refund">Refund</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Additional Notes"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={formData.additionalNotes}
            onChange={handleChange("additionalNotes")}
            disabled={isDisabled}
          />
          <TextField
            label="Discount (%)"
            fullWidth
            margin="normal"
            type="number"
            value={formData.discount}
            onChange={handleChange("discount")}
            InputProps={{
              inputProps: { min: 1, max: 100, step: 1 },
            }}
            disabled={isDisabled}
          />
          <TextField
            label="Total Amount"
            fullWidth
            margin="normal"
            value={formData.totalAmount.toFixed(2)}
            InputProps={{
              readOnly: true,
            }}
          />
          <h3>Order Items</h3>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="order items table">
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItemsList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl fullWidth sx={{ minWidth: 200 }}>
                        <InputLabel id={`item-name-label-${index}`}>
                          Item Name
                        </InputLabel>
                        <Select
                          labelId={`item-name-label-${index}`}
                          value={row.itemName}
                          onChange={handleItemChange(index, "itemName")}
                          label="Item Name"
                          disabled={isDisabled}
                        >
                          {orderItems.map((item) => (
                            <MenuItem key={item._id} value={item.itemName}>
                              {item.itemName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={row.qty}
                        onChange={handleItemChange(index, "qty")}
                        disabled={isDisabled}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        value={row.unitPrice}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">{row.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => removeItem(index)}
                        disabled={isDisabled}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            startIcon={<AddIcon />}
            onClick={addItem}
            sx={{ mb: 2 }}
            disabled={editMode || isDisabled}
          >
            Add Item
          </Button>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ width: "120px", borderRadius: "12px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                width: "120px",
                borderRadius: "12px",
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
              disabled={
                isLoadingItems ||
                paymentMethodsStatus === "loading" ||
                paymentMethods.length === 0 ||
                isDisabled
              }
            >
              {isLoadingItems || paymentMethodsStatus === "loading" ? (
                <CircularProgress size={24} />
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewKabasaDrawer;
