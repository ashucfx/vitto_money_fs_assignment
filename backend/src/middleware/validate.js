/**
 * Input validation middleware for loan application routes.
 *
 * Each exported function validates the req.body or req.params for
 * a specific route and calls next(err) with a structured 400 error
 * if validation fails — keeping controllers clean.
 */

const VALID_LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];
const VALID_STATUSES  = ['pending', 'approved', 'rejected'];

/**
 * Validates POST /api/applications body.
 */
function validateCreateApplication(req, res, next) {
  const { name, mobile, amount, purpose, language } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name must be at least 2 characters.');
  }

  if (!mobile || !/^\d{10}$/.test(mobile.trim())) {
    errors.push('mobile must be a 10-digit number.');
  }

  const parsedAmount = parseFloat(amount);
  if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push('amount must be a positive number.');
  }

  if (!purpose || typeof purpose !== 'string' || purpose.trim().length < 3) {
    errors.push('purpose must be at least 3 characters.');
  }

  if (!language || !VALID_LANGUAGES.includes(language)) {
    errors.push(`language must be one of: ${VALID_LANGUAGES.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Normalise whitespace on string fields
  req.body.name    = name.trim();
  req.body.mobile  = mobile.trim();
  req.body.purpose = purpose.trim();

  next();
}

/**
 * Validates PATCH /api/applications/:id/status body.
 */
function validateStatusUpdate(req, res, next) {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      errors: [`status must be one of: ${VALID_STATUSES.join(', ')}.`],
    });
  }

  // Only allow transitions away from pending
  if (status === 'pending') {
    return res.status(400).json({
      success: false,
      errors: ['Cannot set status back to pending.'],
    });
  }

  next();
}

/**
 * Validates optional ?status= query param on GET /api/applications.
 */
function validateStatusFilter(req, res, next) {
  const { status } = req.query;

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      errors: [`status filter must be one of: ${VALID_STATUSES.join(', ')}.`],
    });
  }

  next();
}

module.exports = {
  validateCreateApplication,
  validateStatusUpdate,
  validateStatusFilter,
};
