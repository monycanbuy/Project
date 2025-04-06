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
