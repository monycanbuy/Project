const mongoose = require("mongoose");

const laundrySchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    receiptNo: { type: String, required: true },
    discount: { type: Number, default: 0 },
    services: [
      {
        serviceType: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "LaundryService",
          required: true,
        },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Cancelled", "Refund"],
      default: "Pending",
    },
    phoneNo: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    salesBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    }, // Example: logged-in user creating the laundry record
    isVoided: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Laundry", laundrySchema);
