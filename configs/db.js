// backend/configs/db.js
// Configures a PostgreSQL connection using the pg library.

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? {
        rejectUnauthorized: false, // Accept self-signed certs (CA should still be AWS RDS CA)
      }
    : false,
});

module.exports = pool;
