// scripts/seedAdmin.js

require('dotenv').config();
const pool = require('../configs/db');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const username = process.env.ADMIN_USERNAME || 'admin';
    const plainPassword = process.env.ADMIN_PASSWORD;

    if (!email || !plainPassword) {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, Number(process.env.SALT_ROUNDS) || 10);

    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      console.log(`⚠️ Admin user already exists: ${email}`);
    } else {
      await pool.query(
        `INSERT INTO users (email, username, password, is_admin)
         VALUES ($1, $2, $3, $4)`,
        [email, username, hashedPassword, true]
      );
      console.log(`✅ Admin user created: ${email}`);
    }
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
  } finally {
    await pool.end();
  }
})();
