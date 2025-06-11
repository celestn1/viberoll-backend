// __tests__/test-db.test.js

/**
 * Test for PostgreSQL connection.
 */

require('dotenv').config();
const pool = require('../configs/db');

describe('PostgreSQL Connection', () => {
  afterAll(async () => {
    await pool.end();
  });

  test('should return current timestamp', async () => {
    const res = await pool.query('SELECT NOW()');
    expect(res.rows[0]).toHaveProperty('now');
  });
});
