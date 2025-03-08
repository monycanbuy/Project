// const mongoose = require("mongoose");
// const Inventory = require("../models/inventoryModel");
// const SaleTransaction = require("../models/salesTransactionModel"); // Your model
// const Dish = require("../models/dishesModel");
// const PaymentMethod = require("../models/PaymentMethodModel");
// const {
//   createSaleTransactionSchema,
//   updateSaleTransactionSchema,
// } = require("../middlewares/validator"); // Your Joi validators

// // GET all sales transactions
// exports.getSalesTransactions = async (req, res) => {
//   try {
//     const sales = await SaleTransaction.find().populate(
//       "paymentMethod cashier location items.item"
//     ); // Populate related data
//     res.status(200).json({ success: true, data: sales });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// exports.createSalesTransaction = async (req, res) => {
//   if (!req.user || !req.user.id) {
//     console.error("User information is missing.");
//     return res
//       .status(400)
//       .json({ success: false, message: "User information is missing." });
//   }
//   console.log("Request body:", req.body);
//   const { error, value: validatedData } = createSaleTransactionSchema.validate(
//     req.body
//   );
//   if (error) {
//     console.error("Validation error details:", error.details);
//     return res
//       .status(400)
//       .json({ success: false, message: error.details.message });
//   }

//   console.log("Validated data:", validatedData);

//   try {
//     // Check for item existence and sufficient stock *before* creating the transaction
//     for (const item of validatedData.items) {
//       let itemDoc;
//       if (item.itemType === "Dish") {
//         itemDoc = await Dish.findById(item.item);
//       } else if (item.itemType === "Inventory") {
//         itemDoc = await Inventory.findById(item.item);
//       }

//       if (!itemDoc) {
//         console.error(`Item not found: ${item.item}`);
//         return res.status(404).json({
//           success: false,
//           message: `Item not found: ${item.item}`,
//         });
//       }

//       // Check for sufficient stock only for inventory items
//       if (
//         item.itemType === "Inventory" &&
//         itemDoc.stockQuantity < item.quantity
//       ) {
//         console.error(`Insufficient stock for item: ${itemDoc.name}`);
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for item: ${itemDoc.name}`,
//         });
//       }
//     }

//     // Create a new SaleTransaction
//     const newSale = new SaleTransaction({
//       ...validatedData,
//       cashier: req.user.id,
//       inventoryChanges: validatedData.items
//         .filter((item) => item.itemType === "Inventory")
//         .map((item) => ({
//           inventoryId: item.item,
//           quantityChange: -item.quantity, // THIS IS CORRECT: Negative for decreasing
//         })),
//     });

//     // Calculate totalAmount before saving (it's required in the schema)
//     newSale.totalAmount = newSale.calculateTotalAmount();
//     console.log("Calculated totalAmount:", newSale.totalAmount);

//     // THE KEY CHANGE IS HERE:  The post-save hook is already subtracting the quantity.
//     // We were effectively subtracting TWICE.  We create the inventoryChanges with the *negative*
//     // quantity, and the post-save middleware does the actual update.
//     console.log("Inventory changes before save:", newSale.inventoryChanges);

//     const savedSale = await newSale.save(); // Save the transaction
//     console.log("Sale saved with totalAmount:", savedSale.totalAmount);

//     res.status(201).json({ success: true, data: savedSale });
//   } catch (error) {
//     console.error("Full error object:", error);
//     if (error.name === "ValidationError") {
//       res.status(400).json({ success: false, message: error.message });
//     } else if (error.name === "CastError") {
//       res
//         .status(400)
//         .json({ success: false, message: "Invalid ObjectId provided" });
//     } else if (error.name === "MongoServerError" && error.code === 11000) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Duplicate key error" });
//     } else {
//       console.error("Unexpected error:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//   }
// };

// exports.updateSalesTransaction = async (req, res) => {
//   const { id } = req.params;

//   if (!id) {
//     console.error("Missing ID in request parameters");
//     return res
//       .status(400)
//       .json({ success: false, message: "Sale transaction ID is required" });
//   }

//   const { error, value: validatedData } = updateSaleTransactionSchema.validate(
//     req.body
//   );
//   if (error) {
//     console.error("Validation error details:", error.details);
//     return res
//       .status(400)
//       .json({ success: false, message: error.details.message });
//   }

//   try {
//     const sale = await SaleTransaction.findById(id);
//     if (!sale) {
//       console.error(`Sale transaction not found with id: ${id}`);
//       return res
//         .status(404)
//         .json({ success: false, message: "Sale transaction not found" });
//     }

//     // Check if items in the updated data exist
//     for (const item of validatedData.items || []) {
//       let itemDoc;
//       if (item.itemType === "Dish") {
//         itemDoc = await Dish.findById(item.item);
//       } else if (item.itemType === "Inventory") {
//         itemDoc = await Inventory.findById(item.item);
//       }

//       if (!itemDoc) {
//         console.error(`Item not found during update: ${item.item}`);
//         return res.status(404).json({
//           success: false,
//           message: `Item not found: ${item.item}`,
//         });
//       }

//       // Check for sufficient stock only for inventory items
//       if (
//         item.itemType === "Inventory" &&
//         itemDoc.stockQuantity < item.quantity
//       ) {
//         console.error(
//           `Insufficient stock for item during update: ${itemDoc.name}`
//         );
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for item: ${itemDoc.name}`,
//         });
//       }
//     }

//     // Update the sale with the validated data
//     let updatedSale = await SaleTransaction.findByIdAndUpdate(
//       id,
//       { $set: validatedData }, // Use $set to update only provided fields
//       { new: true, runValidators: true }
//     );

//     if (!updatedSale) {
//       console.error(`Failed to update sale transaction with id: ${id}`);
//       return res
//         .status(404)
//         .json({ success: false, message: "Sale transaction not found" });
//     }

//     // Recalculate totalAmount after the update (since it might have changed)
//     updatedSale.totalAmount = updatedSale.calculateTotalAmount();
//     await updatedSale.save(); // Save the updated document

//     console.log("Sale transaction updated successfully", updatedSale);
//     res.status(200).json({ success: true, data: updatedSale });
//   } catch (error) {
//     console.error("Error updating sale transaction:", error);
//     if (error.name === "ValidationError") {
//       res.status(400).json({ success: false, message: error.message });
//     } else if (error.name === "CastError") {
//       res
//         .status(400)
//         .json({ success: false, message: "Invalid ObjectId provided" });
//     } else {
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//   }
// };

// exports.voidSalesTransaction = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const sale = await SaleTransaction.findById(id);
//     if (!sale) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Sale transaction not found" });
//     }

//     if (sale.isVoided) {
//       return res.status(400).json({
//         success: false,
//         message: "Sale transaction is already voided",
//       });
//     }

//     // Reverse Inventory Changes (Crucial for voiding)
//     for (const change of sale.inventoryChanges) {
//       const inventoryItem = await mongoose
//         .model("Inventory")
//         .findById(change.inventoryId);
//       if (inventoryItem) {
//         inventoryItem.stockQuantity -= change.quantityChange; //increment the quantity
//         await inventoryItem.save();
//       }
//     }

//     sale.isVoided = true;
//     await sale.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Sale transaction voided successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // New method: Get all-time total sales
// exports.getAllTimeTotalSales = async (req, res) => {
//   try {
//     // Aggregation pipeline to calculate all-time total sales
//     const salesData = await SaleTransaction.aggregate([
//       {
//         $match: {
//           isVoided: false, // Exclude voided transactions
//         },
//       },
//       {
//         $group: {
//           _id: null, // Group all records into a single total
//           totalSales: { $sum: "$totalAmount" }, // Sum totalAmount across all records
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Exclude _id
//           totalSales: { $ifNull: ["$totalSales", 0] }, // Default to 0 if no sales
//         },
//       },
//     ]);

//     // Extract totalSales (default to 0 if no data)
//     const result = salesData.length > 0 ? salesData[0] : { totalSales: 0 };

//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error fetching all-time total sales:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching all-time total sales",
//       details: error.message,
//     });
//   }
// };

// // New method: Get daily total sales for all days with breakdown
// exports.getTodaySales = async (req, res) => {
//   try {
//     // Define today's date range
//     const today = new Date();
//     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999));

//     // Aggregation pipeline for today's sales
//     const salesData = await SaleTransaction.aggregate([
//       {
//         $match: {
//           isVoided: false, // Exclude voided transactions
//           createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for today
//         },
//       },
//       {
//         $group: {
//           _id: "$saleType", // Group by saleType (restaurant or minimart)
//           totalPerType: { $sum: "$totalAmount" }, // Sum totalAmount per saleType
//         },
//       },
//       {
//         $group: {
//           _id: null, // Combine all results
//           breakdown: {
//             $push: {
//               saleType: "$_id",
//               total: "$totalPerType",
//             },
//           },
//           totalSales: { $sum: "$totalPerType" }, // Combined total for today
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           date: { $dateToString: { format: "%Y-%m-%d", date: startOfDay } }, // Today's date
//           totalSales: { $ifNull: ["$totalSales", 0] }, // Default to 0 if no sales
//           breakdown: {
//             $arrayToObject: {
//               $map: {
//                 input: {
//                   $cond: {
//                     if: { $isArray: "$breakdown" },
//                     then: "$breakdown",
//                     else: [], // Empty array if no sales
//                   },
//                 },
//                 as: "item",
//                 in: {
//                   k: "$$item.saleType",
//                   v: "$$item.total",
//                 },
//               },
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           date: 1,
//           totalSales: 1,
//           "breakdown.restaurant": { $ifNull: ["$breakdown.restaurant", 0] }, // Default to 0 if no restaurant sales
//           "breakdown.minimart": { $ifNull: ["$breakdown.minimart", 0] }, // Default to 0 if no minimart sales
//         },
//       },
//     ]);

//     // If no data, return a default object for today
//     const result =
//       salesData.length > 0
//         ? salesData[0]
//         : {
//             date: startOfDay.toISOString().split("T")[0],
//             totalSales: 0,
//             breakdown: {
//               restaurant: 0,
//               minimart: 0,
//             },
//           };

//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error fetching today's sales:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching today's sales",
//       details: error.message,
//     });
//   }
// };

// // New method: Get last seven days of daily total sales
// exports.getLastSevenDaysSales = async (req, res) => {
//   try {
//     // Define the date range for the last 7 days
//     const today = new Date();
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999));
//     const startOfSevenDays = new Date(endOfDay);
//     startOfSevenDays.setDate(endOfDay.getDate() - 6); // Go back 6 days from today
//     startOfSevenDays.setHours(0, 0, 0, 0);

//     // Aggregation pipeline for last 7 days' sales
//     const salesData = await SaleTransaction.aggregate([
//       {
//         $match: {
//           isVoided: false, // Exclude voided transactions
//           createdAt: { $gte: startOfSevenDays, $lte: endOfDay }, // Last 7 days
//         },
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by day
//           totalSales: { $sum: "$totalAmount" }, // Sum totalAmount per day
//         },
//       },
//       {
//         $sort: { _id: 1 }, // Sort by date ascending (oldest to newest)
//       },
//       {
//         $project: {
//           _id: 0,
//           date: "$_id",
//           totalSales: 1,
//         },
//       },
//     ]);

//     // Generate all 7 days to ensure full coverage
//     const sevenDaysSales = [];
//     for (let i = 0; i < 7; i++) {
//       const day = new Date(startOfSevenDays);
//       day.setDate(startOfSevenDays.getDate() + i);
//       const dateStr = day.toISOString().split("T")[0];
//       const foundDay = salesData.find((d) => d.date === dateStr);
//       sevenDaysSales.push({
//         date: dateStr,
//         totalSales: foundDay ? foundDay.totalSales : 0,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: sevenDaysSales,
//     });
//   } catch (error) {
//     console.error("Error fetching last seven days sales:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching last seven days sales",
//       details: error.message,
//     });
//   }
// };

// exports.getSalesForLastTwoWeeks = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const sevenDaysAgo = new Date(today);
//     sevenDaysAgo.setDate(today.getDate() - 6);

//     const lastWeekStart = new Date(sevenDaysAgo);
//     lastWeekStart.setDate(sevenDaysAgo.getDate() - 7);

//     const salesData = await SaleTransaction.aggregate([
//       {
//         $match: {
//           date: { $gte: lastWeekStart, $lte: today },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$date" },
//           },
//           totalSales: { $sum: "$amount" },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: salesData,
//     });
//   } catch (error) {
//     console.error("Error fetching sales data:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch sales data",
//       error: error.message || "Internal Server Error",
//     });
//   }
// };

// exports.getDailySalesByPaymentMethod = async (req, res) => {
//   try {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);
//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const salesData = await SaleTransaction.aggregate([
//       {
//         $match: {
//           isVoided: { $ne: true },
//           date: { $gte: todayStart, $lte: todayEnd },
//         },
//       },
//       {
//         $group: {
//           _id: "$paymentMethod",
//           totalAmount: { $sum: "$totalAmount" },
//         },
//       },
//       {
//         $lookup: {
//           from: "paymentmethods",
//           localField: "_id",
//           foreignField: "_id",
//           as: "paymentMethodDetails",
//         },
//       },
//       {
//         $unwind: "$paymentMethodDetails",
//       },
//       {
//         $project: {
//           _id: 0,
//           paymentMethodId: "$_id",
//           paymentMethod: "$paymentMethodDetails.name",
//           totalAmount: 1,
//         },
//       },
//     ]);

//     // Fetch all payment methods to ensure all are included, even with $0
//     const allPaymentMethods = await PaymentMethod.find({}, { name: 1 });
//     const paymentMethodMap = new Map(
//       salesData.map((item) => [item.paymentMethod, item.totalAmount])
//     );

//     // Build the response including all payment methods
//     const result = allPaymentMethods.map((method) => ({
//       paymentMethodId: method._id,
//       paymentMethod: method.name,
//       totalAmount: paymentMethodMap.get(method.name) || 0, // Default to 0 if no sales
//     }));

//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error fetching daily sales by payment method:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch daily sales by payment method",
//       error: error.message || "Internal Server Error",
//     });
//   }
// };

const mongoose = require("mongoose");
const Inventory = require("../models/inventoryModel");
const SaleTransaction = require("../models/salesTransactionModel");
const Dish = require("../models/dishesModel");
const OrderItem = require("../models/orderItemModel"); // Add this import for OrderItem
const PaymentMethod = require("../models/PaymentMethodModel");
const {
  createSaleTransactionSchema,
  updateSaleTransactionSchema,
} = require("../middlewares/validator");

// GET all sales transactions
exports.getSalesTransactions = async (req, res) => {
  try {
    const sales = await SaleTransaction.find().populate(
      "paymentMethod cashier location items.item"
    );
    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// exports.createSalesTransaction = async (req, res) => {
//   if (!req.user || !req.user.id) {
//     console.error("User information is missing.");
//     return res
//       .status(400)
//       .json({ success: false, message: "User information is missing." });
//   }
//   console.log("Request body:", req.body);
//   const { error, value: validatedData } = createSaleTransactionSchema.validate(
//     req.body
//   );
//   if (error) {
//     console.error("Validation error details:", error.details);
//     return res
//       .status(400)
//       .json({ success: false, message: error.details[0].message });
//   }

//   console.log("Validated data:", validatedData);

//   try {
//     // Check for item existence and sufficient stock *before* creating the transaction
//     for (const item of validatedData.items) {
//       let itemDoc;
//       if (item.itemType === "Dish") {
//         itemDoc = await Dish.findById(item.item);
//       } else if (item.itemType === "Inventory") {
//         itemDoc = await Inventory.findById(item.item);
//       } else if (item.itemType === "OrderItem") {
//         itemDoc = await OrderItem.findById(item.item); // Check OrderItem for kabasa
//       }

//       if (!itemDoc) {
//         console.error(`Item not found: ${item.item}`);
//         return res.status(404).json({
//           success: false,
//           message: `Item not found: ${item.item}`,
//         });
//       }

//       // Check for sufficient stock only for Inventory items
//       if (
//         item.itemType === "Inventory" &&
//         itemDoc.stockQuantity < item.quantity
//       ) {
//         console.error(`Insufficient stock for item: ${itemDoc.name}`);
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for item: ${itemDoc.name}`,
//         });
//       }
//     }

//     // Create a new SaleTransaction
//     const newSale = new SaleTransaction({
//       ...validatedData,
//       cashier: req.user.id,
//       inventoryChanges: validatedData.items
//         .filter((item) => item.itemType === "Inventory")
//         .map((item) => ({
//           inventoryId: item.item,
//           quantityChange: -item.quantity,
//         })),
//     });

//     // Calculate totalAmount before saving (it's required in the schema)
//     newSale.totalAmount = newSale.calculateTotalAmount();
//     console.log("Calculated totalAmount:", newSale.totalAmount);

//     console.log("Inventory changes before save:", newSale.inventoryChanges);

//     const savedSale = await newSale.save();
//     console.log("Sale saved with totalAmount:", savedSale.totalAmount);

//     res.status(201).json({ success: true, data: savedSale });
//   } catch (error) {
//     console.error("Full error object:", error);
//     if (error.name === "ValidationError") {
//       res.status(400).json({ success: false, message: error.message });
//     } else if (error.name === "CastError") {
//       res
//         .status(400)
//         .json({ success: false, message: "Invalid ObjectId provided" });
//     } else if (error.name === "MongoServerError" && error.code === 11000) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Duplicate key error" });
//     } else {
//       console.error("Unexpected error:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//   }
// };

exports.createSalesTransaction = async (req, res) => {
  // Fix: Check req.user.userId instead of req.user.id
  if (!req.user || !req.user.userId) {
    console.error("User information is missing.");
    return res
      .status(400)
      .json({ success: false, message: "User information is missing." });
  }
  console.log("Request body:", req.body);
  const { error, value: validatedData } = createSaleTransactionSchema.validate(
    req.body
  );
  if (error) {
    console.error("Validation error details:", error.details);
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  console.log("Validated data:", validatedData);

  try {
    // Check for item existence and sufficient stock *before* creating the transaction
    for (const item of validatedData.items) {
      let itemDoc;
      if (item.itemType === "Dish") {
        itemDoc = await Dish.findById(item.item);
      } else if (item.itemType === "Inventory") {
        itemDoc = await Inventory.findById(item.item);
      } else if (item.itemType === "OrderItem") {
        itemDoc = await OrderItem.findById(item.item);
      }

      if (!itemDoc) {
        console.error(`Item not found: ${item.item}`);
        return res.status(404).json({
          success: false,
          message: `Item not found: ${item.item}`,
        });
      }

      if (
        item.itemType === "Inventory" &&
        itemDoc.stockQuantity < item.quantity
      ) {
        console.error(`Insufficient stock for item: ${itemDoc.name}`);
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for item: ${itemDoc.name}`,
        });
      }
    }

    // Create a new SaleTransaction
    const newSale = new SaleTransaction({
      ...validatedData,
      cashier: req.user.userId, // Fix: Use req.user.userId instead of req.user.id
      inventoryChanges: validatedData.items
        .filter((item) => item.itemType === "Inventory")
        .map((item) => ({
          inventoryId: item.item,
          quantityChange: -item.quantity,
        })),
    });

    // Calculate totalAmount before saving
    newSale.totalAmount = newSale.calculateTotalAmount();
    console.log("Calculated totalAmount:", newSale.totalAmount);

    console.log("Inventory changes before save:", newSale.inventoryChanges);

    const savedSale = await newSale.save();
    console.log("Sale saved with totalAmount:", savedSale.totalAmount);

    res.status(201).json({ success: true, data: savedSale });
  } catch (error) {
    console.error("Full error object:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, message: error.message });
    } else if (error.name === "CastError") {
      res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId provided" });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Duplicate key error" });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

// exports.updateSalesTransaction = async (req, res) => {
//   const { id } = req.params;

//   if (!id) {
//     console.error("Missing ID in request parameters");
//     return res
//       .status(400)
//       .json({ success: false, message: "Sale transaction ID is required" });
//   }

//   const { error, value: validatedData } = updateSaleTransactionSchema.validate(
//     req.body
//   );
//   if (error) {
//     console.error("Validation error details:", error.details);
//     return res
//       .status(400)
//       .json({ success: false, message: error.details[0].message });
//   }

//   try {
//     const sale = await SaleTransaction.findById(id);
//     if (!sale) {
//       console.error(`Sale transaction not found with id: ${id}`);
//       return res
//         .status(404)
//         .json({ success: false, message: "Sale transaction not found" });
//     }

//     // Check if items in the updated data exist
//     for (const item of validatedData.items || []) {
//       let itemDoc;
//       if (item.itemType === "Dish") {
//         itemDoc = await Dish.findById(item.item);
//       } else if (item.itemType === "Inventory") {
//         itemDoc = await Inventory.findById(item.item);
//       } else if (item.itemType === "OrderItem") {
//         itemDoc = await OrderItem.findById(item.item); // Check OrderItem for kabasa
//       }

//       if (!itemDoc) {
//         console.error(`Item not found during update: ${item.item}`);
//         return res.status(404).json({
//           success: false,
//           message: `Item not found: ${item.item}`,
//         });
//       }

//       // Check for sufficient stock only for Inventory items
//       if (
//         item.itemType === "Inventory" &&
//         itemDoc.stockQuantity < item.quantity
//       ) {
//         console.error(
//           `Insufficient stock for item during update: ${itemDoc.name}`
//         );
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for item: ${itemDoc.name}`,
//         });
//       }
//     }

//     // Update the sale with the validated data
//     let updatedSale = await SaleTransaction.findByIdAndUpdate(
//       id,
//       { $set: validatedData },
//       { new: true, runValidators: true }
//     );

//     if (!updatedSale) {
//       console.error(`Failed to update sale transaction with id: ${id}`);
//       return res
//         .status(404)
//         .json({ success: false, message: "Sale transaction not found" });
//     }

//     // Recalculate totalAmount after the update
//     updatedSale.totalAmount = updatedSale.calculateTotalAmount();
//     await updatedSale.save();

//     console.log("Sale transaction updated successfully", updatedSale);
//     res.status(200).json({ success: true, data: updatedSale });
//   } catch (error) {
//     console.error("Error updating sale transaction:", error);
//     if (error.name === "ValidationError") {
//       res.status(400).json({ success: false, message: error.message });
//     } else if (error.name === "CastError") {
//       res
//         .status(400)
//         .json({ success: false, message: "Invalid ObjectId provided" });
//     } else {
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//   }
// };

// No changes needed for voidSalesTransaction since it only deals with Inventory
exports.updateSalesTransaction = async (req, res) => {
  // Add authentication check
  if (!req.user || !req.user.userId) {
    console.error("User information is missing.");
    return res
      .status(400)
      .json({ success: false, message: "User information is missing." });
  }

  const { id } = req.params;

  if (!id) {
    console.error("Missing ID in request parameters");
    return res
      .status(400)
      .json({ success: false, message: "Sale transaction ID is required" });
  }

  const { error, value: validatedData } = updateSaleTransactionSchema.validate(
    req.body
  );
  if (error) {
    console.error("Validation error details:", error.details);
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const sale = await SaleTransaction.findById(id);
    if (!sale) {
      console.error(`Sale transaction not found with id: ${id}`);
      return res
        .status(404)
        .json({ success: false, message: "Sale transaction not found" });
    }

    // Optional: Check if the user has permission to update this sale (e.g., same cashier)
    if (sale.cashier.toString() !== req.user.userId) {
      console.error(
        `User ${req.user.userId} not authorized to update sale ${id}`
      );
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Cannot update this sale",
      });
    }

    // Check if items in the updated data exist
    for (const item of validatedData.items || []) {
      let itemDoc;
      if (item.itemType === "Dish") {
        itemDoc = await Dish.findById(item.item);
      } else if (item.itemType === "Inventory") {
        itemDoc = await Inventory.findById(item.item);
      } else if (item.itemType === "OrderItem") {
        itemDoc = await OrderItem.findById(item.item);
      }

      if (!itemDoc) {
        console.error(`Item not found during update: ${item.item}`);
        return res.status(404).json({
          success: false,
          message: `Item not found: ${item.item}`,
        });
      }

      if (
        item.itemType === "Inventory" &&
        itemDoc.stockQuantity < item.quantity
      ) {
        console.error(
          `Insufficient stock for item during update: ${itemDoc.name}`
        );
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for item: ${itemDoc.name}`,
        });
      }
    }

    // Update the sale with the validated data
    let updatedSale = await SaleTransaction.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedSale) {
      console.error(`Failed to update sale transaction with id: ${id}`);
      return res
        .status(404)
        .json({ success: false, message: "Sale transaction not found" });
    }

    // Recalculate totalAmount after the update
    updatedSale.totalAmount = updatedSale.calculateTotalAmount();
    await updatedSale.save();

    console.log("Sale transaction updated successfully", updatedSale);
    res.status(200).json({ success: true, data: updatedSale });
  } catch (error) {
    console.error("Error updating sale transaction:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ success: false, message: error.message });
    } else if (error.name === "CastError") {
      res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId provided" });
    } else {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

// exports.voidSalesTransaction = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const sale = await SaleTransaction.findById(id);
//     if (!sale) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Sale transaction not found" });
//     }

//     if (sale.isVoided) {
//       return res.status(400).json({
//         success: false,
//         message: "Sale transaction is already voided",
//       });
//     }

//     // Reverse Inventory Changes (Crucial for voiding)
//     for (const change of sale.inventoryChanges) {
//       const inventoryItem = await mongoose
//         .model("Inventory")
//         .findById(change.inventoryId);
//       if (inventoryItem) {
//         inventoryItem.stockQuantity -= change.quantityChange; // Increment the quantity
//         await inventoryItem.save();
//       }
//     }

//     sale.isVoided = true;
//     await sale.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Sale transaction voided successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

//In controllers/trackInventoriesController.js (or wherever your trackinventories logic lives)

//No changes needed for getAllTimeTotalSales as it aggregates all transactions
// In controllers/salesTransactionsController.js
exports.voidSalesTransaction = async (req, res) => {
  console.log("=== Starting voidSalesTransaction ===");
  console.log("Request URL:", req.originalUrl);
  console.log("User:", req.user);

  // Step 1: Authentication check
  if (!req.user || !req.user.userId) {
    console.error("Authentication failed");
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }
  console.log("User permissions:", req.user.roles);

  // Step 2: Extract ID
  const { id } = req.params;
  if (!id) {
    console.error("No ID provided");
    return res
      .status(400)
      .json({ success: false, message: "Sale transaction ID required" });
  }

  try {
    // Step 3: Fetch sale
    const sale = await SaleTransaction.findById(id).populate(
      "inventoryChanges.inventoryId"
    );
    if (!sale) {
      console.error("Sale not found:", id);
      return res
        .status(404)
        .json({ success: false, message: "Sale transaction not found" });
    }
    console.log("Sale:", sale.toObject());

    // Step 4: Check if voided
    if (sale.isVoided) {
      console.error("Already voided:", id);
      return res
        .status(400)
        .json({ success: false, message: "Sale transaction already voided" });
    }

    // Step 5: Reverse inventory changes
    if (sale.inventoryChanges.length > 0) {
      console.log("Reversing inventory changes...");
      for (const change of sale.inventoryChanges) {
        const inventoryItem = await mongoose
          .model("Inventory")
          .findById(change.inventoryId);
        if (!inventoryItem) {
          console.warn("Inventory not found:", change.inventoryId);
          continue;
        }
        const reversal = -change.quantityChange;
        inventoryItem.stockQuantity += reversal;
        console.log(
          `Reversed ${reversal} for ${change.inventoryId}: New stock = ${inventoryItem.stockQuantity}`
        );
        await inventoryItem.save();
      }
    } else {
      console.log("No inventory changes to reverse");
    }

    // Step 6: Void the sale
    sale.isVoided = true;
    await sale.save();
    console.log("Sale voided:", sale.toObject());

    // Step 7: Success
    return res
      .status(200)
      .json({ success: true, message: "Sale transaction voided successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getAllTimeTotalSales = async (req, res) => {
  try {
    const salesData = await SaleTransaction.aggregate([
      {
        $match: {
          isVoided: false,
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: { $ifNull: ["$totalSales", 0] },
        },
      },
    ]);

    const result = salesData.length > 0 ? salesData[0] : { totalSales: 0 };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching all-time total sales:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all-time total sales",
      details: error.message,
    });
  }
};

// Update getTodaySales to include kabasa in breakdown

exports.getTodaySales = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const salesData = await SaleTransaction.aggregate([
      {
        $match: {
          isVoided: false,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$saleType",
          totalPerType: { $sum: "$totalAmount" },
        },
      },
      {
        $group: {
          _id: null,
          breakdown: {
            $push: {
              saleType: "$_id",
              total: "$totalPerType",
            },
          },
          totalSales: { $sum: "$totalPerType" },
        },
      },
      {
        $project: {
          _id: 0,
          date: { $dateToString: { format: "%Y-%m-%d", date: startOfDay } },
          totalSales: { $ifNull: ["$totalSales", 0] },
          breakdown: {
            $arrayToObject: {
              $map: {
                input: {
                  $cond: {
                    if: { $isArray: "$breakdown" },
                    then: "$breakdown",
                    else: [],
                  },
                },
                as: "item",
                in: {
                  k: "$$item.saleType",
                  v: "$$item.total",
                },
              },
            },
          },
        },
      },
      {
        $project: {
          date: 1,
          totalSales: 1,
          "breakdown.restaurant": { $ifNull: ["$breakdown.restaurant", 0] },
          "breakdown.minimart": { $ifNull: ["$breakdown.minimart", 0] },
          "breakdown.kabasa": { $ifNull: ["$breakdown.kabasa", 0] }, // Already updated
        },
      },
    ]);

    const result =
      salesData.length > 0
        ? salesData[0]
        : {
            date: startOfDay.toISOString().split("T")[0],
            totalSales: 0,
            breakdown: {
              restaurant: 0,
              minimart: 0,
              kabasa: 0,
            },
          };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching today's sales:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching today's sales",
      details: error.message,
    });
  }
};

// No changes needed for getLastSevenDaysSales as it aggregates all sales types
exports.getLastSevenDaysSales = async (req, res) => {
  try {
    const today = new Date();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const startOfSevenDays = new Date(endOfDay);
    startOfSevenDays.setDate(endOfDay.getDate() - 6);
    startOfSevenDays.setHours(0, 0, 0, 0);

    const salesData = await SaleTransaction.aggregate([
      {
        $match: {
          isVoided: false,
          createdAt: { $gte: startOfSevenDays, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalSales: 1,
        },
      },
    ]);

    const sevenDaysSales = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfSevenDays);
      day.setDate(startOfSevenDays.getDate() + i);
      const dateStr = day.toISOString().split("T")[0];
      const foundDay = salesData.find((d) => d.date === dateStr);
      sevenDaysSales.push({
        date: dateStr,
        totalSales: foundDay ? foundDay.totalSales : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: sevenDaysSales,
    });
  } catch (error) {
    console.error("Error fetching last seven days sales:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching last seven days sales",
      details: error.message,
    });
  }
};

// No changes needed for getSalesForLastTwoWeeks as it aggregates all sales types
exports.getSalesForLastTwoWeeks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const lastWeekStart = new Date(sevenDaysAgo);
    lastWeekStart.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await SaleTransaction.aggregate([
      {
        $match: {
          date: { $gte: lastWeekStart, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalSales: { $sum: "$totalAmount" }, // Fixed from $amount to $totalAmount
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales data",
      error: error.message || "Internal Server Error",
    });
  }
};

// No changes needed for getDailySalesByPaymentMethod as it aggregates all sales types
exports.getDailySalesByPaymentMethod = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const salesData = await SaleTransaction.aggregate([
      {
        $match: {
          isVoided: { $ne: true },
          date: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "paymentmethods",
          localField: "_id",
          foreignField: "_id",
          as: "paymentMethodDetails",
        },
      },
      {
        $unwind: "$paymentMethodDetails",
      },
      {
        $project: {
          _id: 0,
          paymentMethodId: "$_id",
          paymentMethod: "$paymentMethodDetails.name",
          totalAmount: 1,
        },
      },
    ]);

    const allPaymentMethods = await PaymentMethod.find({}, { name: 1 });
    const paymentMethodMap = new Map(
      salesData.map((item) => [item.paymentMethod, item.totalAmount])
    );

    const result = allPaymentMethods.map((method) => ({
      paymentMethodId: method._id,
      paymentMethod: method.name,
      totalAmount: paymentMethodMap.get(method.name) || 0,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching daily sales by payment method:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily sales by payment method",
      error: error.message || "Internal Server Error",
    });
  }
};
