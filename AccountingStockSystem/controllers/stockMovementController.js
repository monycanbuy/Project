const StockMovement = require("../models/stockMovementModel");
const {
  createStockMovementSchema,
  updateStockMovementSchema,
} = require("../middlewares/validator");

// Get all stock movements
exports.getStockMovements = async (req, res) => {
  try {
    const stockMovements = await StockMovement.find()
      .populate("inventory", "name")
      .populate("fromLocation", "name")
      .populate("toLocation", "name")
      .populate("staff", "fullName");

    res.status(200).json({ success: true, data: stockMovements });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stock movements",
      error: error.message,
    });
  }
};

// Create a new stock movement
exports.createStockMovement = async (req, res) => {
  try {
    const { error, value } = createStockMovementSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.message });
    }

    const newStockMovement = await StockMovement.create({
      ...value,
      staff: req.user.userId, // Associate the stock movement with the logged-in staff member
    });

    res.status(201).json({
      success: true,
      message: "Stock movement created successfully",
      data: newStockMovement,
    });
  } catch (error) {
    console.error("Error creating stock movement:", error);
    res.status(500).json({
      success: false,
      message: "Error creating stock movement",
      error: error.message,
    });
  }
};

// Update a stock movement
exports.updateStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateStockMovementSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.message });
    }

    const updatedStockMovement = await StockMovement.findByIdAndUpdate(
      id,
      value,
      { new: true }
    );
    if (!updatedStockMovement) {
      return res
        .status(404)
        .json({ success: false, message: "Stock movement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Stock movement updated successfully",
      data: updatedStockMovement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating stock movement",
      error: error.message,
    });
  }
};

// Delete a stock movement
exports.deleteStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStockMovement = await StockMovement.findByIdAndDelete(id);
    if (!deletedStockMovement) {
      return res
        .status(404)
        .json({ success: false, message: "Stock movement not found" });
    }

    res.status(200).json({
      success: true,
      message: "Stock movement deleted successfully",
      data: deletedStockMovement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting stock movement",
      error: error.message,
    });
  }
};
