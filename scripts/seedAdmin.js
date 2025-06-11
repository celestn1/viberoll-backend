// scripts/seedAdmin.js

require('dotenv').config();
const pool = require('../configs/db');
const bcrypt = require('bcrypt');

(async () => {
  let exitCode = 0;

  try {
    const email = process.env.ADMIN_EMAIL;
    const username = process.env.ADMIN_USERNAME || 'admin';
    const plainPassword = process.env.ADMIN_PASSWORD;
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

    if (!email || !plainPassword) {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
      exitCode = 1;
      return;
    }

    // hash once
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // check for existing admin
    const { rows } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (rows.length > 0) {
      console.log(`⚠️ Admin user already exists: ${email}`);
    } else {
      // insert new admin
      await pool.query(
        `INSERT INTO users (email, username, password, is_admin)
         VALUES ($1, $2, $3, $4)`,
        [email, username, hashedPassword, true]
      );
      console.log(`✅ Admin user created: ${email}`);
    }
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
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