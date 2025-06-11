// backend/constants.js
// Shared constants for HTTP status codes, standard messages, and configuration settings.

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
  USER_NOT_FOUND: 'User not found',
  USER_DELETED: 'User deleted successfully',
  USER_RESTORED: 'User restored successfully',
},
  
  // General configuration settings
  CONFIG: {
    SALT_ROUNDS: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10,
    JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
    JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
  },

  // NFT service configuration
  NFT: {
    // The NFT contract address can be set via an environment variable for flexibility
    CONTRACT_ADDRESS: process.env.NFT_CONTRACT_ADDRESS || '0x1234567890abcdef1234567890abcdef12345678',
    // The NFT contract ABI is defined here; update as needed if the contract changes
    CONTRACT_ABI: [
      {
        inputs: [
          { internalType: 'string', name: 'tokenURI', type: 'string' }
        ],
        name: 'mint',
        outputs: [
          { internalType: 'uint256', name: '', type: 'uint256' }
        ],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]
  },

  // FFmpeg configuration options for video processing
  FFMPEG: {
    VIDEO_CODEC: '-c:v libx264',
    PRESET: '-preset fast',
    CRF: '-crf 22',
    AUDIO_CODEC: '-c:a aac'
  },

  // OpenAI configuration for tagging service
  OPENAI: {
    // The endpoint can be overridden with an environment variable if needed
    ENDPOINT: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/engines/davinci/completions'
  }
};
