// routers/unifiedSaleRouter.js
const express = require("express");
const router = express.Router();
const unifiedSaleController = require("../controllers/unifiedSaleController");
const { authenticateUser } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Unified Sales
 *   description: API endpoints for managing unified sales
 */

/**
 * @swagger
 * /api/unified-sales:
 *   get:
 *     summary: Retrieve all unified sales
 *     description: Fetches all unified sales records from the database.
 *     tags: [Unified Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of sales
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
 *                     $ref: '#/components/schemas/UnifiedSale'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get("/", authenticateUser, unifiedSaleController.getUnifiedSales);

/**
 * @swagger
 * /api/unified-sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Unified Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saleType:
 *                 type: string
 *                 enum: ['restaurant', 'minimart']
 *                 example: "restaurant"
 *               paymentMethod:
 *                 type: string
 *                 format: uuid
 *                 example: "6458cf6c8b9bff1e4a77a5b7"
 *               totalAmount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       '201':
 *         description: Sale created successfully
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
 *                   example: Sale created successfully
 *                 sale:
 *                   $ref: '#/components/schemas/UnifiedSale'
 *       '400':
 *         description: Bad request - validation error
 *       '500':
 *         description: Internal server error
 */
router.post("/", authenticateUser, unifiedSaleController.createSale);

/**
 * @swagger
 * /api/unified-sales/{saleId}/items:
 *   post:
 *     summary: Add an item to an existing sale
 *     tags: [Unified Sales]
 *     parameters:
 *       - in: path
 *         name: saleId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sale ID to which the item will be added
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *                 format: uuid
 *                 example: "6458cf6c8b9bff1e4a77a5b7"
 *               quantity:
 *                 type: number
 *                 example: 2
 *               itemType:
 *                 type: string
 *                 enum: ['Dish', 'Product']
 *                 example: "Dish"
 *     responses:
 *       '201':
 *         description: Item added to sale successfully
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
 *                   example: Item added to sale successfully
 *                 saleItem:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     priceAtSale:
 *                       type: number
 *                     subTotal:
 *                       type: number
 *                     itemType:
 *                       type: string
 *       '400':
 *         description: Bad request - validation error or item not found
 *       '404':
 *         description: Sale not found
 *       '500':
 *         description: Internal server error
 */
router.post(
  "/:saleId/items",
  authenticateUser,
  unifiedSaleController.addSaleItem
);

/**
 * @swagger
 * /api/unified-sales/{saleId}:
 *   put:
 *     summary: Update an existing sale
 *     tags: [Unified Sales]
 *     parameters:
 *       - in: path
 *         name: saleId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sale ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saleType:
 *                 type: string
 *                 enum: ['restaurant', 'minimart']
 *                 example: "restaurant"
 *               paymentMethod:
 *                 type: string
 *                 format: uuid
 *                 example: "6458cf6c8b9bff1e4a77a5b7"
 *               totalAmount:
 *                 type: number
 *                 example: 50
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: string
 *                       format: uuid
 *                       example: "6458cf6c8b9bff1e4a77a5b7"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     priceAtSale:
 *                       type: number
 *                       example: 10.50
 *                     itemType:
 *                       type: string
 *                       enum: ['Dish', 'Product']
 *                       example: "Dish"
 *     responses:
 *       '200':
 *         description: Sale updated successfully
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
 *                   example: Sale updated successfully
 *                 sale:
 *                   $ref: '#/components/schemas/UnifiedSale'
 *       '400':
 *         description: Bad request - validation error
 *       '404':
 *         description: Sale not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:saleId", authenticateUser, unifiedSaleController.updateSale);

module.exports = router;
