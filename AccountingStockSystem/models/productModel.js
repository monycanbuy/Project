const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "", // Assuming you want an empty string if not provided
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    imageUrl: {
      type: String,
      default: "", // Assuming you want an empty string if not provided
    },
    stockKeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reorderLevel: {
      type: Number,
      required: true,
    },
    reorderQuantity: {
      type: Number,
      required: true,
    },
    // location: [
    //   // <--- location MUST be an array
    //   {
    //     locations: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Location",
    //       required: true,
    //     },
    //     name: { type: String, required: true },
    //   },
    // ],
    unit: {
      type: String,
      required: true,
    },
    isPerishable: {
      type: Boolean,
      default: false, // This was already set correctly
    },
    lastRestocked: {
      type: Date,
    },
  },
  { timestamps: true } // This adds createdAt and updatedAt fields automatically
);
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;
