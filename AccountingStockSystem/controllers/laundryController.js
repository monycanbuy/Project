// controllers/laundryController.js
const Laundry = require("../models/laundryModel");
const LaundryService = require("../models/laundryServiceModel");
const PaymentMethod = require("../models/PaymentMethodModel");
const {
  createLaundrySchema,
  updateLaundrySchema,
} = require("../middlewares/validator");

exports.getAllLaundry = async (req, res) => {
  try {
    const laundryRecords = await Laundry.find()
      .populate("services.serviceType")
      .populate("paymentMethod", "name")
      .populate("salesBy", "fullName");
    res.status(200).json({
      success: true,
      data: laundryRecords,
    });
  } catch (error) {
    console.error("Error fetching laundry records:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching laundry records",
    });
  }
};

exports.createLaundry = async (req, res) => {
  try {
    const {
      customer,
      receiptNo,
      discount,
      services,
      paymentMethod,
      phoneNo,
      status, // Include status in the request body
    } = req.body;

    const totalAmount = services.reduce((sum, service) => {
      return sum + service.qty * service.unitPrice;
    }, 0);

    const discountedTotal = totalAmount - totalAmount * (discount / 100);

    const newLaundry = await Laundry.create({
      customer,
      receiptNo,
      discount,
      services,
      paymentMethod,
      phoneNo,
      totalAmount: discountedTotal,
      salesBy: req.user.userId, // Example: logged-in user's ID
      status, // Include status in the new laundry record
    });

    res.status(201).json({
      success: true,
      message: "Laundry record created successfully",
      data: newLaundry,
    });
  } catch (error) {
    console.error("Error creating laundry record:", error);
    res.status(500).json({
      success: false,
      message: "Error creating laundry record",
    });
  }
};

// exports.updateLaundry = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = updateLaundrySchema.validate(req.body);
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }

//     const { discount, services } = value;

//     // Fetch existing laundry record
//     const laundry = await Laundry.findById(req.params.id);
//     if (!laundry) {
//       return res.status(404).json({
//         success: false,
//         message: "Laundry record not found",
//       });
//     }

//     // Calculate total amount if services are updated
//     if (services) {
//       const totalAmount = services.reduce((sum, service) => {
//         return sum + service.qty * service.unitPrice;
//       }, 0);

//       value.totalAmount = totalAmount - totalAmount * (discount / 100);
//     }

//     // Update record
//     Object.assign(laundry, value);
//     await laundry.save();

//     res.status(200).json({
//       success: true,
//       message: "Laundry record updated successfully",
//       data: laundry,
//     });
//   } catch (error) {
//     console.error("Error updating laundry record:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating laundry record",
//     });
//   }
// };
exports.updateLaundry = async (req, res) => {
  try {
    const { error, value } = updateLaundrySchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const { discount, services } = value;

    const laundry = await Laundry.findById(req.params.id);
    if (!laundry) {
      return res.status(404).json({
        success: false,
        message: "Laundry record not found",
      });
    }

    if (services) {
      const totalAmount = services.reduce((sum, service) => {
        return sum + service.qty * service.unitPrice;
      }, 0);
      value.totalAmount = totalAmount - totalAmount * (discount / 100);
    }

    console.log("Updating laundry with req.user:", req.user, "body:", req.body); // Debugging
    const updateFields = { ...value };
    if (updateFields.salesBy === undefined) {
      delete updateFields.salesBy; // Preserve existing salesBy
    }
    Object.assign(laundry, updateFields);
    await laundry.save();

    res.status(200).json({
      success: true,
      message: "Laundry record updated successfully",
      data: laundry,
    });
  } catch (error) {
    console.error("Error updating laundry record:", error);
    res.status(500).json({
      success: false,
      message: "Error updating laundry record",
    });
  }
};

exports.voidLaundry = async (req, res) => {
  const { laundryId } = req.params;

  try {
    const laundry = await Laundry.findById(laundryId);

    if (!laundry) {
      return res
        .status(404)
        .json({ success: false, message: "Laundry record not found" });
    }

    if (laundry.isVoided) {
      return res
        .status(400)
        .json({ success: false, message: "Laundry record is already voided" });
    }

    // Void the laundry record
    laundry.isVoided = true;
    laundry.voidedAt = new Date(); // Optionally, add when it was voided
    const voidedLaundry = await laundry.save();

    // Optionally, if you want to unpopulate certain fields after voiding:
    // const voidedLaundry = await Laundry.findByIdAndUpdate(laundryId, { isVoided: true, voidedAt: new Date() }, { new: true }).select('-services -paymentMethod -salesBy');

    res.status(200).json({
      success: true,
      message: "Laundry record successfully voided",
      data: voidedLaundry,
    });
  } catch (error) {
    console.error("Error voiding laundry record:", error);
    res.status(500).json({
      success: false,
      message: "Error voiding laundry record",
      details: error.message,
    });
  }
};

exports.getLaundryComprehensiveSummary = async (req, res) => {
  try {
    // Define match criteria based on query parameters
    let match = { status: "Paid" };
    let dateRangeApplied = false;

    // If query parameters for date range are provided, add them to the match criteria
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

    const comprehensiveSummary = await Laundry.aggregate([
      {
        $match: match, // Use the dynamic match criteria
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

// New method: Get daily laundry sales and payment method breakdown
exports.getDailyLaundrySales = async (req, res) => {
  try {
    console.log("Entering getDailyLaundrySales with query:", req.query);

    const dateParam = req.query.date || new Date().toISOString().split("T")[0];
    console.log("Date parameter:", dateParam);

    const startOfDay = new Date(dateParam);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateParam);
    endOfDay.setHours(23, 59, 59, 999);
    console.log("Date range:", startOfDay, "to", endOfDay);

    const salesData = await Laundry.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $in: ["Paid", "Pending"] },
          isVoided: false,
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          totalPerMethod: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "paymentmethods",
          localField: "_id",
          foreignField: "_id",
          as: "paymentMethodInfo",
        },
      },
      { $unwind: "$paymentMethodInfo" },
      {
        $project: {
          _id: 0,
          paymentMethod: "$paymentMethodInfo.name",
          totalPerMethod: 1,
        },
      },
    ]);
    console.log("Aggregation result:", salesData);

    const totalSales = salesData.reduce(
      (sum, item) => sum + item.totalPerMethod,
      0
    );
    console.log("Total sales calculated:", totalSales);

    const paymentMethodSales = {};
    const allPaymentMethods = await PaymentMethod.find({});
    console.log("All payment methods:", allPaymentMethods);
    allPaymentMethods.forEach((method) => {
      paymentMethodSales[method.name] = 0;
    });
    salesData.forEach((sale) => {
      paymentMethodSales[sale.paymentMethod] = sale.totalPerMethod;
    });
    console.log("Payment method sales:", paymentMethodSales);

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        paymentMethodSales,
      },
    });
  } catch (error) {
    console.error("Detailed error in getDailyLaundrySales:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while fetching daily sales",
      details: error.message,
    });
  }
};

exports.getAllTimeLaundrySales = async (req, res) => {
  try {
    // Optional date range from query params
    const { fromDate, toDate } = req.query;
    let matchCriteria = {
      status: { $in: ["Paid", "Pending"] }, // Exclude Cancelled and Refund
      isVoided: false, // Exclude voided transactions
    };

    // Apply date range if provided
    if (fromDate || toDate) {
      matchCriteria.createdAt = {};
      if (fromDate) {
        matchCriteria.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        matchCriteria.createdAt.$lte = new Date(toDate);
      }
    }

    // Aggregation pipeline to sum totalAmount
    const salesData = await Laundry.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: null, // Group all records together
          totalSales: { $sum: "$totalAmount" }, // Sum totalAmount
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id
          totalSales: 1,
        },
      },
    ]);

    // Extract totalSales (default to 0 if no records)
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    res.status(200).json({
      success: true,
      data: {
        totalSales,
      },
    });
  } catch (error) {
    console.error("Error fetching all-time laundry sales:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all-time sales",
      details: error.message,
    });
  }
};

exports.getDailySalesAllDays = async (req, res) => {
  try {
    // Aggregation pipeline to calculate daily totals
    const salesData = await Laundry.aggregate([
      {
        $match: {
          status: { $in: ["Paid", "Pending"] }, // Exclude Cancelled and Refund
          isVoided: false, // Exclude voided transactions
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Group by date (YYYY-MM-DD)
          },
          totalSales: { $sum: "$totalAmount" }, // Sum totalAmount per day
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
      {
        $project: {
          _id: 0, // Exclude _id
          date: "$_id", // Rename _id to date
          totalSales: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.error("Error fetching daily sales for all days:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching daily sales for all days",
      details: error.message,
    });
  }
};
