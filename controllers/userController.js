// backend/controllers/userController.js
// Handles user registration and login.
const { createUser, createAdminUser, getUserByEmail, updateUser, deleteUser } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS, MESSAGES, CONFIG } = require('../constants');
const asyncHandler = require('../middleware/asyncHandler');
const { v4: uuidv4 } = require('uuid'); // To generate a unique token ID

/**
 * POST /auth/register
 * Public endpoint for user registration (creates non-admin users).
 */
const registerController = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.INVALID_PARAMETERS });
    }
    const user = await createUser(email, username, password);
    res.status(HTTP_STATUS.CREATED).json({
      message: 'Account created successfully',
      user
    });
  });

/**
 * POST /auth/login
 * Authenticates a user and returns short-lived access and refresh tokens.
 */
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.INVALID_PARAMETERS });
  }
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS });
  }
  
  // Generate a unique identifier for the token
  const tokenId = uuidv4();
  
  // Create an access token with expiration from constants
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, is_admin: user.is_admin, jti: tokenId },
    process.env.JWT_SECRET,
    { expiresIn: CONFIG.JWT_ACCESS_TOKEN_EXPIRATION }
  );

  // Create a refresh token with expiration from constants
  const refreshToken = jwt.sign(
    { id: user.id, jti: tokenId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: CONFIG.JWT_REFRESH_TOKEN_EXPIRATION }
  );

  // Optionally, store the refresh token in your database or Redis for further validation/revocation

  res.status(HTTP_STATUS.OK).json({ accessToken, refreshToken });
});

/**
 * PUT /user/update
 * Endpoint for an authenticated user to update their details.
 */
const updateUserController = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!email && !username && !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.INVALID_PARAMETERS });
    }
    const updatedUser = await updateUser(req.user.id, { email, username, password });
    res.status(HTTP_STATUS.OK).json(updatedUser);
});
  
/**
* DELETE /user/delete
* Endpoint for an authenticated user to delete their account.
*/
const deleteUserController = asyncHandler(async (req, res) => {
  const success = await deleteUser(req.user.id);
   if (success) {
    res.status(HTTP_STATUS.OK).json({ message: 'User account deleted successfully' });
   } else {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
   }
});

module.exports = { registerController, loginController, updateUserController, deleteUserController };

