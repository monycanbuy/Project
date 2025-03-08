const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Assuming PaymentMethod is in the same directory or you adjust the path accordingly
const PaymentMethod = require("./PaymentMethodModel"); // Adjust the path as necessary

const saleSchema = new Schema({
  date: { type: Date, default: Date.now },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
    required: true,
  },
  totalAmount: { type: Number, required: true, default: 0 }, // Total for the entire sale
  isVoided: { type: Boolean, default: false },
  discount: { type: Number, default: 0 }, // 0 for no discount, percentage for discounts
  discountedTotal: { type: Number, default: 0 },
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;
