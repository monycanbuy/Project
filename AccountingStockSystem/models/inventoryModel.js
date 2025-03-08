// const mongoose = require("mongoose");

// const inventorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       minlength: [3, "Name must be at least 3 characters long"],
//     },
//     description: {
//       type: String,
//       default: "", // Assuming you want an empty string if not provided
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     stockQuantity: {
//       type: Number,
//       required: true,
//       index: true,
//     },
//     supplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Supplier",
//       required: true,
//     },
//     expiryDate: {
//       type: Date,
//       validate: {
//         validator: function (v) {
//           return !v || v > new Date();
//         },
//         message: "Expiry date cannot be in the past!",
//       },
//       required: function () {
//         return this.isPerishable;
//       },
//     },
//     // expiryDate: {
//     //   type: Date,
//     //   validate: {
//     //     validator: function (v) {
//     //       return !v || v > new Date();
//     //     },
//     //     message: "Expiry date cannot be in the past!",
//     //   },
//     // },
//     imageUrl: {
//       type: String,
//       default: "/utils/images/default.png", // Set the default image path
//     },
//     stockKeeper: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     reorderLevel: {
//       type: Number,
//       required: true,
//     },
//     reorderQuantity: {
//       type: Number,
//       required: true,
//     },
//     locationName: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Location",
//       required: true,
//     },
//     unit: {
//       type: String,
//       required: true,
//     },
//     isPerishable: {
//       type: Boolean,
//       default: false, // This was already set correctly
//     },
//     lastRestocked: {
//       type: Date,
//     },
//   },
//   { timestamps: true } // This adds createdAt and updatedAt fields automatically
// );
// module.exports = mongoose.model("Inventory", inventorySchema);

const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    description: {
      type: String,
      default: "",
    },
    costPrice: {
      // New: Cost from supplier
      type: Number,
      required: true,
    },
    sellingPrice: {
      // Renamed from 'price'
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      index: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    batches: [
      {
        // New: For perishable batch tracking
        batchNumber: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        expiryDate: {
          type: Date,
          validate: {
            validator: function (v) {
              return !v || v > new Date();
            },
            message: "Expiry date cannot be in the past!",
          },
          required: function () {
            return this.parent().isPerishable;
          },
        },
        receivedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    imageUrl: {
      type: String,
      default: "/utils/images/default.png",
    },
    stockKeeper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Adjusted to allow null
    },
    reorderLevel: {
      type: Number,
      required: true,
    },
    reorderQuantity: {
      type: Number,
      required: true,
    },
    locationName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    isPerishable: {
      type: Boolean,
      default: false,
    },
    lastRestocked: {
      type: Date,
    },
    isActive: {
      // New: Track active status
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
