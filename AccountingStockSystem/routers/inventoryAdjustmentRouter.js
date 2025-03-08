const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const inventoryAdjustmentController = require("../controllers/inventoryAdjustmentController");

/**
 * @swagger
 * tags:
 *   name: InventoryAdjustment
 *   description: API endpoints for managing inventory adjustments, affecting stock levels in Inventory
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryAdjustment:
 *       type: object
 *       required:
 *         - product
 *         - type
 *         - adjustmentReason
 *         - changeInQuantity
 *         - previousQuantity
 *         - newQuantity
 *         - staff
 *       properties:
 *         product:
 *           type: string
 *           description: ID of the inventory item being adjusted
 *           example: "67af7943493301b30780e9c3"
 *         type:
 *           type: string
 *           enum: ["Issue", "Return", "Adjustment"]
 *           description: Type of adjustment
 *           example: "Adjustment"
 *         adjustmentReason:
 *           type: string
 *           enum: ["Damage", "Theft", "Expiry", "Error", "Other"]
 *           description: Reason for the adjustment
 *           example: "Damage"
 *         changeInQuantity:
 *           type: integer
 *           description: Quantity change (positive for addition, negative for removal)
 *           example: -5
 *         previousQuantity:
 *           type: integer
 *           description: Stock quantity before adjustment
 *           example: 100
 *         newQuantity:
 *           type: integer
 *           description: Stock quantity after adjustment
 *           example: 95
 *         adjustmentCost:
 *           type: number
 *           description: Cost impact of the adjustment (calculated as changeInQuantity * costPrice)
 *           example: -500
 *         reason:
 *           type: string
 *           description: Optional free-text explanation
 *           example: "Item damaged during transport"
 *         staff:
 *           type: string
 *           description: ID of the staff member making the adjustment
 *           example: "67ab708e11b1cc259cc36b3c"
 *         status:
 *           type: string
 *           enum: ["Pending", "Received", "Cancelled"]
 *           default: "Pending"
 *           description: Status of the adjustment (affects stock when "Received")
 *           example: "Pending"
 *         approvedBy:
 *           type: string
 *           description: ID of the staff approving the adjustment (set when "Received")
 *           example: null
 *         referenceId:
 *           type: string
 *           description: ID of a related transaction (e.g., SaleTransaction)
 *           example: "67af7943493301b30780e9c4"
 *         referenceType:
 *           type: string
 *           enum: ["SaleTransaction", "Laundry", "HallTransaction", "FrontOfficeSale", "Seminar", null]
 *           description: Type of the referenced transaction
 *           example: "SaleTransaction"
 *         batchNumber:
 *           type: string
 *           description: Batch identifier for perishable items
 *           example: "LOT123"
 *         adjustmentLocation:
 *           type: string
 *           description: ID of the location where adjustment occurred
 *           example: "67ab708e11b1cc259cc36b3c"
 *         transactionDate:
 *           type: string
 *           format: date-time
 *           description: Date of the adjustment
 *           example: "2023-10-25T14:30:00Z"
 */

/**
 * @swagger
 * /api/inventoryadjustments:
 *   get:
 *     summary: Retrieve all inventory adjustments
 *     tags: [InventoryAdjustment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all inventory adjustments with populated product and staff details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryAdjustment'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Error fetching inventory adjustments" }
 *                 error: { type: string }
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:inventoryAdjustment"),
  inventoryAdjustmentController.getInventoryAdjustments
);

/**
 * @swagger
 * /api/inventoryadjustments/daily-profit-loss:
 *   get:
 *     summary: Retrieve daily profit and loss report for the current day
 *     tags: [InventoryAdjustment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily profit and loss report fetched successfully
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
 *                       example: "2025-03-06"
 *                     revenue:
 *                       type: number
 *                       example: 15000
 *                     cogs:
 *                       type: number
 *                       example: 9000
 *                     inventoryLosses:
 *                       type: number
 *                       example: 500
 *                     profit:
 *                       type: number
 *                       example: 5500
 *                 message:
 *                   type: string
 *                   example: "Daily profit and loss report fetched successfully"
 *       500:
 *         description: Internal server error
 */
router.get(
  "/daily-profit-loss",
  authenticateUser,
  authorize("read:dashboard"), // Adjusted permission to align with dashboard access
  inventoryAdjustmentController.getDailyProfitAndLoss
);

/**
 * @swagger
 * /api/inventoryadjustments:
 *   post:
 *     summary: Create a new inventory adjustment
 *     tags: [InventoryAdjustment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryAdjustment'
 *     responses:
 *       201:
 *         description: Inventory adjustment created successfully, updates Inventory stock if status is "Received"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Inventory adjustment created successfully" }
 *                 data: { $ref: '#/components/schemas/InventoryAdjustment' }
 *       400:
 *         description: Validation error or stock mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Validation error" }
 *                 errors: { type: array, items: { type: string } }
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:inventoryAdjustment"),
  inventoryAdjustmentController.createInventoryAdjustment
);

/**
 * @swagger
 * /api/inventoryadjustments/{id}:
 *   put:
 *     summary: Update an existing inventory adjustment
 *     tags: [InventoryAdjustment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the inventory adjustment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryAdjustment'
 *     responses:
 *       200:
 *         description: Inventory adjustment updated successfully, adjusts Inventory stock based on status changes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Inventory adjustment updated successfully" }
 *                 data: { $ref: '#/components/schemas/InventoryAdjustment' }
 *       400:
 *         description: Validation error or quantity mismatch
 *       404:
 *         description: Inventory adjustment or item not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:inventoryAdjustment"),
  inventoryAdjustmentController.updateInventoryAdjustment
);

/**
 * @swagger
 * /api/inventoryadjustments/{id}:
 *   delete:
 *     summary: Delete an inventory adjustment
 *     tags: [InventoryAdjustment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the inventory adjustment to delete
 *     responses:
 *       200:
 *         description: Inventory adjustment deleted successfully, reverts Inventory stock if status was "Received"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Inventory adjustment deleted successfully" }
 *                 data: { $ref: '#/components/schemas/InventoryAdjustment' }
 *       404:
 *         description: Inventory adjustment or item not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:inventoryAdjustment"),
  inventoryAdjustmentController.deleteInventoryAdjustment
);

module.exports = router;
