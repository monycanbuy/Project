// const mongoose = require("mongoose");

// const saleTransactionSchema = new mongoose.Schema(
//   {
//     date: { type: Date, default: Date.now },
//     paymentMethod: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PaymentMethod",
//       required: true,
//     },
//     saleType: {
//       type: String,
//       enum: ["restaurant", "minimart"],
//       required: true,
//     },
//     items: [
//       {
//         item: {
//           type: mongoose.Schema.Types.ObjectId,
//           refPath: "item.itemType",
//           required: true,
//         },
//         itemType: {
//           type: String,
//           enum: ["Dish", "Inventory"],
//           required: true,
//         },
//         quantity: { type: Number, required: true },
//         priceAtSale: { type: Number, required: true }, // Keep this!
//       },
//     ],
//     inventoryChanges: [
//       {
//         inventoryId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Inventory",
//           required: true,
//         },
//         quantityChange: { type: Number, required: true },
//       },
//     ],
//     cashier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     totalAmount: { type: Number, required: true },
//     isVoided: { type: Boolean, default: false },
//     discount: {
//       type: Number,
//       min: 0,
//       max: 100,
//       default: 0,
//     },
//     location: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Location",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// // Method to calculate total items
// saleTransactionSchema.methods.calculateTotalItems = function () {
//   return this.items.reduce((sum, item) => sum + item.quantity, 0);
// };

// // Method to calculate total amount (after discount)
// saleTransactionSchema.methods.calculateTotalAmount = function () {
//   const subTotal = this.items.reduce(
//     (sum, item) => sum + item.priceAtSale * item.quantity,
//     0
//   );
//   const discountAmount = subTotal * (this.discount / 100);
//   return subTotal - discountAmount;
// };

// // Middleware to update inventory after a sale transaction
// saleTransactionSchema.post("save", async function (doc, next) {
//   try {
//     for (const change of doc.inventoryChanges) {
//       const inventoryItem = await mongoose
//         .model("Inventory")
//         .findById(change.inventoryId);
//       if (inventoryItem) {
//         inventoryItem.stockQuantity += change.quantityChange;
//         await inventoryItem.save();
//       } else {
//         console.warn(
//           `Inventory item with ID ${change.inventoryId} not found. Inventory update skipped.`
//         );
//         // Consider handling this case more robustly (e.g., throw an error)
//       }
//     }
//     next();
//   } catch (error) {
//     console.error("Error updating inventory:", error);
//     next(error); // Pass the error to the error handler
//   }
// });

// module.exports = mongoose.model("SaleTransaction", saleTransactionSchema);

// const mongoose = require("mongoose");

// const saleTransactionSchema = new mongoose.Schema(
//   {
//     date: { type: Date, default: Date.now },
//     paymentMethod: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PaymentMethod",
//       required: true,
//     },
//     saleType: {
//       type: String,
//       enum: ["restaurant", "minimart", "kabasa"], // Added "kabasa"
//       required: true,
//     },
//     items: [
//       {
//         item: {
//           type: mongoose.Schema.Types.ObjectId,
//           refPath: "items.itemType", // Dynamic ref based on itemType
//           required: true,
//         },
//         itemType: {
//           type: String,
//           enum: ["Dish", "Inventory", "OrderItem"], // Kept Dish for restaurant, Inventory for minimart/kabasa
//           required: true,
//         },
//         quantity: { type: Number, required: true },
//         priceAtSale: { type: Number, required: true }, // Unit price at time of sale
//       },
//     ],
//     inventoryChanges: [
//       {
//         inventoryId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Inventory",
//           required: true,
//         },
//         quantityChange: { type: Number, required: true }, // Negative for sales
//       },
//     ],
//     cashier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     totalAmount: { type: Number, required: true }, // Pre-calculated but validated
//     isVoided: { type: Boolean, default: false },
//     discount: {
//       type: Number,
//       min: 0,
//       max: 100,
//       default: 0,
//     },
//     location: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Location",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// // Method to calculate total items
// saleTransactionSchema.methods.calculateTotalItems = function () {
//   return this.items.reduce((sum, item) => sum + item.quantity, 0);
// };

// // Method to calculate total amount (after discount)
// saleTransactionSchema.methods.calculateTotalAmount = function () {
//   const subTotal = this.items.reduce(
//     (sum, item) => sum + item.priceAtSale * item.quantity,
//     0
//   );
//   const discountAmount = subTotal * (this.discount / 100);
//   return subTotal - discountAmount;
// };

// // Middleware to update inventory after a sale transaction
// saleTransactionSchema.post("save", async function (doc, next) {
//   try {
//     for (const change of doc.inventoryChanges) {
//       const inventoryItem = await mongoose
//         .model("Inventory")
//         .findById(change.inventoryId);
//       if (inventoryItem) {
//         inventoryItem.stockQuantity += change.quantityChange; // Negative for sales
//         await inventoryItem.save();
//       } else {
//         console.warn(
//           `Inventory item with ID ${change.inventoryId} not found. Inventory update skipped.`
//         );
//       }
//     }
//     next();
//   } catch (error) {
//     console.error("Error updating inventory:", error);
//     next(error);
//   }
// });

// // Pre-save validation to ensure totalAmount matches calculated value
// saleTransactionSchema.pre("save", function (next) {
//   const calculated = this.calculateTotalAmount();
//   if (Math.abs(this.totalAmount - calculated) > 0.01) {
//     // Allow tiny float diffs
//     this.totalAmount = calculated; // Auto-correct or throw error
//   }
//   next();
// });

// module.exports = mongoose.model("SaleTransaction", saleTransactionSchema);

const mongoose = require("mongoose");
const moment = require("moment-timezone");

const saleTransactionSchema = new mongoose.Schema(
  {
    transactionDate: {
      type: Date,
      required: true,
      default: () => moment.tz("Africa/Lagos").toDate(), // Default to current WAT
    },
    date: { type: Date, default: Date.now }, // Keep for creation timestamp
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    saleType: {
      type: String,
      enum: ["restaurant", "minimart", "kabasa"],
      required: true,
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "items.itemType",
          required: true,
        },
        itemType: {
          type: String,
          enum: ["Dish", "Inventory", "OrderItem"],
          required: true,
        },
        quantity: { type: Number, required: true },
        priceAtSale: { type: Number, required: true },
      },
    ],
    inventoryChanges: [
      {
        inventoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        quantityChange: { type: Number, required: true },
      },
    ],
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: { type: Number, required: true },
    isVoided: { type: Boolean, default: false },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying by transactionDate
saleTransactionSchema.index({ transactionDate: 1 });

// Method to calculate total items
saleTransactionSchema.methods.calculateTotalItems = function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
};

// Method to calculate total amount (after discount)
saleTransactionSchema.methods.calculateTotalAmount = function () {
  const subTotal = this.items.reduce(
    (sum, item) => sum + item.priceAtSale * item.quantity,
    0
  );
  const discountAmount = subTotal * (this.discount / 100);
  return subTotal - discountAmount;
};

// Middleware to update inventory after a sale transaction
saleTransactionSchema.post("save", async function (doc, next) {
  try {
    for (const change of doc.inventoryChanges) {
      const inventoryItem = await mongoose
        .model("Inventory")
        .findById(change.inventoryId);
      if (inventoryItem) {
        inventoryItem.stockQuantity += change.quantityChange;
        await inventoryItem.save();
      } else {
        console.warn(
          `Inventory item with ID ${change.inventoryId} not found. Inventory update skipped.`
        );
      }
    }
    next();
  } catch (error) {
    console.error("Error updating inventory:", error);
    next(error);
  }
});

// Pre-save validation for totalAmount and transactionDate
saleTransactionSchema.pre("save", function (next) {
  // Validate and adjust totalAmount
  const calculated = this.calculateTotalAmount();
  if (Math.abs(this.totalAmount - calculated) > 0.01) {
    this.totalAmount = calculated;
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

module.exports = mongoose.model("SaleTransaction", saleTransactionSchema);
