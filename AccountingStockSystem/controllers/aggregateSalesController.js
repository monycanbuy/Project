const mongoose = require("mongoose");
const Laundry = require("../models/laundryModel");
const Kabasa = require("../models/kabasaModel");
const HallTransaction = require("../models/hallModel");
const FrontOfficeSale = require("../models/frontOfficeModel");
const Seminar = require("../models/seminarsModel");
const SaleTransaction = require("../models/salesTransactionModel");
const PaymentMethod = require("../models/PaymentMethodModel");
const moment = require("moment-timezone"); // Ensure this is imported

// exports.getDailySalesHistory = async (req, res) => {
//   try {
//     // Calculate date range in Nigeria time (WAT, UTC+1)
//     const currentDate = new Date();
//     const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
//     const nowInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

//     // Set endDate to end of today WAT
//     const endDate = new Date(nowInNigeria);
//     endDate.setUTCHours(23, 59, 59, 999); // Feb 26, 23:59:59 WAT

//     // Start date: 30 days back from today’s start
//     const startDate = new Date(nowInNigeria);
//     startDate.setDate(startDate.getDate() - 30);
//     startDate.setUTCHours(0, 0, 0, 0); // Jan 27, 00:00:00 WAT

//     console.log("Date range:", { startDate, endDate });

//     const sales = await Promise.all([
//       Laundry.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//             status: { $nin: ["Cancelled", "Refund"] }, // Add consistency
//             isVoided: false,
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//       Kabasa.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//             status: { $nin: ["Cancelled", "Refund"] }, // Add missing filter
//             isVoided: false,
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//       HallTransaction.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//             paymentStatus: { $nin: ["Cancelled", "Refund"] },
//             isVoided: false,
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//       FrontOfficeSale.aggregate([
//         {
//           $match: {
//             date: { $gte: startDate, $lte: endDate }, // Use 'date' field
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//             total: { $sum: "$amount" }, // Correct field
//           },
//         },
//       ]),
//       Seminar.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//       SaleTransaction.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//             isVoided: false,
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//     ]);

//     // Debug: Log raw aggregation results
//     console.log("Raw sales data:", sales);

//     const combinedSales = sales.reduce((acc, modelSales, index) => {
//       modelSales.forEach((daySale) => {
//         const dateKey = daySale._id;
//         if (!acc[dateKey]) acc[dateKey] = { Date: dateKey };
//         switch (index) {
//           case 0:
//             acc[dateKey].Laundry = daySale.total;
//             break;
//           case 1:
//             acc[dateKey].Kabsa = daySale.total;
//             break;
//           case 2:
//             acc[dateKey].HallTransaction = daySale.total;
//             break;
//           case 3:
//             acc[dateKey].FrontOfficeSale = daySale.total;
//             break;
//           case 4:
//             acc[dateKey].Seminar = daySale.total;
//             break;
//           case 5:
//             acc[dateKey]["Total of Minimart&Restaurant"] = daySale.total;
//             break;
//           default:
//             console.warn("Unexpected model index:", index);
//         }
//       });
//       return acc;
//     }, {});

//     const result = Object.values(combinedSales)
//       .map((day) => {
//         const total = Object.values(day)
//           .filter((value) => typeof value === "number")
//           .reduce((sum, value) => sum + value, 0);
//         return {
//           ...day,
//           "Total of Minimart&Restaurant":
//             day["Total of Minimart&Restaurant"] || 0,
//           TotalAmount: total,
//         };
//       })
//       .sort((a, b) => new Date(b.Date) - new Date(a.Date)); // Sort by date in descending order

//     console.log("Final result:", result);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while fetching sales history.");
//   }
// };
// exports.getDailySalesHistory = async (req, res) => {
//   try {
//     // Calculate date range in Nigeria time (WAT, UTC+1)
//     const currentDate = new Date();
//     const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
//     const nowInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

//     // Set endDate to end of today WAT
//     const endDate = new Date(nowInNigeria);
//     endDate.setUTCHours(23, 59, 59, 999); // e.g., Mar 6, 23:59:59 WAT

//     // Start date: 30 days back from today’s start
//     const startDate = new Date(nowInNigeria);
//     startDate.setDate(startDate.getDate() - 30);
//     startDate.setUTCHours(0, 0, 0, 0); // e.g., Feb 5, 00:00:00 WAT

//     console.log("Date range:", { startDate, endDate });

//     const sales = await Promise.all([
//       Laundry.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//             status: { $nin: ["Cancelled", "Refund"] },
//             isVoided: false,
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//       HallTransaction.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//             paymentStatus: { $nin: ["Cancelled", "Refund"] },
//             isVoided: false,
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//       FrontOfficeSale.aggregate([
//         {
//           $match: {
//             date: { $gte: startDate, $lte: endDate },
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//             total: { $sum: "$amount" },
//           },
//         },
//       ]),
//       Seminar.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//       SaleTransaction.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//             isVoided: false,
//           },
//         },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             total: { $sum: "$totalAmount" },
//           },
//         },
//       ]),
//     ]);

//     // Debug: Log raw aggregation results
//     console.log("Raw sales data:", sales);

//     const combinedSales = sales.reduce((acc, modelSales, index) => {
//       modelSales.forEach((daySale) => {
//         const dateKey = daySale._id;
//         if (!acc[dateKey]) acc[dateKey] = { Date: dateKey };
//         switch (index) {
//           case 0:
//             acc[dateKey].Laundry = daySale.total;
//             break;
//           case 1:
//             acc[dateKey].HallTransaction = daySale.total;
//             break;
//           case 2:
//             acc[dateKey].FrontOfficeSale = daySale.total;
//             break;
//           case 3:
//             acc[dateKey].Seminar = daySale.total;
//             break;
//           case 4:
//             acc[dateKey]["Total of Minimart&Restaurant"] = daySale.total;
//             break;
//           default:
//             console.warn("Unexpected model index:", index);
//         }
//       });
//       return acc;
//     }, {});

//     const result = Object.values(combinedSales)
//       .map((day) => {
//         const total = Object.values(day)
//           .filter((value) => typeof value === "number")
//           .reduce((sum, value) => sum + value, 0);
//         return {
//           ...day,
//           "Total of Minimart&Restaurant":
//             day["Total of Minimart&Restaurant"] || 0,
//           TotalAmount: total,
//         };
//       })
//       .sort((a, b) => new Date(b.Date) - new Date(a.Date)); // Sort by date in descending order

//     console.log("Final result:", result);
//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while fetching sales history.");
//   }
// };
exports.getDailySalesHistory = async (req, res) => {
  try {
    // Calculate date range in Nigeria time (WAT, UTC+1)
    const currentDate = new Date();
    const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const nowInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

    // Set endDate to end of today WAT
    const endDate = new Date(nowInNigeria);
    endDate.setUTCHours(23, 59, 59, 999); // e.g., Mar 6, 23:59:59 WAT

    // Start date: 30 days back from today’s start
    const startDate = new Date(nowInNigeria);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setUTCHours(0, 0, 0, 0); // e.g., Feb 5, 00:00:00 WAT

    console.log("Date range:", { startDate, endDate });

    const sales = await Promise.all([
      Laundry.aggregate([
        {
          $match: {
            transactionDate: { $gte: startDate, $lte: endDate }, // Use transactionDate
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      HallTransaction.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate }, // Use date
            paymentStatus: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      FrontOfficeSale.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate }, // Use date
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            total: { $sum: "$amount" },
          },
        },
      ]),
      Seminar.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }, // Placeholder; update to transactionDate or date if added
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Update field if changed
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      SaleTransaction.aggregate([
        {
          $match: {
            transactionDate: { $gte: startDate, $lte: endDate }, // Use transactionDate
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    // Debug: Log raw aggregation results
    console.log("Raw sales data:", sales);

    const combinedSales = sales.reduce((acc, modelSales, index) => {
      modelSales.forEach((daySale) => {
        const dateKey = daySale._id;
        if (!acc[dateKey]) acc[dateKey] = { Date: dateKey };
        switch (index) {
          case 0:
            acc[dateKey].Laundry = daySale.total;
            break;
          case 1:
            acc[dateKey].HallTransaction = daySale.total;
            break;
          case 2:
            acc[dateKey].FrontOfficeSale = daySale.total;
            break;
          case 3:
            acc[dateKey].Seminar = daySale.total;
            break;
          case 4:
            acc[dateKey]["Total of Minimart&Restaurant"] = daySale.total;
            break;
          default:
            console.warn("Unexpected model index:", index);
        }
      });
      return acc;
    }, {});

    const result = Object.values(combinedSales)
      .map((day) => {
        const total = Object.values(day)
          .filter((value) => typeof value === "number")
          .reduce((sum, value) => sum + value, 0);
        return {
          ...day,
          "Total of Minimart&Restaurant":
            day["Total of Minimart&Restaurant"] || 0,
          TotalAmount: total,
        };
      })
      .sort((a, b) => new Date(b.Date) - new Date(a.Date)); // Sort by date in descending order

    console.log("Final result:", result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching sales history.");
  }
};

// exports.getDailySalesReport = async (req, res) => {
//   try {
//     // Calculate start and end of day (Nigeria time - WAT, UTC+1)
//     const currentDate = new Date();
//     const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
//     const todayInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

//     const startOfDay = new Date(todayInNigeria);
//     startOfDay.setUTCHours(0, 0, 0, 0); // 00:00:00 WAT
//     const endOfDay = new Date(todayInNigeria);
//     endOfDay.setUTCHours(23, 59, 59, 999); // 23:59:59 WAT

//     const dateString = todayInNigeria.toISOString().split("T")[0];

//     // Aggregate SaleTransaction (restaurant & minimart)
//     const saleTransactions = await SaleTransaction.find({
//       date: { $gte: startOfDay, $lte: endOfDay },
//       isVoided: false,
//     }).lean();

//     const restaurantSales = saleTransactions
//       .filter((t) => t.saleType === "restaurant")
//       .reduce((sum, t) => sum + (t.totalAmount || 0), 0);
//     const minimartSales = saleTransactions
//       .filter((t) => t.saleType === "minimart")
//       .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

//     // Aggregate Laundry
//     const laundryTransactions = await Laundry.find({
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//       status: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     }).lean();
//     const laundrySales = laundryTransactions.reduce(
//       (sum, t) => sum + (t.totalAmount || 0),
//       0
//     );

//     // Aggregate Kabasa
//     const kabasaTransactions = await Kabasa.find({
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//       status: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     }).lean();
//     const kabasaSales = kabasaTransactions.reduce(
//       (sum, t) => sum + (t.totalAmount || 0),
//       0
//     );

//     // Aggregate HallTransaction
//     const hallTransactions = await HallTransaction.find({
//       date: { $gte: startOfDay, $lte: endOfDay },
//       paymentStatus: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     }).lean();
//     const hallSales = hallTransactions.reduce(
//       (sum, t) => sum + (t.totalAmount || 0),
//       0
//     );

//     // Aggregate FrontOfficeSale
//     const frontOfficeTransactions = await FrontOfficeSale.find({
//       date: { $gte: startOfDay, $lte: endOfDay },
//     }).lean();
//     const frontOfficeSales = frontOfficeTransactions.reduce(
//       (sum, t) => sum + (t.amount || 0),
//       0
//     );

//     // Aggregate Seminar
//     const seminarTransactions = await Seminar.find({
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//       status: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     }).lean();
//     const seminarSales = seminarTransactions.reduce(
//       (sum, t) => sum + (t.totalAmount || 0),
//       0
//     );

//     // Calculate overall daily sales
//     const overallDailySales =
//       restaurantSales +
//       minimartSales +
//       laundrySales +
//       kabasaSales +
//       hallSales +
//       frontOfficeSales +
//       seminarSales;

//     // Count excluded transactions
//     const voidedCount =
//       (await SaleTransaction.countDocuments({
//         date: { $gte: startOfDay, $lte: endOfDay },
//         isVoided: true,
//       })) +
//       (await Laundry.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         isVoided: true,
//       })) +
//       (await Kabasa.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         isVoided: true,
//       })) +
//       (await HallTransaction.countDocuments({
//         date: { $gte: startOfDay, $lte: endOfDay },
//         isVoided: true,
//       })) +
//       (await Seminar.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         isVoided: true,
//       }));

//     const canceledCount =
//       (await Laundry.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         status: "Cancelled",
//       })) +
//       (await Kabasa.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         status: "Cancelled",
//       })) +
//       (await HallTransaction.countDocuments({
//         date: { $gte: startOfDay, $lte: endOfDay },
//         paymentStatus: "Cancelled",
//       })) +
//       (await Seminar.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         status: "Cancelled",
//       }));

//     const refundedCount =
//       (await Laundry.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         status: "Refund",
//       })) +
//       (await Kabasa.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         status: "Refund",
//       })) +
//       (await HallTransaction.countDocuments({
//         date: { $gte: startOfDay, $lte: endOfDay },
//         paymentStatus: "Refund",
//       })) +
//       (await Seminar.countDocuments({
//         createdAt: { $gte: startOfDay, $lte: endOfDay },
//         status: "Refund",
//       }));

//     res.status(200).json({
//       success: true,
//       data: {
//         date: dateString,
//         overallDailySales,
//         departments: {
//           restaurant: { totalSales: restaurantSales },
//           minimart: { totalSales: minimartSales },
//           laundry: { totalSales: laundrySales },
//           kabasa: { totalSales: kabasaSales },
//           hall: { totalSales: hallSales },
//           frontOffice: { totalSales: frontOfficeSales },
//           seminar: { totalSales: seminarSales }, //Added Seminar
//         },
//         excludedTransactions: {
//           voided: voidedCount || 0,
//           canceled: canceledCount || 0,
//           refunded: refundedCount || 0,
//         },
//       },
//       message: "Daily sales report for today fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching daily sales report:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       details: error.message,
//     });
//   }
// };

// exports.getPaymentMethodsReport = async (req, res) => {
//   try {
//     // Calculate start and end of day (Nigeria time - WAT, UTC+1)
//     const currentDate = new Date();
//     const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
//     const todayInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

//     const startOfDay = new Date(todayInNigeria);
//     startOfDay.setUTCHours(0, 0, 0, 0); // 00:00:00 WAT
//     const endOfDay = new Date(todayInNigeria);
//     endOfDay.setUTCHours(23, 59, 59, 999); // 23:59:59 WAT

//     const paymentMethods = await PaymentMethod.find().lean();
//     const paymentMethodBreakdown = {};

//     for (const method of paymentMethods) {
//       paymentMethodBreakdown[method.name] = { totalSales: 0 };
//     }

//     // Aggregate SaleTransaction
//     const saleTransactions = await SaleTransaction.find({
//       date: { $gte: startOfDay, $lte: endOfDay },
//       isVoided: false,
//     })
//       .populate("paymentMethod", "name")
//       .lean();

//     saleTransactions.forEach((t) => {
//       const pmName = t.paymentMethod?.name || "Unknown"; // Handle potentially missing paymentMethod
//       if (paymentMethodBreakdown[pmName]) {
//         paymentMethodBreakdown[pmName].totalSales += t.totalAmount || 0;
//       } else {
//         // Initialize if payment method not found (shouldn't happen with populate, but good practice)
//         paymentMethodBreakdown[pmName] = { totalSales: t.totalAmount || 0 };
//       }
//     });

//     // Aggregate Laundry
//     const laundryTransactions = await Laundry.find({
//       transactionDate: { $gte: startOfDay, $lte: endOfDay },
//       status: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     })
//       .populate("paymentMethod", "name")
//       .lean();

//     laundryTransactions.forEach((t) => {
//       const pmName = t.paymentMethod?.name || "Unknown";
//       if (paymentMethodBreakdown[pmName]) {
//         paymentMethodBreakdown[pmName].totalSales += t.totalAmount || 0;
//       } else {
//         paymentMethodBreakdown[pmName] = { totalSales: t.totalAmount || 0 };
//       }
//     });

//     // Aggregate Kabasa
//     const kabasaTransactions = await Kabasa.find({
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//       status: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     })
//       .populate("paymentMethod", "name")
//       .lean();
//     kabasaTransactions.forEach((t) => {
//       const pmName = t.paymentMethod?.name || "Unknown";
//       if (paymentMethodBreakdown[pmName]) {
//         paymentMethodBreakdown[pmName].totalSales += t.totalAmount || 0;
//       } else {
//         paymentMethodBreakdown[pmName] = { totalSales: t.totalAmount || 0 };
//       }
//     });

//     // Aggregate HallTransaction
//     const hallTransactions = await HallTransaction.find({
//       date: { $gte: startOfDay, $lte: endOfDay },
//       paymentStatus: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     })
//       .populate("paymentMethod", "name")
//       .lean();

//     hallTransactions.forEach((t) => {
//       const pmName = t.paymentMethod?.name || "Unknown";
//       if (paymentMethodBreakdown[pmName]) {
//         paymentMethodBreakdown[pmName].totalSales += t.totalAmount || 0;
//       } else {
//         paymentMethodBreakdown[pmName] = { totalSales: t.totalAmount || 0 };
//       }
//     });

//     // Aggregate FrontOfficeSale (assume "cash" since no paymentMethod field)
//     const frontOfficeTransactions = await FrontOfficeSale.find({
//       date: { $gte: startOfDay, $lte: endOfDay },
//     }).lean();

//     frontOfficeTransactions.forEach((t) => {
//       const pmName = "cash"; // Default to "cash"
//       paymentMethodBreakdown[pmName].totalSales += t.amount || 0;
//     });

//     res.status(200).json({
//       success: true,
//       data: paymentMethodBreakdown,
//       message: "Payment methods report for today fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching payment methods report:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       details: error.message,
//     });
//   }
// };

// exports.getTotalRevenue = async (req, res) => {
//   try {
//     // Aggregate SaleTransaction (restaurant & minimart)
//     const saleTransactions = await SaleTransaction.find({
//       isVoided: false,
//     }).lean();

//     const restaurantRevenue = saleTransactions
//       .filter((t) => t.saleType === "restaurant")
//       .reduce((sum, t) => sum + (t.totalAmount || 0), 0);
//     const minimartRevenue = saleTransactions
//       .filter((t) => t.saleType === "minimart")
//       .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

//     // Aggregate Laundry
//     const laundryTransactions = await Laundry.find({
//       status: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     }).lean();
//     const laundryRevenue = laundryTransactions.reduce(
//       (sum, t) => sum + (t.totalAmount || 0),
//       0
//     );

//     // Aggregate Kabasa
//     const kabasaTransactions = await Kabasa.find({
//       status: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     }).lean();
//     const kabasaRevenue = kabasaTransactions.reduce(
//       (sum, t) => sum + (t.totalAmount || 0),
//       0
//     );

//     // Aggregate HallTransaction
//     const hallTransactions = await HallTransaction.find({
//       paymentStatus: { $nin: ["Cancelled", "Refund"] },
//       isVoided: false,
//     }).lean();
//     const hallRevenue = hallTransactions.reduce(
//       (sum, t) => sum + (t.totalAmount || 0),
//       0
//     );

//     // Aggregate FrontOfficeSale (no exclusion flags assumed)
//     const frontOfficeTransactions = await FrontOfficeSale.find({}).lean();
//     const frontOfficeRevenue = frontOfficeTransactions.reduce(
//       (sum, t) => sum + (t.amount || 0),
//       0
//     );

//     // Calculate total revenue
//     const totalRevenue =
//       restaurantRevenue +
//       minimartRevenue +
//       laundryRevenue +
//       kabasaRevenue +
//       hallRevenue +
//       frontOfficeRevenue;

//     // Count excluded transactions (for reference)
//     const voidedCount =
//       (await SaleTransaction.countDocuments({ isVoided: true })) +
//       (await Laundry.countDocuments({ isVoided: true })) +
//       (await Kabasa.countDocuments({ isVoided: true })) +
//       (await HallTransaction.countDocuments({ isVoided: true }));

//     const canceledCount =
//       (await Laundry.countDocuments({ status: "Cancelled" })) +
//       (await Kabasa.countDocuments({ status: "Cancelled" })) +
//       (await HallTransaction.countDocuments({ paymentStatus: "Cancelled" }));

//     const refundedCount =
//       (await Laundry.countDocuments({ status: "Refund" })) +
//       (await Kabasa.countDocuments({ status: "Refund" })) +
//       (await HallTransaction.countDocuments({ paymentStatus: "Refund" }));

//     res.status(200).json({
//       success: true,
//       data: {
//         totalRevenue,
//         departments: {
//           restaurant: { totalRevenue: restaurantRevenue },
//           minimart: { totalRevenue: minimartRevenue },
//           laundry: { totalRevenue: laundryRevenue },
//           kabasa: { totalRevenue: kabasaRevenue },
//           hall: { totalRevenue: hallRevenue },
//           frontOffice: { totalRevenue: frontOfficeRevenue },
//         },
//         excludedTransactions: {
//           voided: voidedCount || 0,
//           canceled: canceledCount || 0,
//           refunded: refundedCount || 0,
//         },
//       },
//       message: "Total revenue report fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching total revenue report:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       details: error.message,
//     });
//   }
// };
exports.getDailySalesReport = async (req, res) => {
  try {
    // Calculate start and end of day (Nigeria time - WAT, UTC+1)
    const currentDate = new Date();
    const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const todayInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

    const startOfDay = new Date(todayInNigeria);
    startOfDay.setUTCHours(0, 0, 0, 0); // 00:00:00 WAT
    const endOfDay = new Date(todayInNigeria);
    endOfDay.setUTCHours(23, 59, 59, 999); // 23:59:59 WAT

    const dateString = todayInNigeria.toISOString().split("T")[0];

    // Aggregate SaleTransaction (restaurant, minimart, and kabasa)
    const saleTransactions = await SaleTransaction.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      isVoided: false,
    }).lean();

    const restaurantSales = saleTransactions
      .filter((t) => t.saleType === "restaurant")
      .reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    const minimartSales = saleTransactions
      .filter((t) => t.saleType === "minimart")
      .reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    const kabasaSales = saleTransactions
      .filter((t) => t.saleType === "kabasa")
      .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

    // Aggregate Laundry
    const laundryTransactions = await Laundry.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ["Cancelled", "Refund"] },
      isVoided: false,
    }).lean();
    const laundrySales = laundryTransactions.reduce(
      (sum, t) => sum + (t.totalAmount || 0),
      0
    );

    // Aggregate HallTransaction
    const hallTransactions = await HallTransaction.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      paymentStatus: { $nin: ["Cancelled", "Refund"] },
      isVoided: false,
    }).lean();
    const hallSales = hallTransactions.reduce(
      (sum, t) => sum + (t.totalAmount || 0),
      0
    );

    // Aggregate FrontOfficeSale
    const frontOfficeTransactions = await FrontOfficeSale.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).lean();
    const frontOfficeSales = frontOfficeTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    );

    // Aggregate Seminar
    const seminarTransactions = await Seminar.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ["Cancelled", "Refund"] },
      isVoided: false,
    }).lean();
    const seminarSales = seminarTransactions.reduce(
      (sum, t) => sum + (t.totalAmount || 0),
      0
    );

    // Calculate overall daily sales
    const overallDailySales =
      restaurantSales +
      minimartSales +
      kabasaSales +
      laundrySales +
      hallSales +
      frontOfficeSales +
      seminarSales;

    // Count excluded transactions
    const voidedCount =
      (await SaleTransaction.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
        isVoided: true,
      })) +
      (await Laundry.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        isVoided: true,
      })) +
      (await HallTransaction.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
        isVoided: true,
      })) +
      (await Seminar.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        isVoided: true,
      }));

    const canceledCount =
      (await Laundry.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: "Cancelled",
      })) +
      (await HallTransaction.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
        paymentStatus: "Cancelled",
      })) +
      (await Seminar.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: "Cancelled",
      }));

    const refundedCount =
      (await Laundry.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: "Refund",
      })) +
      (await HallTransaction.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
        paymentStatus: "Refund",
      })) +
      (await Seminar.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: "Refund",
      }));

    res.status(200).json({
      success: true,
      data: {
        date: dateString,
        overallDailySales,
        departments: {
          restaurant: { totalSales: restaurantSales },
          minimart: { totalSales: minimartSales },
          laundry: { totalSales: laundrySales },
          kabasa: { totalSales: kabasaSales },
          hall: { totalSales: hallSales },
          frontOffice: { totalSales: frontOfficeSales },
          seminar: { totalSales: seminarSales },
        },
        excludedTransactions: {
          voided: voidedCount || 0,
          canceled: canceledCount || 0,
          refunded: refundedCount || 0,
        },
      },
      message: "Daily sales report for today fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching daily sales report:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getPaymentMethodsReport = async (req, res) => {
  try {
    const currentDate = new Date();
    const nigeriaOffset = 1 * 60 * 60 * 1000; // WAT, UTC+1
    const todayInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

    const startOfDay = new Date(todayInNigeria);
    startOfDay.setUTCHours(0, 0, 0, 0); // 00:00:00 WAT
    const endOfDay = new Date(todayInNigeria);
    endOfDay.setUTCHours(23, 59, 59, 999); // 23:59:59 WAT

    console.log("Date Range:", startOfDay, endOfDay);

    const paymentMethods = await PaymentMethod.find().lean();
    const paymentMethodBreakdown = {};
    paymentMethods.forEach((method) => {
      paymentMethodBreakdown[method.name] = { totalSales: 0 };
    });

    // SaleTransaction
    const saleTransactions = await SaleTransaction.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      isVoided: false,
    })
      .populate("paymentMethod", "name")
      .lean();
    console.log("SaleTransactions:", saleTransactions);
    saleTransactions.forEach((t) => {
      const pmName = t.paymentMethod?.name || "Unknown";
      paymentMethodBreakdown[pmName].totalSales += t.totalAmount || 0;
    });
    console.log("After SaleTransactions:", paymentMethodBreakdown);

    // Laundry
    const laundryTransactions = await Laundry.find({
      transactionDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ["Cancelled", "Refund"] },
      isVoided: false,
    })
      .populate("paymentMethod", "name")
      .lean();
    console.log("Laundry Transactions:", laundryTransactions);
    laundryTransactions.forEach((t) => {
      const pmName = t.paymentMethod?.name || "Unknown";
      paymentMethodBreakdown[pmName].totalSales += t.totalAmount || 0;
    });
    console.log("After Laundry:", paymentMethodBreakdown);

    // Kabasa
    const kabasaTransactions = await Kabasa.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ["Cancelled", "Refund"] },
      isVoided: false,
    })
      .populate("paymentMethod", "name")
      .lean();
    console.log("Kabasa Transactions:", kabasaTransactions);
    kabasaTransactions.forEach((t) => {
      const pmName = t.paymentMethod?.name || "Unknown";
      paymentMethodBreakdown[pmName].totalSales += t.totalAmount || 0;
    });
    console.log("After Kabasa:", paymentMethodBreakdown);

    // HallTransaction
    const hallTransactions = await HallTransaction.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      paymentStatus: { $nin: ["Cancelled", "Refund"] },
      isVoided: false,
    })
      .populate("paymentMethod", "name")
      .lean();
    console.log("Hall Transactions:", hallTransactions);
    hallTransactions.forEach((t) => {
      const pmName = t.paymentMethod?.name || "Unknown";
      paymentMethodBreakdown[pmName].totalSales += t.totalAmount || 0;
    });
    console.log("After Hall:", paymentMethodBreakdown);

    // FrontOfficeSale
    const frontOfficeTransactions = await FrontOfficeSale.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).lean();
    console.log("FrontOffice Transactions:", frontOfficeTransactions);
    frontOfficeTransactions.forEach((t) => {
      paymentMethodBreakdown["cash"].totalSales += t.amount || 0;
    });
    console.log("After FrontOffice:", paymentMethodBreakdown);

    res.status(200).json({
      success: true,
      data: paymentMethodBreakdown,
      message: "Payment methods report for today fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching payment methods report:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getTotalRevenue = async (req, res) => {
  try {
    // Get current date and calculate month boundaries
    const now = new Date(); // e.g., Feb 26, 2025
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Feb 1, 2025
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Jan 1, 2025
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // Jan 31, 2025

    // Helper function to fetch revenue by month
    const fetchRevenueByMonth = async (startDate, endDate) => {
      // Aggregate SaleTransaction (restaurant & minimart)
      const saleTransactions = await SaleTransaction.find({
        isVoided: false,
        createdAt: { $gte: startDate, $lte: endDate },
      }).lean();

      const restaurantRevenue = saleTransactions
        .filter((t) => t.saleType === "restaurant")
        .reduce((sum, t) => sum + (t.totalAmount || 0), 0);
      const minimartRevenue = saleTransactions
        .filter((t) => t.saleType === "minimart")
        .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

      // Aggregate Laundry
      const laundryTransactions = await Laundry.find({
        status: { $nin: ["Cancelled", "Refund"] },
        isVoided: false,
        createdAt: { $gte: startDate, $lte: endDate },
      }).lean();
      const laundryRevenue = laundryTransactions.reduce(
        (sum, t) => sum + (t.totalAmount || 0),
        0
      );

      // Aggregate Kabasa
      const kabasaTransactions = await Kabasa.find({
        status: { $nin: ["Cancelled", "Refund"] },
        isVoided: false,
        createdAt: { $gte: startDate, $lte: endDate },
      }).lean();
      const kabasaRevenue = kabasaTransactions.reduce(
        (sum, t) => sum + (t.totalAmount || 0),
        0
      );

      // Aggregate HallTransaction
      const hallTransactions = await HallTransaction.find({
        paymentStatus: { $nin: ["Cancelled", "Refund"] },
        isVoided: false,
        createdAt: { $gte: startDate, $lte: endDate },
      }).lean();
      const hallRevenue = hallTransactions.reduce(
        (sum, t) => sum + (t.totalAmount || 0),
        0
      );

      // Aggregate FrontOfficeSale
      const frontOfficeTransactions = await FrontOfficeSale.find({
        createdAt: { $gte: startDate, $lte: endDate },
      }).lean();
      const frontOfficeRevenue = frontOfficeTransactions.reduce(
        (sum, t) => sum + (t.amount || 0),
        0
      );

      // Calculate total revenue
      const totalRevenue =
        restaurantRevenue +
        minimartRevenue +
        laundryRevenue +
        kabasaRevenue +
        hallRevenue +
        frontOfficeRevenue;

      // Count excluded transactions
      const voidedCount =
        (await SaleTransaction.countDocuments({
          isVoided: true,
          createdAt: { $gte: startDate, $lte: endDate },
        })) +
        (await Laundry.countDocuments({
          isVoided: true,
          createdAt: { $gte: startDate, $lte: endDate },
        })) +
        (await Kabasa.countDocuments({
          isVoided: true,
          createdAt: { $gte: startDate, $lte: endDate },
        })) +
        (await HallTransaction.countDocuments({
          isVoided: true,
          createdAt: { $gte: startDate, $lte: endDate },
        }));

      const canceledCount =
        (await Laundry.countDocuments({
          status: "Cancelled",
          createdAt: { $gte: startDate, $lte: endDate },
        })) +
        (await Kabasa.countDocuments({
          status: "Cancelled",
          createdAt: { $gte: startDate, $lte: endDate },
        })) +
        (await HallTransaction.countDocuments({
          paymentStatus: "Cancelled",
          createdAt: { $gte: startDate, $lte: endDate },
        }));

      const refundedCount =
        (await Laundry.countDocuments({
          status: "Refund",
          createdAt: { $gte: startDate, $lte: endDate },
        })) +
        (await Kabasa.countDocuments({
          status: "Refund",
          createdAt: { $gte: startDate, $lte: endDate },
        })) +
        (await HallTransaction.countDocuments({
          paymentStatus: "Refund",
          createdAt: { $gte: startDate, $lte: endDate },
        }));

      return {
        totalRevenue,
        departments: {
          restaurant: { totalRevenue: restaurantRevenue },
          minimart: { totalRevenue: minimartRevenue },
          laundry: { totalRevenue: laundryRevenue },
          kabasa: { totalRevenue: kabasaRevenue },
          hall: { totalRevenue: hallRevenue },
          frontOffice: { totalRevenue: frontOfficeRevenue },
        },
        excludedTransactions: {
          voided: voidedCount || 0,
          canceled: canceledCount || 0,
          refunded: refundedCount || 0,
        },
      };
    };

    // Fetch data for current and last month
    const currentMonthData = await fetchRevenueByMonth(currentMonthStart, now);
    const lastMonthData = await fetchRevenueByMonth(
      lastMonthStart,
      lastMonthEnd
    );

    // Format month strings (e.g., "2025-02" for Feb 2025)
    const formatMonth = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    res.status(200).json({
      success: true,
      data: {
        currentMonth: {
          month: formatMonth(currentMonthStart),
          ...currentMonthData,
        },
        lastMonth: {
          month: formatMonth(lastMonthStart),
          ...lastMonthData,
        },
      },
      message: "Monthly revenue report fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching monthly revenue report:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getMonthlySalesAcrossDepartments = async (req, res) => {
  try {
    // Adjust for Nigeria time (WAT, UTC+1)
    const currentDate = new Date();
    const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const nowInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

    console.log(
      "Starting aggregation - Current time in Nigeria:",
      nowInNigeria
    );

    // Aggregate sales from all departments by month
    const sales = await Promise.all([
      Laundry.aggregate([
        {
          $match: {
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Kabasa.aggregate([
        {
          $match: {
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      HallTransaction.aggregate([
        {
          $match: {
            paymentStatus: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      FrontOfficeSale.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            total: { $sum: "$amount" },
          },
        },
      ]),
      Seminar.aggregate([
        {
          $match: {
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      SaleTransaction.aggregate([
        {
          $match: {
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    console.log("Raw aggregation results:", sales);

    // Combine sales by month
    const combinedSales = sales.reduce((acc, modelSales) => {
      modelSales.forEach((monthSale) => {
        const monthKey = monthSale._id;
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, totalSales: 0 };
        }
        acc[monthKey].totalSales += monthSale.total;
      });
      return acc;
    }, {});

    console.log("Combined sales object:", combinedSales);

    // Convert to array and sort by month (descending)
    const result = Object.values(combinedSales)
      .map((entry) => ({
        month: entry.month,
        totalSales: entry.totalSales,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    console.log("Final result before sending:", result);

    res.status(200).json({
      success: true,
      data: result,
      message: "Monthly sales report fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

// New Method 2: Get Daily Sales All Time
exports.getDailySalesAllTime = async (req, res) => {
  try {
    // Adjust for Nigeria time (WAT, UTC+1)
    const currentDate = new Date();
    const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const nowInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

    // Aggregate sales from all departments by day
    const sales = await Promise.all([
      Laundry.aggregate([
        {
          $match: {
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Kabasa.aggregate([
        {
          $match: {
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      HallTransaction.aggregate([
        {
          $match: {
            paymentStatus: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      FrontOfficeSale.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$amount" },
          },
        },
      ]),
      Seminar.aggregate([
        {
          $match: {
            status: { $nin: ["Cancelled", "Refund"] },
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      SaleTransaction.aggregate([
        {
          $match: {
            isVoided: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    // Combine sales by day
    const combinedSales = sales.reduce((acc, modelSales) => {
      modelSales.forEach((daySale) => {
        const dateKey = daySale._id;
        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, totalSales: 0 };
        }
        acc[dateKey].totalSales += daySale.total;
      });
      return acc;
    }, {});

    // Convert to array and sort by date (descending)
    const result = Object.values(combinedSales)
      .map((entry) => ({
        date: entry.date,
        totalSales: entry.totalSales,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    res.status(200).json({
      success: true,
      data: result,
      message: "Daily sales history fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching daily sales all time:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getAllTimeTotalSales = async (req, res) => {
  try {
    // Aggregate total sales from all departments, excluding voided/canceled/refunded
    const sales = await Promise.all([
      SaleTransaction.aggregate([
        {
          $match: {
            isVoided: false, // Exclude voided transactions
          },
        },
        {
          $group: {
            _id: null, // No grouping by date, just total
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Laundry.aggregate([
        {
          $match: {
            status: { $nin: ["Cancelled", "Refund"] }, // Exclude canceled/refunded
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
      Kabasa.aggregate([
        {
          $match: {
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
          $match: {}, // No explicit exclusion flags, assuming all are valid unless specified
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

    // Sum up all department totals
    const totalSales = sales.reduce((sum, result) => {
      return sum + (result.length > 0 ? result[0].total : 0);
    }, 0);

    console.log("All-time total sales:", totalSales);

    res.status(200).json({
      success: true,
      data: {
        totalSales, // Just the number, e.g., 4240.54 or whatever the sum is
      },
      message: "All-time total sales fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching all-time total sales:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};

exports.getMonthlySalesComparison = async (req, res) => {
  try {
    // Adjust for Nigeria time (WAT, UTC+1)
    const currentDate = new Date();
    const nigeriaOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const nowInNigeria = new Date(currentDate.getTime() + nigeriaOffset);

    // Current month start and end (up to today)
    const currentMonthStart = new Date(
      nowInNigeria.getFullYear(),
      nowInNigeria.getMonth(),
      1
    );
    const currentMonthEnd = new Date(nowInNigeria); // Today’s date
    currentMonthEnd.setUTCHours(23, 59, 59, 999); // End of today WAT

    // Last month start and end (aligned to current month’s progress)
    const lastMonthStart = new Date(
      nowInNigeria.getFullYear(),
      nowInNigeria.getMonth() - 1,
      1
    );
    const lastMonthDayCount = nowInNigeria.getDate(); // e.g., 6th of March -> 6 days
    const lastMonthEnd = new Date(
      nowInNigeria.getFullYear(),
      nowInNigeria.getMonth() - 1,
      lastMonthDayCount
    );
    lastMonthEnd.setUTCHours(23, 59, 59, 999); // Align to current day count

    // Helper function to aggregate daily sales
    const aggregateDailySales = async (startDate, endDate) => {
      const sales = await Promise.all([
        Laundry.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
              status: { $nin: ["Cancelled", "Refund"] },
              isVoided: false,
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%b %d", date: "$createdAt" } }, // e.g., "Mar 01"
              total: { $sum: "$totalAmount" },
            },
          },
        ]),
        HallTransaction.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
              paymentStatus: { $nin: ["Cancelled", "Refund"] },
              isVoided: false,
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
              total: { $sum: "$totalAmount" },
            },
          },
        ]),
        FrontOfficeSale.aggregate([
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%b %d", date: "$date" } },
              total: { $sum: "$amount" },
            },
          },
        ]),
        Seminar.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
              total: { $sum: "$totalAmount" },
            },
          },
        ]),
        SaleTransaction.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
              isVoided: false,
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
              total: { $sum: "$totalAmount" },
            },
          },
        ]),
      ]);

      // Combine sales by day
      const combinedSales = sales.reduce((acc, modelSales) => {
        modelSales.forEach((daySale) => {
          const dateKey = daySale._id;
          acc[dateKey] = (acc[dateKey] || 0) + daySale.total;
        });
        return acc;
      }, {});

      return combinedSales;
    };

    // Fetch sales for both periods
    const currentMonthSales = await aggregateDailySales(
      currentMonthStart,
      currentMonthEnd
    );
    const lastMonthSales = await aggregateDailySales(
      lastMonthStart,
      lastMonthEnd
    );

    // Generate dates array and align data
    const currentDayCount = nowInNigeria.getDate(); // e.g., 6 days if March 6
    const dates = [];
    const currentData = [];
    const lastData = [];

    for (let i = 0; i < currentDayCount; i++) {
      const currentDate = new Date(currentMonthStart);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
      }); // e.g., "Mar 01"
      dates.push(dateStr);

      const lastDate = new Date(lastMonthStart);
      lastDate.setDate(lastDate.getDate() + i);
      const lastDateStr = lastDate.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
      }); // e.g., "Feb 01"

      currentData.push(currentMonthSales[dateStr] || 0);
      lastData.push(lastMonthSales[lastDateStr] || 0);
    }

    res.status(200).json({
      success: true,
      data: {
        dates,
        series: [
          { name: "Last Month", data: lastData },
          { name: "Running Month", data: currentData },
        ],
      },
      message: "Monthly sales comparison fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching monthly sales comparison:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      details: error.message,
    });
  }
};
