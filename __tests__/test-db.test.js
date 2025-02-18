// __tests__/test-db.test.js

/**
 * Mock DB Test for PostgreSQL connection.
 */

const pool = require('../configs/db');

jest.mock('../configs/db', () => ({
  query: jest.fn().mockResolvedValue({
    rows: [{ now: new Date().toISOString() }],
  }),
  end: jest.fn(),
}));

describe('PostgreSQL Connection', () => {
  test('should return current timestamp', async () => {
    const res = await pool.query('SELECT NOW()');
    expect(res.rows[0]).toHaveProperty('now');
  });
});
