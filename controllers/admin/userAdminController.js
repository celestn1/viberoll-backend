// backend/controllers/admin/userAdminController.js

const {
  createAdminUser,
  deleteUserById,
  restoreUserById,
  getAllUsers,
  getAuditLogs,
} = require('../../models/userModel');

const pool = require('../../configs/db');
const { HTTP_STATUS, MESSAGES } = require('../../constants');
const asyncHandler = require('../../middleware/asyncHandler');

const getClientIp = (req) =>
  req.headers['x-forwarded-for'] || req.connection.remoteAddress;

/**
 * Controller to create a new admin user.
 * Accessible only via the secure admin route.
 */
const createAdminUserController = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.INVALID_PARAMETERS });
  }
  try {
    const adminUser = await createAdminUser(email, username, password);
    res.status(HTTP_STATUS.CREATED).json(adminUser);
  } catch (error) {
    next(error);
  }
});

/**
 * Controller to soft delete a user by ID.
 * Accessible only via the secure admin route.
 */
const deleteUserByIdController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedUser = await deleteUserById(id);
    if (!deletedUser) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: MESSAGES.USER_NOT_FOUND });
    }

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (admin_id, action, target_user_id, target_email, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user.id,
        'SOFT_DELETE_USER',
        deletedUser.id,
        deletedUser.email,
        JSON.stringify({
          deleted: true,
          deleted_by: req.user.email,
          reason: 'Admin-initiated user removal',
          ip: getClientIp(req),
        }),
      ]
    );

    res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USER_DELETED, user: deletedUser });
  } catch (error) {
    next(error);
  }
});

/**
 * Controller to restore a soft-deleted user.
 * Accessible only via the secure admin route.
 */
const restoreUserByIdController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const restoredUser = await restoreUserById(id);
    if (!restoredUser) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: MESSAGES.USER_NOT_FOUND });
    }

    // Log audit
    await pool.query(
      `INSERT INTO audit_logs (admin_id, action, target_user_id, target_email, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user.id,
        'RESTORE_USER',
        restoredUser.id,
        restoredUser.email,
        JSON.stringify({
          deleted: false,
          restored_by: req.user.email,
          reason: 'Manual restoration by admin',
          ip: getClientIp(req),
        }),
      ]
    );

    res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USER_RESTORED, user: restoredUser });
  } catch (error) {
    next(error);
  }
});

/**
 * Controller to get all users with filters, pagination, and search.
 * Admin-only access.
 */
const getAllUsersController = asyncHandler(async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      is_admin,
      q,
      created_before,
      created_after,
      include_deleted,
      only_deleted,
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      is_admin: is_admin !== undefined ? is_admin === 'true' : undefined,
      q,
      created_before,
      created_after,
      include_deleted: include_deleted === 'true',
      only_deleted: only_deleted === 'true',
    };

    const users = await getAllUsers(options);
    res.status(HTTP_STATUS.OK).json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * Controller to fetch audit logs.
 * Supports pagination.
 */
const getAuditLogsController = asyncHandler(async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const logs = await getAuditLogs({ limit, page });
    res.status(HTTP_STATUS.OK).json(logs);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createAdminUserController,
  deleteUserByIdController,
  restoreUserByIdController,
  getAllUsersController,
  getAuditLogsController,
};
