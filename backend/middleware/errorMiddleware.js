const errorHandler = (err, req, res, next) => {
  // Log the error trace locally on your terminal to help you debug errors instantly
  console.error(`❌ Global Error Trap: ${err.message}`);
  console.error(err.stack);

  // If a response status code hasn't been set explicitly, default to a 500 Internal Server Error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    // Hide the sensitive stack trace details when running on live production servers
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

module.exports = errorHandler;