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
  createAnotherUnifiedSale,
  fetchAnotherUnifiedSales,
  updateAnotherUnifiedSale,
} from "../../redux/slices/salesUnifiedSlice";
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

const AddNewSalesUnifiedDrawer = ({
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
  const { items: availableDishes, status: dishesStatus } = useSelector(
    (state) => state.dishes
  );
  const { products: availableProducts, status: productsStatus } = useSelector(
    (state) => state.products
  );
  const [isSaving, setIsSaving] = useState(false);

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
  }, [
    dispatch,
    paymentMethodsStatus,
    dishesStatus,
    productsStatus,
    editMode,
    initialData,
  ]);

  const [formData, setFormData] = useState({
    saleType: "",
    paymentMethod: "",
    totalAmount: 0,
    discount: 0,
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (editMode && initialData) {
      // console.log("Initial Data for edit:", initialData);
      // console.log("Initial Discount:", initialData.discount);
      // console.log("Initial Total Amount:", initialData.totalAmount);
      setFormData({
        saleType: initialData.saleType || "",
        paymentMethod: initialData.paymentMethod?._id || "",
        totalAmount: initialData.totalAmount || 0,
        discount: initialData.discount || 0,
      });

      const allItems = [
        ...(initialData.dishItems || []).map((item) => ({
          ...item,
          itemType: "Dish",
        })),
        ...(initialData.productItems || []).map((item) => ({
          ...item,
          itemType: "Product",
        })),
      ];

      setItems(
        allItems.map(({ item, quantity, priceAtSale, subTotal, itemType }) => ({
          item: item?._id || item || "",
          quantity: Number(quantity) || 1,
          priceAtSale: Number(priceAtSale) || 0,
          subTotal: Number(subTotal) || 0,
          itemType:
            itemType ||
            (initialData.saleType === "restaurant" ? "Dish" : "Product"),
        }))
      );
    } else {
      setFormData({
        saleType: "",
        paymentMethod: "",
        totalAmount: 0,
        discount: 0,
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
      case "totalAmount":
        if (!value || value <= 0)
          error.totalAmount = "Total amount must be positive";
        break;
      case "discount":
        if (value < 0 || value > 100) {
          error.discount = "Discount must be between 0 and 100%";
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
    let value = event.target.value;
    if (field === "discount") {
      // Ensure discount is a number between 0 and 100
      value = Math.min(100, Math.max(0, Number(value) || 0));
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
    if (field === "saleType") {
      setItems(
        items.filter(
          (item) =>
            item.itemType === (value === "restaurant" ? "Dish" : "Product")
        )
      );
    } else if (field === "discount") {
      calculateTotalAmount(items); // Recalculate total amount when discount changes
    }
  };

  const addItem = () => {
    if (!editMode) {
      // Only allow adding items if not in edit mode
      const newItem = {
        item: "",
        quantity: 1,
        priceAtSale: 0,
        subTotal: 0,
        itemType: formData.saleType === "restaurant" ? "Dish" : "Product",
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (index) => {
    if (!editMode) {
      // Only allow removing items if not in edit mode
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
      calculateTotalAmount(newItems);
    }
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
        newItems[index].itemType =
          formData.saleType === "restaurant" ? "Dish" : "Product";
      }
    } else if (field === "quantity") {
      newItems[index].subTotal =
        newItems[index].priceAtSale * parseFloat(event.target.value) || 0;
    }
    setItems(newItems);
    calculateTotalAmount(newItems);
  };

  const calculateTotalAmount = (items) => {
    try {
      const totalBeforeDiscount = items.reduce(
        (acc, item) => acc + (item.subTotal || 0),
        0
      );
      const discountPercentage = Number(formData.discount) || 0;

      if (
        isNaN(discountPercentage) ||
        discountPercentage < 0 ||
        discountPercentage > 100
      ) {
        throw new Error("Invalid discount percentage");
      }

      const discountAmount = totalBeforeDiscount * (discountPercentage / 100);
      const totalAfterDiscount = Number(
        (totalBeforeDiscount - discountAmount).toFixed(2)
      );
      //const totalAfterDiscount = totalBeforeDiscount - discountAmount;

      setFormData((prev) => ({
        ...prev,
        totalAmount: parseFloat(totalAfterDiscount.toFixed(2)),
      }));
    } catch (error) {
      console.error("Error calculating total amount:", error.message);
      setFormData((prev) => ({
        ...prev,
        totalAmount: "Error",
      }));
      toast.error(`Error calculating total amount: ${error.message}`, {
        duration: 5000,
      });
    }
  };

  const handleSave = () => {
    Object.keys(formData).forEach((field) =>
      validateField(field, formData[field])
    );

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    // Check if items exists before mapping
    if (!items || !Array.isArray(items)) {
      console.error("Items are not defined or not an array:", items);
      toast.error("No items to process", {
        duration: 5000,
      });
      return;
    }

    const dishItems = items.filter((item) => item.itemType === "Dish");
    const productItems = items.filter((item) => item.itemType === "Product");

    if (dishItems.length === 0 && productItems.length === 0) {
      toast.error("Please ensure there are items in the sale.", {
        duration: 5000,
      });
      return;
    }
    setIsSaving(true);

    const saleData = {
      ...formData,
      dishItems: dishItems.map((item) => ({
        item: item.item,
        quantity: Number(item.quantity),
        priceAtSale: Number(item.priceAtSale),
        subTotal: Number(item.subTotal),
      })),
      productItems: productItems.map((item) => ({
        item: item.item,
        quantity: Number(item.quantity),
        priceAtSale: Number(item.priceAtSale),
        subTotal: Number(item.subTotal),
      })),
      discount: Number(formData.discount),
    };
    //console.log("Sale Data Before Dispatch:", saleData);

    const action =
      editMode && initialData._id
        ? updateAnotherUnifiedSale({ saleId: initialData._id, saleData })
        : createAnotherUnifiedSale(saleData);

    dispatch(action)
      .then(() => {
        toast.success(
          editMode
            ? "Sale record updated successfully!"
            : "Sale record added successfully!",
          {
            duration: 5000,
          }
        );
        // Optimistic update: Close drawer and reset state
        onClose();
        onSaveSuccess && onSaveSuccess();
      })
      .catch((error) => {
        toast.error(
          `Error ${editMode ? "updating" : "adding"} sale record: ${
            error.message
          }`,
          {
            duration: 5000,
          }
        );
        // If there's an error, don't close the drawer, let user try again
      })
      .finally(() => {
        setIsSaving(false);
        // Refresh sales list after operation, but don't wait for it to complete before closing drawer
        dispatch(fetchAnotherUnifiedSales());
      });
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
            label="Total Amount Before Discount"
            fullWidth
            margin="normal"
            value={new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 2, // Ensures two decimal places are always shown
            }).format(
              items.reduce((acc, item) => acc + (item.subTotal || 0), 0)
            )}
            disabled
          />
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
            value={new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(formData.totalAmount.toFixed(2))}
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
            {/* <Button
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
            </Button> */}
            <Button
              variant="contained"
              disabled={
                isSaving ||
                paymentMethodsStatus === "loading" ||
                dishesStatus === "loading" ||
                productsStatus === "loading"
              }
              onClick={handleSave}
              sx={{
                width: "120px",
                borderRadius: "12px",
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
            >
              {isSaving ? (
                <CircularProgress size={24} style={{ color: "#fe6c00" }} />
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

export default AddNewSalesUnifiedDrawer;
