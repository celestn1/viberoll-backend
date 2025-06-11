// backend/controllers/videoController.js
// Handles logic for video retrieval and upload.
const { getVideos, addVideo } = require('../models/videoModel');
const redisClient = require('../configs/redis');
const { HTTP_STATUS, MESSAGES } = require('../constants');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * GET /videos
 * Retrieve videos from the database.
 * If the user is authenticated, return both public and their private videos.
 * Uses Redis caching to speed up response.
 */
const getVideosController = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const cacheKey = userId ? `viberoll:videos_${userId}` : 'viberoll:videos_public';
  const cachedVideos = await redisClient.get(cacheKey);
  if (cachedVideos) {
    return res.status(HTTP_STATUS.OK).json(JSON.parse(cachedVideos));
  }
  const videos = await getVideos(userId);
  await redisClient.set(cacheKey, JSON.stringify(videos), { EX: 3600 });
  res.status(HTTP_STATUS.OK).json(videos);
});


/**
 * POST /videos
 * Upload a new video record. Requires authentication.
 * Expects request body to include URL and visibility (with optional title/description).
 */
const addVideoController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Video file is required" });
  }
  const { visibility, title, description } = req.body;
  const videoUrl = req.file.path; // Use the file path from the uploaded file

  // You might want to do additional processing, e.g., moving the file, generating a public URL, etc.
  const newVideo = await addVideo(videoUrl, req.user.id, visibility, title, description);

  // Clear the cache for videos
  await redisClient.del('viberoll:videos_public');
  if (req.user) await redisClient.del(`viberoll:videos_${req.user.id}`);

  res.status(HTTP_STATUS.CREATED).json(newVideo);
});

module.exports = { getVideosController, addVideoController };