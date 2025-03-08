const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrderController"); // Update the path if needed
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: PurchaseOrder
 *   description: API endpoints for managing purchase orders
 */

/**
 * @swagger
 * /api/purchaseorders:
 *   get:
 *     summary: Get all purchase orders
 *     tags: [PurchaseOrder]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:purchaseorders"),
  purchaseOrderController.getPurchaseOrders
);

/**
 * @swagger
 * /api/purchaseorders/{id}:
 *   put:
 *     summary: Update a purchase order
 *     tags: [PurchaseOrder]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the purchase order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseOrder'
 *     responses:
 *       200:
 *         description: Purchase order updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:purchaseorders"),
  purchaseOrderController.updatePurchaseOrder
);

/**
 * @swagger
 * /api/purchaseorders/{id}/void:
 *   put:
 *     summary: Void a purchase order
 *     tags: [PurchaseOrder]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the purchase order to void
 *     responses:
 *       200:
 *         description: Purchase order voided successfully
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id/void",
  authenticateUser,
  authorize("void:purchaseorders"),
  purchaseOrderController.voidPurchaseOrder
);

module.exports = router;
