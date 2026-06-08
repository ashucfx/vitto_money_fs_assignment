import { useState, useEffect, useCallback } from 'react';
import { fetchApplications, fetchSummary, updateStatus } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import LanguageBadge from '../components/LanguageBadge';
import DetailsModal from '../components/DetailsModal';
import toast from 'react-hot-toast';
import { Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function StatsBar({ summary, loading }) {
  if (loading || !summary) return <div className="stats-bar-skeleton">Loading stats...</div>;
  const fmt = (n) => Number(n).toLocaleString('en-IN');

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-card__value">{fmt(summary.totalApplications)}</span>
        <span className="stat-card__label">Total Applications</span>
      </div>
      <div className="stat-card">
        <span className="stat-card__value">₹{fmt(summary.totalAmount)}</span>
        <span className="stat-card__label">Total Requested</span>
      </div>
      <div className="stat-card stat-card--pending">
        <span className="stat-card__value">{fmt(summary.byStatus.pending)}</span>
        <span className="stat-card__label">Pending</span>
      </div>
      <div className="stat-card stat-card--approved">
        <span className="stat-card__value">{fmt(summary.byStatus.approved)}</span>
        <span className="stat-card__label">Approved</span>
      </div>
      <div className="stat-card stat-card--rejected">
        <span className="stat-card__value">{fmt(summary.byStatus.rejected)}</span>
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
      toast.success(`Application marked as ${newStatus}`);
      onStatusChange(applicationId, newStatus);
    } catch {
      toast.error('Failed to update status.');
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
      onClick={(e) => e.stopPropagation()}
    >
      <option value="" disabled>{updating ? '...' : 'Pending ▾'}</option>
      <option value="approved">Approve</option>
      <option value="rejected">Reject</option>
    </select>
  );
}

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modals
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [appRes, sumRes] = await Promise.all([
        fetchApplications({ status: statusFilter, search: debouncedSearch, page, limit: 10 }),
        fetchSummary()
      ]);
      setApplications(appRes.data.data);
      setTotalPages(appRes.data.meta.pages);
      setSummary(sumRes.data.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error('Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, page]);

  useEffect(() => { loadData(); }, [loadData]);

  function handleStatusChange(id, newStatus) {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    loadData(); // Refresh summary stats
  }

  const exportCSV = () => {
    if (!applications.length) return toast.error('No data to export');
    const headers = ['ID,Name,Mobile,Amount,Purpose,Language,Status,Date\n'];
    const rows = applications.map(app => 
      `${app.id},"${app.name}",${app.mobile},${app.amount},"${app.purpose}",${app.language},${app.status},${app.created_at}\n`
    );
    const blob = new Blob([headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitto_applications_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    toast.success('Export downloaded!');
  };

  return (
    <main className="page-container" id="dashboard-page">
      <div className="dashboard-header-flex">
        <div>
          <h1 className="dashboard-title">Operations Dashboard</h1>
          <p className="dashboard-subtitle">Manage, analyze, and review applications</p>
        </div>
        <button onClick={exportCSV} className="btn btn-outline flex-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <StatsBar summary={summary} loading={loading && !summary} />

      {/* Analytics Section */}
      {summary?.byLanguage && summary.byLanguage.length > 0 && (
        <div className="analytics-section glass-panel">
          <h3>Preferred Languages</h3>
          <div className="chart-container" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.byLanguage} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {summary.byLanguage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar mt-4">
        <input
          type="search"
          className="search-input"
          placeholder="Search by name or mobile…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {loading && applications.length === 0 ? (
          <div className="table-skeleton">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="empty-state">No applications found.</div>
        ) : (
          <>
            <div className="table-scroll">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Amount</th>
                    <th>Language</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="table-row pointer" onClick={() => setSelectedApp(app)}>
                      <td>
                        <span className="applicant-name">{app.name}</span>
                        <div className="text-sm text-gray">{app.mobile}</div>
                      </td>
                      <td className="highlight-amount">₹{Number(app.amount).toLocaleString('en-IN')}</td>
                      <td><LanguageBadge language={app.language} /></td>
                      <td>{new Date(app.created_at).toLocaleDateString('en-IN')}</td>
                      <td>
                        <StatusDropdown applicationId={app.id} currentStatus={app.status} onStatusChange={handleStatusChange} />
                      </td>
                      <td>
                        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}>
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-bar">
                <button 
                  className="btn-icon" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft /> Prev
                </button>
                <span className="page-indicator">Page {page} of {totalPages}</span>
                <button 
                  className="btn-icon" 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedApp && <DetailsModal application={selectedApp} onClose={() => setSelectedApp(null)} />}
    </main>
  );
}
