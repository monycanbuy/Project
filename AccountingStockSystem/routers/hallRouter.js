// routers/hallTransactionRouter.js
const express = require("express");
const router = express.Router();
const hallTransactionController = require("../controllers/hallController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Hall Transactions
 *   description: API endpoints for managing hall transactions
 */

/**
 * @swagger
 * /api/hall-transactions:
 *   post:
 *     summary: Create a new hall transaction
 *     tags: [Hall Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               halls:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     hallId:
 *                       type: string
 *                       format: uuid
 *                       example: "6458cf6c8b9bff1e4a77a5b8"
 *                     name:
 *                       type: string
 *                       example: "Main Hall"
 *                     qty:
 *                       type: number
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 2000
 *                 required:
 *                   - hallId
 *                   - name
 *                   - qty
 *                   - price
 *               customerName:
 *                 type: string
 *                 example: "John Doe"
 *               contactPhone:
 *                 type: string
 *                 example: "09022332211"
 *               eventType:
 *                 type: string
 *                 enum: ["conference", "workshop", "webinar", "Wedding"]
 *                 example: "Wedding"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-11-03T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-11-03T18:00:00Z"
 *               discount:
 *                 type: number
 *                 example: 10
 *               paymentMethod:
 *                 type: string
 *                 format: uuid
 *                 example: "6458cf6c8b9bff1e4a77a5b8"
 *               paymentStatus:
 *                 type: string
 *                 enum: ["Paid", "Pending", "Cancelled", "Refund"]
 *                 example: "Pending"
 *               notes:
 *                 type: string
 *                 example: "Special setup required"
 *             required:
 *               - halls
 *               - customerName
 *               - eventType
 *               - startTime
 *               - endTime
 *               - paymentMethod
 *               - paymentStatus
 *     responses:
 *       '201':
 *         description: Hall transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Hall transaction created successfully
 *                 data:
 *                   $ref: '#/components/schemas/HallTransaction'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:hall"),
  hallTransactionController.createHallTransaction
);

/**
 * @swagger
 * /api/hall-transactions/summary:
 *   get:
 *     summary: Get comprehensive summary of hall transactions
 *     tags: [Hall Transactions]
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the summary (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the summary (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: Comprehensive summary of hall transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                   example: 15000
 *                 totalDiscountCount:
 *                   type: number
 *                   example: 5
 *                 totalDiscountSum:
 *                   type: number
 *                   example: 1000
 *                 paymentMethods:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       method:
 *                         type: string
 *                         example: "Card"
 *                       count:
 *                         type: number
 *                         example: 10
 *                       amount:
 *                         type: number
 *                         example: 10000
 *                       discountCount:
 *                         type: number
 *                         example: 2
 *                       discountSum:
 *                         type: number
 *                         example: 500
 *                 statusCounts:
 *                   type: object
 *                   properties:
 *                     Paid:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                           example: 8
 *                         amount:
 *                           type: number
 *                           example: 8000
 *                     Pending:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                           example: 2
 *                         amount:
 *                           type: number
 *                           example: 2000
 *       '204':
 *         description: No data found for the specified date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noDataForRange:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "No search found for the criteria"
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/summary",
  authenticateUser,
  authorize("read:hall"),
  hallTransactionController.getHallComprehensiveSummary
);

/**
 * @swagger
 * /api/hall-transactions:
 *   get:
 *     summary: Get all hall transactions
 *     tags: [Hall Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of hall transactions
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
 *                     $ref: '#/components/schemas/HallTransaction'
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:hall"),
  hallTransactionController.getAllHallTransactions
);

/**
 * @swagger
 * /api/hall-transactions/daily-sales-by-event-type:
 *   get:
 *     summary: Get daily sales by event type for Hall transactions
 *     description: Retrieve the total sales and breakdown by event type (conference, workshop, webinar, Wedding) for today's Hall transactions, excluding voided, cancelled, or refunded records.
 *     tags: [Hall Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily sales by event type retrieved successfully
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
 *                       description: Total sales amount for today
 *                       example: 12000
 *                     eventSales:
 *                       type: object
 *                       properties:
 *                         conference:
 *                           type: number
 *                           example: 5000
 *                         workshop:
 *                           type: number
 *                           example: 3000
 *                         webinar:
 *                           type: number
 *                           example: 2000
 *                         Wedding:
 *                           type: number
 *                           example: 1000
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/daily-sales-by-event-type",
  authenticateUser,
  authorize("read:hall"),
  hallTransactionController.getHallDailySalesByEventType
);

/**
 * @swagger
 * /api/hall-transactions/all-time-sales:
 *   get:
 *     summary: Get all-time total sales for Hall transactions
 *     description: Retrieve the total sales across all Hall transactions, excluding voided, cancelled, or refunded records.
 *     tags: [Hall Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: All-time total sales retrieved successfully
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
 *                       description: Total sales amount across all valid transactions
 *                       example: 500000
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/all-time-sales",
  authenticateUser,
  authorize("read:hall"),
  hallTransactionController.getHallAllTimeSales
);

/**
 * @swagger
 * /api/hall-transactions/daily-sales-all-days:
 *   get:
 *     summary: Get daily sales for all days for Hall transactions
 *     description: Retrieve the total sales for each day across all Hall transactions, excluding voided, cancelled, or refunded records.
 *     tags: [Hall Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily sales for all days retrieved successfully
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
 *                         description: The date of the sales (YYYY-MM-DD)
 *                         example: "2025-02-23"
 *                       totalSales:
 *                         type: number
 *                         description: Total sales amount for that day
 *                         example: 12000
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/daily-sales-all-days",
  authenticateUser,
  authorize("read:hall"),
  hallTransactionController.getHallDailySalesAllDays
);

/**
 * @swagger
 * /api/hall-transactions/daily-sales-by-payment-method:
 *   get:
 *     summary: Get daily sales by payment method for Hall transactions
 *     description: Retrieve the total sales and breakdown by payment method for today's Hall transactions, excluding voided, cancelled, or refunded records.
 *     tags: [Hall Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily sales by payment method retrieved successfully
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
 *                         format: uuid
 *                         description: The ObjectId of the payment method
 *                         example: "6781176b145aa6914ecec8e7"
 *                       paymentMethod:
 *                         type: string
 *                         description: The name of the payment method
 *                         example: "cash"
 *                       totalAmount:
 *                         type: number
 *                         description: Total amount for this payment method today
 *                         example: 1500
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/daily-sales-by-payment-method",
  authenticateUser,
  authorize("read:hall"),
  hallTransactionController.getDailySalesByPaymentMethod
);

/**
 * @swagger
 * /api/hall-transactions/{id}:
 *   get:
 *     summary: Get a specific hall transaction by id
 *     tags: [Hall Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hall transaction
 *     responses:
 *       '200':
 *         description: The hall transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HallTransaction'
 *       '404':
 *         description: Hall transaction not found
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/:id",
  authenticateUser,
  authorize("read:hall"),
  hallTransactionController.getHallTransactionById
);

/**
 * @swagger
 * /api/hall-transactions/{id}:
 *   put:
 *     summary: Update a hall transaction
 *     tags: [Hall Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hall transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               halls:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     hallId:
 *                       type: string
 *                       description: The ID of the hall if updating an existing hall
 *                       example: "6458cf6c8b9bff1e4a77a5b8"
 *                     name:
 *                       type: string
 *                       example: "Main Hall"
 *                     qty:
 *                       type: number
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 2000
 *                 description: Array of hall objects to update or add
 *               customerName:
 *                 type: string
 *                 example: "John Doe"
 *               contactPhone:
 *                 type: string
 *                 example: "09022332211"
 *               eventType:
 *                 type: string
 *                 enum: ["conference", "workshop", "webinar", "Wedding"]
 *                 example: "Wedding"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-11-03T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-11-03T18:00:00Z"
 *               discount:
 *                 type: number
 *                 example: 10
 *               paymentMethod:
 *                 type: string
 *                 format: uuid
 *                 example: "6458cf6c8b9bff1e4a77a5b8"
 *               paymentStatus:
 *                 type: string
 *                 enum: ["Paid", "Pending", "Cancelled", "Refund"]
 *                 example: "Pending"
 *               notes:
 *                 type: string
 *                 example: "Updated notes"
 *     responses:
 *       '200':
 *         description: Hall transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hall transaction updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/HallTransaction'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 *       '404':
 *         description: Hall transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Hall transaction record not found"
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error updating hall transaction record"
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:hall"),
  hallTransactionController.updateHallTransaction
);

/**
 * @swagger
 * /api/hall-transactions/{id}:
 *   delete:
 *     summary: Void a hall transaction (Mark as voided)
 *     tags: [Hall Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hall transaction to void
 *     responses:
 *       '200':
 *         description: Hall transaction voided successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Hall transaction voided successfully
 *                 data:
 *                   $ref: '#/components/schemas/HallTransaction'
 *       '400':
 *         description: Transaction already voided
 *       '404':
 *         description: Hall transaction not found
 *       '500':
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:hall"),
  hallTransactionController.voidHallTransaction
);

module.exports = router;
