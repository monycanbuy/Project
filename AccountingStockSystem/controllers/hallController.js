// controllers/hallController.js
const HallTransaction = require("../models/hallModel");
const PaymentMethod = require("../models/PaymentMethodModel"); // Ensure this path is correct
const moment = require("moment-timezone");
const Hall = require("../models/hallTypesModel"); // Adjust the path as necessary
const {
  createHallTransactionSchema,
  updateHallTransactionSchema,
} = require("../middlewares/validator");
const { v4: uuidv4 } = require("uuid");

// If you have validation or other middleware:

exports.getDailyReport = async (req, res) => {
  const { date } = req.query;
  const reportDate = date ? new Date(date) : new Date();

  try {
    const startOfDay = new Date(reportDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reportDate);
    endOfDay.setHours(23, 59, 59, 999);

    const transactions = await HallTransaction.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      paymentStatus: "Completed",
    })
      .populate("hallId", "name")
      .populate("paymentMethod", "name");

    const totalRevenue = transactions.reduce(
      (sum, transaction) => sum + transaction.totalAmount,
      0
    );

    res.status(200).json({
      success: true,
      report: {
        date: reportDate.toISOString(),
        totalRevenue,
        transactions,
        // Add more metrics here like event type count, payment method distribution, etc.
      },
    });
  } catch (error) {
    console.error("Error generating daily report:", error);
    res.status(500).json({
      success: false,
      message: "Error generating daily report",
    });
  }
};
// create all transactions

// exports.createHallTransaction = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     console.log("User Info:", req.user);

//     const { error } = createHallTransactionSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details.map((detail) => detail.message).join(", "),
//       });
//     }

//     const {
//       customerName,
//       contactPhone,
//       startTime,
//       endTime,
//       halls,
//       eventType,
//       paymentMethod,
//       paymentStatus,
//       notes,
//       discount,
//     } = req.body;

//     // Updated to use req.user.userId
//     if (!req.user || !req.user.userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User information is missing.",
//       });
//     }

//     const updatedHalls = await Promise.all(
//       halls.map(async (item) => {
//         const hall = await Hall.findOne({ name: item.name });
//         if (!hall) {
//           throw new Error(`Hall with name ${item.name} not found`);
//         }
//         return {
//           hall: hall._id,
//           name: item.name,
//           qty: item.qty,
//           price: hall.price,
//         };
//       })
//     );

//     const totalAmount = updatedHalls.reduce((sum, item) => {
//       return sum + item.qty * item.price;
//     }, 0);
//     const discountValue = req.body.discount || 0;
//     const discountedTotal = totalAmount - totalAmount * (discountValue / 100);
//     const finalDiscountedTotal = Math.round(discountedTotal * 100) / 100;

//     const generateTransactionId = () => {
//       const randomDigits = Math.floor(Math.random() * 90000 + 10000).toString();
//       return `TRX-${randomDigits}`;
//     };

//     const newHallTransaction = await HallTransaction.create({
//       halls: req.body.halls.map((hall) => ({
//         hallId: hall._id || hall.hallId,
//         name: hall.name,
//         qty: hall.qty || 1,
//         price: hall.price,
//       })),
//       transactionId: generateTransactionId(),
//       customerName,
//       contactPhone,
//       startTime,
//       endTime,
//       eventType,
//       paymentMethod,
//       paymentStatus,
//       notes,
//       discount: discountValue,
//       totalAmount: finalDiscountedTotal,
//       staffInvolved: req.user.userId, // Updated here too
//     });

//     const populatedHallTransaction = await HallTransaction.findById(
//       newHallTransaction._id
//     )
//       .populate("halls.hallId", "name price")
//       .populate("paymentMethod", "name")
//       .populate("staffInvolved", "fullName");

//     res.status(201).json({
//       success: true,
//       message: "Hall Transaction record created successfully",
//       data: populatedHallTransaction,
//     });
//   } catch (error) {
//     console.error("Error creating hall transaction record:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error creating hall transaction record",
//     });
//   }
// };
exports.createHallTransaction = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("User Info:", req.user);

    const { error } = createHallTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const {
      customerName,
      contactPhone,
      startTime,
      endTime,
      halls,
      eventType,
      paymentMethod,
      paymentStatus,
      notes,
      discount,
      date, // Added date field from request body
    } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "User information is missing.",
      });
    }

    const updatedHalls = await Promise.all(
      halls.map(async (item) => {
        const hall = await Hall.findOne({ name: item.name });
        if (!hall) {
          throw new Error(`Hall with name ${item.name} not found`);
        }
        return {
          hallId: hall._id,
          name: item.name,
          qty: item.qty,
          price: hall.price,
        };
      })
    );

    const totalAmount = updatedHalls.reduce((sum, item) => {
      return sum + item.qty * item.price;
    }, 0);
    const discountValue = discount || 0;
    const discountedTotal = totalAmount - totalAmount * (discountValue / 100);
    const finalDiscountedTotal = Math.round(discountedTotal * 100) / 100;

    const generateTransactionId = () => {
      const randomDigits = Math.floor(Math.random() * 90000 + 10000).toString();
      return `TRX-${randomDigits}`;
    };

    // Convert date to WAT if provided, otherwise use current WAT time
    const transactionDate = date
      ? moment.tz(date, "Africa/Lagos").toDate()
      : moment().tz("Africa/Lagos").toDate();

    const newHallTransaction = await HallTransaction.create({
      transactionId: generateTransactionId(),
      date: transactionDate, // Use processed date
      halls: updatedHalls,
      customerName,
      contactPhone,
      startTime: moment.tz(startTime, "Africa/Lagos").toDate(), // Convert to WAT
      endTime: moment.tz(endTime, "Africa/Lagos").toDate(), // Convert to WAT
      eventType,
      paymentMethod,
      paymentStatus,
      notes,
      discount: discountValue,
      totalAmount: finalDiscountedTotal,
      staffInvolved: req.user.userId,
    });

    const populatedHallTransaction = await HallTransaction.findById(
      newHallTransaction._id
    )
      .populate("halls.hallId", "name price")
      .populate("paymentMethod", "name")
      .populate("staffInvolved", "fullName");

    res.status(201).json({
      success: true,
      message: "Hall Transaction record created successfully",
      data: populatedHallTransaction,
    });
  } catch (error) {
    console.error("Error creating hall transaction record:", error);
    res.status(500).json({
      success: false,
      message: "Error creating hall transaction record: " + error.message,
    });
  }
};

// // update all transaction
// exports.updateHallTransaction = async (req, res) => {
//   try {
//     // Validate request body
//     console.log("Request Body Before Validation:", req.body);
//     const { error, value } = updateHallTransactionSchema.validate(req.body);
//     console.log("Validated value:", value);
//     if (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: error.details[0].message });
//     }

//     const { halls, discount, paymentMethod, paymentStatus, notes } = value;

//     // Check if halls exist and are an array before processing
//     if (!halls || !Array.isArray(halls)) {
//       return res.status(400).json({
//         success: false,
//         message: "Halls data must be an array.",
//       });
//     }

//     // Fetch existing hall transaction record
//     const hallTransaction = await HallTransaction.findById(req.params.id);
//     if (!hallTransaction) {
//       return res.status(404).json({
//         success: false,
//         message: "Hall transaction record not found",
//       });
//     }

//     let updatedHalls = halls; // If no halls are provided, we'll use the existing ones

//     // Process halls if they are provided
//     if (halls.length > 0) {
//       updatedHalls = await Promise.all(
//         halls.map(async (item) => {
//           // Assuming hallId is provided or we need to fetch by name
//           if (!item.hallId) {
//             const hall = await Hall.findOne({ name: item.name });
//             if (!hall) {
//               throw new Error(`Hall with name ${item.name} not found`);
//             }
//             return {
//               hallId: hall._id,
//               name: item.name,
//               qty: item.qty,
//               price: item.price || hall.price, // Use provided price or hall's price
//             };
//           }
//           return {
//             hallId: item.hallId,
//             name: item.name,
//             qty: item.qty,
//             price: item.price, // Here, we use the price from the request if provided
//           };
//         })
//       );
//     }

//     // Calculate total amount based on updated halls
//     const totalAmount = updatedHalls.reduce((sum, item) => {
//       return sum + item.qty * (item.price || 0); // Use price if available, else 0
//     }, 0);

//     const discountedTotal = totalAmount - (totalAmount * (discount || 0)) / 100;

//     // Update hall transaction record
//     const updateData = {
//       halls: updatedHalls,
//       discount: discount || 0, // Ensure discount is defined
//       paymentMethod,
//       paymentStatus,
//       notes,
//       totalAmount: discountedTotal,
//     };

//     const updatedHallTransaction = await HallTransaction.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     )
//       .populate("halls.hallId", "name price")
//       .populate("paymentMethod", "name")
//       .populate("staffInvolved", "fullName");

//     res.status(200).json({
//       success: true,
//       message: "Hall transaction record updated successfully",
//       data: updatedHallTransaction,
//     });
//   } catch (error) {
//     console.error("Error updating hall transaction record:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating hall transaction record: " + error.message,
//     });
//   }
// };
exports.updateHallTransaction = async (req, res) => {
  try {
    console.log("Request Body Before Validation:", req.body);
    const { error, value } = updateHallTransactionSchema.validate(req.body);
    console.log("Validated value:", value);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      halls,
      discount,
      paymentMethod,
      paymentStatus,
      notes,
      date, // Added date field from request body
      startTime, // Allow updating startTime
      endTime, // Allow updating endTime
      customerName, // Allow updating customerName
      contactPhone, // Allow updating contactPhone
      eventType, // Allow updating eventType
    } = value;

    if (!halls || !Array.isArray(halls)) {
      return res.status(400).json({
        success: false,
        message: "Halls data must be an array.",
      });
    }

    const hallTransaction = await HallTransaction.findById(req.params.id);
    if (!hallTransaction) {
      return res.status(404).json({
        success: false,
        message: "Hall transaction record not found",
      });
    }

    let updatedHalls = hallTransaction.halls; // Default to existing halls
    if (halls.length > 0) {
      updatedHalls = await Promise.all(
        halls.map(async (item) => {
          if (!item.hallId) {
            const hall = await Hall.findOne({ name: item.name });
            if (!hall) {
              throw new Error(`Hall with name ${item.name} not found`);
            }
            return {
              hallId: hall._id,
              name: item.name,
              qty: item.qty,
              price: item.price || hall.price,
            };
          }
          return {
            hallId: item.hallId,
            name: item.name,
            qty: item.qty,
            price: item.price,
          };
        })
      );
    }

    const totalAmount = updatedHalls.reduce((sum, item) => {
      return sum + item.qty * (item.price || 0);
    }, 0);
    const discountedTotal = totalAmount - (totalAmount * (discount || 0)) / 100;

    // Prepare update data, only including fields provided in the request
    const updateData = {
      halls: updatedHalls,
      discount: discount || hallTransaction.discount,
      paymentMethod: paymentMethod || hallTransaction.paymentMethod,
      paymentStatus: paymentStatus || hallTransaction.paymentStatus,
      notes: notes !== undefined ? notes : hallTransaction.notes,
      totalAmount: discountedTotal,
    };

    // Add date, startTime, endTime, etc., if provided in the request
    if (date) {
      updateData.date = moment.tz(date, "Africa/Lagos").toDate();
    }
    if (startTime) {
      updateData.startTime = moment.tz(startTime, "Africa/Lagos").toDate();
    }
    if (endTime) {
      updateData.endTime = moment.tz(endTime, "Africa/Lagos").toDate();
    }
    if (customerName) {
      updateData.customerName = customerName;
    }
    if (contactPhone) {
      updateData.contactPhone = contactPhone;
    }
    if (eventType) {
      updateData.eventType = eventType;
    }

    const updatedHallTransaction = await HallTransaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("halls.hallId", "name price")
      .populate("paymentMethod", "name")
      .populate("staffInvolved", "fullName");

    res.status(200).json({
      success: true,
      message: "Hall transaction record updated successfully",
      data: updatedHallTransaction,
    });
  } catch (error) {
    console.error("Error updating hall transaction record:", error);
    res.status(500).json({
      success: false,
      message: "Error updating hall transaction record: " + error.message,
    });
  }
};

//get all transactions
exports.getAllHallTransactions = async (req, res) => {
  try {
    const hallTransactions = await HallTransaction.find()
      .populate("halls", "name price") // Assuming 'name' and 'unitPrice' are the fields in the Hall model
      .populate("paymentMethod", "name")
      .populate("staffInvolved", "fullName")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: hallTransactions,
    });
  } catch (error) {
    console.error("Error fetching hall transactions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching hall transactions",
    });
  }
};
//get transaction by id
exports.getHallTransactionById = async (req, res) => {
  try {
    const transaction = await HallTransaction.findById(req.params.id)
      .populate("hallId", "name")
      .populate("paymentMethod", "name");
    if (!transaction) {
      return res.status(404).json({ error: "Hall transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching hall transaction",
      details: error.message,
    });
  }
};
// void hall transaction
exports.voidHallTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await HallTransaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Hall transaction not found",
      });
    }

    if (transaction.isVoided) {
      return res.status(400).json({
        success: false,
        message: "This transaction has already been voided",
      });
    }

    // Void the hall transaction
    transaction.isVoided = true;
    transaction.voidedAt = new Date(); // Optionally, add when it was voided
    const voidedTransaction = await transaction.save();

    res.status(200).json({
      success: true,
      message: "Hall transaction voided successfully",
      data: voidedTransaction,
    });
  } catch (error) {
    console.error("Error voiding hall transaction:", error);
    res.status(500).json({
      success: false,
      message: "Error voiding hall transaction",
      details: error.message,
    });
  }
};

exports.getHallComprehensiveSummary = async (req, res) => {
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

    const comprehensiveSummary = await HallTransaction.aggregate([
      {
        $match: match, // Match any date range without filtering by status
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
            paymentStatus: "$paymentStatus",
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
              status: "$_id.paymentStatus",
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

// New Method: Get Daily Sales by Event Type for Today
exports.getHallDailySalesByEventType = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const salesData = await HallTransaction.aggregate([
      {
        $match: {
          isVoided: { $ne: true },
          paymentStatus: { $nin: ["Cancelled", "Refund"] },
          createdAt: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: "$eventType",
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          eventSales: {
            $push: {
              k: "$_id",
              v: "$totalAmount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          eventSales: { $arrayToObject: "$eventSales" },
        },
      },
    ]);

    const result =
      salesData.length > 0
        ? salesData[0]
        : {
            totalSales: 0,
            eventSales: { conference: 0, workshop: 0, webinar: 0, Wedding: 0 },
          };

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching hall daily sales by event type:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hall daily sales by event type",
      error: error.message || "Internal Server Error",
    });
  }
};

// New Method: Get All-Time Total Sales
exports.getHallAllTimeSales = async (req, res) => {
  try {
    const salesData = await HallTransaction.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided transactions
          paymentStatus: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded
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
    console.error("Error fetching hall all-time sales:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hall all-time sales",
      error: error.message || "Internal Server Error",
    });
  }
};

// New Method: Get Daily Sales for All Days
// New Method: Get Daily Sales for All Days (Count of Transactions per Day)
exports.getHallDailySalesAllDays = async (req, res) => {
  try {
    const salesData = await HallTransaction.aggregate([
      {
        $match: {
          isVoided: { $ne: true }, // Exclude voided transactions
          paymentStatus: { $nin: ["Cancelled", "Refund"] }, // Exclude cancelled or refunded
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Group by day
          },
          totalSales: { $sum: 1 }, // Count the number of transactions per day
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date ascending
      },
      {
        $project: {
          _id: 0, // Omit _id
          date: "$_id", // Rename _id to date
          totalSales: 1, // Include the count of transactions
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: salesData.length > 0 ? salesData : [], // Return empty array if no data
    });
  } catch (error) {
    console.error("Error fetching hall daily sales for all days:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hall daily sales for all days",
      error: error.message || "Internal Server Error",
    });
  }
};

// New Method: Get Daily Sales by Payment Method
exports.getDailySalesByPaymentMethod = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const salesData = await HallTransaction.aggregate([
      {
        $match: {
          isVoided: { $ne: true },
          paymentStatus: { $nin: ["Cancelled", "Refund"] },
          createdAt: { $gte: todayStart, $lte: todayEnd },
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

    // Fetch all payment methods to ensure all are included, even with $0
    const allPaymentMethods = await PaymentMethod.find({}, { name: 1 });
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
