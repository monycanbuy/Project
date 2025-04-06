import React, { useState, useEffect, useRef } from "react";
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
  createSalesTransaction,
  fetchSalesTransactions,
  updateSalesTransaction,
  fetchOrderItems,
} from "../redux/slices/salesTransactionSlice";
import { fetchPaymentMethods } from "../redux/slices/paymentMethodsSlice";
import { fetchDishes } from "../redux/slices/dishesSlice";
import { fetchInventories } from "../redux/slices/inventoriesSlice";
import { fetchLocations } from "../redux/slices/locationSlice";
import { Toaster, toast } from "react-hot-toast";
import PrintSlip from "../components/PrintSection/PrintSlip";
import { useReactToPrint } from "react-to-print";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "30%",
    height: "100vh",
    top: "0",
    boxSizing: "border-box",
  },
}));

const AddNewUnifiedTransactionDrawer = ({
  open,
  onClose,
  editMode = false,
  initialData = {},
  onSaveSuccess,
}) => {
  // console.log(
  //   "AddNewUnifiedTransactionDrawer rendering, open:",
  //   open,
  //   "editMode:",
  //   editMode,
  //   "initialData:",
  //   initialData
  // );
  const dispatch = useDispatch();
  const { paymentMethods, status: paymentMethodsStatus } = useSelector(
    (state) => state.paymentMethods || {}
  );
  const { locations, status: locationsStatus } = useSelector(
    (state) => state.locations || {}
  );
  const { items: availableDishes, status: dishesStatus } = useSelector(
    (state) => state.dishes || {}
  );
  const { inventories: availableInventory, status: inventoryStatus } =
    useSelector((state) => state.inventories || {});
  const { orderItems, orderItemsStatus } = useSelector(
    (state) => state.salesTransactions || {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const printRef = useRef();
  const [slipData, setSlipData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleReactToPrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint = () => {
    if (printRef.current && slipData) {
      handleReactToPrint();
    } else {
      console.error("Cannot print: either ref or slip data is missing");
    }
  };

  useEffect(() => {
    //console.log("Fetching dependencies...");
    if (paymentMethodsStatus === "idle") dispatch(fetchPaymentMethods());
    if (locationsStatus === "idle") dispatch(fetchLocations());
    if (dishesStatus === "idle") dispatch(fetchDishes());
    if (inventoryStatus === "idle") dispatch(fetchInventories());
    if (orderItemsStatus === "idle") dispatch(fetchOrderItems());
  }, [
    dispatch,
    paymentMethodsStatus,
    dishesStatus,
    inventoryStatus,
    locationsStatus,
    orderItemsStatus,
  ]);

  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().slice(0, 16), // Default to now in ISO format
    saleType: "",
    paymentMethod: "",
    totalAmount: 0,
    discount: 0,
    location: "",
  });

  const [items, setItems] = useState([]);
  const [inventoryChanges, setInventoryChanges] = useState([]);

  useEffect(() => {
    // console.log(
    //   "useEffect triggered, editMode:",
    //   editMode,
    //   "initialData:",
    //   initialData
    // );
    if (editMode && initialData && Object.keys(initialData).length > 0) {
      setFormData({
        transactionDate: initialData.transactionDate
          ? new Date(initialData.transactionDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        saleType: initialData.saleType || "",
        paymentMethod: initialData.paymentMethod?._id || "",
        location: initialData.location?._id || "",
        totalAmount: initialData.totalAmount || 0,
        discount: initialData.discount || 0,
      });

      const allItems = [
        ...(initialData.items || []).map((item) => ({
          ...item,
          itemType: item.itemType,
        })),
      ];

      setItems(
        allItems.map(({ item, quantity, priceAtSale, subTotal, itemType }) => ({
          item: item?._id || item || "",
          quantity: Number(quantity) || 1,
          priceAtSale: Number(priceAtSale) || 0,
          subTotal: Number(subTotal) || 0,
          itemType: itemType,
        }))
      );

      setInventoryChanges(
        (initialData.inventoryChanges || []).map((change) => ({
          inventoryId: change.inventoryId?._id || change.inventoryId || "",
          quantityChange: Number(change.quantityChange) || 0,
        }))
      );

      setSlipData({
        formData: {
          transactionDate: initialData.transactionDate
            ? new Date(initialData.transactionDate).toLocaleString("en-NG", {
                timeZone: "Africa/Lagos",
              })
            : "N/A",
          saleType: initialData.saleType || "",
          paymentMethod: initialData.paymentMethod?.name || "Unknown",
          location: initialData.location?.name || "Unknown",
          totalAmount: initialData.totalAmount || 0,
          discount: initialData.discount || 0,
        },
        items: allItems.map(
          ({ item, itemType, quantity, priceAtSale, subTotal }) => {
            const itemDetails =
              itemType === "Dish"
                ? availableDishes.find((d) => d._id === item)
                : itemType === "Inventory"
                ? availableInventory.find((i) => i._id === item)
                : orderItems.find((o) => o._id === item);
            return {
              item:
                itemDetails?.name || itemDetails?.itemName || "Unknown Item",
              quantity: Number(quantity) || 1,
              priceAtSale: Number(priceAtSale) || 0,
              subTotal: subTotal,
            };
          }
        ),
      });
    } else {
      setFormData({
        transactionDate: new Date().toISOString().slice(0, 16),
        saleType: "",
        paymentMethod: "",
        totalAmount: 0,
        discount: 0,
        location: "",
      });
      setItems([]);
      setInventoryChanges([]);
      setSlipData(null);
    }
  }, [editMode, initialData, availableDishes, availableInventory, orderItems]);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "transactionDate":
        if (!value) error.transactionDate = "Transaction date is required";
        else if (new Date(value) < new Date("2025-01-01"))
          error.transactionDate = "Date cannot be before January 1, 2025";
        break;
      case "saleType":
        if (!value) error.saleType = "Sale type is required";
        break;
      case "paymentMethod":
        if (!value) error.paymentMethod = "Payment method is required";
        break;
      case "location":
        if (!value) error.location = "Location is required";
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
      value = Math.min(100, Math.max(0, Number(value) || 0));
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
    if (field === "saleType") {
      const newItemType =
        value === "restaurant"
          ? "Dish"
          : value === "minimart"
          ? "Inventory"
          : "OrderItem";
      setItems(
        items.map((item) => ({
          ...item,
          itemType: newItemType,
          item: "",
          priceAtSale: 0,
          subTotal: 0,
        }))
      );
      setInventoryChanges([]);
    } else if (field === "discount") {
      calculateTotalAmount(items);
    }
  };

  const addItem = () => {
    if (!editMode) {
      const newItem = {
        item: "",
        quantity: 1,
        priceAtSale: 0,
        subTotal: 0,
        itemType:
          formData.saleType === "restaurant"
            ? "Dish"
            : formData.saleType === "minimart"
            ? "Inventory"
            : "OrderItem",
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (index) => {
    if (!editMode) {
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
      let selectedItem;
      if (formData.saleType === "restaurant") {
        selectedItem = availableDishes.find(
          (i) => i._id === event.target.value
        );
        newItems[index].priceAtSale = selectedItem?.price || 0;
      } else if (formData.saleType === "minimart") {
        selectedItem = availableInventory.find(
          (i) => i._id === event.target.value
        );
        newItems[index].priceAtSale = selectedItem?.sellingPrice || 0;
      } else if (formData.saleType === "kabasa") {
        selectedItem = orderItems.find((i) => i._id === event.target.value);
        newItems[index].priceAtSale = selectedItem?.unitPrice || 0;
      }
      newItems[index].subTotal =
        newItems[index].priceAtSale * newItems[index].quantity;
      newItems[index].itemType =
        formData.saleType === "restaurant"
          ? "Dish"
          : formData.saleType === "minimart"
          ? "Inventory"
          : "OrderItem";
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

      setFormData((prev) => ({
        ...prev,
        totalAmount: totalAfterDiscount,
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

    if (!items || !Array.isArray(items) || items.length === 0) {
      toast.error("Please add at least one item to the transaction.", {
        duration: 5000,
      });
      return;
    }

    setIsSaving(true);

    const transactionData = {
      transactionDate: new Date(formData.transactionDate).toISOString(), // Send as ISO string
      ...formData,
      items: items.map((item) => ({
        item: item.item,
        itemType: item.itemType,
        quantity: Number(item.quantity),
        priceAtSale: Number(item.priceAtSale),
      })),
      inventoryChanges: items
        .filter((item) => item.itemType === "Inventory")
        .map((item) => ({
          inventoryId: item.item,
          quantityChange: -Number(item.quantity),
        })),
      discount: Number(formData.discount),
      location: formData.location,
    };

    const action =
      editMode && initialData._id
        ? updateSalesTransaction({
            transactionId: initialData._id,
            saleData: transactionData,
          })
        : createSalesTransaction(transactionData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          editMode
            ? "Transaction updated successfully!"
            : "Transaction added successfully!",
          { duration: 5000 }
        );
        setSlipData({
          formData: {
            transactionDate: new Date(formData.transactionDate).toLocaleString(
              "en-NG",
              { timeZone: "Africa/Lagos" }
            ),
            saleType: formData.saleType,
            paymentMethod:
              paymentMethods.find((p) => p._id === formData.paymentMethod)
                ?.name || "Unknown",
            location:
              locations.find((l) => l._id === formData.location)?.name ||
              "Unknown",
            totalAmount: formData.totalAmount,
            discount: formData.discount,
          },
          items: items.map((item) => ({
            item:
              item.itemType === "Dish"
                ? availableDishes.find((d) => d._id === item.item)?.name
                : item.itemType === "Inventory"
                ? availableInventory.find((i) => i._id === item.item)?.name
                : orderItems.find((o) => o._id === item.item)?.itemName ||
                  "Unknown Item",
            quantity: item.quantity,
            priceAtSale: item.priceAtSale,
            subTotal: item.subTotal,
          })),
        });
        onClose();
        onSaveSuccess && onSaveSuccess();
      })
      .catch((error) => {
        console.error("API call error:", error);
        toast.error(
          `Error ${editMode ? "updating" : "adding"} transaction: ${
            error.message || "Unknown error"
          }`,
          { duration: 5000 }
        );
      })
      .finally(() => {
        setIsSaving(false);
        dispatch(fetchSalesTransactions());
      });
  };

  const handleCancel = () => {
    //console.log("Cancel clicked, closing drawer");
    onClose();
  };

  if (
    paymentMethodsStatus === "loading" ||
    dishesStatus === "loading" ||
    inventoryStatus === "loading" ||
    orderItemsStatus === "loading"
  ) {
    //console.log("Loading state detected");
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

  //console.log("Rendering drawer content, open:", open);

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
            <h2>{editMode ? "Edit Transaction" : "Add New Transaction"}</h2>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Transaction Date"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.transactionDate}
            onChange={handleChange("transactionDate")}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: "2025-01-01T00:00" }} // Restrict to Jan 1, 2025
            error={!!errors.transactionDate}
            helperText={errors.transactionDate}
            required
          />

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
              <MenuItem value="kabasa">Kabasa</MenuItem>
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
              {paymentMethods?.map((method) => (
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
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              value={formData.location || ""}
              onChange={handleChange("location")}
              label="Location"
              error={!!errors.location}
              required
            >
              {locations?.map((loc) => (
                <MenuItem key={loc._id} value={loc._id}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
            {errors.location && (
              <Box sx={{ color: "red", mt: 1 }}>{errors.location}</Box>
            )}
          </FormControl>

          <TextField
            label="Total Amount Before Discount"
            fullWidth
            margin="normal"
            value={new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 2,
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
            }).format(formData.totalAmount)}
            disabled
          />

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
                                ? availableDishes?.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                      {item.name}
                                    </MenuItem>
                                  ))
                                : formData.saleType === "minimart"
                                ? availableInventory?.map((item) => (
                                    <MenuItem
                                      key={item._id}
                                      value={item._id}
                                      disabled={item.stockQuantity <= 0}
                                      sx={
                                        item.stockQuantity <= 0
                                          ? {
                                              textDecoration: "line-through",
                                              color: "grey",
                                            }
                                          : {}
                                      }
                                    >
                                      {item.name}{" "}
                                      {item.stockQuantity <= 0
                                        ? "(Out of Stock)"
                                        : ""}
                                    </MenuItem>
                                  ))
                                : orderItems?.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                      {item.itemName}
                                    </MenuItem>
                                  ))}
                            </Select>
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
              onMouseEnter={() => setShowPreview(true)}
              onMouseLeave={() => setShowPreview(false)}
              onClick={handlePrint}
              sx={{
                width: "120px",
                borderRadius: "12px",
                backgroundColor: "#fe6c00",
                color: "#fcfcfc",
                "&:hover": { backgroundColor: "#ffc397" },
              }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ width: "120px", borderRadius: "12px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={
                isSaving ||
                paymentMethodsStatus === "loading" ||
                dishesStatus === "loading" ||
                inventoryStatus === "loading" ||
                orderItemsStatus === "loading"
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
          {showPreview && slipData && (
            <Box
              sx={{
                position: "absolute",
                bottom: 50,
                right: 50,
                zIndex: 1000,
                maxHeight: "300px",
                maxWidth: "200px",
                overflowY: "auto",
                border: "1px solid black",
                backgroundColor: "white",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <PrintSlip ref={printRef} {...slipData} />
            </Box>
          )}
        </Box>
      </StyledDrawer>
      <Toaster />
      {slipData && (
        <PrintSlip ref={printRef} style={{ display: "none" }} {...slipData} />
      )}
    </>
  );
};

export default AddNewUnifiedTransactionDrawer;
