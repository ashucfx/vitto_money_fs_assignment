/**
 * Summary router — dashboard aggregate stats endpoint.
 *
 * Routes:
 *   GET /api/summary — total applications, total loan amount, count per status
 */

const express = require('express');
const pool    = require('../db/pool');

const router = express.Router();

// ─── GET /api/summary ─────────────────────────────────────────────────────────
// Returns aggregated statistics for the dashboard stats bar.
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)                                          AS total_applications,
        COALESCE(SUM(amount), 0)                          AS total_amount,
        COUNT(*) FILTER (WHERE status = 'pending')        AS pending_count,
        COUNT(*) FILTER (WHERE status = 'approved')       AS approved_count,
        COUNT(*) FILTER (WHERE status = 'rejected')       AS rejected_count
      FROM applications
    `);

    const row = result.rows[0];

    res.json({
      success: true,
      data: {
        totalApplications: parseInt(row.total_applications, 10),
        totalAmount:        parseFloat(row.total_amount),
        byStatus: {
          pending:  parseInt(row.pending_count,  10),
          approved: parseInt(row.approved_count, 10),
          rejected: parseInt(row.rejected_count, 10),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
