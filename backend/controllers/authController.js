const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to sign JSON Web Tokens using our encrypted environment secret
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE| '30d'
  });
};

// @desc    Register a new user profile
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    // Check if a user with this email registry index already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.statusCode = 400;
      throw new Error('An account with this email address already exists');
    }

    // Create the record (password gets securely auto-hashed in our Mongoose user schema pre-save hook)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error); // Delegate error straight to our global handler middleware
  }
};

// @desc    Authenticate user & return verification token
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // Force Mongoose to select the password field explicitly since we set select: false in the model
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.statusCode = 401;
      throw new Error('Invalid email or password credentials');
    }

    // Utilize our Mongoose instance method to evaluate the plain text password against the database hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.statusCode = 401;
      throw new Error('Invalid email or password credentials');
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user profile details
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    // req.user gets appended dynamically by our protection middleware layer
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};