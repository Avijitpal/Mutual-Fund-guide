const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
// Load configurations
dotenv.config();

// Connect to Cloud Database
connectDB();

const app = express();

// ==========================================
// 🛡️ SECURITY MIDDLEWARE GATEWAYS
// ==========================================
app.use(helmet()); // Mount protective headers
app.use(cors()); // Allow Cross-Origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Strip out malicious keys containing system operators ($ or .)
// Manually sanitize in-place to bypass "getter only" reassignment errors
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Defensive Rate Limiter: Prevent automated script floods or bruteforce credential attacks
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minute window frame
  max: 100, // Caps execution limits to a maximum of 100 requests per window space
  message: 'Too many requests originating from this IP address. Please try again later.'
});
app.use('/api/', rateLimiter);

// ==========================================
// 🛣️ APPLICATION ROUTING MAPS
// ==========================================
app.use('/api/funds', require('./routes/fundRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/advisor", require("./routes/advisorRoutes"));
// ==========================================
// 🛑 GLOBAL ERROR RUNTIME EXCEPTION INTERCEPTOR
// ==========================================
// MUST be mounted dead last after all your functional routes!
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Secure Production Engine active and auditing traffic on port ${PORT}`);
});