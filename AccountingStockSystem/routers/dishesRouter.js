// // routers/dishesRouter.js
// const express = require("express");
// const router = express.Router();
// const dishController = require("../controllers/dishesController");
// const { authenticateUser } = require("../middlewares/authMiddleware");

// /**
//  * @swagger
//  * tags:
//  *   name: Dishes
//  *   description: API endpoints for managing dishes
//  */

// /**
//  * @swagger
//  * /api/dishes:
//  *   get:
//  *     summary: Get all dishes
//  *     tags: [Dishes]
//  *     responses:
//  *       '200':
//  *         description: A list of dishes
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Dishes'
//  *       '500':
//  *         description: Internal server error
//  */
// router.get("/", authenticateUser, dishController.getAllDishes);

// /**
//  * @swagger
//  * /api/dishes:
//  *   post:
//  *     summary: Create a new dish
//  *     tags: [Dishes]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "Spaghetti Carbonara"
//  *               description:
//  *                 type: string
//  *                 example: "Classic Italian dish with eggs, cheese, bacon, and black pepper."
//  *               price:
//  *                 type: number
//  *                 example: 12.99
//  *               categoryName:
//  *                 type: string
//  *                 example: "Italian"
//  *     responses:
//  *       '201':
//  *         description: Dish created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: Dish created successfully
//  *                 dish:
//  *                   $ref: '#/components/schemas/Dishes'
//  *       '400':
//  *         description: Bad request - validation error or category does not exist
//  *       '500':
//  *         description: Internal server error
//  */
// router.post("/", authenticateUser, dishController.createDish);

// /**
//  * @swagger
//  * /api/dishes/{dishId}:
//  *   put:
//  *     summary: Update an existing dish
//  *     tags: [Dishes]
//  *     parameters:
//  *       - in: path
//  *         name: dishId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The dish id
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "Updated Pizza Margherita"
//  *               description:
//  *                 type: string
//  *                 example: "Updated description of the pizza."
//  *               price:
//  *                 type: number
//  *                 example: 11.00
//  *               categoryName:
//  *                 type: string
//  *                 example: "Pizza"
//  *     responses:
//  *       '200':
//  *         description: Dish updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: Dish updated successfully
//  *                 dish:
//  *                   $ref: '#/components/schemas/Dishes'
//  *       '400':
//  *         description: Bad request - validation error or category does not exist
//  *       '404':
//  *         description: Dish not found
//  *       '500':
//  *         description: Internal server error
//  */
// router.put("/:dishId", authenticateUser, dishController.updateDish);

// /**
//  * @swagger
//  * /api/dishes/{dishId}:
//  *   delete:
//  *     summary: Delete a dish
//  *     tags: [Dishes]
//  *     parameters:
//  *       - in: path
//  *         name: dishId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The dish id
//  *     responses:
//  *       '200':
//  *         description: Dish deleted successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: Dish deleted successfully
//  *                 dish:
//  *                   $ref: '#/components/schemas/Dishes'
//  *       '404':
//  *         description: Dish not found
//  *       '500':
//  *         description: Internal server error
//  */
// router.delete("/:dishId", authenticateUser, dishController.deleteDish);

// module.exports = router;

const express = require("express");
const router = express.Router();
const dishController = require("../controllers/dishesController"); // Adjust path as necessary
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/dishes:
 *   get:
 *     summary: Retrieve all dishes
 *     tags:
 *       - Dishes
 *     responses:
 *       '200':
 *         description: A list of dishes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dish'
 *       '500':
 *         description: Server error
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:dishes"),
  dishController.getAllDishes
);

/**
 * @swagger
 * /api/dishes:
 *   post:
 *     summary: Create a new dish
 *     tags:
 *       - Dishes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryName:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     inventoryItem:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: number
 *     responses:
 *       '201':
 *         description: Dish created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       '400':
 *         description: Bad request - validation errors
 *       '500':
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:dishes"),
  dishController.createDish
);

/**
 * @swagger
 * /api/dishes/{dishId}:
 *   put:
 *     summary: Update a dish by ID (Soft update)
 *     tags:
 *       - Dishes
 *     parameters:
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the dish to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               categoryName:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     inventoryItem:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: number
 *     responses:
 *       '200':
 *         description: Dish updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       '400':
 *         description: Bad request - validation errors
 *       '404':
 *         description: Dish not found
 *       '500':
 *         description: Server error
 */
router.put(
  "/:dishId",
  authenticateUser,
  authorize("update:dishes"),
  dishController.updateDish
);

/**
 * @swagger
 * /api/dishes/{dishId}:
 *   delete:
 *     summary: Delete a dish by ID
 *     tags:
 *       - Dishes
 *     parameters:
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the dish to delete
 *     responses:
 *       '200':
 *         description: Dish deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       '404':
 *         description: Dish not found
 *       '500':
 *         description: Server error
 */
router.delete(
  "/:dishId",
  authenticateUser,
  authorize("delete:dishes"),
  dishController.deleteDish
);

// Here, you might also want to define your Dish schema for the Swagger components

/**
 * @swagger
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               inventoryItem:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
