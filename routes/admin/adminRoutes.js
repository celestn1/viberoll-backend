// backend/controllers/admin/userAdminController.js

const express = require('express');
const router = express.Router();
const {
  createAdminUserController,
  deleteUserByIdController,
  restoreUserByIdController,
  getAllUsersController,
  getAuditLogsController,
} = require('../../controllers/admin/userAdminController');
const authMiddleware = require('../../middleware/authMiddleware');
const adminMiddleware = require('../../middleware/adminMiddleware');

/**
 * @openapi
 * /admin/create:
 *   post:
 *     summary: Create a new admin user
 *     description: Secure endpoint to create a new admin user. Accessible only to authenticated admin users.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               username:
 *                 type: string
 *                 example: "adminUser"
 *               password:
 *                 type: string
 *                 example: "securePassword"
 *             required:
 *               - email
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Admin user created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Admin privileges required.
 */
router.post('/create', authMiddleware, adminMiddleware, createAdminUserController);

/**
 * @openapi
 * /admin/user/{id}:
 *   delete:
 *     summary: Soft delete a specific user by ID
 *     description: Marks a user as deleted using `deleted_at`. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User soft-deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Admin privileges required.
 *       404:
 *         description: User not found or already deleted.
 */
router.delete('/user/:id', authMiddleware, adminMiddleware, deleteUserByIdController);

/**
 * @openapi
 * /admin/user/restore/{id}:
 *   patch:
 *     summary: Restore a soft-deleted user
 *     description: Restores a user whose `deleted_at` is set. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User restored successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Admin privileges required.
 *       404:
 *         description: User not found or not soft-deleted.
 */
router.patch('/user/restore/:id', authMiddleware, adminMiddleware, restoreUserByIdController);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: Get all users (with filters, search, pagination)
 *     description: Returns a list of users. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Items per page (default: 10)"
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Search email or username"
 *       - in: query
 *         name: is_admin
 *         schema:
 *           type: boolean
 *         description: "Filter by admin users"
 *       - in: query
 *         name: created_before
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Return users created before this timestamp"
 *       - in: query
 *         name: created_after
 *         schema:
 *           type: string
 *           format: date-time
 *         description: "Return users created after this timestamp"
 *       - in: query
 *         name: include_deleted
 *         schema:
 *           type: boolean
 *         description: "Include soft-deleted users"
 *       - in: query
 *         name: only_deleted
 *         schema:
 *           type: boolean
 *         description: "Return only soft-deleted users"
 *     responses:
 *       200:
 *         description: A filtered list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   username:
 *                     type: string
 *                   is_admin:
 *                     type: boolean
 *                   created_at:
 *                     type: string
 *                   deleted_at:
 *                     type: string
 *                     nullable: true
 */
router.get('/users', authMiddleware, adminMiddleware, getAllUsersController);

/**
 * @openapi
 * /admin/audit-logs:
 *   get:
 *     summary: Get recent audit logs
 *     description: Returns a list of admin user actions like delete/restore. Admin access required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of records per page (default: 50)"
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   admin_id:
 *                     type: integer
 *                   action:
 *                     type: string
 *                   target_user_id:
 *                     type: integer
 *                   target_email:
 *                     type: string
 *                   details:
 *                     type: object
 *                   timestamp:
 *                     type: string
 */
router.get('/audit-logs', authMiddleware, adminMiddleware, getAuditLogsController);

module.exports = router;
