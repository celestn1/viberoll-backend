// backend/constants.js
// Shared constants for HTTP status codes and standard messages.
module.exports = {
    HTTP_STATUS: {
      OK: 200,
      CREATED: 201,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      INTERNAL_SERVER_ERROR: 500,
    },
    MESSAGES: {
      VIDEO_NOT_FOUND: 'Video not found',
      INVALID_PARAMETERS: 'Invalid parameters provided',
      AUTH_REQUIRED: 'Authentication required',
      INVALID_CREDENTIALS: 'Invalid email or password',
      USER_EXISTS: 'User already exists',
    },
    
    // Configuration constants moved to here (using environment variables if available)
    CONFIG: {
      SALT_ROUNDS: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10,
      JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
      JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
    },
  };
  