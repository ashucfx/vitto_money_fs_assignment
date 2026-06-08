/**
 * Express application setup.
 *
 * Configures middleware (CORS, JSON parsing), mounts all routes,
 * and attaches the global error handler.
 */

const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middleware/errorHandler');

const applicationsRouter = require('./routes/applications');
const summaryRouter      = require('./routes/summary');
const authRouter         = require('./routes/auth');

const app = express();

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
