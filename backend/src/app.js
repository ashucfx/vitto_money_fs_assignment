/**
 * Express application setup.
 *
 * Configures middleware (CORS, JSON parsing), mounts all routes,
 * and attaches the global error handler.
 */

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const applicationsRouter = require('./routes/applications');
const summaryRouter      = require('./routes/summary');
const authRouter         = require('./routes/auth');

const app = express();

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet());

// ─── Global Rate Limiting ─────────────────────────────────────────────────────
// Limit each IP to 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { success: false, errors: ['Too many requests from this IP, please try again after 15 minutes.'] }
});
app.use('/api', globalLimiter);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from the configured frontend origin only.
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/applications', applicationsRouter);
app.use('/api/summary',      summaryRouter);
app.use('/api/auth', authRouter);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, errors: ['Route not found.'] });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
