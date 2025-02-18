// backend/controllers/admin/userAdminController.js

const { createAdminUser } = require('../../models/userModel');
const { HTTP_STATUS, MESSAGES } = require('../../constants');
const asyncHandler = require('../../middleware/asyncHandler');

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

module.exports = { createAdminUserController };
