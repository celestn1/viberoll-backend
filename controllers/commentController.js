// backend/controllers/commentController.js
// Handles logic for fetching and adding video comments.
const { getComments, addComment } = require('../models/commentModel');
const { HTTP_STATUS, MESSAGES } = require('../constants');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * GET /videos/:videoId/comments
 * Retrieves comments for a given video.
 */
const getCommentsController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const comments = await getComments(videoId);
  res.status(HTTP_STATUS.OK).json(comments);
});

/**
 * POST /videos/:videoId/comments
 * Adds a new comment to a video. Requires authentication.
 * Expects { commentText } in the request body.
 */
const addCommentController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { commentText } = req.body;
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.AUTH_REQUIRED });
  }
  if (!commentText) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.INVALID_PARAMETERS });
  }
  const comment = await addComment(videoId, req.user.id, commentText);
  res.status(HTTP_STATUS.CREATED).json(comment);
});

module.exports = { getCommentsController, addCommentController };
