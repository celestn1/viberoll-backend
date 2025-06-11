// backend/configs/redis.js
// Sets up and exports a Redis client for caching.
const redis = require('redis');

const client = redis.createClient({ url: process.env.REDIS_URL });

// Connect to Redis and handle errors.
client.connect().catch(err => console.error('Redis connection error:', err));
client.on('error', (err) => console.error('Redis Client Error', err));

module.exports = client;
