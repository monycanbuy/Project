const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const categoryController = require("../controllers/categoryController");

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                   example:
 *                     - name: "Italian"
 *                     - name: "French"
 *       '500':
 *         description: Server error
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
 *                   example: "Error fetching categories"
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:categories"),
  categoryController.getAllCategories
);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       '201':
 *         description: Category created successfully
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
 *                   example: 'Category created successfully'
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       '400':
 *         description: Bad request - validation error
 *       '409':
 *         description: Category already exists
 *       '500':
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:categories"),
  categoryController.createCategory
);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       '200':
 *         description: Category updated successfully
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
 *                   example: 'Category updated successfully'
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       '400':
 *         description: Bad request - validation error
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Server error
 */
router.put(
  "/:categoryId",
  authenticateUser,
  authorize("update:categories"),
  categoryController.updateCategory
);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete
 *     responses:
 *       '200':
 *         description: Category deleted successfully
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
 *                   example: 'Category deleted successfully'
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Server error
 */
router.delete(
  "/:categoryId",
  authenticateUser,
  authorize("delete:categories"),
  categoryController.deleteCategory
);

module.exports = router;

// Swagger component schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the category
 *       example:
 *         name: 'Italian'
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The MongoDB document ID
 *         name:
 *           type: string
 *           description: The name of the category
 *       example:
 *         _id: '60b691a9f2f7a64b6c4b0a1e'
 *         name: 'Italian'
 */
