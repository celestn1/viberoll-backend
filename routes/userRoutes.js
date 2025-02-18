// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { updateUserController, deleteUserController } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @openapi
 * /user/update:
 *   put:
 *     summary: Update user details
 *     description: Update the authenticated user's details, such as email, username, or password.
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
 *                 example: "newemail@example.com"
 *               username:
 *                 type: string
 *                 example: "newUsername"
 *               password:
 *                 type: string
 *                 example: "newPassword"
 *             description: One or more fields to update. At least one field is required.
 *     responses:
 *       200:
 *         description: User details updated successfully.
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
 */
router.put('/update', authMiddleware, updateUserController);

/**
 * @openapi
 * /user/delete:
 *   delete:
 *     summary: Delete user account
 *     description: Delete the authenticated user's account.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User account deleted successfully"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.delete('/delete', authMiddleware, deleteUserController);

module.exports = router;
