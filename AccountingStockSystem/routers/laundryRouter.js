const express = require("express");
const router = express.Router();
const laundryController = require("../controllers/laundryController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/laundry:
 *   get:
 *     summary: Get all laundry records
 *     tags:
 *       - Laundry
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all laundry records
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:laundries"),
  laundryController.getAllLaundry
);

/**
 * @swagger
 * /api/laundry:
 *   post:
 *     summary: Create a new laundry record
 *     tags:
 *       - Laundry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Laundry record details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *               receiptNo:
 *                 type: string
 *               serviceType:
 *                 type: array
 *                 items:
 *                   type: string
 *               paymentMethod:
 *                 type: string
 *               qty:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *               discount:
 *                 type: number
 *               phoneNo:
 *                 type: string
 *               salesBy:
 *                 type: string
 *             required:
 *               - customer
 *               - receiptNo
 *               - serviceType
 *               - paymentMethod
 *               - qty
 *               - totalAmount
 *               - salesBy
 *     responses:
 *       201:
 *         description: Laundry record created successfully
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:laundries"),
  laundryController.createLaundry
);

/**
 * @swagger
 * /api/laundry/daily-sales:
 *   get:
 *     summary: Get daily laundry sales and payment method breakdown
 *     description: Retrieve total sales and sales breakdown by payment method for a specific day. Excludes Cancelled, Refund, and voided transactions.
 *     tags: [Laundry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for which to fetch sales (YYYY-MM-DD). Defaults to today if not provided.
 *     responses:
 *       '200':
 *         description: Daily laundry sales data
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
 *                       description: Total sales for the day
 *                     paymentMethodSales:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *                         description: Sales amount for each payment method
 *                       example:
 *                         cash: 7500
 *                         card: 5000
 *                         mobile: 0
 *       '500':
 *         description: Server error while fetching daily sales
 */
router.get(
  "/daily-sales",
  authenticateUser,
  authorize("read:laundries"),
  laundryController.getDailyLaundrySales
);

/**
 * @swagger
 * /api/laundry/all-time-sales:
 *   get:
 *     summary: Get all-time total laundry sales
 *     description: Retrieve the total sales from all laundry records across all time or a specified date range. Excludes Cancelled, Refund, and voided transactions.
 *     tags: [Laundry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering sales (YYYY-MM-DD). Optional.
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering sales (YYYY-MM-DD). Optional.
 *     responses:
 *       '200':
 *         description: All-time total laundry sales
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
 *                       description: Total sales across all time or specified range
 *                       example: 93
 *       '500':
 *         description: Server error while fetching all-time sales
 */
router.get(
  "/all-time-sales",
  authenticateUser,
  authorize("read:laundries"),
  laundryController.getAllTimeLaundrySales
);

/**
 * @swagger
 * /api/laundry/daily-sales-all-days:
 *   get:
 *     summary: Get daily total sales for all days
 *     description: Retrieve total sales per day across all laundry records. Excludes Cancelled, Refund, and voided transactions.
 *     tags: [Laundry]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily total sales for all days
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
 *                       totalSales: 4500
 *       '500':
 *         description: Server error while fetching daily sales
 */
router.get(
  "/daily-sales-all-days",
  authenticateUser,
  authorize("read:laundries"),
  laundryController.getDailySalesAllDays
);

/**
 * @swagger
 * /api/laundry/{id}:
 *   put:
 *     summary: Update an existing laundry record
 *     tags:
 *       - Laundry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the laundry record
 *     requestBody:
 *       description: Laundry record update details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *               receiptNo:
 *                 type: string
 *               serviceType:
 *                 type: array
 *                 items:
 *                   type: string
 *               paymentMethod:
 *                 type: string
 *               qty:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *               discount:
 *                 type: number
 *               phoneNo:
 *                 type: string
 *               salesBy:
 *                 type: string
 *             required:
 *               - customer
 *               - receiptNo
 *               - serviceType
 *               - paymentMethod
 *               - qty
 *               - totalAmount
 *               - salesBy
 *     responses:
 *       200:
 *         description: Laundry record updated successfully
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laundry record not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:laundries"),
  laundryController.updateLaundry
);

/**
 * @swagger
 * /api/laundry/void/{id}:
 *   put:
 *     summary: Mark a laundry record as voided
 *     tags:
 *       - Laundry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the laundry record to void
 *     responses:
 *       200:
 *         description: Laundry record voided successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Laundry record not found
 *       500:
 *         description: Server error
 */
router.put(
  "/void/:id",
  authenticateUser,
  authorize("void:laundries"),
  laundryController.voidLaundry
);

/**
 * @swagger
 * /api/laundry/{laundryId}:
 *   patch:
 *     summary: Void a laundry record
 *     tags: [Laundry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: laundryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The laundry record id
 *     responses:
 *       '200':
 *         description: Laundry record voided successfully
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
 *                   example: Laundry record voided successfully
 *                 data:
 *                   $ref: '#/components/schemas/Laundry'
 *       '400':
 *         description: Bad request - laundry record is already voided
 *       '404':
 *         description: Laundry record not found
 *       '500':
 *         description: Internal server error
 */
router.patch(
  "/:laundryId",
  authenticateUser,
  authorize("void:laundries"),
  laundryController.voidLaundry
);

/**
 * @swagger
 * /api/laundry/summary:
 *   get:
 *     summary: Get comprehensive summary of laundry records
 *     description: Retrieve a detailed summary of laundry records including payment methods, statuses, and discounts for paid transactions. Can be filtered by date range.
 *     tags: [Laundry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering records (YYYY-MM-DD).
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering records (YYYY-MM-DD).
 *     responses:
 *       '200':
 *         description: Comprehensive laundry records summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                   description: Total sales amount for all paid transactions within the date range if specified
 *                 totalDiscountCount:
 *                   type: number
 *                   description: Number of transactions with a discount applied within the date range if specified
 *                 totalDiscountSum:
 *                   type: number
 *                   description: Sum of all discount amounts applied within the date range if specified
 *                 paymentMethods:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       method:
 *                         type: string
 *                         description: Name of the payment method
 *                       count:
 *                         type: number
 *                         description: Number of transactions using this method within the date range if specified
 *                       amount:
 *                         type: number
 *                         description: Total amount for transactions with this method within the date range if specified
 *                       discountCount:
 *                         type: number
 *                         description: Number of discounts applied for this method within the date range if specified
 *                       discountSum:
 *                         type: number
 *                         description: Sum of discounts for this method within the date range if specified
 *                 statusCounts:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       count:
 *                         type: number
 *                         description: Number of transactions with this status within the date range if specified
 *                       amount:
 *                         type: number
 *                         description: Total amount for transactions with this status within the date range if specified
 *       '404':
 *         description: No laundry records found for the specified criteria
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/summary",
  authenticateUser,
  authorize("read:laundries"),
  laundryController.getLaundryComprehensiveSummary
);

module.exports = router;
