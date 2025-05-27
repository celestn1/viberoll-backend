// backend/configs/db.js
// Configures a PostgreSQL connection using the pg library.

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const shouldUseSSL = process.env.DATABASE_URL?.includes('sslmode=require') || isProduction;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
