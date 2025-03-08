// controllers/anotherUnifiedSaleController.js
const AnotherUnifiedSale = require("../models/anotherUnifiedSaleModel");
const Dish = require("../models/productModel");
const Product = require("../models/dishesModel");
const { createSalesUnifiedSchema } = require("../middlewares/validator");

exports.getAnotherUnifiedSales = async (req, res) => {
  try {
    const sales = await AnotherUnifiedSale.find({})
      .populate("paymentMethod", "name")
      .populate("cashier", "fullName") // Assuming 'fullName' is used for 'cashier' now
      .populate("dishItems.item", "name price") // Populating dish items
      .populate("productItems.item", "name price"); // Populating product items

    res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error("Error fetching another unified sales:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching sales.",
      details: error.message,
    });
  }
};

exports.createAnotherUnifiedSale = async (req, res) => {
  const {
    saleType,
    paymentMethod,
    totalAmount,
    dishItems,
    productItems,
    discount = 0,
  } = req.body;

  try {
    console.log("Received totalAmount:", totalAmount);
    // Validate data including the new discount field
    const { error } = createSalesUnifiedSchema.validate({
      saleType,
      paymentMethod,
      totalAmount,
      dishItems,
      productItems,
      discount,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Calculate total amount after discount
    const totalBeforeDiscount =
      dishItems.reduce((sum, item) => sum + item.subTotal, 0) +
      (productItems || []).reduce((sum, item) => sum + item.subTotal, 0);
    const discountedAmount =
      totalBeforeDiscount - totalBeforeDiscount * (discount / 100);

    // Create sale document with discount applied
    const newSale = new AnotherUnifiedSale({
      saleType,
      paymentMethod,
      totalAmount: discountedAmount, // Use the calculated amount after discount
      discount: discount,
      cashier: req.user.id,
      dishItems: dishItems
        ? dishItems.map((item) => ({
            item: item.item,
            quantity: item.quantity,
            priceAtSale: item.priceAtSale,
            subTotal: item.subTotal,
          }))
        : [],
      productItems: productItems
        ? productItems.map((item) => ({
            item: item.item,
            quantity: item.quantity,
            priceAtSale: item.priceAtSale,
            subTotal: item.subTotal,
          }))
        : [],
    });

    const savedSale = await newSale.save();
    const populatedSale = await savedSale.populate([
      { path: "cashier", select: "fullName" },
      { path: "dishItems.item", select: "name price" },
      { path: "productItems.item", select: "name price" },
    ]);

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale: populatedSale,
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({
      success: false,
      message: "Error creating sale",
      details: error.message,
    });
  }
};

exports.updateSale = async (req, res) => {
  const { saleId } = req.params;
  const { dishItems, productItems, discount, ...updateData } = req.body;

  try {
    const sale = await AnotherUnifiedSale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Update dishItems and productItems if provided
    if (dishItems) {
      sale.dishItems = dishItems.map((item) => ({
        ...item,
        subTotal: item.quantity * item.priceAtSale,
      }));
    }

    if (productItems) {
      sale.productItems = productItems.map((item) => ({
        ...item,
        subTotal: item.quantity * item.priceAtSale,
      }));
    }

    // Calculate total amount before discount
    let totalAmountBeforeDiscount = sale.calculateTotalAmount();

    // Apply discount if provided
    if (discount !== undefined) {
      sale.discount = discount;
      const discountAmount = totalAmountBeforeDiscount * (discount / 100);
      // Use toFixed for consistent rounding to 2 decimal places
      sale.totalAmount = Number(
        (totalAmountBeforeDiscount - discountAmount).toFixed(2)
      );
      console.log(
        "Total Before Discount:",
        totalAmountBeforeDiscount,
        "Discount Amount:",
        discountAmount,
        "Total After Discount:",
        sale.totalAmount
      );
    }

    // Update other fields if provided
    Object.assign(sale, updateData);

    await sale.save();

    // Populate the updated sale
    const updatedSale = await AnotherUnifiedSale.findById(saleId).populate([
      {
        path: "cashier",
        select: "fullName",
      },
      {
        path: "dishItems.item",
        model: "Dish",
        select: "name price",
      },
      {
        path: "productItems.item",
        model: "Product",
        select: "name price",
      },
    ]);

    res.status(200).json({ success: true, sale: updatedSale });
  } catch (error) {
    console.error("Error in updateSale:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.voidSale = async (req, res) => {
  const { saleId } = req.params;

  try {
    const sale = await AnotherUnifiedSale.findById(saleId);

    if (!sale) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    if (sale.isVoided) {
      return res
        .status(400)
        .json({ success: false, message: "Sale is already voided" });
    }

    // Void the sale
    sale.isVoided = true;
    sale.voidedAt = new Date(); // Optionally, add when it was voided
    const voidedSale = await sale.save();

    // Optionally, if you want to unpopulate certain fields after voiding:
    // const voidedSale = await AnotherUnifiedSale.findByIdAndUpdate(saleId, { isVoided: true, voidedAt: new Date() }, { new: true }).select('-items -dishItems -productItems');

    res.status(200).json({
      success: true,
      message: "Sale successfully voided",
      sale: voidedSale,
    });
  } catch (error) {
    console.error("Error voiding sale:", error);
    res.status(500).json({
      success: false,
      message: "Error voiding sale",
      details: error.message,
    });
  }
};

exports.anotherUnifiedSalesSummary = async (req, res) => {
  try {
    let match = {};
    let dateRangeApplied = false;

    if (req.query.fromDate || req.query.toDate) {
      match.date = {};
      if (req.query.fromDate) {
        match.date.$gte = new Date(req.query.fromDate);
        dateRangeApplied = true;
      }
      if (req.query.toDate) {
        match.date.$lte = new Date(req.query.toDate);
        dateRangeApplied = true;
      }
    }

    const unifiedSummary = await AnotherUnifiedSale.aggregate([
      {
        $match: match, // Applying date range match if provided
      },
      {
        $lookup: {
          from: "paymentmethods",
          localField: "paymentMethod",
          foreignField: "_id",
          as: "paymentMethodDetails",
        },
      },
      {
        $unwind: "$paymentMethodDetails",
      },
      {
        $group: {
          _id: {
            saleType: "$saleType",
            paymentMethod: "$paymentMethodDetails.name",
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          discountCount: { $sum: { $cond: [{ $gt: ["$discount", 0] }, 1, 0] } },
          discountSum: { $sum: "$discount" },
        },
      },
      {
        $group: {
          _id: null,
          restaurantSales: {
            $push: {
              $cond: [
                { $eq: ["$_id.saleType", "restaurant"] },
                {
                  paymentMethod: "$_id.paymentMethod",
                  count: "$count",
                  amount: "$totalAmount",
                  discountCount: "$discountCount",
                  discountSum: "$discountSum",
                },
                null,
              ],
            },
          },
          minimartSales: {
            $push: {
              $cond: [
                { $eq: ["$_id.saleType", "minimart"] },
                {
                  paymentMethod: "$_id.paymentMethod",
                  count: "$count",
                  amount: "$totalAmount",
                  discountCount: "$discountCount",
                  discountSum: "$discountSum",
                },
                null,
              ],
            },
          },
          totalSales: { $sum: "$totalAmount" },
          totalDiscountCount: { $sum: "$discountCount" },
          totalDiscountSum: { $sum: "$discountSum" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalDiscountCount: 1,
          totalDiscountSum: 1,
          restaurantSales: {
            $filter: {
              input: "$restaurantSales",
              as: "sale",
              cond: { $ne: ["$$sale", null] },
            },
          },
          minimartSales: {
            $filter: {
              input: "$minimartSales",
              as: "sale",
              cond: { $ne: ["$$sale", null] },
            },
          },
        },
      },
    ]);

    if (unifiedSummary.length === 0 && dateRangeApplied) {
      return res.status(200).json({
        noDataForRange: true,
        message: "No sales found for the criteria",
      });
    }

    return res.status(200).json(unifiedSummary[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
