const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * POST /api/auth/login
 * Simple authentication endpoint.
 * Expects { pin: '...' } in the body.
 */
router.post('/login', (req, res, next) => {
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
