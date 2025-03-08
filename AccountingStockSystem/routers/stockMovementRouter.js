const express = require("express");
const router = express.Router();
const stockMovementController = require("../controllers/stockMovementController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: StockMovement
 *   description: API endpoints for managing stock movements
 */

/**
 * @swagger
 * /api/stockmovements:
 *   get:
 *     summary: Get all stock movements
 *     tags: [StockMovement]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:stockMovement"),
  stockMovementController.getStockMovements
);

/**
 * @swagger
 * /api/stockmovements:
 *   post:
 *     summary: Create a new stock movement
 *     tags: [StockMovement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovement'
 *     responses:
 *       201:
 *         description: Stock movement created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("post:stockMovement"),
  stockMovementController.createStockMovement
);

/**
 * @swagger
 * /api/stockmovements/{id}:
 *   put:
 *     summary: Update a stock movement
 *     tags: [StockMovement]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the stock movement to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovement'
 *     responses:
 *       200:
 *         description: Stock movement updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Stock movement not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:stockMovement"),
  stockMovementController.updateStockMovement
);

/**
 * @swagger
 * /api/stockmovements/{id}:
 *   delete:
 *     summary: Delete a stock movement
 *     tags: [StockMovement]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the stock movement to delete
 *     responses:
 *       200:
 *         description: Stock movement deleted successfully
 *       404:
 *         description: Stock movement not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:stockMovement"),
  stockMovementController.deleteStockMovement
);

module.exports = router;
