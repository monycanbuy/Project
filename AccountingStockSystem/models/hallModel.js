// models/hallTransactionModel.js
const mongoose = require("mongoose");
const Hall = require("./hallTypesModel");

const hallTransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    //halls: [Hall.schema], // Changed from 'hall'
    halls: [
      {
        hallId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hall",
          required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    customerName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    eventType: {
      type: String,
      enum: ["conference", "workshop", "webinar", "Wedding"],
      default: "conference",
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Cancelled", "Refund"],
      default: "Pending",
    },
    staffInvolved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    isVoided: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HallTransaction", hallTransactionSchema);
//module.exports = HallTransaction;
