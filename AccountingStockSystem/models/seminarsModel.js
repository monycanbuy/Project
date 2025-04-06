// const mongoose = require("mongoose");
// //const Schema = mongoose.Schema;
// const OrderItem = require("./orderItemModel"); // Assuming 'OrderItem' is in a separate file

// // Seminar Schema
// const seminarSchema = new mongoose.Schema(
//   {
//     organizationName: { type: String, required: true },
//     contactPhone: { type: String, required: true },
//     seminarDate: { type: Date, required: true },
//     // orderItems: [OrderItem.schema], // List of ordered food and drinks (referencing the order item schema)
//     orderItems: [
//       {
//         itemId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "OrderItem",
//           required: true,
//         },
//         itemName: { type: String, required: true },
//         qty: { type: Number, required: true },
//         unitPrice: { type: Number, required: true },
//       },
//     ],
//     totalAmount: { type: Number },
//     discount: { type: Number, default: 0 },
//     salesBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to User model
//       required: true,
//     },
//     address: { type: String, required: true },
//     isVoided: { type: Boolean, default: false },
//     additionalNotes: { type: String },
//     eventType: {
//       type: String,
//       enum: [
//         "conference",
//         "workshop",
//         "webinar",
//         "Wedding",
//         "Outdoor Catering",
//       ],
//       default: "conference",
//     },
//     paymentMethod: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PaymentMethod",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Paid", "Pending", "Cancelled", "Refund"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true }
// ); // Automatically add createdAt and updatedAt fields

// // Virtual to calculate the totalAmount dynamically from orderItems (if not storing it in DB)
// seminarSchema.virtual("calculatedTotalAmount").get(function () {
//   return this.orderItems.reduce(
//     (sum, item) => sum + item.qty * item.unitPrice,
//     0
//   );
// });

// // Pre-save hook to calculate totalAmount before saving (if storing in DB)
// seminarSchema.pre("save", function (next) {
//   if (!this.totalAmount) {
//     this.totalAmount = this.orderItems.reduce(
//       (sum, item) => sum + item.qty * item.unitPrice,
//       0
//     );
//   }
//   next();
// });

// // Creating the Seminar model based on the schema
// module.exports = mongoose.model("Seminar", seminarSchema);

// // Exporting the Seminar model to be used in controllers
// //module.exports = Seminar;

const mongoose = require("mongoose");
const moment = require("moment-timezone");

const seminarSchema = new mongoose.Schema(
  {
    organizationName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    seminarDate: {
      type: Date,
      required: true,
      default: () => moment.tz("Africa/Lagos").toDate(), // Default to current WAT
    },
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
    totalAmount: { type: Number },
    discount: { type: Number, default: 0 },
    salesBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: String, required: true },
    isVoided: { type: Boolean, default: false },
    additionalNotes: { type: String },
    eventType: {
      type: String,
      enum: [
        "conference",
        "workshop",
        "webinar",
        "Wedding",
        "Outdoor Catering",
      ],
      default: "conference",
    },
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
  },
  { timestamps: true }
);

// Index for efficient sorting by transactionDate
seminarSchema.index({ transactionDate: 1 });

// Virtual to calculate totalAmount dynamically
seminarSchema.virtual("calculatedTotalAmount").get(function () {
  return this.orderItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
});

// Pre-save hook to calculate totalAmount and validate transactionDate
seminarSchema.pre("save", function (next) {
  if (!this.totalAmount) {
    this.totalAmount = this.orderItems.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0
    );
  }
  // Ensure transactionDate is not before January 1, 2025
  const minDate = moment
    .tz("2025-01-01", "Africa/Lagos")
    .startOf("day")
    .toDate();
  if (this.transactionDate < minDate) {
    return next(new Error("Transaction date cannot be before January 1, 2025"));
  }
  next();
});

module.exports = mongoose.model("Seminar", seminarSchema);
