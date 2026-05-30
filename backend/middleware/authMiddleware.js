const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Extract the authorization token string from the standard request headers matching the format: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.statusCode = 401;
    return next(new Error('Access denied. No authentication token provided.'));
  }

  try {
    // Verify the validity of the token signature using our production secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the database user profile associated with the token payload and append it to our request object
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      res.statusCode = 401;
      return next(new Error('The user session matching this token no longer exists.'));
    }

    next(); // Pass control forward to the destination controller method
  } catch (error) {
    res.statusCode = 401;
    return next(new Error('Authentication failed. Access token is invalid or expired.'));
  }
};