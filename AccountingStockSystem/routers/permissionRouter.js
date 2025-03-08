// permissionRouter.js
const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const permissionController = require("../controllers/permissionController");

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API endpoints for managing permissions
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
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
 *                 permissions:
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
 *                   example:
 *                     - _id: "67c0f013768e7fe0585da5ba"
 *                       name: "read:users"
 *                       description: "Allows reading user data"
 *                 message:
 *                   type: string
 *                   example: "Permissions fetched successfully"
 *       '403':
 *         description: Unauthorized - Insufficient permissions
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
 *                   example: "Unauthorized: Insufficient permissions"
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
 *                   example: "Error fetching permissions"
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:permissions"),
  permissionController.getAllPermissions
);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the permission (e.g., "read:users")
 *                 example: "read:users"
 *               description:
 *                 type: string
 *                 description: Optional description of the permission
 *                 example: "Allows reading user data"
 *             required:
 *               - name
 *     responses:
 *       '201':
 *         description: Permission created successfully
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
 *                   example: "Permission created successfully"
 *                 permission:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                   example:
 *                     _id: "67c0f013768e7fe0585da5ba"
 *                     name: "read:users"
 *                     description: "Allows reading user data"
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
 *                   example: "Permission name is required"
 *       '409':
 *         description: Conflict - Permission already exists
 *       '403':
 *         description: Unauthorized - Insufficient permissions
 *       '500':
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:permissions"),
  permissionController.createPermission
);

/**
 * @swagger
 * /api/permissions/{permissionId}:
 *   patch:
 *     summary: Update an existing permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the permission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the permission (optional)
 *                 example: "read:users"
 *               description:
 *                 type: string
 *                 description: New description for the permission (optional)
 *                 example: "Updated description"
 *             minProperties: 1
 *     responses:
 *       '200':
 *         description: Permission updated successfully
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
 *                   example: "Permission updated successfully"
 *                 permission:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       '400':
 *         description: Bad request - validation error
 *       '404':
 *         description: Permission not found
 *       '403':
 *         description: Unauthorized - Insufficient permissions
 *       '500':
 *         description: Server error
 */
router.patch(
  "/:permissionId",
  authenticateUser,
  authorize("update:permissions"),
  permissionController.updatePermission
);

/**
 * @swagger
 * /api/permissions/{permissionId}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the permission to delete
 *     responses:
 *       '200':
 *         description: Permission deleted successfully
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
 *                   example: "Permission deleted successfully"
 *                 permission:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       '404':
 *         description: Permission not found
 *       '403':
 *         description: Unauthorized - Insufficient permissions
 *       '500':
 *         description: Server error
 */
router.delete(
  "/:permissionId",
  authenticateUser,
  authorize("delete:permissions"),
  permissionController.deletePermission
);

module.exports = router;
