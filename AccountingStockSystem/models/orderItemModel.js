// models/orderItemModel.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    myCreatedAt: {
      //  ADD THIS - Your custom date field
      type: Date,
      required: true, //  Make it required if you ALWAYS want a date
      default: Date.now, //  VERY IMPORTANT: Set a default value
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
