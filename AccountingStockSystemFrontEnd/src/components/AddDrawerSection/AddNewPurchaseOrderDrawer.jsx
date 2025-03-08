// // import React, { useState, useEffect } from "react";
// // import {
// //   Button,
// //   Drawer,
// //   Box,
// //   TextField,
// //   IconButton,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   CircularProgress,
// //   FormHelperText,
// // } from "@mui/material";
// // import { styled } from "@mui/material/styles";
// // import CloseIcon from "@mui/icons-material/Close";
// // import { useDispatch, useSelector } from "react-redux";
// // import { format } from "date-fns";

// import { styled } from "@mui/material";

// // import { toast } from "react-hot-toast";
// // import { fetchInventories } from "../../redux/slices/inventoriesSlice";
// // import { fetchSuppliers } from "../../redux/slices/suppliersSlice";
// // import {
// //   updatePurchaseOrder,
// //   fetchPurchaseOrders,
// // } from "../../redux/slices/purchaseOrderSlice";

// // const StyledDrawer = styled(Drawer)(({ theme }) => ({
// //   "& .MuiDrawer-paper": {
// //     width: "30%", // Keep consistent width
// //     boxSizing: "border-box", // Important for consistent sizing
// //   },
// // }));

// // const AddNewPurchaseOrderDrawer = ({
// //   open,
// //   onClose,
// //   editMode = false,
// //   initialData = {},
// //   onSaveSuccess, // Use onSaveSuccess consistently
// // }) => {
// //   const dispatch = useDispatch();
// //   const { isLoading, error } = useSelector((state) => state.purchaseOrders);
// //   const { inventories } = useSelector((state) => state.inventories);
// //   const { suppliers } = useSelector((state) => state.suppliers);

// //   const [formData, setFormData] = useState({
// //     supplier: "",
// //     orderDate: new Date(),
// //     expectedDelivery: new Date(),
// //     items: [{ inventory: "", quantityOrdered: 1, unitPrice: 0 }],
// //     status: "Pending",
// //   });

// //   const [errors, setErrors] = useState({}); // Use for form validation errors

// //   // Fetch inventories and suppliers on component mount (like your other components)
// //   useEffect(() => {
// //     dispatch(fetchInventories());
// //     dispatch(fetchSuppliers());
// //   }, [dispatch]);

// //   // Update form data when in edit mode or when the drawer opens
// //   useEffect(() => {
// //     if (editMode && initialData) {
// //       setFormData({
// //         supplier: initialData.supplier?._id || "", // Use _id for select
// //         orderDate: initialData.orderDate
// //           ? new Date(initialData.orderDate)
// //           : new Date(),
// //         expectedDelivery: initialData.expectedDelivery
// //           ? new Date(initialData.expectedDelivery)
// //           : new Date(),
// //         items: initialData.items.map((item) => ({
// //           inventory: item.inventory?._id || "", // Use _id for select
// //           quantityOrdered: item.quantityOrdered || 1,
// //           unitPrice: item.unitPrice || 0,
// //         })),
// //         status: initialData.status || "Pending",
// //       });
// //     } else {
// //       // Reset form for new purchase order
// //       setFormData({
// //         supplier: "",
// //         orderDate: new Date(),
// //         expectedDelivery: new Date(),
// //         items: [{ inventory: "", quantityOrdered: 1, unitPrice: 0 }],
// //         status: "Pending",
// //       });
// //     }
// //     setErrors({}); // Clear errors
// //   }, [editMode, initialData, open]); // Dependency on 'open' is important

// //   const validateField = (name, value) => {
// //     let error = {};

// //     // Validation logic (add more as needed)
// //     switch (name) {
// //       case "supplier":
// //         if (!value) error.supplier = "Supplier is required";
// //         break;
// //       case "orderDate":
// //         if (!value) error.orderDate = "Order Date is required";
// //         break;
// //       case "items":
// //         value.forEach((item, index) => {
// //           if (!item.inventory) {
// //             error[`items.${index}.inventory`] = "Inventory is required";
// //           }
// //         });
// //         break;
// //     }
// //     setErrors((prevErrors) => ({
// //       ...prevErrors,
// //       ...error,
// //     }));
// //     return Object.keys(error).length === 0; // Return true if no error
// //   };

// //   const handleChange = (field) => (event) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: event.target.value,
// //     }));
// //     validateField(field, event.target.value);
// //   };

// //   const handleDateChange = (field, date) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: date,
// //     }));
// //   };

// //   const handleItemChange = (index, field) => (event) => {
// //     const newItems = [...formData.items];
// //     newItems[index][field] = event.target.value;
// //     setFormData((prev) => ({
// //       ...prev,
// //       items: newItems,
// //     }));
// //     validateField("items", newItems);
// //   };

// //   const addItem = () => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       items: [
// //         ...prev.items,
// //         { inventory: "", quantityOrdered: 1, unitPrice: 0 },
// //       ],
// //     }));
// //   };

// //   const removeItem = (index) => {
// //     const newItems = [...formData.items];
// //     newItems.splice(index, 1);
// //     setFormData((prev) => ({ ...prev, items: newItems }));
// //   };

// //   const handleSave = async () => {
// //     // 1. Validation
// //     const fieldsToValidate = ["supplier", "orderDate", "items"];
// //     let isValid = true;
// //     for (const field of fieldsToValidate) {
// //       if (field === "items") {
// //         if (!validateField(field, formData[field])) {
// //           isValid = false;
// //         }
// //       } else {
// //         if (!validateField(field, formData[field])) {
// //           isValid = false;
// //         }
// //       }
// //     }
// //     if (!isValid) return;

// //     // 2. Prepare Data for API
// //     const purchaseOrderData = {
// //       supplier: formData.supplier,
// //       orderDate: formData.orderDate.toISOString(), // Convert to ISO string
// //       expectedDelivery: formData.expectedDelivery.toISOString(), // Convert to ISO string
// //       items: formData.items.map((item) => ({
// //         inventory: item.inventory,
// //         quantityOrdered: Number(item.quantityOrdered), // Ensure numbers
// //         unitPrice: Number(item.unitPrice), // Ensure numbers
// //       })),
// //       status: formData.status,
// //     };

// //     // 3. API Call (Create or Update)
// //     try {
// //       if (editMode) {
// //         await dispatch(
// //           updatePurchaseOrder({ id: initialData._id, purchaseOrderData })
// //         ).unwrap(); // Use unwrap for error handling
// //         toast.success("Purchase order updated successfully!");
// //       } else {
// //         toast.error("Creating new purchase orders is not implemented yet."); // Placeholder
// //         return; // Important: Prevent the drawer from closing if not implemented
// //         //await dispatch(createPurchaseOrder(purchaseOrderData)).unwrap();
// //         //toast.success("Purchase order created successfully!");
// //       }
// //       onClose(); // Close the drawer
// //       onSaveSuccess && onSaveSuccess(); // Refresh the list
// //     } catch (error) {
// //       toast.error(
// //         `Error ${editMode ? "updating" : "creating"} purchase order: ${
// //           error.message
// //         }`
// //       );
// //     }
// //   };

// //   const handleCancel = () => {
// //     onClose();
// //     setErrors({}); // Clear errors on close
// //   };

// //   return (
// //     <StyledDrawer anchor="right" open={open} onClose={handleCancel}>
// //       <Box sx={{ p: 2, width: "100%", overflow: "auto" }}>
// //         <Box
// //           sx={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             mb: 2,
// //           }}
// //         >
// //           <h2>{editMode ? "Edit Purchase Order" : "Add New Purchase Order"}</h2>
// //           <IconButton onClick={handleCancel}>
// //             <CloseIcon />
// //           </IconButton>
// //         </Box>

// //         <FormControl fullWidth margin="normal" error={!!errors.supplier}>
// //           <InputLabel id="supplier-label">Supplier</InputLabel>
// //           <Select
// //             labelId="supplier-label"
// //             value={formData.supplier}
// //             onChange={handleChange("supplier")}
// //             label="Supplier"
// //             required // Indicate required field
// //           >
// //             {suppliers.map((supplier) => (
// //               <MenuItem key={supplier._id} value={supplier._id}>
// //                 {supplier.contactPerson}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //           {errors.supplier && (
// //             <FormHelperText>{errors.supplier}</FormHelperText>
// //           )}
// //         </FormControl>

// //         <TextField
// //           label="Order Date"
// //           type="datetime-local"
// //           fullWidth
// //           margin="normal"
// //           value={formData.orderDate.toISOString().slice(0, 16)}
// //           onChange={(e) =>
// //             handleDateChange("orderDate", new Date(e.target.value))
// //           }
// //           InputLabelProps={{
// //             shrink: true,
// //           }}
// //           required
// //         />

// //         <TextField
// //           label="Expected Delivery"
// //           type="datetime-local"
// //           fullWidth
// //           margin="normal"
// //           value={formData.expectedDelivery.toISOString().slice(0, 16)}
// //           onChange={(e) =>
// //             handleDateChange("expectedDelivery", new Date(e.target.value))
// //           }
// //           InputLabelProps={{
// //             shrink: true,
// //           }}
// //         />

// //         {/* Items */}
// //         {formData.items.map((item, index) => (
// //           <Box key={index} sx={{ border: "1px solid grey", p: 1, mb: 1 }}>
// //             <FormControl
// //               fullWidth
// //               margin="normal"
// //               error={!!errors[`items.${index}.inventory`]}
// //             >
// //               <InputLabel id={`inventory-label-${index}`}>Inventory</InputLabel>
// //               <Select
// //                 labelId={`inventory-label-${index}`}
// //                 value={item.inventory}
// //                 onChange={handleItemChange(index, "inventory")}
// //                 label="Inventory"
// //                 required // Indicate required field
// //               >
// //                 {inventories.map((inv) => (
// //                   <MenuItem key={inv._id} value={inv._id}>
// //                     {inv.name}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //               {errors[`items.${index}.inventory`] && (
// //                 <FormHelperText>
// //                   {errors[`items.${index}.inventory`]}
// //                 </FormHelperText>
// //               )}
// //             </FormControl>

// //             <TextField
// //               label="Quantity Ordered"
// //               type="number"
// //               fullWidth
// //               margin="normal"
// //               value={item.quantityOrdered}
// //               onChange={handleItemChange(index, "quantityOrdered")}
// //               inputProps={{ min: 1 }} // Enforce minimum quantity
// //               required // Indicate required field
// //             />

// //             <TextField
// //               label="Unit Price"
// //               type="number"
// //               fullWidth
// //               margin="normal"
// //               value={item.unitPrice}
// //               onChange={handleItemChange(index, "unitPrice")}
// //               inputProps={{ min: 0 }} // Enforce minimum price
// //               required // Indicate required field
// //             />

// //             <Button
// //               variant="outlined"
// //               color="error"
// //               onClick={() => removeItem(index)}
// //             >
// //               Remove Item
// //             </Button>
// //           </Box>
// //         ))}

// //         <Button variant="outlined" onClick={addItem} sx={{ mb: 2 }}>
// //           Add Item
// //         </Button>

// //         <FormControl fullWidth margin="normal">
// //           <InputLabel id="status-label">Status</InputLabel>
// //           <Select
// //             labelId="status-label"
// //             value={formData.status}
// //             onChange={handleChange("status")}
// //             label="Status"
// //           >
// //             <MenuItem value="Pending">Pending</MenuItem>
// //             <MenuItem value="Completed">Completed</MenuItem>
// //             <MenuItem value="Voided">Voided</MenuItem> {/* Add Voided option */}
// //           </Select>
// //         </FormControl>

// //         <Box
// //           sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
// //         >
// //           <Button variant="outlined" onClick={handleCancel}>
// //             Cancel
// //           </Button>
// //           <Button
// //             variant="contained"
// //             onClick={handleSave}
// //             disabled={isLoading} // Disable the button while loading
// //             sx={{
// //               backgroundColor: "green",
// //               color: "white",
// //               "&:hover": { backgroundColor: "darkgreen" },
// //             }}
// //           >
// //             {isLoading ? (
// //               <CircularProgress size={24} color="inherit" />
// //             ) : (
// //               "Save"
// //             )}
// //           </Button>
// //         </Box>
// //       </Box>
// //     </StyledDrawer>
// //   );
// // };

// // export default AddNewPurchaseOrderDrawer;

// // import React, { useState, useEffect } from "react";
// // import {
// //   Button,
// //   Drawer,
// //   Box,
// //   TextField,
// //   IconButton,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   CircularProgress,
// //   FormHelperText,
// // } from "@mui/material";
// // import { styled } from "@mui/material/styles";
// // import CloseIcon from "@mui/icons-material/Close";
// // import AddIcon from "@mui/icons-material/Add"; // Import AddIcon
// // import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon
// // import { useDispatch, useSelector } from "react-redux";

// // import { toast } from "react-hot-toast";
// // import { format } from "date-fns";
// // import { fetchInventories } from "../../redux/slices/inventoriesSlice";
// // import { fetchSuppliers } from "../../redux/slices/suppliersSlice";
// // import { updatePurchaseOrder } from "../../redux/slices/purchaseOrderSlice";

// // const StyledDrawer = styled(Drawer)(({ theme }) => ({
// //   "& .MuiDrawer-paper": {
// //     width: "30%",
// //     height: "100vh",
// //     top: "0px",
// //     bottom: "50px",
// //     boxSizing: "border-box",
// //   },
// // }));

// // const AddNewPurchaseOrderDrawer = ({
// //   open,
// //   onClose,
// //   editMode = false,
// //   initialData = {},
// //   onSaveSuccess,
// // }) => {
// //   const dispatch = useDispatch();
// //   const { isLoading, error } = useSelector((state) => state.purchaseOrders);
// //   const { inventories } = useSelector((state) => state.inventories); // Get inventories
// //   const { suppliers } = useSelector((state) => state.suppliers); // Get suppliers
// //   const [errors, setErrors] = useState({});

// //   const [formData, setFormData] = useState({
// //     supplier: "",
// //     orderDate: new Date(),
// //     expectedDelivery: new Date(),
// //     items: [{ inventory: "", quantityOrdered: 1, unitPrice: 0 }],
// //     status: "Pending",
// //   });

// //   const validateField = (name, value) => {
// //     let error = {};
// //     switch (name) {
// //       case "supplier":
// //         if (!value) error.supplier = "Supplier is required";
// //         break;
// //       case "orderDate":
// //         if (!value) error.orderDate = "Order Date is required";
// //         break;
// //       case "items":
// //         value.forEach((item, index) => {
// //           if (!item.inventory) {
// //             error[`items.${index}.inventory`] = "Inventory is required";
// //           }
// //         });
// //         break;
// //       default:
// //         break;
// //     }
// //     setErrors((prevErrors) => ({
// //       ...prevErrors,
// //       ...error,
// //     }));
// //     return Object.keys(error).length === 0;
// //   };

// //   // Fetch inventories and suppliers on component mount
// //   useEffect(() => {
// //     dispatch(fetchInventories());
// //     dispatch(fetchSuppliers());
// //   }, [dispatch]);

// //   useEffect(() => {
// //     if (editMode && initialData) {
// //       // Populate form with data for editing
// //       setFormData({
// //         supplier: initialData.supplier?._id || "", // Use _id
// //         orderDate: initialData.orderDate
// //           ? new Date(initialData.orderDate)
// //           : new Date(),
// //         expectedDelivery: initialData.expectedDelivery
// //           ? new Date(initialData.expectedDelivery)
// //           : new Date(),
// //         items: initialData.items.map((item) => ({
// //           inventory: item.inventory?._id || "", // Use _id
// //           quantityOrdered: item.quantityOrdered || 1,
// //           unitPrice: item.unitPrice || 0,
// //         })),
// //         status: initialData.status || "Pending",
// //       });
// //     } else {
// //       // Reset form for new purchase order
// //       setFormData({
// //         supplier: "",
// //         orderDate: new Date(),
// //         expectedDelivery: new Date(),
// //         items: [{ inventory: "", quantityOrdered: 1, unitPrice: 0 }],
// //         status: "Pending",
// //       });
// //     }
// //     setErrors({});
// //   }, [editMode, initialData, open]);

// //   const handleChange = (field) => (event) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: event.target.value,
// //     }));
// //     validateField(field, event.target.value);
// //   };

// //   const handleDateChange = (field, date) => {
// //     setFormData((prev) => ({ ...prev, [field]: date }));
// //   };

// //   const handleItemChange = (index, field) => (event) => {
// //     const newItems = [...formData.items];
// //     newItems[index][field] = event.target.value;
// //     setFormData((prev) => ({
// //       ...prev,
// //       items: newItems,
// //     }));
// //   };

// //   const addItem = () => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       items: [
// //         ...prev.items,
// //         { inventory: "", quantityOrdered: 1, unitPrice: 0 },
// //       ],
// //     }));
// //   };

// //   const removeItem = (index) => {
// //     const newItems = [...formData.items];
// //     newItems.splice(index, 1);
// //     setFormData((prev) => ({ ...prev, items: newItems }));
// //   };

// //   const handleSave = async () => {
// //     // Validate required fields
// //     const fieldsToValidate = ["supplier", "orderDate", "items"];
// //     let isValid = true;
// //     for (const field of fieldsToValidate) {
// //       if (field === "items") {
// //         if (!validateField(field, formData[field])) {
// //           isValid = false;
// //         }
// //       } else {
// //         if (!validateField(field, formData[field])) {
// //           isValid = false;
// //         }
// //       }
// //     }
// //     if (!isValid) return;

// //     const purchaseOrderData = {
// //       supplier: formData.supplier,
// //       orderDate: formData.orderDate.toISOString(),
// //       expectedDelivery: formData.expectedDelivery.toISOString(),
// //       items: formData.items.map((item) => ({
// //         inventory: item.inventory,
// //         quantityOrdered: Number(item.quantityOrdered),
// //         unitPrice: Number(item.unitPrice),
// //       })),
// //       status: formData.status,
// //     };
// //     try {
// //       if (editMode) {
// //         await dispatch(
// //           updatePurchaseOrder({ id: initialData._id, purchaseOrderData })
// //         ).unwrap();
// //         toast.success("Purchase order updated successfully!");
// //       } else {
// //         toast.error("Creating new purchase orders not supported yet.");
// //         return;
// //         // await dispatch(createPurchaseOrder(purchaseOrderData)).unwrap(); // You don't have createPurchaseOrder
// //         // toast.success("Purchase order created successfully!");
// //       }
// //       onClose();
// //       onSaveSuccess && onSaveSuccess();
// //     } catch (error) {
// //       toast.error(
// //         `Error ${editMode ? "updating" : "creating"} purchase order: ${
// //           error.message || "Unknown error"
// //         }`
// //       );
// //     }
// //   };

// //   const handleCancel = () => {
// //     onClose();
// //     setErrors({}); // Clear errors
// //   };

// //   return (
// //     <StyledDrawer anchor="right" open={open} onClose={handleCancel}>
// //       <Box sx={{ p: 2, width: "100%", overflow: "auto" }}>
// //         <Box
// //           sx={{
// //             display: "flex",
// //             justifyContent: "space-between",
// //             alignItems: "center",
// //             mb: 2,
// //           }}
// //         >
// //           <h2>{editMode ? "Edit Purchase Order" : "Add New Purchase Order"}</h2>
// //           <IconButton onClick={handleCancel}>
// //             <CloseIcon />
// //           </IconButton>
// //         </Box>

// //         <FormControl fullWidth margin="normal" error={!!errors.supplier}>
// //           <InputLabel id="supplier-label">Supplier</InputLabel>
// //           <Select
// //             labelId="supplier-label"
// //             value={formData.supplier}
// //             onChange={handleChange("supplier")}
// //             label="Supplier"
// //             required
// //           >
// //             {suppliers.map((supplier) => (
// //               <MenuItem key={supplier._id} value={supplier._id}>
// //                 {supplier.contactPerson}
// //               </MenuItem>
// //             ))}
// //           </Select>
// //           {errors.supplier && (
// //             <FormHelperText>{errors.supplier}</FormHelperText>
// //           )}
// //         </FormControl>

// //         <TextField
// //           label="Order Date"
// //           type="datetime-local"
// //           fullWidth
// //           margin="normal"
// //           value={formData.orderDate.toISOString().slice(0, 16)}
// //           onChange={(e) =>
// //             handleDateChange("orderDate", new Date(e.target.value))
// //           }
// //           InputLabelProps={{
// //             shrink: true,
// //           }}
// //           required
// //         />

// //         <TextField
// //           label="Expected Delivery"
// //           type="datetime-local"
// //           fullWidth
// //           margin="normal"
// //           value={formData.expectedDelivery.toISOString().slice(0, 16)}
// //           onChange={(e) =>
// //             handleDateChange("expectedDelivery", new Date(e.target.value))
// //           }
// //           InputLabelProps={{
// //             shrink: true,
// //           }}
// //         />

// //         {formData.items.map((item, index) => (
// //           <Box key={index} sx={{ border: "1px solid grey", p: 1, mb: 1 }}>
// //             <FormControl
// //               fullWidth
// //               margin="normal"
// //               error={!!errors[`items.${index}.inventory`]}
// //             >
// //               <InputLabel id={`inventory-label-${index}`}>Inventory</InputLabel>
// //               <Select
// //                 labelId={`inventory-label-${index}`}
// //                 value={item.inventory}
// //                 onChange={handleItemChange(index, "inventory")}
// //                 label="Inventory"
// //                 required
// //               >
// //                 {inventories.map((inv) => (
// //                   <MenuItem key={inv._id} value={inv._id}>
// //                     {inv.name}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //               {errors[`items.${index}.inventory`] && (
// //                 <FormHelperText>
// //                   {errors[`items.${index}.inventory`]}
// //                 </FormHelperText>
// //               )}
// //             </FormControl>

// //             <TextField
// //               label="Quantity Ordered"
// //               type="number"
// //               fullWidth
// //               margin="normal"
// //               value={item.quantityOrdered}
// //               onChange={handleItemChange(index, "quantityOrdered")}
// //               inputProps={{ min: 1 }}
// //               required
// //             />

// //             <TextField
// //               label="Unit Price"
// //               type="number"
// //               fullWidth
// //               margin="normal"
// //               value={item.unitPrice}
// //               onChange={handleItemChange(index, "unitPrice")}
// //               inputProps={{ min: 0 }}
// //               required
// //             />
// //             <Button
// //               variant="outlined"
// //               color="error"
// //               onClick={() => removeItem(index)}
// //             >
// //               Remove Item
// //             </Button>
// //           </Box>
// //         ))}
// //         <Button variant="outlined" onClick={addItem} sx={{ mb: 2 }}>
// //           Add Item
// //         </Button>
// //         <FormControl fullWidth margin="normal">
// //           <InputLabel id="status-label">Status</InputLabel>
// //           <Select
// //             labelId="status-label"
// //             value={formData.status}
// //             onChange={handleChange("status")}
// //             label="Status"
// //           >
// //             <MenuItem value="Pending">Pending</MenuItem>
// //             <MenuItem value="Completed">Completed</MenuItem>
// //             <MenuItem value="Voided">Voided</MenuItem>
// //           </Select>
// //         </FormControl>

// //         <Box
// //           sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
// //         >
// //           <Button variant="outlined" onClick={handleCancel}>
// //             Cancel
// //           </Button>
// //           <Button
// //             variant="contained"
// //             onClick={handleSave}
// //             disabled={isLoading}
// //             sx={{
// //               backgroundColor: "green",
// //               color: "white",
// //               "&:hover": { backgroundColor: "darkgreen" },
// //             }}
// //           >
// //             {isLoading ? (
// //               <CircularProgress size={24} color="inherit" />
// //             ) : (
// //               "Save"
// //             )}
// //           </Button>
// //         </Box>
// //       </Box>
// //     </StyledDrawer>
// //   );
// // };

// // export default AddNewPurchaseOrderDrawer;

// // import React, { useState, useEffect } from "react";
// // import {
// //   Button,
// //   Drawer,
// //   Box,
// //   TextField,
// //   IconButton,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   CircularProgress,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// // } from "@mui/material";
// // import AddIcon from "@mui/icons-material/Add";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import { styled } from "@mui/material/styles";
// // import CloseIcon from "@mui/icons-material/Close";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   updatePurchaseOrder,
// //   fetchPurchaseOrders,
// // } from "../../redux/slices/purchaseOrderSlice";
// // import { fetchInventories } from "../../redux/slices/inventoriesSlice";
// // import { fetchSuppliers } from "../../redux/slices/suppliersSlice"; // Assuming an inventory slice exists
// // import { Toaster, toast } from "react-hot-toast";

// // const StyledDrawer = styled(Drawer)(({ theme }) => ({
// //   "& .MuiDrawer-paper": {
// //     width: "30%",
// //     height: "100vh",
// //     top: "0",
// //     boxSizing: "border-box",
// //   },
// // }));

// // const AddNewPurchaseOrderDrawer = ({
// //   open,
// //   onClose,
// //   editMode = false,
// //   initialData = {},
// //   onSaveSuccess,
// // }) => {
// //   const dispatch = useDispatch();
// //   const { suppliers = [], status: suppliersStatus } = useSelector(
// //     (state) => state.suppliers || {}
// //   );
// //   const { inventories = [], status: inventoriesStatus } = useSelector(
// //     (state) => state.inventories || {}
// //   );

// //   // Form State
// //   const [formData, setFormData] = useState({
// //     supplier: "",
// //     orderDate: "",
// //     expectedDelivery: "",
// //     status: "Pending",
// //   });
// //   const [items, setItems] = useState([]);
// //   const [errors, setErrors] = useState({});

// //   // Fetch necessary data
// //   useEffect(() => {
// //     if (suppliersStatus === "idle") {
// //       dispatch(fetchSuppliers());
// //     }
// //     if (inventoriesStatus === "idle") {
// //       dispatch(fetchInventories());
// //     }
// //   }, [dispatch, suppliersStatus, inventoriesStatus]);

// //   // Initialize form with initialData for edit mode
// //   useEffect(() => {
// //     if (editMode && initialData._id) {
// //       setFormData({
// //         supplier: initialData.supplier?._id || "",
// //         orderDate: initialData.orderDate
// //           ? new Date(initialData.orderDate).toISOString().slice(0, 16)
// //           : "",
// //         expectedDelivery: initialData.expectedDelivery
// //           ? new Date(initialData.expectedDelivery).toISOString().slice(0, 16)
// //           : "",
// //         status: initialData.status || "Pending",
// //       });
// //       setItems(
// //         (initialData.items || []).map((item) => ({
// //           inventory: item.inventory?._id || "",
// //           productName: item.inventory?.name || "",
// //           quantityOrdered: item.quantityOrdered || 0,
// //           unitPrice: item.unitPrice || 0,
// //           total: (item.quantityOrdered || 0) * (item.unitPrice || 0),
// //         }))
// //       );
// //     } else {
// //       setFormData({
// //         supplier: "",
// //         orderDate: "",
// //         expectedDelivery: "",
// //         status: "Pending",
// //       });
// //       setItems([]);
// //     }
// //   }, [editMode, initialData, open]);

// //   // Validation
// //   const validateField = (name, value) => {
// //     let error = {};
// //     switch (name) {
// //       case "supplier":
// //         if (!value) error.supplier = "Supplier is required";
// //         break;
// //       case "orderDate":
// //         if (!value) error.orderDate = "Order date is required";
// //         break;
// //       case "expectedDelivery":
// //         if (!value)
// //           error.expectedDelivery = "Expected delivery date is required";
// //         break;
// //       case "items":
// //         if (items.length === 0) error.items = "At least one item is required";
// //         break;
// //       default:
// //         break;
// //     }
// //     setErrors((prevErrors) => ({
// //       ...prevErrors,
// //       ...error,
// //     }));
// //   };

// //   const handleChange = (field) => (event) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: event.target.value || "",
// //     }));
// //     validateField(field, event.target.value);
// //   };

// //   const addItem = () => {
// //     setItems([
// //       ...items,
// //       {
// //         inventory: "",
// //         productName: "",
// //         quantityOrdered: 1,
// //         unitPrice: 0,
// //         total: 0,
// //       },
// //     ]);
// //   };

// //   const removeItem = (index) => {
// //     const newItems = [...items];
// //     newItems.splice(index, 1);
// //     setItems(newItems);
// //   };

// //   const handleItemChange = (index, field) => (event) => {
// //     const newItems = [...items];
// //     newItems[index][field] = event.target.value;

// //     if (field === "inventory") {
// //       const selectedInventory = inventories.find(
// //         (inv) => inv._id === event.target.value
// //       );
// //       if (selectedInventory) {
// //         newItems[index].productName = selectedInventory.name;
// //         newItems[index].unitPrice = selectedInventory.unitPrice || 0;
// //         newItems[index].total =
// //           newItems[index].quantityOrdered * selectedInventory.unitPrice;
// //       }
// //     } else if (field === "quantityOrdered") {
// //       newItems[index].total =
// //         newItems[index].unitPrice * parseFloat(event.target.value) || 0;
// //     }
// //     setItems(newItems);
// //   };

// //   const handleSave = () => {
// //     Object.keys(formData).forEach((field) =>
// //       validateField(field, formData[field])
// //     );
// //     validateField("items", items);

// //     if (Object.values(errors).some((error) => error)) {
// //       toast.error("Please fix all errors before saving");
// //       return;
// //     }

// //     const purchaseOrderData = {
// //       supplier: formData.supplier,
// //       orderDate: formData.orderDate,
// //       expectedDelivery: formData.expectedDelivery,
// //       status: formData.status,
// //       items: items.map((item) => ({
// //         inventory: item.inventory,
// //         quantityOrdered: Number(item.quantityOrdered),
// //         unitPrice: Number(item.unitPrice),
// //       })),
// //     };

// //     if (editMode) {
// //       dispatch(updatePurchaseOrder({ id: initialData._id, purchaseOrderData }))
// //         .unwrap()
// //         .then(() => {
// //           toast.success("Purchase order updated successfully!", {
// //             duration: 5000,
// //           });
// //           dispatch(fetchPurchaseOrders());
// //           onClose();
// //           onSaveSuccess && onSaveSuccess();
// //         })
// //         .catch((error) => {
// //           toast.error(
// //             `Error updating purchase order: ${
// //               error.message || "Unknown error"
// //             }`,
// //             { duration: 5000 }
// //           );
// //         });
// //     }
// //   };

// //   const handleCancel = () => {
// //     onClose();
// //   };

// //   if (suppliersStatus === "loading" || inventoriesStatus === "loading") {
// //     return (
// //       <Box
// //         sx={{
// //           display: "flex",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           height: "100vh",
// //         }}
// //       >
// //         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <>
// //       <StyledDrawer anchor="right" open={open} onClose={onClose}>
// //         <Box sx={{ p: 2, width: "100%", height: "100%", overflow: "auto" }}>
// //           <Box
// //             sx={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               mb: 2,
// //             }}
// //           >
// //             <h2>Edit Purchase Order</h2>
// //             <IconButton onClick={handleCancel}>
// //               <CloseIcon />
// //             </IconButton>
// //           </Box>

// //           <FormControl fullWidth sx={{ mb: 2 }}>
// //             <InputLabel id="supplier-label">Supplier</InputLabel>
// //             <Select
// //               labelId="supplier-label"
// //               value={formData.supplier || ""}
// //               onChange={handleChange("supplier")}
// //               label="Supplier"
// //               error={!!errors.supplier}
// //             >
// //               {suppliers.map((supplier) => (
// //                 <MenuItem key={supplier._id} value={supplier._id}>
// //                   {supplier.contactPerson}
// //                 </MenuItem>
// //               ))}
// //             </Select>
// //             {errors.supplier && (
// //               <Box sx={{ color: "red", mt: 1 }}>{errors.supplier}</Box>
// //             )}
// //           </FormControl>

// //           <TextField
// //             label="Order Date"
// //             type="datetime-local"
// //             fullWidth
// //             margin="normal"
// //             value={formData.orderDate}
// //             onChange={handleChange("orderDate")}
// //             InputLabelProps={{ shrink: true }}
// //             error={!!errors.orderDate}
// //             helperText={errors.orderDate}
// //           />
// //           <TextField
// //             label="Expected Delivery"
// //             type="datetime-local"
// //             fullWidth
// //             margin="normal"
// //             value={formData.expectedDelivery}
// //             onChange={handleChange("orderDate")}
// //             InputLabelProps={{ shrink: true }}
// //             error={!!errors.expectedDelivery}
// //             helperText={errors.expectedDelivery}
// //           />

// //           <FormControl fullWidth sx={{ mb: 2 }}>
// //             <InputLabel id="status-label">Status</InputLabel>
// //             <Select
// //               labelId="status-label"
// //               value={formData.status || "Pending"}
// //               onChange={handleChange("status")}
// //               label="Status"
// //             >
// //               <MenuItem value="Pending">Pending</MenuItem>
// //               <MenuItem value="Delivered">Delivered</MenuItem>
// //               <MenuItem value="Cancelled">Cancelled</MenuItem>
// //             </Select>
// //           </FormControl>

// //           <h3>Items</h3>
// //           <TableContainer component={Paper}>
// //             <Table size="small" aria-label="items table">
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell>Product</TableCell>
// //                   <TableCell align="right">Quantity</TableCell>
// //                   <TableCell align="right">Unit Price</TableCell>
// //                   <TableCell align="right">Total</TableCell>
// //                   <TableCell align="right">Action</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {items.map((row, index) => (
// //                   <TableRow key={index}>
// //                     <TableCell>
// //                       <FormControl fullWidth sx={{ minWidth: 200 }}>
// //                         <InputLabel id={`inventory-label-${index}`}>
// //                           Product
// //                         </InputLabel>
// //                         <Select
// //                           labelId={`inventory-label-${index}`}
// //                           value={row.inventory || ""}
// //                           onChange={handleItemChange(index, "inventory")}
// //                           label="Product"
// //                         >
// //                           {inventories.map((inv) => (
// //                             <MenuItem key={inv._id} value={inv._id}>
// //                               {inv.name}
// //                             </MenuItem>
// //                           ))}
// //                         </Select>
// //                       </FormControl>
// //                     </TableCell>
// //                     <TableCell align="right">
// //                       <TextField
// //                         type="number"
// //                         value={row.quantityOrdered}
// //                         onChange={handleItemChange(index, "quantityOrdered")}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="right">{row.unitPrice}</TableCell>
// //                     <TableCell align="right">{row.total.toFixed(2)}</TableCell>
// //                     <TableCell align="right">
// //                       <IconButton onClick={() => removeItem(index)}>
// //                         <DeleteIcon />
// //                       </IconButton>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //           <Button startIcon={<AddIcon />} onClick={addItem} sx={{ mb: 2 }}>
// //             Add Item
// //           </Button>
// //           {errors.items && (
// //             <Box sx={{ color: "red", mb: 2 }}>{errors.items}</Box>
// //           )}

// //           <Box
// //             sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
// //           >
// //             <Button
// //               variant="outlined"
// //               onClick={handleCancel}
// //               sx={{ width: "120px", borderRadius: "12px" }}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               variant="contained"
// //               onClick={handleSave}
// //               sx={{
// //                 width: "120px",
// //                 borderRadius: "12px",
// //                 backgroundColor: "green",
// //                 color: "white",
// //                 "&:hover": { backgroundColor: "darkgreen" },
// //               }}
// //               disabled={
// //                 suppliersStatus === "loading" || inventoriesStatus === "loading"
// //               }
// //             >
// //               Update
// //             </Button>
// //           </Box>
// //         </Box>
// //       </StyledDrawer>
// //       <Toaster />
// //     </>
// //   );
// // };

// // export default AddNewPurchaseOrderDrawer;

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
//   updatePurchaseOrder,
//   fetchPurchaseOrders,
// } from "../../redux/slices/purchaseOrderSlice";
// import { fetchInventories } from "../../redux/slices/inventoriesSlice";
// import { fetchSuppliers } from "../../redux/slices/suppliersSlice"; // Assuming an inventory slice exists
// import { Toaster, toast } from "react-hot-toast";

// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   "& .MuiDrawer-paper": {
//     width: "30%",
//     height: "100vh",
//     top: "0",
//     boxSizing: "border-box",
//   },
// }));

// const AddNewPurchaseOrderDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
//   onSaveSuccess,
// }) => {
//   const dispatch = useDispatch();
//   const { suppliers = [], status: suppliersStatus } = useSelector(
//     (state) => state.suppliers || {}
//   );
//   const { inventories = [], status: inventoriesStatus } = useSelector(
//     (state) => state.inventories || {}
//   );

//   // Form State
//   const [formData, setFormData] = useState({
//     supplier: "",
//     orderDate: "",
//     expectedDelivery: "",
//     status: "Pending",
//   });
//   const [items, setItems] = useState([]);
//   const [errors, setErrors] = useState({});

//   // Fetch necessary data
//   useEffect(() => {
//     if (suppliersStatus === "idle") {
//       dispatch(fetchSuppliers());
//     }
//     if (inventoriesStatus === "idle") {
//       dispatch(fetchInventories());
//     }
//   }, [dispatch, suppliersStatus, inventoriesStatus]);

//   // Initialize form with initialData for edit mode
//   useEffect(() => {
//     if (editMode && initialData._id) {
//       setFormData({
//         supplier: initialData.supplier?._id || "",
//         orderDate: initialData.orderDate
//           ? new Date(initialData.orderDate).toISOString().slice(0, 16)
//           : "",
//         expectedDelivery: initialData.expectedDelivery
//           ? new Date(initialData.expectedDelivery).toISOString().slice(0, 16)
//           : "",
//         status: initialData.status || "Pending",
//       });
//       setItems(
//         (initialData.items || []).map((item) => ({
//           inventory: item.inventory?._id || "",
//           productName: item.inventory?.name || "",
//           quantityOrdered: item.quantityOrdered || 0,
//           unitPrice: item.unitPrice || 0,
//           total: (item.quantityOrdered || 0) * (item.unitPrice || 0),
//         }))
//       );
//     } else {
//       setFormData({
//         supplier: "",
//         orderDate: "",
//         expectedDelivery: "",
//         status: "Pending",
//       });
//       setItems([]);
//     }
//   }, [editMode, initialData, open]);

//   // Validation
//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "supplier":
//         if (!value) error.supplier = "Supplier is required";
//         break;
//       case "orderDate":
//         if (!value) error.orderDate = "Order date is required";
//         break;
//       case "expectedDelivery":
//         if (!value)
//           error.expectedDelivery = "Expected delivery date is required";
//         break;
//       case "items":
//         if (items.length === 0) error.items = "At least one item is required";
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
//       [field]: event.target.value || "",
//     }));
//     validateField(field, event.target.value);
//   };

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         inventory: "",
//         productName: "",
//         quantityOrdered: 1,
//         unitPrice: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const removeItem = (index) => {
//     const newItems = [...items];
//     newItems.splice(index, 1);
//     setItems(newItems);
//   };

//   const handleItemChange = (index, field) => (event) => {
//     const newItems = [...items];
//     newItems[index][field] = event.target.value;

//     if (field === "inventory") {
//       const selectedInventory = inventories.find(
//         (inv) => inv._id === event.target.value
//       );
//       if (selectedInventory) {
//         newItems[index].productName = selectedInventory.name;
//         newItems[index].unitPrice = selectedInventory.unitPrice || 0;
//         newItems[index].total =
//           newItems[index].quantityOrdered * selectedInventory.unitPrice;
//       }
//     } else if (field === "quantityOrdered") {
//       newItems[index].total =
//         newItems[index].unitPrice * parseFloat(event.target.value) || 0;
//     }
//     setItems(newItems);
//   };

//   const handleSave = () => {
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );
//     validateField("items", items);

//     if (Object.values(errors).some((error) => error)) {
//       toast.error("Please fix all errors before saving");
//       return;
//     }

//     const purchaseOrderData = {
//       supplier: formData.supplier,
//       orderDate: formData.orderDate,
//       expectedDelivery: formData.expectedDelivery,
//       status: formData.status,
//       items: items.map((item) => ({
//         inventory: item.inventory,
//         quantityOrdered: Number(item.quantityOrdered),
//         unitPrice: Number(item.unitPrice),
//       })),
//     };

//     if (editMode) {
//       dispatch(updatePurchaseOrder({ id: initialData._id, purchaseOrderData }))
//         .unwrap()
//         .then(() => {
//           toast.success("Purchase order updated successfully!", {
//             duration: 5000,
//           });
//           dispatch(fetchPurchaseOrders());
//           onClose();
//           onSaveSuccess && onSaveSuccess();
//         })
//         .catch((error) => {
//           toast.error(
//             `Error updating purchase order: ${
//               error.message || "Unknown error"
//             }`,
//             { duration: 5000 }
//           );
//         });
//     }
//   };

//   const handleCancel = () => {
//     onClose();
//   };

//   if (suppliersStatus === "loading" || inventoriesStatus === "loading") {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
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
//             <h2>Edit Purchase Order</h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="supplier-label">Supplier</InputLabel>
//             <Select
//               labelId="supplier-label"
//               value={formData.supplier || ""}
//               onChange={handleChange("supplier")}
//               label="Supplier"
//               error={!!errors.supplier}
//             >
//               {suppliers.map((supplier) => (
//                 <MenuItem key={supplier._id} value={supplier._id}>
//                   {supplier.contactPerson}
//                 </MenuItem>
//               ))}
//             </Select>
//             {errors.supplier && (
//               <Box sx={{ color: "red", mt: 1 }}>{errors.supplier}</Box>
//             )}
//           </FormControl>

//           <TextField
//             label="Order Date"
//             type="datetime-local"
//             fullWidth
//             margin="normal"
//             value={formData.orderDate}
//             onChange={handleChange("orderDate")}
//             InputLabelProps={{ shrink: true }}
//             error={!!errors.orderDate}
//             helperText={errors.orderDate}
//           />
//           <TextField
//             label="Expected Delivery"
//             type="datetime-local"
//             fullWidth
//             margin="normal"
//             value={formData.expectedDelivery}
//             onChange={handleChange("expectedDelivery")}
//             InputLabelProps={{ shrink: true }}
//             error={!!errors.expectedDelivery}
//             helperText={errors.expectedDelivery}
//           />

//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="status-label">Status</InputLabel>
//             <Select
//               labelId="status-label"
//               value={formData.status || "Pending"}
//               onChange={handleChange("status")}
//               label="Status"
//             >
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="Delivered">Delivered</MenuItem>
//               <MenuItem value="Cancelled">Cancelled</MenuItem>
//             </Select>
//           </FormControl>

//           <h3>Items</h3>
//           <TableContainer component={Paper}>
//             <Table size="small" aria-label="items table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Product</TableCell>
//                   <TableCell align="right">Quantity</TableCell>
//                   <TableCell align="right">Unit Price</TableCell>
//                   <TableCell align="right">Total</TableCell>
//                   <TableCell align="right">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {items.map((row, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <FormControl fullWidth sx={{ minWidth: 200 }}>
//                         <InputLabel id={`inventory-label-${index}`}>
//                           Product
//                         </InputLabel>
//                         <Select
//                           labelId={`inventory-label-${index}`}
//                           value={row.inventory || ""}
//                           onChange={handleItemChange(index, "inventory")}
//                           label="Product"
//                         >
//                           {inventories.map((inv) => (
//                             <MenuItem key={inv._id} value={inv._id}>
//                               {inv.name}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </TableCell>
//                     <TableCell align="right">
//                       <TextField
//                         type="number"
//                         value={row.quantityOrdered}
//                         onChange={handleItemChange(index, "quantityOrdered")}
//                       />
//                     </TableCell>
//                     <TableCell align="right">{row.unitPrice}</TableCell>
//                     <TableCell align="right">{row.total.toFixed(2)}</TableCell>
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
//           {errors.items && (
//             <Box sx={{ color: "red", mb: 2 }}>{errors.items}</Box>
//           )}

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
//                 suppliersStatus === "loading" || inventoriesStatus === "loading"
//               }
//             >
//               Update
//             </Button>
//           </Box>
//         </Box>
//       </StyledDrawer>
//       <Toaster />
//     </>
//   );
// };

// export default AddNewPurchaseOrderDrawer;

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
  updatePurchaseOrder,
  fetchPurchaseOrders,
} from "../../redux/slices/purchaseOrderSlice";
import { fetchInventories } from "../../redux/slices/inventoriesSlice";
import { fetchSuppliers } from "../../redux/slices/suppliersSlice"; // Assuming an inventory slice exists
import { Toaster, toast } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0",
    boxSizing: "border-box",
  },
}));

const AddNewPurchaseOrderDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const { suppliers = [], status: suppliersStatus } = useSelector(
    (state) => state.suppliers || {}
  );
  const { inventories = [], status: inventoriesStatus } = useSelector(
    (state) => state.inventories || {}
  );

  // Form State
  const [formData, setFormData] = useState({
    supplier: "",
    orderDate: "",
    expectedDelivery: "",
    status: "Pending",
  });
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for the update button

  // Fetch necessary data
  useEffect(() => {
    if (suppliersStatus === "idle") {
      dispatch(fetchSuppliers());
    }
    if (inventoriesStatus === "idle") {
      dispatch(fetchInventories());
    }
  }, [dispatch, suppliersStatus, inventoriesStatus]);

  // Initialize form with initialData for edit mode
  useEffect(() => {
    if (editMode && initialData._id) {
      setFormData({
        supplier: initialData.supplier?._id || "",
        orderDate: initialData.orderDate
          ? new Date(initialData.orderDate).toISOString().slice(0, 16)
          : "",
        expectedDelivery: initialData.expectedDelivery
          ? new Date(initialData.expectedDelivery).toISOString().slice(0, 16)
          : "",
        status: initialData.status || "Pending",
      });
      setItems(
        (initialData.items || []).map((item) => ({
          inventory: item.inventory?._id || "",
          productName: item.inventory?.name || "",
          quantityOrdered: item.quantityOrdered || 0,
          unitPrice: item.unitPrice || 0,
          total: (item.quantityOrdered || 0) * (item.unitPrice || 0),
        }))
      );
    } else {
      setFormData({
        supplier: "",
        orderDate: "",
        expectedDelivery: "",
        status: "Pending",
      });
      setItems([]);
    }
  }, [editMode, initialData, open]);

  // Validation
  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "supplier":
        if (!value) error.supplier = "Supplier is required";
        break;
      case "orderDate":
        if (!value) error.orderDate = "Order date is required";
        break;
      case "expectedDelivery":
        if (!value)
          error.expectedDelivery = "Expected delivery date is required";
        break;
      case "items":
        if (items.length === 0) error.items = "At least one item is required";
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
      [field]: event.target.value || "",
    }));
    validateField(field, event.target.value);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        inventory: "",
        productName: "",
        quantityOrdered: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field) => (event) => {
    const newItems = [...items];
    newItems[index][field] = event.target.value;

    if (field === "inventory") {
      const selectedInventory = inventories.find(
        (inv) => inv._id === event.target.value
      );
      if (selectedInventory) {
        newItems[index].productName = selectedInventory.name;
        newItems[index].unitPrice = selectedInventory.unitPrice || 0;
        newItems[index].total =
          newItems[index].quantityOrdered * selectedInventory.unitPrice;
      }
    } else if (field === "quantityOrdered") {
      newItems[index].total =
        newItems[index].unitPrice * parseFloat(event.target.value) || 0;
    }
    setItems(newItems);
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );
    validateField("items", items);

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please fix all errors before saving");
      return;
    }

    const purchaseOrderData = {
      supplier: formData.supplier,
      orderDate: formData.orderDate,
      expectedDelivery: formData.expectedDelivery,
      status: formData.status,
      items: items.map((item) => ({
        inventory: item.inventory,
        quantityOrdered: Number(item.quantityOrdered),
        unitPrice: Number(item.unitPrice),
      })),
    };

    setLoading(true); // Set loading to true when the update starts

    if (editMode) {
      dispatch(updatePurchaseOrder({ id: initialData._id, purchaseOrderData }))
        .unwrap()
        .then(() => {
          toast.success("Purchase order updated successfully!", {
            duration: 5000,
          });
          dispatch(fetchPurchaseOrders());
          onClose();
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(
            `Error updating purchase order: ${
              error.message || "Unknown error"
            }`,
            { duration: 5000 }
          );
        })
        .finally(() => {
          setLoading(false); // Set loading to false when the update is complete
        });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (suppliersStatus === "loading" || inventoriesStatus === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="inherit" sx={{ color: "#fe6c00" }} />
      </Box>
    );
  }

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
            <h2>Edit Purchase Order</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="supplier-label">Supplier</InputLabel>
            <Select
              labelId="supplier-label"
              value={formData.supplier || ""}
              onChange={handleChange("supplier")}
              label="Supplier"
              error={!!errors.supplier}
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier._id} value={supplier._id}>
                  {supplier.contactPerson}
                </MenuItem>
              ))}
            </Select>
            {errors.supplier && (
              <Box sx={{ color: "red", mt: 1 }}>{errors.supplier}</Box>
            )}
          </FormControl>

          <TextField
            label="Order Date"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.orderDate}
            onChange={handleChange("orderDate")}
            InputLabelProps={{ shrink: true }}
            error={!!errors.orderDate}
            helperText={errors.orderDate}
          />
          <TextField
            label="Expected Delivery"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.expectedDelivery}
            onChange={handleChange("expectedDelivery")}
            InputLabelProps={{ shrink: true }}
            error={!!errors.expectedDelivery}
            helperText={errors.expectedDelivery}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status || "Pending"}
              onChange={handleChange("status")}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <h3>Items</h3>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="items table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl fullWidth sx={{ minWidth: 200 }}>
                        <InputLabel id={`inventory-label-${index}`}>
                          Product
                        </InputLabel>
                        <Select
                          labelId={`inventory-label-${index}`}
                          value={row.inventory || ""}
                          onChange={handleItemChange(index, "inventory")}
                          label="Product"
                        >
                          {inventories.map((inv) => (
                            <MenuItem key={inv._id} value={inv._id}>
                              {inv.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={row.quantityOrdered}
                        onChange={handleItemChange(index, "quantityOrdered")}
                      />
                    </TableCell>
                    <TableCell align="right">{row.unitPrice}</TableCell>
                    <TableCell align="right">{row.total.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => removeItem(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button startIcon={<AddIcon />} onClick={addItem} sx={{ mb: 2 }}>
            Add Item
          </Button>
          {errors.items && (
            <Box sx={{ color: "red", mb: 2 }}>{errors.items}</Box>
          )}

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
                suppliersStatus === "loading" || inventoriesStatus === "loading"
              }
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
        </Box>
      </StyledDrawer>
      <Toaster />
    </>
  );
};

export default AddNewPurchaseOrderDrawer;
