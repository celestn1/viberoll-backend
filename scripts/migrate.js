// scripts/migrate.js
require('dotenv').config();
const { Pool } = require('pg');

// Configure SSL if required
const sslConfig = process.env.PGSSLMODE === 'require'
  ? { rejectUnauthorized: false }
  : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

(async () => {
  let exitCode = 0;

  try {
    console.log('🔄 Running DB migrations...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        action VARCHAR(255),
        target_user_id INTEGER,
        target_email VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        details JSONB
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title VARCHAR(255),
        description TEXT,
        url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS video_comments (
        id SERIAL PRIMARY KEY,
        video_id INTEGER,
        user_id INTEGER,
        comment_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Migrations complete.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    exitCode = 1;
  } finally {
    try {
      await pool.end();
    } catch (closeErr) {
      console.warn('⚠️ Error closing DB pool:', closeErr.message);
    }
    process.exit(exitCode);
  }
})();