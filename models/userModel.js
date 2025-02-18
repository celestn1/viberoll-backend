// backend/models/userModel.js
// Handles user registration and login database operations.
const pool = require('../configs/db');
const bcrypt = require('bcrypt');
const { MESSAGES, CONFIG } = require('../constants');


/**
 * Create a new normal user with a hashed password.
 * Public registration always creates non-admin users.
 * @param {string} email
 * @param {string} username
 * @param {string} password - Plain text password.
 */
async function createUser(email, username, password) {
  // Check if the user already exists.
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    const error = new Error(MESSAGES.USER_EXISTS);
    error.statusCode = 409;
    throw error;
  }

  const hash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS);
  const query = `
    INSERT INTO users (email, username, password, is_admin, created_at)
    VALUES ($1, $2, $3, false, NOW()) RETURNING id, email, username`;
  const values = [email, username, hash];
  const res = await pool.query(query, values);
  return res.rows[0];
}

/**
 * Create a new admin user with a hashed password.
 * This function should only be called from a secure, admin-protected route.
 * @param {string} email
 * @param {string} username
 * @param {string} password - Plain text password.
 */
async function createAdminUser(email, username, password) {
  // Check if the user already exists.
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    const error = new Error(MESSAGES.USER_EXISTS);
    error.statusCode = 409;
    throw error;
  }

  const hash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS);
  const query = `
    INSERT INTO users (email, username, password, is_admin, created_at)
    VALUES ($1, $2, $3, true, NOW()) RETURNING id, email, username, is_admin`;
  const values = [email, username, hash];
  const res = await pool.query(query, values);
  return res.rows[0];
}

/**
 * Retrieve a user record by email.
 * @param {string} email
 */
async function getUserByEmail(email) {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
}

/**
 * Update user details.
 * @param {number} userId - ID of the user to update.
 * @param {object} fields - Object containing fields to update: email, username, password.
 * @returns {object} The updated user record.
 */
async function updateUser(userId, { email, username, password }) {
    const updates = [];
    const values = [];
    let i = 1;
  
    if (email) {
      updates.push(`email = $${i++}`);
      values.push(email);
    }
    if (username) {
      updates.push(`username = $${i++}`);
      values.push(username);
    }
    if (password) {
      const hash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS);
      updates.push(`password = $${i++}`);
      values.push(hash);
    }
    if (updates.length === 0) {
      throw new Error('No fields to update');
    }
  
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, email, username, is_admin`;
    values.push(userId);
  
    const res = await pool.query(query, values);
    return res.rows[0];
  }
  
  /**
   * Delete a user by ID.
   * @param {number} userId - ID of the user to delete.
   * @returns {boolean} True if deletion was successful.
   */
  async function deleteUser(userId) {
    const res = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    return res.rowCount > 0;
  }
  
module.exports = { createUser, createAdminUser, getUserByEmail, updateUser, deleteUser };