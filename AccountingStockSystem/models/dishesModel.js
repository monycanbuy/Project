const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    ingredients: [
      {
        inventoryItem: {
          // Changed from 'product' to 'inventoryItem'
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        quantity: { type: Number, required: true }, // Quantity of this inventory item per dish
      },
    ], // Add ingredients field
  },
  { timestamps: true }
);
module.exports = mongoose.model("Dish", dishSchema);
