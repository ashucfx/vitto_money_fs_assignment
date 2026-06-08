/**
 * Applications router — all 4 required API endpoints.
 *
 * Routes:
 *   POST   /api/applications            — submit a new loan application
 *   GET    /api/applications            — list all (with optional ?status= filter)
 *   PATCH  /api/applications/:id/status — update status (approved | rejected)
 *   GET    /api/summary                 — aggregated dashboard stats
 */

const express = require('express');
const pool    = require('../db/pool');
const {
  validateCreateApplication,
  validateStatusUpdate,
  validateStatusFilter,
} = require('../middleware/validate');

const router = express.Router();

// ─── POST /api/applications ──────────────────────────────────────────────────
// Submit a new loan application.
router.post('/', validateCreateApplication, async (req, res, next) => {
  const { name, mobile, amount, purpose, language } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO applications (name, mobile, amount, purpose, language)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, mobile, amount, purpose, language, status, created_at`,
      [name, mobile, parseFloat(amount), purpose, language]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/applications ───────────────────────────────────────────────────
// Return all applications, ordered latest first.
// Supports optional ?status=pending|approved|rejected query filter.
// Supports optional ?search= query for name or mobile search (bonus).
router.get('/', validateStatusFilter, async (req, res, next) => {
  const { status, search } = req.query;

  try {
    // Build query dynamically to support optional filters
    const conditions = [];
    const params     = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      conditions.push(
        `(LOWER(name) LIKE $${params.length} OR mobile LIKE $${params.length})`
      );
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const result = await pool.query(
      `SELECT id, name, mobile, amount, purpose, language, status, created_at
       FROM applications
       ${whereClause}
       ORDER BY created_at DESC`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/applications/:id/status ──────────────────────────────────────
// Update status of an application to 'approved' or 'rejected'.
router.patch('/:id/status', validateStatusUpdate, async (req, res, next) => {
  const { id }     = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE applications
       SET status = $1
       WHERE id = $2
       RETURNING id, name, mobile, amount, purpose, language, status, created_at`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        errors: ['Application not found.'],
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
