// backend/models/videoModel.js
// Handles database operations related to video records.
const pool = require('../configs/db');

/**
 * Retrieve videos from the database.
 * If userId is provided, return public videos plus private videos created by the user.
 * Otherwise, return only public videos.
 */
async function getVideos(userId = null) {
  let query;
  let values = [];
  if (userId) {
    query = `
      SELECT id, url, title, description, creator, visibility
      FROM videos
      WHERE visibility = 'public' OR (visibility = 'private' AND creator = $1)
      ORDER BY created_at DESC`;
    values = [userId];
  } else {
    query = `
      SELECT id, url, title, description, creator, visibility
      FROM videos
      WHERE visibility = 'public'
      ORDER BY created_at DESC`;
  }
  const res = await pool.query(query, values);
  return res.rows;
}

/**
 * Add a new video record to the database.
 * @param {string} url - Video URL.
 * @param {string} creator - User ID of the creator.
 * @param {string} visibility - 'public' or 'private'.
 * @param {string} title - Video title.
 * @param {string} description - Video description.
 */
async function addVideo(url, creator, visibility = 'public', title = '', description = '') {
  const query = `
    INSERT INTO videos (url, creator, visibility, title, description, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id`;
  const values = [url, creator, visibility, title, description];
  const res = await pool.query(query, values);
  return res.rows[0];
}

module.exports = { getVideos, addVideo };
