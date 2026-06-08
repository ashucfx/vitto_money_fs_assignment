/**
 * Dashboard Page — applications table with stats bar, filters, and inline status update.
 *
 * Features:
 * - Stats bar (total apps, total amount, per-status counts) from GET /api/summary
 * - All applications table from GET /api/applications
 * - Status filter dropdown (pending / approved / rejected / all)
 * - Search by applicant name or mobile number (bonus)
 * - Inline status update (approved / rejected) via PATCH — no full page reload
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchApplications, fetchSummary, updateStatus } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import LanguageBadge from '../components/LanguageBadge';

function StatsBar({ summary, loading }) {
  if (loading) {
    return (
      <div className="stats-bar" aria-label="Dashboard statistics">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card stat-card--skeleton" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const fmt = (n) => Number(n).toLocaleString('en-IN');

  return (
    <div className="stats-bar" role="region" aria-label="Dashboard statistics">
      <div className="stat-card">
        <span className="stat-card__value" id="stat-total-apps">
          {fmt(summary.totalApplications)}
        </span>
        <span className="stat-card__label">Total Applications</span>
      </div>
      <div className="stat-card">
        <span className="stat-card__value" id="stat-total-amount">
          ₹{fmt(summary.totalAmount)}
        </span>
        <span className="stat-card__label">Total Amount Requested</span>
      </div>
      <div className="stat-card stat-card--pending">
        <span className="stat-card__value" id="stat-pending">
          {fmt(summary.byStatus.pending)}
        </span>
        <span className="stat-card__label">Pending</span>
      </div>
      <div className="stat-card stat-card--approved">
        <span className="stat-card__value" id="stat-approved">
          {fmt(summary.byStatus.approved)}
        </span>
        <span className="stat-card__label">Approved</span>
      </div>
      <div className="stat-card stat-card--rejected">
        <span className="stat-card__value" id="stat-rejected">
          {fmt(summary.byStatus.rejected)}
        </span>
        <span className="stat-card__label">Rejected</span>
      </div>
    </div>
  );
}

function StatusDropdown({ applicationId, currentStatus, onStatusChange }) {
  const [updating, setUpdating] = useState(false);

  if (currentStatus !== 'pending') {
    return <StatusBadge status={currentStatus} />;
  }

  async function handleChange(e) {
    const newStatus = e.target.value;
    if (!newStatus) return;

    setUpdating(true);
    try {
      await updateStatus(applicationId, newStatus);
      onStatusChange(applicationId, newStatus);
    } catch {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <select
      className="status-select"
      defaultValue=""
      onChange={handleChange}
      disabled={updating}
      aria-label="Update application status"
      id={`status-select-${applicationId}`}
    >
      <option value="" disabled>
        {updating ? 'Updating…' : 'Pending ▾'}
      </option>
      <option value="approved">Approve</option>
      <option value="rejected">Reject</option>
    </select>
  );
}

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError]               = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch summary stats
  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await fetchSummary();
      setSummary(res.data.data);
    } catch {
      // Non-critical — page still works without stats
      console.error('Failed to load summary');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Fetch applications with current filters
  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter)     params.status = statusFilter;
      if (debouncedSearch)  params.search = debouncedSearch;

      const res = await fetchApplications(params);
      setApplications(res.data.data);
    } catch {
      setError('Failed to load applications. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => { loadSummary(); }, [loadSummary]);
  useEffect(() => { loadApplications(); }, [loadApplications]);

  // Inline status update — mutate local state without full reload
  function handleStatusChange(id, newStatus) {
    setApplications((prev) =>
      prev.map((app) => app.id === id ? { ...app, status: newStatus } : app)
    );
    // Refresh summary stats to reflect new counts
    loadSummary();
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  const formatAmount = (n) =>
    `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <main className="page-container" id="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Applications Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage and review all loan applications
        </p>
      </div>

      {/* Stats Bar */}
      <StatsBar summary={summary} loading={summaryLoading} />

      {/* Filters */}
      <div className="filters-bar" role="search" aria-label="Filter applications">
        <div className="search-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            id="search-input"
            type="search"
            className="search-input"
            placeholder="Search by name or mobile…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search applications by name or mobile number"
          />
        </div>

        <select
          id="status-filter"
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert--error" role="alert">
          {error}
          <button className="btn btn--ghost btn--sm" onClick={loadApplications}>
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        {loading ? (
          <div className="table-skeleton" aria-label="Loading applications" aria-live="polite">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="table-skeleton__row" aria-hidden="true" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state" role="status">
            <span className="empty-state__icon" aria-hidden="true">📋</span>
            <p className="empty-state__text">No applications found.</p>
            {(statusFilter || searchQuery) && (
              <button
                className="btn btn--ghost"
                onClick={() => { setStatusFilter(''); setSearchQuery(''); }}
                id="clear-filters-btn"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-scroll">
            <table className="applications-table" aria-label="Loan applications">
              <thead>
                <tr>
                  <th scope="col">Applicant</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Language</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="table-row" id={`row-${app.id}`}>
                    <td className="table-cell table-cell--name">
                      <span className="applicant-name">{app.name}</span>
                    </td>
                    <td className="table-cell">{app.mobile}</td>
                    <td className="table-cell table-cell--amount">
                      {formatAmount(app.amount)}
                    </td>
                    <td className="table-cell table-cell--purpose">
                      <span className="purpose-text" title={app.purpose}>
                        {app.purpose}
                      </span>
                    </td>
                    <td className="table-cell">
                      <LanguageBadge language={app.language} />
                    </td>
                    <td className="table-cell table-cell--date">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="table-cell">
                      <StatusDropdown
                        applicationId={app.id}
                        currentStatus={app.status}
                        onStatusChange={handleStatusChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && applications.length > 0 && (
        <p className="table-count" role="status" aria-live="polite">
          Showing {applications.length} application{applications.length !== 1 ? 's' : ''}
          {statusFilter && ` · ${statusFilter}`}
          {debouncedSearch && ` · "${debouncedSearch}"`}
        </p>
      )}
    </main>
  );
}
