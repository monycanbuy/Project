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
// import { createSeminar, updateSeminar } from "../../redux/slices/seminarSlice";
// import { fetchOrderItems } from "../../redux/slices/orderItemSlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import { Toaster, toast } from "react-hot-toast";

// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   "& .MuiDrawer-paper": {
//     width: "30%",
//     height: "100vh",
//     top: "0",
//     boxSizing: "border-box",
//   },
// }));

// const AddNewSeminarDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
//   onSaveSuccess,
// }) => {
//   const dispatch = useDispatch();
//   const { items: orderItems, isLoading: isLoadingItems } = useSelector(
//     (state) => state.orderItems
//   );
//   const { paymentMethods, status: paymentMethodsStatus } = useSelector(
//     (state) => state.paymentMethods
//   );

//   useEffect(() => {
//     if (!orderItems || orderItems.length === 0) {
//       dispatch(fetchOrderItems());
//     }
//   }, [dispatch, orderItems]);

//   useEffect(() => {
//     if (paymentMethodsStatus === "idle") {
//       dispatch(fetchPaymentMethods());
//     }
//   }, [dispatch, paymentMethodsStatus]);

//   // State for form data
//   const [formData, setFormData] = useState({
//     organizationName: "",
//     contactPhone: "",
//     seminarDate: "",
//     address: "",
//     eventType: "conference",
//     paymentMethod: "",
//     status: "Pending",
//     additionalNotes: "",
//     discount: 0,
//     totalAmount: 0, // Added totalAmount to formData
//   });

//   // State for order items table
//   const [orderItemsList, setOrderItemsList] = useState([]);

//   useEffect(() => {
//     if (editMode) {
//       // Explicitly exclude _id from formData
//       const { _id, ...restOfInitialData } = initialData;
//       setFormData({
//         ...restOfInitialData,
//         seminarDate: initialData.seminarDate
//           ? new Date(initialData.seminarDate).toISOString().slice(0, 16)
//           : "",
//         totalAmount: initialData.totalAmount || 0,
//         discount: initialData.discount || 0,
//         orderItems: initialData.orderItems || [],
//       });
//       setOrderItemsList(
//         (initialData.orderItems || []).map(({ itemName, qty, unitPrice }) => ({
//           itemName,
//           qty: qty || 1,
//           unitPrice: unitPrice || 0,
//           price: (qty || 1) * (unitPrice || 0),
//         }))
//       );
//     } else {
//       setFormData({
//         organizationName: "",
//         contactPhone: "",
//         seminarDate: "",
//         address: "",
//         eventType: "conference",
//         paymentMethod: "", // Default to empty string for selection
//         status: "Pending",
//         additionalNotes: "",
//         discount: 0,
//         totalAmount: 0,
//       });
//       setOrderItemsList([]);
//     }
//   }, [editMode, initialData]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "organizationName":
//         if (!value) error.organizationName = "Organization name is required";
//         break;
//       case "contactPhone":
//         if (!value) error.contactPhone = "Contact phone is required";
//         break;
//       case "seminarDate":
//         if (!value) error.seminarDate = "Seminar date is required";
//         break;
//       case "address":
//         if (!value) error.address = "Address is required";
//         break;
//       case "orderItemsList":
//         if (orderItemsList.length === 0)
//           error.orderItemsList = "At least one item is required";
//         break;
//       case "paymentMethod":
//         if (!value) error.paymentMethod = "Payment method is required";
//         break;
//       case "discount":
//         if (!value || value < 0 || value > 100) {
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
//   };

//   const addItem = () => {
//     setOrderItemsList([
//       ...orderItemsList,
//       { itemName: "", qty: 1, unitPrice: 0, price: 0 },
//     ]);
//     calculateTotalAmount([...orderItemsList, { price: 0 }]); // Add new item with 0 price
//   };

//   const removeItem = (index) => {
//     const newItems = [...orderItemsList];
//     newItems.splice(index, 1);
//     setOrderItemsList(newItems);
//     calculateTotalAmount(newItems);
//   };

//   const handleItemChange = (index, field) => (event) => {
//     const newItems = [...orderItemsList];
//     newItems[index][field] = event.target.value;
//     if (field === "itemName") {
//       const selectedItem = orderItems.find(
//         (item) => item.itemName === event.target.value
//       );
//       if (selectedItem) {
//         newItems[index].unitPrice = selectedItem.unitPrice;
//         newItems[index].price = selectedItem.unitPrice * newItems[index].qty;
//       }
//     } else if (field === "qty") {
//       newItems[index].price =
//         newItems[index].unitPrice * parseFloat(event.target.value) || 0;
//     } else if (field === "unitPrice") {
//       newItems[index].price =
//         parseFloat(event.target.value) * newItems[index].qty || 0;
//     }
//     setOrderItemsList(newItems);
//     calculateTotalAmount(newItems); // Recalculate total amount
//   };

//   const calculateTotalAmount = (items = orderItemsList) => {
//     const subTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
//     const discountAmount = subTotal * (formData.discount / 100) || 0;
//     const total = subTotal - discountAmount;
//     setFormData((prev) => ({ ...prev, totalAmount: total }));
//   };

//   const handleSave = () => {
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );
//     validateField("orderItemsList", orderItemsList);

//     if (Object.values(errors).some((error) => error)) {
//       return;
//     }

//     const validatedItems = orderItemsList.map((item) => ({
//       itemName: item.itemName,
//       qty: Number(item.qty) || 1,
//       unitPrice: Number(item.unitPrice),
//     }));

//     // Exclude fields that should not be sent to the server
//     const { createdAt, updatedAt, __v, ...seminarData } = formData;
//     seminarData.orderItems = validatedItems;

//     // Send discount with other data
//     if (editMode) {
//       dispatch(updateSeminar({ id: initialData._id, seminarData }))
//         .then(() => {
//           toast.success("Seminar record updated successfully!", {
//             duration: 5000,
//           });
//           onClose();
//           onSaveSuccess && onSaveSuccess();
//         })
//         .catch((error) => {
//           toast.error(`Error updating seminar record: ${error.message}`, {
//             duration: 5000,
//           });
//         });
//     } else {
//       dispatch(createSeminar(seminarData))
//         .then(() => {
//           toast.success("Seminar record added successfully!", {
//             duration: 5000,
//           });
//           onClose();
//           onSaveSuccess && onSaveSuccess();
//         })
//         .catch((error) => {
//           toast.error(`Error adding seminar record: ${error.message}`, {
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
//             <h2>
//               {editMode ? "Edit Seminar Record" : "Add New Seminar Record"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Organization Name"
//             fullWidth
//             margin="normal"
//             value={formData.organizationName}
//             onChange={handleChange("organizationName")}
//             error={!!errors.organizationName}
//             helperText={errors.organizationName}
//           />
//           <TextField
//             label="Contact Phone"
//             fullWidth
//             margin="normal"
//             value={formData.contactPhone}
//             onChange={handleChange("contactPhone")}
//             error={!!errors.contactPhone}
//             helperText={errors.contactPhone}
//           />
//           <TextField
//             label="Seminar Date"
//             type="datetime-local"
//             fullWidth
//             margin="normal"
//             value={formData.seminarDate}
//             onChange={handleChange("seminarDate")}
//             error={!!errors.seminarDate}
//             helperText={errors.seminarDate}
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//           <TextField
//             label="Address"
//             fullWidth
//             margin="normal"
//             value={formData.address}
//             onChange={handleChange("address")}
//             error={!!errors.address}
//             helperText={errors.address}
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="event-type-label">Event Type</InputLabel>
//             <Select
//               labelId="event-type-label"
//               value={formData.eventType}
//               onChange={handleChange("eventType")}
//               label="Event Type"
//             >
//               <MenuItem value="conference">Conference</MenuItem>
//               <MenuItem value="workshop">Workshop</MenuItem>
//               <MenuItem value="webinar">Webinar</MenuItem>
//               <MenuItem value="Wedding">Wedding</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel id="payment-method-label">Payment Method</InputLabel>
//             <Select
//               labelId="payment-method-label"
//               value={formData.paymentMethod}
//               onChange={handleChange("paymentMethod")}
//               label="Payment Method"
//               error={!!errors.paymentMethod}
//               required // Add this to enforce selection
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
//               inputProps: { min: 0, max: 100, step: 0.01 },
//             }}
//           />
//           <TextField
//             label="Total Amount"
//             fullWidth
//             margin="normal"
//             value={formData.totalAmount.toFixed(2)} // Format to 2 decimal places
//             InputProps={{
//               readOnly: true, // Making it read-only since it's calculated from order items
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
//                         type="number"
//                         value={row.unitPrice}
//                         InputProps={{
//                           readOnly: true, // Make this field read-only
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
//           <Button startIcon={<AddIcon />} onClick={addItem} sx={{ mb: 2 }}>
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
//               disabled={isLoadingItems || paymentMethodsStatus === "loading"}
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

// export default AddNewSeminarDrawer;

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
  createSeminar,
  fetchSeminars,
  updateSeminar,
} from "../../redux/slices/seminarSlice";
import { fetchOrderItems } from "../../redux/slices/orderItemSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import { Toaster, toast } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0",
    boxSizing: "border-box",
  },
}));

const AddNewSeminarDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { items: orderItems, isLoading: isLoadingItems } = useSelector(
    (state) => state.orderItems
  );
  const { paymentMethods, status: paymentMethodsStatus } = useSelector(
    (state) => state.paymentMethods
  );

  useEffect(() => {
    if (paymentMethodsStatus === "idle") {
      dispatch(fetchPaymentMethods());
    }
    if (!orderItems || orderItems.length === 0) {
      dispatch(fetchOrderItems()); // Fetch items for the dropdown
    }
  }, [dispatch, paymentMethodsStatus, orderItems]);

  // useEffect(() => {
  //   if (!orderItems || orderItems.length === 0) {
  //     dispatch(fetchOrderItems());
  //   }
  // }, [dispatch, orderItems]);

  // useEffect(() => {
  //   if (paymentMethodsStatus === "idle") {
  //     dispatch(fetchPaymentMethods());
  //   }
  // }, [dispatch, paymentMethodsStatus]);

  // State for form data
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPhone: "",
    seminarDate: "",
    address: "",
    eventType: "conference",
    paymentMethod: "",
    status: "Pending",
    additionalNotes: "",
    discount: 0,
    totalAmount: 0, // Added totalAmount to formData
  });

  // State for order items table
  const [orderItemsList, setOrderItemsList] = useState([]);

  useEffect(() => {
    if (editMode) {
      // Explicitly exclude _id, salesBy, and isVoided from formData
      const { _id, paymentMethod, salesBy, isVoided, ...restOfInitialData } =
        initialData;
      setFormData({
        ...restOfInitialData,
        seminarDate: initialData.seminarDate
          ? new Date(initialData.seminarDate).toISOString().slice(0, 16)
          : "",
        totalAmount: initialData.totalAmount || 0,
        discount: initialData.discount || 0,
        paymentMethod: paymentMethod ? paymentMethod._id : "", // Set payment method ID
        orderItems: initialData.orderItems || [],
        isVoided: isVoided || false,
      });
      setOrderItemsList(
        (initialData.orderItems || []).map(({ itemName, qty, unitPrice }) => ({
          itemName,
          qty: qty || 1,
          unitPrice: unitPrice || 0,
          price: (qty || 1) * (unitPrice || 0),
        }))
      );
    } else {
      setFormData({
        organizationName: "",
        contactPhone: "",
        seminarDate: "",
        address: "",
        eventType: "conference",
        paymentMethod: "", // Default to empty string for selection
        status: "Pending",
        additionalNotes: "",
        discount: 0,
        totalAmount: 0,
        isVoided: false,
      });
      setOrderItemsList([]);
    }
  }, [editMode, initialData]);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "organizationName":
        if (!value) error.organizationName = "Organization name is required";
        break;
      case "contactPhone":
        if (!value) error.contactPhone = "Contact phone is required";
        break;
      case "seminarDate":
        if (!value) error.seminarDate = "Seminar date is required";
        break;
      case "address":
        if (!value) error.address = "Address is required";
        break;
      case "orderItemsList":
        if (orderItemsList.length === 0)
          error.orderItemsList = "At least one item is required";
        break;
      case "paymentMethod":
        if (!value) error.paymentMethod = "Payment method is required";
        break;
      case "discount":
        if (!value || value < 0 || value > 100) {
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
  };

  const addItem = () => {
    setOrderItemsList([
      ...orderItemsList,
      { itemName: "", qty: 1, unitPrice: 0, price: 0 },
    ]);
    calculateTotalAmount([...orderItemsList, { price: 0 }]); // Add new item with 0 price
  };

  const removeItem = (index) => {
    const newItems = [...orderItemsList];
    newItems.splice(index, 1);
    setOrderItemsList(newItems);
    calculateTotalAmount(newItems);
  };

  const handleItemChange = (index, field) => (event) => {
    const newItems = [...orderItemsList];
    newItems[index][field] = event.target.value;
    if (field === "itemName") {
      const selectedItem = orderItems.find(
        (item) => item.itemName === event.target.value
      );
      if (selectedItem) {
        newItems[index].unitPrice = selectedItem.unitPrice;
        newItems[index].price = selectedItem.unitPrice * newItems[index].qty;
      }
    } else if (field === "qty") {
      newItems[index].price =
        newItems[index].unitPrice * parseFloat(event.target.value) || 0;
    } else if (field === "unitPrice") {
      newItems[index].price =
        parseFloat(event.target.value) * newItems[index].qty || 0;
    }
    setOrderItemsList(newItems);
    calculateTotalAmount(newItems); // Recalculate total amount
  };

  const calculateTotalAmount = (items = orderItemsList) => {
    const subTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const discountAmount = subTotal * (formData.discount / 100) || 0;
    const total = subTotal - discountAmount;
    setFormData((prev) => ({ ...prev, totalAmount: total }));
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );
    validateField("orderItemsList", orderItemsList);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    const validatedItems = orderItemsList.map((item) => ({
      itemName: item.itemName,
      qty: Number(item.qty) || 1,
      unitPrice: Number(item.unitPrice),
    }));

    // Exclude fields that should not be sent to the server
    const { createdAt, updatedAt, __v, salesBy, isVoided, ...seminarData } =
      formData;
    seminarData.orderItems = validatedItems;

    // Send discount with other data
    if (editMode) {
      dispatch(updateSeminar({ id: initialData._id, seminarData }))
        .then(() => {
          toast.success("Seminar record updated successfully!", {
            duration: 5000,
          });
          dispatch(fetchSeminars()).then(() => onClose());
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(`Error updating seminar record: ${error.message}`, {
            duration: 5000,
          });
        });
    } else {
      dispatch(createSeminar(seminarData))
        .then(() => {
          toast.success("Seminar record added successfully!", {
            duration: 5000,
          });
          dispatch(fetchSeminars()).then(() => onClose());
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(`Error adding seminar record: ${error.message}`, {
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

  const isDisabled = formData.isVoided;

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
            <h2>
              {editMode ? "Edit Seminar Record" : "Add New Seminar Record"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Organization Name"
            fullWidth
            margin="normal"
            value={formData.organizationName}
            onChange={handleChange("organizationName")}
            error={!!errors.organizationName}
            helperText={errors.organizationName}
            disabled={isDisabled}
          />
          <TextField
            label="Contact Phone"
            fullWidth
            margin="normal"
            value={formData.contactPhone}
            onChange={handleChange("contactPhone")}
            error={!!errors.contactPhone}
            helperText={errors.contactPhone}
            disabled={isDisabled}
          />
          <TextField
            label="Seminar Date"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.seminarDate}
            onChange={handleChange("seminarDate")}
            error={!!errors.seminarDate}
            helperText={errors.seminarDate}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={isDisabled}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange("address")}
            error={!!errors.address}
            helperText={errors.address}
            disabled={isDisabled}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="event-type-label">Event Type</InputLabel>
            <Select
              labelId="event-type-label"
              value={formData.eventType}
              onChange={handleChange("eventType")}
              label="Event Type"
              disabled={isDisabled}
            >
              <MenuItem value="conference">Conference</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
              <MenuItem value="webinar">Webinar</MenuItem>
              <MenuItem value="Wedding">Wedding</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={formData.paymentMethod}
              onChange={handleChange("paymentMethod")}
              label="Payment Method"
              error={!!errors.paymentMethod}
              required // Add this to enforce selection
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
              inputProps: { min: 0, max: 100, step: 0.01 },
            }}
            disabled={isDisabled}
          />
          <TextField
            label="Total Amount"
            fullWidth
            margin="normal"
            value={formData.totalAmount.toFixed(2)} // Format to 2 decimal places
            InputProps={{
              readOnly: true, // Making it read-only since it's calculated from order items
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
                        type="number"
                        value={row.unitPrice}
                        InputProps={{
                          readOnly: true, // Make this field read-only
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">{row.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => removeItem(index)}
                        disabled={editMode || isDisabled}
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

export default AddNewSeminarDrawer;
