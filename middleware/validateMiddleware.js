// middleware/validateMiddleware.js
/**
 * Middleware to validate request input using express-validator.
 * This function checks the result of validation (set up in the route definitions)
 * and returns a 400 response with details if any validations failed.
 */

const { validationResult } = require('express-validator');

const validateMiddleware = (req, res, next) => {
  // Gather validation errors from the request
  const errors = validationResult(req);
  
  // If errors exist, respond with a 400 Bad Request and error details
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Proceed to the next middleware or route handler if validation passed
  next();
};

module.exports = validateMiddleware;
