// backend/middleware/adminMiddleware.js

/**
 * Middleware to ensure that the user is an admin.
 * Assumes authMiddleware attaches user information to req.user.
 */
function adminMiddleware(req, res, next) {
    if (req.user && req.user.is_admin) {
      return next();
    }
    return res.status(403).json({ error: 'Admin privileges required.' });
  }
  
  module.exports = adminMiddleware;
  