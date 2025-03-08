// controllers/saleController.js
const Sale = require("../models/salesModel");
const SaleItem = require("../models/saleItemModel");
const Dish = require("../models/dishesModel");
const {
  createSaleSchema,
  addSaleItemSchema,
  updateSaleSchema,
} = require("../middlewares/validator");
const { applyDiscount } = require("../utils/discountPolicy");

exports.createSale = async (req, res) => {
  const { paymentMethod } = req.body;

  try {
    // Validate input
    const { error } = createSaleSchema.validate({ paymentMethod });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Create new sale
    const newSale = new Sale({ paymentMethod });
    const savedSale = await newSale.save();

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale: savedSale,
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
  const { dish, quantity } = req.body; // Assuming dish is an ID and quantity is provided

  try {
    // Validate input
    const { error } = addSaleItemSchema.validate({ dish, quantity });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check if the sale exists
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // Check if the dish exists
    const foundDish = await Dish.findById(dish);
    if (!foundDish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    // Create SaleItem
    const saleItem = new SaleItem({
      sale: saleId,
      dish: dish,
      quantity: quantity,
      unitPrice: foundDish.price,
      totalAmount: quantity * foundDish.price,
    });

    const savedSaleItem = await saleItem.save();

    // Update total Amount of the Sale
    sale.totalAmount += savedSaleItem.totalAmount;

    // Apply discounts - this is new
    const items = await SaleItem.find({ sale: saleId });
    const { sale: updatedSale, saleItems } = await applyDiscount(sale, items);

    // Save the updated sale with discount info
    await updatedSale.save();
    await Promise.all(saleItems.map((item) => item.save()));

    res.status(201).json({
      success: true,
      message: "Item added to sale and discounts applied successfully",
      saleItem: savedSaleItem,
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
  const { paymentMethod, totalAmount, discount } = req.body; // Add discount to the body

  try {
    // Validate input
    const { error } = updateSaleSchema.validate({
      paymentMethod,
      totalAmount,
      discount,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Check if the sale exists
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // Update payment method if provided
    if (paymentMethod) {
      sale.paymentMethod = paymentMethod;
    }

    // Update total amount if provided
    if (totalAmount !== undefined) {
      sale.totalAmount = totalAmount;
    }

    // Apply discount if provided
    if (discount !== undefined) {
      // Ensure discount is between 0 and 100
      const appliedDiscount = Math.min(Math.max(discount, 0), 100);
      sale.discount = appliedDiscount;
      sale.discountedTotal =
        sale.totalAmount - sale.totalAmount * (appliedDiscount / 100);
    } else {
      // If no discount is provided, reset it to 0
      sale.discount = 0;
      sale.discountedTotal = sale.totalAmount;
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

exports.getAllSales = async (req, res) => {
  try {
    // Destructure query parameters for filtering, sorting, and pagination
    const {
      paymentMethod,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    // Build the query
    let query = Sale.find();

    // Apply filters
    if (paymentMethod) {
      query = query.where("paymentMethod").equals(paymentMethod);
    }

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      query = query.where("date").equals(dateFilter);
    }

    // Sort
    query = query.sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 });

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const sales = await query.skip(skip).limit(parseInt(limit));

    // Populate paymentMethod if needed
    const populatedSales = await Sale.populate(sales, {
      path: "paymentMethod",
      select: "name",
    });

    // Count total documents matching the criteria for pagination metadata
    const total = await Sale.countDocuments(query.getQuery());

    res.status(200).json({
      success: true,
      message: "Sales retrieved successfully",
      data: {
        sales: populatedSales,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sales",
    });
  }
};

exports.getSaleById = async (req, res) => {
  const { saleId } = req.params;

  try {
    // Find the sale
    const sale = await Sale.findById(saleId)
      .populate("paymentMethod", "name") // Populate paymentMethod details
      .lean(); // Convert to plain JavaScript object for easier manipulation

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // Fetch all items related to this sale
    const saleItems = await SaleItem.find({ sale: saleId })
      .populate({
        path: "dish",
        select: "name price", // Only fetch name and price of the dish
      })
      .lean();

    // Combine sale with its items
    const saleWithItems = {
      ...sale,
      items: saleItems,
    };

    res.status(200).json({
      success: true,
      message: "Sale details retrieved successfully",
      sale: saleWithItems,
    });
  } catch (error) {
    console.error("Error fetching sale details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sale details",
    });
  }
};

exports.voidSale = async (req, res) => {
  const { saleId } = req.params;

  try {
    // Find the sale
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    // Check if the sale has already been voided
    if (sale.isVoided) {
      return res.status(400).json({
        success: false,
        message: "This sale has already been voided",
      });
    }

    // Mark the sale as voided instead of deleting
    sale.isVoided = true;
    await sale.save();

    // Optionally, you might want to void all related SaleItems or perform other operations
    // This is an example where we void all items related to the sale:
    await SaleItem.updateMany({ sale: saleId }, { $set: { isVoided: true } });

    res.status(200).json({
      success: true,
      message: "Sale has been voided successfully",
      sale: sale, // Return the updated sale object
    });
  } catch (error) {
    console.error("Error voiding sale:", error);
    res.status(500).json({
      success: false,
      message: "Error voiding sale",
    });
  }
};
