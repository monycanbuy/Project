// const express = require("express");
// const router = express.Router();
// const seminarController = require("../controllers/seminarController");
// const { authenticateUser } = require("../middlewares/authMiddleware");

// /**
//  * @swagger
//  * tags:
//  *   name: Seminars
//  *   description: API for managing seminars
//  */

// /**
//  * @swagger
//  * /api/seminars:
//  *   post:
//  *     summary: Create a new seminar
//  *     tags: [Seminars]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               organizationName:
//  *                 type: string
//  *                 example: "TechCo"
//  *               contactPhone:
//  *                 type: string
//  *                 example: "123-456-7890"
//  *               seminarDate:
//  *                 type: string
//  *                 format: date-time
//  *                 example: "2023-12-01T10:00:00Z"
//  *               orderItems:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     itemName:
//  *                       type: string
//  *                       example: "Coffee"
//  *                     qty:
//  *                       type: number
//  *                       example: 10
//  *                     unitPrice:
//  *                       type: number
//  *                       example: 2.5
//  *               address:
//  *                 type: string
//  *                 example: "123 Seminar Street"
//  *               eventType:
//  *                 type: string
//  *                 enum: ['conference', 'workshop', 'webinar', 'Wedding']
//  *                 example: "conference"
//  *               paymentMethod:
//  *                 type: string
//  *                 format: uuid // Assuming MongoDB ObjectId is sent as a string
//  *                 example: "507f1f77bcf86cd799439011"
//  *               status:
//  *                 type: string
//  *                 enum: ['Pending', 'Paid', 'Cancelled', 'Refund']
//  *                 example: "Pending"
//  *               additionalNotes:
//  *                 type: string
//  *                 example: "Requires AV equipment"
//  *               discount:
//  *                 type: number
//  *                 example: 0
//  *               salesBy:
//  *                 type: string
//  *                 example: "John Doe"
//  *     responses:
//  *       '201':
//  *         description: Seminar created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Seminar created successfully"
//  *                 data:
//  *                   $ref: '#/components/schemas/Seminar'
//  *       '400':
//  *         description: Bad request - validation error
//  *       '500':
//  *         description: Internal server error
//  *
//  * components:
//  *   schemas:
//  *     Seminar:
//  *       type: object
//  *       properties:
//  *         organizationName:
//  *           type: string
//  *         contactPhone:
//  *           type: string
//  *         seminarDate:
//  *           type: string
//  *           format: date-time
//  *         orderItems:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/OrderItem'
//  *         address:
//  *           type: string
//  *         eventType:
//  *           type: string
//  *           enum: [conference, workshop, webinar, Wedding]
//  *         paymentMethod:
//  *           type: object
//  *           properties:
//  *             _id:
//  *               type: string
//  *               format: uuid
//  *             name:
//  *               type: string
//  *         status:
//  *           type: string
//  *           enum: [Pending, Paid, Cancelled, Refund]
//  *         additionalNotes:
//  *           type: string
//  *         discount:
//  *           type: number
//  *         salesBy:
//  *           type: string
//  *         totalAmount:
//  *           type: number
//  *         createdAt:
//  *           type: string
//  *           format: date-time
//  *         updatedAt:
//  *           type: string
//  *           format: date-time
//  *     OrderItem:
//  *       type: object
//  *       properties:
//  *         itemName:
//  *           type: string
//  *         qty:
//  *           type: number
//  *         unitPrice:
//  *           type: number
//  */
// router.post("/", authenticateUser, seminarController.createSeminar);

// /**
//  * @swagger
//  * /api/seminars:
//  *   get:
//  *     summary: Get all seminars
//  *     tags: [Seminars]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: List of all seminars
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 seminars:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/Seminar'
//  *       '500':
//  *         description: Internal server error
//  *
//  * components:
//  *   schemas:
//  *     Seminar:
//  *       type: object
//  *       properties:
//  *         organizationName:
//  *           type: string
//  *         contactPhone:
//  *           type: string
//  *         seminarDate:
//  *           type: string
//  *           format: date-time
//  *         orderItems:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/OrderItem'
//  *         totalAmount:
//  *           type: number
//  *           description: The total amount for the seminar
//  *         discount:
//  *           type: number
//  *           default: 0
//  *         salesBy:
//  *           type: string
//  *         address:
//  *           type: string
//  *         additionalNotes:
//  *           type: string
//  *         eventType:
//  *           type: string
//  *           enum: [conference, workshop, webinar, Wedding]
//  *           default: conference
//  *         paymentMethod:
//  *           type: string
//  *           enum: [Cash, Card, "Bank Transfer", Pos, Credit]
//  *         status:
//  *           type: string
//  *           enum: [Paid, Pending, Cancelled, Refund]
//  *           default: Pending
//  *         createdAt:
//  *           type: string
//  *           format: date-time
//  *         updatedAt:
//  *           type: string
//  *           format: date-time
//  *     OrderItem:
//  *       type: object
//  *       properties:
//  *         itemName:
//  *           type: string
//  *         qty:
//  *           type: number
//  *         unitPrice:
//  *           type: number
//  */
// router.get("/", authenticateUser, seminarController.getAllSeminars);

// /**
//  * @swagger
//  * /api/seminars/{id}:
//  *   get:
//  *     summary: Get a seminar by ID
//  *     tags: [Seminars]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The ID of the seminar to retrieve
//  *     responses:
//  *       '200':
//  *         description: Details of the seminar
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 seminar:
//  *                   $ref: '#/components/schemas/Seminar'
//  *       '404':
//  *         description: Seminar not found
//  *       '500':
//  *         description: Internal server error
//  */
// router.get("/:id", authenticateUser, seminarController.getSeminarById);

// /**
//  * @swagger
//  * /api/seminars/{id}:
//  *   put:
//  *     summary: Update a seminar
//  *     tags: [Seminars]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The ID of the seminar to update
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/SeminarUpdate'
//  *     responses:
//  *       '200':
//  *         description: Seminar updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Seminar updated successfully"
//  *                 data:
//  *                   $ref: '#/components/schemas/Seminar'
//  *       '400':
//  *         description: Bad request - validation error
//  *       '404':
//  *         description: Seminar not found
//  *       '500':
//  *         description: Internal server error
//  *
//  * components:
//  *   schemas:
//  *     SeminarUpdate:
//  *       type: object
//  *       properties:
//  *         organizationName:
//  *           type: string
//  *         contactPhone:
//  *           type: string
//  *         seminarDate:
//  *           type: string
//  *           format: date-time
//  *         orderItems:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/OrderItem'
//  *         address:
//  *           type: string
//  *         eventType:
//  *           type: string
//  *           enum: [conference, workshop, webinar, Wedding]
//  *         paymentMethod:
//  *           type: string
//  *           format: uuid
//  *         status:
//  *           type: string
//  *           enum: [Pending, Paid, Cancelled, Refund]
//  *         additionalNotes:
//  *           type: string
//  *         discount:
//  *           type: number
//  *         salesBy:
//  *           type: string
//  *         totalAmount:
//  *           type: number
//  *     OrderItem:
//  *       type: object
//  *       properties:
//  *         itemName:
//  *           type: string
//  *         qty:
//  *           type: number
//  *         unitPrice:
//  *           type: number
//  */
// router.put("/:id", authenticateUser, seminarController.updateSeminar);

// /**
//  * @swagger
//  * /api/seminars/{id}/void:
//  *   put:
//  *     summary: Void (cancel) a seminar
//  *     tags: [Seminars]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The ID of the seminar to void
//  *     responses:
//  *       '200':
//  *         description: Seminar voided successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: Seminar has been voided
//  *                 seminar:
//  *                   $ref: '#/components/schemas/Seminar'
//  *       '400':
//  *         description: Seminar already voided
//  *       '404':
//  *         description: Seminar not found
//  *       '500':
//  *         description: Internal server error
//  */
// router.put("/:id/void", authenticateUser, seminarController.voidSeminar);
// module.exports = router;

const express = require("express");
const router = express.Router();
const seminarController = require("../controllers/seminarController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Seminars
 *   description: API for managing seminars
 */

/**
 * @swagger
 * /api/seminars:
 *   post:
 *     summary: Create a new seminar
 *     tags: [Seminars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizationName:
 *                 type: string
 *                 example: "TechCo"
 *               contactPhone:
 *                 type: string
 *                 example: "123-456-7890"
 *               seminarDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-01T10:00:00Z"
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemName:
 *                       type: string
 *                       example: "Coffee"
 *                     qty:
 *                       type: number
 *                       example: 10
 *                     unitPrice:
 *                       type: number
 *                       example: 2.5
 *               address:
 *                 type: string
 *                 example: "123 Seminar Street"
 *               eventType:
 *                 type: string
 *                 enum: ['conference', 'workshop', 'webinar', 'Wedding']
 *                 example: "conference"
 *               paymentMethod:
 *                 type: string
 *                 format: uuid // Assuming MongoDB ObjectId is sent as a string
 *                 example: "507f1f77bcf86cd799439011"
 *               status:
 *                 type: string
 *                 enum: ['Pending', 'Paid', 'Cancelled', 'Refund']
 *                 example: "Pending"
 *               additionalNotes:
 *                 type: string
 *                 example: "Requires AV equipment"
 *               discount:
 *                 type: number
 *                 example: 0
 *               salesBy:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       '201':
 *         description: Seminar created successfully
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
 *                   example: "Seminar created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Seminar'
 *       '400':
 *         description: Bad request - validation error
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Seminar:
 *       type: object
 *       properties:
 *         organizationName:
 *           type: string
 *         contactPhone:
 *           type: string
 *         seminarDate:
 *           type: string
 *           format: date-time
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         address:
 *           type: string
 *         eventType:
 *           type: string
 *           enum: [conference, workshop, webinar, Wedding]
 *         paymentMethod:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *         status:
 *           type: string
 *           enum: [Pending, Paid, Cancelled, Refund]
 *         additionalNotes:
 *           type: string
 *         discount:
 *           type: number
 *         salesBy:
 *           type: string
 *         totalAmount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderItem:
 *       type: object
 *       properties:
 *         itemName:
 *           type: string
 *         qty:
 *           type: number
 *         unitPrice:
 *           type: number
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:seminars"),
  seminarController.createSeminar
);

/**
 * @swagger
 * /api/seminars/summary:
 *   get:
 *     summary: Get comprehensive sales summary for Seminars
 *     description: Retrieve a detailed summary of seminar sales including payment methods, statuses, discounts, and event types. Can be filtered by date range.
 *     tags: [Seminars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering sales (YYYY-MM-DD).
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering sales (YYYY-MM-DD).
 *     responses:
 *       '200':
 *         description: Comprehensive seminar sales summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                   description: Total sales amount for all transactions within the date range if specified
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
 *                 eventTypeCounts:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       count:
 *                         type: number
 *                         description: Number of events of this type within the date range if specified
 *                       amount:
 *                         type: number
 *                         description: Total amount for events of this type within the date range if specified
 *       '404':
 *         description: No seminar sales found for the specified criteria
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/summary",
  authenticateUser,
  authorize("read:seminars"),
  seminarController.getSeminarComprehensiveSummary
);

/**
 * @swagger
 * /api/seminars:
 *   get:
 *     summary: Get all seminars
 *     tags: [Seminars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of all seminars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 seminars:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Seminar'
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Seminar:
 *       type: object
 *       properties:
 *         organizationName:
 *           type: string
 *         contactPhone:
 *           type: string
 *         seminarDate:
 *           type: string
 *           format: date-time
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalAmount:
 *           type: number
 *           description: The total amount for the seminar
 *         discount:
 *           type: number
 *           default: 0
 *         salesBy:
 *           type: string
 *         address:
 *           type: string
 *         additionalNotes:
 *           type: string
 *         eventType:
 *           type: string
 *           enum: [conference, workshop, webinar, Wedding]
 *           default: conference
 *         paymentMethod:
 *           type: string
 *           enum: [Cash, Card, "Bank Transfer", Pos, Credit]
 *         status:
 *           type: string
 *           enum: [Paid, Pending, Cancelled, Refund]
 *           default: Pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderItem:
 *       type: object
 *       properties:
 *         itemName:
 *           type: string
 *         qty:
 *           type: number
 *         unitPrice:
 *           type: number
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:seminars"),
  seminarController.getAllSeminars
);

/**
 * @swagger
 * /api/seminars/daily-sales:
 *   get:
 *     summary: Get daily sales data for seminars
 *     description: Retrieve total sales and sales by event type. Defaults to the current day if no date range is provided.  Allows filtering by a specific date range.
 *     tags: [Seminars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the sales data (YYYY-MM-DD).  If not provided, defaults to the current day.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the sales data (YYYY-MM-DD). If not provided, defaults to the current day.
 *     responses:
 *       '200':
 *         description: Sales data retrieved successfully
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
 *                       description: Total sales for the specified period (or today if no dates are provided).
 *                     eventSales:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *                       description: Total sales for each event type. Keys are event types (e.g., "conference", "workshop"), values are the total sales amounts.
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/daily-sales",
  authenticateUser,
  authorize("read:seminars"),
  seminarController.getSalesData
);

/**
 * @swagger
 * /api/seminars/all-time-sales:
 *   get:
 *     summary: Get total sales of all time for seminars
 *     description: Retrieve the cumulative total sales across all seminars, excluding voided, cancelled, or refunded ones.
 *     tags: [Seminars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Total sales retrieved successfully
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
 *                       description: The total sales amount for all valid seminars
 *                       example: 123456
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/all-time-sales",
  authenticateUser,
  authorize("read:seminars"),
  seminarController.getAllTimeSales
);

/**
 * @swagger
 * /api/seminars/daily-sales-all-days:
 *   get:
 *     summary: Get total daily sales for all days
 *     description: Retrieve total sales for each day across all seminars, excluding voided, cancelled, or refunded transactions.
 *     tags: [Seminars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily sales data retrieved successfully
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
 *                         example: "2025-02-15"
 *                       totalSales:
 *                         type: number
 *                         description: Total sales amount for that day
 *                         example: 1234
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/daily-sales-all-days",
  authenticateUser,
  authorize("read:seminars"),
  seminarController.getDailySalesAllDays
);

/**
 * @swagger
 * /api/seminars/payment-method-totals-today:
 *   get:
 *     summary: Get payment method totals for the current day
 *     description: Retrieve the total amount for each payment method for seminars created today, excluding voided, cancelled, or refunded transactions.
 *     tags: [Seminars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Payment method totals retrieved successfully
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
  "/payment-method-totals-today",
  authenticateUser,
  authorize("read:seminars"),
  seminarController.getPaymentMethodTotalsForDay
);

/**
 * @swagger
 * /api/seminars/{id}:
 *   get:
 *     summary: Get a seminar by ID
 *     tags: [Seminars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seminar to retrieve
 *     responses:
 *       '200':
 *         description: Details of the seminar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 seminar:
 *                   $ref: '#/components/schemas/Seminar'
 *       '404':
 *         description: Seminar not found
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/:id",
  authenticateUser,
  authorize("read:seminars"),
  seminarController.getSeminarById
);

/**
 * @swagger
 * /api/seminars/{id}:
 *   put:
 *     summary: Update a seminar
 *     tags: [Seminars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seminar to update
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeminarUpdate'
 *     responses:
 *       '200':
 *         description: Seminar updated successfully
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
 *                   example: "Seminar updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Seminar'
 *       '400':
 *         description: Bad request - validation error
 *       '404':
 *         description: Seminar not found
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     SeminarUpdate:
 *       type: object
 *       properties:
 *         organizationName:
 *           type: string
 *         contactPhone:
 *           type: string
 *         seminarDate:
 *           type: string
 *           format: date-time
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         address:
 *           type: string
 *         eventType:
 *           type: string
 *           enum: [conference, workshop, webinar, Wedding]
 *         paymentMethod:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [Pending, Paid, Cancelled, Refund]
 *         additionalNotes:
 *           type: string
 *         discount:
 *           type: number
 *         salesBy:
 *           type: string
 *         totalAmount:
 *           type: number
 *     OrderItem:
 *       type: object
 *       properties:
 *         itemName:
 *           type: string
 *         qty:
 *           type: number
 *         unitPrice:
 *           type: number
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:seminars"),
  seminarController.updateSeminar
);

/**
 * @swagger
 * /api/seminars/{id}/void:
 *   patch:
 *     summary: Void an existing seminar
 *     description: Mark an existing seminar as voided.
 *     tags:
 *       - Seminars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the seminar to void (MongoDB ObjectId)
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^[0-9a-fA-F]{24}$  # Matches 24-character MongoDB ObjectId
 *           example: "67bdf24613722afb566d3bbd"  # Example updated to ObjectId
 *     responses:
 *       '200':
 *         description: Seminar voided successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seminar'
 *       '400':
 *         description: Seminar is already voided or invalid ID
 *       '404':
 *         description: Seminar not found
 *       '500':
 *         description: Internal server error
 */
router.patch(
  "/:id/void",
  authenticateUser,
  authorize("void:seminars"),
  seminarController.voidSeminar
);

module.exports = router;
