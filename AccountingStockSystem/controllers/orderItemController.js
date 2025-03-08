const {
  createOrderItemSchema,
  updateOrderItemSchema,
} = require("../middlewares/validator"); // Import the schema
const Seminar = require("../models/seminarsModel");
const OrderItem = require("../models/orderItemModel"); // Assuming this is your file name
const mongoose = require("mongoose");

exports.getAllOrderItems = async (req, res) => {
  try {
    // Fetch all order items from the database
    const orderItems = await OrderItem.find();

    // Check if there are any order items
    if (orderItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No order items found",
      });
    }

    // Return the order items
    return res.status(200).json({
      success: true,
      data: orderItems,
    });
  } catch (error) {
    console.error("Error fetching order items:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// exports.createOrderItem = async (req, res) => {
//   const { error } = createOrderItemSchema.validate(req.body);

//   if (error) {
//     return res.status(400).json({
//       success: false,
//       message: "Validation error",
//       details: error.details,
//     });
//   }

//   try {
//     const { itemName, unitPrice } = req.body;
//     const newOrderItem = new OrderItem({
//       itemName,
//       unitPrice,
//     });

//     // Check if itemName already exists in database
//     const existingItem = await OrderItem.findOne({ itemName: itemName });
//     if (existingItem) {
//       // Decide how to handle this; you might want to throw an error or return a specific message
//       return res.status(400).json({
//         success: false,
//         message: "An item with this name already exists.",
//       });
//     }

//     await newOrderItem.save();

//     res.status(201).json({
//       success: true,
//       message: "Order item created successfully",
//       data: newOrderItem,
//     });
//   } catch (error) {
//     console.error("Error creating order item:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error processing order items",
//     });
//   }
// };

// Controller for updating an order item
exports.createOrderItem = async (req, res) => {
  // Validate request body
  const { error } = createOrderItemSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details,
    });
  }

  try {
    const { itemName, unitPrice } = req.body;

    // Check for existing item (Optional, but good practice)
    const existingItem = await OrderItem.findOne({ itemName });
    if (existingItem) {
      return res.status(409).json({
        // 409 Conflict is a better status code
        success: false,
        message: "An item with this name already exists.",
      });
    }

    // Create a new OrderItem instance
    const newOrderItem = new OrderItem({
      itemName,
      unitPrice,
      // myCreatedAt: new Date(), // Not needed if you have default: Date.now in schema
    });

    // Save the new order item to the database
    const savedOrderItem = await newOrderItem.save();

    res.status(201).json({
      success: true,
      message: "Order item created successfully",
      data: savedOrderItem, // This will include myCreatedAt
    });
  } catch (error) {
    console.error("Error creating order item:", error);
    // More specific error handling (check for duplicate key error)
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(409).json({
        // 409 Conflict
        success: false,
        message: "An item with this name already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error processing order items",
    });
  }
};

exports.updateOrderItem = async (req, res) => {
  const { error } = updateOrderItemSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details,
    });
  }

  try {
    const { orderItemId } = req.params;
    const { itemName, qty, unitPrice, totalAmount } = req.body;

    // Find the order item by ID and update it
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(
      orderItemId,
      { itemName, qty, unitPrice, totalAmount },
      { new: true, runValidators: true } // runValidators ensures schema validation
    );

    // If order item not found
    if (!updatedOrderItem) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order item updated successfully",
      data: updatedOrderItem,
    });
  } catch (error) {
    console.error("Error updating order item:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order item",
    });
  }
};

// Controller for deleting an order item
exports.deleteOrderItem = async (req, res) => {
  const { orderItemId } = req.params;
  console.log("Received ID:", orderItemId);

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
    console.error("ID validation failed:", orderItemId);
    return res.status(400).json({
      success: false,
      message: "Invalid order item ID.",
    });
  }

  try {
    // Find and delete the order item by ID
    const deletedOrderItem = await OrderItem.findByIdAndDelete(orderItemId);

    // If order item is not found
    if (!deletedOrderItem) {
      return res.status(404).json({
        success: false,
        message: "Order item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order item deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting order item:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting order item.",
    });
  }
};
