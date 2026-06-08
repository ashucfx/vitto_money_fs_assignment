const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Strict rate limiter for login route to prevent PIN brute-forcing
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { success: false, error: 'Too many login attempts. Please try again after 15 minutes.' }
});

/**
 * POST /api/auth/login
 * Simple authentication endpoint.
 * Expects { pin: '...' } in the body.
 */
router.post('/login', loginLimiter, (req, res, next) => {
  try {
    const { pin } = req.body;
    const expectedPin = process.env.AGENT_PIN || '123456';

    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN is required' });
    }

    if (pin === expectedPin) {
      // Generate a token valid for 24 hours
      const token = jwt.sign(
        { role: 'agent' },
        process.env.JWT_SECRET || 'fallback_secret_for_dev',
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        data: { token },
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Invalid PIN',
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
