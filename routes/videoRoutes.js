// backend/routes/videoRoutes.js
// Defines endpoints for video operations, including nested comment routes.

const express = require('express');
const router = express.Router();
const { getVideosController, addVideoController } = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');
const commentRoutes = require('./commentRoutes');
const upload = require('../configs/upload'); // Import the Multer configuration

/**
 * @openapi
 * /videos:
 *   get:
 *     summary: Retrieve videos
 *     description: Retrieve a list of videos. For authenticated users, both public and private videos are returned.
 *     responses:
 *       200:
 *         description: List of videos retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   url:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   creator:
 *                     type: string
 *                   visibility:
 *                     type: string
 *       404:
 *         description: No videos found.
 */
router.get('/', getVideosController);

/**
 * @openapi
 * /videos:
 *   post:
 *     summary: Upload a new video
 *     description: Upload a new video file. Authentication is required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               visibility:
 *                 type: string
 *                 enum: [public, private]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - video
 *               - visibility
 *     responses:
 *       201:
 *         description: Video uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 url:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 creator:
 *                   type: string
 *                 visibility:
 *                   type: string
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 */
router.post('/', authMiddleware, upload.single('video'), addVideoController);

// Mount comment routes (nested under a video)
router.use('/:videoId/comments', commentRoutes);

module.exports = router;
