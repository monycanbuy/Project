// models/inventoryAdjustmentModel.js
// const mongoose = require("mongoose");

// module.exports = mongoose.model(
//   "InventoryAdjustment",
//   inventoryAdjustmentSchema
// );

// models/inventoryAdjustmentModel.js
const mongoose = require("mongoose");

const inventoryAdjustmentSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    type: {
      type: String,
      enum: ["Issue", "Return", "Adjustment"],
      required: true,
    },
    adjustmentReason: {
      type: String,
      enum: ["Damage", "Theft", "Expiry", "Error", "Other"],
      required: true,
    },
    changeInQuantity: {
      type: Number,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    adjustmentCost: {
      type: Number,
      required: true,
      default: 0,
    },
    reason: {
      type: String,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceType",
      default: null,
    },
    referenceType: {
      type: String,
      enum: [
        "SaleTransaction",
        "Laundry",
        "HallTransaction",
        "FrontOfficeSale",
        "Seminar",
        null,
      ], // Removed "Kabasa"
      default: null,
    },
    batchNumber: {
      type: String,
      default: null,
    },
    adjustmentLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InventoryAdjustment",
  inventoryAdjustmentSchema
);
