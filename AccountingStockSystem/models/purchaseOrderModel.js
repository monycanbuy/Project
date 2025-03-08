// const mongoose = require("mongoose");

// const purchaseOrderSchema = new mongoose.Schema(
//   {
//     supplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Supplier",
//       required: true,
//     },
//     orderDate: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     expectedDelivery: {
//       type: Date,
//     },
//     items: [
//       {
//         inventory: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Inventory",
//           required: true,
//         },
//         quantityOrdered: {
//           type: Number,
//           required: true,
//         },
//         unitPrice: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     status: {
//       type: String,
//       enum: ["Pending", "Received", "Cancelled"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expectedDelivery: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
    },
    items: [
      {
        inventory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        quantityOrdered: {
          type: Number,
          required: true,
          min: [0, "Quantity ordered cannot be negative"],
        },
        unitPrice: {
          type: Number,
          required: true,
          min: [0, "Unit price cannot be negative"], // Added validation
        },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Received", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
