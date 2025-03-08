const express = require("express");
const router = express.Router();
const {
  getSalesTransactions,
  createSalesTransaction,
  updateSalesTransaction,
  voidSalesTransaction,
  getTodaySales,
  getAllTimeTotalSales,
  getLastSevenDaysSales,
  getSalesForLastTwoWeeks,
  getDailySalesByPaymentMethod,
} = require("../controllers/salesTransactionController"); // Your controller file
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware"); // Your authentication middleware (if needed)

/**
 * @swagger
 * tags:
 *   name: Sales Transactions
 *   description: API endpoints for managing sales transactions
 */

/**
 * @swagger
 * /api/trackinventories:
 *   get:
 *     summary: Get all sales transactions
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth:
 *     responses:
 *       200:
 *         description: Successful retrieval of sales transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SaleTransaction'
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:salestransactions"),
  getSalesTransactions
); // Authentication added if needed

/**
 * @swagger
 * /api/trackinventories/sales/today:
 *   get:
 *     summary: Get today's total sales with breakdown
 *     description: Retrieve total sales for today across all sale transactions, with separate totals for restaurant and minimart. Excludes voided transactions.
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Today's total sales with breakdown
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
 *                       description: Today's date (YYYY-MM-DD)
 *                     totalSales:
 *                       type: number
 *                       description: Combined total sales for today
 *                     breakdown:
 *                       type: object
 *                       properties:
 *                         restaurant:
 *                           type: number
 *                           description: Total sales for restaurant today
 *                         minimart:
 *                           type: number
 *                           description: Total sales for minimart today
 *                   example:
 *                     date: "2025-02-23"
 *                     totalSales: 9300
 *                     breakdown:
 *                       restaurant: 6000
 *                       minimart: 3300
 *       '500':
 *         description: Server error while fetching today's sales
 */
router.get(
  "/sales/today",
  authenticateUser,
  authorize("read:salestransactions"),
  getTodaySales
);

/**
 * @swagger
 * /api/trackinventories/sales/all-time-total:
 *   get:
 *     summary: Get all-time total sales
 *     description: Retrieve the cumulative total sales across all sale transactions (restaurant and minimart). Excludes voided transactions.
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: All-time total sales
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
 *                       description: Total sales across all time
 *                   example:
 *                     totalSales: 250000
 *       '500':
 *         description: Server error while fetching all-time total sales
 */
router.get(
  "/sales/all-time-total",
  authenticateUser,
  authorize("read:salestransactions"),
  getAllTimeTotalSales
);

/**
 * @swagger
 * /api/trackinventories/sales/last-seven-days:
 *   get:
 *     summary: Get daily total sales for the last seven days
 *     description: Retrieve total sales per day for the last seven days across all sale transactions. Excludes voided transactions.
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily total sales for the last seven days
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
 *                         description: Date of the sales (YYYY-MM-DD)
 *                       totalSales:
 *                         type: number
 *                         description: Total sales for the day
 *                     example:
 *                       date: "2025-02-23"
 *                       totalSales: 9300
 *       '500':
 *         description: Server error while fetching last seven days sales
 */
router.get(
  "/sales/last-seven-days",
  authenticateUser,
  authorize("read:salestransactions"),
  getLastSevenDaysSales
);

/**
 * @swagger
 * /api/trackinventories/sales/last-two-weeks:
 *   get:
 *     summary: Get daily total sales for the last two weeks
 *     description: Retrieve total sales per day for the last two weeks across all sale transactions. Excludes voided transactions.
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily total sales for the last two weeks
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
 *                         description: Date of the sales (YYYY-MM-DD)
 *                       totalSales:
 *                         type: number
 *                         description: Total sales for the day
 *                     example:
 *                       date: "2025-02-23"
 *                       totalSales: 9300
 *       '500':
 *         description: Server error while fetching last two weeks sales
 */
router.get(
  "/sales/last-two-weeks",
  authenticateUser,
  authorize("read:salestransactions"),
  getSalesForLastTwoWeeks
);

/**
 * @swagger
 * /api/trackinventories/sales/daily-sales-by-payment-method:
 *   get:
 *     summary: Get daily total sales by payment method
 *     description: Retrieve total sales per payment method for the current day across all sale transactions. Excludes voided transactions.
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily total sales by payment method
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
 *                       paymentMethodId:
 *                         type: string
 *                         description: ID of the payment method
 *                       paymentMethod:
 *                         type: string
 *                         description: Name of the payment method
 *                       totalAmount:
 *                         type: number
 *                         description: Total sales amount for the payment method
 *                     example:
 *                       paymentMethodId: "6781176b145aa6914ecec8e7"
 *                       paymentMethod: "cash"
 *                       totalAmount: 0
 *       '500':
 *         description: Server error while fetching daily sales by payment method
 */
router.get(
  "/sales/daily-sales-by-payment-method",
  authenticateUser,
  authorize("read:salestransactions"),
  getDailySalesByPaymentMethod
);

/**
 * @swagger
 * /api/trackinventories:
 *   post:
 *     summary: Create a new sales transaction
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleTransactionInput'
 *     responses:
 *       201:
 *         description: Sales transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SaleTransaction'
 *       400:
 *         description: Bad request (validation error)
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:salestransactions"),
  createSalesTransaction
);

/**
 * @swagger
 * /api/trackinventories/{id}/void:
 *   put:
 *     summary: Void a sales transaction
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth:
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the sales transaction to void
 *     responses:
 *       200:
 *         description: Sales transaction voided successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (e.g., already voided)
 *       404:
 *         description: Sales transaction not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/void",
  authenticateUser,
  authorize("void:salestransactions"),
  voidSalesTransaction
);

/**
 * @swagger
 * /api/trackinventories/{id}:
 *   put:
 *     summary: Update a sales transaction
 *     tags: [Sales Transactions]
 *     security:
 *       - bearerAuth:
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the sales transaction to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaleTransactionUpdateInput'
 *     responses:
 *       200:
 *         description: Sales transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SaleTransaction'
 *       400:
 *         description: Bad request (validation error)
 *       404:
 *         description: Sales transaction not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:salestransactions"),
  updateSalesTransaction
);

module.exports = router;
