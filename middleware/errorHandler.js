// backend/middleware/errorHandler.js
// Global error-handling middleware that logs errors and sends a response.
const { HTTP_STATUS } = require('../constants');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  // Log full error stack in development
  logger.error(err.stack);
  // Use the error's statusCode if set, otherwise default to INTERNAL_SERVER_ERROR
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const response = { error: err.message || 'Internal Server Error' };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
