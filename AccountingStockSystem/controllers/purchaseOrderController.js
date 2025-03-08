const PurchaseOrder = require("../models/purchaseOrderModel");
const { updatePurchaseOrderSchema } = require("../middlewares/validator");

// Get all purchase orders
exports.getPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find()
      .populate("supplier", "contactPerson")
      .populate("items.inventory", "name");
    res.status(200).json({ success: true, data: purchaseOrders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching purchase orders",
      error: error.message,
    });
  }
};

// Update a purchase order
// exports.updatePurchaseOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error, value } = updatePurchaseOrderSchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details.message });
//     }

//     const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
//       id,
//       value,
//       { new: true }
//     );
//     if (!updatedPurchaseOrder) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Purchase order not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Purchase order updated successfully",
//       data: updatedPurchaseOrder,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating purchase order",
//       error: error.message,
//     });
//   }
// };
exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate with abortEarly: false
    const { error, value } = updatePurchaseOrderSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessages,
      });
    }

    // 2. Find the existing purchase order
    const existingPurchaseOrder = await PurchaseOrder.findById(id);

    if (!existingPurchaseOrder) {
      return res.status(404).json({
        success: false,
        message: "Purchase order not found",
      });
    }

    // 3. Destructure *all* possible fields from the validated value
    const { supplier, orderDate, expectedDelivery, items, status } = value;

    // 4. Build the updateData object *conditionally*
    const updateData = {};
    if (supplier !== undefined) updateData.supplier = supplier;
    if (orderDate !== undefined) updateData.orderDate = orderDate;
    if (expectedDelivery !== undefined)
      updateData.expectedDelivery = expectedDelivery;
    if (items !== undefined) updateData.items = items;
    if (status !== undefined) updateData.status = status;

    // 5. Update the document, populating the related fields for the response
    const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("supplier", "contactPerson") // Populate supplier
      .populate("items.inventory", "name"); // Populate inventory

    if (!updatedPurchaseOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Purchase order updated successfully",
      data: updatedPurchaseOrder,
    });
  } catch (error) {
    console.error("Error updating purchase order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating purchase order: " + error.message,
    });
  }
};

//... other imports and methods

// Void a purchase order
exports.voidPurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const voidedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      id,
      { $set: { status: "Cancelled", voided: true, voidedAt: new Date() } }, // Set status to Cancelled and add voided details
      { new: true }
    );

    if (!voidedPurchaseOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Purchase order voided successfully",
      data: voidedPurchaseOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error voiding purchase order",
      error: error.message,
    });
  }
};
