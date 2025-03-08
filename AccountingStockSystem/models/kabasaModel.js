const mongoose = require("mongoose");
const OrderItem = require("./orderItemModel"); // Assuming 'OrderItem' is defined in a separate file

// Kabasa Schema
const kabasaSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OrderItem",
          required: true,
        },
        itemName: { type: String, required: true },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true }, // Dynamically calculated but can be overridden
    discount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Cancelled", "Refund"],
      default: "Pending",
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    salesBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    }, // Example: logged-in user creating the laundry record
    isVoided: { type: Boolean, default: false },
    additionalNotes: { type: String },
  },
  { timestamps: true } // Automatically manages `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Kabasa", kabasaSchema);
//module.exports = Kabasa;
