// backend/models/userModel.js
// Handles user registration and login database operations.

const pool = require('../configs/db');
const bcrypt = require('bcrypt');
const { MESSAGES, CONFIG } = require('../constants');

async function createUser(email, username, password) {
  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  if (existing.rows.length > 0) {
    const error = new Error(MESSAGES.USER_EXISTS);
    error.statusCode = 409;
    throw error;
  }

  const hash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS);
  const query = `
    INSERT INTO users (email, username, password, is_admin, created_at)
    VALUES ($1, $2, $3, false, NOW())
    RETURNING id, email, username`;
  const values = [email, username, hash];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function createAdminUser(email, username, password) {
  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  if (existing.rows.length > 0) {
    const error = new Error(MESSAGES.USER_EXISTS);
    error.statusCode = 409;
    throw error;
  }

  const hash = await bcrypt.hash(password, CONFIG.SALT_ROUNDS);
  const query = `
    INSERT INTO users (email, username, password, is_admin, created_at)
    VALUES ($1, $2, $3, true, NOW())
    RETURNING id, email, username, is_admin`;
  const values = [email, username, hash];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function getUserByEmail(email) {
  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  return res.rows[0];
}

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

  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${i} AND deleted_at IS NULL
    RETURNING id, email, username, is_admin`;
  values.push(userId);

  const res = await pool.query(query, values);
  return res.rows[0];
}

async function deleteUserById(userId) {
  const res = await pool.query(
    `UPDATE users
     SET deleted_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING id, email, username, is_admin, deleted_at`,
    [userId]
  );
  return res.rows[0] || null;
}

async function restoreUserById(userId) {
  const res = await pool.query(
    `UPDATE users
     SET deleted_at = NULL
     WHERE id = $1 AND deleted_at IS NOT NULL
     RETURNING id, email, username, is_admin, deleted_at`,
    [userId]
  );
  return res.rows[0] || null;
}

/**
 * Get all users with pagination, filtering, search, and soft-delete control.
 */
async function getAllUsers({
  page = 1,
  limit = 10,
  is_admin,
  q,
  created_before,
  created_after,
  include_deleted,
  only_deleted,
}) {
  const offset = (page - 1) * limit;
  const values = [];
  const conditions = [];
  let i = 1;

  if (q) {
    conditions.push(`(email ILIKE $${i} OR username ILIKE $${i})`);
    values.push(`%${q}%`);
    i++;
  }

  if (is_admin !== undefined) {
    conditions.push(`is_admin = $${i}`);
    values.push(is_admin);
    i++;
  }

  if (created_before) {
    conditions.push(`created_at <= $${i}`);
    values.push(created_before);
    i++;
  }

  if (created_after) {
    conditions.push(`created_at >= $${i}`);
    values.push(created_after);
    i++;
  }

  if (only_deleted === true) {
    conditions.push(`deleted_at IS NOT NULL`);
  } else if (!include_deleted) {
    conditions.push(`deleted_at IS NULL`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT id, email, username, is_admin, created_at, deleted_at
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${i++} OFFSET $${i}`;
  values.push(limit, offset);

  const res = await pool.query(query, values);
  return res.rows;
}

/**
 * Get audit logs with pagination.
 */
async function getAuditLogs({ limit = 50, page = 1 }) {
  const offset = (page - 1) * limit;
  const res = await pool.query(
    `SELECT id, admin_id, action, target_user_id, target_email, details, timestamp
     FROM audit_logs
     ORDER BY timestamp DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return res.rows;
}

module.exports = {
  createUser,
  createAdminUser,
  getUserByEmail,
  updateUser,
  deleteUserById,
  restoreUserById,
  getAllUsers,
  getAuditLogs,
};
