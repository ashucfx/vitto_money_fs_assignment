/**
 * PostgreSQL connection pool.
 *
 * Reads DATABASE_URL from environment variables. Using a connection pool
 * (instead of a new client per request) keeps the app efficient under load
 * and avoids exhausting Neon / Supabase free-tier connection limits.
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon/Supabase require SSL in production; skip verify in dev if needed
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
  process.exit(1);
});

module.exports = pool;
