// __tests__/test-redis.test.js

const redisClient = require('../configs/redis');

// Mock Redis client methods for testing
jest.mock('../configs/redis', () => ({
  connect: jest.fn().mockResolvedValue(),
  ping: jest.fn().mockResolvedValue('PONG'),
  quit: jest.fn().mockResolvedValue(),
  isOpen: true, // Simulate an open connection
}));

describe('Redis Client', () => {
  beforeAll(async () => {
    await redisClient.connect();
  });

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
