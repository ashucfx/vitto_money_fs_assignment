import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LanguageBadge from './LanguageBadge';

export default function DetailsModal({ application, onClose }) {
  if (!application) return null;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const formatAmount = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Application Details</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="detail-group">
            <label>Reference ID</label>
            <p className="monospace">{application.id}</p>
          </div>
          
          <div className="detail-grid">
            <div className="detail-group">
              <label>Applicant Name</label>
              <p>{application.name}</p>
            </div>
            <div className="detail-group">
              <label>Mobile Number</label>
              <p>{application.mobile}</p>
            </div>
            <div className="detail-group">
              <label>Loan Amount</label>
              <p className="highlight-amount">{formatAmount(application.amount)}</p>
            </div>
            <div className="detail-group">
              <label>Preferred Language</label>
              <p><LanguageBadge language={application.language} /></p>
            </div>
            <div className="detail-group">
              <label>Status</label>
              <p><StatusBadge status={application.status} /></p>
            </div>
            <div className="detail-group">
              <label>Applied On</label>
              <p>{formatDate(application.created_at)}</p>
            </div>
          </div>

          <div className="detail-group full-width">
            <label>Loan Purpose</label>
            <div className="purpose-box">
              {application.purpose}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
