const Kabasa = require("../models/kabasaModel"); // Your Kabasa Model
const OrderItem = require("../models/orderItemModel");
const PaymentMethod = require("../models/PaymentMethodModel");
const {
  createKabasaSchema,
  updateKabasaSchema,
} = require("../middlewares/validator"); // Validation schemas
const Joi = require("joi");

// CREATE: Add a new Kabasa sale
exports.createKabasa = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("User Info:", req.user);
    const { orderItems, discount, status, paymentMethod, additionalNotes } =
      req.body;

    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: "User information is missing.",
      });
    }

    // Fetch OrderItems by name and prepare for Kabasa creation
    const updatedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const orderItem = await OrderItem.findOne({ itemName: item.itemName });
        if (!orderItem) {
          throw new Error(`OrderItem with name ${item.itemName} not found`);
        }
        return {
          itemId: orderItem._id, // Use itemId for linking
          itemName: item.itemName, // Keep itemName for display
          qty: item.qty,
          unitPrice: orderItem.unitPrice, // Use the unitPrice from OrderItem for consistency
        };
      })
    );

    // Calculate total amount based on updated order items
    const totalAmount = updatedOrderItems.reduce((sum, item) => {
      return sum + item.qty * item.unitPrice;
    }, 0);

    const discountedTotal = totalAmount - totalAmount * (discount / 100);

    const newKabasa = await Kabasa.create({
      orderItems: updatedOrderItems, // Use the updated items with itemId
      discount,
      status,
      paymentMethod,
      additionalNotes,
      totalAmount: discountedTotal,
      salesBy: req.user.id, // Example: logged-in user's ID
    });

    // If you need to return populated data for immediate display:
    const populatedKabasa = await Kabasa.findById(newKabasa._id)
      .populate("orderItems.itemId", "itemName unitPrice")
      .populate("paymentMethod", "name")
      .populate("salesBy", "fullName");

    res.status(201).json({
      success: true,
      message: "Kabasa record created successfully",
      data: populatedKabasa, // Send back the populated Kabasa for immediate use
    });
  } catch (error) {
    console.error("Error creating Kabasa record:", error);
    res.status(500).json({
      success: false,
      message: "Error creating Kabasa record",
    });
  }
};

// UPDATE: Update an existing Kabasa sale
exports.updateKabasa = async (req, res) => {
  try {
    // Validate request body
    console.log("Request Body Before Validation:", req.body);
    const { error, value } = updateKabasaSchema.validate(req.body);
    console.log("Validated value:", value);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { orderItems, discount, status, paymentMethod, additionalNotes } =
      value;

    // Fetch existing Kabasa record
    const kabasa = await Kabasa.findById(req.params.id);
    if (!kabasa) {
      return res.status(404).json({
        success: false,
        message: "Kabasa record not found",
      });
    }

    // Fetch OrderItems by name and prepare for Kabasa update
    const updatedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const orderItem = await OrderItem.findOne({ itemName: item.itemName });
        if (!orderItem) {
          throw new Error(`OrderItem with name ${item.itemName} not found`);
        }
        return {
          itemId: orderItem._id,
          itemName: item.itemName,
          qty: item.qty,
          unitPrice: orderItem.unitPrice,
        };
      })
    );

    // Calculate total amount based on updated order items
    const totalAmount = updatedOrderItems.reduce((sum, item) => {
      return sum + item.qty * item.unitPrice;
    }, 0);

    const discountedTotal = totalAmount - totalAmount * (discount / 100);

    // Update Kabasa record, excluding salesBy
    const updateData = {
      orderItems: updatedOrderItems,
      discount,
      status,
      paymentMethod,
      additionalNotes,
      totalAmount: discountedTotal,
    };

    const updatedKabasa = await Kabasa.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("orderItems.itemId", "itemName unitPrice")
      .populate("paymentMethod", "name")
      .populate("salesBy", "fullName");

    res.status(200).json({
      success: true,
      message: "Kabasa record updated successfully",
      data: updatedKabasa,
    });
  } catch (error) {
    console.error("Error updating Kabasa record:", error);
    res.status(500).json({
      success: false,
      message: "Error updating Kabasa record: " + error.message,
    });
  }
};
// GET: KABASA
exports.getAllKabasa = async (req, res) => {
  try {
    const kabasaRecords = await Kabasa.find()
      .populate("orderItems", "itemName unitPrice") // Assuming 'itemName' is the field name for the ObjectId reference to OrderItem
      .populate("paymentMethod", "name")
      .populate("salesBy", "fullName");

    res.status(200).json({
      success: true,
      data: kabasaRecords,
    });
  } catch (error) {
    console.error("Error fetching Kabasa records:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Kabasa records",
    });
  }
};

exports.voidKabasa = async (req, res) => {
  const { kabasaId } = req.params;

  try {
    const kabasa = await Kabasa.findById(kabasaId);

    if (!kabasa) {
      return res
        .status(404)
        .json({ success: false, message: "Kabasa record not found" });
    }

    if (kabasa.isVoided) {
      return res
        .status(400)
        .json({ success: false, message: "Kabasa record is already voided" });
    }

    // Void the Kabasa record
    kabasa.isVoided = true;
    kabasa.voidedAt = new Date(); // Optionally, add when it was voided
    const voidedKabasa = await kabasa.save();

    // Optionally, if you want to unpopulate certain fields after voiding:
    // const voidedKabasa = await Kabasa.findByIdAndUpdate(kabasaId, { isVoided: true, voidedAt: new Date() }, { new: true }).select('-orderItems -paymentMethod -salesBy');

    res.status(200).json({
      success: true,
      message: "Kabasa record successfully voided",
      data: voidedKabasa,
    });
  } catch (error) {
    console.error("Error voiding Kabasa record:", error);
    res.status(500).json({
      success: false,
      message: "Error voiding Kabasa record",
      details: error.message,
    });
  }
};

// GET BY ID: Get a Kabasa sale by its ID
exports.getKabasaById = async (req, res) => {
  try {
    // Find Kabasa by ID
    const kabasa = await Kabasa.findById(req.params.id).populate(
      "salesBy",
      "username email"
    ); // Assuming salesBy refers to a User schema

    if (!kabasa)
      return res.status(404).json({ message: "Kabasa sale not found" });

    res.status(200).json(kabasa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CANCEL/VOID: Cancel or void a Kabasa sale
exports.cancelKabasa = async (req, res) => {
  try {
    // Find Kabasa sale by ID
    const kabasa = await Kabasa.findById(req.params.id);
    if (!kabasa)
      return res.status(404).json({ message: "Kabasa sale not found" });

    // Update the status to 'Cancelled'
    kabasa.status = "Cancelled";

    // Save the canceled Kabasa sale
    await kabasa.save();
    res
      .status(200)
      .json({ message: "Kabasa sale cancelled successfully", kabasa });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.getKabasaComprehensiveSummary = async (req, res) => {
//   try {
//     // Define match criteria based on query parameters
//     let match = { status: "Paid" };
//     let dateRangeApplied = false;

//     // If query parameters for date range are provided, add them to the match criteria
//     if (req.query.fromDate || req.query.toDate) {
//       match.createdAt = {};
//       if (req.query.fromDate) {
//         match.createdAt.$gte = new Date(req.query.fromDate);
//         dateRangeApplied = true;
//       }
//       if (req.query.toDate) {
//         match.createdAt.$lte = new Date(req.query.toDate);
//         dateRangeApplied = true;
//       }
//     }

//     const comprehensiveSummary = await Kabasa.aggregate([
//       {
//         $match: match, // Use the dynamic match criteria
//       },
//       {
//         $lookup: {
//           from: "paymentmethods",
//           localField: "paymentMethod",
//           foreignField: "_id",
//           as: "paymentMethodDetails",
//         },
//       },
//       {
//         $unwind: "$paymentMethodDetails",
//       },
//       {
//         $group: {
//           _id: {
//             paymentMethod: "$paymentMethodDetails.name",
//             status: "$status",
//           },
//           count: { $sum: 1 },
//           totalAmount: { $sum: "$totalAmount" },
//           discountCount: { $sum: { $cond: [{ $gt: ["$discount", 0] }, 1, 0] } },
//           discountSum: { $sum: "$discount" },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           paymentMethods: {
//             $push: {
//               method: "$_id.paymentMethod",
//               count: "$count",
//               amount: "$totalAmount",
//               discountCount: "$discountCount",
//               discountSum: "$discountSum",
//             },
//           },
//           totalSales: { $sum: "$totalAmount" },
//           totalDiscountCount: { $sum: "$discountCount" },
//           totalDiscountSum: { $sum: "$discountSum" },
//           statusCounts: {
//             $push: {
//               status: "$_id.status",
//               count: "$count",
//               amount: "$totalAmount",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           totalSales: 1,
//           totalDiscountCount: 1,
//           totalDiscountSum: 1,
//           paymentMethods: 1,
//           statusCounts: {
//             $arrayToObject: {
//               $map: {
//                 input: "$statusCounts",
//                 as: "status",
//                 in: {
//                   k: "$$status.status",
//                   v: {
//                     count: "$$status.count",
//                     amount: "$$status.amount",
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     ]);

//     if (comprehensiveSummary.length === 0 && dateRangeApplied) {
//       return res.status(200).json({
//         noDataForRange: true,
//         message: "No search found for the criteria",
//       });
//     }

//     return res.status(200).json(comprehensiveSummary[0] || {});
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
exports.getKabasaComprehensiveSummary = async (req, res) => {
  try {
    let match = {};
    let dateRangeApplied = false;

    if (req.query.fromDate || req.query.toDate) {
      match.createdAt = {};
      if (req.query.fromDate) {
        match.createdAt.$gte = new Date(req.query.fromDate);
        dateRangeApplied = true;
      }
      if (req.query.toDate) {
        match.createdAt.$lte = new Date(req.query.toDate);
        dateRangeApplied = true;
      }
    }

    const comprehensiveSummary = await Kabasa.aggregate([
      {
        $match: match, // Now match any date range without filtering by status
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
            paymentMethod: "$paymentMethodDetails.name",
            status: "$status",
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
          paymentMethods: {
            $push: {
              method: "$_id.paymentMethod",
              count: "$count",
              amount: "$totalAmount",
              discountCount: "$discountCount",
              discountSum: "$discountSum",
            },
          },
          totalSales: { $sum: "$totalAmount" },
          totalDiscountCount: { $sum: "$discountCount" },
          totalDiscountSum: { $sum: "$discountSum" },
          statusCounts: {
            $push: {
              status: "$_id.status",
              count: "$count",
              amount: "$totalAmount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalDiscountCount: 1,
          totalDiscountSum: 1,
          paymentMethods: 1,
          statusCounts: {
            $arrayToObject: {
              $map: {
                input: "$statusCounts",
                as: "status",
                in: {
                  k: "$$status.status",
                  v: {
                    count: "$$status.count",
                    amount: "$$status.amount",
                  },
                },
              },
            },
          },
        },
      },
    ]);

    if (comprehensiveSummary.length === 0 && dateRangeApplied) {
      return res.status(200).json({
        noDataForRange: true,
        message: "No search found for the criteria",
      });
    }

    return res.status(200).json(comprehensiveSummary[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getKabasaDailySalesSummary = async (req, res) => {
  try {
    // Define the start and end of the current day (February 22, 2025)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // 00:00:00
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // 23:59:59

    // Aggregate sales data for today
    const salesData = await Kabasa.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided
          status: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded
          createdAt: { $gte: todayStart, $lte: todayEnd }, // Filter for today
        },
      },
      {
        $group: {
          _id: "$paymentMethod", // Group by paymentMethod ObjectId
          totalAmount: { $sum: "$totalAmount" }, // Sum totalAmount per payment method
        },
      },
      {
        $lookup: {
          from: "paymentmethods", // Collection name (adjust if different)
          localField: "_id",
          foreignField: "_id",
          as: "paymentMethodDetails",
        },
      },
      {
        $unwind: "$paymentMethodDetails", // Flatten the array
      },
      {
        $project: {
          _id: 0,
          paymentMethod: "$paymentMethodDetails.name", // Get payment method name
          totalAmount: 1,
        },
      },
    ]);

    // Calculate total sales across all payment methods
    const totalSales = salesData.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    // Fetch all payment methods to ensure all are included (even with 0)
    const allPaymentMethods = await PaymentMethod.find({}, { name: 1 });
    const paymentMethodTotals = {};

    // Initialize all payment methods with 0
    allPaymentMethods.forEach((method) => {
      paymentMethodTotals[method.name] = 0;
    });

    // Fill in actual totals from salesData
    salesData.forEach((item) => {
      paymentMethodTotals[item.paymentMethod] = item.totalAmount;
    });

    // Construct the response
    const responseData = {
      totalSales,
      ...paymentMethodTotals,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching Kabasa daily sales summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Kabasa daily sales summary",
      error: error.message || "Internal Server Error",
    });
  }
};

// Get Kabasa All-Time Sales
exports.getKabasaAllTimeSales = async (req, res) => {
  try {
    const salesData = await Kabasa.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided
          status: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded
        },
      },
      {
        $group: {
          _id: null, // Aggregate all records into one group
          totalSales: { $sum: "$totalAmount" }, // Sum totalAmount across all valid records
        },
      },
      {
        $project: {
          _id: 0, // Omit _id
          totalSales: 1, // include only totalSales
        },
      },
    ]);

    // Return 0 if no valid records exist
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    res.status(200).json({
      success: true,
      data: { totalSales },
    });
  } catch (error) {
    console.error("Error fetching Kabasa all-time sales:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Kabasa all-time sales",
      error: error.message || "Internal Server Error",
    });
  }
};

// Get Kabasa Daily Sales for All Days
exports.getDailySalesAllDays = async (req, res) => {
  try {
    const salesData = await Kabasa.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided transactions
          status: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded transactions
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Group by day
          },
          totalSales: { $sum: "$totalAmount" }, // Sum totalAmount for each day
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
      {
        $project: {
          _id: 0, // Omit _id
          date: "$_id", // Rename _id to date
          totalSales: 1, // Include totalSales
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: salesData, // Array of { date, totalSales }
    });
  } catch (error) {
    console.error("Error fetching Kabasa daily sales for all days:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Kabasa daily sales for all days",
      error: error.message || "Internal Server Error",
    });
  }
};

// Get Top 5 Daily Selling Items for Today
exports.getTopSellingItems = async (req, res) => {
  try {
    // Define today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of today
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today

    const topItems = await Kabasa.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided transactions
          status: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded
          createdAt: { $gte: todayStart, $lte: todayEnd }, // Only today's transactions
        },
      },
      {
        $unwind: "$orderItems", // Flatten the orderItems array
      },
      {
        $group: {
          _id: "$orderItems.itemName", // Group by itemName
          totalQty: { $sum: "$orderItems.qty" }, // Sum quantities sold today
        },
      },
      {
        $sort: { totalQty: -1 }, // Sort by totalQty descending
      },
      {
        $limit: 5, // Limit to top 5
      },
      {
        $project: {
          _id: 0, // Omit _id
          itemName: "$_id", // Rename _id to itemName
          totalQty: 1, // Include totalQty
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topItems, // Array of { itemName, totalQty } for today
    });
  } catch (error) {
    console.error("Error fetching top daily selling items in Kabasa:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top daily selling items",
      error: error.message || "Internal Server Error",
    });
  }
};
