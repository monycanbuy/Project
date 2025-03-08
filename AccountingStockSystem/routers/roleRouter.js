const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const roleController = require("../controllers/roleController");

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags:
 *       - Roles
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
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                   example:
 *                     - name: "admin"
 *                     - name: "user"
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
 *                   example: "Error fetching roles"
 */
router.get(
  "/",
  authenticateUser,
  authorize("read:roles"),
  roleController.getAllRoles
);

// /**
//  * @swagger
//  * /api/roles/permissions:
//  *   get:
//  *     summary: Get all available permissions
//  *     tags: [Roles]
//  *     responses:
//  *       '200':
//  *         description: Successful operation
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 permissions:
//  *                   type: array
//  *                   items:
//  *                     type: string
//  *                   example: ["read:users", "write:roles"]
//  *       '500':
//  *         description: Server error
//  */
// router.get(
//   "/permissions",
//   authenticateUser,
//   authorize("read:roles"),
//   roleController.getPermissions
// );

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role
 *                 example: "admin"
 *             required:
 *               - name
 *     responses:
 *       '201':
 *         description: Role created successfully
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
 *                   example: "Role created successfully"
 *                 role:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       '400':
 *         description: Bad request - validation error
 *       '409':
 *         description: Conflict - Role already exists
 *       '500':
 *         description: Server error
 */
router.post(
  "/",
  authenticateUser,
  authorize("write:roles"),
  roleController.createRole
);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role
 *                 example: "admin"
 *             required:
 *               - name
 *     responses:
 *       '201':
 *         description: Role created successfully
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
 *                   example: "Role created successfully"
 *                 role:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       '400':
 *         description: Bad request - validation error
 *       '409':
 *         description: Conflict - Role already exists
 *       '500':
 *         description: Server error
 */
router.post(
  "/create",
  authenticateUser,
  authorize("write:roles"),
  roleController.createRole
);

/**
 * @swagger
 * /api/roles/{roleId}:
 *   patch:
 *     summary: Update an existing role
 *     description: Allows updating the name of a specific role.
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the role
 *                 example: "manager"
 *             required:
 *               - name
 *     responses:
 *       '200':
 *         description: Role updated successfully
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
 *                   example: "Role updated successfully"
 *                 role:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *       '400':
 *         description: Bad request - validation errors
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Server error
 */
router.patch(
  "/:roleId",
  authenticateUser,
  authorize("update:roles"),
  roleController.updateRole
);

/**
 * @swagger
 * /api/roles/{roleId}:
 *   delete:
 *     summary: Delete a role
 *     description: Permanently removes a role from the system.
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the role to delete
 *     responses:
 *       '200':
 *         description: Role deleted successfully
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
 *                   example: "Role deleted successfully"
 *                 role:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Server error
 */
router.delete(
  "/:roleId",
  authenticateUser,
  authorize("delete:roles"),
  roleController.deleteRole
);

module.exports = router;
