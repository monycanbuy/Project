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
  createUnifiedSale,
  updateUnifiedSale,
  getAllUnifiedSales,
} from "../../redux/slices/unifiedSalesSlice";
import { fetchPaymentMethods } from "../../redux/slices/paymentMethodsSlice";
import { fetchDishes } from "../../redux/slices/dishesSlice";
import { fetchProducts } from "../../redux/slices/productsSlice";
import { Toaster, toast } from "react-hot-toast";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0",
    boxSizing: "border-box",
  },
}));

const AddNewUnifiedSalesDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { paymentMethods, status: paymentMethodsStatus } = useSelector(
    (state) => state.paymentMethods
  );
  const { items: availableDishes, status: dishesStatus } = useSelector(
    (state) => state.dishes
  );
  const { products: availableProducts, status: productsStatus } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (paymentMethodsStatus === "idle") {
      dispatch(fetchPaymentMethods());
    }
    if (dishesStatus === "idle") {
      dispatch(fetchDishes());
    }
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, paymentMethodsStatus, dishesStatus, productsStatus]);

  // State for form data
  const [formData, setFormData] = useState({
    saleType: "",
    paymentMethod: "",
    discount: 0,
    totalAmount: 0,
  });

  // State for items table
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (editMode) {
      setFormData({
        saleType: initialData.saleType || "",
        paymentMethod: initialData.paymentMethod?._id || "",
        discount: initialData.discount || 0,
        totalAmount: initialData.totalAmount || 0,
      });
      setItems(
        (initialData.items || []).map(
          ({ item, quantity, priceAtSale, subTotal, itemType }) => ({
            item: item?._id || "",
            quantity: quantity || 1,
            priceAtSale: priceAtSale || 0,
            subTotal: subTotal || 0,
            itemType: itemType || "",
          })
        )
      );
    } else {
      setFormData({
        saleType: "",
        paymentMethod: "",
        discount: 0,
        totalAmount: 0,
      });
      setItems([]);
    }
  }, [editMode, initialData]);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "saleType":
        if (!value) error.saleType = "Sale type is required";
        break;
      case "paymentMethod":
        if (!value) error.paymentMethod = "Payment method is required";
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
    if (field === "discount") {
      calculateTotalAmount(items, event.target.value);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { item: "", quantity: 1, priceAtSale: 0, subTotal: 0, itemType: "" },
    ]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    calculateTotalAmount(newItems, formData.discount);
  };

  const handleItemChange = (index, field) => (event) => {
    const newItems = [...items];
    newItems[index][field] = event.target.value;
    if (field === "item") {
      const selectedItem =
        formData.saleType === "restaurant"
          ? availableDishes.find((i) => i._id === event.target.value)
          : availableProducts.find((i) => i._id === event.target.value);
      if (selectedItem) {
        newItems[index].priceAtSale = selectedItem.price;
        newItems[index].subTotal =
          selectedItem.price * newItems[index].quantity;
      }
    } else if (field === "quantity") {
      newItems[index].subTotal =
        newItems[index].priceAtSale * parseFloat(event.target.value) || 0;
    }
    setItems(newItems);
    calculateTotalAmount(newItems, formData.discount);
  };

  const calculateTotalAmount = (items, discount) => {
    const subTotal = items.reduce((acc, item) => acc + (item.subTotal || 0), 0);
    const discountAmount = subTotal * (discount / 100) || 0;
    const total = subTotal - discountAmount;

    setFormData((prev) => ({
      ...prev,
      totalAmount: parseFloat(total.toFixed(2)),
    }));
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    const validatedItems = items.map((item) => ({
      item: item.item,
      quantity: Number(item.quantity),
      priceAtSale: Number(item.priceAtSale),
      itemType: item.itemType,
    }));

    const {
      totalAmount,
      createdAt,
      updatedAt,
      __v,
      ...formDataWithoutExcludedFields
    } = formData;
    const saleData = {
      ...formDataWithoutExcludedFields,
      items: validatedItems,
      discount: Number(formData.discount),
      totalAmount: formData.totalAmount, // Ensure totalAmount is included
    };

    if (editMode) {
      dispatch(
        updateUnifiedSale({
          saleId: initialData._id,
          updatedSaleData: saleData,
        })
      )
        .then(() => {
          toast.success("Sale record updated successfully!", {
            duration: 5000,
          });
          dispatch(getAllUnifiedSales()); // Refresh the table data
          onClose();
        })
        .catch((error) => {
          toast.error(`Error updating sale record: ${error.message}`, {
            duration: 5000,
          });
        });
    } else {
      dispatch(createUnifiedSale(saleData))
        .then(() => {
          toast.success("Sale record added successfully!", {
            duration: 5000,
          });
          dispatch(getAllUnifiedSales()); // Refresh the table data
          onClose();
        })
        .catch((error) => {
          toast.error(`Error adding sale record: ${error.message}`, {
            duration: 5000,
          });
        });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (
    paymentMethodsStatus === "loading" ||
    dishesStatus === "loading" ||
    productsStatus === "loading"
  ) {
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

  if (
    paymentMethodsStatus === "failed" ||
    dishesStatus === "failed" ||
    productsStatus === "failed"
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Error loading payment methods or items
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
            <h2>{editMode ? "Edit Sale Record" : "Add New Sale Record"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel id="sale-type-label">Sale Type</InputLabel>
            <Select
              labelId="sale-type-label"
              value={formData.saleType}
              onChange={handleChange("saleType")}
              label="Sale Type"
              error={!!errors.saleType}
              required
            >
              <MenuItem value="restaurant">Restaurant</MenuItem>
              <MenuItem value="minimart">Minimart</MenuItem>
            </Select>
            {errors.saleType && (
              <Box sx={{ color: "red", mt: 1 }}>{errors.saleType}</Box>
            )}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={formData.paymentMethod || ""}
              onChange={handleChange("paymentMethod")}
              label="Payment Method"
              error={!!errors.paymentMethod}
              required
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
          <TextField
            label="Discount (%)"
            fullWidth
            margin="normal"
            type="number"
            value={formData.discount}
            onChange={handleChange("discount")}
          />
          <TextField
            label="Total Amount"
            fullWidth
            margin="normal"
            value={formData.totalAmount}
            disabled
          />

          {/* Conditionally render the Items section based on saleType */}
          {formData.saleType && (
            <>
              <h3>Items</h3>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="items table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price at Sale</TableCell>
                      <TableCell align="right">Sub Total</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <FormControl fullWidth sx={{ minWidth: 200 }}>
                            <InputLabel id={`item-label-${index}`}>
                              Item
                            </InputLabel>
                            <Select
                              labelId={`item-label-${index}`}
                              value={row.item}
                              onChange={handleItemChange(index, "item")}
                              label="Item"
                            >
                              {formData.saleType === "restaurant"
                                ? availableDishes.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                      {item.name}
                                    </MenuItem>
                                  ))
                                : availableProducts.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                      {item.name}
                                    </MenuItem>
                                  ))}
                            </Select>
                            {errors[`items[${index}].item`] && (
                              <Box sx={{ color: "red", mt: 1 }}>
                                {errors[`items[${index}].item`]}
                              </Box>
                            )}
                          </FormControl>
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={row.quantity}
                            onChange={handleItemChange(index, "quantity")}
                          />
                        </TableCell>
                        <TableCell align="right">{row.priceAtSale}</TableCell>
                        <TableCell align="right">{row.subTotal}</TableCell>
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
            </>
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
                paymentMethodsStatus === "loading" ||
                dishesStatus === "loading" ||
                productsStatus === "loading"
              }
            >
              {paymentMethodsStatus === "loading" ||
              dishesStatus === "loading" ||
              productsStatus === "loading" ? (
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

export default AddNewUnifiedSalesDrawer;
