/**
 * Server entry point.
 *
 * Loads environment variables from .env (development only), then starts
 * the Express server on the configured PORT.
 */

require('dotenv').config();

const app  = require('./src/app');
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅  Vitto API server running on port ${port}`);
  console.log(`   Health check: http://localhost:${port}/health`);
});
