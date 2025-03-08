// // import React, { useState, useEffect, useCallback } from "react";
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
// //   createHallTransaction,
// //   updateHallTransaction,
// //   fetchHallTransactions,
// // } from "../../redux/slices/hallSlice";
// // import { fetchHallTypes } from "../../redux/slices/hallTypesSlice";
// // import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// // import { Toaster, toast } from "react-hot-toast";

// // const StyledDrawer = styled(Drawer)(({ theme }) => ({
// //   "& .MuiDrawer-paper": {
// //     width: "30%",
// //     height: "100vh",
// //     top: "0",
// //     boxSizing: "border-box",
// //   },
// // }));

// // const AddNewHallDrawer = ({
// //   open,
// //   onClose,
// //   editMode = false,
// //   initialData = {},
// // }) => {
// //   const dispatch = useDispatch();
// //   const { list: halls = [], hallTypesLoading } = useSelector(
// //     (state) => state.hallTypes || {}
// //   );
// //   const { paymentMethods = [], paymentMethodsLoading } = useSelector(
// //     (state) => state.paymentMethods || {}
// //   );
// //   const user = useSelector((state) => state.auth.user);

// //   useEffect(() => {
// //     if (halls.length === 0 && !hallTypesLoading) {
// //       dispatch(fetchHallTypes());
// //     }
// //   }, [dispatch, halls.length, hallTypesLoading]);

// //   useEffect(() => {
// //     if (paymentMethods.length === 0 && !paymentMethodsLoading) {
// //       dispatch(fetchPaymentMethods());
// //     }
// //   }, [dispatch, paymentMethods.length, paymentMethodsLoading]);

// //   const [formData, setFormData] = useState({
// //     hallId: "",
// //     customerName: "",
// //     eventType: "",
// //     startTime: "",
// //     endTime: "",
// //     price: "",
// //     discount: "0",
// //     totalAmount: "",
// //     paymentMethod: "",
// //     paymentStatus: "Pending",
// //     notes: "",
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [selectedHalls, setSelectedHalls] = useState([]);

// //   const calculateTotalAmount = useCallback(
// //     (halls = selectedHalls) => {
// //       const subTotal = halls.reduce(
// //         (acc, hall) =>
// //           acc + (parseFloat(hall.price) || 0) * (parseFloat(hall.qty) || 0),
// //         0
// //       );
// //       const discountAmount = (subTotal * parseFloat(formData.discount)) / 100;
// //       const total = subTotal - discountAmount;
// //       setFormData((prev) => ({
// //         ...prev,
// //         totalAmount: total.toFixed(2),
// //       }));
// //     },
// //     [formData.discount]
// //   );

// //   useEffect(() => {
// //     if (editMode) {
// //       const hallsFromData = initialData.halls || [];
// //       setFormData({
// //         customerName: initialData.customerName || "",
// //         eventType: initialData.eventType || "",
// //         startTime: new Date(initialData.startTime).toISOString().slice(0, 16),
// //         endTime: new Date(initialData.endTime).toISOString().slice(0, 16),
// //         price: initialData.price || "",
// //         discount: initialData.discount || "0",
// //         paymentMethod: initialData.paymentMethod?._id || "",
// //         paymentStatus: initialData.paymentStatus || "Pending",
// //         notes: initialData.notes || "",
// //       });
// //       setSelectedHalls(
// //         hallsFromData.map((hall) => ({
// //           _id: hall._id || "",
// //           name: hall.name || "",
// //           price: parseFloat(hall.price) || 0,
// //           qty: hall.qty || 1, // Assuming qty could be part of the hall data
// //         }))
// //       );
// //       calculateTotalAmount(hallsFromData);
// //     } else {
// //       setFormData({
// //         hallId: "",
// //         customerName: "",
// //         eventType: "",
// //         startTime: "",
// //         endTime: "",
// //         price: "",
// //         discount: "0",
// //         totalAmount: "",
// //         paymentMethod: "",
// //         paymentStatus: "Pending",
// //         notes: "",
// //       });
// //       setSelectedHalls([]);
// //       calculateTotalAmount([]);
// //     }
// //   }, [editMode, initialData]);

// //   const handleChange = useCallback(
// //     (field) => (event) => {
// //       setFormData((prev) => ({
// //         ...prev,
// //         [field]: event.target.value,
// //       }));
// //       setErrors((prevErrors) => ({
// //         ...prevErrors,
// //         [field]: undefined,
// //       }));
// //       if (field === "discount") {
// //         calculateTotalAmount(selectedHalls);
// //       }
// //     },
// //     [selectedHalls]
// //   );

// //   const validateField = useCallback((name, value) => {
// //     let error = {};
// //     switch (name) {
// //       case "hallId":
// //         if (!value) error.hallId = "Hall is required";
// //         break;
// //       case "customerName":
// //         if (!value.trim()) error.customerName = "Customer name is required";
// //         break;
// //       case "eventType":
// //         if (!value) error.eventType = "Event type is required";
// //         break;
// //       case "startTime":
// //       case "endTime":
// //         if (!value) error[name] = `${name} is required`;
// //         break;
// //       case "paymentMethod":
// //         if (!value) error.paymentMethod = "Payment method is required";
// //         break;
// //       default:
// //         break;
// //     }
// //     setErrors((prevErrors) => ({
// //       ...prevErrors,
// //       ...error,
// //     }));
// //   }, []);

// //   const addHall = useCallback(() => {
// //     setSelectedHalls((prev) => [
// //       ...prev,
// //       { _id: "", name: "", price: 0, qty: 1 },
// //     ]);
// //   }, []);

// //   const removeHall = useCallback(
// //     (index) => {
// //       setSelectedHalls((prevHalls) => {
// //         const newHalls = [...prevHalls];
// //         newHalls.splice(index, 1);
// //         return newHalls;
// //       });
// //       calculateTotalAmount();
// //     },
// //     [calculateTotalAmount]
// //   );

// //   const handleHallChange = useCallback(
// //     (index, field) => (event) => {
// //       setSelectedHalls((prevHalls) => {
// //         const newHalls = [...prevHalls];
// //         if (!newHalls[index]) {
// //           newHalls[index] = { _id: "", name: "", price: 0, qty: 1 };
// //         }

// //         if (field === "_id") {
// //           const selectedHall = halls.find((h) => h._id === event.target.value);
// //           if (selectedHall) {
// //             newHalls[index] = {
// //               ...newHalls[index],
// //               _id: event.target.value,
// //               name: selectedHall.name,
// //               price: parseFloat(selectedHall.price) || 0,
// //               qty: 1, // Reset qty to 1 when changing hall type
// //             };
// //           }
// //           console.log(
// //             "Selected Hall Price:",
// //             parseFloat(selectedHall.price) || 0
// //           );
// //         } else {
// //           newHalls[index][field] =
// //             field === "price"
// //               ? parseFloat(event.target.value) || 0
// //               : field === "qty"
// //               ? Math.max(1, parseFloat(event.target.value)) || 1
// //               : event.target.value;
// //         }

// //         calculateTotalAmount(newHalls);
// //         return newHalls;
// //       });
// //     },
// //     [halls, calculateTotalAmount]
// //   );

// //   const handleSave = useCallback(() => {
// //     Object.keys(formData).forEach((field) =>
// //       validateField(field, formData[field])
// //     );

// //     if (Object.values(errors).some((error) => error)) {
// //       return;
// //     }

// //     if (selectedHalls.length === 0) {
// //       setErrors((prev) => ({
// //         ...prev,
// //         halls: "At least one hall is required",
// //       }));
// //       return;
// //     }

// //     const hall = selectedHalls[0]; // Assuming one hall per transaction
// //     const {
// //       customerName,
// //       eventType,
// //       startTime,
// //       endTime,
// //       discount,
// //       paymentMethod,
// //       paymentStatus,
// //       notes,
// //     } = formData;

// //     // Calculate totalAmount with discount applied before sending to backend
// //     const totalAmountAfterDiscount =
// //       hall.price - hall.price * (parseFloat(discount) / 100);

// //     const transactionData = {
// //       hall: {
// //         _id: hall._id,
// //         name: hall.name,
// //         price: parseFloat(hall.price),
// //       },
// //       customerName,
// //       eventType,
// //       startTime: new Date(startTime).toISOString(),
// //       endTime: new Date(endTime).toISOString(),
// //       price: parseFloat(hall.price),
// //       discount: parseFloat(discount),
// //       //totalAmount: totalAmountAfterDiscount,
// //       paymentMethod,
// //       paymentStatus: editMode ? paymentStatus : "Pending",
// //       notes,
// //     };

// //     if (editMode) {
// //       dispatch(updateHallTransaction({ id: initialData._id, transactionData }))
// //         .then(() => {
// //           toast.success("Hall transaction updated successfully!", {
// //             duration: 5000,
// //           });
// //           dispatch(fetchHallTransactions());
// //           onClose();
// //         })
// //         .catch((error) => {
// //           toast.error(
// //             "Error updating hall transaction: " +
// //               (error.message || "Unknown error"),
// //             {
// //               duration: 5000,
// //             }
// //           );
// //         });
// //     } else {
// //       dispatch(createHallTransaction(transactionData))
// //         .then(() => {
// //           toast.success("Hall transaction created successfully!", {
// //             duration: 5000,
// //           });
// //           dispatch(fetchHallTransactions());
// //           onClose();
// //         })
// //         .catch((error) => {
// //           console.error("POST Error:", error);
// //           toast.error(
// //             "Error creating hall transaction: " +
// //               (error.message || "Unknown error"),
// //             {
// //               duration: 5000,
// //             }
// //           );
// //         });
// //     }
// //   }, [
// //     dispatch,
// //     editMode,
// //     formData,
// //     errors,
// //     initialData._id,
// //     selectedHalls,
// //     onClose,
// //     user,
// //   ]);

// //   const handleCancel = useCallback(() => {
// //     onClose();
// //   }, [onClose]);

// //   if (hallTypesLoading || paymentMethodsLoading) {
// //     return (
// //       <Box
// //         sx={{
// //           display: "flex",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           height: "100vh",
// //         }}
// //       >
// //         <CircularProgress />
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
// //             <h2>
// //               {editMode ? "Edit Hall Transaction" : "Add New Hall Transaction"}
// //             </h2>
// //             <IconButton onClick={handleCancel}>
// //               <CloseIcon />
// //             </IconButton>
// //           </Box>

// //           <TextField
// //             label="Customer Name"
// //             fullWidth
// //             margin="normal"
// //             value={formData.customerName}
// //             onChange={handleChange("customerName")}
// //             error={!!errors.customerName}
// //             helperText={errors.customerName}
// //           />

// //           <FormControl fullWidth margin="normal">
// //             <InputLabel id="event-type-label">Event Type</InputLabel>
// //             <Select
// //               labelId="event-type-label"
// //               value={formData.eventType}
// //               onChange={handleChange("eventType")}
// //               label="Event Type"
// //               error={!!errors.eventType}
// //             >
// //               {["conference", "workshop", "webinar", "Wedding"].map((type) => (
// //                 <MenuItem key={type} value={type}>
// //                   {type.charAt(0).toUpperCase() + type.slice(1)}
// //                 </MenuItem>
// //               ))}
// //             </Select>
// //             {errors.eventType && (
// //               <Box sx={{ color: "red", mt: 1 }}>{errors.eventType}</Box>
// //             )}
// //           </FormControl>

// //           <TextField
// //             label="Start Time"
// //             type="datetime-local"
// //             fullWidth
// //             margin="normal"
// //             value={formData.startTime}
// //             onChange={handleChange("startTime")}
// //             error={!!errors.startTime}
// //             helperText={errors.startTime}
// //             InputLabelProps={{ shrink: true }}
// //           />

// //           <TextField
// //             label="End Time"
// //             type="datetime-local"
// //             fullWidth
// //             margin="normal"
// //             value={formData.endTime}
// //             onChange={handleChange("endTime")}
// //             error={!!errors.endTime}
// //             helperText={errors.endTime}
// //             InputLabelProps={{ shrink: true }}
// //           />

// //           <TextField
// //             label="Notes"
// //             fullWidth
// //             margin="normal"
// //             multiline
// //             rows={4}
// //             value={formData.notes}
// //             onChange={handleChange("notes")}
// //           />

// //           <h3>Halls</h3>
// //           <TableContainer component={Paper}>
// //             <Table size="small" aria-label="halls table">
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell>Hall</TableCell>
// //                   <TableCell align="right">Price</TableCell>
// //                   <TableCell align="right">Quantity</TableCell>
// //                   <TableCell align="right">Total</TableCell>
// //                   <TableCell align="right">Action</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {selectedHalls.map((row, index) => (
// //                   <TableRow key={index}>
// //                     <TableCell>
// //                       <FormControl fullWidth>
// //                         <InputLabel id={`hall-type-label-${index}`}>
// //                           Hall Type
// //                         </InputLabel>
// //                         <Select
// //                           labelId={`hall-type-label-${index}`}
// //                           value={row._id}
// //                           onChange={handleHallChange(index, "_id")}
// //                           label="Hall Type"
// //                           // If you want to restrict changing halls in edit mode for the first hall, uncomment this:
// //                           // disabled={editMode && index === 0}
// //                         >
// //                           {halls.map((hall) => (
// //                             <MenuItem key={hall._id} value={hall._id}>
// //                               {hall.name}
// //                             </MenuItem>
// //                           ))}
// //                         </Select>
// //                       </FormControl>
// //                     </TableCell>
// //                     <TableCell align="right">
// //                       <TextField
// //                         type="number"
// //                         value={row.price === 0 ? "" : row.price}
// //                         onChange={handleHallChange(index, "price")}
// //                         disabled={editMode}
// //                         InputProps={{
// //                           inputProps: { min: 0, step: "0.01" },
// //                         }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="right">
// //                       <TextField
// //                         type="number"
// //                         value={row.qty}
// //                         onChange={handleHallChange(index, "qty")}
// //                         disabled={editMode}
// //                         InputProps={{
// //                           inputProps: { min: 1, step: 1 },
// //                         }}
// //                       />
// //                     </TableCell>
// //                     <TableCell align="right">
// //                       {parseFloat(row.price) * parseFloat(row.qty) || 0}
// //                     </TableCell>
// //                     <TableCell align="right">
// //                       <IconButton onClick={() => removeHall(index)}>
// //                         <DeleteIcon />
// //                       </IconButton>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //           <Button startIcon={<AddIcon />} onClick={addHall} sx={{ mb: 2 }}>
// //             Add Hall
// //           </Button>

// //           <TextField
// //             label="Discount (%)"
// //             type="number"
// //             fullWidth
// //             margin="normal"
// //             value={formData.discount}
// //             onChange={handleChange("discount")}
// //             InputProps={{ inputProps: { min: 0, max: 100 } }}
// //           />

// //           <TextField
// //             label="Total Amount"
// //             type="number"
// //             fullWidth
// //             margin="normal"
// //             value={formData.totalAmount}
// //             onChange={handleChange("totalAmount")}
// //             disabled
// //           />

// //           <FormControl fullWidth margin="normal">
// //             <InputLabel id="payment-method-label">Payment Method</InputLabel>
// //             <Select
// //               labelId="payment-method-label"
// //               value={formData.paymentMethod}
// //               onChange={handleChange("paymentMethod")}
// //               label="Payment Method"
// //               error={!!errors.paymentMethod}
// //             >
// //               {paymentMethods.map((method) => (
// //                 <MenuItem key={method._id} value={method._id}>
// //                   {method.name}
// //                 </MenuItem>
// //               ))}
// //             </Select>
// //             {errors.paymentMethod && (
// //               <Box sx={{ color: "red", mt: 1 }}>{errors.paymentMethod}</Box>
// //             )}
// //           </FormControl>

// //           <FormControl fullWidth margin="normal">
// //             <InputLabel id="payment-status-label">Payment Status</InputLabel>
// //             <Select
// //               labelId="payment-status-label"
// //               value={formData.paymentStatus}
// //               onChange={handleChange("paymentStatus")}
// //               label="Payment Status"
// //             >
// //               {editMode
// //                 ? ["Paid", "Pending", "Cancelled", "Refund"].map((status) => (
// //                     <MenuItem key={status} value={status}>
// //                       {status}
// //                     </MenuItem>
// //                   ))
// //                 : ["Completed", "Pending", "Failed"].map((status) => (
// //                     <MenuItem key={status} value={status}>
// //                       {status}
// //                     </MenuItem>
// //                   ))}
// //             </Select>
// //           </FormControl>

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
// //               disabled={hallTypesLoading || paymentMethodsLoading}
// //             >
// //               {hallTypesLoading || paymentMethodsLoading ? (
// //                 <CircularProgress size={24} />
// //               ) : (
// //                 "Save"
// //               )}
// //             </Button>
// //           </Box>
// //         </Box>
// //       </StyledDrawer>
// //       <Toaster />
// //     </>
// //   );
// // };

// // export default AddNewHallDrawer;

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
//   createHallTransaction,
//   updateHallTransaction,
//   fetchHallTransactions,
// } from "../../redux/slices/hallSlice";
// import { fetchHallTypes } from "../../redux/slices/hallTypesSlice";
// import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
// import { Toaster, toast } from "react-hot-toast";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   "& .MuiDrawer-paper": {
//     width: "30%",
//     height: "100vh",
//     top: "0",
//     boxSizing: "border-box",
//   },
// }));

// const AddNewHallDrawer = ({
//   open,
//   onClose,
//   editMode = false,
//   initialData = {},
//   onSaveSuccess,
// }) => {
//   const dispatch = useDispatch();
//   const {
//     list: hallTypes,
//     status,
//     error,
//   } = useSelector((state) => state.hallTypes);
//   const hallTypesLoading = status === "loading";

//   const { paymentMethods, status: paymentMethodsStatus } = useSelector(
//     (state) => state.paymentMethods
//   );

//   const { transactions } = useSelector((state) => state.hallTransactions);

//   useEffect(() => {
//     console.log("Fetching hall types...");
//     if (!hallTypes || hallTypes.length === 0) {
//       dispatch(fetchHallTypes());
//     }
//   }, [dispatch, hallTypes]);

//   useEffect(() => {
//     console.log("Fetching payment methods...");
//     if (paymentMethodsStatus === "idle") {
//       dispatch(fetchPaymentMethods());
//     }
//   }, [dispatch, paymentMethodsStatus]);

//   // State for form data
//   const [formData, setFormData] = useState({
//     customerName: "",
//     contactPhone: "",
//     eventType: "conference",
//     startTime: "",
//     endTime: "",
//     paymentMethod: "",
//     paymentStatus: "Pending",
//     notes: "",
//     discount: 0,
//     totalAmount: 0,
//   });

//   // State for halls table
//   const [hallsList, setHallsList] = useState([]);

//   useEffect(() => {
//     if (editMode && transactions.length) {
//       const updatedTransaction = transactions.find(
//         (t) => t._id === initialData._id
//       );
//       if (updatedTransaction) {
//         setFormData({
//           customerName: updatedTransaction.customerName || "",
//           contactPhone: updatedTransaction.contactPhone || "",
//           eventType: updatedTransaction.eventType || "conference",
//           startTime: updatedTransaction.startTime
//             ? new Date(updatedTransaction.startTime).toISOString().slice(0, 16)
//             : "",
//           endTime: updatedTransaction.endTime
//             ? new Date(updatedTransaction.endTime).toISOString().slice(0, 16)
//             : "",
//           paymentMethod: updatedTransaction.paymentMethod || "",
//           paymentStatus: updatedTransaction.paymentStatus || "Pending",
//           notes: updatedTransaction.notes || "",
//           discount: updatedTransaction.discount || 0,
//           totalAmount: updatedTransaction.totalAmount || 0,
//         });
//         // setFormData({
//         //   ...updatedTransaction,
//         //   startTime: updatedTransaction.startTime
//         //     ? new Date(updatedTransaction.startTime).toISOString().slice(0, 16)
//         //     : "",
//         //   endTime: updatedTransaction.endTime
//         //     ? new Date(updatedTransaction.endTime).toISOString().slice(0, 16)
//         //     : "",
//         // });
//         setHallsList(
//           (updatedTransaction.halls || []).map(({ _id, name, price, qty }) => ({
//             _id,
//             name,
//             qty: qty || 1,
//             price: price || 0,
//             total: (qty || 1) * (price || 0),
//           }))
//         );
//       } else {
//         setFormData({
//           ...initialData,
//           startTime: initialData.startTime
//             ? new Date(initialData.startTime).toISOString().slice(0, 16)
//             : "",
//           endTime: initialData.endTime
//             ? new Date(initialData.endTime).toISOString().slice(0, 16)
//             : "",
//         });
//         setHallsList(
//           (initialData.halls || []).map(({ _id, name, price, qty }) => ({
//             _id,
//             name,
//             qty: qty || 1,
//             price: price || 0,
//             total: (qty || 1) * (price || 0),
//           }))
//         );
//       }
//     } else {
//       setFormData({
//         customerName: "",
//         contactPhone: "",
//         eventType: "conference",
//         startTime: "",
//         endTime: "",
//         paymentMethod: "",
//         paymentStatus: "Pending",
//         notes: "",
//         discount: 0,
//         totalAmount: 0,
//       });
//       setHallsList([]);
//     }
//   }, [editMode, initialData, transactions]);

//   const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = {};
//     switch (name) {
//       case "customerName":
//         if (!value) error.customerName = "Customer name is required";
//         break;
//       case "startTime":
//       case "endTime":
//         if (!value) error[name] = `${name} is required`;
//         break;
//       case "hallsList":
//         if (hallsList.length === 0)
//           error.hallsList = "At least one hall service is required";
//         break;
//       case "paymentMethod":
//         if (!value) error.paymentMethod = "Payment method is required";
//         break;
//       case "discount":
//         const numericValue = parseFloat(value);
//         if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
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

//   const handleDiscountChange = (change) => {
//     const newDiscount = Math.max(0, Math.min(100, formData.discount + change));
//     setFormData((prev) => ({
//       ...prev,
//       discount: newDiscount,
//     }));
//   };

//   const handleChange = (field) => (event) => {
//     const value =
//       field === "discount"
//         ? parseFloat(event.target.value) || 0
//         : event.target.value;

//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     if (field === "discount") {
//       calculateTotalAmount();
//       validateField("discount", value);
//     } else {
//       validateField(field, value);
//     }
//   };

//   const addHall = () => {
//     setHallsList([
//       ...hallsList,
//       { _id: "", name: "", qty: 1, price: 0, total: 0 },
//     ]);
//     calculateTotalAmount([...hallsList, { total: 0 }]);
//   };

//   const removeHall = (index) => {
//     const newHalls = [...hallsList];
//     newHalls.splice(index, 1);
//     setHallsList(newHalls);
//     calculateTotalAmount(newHalls);
//   };

//   const handleHallChange = (index, field) => (event) => {
//     setHallsList((prevHalls) => {
//       const newHalls = [...prevHalls];
//       newHalls[index] = {
//         ...newHalls[index],
//         [field]: event.target.value,
//       };
//       if (field === "name") {
//         const selectedHall = hallTypes.find(
//           (h) => h.name === event.target.value
//         );
//         if (selectedHall) {
//           newHalls[index] = {
//             ...newHalls[index],
//             _id: selectedHall._id,
//             price: Number(selectedHall.price), // Update price here
//             total: Number(selectedHall.price) * newHalls[index].qty,
//           };
//         }
//       } else if (field === "qty") {
//         newHalls[index].total =
//           newHalls[index].price * Number(event.target.value);
//       }
//       calculateTotalAmount(newHalls);
//       return newHalls;
//     });
//   };

//   // const handleHallChange = (index, field) => (event) => {
//   //   const newHalls = [...hallsList];
//   //   newHalls[index][field] = event.target.value;
//   //   if (field === "name") {
//   //     const selectedHall = hallTypes.find(
//   //       (hall) => hall.name === event.target.value
//   //     );
//   //     if (selectedHall) {
//   //       newHalls[index]._id = selectedHall._id;
//   //       newHalls[index].price = Number(selectedHall.price);
//   //       newHalls[index].total = selectedHall.price * newHalls[index].qty;
//   //     }
//   //   } else if (field === "qty") {
//   //     newHalls[index].total =
//   //       newHalls[index].price * parseFloat(event.target.value) || 0;
//   //   }
//   //   setHallsList(newHalls);
//   //   calculateTotalAmount(newHalls);
//   // };

//   const calculateTotalAmount = (halls = hallsList) => {
//     const subTotal = halls.reduce((sum, hall) => sum + (hall.total || 0), 0);
//     const discountAmount = subTotal * (formData.discount / 100) || 0;
//     const total = subTotal - discountAmount;
//     setFormData((prev) => ({ ...prev, totalAmount: total }));
//   };

//   // const handleSave = () => {
//   //   console.log("Saving form data:", formData);
//   //   console.log("Halls list:", hallsList);

//   //   Object.keys(formData).forEach((field) =>
//   //     validateField(field, formData[field])
//   //   );
//   //   validateField("hallsList", hallsList);

//   //   if (Object.values(errors).some((error) => error)) {
//   //     console.log("Validation errors found:", errors);
//   //     return;
//   //   }

//   //   if (hallsList.length === 0) {
//   //     setErrors((prevErrors) => ({
//   //       ...prevErrors,
//   //       hallsList: "At least one hall service is required",
//   //     }));
//   //     console.log("No halls added to transaction");
//   //     return;
//   //   }

//   //   const validatedHalls = hallsList.map((hall) => ({
//   //     _id: hall._id || undefined,
//   //     name: hall.name,
//   //     qty: Number(hall.qty),
//   //     price: Number(hall.price),
//   //   }));

//   //   const { createdAt, updatedAt, __v, ...hallTransactionData } = formData;
//   //   hallTransactionData.halls = validatedHalls;

//   //   console.log("Hall transaction data before sending:", hallTransactionData);

//   //   // Check if id is defined before updating
//   //   if (!initialData._id) {
//   //     console.error("Transaction ID is undefined, cannot proceed with update.");
//   //     toast.error("Transaction ID is missing. Update cannot proceed.", {
//   //       duration: 5000,
//   //     });
//   //     return;
//   //   }

//   //   if (editMode) {
//   //     dispatch(
//   //       updateHallTransaction({ id: initialData._id, hallTransactionData })
//   //     )
//   //       .then((response) => {
//   //         toast.success("Hall transaction updated successfully!", {
//   //           duration: 5000,
//   //         });
//   //         onClose();
//   //         onSaveSuccess && onSaveSuccess();

//   //         // Check if the response contains the expected updated transaction
//   //         if (response.payload && response.payload._id) {
//   //           console.log(
//   //             "Update successful, transaction ID:",
//   //             response.payload._id
//   //           );
//   //           toast.success("Hall transaction updated successfully!", {
//   //             duration: 5000,
//   //           });
//   //           onClose();
//   //           onSaveSuccess && onSaveSuccess();
//   //         } else {
//   //           console.error(
//   //             "Update response does not contain updated transaction data.",
//   //             response.payload
//   //           );
//   //           toast.error(
//   //             "Failed to verify update. Please check the transaction.",
//   //             {
//   //               duration: 5000,
//   //             }
//   //           );
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error updating hall transaction:", error);
//   //         toast.error(`Error updating hall transaction: ${error.message}`, {
//   //           duration: 5000,
//   //         });
//   //       });
//   //   } else {
//   //     // For create operation
//   //     dispatch(createHallTransaction(hallTransactionData))
//   //       .then((response) => {
//   //         toast.success("Hall transaction created successfully!", {
//   //           duration: 5000,
//   //         });
//   //         onClose();
//   //         onSaveSuccess && onSaveSuccess();

//   //         // Check if the response contains the new transaction ID
//   //         if (response && response.payload && response.payload._id) {
//   //           console.log(
//   //             "Creation successful, new transaction ID:",
//   //             response.payload._id
//   //           );
//   //         } else {
//   //           console.error(
//   //             "Creation response does not contain new transaction data."
//   //           );
//   //           toast.error(
//   //             "Failed to verify creation. Please check the transaction.",
//   //             {
//   //               duration: 5000,
//   //             }
//   //           );
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error creating hall transaction:", error);
//   //         toast.error(`Error creating hall transaction: ${error.message}`, {
//   //           duration: 5000,
//   //         });
//   //       });
//   //   }
//   // };
//   // const handleSave = () => {
//   //   console.log("Saving form data:", formData);
//   //   console.log("Halls list:", hallsList);

//   //   // Validate all form fields
//   //   Object.keys(formData).forEach((field) =>
//   //     validateField(field, formData[field])
//   //   );
//   //   validateField("hallsList", hallsList);

//   //   // Check for validation errors
//   //   if (Object.values(errors).some((error) => error)) {
//   //     console.log("Validation errors found:", errors);
//   //     return;
//   //   }

//   //   // Ensure at least one hall is added
//   //   if (hallsList.length === 0) {
//   //     setErrors((prevErrors) => ({
//   //       ...prevErrors,
//   //       hallsList: "At least one hall service is required",
//   //     }));
//   //     console.log("No halls added to transaction");
//   //     return;
//   //   }

//   //   // Prepare validated halls data
//   //   const validatedHalls = hallsList.map((hall) => ({
//   //     _id: hall._id || undefined,
//   //     name: hall.name,
//   //     qty: Number(hall.qty),
//   //     price: Number(hall.price),
//   //   }));

//   //   console.log("Validated halls:", validatedHalls);

//   //   // Prepare transaction data
//   //   const { createdAt, updatedAt, __v, ...hallTransactionData } = formData;
//   //   hallTransactionData.halls = validatedHalls;

//   //   // Ensure discount is optional
//   //   if (hallTransactionData.discount === "") {
//   //     delete hallTransactionData.discount;
//   //   }

//   //   console.log("Hall transaction data before sending:", hallTransactionData);

//   //   // Ensure at least one of the required fields is present
//   //   const hasRequiredField = Object.keys(hallTransactionData).some((key) =>
//   //     [
//   //       "customerName",
//   //       "contactPhone",
//   //       "eventType",
//   //       "startTime",
//   //       "endTime",
//   //       "discount",
//   //       "paymentMethod",
//   //       "paymentStatus",
//   //       "notes",
//   //       "halls",
//   //       "staffInvolved",
//   //       "totalAmount",
//   //     ].includes(key)
//   //   );

//   //   if (!hasRequiredField) {
//   //     console.log("No required fields present in the update data");
//   //     toast.error("At least one required field must be present", {
//   //       duration: 5000,
//   //     });
//   //     return;
//   //   }

//   //   // Handle create or update operation
//   //   if (editMode) {
//   //     console.log("Updating transaction with ID:", initialData._id);
//   //     console.log(
//   //       "Transaction data being sent to backend:",
//   //       hallTransactionData
//   //     );
//   //     dispatch(
//   //       updateHallTransaction({
//   //         id: initialData._id,
//   //         transactionData: hallTransactionData,
//   //       })
//   //     )
//   //       .then((response) => {
//   //         if (response.payload && response.payload._id) {
//   //           console.log(
//   //             "Update successful, transaction ID:",
//   //             response.payload._id
//   //           );
//   //           toast.success("Hall transaction updated successfully!", {
//   //             duration: 5000,
//   //           });
//   //           onClose();
//   //           onSaveSuccess && onSaveSuccess();
//   //         } else {
//   //           console.error(
//   //             "Update response does not contain updated transaction data.",
//   //             response.payload
//   //           );
//   //           toast.error(
//   //             "Failed to verify update. Please check the transaction.",
//   //             {
//   //               duration: 5000,
//   //             }
//   //           );
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error updating hall transaction:", error);
//   //         toast.error(`Error updating hall transaction: ${error.message}`, {
//   //           duration: 5000,
//   //         });
//   //       });
//   //   } else {
//   //     dispatch(createHallTransaction(hallTransactionData))
//   //       .then((response) => {
//   //         if (response.payload && response.payload._id) {
//   //           console.log(
//   //             "Creation successful, new transaction ID:",
//   //             response.payload._id
//   //           );
//   //           toast.success("Hall transaction created successfully!", {
//   //             duration: 5000,
//   //           });
//   //           onClose();
//   //           onSaveSuccess && onSaveSuccess();
//   //         } else {
//   //           console.error(
//   //             "Creation response does not contain new transaction data."
//   //           );
//   //           toast.error(
//   //             "Failed to verify creation. Please check the transaction.",
//   //             {
//   //               duration: 5000,
//   //             }
//   //           );
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error creating hall transaction:", error);
//   //         toast.error(`Error creating hall transaction: ${error.message}`, {
//   //           duration: 5000,
//   //         });
//   //       });
//   //   }
//   // };

//   const handleSave = () => {
//     console.log("Saving form data:", formData);
//     console.log("Halls list:", hallsList);

//     // Validate all form fields
//     Object.keys(formData).forEach((field) =>
//       validateField(field, formData[field])
//     );
//     validateField("hallsList", hallsList);

//     // Check for validation errors
//     if (Object.values(errors).some((error) => error)) {
//       console.log("Validation errors found:", errors);
//       return;
//     }

//     // Ensure at least one hall is added
//     if (hallsList.length === 0) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         hallsList: "At least one hall service is required",
//       }));
//       console.log("No halls added to transaction");
//       return;
//     }

//     // Prepare validated halls data (include price)
//     const validatedHalls = hallsList.map((hall) => ({
//       name: hall.name,
//       qty: Number(hall.qty),
//       price: Number(hall.price), // Include price here
//     }));

//     console.log("Validated halls:", validatedHalls);

//     // Prepare transaction data
//     const { createdAt, updatedAt, __v, ...hallTransactionData } = formData;
//     hallTransactionData.halls = validatedHalls;

//     // Ensure discount is optional
//     if (hallTransactionData.discount === "") {
//       delete hallTransactionData.discount;
//     }

//     console.log("Hall transaction data before sending:", hallTransactionData);

//     // Ensure at least one of the required fields is present
//     const requiredFields = [
//       "customerName",
//       "contactPhone",
//       "eventType",
//       "startTime",
//       "endTime",
//       "paymentMethod",
//       "paymentStatus",
//       "notes",
//       "halls",
//     ];
//     const hasRequiredField = requiredFields.some(
//       (key) => key in hallTransactionData && hallTransactionData[key]
//     );

//     if (!hasRequiredField) {
//       console.log("No required fields present in the update data");
//       toast.error("At least one required field must be present", {
//         duration: 5000,
//       });
//       return;
//     }

//     // Handle create or update operation
//     if (editMode) {
//       console.log("Updating transaction with ID:", initialData._id);
//       console.log(
//         "Transaction data being sent to backend:",
//         hallTransactionData
//       );
//       dispatch(
//         updateHallTransaction({
//           id: initialData._id,
//           transactionData: hallTransactionData,
//         })
//       )
//         .then((response) => {
//           if (response.payload && response.payload.success) {
//             console.log("Update confirmed.");
//             toast.success("Hall transaction updated successfully!", {
//               duration: 5000,
//             });
//             dispatch(fetchHallTransactions()); // Refresh table
//             onClose();
//             onSaveSuccess && onSaveSuccess();
//           } else {
//             console.error(
//               "Update response does not confirm success.",
//               response.payload
//             );
//             toast.error(
//               "Failed to verify update. Please check the transaction.",
//               {
//                 duration: 5000,
//               }
//             );
//           }
//         })
//         .catch((error) => {
//           console.error("Error updating hall transaction:", error);
//           toast.error(`Error updating hall transaction: ${error.message}`, {
//             duration: 5000,
//           });
//         });
//     } else {
//       // For create operation
//       dispatch(createHallTransaction(hallTransactionData))
//         .then((response) => {
//           if (response.payload && response.payload._id) {
//             console.log(
//               "Creation successful, new transaction ID:",
//               response.payload._id
//             );
//             toast.success("Hall transaction created successfully!", {
//               duration: 5000,
//             });
//             dispatch(fetchHallTransactions()); // Refresh table
//             onClose();
//             onSaveSuccess && onSaveSuccess();
//           } else {
//             console.error(
//               "Creation response does not contain new transaction data."
//             );
//             toast.error(
//               "Failed to verify creation. Please check the transaction.",
//               {
//                 duration: 5000,
//               }
//             );
//           }
//         })
//         .catch((error) => {
//           console.error("Error creating hall transaction:", error);
//           toast.error(`Error creating hall transaction: ${error.message}`, {
//             duration: 5000,
//           });
//         });
//     }
//   };

//   const handleCancel = () => {
//     onClose();
//   };

//   if (hallTypesLoading || paymentMethodsStatus === "loading") {
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

//   if (!Array.isArray(hallTypes)) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100%",
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
//               {editMode ? "Edit Hall Transaction" : "Add New Hall Transaction"}
//             </h2>
//             <IconButton onClick={handleCancel}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <TextField
//             label="Customer Name"
//             fullWidth
//             margin="normal"
//             value={formData.customerName}
//             onChange={handleChange("customerName")}
//             error={!!errors.customerName}
//             helperText={errors.customerName}
//           />
//           <TextField
//             label="Contact Phone"
//             fullWidth
//             margin="normal"
//             value={formData.contactPhone}
//             onChange={handleChange("contactPhone")}
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
//           <TextField
//             label="Start Time"
//             type="datetime-local"
//             fullWidth
//             margin="normal"
//             value={formData.startTime}
//             onChange={handleChange("startTime")}
//             error={!!errors.startTime}
//             helperText={errors.startTime}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             label="End Time"
//             type="datetime-local"
//             fullWidth
//             margin="normal"
//             value={formData.endTime}
//             onChange={handleChange("endTime")}
//             error={!!errors.endTime}
//             helperText={errors.endTime}
//             InputLabelProps={{ shrink: true }}
//           />
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
//             <InputLabel id="payment-status-label">Payment Status</InputLabel>
//             <Select
//               labelId="payment-status-label"
//               value={formData.paymentStatus}
//               onChange={handleChange("paymentStatus")}
//               label="Payment Status"
//             >
//               <MenuItem value="Pending">Pending</MenuItem>
//               <MenuItem value="Paid">Paid</MenuItem>
//               <MenuItem value="Cancelled">Cancelled</MenuItem>
//               <MenuItem value="Refund">Refund</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             label="Notes"
//             fullWidth
//             margin="normal"
//             multiline
//             rows={4}
//             value={formData.notes}
//             onChange={handleChange("notes")}
//           />
//           <TextField
//             label="Discount (%)"
//             fullWidth
//             margin="normal"
//             type="number"
//             value={formData.discount}
//             onChange={handleChange("discount")}
//             InputProps={{
//               readOnly: true, // Disable direct input
//               endAdornment: (
//                 <React.Fragment>
//                   <IconButton
//                     size="small"
//                     onClick={() => handleDiscountChange(1)}
//                   >
//                     <ArrowUpwardIcon />
//                   </IconButton>
//                   <IconButton
//                     size="small"
//                     onClick={() => handleDiscountChange(-1)}
//                   >
//                     <ArrowDownwardIcon />
//                   </IconButton>
//                 </React.Fragment>
//               ),
//               inputProps: {
//                 min: 0,
//                 max: 100,
//                 step: 1,
//               },
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
//           <h3>Hall Services</h3>
//           <TableContainer component={Paper}>
//             <Table size="small" aria-label="halls table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Hall Name</TableCell>
//                   <TableCell align="right">Quantity</TableCell>
//                   <TableCell align="right">Price</TableCell>
//                   <TableCell align="right">Total</TableCell>
//                   <TableCell align="right">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {hallsList.map((hall, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <FormControl fullWidth sx={{ minWidth: 200 }}>
//                         <InputLabel id={`hall-name-label-${index}`}>
//                           Hall Name
//                         </InputLabel>
//                         <Select
//                           labelId={`hall-name-label-${index}`}
//                           value={hall.name || ""}
//                           onChange={handleHallChange(index, "name")}
//                           label="Hall Name"
//                         >
//                           {hallTypes.map((type) => (
//                             <MenuItem key={type._id} value={type.name}>
//                               {type.name}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     </TableCell>
//                     <TableCell align="right">
//                       <TextField
//                         type="number"
//                         value={hall.qty}
//                         onChange={handleHallChange(index, "qty")}
//                       />
//                     </TableCell>
//                     <TableCell align="right">
//                       <TextField
//                         type="number"
//                         value={hall.price}
//                         InputProps={{
//                           readOnly: true,
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell align="right">{hall.total.toFixed(2)}</TableCell>
//                     <TableCell align="right">
//                       <IconButton onClick={() => removeHall(index)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Button startIcon={<AddIcon />} onClick={addHall} sx={{ mb: 2 }}>
//             Add Hall Service
//           </Button>

//           {hallsList.length === 0 && (
//             <Box sx={{ color: "red", mt: 1 }}>
//               Please add at least one hall service.
//             </Box>
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
//               disabled={hallTypesLoading || paymentMethodsStatus === "loading"}
//             >
//               {hallTypesLoading || paymentMethodsStatus === "loading" ? (
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

// export default AddNewHallDrawer;

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
  createHallTransaction,
  updateHallTransaction,
  fetchHallTransactions,
} from "../../redux/slices/hallSlice";
import { fetchHallTypes } from "../../redux/slices/hallTypesSlice";
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

const AddNewHallDrawer = ({
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
  const { list: hallTypes, status: hallTypesStatus } = useSelector(
    (state) => state.hallTypes
  );

  useEffect(() => {
    if (paymentMethodsStatus === "idle") {
      dispatch(fetchPaymentMethods());
    }
    if (!hallTypes || hallTypes.length === 0) {
      dispatch(fetchHallTypes()); // Fetch hall types for the dropdown
    }
  }, [dispatch, paymentMethodsStatus, hallTypes]);

  // State for form data
  const [formData, setFormData] = useState({
    customerName: "",
    contactPhone: "",
    eventType: "conference",
    startTime: "",
    endTime: "",
    paymentMethod: "",
    paymentStatus: "Pending",
    notes: "",
    discount: 0,
    totalAmount: 0,
  });

  // State for halls table
  const [hallsList, setHallsList] = useState([]);

  useEffect(() => {
    if (editMode) {
      const {
        _id,
        createdAt,
        updatedAt,
        __v,
        isVoided,
        transactionId,
        startTime,
        endTime,
        ...restOfInitialData
      } = initialData;

      setFormData({
        ...restOfInitialData,
        startTime: startTime
          ? new Date(startTime).toISOString().slice(0, 16)
          : "",
        endTime: endTime ? new Date(endTime).toISOString().slice(0, 16) : "",
        paymentMethod: initialData.paymentMethod._id,
        halls: initialData.halls || [],
      });
      setHallsList(
        (initialData.halls || []).map(({ _id, name, qty, price }) => ({
          name,
          qty: qty !== undefined ? qty : 1, // Only default if undefined
          price: price !== undefined ? price : 0,
          total: (qty || 1) * (price || 0),
        }))
      );
    } else {
      setFormData({
        halls: [],
        customerName: "",
        contactPhone: "",
        eventType: "conference",
        startTime: "",
        endTime: "",
        paymentMethod: "",
        paymentStatus: "Pending",
        notes: "",
        discount: 0,
        totalAmount: 0,
      });
      setHallsList([]);
    }
  }, [editMode, initialData, paymentMethods]);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "halls":
        if (hallsList.length === 0)
          error.halls = "At least one hall service is required";
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
    validateField(field, event.target.value);
    if (field === "discount") {
      calculateTotalAmount();
    }
  };

  const handleHallChange = (index, field) => (event) => {
    setHallsList((prevHalls) => {
      const newHalls = [...prevHalls];
      if (field === "name") {
        const selectedHall = hallTypes.find(
          (hall) => hall.name === event.target.value
        );
        if (selectedHall) {
          newHalls[index] = {
            ...newHalls[index],
            hallId: selectedHall._id, // Include hallId
            name: event.target.value,
            price: selectedHall.price,
            total: selectedHall.price * newHalls[index].qty,
          };
        }
      } else if (field === "qty") {
        newHalls[index].qty = event.target.value;
        newHalls[index].total = newHalls[index].price * event.target.value;
      }
      calculateTotalAmount(newHalls);
      return newHalls;
    });
  };

  const addHall = () => {
    setHallsList([...hallsList, { name: "", qty: 1, price: 0, total: 0 }]);
    calculateTotalAmount([...hallsList, { total: 0 }]);
  };

  const removeHall = (index) => {
    const newHalls = [...hallsList];
    newHalls.splice(index, 1);
    setHallsList(newHalls);
    calculateTotalAmount(newHalls);
  };

  const calculateTotalAmount = (halls = hallsList) => {
    const subTotal = halls.reduce((sum, hall) => sum + hall.total, 0);
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
    validateField("halls", hallsList);

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

    // Ensure hallsList is an array and not empty
    if (!Array.isArray(hallsList) || hallsList.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        halls: "At least one hall must be selected.",
      }));
      return;
    }

    const hallTransactionData = {
      ...formData,
      halls: hallsList.map((hall) => ({
        hallId: hall.hallId,
        name: hall.name,
        qty: Number(hall.qty),
        price: Number(hall.price),
      })),
    };

    // Explicitly exclude isVoided, transactionId, staffInvolved, and totalAmount from hallTransactionData if it's not needed
    const {
      isVoided,
      transactionId,
      staffInvolved,
      totalAmount,
      date,
      ...dataToSend
    } = hallTransactionData;

    if (editMode) {
      dispatch(
        updateHallTransaction({
          id: initialData._id,
          transactionData: dataToSend,
        })
      )
        .then(() => {
          toast.success("Hall transaction updated successfully!", {
            duration: 5000,
          });
          dispatch(fetchHallTransactions()).then(() => onClose());
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(`Error updating hall transaction: ${error.message}`, {
            duration: 5000,
          });
        });
    } else {
      dispatch(createHallTransaction(dataToSend))
        .then(() => {
          toast.success("Hall transaction added successfully!", {
            duration: 5000,
          });
          dispatch(fetchHallTransactions()).then(() => onClose());
          onSaveSuccess && onSaveSuccess();
        })
        .catch((error) => {
          toast.error(`Error adding hall transaction: ${error.message}`, {
            duration: 5000,
          });
        });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = () => {
    return (
      formData.customerName &&
      formData.contactPhone &&
      formData.startTime &&
      formData.endTime &&
      formData.paymentMethod &&
      hallsList.length > 0 &&
      !Object.values(errors).some((error) => error)
    );
  };

  if (hallTypesStatus === "loading" || paymentMethodsStatus === "loading") {
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
            <h2>
              {editMode ? "Edit Hall Transaction" : "Add New Hall Transaction"}
            </h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Customer Name"
            fullWidth
            margin="normal"
            value={formData.customerName}
            onChange={handleChange("customerName")}
            error={!!errors.customerName}
            helperText={errors.customerName}
            disabled={isDisabled}
          />
          <TextField
            label="Contact Phone"
            fullWidth
            margin="normal"
            value={formData.contactPhone}
            onChange={handleChange("contactPhone")}
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
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.startTime}
            onChange={handleChange("startTime")}
            error={!!errors.startTime}
            helperText={errors.startTime}
            InputLabelProps={{ shrink: true }}
            disabled={isDisabled}
          />
          <TextField
            label="End Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.endTime}
            onChange={handleChange("endTime")}
            error={!!errors.endTime}
            helperText={errors.endTime}
            InputLabelProps={{ shrink: true }}
            disabled={isDisabled}
          />
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
            <InputLabel id="payment-status-label">Payment Status</InputLabel>
            <Select
              labelId="payment-status-label"
              value={formData.paymentStatus}
              onChange={handleChange("paymentStatus")}
              label="Payment Status"
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
            value={formData.notes}
            onChange={handleChange("notes")}
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
          <h3>Hall Services</h3>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="halls table">
              <TableHead>
                <TableRow>
                  <TableCell>Hall Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hallsList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl fullWidth sx={{ minWidth: 200 }}>
                        <InputLabel id={`hall-name-label-${index}`}>
                          Hall Name
                        </InputLabel>
                        <Select
                          labelId={`hall-name-label-${index}`}
                          value={row.name}
                          onChange={handleHallChange(index, "name")}
                          label="Hall Name"
                          disabled={isDisabled}
                        >
                          {hallTypes.map((type) => (
                            <MenuItem key={type._id} value={type.name}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={row.qty}
                        onChange={handleHallChange(index, "qty")}
                        disabled={isDisabled}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        value={row.price}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">{row.total.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => removeHall(index)}
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
            onClick={addHall}
            sx={{ mb: 2 }}
            disabled={editMode || isDisabled}
          >
            Add Hall Service
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
                hallTypesStatus === "loading" ||
                paymentMethodsStatus === "loading" ||
                paymentMethods.length === 0 ||
                isDisabled ||
                !isFormValid()
              }
            >
              {hallTypesStatus === "loading" ||
              paymentMethodsStatus === "loading" ? (
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

export default AddNewHallDrawer;
