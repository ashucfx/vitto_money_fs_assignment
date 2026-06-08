/**
 * Global error-handling middleware.
 *
 * Express recognises error-handling middleware by its 4-argument signature
 * (err, req, res, next). This must be registered AFTER all routes.
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[ErrorHandler]', err);

  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    errors: [message],
  });
}

module.exports = errorHandler;
