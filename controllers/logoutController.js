// backend/controllers/logoutController.js
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');
const redisClient = require('../configs/redis');

const logoutController = asyncHandler(async (req, res) => {
  // Assuming authMiddleware has attached req.user
  const tokenJti = req.user.jti;
  const tokenExp = req.user.exp; // exp is in seconds since epoch
  const currentTime = Math.floor(Date.now() / 1000);
  const ttl = tokenExp - currentTime;
  
  // Blacklist the token using its jti in Redis with an expiration equal to its remaining lifetime.
  await redisClient.set(`bl_${tokenJti}`, "true", { EX: ttl });

  res.status(HTTP_STATUS.OK).json({ message: "Successfully logged out" });
});

module.exports = { logoutController };