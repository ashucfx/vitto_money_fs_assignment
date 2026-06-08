import { useState } from 'react';
import { trackApplication } from '../api/client';
import { Search, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Track() {
  const [refId, setRefId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!refId.trim()) {
      toast.error('Please enter a Reference ID');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await trackApplication(refId.trim());
      setResult(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to track application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container" id="track-page">
      <div className="form-card glass-panel" style={{ maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="form-card__title">Track Your Application</h1>
          <p className="form-card__subtitle">Enter your Reference ID to see live progress.</p>
        </div>

        <form onSubmit={handleTrack} className="flex-center gap-2">
          <div className="search-wrapper" style={{ flex: 1, minWidth: 0 }}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="e.g., d5f8a..."
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {result && (
          <div className="track-result mt-4" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="track-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{result.name}</h3>
              <p className="text-sm text-gray">Applied on {new Date(result.created_at).toLocaleDateString('en-IN')}</p>
            </div>

            <div className="timeline">
              {/* Step 1: Submitted */}
              <div className="timeline-item active">
                <div className="timeline-icon bg-brand"><FileText size={20} /></div>
                <div className="timeline-content">
                  <h4 style={{ color: 'var(--text-primary)' }}>Application Submitted</h4>
                  <p className="text-sm text-gray">We received your application details.</p>
                </div>
              </div>

              {/* Step 2: Under Review */}
              <div className={`timeline-item ${result.status !== 'pending' ? 'active' : 'current'}`}>
                <div className={`timeline-icon ${result.status !== 'pending' ? 'bg-brand' : 'bg-pending'}`}>
                  <Clock size={20} />
                </div>
                <div className="timeline-content">
                  <h4 style={{ color: 'var(--text-primary)' }}>Under Review</h4>
                  <p className="text-sm text-gray">
                    {result.status !== 'pending' 
                      ? 'Review completed.' 
                      : 'Our team is currently reviewing your application.'}
                  </p>
                </div>
              </div>

              {/* Step 3: Decision */}
              {result.status !== 'pending' && (
                <div className="timeline-item active">
                  <div className={`timeline-icon ${result.status === 'approved' ? 'bg-approved' : 'bg-rejected'}`}>
                    {result.status === 'approved' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div className="timeline-content">
                    <h4 style={{ color: result.status === 'approved' ? 'var(--status-approved)' : 'var(--status-rejected)' }}>
                      Application {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </h4>
                    <p className="text-sm text-gray">
                      {result.status === 'approved' 
                        ? 'Congratulations! Your loan has been approved.' 
                        : 'Unfortunately, your loan application was not approved at this time.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
