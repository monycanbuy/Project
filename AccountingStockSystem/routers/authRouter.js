const express = require("express");
const authController = require("../controllers/authController");
const upload = require("../middlewares/fileUpload");
const {
  authenticateUser,
  authorize,
} = require("../middlewares/authMiddleware");
const imageUpload = require("../upload/imageUpload");
const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the new account
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the user
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - phoneNumber
 *     responses:
 *       201:
 *         description: Signup successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict - Email or phone number already in use
 *       500:
 *         description: Server error
 */

router.post(
  "/signup",
  authenticateUser,
  authorize("write:users"),
  authController.signup
);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 description: Email or phone number of the user
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Password for the account
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Successfully signed in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token for token renewal
 *                   example: "dGhpcy1pcy1hLXJlZnJlc2..."
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account locked
 *       500:
 *         description: Internal server error
 */
router.post("/signin", authController.signin);

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Log out the current user by clearing the authentication cookie
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       400:
 *         description: Bad request
 */
router.post("/signout", authenticateUser, authController.signout);

/**
 * @swagger
 * /api/auth/send-verification-code:
 *   patch:
 *     summary: Send a verification code to the user's email.
 *     description: This endpoint sends a verification code to the email provided by the user for account verification.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Code sent successfully.
 *       400:
 *         description: Invalid input or code sending failed.
 *       404:
 *         description: User does not exist.
 *       500:
 *         description: Internal server error.
 */

router.patch(
  "/send-verification-code",
  authenticateUser, // Middleware to verify the token and decode the email
  authController.sendVerificationCode
);

/**
 * @swagger
 * /api/auth/verify-verification-code:
 *   patch:
 *     summary: Verify the verification code sent to the user's email
 *     description: This endpoint verifies the code provided by the user matches the one sent for verification.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *               providedCode:
 *                 type: string
 *                 description: The verification code provided by the user
 *                 minLength: 6
 *                 maxLength: 6
 *             required:
 *               - email
 *               - providedCode
 *     responses:
 *       '200':
 *         description: Verification successful
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
 *                   example: "Your account has been verified!"
 *       '400':
 *         description: Bad request - various possible errors
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
 *                   enum: ["Invalid verification code!", "You are already verified!"]
 *       '401':
 *         description: Unauthorized - user or verification data not found
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
 *                   example: "User does not exist!"
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
 *                   example: "Internal server error"
 */

router.patch(
  "/verify-verification-code",
  // authenticateUser,
  authController.verifyVerificationCode
);

/**
 * @swagger
 * /api/auth/fetchuserdetails:
 *   get:
 *     summary: Fetch details of the authenticated user
 *     description: This endpoint retrieves the details of the authenticated user using the provided JWT token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                     createdAt:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get(
  "/fetchuserdetails",
  authenticateUser,
  authorize("read:users"),
  authController.fetchUserDetails
);

/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: Change the user's password
 *     description: This endpoint allows a verified user to change their password by providing the old and new passwords.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's current password
 *                 example: CurrentPassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user (must meet complexity requirements)
 *                 example: NewPassword456!
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Password changed successfully
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
 *                   example: "Password updated successfully!"
 *       '401':
 *         description: Unauthorized - Invalid credentials, user not verified, or user does not exist
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
 *                   enum: ["Invalid credentials!", "You are not a verified user!", "User does not exist!"]
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
 *                   example: "Internal server error"
 */

router.patch(
  "/change-password",
  authenticateUser,
  authController.changePassword
);

/**
 * @swagger
 * /api/auth/send-forgot-password-code:
 *   patch:
 *     summary: Send a password reset code to the user's email
 *     description: This endpoint sends a code to reset the password to the email provided by the user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address associated with the account for which to send the reset code
 *                 example: user@example.com
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Code sent successfully or generic success message if user not found
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
 *                   example: "Password reset code has been sent to your email."
 *                   enum: ["Password reset code has been sent to your email.", "If that email address is in our system, we have sent you a code to reset your password."]
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
 *                   example: "An error occurred while sending the password reset code."
 */
router.patch(
  "/send-forgot-password-code",
  authController.sendForgotPasswordCode
);

/**
 * @swagger
 * /api/auth/verify-forgot-password-code:
 *   patch:
 *     summary: Verify the password reset code and update password
 *     description: This endpoint verifies the code provided for password reset and updates the user's password if the code is valid.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email associated with the account
 *                 example: user@example.com
 *               providedCode:
 *                 type: string
 *                 description: The reset code sent to the user's email
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the account (must meet complexity requirements)
 *                 example: "NewPassword123!"
 *             required:
 *               - email
 *               - providedCode
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Password updated successfully
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
 *                   example: "Password updated successfully!"
 *       '400':
 *         description: Bad request - various possible errors
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
 *                   enum: ["No reset code found!", "Reset code has expired!", "Invalid reset code!"]
 *       '401':
 *         description: Unauthorized - Invalid email or code
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
 *                   example: "Invalid email or code."
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
 *                   example: "Internal server error"
 */
router.patch(
  "/verify-forgot-password-code",
  authController.verifyForgotPasswordCode
);

/**
 * @swagger
 * /api/auth/update-profile:
 *   patch:
 *     summary: Update user profile information
 *     description: Allows authenticated users to update their profile details like name, email, etc.
 *     tags:
 *       - User Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The user's full name
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: "jane.doe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number
 *                 example: "08012345678"
 *             additionalProperties: false
 *     responses:
 *       '200':
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: Updated user details
 *       '400':
 *         description: Bad request - validation errors
 *       '401':
 *         description: Unauthorized - user not authenticated
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */

router.patch(
  "/update-profile",
  authenticateUser,
  authController.updateProfileInfo
);

/**
 * @swagger
 * /api/auth/update-profile-image:
 *   post:
 *     summary: Upload user profile image
 *     description: Endpoint for authenticated users to upload a new profile image.
 *     tags:
 *       - User Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (must be jpeg, png, or gif)
 *     responses:
 *       '200':
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   description: Updated user details including new image URL
 *       '400':
 *         description: Bad request - file type not supported or file too large
 *       '401':
 *         description: Unauthorized - user not authenticated
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.post(
  "/update-profile-image",
  authenticateUser,
  //imageUpload,
  upload.single("image"),
  authorize("read:profile"),
  authController.updateProfileImage
);

/**
 * @swagger
 * /api/auth/currently-logged-in:
 *   get:
 *     summary: Get the number of currently logged-in users
 *     description: Retrieves the count of users who have logged in within the last 15 minutes (based on lastLogin timestamp).
 *     tags:
 *       - Authentication Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched the count of currently logged-in users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentlyLoggedInUsers:
 *                       type: integer
 *                       description: Number of users currently logged in
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: "Total number of currently logged-in users fetched successfully"
 *       '401':
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: "Server error"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.get(
  "/currently-logged-in",
  authenticateUser,
  authorize("read:profile"),
  authController.getCurrentlyLoggedInUsers
);

/**
 * @swagger
 * /api/auth/logged-in-today:
 *   get:
 *     summary: Get the number of users logged in today
 *     description: Retrieves the count of users who have logged in since midnight today (based on lastLogin timestamp).
 *     tags:
 *       - Authentication Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched the count of users logged in today
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     loggedInToday:
 *                       type: integer
 *                       description: Number of users logged in today
 *                       example: 15
 *                 message:
 *                   type: string
 *                   example: "Total number of users logged in today fetched successfully"
 *       '401':
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: "Server error"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.get(
  "/logged-in-today",
  authenticateUser,
  authorize("read:profile"),
  authController.getLoggedInToday
);

/**
 * @swagger
 * /api/auth/staff-task-achievements:
 *   get:
 *     summary: Get top staff by task achievements
 *     description: Retrieves the top 10 staff members with the most tasks completed, sorted in descending order.
 *     tags:
 *       - Authentication Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched staff task achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fullName:
 *                         type: string
 *                         description: Full name of the staff member
 *                         example: "John Doe"
 *                       tasksCompleted:
 *                         type: integer
 *                         description: Number of tasks completed by the staff member
 *                         example: 50
 *                 message:
 *                   type: string
 *                   example: "Staff task achievements fetched successfully"
 *       '401':
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: "Server error"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.get(
  "/staff-task-achievements",
  authenticateUser,
  authController.getStaffTaskAchievements
);

/**
 * @swagger
 * /api/auth/total-users:
 *   get:
 *     summary: Get total user statistics
 *     description: Retrieves the total number of users, active users, and inactive users based on status.
 *     tags:
 *       - Authentication Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       description: Total number of users (all statuses)
 *                       example: 50
 *                     activeUsers:
 *                       type: integer
 *                       description: Number of users with status "active"
 *                       example: 40
 *                     inactiveUsers:
 *                       type: integer
 *                       description: Number of users with status "suspended" or "deleted"
 *                       example: 10
 *                 message:
 *                   type: string
 *                   example: "User statistics fetched successfully"
 *       '401':
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: "Server error"
 *                 details:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.get(
  "/total-users",
  authenticateUser,
  authorize("read:users"),
  authController.getTotalUsers
);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     description: |
 *       This endpoint fetches all users in the system. Note: This should be restricted to authenticated users with appropriate permissions in a production setting.
 *     tags:
 *       - User Management
 *     security:
 *       - bearerAuth: []
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fullName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                   example:
 *                     - fullName: "John Doe"
 *                       email: "john@example.com"
 *                       phoneNumber: "08012345678"
 *                     - fullName: "Jane Smith"
 *                       email: "jane@example.com"
 *                       phoneNumber: "08098765432"
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
 *                   example: "Error fetching users"
 */
router.get(
  "/users",
  authenticateUser,
  authorize("read:users"),
  authController.getAllUsers
);

/**
 * @swagger
 * /api/auth/users/{userId}:
 *   patch:
 *     summary: Update user information (Admin use)
 *     description: Allows an admin to update user details. Roles can be provided as names or IDs.
 *     tags:
 *       - User Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *               isActive:
 *                 type: boolean
 *                 description: Is the user active?
 *               roles:
 *                 type: array
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       description: Role name or role ID (if string, it will be treated as a role name)
 *                     - type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: ObjectId
 *                           description: Role ID if known
 *                         name:
 *                           type: string
 *                           description: Role name
 *                 description: Array of roles, can be names or IDs
 *     responses:
 *       '200':
 *         description: User updated successfully
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
 *                   example: "User updated successfully."
 *                 data:
 *                   type: object
 *                   description: Updated user details with populated roles
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             format: ObjectId
 *                           name:
 *                             type: string
 *       '400':
 *         description: Bad request - validation errors
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.patch(
  "/users/:userId",
  authenticateUser,
  authorize("update:users"),
  authController.updateUser
);

/**
 * @swagger
 * /api/auth/users/{userId}:
 *   delete:
 *     summary: Delete a user (Admin use)
 *     description: Allows an admin to delete a user from the system.
 *     tags:
 *       - User Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       '200':
 *         description: User deleted successfully
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
 *                   example: "User deleted successfully."
 *       '404':
 *         description: User not found
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
 *                   example: "User not found."
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
 *                   example: "Error deleting user."
 */

router.delete(
  "/users/:userId",
  authenticateUser,
  authorize("delete:users"),
  authController.deleteUser
);

module.exports = router;
