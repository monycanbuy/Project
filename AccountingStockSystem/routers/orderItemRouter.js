const express = require("express");
const router = express.Router();
const orderItemController = require("../controllers/orderItemController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: API endpoints for managing order items
 */

/**
 * @swagger
 * /api/order-items:
 *   get:
 *     summary: Retrieve all order items
 *     tags: [Order Items]
 *     responses:
 *       '200':
 *         description: Successful response
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
 *                     $ref: '#/components/schemas/OrderItem'
 *       '404':
 *         description: No order items found
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
 *                   example: 'No order items found.'
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:orderitems"),
  orderItemController.getAllOrderItems
);

/**
 * @swagger
 * /api/order-items:
 *   post:
 *     summary: Create new order items
 *     tags:
 *       - Order Items
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
 *                   type: object
 *                   properties:
 *                     itemName:
 *                       type: string
 *                       description: The name of the item to be ordered
 *                     unitPrice:
 *                       type: number
 *                       description: The price of one unit of the item
 *                   required:
 *                     - itemName
 *                     - unitPrice
 *             required:
 *               - orderItems
 *     responses:
 *       201:
 *         description: Order items created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       itemName:
 *                         type: string
 *                       unitPrice:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad Request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
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
router.post(
  "/",
  authenticateUser,
  authorize("write:orderitems"),
  orderItemController.createOrderItem
);

/**
 * @swagger
 * /api/order-items/{orderItemId}:
 *   put:
 *     summary: Update an order item
 *     tags:
 *       - Order Items
 *     parameters:
 *       - in: path
 *         name: orderItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               # Define the updatable fields for the order item
 *               # Example:
 *               # itemName:
 *               #   type: string
 *               # qty:
 *               #   type: integer
 *               # unitPrice:
 *               #   type: number
 *               # totalAmount:
 *               #   type: number
 *     responses:
 *       200:
 *         description: Order item updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:orderItemId",
  authenticateUser,
  authorize("update:orderitems"),
  orderItemController.updateOrderItem
);

/**
 * @swagger
 * /api/order-items/{orderItemId}:
 *   delete:
 *     summary: Delete an order item
 *     tags:
 *       - Order Items
 *     parameters:
 *       - in: path
 *         name: orderItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order item to delete
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:orderItemId",
  authenticateUser,
  authorize("delete:orderitems"),
  orderItemController.deleteOrderItem
);

module.exports = router;
