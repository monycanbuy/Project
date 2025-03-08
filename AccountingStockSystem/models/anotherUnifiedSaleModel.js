// models/anotherUnifiedSaleModel.js
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const anotherUnifiedSaleSchema = new Schema({
//   date: { type: Date, default: Date.now },
//   totalAmount: { type: Number, required: true },
//   paymentMethod: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "PaymentMethod", // Reference to PaymentMethod model
//     required: true,
//   },
//   saleType: {
//     type: String,
//     enum: ["restaurant", "minimart"],
//     required: true,
//   },
//   items: [
//     {
//       item: {
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: "items.itemType", // Dynamic reference
//         required: true,
//       },
//       quantity: { type: Number, required: true },
//       priceAtSale: { type: Number, required: true },
//       subTotal: { type: Number, required: true },
//       itemType: {
//         type: String,
//         enum: ["Dish", "Product"],
//         required: true,
//       },
//     },
//   ],
//   cashier: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Reference to User model
//     required: true,
//   },
//   isVoided: { type: Boolean, default: false },
// });

// // Add a method to the schema (example)
// anotherUnifiedSaleSchema.methods.calculateTotalItems = function () {
//   return this.items.reduce((sum, item) => sum + item.quantity, 0);
// };

// module.exports = mongoose.model("AnotherUnifiedSale", anotherUnifiedSaleSchema);

// models/anotherUnifiedSaleModel.js
const mongoose = require("mongoose");
//const Schema = mongoose.Schema;

const anotherUnifiedSaleSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentMethod", // Reference to PaymentMethod model
    required: true,
  },
  saleType: {
    type: String,
    enum: ["restaurant", "minimart"],
    required: true,
  },
  dishItems: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        required: true,
      },
      quantity: { type: Number, required: true },
      priceAtSale: { type: Number, required: true },
      subTotal: { type: Number, required: true },
    },
  ],
  productItems: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      priceAtSale: { type: Number, required: true },
      subTotal: { type: Number, required: true },
    },
  ],
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  isVoided: { type: Boolean, default: false },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
});

//Updating the method to calculate total items for both dish and product items
anotherUnifiedSaleSchema.methods.calculateTotalItems = function () {
  const dishCount = this.dishItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const productCount = this.productItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  return dishCount + productCount;
};

// Adding a method to calculate the total amount from both dish and product items
anotherUnifiedSaleSchema.methods.calculateTotalAmount = function () {
  const dishTotal = this.dishItems.reduce(
    (sum, item) => sum + item.subTotal,
    0
  );
  const productTotal = this.productItems.reduce(
    (sum, item) => sum + item.subTotal,
    0
  );
  return dishTotal + productTotal;
};

module.exports = mongoose.model("AnotherUnifiedSale", anotherUnifiedSaleSchema);
