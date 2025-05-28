// backend/swagger.js
require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');

const port    = process.env.PORT || 4001;
const albDns  = process.env.ALB_DNS;         // from ECS env
const scheme  = process.env.ALB_SCHEME      // overrideable…
  ? process.env.ALB_SCHEME.toLowerCase()
  : albDns
    ? 'http'      // default to HTTP for your ALB
    : 'http';     // local fallback

const swaggerServerUrl =
  process.env.SWAGGER_SERVER_URL           // if you want to set it directly
  || (albDns
      ? `${scheme}://${albDns}`            // e.g. "http://viberoll-alb-…"
      : `http://localhost:${port}`);       // local dev fallback

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'VibeRoll Backend API',
      version:     '1.0.0',
      description: 'API documentation for the VibeRoll backend',
    },
    servers: [
      {
        url:         swaggerServerUrl,
        description: albDns
          ? `Production (ALB over ${scheme.toUpperCase()})`
          : 'Local development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './controllers/*.js',
    './controllers/admin/*.js',
    './routes/*.js',
    './routes/admin/*.js',
  ],
};

module.exports = swaggerJsdoc(options);
