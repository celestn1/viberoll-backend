// backend/controllers/tokenController.js
const jwt = require('jsonwebtoken');
const { HTTP_STATUS } = require('../constants');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * POST /auth/refresh
 * Endpoint to issue a new access token using a valid refresh token.
 */
const refreshTokenController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Refresh token required" });
  }
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Optionally, check here if the refresh token has been revoked in your store (e.g., Redis)

    // Issue a new access token using the same unique identifier (jti)
    const newAccessToken = jwt.sign(
      { id: decoded.id, jti: decoded.jti },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    return res.status(HTTP_STATUS.OK).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Invalid or expired refresh token" });
  }
});

module.exports = { refreshTokenController };
