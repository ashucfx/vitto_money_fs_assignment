/**
 * Navbar — top navigation with Vitto branding and page links.
 */

import { NavLink } from 'react-router-dom';

export default function Navbar() {
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
        </ul>
      </div>
    </nav>
  );
}
