// // models/hallTransactionModel.js
// const mongoose = require("mongoose");
// const Hall = require("./hallTypesModel");

// const hallTransactionSchema = new mongoose.Schema(
//   {
//     transactionId: { type: String, required: true, unique: true },
//     date: { type: Date, default: Date.now },
//     //halls: [Hall.schema], // Changed from 'hall'
//     halls: [
//       {
//         hallId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Hall",
//           required: true,
//         },
//         name: { type: String, required: true },
//         qty: { type: Number, required: true },
//         price: { type: Number, required: true },
//       },
//     ],
//     customerName: { type: String, required: true },
//     contactPhone: { type: String, required: true },
//     eventType: {
//       type: String,
//       enum: ["conference", "workshop", "webinar", "Wedding"],
//       default: "conference",
//     },
//     startTime: { type: Date, required: true },
//     endTime: { type: Date, required: true },
//     discount: { type: Number, default: 0 },
//     totalAmount: { type: Number, required: true },
//     paymentMethod: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PaymentMethod",
//       required: true,
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["Paid", "Pending", "Cancelled", "Refund"],
//       default: "Pending",
//     },
//     staffInvolved: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to User model
//       required: true,
//     },
//     isVoided: { type: Boolean, default: false },
//     notes: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("HallTransaction", hallTransactionSchema);
// //module.exports = HallTransaction;

const mongoose = require("mongoose");
const moment = require("moment-timezone"); // Add moment-timezone for WAT conversion
const Hall = require("./hallTypesModel");

const hallTransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    date: { type: Date, default: () => moment().tz("Africa/Lagos").toDate() }, // Default to WAT
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
      ref: "User",
      required: true,
    },
    isVoided: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

// Pre-save middleware to ensure date is in WAT
hallTransactionSchema.pre("save", function (next) {
  if (this.date) {
    // Convert the date to WAT (Africa/Lagos timezone)
    this.date = moment(this.date).tz("Africa/Lagos").toDate();
  }
  if (this.startTime) {
    this.startTime = moment(this.startTime).tz("Africa/Lagos").toDate();
  }
  if (this.endTime) {
    this.endTime = moment(this.endTime).tz("Africa/Lagos").toDate();
  }
  next();
});

// Optional: Transform the output to ensure dates are returned in WAT format
hallTransactionSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.date) {
      ret.date = moment(ret.date).tz("Africa/Lagos").format();
    }
    if (ret.startTime) {
      ret.startTime = moment(ret.startTime).tz("Africa/Lagos").format();
    }
    if (ret.endTime) {
      ret.endTime = moment(ret.endTime).tz("Africa/Lagos").format();
    }
    return ret;
  },
});

module.exports = mongoose.model("HallTransaction", hallTransactionSchema);
