// backend/swagger.js

require('dotenv').config();

const port = process.env.PORT || 4000;
const baseUrl = process.env.HOST + port || `http://localhost:${port}`;  // this produces "http://localhost:4001"

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Sets the OpenAPI version
    info: {
      title: 'VibeRoll Backend API', // The title of your API
      version: '1.0.0', // The version number of your API
      description: 'API documentation for the VibeRoll backend', // A brief description of your API
    },
    servers: [
      {
        url: baseUrl, // Dynamically builds the URL, e.g., "http://localhost:4001"
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
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
  // Specify the locations of your API documentation in your project
  apis: [
    './controllers/*.js',
    './controllers/admin/*.js',
    './routes/*.js',
    './routes/admin/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
