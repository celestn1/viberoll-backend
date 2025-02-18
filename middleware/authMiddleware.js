// backend/middleware/authMiddleware.js
// Middleware to verify JWT tokens and attach user information to the request.
const jwt = require('jsonwebtoken');
const { HTTP_STATUS, MESSAGES } = require('../constants');
const logger = require('../utils/logger');
const redisClient = require('../configs/redis'); // Ensure Redis is set up

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.AUTH_REQUIRED });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure the Redis client is connected before performing operations.
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    
    // Check if token is blacklisted (i.e., revoked)
    const isRevoked = await redisClient.get(`bl_${decoded.jti}`);
    if (isRevoked) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Token has been revoked" });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: MESSAGES.INVALID_CREDENTIALS });
  }
}

module.exports = authMiddleware;
