const redis = require('redis');

// Configure the client connection instance
const redisClient = redis.createClient({
  // Fallback to local host port 6379 if no cloud URL environment variable is set yet
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => console.error('❌ Redis Client Connection Fault:', err));
redisClient.on('connect', () => console.log('⚡ Redis Cache Cluster connected successfully!'));

// Immediately Invoked Execution function to establish the permanent async connection channel
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;