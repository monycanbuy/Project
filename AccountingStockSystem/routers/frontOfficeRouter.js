const express = require("express");
const router = express.Router();
const frontOfficeController = require("../controllers/frontOfficeController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware"); // Assuming you have this middleware for authentication

/**
 * @swagger
 * tags:
 *   name: Front Office Sales
 *   description: API endpoints for managing front office sales
 */

/**
 * @swagger
 * /api/front-office-sales:
 *   post:
 *     summary: Create a new front office sale
 *     tags: [Front Office Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FrontOfficeSaleCreate'
 *           example:
 *             date: "2025-01-12"
 *             amount: 2000.75
 *     security:
 *       - bearerAuth: []
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
 *                   example: 'Front Office sale created successfully'
 *                 sale:
 *                   $ref: '#/components/schemas/FrontOfficeSale'
 *       '400':
 *         description: Bad request - validation error
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
 *                   example: '"date" is required, "amount" must be a number'
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
 *                   example: 'Error reporting Front Office sale'
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:frontoffice"),
  frontOfficeController.createFrontOfficeSale
);

/**
 * @swagger
 * /api/front-office-sales:
 *   get:
 *     summary: Get all front office sales
 *     tags: [Front Office Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FrontOfficeSale'
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:frontoffice"),
  frontOfficeController.getAllFrontOfficeSales
);

/**
 * @swagger
 * /api/front-office-sales/{id}:
 *   get:
 *     summary: Get a front office sale by ID
 *     tags: [Front Office Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the sale to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sale details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sale:
 *                   $ref: '#/components/schemas/FrontOfficeSale'
 *       '404':
 *         description: Sale not found
 *       '400':
 *         description: Invalid sale ID
 *       '500':
 *         description: Internal server error
 */
router.get(
  "/:id",
  authenticateUser,
  authorize("read:frontoffice"),
  frontOfficeController.getFrontOfficeSaleById
);

/**
 * @swagger
 * /api/front-office-sales/{id}:
 *   put:
 *     summary: Update a front office sale
 *     tags: [Front Office Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the sale to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 2500
 *                 description: The amount of the sale
 *               assignedPersonnel:
 *                 type: string
 *                 example: "John Doe"
 *                 description: The person assigned to the sale (optional)
 *               notes:
 *                 type: string
 *                 example: "Updated daily sales amount."
 *                 description: Notes for the sale (optional)
 *             required:
 *               - amount
 *             additionalProperties: false
 *     security:
 *       - bearerAuth: []
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
 *                   example: 'Front Office sale updated successfully'
 *                 sale:
 *                   $ref: '#/components/schemas/FrontOfficeSale'
 *       '400':
 *         description: Bad request - validation error or sale ID not provided
 *       '404':
 *         description: Sale not found
 *       '500':
 *         description: Internal server error
 */

router.put(
  "/:id",
  authenticateUser,
  authorize("delete:frontoffice"),
  frontOfficeController.updateFrontOfficeSale
);

module.exports = router;
