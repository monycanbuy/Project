// routes/anotherUnifiedSaleRoutes.js
const express = require("express");
const router = express.Router();
const anotherUnifiedSaleController = require("../controllers/anotherUnifiedSaleController");
const { authenticateUser } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Another Unified Sales
 *   description: API endpoints for managing another unified sales
 */

/**
 * @swagger
 * /api/anotherunifiedsales:
 *   get:
 *     summary: Get all another unified sales
 *     tags: [Another Unified Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of another unified sales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AnotherUnifiedSale'
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  anotherUnifiedSaleController.getAnotherUnifiedSales
);

/**
 * @swagger
 * /api/anotherunifiedsales:
 *   post:
 *     summary: Create a new another unified sale
 *     tags: [Another Unified Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnotherUnifiedSaleInput'
 *     responses:
 *       '201':
 *         description: Another unified sale created successfully
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
 *                   example: Another unified sale created successfully
 *                 sale:
 *                   $ref: '#/components/schemas/AnotherUnifiedSale'
 *       '400':
 *         description: Bad request - validation error
 *       '500':
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateUser,
  anotherUnifiedSaleController.createAnotherUnifiedSale
);

/**
 * @swagger
 * /api/anotherunifiedsales/summary:
 *   get:
 *     summary: Get comprehensive summary of another unified sales
 *     tags: [Another Unified Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for sales summary (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for sales summary (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: Sales summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/SalesSummary'
 *                 - type: object
 *                   properties:
 *                     noDataForRange:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "No sales found for the criteria"
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/summary",
  authenticateUser,
  anotherUnifiedSaleController.anotherUnifiedSalesSummary
);

/**
 * @swagger
 * /api/anotherunifiedsales/{saleId}:
 *   put:
 *     summary: Update an existing another unified sale
 *     tags: [Another Unified Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saleId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sale id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAnotherUnifiedSale'
 *     responses:
 *       '200':
 *         description: Another unified sale updated successfully
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
 *                   example: Another unified sale updated successfully
 *                 sale:
 *                   $ref: '#/components/schemas/AnotherUnifiedSale'
 *       '400':
 *         description: Bad request - validation error
 *       '404':
 *         description: Another unified sale not found
 *       '500':
 *         description: Internal server error
 */
router.put(
  "/:saleId",
  authenticateUser,
  anotherUnifiedSaleController.updateSale
);

/**
 * @swagger
 * /api/anotherunifiedsales/{saleId}:
 *   patch:
 *     summary: Void a another unified sale
 *     tags: [Another Unified Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saleId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sale id
 *     responses:
 *       '200':
 *         description: Another unified sale voided successfully
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
 *                   example: Another unified sale voided successfully
 *                 sale:
 *                   $ref: '#/components/schemas/AnotherUnifiedSale'
 *       '400':
 *         description: Bad request - sale is already voided
 *       '404':
 *         description: Another unified sale not found
 *       '500':
 *         description: Internal server error
 */
router.patch(
  "/:saleId",
  authenticateUser,
  anotherUnifiedSaleController.voidSale
);

module.exports = router;
