// backend/middleware/asyncHandler.js
// Wraps async route handlers to forward errors to errorHandler middleware.
module.exports = function asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  