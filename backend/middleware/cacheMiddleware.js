const redisClient = require('../config/redis');

exports.cacheFunds = async (req, res, next) => {
  try {
    // Create a unique cache key based on the request URL (e.g., 'funds_list_all')
    const cacheKey = `funds_list_${req.originalUrl}`;

    // 1. Check if the dataset is already sitting in Redis memory
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('🎯 Cache HIT! Serving dataset instantly from Redis RAM.');
      // Return the cached string parsed back into a clean JSON response object
      return res.json(JSON.parse(cachedData));
    }

    // 2. Cache MISS: Data wasn't in Redis.
    console.log('💨 Cache MISS! Passing query execution control down to MongoDB Atlas.');
    
    // Intercept res.json so we can capture MongoDB's database response data before it leaves the server!
    const originalJson = res.json;
    res.json = function (data) {
      res.json = originalJson; // Reset res.json back to its normal behavior
      
      // Save a stringified copy of the database result into Redis RAM.
      // EX: 3600 sets an expiration (TTL) of 1 hour, so your data refreshes automatically!
      redisClient.setEx(cacheKey, 3600, JSON.stringify(data));
      
      // Send the data back to the user normally
      return res.json(data);
    };

    next(); // Pass control to your regular controller function to fetch from MongoDB
  } catch (error) {
    console.error('Redis Middleware Failure:', error);
    next(); // Fallback gracefully: if Redis fails, just proceed to MongoDB normally so the app doesn't crash
  }
};