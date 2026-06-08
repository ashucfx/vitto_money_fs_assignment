/**
 * Summary router — dashboard aggregate stats endpoint.
 *
 * Routes:
 *   GET /api/summary — total applications, total loan amount, count per status
 */

const express = require('express');
const pool    = require('../db/pool');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/summary ─────────────────────────────────────────────────────────
// Returns aggregated statistics for the dashboard stats bar and charts.
router.get('/', authMiddleware, async (req, res, next) => {
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

    // Fetch language distribution for charts
    const langResult = await pool.query(`
      SELECT language, COUNT(*) as count
      FROM applications
      GROUP BY language
    `);

    const row = result.rows[0];
    
    // Format languages into an object or array. Let's do an array for recharts easily:
    const byLanguage = langResult.rows.map(r => ({
      name: r.language,
      value: parseInt(r.count, 10)
    }));

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
        byLanguage,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
