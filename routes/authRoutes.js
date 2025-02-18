// backend/routes/authRoutes.js
// Defines endpoints for user registration and login.

const express = require('express');
const router = express.Router();
const { registerController, loginController } = require('../controllers/userController');
const { refreshTokenController } = require('../controllers/tokenController');
const { logoutController } = require('../controllers/logoutController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new non-admin user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 example: "secretPassword"
 *             required:
 *               - email
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully.
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
 *         description: Invalid input provided.
 */
router.post('/register', registerController);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns an access token and refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "secretPassword"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials.
 */
router.post('/login', loginController);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Issues a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "yourRefreshTokenHere"
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: New access token issued successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token.
 */
router.post('/refresh', refreshTokenController);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Revokes the user's access token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *       401:
 *         description: Unauthorized.
 */
router.post('/logout', authMiddleware, logoutController);

module.exports = router;
