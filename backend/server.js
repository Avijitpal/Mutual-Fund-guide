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
// 🛡️ SECURITY MIDDLEWARE GATEWAYS (CORS & HEADERS)
// ==========================================
app.use(helmet()); 

// Explicitly whitelist trusted origins to allow secure cross-origin resource sharing
const allowedOrigins = [
  'http://localhost:5173',                 // Local React + Vite development workspace
  'https://mutual-fund-guide.vercel.app'  // ◄── Double check this matches your live Vercel domain!
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server requests or API clients like Postman (which send an undefined origin)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Blocked by CORS security gateway: Origin unauthorized.'), false);
    }
  },
  credentials: true // Allows JWT authorization headers/cookies to securely pass across domains
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Sanitize incoming body parameters to defend against deep NoSQL injection attacks
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Defensive Rate Limiter: Guard infrastructure from automated brute-force attacks
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute operational evaluation window
  max: 100,                 // Caps execution limits to a maximum of 100 requests per window space
  message: 'Too many requests originating from this IP address. Please try again later.'
});
app.use('/api/', rateLimiter);

// ==========================================
// 🛣️ APPLICATION ROUTING MAPS
// ==========================================
app.use('/api/funds', require('./routes/fundRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/advisor', require('./routes/advisorRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Fire up the monthly automated SIP calculator recurring tasks
initSipAutomationEngine(); 

// ==========================================
// 🛑 GLOBAL ERROR RUNTIME EXCEPTION INTERCEPTOR
// ==========================================
// MUST be mounted dead last after all functional endpoint declarations!
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Secure Production Engine active and auditing traffic on port ${PORT}`);
});