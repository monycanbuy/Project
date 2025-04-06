const mongoose = require("mongoose");
const moment = require("moment-timezone");

const laundrySchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },
    receiptNo: { type: String, required: true },
    transactionDate: {
      // Added laundryDate field
      type: Date,
      required: true,
      default: () => moment.tz("Africa/Lagos").toDate(), // Default to current WAT
    },
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
      ref: "User",
      required: true,
    },
    isVoided: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Laundry", laundrySchema);
