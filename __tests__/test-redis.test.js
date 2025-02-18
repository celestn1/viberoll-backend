// __tests__/test-redis.test.js

require('dotenv').config();
const redisClient = require('../configs/redis');

describe('Redis Client', () => {
  // Connect to Redis if not already connected
  beforeAll(async () => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  });

  // Close the Redis client after tests complete if it's open
  afterAll(async () => {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  test('should respond to PING with PONG', async () => {
    const pong = await redisClient.ping();
    expect(pong).toBe('PONG');
  });
});
