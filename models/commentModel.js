// backend/models/commentModel.js
// Handles database operations for video comments.
const pool = require('../configs/db');

/**
 * Retrieve comments for a given video.
 * @param {number} videoId - ID of the video.
 */
async function getComments(videoId) {
  const res = await pool.query(`
    SELECT c.id, c.comment_text, c.created_at, u.username
    FROM video_comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.video_id = $1
    ORDER BY c.created_at ASC
  `, [videoId]);
  return res.rows;
}

/**
 * Add a new comment to a video.
 * @param {number} videoId - ID of the video.
 * @param {number} userId - ID of the commenting user.
 * @param {string} commentText - The comment text.
 */
async function addComment(videoId, userId, commentText) {
  const query = `
    INSERT INTO video_comments (video_id, user_id, comment_text, created_at)
    VALUES ($1, $2, $3, NOW()) RETURNING id, comment_text, created_at
  `;
  const res = await pool.query(query, [videoId, userId, commentText]);
  return res.rows[0];
}

module.exports = { getComments, addComment };
