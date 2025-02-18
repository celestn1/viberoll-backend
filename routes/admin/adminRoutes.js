// backend/routes/admin/adminRoutes.js
// Defines endpoints for admin user creation.

const express = require('express');
const router = express.Router();
const { createAdminUserController } = require('../../controllers/admin/userAdminController');
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

module.exports = router;
