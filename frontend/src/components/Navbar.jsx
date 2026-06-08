/**
 * Navbar — top navigation with Vitto branding and page links.
 */

import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Re-evaluates token when route changes
  const token = localStorage.getItem('agent_token');

  const handleLogout = () => {
    localStorage.removeItem('agent_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" aria-label="Vitto Home">
          <span className="navbar__logo">Vitto</span>
          <span className="navbar__tagline">Loan Portal</span>
        </NavLink>

        <ul className="navbar__links" role="list">
          <li>
            <NavLink
              to="/track"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Track Status
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/apply"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Apply
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          {token && (
            <li>
              <button onClick={handleLogout} className="navbar__link flex-center gap-2" style={{ color: 'var(--status-rejected)' }}>
                <LogOut size={16} /> Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
