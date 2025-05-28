// backend/server.js
// Main entry point for the VibeRoll Express server.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Dynamically generated Swagger spec
const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./configs/db');         // PostgreSQL pool
const redisClient = require('./configs/redis'); // Redis client

const app = express();

const logWithTimestamp = (message) => {
  console.log(`${new Date().toISOString()} [PID: ${process.pid}] ${message}`);
};

// Log the start of a new instance
logWithTimestamp('Starting new server instance.');

// Serve Swagger API docs at /api-docs using the dynamically generated spec
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Security middleware.
app.use(helmet());
// Enable CORS to allow cross-origin requests.
app.use(cors());
// Parse JSON request bodies.
app.use(express.json());
// Logging HTTP requests.
app.use(morgan('combined'));

// Rate limiting to protect against brute-force attacks.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                // Limit each IP to 100 requests per window
});
app.use(limiter);

// Mount authentication and video routes.
app.use('/auth', authRoutes);
app.use('/videos', videoRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// debug route to check environment variables and SSL settings
app.get("/debug/env", (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    SSL: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false
  });
});

// Debug route to check postgres connection
app.get('/debug/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});


// Health check route for ALB
app.get('/health', (req, res) => {
  res.sendStatus(200);
});

// Global error handler.
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  logWithTimestamp(`Server running on port ${PORT}`)
);

// Force shutdown timer reference
let forceShutdownTimer;

const shutdown = async () => {
  // Start a force shutdown timer (10 seconds)
  forceShutdownTimer = setTimeout(() => {
    logWithTimestamp('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);

  logWithTimestamp('Gracefully shutting down.');

  try {
    logWithTimestamp('Closing database pool...');
    await pool.end();
    logWithTimestamp('Database pool closed.');
  } catch (error) {
    console.error(`${new Date().toISOString()} [PID: ${process.pid}] Error closing database pool:`, error);
  }

  try {
    logWithTimestamp('Closing Redis client...');
    await redisClient.quit();
    logWithTimestamp('Redis client closed.');
  } catch (error) {
    console.error(`${new Date().toISOString()} [PID: ${process.pid}] Error closing Redis client:`, error);
  }

  // Wrap server.close in a promise to ensure it completes
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        console.error(`${new Date().toISOString()} [PID: ${process.pid}] Error closing HTTP server:`, err);
        return reject(err);
      }
      logWithTimestamp('HTTP server closed.');
      resolve();
    });
  });

  // Cancel the force shutdown timer as shutdown completed successfully.
  clearTimeout(forceShutdownTimer);
  logWithTimestamp('All connections closed. Exiting process.');
  process.exit(0);
};

// Listen for termination signals to invoke graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle nodemon restart signal (SIGUSR2) by gracefully shutting down
process.once('SIGUSR2', () => {
  logWithTimestamp('Received SIGUSR2, shutting down gracefully for nodemon restart.');
  shutdown();
  process.kill(process.pid, 'SIGUSR2');
});
