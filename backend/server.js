const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const { initSipAutomationEngine } = require('./services/cronService');

// Load configurations
dotenv.config();

// Connect to Cloud Database
connectDB();

const app = express();

// ==========================================
// 🛡️ SECURITY MIDDLEWARE GATEWAYS
// ==========================================
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Sanitize query objects to defend against NoSQL injection attacks
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Defensive Rate Limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests originating from this IP address. Please try again later.'
});
app.use('/api/', rateLimiter);

// ==========================================
// 🛣️ APPLICATION ROUTING MAPS
// ==========================================
app.use('/api/funds', require('./routes/fundRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/advisor", require("./routes/advisorRoutes"));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
// Fire up the background task worker threads
initSipAutomationEngine(); 

// ==========================================
// 🛑 GLOBAL ERROR RUNTIME EXCEPTION INTERCEPTOR
// ==========================================
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Secure Production Engine active and auditing traffic on port ${PORT}`);
});