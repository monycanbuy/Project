const express = require("express");
const router = express.Router();
const kabasaController = require("../controllers/kabasaController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: Kabasa
 *   description: API for managing Kabasa sales transactions
 */

/**
 * @swagger
 * /api/kabasa:
 *   post:
 *     summary: Create a new Kabasa sale
 *     description: Create a new Kabasa sale and store it in the database.
 *     tags:
 *       - Kabasa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               discount:
 *                 type: number
 *                 format: float
 *                 example: 10.5
 *               status:
 *                 type: string
 *                 enum: ["Paid", "Pending", "Cancelled", "Refund"]
 *                 example: "Pending"
 *               paymentMethod:
 *                 type: string
 *                 format: uuid
 *                 example: "507f1f77bcf86cd799439011"
 *               additionalNotes:
 *                 type: string
 *                 example: "Special delivery instructions"
 *               salesBy:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the user creating the sale
 *                 example: "507f1f77bcf86cd799439012"
 *             required:
 *               - orderItems
 *               - paymentMethod
 *               - salesBy  # Adding salesBy as required since it's needed for creation
 *     responses:
 *       '201':
 *         description: Kabasa sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Kabasa'
 *       '400':
 *         description: Invalid input or missing fields
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         item:
 *           type: string
 *           format: uuid
 *           description: The ID of the OrderItem
 *           example: "6783aa6f95ff773d4c25e5f9"
 *         qty:
 *           type: number
 *           description: Quantity of the item
 *           example: 2
 *         unitPrice:
 *           type: number
 *           description: Price per unit of the item
 *           example: 8
 *         itemName:
 *           type: string
 *           description: Name of the item
 *           example: "Sandwichs"
 *     Kabasa:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         discount:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: ["Paid", "Pending", "Cancelled", "Refund"]
 *         paymentMethod:
 *           type: string
 *           format: uuid
 *         additionalNotes:
 *           type: string
 *         salesBy:
 *           type: string
 *           format: uuid
 *         totalAmount:
 *           type: number
 *           format: float
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
router.post(
  "/",
  authorize("write:kabsa"),
  authenticateUser,
  kabasaController.createKabasa
);

/**
 * @swagger
 * /api/kabasa/summary:
 *   get:
 *     summary: Get comprehensive sales summary for Kabasa
 *     description: Retrieve a detailed summary of Kabasa sales including payment methods, statuses, and discounts for paid transactions. Can be filtered by date range.
 *     tags: [Kabasa]
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
 *         description: Comprehensive Kabasa sales summary
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
 *         description: No Kabasa sales found for the specified criteria
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/summary",
  authenticateUser,
  authorize("read:kabsa"),
  kabasaController.getKabasaComprehensiveSummary
);

/**
 * @swagger
 * /api/kabasa/daily-sales-summary:
 *   get:
 *     summary: Get daily sales summary for Kabasa
 *     description: Retrieve the total sales and accumulated sales per payment method for Kabasa transactions created today, excluding voided, cancelled, or refunded records.
 *     tags: [Kabasa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Daily sales summary retrieved successfully
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
 *                       description: Total sales amount for valid transactions today
 *                       example: 65
 *                     cash:
 *                       type: number
 *                       description: Total sales amount using cash today
 *                       example: 20
 *                     pos:
 *                       type: number
 *                       description: Total sales amount using POS today
 *                       example: 45
 *                     transfer:
 *                       type: number
 *                       description: Total sales amount using bank transfer today
 *                       example: 0
 *                     signing credit:
 *                       type: number
 *                       description: Total sales amount using signing credit today
 *                       example: 0
 *                     credit:
 *                       type: number
 *                       description: Total sales amount using credit today
 *                       example: 0
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/daily-sales-summary",
  authenticateUser,
  authorize("read:kabsa"),
  kabasaController.getKabasaDailySalesSummary
);

/**
 * @swagger
 * /api/kabasa/all-time-sales:
 *   get:
 *     summary: Get total accumulated sales of all time for Kabasa
 *     description: Retrieve the total accumulated sales across all Kabasa transactions, excluding voided, cancelled, or refunded records.
 *     tags: [Kabasa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: All-time sales retrieved successfully
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
 *                       description: Total accumulated sales amount for all valid transactions
 *                       example: 165
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/all-time-sales",
  authenticateUser,
  authorize("read:kabsa"),
  kabasaController.getKabasaAllTimeSales
);

/**
 * @swagger
 * /api/kabasa/daily-sales-all-days:
 *   get:
 *     summary: Get daily sales for all days for Kabasa
 *     description: Retrieve the total sales for each day across all Kabasa transactions, excluding voided, cancelled, or refunded records.
 *     tags: [Kabasa]
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
 *                         example: "2025-02-16"
 *                       totalSales:
 *                         type: number
 *                         description: Total sales amount for that day
 *                         example: 50
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/daily-sales-all-days",
  authenticateUser,
  authorize("read:kabsa"),
  kabasaController.getDailySalesAllDays
);

/**
 * @swagger
 * /api/kabasa/top-selling-items:
 *   get:
 *     summary: Get top 5 selling items in Kabasa
 *     description: Retrieve the top 5 selling items based on total quantity sold across all Kabasa transactions, excluding voided, cancelled, or refunded records.
 *     tags: [Kabasa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Top selling items retrieved successfully
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
 *                       itemName:
 *                         type: string
 *                         description: Name of the item
 *                         example: "Item A"
 *                       totalQty:
 *                         type: number
 *                         description: Total quantity sold
 *                         example: 150
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/top-selling-items",
  authenticateUser,
  authorize("read:kabsa"),
  kabasaController.getTopSellingItems
);

/**
 * @swagger
 * /api/kabasa/{id}:
 *   put:
 *     summary: Update an existing Kabasa sale
 *     description: Update an existing Kabasa sale and its details.
 *     tags:
 *       - Kabasa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the Kabasa sale to update
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               discount:
 *                 type: number
 *                 format: float
 *                 example: 10.5
 *               status:
 *                 type: string
 *                 enum: ["Paid", "Pending", "Cancelled", "Refund"]
 *                 example: "Paid"
 *               paymentMethod:
 *                 type: string
 *                 format: uuid
 *                 example: "507f1f77bcf86cd799439011"
 *               additionalNotes:
 *                 type: string
 *                 example: "Updated delivery instructions"
 *               isVoided:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - orderItems # Assuming orderItems is always required for an update
 *     responses:
 *       '200':
 *         description: Kabasa sale updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Kabasa'
 *       '400':
 *         description: Invalid input or missing fields
 *       '404':
 *         description: Kabasa sale not found
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         item:
 *           type: string
 *           format: uuid
 *           description: The ID of the OrderItem
 *           example: "6783aa6f95ff773d4c25e5f9"
 *         qty:
 *           type: number
 *           description: Quantity of the item
 *           example: 2
 *         unitPrice:
 *           type: number
 *           description: Price per unit of the item
 *           example: 8
 *         itemName:
 *           type: string
 *           description: Name of the item
 *           example: "Sandwichs"
 *     Kabasa:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *         orderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         discount:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: ["Paid", "Pending", "Cancelled", "Refund"]
 *         paymentMethod:
 *           type: string
 *           format: uuid
 *         additionalNotes:
 *           type: string
 *         salesBy:
 *           type: string
 *           format: uuid
 *         totalAmount:
 *           type: number
 *           format: float
 *         isVoided:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
router.put(
  "/:id",
  authorize("update:kabsa"),
  authenticateUser,
  kabasaController.updateKabasa
);

/**
 * @swagger
 *  /api/kabasa:
 *    get:
 *      summary: Get all Kabasa sales records
 *      description: Retrieve all Kabasa sales transactions from the database, including populated details.
 *      tags: [Kabasa]
 *      responses:
 *        200:
 *          description: List of all Kabasa sales with populated data
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/KabasaWithPopulatedFields'
 *        404:
 *          description: No Kabasa sales found
 *        500:
 *          description: Internal server error
 */
router.get(
  "/",
  authorize("read:kabsa"),
  authenticateUser,
  kabasaController.getAllKabasa
);

/**
 * @swagger
 *  /api/kabasa/{id}:
 *    get:
 *      summary: Get a Kabasa sale by its ID
 *      description: Retrieve a specific Kabasa sale by its ID.
 *      tags: [Kabasa]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID of the Kabasa sale to retrieve
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Kabasa sale details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Kabasa'
 *        404:
 *          description: Kabasa sale not found
 *        500:
 *          description: Internal server error
 */
router.get(
  "/:id",
  authenticateUser,
  authorize("read:kabsa"),
  kabasaController.getKabasaById
);

/**
 * @swagger
 *  /api/kabasa/{id}/cancel:
 *    put:
 *      summary: Cancel a Kabasa sale
 *      description: Mark a Kabasa sale as cancelled.
 *      tags: [Kabasa]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID of the Kabasa sale to cancel
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Kabasa sale cancelled successfully
 *        404:
 *          description: Kabasa sale not found
 *        500:
 *          description: Internal server error
 */
router.put(
  "/:id/cancel",
  authenticateUser,
  authorize("update:kabsa"),
  kabasaController.cancelKabasa
);

/**
 * @swagger
 * /api/kabasa/{kabasaId}:
 *   patch:
 *     summary: Void an existing Kabasa sale
 *     description: Mark an existing Kabasa sale as voided.
 *     tags:
 *       - Kabasa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: kabasaId
 *         in: path
 *         description: ID of the Kabasa sale to void
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       '200':
 *         description: Kabasa sale voided successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Kabasa'
 *       '400':
 *         description: Kabasa sale is already voided
 *       '404':
 *         description: Kabasa sale not found
 *       '500':
 *         description: Internal server error
 */
router.patch(
  "/:kabasaId",
  authorize("void:kabsa"),
  authenticateUser,
  kabasaController.voidKabasa
);

module.exports = router;
