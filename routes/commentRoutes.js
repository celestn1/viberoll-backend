// backend/routes/commentRoutes.js
// Defines endpoints for handling video comments.

const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCommentsController, addCommentController } = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @openapi
 * /videos/{videoId}/comments:
 *   get:
 *     summary: Retrieve comments for a video
 *     description: Retrieve all comments associated with a specific video.
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the video.
 *     responses:
 *       200:
 *         description: A list of comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   comment_text:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   username:
 *                     type: string
 *       404:
 *         description: Video not found.
 */
router.get('/', getCommentsController);

/**
 * @openapi
 * /videos/{videoId}/comments:
 *   post:
 *     summary: Add a comment to a video
 *     description: Add a new comment to a specific video. Authentication is required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the video.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentText:
 *                 type: string
 *                 example: "Great video!"
 *             required:
 *               - commentText
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 comment_text:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', authMiddleware, addCommentController);

module.exports = router;
