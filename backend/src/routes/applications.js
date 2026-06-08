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
const authMiddleware = require('../middleware/auth');

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
// Supports pagination via ?page=1&limit=10
router.get('/', authMiddleware, validateStatusFilter, async (req, res, next) => {
  const { status, search } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

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

    // We need the total count for pagination metadata
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM applications ${whereClause}`,
      params
    );
    const totalCount = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch the actual paginated data
    const dataParams = [...params, limit, offset];
    const result = await pool.query(
      `SELECT id, name, mobile, amount, purpose, language, status, created_at
       FROM applications
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      dataParams
    );

    res.json({
      success: true,
      data: result.rows,
      meta: {
        total: totalCount,
        page,
        pages: totalPages,
        limit,
      }
    });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/applications/:id/status ──────────────────────────────────────
// Update status of an application to 'approved' or 'rejected'.
router.patch('/:id/status', authMiddleware, validateStatusUpdate, async (req, res, next) => {
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

// ─── GET /api/applications/:id/track ─────────────────────────────────────────
// Public route to track application status by ID
router.get('/:id/track', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, name, status, created_at
       FROM applications
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found with that Reference ID.',
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
