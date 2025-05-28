// backend/swagger.js

require('dotenv').config();

const swaggerJsdoc = require('swagger-jsdoc');

// 1) Port for your local server
const port = process.env.PORT || 4000;

// 2) The URL that Swagger UI will use as the server.
//    In prod, set this to your ALB DNS + scheme via Terraform / ECS env.
//    In dev, it will default to localhost.
const swaggerServerUrl =
  process.env.SWAGGER_SERVER_URL ||  // e.g. "https://viberoll-alb-1234.eu-west-2.elb.amazonaws.com"
  `http://localhost:${port}`;        // fallback for local dev

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VibeRoll Backend API',
      version: '1.0.0',
      description: 'API documentation for the VibeRoll backend',
    },
    // 3) servers driven by the single env var (or localhost fallback)
    servers: [
      {
        url: swaggerServerUrl,
        description: process.env.SWAGGER_SERVER_URL
          ? 'Production (ALB)'
          : 'Local development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:   'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './controllers/*.js',
    './controllers/admin/*.js',
    './routes/*.js',
    './routes/admin/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
