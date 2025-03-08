const mongoose = require("mongoose");
const Inventory = require("../models/inventoryModel");
const Alert = require("../models/alertModel");
const AuditLog = require("../models/auditLogModel");
const Location = require("../models/locationModel");
//const Sale = require("../models/anotherUnifiedSaleModel");
const Sale = require("../models/salesTransactionModel");
const PurchaseOrder = require("../models/purchaseOrderModel");
const InventoryAdjustment = require("../models/inventoryAdjustmentModel");
const cloudinary = require("cloudinary").v2;
const {
  createInventorySchema,
  updateInventorySchema,
} = require("../middlewares/validator");
const { sendEmail } = require("../middlewares/sendMail"); // Ensure correct import
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all inventories
// exports.getInventories = async (req, res) => {
//   try {
//     let query = Inventory.find();

//     // Query Parameters for Filtering
//     const { category, lowStock, nearExpiry, location, perishable } = req.query;

//     // Location filtering needs to be adjusted for array structure
//     if (location) {
//       query = query
//         .where("locationName")
//         .in(Array.isArray(location) ? location : [location]);
//     }

//     if (category) {
//       query = query.where("category", category);
//     }

//     if (lowStock) {
//       query = query.where("stockQuantity").lte(req.query.lowStock);
//     }

//     if (nearExpiry) {
//       const thresholdDate = new Date();
//       thresholdDate.setDate(thresholdDate.getDate() + parseInt(nearExpiry));
//       query = query.where("expiryDate").lte(thresholdDate);
//     }

//     if (perishable !== undefined) {
//       query = query.where("isPerishable", perishable === "true");
//     }

//     // Pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const total = await Inventory.countDocuments(query);
//     query = query.skip(startIndex).limit(limit);

//     const inventories = await query.populate([
//       { path: "category", select: "name" },
//       { path: "supplier", select: "contactPerson" },
//       { path: "stockKeeper", select: "fullName" },
//       { path: "locationName", select: "name" },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: inventories,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//       },
//       alerts: {
//         lowStock: inventories.filter((p) => p.stockQuantity <= p.reorderLevel)
//           .length,
//         nearExpiry: inventories.filter(
//           (p) =>
//             p.expiryDate &&
//             p.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
//         ).length,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching inventories",
//       error: error.message,
//     });
//   }
// };
// Get all inventories
exports.getInventories = async (req, res) => {
  try {
    let query = Inventory.find();

    const { category, lowStock, nearExpiry, location, perishable } = req.query;

    if (location) {
      query = query
        .where("locationName")
        .in(Array.isArray(location) ? location : [location]);
    }
    if (category) query = query.where("category", category);
    if (lowStock) query = query.where("stockQuantity").lte(req.query.lowStock);
    if (nearExpiry) {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + parseInt(nearExpiry));
      query = query.where("batches.expiryDate").lte(thresholdDate); // Updated for batches
    }
    if (perishable !== undefined)
      query = query.where("isPerishable", perishable === "true");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Inventory.countDocuments(query._conditions); // Adjusted for Mongoose 7+
    query = query.skip(startIndex).limit(limit);

    const inventories = await query.populate([
      { path: "category", select: "name" },
      { path: "supplier", select: "contactPerson" },
      { path: "stockKeeper", select: "fullName email" }, // Include email
      { path: "locationName", select: "name" },
    ]);

    res.status(200).json({
      success: true,
      data: inventories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
      alerts: {
        lowStock: inventories.filter((p) => p.stockQuantity <= p.reorderLevel)
          .length,
        nearExpiry: inventories.filter((p) =>
          p.batches.some(
            (b) =>
              b.expiryDate &&
              b.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          )
        ).length,
      },
    });
  } catch (error) {
    console.error("Error fetching inventories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventories",
      error: error.message,
    });
  }
};

// Create a new inventory
// Create a new inventory
// exports.createInventory = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res
//         .status(401)
//         .json({ success: false, message: "No authenticated user found" });
//     }

//     const { error, value } = createInventorySchema.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details.map((d) => d.message) });
//     }

//     const {
//       name,
//       description,
//       costPrice,
//       sellingPrice,
//       category,
//       stockQuantity,
//       supplier,
//       batches,
//       imageUrl,
//       reorderLevel,
//       reorderQuantity,
//       locationName,
//       unit,
//       isPerishable,
//       lastRestocked,
//       isActive,
//     } = value;

//     // Enhanced validations
//     if (costPrice < 0 || sellingPrice < 0 || stockQuantity < 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Prices and stock quantity cannot be negative",
//       });
//     }
//     if (isPerishable && (!batches || batches.length === 0)) {
//       return res.status(400).json({
//         success: false,
//         message: "Batches are required for perishable items",
//       });
//     }
//     if (batches) {
//       const invalidBatch = batches.find(
//         (b) =>
//           !b.batchNumber ||
//           b.quantity === undefined ||
//           (b.expiryDate && new Date(b.expiryDate) < new Date())
//       );
//       if (invalidBatch) {
//         return res
//           .status(400)
//           .json({ success: false, message: "Invalid batch data" });
//       }
//       const totalBatchQuantity = batches.reduce(
//         (sum, b) => sum + b.quantity,
//         0
//       );
//       if (totalBatchQuantity !== stockQuantity) {
//         return res.status(400).json({
//           success: false,
//           message: "Batch quantities must match stockQuantity",
//         });
//       }
//     }

//     let photoUrl;
//     if (imageUrl) {
//       try {
//         photoUrl = await cloudinary.uploader.upload(imageUrl, {
//           folder: "inventory_images",
//           width: 500,
//           height: 500,
//           crop: "limit",
//           quality: "auto",
//         });
//       } catch (cloudinaryError) {
//         console.error("Cloudinary upload error:", cloudinaryError);
//         return res.status(500).json({
//           success: false,
//           message: "Error uploading image to Cloudinary",
//           error: cloudinaryError.message,
//         });
//       }
//     }

//     const inventoryData = {
//       name,
//       description: description || "",
//       costPrice,
//       sellingPrice,
//       category,
//       stockQuantity,
//       supplier,
//       batches: batches || [],
//       imageUrl: photoUrl?.secure_url || "/utils/images/default.png",
//       stockKeeper: req.user.id, // Always set
//       reorderLevel,
//       reorderQuantity,
//       locationName,
//       unit,
//       isPerishable: isPerishable || false,
//       lastRestocked: lastRestocked || new Date(),
//       isActive: isActive !== undefined ? isActive : true,
//     };

//     const newInventory = await Inventory.create(inventoryData);
//     const populatedInventory = await Inventory.findById(newInventory._id)
//       .populate("category", "name")
//       .populate("supplier", "contactPerson")
//       .populate("stockKeeper", "fullName email")
//       .populate("locationName", "name");

//     const alerts = await exports.checkInventoryAlerts(populatedInventory);
//     if (alerts.length > 0) {
//       await exports.saveAlerts(alerts);
//       await exports.sendNotifications(alerts, { email: req.user.email });
//     }

//     await exports.createAuditLog(
//       req.user.id,
//       `Created inventory ${newInventory.name}`,
//       newInventory._id,
//       "Inventory"
//     );

//     res.status(201).json({
//       success: true,
//       message: "Inventory created successfully",
//       data: populatedInventory,
//     });
//   } catch (error) {
//     console.error("Error creating inventory:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating inventory",
//       error: error.message,
//     });
//   }
// };

exports.createInventory = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user found" });
    }

    const { error, value } = createInventorySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });
    }

    const {
      name,
      description,
      costPrice,
      sellingPrice,
      category,
      stockQuantity,
      supplier,
      batches,
      imageUrl,
      reorderLevel,
      reorderQuantity,
      locationName,
      unit,
      isPerishable,
      lastRestocked,
      isActive,
    } = value;

    // Enhanced validations
    if (costPrice < 0 || sellingPrice < 0 || stockQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Prices and stock quantity cannot be negative",
      });
    }
    if (isPerishable && (!batches || batches.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Batches are required for perishable items",
      });
    }
    if (isPerishable && batches) {
      // Only enforce batch check for perishable items
      const invalidBatch = batches.find(
        (b) =>
          !b.batchNumber ||
          b.quantity === undefined ||
          (b.expiryDate && new Date(b.expiryDate) < new Date())
      );
      if (invalidBatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid batch data" });
      }
      const totalBatchQuantity = batches.reduce(
        (sum, b) => sum + b.quantity,
        0
      );
      if (totalBatchQuantity !== stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Batch quantities (${totalBatchQuantity}) must match stockQuantity (${stockQuantity}) for perishable items`,
        });
      }
    }

    let photoUrl;
    if (imageUrl) {
      try {
        photoUrl = await cloudinary.uploader.upload(imageUrl, {
          folder: "inventory_images",
          width: 500,
          height: 500,
          crop: "limit",
          quality: "auto",
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image to Cloudinary",
          error: cloudinaryError.message,
        });
      }
    }

    const inventoryData = {
      name,
      description: description || "",
      costPrice,
      sellingPrice,
      category,
      stockQuantity,
      supplier,
      batches: batches || [], // Always include batches, even if empty
      imageUrl: photoUrl?.secure_url || "/utils/images/default.png",
      stockKeeper: req.user.userId,
      reorderLevel,
      reorderQuantity,
      locationName,
      unit,
      isPerishable: isPerishable || false,
      lastRestocked: lastRestocked || new Date(),
      isActive: isActive !== undefined ? isActive : true,
    };

    const newInventory = await Inventory.create(inventoryData);
    const populatedInventory = await Inventory.findById(newInventory._id)
      .populate("category", "name")
      .populate("supplier", "contactPerson")
      .populate("stockKeeper", "fullName email")
      .populate("locationName", "name");

    const alerts = await exports.checkInventoryAlerts(populatedInventory);
    if (alerts.length > 0) {
      await exports.saveAlerts(alerts);
      await exports.sendNotifications(alerts, { email: req.user.email });
    }

    await exports.createAuditLog(
      req.user.id,
      `Created inventory ${newInventory.name}`,
      newInventory._id,
      "Inventory"
    );

    res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      data: populatedInventory,
    });
  } catch (error) {
    console.error("Error creating inventory:", error);
    res.status(500).json({
      success: false,
      message: "Error creating inventory",
      error: error.message,
    });
  }
};

// Update inventory
exports.updateInventory = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user found" });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Inventory ID" });
    }

    const { error, value } = updateInventorySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });
    }

    const {
      name,
      description,
      costPrice,
      sellingPrice,
      category,
      stockQuantity,
      supplier,
      batches,
      imageUrl,
      reorderLevel,
      reorderQuantity,
      locationName,
      unit,
      isPerishable,
      lastRestocked,
      isActive,
    } = value;

    const oldInventory = await Inventory.findById(id);
    if (!oldInventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory not found" });
    }

    if (costPrice !== undefined && costPrice < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cost price cannot be negative" });
    }
    if (sellingPrice !== undefined && sellingPrice < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Selling price cannot be negative" });
    }
    if (stockQuantity !== undefined && stockQuantity < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Stock quantity cannot be negative" });
    }
    if (
      batches &&
      batches.some((b) => b.expiryDate && new Date(b.expiryDate) < new Date())
    ) {
      return res.status(400).json({
        success: false,
        message: "Batch expiry date cannot be in the past",
      });
    }

    let shouldCheckAlerts =
      stockQuantity !== undefined || batches !== undefined;

    let photoUrl;
    if (imageUrl) {
      try {
        if (typeof imageUrl !== "string") {
          return res
            .status(400)
            .json({ success: false, message: "imageUrl must be a string" });
        }
        if (imageUrl.startsWith("data:image")) {
          photoUrl = await cloudinary.uploader.upload(imageUrl, {
            folder: "inventory_images",
            width: 500,
            height: 500,
            crop: "limit",
            quality: "auto",
          });
        } else if (!imageUrl.includes("res.cloudinary.com")) {
          photoUrl = await cloudinary.uploader.upload(imageUrl, {
            folder: "inventory_images",
            width: 500,
            height: 500,
            crop: "limit",
            quality: "auto",
          });
        } else {
          photoUrl = { secure_url: imageUrl };
        }
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image to Cloudinary",
          error: cloudinaryError.message,
        });
      }
    }

    const updateData = {
      name,
      description,
      costPrice,
      sellingPrice,
      category,
      stockQuantity,
      supplier,
      batches,
      stockKeeper: req.user.userId,
      reorderLevel,
      reorderQuantity,
      locationName,
      unit,
      isPerishable,
      lastRestocked,
      isActive,
    };
    if (photoUrl?.secure_url) updateData.imageUrl = photoUrl.secure_url;
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate([
      { path: "category", select: "name" },
      { path: "supplier", select: "contactPerson" },
      { path: "stockKeeper", select: "fullName email" },
      { path: "locationName", select: "name" },
    ]);

    if (!updatedInventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory not found after update" });
    }

    if (
      sellingPrice !== undefined &&
      sellingPrice !== oldInventory.sellingPrice
    ) {
      await handlePriceChange(id, oldInventory.sellingPrice, sellingPrice);
    }

    if (shouldCheckAlerts) {
      const alerts = await exports.checkInventoryAlerts(updatedInventory);
      if (alerts.length > 0) {
        await exports.sendNotifications(alerts, { email: req.user.email });
        await exports.saveAlerts(alerts);
      }
    }

    await exports.createAuditLog(
      req.user.id,
      `Updated inventory ${updatedInventory.name}`,
      updatedInventory._id,
      "Inventory"
    );

    res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      data: updatedInventory,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({
      success: false,
      message: "Error updating inventory",
      error: error.message,
    });
  }
};

// Placeholder for handlePriceChange (adjust as needed)
const handlePriceChange = async (inventoryId, oldPrice, newPrice) => {
  // Example: Log price change or update related records
  console.log(
    `Price changed for inventory ${inventoryId}: ${oldPrice} -> ${newPrice}`
  );
};

// Delete inventory
exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Improved ID validation
      return res
        .status(400)
        .json({ success: false, message: "Invalid Inventory ID" });
    }

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory not found" });
    }

    // Before deleting, ensure all references are handled
    await exports.ensureHistoricalDataIntegrity(inventory._id); // Fixed reference

    // Delete the inventory from the Inventory collection
    const deletedInventory = await Inventory.findByIdAndDelete(id);

    // Log the deletion for auditing purposes
    await exports.createAuditLog(
      // Fixed reference here too
      req.user?.id || "system", // Fallback if req.user is undefined
      `Deleted inventory ${inventory.name}`,
      inventory._id,
      "Inventory"
    );

    res.status(200).json({
      success: true,
      message: "Inventory deleted successfully",
      data: deletedInventory,
    });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting inventory",
      error: error.message,
    });
  }
};
// --- 1. Low Stock Items ---
// controllers/inventoryController.js
exports.getLowStockReport = async (req, res) => {
  try {
    const lowStockItems = await Inventory.aggregate([
      {
        $addFields: {
          reorderLevelNumber: { $toDecimal: "$reorderLevel" }, // Convert to Decimal
        },
      },
      {
        $match: {
          $expr: {
            $lte: ["$stockQuantity", "$reorderLevelNumber"], // Compare with converted value
          },
        },
      },
      {
        $lookup: {
          //populate categories
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true }, // Handle if no category
      },
      {
        $lookup: {
          //populate locations
          from: "locations",
          localField: "locationName",
          foreignField: "_id",
          as: "locationData",
        },
      },
      {
        $unwind: { path: "$locationData", preserveNullAndEmptyArrays: true }, // Handle if no category
      },
      {
        $lookup: {
          //populate suppliers
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplierData",
        },
      },
      {
        $unwind: { path: "$supplierData", preserveNullAndEmptyArrays: true }, // Handle if no supplier
      },

      {
        $project: {
          //shape the output
          _id: 1,
          name: 1,
          description: 1,
          stockQuantity: 1,
          reorderLevel: "$reorderLevelNumber", // Use the converted value
          category: "$categoryData.name",
          supplier: "$supplierData.contactPerson",
          locationName: "$locationData.name",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: lowStockItems,
    });
  } catch (error) {
    console.error("Error fetching low stock report:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching low stock report",
      error: error.message,
    });
  }
};
// --- 2. Inventory Valuation by Category ---
exports.getInventoryValueByCategory = async (req, res) => {
  try {
    const results = await Inventory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $group: {
          _id: "$categoryData.name",
          totalValue: { $sum: { $multiply: ["$stockQuantity", "$price"] } },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalValue: 1,
        },
      },
      {
        $sort: { totalValue: -1 }, // Sort descending
      },
    ]);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching inventory value by category:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventory value by category",
      error: error.message,
    });
  }
};
// --- 3. Near Expiry Items ---
exports.getNearExpiryReport = async (req, res) => {
  try {
    const daysThreshold = parseInt(req.query.days) || 30; // Get days from query, default to 30
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const nearExpiryItems = await Inventory.find({
      expiryDate: { $lte: thresholdDate, $gte: new Date() }, //  expiry date is within the threshold AND not already expired
      isPerishable: true, // Only perishable items
    })
      .populate("category", "name")
      .populate("supplier", "contactPerson")
      .populate("locationName", "name")
      .select(
        "name description expiryDate stockQuantity category supplier locationName"
      );

    res.status(200).json({
      success: true,
      data: nearExpiryItems,
    });
  } catch (error) {
    console.error("Error fetching near expiry report:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching near expiry report",
      error: error.message,
    });
  }
};

// --- 4. Inventory By Location ---
exports.getInventoryByLocation = async (req, res) => {
  try {
    const result = await Inventory.aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "locationName",
          foreignField: "_id",
          as: "locationData",
        },
      },
      {
        $unwind: "$locationData",
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: "$categoryData",
      },
      {
        $group: {
          _id: {
            location: "$locationData.name",
            category: "$categoryData.name",
          },
          totalQuantity: { $sum: "$stockQuantity" },
          items: {
            $push: {
              //push item details
              name: "$name",
              description: "$description",
              stockQuantity: "$stockQuantity",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          location: "$_id.location",
          category: "$_id.category",
          totalQuantity: 1,
          items: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching Inventory By Location:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inventory by location",
      error: error.message,
    });
  }
};
// --- 5. Total Inventory  ---
exports.getTotalInventoryCount = async (req, res) => {
  try {
    const count = await Inventory.countDocuments(); // Count ALL documents
    res.status(200).json({ success: true, data: { count } }); // Consistent response format
  } catch (error) {
    console.error("Error fetching total inventory count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching total inventory count",
      error: error.message,
    });
  }
};

exports.getTotalInventoryValue = async (req, res) => {
  try {
    const result = await Inventory.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          totalValue: { $sum: { $multiply: ["$stockQuantity", "$price"] } },
        },
      },
      {
        $project: {
          _id: 0, // Don't need the _id field
          totalValue: 1,
        },
      },
    ]);

    // Handle the case where there are no inventory items.
    const totalValue = result.length > 0 ? result[0].totalValue : 0;

    res.status(200).json({ success: true, data: { totalValue } }); // Consistent response
  } catch (error) {
    console.error("Error fetching total inventory value:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching total inventory value",
      error: error.message,
    });
  }
};

//Get total number of near expiry product
exports.getTotalNearExpiry = async (req, res) => {
  try {
    const daysThreshold = parseInt(req.query.days) || 30; // Get days from query, default to 30
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const nearExpiryItems = await Inventory.find({
      expiryDate: { $lte: thresholdDate, $gte: new Date() }, //  expiry date is within the threshold AND not already expired
      isPerishable: true, // Only perishable items
    }).countDocuments();

    res.status(200).json({
      success: true,
      data: nearExpiryItems,
    });
  } catch (error) {
    console.error("Error fetching near expiry report:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching near expiry report",
      error: error.message,
    });
  }
};

exports.getTotalInventoryAndSales = async (req, res) => {
  try {
    const result = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$stockQuantity", "$price"] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalValue: 1,
        },
      },
    ]);

    const totalValue = result.length > 0 ? result[0].totalValue : 0;
    // Get today's date at midnight (start of day) and end of day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of next day
    const salesResult = await Sale.aggregate([
      {
        $match: {
          date: {
            $gte: today, // Greater than or equal to the start of today
            $lt: tomorrow, // Less than the start of tomorrow
          },
        },
      },
      {
        $group: {
          _id: null,
          totalDailySales: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalDailySales: 1,
        },
      },
    ]);
    const totalDailySales =
      salesResult.length > 0 ? salesResult[0].totalDailySales : 0;

    res
      .status(200)
      .json({ success: true, data: { totalValue, totalDailySales } });
  } catch (error) {
    console.error("Error fetching total inventory value and sales:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching total inventory value and sales",
      error: error.message,
    });
  }
};

// --- Get Total Daily Sales for Last 7 Days ---

// --- Get Total Daily Sales (Flexible Date Range) ---
exports.getTotalDailySales = async (req, res) => {
  try {
    // Get today's date at midnight (start of day) and end of day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of next day (exclusive)

    const salesResult = await Sale.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrow }, // Filter for sales *today* only.
        },
      },
      {
        $group: {
          _id: null, // Group *all* matching documents together.
          totalDailySales: { $sum: "$totalAmount" }, // Sum the 'totalAmount' field.
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field (we don't need it).
          totalDailySales: 1, // Include the calculated total.
        },
      },
    ]);

    // Handle the case where there are no sales today.
    const totalDailySales =
      salesResult.length > 0 ? salesResult[0].totalDailySales : 0;

    res.status(200).json({
      success: true,
      data: { totalDailySales }, // Return a consistent data structure.
    });
  } catch (error) {
    console.error("Error fetching total daily sales:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching total daily sales",
      error: error.message,
    });
  }
};

// --- Get Total Sales (All Time) ---
exports.getTotalSales = async (req, res) => {
  try {
    const salesResult = await Sale.aggregate([
      {
        $group: {
          _id: null, // Group *all* documents together
          totalSales: { $sum: "$totalAmount" }, // Sum the 'totalAmount' field (CHANGE IF NEEDED)
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          totalSales: 1, // Include the calculated total
        },
      },
    ]);

    // Handle the case where there are no sales records.
    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    res.status(200).json({
      success: true,
      data: { totalSales }, // Return in consistent format
    });
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching total sales",
      error: error.message,
    });
  }
};

// --- Get Daily Sales (Display over 7 days) ---
exports.getDailySales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get date range (startDate is optional)
    const { startDateObj, endDateObj } = getDateRange(startDate, endDate);

    // Build match stage dynamically
    const matchStage = {
      date: { $lte: endDateObj },
    };
    if (startDateObj) {
      matchStage.date.$gte = startDateObj;
    }

    const salesData = await Sale.aggregate([
      {
        $match: matchStage, // Filter by optional date range
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          totalSales: 1,
        },
      },
      {
        $sort: { date: 1 }, // Sort by date ascending
      },
    ]);

    res.status(200).json({
      success: true,
      data: salesData, // Array of all daily sales within range (or all if no startDate)
    });
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching daily sales",
      error: error.message,
    });
  }
};

// Add new method
exports.getTopSellingItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const topItems = await Sale.aggregate([
      // Only consider non-voided sales
      { $match: { isVoided: false } },
      // Unwind the items array to process each item individually
      { $unwind: "$items" },
      // Group by item to sum quantity and revenue
      {
        $group: {
          _id: "$items.item", // Group by item ObjectId
          totalQuantity: { $sum: "$items.quantity" },
          totalSales: {
            $sum: { $multiply: ["$items.quantity", "$items.priceAtSale"] },
          }, // Calculate revenue
        },
      },
      // Lookup item details from Inventory (for itemType: "Inventory")
      {
        $lookup: {
          from: "inventories", // Inventory collection
          localField: "_id",
          foreignField: "_id",
          as: "inventoryDetails",
        },
      },
      // Unwind inventoryDetails (optional, assuming most items are Inventory)
      {
        $unwind: {
          path: "$inventoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Project final fields
      {
        $project: {
          name: { $ifNull: ["$inventoryDetails.name", "Unknown Item"] }, // Fallback if no match
          totalSales: 1,
          totalQuantity: 1,
        },
      },
      // Sort by totalSales descending
      { $sort: { totalSales: -1 } },
      // Limit to top N items
      { $limit: limit },
    ]);

    if (!topItems.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No sales data available",
      });
    }

    res.status(200).json({
      success: true,
      data: topItems, // e.g., [{ name: "Item A", totalSales: 5000, totalQuantity: 50 }, ...]
    });
  } catch (error) {
    console.error("Error fetching top selling items:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching top selling items",
      error: error.message,
    });
  }
};

// Generate purchase order
exports.generatePurchaseOrder = async function (inventory) {
  const unitPrice = inventory.sellingPrice ?? inventory.costPrice;
  if (unitPrice === undefined || unitPrice === null) {
    throw new Error(
      `Cannot generate purchase order for '${inventory.name}' - missing sellingPrice and costPrice`
    );
  }

  const newPurchaseOrder = new PurchaseOrder({
    supplier: inventory.supplier,
    orderDate: new Date(),
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days
    items: [
      {
        inventory: inventory._id,
        quantityOrdered: inventory.reorderQuantity,
        unitPrice,
      },
    ],
    status: "Pending",
  });

  try {
    await newPurchaseOrder.save();
    await exports.createAuditLog(
      inventory.stockKeeper?._id || "system",
      `Generated purchase order for ${inventory.name}`,
      newPurchaseOrder._id,
      "PurchaseOrder"
    );
    console.log(`Purchase order generated for '${inventory.name}'`);
  } catch (error) {
    console.error("Error generating purchase order:", error);
    throw error;
  }
};

// exports.generatePurchaseOrder = async (inventory) => {
//   try {
//     const purchaseOrder = new PurchaseOrder({
//       supplier: inventory.supplier,
//       items: [
//         {
//           inventory: inventory._id,
//           quantityOrdered: inventory.reorderQuantity,
//           unitPrice: inventory.costPrice,
//         },
//       ],
//     });

//     const savedOrder = await purchaseOrder.save();

//     // Log the action in AuditLog
//     await AuditLog.create({
//       //userId: "systemUserId", // Replace with actual system user ID or req.user.id if available
//       action: "create",
//       description: `Auto-generated purchase order for low stock item: ${inventory.name}`,
//       resourceId: savedOrder._id,
//       resourceType: "PurchaseOrder", // This should now work
//     });

//     console.log(`Purchase order generated for ${inventory.name}`);
//     return savedOrder;
//   } catch (error) {
//     console.error("Error generating purchase order:", error);
//     throw error; // Re-throw to let cron job handle it
//   }
// };

exports.generatePurchaseOrder = async (inventory) => {
  try {
    const purchaseOrder = new PurchaseOrder({
      supplier: inventory.supplier,
      items: [
        {
          inventory: inventory._id,
          quantityOrdered: inventory.reorderQuantity,
          unitPrice: inventory.costPrice,
        },
      ],
    });

    const savedOrder = await purchaseOrder.save();

    // Include stockKeeper._id as userId if available
    const auditLogData = {
      action: "create",
      description: `Auto-generated purchase order for low stock item: ${inventory.name}`,
      resourceId: savedOrder._id,
      resourceType: "PurchaseOrder",
    };

    if (inventory.stockKeeper?._id) {
      auditLogData.userId = inventory.stockKeeper._id;
    }

    await AuditLog.create(auditLogData);

    console.log(`Purchase order generated for ${inventory.name}`);
    return savedOrder;
  } catch (error) {
    console.error("Error generating purchase order:", error);
    throw error;
  }
};

// exports.checkInventoryAlerts = async (inventory) => {
//   const alerts = [];
//   if (inventory.stockQuantity <= inventory.reorderLevel) {
//     alerts.push({
//       type: "lowStock",
//       message: `Inventory ${inventory.name} is below reorder level (${inventory.reorderLevel}). Current stock: ${inventory.stockQuantity}`,
//     });
//   }
//   return alerts;
// };

// Check inventory alerts
// exports.checkInventoryAlerts = async function (inventory) {
//   const currentDate = new Date();
//   const alerts = [];
//   const defaultEmail = process.env.ADMIN_EMAIL || "admin@example.com";

//   if (!inventory.stockKeeper) {
//     console.log(
//       `Inventory '${inventory.name}' (ID: ${inventory._id}) has no stockKeeper`
//     );
//   }

//   if (inventory.stockQuantity <= inventory.reorderLevel) {
//     const alert = {
//       type: "lowStock",
//       message: `Inventory '${inventory.name}' stock is below reorder level. Current stock: ${inventory.stockQuantity}.`,
//       action: "reorder",
//       data: {
//         inventoryId: inventory._id,
//         reorderQuantity: inventory.reorderQuantity,
//       },
//       user: inventory.stockKeeper?._id || null,
//     };
//     alerts.push(alert);
//     try {
//       await exports.generatePurchaseOrder(inventory);
//     } catch (poError) {
//       console.error(
//         `Failed to generate purchase order for '${inventory.name}':`,
//         poError.message
//       );
//     }
//   }

//   if (inventory.isPerishable && inventory.batches.length > 0) {
//     inventory.batches.forEach((batch) => {
//       if (batch.expiryDate) {
//         const daysUntilExpiry = Math.ceil(
//           (batch.expiryDate - currentDate) / (1000 * 60 * 60 * 24)
//         );
//         if (daysUntilExpiry <= 30) {
//           alerts.push({
//             type: "nearExpiry",
//             message: `Batch '${batch.batchNumber}' of '${inventory.name}' is nearing expiry. Days left: ${daysUntilExpiry}.`,
//             action: "useOrSell",
//             data: {
//               inventoryId: inventory._id,
//               batchNumber: batch.batchNumber,
//               daysUntilExpiry,
//             },
//             user: inventory.stockKeeper?._id || null,
//           });
//         }
//       }
//     });
//   }

//   if (alerts.length > 0) {
//     await exports.saveAlerts(alerts);
//     const notificationEmail = inventory.stockKeeper?.email || defaultEmail;
//     await exports.sendNotifications(alerts, { email: notificationEmail });
//   }

//   return alerts;
// };

exports.checkInventoryAlerts = async function (inventory) {
  const currentDate = new Date();
  const alerts = [];

  if (!inventory.stockKeeper) {
    console.log(
      `Inventory '${inventory.name}' (ID: ${inventory._id}) has no stockKeeper`
    );
  }

  if (inventory.stockQuantity <= inventory.reorderLevel) {
    const alert = {
      type: "lowStock",
      message: `Inventory '${inventory.name}' stock is below reorder level. Current stock: ${inventory.stockQuantity}.`,
      action: "reorder",
      data: {
        inventoryId: inventory._id,
        reorderQuantity: inventory.reorderQuantity,
      },
      user: inventory.stockKeeper?._id || null,
    };
    alerts.push(alert);
    try {
      await exports.generatePurchaseOrder(inventory);
    } catch (poError) {
      console.error(
        `Failed to generate purchase order for '${inventory.name}':`,
        poError.message
      );
    }
  }

  if (inventory.isPerishable && inventory.batches.length > 0) {
    inventory.batches.forEach((batch) => {
      if (batch.expiryDate) {
        const daysUntilExpiry = Math.ceil(
          (batch.expiryDate - currentDate) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilExpiry <= 30) {
          alerts.push({
            type: "nearExpiry",
            message: `Batch '${batch.batchNumber}' of '${inventory.name}' is nearing expiry. Days left: ${daysUntilExpiry}.`,
            action: "useOrSell",
            data: {
              inventoryId: inventory._id,
              batchNumber: batch.batchNumber,
              daysUntilExpiry,
            },
            user: inventory.stockKeeper?._id || null,
          });
        }
      }
    });
  }

  if (alerts.length > 0) {
    await exports.saveAlerts(alerts);
    if (inventory.stockKeeper?.email) {
      // Only send if email exists
      console.log(`Sending notification to: ${inventory.stockKeeper.email}`);
      await exports.sendNotifications(alerts, {
        email: inventory.stockKeeper.email,
      });
    } else {
      console.log(
        `No stock keeper email for ${inventory.name}, skipping notification`
      );
    }
  }

  return alerts;
};

// Placeholder for sendNotifications (adjust based on your actual implementation)
exports.sendNotifications = async (alerts, { email }) => {
  for (const alert of alerts) {
    await sendEmail(email, `Alert: ${alert.type}`, alert.message);
  }
};

// Save alerts
exports.saveAlerts = async function (alerts) {
  try {
    const savedAlerts = await Alert.insertMany(alerts);
    console.log(`Alerts saved successfully: ${savedAlerts.length} alerts`);
  } catch (error) {
    console.error("Error saving alerts to database:", error);
    throw error;
  }
};

// Send notifications
exports.sendNotifications = async function (alerts, { email }) {
  for (const alert of alerts) {
    try {
      const mailOptions = {
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        to: email,
        subject: `Alert: ${alert.type} for ${alert.data.inventoryId}`,
        text: alert.message,
        html: `<p>${alert.message}</p>`,
      };
      const info = await sendEmail(
        mailOptions.to,
        mailOptions.subject,
        mailOptions.text
      );
      console.log("Message sent: %s", info.messageId || "<no messageId>");
    } catch (error) {
      console.error("Error sending email for alert:", alert.type, error);
    }
  }
};

// Create audit log
// exports.createAuditLog = async function (
//   userId,
//   actionDescription,
//   resourceId = null,
//   resourceType = null
// ) {
//   try {
//     const auditLog = new AuditLog({
//       userId: userId || "system",
//       action: actionDescription.split(" ")[0],
//       description: actionDescription,
//       resourceId,
//       resourceType,
//     });
//     await auditLog.save();
//     console.log(`Audit Log created: ${actionDescription}`);
//   } catch (error) {
//     console.error("Failed to create audit log:", error);
//     throw error;
//   }
// };
exports.createAuditLog = async function (
  userId,
  actionDescription,
  resourceId = null,
  resourceType = null
) {
  try {
    const auditLogData = {
      action: actionDescription.split(" ")[0],
      description: actionDescription,
      resourceId,
      resourceType,
    };

    // Only set userId if it's provided and valid; otherwise, leave it null
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      auditLogData.userId = userId;
    } else {
      auditLogData.userId = null; // Aligns with required: false
    }

    const auditLog = new AuditLog(auditLogData);
    await auditLog.save();
    console.log(`Audit Log created: ${actionDescription}`);
  } catch (error) {
    console.error("Failed to create audit log:", error);
    throw error;
  }
};

exports.ensureHistoricalDataIntegrity = async function (inventoryId) {
  try {
    // Update Sales records
    await Sale.updateMany(
      { "items.item": inventoryId },
      { $set: { "items.$.itemStatus": "deleted" } }
    );

    // Update Purchase Orders
    await PurchaseOrder.updateMany(
      { "items.inventory": inventoryId },
      { $set: { "items.$.itemStatus": "deleted" } }
    );

    // Update Inventory Adjustments
    await InventoryAdjustment.updateMany(
      { inventory: inventoryId },
      { $set: { inventoryStatus: "deleted" } }
    );
  } catch (error) {
    console.error("Error in ensureHistoricalDataIntegrity:", error);
    throw error; // Handle appropriately
  }
};

// Helper to normalize date range (optional)
const getDateRange = (startDate, endDate) => {
  let startDateObj = startDate ? new Date(startDate) : null;
  let endDateObj = endDate ? new Date(endDate) : new Date();

  if (startDateObj && isNaN(startDateObj)) {
    throw new Error("Invalid startDate format. Use YYYY-MM-DD.");
  }
  if (isNaN(endDateObj)) {
    throw new Error("Invalid endDate format. Use YYYY-MM-DD.");
  }

  if (startDateObj) startDateObj.setHours(0, 0, 0, 0);
  endDateObj.setHours(23, 59, 59, 999);

  if (startDateObj && startDateObj > endDateObj) {
    throw new Error("startDate cannot be after endDate");
  }

  return { startDateObj, endDateObj };
};

const path = require("path");
const fs = require("fs");

function handleImageUpload(req, imageUrl) {
  let imagePath = imageUrl;

  if (req.file) {
    // If a file was uploaded, use its path
    imagePath = `/uploads/${req.file.filename}`;
  } else if (
    typeof imageUrl === "string" &&
    imageUrl.startsWith("data:image")
  ) {
    // If imageUrl is a base64 string, decode it and save as a file
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
    const fileType = imageUrl.match(/^data:image\/(\w+);base64,/)[1];
    const fileName = `image-${Date.now()}.${fileType}`;
    const filePath = path.join("uploads", fileName);

    // Write the file to disk
    fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
    imagePath = `/uploads/${fileName}`;
  }

  return imagePath;
}
