// backend/utils/logger.js
// Uses Winston for structured logging.

const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    // Write error-level logs to a file (logs/error.log)
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' })
  ],
});

module.exports = logger;
