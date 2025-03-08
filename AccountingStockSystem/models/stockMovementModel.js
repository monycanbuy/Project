const mongoose = require("mongoose");
const stockMovementSchema = new mongoose.Schema(
  {
    inventory: {
      //type: Schema.Types.ObjectId,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    type: {
      type: String,
      enum: ["Issue", "Return", "Adjustment"],
      required: true,
    },
    quantity: { type: Number, required: true },
    fromLocation: {
      //type: Schema.Types.ObjectId,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    toLocation: {
      //type: Schema.Types.ObjectId,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    reason: { type: String },
    staff: {
      //type: Schema.Types.ObjectId,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockMovement", stockMovementSchema);
