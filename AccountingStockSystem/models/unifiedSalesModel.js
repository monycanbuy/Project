const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentMethod = require("./PaymentMethodModel"); // Adjust the path as necessary

const unifiedSaleSchema = new Schema({
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod",
    required: true,
  },
  saleType: {
    type: String,
    enum: ["restaurant", "minimart"],
    required: true,
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "items.itemType",
        required: true,
      },
      quantity: { type: Number, required: true },
      priceAtSale: { type: Number, required: true },
      subTotal: { type: Number, required: true },
      itemType: {
        type: String,
        enum: ["Dish", "Product"],
        required: true,
      },
    },
  ],
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isVoided: { type: Boolean, default: false },
});

module.exports = mongoose.model("UnifiedSale", unifiedSaleSchema);
// module.exports = mongoose.model("UnifiedSale", unifiedSaleSchema);
// const UnifiedSale = mongoose.model("UnifiedSale", unifiedSaleSchema);
// module.exports = UnifiedSale;
