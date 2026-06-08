/**
 * StatusBadge — coloured pill badge for application status.
 *
 * Props:
 *   status — 'pending' | 'approved' | 'rejected'
 */

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
