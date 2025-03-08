// routers/saleRouter.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const identification = require('../middlewares/identification'); // Assuming you have this for authentication


/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: API endpoints for managing sales
 */

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 format: uuid
 *                 example: "6458cf6c8b9bff1e4a77a5b7"
 *                 description: The ID of the payment method to be used for the sale
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
 *                   $ref: '#/components/schemas/Sale'
 *       '400':
 *         description: Bad request - validation error or payment method does not exist
 *       '500':
 *         description: Internal server error
 */
router.post('/', identification.identifier, salesController.createSale);


/**
 * @swagger
 * /api/sales/{saleId}/items:
 *   post:
 *     summary: Add an item to an existing sale
 *     tags: [Sales]
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
 *               dish:
 *                 type: string
 *                 format: uuid
 *                 example: "6458cf6c8b9bff1e4a77a5b7"
 *                 description: The ID of the dish to add to the sale
 *               quantity:
 *                 type: integer
 *                 example: 2
 *                 description: The quantity of the dish to add
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
 *                   $ref: '#/components/schemas/SaleItem'
 *       '400':
 *         description: Bad request - validation error or dish does not exist
 *       '404':
 *         description: Sale or dish not found
 *       '500':
 *         description: Internal server error
 */
router.post('/:saleId/items', identification.identifier , salesController.addSaleItem);

/**
 * @swagger
 * /api/sales/{saleId}:
 *   put:
 *     summary: Update or complete an existing sale
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: saleId
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
 *               paymentMethod:
 *                 type: string
 *                 format: uuid
 *                 example: "6458cf6c8b9bff1e4a77a5b7"
 *                 description: The new payment method ID (optional)
 *               totalAmount:
 *                 type: number
 *                 example: 50.00
 *                 description: The new total amount for the sale (optional)
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
 *                   $ref: '#/components/schemas/Sale'
 *       '400':
 *         description: Bad request - validation error
 *       '404':
 *         description: Sale not found
 *       '500':
 *         description: Internal server error
 */
router.put('/:saleId', identification.identifier , salesController.updateSale);


/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Retrieve all sales with optional filters
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *         description: Filter by payment method ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter sales from this date (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter sales up to this date (inclusive)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of sales per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: date
 *           enum: [date, totalAmount]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: desc
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       '200':
 *         description: Sales retrieved successfully
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
 *                   example: Sales retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     sales:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Sale'
 *                     total:
 *                       type: integer
 *                       description: Total number of sales matching criteria
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       description: Number of items per page
 *                     pages:
 *                       type: integer
 *                       description: Total number of pages
 *       '500':
 *         description: Internal server error
 */
router.get('/', identification.identifier, salesController.getAllSales);

/**
 * @swagger
 * /api/sales/{saleId}:
 *   get:
 *     summary: Retrieve details of a specific sale including its items
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: saleId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the sale to retrieve
 *     responses:
 *       '200':
 *         description: Sale details retrieved successfully
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
 *                   example: Sale details retrieved successfully
 *                 sale:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     paymentMethod:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                     totalAmount:
 *                       type: number
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           dish:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               price:
 *                                 type: number
 *                           quantity:
 *                             type: number
 *                           unitPrice:
 *                             type: number
 *                           totalAmount:
 *                             type: number
 *       '404':
 *         description: Sale not found
 *       '500':
 *         description: Internal server error
 */
router.get('/:saleId', identification.identifier, salesController.getSaleById);

/**
 * @swagger
 * /api/sales/{saleId}:
 *   delete:
 *     summary: Void or cancel a specific sale
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: saleId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the sale to void
 *     responses:
 *       '200':
 *         description: Sale voided successfully
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
 *                   example: Sale has been voided successfully
 *                 sale:
 *                   $ref: '#/components/schemas/Sale'
 *       '400':
 *         description: Sale already voided
 *       '404':
 *         description: Sale not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:saleId', identification.identifier, salesController.voidSale);


module.exports = router;