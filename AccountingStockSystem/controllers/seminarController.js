const Seminar = require("../models/seminarsModel");
const OrderItem = require("../models/orderItemModel");
const PaymentMethod = require("../models/PaymentMethodModel"); // Assuming this is your PaymentMethod model file

const {
  createSeminarSchema,
  updateSeminarSchema,
} = require("../middlewares/validator");

//create Seminar
exports.createSeminar = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("User Info:", req.user);
    const {
      organizationName,
      contactPhone,
      seminarDate,
      orderItems,
      address,
      eventType,
      paymentMethod,
      status,
      additionalNotes,
      discount,
    } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "User information is missing.",
      });
    }

    // Ensure orderItems is an array and has content
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one order item is required.",
      });
    }

    // Fetch OrderItems by name and prepare for Seminar creation
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

    // Create the new seminar record
    const newSeminar = await Seminar.create({
      organizationName,
      contactPhone,
      seminarDate,
      orderItems: updatedOrderItems, // Use the updated items with itemId
      address,
      eventType,
      paymentMethod,
      status,
      additionalNotes,
      discount,
      totalAmount: discountedTotal,
      salesBy: req.user.userId, // Example: logged-in user's ID
    });

    // If you need to return populated data for immediate display:
    const populatedSeminar = await Seminar.findById(newSeminar._id)
      .populate("orderItems.itemId", "itemName unitPrice")
      .populate("paymentMethod", "name")
      .populate("salesBy", "fullName");

    res.status(201).json({
      success: true,
      message: "Seminar record created successfully",
      data: populatedSeminar, // Send back the populated Seminar for immediate use
    });
  } catch (error) {
    console.error("Error creating seminar record:", error);
    res.status(500).json({
      success: false,
      message: "Error creating seminar record",
    });
  }
};
// get all seminar
exports.getAllSeminars = async (req, res) => {
  try {
    const seminars = await Seminar.find()
      .populate("orderItems", "itemName unitPrice") // Assuming 'itemName' is the field name for the ObjectId reference to OrderItem
      .populate("paymentMethod", "name")
      .populate("salesBy", "fullName");

    res.status(200).json({
      success: true,
      data: seminars,
    });
  } catch (error) {
    console.error("Error fetching seminars records:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching seminars records",
    });
  }
};
//get Seminar by id
exports.getSeminarById = async (req, res) => {
  const { id } = req.params;

  try {
    const seminar = await Seminar.findById(id).populate("orderItems"); // Similarly, population might not be needed if orderItems are embedded
    if (!seminar) {
      return res.status(404).json({
        success: false,
        message: "Seminar not found",
      });
    }

    res.json({
      success: true,
      seminar,
    });
  } catch (error) {
    console.error("Error fetching seminar by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching seminar",
    });
  }
};
//update Seminar
exports.updateSeminar = async (req, res) => {
  try {
    // Validate request body
    console.log("Request Body Before Validation:", req.body);
    const { error, value } = updateSeminarSchema.validate(req.body);
    console.log("Validated value:", value);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const {
      orderItems,
      discount,
      status,
      paymentMethod,
      additionalNotes,
      organizationName,
      contactPhone,
      seminarDate,
      address,
      eventType,
    } = value;

    // Fetch existing seminar record
    const seminar = await Seminar.findById(req.params.id);
    if (!seminar) {
      return res.status(404).json({
        success: false,
        message: "Seminar record not found",
      });
    }

    // Fetch OrderItems by name and prepare for Seminar update
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

    // Update Seminar record, excluding salesBy
    const updateData = {
      organizationName,
      contactPhone,
      seminarDate,
      orderItems: updatedOrderItems,
      address,
      eventType,
      paymentMethod,
      status,
      additionalNotes,
      discount,
      totalAmount: discountedTotal,
    };

    const updatedSeminar = await Seminar.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("orderItems.itemId", "itemName unitPrice")
      .populate("paymentMethod", "name");

    res.status(200).json({
      success: true,
      message: "Seminar record updated successfully",
      data: updatedSeminar,
    });
  } catch (error) {
    console.error("Error updating seminar record:", error);
    res.status(500).json({
      success: false,
      message: "Error updating seminar record: " + error.message,
    });
  }
};
//void Seminar
const mongoose = require("mongoose");

exports.voidSeminar = async (req, res) => {
  const { id } = req.params;

  // Step 1: Check if id is provided
  if (!id || id === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Seminar ID is required",
    });
  }

  // Step 2: Validate if id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid seminar ID format. Must be a valid MongoDB ObjectId",
    });
  }

  try {
    // Step 3: Find the seminar by ID
    const seminar = await mongoose.model("Seminar").findById(id);
    if (!seminar) {
      return res.status(404).json({
        success: false,
        message: "Seminar not found",
      });
    }

    // Step 4: Check if already voided
    if (seminar.isVoided) {
      return res.status(400).json({
        success: false,
        message: "This seminar has already been voided",
      });
    }

    // Step 5: Void the seminar
    seminar.isVoided = true;
    seminar.voidedAt = new Date();
    const voidedSeminar = await seminar.save();

    // Step 6: Return success response
    res.status(200).json({
      success: true,
      message: "Seminar has been voided",
      data: voidedSeminar,
    });
  } catch (error) {
    console.error("Error voiding seminar:", error);
    res.status(500).json({
      success: false,
      message: "Error voiding seminar",
      details: error.message,
    });
  }
};
// Get Seminar Comprehensive Summary
exports.getSeminarComprehensiveSummary = async (req, res) => {
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

    const comprehensiveSummary = await Seminar.aggregate([
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
            eventType: "$eventType",
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
          eventTypeCounts: {
            $push: {
              eventType: "$_id.eventType",
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
          eventTypeCounts: {
            $arrayToObject: {
              $map: {
                input: "$eventTypeCounts",
                as: "eventType",
                in: {
                  k: "$$eventType.eventType",
                  v: {
                    count: "$$eventType.count",
                    amount: "$$eventType.amount",
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
// New method for daily sales and event type sales
// seminarController.js (Backend)

exports.getSalesData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let startOfDay, endOfDay;

    if (startDate && endDate) {
      startOfDay = new Date(startDate);
      endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
    } else {
      startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
    }

    const matchStage = {
      isVoided: { $ne: true },
      status: { $nin: ["Cancelled", "Refund"] },
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    const salesData = await Seminar.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$eventType", // Group by eventType FIRST
          totalSalesByType: { $sum: "$totalAmount" }, // Sum for each eventType
        },
      },
      {
        $group: {
          _id: null, // Group ALL results together
          totalSales: { $sum: "$totalSalesByType" }, // Calculate overall total
          eventSales: {
            $push: {
              // Push each eventType's sales into an array
              k: "$_id", // Use the eventType as the key
              v: "$totalSalesByType", // Use the calculated sum as the value
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // We don't need the _id field
          totalSales: 1, // Include the totalSales
          eventSales: { $arrayToObject: "$eventSales" }, // Convert the array to an object
        },
      },
    ]);

    let result = {
      totalSales: 0,
      eventSales: {},
    };

    if (salesData.length > 0) {
      // Directly assign, sales data is now what we need
      result = salesData[0];
    }
    // initialize event sales if it's empty
    // Initialize eventSales with all event types and default values of 0
    const allEventTypes = ["conference", "workshop", "webinar", "Wedding"]; //  enum values
    allEventTypes.forEach((type) => {
      if (!result.eventSales[type]) {
        result.eventSales[type] = 0;
      }
    });

    console.log("getSalesData result:", result); // Keep this for debugging

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sales data",
      error: error.message,
    });
  }
};

// Get Total Sales of All Time
exports.getAllTimeSales = async (req, res) => {
  try {
    const salesData = await Seminar.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided seminars
          status: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded
        },
      },
      {
        $group: {
          _id: null, // Aggregate all records into one group
          totalSales: { $sum: "$totalAmount" }, // Sum totalAmount across all valid seminars
        },
      },
      {
        $project: {
          _id: 0, // Omit _id from response
          totalSales: 1, // include only totalSales
        },
      },
    ]);

    // Return 0 if no valid seminars exist
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    res.status(200).json({
      success: true,
      data: { totalSales },
    });
  } catch (error) {
    console.error("Error fetching all-time sales:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all-time sales",
      error: error.message || "Internal Server Error",
    });
  }
};

exports.getDailySalesAllDays = async (req, res) => {
  try {
    const salesData = await Seminar.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided seminars
          status: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$seminarDate" }, // Group by day
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
      data: salesData, // Array of { date: "YYYY-MM-DD", totalSales: number }
    });
  } catch (error) {
    console.error("Error fetching daily sales for all days:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily sales for all days",
      error: error.message || "Internal Server Error",
    });
  }
};

// Get Payment Method Totals for the Current Day
exports.getPaymentMethodTotalsForDay = async (req, res) => {
  try {
    // Define the start and end of the current day (February 22, 2025, as per system date)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // 00:00:00
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // 23:59:59

    // Aggregate seminar data for today
    const salesData = await Seminar.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided seminars
          status: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded
          createdAt: { $gte: todayStart, $lte: todayEnd }, // Filter for today
        },
      },
      {
        $group: {
          _id: "$paymentMethod", // Group by paymentMethod ObjectId
          totalAmount: { $sum: "$totalAmount" }, // Sum totalAmount for each payment method
        },
      },
      {
        $lookup: {
          from: "paymentmethods", // Collection name for PaymentMethod (adjust if different)
          localField: "_id",
          foreignField: "_id",
          as: "paymentMethodDetails",
        },
      },
      {
        $unwind: "$paymentMethodDetails", // Flatten the array from $lookup
      },
      {
        $project: {
          _id: 0, // Omit _id
          paymentMethodId: "$_id", // Include ObjectId
          paymentMethod: "$paymentMethodDetails.name", // Include payment method name
          totalAmount: 1, // Include total amount
        },
      },
    ]);

    // Fetch all payment methods to ensure all are included, even with $0
    const allPaymentMethods = await PaymentMethod.find({}, { name: 1 }); // Get all payment methods with names
    const paymentMethodMap = new Map(
      salesData.map((item) => [item.paymentMethod, item.totalAmount])
    );

    // Build the response including all payment methods
    const result = allPaymentMethods.map((method) => ({
      paymentMethodId: method._id,
      paymentMethod: method.name,
      totalAmount: paymentMethodMap.get(method.name) || 0, // Default to 0 if no sales
    }));

    res.status(200).json({
      success: true,
      data: result, // Array of { paymentMethodId, paymentMethod, totalAmount }
    });
  } catch (error) {
    console.error("Error fetching payment method totals for day:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment method totals for day",
      error: error.message || "Internal Server Error",
    });
  }
};
