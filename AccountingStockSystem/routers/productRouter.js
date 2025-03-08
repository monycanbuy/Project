const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: lowStock
 *         schema:
 *           type: integer
 *         description: Filter products with stock quantity less than or equal to this value
 *       - in: query
 *         name: nearExpiry
 *         schema:
 *           type: integer
 *         description: Number of days for products near expiry
 *       - in: query
 *         name: locationName
 *         schema:
 *           type: string
 *         description: Filter products by location name
 *       - in: query
 *         name: perishable
 *         schema:
 *           type: boolean
 *         description: Filter perishable products
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
 *         description: Number of items per page for pagination
 *     responses:
 *       200:
 *         description: List of all products with pagination and alert information
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       supplier:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           contactPerson:
 *                             type: string
 *                       stockQuantity:
 *                         type: number
 *                       stockKeeper:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                       expiryDate:
 *                         type: string
 *                         format: date-time
 *                       reorderLevel:
 *                         type: number
 *                       reorderQuantity:
 *                         type: number
 *                       unit:
 *                         type: string
 *                       isPerishable:
 *                         type: boolean
 *                       lastRestocked:
 *                         type: string
 *                         format: date-time
 *                       location:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             locations:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                             name:
 *                               type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                 alerts:
 *                   type: object
 *                   properties:
 *                     lowStock:
 *                       type: integer
 *                     nearExpiry:
 *                       type: integer
 *       500:
 *         description: Error fetching products
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:products"),
  productController.getProducts
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating product
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:products"),
  productController.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error updating product
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("update:products"),
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 */
router.delete(
  "/:id",
  authenticateUser,
  authorize("delete:products"),
  productController.deleteProduct
);

module.exports = router;
