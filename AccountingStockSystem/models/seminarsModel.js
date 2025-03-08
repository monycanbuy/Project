const mongoose = require("mongoose");
//const Schema = mongoose.Schema;
const OrderItem = require("./orderItemModel"); // Assuming 'OrderItem' is in a separate file

// Seminar Schema
const seminarSchema = new mongoose.Schema(
  {
    organizationName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    seminarDate: { type: Date, required: true },
    // orderItems: [OrderItem.schema], // List of ordered food and drinks (referencing the order item schema)
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
      ref: "User", // Reference to User model
      required: true,
    },
    address: { type: String, required: true },
    isVoided: { type: Boolean, default: false },
    additionalNotes: { type: String },
    eventType: {
      type: String,
      enum: ["conference", "workshop", "webinar", "Wedding"],
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
); // Automatically add createdAt and updatedAt fields

// Virtual to calculate the totalAmount dynamically from orderItems (if not storing it in DB)
seminarSchema.virtual("calculatedTotalAmount").get(function () {
  return this.orderItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
});

// Pre-save hook to calculate totalAmount before saving (if storing in DB)
seminarSchema.pre("save", function (next) {
  if (!this.totalAmount) {
    this.totalAmount = this.orderItems.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0
    );
  }
  next();
});

// Creating the Seminar model based on the schema
module.exports = mongoose.model("Seminar", seminarSchema);

// Exporting the Seminar model to be used in controllers
//module.exports = Seminar;
