const express = require("express");
const router = express.Router();
const {
  getDailySalesHistory,
  getDailySalesReport,
  getPaymentMethodsReport,
  getTotalRevenue,
  getMonthlySalesAcrossDepartments,
  getDailySalesAllTime,
  getAllTimeTotalSales,
  getMonthlySalesComparison,
} = require("../controllers/aggregateSalesController"); // Assuming this is where your controller is
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/aggregate-sales/daily:
 *   get:
 *     summary: Retrieve historical sales aggregation
 *     description: This endpoint fetches and aggregates sales data for multiple days, providing a history of daily sales without requiring any date parameters. It will return data from the current day back to a default number of days or all available history.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales history aggregation successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Date:
 *                     type: string
 *                     format: date
 *                     example: "2023-10-05"
 *                   Laundry:
 *                     type: number
 *                     example: 1500
 *                   Kabsa:
 *                     type: number
 *                     example: 2000
 *                   HallTransaction:
 *                     type: number
 *                     example: 3500
 *                   FrontOfficeSale:
 *                     type: number
 *                     example: 1000
 *                   Seminar:
 *                     type: number
 *                     example: 500
 *                   "Total of Minimart&Restaurant":
 *                     type: number
 *                     example: 4000
 *                   TotalAmount:
 *                     type: number
 *                     example: 12500
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "An error occurred while fetching sales history."
 */

router.get(
  "/daily",
  authenticateUser,
  authorize("read:dashboard"),
  getDailySalesHistory
);
console.log("getDailySales:", getDailySalesHistory);

/**
 * @swagger
 * /api/aggregate-sales/daily-report:
 *   get:
 *     summary: Retrieve daily sales report for the current day
 *     description: This endpoint fetches and aggregates sales data for the current day (in West Africa Time, UTC+1, Nigeria) across all departments, excluding voided, canceled, and refunded transactions. The date is automatically determined based on the server time adjusted to WAT.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily sales report successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-02-26"
 *                     overallDailySales:
 *                       type: number
 *                       example: 13550
 *                     departments:
 *                       type: object
 *                       properties:
 *                         restaurant:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 2500
 *                         minimart:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 1500
 *                         laundry:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 3000
 *                         kabasa:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 2000
 *                         hall:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 4000
 *                         frontOffice:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 550
 *                     excludedTransactions:
 *                       type: object
 *                       properties:
 *                         voided:
 *                           type: number
 *                           example: 1
 *                         canceled:
 *                           type: number
 *                           example: 1
 *                         refunded:
 *                           type: number
 *                           example: 1
 *                 message:
 *                   type: string
 *                   example: "Daily sales report for today fetched successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Server error"
 *               details: "Detailed error message"
 */
router.get(
  "/daily-report",
  authenticateUser,
  authorize("read:dashboard"),
  getDailySalesReport
);

/**
 * @swagger
 * /api/aggregate-sales/payment-methods-report:
 *   get:
 *     summary: Retrieve daily sales report by payment methods for the current day
 *     description: This endpoint fetches and aggregates sales data for the current day (in West Africa Time, UTC+1, Nigeria) based on payment methods, excluding voided, canceled, and refunded transactions. The date is automatically determined based on the server time adjusted to WAT.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods report successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     cash:
 *                       type: object
 *                       properties:
 *                         totalSales:
 *                           type: number
 *                           example: 5000
 *                     pos:
 *                       type: object
 *                       properties:
 *                         totalSales:
 *                           type: number
 *                           example: 6000
 *                     transfer:
 *                       type: object
 *                       properties:
 *                         totalSales:
 *                           type: number
 *                           example: 2550
 *                     "signing credit":
 *                       type: object
 *                       properties:
 *                         totalSales:
 *                           type: number
 *                           example: 0
 *                     credit:
 *                       type: object
 *                       properties:
 *                         totalSales:
 *                           type: number
 *                           example: 0
 *                 message:
 *                   type: string
 *                   example: "Payment methods report for today fetched successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Server error"
 *               details: "Detailed error message"
 */
router.get(
  "/payment-methods-report",
  authenticateUser,
  authorize("read:dashboard"),
  getPaymentMethodsReport
);

/**
 * @swagger
 * /api/aggregate-sales/total-revenue:
 *   get:
 *     summary: Retrieve total revenue report over all time
 *     description: This endpoint fetches and aggregates the total revenue generated across all departments (restaurant, minimart, laundry, kabasa, hall, front office) since the beginning of records, excluding voided, canceled, and refunded transactions.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total revenue report successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                       example: 500000
 *                     departments:
 *                       type: object
 *                       properties:
 *                         restaurant:
 *                           type: object
 *                           properties:
 *                             totalRevenue:
 *                               type: number
 *                               example: 100000
 *                         minimart:
 *                           type: object
 *                           properties:
 *                             totalRevenue:
 *                               type: number
 *                               example: 75000
 *                         laundry:
 *                           type: object
 *                           properties:
 *                             totalRevenue:
 *                               type: number
 *                               example: 120000
 *                         kabasa:
 *                           type: object
 *                           properties:
 *                             totalRevenue:
 *                               type: number
 *                               example: 80000
 *                         hall:
 *                           type: object
 *                           properties:
 *                             totalRevenue:
 *                               type: number
 *                               example: 90000
 *                         frontOffice:
 *                           type: object
 *                           properties:
 *                             totalRevenue:
 *                               type: number
 *                               example: 35000
 *                     excludedTransactions:
 *                       type: object
 *                       properties:
 *                         voided:
 *                           type: number
 *                           example: 10
 *                         canceled:
 *                           type: number
 *                           example: 5
 *                         refunded:
 *                           type: number
 *                           example: 3
 *                 message:
 *                   type: string
 *                   example: "Total revenue report fetched successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Server error"
 *               details: "Detailed error message"
 */
// Added authenticateUser middleware here.  This protects the route.
router.get(
  "/total-revenue",
  authenticateUser,
  authorize("read:dashboard"),
  getTotalRevenue
);

/**
 * @swagger
 * /api/aggregate-sales/monthly-sales:
 *   get:
 *     summary: Retrieve total monthly sales across all departments
 *     description: This endpoint fetches and aggregates total sales data across all departments (restaurant, minimart, laundry, kabasa, hall, front office, seminar) grouped by month, excluding voided, canceled, and refunded transactions. Covers all available historical data.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly sales report successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2025-02"
 *                       totalSales:
 *                         type: number
 *                         example: 150000
 *                 message:
 *                   type: string
 *                   example: "Monthly sales report fetched successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Server error"
 *               details: "Detailed error message"
 */
router.get(
  "/monthly-sales",
  authenticateUser,
  authorize("read:dashboard"),
  getMonthlySalesAcrossDepartments
);

/**
 * @swagger
 * /api/aggregate-sales/daily-sales-all-time:
 *   get:
 *     summary: Retrieve total daily sales across all time
 *     description: This endpoint fetches and aggregates total sales data across all departments (restaurant, minimart, laundry, kabasa, hall, front office, seminar) grouped by day, excluding voided, canceled, and refunded transactions. Covers all available historical data.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily sales history successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-02-26"
 *                       totalSales:
 *                         type: number
 *                         example: 6500
 *                 message:
 *                   type: string
 *                   example: "Daily sales history fetched successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Server error"
 *               details: "Detailed error message"
 */
router.get(
  "/daily-sales-all-time",
  authenticateUser,
  authorize("read:dashboard"),
  getDailySalesAllTime
);

/**
 * @swagger
 * /api/aggregate-sales/all-time-total:
 *   get:
 *     summary: Retrieve all-time total sales
 *     description: This endpoint fetches and aggregates the total sales data across all departments (restaurant, minimart, laundry, kabasa, hall, front office, seminar) since the beginning of records, excluding voided, canceled, and refunded transactions.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All-time total sales successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalSales:
 *                       type: number
 *                       example: 1000000
 *                     departments:
 *                       type: object
 *                       properties:
 *                         restaurant:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 200000
 *                         minimart:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 150000
 *                         laundry:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 250000
 *                         kabasa:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 100000
 *                         hall:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 150000
 *                         frontOffice:
 *                           type: object
 *                           properties:
 *                             totalSales:
 *                               type: number
 *                               example: 50000
 *                     excludedTransactions:
 *                       type: object
 *                       properties:
 *                         voided:
 *                           type: number
 *                           example: 20
 *                         canceled:
 *                           type: number
 *                           example: 10
 *                         refunded:
 *                           type: number
 *                           example: 5
 *                 message:
 *                   type: string
 *                   example: "All-time total sales fetched successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Server error"
 *               details: "Detailed error message"
 */
router.get(
  "/all-time-total",
  authenticateUser,
  authorize("read:dashboard"),
  getAllTimeTotalSales
);

/**
 * @swagger
 * /api/aggregate-sales/monthly-comparison:
 *   get:
 *     summary: Retrieve daily sales comparison for current and last month
 *     description: This endpoint fetches and aggregates daily sales data for the current month (up to today) and the equivalent days of the previous month, excluding voided, canceled, and refunded transactions. Returns data formatted for a multiple bar chart comparison.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly sales comparison successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     dates:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "Mar 01"
 *                     series:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Last Month"
 *                           data:
 *                             type: array
 *                             items:
 *                               type: number
 *                               example: 12000
 *                 message:
 *                   type: string
 *                   example: "Monthly sales comparison fetched successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Server error"
 *               details: "Detailed error message"
 */
router.get(
  "/monthly-comparison",
  authenticateUser,
  authorize("read:dashboard"),
  getMonthlySalesComparison
);

module.exports = router;
