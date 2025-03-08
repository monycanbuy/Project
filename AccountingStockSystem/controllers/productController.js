const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Alert = require("../models/alertModel");
const AuditLog = require("../models/auditLogModel");
const Location = require("../models/locationModel");
const AnotherUnifiedSale = require("../models/anotherUnifiedSaleModel");
const PurchaseOrder = require("../models/purchaseOrderModel"); // Import the PurchaseOrder model
const InventoryAdjustment = require("../models/inventoryAdjustmentModel"); // Adjust the path as needed

const {
  createProductSchema,
  updateProductSchema,
} = require("../middlewares/validator");
const transport = require("../middlewares/sendMail");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    let query = Product.find();

    // Query Parameters for Filtering
    const { category, lowStock, nearExpiry, location, perishable } = req.query;

    // Location filtering needs to be adjusted for array structure
    if (location) {
      //If location is an array
      if (Array.isArray(location)) {
        query = query.where("location.locations").in(location);
      } else {
        query = query.where("location.locations", location);
      }
    }

    if (category) {
      query = query.where("category", category);
    }

    if (lowStock) {
      query = query.where("stockQuantity").lte(req.query.lowStock);
    }

    if (nearExpiry) {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + parseInt(nearExpiry));
      query = query.where("expiryDate").lte(thresholdDate);
    }

    if (perishable !== undefined) {
      query = query.where("isPerishable", perishable === "true");
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Product.countDocuments(query);
    query = query.skip(startIndex).limit(limit);

    const products = await query.populate([
      {
        path: "category",
        select: "name",
      },
      {
        path: "supplier",
        select: "contactPerson",
      },
      {
        path: "stockKeeper",
        select: "fullName",
      },
      {
        path: "location.locations", // Correct path for population
        select: "name _id",
      },
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
      alerts: {
        lowStock: products.filter((p) => p.stockQuantity <= p.reorderLevel)
          .length,
        nearExpiry: products.filter(
          (p) =>
            p.expiryDate &&
            p.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createProductSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const {
      name,
      description,
      price,
      category,
      stockQuantity,
      supplier,
      expiryDate,
      imageUrl,
      reorderLevel,
      reorderQuantity,
      location,
      unit,
      isPerishable,
      lastRestocked,
    } = value;

    // Validation for expiryDate
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Expiry date cannot be in the past" });
    }

    const productData = {
      name,
      description,
      price,
      category,
      stockQuantity,
      supplier,
      expiryDate,
      imageUrl,
      stockKeeper: req.user.id,
      reorderLevel,
      reorderQuantity,
      location,
      unit,
      isPerishable,
      lastRestocked,
    };

    const newProduct = await Product.create(productData);

    // Check if this product needs immediate alerts
    await checkProductAlerts(newProduct);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};
// exports.createProduct = async (req, res) => {
//   try {
//     const { error, value } = createProductSchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }

//     const {
//       name,
//       description,
//       price,
//       category,
//       stockQuantity,
//       supplier,
//       expiryDate,
//       imageUrl,
//       reorderLevel,
//       reorderQuantity,
//       location,
//       unit,
//       isPerishable,
//       lastRestocked,
//     } = value;

//     if (expiryDate && new Date(expiryDate) < new Date()) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Expiry date cannot be in the past" });
//     }

//     // *** Improved Location Handling (Most Important) ***
//     // const locationData = Array.isArray(location)
//     //   ? location.map((loc) => ({
//     //       locations: new mongoose.Types.ObjectId(loc.locations), // Convert to ObjectId here
//     //       name: loc.name || "Default Location Name",
//     //     }))
//     //   : location && location.locations
//     //   ? [
//     //       {
//     //         locations: new mongoose.Types.ObjectId(location.locations), // Convert to ObjectId here
//     //         name: location.name || "Default Location Name",
//     //       },
//     //     ]
//     //   : []; // Empty array if no location provided

//     const productData = {
//       name,
//       description,
//       price,
//       category,
//       stockQuantity,
//       supplier,
//       expiryDate,
//       imageUrl,
//       stockKeeper: req.user.id,
//       reorderLevel,
//       reorderQuantity,
//       //location: locationData, // Use the correctly formatted location data
//       unit,
//       isPerishable,
//       lastRestocked,
//     };
//     console.log("Request Body:", req.body);
//     console.log("Product Data:", productData);
//     const newProduct = new Product(productData); // Or await Product.create(productData)

//     const savedProduct = await newProduct.save(); // It's good practice to save and then get the saved document

//     await checkProductAlerts(savedProduct);

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data: savedProduct, // Send the saved product in the response
//     });
//   } catch (error) {
//     console.error("Error creating product:", error); // Log the full error object!
//     res.status(500).json({
//       success: false,
//       message: "Error creating product",
//       error: error.message, // Send the error message to the client
//     });
//   }
// };

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const { error, value } = updateProductSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const {
      name,
      description,
      price,
      category,
      stockQuantity,
      supplier,
      expiryDate,
      imageUrl,
      stockKeeper,
      reorderLevel,
      reorderQuantity,
      location,
      unit,
      isPerishable,
      lastRestocked,
    } = value;

    // Additional validations or transformations
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Expiry date cannot be in the past" });
    }

    let shouldCheckAlerts = false;
    if ("stockQuantity" in value) {
      shouldCheckAlerts = true;
    }

    // Capture the old price before update
    const oldProduct = await Product.findById(id);
    const oldPrice = oldProduct?.price;
    //const oldPrice = oldProduct ? oldProduct.price : null;

    // const locationData = Array.isArray(location)
    //   ? location
    //   : location
    //   ? [{ locations: location, name: location }]
    //   : oldProduct.location || [];
    const locationData = location
      ? Array.isArray(location)
        ? location
        : [{ locations: location }]
      : oldProduct?.location || []; // Handle undefined location

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          ...value,
          location: locationData, // Update location to be an array
          stockKeeper: req.user.id, // Ensure stockKeeper is always the current user
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("category", "name") // Populate only the name for category
      .populate("supplier", "contactPerson") // Populate only contactPerson for supplier
      .populate("location.locations", "name _id"); // Populate only name for location

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If price was updated, handle historical data
    if (price !== oldPrice) {
      await handlePriceChange(id, oldPrice, price);
    }

    // Check for alerts if stock quantity has been altered
    if (shouldCheckAlerts) {
      const alerts = await checkProductAlerts(updatedProduct);
      if (alerts.length > 0) {
        await sendNotifications(alerts, { email: req.user.email });
        await saveAlerts(alerts);
      }
    }

    // Log update for audit purposes
    await createAuditLog(
      req.user.id,
      `Updated product ${updatedProduct.name}`,
      updatedProduct._id,
      "Product"
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};
// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Product ID is required" });
//     }

//     const { error, value } = updateProductSchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }

//     const {
//       name,
//       description,
//       price,
//       category,
//       stockQuantity,
//       supplier,
//       expiryDate,
//       imageUrl,
//       stockKeeper,
//       reorderLevel,
//       reorderQuantity,
//       location,
//       unit,
//       isPerishable,
//       lastRestocked,
//     } = value;

//     // Additional validations or transformations
//     if (expiryDate && new Date(expiryDate) < new Date()) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Expiry date cannot be in the past" });
//     }

//     let shouldCheckAlerts = false;
//     if ("stockQuantity" in value) {
//       shouldCheckAlerts = true;
//     }

//     // Capture the old price before update
//     const oldProduct = await Product.findById(id);
//     const oldPrice = oldProduct ? oldProduct.price : null;

//     // Update the product
//     // const updatedProduct = await Product.findByIdAndUpdate(
//     //   id,
//     //   {
//     //     $set: {
//     //       ...value,
//     //       stockKeeper: req.user.id, // Ensure stockKeeper is always the current user
//     //     },
//     //   },
//     //   {
//     //     new: true,
//     //     runValidators: true,
//     //   }
//     // ).populate("category supplier stockKeeper location");

//     // if (!updatedProduct) {
//     //   return res.status(404).json({
//     //     success: false,
//     //     message: "Product not found",
//     //   });
//     // }
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           ...value,
//           stockKeeper: req.user.id, // Ensure stockKeeper is always the current user
//         },
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     // .populate("category", "name") // Populate only the name for category
//     // .populate("supplier", "contactPerson"); // Populate only contactPerson for supplier

//     if (!updatedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // If price was updated, handle historical data
//     if (price !== oldPrice) {
//       await handlePriceChange(id, oldPrice, price);
//     }

//     // Check for alerts if stock quantity has been altered
//     if (shouldCheckAlerts) {
//       const alerts = await checkProductAlerts(updatedProduct);
//       if (alerts.length > 0) {
//         await sendNotifications(alerts, { email: req.user.email });
//         await saveAlerts(alerts);
//       }
//     }

//     // Log update for audit purposes
//     await createAuditLog(
//       req.user.id,
//       `Updated product ${updatedProduct.name}`,
//       updatedProduct._id,
//       "Product"
//     );

//     // res.status(200).json({
//     //   success: true,
//     //   message: "Product updated successfully",
//     //   data: updatedProduct,
//     // });
//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       data: {
//         ...updatedProduct.toObject(),
//         category: updatedProduct.category.toString(),
//         supplier: updatedProduct.supplier.toString(),
//       },
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating product",
//       error: error.message,
//     });
//   }
// };

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Before deleting, ensure all references are handled
    await ensureHistoricalDataIntegrity(product._id);

    // Delete the product from the Product collection
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Log the deletion for auditing purposes
    await createAuditLog(
      req.user.id,
      `Deleted product ${product.name}`,
      product._id,
      "Product"
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// Helper function for checking alerts (implementation details omitted for brevity)

async function checkProductAlerts(product) {
  const currentDate = new Date();
  const alerts = [];

  // Check if stock is below reorder level
  if (product.stockQuantity <= product.reorderLevel) {
    alerts.push({
      type: "lowStock",
      message: `Product '${product.name}' stock is below reorder level. Current stock: ${product.stockQuantity}.`,
      action: "reorder",
      data: {
        productId: product._id,
        reorderQuantity: product.reorderQuantity,
      },
    });

    // Semi-automated purchase order generation
    await generatePurchaseOrder(product);
  }

  // Check if the product is near expiry (assuming "near" means within 30 days for this example)
  if (product.expiryDate && product.isPerishable) {
    const daysUntilExpiry = Math.ceil(
      (product.expiryDate - currentDate) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiry <= 30) {
      // Adjust this number based on your definition of "near"
      alerts.push({
        type: "nearExpiry",
        message: `Product '${product.name}' is nearing its expiry date. Days left: ${daysUntilExpiry}.`,
        action: "useOrSell",
        data: {
          productId: product._id,
          daysUntilExpiry: daysUntilExpiry,
        },
      });
    }
  }

  // Store alerts or send notifications
  if (alerts.length > 0) {
    // Here you would typically:
    // - Save alerts to the database
    // - Send notifications via email, SMS, or in-app notifications
    await saveAlerts(alerts);
    await sendNotifications(alerts);
  }

  return alerts;
}

async function generatePurchaseOrder(product) {
  const newPurchaseOrder = new PurchaseOrder({
    supplier: product.supplier,
    orderDate: new Date(),
    items: [
      {
        inventory: product._id,
        quantityOrdered: product.reorderQuantity,
        unitPrice: product.price, // Assuming price here is the purchase price, adjust if not
      },
    ],
    status: "Pending",
  });

  try {
    await newPurchaseOrder.save();
    // Log this action for audit purposes
    await createAuditLog(
      req.user.id,
      `Generated purchase order for ${product.name}`
    );
  } catch (error) {
    console.error("Error generating purchase order:", error);
    // Potentially re-throw or handle this error more gracefully
  }
}

// Helper function to save alerts (placeholder)
async function saveAlerts(alerts) {
  try {
    const savedAlerts = await Alert.insertMany(alerts);
    console.log(`Alerts saved successfully: ${savedAlerts.length} alerts.`);
    return savedAlerts; // Return the saved alerts if needed for further processing
  } catch (error) {
    console.error("Error saving alerts to database:", error);
    throw error; // Rethrow the error so the calling function can handle it
  }
}

// Helper function to send notifications (placeholder)
async function sendNotifications(alerts, existingUser) {
  for (const alert of alerts) {
    try {
      let mailOptions = {
        from: process.env.EMAIL_USER, // Use the same user for authentication
        to: existingUser.email,
        subject: `Alert: ${alert.type} for ${alert.data.productId}`,
        text: alert.message, // including plain text is a good practice
        html: `<p>${alert.message}</p>`,
      };

      // Send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email for alert:", alert.type, error);
    }
  }
}

// Helper function to create an audit log (placeholder)
async function createAuditLog(
  userId,
  actionDescription,
  resourceId = null,
  resourceType = null
) {
  try {
    const auditLog = new AuditLog({
      userId: userId,
      action: actionDescription.split(" ")[0], // First word as action type, if applicable
      description: actionDescription,
      resourceId: resourceId,
      resourceType: resourceType,
    });

    await auditLog.save();
    console.log(`Audit Log created for User ${userId}: ${actionDescription}`);
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Here, you might want to decide whether to throw the error or handle it silently.
    // Throwing might be better for critical operations where logging is essential.
    throw error;
  }
}

async function ensureHistoricalDataIntegrity(productId) {
  const [Sale, PurchaseOrder, InventoryAdjustment] = await Promise.all([
    mongoose.model("Sale"),
    mongoose.model("PurchaseOrder"),
    mongoose.model("InventoryAdjustment"),
  ]);

  // Update Sales records
  await Sale.updateMany(
    { "items.item": productId },
    {
      $set: {
        "items.$.itemStatus": "deleted", // Mark the item as deleted within the sales document
      },
    }
  );

  // Update Purchase Orders
  await PurchaseOrder.updateMany(
    { "items.inventory": productId },
    {
      $set: {
        "items.$.itemStatus": "deleted",
      },
    }
  );

  // Update Inventory Adjustments
  await InventoryAdjustment.updateMany(
    { product: productId },
    {
      $set: {
        productStatus: "deleted",
      },
    }
  );

  // Add more collections as necessary
}

// New helper function to handle price changes without affecting historical data
async function handlePriceChange(productId, oldPrice, newPrice) {
  const [Sale, PurchaseOrder] = await Promise.all([
    mongoose.model("Sale"),
    mongoose.model("PurchaseOrder"),
  ]);

  const updateDate = new Date();

  // Update Sales - mark previous transactions with the old price
  await Sale.updateMany(
    { "items.item": productId, date: { $lt: updateDate } },
    {
      $set: {
        "items.$[item].priceAtSale": oldPrice,
      },
    },
    { arrayFilters: [{ "item.item": productId }] }
  );

  // Update Purchase Orders - similar logic for any open orders
  await PurchaseOrder.updateMany(
    { "items.inventory": productId, orderDate: { $lt: updateDate } },
    {
      $set: {
        "items.$[item].unitPrice": oldPrice,
      },
    },
    { arrayFilters: [{ "item.inventory": productId }] }
  );

  // Log or perform any other actions here, like notifying users of price changes
}
