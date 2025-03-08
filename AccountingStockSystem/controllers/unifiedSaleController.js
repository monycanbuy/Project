// controllers/unifiedSaleController.js
const mongoose = require("mongoose");
const UnifiedSales = require("../models/unifiedSalesModel");
const Dish = require("../models/productModel");
const Product = require("../models/dishesModel");
const PaymentMethod = require("../models/PaymentMethodModel");
const User = require("../models/userModel");

exports.getUnifiedSales = async (req, res) => {
  try {
    const sales = await UnifiedSales.find({})
      .populate("paymentMethod", "name")
      .populate("cashier", "name")
      .populate({
        path: "items.item",
        select: "name price",
        model: function (doc) {
          if (doc.itemType === "Dish") {
            return Dish; // Return the Dish model
          } else if (doc.itemType === "Product") {
            return Product; // Return the Product model
          } else {
            console.error(`Unexpected itemType: ${doc.itemType}`);
            return null; // Or handle this case appropriately
          }
        },
      });

    res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error("Error fetching unified sales:", error);
    console.error("Error stack:", error.stack); // Include stack trace for better debugging
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching sales.",
      details: error.message, // Send the actual error message
    });
  }
};

exports.createSale = async (req, res) => {
  const { saleType, paymentMethod, totalAmount } = req.body;

  try {
    // Validate initial sale data
    const { error } = createUnifiedSaleSchema.validate({
      saleType,
      paymentMethod,
      totalAmount,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Create sale document
    const newSale = new UnifiedSale({
      saleType,
      paymentMethod,
      totalAmount,
      cashier: req.user._id, // Assuming user ID is available from JWT
    });

    await newSale.save();

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale: newSale,
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({
      success: false,
      message: "Error creating sale",
    });
  }
};

exports.addSaleItem = async (req, res) => {
  const { saleId } = req.params;
  const { item, quantity, itemType } = req.body;

  try {
    // Validate input
    const { error } = addSaleItemSchema.validate({ item, quantity, itemType });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check if the sale exists
    const sale = await UnifiedSale.findById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // Check if the item exists based on its type
    let itemDoc;
    if (itemType === "Dish") {
      itemDoc = await Dish.findById(item);
    } else if (itemType === "Product") {
      itemDoc = await Product.findById(item);
    }

    if (!itemDoc) {
      return res.status(404).json({
        success: false,
        message: `${itemType} not found`,
      });
    }

    // Add the item to the sale
    const saleItem = {
      item: itemDoc._id,
      quantity,
      priceAtSale: itemDoc.price, // Assuming price is stored in both Dish and Product models
      subTotal: quantity * itemDoc.price,
      itemType,
    };

    sale.items.push(saleItem);
    sale.totalAmount += saleItem.subTotal; // Update total sale amount
    await sale.save();

    res.status(201).json({
      success: true,
      message: "Item added to sale successfully",
      saleItem: saleItem,
    });
  } catch (error) {
    console.error("Error adding item to sale:", error);
    res.status(500).json({
      success: false,
      message: "Error adding item to sale",
    });
  }
};

exports.updateSale = async (req, res) => {
  const { saleId } = req.params;
  const { saleType, paymentMethod, totalAmount, items } = req.body;

  try {
    // Validate input
    const { error } = updateUnifiedSaleSchema.validate({
      saleType,
      paymentMethod,
      totalAmount,
      items,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    // Validate saleId format
    if (!mongoose.Types.ObjectId.isValid(saleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sale ID format",
      });
    }

    // Find the sale by ID
    const sale = await UnifiedSale.findById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // Update fields if provided
    if (saleType) sale.saleType = saleType;
    if (paymentMethod) sale.paymentMethod = paymentMethod;
    if (totalAmount !== undefined) sale.totalAmount = totalAmount;

    // Handle items
    if (items && Array.isArray(items)) {
      // Check if each item exists in the database
      for (const item of items) {
        let itemDoc;
        if (item.itemType === "Dish") {
          itemDoc = await Dish.findById(item.item);
        } else if (item.itemType === "Product") {
          itemDoc = await Product.findById(item.item);
        }
        if (!itemDoc) {
          return res.status(400).json({
            success: false,
            message: `The ${item.itemType} with ID ${item.item} does not exist`,
          });
        }
      }

      // Replace or update items in sale
      sale.items = items.map((item) => ({
        item: item.item,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
        subTotal: item.quantity * item.priceAtSale, // Calculate subTotal
        itemType: item.itemType,
      }));
      // Recalculate totalAmount based on items
      sale.totalAmount = sale.items.reduce(
        (sum, item) => sum + item.subTotal,
        0
      );
    }

    const updatedSale = await sale.save();

    res.status(200).json({
      success: true,
      message: "Sale updated successfully",
      sale: updatedSale,
    });
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({
      success: false,
      message: "Error updating sale",
    });
  }
};

exports.getUnifiedSalesReport = async (req, res) => {
  try {
    // Fetch all unified sales records from the database
    const sales = await UnifiedSale.find().populate({
      // Populate the 'item' field within each sale's items array
      path: "items.item",
      // Use match to filter for either Dish or Product documents
      // This assumes you're using Mongoose discriminators for polymorphism
      match: { $or: [{ __t: "Dish" }, { __t: "Product" }] },
      // Select only the 'name' and 'price' fields from the populated documents
      select: "name price",
    });

    // Aggregate sales data by type (restaurant or minimart)
    const report = sales.reduce((acc, sale) => {
      // Determine the sale type (restaurant or minimart)
      const saleType = sale.saleType;

      // Initialize the accumulator for this sale type if it doesn't exist
      if (!acc[saleType]) {
        acc[saleType] = {
          totalSales: 0, // Sum of all sales of this type
          itemsSold: [], // Array to hold aggregated data for items sold
        };
      }

      // Accumulate the total sales amount for this type
      acc[saleType].totalSales += sale.totalAmount;

      // Process each item in the sale
      sale.items.forEach((item) => {
        const itemDetails = item.item; // The populated Dish or Product document

        if (!itemDetails) {
          console.warn("Warning: Missing item details for sale:", sale._id);
          return; // Skip this item if it's not properly populated
        }

        // Check if this item has already been added to the report for this sale type
        const existingItem = acc[saleType].itemsSold.find((i) =>
          i.itemId.equals(itemDetails._id)
        );

        if (existingItem) {
          // If the item already exists, update its quantity and total sales
          existingItem.quantity += item.quantity;
          existingItem.totalSold += item.subTotal;
        } else {
          // If it's a new item, add it to the itemsSold array with its details
          acc[saleType].itemsSold.push({
            name: itemDetails.name, // Name of the item
            itemId: itemDetails._id, // Unique ID of the item
            itemType: item.itemType, // Whether it's a Dish or Product
            quantity: item.quantity, // Number of items sold
            priceAtSale: item.priceAtSale, // Price at which the item was sold
            totalSold: item.subTotal, // Subtotal for this item in this sale
          });
        }
      });

      // Return the accumulator with updated data
      return acc;
    }, {}); // Start with an empty object for accumulation

    // Send the response with the generated report
    res.status(200).json({
      success: true,
      report: report, // Detailed report by sale type
      // Calculate overall total sales across all sale types
      totalSales: Object.values(report).reduce(
        (sum, type) => sum + type.totalSales,
        0
      ),
    });
  } catch (error) {
    // Log any errors that occur during report generation
    console.error("Error fetching sales report:", error);
    // Send an error response to the client
    res.status(500).json({
      success: false,
      message: "Error generating sales report",
    });
  }
};
