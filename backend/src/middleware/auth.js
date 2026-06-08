const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes that require agent access.
 * Checks for a valid JWT in the Authorization header.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid token format',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev');
    req.user = decoded; // Contains { role: 'agent' }
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid or expired token',
    });
  }
};

module.exports = authMiddleware;
