// const InventoryAdjustment = require("../models/inventoryAdjustmentModel");
// const {
//   createInventoryAdjustmentSchema,
//   updateInventoryAdjustmentSchema,
// } = require("../middlewares/validator");

// // Get all inventory adjustments
// exports.getInventoryAdjustments = async (req, res) => {
//   try {
//     const adjustments = await InventoryAdjustment.find()
//       .populate("product", "name")
//       .populate("staff", "fullName");

//     res.status(200).json({ success: true, data: adjustments });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching inventory adjustments",
//       error: error.message,
//     });
//   }
// };

// // Create a new inventory adjustment
// exports.createInventoryAdjustment = async (req, res) => {
//   try {
//     const { error, value } = createInventoryAdjustmentSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors: error.details.map((detail) => detail.message),
//       });
//     }

//     const newAdjustment = await InventoryAdjustment.create({
//       ...value,
//       staff: req.user.id, // Associate the adjustment with the logged-in staff member
//     });

//     res.status(201).json({
//       success: true,
//       message: "Inventory adjustment created successfully",
//       data: newAdjustment,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating inventory adjustment",
//       error: error.message,
//     });
//   }
// };

// // Update an inventory adjustment
// exports.updateInventoryAdjustment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error, value } = updateInventoryAdjustmentSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors: error.details.map((detail) => detail.message),
//       });
//     }

//     const updatedAdjustment = await InventoryAdjustment.findByIdAndUpdate(
//       id,
//       value,
//       { new: true }
//     );
//     if (!updatedAdjustment) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Inventory adjustment not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Inventory adjustment updated successfully",
//       data: updatedAdjustment,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating inventory adjustment",
//       error: error.message,
//     });
//   }
// };

// // Delete an inventory adjustment
// exports.deleteInventoryAdjustment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedAdjustment = await InventoryAdjustment.findByIdAndDelete(id);
//     if (!deletedAdjustment) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Inventory adjustment not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Inventory adjustment deleted successfully",
//       data: deletedAdjustment,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting inventory adjustment",
//       error: error.message,
//     });
//   }
// };
const mongoose = require("mongoose");
const InventoryAdjustment = require("../models/inventoryAdjustmentModel");
const Inventory = require("../models/inventoryModel");
const Laundry = require("../models/laundryModel");
const HallTransaction = require("../models/hallModel");
const FrontOfficeSale = require("../models/frontOfficeModel");
const Seminar = require("../models/seminarsModel");
const SaleTransaction = require("../models/salesTransactionModel");
const {
  createInventoryAdjustmentSchema,
  updateInventoryAdjustmentSchema,
} = require("../middlewares/validator");

// Get all inventory adjustments
exports.getInventoryAdjustments = async (req, res) => {
  try {
    const adjustments = await InventoryAdjustment.find()
      .populate("product", "name stockQuantity costPrice isPerishable batches")
      .populate("staff", "fullName")
      .populate("approvedBy", "fullName")
      .populate("adjustmentLocation", "name")
      .populate("referenceId", "totalAmount");

    res.status(200).json({ success: true, data: adjustments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching inventory adjustments",
      error: error.message,
    });
  }
};

// exports.createInventoryAdjustment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { error, value } = createInventoryAdjustmentSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors: error.details.map((detail) => detail.message),
//       });
//     }

//     const { product, changeInQuantity, previousQuantity, newQuantity, status } =
//       value;

//     const inventory = await Inventory.findById(product).session(session);
//     if (!inventory) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "Inventory item not found",
//       });
//     }

//     if (previousQuantity !== inventory.stockQuantity) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: `Previous quantity (${previousQuantity}) does not match current stock (${inventory.stockQuantity})`,
//       });
//     }
//     if (newQuantity !== inventory.stockQuantity + changeInQuantity) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "New quantity does not match expected value based on change",
//       });
//     }

//     let batchNumber = null;
//     if (inventory.isPerishable) {
//       const availableBatch = inventory.batches.find((b) => b.quantity > 0);
//       if (!availableBatch) {
//         await session.abortTransaction();
//         return res.status(400).json({
//           success: false,
//           message: "No available batches for perishable item",
//         });
//       }
//       batchNumber = availableBatch.batchNumber;
//     }

//     let adjustmentCost = changeInQuantity * inventory.costPrice;
//     if (inventory.isPerishable && batchNumber) {
//       const batch = inventory.batches.find(
//         (b) => b.batchNumber === batchNumber
//       );
//       const newBatchQuantity = batch.quantity + changeInQuantity;
//       if (newBatchQuantity < 0) {
//         await session.abortTransaction();
//         return res.status(400).json({
//           success: false,
//           message: `Batch quantity cannot be reduced below 0 (current: ${batch.quantity}, change: ${changeInQuantity})`,
//         });
//       }
//       batch.quantity = newBatchQuantity;
//       if (batch.quantity === 0) {
//         inventory.batches = inventory.batches.filter(
//           (b) => b.batchNumber !== batchNumber
//         );
//       }
//     }

//     const newAdjustment = new InventoryAdjustment({
//       ...value,
//       staff: req.user.id, // Set dynamically from auth middleware
//       adjustmentCost,
//       batchNumber: batchNumber || null,
//     });

//     if (status === "Approved") {
//       if (inventory.isPerishable && batchNumber) {
//         inventory.stockQuantity = inventory.batches.reduce(
//           (sum, b) => sum + b.quantity,
//           0
//         );
//       } else {
//         inventory.stockQuantity = newQuantity;
//       }
//       if (inventory.stockQuantity < 0) {
//         await session.abortTransaction();
//         return res.status(400).json({
//           success: false,
//           message: "Stock quantity cannot be reduced below 0",
//         });
//       }
//     }

//     await Promise.all([
//       newAdjustment.save({ session }),
//       inventory.save({ session }),
//     ]);

//     await session.commitTransaction();
//     res.status(201).json({
//       success: true,
//       message: "Inventory adjustment created successfully",
//       data: newAdjustment,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({
//       success: false,
//       message: "Error creating inventory adjustment",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };

// Update an inventory adjustment
// Update an inventory adjustment
exports.createInventoryAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check for authenticated user
    if (!req.user?.userId) {
      await session.abortTransaction();
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No authenticated user found",
      });
    }

    const { error, value } = createInventoryAdjustmentSchema.validate(req.body);
    if (error) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { product, changeInQuantity, previousQuantity, newQuantity, status } =
      value;

    const inventory = await Inventory.findById(product).session(session);
    if (!inventory) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (previousQuantity !== inventory.stockQuantity) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Previous quantity (${previousQuantity}) does not match current stock (${inventory.stockQuantity})`,
      });
    }
    if (newQuantity !== inventory.stockQuantity + changeInQuantity) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "New quantity does not match expected value based on change",
      });
    }

    let batchNumber = null;
    if (inventory.isPerishable) {
      const availableBatch = inventory.batches.find((b) => b.quantity > 0);
      if (!availableBatch) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "No available batches for perishable item",
        });
      }
      batchNumber = availableBatch.batchNumber;
    }

    let adjustmentCost = changeInQuantity * inventory.costPrice;
    if (inventory.isPerishable && batchNumber) {
      const batch = inventory.batches.find(
        (b) => b.batchNumber === batchNumber
      );
      const newBatchQuantity = batch.quantity + changeInQuantity;
      if (newBatchQuantity < 0) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Batch quantity cannot be reduced below 0 (current: ${batch.quantity}, change: ${changeInQuantity})`,
        });
      }
      batch.quantity = newBatchQuantity;
      if (batch.quantity === 0) {
        inventory.batches = inventory.batches.filter(
          (b) => b.batchNumber !== batchNumber
        );
      }
    }

    const newAdjustment = new InventoryAdjustment({
      ...value,
      staff: req.user.userId, // Changed from req.user.id to req.user.userId
      adjustmentCost,
      batchNumber: batchNumber || null,
    });

    if (status === "Approved") {
      if (inventory.isPerishable && batchNumber) {
        inventory.stockQuantity = inventory.batches.reduce(
          (sum, b) => sum + b.quantity,
          0
        );
      } else {
        inventory.stockQuantity = newQuantity;
      }
      if (inventory.stockQuantity < 0) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "Stock quantity cannot be reduced below 0",
        });
      }
    }

    await Promise.all([
      newAdjustment.save({ session }),
      inventory.save({ session }),
    ]);

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: "Inventory adjustment created successfully",
      data: newAdjustment,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Error creating inventory adjustment",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

exports.updateInventoryAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { error, value } = updateInventoryAdjustmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const adjustment = await InventoryAdjustment.findById(id).session(session);
    if (!adjustment) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Inventory adjustment not found",
      });
    }

    const inventory = await Inventory.findById(adjustment.product).session(
      session
    );
    if (!inventory) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    const oldStatus = adjustment.status;
    const oldChange = adjustment.changeInQuantity;
    const oldBatchNumber = adjustment.batchNumber;
    const newStatus = value.status || oldStatus;
    const newChange =
      value.changeInQuantity !== undefined ? value.changeInQuantity : oldChange;
    const newBatchNumber = inventory.isPerishable ? oldBatchNumber : null;
    const newQuantity =
      value.newQuantity !== undefined
        ? value.newQuantity
        : adjustment.newQuantity;

    if (
      value.newQuantity !== undefined ||
      value.changeInQuantity !== undefined
    ) {
      const expectedNewQuantity = adjustment.previousQuantity + newChange;
      if (newQuantity !== expectedNewQuantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message:
            "New quantity does not match expected value based on updated change",
        });
      }
    }

    let adjustmentCost = adjustment.adjustmentCost;
    if (inventory.isPerishable && newBatchNumber) {
      const batch = inventory.batches.find(
        (b) => b.batchNumber === newBatchNumber
      );
      if (!batch) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Batch '${newBatchNumber}' not found in inventory`,
        });
      }

      if (newStatus === "Approved" && oldStatus !== "Approved") {
        const newBatchQuantity = batch.quantity + newChange;
        if (newBatchQuantity < 0) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: `Batch quantity cannot be reduced below 0 (current: ${batch.quantity}, change: ${newChange})`,
          });
        }
        batch.quantity = newBatchQuantity;
        inventory.stockQuantity = inventory.batches.reduce(
          (sum, b) => sum + b.quantity,
          0
        );
        if (batch.quantity === 0) {
          inventory.batches = inventory.batches.filter(
            (b) => b.batchNumber !== newBatchNumber
          );
        }
      } else if (newStatus === "Cancelled" && oldStatus === "Approved") {
        batch.quantity -= oldChange;
        inventory.stockQuantity = inventory.batches.reduce(
          (sum, b) => sum + b.quantity,
          0
        );
        if (batch.quantity === 0) {
          inventory.batches = inventory.batches.filter(
            (b) => b.batchNumber !== oldBatchNumber
          );
        }
      } else if (
        newStatus === "Approved" &&
        oldStatus === "Approved" &&
        newChange !== oldChange
      ) {
        const delta = newChange - oldChange;
        const newBatchQuantity = batch.quantity + delta;
        if (newBatchQuantity < 0) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            message: `Batch quantity cannot be reduced below 0 (current: ${batch.quantity}, delta: ${delta})`,
          });
        }
        batch.quantity = newBatchQuantity;
        inventory.stockQuantity = inventory.batches.reduce(
          (sum, b) => sum + b.quantity,
          0
        );
        if (batch.quantity === 0) {
          inventory.batches = inventory.batches.filter(
            (b) => b.batchNumber !== newBatchNumber
          );
        }
      }
    } else {
      if (newStatus === "Approved" && oldStatus !== "Approved") {
        inventory.stockQuantity = newQuantity;
      } else if (newStatus === "Cancelled" && oldStatus === "Approved") {
        inventory.stockQuantity -= oldChange;
      } else if (
        newStatus === "Approved" &&
        oldStatus === "Approved" &&
        newChange !== oldChange
      ) {
        const delta = newChange - oldChange;
        inventory.stockQuantity += delta;
      }
    }

    if (value.changeInQuantity !== undefined) {
      adjustmentCost = newChange * inventory.costPrice;
    }
    if (newStatus === "Approved" && oldStatus !== "Approved") {
      value.approvedBy = req.user.id;
    }

    const updatedAdjustmentData = {
      ...value,
      batchNumber: newBatchNumber || null,
      adjustmentCost,
      staff: req.user.id, // Ensure staff is always set dynamically
    };

    const updatedAdjustment = await InventoryAdjustment.findByIdAndUpdate(
      id,
      updatedAdjustmentData,
      { new: true, session }
    );

    await inventory.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Inventory adjustment updated successfully",
      data: updatedAdjustment,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Error updating inventory adjustment",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Delete an inventory adjustment
exports.deleteInventoryAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const adjustment = await InventoryAdjustment.findById(id).session(session);
    if (!adjustment) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Inventory adjustment not found",
      });
    }

    let inventory;
    try {
      inventory = await Inventory.findById(adjustment.product).session(session);
    } catch (err) {
      console.warn(
        `Error fetching inventory item ${adjustment.product}: ${err.message}`
      );
    }

    if (!inventory) {
      console.warn(
        `Inventory item ${adjustment.product} not found; proceeding with deletion`
      );
    }

    // Revert stock only if adjustment was "Approved"
    if (adjustment.status === "Approved" && inventory) {
      if (inventory.isPerishable && adjustment.batchNumber) {
        const batch = inventory.batches.find(
          (b) => b.batchNumber === adjustment.batchNumber
        );
        if (batch) {
          batch.quantity -= adjustment.changeInQuantity;
          if (batch.quantity < 0) {
            console.warn(
              `Batch ${adjustment.batchNumber} quantity would be negative; setting to 0`
            );
            batch.quantity = 0;
          }
          if (batch.quantity === 0) {
            inventory.batches = inventory.batches.filter(
              (b) => b.batchNumber !== adjustment.batchNumber
            );
          }
          inventory.stockQuantity = inventory.batches.reduce(
            (sum, b) => sum + b.quantity,
            0
          );
        } else {
          console.warn(
            `Batch ${adjustment.batchNumber} not found in inventory ${adjustment.product}`
          );
        }
      } else {
        inventory.stockQuantity -= adjustment.changeInQuantity;
        if (inventory.stockQuantity < 0) {
          inventory.stockQuantity = 0; // Prevent negative stock
          console.warn(
            `Stock quantity for ${adjustment.product} would be negative; set to 0`
          );
        }
      }
      await inventory.save({ session });
    }

    const deletedAdjustment = await InventoryAdjustment.findByIdAndDelete(id, {
      session,
    });

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "Inventory adjustment deleted successfully",
      data: deletedAdjustment,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Error deleting inventory adjustment",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// New method: Get Daily Profit and Loss Report
exports.getDailyProfitAndLoss = async (req, res) => {
  try {
    // Calculate date range in Nigeria time (WAT, UTC+1)
    const currentDate = new Date();
    const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const nowInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

    // Set to current day (WAT)
    const startOfDay = new Date(nowInNigeria);
    startOfDay.setUTCHours(0, 0, 0, 0); // 00:00:00 WAT
    const endOfDay = new Date(nowInNigeria);
    endOfDay.setUTCHours(23, 59, 59, 999); // 23:59:59 WAT

    const dateString = nowInNigeria.toISOString().split("T")[0];

    // Fetch revenue from sales models
    const salesData = await Promise.all([
      SaleTransaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Laundry.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      HallTransaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            paymentStatus: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      FrontOfficeSale.aggregate([
        {
          $match: {
            date: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      Seminar.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    const revenue = salesData.reduce(
      (sum, result) => sum + (result.length > 0 ? result[0].total : 0),
      0
    );

    // Fetch COGS from InventoryAdjustment (type: "Issue")
    const cogsData = await InventoryAdjustment.aggregate([
      {
        $match: {
          transactionDate: { $gte: startOfDay, $lte: endOfDay },
          type: "Issue",
          status: "Approved",
        },
      },
      {
        $lookup: {
          from: "inventories",
          localField: "product",
          foreignField: "_id",
          as: "inventory",
        },
      },
      {
        $unwind: "$inventory",
      },
      {
        $project: {
          adjustmentCost: {
            $cond: {
              if: { $gt: ["$adjustmentCost", 0] },
              then: "$adjustmentCost",
              else: {
                $multiply: ["$changeInQuantity", "$inventory.costPrice"],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$adjustmentCost" },
        },
      },
    ]);
    const cogs = cogsData.length > 0 ? cogsData[0].totalCost : 0;

    // Fetch Inventory Losses from InventoryAdjustment (Damage, Theft, Expiry)
    const lossesData = await InventoryAdjustment.aggregate([
      {
        $match: {
          transactionDate: { $gte: startOfDay, $lte: endOfDay },
          adjustmentReason: { $in: ["Damage", "Theft", "Expiry"] },
          status: "Approved",
        },
      },
      {
        $lookup: {
          from: "inventories",
          localField: "product",
          foreignField: "_id",
          as: "inventory",
        },
      },
      {
        $unwind: "$inventory",
      },
      {
        $project: {
          adjustmentCost: {
            $cond: {
              if: { $gt: ["$adjustmentCost", 0] },
              then: "$adjustmentCost",
              else: {
                $multiply: ["$changeInQuantity", "$inventory.costPrice"],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLoss: { $sum: "$adjustmentCost" },
        },
      },
    ]);
    const inventoryLosses = lossesData.length > 0 ? lossesData[0].totalLoss : 0;

    // Calculate Profit
    const profit = revenue - cogs - inventoryLosses;

    res.status(200).json({
      success: true,
      data: {
        date: dateString,
        revenue,
        cogs,
        inventoryLosses,
        profit,
      },
      message: "Daily profit and loss report fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching daily profit and loss:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};
